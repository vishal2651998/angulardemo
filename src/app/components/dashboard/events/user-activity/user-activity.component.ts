import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 14;
  public apiData: Object;
  public currYear: any = moment().format("Y");
  public currMonth: any = moment().format("MM");
  public filterStartDate:any = moment().startOf('month');
  public filterEndDate = moment().format('YYYY-MM-DD');

  public bodyHeight: number;
  public innerWidth: number;
  public innerHeight: number;
  public innerHeightnew: number;
  public filterHeight: number;

  public title: string = "User Activity Metrics";
  public headTitle: string = this.title;
  public headerFlag: boolean = false;
  public headerData: Object;
  public exportData: any = [];

  public userData = [];
  public userActData: any = null;
  public userActOptions: Object;
  public userActLoading: boolean = true;

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
  public pageAccess = 'userMetrics';
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

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 80;
    this.scrollTop = event.target.scrollTop;

    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.total > this.length) {
        this.scrollCallback = false;
        //this.getUserActData(this.apiData);
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setScreenHeight();
    this.resize = true;
    this.resetFlag = this.resize;
    //google.charts.setOnLoadCallback(this.drawChart(this.userActData));
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
    this.domainId = localStorage.getItem('domainId');
    this.userId = localStorage.getItem('userId');
    this.countryId = localStorage.getItem('countryId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;

    if(authFlag) {
      let groupInfo = JSON.parse(localStorage.getItem('chartGroups'));
      for (let g of groupInfo) {
        if(g.hasOwnProperty('userBasedActivity')){
          this.groupId = g.userBasedActivity;
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
        'apiInfo': apiInfo,
        'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
      };

      let navPage = localStorage.getItem('navPage');
      this.resetFlag = (navPage == undefined || navPage == 'undefined') ? this.resetFlag : (navPage == 'true') ? true : this.resetFlag;

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

        let userActApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('userActivityFilter'));
        let defaultWsVal = '', wsVal, defaultUserType = '', utypeVal = '', zoneVal = '', areaVal = '', ttyVal = '';
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
              userActApiData['filterOptions'] = {'workstream': wsItems};
              break;
            case 2:
              for (let u of item.valueArray) {
                if(u.defaultSelection == 1) {
                  userActApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                }
              }
              if(getFilteredValues != null) {
                if(getFilteredValues.userType != undefined || getFilteredValues.userType != 'undefined') {
                  userActApiData['filterOptions']['userType'] = getFilteredValues.userType;
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
              }
              if(accessFrom != undefined || accessFrom != 'undefined' && accessFrom == 'dashboard') {
                if(dashFilter != undefined || dashFilter != 'undefined') {
                  sDate = moment([year, month-1]).format('YYYY-MM-DD');
                }
              }
              userActApiData['filterOptions']['startDate'] = sDate;
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
              userActApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              localStorage.removeItem('accessFrom');
              break;
          }
        }

        if(defaultWsVal == wsVal && userActApiData['filterOptions']['startDate'] == startDateVal && userActApiData['filterOptions']['endDate'] == endDateVal && defaultUserType == utypeVal) {
          this.filterOptions['filterActive'] = false;
        }

        // Get User Activity Data
        this.getUserActData(userActApiData);
      }
    });
  }

  // Get User Activity Data
  getUserActData(apiData) {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    apiData['limit'] = this.limit;
    apiData['offset'] = this.offset;
    apiData['storage'] = 'escModelFilter';
    apiData['filterOptions']['groupId'] = this.groupId;

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let userActData = responseData.chartdetails;

        this.userData = userActData;
        this.userActLoading = false;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;

        this.scrollCallback = true;
        this.scrollInit = 1;

        this.total = responseData.total;
        this.length += userActData.length;
        this.offset += this.limit;

        if(userActData.length == 0) {
          this.noDataFlag = (this.offset == 30) ? true : false;
          userActData = [];
        } else {
          this.noDataFlag = false;
        }

        if(!this.noDataFlag) {
          google.charts.setOnLoadCallback(this.drawChart(userActData));
        } else {
          if(this.offset == 30) {
            document.getElementById('barChart').innerHTML = "";
          }
        }
      }
    });
  }

  drawChart(userActData) {
    let initFlag = (this.userActData == null) ? true : false;
    let chartData = userActData;
    let gcData = new google.visualization.DataTable();

    if(this.noDataFlag) {
      document.getElementById('barChart').innerHTML = "";
    } else {
      if(initFlag) {
        let columnLen = chartData[0].views.length+2;
        for (let c=0; c<columnLen; c++) {
          if(c < 1) {
            gcData.addColumn('string', 'User Name');
          } else if(c < columnLen-1) {
            gcData.addColumn('number', 'Count');
            gcData.addColumn({type: 'string', role: 'tooltip'});
          } else {
            gcData.addColumn({type: 'number',  role: "annotation"});
          }
        }
      }

      let width = this.innerWidth-140;
      let scrollLength = this.offset/30;
      let chartHeight;
      let paddingHeight = 30;
      let rowHeight  = this.length * 80;
      chartHeight = rowHeight + paddingHeight;
      let innerChartHeight = '98%';
      if(scrollLength > 2) {
        //chartHeight = chartHeight-(this.offset*2);
        innerChartHeight = '99%';
      }

      if(scrollLength == 1) {
        let total = this.total;
        if(this.total < 5) {
          chartHeight = '50%';
          innerChartHeight = chartHeight;
        } else if(this.total <= 10) {
          chartHeight = '98%';
          innerChartHeight = chartHeight;
        } else if(this.total <= 20) {
          chartHeight = '85%';
          innerChartHeight = chartHeight;
        } else if(this.total <= 30) {
          //chartHeight = '100%';
        }
      }

      this.userActOptions = {
        animation: {duration: 800, startup: true},
        annotations: {
          alwaysOutside: true,
          textStyle: {
            color: '#FFFFFF', fontSize: 14, fontName: 'Roboto-Regular'
          }
        },
        bar: {groupWidth: "50%"},
        backgroundColor: 'transparent',
        colors: [],
        chartArea:{width: '80%', height: innerChartHeight},
        legend: { position: "none" },
        isStacked: true,
        hAxis: {
          baselineColor: '#72788E',
          format: '0',
          gridlines: {color: '#2C3245'},
          minorGridlines: {color: '#2C3245'},
          textStyle: {
            color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular'
          }
        },
        vAxis: {
          textStyle: {color: '#ADB6C4', fontSize: 11, fontName: 'Roboto-Regular'}
        },
        tooltip: {
          textStyle: { color: '#FFFFFF', fontSize: 12, fontName: 'Roboto-Regular'}
        },
        height: chartHeight
      };

      //if(!this.resize) {
        for (let data of chartData) {
          let colData = [];
          let strLen = 16;
          let uname = data.username;
          let name = (uname.length > strLen) ? uname.substring(0, strLen)+'...' : uname;;
          colData.push(name);
          for (let esc of data.views) {
            this.userActOptions['colors'].push(esc.colorCode);
            colData.push(esc.count);
            colData.push(name+'\n'+esc.title+': '+esc.count);
          }
          colData.push(data.total_views);
          gcData.addRow(colData);
        }
      //}

      let chart = new google.visualization.BarChart(document.getElementById('barChart'));
      chart.draw(gcData, this.userActOptions);

    }

   // alert('acted');
    this.setScreenHeightNew();

  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (this.resetFlag) ? 10 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+275));
    this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight+140));
    //this.filterOptions['filterHeight'] = this.filterHeight+90;
    this.innerHeightnew = window.innerHeight - 175;
    this.filterOptions['filterHeight'] = window.innerHeight - 75;
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  setScreenHeightNew() {
    let headerHeight = (this.resetFlag) ? 10 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    //this.innerHeightnew = (this.bodyHeight-(headerHeight+footerHeight+40));
    this.filterHeight = (window.innerHeight-(headerHeight+footerHeight+140));
    //this.filterOptions['filterHeight'] = this.filterHeight+90;
    this.innerHeightnew = window.innerHeight - 175;
    this.filterOptions['filterHeight'] = window.innerHeight - 75;
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  // Apply Filter
  applyFilter(filterData) {
    this.limit = 30;
    this.offset = 0;
    this.length = 0;
    this.total = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.userActLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.userData = [];
    let resetFlag = filterData.reset;
    document.getElementById('barChart').innerHTML = "";
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.getUserActData(this.apiData);
    } else {
      localStorage.removeItem('userActivityFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.resetFlag = true;
    this.filterLoading = true;
    this.ngOnInit();
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.resize = true;
    this.resetFlag = this.resize;
    setTimeout(() => {
      google.charts.setOnLoadCallback(this.drawChart(this.userData));
    },300);
  }

}
