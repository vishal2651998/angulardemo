import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSummaryTopComponent } from './dash-summary-top.component';

describe('DashSummaryTopComponent', () => {
  let component: DashSummaryTopComponent;
  let fixture: ComponentFixture<DashSummaryTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashSummaryTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSummaryTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
