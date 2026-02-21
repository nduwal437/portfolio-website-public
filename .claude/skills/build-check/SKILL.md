---
name: build-check
description: Verify the production build succeeds and check for issues. Use before committing or deploying.
disable-model-invocation: false
user-invocable: true
allowed-tools: Bash, Read, Glob
---

Verify the production build for GitHub Pages deployment.

## Steps

1. Run the production build:
   ```bash
   npm run build:gh-pages
   ```

2. Verify build output:
   - Check that `docs/` directory exists with `index.html`
   - Check that `404.html` exists for SPA routing
   - Check that CNAME file exists in output for custom domain

3. Check for build warnings:
   - Budget size warnings (configured in `angular.json`)
   - Deprecation warnings
   - Missing dependencies

4. Report bundle sizes from the build output:
   - Initial bundle size
   - Lazy-loaded chunks (if any)
   - Whether sizes are within configured budgets

5. Run lint check as well:
   ```bash
   npm run lint
   ```

6. Summary:
   - Build status: pass/fail
   - Bundle size report
   - Any warnings to address
   - Lint issues (if any)

## Project Context
- Deployment: GitHub Pages via `peaceiris/actions-gh-pages@v3`
- Build output: `docs/` directory
- Custom domain: www.nikeshduwal.com.np (CNAME in `src/assets/`)
- CI pipeline: `.github/workflows/ci.yml`
