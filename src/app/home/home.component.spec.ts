import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let cd: ChangeDetectorRef;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn', 'getCurrentUser']);
    authServiceSpy.isLoggedIn.and.returnValue(of(false));
    authServiceSpy.getCurrentUser.and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    cd = fixture.debugElement.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display personal information correctly', () => {
    expect(component.name).toBe('Nikesh Duwal');
    expect(component.title).toBe('Full Stack Developer');
    expect(component.introduction).toContain('Passionate about creating innovative web solutions');
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBeFalse();

    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTrue();

    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should close mobile menu', () => {
    component.isMobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should display login button when not logged in', () => {
    component.isLoggedIn = false;
    cd.markForCheck();
    fixture.detectChanges();

    const loginBtn = fixture.debugElement.query(By.css('.login-btn'));
    expect(loginBtn).toBeTruthy();
    expect(loginBtn.nativeElement.textContent.trim()).toBe('Login');
  });

  it('should display logout button and user info when logged in', () => {
    component.isLoggedIn = true;
    component.loggedInUser = 'test@example.com';
    cd.markForCheck();
    fixture.detectChanges();

    const logoutBtn = fixture.debugElement.query(By.css('.logout-btn'));
    const userInfo = fixture.debugElement.query(By.css('.user-info'));

    expect(logoutBtn).toBeTruthy();
    expect(userInfo).toBeTruthy();
    expect(userInfo.nativeElement.textContent).toContain('Welcome, test@example.com');
  });

  it('should show shopping list link when logged in', () => {
    component.isLoggedIn = true;
    cd.markForCheck();
    fixture.detectChanges();

    const shoppingListBtn = fixture.debugElement.query(By.css('.shopping-list-btn'));
    expect(shoppingListBtn).toBeTruthy();
  });

  it('should hide shopping list link when not logged in', () => {
    component.isLoggedIn = false;
    cd.markForCheck();
    fixture.detectChanges();

    const shoppingListBtn = fixture.debugElement.query(By.css('.shopping-list-btn'));
    expect(shoppingListBtn).toBeFalsy();
  });

  it('should call logout on auth service when logout clicked', () => {
    component.isLoggedIn = true;
    component.onLogout();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('should navigate to correct routes when nav links are clicked', () => {
    spyOn(router, 'navigate');

    const aboutLink = fixture.debugElement.query(By.css('a[routerLink="/about"]'));
    const projectsLink = fixture.debugElement.query(By.css('a[routerLink="/projects"]'));

    expect(aboutLink).toBeTruthy();
    expect(projectsLink).toBeTruthy();
  });

  it('should display hero action buttons', () => {
    const learnMoreBtn = fixture.debugElement.query(By.css('a[routerLink="/about"].btn-primary'));
    const viewWorkBtn = fixture.debugElement.query(By.css('a[routerLink="/projects"].btn-secondary'));

    expect(learnMoreBtn).toBeTruthy();
    expect(learnMoreBtn.nativeElement.textContent.trim()).toBe('Learn More About Me');

    expect(viewWorkBtn).toBeTruthy();
    expect(viewWorkBtn.nativeElement.textContent.trim()).toBe('View My Work');
  });

  it('should have correct ARIA attributes for accessibility', () => {
    const mobileMenuToggle = fixture.debugElement.query(By.css('.mobile-menu-toggle'));
    const navbar = fixture.debugElement.query(By.css('nav'));

    expect(mobileMenuToggle.nativeElement.getAttribute('aria-expanded')).toBe('false');
    expect(navbar.nativeElement.getAttribute('role')).toBe('navigation');
  });

  it('should close mobile menu when screen size changes to desktop', () => {
    component.isMobileMenuOpen = true;

    // Simulate window resize to desktop size
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    component.onWindowResize();

    expect(component.isMobileMenuOpen).toBeFalse();
  });
});
