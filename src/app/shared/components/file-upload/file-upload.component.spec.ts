import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display dropzone when no file is uploaded', () => {
    component.fileMetadata = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.dropzone-area')).toBeTruthy();
    expect(compiled.textContent).toContain('Click to upload');
  });

  it('should display file preview card when file is uploaded', () => {
    component.fileMetadata = {
      fileName: 'resume.pdf',
      fileSize: 1024 * 500,
      fileType: 'application/pdf',
      formattedSize: '500 KB',
      uploadedAt: new Date().toISOString()
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.file-preview-card')).toBeTruthy();
    expect(compiled.textContent).toContain('resume.pdf');
  });

  it('should emit fileRemoved event when remove button is clicked', () => {
    spyOn(component.fileRemoved, 'emit');
    component.fileMetadata = {
      fileName: 'resume.pdf',
      fileSize: 1024 * 500,
      fileType: 'application/pdf',
      formattedSize: '500 KB',
      uploadedAt: new Date().toISOString()
    };
    fixture.detectChanges();

    component.removeFile();
    expect(component.fileRemoved.emit).toHaveBeenCalled();
  });
});
