import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as P from '../dist/planning.js';

const make=(config={},n=8)=>E.newTournament({sport:'handball',endMode:'free',courtCount:2,...config},E.makeTeams(n));
const finish=(t,m,a=5,b=2)=>E.correctScore(t,m.id,a,b);
const complete=t=>{for(let guard=0;!t.completed;guard++){assert.ok(guard<500);for(const m of E.current(t).matches)if(!E.done(m))finish(t,m);E.advance(t);}return t;};
const activeIds=t=>E.current(t).matches.filter(m=>!E.done(m)).flatMap(E.entrants);

test('Fin du chrono : le résultat attend le rapport des scores, y compris après rechargement',()=>{
 const t=make({endMode:'time',duration:15},4);E.startAll(t,1000);E.tick(t,16000);
 assert.ok(E.current(t).matches.every(m=>m.status==='awaiting_score'));
 assert.ok(E.standings(t).every(s=>s.played===0));assert.throws(()=>E.advance(t));
 const copy=JSON.parse(JSON.stringify(t)),m=E.current(copy).matches[0];E.startMatch(copy,m,17000);assert.equal(m.status,'awaiting_score');
 finish(copy,m,21,18);assert.equal(m.status,'done');assert.equal(E.standings(copy).find(s=>s.id===m.a[0]).for,21);
 assert.equal(E.current(copy).matches[1].status,'awaiting_score');
});

test('Enchaînement : adversaires libres, identifiants et résultats conservés jusqu’à la fin',()=>{
 const t=make({},8),ids=E.allMatches(t).map(m=>m.id).sort();E.startAll(t,1000);
 const first=E.current(t).matches[0],neighbor=E.current(t).matches[1];finish(t,first,15,12);
 const available=E.nextAvailableMatch(t,first.courtId);assert.ok(available);
 const busy=E.entrants(neighbor);assert.ok(E.entrants(available.match).every(id=>!busy.includes(id)));
 const candidate=available.match.id,pulled=E.pullNextMatch(t,first.courtId,2000);
 assert.equal(pulled.id,candidate);assert.equal(pulled.status,'live');assert.equal(neighbor.status,'live');assert.equal(first.scoreA,15);
 assert.equal(E.courtMatch(t,first.courtId).id,pulled.id);assert.equal(new Set(activeIds(t)).size,activeIds(t).length);
 for(let guard=0;!t.completed;guard++){
  assert.ok(guard<200);const m=E.current(t).matches.find(m=>!E.done(m));if(m)finish(t,m);
  let pulled=false;for(const c of t.courts)if(E.nextAvailableMatch(t,c.id)){E.pullNextMatch(t,c.id);pulled=true;}
  assert.equal(new Set(activeIds(t)).size,activeIds(t).length);
  if(!pulled&&E.current(t).matches.every(E.done))E.advance(t);
 }
 assert.deepEqual(E.allMatches(t).map(m=>m.id).sort(),ids);assert.ok(E.standings(t).every(s=>s.played===7));
});

test('Enchaînement : aucune rencontre si les deux futurs adversaires sont occupés',()=>{
 const t=make({},4);E.startAll(t);const m=E.current(t).matches[0];finish(t,m);
 assert.equal(E.nextAvailableMatch(t,m.courtId),null);assert.throws(()=>E.pullNextMatch(t,m.courtId),/disponible/);
 const timed=make({endMode:'time'});finish(timed,E.current(timed).matches[0]);assert.equal(E.nextAvailableMatch(timed,timed.courts[0].id),null);
});

test('Enchaînement : les arbitres des rencontres en cours restent disponibles pour leur mission',()=>{
 const t=make({referees:true},8);P.assignReferees(t);E.startAll(t);const m=E.current(t).matches[0];finish(t,m);
 const ongoing=E.current(t).matches.filter(m=>!E.done(m)),refs=ongoing.map(m=>m.refereeId).filter(Boolean),next=E.nextAvailableMatch(t,m.courtId);
 if(next)assert.ok(E.entrants(next.match).every(id=>!refs.includes(id)));
 const historical=m.refereeId;P.assignReferees(t);assert.equal(m.refereeId,historical);
});

for(const n of [5,6,7,8,9,10,12,16,17])test(`Poules puis finales : ${n} participants jouent tous le même nombre de matchs après les poules`,()=>{
 const t=complete(make({formula:'poolfinal',poolCount:Math.min(4,Math.floor(n/3)),qualifiers:2,courtCount:4},n));
 const counts=t.teams.map(x=>E.allMatches(t).filter(m=>m.phase!=='Poules'&&m.status==='done'&&E.entrants(m).includes(x.id)).length);
 assert.ok(counts.every(c=>c>0));assert.equal(new Set(counts).size,1);
 assert.equal(Object.keys(t.engine.placements).length,n);assert.equal(new Set(Object.values(t.engine.placements)).size,n);
});

