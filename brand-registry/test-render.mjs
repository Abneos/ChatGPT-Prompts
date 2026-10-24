#!/usr/bin/env node
import { mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join,resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root=resolve(new URL('../',import.meta.url).pathname);
const dir=mkdtempSync(join(tmpdir(),'abneos-brand-test-'));
const assetDir=join(root,'brand-registry/assets');
mkdirSync(assetDir,{recursive:true});
const asset=join(assetDir,'fixture-'+process.pid+'.svg');
const manifest=join(root,'brand-registry/fixture-'+process.pid+'.json');
const content='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>';
const bytes=Buffer.from(content);
const data={schema_version:1,brands:{fixture:{status:'approved',approved_by:'test-only',approved_at:'2026-10-24',assets:{primary:{path:'brand-registry/assets/fixture-'+process.pid+'.svg',version:'v1',width:10,height:10,sha256:createHash('sha256').update(bytes).digest('hex')}}}}};
try {
 writeFileSync(asset,bytes);writeFileSync(manifest,JSON.stringify(data));
 const background=join(dir,'background.png');
 writeFileSync(background,Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5+sN8AAAAASUVORK5CYII=','base64'));
 const out=join(dir,'out.svg');
 const run=()=>spawnSync(process.execPath,[join(root,'brand-registry/render.mjs'),'--manifest',manifest,'--brand','fixture','--variant','primary','--background',background,'--out',out,'--width','1200','--height','630'],{encoding:'utf8'});
 let r=run();
 if(r.status!==0) throw Error('Good asset rejected: '+r.stderr);
 if(!readFileSync(out,'utf8').includes(bytes.toString('base64')))throw Error('Exact source bytes missing');
 data.brands.fixture.assets.primary.sha256='f'.repeat(64);writeFileSync(manifest,JSON.stringify(data));
 r=run();if(r.status===0||!r.stderr.includes('hash mismatch'))throw Error('Tampering was not rejected: '+r.stderr);
 data.brands.fixture.status='pending_assets';writeFileSync(manifest,JSON.stringify(data));
 r=run();if(r.status===0||!r.stderr.includes('Brand not approved'))throw Error('Pending brand was not rejected: '+r.stderr);
 console.log('PASS original bytes embedded, checksum mismatch rejected, pending brand rejected');
}finally {rmSync(asset,{force:true});rmSync(manifest,{force:true});rmSync(dir,{recursive:true,force:true});}
