import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechsupportMetricsComponent } from './techsupport-metrics.component';

describe('TechsupportMetricsComponent', () => {
  let component: TechsupportMetricsComponent;
  let fixture: ComponentFixture<TechsupportMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechsupportMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechsupportMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
