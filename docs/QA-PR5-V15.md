# HIZVENA PR #5 — QA & Release Gate

Status: **Development branch / NOT PRODUCTION**. No main merge or Cloudflare release until reviewed and authorized.

## Implemented (code inspected)

- [x] Existing PR #5 audited and extended rather than replaced.
- [x] Headline, primary navigation, navy/teal/off-white visual system from PR #5 retained.
- [x] Catalogue stays in `data/catalog-v11.json`: 12 recorded services, no invented prices.
- [x] Catalogue controls, detail, and select service integrated with relevant academic/design form.
- [x] A single modal summarizes selected service and price from the catalogue before WhatsApp.
- [x] Academic and design forms retain their separate customer fields and optional deadlines.
- [x] Customer information is not persisted by the new front-end journey code.
- [x] Existing campus datasets and testimonial images/manifest are unchanged.
- [x] No new public internal/admin endpoints, storage backend or fake portfolio.

## QA results

| Check | Status | Notes |
|---|---|---|
| GitHub Actions smoke suite | PASS | Checks Node syntax, asset references, dataset counts, images, customer review integration |
| Catalogue category filter code | PASS | Academic group includes UT & PTN/PTS regardless of text search |
| Recorded catalogue prices | PASS | Read from source JSON; no new prices |
| Campus data / UT course files existence | PASS | Smoke suite verifies reference counts |
| WhatsApp intended URL & review action | PASS | Static code inspection; actual device handoff not tested |
| Manual desktop (1440 / 1920) | NOT TESTED | Requires browser preview |
| Manual tablet (768 / 1024) | NOT TESTED | Requires browser preview |
| Manual phone (320–430) | NOT TESTED | Requires browser preview |
| Form submission UT/PTN/PTS | NOT TESTED | Needs interactive browser walkthrough |
| Touch autocomplete | NOT TESTED | Needs phone/tablet |
| Screen reader/focus trap | NOT TESTED | Needs assistive technology review |
| Lighthouse / Core Web Vitals | NOT TESTED | Requires preview deployment + actual measurements |
| Cloudflare PR preview | NOT TESTED | No verified preview URL provided |

## Risks and follow-up

1. Multiple legacy CSS layers remain. New work extends the existing PR #5 stylesheet instead of introducing another layer; consolidation requires detailed visual regression tests.
2. Service options from legacy academic mode are still available for manual consultations, and some do not have listed catalogue prices. For those, the summary states price needs admin confirmation.
3. No authenticated private order tracking, secure document uploads, or internal CRM integration are claimed.
4. WhatsApp opens a pre-filled message only; the customer must press Send. It does not create an order automatically.
5. Published testimonial permissions and use of third-party content remain the website owner's responsibility.

## Release checklist

Review PR #5, test it with a real isolated browser preview at mobile/tablet/desktop sizes, fix any defects, confirm authority to deploy, then merge to main. After merge, verify the Cloudflare build and live UI separately.
