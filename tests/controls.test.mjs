import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../dist/controls.js';
test('Terrains sur ordinateur : sept terrains tiennent sur deux rangées, minimum lisible conservé',()=>{
 const x=C.courtLayout(7,1325,482);assert.equal(x.cols,4);assert.equal(x.rows,2);assert.ok((482-10*(x.rows-1))/x.rows>=x.minHeight);
 for(const n of[1,3,4,7,9,12,24])for(const w of[1024,1325,1880]){const x=C.courtLayout(n,w,482,true);assert.ok(x.cols>=1&&x.cols<=6);assert.equal(x.rows,Math.ceil(n/x.cols));assert.ok(x.minHeight>=250);if(x.cols>1)assert.ok((w-10*(x.cols-1))/x.cols>=235)}
 assert.equal(C.courtLayout(7,1325,482,true,true).minHeight,274);
});
test('Déplacement tactile : poignée, seuil, cible et annulation',()=>{
 const handlers={},calls=[],player={dataset:{courtPlayer:'p1'},classList:{add(){},remove(){}}},zone={dataset:{dropCourt:'2'},classList:{add(){},remove(){}}},handle={addEventListener:(k,v)=>handlers[k]=v,setPointerCapture(){},closest:()=>player},root={querySelectorAll:()=>[handle],ownerDocument:{elementFromPoint:()=>({closest:()=>zone})}};
 C.mountCourtDrag(root,(...args)=>calls.push(args));handlers.pointerdown({pointerType:'touch',clientX:10,clientY:10,pointerId:1});handlers.pointermove({clientX:14,clientY:10,preventDefault(){}});handlers.pointerup({preventDefault(){}});assert.equal(calls.length,0);
 handlers.pointerdown({pointerType:'touch',clientX:10,clientY:10,pointerId:2});handlers.pointermove({clientX:60,clientY:30,preventDefault(){}});handlers.pointerup({preventDefault(){}});assert.deepEqual(calls,[['p1',2]]);
 handlers.pointerdown({pointerType:'touch',clientX:10,clientY:10,pointerId:3});handlers.pointermove({clientX:60,clientY:30,preventDefault(){}});handlers.pointercancel();handlers.pointerup({preventDefault(){}});assert.equal(calls.length,1);
});

test('Durées : les secondes sont conservées, les heures réservées au cours',()=>{
 assert.deepEqual(C.durationParts(5427,true),{hours:1,minutes:30,seconds:27});
 assert.deepEqual(C.durationParts(7200),{hours:0,minutes:120,seconds:0});
 assert.equal(C.changeDuration(300,'seconds',37,C.TIME_LIMITS.duration),337);
 assert.equal(C.changeDuration(5427,'minutes',5,C.TIME_LIMITS.availableMinutes),3927);
 assert.equal(C.changeDuration(0,'seconds',0,C.TIME_LIMITS.duration),15);
 assert.equal(C.changeDuration(300,'seconds',59,C.TIME_LIMITS.breakSeconds),300);
 assert.equal(C.changeDuration(36000,'seconds',59,C.TIME_LIMITS.availableMinutes),36000);
});
test('Chasubles : 64 identités distinctes et noms personnalisés inchangés',()=>{
 const teams=Array.from({length:64},(_,i)=>({...C.bibIdentity(i),bibNamed:true}));assert.equal(new Set(teams.map(x=>x.name)).size,64);
 C.setBibColor(teams[0],C.BIBS[1].color,teams);assert.equal(new Set(teams.map(x=>x.name)).size,64);assert.match(teams[0].name,/^Bleu/);
 teams[0].bibNamed=false;teams[0].name='Les Aigles';C.setBibColor(teams[0],C.BIBS[2].color,teams);assert.equal(teams[0].name,'Les Aigles');assert.equal(C.colorName(C.BIBS[3].color),'Vert foncé');
});
function fakeWheel(value=5){
 const handlers={},options=Array.from({length:60},(_,i)=>({id:'option-'+i,dataset:{wheelValue:String(i)},getBoundingClientRect:()=>({height:32})}));
 const wheel={dataset:{wheelCurrent:String(value),wheelField:'duration',wheelUnit:'seconds'},scrollTop:0,isConnected:true,querySelectorAll:()=>options,setAttribute:(k,v)=>wheel[k]=v,addEventListener:(k,v)=>handlers[k]=v,focus(){wheel.focused=true}};
 return {wheel,handlers,options,root:{querySelectorAll:()=>[wheel],querySelector:()=>wheel}};
}
test('Roue : initialisation sans changement, sélection au clic et clavier',()=>{
 const f=fakeWheel(),changes=[];C.mountWheels(f.root,(...args)=>changes.push(args));assert.equal(f.wheel.scrollTop,160);assert.equal(changes.length,0);
 f.handlers.click({target:{closest:()=>f.options[17]}});assert.deepEqual(changes[0],['duration','seconds',17]);let prevented=false;
 f.handlers.keydown({key:'ArrowDown',preventDefault(){prevented=true}});assert.equal(prevented,true);assert.deepEqual(changes[1],['duration','seconds',18]);assert.equal(f.wheel.focused,true);
 f.handlers.keydown({key:'End',preventDefault(){}});assert.deepEqual(changes[2],['duration','seconds',59]);
});
test('Roue : défilement arrondi et ancien écran ignoré',async()=>{
 const f=fakeWheel(),changes=[];C.mountWheels(f.root,(...args)=>changes.push(args));f.wheel.scrollTop=19*32+9;f.handlers.scroll();await new Promise(resolve=>setTimeout(resolve,170));assert.deepEqual(changes,[['duration','seconds',19]]);
 f.wheel.isConnected=false;f.wheel.scrollTop=24*32;f.handlers.scroll();await new Promise(resolve=>setTimeout(resolve,170));assert.equal(changes.length,1);
});

test('Un à trois terrains : une rangée sur ordinateur et typographie bornée par la cellule',()=>{
 for(const count of [1,2,3])for(const width of [900,1325,1880]){const g=C.courtLayout(count,width,360);assert.equal(g.cols,count);assert.equal(g.rows,1)}
 for(const count of [1,3,7,12,24])for(const width of [900,1325])for(const height of [320,482,700])for(const refs of [false,true])for(const bonus of [false,true]){
  const g=C.courtLayout(count,width,height,refs,bonus),w=(width-10*(g.cols-1))/g.cols,h=Math.max(g.minHeight,(height-10*(g.rows-1))/g.rows),m=C.courtTypography(w,h,refs,bonus);
  assert.ok(m.scoreSize>=32&&m.scoreSize<=132);assert.ok(m.scoreSize<=m.scoreSpace);assert.ok(m.scoreSize<=w*.22+1);
 }
});

test('Grille montée : trois terrains et scores recalculés quand la hauteur diminue',()=>{
 const styles=new Map(),grid={children:[{},{},{}],clientWidth:1200,clientHeight:400,style:{setProperty:(key,value)=>styles.set(key,String(value))}},root={querySelector:()=>grid};
 C.mountCourtLayout(root);assert.equal(styles.get('--cols'),'3');assert.equal(styles.get('--rows'),'1');const big=parseInt(styles.get('--score-size'));assert.ok(big>50);
 grid.clientHeight=230;C.mountCourtLayout(root);const small=parseInt(styles.get('--score-size'));assert.ok(small<big);assert.ok(small>=32);assert.equal(styles.get('--cols'),'3');assert.ok(styles.has('--identity-height'));
});
