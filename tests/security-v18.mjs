// HIZVENA safe baseline security audit. This is NOT a penetration test.
// No customer or authorization data is fetched or printed.
import {readFileSync,readdirSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const findings=[];
const push=(severity,id,message)=>{findings.push({severity,id,message});console.log(severity,id,message)};
const scan=(dir,depth=0)=>{
 if(depth>6)return [];
 let out=[];
 for(const ent of readdirSync(dir,{withFileTypes:true})){
  if(['.git','node_modules','.github','audit-artifacts','test-artifacts'].includes(ent.name))continue;
  const path=join(dir,ent.name);
  if(ent.isDirectory())out=out.concat(scan(path,depth+1));
  else if(ent.isFile()&&/\.(html|js|json|ts|tsx|css|md|env|txt)$/.test(ent.name)&&statSync(path).size<1024*1024)out.push(path);
 }return out;
};
for(const file of scan('.')){
 const text=readFileSync(file,'utf8');
 if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text))push('CRITICAL','private-key','Private key signature present in '+file);
 if(/(?:sk-proj-|ghp_|github_pat_)[A-Za-z0-9_\-]{20,}/.test(text))push('CRITICAL','token','High-risk credential signature present in '+file);
 if(/(?:api[_-]?key|password|secret)\s*[:=]\s*['"][^\s'"]{18,}['"]/i.test(text)&&!/example|placeholder|dummy|token/i.test(text))push('REVIEW','possible-secret','Potential embedded secret in '+file);
}
const html=readFileSync('index.html','utf8');
if(/<form[^>]*method=["']post["'][^>]*action=/i.test(html))push('REVIEW','form-backend','Native POST action exists; confirm endpoint safety');
if(!html.includes('rel="noopener noreferrer"'))push('REVIEW','external-links','Third-party link protections need checking');
for(const script of ['assets/customer-journey-v15.js','assets/catalog-v11.js','assets/wizard-v18.js']){
 const code=readFileSync(script,'utf8');
 if(/\beval\s*\(/.test(code)||/new\s+Function\s*\(/.test(code))push('HIGH','dynamic-eval','Dynamic execution in '+script);
}
if(!html.includes('id="orderReviewDialog"'))push('HIGH','order-review','Expected customer review gating not found');
const target=process.env.HIZVENA_SECURITY_URL||'https://hizvena-id.hizryabdilah23.workers.dev/';
const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),13000);
try{
 const response=await fetch(target,{redirect:'follow',signal:controller.signal,headers:{'User-Agent':'HIZVENA-Security-ReadOnly-Audit/18'}});
 if(!response.ok)push('HIGH','production-http','Public site returned HTTP '+response.status);
 const headers=response.headers;
 for(const key of ['content-security-policy','x-content-type-options','referrer-policy','strict-transport-security']){
  if(!headers.has(key))push('REVIEW','missing-header','No '+key+' on inspected HTML response');
  else console.log('PRESENT',key,headers.get(key)?.slice(0,180));
 }
 if(new URL(response.url).protocol!=='https:')push('HIGH','https','Production redirected away from HTTPS');
}catch(e){push('REVIEW','production-scan','Could not verify live response: '+e.message)}
finally{clearTimeout(timeout)}
mkdirSync('audit-artifacts',{recursive:true});
writeFileSync('audit-artifacts/security-baseline.json',JSON.stringify({timestamp:new Date().toISOString(),scope:'static code plus anonymous homepage response, not full pen test',findings},null,2));
const critical=findings.filter(f=>f.severity==='CRITICAL'||f.severity==='HIGH');
console.log(JSON.stringify({totalFindings:findings.length,critical:critical.length,review:findings.filter(f=>f.severity==='REVIEW').length},null,2));
if(critical.length)process.exitCode=1;
