import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EducationComponent } from './education.component';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationComponent, ReactiveFormsModule],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate mandatory SSC and HSC rows', () => {
    component.form.patchValue({
      ssc: {
        instituteName: 'High School',
        boardOrUniversity: 'CBSE',
        cgpaOrPercentage: 85,
        passingYear: 2018
      },
      hsc: {
        instituteName: 'Junior College',
        boardOrUniversity: 'State Board',
        cgpaOrPercentage: 80,
        passingYear: 2020
      },
      includeGraduation: false,
      includePostGraduation: false
    });

    expect(component.form.valid).toBeTrue();
  });
});
