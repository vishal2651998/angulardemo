import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneActivityChartComponent } from './zone-activity-chart.component';

describe('ZoneActivityChartComponent', () => {
  let component: ZoneActivityChartComponent;
  let fixture: ComponentFixture<ZoneActivityChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneActivityChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneActivityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
