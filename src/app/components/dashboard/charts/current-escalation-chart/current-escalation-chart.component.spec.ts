import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentEscalationChartComponent } from './current-escalation-chart.component';

describe('CurrentEscalationChartComponent', () => {
  let component: CurrentEscalationChartComponent;
  let fixture: ComponentFixture<CurrentEscalationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentEscalationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentEscalationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
