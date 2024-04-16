import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AddShopPopupComponent } from '../../shop/shop/add-shop/add-shop.component';
import { Title } from '@angular/platform-browser';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-all-shops-headquarter',
  templateUrl: './all-shops-headquarter.component.html',
  styleUrls: ['./all-shops-headquarter.component.scss']
})
export class AllShopsHeadquarterComponent implements OnInit , AfterViewInit {

  headquartersPageRef: HeadquartersListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  sidebarRef: SidebarComponent;

  viewType = "LIST"
  selectedTab = "SUMMARY"
  listShops: boolean = false;
  public bodyClass: string = "headquarters";
  public bodyClass1: string = "parts-list";
  public bodyElem;

  public sidebarActiveClass: Object;
  public headquartersFlag: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public featuredActionName: string = '';
  public innerHeight: number;
  public bodyHeight: number;
  public leftEmptyHeight: number;
  public regionName: string = "";

  public headTitle: string = "Headquarters";
  public pageAccess: string = "headquarters";
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public apiKey: string = Constant.ApiKey;
  public domainId;
  pageLimit:number = 25;
  pageOffset:number = 0;
  dekraNetworkId: string;
  user:any;
  userId:any;
  level:any;
  subLevel:any;
  shopListColumns = [
    // { field: 'parentId', header: 'Parent', columnpclass: 'w1 header thl-col-1' },
    { field: 'id', header: 'Location#', columnpclass: 'w1 header thl-col-2 col-sticky', sortName: 'id' },
    { field: 'name', header: 'Location Name', columnpclass: 'w2 header thl-col-1', sortName: 'name' },
    { field: 'city', header: 'City/State', columnpclass: 'w3 header thl-col-1'},
    { field: 'shopTypeName', header: 'Type', columnpclass: 'w4 header thl-col-1'},
    { field: 'dealerCode', header: 'Location Code', columnpclass: 'w5 header thl-col-1', sortName: 'dealerCode' },
    { field: 'usersCount', header: 'No. of Users', columnpclass: 'w6 header thl-col-1' },
    { field: 'levelOneName', header: 'Level 1', columnpclass: 'w7 header thl-col-1'},
    { field: 'levelTwoName', header: 'Level 2', columnpclass: 'w7 header thl-col-1'},
    { field: 'levelThreeName', header: 'Level 3', columnpclass: 'w7 header thl-col-1' },
    { field: '', header: '', columnpclass: 'w7 header thl-col-1' },
  ];

