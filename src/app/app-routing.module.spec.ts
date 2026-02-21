import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './guards/auth.guard';

// Mock components for testing
@Component({ template: '' })
class MockHomeComponent {}
@Component({ template: '' })
class MockAboutComponent {}
@Component({ template: '' })
class MockProjectsComponent {}
@Component({ template: '' })
class MockSkillsComponent {}
@Component({ template: '' })
class MockContactComponent {}
@Component({ template: '' })
class MockLoginComponent {}
@Component({ template: '' })
class MockShoppingListComponent {}

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;
  let authGuard: jasmine.SpyObj<AuthGuard>;

  beforeEach(async () => {
    const authGuardSpy = jasmine.createSpyObj('AuthGuard', ['canActivate']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent },
          { path: 'about', component: MockAboutComponent },
          { path: 'projects', component: MockProjectsComponent },
          { path: 'skills', component: MockSkillsComponent },
          { path: 'contact', component: MockContactComponent },
          { path: 'login', component: MockLoginComponent },
          {
            path: 'shopping-list',
            component: MockShoppingListComponent,
            canActivate: [AuthGuard]
          },
          { path: '**', redirectTo: '' }
        ])
      ],
      declarations: [
        MockHomeComponent,
        MockAboutComponent,
        MockProjectsComponent,
        MockSkillsComponent,
        MockContactComponent,
        MockLoginComponent,
        MockShoppingListComponent
      ],
      providers: [{ provide: AuthGuard, useValue: authGuardSpy }]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authGuard = TestBed.inject(AuthGuard) as jasmine.SpyObj<AuthGuard>;
  });

  it('should navigate to home component for empty path', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('');
  });

  it('should navigate to about component', async () => {
    await router.navigate(['/about']);
    expect(location.path()).toBe('/about');
  });

  it('should navigate to projects component', async () => {
    await router.navigate(['/projects']);
    expect(location.path()).toBe('/projects');
  });

  it('should navigate to skills component', async () => {
    await router.navigate(['/skills']);
    expect(location.path()).toBe('/skills');
  });

  it('should navigate to contact component', async () => {
    await router.navigate(['/contact']);
    expect(location.path()).toBe('/contact');
  });

  it('should navigate to login component', async () => {
    await router.navigate(['/login']);
    expect(location.path()).toBe('/login');
  });

  it('should redirect unknown routes to home', async () => {
    await router.navigate(['/unknown-route']);
    expect(location.path()).toBe('');
  });

  it('should protect shopping-list route with AuthGuard', async () => {
    authGuard.canActivate.and.returnValue(true);
    await router.navigate(['/shopping-list']);
    expect(authGuard.canActivate).toHaveBeenCalled();
  });

  it('should prevent access to shopping-list when not authenticated', async () => {
    authGuard.canActivate.and.returnValue(false);
    await router.navigate(['/shopping-list']);
    expect(authGuard.canActivate).toHaveBeenCalled();
    // When guard returns false, navigation should be prevented
    expect(location.path()).toBe('');
  });
});
