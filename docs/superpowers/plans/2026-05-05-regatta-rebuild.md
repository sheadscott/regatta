# Regatta Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild regattapd.com as an Astro static site with TinaCMS visual editing, Tailwind CSS, and Netlify hosting — replacing the current WordPress/Elementor install.

**Architecture:** Astro SSG outputs static HTML for all pages. Portfolio items and team members are stored as markdown/JSON content files managed through TinaCMS's visual editor. A global `<dialog>`-based quote modal handles the primary conversion action (Request a Quote) from any page without navigation. Service page copy lives in a TypeScript data file (rarely changes, developer-updated).

**Tech Stack:** Astro 5, Tailwind CSS v3 (`@astrojs/tailwind`), TinaCMS + Tina Cloud, Netlify (hosting + Forms), Inter (Google Fonts), Vitest (unit tests), Playwright (e2e tests)

---

## File Map

```
src/
  layouts/
    BaseLayout.astro
  components/
    Header.astro
    Footer.astro
    QuoteModal.astro
    AccordionItem.astro
    PortfolioCard.astro
    TeamGrid.astro
  pages/
    index.astro
    about.astro
    contact.astro
    404.astro
    services/
      index.astro
      [slug].astro
    portfolio/
      index.astro
  content/
    portfolio/        ← TinaCMS-managed markdown files
    team/             ← TinaCMS-managed JSON files
  content.config.ts
  data/
    services.ts
  styles/
    global.css
  utils/
    portfolio.ts
    portfolio.test.ts
tina/
  config.ts
tests/
  e2e/
    quote-modal.spec.ts
    navigation.spec.ts
tailwind.config.mjs
astro.config.mjs
vitest.config.ts
playwright.config.ts
netlify.toml
```

---

## Task 1: Scaffold project and init git

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json` (generated)
- Create: `tsconfig.json` (generated)

- [ ] **Step 1: Create Astro project in current directory**

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
```

Expected: Astro scaffolds `src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json`.

- [ ] **Step 2: Add Tailwind and Sitemap integrations**

```bash
npx astro add tailwind sitemap --yes
```

Expected: Installs `@astrojs/tailwind`, `@astrojs/sitemap`, updates `astro.config.mjs`.

- [ ] **Step 3: Install Vitest and Playwright**

```bash
npm install -D vitest @playwright/test
npx playwright install chromium
```

- [ ] **Step 4: Update `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://regattapd.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
```

- [ ] **Step 5: Add test scripts to `package.json`**

Add to the `scripts` block:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 7: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:4321',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 8: Init git and commit**

```bash
git init
git add .
git commit -m "feat: scaffold Astro project with Tailwind, Sitemap, Vitest, Playwright"
```

---

## Task 2: Design tokens and global styles

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#243447',
          800: '#1B2A3B',
          900: '#0D1B2A',
        },
        brand: {
          orange: '#F97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "feat: add Tailwind design tokens (navy, orange, Inter)"
```

---

## Task 3: Content collection schema and placeholder content

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/portfolio/example-project.md`
- Create: `src/content/team/robert-palmer.json`

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Recreational', 'Medical', 'Oil & Gas', 'Consumer', 'Automotive']),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
    images: z.array(z.string()),
  }),
});

const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    photo: z.string(),
    order: z.number(),
  }),
});

export const collections = { portfolio, team };
```

- [ ] **Step 2: Create placeholder portfolio item `src/content/portfolio/example-project.md`**

```markdown
---
title: Example Product Design
category: Consumer
featured: true
date: 2024-06-01
images:
  - /images/portfolio/placeholder.jpg
---

Brief project description goes here.
```

- [ ] **Step 3: Create placeholder team member `src/content/team/robert-palmer.json`**

```json
{
  "name": "Robert Palmer",
  "role": "President",
  "bio": "",
  "photo": "/images/team/placeholder.jpg",
  "order": 1
}
```

- [ ] **Step 4: Create `public/images/portfolio/` and `public/images/team/` directories**

```bash
mkdir -p public/images/portfolio public/images/team
```

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/ public/images/
git commit -m "feat: add Astro content collection schema for portfolio and team"
```

---

## Task 4: Portfolio sort utility (TDD)

**Files:**
- Create: `src/utils/portfolio.test.ts`
- Create: `src/utils/portfolio.ts`

- [ ] **Step 1: Write the failing test `src/utils/portfolio.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { sortPortfolio } from './portfolio';

const makeItem = (overrides: Partial<{ featured: boolean; date: Date }>) =>
  ({ data: { featured: false, date: new Date('2024-01-01'), ...overrides } }) as any;

describe('sortPortfolio', () => {
  it('places featured items before non-featured', () => {
    const items = [makeItem({}), makeItem({ featured: true })];
    const result = sortPortfolio(items);
    expect(result[0].data.featured).toBe(true);
  });

  it('sorts non-featured items newest first', () => {
    const items = [
      makeItem({ date: new Date('2023-01-01') }),
      makeItem({ date: new Date('2024-06-01') }),
    ];
    const result = sortPortfolio(items);
    expect(result[0].data.date.getFullYear()).toBe(2024);
  });

  it('sorts featured items newest first among themselves', () => {
    const items = [
      makeItem({ featured: true, date: new Date('2022-01-01') }),
      makeItem({ featured: true, date: new Date('2024-01-01') }),
    ];
    const result = sortPortfolio(items);
    expect(result[0].data.date.getFullYear()).toBe(2024);
  });

  it('does not mutate the input array', () => {
    const items = [makeItem({}), makeItem({ featured: true })];
    const first = items[0];
    sortPortfolio(items);
    expect(items[0]).toBe(first);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module './portfolio'`

- [ ] **Step 3: Write `src/utils/portfolio.ts`**

