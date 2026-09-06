import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplicationStoreService, STEP_DEFINITIONS } from '../../core/services/job-application-store.service';
import { ApplicationState, StepDefinition } from '../../core/models/job-application.model';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

// Step Components
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { EducationComponent } from './components/education/education.component';
import { WorkExperienceComponent } from './components/work-experience/work-experience.component';
import { SkillsQualificationsComponent } from './components/skills-qualifications/skills-qualifications.component';
import { AdditionalInfoComponent } from './components/additional-info/additional-info.component';
import { ReviewSubmitComponent } from './components/review-submit/review-submit.component';

@Component({
  selector: 'app-job-application-wizard',
  standalone: true,
  imports: [
    CommonModule,
    StepperComponent,
    ToastContainerComponent,
    ModalComponent,
    PersonalInfoComponent,
    EducationComponent,
    WorkExperienceComponent,
    SkillsQualificationsComponent,
    AdditionalInfoComponent,
    ReviewSubmitComponent
  ],
  templateUrl: './job-application-wizard.component.html',
  styleUrl: './job-application-wizard.component.css'
})
export class JobApplicationWizardComponent implements OnInit {
  public store = inject(JobApplicationStoreService);

  steps: StepDefinition[] = STEP_DEFINITIONS;
  state!: ApplicationState;
  showResetModal = false;

  progress$ = this.store.progressPercentage$;
  isCurrentStepValid$ = this.store.isCurrentStepValid$;

  get isAllValid(): boolean {
    return this.store.isAllStepsValid();
  }

  ngOnInit(): void {
    this.state = this.store.snapshot;
    this.store.state$.subscribe(s => {
      this.state = s;
    });
  }

  onStepSelected(step: number): void {
    if (step <= this.state.currentStep) {
      this.store.goToStep(step);
      this.scrollToTop();
    } else {
      // Validate current step before advancing via stepper
      const isCurrentValid = this.store.isCurrentStepValidSnapshot();
      if (!isCurrentValid) {
        this.store.markStepAttempted(this.state.currentStep, true);
        this.store.toastService.error(
          'Required Fields Missing',
          'Please complete all mandatory fields in the current step before proceeding.'
        );
      } else {
        this.store.goToStep(step);
        this.scrollToTop();
      }
    }
  }

  onNext(): void {
    const advanced = this.store.validateAndAdvanceStep();
    if (advanced) {
      this.scrollToTop();
    }
  }

  onPrevious(): void {
    this.store.previousStep();
    this.scrollToTop();
  }

  saveDraft(): void {
    this.store.saveDraft();
  }

  confirmReset(): void {
    this.store.resetApplication();
    this.showResetModal = false;
    this.scrollToTop();
  }

  onSubmit(): void {
    this.store.submitApplication();
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
