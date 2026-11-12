# HIZVENA custom domain — production migration gate

Desired public brand: **https://hizvena.com/** (www alias: https://www.hizvena.com/).

## Current status
`domain-target.json` currently records **requested_not_verified_or_connected**. GitHub repository access alone does not establish domain ownership or grant permissions to Cloudflare account/registrar.

## Automatically checked
GitHub Actions workflow `.github/workflows/domain-readiness.yml` runs daily and on demand. It inspects **public** DNS for root/www and HTTPS content with a timeout; a JSON report is stored as a build artifact. This is monitoring/readiness, **not** a domain activation or registrar purchase. A passing result is only a preliminary signal: manual/authorized Cloudflare ownership and project-route verification is still necessary.

## Operator required actions
1. Confirm the domain is owned by the business and select the appropriate domain registrar; do not purchase or charge without explicit approval.
2. Inspect actual deployment: Worker vs Pages. Current live origin is `https://hizvena-id.hizryabdilah23.workers.dev/`; the repository setting `hosting_target` is only an intention, **not** proof of Pages deployment.
3. In **Cloudflare dashboard**, add the hostname as a custom domain to the **actual** Worker/Pages application. Follow Cloudflare's displayed DNS and nameserver instructions. Do not invent CNAME targets or write DNS values based solely on repository name.
4. Verify domain ownership, active DNS, certificate coverage, HTTPS root/www response and that content is the current HIZVENA deployment; confirm both hostnames and preferred canonical/redirect policy.
5. After successful verification, make a separate reviewed PR to update `index.html` canonical, `sitemap.xml`, `robots.txt`, Open Graph URL, `domain-target.json` and any applicable production test configuration.
6. Perform smoke, browser, Lighthouse, security baseline and **live** host/HTTPS checks. Roll back SEO or redirects if tests fail, while retaining the functioning legacy origin until migration is confirmed.

## Safety
Until step 4, **do not** show `hizvena.com` as an active link to customers; do not redirect the existing workers.dev site, or change its canonical metadata. There are no registrar or Cloudflare credentials in GitHub source. Automated probe never modifies these accounts.
