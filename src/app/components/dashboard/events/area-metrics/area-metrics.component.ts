import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'app-area-metrics',
  templateUrl: './area-metrics.component.html',
  styleUrls: ['./area-metrics.component.scss']
})
export class AreaMetricsComponent implements OnInit {
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 13;
  public apiData: Object;
  public currYear: any = moment().format("Y");
  public currMonth: any = moment().format("MM");
  public filterStartDate:any = moment().startOf('month');
  public filterEndDate = moment().format('YYYY-MM-DD');

  public bodyHeight: number;
  public innerWidth: number;
  public innerHeight: number;
  public filterHeight: number;

  public title: string = "Area Based Event View";
  public headTitle: string = this.title;
  public headerFlag: boolean = false;
  public headerData: Object;
  public exportData: any = [];

  public areaData: any = null;
  public areaOptions: Object;
  public areaLoading: boolean = true;
  public noDataFlag: boolean = false;

  public resize: boolean = false;
  public expandFlag: boolean = true;
  public filterLoading: boolean = true;
  public pageAccess = 'areaMetrics';
  public resetFlag: boolean = false;

  public filterOptions: Object = {
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'apiKey': '',
    'domainId': '',
    'countryId': '',
    'userId': ''
  };

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setScreenHeight();
    this.resize = true;
    this.resetFlag = this.resize;
    this.loadCharts();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private dashboardApi: DashboardService,
    private scrollTopService: ScrollTopService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.title);
  }

  ngOnInit() {
    this.scrollTopService.setScrollTop();
    this.countryId = localStorage.getItem('countryId');
    this.domainId = localStorage.getItem('domainId');
    this.userId = localStorage.getItem('userId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;

    if(authFlag) {
      let groupInfo = JSON.parse(localStorage.getItem('chartGroups'));
      for (let g of groupInfo) {
        if(g.hasOwnProperty('areaBasedActivity')){
          this.groupId = g.areaBasedActivity;
        }
      }

      let apiInfo = {
        'apiKey': "dG9wZml4MTIz",
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId
      }
      this.apiData = apiInfo;

      // Head Info
      this.headerData = {
        'access': this.pageAccess,
        'activePage': this.router.url,
        'title': this.headTitle,
        'titleFlag': false,
        'exportFlag': false,
        'exportData': [],
        'apiInfo': apiInfo,
        'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
      };

      let navPage = localStorage.getItem('navPage');
      this.resetFlag = (navPage == undefined || navPage == 'undefined') ? this.resetFlag : (navPage == 'true') ? true : this.resetFlag;

      this.headerFlag = true;
      this.bodyHeight = screen.height;
      this.setScreenHeight();

      this.filterOptions['apiKey'] = this.apiData['apiKey'];
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      this.filterOptions['userId'] = this.userId;

      google.charts.load('current', {'packages':['corechart']});

      // Get Filter Widgets
      this.getFilterWidgets();
    }  else {
      this.router.navigate(['/forbidden']);
    }
  }

  // Get getFilter Widgets
  getFilterWidgets() {
    let apiData = this.apiData;
    apiData['groupId'] = this.groupId;
    this.dashboardApi.getFilterWidgets(this.apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        this.filterOptions['filterData'] = responseData;

        let accessFrom = localStorage.getItem('accessFrom');
        let dashFilter = JSON.parse(localStorage.getItem('dashFilter'));
        let year = dashFilter.year;
        let month = dashFilter.month;

        let areaApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('areaActivityFilter'));
        let defaultWsVal = '', wsVal, defaultUserType = '', utypeVal = '';
        let startDateVal = moment(this.filterStartDate).format('YYYY-MM-DD').toString();
        let endDateVal = moment(this.filterEndDate).format('YYYY-MM-DD').toString();

        for (let res in responseData) {
          let item = responseData[res];
          let wid = parseInt(item.id);
          switch(wid) {
            case 1:
              let wsItems;
              wsItems = [item.valueArray[0].workstreamId];
              defaultWsVal = wsItems.toString();
              if(getFilteredValues != null) {
                wsItems = (getFilteredValues.workstream == undefined || getFilteredValues.workstream == 'undefined') ? [item.valueArray[0].workstreamId] : getFilteredValues.workstream;
              }
              wsVal = wsItems.toString();
              areaApiData['filterOptions'] = {'workstream': wsItems};
              break;
            case 2:
              for (let u of item.valueArray) {
                if(u.defaultSelection == 1) {
                  areaApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                }
              }
              if(getFilteredValues != null) {
                if(getFilteredValues.userType != undefined || getFilteredValues.userType != 'undefined') {
                  areaApiData['filterOptions']['userType'] = getFilteredValues.userType;
                  utypeVal = getFilteredValues.userType;
                }
              }
              break;
            case 6:
              let startDate = moment(this.filterStartDate).format('YYYY-MM-DD').toString();
              let sDate;
              if(getFilteredValues != null) {
                sDate = (getFilteredValues.startDate == undefined || getFilteredValues.startDate == 'undefined') ? startDate : getFilteredValues.startDate;
              } else {
                sDate = startDate;
              }if(accessFrom != undefined || accessFrom != 'undefined' && accessFrom == 'dashboard') {
                if(dashFilter != undefined || dashFilter != 'undefined') {
                  sDate = moment([year, month-1]).format('YYYY-MM-DD');
                }
              }
              areaApiData['filterOptions']['startDate'] = sDate;
              this.filterOptions['filterData'][res]['value'] = sDate;
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
              areaApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              localStorage.removeItem('accessFrom');
              break;
          }
        }

        if(defaultWsVal == wsVal && areaApiData['filterOptions']['startDate'] == startDateVal && areaApiData['filterOptions']['endDate'] == endDateVal && defaultUserType == utypeVal) {
          this.filterOptions['filterActive'] = false;
        }

        // Get Area Based Activity Data
        this.getAreaActivityData(areaApiData);
      }
    });
  }

  // Get Area Based Activity Data
  getAreaActivityData(apiData) {
    this.headerFlag = false;
    this.headerData['exportFlag'] = this.headerFlag;
    this.apiData['storage'] = 'areaActivityFilter';
    this.apiData['filterOptions']['groupId'] = this.groupId;
    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let areaActivityData = responseData.chartdetails;
        this.areaData = areaActivityData;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.noDataFlag = (areaActivityData.length == 0) ? true : false;
        if(this.noDataFlag) {
          this.exportData = [];
        }
        this.headerData['exportData'] = this.exportData;
        this.headerFlag = true;
        this.headerData['exportFlag'] = this.headerFlag;

        this.loadCharts();
      }
    });
  }

  // Load Charts
  loadCharts() {
    if(!this.noDataFlag) {
      this.areaChart();
      setTimeout(() => {
        this.areaLoading = false;
      }, 200);
    } else {
      this.areaLoading = false;
    }
  }

  areaChart() {
    let width = this.innerWidth-100;
    let height = document.getElementsByClassName('area-cont')[0].clientHeight;
    let areaOptions = {
      title: '',
      backgroundColor: 'transparent',
      colors: [],
      chartArea:{width: '90%', height: '75%'},
      legend: {position: 'center', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'center'},
      pieHole: 0.6,
      pieSliceBorderColor: 'transparent',
      pieSliceText: 'value',
      pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
      tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}},
      width: width,
      height: height
    };
    this.areaOptions = areaOptions;
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (this.resetFlag) ? 10 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    //this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+250));
    this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight))+140;
    //this.filterOptions['filterHeight'] = this.filterHeight+90;
    this.innerHeight = window.innerHeight - 175;
    this.filterOptions['filterHeight'] = window.innerHeight - 75;
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  // Apply Filter
  applyFilter(filterData) {
    this.areaLoading = true;
    this.areaData = [];
    let exportData = this.headerData['exportData'];
    this.resize = false;
    this.resetFlag = this.resize;
    exportData = [];
    let resetFlag = filterData.reset;
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.getAreaActivityData(this.apiData);
    } else {
      localStorage.removeItem('areaActivityFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.resetFlag = true;
    this.filterLoading = true;
    localStorage.removeItem('areaActivityFilter');
    this.ngOnInit();
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.areaLoading = true;
    this.resize = true;
    this.resetFlag = this.resize;
    setTimeout(() => {
      this.loadCharts();
    },300);
  }

}
