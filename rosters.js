import * as E from './engine.js';
import * as R from './rackets.js';

export function validLists(lists){return lists===undefined||Array.isArray(lists)&&lists.length<=200&&lists.every(l=>typeof l.id==='string'&&typeof l.title==='string'&&l.title.length<=80&&Array.isArray(l.players)&&l.players.length>=2&&l.players.length<=128&&new Set(l.players.map(p=>p.id)).size===l.players.length&&l.players.every(p=>typeof p.id==='string'&&typeof p.fullName==='string'&&p.fullName.trim()&&p.fullName.length<=100));}
export function playersFromTeams(teams){
 return teams.flatMap(t=>{
  const named=(t.members??[]).filter(p=>!p.placeholder);
  return (named.length?named:[{fullName:t.name,studentId:t.studentId}]).map(p=>({id:p.studentId??p.id??E.uid(),fullName:(named.length===1&&t.nameEdited?t.name:R.playerName(p)).trim().slice(0,100),first:p.first??'',last:p.last??'',className:p.className??'',color:t.color,level:p.level??t.level??0}));
 });
}
export function saveList(data,teams,title,id=null){
 title=String(title??'').trim().slice(0,80);if(!title)throw Error('Donnez un nom à la liste, par exemple « 3e Gaudi ».');
 const players=playersFromTeams(teams);if(players.length<2||players.length>128)throw Error('Conservez entre 2 et 128 élèves.');
 data.rosters??=[];const previous=data.rosters.find(l=>l.id===id),merged=new Map((previous?.players??[]).map(p=>[p.id,p])),claimed=new Set();
 const identity=p=>[p.fullName,p.className??''].map(s=>s.trim().normalize('NFC').toLocaleLowerCase('fr')).join('|');
 for(const player of players){if(!merged.has(player.id)){const known=previous?.players.find(p=>!claimed.has(p.id)&&identity(p)===identity(player));if(known)player.id=known.id;}claimed.add(player.id);}
 for(const player of players)merged.set(player.id,player);
 const list={id:previous?.id??E.uid(),title,players:[...merged.values()],updatedAt:Date.now()};
 if(!validLists([list]))throw Error('Vérifiez les noms et les doublons dans cette liste.');
 if(previous)data.rosters[data.rosters.indexOf(previous)]=list;else{if(data.rosters.length>=200)throw Error('Maximum : 200 listes enregistrées.');data.rosters.push(list);}
 // Carry stable pupil identities into the next save, including manually typed names.
 let index=0;for(const t of teams){const named=(t.members??[]).filter(p=>!p.placeholder);if(named.length)for(const p of named)p.studentId=players[index++].id;else t.studentId=players[index++].id;}
 return list;
}
export function participants(list){if(!validLists([list]))throw Error('Cette liste est invalide.');return list.players.map(p=>({...structuredClone(p),id:E.uid(),studentId:p.id,courtNumber:null,placeholder:false}));}
export function mergeLists(current=[],incoming=[]){
 if(!validLists(current)||!validLists(incoming))throw Error('Une liste d’élèves de la sauvegarde est invalide.');
 const lists=new Map(current.map(l=>[l.id,structuredClone(l)]));
 for(const list of incoming){const old=lists.get(list.id);if(!old)lists.set(list.id,structuredClone(list));else{const newer=(list.updatedAt??0)>=(old.updatedAt??0)?list:old,older=newer===list?old:list,players=new Map(older.players.map(p=>[p.id,p]));newer.players.forEach(p=>players.set(p.id,p));lists.set(list.id,{...structuredClone(newer),players:structuredClone([...players.values()])});}}
 const result=[...lists.values()];if(!validLists(result))throw Error('La sauvegarde dépasse la capacité des listes.');return result;
}
