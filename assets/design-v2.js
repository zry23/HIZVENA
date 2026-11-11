/* HIZVENA • progressive UX enhancements, no backend or paid APIs */
(()=>{'use strict';
const form=document.getElementById('consultForm');
if(!form)return;
const selector='.fields input,.fields select,.fields textarea';
const values=()=>Object.fromEntries([...form.querySelectorAll(selector)].map(x=>[x.id,x.value.trim()]));
const region=document.createElement('section');region.className='selection-summary';region.setAttribute('aria-live','polite');
region.style.cssText='margin:22px 0 20px;padding:18px 20px;border:1px solid #e5e0fb;border-radius:16px;background:#fbfaff';
region.innerHTML='<strong style="font-size:14px">Ringkasan konsultasi</strong><p id="summaryText" style="margin:7px 0 0;font-size:13px;line-height:1.7"></p>';
const hint=form.querySelector('.hint');hint?.insertAdjacentElement('afterend',region);
const vtext=id=>{let x=form.querySelector('#'+id);return x?.value?.trim()||'—'};
const updateSummary=()=>{
 const active=document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.mode||'UT';
 const txt=['Jalur '+active,'Kampus: '+vtext('campus'),'Prodi: '+vtext('programStudy'),'Semester: '+vtext('semester'),'Mata kuliah/topik: '+vtext('course'),'Layanan: '+vtext('service')];
 document.getElementById('summaryText').textContent=txt.join(' • ');
};
form.addEventListener('input',updateSummary);form.addEventListener('change',updateSummary);
document.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>queueMicrotask(()=>{updateSummary();updateUTControls();})));
const utBox=document.createElement('div');utBox.id='utJourney';utBox.style.cssText='margin:10px 0 24px;padding:16px 18px;border:1px solid #e9e5fc;border-radius:15px;background:#f9f7ff';
utBox.innerHTML='<p style="font-size:13px;margin:0 0 11px;color:#514a73;font-weight:700">Mode pencarian UT</p><div role="group" aria-label="Mode pencarian UT" style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="ut-option" data-ut-mode="fast">Cari Cepat</button><button type="button" class="ut-option" data-ut-mode="browse">Jelajahi S1 UT</button><button type="button" class="ut-option" data-ut-mode="semester">Paket Semester UT</button></div><p id="utModeHelp" style="font-size:12px;margin:12px 0 0;color:#5a5875"></p>';
const title=form.querySelector('h3');title?.insertAdjacentElement('afterend',utBox);
const style=document.createElement('style');style.textContent='.ut-option{border:1px solid #ded5fc;background:white;color:#4c4380;border-radius:10px;font-size:12px;font-weight:750;padding:9px 13px}.ut-option[aria-pressed=true]{background:#7051f5;color:white;border-color:#7051f5}.selection-summary{scroll-margin-top:100px}';document.head.appendChild(style);
let utMode='fast';
function updateUTControls(){
const isUT=document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.mode==='UT';
utBox.hidden=!isUT;if(!isUT)return;
utBox.querySelectorAll('.ut-option').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.utMode===utMode)));
const helps={fast:'Ketik kode atau nama mata kuliah langsung. Data indeks masih menunggu impor, jadi admin akan memverifikasi.',browse:'Isi nama fakultas/program studi dan mata kuliah secara manual. Katalog pilihan otomatis akan aktif setelah dataset UT terimpor.',semester:'Paket Semester hanya untuk UT, rentang harga Rp1.500.000–Rp2.239.000. Detail mata kuliah dan cakupan dikonfirmasi admin.'};
document.getElementById('utModeHelp').textContent=helps[utMode];
}
utBox.querySelectorAll('.ut-option').forEach(btn=>btn.addEventListener('click',()=>{
utMode=btn.dataset.utMode;const course=document.getElementById('course'),svc=document.getElementById('service'),prodi=document.getElementById('programStudy');
if(utMode==='semester'){svc.value='Paket Semester UT';course.value='Konsultasi paket semester';course.placeholder='Konsultasi paket semester';}
else{if(course.value==='Konsultasi paket semester')course.value='';course.placeholder=utMode==='fast'?'Ketik kode atau nama mata kuliah':'Kode atau nama mata kuliah UT';if(utMode==='browse')prodi.focus();}
updateUTControls();updateSummary();
}));
updateUTControls();updateSummary();
// The testimonial gallery is intentionally empty until authentic, consented screenshots are provided.
const gallery=document.querySelector('#testimoni .cards');
if(gallery && gallery.children.length===3){
const more=document.createElement('div');more.className='cards';more.hidden=true;more.style.marginTop='18px';
for(let i=0;i<3;i++){const box=document.createElement('div');box.className='testimonial';box.innerHTML='<strong>Testimoni segera hadir</strong>';more.appendChild(box);}
gallery.insertAdjacentElement('afterend',more);
const toggle=document.createElement('button');toggle.type='button';toggle.className='btn secondary';toggle.style.marginTop='18px';toggle.textContent='Lihat testimoni lainnya';
toggle.setAttribute('aria-expanded','false');
more.insertAdjacentElement('afterend',toggle);
toggle.addEventListener('click',()=>{more.hidden=!more.hidden;toggle.setAttribute('aria-expanded',String(!more.hidden));toggle.textContent=more.hidden?'Lihat testimoni lainnya':'Tutup testimoni'});
}
// Update the footer with an explicitly expandable source declaration.
const footer=document.querySelector('footer .wrap');if(footer){
const dataDetails=document.createElement('details');dataDetails.style.cssText='margin-top:23px;background:#ffffff0b;border:1px solid #ffffff20;color:white;max-width:760px';dataDetails.innerHTML='<summary>Sumber data akademik</summary><p style="margin:10px 0">Data perguruan tinggi dan mata kuliah merupakan referensi. Sumber: <a href="https://www.ut.ac.id/katalog/" target="_blank" rel="noopener" style="color:#c8baff;text-decoration:underline">Katalog Universitas Terbuka</a> dan <a href="https://data.kemdiktisaintek.go.id/dataset/perguruan-tinggi" target="_blank" rel="noopener" style="color:#c8baff;text-decoration:underline">Data pendidikan tinggi</a>.</p>';
footer.appendChild(dataDetails);
}
})();