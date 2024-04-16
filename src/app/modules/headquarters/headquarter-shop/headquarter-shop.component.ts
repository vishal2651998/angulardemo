import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AddShopPopupComponent } from '../../shop/shop/add-shop/add-shop.component';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-headquarter-shop',
  templateUrl: './headquarter-shop.component.html',
  styleUrls: ['./headquarter-shop.component.scss']
})
export class HeadquarterShopComponent implements OnInit {
  headquartersPageRef: HeadquartersListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  sidebarRef: SidebarComponent;

  viewType = "LIST"
  selectedTab = "SUMMARY"
  listShops:boolean = false;
  public bodyClass: string = "headquarters";
  public bodyElem;

  public sidebarActiveClass: Object;
  public headquartersFlag: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public featuredActionName: string = '';
  public innerHeight: number;
  public bodyHeight: number;
  public leftEmptyHeight: number;
  public regionName: string="";


  public emptyHeight: number;
  public nonEmptyHeight: number;
  public apiKey: string = Constant.ApiKey;
  public domainId;
  tableDiv?;
  pageLimit:number = 30;
  pageOffset:number = 0;
  dekraNetworkId: string;
  user:any;
  userId:any;
  level:any;
  subLevel:any;
  shopList:any=[];
  attribute:any;
  subAttribute:any;
  hqDetails: any;
  loading: boolean;
  public isFilterApplied: boolean;
  public sortFieldEvent: string;
  public sortOrderField = 0;
  public dataFilterEvent: any;
  constructor(private router: Router, private modalService: NgbModal,
    private route:ActivatedRoute,
    public headQuarterService: HeadquarterService,
    private authenticationService: AuthenticationService,
    ) {
      router.events.forEach((event) => {
        if(event instanceof NavigationEnd) {
          this.level = event.url.split('/')[3];
          this.subLevel = event.url.split('/')[4];
        }
    })
     }

  ngOnInit(): void {
    let url:any = this.router.url;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.getShopsList();  
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight(); 
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500)
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
  openAddShopModal(){
    const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    modalRef.componentInstance.subAttribute = this.subAttribute;
    modalRef.componentInstance.selectedRegion = this.featuredActionName && this.featuredActionName.split('Region - ').length > 1 ?this.featuredActionName.split('Region - ')[1] : "";
    modalRef.result.then((response) => {
      if(response && response.data && response.data.id ){
        this.getShopsList(false,response.data.id)
      }else{
        this.getShopsList(false)
      }
      this.listShops = true;
    },err=>{
      
    });
  }
  
   // Set Screen Height
   setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
  }

 getSelectedSidebar(event:any){

 }

 changeView(){
  this.viewType = this.viewType == "MAP" ? "LIST" : "MAP";
}
 viewShopEmmiter(event){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shop/${event.id}`])
}

editShopEmmiter(event){
  const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
      modalRef.componentInstance.editData = event;
      modalRef.componentInstance.subAttribute = this.subAttribute;
      modalRef.result.then((response) => {
        if(response && response.data && response.data.id ){
          this.getShopsList(false,response.data.id)
        }else{
          this.getShopsList(false)
        }
      },err=>{
      
      });
}

viewUsersEmmiter(event){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shop/${event.id}/users`])
}

lazyLoadingListner(){
  setTimeout((test = this) => {
    this.tableDiv = document.getElementsByClassName('p-datatable-scrollable-body')[0]
    this.tableDiv.addEventListener("scroll", function(event){
      let tableDiv:any = document.getElementsByClassName('p-datatable-scrollable-body')[0]
      console.log(tableDiv.scrollTop + tableDiv.offsetHeight>= tableDiv.scrollHeight)
      if(tableDiv.scrollTop + tableDiv.offsetHeight>= tableDiv.scrollHeight){
        test.pageOffset = test.pageOffset + 30;
        test.getShopsList(false);
      }
  });
  }, 2000);
}


