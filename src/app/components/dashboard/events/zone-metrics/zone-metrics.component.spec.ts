import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneMetricsComponent } from './zone-metrics.component';

describe('ZoneMetricsComponent', () => {
  let component: ZoneMetricsComponent;
  let fixture: ComponentFixture<ZoneMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
