import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMetricsComponent } from './profile-metrics.component';

describe('ProfileMetricsComponent', () => {
  let component: ProfileMetricsComponent;
  let fixture: ComponentFixture<ProfileMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