```ts
import type { CollectionEntry } from 'astro:content';

export function sortPortfolio(
  items: CollectionEntry<'portfolio'>[]
): CollectionEntry<'portfolio'>[] {
  return [...items].sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: PASS — 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add sortPortfolio utility (featured first, newest first)"
```

---

## Task 5: Base layout, Header, Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import QuoteModal from '../components/QuoteModal.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'Regatta Product Development — mechanical design, tooling, production, and fulfillment services in Aubrey, TX.',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | Regatta Product Development</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <meta property="og:title" content={`${title} | Regatta Product Development`} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-white font-sans text-gray-900 antialiased min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <QuoteModal />
  </body>
</html>
```

- [ ] **Step 2: Write `src/components/Header.astro`**

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

const currentPath = Astro.url.pathname;
---
<header class="bg-navy-900 text-white sticky top-0 z-40 shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="font-bold text-lg tracking-tight whitespace-nowrap">
        Regatta Product Development
      </a>

      <nav class="hidden md:flex items-center gap-6">
        {navLinks.map(link => (
          <a
            href={link.href}
            class:list={[
              'text-sm font-medium transition-colors hover:text-brand-orange',
              currentPath === link.href ? 'text-brand-orange' : 'text-gray-300',
            ]}
          >
            {link.label}
          </a>
        ))}
        <button
          data-quote-trigger
          class="bg-brand-orange hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded transition-colors"
        >
          Request a Quote
        </button>
      </nav>

      <button id="mobile-menu-toggle" class="md:hidden text-gray-300 hover:text-white p-1">
        <span class="sr-only">Toggle menu</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <nav id="mobile-menu" class="hidden pb-4">
      <div class="flex flex-col gap-2 pt-2">
        {navLinks.map(link => (
          <a href={link.href} class="block text-sm font-medium text-gray-300 hover:text-white py-1">
            {link.label}
          </a>
        ))}
        <button
          data-quote-trigger
          class="mt-2 bg-brand-orange hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded transition-colors text-left"
        >
          Request a Quote
        </button>
      </div>
    </nav>
  </div>
</header>

<script>
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => menu?.classList.toggle('hidden'));
</script>
```

- [ ] **Step 3: Write `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="bg-navy-900 text-gray-400">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div>
        <p class="text-white font-semibold mb-2">Regatta Product Development</p>
        <p class="text-sm">Headquartered in Aubrey, Texas</p>
      </div>
      <div>
        <p class="text-white font-semibold mb-3">Services</p>
        <ul class="space-y-1 text-sm">
          <li><a href="/services/design" class="hover:text-white transition-colors">Design Services</a></li>
          <li><a href="/services/tooling" class="hover:text-white transition-colors">Tooling & Production Setup</a></li>
          <li><a href="/services/production" class="hover:text-white transition-colors">Production Integration</a></li>
          <li><a href="/services/fulfillment" class="hover:text-white transition-colors">Fulfillment Services</a></li>
        </ul>
      </div>
      <div>
        <p class="text-white font-semibold mb-3">Company</p>
        <ul class="space-y-1 text-sm">
          <li><a href="/about" class="hover:text-white transition-colors">About Us</a></li>
          <li><a href="/portfolio" class="hover:text-white transition-colors">Portfolio</a></li>
          <li><a href="/contact" class="hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-navy-800 pt-6 text-sm text-center">
      © {year} Regatta Product Development. All rights reserved.
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Create a stub `src/components/QuoteModal.astro`** (full version in Task 6)

```astro
<!-- Stub — replaced in Task 6 -->
<dialog id="quote-modal"></dialog>
```

- [ ] **Step 5: Replace `src/pages/index.astro` with a smoke-test page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <section class="py-20 px-4 text-center">
    <h1 class="text-4xl font-bold text-navy-900">Regatta Product Development</h1>
    <button data-quote-trigger class="mt-6 bg-brand-orange text-white font-semibold px-6 py-2 rounded">
      Request a Quote
    </button>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Verify dev server loads without errors**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:4321`, page renders with navy header and footer.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ src/components/ src/pages/index.astro
git commit -m "feat: add BaseLayout, Header, Footer with design tokens"
```

---

## Task 6: Quote Modal

**Files:**
- Create: `tests/e2e/quote-modal.spec.ts`
- Modify: `src/components/QuoteModal.astro`

- [ ] **Step 1: Write the failing e2e test `tests/e2e/quote-modal.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('Quote Modal', () => {
  test('opens when Request a Quote is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    await expect(page.locator('#quote-modal')).toBeVisible();
  });

  test('form has correct Netlify attributes', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    await expect(page.locator('#quote-modal form[name="quote"]')).toHaveAttribute('data-netlify', 'true');
  });

  test('closes when close button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    await page.click('[data-modal-close]');
    await expect(page.locator('#quote-modal')).not.toBeVisible();
  });

  test('closes when backdrop is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-quote-trigger]');
    // Click top-left corner of dialog (backdrop area)
    await page.locator('#quote-modal').click({ position: { x: 1, y: 1 } });
    await expect(page.locator('#quote-modal')).not.toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:e2e -- --project=chromium tests/e2e/quote-modal.spec.ts
```

Expected: FAIL — modal is an empty `<dialog>` with no trigger wiring

- [ ] **Step 3: Replace stub with full `src/components/QuoteModal.astro`**

```astro
<dialog
  id="quote-modal"
  class="w-full max-w-lg rounded-lg shadow-2xl p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
