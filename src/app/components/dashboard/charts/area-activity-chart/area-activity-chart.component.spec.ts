import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaActivityChartComponent } from './area-activity-chart.component';

describe('AreaActivityChartComponent', () => {
  let component: AreaActivityChartComponent;
  let fixture: ComponentFixture<AreaActivityChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaActivityChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaActivityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
