import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentThreadTabComponent } from './recent-thread-tab.component';

describe('RecentThreadTabComponent', () => {
  let component: RecentThreadTabComponent;
  let fixture: ComponentFixture<RecentThreadTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentThreadTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentThreadTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