>
  <div class="bg-white rounded-lg overflow-hidden">
    <div class="bg-navy-900 px-6 py-4 flex items-center justify-between">
      <h2 class="text-white font-semibold text-lg">Request a Quote</h2>
      <button
        data-modal-close
        aria-label="Close"
        class="text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <form
      id="quote-form"
      name="quote"
      method="POST"
      data-netlify="true"
      class="p-6 space-y-4"
    >
      <input type="hidden" name="form-name" value="quote" />

      <div>
        <label for="q-name" class="block text-sm font-medium text-gray-700 mb-1">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          type="text" id="q-name" name="name" required
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>

      <div>
        <label for="q-phone" class="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span class="text-red-500">*</span>
        </label>
        <input
          type="tel" id="q-phone" name="phone" required
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>

      <div>
        <label for="q-email" class="block text-sm font-medium text-gray-700 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          type="email" id="q-email" name="email" required
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>

      <div>
        <label for="q-message" class="block text-sm font-medium text-gray-700 mb-1">
          Comment or Message <span class="text-red-500">*</span>
        </label>
        <textarea
          id="q-message" name="message" required rows="4"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
        ></textarea>
      </div>

      <p id="quote-success" class="hidden text-green-700 text-sm font-medium">
        Thank you! We'll be in touch shortly.
      </p>

      <button
        type="submit"
        class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors"
      >
        Submit Request
      </button>
    </form>
  </div>
</dialog>

<script>
  const modal = document.getElementById('quote-modal') as HTMLDialogElement;
  const form = document.getElementById('quote-form') as HTMLFormElement;
  const success = document.getElementById('quote-success') as HTMLElement;

  document.querySelectorAll('[data-quote-trigger]').forEach(btn => {
    btn.addEventListener('click', () => modal.showModal());
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => modal.close());
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as any).toString(),
      });
      form.reset();
      success.classList.remove('hidden');
      setTimeout(() => {
        modal.close();
        success.classList.add('hidden');
      }, 2000);
    } catch {
      alert('Something went wrong. Please try again.');
    }
  });
</script>
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test:e2e -- --project=chromium tests/e2e/quote-modal.spec.ts
```

Expected: PASS — 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/QuoteModal.astro tests/e2e/quote-modal.spec.ts
git commit -m "feat: add global quote modal with Netlify form and e2e tests"
```

---

## Task 7: Services data file and pages

**Files:**
- Create: `src/data/services.ts`
- Create: `src/components/AccordionItem.astro`
- Create: `src/pages/services/index.astro`
- Create: `src/pages/services/[slug].astro`

- [ ] **Step 1: Write `src/data/services.ts`**

