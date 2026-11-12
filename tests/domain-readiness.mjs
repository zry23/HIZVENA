// Public, read-only readiness probe. Never changes DNS, redirects or domain ownership.
import {resolve4,resolve6,resolveCname} from 'node:dns/promises';
import {readFileSync,writeFileSync} from 'node:fs';
const cfg=JSON.parse(readFileSync(new URL('../domain-target.json',import.meta.url),'utf8'));
const domain=cfg.requested_domain,hostnames=[domain,cfg.www_alias];
const look=async(name,fn)=>{try{return await fn(name)}catch(e){return []}};
const get=async url=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),10000);try{const response=await fetch(url,{redirect:'follow',signal:c.signal,headers:{'User-Agent':'HIZVENA-Domain-Readiness/1.0'}});const html=await response.text();return {status:response.status,finalUrl:response.url,branded:html.includes('HIZVENA')&&html.includes('Solusi Akademik dan Kreatif yang'),canonicalMatches:html.includes('rel="canonical" href="https://'+domain+'/")'),htmlSize:html.length}}catch(error){return {error:String(error?.cause?.code||error.message||error)}}finally{clearTimeout(t)}};
const result={checkedAt:new Date().toISOString(),domain,status:'PENDING',hosts:{}};
for(const host of hostnames){const [ipv4,ipv6,cname]=await Promise.all([look(host,resolve4),look(host,resolve6),look(host,resolveCname)]);const http=await get('https://'+host+'/');result.hosts[host]={dns:{ipv4,ipv6,cname},https:http};}
const live=result.hosts[domain];
if((live.dns.ipv4.length||live.dns.ipv6.length||live.dns.cname.length)&&live.https.status===200&&live.https.branded&&new URL(live.https.finalUrl).hostname===domain)result.status='READY_FOR_OWNER_CLOUDFLARE_VERIFICATION';
const out=JSON.stringify(result,null,2);
writeFileSync('domain-readiness-report.json',out+'\n');
console.log(out);
if(process.env.GITHUB_STEP_SUMMARY){const fs=await import('node:fs');fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## HIZVENA custom domain\n\n- Status: **'+result.status+'**\n- Root: https://'+domain+'/\n- WWW: https://'+cfg.www_alias+'/\n\nThis is a public DNS/HTTPS probe, not ownership or Cloudflare dashboard verification. No redirect or canonical migration is applied.\n')}
