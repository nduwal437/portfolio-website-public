import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token
    const authToken = this.authService.getToken();

    // If token exists, clone the request and add the authorization header
    if (authToken) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });

      return next.handle(authReq).pipe(
        tap(event => {
          // Update activity on successful API responses
          if (event instanceof HttpResponse && event.ok) {
            this.authService.updateActivity();
          }
        })
      );
    }

    // If no token, proceed with the original request
    return next.handle(request);
  }
}
