import { Component, OnInit, OnDestroy } from "@angular/core";
import { ScrollTopService } from "src/app/services/scroll-top.service";

@Component({
  selector: "app-gts",
  templateUrl: "./gts.component.html",
  styleUrls: ["./gts.component.scss"],
})
export class GtsComponent implements OnInit, OnDestroy {
  public bodyClass: string = "gts";
  public bodyElem;

  constructor(private scrollTopService: ScrollTopService) { }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
  }
}
