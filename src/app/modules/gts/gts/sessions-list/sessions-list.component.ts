import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { KeyValue } from '@angular/common';
import { GtsService } from 'src/app/services/gts/gts.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
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
export class SessionsListComponent implements OnInit {
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
  public headTitle = '';
  public sessions = [];
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
  reportsHeight = 160;
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
  infoType;
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
  public apiKey;
  public countryId;
  public userId;
  public roleId;
  public gtsSessionId;

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
        parseInt(this.customerTotalRecords) > this.sessions.length
      ) {
        this.loadingmarketplacemore = true;
        this.dataOffset += this.dataLimit;
        this.loadSessions();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
  constructor(
    private threadApi: ThreadService,
    private gtsService: GtsService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private location:Location

  ) { }

  ngOnInit(): void {

    // let authFlag =
    // (this.domainId == "undefined" || this.domainId == undefined) &&
    //   (this.userId == "undefined" || this.userId == undefined)
    //   ? false
    //   : true;

    //   if(authFlag) {
    //     this.gtsSessionId = this.route.snapshot.params["gid"];
    //     this.apiKey = "dG9wZml4MTIz";
    //   }
    this.gtsSessionId = this.route.snapshot.params["gid"];
    this.apiKey = "dG9wZml4MTIz";
    this.headTitle = 'GTS Sessions (GTS Run)';
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid;
    this.countryId = this.user.countryId;
    this.domainId = this.user.domain_id;
    this.loadSessions();
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

  previousPage() {
    // this.router.navigateByUrl('gts');
    this.location.back();
  }

  exportAllUsers(exportData) {
    const usersData = exportData;
    if (this.itemOffsetinitiate == true) {
    }
    for (const users in usersData) {
      // const address = usersData[users].shippingAddress1 ? (usersData[users].shippingAddress1 + (usersData[users].shippingAddress2 ? ', ' + usersData[users].shippingAddress2 : '') + ', ' + usersData[users].shippingCity + ', ' + usersData[users].shippingState + ', ' + usersData[users].shippingZip) : '';
      let userListInfo = [...this.frozenCols, ...this.scrollableCols].map((res) => usersData[users][res.field]);
      this.usersExportData.push(userListInfo);
    }
    let threadListHeader;
    threadListHeader = [...this.frozenCols, ...this.scrollableCols].map((res) => res.header);
  }

  loadSessions() {
    this.loadingmarketplacemore = true;
    this.scrollInit = 1;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("procedureId", this.gtsSessionId);
    apiFormData.append("limit", this.dataLimit);
    apiFormData.append("offset", this.dataOffset);
    this.gtsService.apiGetSessionsList(apiFormData).subscribe((response: any) => {
      if (response.status == 'Success') {
        response.items.forEach((data: any) => {
          this.sessions.push(this.getReports(data));
        });
        this.customerTotalRecords = response?.total;
        this.loadingmarketplacemore = false;
      }
    }, (error: any) => {
      this.loadingmarketplacemore = false;
      console.log('error: ', error);
    });
    this.isFilterApplied = false;
    this.setColumns();
  }

  setColumns() {
    this.scrollableCols = [
      { field: 'sessionId', header: 'GTS Session ID#', width: '15px' },
      { field: 'startTime', header: 'Start Date', width: '20px' },
      { field: 'endTime', header: 'End Date', width: '20px' },
      { field: 'userName', header: 'User Name', width: '20px' },
      { field: 'exitStatus', header: 'Status', width: '50px' },
    ];
  }

  getReports(data) {
    data.startTime = this.getDateTimeWithoutDotFormat(data.startTimeProcess);
    data.endTime = this.getDateTimeWithoutDotFormat(data.endTimeProcess);
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

  setUserPaymentInfoData(userData) {
    this.router.navigateByUrl('market-place/report-details/' + userData.id);
  }

  redirectToInnerDetailPage(id: any, type: string) {
    if (type == 'manual') window.open('market-place/view-manual/' + id, '_blank');
    else window.open('market-place/view/' + id, '_blank');
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
      this.sessions = [];
      this.dataOffset = 0;
      this.loadSessions();
    }
  }

  unsorted = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0
  }

  rowColor(data: any) {
    this.router.navigate([`gts/summary/${this.gtsSessionId}/${data.sessionId}`]);
    this.highlighted = data;
    if (this.rowTimeout) {
      clearTimeout(this.rowTimeout);
    }
    this.rowTimeout = setTimeout(() => {
      this.highlighted = null;
    }, 30000);
  }

  breadCrumbNavigation() {
    this.router.navigateByUrl('gts');
  }

}
