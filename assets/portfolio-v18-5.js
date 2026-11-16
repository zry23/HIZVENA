/* HIZVENA V18.5 portfolio. Explicit owner approval gate; no user-submitted image becomes public without approval. */
(()=>{'use strict';
const section=document.getElementById('portofolio'),gallery=document.getElementById('portfolioGallery'),filters=document.getElementById('portfolioFilters'),count=document.getElementById('portfolioCount'),empty=document.getElementById('portfolioEmpty'),dialog=document.getElementById('portfolioDetail');
if(!section||!gallery||!filters||!count||!empty||!dialog)return;
const create=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};
const wa=work=>'https://wa.me/6285169728694?text='+encodeURIComponent('Halo Admin HIZVENA, saya ingin konsultasi desain serupa dengan contoh '+work.title+' ('+work.category+'). Mohon konfirmasi cakupan dan biaya.');
let visible=[],active='Semua';
function detail(work){const inner=dialog.querySelector('[data-detail-body]');inner.replaceChildren();const image=create('img');image.src=work.src;image.alt=work.title;inner.append(image,create('h3','',work.title),create('p','',work.description||'Studi visual karya desain.'));const btn=create('a','btn','Konsultasi desain serupa');btn.href=wa(work);btn.target='_blank';btn.rel='noopener noreferrer';inner.append(btn);if(typeof dialog.showModal==='function')dialog.showModal();}
function render(){
 const works=visible.filter(w=>active==='Semua'||w.category===active);gallery.replaceChildren();count.textContent=works.length+' karya ditampilkan';
 for(const w of works){const card=create('article','portfolio-work'),visual=create('div','portfolio-art'),img=create('img');img.src=w.src;img.alt='Karya desain: '+w.title;img.loading='lazy';img.decoding='async';img.onerror=()=>{card.remove();count.textContent=gallery.children.length+' karya tersedia'};visual.append(img);
 const copy=create('div','portfolio-copy');copy.append(create('p','portfolio-category',w.category),create('h3','',w.title),create('p','',w.description||'Karya desain pilihan.'));
 const actions=create('div','portfolio-actions'),view=create('button','btn secondary','Lihat karya');view.type='button';view.addEventListener('click',()=>detail(w));const link=create('a','btn','Pesan desain serupa');link.href=wa(w);link.rel='noopener noreferrer';link.target='_blank';actions.append(view,link);copy.append(actions);card.append(visual,copy);gallery.append(card);}
 empty.hidden=visible.length>0;
}
fetch('./data/portfolio-v18-5.json').then(r=>{if(!r.ok)throw Error('Portfolio manifest unavailable');return r.json()}).then(data=>{
 if(!Array.isArray(data.works))throw Error('Portfolio manifest invalid');
 visible=data.works.filter(w=>w.publicApproved===true&&w.reviewStatus==='APPROVED'&&typeof w.src==='string'&&/^\.\/assets\/portfolio\/[a-z0-9-]+\.webp$/.test(w.src)&&w.title&&w.category);
 const categories=['Semua',...new Set(visible.map(w=>w.category))];filters.replaceChildren();
 for(const category of categories){const btn=create('button','portfolio-filter',category);btn.type='button';btn.setAttribute('aria-pressed',String(category===active));btn.addEventListener('click',()=>{active=category;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));render()});filters.append(btn)}
 render();
}).catch(()=>{gallery.replaceChildren();count.textContent='Galeri belum tersedia';empty.hidden=false});
dialog.querySelector('[data-detail-close]')?.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
})();