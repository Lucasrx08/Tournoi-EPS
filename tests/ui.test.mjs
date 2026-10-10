import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import * as E from '../dist/engine.js';
import * as X from '../dist/exchange.js';
import * as P from '../dist/planning.js';
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .+;\n/gm,'');
const plain=v=>JSON.parse(JSON.stringify(v));
function runtime(snapshot,backup){
 const memory=new Map(),session=new Map(),nodes=new Map(),listeners=new Map(),spoken=[];
 if(snapshot)memory.set('EPS_TOURNOIS_V1',snapshot);if(backup)memory.set('EPS_TOURNOIS_V1_BACKUP',backup);
 function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},showModal(){this.open=true},close(){this.open=false},getBoundingClientRect(){return {left:0,right:1000,top:0,bottom:1000}}});return nodes.get(id)}
 const storage=map=>({getItem:key=>map.get(key)??null,setItem:(key,v)=>map.set(key,String(v)),removeItem:key=>map.delete(key)});
 const ctx={E,X,P,crypto:webcrypto,console,structuredClone,TextEncoder,Uint8Array,URL,URLSearchParams,Date,Blob,Map,Set,Number,JSON,Math,Promise,String,Array,RegExp,Error,atob,btoa,localStorage:storage(memory),sessionStorage:storage(session),location:{search:'',href:'https://example.test/',pathname:'/'},navigator:{},document:{getElementById:node,querySelector(){return null},addEventListener:(type,cb)=>listeners.set(type,cb),visibilityState:'visible',documentElement:{requestFullscreen:async()=>{}}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,addEventListener(){},scrollTo(){},confirm:()=>true,window:{},audioContext:null,speechSynthesis:{getVoices:()=>[{lang:'fr-FR'}],cancel(){},speak:speech=>spoken.push(speech)},SpeechSynthesisUtterance:class{constructor(text){this.text=text}}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 return {ctx,node,memory,spoken,run:s=>vm.runInContext(s,ctx),html:()=>node('app').innerHTML,action:(name,dataset={})=>ctx.action(name,{dataset}),change:target=>listeners.get('change')({target:{hasAttribute:()=>false,...target}}),input:target=>listeners.get('input')({target})};
}
function fixture(sport,n,c,config={}){const t=E.newTournament({sport,courtCount:c,format:E.SPORTS[sport].formats[0][0],...config},E.makeTeams(n));return {id:E.uid(),title:'Test EPS',tournaments:[t],selectedId:t.id,pinHash:null,pinSalt:'salt',studentScores:false,audio:{enabled:false,volume:.5,sound:'buzzer',start:false,alert30:false},createdAt:0}}
function snapshot(e){return JSON.stringify({schema:1,events:[e],activeId:e.id,updatedAt:0,revision:0})}
function open(r,e){r.ctx.fixture=e;r.run("data.events=[normalizeEvent(fixture)];data.activeId=fixture.id;view='tournament';render()")}
async function next(r){await r.action('wizard-next')}
test('Accueil : dix activités, anciens raccourcis et sports retirés absents',()=>{
 const r=runtime();assert.equal((r.html().match(/data-action="pick-activity"/g)??[]).length,10);
 for(const text of['Prêt à jouer','Où je joue','Écran TV','data-id="tennis"','data-id="hockey"'])assert.ok(!r.html().includes(text));
 assert.ok(r.html().includes('Tennis de table'));assert.ok(r.html().includes('On joue'));
});
for(const[sport,n,c]of[['basket',4,1],['basket',8,4],['handball',6,3],['badminton',18,9],['table',24,12],['basket',48,24]])test('Vue '+sport+' : '+c+' terrains et prochaines rotations',()=>{
 const r=runtime();open(r,fixture(sport,n,c));assert.equal((r.html().match(/<article class="court-card/g)??[]).length,c);
 assert.ok(r.html().includes('PROCHAINE ROTATION'));assert.ok(r.html().includes('ENSUITE'));
 for(const text of['Où je joue','ÉQUIPES AU REPOS','data-action="tv"','undefined','NaN'])assert.ok(!r.html().includes(text));
 const next=r.run('P.nextRotation(tourney())');for(const m of next.matches)assert.ok(r.html().includes(E.label(r.run('tourney()'),m.a)));
});
test('Création complète : répartition, identités, timing, jeu et reprise',async()=>{
 const r=runtime();await r.action('pick-activity',{id:'basket'});assert.equal(r.run('draft.step'),1);
 assert.ok(r.html().includes('Joueurs par équipe sur le terrain'));assert.ok(!r.html().includes('3 contre 3'));
 await next(r);await r.action('roster-mode',{id:'auto'});await r.action('toggle-referees');await r.action('proposal',{id:r.run('proposals()[0].id')});
 assert.equal(r.run('draft.teams.reduce((n,x)=>n+x.members.length,0)'),28);assert.equal(r.run('draft.teams.length'),7);await next(r);
 r.input({dataset:{teamName:'0'},value:'Les Comètes'});await r.change({dataset:{teamColor:'0'},value:'#ffcc00'});
 r.run("draft.teams[0].logo='data:image/png;base64,YQ==';render()");assert.ok(r.html().includes('data:image/png;base64,YQ=='));
 await next(r);assert.ok(r.html().includes('formula-art'));assert.ok(!r.html().includes('<select'));
 await next(r);assert.equal(r.run('draftCfg().duration'),300);assert.ok(r.html().includes('Scores + déplacement'));
 await next(r);assert.ok(r.html().includes('Ensemble'));assert.ok(!r.html().includes('<select'));
 await next(r);assert.ok(r.html().includes('8 sur 8'));assert.equal(r.node('toast').textContent,'');
 await r.action('create');assert.ok(r.html().includes('Rotation <b>1</b>'));assert.equal(r.run('tourney().teams[0].name'),'Les Comètes');assert.equal(r.run('tourney().config.referees'),true);
 await r.action('start');assert.equal(r.spoken.at(-1).text,'Jouez !');
 const match=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match,side:'a',delta:'1'});await r.action('pause');assert.equal(r.run('E.current(tourney()).clock.status'),'paused');
 const restored=runtime(r.memory.get('EPS_TOURNOIS_V1'));assert.equal(restored.run('E.current(tourney()).matches[0].scoreA'),1);assert.equal(restored.run('tourney().teams[0].logo'),'data:image/png;base64,YQ==');
 await r.action('finish-all');assert.equal(r.spoken.at(-1).text,'Fin des matchs !');await r.action('advance');assert.equal(r.run('tourney().roundIndex'),1);
});
test('Création : choix d’effectif et identités uniques obligatoires',async()=>{
 const r=runtime();r.run('newDraft()');await next(r);await assert.rejects(next(r),/Choisissez/);await r.action('roster-mode',{id:'auto'});await assert.rejects(next(r),/proposition/);
 await r.action('proposal',{id:r.run('proposals()[0].id')});await next(r);r.run('draft.teams[1].name=draft.teams[0].name');await assert.rejects(next(r),/différents/);assert.equal(r.run('draft.step'),3);
});
test('Nombres : bornes, fractions et proposition invalidée',async()=>{
 const r=runtime();r.run('newDraft()');await r.change({dataset:{field:'courtCount'},value:'1000'});assert.equal(r.run('draftCfg().courtCount'),24);
 await r.change({dataset:{field:'courtCount'},value:'3'});await next(r);await r.action('roster-mode',{id:'auto'});await r.action('proposal',{id:r.run('proposals()[0].id')});
 await r.change({dataset:{field:'studentCount'},value:'29'});assert.equal(r.run('draft.proposal'),null);assert.equal(r.run('draft.participants.length'),0);
 await r.action('proposal',{id:r.run('proposals()[0].id')});r.run('draft.step=5;render()');await r.change({dataset:{field:'minutes'},value:'2.5'});assert.equal(r.run('draftCfg().duration'),150);
 await r.action('number-step',{fieldName:'minutes',delta:'1'});assert.equal(r.run('draftCfg().duration'),165);
});
test('Temps : séance trop longue bloquée avant le départ',async()=>{
 const r=runtime();r.run("newDraft();draft.mode='existing';draft.step=5;draftCfg().duration=7200;render()");await assert.rejects(next(r),/dépasse/);assert.equal(r.run('draft.step'),5);
 await r.change({dataset:{field:'availableMinutes'},value:'5'});await assert.rejects(next(r),/dépasse/);await r.action('end-mode',{id:'score'});await next(r);assert.equal(r.run('draft.step'),6);
});
test('Raquettes : joueurs en simple, duos en double, noms importés',async()=>{
 for(const sport of['badminton','table']){
  const r=runtime();await r.action('pick-activity',{id:sport});await next(r);await r.action('roster-mode',{id:'auto'});await r.change({dataset:{field:'studentCount'},value:'18'});await r.action('proposal',{id:r.run('proposals()[0].id')});
  assert.equal(r.run('draft.count'),18);assert.ok(r.run('draft.teams.every(x=>x.members.length===1)'));await next(r);assert.ok(r.html().includes('Vos joueurs'));assert.ok(!r.html().includes('Équipe'));
  r.ctx.imported=X.participantsFromRows([['Prénom','Nom'],['Inès','Martin'],['Léo','Durand']]);r.run('applyParticipants(imported)');assert.deepEqual(plain(r.run('draft.teams.map(x=>x.name)')),['Inès Martin','Léo Durand']);
  await r.change({dataset:{field:'playersPerSide'},value:'2'});r.run('draft.step=2;render()');assert.ok(r.html().includes('Nombre de duos'));
 }
});
test('Partenaires tournants : quatre joueurs constituent un vrai double',async()=>{
 const r=runtime();r.run("newDraft('badminton');resizeTeams(8);draft.mode='existing';draft.step=4;render()");await r.action('formula-choice',{id:'americano'});const t=r.run('draftTournament()');assert.equal(t.config.playersPerSide,2);
 for(const m of E.current(t).matches){assert.equal(m.a.length,2);assert.equal(m.b.length,2)}
 r.run("newDraft('basket');draft.step=4;render()");await assert.rejects(r.action('formula-choice',{id:'americano'}),/individuels/);
});
test('Arbitres : noms affichés, saisie limitée au terrain choisi',async()=>{
 const r=runtime();open(r,fixture('handball',9,3,{referees:true}));assert.ok(r.html().includes('Arbitre :'));const refs=r.run('E.current(tourney()).matches.map(m=>m.refereeId)');for(const id of refs)assert.ok(r.html().includes(E.team(r.run('tourney()'),id).name));
 r.run("role='referee';refCourtId=tourney().courts[0].id;render()");assert.equal((r.html().match(/<article class="court-card/g)??[]).length,1);
 const other=r.run('E.current(tourney()).matches.find(m=>m.courtId!==refCourtId).id');await r.action('score',{match:other,side:'a',delta:'1'});r.ctx.other=other;assert.equal(r.run('findMatch(other).scoreA'),0);
});
test('Élève : lecture seule et gestion refusée',async()=>{
 const r=runtime();open(r,fixture('handball',6,3));r.run("role='student';render()");for(const action of['start','score','settings'])assert.ok(!r.html().includes('data-action="'+action+'"'));
 await assert.rejects(r.action('pause'),/enseignant/);assert.equal(r.run('E.current(tourney()).clock.status'),'ready');
});
test('Annonces françaises et silence respecté',async()=>{
 const r=runtime();open(r,fixture('basket',6,3));await r.run("sound('start')");assert.equal(r.spoken.length,0);r.run("event().audio.enabled=true");await r.run("sound('start')");await r.run("sound('end')");await r.run("sound('match-end')");
 assert.deepEqual(r.spoken.map(x=>x.text),['Jouez !','Fin des matchs !','Fin du match !']);assert.ok(r.spoken.every(x=>x.lang==='fr-FR'));
});
test('Ancienne sauvegarde : scores, joueurs et préférence silence conservés',()=>{
 const e=fixture('badminton',4,2);e.tournaments[0].rotations[0].matches[0].scoreA=8;const r=runtime(snapshot(e));r.run("view='tournament';render()");assert.equal(r.run('E.current(tourney()).matches[0].scoreA'),8);
 assert.equal(r.run('event().audio.enabled'),false);assert.equal(r.run('event().audio.sound'),'voice');assert.equal(r.run('tourney().teams[0].name'),'Joueur 1');r.run('stats()');assert.ok(!r.node('modal').innerHTML.includes('Équipe'));assert.ok(r.run("sheets(tourney())[1].name==='Joueurs'"));
 const fallback=runtime('{invalide',snapshot(e));assert.equal(fallback.run('data.events.length'),1);
});
test('Restauration JSON : migration immédiate des anciens sons et noms',async()=>{
 const r=runtime(),text=snapshot(fixture('table',4,2));r.ctx.file={size:text.length,text:async()=>text};await r.run('restoreFile(file)');assert.equal(r.run('event().audio.sound'),'voice');assert.equal(r.run('tourney().teams[0].name'),'Joueur 1');
});
test('Ancien multisport : activités et export général conservés',()=>{
 const e=fixture('basket',6,3),other=E.newTournament({sport:'handball',courtCount:3,endMode:'score'},e.tournaments[0].teams);e.tournaments.push(other);const r=runtime(snapshot(e));r.run("view='tournament';render()");assert.ok(r.html().includes('data-action="switch-activity"'));assert.ok(r.run("eventSheets().some(s=>s.name==='Général multisport')"));
});
