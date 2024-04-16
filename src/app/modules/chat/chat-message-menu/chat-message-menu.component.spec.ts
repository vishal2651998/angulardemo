import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageMenuComponent } from './chat-message-menu.component';

describe('ChatMessageMenuComponent', () => {
  let component: ChatMessageMenuComponent;
  let fixture: ComponentFixture<ChatMessageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatMessageMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
