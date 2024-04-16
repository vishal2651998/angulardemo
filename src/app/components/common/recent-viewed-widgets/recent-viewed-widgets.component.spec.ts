import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentViewedWidgetsComponent } from './recent-viewed-widgets.component';

describe('RecentViewedWidgetsComponent', () => {
  let component: RecentViewedWidgetsComponent;
  let fixture: ComponentFixture<RecentViewedWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentViewedWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentViewedWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
