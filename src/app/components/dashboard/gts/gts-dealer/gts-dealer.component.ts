import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'app-gts-dealer',
  templateUrl: './gts-dealer.component.html',
  styleUrls: ['./gts-dealer.component.scss']
})
export class GtsDealerComponent implements OnInit {

  public title: string = "GTS Dealer Usage";
  public headTitle: string = "GTS Dealer Usage";
  public headerFlag: boolean = false;
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 16;
  public apiData: Object;
  public currYear: any = moment().format("Y");
  public currMonth: any = moment().format("MM");
  public filterStartDate:any = moment().startOf('month');
  public filterEndDate = moment().format('YYYY-MM-DD');

  public bodyHeight: number;
  public innerWidth: number;
  public innerHeight: number;
  public filterHeight: number;

  public headerData: Object;
  public usageData = [];
  public gtsUsageData: any = null;
  public gtsUsageOptions: Object;
  public gtsLoading: boolean = true;

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
  public pageAccess = 'gtsDealer';
  public resetFlag: boolean = false;
  public userTypesArr: any;
  public searchVal: string = '';

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

    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.total > this.length) {
        this.scrollCallback = false;
        this.getGtsUsageData(this.apiData);
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.resize = true;
    this.resetFlag = this.resize;
    google.charts.setOnLoadCallback(this.drawChart(this.usageData));
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
        if(g.hasOwnProperty('gtsProblemType')){
          //this.groupId = g.gtsProblemType;
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
        'searchFlag': true,
        'searchKey': '',
        'searchPlaceHolder': '',
        'apiInfo': apiInfo,
        'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
      };

      let navPage = localStorage.getItem('navPage');
      this.resetFlag = (navPage == undefined || navPage == 'undefined') ? this.resetFlag : (navPage == 'true') ? true : this.resetFlag;

      this.bodyHeight = window.innerHeight;
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

        let gtsApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('gtsUsageFilter'));
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
              gtsApiData['filterOptions'] = {'workstream': wsItems};
              break;
            case 2:
              this.userTypesArr = item.valueArray;
              let searchPlaceHolder;
              let searchTxt = 'Search ';
              for (let u of this.userTypesArr) {
                if(u.defaultSelection == 1) {
                  gtsApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                  searchPlaceHolder = searchTxt+u.name;
                }
              }
              if(getFilteredValues != null) {
                let userType = (getFilteredValues.userType == undefined || getFilteredValues.userType == 'undefined') ? [utypeVal] : getFilteredValues.userType;
                utypeVal = userType;
                gtsApiData['filterOptions']['userType'] = utypeVal;
                for (let u of this.userTypesArr) {
                  if(utypeVal == u.id) {
                    searchPlaceHolder = searchTxt+u.name;
                  }
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
              gtsApiData['filterOptions']['startDate'] = sDate;
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
              gtsApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              localStorage.removeItem('accessFrom');
              break;
          }
        }

        if(getFilteredValues != null) {
          this.searchVal = (getFilteredValues.searchKey == undefined || getFilteredValues.searchKey == 'undefined') ? this.searchVal : getFilteredValues.searchKey;
          this.headerData['searchKey'] = this.searchVal;
          gtsApiData['searchKey'] = this.searchVal;
        }

        if(defaultWsVal == wsVal && gtsApiData['filterOptions']['startDate'] == startDateVal && gtsApiData['filterOptions']['endDate'] == endDateVal &&  gtsApiData['filterOptions']['zone'] == zoneVal  && gtsApiData['filterOptions']['area'] == areaVal && gtsApiData['filterOptions']['territory'] == ttyVal && defaultUserType == utypeVal) {
          this.filterOptions['filterActive'] = false;
        }
        // Get Escalation Model Data
        this.getGtsUsageData(gtsApiData);
      }
    });
  }

  // Get Escalation Model Data
  getGtsUsageData(apiData) {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.headerFlag = false;
    this.headerData['exportFlag'] = this.headerFlag;
    apiData['limit'] = this.limit;
    apiData['offset'] = this.offset;
    apiData['storage'] = 'gtsUsageFilter';
    apiData['filterOptions']['groupId'] = this.groupId;
    apiData['searchKey'] = this.searchVal;

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let gtsUsageData = responseData.chartdetails;
        this.gtsLoading = false;

        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;

        this.scrollCallback = true;
        this.scrollInit = 1;

        this.total = responseData.total;
        this.length += gtsUsageData.length;
        this.offset += this.limit;

        if(gtsUsageData.length == 0) {
          this.noDataFlag = (this.offset == 30) ? true : false;
          gtsUsageData = [];
        } else {
          this.noDataFlag = false;
        }

        if(!this.noDataFlag) {
          google.charts.setOnLoadCallback(this.drawChart(gtsUsageData));
        } else {
          if(this.offset == 30) {
            document.getElementById('barChart').innerHTML = "";
          }
        }
      }
    });
  }

  drawChart(gtsUsageData) {
    let width = this.innerWidth-100;
    let initFlag = (this.gtsUsageData == null) ? true : false;
    let chartData = gtsUsageData;
    if(!this.resize) {
      for (let data of chartData) {
        let strLen = 20;
        let title = data.title;
        let id = parseInt(data.userId);
        title = (title.length > strLen) ? title.substring(0, strLen)+'...\n'+id : title+'\n'+id;
        let value = parseInt(data.countValue);
        let color = data.colorCode;
        let tooltipValue = data.title+'\n Count: '+value;
        this.usageData.push([title,value,color,value,tooltipValue]);
      }
    }

    let gcData = new google.visualization.DataTable();
    let chart = new google.visualization.BarChart(document.getElementById('barChart'));

    if(initFlag) {
      gcData.addColumn('string', 'Title');
      gcData.addColumn('number', 'Count');
      gcData.addColumn({type: 'string',  role: "style"});
      gcData.addColumn({type: 'number',  role: "annotation"});
      gcData.addColumn({type: 'string', role: 'tooltip'});
    }
    gcData.addRows(this.usageData);

    let scrollLength = this.offset/30;
    let chartHeight;
    let paddingHeight = 30;
    let rowHeight  = this.length * 50;
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
        chartHeight = this.total * 40 + 30;
        innerChartHeight = chartHeight;
      } else if(this.total <= 10) {
        chartHeight = '100%';
        chartHeight = this.total * 40 + 30;
        innerChartHeight = chartHeight;
      } else if(this.total <= 20) {
        chartHeight = '90%';
        chartHeight = this.total * 40 + 30;
        innerChartHeight = chartHeight;
      } else if(this.total <= 30) {
        //chartHeight = '100%';
      }
    }

    this.gtsUsageOptions = {
      animation: {duration: 800, startup: true},
      annotations: {
        alwaysOutside: true,
        textStyle: {
          color: '#76859C', fontSize: 12, fontName: 'Roboto-Regular'
        }
      },
      axisTitlesPosition: 'inside',
      bar: {groupWidth: "50%"},
      backgroundColor: 'transparent',
      chartArea:{top:10, width:'80%', height: innerChartHeight},
      legend: { position: "none" },
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
        textStyle: {color: '#ADB6C4', fontSize: 10, fontName: 'Roboto-Regular'}
      },
      tooltip: {
        textStyle: { color: '#FFFFFF', fontSize: 12, fontName: 'Roboto-Regular'}
      },
      height: chartHeight
    };

    chart = new google.visualization.BarChart(document.getElementById('barChart'));
    chart.draw(gcData, this.gtsUsageOptions);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (this.resetFlag) ? 10 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    //this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+248));
    this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight+140));
    //this.filterOptions['filterHeight'] = this.filterHeight+90;
    this.resetFlag = false;
    this.innerHeight = this.bodyHeight - 180;
    this.filterOptions['filterHeight'] = this.bodyHeight - 75;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  // Apply Search
  applySearch(val) {
    this.searchVal = val;
    this.apiData['searchKey'] = this.searchVal;
    this.limit = 30;
    this.offset = 0;
    this.length = 0;
    this.total = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.gtsLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.usageData = [];
    this.headerData['searchKey'] = this.searchVal;
    this.headerFlag = true;
    document.getElementById('barChart').innerHTML = "";
    this.getGtsUsageData(this.apiData);
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
    this.gtsLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.usageData = [];
    let resetFlag = filterData.reset;
    document.getElementById('barChart').innerHTML = "";
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.getGtsUsageData(this.apiData);
    } else {
      localStorage.removeItem('gtsUsageFilter');
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
      google.charts.setOnLoadCallback(this.drawChart(this.usageData));
    }, 300);
  }

}
