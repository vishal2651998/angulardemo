import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ThreadService } from "src/app/services/thread/thread.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit, OnDestroy {
  public title: string = "Marketplace";
  public headTitle: string = "";
  public filterInitFlag: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public expandFlag: boolean = false;
  public disableRightPanel: boolean = true;
  public filterActiveCount: number = 0;
  public sideMenuActive = 'market-place';
  pageAccess: string = "market-place";
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public pageData = pageInfo.marketPlacePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "market-place/manage";
  public groupId: number = 38;
  public threadTypesort = "sortthread";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;

  public thumbView: boolean = true;
  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public searchVal;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public access: string;
  public msTeamAccessMobile: boolean = false;
  defaultExpand: any = false;
  loading: any = false;
  marketPlaceTotalData: any;
  manualsTotalData: any;
  businessDomainData: any;
  repairfyDomainData: any;

  constructor(
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    private router: Router,
    private commonService: CommonService,
    private filterApi: FilterService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private threadApi: ThreadService,
    private ref: ChangeDetectorRef,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    this.trainingData();
    this.manualsData();
    this.getReparifyDomainData();
  }

  ngOnInit(action = ''): void {
    console.log('lets check');
    this.msTeamAccess = false;
    this.msTeamAccessMobile = false;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.headTitle = "Marketplace";
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}s`
    );
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.thumbView = true;
    let threadViewType:any = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = threadViewType;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      searchKey: this.searchVal,
      historyFlag: this.historyFlag,
      pushAction: false
    };
    this.apiData = apiInfo;
    this.filterOptions["apiKey"] = Constant.ApiKey;
    this.filterOptions["userId"] = this.userId;
    this.filterOptions["domainId"] = this.domainId;
    this.filterOptions["countryId"] = this.countryId;
    let viewType = this.thumbView ? "thumb" : "list";
    this.filterOptions["threadViewType"] = viewType;
    let year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    setTimeout(() => {
      this.apiData["groupId"] = this.groupId;
      this.apiData["mediaId"] = 0;
      this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
      this.filterInterval = setInterval(() => {
        let filterWidget = localStorage.getItem("filterWidget");
        let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
        if (filterWidget) {
          this.filterOptions = filterWidgetData.filterOptions;
          this.apiData = filterWidgetData.apiData;
          this.threadFilterOptions = this.apiData["filterOptions"];
          this.apiData["onload"] = true;
          this.threadFilterOptions = this.apiData["onload"];
          //this.filterActiveCount = filterWidgetData.filterActiveCount;
          // Temp Fix: Remove this block and enable the above -- Muthu
          this.filterActiveCount = 0;
          // Temp Fix
          this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
          this.apiData["filterOptions"] = this.apiData["filterOptions"];
          this.apiData["filterOptions"]["action"] = action;
          this.commonService.emitMessageLayoutrefresh(
            this.apiData["filterOptions"]
          );
          this.filterLoading = false;
          this.filterOptions["filterLoading"] = this.filterLoading;
          clearInterval(this.filterInterval);
          localStorage.removeItem("filterWidget");
          localStorage.removeItem("filterData");
        }
      }, 50);
    }, 1500);
    setTimeout(() => {
      let chkData = localStorage.getItem('threadPushItem');
      let data = JSON.parse(chkData);
      if(data) {
        data.action = 'silentCheck';
      }
    }, 15000);
  }

  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }

  quizPage() {
    this.router.navigateByUrl('market-place/quiz-topics');
  }

  customerPage() {
    this.router.navigateByUrl('market-place/customers');
  }

  trainingData() {
    this.loading = true;
    let domainId: any = localStorage.getItem('domainId');
    let payload = {
      limit: 1,
      offset: 0,
      domainId: localStorage.getItem('domainId')
    }
    this.threadApi.apiGetMarketPlaceData(payload).subscribe((response: any) => {
      this.marketPlaceTotalData = response.data.totalRecords;
      this.businessDomainData = response.data.businessDomainData;
      this.loading = false;
    }, (error: any) => {
      this.loading = false
    })
    this.threadApi.apiGetManualsData(payload).subscribe((response: any) => {
      this.manualsTotalData = response.data.totalRecords;
    }, (error: any) => {
      this.loading = false
    })
  }

  manualsData() {
    this.loading = true;
    let domainId: any = localStorage.getItem('domainId');
    let payload = {
      limit: 1,
      offset: 0,
      domainId: localStorage.getItem('domainId')
    }
    this.threadApi.apiGetManualsData(payload).subscribe((response: any) => {
      this.manualsTotalData = response.data.totalRecords;
      this.loading = false;
    }, (error: any) => {
      this.loading = false
    })
  }

  getReparifyDomainData() {
    this.loading = true;
    let payload = {
      domainId: 71
    }
    this.threadApi.apiRepairfyDomainData(payload).subscribe((response: any) => {
      this.repairfyDomainData = response.data;
      this.loading = false;
    }, (error: any) => {
      this.loading = false
    })
  }

  expandDomainAction(event: any) {
    console.log(event);
  }

  domainEditPage() {
    this.router.navigateByUrl('market-place/domain');
  }

  reparifyBannerEditPage() {
    this.router.navigateByUrl('market-place/domain/repairfy');
  }

  applyFilter(filterData,loadpush='') {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      if(loadpush) {
        filterData["loadAction"] = 'push';
        this.apiData['pushAction'] = true;
        let filterOptionData = this.filterOptions['filterData'];
        if(filterData.startDate != undefined || filterData.startDate != 'undefined') {
          let sindex = filterOptionData.findIndex(option => option.selectedKey == 'startDate');
          if(sindex >= 0) {
            filterOptionData[sindex].value = filterData.startDate;
          }
          let eindex = filterOptionData.findIndex(option => option.selectedKey == 'endDate');
          if(eindex >= 0) {
            filterOptionData[eindex].value = filterData.endDate;
          }
        }
      }
      this.apiData["filterOptions"] = filterData;
      setTimeout(() => {
        filterData["loadAction"] = '';
      }, 500);
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
      let viewType = this.thumbView ? "thumb" : "list";
      filterData["threadViewType"] = viewType;
      filterData["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(filterData);
      setTimeout(() => {
        this.filterLoading = false;
      }, 1000);
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem("threadFilter");
    this.ngOnInit('reset');
    //this.commonService.emitMessageLayoutrefresh('');
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
    this.applyFilter(getFilteredValues,event);
  }

  filterCheck(){
    this.filterrecords = false;
    if(this.pageRefresh['orderBy'] != 'desc'){
      this.filterrecords = true;
    }
    if(this.pageRefresh['type'] != 'sortthread'){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  navPart() {
    let url = this.newThreadUrl;
    window.open(url, IsOpenNewTab.teamOpenNewTab);
  }

  innerDetailPage() {
    this.router.navigateByUrl('market-place/training');
  }

  manualsPage() {
    this.router.navigateByUrl('market-place/manuals');
  }

  zoomSettingPage() {
    this.router.navigateByUrl('market-place/settings')
  }

  policiesPage() {
    this.router.navigateByUrl('market-place/policies')
  }

  reportsPage() {
     this.router.navigateByUrl('market-place/reports')
  }

  ngOnDestroy(): void {
    localStorage.removeItem("threadViewType");
  }
}
