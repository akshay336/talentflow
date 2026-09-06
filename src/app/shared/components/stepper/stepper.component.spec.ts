import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperComponent } from './stepper.component';
import { STEP_DEFINITIONS } from '../../../core/services/job-application-store.service';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    component.steps = STEP_DEFINITIONS;
    component.currentStep = 1;
    component.validationStatus = {
      step1Valid: true,
      step2Valid: false,
      step3Valid: false,
      step4Valid: false,
      step5Valid: false
    };
    fixture.detectChanges();
  });

  it('should create the stepper component', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight current active step', () => {
    component.currentStep = 2;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const activeStep = compiled.querySelector('.step-item.active');
    expect(activeStep).toBeTruthy();
    expect(activeStep?.textContent).toContain('Education');
  });

  it('should emit stepSelected event when a clickable step is clicked', () => {
    spyOn(component.stepSelected, 'emit');
    component.onStepClick(1);
    expect(component.stepSelected.emit).toHaveBeenCalledWith(1);
  });
});
