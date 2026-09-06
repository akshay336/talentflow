import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { WorkExperience } from '../../../../core/models/job-application.model';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css'
})
export class WorkExperienceComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(JobApplicationStoreService);
  private subs = new Subscription();

  form!: FormGroup;
  isFresher = false;
  isSubmitted = false;

  get experiences(): FormArray {
    return this.form.get('experiences') as FormArray;
  }

  isFieldInvalid(control: AbstractControl | null | undefined): boolean {
    if (!control) return false;
    return control.invalid && this.isSubmitted;
  }

  ngOnInit(): void {
    const data = this.store.snapshot;
    this.isFresher = data.isFresher;

    this.form = this.fb.group({
      experiences: this.fb.array([])
    });

    if (data.workExperience && data.workExperience.length > 0) {
      data.workExperience.forEach(exp => {
        this.experiences.push(this.createExperienceGroup(exp));
      });
    } else if (!this.isFresher) {
      // Default to 1 empty row if not fresher
      this.addExperience();
    }

    this.syncToStore();

    this.subs.add(
      this.form.valueChanges.subscribe(() => {
        this.syncToStore();
      })
    );

    this.subs.add(
      this.store.isStepAttempted$(3).subscribe(attempted => {
        this.isSubmitted = attempted;
      })
    );
  }

  private createExperienceGroup(exp?: Partial<WorkExperience>): FormGroup {
    return this.fb.group({
      id: [exp?.id || 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)],
      companyName: [
        exp?.companyName || '',
        [Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)]
      ],
      jobTitle: [
        exp?.jobTitle || '',
        [Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)]
      ],
      duration: [
        exp?.duration || '',
        [Validators.required, CustomValidators.requiredNoWhitespace()]
      ],
      description: [exp?.description || '']
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
    this.syncToStore();
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
    this.syncToStore();
  }

  toggleFresher(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.isFresher = checked;
    if (checked) {
      this.experiences.clear();
    } else if (this.experiences.length === 0) {
      this.addExperience();
    }
    this.syncToStore();
  }

  setHasExperience(): void {
    this.isFresher = false;
    this.addExperience();
    this.syncToStore();
  }

  private syncToStore(): void {
    const rawList = this.experiences.value as WorkExperience[];
    const isValid = this.isFresher || (this.experiences.length > 0 && this.form.valid);
    this.store.updateWorkExperience(rawList, this.isFresher, isValid);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
