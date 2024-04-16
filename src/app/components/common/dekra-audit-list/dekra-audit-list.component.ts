import { Component, EventEmitter, OnInit, Input, Output, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-dekra-audit-list',
  templateUrl: './dekra-audit-list.component.html',
  styleUrls: ['./dekra-audit-list.component.scss']
})
export class DekraAuditListComponent implements OnInit {
  @Input() toolsPageData: any = []; 
  @Output() dekraauditComponentRef: EventEmitter<DekraAuditListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<DekraAuditListComponent> = new EventEmitter();


  sconfig: PerfectScrollbarConfigInterface = {};
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
  currentScrollLeft = "";
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
  pageLimit:number = 20;
  pageOffset:number = 0;
  shopId: string | Blob;
  statusList = ""
  typeList = ""
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
  public sideMenu: boolean = true;

  public inspectionListFlag: boolean = false;
  public templateListFlag: boolean = false;
  public sectionListFlag: boolean = false;
  listData: any[] = [];
  maxOffset: any;
  statusFilter: string = "";
  typeFilter: string = "";
  public isFilterApplied: boolean;
  public sortFieldEvent: string;
  public sortOrderField = 0;
  public dataFilterEvent: any;

 // Resize Widow
 @HostListener("window:resize", ["$event"])
 onResize(event) {
   this.bodyHeight = window.innerHeight;
   
   this.setScreenHeight();

  //  setTimeout(() => {
  //    if (!this.displayNoRecords) {
  //      let listItemHeight;
  //      listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
  //      document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
 
  //      console.log(this.itemTotal, this.itemLength,  this.innerHeight, listItemHeight);
 
  //      if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
  //        this.scrollCallback = false;
  //        this.lazyLoading = true;
  //        this.getList();
  //        this.lastScrollTop = this.scrollTop;
  //      } 
  //    }
  //  }, 1500);

 }

 // Scroll Down
 @HostListener("scroll", ["$event"])
 onScroll(event: any) {
   this.scroll(event);
 }

