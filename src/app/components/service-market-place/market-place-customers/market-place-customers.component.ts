import { Component, OnInit, ViewChild, OnDestroy, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage, DefaultNewImages, ContentTypeValues, DefaultNewCreationText, MarketPlaceText } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../services/landingpage/landingpage.service';
import { NgbModal, NgbModalConfig, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ThreadService } from "src/app/services/thread/thread.service";
import { NgxMasonryComponent } from "ngx-masonry";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuccessModalComponent } from "../../common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../common/submit-loader/submit-loader.component";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";
import { ExportPopupComponent } from "../../common/export-popup/export-popup.component";
import { CustomerListComponent } from "src/app/components/common/customer-list/customer-list.component";
import { MarketplaceSidebarComponent } from "src/app/layouts/marketplace-sidebar/marketplace-sidebar.component";
import { Workbook } from "exceljs";
import * as fs from 'file-saver';
import { ActionFormComponent } from "../../common/action-form/action-form.component";
import { HttpEvent, HttpEventType } from "@angular/common/http";

@Component({
  selector: "app-market-place-customers",
  templateUrl: "./market-place-customers.component.html",
  styleUrls: ["./market-place-customers.component.scss"],
  styles: [
    `
      .masonry-item {
        width: 238px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class MarketPlaceCustomersComponent implements OnInit, OnDestroy {
  msidebarRef: MarketplaceSidebarComponent;
  customerPageRef: CustomerListComponent;
  public title: string = "Market Place Training";
  public sconfig: PerfectScrollbarConfigInterface = {};
  serviceProviderData: any = [];
  public headTitle: string = "";
  public filterInitFlag: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public expandFlag: boolean = false;
  public filterActiveCount: number = 0;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  pageAccess: string = "market-place-quiz";
  public disableRightPanel: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public updateMasonryLayout: any;
  public pageData = pageInfo.marketPlacePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "market-place/manage";
  public groupId: number = 2;
  public threadTypesort = "sortthread";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
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
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;
  loading: any =false;
  manageTitle: any = `${ManageTitle.actionNew} ${MarketPlaceText.customer}`;
  buttonTitle: any = 'Save';
  public thumbView: boolean = true;
  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public dashView: boolean = false;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public searchVal;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public access: string;
  public msTeamAccessMobile: boolean = false;
  scrollCallback: boolean;
  scrollTop: any;
  lastScrollTop: any = 0;
  scrollInit: number = 0;
  customerTotalRecords: any;
  dataLimit: any = 20;
  dataOffset: any = 0;
  loadingmarketplacemore: boolean = false;
  pageTitleText = PageTitleText.MarketPlace;
  redirectionPage = RedirectionPage.MarketPlace;
  displayNoRecordsShow = 3;
  contentTypeDefaultNewImg = DefaultNewImages.MarketPlace;
  contentTypeValue = ContentTypeValues.MarketPlace;
  contentTypeDefaultNewText = DefaultNewCreationText.MarketPlace;
  contentTypeDefaultNewTextDisabled: boolean = false;
  customers: any = [];
  customerSubmit = false;
  customerForm: FormGroup;
  public modelDisable:boolean = true;
  public modelLoading:boolean = false;
  public modalState = 'new';
  public modelPlaceHoder = "Select";
  showOptions: any = false;
  selectedOptions: any = 'Multiple Choice - Single Answer';
  uploadedItems: any = [];
  public manageAction: string;
  public newPartInfo: string = "Get started by tapping on \"New Training\"";
  displayModal: any = false;
  postApiData: any;
  contentType: any = 44;
  displayOrder: any = 0;
  public EditAttachmentAction: string = "attachments";
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  actionFlag: any = false;
  showTopicError: any = false;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  currentCustomerId: any;
  multiSelectOptionsValue: any = [];
  displayViewModal: any = false;
  customerCurrentData: any;
  currentCustomerOptions: any;
  optionValue: any;
  topicLabel: any;
  systemInfo: any;
  loadingSubmitForm: any = false;
  topicFormValue: any = [];
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  stateValue: any;
  phoneValue: any;
  countryDropDownOptions: any = [];
  countryValue: any = "1";
  stateDropDownOptions: any;
  empty: any = [];
  progressbarCount: any = '0';
  public exportDataFlag;
  public downloadtextflag='Exporting data to Excel..';
  public excelreportdiaLog: boolean = false;
  public exceldownloadtrue:boolean= false;
  public stopexportapi:boolean= true;
  public itemOffset: number = 0;
  public itemLimit: number = 20;
  public usersExportData: any = [];
  public itemTotal: number = 0;
  public itemOffsetinitiate:boolean= false;
  public itemLength: number = 0;
  usersDataHeader: any = [
    "Customer Name",
    "Email",
    "Company Name",
    "No of Trainings",
    "Phone Number",
    "Address"
  ]
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLabel: string = "Upload Customers";
  filesArr: any;
  public uploadTxt: string = "Uploading...";
  public successMsg: string = this.uploadTxt;
  public errModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  progress: any = 0;
  public loadedSoFar = 0;
  percentDone: any = 0;

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (
        inHeight >= totalHeight &&
        parseInt(this.customerTotalRecords) > this.customers.length
      ) {
        this.loadingmarketplacemore = true;
        this.dataOffset += this.dataLimit;
        this.loadCustomers();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.updateMasonryLayout = true;
  }
  @HostListener('document:click', ['$event'])
  clickout() {
    this.showOptions = false;
  }

  constructor(
    private threadApi: ThreadService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private LandingpagewidgetsAPI: LandingpageService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    this.customerForm = this.formBuilder.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'address1': ['', [Validators.required]],
      'address2': [''],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'country': ['', [Validators.required]],
      'zip': ['', [Validators.required]],
      'companyName': [''],
    });
  }

  get customerControls() { return this.customerForm.controls; }

  ngOnInit(action = '') {
    this.msTeamAccess = false;
    this.msTeamAccessMobile = false;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.headTitle = "Customers";
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle} Customers`
    );
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.thumbView = true;
    let threadViewType:any = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = threadViewType;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    this.postApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      action: action,
      threadAction:  ''
    };
    //this.loadCustomers();
    this.loadCountryStateData();
    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      searchKey: this.searchVal,
      historyFlag: this.historyFlag,
      pushAction: false
    };
    this.apiData = apiInfo;
    this.filterOptions["apiKey"] = Constant.ApiKey;
    this.filterOptions["userId"] = this.userId;
    this.filterOptions["domainId"] = this.domainId;
    this.filterOptions["countryId"] = this.countryId;
    let viewType = this.thumbView ? "thumb" : "list";
    this.filterOptions["threadViewType"] = viewType;
    let year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    setTimeout(() => {
      this.loading = false;
      this.apiData["groupId"] = this.groupId;
      this.apiData["mediaId"] = 0;
      this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
      this.filterInterval = setInterval(() => {
        let filterWidget = localStorage.getItem("filterWidget");
        let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
        if (filterWidget) {
          this.filterOptions = filterWidgetData.filterOptions;
          this.apiData = filterWidgetData.apiData;
          this.threadFilterOptions = this.apiData["filterOptions"];
          this.apiData["onload"] = true;
          this.threadFilterOptions = this.apiData["onload"];
          this.filterActiveCount = filterWidgetData.filterActiveCount;
          this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
          this.apiData["filterOptions"] = this.apiData["filterOptions"];
          this.apiData["filterOptions"]["action"] = action;
          this.commonService.emitMessageLayoutrefresh(
            this.apiData["filterOptions"]
          );
          this.filterLoading = false;
          this.filterOptions["filterLoading"] = this.filterLoading;
          clearInterval(this.filterInterval);
          localStorage.removeItem("filterWidget");
          localStorage.removeItem("filterData");
        }
      }, 50);
    }, 1500);
    setTimeout(() => {
      let chkData = localStorage.getItem('threadPushItem');
      let data = JSON.parse(chkData);
      if(data) {
        data.action = 'silentCheck';
      }
    }, 15000);
  }

  attachments(items) {
    this.uploadedItems = items;
  }

  exportAsCSV() {
    this.itemOffset=0;
    let title = "Customer Export";
    let exportInfo = [title,'All'];
    this.exportUserALL(exportInfo);
  }

  exportUserALL(exportInfo) {
    this.excelreportdiaLog=true;
    this.downloadtextflag='Exporting data to Excel..';
    let payload = {
      limit: this.itemLimit,
      offset: this.itemOffset,
      domainId: this.domainId,
    }
    this.exportDataFlag= this.threadApi.apiGetAllCustomerData(payload).subscribe((response) => {
      let exportData = response.data.marketPlaceUsers;
      let total_count = response.data.totalRecords;
      this.itemTotal=total_count;
      if(this.itemOffset==0) {
        this.itemOffsetinitiate=true;
      } else {
        this.itemOffsetinitiate=false;
      }
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount=((this.itemOffset/total_count)*100).toFixed(0);
      if (total_count == 0) {
      } else {
        if(this.stopexportapi) {
          if(this.itemOffset>=this.itemTotal) {
            this.exceldownloadtrue=true;
          }
          this.exportAllUsers(exportData);
        }
        if(this.itemOffset>=this.itemTotal) {
          this.stopexportapi=false;
        }
      }
    });
  }

  exportAllUsers(exportData) {
    let usersData = exportData;
    if (this.itemOffsetinitiate == true) {
    }
    for (const users in usersData) {
      const customerName = usersData[users].firstName + ' ' + usersData[users].lastName;
      const email = usersData[users].email;
      const companyName = usersData[users].companyName;
      const noOfTrainings = usersData[users]?.noOfTrainings ? usersData[users]?.noOfTrainings : '-';
      const phoneNumber = usersData[users].dialCode + usersData[users].phoneNumber;
      const address = usersData[users].address_1 ? (usersData[users].address_1 + (usersData[users].address_2 ? ', ' + usersData[users].address_2 : '') + ', ' + usersData[users].city + ', ' + usersData[users].state + ', ' + usersData[users].zip) : '';
      let userListInfo;
      userListInfo = [customerName, email, companyName, noOfTrainings, phoneNumber, address];
      this.usersExportData.push(userListInfo);
    }
    let threadListHeader;
    threadListHeader = this.usersDataHeader;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Customer Report');
    let openTitleRow = worksheet.addRow(['Customer Report']);
    openTitleRow.font = { name: 'Calibri', family: 4, size: 20, bold: true };
    worksheet.mergeCells('A1:C1');
    worksheet.addRow([]);
    worksheet.addRow([]);
    let threadListHeaderRow = worksheet.addRow(threadListHeader);
    threadListHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    this.usersExportData.forEach((tl: any) => {
      worksheet.addRow(tl);
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(1).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(2).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(3).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(4).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(5).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(6).width = 50;
      worksheet.getColumn(6).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.properties.defaultRowHeight = 30;
    });
    worksheet.addRow([]);
    worksheet.addRow([]);
    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.downloadtextflag = 'Processing Excel';
      setTimeout(() => {
        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Customer Data Report.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.excelreportdiaLog = false;
        this.downloadtextflag = 'Exporting data to Excel..';
      }, 3000);
    } else {
      this.exportUserALL('');
    }
  }
  onUpload(event: any) {
    this.filesArr = event;
    let file = event.currentFiles[0];
    let uploadFlag = (event.currentFiles.length > 0) ? true : false;
    if(uploadFlag) {
      let deleteFlag:any = 0;
      let popupFlag = true;

      if(popupFlag) {
        let uaccess = 'Customer';
        let uploadAccess = `Upload ${uaccess}`;
        let actionInfo = {fileName: file.name};
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = uploadAccess;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
          console.log(receivedService)
          let uploadFileFlag = receivedService.flag;
          modalRef.dismiss('Cross click');
          deleteFlag = (receivedService.deleteFlag) ? 1 : 0;
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
    let payload = {
      file: file,
      deleteFlag: deleteFlag,
      domainId: this.domainId,
      userId: this.userId
    }
    let totalTemp = 0;
    this.loading = true;
    this.threadApi.apiForUploadCustomerData(payload).subscribe((event: HttpEvent<any>) => {
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
          let status = resBody.status;
          const result = resBody.data;
          // let timeout = (status == 'Failure') ? 0 : 3000;
          this.loading = false;
          this.progress = 0;
          if(status == "Failure" || status == "FILE_VALIDATION_ERROR") {
            this.successMsg = resBody.message;
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            msgModalRef.componentInstance.statusFlag = false;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              this.successMsg = this.uploadTxt;
            }, 3000);
          } else if (status == 'Success') {
            this.successMsg = resBody.message;
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            msgModalRef.componentInstance.statusFlag = true;
            setTimeout(() => {
              this.customers = [];
              msgModalRef.dismiss('Cross click');
              this.loadCustomers();
            }, 3000);
          }
          break;
      }
    }, (error: any) => {
      this.progress = 0;
      this.loading = false;
    })
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropDownOptions = response.data.countryData;
        this.stateDropDownOptions = response.data.stateData;
      }
    }, (error: any) => {
    });
  }

  async getStatesDropdownData(value: any) {
    if (value) {
      await this.threadApi.stateMasterData(value).subscribe((response: any) => {
        if (response.status == "Success") {
          this.stateDropDownOptions = response.data.stateData;
        }
      }, (error: any) => {
      })
    } else {
      this.stateDropDownOptions = [];
    }
  }

  attachmentAction(data) {
    console.log(data);
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;

    switch (action) {
      case "file-delete":
        this.deletedFileIds.push(fileId);
        break;
      case "order":
        let attachmentList = data.attachments;
        for (let a in attachmentList) {
          let uid = parseInt(a) + 1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(
            (option) => option.fileId == ufileId
          );
          if (uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: flagId == 6 ? attachmentList[a].url : "",
              displayOrder: uid,
            };
            this.updatedAttachments.push(fileInfo);
          } else {
            this.updatedAttachments[uindex].displayOrder = uid;
          }
        }
        break;
      default:
        let updatedAttachmentInfo = {
          fileId: fileId,
          caption: caption,
          url: url,
        };
        let index = this.updatedAttachments.findIndex(
          (option) => option.fileId == fileId
        );
        if (index < 0) {
          updatedAttachmentInfo["displayOrder"] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
        }

        console.log(this.updatedAttachments);
        break;
    }
  }

  loadCustomers() {
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: this.domainId,
    }
    this.scrollInit = 1;
    this.threadApi.apiGetAllCustomerData(payload).subscribe((response: any) => {
      if (response.status == 'Success') {
        if (response && response.data && response.data.marketPlaceUsers && response.data.marketPlaceUsers.length) {
          response.data.marketPlaceUsers.forEach((data: any) => {
            this.customers.push(data);
          });
        }
        this.customerTotalRecords = response?.data?.totalRecords;
      }
    }, (error: any) => {
      console.log("error: ", error);
    })
  }

  rediretToNew() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/market-place/manage'])
    );
    window.open(url, '_blank');
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY')
    } else {
      return '';
    }
  }
  getDateFormatStartDate(value: any) {
    if (value) {
      return moment(value).format('MMM DD')
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A')
    } else {
      return '';
    }
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }
  expandDomainAction(event: any) {
    console.log(event);
  }
  applyFilter(filterData,loadpush='') {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      if(loadpush) {
        filterData["loadAction"] = 'push';
        this.apiData['pushAction'] = true;
        let filterOptionData = this.filterOptions['filterData'];
        if(filterData.startDate != undefined || filterData.startDate != 'undefined') {
          let sindex = filterOptionData.findIndex(option => option.selectedKey == 'startDate');
          if(sindex >= 0) {
            filterOptionData[sindex].value = filterData.startDate;
          }
          let eindex = filterOptionData.findIndex(option => option.selectedKey == 'endDate');
          if(eindex >= 0) {
            filterOptionData[eindex].value = filterData.endDate;
          }
        }
      }
      this.apiData["filterOptions"] = filterData;
      setTimeout(() => {
        filterData["loadAction"] = '';
      }, 500);
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
      let viewType = this.thumbView ? "thumb" : "list";
      filterData["threadViewType"] = viewType;
      filterData["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(filterData);
      setTimeout(() => {
        this.filterLoading = false;
      }, 1000);
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem("threadFilter");
    this.ngOnInit('reset');
    //this.commonService.emitMessageLayoutrefresh('');
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
    this.applyFilter(getFilteredValues,event);
  }

  filterCheck(){
    this.filterrecords = false;
    if(this.pageRefresh['orderBy'] != 'desc'){
      this.filterrecords = true;
    }
    if(this.pageRefresh['type'] != 'sortthread'){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  navPart() {
    let url = this.newThreadUrl;
    window.open(url, IsOpenNewTab.teamOpenNewTab);
  }

  mainPage() {
    this.router.navigateByUrl('market-place');
  }

  innerDetailPage() {
    this.router.navigateByUrl('market-place/training');
  }

  viewDetail(id: any) {
    this.router.navigateByUrl('market-place/view/'+ id);
  }

  ngOnDestroy() {
  }

  saveCustomer() {
    if (this.customerForm.valid) {
      this.loadingSubmitForm = true;
      this.customerSubmit = false;
      const customerFromValue = this.customerForm.value;
      customerFromValue.domainId = this.domainId;
      let stateLabel = this.stateDropDownOptions.filter(state => state.id == customerFromValue.state);
      customerFromValue.state = stateLabel[0].name;
      let countryLabel = this.countryDropDownOptions.filter(country => country.id == customerFromValue.country);
      customerFromValue.country = countryLabel[0].name;
      let url = this.threadApi.apiForCustomerAdd(customerFromValue);
      if (this.currentCustomerId) {
        customerFromValue.id = this.currentCustomerId;
        url =this.threadApi.apiForCustomerUpdate(customerFromValue);
      }
      url.subscribe((response: any) => {
        let successMessage = response.message;
        this.loadingSubmitForm = false;
        this.displayModal = false;
        const msgModalRef = this.modalService.open(
          SuccessModalComponent,
          this.config
        );
        msgModalRef.componentInstance.successMessage = successMessage;
        setTimeout(() => {
          msgModalRef.dismiss("Cross click");
          this.customers = [];
          this.loadCustomers();
        }, 2000);
      }, (error: any) => {
        console.log("error: ", error);
        this.loadingSubmitForm = false;
      })
    } else {
      this.customerSubmit = true;
    }
  }

  closeCustomerForm() {
    this.displayModal = false;
  }

  isVideo(ext :any) {
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }

  openCustomerPopup() {
    this.currentCustomerId = null;
    this.displayModal = true;
    this.customerSubmit = false;
    this.customerForm.reset();
    this.countryValue = "1";
    this.getStatesDropdownData(this.countryValue);
  }

  openDelete(customer: any) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteCustomer(customer.id);
      }
    });
  }

  deleteCustomer(id: any) {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    this.threadApi.apiForCustomerDelete(id).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.modalConfig
      );
      msgModalRef.componentInstance.successMessage = response.message;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        this.customers = [];
        this.loadCustomers();
      }, 2000);
    });
  }

  setUserPopup(event: any) {
    this.customerSubmit = false;
    this.customerForm.reset();
    this.currentCustomerId = null;
    this.displayModal = event;
    this.buttonTitle = 'Save';
  }

  viewCurrentCustomer(customerData: any) {
    // this.displayViewModal = true;
    this.customerCurrentData = customerData;
    // console.log(customerData);
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: this.domainId,
      userEmail: customerData.userEmail,
    }
    this.scrollInit = 1;
    this.threadApi.apiGetAllCustomerUsers(payload).subscribe((response: any) => {
      if (response.status == 'Success') {
        console.log(response);
        if (response && response.data && response.data.marketPlaceUsers && response.data.marketPlaceUsers.length) {
          response.data.marketPlaceUsers.forEach((data: any) => {
          });
        }
        this.customerTotalRecords = response?.data?.totalRecords;
      }
    }, (error: any) => {
      console.log("error: ", error);
    })
  }


  getDateTimeFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY . h:mm A');
    } else {
      return '';
    }
  }

  downloadTemplate() {
    let pageAccess;
    let reportName = 'Customers Template';
    let info =  'Sheet1';
    pageAccess = 'customer-template';
    let apiData = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId,
      fileName: reportName
    };
    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.exportInfo = info;
    modalRef.componentInstance.exportData = this.empty;
    modalRef.componentInstance.access = pageAccess;
    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      console.log(receivedService)
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
  }

  cancelUpload() {
    this.exportDataFlag.unsubscribe();
    this.downloadtextflag = 'Canceling Export';
    this.excelreportdiaLog = false;
    this.exceldownloadtrue = false;
    this.stopexportapi = true;
    this.itemOffset = 0;
    this.usersExportData = [];
    this.progressbarCount = '0';
  }

  openEditPopup(customer: any) {
    this.customerSubmit = false;
    this.customerForm.reset();
    this.customerCurrentData = customer;
    this.currentCustomerId = customer?.id;
    this.manageTitle = `${ManageTitle.actionEdit} ${MarketPlaceText.customer} - ${customer?.firstName} ${customer?.lastName}`;
    this.buttonTitle = 'Update';
    this.displayModal = true;
    this.countryValue = null;
    this.stateValue = null;
    let phoneObject: any ={
      number: this.customerCurrentData?.phoneNumber,
      internationalNumber: this.customerCurrentData?.internationalNumber,
      nationalNumber: this.customerCurrentData?.phoneNumber,
      e164Number: this.customerCurrentData?.e164Number,
      countryCode: this.customerCurrentData?.countryCode,
      dialCode: this.customerCurrentData?.dialCode,
    };
    const country = this.countryDropDownOptions.filter(countryData => countryData.name == this.customerCurrentData?.country);
    const countryId = country[0]?.id;
    this.countryValue = countryId;
    const state = this.stateDropDownOptions.filter(stateData => stateData.name == this.customerCurrentData?.state);
    const stateId = state[0]?.id;
    this.customerForm.patchValue({
      'firstName': this.customerCurrentData?.firstName,
      'lastName': this.customerCurrentData?.lastName,
      'email': this.customerCurrentData?.email,
      'companyName': this.customerCurrentData?.companyName,
      'phoneNumber': phoneObject,
      'address1': this.customerCurrentData?.address_1,
      'address2': this.customerCurrentData?.address_2,
      'city': this.customerCurrentData?.city,
      'zip': this.customerCurrentData?.zip,
      'country': countryId,
      'state': stateId
    });
  }

  customerCallback(data) {
    console.log(data)
    this.customerPageRef = data;
    this.dashView = (data.view == 2) ? true : false;
    if(data.view == 2) {
      console.log(this.msidebarRef)
      /* let menuId = (data.summaryFlag) ? 1 : 2; 
      this.msidebarRef.dispatchMenu.forEach(item => {
        item.activeClass = (item.id == menuId) ? true : false;
      }); */
    }
  }

}
