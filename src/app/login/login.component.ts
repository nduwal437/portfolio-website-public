import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Conditional logging method that won't trigger debugger pauses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logError(message: string, error?: any): void {
    if (!environment.production) {
      // Use console.warn instead of console.error to avoid debugger pauses
      console.warn(message, error);
    }
  }

  onLogin(): void {
    // Simple validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Call the authentication service
    this.authService
      .login(this.email, this.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: error => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
          this.logError('Login error:', error);
        }
      });
  }
}
