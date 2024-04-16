import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { NgbTooltip, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { HeadquartersListComponent } from "src/app/components/common/headquarters-list/headquarters-list.component";
import { HeadquarterService } from 'src/app/services/headquarter.service';
import * as moment from "moment";
import { Subscription } from "rxjs";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AddShopPopupComponent } from "src/app/modules/shop/shop/add-shop/add-shop.component";
import { HeaderComponent } from "src/app/layouts/header/header.component";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild("ttparts") tooltip: NgbTooltip;
  @ViewChild("headerRef") headerRef: HeaderComponent;

  subscription: Subscription = new Subscription();
  sidebarRef: SidebarComponent;
  headquartersPageRef: HeadquartersListComponent;

  public title: string = "Headquarters";
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
  public pageAccess: string = "headquarters";
  public leftHeight: 100;
  public showFlag: boolean = false;
  public headquartersFlag: boolean = true;
  public featuredActionName: string = '';
  public leftEmptyHeight: number = 100;
  public selectedTab:string = "SUMMARY"
  public listShops:boolean = false;
  public selectedRoute:string = "HEADQUATERS"
  public routeParams:any
  public viewType="LIST"
  public item;
  networkName:string = "Network";
  
  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private modalService: NgbModal,
    public headQuarterService: HeadquarterService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - Network"
    );
  }

  ngOnInit(): void {
    localStorage.removeItem("searchValue");
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    if (localStorage.getItem("networkName") !== null) {
      this.networkName = localStorage.getItem('networkName');
    }else{
      this.networkName = "Network";
    }
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
      this.pageLoading = false;
      this.headquartersPageRef.getData();  
      setTimeout(() => {
      this.showFlag = true;  
      }, 1000);  
    }, 100);

    this.bodyHeight = window.innerHeight;     
 
  }

   // Set Screen Height
   setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.leftEmptyHeight = 0;
    this.leftEmptyHeight = headerHeight + 100;
    this.headquartersPageRef.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 85;   
   }

  // Nav Part Edit or View
  navPage(action, id) {
    let url;
    url = ""; 
    window.open(url, IsOpenNewTab.openNewTab);
  }

  menuNav(item) {
    let section = item.slug;
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case 'home':
        this.router.navigate(["/headquarters/home"]);
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
    this.item = data
    this.headquartersFlag = data.headquartersFlag
    this.featuredActionName = data.featuredActionName;
    setTimeout(() => {
      this.setScreenHeight();
    }, 500);
  }

  changeInList(){
    if(this.headerRef){
      this.headerRef.getData();
    }
  }

  back(step){
    if(step == 'step1'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
  }

  changeTab(tabName:string){
    this.selectedTab = tabName;
  }
  selectNav(arg:string){
    this.selectedTab = arg;
  }

  changeRoute(routeName:string,routeParams?){
    this.selectedRoute = routeName;
    this.routeParams = routeParams;
  }

  changeView(){
    this.viewType = this.viewType == "MAP" ? "LIST" : "MAP";
  }

  viewShopEmmiter(event){
    this.changeRoute("SHOPDETAILS",event);
    this.selectedTab = "SUMMARY";
  }

  openAddShopModal() {
    const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    modalRef.componentInstance.selectedRegion = this.featuredActionName && this.featuredActionName.split('Region - ').length > 1 ?this.featuredActionName.split('Region - ')[1] : "";
    modalRef.componentInstance.item = this.item
    modalRef.result.then(() => {
      this.listShops = true;
    },err=>{
      
    });
  }

}

