import { Directive, ElementRef, HostListener } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';

@Directive({
  selector: '[appChatscroll]'
})
export class ChatscrollDirective {
  previousScrollHeightMinusTop: number; // the variable which stores the distance
  toReset = false;
  isFirstTime: boolean = false;
  readyFor: string;
  instantPushCount: number = 0;
  isNearBottom: boolean = true;
  @HostListener('scroll', ['$event.target'])

  onScroll(elem) {
    this.isNearBottom = this.isUserNearBottom(elem);
    if ((elem.offsetHeight + elem.scrollTop) >= (elem.scrollHeight - 20)) {
      console.log("It's Lit");
      this.instantPushCount = 0;
      this.updateCount()
    }
  }

  constructor(public elementRef: ElementRef, private chatService: ChatService) {
    this.previousScrollHeightMinusTop = 0;
    this.readyFor = 'up';
    this.restore();
  }

  reset() {
    this.previousScrollHeightMinusTop = 0;
    this.readyFor = 'up';
    this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
    // resetting the scroll position to bottom because that is where chats start.
  }

  restore() {
    if (this.isFirstTime == true) {
      this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
    }
    if (this.toReset) {
      if (this.readyFor === 'up') {
        this.elementRef.nativeElement.scrollTop =
          this.elementRef.nativeElement.scrollHeight -
          this.previousScrollHeightMinusTop;
        // restoring the scroll position to the one stored earlier
      }
      this.toReset = false;
    }

  }

  CheckScrollAtBottom() {
    console.log(this.elementRef.nativeElement.scrollTop + " : " + this.elementRef.nativeElement.scrollHeight);
    if (this.elementRef.nativeElement.scrollTop >= (this.elementRef.nativeElement.scrollHeight - 50)) {
      return true;
    }
    return false;
  }

  IsChatIsAboveBottom() {
    if (this.elementRef.nativeElement.scrollTop < (this.elementRef.nativeElement.scrollHeight - 500)) {
      return true;
    }
    return false;
  }

  public prepareFor(direction) {
    this.toReset = true;
    this.readyFor = direction || 'up';
    this.elementRef.nativeElement.scrollTop = !this.elementRef.nativeElement.scrollTop // check for scrollTop is zero or not
      ? this.elementRef.nativeElement.scrollTop + 1
      : this.elementRef.nativeElement.scrollTop;
    this.previousScrollHeightMinusTop =
      this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.scrollTop;
    // the current position is stored before new messages are loaded
  }

  isUserNearBottom(ele): boolean {
    const threshold = 150;
    const position = ele.scrollTop + ele.offsetHeight;
    const height = ele.scrollHeight;
    return position > height - threshold;
  }

  updateCount(): void {
    // Direct message remove count
    if (this.chatService.type == this.chatService.directMessageType) {
      for (let iar in this.chatService.dmstreamArr) {
        if (this.chatService.dmstreamArr[iar].Id == this.chatService.currentWorkstreamIdInfo) {
          this.chatService.dmstreamArr[iar].removeCount = true;
          this.chatService.totalNewDMMessage = this.chatService.totalNewDMMessage - this.chatService.dmstreamArr[iar].grCount;
          this.chatService.dmstreamArr[iar].grCount = 0
        }
      }
    }
    else if (this.chatService.type == this.chatService.groupType) { // Group message remove count
      for (let iar in this.chatService.grstreamArr) {
        if (this.chatService.grstreamArr[iar].Id == this.chatService.currentWorkstreamIdInfo) {
          this.chatService.grstreamArr[iar].removeCount = true;
          this.chatService.totalNewGroupMessage = this.chatService.totalNewGroupMessage - this.chatService.grstreamArr[iar].grCount;
          this.chatService.grstreamArr[iar].grCount = 0
        }
      }
    }
    else {
      for (let iar in this.chatService.workstreamArr) {
        if (this.chatService.workstreamArr[iar].wsId == this.chatService.currentWorkstreamIdInfo) {
          this.chatService.workstreamArr[iar].removeCount = true;
          this.chatService.totalNewWorkstreamMessage = this.chatService.totalNewWorkstreamMessage - Math.floor(this.chatService.workstreamArr[iar].wsCount);
          // this.chatService.workstreamArr[iar].wsCount = 0;
        }

      }
    }
  }
}
