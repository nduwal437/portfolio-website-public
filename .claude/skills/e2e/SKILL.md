---
name: e2e
description: Run Playwright E2E tests for the portfolio website. Use when verifying user-facing functionality works end-to-end.
disable-model-invocation: false
user-invocable: true
argument-hint: [test-name | --ui | --headed]
allowed-tools: Bash, Read, Grep, Glob
---

Run Playwright E2E tests and analyze results.

## Steps

1. Check test execution mode from `$ARGUMENTS`:
   - No arguments: `npm run e2e`
   - `--ui`: `npm run e2e:ui` (interactive mode)
   - `--headed`: `npm run e2e:headed` (visible browser)
   - Specific test name: `npx playwright test --grep "$0"`

2. If Playwright is not installed, install it first:
   ```bash
   npx playwright install chromium
   ```

3. Wait for tests to complete. The Playwright config auto-starts the dev server at localhost:4200.

4. Analyze any failures:
   - Read the error output and stack traces
   - Check if the failure is in the test or the application
   - Look at the relevant test file in `e2e/`
   - Look at the relevant component code in `src/app/`

5. Report results:
   - Tests passed/failed/skipped
   - For failures: root cause and suggested fix
   - Whether the dev server started successfully

## Project Context
- E2E tests live in `e2e/portfolio.spec.ts`
- Config: `playwright.config.ts` (auto-starts `npm start`)
- Test suites: Portfolio Website Navigation, Contact Form, Authentication Flow (login page, protected routes, form validation, error messages), Responsive Design (mobile/tablet/desktop), Accessibility (ARIA, keyboard nav, heading structure)
- Base URL: http://localhost:4200
