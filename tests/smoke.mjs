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
  'assets/signature-v6.css', 'assets/professional-v8.css', 'assets/final-v10.css', 'assets/public-v11.css', 'assets/customer-ux-v13.css', 'assets/v17-premium.css', 'assets/testimonials-v12.css', 'assets/catalog-v11.js', 'assets/customer-journey-v15.js', 'assets/testimonials-v12.js', 'assets/hero-campus-natural.jpg',
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
for(const f of ['programStudy','pathway','semester','courseCode','course'])assert.ok(html.includes('id="'+f+'"'), 'Missing academic field: '+f);
assert.ok(formJS.includes('RPL / Alih Kredit') || html.includes('RPL / Alih Kredit'),'RPL path missing');
assert.ok(!html.includes('class="hero-float"'),'AI-style hero overlay should be removed');
assert.ok(!html.includes('id="faculty"'),'Faculty input should be removed');
assert.ok(!html.includes('<span aria-hidden="true">*</span>'),'Visible required-field star markers should be removed');
assert.ok(!formJS.includes('<span aria-hidden="true">*</span>'),'Dynamic required-field stars should be removed');
assert.ok(!html.includes('class="hero-microproof"'),'Decorative hero symbols should be removed');
assert.ok(html.includes('Solusi Tepat untuk Kebutuhan'),'Requested hero copy missing');
assert.ok(html.includes('data-mode="SEMUA"'),'Missing all-campus tab');
assert.ok(formJS.includes('state.campuses};'),'All-campus option should cover the full dataset');
assert.ok(source('assets/customer-journey-v15.js').includes('window.location.href=url;'),'Review flow must open admin WhatsApp');
assert.ok(source('assets/customer-journey-v15.js').includes('https://wa.me/6285169728694?text='), 'Missing admin WhatsApp URL');
const domain=JSON.parse(source('domain-target.json'));
assert.equal(domain.requested_domain, 'hizvena.com');
assert.equal(domain.domain_status, 'requested_not_verified_or_connected');
console.log('HIZVENA smoke checks passed:', {campusCount,programCount,utCount});

assert.ok(html.includes('Solusi Tepat untuk Kebutuhan'), 'Requested headline');
assert.ok(!html.includes('Testimoni segera hadir'), 'No placeholder testimonials');
assert.ok(html.includes('id="designConsultForm"'), 'Separate design consultation');
assert.ok(html.includes('id="catalogDialog"'), 'Accessible catalog details');
const newCatalog=JSON.parse(source('data/catalog-v11.json'));
assert.ok(newCatalog.services.length>=12,'Catalog entries missing');
assert.ok(newCatalog.services.every(x=>x.name&&x.description&&x.price&&x.scope&&x.duration&&x.revision),'Catalog metadata incomplete');
assert.ok(source('assets/directory-v8.js').includes('window.HizvenaJourney.review('),'Academic review missing');

// Testimonial feature must remain hidden until permission-reviewed images exist.
const tData=JSON.parse(source('data/testimonials.json'));
assert.ok(Array.isArray(tData.items),'Testimonial manifest missing');
assert.equal(tData.items.length,7,'Seven individual testimonial records expected');
assert.ok(tData.items.every(x=>x.approved===true&&x.published===true&&x.privacyReviewed===true),'Seven reviewed testimonials should be active');
for(const item of tData.items){
  assert.ok(existsSync(file(item.src.slice(2))),'Missing testimonial image: '+item.src);
  const raw=readFileSync(file(item.src.slice(2)));
  assert.ok(raw.toString('ascii',0,4)==='RIFF'&&raw.toString('ascii',8,12)==='WEBP','Invalid WebP file: '+item.src);
  assert.ok(raw.length<5_000_000,'Oversized testimonial: '+item.src);
}
assert.equal(new Set(tData.items.map(x=>x.id)).size,7,'Each testimonial requires its own ID');
assert.ok(html.includes('id="testimoni" hidden'),'Testimonial gallery should be hidden before approval');
assert.ok(html.includes('id="testimonialLightbox"'),'Lightbox missing');
assert.ok(source('assets/testimonials-v12.js').includes('privacyReviewed===true'),'Privacy gate missing');
assert.ok(html.includes('assets/testimonials-v12.css'),'Gallery stylesheet missing');

