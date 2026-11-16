# Abneos Infrastructure and CI Cost Standard

Approved standing default: 16 November 2026. Applies to future Abneos-owned and client implementation work, including websites, Digital Homes, BookBizzy, communications and automation. Apply proportionately to the existing stack; this is not authorisation for an unrelated migration.

## Platform responsibilities

| Responsibility | Default |
| --- | --- |
| Application and API runtime | Existing Cloudflare Workers/Pages where compatible |
| Booking/email event processing, scheduled jobs and retries | Cloudflare runtime and durable queues/outboxes; approved delivery provider such as Resend |
| Source control and review | GitHub |
| Builds and deployment | Prefer Cloudflare Builds where compatible, verified and cost-effective; retain existing working deployment routes until the replacement passes |
| CI | Use GitHub Actions selectively for essential tests, security, migration integrity, protected release gates and tasks without a suitable existing alternative |
| Specialised or sustained compute | Existing OVH VPS only when capacity, isolation, operational support and incremental cost justify it |

Do not start a GitHub Actions run for each booking, enquiry, email, webhook or runtime retry. Keep these event-driven operations in the application runtime. CI may run controlled acceptance tests, including explicitly authorised trial emails.

Resend delivers email; Cloudflare runs the application-side queue processing and retry logic. Provider acceptance and confirmed delivery are separate states. Preserve recipient selection, trial allow-lists, suppression, idempotency, signature verification and bounded retries.

## Cost and reuse rules

1. Reuse the existing Cloudflare paid plan, approved services, components and VPS before introducing another subscription or duplicate system.
2. Remove duplicate push/PR builds, redundant deployments, overly broad triggers, avoidable reruns and unnecessary artifact retention. Use path filters and concurrency cancellation where appropriate.
3. Verify Cloudflare Builds compatibility, account allowance, current usage, overage exposure, credentials and release-gate parity before permanent offload. Native builds also incur consumption; an included allowance is not unlimited or a spending cap.
4. Compare combined incremental GitHub, Cloudflare and VPS costs, including monitoring, storage, test runs and administration. Distinguish measured usage/invoice savings from projections.
5. Use existing consumption monitoring and the approved 70%, 85% and 95% thresholds where supported. Do not introduce an unnecessary paid monitoring service.
6. Do not place production credentials on an unisolated self-hosted runner. Preserve tenant/client separation and avoid untrusted code gaining access to privileged workloads.
7. Record a concise evidence-backed exception in the relevant change when another runtime or CI route is more suitable. Make routine implementation decisions autonomously within the authorised scope.

## Deployment and credentials

- Preserve essential security scans, tests, migration checksums, protected environments, approval controls, preview/production separation and rollback capability when changing delivery infrastructure.
- Use established machine-to-machine credentials for routine Cloudflare operations. Diagnose the actual authentication, scope, account or endpoint error; do not request connector reconnection as a generic remedy.
- Store runtime credentials as platform Secrets. Keep a CI secret only when the authorised build/deploy/test workflow actually needs it, and transfer it securely without logs or source exposure.
- Prefer appropriately scoped project/service credentials so they can be rotated independently. A Resend sending key is separate from a Cloudflare deployment/Builds token.
- Update the credential dependency register with purpose, permission scope, account/domain restriction, exact repository/environment/platform secret names, consumers and verification/rotation dates. Never record secret values. Equal names do not prove equal credentials.
- Current operational evidence and dependency register: https://github.com/Abneos/abneos-prospecting-factory/blob/main/docs/operations/cloudflare-token-register.md

## Adoption and verification

New Abneos repositories must include an AGENTS.md reference to this standard. Existing repositories must load it for infrastructure, CI/CD, scheduled processing and communications work. ChatGPT Sites, external agents and workflows do not automatically inherit another repository's AGENTS.md; explicitly provide the reference through their supported instructions.

This records the default, not proof that every existing project has migrated. Apply it during the relevant authorised work. Before declaring an infrastructure change complete, verify the intended deployed commit, affected customer/admin journeys, retained safeguards, runtime retry/delivery behaviour and actual cost exposure.

Related: [Production Readiness](ABNEOS_PRODUCTION_READINESS_STANDARD.md), [Copy and Conversion](ABNEOS_COPY_CONVERSION_STANDARD.md), [Brand Identity](ABNEOS_BRAND_IDENTITY_STANDARD.md).
