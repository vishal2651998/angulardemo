import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { CommonService } from '../../../services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { Router } from '@angular/router';
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage,
  DefaultNewImages, ContentTypeValues, DefaultNewCreationText, filterNames } from 'src/app/common/constant/constant';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ExportPopupComponent } from '../../common/export-popup/export-popup.component';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import {Table} from 'primeng/table';
import { KeyValue } from '@angular/common';
@Component({
  selector: 'app-market-place-reports',
  templateUrl: './market-place-reports.component.html',
  styleUrls: ['./market-place-reports.component.scss'],
  styles: [
    `
      .masonry-item {
        width: 240px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class MarketPlaceReportsComponent implements OnInit{
  public sconfig: PerfectScrollbarConfigInterface = {};

  public msTeamAccess = false;
  public msTeamAccessMobile = false;
  public headerFlag = false;
  public headerData: Object;
  public expandFlag = false;
  public sidebarActiveClass: Object;
  public threadTypesort = 'sortthread';
  public bodyElem;
  public bodyClass = 'landing-page';
  public pageData = pageInfo.marketPlacePage;
  public headTitle = '';
  public reports = [];
  public domainId;
  showPaymentUserDetailPopup: any = false;
  currentUserPaymentData: any;
  currentUserData: any;
  paymentCols = ["authcode", "cc_number", "cc_type", "cc_exp", "currency", "date", "responsetext", "transactionid", "condition", "amount", "ipaddress", "surcharge", "amount_authorinzed", "first name", "last name", "address", "postal code", "response_code", "type", "cvvresponse", "avsresponse", "processor_responsetext", "processor_response_code", "proessor_id", "warnings"];
  paymentColNames = ["Authorization Code", "CC Number", "CC Type", "CC Expiration Date", "Currency", "Transaction Date", "Response", "Transaction ID", "Condition", "Amount", "Tip", "Surcharge", "Amount Authorized", "First Name", "Last Name", "Address", "Postal Code", "Response Code", "Type", "CVV Response", "AVS Response", "Processor Response Text", "Processor Response Code", "Processor ID", "Warnings"];
  public usersExportData: any = [];
  loadingmarketplacemore: boolean = false;
  scrollCallback: boolean;
  scrollTop: any;
  public user: any;
  lastScrollTop: any = 0;
  scrollInit: number = 0;
  customerTotalRecords: any;
  dataLimit: any = 20;
  public exportDataFlag;
  public itemLimit = 20;
  public itemTotal = 0;
  public downloadtextflag = 'Exporting data to Excel..';
  dataOffset: any = 0;
  public excelreportdiaLog = false;
  public itemOffset = 0;
  public itemOffsetinitiate = false;
  public itemLength = 0;
  progressbarCount: any = '0';
  public stopexportapi = true;
  public exceldownloadtrue = false;
  public showLoader = false;
  reportsHeight = 180;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild('top', { static: false }) top: ElementRef;
  @ViewChild('marketReports', { static: false }) marketReports: Table;
  pageAccess = 'market-place-training';
  public updateMasonryLayout: any;
  public pageOptions: object = {
    expandFlag: false,
  };
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  // reportType: string = 'training';
  // selectedreportType = 'training';
  reportId;
  defaultInfoType = [{
    type: 'paymentSummary',
    label: 'Payment Summary',
    imgSrc: 'assets/images/service-provider/Payment-Summary-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Summary.png',
    isVisible: true
  }, {
    type: 'RegisterUserInfo',
    label: 'Register User Info',
    imgSrc: 'assets/images/service-provider/Register-User-Info-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Register-User-Info.png',
    isVisible: true
  }, {
    type: 'shippingInfo',
    label: 'Shipping Info',
    imgSrc: 'assets/images/service-provider/Shipping-Info-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Shipping-Info.png',
    isVisible: true
  },
  {
    type: 'paymentUserInfo',
    label: 'Payment User Info',
    imgSrc: 'assets/images/service-provider/Payment-User-Info-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-User-Info.png',
    isVisible: true
  }, {
    type: 'paymentDetails',
    label: 'Payment Details',
    imgSrc: 'assets/images/service-provider/Payment-Details-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true
  },
  {
    type: 'errorDetails',
    label: 'Payment Error Details',
    imgSrc: 'assets/images/service-provider/Payment-Details-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true
  },
  {
    type: 'refundDetails',
    label: 'Refund Details',
    imgSrc: 'assets/images/service-provider/Payment-Details-Normal.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true
  }
];
  infoType;
  SelectedInfoType = 'paymentSummary';
  manualsData: any;
  trainingsData: any;
  participantsData: any;
  transactionData: any;
  shippingAddressDetails: { 'First Name': any; 'Last Name': any; Email: any;
    'Phone Number': any; 'Address 1': any; 'Address 2': any; State: any; City: any; Zip: any; };
  paymentAddressDetails: { 'First Name': any; 'Last Name': any; Email: any;
    'Phone Number': any; 'Address 1': any; 'Address 2': any; State: any; City: any; Zip: any; };
  trainingsListDetails: any;
  manualsListDetails = [];
  totalManualPrice: number;
  isFilterApplied: boolean;
  sortFieldEvent: string;
  sortOrderField: number = 0;
  dataFilterEvent: any;
  scrollableCols: any;
  frozenCols: any;
  errorDetails: any;
  refundDetails: any;
  highlighted: any;
  rowTimeout: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateMasonryLayout = true;
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    console.debug("Scroll Event");
  }

  scroll = (event: any): void => {
    this.onScroll(event);
  };

  onScroll(event) {
    const inHeight = event.target.offsetHeight + event.target.scrollTop;
    const totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0 && !this.loadingmarketplacemore) {
        if (
          inHeight >= totalHeight &&
          parseInt(this.customerTotalRecords) > this.reports.length
        ) {
          this.loadingmarketplacemore = true;
          this.dataOffset += this.dataLimit;
          this.loadCustomers();
        }
    }
    this.lastScrollTop = this.scrollTop;
  }
  constructor(
    private threadApi: ThreadService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.headTitle = 'Reports';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.loadCustomers();
    this.msTeamAccess = false;
    this.msTeamAccessMobile = false;
    const url: any = this.router.url;
    const currUrl = url.split('/');
    this.bodyElem = document.getElementsByTagName('body')[0];
    window.addEventListener('scroll', this.scroll, true); //third parameter
    this.bodyElem.classList.add(this.bodyClass);
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}`
    );
  }
  mainPage() {
    this.router.navigateByUrl('market-place');
  }
  exportAsCSV() {
    this.itemOffset = 0;
    const title = 'Report Export';
    const exportInfo = [title, 'All'];
    this.exportUserALL(exportInfo);
  }
  exportAllUsers(exportData) {
    const usersData = exportData;
    if (this.itemOffsetinitiate == true) {
    }
    for (const users in usersData) {
      // const address = usersData[users].shippingAddress1 ? (usersData[users].shippingAddress1 + (usersData[users].shippingAddress2 ? ', ' + usersData[users].shippingAddress2 : '') + ', ' + usersData[users].shippingCity + ', ' + usersData[users].shippingState + ', ' + usersData[users].shippingZip) : '';
      let userListInfo=[...this.frozenCols,...this.scrollableCols].map((res)=>usersData[users][res.field]);
      this.usersExportData.push(userListInfo);
    }
    let threadListHeader;
    threadListHeader = [...this.frozenCols,...this.scrollableCols].map((res)=>res.header);
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Training Report');
    const openTitleRow = worksheet.addRow(['Training Report']);
    openTitleRow.font = { name: 'Calibri', family: 4, size: 20, bold: true };
    worksheet.mergeCells('A1:C1');
    worksheet.addRow([]);
    worksheet.addRow([]);
    const threadListHeaderRow = worksheet.addRow(threadListHeader);
    threadListHeaderRow.eachCell((cell, num) => {
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
      worksheet.getColumn(6).width = 30;
      worksheet.getColumn(6).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(7).width = 30;
      worksheet.getColumn(7).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(8).width = 30;
      worksheet.getColumn(8).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(9).width = 30;
      worksheet.getColumn(9).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(10).width = 30;
      worksheet.getColumn(10).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(11).width = 30;
      worksheet.getColumn(11).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(12).width = 30;
      worksheet.getColumn(12).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      worksheet.getColumn(13).width = 30;
      worksheet.getColumn(13).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
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
          fs.saveAs(blob, 'Data Report.xlsx');
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
  exportUserALL(exportInfo) {
    this.excelreportdiaLog = true;
    this.downloadtextflag = 'Exporting data to Excel..';
    let payload = {
      limit: this.itemLimit,
      offset: this.itemOffset,
      domainId: this.domainId,
    };
    this.exportDataFlag = this.threadApi.apiGetAllRepots(this.domainId, this.itemLimit, this.itemOffset, this.sortFieldEvent,
      this.sortOrderField, this.dataFilterEvent).subscribe((response) => {
      const exportData = response.data.reports.map((res)=>this.getReports(res));
      const totalCount = response.data.totalRecords;
      this.itemTotal = totalCount;
      if (this.itemOffset == 0) {
        this.itemOffsetinitiate = true;
      } else {
        this.itemOffsetinitiate = false;
      }
      this.itemLength += totalCount;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / totalCount) * 100).toFixed(0);
      if (totalCount == 0) {
      } else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.itemTotal) {
            this.exceldownloadtrue = true;
          }
          this.exportAllUsers(exportData);
        }
        if (this.itemOffset >= this.itemTotal) {
          this.stopexportapi = false;
        }
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

  // selectReportType(event) {
  //   this.reportType = event.value.value;
  //   // this.reports = [];
  //   this.loadCustomers();
  // }

  loadCustomers() {
    this.loadingmarketplacemore = true;
    this.scrollInit = 1;
    this.threadApi.apiGetAllRepots(this.domainId, this.dataLimit, this.dataOffset, this.sortFieldEvent,
      this.sortOrderField, this.dataFilterEvent).subscribe((response: any) => {
      if (response.status == 'Success') {
        // this.reports = response.data.reports.map((res)=>this.getReports(res));
        response.data.reports.forEach((data: any) => {
          this.reports.push(this.getReports(data));
        });
        this.customerTotalRecords = response?.data?.totalRecords;
        this.loadingmarketplacemore = false;
      }
    }, (error: any) => {
      this.loadingmarketplacemore = false;
      console.log('error: ', error);
    });
    this.isFilterApplied=false;
    this.setColumns();
  }

  setColumns() {
    this.frozenCols = [
      { field: 'id', header: 'ID', sortName: 'id', width: '50px' },
      { field: 'createdOnFormat', header: 'Purchase Date', sortName: 'createdOn', width: '100px' },
    ];
    this.scrollableCols = [
      { field: 'salesPerson', header: 'Sales Person', sortName: 'salesPerson', width: '50px' },
      { field: 'companyNameValue', header: 'Business Name', sortName: 'companyName', width: '50px' },
      { field: 'PaymentUserName', header: 'Payment User Name', sortName: 'paymentUserName', width: '50px' },
      { field: 'statusFeild', header: 'Payment Status', sortName: 'status', width: '50px' },
      { field: 'purchaseTypeValue', header: 'Purchase Type', width: '50px' },
      // { field: 'quantity', header: 'QTY', width: '100px' },
      { field: 'amountField', header: 'Amount', sortName: 'amount', width: '50px' },
    ];
  }

  getReports(data) {
    data.createdOnFormat = this.getDateTimeWithoutDotFormat(data.createdOn);
    data.companyNameValue = data?.companyName ? data?.companyName :  data?.firstName ? data?.firstName + ' ' + data?.lastName : '-'
    data.PaymentUserName = (data?.paymentFirstName ?  data?.paymentFirstName : data?.payment_first_name ? data?.payment_first_name : '') + ' ' + (data?.paymentLastName ? data?.paymentLastName : data?.payment_last_name ? data?.payment_last_name : '')
    data.statusFeild = ["VOID", "REFUNDED"].includes(data.status) ? "Refunded" : data?.status.toLowerCase() == 'paid' && (!data.amount || data.amount == '0') ? 'free' : data?.status.toLowerCase()
    data.shippingStatusFeild = data.shippingStatus || 'NA'
    data.trackingIdFeild = data.trackingId || 'NA'
    data.purchaseTypeValue = data.purchaseType ? data.purchaseType : data.trainingMode ? data.trainingMode : ((!data.trainingIds || data.trainingIds == '') && data.manualIds && data.manualIds != '') ? 'manual' : data.purchaseType;
    data.amountField = this.threadApi.isInt(data.amount ? data.amount : 0);
    return data;
  }

  getDateTimeWithoutDotFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY h:mm A');
    } else {
      return '';
    }
  }
  applySearch(action, val) { }
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh['toggleFlag'] = toggleFlag;
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 200);
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }

  setUserPaymentInfoData(userData) {
    this.router.navigateByUrl('market-place/report-details/' + userData.id);
    // this.transactionData = [];
    // this.infoType = [...this.defaultInfoType];
    // this.SelectedInfoType = 'paymentSummary';
    // this.infoType.map((res) => res.isVisible = true);
    // this.showPaymentUserDetailPopup = true;
    // this.showLoader = true;
    // this.threadApi.apiGetAllRepots(this.domainId, 1, 0, '', '', '', userData.id).subscribe((response: any) => {
    //   if (response.status == 'Success') {
    //     this.manualsData = response.data.manuals && response.data.manuals.length > 0 ? response.data.manuals : [];
    //     this.trainingsData = response.data.trainings && response.data.trainings.length > 0 ? response.data.trainings : [];
    //     this.participantsData = response.data.participants && response.data.participants.length > 0 ? response.data.participants : [];
    //     this.transactionData = response.data.transaction;

    //     if (!this.transactionData?.amount || this.transactionData?.amount == '0') {
    //       this.infoType[3].isVisible = false;
    //       this.infoType[4].isVisible = false;
    //     }


    //     if (this.manualsData.length == 0) {
    //       this.infoType[2].isVisible = false;
    //     }
    //     if (this.trainingsData.length == 0) {
    //       this.infoType[1].isVisible = false;
    //     }
    //     if (this.trainingsData.length > 0 && this.trainingsData[0]?.isError == 1) {
    //       this.infoType[4].isVisible = false;
    //       this.errorDetails = this.trainingsData[0]?.errorResponseType == 'json' ?
    //         JSON.parse(this.trainingsData[0]?.errorResponse) : this.trainingsData[0]?.errorResponse;
    //     }
    //     else if (this.manualsData.length > 0 && this.manualsData[0]?.isError == 1) {
    //       this.infoType[4].isVisible = false;
    //       this.errorDetails = this.manualsData[0]?.errorResponseType == 'json' ?
    //         JSON.parse(this.manualsData[0]?.errorResponse) : this.manualsData[0]?.errorResponse;
    //     }
    //     else {
    //       this.infoType[5].isVisible = false;
    //     }
    //     if (this.trainingsData.length > 0 && this.trainingsData[0]?.refund_response) {
    //       this.refundDetails = JSON.parse(this.trainingsData[0]?.refund_response);
    //     }
    //     if (this.manualsData.length > 0 && this.manualsData[0]?.refund_response) {
    //       this.refundDetails = JSON.parse(this.manualsData[0]?.refund_response);
    //     }

    //     if ((this.manualsData.length > 0 && this.manualsData[0]?.refund_response) || 
    //     (this.trainingsData.length > 0 && this.trainingsData[0]?.refund_response)) {
    //       this.infoType[6].isVisible = true;
    //     } else {
    //       this.infoType[6].isVisible = false;
    //     }

    //     this.currentUserPaymentData = '';
    //     if (response?.data?.transaction.payment_response != ''){
    //       this.currentUserPaymentData = JSON.parse(response.data.transaction.payment_response);
    //     }
    //     if (this.manualsData.length > 0) {
    //       this.shippingAddressDetails = {
    //         'First Name': this.manualsData[0].firstName,
    //         'Last Name': this.manualsData[0].lastName,
    //         Email: this.manualsData[0].email,
    //         'Phone Number': this.manualsData[0].phoneNumber,
    //         'Address 1': this.manualsData[0].shippingAddress1,
    //         'Address 2': this.manualsData[0].shippingAddress2,
    //         State: this.manualsData[0].shippingState,
    //         City: this.manualsData[0].shippingCity,
    //         Zip: this.manualsData[0].shippingZip
    //       };
    //       if (this.manualsData[0]?.originalPrice == '') {
    //         this.manualsData[0].originalPrice = 0;
    //         this.totalManualPrice = parseFloat(this.manualsData[0]?.shippingCost);
    //       } else {
    //         this.totalManualPrice = this.manualsData[0]?.discountPrice ? parseFloat(this.manualsData[0]?.discountPrice) : parseFloat(this.manualsData[0]?.originalPrice);
    //         this.totalManualPrice = this.totalManualPrice * parseFloat(this.manualsData[0]?.numberOfManuals);
    //         this.totalManualPrice = this.totalManualPrice + parseFloat(this.manualsData[0]?.salesTax) +  parseFloat(this.manualsData[0]?.shippingCost);
    //       }
    //     }
    //     this.paymentAddressDetails = {
    //       'First Name': this.transactionData.payment_first_name,
    //       'Last Name': this.transactionData.payment_last_name,
    //       Email: this.transactionData.payment_email,
    //       'Phone Number': this.transactionData.payment_phoneNumber,
    //       'Address 1': this.transactionData.payment_address_1,
    //       'Address 2': this.transactionData.payment_address_2,
    //       State: this.transactionData.payment_state,
    //       City: this.transactionData.payment_city,
    //       Zip: this.transactionData.payment_zip
    //     };
    //     this.trainingsListDetails = {},
    //     this.manualsListDetails = [],
    //     this.trainingsData.forEach(element => {
    //       const temp = {};
    //       temp['No. Of Participants'] = this.participantsData.length;
    //       temp['Regular Price'] = `$${element.actual_price}`;
    //       if (element.bird_price != '') {
    //         let keyName = 'Discount Price (' + element.bird_percentage + '%) off';
    //         if (element.bird_price == element.bird_price_original) {
    //           keyName = 'Early Bird ' + keyName;
    //         }
    //         temp[keyName] = `${element.numberOfSeats} X ${element.bird_price}`;
    //       }
    //       this.trainingsListDetails =  temp;
    //     });
    //     this.showLoader = false;
    //   }
    // }, (error: any) => {
    //   this.loadingmarketplacemore = false;
    //   this.showLoader = false;
    //   console.log('error: ', error);
    // });

    // this.currentUserData = JSON.parse(JSON.stringify(userData));
    // if (userData?.payment_response) {
    //   this.showPaymentUserDetailPopup = true;
    // }
  }

  redirectToInnerDetailPage(id: any, type: string) {
    if(type == 'manual') window.open('market-place/view-manual/' + id, '_blank');
    else window.open('market-place/view/' + id, '_blank');
  }

  getInfoData(type: string){
    this.SelectedInfoType = type;
  }

  /* Listner for reports data scroll */
  lazyLoad(event: LazyLoadEvent) {
    let keys = Object.keys(event.filters)
    keys.forEach((key: any) => {
      if (event.filters[key][0]?.value) {
        this.isFilterApplied = true;
      }
    })
    if (event.sortField) {
      this.isFilterApplied = true;
    }
    this.sortFieldEvent = event.sortField;
    this.sortOrderField = event.sortOrder;
    this.dataFilterEvent = event.filters ? JSON.stringify(event.filters) : '';
    if (this.isFilterApplied) {
      this.reports = [];
      this.dataOffset = 0;
      this.loadCustomers();
    }
  }

unsorted = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
  return 0
}

  rowColor(data: any) {
    this.highlighted = data;
    if (this.rowTimeout) {
      clearTimeout(this.rowTimeout);
    }
    this.rowTimeout = setTimeout(() => {
      this.highlighted = null;
    }, 30000);
  }

}