// V15 customer journey integration assertions.
assert.ok(html.includes('id="orderReviewDialog"'), 'Missing consultation summary dialog');
assert.ok(html.includes('id="cara-pemesanan"'), 'Missing order process anchor');
assert.ok(html.includes('id="academicDeadline"'), 'Missing optional academic deadline');
assert.ok(html.includes('name="designPlatform"'), 'Missing design platform field');
const journeyJS=source('assets/customer-journey-v15.js');
assert.ok(journeyJS.includes('window.HizvenaJourney={setServices,select,lookup,review}'), 'Customer flow API missing');
assert.ok(source('assets/catalog-v11.js').includes('window.HizvenaJourney.select(svc)'), 'Catalog does not drive forms');
assert.ok(source('assets/directory-v8.js').includes('window.HizvenaJourney.review('), 'Academic form not integrated');
assert.ok(!source('assets/directory-v8.js').includes('window.confirm('), 'Remove legacy browser popup');
assert.ok(source('assets/catalog-v11.js').includes('window.HizvenaJourney.review('), 'Design review not integrated');

assert.ok(source('assets/catalog-v11.js').includes("activeGroup==='akademik'&&x.category!=='desain'"), 'Academic category must include UT and other academic services');

assert.ok(html.includes('data-catalog-filter="akademik"'),'Academic category link missing');
assert.ok(html.includes('data-catalog-filter="desain"'),'Design category link missing');
assert.ok(html.includes('id="orderReviewContinue"'),'Missing WhatsApp confirmation action');
assert.ok(!source('assets/catalog-v11.js').includes('window.confirm('),'Design form must not use browser confirm');
assert.ok(!html.includes("window.open(wa(lines.join("),'Legacy direct WhatsApp listener remains');

// Public social media hub — official handles supplied by the site owner.
assert.ok(html.includes('id="sosial-media"'), 'Social media section missing');
for (const url of [
 'https://www.tiktok.com/@hizvena_id',
 'https://www.instagram.com/hizvena.id/',
 'https://www.youtube.com/@hizvena_id'
]) {
 assert.ok(html.includes('href="'+url+'"'), 'Missing social channel: '+url);
}
assert.ok(html.includes('href="#sosial-media"'), 'Footer must link to social channels');
assert.ok(html.includes('class="social-connect-grid"'), 'Responsive social cards missing');
assert.ok(source('assets/customer-ux-v13.css').includes('@media(max-width:620px){.social-connect-grid{grid-template-columns:1fr'), 'Phone layout missing');
assert.ok(source('assets/customer-ux-v13.css').includes('@media(max-width:950px){.social-connect-grid{grid-template-columns:repeat(2'), 'Tablet layout missing');

assert.ok(html.includes('id="portofolio"'),'V17 portfolio missing');
assert.ok(html.includes('id="catalogSort"'),'V17 sorting missing');
assert.ok(source('assets/catalog-v11.js').includes("sort?.addEventListener"),'Sort not wired');
assert.ok(html.includes('Tiga Langkah Konsultasi'),'V17 process missing');
assert.ok(html.includes('Karya dan Hasil Layanan'),'Portfolio honest empty state missing');
assert.ok(html.includes('id="sosial-media"'),'Existing social hub missing');

assert.ok(html.includes("e.key==='Escape'&&nav.classList.contains('open')"),'Mobile Escape close missing');
assert.ok(html.includes("document.addEventListener('pointerdown'"),'Mobile outside-click close missing');
assert.ok(html.includes('aria-controls="nav"'),'Mobile menu control relationship missing');
