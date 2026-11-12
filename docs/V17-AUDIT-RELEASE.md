# HIZVENA V17 — Audit & release gate

## Existing V16, verified by repository inspection
- Static HTML/CSS/JS, no confirmed order API or customer database in public repository.
- 12 priced services in `data/catalog-v11.json` (untouched).
- Campus/program/UT course reference gzip datasets (untouched).
- 7 separate approved WebP testimonials (untouched; owner manages permissions).
- TikTok, Instagram, YouTube social URLs (retained).
- Direct WhatsApp consultation; **not** an order record.

## V17 code implemented
- Premium navy/ivory/gold theme, new hero and navigation, three-step process.
- Catalog sorting (first listed IDR amount), scope, duration. Price values remain exact catalog values.
- Reused V15 customer journey: catalog → form → review → WhatsApp (customer must send).
- Portfolio honest empty state, never fabricated project images.
- SEO title and required social channels retained.

## Absent/blocked
- No authenticated orders endpoint, secret management contract, idempotency or schema; therefore **no order ID, status tracker, file upload, private-data storage or internal CRM sync**.
- No verified business email; none invented.
- No production V17 deployment until browser QA and operator authorization.

## QA matrix
- GitHub Actions smoke + JS syntax: run on PR, inspect result.
- Interactive browser (Chrome/Firefox/Safari/mobile): NOT TESTED.
- WCAG screen reader & keyboard dialog focus: NOT TESTED.
- Lighthouse/Core Web Vitals: NOT TESTED.
- API persistence: NOT AVAILABLE.
- Live Cloudflare staging URL: NOT VERIFIED.

## Rollback
Revert V17 squash commit if merged, or redeploy original V16 main SHA `7da387c76ee93eb924a3951acecc9c52de3046a7`. No database migration.
