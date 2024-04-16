import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsUsageStatusChartComponent } from './gts-usage-status-chart.component';

describe('GtsUsageStatusChartComponent', () => {
  let component: GtsUsageStatusChartComponent;
  let fixture: ComponentFixture<GtsUsageStatusChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtsUsageStatusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsUsageStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
