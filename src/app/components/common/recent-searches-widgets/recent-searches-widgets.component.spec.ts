import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSearchesWidgetsComponent } from './recent-searches-widgets.component';

describe('RecentSearchesWidgetsComponent', () => {
  let component: RecentSearchesWidgetsComponent;
  let fixture: ComponentFixture<RecentSearchesWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentSearchesWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSearchesWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
