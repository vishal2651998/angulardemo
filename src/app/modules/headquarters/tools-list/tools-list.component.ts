import { Component, EventEmitter, OnInit, Input, Output, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToolsListLocationsComponent } from '../../headquarters/tools-list-locations/tools-list-locations.component';
import { ProductHistoryComponent } from '../product-history/product-history.component';
import { forkJoin } from 'rxjs';
import { AddToolsComponent } from '../add-tools/add-tools.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AddProductComponent } from '../add-product/add-product.component';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-tools-list',
  templateUrl: './tools-list.component.html',
  styleUrls: ['./tools-list.component.scss']
})
export class ToolsListComponent implements OnInit {
  toolsLocationListPageRef: ToolsListLocationsComponent;
  @Input() toolsPageData: any = []; 
  @Output() toolsIndexListComponentRef: EventEmitter<ToolsListComponent> = new EventEmitter();
  @Output() toolsCallback: EventEmitter<ToolsListComponent> = new EventEmitter();
  @ViewChild('productHistoryComponentRef') productHistoryComponentRef: ProductHistoryComponent;
  @Output() selectProduct= new EventEmitter();
  @Output() viewProduct= new EventEmitter();

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
  public isFilterApplied: boolean;
  public sortFieldEvent: string;
  public sortOrderField = 0;
  public dataFilterEvent: any;
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
  
    // Scroll Down
    @HostListener("scroll", ["$event"])
    onScroll(event: any) {
      this.scroll(event);
    }

  constructor(private router:Router,public activeModal: NgbActiveModal,private sanitizer:DomSanitizer,private modalService: NgbModal,private headQuarterService: HeadquarterService,private authenticationService: AuthenticationService) { 
    
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
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.innerHeight = (this.access == 'all-tools') ? this.innerHeight : this.innerHeight;
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
    this.tableRemoveHeight = (this.access == 'all-tools') ? headerHeight + 130 :  headerHeight + 130;
  }

  navigateToDetail(id){
    this.lastSelectedTool = id;
    this.lastLocation = this.router.url;
    this.headQuarterService.toolListState = this;
  }


  lazyLoadingListner(){
    setTimeout((test = this) => {
      this.tableDiv = document.getElementsByClassName('p-datatable-scrollable-body')[0]
      if(this.tableDiv){
        this.tableDiv.addEventListener("scroll", function(event){
          let tableDiv:any = document.getElementsByClassName('p-datatable-scrollable-body')[0]
          test.scrollTop = tableDiv.scrollTop;
          console.log(tableDiv.scrollTop + tableDiv.offsetHeight>= tableDiv.scrollHeight)
          if(tableDiv.scrollTop + tableDiv.offsetHeight>= (tableDiv.scrollHeight- 10)){ 
            if(test.scrollCallback && ((test.maxOffset && test.maxOffset > test.toolsList.length) || !test.maxOffset)){
              test.scrollCallback = false;
              test.pageOffset = test.pageOffset + 25;
              test.getToolList(true);              
            }
          }
      });
      }else{
        this.lazyLoadingListner()
      }
    }, 1500);
  }
  
  rowChange(){
    this.setScreenHeight();
  }

  onSelectProduct(tool){
    this.toolsLocationPageData = tool
    this.selectProduct.emit(tool)
  }

