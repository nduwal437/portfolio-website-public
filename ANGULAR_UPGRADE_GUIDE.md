# Angular Upgrade Guide: v13 → v19

## Overview

Angular 13 is no longer receiving security patches. This guide walks through upgrading incrementally, one major version at a time. Each step should be a separate commit/branch so you can verify the app works before moving forward.

**Official tool**: https://angular.dev/update-guide

---

## Pre-Upgrade Checklist

- [ ] Commit all current changes
- [ ] Ensure all tests pass (`npm test`)
- [ ] Ensure build succeeds (`npm run build`)
- [ ] Create a new branch: `git checkout -b angular-upgrade`

---

## Step 1: v13 → v14

```bash
npx @angular/cli@14 update @angular/core@14 @angular/cli@14
```

**Key changes:**
- Typed reactive forms (`FormControl<string>` instead of `FormControl`)
- `@angular/flex-layout` deprecated
- Stricter `ng update` checks
- Update TypeScript to ~4.7

**After update:** Run `ng build && ng test` to verify.

---

## Step 2: v14 → v15

```bash
npx @angular/cli@15 update @angular/core@15 @angular/cli@15
```

**Key changes:**
- Standalone components stable (can start migrating from NgModules)
- `RouterModule.forRoot()` → can use `provideRouter()`
- New `@angular/cdk` directives
- `.browserlistrc` → `.browserslistrc` (may auto-migrate)
- Update TypeScript to ~4.8

**After update:** Run `ng build && ng test` to verify.

---

## Step 3: v15 → v16

```bash
npx @angular/cli@16 update @angular/core@16 @angular/cli@16
```

**Key changes:**
- **Signals** introduced (preview) — new reactive primitive
- `DestroyRef` and `takeUntilDestroyed()` — simpler subscription cleanup
- esbuild builder available (faster builds)
- Required inputs for components
- Update TypeScript to ~5.0

**After update:** Run `ng build && ng test` to verify.

---

## Step 4: v16 → v17

```bash
npx @angular/cli@17 update @angular/core@17 @angular/cli@17
```

**Key changes:**
- **Built-in control flow** (`@if`, `@for`, `@switch` replacing `*ngIf`, `*ngFor`)
- `@defer` blocks for lazy loading template sections
- New app builder (esbuild + Vite) as default
- Signals stable
- View transitions API support
- Update TypeScript to ~5.2

**Migration command for control flow:**
```bash
ng generate @angular/core:control-flow
```

**After update:** Run `ng build && ng test` to verify.

---

## Step 5: v17 → v18

```bash
npx @angular/cli@18 update @angular/core@18 @angular/cli@18
```

**Key changes:**
- Zoneless change detection (experimental)
- `@let` template syntax for local variables
- Material 3 default theme
- Improved hydration
- Route-level render mode
- Update TypeScript to ~5.4

**After update:** Run `ng build && ng test` to verify.

---

## Step 6: v18 → v19

```bash
npx @angular/cli@19 update @angular/core@19 @angular/cli@19
```

**Key changes:**
- Standalone by default (no more `standalone: true` needed)
- `linkedSignal()` for derived state
- `resource()` API for async data loading
- Incremental hydration
- Hot Module Replacement (HMR) by default
- Update TypeScript to ~5.6

**After update:** Run `ng build && ng test` to verify.

---

## Post-Upgrade Modernization

Once on v19, consider these modernizations:

### 1. Migrate to Standalone Components
```bash
ng generate @angular/core:standalone
```
This removes `AppModule` and declares components as standalone.

### 2. Replace takeUntil with takeUntilDestroyed
```typescript
// Before (v13 pattern):
private destroy$ = new Subject<void>();
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
this.obs$.pipe(takeUntil(this.destroy$)).subscribe(...)

// After (v16+ pattern):
private destroyRef = inject(DestroyRef);
this.obs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...)
```

### 3. Replace *ngIf/*ngFor with built-in control flow
```html
<!-- Before -->
<div *ngIf="isLoggedIn">Welcome</div>
<div *ngFor="let item of items; trackBy: trackByFn">{{item.name}}</div>

<!-- After -->
@if (isLoggedIn) { <div>Welcome</div> }
@for (item of items; track item.id) { <div>{{item.name}}</div> }
```

### 4. Use Signals for reactive state
```typescript
// Before
isLoggedIn = false;

// After
isLoggedIn = signal(false);
```

---

## Troubleshooting

- If `ng update` fails, try: `npx @angular/cli@{version} update --force`
- Check peer dependency conflicts: `npm ls`
- Clear cache between upgrades: `rm -rf node_modules package-lock.json && npm install`
- If tests fail, check for deprecated APIs in release notes

## Resources

- Official update guide: https://angular.dev/update-guide
- Angular blog: https://blog.angular.dev/
- Angular changelog: https://github.com/angular/angular/blob/main/CHANGELOG.md
