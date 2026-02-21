import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, fromEvent, merge } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private readonly API_URL = environment.apiBaseUrl + '/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private readonly INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  private activitySubscription?: Subscription;
  private lastActivity = Date.now();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.initializeInactivityDetection();
    this.checkAuthOnPageLoad();
  }

  ngOnDestroy(): void {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  /**
   * Login user with email and password
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.authToken) {
            this.setSession(response.authToken, email);
            this.updateLastActivityTimestamp();
            this.resetInactivityTimer();
          }
        })
      );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    // Clear the inactivity timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }

    // Clear all auth-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');

    this.isLoggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  /**
   * Store auth information
   */
  private setSession(token: string, user: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', user);
    this.isLoggedInSubject.next(true);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get current user email
   */
  getCurrentUser(): string | null {
    return localStorage.getItem('user');
  }

  /**
   * Check if current session is still valid
   */
  isSessionValid(): boolean {
    const token = this.getToken();
    const lastActivity = localStorage.getItem('lastActivity');

    if (!token) return false;

    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
      return timeSinceLastActivity <= this.INACTIVITY_TIMEOUT;
    }

    return true; // If no lastActivity timestamp, assume valid for now
  }

  /**
   * Manually trigger activity update (useful for API calls)
   */
  updateActivity(): void {
    this.updateLastActivityTimestamp();
    this.resetInactivityTimer();
  }

  /**
   * Check if token exists in localStorage
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Initialize inactivity detection
   */
  private initializeInactivityDetection(): void {
    if (typeof window === 'undefined') return; // SSR safety check

    // Activity events to monitor
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Create observable from activity events
    const activityStreams$ = activityEvents.map(event =>
      fromEvent(document, event)
    );

    // Merge all activity streams and throttle to avoid excessive calls
    this.activitySubscription = merge(...activityStreams$)
      .pipe(throttleTime(1000)) // Throttle to once per second
      .subscribe(() => {
        this.resetInactivityTimer();
      });

    // Start the initial timer
    this.resetInactivityTimer();
  }

  /**
   * Reset the inactivity timer
   */
  private resetInactivityTimer(): void {
    this.lastActivity = Date.now();

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Only set timer if user is logged in
    if (this.hasToken()) {
      this.ngZone.runOutsideAngular(() => {
        this.inactivityTimer = setTimeout(() => {
          this.ngZone.run(() => {
            this.handleInactivityLogout();
          });
        }, this.INACTIVITY_TIMEOUT);
      });
    }
  }

  /**
   * Handle logout due to inactivity
   */
  private handleInactivityLogout(): void {
    if (this.hasToken()) {
      console.warn('User logged out due to inactivity');
      this.logout();
    }
  }

  /**
   * Check authentication status on page load/refresh
   */
  private checkAuthOnPageLoad(): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const token = this.getToken();
    const lastActivity = localStorage.getItem('lastActivity');

    if (token && lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);

      // If more than 1 hour has passed since last activity, logout
      if (timeSinceLastActivity > this.INACTIVITY_TIMEOUT) {
        console.warn('Session expired due to inactivity');
        this.logout();
        return;
      }
    }

    // Update last activity timestamp
    this.updateLastActivityTimestamp();
  }

  /**
   * Update last activity timestamp in localStorage
   */
  private updateLastActivityTimestamp(): void {
    if (this.hasToken()) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }
}
