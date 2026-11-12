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
- Automated smoke and JS syntax: PENDING CI.
- Full phone 320/375/390, tablet 768/1024, desktop 1440/1920: NOT TESTED.
- Manual back/forward, keyboard, real WhatsApp, Safari/Firefox/Edge: NOT TESTED.
- Lighthouse Performance >=90, Accessibility/SEO/Best Practices >=95: NOT TESTED, no score claimed.
- Backend persistence: BLOCKED, no backend present.
- Real six portfolios: BLOCKED; no fake entries.
- No deployment or staging URL claimed. **Do not merge V18 into production until QA and release criteria met.**

Rollback: revert V18 merge commit or redeploy V17 SHA `5d28eb9af67fc6d630e9a271ee4ecc41fc16f814`. No database migration or environment variable changes.
