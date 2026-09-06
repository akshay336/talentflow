import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkExperienceComponent } from './work-experience.component';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('WorkExperienceComponent', () => {
  let component: WorkExperienceComponent;
  let fixture: ComponentFixture<WorkExperienceComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkExperienceComponent, ReactiveFormsModule],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkExperienceComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should allow adding dynamic work experience rows', () => {
    const initialCount = component.experiences.length;
    component.addExperience();
    expect(component.experiences.length).toBe(initialCount + 1);
  });

  it('should allow removing a work experience row', () => {
    component.addExperience();
    const count = component.experiences.length;
    component.removeExperience(0);
    expect(component.experiences.length).toBe(count - 1);
  });
});
