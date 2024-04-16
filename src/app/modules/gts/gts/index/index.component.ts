import {
  Component,
  ViewChild,
  HostListener,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { MatSort, MatTableDataSource } from "@angular/material";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import {
  NgbModal,
  NgbModalConfig,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { GtsService } from "src/app/services/gts/gts.service";
import { ProbingQuestionsService } from "src/app/services/probing-questions/probing-questions.service";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { CommonService } from "src/app/services/common/common.service";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { ApiService } from '../../../../services/api/api.service';

export interface GTSListData {
  isSelected: boolean;
  gtsImg: string;
  productCategoryName: string;
  name: string;
  productModuleMfg: string;
  productModuleType: string;
  dtcCode: string;
  dtcDesc: string;
  system: string;
  procedureId: number;
  workstreams: string;
  workstreamLists: any;
  workstreamsLen: number;
  vehicleInfo: any;
  productType: string;
  productTypeList: any;
  model: string;
  modelList: any;
  year: number;
  yearList: any;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
  status: string;
  activeMore: boolean;
  actionFlag: boolean;
  editAccess: boolean;
  viewAccess: boolean;
  statusColor: string;
}

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  public title: string = "GTS List";
  public bodyClass: string = "parts-list";
  public bodyClass1: string = "parts";
  public bodyClass2: string = "submit-loader";
  public bodyElem;
  public sidebarActiveClass: Object;
  public gtsText: string = '';
  public displayGTSModal: boolean = false;

  gtsListColumns: string[];
  gtsListSource: MatTableDataSource<GTSListData>;
  gtsList: GTSListData[] = [];
  pageAccess: string = "gtsList";
  public section: number = 1;
  public gtsType: string = "";
  public gtsStatus: string = "";
  public searchVal: string = "";
  public countryId;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;
  public make: string = "TVS";

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public headerFlag: boolean = false;

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = true;
  public filterLoading: boolean = true;
  public groupId: number = 34;
  public filterInterval: any;
  public thumbView: boolean = false;
  public filterrecords: boolean = false;
  public gtsaction: string = 'init';

  public gtsData = {
    accessFrom: this.pageAccess,
    action: "get",
    domainId: 0,
    countryId: "",
    expandFlag: this.rightPanel,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    section: this.section,
    thumbView: this.thumbView,
    searchVal: this.searchVal,
    userId: 0,
    partType: this.gtsType,
    partStatus: this.gtsStatus,
    headerFlag: this.headerFlag,
    filterrecords: this.filterrecords,
    gtsaction: 'init',
  };

  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
  };

  public headerData: Object;
  public multipleHtml: string = "Multiple";
  public tooltipClearFlag: boolean = true;
  public gtsTooltip: boolean = false;
  public customTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public gtsActionPosition: string;
  public pageloadedhere: string;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemTotal: number;
  public itemList: object;
  public itemResponse = [];
  public ItemEmpty: boolean;
   public loading: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;

  public bodyHeight: number;
  public innerHeight: number;
  public innerHeightnew: number;

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public resize: boolean = false;
  public gtsSelectAll: boolean = false;

  public gtsFilter = [];
  public prodTypes = [];
  public models = [];
  public years = [];
  public imgUrl: string = "assets/images/gts/gts-placeholder.png";
  public chevronImg: string = "assets/images/gts/chevron.png";
  public navAction: string = "single";
  public createAccess: boolean = false;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public pinFlag: boolean = false;
  public pinClass: string = "normal";


  public baseUrl: string = "gts";
  public viewGtsUrl: string = `${this.baseUrl}/view`;
  public editGtstUrl: string = `${this.baseUrl}/edit`;
  public newGtsUrl: string = `${this.baseUrl}/new`;
  public duplicatePath: string = `${this.baseUrl}/duplicate`;
  public duplicateRedirect: string;
  public editAccess: boolean;
  public platformId;

  public gtsId: number;
  public gtsIndex: number;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public msTeamAccess: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccessMobile: boolean = false;
  public deletedListFlag : boolean = false;

  public setInterval: any;
  
  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (
        inHeight >= totalHeight &&
        this.scrollCallback &&
        this.itemTotal > this.itemLength
      ) {
        this.scrollCallback = false;
        this.getGTSLists();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.resize = true;
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private scrollTopService: ScrollTopService,
    private gtsListingApi: GtsService,
    private commonApi: CommonService,
    private probingApi: ProbingQuestionsService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService, 
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
  }

  ngOnInit() {
    this.pageloadedhere = "";
    this.scrollTopService.setScrollTop();
    this.domainId = localStorage.getItem("domainId");
    this.userId = localStorage.getItem("userId");
    this.roleId = localStorage.getItem("roleId");
    this.countryId = localStorage.getItem('countryId');
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
        searchVal:""
      };

      this.bodyElem = document.getElementsByTagName("body")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      this.scrollTopService.setScrollTop();

      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };

      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);

      setTimeout(() => {



      let apiInfo = {
        apiKey: "dG9wZml4MTIz",
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        limit: this.itemLimit,
        offset: this.itemOffset,
        groupId: this.groupId,
      };
      this.apiData = apiInfo;

      this.filterOptions["apiKey"] = "dG9wZml4MTIz";
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;


      this.apiData["filterOptions"] = this.filterOptions;
      this.gtsListColumns = [
        "catgName",
        "title",
        "modMfg",
        "modType",
        "dtcCode",
        "dtcDesc",
        "system",
        "id",
        "workstreams",
        "productType",
        "model",
        "year",
        "createdOn",
        "createdBy",
        "modifiedOn",
        "modifiedBy",
        "status",
      ];



      let year = parseInt(this.currYear)+2;
      this.years.push({
        id: "All",
        name: "All",
      });
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }

      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);

      // Get Filter Widgets
      console.log("Filter "+apiInfo);

      this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);

      this.filterInterval = setInterval(() => {
        let filterWidget = localStorage.getItem("filterWidget");
        let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
        if (filterWidget) {
          this.filterOptions = filterWidgetData.filterOptions;
          console.error("-----this.filterOptions----", filterWidgetData);
          this.apiData = filterWidgetData.apiData;
          this.filterActiveCount = filterWidgetData.filterActiveCount;
          this.filterrecords = this.filterActiveCount > 0 ? true : false;
          this.gtsaction = this.filterActiveCount > 0 ? 'filter' : 'init';
          console.error(this.apiData["filterOptions"]);
          this.apiData["filterOptions"]["filterrecords"] = this.filterrecords;
          this.gtsData["filterOptions"] = this.apiData["filterOptions"];
          // Get Part List
          //this.commonApi.emitPartListData(this.gtsData);
          this.getGTSLists();
          this.filterLoading = false;
          this.filterOptions["filterLoading"] = this.filterLoading;
          clearInterval(this.filterInterval);
          localStorage.removeItem("filterWidget");
          localStorage.removeItem("filterData");
        }
      }, 50);

      this.gtsFilter.push({
        prodType: "",
        model: "",
        year: "",
      });

    }, 1000);
      // Get GTS Lists
    } else {
      this.router.navigate(["/forbidden"]);
    }
    if (this.teamSystem) {
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;       
      }
      else{
        this.msTeamAccessMobile = false; 
      }
    } else {
      this.msTeamAccess = false;
      this.msTeamAccessMobile = false; 
    }

    this.subscription.add(
      this.commonApi.NewButtonHeaderCallReceivedSubject.subscribe((r) => {
        this.navigateWindow(this.newGtsUrl);
      }));
  }

  threadHeaderAction(event) {
    if (event == "delete") {
      //this.delete();
    }
  }
  
  gtsCreateAccess(event) {
    this.createAccess = event;
  }
  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.gtsData.action = "toggle";
    this.commonApi.emitPartListData(this.gtsData);
  }

  // Apply Filter
  applyFilter(filterData) {
    console.error("filterData---", filterData);
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterrecords = false;
      //this.filterLoading = true;
      this.apiData["filterOptions"] = filterData;
      this.filterActiveCount = this.commonApi.setupFilterActiveData(
        this.filterOptions,
        filterData,
        this.filterActiveCount
      );
      this.filterOptions["filterActive"] =
      this.filterActiveCount > 0 ? true : false;
      this.filterrecords = this.filterActiveCount > 0 ? true : false;
      this.gtsaction = this.filterActiveCount > 0 ? 'filter' : 'init';
      this.applySearch("filter",this.searchVal);

      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    } else {
      localStorage.removeItem("gtsFilter");
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    // console.error("resetFilter", this.gtsData["filterOptions"]);
    console.error("----apiData----", this.apiData["filterOptions"]);
    this.gtsData["filterOptions"] = this.apiData["filterOptions"];
    this.applySearch("reset",this.searchVal);
    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
  }

  // Get GTS Lists
  getGTSLists() {
    //this.headerFlag = false;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData["offset"] = this.itemOffset;  
    this.apiData["gtsaction"] = this.gtsaction;    
    this.apiData["filterrecords"] = this.filterrecords;
    this.apiData["thumbView"] = this.thumbView; 
    this.commonApi.emitGTSLIstData(this.apiData);
  }

  selectChange(field, value) {
    switch (field) {
      case "prodType":
        this.getVehicleModels(value);
        break;
    }
  }

  // Get Vehicle Models
  getVehicleModels(value) {
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      make: this.make,
      prodType: value,
    };

    this.probingApi.getVehicleModels(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.data.model;
        for (let m of resultData) {
          this.models.push({
            id: m.model_name,
            name: m.model_name,
          });
        }
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight =
      document.getElementsByClassName("prob-header")[0]?.clientHeight;
    this.innerHeight = this.bodyHeight - (headerHeight + 20);
    this.innerHeight = this.bodyHeight > 1420 ? 980 : this.innerHeight;
  }

  setScreenHeightnew() {
    let headerHeight =
      document.getElementsByClassName("prob-header")[0]?.clientHeight;
    this.innerHeightnew =
      window.innerHeight - (headerHeight + 40);
  }

  // GTS Selection
  gtsSelection(index, action, flag) {
    if (action == "single") {
      this.itemResponse[index].isSelected = !flag;
      this.gtsSelectAll = true;
    } else {
      let actionFlag = flag ? 1 : 0;
      switch (actionFlag) {
        case 1:
          for (let item in this.itemResponse) {
            this.itemResponse[item].isSelected = true;
          }
          break;
        case 0:
          for (let item in this.itemResponse) {
            this.itemResponse[item].isSelected = false;
          }
          break;
      }
    }
  }

  // Change the view
  viewType(actionFlag) {
      this.thumbView = actionFlag ? false : true;
      this.apiData["thumbView"] = this.thumbView;
      this.gtsaction = 'view';
      this.apiData["gtsaction"] = this.gtsaction;
      this.apiData["filterrecords"] = this.filterrecords;
      this.commonApi.emitGTSLIstData(this.apiData);
  }

  exportAction(){
    this.apiData["gtsaction"] = 'export';
    this.commonApi.emitGTSLIstData(this.apiData);
  }

  actionView(type){
    if(type == 'list'){
      this.deletedListFlag = false;
      this.apiData["gtsaction"] = 'init'; 
    }
    else{
      this.deletedListFlag = true;
      this.apiData["gtsaction"] = 'deleted-list';      
    }    
    this.commonApi.emitGTSLIstData(this.apiData);
  }

     // Pin or Unpin
  pinnedGTSList(flag) {
     this.pinFlag = flag;
     this.gtsType = flag ? "pined" : "";
     this.pinClass = flag ? "active" : "normal";
    // localStorage.setItem("partPinFlag", flag);
     this.apiData["gtsType"] = this.gtsType;
    this.apiData["accessFrom"]="landing";
    this.gtsaction = 'pin';
    this.apiData["gtsaction"] = this.gtsaction;
    this.commonApi.emitGTSLIstData(this.apiData);
  }

  // View Probing Questions
  viewGtsProcedure(action, id) {
    let url = `${this.viewGtsUrl}/${id}`;
    if (action == "single") {
      window.open(url, "_blank");
    }
    if (
      action != "Multiple" &&
      action == "Multiple Product Types" &&
      action != "Multiple Models" &&
      action != "Multiple Years"
    ) {
      window.open(url, "_blank");
    }
  }

  // Edit Navigation
  editGTS(id) {
    let url = `${this.editGtstUrl}/${id}`;
    window.open(url, url);
  }



  // New Window
  navigateWindow(url) {
    if(localStorage.getItem('gtsFlag') == '0'){
      this.gtsText = localStorage.getItem('gtsText');
      this.displayGTSModal = true;
    }
    else{
      if(this.apiUrl.enableAccessLevel){     
        this.authenticationService.checkAccess(6,'Create',true,true);
        this.setInterval = setInterval(()=>{
          let checkAccess = localStorage.getItem('checkAccess');               
          if(checkAccess == '1') {   
       //setTimeout(() => {             
         if(this.authenticationService.checkAccessVal){
          window.open(url, "_blank");
         }
         else if(!this.authenticationService.checkAccessVal){
           // no access
         }
         else{              
          window.open(url, "_blank");
         }  
       //}, 550); 
       clearInterval(this.setInterval);
        localStorage.removeItem('checkAccess');
    }
 },50);                           
      }
      else{
        window.open(url, "_blank");
      }
    }
   

    
  }

  // // Custom Tooltip Content
  // getCustTooltip(col, data, event) {
  //   setTimeout(() => {
  //     this.gtsActionPosition = "bs-popover-right";
  //     this.customTooltip = true;
  //     let element = document.getElementById("custom-popover-cont");
  //     element.innerHTML = "";
  //     this.positionLeft = event.clientX + 30;
  //     this.positionTop = event.clientY - 10;
  //     switch (col) {
  //       case "prodType":
  //         let prodList = "<ul>";
  //         for (let d of data) {
  //           let prodType = d.productType.replace(/\s/g, "").toLowerCase();
  //           prodList +=
  //             "<li class='vehicle " + prodType + "'>" + d.productType + "</li>";
  //         }
  //         prodList += "</ul>";
  //         element.innerHTML = prodList;
  //         break;
  //       case "workstream":
  //         let wsList = "<ul>";
  //         for (let d of data) {
  //           let ws = d.name;
  //           wsList += "<li>" + ws + "</li>";
  //         }
  //         wsList += "</ul>";
  //         element.innerHTML = wsList;
  //         break;
  //       case "model":
  //       case "year":
  //         let list = "<ul>";
  //         for (let d of data) {
  //           let prodType = d.productType.replace(/\s/g, "").toLowerCase();
  //           let innerData = col == "model" ? d.model : d.year;
  //           list +=
  //             "<li class='vehicle " +
  //             prodType +
  //             "'>" +
  //             d.productType +
  //             '<ul class="inner-list">';
  //           for (let i of innerData) {
  //             list += "<li>" + i + "</li>";
  //           }
  //           list += "</ul>";
  //         }
  //         list += "</ul>";
  //         element.innerHTML = list;
  //         break;
  //     }
  //   }, 100);
  // }

  // Custom Action Tooltip Content
  // getActionTooltip(index, id, event) {
  //   this.gtsList[index].activeMore = true;
  //   let actionFalg = this.gtsList[index].actionFlag;
  //   let timeout = 100;
  //   this.duplicateRedirect = "";
  //   for (let part of this.gtsList) {
  //     part.activeMore = false;
  //   }
  //   this.gtsList[index].activeMore = true;
  //   setTimeout(() => {
  //     this.editAccess = this.gtsList[index].editAccess;
  //     this.gtsTooltip = true;
  //     this.duplicateRedirect = `${this.duplicatePath}/${id}`;
  //     this.gtsId = id;
  //     this.gtsIndex = index;
  //     this.gtsActionPosition = "bs-popover-left";
  //     this.positionLeft = event.clientX - 120;
  //     this.positionTop = event.clientY - 12;
  //   }, timeout);
  // }

  // Onclick Outside
  // onClickedOutside() {
  //   if (this.tooltipClearFlag && (this.gtsTooltip || this.customTooltip)) {
  //     this.gtsTooltip = false;
  //     this.customTooltip = false;
  //     let element = document.getElementById("custom-popover-cont");
  //     element.innerHTML = "";
  //     this.positionLeft = 0;
  //     this.positionTop = 0;

  //     for (let gt of this.gtsList) {
  //       gt.activeMore = false;
  //     }
  //   }
  // }

  // Search
  applySearch(action, val) {
    if (action == "emit" && this.searchVal == '' && val == '') {
      
    } 
    else{
      this.searchVal = val;
      this.apiData["searchKey"] = this.searchVal;
      this.itemLimit = 30;
      this.itemOffset = 0;
      this.itemLength = 0;
      this.itemTotal = 0;
      this.scrollInit = 0;
      this.lastScrollTop = 0;
      this.scrollCallback = true;
      this.loading = true;
      this.gtsList = [];
      this.headerData["searchKey"] = this.searchVal;
      //this.headerFlag = true;
      this.gtsList = [];
      this.gtsListSource = new MatTableDataSource(this.gtsList);
      if (action == "reset") {
        this.ngOnInit();
      } 
      else if (action == "emit") {
        this.gtsaction = 'init';
        this.apiData["gtsaction"] = this.gtsaction;        
        this.getGTSLists();
      }else {
        this.getGTSLists();
      }
    }
  }

  // Delete GTS
  deleteRequest(gtsId) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.gtsList.splice(this.gtsIndex, 1);
        this.gtsListSource = new MatTableDataSource(this.gtsList);
        this.deleteGts(gtsId);
      }
    });
  }

  deleteGts(gtsId) {
    this.bodyElem.classList.add(this.bodyClass2);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    let gtsFormData = new FormData();
    gtsFormData.append("apiKey", this.apiData["apiKey"]);
    gtsFormData.append("domainId", this.apiData["domainId"]);
    gtsFormData.append("countryId", this.apiData["countryId"]);
    gtsFormData.append("userId", this.apiData["userId"]);
    gtsFormData.append("procedureId", gtsId);

    this.gtsListingApi.deleteGts(gtsFormData).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass2);
      this.successMsg = response.result;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.config
      );
      msgModalRef.componentInstance.successMessage = this.successMsg;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        this.applySearch("a",this.searchVal);
      }, 5000);
    });
  }
	accessLevelValu(event){
    this.accessLevel = event;
    this.createAccess = this.accessLevel.create;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
  }
}

/** Builds and returns a probing question lists. */
function mapGTSListData($response): GTSListData {
  return {
    isSelected: $response.isSelected,
    gtsImg: $response.gtsImg,
    productCategoryName: $response.productCategoryName,
    name: $response.name,
    productModuleMfg: $response.productModuleMfg,
    productModuleType: $response.productModuleType,
    dtcCode: $response.dtcCode,
    dtcDesc: $response.dtcDesc,
    system: $response.systemSelection,
    procedureId: $response.procedureId,
    workstreams: $response.workstreams,
    workstreamLists: $response.workstreamLists,
    workstreamsLen: $response.workstreamsLen,
    vehicleInfo: $response.vehicleInfo,
    productType: $response.productType,
    productTypeList: $response.productTypeList,
    model: $response.model,
    modelList: $response.modelList,
    year: $response.year,
    yearList: $response.yearList,
    createdOn: $response.createdOn,
    createdBy: $response.createdBy,
    modifiedOn: $response.updatedOn,
    modifiedBy: $response.updatedBy,
    status: $response.status,
    activeMore: $response.activeMore,
    actionFlag: $response.actionFlag,
    editAccess: $response.editAccess,
    viewAccess: $response.viewAccess,
    statusColor: $response.statusColor,
  };
}
