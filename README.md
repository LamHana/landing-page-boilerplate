# create-landing-app

A CLI scaffolding tool that generates production-ready **Next.js 16** landing pages with built-in quality checks, optional features, and deployment configuration — in seconds.

---

## Quick Start

```bash
npx create-landing-app
```

Or:

```bash
pnpx create-landing-app
```

Answer the interactive prompts:

```
? Project name: my-landing
? Include Blog section? Yes
? Include Contact section? (form + API route) Yes
? Enable dark mode toggle? Yes
? Include Analytics? (GTM + GA via env vars) No
```

The following are included automatically (not prompted):
- **Package manager:** pnpm
- **i18n:** Dictionary-based (EN/VI)
- **State management:** Zustand
- **Data fetching:** TanStack Query

The CLI scaffolds your project, merges selected modules, and runs `pnpm install` automatically.

---

## What You Get

### Base Template (always included)

| Category | Details |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 + CSS variables |
| UI Components | Radix UI primitives + shadcn/ui pattern |
| Animation | Motion (Framer Motion v12) |
| Icons | Lucide React |
| Fonts | Inter via `next/font/google` |
| Toasts | Sonner |
| Theme | Pila — white + deep blue, dark mode ready |

### Pre-built Sections

| Section | Description |
|---|---|
| `hero-section` | Full-width hero with headline, sub-copy, and CTA buttons |
| `features-section` | Feature grid with icons and descriptions |
| `footer-section` | Links, social icons, gradient background, copyright |
| `navbar` | Desktop sticky navbar with dropdown support |
| `navbar-mobile` | Mobile drawer menu |

### Developer Experience

- **ESLint** — strict rules: `no-unused-vars`, `no-explicit-any`, React hooks
- **Prettier** — auto-format with Tailwind class sorting (`prettier-plugin-tailwindcss`)
- **Husky** — Git hooks: `pre-commit`, `commit-msg`, `pre-push`
- **commitlint** — enforces Conventional Commits format
- **lint-staged** — runs Prettier + ESLint only on staged files (fast)

### Git Hooks

| Hook | What it does |
|---|---|
| `pre-commit` | Format + lint staged files |
| `commit-msg` | Validate conventional commit format |
| `pre-push` | Next.js build → Lighthouse CI → Docker scan |

### Pre-push Quality Gates

1. **`next build`** — no broken builds reach the remote
2. **Lighthouse CI** — Performance, Accessibility, Best Practices, SEO scored against thresholds
3. **Trivy scan** — Docker image security vulnerability scan (requires Docker)

Skip individual gates:
```bash
SKIP_LIGHTHOUSE=true git push   # skip Lighthouse only
SKIP_SCAN=true git push         # skip Docker/Trivy scan only
```

---

## Optional Modules

Select any combination during CLI setup. Each module merges its files and dependencies into the base template without touching unrelated files.

### i18n — Dictionary-based

```
Adds:
  dictionaries/en.json
  dictionaries/vi.json
  app/[lang]/layout.tsx      (locale-aware layout)
  app/[lang]/page.tsx        (locale-aware home)
  middleware.ts              (locale detection + redirect)
  components/navs/language-switcher.tsx
```

Supported locales: `en`, `vi` (extendable by adding dictionary files).

### State Management — Zustand

```
Adds:
  store/ui-store.ts          (UI state: sidebar, modals, theme)
  Zustand provider wiring in providers.tsx
```

### Data Fetching — TanStack Query

```
Adds:
  lib/query-client.ts        (configured QueryClient)
  lib/custom-fetch.ts        (fetch wrapper with error handling)
  QueryClientProvider in providers.tsx
```

### Docker

```
Adds:
  Dockerfile                 (multi-stage, standalone Next.js output)
  docker-compose.yml
  .dockerignore
  scripts/build-and-scan.sh  (build + Trivy security scan)
```

### Analytics

```
Adds:
  components/analytics/gtm.tsx   (Google Tag Manager script)
  components/analytics/ga.tsx    (Google Analytics 4 script)
  Env vars: NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA_ID
```

### Dark Mode

