import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:DvF6ymdH/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor(private http: HttpClient, private router: Router) { }
  
  /**
   * Login user with email and password
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.authToken) {
            this.setSession(response.authToken, email);
          }
        })
      );
  }
  
  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
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
   * Check if token exists in localStorage
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
