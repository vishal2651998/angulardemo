import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { NgbTooltip, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { HeadquartersHomeComponent } from "src/app/components/common/headquarters-home/headquarters-home.component";
import * as moment from "moment";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild("ttparts") tooltip: NgbTooltip;
  subscription: Subscription = new Subscription();
  sidebarRef: SidebarComponent;
  headquartersPageRef: HeadquartersHomeComponent;

  public title: string = "Home";
  public bodyClass: string = "headquarters";
  public bodyClass1: string = "parts-list";
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public pageLoading: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public headTitle: string = "Headquarters";

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
  public loading: boolean = true;
  public searchVal: string = "";
  public pageAccess: string = "home";
  public isBlabk = false;
  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
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

   
    let dekradomainRPage = localStorage.getItem('dekradomainRPage');
    // if(dekradomainRPage == '1'){
    //   this.router.navigate(['/headquarters/network']);
    // }  

    localStorage.removeItem("searchValue");
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
   
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
      search: true,
      searchVal: "",
    };

    setTimeout(() => {
      console.log(this.headquartersPageRef)
      this.pageLoading = false;
      this.headquartersPageRef.getData();
    }, 100);

    this.bodyHeight = window.innerHeight;     
 
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
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case 'headquarters':
        this.router.navigate(["/headquarters/network"]);
        return false;
        break;
      case 'tools':
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
      break;
      case 'dekra-audit':
        this.router.navigate(["/headquarters/audit"]);
        return false;
      break;
      case 'facility-layout':
        this.router.navigate(["/headquarters/facility-layout"]);
        return false;
      break;
      case 'all-users':
        this.router.navigate(["/headquarters/all-users"]);
        return false;
      break;
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;
      default:        
      break;
    } 
  }

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
  }

  headquartersCallback(data) {
    console.log(data)
  }

}


