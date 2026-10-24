import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { render } from './render.mjs';

test('real UAEThrive approved wordmark is embedded unchanged', () => {
  const dir=mkdtempSync(join(tmpdir(),'uaethrive-real-brand-'));
  try {
    const background=join(dir,'background.png'),out=join(dir,'art.svg');
    writeFileSync(background,Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==','base64'));
    const result=render({brand:'uaethrive',variant:'wordmark',background,out});
    const asset=readFileSync(new URL('./assets/uaethrive/wordmark-v1.svg',import.meta.url));
    assert.equal(result.sha256,createHash('sha256').update(asset).digest('hex'));
    assert.ok(readFileSync(out,'utf8').includes(asset.toString('base64')));
    assert.throws(()=>render({brand:'uaethrive',variant:'favicon',background,out}),/variant missing/);
    assert.throws(()=>render({brand:'bookbizzy',variant:'primary',background,out}),/not approved/);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
