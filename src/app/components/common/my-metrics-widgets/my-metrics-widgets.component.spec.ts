import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMetricsWidgetsComponent } from './my-metrics-widgets.component';

describe('MyMetricsWidgetsComponent', () => {
  let component: MyMetricsWidgetsComponent;
  let fixture: ComponentFixture<MyMetricsWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMetricsWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMetricsWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
