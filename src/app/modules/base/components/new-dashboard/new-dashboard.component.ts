import { Component, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { FilterService } from 'src/app/services/filter/filter.service';
import { AppService } from '../../app.service';
import { BaseService } from '../../base.service';
import { CommonService } from '../../../../services/common/common.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Constant } from '../../../../common/constant/constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent implements OnInit {
  @ViewChildren('customComponent', { read: ViewContainerRef }) customComponent: QueryList<ViewContainerRef>;
  dashboardArray: Array<any> = [];
  public pageAccess = 'escalation';
  public headTitle: string = "Escalation";
  public chartWidth: string = "100%";
  public user: any;
  public domainId;
  public userId;
  public apiData: Object;
  public headerFlag: boolean = false;
  public headerData: Object;
  public filterLoading: boolean = true;
  public filterInterval: any;

  public currYear: any = moment().format("Y");
  public currMonth: any = moment().format("MM");
  public monthStartDate: any = moment().startOf('month');
  public month: any;
  public searchVal: string = '';

  public filterActions: object;
  public expandFlag: boolean = false;
  dealerUsageLoading: boolean;
  activeUsersLoading: boolean;
  threadLoading: boolean;
  escLoading: boolean;
  escModLoading: boolean;
  escZoneLoading: boolean;
  contentTypeLoading: boolean;
  gtsStatusLoading: boolean;
  gtsProblemLoading: boolean;
  public groupId: number = 21; // contentTypeId
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public midHeight;
  public filterStartDate: any = moment().startOf('month');
  public filterEndDate = moment().format('YYYY-MM-DD');
  public makeArr: any;
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public emptyCont: string = "<i class='gray'>None</i>";

  public filterActiveCount: number = 0;
  public filterOptions: Object = {
    'filterExpand': this.expandFlag,
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'apiKey': '',
    'userId': '',
    'domainId': '',
    'groupId': this.groupId,
    'threadType': '25',
    'action': 'init',
    'reset': this.resetFilterFlag,
    'historyFlag': this.historyFlag
  };
  dashboardData: any;
  // This is usagerMetricsOption which is use for chart option
  usagerMetricsOption: any ;
  // This is csmCurrentEscalationsOption which is use for chart option
  csmCurrentEscalationsOption: any;

  constructor(private filterApi: FilterService,
    private baseService: BaseService,
    private appService: AppService,
    public commonService: CommonService,
    private authenticationService: AuthenticationService, 
    
  ) {
    this.setChartOptions(false);
  }

  ngOnInit(): void {
    // Slient Push code
    this.commonService._OnMessageReceivedSubject.subscribe((response) => {
      var setdata = JSON.parse(JSON.stringify(response));
      var checkpushtype = setdata.pushType;
      var checkmessageType = setdata.messageType;
      console.log('message received! ####', response);

      this.midHeight=window.innerHeight-240;
      //alert(checkpushtype+'--'+checkmessageType);
      if (checkpushtype == 6) {
        //this.getFilterWidgets();
        this.getDashBoardData();
        // this.landingrecentViews=[];
      }
      //let jsonParseData= JSON.parse(r);
      //console.log(jsonParseData.data);
      // this._receivedMessages.push(r);
      //  this.landingannouncements=[];
      // this.loadingann=true;
      // this.getAnnouncementwidgets();
    });
    // Slient Push code

    // Need to check again for session check.
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let searchKey = localStorage.getItem('escalationSearch');
    let searchBg = (searchKey == undefined || searchKey == 'undefined') ? false : true;
    this.searchVal = (searchBg) ? searchKey : '';
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'searchKey': this.searchVal,
      'historyFlag': this.historyFlag
    }
    this.apiData = apiInfo;
    // Head Info - Need to check again
    this.headerData = {
      'access': this.pageAccess,
      'title': this.headTitle,
      'titleFlag': true,
      'exportFlag': false,
      'apiInfo': apiInfo,
      'startDate': moment(this.monthStartDate).format('YYYY-MM-DD').toString(),
      'profile': true,
      'welcomeProfile': true,
      'search': true
    };
    this.filterOptions['apiKey'] = Constant.ApiKey;
    this.filterOptions['userId'] = this.userId;
    this.filterOptions['domainId'] = this.domainId;

    this.getFilterWidgets();
    //this.getDashBoardData();
  }

  getFilterWidgets() {
    let apiData = this.apiData;
    apiData['groupId'] = this.groupId;
    apiData['filterOptions'] = [];
    this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
    this.filterInterval = setInterval(()=>{
      let filterWidget = localStorage.getItem('filterWidget');
      let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
      if(filterWidget) {
        this.filterOptions = filterWidgetData.filterOptions;
        this.apiData = filterWidgetData.apiData;
        this.filterActiveCount = filterWidgetData.filterActiveCount;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        clearInterval(this.filterInterval);
        localStorage.removeItem('filterWidget');
        localStorage.removeItem('filterData');
        let filterOptions = this.apiData['filterOptions'];
        this.getDashBoardData(filterOptions);
      }
    }, 50);    
  }

  getDashBoardData(filterOptions?: any) {
    if (filterOptions == undefined)
      filterOptions = { status: [], technicians: [], technicianItems: [], csm: [], csmItems: [], territories: [], territoryItems: [], locations: [], locationItems: [], customers: [], customerItems: [], startDate: "", endDate: "" };
    this.baseService.post("dashboard", "userDashboardreportv2updated", this.userId, this.domainId, this.groupId, filterOptions)
      .subscribe((data: any) => {
        this.dashboardData = data;
      });
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.dealerUsageLoading = true;
    this.activeUsersLoading = true;
    this.threadLoading = true;
    this.escLoading = true;
    this.escModLoading = true;
    this.escZoneLoading = true;
    this.contentTypeLoading = true;
    this.gtsStatusLoading = true;
    this.gtsProblemLoading = true;
    //this.loadCharts();
    this.dashboardData = null;
    this.getDashBoardData();
  }

  setChartOptions(expand:boolean) {
    // This is usagerMetricsOption which is use for chart option
    this.usagerMetricsOption = {
      seriesType: 'bars',
      backgroundColor: 'transparent',
      chartArea: { left: 70, top: 20, width: '93%', height: '55%' },
      legend: { margin: 12, position: 'top', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto' }, alignment: 'end' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
      vAxis: {
        title: 'Count',
        titleTextStyle: {
          color: '#9ea0a4',
          fontSize: 14,
          fontName: 'Roboto',
          bold: false,
          italic: false
        },
        textStyle: { color: '#9ea0a4' }
      },
      hAxis: {
        textStyle: { color: '#9ea0a4', fontSize: 14 }
      }
    };
    // This is csmCurrentEscalationsOption which is use for chart option
    this.csmCurrentEscalationsOption = {
      seriesType: 'bars',
      isStacked: true, // dynamic
      backgroundColor: 'transparent',
      height: 300, // dynamic
      chartArea: { left: 70, top: 20, width: '93%', height: '55%' }, // dynamic
      legend: { position: 'top', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto' }, alignment: 'end' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
      vAxis: {
        title: 'Count',
        titleTextStyle: {
          color: '#9ea0a4',
          fontSize: 14,
          fontName: 'Roboto',
          bold: false,
          italic: false
        },
        textStyle: { color: '#9ea0a4' }
      },
      hAxis: {
        slantedText: true, slantedTextAngle: 90, // dynamic
        textStyle: { color: '#9ea0a4', fontSize: 14 }
      },
      colors: ['#1b9e77', '#d95f02', '#7570b3']
    };
  }

  // Apply Filter
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    this.filterOptions['searchBg'] = false;
    if (!resetFlag) {
      this.filterOptions['action'] = 'get';
      this.filterOptions['historyFlag'] = this.historyFlag;
      this.filterOptions['resetFlag'] = this.resetFilterFlag;
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterOptions['filterLoading'] = this.filterLoading;
      this.apiData['filterOptions'] = filterData;

      // Setup Filter Active Data
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      console.log(this.filterActiveCount)

      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
      this.getDashBoardData(filterData);
      localStorage.setItem('                                                                                                                                                                                                                             ', JSON.stringify(filterData));

      setTimeout(() => {
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
      }, 700);
    } else {
      this.filterOptions['action'] = 'init';
      this.filterOptions['historyFlag'] = this.historyFlag;
      this.filterOptions['resetFlag'] = this.resetFilterFlag;
      localStorage.removeItem('escalationFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  applySearch(action, event) {
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.resetFilterFlag = true;
    this.filterOptions['filterLoading'] = this.filterLoading;
    this.filterOptions['action'] = 'init';
    this.filterOptions['historyFlag'] = this.historyFlag;
    this.filterOptions['resetFlag'] = this.resetFilterFlag;
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    this.ngOnInit();
  }
}
