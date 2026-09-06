import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkillsQualificationsComponent } from './skills-qualifications.component';
import { JobApplicationStoreService } from '../../../../core/services/job-application-store.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('SkillsQualificationsComponent', () => {
  let component: SkillsQualificationsComponent;
  let fixture: ComponentFixture<SkillsQualificationsComponent>;
  let store: JobApplicationStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsQualificationsComponent, FormsModule, ReactiveFormsModule],
      providers: [JobApplicationStoreService, StorageService, ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsQualificationsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(JobApplicationStoreService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new unique skill', () => {
    component.newSkillInput = 'Angular';
    component.addSkill();
    expect(component.skills).toContain('Angular');
    expect(component.newSkillInput).toBe('');
  });

  it('should prevent adding duplicate skills', () => {
    component.newSkillInput = 'Angular';
    component.addSkill();

    component.newSkillInput = 'angular';
    component.addSkill();

    expect(component.skills.length).toBe(1);
    expect(component.skillInputError).toContain('already in your skills list');
  });

  it('should allow removing a skill', () => {
    component.newSkillInput = 'TypeScript';
    component.addSkill();
    expect(component.skills).toContain('TypeScript');

    component.removeSkill(0);
    expect(component.skills.length).toBe(0);
  });
});
