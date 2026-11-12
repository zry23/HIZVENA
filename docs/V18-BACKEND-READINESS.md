# HIZVENA V18 — backend integration readiness (12 November 2026)

## State and non-negotiable boundary
The public site is **static** and currently sends consultation details to the official WhatsApp account. No authorized backend orders endpoint is confirmed in this repository. The user requested prioritizing a secure integration, but activating speculative endpoints would compromise confidentiality.

Two Floot projects are visible by name:
- HIZVENA INTERNAL • HSP6 Workspace (project ID 5f5fefad-ec60-4ebd-8159-027a767fd5cf)
- HIZVENA — Pusat Layanan Akademik & Desain (project ID 543fa87b-e6b1-4947-8e2e-62bb42ad5c65)

On November 12 their project file/database introspection was blocked by the owner's daily Floot 100-action limit. Hence there is **no verified order API contract, schema, RBAC or project-to-project integration**. The Floot notice says access resets after 2026-11-12 18:00 UTC (13 November 01:00 WIB), unless quota is increased earlier.

## Required contract before public submission
- HTTPS API base URL on an authenticated owner-controlled backend.
- `POST /public/order-requests`: idempotency key, service ID, customer name, phone, details, optional deadline. **Do not trust submitted price**; backend reads canonical service price.
- Payload validation, spam/rate limiting, duplicate detection, minimum necessary personal data, secure retention and deletion.
- Return `201` with opaque order reference and pending confirmation; return validation, throttling, and server errors without leaking internal stack traces.
- Origin allowlist and secure CORS; no admin API token embedded in public JS.
- Private attachments uploaded only to authenticated service; do not send personal file content to WhatsApp automatically.
- `GET /public/order-requests/{id}` must require customer identity/access token; mere public order ID must not reveal customer data.
- Server-side authorization to keep admin/staff/affiliate roles isolated, audit logs and backup/restore.
- Confirm V18 catalogue source-of-truth and price synchronization before enabling any order submissions.

## Integration release gate
1. Inspect actual Floot endpoints, database tables, roles and resources with read-only calls.
2. Document the API interface, minimal order fields, consent and retention policy; compare V18 service IDs to internal source.
3. Implement backend in an isolated **staging** project and migrate additively; no destructive migration.
4. Run contract tests: successful order creation, double submit idempotency, invalid input, cross-account access denial, no credentials in browser and backup/rollback.
5. Implement a feature-flagged client adapter only when the backend contract is tested.
6. Get explicit owner approval before enabling the production integration.

**Today:** backend status BLOCKED, not implemented. V18 consultation through WhatsApp remains available and unchanged. No real customer data was accessed or changed.

## Lighthouse and security
The independent GitHub workflows `lighthouse-v18.yml` and `security-v18.yml` generate measured evidence; no score is claimed until they complete. Security baseline is not equivalent to a comprehensive penetration test, which requires authorized authenticated testing and manual review.

## Finishing items deferred
Portfolio approval, testimonials and design polish may be addressed later. The current scope is Lighthouse, security and backend readiness.

## Measured audit evidence, 12 November 2026

Lighthouse snapshot test of local V18 over HTTP served inside GitHub Actions, using Chrome/Lighthouse (not field or live Cloudflare measurements). Initial result: mobile P90/A95/BP100/SEO100, LCP ~2.9s; desktop P100/A95/BP100/SEO100. After priority preload of the real hero background asset: mobile P95/A95/BP100/SEO100, LCP ~2.5s, CLS 0, TBT 180ms; desktop P100/A95/BP100/SEO100, LCP ~0.8s, CLS 0.002, TBT 0ms. INP unavailable from this lab audit.

- Improved test: https://github.com/zry23/HIZVENA/actions/runs/43154792336
- Static regression: https://github.com/zry23/HIZVENA/actions/runs/43154792316
- Real Chromium journey: https://github.com/zry23/HIZVENA/actions/runs/43154792300
- Security baseline: https://github.com/zry23/HIZVENA/actions/runs/43154792345

**Security review:** No CRITICAL/HIGH signatures detected in scoped source/anonymous public HTML scan; four REVIEW findings for missing HTTP response headers (CSP, X-Content-Type-Options, Referrer-Policy, HSTS). This is not a full authenticated audit. The added HTML referrer meta is a limited client-side mitigation and does **not** constitute an HTTP Referrer-Policy response header. Remediation needs Cloudflare deployment configuration verification. Track https://github.com/zry23/HIZVENA/issues/13.

**Backend:** Floot project resources blocked by account daily action quota today. No endpoint contract/authorization evidence; safe integration gate remains **BLOCKED**, tracked in https://github.com/zry23/HIZVENA/issues/12.

QA workflows now re-run after main pushes, on pull requests, manually, and weekly. Lighthouse score thresholds remain Performance >=90 and Accessibility/Best Practices/SEO >=95 as stated in V18 spec. These reports are per-run single samples and not a field-data certification.
