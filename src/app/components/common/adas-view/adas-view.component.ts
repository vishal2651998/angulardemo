import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-adas-view',
  templateUrl: './adas-view.component.html',
  styleUrls: ['./adas-view.component.scss']
})
export class AdasViewComponent implements OnInit {
  @Input() accessType: string = "page";
  @Input() fileData: any = [];
  @Input() newPage: any = 0;

  public emptyList = [];
  public appList: any = [];
  public accordionList: any;
  public systemInfo: any;
  public referenceAccordion: any;
  public access: string = "adas";
  public action = "view";
  public attachmentLoading: boolean = true;
  public attachments: any;

  constructor() {
    this.accordionList = [{
      id: "app-info",
      class: "app-info",
      title: "Application",
      description: "",
      isDisabled: false,
      isExpanded: true
    }];
    this.referenceAccordion = [{
      id: "system",
      class: "system",
      title: "System Information",
      description: "",
      isDisabled: true,
      isExpanded: true
    }];
  }

  ngOnInit(): void {
    console.log(this.fileData)
    let appTitle = this.fileData.vehicleInfo.manufacturer[0].name;
    this.appList.push({
      class: "app_info",
      title: appTitle,
      appData: this.fileData.vehicleInfo,
      isDisabled: false,
      isExpanded: true
    });
    this.attachments = this.fileData.attachments;
    this.attachmentLoading = (this.attachments.length > 0) ? false : true;
    let userInfo = {
      createdBy: this.fileData.createdByStr,
      createdOn: this.fileData.createdDate,
      updatedBy: this.fileData.updatedByStr,
      updatedOn: this.fileData.updatedDate
    };
    this.systemInfo = {
      header: false,
      workstreams: this.fileData.workstreamInfo,
      userInfo: userInfo
    };
  }

  beforeParentPanelOpened(panel, appData){
    panel.isExpanded = true;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = true;
      }
    }
    console.log("Panel going to  open!");
  }

  beforeParentPanelClosed(panel, appData) {
    panel.isExpanded = false;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = false;
      }
    }
  }

  afterPanelClosed(){
    console.log("Panel closed!");
  }

  afterPanelOpened(){
    console.log("Panel opened!");
  }

}
