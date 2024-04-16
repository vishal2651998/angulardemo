import { Component, EventEmitter, OnInit, Input, Output, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-all-networks-list',
  templateUrl: './all-networks-list.component.html',
  styleUrls: ['./all-networks-list.component.scss']
})
export class AllNetworksListComponent implements OnInit {
  @Input() toolsPageData: any = []; 
  @Output() toolsIndexListComponentRef: EventEmitter<AllNetworksListComponent> = new EventEmitter();
  @Output() toolsCallback: EventEmitter<AllNetworksListComponent> = new EventEmitter();
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
  public expandedRows= {"1" : true }

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
  pageLimit:number = 25;
  pageOffset:number = 0;
  shopId: string | Blob;

  public locationToolsFlag: boolean = false;
  public toolsLocationPageData: any = [];
  public productDetailsFlag: boolean = false
  selectedProduct: any = {};
  modelList: any = [];
  brandList: any = [];
  manufacturerList: any = [];
  categoryList: any = [];
  tableDiv?;
  toolsAttributesInfo:any = [];
  maxOffset: any;
  toolsLocationList: any;
  lastSelectedTool: any;
  lastLocation: string;
  addProductsFlag: boolean = false;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
    // Resize Widow
    @HostListener("window:resize", ["$event"])
    onResize(event) {
      this.bodyHeight = window.innerHeight;
      
      this.setScreenHeight();
  
      // setTimeout(() => {
      //   if (!this.displayNoRecords) {
      //     let listItemHeight;
      //     listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
      //     document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
    
      //     console.log(this.itemTotal, this.itemLength,  this.innerHeight, listItemHeight);
    
      //     if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
      //       this.scrollCallback = false;
      //       this.lazyLoading = true;
      //       this.getToolsList();
      //       this.lastScrollTop = this.scrollTop;
      //     } 
      //   }
      // }, 1500);
  
    }
  

  constructor(private router:Router,public activeModal: NgbActiveModal,private modalService: NgbModal,private headQuarterService: HeadquarterService,private authenticationService: AuthenticationService) { 
    
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
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.bodyHeight = window.innerHeight;
    this.innerHeight = 140;
  }

  ngOnInit(): void {
    if(this.router.url.includes("all-shops")){
      this.level =  "";
      this.subLevel =  "";    
      this.shopId = this.router.url.split('/')[4];    
    }else{
      this.level =  this.router.url.split('/')[3];
      this.subLevel =  this.router.url.split('/')[4];    
      this.shopId = this.router.url.split('/')[6];     
    }
 
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4); 

    this.dekraNetworkId = this.toolsPageData.dekraNetworkId;
    this.paccess = this.toolsPageData.parentPage;
    this.access = this.toolsPageData.currentPage;
    this.domainId = this.toolsPageData.domainId;
    this.user = this.authenticationService.userValue;
    this.userId = this.toolsPageData.userId;
    this.roleId = this.toolsPageData.roleId;
    this.apiKey = this.toolsPageData.apiKey;
    this.countryId = this.toolsPageData.countryId;
    // this.shopId = this.toolsPageData.shopId;

