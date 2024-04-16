import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingReportWidgtsComponent } from './landing-report-widgts.component';

describe('LandingReportWidgtsComponent', () => {
  let component: LandingReportWidgtsComponent;
  let fixture: ComponentFixture<LandingReportWidgtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingReportWidgtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingReportWidgtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
