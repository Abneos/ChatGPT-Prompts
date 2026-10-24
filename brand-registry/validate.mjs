#!/usr/bin/env node
// Node 20+; usage: node brand-registry/validate.mjs [path/to/brands.json]
// Approved assets must be checked in under brand-registry/assets/ and hash-pinned.
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
const manifestPath=resolve(process.argv[2] ?? new URL('./brands.json', import.meta.url).pathname);
const root=resolve(dirname(manifestPath),'..');
const doc=JSON.parse(readFileSync(manifestPath,'utf8'));
let errors=[];
if(doc.schema_version!==1 || !doc.brands || typeof doc.brands!=='object') errors.push('Invalid manifest schema');
for(const [brand,entry] of Object.entries(doc.brands??{})){
  if(!['pending_assets','approved'].includes(entry.status)) errors.push(brand+': invalid status');
  if(entry.status!=='approved') continue;
  if(!entry.approved_by||!entry.approved_at||!Object.keys(entry.assets??{}).length) errors.push(brand+': missing approval metadata/assets');
  for(const [kind,asset] of Object.entries(entry.assets??{})){
    if(!asset.path||!asset.sha256||!asset.version) {errors.push(brand+'/'+kind+': missing path/hash/version');continue;}
    const absolute=resolve(root,asset.path);
    const rel=relative(resolve(root,'brand-registry/assets'),absolute);
    if(isAbsolute(rel)||rel==='..'||rel.startsWith('../')||!existsSync(absolute)){errors.push(brand+'/'+kind+': asset path not found or escapes registry');continue;}
    const hash=createHash('sha256').update(readFileSync(absolute)).digest('hex');
    if(hash!==asset.sha256) errors.push(brand+'/'+kind+': SHA-256 mismatch');
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Brand registry valid. Approved brands: '+Object.values(doc.brands).filter(x=>x.status==='approved').length);
