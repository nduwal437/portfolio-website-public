import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth();
  }

  canActivateChild(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth();
  }

  private checkAuth(): boolean | UrlTree {
    // Check if user has a valid session
    if (this.authService.isSessionValid()) {
      // Update activity when accessing protected routes
      this.authService.updateActivity();
      return true;
    }

    // If session is invalid, clear any invalid tokens and redirect to home
    console.warn('Access denied: Invalid or expired session - redirecting to home');
    
    // Clear invalid session data
    if (this.authService.getToken()) {
      this.authService.logout();
    }
    
    // Return UrlTree for redirect instead of calling router.navigate
    // This is the recommended approach in modern Angular
    return this.router.createUrlTree(['/']);
  }
}
