// V18.3 public catalogue and trust-boundary regression checks.
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const file=p=>new URL('../'+p,import.meta.url);
const read=p=>readFileSync(file(p),'utf8');
const html=read('index.html'),data=JSON.parse(read('data/bank-soal-preview-v18-2.json')),catalog=JSON.parse(read('data/catalog-v11.json'));
assert.equal(data.visibility,'cover-only');
assert.ok(data.documents.length>=2);
assert.ok(data.documents.some(x=>x.courseCode==='FSIK4107'&&x.questionCount===50&&x.pages===26));
assert.ok(data.documents.some(x=>x.courseCode==='FSIK4309'&&x.questionCount===50&&x.pages===21&&x.academicYear==='2026/2027'));
assert.ok(html.includes('Promo Spesial Layanan Akademik'));
assert.ok(html.includes('UT, PTN, dan PTS'));
assert.ok(read('assets/customer-journey-v15.js').includes("'Diskusi Tuton UT':'ut-diskusi'"),'Legacy UT consultation must retain promo price');

assert.ok(html.includes('id="ut-library"')&&html.includes('id="bantuan"'));
for(const asset of ['assets/ut-library-v18-3.js','assets/ut-library-v18-3.css']){assert.ok(existsSync(file(asset)));assert.ok(html.includes('./'+asset))}
execFileSync(process.execPath,['--check',file('assets/ut-library-v18-3.js').pathname]);
const ids=new Set(catalog.services.map(x=>x.id));assert.equal(ids.size,12);
for(const [id,original,promo] of [['ut-bank','Rp54.000','Rp29.000'],['ut-diskusi','Rp39.000','Rp19.000']]){
 const s=catalog.services.find(s=>s.id===id);assert.ok(s);assert.ok(s.originalPrice.includes(original));assert.ok(s.price.includes(promo));assert.equal(s.category,'akademik-umum');
}
for(const doc of data.documents){
 assert.equal(doc.downloadPublic,false);
 assert.ok(doc.title&&doc.courseCode&&doc.questionCount>0&&doc.pages>0);
 assert.ok(doc.cover.startsWith('./assets/'));
 assert.ok(existsSync(file(doc.cover.replace('./',''))));
 assert.ok(!/\.pdf(?:$|\?)/i.test(doc.cover),'Paid PDF cannot be a public cover');
 assert.ok(ids.has(doc.serviceId));
}
assert.ok(!/href="[^"]+\.pdf"/i.test(html),'No publicly linked paid PDF');
console.log('V18.3 UT library and privacy checks passed');
