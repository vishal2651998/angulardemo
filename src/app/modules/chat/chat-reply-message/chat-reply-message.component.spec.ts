import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReplyMessageComponent } from './chat-reply-message.component';

describe('ChatReplyMessageComponent', () => {
  let component: ChatReplyMessageComponent;
  let fixture: ComponentFixture<ChatReplyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatReplyMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatReplyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
