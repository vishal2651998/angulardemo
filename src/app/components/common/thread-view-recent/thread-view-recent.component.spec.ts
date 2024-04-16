import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadViewRecentComponent } from './thread-view-recent.component';

describe('ThreadViewRecentComponent', () => {
  let component: ThreadViewRecentComponent;
  let fixture: ComponentFixture<ThreadViewRecentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadViewRecentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadViewRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
