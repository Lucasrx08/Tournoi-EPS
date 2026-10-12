import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import * as E from '../dist/engine.js';
import * as X from '../dist/exchange.js';
import * as P from '../dist/planning.js';
import * as C from '../dist/controls.js';
import * as R from '../dist/rackets.js';
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .+;\n/gm,'');
const plain=v=>JSON.parse(JSON.stringify(v));
function runtime(snapshot,backup,legacySession={}){
 const memory=new Map(),session=new Map(Object.entries(legacySession)),nodes=new Map(),listeners=new Map(),spoken=[];
 if(snapshot)memory.set('EPS_TOURNOIS_V1',snapshot);if(backup)memory.set('EPS_TOURNOIS_V1_BACKUP',backup);
 function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){},toggle(){}},listeners:new Map(),addEventListener(type,cb){this.listeners.set(type,cb)},showModal(){this.open=true},close(){this.open=false},getBoundingClientRect(){return {left:0,right:1000,top:0,bottom:1000}}});return nodes.get(id)}
 const storage=map=>({getItem:key=>map.get(key)??null,setItem:(key,v)=>map.set(key,String(v)),removeItem:key=>map.delete(key)});
 const ctx={E,X,P,C,R,crypto:webcrypto,console,structuredClone,TextEncoder,Uint8Array,URL,URLSearchParams,Date,Blob,Map,Set,Number,JSON,Math,Promise,String,Array,RegExp,Error,atob,btoa,localStorage:storage(memory),sessionStorage:storage(session),location:{search:'',href:'https://example.test/',pathname:'/'},navigator:{},document:{getElementById:node,querySelector(){return null},addEventListener:(type,cb)=>listeners.set(type,cb),visibilityState:'visible',documentElement:{requestFullscreen:async()=>{}}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,addEventListener(){},scrollTo(){},confirm:()=>true,window:{},audioContext:null,speechSynthesis:{getVoices:()=>[{lang:'fr-FR'}],cancel(){},speak:speech=>spoken.push(speech)},SpeechSynthesisUtterance:class{constructor(text){this.text=text}}};
 vm.createContext(ctx);vm.runInContext('"use strict";\n'+source,ctx);
 return {ctx,node,memory,spoken,listeners,run:s=>vm.runInContext(s,ctx),html:()=>node('app').innerHTML,action:(name,dataset={})=>ctx.action(name,{dataset}),change:target=>listeners.get('change')({target:{hasAttribute:()=>false,...target}}),input:target=>listeners.get('input')({target})};
}
function fixture(sport,n,c,config={}){const t=E.newTournament({sport,courtCount:c,format:E.SPORTS[sport].formats[0][0],...config},E.makeTeams(n));return {id:E.uid(),title:'Test EPS',tournaments:[t],selectedId:t.id,pinHash:null,pinSalt:'salt',studentScores:false,audio:{enabled:false,volume:.5,sound:'buzzer',start:false,alert30:false},createdAt:0}}
function snapshot(e){return JSON.stringify({schema:1,events:[e],activeId:e.id,updatedAt:0,revision:0})}
function open(r,e){r.ctx.fixture=e;r.run("data.events=[normalizeEvent(fixture)];data.activeId=fixture.id;view='tournament';render()")}
async function next(r){await r.action('wizard-next')}
async function acceptAction(r,name,dataset={}){const pending=r.action(name,dataset);await r.action('confirm-accept');await pending}
test('Accueil : dix activités, anciens raccourcis et sports retirés absents',()=>{
 const r=runtime();assert.equal((r.html().match(/data-action="pick-activity"/g)??[]).length,10);
 for(const text of['Prêt à jouer','Où je joue','Écran TV','data-id="tennis"','data-id="hockey"'])assert.ok(!r.html().includes(text));
 assert.ok(r.html().includes('Tennis de table'));assert.ok(r.html().includes('Choisir l’activité'));assert.ok(!r.html().includes('On joue'));
});
test('Navigation simplifiée : outils accessibles et menu fermé par Échap',async()=>{
 const r=runtime();open(r,fixture('badminton',6,3));
 const tabs=r.html().match(/<nav class="nav-tabs"[^>]*>(.*?)<\/nav>/s)[1];
 assert.deepEqual([...tabs.matchAll(/data-action="([^"]+)"/g)].map(x=>x[1]),['courts','rank']);
 for(const name of['rotations','court-players','exports','settings','test-sound'])assert.ok(r.html().includes('data-action="'+name+'"'));
 await r.action('rotations');assert.equal(r.run('tab'),'rotations');assert.ok(r.html().includes('Rencontres et rotations'));
 await r.action('courts');assert.equal(r.run('tab'),'courts');
 let closed=false;r.ctx.document.querySelector=selector=>selector==='.tournament-menu[open]'?{removeAttribute(name){closed=name==='open'}}:null;
 r.listeners.get('keydown')({key:'Escape'});assert.equal(closed,true);assert.equal(r.run('E.current(tourney()).matches[0].scoreA'),0);
});
test('Terrain : objectif borné et vainqueur indiqué après le résultat seulement',async()=>{
 const r=runtime();open(r,fixture('badminton',4,2,{endMode:'score',target:5}));await r.action('start');
 const match=r.run('E.current(tourney()).matches[0].id');
 await r.action('score',{match,side:'a',delta:'4'});assert.ok(!r.html().includes('is-winner'));assert.ok(r.html().includes('width:80%'));
 await r.action('score',{match,side:'a',delta:'4'});assert.equal(r.run('E.current(tourney()).matches[0].scoreA'),8);
 assert.equal((r.html().match(/is-winner/g)??[]).length,1);assert.ok(r.html().includes('width:100%'));assert.ok(!r.html().includes('width:160%'));
});
test('Saisie : focus conservé et retour de point respectant les mouvements réduits',()=>{
 const r=runtime(),classes=[],focused=[];const target={dataset:{},classList:{add:name=>classes.push(name),remove(){}},focus:options=>focused.push(options)};
 r.ctx.document.querySelector=()=>target;r.run("scoreFeedback('match','a',3)");assert.equal(target.dataset.feedback,'+3');assert.deepEqual(classes,['score-scored']);assert.equal(focused[0].preventScroll,true);
 classes.length=0;r.ctx.matchMedia=()=>({matches:true});r.run("scoreFeedback('match','a',1)");assert.equal(classes.length,0);assert.equal(focused.length,2);
 r.ctx.matchMedia=()=>({matches:false});r.run("scoreFeedback('match','a',-1)");assert.equal(classes.length,0);
});
test('Classement : les premières places apparaissent avec les seuls résultats terminés',async()=>{
 const r=runtime();open(r,fixture('basket',6,3,{endMode:'free',winPoints:7,drawPoints:2,lossPoints:0}));await r.action('rank');assert.ok(!r.html().includes('leader-card'));
 await r.action('courts');await r.action('start');const match=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match,side:'a',delta:'4'});
 await r.action('rank');assert.ok(!r.html().includes('leader-card'));await acceptAction(r,'finish-all');await r.action('rank');
 const rows=plain(r.run('E.standings(tourney())'));assert.equal(rows[0].points,7);assert.equal((r.html().match(/<article class="leader-card/g)??[]).length,3);
 assert.ok(r.html().includes('<b>7</b><small>points</small>'));assert.ok(r.html().includes(rows[0].name));assert.ok(r.html().includes('En tête du classement provisoire'));
});
for(const[sport,n,c]of[['basket',4,1],['basket',8,4],['handball',6,3],['badminton',18,9],['table',24,12],['basket',48,24]])test('Vue '+sport+' : '+c+' terrains et prochaines rotations',()=>{
 const r=runtime();open(r,fixture(sport,n,c));assert.equal((r.html().match(/<article class="court-card/g)??[]).length,c);
 assert.ok(r.html().includes('PROCHAINE ROTATION'));assert.equal((r.html().match(/data-next-court=/g)??[]).length,c);assert.ok(r.html().includes('upcoming-match'));
 for(const text of['Où je joue','ÉQUIPES AU REPOS','data-action="tv"','undefined','NaN'])assert.ok(!r.html().includes(text));
 const next=r.run('P.nextRotation(tourney())');for(const m of next.matches)assert.ok(r.html().includes(E.label(r.run('tourney()'),m.a)));
});
test('Création complète : répartition, identités, timing, jeu et reprise',async()=>{
 const r=runtime();await r.action('pick-activity',{id:'basket'});assert.equal(r.run('draft.step'),1);
 assert.ok(r.html().includes('Joueurs par équipe sur le terrain'));assert.ok(!r.html().includes('3 contre 3'));
 await next(r);await r.action('roster-mode',{id:'auto'});await r.action('toggle-referees');await r.action('proposal',{id:r.run('proposals()[0].id')});
 assert.equal(r.run('draft.teams.reduce((n,x)=>n+x.playerCount,0)'),28);assert.equal(r.run('draft.teams.reduce((n,x)=>n+x.members.length,0)'),0);assert.equal(r.run('draft.teams.length'),7);await next(r);
 r.input({dataset:{teamName:'0'},value:'Les Comètes'});await r.change({dataset:{teamColor:'0'},value:'#ffcc00'});
 r.run("draft.teams[0].logo='data:image/png;base64,YQ==';render()");assert.ok(r.html().includes('data:image/png;base64,YQ=='));
 await next(r);assert.ok(r.html().includes('formula-art'));assert.ok(!r.html().includes('<select'));
 await next(r);assert.ok(r.html().includes('Définir le barème'));assert.ok(r.html().includes('Match nul'));await next(r);assert.equal(r.run('draftCfg().duration'),300);assert.ok(r.html().includes('Scores + déplacement'));
 await next(r);assert.ok(r.html().includes('Choisir la durée des rencontres'));await next(r);assert.ok(r.html().includes('Départ commun'));assert.ok(!r.html().includes('<select'));
 assert.equal(r.run('draft.step'),7);assert.ok(r.html().includes('Ouvrir les terrains'));assert.ok(r.html().includes('Nom du tournoi'));assert.equal(r.node('toast').textContent,'');
 await r.action('create');assert.ok(r.html().includes('Rotation <b>1</b>'));assert.equal(r.run('tourney().teams[0].name'),'Les Comètes');assert.equal(r.run('tourney().config.referees'),true);
 await r.action('start');assert.equal(r.spoken.at(-1).text,'Jouez !');
 const match=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match,side:'a',delta:'1'});await r.action('pause');assert.equal(r.run('E.current(tourney()).clock.status'),'paused');
 const restored=runtime(r.memory.get('EPS_TOURNOIS_V1'));assert.equal(restored.run('E.current(tourney()).matches[0].scoreA'),1);assert.equal(restored.run('tourney().teams[0].logo'),'data:image/png;base64,YQ==');
 await acceptAction(r,'finish-all');assert.equal(r.spoken.at(-1).text,'Fin des matchs !');await r.action('advance');assert.equal(r.run('tourney().roundIndex'),1);
});
test('Création : choix d’effectif et identités uniques obligatoires',async()=>{
 const r=runtime();r.run('newDraft()');await next(r);await assert.rejects(next(r),/Choisissez/);await r.action('roster-mode',{id:'auto'});await assert.rejects(next(r),/proposition/);
 await r.action('proposal',{id:r.run('proposals()[0].id')});await next(r);r.run('draft.teams[1].name=draft.teams[0].name');await assert.rejects(next(r),/différents/);assert.equal(r.run('draft.step'),3);
});
test('Nombres : bornes, fractions et proposition invalidée',async()=>{
 const r=runtime();r.run('newDraft()');await r.change({dataset:{field:'courtCount'},value:'1000'});assert.equal(r.run('draftCfg().courtCount'),24);
 await r.change({dataset:{field:'courtCount'},value:'3'});await next(r);await r.action('roster-mode',{id:'auto'});await r.action('proposal',{id:r.run('proposals()[0].id')});
 await r.change({dataset:{field:'studentCount'},value:'29'});assert.equal(r.run('draft.proposal'),null);assert.equal(r.run('draft.participants.length'),0);
 await r.action('proposal',{id:r.run('proposals()[0].id')});r.run('draft.step=6;render()');r.run("updateDurationWheel('duration','minutes',2);updateDurationWheel('duration','seconds',30)");assert.equal(r.run('draftCfg().duration'),150);
 r.run("updateDurationWheel('duration','seconds',47)");assert.equal(r.run('draftCfg().duration'),167);
});
test('Temps : séance trop longue bloquée avant le départ',async()=>{
 const r=runtime();r.run("newDraft();draft.mode='existing';draft.step=6;draftCfg().duration=7200;render()");await assert.rejects(next(r),/dépasse/);assert.equal(r.run('draft.step'),6);
 await r.change({dataset:{field:'availableMinutes'},value:'5'});await assert.rejects(next(r),/dépasse/);await r.action('end-mode',{id:'score'});await next(r);assert.equal(r.run('draft.step'),7);
});
test('Raquettes : joueurs en simple, duos en double, noms importés',async()=>{
 for(const sport of['badminton','table']){
  const r=runtime();await r.action('pick-activity',{id:sport});await next(r);await r.action('roster-mode',{id:'auto'});await r.change({dataset:{field:'studentCount'},value:'18'});await r.action('proposal',{id:r.run('proposals()[0].id')});
  assert.equal(r.run('draft.count'),18);assert.ok(r.run('draft.teams.every(x=>x.members.length===1)'));await next(r);assert.ok(r.html().includes('Identifier les joueurs'));assert.ok(!r.html().includes('Équipe'));
  r.ctx.imported=X.participantsFromRows([['Prénom','Nom'],['Inès','Martin'],['Léo','Durand']]);r.run('applyParticipants(imported)');assert.deepEqual(plain(r.run('draft.teams.map(x=>x.name)')),['Inès Martin','Léo Durand']);
  await r.change({dataset:{field:'playersPerSide'},value:'2'});assert.equal(r.run('draftCfg().playersPerSide'),1);r.ctx.imported=X.participantsFromRows([['Prénom','Nom'],['Inès','Martin'],['Léo','Durand'],['Lou','Roy'],['Adam','Diallo']]);r.run('applyParticipants(imported)');await r.change({dataset:{field:'playersPerSide'},value:'2'});r.run('draft.step=2;render()');assert.ok(r.html().includes('Nombre de duos'));
 }
});
test('Partenaires tournants : quatre joueurs constituent un vrai double',async()=>{
 const r=runtime();r.run("newDraft('badminton');resizeTeams(8);draft.mode='existing';draft.step=4;render()");await r.action('formula-choice',{id:'americano'});const t=r.run('draftTournament()');assert.equal(t.config.playersPerSide,2);
 for(const m of E.current(t).matches){assert.equal(m.a.length,2);assert.equal(m.b.length,2)}
 r.run("newDraft('basket');draft.step=4;render()");await assert.rejects(r.action('formula-choice',{id:'americano'}),/individuels/);
});
test('Vue unifiée : tous les terrains sont contrôlables, arbitrage affiché sans profil',async()=>{
 const e=fixture('handball',9,3,{referees:true});e.pinHash='ancien-code';
 const r=runtime(snapshot(e),null,{'eps-role':'referee','eps-ref-court':e.tournaments[0].courts[0].id,'eps-authorized':'invalide'});await r.action('open-event',{id:e.id});
 assert.equal((r.html().match(/<article class="court-card/g)??[]).length,3);assert.ok(r.html().includes('Arbitre :'));
 for(const id of r.run('E.current(tourney()).matches.map(m=>m.refereeId)'))assert.ok(r.html().includes(E.team(r.run('tourney()'),id).name));
 for(const text of['Changer de rôle','Code enseignant','role-pill','data-action="roles"','choose-role','unlock'])assert.ok(!r.html().includes(text));
 const other=r.run('E.current(tourney()).matches[2].id');await r.action('score',{match:other,side:'a',delta:'1'});r.ctx.other=other;assert.equal(r.run('findMatch(other).scoreA'),1);
 await r.action('start');await r.action('pause');assert.equal(r.run('E.current(tourney()).clock.status'),'paused');await r.action('settings');assert.ok(!r.node('modal').innerHTML.includes('Code enseignant'));
});
test('Ancien profil élève : commandes disponibles et nouveau tournoi sans code',async()=>{
 const e=fixture('basket',6,3);e.pinHash='ancien-code';const r=runtime(snapshot(e),null,{'eps-role':'student'});await r.action('open-event',{id:e.id});
 for(const action of['start','score','settings'])assert.ok(r.html().includes('data-action="'+action+'"'));
 await r.action('pick-activity',{id:'basket'});r.run("draft.mode='existing';draft.step=7;render()");await r.action('create');assert.equal(r.run('event().pinHash'),undefined);assert.equal(r.run('event().studentScores'),undefined);
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

test('Chasubles : noms par couleur, changement automatique et nom personnalisé conservé',async()=>{
 const r=runtime();await r.action('pick-activity',{id:'football'});r.run("draft.mode='existing';draft.step=3;render()");
 assert.deepEqual(plain(r.run('draft.teams.slice(0,4).map(x=>x.name)')),['Bleu clair','Bleu foncé','Vert clair','Vert foncé']);assert.ok(!r.html().includes('Équipe 1'));assert.ok(r.html().includes('bib-swatch'));
 await r.action('bib-color',{index:'0',color:C.BIBS[4].color});assert.match(r.run('draft.teams[0].name'),/^Orange/);assert.equal(r.run('new Set(draft.teams.map(x=>x.name)).size'),6);
 r.input({dataset:{teamName:'0'},value:'Les Lynx'});await r.action('bib-color',{index:'0',color:C.BIBS[2].color});assert.equal(r.run('draft.teams[0].name'),'Les Lynx');
 r.run('resizeTeams(64)');assert.equal(r.run('new Set(draft.teams.map(x=>x.name)).size'),64);
});
test('Sports collectifs : uniquement effectifs, aucune liste individuelle même en reprise',async()=>{
 const r=runtime();await r.action('pick-activity',{id:'handball'});await next(r);await r.action('roster-mode',{id:'auto'});
 assert.ok(!r.html().includes('data-action="import"'));await r.action('proposal',{id:r.run('proposals()[0].id')});await next(r);
 assert.equal(r.run('draft.participants.length'),0);assert.ok(r.run('draft.teams.every(x=>x.members.length===0)'));assert.ok(!r.html().includes('draft-members'));
 assert.equal(r.run('draft.teams.reduce((n,x)=>n+x.playerCount,0)'),28);
 const e=fixture('football',6,3);e.tournaments[0].teams[0].members=[{id:'p1',first:'Élève 13',last:'Ancien'}];open(r,e);await r.action('teams');assert.ok(!r.node('modal').innerHTML.includes('Élève 13'));assert.ok(!r.node('modal').innerHTML.includes('data-member='));
 assert.equal(r.run('tourney().teams[0].members[0].first'),'Élève 13');assert.ok(!r.run('JSON.stringify(sheets(tourney()))').includes('Élève 13'));
});
test('Roulettes : heures pour le cours seulement, budget et rencontres précis à la seconde',async()=>{
 const r=runtime();r.run("newDraft();draft.mode='existing';draft.step=6;render()");
 assert.equal((r.html().match(/class="duration-picker"/g)??[]).length,3);
 assert.equal((r.html().match(/data-wheel-unit="hours"/g)??[]).length,1);assert.ok(r.html().includes('data-wheel-field="availableMinutes" data-wheel-unit="hours"'));
 for(const field of['availableMinutes','setupMinutes','breakSeconds'])for(const unit of['minutes','seconds'])assert.ok(r.html().includes('data-wheel-field="'+field+'" data-wheel-unit="'+unit+'"'));
 await r.action('timing-page',{id:'matches'});assert.equal((r.html().match(/class="duration-picker"/g)??[]).length,1);for(const unit of ['minutes','seconds'])assert.ok(r.html().includes('data-wheel-field="duration" data-wheel-unit="'+unit+'"'));assert.ok(!r.html().includes('data-wheel-unit="hours"'));
 r.run("updateDurationWheel('availableMinutes','seconds',27);updateDurationWheel('setupMinutes','seconds',19);updateDurationWheel('breakSeconds','minutes',1);updateDurationWheel('breakSeconds','seconds',13);updateDurationWheel('duration','minutes',2);updateDurationWheel('duration','seconds',37)");
 const p=plain(r.run('draftTiming()'));assert.equal(p.budget,5427);assert.equal(p.setup,619);assert.equal(p.transition,73);assert.equal(r.run('draftCfg().duration'),157);
 await r.action('create');assert.equal(r.run('tourney().config.duration'),157);assert.equal(r.run('E.current(tourney()).clock.remaining'),157000);
 const restored=runtime(r.memory.get('EPS_TOURNOIS_V1'));assert.equal(restored.run('Math.round(tourney().config.availableMinutes*60)'),5427);assert.equal(restored.run('tourney().config.duration'),157);
});
test('Suppression depuis l’accueil : plusieurs suppressions et annulations conservent les résultats',async()=>{
 const e=fixture('basket',6,3),other=fixture('table',4,2);e.tournaments[0].rotations[0].matches[0].scoreA=12;e.title='Ancien <tournoi>';
 const r=runtime();r.ctx.events=[e,other];r.run('data.events=events;data.activeId=events[0].id;render()');assert.equal((r.html().match(/data-action="delete-saved"/g)??[]).length,2);
 await r.action('delete-saved',{id:e.id});assert.equal(r.run('data.events.length'),1);assert.equal(r.run('data.activeId'),null);assert.ok(r.html().includes('Annuler'));assert.ok(r.html().includes('Ancien &lt;tournoi&gt;'));
 await r.action('delete-saved',{id:other.id});assert.equal(r.run('data.events.length'),0);assert.equal(JSON.parse(r.memory.get('EPS_TOURNOIS_V1')).events.length,0);
 await r.action('undo-delete');await r.action('undo-delete');assert.deepEqual(plain(r.run('data.events.map(e=>e.id)')),[e.id,other.id]);assert.equal(r.run('data.activeId'),e.id);assert.equal(r.run('data.events[0].tournaments[0].rotations[0].matches[0].scoreA'),12);
 const restored=runtime(r.memory.get('EPS_TOURNOIS_V1'));assert.equal(restored.run('data.events.length'),2);await restored.action('open-event',{id:e.id});assert.equal(restored.run('E.current(tourney()).matches[0].scoreA'),12);
});
test('Migration des anciens numéros : identifiants, noms personnalisés, logos et scores préservés',()=>{
 const e=fixture('basket',6,3),ids=e.tournaments[0].teams.map(x=>x.id);e.tournaments[0].teams[1].name='Les Aigles';e.tournaments[0].teams[1].logo='data:image/png;base64,YQ==';e.tournaments[0].rotations[0].matches[0].scoreB=9;
 const r=runtime(snapshot(e));assert.equal(r.run('tourney().teams[0].name'),'Bleu clair');assert.equal(r.run('tourney().teams[1].name'),'Les Aigles');assert.deepEqual(plain(r.run('tourney().teams.map(x=>x.id)')),ids);assert.equal(r.run('tourney().teams[1].logo'),'data:image/png;base64,YQ==');assert.equal(r.run('E.current(tourney()).matches[0].scoreB'),9);
});
test('Prochaines rotations : couleurs, joueurs et arbitres restent associés au bon terrain',()=>{
 const r=runtime();open(r,fixture('handball',9,3,{referees:true}));const t=r.run('tourney()'),next=P.nextRotation(t);
 for(const court of t.courts){r.ctx.court=court;const html=r.run('courtCard(tourney(),court)'),m=next.matches.find(m=>m.courtId===court.id);assert.ok(html.includes('data-next-court="'+court.id+'"'));assert.ok(html.includes(E.label(t,m.a)));assert.ok(html.includes(E.label(t,m.b)));for(const id of [...m.a,...m.b])assert.ok(html.includes(E.team(t,id).color));if(m.refereeId)assert.ok(html.includes(E.team(t,m.refereeId).name));}
});

test('Accueil : ordre des activités et palette des chasubles conservés',()=>{
 const r=runtime(),ids=[...r.html().matchAll(/data-action="pick-activity"[^>]*data-id="([^"]+)"/g)].map(x=>x[1]);assert.deepEqual(ids,['handball','badminton','ultimate','basket','volley','futsal','table','rugby','football','custom']);
 assert.deepEqual(C.BIBS.map(x=>x.name),['Bleu clair','Bleu foncé','Vert clair','Vert foncé','Orange','Rouge','Jaune fluo','Jaune','Rose','Fuchsia','Blanc']);
});
test('Points juste après la formule : bonus raquette enregistré, appliqué et restauré',async()=>{
 const r=runtime();r.run("newDraft('badminton');draft.mode='existing';resizeTeams(4);draft.step=4;render()");await next(r);assert.equal(r.run('draft.step'),5);assert.ok(r.html().includes('Point normal'));assert.ok(r.html().includes('Point bonus'));assert.ok(!r.html().includes('Match nul'));
 await r.action('score-mode',{id:'bonus'});await r.change({dataset:{field:'bonusPoints'},value:'4'});await next(r);assert.ok(r.html().includes('Définir la fin des rencontres'));await r.action('end-mode',{id:'score'});await r.change({dataset:{field:'target'},value:'5'});await next(r);await next(r);await r.action('create');
 assert.ok(r.html().includes('★ +4'));const match=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match,side:'a',delta:'4'});assert.equal(r.run('E.current(tourney()).matches[0].scoreA'),4);
 const restored=runtime(r.memory.get('EPS_TOURNOIS_V1'));assert.equal(restored.run('tourney().config.bonusPoints'),4);assert.equal(restored.run('E.current(tourney()).matches[0].scoreA'),4);
});
test('Barème collectif : victoire, nul et défaite agissent sur le classement',async()=>{
 const r=runtime();r.run("newDraft('handball');draft.mode='existing';resizeTeams(2);draft.step=4;render()");await next(r);assert.ok(r.html().includes('Victoire'));assert.ok(r.html().includes('Match nul'));assert.ok(!r.html().includes('Point bonus'));
 for(const [field,value] of [['winPoints','5'],['drawPoints','2'],['lossPoints','1']])await r.change({dataset:{field},value});await r.action('create');const match=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match,side:'a',delta:'1'});await r.action('finish-match',{match});assert.deepEqual(plain(r.run('E.standings(tourney()).map(x=>x.points)')),[5,1]);
});
test('Modèle élèves téléchargeable : fichier XLSX à deux colonnes',async()=>{
 const r=runtime(),downloads=[];r.ctx.X={...X,download:(...args)=>downloads.push(args)};r.run("newDraft('table');draft.step=2;render()");assert.ok(r.html().includes('Modèle élèves'));await r.action('player-template');assert.equal(downloads[0][1],'Modele_eleves_terrains.xlsx');const f=X.unzip(downloads[0][0]),xml=new TextDecoder().decode(f['xl/worksheets/sheet1.xml']);assert.ok(xml.includes('Nom et prénom'));assert.ok(xml.includes('Numéro de terrain'));
});
test('Import et glisser-déposer dans le brouillon : noms complets et terrains réellement suivis',async()=>{
 const r=runtime();r.run("newDraft('badminton');draft.step=2;render()");r.ctx.imported=X.participantsFromRows([['Nom et prénom','Numéro de terrain'],['Martin Inès',2],['Durand Léo',2],['Diallo Adam',1],['Nguyen Zoé',1]]);r.run('applyParticipants(imported)');assert.deepEqual(plain(r.run('draft.teams.map(x=>x.name)')),['Martin Inès','Durand Léo','Diallo Adam','Nguyen Zoé']);
 await r.action('court-players');assert.ok(r.node('modal').innerHTML.includes('data-drop-court="2"'));assert.ok(!r.node('modal').innerHTML.includes('<select'));
 const id=r.run('draft.teams[0].id'),player={dataset:{courtPlayer:id}},court={dataset:{dropCourt:'3'}};r.listeners.get('dragstart')({target:{closest:selector=>selector==='[data-court-player]'?player:null},dataTransfer:{setData(){}}});let prevented=false;r.listeners.get('drop')({target:{closest:selector=>selector==='[data-drop-court]'?court:null},preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(r.run('draft.teams[0].homeCourt'),3);assert.equal(r.run('draft.teams[0].members[0].courtNumber'),3);
 const t=r.run('draftTournament()');const first=E.current(t);assert.ok(first.matches.some(m=>m.courtId===t.courts[2].id&&E.entrants(m).includes(id)));assert.equal(E.allMatches(t).length,6);
});
test('Déplacement au clavier pendant une rencontre : prochain terrain et scores conservés',async()=>{
 const r=runtime();open(r,fixture('table',6,3));await r.action('start');const match=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match,side:'a',delta:'6'});const before=r.run('JSON.stringify(E.current(tourney()))'),id=r.run('E.current(tourney()).matches[0].a[0]');
 await r.action('court-players');await r.action('select-court-player',{id});await r.action('place-court-player',{number:'3'});assert.equal(r.run('JSON.stringify(E.current(tourney()))'),before);r.ctx.player=id;assert.equal(r.run('tourney().rotations.slice(1).flatMap(r=>r.matches).find(m=>E.entrants(m).includes(player)).courtId'),r.run('tourney().courts[2].id'));
 const restored=runtime(r.memory.get('EPS_TOURNOIS_V1'));assert.equal(restored.run('E.current(tourney()).matches[0].scoreA'),6);
});
test('Import invalide : le brouillon précédent reste intact',()=>{
 const r=runtime();r.run("newDraft('badminton')");const before=r.run('JSON.stringify(draft)');r.ctx.imported=X.participantsFromRows([['Nom et prénom','Numéro de terrain'],['Inès',4],['Lou',4]]);assert.throws(()=>r.run('applyParticipants(imported)'),/dépasse/);assert.equal(r.run('JSON.stringify(draft)'),before);
});

test('Import puis choix du double : duos recomposés par terrain',async()=>{
 const r=runtime();r.run("newDraft('badminton')");r.ctx.imported=X.participantsFromRows([['Nom et prénom','Numéro de terrain'],['Inès',1],['Lou',1],['Adam',2],['Zoé',2]]);r.run('applyParticipants(imported)');await r.change({dataset:{field:'playersPerSide'},value:'2'});assert.equal(r.run('draft.count'),2);assert.ok(r.run('draft.teams.every(x=>x.members.length===2)'));assert.deepEqual(plain(r.run('draft.teams.map(x=>x.homeCourt)')),[1,2]);
});

test('Fin des matchs : confirmation intégrée même si les dialogues du navigateur sont bloqués',async()=>{
 const r=runtime();open(r,fixture('basket',6,3));await r.action('start');r.ctx.confirm=()=>{throw Error('Dialogue natif interdit')};
 const button={dataset:{action:'finish-all'}};const pending=r.listeners.get('click')({target:{closest:selector=>selector==='[data-action]'?button:null}});assert.equal(r.node('confirmation').open,true);assert.ok(r.node('confirmation').innerHTML.includes('Terminer les matchs'));
 assert.equal(r.run('E.current(tourney()).matches.filter(m=>m.status==="live").length'),3);
 await r.action('confirm-accept');await pending;assert.ok(r.run('E.current(tourney()).matches.every(E.done)'));assert.equal(r.node('confirmation').open,false);
 assert.ok(r.html().includes('data-action="advance"'));await r.action('advance');assert.equal(r.run('tourney().roundIndex'),1);
});
test('Annuler, fermer ou Échap conserve les matchs et les scores',async()=>{
 for(const cancel of ['confirm-cancel','escape','close']){
  const r=runtime();open(r,fixture('basket',6,3));await r.action('start');const id=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match:id,side:'a',delta:'2'});
  const before=r.run('JSON.stringify(tourney())');const pending=r.action('finish-all');
  if(cancel==='escape')r.node('confirmation').listeners.get('cancel')({preventDefault(){}});
  else if(cancel==='close'){r.node('confirmation').close();r.node('confirmation').listeners.get('close')()}
  else await r.action(cancel);
  await pending;assert.equal(r.run('JSON.stringify(tourney())'),before);assert.equal(r.node('confirmation').open,false);
 }
});
test('Fin individuelle : résultat et départage explicite, sans arrêter les voisins',async()=>{
 const r=runtime();open(r,fixture('basket',6,3));await r.action('start');const id=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match:id,side:'a',delta:'2'});await r.action('finish-match',{match:id});
 assert.equal(r.run('E.current(tourney()).matches[0].status'),'done');assert.equal(r.run('E.current(tourney()).matches[1].status'),'live');
 const tie=runtime();open(tie,fixture('basket',4,2,{formula:'knockout',tie:'golden'}));await tie.action('start');const mid=tie.run('E.current(tourney()).matches[0].id');await tie.action('finish-match',{match:mid});
 assert.equal(tie.run('E.current(tourney()).matches[0].tieBreak'),'golden');assert.match(tie.node('toast').textContent,/point décisif/);await tie.action('score',{match:mid,side:'a',delta:'1'});assert.equal(tie.run('E.current(tourney()).matches[0].status'),'done');
});
test('Erreur de rotation visible quand le formulaire de correction est fermé',async()=>{
 const r=runtime();open(r,fixture('basket',6,3));await r.action('start');const mid=r.run('E.current(tourney()).matches[0].id');await r.action('edit-match',{match:mid});await r.action('close');
 const node={dataset:{action:'advance'}};await r.listeners.get('click')({target:{closest:selector=>selector==='[data-action]'?node:null}});
 assert.ok(r.node('toast').textContent);assert.equal(r.node('match-error').textContent,'');assert.equal(r.run('tourney().roundIndex'),0);
});
test('Réinitialisation du chrono : fenêtre de réglages conservée après annulation',async()=>{
 const r=runtime();open(r,fixture('basket',6,3));await r.action('start');const mid=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match:mid,side:'a',delta:'2'});await r.action('clock-settings');const html=r.node('modal').innerHTML;
 const pending=r.action('reset-clock');await r.action('confirm-cancel');await pending;assert.equal(r.node('modal').innerHTML,html);assert.equal(r.node('modal').open,true);
 await acceptAction(r,'reset-clock');assert.equal(r.run('E.current(tourney()).matches[0].scoreA'),2);assert.equal(r.run('E.current(tourney()).clock.status'),'ready');
});
test('Confirmation ancienne : une nouvelle rotation ne peut pas être terminée par erreur',async()=>{
 const r=runtime();open(r,fixture('basket',6,3));await r.action('start');const pending=r.action('finish-all');r.run('E.finishAll(tourney());E.advance(tourney())');const before=r.run('JSON.stringify(E.current(tourney()))');await r.action('confirm-accept');await assert.rejects(pending,/rotation a changé/);assert.equal(r.run('JSON.stringify(E.current(tourney()))'),before);
});

