import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CallsService } from '../controller/calls.service';

@Component({
  selector: 'app-app-publisher',
  templateUrl: './app-publisher.component.html',
  styleUrls: ['./app-publisher.component.scss'],
})
export class AppPublisherComponent implements AfterViewInit {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publisher: OT.Publisher;
  publishing: boolean;

  constructor(private call: CallsService) {
    this.publishing = false;
  }

  ngAfterViewInit() {
    const OT = this.call.getOT;
    const user = JSON.parse(localStorage.getItem('user'));

    this.call.detectBrowser().then(response => {
      this.call.detectWebCam().then(response => {
        this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
          insertMode: 'append',
          name: `${user.Username} (Device name: ${response.browserName} ${(response.os) ? `- Operating system: ${response.os}` : ''})`,
          width: '100%',
          height: '100%',
          publishVideo: response,
          style: {
            buttonDisplayMode: 'on',
            nameDisplayMode: 'on'
          }
        });
      });
      console.log(this.session, this.session['isConnected']())
      if (this.session && this.session['isConnected']()) {
        this.publish();
        this.session.on('sessionConnected', () => this.publish());
      }

      this.call.publisher = this.publisher;
    })
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }
}
