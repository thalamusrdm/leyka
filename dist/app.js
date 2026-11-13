'use strict';
const menuButton=document.querySelector('.menu-toggle'),mobileMenu=document.querySelector('#mobile-nav'),overlay=document.querySelector('#desktop-menu'),header=document.querySelector('.leica-header');
const panelButtons=[...document.querySelectorAll('[data-panel]')];
const languageButton=document.querySelector('#language-toggle'),languageOptions=document.querySelector('#language-options');
const contentAreas=[document.querySelector('main'),document.querySelector('footer')].filter(Boolean);
let activePanel=null,menuOpener=null;
function visibleFocusables(root){return [...root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));}
function setMenuState(open){document.body.classList.toggle('menu-open',open);contentAreas.forEach(e=>e.inert=open);}
function closeLanguage(){languageOptions.hidden=true;languageButton.setAttribute('aria-expanded','false');}
function closeMenu(restoreFocus=false){const opener=menuOpener;mobileMenu.hidden=true;overlay.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','פתיחת תפריט');panelButtons.forEach(b=>b.setAttribute('aria-expanded','false'));activePanel=null;menuOpener=null;setMenuState(false);if(restoreFocus&&opener)opener.focus();}
function focusMenu(root){root.querySelector('button').focus();}
menuButton.addEventListener('click',()=>{const open=mobileMenu.hidden;closeMenu();closeLanguage();if(open){mobileMenu.hidden=false;menuOpener=menuButton;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','סגירת תפריט');setMenuState(true);focusMenu(mobileMenu);}});
panelButtons.forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.panel,open=activePanel!==name;closeMenu();closeLanguage();if(open){activePanel=name;menuOpener=button;overlay.hidden=false;overlay.querySelectorAll('[id^=panel-]').forEach(p=>p.hidden=p.id!=='panel-'+name);button.setAttribute('aria-expanded','true');setMenuState(true);focusMenu(overlay);}}));
document.querySelectorAll('.leica-menu-close,.leica-mobile-close').forEach(b=>b.addEventListener('click',()=>closeMenu(true)));
overlay.addEventListener('click',e=>{if(e.target===overlay)closeMenu(true);});
document.querySelectorAll('#desktop-menu a,#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{closeMenu();const destination=new URL(a.href);if(destination.origin===location.origin&&destination.pathname===location.pathname&&destination.hash){const target=document.getElementById(decodeURIComponent(destination.hash.slice(1)));if(target)requestAnimationFrame(()=>{target.setAttribute('tabindex','-1');target.focus({preventScroll:true});});}}));
languageButton.addEventListener('click',()=>{const open=languageOptions.hidden;closeMenu();languageOptions.hidden=!open;languageButton.setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(!e.target.closest('.leica-language'))closeLanguage();});
document.addEventListener('keydown',e=>{
 const menu=!mobileMenu.hidden?mobileMenu:!overlay.hidden?overlay:null;
 if(e.key==='Escape'){if(menu){e.preventDefault();closeMenu(true);}else if(!languageOptions.hidden){e.preventDefault();closeLanguage();languageButton.focus();}return;}
 if(e.key==='Tab'&&menu){const items=[...visibleFocusables(header),...visibleFocusables(menu)];const first=items[0],last=items[items.length-1];if(!first)return;if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
window.matchMedia('(min-width:992px)').addEventListener('change',()=>closeMenu());
function updateHeader(){header.classList.toggle('is-scrolled',window.scrollY>30);}window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const search=document.querySelector('#store-search');
if(search){
 const form=document.querySelector('.store-filters'),city=document.querySelector('#store-city'),results=document.querySelector('#store-results'),empty=document.querySelector('#store-empty'),count=document.querySelector('#store-count');
 const originalCards=[...results.querySelectorAll('.store-card')];
 const normalize=s=>s.toLowerCase().normalize('NFKC').replace(/[״"'׳]/g,'').replace(/[־–-]/g,' ').replace(/\s+/g,' ').trim();
 const aliasCity=s=>['תל אביב','תא','יפו','תל אביב יפו'].includes(normalize(s))?'תל אביב-יפו':s;
 const params=new URLSearchParams(location.search);
 search.value=params.get('q')||'';
 city.value=aliasCity(params.get('city')||'');
 const items=originalCards.map(card=>({card,name:normalize(card.querySelector('h2').textContent),city:aliasCity(card.querySelector('.eyebrow').textContent)}));
 function filter(){
  const q=normalize(search.value),selected=city.value;
  let n=0;for(const item of items){const show=(!q||item.name.includes(q))&&(!selected||item.city===selected);item.card.hidden=!show;if(show)n++;}
  count.textContent=n===1?'נמצאה חנות אחת':n+' חנויות נמצאו';empty.hidden=n!==0;
  const query=new URLSearchParams();if(search.value.trim())query.set('q',search.value.trim());if(selected)query.set('city',selected);
  const next=location.pathname+(query.size?'?'+query.toString():'');history.replaceState(null,'',next);
 }
 search.addEventListener('input',filter);city.addEventListener('change',filter);form.addEventListener('submit',e=>{e.preventDefault();filter();});form.addEventListener('reset',()=>{search.value='';city.value='';filter();});document.querySelector('#empty-reset').addEventListener('click',()=>{form.reset();search.focus();});filter();
}
const contactForm=document.querySelector('#contact-form');
if(contactForm){
 const status=document.querySelector('#form-status'),fallback=document.querySelector('#email-fallback'),prepared=document.querySelector('#prepared-message');
 contactForm.addEventListener('submit',e=>{
  e.preventDefault();if(!contactForm.reportValidity())return;
  const f=new FormData(contactForm),business=contactForm.dataset.kind==='business';
  const subject=(business?'פנייה עסקית':'פניית לקוח')+' — Leica Eyecare ישראל — '+f.get('subject');
  const lines=['שם: '+f.get('name'),'דוא״ל: '+f.get('email'),'טלפון: '+(f.get('phone')||'לא צוין'),business?'חנות / חברה: '+f.get('company'):'עיר: '+(f.get('city')||'לא צוינה'),'נושא: '+f.get('subject'),'','תוכן הפנייה:',String(f.get('message')).trim()];
  const body=lines.join('\n');prepared.value=subject+'\n\n'+body;fallback.hidden=false;
  const url='mailto:service@seemoreoptic.co.il?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  status.textContent='ההודעה מוכנה. יש לשלוח אותה מתוך תוכנת הדוא״ל שנפתחה.';
  location.href=url;
 });
 document.querySelector('#copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(prepared.value);status.textContent='תוכן הפנייה הועתק. אפשר להדביק בהודעת דוא״ל ולשלוח.';}catch{prepared.focus();prepared.select();status.textContent='הטקסט מסומן. העתיקו אותו והדביקו בהודעת דוא״ל.';}});
}
