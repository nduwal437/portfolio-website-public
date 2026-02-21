---
name: scaffold
description: Generate a new Angular component following project conventions. Use when creating new components, services, or guards.
disable-model-invocation: true
user-invocable: true
argument-hint: [component|service|guard] [name]
allowed-tools: Write, Read, Edit, Bash, Glob, Grep
---

Scaffold a new Angular artifact following project conventions.

## Arguments
- `$0`: Type - `component`, `service`, or `guard`
- `$1`: Name - kebab-case name (e.g., `project-detail`)

## Component Scaffolding

If `$0` is `component`:

1. Create directory: `src/app/$1/`

2. Create `$1.component.ts`:
   - Selector: `app-$1`
   - `ChangeDetectionStrategy.OnPush`
   - Implement `OnInit` and `OnDestroy`
   - Include `destroy$ = new Subject<void>()` for subscription cleanup
   - Use `takeUntil(this.destroy$)` pattern for any subscriptions

3. Create `$1.component.html`:
   - Basic template structure
   - Use `trackBy` for any `*ngFor` directives

4. Create `$1.component.css`:
   - Empty with comment placeholder for component styles

5. Create `$1.component.spec.ts`:
   - Import from `@angular/core/testing`
   - Basic "should create" test
   - TestBed configuration with necessary imports

6. Register in `src/app/app.module.ts`:
   - Add import statement
   - Add to `declarations` array

7. If this is a routed component, add route to `src/app/app-routing.module.ts`

## Service Scaffolding

If `$0` is `service`:

1. Create `src/app/services/$1.service.ts`:
   - `@Injectable({ providedIn: 'root' })`
   - Inject `HttpClient` if API-related

2. Create `src/app/services/$1.service.spec.ts`:
   - HttpClientTestingModule if applicable
   - Basic "should be created" test

## Guard Scaffolding

If `$0` is `guard`:

1. Create `src/app/guards/$1.guard.ts`:
   - Implement `CanActivate`
   - Inject `Router` and `AuthService`

2. Create `src/app/guards/$1.guard.spec.ts`

## Project Conventions (from CLAUDE.md)
- NgModule-based (declare in AppModule, not standalone)
- Path aliases: `@app/*`, `@services/*`, `@guards/*`, `@models/*`
- RxJS cleanup: `takeUntil(this.destroy$)` with `Subject<void>`
- TypeScript strict mode
- Component-scoped CSS
