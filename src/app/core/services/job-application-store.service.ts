import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  ApplicationState,
  Certification,
  EducationDetails,
  PersonalInformation,
  QualificationItem,
  ResumeMetadata,
  StepDefinition,
  SubmissionPayload,
  WorkExperience
} from '../models/job-application.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'talentflow_job_application_draft_v1';

export const INITIAL_QUALIFICATION_ITEM = (
  id: 'SSC' | 'HSC' | 'Graduation' | 'Post Graduation',
  label: string,
  isMandatory: boolean
): QualificationItem => ({
  id,
  label,
  isMandatory,
  instituteName: '',
  boardOrUniversity: '',
  cgpaOrPercentage: null,
  passingYear: null
});

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  currentStep: 1,
  personalInformation: {
    fullName: '',
    email: '',
    phone: '',
    address: ''
  },
  education: {
    ssc: INITIAL_QUALIFICATION_ITEM('SSC', '10th (SSC)', true),
    hsc: INITIAL_QUALIFICATION_ITEM('HSC', '12th (HSC / Diploma)', true),
    graduation: INITIAL_QUALIFICATION_ITEM('Graduation', 'Graduation / Bachelor Degree', false),
    postGraduation: INITIAL_QUALIFICATION_ITEM('Post Graduation', 'Post Graduation / Master Degree', false),
    includeGraduation: false,
    includePostGraduation: false
  },
  workExperience: [],
  isFresher: false,
  technicalSkills: [],
  certifications: [],
  coverLetter: '',
  resume: null,
  stepValidation: {
    step1Valid: false,
    step2Valid: false,
    step3Valid: true, // starts valid if 0 experiences or user is fresher
    step4Valid: false, // requires at least 1 technical skill
    step5Valid: false  // requires cover letter and resume
  },
  isSubmitting: false,
  isSubmitted: false
};

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    stepIndex: 1,
    title: 'Personal Info',
    subtitle: 'Contact & identity',
    icon: 'bi-person-badge',
    isCompleted: false,
    isValid: false
  },
  {
    stepIndex: 2,
    title: 'Education',
    subtitle: 'Academic background',
    icon: 'bi-mortarboard',
    isCompleted: false,
    isValid: false
  },
  {
    stepIndex: 3,
    title: 'Work Experience',
    subtitle: 'History & roles',
    icon: 'bi-briefcase',
    isCompleted: false,
    isValid: false
  },
  {
    stepIndex: 4,
    title: 'Skills & Certs',
    subtitle: 'Technical capabilities',
    icon: 'bi-stars',
    isCompleted: false,
    isValid: false
  },
  {
    stepIndex: 5,
    title: 'Additional Info',
    subtitle: 'Cover letter & resume',
    icon: 'bi-file-earmark-arrow-up',
    isCompleted: false,
    isValid: false
  },
  {
    stepIndex: 6,
    title: 'Review & Submit',
    subtitle: 'Final application check',
    icon: 'bi-check2-circle',
    isCompleted: false,
    isValid: false
  }
];

@Injectable({
  providedIn: 'root'
})
export class JobApplicationStoreService {
  private storageService = inject(StorageService);
  public toastService = inject(ToastService);

  private stateSubject: BehaviorSubject<ApplicationState>;
  public state$: Observable<ApplicationState>;

  // Tracks whether "Next Step" has been clicked for each step to reveal validation errors
  private stepAttemptedSubject = new BehaviorSubject<{ [step: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });
  public stepAttempted$ = this.stepAttemptedSubject.asObservable();

  constructor() {
    const savedState = this.storageService.getItem<ApplicationState | null>(STORAGE_KEY, null);
    const initial = savedState && !savedState.isSubmitted ? savedState : { ...INITIAL_APPLICATION_STATE };
    
    this.stateSubject = new BehaviorSubject<ApplicationState>(initial);
    this.state$ = this.stateSubject.asObservable();
  }

  // --- Snapshot & Selectors ---

  get snapshot(): ApplicationState {
    return this.stateSubject.value;
  }

  isStepAttempted(step: number): boolean {
    return !!this.stepAttemptedSubject.value[step];
  }

  isStepAttempted$(step: number): Observable<boolean> {
    return this.stepAttempted$.pipe(map(attempts => !!attempts[step]));
  }

  markStepAttempted(step: number, attempted: boolean = true): void {
    const current = this.stepAttemptedSubject.value;
    this.stepAttemptedSubject.next({
      ...current,
      [step]: attempted
    });
  }

