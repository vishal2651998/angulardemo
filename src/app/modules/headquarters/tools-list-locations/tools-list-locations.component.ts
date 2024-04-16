import { Component, EventEmitter, OnInit, Input, Output, HostListener, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AddProductComponent } from '../add-product/add-product.component';
import { AddToolsComponent } from '../add-tools/add-tools.component';

@Component({
  selector: 'app-tools-list-locations',
  templateUrl: './tools-list-locations.component.html',
  styleUrls: ['./tools-list-locations.component.scss']
})
export class ToolsListLocationsComponent implements OnInit,OnChanges {
  @Input() toolsData: any = []; 
  @Input() toolsLocationPageData: any = []; 
  @Input() attributesInfo: any = [];
  @Output() toolsListComponentRef: EventEmitter<ToolsListLocationsComponent> = new EventEmitter();
  @Output() toolsLocationCallback: EventEmitter<ToolsListLocationsComponent> = new EventEmitter();
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
  public apiKey: string = Constant.ApiKey;
  dekraNetworkId:any;
  public user: any;
  public domainId;
  public userId;
  regionName:string="";
  userData : any = [];
 
  public access = "";
  public paccess = "";
  public toolsList = [];
  public displayFlag: boolean = false;
  level:string="";
  subLevel:string = "";
  shopData:any;
  currentAttribute:any;
  currentItem:any;
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;

  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;
  public dekraNetworkHqId: string = '';

  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public roleId;
  public countryId='';
  public platformId: string;
  public apiData: Object;
  public tableRemoveHeight: number = 160;
  public toolsListColumns = [];
  currentShopData: any;
  addProductFlag: boolean = false;
  shopId: string | Blob;

