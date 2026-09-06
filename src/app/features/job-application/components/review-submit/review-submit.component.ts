import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { ApplicationState } from '../../../../core/models/job-application.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-review-submit',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './review-submit.component.html',
  styleUrl: './review-submit.component.css'
})
export class ReviewSubmitComponent implements OnInit {
  private store = inject(JobApplicationStoreService);

  @Output() navigateStep = new EventEmitter<number>();

  state!: ApplicationState;
  showPayloadModal = false;
  jsonPreviewString = '';

  get isAllValid(): boolean {
    return this.store.isAllStepsValid();
  }

  ngOnInit(): void {
    this.state = this.store.snapshot;
    this.store.state$.subscribe(s => {
      this.state = s;
    });
  }

  editSection(stepIndex: number): void {
    this.navigateStep.emit(stepIndex);
  }

  onSubmit(): void {
    this.store.submitApplication().catch(err => {
      console.error('Application submission error:', err);
    });
  }

  onStartNew(): void {
    this.store.resetApplication();
    this.navigateStep.emit(1);
  }

  openPayloadPreview(): void {
    const s = this.state;
    const previewData = {
      applicationId: s.applicationId || 'PREVIEW-APP-TEMP',
      submissionStatus: s.isSubmitted ? 'SUBMITTED' : 'DRAFT_REVIEW',
      personalInformation: s.personalInformation,
      education: s.education,
      workExperience: s.workExperience,
      technicalSkills: s.technicalSkills,
      certifications: s.certifications,
      coverLetter: s.coverLetter,
      resume: s.resume ? {
        fileName: s.resume.fileName,
        fileSize: s.resume.fileSize,
        fileType: s.resume.fileType
      } : null
    };

    this.jsonPreviewString = JSON.stringify(previewData, null, 2);
    this.showPayloadModal = true;
  }
}
