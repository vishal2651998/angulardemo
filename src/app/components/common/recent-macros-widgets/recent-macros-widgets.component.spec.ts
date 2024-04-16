import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentMacrosWidgetsComponent } from './recent-macros-widgets.component';

describe('RecentMacrosWidgetsComponent', () => {
  let component: RecentMacrosWidgetsComponent;
  let fixture: ComponentFixture<RecentMacrosWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentMacrosWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentMacrosWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
