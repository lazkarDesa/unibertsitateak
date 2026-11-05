(() => {
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const eu=()=>window.UniI18n?.lang==='eu';
 function button(query){
  return '<button type="button" class="map-button" data-map-query="'+esc(query)+'" aria-label="'+(eu()?'Ikusi mapan':'Ver en Google Maps')+'"><svg viewBox="0 0 24 32" width="20" height="27" aria-hidden="true"><defs><clipPath id="map-pin-shape"><path d="M12 1C5.9 1 1 5.9 1 12c0 7.3 8.5 13.5 10.2 18.3.3.9 1.3.9 1.6 0C14.5 25.5 23 19.3 23 12 23 5.9 18.1 1 12 1zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#map-pin-shape)"><path fill="#4285f4" d="M0 0h24v32H0z"/><path fill="#1a73e8" d="M0 0h24L0 24z"/><path fill="#ea4335" d="M0 5l12 10L0 27z"/><path fill="#fbbc04" d="M0 27L24 3v12L7 32H0z"/><path fill="#34a853" d="M24 7v25H5z"/></g></svg></button>';
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