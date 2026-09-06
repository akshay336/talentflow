import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { ResumeMetadata } from '../../../../core/models/job-application.model';

@Component({
  selector: 'app-additional-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent, FormErrorComponent],
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.css'
})
export class AdditionalInfoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(JobApplicationStoreService);
  private subs = new Subscription();

  form!: FormGroup;
  resumeFile: ResumeMetadata | null = null;
  minCoverLength = 50;
  hasSubmittedOrTouchedResume = false;
  isSubmitted = false;

  get f() {
    return this.form.controls;
  }

  get currentLength(): number {
    return (this.form?.get('coverLetter')?.value || '').trim().length;
  }

  isFieldInvalid(control: AbstractControl | null | undefined): boolean {
    if (!control) return false;
    return control.invalid && this.isSubmitted;
  }

  ngOnInit(): void {
    const data = this.store.snapshot;
    this.resumeFile = data.resume;

    this.form = this.fb.group({
      coverLetter: [
        data.coverLetter || '',
        [
          Validators.required,
          CustomValidators.requiredNoWhitespace(),
          CustomValidators.minTrimmedLength(this.minCoverLength)
        ]
      ]
    });

    this.syncToStore();

    this.subs.add(
      this.form.valueChanges.subscribe(() => {
        this.syncToStore();
      })
    );

    this.subs.add(
      this.store.isStepAttempted$(5).subscribe(attempted => {
        this.isSubmitted = attempted;
      })
    );
  }

  onFileUploaded(metadata: ResumeMetadata): void {
    this.resumeFile = metadata;
    this.hasSubmittedOrTouchedResume = true;
    this.syncToStore();
  }

  onFileRemoved(): void {
    this.resumeFile = null;
    this.hasSubmittedOrTouchedResume = true;
    this.syncToStore();
  }

  private syncToStore(): void {
    const isCoverValid = this.form.valid;
    const hasResume = !!this.resumeFile;
    const isStepValid = isCoverValid && hasResume;

    this.store.updateAdditionalInfo(
      this.form.get('coverLetter')?.value || '',
      this.resumeFile,
      isStepValid
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
