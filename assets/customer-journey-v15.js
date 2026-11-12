/* HIZVENA V15 — lightweight customer flow; no client data persisted */
(()=>{'use strict';
const $=id=>document.getElementById(id),dialog=$('orderReviewDialog'),list=$('orderReviewData');
if(!dialog||!list)return;
let services=[],selected=null,draft=null,returnFocus=null;
const trim=s=>String(s??'').trim().slice(0,2000);
const safeValue=s=>trim(s)||'—';
const labels={
 name:'Nama customer',phone:'Nomor WhatsApp',category:'Kategori layanan',serviceName:'Nama layanan',price:'Harga katalog',
 campus:'Perguruan tinggi',program:'Program studi',mode:'Kategori kampus',semester:'Semester',
 pathway:'Jalur perkuliahan',courseCode:'Kode mata kuliah',course:'Mata kuliah / topik',
 platform:'Ukuran / platform',deadline:'Tenggat yang diharapkan',details:'Rincian kebutuhan'
};
function lookup(name,type){
 const match=services.find(x=>x.name===name&&(type==='academic'?x.category!=='desain':x.category==='desain'));
 if(match)return match;
 // Preserve legacy manually-selected labels while the two canonical promo names serve all campus types.
 const legacy={'Diskusi Tuton UT':'ut-diskusi','Bank Soal Latihan UAS HOTS (50 soal)':'ut-bank','Bank Soal Latihan UAS HOTS (50 Soal)':'ut-bank'};
 if(type==='academic'&&legacy[name])return services.find(x=>x.id===legacy[name])||null;
 return selected?.name===name?selected:null;
}
function review(order){
 draft={...order};returnFocus=document.activeElement;
 list.replaceChildren();
 const keys=['name','phone','category','serviceName','price',...(order.form==='academic'?['mode','campus','program','pathway','semester','courseCode','course']:['platform']),'deadline','details'];
 for(const key of keys){if(!order[key]&&['course','courseCode','platform','deadline','details'].includes(key))continue;
  const row=document.createElement('div');const label=document.createElement('dt');const value=document.createElement('dd');
  label.textContent=labels[key];value.textContent=safeValue(order[key]);row.append(label,value);list.append(row);
 }
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 $('orderReviewEdit').focus();
}
function close(){
 if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');
 if(returnFocus?.focus)returnFocus.focus();
}
function setServices(items){services=Array.isArray(items)?items:[]}
function select(item){
 if(!item||!item.id)return;
 selected=item;
 const design=item.category==='desain';
 if(design){
  const input=$('designType');if(![...input.options].some(o=>o.value===item.name))input.add(new Option(item.name,item.name));
  input.value=item.name;
 }else{
  const nextMode=item.category==='akademik-ut'?'UT':'SEMUA';
  const tab=document.querySelector('[role="tab"][data-mode="'+nextMode+'"]');
  tab?.click();
  queueMicrotask(()=>{
   const input=$('service');
   if(![...input.options].some(o=>o.value===item.name))input.add(new Option(item.name,item.name));
   input.value=item.name;input.dispatchEvent(new Event('change',{bubbles:true}));
  });
 }
 queueMicrotask(()=>window.HizvenaWizard?.openDetails(design?'design':'academic'));
 const target=$(design?'designConsultForm':'consultForm');
 if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
}
$('orderReviewClose').addEventListener('click',close);
$('orderReviewEdit').addEventListener('click',close);
$('orderReviewContinue').addEventListener('click',()=>{
 if(!draft)return;
 const keys=Object.keys(labels);
 const lines=['Halo Kak Fazry, saya ingin konsultasi layanan HIZVENA.',''];
 for(const key of keys){
  if(key==='phone'||key==='name'||key==='category'||key==='serviceName'||key==='price'||key==='deadline'||key==='details'||(draft.form==='academic'&&['campus','program','mode','semester','pathway','courseCode','course'].includes(key))||(draft.form==='design'&&key==='platform')){
   if(draft[key])lines.push(labels[key]+': '+trim(draft[key]));
  }
 }
 lines.push('','Mohon konfirmasi ketersediaan, harga akhir, jadwal, dan ketentuan pemesanan.');
 const url='https://wa.me/6285169728694?text='+encodeURIComponent(lines.join('\n'));
 // Opening WhatsApp does not create an order or send the message automatically.
 window.location.href=url;
});
dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
window.HizvenaJourney={setServices,select,lookup,review};
})();