import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../../.../../../services/dashboard/dashboard.service';
import { ScrollTopService } from '../../../../services/scroll-top.service';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'app-active-escalations',
  templateUrl: './active-escalations.component.html',
  styleUrls: ['./active-escalations.component.scss']
})
export class ActiveEscalationsComponent implements OnInit {

  public title: string = "Active Escalations";
  public headTitle: string = "Active Escalations";
  public countryId;
  public domainId;
  public userId;
  public groupId: number = 4;
  public apiData: Object;
  public filterStartDate:any = moment().startOf('month');
  public filterEndDate = moment().format('YYYY-MM-DD');

  public bodyHeight: number;
  public innerWidth: number;
  public innerHeight: number;
  public filterHeight: number;

  public headerData: Object;
  public escData = [];
  public escalationData: any = null;
  public escOptions: Object;
  public escLoading: boolean = true;

  public resize: boolean = false;
  public expandFlag: boolean = true;
  public filterLoading: boolean = true;
  public noDataFlag: boolean = false;
  public pageAccess = 'escModel';

  public filterOptions: Object = {
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'dealerList': [],
    'apiKey': '',
    'domainId': '',
    'countryId': '',
    'userId': ''
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = screen.height;
    let headerHeight = document.getElementsByClassName('dash-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+275));
    this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight+120));
    this.resize = true;
    //google.charts.setOnLoadCallback(this.drawChart(this.modelData));
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
        if(g.hasOwnProperty('escalations')){
          this.groupId = g.escalations;
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
        'exportFlag': true,
        'apiInfo': apiInfo,
        'startDate': moment(this.filterStartDate).format('YYYY-MM-DD').toString()
      };

      this.bodyHeight = screen.height;
      let headerHeight = document.getElementsByClassName('dash-head')[0].clientHeight;
      let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
      this.innerWidth = document.getElementsByClassName('dash-chart-col')[0].clientWidth;
      this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+275));
      this.filterHeight = (this.bodyHeight-(headerHeight+footerHeight+120));

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

        let escalationsApiData = this.apiData;
        let getFilteredValues = JSON.parse(localStorage.getItem('escalationsFilter'));

        for (let res in responseData) {
          let item = responseData[res];
          let wid = parseInt(item.id);

          switch(wid) {
            case 1:
              let wsItems;
              if(getFilteredValues != null) {
                wsItems = (getFilteredValues.workstream == undefined || getFilteredValues.workstream == 'undefined') ? [item.valueArray[0].workstreamId] : getFilteredValues.workstream;
              } else {
                wsItems = [item.valueArray[0].workstreamId];
              }
              escalationsApiData['filterOptions'] = {'workstream': wsItems};
              break;
            case 6:
              let startDate = moment(this.filterStartDate).format('YYYY-MM-DD').toString();
              let sDate;
              if(getFilteredValues != null) {
                sDate = (getFilteredValues.startDate == undefined || getFilteredValues.startDate == 'undefined') ? startDate : getFilteredValues.startDate;
              } else {
                sDate = startDate;
              }
              escalationsApiData['filterOptions']['startDate'] = sDate;
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
              escalationsApiData['filterOptions']['endDate'] = eDate;
              this.filterOptions['filterData'][res]['value'] = eDate;
              break;
          }
        }

        // Get Escalation Data
        this.getEscalationData(escalationsApiData);
      }
    });
  }

  // Get Escalation Data
  getEscalationData(apiData) {
    this.apiData['storage'] = 'escalationsFilter';
    this.apiData['filterOptions']['groupId'] = this.groupId;

    this.dashboardApi.apiChartDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let responseData = response.data;
        let escalationData = responseData.chartdetails;
        this.escData = escalationData;
        this.escLoading = false;
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
        this.filterOptions['modelList'] = escalationData;

        if(escalationData.length == 0) {
          this.noDataFlag = true;
          escalationData = [];
        } else {
          this.noDataFlag = false;
        }

        if(!this.noDataFlag) {
          google.charts.setOnLoadCallback(this.drawChart(escalationData));
        } else {
          document.getElementById('barChart').innerHTML = "";
        }
      }
    });
  }

  drawChart(escalationData) {

  }

  // Apply Filter
  applyFilter(filterData) {
    this.escLoading = true;
    this.resize = false;
    this.escData = [];
    let resetFlag = filterData.reset;
    if(!resetFlag) {
      this.apiData['filterOptions'] = filterData;
      this.getEscalationData(this.apiData);
    } else {
      localStorage.removeItem('escModelFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.ngOnInit();
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.resize = true;
    google.charts.setOnLoadCallback(this.drawChart(this.escData));
  }

}
