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
