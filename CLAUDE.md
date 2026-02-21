# CLAUDE.md - Project Context for AI Assistants

## Project Overview

Angular 13.2 portfolio website for Nikesh Duwal, deployed on GitHub Pages at www.nikeshduwal.com.np. Features portfolio pages (Home, About, Projects, Skills, Contact), authentication via Xano backend, and a protected shopping list CRUD feature.

## Tech Stack

- **Framework**: Angular 13.2 (NgModule-based, not standalone)
- **Language**: TypeScript 4.5 (strict mode)
- **Styling**: Plain CSS (component-scoped)
- **Backend**: Xano REST API
- **Deployment**: GitHub Pages via GitHub Actions
- **Node**: 16.x

## Commands

```bash
npm start              # Dev server at localhost:4200
npm run build          # Production build to dist/
npm run build:gh-pages # Build for GitHub Pages to docs/
npm run deploy:gh-pages # Build + create 404.html for SPA routing
npm test               # Unit tests (Karma + Jasmine, watch mode)
npm run lint           # ESLint
npm run format         # Prettier (write)
npm run format:check   # Prettier (check only)
npm run e2e            # Playwright E2E tests
npm run e2e:ui         # Playwright interactive UI mode
npm run e2e:headed     # Playwright headed browser
```

## Project Structure

```
src/app/
├── about/              # About page (experience, education)
├── contact/            # Contact form (no submit handler yet)
├── guards/
│   └── auth.guard.ts   # CanActivate/CanActivateChild for protected routes
├── home/               # Landing page with nav, hero, project previews
├── login/              # Login form (email/password)
├── models/
│   ├── portfolio.models.ts  # Shared interfaces (ProjectPreview, Skill, Experience, Education)
│   ├── app.constants.ts     # PROTECTED_ROUTES, APP_ROUTES
│   └── index.ts             # Barrel export
├── projects/           # Projects page (placeholder)
├── services/
│   ├── auth.interceptor.ts    # Adds Bearer token to HTTP requests
│   ├── auth.service.ts        # Login/logout, session management, inactivity timeout
│   └── shopping-list.service.ts # CRUD for shopping list items
├── shopping-list/      # Protected shopping list (requires auth)
├── skills/             # Skills page (placeholder)
├── app-routing.module.ts
├── app.component.ts
└── app.module.ts
e2e/                    # Playwright E2E tests
```

## Architecture & Patterns

- **NgModule-based** — AppModule declares all components; not using standalone components
- **OnPush change detection** on HomeComponent and AboutComponent
- **RxJS subscription cleanup** uses `takeUntil(this.destroy$)` pattern with `Subject<void>` in OnDestroy
- **Auth flow**: JWT token stored in localStorage, AuthInterceptor adds Bearer header, AuthGuard protects `/shopping-list`, 1-hour inactivity timeout with activity tracking
- **Environment config**: API base URL in `src/environments/environment.ts` and `environment.prod.ts`

## TypeScript Path Aliases

```
@app/*           → src/app/*
@services/*      → src/app/services/*
@guards/*        → src/app/guards/*
@models/*        → src/app/models/*
@environments/*  → src/environments/*
```

These are configured in `tsconfig.json` but most imports still use relative paths. Prefer path aliases for new code.

## API

Backend is Xano at the URL configured in `environment.apiBaseUrl`. Endpoints:
- `POST /auth/login` — `{ email, password }` → `{ authToken, user }`
- `GET /shopping_list_item` — List all items (requires Bearer token)
- `POST /shopping_list_item` — Create item
- `PUT /shopping_list_item/{id}` — Update item
- `DELETE /shopping_list_item/{id}` — Delete item

## Testing

- **Unit tests**: Karma + Jasmine. Run `npm test`. Specs are colocated with components (`*.spec.ts`).
- **E2E tests**: Playwright. Run `npm run e2e`. Tests live in `e2e/`. Config auto-starts dev server.
- **Coverage target**: 80%+. Current coverage is partial — several components still only have boilerplate "should create" tests.

## Code Style

- **ESLint** with `@angular-eslint` and Prettier integration (`.eslintrc.json`)
- **Prettier**: single quotes, 120 char width, no trailing commas, 2-space indent (`.prettierrc`)
- **Component selector prefix**: `app-` (e.g., `app-home`, `app-about`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `PROTECTED_ROUTES`)
- **Interfaces**: PascalCase, defined in `src/app/models/`
- **trackBy functions**: Required for all `*ngFor` directives

## Deployment

GitHub Pages via `peaceiris/actions-gh-pages@v3`. Build outputs to `docs/` with `index.html` copied to `404.html` for client-side routing. Custom domain configured via CNAME file in `src/assets/`.

CI pipeline (`.github/workflows/ci.yml`): lint → build → test → deploy (on main push only).

## Custom Skills (Slash Commands)

Available via `/command-name` in Claude Code:

| Command | Description | Auto-invoked? |
|---------|-------------|---------------|
| `/test` | Run unit tests with coverage, identify gaps | Yes |
| `/e2e` | Run Playwright E2E tests | Yes |
| `/build-check` | Verify production build for GitHub Pages | Yes |
| `/lint-fix` | Check/fix ESLint + Prettier issues | Yes |
| `/scaffold` | Generate new component/service/guard following conventions | Manual only |
| `/review` | Code review for security, conventions, quality | Yes |
| `/upgrade` | Research Angular upgrade path (runs as Explore subagent) | Manual only |

Skills are defined in `.claude/skills/*/SKILL.md`.

## Known Gaps / Future Work

- **Angular upgrade needed**: v13 → v19 (see `ANGULAR_UPGRADE_GUIDE.md` for step-by-step plan)
- **Incomplete pages**: ProjectsComponent and SkillsComponent are placeholders
- **Contact form**: Has HTML but no submit handler
- **No lazy loading**: All routes are eagerly loaded in `app-routing.module.ts`
- **No SSR/prerendering**: Pure client-side rendering (bad for SEO)
- **No dark mode**: Colors are hardcoded in component CSS files

## Important Notes

- Do NOT commit `.env` files or hardcode API keys outside of `environment.ts` files
- The `package-updated.json` in the root is a temp reference file — do not commit it
- When adding new components, declare them in `AppModule` (until migrated to standalone)
- Protected routes must be listed in `PROTECTED_ROUTES` in `src/app/models/app.constants.ts`
- Always run `npm run build` to verify changes compile before committing
