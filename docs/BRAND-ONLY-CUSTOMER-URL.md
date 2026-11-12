# HIZVENA — brand-only customer URL fallback

Goal: a shareable public URL without the name of the owner or an AI platform label.

**Candidate:** https://zry23.github.io/HIZVENA/

Status: **NOT VERIFIED / DO NOT SHARE AS ACTIVE until its HTTPS content is confirmed**. This is GitHub Pages, not a registered custom domain. Its hostname has GitHub branding but contains neither the personal name the owner wants removed nor "AI".

Workflow: `.github/workflows/brand-only-pages.yml` packages public HTML, assets and data only; blocks all PDF files to avoid leaking paid question banks. It can deploy only after **GitHub repository Settings → Pages → Source: GitHub Actions** has been enabled. A successful workflow alone should be paired with an HTTPS, asset, catalogue and customer flow check.

Critical caveat: current canonical and sitemap still point to the working Cloudflare origin. Do not change SEO canonical or redirect until the new address is active and its content is tested. Keep Cloudflare as fallback to prevent customer downtime. Never claim the proposed URL is live without checking it.

If GitHub Pages rejects deployment as disabled, activate it in repo Settings; do not falsify deployment status.
