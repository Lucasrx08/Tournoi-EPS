// Bib identities and duration wheels shared by creation and tournament settings.
export const BIBS=[
 {name:'Bleu clair',color:'#66c8f1'},{name:'Bleu foncé',color:'#2145b8'},
 {name:'Vert clair',color:'#a1dc67'},{name:'Vert foncé',color:'#16824b'},
 {name:'Orange',color:'#ff8a32'},{name:'Rouge',color:'#ef4055'},
 {name:'Jaune fluo',color:'#dfff00'},{name:'Jaune',color:'#ffd53c'},
 {name:'Rose',color:'#ffadcf'},{name:'Fuchsia',color:'#e7249a'},
 {name:'Blanc',color:'#ffffff'}
];
export function bibIdentity(index){const x=BIBS[index%BIBS.length];return {...x,name:x.name+(index>=BIBS.length?' · '+String.fromCharCode(65+Math.floor(index/BIBS.length)):'')}}
export function colorName(color){
 if(!/^#[0-9a-f]{6}$/i.test(color??''))return 'Chasuble';
 const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),a=rgb(color);
 return BIBS.slice().sort((x,y)=>rgb(x.color).reduce((s,n,i)=>s+(n-a[i])**2,0)-rgb(y.color).reduce((s,n,i)=>s+(n-a[i])**2,0))[0].name;
}
export function setBibColor(team,color,teams){
 team.color=color;
 if(!team.bibNamed)return;
 const base=colorName(color);let name=base,index=0;
 while(teams.some(x=>x!==team&&x.name.toLocaleLowerCase('fr-FR')===name.toLocaleLowerCase('fr-FR')))name=base+' · '+String.fromCharCode(65+index++);
 team.name=name;
}
export const TIME_LIMITS={availableMinutes:{min:60,max:36000,hours:true},setupMinutes:{min:0,max:3600},breakSeconds:{min:0,max:300},duration:{min:15,max:7200}};
export function durationParts(seconds,hours=false){seconds=Math.max(0,Math.round(Number(seconds)||0));return {hours:hours?Math.floor(seconds/3600):0,minutes:hours?Math.floor(seconds/60)%60:Math.floor(seconds/60),seconds:seconds%60}}
export function changeDuration(seconds,unit,value,limits){
 const parts=durationParts(seconds,!!limits.hours);parts[unit]=Math.round(Number(value)||0);
 return Math.min(limits.max,Math.max(limits.min,parts.hours*3600+parts.minutes*60+parts.seconds));
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function durationWheel(label,field,seconds){
 const limits=TIME_LIMITS[field],parts=durationParts(seconds,!!limits.hours),units=limits.hours?['hours','minutes','seconds']:['minutes','seconds'];
 const labels={hours:'heures',minutes:'minutes',seconds:'secondes'};
 return `<fieldset class="duration-picker"><legend>${escape(label)}</legend><div class="wheel-group">${units.map(unit=>{const max=unit==='hours'?Math.floor(limits.max/3600):unit==='minutes'&&!limits.hours?Math.floor(limits.max/60):59;return `<div class="wheel-column"><span class="wheel-unit">${labels[unit]}</span><div class="wheel-window"><div class="time-wheel" role="listbox" tabindex="0" aria-label="${escape(label)} : ${labels[unit]}" data-wheel-field="${field}" data-wheel-unit="${unit}" data-wheel-current="${parts[unit]}">${Array.from({length:max+1},(_,i)=>`<div class="wheel-option" role="option" id="wheel-${field}-${unit}-${i}" data-wheel-value="${i}" aria-selected="${i===parts[unit]}">${String(i).padStart(2,'0')}</div>`).join('')}</div></div></div>`}).join('')}</div></fieldset>`;
}
export function mountWheels(root,onChange){
 for(const wheel of root.querySelectorAll('[data-wheel-field]')){
  const options=[...wheel.querySelectorAll('[data-wheel-value]')],row=options[0]?.getBoundingClientRect().height||32;
  let selected=Number(wheel.dataset.wheelCurrent),timer;
  const commit=value=>{value=Math.max(0,Math.min(options.length-1,value));wheel.scrollTop=value*row;if(value===selected)return;selected=value;onChange(wheel.dataset.wheelField,wheel.dataset.wheelUnit,value)};
  wheel.scrollTop=selected*row;wheel.setAttribute('aria-activedescendant',options[selected].id);
  wheel.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(()=>{if(wheel.isConnected)commit(Math.round(wheel.scrollTop/row))},140)},{passive:true});
  wheel.addEventListener('click',e=>{const option=e.target.closest('[data-wheel-value]');if(option)commit(Number(option.dataset.wheelValue))});
  wheel.addEventListener('keydown',e=>{let value;if(['ArrowDown','ArrowUp'].includes(e.key))value=selected+(e.key==='ArrowDown'?1:-1);else if(e.key==='PageDown'||e.key==='PageUp')value=selected+(e.key==='PageDown'?5:-5);else if(e.key==='Home')value=0;else if(e.key==='End')value=options.length-1;if(value!==undefined){e.preventDefault();const field=wheel.dataset.wheelField,unit=wheel.dataset.wheelUnit;commit(value);root.querySelector(`[data-wheel-field="${field}"][data-wheel-unit="${unit}"]`)?.focus()}});
 }
}

