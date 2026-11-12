# HIZVENA V18 — Audit, implementation, and release gate (12 November 2026)

Baseline V17 SHA: `5d28eb9af67fc6d630e9a271ee4ecc41fc16f814`. Do not rebase production on a different commit without checking changes.

## Audit matrix
| Item | Classification | Grounding |
|---|---|---|
| Static site, hero, header, footer | IMPROVE | `index.html`, layered CSS |
| 12 services and exact prices | PASS | `data/catalog-v11.json` canonical source |
| Search/filter/sort and details | IMPROVE | `assets/catalog-v11.js` |
| Academic / design forms | IMPROVE | `assets/directory-v8.js`, catalogue |
| Review and WhatsApp handoff | PASS | `assets/customer-journey-v15.js`, no saved order |
| Social accounts | PASS/IMPROVE | user-provided Instagram, TikTok, YouTube and admin WA |
| Portfolio | BLOCKED | no consent-cleared real examples in repository; keep honest empty-state |
| Testimonials | REVIEW | 7 redacted screenshots; manifest self-reports approval, third-party consent not independently verified |
| Backend API, admin auth, secure uploads | BLOCKED | not present in public repo; internal systems not touched |
| Browser/Lighthouse/security testing | NOT TESTED | CI smoke is not a browser audit |
| Cloudflare staging/live verification | BLOCKED | no deployment access established |

## Changes in V18 development PR
- Refined hero, microcopy and mobile WhatsApp button; no fabricated claims.
- Canonical-data type filter (derived from service IDs) in addition to category, search and sort.
- Progressive client-only consultation: select canonical service → complete existing contact/details → review existing summary dialog → WhatsApp. Stage 3 is the existing review dialog; no fake order number or success.
- Clear fallback if catalog JSON fails to load.
- Added WhatsApp to social cards; retained original 3 accounts.
- Added robots.txt and sitemap.xml; no invented new URL routes.
- Portfolio remains honest placeholder until original permissions-cleared works provided.

## QA and release gate
- Automated smoke and JS syntax: PASS on commit `ef1a65ca6ec6145e6633f8daeb4fac19e0472aa7`; workflow run https://github.com/zry23/HIZVENA/actions/runs/43151032552.
- Chromium automated phone 320/375/390, tablet 768/1024, desktop 1440/1920: PASS on https://github.com/zry23/HIZVENA/actions/runs/43152050484 after overflow fixes. This does not substitute cross-browser manual inspection.
- Automated Chromium back navigation, keyboard Escape, valid design/academic consultation and WhatsApp URL interception: PASS on run 43152050484. Real WhatsApp delivery, Safari/Firefox/Edge: NOT TESTED.
- Lighthouse Performance >=90, Accessibility/SEO/Best Practices >=95: NOT TESTED, no score claimed.
- Backend persistence: BLOCKED, no backend present.
- Real six portfolios: BLOCKED; no fake entries.
- No deployment or staging URL claimed. **Do not merge V18 into production until QA and release criteria met.**

Rollback: revert V18 merge commit or redeploy V17 SHA `5d28eb9af67fc6d630e9a271ee4ecc41fc16f814`. No database migration or environment variable changes.

## Evidence and scoring status
The requested 95/100 is **a target, not a measured score**. Scores for UI/mobile, catalog, form, trust, social, performance and security remain UNRATED until browser, content-permission, accessibility and security checks are performed. GitHub static CI alone cannot certify Lighthouse scores, privacy consent, or production readiness.

## Content and operations still required
- Obtain 6 approved real portfolio items (0 verified portfolio entries in the public repository at audit time); retain honest empty state meanwhile.
- Confirm customer consent for each of the 7 existing screenshot testimonials before future republishing or new promotion.
- Confirm whether a managed CMS/API, business email and secure upload service exist; no integration without an explicit contract and access.
- Validate all 3 user journeys in browsers at 320, 375, 390, 768, 1024, 1440 and 1920 px; verify that field edits survive back navigation and WhatsApp opens the correct account once.

## Ongoing QA automation
- PR workflow `.github/workflows/browser-v18.yml` runs headless Chromium on proposed changes, plus static workflow `verify.yml`.
- Browser tests cover responsive widths, catalogue filters and prices, both forms, WhatsApp handoff, error states, SEO files and screenshots (for review).
- Screenshots from the workflow are **test artifacts**, not substitutes for actual marketing portfolio assets.
- Production deployment remains manual with release gates; no auto-merge when a test fails.

## Frontend V18 release decision — 12 November 2026
- The operator explicitly authorized publishing V18 and continuing automation.
- Release is limited to frontend, catalogue and WhatsApp consultation already verified with Chromium; do not claim backend orders or private file uploads.
- Current release pipeline must keep static checks and Chromium tests on both PR and main push.
- GitHub merge is not evidence of a completed Cloudflare deployment. Deployment verification must be reported separately.
- Six verified real portfolio entries, cross-browser Safari/Firefox/Edge, Lighthouse target and Cloudflare staging validation remain outside the verified set. The V18 release must not be described as 95/100 or full Master Prompt compliance.
- Manual rollback reference: V17 main commit `5d28eb9af67fc6d630e9a271ee4ecc41fc16f814`.
