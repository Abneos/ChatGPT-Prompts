# UAEThrive candidate asset inventory — 24 October 2026

These sources have been located in the actual `Abneos/uaethrive-platform` repository. They are NOT yet registered as approved for universal use.

| Kind | Source path | Git blob SHA | Notes |
|---|---|---|---|
| Wordmark | `uaethrive-brand-wiki/assets/uaethrive-wordmark.svg` | `8c2ac46a752af9145178a31c790c819f5c0b06c5` | Wiki uses as wordmark; branded teal/deep blue |
| Favicon A | `apps/web/public/favicon.svg` | `add0d5c1a6427061a14c6e4c4ff8c0e981755c9e` | Navy square with teal tick |
| Favicon B | `public/favicon.svg` | `6d6c9aa68af1b5ed597b6ee04a85b436497f4b9d` | Teal/blue gradient with slash-like white shapes |

## Important conflict
Both favicon files exist and are visually different. `apps/web/index.html` references `/favicon.svg`; deployment root and copy rules must be confirmed before declaring which file the actual live site serves. Do not select a favicon without inspecting the deployed site/build.

Brand wiki visual standards: `uaethrive-brand-wiki/pages/visual-standards.html` states: "Use the UAEThrive wordmark for this wiki. Do not use older icon-led logo treatments unless a future brand decision restores them."

## Next gate
Confirm authoritative assets from owner/brand guidelines, inspect live deployed favicon, then copy approved originals byte-identically to `brand-registry/assets/uaethrive/`. Calculate SHA-256 of the actual registry files; register `approved_by`, `approved_at`, asset version and hashes. Only then mark approved.

Do NOT treat the source Git blob SHA as a SHA-256 file checksum.
