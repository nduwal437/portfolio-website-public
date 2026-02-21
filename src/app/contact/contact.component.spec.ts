import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render contact form with all required fields', () => {
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]'));
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]'));
    const subjectInput = fixture.debugElement.query(By.css('input[name="subject"]'));
    const messageTextarea = fixture.debugElement.query(By.css('textarea[name="message"]'));
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(subjectInput).toBeTruthy();
    expect(messageTextarea).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', async () => {
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]'));
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]'));
    const subjectInput = fixture.debugElement.query(By.css('input[name="subject"]'));
    const messageTextarea = fixture.debugElement.query(By.css('textarea[name="message"]'));

    // Fill out form with valid data
    nameInput.nativeElement.value = 'John Doe';
    nameInput.nativeElement.dispatchEvent(new Event('input'));
    
    emailInput.nativeElement.value = 'john@example.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    
    subjectInput.nativeElement.value = 'Test Subject';
    subjectInput.nativeElement.dispatchEvent(new Event('input'));
    
    messageTextarea.nativeElement.value = 'Test message content';
    messageTextarea.nativeElement.dispatchEvent(new Event('input'));

    await fixture.whenStable();
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeFalse();
  });

  it('should have proper form labels for accessibility', () => {
    const nameLabel = fixture.debugElement.query(By.css('label[for="name"]'));
    const emailLabel = fixture.debugElement.query(By.css('label[for="email"]'));
    const subjectLabel = fixture.debugElement.query(By.css('label[for="subject"]'));
    const messageLabel = fixture.debugElement.query(By.css('label[for="message"]'));

    expect(nameLabel.nativeElement.textContent.trim()).toBe('Name');
    expect(emailLabel.nativeElement.textContent.trim()).toBe('Email');
    expect(subjectLabel.nativeElement.textContent.trim()).toBe('Subject');
    expect(messageLabel.nativeElement.textContent.trim()).toBe('Message');
  });

  it('should validate email field type', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]'));
    expect(emailInput.nativeElement.type).toBe('email');
  });

  it('should mark required fields as required', () => {
    const requiredFields = fixture.debugElement.queryAll(By.css('[required]'));
    expect(requiredFields.length).toBe(4); // name, email, subject, message
  });
});
