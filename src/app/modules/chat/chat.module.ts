import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
//import { TestComponent } from './test/test.component';
import { SharedModule } from '../shared/shared.module';
import { LandingLeftSideMenuComponent } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { IndexComponent } from './chat-page/index/index.component';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { ChatscrollDirective } from 'src/app/common/directive/chatscroll.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropDirective } from 'src/app/common/directive/drag-drop.directive';
import { PopupComponent } from './chat-page/popup/popup.component';
import { ChatMessageMenuComponent } from './chat-message-menu/chat-message-menu.component';
import { LeaveGroupPopupComponent } from './chat-page/leave-group-popup/leave-group-popup.component';
import { ChatReplyMessageComponent } from './chat-reply-message/chat-reply-message.component';
import { ChatReplyMessagePopupComponent } from './chat-reply-message-popup/chat-reply-message-popup.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { ActiveUsersComponent } from './active-users/active-users.component';

@NgModule({
  declarations: [
    ChatPageComponent,
    IndexComponent,
    ChatscrollDirective,
    DragDropDirective,
    ChatMessageMenuComponent,
    LeaveGroupPopupComponent,
    ChatReplyMessageComponent,
    PublisherComponent,
    SubscriberComponent,
    ActiveUsersComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,

    NgxEmojiPickerModule,
    InfiniteScrollModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class ChatModule {}
