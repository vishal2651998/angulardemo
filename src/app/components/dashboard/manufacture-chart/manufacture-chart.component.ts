import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common/common.service';
declare let google: any;

@Component({
  selector: 'app-manufacture-chart',
  templateUrl: './manufacture-chart.component.html',
  styleUrls: ['./manufacture-chart.component.scss']
})
export class ManufactureChartComponent implements OnInit {

  @ViewChild("leader", { static: false }) leader: any;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public industryType: any = "";
  public headerData: object;
  public headTitle: string = "";
  public pageAccess = 'manufacturechart';
  public threadType: string = 'Open';
  public countryId;
  public domainId;
  public month: any;
  public chartOptions: object;
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
  public tsType: string = '1';

  constructor(private commonApi: CommonService,private titleService: Title,private leaderboardApi: LeaderboardService, private authenticationService: AuthenticationService, private dashboardApi: DashboardService) {
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
      this.industryType = this.commonApi.getIndustryType();
      if(this.industryType.id != 1){
        this.tsType = '1';
        this.headTitle = 'Manufacturer/Make'
      }
      else{
        this.tsType = '2';
        this.headTitle = 'Make'
      }
      this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
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

    // Set default thread type
    setThreadType(threadInfo) {
      console.clear()
      console.log(threadInfo);

    }


  getTechSupportChartData() {
    this.apiData.startDate = this.apiData.startDate ?? this.leaderboardApi.startDate;
    this.apiData.endDate = this.apiData.endDate ?? this.leaderboardApi.endDate;
    //this.apiData.limit = 30;
    //this.apiData.offset = this.leaderboardApi.offset;
    this.apiData.type = this.tsType;
    //this.apiData.threadCategoryId = this.tsThreadCategoryId;
    this.headerFlag = false;

    this.leaderboardApi.getMfgMakeChart(this.apiData).subscribe(response => {
      if (response.status == "Success") {

if(this.tsType == '1'){
  this.techSupportData = response.mfgData;
}
else{
  this.techSupportData = response.makeData;
}


        console.log(this.techSupportData)

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
          this.loadChart();
          setTimeout(() => {
            this.leaderBoardLoading = false;
          }, 200);
          this.scrollCallback = true;
        }, 1000);
        this.scrollInit = 1;

      } else if (response.status == 'Failure') {

        this.leaderBoardLoading = true;
        this.leaderboardApi.offset = 0;
        this.length = 0;
        this.usageData = [];
        this.techSupportData = [];

        console.log(this.techSupportData);
        //if (!this.techSupportData.length) {
          //this.headerFlag = false;
          //this.headerData['exportFlag'] = false;
          this.techSupportDataAvail = false;
          this.innerHeightnew = null;
        //}
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

    // Open Threads Chart
    loadChart() {
      let width = this.innerWidth - 100;
      let height = document.getElementsByClassName('thread-cont')[0].clientHeight;
      let chartOptions = {
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

      this.chartOptions = chartOptions;
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
    this.getTechSupportChartData();
   /* if (filterData.reset) {
      const container = document.querySelector('.chart-col');
      container.scrollTop = 0;
      this.resetFilter();
    } else {
      const container = document.querySelector('.chart-col');
      container.scrollTop = 0;
      this.getTechSupportChartData();
    }*/
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

  manufactureTabAction(data){
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
    this.getTechSupportChartData();

  }

  ngOnDestroy(): void {
    document.getElementById('footer').classList.remove('d-none')
  }
}