```
Adds:
  next-themes ThemeProvider
  components/ui/theme-toggle.tsx
  Dark mode CSS variables already in styles/theme.css (.dark block)
```

### Sections — Blog

```
Adds:
  app/[lang]/blogs/(list)/[category]/  (category listing — ISR, 24h cache)
  app/[lang]/blogs/detail/[slugNews]/  (blog detail — ISR, 24h cache)
  app/api/blogs/route.ts               (mock blog API, replaced by NEXT_PUBLIC_BLOG_API)
  components/blogs/                    (blog card, desktop/mobile list views)
  components/sections/blog-section.tsx (home page blog preview section)
  components/navs/layout-blogs.tsx     (blog layout with category nav)
  lib/blog-api.ts                      (fetch wrapper — external API or built-in mock)
  lib/sanitize.ts                      (HTML sanitizer for blog content)
  styles/prose.css                     (typography styles for blog content)
  hooks/use-mobile.ts                  (responsive breakpoint hook)
  Deps: @tanstack/react-query, isomorphic-dompurify, jsdom
  Env vars:
    NEXT_PUBLIC_BLOG_API      (optional — falls back to built-in mock data)
    BLOG_API_APPLICATION      (API application filter, default: ndachain)
```

Blog pages use **Incremental Static Regeneration (ISR)**. The top 20 blog detail pages are pre-rendered at build time via `generateStaticParams`; remaining slugs render on first visit and are then cached. All pages revalidate every 24 hours (`revalidate = 86400`), serving stale content while regenerating in the background.

### Sections — Contact

```
Adds:
  components/sections/contact-section.tsx
  (form with name, email, message — wired to a configurable endpoint)
```

### Sections — About

```
Adds:
  components/sections/about-section.tsx
  (team grid or mission statement layout)
```

---

## Project Structure (Generated)

```
my-landing/
├── app/
│   ├── [lang]/              # i18n routes (if i18n module enabled)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── blogs/           # Blog pages (if blog module enabled)
│   ├── api/                 # API routes (blog mock, etc.)
│   ├── globals.css
│   ├── layout.tsx           # Root layout — fonts, providers, metadata
│   ├── page.tsx             # Home page
│   ├── sitemap.ts           # Auto-generated sitemap
│   ├── robots.ts            # robots.txt
│   └── not-found.tsx        # Custom 404
├── components/
│   ├── navs/                # Navbar, mobile menu, language switcher
│   ├── sections/            # Hero, Features, About, Footer, Blog, Contact
│   ├── analytics/           # GTM / GA4 scripts (if analytics enabled)
│   └── ui/                  # Radix-based UI primitives
├── constants/
│   └── common.ts            # Nav links, site config, social links
├── dictionaries/            # i18n JSON files (if i18n enabled)
│   ├── en.json
│   └── vi.json
├── hooks/                   # Custom React hooks
├── lib/
│   ├── metadata.ts          # createMetadata() — use for all page <head>
│   ├── utils.ts             # cn() — Tailwind class merge
│   ├── query-client.ts      # TanStack Query client (if enabled)
│   ├── custom-fetch.ts      # Fetch wrapper (if TanStack Query enabled)
│   └── blog-api.ts          # Blog API client (if blog enabled)
├── public/                  # Static assets (og-image.png, favicon, etc.)
├── scripts/
│   ├── lighthouse-check.sh
│   └── build-and-scan.sh
├── store/                   # Zustand stores (if enabled)
│   └── ui-store.ts
├── styles/
│   └── theme.css            # CSS variables — edit here to rebrand
├── types/                   # Shared TypeScript type definitions
├── .env.example             # Template for required env vars
├── .env.local               # Your local secrets (never committed)
├── commitlint.config.mjs
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com    # Canonical URL for metadata & sitemap

# Analytics (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Blog API (optional — falls back to mock data if not set)
NEXT_PUBLIC_BLOG_API=https://api.yourdomain.com   # Base URL, expects GET /blogs, GET /blogs/:slug
BLOG_API_APPLICATION=ndachain                     # Application filter sent with every API request

# Storage (optional)
NEXT_PUBLIC_S3_DOMAIN=https://cdn.yourdomain.com
```

---

## Scripts

