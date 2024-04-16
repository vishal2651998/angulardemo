import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaMetricsComponent } from './area-metrics.component';

describe('AreaMetricsComponent', () => {
  let component: AreaMetricsComponent;
  let fixture: ComponentFixture<AreaMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