```ts
export interface ServiceItem {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  items: ServiceItem[];
}

export const services: Service[] = [
  {
    slug: 'design',
    title: 'Design Services',
    tagline: 'From Concept to Production-Ready Design',
    description:
      'Our experienced team of designers is dedicated to creating innovative and visually appealing designs that resonate with your target market. We ensure your product is not only aesthetically pleasing but also practical to produce.',
    highlights: ['Start-Ups', 'Established Businesses', 'Home Inventors'],
    items: [
      {
        title: 'Concept Development and Ideation',
        description:
          'It starts with concept development and ideation, where our experienced team collaborates with you to refine your vision and transform it into a viable product concept.',
      },
      {
        title: 'Product Styling and Planning',
        description:
          'We specialize in product styling and planning, leveraging our expertise in aesthetics, ergonomics, and user experience to create products that stand out in the market.',
      },
      {
        title: 'Photo-Realistic Renderings and Animations',
        description:
          'Using advanced technologies and tools, we provide photo-realistic renderings and animations that bring your product to life before it even hits the production line.',
      },
      {
        title: '2D and 3D Design Layouts',
        description:
          'Our 2D and 3D design layouts allow for detailed visualization and precise engineering.',
      },
      {
        title: 'Component and Assembly Design and Development',
        description:
          'Our team excels in component and assembly design, ensuring seamless integration and functionality.',
      },
      {
        title: '3D Solid Modeling, Simulation and Finite Element Analysis (FEA)',
        description:
          "We go beyond design aesthetics by offering 3D solid modeling, simulation, and finite element analysis (FEA) to validate and optimize your product's performance.",
      },
      {
        title: 'Design for Manufacturability & Assembly (DFM/DFA)',
        description:
          'Our design for manufacturability and assembly expertise ensures that your product can be efficiently manufactured without compromising quality.',
      },
      {
        title: 'Board-Level Electrical Design (Hardware/Software/Firmware)',
        description:
          'For products with electrical components, we outsource to our board-level electrical design team that specializes in hardware, software, and firmware development.',
      },
      {
        title: 'Comprehensive Material Analysis and Selection',
        description:
          'We provide comprehensive material analysis and selection, considering factors such as durability, cost-effectiveness, and sustainability.',
      },
      {
        title: 'Mechanical and Electro-Mechanical Packaging',
        description:
          'Our mechanical and electro-mechanical packaging services ensure that your product is safely and efficiently housed, ready for distribution and use.',
      },
      {
        title: 'Proof-of-Concept Prototype through Final Design Release',
        description:
          "From proof-of-concept prototypes to final design release, we offer a wide range of assembly build methods tailored to your product's needs.",
      },
      {
        title: 'Documentation and Revision Control',
        description:
          "Our documentation and revision control processes guarantee that your product's specifications are accurately maintained throughout its lifecycle.",
      },
      {
        title: 'Design Consultation',
        description:
          'Our Design Consultation service is ideal for teams and individuals developing their own products who need expert mechanical design input without fully outsourcing the work. We provide focused guidance to review concepts, solve design challenges, and improve manufacturability, performance, and cost.',
      },
    ],
  },
  {
    slug: 'tooling',
    title: 'Tooling & Production Setup Services',
    tagline: 'Precision Tooling for Every Production Need',
    description:
      'We offer comprehensive tooling and production setup services to optimize your manufacturing processes. Our services ensure a seamless transition from prototyping to high-volume production.',
    highlights: ['Versatile Capabilities', 'Industry Leading Expertise', 'Precision Technology'],
    items: [
      {
        title: 'Tool Planning and Scheduling',
        description:
          'We offer a comprehensive range of tooling services designed to meet the diverse needs of our clients. With our tool planning and scheduling, we ensure that your project stays on track and meets its timeline objectives.',
      },
      {
        title: 'Comprehensive Material Selection, Documentation & Revision Control',
        description:
          'We understand the criticality of material selection in tooling, and we offer comprehensive material expertise, documentation, and revision control to ensure the right materials are utilized for optimal performance.',
      },
      {
        title: 'Plastic Injection Mold Tools, Thermoforming Tools, Foam Tools, Blow Mold Tools, Compression Mold Tools and Extrusion Dies',
        description:
          'We specialize in the design and manufacturing of Plastic Injection Mold Tools, Thermoforming Tools, Low-High Pressure Foam Tools, Blow Mold Tools, Compression Mold Tools, and Extrusion Dies. Our experienced team ensures the highest quality standards and precision in every tool we create.',
      },
      {
        title: 'Metal Casting Tools, Stamping Dies, Forming and Extrusion Dies',
        description:
          'Whether you require complex metal casting tools, precision stamping dies, or reliable forming and extrusion dies, our skilled team is equipped to meet your unique needs with durable, efficient, and cost-effective tooling solutions.',
      },
      {
        title: 'Prototype, Bridge, Pilot and High Volume Production Tools',
        description:
          'Whether you need to create a prototype to test your product concept or require tools for larger-scale production, we have the expertise and capabilities to support your needs at every stage.',
      },
      {
        title: 'Tool Design and Construction to World-Wide Tooling Standards',
        description:
          'Our team excels in tool design and construction, adhering to world-wide tooling standards to ensure the highest quality and compatibility with your manufacturing setup.',
      },
      {
        title: 'Export and Non-Export Tooling',
        description:
          'We understand the complexities of tooling in different markets and offer both export and non-export tooling options to meet your specific requirements.',
      },
      {
        title: 'Component & Assembly Verification, Evaluation and Validation',
        description:
          'Our dedicated team conducts component and assembly verification, evaluation, and validation to ensure the functionality, reliability, and quality of the final product.',
      },
    ],
  },
  {
    slug: 'production',
    title: 'Production Integration Services',
    tagline: 'Seamless Manufacturing from Prototype to Mass Production',
    description:
      'From plastic injection molding and metal die casting to PCB assembly and beyond, we deliver high-quality and efficient manufacturing solutions across a diverse range of industries.',
    highlights: [
      'Robust Supply Chain Management',
      'Efficient Assembly Processes',
      'Comprehensive Quality Control',
    ],
    items: [
      {
        title: 'Production Assembly Planning, Scheduling & Forecasting',
        description:
          'We offer comprehensive production integration services that seamlessly bring together various manufacturing processes. We work closely with our clients to ensure production goals are met with precise planning, scheduling, and forecasting.',
      },
      {
        title: 'Plastic Injection Molding, Extrusion Molding, Foam Molding, Blow Molding and Compression Molding',
        description:
          'Our state-of-the-art facilities deliver high-quality and efficient manufacturing solutions. We have the capabilities to meet your unique requirements across all major molding techniques.',
      },
      {
        title: 'Metal Die Casting, Investment Casting, Extrusions, Stamping, Forming, Fabricating and CNC',
        description:
          'Whether you require high-precision metal die casting, intricate investment casting, versatile extrusions, precise stamping, complex forming, reliable fabrication, or accurate CNC machining, we have the capabilities to meet your needs.',
      },
      {
        title: 'Printed Circuit Board Assembly, Wire Harness, Components, Sub-Assemblies and Turn-Key Solutions',
        description:
          'Our team has the technical expertise to handle complex electronic assemblies, ensuring quality and reliability throughout the production process.',
      },
      {
        title: 'Low-Volume Pilot-Production through High-Volume Mass Production Builds',
        description:
          'From low-volume pilot production to high-volume mass production builds, we have the flexibility and scalability to meet your production needs at every stage.',
      },
      {
        title: 'Plastics, Metals, PCBA, Resins, Textile Apparel, Leather, Wood, and Paper Products',
        description:
          'Whether you need plastic components, precision metal parts, PCB assemblies, resin-based products, textile apparel, leather goods, wooden items, or paper-based solutions, Regatta can bring your designs to life.',
      },
      {
        title: 'Assembly, Kitting, Testing, Packaging, Warehousing and Order Fulfillment',
        description:
          'We provide services past production as well, including assembly, kitting, testing, packaging, warehousing, and order fulfillment. Our attention to detail ensures products are delivered with accuracy and in compliance with your specifications.',
      },
    ],
  },
  {
    slug: 'fulfillment',
    title: 'Fulfillment Services',
    tagline: 'End-to-End Delivery for Every Sales Channel',
    description:
      "Our robust fulfillment services ensure seamless order processing and delivery. Whether it's web-sale end-customer fulfillment or EDI fulfillment for big-box retailers, we provide a streamlined logistics experience.",
    highlights: [
      'Customized Packaging',
      'Reliable Inventory Management',
      'Timely Order Processing',
    ],
    items: [
      {
        title: 'Fulfillment Planning, Scheduling & Forecasting',
        description:
          'We offer comprehensive fulfillment services that encompass planning, scheduling, and forecasting, ensuring that your products are delivered on time and meet customer demands.',
      },
      {
        title: 'Component & Assembly Kitting, Packaging & Warehousing',
        description:
          'Our fulfillment team ensures accurate and efficient kitting of components and assemblies, optimized packaging for safe and secure transportation, and reliable warehousing to store your products until they are ready to be shipped.',
      },
      {
        title: 'Web-Sale End-Customer Fulfillment',
        description:
          'We handle web-sale end-customer fulfillment, catering to the growing e-commerce market. Our systems and processes are designed to meet the demands of this dynamic environment.',
      },
      {
        title: 'EDI Fulfillment for Big-Box Retailers',
        description:
          'For clients supplying big-box retailers, we offer Electronic Data Interchange (EDI) fulfillment services. We are well-versed in the specific requirements of big-box retailers and can efficiently handle EDI transactions, ensuring compliance with their standards.',
      },
      {
        title: 'Low-Volume Pilot-Production through High-Volume Mass Production Builds',
        description:
          'Whether you have low-volume pilot production or high-volume mass production builds, our fulfillment services are flexible and scalable to meet your needs and deliver products to market quickly and efficiently.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
```

