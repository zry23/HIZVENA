/* V18.2 UT promos: prices resolved from canonical catalog, never expose paid PDF. */
(()=>{'use strict';
const root=document.getElementById('ut-promo');if(!root)return;
const set=(selector,value)=>root.querySelectorAll(selector).forEach(node=>node.textContent=value);
fetch('./data/catalog-v11.json').then(r=>{if(!r.ok)throw Error('catalog unavailable');return r.json()}).then(data=>{
 const ids=['ut-bank','ut-diskusi'];
 for(const id of ids){
  const svc=data.services?.find(s=>s.id===id);if(!svc)throw Error('Missing '+id);
  const card=root.querySelector('[data-promo-id="'+id+'"]');if(!card)continue;
  card.querySelector('[data-promo-price]').textContent=svc.price;
  card.querySelector('[data-promo-original]').textContent=svc.originalPrice||'';
  card.querySelector('[data-promo-name]').textContent=svc.name;
  const button=card.querySelector('[data-promo-action]');
  button.addEventListener('click',()=>{if(window.HizvenaJourney?.select){window.HizvenaJourney.select(svc);return}
   window.location.href='https://wa.me/6285169728694?text='+encodeURIComponent('Halo Admin HIZVENA, saya ingin konsultasi '+svc.name+' dengan harga promo '+svc.price+'. Mohon informasi ketersediaan dan ketentuan layanan.');
  });
 }
}).catch(()=>{root.querySelectorAll('[data-promo-action]').forEach(btn=>{
 btn.disabled=false;btn.addEventListener('click',()=>{window.location.href='https://wa.me/6285169728694?text='+encodeURIComponent('Halo Admin HIZVENA, saya ingin konsultasi promo mahasiswa UT. Mohon informasi harga terkini.')})});
 const notice=root.querySelector('[data-promo-alert]');if(notice)notice.hidden=false;
});
})();