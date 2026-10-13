import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as P from '../dist/planning.js';
const tournament=(n=8,c=3,formula='rr',extra={})=>E.newTournament({courtCount:c,formula,...extra},E.makeTeams(n));
test('Propositions : élèves répartis, tailles équilibrées, indicateurs cohérents',()=>{
 for(const n of[16,23,28,31,60])for(const courts of[1,3,6])for(const players of[1,3,4,5])for(const refs of[false,true]){
  const list=P.teamProposals(n,courts,players,refs);assert.ok(list.length>=1&&list.length<=3);assert.equal(new Set(list.map(x=>x.id)).size,list.length);
  for(const p of list){assert.equal(p.sizes.reduce((a,b)=>a+b,0),n);assert.ok(p.minimum>=players);assert.ok(p.maximum-p.minimum<=1);assert.ok(p.activeCourts<=courts);assert.equal(p.off+p.activeCourts*2,p.count);assert.equal(p.waiting+p.officials,p.off);assert.equal(p.substitutes,n-p.count*players);assert.equal(p.maxSubstitutes,p.maximum-players);assert.ok(p.officials<=p.activeCourts);if(!refs)assert.equal(p.officials,0)}
 }
});
test('28 élèves, 3 terrains : 7 équipes sans remplaçant et un groupe arbitre',()=>{
 const p=P.teamProposals(28,3,4,true)[0];assert.equal(p.count,7);assert.equal(p.activeCourts,3);assert.equal(p.waiting,0);assert.equal(p.officials,1);assert.equal(p.maxSubstitutes,0);assert.deepEqual(P.teamProposals(7,3,4),[]);
});
test('Propositions : choix de compromis attente / remplaçants',()=>{
 const list=P.teamProposals(31,3,4);assert.ok(list.length>1);assert.ok(list.some(x=>x.waiting===0));assert.ok(list.some(x=>x.maxSubstitutes===1));
});
test('Prévision : toutes les formules estimées sans mutation du tournoi',()=>{
 for(const formula of Object.keys(E.FORMULAS)){
  const t=tournament(8,3,formula,formula==='custom'?{customPairs:[[0,1],[2,3],[4,5]]}:formula==='multisport'?{courtSports:['handball','basket','ultimate']}:{}),before=JSON.stringify(t),plan=P.estimateRotations(t);assert.ok(plan.count>=t.rotations.length);assert.ok(plan.count<500);assert.equal(JSON.stringify(t),before);
 }
});
test('90 minutes : matchs de 5 minutes, déplacements et installation inclus',()=>{
 const p=P.recommendTiming(tournament(6,3),90,45,10);assert.equal(p.rotations,5);assert.equal(p.recommended,300);assert.equal(p.transitionTotal,180);
 for(const option of p.options){assert.equal(option.totalSeconds,600+5*option.seconds+180);assert.ok(option.totalSeconds<=5400);assert.equal(option.remainingSeconds,5400-option.totalSeconds)}
});
test('Tournoi long : matchs raccourcis pour tenir dans le cours',()=>{
 const p=P.recommendTiming(tournament(24,12),90,45,10);assert.equal(p.rotations,23);assert.ok(p.recommended<300);assert.equal(p.recommended%15,0);assert.ok(p.feasible);assert.ok(p.options.every(x=>x.totalSeconds<=p.budget));
});
test('Cours trop court : aucune fausse proposition de durée',()=>{
 const p=P.recommendTiming(tournament(24,1),5,45,10);assert.equal(p.feasible,false);assert.deepEqual(p.options,[]);assert.ok(p.maximum<15);
});
test('Arbitres : aucun conflit, répartition équilibrée lorsque les disponibilités le permettent',()=>{
 const t=tournament(10,3,'rr',{referees:true});P.assignReferees(t);const usages=new Map(t.teams.map(x=>[x.id,0]));
 for(const r of t.rotations){const playing=new Set(r.matches.flatMap(E.entrants)),refs=r.matches.map(x=>x.refereeId);assert.equal(new Set(refs).size,refs.length);for(const id of refs){assert.ok(id);assert.ok(!playing.has(id));usages.set(id,usages.get(id)+1)}}
 assert.ok(Math.max(...usages.values())-Math.min(...usages.values())<=1);const before=JSON.stringify(t);P.assignReferees(t);assert.equal(JSON.stringify(t),before);
});
test('Arbitres : manque explicite, absences et désactivation',()=>{
 const t=tournament(7,3,'rr',{referees:true});P.assignReferees(t);assert.equal(E.current(t).matches.filter(x=>x.refereeId).length,1);assert.equal(E.current(t).matches.filter(x=>!x.refereeId).length,2);
 const ref=E.current(t).matches.find(x=>x.refereeId).refereeId;E.team(t,ref).active=false;P.assignReferees(t);assert.ok(t.rotations.every(r=>r.matches.every(x=>x.refereeId!==ref)));t.config.referees=false;P.assignReferees(t);assert.ok(t.rotations.every(r=>r.matches.every(x=>x.refereeId===null)));
});
test('Prochaine rotation dynamique : attend les résultats et conserve le tournoi',()=>{
 const t=tournament(8,3,'knockout',{referees:true});P.assignReferees(t);assert.equal(P.nextRotation(t),t.rotations[1]);while(t.roundIndex<t.rotations.length-1){for(const m of E.current(t).matches){m.scoreA=1;E.finishMatch(t,m)}E.advance(t)}
 assert.equal(P.nextRotation(t),null);for(const m of E.current(t).matches){m.scoreA=1;E.finishMatch(t,m)}const before=JSON.stringify(t),next=P.nextRotation(t);assert.ok(next);assert.ok(next.matches.length);assert.equal(JSON.stringify(t),before);
 const expected=structuredClone(t);E.advance(expected);P.assignReferees(expected);assert.deepEqual(next.matches.map(m=>[m.a,m.b,m.refereeId]),E.current(expected).matches.map(m=>[m.a,m.b,m.refereeId]));
});
test('Logos : raster validé, URL et SVG rejetés',()=>{
 assert.equal(P.safeLogo('data:image/png;base64,YQ=='),'data:image/png;base64,YQ==');for(const x of['https://example.test/logo.png','javascript:alert(1)','data:image/svg+xml;base64,YQ==','data:image/png;base64,'+'a'.repeat(350001),null])assert.equal(P.safeLogo(x),'');
});

test('Budget précis : secondes du cours, de l’échauffement et des transitions',()=>{
 const p=P.recommendTiming(tournament(6,3),5427/60,73,619/60);assert.equal(p.budget,5427);assert.equal(p.setup,619);assert.equal(p.transitionTotal,292);
 for(const option of p.options){assert.equal(option.totalSeconds,619+5*option.seconds+292);assert.equal(option.remainingSeconds,5427-option.totalSeconds);assert.ok(option.totalSeconds<=5427)}
});
