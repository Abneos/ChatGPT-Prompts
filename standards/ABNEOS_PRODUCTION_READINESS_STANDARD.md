# Abneos Production Readiness Standard

## Purpose
Mandatory production-readiness baseline for Abneos-owned websites and web applications. Adapted for our GitHub/Codex workflow from the production-audit material supplied to Abneos.

This is a baseline audit, not a penetration test, infrastructure audit, business-logic certification or legal compliance certification.

## Required triggers
Run the audit:
- before first production launch;
- after a major architecture, authentication, payments, forms, tracking or data-flow change;
- quarterly for live properties;
- whenever production readiness, security hardening or unexplained reliability/performance issues are in scope.

For ordinary PRs, run targeted checks for affected categories. Do not regenerate a full workbook for every copy-only change.

## Intake
Before a full audit confirm, from repository/deployment evidence where possible and ask only for unresolved facts:
- live URL;
- actual production hosting platform;
- repository visibility;
- backend/services and third-party processors;
- framework/stack;
- protected/admin/private areas and data APIs;
- analytics/ad pixels and expected jurisdictions;
- inbound webhooks;
- personal-data collection.

Do not guess facts that materially change severity.

## 32-check baseline

### Security
- S-01 Secrets in code — Critical
- S-02 Public environment variables — High
- S-03 Vulnerable dependencies — High
- S-04 Security headers — High
- S-05 CORS — Medium
- S-06 Rate limiting — High
- S-07 Bot protection — Medium
- S-08 HTTPS/TLS — High
- S-09 Access control/authorisation — Critical
- S-10 Injection/unsafe input — High
- S-11 Webhook signature verification — High

### Performance
- P-01 Core Web Vitals — High
- P-02 Image optimisation — High
- P-03 Bundle size — Medium
- P-04 Caching/CDN — High
- P-05 Font loading — Low
- P-06 Third-party scripts — Medium

### Reliability
- R-01 Error monitoring — High
- R-02 Uptime monitoring — Medium
- R-03 Error boundaries/failure UX — Medium
- R-04 Backups and restore evidence — High
- R-05 Runtime resilience/configuration — High

### SEO
- SEO-01 Metadata/social cards — Medium
- SEO-02 Structured data — Low
- SEO-03 Sitemap/robots/indexability — Low

### Accessibility
- A-01 Semantic HTML/ARIA/keyboard accessibility — Medium
- A-02 Alt text/contrast — Medium

### Operations
- O-01 Staging/preview environment — Medium
- O-02 Version-control/deployment hygiene — Low

### Compliance
- C-01 Cookie consent/tracking behaviour — High
- C-02 Privacy policy and actual data-processing disclosure — High
- C-03 Content/asset licensing provenance — Medium

## Audit evidence
Every check must be PASS, FAIL, DEFERRED or N/A and retain concrete evidence where available: file/path/line, configuration, live header, measurement, workflow result or reason it could not be checked.

A PASS means the specific baseline issue was not found by this audit. It is not a warranty of security, availability, performance or legal compliance.

## Scoring for full periodic/launch audits
Start at 100:
- Critical FAIL: -15
- High FAIL: -5
- Medium FAIL: -2
- Low FAIL: -1
- DEFERRED/N/A: no deduction.

Category grades: A >=90% passing, B 75–89%, C 60–74%, D 40–59%, F <40%, excluding DEFERRED/N/A.

The score is descriptive only. Critical findings always take priority over the headline score.

## Fix order and execution
Critical → High → Medium → Low.

Use **audit → fix safe/material deficiencies → verify → re-audit**.

Do not create a report-only task when fixes can reasonably be implemented in the current work. Never automatically make destructive production changes, rotate credentials, alter legal text as final legal advice, or change production data without required approval.

## Verification
Every FAIL requires a concrete verification method. A fix is not complete merely because code changed.

## Boundaries
This baseline does not replace:
- penetration testing;
- business-logic/security-design review;
- DNS/server/DDoS/platform infrastructure assessment;
- third-party processor assurance;
- professional legal/compliance review;
- specialist review for sensitive data, children's data, health data, government IDs, payments or personal data at scale.

## Integration with Copy & Conversion
Customer-facing work must also satisfy the canonical Abneos Copy & Conversion Standard. Production readiness and conversion quality are separate gates; neither substitutes for the other.


## Abneos extensions beyond the 32-check baseline

### Infrastructure & Deployment (I)
- I-01 DNS/domain — canonical domain, redirects and relevant DNS are intentional.
- I-02 Cloud/edge configuration — production and preview bindings/routes/settings are separated and least-privilege where possible.
- I-03 Environment separation — test/staging/production secrets, databases, payment modes and integrations cannot be accidentally crossed.
- I-04 Database security — RLS, grants, security-definer functions and storage policies preserve public/private boundaries.
- I-05 Privileged-key containment — service-role/administrative credentials execute server-side only and are appropriately scoped.
- I-06 Deployment provenance — the deployed version can be tied to the intended repository commit/SHA.
- I-07 Preview safety — staging/previews are non-indexable and access-controlled where private/admin functionality exists.
- I-08 Edge resilience — rate limiting, WAF/DDoS and cache behaviour are reviewed where the platform supports them.

### Business Logic & Journeys (J)
Derive these checks from actual product rules. Never mark them PASS from generic static inspection alone.
- J-01 Identity/ownership — a user cannot act as another user or business.
- J-02 Object access — changing IDs/slugs/parameters cannot expose another party's private object.
- J-03 State transitions — approval, claim, booking, redemption, order and workflow steps cannot be skipped or replayed incorrectly.
- J-04 Payments/entitlements — provider success is verified server-side; amount/currency/entitlement are server-controlled; retries/replays are idempotent.
- J-05 Privileged actions — admin/owner/tutor/staff operations require the intended role.
- J-06 Communications — emails/messages go to the correct party once, with safe links and no unintended data disclosure.
- J-07 Failure/recovery — interrupted external calls do not leave contradictory state.
- J-08 Abuse/economic controls — coupons, credits, gift cards, quotas, trials and costly API/AI actions resist trivial replay/manipulation.

## Release decision
Use **BLOCKED / WARNING / PASS** as the primary release status. The numeric score is secondary and must never override severity.
- BLOCKED: unresolved Critical finding, or High finding creating material security, privacy, data-loss, payment, authorisation or production-availability risk.
- WARNING: non-blocking residual finding with a documented owner/next action.
- PASS: no blocking findings and required verification completed.

If a check cannot be performed, record **DEFERRED** with the exact reason and verification required. Never silently convert missing evidence into PASS.

## Production verification
For every material release:
1. Verify intended commit/deployment provenance.
2. Smoke-test representative public routes at mobile and desktop widths.
3. Verify critical forms/actions using production-safe test paths.
4. Verify authentication/authorisation boundaries where relevant.
5. Check console/runtime errors and critical network failures.
6. Verify canonical/indexability behaviour.
7. Re-run affected readiness checks.
8. Record residual WARNING/DEFERRED items and owner/next action.
