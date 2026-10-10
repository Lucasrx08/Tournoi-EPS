// Bib identities and duration wheels shared by creation and tournament settings.
export const BIBS=[
 {name:'Rouge',color:'#e74c3c'},{name:'Bleu',color:'#315ae8'},
 {name:'Vert',color:'#258d69'},{name:'Jaune',color:'#f4c430'},
 {name:'Orange',color:'#ef842c'},{name:'Violet',color:'#8355bc'},
 {name:'Rose',color:'#e05588'},{name:'Blanc',color:'#f7f7f2'},
 {name:'Noir',color:'#263038'},{name:'Bleu ciel',color:'#64b9dc'},
 {name:'Vert clair',color:'#90b956'},{name:'Bordeaux',color:'#973850'}
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