- [ ] **Step 2: Write `src/components/AccordionItem.astro`**

```astro
---
interface Props {
  title: string;
  content: string;
}
const { title, content } = Astro.props;
---
<details class="group border-b border-gray-200">
  <summary class="flex items-center justify-between cursor-pointer py-4 font-semibold text-navy-900 hover:text-brand-orange transition-colors list-none">
    <span>{title}</span>
    <svg
      class="w-5 h-5 flex-shrink-0 ml-4 text-brand-orange transition-transform group-open:rotate-180"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <p class="pb-4 text-sm text-gray-600 leading-relaxed">{content}</p>
</details>
```

- [ ] **Step 3: Write `src/pages/services/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { services } from '../../data/services';
---
<BaseLayout
  title="Services & Capabilities"
  description="Regatta Product Development offers design, tooling, production integration, and fulfillment services for products of all kinds."
>
  <section class="bg-navy-900 text-white py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">Services & Capabilities</h1>
      <p class="text-gray-300 text-lg max-w-2xl">
        From concept to delivery — comprehensive product development solutions under one roof.
      </p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {services.map(service => (
        <a
          href={`/services/${service.slug}`}
          class="group border border-gray-200 rounded-lg p-6 hover:border-brand-orange transition-colors"
        >
          <h2 class="text-xl font-semibold text-navy-900 group-hover:text-brand-orange transition-colors mb-2">
            {service.title}
          </h2>
          <p class="text-gray-600 text-sm mb-4">{service.description}</p>
          <span class="text-brand-orange text-sm font-medium">View capabilities →</span>
        </a>
      ))}
    </div>
  </section>

  <section class="bg-navy-900 text-white py-16 px-4 text-center">
    <h2 class="text-2xl font-bold mb-4">Ready to get started?</h2>
    <p class="text-gray-300 mb-8">Tell us about your project and we'll get back to you promptly.</p>
    <button data-quote-trigger class="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition-colors">
      Request a Quote
    </button>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Write `src/pages/services/[slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import AccordionItem from '../../components/AccordionItem.astro';
import { services } from '../../data/services';

export function getStaticPaths() {
  return services.map(service => ({
    params: { slug: service.slug },
    props: { service },
  }));
}

const { service } = Astro.props;
---
<BaseLayout title={service.title} description={service.description}>
  <section class="bg-navy-900 text-white py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <p class="text-sm text-gray-400 mb-2">
        <a href="/services" class="hover:text-brand-orange transition-colors">Services</a>
        {' / '}
        <span>{service.title}</span>
      </p>
      <h1 class="text-4xl font-bold mb-4">{service.title}</h1>
      <p class="text-gray-300 text-lg max-w-2xl">{service.tagline}</p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2">
        <p class="text-gray-600 text-lg mb-8">{service.description}</p>
        <h2 class="text-2xl font-bold text-navy-900 mb-2">Our {service.title} Include:</h2>
        <div class="border-t border-gray-200">
          {service.items.map(item => (
            <AccordionItem title={item.title} content={item.description} />
          ))}
        </div>
      </div>

      <aside>
        <div class="bg-navy-900 rounded-lg p-6 text-white sticky top-24">
          <h3 class="font-semibold mb-3">Built for</h3>
          <ul class="space-y-2 mb-6">
            {service.highlights.map(h => (
              <li class="flex items-center gap-2 text-gray-300 text-sm">
                <span class="w-1.5 h-1.5 bg-brand-orange rounded-full flex-shrink-0"></span>
                {h}
              </li>
            ))}
          </ul>
          <h3 class="font-semibold mb-2">Ready to talk?</h3>
          <p class="text-gray-300 text-sm mb-4">Tell us about your project and we'll respond promptly.</p>
          <button
            data-quote-trigger
            class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors text-sm"
          >
            Request a Quote
          </button>
        </div>
      </aside>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Verify all four service pages build**

```bash
npm run build
```

Expected: Build succeeds, no type errors. Output includes `/services/design`, `/services/tooling`, `/services/production`, `/services/fulfillment`.

- [ ] **Step 6: Commit**

```bash
git add src/data/ src/components/AccordionItem.astro src/pages/services/
git commit -m "feat: add services data, AccordionItem, services overview and detail pages"
```

---

## Task 8: Home page

**Files:**
- Create: `src/components/PortfolioCard.astro` (also used in Task 10)
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Write `src/components/PortfolioCard.astro`**

```astro
---
interface Props {
  title: string;
  category: string;
  image: string;
}
const { title, category, image } = Astro.props;
---
<div class="bg-white rounded-lg overflow-hidden border border-gray-200 group">
  <div class="aspect-video overflow-hidden bg-gray-100">
    <img
      src={image}
      alt={title}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      width="640"
      height="360"
    />
  </div>
  <div class="p-4">
    <span class="text-xs font-medium text-brand-orange uppercase tracking-wide">{category}</span>
    <h3 class="font-semibold text-navy-900 mt-1">{title}</h3>
  </div>
</div>
```

- [ ] **Step 2: Write the failing navigation test `tests/e2e/navigation.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('home page loads with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Regatta Product Development/);
});

test('hero Request a Quote button opens modal', async ({ page }) => {
  await page.goto('/');
  const heroCta = page.locator('section').first().locator('[data-quote-trigger]');
  await heroCta.click();
  await expect(page.locator('#quote-modal')).toBeVisible();
});

test('services overview page loads', async ({ page }) => {
  await page.goto('/services');
  await expect(page.locator('h1')).toContainText('Services');
});

test('design service detail page loads and accordion works', async ({ page }) => {
  await page.goto('/services/design');
  await expect(page.locator('h1')).toContainText('Design Services');
  const firstAccordion = page.locator('details').first();
  await firstAccordion.click();
  await expect(firstAccordion).toHaveAttribute('open', '');
});

test('portfolio page loads', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.locator('h1')).toContainText('Portfolio');
});

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toContainText('About');
});

test('contact page loads', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('h1')).toContainText('Contact');
});
```

- [ ] **Step 3: Run navigation tests to confirm they fail (pages not yet built)**

```bash
npm run test:e2e -- --project=chromium tests/e2e/navigation.spec.ts
```

Expected: FAIL — `/portfolio`, `/about`, `/contact` return 404

- [ ] **Step 4: Replace `src/pages/index.astro` with full home page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PortfolioCard from '../components/PortfolioCard.astro';
import { getCollection } from 'astro:content';
import { sortPortfolio } from '../utils/portfolio';
import { services } from '../data/services';

const allPortfolio = await getCollection('portfolio');
const featured = sortPortfolio(allPortfolio).filter(p => p.data.featured).slice(0, 3);
---
<BaseLayout
  title="Dallas's Top Mechanical Design Firm"
  description="Regatta Product Development delivers all-in-one product development — design, tooling, production, and fulfillment — for start-ups and established businesses in Texas."
>
  <!-- Hero -->
  <section class="bg-navy-900 text-white py-24 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-bold leading-tight mb-6 max-w-3xl">
        From Concept to Reality —<br />All-In-One Product Development
      </h1>
      <p class="text-gray-300 text-xl mb-10 max-w-2xl">
        Regatta Product Development delivers design, tooling, production integration, and fulfillment
        services for entrepreneurs and established businesses alike.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <button
          data-quote-trigger
          class="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition-colors"
        >
          Request a Quote
        </button>
        <a
          href="/services"
          class="border border-white hover:border-brand-orange hover:text-brand-orange text-white font-semibold px-8 py-3 rounded transition-colors text-center"
        >
          Our Services
        </a>
      </div>
    </div>
  </section>

  <!-- Services Overview -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h2 class="text-3xl font-bold text-navy-900 mb-3">Services & Capabilities</h2>
    <p class="text-gray-600 mb-10 max-w-2xl">
      Comprehensive product development under one roof, from initial concept through final delivery.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map(service => (
        <a
          href={`/services/${service.slug}`}
          class="group border border-gray-200 rounded-lg p-5 hover:border-brand-orange transition-colors"
        >
          <h3 class="font-semibold text-navy-900 group-hover:text-brand-orange transition-colors mb-2">
            {service.title}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-3">{service.description}</p>
        </a>
      ))}
    </div>
  </section>

  <!-- Featured Portfolio -->
  {featured.length > 0 && (
    <section class="bg-gray-50 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-navy-900 mb-3">Featured Work</h2>
        <p class="text-gray-600 mb-10">A selection of recent product development projects.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(item => (
            <PortfolioCard
              title={item.data.title}
              category={item.data.category}
              image={item.data.images[0] ?? '/images/portfolio/placeholder.jpg'}
            />
          ))}
        </div>
        <div class="mt-10 text-center">
          <a
            href="/portfolio"
            class="border border-navy-900 hover:bg-navy-900 hover:text-white text-navy-900 font-semibold px-8 py-3 rounded transition-colors inline-block"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  )}

  <!-- CTA Band -->
  <section class="bg-brand-orange py-16 px-4 text-center">
    <h2 class="text-3xl font-bold text-white mb-4">Have a product idea?</h2>
    <p class="text-orange-100 text-lg mb-8">
      We work with start-ups, established businesses, and home inventors.
    </p>
    <button
      data-quote-trigger
      class="bg-white text-brand-orange hover:bg-orange-50 font-semibold px-8 py-3 rounded transition-colors"
    >
      Request a Quote
    </button>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/PortfolioCard.astro tests/e2e/navigation.spec.ts
