#!/usr/bin/env node
// Generates branded SVG artwork without asking an image model to reproduce a logo.
// Node 20+. Usage:
// node brand-registry/render.mjs --brand abneos --variant primary --background /tmp/bg.png --out /tmp/out.svg
// Optional: --width 1200 --height 630 --logo-width 340 --margin 56 --position bottom-right --manifest custom.json
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, relative, isAbsolute, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

function fail(message) { throw new Error(message); }
function xml(value) { return String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
function argsMap(argv) {
  const result={};
  for(let i=0;i<argv.length;i+=2) {
    const key=argv[i];
    if(!key?.startsWith('--') || !argv[i+1]?.length || argv[i+1].startsWith('--')) fail('Use --key value arguments');
    result[key.slice(2)]=argv[i+1];
  }
  return result;
}
function media(path) {
  switch(extname(path).toLowerCase()) {
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    default: fail('Unsupported image type: '+path);
  }
}
function positiveNumber(value, label) {
  const n=Number(value);
  if(!Number.isFinite(n)||n<=0) fail('Invalid '+label);
  return n;
}
export function render(options) {
  const registryPath=resolve(options.manifest ?? fileURLToPath(new URL('./brands.json',import.meta.url)));
  const root=resolve(dirname(registryPath),'..');
  const data=JSON.parse(readFileSync(registryPath,'utf8'));
  const brand=data.brands?.[options.brand];
  if(!brand || brand.status!=='approved') fail('Brand not approved: '+options.brand);
  const variant=options.variant ?? 'primary';
  const asset=brand.assets?.[variant];
  if(!asset?.path||!asset?.sha256||!asset?.version) fail('Approved asset variant missing: '+variant);
  if(!options.background || !options.out) fail('Background and output paths required');
  const path=resolve(root,asset.path);
  const rel=relative(resolve(root,'brand-registry/assets'),path);
  if(isAbsolute(rel)||rel==='..'||rel.startsWith('../')) fail('Asset must be inside registry assets');
  const bytes=readFileSync(path);
  if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256) fail('Approved asset hash mismatch');
  const width=positiveNumber(options.width??1200,'width');
  const height=positiveNumber(options.height??630,'height');
  const logoWidth=positiveNumber(options['logo-width']??320,'logo-width');
  const margin=positiveNumber(options.margin??40,'margin');
  const logoHeight=positiveNumber(asset.height,'asset.height')/positiveNumber(asset.width,'asset.width')*logoWidth;
  if(logoWidth+margin*2>width || logoHeight+margin*2>height) fail('Logo exceeds safe area');
  const position=options.position??'bottom-right';
  if(!['bottom-right','bottom-left','top-right','top-left'].includes(position)) fail('Invalid position');
  const x=position.endsWith('right')?width-margin-logoWidth:margin;
  const y=position.startsWith('bottom')?height-margin-logoHeight:margin;
  const bgPath=resolve(options.background);
  // Backgrounds must be raster: reject potentially active/untrusted SVG documents.
  if(!['.png','.jpg','.jpeg','.webp'].includes(extname(bgPath).toLowerCase())) fail('Background must be PNG, JPEG or WebP');
  const bg=readFileSync(bgPath);
  const background='data:'+media(bgPath)+';base64,'+bg.toString('base64');
  const logo='data:'+media(path)+';base64,'+bytes.toString('base64');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'">\n'
    +'<image href="'+xml(background)+'" width="'+width+'" height="'+height+'" preserveAspectRatio="xMidYMid slice"/>\n'
    +'<image href="'+xml(logo)+'" x="'+x+'" y="'+y+'" width="'+logoWidth+'" height="'+logoHeight+'" preserveAspectRatio="xMidYMid meet"/>\n'
    +'</svg>\n';
  writeFileSync(resolve(options.out),svg,{flag:'w'});
  return {brand:options.brand,variant,version:asset.version,sha256:asset.sha256,output:resolve(options.out),position};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try { console.log(JSON.stringify(render(argsMap(process.argv.slice(2))))); }
  catch(error){ console.error(error.message);process.exitCode=1; }
}
