# Abneos central brand identity registry

This registry supplies the asset approval and checksum contract for all brands. It does **not** automatically replace live website files or apply a logo to generative AI outputs.

- `brands.json`: approved/pending status; only entries with approved metadata and pinned files qualify.
- `validate.mjs`: validates approved asset files against SHA-256 hashes.
- `candidates/`: provenance records for discovered but unapproved or conflicting existing assets.
- `assets/`: add actual approved original files here once verified.

## Working with images
Generate photographic/creative background without a logo, and then add the approved logo/wordmark using deterministic rendering with original SVG or PNG. AI must not hallucinate missing assets. The same applies to prototypes and founder photographs.

## CI
Run `node brand-registry/validate.mjs`. A brand with `pending_assets` is intentionally not approved even when candidate sources have been discovered. Builds requiring that brand's actual approved artwork should fail closed; the registry validator only checks integrity of already approved entries.

## Onboarding procedure
1. Locate authoritative originals and examine conflicting candidates.
2. Confirm approval and rights for each variant.
3. Copy originals, compute actual file SHA-256, add version and approval data.
4. Validate registry and adopt in each website/graphics pipeline.
5. Check resulting artwork for legibility, crops, brand safe area, and exact asset use.

See `standards/ABNEOS_BRAND_IDENTITY_STANDARD.md`.

## Render approved branded artwork
After a brand has an approved, hash-pinned asset with `width` and `height` (intrinsic aspect ratio), generate the creative background separately and render:

```bash
node brand-registry/render.mjs --brand uaethrive --variant primary --background /path/creative.png --out /path/branded.svg --width 1200 --height 630 --logo-width 320 --margin 40 --position bottom-right
```

The SVG output embeds the unchanged original bytes of the approved SVG/PNG logo in a `data:` URL. This retains the original logo content without asking AI to redraw it. Rendering fails closed for a pending/unapproved brand, missing variant or changed original. The output is a final SVG, not a PNG; downstream tools can export PNG after visually verifying render and fonts. Background is scaled to cover canvas, so ensure text and faces are within safe cropping margins. This is an initial automated composition route, not a replacement for a full typography and layout engine.

Test with `node --test brand-registry/render.test.mjs`.

**Security:** only approved local registry files should be used for logos. Background must be a locally supplied, trusted image file. Do not feed untrusted SVG from external sources into public render pipelines without sanitising it.

## Deterministic social/OG artwork renderer

Install dependencies in an isolated environment:

```sh
python -m pip install -r brand-registry/requirements.txt
node brand-registry/validate.mjs
python -m unittest discover -s brand-registry -p 'test_*.py'
```

Once a brand has approved original files registered with matching SHA-256 hashes:

```sh
python brand-registry/render.py --brand uaethrive --variant primary --background creative-background.png --output final-social.png --anchor bottom-right --margin 64
```

The renderer never generates or approximates branding. It overlays the registered image bytes after checksum verification. A brand without approved assets fails closed; it cannot produce a falsely branded image.

**Scope:** This is a local rendering utility, not an API or automatically deployed service. Existing ChatGPT image generation cannot automatically consume private GitHub assets without a connected retrieval/compositing workflow.

## Deterministic artwork renderer

After a brand is approved and its files are registered with SHA-256 checksums, render a brand-safe SVG by compositing the original file unchanged on top of a background image:

```sh
node brand-registry/render.mjs --brand uaethrive --asset wordmark --background creative.png --out artwork.svg --width 1200 --height 630 --position bottom-right --logo-width 320 --logo-height 85 --margin 48
```

This produces a self-contained SVG using the **original, checksum-verified logo bytes**. It refuses pending brands, missing variants, tampered artwork, or assets outside the approved registry. PNG/JPEG/WebP backgrounds are supported; approved overlays must be PNG or SVG. Browser/image-rasteriser compatibility must be tested before publishing to social channels. For print workflows, rasterise at the appropriate output resolution and inspect safe zones manually.

Run the fixture test with `node brand-registry/test-render.mjs`. The test creates a temporary synthetic logo and asserts that exact bytes are embedded, a forged hash is rejected, and pending brands cannot render. The fixture does not represent any real brand.