git commit -m "feat: add home page with hero, services overview, and featured portfolio"
```

---

## Task 9: Portfolio page

**Files:**
- Create: `src/pages/portfolio/index.astro`

- [ ] **Step 1: Write `src/pages/portfolio/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PortfolioCard from '../../components/PortfolioCard.astro';
import { getCollection } from 'astro:content';
import { sortPortfolio } from '../../utils/portfolio';

const allPortfolio = await getCollection('portfolio');
const sorted = sortPortfolio(allPortfolio);
---
<BaseLayout
  title="Portfolio"
  description="Browse Regatta Product Development's portfolio of product design, manufacturing, and fulfillment projects across recreational, medical, industrial, and consumer industries."
>
  <section class="bg-navy-900 text-white py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">Portfolio & Gallery</h1>
      <p class="text-gray-300 text-lg">
        Product development projects across recreational, medical, industrial, and consumer industries.
      </p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {sorted.length === 0 ? (
      <p class="text-gray-500 text-center py-12">Portfolio coming soon.</p>
    ) : (
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(item => (
          <PortfolioCard
            title={item.data.title}
            category={item.data.category}
            image={item.data.images[0] ?? '/images/portfolio/placeholder.jpg'}
          />
        ))}
      </div>
    )}
  </section>

  <section class="bg-navy-900 text-white py-16 px-4 text-center">
    <h2 class="text-2xl font-bold mb-4">Ready to add your product to our portfolio?</h2>
    <button
      data-quote-trigger
      class="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition-colors"
    >
      Request a Quote
    </button>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/portfolio/
git commit -m "feat: add portfolio page with sorted grid"
```

---

## Task 10: About page

**Files:**
- Create: `src/components/TeamGrid.astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: Write `src/components/TeamGrid.astro`**

