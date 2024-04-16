import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'app-service-probing',
  templateUrl: './service-probing.component.html',
  styleUrls: ['./service-probing.component.scss']
})
export class ServiceProbingComponent implements OnInit, OnDestroy {
  public headTitle: string = "Service Advisor Probing";
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 11;
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

  public headerFlag: boolean = false;
  public headerData: Object;
  public usageData = [];
  public serviceProbingData: any = null;
  public serviceProbingOptions: Object;
  public serviceProbingLoading: boolean = true;

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
  public pageAccess = 'serviceProbing';
  public userTypesArr: any;
  public resetFlag: boolean = false;
  public searchVal: string = '';

  public filterOptions: Object = {
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'userList': [],
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
        this.getserviceProbingData(this.apiData);
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
    google.charts.setOnLoadCallback(this.drawChart(this.usageData));
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private dashboardApi: DashboardService,
    private scrollTopService: ScrollTopService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +this.headTitle);
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
        if(g.hasOwnProperty('serviceProbing')){
          this.groupId = g.serviceProbing;
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
        //this.filterLoading = false;
        let responseData = response.data;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.filterOptions['filterData'] = responseData;

        let accessFrom = localStorage.getItem('accessFrom');
        let dashFilter = JSON.parse(localStorage.getItem('dashFilter'));
        let year = dashFilter.year;
        let month = dashFilter.month;

        let serviceApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('serviceFilter'));
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
              serviceApiData['filterOptions'] = {'workstream': wsItems};
              break;
            case 2:
              this.userTypesArr = item.valueArray;
              let searchPlaceHolder;
              let searchTxt = 'Search ';
              for (let u of this.userTypesArr) {
                if(u.defaultSelection == 1) {
                  serviceApiData['filterOptions']['userType'] = [u.id];
                  utypeVal = u.id;
                  defaultUserType = utypeVal;
                  searchPlaceHolder = searchTxt+u.name;
                }
              }

              if(getFilteredValues != null) {
                let userType = (getFilteredValues.userType == undefined || getFilteredValues.userType == 'undefined') ? [utypeVal] : getFilteredValues.userType;
                utypeVal = userType;
                serviceApiData['filterOptions']['userType'] = utypeVal;
                for (let u of this.userTypesArr) {
                  if(utypeVal == u.id) {
                    searchPlaceHolder = searchTxt+u.name;
                  }
                }
              }

              let navFrom = localStorage.getItem('navFrom');
              if(navFrom != undefined || navFrom != 'undefined' && navFrom == 'summary') {
                if(dashFilter!= undefined || dashFilter!= 'undefined') {
                  let userTypeValue = dashFilter.userType.toString();
                  for (let u of this.userTypesArr) {
                    if(userTypeValue == u.id) {
                      serviceApiData['filterOptions']['userType'] = [u.id];
                      utypeVal = u.id;
                      defaultUserType = utypeVal;
                      searchPlaceHolder = searchTxt+u.name;
                      localStorage.removeItem('navFrom');
                    }
                  }
                }
              }

              this.headerData['searchPlaceHolder'] = searchPlaceHolder;

