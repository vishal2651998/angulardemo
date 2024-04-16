import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import * as OT from "@opentok/client";

const publish = () => {};

@Component({
  selector: "app-publisher",
  templateUrl: "./publisher.component.html",
  styleUrls: ["./publisher.component.scss"],
})
export class PublisherComponent implements AfterViewInit {
  @ViewChild("publisherDiv") publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publishing: Boolean = false;
  publisher: OT.Publisher;

  constructor() {}

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
      insertMode: "append",
    });
    if (this.session) {
      if (this.session["isConnected"]()) {
        this.publish();
      }
      this.session.on("sessionConnected", () => this.publish());
    }
  }
}