test('Première rotation choisie : conserve toutes les oppositions, refuse doublons et mauvaises poules',()=>{
 for(const formula of ['rr','pools','poolfinal']){
  const t=make({formula,poolCount:2},8),all=E.allMatches(t),before=all.map(m=>m.id).sort(),m=all.at(-1);
  E.setOpeningRound(t,[{courtNumber:2,a:m.b[0],b:m.a[0]}]);
  assert.deepEqual(E.current(t).matches[0].a,m.b);assert.equal(E.current(t).matches[0].courtId,t.courts[1].id);
  assert.deepEqual(E.allMatches(t).map(m=>m.id).sort(),before);
  for(const r of t.rotations){const ids=r.matches.flatMap(E.entrants);assert.equal(new Set(ids).size,ids.length);}
 }
 const t=make({formula:'pools',poolCount:2},8),a=t.engine.groups[0].ids[0],b=t.engine.groups[1].ids[0];
 assert.throws(()=>E.setOpeningRound(t,[{courtNumber:1,a,b}]),/poule/);
 assert.throws(()=>E.setOpeningRound(make(),[{courtNumber:1,a,b:a}]),/différents/);
});

test('Nouvelle séance : la première rotation choisie emploie les nouvelles identités',()=>{
 const teams=E.makeTeams(6),t=E.newTournament({sport:'handball',formula:'rr',courtCount:2,chooseOpening:true,openingPairs:[{courtNumber:1,a:teams[0].id,b:teams[1].id}]},teams),copy=E.restartTournament(t);
 assert.deepEqual(E.current(copy).matches[0].a,[copy.teams[0].id]);assert.deepEqual(E.current(copy).matches[0].b,[copy.teams[1].id]);
 assert.ok(!E.allMatches(copy).flatMap(E.entrants).some(id=>t.teams.some(x=>x.id===id)));
});

for(const [n,rounds,min,max] of [[6,5,5,5],[7,7,6,6],[8,7,5,6]])test(`À la mêlée : fiche à ${n} élèves et points personnels 3/2/1`,()=>{
 const t=make({formula:'melee',courtCount:1,referees:true},n);P.assignReferees(t);
 assert.equal(t.rotations.length,rounds);assert.equal(t.config.drawPoints,2);assert.equal(t.config.lossPoints,1);
 const counts=t.teams.map(x=>E.allMatches(t).filter(m=>E.entrants(m).includes(x.id)).length);assert.equal(Math.min(...counts),min);assert.equal(Math.max(...counts),max);
 for(const m of E.allMatches(t)){assert.equal(m.a.length,3);assert.equal(m.b.length,3);assert.equal(new Set(E.entrants(m)).size,6);assert.equal(m.refereeIds.length,n-6);assert.ok(m.refereeIds.every(id=>!E.entrants(m).includes(id)));}
 const m=E.current(t).matches[0];finish(t,m,3,1);for(const id of m.a)assert.equal(E.standings(t).find(s=>s.id===id).points,3);for(const id of m.b)assert.equal(E.standings(t).find(s=>s.id===id).points,1);
 E.correctScore(t,m.id,2,2);for(const id of E.entrants(m))assert.equal(E.standings(t).find(s=>s.id===id).points,2);
 assert.equal(P.idoceoSheet(t).rows[0].includes('Points personnels'),true);
});

test('À la mêlée : groupes distincts, aucun double emploi et effectifs non standard équilibrés',()=>{
 for(const [n,c] of [[14,2],[24,3],[28,3],[32,4]]){
  const t=make({formula:'melee',courtCount:c,roundCount:7},n);P.assignReferees(t);
  for(const r of t.rotations){const ids=r.matches.flatMap(E.entrants);assert.equal(new Set(ids).size,ids.length);assert.equal(r.matches.length,c);}
  for(const g of t.engine.groups){const count=g.ids.map(id=>E.allMatches(t).filter(m=>E.entrants(m).includes(id)).length);assert.ok(Math.max(...count)-Math.min(...count)<=1);}
 }
 assert.throws(()=>make({formula:'melee'},5),/6 élèves/);assert.throws(()=>make({formula:'melee',sport:'badminton'},8),/collectif/);
});

test('Une première rotation complète conserve le minimum de rotations en championnat',()=>{
 for(const n of [6,7,8,23,24]){
  const t=make({courtCount:Math.floor(n/2)},n),before=E.allMatches(t).map(m=>m.id).sort(),pairs=Array.from({length:Math.floor(n/2)},(_,i)=>({courtNumber:i+1,a:t.teams[i*2].id,b:t.teams[i*2+1].id}));
  E.setOpeningRound(t,pairs);assert.equal(t.rotations.length,n%2?n:n-1);assert.deepEqual(E.allMatches(t).map(m=>m.id).sort(),before);
  for(const r of t.rotations){const ids=r.matches.flatMap(E.entrants);assert.equal(new Set(ids).size,ids.length);}
 }
});
