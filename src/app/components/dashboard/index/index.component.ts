import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { Title } from '@angular/platform-browser';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare let google: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public currYear: any = moment().format("Y");
  public currMonth: any = moment().format("MM");
  public monthStartDate: any = moment().startOf('month');
  public month: any;

  public countryId;
  public domainId;
  public userId;
  public apiData: Object;
  public headerData: Object;

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;

  public headTitle: string = "Summary";
  public dealerMidTitle = "Usage for";
  public dealerUsageTitle: string = "";
  public userTitle: string = "No of users active now";
  public threadTitle: string = "Total threads for";
  public escTitle: string = "Current Escalations";
  public escModTitle: string = "Escalations by Models (Top 3)";
  public escZoneTitle: string = "Escalations by Zone (Top 3)";
  public contUsageTitle: string = "Content-Type usage breakdown for ";
  public gtsStatusTitle: string = "Dealer Thread Feedback";
  public gtsProblemTitle: string = "GTS usage by problem type";

  public dashImgPath = "assets/images/dashboard/";
  public regUserIcon = "reg-user-icon.png";
  public regUserCount: number;
  public regUserTxt: string = "Registered Users";

  public empIcon = "employee-icon.png";
  public empCount: number;
  public empTxt: string = "TVS Employees";


  public dealerIcon = "dealer-icon.png";
  public dealerCount: number;
  public dealerTxt: string = "Total Dealers";

  public groupIcon = "group-icon.png";
  public groupCount: number;
  public groupTxt: string = "Others";

  public userMetrics: Object;
  public dealerActivity: Object;
  public activeUsers: Object;
  public threadMetrics: Object;
  public escMetrics: Object;
  public escModMetrics: Object;
  public escZoneMetrics: Object;
  public contentTypes: Object;
  public gtsUsagebyStatus: Object;
  public gtsUsagebyProblemType: Object;
  public platformId = localStorage.getItem('platformId');
  public dealerUsageOptions: Object;
  public activeUsersOptions: Object;
  public threadOptions: Object;
  public escOptions: Object;
  public escModOptions: Object;
  public escZoneOptions: Object;
  public contentTypeOptions: Object;
  public gtsUsageStatusOptions: Object;
  public gtsUsagebyProblemTypeOptions: Object;

  public dashLoading: boolean = true;
  public filterLoading: boolean = true;
  public regUserLoading: boolean = true;
  public tvsEmpLoading: boolean = true;
  public totalDealersLoading: boolean = true;
  public othersLoading: boolean = true;
  public dealerUsageLoading: boolean = true;
  public activeUsersLoading: boolean = true;
  public threadLoading: boolean = true;
  public escLoading: boolean = true;
  public escModLoading: boolean = true;
  public escZoneLoading: boolean = true;
  public contentTypeLoading: boolean = true;
  public gtsStatusLoading: boolean = true;
  public gtsProblemLoading: boolean = true;

  public dealerUsageDataAvail: boolean = true;
  public activeUserDataAvail: boolean = true;
  public threadDataAvail: boolean = true;
  public escDataAvail: boolean = true;
  public escModDataAvail: boolean = true;
  public escZoneDataAvail: boolean = true;
  public contentTypeDataAvail: boolean = true;
  public gtsStatusDataAvail: boolean = true;
  public gtsProblemDataAvail: boolean = true;

  public dealerUsageTxt: string = "dealerUsage";
  public activeUsersTxt: string = "activeUsers";
  public threadTxt: string = "totalThreads";
  public currEscTxt: string = "currEsc";
  public escByModTxt: string = "escMod";
  public escByZoneTxt: string = "escZone";
  public contTypeTxt: string = "contType";
  public gtsStatusTxt: string = "gtsStatus";
  public gtsProblemTxt: string = "gtsProblem";

  public defaultWorkstreamId: number;
  public defaultUserTypeId: number;
  public pageAccess = 'summary';

  public user: any;

  public filterOptions: Object = {
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
  };

  public filterActions: object;
  public expandFlag: boolean = true;

  public chartGroups = [];
  public userTypesArr: any;

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.dealerUsageLoading = true;
    this.activeUsersLoading = true;
    this.threadLoading = true;
    this.escLoading = true;
    this.escModLoading = true;
    this.escZoneLoading = true;
    this.contentTypeLoading = true;
    this.gtsStatusLoading = true;
    this.gtsProblemLoading = true;
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.loadCharts();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private dashboardApi: DashboardService,
    private scrollTopService: ScrollTopService,
    private authenticationService: AuthenticationService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - '+this.headTitle);
  }

  ngOnDestroy(): void {
    document.getElementById('footer').classList.remove('d-none')
  }

  ngOnInit() {


    document.getElementById('footer').classList.add('d-none')

    if (this.platformId == '1') {
      this.empTxt = 'Active Users';
      this.dealerTxt = 'In-Active Users';
      this.groupTxt = 'Waiting For Approval';
      this.regUserIcon = 'registerusers-icon.png';
      this.empIcon = "active-user.png";
      this.dealerIcon = "inactive-user.png";
      this.groupIcon = "waiting-for-approval.png";
      this.gtsProblemTitle = "Daily users";
    }
    this.scrollTopService.setScrollTop();
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let roleId = this.user.roleId;
    //alert(this.user.roleId);

    this.countryId = localStorage.getItem('countryId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined) || roleId==1) ? false : true;
    if (authFlag) {
      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId
      }
      this.apiData = apiInfo;

      let getFilterval = localStorage.getItem('dashFilter');
      let getFilteredValues = (getFilterval == undefined || getFilterval == 'undefined') ? '' : JSON.parse(localStorage.getItem('dashFilter'));
      if (getFilteredValues && getFilteredValues != null) {
        this.currMonth = (getFilteredValues.month == undefined || getFilteredValues.month == 'undefined') ? this.currMonth : getFilteredValues.month;
        // alert(getFilteredValues.month);
        if (getFilteredValues.month == undefined || getFilteredValues.month == 'undefined') {
          let monthval = 12;
          this.month = (getFilteredValues.month == 0) ? '' : moment(getFilteredValues.year + '/' + monthval + '/01').format('MMMM');
        }
        else {
          this.month = (getFilteredValues.month == 0) ? '' : moment(getFilteredValues.year + '/' + getFilteredValues.month + '/01').format('MMMM');
        }

        //alert(this.month+'--1');
      } else {
        this.month = moment().format("MMMM");
        //alert(this.month+'--2');
      }

      // Head Info
      this.headerData = {
        'access': this.pageAccess,
        'title': this.headTitle,
        'titleFlag': true,
        'exportFlag': false,
        'apiInfo': apiInfo,
        'startDate': moment(this.monthStartDate).format('YYYY-MM-DD').toString()
      };

      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();

      localStorage.setItem('threadType', 'open');
      google.charts.load('current', { 'packages': ['corechart', 'gauge'] });

      // Get Filter Widgets
      this.getFilterWidgets();
    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  // Get getFilter Widgets
  getFilterWidgets() {
    let apiData = this.apiData;
    apiData['groupId'] = 0;
    this.dashboardApi.getFilterWidgets(this.apiData).subscribe((response) => {
      if (response.status == "Success") {
        this.filterLoading = false;
        let responseData = response.data;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.filterOptions['filterData'] = responseData;

        let dashApiData = this.apiData;
        let getFilteredValues;
        let defaultWsVal = "", wsVal, defaultUserType = '', utypeVal = '';
        let yearVal = moment().format("Y");
        let monthVal = moment().format("MM");

        for (let res of responseData) {
          let wid = parseInt(res.id);
          switch (wid) {
            case 1:
              getFilteredValues = JSON.parse(localStorage.getItem('dashFilter'));
              let wsItems;
              wsItems = [res.valueArray[0].workstreamId];
              defaultWsVal = wsItems.toString();
              if (getFilteredValues != null) {
                wsItems = (getFilteredValues.workstream == undefined || getFilteredValues.workstream == 'undefined') ? [res.valueArray[0].workstreamId] : getFilteredValues.workstream;
              }
              wsVal = wsItems.toString();
              dashApiData['filterOptions'] = { 'workstream': wsItems };
              break;
            case 2:
              this.userTypesArr = res.valueArray;
              for (let u of this.userTypesArr) {
                if (u.defaultSelection == 1) {
                  dashApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                }
              }
              if (getFilteredValues != null) {
                if (getFilteredValues.userType != undefined || getFilteredValues.userType != 'undefined') {
                  dashApiData['filterOptions']['userType'] = getFilteredValues.userType;
                  utypeVal = getFilteredValues.userType;
                }
              }
              for (let u of this.userTypesArr) {
                if (utypeVal == u.id) {
                  if (this.platformId != '1') {
                    this.dealerUsageTitle = u.name + " ";
                  }

                }
              }
              break;
            case 3:
              let year = res.valueArray[0].year;
              if (getFilteredValues != null) {
                year = (getFilteredValues.year == undefined || getFilteredValues.year == 'undefined') ? year : getFilteredValues.year;
              }
              dashApiData['filterOptions']['year'] = year;
              this.currYear = year;
              break;
            default:
              let month = this.currMonth;
              if (getFilteredValues != null) {
                month = (getFilteredValues.month == undefined || getFilteredValues.month == 'undefined') ? month : getFilteredValues.month;
              }
              dashApiData['filterOptions']['month'] = month;
              break;
          }
        }

        if (defaultWsVal == wsVal && defaultUserType == utypeVal && this.currYear == yearVal && this.currMonth == monthVal) {
          this.filterOptions['filterActive'] = false;
        }

        // Get Dashboard Data
        this.getDashboardData(dashApiData);
      }
    });
  }

  // Get Dashboard
  getDashboardData(apiData) {
    this.dashboardApi.dashboardMetrics(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.data.chartdetails;
        console.log();
        this.dashLoading = false;
        this.regUserLoading = false;
        this.tvsEmpLoading = false;
        this.totalDealersLoading = false;
        this.othersLoading = false;

        // User Metrics
        this.userMetrics = resultData ? resultData.userMetrics.metricsData : [];
        if (this.platformId == '1') {
          this.regUserCount = this.userMetrics['registeredUsers'];

          this.empCount = this.userMetrics['activeUsers'];
          this.dealerCount = this.userMetrics['inActiveUsers'];
          this.groupCount = this.userMetrics['others'];
        }
        else {
          this.regUserCount = this.userMetrics['registeredUsers'];
          this.empCount = this.userMetrics['tvsUsers'];
          this.dealerCount = this.userMetrics['tvsDealers'];
          this.groupCount = this.userMetrics['others'];
        }



        // Chart Datas


        let dealerData = resultData.dealerActivity.metricsData;


        this.dealerActivity = dealerData;
        this.dealerUsageDataAvail = (dealerData.length == 0) ? false : true;

        let activeUserData = resultData ? resultData.activeUsers.metricsData : {
          "totalUsers": "1013",
          "active": 78
        };
        this.activeUsers = activeUserData;
        this.activeUserDataAvail = (activeUserData.length == 0) ? false : true;

        let threadData = resultData ? resultData.threadMetrics.metricsData :
          [{
            "title": "Open",
            "percentageValue": 59,
            "countValue": "163",
            "colorCode": "#ea7d3d"
          }, {
            "title": "Closed",
            "percentageValue": 41,
            "countValue": "115",
            "colorCode": "#3fad9c"
          }];
        this.threadMetrics = threadData;
        this.threadDataAvail = (threadData.length == 0) ? false : true;
        let escData = [];
        if (this.platformId != '1') {
          escData = resultData ? resultData.currentEscalations.metricsData : [];
        }
        this.escMetrics = escData;
        this.escDataAvail = (escData.length == 0) ? false : true;
        let escModData = [];
        if (this.platformId != '1') {
          escModData = resultData ? resultData.escalationbyModels.metricsData : [];
        }

        this.escModMetrics = escModData;
        this.escModDataAvail = (escModData.length == 0) ? false : true;
        let escZoneData = [];
        if (this.platformId != '1') {
          escZoneData = resultData ? resultData.escalationbyZones.metricsData : [];
        }

        this.escZoneMetrics = escZoneData;
        this.escZoneDataAvail = (escZoneData.length == 0) ? false : true;
        let contTypeData = [];
        if (this.platformId != '1') {
          contTypeData = resultData ? resultData.contentTypes.metricsData : [];
        }

        this.contentTypes = contTypeData;
        this.contentTypeDataAvail = (contTypeData.length == 0) ? false : true;
        let gtsStatusData = [];
        if (this.platformId != '1') {
          gtsStatusData = resultData ? resultData.gtsUsagebyStatus.metricsData : [];
        }

        this.gtsUsagebyStatus = gtsStatusData;
        this.gtsStatusDataAvail = (gtsStatusData.length == 0) ? false : true;
        if (this.platformId != '3') {
          this.gtsUsagebyProblemType = resultData ? resultData.gtsUsagebyProblemType.metricsData : [{
            "title": "Battery Discharge Problem",
            "countValue": "1",
            "colorCode": "#9c5c8b"
          }, {
            "title": "Head Lamp Not Working",
            "countValue": "1",
            "colorCode": "#6b719f"
          }];
          this.gtsProblemDataAvail = (resultData && resultData.gtsUsagebyProblemType.metricsData.length == 0) ? false : true;
        }
        else {
          this.gtsUsagebyProblemType = [{
            "title": "Battery Discharge Problem",
            "countValue": "1",
            "colorCode": "#9c5c8b"
          }, {
            "title": "Head Lamp Not Working",
            "countValue": "1",
            "colorCode": "#6b719f"
          }];
          this.gtsProblemDataAvail = true;

        }

        if (resultData) {
          this.chartGroups.push({ 'userMetrics': resultData.userMetrics.id })
          this.chartGroups.push({ 'dealerUsage': resultData.dealerActivity.id });
          this.chartGroups.push({ 'activeUsers': resultData.activeUsers.id });
          this.chartGroups.push({ 'threads': resultData.threadMetrics.id });
          this.chartGroups.push({ 'escalations': resultData.currentEscalations.id });
          this.chartGroups.push({ 'escModels': resultData.escalationbyModels.id });
          this.chartGroups.push({ 'escZones': resultData.escalationbyZones.id });
          this.chartGroups.push({ 'contentTypes': resultData.contentTypes.id });
          this.chartGroups.push({ 'gtsUsageStatus': resultData.gtsUsagebyStatus.id });
          this.chartGroups.push({ 'gtsProblemType': resultData.gtsUsagebyProblemType.id });
          this.chartGroups.push({ 'serviceProbing': resultData.serviceAdvisorProbing.id });
          this.chartGroups.push({ 'zoneBasedActivity': resultData.zonebasedActivity.id });
          this.chartGroups.push({ 'areaBasedActivity': resultData.areabasedActivity.id });
          this.chartGroups.push({ 'userBasedActivity': resultData.userbasedActivity.id });
        }

        localStorage.setItem('chartGroups', JSON.stringify(this.chartGroups));
      }
      // Load Charts
      this.loadCharts();
    });
  }

  // Dealer Usage - Donut Chart
  delaerUsageChart(dealerActivity) {
    let duOptions = {
      title: '',
      backgroundColor: 'transparent',
      colors: [],
      chartArea: { width: '95%', height: '80%' },
      legend: { position: 'center', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium' }, alignment: 'center' },
      pieHole: 0.45,
      pieSliceBorderColor: 'transparent',
      pieSliceText: 'value',
      alwaysOutside: true,
      pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    if (typeof dealerActivity != 'undefined') {
      for (let da of dealerActivity) {
        duOptions['colors'].push(da.colorCode);
      }
    }

    this.dealerUsageOptions = duOptions;
  }

  // Active Users - Guage Chart
  activeUsersChart() {
    let activeUsersOptions = {
      animation: { duration: 800 },
      height: 180,
      minorTicks: 0,
      max: this.activeUsers ? this.activeUsers['totalUsers'] : 0
    };

    this.activeUsersOptions = activeUsersOptions;
  }

  // Total Threads - Pie Chart
  threadChart() {
    let threadOptions = {
      backgroundColor: 'transparent',
      colors: [],
      chartArea: { width: '95%', height: '80%' },
      legend: { position: 'center', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium' }, alignment: 'center' },
      pieSliceBorderColor: 'transparent',
      pieSliceText: 'value',
      pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    this.threadOptions = threadOptions;
  }

  // Current Escalation - Combo Chart
  currentEscalationChart(escMetrics) {
    let escOptions = {
      animation: { duration: 800, startup: true },
      bar: { groupWidth: "25%" },
      backgroundColor: 'transparent',
      chartArea: { width: '75%', height: '70%' },
      colors: ["#d69e3d"],
      vAxis: {
        baselineColor: '#72788E',
        gridlines: { color: '#2C3245' },
        minorGridlines: { color: '#2C3245' },
        textStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular'
        },
        title: 'Count',
        titleTextStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular', italic: false
        }
      },
      hAxis: {
        textStyle: { color: '#76859C' }
      },
      legend: { position: "none" },
      seriesType: 'bars',
      //series: {1: {type: 'line', color: escMetrics[0].lineColor}},
      //curveType: 'function',
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
      width: '100%',
      height: '100%'
    };

    if (typeof escMetrics != 'undefined') {

      for (let esc of escMetrics) {
        escOptions['colors'].push(esc.colorCode);
      }
    }

    this.escOptions = escOptions;
  }

  // Escalation By Models - Column Chart
  escalationModelsChart() {
    let escModOptions = {
      animation: { duration: 800, startup: true },
      bar: { groupWidth: "65%" },
      backgroundColor: 'transparent',
      chartArea: { width: '95%', height: '70%' },
      colors: [],
      vAxis: {
        baselineColor: '#72788E',
        gridlines: { color: '#2C3245' },
        ticks: [],
        textStyle: {
          color: '#76859C', fontSize: 16, fontName: 'Roboto-Regular'
        }
      },
      hAxis: {
        textStyle: { color: '#76859C' }
      },
      isStacked: true,
      legend: { position: "none" },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    this.escModOptions = escModOptions;
  }

  // Escalation By Zone - Column Chart
  escalationZoneChart() {
    let escZoneOptions = {
      animation: { duration: 800, startup: true },
      bar: { groupWidth: "65%" },
      backgroundColor: 'transparent',
      chartArea: { width: '95%', height: '70%' },
      colors: [],
      vAxis: {
        baselineColor: '#72788E',
        gridlines: { color: '#2C3245' },
        ticks: [],
        textStyle: {
          color: '#76859C', fontSize: 16, fontName: 'Roboto-Regular'
        }
      },
      hAxis: {
        textStyle: { color: '#76859C' }
      },
      isStacked: true,
      legend: { position: "none" },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    this.escZoneOptions = escZoneOptions;
  }

  // Content Type Usage Breakdown - Pie Chart
  contentUsageChart() {
    let contentTypeOptions = {
      backgroundColor: 'transparent',
      colors: [],
      chartArea: { width: '95%', height: '80%' },
      legend: { position: 'center', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium' }, alignment: 'center' },
      pieSliceBorderColor: 'transparent',
      pieSliceText: 'percentage',
      pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    this.contentTypeOptions = contentTypeOptions;
  }

  // GTS Usage Status - Column Chart
  gtsUsageStatusChart() {
    let gtsStatusOptions = {
      animation: { duration: 800, startup: true },
      bar: { groupWidth: "65%" },
      backgroundColor: 'transparent',
      chartArea: { width: '85%', height: '65%' },
      vAxis: {
        baselineColor: '#72788E',
        gridlines: { color: '#2C3245' },
        minorGridlines: { color: '#2C3245' },
        textStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular'
        },
        title: 'Count',
        titleTextStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular', italic: false
        }
      },
      hAxis: {
        textStyle: { color: '#76859C' }
      },
      legend: { position: "none" },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    this.gtsUsageStatusOptions = gtsStatusOptions;
  }

  // GTS Usage Problem - Bar Chart
  gtsUsageProblemChart() {
    let gtsProblemOptions = {
      animation: { duration: 800, startup: true },
      bar: { groupWidth: "65%" },
      backgroundColor: 'transparent',
      chartArea: { width: '85%', height: '70%' },
      legend: { position: "none" },
      hAxis: {
        baselineColor: '#72788E',
        format: '0',
        gridlines: { color: '#2C3245' },
        minorGridlines: { color: '#2C3245' },
        textStyle: {
          color: '#76859C', fontSize: 12, fontName: 'Roboto-Regular'
        }
      },
      vAxis: {
        textStyle: { color: 'transparent' }
      },
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
    };

    this.gtsUsagebyProblemTypeOptions = gtsProblemOptions;
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    let dashboardHeight = document.getElementsByClassName('dashboard-content')[0].clientHeight;
    let height = 0;
    height = (this.bodyHeight - (headerHeight + footerHeight));
    this.innerHeight = this.bodyHeight - 135;
    this.filterOptions['filterHeight'] = this.bodyHeight - 75;
    localStorage.removeItem('navPage');
  }

  // Apply Filter
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    this.dealerUsageLoading = true;
    this.regUserLoading = true;
    this.tvsEmpLoading = true;
    this.totalDealersLoading = true;
    this.othersLoading = true;
    this.activeUsersLoading = true;
    this.threadLoading = true;
    this.escLoading = true;
    this.escModLoading = true;
    this.escZoneLoading = true;
    this.contentTypeLoading = true;
    this.gtsStatusLoading = true;
    this.gtsProblemLoading = true;

    if (!resetFlag) {
      console.log(filterData);

      setTimeout(() => {
        this.month = moment(filterData.year + '/' + filterData.month + '/01').format('MMMM');
        // alert(this.month+'--3');
        this.currYear = filterData.year;
        //alert(this.month);
      }, 1000);



      let dashApiData = this.apiData;
      if (filterData.userType) {
        let utype = filterData.userType.toString();
        for (let u of this.userTypesArr) {
          if (utype == u.id) {
            if (this.platformId != '1') {
              this.dealerUsageTitle = u.name + " ";
            }

          }
        }
      }

      dashApiData['filterOptions'] = filterData;
      // Get Dashboard Data
      this.getDashboardData(dashApiData);
    } else {
      localStorage.removeItem('dashFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.currYear = moment().format("Y");
    this.currMonth = moment().format("MM");
    this.monthStartDate = moment().startOf('month');
    this.ngOnInit();
  }

  // Load Charts
  loadCharts() {
    // Dealer Usage - Donut Chart
    this.delaerUsageChart(this.dealerActivity);
    setTimeout(() => {
      this.dealerUsageLoading = false;
    }, 200);

    // Active Users - Guage Chart
    this.activeUsersChart();
    setTimeout(() => {
      this.activeUsersLoading = false;
    }, 200);

    // Total Threads - Pie Chart
    this.threadChart();
    setTimeout(() => {
      this.threadLoading = false;
    }, 200);

    // Current Escalation - Combo Chart
    this.currentEscalationChart(this.escMetrics);
    setTimeout(() => {
      this.escModLoading = false;
    }, 200);

    // Current Escalation - Combo Chart
    this.currentEscalationChart(this.escMetrics);
    setTimeout(() => {
      this.escZoneLoading = false;
    }, 200);

    // Current Escalation - Combo Chart
    this.currentEscalationChart(this.escMetrics);
    setTimeout(() => {
      this.escLoading = false;
    }, 200);

    // Escalation By Models - Column Chart
    this.escalationModelsChart();
    setTimeout(() => {
      this.escModLoading = false;
    }, 200);

    // Escalation By Zone - Column Chart
    this.escalationZoneChart();
    setTimeout(() => {
      this.escZoneLoading = false;
    }, 200);

    // Content Type Usage Breakdown - Pie Chart
    this.contentUsageChart();
    setTimeout(() => {
      this.contentTypeLoading = false;
    }, 200);

    // GTS Usage Status - Column Chart
    this.gtsUsageStatusChart();
    setTimeout(() => {
      this.gtsStatusLoading = false;
    }, 200);

    // GTS Usage Problem - Bar Chart
    this.gtsUsageProblemChart();
    setTimeout(() => {
      this.gtsProblemLoading = false;
    }, 400);
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
    setTimeout(() => {
      this.loadCharts();
    }, 300);
  }

  // Page Navigation
  navigatePage(url) {
    //this.router.navigate([url]);
    //localStorage.setItem('accessFrom', 'dashboard');
    //console.log(url);
    //location.href = url;
  }

}
