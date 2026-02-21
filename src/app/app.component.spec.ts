import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'isSessionValid',
      'updateActivity',
      'logout',
      'getToken'
    ]);
    authServiceSpy.isLoggedIn.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'portfolio-website-public'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('portfolio-website-public');
  });
});
