// Parse real Lighthouse reports and apply the published V18 score gates.
import {readFileSync} from 'node:fs';
const reports=['mobile','desktop'];
let failing=false;
for(const device of reports){
 let d;
 try{d=JSON.parse(readFileSync('audit-artifacts/lighthouse-'+device+'.json','utf8'))}
 catch(e){console.error('NOT TESTED',device,e.message);failing=true;continue}
 const c=d.categories||{},a=d.audits||{};
 const scores={performance:Math.round((c.performance?.score??0)*100),accessibility:Math.round((c.accessibility?.score??0)*100),bestPractices:Math.round((c['best-practices']?.score??0)*100),seo:Math.round((c.seo?.score??0)*100)};
 const metrics={LCP:a['largest-contentful-paint']?.displayValue,CLS:a['cumulative-layout-shift']?.displayValue,TBT:a['total-blocking-time']?.displayValue,INP:'Not available in synthetic single-navigation Lighthouse; requires field data'};
 console.log(JSON.stringify({device,url:d.finalDisplayedUrl||d.finalUrl,generated:d.fetchTime,scores,metrics},null,2));
 for(const [key,min] of Object.entries({performance:90,accessibility:95,bestPractices:95,seo:95})){
  if(scores[key]<min){console.error('FAIL',device,key,scores[key]+' / '+min);failing=true}
  else console.log('PASS',device,key,scores[key]+' / '+min);
 }
}
if(failing){console.error('Lighthouse V18 targets not yet met. Do not claim 95/100.');process.exitCode=1}
