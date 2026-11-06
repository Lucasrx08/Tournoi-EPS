import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as G from '../dist/pools.js';
import * as L from '../dist/rosters.js';
import * as P from '../dist/planning.js';
import * as R from '../dist/rackets.js';

const finish=(t,m,a=21,b=10)=>{m.scoreA=a;m.scoreB=b;E.finishMatch(t,m,'manual',0,false);};
test('Composition : chaque formule de poules respecte les participants choisis',()=>{
 const teams=E.makeTeams(11),first=G.arrange(teams,[3,4,4]),moved=G.move(first,first[1][0],2);
 G.validate(moved,teams,[3,3,5]);assert.equal(new Set(moved.flat()).size,11);
 for(const sport of ['badminton','table','handball'])for(const formula of G.FORMULAS){const t=E.newTournament({sport,formula,poolCount:3,poolSizes:[3,3,5],poolAssignments:moved,qualifiers:2},teams);assert.deepEqual(t.engine.groups.map(g=>g.ids),moved);for(const m of E.allMatches(t))assert.ok(t.engine.groups.some(g=>E.entrants(m).every(id=>g.ids.includes(id))));}
 assert.throws(()=>G.validate([moved[0],moved[1],moved[1]],teams),/une seule poule/);
 const resized=G.arrange(teams,[4,3,4],false,moved);G.validate(resized,teams,[4,3,4]);assert.deepEqual(resized[0].slice(0,3),moved[0]);
});
test('Montées/descentes : un champion de poule inférieure ne remplace pas le rang local',()=>{
 const teams=E.makeTeams(6),t=E.newTournament({sport:'badminton',formula:'levelsladder',poolCount:2,poolSizes:[3,3],courtCount:3},teams);
 while(!t.completed){for(const m of E.current(t).matches)finish(t,m,m.group.startsWith('Niveau 1')?2:21,0);E.advance(t);}
 const before=JSON.stringify(t),local=t.engine.groups.map(g=>E.poolStandings(t,g)),plan=E.promotionPlan(t);
 assert.equal(E.standings(t)[0].id,local[1][0].id); // A general rank would give a different order.
 assert.ok(plan.groups[0].ids.includes(local[1][0].id));assert.ok(plan.groups[1].ids.includes(local[0][2].id));assert.ok(plan.groups[0].ids.includes(local[0][1].id));assert.ok(plan.groups[1].ids.includes(local[1][1].id));
 const fresh=E.freshTeams(t,true);assert.equal(fresh[0].sourceTeamId,local[0][0].id);assert.equal(fresh[0].seedPoolRank,1);assert.equal(fresh[0].seedPoolLevel,1);assert.equal(JSON.stringify(t),before);
});
test('Poules puis finales : les phases finales ne changent ni le rang de poule ni la promotion',()=>{
 const t=E.newTournament({sport:'table',formula:'poolfinal',poolCount:2,poolSizes:[4,4],courtCount:4,qualifiers:2},E.makeTeams(8));let local;
 for(let guard=0;!t.completed;guard++){assert.ok(guard<30);for(const m of E.current(t).matches)finish(t,m,t.engine.phase==='main'?21:1,t.engine.phase==='main'?10:21);if(t.engine.phase==='main')local=t.engine.groups.map(g=>E.poolStandings(t,g));E.advance(t);}
 assert.deepEqual(t.engine.groups.map(g=>E.poolStandings(t,g)),local);
 const plan=E.promotionPlan(t);assert.ok(plan.groups[0].ids.includes(local[1][0].id));assert.ok(plan.groups[1].ids.includes(local[0].at(-1).id));
 const sheet=P.idoceoSheet(t);assert.ok(!sheet.rows[0].includes('Classement général'));assert.ok(sheet.rows[0].includes('Rang dans la poule'));assert.equal(sheet.rows.length,9);assert.ok(sheet.rows.slice(1).every(row=>row.length===sheet.rows[0].length));
});
test('Listes : identités stables, noms modifiés et élèves omis conservés entre séances',()=>{
 const data={events:[],rosters:[]},teams=R.importedTeams([{id:'p1',fullName:'Inès Martin'},{id:'p2',fullName:'Léo Durand'},{id:'p3',fullName:'Lou Roy'}]);
 const list=L.saveList(data,teams,'3e Gaudi');assert.equal(list.players.length,3);assert.ok(teams.every(t=>t.members[0].studentId));
 const loaded=R.importedTeams(L.participants(list));loaded[0].name='Inès MARTIN';loaded[0].nameEdited=true;
 const update=L.saveList(data,loaded.slice(0,2),'3e Gaudi',list.id);assert.equal(data.rosters.length,1);assert.equal(update.players.length,3);assert.equal(update.players[0].fullName,'Inès MARTIN');
 assert.deepEqual(update.players.map(p=>p.id),list.players.map(p=>p.id));assert.ok(L.validLists(JSON.parse(JSON.stringify(data.rosters))));
 data.events=[];assert.equal(L.participants(data.rosters[0]).length,3);
});
test('Listes : les duos redeviennent des élèves réutilisables en simple',()=>{
 const pupils=Array.from({length:6},(_,i)=>({id:'p'+i,fullName:'Prénom '+i})),duos=R.importedTeams(pupils,2),data={};
 const list=L.saveList(data,duos,'Double');assert.equal(list.players.length,6);assert.equal(R.importedTeams(L.participants(list),1).length,6);
 assert.throws(()=>L.saveList(data,duos,' '),/nom/);assert.equal(L.validLists([{id:'x',title:'X',players:[{id:'a',fullName:'A'},{id:'a',fullName:'B'}]}]),false);
 const merged=L.mergeLists(data.rosters,[{...list,title:'Nom restauré',updatedAt:list.updatedAt+1}]);assert.equal(merged.length,1);assert.equal(merged[0].title,'Nom restauré');assert.equal(merged[0].players.length,6);
});
test('File commune : une rencontre prévue ailleurs démarre sur le terrain 8, sans double emploi',()=>{
 const t=E.newTournament({sport:'handball',formula:'rr',courtCount:8,endMode:'free',sync:'independent'},E.makeTeams(20)),all=E.allMatches(t).map(m=>m.id).sort();E.startAll(t,1000);
 const target=t.courts[7],m=E.courtMatch(t,target.id),neighbors=E.current(t).matches.filter(x=>x!==m);finish(t,m,8,4);
 const candidate=E.waitingMatches(t).find(x=>x.match.courtId!==target.id&&x.courts.some(c=>c.id===target.id));assert.ok(candidate);
 assert.throws(()=>E.pullWaitingMatch(t,candidate.match.id,neighbors[0].courtId),/ne peut pas démarrer/);
 const id=candidate.match.id,origin=candidate.rotation.number,started=E.pullWaitingMatch(t,id,target.id,2000);assert.equal(started.id,id);assert.equal(started.courtId,target.id);assert.equal(started.originNumber,origin);assert.equal(E.courtMatch(t,target.id).id,id);assert.ok(neighbors.every(x=>x.status==='live'));assert.equal(m.scoreA,8);
 const active=E.current(t).matches.filter(x=>!E.done(x)).flatMap(E.entrants);assert.equal(new Set(active).size,active.length);assert.deepEqual(E.allMatches(t).map(m=>m.id).sort(),all);
});
test('File commune : le score attendu occupe les joueurs et le terrain ; chronos indépendants acceptés',()=>{
 const t=E.newTournament({sport:'table',courtCount:2,endMode:'time',sync:'independent'},E.makeTeams(8));E.startAll(t,1000);const m=E.current(t).matches[0];E.awaitScore(t,m,2000);
 assert.ok(E.waitingMatches(t).every(x=>!x.courts.some(c=>c.id===m.courtId)));finish(t,m);assert.ok(E.nextAvailableMatch(t,m.courtId));const started=E.pullNextMatch(t,m.courtId,3000);assert.equal(started.clock.status,'running');
 const common=E.newTournament({endMode:'time',sync:'common'},E.makeTeams(8));assert.equal(E.usesWaitingQueue(common),false);assert.deepEqual(E.waitingMatches(common),[]);
});

