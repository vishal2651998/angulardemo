import { Component, OnInit, Input, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-new-edit-header',
  templateUrl: './new-edit-header.component.html',
  styleUrls: ['./new-edit-header.component.scss']
})
export class NewEditHeaderComponent implements OnInit {
  @Input() pageData;
  public displayLogoutPopup: boolean = false;
  public platformName:string = localStorage.getItem("platformName");
  public teamSystem:string = localStorage.getItem("teamSystem");
  public dialogData: any = {
    access: '',
    navUrl: '',
    platformName: this.platformName,
    teamSystem: this.teamSystem,
    visible: true
  };
  public sectionClass: string = "";

  constructor() { }

  ngOnInit(): void {
    console.log(this.pageData);
    if(this.pageData && this.pageData.section && this.pageData.section == 'manual') this.sectionClass = 'green';
    let platformId = localStorage.getItem('platformId');
    let webVersionApp: any = '';
    switch(platformId) {
      case '1':
        webVersionApp = environment.webVersionCollabtic;
        break;
      case '3':
        webVersionApp = environment.webVersionCBA;
        break;  
    }
    console.log(webVersionApp)
    localStorage.setItem('webVersionApp', webVersionApp);
  }

  @HostListener('document:visibilitychange', ['$event'])

  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    if (!document.hidden) {
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }
    }
  }

  closewindowPopup(data) {
    if(data.closeFlag) {
      window.close();
    }
    this.displayLogoutPopup = false;
    location.reload();
  }
}
