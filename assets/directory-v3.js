/* HIZVENA • Pencarian nasional & formulir pelanggan V3 */
(()=>{'use strict';
const form=document.getElementById('consultForm'); if(!form)return;
const get=id=>document.getElementById(id);
const fields=form.querySelector('.fields');
const contact=document.createElement('div');contact.className='contact-fields';contact.innerHTML='<h4>Data pemesan</h4><p>Isi identitas untuk mempermudah konfirmasi melalui WhatsApp admin HIZVENA.</p><div class="fields"><label class="field">Nama lengkap pemesan <span class="required-label">*</span><input id="customerName" type="text" autocomplete="name" placeholder="Nama lengkap" minlength="2" maxlength="100" required></label><label class="field">Nomor WhatsApp pemesan <span class="required-label">*</span><input id="customerWhatsApp" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx atau +62xxxxxxxx" pattern="[+0-9]{10,16}" title="Gunakan nomor Indonesia, misalnya 081234567890 atau +628123456789" required></label></div>';
fields.insertAdjacentElement('beforebegin',contact);
const campus=get('campus'),study=get('programStudy'),semester=get('semester'),course=get('course'),service=get('service');
campus.required=true;study.required=true;semester.required=true;
campus.autocomplete='off';study.autocomplete='off';
campus.placeholder='Cari nama universitas atau sekolah tinggi';study.placeholder='Cari program studi / jenjang';
const status=document.createElement('p');status.id='campusDatasetStatus';status.className='hint';status.setAttribute('role','status');status.textContent='Memuat direktori kampus dan program studi…';
fields.insertAdjacentElement('beforebegin',status);
const campusList=document.createElement('div');campusList.className='auto-results';campusList.id='campusSuggestions';campusList.hidden=true;
const programList=document.createElement('div');programList.className='auto-results';programList.id='programSuggestions';programList.hidden=true;
campus.parentElement.appendChild(campusList);study.parentElement.appendChild(programList);
const current={campus:null,program:null,mode:'UT'};
let campuses=[],programs={},utCourses=[],loaded=false;
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
async function unzipJSON(path){const response=await fetch(path);if(!response.ok)throw new Error('Berkas data tidak tersedia: '+path);if(!('DecompressionStream' in window))throw new Error('Browser perlu mendukung DecompressionStream.');const stream=response.body.pipeThrough(new DecompressionStream('gzip'));return await new Response(stream).json();}
async function loadCampus(){try{const [c,p]=await Promise.all([unzipJSON('./data/hizvena-indonesia-campus-directory.json.gz'),unzipJSON('./data/hizvena-indonesia-campus-programs.json.gz')]);campuses=c.universities||[];programs=p.programsByCampus||{};loaded=true;displayStatus();}catch(e){status.textContent='Direktori belum dapat dimuat pada browser ini. Nama kampus dan prodi tetap dapat diketik manual.';console.warn('HIZVENA campus:',e);}}
async function loadUT(){try{const d=await unzipJSON('./data/hizvena-ut-s1-course-index-v2.json.gz');utCourses=d.courses||[];}catch(e){console.warn('HIZVENA UT:',e);}}
function mode(){return document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.mode||'UT';}
function available(){const m=mode();return m==='PTN'?campuses.filter(x=>x.type==='Negeri'):m==='PTS'?campuses.filter(x=>x.type==='Swasta'):[];}
function displayStatus(){const m=mode();if(m==='UT'){status.textContent=utCourses.length?'Indeks mata kuliah UT siap dicari ('+utCourses.length.toLocaleString('id-ID')+' entri referensi).':'Ketik mata kuliah UT. Pilihan dapat diverifikasi admin.';return;}status.textContent=loaded?'Pencarian tersedia untuk '+available().length.toLocaleString('id-ID')+' kampus '+(m==='PTN'?'negeri':'swasta')+' dalam indeks referensi (bukan data real-time).':'Memuat daftar kampus...';}
function renderItems(box,items,onPick,render){box.replaceChildren();if(!items.length){box.hidden=true;return;}for(const item of items){const b=document.createElement('button');b.type='button';b.className='auto-choice';const x=render(item);const strong=document.createElement('strong');strong.textContent=x[0];const small=document.createElement('small');small.textContent=x[1]||'';b.append(strong,small);b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>onPick(item));box.appendChild(b);}box.hidden=false;}
function matches(list,text,fields){const q=norm(text);if(q.length<2)return [];return list.filter(x=>fields.some(k=>norm(x[k]).includes(q))).sort((a,b)=>{let an=norm(a.name),bn=norm(b.name);return Number(!an.startsWith(q))-Number(!bn.startsWith(q))||an.localeCompare(bn,'id');}).slice(0,14)}
function campusInput(){const m=mode();if(m==='UT'){campusList.hidden=true;return;}if(current.campus&&campus.value===current.campus.name){campusList.hidden=true;return;}current.campus=null;current.program=null;programList.hidden=true;const list=matches(available(),campus.value,['name','city','province','id']);renderItems(campusList,list,x=>{current.campus=x;campus.value=x.name;study.value='';current.program=null;campusList.hidden=true;study.focus();programInput();},x=>[x.name,(x.type||'')+' · '+(x.city||x.province||'')]);}
function programInput(){if(current.program&&study.value===current.program.name+' ('+current.program.level+')'){programList.hidden=true;return;}current.program=null;const m=mode();if(m==='UT'){const q=norm(study.value);if(q.length<2){programList.hidden=true;return;}const names=[...new Set(utCourses.filter(x=>norm(x.prodi).includes(q)).map(x=>x.prodi))].slice(0,12);renderItems(programList,names,x=>{study.value=x;programList.hidden=true;},x=>[x,'Program studi UT']);return;}if(!current.campus){programList.hidden=true;return;}const arr=programs[current.campus.id]||[];const q=norm(study.value);const filtered=arr.filter(x=>q.length<2||norm(x.name).includes(q)||norm(x.level).includes(q)||norm(x.code).includes(q)).slice(0,18);renderItems(programList,filtered,x=>{current.program=x;study.value=x.name+' ('+x.level+')';programList.hidden=true;},x=>[x.name,(x.level||'')+(x.code?' · '+x.code:'')]);}
function renderUTCourse(){if(mode()!=='UT'||!utCourses.length)return;const q=norm(course.value);if(q.length<2){courseList.hidden=true;return;}let prodi=norm(study.value);const filtered=utCourses.filter(x=>norm(x.name).includes(q)||norm(x.code).includes(q)).sort((a,b)=>Number(!(prodi&&norm(a.prodi).includes(prodi)))-Number(!(prodi&&norm(b.prodi).includes(prodi)))).slice(0,12);renderItems(courseList,filtered,x=>{course.value=x.code+' — '+x.name;courseList.hidden=true;},x=>[x.code+' — '+x.name,(x.prodi||'')+' · '+(x.fac||'')]);}
const courseList=document.createElement('div');courseList.className='auto-results';courseList.id='courseSuggestions';courseList.hidden=true;course.parentElement.appendChild(courseList);
function handleMode(){course.required=true;current.mode=mode();current.campus=null;current.program=null;campusList.hidden=programList.hidden=courseList.hidden=true;campus.readOnly=current.mode==='UT';campus.placeholder=current.mode==='UT'?'Universitas Terbuka':'Ketik untuk mencari kampus '+(current.mode==='PTN'?'negeri':'swasta');study.placeholder=current.mode==='UT'?'Cari program studi UT':'Cari program studi setelah memilih kampus';displayStatus();}
campus.addEventListener('input',campusInput);campus.addEventListener('focus',campusInput);study.addEventListener('input',programInput);study.addEventListener('focus',programInput);course.addEventListener('input',renderUTCourse);course.addEventListener('focus',renderUTCourse);
for(const [input,box] of [[campus,campusList],[study,programList],[course,courseList]]){
  input.setAttribute('aria-autocomplete','list');
  input.setAttribute('aria-controls',box.id);
  input.addEventListener('keydown',e=>{
    if(e.key==='Escape'){box.hidden=true;return;}
    if(e.key==='ArrowDown'&&!box.hidden){
      const first=box.querySelector('button');
      if(first){e.preventDefault();first.focus();}
    }
  });
  box.addEventListener('keydown',e=>{
    const buttons=[...box.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);
    if(e.key==='ArrowDown'&&i>=0){e.preventDefault();buttons[(i+1)%buttons.length]?.focus();}
    if(e.key==='ArrowUp'&&i>=0){e.preventDefault();if(i===0)input.focus();else buttons[i-1]?.focus();}
    if(e.key==='Escape'){e.preventDefault();box.hidden=true;input.focus();}
  });
}
document.addEventListener('click',e=>{if(!campus.parentElement.contains(e.target))campusList.hidden=true;if(!study.parentElement.contains(e.target))programList.hidden=true;if(!course.parentElement.contains(e.target))courseList.hidden=true;});
document.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>setTimeout(handleMode,0)));
document.querySelectorAll('.ut-option').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.utMode==='semester'){course.required=false;}else{course.required=true;}}));
const summary=get('summaryText');const update=()=>{if(!summary)return;const name=get('customerName').value.trim();const wa=get('customerWhatsApp').value.trim();summary.textContent=[name?'Pemesan: '+name:'Nama pemesan belum diisi',wa?'WA: '+wa:'Nomor WA belum diisi','Jalur '+mode(),'Kampus: '+(campus.value||'—'),'Prodi: '+(study.value||'—'),'Semester: '+(semester.value||'—'),'Mata kuliah/topik: '+(course.value||'—'),'Layanan: '+(service.value||'—')].join(' • ');};
form.addEventListener('input',update);form.addEventListener('change',update);
const btn=form.querySelector('button[type=submit]');if(btn)btn.textContent='Kirim rincian ke WhatsApp Admin ↗';
form.addEventListener('submit',event=>{
event.preventDefault();event.stopImmediatePropagation();
const name=get('customerName').value.trim(),phone=get('customerWhatsApp').value.replace(/[\s()-]/g,'');
if(name.length<2){get('customerName').setCustomValidity('Masukkan nama lengkap pemesan.');get('customerName').reportValidity();return;}
get('customerName').setCustomValidity('');
if(!/^(?:\+?62|0)[0-9]{8,13}$/.test(phone)){get('customerWhatsApp').setCustomValidity('Nomor WhatsApp Indonesia tidak valid.');get('customerWhatsApp').reportValidity();return;}
get('customerWhatsApp').setCustomValidity('');
if(!form.reportValidity())return;
const lines=[
'Halo Kak Fazry, saya ingin konsultasi layanan HIZVENA.','',
'Nama pemesan: '+name,
'WhatsApp pemesan: '+phone,
'Kategori kampus: '+mode(),
'Nama kampus: '+campus.value.trim(),
'Program studi: '+study.value.trim(),
'Semester: '+semester.value,
'Mata kuliah/topik: '+(course.value.trim()||'Konsultasi Paket Semester UT'),
'Layanan: '+service.value,
'Rincian kebutuhan: '+(get('details').value.trim()||'-'),
'',
'Mohon konfirmasi ketersediaan layanan, harga final, dan langkah pemesanannya. Terima kasih!'
];
const url='https://wa.me/6285169728694?text='+encodeURIComponent(lines.join('\n'));window.location.href=url;
},true);
get('customerName').addEventListener('input',()=>get('customerName').setCustomValidity(''));get('customerWhatsApp').addEventListener('input',()=>get('customerWhatsApp').setCustomValidity(''));
handleMode();update();loadCampus();loadUT().then(displayStatus);
})();