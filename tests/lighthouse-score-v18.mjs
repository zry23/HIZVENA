// Real Lighthouse evidence: median of three independent mobile runs reduces CI noise.
// All individual values are reported. Any median below V18 threshold fails the quality gate.
import {readFileSync} from 'node:fs';
const read=device=>{try{return JSON.parse(readFileSync('audit-artifacts/lighthouse-'+device+'.json','utf8'))}catch(e){console.error('NOT TESTED',device,e.message);process.exitCode=1;return null}};
const names=['performance','accessibility','best-practices','seo'];
const required={performance:90,accessibility:95,'best-practices':95,seo:95};
const score=d=>Object.fromEntries(names.map(name=>[name,Math.round((d.categories?.[name]?.score??0)*100)]));
const metrics=d=>({LCP:d.audits?.['largest-contentful-paint']?.displayValue,CLS:d.audits?.['cumulative-layout-shift']?.displayValue,TBT:d.audits?.['total-blocking-time']?.displayValue});
const median=nums=>nums.slice().sort((a,b)=>a-b)[Math.floor(nums.length/2)];
const mobiles=['mobile-1','mobile-2','mobile-3'].map(read).filter(Boolean),desktop=read('desktop');
if(mobiles.length!==3||!desktop){console.error('Missing Lighthouse sample, cannot pass.');process.exitCode=1}
else{
 const runs=mobiles.map((d,i)=>({sample:i+1,scores:score(d),metrics:metrics(d),generated:d.fetchTime}));
 const medians=Object.fromEntries(names.map(n=>[n,median(runs.map(r=>r.scores[n]))]));
 const desktopScores=score(desktop);
 console.log(JSON.stringify({type:'mobile-three-run-median',runs,medianScores:medians,desktop:{scores:desktopScores,metrics:metrics(desktop)},limitations:'Local HTTP CI snapshot; not Cloudflare real-user INP or field CWV'},null,2));
 for(const [name,min] of Object.entries(required)){
  for(const [dev,scores] of [['mobile median',medians],['desktop',desktopScores]]){
   if(scores[name]<min){console.error('FAIL',dev,name,scores[name]+'/'+min);process.exitCode=1}
   else console.log('PASS',dev,name,scores[name]+'/'+min)
  }
 }
}
