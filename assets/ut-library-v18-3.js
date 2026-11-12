/* V18.3: catalogues public cover metadata only; never exposes full paid document. */
(()=>{'use strict';
const root=document.getElementById('ut-library');if(!root)return;
const list=document.getElementById('ut-library-results'),q=document.getElementById('ut-library-query'),year=document.getElementById('ut-library-year'),count=document.getElementById('ut-library-count');
if(!list||!q||!year||!count)return;
const message='Halo Admin HIZVENA, saya ingin konsultasi Bank Soal Latihan UAS UT.';
const waFor=doc=>'https://wa.me/6285169728694?text='+encodeURIComponent(message+'\nMata kuliah: '+doc.title+'\nKode: '+doc.courseCode+'\nMohon konfirmasi ketersediaan paket dan harga promo Rp29.000 per mata kuliah.');
const make=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=String(value);return el};
let items=[];
function render(){
 const search=q.value.trim().toLocaleLowerCase('id-ID'),period=year.value;
 const found=items.filter(x=>(!period||x.academicYear===period)&&(!search||[x.title,x.courseCode,x.academicYear,x.programStudy,x.category].join(' ').toLocaleLowerCase('id-ID').includes(search)));
 count.textContent=found.length+' materi latihan ditemukan';list.replaceChildren();
 if(!found.length){list.append(make('p','ut-library-state','Tidak ada materi yang sesuai. Coba kode mata kuliah atau hubungi admin untuk informasi koleksi.'));return}
 for(const doc of found){
  const card=make('article','ut-library-item');
  const img=make('img','ut-library-cover');img.src=doc.cover;img.alt='Sampul materi '+doc.title;img.loading='lazy';img.width=128;img.height=174;
  const info=make('div','ut-library-meta');info.append(make('p','ut-promo-label','CONTOH SAMPUL • BANK SOAL UT'),make('h3','',doc.title),make('p','',doc.courseCode+' • '+doc.academicYear+' • '+doc.questionCount+' soal • '+doc.pages+' halaman'),make('p','ut-library-small',doc.note));
  const link=make('a','btn','Tanyakan materi');link.href=waFor(doc);link.target='_blank';link.rel='noopener noreferrer';info.append(link);card.append(img,info);list.append(card)
 }
}
fetch('./data/bank-soal-preview-v18-2.json').then(r=>{if(!r.ok)throw Error('metadata unavailable');return r.json()}).then(data=>{
 if(data.visibility!=='cover-only'||!Array.isArray(data.documents))throw Error('invalid publication policy');
 items=data.documents.filter(x=>x&&x.downloadPublic===false&&typeof x.cover==='string'&&x.cover.startsWith('./assets/')&&x.courseCode&&x.title);
 for(const value of [...new Set(items.map(x=>x.academicYear).filter(Boolean))].sort().reverse()){const opt=make('option','',value);opt.value=value;year.append(opt)}
 render()
}).catch(()=>{count.textContent='Katalog pratinjau belum dapat dimuat.';list.replaceChildren(make('p','ut-library-state','Silakan hubungi admin untuk informasi koleksi Bank Soal UT.'))});
q.addEventListener('input',render);year.addEventListener('change',render);
})();