  viewProductHistory(loc,toolList){
    this.viewProduct.emit({loc:loc,tool:toolList})
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

    if(!this.shopId){
    this.toolsListColumns = [
      { field: 'image', header: 'Image', columnpclass: 'w1 header tool-thl-col-2 text-center', width: '80px' },
      { field: 'id', header: 'ID#', columnpclass: 'w1 header tool-thl-col-2', width: '80px', sortName: 'id'},
      { field: 'categoryInfo.name', header: 'Category', columnpclass: 'w3 header tool-thl-col-3', width: '100px'},
      { field: 'vendorName', header: 'Vendor', columnpclass: 'w3 header tool-thl-col-3' , width: '100px'},
      { field: 'modelInfo.name', header: 'Model', columnpclass: 'w7 header tool-thl-col-7', width: '120px'},
      { field: 'brandInfo.name', header: 'Product Name', columnpclass: 'w2 header tool-thl-col-2' , width: '100px'},
      { field: 'toolTypeInfo.name', header: 'Type', columnpclass: 'w2 header tool-thl-col-2' , width: '100px'},
      // { field: 'certification', header: 'Certification', columnpclass: 'w5 header tool-thl-col-5', width: '100px', sortName: 'certification'},
      // { field: 'departmentInfo.name', header: 'Department', columnpclass: 'w7 header tool-thl-col-7', width: '100px', sortName: 'departmentInfo'},
      { field: 'qty', header: 'Qty', columnpclass: 'w9 header tool-thl-col-9', width: '80px'},
      { field: 'loc', header: 'Locations', columnpclass: 'w4 header tool-thl-col-4', width: '100px'},
      { field: 'enteredBy', header: 'Entered By', columnpclass: 'w2 header tool-thl-col-2' , width: '100px'},
      // { field: 'mfgInfo.name', header: 'Manufacturer', columnpclass: 'w7 header tool-thl-col-7', width: '100px', sortName: 'mfgInfo'},
      // { field: 'part', header: 'Part#', columnpclass: 'w8 header tool-thl-col-8', sortName: 'part'},     
      { field: '', header: '', columnpclass: 'w1 header tool-thl-col-1 col-sticky', width: '50px'},
    ];
    this.loading = true
    // forkJoin([this.getCommonDatalist("11"),this.getCommonDatalist("13"),this.getCommonDatalist("14"),this.getCommonDatalist("16")])
    //  .subscribe((response: any) => {
    //     if(response && response.length == 4){
    //       this.modelList = response[0].items;
    //       this.brandList = response[1].items;
    //       this.categoryList = response[2].items;
    //       this.manufacturerList = response[3].items;
    //     }
    //   })
      // setTimeout(() => {
        this.getHqDetails();
      // }, 1000);
  } 
  else{
    this.toolsListColumns = [
      { field: 'image', header: 'Image', columnpclass: 'w3 header tool-thl-col-3 text-center' },
      { field: 'id', header: 'ID#', columnpclass: 'w1 header tool-thl-col-2', sortName: 'id'},
      { field: 'vendorName', header: 'Vendor', columnpclass: 'w3 header tool-thl-col-3' },
      { field: 'modelInfo.name', header: 'Model', columnpclass: 'w3 header tool-thl-col-3' },
      // { field: 'certification', header: 'Certification', columnpclass: 'w5 header tool-thl-col-5' },
      { field: 'brandInfo.name', header: 'Product Name', columnpclass: 'w2 header tool-thl-col-2' },
      { field: 'toolTypeInfo.name', header: 'Type', columnpclass: 'w2 header tool-thl-col-2' },
      // { field: 'mfgInfo.name', header: 'Manufacturer', columnpclass: 'w7 header tool-thl-col-7' },      
      { field: 'categoryName', header: 'Product Category', columnpclass: 'w2 header tool-thl-col-2' },
      // { field: 'departmentInfo.name', header: 'Department', columnpclass: 'w7 header tool-thl-col-7' },
      { field: 'qty', header: 'Qty', columnpclass: 'w9 header tool-thl-col-9' },
      { field: 'enteredBy', header: 'Entered By', columnpclass: 'w2 header tool-thl-col-2' },
      // { field: 'part', header: 'Part#', columnpclass: 'w8 header tool-thl-col-8' },  
      { field: '', header: '', columnpclass: 'w1 header tool-thl-col-1 col-sticky' },
    ];
    
    this.loading = true
    // forkJoin([this.getCommonDatalist("11"),this.getCommonDatalist("13"),this.getCommonDatalist("14"),this.getCommonDatalist("16")])
    //  .subscribe((response: any) => {
    //     if(response && response.length == 4){
    //       this.modelList = response[0].items;
    //       this.brandList = response[1].items;
    //       this.categoryList = response[2].items;
    //       this.manufacturerList = response[3].items;
    //     }
    //   })
      // setTimeout(() => {
        this.getHqDetails();
      // }, 1000);
  }

    window.addEventListener('scroll', this.scroll, true);
    if(this.shopId){
      this.getShopDetails();
    }
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500);

