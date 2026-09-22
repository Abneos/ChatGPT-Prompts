# Abneos Brand UI Standard

## Purpose
Prevent off-brand prototypes and customer-facing visual work across Abneos-owned and partner brands.

## Mandatory rule
Before creating any visual prototype, landing page, website component, advert, social graphic, PDF, presentation or UI for an existing brand:
1. Resolve the brand through `standards/brand-registry.json`.
2. Inspect the canonical repository and live implementation listed there.
3. Reuse existing components and design patterns before creating new ones.
4. Use extracted tokens and visual grammar from the real implementation.
5. Do not invent colours, fonts, logo treatments, gradients, radii, icon styles, buttons, cards or layout motifs from memory.
6. Where a requested pattern does not exist, extend the closest existing pattern while preserving the brand's visual grammar.
7. If the registry entry is incomplete or stale, inspect the canonical repo before producing the visual output and update the registry/contract as part of the work.

## Source priority
1. Existing production component
2. Existing production page pattern
3. Brand UI contract
4. Canonical live site
5. New pattern derived from the above

Generic styling is never the default for an established brand.

## New-brand auto-registration
When a new customer-facing brand/repository is introduced:
- If it is not present in `standards/brand-registry.json`, create a provisional registry entry before generating branded work.
- Set `status` to `provisional`.
- Record the canonical repository, domain if known, and likely UI source paths.
- Do not fabricate tokens. Leave unknown values unresolved and inspect the repository.
- Once the first real UI implementation exists, promote the entry to `active` and add a full brand contract under `standards/brands/<slug>.json`.

## Multi-brand experiences
Shared functionality may be reused, but presentation must resolve through the active brand contract. A parent Abneos page can link to a partner-branded detail page without forcing the same visual language across both.

## Definition of Done
Branded visual work is complete only when:
- the correct brand has been resolved;
- canonical UI sources were inspected;
- existing components/patterns were reused where available;
- no unapproved visual system was introduced;
- mobile behaviour remains consistent with the brand.


## Branded graphics and social-image generation

This standard applies to generated visual assets as well as website UI, including:
- social post graphics;
- blog article social images;
- recruitment graphics;
- ad creatives;
- presentation covers;
- infographic panels;
- campaign images;
- thumbnails and promotional artwork.

Before generating a branded graphic:
1. Resolve the brand from the registry.
2. Inspect the canonical brand contract and repository.
3. Use approved logo treatment, typography, colours, spacing, image style and recurring visual motifs from the brand.
4. Match the intended channel and aspect ratio without changing the core visual identity.
5. If the asset is based on a URL or article, preserve the brand system while adapting the subject matter to the content.
6. Do not use a generic image-generation aesthetic as a substitute for the brand's visual system.
7. If a source photo/illustration style exists, prefer that style; otherwise use the closest documented brand-safe treatment.

### Graphic-generation handoff
When an image-generation tool is used, the generation prompt must include the resolved brand constraints explicitly, including:
- brand name;
- approved palette;
- typography direction;
- logo placement/treatment if a logo is available;
- composition rules;
- imagery style;
- prohibited visual motifs;
- target dimensions/aspect ratio;
- campaign/article subject.

If the brand contract is incomplete, inspect the canonical implementation before generation rather than inventing missing styling.

## Cross-brand graphics
Where one brand is promoting an opportunity or article belonging to another:
- the publishing brand owns the outer visual system;
- the partner brand may appear as a clearly secondary endorsed/featured identity;
- do not blend two unrelated design systems into a hybrid unless an approved co-brand pattern exists.