  shopList = [];
  attr1: any;
  attr2: any;
  attr3: any;
  hqDetails: any;
  loading: boolean;
  public tableRemoveHeight: number = 160;
  tableDiv?;
  shopFacility: boolean = false;
  lazy: boolean = false;
  public isFilterApplied: boolean;
  public sortFieldEvent: string;
  public sortOrderField = 0;
  public dataFilterEvent: any;
  constructor(private router: Router, private modalService: NgbModal,
    private route: ActivatedRoute, private titleService: Title,
    private authenticationService: AuthenticationService,
    private headQuarterService: HeadquarterService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.level = event.url.split('/')[3];
        this.subLevel = event.url.split('/')[4];
      }
    })
  }

  ngOnInit(): void {
    let url: any = this.router.url;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let currUrl = url.split('/');
    if(this.router.url.includes("facility")){
      this.shopFacility = true;
    }
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    if(this.route.snapshot.url.toString().includes('facility')){
      this.sidebarActiveClass = {
        page: "facility-layout",
        menu: "facility-layout",
      };
    }
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
      searchVal: "",
    };

    this.shopListColumns = [
      // { field: 'parentId', header: 'Parent', columnpclass: 'w1 shop-thl-col-1 col-sticky' },
      { field: 'id', header: 'Location#', columnpclass: 'w1 shop-thl-col-2 col-sticky', sortName: 'id' },
      { field: 'name', header: 'Location Name', columnpclass: 'w3 shop-thl-col-3', sortName: 'name' },
      { field: 'city', header: 'Ciry/State', columnpclass: 'w4 shop-thl-col-4'},
      { field: 'shopTypeName', header: 'Type', columnpclass: 'w5 shop-thl-col-5'},
      { field: 'dealerCode', header: 'Location Code', columnpclass: 'w5 shop-thl-col-5', sortName: 'dealerCode' },
      { field: 'usersCount', header: 'No. of Users', columnpclass: 'w3 shop-thl-col-3'},
      { field: 'levelOneName', header: this.attr1?.name, columnpclass: 'w5 shop-thl-col-5'},
      { field: 'levelTwoName', header: this.attr2?.name, columnpclass: 'w5 shop-thl-col-5'},
      { field: 'levelThreeName', header: this.attr3?.name, columnpclass: 'w5 shop-thl-col-5'},
      { field: '', header: '', columnpclass: 'w10 shop-thl-col-10 col-sticky' },
    ];

    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyHeight = window.innerHeight;
    setTimeout(() => {
      this.setScreenHeight();
    }, 500)
    this.getShopList(true);
  }
  
  ngAfterViewInit(){
   

  }

  lazyLoadingListner(){
    setTimeout((test = this) => {
      this.tableDiv = document.getElementsByClassName('p-datatable-scrollable-body')[0]
      if(this.tableDiv){
        this.tableDiv.addEventListener("scroll", function(event){
          let tableDiv:any = document.getElementsByClassName('p-datatable-scrollable-body')[0]
          console.log(tableDiv.scrollTop + tableDiv.offsetHeight>= tableDiv.scrollHeight)
          if(tableDiv.scrollTop + tableDiv.offsetHeight>= tableDiv.scrollHeight){
            test.pageOffset = test.pageOffset + 25;
            test.getShopList(false);
          }
      });
      }else{
        this.lazyLoadingListner()
      }
    }, 3000);
  }

  back(step) {
    if (step == 'Headquarters') {
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
  openAddShopModal() {
    const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    modalRef.componentInstance.selectedRegion = this.featuredActionName && this.featuredActionName.split('Region - ').length > 1 ? this.featuredActionName.split('Region - ')[1] : "";
    // modalRef.componentInstance.item = this.item
    modalRef.result.then((response) => {
      if(response && response.data && response.data.id ){
        this.getShopList(false,response.data.id)
      }else{
        this.getShopList(false)
      }
      this.listShops = true;
    },err=>{
      console.log(err)
    });
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 30;
    //let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 176);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
    this.tableRemoveHeight = headerHeight + 190;
  }

  getSelectedSidebar(event: any) {

  }

  changeView() {
    this.viewType = this.viewType == "MAP" ? "LIST" : "MAP";
  }
  viewShopEmmiter(event,navigateType="") {
    if(navigateType == "user"){
      this.router.navigate([`/headquarters/all-shops/shop/${event.id}/users`])
    }else{
      this.router.navigate([`/headquarters/all-shops/shop/${event.id}`])
    }
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

  getShopList(loading:boolean=true,id?){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append('sortFieldEvent', this.sortFieldEvent ? this.sortFieldEvent: '');
    apiFormData.append('sortOrderField', this.sortOrderField ? this.sortOrderField.toString() : '');
    apiFormData.append('dataFilterEvent', this.dataFilterEvent ? this.dataFilterEvent : '');
    // apiFormData.append("limit", this.pageLimit.toString());
    // apiFormData.append("offset",this.pageOffset.toString());
    if(id){
      apiFormData.append("id",id.toString());
      apiFormData.append("offset",'0');
    }else {
      apiFormData.append("limit", this.pageLimit.toString());
      apiFormData.append("offset",this.pageOffset.toString());
    }
    
    if(loading){
      this.loading = true
    }else{
      this.lazy = true;
    }
    this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      this.lazy = false;
      if(loading && !id){
        this.shopList = response.items;
        this.lazyLoadingListner();
      }else if(!loading && !id){
        // this.shopList = this.shopList.concat(response.items);
        response.items.forEach(e=>{
          this.shopList.push(e)
        })
      }
      else{
        if(response && id ){
          let updated = response.items.find(e=>e.id == id);
          let found = false;
          this.shopList.forEach((e,index)=>{
            if(e.id == id){
              found = true;
              this.shopList[index] = updated
            }
          })
          if(!found){
            this.shopList.unshift(updated)
          }
        }
      }
      this.getHqDetails(loading);
      setTimeout(() => {
        if (this.shopList.length !== 0) {
          let listItemHeight;
          listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
        
          if (
            response.items.length > 0 &&
            this.shopList.length != response.total &&
            this.innerHeight >= listItemHeight
          ) {             
            this.pageOffset = this.pageOffset + 25;
            this.getShopList(false);              
          } 
        }
      }, 1500);
    })

  }
  
  getHqDetails(loading:boolean=true){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
      this.hqDetails = response.data;
      this.setAttributeValues();
      if(loading){
        this.loading = false;
      }
    })
  }

  editShop(shopData){
      const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
      modalRef.componentInstance.editData = shopData;
      modalRef.result.then((response) => {
        if(response && response.data && response.data.id ){
          this.getShopList(false,response.data.id)
        }else{
          this.getShopList(false)
        }
      },err=>{
      
      });
      }

      setAttributeValues(){
        if(this.hqDetails){
          this.attr1 = this.hqDetails.attributesInfo.find(e=>e.displayOrder == 1);
          this.attr2 = this.hqDetails.attributesInfo.find(e=>e.displayOrder == 2);
          this.attr3 = this.hqDetails.attributesInfo.find(e=>e.displayOrder == 3);
          this.shopListColumns = [
            // { field: 'parentId', header: 'Parent', columnpclass: 'w1 shop-thl-col-1 col-sticky' },
            { field: 'id', header: 'Location#', columnpclass: 'w1 shop-thl-col-2 col-sticky', sortName: 'id' },
            { field: 'name', header: 'Location Name', columnpclass: 'w3 shop-thl-col-3', sortName: 'name'  },
            { field: 'address1', header: 'City/State', columnpclass: 'w4 shop-thl-col-4' },
            { field: 'shopType', header: 'Type', columnpclass: 'w5 shop-thl-col-5' },
            { field: 'dealerCode', header: 'Location Code', columnpclass: 'w5 shop-thl-col-5', sortName: 'dealerCode'  },
            { field: 'userId', header: 'No. of Users', columnpclass: 'w3 shop-thl-col-3' },
            { field: 'levelOneName', header: this.attr1?.name, columnpclass: 'w5 shop-thl-col-5' },
            { field: 'levelTwoName', header: this.attr2?.name, columnpclass: 'w5 shop-thl-col-5' },
            { field: 'levelThreeName', header: this.attr3?.name, columnpclass: 'w5 shop-thl-col-5' },
            { field: '', header: '', columnpclass: 'w10 shop-thl-col-10 col-sticky' },
          ];
          this.shopList.forEach(s => {
              let level1 = this.attr1.items.find(e=>e.id == s.levelOneId);
              let level2 = this.attr2.items.find(e=>e.id == s.levelTwoId);
              let level3 = this.attr3.items.find(e=>e.id == s.levelThreeId);
    
              if(level1){
                s["levelOneItem"] = level1.name;
              }
              if(level2){
                s["levelTwoItem"] = level2.name;
              }
              if(level3){
                s["levelThreeItem"] = level3.name;
              }
          });
        }
      }

      lazyLoad(event: LazyLoadEvent) {
        const keys = Object.keys(event.filters);
        keys.forEach((key: any) => {
          if (event.filters[key][0]?.value) {
            this.isFilterApplied = true;
          }
        });
        if (event.sortField) {
          this.isFilterApplied = true;
        }
        this.sortFieldEvent = event.sortField;
        this.sortOrderField = event.sortOrder;
        this.dataFilterEvent = event.filters ? JSON.stringify(event.filters) : '';
        if (this.isFilterApplied) {
          this.shopList = [];
          this.pageOffset = 0;
          this.getShopList(false);
        }
      }
}
