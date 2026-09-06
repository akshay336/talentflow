import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewSubmitComponent } from './review-submit.component';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('ReviewSubmitComponent', () => {
  let component: ReviewSubmitComponent;
  let fixture: ComponentFixture<ReviewSubmitComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSubmitComponent],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewSubmitComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit navigateStep when editSection is called', () => {
    spyOn(component.navigateStep, 'emit');
    component.editSection(2);
    expect(component.navigateStep.emit).toHaveBeenCalledWith(2);
  });

  it('should open payload preview modal with structured JSON', () => {
    component.openPayloadPreview();
    expect(component.showPayloadModal).toBeTrue();
    expect(component.jsonPreviewString).toContain('personalInformation');
  });
});
