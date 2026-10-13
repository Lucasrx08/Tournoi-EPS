import * as E from './engine.js';
import * as R from './rackets.js';

export const ACTIVITIES=['handball','badminton','ultimate','basket','volley','futsal','table','rugby','football','custom'];
export const isIndividual=sport=>['badminton','table'].includes(sport);
export const noun=(sport,plural=false)=>isIndividual(sport)?plural?'joueurs':'joueur':plural?'équipes':'équipe';
export const safeLogo=value=>typeof value==='string'&&value.length<=350000&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)?value:'';
export const integer=(value,min,max)=>Math.max(min,Math.min(max,Math.round(Number(value)||min)));

export function teamProposals(students,courts,players,referees=false){
 students=integer(students,2,1000);courts=integer(courts,1,24);players=integer(players,1,15);
 const candidates=[];
 for(let count=2;count<=Math.min(64,Math.floor(students/players));count++){
  const minimum=Math.floor(students/count),maximum=Math.ceil(students/count);
  const sizes=Array.from({length:count},(_,i)=>minimum+(i<students%count?1:0));
  const playing=Math.min(count-count%2,courts*2),activeCourts=playing/2;
  const off=count-playing,officials=referees?Math.min(off,activeCourts):0;
  const waiting=off-officials,substitutes=students-count*players;
  const playingSubstitutes=playing*(students/count-players);
  candidates.push({id:String(count),count,players,sizes,minimum,maximum,activeCourts,waiting,officials,off,
   substitutes,maxSubstitutes:maximum-players,playingSubstitutes,
   cost:waiting*students/count*1.35+playingSubstitutes+(courts-activeCourts)*players*2+(referees?(activeCourts-officials)*players*.9:0)});
 }
 if(!candidates.length)return [];
 const frontier=candidates.filter(a=>!candidates.some(b=>b!==a&&b.activeCourts>=a.activeCourts&&b.waiting<=a.waiting&&b.maxSubstitutes<=a.maxSubstitutes&&b.officials>=a.officials&&(b.activeCourts>a.activeCourts||b.waiting<a.waiting||b.maxSubstitutes<a.maxSubstitutes||b.officials>a.officials)));
 const best=candidates.slice().sort((a,b)=>a.cost-b.cost||b.count-a.count)[0];
 const selections=[best];
 const add=x=>{if(x&&!selections.some(s=>s.count===x.count))selections.push(x)};
 if(referees)add(candidates.filter(x=>x.officials===x.activeCourts&&x.activeCourts===Math.min(courts,Math.floor(students/(players*3)))).sort((a,b)=>a.maxSubstitutes-b.maxSubstitutes||a.cost-b.cost)[0]);
 add(frontier.slice().sort((a,b)=>a.waiting-b.waiting||b.activeCourts-a.activeCourts||a.maxSubstitutes-b.maxSubstitutes)[0]);
 add(frontier.slice().sort((a,b)=>a.maxSubstitutes-b.maxSubstitutes||b.activeCourts-a.activeCourts||a.waiting-b.waiting)[0]);
 for(const x of frontier.slice().sort((a,b)=>a.cost-b.cost))if(selections.length<3)add(x);
 return selections.slice(0,3).map((x,i)=>({...x,recommended:i===0,label:i===0?'Le meilleur équilibre':x.waiting===0?'Tout le monde participe':x.maxSubstitutes===0?'Sans remplaçant':'Autre organisation'}));
}

export function syntheticParticipants(count){return Array.from({length:count},(_,i)=>({id:E.uid(),first:'Élève '+(i+1),last:'',className:'',sex:'',level:0,placeholder:true}));}

export function estimateRotations(t){
 if(['rr','pools','levels','custom','multisport'].includes(t.config.formula))return {count:t.rotations.length,estimated:false};
 const copy=structuredClone(t);copy.roundIndex=0;copy.completed=false;
 let visits=0;
 while(!copy.completed&&visits++<500){
  const r=E.current(copy);
  for(const m of r.matches){m.scoreA=1;m.scoreB=0;E.finishMatch(copy,m,'planning',0,false)}
  E.advance(copy,0);
 }
 if(visits>=500)throw Error('La formule contient trop de rotations.');
 const count=copy.rotations.length+(t.config.formula==='double'?1:0);
 return {count,estimated:['double','king','ladder','knockout','classification','poolfinal'].includes(t.config.formula)};
}

