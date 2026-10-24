import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { render } from './render.mjs';

test('renders unchanged pinned original bytes and refuses altered artwork',()=>{
  const root=mkdtempSync(join(tmpdir(),'brand-test-'));
  try {
    const dir=join(root,'brand-registry');
    const assets=join(dir,'assets','test');
    mkdirSync(assets,{recursive:true});
    const logo=join(assets,'primary.svg');
    const original=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><text>TEST</text></svg>');
    writeFileSync(logo,original);
    const background=join(root,'background.png');
    writeFileSync(background,Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==','base64'));
    const unsafeBackground=join(root,'untrusted.svg');
    writeFileSync(unsafeBackground,'<svg xmlns="http://www.w3.org/2000/svg"/>');
    const manifest=join(dir,'brands.json');
    const entry={schema_version:1,brands:{test:{status:'approved',approved_by:'fixture',approved_at:'2026-10-24',assets:{primary:{path:'brand-registry/assets/test/primary.svg',sha256:createHash('sha256').update(original).digest('hex'),version:'1',width:100,height:50}}}}};
    writeFileSync(manifest,JSON.stringify(entry));
    const out=join(root,'render.svg');
    render({manifest,brand:'test',variant:'primary',background,out});
    assert.match(readFileSync(out,'utf8'),new RegExp(original.toString('base64')));
    assert.throws(()=>render({manifest,brand:'test',variant:'primary',background:unsafeBackground,out}),/Background must be/);
    assert.throws(()=>render({manifest,brand:'unknown',background,out}),/not approved/);
    writeFileSync(logo,'modified');
    assert.throws(()=>render({manifest,brand:'test',background,out}),/hash mismatch/);
  } finally {rmSync(root,{recursive:true,force:true});}
});
