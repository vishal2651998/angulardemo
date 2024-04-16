import { Injectable } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { NotificationService } from './services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public accorodianMenu = [];
  constructor(
    public chatService: ChatService,
    private notification: NotificationService,
  ) { }
}
