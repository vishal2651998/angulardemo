import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadViewReplyPublicComponent } from './thread-view-reply-public.component';

describe('ThreadViewReplyPublicComponent', () => {
  let component: ThreadViewReplyPublicComponent;
  let fixture: ComponentFixture<ThreadViewReplyPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadViewReplyPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadViewReplyPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
