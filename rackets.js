// Court allocation changes places, never an opponent, a result or a participant ID.
import * as E from './engine.js';
export const playerName=p=>p.fullName||[p.first,p.last].filter(Boolean).join(' ');
export const isRacket=t=>['badminton','table'].includes(t.config.sport);
export function defaultCourts(teams,count){
 for(const [i,x] of teams.entries())if(!Number.isInteger(x.homeCourt)||x.homeCourt<1||x.homeCourt>count)x.homeCourt=Math.floor(i/2)%count+1;
}
export function importedTeams(list,playersPerSide=1){
 const groups=new Map();for(const p of list){const key=p.courtNumber??0;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p)}
 const teams=[];for(const [court,members] of groups){
  if(playersPerSide===2&&members.length%2)throw Error(`${court?'Terrain '+court:'Joueurs sans terrain'} : ajoutez un joueur pour compléter les duos.`);
  for(let i=0;i<members.length;i+=playersPerSide){const pair=members.slice(i,i+playersPerSide);teams.push({...E.makeTeams(1)[0],name:pair.map(playerName).join(' / '),members:pair,homeCourt:court||null})}
 }
 return teams;
}
export function validateCourts(list,count){
 const invalid=list.find(p=>p.courtNumber>count);if(invalid)throw Error(`${playerName(invalid)} : le terrain ${invalid.courtNumber} dépasse les ${count} terrains disponibles.`);
}
function courtNumber(t,id){return t.courts.findIndex(c=>c.id===id)+1}
export function unstarted(r){return r.clock.status==='ready'&&r.matches.every(m=>m.status==='scheduled'&&m.scoreA===0&&m.scoreB===0)}
export function prepareStart(t){
 if(!isRacket(t)||!t.teams.some(x=>x.homeCourt))return t;
 defaultCourts(t.teams,t.courts.length);
 // The complete round robin can begin with the imported court groups.
 // Other formulas keep their bracket and only place the existing oppositions.
 if(['rr','pools','levels','poolladder','levelsladder'].includes(t.config.formula)){
  const all=E.allMatches(t),used=new Set(),opening=[],courts=t.courts.filter(c=>c.available);
  const add=(m,c)=>{opening.push({...m,courtId:c.id});E.entrants(m).forEach(id=>used.add(id))};
  // A manual move wins over the automatic starting distribution.
  for(const x of t.teams.filter(x=>x.courtPriority).sort((a,b)=>b.courtPriority-a.courtPriority)){
   const c=courts.find(c=>courtNumber(t,c.id)===x.homeCourt);if(!c||used.has(x.id)||opening.some(m=>m.courtId===c.id))continue;
   const m=all.find(m=>E.entrants(m).includes(x.id)&&E.entrants(m).every(id=>!used.has(id)));if(m)add(m,c);
  }
  for(const c of courts.filter(c=>!opening.some(m=>m.courtId===c.id))){const n=courtNumber(t,c.id),m=all.find(m=>E.entrants(m).every(id=>!used.has(id)&&E.team(t,id).homeCourt===n));if(m)add(m,c)}
  for(const c of courts.filter(c=>!opening.some(m=>m.courtId===c.id))){const n=courtNumber(t,c.id),free=all.filter(m=>!opening.some(x=>x.id===m.id)&&E.entrants(m).every(id=>!used.has(id)));free.sort((a,b)=>E.entrants(b).filter(id=>E.team(t,id).homeCourt===n).length-E.entrants(a).filter(id=>E.team(t,id).homeCourt===n).length);if(free[0])add(free[0],c)}
  if(opening.length){const first={...t.rotations[0],matches:opening},remaining=all.filter(m=>!opening.some(x=>x.id===m.id));t.rotations=[first];if(remaining.length)E.schedule(t,remaining,null,first.stage)}
 }else{
  const r=E.current(t),free=t.courts.filter(c=>c.available).slice();
  const priority=m=>Math.max(0,...E.entrants(m).map(id=>E.team(t,id).courtPriority??0));
  const preference=(m,c)=>Math.max(0,...E.entrants(m).map(id=>{const x=E.team(t,id);return x.homeCourt===courtNumber(t,c.id)?x.courtPriority?1000+x.courtPriority:1:0}));
  for(const m of r.matches.slice().sort((a,b)=>priority(b)-priority(a))){free.sort((a,b)=>preference(m,b)-preference(m,a));m.courtId=free.shift().id}
 }
 return t;
}
function relocate(t,id,number,start){
 const target=t.courts[number-1];if(!target?.available)throw Error('Ce terrain est indisponible.');
 for(let i=start;i<t.rotations.length;i++){
  const r=t.rotations[i];if(!unstarted(r))continue;
  const m=r.matches.find(m=>E.entrants(m).includes(id));if(!m)continue;
  const other=r.matches.find(x=>x.courtId===target.id&&x!==m),old=m.courtId;
  m.courtId=target.id;if(other)other.courtId=old;
  return i===t.roundIndex?'current':'next';
 }
 return null;
}
export function movePlayer(t,id,number){
 if(!isRacket(t))throw Error('La répartition des joueurs concerne les sports de raquettes.');
 if(t.completed)throw Error('Ce tournoi est terminé.');
 const x=E.team(t,id);if(!x?.active)throw Error('Ce joueur est absent.');
 if(!Number.isInteger(number)||!t.courts[number-1]?.available)throw Error('Choisissez un terrain disponible.');
 const start=unstarted(E.current(t))?t.roundIndex:t.roundIndex+1;
 const result=relocate(t,id,number,start);x.homeCourt=number;
 t.courtMoves=(t.courtMoves??[]).filter(m=>m.id!==id);
 if(!result)t.courtMoves.push({id,number});
 return result??'pending';
}
export function applyPending(t){
 if(!isRacket(t)||!t.courtMoves?.length)return;
 const remaining=[];for(const m of t.courtMoves){if(!t.courts[m.number-1]?.available){remaining.push(m);continue}if(!relocate(t,m.id,m.number,t.roundIndex))remaining.push(m)}t.courtMoves=remaining;
}
export function allocations(t,next=null){
 const start=unstarted(E.current(t))?t.roundIndex:t.roundIndex+1;
 const future=t.rotations.slice(start).flatMap(r=>r.matches),preview=next?.matches??[];
 return new Map(t.teams.map(x=>{const pending=t.courtMoves?.find(m=>m.id===x.id),m=future.find(m=>E.entrants(m).includes(x.id))??preview.find(m=>E.entrants(m).includes(x.id));return [x.id,pending?.number??(m?courtNumber(t,m.courtId):x.homeCourt??1)]}));
}
