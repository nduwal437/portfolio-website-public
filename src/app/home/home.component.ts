import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string = 'Hello';
  title: string = 'Full Stack Developer';
  introduction: string = 'Welcome to my portfolio! I specialize in building modern web applications.';
  isLoggedIn: boolean = false;
  loggedInUser: string = '';
  isMobileMenuOpen: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Subscribe to the authentication state
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn) {
        this.loggedInUser = this.authService.getCurrentUser() || '';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
