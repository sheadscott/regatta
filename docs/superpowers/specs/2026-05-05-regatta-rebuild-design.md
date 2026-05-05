# Regatta Product Development — Website Rebuild Design Spec

**Date:** 2026-05-05  
**Client:** Regatta Product Development (regattapd.com)  
**Project type:** Full website rebuild — WordPress/Elementor → Astro static site

---

## Context

Client is a small B2B mechanical product design firm headquartered in Aubrey, TX. Current site runs WordPress + Parabola theme + Contact Form 7. Pain points: plugin dependency for basic features (accordions, forms), contact form instability, slow iteration. Business development is increasingly driven by in-person networking, making the website a critical first impression after meeting prospects. Primary conversion goal is the "Request a Quote" form submission.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro (SSG) | Zero JS by default, excellent SEO, native accordions/components |
| Styling | Tailwind CSS | Utility-first, pairs naturally with Astro |
| CMS | TinaCMS + Tina Cloud | Visual inline editing for non-dev client |
| Forms | Netlify Forms | Native form handling, no plugin, email notifications |
| Hosting | Netlify | Git-based deploys, generous free tier, native Forms support |
| Font | Inter (Google Fonts) | Free, crisp, modern, excellent mobile readability |

---

## Site Structure

| Route | Description |
|---|---|
| `/` | Hero with primary "Request a Quote" CTA, services overview, featured portfolio items |
| `/about` | Company story (MDX), team member grid (CMS) |
| `/services` | Overview of all 4 service areas with brief descriptions and links to detail pages |
| `/services/design` | Design Services — 13 sub-items in native HTML accordions |
| `/services/tooling` | Tooling & Production Setup — detail + accordions |
| `/services/production` | Production Integration & Manufacturing — detail + accordions |
| `/services/fulfillment` | Fulfillment Services — detail + accordions |
| `/portfolio` | Full portfolio grid — featured items pinned top, rest sorted by date descending (newest first) |
| `/contact` | Map, address, phone number — "Request a Quote" button opens global modal |

**Quote modal:** A global modal component rendered once in the base layout. Any "Request a Quote" button anywhere on the site opens it. Contains the Netlify Form. No page navigation required for the primary conversion action.

---

## Content Architecture (Approach B: Hybrid)

### CMS-managed (TinaCMS) — client edits these

**Portfolio Items**
- `title` — string
- `slug` — auto-generated
- `category` — select: Recreational | Medical | Oil & Gas | Consumer | Automotive
- `featured` — boolean (pins to top of grid when true)
- `date` — date (secondary sort key)
- `description` — rich text
- `images` — image gallery (multiple)

**Team Members**
- `name` — string
- `role` — string
- `bio` — rich text
- `photo` — image
- `order` — number (controls display order)

### Static content (MDX/Astro components) — developer updates

- Homepage hero copy and sections
- All service page content (overview + all accordion items per service)
- About/company story narrative
- Contact page copy

Rationale: service and marketing copy is layout-sensitive and changes rarely. Keeping it in code prevents client from accidentally breaking page structure.

---

## Design Direction

**Colors:**
- Primary background: dark navy `#0D1B2A`
- Surface/light: white `#FFFFFF`
- CTA/accent: orange `#F97316` (Tailwind `orange-500`) — used exclusively for CTAs and key highlights
- Body text: near-black on light backgrounds, white on dark

**Typography:** Inter — single typeface, varied weight for hierarchy

**Principles:** Mobile-first, generous whitespace, no decorative clutter. Orange accent reserved exclusively for CTAs — keeps conversion hierarchy clear. Reference aesthetic: design.trimech.com (clean, professional, content-forward).

**Visual work:** Use Claude Design for all mockups and visual assets.

---

## Accordions

Current site uses a WordPress plugin for accordions — a stated client pain point. In Astro, accordions use native HTML `<details>`/`<summary>` elements. No JS, no plugin, no maintenance overhead. Each service detail page renders its sub-items as a list of `<details>` components.

---

## Forms

**Quote modal form fields** (matching current site):
- Name (required)
- Phone Number (required)
- Email (required)
- Comment / Message (required)

Submitted to Netlify Forms. Client receives email notification per submission. Form success/error states handled inline in the modal.

**Contact page** (`/contact`) retains map embed, address, and phone — but does not duplicate the quote form. Instead has a "Request a Quote" button that opens the global modal.

---

## SEO

Astro SSG outputs static HTML — fully crawlable without JS execution.

- Per-page `<title>` and `<meta description>` via shared head component
- OpenGraph tags for social sharing
- Semantic HTML: proper heading hierarchy, landmark regions (`<main>`, `<nav>`, `<footer>`)
- Image optimization: Astro `<Image>` component (WebP output, lazy loading, explicit dimensions)
- Sitemap: `@astrojs/sitemap` integration
- Canonical URLs: automatic via Astro
- Service detail pages provide dedicated SEO surface area per service offering

---

## Out of Scope

- Blog / news section
- Client portal or authenticated areas
- E-commerce
- Portfolio category filtering (simple grid is sufficient)
- CMS editing of service page copy or marketing text
