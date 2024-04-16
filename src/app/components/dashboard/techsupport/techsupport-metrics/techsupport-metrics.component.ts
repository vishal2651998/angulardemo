import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { Title } from '@angular/platform-browser';
declare let google: any;

@Component({
  selector: 'app-techsupport-metrics',
  templateUrl: './techsupport-metrics.component.html',
  styleUrls: ['./techsupport-metrics.component.scss']
})
export class TechsupportMetricsComponent implements OnInit {

  @ViewChild("leader", { static: false }) leader: any;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public headerData: object;
  public headTitle: string = "Techsupport Metrics";
  public pageAccess = 'techsupport';
  public threadType: string = 'Open';
  public countryId;
  public domainId;
  public month: any;

  public innerHeightnew: number;

  public innerWidth: number;
  public usageData = [];

  public headerFlag: boolean = false;
  public resetFlag: boolean = false;

  public userId;
  user: any;
  public threadGroupId: number = 24;
  public filterStartDate: any = '';
  public leaderBoardLoading: boolean = true;
  public leaderBoardProblemLoading: boolean = false;
  public techSupportDataAvail: boolean = true;
  public leaderBoardProblemDataAvail: boolean = false;
  public techSupportData: Array<any> = [];
  public leaderBoardOptions: Object;
  public filterLoading: boolean = true;
  public expandFlag: boolean = true;
  public filterOptions: Object = {
    page: this.pageAccess,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
  };
  apiData: any;
  public noDataFlag: boolean = false;
  public bodyHeight: number;

  public resize: boolean = false;

  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;

  public total: number = 0;
  public scrollInit: number = 0;
  public length: number = 0;

  public tsThreadCategoryId: string = '';
  public tsType: string = '';

