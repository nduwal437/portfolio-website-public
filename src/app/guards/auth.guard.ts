import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    // Check if user has a valid session
    if (this.authService.isSessionValid()) {
      // Update activity when accessing protected routes
      this.authService.updateActivity();
      return true;
    }

    // If session is invalid, logout and redirect to home
    console.warn('Access denied: Invalid or expired session');
    this.authService.logout();
    return false;
  }
}
