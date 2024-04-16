import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReplyMessagePopupComponent } from './chat-reply-message-popup.component';

describe('ChatReplyMessagePopupComponent', () => {
  let component: ChatReplyMessagePopupComponent;
  let fixture: ComponentFixture<ChatReplyMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatReplyMessagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatReplyMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
