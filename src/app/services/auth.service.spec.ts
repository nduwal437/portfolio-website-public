import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    // Clear any timers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (service && (service as any).inactivityTimer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clearTimeout((service as any).inactivityTimer);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should successfully login user', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = {
        authToken: 'mock-token',
        user: { email: email }
      };

      service.login(email, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('authToken')).toBe('mock-token');
        expect(localStorage.getItem('user')).toBe(email);
      });

      const req = httpMock.expectOne(`${service['API_URL']}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      service.login(email, password).subscribe({
        next: () => fail('Should have failed'),
        error: error => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${service['API_URL']}/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear authentication data on logout', () => {
      // Setup authenticated state
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('user', 'test@example.com');
      localStorage.setItem('isLoggedIn', 'true');

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('isLoggedIn')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when user is logged in', done => {
      localStorage.setItem('authToken', 'test-token');

      service.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          expect(isLoggedIn).toBeTrue();
          done();
        }
      });

      // Trigger the subject update
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).isLoggedInSubject.next(true);
    });

    it('should return false when user is not logged in', done => {
      localStorage.removeItem('authToken');

      service.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          expect(isLoggedIn).toBeFalse();
          done();
        }
      });

      // Trigger the subject update
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).isLoggedInSubject.next(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user email', () => {
      const email = 'test@example.com';
      localStorage.setItem('user', email);
      expect(service.getCurrentUser()).toBe(email);
    });

    it('should return null when no user is logged in', () => {
      localStorage.removeItem('user');
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('token management', () => {
    it('should return auth token when available', () => {
      const token = 'test-token';
      localStorage.setItem('authToken', token);
      expect(service.getToken()).toBe(token);
    });

    it('should return null when no token available', () => {
      localStorage.removeItem('authToken');
      expect(service.getToken()).toBeNull();
    });
  });

  describe('authentication state observable', () => {
    it('should emit authentication state changes', done => {
      service.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          expect(isLoggedIn).toBeTrue();
          done();
        }
      });

      // Simulate login
      localStorage.setItem('authToken', 'test-token');
      service['isLoggedInSubject'].next(true);
    });
  });
});
