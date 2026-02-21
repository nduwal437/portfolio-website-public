import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'updateActivity']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should not add Authorization header when no token exists', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should update activity on successful API response', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'ok' });

    expect(authService.updateActivity).toHaveBeenCalled();
  });

  it('should not update activity when no token exists', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'ok' });

    expect(authService.updateActivity).not.toHaveBeenCalled();
  });

  it('should not update activity on error response', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: () => {
        // expected
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(authService.updateActivity).not.toHaveBeenCalled();
  });

  it('should preserve existing headers when adding auth token', () => {
    authService.getToken.and.returnValue('test-token');

    httpClient.get('/api/test', { headers: { 'X-Custom': 'value' } }).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('X-Custom')).toBe('value');
    req.flush({});
  });

  it('should pass through request body unchanged', () => {
    authService.getToken.and.returnValue('test-token');
    const body = { name: 'Test Item' };

    httpClient.post('/api/test', body).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });
});
