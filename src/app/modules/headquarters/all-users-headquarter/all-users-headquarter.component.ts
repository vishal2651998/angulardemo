import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { UserListComponent } from '../../headquarters/user-list/user-list.component';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';

@Component({
  selector: 'app-all-users-headquarter',
  templateUrl: './all-users-headquarter.component.html',
  styleUrls: ['./all-users-headquarter.component.scss']
})
export class AllUsersHeadquarterComponent implements OnInit {

  @ViewChild("userComponent") userListComponentRef : UserListComponent
  userListPageRef: UserListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2:string = "profile";
  public bodyClass3:string = "image-cropper";
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  public bodyElem;
  sidebarRef: SidebarComponent;

  public headerData: Object;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  public pageAccess: string = "headquarters";
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  public sidebarActiveClass: Object;
  public headTitle: string = "Headquarters";
  public headerFlag: boolean = false;

  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;

  public apiKey: string = Constant.ApiKey;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;
  public dekraNetworkId: string = '';
  public dekraNetworkHqId: string = '';
  public locationFilter: string;

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

  regionName:string="";

  public userListFlag: boolean = false;
  public userPageData: Object;
  shopList: any = [];
  loadingShops: boolean = false;

  constructor(private router:Router, private titleService: Title,private modalService:NgbModal,private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    public headQuarterService: HeadquarterService,
    private route:ActivatedRoute
    ) { 
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.regionName =  event.url.split('/')[3];
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
    if(this.route.snapshot.queryParams && this.route.snapshot.queryParams.hqId){
      this.locationFilter = this.route.snapshot.queryParams.hqId + "h";
    }
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500);

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';
    this.restoreState();
    this.userListFlag = true; 
    this.userPageData = {
      roaccess: 'all-users',
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey,
      roleId: this.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: this.headQuarterService.currentShopName,
      shopId: this.headQuarterService.currentShopId,
    }      
    setTimeout(() => {    
      this.userListPageRef.restoreState();             
    }, 100);
    // this.getShopList()

  }

  shopSelectedId;
  shopSelectedName;
  isClearShop: boolean = false;
  onClear(val){
    this.isClearShop = true;
  }

  manageShopList(){
    if(this.isClearShop){
      this.isClearShop = false;
      this.locationFilter = '';
      this.shopSelectedId = null;
      this.shopSelectedName = null;
      this.shopList = [];
      this.filterData();
      return;
    }
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      userId: '',
      countryId: '',
      networkId: this.dekraNetworkId
    };

    let access;
    let filteredItems;
    let filteredNames;
    let filteredDate;
    let inputData = {};   

    // apiData["type"] = "36";
    access = "newthread";
    filteredItems = [this.shopSelectedId];
    filteredNames = [this.shopSelectedName];
    inputData = {
      actionApiName: "",
      actionQueryValues: "",
      selectionType: "single",
      field:'dekra-shopList',   
      title: "Shop Name",
      filteredItems: filteredItems,
      filteredLists: filteredNames,
      baseApiUrl: this.headQuarterService.dekraBaseUrl,
      apiUrl: this.headQuarterService.dekraBaseUrl+""+"network/shoplist",
    };
       
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.allowAdd = false;
    modalRef.componentInstance.access = access;      
    modalRef.componentInstance.inputData = inputData; 
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredNames;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove("certification-modal");
      this.bodyElem.classList.remove("profile-certificate");  
      modalRef.dismiss("Cross click");
      if(receivedService){
        this.shopSelectedId = receivedService[0].id;
        this.shopSelectedName = receivedService[0].name;
        this.shopList = [{ id:this.shopSelectedId, name: this.shopSelectedName }];
        this.locationFilter = receivedService[0].id;
        this.filterData();
      }
    });
  }

  filterData(){
    this.userListComponentRef.locationFilter  = this.locationFilter;
    this.userListComponentRef.itemOffset = 0;
    this.userListComponentRef.getUserList();
  }

  restoreState(){
    if(this.headQuarterService.userListState && this.headQuarterService.userListState.lastLocation == this.router.url){
      this.locationFilter = this.headQuarterService.userListState.locationFilter;
    }
  }

  getShopList(){
    this.loadingShops = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("networkId",this.user.networkId.toString());
    this.headQuarterService.getShopList(apiFormData).subscribe((res:any)=>{
      if(res && res.items && res.items.length > 0){
        this.shopList = [{id:'',name:'Select Shop'},...res.items];
      }else{
        this.shopList = [{id:'',name:'Select Shop'}];
      }
      this.getHqDetails()
    })
}

getHqDetails(){
  const apiFormData = new FormData();
  apiFormData.append("apiKey", this.apiKey);
  apiFormData.append("domainId", this.domainId);
  apiFormData.append("userId", this.userId);
  apiFormData.append("platform", '3');
  apiFormData.append("networkId", this.dekraNetworkId);
   this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
    this.loadingShops = false;
      if(response && response.data && response.data.hqInfo && response.data.hqInfo.length > 0 ){
       let hqs = response.data.hqInfo.map((e)=>{
          return {id:e.id+"h",name:e.name}
        })
        this.shopList = this.shopList.concat(hqs)
      }
    })
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
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;   
      default:    
      break;
    } 
     
  }


  back(step){
    if(step == 'Headquarters'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/network`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
  }

  userIndexListPageCallback(data){
    this.userListPageRef = data;
    this.itemTotal = this.userListPageRef.itemTotal;
    console.log(this.userListPageRef);
  }

  addUser(){
    this.userListComponentRef.openUserPOPUP("new");
  }

  


}
