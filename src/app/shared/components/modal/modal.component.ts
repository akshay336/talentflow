import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() icon = '';
  @Input() size: 'md' | 'lg' = 'md';
  @Input() showFooter = true;
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  closeModal(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.closeModal();
    }
  }
}
