import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'portfolio-website-public';
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.monitorAuthenticationStatus();
    this.handleRouteChanges();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Monitor authentication status changes
   */
  private monitorAuthenticationStatus(): void {
    this.authSubscription = this.authService.isLoggedIn().subscribe(isLoggedIn => {
      // If user is logged out and currently on a protected route, redirect to home
      if (!isLoggedIn && this.isProtectedRoute(this.router.url)) {
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Handle route changes and validate authentication
   */
  private handleRouteChanges(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEvent = event as NavigationEnd;
        // Check session validity on route changes
        if (this.isProtectedRoute(navigationEvent.url)) {
          if (!this.authService.isSessionValid()) {
            console.warn('Invalid session detected, redirecting to home');
            this.authService.logout();
          } else {
            // Update activity on protected route navigation
            this.authService.updateActivity();
          }
        }
      });
  }

  /**
   * Determine if a route is protected (requires authentication)
   */
  private isProtectedRoute(url: string): boolean {
    const protectedRoutes = ['/shopping-list'];
    return protectedRoutes.some(route => url.startsWith(route));
  }
}
