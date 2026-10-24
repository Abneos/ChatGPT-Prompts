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
const data={schema_version:1,brands:{fixture:{status:'approved',approved_by:'test-only',approved_at:'2026-10-24',assets:{wordmark:{path:'brand-registry/assets/fixture-'+process.pid+'.svg',version:'v1',sha256:createHash('sha256').update(bytes).digest('hex')}}}}};
try {
 writeFileSync(asset,bytes);writeFileSync(manifest,JSON.stringify(data));
 const out=join(dir,'out.svg');
 const run=()=>spawnSync(process.execPath,[join(root,'brand-registry/render.mjs'),'--manifest',manifest,'--brand','fixture','--out',out],{encoding:'utf8'});
 let r=run();
 if(r.status!==0) throw Error('Good asset rejected: '+r.stderr);
 if(!readFileSync(out,'utf8').includes(bytes.toString('base64')))throw Error('Exact source bytes missing');
 data.brands.fixture.assets.wordmark.sha256='f'.repeat(64);writeFileSync(manifest,JSON.stringify(data));
 r=run();if(r.status===0||!r.stderr.includes('checksum mismatch'))throw Error('Tampering was not rejected');
 data.brands.fixture.status='pending_assets';writeFileSync(manifest,JSON.stringify(data));
 r=run();if(r.status===0||!r.stderr.includes('no approved assets'))throw Error('Pending brand was not rejected');
 console.log('PASS original bytes embedded, checksum mismatch rejected, pending brand rejected');
}finally {rmSync(asset,{force:true});rmSync(manifest,{force:true});rmSync(dir,{recursive:true,force:true});}
