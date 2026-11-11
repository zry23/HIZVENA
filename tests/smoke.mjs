// HIZVENA smoke checks — run with: node tests/smoke.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
const file = path => new URL(path, root);
const source = path => readFileSync(file(path), 'utf8');
const html = source('index.html');
const requiredAssets = [
  'assets/design-v2.css', 'assets/design-v2.js',
  'assets/directory-v3.css', 'assets/directory-v8.js',
  'assets/design-v4.css', 'assets/polish-v5.css',
  'assets/signature-v6.css', 'assets/professional-v8.css', 'assets/hero-campus-natural.jpg',
  'assets/hizvena-favicon.png',
];
for (const asset of requiredAssets) {
  assert.ok(existsSync(file(asset)), 'Missing asset: ' + asset);
  if (asset.endsWith('.css') || asset.endsWith('.js'))
    assert.ok(html.includes('./' + asset), 'HTML does not load: ' + asset);
}
assert.match(html, /HIZVENA/);
assert.match(html, /6285169728694/);
assert.match(html, /id="consultForm"/);
for (const script of requiredAssets.filter(x=>x.endsWith('.js'))) {
  execFileSync(process.execPath, ['--check', file(script).pathname]);
}
const campusData = JSON.parse(gunzipSync(readFileSync(file('data/hizvena-indonesia-campus-directory.json.gz'))));
const programData = JSON.parse(gunzipSync(readFileSync(file('data/hizvena-indonesia-campus-programs.json.gz'))));
const utData = JSON.parse(gunzipSync(readFileSync(file('data/hizvena-ut-s1-course-index-v2.json.gz'))));
const campusCount = campusData.universities?.length ?? 0;
const programCount = Object.values(programData.programsByCampus ?? {}).reduce((sum, arr)=> sum+arr.length,0);
const utCount = utData.courses?.length ?? 0;
assert.ok(campusCount >= 4000, 'Campus dataset unexpectedly small');
assert.ok(programCount >= 30000, 'Program dataset unexpectedly small');
assert.ok(utCount >= 2000, 'UT dataset unexpectedly small');
const formJS=source('assets/directory-v8.js');
assert.ok(formJS.includes('id="customerName"'), 'Missing order name field');
assert.ok(formJS.includes('id="customerWhatsApp"'), 'Missing order WhatsApp field');
assert.ok(formJS.includes('campus.value===state.campus.name'), 'Campus focus regression');
for(const f of ['faculty','programStudy','pathway','semester','courseCode','course'])assert.ok(html.includes('id="'+f+'"'), 'Missing academic field: '+f);
assert.ok(formJS.includes('RPL / Alih Kredit') || html.includes('RPL / Alih Kredit'),'RPL path missing');
assert.ok(!html.includes('class="hero-float"'),'AI-style hero overlay should be removed');
assert.ok(formJS.includes("https://wa.me/6285169728694?text="), 'Missing admin WhatsApp URL');
const domain=JSON.parse(source('domain-target.json'));
assert.equal(domain.requested_domain, 'hizvena.com');
assert.equal(domain.domain_status, 'requested_not_verified_or_connected');
console.log('HIZVENA smoke checks passed:', {campusCount,programCount,utCount});
