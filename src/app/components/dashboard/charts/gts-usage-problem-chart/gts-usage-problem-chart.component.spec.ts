import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtsUsageProblemChartComponent } from './gts-usage-problem-chart.component';

describe('GtsUsageProblemChartComponent', () => {
  let component: GtsUsageProblemChartComponent;
  let fixture: ComponentFixture<GtsUsageProblemChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtsUsageProblemChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtsUsageProblemChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
