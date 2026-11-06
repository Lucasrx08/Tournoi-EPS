import * as E from './engine.js';
import {REPORT_FONTS} from './report-font.js';
const racket=t=>['badminton','table'].includes(t.config.sport);
const val=n=>n===null||n===undefined?'Non renseigné':String(n);
export function reportSections(event){
 const summaries=[],profiles=[];
 for(const t of event.tournaments){
  const individual=racket(t),bonus=individual&&t.config.scoreMode==='bonus',local=E.racketPools(t),stats=E.standings(t),sport=E.SPORTS[t.config.sport].name;
  const groups=local?t.engine.groups.map(g=>({name:g.name,rows:E.poolStandings(t,g)})):[{name:'Classement général',rows:stats}];
  const columns=individual?['Rang','Joueur','Joués','V','N','D','Marqués']:['Rang','Équipe','Joués','V','N','D','Points'];
  summaries.push({kind:'ranking',title:local?'Classements par poule':'Classement général',subtitle:sport+' · '+(t.completed?'Résultats définitifs':'Résultats à la date de l’export'),note:individual?'V : victoires · N : nuls · D : défaites. Marqués : total des points au score.':'V : victoires · N : nuls · D : défaites. Points : points de classement.',columns,widths:[35,258,42,32,32,32,92],groups:groups.map(g=>({name:g.name,rows:g.rows.map(x=>({cells:[x.rank,x.name,x.played,x.wins,x.draws,x.losses,individual?x.for:x.points],color:x.color}))}))});
  for(const x of t.teams){
   const stat=stats.find(s=>s.id===x.id),pool=t.engine.groups.find(g=>g.ids.includes(x.id)),localRank=pool?E.poolStandings(t,pool).find(s=>s.id===x.id)?.rank:null;
   const rows=t.rotations.flatMap(r=>r.matches.filter(m=>m.status==='done'&&E.entrants(m).includes(x.id)).map(m=>{
    const side=E.ids(m.a).includes(x.id)?'a':'b',own=side==='a'?m.scoreA:m.scoreB,other=side==='a'?m.scoreB:m.scoreA,opponent=side==='a'?m.b:m.a,parts=E.scoreParts(t,m,side),result=own>other?'Victoire':own===other?'Match nul':'Défaite',points=own>other?t.config.winPoints:own===other?t.config.drawPoints:t.config.lossPoints;
    return {cells:['R'+(m.originNumber??r.number),E.label(t,opponent)+(m.phase||m.group?'\n'+[m.phase,m.group].filter(Boolean).join(' · '):''),own+' - '+other,result,individual?(bonus?'Normaux : '+val(parts.normal)+'\nBonus : '+val(parts.bonus):own+' points'):points+' pts classement'],result};
   }));
   profiles.push({kind:'profile',title:x.name,color:x.color,subtitle:sport+(pool?' · '+pool.name:'')+(localRank?' · Rang dans la poule : '+localRank:!local?' · Rang : '+stat.rank:''),stats:[['Joués',stat.played],['Victoires',stat.wins],['Nuls',stat.draws],['Défaites',stat.losses]],note:individual?'Points marqués : '+stat.for+(bonus?' · Normaux : '+val(stat.normalPoints)+' · Bonus : '+val(stat.bonusPoints):''):'Points de classement : '+stat.points+' · Marqués : '+stat.for+' · Encaissés : '+stat.against,columns:['Match','Adversaire / phase','Score','Résultat',individual?'Points marqués':'Classement'],widths:[42,208,65,90,118],groups:[{name:'Matchs joués · '+rows.length,rows}],empty:'Aucun match validé pour ce participant.'});
  }
 }
 return [...summaries,...profiles];
}
const ansi=s=>String(s??'').replace(/[–—]/g,'-').replace(/[’‘]/g,"'").replace(/œ/g,'oe').replace(/Œ/g,'OE').replace(/[^\x0a\x20-\xff]/g,'');
const escape=s=>ansi(s).replace(/[\\()]/g,'\\$&').replace(/\n/g,' ');
function wrap(value,width,size){const limit=Math.max(1,Math.floor(width/(size*.61))),out=[];for(const paragraph of ansi(value).split('\n')){let line='';for(let word of paragraph.split(/\s+/)){while(word.length>limit){if(line){out.push(line);line='';}out.push(word.slice(0,limit));word=word.slice(limit);}if(line.length+word.length+1>limit){out.push(line);line=word;}else line+=(line?' ':'')+word;}out.push(line);}return out;}
export function tournamentPdf(event,now=new Date()){
 const sections=reportSections(event),pages=[];let content='',page=0,y=0;
 const rgb=c=>/^#[0-9a-f]{6}$/i.test(c??'')?c.slice(1).match(/../g).map(x=>(parseInt(x,16)/255).toFixed(3)).join(' '):'0.12 0.12 0.13';
 const rect=(x,y,w,h,c)=>{content+=`${rgb(c)} rg ${x} ${y} ${w} ${h} re f\n`;};
 const text=(x,y,size,s,bold=false,c='#202022')=>{content+=`${rgb(c)} rg BT /${bold?'F2':'F1'} ${size} Tf ${x} ${y} Td (${escape(s)}) Tj ET\n`;};
 function finish(){if(!content)return;text(36,25,8,'Créé par L. RIGAUX · Le Bon Sauveur');text(475,25,8,'Page '+page);pages.push(content);content='';}
 function start(section,suite=false){finish();page++;rect(0,806,595,36,'#202022');text(36,819,13,'TOURNOI EPS',true,'#dcff56');text(405,819,8,now.toLocaleDateString('fr-FR'),false,'#ffffff');
  y=780;for(const line of wrap(event.title||'Tournoi EPS',523,11)){text(36,y,11,line);y-=15;}
  y-=12;for(const line of wrap(section.title+(suite?' · suite':''),515,23)){text(36,y,23,line,true);y-=28;}
  if(section.color)rect(26,y+5,4,28,section.color);
  for(const line of wrap(section.subtitle,523,10)){text(36,y-2,10,line,false,'#59604d');y-=14;}y-=18;
  if(section.stats){const w=523/4;section.stats.forEach(([label,value],i)=>{rect(36+i*w,y-48,w-5,48,'#f0f2e9');text(46+i*w,y-15,9,label);text(46+i*w,y-37,20,value,true);});y-=65;}
  for(const line of wrap(section.note,523,9)){text(36,y,9,line);y-=13;}y-=16;
 }
 function header(section){rect(36,y-25,523,25,'#202022');let x=36;section.columns.forEach((c,i)=>{text(x+6,y-16,8,c,true,'#ffffff');x+=section.widths[i];});y-=25;}
 for(const section of sections){start(section);for(const group of section.groups){if(y<115)start(section,true);text(36,y,12,group.name,true);y-=12;header(section);
  if(!group.rows.length){text(42,y-24,10,section.empty??'Aucun résultat.');y-=45;}
  const size=section.kind==='ranking'&&group.rows.length>28?8:10;
  group.rows.forEach((row,index)=>{const lines=row.cells.map((c,i)=>wrap(c,section.widths[i]-12,size)),height=Math.max(27,Math.max(...lines.map(l=>l.length))*(size+3)+14);
   if(y-height<52){start(section,true);text(36,y,12,group.name+' · suite',true);y-=12;header(section);}
   rect(36,y-height,523,height,index%2?'#f0f2e9':'#ffffff');if(row.color)rect(36,y-height,3,height,row.color);
   let x=36;lines.forEach((ls,i)=>{ls.forEach((line,j)=>text(x+6,y-17-j*(size+3),size,line,i===1||i===3,row.result==='Victoire'&&i===3?'#147d49':row.result==='Défaite'&&i===3?'#a63232':'#202022'));x+=section.widths[i];});y-=height;
  });y-=24;
 }}finish();
 const objects=[null],add=s=>(objects.push(s),objects.length-1);
 const embed=f=>{const bytes=atob(f.data),file=add(`<< /Length ${bytes.length} /Length1 ${bytes.length} >>\nstream\n${bytes}\nendstream`),descriptor=add(`<< /Type /FontDescriptor /FontName /${f.name} /Flags 32 /FontBBox [${f.bbox.join(' ')}] /ItalicAngle 0 /Ascent ${f.ascent} /Descent ${f.descent} /CapHeight 730 /StemV 80 /FontFile2 ${file} 0 R >>`);return add(`<< /Type /Font /Subtype /TrueType /BaseFont /${f.name} /FirstChar 32 /LastChar 255 /Widths [${f.widths.join(' ')}] /Encoding /WinAnsiEncoding /FontDescriptor ${descriptor} 0 R >>`);};
 const f1=embed(REPORT_FONTS[0]),f2=embed(REPORT_FONTS[1]),parent=add(''),ids=[];
 for(const page of pages){const stream=add(`<< /Length ${page.length} >>\nstream\n${page}endstream`);ids.push(add(`<< /Type /Page /Parent ${parent} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${stream} 0 R >>`));}
 objects[parent]=`<< /Type /Pages /Kids [${ids.map(i=>i+' 0 R').join(' ')}] /Count ${ids.length} >>`;const root=add(`<< /Type /Catalog /Pages ${parent} 0 R >>`);let output='%PDF-1.4\n%âãÏÓ\n',offsets=[];objects.slice(1).forEach((o,i)=>{offsets.push(output.length);output+=`${i+1} 0 obj\n${o}\nendobj\n`;});const xref=output.length;output+=`xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.map(x=>String(x).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objects.length} /Root ${root} 0 R >>\nstartxref\n${xref}\n%%EOF`;return Uint8Array.from(output,c=>c.charCodeAt(0)&255);
}
