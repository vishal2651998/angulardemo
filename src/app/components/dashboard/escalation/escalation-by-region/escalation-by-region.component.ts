import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'app-escalation-by-region',
  templateUrl: './escalation-by-region.component.html',
  styleUrls: ['./escalation-by-region.component.scss']
})
export class EscalationByRegionComponent implements OnInit {

  public title: string = "Escalation Region";
  public headTitle: string = "Escalation Levels by Region";
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 6;
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
  public zoneData = [];
  public escZoneData: any = null;
  public escZoneOptions: Object;
  public zoneLoading: boolean = true;

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
  public pageAccess = 'escZone';
  public resetFlag: boolean = false;

  public filterOptions: Object = {
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'zoneList': [],
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
        this.getEscZoneData(this.apiData);
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
    google.charts.setOnLoadCallback(this.drawChart(this.zoneData));
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
        if(g.hasOwnProperty('escZones')){
          this.groupId = g.escZones;
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
        this.filterLoading = false;
        let responseData = response.data;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.filterOptions['filterData'] = responseData;

        let accessFrom = localStorage.getItem('accessFrom');
        let dashFilter = JSON.parse(localStorage.getItem('dashFilter'));
        let year = dashFilter.year;
        let month = dashFilter.month;

        let escZoneApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('escZoneFilter'));
        let defaultWsVal = '', wsVal, zoneVal = '', areaVal = '', ttyVal = '';
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
              escZoneApiData['filterOptions'] = {'workstream': wsItems};
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
              escZoneApiData['filterOptions']['startDate'] = sDate;
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
              escZoneApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              localStorage.removeItem('accessFrom');
              break;
            case 7:
              let zone = '';
              if(getFilteredValues != null) {
                zone = (getFilteredValues.zone == undefined || getFilteredValues.zone == 'undefined') ? zone : getFilteredValues.zone;
              }
              zoneVal = zone;
              escZoneApiData['filterOptions']['zone'] = zone;
              this.filterOptions['filterData'][res]['zone'] = zone;

              let area = '';
              if(getFilteredValues != null) {
                area = (getFilteredValues.area == undefined || getFilteredValues.area == 'undefined') ? area : getFilteredValues.area;
              }
              areaVal = area;
              escZoneApiData['filterOptions']['area'] = area;
              this.filterOptions['filterData'][res]['area'] = area;

              let territory = '';
              if(getFilteredValues != null) {
                territory = (getFilteredValues.territory == undefined || getFilteredValues.territory == 'undefined') ? territory : getFilteredValues.territory;
              }
              ttyVal = territory;
              escZoneApiData['filterOptions']['territory'] = territory;
              this.filterOptions['filterData'][res]['territory'] = territory;

              /*let town = '';
              if(getFilteredValues != null) {
                town = (getFilteredValues.town == undefined || getFilteredValues.town == 'undefined') ? town : getFilteredValues.town;
              }
              escZoneApiData['filterOptions']['town'] = town;
              this.filterOptions['filterData'][res]['town'] = town;*/
              break;
          }
        }

        //console.log(defaultWsVal+' == '+wsVal+'\n'+escZoneApiData['filterOptions']['startDate']+' == '+startDateVal+'\n'+escZoneApiData['filterOptions']['endDate']+' == '+endDateVal+'\n'+escZoneApiData['filterOptions']['zone']+' == '+zoneVal+'\n'+escZoneApiData['filterOptions']['area']+' == '+areaVal+'\n'+escZoneApiData['filterOptions']['territory']+' == '+ttyVal);
        if(defaultWsVal == wsVal && escZoneApiData['filterOptions']['startDate'] == startDateVal && escZoneApiData['filterOptions']['endDate'] == endDateVal &&  escZoneApiData['filterOptions']['zone'] == zoneVal  && escZoneApiData['filterOptions']['area'] == areaVal && escZoneApiData['filterOptions']['territory'] == ttyVal) {
          this.filterOptions['filterActive'] = false;
        }

        // Get Escalation Zone Data
        this.getEscZoneData(escZoneApiData);
      }
    });
  }

  // Get Escalation Zone Data
  getEscZoneData(apiData) {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['limit'] = this.limit;
    this.apiData['offset'] = this.offset;
    this.apiData['storage'] = 'escZoneFilter';
    this.apiData['filterOptions']['groupId'] = this.groupId;

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let escZoneData = responseData.chartdetails;
        this.zoneData = escZoneData;
        this.zoneLoading = false;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.filterOptions['zoneList'] = escZoneData;
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.total = responseData.total;
        this.length += escZoneData.length;
        this.offset += this.limit;

        if(escZoneData.length == 0) {
          this.noDataFlag = (this.offset == 30) ? true : false;
          escZoneData = [];
        } else {
          this.noDataFlag = false;
        }

        if(!this.noDataFlag) {
          google.charts.setOnLoadCallback(this.drawChart(escZoneData));
        } else {
          if(this.offset == 30) {
            document.getElementById('barChart').innerHTML = "";
          }
        }
      }
    });
  }

  drawChart(escZoneData) {
    let initFlag = (this.escZoneData == null) ? true : false;
    let chartData = escZoneData;

    let gcData = new google.visualization.DataTable();
    let chart = new google.visualization.BarChart(document.getElementById('barChart'));

    if(this.noDataFlag) {
      document.getElementById('barChart').innerHTML = "";
    } else {
      if(initFlag) {
        let columnLen = chartData[0].escalation.length+1;
        for (let c=0; c<columnLen; c++) {
          if(c < 1) {
            gcData.addColumn('string', 'Escalation Level');
          } else {
            gcData.addColumn('number', 'Count');
            gcData.addColumn({type: 'string', role: 'tooltip'});
          }
        }
      }

      let width = this.innerWidth-140;

      this.escZoneOptions = {
        animation: {duration: 800, startup: true},
        annotations: {
          alwaysOutside: false,
          textStyle: {
            color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular'
          }
        },
        bar: {groupWidth: "85%"},
        backgroundColor: 'transparent',
        colors: [],
        chartArea:{left: 60, width: '80%', height: '90%'},
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
          textStyle: {color: '#ADB6C4', fontSize: 12, fontName: 'Roboto-Regular'}
        },
        tooltip: {
          textStyle: { color: '#FFFFFF', fontSize: 12, fontName: 'Roboto-Regular'}
        },
        width: width,
        height: this.innerHeight-25
      };

      //if(!this.resize) {
        for (let data of chartData) {
          let colData = [];
          let strLen = 16;
          let zoneName = data.name;
          let name = (zoneName.length > strLen) ? zoneName.substring(0, strLen)+'...' : zoneName;
          colData.push(name);
          for (let esc of data.escalation) {
            this.escZoneOptions['colors'].push(esc.colorCode);
            colData.push(esc.count);
            //colData.push(esc.escLevel);
            colData.push(name+'\n'+esc.escLevel+': '+esc.count);
          }
          gcData.addRow(colData);
        }
      //}

      chart.draw(gcData, this.escZoneOptions);
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (this.resetFlag) ? 10 : document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    //this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+248));
    //this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight+140));
    //this.filterOptions['filterHeight'] = this.filterHeight+90;
    this.innerHeight = this.bodyHeight - 175;
    this.filterOptions['filterHeight'] = this.bodyHeight - 75;
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
    this.zoneLoading = true;
    this.resize = false;
    this.resetFlag = this.resize;
    this.zoneData = [];
    let resetFlag = filterData.reset;
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.getEscZoneData(this.apiData);
    } else {
      localStorage.removeItem('escZoneFilter');
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
      google.charts.setOnLoadCallback(this.drawChart(this.zoneData));
    },300);
  }

}
