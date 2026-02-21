---
name: upgrade
description: Research and assist with Angular version upgrades from v13 toward v19.
disable-model-invocation: true
user-invocable: true
argument-hint: [target-version]
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

Research the Angular upgrade path and identify what needs to change.

## Steps

1. Read `ANGULAR_UPGRADE_GUIDE.md` for the existing upgrade plan.

2. Determine target version:
   - If `$ARGUMENTS` specifies a version (e.g., `14`, `15`), focus on that upgrade step
   - Otherwise, research the next incremental upgrade (v13 -> v14)

3. Search the codebase for patterns that will break in the target version:
   - Deprecated APIs
   - Changed module imports
   - Breaking changes in Angular CLI
   - TypeScript version requirements
   - RxJS version changes

4. Check Angular's official update guide at https://angular.dev/update-guide for specific migration steps.

5. Identify affected files by searching for:
   - `NgModule` patterns (for standalone migration)
   - `HttpClientModule` (replaced in v15+)
   - `@angular/material` patterns (if used)
   - `ViewChild` static flags
   - `*ngIf`, `*ngFor` directives (replaced by `@if`, `@for` in v17+)
   - Karma/Jasmine config (may need updates)

6. Report:
   - Required Node.js version for target Angular version
   - Required TypeScript version
   - List of breaking changes affecting this project
   - Files that need modification (with specific line references)
   - Recommended order of operations
   - Risk assessment (what might break)

## Project Context
- Current: Angular 13.2, TypeScript 4.5, Node 16.x
- Architecture: NgModule-based, not standalone
- Test runner: Karma + Jasmine (unit), Playwright (E2E)
- See CLAUDE.md for full project details
