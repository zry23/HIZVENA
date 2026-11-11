/* HIZVENA V9 • all-campus searchable catalog with WhatsApp landing page */
(()=>{'use strict';
const $=id=>document.getElementById(id), form=$('consultForm'); if(!form)return;
const campus=$('campus'),study=$('programStudy'),pathway=$('pathway'),semester=$('semester'),course=$('course'),code=$('courseCode'),service=$('service'),details=$('details');
const norm=v=>String(v||'').toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const state={campuses:[],programs:{},ut:[],campus:null,program:null,course:null,loaded:false,utLoaded:false};
const selectedMode=()=>document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.mode||'SEMUA';
const utMode=()=>document.querySelector('.ut-option[aria-pressed="true"]')?.dataset.utMode||'fast';
const contact=document.createElement('div');
contact.className='contact-fields';
contact.innerHTML='<h4>Identitas pemesan</h4><p>Isi nama dan nomor WhatsApp untuk konsultasi.</p><div class="fields"><label class="field">Nama lengkap pemesan<input id="customerName" type="text" autocomplete="name" placeholder="Masukkan nama lengkap" minlength="2" maxlength="100" required></label><label class="field">Nomor WhatsApp pemesan<input id="customerWhatsApp" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx atau +62xxxxxxxx" pattern="[+0-9]{10,16}" required></label></div>';
form.querySelector('.fields').insertAdjacentElement('beforebegin',contact);
const status=document.createElement('p'); status.className='catalog-status'; status.id='campusDatasetStatus';status.setAttribute('role','status');
contact.insertAdjacentElement('afterend',status);
const label=(name,value)=>name+': '+(value||'Belum diisi');
const popups={};let focusedPopup=null;
for(const field of [campus,study,course,code]){
 const wrap=field.parentElement;wrap.classList.add('search-field');
 const box=document.createElement('div');box.className='catalog-results';box.hidden=true;box.id=field.id+'Results';box.setAttribute('role','listbox');wrap.appendChild(box);popups[field.id]=box;
 field.setAttribute('aria-autocomplete','list');field.setAttribute('aria-controls',box.id);
 const close=()=>{box.hidden=true;if(focusedPopup===box)focusedPopup=null};
 field.addEventListener('keydown',event=>{if(event.key==='Escape')close();if(event.key==='ArrowDown'&&!box.hidden){event.preventDefault();box.querySelector('button')?.focus()}});
 box.addEventListener('keydown',event=>{const opts=[...box.querySelectorAll('button')],i=opts.indexOf(document.activeElement);if(event.key==='Escape'){close();field.focus()}if(event.key==='ArrowDown'&&i>=0){event.preventDefault();opts[(i+1)%opts.length]?.focus()}if(event.key==='ArrowUp'&&i>=0){event.preventDefault();if(i===0)field.focus();else opts[i-1]?.focus()}});
}
document.addEventListener('pointerdown',e=>{for(const field of [campus,study,course,code]){if(!field.parentElement.contains(e.target))popups[field.id].hidden=true}});
function displayMatches(field,items,summary,select){
 const box=popups[field.id];box.replaceChildren();
 if(!items.length){box.hidden=true;return}
 for(const item of items.slice(0,18)){
  const b=document.createElement('button');b.type='button';b.className='catalog-choice';b.setAttribute('role','option');
  const [title,caption]=summary(item);const t=document.createElement('strong');t.textContent=title;const c=document.createElement('small');c.textContent=caption||'';b.append(t,c);
  b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>{select(item);box.hidden=true;syncSummary()});box.appendChild(b)
 }
 box.hidden=false;focusedPopup=box;
}
const getData=async path=>{const r=await fetch(path,{cache:'force-cache'});if(!r.ok)throw Error('HTTP '+r.status+' '+path);if(!r.body||!('DecompressionStream' in window))throw Error('Browser tidak mendukung gzip streaming');return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json()};
async function initData(){
 try{const d=await getData('./data/hizvena-indonesia-campus-directory.json.gz');state.campuses=d.universities||[];const p=await getData('./data/hizvena-indonesia-campus-programs.json.gz');state.programs=p.programsByCampus||{};state.loaded=true}catch(e){console.warn('HIZVENA index kampus:',e)}
 try{const d=await getData('./data/hizvena-ut-s1-course-index-v2.json.gz');state.ut=d.courses||[];state.utLoaded=true}catch(e){console.warn('HIZVENA indeks UT:',e)}
 refreshStatus();
}
const modeItems=()=>{const m=selectedMode();return m==='PTN'?state.campuses.filter(x=>x.type==='Negeri'):m==='PTS'?state.campuses.filter(x=>x.type==='Swasta'):state.campuses};
function refreshStatus(){
 const m=selectedMode();
 if(m==='UT')status.textContent=state.utLoaded?'Mata kuliah UT tersedia untuk dicari berdasarkan nama atau kode.':'Masukkan kode atau nama mata kuliah UT.';
 else status.textContent=state.loaded?'Cari dari '+modeItems().length.toLocaleString('id-ID')+' kampus dalam direktori HIZVENA.':'Daftar kampus tidak tersedia. Isi nama kampus dan prodi secara manual.';
}
function rank(arr,q,extract){return arr.filter(x=>!q||norm(extract(x)).includes(q)).sort((a,b)=>Number(!norm(extract(a)).startsWith(q))-Number(!norm(extract(b)).startsWith(q))||String(extract(a)).localeCompare(String(extract(b)),'id')).slice(0,18)}
function campusSearch(){
 if(selectedMode()==='UT'){popups.campus.hidden=true;return}
 if(state.campus&&campus.value===state.campus.name){popups.campus.hidden=true;return}
 state.campus=null;state.program=null;
 const q=norm(campus.value);
 displayMatches(campus,rank(modeItems(),q,x=>x.name+' '+x.city+' '+x.province+' '+x.id),x=>[x.name,[x.type,x.city||x.province].filter(Boolean).join(' · ')],x=>{state.campus=x;campus.value=x.name;study.value='';course.value='';code.value='';study.focus()});
}
function programSearch(){
 if(state.program && study.value===state.program.name+' ('+state.program.level+')'){popups.programStudy.hidden=true;return}
 state.program=null;const q=norm(study.value);
 if(selectedMode()==='UT'){
  const prodi=[...new Set(state.ut.filter(x=>!q||norm(x.prodi).includes(q)).map(x=>x.prodi))].sort((a,b)=>a.localeCompare(b,'id')).slice(0,18);
  displayMatches(study,prodi,x=>[x,'Program studi S1 UT'],x=>{study.value=x;course.value='';code.value='';});
  return
 }
 if(!state.campus){popups.programStudy.hidden=true;return}
 const choices=state.programs[state.campus.id]||[];
 displayMatches(study,rank(choices,q,x=>x.name+' '+x.level+' '+x.code),x=>[x.name,[x.level,x.code].filter(Boolean).join(' · ')],x=>{state.program=x;study.value=x.name+' ('+x.level+')';course.value='';code.value='';});
}
function utCoursesFiltered(q){
 const qnorm=norm(q);if(qnorm.length<2)return[];
 const p=norm(study.value);
 const filtered=state.ut.filter(x=>(norm(x.name).includes(qnorm)||norm(x.code).includes(qnorm)));
 return filtered.sort((a,b)=>Number(!(p&&norm(a.prodi)===p))-Number(!(p&&norm(b.prodi)===p))).slice(0,18)
}
function selectCourse(item){state.course=item;course.value=item.name;code.value=item.code;if(!study.value)study.value=item.prodi;}
function courseSearch(which){
 if(selectedMode()!=='UT'||utMode()==='semester'){popups[which.id].hidden=true;return}
 const list=utCoursesFiltered(which.value);
 displayMatches(which,list,x=>[x.code+' — '+x.name,x.prodi],selectCourse);
}
campus.addEventListener('input',campusSearch);campus.addEventListener('focus',campusSearch);
study.addEventListener('input',programSearch);study.addEventListener('focus',programSearch);
course.addEventListener('input',()=>courseSearch(course));course.addEventListener('focus',()=>courseSearch(course));
code.addEventListener('input',()=>courseSearch(code));code.addEventListener('focus',()=>courseSearch(code));
function resetSemester(){
 semester.replaceChildren();semester.add(new Option('Pilih semester',''));
 for(let i=1;i<=8;i++)semester.add(new Option('Semester '+i,String(i)));
 semester.add(new Option('Semester lanjutan (9–14)','9–14'));
 semester.add(new Option('Belum ditentukan / RPL','Belum ditentukan'));
 semester.value='';
}
function changeMode(){
 const m=selectedMode();state.campus=state.program=state.course=null;
 campus.value=m==='UT'?'Universitas Terbuka':'';campus.readOnly=m==='UT';study.value='';code.value='';course.value='';details.value='';pathway.value='Reguler';resetSemester();
 for(const el of Object.values(popups))el.hidden=true;
 campus.placeholder=m==='UT'?'Universitas Terbuka':'Ketik nama kampus atau klik untuk memilih';
 $('formTitle').textContent='Konsultasi '+({SEMUA:'Semua Kampus',UT:'Universitas Terbuka',PTN:'Kampus Negeri',PTS:'Kampus Swasta'}[m]);
 study.placeholder=m==='UT'?'Cari program studi S1 UT':'Pilih kampus lalu cari program studi';
 course.placeholder=m==='UT'?'Cari nama mata kuliah UT':'Masukkan nama mata kuliah atau topik';
 code.placeholder=m==='UT'?'Cari kode mata kuliah UT':'Kode mata kuliah (bila diketahui)';
 refreshStatus();syncSummary();
}
document.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>queueMicrotask(changeMode)));
const specialUT=()=>{const semesterPackage=selectedMode()==='UT'&&utMode()==='semester';course.required=false;if(semesterPackage){course.value='Paket Semester UT';code.value='';service.value='Paket Semester UT';}else if(course.value==='Paket Semester UT'){course.value='';}};
document.querySelectorAll('.ut-option').forEach(el=>el.addEventListener('click',()=>{queueMicrotask(()=>{specialUT();syncSummary()})}));
function syncSummary(){
 const el=$('summaryText');if(!el)return;
 el.textContent=[label('Pemesan',$('customerName').value),label('WA',$('customerWhatsApp').value),label('Jalur kampus',selectedMode()),label('Kampus',campus.value),label('Prodi',study.value),label('Jalur kuliah',pathway.value),label('Semester',semester.value),label('Kode matkul',code.value),label('Mata kuliah',course.value),label('Layanan',service.value)].join(' • ');
}
form.addEventListener('input',syncSummary);form.addEventListener('change',syncSummary);
const submit=form.querySelector('button[type=submit]');submit.textContent='Tinjau Ringkasan';
form.addEventListener('submit',event=>{
 event.preventDefault();event.stopImmediatePropagation();
 const name=$('customerName').value.trim(),phone=$('customerWhatsApp').value.replace(/[\s()-]/g,'');
 if(name.length<2){$('customerName').setCustomValidity('Isi nama lengkap pemesan.');$('customerName').reportValidity();return}
 $('customerName').setCustomValidity('');
 if(!/^(?:\+?62|0)[0-9]{8,13}$/.test(phone)){$('customerWhatsApp').setCustomValidity('Nomor WhatsApp Indonesia tidak valid.');$('customerWhatsApp').reportValidity();return}
 $('customerWhatsApp').setCustomValidity('');
 if(!form.reportValidity())return;
 const selected=window.HizvenaJourney.lookup(service.value,'academic');
 window.HizvenaJourney.review({
  form:'academic',category:'Akademik',name,phone,
  serviceId:selected?.id||'',serviceName:selected?.name||service.value,
  price:selected?.price||'Harga dikonfirmasi admin',
  mode:selectedMode(),campus:campus.value.trim(),program:study.value.trim(),
  pathway:pathway.value,semester:semester.value,courseCode:code.value.trim(),
  course:course.value.trim(),deadline:$('academicDeadline').value,
  details:details.value.trim()||'-'
 });
},true);
$('customerName').addEventListener('input',()=> $('customerName').setCustomValidity(''));
$('customerWhatsApp').addEventListener('input',()=> $('customerWhatsApp').setCustomValidity(''));
changeMode();initData();
})();