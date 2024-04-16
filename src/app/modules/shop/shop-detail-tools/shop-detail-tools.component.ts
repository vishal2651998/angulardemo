import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Constant } from 'src/app/common/constant/constant';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { ToolsListComponent } from '../../headquarters/tools-list/tools-list.component';
import { AddToolsComponent } from '../../headquarters/add-tools/add-tools.component';
import { AddProductComponent } from '../../headquarters/add-product/add-product.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductHistoryComponent } from '../../headquarters/product-history/product-history.component';

@Component({
  selector: 'app-shop-detail-tools',
  templateUrl: './shop-detail-tools.component.html',
  styleUrls: ['./shop-detail-tools.component.scss']
})
export class ShopDetailToolsComponent implements OnInit {
  @ViewChild('productHistoryCom') productHistoryCom: ProductHistoryComponent;
  toolsListPageRef: ToolsListComponent;
  regionName:string="";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2:string = "profile";
  public bodyClass3:string = "image-cropper";
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  public bodyElem;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  level:string="";
  subLevel:string = "";
  shopId: string;
  currentAttribute: any;
  currentItem:any;
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;
  toolsData = {}
  toolsLocationPageData: any = []
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

  public toolsListFlag: boolean = false;
  public toolsPageData: Object;
  public opacityFlag: boolean = false;

  public locationToolsFlag: boolean = true;
  public productHistoryFlag: boolean = false;
  addProductFlag: boolean = false;
  selectedLocation:any
  addProductFinal: boolean = false;
  selectedProduct: any;
  selectedTool: any;
  selectedShop: any;

  constructor(
    private router:Router,
    private authenticationService: AuthenticationService,
    public headQuarterService: HeadquarterService,private modalService:NgbModal) {
      router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          if(event.url.includes("all-shops")){
            this.level =  "";
            this.subLevel =  "";    
            this.shopId = event.url.split('/')[4];    
          }else{
            this.level =  event.url.split('/')[3];
            this.subLevel =  event.url.split('/')[4];    
            this.shopId =  event.url.split('/')[6];     
          }
         }
      })
   }

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
  scroll = (event: any): void => {
  }

  viewProductHistory(loc,tool){
    this.productHistoryFlag = true;
    this.selectedLocation = loc
    this.selectedTool = tool
    this.toolsLocationPageData = tool;
    this.toolsListPageRef.toolsLocationPageData = tool
  }

  historyPageCallback(event){
    if(event == 'historyback'){
      this.productHistoryFlag = false;
      this.addProductFinal = false;
    }
  }

  ngOnInit(): void {
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.getHqDetails();
    this.getShopDetails();
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4);  
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
      parentPage : 'all-tools',
      currentPage: 'shop-tools',
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey,
      roleId: this.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: this.headQuarterService.currentShopName,
      shopId: this.headQuarterService.currentShopId,
    }
    
    this.toolsData =  this.toolsPageData = {
      parentPage : "all-tools",
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
      // this.toolsListPageRef.loading = true;             
      // this.toolsListPageRef.locationToolsFlag = false;             
      // this.toolsListPageRef.getToolList();              
    }, 100);

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
    if(step == 'Region'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
     this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shops`]);
       this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
       this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
    if(step == 'allShops'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
     this.router.navigate([`/headquarters/all-shops`]);
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
  }

  getShopDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("id", this.shopId);
     this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      if(response && response.items && response.items.length > 0 && response.items[0]){
        
        let resultData:any = [];
        resultData = response.items[0];
        this.selectedShop = response.items[0]
        // if(response.items.length > 0 && response.items[0].levelThreeId && this.shopId){
        //   this.level = "3";
        //   this.subLevel = response.items[0].levelThreeId.toString()
        // } 
        this.headQuarterService.currentShopName = resultData.name;
        this.headQuarterService.currentShopId = resultData.id;
      }
    
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
      if(response && response.data && response.data.attributesInfo.length > 0 ){
        if(this.level && this.subLevel){
          let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
          this.currentAttribute = attribute;
          this.headQuarterService.levelName = attribute.name;
          let currentItem = attribute.items.find(e=>e.id == this.subLevel);
          this.currentItem = currentItem;
          this.headQuarterService.sublevelName = currentItem.name;
          this.opacityFlag = true;
        }
      }
    })
}

  toolsIndexListPageCallback(data){
    this.toolsListPageRef = data;
    this.itemTotal = this.toolsListPageRef.itemTotal;
    console.log(this.toolsListPageRef);
  }

  backToList(){
    this.addProductFinal = false;
    this.addProductFlag = false;
    this.productHistoryFlag = false;
  }

  backToAddTools(){
    this.addProductFinal = false;
    this.addProductFlag = false;
    setTimeout(() => {
      this.selectProduct({})
    }, 100);
  }

  
  addProduct(){
    const modalRef=this.modalService.open(AddProductComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    modalRef.result.then(e=>{
      this.toolsListPageRef.getToolList()
    },err=>{})
    modalRef.componentInstance.shopId = this.headQuarterService.currentShopId;
    modalRef.componentInstance.subAttribute = this.currentItem;
    if(this.toolsListPageRef.locationToolsFlag){
      modalRef.componentInstance.selectedProduct = this.toolsListPageRef.toolsLocationPageData;
      modalRef.componentInstance.selectedProductId = this.toolsListPageRef.toolsLocationPageData?.id;
      modalRef.componentInstance.selectedProductIndex = this.toolsListPageRef.toolsLocationPageData?.id;
    }

  }

    addTools(){
      const modalRef = this.modalService.open(AddToolsComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
    } 

    selectProduct(event,selectedShop=""){
      this.addProductFinal = true;
      this.addProductFlag = true;
      this.locationToolsFlag = false;
      this.selectedProduct = event;
       this.selectedTool = "";
      if(event && event.id){
        this.selectedTool = event;
      }
      // this.selectedShop = selectedShop;
    }
}
