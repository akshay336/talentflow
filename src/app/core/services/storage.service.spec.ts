import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get items accurately', () => {
    const data = { id: 123, name: 'Candidate' };
    service.setItem('test_key', data);

    const retrieved = service.getItem<{ id: number; name: string } | null>('test_key', null);
    expect(retrieved).toEqual(data);
  });

  it('should remove items correctly', () => {
    service.setItem('test_key', 'some value');
    service.removeItem('test_key');

    const retrieved = service.getItem('test_key', 'fallback');
    expect(retrieved).toBe('fallback');
  });
});
