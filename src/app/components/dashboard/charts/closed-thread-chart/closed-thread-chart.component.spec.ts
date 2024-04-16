import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedThreadChartComponent } from './closed-thread-chart.component';

describe('ClosedThreadChartComponent', () => {
  let component: ClosedThreadChartComponent;
  let fixture: ComponentFixture<ClosedThreadChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedThreadChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedThreadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
