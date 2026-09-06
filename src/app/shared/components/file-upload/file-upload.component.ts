import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeMetadata } from '../../../core/models/job-application.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  @Input() fileMetadata: ResumeMetadata | null = null;
  @Input() maxFileSizeMB: number = 5;
  @Input() allowedExtensions: string[] = ['.pdf', '.doc', '.docx'];

  @Output() fileUploaded = new EventEmitter<ResumeMetadata>();
  @Output() fileRemoved = new EventEmitter<void>();

  isDragging = false;
  errorMessage = '';

  get allowedExtensionsString(): string {
    return this.allowedExtensions.join(',');
  }

  get maxSizeBytes(): number {
    return this.maxFileSizeMB * 1024 * 1024;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  triggerFilePicker(): void {
    const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = '';
      inputEl.click();
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    this.errorMessage = '';

    // 1. Validate File Extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      this.errorMessage = `Invalid file format (${ext || 'unknown'}). Please upload a PDF, DOC, or DOCX file.`;
      return;
    }

    // 2. Validate File Size
    if (file.size > this.maxSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      this.errorMessage = `File is too large (${sizeMb} MB). Maximum permitted file size is ${this.maxFileSizeMB} MB.`;
      return;
    }

    if (file.size === 0) {
      this.errorMessage = 'The selected file is empty. Please select a valid document.';
      return;
    }

    // Read file as Base64 data URL for preview and metadata storage
    const reader = new FileReader();
    reader.onload = () => {
      const metadata: ResumeMetadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || ext,
        formattedSize: this.formatBytes(file.size),
        uploadedAt: new Date().toISOString(),
        base64Data: reader.result as string
      };
      this.fileUploaded.emit(metadata);
    };
    reader.onerror = () => {
      this.errorMessage = 'Failed to read the file. Please try again.';
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.errorMessage = '';
    this.fileRemoved.emit();
  }

  isPdf(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

  isWord(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
