(() => {
 'use strict';
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const eu=()=>window.UniI18n?.lang==='eu';
 const data=window.UNI_LOCATIONS;
 function forOffer(uni,offer){return button(data.offers[uni]?.[offer.id]);}
 function forArts(group){return button(data.arts[group]);}
 function button(id){
  const place=data.locations[id];if(!place)return '';
  const label=(eu()?'Ikusi mapan: ':'Ver en Google Maps: ')+place.name;
  return '<button type="button" class="map-button" data-map-location="'+esc(id)+'" aria-label="'+esc(label)+'" title="'+esc(place.name)+'">'+PIN+'</button>';
 }
 const PIN="<svg viewBox=\"0 0 24 32\" width=\"20\" height=\"27\" aria-hidden=\"true\"><defs><clipPath id=\"map-pin-shape\"><path d=\"M12 1C5.9 1 1 5.9 1 12c0 7.3 8.5 13.5 10.2 18.3.3.9 1.3.9 1.6 0C14.5 25.5 23 19.3 23 12 23 5.9 18.1 1 12 1zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z\" clip-rule=\"evenodd\"/></clipPath></defs><g clip-path=\"url(#map-pin-shape)\"><path fill=\"#4285f4\" d=\"M0 0h24v32H0z\"/><path fill=\"#1a73e8\" d=\"M0 0h24L0 24z\"/><path fill=\"#ea4335\" d=\"M0 5l12 10L0 27z\"/><path fill=\"#fbbc04\" d=\"M0 27L24 3v12L7 32H0z\"/><path fill=\"#34a853\" d=\"M24 7v25H5z\"/></g></svg>";
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-map-location]');if(!button)return;
  const place=data.locations[button.dataset.mapLocation];if(!place)return;
  const query=place.name+', '+place.address;
  const url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);
  if(matchMedia('(max-width:690px)').matches){window.open(url,'_blank','noopener');return;}
  let dialog=document.getElementById('location-dialog');
  if(!dialog){dialog=document.createElement('dialog');dialog.id='location-dialog';document.body.append(dialog);}
  dialog.innerHTML='<div class="map-heading"><h2></h2><button type="button" aria-label="'+(eu()?'Itxi':'Cerrar')+'">×</button></div>'+
   '<p class="map-address"></p><iframe title="'+(eu()?'Kokapena':'Ubicación')+'" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>'+
   '<p><a class="map-external" target="_blank" rel="noopener noreferrer"></a> · <a class="map-source" target="_blank" rel="noopener noreferrer"></a></p>';
  dialog.querySelector('h2').textContent=place.name;
  dialog.querySelector('.map-address').textContent=place.address+(place.kind==='campus'?(eu()?' · Campusaren kokapena':' · Ubicación del campus'):'');
  dialog.querySelector('button').onclick=()=>dialog.close();
  dialog.querySelector('iframe').src='https://maps.google.com/maps?q='+encodeURIComponent(query)+'&output=embed';
  const external=dialog.querySelector('.map-external');external.href=url;external.textContent=eu()?'Ireki Google Maps':'Abrir en Google Maps';
  const source=dialog.querySelector('.map-source');source.href=place.source;source.textContent=eu()?'Helbidearen iturri ofiziala':'Fuente oficial de la dirección';
  dialog.showModal();
 });
 window.UniMaps={button,forOffer,forArts};
})();