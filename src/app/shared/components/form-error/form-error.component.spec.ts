import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormErrorComponent } from './form-error.component';

describe('FormErrorComponent', () => {
  let component: FormErrorComponent;
  let fixture: ComponentFixture<FormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display required error when control is invalid and touched', () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();
    component.control = control;
    component.fieldName = 'Full Name';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Full Name is required.');
  });

  it('should not display error when control is valid', () => {
    const control = new FormControl('Valid Input', [Validators.required]);
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.field-error-message')).toBeNull();
  });
});
