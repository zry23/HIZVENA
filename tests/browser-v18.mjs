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
   await page.locator('#catalogQuery').fill('Diskusi Tuton');
   await page.locator('.catalog-service .btn:not(.secondary)').first().click();
   const form=page.locator('#consultForm');
   assert.ok(await form.locator('.v18-details').isVisible());
   await form.locator('#customerName').fill('Pelanggan Akademik');
   await form.locator('#customerWhatsApp').fill('081234567892');
   await form.locator('#programStudy').fill('Ilmu Komunikasi');
   await form.locator('#semester').selectOption('2');
   await form.locator('#course').fill('Komunikasi Dasar');
   await form.locator('button[type=submit]').click();
   assert.ok(await page.locator('#orderReviewDialog').evaluate(el=>el.open));
   const summary=await page.locator('#orderReviewData').innerText();
   assert.ok(summary.includes('Pendampingan Diskusi Tuton UT'),summary);
   await page.locator('#orderReviewEdit').click();
   assert.equal(await form.locator('#customerName').inputValue(),'Pelanggan Akademik');
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
}finally{await browser.close()}
console.log(JSON.stringify({passed:passes,failed:issues.length,issues},null,2));
if(issues.length)process.exitCode=1;
