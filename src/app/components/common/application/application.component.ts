import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-application",
  templateUrl: "./application.component.html",
  styleUrls: ["./application.component.scss"],
})
export class ApplicationComponent implements OnInit {
  @Input() accordionList: any;
  @Input() applicationList: any;
  @Input() access: string = "part";
  @Input() isTvs: boolean = false;
  @Input() partsList: any;
  panelOpenState = false;
  appFlag: boolean = false;
  public defAppType: string = "<i class='gray'>None</i>";

  constructor() {}

  ngOnInit(): void {
    console.log(this.applicationList, this.accordionList, this.partsList);
    if (this.applicationList.length == 1) {
      let appItem = this.applicationList[0];
      if (appItem.title == "General" || appItem.title == "All") {
        appItem.isDisabled = true;
        appItem.isExpanded = false;
      }
    }
    setTimeout(() => {
      console.log(this.applicationList);
      this.appFlag = this.applicationList.length > 0 ? true : false;

      if(this.appFlag){
        for (let applist in this.applicationList) {
          this.applicationList[applist].isExpanded = false;
        }

        let appItem = this.applicationList[0];
        if (appItem.title == "General" || appItem.title == "All") {
          this.applicationList[0].isDisabled = true;
          this.applicationList[0].isExpanded = false;
        }
        else{
          this.applicationList[0].isExpanded = true;
        }
      }

    }, 500);
  }

  beforeParentPanelOpened(panel, appData) {
    if (this.appFlag && (panel.title != "General" || panel.title != "All")) {
      panel.isExpanded = true;
      if (panel.id == "app-info") {
        for (let v of appData) {
          v.isExpanded = true;
        }
      }
    }
    console.log("Panel going to  open!");
  }

  beforeParentPanelClosed(panel, appData) {
    panel.isExpanded = false;
    if (panel.id == "app-info") {
      for (let v of appData) {
        v.isExpanded = false;
      }
    }
  }

  beforePanelOpened(panel) {
    panel.isExpanded = true;
    console.log("Panel going to  open!");
  }

  beforePanelClosed(panel) {
    panel.isExpanded = false;
    console.log("Panel going to close!");
  }

  afterPanelClosed() {
    console.log("Panel closed!");
  }

  afterPanelOpened() {
    console.log("Panel opened!");
  }
}