test('Restaurer deux tournois : confirmations successives sans fermeture tardive parasite',async()=>{
 const r=runtime(),a=fixture('basket',4,2),b=fixture('handball',4,2);r.ctx.events=[a,b];r.run('data.events=events;data.activeId=events[0].id');
 const imported={schema:1,events:[{...a,title:'Basket restauré'},{...b,title:'Handball restauré'}],activeId:a.id};r.ctx.file={size:500,text:async()=>JSON.stringify(imported)};
 const pending=r.run('restoreFile(file)');await new Promise(resolve=>setImmediate(resolve));assert.equal(r.node('confirmation').open,true);
 await r.action('confirm-accept');await new Promise(resolve=>setImmediate(resolve));assert.equal(r.node('confirmation').open,true);r.node('confirmation').listeners.get('close')();assert.equal(r.node('confirmation').open,true);
 await r.action('confirm-accept');await pending;assert.deepEqual(plain(r.run('data.events.map(x=>x.title)')),['Basket restauré','Handball restauré']);
});
test('Fin générale avec égalité décisive : matchs départagés terminés, point décisif expliqué',async()=>{
 const r=runtime();open(r,fixture('basket',4,2,{formula:'knockout',tie:'golden'}));await r.action('start');const mid=r.run('E.current(tourney()).matches[0].id');await r.action('score',{match:mid,side:'a',delta:'2'});await acceptAction(r,'finish-all');
 assert.equal(r.run('E.current(tourney()).matches[0].status'),'done');assert.equal(r.run('E.current(tourney()).matches[1].tieBreak'),'golden');assert.match(r.node('toast').textContent,/point décisif/);assert.equal(r.run('E.current(tourney()).clock.status'),'done');
});

