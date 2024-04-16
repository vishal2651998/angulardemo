import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-subscriber",
  templateUrl: "./subscriber.component.html",
  styleUrls: ["./subscriber.component.scss"],
})
export class SubscriberComponent implements AfterViewInit {
  @ViewChild("subscriberDiv") subscriberDiv: ElementRef;

  @Input() session: OT.Session;
  @Input() stream: OT.Stream;
  constructor() {}

  ngAfterViewInit() {
    const subscriber = this.session.subscribe(
      this.stream,
      this.subscriberDiv.nativeElement,
      {},
      (err) => {
        if (err) {
          alert(err.message);
        }
      }
    );
  }
}
