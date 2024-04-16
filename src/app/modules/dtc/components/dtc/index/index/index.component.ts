import { Component, ViewChild, HostListener, ElementRef, OnInit } from "@angular/core";
import { Constant, RedirectionPage, PageTitleText } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { UploadService } from 'src/app/services/upload/upload.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { ExportPopupComponent } from 'src/app/components/common/export-popup/export-popup.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Table } from "primeng/table";
import * as moment from "moment";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;

  public title: string = "DTC List";
  public bodyClass: string = "dtc-list";
  public bodyClass1: string = "parts-list";
  public bodyElem;
  public footerElem;
  public headerFlag: boolean = false;
  public headerData: Object;
  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = true;
  public countryId;
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public resize: boolean = false;
  public searchVal: string = "";
  public pageAccess: string = "dtc";
  public dtcType: string = "emission";
  public expandFlag: boolean = false;
  public rightPanel: boolean = false;
  public dtcListColumns: any = [];
  public dtcList: any = [];
  public empty: any = [];
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public msTeamAccess: boolean = false;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public pageTitleText: string = '';
  public displayNoRecordsShow = 0;
  public newPartInfo: string = "";
  public dtcUrl: string = RedirectionPage.Dtc;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public opacityFlag: boolean = false;
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLable: string = "Upload DTC File (xls)";
  public chooseIcon: string = "";
  
  public dtcData = {
    apiKey: this.apiKey,
    countryId: "",
    domainId: 0,
    userId: 0,
    type: this.dtcType,
    searchKey: this.searchVal,
    offset: this.itemOffset,
    limit: this.itemLimit
  };

  public tvsDomain: boolean = false;
  filesArr: any;
  uploadedFiles: any[] = [];
  attachments: any[] = [];
  public attachmentProgress: boolean = false;
  public uploadTxt: string = "Uploading...";
  public successMsg: string = this.uploadTxt;
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public uploadFlag: any = null;
  public loadedSoFar = 0;
  public progress = 0;
  public percentDone = 0;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public errModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    localStorage.removeItem("searchValue");
    let teamSystem = localStorage.getItem("teamSystem");
    this.msTeamAccess =  (teamSystem) ? true : false;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      this.dtcData["domainId"] = this.domainId;
      this.dtcData["countryId"] = this.countryId;
      this.dtcData["userId"] = this.userId;
      this.dtcListColumns = [
        {field: 'name', header: 'Emissions', columnpclass:'w1 header thl-col-1 col-sticky'},
        {field: 'dtc_count', header: 'DTC Count', columnpclass: 'w2 header thl-col-2'},
        {field: 'uploadFlag', header: 'Upload', columnpclass: 'w3 header thl-col-3'},
        {field: 'downloadFlag', header: 'Download', columnpclass: 'w4 header thl-col-4'},
        {field: 'view_flag', header: 'View', columnpclass: 'w5 header thl-col-5'},
        {field: 'uploaded_by', header: 'Last Uploaded By', columnpclass: 'w6 header thl-col-6'},
        {field: 'uploaded_on', header: 'Last Uploaded On', columnpclass: 'w7 header thl-col-7'},
      ];
      
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
        searchVal: "",
      };

      this.getDTCList();

    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  // GET DTC List
  getDTCList() {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.commonApi.getDTCLists(this.dtcData).subscribe((response) => {
      this.loading = false;
      this.lazyLoading = this.loading;
      console.log(response)
      let resultData = response.data.items;
      console.log(resultData)
      this.scrollCallback = true;
      this.scrollInit = 1;
      this.itemEmpty = false;
      this.itemTotal = response.total;
      this.itemLength += resultData.length;
      this.itemOffset += this.itemLimit;
      if (this.itemTotal == 0 && this.itemOffset == 0) {
        this.dtcList = [];
        this.itemEmpty = false;
        // modified date - 14-10-2021 - start
        this.displayNoRecords = this.itemTotal > 0 ? false : true;
        this.displayNoRecordsShow = 2;
      }
     // this.dtcList = JSON.parse(resultData);
      resultData.forEach((item, i) => {
        let localCreatedDate = item.uploaded_on;
        if(localCreatedDate != '-') {
          let createdDate = moment.utc(localCreatedDate).toDate();
          localCreatedDate = moment(createdDate).local().format("MMM DD, YYYY h:mm A");
        }
        item.uploaded_on = localCreatedDate;
        this.dtcList.push(item);
      });
    });
  }

  onUpload(event, item, index) {
    this.filesArr = event;
    console.log(event)
    let uploadFlag = (event.currentFiles.length > 0) ? true : false;
    if(uploadFlag) {
      let file = event.currentFiles[0];
      let fileExtn = file.name.split('.').pop();
      file.thumbFilePath = `${this.mediaPath}/xls-medium.png`;
      file.fileSize = this.commonApi.niceBytes(file.size);
      this.attachments.push(file);
      this.attachmentProgress = true
      let typeId = [item.id];
      let apiData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        action: 'upload',
        type: this.dtcType,
        typeName: item.name,
        typeId: JSON.stringify(typeId)
      };
      let totalTemp = 0;
      return new Promise<void>((resolve, reject) => {
        this.uploadService.upload(this.pageAccess, apiData, file).subscribe((event: HttpEvent<any>) => {
          console.log(event);
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
              console.log(`Uploaded! ${this.progress}%`);
              break;
            case HttpEventType.Response:
              totalTemp = this.loadedSoFar;
              this.percentDone = 100;
              this.progress = this.percentDone;
              console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
              let resBody = event.body;
              resolve();
              let status = resBody.status;
              let resData = resBody.data;
              let timeout = (status == 'Failure') ? 0 : 3000;
              setTimeout(() => {
                this.attachmentProgress = false;
                this.progress = 0;
                this.attachments = [];
                if(status == "Failure") {
                  this.successMsg = resBody.result;
                  const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
                  msgModalRef.componentInstance.successMessage = this.successMsg;
                  msgModalRef.componentInstance.statusFlag = false;
                  setTimeout(() => {
                    msgModalRef.dismiss('Cross click');
                    this.successMsg = this.uploadTxt;
                  }, 3000);            
                } else {
                  this.dtcList[index].dtc_count = resData.dtc_count;
                  this.dtcList[index].download_flag = resData.download_flag;
                  this.dtcList[index].view_flag = resData.view_flag;
                  this.dtcList[index].uploaded_by = resData.uploaded_by;
                  let localCreatedDate = resData.uploaded_on;
                  if(localCreatedDate != '-') {
                    let createdDate = moment.utc(localCreatedDate).toDate();
                    localCreatedDate = moment(createdDate).local().format("MMM DD, YYYY h:mm A");
                  }
                  this.dtcList[index].uploaded_on = localCreatedDate;
                  this.successMsg = resBody.result;
                  const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
                  msgModalRef.componentInstance.successMessage = this.successMsg;
                  setTimeout(() => {
                    msgModalRef.dismiss('Cross click');
                    this.successMsg = this.uploadTxt;
                  }, 3000);
                }
              }, timeout);
              break;
          }
        },
        err => {
          this.attachments = [];
          this.attachmentProgress = false;
          this.progress = 0;      
        });
      })
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

  // Download DTC
  downloadDTC(item, action) {
    let pageAccess = (action == 'emission') ? this.pageAccess : 'dtc-template';
    let typeId = (action == 'emission') ? [item.id] : this.empty;
    let info =  (action == 'emission') ? item.name : 'Emission Type';
    let uploadedOn = (action == 'emission') ? item.uploaded_on : '';
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      type: this.dtcType,
      typeId: JSON.stringify(typeId),
      searchKey: this.searchVal,
      uploadedOn: uploadedOn,
    };
    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.exportInfo = info;
    modalRef.componentInstance.exportData = this.empty;
    modalRef.componentInstance.access = pageAccess;
    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
  }

  // Manage Error Codes
  manageErrorCodes(item) {
    let flag = item.view_flag;
    let typeId = [item.id];
    if(!flag) {
      return false;
    }
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight+20));  
    this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;
    let vinfo = [];
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      vehicleInfo: JSON.stringify(vinfo),
      type: this.dtcType,
      typeId: JSON.stringify(typeId)
    };

    let inputData = {
      title: `${this.dtcType} Error Code`
    };

    let filteredErrorCodeIds = [], filteredErrorCodes = [];
    
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = 'Error Codes';
    modalRef.componentInstance.emissionType = item.name;
    modalRef.componentInstance.checkboxFlag = false;
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.filteredErrorCodes = filteredErrorCodeIds;
    modalRef.componentInstance.filteredLists = filteredErrorCodes;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight-140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click');
    });
  }

  // Apply Search
  applySearch(action, val) {
    console.log(action, val)
    this.searchVal = val;
    this.dtcData.searchKey = val;
    this.itemLimit = 20;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.itemTotal = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.loading = true;
    this.displayNoRecords = false;
    this.dtcList = [];
    this.getDTCList();
  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.lazyLoading = true;
          this.scrollCallback = false;
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

}
