import { Component, OnInit } from '@angular/core';
import { CallsService } from '../controller/calls.service';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'app-global-popup',
  templateUrl: './global-popup.component.html',
  styleUrls: ['./global-popup.component.scss']
})
export class GlobalPopupComponent implements OnInit {

  constructor(public notification: NotificationService, public call: CallsService) { }

  ngOnInit(): void {
    this.call.channel = new BroadcastChannel('collabtic_channel');
    this.call.channel.onmessage = (event) => {
      if (event.data.callAccepted || event.data.callRejected) {
        this.notification.videoCall = false;
        this.notification.incomingCallRing.pause();
      }
    }
  }

  acceptCall(): void {
    this.notification.videoCall = false;
    this.notification.incomingCallRing.pause();
    setTimeout(() => {
      const aurl = 'video-call';
      window.open(aurl, '_blank' + aurl).focus();
    }, 10);
    this.call.channel.postMessage({
      callAccepted: true
    })
  }

  rejectCall(): void {
    this.notification.videoCall = false;
    this.notification.videoCallData = null;
    this.call.incomingCall = false;
    this.call.outgoingCall = false;
    this.notification.incomingCallRing.pause();
    this.call.channel.postMessage({
      callRejected: true
    })
  }

  endCall() {
    this.call.outgoingCall = false;
    this.call.outgoingCallRing?.pause();
    localStorage.removeItem('videoCallDataSessionId');
    localStorage.removeItem('videoCallDataToken');
    localStorage.removeItem('videoCallUserId');
  }

}
