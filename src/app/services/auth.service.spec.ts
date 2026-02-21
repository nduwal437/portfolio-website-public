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

  describe('isSessionValid', () => {
    it('should return false when no token exists', () => {
      localStorage.removeItem('authToken');

      expect(service.isSessionValid()).toBeFalse();
    });

    it('should return true when token exists with no lastActivity', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.removeItem('lastActivity');

      expect(service.isSessionValid()).toBeTrue();
    });

    it('should return true when last activity is within timeout', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('lastActivity', Date.now().toString());

      expect(service.isSessionValid()).toBeTrue();
    });

    it('should return false when last activity exceeds timeout', () => {
      localStorage.setItem('authToken', 'test-token');
      const expired = Date.now() - 61 * 60 * 1000; // 61 minutes ago
      localStorage.setItem('lastActivity', expired.toString());

      expect(service.isSessionValid()).toBeFalse();
    });

    it('should return false when lastActivity is not a valid number', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('lastActivity', 'invalid');

      expect(service.isSessionValid()).toBeFalse();
    });
  });

  describe('updateActivity', () => {
    it('should update lastActivity timestamp in localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.removeItem('lastActivity');

      service.updateActivity();

      expect(localStorage.getItem('lastActivity')).not.toBeNull();
      const storedTime = parseInt(localStorage.getItem('lastActivity')!, 10);
      expect(Date.now() - storedTime).toBeLessThan(1000);
    });

    it('should not update lastActivity when no token exists', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('lastActivity');

      service.updateActivity();

      expect(localStorage.getItem('lastActivity')).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('should clean up without errors', () => {
      expect(() => service.ngOnDestroy()).not.toThrow();
    });

    it('should clear inactivity timer', () => {
      const spy = spyOn(window, 'clearTimeout').and.callThrough();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const timer = ((service as any).inactivityTimer = setTimeout(() => {}, 100000));

      service.ngOnDestroy();

      expect(spy).toHaveBeenCalledWith(timer);
    });
  });

  describe('logout (extended)', () => {
    it('should clear lastActivity from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('lastActivity', Date.now().toString());

      service.logout();

      expect(localStorage.getItem('lastActivity')).toBeNull();
    });

    it('should clear inactivity timer on logout', () => {
      localStorage.setItem('authToken', 'test-token');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (service as any).inactivityTimer = setTimeout(() => {}, 100000);

      service.logout();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((service as any).inactivityTimer).toBeUndefined();
    });
  });
});