test('Réimporter la même classe conserve les identités des élèves sans doublon',()=>{
 const data={},first=R.importedTeams([{id:'first-a',fullName:'Alice Martin'},{id:'first-b',fullName:'Benoît Roy'}]),list=L.saveList(data,first,'Classe');
 const imported=R.importedTeams([{id:'new-a',fullName:'Alice Martin'},{id:'new-b',fullName:'Benoît Roy'}]),next=L.saveList(data,imported,'Classe',list.id);
 assert.equal(next.players.length,2);assert.deepEqual(next.players.map(p=>p.id),list.players.map(p=>p.id));assert.deepEqual(imported.map(t=>t.members[0].studentId),list.players.map(p=>p.id));
});

test('Propositions par terrain : distinctes, renouvelées après un départ et sans modifier le calendrier',()=>{
 const t=E.newTournament({sport:'badminton',formula:'pools',poolCount:2,courtCount:3,endMode:'score',sync:'independent'},E.makeTeams(16));
 E.startAll(t,1000);for(const m of E.current(t).matches)finish(t,m);
 const before=JSON.stringify(t),suggestions=E.courtSuggestions(t);assert.equal(suggestions.size,3);assert.equal(JSON.stringify(t),before);
 const pupils=[...suggestions.values()].flatMap(x=>E.entrants(x.match));assert.equal(new Set(pupils).size,pupils.length);
 const [court,entry]=suggestions.entries().next().value,started=E.pullWaitingMatch(t,entry.match.id,court,2000);
 const refreshed=E.courtSuggestions(t);assert.equal(refreshed.has(court),false);assert.equal(refreshed.size,2);assert.ok([...refreshed.values()].every(x=>!E.entrants(x.match).some(id=>E.entrants(started).includes(id))));
 finish(t,started);assert.ok(E.courtSuggestions(t).has(court));
});
test('Propositions : attendre le score final et conserver les départs communs',()=>{
 const t=E.newTournament({sport:'table',courtCount:2,endMode:'time',sync:'independent'},E.makeTeams(8));E.startAll(t,1000);
 const m=E.current(t).matches[0];E.awaitScore(t,m,2000);assert.equal(E.courtSuggestions(t).has(m.courtId),false);
 finish(t,m);assert.equal(E.courtSuggestions(t).has(m.courtId),true);
 assert.equal(E.courtSuggestions(E.newTournament({endMode:'time',sync:'common'},E.makeTeams(8))).size,0);
});

