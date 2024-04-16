import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadViewReplyComponent } from './thread-view-reply.component';

describe('ThreadViewReplyComponent', () => {
  let component: ThreadViewReplyComponent;
  let fixture: ComponentFixture<ThreadViewReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadViewReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadViewReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
