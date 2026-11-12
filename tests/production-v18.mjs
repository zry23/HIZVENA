// Verify HIZVENA production HTTP content, without any credentials or customer data.
// Run locally: node tests/production-v18.mjs
const origin=process.env.HIZVENA_PRODUCTION_URL||'https://hizvena-id.hizryabdilah23.workers.dev/';
const attempts=process.env.GITHUB_EVENT_NAME==='push'?9:2;
const pause=async ms=>new Promise(resolve=>setTimeout(resolve,ms));
const failures=[];
const fetchText=async path=>{
 const url=new URL(path,origin);
 const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),12000);
 try{const r=await fetch(url,{redirect:'follow',signal:ctl.signal,headers:{'User-Agent':'HIZVENA-Production-Verification/18','Cache-Control':'no-cache'}});
 if(!r.ok)throw new Error(path+' HTTP '+r.status);
 return r.text();
 }finally{clearTimeout(t)}
};
for(let i=1;i<=attempts;i++){
 try{
  const html=await fetchText('?version=18&check=production');
  if(!html.includes('Solusi Akademik dan Kreatif yang'))throw new Error('Production homepage does not show V18 headline');
  if(!html.includes('./assets/v18-premium.css'))throw new Error('V18 CSS not referenced');
  const catalog=JSON.parse(await fetchText('data/catalog-v11.json'));
  if(!Array.isArray(catalog.services)||catalog.services.length!==12)throw new Error('Expected 12 canonical catalogue services');
  if(!catalog.services.every(x=>typeof x.price==='string'&&x.price.startsWith('Rp')))throw new Error('Catalogue price information invalid');
  const robots=await fetchText('robots.txt');if(!robots.includes('Sitemap:'))throw new Error('Sitemap missing from robots.txt');
  const sitemap=await fetchText('sitemap.xml');if(!sitemap.includes('<urlset'))throw new Error('Sitemap invalid');
  console.log('PRODUCTION PASS: HTTPS homepage V18, assets, 12 services/prices, robots.txt, sitemap.xml',new Date().toISOString());
  process.exit(0);
 }catch(e){failures.push(String(e));console.error('Attempt',i,'of',attempts,':',e.message);
  if(i<attempts)await pause(10000);
 }
}
console.error('PRODUCTION NOT VERIFIED:',failures.at(-1));
process.exitCode=1;
