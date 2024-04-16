import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsRatecardComponent } from './jobs-ratecard.component';

describe('JobsRatecardComponent', () => {
  let component: JobsRatecardComponent;
  let fixture: ComponentFixture<JobsRatecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsRatecardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsRatecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
