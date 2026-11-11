/* HIZVENA testimonial gallery V12 — show approved, privacy-safe images only */
(()=>{'use strict';
const $=id=>document.getElementById(id),section=$('testimoni'),gallery=$('testimonialGallery'),dialog=$('testimonialLightbox');
if(!section||!gallery||!dialog)return;
const more=$('testimonialMore'),count=$('testimonialCount'),full=$('testimonialFullImage'),caption=$('testimonialFullCaption'),title=$('testimonialLightboxTitle');
let items=[],current=0,expanded=false,touchStart=0,previousFocus=null;
const allowedPath=/^\.\/assets\/testimonials\/[a-z0-9][a-z0-9_-]*\.(?:webp|jpe?g|png|avif)$/i;
function valid(item){return item&&item.approved===true&&item.published===true&&item.privacyReviewed===true&&typeof item.src==='string'&&allowedPath.test(item.src)&&typeof item.title==='string'&&item.title.length>0&&item.title.length<=120&&typeof item.alt==='string'&&item.alt.length<=240;}
function displayed(){return expanded?items:items.slice(0,6)}
function button(text,handler,cls){const b=document.createElement('button');b.type='button';b.className=cls||'';b.textContent=text;b.addEventListener('click',handler);return b}
function show(){
 gallery.replaceChildren();
 for(const item of displayed()){
  const idx=items.indexOf(item),figure=document.createElement('figure');figure.className='testimonial-tile';
  const opener=document.createElement('button');opener.type='button';opener.setAttribute('aria-label','Perbesar '+item.title);
  const frame=document.createElement('div');frame.className='testimonial-image-frame';
  const img=document.createElement('img');img.src=item.src;img.alt=item.alt;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
  img.onerror=()=>{figure.hidden=true};
  frame.appendChild(img);opener.appendChild(frame);opener.addEventListener('click',()=>open(idx));
  const figcaption=document.createElement('figcaption');const strong=document.createElement('strong');strong.textContent=item.title;figcaption.append(strong);
  if(item.caption){const detail=document.createElement('span');detail.textContent=item.caption;figcaption.appendChild(detail)}
  figure.append(opener,figcaption);gallery.appendChild(figure);
 }
 count.textContent=items.length+' dokumentasi';
 more.hidden=items.length<=6;
 more.textContent=expanded?'Tampilkan Lebih Sedikit':'Lihat Semua Testimoni';
}
function updateLightbox(){
 const item=items[current];if(!item)return;
 full.src=item.src;full.alt=item.alt;caption.textContent=item.caption||'';
 title.textContent=item.title;
 $('testimonialPrev').disabled=items.length<2;$('testimonialNext').disabled=items.length<2;
}
function open(idx){
 previousFocus=document.activeElement;current=idx;updateLightbox();
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 $('testimonialLightboxClose').focus();
}
function close(){if(dialog.open&&dialog.close)dialog.close();else dialog.removeAttribute('open');if(previousFocus?.focus)previousFocus.focus()}
function move(direction){current=(current+direction+items.length)%items.length;updateLightbox()}
$('testimonialLightboxClose').addEventListener('click',close);
$('testimonialPrev').addEventListener('click',()=>move(-1));
$('testimonialNext').addEventListener('click',()=>move(1));
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='Escape'){e.preventDefault();close()}});
full.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0]?.screenX||0},{passive:true});
full.addEventListener('touchend',e=>{const dx=(e.changedTouches[0]?.screenX||touchStart)-touchStart;if(Math.abs(dx)>55)move(dx<0?1:-1)},{passive:true});
more.addEventListener('click',()=>{expanded=!expanded;show();if(!expanded)section.scrollIntoView({behavior:'auto',block:'start'})});
fetch('./data/testimonials.json?v=14',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{
 if(!data||!Array.isArray(data.items))return;
 items=data.items.filter(valid).sort((a,b)=>(a.order||0)-(b.order||0));
 if(!items.length)return;
 section.hidden=false;
 const link=$('testimonialNavLink');if(link)link.hidden=false;
 show();
}).catch(err=>console.warn('Galeri testimoni belum aktif:',err.message));
})();