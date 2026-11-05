(() => {
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const eu=()=>window.UniI18n?.lang==='eu';
 function button(query){
  return '<button type="button" class="map-button" data-map-query="'+esc(query)+'" aria-label="'+(eu()?'Ikusi mapan':'Ver en Google Maps')+'"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#4285f4" d="M2 5l6-3 8 3 6-3v17l-6 3-8-3-6 3z"/><path fill="#fbbc04" d="M8 2v17l8 3V5z"/><path fill="#34a853" d="M2 22l20-20v7L9 22z"/><path fill="#ea4335" d="M16 1a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6z"/><circle cx="16" cy="7" r="2" fill="white"/></svg></button>';
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-map-query]');if(!b)return;
  const query=b.dataset.mapQuery, url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);
  if(matchMedia('(max-width:690px)').matches){window.open(url,'_blank','noopener');return;}
  let d=document.getElementById('location-dialog');
  if(!d){d=document.createElement('dialog');d.id='location-dialog';document.body.append(d);}
  d.innerHTML='<div class="map-heading"><h2></h2><button type="button" aria-label="'+(eu()?'Itxi':'Cerrar')+'">×</button></div><iframe title="'+(eu()?'Kokapena':'Ubicación')+'" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><p><a target="_blank" rel="noopener noreferrer"></a></p>';
  d.querySelector('h2').textContent=query;
  d.querySelector('button').onclick=()=>d.close();
  d.querySelector('iframe').src='https://maps.google.com/maps?q='+encodeURIComponent(query)+'&output=embed';
  const a=d.querySelector('a');a.href=url;a.textContent=eu()?'Ireki Google Maps':'Abrir en Google Maps';
  d.showModal();
 });
 window.UniMaps={button};
})();