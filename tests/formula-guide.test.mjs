import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../dist/formula-guide.js';
import * as E from '../dist/engine.js';
test('Chaque formule possède un exemple et toutes les formules sont accessibles',()=>{
 assert.deepEqual(Object.keys(F.GUIDES).sort(),Object.keys(E.FORMULAS).sort());
 const categories=F.CATEGORIES.flatMap(x=>x.ids);assert.equal(new Set(categories).size,categories.length);assert.deepEqual(categories.sort(),Object.keys(E.FORMULAS).filter(x=>x!=='multisport').sort());
 for(const id of Object.keys(E.FORMULAS)){const g=F.guide(id);for(const key of ['name','short','goal','how','result','example'])assert.ok(g[key].length>10,id+' '+key);assert.equal(g.steps.length,3);assert.ok(g.steps.every(row=>row.length===2&&row.every(Boolean)));}
});
test('Les exemples à huit correspondent aux vrais matchs du championnat et du tableau',()=>{
 for(const [formula,perPlayer,total] of [['rr',7,28],['classification',3,12]]){
  const t=E.newTournament({sport:'handball',formula,courtCount:4,endMode:'free'},E.makeTeams(8));
  let safety=0;while(!t.completed){assert.ok(safety++<20);for(const m of E.current(t).matches)E.correctScore(t,m.id,3,1);E.advance(t);}
  const played=E.standings(t).map(x=>x.played);assert.ok(played.every(x=>x===perPlayer));assert.equal(E.allMatches(t).length,total);
 }
 assert.match(F.guide('rr').example,/7 matchs/);assert.match(F.guide('classification').example,/3 matchs/);
});
test('Les explications raquettes emploient joueurs et distinguent la séance suivante',()=>{
 const racket=F.guide('rr',true);assert.ok(!JSON.stringify(racket).includes('équipes'));assert.ok(racket.how.includes('chacun'));
 assert.match(F.guide('levelsladder').result,/ne se font pas après chaque match/);assert.match(F.guide('knockout').result,/ne garantit pas le même nombre/);
});
test('Un changement de terrain propose seulement les places libres et conserve le match',()=>{
 const t=E.newTournament({sport:'handball',courtCount:3,sync:'independent',endMode:'time',duration:300},E.makeTeams(4)),m=E.current(t).matches[0],other=E.current(t).matches[1],free=t.courts.find(c=>!E.current(t).matches.some(m=>m.courtId===c.id));
 E.startMatch(t,m,1000);E.changeScore(t,m,'a',2,2000);const before=structuredClone(m);assert.deepEqual(E.availableMatchCourts(t,m).map(x=>x.id),[free.id]);
 E.moveMatch(t,m,free.id);assert.equal(m.courtId,free.id);for(const key of ['id','a','b','scoreA','scoreB','pointLog','clock','status'])assert.deepEqual(m[key],before[key]);
 assert.equal(E.courtMatch(t,free.id),m);assert.equal(E.courtMatch(t,before.courtId),undefined);assert.throws(()=>E.moveMatch(t,m,other.courtId),/occupé/);
 E.correctScore(t,m.id,3,1);assert.deepEqual(E.availableMatchCourts(t,m),[]);assert.throws(()=>E.moveMatch(t,m,before.courtId),/non terminée/);
});
