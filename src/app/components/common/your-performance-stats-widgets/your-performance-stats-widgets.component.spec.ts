import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPerformanceStatsWidgetsComponent } from './your-performance-stats-widgets.component';

describe('YourPerformanceStatsWidgetsComponent', () => {
  let component: YourPerformanceStatsWidgetsComponent;
  let fixture: ComponentFixture<YourPerformanceStatsWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourPerformanceStatsWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPerformanceStatsWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