              for (let u of this.userTypesArr) {
                if(utypeVal == u.id) {
                  let serviceTitle = this.headTitle+' '+u.name;
                  this.headerData['title'] = serviceTitle;
                  this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +serviceTitle);
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
              serviceApiData['filterOptions']['startDate'] = sDate;
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
                serviceApiData['filterOptions']['endDate'] = eDate;
                this.filterOptions['filterData'][res]['value'] = eDate;
                localStorage.removeItem('accessFrom');
                break;
            case 7:
              let zone = '';
              if(getFilteredValues != null) {
                zone = (getFilteredValues.zone == undefined || getFilteredValues.zone == 'undefined') ? zone : getFilteredValues.zone;
              }
              zoneVal = zone;
              serviceApiData['filterOptions']['zone'] = zone;
              this.filterOptions['filterData'][res]['zone'] = zone;

              let area = '';
              if(getFilteredValues != null) {
                area = (getFilteredValues.area == undefined || getFilteredValues.area == 'undefined') ? area : getFilteredValues.area;
              }
              areaVal = area;
              serviceApiData['filterOptions']['area'] = area;
              this.filterOptions['filterData'][res]['area'] = area;

              let territory = '';
              if(getFilteredValues != null) {
                territory = (getFilteredValues.territory == undefined || getFilteredValues.territory == 'undefined') ? territory : getFilteredValues.territory;
              }
              ttyVal = territory;
              serviceApiData['filterOptions']['territory'] = territory;
              this.filterOptions['filterData'][res]['territory'] = territory;

              /*let town = '';
              if(getFilteredValues != null) {
                town = (getFilteredValues.town == undefined || getFilteredValues.town == 'undefined') ? town : getFilteredValues.town;
              }
              serviceApiData['filterOptions']['town'] = town;
              this.filterOptions['filterData'][res]['town'] = town;*/
              break;
            case 8:
              /*let user = [""];
              if(getFilteredValues != null) {
                user = (getFilteredValues.dealerCode == undefined || getFilteredValues.dealerCode == 'undefined') ? user : getFilteredValues.dealerCode;
              }
              userVal = user.toString();
              serviceApiData['filterOptions']['dealerCode'] = user;
              this.filterOptions['filterData'][res]['value'] = user;*/
              break;
          }
        }

        if(getFilteredValues != null) {
          this.searchVal = (getFilteredValues.searchKey == undefined || getFilteredValues.searchKey == 'undefined') ? this.searchVal : getFilteredValues.searchKey;
          this.headerData['searchKey'] = this.searchVal;
          serviceApiData['searchKey'] = this.searchVal;
        }

        //console.log(defaultWsVal+' == '+wsVal+'\n'+serviceApiData['filterOptions']['startDate']+' == '+startDateVal+'\n'+serviceApiData['filterOptions']['endDate']+' == '+endDateVal+'\n'+serviceApiData['filterOptions']['zone']+' == '+zoneVal+'\n'+serviceApiData['filterOptions']['area']+' == '+areaVal+'\n'+serviceApiData['filterOptions']['territory']+' == '+ttyVal+'\n'+defaultUserType+' == '+utypeVal+'\n'+serviceApiData['filterOptions']['dealerCode']+' == '+userVal);
        if(defaultWsVal == wsVal && serviceApiData['filterOptions']['startDate'] == startDateVal && serviceApiData['filterOptions']['endDate'] == endDateVal &&  serviceApiData['filterOptions']['zone'] == zoneVal  && serviceApiData['filterOptions']['area'] == areaVal && serviceApiData['filterOptions']['territory'] == ttyVal && defaultUserType == utypeVal) {
          this.filterOptions['filterActive'] = false;
        }

        // Get Service Probing Data
        this.getserviceProbingData(serviceApiData);
      }
    });
  }

  // Get Service Probing Data
  getserviceProbingData(apiData) {
    this.headerFlag = false;
    this.headerData['exportFlag'] = this.headerFlag;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['limit'] = this.limit;
    this.apiData['offset'] = this.offset;
    this.apiData['storage'] = 'serviceFilter';
    this.apiData['filterOptions']['groupId'] = this.groupId;

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let serviceProbingData = responseData.chartdetails;
        this.serviceProbingLoading = false;
        /*let userList = [];
        for (let dealer of serviceProbingData) {
          let id = (dealer.Usertype == 2) ? dealer.dealerCode : dealer.userId;
          let name = (dealer.Usertype == 2) ? dealer.dealerName : dealer.userName;
          userList.push({
            'dealerCode': id,
            'dealerName': name
          });
        }

        this.filterOptions['dealerList'] = userList;*/
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;

        this.scrollCallback = true;
        this.scrollInit = 1;

        this.total = responseData.total;
        this.length += serviceProbingData.length;
        this.offset += this.limit;

        if(serviceProbingData.length == 0) {
          this.noDataFlag = (this.offset == 30) ? true : false;
          serviceProbingData = [];
        } else {
          this.noDataFlag = false;
          this.headerData['total'] = this.total;
        }

        this.headerData['exportFlag'] = !this.noDataFlag;
        this.headerFlag = true;

        if(!this.noDataFlag) {
          google.charts.setOnLoadCallback(this.drawChart(serviceProbingData));
        } else {
          if(this.offset == 30) {
            document.getElementById('barChart').innerHTML = "";
          }
        }
      }
    });
  }

  drawChart(serviceProbingData) {
    let width = this.innerWidth-100;
    let initFlag = (this.serviceProbingData == null) ? true : false;
    let chartData = serviceProbingData;
    if(!this.resize) {
      for (let data of chartData) {
        //let title = (data.Usertype == 2) ? data.dealerName+'\n'+data.dealerCode : data.userName;
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
          tooltipValue = data.userName+' - '+data.userId+zoneSpace+zone+areaSpace+area+ttySpace+tty+'\n Count: '+value;
        }
        console.log(title);
        this.usageData.push([title,value,color,value,tooltipValue]);
      }
    }

    let gcData = new google.visualization.DataTable();

    if(initFlag) {
      gcData.addColumn('string', 'Dealer Name');
      gcData.addColumn('number', 'Count');

      gcData.addColumn({type: 'string',  role: "style"});
      gcData.addColumn({type: 'number',  role: "annotation"});
      gcData.addColumn({type: 'string', role: 'tooltip','p': {'html': true}});
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

    this.serviceProbingOptions = {
      animation: {duration: 800, startup: true},
      annotations: {
        alwaysOutside: false,
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
    chart.draw(gcData, this.serviceProbingOptions);

    this.setScreenHeightnew();
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (this.resetFlag) ? -20 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+230));
  //  this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight+140));
  this.filterHeight = window.innerHeight - 75;
    this.filterOptions['filterHeight'] = this.filterHeight;
    this.resetFlag = false;
    localStorage.removeItem('navPage');
    //console.log(this.bodyHeight+'::'+headerHeight+'::'+footerHeight+'::'+this.filterHeight);
  }

  setScreenHeightnew() {
    let headerHeight = (this.resetFlag) ? -20 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    this.innerHeightnew = (window.innerHeight-(headerHeight+footerHeight+40));
    this.filterHeight = window.innerHeight - 75;
    this.filterOptions['filterHeight'] = this.filterHeight;
    this.resetFlag = false;
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
    this.serviceProbingLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.usageData = [];
    this.headerData['searchKey'] = this.searchVal;
    this.headerFlag = true;
    document.getElementById('barChart').innerHTML = "";
    this.getserviceProbingData(this.apiData);
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
    this.serviceProbingLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.usageData = [];
    let resetFlag = filterData.reset;
    document.getElementById('barChart').innerHTML = "";
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.headerFlag = false;
      let utype = filterData.userType.toString();
      for (let u of this.userTypesArr) {
        if(utype == u.id) {
          this.headerData['searchPlaceHolder'] = 'Search '+u.name;
          let serviceTitle = this.headTitle+' '+u.name;
          this.headerData['title'] = serviceTitle;
          this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' +serviceTitle);
          //this.headerFlag = true;
        }
      }
      this.getserviceProbingData(this.apiData);
    } else {
      localStorage.removeItem('serviceFilter');
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
    this.filterLoading = true;
    this.expandFlag = toggleFlag;
    this.resize = true;
    this.resetFlag = this.resize;
    setTimeout(() => {
      google.charts.setOnLoadCallback(this.drawChart(this.usageData));
    }, 300);
  }

  ngOnDestroy() {
    let serviceFilter = JSON.parse(localStorage.getItem('serviceFilter'));
    serviceFilter.searchKey = "";
    localStorage.setItem('serviceFilter', JSON.stringify(serviceFilter));
  }

}
