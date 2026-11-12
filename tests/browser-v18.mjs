// Browser regression scenarios for V18. Run: npm install --no-save playwright && node tests/browser-v18.mjs
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.env.HIZVENA_TEST_URL||'http://127.0.0.1:8765/';
const widths=[320,375,390,768,1024,1440,1920];
const browser=await chromium.launch({headless:true});
const issues=[];let passes=0;
const check=async(name,fn)=>{try{await fn();passes++;console.log('PASS',name)}catch(error){issues.push({name,error:String(error)});console.error('FAIL',name,error)}};
async function openPage(width=390){
 const page=await browser.newPage({viewport:{width,height:800},deviceScaleFactor:1,acceptDownloads:false});
 page.on('pageerror',e=>issues.push({name:'Browser exception '+width,error:e.message}));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.locator('#catalogCount').getByText('layanan ditemukan').waitFor({timeout:15000}).catch(()=>{});
 return page;
}
try{
 for(const width of widths){
  await check('No horizontal overflow at '+width+'px',async()=>{
   const page=await openPage(width);
   try{
    const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
    if(dims.scroll>dims.client+2){const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,className:String(e.className||'').slice(0,80),id:e.id,right:Math.round(e.getBoundingClientRect().right),width:Math.round(e.getBoundingClientRect().width)})).filter(x=>x.right>document.documentElement.clientWidth+2).sort((a,b)=>b.right-a.right).slice(0,12));throw new Error(JSON.stringify({dims,offenders}))}
    assert.equal(await page.locator('.v18-floating-wa').count(),1);
    assert.equal(await page.locator('.social-connect-card').count(),4);
   }finally{await page.close()}
  });
 }
 await check('Canonical catalogue, type filtering and service details',async()=>{
  const page=await openPage(1440);
  try{
   await page.waitForFunction(()=>document.querySelectorAll('.catalog-service').length===12,{timeout:15000});
   await page.locator('#catalogQuery').fill('poster');
   assert.equal(await page.locator('.catalog-service').count(),1);
   assert.ok((await page.locator('.catalog-service-price').innerText()).includes('Rp50.000'));
   await page.locator('#catalogQuery').fill('');
   await page.locator('#catalogType').selectOption('desain-cv');
   assert.equal(await page.locator('.catalog-service').count(),1);
   await page.locator('.catalog-service .btn.secondary').click();
   assert.ok(await page.locator('#catalogDialog').evaluate(el=>el.open));
   assert.ok((await page.locator('#catalogDialogPrice').innerText()).includes('Rp50.000'));
   await page.locator('#catalogClose').click();
   await page.locator('#catalogType').selectOption('semua');
   await page.locator('#catalogSort').selectOption('harga-asc');
   const prices=await page.locator('.catalog-service-price').allInnerTexts();
   assert.ok(prices[0].includes('Rp10.000'),prices[0]);
  }finally{await page.close()}
 });
 await check('Design wizard, validation, back navigation, review and official WhatsApp',async()=>{
  const page=await openPage(390);
  try{
   await page.locator('#catalogType').selectOption('desain-poster');
   await page.locator('.catalog-service-actions .btn:not(.secondary)').click();
   const f=page.locator('#designConsultForm');
   assert.ok(await f.locator('.v18-details').isVisible());
   await f.locator('input[name=customerName]').fill('Pelanggan Pengujian');
   await f.locator('input[name=customerWhatsApp]').fill('081234567891');
   await f.locator('textarea[name=designDetails]').fill('Desain poster promosi pengujian, ukuran A4');
   await f.locator('.v18-back').click();
   assert.ok(await f.locator('.v18-choice').isVisible());
   await f.locator('.v18-choice button').click();
   assert.equal(await f.locator('input[name=customerName]').inputValue(),'Pelanggan Pengujian');
   await f.locator('button[type=submit]').click();
   assert.ok(await page.locator('#orderReviewDialog').evaluate(el=>el.open));
   const review=await page.locator('#orderReviewData').innerText();
   assert.ok(review.includes('Poster Digital'));
   assert.ok(review.includes('Rp50.000'));
   assert.ok(review.includes('Pelanggan Pengujian'));
   let target='';
   await page.route('https://wa.me/**',async route=>{target=route.request().url();await route.fulfill({status:200,body:'WhatsApp test intercepted'})});
   await page.locator('#orderReviewContinue').click();
   await page.waitForURL(/wa\.me/, {timeout:7000});
   assert.ok(target.includes('6285169728694'),target);
   const msg=decodeURIComponent(target.split('text=')[1]||'');
   assert.ok(msg.includes('Poster Digital')&&msg.includes('Pelanggan Pengujian'),msg);
  }finally{await page.close()}
 });
 await check('Academic wizard, validation and review',async()=>{
  const page=await openPage(768);
  try{
   await page.locator('#catalogQuery').fill('Diskusi Akademik');
   await page.locator('.catalog-service .btn:not(.secondary)').first().click();
   const form=page.locator('#consultForm');
   assert.ok(await form.locator('.v18-details').isVisible());
   await form.locator('#customerName').fill('Pelanggan Akademik');
   await form.locator('#customerWhatsApp').fill('081234567892');
   // General-campus promo requires an explicit campus instead of assuming UT.
   await form.locator('#campus').fill('Universitas Terbuka');
   await form.locator('#programStudy').fill('Ilmu Komunikasi');
   await form.locator('#semester').selectOption('2');
   await form.locator('#course').fill('Komunikasi Dasar');
   await form.locator('button[type=submit]').click();
   assert.ok(await page.locator('#orderReviewDialog').evaluate(el=>el.open));
   const summary=await page.locator('#orderReviewData').innerText();
   assert.ok(summary.includes('Pendampingan Diskusi Akademik (UT/PTN/PTS)'),summary);
   await page.locator('#orderReviewEdit').click();
   assert.equal(await form.locator('#customerName').inputValue(),'Pelanggan Akademik');
  }finally{await page.close()}
 });

 await check('Invalid design WhatsApp is rejected, no confirmation appears',async()=>{
  const page=await openPage(375);
  try{
   const f=page.locator('#designConsultForm');
   await f.locator('#designType').selectOption({label:'Poster Digital'});
   await f.locator('.v18-choice button').click();
   await f.locator('input[name=customerName]').fill('Pelanggan Pengujian');
   await f.locator('input[name=customerWhatsApp]').fill('123');
   await f.locator('textarea[name=designDetails]').fill('Brief untuk pengujian validasi');
   await f.locator('button[type=submit]').click();
   assert.ok(!(await page.locator('#orderReviewDialog').evaluate(el=>el.open)));
   assert.equal(await f.locator('input[name=customerWhatsApp]').evaluate(el=>el.validity.valid),false);
  }finally{await page.close()}
 });
 await check('Missing design selection stays on step one',async()=>{
  const page=await openPage(390);
  try{
   const f=page.locator('#designConsultForm');
   await f.locator('.v18-choice button').click();
   assert.ok(await f.locator('.v18-choice').isVisible());
   assert.ok(!(await f.locator('.v18-details').isVisible()));
  }finally{await page.close()}
 });
 await check('Catalogue connection failure shows honest offline fallback',async()=>{
  const page=await browser.newPage({viewport:{width:390,height:800}});
  try{
   await page.route('**/data/catalog-v11.json',r=>r.abort('failed'));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('#catalogLoadError').waitFor({state:'visible'});
   assert.ok((await page.locator('#catalogCards').innerText()).includes('Hubungi WhatsApp'));
  }finally{await page.close()}
 });
 await check('Official SEO files and media links',async()=>{
  const page=await openPage(1440);
  try{
   for(const path of ['robots.txt','sitemap.xml']){
    const response=await page.request.get(new URL(path,base).href);
    assert.equal(response.status(),200,path);
   }
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://hizvena-id.hizryabdilah23.workers.dev/');
   const hrefs=await page.locator('.social-connect-card').evaluateAll(xs=>xs.map(x=>x.href));
   assert.ok(hrefs.some(x=>x.includes('instagram.com/hizvena.id')));
   assert.ok(hrefs.some(x=>x.includes('tiktok.com/@hizvena_id')));
   assert.ok(hrefs.some(x=>x.includes('youtube.com/@hizvena_id')));
   assert.ok(hrefs.some(x=>x.includes('wa.me/6285169728694')));
  }finally{await page.close()}
 });
 await check('Mobile menu opens and Escape closes it',async()=>{
  const page=await openPage(375);
  try{
   await page.locator('#menu').click();
   assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
  }finally{await page.close()}
 });
 await check('Create visual review screenshots at 390 and 1440 pixels',async()=>{
  const {mkdirSync}=await import('node:fs');mkdirSync('test-artifacts',{recursive:true});
  for(const width of [390,1440]){const page=await openPage(width);try{await page.screenshot({path:'test-artifacts/hizvena-v18-'+width+'.png',fullPage:true})}finally{await page.close()}}
 });
}finally{await browser.close()}
console.log(JSON.stringify({passed:passes,failed:issues.length,issues},null,2));
if(issues.length)process.exitCode=1;
