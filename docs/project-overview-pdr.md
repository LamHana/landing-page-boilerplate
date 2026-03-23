# create-landing-app — Product Overview & PDR

## Project Vision

CLI scaffolding tool that generates production-ready Next.js landing pages in seconds. Developers run `npx create-landing-app`, answer 8 interactive prompts, and receive a fully configured, themed, and ready-to-deploy Next.js 15 application with optional integrations.

**Published as:** `create-landing-app` on npm (public registry)
**Target Users:** Frontend developers, indie makers, agencies building marketing sites

---

## Functional Requirements

### Core Features

| Feature | Spec |
|---------|------|
| **Interactive Setup** | @clack/prompts-based CLI with 8-step questionnaire |
| **Package Manager Support** | bun, pnpm, yarn |
| **Theme Presets** | 5 CSS themes: pila (default), ocean, forest, purple, dark |
| **Scaffolding** | Copy base template + merge optional features + apply theme + install deps |
| **Template Base** | Next.js 15, Tailwind v4, shadcn/ui components, Framer Motion animations, TypeScript, ESLint, Prettier, Husky pre-commit hooks |

### Interactive Prompts (Mandatory)
1. **Project name** — Validates non-empty string
2. **Package manager** — Select: bun | pnpm | yarn
3. **Theme** — Select: pila (default) | ocean | forest | purple | dark
4. **i18n** — Select: none | dict (no external deps)
5. **State management** — Select: none | zustand
6. **Data fetching** — Select: none | tanstack-query
7. **Extra sections** — Multiselect: about | contact | faq | pricing | testimonials (optional)
8. **Docker** — Confirm: yes | no (for VPS deployment)

### Optional Features Integration

| Feature | Contents | Dependencies |
|---------|----------|--------------|
| **i18n-dict** | Dictionary-based i18n, no extra packages | — |
| **zustand** | State store setup + pkg.json merge | zustand npm package |
| **tanstack-query** | Query client + providers | @tanstack/react-query |
| **sections/{about\|contact\|faq\|pricing\|testimonials}** | Pre-built component sections | None |
| **docker** | Dockerfile, .dockerignore, docker-compose.yml | — |

### Templating System

- **Base template:** `templates/nextjs/base/` — Complete Next.js 15 app structure
- **Themes:** `templates/nextjs/themes/{theme}.css` — CSS variables for colors
- **Optional features:** `templates/nextjs/optional/{feature}/` containing:
  - `files/` — New files to copy into project
  - `inject/` — Code fragments to inject into base files via markers
  - `pkg.json` — Package.json fragment (merged into base)
- **Token replacement:** `__PROJECT_NAME__`, `__PACKAGE_MANAGER__`, `__THEME__` in text files
- **Injection markers:** `{/* MARKER:__MARKER_NAME__ */}` (JSX) or `// MARKER:__MARKER_NAME__` (JS/TS)

---

## Non-Functional Requirements

| Requirement | Spec |
|-------------|------|
| **Node.js** | >= 18.0.0 |
| **Performance** | Scaffold + install < 2 min (depends on PM and network) |
| **Error handling** | Graceful cancellation on user quit; install failures logged (user prompted to retry manually) |
| **Code language** | TypeScript (strict mode) |
| **Package type** | ESM (type: "module" in package.json) |
| **Build target** | Node.js compatible binary via tsc + dist/index.js shebang |
| **Test coverage** | Jest unit tests for utility functions (merge-json, replace-tokens) |

---

## Architecture

### Monorepo Structure
```
landing-page-boilerplate/
├── packages/cli/
│   ├── src/
│   │   ├── index.ts              # CLI entry: intro → prompts → scaffold → install → outro
│   │   ├── prompts.ts            # UserConfig interface + runPrompts() function
│   │   ├── scaffold.ts           # Scaffolding orchestration
│   │   ├── install.ts            # Package manager install (bun/pnpm/yarn)
│   │   └── utils/
│   │       ├── copy-dir.ts       # Recursive directory copy
│   │       ├── merge-json.ts     # Deep merge for package.json fragments
│   │       ├── replace-tokens.ts # Replace __TOKEN__ placeholders
│   │       └── __tests__/        # Jest unit tests
│   ├── dist/                     # Compiled JS (tsc output)
│   └── package.json              # Published to npm as "create-landing-app"
│
└── templates/nextjs/
    ├── base/                     # Next.js 15 template foundation
    ├── themes/
    │   ├── pila.css
    │   ├── ocean.css
    │   ├── forest.css
    │   ├── purple.css
    │   └── dark.css
    └── optional/                 # Feature plugins
        ├── i18n-dict/
        ├── zustand/
        ├── tanstack-query/
        ├── sections/{about,contact,faq,pricing,testimonials}/
        └── docker/
```

### Execution Flow