  constructor(private titleService: Title,private leaderboardApi: LeaderboardService, private authenticationService: AuthenticationService, private dashboardApi: DashboardService) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
   }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 80;
    this.scrollTop = event.target.scrollTop;

    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.total > this.length) {
        this.scrollCallback = false;
        this.getTechSupportChartData();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
  // resetFilter() {
  //   this.resetFlag = false;
  //   this.filterLoading = true;
  //   this.ngOnInit();
  // }
  ngOnInit(): void {
    google.charts.load('current', { 'packages': ['corechart', 'gauge'] });

    document.getElementById('footer').classList.add('d-none');

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');

    setTimeout(() => {
      let techSupportChartsTabs = JSON.parse(
        localStorage.getItem("techSupportChartsTabs")
      );
      this.tsThreadCategoryId = this.tsThreadCategoryId == '' ? techSupportChartsTabs[0].id : this.tsThreadCategoryId;
      this.tsType = this.tsType == '' ? techSupportChartsTabs[0].type : this.tsType;
    }, 100);

    let apiInfo = {
      'apiKey': "dG9wZml4MTIz",
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'groupId': this.threadGroupId
    }
    this.apiData = apiInfo;
    this.headerData = {
      'access': this.pageAccess,
      'title': this.headTitle,
      'titleFlag': false,
      'exportFlag': false,
      'exportFlagthread': false,

      'exportData': {
        'techSupportData': [],
        'threadTitle': this.threadType
      },
      'apiInfo': apiInfo,
      'total': 0,
      'groupId': this.threadGroupId,
      'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
    };
    this.apiData.limit = 30;
    this.leaderboardApi.offset = 0;
    this.apiData.offset = this.leaderboardApi.offset;
    this.getFilterWidgets();
  }
  getFilterWidgets() {
    let apiData = this.apiData;
    this.dashboardApi.getFilterWidgets(this.apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        this.filterOptions['filterData'] = responseData;
        for (let res in responseData) {
          let item = responseData[res];
          let wid = parseInt(item.id);
          switch (wid) {
            case 6:
              break;
            case 10:
              break;
          }
        }
        // Get Leaders Board Data
        this.getTechSupportChartData();
      }
    });
  }

  leaderBoardChart() {
    let duOptions = {
      animation: { duration: 800, startup: true },
      annotations: {
        alwaysOutside: true,
        textStyle: {
          color: '#76859C', fontSize: 12, fontName: 'Roboto-Regular'
        }
      },
      axisTitlesPosition: 'inside',
      bar: { groupWidth: "50%" },
      backgroundColor: 'transparent',
      chartArea: { top: 10, width: '80%', height: '99%' },
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
        textStyle: { color: '#ADB6C4', fontSize: 12, fontName: 'Roboto-Regular' }
      },
      tooltip: {
        textStyle: { color: '#FFFFFF', fontSize: 12, fontName: 'Roboto-Regular' }
      },
      height: '80vh',
      width: '100%'
    };
    this.leaderBoardOptions = duOptions;
  }

  getTechSupportChartData() {
    this.apiData.startDate = this.apiData.startDate ?? this.leaderboardApi.startDate;
    this.apiData.endDate = this.apiData.endDate ?? this.leaderboardApi.endDate;
    this.apiData.limit = 30;
    this.apiData.offset = this.leaderboardApi.offset;
    this.apiData.type = this.tsType;
    this.apiData.threadCategoryId = this.tsThreadCategoryId;
    this.headerFlag = false;

    this.leaderboardApi.getTechSupportChartData(this.apiData).subscribe(response => {
      if (response.status == "Success") {

        if(this.apiData.type == '2'){
          this.techSupportData = response.techSupportData;
        }
        else{
          this.techSupportData = response.items;
        }

        /*this.techSupportData.forEach((data) => {
          this.headerData['exportData'].techSupportData.push(data)
        })

        this.headerData['exportFlag'] = true;
        this.headerFlag = true;*/
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.techSupportDataAvail = true;
        this.total = response.total;
        this.length += this.techSupportData.length;

        this.leaderboardApi.offset += this.leaderboardApi.limit;

        //this.headerData['total'] = true;
        setTimeout(() => {
          this.leaderBoardLoading = false;
          this.scrollCallback = true;
          google.charts.setOnLoadCallback(this.drawChart(this.techSupportData))
        }, 1000);
        this.scrollInit = 1;

      } else if (response.status == 'Failure') {

        this.leaderBoardLoading = true;
        this.leaderboardApi.offset = 0;
        this.length = 0;
        this.usageData = [];
        this.techSupportData = [];
        const container = document.querySelector('.chart-col');
        container.scrollTop = 0;

        console.log(this.techSupportData);
        if (!this.techSupportData.length) {
          this.headerFlag = false;
          //this.headerData['exportFlag'] = false;
          this.techSupportDataAvail = false;
          this.innerHeightnew = null;
        }
        this.leaderBoardLoading = false;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        // google.charts.setOnLoadCallback(this.drawChart([]))
      }
    }, err => {
      this.filterOptions['filterLoading'] = false;
      this.filterLoading = false;
      this.headerFlag = false;
      this.techSupportDataAvail = false;
      this.scrollCallback = true;
      this.setScreenHeightnew();

      this.leaderBoardLoading = false;
      //this.headerData['exportFlag'] = false;
      console.log(err);
    })
  }


  drawChart(techSupportData) {
   console.log(techSupportData);
    let width = this.innerWidth - 100;
    let initFlag = (this.techSupportData.length) ? true : false;
    let chartData = techSupportData;
    if (!this.resize) {
      for (let data of chartData) {
        let strLen = 14;
        let uname = data.name;
        let title = (uname.length > strLen) ? uname.substring(0, strLen) + '...' : uname;
        let value = data.totalCount;
        let color = data.colorCode;
        let tooltipValue = uname + '\n Count: ' + value;
        this.usageData.push([title, value, color, value, tooltipValue]);
      }
    }
    console.log(this.usageData);

    let gcData = new google.visualization.DataTable();

    if (initFlag) {
      gcData.addColumn('string', 'Name');
      gcData.addColumn('number', 'Count');
      gcData.addColumn({ type: 'string', role: "style" });
      gcData.addColumn({ type: 'number', role: "annotation" });
      gcData.addColumn({ type: 'string', role: 'tooltip' });
    }

    gcData.addRows(this.usageData);

    let scrollLength = this.leaderboardApi.offset / 30;
    let chartHeight;
    let paddingHeight = 30;
    let rowHeight = this.length * 50;

    chartHeight = rowHeight + paddingHeight;
    let innerChartHeight = '98%';
    if (scrollLength > 2) {
      //chartHeight = chartHeight-(this.offset*2);
      innerChartHeight = '99%';
    }

    if (scrollLength == 1) {
      let total = this.total;
      if (this.total < 10) {
        chartHeight = this.total * 40 + 50;
        innerChartHeight = chartHeight;
      } else if (this.total <= 10) {
        chartHeight = '65%';
        innerChartHeight = chartHeight;
      } else if (this.total <= 20) {
        chartHeight = '85%';
        innerChartHeight = chartHeight;
      } else if (this.total <= 30) {
        chartHeight = '95%';
      }
    }

    this.leaderBoardOptions = {
      animation: { duration: 800, startup: true },
      annotations: {
        alwaysOutside: true,
        textStyle: {
          color: '#76859C', fontSize: 12, fontName: 'Roboto-Regular'
        }
      },
      axisTitlesPosition: 'inside',
      bar: { groupWidth: "50%" },
      backgroundColor: 'transparent',
      chartArea: { top: 10, width: '80%', height: innerChartHeight },
      legend: { position: "none" },
      hAxis: {
        baselineColor: '#72788E',
        format: '0',
        gridlines: { color: '#2C3245' },
        minorGridlines: { color: '#2C3245' },
        textStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular'
        }
      },
      vAxis: {
        textStyle: { color: '#ADB6C4', fontSize: 12, fontName: 'Roboto-Regular' }
      },
      tooltip: {
        textStyle: { color: '#FFFFFF', fontSize: 12, fontName: 'Roboto-Regular' }
      },
      height: chartHeight
    };
    if (document.getElementById('barChart')) {
      let chart = new google.visualization.BarChart(document.getElementById('barChart'));
      chart.draw(gcData, this.leaderBoardOptions);
    }

    this.bodyHeight = window.innerHeight;
    this.setScreenHeightnew();
  }

  applyFilter(filterData) {
    if (filterData.reset) {
      this.filterOptions['filterLoading'] = false;
      localStorage.removeItem('dashFilter');
      this.apiData.startDate = this.leaderboardApi.startDate;
      this.apiData.endDate = this.leaderboardApi.endDate;
      this.resetFlag = true;
      this.filterLoading = true;
    } else {
      this.apiData.startDate = filterData.startDate;
      this.apiData.endDate = filterData.endDate;
    }
    this.leaderBoardLoading = true;
    this.leaderboardApi.offset = 0;
    this.length = 0;
    this.usageData = [];
    this.techSupportData = [];
    if (filterData.reset) {
      const container = document.querySelector('.chart-col');
      container.scrollTop = 0;
      this.resetFilter();
    } else {
      const container = document.querySelector('.chart-col');
      container.scrollTop = 0;
      this.getTechSupportChartData();
    }
  }

  resetFilter() {
    this.resetFlag = true;
    this.filterLoading = true;
    this.scrollTop = 0;
    this.lastScrollTop = 0;
    this.ngOnInit();
  }

  setScreenHeightnew() {
    let headerHeight = document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    let dashboardHeight = document.getElementsByClassName('dashboard-content')[0].clientHeight;
    let height = (this.bodyHeight - (headerHeight + footerHeight));
    this.innerHeightnew = this.bodyHeight - 135;
    this.filterOptions['filterHeight'] = this.bodyHeight - 75;
    localStorage.removeItem('navPage');
    this.resetFlag = false;
  }

  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    setTimeout(() => {
      // this.loadCharts();
    }, 300);
  }

  techsuppotTabAction(data){
    this.tsThreadCategoryId = data.id;
    this.tsType = data.type;

    this.filterOptions['filterLoading'] = false;
    localStorage.removeItem('dashFilter');
    this.apiData.startDate = this.leaderboardApi.startDate;
    this.apiData.endDate = this.leaderboardApi.endDate;
    this.resetFlag = true;
    this.filterLoading = true;
    this.leaderBoardLoading = true;
    this.leaderboardApi.offset = 0;
    this.length = 0;
    this.usageData = [];
    this.techSupportData = [];
    const container = document.querySelector('.chart-col');
    container.scrollTop = 0;
    document.getElementById('barChart').innerHTML = "";
    this.resetFilter();

  }

  ngOnDestroy(): void {
    document.getElementById('footer').classList.remove('d-none')
  }
}

