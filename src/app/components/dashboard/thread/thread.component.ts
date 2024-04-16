import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { CommonService } from '../../../services/common/common.service';
import { Title } from '@angular/platform-browser';
import {
  PlatFormType,
  PlatFormNames,
} from "src/app/common/constant/constant";

declare let google: any;

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit, OnDestroy {

  public headTitle: string = "Threads";
  public headerFlag: boolean = false;
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 3;
  public threadGroupId: number = 3.1;
  public apiData: Object;
  public currYear: any = moment().format("Y");
  public currMonth: any = moment().format("MM");
  public filterStartDate: any ='';
  public filterEndDate = moment().format('YYYY-MM-DD');
  public filteredDate: string;
  public mahlewebURL = '';
  public viewPath: string = "";

  panelOpenState: boolean = true;

  public limit: number = 30;
  public offset: number = 0;
  public length: number = 0;
  public total: number = 0;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public resize: boolean = false;
  public expandFlag: boolean = true;
  public filterLoading: boolean = true;
  public noDataFlag: boolean = false;
  public threadListAvail: boolean = false;
  startDate: any;
  endDate: any;

  public bodyHeight: number;
  public innerWidth: number;
  public innerHeight: number;
  public innerHeightnew: number;

  public filterHeight: number;

  platformId = localStorage.getItem("platformId");
  isCollabtic: boolean = false;

  public headerData: object;
  public openThreadLoading: boolean = true;
  public openThreadAvail: boolean = false;
  public openThreadData: any;
  public openThreadOptions: object;
  public closedThreadLoading: boolean = true;
  public closedThreadAvail: boolean = false;
  public closedThreadData: any;
  public closedThreadOptions: object;
  public threadTableLoading: boolean = true;
  public pageAccess = 'threads';
  public userTypesArr: any;

  public threadType: string = 'Open';
  public threadStatus: string = '';
  public threadTitle: string = '';
  public allOpenThreadFlag: boolean = false;
  public allClosedThreadFlag: boolean = false;

  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public resetFlag: boolean = false;
  public displayType: boolean = true;

  public openHeadElements = [
    { 'title': 'Dealer Name', 'class': 'dealer-name sticky', 'info': false },
    { 'title': 'Dealer Code', 'class': 'dealer-code sticky td-sticky', 'info': false },
    { 'title': 'Zone', 'class': 'zone', 'info': false },
    { 'title': 'Area', 'class': 'area', 'info': false },
    { 'title': 'TTY', 'class': 'tty', 'info': false },
    { 'title': 'Product Owner', 'class': 'prod-owner', 'info': true, 'infoTxt': 'Click on the Product Owner Name to view the contact details' },
    { 'title': 'TM Name', 'class': 'tm-name', 'info': true, 'infoTxt': 'Click on the Territory Manager Name to view the contact details' },
    { 'title': 'Thread Creation date/time', 'class': 'creation-time', 'info': false },
    { 'title': 'Model > Year', 'class': 'model-year', 'info': false },
    { 'title': 'Frame#', 'class': 'frame', info: false },
    { 'title': 'Odo Meter', 'class': 'odo', info: false },
    { 'title': 'Title', 'class': 'title', 'info': false },
    { 'title': 'Error Code', 'class': 'error-code', 'info': false },
    { 'title': 'Description', 'class': 'description', 'info': false },
    { 'title': 'Status', 'class': 'status', 'info': false },
    { 'title': 'Esc Level', 'class': 'esc-level', 'info': false },
    { 'title': 'Proposed Fix Date', 'class': 'proposed-fix', 'info': false },
    { 'title': '1st Reply Time', 'class': 'text-center first-reply-time', 'info': false },
    { 'title': 'Thread ID', 'class': 'thread-id', 'info': false },
    { 'title': 'Time to Share Proposed Fix', 'class': 'respond-time', 'info': false },
    { 'title': 'Feedback Status', 'class': 'feedback-status', 'info': false },
  ];

  public closedHeadElements = [
    { 'title': 'Dealer Name', 'class': 'dealer-name sticky', 'info': false },
    { 'title': 'Dealer Code', 'class': 'dealer-code sticky td-sticky', 'info': false },
    { 'title': 'Zone', 'class': 'zone', 'info': false },
    { 'title': 'Area', 'class': 'area', 'info': false },
    { 'title': 'TTY', 'class': 'tty', 'info': false },
    { 'title': 'Product Owner', 'class': 'prod-owner', 'info': true },
    { 'title': 'TM Name', 'class': 'tm-name', 'info': true },
    { 'title': 'Thread Creation date/time', 'class': 'creation-time', 'info': false },
    { 'title': 'Model > Year', 'class': 'model-year', 'info': false },
    { 'title': 'Frame#', 'class': 'frame', info: false },
    { 'title': 'Odo Meter', 'class': 'odo', info: false },
    { 'title': 'Title', 'class': 'title', 'info': false },
    { 'title': 'Error Code', 'class': 'error-code', 'info': false },
    { 'title': 'Description', 'class': 'description', 'info': false },
    { 'title': 'Status', 'class': 'status', 'info': false },
    { 'title': 'Esc Level', 'class': 'esc-level', 'info': false },
    { 'title': 'Proposed Fix Date', 'class': 'proposed-fix', 'info': false },
    { 'title': '1st Reply Time', 'class': 'text-center first-reply-time', 'info': false },
    { 'title': 'Thread ID', 'class': 'thread-id', 'info': false },
    { 'title': 'Thread Closed Date', 'class': 'closed-date', 'info': false },
    { 'title': 'Time to Share Proposed Fix', 'class': 'respond-time', 'info': false },
    { 'title': 'Time to Close', 'class': 'close-time', 'info': false },
    { 'title': 'Feedback Status', 'class': 'feedback-status', 'info': false },
  ];
  public threadData: any = [];
  public threadElements: any = [];

  public filterOptions: Object = {
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'dealerList': [],
    'apiKey': '',
    'domainId': '',
    'countryId': '',
    'userId': ''
  };

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 80;
    this.scrollTop = event.target.scrollTop;

    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.total > this.length) {
        this.scrollCallback = false;
        this.getThreadTableList();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.openThreadLoading = true;
    this.closedThreadLoading = true;
    this.resize = true;
    this.resetFlag = this.resize;
    this.setScreenHeight();
    this.loadCharts();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private dashboardApi: DashboardService,
    private scrollTopService: ScrollTopService,
    private commonService: CommonService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.headTitle);
  }


  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  ngOnInit() {
    document.getElementById('footer').classList.add('d-none');
    document.body.classList.add('overflow-hidden')
    if (this.platformId == PlatFormType.Collabtic || this.platformId == PlatFormType.CbaForum) {
      this.isCollabtic = true
      if(this.platformId == PlatFormType.CbaForum)
      {
        this.viewPath = (this.domainId == 336) ? 'view' : 'view';
      }
      else
{
  this.viewPath = (this.domainId == 336) ? 'view-v3' : 'view-v2';
}
     
    }
    this.scrollTopService.setScrollTop();
    this.domainId = localStorage.getItem('domainId');
    this.userId = localStorage.getItem('userId');
    this.countryId = localStorage.getItem('countryId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;


    if (authFlag) {
      if (localStorage.getItem('chartGroups')) {
        let groupInfo = JSON.parse(localStorage.getItem('chartGroups'));
        for (let g of groupInfo) {
          if (g.hasOwnProperty('threads')) {
            this.groupId = g.threads;
          }
        }
      }


      let apiInfo = {
        'apiKey': "dG9wZml4MTIz",
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId
      }
      this.apiData = apiInfo;
      this.mahlewebURL = location.origin;
      //currUrl = currUrl.substr(currUrl.indexOf('/') + 1);

      // Default Thread Type Info
      let threadFilter = JSON.parse(localStorage.getItem('threadFilter'));
      let defaultThreadType = localStorage.getItem('threadType')?.toLowerCase();
      let accessFrom = localStorage.getItem('navFrom');
      if (threadFilter != null) {
        let threadType = threadFilter.threadType;
        this.threadType = (threadType == undefined || threadType == 'undefined') ? this.threadType.toLowerCase() : threadType.toLowerCase();
        let threadStatus = threadFilter.threadStatus;
        this.threadStatus = (threadStatus == undefined || threadStatus == 'undefined') ? this.threadStatus : threadStatus;
        if (this.threadType == "open") {
          this.allOpenThreadFlag = (this.threadStatus == "") ? true : false;
        } else {
          this.allClosedThreadFlag = (this.threadStatus == "") ? true : false;
        }
      } else {
        this.threadType = defaultThreadType;
        this.threadStatus = "";
        if (this.threadType == "open") {
          this.allOpenThreadFlag = true;
        } else {
          this.allOpenThreadFlag = true;
        }
        this.threadStatus = "";
      }

      // Head Info
      this.headerData = {
        'access': this.pageAccess,
        'title': this.headTitle,
        'titleFlag': true,
        'exportFlag': false,
        'exportFlagthread': true,

        'exportData': {
          'openThreads': [],
          'closedThreads': [],
          'threadList': [],
          'threadTitle': this.threadType
        },
        'apiInfo': apiInfo,
        'total': 0,
        'groupId': this.threadGroupId,
        'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
      };

      this.headerFlag = true;
      this.bodyHeight = screen.height;
      this.setScreenHeight();

      this.filterOptions['apiKey'] = this.apiData['apiKey'];
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      this.filterOptions['userId'] = this.userId;

      this.searchForm = this.formBuilder.group({
        // searchKey: [this.searchVal, [Validators.required]],
         searchKey: [this.searchVal, null],
      });

      google.charts.load('current', { 'packages': ['corechart'] });

      // Get Filter Widgets
      this.getFilterWidgets();
    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overflow-hidden')
    document.getElementById('footer').classList.remove('d-none')
  }

  getFilterWidgets() {
    let apiData = this.apiData;
    apiData['groupId'] = this.groupId;
    this.dashboardApi.getFilterWidgets(this.apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        this.filterOptions['filterData'] = responseData;

        let accessFrom = localStorage.getItem('accessFrom');
        let dashFilter = JSON.parse(localStorage.getItem('dashFilter'));
        let dashYear = dashFilter?.year;
        let dashMonth = dashFilter?.month;

        let threadApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('threadFilter'));
        let defaultWsVal = '', wsVal, defaultUserType = '', utypeVal = '', statusVal = '', zoneVal = '', areaVal = '', ttyVal = '', dealerVal = '', userVal = '';
        // let startDateVal = moment(this.filterStartDate).format('YYYY-MM-DD').toString();
        // let endDateVal = moment(this.filterEndDate).format('YYYY-MM-DD').toString();

        for (let res in responseData) {
          let item = responseData[res];
          let wid = parseInt(item.id);
          switch (wid) {
            case 1:
              let wsItems;
              wsItems = [item.valueArray[0].workstreamId];
              console.log(wsItems);
              defaultWsVal = wsItems.toString();
              console.log(getFilteredValues);
              if (getFilteredValues != null) {
                console.log(getFilteredValues);
                wsItems = (getFilteredValues.workstream == '' || getFilteredValues.workstream == undefined || getFilteredValues.workstream == 'undefined') ? [item.valueArray[0].workstreamId] : getFilteredValues.workstream;
              }
              wsVal = wsItems.toString();
              console.log(wsItems);
              threadApiData['filterOptions'] = { 'workstream': wsItems };
              break;
            case 2:
              this.userTypesArr = item.valueArray;
              for (let u of this.userTypesArr) {
                if (u.defaultSelection == 1) {
                  threadApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                }
              }
              if (getFilteredValues != null) {
                if (getFilteredValues.userType != undefined || getFilteredValues.userType != 'undefined') {
                  threadApiData['filterOptions']['userType'] = getFilteredValues.userType;
                  utypeVal = getFilteredValues.userType;
                }
              }

              let navFrom = localStorage.getItem('navFrom');
              if (navFrom != undefined || navFrom != 'undefined' && navFrom == 'summary') {
                if (dashFilter.userType) {
                  let userTypeValue = dashFilter.userType.toString();
                  for (let u of this.userTypesArr) {
                    if (userTypeValue == u.id) {
                      threadApiData['filterOptions']['userType'] = [u.id];
                      utypeVal = u.id;
                      defaultUserType = utypeVal;
                      localStorage.removeItem('navFrom');
                    }
                  }
                }
              }
              break;
            case 3:
              let year;
              if (getFilteredValues != null) {
                year = (getFilteredValues.year == '' || getFilteredValues.year == undefined || getFilteredValues.year == 'undefined') ? this.currYear : getFilteredValues.year;
              } else {
                year = this.currYear;
              }

              if (accessFrom != undefined || accessFrom != 'undefined' && accessFrom == 'dashboard') {
                if (dashFilter != undefined || dashFilter != 'undefined') {
                  year = dashYear;
                }
              }
              threadApiData['filterOptions']['year'] = year;
              this.filterOptions['filterData'][res]['value'] = year;
              break;
            case 4:
              let month;
              if (getFilteredValues != null) {
                month = (getFilteredValues.month == undefined || getFilteredValues.month == 'undefined') ? this.currMonth : getFilteredValues.month;
              } else {
                month = this.currMonth;
              }

              if (accessFrom != undefined || accessFrom != 'undefined' && accessFrom == 'dashboard') {
                if (dashFilter != undefined || dashFilter != 'undefined') {
                  month = dashMonth;
                }
              }
              threadApiData['filterOptions']['month'] = month;
              this.filterOptions['filterData'][res]['value'] = month;
              localStorage.removeItem('accessFrom');
              break;
            /*case 6:
              let startDate = moment(this.filterStartDate).format('YYYY-MM-DD').toString();
              let sDate;
              if(getFilteredValues != null) {
                sDate = (getFilteredValues.startDate == undefined || getFilteredValues.startDate == 'undefined') ? startDate : getFilteredValues.startDate;
              } else {
                sDate = startDate;
              }
              if(accessFrom != undefined || accessFrom != 'undefined' && accessFrom == 'dashboard') {
                if(dashFilter != undefined || dashFilter != 'undefined') {
                  sDate = moment([year, month-1]).format('YYYY-MM-DD');
                }
              }
              threadApiData['filterOptions']['startDate'] = sDate;
              this.filterOptions['filterData'][res]['value'] = sDate;
              this.filteredDate = moment(sDate).format('MMM DD, YYYY');
              break;
            case 10:
              let endDate = moment(this.filterEndDate).format('YYYY-MM-DD').toString();
              let eDate;
              if(getFilteredValues != null) {
                eDate = (getFilteredValues.endDate == undefined || getFilteredValues.endDate == 'undefined') ? endDate : getFilteredValues.endDate;
              } else {
                eDate = endDate;
              }
              if(accessFrom != undefined || accessFrom != 'undefined' && accessFrom == 'dashboard') {
                if(dashFilter != undefined || dashFilter != 'undefined') {
                  if(this.currYear == year && this.currMonth == month) {
                    eDate = moment().format('YYYY-MM-DD');
                  } else {
                    eDate = moment([year, month-1]).endOf('month').format('YYYY-MM-DD');
                  }
                }
              }
              threadApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              this.filteredDate = this.filteredDate+' - '+moment(eDate).format('MMM DD, YYYY');
              localStorage.removeItem('accessFrom');
              break;*/
            case 7:
              let zone = '';
              if (getFilteredValues != null) {
                zone = (getFilteredValues.zone == undefined || getFilteredValues.zone == 'undefined') ? zone : getFilteredValues.zone;
              }
              zoneVal = zone;
              threadApiData['filterOptions']['zone'] = zone;
              this.filterOptions['filterData'][res]['zone'] = zone;

              let area = '';
              if (getFilteredValues != null) {
                area = (getFilteredValues.area == undefined || getFilteredValues.area == 'undefined') ? area : getFilteredValues.area;
              }
              areaVal = area;
              threadApiData['filterOptions']['area'] = area;
              this.filterOptions['filterData'][res]['area'] = area;

              let territory = '';
              if (getFilteredValues != null) {
                territory = (getFilteredValues.territory == undefined || getFilteredValues.territory == 'undefined') ? territory : getFilteredValues.territory;
              }
              ttyVal = territory;
              threadApiData['filterOptions']['territory'] = territory;
              this.filterOptions['filterData'][res]['territory'] = territory;

              /*let town = '';
              if(getFilteredValues != null) {
                town = (getFilteredValues.town == undefined || getFilteredValues.town == 'undefined') ? town : getFilteredValues.town;
              }
              threadApiData['filterOptions']['town'] = town;
              this.filterOptions['filterData'][res]['town'] = town;*/
              break;
            case 8:
              let dealer = [""];
              if (getFilteredValues != null) {
                dealer = (getFilteredValues.dealerCode == undefined || getFilteredValues.dealerCode == 'undefined') ? dealer : getFilteredValues.dealerCode;
              }
              dealerVal = dealer.toString();
              threadApiData['filterOptions']['dealerCode'] = dealer;
              this.filterOptions['filterData'][res]['value'] = dealer;
              break;
            case 13:
              let users = [""];
              if (getFilteredValues != null) {
                users = (getFilteredValues.userId == undefined || getFilteredValues.userId == 'undefined') ? users : getFilteredValues.userId;
              }
              userVal = users.toString();
              threadApiData['filterOptions']['userId'] = users;
              this.filterOptions['filterData'][res]['userId'] = users;
              break;
          }
        }

        //console.log(defaultWsVal+' == '+wsVal+'\n'+threadApiData['filterOptions']['startDate']+' == '+startDateVal+'\n'+threadApiData['filterOptions']['endDate']+' == '+endDateVal+'\n'+threadApiData['filterOptions']['zone']+' == '+zoneVal+'\n'+threadApiData['filterOptions']['area']+' == '+areaVal+'\n'+threadApiData['filterOptions']['territory']+' == '+ttyVal+'\n'+defaultUserType+' == '+utypeVal);
        if (defaultWsVal == wsVal && threadApiData['filterOptions']['year'] == this.currYear && threadApiData['filterOptions']['month'] == this.currMonth && threadApiData['filterOptions']['zone'] == zoneVal && threadApiData['filterOptions']['area'] == areaVal && threadApiData['filterOptions']['territory'] == ttyVal && defaultUserType == utypeVal && threadApiData['filterOptions']['dealerCode'] == userVal && defaultWsVal == statusVal) {
          this.filterOptions['filterActive'] = false;
        }

        let fmonth = moment(threadApiData['filterOptions']['month']).format('MMMM');
        let fyear = threadApiData['filterOptions']['year'];
        this.filteredDate = `${fmonth} ${fyear ?? ''}`;

        threadApiData['filterOptions']['threadType'] = this.threadType;
        threadApiData['filterOptions']['threadStatus'] = this.threadStatus;

        this.startDate = moment().subtract(30,'days').format('MMM D, YYYY');
        this.endDate = moment().format('MMM D, YYYY');

        // Get Threads Data
        this.getThreadsData(threadApiData);
      }
    });
  }

  // Get Threads Data
  getThreadsData(apiData) {
    this.headerFlag = false;
    this.headerData['exportFlag'] = this.headerFlag;

    this.apiData['storage'] = 'threadFilter';
    this.apiData['filterOptions']['groupId'] = this.groupId;
    this.apiData['searchKey'] = "";
    this.apiData['offset'] = this.offset;
    this.apiData['limit'] = this.limit;

    if(!this.apiData['filterOptions']['startDate']) {
      this.apiData['filterOptions']['startDate'] = moment(this.startDate).format('YYYY-MM-DD');
    }
    if(!this.apiData['filterOptions']['endDate']) {
      this.apiData['filterOptions']['endDate'] = moment(this.endDate).format('YYYY-MM-DD');
    }

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        let chartDetails = responseData.chartdetails;

        let openThreads = chartDetails.openThreads;
        this.openThreadData = openThreads;
        this.openThreadAvail = (openThreads.length == 0) ? false : true;

        let closedThreads = chartDetails.closedThreads;
        this.closedThreadData = closedThreads;
        this.closedThreadAvail = (closedThreads.length == 0) ? false : true;

        this.scrollTop = 0;
        this.lastScrollTop = this.scrollTop;

        let threadData = chartDetails.threadsList;
        let threadList = threadData.list;
        this.threadTableLoading = false;

        let exportData = this.headerData['exportData'];
        exportData.openThreads = openThreads;
        exportData.closedThreads = closedThreads;

        let threadUserList = chartDetails.threadUserList;
        this.filterOptions['userList'] = threadUserList.list;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;

        if (threadData.total == 0) {
          this.threadListAvail = false;
          this.threadElements = [];
        } else {
          this.threadListAvail = true;
        }

        if (this.threadListAvail) {
          this.total = threadData.total;
          this.length += threadList.length;
          this.offset += this.limit;
          this.headerData['total'] = this.total;
          this.threadListData(threadList);
        }

        this.headerData['exportFlag'] = this.threadListAvail;
        this.headerFlag = true;

        // Load Charts
        this.loadCharts();

        setTimeout(() => {
          this.setScreenHeightnew();
        }, 500);
      }
    });
  }

  // Load Charts
  loadCharts() {
    if (this.openThreadAvail) {
      this.openThreadsChart();
      setTimeout(() => {
        this.openThreadLoading = false;
      }, 200);
    } else {
      this.openThreadLoading = false;
    }

    if (this.closedThreadAvail) {
      this.closedThreadsChart();
      setTimeout(() => {
        this.closedThreadLoading = false;
      }, 200);
    } else {
      this.closedThreadLoading = false;
    }
  }

  // Open Threads Chart
  openThreadsChart() {
    let width = this.innerWidth - 100;
    let height = document.getElementsByClassName('thread-cont')[0].clientHeight;
    let openThreadOptions = {
      title: '',
      backgroundColor: 'transparent',
      colors: [],
      chartArea: { left: 0, width: '90%', height: '75%' },
      legend: { position: 'center', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium' }, alignment: 'center' },
      pieHole: 0.6,
      pieSliceBorderColor: 'transparent',
      pieSliceText: 'value',
      pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
      width: width,
      height: height
    };

    this.openThreadOptions = openThreadOptions;
  }

  // Open Threads Chart
  closedThreadsChart() {
    let width = this.innerWidth - 100;
    let height = document.getElementsByClassName('thread-cont')[0].clientHeight;
    let closedThreadOptions = {
      title: '',
      backgroundColor: 'transparent',
      colors: [],
      chartArea: { width: '90%', height: '75%' },
      legend: { position: 'center', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium' }, alignment: 'center' },
      pieHole: 0.6,
      pieSliceBorderColor: 'transparent',
      pieSliceText: 'value',
      pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
      width: width,
      height: height
    };

    this.closedThreadOptions = closedThreadOptions;

    if (!this.resize) {
      setTimeout(() => {
        //this.getThreadTableList();
      }, 500);
    }
  }

  // Load Thread List
  threadListData(threadList) {
    let threadInfo = ['threadPage', this.threadElements];
    let threadListData = this.commonService.getModifiedThreadData(threadInfo, threadList, this.threadType);
    if (this.isCollabtic) {
      this.openHeadElements = [
        { 'title': 'Thread Owner', 'class': 'prod-owner', 'info': true, 'infoTxt': 'Click on the Thread Owner Name to view the contact details' },
        { 'title': 'Assigned To', 'class': 'manager-name', 'info': false },
        { 'title': 'Model > Year', 'class': 'model-year', 'info': false },
        { 'title': 'Title', 'class': 'title', 'info': false },
        { 'title': 'Open Date', 'class': 'creation-time', 'info': false },
        { 'title': 'Fix Date', 'class': 'creation-time', 'info': false },
        { 'title': 'Time to Fix (Hrs)', 'class': 'creation-time', 'info': false },
      { 'title': 'First Response Date', 'class': 'creation-time', 'info': false },
        { 'title': 'First Response (Hrs)', 'class': 'creation-time', 'info': false },
       
        { 'title': 'Thread Status', 'class': 'status', 'info': false },
        { 'title': 'Thread ID', 'class': 'thread-id', 'info': false },
      ];

      this.closedHeadElements = [
        { 'title': 'Thread Owner', 'class': 'prod-owner', 'info': true },
        { 'title': 'Assigned To', 'class': 'manager-name', 'info': false },
        { 'title': 'Model > Year', 'class': 'model-year', 'info': false },
        { 'title': 'Title', 'class': 'title', 'info': false },
        { 'title': 'Open Date', 'class': 'creation-time', 'info': false },
        { 'title': 'Fix Date', 'class': 'creation-time', 'info': false },
        { 'title': 'Time to Fix (Hrs)', 'class': 'creation-time', 'info': false },
        { 'title': 'First Response Date', 'class': 'creation-time', 'info': false },
        { 'title': 'First Response (Hrs)', 'class': 'creation-time', 'info': false },
        { 'title': 'Thread Closed Date', 'class': 'closed-date', 'info': false },
 
        { 'title': 'Time to Close', 'class': 'close-time', 'info': false },
       
        { 'title': 'Thread Status', 'class': 'status', 'info': false },
        { 'title': 'Thread ID', 'class': 'thread-id', 'info': false },
      ];
    }

    this.threadElements = threadListData;
    this.filterLoading = true;
    this.filterOptions['dealerList'] = this.threadElements;
    this.filterLoading = false;
    this.filterOptions['filterLoading'] = this.filterLoading;

    setTimeout(() => {
      this.scrollCallback = true;
      this.scrollInit = 1;
    }, 500);
  }

  // Get Thread Table List
  getThreadTableList() {
    this.headerFlag = false;
    this.headerData['exportFlag'] = this.headerFlag;
    this.apiData['filterOptions']['groupId'] = this.threadGroupId;
    let threadApiData: any;
    threadApiData = { 'apiKey': this.apiData['apiKey'] };
    threadApiData['domainId'] = this.apiData['domainId'];
    threadApiData['countryId'] = this.apiData['countryId'];
    threadApiData['userId'] = this.apiData['userId'];
    threadApiData['filterOptions'] = this.apiData['filterOptions'];
    threadApiData['storage'] = 'threadTableFilter';
    threadApiData['offset'] = this.offset;
    threadApiData['limit'] = this.limit;
    threadApiData['searchKey'] = this.searchVal;

    this.dashboardApi.apiChartDetail(threadApiData).subscribe((response) => {
      this.threadTableLoading = false;
      if (response.status == "Success") {
        let responseData = response.data;
        let threadList = responseData.chartdetails;
        this.total = responseData.total;
        this.length += threadList.length;
        this.offset += this.limit;

        if (this.total == 0) {
          this.threadListAvail = false;
          this.threadElements = [];
        } else {
          this.threadListAvail = true;
          this.headerData['total'] = this.total;
        }

        if (this.threadListAvail) {
          this.threadListData(threadList);
        }
      } else {
        this.threadListAvail = false;
        this.threadElements = [];
      }
      this.headerData['exportFlag'] = this.threadListAvail;
      this.headerFlag = true;
    });
  }

  // Set All Threads
  setAllThreads(type) {
    let threadInfo = [];
    if (type == 'open') {
      //if (!this.allOpenThreadFlag) {
        this.allOpenThreadFlag = true;
        this.allClosedThreadFlag = false;
        this.threadType = type;
        this.threadStatus = "";
        threadInfo.push(this.threadType, this.threadStatus, 'init');
        this.setThreadType(threadInfo)
      //}
    } else {
      //if (!this.allClosedThreadFlag) {
        this.allOpenThreadFlag = false;
        this.allClosedThreadFlag = true;
        this.threadType = type;
        this.threadStatus = "";
        threadInfo.push(this.threadType, this.threadStatus, 'init');
        this.setThreadType(threadInfo)
      //}
    }
    let exportData = this.headerData['exportData'];
    exportData.threadTitle = this.threadType;
  }

  // Set default thread type
  setThreadType(threadInfo) {
    console.clear()
    console.log(threadInfo);
    if (threadInfo[2] == 'chart') {
      this.allOpenThreadFlag = false;
      this.allClosedThreadFlag = false;
    }
    if (threadInfo.includes('open')) {
      this.allOpenThreadFlag = true;
      this.allClosedThreadFlag = false;
    }
    if (threadInfo.includes('closed')) {
      this.allOpenThreadFlag = false;
      this.allClosedThreadFlag = true;
    }
    this.threadType = threadInfo[0];
    this.threadStatus = threadInfo[1];
    this.setThreadStatus(this.threadStatus);
    this.apiData['filterOptions']['threadType'] = this.threadType;
    this.apiData['filterOptions']['threadStatus'] = this.threadStatus;
    this.threadTableLoading = true;
    this.threadElements = [];
    let exportData = this.headerData['exportData'];
    exportData.threadList = [];
    exportData.threadTitle = this.threadType;
    this.limit = 30;
    this.offset = 0;
    this.length = 0;
    this.total = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.getThreadTableList();
  }

  // Set Thread Status
  setThreadStatus(threadStatus) {
    switch (threadStatus) {
      case 'Pending (no reply yet)':
      case 'pending':
        this.threadTitle = 'Pending';
        this.displayType = false;
        break;
      case 'In-Progress (reply but no proposed Fix)':
      case 'inProgress':
        this.threadTitle = 'In Progress';
        this.displayType = false;
        break;
      case 'Proposed Fix (grey bulb)':
      case 'propsedFix':
        this.threadTitle = 'Propsed Fix';
        this.displayType = false;
        break;
      case 'Fixed (yellow or green bulb)':
      case 'fixed':
        this.threadTitle = 'Fixed';
        this.displayType = false;
        break;
      case 'No reply':
      case 'noReply':
        this.threadTitle = 'No Reply';
        this.displayType = false;
        break;
      case 'No proposed Fix':
      case 'noProposedFix':
        this.threadTitle = 'No Proposed Fix';
        this.displayType = false;
        break;
      case 'Proposed Fix':
      case 'proposedFix':
        this.threadTitle = 'Propsed Fix';
        this.displayType = false;
        break;
      case 'Confirmed Fix (green & yellow or orange)':
      case 'confirmedFix':
        this.threadTitle = 'Confirmed Fix';
        this.displayType = false;
        break;
      case 'Shared Fix':
      case 'sharedFix':
        this.threadTitle = 'Shared Fix';
        this.displayType = false;
        break;
      case 'No Fix':
      case 'noFix':
        this.threadTitle = 'No Fix';
        this.displayType = false;
        break;
      default:
        this.displayType = true;
         this.threadTitle = '';
      break
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let navPage = localStorage.getItem('navPage');
    let navFlag = (navPage == undefined || navPage == 'undefined') ? false : (navPage == 'true') ? true : false;
    let extraHeight = (this.resetFlag) ? 220 : (navFlag) ? 260 : 275;
    let filterActHeight = (this.resetFlag) ? 105 : 75;
    let headerHeight = (this.resetFlag) ? 0 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    //console.log(headerHeight+'fromtop');
    this.innerWidth = document.getElementsByClassName('thread-cont')[0].clientWidth;
    let chartHeight = document.getElementsByClassName('chart-row')[0].clientHeight;
    let threadTitleHeight = document.getElementsByClassName('thread-title')[0].clientHeight;
    this.innerHeight = (this.bodyHeight - (headerHeight + footerHeight + chartHeight + threadTitleHeight + extraHeight));
    this.filterHeight = (window.innerHeight - (headerHeight + footerHeight + threadTitleHeight)) - 20;
    //this.filterOptions['filterHeight'] = this.filterHeight+filterActHeight;
    this.filterOptions['filterHeight'] = window.innerHeight - 75;
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  //added by karuna for thread report height
  setScreenHeightnew() {
    let headerHeightnew = (this.resetFlag) ? 0 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeightnew = document.getElementsByClassName('footer-content')[0].clientHeight;
    //this.innerWidth = document.getElementsByClassName('thread-cont')[0].clientWidth;
    let chartHeightnew = document.getElementsByClassName('chart-row')[0].clientHeight;
    let threadTitleHeightnew = document.getElementsByClassName('thread-title')[0].clientHeight;
    this.innerHeightnew = (window.innerHeight - (headerHeightnew + footerHeightnew + chartHeightnew + threadTitleHeightnew + 50));
    this.filterOptions['filterHeight'] = window.innerHeight - 75;
    //this. innerHeightnew =100;
    //console.log(window.innerHeight+'--'+this. innerHeightnew+'---row' );
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      if (this.searchVal != '' && this.searchVal !== undefined && this.searchVal != '= undefined') {
        console.log(this.searchVal);
        this.submitSearch();
      }
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if (searchValue == '') {
      this.clearSearch();
    }
  }

  // Submit Search
  submitSearch() {
    this.threadTableLoading = true;
    this.threadElements = [];
    let exportData = this.headerData['exportData'];
    exportData.threadList = [];
    exportData.threadTitle = this.threadType;
    this.limit = 30;
    this.offset = 0;
    this.length = 0;
    this.total = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.getThreadTableList();
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.threadTableLoading = true;
    this.threadElements = [];
    let exportData = this.headerData['exportData'];
    exportData.threadList = [];
    exportData.threadTitle = this.threadType;
    this.limit = 30;
    this.offset = 0;
    this.length = 0;
    this.total = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.getThreadTableList();
  }

  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    this.startDate = moment(filterData.startDate).format('MMM D, YYYY').toString();
    this.endDate = moment(filterData.endDate).format('MMM D, YYYY').toString();
    this.openThreadLoading = true;
    this.closedThreadLoading = true;
    this.threadTableLoading = true;
    this.openThreadData = [];
    this.closedThreadData = [];
    this.threadElements = [];
    this.limit = 30;
    this.offset = 0;
    this.length = 0;
    this.total = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.searchVal = "";
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.resize = false;
    this.resetFlag = this.resize;
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.apiData['filterOptions']['threadType'] = this.threadType;
      this.apiData['filterOptions']['threadStatus'] = this.threadStatus;
      let month = moment(filterData.month).format('MMMM');
      this.filteredDate = `${month} ${filterData.year}`;
      //let endDate = moment(filterData.endDate).format('MMM YYYY');
      //this.filteredDate = startDate+' - '+endDate;
      this.getThreadsData(this.apiData);
    } else {
      localStorage.removeItem('threadFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.resetFlag = true;
    this.filterLoading = true;
    localStorage.removeItem('threadFilter');
    localStorage.setItem('threadType', 'open');
    this.ngOnInit();
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.openThreadLoading = true;
    this.closedThreadLoading = true;
    this.resize = true;
    this.resetFlag = this.resize;
    setTimeout(() => {
      this.loadCharts();
    }, 300);
  }

  updateState(state: boolean) {
    this.panelOpenState = state;
    // this.innerHeightnew = 500;
    setTimeout(() => {
      this.setScreenHeightnew()
    }, 200)
  }

}
