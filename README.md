# create-landing-app

A CLI scaffolding tool that generates production-ready Next.js 15 landing pages with built-in quality checks, optional features, and deployment configuration — in seconds.

---

## Quick Start

```bash
npx create-landing-app
```

Or with a specific package manager:

```bash
bunx create-landing-app
pnpx create-landing-app
```

Follow the interactive prompts:

```
? Project name: my-landing
? Package manager: bun
? i18n support: Dictionary-based (EN/VI)
? State management: Zustand
? Data fetching: TanStack Query
? Include Docker setup? Yes
```

The CLI will scaffold your project, apply selected features, and run install automatically.

---

## What You Get

### Base Template (always included)

| Category | Details |
|---|---|
| Framework | Next.js 15.3 (App Router, Turbopack) |
| Styling | Tailwind CSS 4 + CSS Variables |
| UI Components | Radix UI + shadcn/ui pattern |
| Animation | Motion (Framer Motion v12) |
| Icons | Lucide React |
| Theme | Pila (dark/light via next-themes) |
| Toasts | Sonner |
| Language | TypeScript 5 |

### Pre-built Sections

- **Hero** — full-width hero with CTA
- **Features** — feature grid with icons
- **About** — company/product overview
- **Footer** — links, social, copyright

### Developer Experience

- **ESLint** — strict rules (`no-unused-vars`, `no-explicit-any`, React hooks)
- **Prettier** — auto-format with Tailwind class sorting
- **Husky** — Git hooks for quality gates
- **commitlint** — enforces Conventional Commits format
- **lint-staged** — runs Prettier + ESLint only on staged files

### Git Hooks

| Hook | What it does |
|---|---|
| `pre-commit` | Format + lint staged files |
| `commit-msg` | Validate conventional commit format |
| `pre-push` | Next.js build → Lighthouse CI → Docker scan |

### Pre-push Quality Checks

1. **Next.js build** — ensures no build errors before push
2. **Lighthouse CI** — scores Performance, Accessibility, Best Practices, SEO with thresholds
3. **Docker build + Trivy scan** — security vulnerability scan (skip with `SKIP_SCAN=true`)

---

## Optional Features

Select any combination during CLI setup:

### i18n — Dictionary-based
```
Adds: dictionaries/en.json, dictionaries/vi.json
      app/[lang]/page.tsx routing
      middleware.ts for locale detection
      Language switcher component
```

### State Management — Zustand
```
Adds: store/ui-store.ts
      Zustand provider wiring
```

### Data Fetching — TanStack Query
```
Adds: lib/query-client.ts
      QueryClientProvider setup
      lib/custom-fetch.ts utility
```

### Docker
```
Adds: Dockerfile (multi-stage, standalone output)
      docker-compose.yml
      .dockerignore
      scripts/build-and-scan.sh (Trivy security scan)
```

---

## Project Structure (Generated)

```
my-landing/
├── app/
│   ├── [lang]/          # i18n routes (if enabled)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── navs/            # Navbar, mobile menu, language switcher
│   ├── sections/        # Hero, Features, About, Footer
│   └── ui/              # Radix-based UI primitives
├── constants/
│   └── common.ts        # Nav links, site config
├── dictionaries/        # i18n JSON files (if enabled)
├── lib/                 # Utilities, query client, metadata
├── public/              # Static assets
├── scripts/
│   ├── build-and-scan.sh
│   └── lighthouse-check.sh
├── store/               # Zustand stores (if enabled)
├── styles/
│   └── theme.css        # Pila theme variables
└── types/
```

---

## Scripts

```bash
bun dev            # Development server (Turbopack)
bun build          # Production build
bun start          # Production server
bun lint           # ESLint check
bun lint:fix       # ESLint auto-fix
bun format         # Prettier write
bun format:check   # Prettier check
bun lighthouse     # Run Lighthouse CI manually
bun build-and-scan # Docker build + Trivy security scan
```

---

## Commit Convention

Uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(navbar): add mobile dropdown menu
fix(hero): correct CTA button alignment
chore: update dependencies
docs: add deployment guide
```

Allowed types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

---

## Lighthouse Thresholds

| Category | Threshold |
|---|---|
| Performance | ≥ 80 (warn) |
| Accessibility | ≥ 90 (error) |
| Best Practices | ≥ 90 (warn) |
| SEO | ≥ 90 (warn) |
| LCP | ≤ 3s (error) |
| CLS | ≤ 0.1 (error) |

Skip Lighthouse during push: `SKIP_LIGHTHOUSE=true git push`

---

## Deployment

The generated project outputs a standalone Next.js bundle for Docker/VPS deployment:

```bash
# Build and run with Docker
docker build -t my-landing .
docker run -p 3000:3000 my-landing

# Or use docker-compose
docker compose up
```

The Docker image uses `node .next/standalone/server.js` — no `next start` needed.

---

## Tech Stack

| | |
|---|---|
| [Next.js 15](https://nextjs.org) | React framework |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS |
| [Radix UI](https://radix-ui.com) | Accessible primitives |
| [Motion](https://motion.dev) | Animations |
| [Zustand](https://zustand-demo.pmnd.rs) | Client state (optional) |
| [TanStack Query](https://tanstack.com/query) | Server state (optional) |
| [Husky](https://typicode.github.io/husky) | Git hooks |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | Performance checks |
| [Trivy](https://aquasecurity.github.io/trivy) | Security scanning |
