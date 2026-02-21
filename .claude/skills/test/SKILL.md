---
name: test
description: Run unit tests with coverage report and identify gaps. Use when checking test quality or verifying tests pass.
disable-model-invocation: false
user-invocable: true
argument-hint: [--watch | component-name]
allowed-tools: Bash, Read, Grep, Glob
---

Run the unit test suite and analyze coverage.

## Steps

1. If `$ARGUMENTS` contains a component name, run tests for that specific component:
   ```bash
   npx ng test --no-watch --include="**/\$0*spec.ts"
   ```
   Otherwise, run the full suite with coverage:
   ```bash
   npm test -- --no-watch --code-coverage
   ```

2. If `$ARGUMENTS` is `--watch`, run in watch mode instead:
   ```bash
   npm test
   ```

3. Read the coverage summary from the terminal output.

4. Compare coverage against the 80% target documented in CLAUDE.md and TESTING_STRATEGY.md.

5. If coverage is below 80%, identify the files with the worst coverage gaps and suggest which tests to add.

6. Report results:
   - Total tests passed/failed
   - Coverage percentages (statements, branches, functions, lines)
   - Files below 80% threshold
   - Specific suggestions for improving coverage

## Project Context
- Test framework: Karma + Jasmine
- Spec files colocated with components (`*.spec.ts`)
- RxJS subscriptions use `takeUntil(this.destroy$)` pattern - test cleanup accordingly
- Use `@models/*` path alias for shared interfaces
