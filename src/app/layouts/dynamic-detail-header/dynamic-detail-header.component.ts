import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { forumPageAccess, IsOpenNewTab, RedirectionPage, PlatFormType } from "src/app/common/constant/constant";
import { CommonService } from "src/app/services/common/common.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-dynamic-detail-header',
  templateUrl: './dynamic-detail-header.component.html',
  styleUrls: ['./dynamic-detail-header.component.scss']
})
export class DynamicDetailHeaderComponent implements OnInit , OnDestroy {
  @Input() pageData;
  @Input() otherSpecialData;
  @Output() threadHeaderActionEmit: EventEmitter<any> = new EventEmitter();
  public platformName = "Collabtic";
  public reopenThread: boolean = false;
  public displayLogoutPopup: boolean = false;
  public navUrl: string = "";
  public reopenTextFlag: boolean = false;
  public reminderShow: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public title: string = "";
  public editFlag: boolean = true;
  public loading: boolean = false;
  public techSubmmit: boolean = false;
  public newThreadView: boolean = false;
  public ppfrAvailable;
  public ppfrText: string = '';
  public ppfrAccess: boolean = false;
  public collabticDomain: boolean = false;
  subscription: Subscription = new Subscription();
  public dialogData: any = {
    access: '',
    navUrl: this.navUrl,
    platformName: '',
    teamSystem: this.teamSystem,
    visible: true
  };

  constructor(private commonApi: CommonService, private router: Router) {}
  @HostListener("document:visibilitychange", ["$event"])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  closewindowPopup(data) {
    this.displayLogoutPopup = false;
    if (this.teamSystem) {
      window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
    } else {
      if(data.closeFlag) {
        window.close();
      }
      location.reload();
    }
  }
  checkHiddenDocument() {
    if (document.hidden) {
    } else {
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }
      
      let notificationToggle = localStorage.getItem("notificationToggle");
      if(notificationToggle) {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'reload';
      }
    }
  }
  ngOnInit(): void {
    console.log(this.pageData);
    this.navUrl = this.pageData.pageUrl;  
    this.dialogData.platformName = this.platformName;
    this.dialogData.navUrl = this.platformName;
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    let platformId: any = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
  }
  closeWindow() {
    this.navUrl = this.pageData.pageUrl;
    console.log(this.navUrl);
    if (this.teamSystem) {
      window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
    } else {
      window.close();
    }
  }
  editPage(dataId, action='') {
    let url, surl, storage;
    let navOpenFlag = true;
    switch (this.pageData.pageName) {
      case "threads":
        navOpenFlag = false;
        storage = "threadNav";
        url = `threads/manage/edit/${dataId}`;
        let domainId:any = localStorage.getItem('domainId');
        let viewPath = (this.collabticDomain && domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
        let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
        surl = `${view}${dataId}`;
        break;
      case "knowledgearticles":
        storage = "knowledgearticles";
        navOpenFlag = false;
        url = `knowledgearticles/manage/edit/${dataId}`;
        surl = `knowledgearticles/view/${dataId}`;
        break;
      case "knowledge-base":
        storage = "knowledge-base";
        navOpenFlag = false;
        url = `knowledge-base/manage/edit/${dataId}`;
        surl = `knowledge-base/view/${dataId}`;
        break;
      case "gts":
        storage = "gts";
        navOpenFlag = false;
        url = "gts/edit/" + dataId;
        surl = "gts/view/" + dataId;
        let wsNav:any = localStorage.getItem('wsFlag');
        localStorage.setItem('wsNav', wsNav);
        setTimeout(() => {
          localStorage.removeItem('wsFlag');
        }, 100);
        break;
      case "document":
        storage = "docNav";
        url = `documents/manage/edit/${dataId}`;
        surl = `documents/view/${dataId}`;
        break;
      case "part":
        let actionUrl = action == "" ? "edit" : action;
        storage = "partNav";
        url = `parts/manage/${actionUrl}/${dataId}`;
        surl = `parts/view/${dataId}`;
        break;
      case "sib":
        let sactionUrl = action == "" ? "edit" : action;
        storage = "sibNav";
        url = `sib/manage/${sactionUrl}/${dataId}`;
        surl = `sib/view/${dataId}`;
        break;
      case "opportunity":
        navOpenFlag = false;
        storage = "opportunityNav";
        url = `${RedirectionPage.Opportunity}/manage/edit/${dataId}`;
        surl = `${RedirectionPage.Opportunity}/view/${dataId}`;
        break;  
      default:
        storage = "ancNav";
        url = `announcements/manage/edit/${dataId}`;
        surl = `announcements/view/${dataId}`;
        break;
    }
    localStorage.setItem(storage, surl);
    if (navOpenFlag) {
      if (this.teamSystem || action == "duplicate" || this.pageData.pageName == 'sib') {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    } else {
      this.router.navigate([url]);
    }
  }  

  threadHeaderEvent(event) {
    if ("reopen") {
      this.reopenTextFlag = true;
      setTimeout(() => {
        this.pageData.reopenThread = false;
        this.reopenTextFlag = false;
      }, 1500);
    }
    this.threadHeaderActionEmit.emit(event);
  }
  
  duplicateRecord(event) {
    this.threadHeaderActionEmit.emit(event);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

