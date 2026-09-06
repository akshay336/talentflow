import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Certification } from '../../../../core/models/job-application.model';

@Component({
  selector: 'app-skills-qualifications',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './skills-qualifications.component.html',
  styleUrl: './skills-qualifications.component.css'
})
export class SkillsQualificationsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(JobApplicationStoreService);
  private toast = inject(ToastService);
  private subs = new Subscription();

  skills: string[] = [];
  newSkillInput = '';
  skillInputError = '';
  isSubmitted = false;

  suggestedSkills = [
    'Angular', 'TypeScript', 'RxJS', 'JavaScript (ES6+)',
    'HTML5 & CSS3', 'Bootstrap', 'REST APIs', 'Git & GitHub',
    'Unit Testing (Jasmine/Jest)', 'Web Performance'
  ];

  certForm!: FormGroup;

  get certifications(): FormArray {
    return this.certForm.get('certifications') as FormArray;
  }

  isFieldInvalid(control: AbstractControl | null | undefined): boolean {
    if (!control) return false;
    return control.invalid && this.isSubmitted;
  }

  ngOnInit(): void {
    const data = this.store.snapshot;
    this.skills = [...(data.technicalSkills || [])];

    this.certForm = this.fb.group({
      certifications: this.fb.array([])
    });

    if (data.certifications && data.certifications.length > 0) {
      data.certifications.forEach(c => {
        this.certifications.push(this.createCertGroup(c));
      });
    }

    this.syncToStore();

    this.subs.add(
      this.certForm.valueChanges.subscribe(() => {
        this.syncToStore();
      })
    );

    this.subs.add(
      this.store.isStepAttempted$(4).subscribe(attempted => {
        this.isSubmitted = attempted;
      })
    );
  }

  addSkill(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.skillInputError = '';
    const trimmed = (this.newSkillInput || '').trim();

    if (!trimmed) {
      this.skillInputError = 'Please enter a skill name.';
      return;
    }

    if (this.isSkillAdded(trimmed)) {
      this.skillInputError = `"${trimmed}" is already in your skills list.`;
      this.toast.warning('Duplicate Skill', `Skill "${trimmed}" is already added.`);
      return;
    }

    this.skills.push(trimmed);
    this.newSkillInput = '';
    this.syncToStore();
  }

  addSpecificSkill(skillName: string): void {
    if (!this.isSkillAdded(skillName)) {
      this.skills.push(skillName);
      this.syncToStore();
    }
  }

  isSkillAdded(skillName: string): boolean {
    const lower = skillName.trim().toLowerCase();
    return this.skills.some(s => s.trim().toLowerCase() === lower);
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
    this.syncToStore();
  }

  private createCertGroup(cert?: Partial<Certification>): FormGroup {
    return this.fb.group({
      id: [cert?.id || 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)],
      title: [cert?.title || '', [Validators.required, CustomValidators.requiredNoWhitespace()]],
      issuingOrg: [cert?.issuingOrg || '', [Validators.required, CustomValidators.requiredNoWhitespace()]],
      issueYear: [cert?.issueYear || null, [CustomValidators.validYear(1980)]]
    });
  }

  addCertification(): void {
    this.certifications.push(this.createCertGroup());
    this.syncToStore();
  }

  removeCertification(index: number): void {
    this.certifications.removeAt(index);
    this.syncToStore();
  }

  private syncToStore(): void {
    const rawCerts = this.certifications.value as Certification[];
    const isCertsValid = this.certForm.valid;
    const hasAtLeastOneSkill = this.skills.length >= 1;
    const isValid = hasAtLeastOneSkill && isCertsValid;

    this.store.updateSkillsAndCertifications(this.skills, rawCerts, isValid);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
