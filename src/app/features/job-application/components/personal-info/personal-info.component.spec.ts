import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalInfoComponent } from './personal-info.component';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoComponent, ReactiveFormsModule],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should be valid when valid personal info is entered', () => {
    component.form.patchValue({
      fullName: 'Johnathan Doe',
      email: 'johnathan.doe@example.com',
      phone: '9876543210',
      address: '123 Innovation Way, Suite 500'
    });

    expect(component.form.valid).toBeTrue();
  });

  it('should update the central store when form values change', () => {
    component.form.patchValue({
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      phone: '1234567890',
      address: '456 Silicon Avenue, CA'
    });

    expect(store.snapshot.personalInformation.fullName).toBe('Alice Smith');
    expect(store.snapshot.personalInformation.email).toBe('alice@example.com');
  });
});
