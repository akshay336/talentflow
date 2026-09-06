import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.isOpen = true;
    component.title = 'Test Confirmation Modal';
    fixture.detectChanges();
  });

  it('should create the modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the modal title when open', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Confirmation Modal');
  });

  it('should emit closed event when close button is clicked', () => {
    spyOn(component.closed, 'emit');
    component.closeModal();
    expect(component.isOpen).toBeFalse();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
