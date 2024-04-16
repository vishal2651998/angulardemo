import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { AllNetworksListComponent } from '../../headquarters/all-networks-list/all-networks-list.component';
import { Constant } from 'src/app/common/constant/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-all-networks',
  templateUrl: './all-networks.component.html',
  styleUrls: ['./all-networks.component.scss']
})
export class AllNetworksComponent implements OnInit {
  toolsListPageRef: AllNetworksListComponent;
  regionName: string = "";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2: string = "profile";
  public bodyClass3: string = "image-cropper";
  public bodyClass4: string = "system-settings";
  public bodyClass: string = "parts-list";
  public accessPage: string = '';
  public accessModule: string = '';
  public bodyElem;
  sidebarRef: SidebarComponent;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  public sidebarActiveClass: Object;
  public headTitle: string = "Headquarters";
  public headerFlag: boolean = false;
  public headerData: Object;
  public pageAccess: string = "headquarters";

  public apiKey: string = Constant.ApiKey;
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId='';
  public platformId: string;
  public apiData: Object;
  public dekraNetworkId: string = '';
  public dekraNetworkHqId: string = '';
  public itemTotal: number = 0;
  public locationToolsFlag: boolean = false;

  public toolsListFlag: boolean = false;
  public toolsPageData: Object;
  canShowBreadcrumb: boolean = false;
  constructor(private router: Router,private titleService: Title,
    private authenticationService: AuthenticationService,
    public headQuarterService: HeadquarterService,
    public modalService: NgbModal, private readonly route: ActivatedRoute) { 
      this.canShowBreadcrumb = this.route.snapshot.data && !!this.route.snapshot.data['canShowBreadcrumb'] && this.route.snapshot.data['canShowBreadcrumb'];

      const currentUrl = this.router.url.split('/'); 
      if (currentUrl[2] == 'tools-equipment') {
        this.accessModule = 'tools';

        this.titleService.setTitle(
          localStorage.getItem("platformName") + " - Tools & Equipment"
        );

      }
      if (currentUrl[2] == 'all-tools') {
        this.accessModule = 'headquarters';

        this.titleService.setTitle(
          localStorage.getItem("platformName") + " - Network"
        );
      }
      this.accessPage = currentUrl[2];

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.regionName = event.url.split('/')[3];
      }
    })
  }
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
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
  }
  scroll = (event: any): void => {
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass4);
    window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';

    this.toolsListFlag = true; 
    this.toolsPageData = {
      parentPage : this.accessPage,
      currentPage: 'all-tools',
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey,
      roleId: this.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: '',
      shopId: '',
    }      
    setTimeout(() => {    
      this.toolsListPageRef.loading = true;                         
      this.toolsListPageRef.getToolsList();             
    }, 100);
    
  }
  back(step){
    if(step == 'Headquarters'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/network`]);
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
  }
  navigetToTool(id:number){
    this.router.navigate([`/headquarters/region/north/shop/1/tools-equipment/${id}`])
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
      case 'home':
        this.router.navigate(["/headquarters/home"]);
        return false;
      break;
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
      // case 'facility-layout':
      //   this.router.navigate(["/headquarters/facility-layout"]);
      //   return false;
      // break;
      case 'all-users':
        this.router.navigate(["/headquarters/all-users"]);
        return false;
      break;
      default:        
      break;
    } 
     
  }

  toolsIndexListPageCallback(data){
    this.toolsListPageRef = data;
    console.log(this.toolsListPageRef);
  }




}
