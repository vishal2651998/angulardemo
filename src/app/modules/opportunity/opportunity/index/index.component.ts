import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { pageInfo, Constant, PlatFormType, IsOpenNewTab, ManageTitle } from "src/app/common/constant/constant";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ApiService } from '../../../../services/api/api.service';

interface sortOption {
  name: string;
  code: string;
}
interface orderOption {
  name: string;
  code: string;
}
interface feedbackOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild('ttthreads') tooltip: NgbTooltip;
  public threadSortOptions: sortOption[];
  public threadOrderOptions: orderOption[];
  public threadFeedbackSortOptions: feedbackOption[];

  public bodyClass: string = "landing-page";
  public title = "Opportunity";
  public headTitle: string = "";
  public newOptTxt: string = ManageTitle.actionNew;
  public newActionOptTxt: string = "";
  public enableNewThread = "";
  public selectedCity1 = "";
  public selectedCity3 = "";

  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public bodyElem;
  public footerElem;

  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccessMobile: boolean = false;
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public collabticDomain: boolean = false;
  public CBADomain: boolean = false;
  public apiData: Object;
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public expandFlag: boolean = true;
  public rightPanel: boolean = true;
  public pageData = pageInfo.threadsPage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public pinFlag: boolean = false;
  public pinClass: string = "normal";
  public searchVal = '';
  public yourpined = false;
  public selectedCity2: object;
  public filterInitFlag: boolean = false;
  public refreshThreads: boolean = false;
  public loading: boolean = true;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public filterActions: object;
  public filterActiveCount: number = 0;
  public pageAccess: string = "opportunity";
  public newThreadUrl: string = "opportunity/manage";
  public groupId: number = 2;
  public threadTypesort = "sortthread";
  public threadOrderType = "desc";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public itemEmpty: boolean = false;
  public displayNoRecords: boolean = false;
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

  public itemLimit: number = 20;
  public itemOffset: number = 0;

  public accessLevel : any = {create: 1, delete: 1, edit: 1, reply: 1, view: 1};
  public headerData: Object;
  public sidebarActiveClass: Object;
  public thumbView: boolean = true;
  public threadFilterOptions;

  constructor(
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    public apiUrl: ApiService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(action = ''): void {
    if (this.teamSystem) {
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }
      else{
        this.msTeamAccessMobile = false;
      }
    } else {
      this.msTeamAccess = false;
      this.msTeamAccessMobile = false;
    }

    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      this.enableNewThread = "activenew";
    } else {
      this.enableNewThread = "";
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;

    let industryType = this.commonService.getIndustryType();
    this.headTitle = "";
    this.headTitle = (industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : ManageTitle.thread;
    let platformId1 = localStorage.getItem("platformId");
    this.headTitle = (platformId1=='3') ? ManageTitle.supportRequest : this.headTitle;

    if( this.domainId==71 && platformId1=='1')
      {
        this.headTitle=ManageTitle.supportServices;
      }
      if(this.domainId==Constant.CollabticBoydDomainValue && platformId1=='1')
    {
      this.headTitle=ManageTitle.techHelp;
    }
    this.newActionOptTxt = this.newOptTxt+" "+this.headTitle;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}s`
    );

    if (platformId1 == PlatFormType.Collabtic) {
      this.collabticDomain = true;
    }
    if (platformId1 == PlatFormType.CbaForum) {
      this.CBADomain = true;
    }
   // help content
    this.commonService.welcomeContentReceivedSubject.subscribe((response) => {
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if(welcomePopupDisplay == '1'){
        if(this.msTeamAccess){
          setTimeout(() => {
            this.helpContent(0);
          }, 900);
        }
      }
    });

    this.threadSortOptions = [
      { name: `Sort by latest ${this.headTitle}s`, code: "sortthread" },
      { name: "Sort by latest Reply", code: "sortbyreply" },
      { name: `Your Team ${this.headTitle}s`, code: "teamthread" },
      { name: `Your ${this.headTitle}s`, code: "ownthread" },
      { name: "Most Popular", code: "popularthread" },
      { name: "Your Fixes", code: "fixes" },
      { name: "Your Pins", code: "yourpin" },
    ];

    this.threadFeedbackSortOptions = [
      { name: "All feedback", code: "all" },
      { name: "Resolved and Support Helpful", code: "1" },
      { name: "Resolved Ourself; Support Received Late", code: "2" },
      { name: "Not Resolved", code: "3" },
      { name: "Not Sure", code: "4" },

    ];
    this.threadOrderOptions = [
      { name: "Ascending", code: "asc" },
      { name: "Descending", code: "desc" },
    ];

    let yourThreadsValue=localStorage.getItem('yourThreadsValue');
    if(yourThreadsValue) {

      let threadSortFilter='{"name":"Your '+this.headTitle+'s","code":"ownthread"}';
      //alert(threadSortFilter);
      this.selectedCity1=JSON.parse(threadSortFilter);
    }

    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      if(action == 'reset'){
        let listView = localStorage.getItem("optViewType");
        this.thumbView = listView == "undefined" || listView == undefined || listView == "thumb" ? true : false;
      }
      else{
        this.thumbView = true;
      }
      let threadViewType:any = this.thumbView ? "thumb" : "list";
        this.pageRefresh["threadViewType"] = threadViewType;
        console.log(this.thumbView);

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
      this.filterOptions['orderBy']=this.threadOrderType;
      this.filterOptions['type']=this.threadTypesort;

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
        // Get Filter Widgets
        this.commonService.getFilterWidgets(this.apiData, this.filterOptions);

        this.filterInterval = setInterval(() => {
          let filterWidget = localStorage.getItem("filterWidget");
          let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));

          if (filterWidget) {
            console.log(this.filterOptions, filterWidgetData);
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            //this.apiData['filterOptions']['workstream'] = ["1", "2"];
            this.threadFilterOptions = this.apiData["filterOptions"];
            this.apiData["onload"] = true;
            this.threadFilterOptions = this.apiData["onload"];
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
            this.apiData["filterOptions"] = this.apiData["filterOptions"];
            this.apiData["filterOptions"]["action"] = action;
            this.apiData["filterOptions"]['orderBy']=this.threadOrderType;
            this.apiData["filterOptions"]['type']=this.threadTypesort;
            console.log(this.apiData);
            this.commonService.emitMessageLayoutrefresh(
              this.apiData["filterOptions"]
            );
            //  console.log(this.apiData+'---');
            // console.log(this.filterOptions);
            this.filterLoading = false;
            this.filterOptions["filterLoading"] = this.filterLoading;
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");

            // Get Media List
            this.loading = false;
          }
        }, 50);
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  applySearch(action, val) {}

  // helpContent list and view
  helpContent(id){
    /* id = (id>0) ? id : '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('tooltipId', id);

    this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        if(id == ''){
        let contentData = response.tooltips;
        for (let cd in contentData) {
          let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
          if(welcomePopupDisplay == '1'){
            if(contentData[cd].id == '7' && contentData[cd].viewStatus == '0' ){
              console.log(contentData[cd].title);
              this.thelpContentStatus = contentData[cd].viewStatus;
              this.thelpContentFlagStatus = true;
              this.thelpContentId = contentData[cd].id;
              this.thelpContentTitle = contentData[cd].title;
              this.thelpContentContent = contentData[cd].content;
              this.thelpContentIconName = contentData[cd].itemClass;
            }
          }
        }
        if(this.thelpContentFlagStatus){
            this.tooltip.open();
        }
        }
        else{
        console.log(response.result);
        this.tooltip.close();
        }
      }
    }); */
  }
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }

  applyFilter(filterData,loadpush='') {

  }

   // if any one filter is ON
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
    console.log("**********************");
    console.log(this.filterrecords);
    console.log("**********************");
    return this.filterrecords;
  }

  selectEventSort(event)
  {
    localStorage.removeItem('yourThreadsValue');
    localStorage.removeItem('yourStoreThreadsValue');
    this.threadTypesort=event.value.code;
    //localStorage.setItem('threadSortFilter',JSON.stringify(event.value));
    this.pageRefresh['orderBy']=this.threadOrderType;
    this.pageRefresh['type']=event.value.code;
    this.yourpined = false;
    this.pageRefresh['sortOrderBy']=true;
    this.pageRefresh["action"] = '';
    let viewType = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = viewType;
    this.pageRefresh["filterrecords"] = this.filterCheck();
    this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
  }
  selectEventFilterOrder(event)
  {
    //this.threadTypesort=event.value.code;
    //localStorage.setItem('threadSortFilter',JSON.stringify(event.value));
    this.pageRefresh['orderBy']=this.threadOrderType;
    this.pageRefresh['type']=this.threadTypesort;
    this.pageRefresh['feedbackStatus']=event.value.code;
    this.pageRefresh['sortOrderBy']=false;
    this.pageRefresh["action"] = '';
    let viewType = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = viewType;
    this.pageRefresh["filterrecords"] = this.filterCheck();
    this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
  }
  selectEventOrder(event)
  {
    this.threadOrderType=event.value.code;
   // localStorage.setItem('threadOrderFilter',JSON.stringify(event.value));
    this.pageRefresh['type']=this.threadTypesort;
    this.pageRefresh['orderBy']=event.value.code;
    this.pageRefresh['sortOrderBy']=true;
    let viewType = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = viewType;
    this.pageRefresh["filterrecords"] = this.filterCheck();
    this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
  }

  // Change the view
  viewType(actionFlag) {

  }
}
