# CLAUDE.md

Project-specific instructions for Claude Code when working on a generated `create-landing-app` project.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + CSS variables |
| UI Components | Radix UI primitives + shadcn/ui pattern |
| Animation | Motion (Framer Motion v12) |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts via `next/font`) |
| Toasts | Sonner |
| Package manager | npm (or bun/pnpm depending on scaffold choice) |

## Project Structure

```
app/
  layout.tsx          Root layout — add providers, fonts here
  page.tsx            Home page — compose sections here
  globals.css         Tailwind base + global resets
  sitemap.ts          Auto-generated sitemap
  robots.ts           robots.txt config
  not-found.tsx       Custom 404 page

components/
  navs/               Navigation components
    navbar.tsx        Desktop navbar
    navbar-mobile.tsx Mobile drawer menu
  sections/           Page section components
    hero-section.tsx
    features-section.tsx
    footer-section.tsx
  ui/                 shadcn/ui base components (Radix-based)
    button.tsx
    dialog.tsx
    dropdown-menu.tsx
    accordion.tsx
    input.tsx  checkbox.tsx  radio-group.tsx  select.tsx  tabs.tsx  textarea.tsx
    sonner.tsx          Toast wrapper
  providers.tsx       Client-side provider wrapper

constants/
  common.ts           Nav links, site config, social links

lib/
  metadata.ts         createMetadata() factory — use for all page metadata
  utils.ts            cn() — Tailwind class merge utility

styles/
  theme.css           CSS variables (colors, radius) — edit here to rebrand

types/                Shared TypeScript type definitions
public/               Static assets (og-image.png, favicon, etc.)
scripts/
  lighthouse-check.sh Manual Lighthouse CI runner
  build-and-scan.sh   Docker build + Trivy security scan
```

## Development Commands

```bash
npm run dev           # Dev server (Turbopack — fast HMR)
npm run build         # Production build
npm run start         # Serve production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write (all files)
npm run format:check  # Prettier dry-run
npm run lighthouse    # Run Lighthouse CI audit manually
npm run build-and-scan  # Docker build + Trivy vulnerability scan
```

## Code Conventions

### TypeScript
- **No `any` types** — use `unknown` + type narrowing or proper interfaces
- Keep component files under **200 lines** — extract sub-components when larger
- Use named exports for components; default export only for Next.js pages/layouts

### Styling
- Use `cn()` from `lib/utils.ts` for all conditional class merging — never string interpolation
- **CSS variables** for all design tokens — defined in `styles/theme.css`
- Rebrand by editing `--brand-*` and `--primary` variables in `theme.css`
- Dark mode variables are in the `.dark {}` block — only active when `dark-mode` optional module is installed

### Metadata
- **Always** use `createMetadata()` from `lib/metadata.ts` for page `<head>` metadata
- Set `NEXT_PUBLIC_SITE_URL` in `.env.local` — used for canonical URLs and OG images
- Place `og-image.png` (1200×630) in `/public/`

### Components
- Place new page sections in `components/sections/`
- Place new nav components in `components/navs/`
- Place Radix-based UI primitives in `components/ui/`
- All animations via Motion (`motion/react`) — avoid CSS transitions for interactive elements

### Providers
- Add client-side providers in `components/providers.tsx`
- The root `layout.tsx` has `// __PROVIDERS_IMPORT__` and `// __PROVIDERS_WRAP_START/END__` markers — these are used by the CLI injector; do not remove them

## Environment Variables

```bash
# .env.local (never commit this file)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com   # Required — used in metadata & sitemap
NEXT_PUBLIC_GTM_ID=                           # Google Tag Manager (analytics module)
NEXT_PUBLIC_GA_ID=                            # Google Analytics (analytics module)
NEXT_PUBLIC_BLOG_API=                         # External blog API base URL (blog module)
BLOG_API_APPLICATION=ndachain                # Application filter required by the blog API
NEXT_PUBLIC_S3_DOMAIN=                        # CDN domain for media assets
```

## Optional Modules (installed via CLI)

These are injected at scaffold time — each module merges files and deps into the base template:

| Module | What it adds |
|---|---|
| `i18n-dict` | `dictionaries/en.json` + `vi.json`, `app/[lang]/` routing, middleware, language switcher |
| `zustand` | `store/ui-store.ts`, Zustand provider |
| `tanstack-query` | `lib/query-client.ts`, `lib/custom-fetch.ts`, QueryClientProvider |
| `docker` | `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `scripts/build-and-scan.sh` |
| `analytics` | GTM/GA4 script injection, env var wiring |
| `dark-mode` | `next-themes` ThemeProvider, theme toggle component |
| `blog` | Blog listing + detail pages, `lib/blog-api.ts`, optional external API |
| `contact` | Contact form section with validation |
| `about` | About section with team/mission layout |

## Git Hooks (Husky)

| Hook | Runs |
|---|---|
| `pre-commit` | Prettier + ESLint on staged files (via lint-staged) |
| `commit-msg` | commitlint — enforces Conventional Commits |
| `pre-push` | `next build` → Lighthouse CI → Docker scan (if Dockerfile exists) |

Skip Lighthouse on push: `SKIP_LIGHTHOUSE=true git push`
Skip Docker scan: `SKIP_SCAN=true git push`

## Commit Convention

```
feat(hero): add animated gradient background
fix(navbar): close mobile menu on route change
refactor(blog): extract post card into separate component
chore: update dependencies
```

Allowed types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

## Deployment

```bash
# Docker (standalone output)
docker build -t my-app .
docker run -p 3000:3000 my-app

# Or
docker compose up

# Vercel / Netlify — just connect the repo, no config needed
```

The Docker image runs `node .next/standalone/server.js` — not `next start`.
