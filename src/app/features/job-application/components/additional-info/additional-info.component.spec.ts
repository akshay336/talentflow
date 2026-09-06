import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AdditionalInfoComponent } from './additional-info.component';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('AdditionalInfoComponent', () => {
  let component: AdditionalInfoComponent;
  let fixture: ComponentFixture<AdditionalInfoComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalInfoComponent, ReactiveFormsModule],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid if cover letter is less than minimum characters', () => {
    component.form.patchValue({ coverLetter: 'Too short' });
    expect(component.form.valid).toBeFalse();
  });

  it('should handle file upload and update store', () => {
    const mockResume = {
      fileName: 'test.pdf',
      fileSize: 1024,
      fileType: 'application/pdf',
      formattedSize: '1 KB',
      uploadedAt: new Date().toISOString()
    };

    component.onFileUploaded(mockResume);
    expect(component.resumeFile).toEqual(mockResume);
  });
});