    // if(this.user && this.user.data && this.user.data.shopId){
    //   this.shopId = this.user.data.shopId;
    //   this.access =
    // }

   
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    this.toolsCallback.emit(this);

  }


  getToolsList(){
    this.loading = false;
  }

  // Get SHOP List
  getToolsListOld() {

    if(this.itemOffset == 0){
      this.toolsList = [];
      this.itemTotal = 0;
      this.itemLength = 0;
    }

    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append('limit', this.itemLimit);
    apiFormData.append('offset', this.itemOffset.toString());
    if(this.shopId){
      apiFormData.append("shopId", this.shopId);
    }
    if(this.user && this.user.data && this.user.data.shopId){
      apiFormData.append("shopId",this.user.data.shopId);
    }

    //this.headQuarterService.getUserList(apiFormData).subscribe((response:any) => {
     // console.log(response);

      let resultData = [];

        //resultData = response.items;
        //this.itemTotal = response.total;

       // resultData = [];
        resultData = [
          // { id: 1, isdefaultImg: 0, image: "assets/images/hq/tools-p1.jpg", productName: 'Max 12K Scissor Alignment Lift', ProductCat: "Gantry Crane", qty: "96", loc: "180",  dept: "Department Name 31", cert: true, mfr: "Craftsman", part: "", model: "99879" },
          // { id: 2, isdefaultImg: 0, image: "assets/images/hq/tools-p2.jpg", productName: 'Product Name 98', ProductCat: "Electric Chain Hoist", qty: "23", loc: "78", dept: "Department Name 30", cert: false, mfr: "Craftsman", part: "", model: "98878" },
          // { id: 3, isdefaultImg: 0, image: "assets/images/hq/tools-p3.jpg", productName: 'Product Name 97', ProductCat: "Tire Balancer", qty: "35", loc: "60", dept: "Department Name 29", cert: true, mfr: "Craftsman", part: "", model: "97877" },
          // { id: 4, isdefaultImg: 0, image: "assets/images/hq/tools-p4.jpg", productName: 'Product Name 96', ProductCat: "Tire Changer", qty: "14", loc: "110", dept: "Department Name 28", cert: true, mfr: "Wera", part: "", model: "96876" },
          // { id: 1, isdefaultImg: 0, image: "assets/images/hq/tools-p1.jpg", productName: 'Product Name 95', ProductCat: "Aligner with camera system", qty: "32", loc: "93",  dept: "Department Name 27", cert: false, mfr: "Wera", part: "", model: "95875" },
          // { id: 2, isdefaultImg: 0, image: "assets/images/hq/tools-p2.jpg", productName: 'Product Name 94', ProductCat: "4 Post alignment rack", qty: "51", loc: "150", dept: "Department Name 26", cert: false, mfr: "Wera", part: "", model: "94874" },
          // { id: 3, isdefaultImg: 0, image: "assets/images/hq/tools-p3.jpg", productName: 'Product Name 93', ProductCat: "Air compressor", qty: "62", loc: "35", dept: "Department Name 25", cert: false, mfr: "Wera", part: "", model: "95873" },
          // { id: 4, isdefaultImg: 0, image: "assets/images/hq/tools-p4.jpg", productName: 'Product Name 92', ProductCat: "Coolant flushvac & fill machine", qty: "30", loc: "46", dept: "Department Name 24", cert: true, mfr: "Craftsman", part: "", model: "94872" },
          // { id: 1, isdefaultImg: 0, image: "assets/images/hq/tools-p1.jpg", productName: 'Product Name 91', ProductCat: "ADAS alignment/calibration equipment", qty: "25", loc: "20",  dept: "Department Name 23", cert: true, mfr: "Craftsman", part: "", model: "93871" },
          // { id: 2, isdefaultImg: 0, image: "assets/images/hq/tools-p2.jpg", productName: 'Product Name 90', ProductCat: "2 Post lifts", qty: "16", loc: "32", dept: "Department Name 22", cert: true, mfr: "Craftsman", part: "", model: "92870" },
          // { id: 3, isdefaultImg: 0, image: "assets/images/hq/tools-p3.jpg", productName: 'Product Name 89', ProductCat: "Kinetic Suspension Vac  & Fill Machine", qty: "20", loc: "18", dept: "Department Name 21", cert: false, mfr: "Craftsman", part: "", model: "91869" },
          // { id: 4, isdefaultImg: 0, image: "assets/images/hq/tools-p4.jpg", productName: 'Product Name 88', ProductCat: "AC Refrigerant Vac/Fill", qty: "15", loc: "40", dept: "Department Name 20", cert: true, mfr: "Craftsman", part: "", model: "90868" },
        ];
        this.itemTotal = resultData.length;

        this.lazyLoading = this.loading;

        

      if(this.itemTotal>0){
        if(resultData.length>0){
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemEmpty = false;
            this.displayNoRecords = false;

            resultData.forEach(item => {
              this.toolsList.push(item);
            });

            
            console.log(this.userData)
            this.itemLength += resultData.length;
            this.itemOffset += this.itemLimit;
                  }
      }
      setTimeout(() => {
        this.toolsCallback.emit(this);
      }, 100);
      

      console.log(resultData);
        setTimeout(() => {
        /*if (!this.displayNoRecords) {
          let listItemHeight;
          listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
          document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;

          console.log(this.itemTotal, this.itemLength,  this.innerHeight, listItemHeight);

          if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.getToolsList();
            this.lastScrollTop = this.scrollTop;
          }

        }*/

      }, 1500);
    //});

    

  }
  


}



