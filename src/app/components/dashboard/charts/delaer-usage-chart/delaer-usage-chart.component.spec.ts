import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaerUsageChartComponent } from './delaer-usage-chart.component';

describe('DelaerUsageChartComponent', () => {
  let component: DelaerUsageChartComponent;
  let fixture: ComponentFixture<DelaerUsageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelaerUsageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelaerUsageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
