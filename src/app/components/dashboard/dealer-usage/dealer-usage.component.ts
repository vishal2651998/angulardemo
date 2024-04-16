import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare let google: any;

@Component({
  selector: 'app-dealer-usage',
  templateUrl: './dealer-usage.component.html',
  styleUrls: ['./dealer-usage.component.scss']
})
export class DealerUsageComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 1;
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

  public headTitle: string = "Dealer Usage";
  public headText: string = " Usage"
  public headerFlag: boolean = false;
  public headerData: Object;
  public usageData = [];
  public dealerActivityData: any = null;
  public dealerActivityOptions: Object;
  public dealerActivityLoading: boolean = true;

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
  public pageAccess = 'dealerUsage';
  public userTypesArr: any;
  public resetFlag: boolean = false;
  public searchVal: string = '';
  public user: any;
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
    let totalHeight = event.target.scrollHeight-80;
    this.scrollTop = event.target.scrollTop;

    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.total > this.length) {
        this.scrollCallback = false;
        this.getDealerActivityData(this.apiData);
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeightnew();
    this.resize = true;
    this.resetFlag = this.resize;
    google.charts.setOnLoadCallback(this.drawChart(this.usageData));
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private dashboardApi: DashboardService,
    private scrollTopService: ScrollTopService,
    private authenticationService: AuthenticationService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
  }

  ngOnInit() {
    this.scrollTopService.setScrollTop();
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;

    if(authFlag) {
      let groupInfo = JSON.parse(localStorage.getItem('chartGroups'));
      for (let g of groupInfo) {
        if(g.hasOwnProperty('dealerUsage')){
          this.groupId = g.dealerUsage;
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
        'title': this.headTitle,
        'titleFlag': true,
        'exportFlag': false,
        'searchFlag': true,
        'searchKey': '',
        'searchPlaceHolder': '',
        'apiInfo': apiInfo,
        'total': 0,
        'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
      };
      //this.headerFlag = true;

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
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.filterOptions['filterData'] = responseData;

        let accessFrom = localStorage.getItem('accessFrom');
        let dashFilter = JSON.parse(localStorage.getItem('dashFilter'));
        let year = dashFilter.year;
        let month = dashFilter.month;

        let dealerApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('dealerFilter'));

        //let defaultWsVal = '', wsVal, defaultUserType = '', utypeVal = '', zoneVal = '', areaVal = '', ttyVal = '', userVal = '', statusVal = 0;
        let defaultWsVal = '', wsVal, defaultUserType = '', utypeVal = '', zoneVal = '', areaVal = '', ttyVal = '', statusVal = 0;
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
              dealerApiData['filterOptions'] = {'workstream': wsItems};
              break;
            case 2:
              this.userTypesArr = item.valueArray;
              let searchPlaceHolder;
              let searchTxt = 'Search ';
              for (let u of this.userTypesArr) {
                if(u.defaultSelection == 1) {
                  dealerApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                  searchPlaceHolder = searchTxt+u.name;
                }
              }

              if(getFilteredValues != null) {
                let userType = (getFilteredValues.userType == undefined || getFilteredValues.userType == 'undefined') ? [utypeVal] : getFilteredValues.userType;
                utypeVal = userType;
                dealerApiData['filterOptions']['userType'] = utypeVal;
                for (let u of this.userTypesArr) {
                  if(utypeVal == u.id) {
                    searchPlaceHolder = searchTxt+u.name;
                  }
                }
              }

              let navFrom = localStorage.getItem('navFrom');
              if(navFrom != undefined || navFrom != 'undefined' && navFrom == 'summary') {
                if(dashFilter != undefined || dashFilter != 'undefined') {
                  let userTypeValue = dashFilter.userType.toString();
                  for (let u of this.userTypesArr) {
                    if(userTypeValue == u.id) {
                      dealerApiData['filterOptions']['userType'] = [u.id];
                      utypeVal = u.id;
                      defaultUserType = utypeVal;
                      searchPlaceHolder = searchTxt+u.name;
                      localStorage.removeItem('navFrom');
                    }
                  }
                }
              }

              console.log(dealerApiData['filterOptions']['userType'])
              this.headerData['searchPlaceHolder'] = searchPlaceHolder;

              for (let u of this.userTypesArr) {
                if(utypeVal == u.id) {
                  this.headTitle = u.name+this.headText;
                  this.headerData['title'] = this.headTitle;
                  this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
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
              dealerApiData['filterOptions']['startDate'] = sDate;
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
              dealerApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              localStorage.removeItem('accessFrom');
              break;
            case 7:
              let zone = '';
              if(getFilteredValues != null) {
                zone = (getFilteredValues.zone == undefined || getFilteredValues.zone == 'undefined') ? zone : getFilteredValues.zone;
              }
              zoneVal = zone;
              dealerApiData['filterOptions']['zone'] = zone;
              this.filterOptions['filterData'][res]['zone'] = zone;

              let area = '';
              if(getFilteredValues != null) {
                area = (getFilteredValues.area == undefined || getFilteredValues.area == 'undefined') ? area : getFilteredValues.area;
              }
              areaVal = area;
              dealerApiData['filterOptions']['area'] = area;
              this.filterOptions['filterData'][res]['area'] = area;

              let territory = '';
              if(getFilteredValues != null) {
                territory = (getFilteredValues.territory == undefined || getFilteredValues.territory == 'undefined') ? territory : getFilteredValues.territory;
              }
              ttyVal = territory;
              dealerApiData['filterOptions']['territory'] = territory;
              this.filterOptions['filterData'][res]['territory'] = territory;

              /*let town = '';
              if(getFilteredValues != null) {
                town = (getFilteredValues.town == undefined || getFilteredValues.town == 'undefined') ? town : getFilteredValues.town;
              }
              dealerApiData['filterOptions']['town'] = town;
              this.filterOptions['filterData'][res]['town'] = town;*/
              break;
            case 8:
              /*let dealer = [""];
              if(getFilteredValues != null) {
                dealer = (getFilteredValues.dealerCode == undefined || getFilteredValues.dealerCode == 'undefined') ? dealer : getFilteredValues.dealerCode;
              }
              userVal = dealer.toString();
              dealerApiData['filterOptions']['dealerCode'] = dealer;
              this.filterOptions['filterData'][res]['value'] = dealer;*/
              break;
            case 9:
              let status;
              let selectedStatus = localStorage.getItem('selectedDealerStatus');
              if(selectedStatus == undefined || selectedStatus == 'undefined') {
                status = 0;
                if(getFilteredValues != null) {
                  status = (getFilteredValues.status == undefined || getFilteredValues.status == 'undefined') ? status : getFilteredValues.status;
                }
              } else {
                if(selectedStatus == "") {
                  status = 0;
                } else {
                  for (let s of item.valueArray) {
                    if(s.name == selectedStatus) {
                      status = s.id;
                      localStorage.removeItem('selectedDealerStatus');
                    }
                  }
                }
              }

              dealerApiData['filterOptions']['status'] = status;
              this.filterOptions['filterData'][res]['status'] = status;
              break;
          }
        }

        if(getFilteredValues != null) {
          this.searchVal = (getFilteredValues.searchKey == undefined || getFilteredValues.searchKey == 'undefined') ? this.searchVal : getFilteredValues.searchKey;
          this.headerData['searchKey'] = this.searchVal;
          dealerApiData['searchKey'] = this.searchVal;
        }

        //console.log(defaultWsVal+' == '+wsVal+'\n'+dealerApiData['filterOptions']['status']+' == '+statusVal+'\n'+dealerApiData['filterOptions']['startDate']+' == '+startDateVal+'\n'+dealerApiData['filterOptions']['endDate']+' == '+endDateVal+'\n'+dealerApiData['filterOptions']['zone']+' == '+zoneVal+'\n'+dealerApiData['filterOptions']['area']+' == '+areaVal+'\n'+dealerApiData['filterOptions']['territory']+' == '+ttyVal+'\n'+defaultUserType+' == '+utypeVal);
        if(defaultWsVal == wsVal && dealerApiData['filterOptions']['status'] == statusVal && dealerApiData['filterOptions']['startDate'] == startDateVal && dealerApiData['filterOptions']['endDate'] == endDateVal &&  dealerApiData['filterOptions']['zone'] == zoneVal  && dealerApiData['filterOptions']['area'] == areaVal && dealerApiData['filterOptions']['territory'] == ttyVal && defaultUserType == utypeVal) {
          this.filterOptions['filterActive'] = false;
        }

        setTimeout(() => {
          // Get Dealer Activity Data
          this.getDealerActivityData(dealerApiData);
        }, 500);
      }
    });
  }

  // Get Dealer Activity Data
  getDealerActivityData(apiData) {
    this.headerFlag = false;
    this.headerData['exportFlag'] = this.headerFlag;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['limit'] = this.limit;
    this.apiData['offset'] = this.offset;
    this.apiData['storage'] = 'dealerFilter';
    this.apiData['filterOptions']['groupId'] = this.groupId;

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let dealerActivityData = responseData.chartdetails;
        this.dealerActivityLoading = false;
        /*let dealerList = [];
        for (let dealer of dealerActivityData) {
          let id = (dealer.Usertype == 2) ? dealer.dealerCode : dealer.userId;
          let name = (dealer.Usertype == 2) ? dealer.dealerName : dealer.userName;
          dealerList.push({
            'dealerCode': id,
            'dealerName': name
          });
        }

        this.filterOptions['dealerList'] = dealerList;*/
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;

        this.scrollCallback = true;
        this.scrollInit = 1;

        this.total = responseData.total;
        this.length += dealerActivityData.length;
        this.offset += this.limit;

        if(this.total == 0) {
          this.noDataFlag = true;
          dealerActivityData = [];
        } else {
          this.noDataFlag = false;
          this.headerData['total'] = this.total;
        }

        this.headerData['exportFlag'] = !this.noDataFlag;
        this.headerFlag = true;

        if(!this.noDataFlag) {
          google.charts.setOnLoadCallback(this.drawChart(dealerActivityData));
        } else {
          if(this.offset == 30) {
            document.getElementById('barChart').innerHTML = "";
          }
        }
      }
    });
  }

  drawChart(dealerActivityData) {
    let width = this.innerWidth-100;
    let initFlag = (this.dealerActivityData == null) ? true : false;
    let chartData = dealerActivityData;
    if(!this.resize) {
      console.log(chartData)
      for (let data of chartData) {
        let title;
        let strLen = 14;
        if(data.userType == 2) {
          let dname = data.dealerName;
          title = (dname.length > strLen) ? dname.substring(0, strLen)+'...\n'+data.dealerCode : dname+'\n'+data.dealerCode;
        } else {
          let uname = data.userName;
          title = (uname.length > strLen) ? uname.substring(0, strLen)+'...' : uname;
        }
        let value = data.totaltime;
        let color = data.colorCode;
        let zone = data.zone;
        let zoneSpace = (zone == '') ? '' : ', ';
        let area = data.userarea;
        let areaSpace = (area == '') ? '' : ', ';
        let tty = data.territory;
        let ttySpace = (tty == '') ? '' : ', ';
        let tooltipValue;
        if(data.Usertype == 2) {
          tooltipValue = data.dealerName+' - '+data.dealerCode+zoneSpace+zone+areaSpace+area+ttySpace+tty+'\n Count: '+value;
        } else {
          tooltipValue = data.userName+zoneSpace+zone+areaSpace+area+ttySpace+tty+'\n Count: '+value;
        }
        this.usageData.push([title,value,color,value,tooltipValue]);
      }
    }

    let gcData = new google.visualization.DataTable();

    if(initFlag) {
      gcData.addColumn('string', 'Dealer Name');
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
        chartHeight = '80%';
        innerChartHeight = chartHeight;
      } else if(this.total <= 20) {
        chartHeight = '90%';
        innerChartHeight = chartHeight;
      } else if(this.total <= 30) {
        //chartHeight = '100%';
      }
    }

    this.dealerActivityOptions = {
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

    let chart = new google.visualization.BarChart(document.getElementById('barChart'));
    chart.draw(gcData, this.dealerActivityOptions);

    this.bodyHeight = window.innerHeight;
    this.setScreenHeightnew();
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (this.resetFlag) ? -18 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+230));
    this.filterHeight = (window.innerHeight-(headerHeight+footerHeight));
    this.filterOptions['filterHeight'] = this.filterHeight+30;
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.resetFlag+'::'+this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  setScreenHeightnew() {
    let headerHeight = document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    let dashboardHeight = document.getElementsByClassName('dashboard-content')[0].clientHeight;
    let height = ( this.bodyHeight - ( headerHeight + footerHeight ));
    this.innerHeightnew = this.bodyHeight - 135;
    this.filterOptions['filterHeight'] = this.bodyHeight - 75;
    localStorage.removeItem('navPage');
     this.resetFlag = false;
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
    this.dealerActivityLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.usageData = [];
    this.headerData['searchKey'] = this.searchVal;
    this.headerFlag = true;
    document.getElementById('barChart').innerHTML = "";
    this.getDealerActivityData(this.apiData);
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
    this.dealerActivityLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.usageData = [];
    let resetFlag = filterData.reset;
    document.getElementById('barChart').innerHTML = "";
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.headerFlag = false;
      let utype = filterData.userType.toString();
      console.log(utype)
      for (let u of this.userTypesArr) {
        if(utype == u.id) {
          this.headerData['searchPlaceHolder'] = 'Search '+u.name;
          this.headTitle = u.name+this.headText;
          this.headerData['title'] = this.headTitle;
          this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
          //this.headerFlag = true;
        }
      }
      this.getDealerActivityData(this.apiData);
    } else {
      this.resetFlag = true;
      localStorage.removeItem('dealerFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions['filterLoading'] = this.filterLoading;
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

  ngOnDestroy() {
    let dealerFilter = JSON.parse(localStorage.getItem('dealerFilter'));
    dealerFilter.searchKey = "";
    localStorage.setItem('dealerFilter', JSON.stringify(dealerFilter));
  }

}
