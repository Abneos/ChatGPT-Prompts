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
