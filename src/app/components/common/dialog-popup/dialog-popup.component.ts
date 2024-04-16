import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IsOpenNewTab } from "src/app/common/constant/constant";

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.scss']
})
export class DialogPopupComponent implements OnInit {
  @Input() dialogData: any = [];
  @Output() closewindow: EventEmitter<any> = new EventEmitter();
  public displayPopup: boolean = true;
  public teamSystem: any;
  public navUrl: any;
  public platformName: any;
  public access: string = "";
  public assetPath: string = "assets/images";
  public landingPath: string = "landing-page";
  public bannerPath: string = "";
  public content: string = "";
  public buttonName: string = "";

  constructor() { }

  ngOnInit(): void {
    this.displayPopup = this.dialogData.visible;
    this.access = this.dialogData.access;
    this.platformName = this.dialogData.platformName;
    console.log(this.access)
    switch(this.access) {
      case 'logout':
        this.bannerPath = `${this.assetPath}/${this.landingPath}/logout-dialog-icon.png`;
        this.content = `You are logged out of ${this.platformName}`;
        this.buttonName = "OK";
        break;
      case 'reload':
        this.bannerPath = `${this.assetPath}/${this.landingPath}/reload-icon.png`;
        this.content = "To apply your updated settings to this site, reload this page.";
        this.buttonName = "Reload";
        break;
    }
  }

  closewindowPopup() {
    let flag = (this.access == 'logout') ? true : false;
    //if(!flag) {
      localStorage.removeItem('notificationToggle');
    //}
    let data = {
      access: this.access,
      close: flag
    };
    this.closewindow.emit(data);
  }

}
