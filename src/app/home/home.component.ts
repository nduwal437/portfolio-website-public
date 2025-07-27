import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

interface ProjectPreview {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  link?: string;
}

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Personal information
  readonly name: string = 'Nikesh Duwal';
  readonly title: string = 'Full Stack Developer';
  readonly introduction: string = 'Passionate about creating innovative web solutions with modern technologies. I build scalable, user-friendly applications that make a difference.';
  
  // Authentication state
  isLoggedIn = false;
  loggedInUser = '';
  isMobileMenuOpen = false;

  // Portfolio content
  readonly featuredSkills: Skill[] = [
    { name: 'Angular', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'frontend' },
    { name: 'Node.js', level: 80, category: 'backend' },
    { name: 'Python', level: 75, category: 'backend' }
  ];

  readonly projectPreviews: ProjectPreview[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution built with Angular and Node.js, featuring real-time inventory management and secure payment processing.',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'completed',
      link: '#'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, file sharing, and team collaboration features.',
      technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL'],
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'AI-Powered Analytics Dashboard',
      description: 'An intelligent analytics platform that provides actionable insights using machine learning algorithms.',
      technologies: ['Vue.js', 'Python', 'TensorFlow', 'Docker'],
      status: 'planned'
    }
  ];

  constructor(private readonly authService: AuthService) { }

  ngOnInit(): void {
    // Subscribe to the authentication state with proper cleanup
    this.authService.isLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
        if (this.isLoggedIn) {
          this.loggedInUser = this.authService.getCurrentUser() || '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Close mobile menu when clicking outside or pressing escape
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mobileToggle = target.closest('.mobile-menu-toggle');
    const navbarLinks = target.closest('.navbar-links');
    
    if (!mobileToggle && !navbarLinks && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Prevent body scroll when mobile menu is open
  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scroll when menu is open (accessibility)
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  getStatusClass(status: ProjectPreview['status']): string {
    const statusClasses = {
      'completed': 'status-completed',
      'in-progress': 'status-in-progress',
      'planned': 'status-planned'
    };
    return statusClasses[status];
  }

  getSkillWidth(level: number): string {
    return `${level}%`;
  }

  trackByProjectId(index: number, project: ProjectPreview): number {
    return project.id;
  }

  trackBySkillName(index: number, skill: Skill): string {
    return skill.name;
  }
}
