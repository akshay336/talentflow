import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(JobApplicationStoreService);
  private subs = new Subscription();

  form!: FormGroup;
  isSubmitted = false;

  get f() {
    return this.form.controls;
  }

  isFieldInvalid(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid && this.isSubmitted;
  }

  ngOnInit(): void {
    const currentData = this.store.snapshot.personalInformation;

    this.form = this.fb.group({
      fullName: [
        currentData.fullName || '',
        [Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(3)]
      ],
      email: [
        currentData.email || '',
        [Validators.required, Validators.email]
      ],
      phone: [
        currentData.phone || '',
        [Validators.required, CustomValidators.numericPhoneNumber()]
      ],
      address: [
        currentData.address || '',
        [Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(10)]
      ]
    });

    // Notify store immediately of initial validity
    this.store.updatePersonalInfo(this.form.value, this.form.valid);

    // Sync form value changes continuously to centralized state
    this.subs.add(
      this.form.valueChanges.subscribe(val => {
        this.store.updatePersonalInfo(val, this.form.valid);
      })
    );

    // Listen to Step 1 attempt state
    this.subs.add(
      this.store.isStepAttempted$(1).subscribe(attempted => {
        this.isSubmitted = attempted;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

