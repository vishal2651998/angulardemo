import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenThreadChartComponent } from './open-thread-chart.component';

describe('OpenThreadChartComponent', () => {
  let component: OpenThreadChartComponent;
  let fixture: ComponentFixture<OpenThreadChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenThreadChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenThreadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
