// Pool composition is independent of sport scoring and court allocation.
export const FORMULAS=['pools','poolfinal','levels','poolladder','levelsladder'];
export const hasPools=value=>FORMULAS.includes(typeof value==='string'?value:value?.formula);
export function validate(assignments,teams,sizes=assignments?.map(g=>g.length)){
 const ids=teams.map(x=>x.id),flat=assignments?.flat()??[];
 if(!Array.isArray(assignments)||!assignments.length||assignments.some((g,i)=>!Array.isArray(g)||g.length<2||g.length!==sizes?.[i])||flat.length!==ids.length||new Set(flat).size!==ids.length||flat.some(id=>!ids.includes(id)))throw Error('Chaque participant doit appartenir à une seule poule, avec au moins deux participants par poule.');
 return assignments;
}
export function arrange(teams,sizes,leveled=false,previous=null){
 if(!sizes.length||sizes.some(n=>!Number.isInteger(n)||n<2)||sizes.reduce((a,b)=>a+b,0)!==teams.length)throw Error('Les effectifs des poules doivent correspondre au nombre de participants.');
 const ordered=teams.slice().sort((a,b)=>(a.seedRank??Infinity)-(b.seedRank??Infinity)||(b.level??0)-(a.level??0)).map(x=>x.id),groups=sizes.map(()=>[]),used=new Set();
 if(previous)groups.forEach((g,i)=>{for(const id of previous[i]??[])if(ordered.includes(id)&&!used.has(id)&&g.length<sizes[i]){g.push(id);used.add(id);}});
 const rest=ordered.filter(id=>!used.has(id));
 if(leveled){for(let i=0;i<groups.length;i++)while(rest.length&&groups[i].length<sizes[i])groups[i].push(rest.shift());}
 else{let reverse=false;while(rest.length){const targets=groups.map((g,i)=>i);if(reverse)targets.reverse();for(const i of targets)if(rest.length&&groups[i].length<sizes[i])groups[i].push(rest.shift());reverse=!reverse;}}
 return groups;
}
export function move(assignments,id,target){
 if(!Number.isInteger(target)||target<0||target>=assignments.length||!assignments.some(g=>g.includes(id)))throw Error('Choisissez un participant et une poule.');
 const result=assignments.map(g=>g.filter(x=>x!==id));result[target].push(id);return result;
}
