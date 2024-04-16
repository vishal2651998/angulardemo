import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { ThreadDetailHeaderComponent } from "src/app/layouts/thread-detail-header/thread-detail-header.component";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { FaqListComponent } from "src/app/components/common/faq-list/faq-list.component";
import * as moment from "moment";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  threadHeaderRef: ThreadDetailHeaderComponent;
  sidebarRef: SidebarComponent;
  faqPageRef: FaqListComponent;

  public title: string = "FAQs";
  public bodyClass: string = "faq";
  public bodyClass1: string = "faq-list";
  public bodyElem;
  public footerElem;
  public apiInfo: Object;
  public sidebarActiveClass: Object;
  public newFlag: boolean = false;
  public msTeamAccess: boolean = false;
  public pageLoading: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public headTitle: string = "FAQs";
  public searchVal: string = "";
  public pageAccess: string = "faq";
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if(authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      this.newFlag = (this.roleId == 3) ? true : false;
      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };
      this.headerData = {
        access: this.pageAccess,
        pageName: this.pageAccess,
        newFlag: this.newFlag
      };
      this.apiInfo = {
        apiKey: this.apiKey,
        userId: this.userId,
        roleId: this.roleId,
        domainId: this.domainId
      }; 
      setTimeout(() => {
        this.pageLoading = false;
      }, 100);
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  headerCallback(response) {
    let data = response;
    this.threadHeaderRef = data.headerData;
    this.applySearch(data);
  }

  faqCallback(data) {
    this.faqPageRef = data;
  }

  menuNav(url) {}

  applySearch(data) {
    let action = data.action;
    console.log(action)
    switch(action) {
      case 'new':
        this.faqPageRef.addFaq()
        break;
      case 'search':
        break;  
    }
  }

}
