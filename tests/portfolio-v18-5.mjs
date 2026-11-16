import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const h=read('index.html'),m=JSON.parse(read('data/portfolio-v18-5.json'));
assert.equal(m.works.length,13);
assert.equal(new Set(m.works.map(x=>x.id)).size,13);
assert.ok(h.includes('id="portfolioGallery"')&&h.includes('id="portfolioDetail"'));
assert.ok(h.includes('./assets/portfolio-v18-5.css')&&h.includes('./assets/portfolio-v18-5.js'));
assert.ok(h.includes('rel="canonical" href="https://hizvena.pages.dev/"'));
assert.ok(h.includes('property="og:url" content="https://hizvena.pages.dev/"'));
assert.ok(read('sitemap.xml').includes('https://hizvena.pages.dev/'));
assert.ok(read('robots.txt').includes('https://hizvena.pages.dev/sitemap.xml'));
const js=read('assets/portfolio-v18-5.js');
assert.ok(js.includes('w.publicApproved===true')&&js.includes("w.reviewStatus==='APPROVED'"));
execFileSync(process.execPath,['--check',new URL('../assets/portfolio-v18-5.js',import.meta.url).pathname]);
for(const w of m.works){
 assert.ok(w.id&&w.title&&w.category&&w.description);
 assert.match(w.src,/^\.\/assets\/portfolio\/[a-z0-9-]+\.webp$/);
 if(w.publicApproved===true){
  assert.equal(w.reviewStatus,'APPROVED');
  assert.ok(existsSync(new URL('../'+w.src.slice(2),import.meta.url)),'Approved portfolio image missing: '+w.src);
 }else assert.notEqual(w.reviewStatus,'APPROVED','Unapproved works must not be marked approved');
}
console.log('V18.5 portfolio, approval gating, canonical SEO passed');
