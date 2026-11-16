# HIZVENA V18.5 — Portfolio assets: import and approval

13 supplied designs were inventoried and optimized to WebP. **The GitHub connector accepts UTF-8 text commits but cannot directly import binary image uploads from this chat sandbox.** The ZIP package is delivered to the owner separately and is not in this repository.

## Import workflow (no new cloud project)
1. Unzip `HIZVENA_V18_5_Portofolio_Aset_13_Karya.zip` on a trusted device.
2. Review each preview: branding/copyright, trademarks in conceptual ads, client permissions, phone numbers and confidential info. **Do not publicize work without the necessary rights**. Don't characterize concepts as commissioned projects.
3. In GitHub, add the optimized `assets/portfolio/*.webp` files to the V18.5 branch, preserving filenames and directories. The repo already contains `data/portfolio-v18-5.json`; do not replace it with an unreviewed manifest.
4. For each approved asset ONLY, set `reviewStatus: "APPROVED"`, `publicApproved: true`, and optionally `featured: true` in that manifest. Leave unapproved items false.
5. Run `node tests/portfolio-v18-5.mjs` and other CI checks on a PR. Merge only if green and verify `https://hizvena.pages.dev/`.

The homepage displays an honest consultation/curation placeholder until at least one approved work is present; this avoids broken images and unsupported client claims. Six can be selected as featured later, without limiting the total gallery.

## Uploaded categories
- Logo & Identitas: Kabinet Sanjaya Dharma, FZ28, PERSKA, Alga Project, Ajabex, Genteng Jatiwangi, GWE!
- Mockup & Branding: Uniforce Studio
- Media Sosial: property nine-tile layout, coffee nine-tile layout
- Poster & Promosi: matcha, parfum, burger

## Known permission checks
- Matcha design contains a recognizable third-party brand and marketplace marks; it should only be treated as a concept with rights reviewed.
- Some marketing images contain text suggesting promotions or contact information; check accuracy before publishing.
- Logo designs with real names are not proof of official contracts or endorsements.

## SEO migration
The V18.5 PR changes homepage canonical, sitemap and robots sitemap address to `https://hizvena.pages.dev/`. Keep the old Cloudflare Worker running until all customer traffic is safely migrated.

## Caveat
No Google Drive folder URL was supplied. This version inventories the **13 chat-uploaded files** only; Drive synchronization is not claimed.