```astro
---
import { getCollection } from 'astro:content';

const members = await getCollection('team');
const sorted = [...members].sort((a, b) => a.data.order - b.data.order);
---
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
  {sorted.map(member => (
    <div class="text-center">
      <div class="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-3">
        <img
          src={member.data.photo}
          alt={member.data.name}
          class="w-full h-full object-cover"
          loading="lazy"
          width="96"
          height="96"
        />
      </div>
      <p class="font-semibold text-navy-900 text-sm">{member.data.name}</p>
      <p class="text-xs text-gray-500 mt-0.5">{member.data.role}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Write `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TeamGrid from '../components/TeamGrid.astro';
---
<BaseLayout
  title="About Us"
  description="Founded in 1999, Regatta Product Development provides unsurpassed product development solutions headquartered in Aubrey, Texas."
>
  <section class="bg-navy-900 text-white py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">About Regatta</h1>
      <p class="text-gray-300 text-lg max-w-2xl">Pioneering innovation in product development since 1999.</p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="max-w-3xl mb-16">
      <h2 class="text-2xl font-bold text-navy-900 mb-6">Our Story</h2>
      <p class="text-gray-600 leading-relaxed mb-4">
        Founded in 1999 as RHP Industries, Regatta Product Development provides unsurpassed product
        development solutions and manufacturing services for a variety of products — from entrepreneurs
        with a first idea to well-established companies launching new lines.
      </p>
      <p class="text-gray-600 leading-relaxed">
        From the inception of an idea to order fulfillment and delivery, we deliver end-to-end solutions
        across concept exploration, product design, production tooling, manufacturing, and fulfillment.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div class="bg-navy-900 rounded-lg p-6 text-white">
        <h3 class="font-bold text-lg mb-3">Mission</h3>
        <p class="text-gray-300 text-sm leading-relaxed">
          Provide unsurpassed product solutions using the finest design practices and most thorough
          development process for complete production design, development and deployment solutions to
          ensure the success of our clients.
        </p>
      </div>
      <div class="border border-gray-200 rounded-lg p-6">
        <h3 class="font-bold text-lg text-navy-900 mb-3">Vision</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          To be the premier product development company building life-long committed relationships with
          our customers, suppliers, employees and professional peers — with global recognition for
          continued expansion, growth, and success.
        </p>
      </div>
    </div>
  </section>

  <section class="bg-gray-50 py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-2xl font-bold text-navy-900 mb-10">Our Team</h2>
      <TeamGrid />
    </div>
  </section>

  <section class="bg-navy-900 text-white py-16 px-4 text-center">
    <h2 class="text-2xl font-bold mb-4">Work with us</h2>
    <p class="text-gray-300 mb-8">Tell us about your product and let's build something together.</p>
    <button
      data-quote-trigger
      class="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition-colors"
    >
      Request a Quote
    </button>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TeamGrid.astro src/pages/about.astro
git commit -m "feat: add about page with company story, mission/vision, and team grid"
```

---

## Task 11: Contact page

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Write `src/pages/contact.astro`**

Note: Replace the Google Maps `src` URL with the actual embed URL from [maps.google.com](https://maps.google.com) → search "Regatta Product Development Aubrey TX" → Share → Embed a map. Also confirm the email address with the client.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Contact Us"
  description="Get in touch with Regatta Product Development in Aubrey, Texas. Request a quote or find our location."
>
  <section class="bg-navy-900 text-white py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
      <p class="text-gray-300 text-lg">
        We're headquartered in Aubrey, Texas. Let's talk about your project.
      </p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div>
        <h2 class="text-2xl font-bold text-navy-900 mb-6">Get in Touch</h2>
        <dl class="space-y-3 text-gray-600 mb-8">
          <div>
            <dt class="font-semibold text-navy-900 inline">Address: </dt>
            <dd class="inline">Aubrey, Texas</dd>
          </div>
          <div>
            <dt class="font-semibold text-navy-900 inline">Email: </dt>
            <dd class="inline">
              <a href="mailto:info@regattapd.com" class="text-brand-orange hover:underline">
                info@regattapd.com
              </a>
            </dd>
          </div>
        </dl>

        <div class="bg-navy-900 rounded-lg p-6 text-white">
          <h3 class="font-semibold text-lg mb-2">Ready to start a project?</h3>
          <p class="text-gray-300 text-sm mb-4">
            Request a quote and we'll get back to you within one business day.
          </p>
          <button
            data-quote-trigger
            class="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded transition-colors text-sm"
          >
            Request a Quote
          </button>
        </div>
      </div>

      <div class="rounded-lg overflow-hidden border border-gray-200 h-96">
        <!-- Replace src with the real Google Maps embed URL from maps.google.com -->
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53694.81!2d-96.9!3d33.19!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c3b5b9f0e3b3d%3A0xc1a7c2e1b2c3d4e5!2sAubrey%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Regatta Product Development — Aubrey, Texas"
        ></iframe>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Run navigation e2e tests — should now all pass**

```bash
npm run test:e2e -- --project=chromium tests/e2e/navigation.spec.ts
```

Expected: PASS — all 7 tests pass

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add contact page with map and quote CTA"
```

---

## Task 12: TinaCMS configuration