test('Correction de tableau : confirmation intégrée et formulaire préservé après annulation',async()=>{
 const e=fixture('basket',4,2,{formula:'knockout'}),t=e.tournaments[0];for(const m of E.current(t).matches)m.scoreA=2;E.finishAll(t);E.advance(t);
 const r=runtime();open(r,e);const mid=t.rotations[0].matches[0].id;await r.action('edit-match',{match:mid});r.node('edit-score-a').value='0';r.node('edit-score-b').value='3';r.ctx.confirm=()=>{throw Error('Dialogue natif interdit')};
 const before=r.run('JSON.stringify(tourney())'),html=r.node('modal').innerHTML,pending=r.action('save-match',{match:mid});assert.equal(r.node('confirmation').open,true);await r.action('confirm-cancel');await pending;
 assert.equal(r.run('JSON.stringify(tourney())'),before);assert.equal(r.node('modal').innerHTML,html);assert.equal(r.node('edit-score-b').value,'3');
 await acceptAction(r,'save-match',{match:mid});assert.equal(r.run('tourney().rotations.length'),1);assert.equal(r.run('tourney().rotations[0].matches[0].scoreB'),3);assert.equal(r.node('modal').open,false);
});

test('Identités compactes : quatre cartes par page, saisies et réduction conservées',async()=>{
 const r=runtime();r.run("newDraft('handball');draft.mode='existing';resizeTeams(9);draft.step=3;render()");
 assert.equal((r.html().match(/<article class="identity-card/g)??[]).length,4);assert.ok(r.html().includes('1–4 / 9'));
 await r.action('team-page',{delta:'1'});assert.equal((r.html().match(/<article class="identity-card/g)??[]).length,4);assert.ok(r.html().includes('5–8 / 9'));
 await r.action('team-page',{delta:'1'});assert.equal((r.html().match(/<article class="identity-card/g)??[]).length,1);assert.ok(r.html().includes('9–9 / 9'));
 r.input({dataset:{teamName:'8'},value:'Les Lynx'});await r.action('team-page',{delta:'-1'});await r.action('team-page',{delta:'1'});assert.ok(r.html().includes('value="Les Lynx"'));
 r.run('resizeTeams(4);render()');assert.equal(r.run('draft.teamPage'),0);assert.equal((r.html().match(/<article class="identity-card/g)??[]).length,4);
});

test('Temps en deux écrans : progression, retour et valeurs conservées',async()=>{
 const r=runtime();r.run("newDraft('ultimate');draft.mode='existing';draft.step=6;render()");assert.ok(r.html().includes('timing-budget'));assert.ok(!r.html().includes('class="timing-proposals"'));
 r.run("updateDurationWheel('availableMinutes','seconds',20);updateDurationWheel('breakSeconds','seconds',50)");await next(r);assert.equal(r.run('draft.step'),6);assert.equal(r.run('draft.timingPage'),1);assert.ok(r.html().includes('Durées proposées'));assert.ok(!r.html().includes('class="finish-choices"'));
 r.run("updateDurationWheel('duration','minutes',3);updateDurationWheel('duration','seconds',15)");await r.action('wizard-back');assert.equal(r.run('draft.timingPage'),0);assert.equal(r.run('draftCfg().duration'),195);assert.equal(r.run('draftCfg().breakSeconds'),50);
 await next(r);assert.equal(r.run('draftCfg().duration'),195);await next(r);assert.equal(r.run('draft.step'),7);await r.action('wizard-back');assert.equal(r.run('draft.timingPage'),1);
});

test('Raquettes : résultat saisi au clavier, classement et voisins préservés',async()=>{
 for(const sport of ['badminton','table']){
  const r=runtime();open(r,fixture(sport,6,3,{endMode:'free'}));await r.action('start');const id=r.run('E.current(tourney()).matches[0].id');assert.ok(r.html().includes('data-action="quick-result"'));assert.ok(r.html().includes('data-action="score"'));await r.action('quick-result',{match:id});assert.ok(r.node('modal').innerHTML.includes('Saisir le résultat'));assert.ok(r.node('modal').innerHTML.includes('inputmode="numeric"'));
  r.node('edit-score-a').value='21';r.node('edit-score-b').value='15';await r.action('save-match',{match:id,resultEntry:'quick'});assert.equal(r.run('E.current(tourney()).matches[0].scoreA'),21);assert.equal(r.run('E.current(tourney()).matches[0].scoreB'),15);assert.equal(r.run('E.current(tourney()).matches[0].status'),'done');assert.equal(r.run('E.current(tourney()).matches[1].status'),'live');assert.ok(r.run('E.standings(tourney()).some(x=>x.played===1)'));
 }
});
test('Saisie directe : score vide refusé, égalité décisive conservée',async()=>{
 const r=runtime();open(r,fixture('table',4,2,{formula:'knockout'}));const id=r.run('E.current(tourney()).matches[0].id');await r.action('quick-result',{match:id});r.node('edit-score-a').value='';r.node('edit-score-b').value='11';await assert.rejects(r.action('save-match',{match:id,resultEntry:'quick'}),/deux scores/);assert.equal(r.run('E.current(tourney()).matches[0].status'),'scheduled');
 r.node('edit-score-a').value='11';await r.action('save-match',{match:id,resultEntry:'quick'});assert.equal(r.run('E.current(tourney()).matches[0].tieBreak'),'golden');assert.match(r.node('toast').textContent,/point décisif/);
});

test('Classement : toutes les équipes accessibles par pages de huit',async()=>{
 const r=runtime();open(r,fixture('ultimate',18,8));await r.action('rank');
 const ranks=()=>[...r.html().matchAll(/class="rank-number">(\d+)</g)].map(x=>Number(x[1]));
 assert.deepEqual(ranks(),[1,2,3,4,5,6,7,8]);assert.match(r.html(),/1–8 \/ 18 équipes/);
 await r.action('ranking-page',{delta:'1'});assert.deepEqual(ranks(),[9,10,11,12,13,14,15,16]);
 await r.action('ranking-page',{delta:'1'});assert.deepEqual(ranks(),[17,18]);assert.match(r.html(),/17–18 \/ 18 équipes/);
 await r.action('ranking-page',{delta:'1'});assert.deepEqual(ranks(),[17,18]);await r.action('rank');assert.deepEqual(ranks(),[1,2,3,4,5,6,7,8]);
});