    this.toolsCallback.emit(this);

  }
''
  addTools(id = undefined){
    const modalRef = this.modalService.open(AddToolsComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
    if(id != undefined){
      modalRef.componentInstance.editId = id;
      this.lastSelectedTool = id;
      this.lastLocation = this.router.url;
      this.headQuarterService.toolListState = this;
    }
    modalRef.result.then(e=>{
      // this.scrollTop = 0;
      this.restoreState()
    },err=>{

    })
  }

  deleteTools(id){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.title = "Delete ";
    modalRef.componentInstance.access = "deleteTool"
    const saveFormData = new FormData();
    saveFormData.append("apiKey", this.apiKey);
    saveFormData.append("domainId", this.domainId);
    saveFormData.append("userId", this.userId);
    saveFormData.append("platform", '3');
    saveFormData.append("networkId", this.dekraNetworkId);
    saveFormData.append("id", id);
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.headQuarterService.deleteTool(saveFormData).subscribe((response: any) => {
          const msgModalRef1 = this.modalService.open(SuccessModalComponent, this.modalConfig)
          msgModalRef1.componentInstance.successMessage = "Tool Deleted successfully.";
          setTimeout(() => {
            msgModalRef1.dismiss('Cross click'); 
            this.activeModal.close();    
          }, 2000);
          this.lazyLoadingListner()
          this.getToolList()
        })
        this
      }
    });    
  }

  // Onscroll
  scroll = (event: any): void => {
    // if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
    //   let inHeight = event.target.offsetHeight + event.target.scrollTop;
    //   let totalHeight = event.target.scrollHeight - this.itemOffset - 80;
    //   this.scrollTop = event.target.scrollTop - 80;
    //   if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
    //     if(inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
    //       this.lazyLoading = true;
    //       this.scrollCallback = false;
    //       this.getToolsList();
    //     }
    //   }
    //   this.lastScrollTop = this.scrollTop;
    // }
  }

  // Get SHOP List
  getToolsList() {

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

  getImage(url:string){
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : ""
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
        resultData = response.items.filter(e=>e.id == this.shopId);
        
        
        this.shopData = resultData[0];
        
        setTimeout(() => {
          this.displayFlag = true;
        }, 1000);

      // this.level - this.shopData.level
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
          this.toolsAttributesInfo = response.data.attributesInfo;
          if(this.level && this.subLevel){  
            let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
            if(attribute){
              this.currentAttribute = attribute;
              let currentItem = attribute.items.find(e=>e.id == this.subLevel);
              this.currentItem = currentItem;
            }
          }

          let level1 = response.data.attributesInfo.find(e=>(e.displayOrder == 1));
          let level2 = response.data.attributesInfo.find(e=>(e.displayOrder == 2));
          let level3 = response.data.attributesInfo.find(e=>(e.displayOrder == 3));

          this.shopLevelOneData = level1?.items.find(e=>e.id == this.shopData?.levelOneId);
          this.shopLevelTwoData = level2?.items.find(e=>e.id == this.shopData?.levelTwoId);
          this.shopLevelThreeData = level3?.items.find(e=>e.id == this.shopData?.levelThreeId);
         
          this.restoreState()
        }
      })
  }

  getToolList(lazy=false){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("limit", this.pageLimit.toString());
    apiFormData.append('sortFieldEvent', this.sortFieldEvent ? this.sortFieldEvent: '');
    apiFormData.append('sortOrderField', this.sortOrderField ? this.sortOrderField.toString() : '');
    apiFormData.append('dataFilterEvent', this.dataFilterEvent ? this.dataFilterEvent : '');
    if(this.currentItem && this.currentItem.levelOneId){
      apiFormData.append("levelOneId", this.currentItem.levelOneId);
    }else if(this.shopData && this.shopData.levelOneId){
      apiFormData.append("levelOneId", this.shopData.levelOneId);
    }

    if(this.currentItem && this.currentItem.levelTwoId){
      apiFormData.append("levelTwoId", this.currentItem.levelTwoId);
    }else if(this.shopData && this.shopData.levelTwoId){
      apiFormData.append("levelTwoId", this.shopData.levelTwoId);
    }

    if(this.currentItem && this.currentItem.levelThreeId){
      apiFormData.append("levelThreeId", this.currentItem.levelThreeId);
    }else if(this.shopData && this.shopData.levelThreeId){
      apiFormData.append("levelThreeId", this.shopData.levelThreeId);
    }

    if(this.shopId){
      apiFormData.append("shopId", this.shopId);
    }
    
    if(this.user && this.user.data && this.user.data.shopId){
      apiFormData.append("shopId",this.user.data.shopId);
    }

    if(lazy || this.isFilterApplied){
      this.lazyLoading = true;
    }else{
      this.loading = true;
      this.toolsList = [];
      this.pageOffset = 0;
    }
    apiFormData.append("offset",this.pageOffset.toString());

    if((this.shopId) || (this.user && this.user.data && this.user.data.shopId)){

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      apiFormData.append('limit',this.pageLimit.toString());
      apiFormData.append('offset', this.pageOffset.toString());
      apiFormData.append('shopId', this.shopId ? this.shopId : this.user && this.user.data && this.user.data.shopId ? this.user.data.shopId : '');
      apiFormData.append('sortFieldEvent', this.sortFieldEvent ? this.sortFieldEvent: '');
      apiFormData.append('sortOrderField', this.sortOrderField ? this.sortOrderField.toString() : '');
      apiFormData.append('dataFilterEvent', this.dataFilterEvent ? this.dataFilterEvent : '');
      this.headQuarterService.getShopProdList(apiFormData).subscribe((response:any) => {
        if(response && response.items &&  response.items.length > 0){ 
          response.items = response.items.map(e=>{
            if(e["toolId"]){
              e["id"] = e["toolId"]
            }
            return e
          })
          this.maxOffset = response.total
         if(lazy){
           
           response.items.forEach(e=>{
             this.toolsList.push(e)
           })
         }else{
           this.toolsList = response.items
         }
       }

       if(response.items && response.items.length == 0 && !lazy){
         this.itemEmpty = true;
       }else{
         this.itemEmpty = false;
       }
       this.scrollCallback = true;
       this.loading = false;
       this.lazyLoading = false;
      })
     
    }else{
      this.headQuarterService.getToolsList(apiFormData).subscribe((response:any) => {
      
         if(response && response.items &&  response.items.length > 0){
            this.maxOffset = response.total
           if(lazy){
             response.items.forEach(e=>{
               this.toolsList.push(e)
             })
             // this.toolsList = this.toolsList.concat(response.items)
           }else{
             this.toolsList = response.items
           }
           // response.items.forEach(tool => {
           //   if(tool.brandId){
           //     tool["brandName"] = this.brandList.find(e=>e.id == tool.brandId)?.name
           //   }
           //   if(tool.modelId){
           //     tool["modelName"] = this.modelList.find(e=>e.id == tool.modelId)?.name
           //   }
           //   if(tool.mfgId){
           //     tool["mfgName"] = this.manufacturerList.find(e=>e.id == tool.mfgId)?.name
           //   }
           //   if(tool.categoryId){
           //     tool["categoryName"] = this.categoryList.find(e=>e.id == tool.categoryId)?.name
           //   }
           //   this.toolsList.push(tool)
           // });
         }
  
         if(response.items && response.items.length == 0 && !lazy){
           this.itemEmpty = true;
         }else{
           this.itemEmpty = false;
         }
  
         this.scrollCallback = true;
         this.loading = false;
         this.lazyLoading = false;


         setTimeout(() => {
          if (!this.itemEmpty) {
            let listItemHeight;
            listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
            
            console.log(
              response.items.length,
              this.toolsList.length,
              this.maxOffset,
              this.innerHeight + "::" + listItemHeight
            );
            if (
              response.items.length > 0 &&
              this.toolsList.length != response.totalList &&
              this.innerHeight >= listItemHeight
            ) {             
              this.pageOffset = this.pageOffset + 25;
              this.getToolList(true);              
            } 
          }
        }, 1500);


       });
       this.isFilterApplied = false;
    }
  }

  getCommonDatalist(type){
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("networkId", this.dekraNetworkId);
      apiFormData.append("type", type);
      return this.headQuarterService.getCommonList(apiFormData);
      // .subscribe((response: any) => {
      //   if(response && response.items){
      //     switch(type){
      //       case "11": this.modelList = response;
      //       break;
      //       case "13": this.brandList = response;
      //       break;
      //       case "14": this.categoryList = response;
      //       break;
      //       case "16": this.manufacturerList = response;
      //       break;
      //       default:;
      //       break;
      //     }
      //   }
      // });
  }


  toolsLocation(list){
    this.lastSelectedTool = list.id;
    this.lastLocation = this.router.url;
    this.headQuarterService.toolListState = this;
    this.locationToolsFlag = true;
    this.toolsLocationPageData = list;
    setTimeout(() => {
      this.toolsLocationListPageRef.getToolsLocationsList();
      this.toolsCallback.emit(this);
    }, 100);
  }
  
  backToTools(){
    this.productDetailsFlag = false;
    this.selectedProduct ={}
    this.restoreState()
  }

  restoreState(){
    if(this.headQuarterService.toolListState && this.headQuarterService.toolListState.lastLocation == this.router.url){
      this.toolsList = this.headQuarterService.toolListState.toolsList;
      this.itemOffset = this.headQuarterService.toolListState.itemOffset;
      this.lastSelectedTool = this.headQuarterService.toolListState.lastSelectedTool;
      setTimeout(() => {
        document.getElementsByClassName("p-datatable-scrollable-body ng-star-inserted")[0].scrollTop = this.headQuarterService.toolListState.scrollTop
        this.lazyLoadingListner()
      }, 500);
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("id", this.lastSelectedTool);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      this.headQuarterService.getToolsList(apiFormData).subscribe((response:any) => {
        if(response && response.items.length > 0)
        this.toolsList.forEach((e,index)=>{
          if(e.id == response.items[0].id){
            this.toolsList[index] = response.items[0];
          }
        })
        this.loading = false;
        this.lazyLoading = false;
      })
    }else{
      this.lazyLoadingListner()
      this.getToolList()
    }
  }

  productDetails(list){
    this.lastSelectedTool = list.id;
    this.lastLocation = this.router.url;
    this.headQuarterService.toolListState = this;
    this.productDetailsFlag =true;
    this.selectedProduct = list
  }

  toolsLocationListPageCallback(data){
    console.log(data);
    this.toolsLocationListPageRef = data;
    this.locationToolsFlag = data.locationToolsFlag;
    if(data && !data.locationToolsFlag){
      this.restoreState();
    }
    this.toolsCallback.emit(this);
  }
  addProduct(){
    // const modalRef=this.modalService.open(AddProductComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    // modalRef.result.then(e=>{
    //   // this.scrollTop = 0;
    //   this.lazyLoadingListner()
    //   this.getToolList()
    // },err=>{})
    // modalRef.componentInstance.shopId = this.headQuarterService.currentShopId;
    // modalRef.componentInstance.subAttribute = this.currentItem;
    // if(this.locationToolsFlag){
    //   modalRef.componentInstance.selectedProduct = this.toolsLocationListPageRef.toolsLocationPageData;
    //   modalRef.componentInstance.selectedProductId = this.toolsLocationListPageRef.toolsLocationPageData?.id;
    //   modalRef.componentInstance.selectedProductIndex = this.toolsLocationListPageRef.toolsLocationPageData?.id;
    // }
    this.addProductsFlag = true;
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
    };
    console.log(this.sortOrderField);
    this.sortFieldEvent = event.sortField;
    this.sortOrderField = event.sortOrder;
    console.log(event.sortOrder);
    console.log(event);
    this.dataFilterEvent = event.filters ? JSON.stringify(event.filters) : '';
    if (this.isFilterApplied) {
      this.toolsList = [];
      this.pageOffset = 0;
      this.itemOffset = 0;
      this.getToolList();
    }
  }
  
}