**Files:**
- Create: `tina/config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install TinaCMS**

```bash
npm install tinacms @tinacms/cli
```

- [ ] **Step 2: Write `tina/config.ts`**

```ts
import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.TINA_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? 'main',
  clientId: process.env.TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'portfolio',
        label: 'Portfolio Items',
        path: 'src/content/portfolio',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            required: true,
            options: ['Recreational', 'Medical', 'Oil & Gas', 'Consumer', 'Automotive'],
          },
          { type: 'boolean', name: 'featured', label: 'Featured (pins to top of grid)' },
          { type: 'datetime', name: 'date', label: 'Date', required: true },
          { type: 'image', name: 'images', label: 'Images', list: true },
          { type: 'rich-text', name: 'body', label: 'Description', isBody: true },
        ],
      },
      {
        name: 'team',
        label: 'Team Members',
        path: 'src/content/team',
        format: 'json',
        fields: [
          { type: 'string', name: 'name', label: 'Name', isTitle: true, required: true },
          { type: 'string', name: 'role', label: 'Role / Title', required: true },
          { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
          { type: 'image', name: 'photo', label: 'Photo', required: true },
          { type: 'number', name: 'order', label: 'Display Order (lower = earlier)', required: true },
        ],
      },
    ],
  },
});
```

- [ ] **Step 3: Update `package.json` scripts**

Replace the `dev` and `build` scripts:
```json
"dev": "tinacms dev -c \"astro dev\"",
"build": "tinacms build && astro build",
"preview": "astro preview"
```

- [ ] **Step 4: Create `.env.example`**

```bash
# Tina Cloud credentials — get from app.tina.io after connecting your repo
TINA_CLIENT_ID=
TINA_TOKEN=
TINA_BRANCH=main
```

- [ ] **Step 5: Add `.env` to `.gitignore`**

```bash
echo ".env" >> .gitignore
```

- [ ] **Step 6: Verify dev server starts with TinaCMS**

```bash
npm run dev
```

Expected: Server starts, `/admin` is accessible at `http://localhost:4321/admin`. Tina Cloud credentials not required for local dev.

- [ ] **Step 7: Commit**

```bash
git add tina/ .env.example .gitignore package.json
git commit -m "feat: add TinaCMS config for portfolio and team collections"
```

---

## Task 13: 404 page and Netlify config

**Files:**
- Create: `src/pages/404.astro`
- Create: `netlify.toml`

- [ ] **Step 1: Write `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Not Found" description="The page you requested could not be found.">
  <section class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-8xl font-bold text-brand-orange mb-4">404</p>
      <h1 class="text-2xl font-bold text-navy-900 mb-4">Page Not Found</h1>
      <p class="text-gray-600 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <a
        href="/"
        class="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded transition-colors"
      >
        Back to Home
      </a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Serve the TinaCMS admin SPA
[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro netlify.toml
git commit -m "feat: add 404 page and Netlify build config"
```

---

## Task 14: Seed content from current site

**Files:**
- Create: `src/content/team/*.json` (9 team members)
- Update: `src/content/portfolio/example-project.md` (note for client)

Team member photos are not available from the current site's public pages. Use `/images/team/placeholder.jpg` for all photo paths until the client provides headshots.

- [ ] **Step 1: Create team member JSON files**

`src/content/team/01-robert-palmer.json`
```json
{ "name": "Robert Palmer", "role": "President", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 1 }
```

`src/content/team/02-joshua-mason.json`
```json
{ "name": "Joshua Mason", "role": "Sales Associate", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 2 }
```

`src/content/team/03-marc-teel.json`
```json
{ "name": "Marc Teel", "role": "Project Manager", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 3 }
```

`src/content/team/04-charity-mutesi.json`
```json
{ "name": "Charity Mutesi", "role": "Office Administrator", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 4 }
```

`src/content/team/05-william-taylor.json`
```json
{ "name": "William Taylor", "role": "Design Lead", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 5 }
```

`src/content/team/06-conner-anderson.json`
```json
{ "name": "Conner Anderson", "role": "Design Associate", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 6 }
```

`src/content/team/07-andrew-shelton.json`
```json
{ "name": "Andrew Shelton", "role": "Production Lead", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 7 }
```

`src/content/team/08-adam-young.json`
```json
{ "name": "Adam Young", "role": "Fulfillment Coordinator", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 8 }
```

`src/content/team/09-jordan-babbitt.json`
```json
{ "name": "Jordan Babbitt", "role": "Production Technician", "bio": "", "photo": "/images/team/placeholder.jpg", "order": 9 }
```

- [ ] **Step 2: Delete the placeholder portfolio item and note for client**

Replace `src/content/portfolio/example-project.md` with a note file that won't be parsed as content:

```bash
rm src/content/portfolio/example-project.md
```

Portfolio items will be added through TinaCMS once the client provides project photos and descriptions. The grid shows "Portfolio coming soon" when empty.

- [ ] **Step 3: Add a placeholder image**

```bash
# Create a 640x360 gray placeholder and save as public/images/portfolio/placeholder.jpg
# and public/images/team/placeholder.jpg
# Use any 1x1 gray pixel or a generated placeholder image
```

If you have ImageMagick: 
```bash
convert -size 640x360 xc:#E5E7EB public/images/portfolio/placeholder.jpg
convert -size 96x96 xc:#E5E7EB public/images/team/placeholder.jpg
```

Otherwise, download any royalty-free gray placeholder image and save to those paths.

- [ ] **Step 4: Run full build and all tests**

```bash
npm run build
npm test
npm run test:e2e
```

Expected: Build succeeds. 4 unit tests pass. All e2e tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/content/team/ public/images/
git commit -m "feat: seed team member content from current site"
```

---

## Post-Build Checklist

Before handing off to client or deploying to production:

- [ ] Get real Google Maps embed URL for contact page — replace the placeholder `src` in `src/pages/contact.astro`
- [ ] Confirm client email address for contact page (`info@regattapd.com` or other)
- [ ] Create Tina Cloud account at [app.tina.io](https://app.tina.io), connect GitHub repo, copy `TINA_CLIENT_ID` and `TINA_TOKEN` to Netlify environment variables
- [ ] Add `TINA_CLIENT_ID` and `TINA_TOKEN` to Netlify environment variables (Site settings → Environment variables)
- [ ] Request team member headshots from client — upload via TinaCMS `/admin` after deploy
- [ ] Request portfolio project photos and descriptions — add via TinaCMS `/admin` after deploy
- [ ] Verify Netlify Forms submission arrives in dashboard after first deploy (test with a real submission)
- [ ] Set up Netlify form notification email (Forms → quote → Settings → Email notifications)
