import {composeProductEditorial} from './product-editorial.mjs';
import {productDetails,categoryDetails,lifestyleDetails} from './product-content.mjs';
import {imageDimensions} from './image-dimensions.mjs';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const para=items=>items.map(t=>'<p>'+esc(t)+'</p>').join('');
const bullet=items=>'<ul>'+items.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>';
const image=(file,alt,cls='',eager=false)=>'<img class="'+cls+'" src="/assets/'+esc(file)+'" alt="'+esc(alt)+'" width="'+imageDimensions[file].width+'" height="'+imageDimensions[file].height+'" decoding="async" '+(eager?'fetchpriority="high"':'loading="lazy"')+'>';
const forward='<img class="source-forward" src="/assets/source-forward.svg" alt="" width="44" height="44">';
function overview(block,id){
 return '<section class="complete-product-overview" id="'+id+'" data-source-section="'+id+'"><div class="complete-product-copy"><span class="eyebrow" dir="ltr">'+esc(block.label)+'</span><h2>'+esc(block.title)+'</h2>'+para(block.paragraphs)+'</div><figure>'+image(block.image,block.alt)+'</figure></section>';
}
function specifications(block,id){
 return '<section class="complete-product-specs" id="'+id+'" data-source-section="'+id+'"><div class="complete-product-benefits"><h2>יתרונות</h2>'+bullet(block.benefits)+'</div><div class="complete-product-highlights"><h2>דגשים לפי קטגוריה</h2><p>לכל קטגוריה מאפייני תכנון משלה. אלה ההבדלים שמציג היצרן במשפחה הזו.</p>'+block.highlights.map(h=>'<article data-category="'+h.category+'"><h3>קטגוריה '+h.category+'</h3>'+bullet(h.items)+'</article>').join('')+'</div></section>';
}
export function renderProductPage(product){
 const p=productDetails[product.slug];
 let html='<section class="complete-product-hero" data-source-section="hero">'+image(p.heroImage,p.heroAlt,'',true)+'<div><a class="complete-product-breadcrumb" href="/lenses/">העדשות שלנו / '+esc(product.type)+'</a><p class="complete-product-name" dir="ltr">'+esc(product.name)+'<sup>®</sup></p><h1>'+esc(p.heroTitle)+'</h1></div></section>';
 html+='<section class="complete-product-campaign" id="campaign" data-source-section="campaign"><figure>'+image(p.campaign.image,p.campaign.alt)+'</figure><div><h2>'+esc(p.campaign.title)+'</h2>'+para(p.campaign.paragraphs)+'<p class="complete-product-slogan" lang="en" dir="ltr">Unblur the world.</p></div></section>';
 html+=overview(p.overview,'overview');
 if(p.esm) html+='<section class="complete-product-esm" id="esm" data-source-section="esm"><span class="eyebrow" dir="ltr">EYE SAFETY MATERIAL</span><div><h2>'+esc(p.esm.title)+'</h2>'+para(p.esm.paragraphs)+'</div></section>';
 html+=specifications(p,'specifications');
 if(p.digital){html+=overview(p.digital,'digital');html+=specifications(p.digital,'digital-specifications');}
 if(p.lifestyle) html+='<section class="complete-product-lifestyles" id="lifestyle" data-source-section="lifestyle"><div class="complete-section-heading"><h2>עדשות לשימושים ייעודיים</h2><p>פתרונות נוספים שמציג היצרן לנהיגה, לספורט ולצילום.</p></div><div class="complete-lifestyle-grid">'+lifestyleDetails.map(l=>'<article data-lifestyle="'+l.key+'"><figure>'+image(l.image,l.alt)+'</figure><div><h3>'+esc(l.title)+'</h3><p class="complete-lifestyle-name" dir="ltr">'+esc(l.product)+'</p><p>'+esc(l.paragraph)+'</p><a href="/contact/">לבדיקת התאמה וזמינות בישראל'+forward+'</a></div></article>').join('')+'</div></section>';
 html+='<section class="complete-product-categories" id="categories" data-source-section="categories"><div class="complete-section-heading"><span class="eyebrow">קטגוריות העדשות</span><h2>בוחרים את רמת התכנון</h2><p>Leica מציגה שלוש קטגוריות: 4, 3 ו־2. כולן חלק ממשפחת עדשות הפרימיום של המותג; ההבדל הוא ברמת התכנון ובתכונות המוצעות.</p></div><div class="complete-category-grid">'+categoryDetails.map(c=>'<article data-category="'+c.category+'"><span class="complete-category-number">קטגוריה '+c.category+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.paragraph)+'</p>'+bullet(c.items)+'</article>').join('')+'</div><p class="complete-product-note">מאפייני הקטגוריה תלויים במשפחת העדשה ובתכנון הנבחר. המשווק יבדוק את הרמה המתאימה ואת האפשרויות הזמינות בישראל לפי המרשם והמסגרת.</p></section>';
 const options=[['material','חומרי עדשה','option-material.webp','materials'],['coating','ציפויים','option-coating.webp','coatings'],['colour','אפשרויות צבע','option-colour.webp','colours'],['engraving','חריטה','option-engraving.webp','engraving']];
 html+='<section class="complete-product-options" id="options" data-source-section="options"><div class="complete-section-heading"><h2>תכונות העדשה</h2></div><div class="complete-option-grid">'+options.map(([key,label,img,anchor])=>'<a data-option="'+key+'" href="/about/#'+anchor+'">'+image(img,'אפשרות '+label+' בעדשות Leica')+'<span>'+label+'</span>'+forward+'</a>').join('')+'</div></section>';
 const quality=[['experience','quality-experience.svg','יותר ממאה שנות ניסיון באופטיקה'],['material','quality-material.svg','חומרי גלם איכותיים ועמידים'],['manufacturing','quality-manufacturing.svg','פיתוח וייצור בגרמניה'],['precision','quality-precision.svg','דיוק אופטי גבוה לראייה ברורה']];
 html+='<section class="complete-product-quality" id="quality" data-source-section="quality"><h2>איכות מבית Leica</h2><div>'+quality.map(([key,icon,label])=>'<article data-quality="'+key+'">'+image(icon,'')+'<h3>'+label+'</h3></article>').join('')+'</div><a class="reference-button" href="/about/">על הפיתוח והאיכות</a></section>';
 html+='<section class="complete-product-israel" id="israel" data-source-section="israel"><div><h2>התאמה ושירות בישראל</h2><p>המידע המקצועי מבוסס על עמוד המוצר של Leica. נתוני הביצועים מתייחסים למוצרים ולגרסאות שמתאר היצרן; ההתאמה האישית והזמינות המקומית נבדקות עם המשווק.</p><p>לפרטים על ההזמנה ותנאי האחריות בישראל, פנו לחנות או לשירות הלקוחות.</p><a class="source-link" href="'+esc(product.source)+'" target="_blank" rel="noopener">לעמוד המוצר באתר Leica העולמי ↗</a></div><div class="complete-israel-actions"><a class="reference-button" href="/stores/">מצאו משווק להתאמה</a><a class="text-link" href="/contact/">שירות לקוחות בישראל</a></div></section>';
 return composeProductEditorial(html,product,p);
}
