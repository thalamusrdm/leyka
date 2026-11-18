// Presentation only. The complete approved Hebrew copy remains in content.mjs.
const chapter=(number,label)=>'<span class="story-chapter"><span dir="ltr">'+number+'</span><span>'+label+'</span></span>';
export function composeBrandEditorial(html,kind){
 const links=kind==='brand'?[['expertise-intro','המומחיות'],['history','המורשת'],['production','המפעלים'],['expertise','תכנון ואיכות'],['brand-israel','בישראל']]:[['research','פיתוח'],['manufacturing','ייצור'],['materials','חומר וגימור'],['engraving','חריטה'],['inspection','בקרת איכות'],['israel-service','שירות בישראל']];
 const label=kind==='brand'?'סיפור המותג':'אודות ואיכות';
 const nav='<nav class="story-index" aria-label="בעמוד '+label+'"><span>'+label+'</span>'+links.map(([id,text])=>'<a href="#'+id+'">'+text+'</a>').join('')+'</nav>';
 html=html.replace('</section>','</section>'+nav);
 if(kind==='brand'){
  html=html.replace('<section class="reference-intro">','<section class="reference-intro" id="expertise-intro">');
  html=html.replace('<div class="reference-intro-copy">','<div class="reference-intro-copy">'+chapter('01','המומחיות'));
  html=html.replace('<div class="content-section-heading">','<div class="content-section-heading">'+chapter('02','המורשת'));
  html=html.replace('<section class="brand-production" id="production">','<section class="brand-production" id="production">'+chapter('03','ייצור')+'<figure class="story-production-media"><img src="/assets/brand-quality.jpg" width="2048" height="1337" alt="הדמיית עדשות Leica" loading="lazy" decoding="async"></figure>');
  html=html.replace('<section class="brand-expertise">','<section class="brand-expertise" id="expertise">'+chapter('04','תכנון ואיכות'));
  html=html.replace('<section class="israel-contact-strip">','<section class="israel-contact-strip" id="brand-israel">'+chapter('05','בישראל'));
 }
 return html;
}
