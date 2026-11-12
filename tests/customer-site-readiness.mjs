// Read-only availability and asset verification for GitHub Pages and the current Cloudflare origin.
// Never activates custom domains, mutates DNS, uploads paid PDFs or rewrites canonical URLs.
import assert from 'node:assert/strict';
import {writeFileSync,appendFileSync} from 'node:fs';
const roots=[
 {key:'github_pages',url:'https://zry23.github.io/HIZVENA/'},
 {key:'existing_cloudflare',url:'https://hizvena-id.hizryabdilah23.workers.dev/'}
];
const timeout=10000;
async function load(url,kind='text') {
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
 try {const response=await fetch(url,{signal:controller.signal,redirect:'follow',headers:{'User-Agent':'HIZVENA-Customer-Site-Check/1.0'}});
 return {status:response.status,url:response.url,body:kind==='json'&&response.ok?await response.json():kind==='text'&&response.ok?await response.text():null};
 }finally{clearTimeout(timer)}
}
const report={checkedAt:new Date().toISOString(),results:{}};
for(const root of roots){
 const result={url:root.url,status:'FAIL',checks:{},notes:[]};
 try{
  const html=await load(root.url);
  result.checks.homepage=html.status===200 && typeof html.body==='string' && html.body.includes('HIZVENA');
  result.checks.hostname=new URL(html.url).hostname===new URL(root.url).hostname;
  if(result.checks.homepage){
   const htmlText=html.body;
   result.checks.promo=htmlText.includes('Promo Spesial Layanan Akademik');
   result.checks.library=htmlText.includes('id="ut-library"');
   const [catalog,previews,css,js]=await Promise.all([
    load(new URL('data/catalog-v11.json',root.url),'json'),
    load(new URL('data/bank-soal-preview-v18-2.json',root.url),'json'),
    load(new URL('assets/ut-promo-v18-2.css',root.url),'none'),
    load(new URL('assets/ut-library-v18-3.js',root.url),'none')
   ]);
   result.checks.catalog=catalog.status===200&&catalog.body?.services?.length===12;
   result.checks.promo_pricing=result.checks.catalog&&catalog.body.services.some(s=>s.id==='ut-bank'&&s.price.includes('Rp29.000'))&&catalog.body.services.some(s=>s.id==='ut-diskusi'&&s.price.includes('Rp19.000'));
   result.checks.safe_previews=previews.status===200&&previews.body?.visibility==='cover-only'&&previews.body?.documents?.length>=2&&previews.body.documents.every(doc=>doc.downloadPublic===false)&&previews.body.documents.some(doc=>doc.courseCode==='FSIK4309');
   result.checks.css=css.status===200;
   result.checks.js=js.status===200;
   result.notes.push(htmlText.includes('href="https://hizvena-id.hizryabdilah23.workers.dev/"')?'Canonical still points to original Cloudflare origin; expected before verified domain migration.':'Verify canonical settings before any SEO migration.');
  }
  result.status=Object.values(result.checks).every(Boolean)?'PASS':'FAIL';
 }catch(e){result.notes.push(String(e.message||e))}
 report.results[root.key]=result;
}
writeFileSync('customer-site-readiness.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(process.env.GITHUB_STEP_SUMMARY){
 let summary='## HIZVENA customer URL health\n\n| URL | Status |\n|---|---|\n';
 for(const result of Object.values(report.results))summary+='| '+result.url+' | **'+result.status+'** |\n';
 summary+='\nGitHub Pages still contains the GitHub username; this is **not** a brand-only custom domain. Cloudflare account access or DNS ownership is required for a true brand-only hostname.\n';
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary);
}
assert.equal(report.results.github_pages.status,'PASS','GitHub Pages customer URL is not verified healthy');
