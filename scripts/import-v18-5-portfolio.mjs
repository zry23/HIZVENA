// One-time trusted import for owner-supplied V18.5 artwork. SHA-256 prevents accidental remote substitution.
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const assets=[["ajabex-technical","5cd16815-b784-437f-9a4e-a696cfd389f6","54e9e8ad982bd05572d71adf40f08467c6b8b70dae7c70514d96f3198ff914ac"],["alga-project","ef89b6bb-7a0e-40f4-b4fd-098ba7d5a093","36d4c5604f626d0296848c41d434054f2726f050e1dbb8c89add9e055895e0d8"],["burger-promo","137cbc43-7543-4b98-b098-03f1edae6b1b","cb6e88eccab8b1c20ffd8e1749c77ddb9023e20270c29aa7700509b0b27f1280"],["coffee-social-grid","fa9d64bd-b9da-481b-90ae-4b5e9c72ba63","315f9027ab3a32a1e15210a9027e3e7455c0ca519bb71a8dcfbb2be88671f1e3"],["fz28-shark","8165a8a6-2803-4db1-ab23-45d0fe04d94a","5a6a70cc89b55f62b9022a2422fb716106d05c0cfa5d4218df332e512f4f4cc4"],["genteng-jatiwangi","f0730629-441b-46ef-94e1-6012fea8041b","d9f8d6a19efb9cfd5bbb4c3553326ed31c0de1db6651151a531733acc3fe979b"],["gwe-brand","c0d00f19-91ce-4fca-9595-33c0e65f93bb","f0654d7393c674507d2f1f276562d51ac300b250815cb17001d8bb57ab17fe0a"],["kabinet-sanjaya-dharma","165915bc-55a4-473c-b36c-66da6d515362","267485a8238c256238aa538e75be1bd32ea6dc1d103ef37dd1bc018ae39f0d65"],["matcha-poster","077e76fa-8350-4b14-b0ff-71be1a3afb2f","60494635abf2fa32dfb077719f2e48af2700de96551ced41e0ce6aab170ad93e"],["parfum-savoratia","a06e2da1-d20d-4f1f-8c62-54a5a193482a","8ebc49f1883b0cc460537758da8de1850e3f15a5a8fe49721a4ca71465507779"],["perska-perpustakaan","8d7895fb-e405-47ac-b6de-baf6057c5066","90774d241932d8a319afd22f851310e0e16e6b2b5612db0373d42dc63511d096"],["property-social-grid","70b78eb1-fa30-4a98-8d55-58ab6e651cf1","72294cc8bb66fc02f4a35a82424f4c2cdeed3dc1e569a7b799b3e9ed43883cb6"],["uniforce-studio","74268232-4581-4edc-882f-cc7a26302114","2e961831d68af5665d31d80696063ec4c7c7be292a0277f1fdd9ee269eb84c25"]];
const allowedHost='hizvena-catalog-2026.floot.app';
mkdirSync('assets/portfolio',{recursive:true});
for(const [id,uuid,checksum] of assets){
 const filename=id+'.webp',url='https://'+allowedHost+'/_cdn/static/'+uuid+'-hizvena-'+filename;
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),15000);
 let bytes;
 try{
  const r=await fetch(url,{signal:ctl.signal,redirect:'error'});
  if(!r.ok||!r.headers.get('content-type')?.includes('image/webp'))throw Error(id+' not a public WebP: '+r.status);
  bytes=Buffer.from(await r.arrayBuffer());
 }finally{clearTimeout(timer)}
 if(bytes.length<1000||bytes.length>500_000)throw Error(id+' unexpected size');
 const sha=createHash('sha256').update(bytes).digest('hex');
 if(sha!==checksum)throw Error(id+' checksum mismatch');
 writeFileSync('assets/portfolio/'+filename,bytes);
 console.log(id,bytes.length,'bytes; SHA256',sha.slice(0,12));
}
const path='data/portfolio-v18-5.json',data=JSON.parse(readFileSync(path,'utf8'));
if(data.works?.length!==assets.length)throw Error('Unexpected portfolio manifest: '+data.works?.length);
const authorizedIds=new Set(assets.map(x=>x[0]));
for(const work of data.works){
 if(!authorizedIds.has(work.id))throw Error('Unrecognized portfolio item '+work.id);
 if(work.src!=='./assets/portfolio/'+work.id+'.webp')throw Error('Unexpected portfolio file path');
 work.publicApproved=true;
 work.reviewStatus='APPROVED';
 work.featured=['uniforce-studio','property-social-grid','coffee-social-grid','alga-project','fz28-shark','parfum-savoratia'].includes(work.id);
 if(['matcha-poster','property-social-grid','coffee-social-grid','burger-promo'].includes(work.id)){
  work.description='Studi konsep visual portofolio; bukan iklan resmi, klaim promosi aktual, atau bukti kerja sama dengan merek pihak ketiga.';
 }
}
data.updated='2026-11-16';
data.reviewNote='Dipublikasikan atas permintaan pemilik yang mengunggah 13 karya. Semua karya portofolio ditampilkan sebagai contoh/desain konsep; merek yang muncul bukan bukti hubungan bisnis, persetujuan, atau dukungan resmi pihak ketiga. Detail proyek pribadi tidak diungkap.';
writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log('Portfolio asset import complete:',assets.length);
