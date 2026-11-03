/* Las traducciones solo afectan a presentación y enlaces: las claves guardadas permanecen en castellano. */
(()=>{'use strict';
 const data=window.EU_TRANSLATIONS||{strings:{},templates:[],degrees:{},aliases:{},links:{}},KEY='uni-explorer.language.v1';
 let saved='es';try{saved=localStorage.getItem(KEY)||'es'}catch{}
 let params;try{params=new URL(window.location.href).searchParams}catch{}
 const lang=['es','eu'].includes(params?.get('lang'))?params.get('lang'):saved==='eu'?'eu':'es',locale=lang==='eu'?'eu-ES':'es-ES';
 const compact=s=>String(s??'').replace(/\s+/g,' ').trim(),dictionary=new Map(Object.entries(data.strings||{}).map(([s,t])=>[compact(s),t])),lower=new Map([...dictionary].map(([s,t])=>[s.toLocaleLowerCase('es'),t]));
 const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const templates=(data.templates||[]).map(([es,eu])=>{let names=[];const parts=es.split(/(\{n\d+\})/g);return {re:new RegExp('^'+parts.map(p=>/^\{n\d+\}$/.test(p)?(names.push(p),'([0-9]+(?:[.,][0-9]+)?)'):escapeRE(p)).join('')+'$'),eu,names}});
 function key(s){return compact(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es')}
 function degree(uni,id,original){if(lang==='es')return original??id;return data.aliases?.[uni]?.[original]||data.degrees?.[uni]?.[id]||text(original??id);}
 function translate(s,depth=0){
  if(dictionary.has(s))return dictionary.get(s);
  const lc=s.toLocaleLowerCase('es');if(lower.has(lc)){const eu=lower.get(lc);return s===s.toLocaleUpperCase('es')&&s.length>3?eu.toLocaleUpperCase('eu'):eu}
  for(const p of templates){const m=s.match(p.re);if(m){const values=Object.fromEntries(p.names.map((n,i)=>[n,m[i+1]]));return p.eu.replace(/\{n\d+\}/g,n=>values[n]??n)}}
  const report=s.match(/^Informe (.+) · tasa de empleo: página (\d+); relación con los estudios: página (\d+)\. Los porcentajes originales están redondeados; el índice también es aproximado\.$/);if(report)return report[1]+' txostena · enplegu-tasa: '+report[2]+'. orrialdea; ikasketekiko lotura: '+report[3]+'. orrialdea. Jatorrizko ehunekoak biribilduta daude; indizea ere hurbilketa da.';
  const history=s.match(/^Título del informe: (.+) · Promoción (\d+) · (\d+) respuestas al estudio\. El número de respuestas sobre el empleo actual puede ser menor\. El informe agrupa el título; no distingue necesariamente campus, idioma o el plan actual\.$/);if(history)return 'Txostenaren titulua: '+translate(history[1],depth+1)+' · '+history[2]+'ko promozioa · '+history[3]+' erantzun azterlanean. Uneko enpleguari buruzko erantzun kopurua txikiagoa izan daiteke. Txostenak titulua biltzen du; ez ditu nahitaez campusa, hizkuntza edo indarreko plana bereizten.';
  const titleRow=s.match(/^Título: (.+) · Excel oficial, hoja (.+), fila (\d+)\.$/);if(titleRow)return 'Titulua: '+translate(titleRow[1],depth+1)+' · Excel ofiziala, '+titleRow[2]+' orria, '+titleRow[3]+'. errenkada.';
  const weighting=s.match(/^(Ver ponderaciones|Ponderaciones de):? (.+)$/);if(weighting){const name=Object.values(data.aliases||{}).map(x=>x[weighting[2]]).find(Boolean)||translate(weighting[2],depth+1);return (weighting[1]==='Ver ponderaciones'?'Ikusi haztapenak: ':'Haztapenak: ')+name;}
  if(depth>5)return s;
  const tick=s.match(/^([✓?€↗→←]\s*)(.+)$/);if(tick)return tick[1]+translate(tick[2],depth+1);
  const suffix=s.match(/^(.+): explicado de forma sencilla$/);if(suffix)return translate(suffix[1],depth+1)+': azalpen erraza';
  const image=s.match(/^(.+) Captura de ejemplo con (\d+) zonas numeradas\.$/);if(image)return translate(image[1],depth+1)+' '+image[2]+' gune zenbakitu dituen adibideko pantaila-irudia.';
  for(const delimiter of [' · ',' / ',' + ']){if(s.includes(delimiter)){const parts=s.split(delimiter),translated=parts.map(x=>translate(x,depth+1));if(translated.some((x,i)=>x!==parts[i]))return translated.join(delimiter)}}
  const punctuation=s.match(/^(.+)([.:;])$/);if(punctuation&&dictionary.has(punctuation[1]))return dictionary.get(punctuation[1])+punctuation[2];
  if(s.endsWith(' ↗'))return translate(s.slice(0,-2),depth+1)+' ↗';
  const parenthesis=s.match(/^(.+) \(([^)]+)\)$/);if(parenthesis){const a=translate(parenthesis[1],depth+1),b=translate(parenthesis[2],depth+1);if(a!==parenthesis[1]||b!==parenthesis[2])return a+' ('+b+')'}
  if(/^(Castellano|Español|Euskera|Inglés|Francés|Alemán|Italiano|Portugués)(?:,| y | e )/.test(s)){return s.replace(/[.]$/,'').split(/,\s*| y | e /).map(x=>translate(x,depth+1)).join(', ')+(s.endsWith('.')?'.':'')}
  const sentences=s.split(/(?<=[.!?]) (?=[A-ZÁÉÍÓÚ])/u);if(sentences.length>1){const parts=sentences.map(x=>translate(x,depth+1));if(parts.some((x,i)=>x!==sentences[i]))return parts.join(' ')}
  return s;
 }
 function text(value){const original=String(value??'');if(lang==='es'||!original.trim())return original;const clean=compact(original),result=translate(clean);return result===clean?original:original.match(/^\s*/)[0]+result+original.match(/\s*$/)[0];}
 function url(value){if(lang==='es'||typeof value!=='string')return value;
  if(data.helpAssetsReady&&/(?:^|\/)assets\/help\//.test(value))return value.replace('assets/help/','assets/help-eu/');
  if(data.helpAssetsReady&&/manual-uni-explorer\.pdf(?:[?#]|$)/.test(value))return value.replace('manual-uni-explorer.pdf','manual-uni-explorer-eu.pdf');
  const [base,...hash]=value.split('#'),mapped=data.links?.[base];return mapped?mapped+(hash.length?'#'+hash.join('#'):''):value;
 }
 const searchText=value=>String(value??'')+' '+translate(compact(value));
 const searchName=(uni,id,original)=>searchText(original)+' '+(data.aliases?.[uni]?.[original]||'')+' '+(data.degrees?.[uni]?.[id]||'')+(/ADE|Administraci.n y Direcci.n de Empresas/i.test(original)?' EAZ':'');
 const api={lang,locale,text,t:text,degree,url,key,searchText,searchName,missing:s=>lang==='eu'&&translate(compact(s))===compact(s)};window.UniI18n=api;
 if(typeof document==='undefined')return;
 document.documentElement.lang=lang;document.title=text(document.title);const description=document.querySelector?.('meta[name=description]');if(description)description.content=text(description.content);
 const remembered=new WeakMap();
 function nodeText(n){const original=n.nodeValue;if(!original?.trim())return;const el=n.parentElement;if(!el||el.closest('script,style,code,pre,textarea,[data-no-translate]'))return;
  const previous=remembered.get(n);if(previous&&original===previous)return;
  const name=el.closest('[data-degree-name]'),heading=el.closest('.detail-heading h1');
  let translated;if(name||heading){const uni=name?.closest('[data-hover-uni]')?.dataset.hoverUni||window.history.state?.screenState?.uni;translated=degree(uni,key(original),original)}else translated=text(original);
  if(original!==translated){remembered.set(n,translated);n.nodeValue=translated;}
 }
 function label(el,name,value){const uni=el.dataset.favoriteUni||el.dataset.bookUni||window.history.state?.screenState?.uni;let m=value.match(/^Cambiar interés: (.+) · (.+)$/);if(m)return text('Cambiar interés')+': '+degree(uni,key(m[1]),m[1])+' · '+text(m[2]);m=value.match(/^(Ver ponderaciones|Ponderaciones de):? (.+)$/);return m?text(m[1])+': '+degree(uni,key(m[2]),m[2]):text(value);}
 function apply(root){if(lang!=='eu'||!root)return;if(root.nodeType===3){nodeText(root);return}
  const elements=[...(root.nodeType===1?[root]:[]),...(root.querySelectorAll?.('*')||[])];
  for(const el of elements){if(el.closest?.('script,style,code,pre,textarea,[data-no-translate]'))continue;for(const attr of ['aria-label','title','placeholder','alt']){const v=el.getAttribute?.(attr);if(v){const next=label(el,attr,v);if(v!==next)el.setAttribute(attr,next)}}for(const attr of ['href','src']){const v=el.getAttribute?.(attr);if(v){const next=url(v);if(next!==v)el.setAttribute(attr,next)}}}
  if(typeof document.createTreeWalker==='function'){const walker=document.createTreeWalker(root,4);let n;while(n=walker.nextNode())nodeText(n)}
 }
 api.apply=apply;
 const button=document.getElementById('language-button'),menu=document.getElementById('language-menu');
 function closeMenu(){if(menu)menu.hidden=true;button?.setAttribute('aria-expanded','false')}
 function choose(next){if(!['es','eu'].includes(next)||next===lang){closeMenu();return}try{localStorage.setItem(KEY,next)}catch{}const current=new URL(window.location.href);current.searchParams.set('lang',next);window.history.replaceState(window.history.state,'',current.href);window.location.reload();}
 api.choose=choose;
 if(button&&menu){button.querySelector('[data-language-current]').textContent=lang.toUpperCase();button.setAttribute('aria-label',lang==='eu'?'Aldatu hizkuntza: euskara':'Cambiar idioma: castellano');button.addEventListener('click',()=>{menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)menu.querySelector('[data-language="'+lang+'"]')?.focus()});for(const option of menu.querySelectorAll('[data-language]')){option.setAttribute('aria-checked',String(option.dataset.language===lang));option.addEventListener('click',()=>choose(option.dataset.language))}document.addEventListener('click',e=>{if(!e.target.closest('.language-switch'))closeMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){e.stopPropagation();closeMenu();button.focus()}});}
 if(lang==='eu'){apply(document.body);if(typeof MutationObserver!=='undefined'){const observer=new MutationObserver(records=>{const roots=new Set();for(const r of records){if(r.type==='attributes')roots.add(r.target);else if(r.type==='characterData')roots.add(r.target);else for(const n of r.addedNodes)roots.add(n)}for(const r of roots)apply(r)});observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt','href','src']});}}
})();
