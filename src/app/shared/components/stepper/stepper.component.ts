import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepDefinition, StepValidationStatus } from '../../../core/models/job-application.model';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  @Input({ required: true }) steps: StepDefinition[] = [];
  @Input({ required: true }) currentStep: number = 1;
  @Input() validationStatus: StepValidationStatus | null = null;
  @Input() progressPercentage: number = 0;
  @Output() stepSelected = new EventEmitter<number>();

  get currentStepDef(): StepDefinition | undefined {
    return this.steps.find(s => s.stepIndex === this.currentStep);
  }

  isStepCompleted(stepIndex: number): boolean {
    if (!this.validationStatus) return false;
    switch (stepIndex) {
      case 1: return this.validationStatus.step1Valid;
      case 2: return this.validationStatus.step2Valid;
      case 3: return this.validationStatus.step3Valid;
      case 4: return this.validationStatus.step4Valid;
      case 5: return this.validationStatus.step5Valid;
      case 6: return false;
      default: return false;
    }
  }

  isStepClickable(stepIndex: number): boolean {
    if (stepIndex === this.currentStep) return true;
    if (stepIndex < this.currentStep) return true;
    if (stepIndex === this.currentStep + 1) {
      return this.isStepCompleted(this.currentStep);
    }
    return this.isStepCompleted(stepIndex);
  }

  onStepClick(stepIndex: number): void {
    if (this.isStepClickable(stepIndex)) {
      this.stepSelected.emit(stepIndex);
    }
  }
}
