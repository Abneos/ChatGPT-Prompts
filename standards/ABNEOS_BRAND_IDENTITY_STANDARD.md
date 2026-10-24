# Abneos Brand Identity Enforcement — v1.0

Status: mandatory for ALL branded creative and prototypes. Asset approval is separate from this standard.

## Golden rule
Never ask a generative model to recreate an approved logo, wordmark, favicon, icon, or actual founder portrait. Retrieve and place the exact approved file. Prototypes and unpublished mock-ups are not exempt.

## Source of truth
- Registry: `brand-registry/brands.json`.
- Each brand starts as `pending_assets`; *pending is not approval*.
- Promotion to `approved` requires a reviewed original asset, exact version, SHA-256 hash, approval attribution/date, and permitted variant usage. No inference from a website logo, memory, screenshot, design mock-up, or AI image.
- Never overwrite an approved asset in place: version and update all consumers deliberately.
- Any production system using assets must pin to a version/hash.

## Rendering pipeline
1. Identify brand by explicit request/project/domain; never silently use a different brand.
2. Select approved variant for background and placement (horizontal/stacked/symbol/favicons).
3. Generate backgrounds/illustrations separately, keeping a clear safe area.
4. Composite the *unmodified* approved logo/portrait from original bytes in SVG/PNG via deterministic layout tooling.
5. Verify bytes against registry SHA-256 before use. Do not rasterise and redraw text with AI.
6. Check contrast, clear space, bleed, crop, spelling, readability and safe print area.
7. If approved asset unavailable or hash mismatched: BLOCK branded delivery and report missing file. Non-branded layout exploration may continue but must say 'unbranded concept'.
8. For favicon work, use the approved icon variant, not a miniature invented wordmark.
9. Preserve human photographs exactly unless an expressly approved edit is specified.
10. Record brand, asset variant, version and checksum in the render job or build artefact.

## Required controls
- CI must verify every approved asset exists and its SHA-256 matches; reject missing/mismatched files.
- Social/print artwork: generate creative then composite assets; exclude the logo from AI image prompt.
- Website: import approved local asset or pinned trusted source; no text reconstruction.
- Design prototypes: approved branding or clearly unbranded. Avoid watermarked substitute logos.
- A changed logo needs explicit approval and a versioned registry update.
- Do not infer permission to change branding from generic 'modernise' or 'improve' instructions.

## Onboarding
Acquire original vector and raster files from authorised owner or existing verified source. Confirm variant approvals. Calculate hashes. Change brand status to approved only when manifest fields are complete and CI passes.

## Limitations
Prompt rules and memory are not a pixel-level guarantee. File-based compositing and SHA validation are. This standard alone does not deploy integrations to every independent repository; adopt it in each project build and agent entrypoint.