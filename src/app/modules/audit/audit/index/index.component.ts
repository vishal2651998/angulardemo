import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { NgbTooltip, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { AuditListComponent } from "src/app/components/common/audit-list/audit-list.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild("ttparts") tooltip: NgbTooltip;
  subscription: Subscription = new Subscription();
  sidebarRef: SidebarComponent;
  auditPageRef: AuditListComponent;

  public title: string = "Audit";
  public bodyClass: string = "audit";
  public bodyClass1: string = "parts-list";
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public pageLoading: boolean = true;
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public headerData: Object;
  public headTitle: string = "Audit";

  public dashboardFlag: boolean = true;
  public listFlag: boolean = false;
  public detailFlag: boolean = false;
  public workFlowFlag: boolean = false;
  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public countryId;

  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;

  public createAccess: boolean = true;
  public resize: boolean = false;
  public loading: boolean = true;
  public headerCheck: string = "unchecked";
  public searchVal: string = "";
  public pageAccess: string = "audit";
  public dashView: boolean = true;
  
  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    localStorage.removeItem("searchValue");
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag =
    (this.domainId == "undefined" || this.domainId == undefined) &&
    (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
            
      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };

      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: false,
        searchVal: "",
      };

      setTimeout(() => {
        console.log(this.auditPageRef)
        this.pageLoading = false;
      }, 100);

      this.bodyHeight = window.innerHeight;     
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  // Nav Part Edit or View
  navPage(action, id) {
    let url;
    url = ""; 
    window.open(url, IsOpenNewTab.openNewTab);
  }

  menuNav(item) {
    console.log(item)
    console.log(this.sidebarRef)
    let section = item.slug;
    switch (section) {
      case 'dekra-audit':
        this.headTitle = "Audit";    
        break;
      default:
        this.headTitle = item.name;
        break;
    }    
  }

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
  }

  auditCallback(data) {
    console.log(data)
    let view = data.view;
    this.dashView = (view == 1) ? true : false;
  }

}