// Keep a readable minimum cell size; large sets scroll inside the board.
export function courtLayout(count,width,height,referees=false,bonus=false){
 const dense=count>=8,gap=10,minWidth=dense?190:width<580?220:235,minHeight=dense?190+(referees?32:0)+(bonus?48:0):(referees?250:230)+(bonus?24:0);
 const max=Math.max(1,Math.min(6,count,Math.floor((width+gap)/(minWidth+gap))));
 if(count<=3&&max>=count)return {cols:count,rows:1,minHeight};
 const options=Array.from({length:max},(_,i)=>{const cols=i+1,rows=Math.ceil(count/cols),w=(width-gap*(cols-1))/cols,h=(height-gap*(rows-1))/rows;return {cols,rows,fits:h>=minHeight,cost:Math.abs(Math.log(Math.max(.1,w/h)/1.35))+(cols*rows-count)*.08}});
 const fitting=options.filter(x=>x.fits),choice=fitting.length?fitting.sort((a,b)=>a.cost-b.cost)[0]:options[max-1];
 return {cols:choice.cols,rows:choice.rows,minHeight};
}
export function courtTypography(width,height,referees=false,bonus=false,dense=false){
 if(dense){const scoreSpace=Math.max(32,(height-28-60-8-20-4-(referees?32:0)-(bonus?48:0))/2);return {scoreSize:Math.max(32,Math.min(36,Math.floor(width*.16),Math.floor(scoreSpace))),nameSize:13,identityHeight:32,scoreSpace}}
 const nameSize=width>=360?18:16,identityHeight=nameSize===18?48:44;
 const scoreSpace=Math.max(32,height-32-84-8-20-4-identityHeight-(referees?18:0)-(bonus?24:0));
 return {scoreSize:Math.max(32,Math.min(132,Math.floor(width*.22),Math.floor(scoreSpace))),nameSize,identityHeight,scoreSpace};
}
let courtObserver;
export function mountCourtLayout(root,referees=false,bonus=false){
 courtObserver?.disconnect();const grid=root.querySelector('.courts-grid');if(!grid)return;
 const fit=()=>{const x=courtLayout(grid.children.length,grid.clientWidth,grid.clientHeight,referees,bonus);grid.style.setProperty('--cols',x.cols);grid.style.setProperty('--rows',x.rows);grid.style.setProperty('--court-min',x.minHeight+'px');const width=(grid.clientWidth-10*(x.cols-1))/x.cols,available=Math.max(x.minHeight,(grid.clientHeight-10*(x.rows-1))/x.rows),height=grid.children.length>=8?available:Math.min(available,Math.max(x.minHeight,width*.5+140));grid.style.setProperty('--court-height',Math.floor(height)+'px');const m=courtTypography(width,height,referees,bonus,grid.children.length>=8);grid.style.setProperty('--score-size',m.scoreSize+'px');grid.style.setProperty('--name-size',m.nameSize+'px');grid.style.setProperty('--identity-height',m.identityHeight+'px')};
 fit();if(typeof ResizeObserver!=='undefined'){courtObserver=new ResizeObserver(fit);courtObserver.observe(grid)}
}
export function mountCourtDrag(root,onMove){
 for(const handle of root.querySelectorAll('[data-court-handle]')){
  let start=null,zone=null,dragging=false;
  const clear=()=>{zone?.classList.remove('drop-active');handle.closest('[data-court-player]')?.classList.remove('dragging');start=null;zone=null;dragging=false};
  handle.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;start={x:e.clientX,y:e.clientY,id:e.pointerId};handle.setPointerCapture(e.pointerId)});
  handle.addEventListener('pointermove',e=>{if(!start)return;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)<8&&!dragging)return;dragging=true;e.preventDefault();handle.closest('[data-court-player]').classList.add('dragging');const next=root.ownerDocument.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-court]');if(next!==zone){zone?.classList.remove('drop-active');zone=next;zone?.classList.add('drop-active')}});
  handle.addEventListener('pointerup',e=>{if(!start)return;const id=handle.closest('[data-court-player]').dataset.courtPlayer,target=zone?.dataset.dropCourt,moved=dragging;clear();if(moved){e.preventDefault();if(target)onMove(id,Number(target))}});
  handle.addEventListener('pointercancel',clear);handle.addEventListener('lostpointercapture',clear);
 }
}
