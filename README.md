# YAZ Electrical Solution Ltd — website

Marketing / lead-generation website for a Dublin-based residential & commercial
electrical contractor. Plain HTML, CSS and vanilla JS — no framework, no build
step, no backend. Deploys on Vercel with zero configuration.

## Structure

```
├── index.html          Home — hero, trust strip, services, why-us, process,
│                       testimonials, CTA, careers teaser
├── about.html          Mission, values, credentials & compliance
├── services.html       Full breakdown (domestic / commercial / testing /
│                       emergency) + FAQ
├── contact.html        Phone / email / hours / service areas + quote form
├── careers.html        Openings + how to apply
├── 404.html
├── css/styles.css      Design system (tokens → components → layout)
├── js/main.js          Nav, sticky header, form handling
├── assets/
│   ├── logo.svg        Logo lockup
│   ├── favicon.svg     Mark (also favicon)
│   ├── favicon-180.png Apple touch icon
│   ├── fonts/          Self-hosted Archivo + IBM Plex Mono (woff2)
│   └── img/            Photography + og.png (social card)
├── robots.txt
└── sitemap.xml
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New Project → Import** the repo.
3. Framework preset: **Other**. Build command: leave empty. Output directory: leave empty.
4. Deploy, then attach your custom domain in **Settings → Domains**.

Nothing else is required — the site is fully static and needs no environment variables.

## ⚠ Before you go live — the one-line swaps

Everything below is a placeholder the client must replace. Each is marked with a
`UPDATE` / `REPLACE` comment in the source files.

| What | Where | Example |
|---|---|---|
| **Phone number** | All HTML files (search `234 5678`) | `01 234 5678` → real number, both display text and `tel:+353…` |
| **Email addresses** | All HTML files (search `yazelectrical.ie`) | `info@yazelectrical.ie`, `careers@yazelectrical.ie` |
| **Form endpoint** | `contact.html` `action` **and** `FORMSPREE_ENDPOINT` in `js/main.js` | Create a free form at formspree.io → paste `https://formspree.io/f/XXXXXX` in both places |
| **Domain** | `rel="canonical"`, Open Graph URLs, JSON-LD schema, `sitemap.xml`, `robots.txt` (search `yazelectrical.ie` / `UPDATE DOMAIN`) | `https://www.yazelectrical.ie` → real domain |
| **Safe Electric number** | Optional — add the registration number to the About page / footer when known | — |

## Design system (in brief)

- **Palette** — deep navy `#0C1B2E` owns the large regions (header, hero, footer,
  CTA bands); safety amber `#FFB200` is reserved for the primary action, live
  indicators and the signature busbar traces; cool paper `#F6F8FB` for content
  sections. Every text/background pair passes WCAG AA (verified during build).
- **Type** — Archivo (variable, self-hosted) for display & body; IBM Plex Mono
  only for real measurement/labels (instrument readouts, spec strips).
- **Signature** — a PCB-style “busbar” trace (45° chamfers + terminal pads) runs
  under the sticky header, into the CTA band and above the footer; the hero
  carries an instrument-panel overlay on the photo.
- **Components** — shadcn-style role tokens (`--primary`, `--muted`, `--ring`…),
  button variants, chips, cards, form fields, native `<details>` accordions.
- **Motion** — one authored moment (hero trace draw + rise on load); everything
  else is static. `prefers-reduced-motion` fully respected.
- **Mobile** — sticky call + quote bar on phones; header collapses to a
  hamburger menu under 980px.

## Local SEO notes

- One `<h1>` per page; keyword-targeted titles & meta descriptions (≤65 / ≤160).
- `Electrician` LocalBusiness JSON-LD on every page (name, areaServed Dublin,
  phone, email, hours) + `FAQPage` schema on services.
- `tel:` click-to-call links throughout, incl. the mobile sticky bar.
- `sitemap.xml` + `robots.txt` included; clean `/page.html` URLs.
