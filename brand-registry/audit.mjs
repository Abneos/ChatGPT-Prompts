#!/usr/bin/env node
// Read-only audit: surface missing approvals before creating branded artwork.
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const manifestPath=resolve(process.argv[2]||fileURLToPath(new URL('./brands.json',import.meta.url)));
const root=resolve(dirname(manifestPath),'..');
const assetRoot=resolve(root,'brand-registry/assets');
const data=JSON.parse(readFileSync(manifestPath,'utf8'));
let approved=0, pending=0, invalid=0;
for (const [name,brand] of Object.entries(data.brands||{})){
 if(brand.status!=='approved'){pending++;console.log(name+': PENDING (no approved branding permitted)');continue;}
 const assets=Object.entries(brand.assets||{});
 if(!assets.length){invalid++;console.log(name+': INVALID (approved without assets)');continue;}
 let good=true;
 for(const [variant,a] of assets){
   try {
     const path=resolve(root,a.path);
     const relativePath=relative(assetRoot,path);
     if(isAbsolute(relativePath)||relativePath==='..'||relativePath.startsWith('..'+sep)||!existsSync(path))throw Error('missing/unsafe file');
     if(!realpathSync(path).startsWith(realpathSync(assetRoot)+sep))throw Error('unsafe symlink');
     const hash=createHash('sha256').update(readFileSync(path)).digest('hex');
     if(hash!==a.sha256)throw Error('checksum mismatch');
     if(!(a.width>0&&a.height>0))throw Error('dimensions missing');
     console.log(name+'/'+variant+': VERIFIED '+a.version);
   } catch(e) {good=false;console.error(name+'/'+variant+': INVALID '+e.message);}
 }
 if(good)approved++;else invalid++;
}
console.log(JSON.stringify({approved,pending,invalid}));
if(invalid)process.exitCode=1;
