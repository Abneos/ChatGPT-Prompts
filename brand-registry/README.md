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
