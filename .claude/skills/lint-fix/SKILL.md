---
name: lint-fix
description: Check and fix code style with ESLint and Prettier. Use when code needs formatting or lint fixes.
disable-model-invocation: false
user-invocable: true
argument-hint: [--check | --fix]
allowed-tools: Bash, Read, Edit, Glob
---

Check and fix code style issues across the project.

## Steps

1. Determine mode from `$ARGUMENTS`:
   - `--check` or no arguments: Check only, report issues
   - `--fix`: Apply fixes automatically

2. Run ESLint:
   ```bash
   # Check mode
   npm run lint
   # Fix mode
   npm run lint -- --fix
   ```

3. Run Prettier:
   ```bash
   # Check mode
   npm run format:check
   # Fix mode
   npm run format
   ```

4. Report results:
   - Number of ESLint errors and warnings
   - Number of Prettier formatting issues
   - Files that were fixed (in fix mode)
   - Remaining issues that need manual attention

5. If there are remaining issues after auto-fix, explain what each issue is and how to resolve it manually.

## Project Code Style (from CLAUDE.md)
- Prettier: single quotes, 120 char width, no trailing commas, 2-space indent
- ESLint: `@angular-eslint` rules
- Component selector prefix: `app-`
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase in `src/app/models/`
- trackBy required for all `*ngFor` directives
