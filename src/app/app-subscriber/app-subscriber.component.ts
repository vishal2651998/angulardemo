import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-app-subscriber',
  templateUrl: './app-subscriber.component.html',
  styleUrls: ['./app-subscriber.component.scss'],
})
export class AppSubscriberComponent implements AfterViewInit {
  isMicOn = false;
  isSubscriberAudioOn = true;

  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;

  constructor() { }

  ngAfterViewInit() {
    const subscriber = this.session.subscribe(
      this.stream,
      this.subscriberDiv.nativeElement,
      {
        style: {
          buttonDisplayMode: 'on',
          nameDisplayMode: 'on'
        }
      },
      (err) => {
        if (err) {
          alert(err.message);
        }
      }
    );
    if (!subscriber.stream.hasVideo) {
      subscriber.setStyle('videoDisabledDisplayMode', 'on');
    }

    subscriber.on({
      audioBlocked: (event) => {
        console.log(event);
      },
      audioUnblocked: (event) => {
        console.log(event);
      }
    });

    document.querySelectorAll('.OT_edge-bar-item.OT_mute').forEach(element => {
      element.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const subscribers = this.session.getSubscribersForStream(this.stream);
        subscribers.forEach(currentSubscriber => {
          if (currentSubscriber.id === target.parentElement.getAttribute('id')) {
            this.isSubscriberAudioOn = !this.isSubscriberAudioOn;
            currentSubscriber.subscribeToAudio(this.isSubscriberAudioOn);
          }
        });
      });
    });
  }

  toggleMic(): void {
    this.isMicOn = !this.isMicOn;
  }
}
