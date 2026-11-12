# HIZVENA — Customer URL status (12 November 2026)

## Verified functioning public URLs
- **GitHub Pages candidate**: https://zry23.github.io/HIZVENA/ — **PASS** for HTTPS homepage, pricing, 12 catalogue services, public cover-only metadata, CSS and JS in [live verification run 43197717010](https://github.com/zry23/HIZVENA/actions/runs/43197717010).
- **Existing Cloudflare Worker**: https://hizvena-id.hizryabdilah23.workers.dev/ — **PASS** on the same live verification run.

The GitHub Pages URL contains `zry23`; it is **not** the owner's requested final URL consisting only of the HIZVENA brand. Do not claim it is a brand-only hostname.

## Remaining blocker — brand-only address
No `hizvena.com` DNS ownership/Cloudflare custom-domain activation has been verified; `hizvena.pages.dev` was not verified as provisioned. GitHub cannot register a domain or change Cloudflare account settings using the available connector. Existing Workers named `hizvena` and `hizvena-web` do not themselves provide an owner-name-free URL because Workers inherit the account's `workers.dev` subdomain.

**Owner/provider step:** in an authorized Cloudflare account, connect a domain the business owns to the existing production Worker; alternatively, deploy a true Cloudflare Pages application through the legacy Pages flow with an available project name. Do **not** create a fourth Worker. Verify HTTPS, complete page rendering and canonical redirects **before** moving customers.

The GitHub Pages build workflow `.github/workflows/brand-only-pages.yml` is operational. The newly added `.github/workflows/customer-site-readiness.yml` monitors both published URLs daily and on request.

Current SEO canonical and sitemap still identify the legacy Cloudflare origin. Preserve these until a brand-only hostname is actually active and migration is reviewed. No private paid PDFs are included in public deploys.