getShopsList(loading:boolean=true,id?){
  const apiFormData = new FormData();
  apiFormData.append("apiKey", this.apiKey);
  apiFormData.append("domainId", this.domainId);
  apiFormData.append("userId", this.userId);
  apiFormData.append("platform", '3');
  apiFormData.append("networkId", this.dekraNetworkId);
  if(loading){
    this.loading = true;
  }
  this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
   this.hqDetails = response.data;
   let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
   this.attribute = attribute;
   this.headQuarterService.levelName = attribute.name;
   let subAttribute = attribute.items.find(e=>e.id == this.subLevel);
   this.subAttribute = subAttribute;
   this.headQuarterService.sublevelName = subAttribute.name;
  //  if(subAttribute && subAttribute.levelOneId && subAttribute.levelOneId !== 0){
  //    apiFormData.append("levelOneId", subAttribute.levelOneId);
  //  }
  //  if(subAttribute && subAttribute.levelTwoId && subAttribute.levelTwoId !== 0){
  //   apiFormData.append("levelTwoId", subAttribute.levelTwoId);
  // }
  // if(subAttribute && subAttribute.levelThreeId && subAttribute.levelThreeId !== 0){
  //   apiFormData.append("levelThreeId", subAttribute.levelThreeId);
  // }

  if(this.subAttribute && this.subAttribute.levelOneId !== 0){
    apiFormData.append("levelOneId", this.subAttribute.levelOneId);
  }
  if(this.subAttribute && this.subAttribute.levelTwoId !== 0){
   apiFormData.append("levelTwoId", this.subAttribute.levelTwoId);
 }
 if(this.subAttribute && this.subAttribute.levelThreeId !== 0){
   apiFormData.append("levelThreeId", this.subAttribute.levelThreeId);
 }

 if(id){
      apiFormData.append("id",id.toString());
      apiFormData.append("offset",'0');
    }else{
      apiFormData.append("limit", this.pageLimit.toString());
      apiFormData.append("offset",this.pageOffset.toString());
    }

    if (this.isFilterApplied) {
      apiFormData.append('sortFieldEvent', this.sortFieldEvent ? this.sortFieldEvent : '');
      apiFormData.append('sortOrderField', this.sortOrderField ? this.sortOrderField.toString() : '');
      apiFormData.append('dataFilterEvent', this.dataFilterEvent ? this.dataFilterEvent : '');
    }

    this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      if(loading && !id){
        this.loading = false;
        this.shopList = response.items;
        this.lazyLoadingListner();
        setTimeout(() => {
          if (this.shopList.length !== 0) {
            let listItemHeight;
            listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
          
            if (
              response.items.length > 0 &&
              this.shopList.length != response.total &&
              this.innerHeight >= listItemHeight
            ) {             
              this.pageOffset = this.pageOffset + 30;
              this.getShopsList(false);              
            } 
          }
        }, 1500);
      }
      else if(!loading && !id){
        // this.shopList = this.shopList.concat(response.items);
        if(!this.isFilterApplied) {
          response.items.forEach(e=>{
            this.shopList.push(e)
          })
        } else {
          this.shopList = response.items;
        }
        setTimeout(() => {
          if (this.shopList.length !== 0 && !this.isFilterApplied) {
            let listItemHeight;
            listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
          
            if (
              response.items.length > 0 &&
              this.shopList.length != response.total &&
              this.innerHeight >= listItemHeight
            ) {             
              this.pageOffset = this.pageOffset + 1;
              this.getShopsList(false);              
            } 
          }
        }, 1500);
        setTimeout(() => {
          this.isFilterApplied = false;
        }, 1600);
      }else{
        if(response && id ){
          let updated = response.items.find(e=>e.id == id);
          let found = false;
          this.shopList.forEach((e,index)=>{
            if(e.id == id){
              found = true;
              this.shopList[index] = updated;
            }
          })
          if(!found){
            this.shopList.push(updated);
          }
        }
      }
    });
  })
}

lazyLoad(event: any) {
  const keys = Object.keys(event.filters);
  keys.forEach((key: any) => {
    if (event.filters[key][0]?.value) {
      this.isFilterApplied = true;
    }
  });
  if (event.sortField) {
    this.isFilterApplied = true;
  };
  this.sortFieldEvent = event.sortField;
  this.sortOrderField = event.sortOrder;
  this.dataFilterEvent = event.filters ? JSON.stringify(event.filters) : '';
  if (this.isFilterApplied) {
    // this.shopList = [];
    this.pageOffset = 0;
    this.getShopsList(false);
  }
}

}
