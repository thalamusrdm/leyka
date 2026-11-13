// Shared presentation layer. All original product copy and media stay in product-pages/content.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function composeProductEditorial(html,product,details){
 const imageStart=html.indexOf('<img');
 const imageEnd=html.indexOf('>',imageStart)+1;
 html=html.slice(0,imageStart)+'<figure class="editorial-hero-media">'+html.slice(imageStart,imageEnd)+'</figure>'+html.slice(imageEnd);
 const links=[['overview','העדשה']];
 if(details.digital)links.push(['digital','MONOVID DIGITAL']);
 if(details.esm)links.push(['esm','חומר ESM']);
 if(details.lifestyle)links.push(['lifestyle','שימושים ייעודיים']);
 links.push(['categories','קטגוריות'],['options','אפשרויות'],['israel','התאמה בישראל']);
 const nav='<nav class="editorial-index" aria-label="בעמוד '+esc(product.name)+'"><span dir="ltr">'+esc(product.name)+'®</span>'+links.map(([id,label])=>'<a href="#'+id+'">'+esc(label)+(id==='israel'?' <span aria-hidden="true">↙</span>':'')+'</a>').join('')+'</nav>';
 html=html.replace('</section>','</section>'+nav);
 const chapters=[['campaign','נקודת המבט'],['overview',product.type]];
 if(details.esm)chapters.push(['esm','חומר העדשה']);
 if(details.digital)chapters.push(['digital','תמיכה לקרוב']);
 if(details.lifestyle)chapters.push(['lifestyle','שימושים ייעודיים']);
 chapters.push(['categories','רמות התכנון'],['options','אפשרויות'],['quality','איכות Leica'],['israel','בישראל']);
 for(const [index,[id,label]] of chapters.entries()){
  const marker='<span class="editorial-chapter"><span dir="ltr">'+String(index+1).padStart(2,'0')+'</span><span>'+esc(label)+'</span></span>';
  if(id==='campaign')html=html.replace('<div><h2>'+esc(details.campaign.title),'<div>'+marker+'<h2>'+esc(details.campaign.title));
  else if(id==='overview'||id==='digital')html=html.replace('id="'+id+'" data-source-section="'+id+'"><div class="complete-product-copy">','id="'+id+'" data-source-section="'+id+'"><div class="complete-product-copy">'+marker);
  else html=html.replace('id="'+id+'" data-source-section="'+id+'">','id="'+id+'" data-source-section="'+id+'">'+marker);
 }
 for(const n of [4,3,2])html=html.replace('<span class="complete-category-number">קטגוריה '+n+'</span>','<span class="complete-category-number"><span class="editorial-category-label">קטגוריה </span><span class="editorial-category-digit">'+n+'</span></span>');
 return html;
}
