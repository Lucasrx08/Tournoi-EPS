import {mergeLists} from './rosters.js';
// Merge by tournament identity, never by replacing an entire device snapshot.
export function mergeSnapshots(a,b){
 if(!b)return structuredClone(a);if(!a)return structuredClone(b);
 const deleted={...a.deleted};for(const [id,time] of Object.entries(b.deleted??{}))deleted[id]=Math.max(deleted[id]??0,time);
 const events=new Map();for(const source of [a,b])for(const event of source.events??[]){const time=event.savedAt??source.updatedAt??0,previous=events.get(event.id);if((deleted[event.id]??-1)>=time)continue;if(!previous||time>previous.savedAt)events.set(event.id,{...structuredClone(event),savedAt:time});}
 const newest=(b.updatedAt??0)>(a.updatedAt??0)?b:a,activeId=events.has(a.activeId)?a.activeId:events.has(b.activeId)?b.activeId:null;
 return {...structuredClone(newest),schema:1,events:[...events.values()],deleted,activeId,rosters:mergeLists(a.rosters,b.rosters),updatedAt:Math.max(a.updatedAt??0,b.updatedAt??0),revision:Math.max(a.revision??0,b.revision??0)};
}