```
CLI Binary (create-landing-app)
    ↓
    └─ index.ts: main()
       ├─ intro() — Display welcome message
       ├─ runPrompts() → UserConfig
       │  ├─ Project name (text input)
       │  ├─ Package manager (select)
       │  ├─ Theme (select)
       │  ├─ i18n (select)
       │  ├─ State management (select)
       │  ├─ Data fetching (select)
       │  ├─ Extra sections (multiselect)
       │  └─ Docker (confirm)
       ├─ scaffold(config, targetDir)
       │  ├─ copyDir(base) → targetDir
       │  ├─ For each optional feature:
       │  │  ├─ mergeOptional() — Copy files + inject code
       │  │  └─ Merge pkg.json fragment
       │  ├─ applyTheme() — Copy {theme}.css → styles/theme.css
       │  ├─ replaceTokensInDir() — Replace __TOKEN__ placeholders
       │  └─ setupHusky() — chmod +x for hook scripts
       ├─ install(packageManager, targetDir) — Run install command
       └─ outro() — Display success message + next steps
```

---

## Acceptance Criteria

### Functional AC

- [ ] CLI runs with `npx create-landing-app` (from npm registry)
- [ ] All 8 prompts display correctly and accept user input
- [ ] Cancellation at any prompt exits gracefully (no project created)
- [ ] Base template copies without corruption
- [ ] Each optional feature (i18n, zustand, sections, docker) merges correctly
- [ ] Theme CSS applies to styles/theme.css
- [ ] Token replacement works for __PROJECT_NAME__, __PACKAGE_MANAGER__, __THEME__
- [ ] package.json fragments merge correctly (dependencies, scripts)
- [ ] Dependencies install successfully with all three PMs (bun, pnpm, yarn)
- [ ] Generated project runs with `npm/pnpm/yarn/bun dev`
- [ ] Pre-commit hooks (Husky) execute on git commit in generated project

### Non-Functional AC

- [ ] No errors in TypeScript strict mode
- [ ] All utility functions have Jest unit tests
- [ ] Install failure is caught and logged gracefully
- [ ] Bundle size < 500KB (uncompressed)
- [ ] Scaffold completes < 30s (excluding install time)

### Security AC

- [ ] No plaintext secrets in templates
- [ ] .env.example provided in base template
- [ ] Docker secrets not baked into Dockerfile
- [ ] No eval() or code execution from user input
- [ ] Git hooks (Husky) verified before execution

---

## Key Implementation Details

### Scaffolding Algorithm

1. **Copy base:** Entire `templates/nextjs/base/` → `projectName/`
2. **Apply optionals:** For each selected optional feature:
   - Copy `optional/{feature}/files/*` to project (if exists)
   - Inject code blocks from `optional/{feature}/inject/*` into base files
   - Mark injection points with `{/* MARKER:__NAME__ */}` or `// MARKER:__NAME__`
3. **Apply theme:** Copy `themes/{theme}.css` → `projectName/styles/theme.css`
4. **Replace tokens:** Recursively scan project files, replace `__TOKEN__` with values
5. **Merge pkg.json:** Deep merge `optional/{feature}/pkg.json` into project package.json
6. **Setup Husky:** chmod +x on `.husky/*` and `scripts/*.sh`

### File Encoding Convention

Inject files use `__` as path separator: `components__providers.tsx` → `components/providers.tsx`. This avoids file system issues with nested directories in inject folder.

### Error Handling

- **Missing template files:** Log warning, continue (graceful degradation)
- **Install failure:** Spinner stops, message "Install failed. Run install manually."
- **Token replacement:** Only targets text files (`.ts`, `.tsx`, `.json`, `.css`, `.md`, `.env`, `.sh`, `.yml`, `.yaml`)
- **Cancelled prompts:** Exit with code 0, no project created

---

## Dependencies

### Runtime (published to npm)
- `@clack/prompts@^0.9.0` — Interactive prompt UI
- `kolorist@^1.8.0` — Terminal color output
- `execa@^9.0.0` — Cross-platform process execution

### Dev
- `typescript@^5.0.0` — Strict type checking
- `jest@^29.5.0` + `ts-jest` — Unit tests
- `@types/node@^20.0.0` — Node.js type definitions

### Generated Project (in template)
- `next@^15` — React framework
- `react@^19` — UI library
- `tailwindcss@^4` — Utility-first CSS
- `framer-motion` — Animations
- `shadcn/ui` — Component library
- Optional: `zustand`, `@tanstack/react-query`, `@next/i18n-routing`

---

## Success Metrics

| Metric | Target |
|--------|--------|
| **Time to first working app** | < 3 min (including install) |
| **User satisfaction** | 4.5+ stars on npm |
| **Test coverage** | >= 80% for utils/ |
| **Download count** | 1000+ weekly within 3 months |
| **Theme variations** | 5 production-ready presets |
| **Optional integrations** | >= 8 feature plugins |

---

## Version History

| Version | Date | Status | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-03-19 | In Dev | Initial scaffold, core prompts, 5 themes |

---

## Known Limitations

- **Single region deployment:** No built-in cloud integration; Docker optional
- **No env generation:** Users must create .env.local post-scaffold
- **Limited i18n:** Dictionary-based only (no complex routing)
- **Static themes:** Theme colors hardcoded; no runtime theme switcher in base
- **Package manager detection:** No auto-detection; explicit user selection required

---

## Next Steps

1. **Testing** — Unit tests for all utilities
2. **Template validation** — Ensure all optional features integrate cleanly
3. **npm publishing** — Prepare for public release
4. **Documentation** — Create user guide + API reference
5. **Examples** — Publish 5 theme showcase sites
