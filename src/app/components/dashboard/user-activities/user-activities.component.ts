import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserActivitiesService } from 'src/app/services/user-activities.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Title } from '@angular/platform-browser';
declare let google: any;

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};

  public headerData: object;
  public headTitle: string = "User Activity";
  public pageAccess = 'user-activities';
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
  public threadGroupId: number = 25;
  public filterStartDate: any = '';
  public userActivitiesLoading: boolean = true;
  public userActivitiesProblemLoading: boolean = false;
  public userActivitiesDataAvail: boolean = true;
  public userActivitiesProblemDataAvail: boolean = false;
  public userActivitiesData: Array<any> = [];
  public userActivitiesOptions: Object;
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

  constructor(private titleService: Title,private userActivitiesApi: UserActivitiesService, private authenticationService: AuthenticationService, private dashboardApi: DashboardService) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
  }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 500;
    this.scrollTop = event.target.scrollTop;

    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.total > this.length) {
        this.scrollCallback = false;
        this.getUserActivitiesChartData();
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
      'titleFlag': true,
      'exportFlag': false,
      'exportFlagthread': false,

      'exportData': {
        'userActivitiesData': [],
        'threadTitle': this.threadType
      },
      'apiInfo': apiInfo,
      'total': 0,
      'groupId': this.threadGroupId,
      'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
    };
    this.apiData.limit = 30;
    this.userActivitiesApi.offset = 0;
    this.apiData.offset = this.userActivitiesApi.offset;
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
        // Get User Activities Board Data
        this.getUserActivitiesChartData();
      }
    });
  }

  getUserActivitiesChartData() {
    this.apiData.startDate = this.apiData.startDate ?? this.userActivitiesApi.startDate;
    this.apiData.endDate = this.apiData.endDate ?? this.userActivitiesApi.endDate;
    this.apiData.sortBy = this.apiData.sortBy ?? this.userActivitiesApi.sortBy;
    this.apiData.limit = 30;
    this.apiData.offset = this.userActivitiesApi.offset;
    this.headerFlag = false;

    this.userActivitiesApi.getUserActivitiesChartData(this.apiData).subscribe(response => {
      if (response.status == "Success") {
        this.userActivitiesData = response.data;
        this.userActivitiesData.forEach((data) => {
          this.headerData['exportData'].userActivitiesData.push(data)
        });
        this.headerData['exportFlag'] = true;
        this.headerData['exportFlagthread'] = false;
        this.headerFlag = true;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.userActivitiesDataAvail = true;
        this.total = response.total;
        this.length += this.userActivitiesData.length;

        this.userActivitiesApi.offset += this.userActivitiesApi.limit;

        this.headerData['total'] = true;
        setTimeout(() => {
          this.userActivitiesLoading = false;
          this.scrollCallback = true;
          google.charts.setOnLoadCallback(this.drawChart(this.userActivitiesData))
        }, 1000);
        this.scrollInit = 1;

      } else if (response.status == 'Failure') {
        if (!this.userActivitiesData.length) {
          this.headerFlag = false;
          this.headerData['exportFlag'] = false;
          this.userActivitiesDataAvail = false;
          this.innerHeightnew = null;
        }
        this.userActivitiesLoading = false;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        // google.charts.setOnLoadCallback(this.drawChart([]))
      }
    }, err => {
      this.filterOptions['filterLoading'] = false;
      this.filterLoading = false;
      this.headerFlag = false;
      this.userActivitiesDataAvail = false;
      this.scrollCallback = true;
      this.setScreenHeightnew();

      this.userActivitiesLoading = false;
      this.headerData['exportFlag'] = false;
      console.log(err);
    })
  }


  drawChart(userActivitiesData: any) {
    let width = this.innerWidth - 100;
    let initFlag = (this.userActivitiesData.length) ? true : false;
    let chartData = userActivitiesData;
    let colorIndex = 0;
    let charColors: any = [];
    if (!this.resize) {
      for (let data of chartData) {
        let valueArray: any = [];
        let title = data.userName;
        valueArray.push(title);
        for (let metric of data.metrics) {
          valueArray.push(parseInt(metric.count));
          valueArray.push(metric.color);
          valueArray.push(parseInt(metric.count));
          valueArray.push(parseInt(metric.count) + ' ' + metric.title);
          if (!colorIndex) {
            charColors.push(metric.color);
          }
        }
        this.usageData.push(valueArray);
        colorIndex += 1;
      }
    }
    let gcData =  new google.visualization.DataTable();

    if (initFlag) {
      gcData.addColumn('string', 'Username');
      chartData[0].metrics.forEach((metric: any) => {
        gcData.addColumn('number', metric.title);
        gcData.addColumn({ type: 'string', role: "style" });
        gcData.addColumn({ type: 'number', role: "annotation" });
        gcData.addColumn({ type: 'string', role: 'tooltip' });
      });
    }

    gcData.addRows(this.usageData);

    let scrollLength = this.userActivitiesApi.offset / 30;
    let chartHeight;
    let paddingHeight = 30;
    let rowHeight = this.length * 50;
    chartHeight = rowHeight + paddingHeight;
    this.userActivitiesOptions = {
      animation: { duration: 800, startup: true },
      annotations: {
        alwaysOutside: false,
        textStyle: {
          color: '#76859C', fontSize: 12, fontName: 'Roboto-Regular'
        },
        style: 'point',
        stem: {
          length: 0
        }
      },
      axisTitlesPosition: 'inside',
      bar: { groupWidth: "50%" },
      backgroundColor: 'transparent',
      chartArea: { top: 50, width: '80%', height: '100%' },
      legend: {
        position: 'top',
        alignment: 'center',
        maxLines: 3,
        textStyle: {
          color: '#76859C', fontSize: 12, fontName: 'Roboto-Regular'
        }
      },
      colors: charColors,
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
      height: chartHeight,
      isStacked: true
    };
    if (document.getElementById('barChart')) {
      let chart = new google.visualization.BarChart(document.getElementById('barChart'));
      chart.draw(gcData, this.userActivitiesOptions);
      setTimeout(() => {
        const container = document.getElementById('barChart');
        const labels = container.getElementsByTagName('text');
        Array.prototype.forEach.call(labels, (label) => {
          // move axis labels
          if (label.getAttribute('text-anchor') === 'end') {
            const xCoord = parseFloat(label.getAttribute('x'));
            label.setAttribute('x', xCoord - 10);
          }
        });
      }, 2000);
    }
    this.bodyHeight = window.innerHeight;
    this.setScreenHeightnew();
  }

  applyFilter(filterData) {
    if (filterData.reset) {
      this.filterOptions['filterLoading'] = false;
      localStorage.removeItem('dashFilter');
      this.apiData.startDate = this.userActivitiesApi.startDate;
      this.apiData.endDate = this.userActivitiesApi.endDate;
      this.apiData.sortBy = this.userActivitiesApi.sortBy;
      this.resetFlag = true;
      this.filterLoading = true;
    } else {
      console.log("filterData: ", filterData);
      this.apiData.startDate = filterData.startDate;
      this.apiData.endDate = filterData.endDate;
      this.apiData.sortBy = filterData.sortBy;
    }
    this.userActivitiesLoading = true;
    this.userActivitiesApi.offset = 0;
    this.length = 0;
    this.usageData = [];
    this.userActivitiesData = [];
    if (filterData.reset) {
      const container = document.querySelector('.chart-col');
      container.scrollTop = 0;
      this.resetFilter();
    } else {
      const container = document.querySelector('.chart-col');
      container.scrollTop = 0;
      this.getUserActivitiesChartData();
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

  ngOnDestroy(): void {
    document.getElementById('footer').classList.remove('d-none')
  }
}