export function recommendTiming(t,availableMinutes=90,transitionSeconds=45,setupMinutes=10){
 const estimate=estimateRotations(t),rotations=Math.max(1,estimate.count);
 const seconds=(value,min,max)=>Math.max(min,Math.min(max,Math.round(Number(value)||0)));
 const budget=seconds(availableMinutes*60,60,36000);
 const transition=seconds(transitionSeconds,0,300),setup=seconds(setupMinutes*60,0,3600);
 const transitionTotal=Math.max(0,rotations-1)*transition;
 const maximum=Math.floor((budget-setup-transitionTotal)/rotations/15)*15;
 const feasible=maximum>=15;
 const recommended=feasible?Math.min(300,maximum):15;
 const values=feasible?[recommended,Math.min(480,maximum),Math.min(7200,maximum)].filter(v=>v>=15):[];
 const options=[...new Set(values)].sort((a,b)=>a-b).map(seconds=>({seconds,totalSeconds:setup+rotations*seconds+transitionTotal,remainingSeconds:budget-setup-rotations*seconds-transitionTotal}));
 return {...estimate,rotations,budget,setup,transition,transitionTotal,maximum,recommended,feasible,options};
}

export function assignReferees(t){
 const usage=new Map(t.teams.map(x=>[x.id,0]));
 for(const r of t.rotations){
  const playing=new Set(r.matches.filter(m=>m.status!=='cancelled').flatMap(E.entrants));
  const available=t.teams.filter(x=>x.active&&!playing.has(x.id));
  const assigned=new Set();
  for(const m of r.matches){
   if(!t.config.referees||m.status==='cancelled'){m.refereeId=null;continue}
   const previous=available.find(x=>x.id===m.refereeId&&!assigned.has(x.id));
   const candidate=previous??available.filter(x=>!assigned.has(x.id)).sort((a,b)=>(usage.get(a.id)||0)-(usage.get(b.id)||0)||a.name.localeCompare(b.name,'fr'))[0];
   m.refereeId=candidate?.id??null;
   if(candidate){assigned.add(candidate.id);usage.set(candidate.id,usage.get(candidate.id)+1)}
  }
 }
 // Balance remaining duties without changing a referee during or after a match.
 let changed=true,passes=0;
 while(changed&&passes++<t.teams.length){
  changed=false;
  for(const r of t.rotations.slice(t.roundIndex)){
   if(r.matches.some(m=>['live','paused','done'].includes(m.status)))continue;
   const playing=new Set(r.matches.filter(m=>m.status!=='cancelled').flatMap(E.entrants));
   const assigned=new Set(r.matches.map(m=>m.refereeId).filter(Boolean));
   for(const m of r.matches){
    if(!m.refereeId)continue;
    const candidate=t.teams.filter(x=>x.active&&!playing.has(x.id)&&!assigned.has(x.id)).sort((a,b)=>usage.get(a.id)-usage.get(b.id)||a.name.localeCompare(b.name,'fr'))[0];
    if(candidate&&usage.get(m.refereeId)-usage.get(candidate.id)>1){
     const previous=m.refereeId;assigned.delete(previous);usage.set(previous,usage.get(previous)-1);
     m.refereeId=candidate.id;assigned.add(candidate.id);usage.set(candidate.id,usage.get(candidate.id)+1);changed=true;
    }
   }
  }
 }
 return t;
}

export function nextRotation(t){
 if(t.completed)return null;
 if(t.rotations[t.roundIndex+1])return t.rotations[t.roundIndex+1];
 if(!E.current(t).matches.every(E.done))return null;
 const copy=structuredClone(t);
 if(!E.advance(copy))return null;
 R.applyPending(copy);assignReferees(copy);return E.current(copy);
}
