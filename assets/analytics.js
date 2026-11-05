(() => {
 'use strict';
 const measurementId = 'G-8C9WYSHSG3';
 const enabled = ['http:', 'https:'].includes(location.protocol);
 let lastLocation = '';
 const lang = () => window.UniI18n?.lang === 'eu' ? 'eu' : 'es';
 function emit(event, params = {}) {
  if (!enabled) return;
  gtag('event', event === 'uni_page_view' ? 'page_view' : event, {site_language: lang(), university: null, degree: null,
   screen_name: null, previous_interest: null, interest_status: null, export_format: null, ...params});
 }
 function view(route) {
  const path = [route.screen, route.uni, route.segment, route.tab].filter(Boolean)
   .map(encodeURIComponent).join('/');
  const current = {teaching_center:route.center || null, screen_name: route.screen, university: route.uni || null, degree: route.degree || null,
   page_title: [route.title, 'Uni Explorer'].filter(Boolean).join(' · '),
   page_location: new URL('./#/' + path, window.location.href).href};
  if (!enabled || current.page_location === lastLocation) return;
  emit('uni_page_view', {...current, page_referrer: lastLocation || document.referrer.split(/[?#]/)[0]});
  lastLocation = current.page_location;
  const kind = {university:'university_view', detail:route.tab === 'orientation' ? 'orientation_view' : 'degree_view', favorites:'favorites_view'};
  if (kind[route.screen]) emit(kind[route.screen], current);
  if (['art-detail','foreign-detail'].includes(route.screen)) emit(route.tab==='orientation'?'orientation_view':'degree_view', current);
 }
 function gtag(){window.dataLayer.push(arguments);}
 if (enabled) {
  window.dataLayer = window.dataLayer || [];
  gtag('consent','default',{
   analytics_storage:'granted',ad_storage:'denied',
   ad_user_data:'denied',ad_personalization:'denied'
  });
  gtag('js',new Date());
  gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;
  document.head.append(script);
 }
 window.UniAnalytics={view,emit};
})();