  constructor(private router:Router,private sanitizer:DomSanitizer,private modalService: NgbModal,private headQuarterService: HeadquarterService,private authenticationService: AuthenticationService,private activeRoute:ActivatedRoute) { 
    
  router.events.forEach((event) => {
    if (event instanceof NavigationEnd) {
      if(event.url.includes("all-tools")){
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

  ngOnInit(): void {
    // if(this.activeRoute.snapshot.queryParams['type'] && this.activeRoute.snapshot.queryParams['type'] == "section"){
    //   this.sectionListFlag = true;
    //   this.templateListFlag = false;
    //   this.inspectionListFlag = false;
    // }
    this.level =  this.router.url.split('/')[3];
    this.subLevel =  this.router.url.split('/')[4];    
    this.shopId = this.router.url.split('/')[6];     
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4); 
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';
    this.getList();
    window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500);
    // if(this.sectionListFlag){
    //   this.getGtsList();
    // }
    this.callback.emit(this);

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
      //       this.getList();
      //     }
      //   }
      //   this.lastScrollTop = this.scrollTop;
      // }
    }
    // Get SHOP List
    addItem(type){
      switch(type){
        case "inspection": this.router.navigate(["/new-inspection"]);
        break;
        case "section": this.router.navigate(["/new-section"]);
        break;
        case "template": this.router.navigate(["/new-template"]);
        break;
        default:
        break;
      }
    }
    getList() {

      if(this.itemOffset == 0){
        this.toolsList = [];
        this.itemTotal = 0;
        this.itemLength = 0;
        //this.loading = true;
       
        if(this.inspectionListFlag){
          this.toolsListColumns = [
            { field: 'id', header: 'ID', columnpclass: ' header aud-thl-col-1', sortName: 'id' },
            { field: 'typeName', header: 'Type', columnpclass: ' header aud-thl-col-2'},
            { field: 'inspectionName', header: 'Audit/Inspection Name', columnpclass: ' header aud-thl-col-4', sortName: 'title' },
            // { field: 'instance', header: 'Instance#', columnpclass: ' header aud-thl-col-2', sortName: 'instance' },
            { field: 'inspectionTime', header: 'How often', columnpclass: ' header aud-thl-col-2', sortName: 'inspectionTime' },
            { field: 'startDate', header: 'Start Date', columnpclass: ' header aud-thl-col-2', sortName: 'startDate' },
            { field: 'completionDeadline', header: 'Completion date', columnpclass: ' header aud-thl-col-3', sortName: 'completionDeadline' },
            { field: 'totalTime', header: 'Total time', columnpclass: ' header aud-thl-col-2', sortName: 'totalTime' },
            { field: 'loc', header: 'Locations', columnpclass: ' header aud-thl-col-2'},   
            { field: 'auditStatus', header: 'Audit/Inspection Status', columnpclass: ' header aud-thl-col-4'},
            { field: 'status', header: 'Status', columnpclass: ' header aud-thl-col-2', sortName: 'isPublished' },
            { field: '', header: '', columnpclass: ' header aud-thl-col-10 col-sticky'},
          ];
        }
        if(this.templateListFlag){
          this.toolsListColumns = [
            { field: 'id', header: 'ID', columnpclass: ' header aud-thl-col-2' , sortName: 'id' },
            { field: 'typeName', header: 'Type', columnpclass: ' header aud-thl-col-2' },
            { field: 'title', header: 'Title', columnpclass: ' header aud-thl-col-4' , sortName: 'title' },
            { field: 'sectionsCount', header: 'Sections', columnpclass: ' header aud-thl-col-2' },
            { field: 'questionsCount', header: 'Questions', columnpclass: ' header aud-thl-col-2' },
            ...(this.domainId == 1 ? [{ field: 'customer', header: 'Network', columnpclass: ' header aud-thl-col-3'}] : []),
            { field: 'createdOn', header: 'Created On', columnpclass: ' header aud-thl-col-2' , sortName: 'createdOn' },
            { field: 'userName', header: 'Created By', columnpclass: ' header aud-thl-col-2' },
            { field: 'status', header: 'Status', columnpclass: ' header aud-thl-col-2' , sortName: 'isPublished' }, 
            { field: '', header: '', columnpclass: ' header aud-thl-col-10 col- sticky'},          
          ];
        }
        if(this.sectionListFlag){
          this.toolsListColumns = [
            { field: 'id', header: 'ID', columnpclass: ' header aud-thl-col-2', sortName: 'id' },
            { field: 'workFlowName', header: 'Type', columnpclass: ' header aud-thl-col-2', sortName: 'workFlowName' },
            { field: 'name', header: 'Title', columnpclass: ' header aud-thl-col-4', sortName: 'name' },
            { field: 'questionsCount', header: 'Questions', columnpclass: ' header aud-thl-col-2', sortName: 'questionsCount' },
            ...(this.domainId == 1 ? [{ field: 'networkName', header: 'Network', columnpclass: ' header aud-thl-col-4', sortName: 'networkName' }] : []),
            { field: 'createdOn', header: 'Created On', columnpclass: ' header aud-thl-col-4', sortName: 'CreatedOn' },
            { field: 'createdby', header: 'Created By', columnpclass: ' header aud-thl-col-4', sortName: 'CreatedBy' },  
            { field: 'status', header: 'Status', columnpclass: ' header aud-thl-col-2', sortName: 'status' },
            { field: '', header: '', columnpclass: ' header aud-thl-col-10 col-sticky'},      
          ];
        }

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
      apiFormData.append('offset', this.itemOffset);
  
      //this.headQuarterService.getUserList(apiFormData).subscribe((response:any) => {
       // console.log(response);
  
        let resultData = [];
  
          //resultData = response.items;
          //this.itemTotal = response.total;
  
         // resultData = [];

         if(this.inspectionListFlag){
          // resultData = [
          //    { id: 1, type: 'Inspection', insName: "Automotive Lift Inspection", instance: "1", fequency : 'Annual', sdate: 'Nov 16, 2023', cdate: 'Dec 16, 2023', atime: '1 Month', loc : 78 },
          //    { id: 2, type: 'Audit', insName: "Repair Process", instance: "1", fequency : 'Twice a year', sdate: 'Nov 15, 2023', cdate: 'Jan 15, 2023', atime: '2 Months' , loc : 8  },
          //    { id: 3, type: 'Inspection', insName: "Collision quality", instance: "1", fequency : 'Monthly', sdate: 'Nov 11, 2023', cdate: 'Dec 11, 2023', atime: '1 Month' , loc : 7 },
          //    { id: 4, type: 'Audit', insName: "Tools inspection", instance: "1",fequency : 'Annual', sdate: 'Nov 1, 2023', cdate: 'Dec 1, 2023', atime: '1 Month'  , loc : 38 },
          // ];
          // setTimeout(() => {
          //   this.loading = false;
          //   this.lazyLoading = this.loading;
          // }, 100);   
          if(this.toolsList.length <= 0){
            this.getGtsList();
          }
            this.lazyLoadingGtsListListner();
         }
         if(this.templateListFlag){
          if(this.toolsList.length <= 0){
            this.getGtsList();
          }
            this.lazyLoadingGtsListListner();
        }
        if(this.sectionListFlag){
        if(this.toolsList.length <= 0){
          this.getGtsList();
        }
          this.lazyLoadingGtsListListner();
        }
           
          this.itemTotal = resultData.length;

                
  
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
          this.callback.emit(this);
        }, 100);  
    }

    lazyLoadingGtsListListner(){
      setTimeout((test = this) => {
        this.tableDiv = document.getElementsByClassName('p-datatable-scrollable-body')[0]
        if(this.tableDiv){
          this.tableDiv.addEventListener("scroll", function(event){
            if(this.currentScrollLeft == event.target.scrollLeft){
              let tableDiv:any = document.getElementsByClassName('p-datatable-scrollable-body')[0]
              console.log(tableDiv.scrollTop + tableDiv.offsetHeight>= (tableDiv.scrollHeight - 20))
              if(tableDiv.scrollTop + tableDiv.offsetHeight>= (tableDiv.scrollHeight - 20)){
                test.pageOffset = test.pageOffset + 1;
                test.scrollTop = tableDiv.scrollTop;
                test.getGtsList(true);
              }
            }
            this.currentScrollLeft = event.target.scrollLeft;
        });
        }else{
          this.lazyLoadingGtsListListner()
        }
      }, 1500);
    }

    filterList(lazy=false,statusFilter = "",typeFilter = ""){
      this.statusFilter = statusFilter;
      this.typeFilter = typeFilter;
      this.pageOffset = 0;
      this.getGtsList();
      this.lazyLoadingGtsListListner();
    }

    getGtsList(lazy=false){
      // if(!lazy){
      //   this.loading = true;
      //   this.lazyLoading = true
      // }
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("limit", this.pageLimit.toString());
      apiFormData.append("offset",this.pageOffset.toString());
      apiFormData.append('sortFieldEvent', this.sortFieldEvent ? this.sortFieldEvent: '');
      apiFormData.append('sortOrderField', this.sortOrderField ? this.sortOrderField.toString() : '');
      apiFormData.append('dataFilterEvent', this.dataFilterEvent ? this.dataFilterEvent : '');
      if(this.statusFilter){
        apiFormData.append("statusId",this.statusFilter);
      }

      if(this.typeFilter){
        apiFormData.append("typeId",this.typeFilter);
      }
      // if(this.user.domain_id !=1 && this.user.networkId){
        apiFormData.append("networkId",this.user.networkId.toString());
      // }

      if(this.inspectionListFlag && this.user && this.user.data && this.user.data.shopId){
        apiFormData.append("locations","[" + this.user.data.shopId + "]");
      }
      
      if(lazy || this.isFilterApplied){
        this.lazyLoading = true
      }else{
        this.loading = true;
        this.lazyLoading = true;
        this.toolsList = [];
        this.pageOffset = 0;
      }

      let dataObs
      if(this.sectionListFlag){
        dataObs = this.headQuarterService.getGtsList(apiFormData)
      }else if(this.templateListFlag){
        dataObs = this.headQuarterService.getTemplateList(apiFormData)
      }else if(this.inspectionListFlag){
        dataObs = this.headQuarterService.getInspectionList(apiFormData)
      }
       
      if(dataObs){
        dataObs.subscribe((response:any) => {
           if(response && response.items){
            // response.items = []
              this.maxOffset = response.total
             if(response.items && response.items.length == 0 && !lazy){
               this.itemEmpty = true;
             }else{
               this.itemEmpty = false;
             }
             if(lazy){
              //  this.toolsList = this.toolsList.concat(response.items);
              response.items.forEach(e=>{
                this.toolsList.push(e)
              })
               setTimeout(() => {
                if (this.toolsList.length !== 0) {
                  let listItemHeight;
                  listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
                
                  if (
                    response.items.length > 0 &&
                    this.toolsList.length != response.total &&
                    this.innerHeight >= listItemHeight
                  ) {             
                    this.pageOffset = this.pageOffset + 1;
                    this.getGtsList(true);              
                  } 
                }
              }, 1500);
             }else{
               this.toolsList = response.items
               setTimeout(() => {
                if (this.toolsList.length !== 0) {
                  let listItemHeight;
                  listItemHeight = (document.getElementsByClassName("parts-mat-table")[0]) ? document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50 : 0;
                
                  if (
                    response.items.length > 0 &&
                    this.toolsList.length != response.total &&
                    this.innerHeight >= listItemHeight
                  ) {             
                    this.pageOffset = this.pageOffset + 1;
                    this.getGtsList(true);              
                  } 
                }
              }, 1500);
             }
            setTimeout(() => {
              this.loading = false;
              this.lazyLoading = false;
            }, 1000);
           }
         })
      };
      this.isFilterApplied = false;
    }

    editSection(id:string){
      this.router.navigate(["/edit-section/" + id])
    }

    editTemplate(id:string){
      this.router.navigate(["/edit-template/" + id])
    }

    editInspection(id:string){
      this.router.navigate(["/edit-inspection/" + id])
    }
    
    goToDetailPage(type: string, section: any) {
      switch (type) {
        case 'section':
          let networkId = section.networkId;
          if (networkId == 0) networkId = this.dekraNetworkId;
          this.router.navigate([`section/${networkId}/${section.procedureId}`]);     
          break;
        case 'template':
          this.router.navigate([`template/${section.id}`]);     
          break;
        case 'inspection':
          this.router.navigate([`headquarters/audit/inspection/${section.id}`]);     
          break;
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
        this.toolsList = [];
        this.itemOffset = 0;
        this.pageOffset = 0;
        this.getList();
      }
    }
}
