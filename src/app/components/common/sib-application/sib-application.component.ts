import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-sib-application',
  templateUrl: './sib-application.component.html',
  styleUrls: ['./sib-application.component.scss']
})
export class SibApplicationComponent implements OnInit {

  @Input() accordionList: any;
  @Input() applicationList: any;
  public panelOpenState = false;
  public appFlag: boolean = false;
  public loadFlag: boolean = true;
  public flag: boolean = true;
  public action = "view";
  public access = "sib";
  public emptyCont: string = "<i class='gray'>None</i>";
  
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.applicationList);
      this.loadFlag = false;
    }, 1000);
  }

  beforeParentPanelOpened(panel, appData) {
    /* if (this.appFlag && (panel.title != "General" || panel.title != "All")) {
      panel.isExpanded = true;
      if (panel.id == "app-info") {
        for (let v of appData) {
          v.isExpanded = true;
        }
      }
    } */
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