  isCurrentStepValidSnapshot(): boolean {
    const s = this.snapshot;
    switch (s.currentStep) {
      case 1: return s.stepValidation.step1Valid;
      case 2: return s.stepValidation.step2Valid;
      case 3: return s.stepValidation.step3Valid;
      case 4: return s.stepValidation.step4Valid;
      case 5: return s.stepValidation.step5Valid;
      case 6: return this.isAllStepsValid(s);
      default: return false;
    }
  }

  get currentStep$(): Observable<number> {
    return this.state$.pipe(map(s => s.currentStep));
  }

  get personalInfo$(): Observable<PersonalInformation> {
    return this.state$.pipe(map(s => s.personalInformation));
  }

  get education$(): Observable<EducationDetails> {
    return this.state$.pipe(map(s => s.education));
  }

  get workExperience$(): Observable<{ records: WorkExperience[]; isFresher: boolean }> {
    return this.state$.pipe(map(s => ({ records: s.workExperience, isFresher: s.isFresher })));
  }

  get skillsAndCerts$(): Observable<{ skills: string[]; certs: Certification[] }> {
    return this.state$.pipe(map(s => ({ skills: s.technicalSkills, certs: s.certifications })));
  }

  get additionalInfo$(): Observable<{ coverLetter: string; resume: ResumeMetadata | null }> {
    return this.state$.pipe(map(s => ({ coverLetter: s.coverLetter, resume: s.resume })));
  }

  get stepValidation$(): Observable<ApplicationState['stepValidation']> {
    return this.state$.pipe(map(s => s.stepValidation));
  }

  get isCurrentStepValid$(): Observable<boolean> {
    return this.state$.pipe(
      map(s => {
        switch (s.currentStep) {
          case 1: return s.stepValidation.step1Valid;
          case 2: return s.stepValidation.step2Valid;
          case 3: return s.stepValidation.step3Valid;
          case 4: return s.stepValidation.step4Valid;
          case 5: return s.stepValidation.step5Valid;
          case 6: return this.isAllStepsValid(s);
          default: return false;
        }
      })
    );
  }

  get progressPercentage$(): Observable<number> {
    return this.state$.pipe(
      map(s => {
        const completedCount = [
          s.stepValidation.step1Valid,
          s.stepValidation.step2Valid,
          s.stepValidation.step3Valid,
          s.stepValidation.step4Valid,
          s.stepValidation.step5Valid,
          s.isSubmitted
        ].filter(Boolean).length;
        return Math.round((completedCount / 6) * 100);
      })
    );
  }

  // --- Step Navigation & Mutations ---

  goToStep(step: number): void {
    if (step < 1 || step > 6) return;
    this.updateState({ currentStep: step });
  }

  validateAndAdvanceStep(): boolean {
    const current = this.snapshot.currentStep;
    const isCurrentValid = this.isCurrentStepValidSnapshot();

    if (!isCurrentValid) {
      this.markStepAttempted(current, true);
      this.toastService.error(
        'Required Fields Missing',
        'Please complete all mandatory fields in this step before proceeding.'
      );
      return false;
    }

    return this.nextStep();
  }

  nextStep(): boolean {
    const current = this.snapshot.currentStep;
    if (current < 6) {
      this.goToStep(current + 1);
      return true;
    }
    return false;
  }

  previousStep(): boolean {
    const current = this.snapshot.currentStep;
    if (current > 1) {
      this.goToStep(current - 1);
      return true;
    }
    return false;
  }

  // --- Step 1 Update ---
  updatePersonalInfo(data: PersonalInformation, isValid: boolean): void {
    this.updateState({
      personalInformation: { ...data },
      stepValidation: {
        ...this.snapshot.stepValidation,
        step1Valid: isValid
      }
    });
  }

  // --- Step 2 Update ---
  updateEducation(data: EducationDetails, isValid: boolean): void {
    this.updateState({
      education: { ...data },
      stepValidation: {
        ...this.snapshot.stepValidation,
        step2Valid: isValid
      }
    });
  }

  // --- Step 3 Update ---
  updateWorkExperience(records: WorkExperience[], isFresher: boolean, isValid: boolean): void {
    this.updateState({
      workExperience: [...records],
      isFresher,
      stepValidation: {
        ...this.snapshot.stepValidation,
        step3Valid: isValid
      }
    });
  }

  // --- Step 4 Update ---
  updateSkillsAndCertifications(skills: string[], certs: Certification[], isValid: boolean): void {
    this.updateState({
      technicalSkills: [...skills],
      certifications: [...certs],
      stepValidation: {
        ...this.snapshot.stepValidation,
        step4Valid: isValid
      }
    });
  }

