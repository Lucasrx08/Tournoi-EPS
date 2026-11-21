import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Les essais utilisent de faux tournois, jamais de données d'élèves.
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const start=source.indexOf('let storageIntegrityIssue=null;');
const end=source.indexOf('function showStorageIssue(){',start);
assert.ok(start!==-1&&end>start,'Le mécanisme de protection est présent');

function boot(records){
 const storage=new Map(Object.entries(records));
 const context={
  KEY:'EPS_TOURNOIS_V1',BACKUP:'EPS_TOURNOIS_V1_BACKUP',
  localStorage:{getItem:key=>storage.has(key)?storage.get(key):null},
  initialData:()=>({schema:1,events:[],rosters:[],activeId:null,updatedAt:0}),
  validData:value=>value?.schema===1&&Array.isArray(value.events),
  S:{mergeSnapshots:(a,b)=>({...a,events:[...a.events,...b.events]})},
 };
 runInNewContext(source.slice(start,end)+';globalThis.result={load,getIssue:()=>storageIntegrityIssue};',context);
 const data=context.result.load();
 return {data,issue:context.result.getIssue(),records:storage};
}
const existing={schema:1,events:[{id:'tournoi-test'}]};
test('un tournoi lisible traverse le redémarrage',()=>{
 const b=boot({EPS_TOURNOIS_V1:JSON.stringify(existing)});
 assert.equal(b.data.events.length,1);
 assert.equal(b.issue,null);
});
test('un stockage inconnu bloque la réinitialisation et conserve ses octets',()=>{
 const raw='{"schema":999,"events":[{"id":"ancien"}]}';
 const b=boot({EPS_TOURNOIS_V1:raw});
 assert.equal(b.data.events.length,0);
 assert.equal(b.issue[0].raw,raw);
 assert.equal(b.records.get('EPS_TOURNOIS_V1'),raw);
});
test('la copie de secours valide prime sur une version courante illisible',()=>{
 const b=boot({EPS_TOURNOIS_V1:'{erreur',EPS_TOURNOIS_V1_BACKUP:JSON.stringify(existing)});
 assert.equal(b.data.events.length,1);
 assert.equal(b.issue,null);
});
test('une première installation reste autorisée',()=>{
 const b=boot({});
 assert.equal(b.data.events.length,0);
 assert.equal(b.issue,null);
});
