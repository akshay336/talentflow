import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { JobApplicationStoreService } from '../../../core/services/job-application-store.service';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.css'
})
export class FormErrorComponent {
  private store = inject(JobApplicationStoreService);

  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = 'This field';
  @Input() showAlways: boolean = false;
  @Input() step: number = 0;

  get shouldShow(): boolean {
    if (!this.control || !this.control.invalid) return false;
    if (this.showAlways) return true;
    const stepNumber = this.step || this.store.snapshot.currentStep;
    return this.store.isStepAttempted(stepNumber);
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    const errors = this.control.errors;

    if (errors['required'] || errors['requiredNoWhitespace']) {
      return `${this.fieldName} is required.`;
    }
    if (errors['minTrimmedLength'] || errors['minlength']) {
      const min = errors['minTrimmedLength']?.requiredLength || errors['minlength']?.requiredLength;
      return `${this.fieldName} must be at least ${min} characters.`;
    }
    if (errors['maxlength']) {
      return `${this.fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['email']) {
      return `Please enter a valid email address (e.g. name@domain.com).`;
    }
    if (errors['invalidPhone']) {
      return `Please enter a valid numeric phone number (10 to 15 digits).`;
    }
    if (errors['invalidYear']?.message) {
      return errors['invalidYear'].message;
    }
    if (errors['invalidYearRange']?.message) {
      return errors['invalidYearRange'].message;
    }
    if (errors['invalidScore']?.message) {
      return errors['invalidScore'].message;
    }
    if (errors['invalidScoreRange']?.message) {
      return errors['invalidScoreRange'].message;
    }
    if (errors['pattern']) {
      return `Invalid format for ${this.fieldName}.`;
    }

    return `${this.fieldName} is invalid.`;
  }
}

