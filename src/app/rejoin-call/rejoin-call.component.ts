import { Component, Input, OnInit } from '@angular/core';
import { CallsService } from '../controller/calls.service';

@Component({
  selector: 'app-rejoin-call',
  templateUrl: './rejoin-call.component.html',
  styleUrls: ['./rejoin-call.component.scss']
})
export class RejoinCallComponent implements OnInit {
  @Input() callEndedUserId: any;
  currentUserId: any;
  showLeftMessage: any;
  constructor(public call: CallsService) { }

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem("userId");
    if (this.callEndedUserId == this.currentUserId) {
      this.showLeftMessage = true;
    } else {
      this.showLeftMessage = false;
    }
  }

  rejoin(): void {
    localStorage.setItem('rejoin', 'true');
    window.location.reload();
  }

  endCall(): void {
    this.call.session.disconnect();
    window.close();
  }

}
