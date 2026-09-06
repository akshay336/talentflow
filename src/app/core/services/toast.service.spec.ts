import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a success toast notification', (done) => {
    service.success('Saved', 'Profile saved successfully');

    service.toasts$.subscribe(toasts => {
      if (toasts.length > 0) {
        expect(toasts[0].title).toBe('Saved');
        expect(toasts[0].type).toBe('success');
        done();
      }
    });
  });
});