for(const formula of G.FORMULAS)for(const sport of ['handball','badminton'])test(`Aller-retour ${formula} / ${sport} : deux matchs inversés par adversaire dans sa poule`,()=>{
 const teams=E.makeTeams(8),cfg={sport,formula,poolCount:2,poolSizes:[4,4],courtCount:2},single=E.newTournament(cfg,teams),t=E.newTournament({...cfg,poolLegs:2},teams);
 assert.equal(E.allMatches(t).length,2*E.allMatches(single).length);
 for(const g of t.engine.groups)for(let i=0;i<g.ids.length;i++)for(let j=i+1;j<g.ids.length;j++){
 const a=g.ids[i],b=g.ids[j],matches=E.allMatches(t).filter(m=>E.entrants(m).includes(a)&&E.entrants(m).includes(b));assert.equal(matches.length,2);assert.deepEqual(matches[0].a,matches[1].b);assert.deepEqual(matches[0].b,matches[1].a);
 }
 assert.equal(E.restartTournament(t).config.poolLegs,2);
});
test('Aller-retour : les phases finales restent identiques et attendent tous les retours',()=>{
 const play=legs=>{const t=E.newTournament({sport:'handball',formula:'poolfinal',poolCount:2,courtCount:4,poolLegs:legs},E.makeTeams(8));let guard=0;while(!t.completed){assert.ok(guard++<100);for(const m of E.current(t).matches)finish(t,m,3,1);E.advance(t);}return t;};
 const a=play(1),b=play(2);assert.equal(E.allMatches(b).filter(m=>m.phase==='Poules').length,24);assert.equal(E.allMatches(a).filter(m=>m.phase!=='Poules').length,E.allMatches(b).filter(m=>m.phase!=='Poules').length);
});
