import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as R from '../dist/rackets.js';
import * as P from '../dist/planning.js';
import * as X from '../dist/exchange.js';
const imported=()=>X.participantsFromRows([['Nom et prénom','Numéro de terrain'],['Martin Inès',2],['Durand Léo',2],['Nguyen Zoé',1],['Diallo Adam',1],['Roy Lou',3],['Petit Jade',3]]);
const fixture=(formula='rr')=>R.prepareStart(E.newTournament({sport:'badminton',format:'single',playersPerSide:1,courtCount:3,formula,roundCount:3},R.importedTeams(imported())));
function consistent(t){for(const r of t.rotations){assert.equal(new Set(r.matches.map(m=>m.courtId)).size,r.matches.length);const players=r.matches.flatMap(E.entrants);assert.equal(new Set(players).size,players.length)}}
test('Import : les terrains de départ organisent les vraies rencontres du championnat',()=>{
 const teams=R.importedTeams(imported()),t=E.newTournament({sport:'badminton',courtCount:3},teams),ids=E.allMatches(t).map(m=>m.id).sort(),pairs=E.allMatches(t).map(m=>E.entrants(m).sort().join('|')).sort();
 R.prepareStart(t);consistent(t);assert.deepEqual(E.allMatches(t).map(m=>m.id).sort(),ids);assert.deepEqual(E.allMatches(t).map(m=>E.entrants(m).sort().join('|')).sort(),pairs);
 for(const m of E.current(t).matches){const number=t.courts.findIndex(c=>c.id===m.courtId)+1;assert.ok(E.entrants(m).every(id=>E.team(t,id).homeCourt===number))}
 assert.equal(E.allMatches(t).length,15);
});
test('Duos : joueurs du même terrain réunis, aucun élève perdu',()=>{
 const list=imported(),teams=R.importedTeams(list,2);assert.equal(teams.length,3);assert.equal(teams.flatMap(x=>x.members).length,list.length);
 for(const x of teams)assert.ok(x.members.every(p=>p.courtNumber===x.homeCourt));assert.equal(teams[0].name,'Martin Inès / Durand Léo');
 assert.throws(()=>R.importedTeams(list.slice(1),2),/compléter les duos/);assert.throws(()=>R.validateCourts(list,2),/terrain 3/);
});
test('Terrain choisi manuellement : priorité au déplacement, adversaires du tableau conservés',()=>{
 for(const formula of['rr','ladder','knockout']){
  const teams=R.importedTeams(imported());teams[0].homeCourt=3;teams[0].courtPriority=1;
  const t=E.newTournament({sport:'badminton',courtCount:3,formula},teams),ids=E.allMatches(t).map(m=>[m.id,m.a,m.b]);R.prepareStart(t);
  assert.equal(E.current(t).matches.find(m=>E.entrants(m).includes(teams[0].id)).courtId,t.courts[2].id);consistent(t);
  if(formula!=='rr')assert.deepEqual(E.allMatches(t).map(m=>[m.id,m.a,m.b]),ids);
 }
});
test('Déplacement avant le départ : échange de terrains, mêmes adversaires et identifiants',()=>{
 const t=fixture(),m=E.current(t).matches[0],before=E.allMatches(t).map(m=>[m.id,m.a,m.b]),old=m.courtId,target=t.courts.findIndex(c=>c.id!==old)+1,other=E.current(t).matches.find(x=>x.courtId===t.courts[target-1].id);
 assert.equal(R.movePlayer(t,m.a[0],target),'current');assert.equal(m.courtId,t.courts[target-1].id);assert.equal(other.courtId,old);assert.deepEqual(E.allMatches(t).map(m=>[m.id,m.a,m.b]),before);consistent(t);
});
test('Déplacement pendant le match : chrono et scores actuels préservés, prochaine rencontre déplacée',()=>{
 const t=fixture();E.startAll(t,1000);const m=E.current(t).matches[0];E.changeScore(t,m,'a',7,1200);const current=structuredClone(E.current(t)),player=m.a[0],upcoming=t.rotations.slice(1).flatMap(r=>r.matches).find(m=>E.entrants(m).includes(player)),target=t.courts.findIndex(c=>c.id!==upcoming.courtId)+1,ids=E.allMatches(t).map(m=>m.id).sort();
 assert.equal(R.movePlayer(t,player,target),'next');assert.deepEqual(E.current(t),current);assert.equal(upcoming.courtId,t.courts[target-1].id);assert.deepEqual(E.allMatches(t).map(m=>m.id).sort(),ids);consistent(t);
 const saved=JSON.parse(JSON.stringify(t));assert.equal(E.current(saved).matches[0].scoreA,7);assert.equal(E.team(saved,player).homeCourt,target);
});
test('Formule évolutive : déplacement différé appliqué à la prévision puis au tour réel',()=>{
 const t=fixture('ladder'),player=E.current(t).matches[0].a[0];E.startAll(t,1000);assert.equal(R.movePlayer(t,player,3),'pending');
 for(const m of E.current(t).matches){E.changeScore(t,m,'a',2,1100);E.finishMatch(t,m,'manual',1200)}
 const before=JSON.stringify(t),next=P.nextRotation(t);assert.equal(next.matches.find(m=>E.entrants(m).includes(player)).courtId,t.courts[2].id);assert.equal(JSON.stringify(t),before);
 E.advance(t,1300);R.applyPending(t);assert.equal(E.current(t).matches.find(m=>E.entrants(m).includes(player)).courtId,t.courts[2].id);assert.equal(t.courtMoves.length,0);consistent(t);
});
test('Terrain indisponible, absence et tournoi terminé : déplacement refusé sans résultat perdu',()=>{
 const t=fixture(),id=t.teams[0].id;t.courts[1].available=false;const before=JSON.stringify(t);assert.throws(()=>R.movePlayer(t,id,2),/disponible/);assert.equal(JSON.stringify(t),before);
 t.teams[0].active=false;assert.throws(()=>R.movePlayer(t,id,1),/absent/);t.completed=true;assert.throws(()=>R.movePlayer(t,id,1),/terminé/);
});
test('Bonus : la valeur est validée et peut atteindre l’objectif sans changer les points de victoire',()=>{
 assert.throws(()=>E.newTournament({sport:'table',scoreMode:'bonus',bonusPoints:0}),/bonus/);
 const t=E.newTournament({sport:'table',courtCount:1,scoreMode:'bonus',bonusPoints:3,endMode:'score',target:5},E.makeTeams(2)),m=E.current(t).matches[0];E.changeScore(t,m,'a',1);E.changeScore(t,m,'a',3);assert.equal(m.scoreA,4);assert.equal(m.status,'live');E.changeScore(t,m,'a',3);assert.equal(m.scoreA,7);assert.equal(m.status,'done');assert.equal(E.standings(t)[0].points,3);
});
