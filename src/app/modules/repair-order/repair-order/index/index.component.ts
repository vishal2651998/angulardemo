import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { NgbTooltip, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { ActionFormComponent } from "src/app/components/common/action-form/action-form.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { ThreadService } from "src/app/services/thread/thread.service";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild("ttparts") tooltip: NgbTooltip;
  subscription: Subscription = new Subscription();
  sidebarRef: SidebarComponent;

  public title: string = "Repair Order";
  public bodyClass: string = "repairorder";
  public bodyClass1: string = "parts-list";
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;
  public headTitle: string = "";

  public headerFlag: boolean = false;
  public headerData: Object;

  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = true;
  public groupId: number = 40;
  public filterInterval: any;
  public countryId;

  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;

  public createAccess: boolean = true;
  public resize: boolean = false;
  public loading: boolean = true;
  public filterLoading: boolean = true;
  public headerCheck: string = "unchecked";
  public searchVal: string = "";
  public pageAccess: string = "repairorder";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = false;
  public rightPanel: boolean = true;

  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;

  public shopList: any = [];
  public itemOffset: number = 0;
  public itemTotal: number = 0;
  public resetFilterFlag: boolean = false;
  public shopFlag: boolean = false;
  public filterrecords: boolean = false;
  public chooseLableAdas: string = "Import as Excel";
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  filesArr: any;
  public uploadTxt: string = "Uploading...";
  public successMsg: string = this.uploadTxt;
  public errModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public progress: any = 0;
  public progressbarCountWidth = "";
  public loadedSoFar = 0;
  percentDone: any = 0;
  public listView: boolean = true;
  public importProgressDialog: boolean = false;
  public completedListFlag: boolean = false;
  public deletedListFlag: boolean = false;

  public shopData = {
    accessFrom: this.pageAccess,
    action: "get",
    countryId: "",
    domainId: 0,
    expandFlag: this.rightPanel,
    filterOptions: [],
    searchVal: this.searchVal,
    userId: 0,
    headerFlag: this.headerFlag,
    filterrecords: this.filterrecords,
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

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private modalService: NgbModal,
    private threadApi: ThreadService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    localStorage.removeItem("searchValue");
  if(this.authenticationService.userValue!=null){
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag =
    (this.domainId == "undefined" || this.domainId == undefined) &&
    (this.userId == "undefined" || this.userId == undefined) ? false : true;
   
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      
      this.shopData["domainId"] = this.domainId;
      this.shopData["countryId"] = this.countryId;
      this.shopData["userId"] = this.userId;
      this.shopData["action"] = 'get';
      
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
      let apiInfo = {
        apiKey: this.apiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        isActive: 1,
        searchKey: this.searchVal,
      };

      this.filterOptions["apiKey"] = this.apiKey;
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;

      this.apiData = apiInfo;
      this.bodyHeight = window.innerHeight;
      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }
      
      setTimeout(() => {
        let apiData = this.apiData;
        apiData["groupId"] = this.groupId;

        this.commonApi.emitROListData(this.shopData);

        // Get Filter Widgets
        /*this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);
        this.filterInterval = setInterval(() => {
          let filterWidget = localStorage.getItem("filterWidget");
          let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
          if (filterWidget) {
            console.log(filterWidgetData);
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.shopData["filterrecords"] = this.filterCheck();
            this.shopData["filterOptions"] = this.apiData["filterOptions"];
            console.log(this.shopData);            
            this.commonApi.emitROListData(this.shopData);
            setTimeout(() => {
              this.filterLoading = false;
              this.loading =  false;
              this.filterOptions["filterLoading"] = this.filterLoading;
              console.log(this.apiData);
            }, 100);
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");
          }
        }, 50); */       
      }, 500);
     

    } else {
      this.router.navigate(["/auth/login"]);
    }
  }
  else {
    this.router.navigate(["/auth/login"]);
  }

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        this.rightPanel = JSON.parse(flag);
      })
    );

    this.subscription.add(
      this.commonApi.partLayoutDataReceivedSubject.subscribe((data) => {
        //console.log(data)
        this.loading = data["loading"];       
        this.displayNoRecords = data["displayNoRecords"];
        this.itemEmpty = data["itemEmpty"];
        this.itemTotal = data["itemTotal"];
        this.itemOffset = data["itemOffset"];
        this.shopList = data["shopList"];        
      })
    );
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.shopData.action = "toggle";
    this.shopData.filterrecords = this.filterCheck();
    this.commonApi.emitROListData(this.shopData);
  }

  shopView(type){
    let action = '';
    if(type == 'list'){
      action = 'listview';
      this.listView = true;
    }
    else{
      action = 'mapview';
      this.listView = false;
    }
    this.shopData.action = action;
    this.commonApi.emitROListData(this.shopData);
  }

  showListView(type){
    let action = '';
    action = type;
    this.completedListFlag = action == 'actionComplete' ? true : false;
    this.deletedListFlag= action == 'actionDelete' ? true : false;
    this.shopData.action = type;
    this.commonApi.emitROListData(this.shopData);
  }


  // Apply Filter
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      this.shopData["filterOptions"] = filterData;

      this.filterActiveCount = this.commonApi.setupFilterActiveData(
        this.filterOptions,
        filterData,
        this.filterActiveCount
      );
      this.filterOptions["filterActive"] =
        this.filterActiveCount > 0 ? true : false;
        this.filterrecords = this.filterCheck();
      this.applySearch("filter", this.searchVal);

      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    } else {
      localStorage.removeItem("shopFilter");
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.filterrecords = this.filterCheck();
    this.currYear = moment().format("Y");
    this.applySearch("reset", this.searchVal);
    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
  }

  // Apply Search
  applySearch(action, val) {
    let callBack = false;
    this.searchVal = val;   
    this.shopData["searchVal"] = this.searchVal;
    this.shopData["action"] = "filter";
    switch (action) {
      case "reset":
        this.resetFilterFlag = true;
        this.ngOnInit();
        break;
      default:
        if (action == "emit") {
          this.headerData["searchVal"] = this.searchVal;
          this.headerFlag = true;
        }
        this.shopData["filterrecords"] = this.filterCheck();
        this.commonApi.emitROListData(this.shopData);
        setTimeout(() => {
          if (action == "init") {
            this.headerFlag = true;
          }
        }, 500);
        break;
    }

    if (callBack) {
      this.shopData["filterrecords"] = this.filterCheck();
      this.commonApi.emitROListData(this.shopData);
    }
  }

   // if any one filter is ON
   filterCheck(){ 
    this.filterrecords = false;       
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }  
    return this.filterrecords;
  }
  // Nav Part Edit or View
  navPage(action, id) {
    let url;
    url = ""; 
    window.open(url, IsOpenNewTab.openNewTab);
  }

  onUpload(event: any) {
    
    this.filesArr = event;
    let file = event.currentFiles[0];
    let uploadFlag = (event.currentFiles.length > 0) ? true : false;
    if(uploadFlag) {
      let deleteFlag:any = 0;
      let popupFlag = true;
      if(popupFlag) {
        let uaccess = 'Shops';
        let uploadAccess = `Upload Shops`;
        let actionInfo = {fileName: file.name};
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = uploadAccess;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
          console.log(receivedService)
          let uploadFileFlag = receivedService.flag;
          modalRef.dismiss('Cross click');
          if(uploadFileFlag) {
            this.importData(file, deleteFlag);
          }
        });
      } else {
        this.importData(file, deleteFlag);
      }
    } else {
      this.successMsg = "Invalid File Format";
      const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
      msgModalRef.componentInstance.successMessage = this.successMsg;
      msgModalRef.componentInstance.statusFlag = false;
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.successMsg = this.uploadTxt;
      }, 3000);
    }
    
  }

  importData(file: any, deleteFlag: any) {
    this.importProgressDialog = true;
    let fdata = {
      file: file,
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey
    }
    let totalTemp = 0;
    this.loading = true;
    this.threadApi.apiForimportShopData(fdata).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          let progress = Math.round(100 * event.loaded / event.total);
          this.progress = progress;
          this.progressbarCountWidth = this.progress + '%';
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          totalTemp = this.loadedSoFar;
          this.percentDone = 100;
          this.progress = this.percentDone;
          this.progressbarCountWidth = this.progress + '%';
          console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
          let resBody = event.body;
          let status = resBody.status;
          const result = resBody.data;
          // let timeout = (status == 'Failure') ? 0 : 3000;         
          if(status == "Failure" || status == "FILE_VALIDATION_ERROR") {
            this.loading = false;
            this.progress = 0;
            //this.successMsg = resBody.message;
            this.successMsg = "Failure";
            this.importProgressDialog = false;
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            msgModalRef.componentInstance.statusFlag = false;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              this.successMsg = this.uploadTxt;
            }, 3000);
          } else if (status == 'Success') {
            this.importProgressDialog = false;
            //this.successMsg = "Successfully Uploaded.";
            this.successMsg = "Successfully Uploaded.";
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            msgModalRef.componentInstance.statusFlag = true;
            setTimeout(() => {              
              msgModalRef.dismiss('Cross click');
              this.shopData.action = 'import';
              this.commonApi.emitROListData(this.shopData);
            }, 3000);
          }
          break;
      }
    }, (error: any) => {
      this.progress = 0;
      this.loading = false;
    })
  }

  myStyle(): object {
    return { "width": this.progressbarCountWidth };
  }

  menuNav(item) {
    console.log(item)
    this.headTitle = item.name; 
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    if(item.slug == "jobrate"){
      this.router.navigate(["/repair-order/jobs-ratecard"]);
      return false;
    }     
  }
  
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    //this.setScreenHeight();
    this.filterOptions["filterExpand"] = this.expandFlag;
    this.filterLoading = false;
    setTimeout(() => {
      this.filterLoading = true;      
    }, 50);
  }

}

