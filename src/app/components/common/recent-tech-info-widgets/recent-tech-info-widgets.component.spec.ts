import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTechInfoWidgetsComponent } from './recent-tech-info-widgets.component';

describe('RecentTechInfoWidgetsComponent', () => {
  let component: RecentTechInfoWidgetsComponent;
  let fixture: ComponentFixture<RecentTechInfoWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentTechInfoWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentTechInfoWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
