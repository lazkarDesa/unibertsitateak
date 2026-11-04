(() => {
 'use strict';
 const container = 'GTM-PNKDC9FM';
 const enabled = ['http:', 'https:'].includes(location.protocol);
 let lastLocation = '';
 const lang = () => window.UniI18n?.lang === 'eu' ? 'eu' : 'es';
 function emit(event, params = {}) {
  if (!enabled) return;
  window.dataLayer.push({event, site_language: lang(), university: null, degree: null,
   screen_name: null, previous_interest: null, interest_status: null, export_format: null, ...params});
 }
 function view(route) {
  const path = [route.screen, route.uni, route.segment, route.tab].filter(Boolean)
   .map(encodeURIComponent).join('/');
  const current = {screen_name: route.screen, university: route.uni || null, degree: route.degree || null,
   page_title: [route.title, 'Uni Explorer'].filter(Boolean).join(' · '),
   page_location: new URL('./#/' + path, window.location.href).href};
  if (!enabled || current.page_location === lastLocation) return;
  emit('uni_page_view', {...current, page_referrer: lastLocation || document.referrer.split(/[?#]/)[0]});
  lastLocation = current.page_location;
  const kind = {university:'university_view', detail:route.tab === 'orientation' ? 'orientation_view' : 'degree_view', favorites:'favorites_view'};
  if (kind[route.screen]) emit(kind[route.screen], current);
 }
 if (enabled) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('consent','default',{
   analytics_storage:'granted',ad_storage:'denied',
   ad_user_data:'denied',ad_personalization:'denied'
  });
  window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtm.js?id='+container;
  document.head.append(script);
 }
 window.UniAnalytics={view,emit};
})();
