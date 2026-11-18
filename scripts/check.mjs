
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import vm from 'node:vm';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const stores=JSON.parse(await fs.readFile(path.join(root,'stores.json'),'utf8'));assert.equal(stores.length,40);assert.equal(new Set(stores.map(s=>s.city)).size,27);assert(stores.every(s=>s.name&&s.address&&s.city));assert.equal(new Set(stores.map(s=>s.id)).size,40);
const files=await fs.readdir(root,{recursive:true});const pages=files.filter(f=>f.endsWith('.html'));assert.equal(pages.length,13);
for(const file of pages){const html=await fs.readFile(path.join(root,file),'utf8');assert(html.includes('lang="he" dir="rtl"'));assert(!/עלות יבואן|הנחת יבואן|catalog-internal|requires_confirmation/.test(html));for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)){const target=path.join(root,url.endsWith('/')?url+'index.html':url);await fs.access(target);}}
// Verify fragment destinations too, including cross-page navigation.
let anchorLinks=0;
for(const file of pages){
 const html=await fs.readFile(path.join(root,file),'utf8');
 for(const [,href] of html.matchAll(/href="([^" ]*#[^" ]+)"/g)){
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const [pathname,fragment]=href.split('#');
  if(!fragment)continue;
  const target=pathname?path.join(root,pathname.endsWith('/')?pathname+'index.html':pathname):path.join(root,file);
  const destination=await fs.readFile(target,'utf8');
  const ids=[...destination.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
  assert(ids.includes(decodeURIComponent(fragment)),file+': missing destination '+href);
  anchorLinks++;
 }
 assert(!/אופטיקאי|הויכלהיים/.test(html),file+': outdated terminology');
}
console.log('PASS: '+anchorLinks+' internal fragment links resolve.');
new vm.Script(await fs.readFile(path.join(root,'app.js'),'utf8'));
assert(!(await fs.readdir(root)).some(f=>f.endsWith('.xlsx')));
console.log('PASS: 13 RTL pages, 40 stores, 27 cities, local links and assets, JavaScript syntax, no internal catalog.');
