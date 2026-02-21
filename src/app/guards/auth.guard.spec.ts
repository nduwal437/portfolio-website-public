import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isSessionValid',
      'updateActivity',
      'getToken',
      'logout'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user session is valid', () => {
    authService.isSessionValid.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(authService.updateActivity).toHaveBeenCalled();
  });

  it('should deny access and redirect to home when session is invalid', () => {
    authService.isSessionValid.and.returnValue(false);
    authService.getToken.and.returnValue(null);
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const result = guard.canActivate();

    expect(result).toBe(mockUrlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('should logout and redirect when session is invalid but token exists', () => {
    authService.isSessionValid.and.returnValue(false);
    authService.getToken.and.returnValue('invalid-token');
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    const result = guard.canActivate();

    expect(authService.logout).toHaveBeenCalled();
    expect(result).toBe(mockUrlTree);
  });

  it('should work the same for canActivateChild', () => {
    authService.isSessionValid.and.returnValue(true);

    const result = guard.canActivateChild();

    expect(result).toBeTrue();
    expect(authService.updateActivity).toHaveBeenCalled();
  });
});
