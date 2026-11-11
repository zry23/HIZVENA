/* HIZVENA public catalogue — data driven; no customer records stored */
(()=>{'use strict';
const $=id=>document.getElementById(id),list=$('catalogCards'),search=$('catalogQuery'),category=$('catalogCategory'),count=$('catalogCount'),dialog=$('catalogDialog');
if(!list||!dialog)return;
const categories={'akademik-ut':'Akademik UT','akademik-umum':'Akademik PTN/PTS',desain:'Desain Grafis'};
const wa=(title,ref='')=>'https://wa.me/6285169728694?text='+encodeURIComponent('Halo Kak Fazry, saya ingin konsultasi layanan HIZVENA.\n\nLayanan: '+title+(ref?'\nReferensi: '+ref:'')+'\n\nMohon informasi cakupan, estimasi waktu, ketentuan revisi, dan harga akhir.');
const norm=value=>String(value||'').toLocaleLowerCase('id-ID');
let services=[];
function element(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=String(text);return e}
function render(){
const q=norm(search.value).trim(),c=category.value;
const matching=services.filter(x=>(c==='semua'||x.category===c)&&(!q||norm(x.name+' '+x.description+' '+x.scope).includes(q)));
count.textContent=matching.length+' layanan ditemukan';list.replaceChildren();
if(!matching.length){list.append(element('p','catalog-empty','Tidak ada layanan yang cocok. Coba kata kunci lain.'));return}
for(const svc of matching){
 const article=element('article','card catalog-service');
 article.append(element('p','catalog-service-category',categories[svc.category]||'Layanan'),element('h3','',svc.name),element('p','catalog-service-price',svc.price),element('p','catalog-service-description',svc.description));
 const actions=element('div','catalog-service-actions');
 const details=element('button','btn secondary','Lihat Detail');details.type='button';details.addEventListener('click',()=>openDetail(svc));
 const contact=element('button','btn','Pilih Layanan');contact.type='button';contact.addEventListener('click',()=>window.HizvenaJourney.select(svc));
 actions.append(details,contact);article.append(actions);list.append(article);
}
}
function openDetail(svc){
 $('catalogDialogCategory').textContent=categories[svc.category]||'Layanan';
 $('catalogDialogTitle').textContent=svc.name;
 $('catalogDialogPrice').textContent=svc.price;
 $('catalogDialogDescription').textContent=svc.description;
 $('catalogDialogScope').textContent=svc.scope;
 $('catalogDialogDuration').textContent=svc.duration;
 $('catalogDialogRevision').textContent=svc.revision;
 $('catalogDialogContact').onclick=()=>{if(dialog.open)dialog.close();window.HizvenaJourney.select(svc)};
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
$('catalogClose').addEventListener('click',()=>dialog.close?dialog.close():dialog.removeAttribute('open'));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close?dialog.close():dialog.removeAttribute('open')});
search.addEventListener('input',render);category.addEventListener('change',render);
document.querySelectorAll('[data-catalog-filter]').forEach(el=>el.addEventListener('click',()=>{const target=el.dataset.catalogFilter;category.value=target==='desain'?'desain':'semua';search.value=target==='akademik'?'akademik':'';render()}));
const dForm=$('designConsultForm'),dType=$('designType'),dPreview=$('designPreview');
function submitDesign(event){
 event.preventDefault();if(!dForm.reportValidity())return;
 const data=new FormData(dForm),name=String(data.get('customerName')||'').trim(),phone=String(data.get('customerWhatsApp')||'').replace(/[\s()-]/g,''),type=String(data.get('designType')||''),details=String(data.get('designDetails')||'').trim();
 const phoneInput=dForm.elements.customerWhatsApp;phoneInput.setCustomValidity('');
 if(!/^(?:\+?62|0)[0-9]{8,13}$/.test(phone)){phoneInput.setCustomValidity('Masukkan nomor WhatsApp Indonesia yang valid.');phoneInput.reportValidity();return}
 if(name.length<2||!details||!type)return;
 const selected=services.find(x=>x.category==='desain'&&x.name===type);
 window.HizvenaJourney.review({
  form:'design',category:'Desain Grafis',name,phone,
  serviceId:selected?.id||'',serviceName:type,price:selected?.price||'Harga dikonfirmasi admin',
  platform:String(data.get('designPlatform')||'').trim(),
  deadline:String(data.get('designDeadline')||'').trim(),details
 });
}
dForm.addEventListener('submit',submitDesign);
dForm.elements.customerWhatsApp.addEventListener('input',()=>dForm.elements.customerWhatsApp.setCustomValidity(''));
fetch('./data/catalog-v11.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{
 if(!Array.isArray(data.services))throw Error('Invalid catalog format');
 services=data.services.filter(x=>x&&x.id&&x.name&&categories[x.category]&&x.price&&x.description&&x.scope&&x.duration&&x.revision);
 window.HizvenaJourney.setServices(services);
 if(!services.length)throw Error('Empty catalog');
 for(const svc of services.filter(x=>x.category==='desain')){const o=document.createElement('option');o.value=svc.name;o.textContent=svc.name;dType.appendChild(o)}
 render()
}).catch(()=>{count.textContent='Katalog belum dapat dimuat.';list.replaceChildren(element('p','catalog-empty','Silakan hubungi admin untuk informasi layanan dan harga.'));const link=element('a','btn','Hubungi WhatsApp');link.href=wa('Informasi katalog');list.appendChild(link)});
})();