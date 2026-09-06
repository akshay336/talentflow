import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validates non-empty text that is not just whitespaces
   */
  static requiredNoWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').toString().trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { required: true };
    };
  }

  /**
   * Validates minimum text length excluding leading/trailing whitespaces
   */
  static minTrimmedLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; // let required validator handle empty
      const length = control.value.toString().trim().length;
      return length >= minLength ? null : { minlength: { requiredLength: minLength, actualLength: length } };
    };
  }

  /**
   * Validates standard 10 to 15 digit international/domestic phone numbers
   */
  static numericPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      // Allow optional +, digits, and reasonable length 10-15 digits
      const sanitized = control.value.toString().replace(/[\s\-()]/g, '');
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      return phoneRegex.test(sanitized) ? null : { invalidPhone: true };
    };
  }

  /**
   * Validates Passing Year (e.g., 1970 to Current Year)
   */
  static validYear(minYear: number = 1970, maxYear: number = new Date().getFullYear()): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) return null;
      const year = Number(control.value);
      if (isNaN(year) || !Number.isInteger(year)) {
        return { invalidYear: { message: 'Passing year must be a valid 4-digit number.' } };
      }
      if (year < minYear || year > maxYear) {
        return { invalidYearRange: { message: `Passing year must be between ${minYear} and ${maxYear}.` } };
      }
      return null;
    };
  }

  /**
   * Validates CGPA (0.00 - 10.00) or Percentage (0.00 - 100.00)
   */
  static validScore(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) return null;
      const score = Number(control.value);
      if (isNaN(score)) {
        return { invalidScore: { message: 'Score must be a valid numeric value.' } };
      }
      if (score < 0 || score > 100) {
        return { invalidScoreRange: { message: 'Score must be between 0 and 100 (percentage) or 0 and 10 (CGPA).' } };
      }
      return null;
    };
  }
}