  public locationToolsFlag: boolean = true;
  public productHistoryFlag: boolean = false;
  public expandedRows= {"1" : true }
  toolListResponse: any;
  selectedLocation:any
  addProductFinal: boolean = false;
  selectedProduct: any;
  selectedTool: any;
  selectedShop: any;
  showNetwork: boolean = false;
    // Resize Widow
    @HostListener("window:resize", ["$event"])
    onResize(event) {
      this.bodyHeight = window.innerHeight;
      
      this.setScreenHeight();
  
      setTimeout(() => {
        if (!this.displayNoRecords) {
          let listItemHeight;
          listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
          document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
    
          console.log(this.itemTotal, this.itemLength,  this.innerHeight, listItemHeight);
    
          if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.getToolsLocationsList();
            this.lastScrollTop = this.scrollTop;
          } 
        }
      }, 3000);
  
    }
  
    // Scroll Down
    @HostListener("scroll", ["$event"])
    onScroll(event: any) {
      this.scroll(event);
    }

  constructor(private router:Router,private modalService: NgbModal,private headQuarterService: HeadquarterService,private authenticationService: AuthenticationService) { 

  router.events.forEach((event) => {
    if (event instanceof NavigationEnd) {
      if(event.url.includes("all-tools")){
        this.level =  "";
        this.subLevel =  "";    
        this.shopId = event.url.split('/')[4];    
      }else if(event.url.includes("all-shops")){
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
  ngOnChanges(): void {
    if(!!this.toolsLocationPageData && this.toolsLocationPageData.partsInfo) {
      if(typeof(this.toolsLocationPageData.partsInfo) == 'string'){
        this.toolsLocationPageData.partsInfo =  JSON.parse(this.toolsLocationPageData.partsInfo);
      }
      this.toolsLocationPageData["partsNameArray"] = [];
      this.toolsLocationPageData.partsInfo.forEach((e:any)=>{
        if(!!e.partId){
          this.toolsLocationPageData["partsNameArray"].push(" "+e.partId)
        }
      })
    }
  }

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.innerHeight = (this.access == 'all-tools') ? this.innerHeight : this.innerHeight;
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
    this.tableRemoveHeight = (this.access == 'all-tools') ? headerHeight + 240 :  headerHeight + 240;
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4); 

    this.dekraNetworkId = this.toolsData.dekraNetworkId;
    this.paccess = this.toolsData.parentPage;
    this.access = this.toolsData.currentPage;
    this.domainId = this.toolsData.domainId;
    this.userId = this.toolsData.userId;
    this.roleId = this.toolsData.roleId;
    this.apiKey = this.toolsData.apiKey;
    this.countryId = this.toolsData.countryId;
    this.shopId = this.toolsData.shopId;
    if(this.router.url.includes("all-tools")){
      this.level =  "";
      this.subLevel =  "";    
      this.shopId = this.router.url.split('/')[4];    
    }else if(this.router.url.includes("all-shops")){
      this.level =  "";
      this.subLevel =  "";    
      this.shopId = this.router.url.split('/')[4];    
    }else{
      this.level =  this.router.url.split('/')[3];
      this.subLevel =  this.router.url.split('/')[4];    
      this.shopId =  this.router.url.split('/')[6];     
    }
    console.log(this.toolsLocationPageData);
    console.log(this.attributesInfo,"atttr");
    if(this.access != 'shop-tools'){
    this.toolsListColumns = [
      { field: 'image', header: '', columnpclass: 'w4 header tool-thl-col-9',width: '50px' },
      { field: 'locationName', header: 'Location Name', columnpclass: 'w3 header tool-thl-col-3',width: '150px' },
      { field: 'locationId', header: 'Location#', columnpclass: 'w4 header tool-thl-col-4',width: '120px' },
      { field: 'citystate', header: 'City, State', columnpclass: 'w3 header tool-thl-col-3',width: '150px' },
      { field: 'region', header: this.attributesInfo.length > 0 && this.attributesInfo[0].name ? this.attributesInfo[0].name :  'Region', columnpclass: 'w4 header tool-thl-col-4',width: '120px' },
      { field: 'zone', header:  this.attributesInfo.length > 0 && this.attributesInfo[1].name ? this.attributesInfo[1].name : 'Zone', columnpclass: 'w8 header tool-thl-col-8',width: '120px' },
      { field: 'territory', header: this.attributesInfo.length > 0 && this.attributesInfo[2].name ? this.attributesInfo[2].name : 'Territory', columnpclass: 'w4 header tool-thl-col-4',width: '120px' },
      { field: 'totalitems', header: 'Qty', columnpclass: 'w8 header tool-thl-col-8',width: '60px' },
      { field: 'openitems', header: 'Items Open', columnpclass: 'w4 header tool-thl-col-4',width: '120px' },
      { field: '', header: '', columnpclass: 'w8 header tool-thl-col-8 col-sticky',width:'60px' },
      // { field: 'instatus', header: 'Inspection Status', columnpclass: 'w6 header tool-thl-col-6' },
      // { field: 'indate', header: 'Inspection Date', columnpclass: 'w6 header tool-thl-col-6' },
      // { field: '', header: '', columnpclass: 'w10 header tool-thl-col-10 col-sticky',width: '80px' },
    ];
  }
  else{
    this.toolsListColumns = [
      { field: 'image', header: 'Image', columnpclass: 'w4 header tool-thl-col-4' },
      { field: 'locationName', header: 'Location Name', columnpclass: 'w3 header tool-thl-col-3' },
      { field: 'locationId', header: 'Location#', columnpclass: 'w4 header tool-thl-col-4' },
      { field: 'citystate', header: 'City, State', columnpclass: 'w3 header tool-thl-col-3' },
      { field: 'region', header: 'Region', columnpclass: 'w4 header tool-thl-col-4' },
      { field: 'zone', header: 'Zone', columnpclass: 'w8 header tool-thl-col-8' },
      { field: 'territory', header: 'Territory', columnpclass: 'w4 header tool-thl-col-4' },
      { field: 'totalitems', header: 'Qty', columnpclass: 'w8 header tool-thl-col-8' },
      { field: 'openitems', header: 'Open', columnpclass: 'w8 header tool-thl-col-8' },
      // { field: 'instatus', header: 'Inspection Status', columnpclass: 'w6 header tool-thl-col-6' },
      // { field: 'indate', header: 'Inspection Date', columnpclass: 'w6 header tool-thl-col-6' },
      { field: '', header: '', columnpclass: 'w8 header tool-thl-col-8 col-sticky',width:'60px' },
    ];
  }
  window.addEventListener('scroll', this.scroll, true);
  // this.headquartersComponentRef.emit(this);
  this.bodyHeight = window.innerHeight;
  this.setScreenHeight();
  setTimeout(() => {
    this.setScreenHeight();
  }, 1500);
  this.toolsLocationCallback.emit(this);
  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset - 80;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if(inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getToolsLocationsList();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  // Get SHOP List
  getToolsLocationsList() {

    // if(this.itemOffset == 0){
    //   this.toolsList = [];
    //   this.itemTotal = 0;
    //   this.itemLength = 0;
    // }

    // this.scrollTop = 0;
    // this.lastScrollTop = this.scrollTop;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append('limit', this.itemLimit);
    apiFormData.append('offset', this.itemOffset);
    apiFormData.append('toolsProdId', this.toolsLocationPageData.id);

    let resultData = [];
    this.headQuarterService.getShopToolsList(apiFormData).subscribe((response:any) => {
      if(this.shopId){
        this.toolsList = response.items.filter(e=>e.id == this.shopId)
        // this.toolsLocationPageData = response.items[0]
      }else{
        this.toolsList = response.items
      }
      if(response.items &&response.items.length == 0){
        this.itemEmpty = true
      }else{
        this.itemEmpty = false
      }
      this.toolListResponse = response;
      // this.itemTotal = resultData.length;
      this.loading = false;
      this.lazyLoading = this.loading;
      // if(this.itemTotal>0){
      //   if(resultData.length>0){
      //       this.scrollCallback = true;
      //       this.scrollInit = 1;
            this.itemEmpty = false;
            this.displayNoRecords = false;

      //       resultData.forEach(item => {
      //         this.toolsList.push(item);
      //       });
                
      //       console.log(this.userData)
      //       this.itemLength += resultData.length;
      //       this.itemOffset += this.itemLimit;
      //             }
      // }
      // else{
      //   this.itemEmpty = true;
      //   this.displayNoRecords = true;
      //   this.displayNoRecordsShow = 1;
      // }
      setTimeout(() => {
        if (!this.itemEmpty) {
          let listItemHeight;
          listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
          if (
            response.items.length > 0 &&
            this.toolsList.length != response.total &&
            this.innerHeight >= listItemHeight
          ) {             
            this.itemOffset = this.itemOffset + 20;
            this.getToolsLocationsList();              
          } 
        }
      }, 1500);
      setTimeout(() => {
        this.toolsLocationCallback.emit(this);
      }, 100);
    })
  }

  rowChange(){
    this.setScreenHeight();
  }

  selectProduct(event,selectedShop="",showNetwork = false){
    this.addProductFinal = true;
    this.locationToolsFlag = true;
    this.selectedProduct = event;
    this.selectedTool = event
    this.selectedShop = selectedShop;
    this.showNetwork = showNetwork;
  }

  backToAddTools(){
    this.addProductFinal = false;
    this.addProductFlag = false;
    setTimeout(() => {
      this.selectProduct({})
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
    if(step == 'tools'){
      this.locationToolsFlag = false;
      this.productHistoryFlag = false;
      setTimeout(() => {
        this.toolsLocationCallback.emit(this);
      }, 300);
    }
    if(step == 'historyback'){
      this.productHistoryFlag = false;
      this.addProductFinal = false;
      this.locationToolsFlag = true;
      this.getToolsLocationsList();
    }
  }

  viewProductHistory(loc,tool){
    this.productHistoryFlag = true;
    this.selectedLocation = loc
    this.selectedTool = tool
    console.log(this.toolsLocationPageData)
    console.log(this.toolsData)
  }

  historyPageCallback(event){
    if(event == 'historyback'){
      this.productHistoryFlag = false;
      this.addProductFinal = false;
      this.locationToolsFlag = true;
      this.getToolsLocationsList();
    }
  }

  addProduct(){
    this.addProductFlag = true;
    this.productHistoryFlag = false;
    this.selectedLocation = {}
    // const modalRef=this.modalService.open(AddProductComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    // modalRef.result.then(e=>{
    //   this.getToolsLocationsList()
    // },err=>{
      
    // })
    // modalRef.componentInstance.selectedProduct = this.toolsLocationPageData;
    // modalRef.componentInstance.selectedProductId = this.toolsLocationPageData?.id;
    // modalRef.componentInstance.selectedProductIndex = this.toolsLocationPageData?.id;
  }

  addTools(id = undefined){
    const modalRef = this.modalService.open(AddToolsComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
    if(id != undefined){
      modalRef.componentInstance.editId = id;
    }
    modalRef.result.then(e=>{
    },err=>{
      
    })
  }

}