```bash
npm run dev             # Development server (Turbopack — fast HMR)
npm run build           # Production build
npm run start           # Serve production build
npm run lint            # ESLint check
npm run lint:fix        # ESLint auto-fix
npm run format          # Prettier write
npm run format:check    # Prettier dry-run
npm run lighthouse      # Run Lighthouse CI manually
npm run build-and-scan  # Docker build + Trivy security scan
```

---

## Theming

All design tokens live in `styles/theme.css` as CSS variables (OKLCH color space + hex brand colors).

To rebrand, edit the `--brand-*` and `--primary` variables:

```css
/* styles/theme.css */
:root {
  --primary: oklch(0.45 0.18 250);       /* Main brand color */
  --brand-primary: #1849a9;              /* Used in components directly */
  --brand-action: #1570ef;               /* CTA buttons */
  --brand-footer-from: #1764eb;          /* Footer gradient start */
  --brand-footer-to: #002d7b;            /* Footer gradient end */
}
```

Dark mode overrides are in the `.dark {}` block — activated when the `dark-mode` module is installed.

---

## Metadata

Use `createMetadata()` from `lib/metadata.ts` for every page — it wires up title, description, OpenGraph, Twitter card, and canonical URL consistently:

```typescript
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "My Landing Page",
  description: "A great product that does amazing things.",
  path: "/about",          // appended to NEXT_PUBLIC_SITE_URL for canonical
  image: "/og-about.png",  // optional custom OG image
});
```

---

## Commit Convention

Uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(navbar): add mobile dropdown menu
fix(hero): correct CTA button alignment on mobile
refactor(blog): extract post card into separate component
perf(images): add next/image width and height to hero
chore: update dependencies
docs: add deployment guide
```

Allowed types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

---

## Lighthouse Thresholds

| Category | Threshold | Fail mode |
|---|---|---|
| Performance | ≥ 80 | warn |
| Accessibility | ≥ 90 | error |
| Best Practices | ≥ 90 | warn |
| SEO | ≥ 90 | warn |
| LCP | ≤ 3s | error |
| CLS | ≤ 0.1 | error |

`error` level failures block the push. `warn` level failures are logged but do not block.

---

## Deployment

### Docker (VPS / self-hosted)

```bash
# Build image
docker build -t my-landing .

# Run
docker run -p 3000:3000 --env-file .env.production my-landing

# Or with docker-compose
docker compose up -d
```

The Docker image uses a multi-stage build with `output: "standalone"` — final image runs `node .next/standalone/server.js` (no `next start`, no full Node install needed at runtime).

### Vercel / Netlify

Connect the repo — no config needed. Both platforms detect Next.js automatically.

Set env vars in the platform dashboard (same keys as `.env.example`).

---

## Monorepo Structure (this repo)

```
landing-page-boilerplate/
├── packages/
│   └── cli/                 # create-landing-app CLI source
│       └── src/
│           ├── prompts.ts   # Interactive CLI prompts
│           └── scaffold.ts  # File merging and project generation logic
├── templates/
│   └── nextjs/
│       ├── base/            # Always-included base template
│       └── optional/        # Optional feature modules
│           ├── analytics/
│           ├── dark-mode/
│           ├── docker/
│           ├── i18n-dict/
│           ├── tanstack-query/
│           ├── zustand/
│           └── sections/
│               ├── about/
│               ├── blog/
│               └── contact/
├── docs/                    # Project documentation
└── plans/                   # Implementation plans
```

---

## Tech Stack

| | |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS |
| [Radix UI](https://radix-ui.com) | Accessible UI primitives |
| [Motion](https://motion.dev) | Animations |
| [Lucide React](https://lucide.dev) | Icons |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |
| [Zustand](https://zustand-demo.pmnd.rs) | Client state (optional) |
| [TanStack Query](https://tanstack.com/query) | Server state (optional) |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode (optional) |
| [Husky](https://typicode.github.io/husky) | Git hooks |
| [commitlint](https://commitlint.js.org) | Commit message linting |
| [lint-staged](https://github.com/okonet/lint-staged) | Staged file linting |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | Performance auditing |
| [Trivy](https://aquasecurity.github.io/trivy) | Container security scanning |
