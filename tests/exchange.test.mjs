import test from 'node:test';
import assert from 'node:assert/strict';
import {inflateRawSync} from 'node:zlib';
import * as X from '../dist/exchange.js';
test('Modèle joueurs : deux colonnes, noms complets et terrain facultatif',()=>{
 const sh=X.playerTemplate(28,3);assert.deepEqual(sh.rows[0],['Nom et prénom','Numéro de terrain']);assert.ok(sh.rows.slice(1).every(r=>r[0]===''&&r[1]>=1&&r[1]<=3));
 assert.deepEqual(X.participantsFromRows(sh.rows),[]);
 const f=X.unzip(X.xlsx([sh])),xml=new TextDecoder().decode(f['xl/worksheets/sheet1.xml']);assert.ok(xml.includes('Nom et prénom'));assert.ok(xml.includes('Numéro de terrain'));assert.ok(xml.includes('width="38"'));
 const p=X.participantsFromRows(X.parseDelimited(X.csv([sh.rows[0],['LE ROY Zoé',2],['Nguyen An','']])));assert.equal(p[0].fullName,'LE ROY Zoé');assert.equal(p[0].courtNumber,2);assert.equal(p[1].courtNumber,null);
});
test('Import terrains : valeurs invalides refusées et ligne exacte indiquée',()=>{
 for(const n of[0,-1,25,1.5,'A',Infinity])assert.throws(()=>X.participantsFromRows([['Nom et prénom','Numéro de terrain'],['',1],['Inès Martin',n]]),/Ligne 3/);
 const old=X.participantsFromRows([['Nom','Prénom'],['Martin','Inès']]);assert.equal(old[0].last,'Martin');assert.equal(old[0].first,'Inès');assert.equal(old[0].courtNumber,null);
});
test('CSV et collage : accents, séparateurs, guillemets et lignes multiples',()=>{const rows=X.parseDelimited('NOM\tPrénom\tClasse\tSexe\nRIGAUX\tLucas\t6e Avignon\tM\n"LE; ROY"\t"Zoé"\t5e\tF');const p=X.participantsFromRows(rows);assert.equal(p[1].first,'Zoé');assert.equal(p[1].last,'LE; ROY');assert.equal(p[0].className,'6e Avignon');assert.equal(X.parseDelimited('Nom;Prénom\r\n"DUPONT";"Lou"')[1][1],'Lou');assert.throws(()=>X.parseDelimited('Nom;Prénom\n"nom;test'))});
test('XLSX : vrais fichiers OpenXML, noms et couleurs conservés',()=>{const bytes=X.xlsx([{name:'Classement',rows:[['Équipe','Points'],['Bleus',3],['Rouges',1]],colors:['','#315ae8','#e0556c']}]);const f=X.unzip(bytes,b=>inflateRawSync(b));assert.ok(f['xl/workbook.xml']);const sheet=new TextDecoder().decode(f['xl/worksheets/sheet1.xml']);const styles=new TextDecoder().decode(f['xl/styles.xml']);assert.ok(sheet.includes('Bleus'));assert.ok(sheet.includes('<v>3</v>'));assert.ok(styles.includes('FF315AE8'));assert.ok(styles.includes('FFE0556C'))});
test('CSV : protège les cellules contre l’interprétation de formules',()=>{assert.ok(X.csv([['=HYPERLINK("x")',-2]]).includes("'=HYPERLINK"));assert.ok(X.csv([['x',-2]]).includes('"-2"'))});
test('PDF : téléchargement binaire avec pages, xref et accents',()=>{const b=X.pdf([{name:'Classement',rows:[['Rang','Équipe'],...Array.from({length:45},(_,i)=>[i+1,'Équipe élève '+i])]}],'Tournoi EPS');const s=String.fromCharCode(...b);assert.ok(s.startsWith('%PDF-1.4'));assert.ok(s.includes('/Count 3'));assert.ok(s.includes('Équipe'));const start=Number(s.match(/startxref\n(\d+)/)[1]);assert.equal(s.slice(start,start+4),'xref')});