  // --- Step 5 Update ---
  updateAdditionalInfo(coverLetter: string, resume: ResumeMetadata | null, isValid: boolean): void {
    this.updateState({
      coverLetter,
      resume,
      stepValidation: {
        ...this.snapshot.stepValidation,
        step5Valid: isValid
      }
    });
  }

  // --- Helper to verify overall application readiness ---
  isAllStepsValid(state: ApplicationState = this.snapshot): boolean {
    const v = state.stepValidation;
    return v.step1Valid && v.step2Valid && v.step3Valid && v.step4Valid && v.step5Valid;
  }

  // --- Manual Draft Save ---
  saveDraft(): void {
    this.storageService.setItem(STORAGE_KEY, this.snapshot);
    this.toastService.success('Draft Saved', 'Your application progress has been stored locally.');
  }

  // --- Submit Full Application ---
  submitApplication(): Promise<SubmissionPayload> {
    return new Promise((resolve, reject) => {
      const state = this.snapshot;

      if (state.isSubmitting) {
        return reject(new Error('Submission is already in progress.'));
      }

      if (!this.isAllStepsValid(state)) {
        this.toastService.error('Incomplete Application', 'Please ensure all required steps are completed and valid before submitting.');
        return reject(new Error('Validation failed for one or more steps.'));
      }

      // Set submitting state
      this.updateState({ isSubmitting: true });

      const applicationId = 'APP-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
      const submittedAt = new Date().toISOString();

      const payload: SubmissionPayload = {
        applicationId,
        submittedAt,
        candidate: {
          personal: { ...state.personalInformation },
          education: {
            ssc: { ...state.education.ssc },
            hsc: { ...state.education.hsc },
            graduation: state.education.includeGraduation ? { ...state.education.graduation } : undefined,
            postGraduation: state.education.includePostGraduation ? { ...state.education.postGraduation } : undefined
          },
          experience: {
            isFresher: state.isFresher,
            records: [...state.workExperience]
          },
          qualifications: {
            technicalSkills: [...state.technicalSkills],
            certifications: [...state.certifications]
          },
          additional: {
            coverLetter: state.coverLetter,
            resume: state.resume ? {
              fileName: state.resume.fileName,
              fileSize: state.resume.fileSize,
              fileType: state.resume.fileType
            } : null
          }
        }
      };

      // Simulate network request with 1.2s delay
      setTimeout(() => {
        // Output formatted submission data to the browser console as required by assignment specification
        console.group('%c🚀 [TalentFlow] SUBMISSION SUCCESSFUL', 'color: #059669; font-weight: bold; font-size: 14px;');
        console.log('Application ID:', applicationId);
        console.log('Submitted At:', submittedAt);
        console.log('Full Application Payload:', payload);
        console.groupEnd();

        this.updateState({
          isSubmitting: false,
          isSubmitted: true,
          submittedAt,
          applicationId
        });

        // Clear stored draft upon successful submission
        this.storageService.removeItem(STORAGE_KEY);
        this.toastService.success('Application Submitted!', `Your application (#${applicationId}) has been successfully recorded.`);

        resolve(payload);
      }, 1200);
    });
  }

  // --- Reset Entire Wizard ---
  resetApplication(): void {
    this.stepAttemptedSubject.next({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false
    });
    this.storageService.removeItem(STORAGE_KEY);
    this.stateSubject.next({
      ...INITIAL_APPLICATION_STATE,
      education: {
        ssc: INITIAL_QUALIFICATION_ITEM('SSC', '10th (SSC)', true),
        hsc: INITIAL_QUALIFICATION_ITEM('HSC', '12th (HSC / Diploma)', true),
        graduation: INITIAL_QUALIFICATION_ITEM('Graduation', 'Graduation / Bachelor Degree', false),
        postGraduation: INITIAL_QUALIFICATION_ITEM('Post Graduation', 'Post Graduation / Master Degree', false),
        includeGraduation: false,
        includePostGraduation: false
      }
    });
    this.toastService.info('Application Reset', 'Form has been reset to starting state.');
  }

  // --- Private Immutable State Updater ---
  private updateState(partial: Partial<ApplicationState>): void {
    const newState: ApplicationState = {
      ...this.snapshot,
      ...partial
    };
    this.stateSubject.next(newState);
    // Persist draft to local storage
    if (!newState.isSubmitted) {
      this.storageService.setItem(STORAGE_KEY, newState);
    }
  }
}
