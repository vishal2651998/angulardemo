import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { pageInfo, Constant, filterNames, PlatFormType, IsOpenNewTab, ManageTitle,statusOptions, SolrContentTypeValues } from "src/app/common/constant/constant";
import { FilterService } from "../../../../services/filter/filter.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { FilterComponent } from "src/app/components/common/filter/filter.component";
import { ThreadsPageComponent } from "src/app/components/common/threads-page/threads-page.component";
import { ThreadApprovalComponent } from "src/app/components/common/thread-approval/thread-approval.component";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { environment } from '../../../../../environments/environment';
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Subscription } from "rxjs";
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
interface statusOption {
  name: string;
  code: string;
}
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit , OnDestroy{
  @ViewChild('ttthreads') tooltip: NgbTooltip;
  filterRef: FilterComponent;
  threadApprovalRef: ThreadApprovalComponent;
  threadRef: ThreadsPageComponent;
  threadSortOptions: sortOption[];
  threadOrderOptions: orderOption[];
  threadStatusOptions: statusOption[];
  public selectedStatus: object;
  subscription: Subscription = new Subscription();
  public accessLevel : any = {view: true, create: true, edit: true, delete:true, reply: true, close: true};
  public threadFeedbackSortOptions: feedbackOption[];
  public title = "Threads";
  public headTitle: string = "";
  public newThreadTxt: string = ManageTitle.actionNew;
  public newActionThreadTxt: string = "";
  public selectedCity1 = "";
  public selectedCity3 = "";
  public enableNewThread = "";
  public yourpined = false;
  public selectedCity2: object;
  public filterInitFlag: boolean = false;
  public refreshThreads: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public filterActions: object;
  public expandFlag: boolean = false;
  public disableRightPanel: boolean = true;
  public filterActiveCount: number = 0;
  public threadThumbInit: number = 0;
  pageAccess: string = "threads";
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public pageData = pageInfo.threadsPage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public workstreamFilterArr: any = [];
  public newThreadUrl: string = "threads/manage";
  public groupId: number = 2;
  public threadTypesort = "sortthread";
  public threadOrderType = "desc";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public threadApprovalFlag: boolean = false;
  public approvalEnableDomainFlag: boolean = false;
  public approveProcessFlag: boolean = false;
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
    filterrecords: false,
    threadThumbInit: this.threadThumbInit
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
  public menuListloaded;
  public getcontentTypesArr = [];
  public roleId;
  public apiData: Object;
  public searchVal;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public teamSystem = localStorage.getItem("teamSystem");
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;
  public enableDesktopPush: boolean = false;
  public access: string;
  public activePageAccess = "0";
  public msTeamAccessMobile: boolean = false;
  public collabticDomain: boolean = false;
  public collabticFixes: boolean = false;
  public mahleDomain: boolean = false;
  public CBADomain: boolean = false;
  public solrApi: boolean = false;
  public tvsDomain:boolean=false;
  public mssDomain:boolean=false;
  constructor(
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    private router: Router,
    private commonService: CommonService,
    private filterApi: FilterService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    public apiUrl: ApiService
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(action = ''): void {

    let currUrl = this.router.url.split('/');
    if(currUrl[2]=='shareFix')
    {
      localStorage.setItem('threads-router', 'true');
      this.navApproval('init');

    }
    //alert('Filter--'+action);
    if(action == 'reset') {
      localStorage.setItem('filterReset','1');
    }
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
      if( this.domainId==Constant.CollabticBoydDomainValue && platformId1=='1')
      {
        this.headTitle=ManageTitle.techHelp;
      }
      
    this.approvalEnableDomainFlag = localStorage.getItem('shareFixApproval') == '1' ? true : false;
    this.approveProcessFlag = (this.roleId == 3) ? false : true;
    this.newThreadTxt = `${this.newThreadTxt} ${this.headTitle}`;
    this.newActionThreadTxt = this.newThreadTxt+" "+this.headTitle;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}s`
    );
    let userWorkstreams=localStorage.getItem('userWorkstreams');
    if(userWorkstreams) {
      this.workstreamFilterArr=JSON.parse(userWorkstreams);
    }
    if (platformId1 == PlatFormType.Collabtic) {
      this.collabticDomain = true;
      this.collabticFixes = (this.domainId == 336) ? true : false;
    }
    if (platformId1 == PlatFormType.CbaForum) {
      this.CBADomain = true;
    }
    if (platformId1 == PlatFormType.MahleForum) {
      this.mahleDomain = true;
    }
this.tvsDomain=(this.domainId == '52') ? true : false;
this.mssDomain=(this.domainId == '82') ? true : false;

    this.solrApi = (this.collabticDomain || this.CBADomain || this.tvsDomain || this.mssDomain) ? true : false;


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

    this.subscription.add(
      this.commonService._OnMessageReceivedSubject.subscribe((r) => {
        console.log('---- Push Data', r, '----------')
        let setdata = JSON.parse(JSON.stringify(r));
        let pushType = parseInt(setdata.pushType);
        let threadId = (pushType == 47 || pushType == 48) ? setdata.messageId : setdata.threadId;
        if(this.threadApprovalFlag) {
          console.log('in push')
          switch (pushType) {
            case 45:
            case 46:
            case 48:
              let pushFlag = true;
              let pushData = {
                action: (pushType == 46 || pushType == 48) ? 'push' : 'update',
                limit: 1,
                threadId
              };
              setTimeout(() => {
                this.threadApprovalRef.getApprovedSharedFixThreads(pushFlag, pushData);
              }, 10000);
              break;
            case 47:
              let findex = this.threadApprovalRef.items.findIndex(option => option.threadId == threadId);
              if(findex >= 0) {
                this.threadApprovalRef.items.splice(findex, 1);
                if(this.threadApprovalRef.items.length == 0){
                  this.threadApprovalRef.displayNoRecords = true;
                }
              }
              break;
          }
        }
      })
    );

    /* this.threadSortOptions = [
      { name: `Sort by latest ${this.headTitle}s`, code: "sortthread" },
      { name: "Sort by latest Reply", code: "sortbyreply" },
      { name: `Your Team ${this.headTitle}s`, code: "teamthread" },
      { name: `Your ${this.headTitle}s`, code: "ownthread" },
      { name: "Most Popular", code: "popularthread" },
      { name: "Your Fixes", code: "fixes" },
      { name: "Your Pins", code: "yourpin" },
    ]; */
if(this.CBADomain)
{
  this.threadSortOptions = [
    { name: `Sort by latest ${this.headTitle}s`, code: "sortthread" },
    { name: `My ${this.headTitle}s`, code: "ownthread" },
    { name: "My Pins", code: "yourpin" },
    { name: `My Store ${this.headTitle}s`, code: "mystore" },
  ];
}
else
{
  this.threadSortOptions = [
    { name: `Sort by latest ${this.headTitle}s`, code: "sortthread" },
    { name: `My ${this.headTitle}s`, code: "ownthread" },
    { name: "My Pins", code: "yourpin" },
  ];
}




    this.threadFeedbackSortOptions = [
      { name: "All feedback", code: "all" },
      { name: "Resolved and Support Helpful", code: "1" },
      { name: "Resolved Ourself; Support Received Late", code: "2" },
      { name: "Not Resolved", code: "3" },
      { name: "Not Sure", code: "4" },

    ];
    this.threadOrderOptions = [
      { name: "Descending", code: "desc" },
      { name: "Ascending", code: "asc" },
    ];

    let sfStatus:any = [];
    statusOptions.forEach((item) => {
      let code = (item.code != '') ? item.code : item.code;
      console.log(code)
      if(code == '' || parseInt(code) < 6) {
        sfStatus.push({
          name: item.name,
          code: code
        });
      }
    });
    this.threadStatusOptions = sfStatus;

    let yourThreadsValue=localStorage.getItem('yourThreadsValue');
    if(yourThreadsValue)
    {

      let threadSortFilter='{"name":"My '+this.headTitle+'s","code":"ownthread"}';
      this.selectedCity1=JSON.parse(threadSortFilter);
      this.threadTypesort='ownthread';
    }

    let yourStoreThreadsValue=localStorage.getItem('yourStoreThreadsValue');
    if(yourStoreThreadsValue)
    {

      let threadSortFilter='{"name":"My Store '+this.headTitle+'s","code":"mystore"}';
      this.selectedCity1=JSON.parse(threadSortFilter);
      this.threadTypesort='mystore';
    }

    /*
let threadSortFilter=localStorage.getItem('threadSortFilter');
if(threadSortFilter)
{
 let threadSortOpt= JSON.parse(threadSortFilter);
 this.selectedCity1=threadSortOpt;
}
let threadOrderFilter=localStorage.getItem('threadOrderFilter');
if(threadOrderFilter)
{
 let threadOrderopt= JSON.parse(threadOrderFilter);
 this.selectedCity2=threadOrderopt;
}
*/
    //this.selectedCity1='Your Pins';
    //this.selectedCity2={name: 'Desendng', code: 'desc'};

    if(this.domainId=='52')
    {

      /* this.threadSortOptions = [
        { name: "Sort by latest Threads", code: "sortthread" },
        { name: "Sort by latest Reply", code: "sortbyreply" },
        { name: "Your Team Threads", code: "teamthread" },
        { name: "Your Threads", code: "ownthread" },
        { name: "Most Popular", code: "popularthread" },
        { name: "Your Fixes", code: "fixes" },
        { name: "Your Pins", code: "yourpin" },
        { name: "Escalation Level 1", code: "escL1" },
        { name: "Escalation Level 2", code: "escL2" },
        { name: "Escalation Level 3", code: "escL3" },
      ]; */

      this.threadSortOptions = [
        { name: "Sort by latest Threads", code: "sortthread" },
        { name: "Your Threads", code: "ownthread" },
        { name: "Your Pins", code: "yourpin" },
        { name: "Escalation Level 1", code: "escL1" },
        { name: "Escalation Level 2", code: "escL2" },
        { name: "Escalation Level 3", code: "escL3" },
      ];
    }

    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);

    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      let listView = localStorage.getItem("threadViewType");
      this.thumbView = (listView && listView == "thumb") ? true : false;
      if(action == 'reset' && this.solrApi){
        let toggleFlag = this.expandFlag
        this.pageRefresh["toggleFlag"] = toggleFlag;
        this.commonService.emitMessageLayoutChange(toggleFlag);
      }
      else{
        let toggleFlag = this.expandFlag
        this.pageRefresh["toggleFlag"] = toggleFlag;
        this.commonService.emitMessageLayoutChange(toggleFlag);
      }

      this.pageRefresh["threadViewType"] = listView;
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
      this.filterOptions['filterType'] = SolrContentTypeValues.Thread;

      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }
      console.log(localStorage.getItem('threadFilter'))
      setTimeout(() => {
        this.filterOptions['threadCategoryStr'] = [];
        this.apiData["groupId"] = this.groupId;
        this.apiData["mediaId"] = 0;

        if(this.solrApi)
        {
          this.apiData["onload"] = true;
          this.apiData["filterOptions"] = {};
          this.threadFilterOptions = this.apiData["onload"];
          this.apiData["filterOptions"]["pageInfo"] = this.pageData;
          let filterData = this.commonService.setfilterData(this.pageAccess);
          // Setup Filter Active Data
          this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
          filterData["filterrecords"] = this.filterCheck(action);
          this.apiData["filterOptions"]["filterrecords"] = filterData["filterrecords"];
          this.apiData["filterOptions"] = filterData;
          filterData.action = 'init';
          this.commonService.emitMessageLayoutrefresh(
            filterData
          );
        }
        //if(action != 'reset'){
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
              this.apiData["filterActiveCount"] = this.filterActiveCount;
              this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
              this.apiData["filterOptions"] = this.apiData["filterOptions"];
              this.apiData["filterOptions"]["action"] = action;
              this.apiData["filterOptions"]['orderBy']=this.threadOrderType;
              this.apiData["filterOptions"]['type']=this.threadTypesort;
              console.log(this.apiData);
              if(!this.solrApi)
              {
                this.commonService.emitMessageLayoutrefresh(
                  this.apiData["filterOptions"]
                );
              }
              if(action == 'reset') {
                console.log(this.filterRef.options)
                let filterOPt = this.filterRef.options;
                if(this.filterRef.errorCodeWidget) {
                  let errCodeId = this.filterRef.errorCodeId;
                  let optIndex = filterOPt.findIndex(option => option.id == errCodeId);
                  if(optIndex >= 0) {
                    let errCode = filterOPt[optIndex].valueArray;
                    let errorCodelItems = [];
                    errCode.forEach(item => {
                      errorCodelItems.push({
                        id: item.value,
                        name: item.value
                      });
                    });
                    this.filterRef.errorCodeArr = errorCodelItems;
                  }
                }
              }
              /* this.commonService.emitMessageLayoutrefresh(
                this.apiData["filterOptions"]
              ); */
              //  console.log(this.apiData+'---');
              //console.log(this.filterOptions);
              let resetTimeout = (action != 'reset') ? 0 : 1500;
              setTimeout(() => {
                this.filterOptions['filterExpand'] = this.expandFlag;
                this.filterLoading = false;
                this.filterOptions["filterLoading"] = this.filterLoading;
              }, resetTimeout);
              clearInterval(this.filterInterval);
              localStorage.removeItem("filterWidget");
              localStorage.removeItem("filterData");

              // Get Media List
            }
          }, 50);
        //}
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);

      setTimeout(() => {
        let chkData = localStorage.getItem('threadPushItem');
        let data = JSON.parse(chkData);
        if(data) {
          data.action = 'silentCheck';
        }
        //this.commonService.emitMessageReceived(data);
      }, 15000);
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  taponnewThread(event) {
    if (this.enableNewThread) {
      var aurl = "/new-threadv2";
      window.open(aurl, "_blank");
    }
  }
  accessLevelValu(event){
    this.accessLevel = event;
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }
  applyFilter(filterData,loadpush='') {
    console.log(filterData)
    filterData['pageInfo'] = this.pageData;
    if(!this.solrApi) {
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.pageOptions['expandFlag'] = this.expandFlag;
      this.pageRefresh["toggleFlag"] = this.expandFlag;
    }
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      if(!this.solrApi) {
        this.filterLoading = true;
      }
      this.filterActiveCount = 0;
      this.filterrecords = this.filterCheck();
      if(loadpush) {
        console.log(filterData)
        filterData["loadAction"] = 'push';
        //filterData["filterOptions"]['loadAction'] = 'push';
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
      let viewType = this.thumbView ? "thumb" : "list";
      filterData['threadThumbInit'] = this.threadThumbInit;
      filterData["threadViewType"] = viewType;
      filterData['orderBy']=this.threadOrderType;
      filterData['type']=this.threadTypesort;
      this.yourpined = this.threadTypesort == "yourpined" ? true : false;

      if(this.solrApi) {
        filterData["loadAction"] = '';
        console.log(filterData, this.filterRef);
        // Setup Filter Active Data
        this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
        setTimeout(() => {
          filterData["filterrecords"] = this.filterCheck();
          this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
          this.filterRef.activeFilter = this.filterActiveCount > 0 ? true : false;
          this.commonService.emitMessageLayoutrefresh(filterData);
        }, 500);
      } else {
        this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
        this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
        filterData["filterrecords"] = this.filterCheck();
        this.commonService.emitMessageLayoutrefresh(filterData);
        setTimeout(() => {
          this.filterLoading = false;
        }, 1000);
      }
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    if(!this.solrApi){
      localStorage.removeItem("threadFilter");
      setTimeout(() => {
        this.filterLoading = true;
        this.filterOptions['expandFlag'] = true;
        this.filterOptions["filterLoading"] = this.filterLoading;
        this.filterOptions["filterActive"] = false;
        this.currYear = moment().format("Y");
        this.threadOrderType = "desc";
        this.threadTypesort = "sortthread";
        this.yourpined = false;
        this.ngOnInit('reset');
      }, 500);
    } else {
      this.filterOptions["filterActive"] = false;
      this.currYear = moment().format("Y");
      localStorage.removeItem("threadFilter");
      this.threadOrderType = "desc";
      this.threadTypesort = "sortthread";
      this.yourpined = false;
      this.ngOnInit('reset');
    }
  }
  taponpin() {
    console.log(this.yourpined)
    if (this.yourpined) {
      this.pageRefresh['orderBy']=this.threadOrderType;
      this.threadTypesort = "sortthread";
      this.pageRefresh['type']=this.threadTypesort;
      this.pageRefresh["sortOrderBy"] = true;
      let viewType = this.thumbView ? "thumb" : "list";
      this.pageRefresh["threadViewType"] = viewType;
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.pageRefresh["action"] = '';
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.yourpined = false;
    } else {
      this.pageRefresh["type"] = "yourpin";
      this.threadTypesort = "yourpin";
      this.pageRefresh['orderBy']=this.threadOrderType;
      this.pageRefresh["sortOrderBy"] = true;
      let viewType = this.thumbView ? "thumb" : "list";
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.pageRefresh["threadViewType"] = viewType;
      this.pageRefresh["action"] = '';
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.yourpined = true;
    }
    let toIndex = this.threadSortOptions.findIndex(option => option.code == this.threadTypesort);
    if(toIndex >= 0) {
      let optName = this.threadSortOptions[toIndex].name;
      let optCode = this.threadSortOptions[toIndex].code;
      let threadSortFilter='{"name":"'+optName+'","code":"'+optCode+'"}';
      this.selectedCity1=JSON.parse(threadSortFilter);
    }
  }
 // Change the view
 viewType(actionFlag) {
    this.thumbView = actionFlag ? false : true;
    let viewType = this.thumbView ? "thumb" : "list";
    let apiCall = (this.CBADomain) ? true : false;
    this.threadThumbInit = (this.thumbView) ? this.threadThumbInit++ : this.threadThumbInit;
    let loadThumb = (this.threadThumbInit == 0) ? true : false;
    this.commonService.updateLsitView('threads', viewType, apiCall);
    setTimeout(() => {
      this.pageRefresh["action"] = 'view';
      this.pageRefresh["threadViewType"] = viewType;
      this.pageRefresh['orderBy']=this.threadOrderType;
      this.pageRefresh['type']=this.threadTypesort;
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.pageRefresh['threadThumbInit'] = this.threadThumbInit;
      localStorage.setItem("threadViewType",viewType);
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
    }, 100);
  }
  selectEventSort(event)
  {
    localStorage.removeItem('yourThreadsValue');
    localStorage.removeItem('yourStoreThreadsValue');
    this.threadTypesort=event.value.code;
    //localStorage.setItem('threadSortFilter',JSON.stringify(event.value));
    this.pageRefresh['orderBy']=this.threadOrderType;
    this.pageRefresh['type']=event.value.code;
    this.yourpined = (this.threadTypesort == 'yourpin') ? true : false;
    this.pageRefresh['sortOrderBy']=true;
    this.pageRefresh["action"] = 'sort';
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
  selectEventOrder(event) {
    this.threadOrderType=event.value.code;
    console.log(this.threadOrderType)
    if(this.threadApprovalFlag) {
      this.threadApprovalRef.sfsortOrder = this.threadOrderType;
      this.getApprovedSharedFixList();
    } else {
      // localStorage.setItem('threadOrderFilter',JSON.stringify(event.value));
      this.pageRefresh['type']=this.threadTypesort;
      this.pageRefresh['orderBy']=event.value.code;
      this.pageRefresh['sortOrderBy']=true;
      let viewType = this.thumbView ? "thumb" : "list";
      this.pageRefresh["threadViewType"] = viewType;
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
    }
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
    this.applyFilter(getFilteredValues,event);
  }

   // if any one filter is ON
   filterCheck(action = ''){
    this.filterrecords = false;
    if(this.pageRefresh['orderBy'] != 'desc'){
      this.filterrecords = true;
    }
    if(this.pageRefresh['type'] != 'sortthread'){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0 && action == ''){
      this.filterrecords = true;
    }
    console.log("**********************");
    console.log(this.filterrecords);
    console.log("**********************");
    return this.filterrecords;
  }

  // nav search page
  taponSearchPage(){
    let url = "search-page";
    this.router.navigate([url]);
  }



  // Nav Part Edit or View
  navPart() {
    //if(this.enableNewThread) {
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      if (this.userId) {
        let url = this.newThreadUrl;
        window.open(url, IsOpenNewTab.openNewTab);
      } else {
        localStorage.setItem("prod_type", "2");
        var aurl = "/new-threadv2";
        window.open(aurl, "_blank");
      }
    } else {
      let url = this.newThreadUrl;
      if (this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    }

    //}
  }
  // helpContent list and view
  helpContent(id){
    id = (id>0) ? id : '';
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
    });
    }


    requestPermission(state) {

      this.angularFireMessaging.requestToken.subscribe(
        (token) => {
          if (token && token != null) {
            this.enableDesktopPush = false;
          }
          else {
            this.enableDesktopPush = true;
          }

          console.log(token);
          let fcmAction = '';
          let fcmOldToken = '';
          let tokenKey = token;

          let fcmToken = localStorage.getItem('fcm_token');

          if (fcmToken == null) {
            localStorage.setItem('fcm_token', token);
          } else if (fcmToken != null && token != fcmToken) {
            fcmAction = 'update';
            fcmOldToken = fcmToken;
            localStorage.setItem('fcm_token', token);
          }

          const apiFormData = new FormData();
          apiFormData.append('apiKey', Constant.ApiKey);
          apiFormData.append('domainId', this.domainId);
          apiFormData.append('countryId', this.countryId);
          apiFormData.append('userId', this.userId);
          apiFormData.append('deviceName', this.browserDetection());
          apiFormData.append('appVersion', '1.0');
          apiFormData.append('type', 'w');
          apiFormData.append('token', tokenKey);
          apiFormData.append('webAppversion', environment.webVersionCollabtic.toString());
          apiFormData.append('status', state);

          if (fcmAction == 'update') {
            apiFormData["oldToken"] = fcmOldToken;
          }


          //console.log(apiFormData);

          this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {

            //console.log(response);
          });


        },
        (err) => {
          this.enableDesktopPush = true;
          console.log('Unable to get permission to notify.', err);
        }
      );
    }

      /* FCM SETUP */
  browserDetection() {
    let browserName = '';
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
      // insert conditional IE code here
      browserName = "MSIE";
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
      // insert conditional Chrome code here
      browserName = "Chrome";
    }
    //Check if browser is Firefox
    else if (navigator.userAgent.search("Firefox") >= 0) {
      // insert conditional Firefox Code here
      browserName = "Firefox";
    }
    //Check if browser is Safari
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    }

    else {
      browserName = "others";
    }
    return browserName;
  }


  requestActivePageAccess(state) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        //console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('pageAccess', this.access);
        apiFormData.append('isActivePage', this.activePageAccess);
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        //console.log(apiFormData);

        this.landingpageAPI.ActiveDevicesOnPageWeb(apiFormData).subscribe((response) => {

          //console.log(response);
        });


      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  //logout
  msLoginOut() {
    this.requestPermission(0);
    this.requestActivePageAccess(0);
    this.authenticationService.logout();
 }

  filterCallback(data) {
    if(!this.solrApi) {
      return false;
    }
    console.log(data)
    let action = data.actionFilter;
    switch(action) {
      case 'filter':
        this.filterRef.activeFilter = true;
        let getFilteredValues = JSON.parse(
          localStorage.getItem(filterNames.thread)
        );
        Object.keys(getFilteredValues).forEach(key => {
          let val = getFilteredValues[key];
          switch(key) {
            case 'workstream':
              this.filterRef.storedWorkstreams = val;
              break;
            case 'model':
              this.filterRef.storedModels = val;
              break;
          }
        });
        break;
      case 'clear':
        this.filterRef.storedWorkstreams = [];
        this.filterRef.storedModels = [];
        this.filterRef.storedErrorCode = [];
        this.filterRef.activeFilter = false;
        break;
    }
  }

  statusChange(event) {
    console.log(event)
    let value = event.value.code;
    this.threadApprovalRef.statusFilter = (value == '') ? 0 : value;
    this.getApprovedSharedFixList();
  }

  threadApprovalCallback(data) {
    console.log(data)
    this.threadApprovalRef = data;
    console.log(this.threadApprovalRef)
  }

  threadCallback(data) {
    console.log(data)
    this.threadRef = data;
    this.filterOptions['threadCategoryStr'] = this.threadRef.threadSubType;
    if(this.threadRef.threadSubTypeFilterFlag) {
      this.threadRef.threadSubTypeFlag = true;
      this.threadRef.threadSubType = this.threadRef.threadSubType;
      this.filterRef.getFilterValues(-1);
    }
    if(data.returnFromSearch) {
      this.thumbView = data.thumbView;
      setTimeout(() => {
        this.threadRef.returnFromSearch = false;
      }, 100);
    }
  }

  navApproval(action='') {
    console.log(this.threadRef)
    let currUrl = this.router.url.split('/');
    if(currUrl[2]=='shareFix' && action=='')
    {
      this.router.navigate(["/threads"]);

    }
    else
    {
      this.threadApprovalFlag = !this.threadApprovalFlag;
    }



  }

  getApprovedSharedFixList() {
    this.threadApprovalRef.scrollTop = 0;
    this.threadApprovalRef.lastScrollTop = this.threadApprovalRef.scrollTop;
    this.threadApprovalRef.itemOffset = 0;
    this.threadApprovalRef.items = [];
    this.threadApprovalRef.loading = true;
    this.threadApprovalRef.getApprovedSharedFixThreads();
  }

  getThreadItem(threadId) {
    console.log(this.threadRef)
    let start = 0;
    let listing = 0;
    let query = threadId;
    let limit:any = 1;
    let FiltersArr = {
      approvalProcess: [0,1],
      domainId: this.domainId,
      workstreamsIds: this.workstreamFilterArr
    };
    let apiData = {
      query,
      listing,
      rows: limit,
      start,
      type: 1,
      filters: FiltersArr
    };
    this.landingpageAPI.getSolrDataDetail(apiData).subscribe((response) => {

    });
  }

  ngOnDestroy(): void {
  }
}
