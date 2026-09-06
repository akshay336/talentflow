import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobApplicationWizardComponent } from './job-application-wizard.component';
import { JobApplicationStoreService } from '../../core/services/job-application-store.service';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast.service';

describe('JobApplicationWizardComponent', () => {
  let component: JobApplicationWizardComponent;
  let fixture: ComponentFixture<JobApplicationWizardComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationWizardComponent],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(JobApplicationWizardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the wizard orchestrator component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize on Step 1', () => {
    expect(component.state.currentStep).toBe(1);
  });

  it('should switch steps when step navigation is called', () => {
    component.onStepSelected(2);
    expect(store.snapshot.currentStep).toBe(2);
  });
});
