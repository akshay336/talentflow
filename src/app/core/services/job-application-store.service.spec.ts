import { TestBed } from '@angular/core/testing';
import { JobApplicationStoreService } from './job-application-store.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

describe('JobApplicationStoreService', () => {
  let service: JobApplicationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobApplicationStoreService, StorageService, ToastService]
    });
    service = TestBed.inject(JobApplicationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize on step 1', () => {
    expect(service.snapshot.currentStep).toBe(1);
  });

  it('should update personal information and step 1 validity', () => {
    const personalInfo = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '9876543210',
      address: '742 Evergreen Terrace'
    };

    service.updatePersonalInfo(personalInfo, true);
    expect(service.snapshot.personalInformation.fullName).toBe('Jane Doe');
    expect(service.snapshot.stepValidation.step1Valid).toBeTrue();
  });

  it('should navigate between steps', () => {
    service.goToStep(3);
    expect(service.snapshot.currentStep).toBe(3);

    service.previousStep();
    expect(service.snapshot.currentStep).toBe(2);

    service.nextStep();
    expect(service.snapshot.currentStep).toBe(3);
  });
});
