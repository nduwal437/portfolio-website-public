---
name: review
description: Review code changes for issues, best practices, and project conventions. Use before committing.
disable-model-invocation: false
user-invocable: true
argument-hint: [file-path | --staged | --all]
allowed-tools: Bash, Read, Grep, Glob
---

Review code changes for quality, security, and adherence to project conventions.

## Steps

1. Determine scope from `$ARGUMENTS`:
   - `--staged`: Review only staged changes (`git diff --cached`)
   - `--all`: Review all uncommitted changes (`git diff` + `git diff --cached`)
   - Specific file path: Review that file
   - No arguments: Review all uncommitted changes

2. Get the diff:
   ```bash
   git diff --cached  # or git diff depending on scope
   ```

3. Review each changed file for:

   **Security**
   - No hardcoded API keys or secrets (should be in environment files)
   - No XSS vulnerabilities in templates
   - Proper input sanitization
   - Auth token handling follows existing patterns

   **Angular Conventions**
   - Component selector uses `app-` prefix
   - OnPush change detection where appropriate
   - `takeUntil(this.destroy$)` for RxJS subscriptions
   - `trackBy` for all `*ngFor` directives
   - New components declared in AppModule

   **TypeScript**
   - Strict mode compliance
   - Interfaces in `src/app/models/` (not inline in components)
   - Path aliases used (`@app/*`, `@services/*`, `@models/*`)
   - Constants in UPPER_SNAKE_CASE

   **Code Quality**
   - No unused imports or variables
   - No `console.log` statements left in
   - Error handling for HTTP calls
   - Tests added/updated for changes

4. Report findings organized by severity:
   - **Critical**: Security issues, bugs, breaking changes
   - **Warning**: Convention violations, missing tests
   - **Suggestion**: Style improvements, refactoring opportunities

## Project Context
- See CLAUDE.md for full project conventions
- API URLs must be in `src/environments/environment*.ts`
- Protected routes listed in `src/app/models/app.constants.ts`
