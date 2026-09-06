import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(JobApplicationStoreService);
  private subs = new Subscription();

  form!: FormGroup;
  isSubmitted = false;

  get sscGroup(): FormGroup {
    return this.form.get('ssc') as FormGroup;
  }

  get hscGroup(): FormGroup {
    return this.form.get('hsc') as FormGroup;
  }

  get gradGroup(): FormGroup {
    return this.form.get('graduation') as FormGroup;
  }

  get postGradGroup(): FormGroup {
    return this.form.get('postGraduation') as FormGroup;
  }

  isFieldInvalid(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid && this.isSubmitted;
  }

  ngOnInit(): void {
    const data = this.store.snapshot.education;

    this.form = this.fb.group({
      includeGraduation: [data.includeGraduation || false],
      includePostGraduation: [data.includePostGraduation || false],
      ssc: this.createQualificationGroup(data.ssc, true),
      hsc: this.createQualificationGroup(data.hsc, true),
      graduation: this.createQualificationGroup(data.graduation, data.includeGraduation),
      postGraduation: this.createQualificationGroup(data.postGraduation, data.includePostGraduation)
    });

    this.updateGraduationValidators(data.includeGraduation);
    this.updatePostGradValidators(data.includePostGraduation);

    this.syncToStore();

    this.subs.add(
      this.form.valueChanges.subscribe(() => {
        this.syncToStore();
      })
    );

    this.subs.add(
      this.store.isStepAttempted$(2).subscribe(attempted => {
        this.isSubmitted = attempted;
      })
    );
  }

  private createQualificationGroup(item: any, isMandatory: boolean): FormGroup {
    return this.fb.group({
      id: [item.id],
      label: [item.label],
      isMandatory: [isMandatory],
      instituteName: [
        item.instituteName || '',
        isMandatory ? [Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)] : []
      ],
      boardOrUniversity: [
        item.boardOrUniversity || '',
        isMandatory ? [Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)] : []
      ],
      cgpaOrPercentage: [
        item.cgpaOrPercentage !== undefined ? item.cgpaOrPercentage : null,
        isMandatory ? [Validators.required, CustomValidators.validScore()] : [CustomValidators.validScore()]
      ],
      passingYear: [
        item.passingYear !== undefined ? item.passingYear : null,
        isMandatory ? [Validators.required, CustomValidators.validYear(1970)] : [CustomValidators.validYear(1970)]
      ]
    });
  }

  onToggleGraduation(): void {
    const included = this.form.get('includeGraduation')?.value;
    this.updateGraduationValidators(included);
  }

  onTogglePostGrad(): void {
    const included = this.form.get('includePostGraduation')?.value;
    this.updatePostGradValidators(included);
  }

  private updateGraduationValidators(enable: boolean): void {
    const controls = this.gradGroup.controls;
    if (enable) {
      controls['instituteName'].setValidators([Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)]);
      controls['boardOrUniversity'].setValidators([Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)]);
      controls['cgpaOrPercentage'].setValidators([Validators.required, CustomValidators.validScore()]);
      controls['passingYear'].setValidators([Validators.required, CustomValidators.validYear(1970)]);
    } else {
      controls['instituteName'].clearValidators();
      controls['boardOrUniversity'].clearValidators();
      controls['cgpaOrPercentage'].clearValidators();
      controls['passingYear'].clearValidators();
    }
    controls['instituteName'].updateValueAndValidity();
    controls['boardOrUniversity'].updateValueAndValidity();
    controls['cgpaOrPercentage'].updateValueAndValidity();
    controls['passingYear'].updateValueAndValidity();
  }

  private updatePostGradValidators(enable: boolean): void {
    const controls = this.postGradGroup.controls;
    if (enable) {
      controls['instituteName'].setValidators([Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)]);
      controls['boardOrUniversity'].setValidators([Validators.required, CustomValidators.requiredNoWhitespace(), CustomValidators.minTrimmedLength(2)]);
      controls['cgpaOrPercentage'].setValidators([Validators.required, CustomValidators.validScore()]);
      controls['passingYear'].setValidators([Validators.required, CustomValidators.validYear(1970)]);
    } else {
      controls['instituteName'].clearValidators();
      controls['boardOrUniversity'].clearValidators();
      controls['cgpaOrPercentage'].clearValidators();
      controls['passingYear'].clearValidators();
    }
    controls['instituteName'].updateValueAndValidity();
    controls['boardOrUniversity'].updateValueAndValidity();
    controls['cgpaOrPercentage'].updateValueAndValidity();
    controls['passingYear'].updateValueAndValidity();
  }

  private syncToStore(): void {
    const val = this.form.value;
    const isValid = this.form.valid;
    this.store.updateEducation(val, isValid);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
