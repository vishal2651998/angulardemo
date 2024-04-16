import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CallsService } from '../controller/calls.service';
import { ActiveUsersComponent } from '../modules/chat/active-users/active-users.component';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class VideoCallComponent implements OnInit, AfterViewInit {
  public session: string;
  public token: string;
  public publisherScreen: OT.Publisher;
  public callEndedUserId: any;
  publisherStyle = {
    bottom: '5rem',
    right: '2rem',
    display: !this.call.sharing ? 'grid' : 'none',
    width: '150px',
    height: '150px',
    'z-index': 1000000000
  };

  constructor(
    public call: CallsService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.notification.videoCall = false;
    this.session = localStorage.getItem('videoCallDataSessionId');
    this.token = localStorage.getItem('videoCallDataToken');

    if (this.activatedRoute.snapshot.paramMap.get('sessionId')) {
      this.session = decodeURIComponent(this.activatedRoute.snapshot.paramMap.get('sessionId'));
      localStorage.setItem('videoCallDataSessionId', this.session);
    }

    if (this.activatedRoute.snapshot.paramMap.get('token')) {
      this.token = decodeURIComponent(this.activatedRoute.snapshot.paramMap.get('token'));
      localStorage.setItem('videoCallDataToken', this.token);
    }
    console.log(this.session, this.token);

    setTimeout(() => {
      this.receivedCall();
    }, 500);
  }

  ngAfterViewInit(): void {
    //
  }

  receivedCall() {
    this.call.initSession(this.session, this.token);
  }

  endCall(): void {
    if (this.call.isFullScreen) {
      this.toggleFullScreen();
    }
    this.call.disconnect();
    this.callEndedUserId = localStorage.getItem("userId");
  }

  closeWindow() {
    this.call.rejoin = false;
    window.close();
  }
  rejoin() {
    this.call.rejoin = false;
    this.receivedCall();
  }

  openActiveUsers(): void {

    const opentokCanvas = <HTMLCanvasElement>document.getElementById('opentok_canvas');
    const dialogRef = this.dialog.open(ActiveUsersComponent, {
      width: '600px',
      height: '700px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'overflow-hidden',
      data: { wsName: this.call.groupName }
    });

    if (!opentokCanvas) {
      return;
    }
    dialogRef.afterOpened().subscribe(() => {
      opentokCanvas.style.zIndex = '0';
    });

    dialogRef.afterClosed().subscribe(() => {
      opentokCanvas.style.zIndex = '1000000000000000000';
    });
  }


  stopShareScreen() {
    this.publisherScreen.destroy();
  }

  onResize(event) {
    if (document.getElementById('opentok_canvas')) {
      setTimeout(() => {
        // document.getElementById('opentok_canvas').style.height = '90vh';
        document.getElementById('opentok_canvas').style.top = '0px';
      }, 1000);
    }
  }

  toggleCamera() {
    this.call.toggleCamera();
  }

  getStyles() {
    const count = (this.call.streams.length > 3) ? 3 : this.call.streams.length;
    return {
      'grid-template-columns': `repeat(${count}, 1fr)`,
    };
  }

  toggleFullScreen() {
    this.call.isFullScreen = !this.call.isFullScreen;
    if (this.call.isFullScreen) {
      delete this.publisherStyle.bottom;
      delete this.publisherStyle.right;
      this.publisherStyle.height = '100%';
      this.publisherStyle.width = '100%';
    } else {
      this.publisherStyle.bottom = '5rem';
      this.publisherStyle.right = '2rem';
      this.publisherStyle.width = '150px';
      this.publisherStyle.height = '150px';
    }
    this.call.togglePublisherVideoElement();
    document.querySelector('.OT_name').classList.toggle('d-none');
    document.querySelector('.OT_edge-bar-item.OT_mute').classList.toggle('d-none');
  }
}
