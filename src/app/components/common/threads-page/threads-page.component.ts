import { Component, OnInit, OnDestroy, HostListener, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import {PerfectScrollbarDirective,PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { trigger, transition, style, animate, sequence } from "@angular/animations";
import * as moment from "moment";
import { Router,NavigationEnd } from '@angular/router';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { PlatFormType, windowHeight, threadBulbStatusText, Constant, RedirectionPage, pageTitle, PageTitleText, ContentTypeValues, DefaultNewImages, DefaultNewCreationText,
  forumPageAccess,
  MediaTypeInfo,
  ManageTitle,
  DocfileExtensionTypes,
  firebaseCredentials,
  pageInfo,
  PushTypes,
  filterNames,
  SolrContentTypeValues
} from "src/app/common/constant/constant";
import { CommonService } from "../../../services/common/common.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ApiService } from '../../../services/api/api.service';
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database
import { AngularFireAuth } from  "@angular/fire/auth";
import { PlatformLocation } from "@angular/common";
import { Observable } from 'rxjs';
import { Table } from "primeng/table";
import { BaseService } from 'src/app/modules/base/base.service';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
declare var $: any;
@Component({
  selector: "app-threads-page",
  templateUrl: "./threads-page.component.html",
  styles: [
    `
      .masonry-item {
        width: 268px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
  animations: [
    trigger("threadsTab", [
      transition("* => void", [
        style({
          height: "*",
          opacity: "1",
          transform: "translateX(0)",
          "box-shadow": "0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        }),
        sequence([
          animate(
            ".25s ease",
            style({
              height: "*",
              opacity: ".2",
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
          animate(
            ".1s ease",
            style({
              height: "0",
              opacity: 0,
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
        ]),
      ]),
      transition("void => active", [
        style({
          height: "0",
          opacity: "0",
          transform: "translateX(20px)",
          "box-shadow": "none",
        }),
        sequence([
          animate(
            ".1s ease",
            style({
              height: "*",
              opacity: ".2",
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
          animate(
            ".35s ease",
            style({
              height: "*",
              opacity: 1,
              transform: "translateX(0)",
              "box-shadow": "0 1px 4px 0 rgba(0, 0, 0, 0.3)",
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class ThreadsPageComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() parentData;
  @Input() fromOthersTab;
  @Input() pageDataInfo;
  @Input() fromSearchPage;
  @Input() tapfromheader;
  //@Input() threadFilterOptions:any=[];
  @Input() filterOptions;
  @Input() tspageInfo: any = [];
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @Output() searchResultData: EventEmitter<any> = new EventEmitter();
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild("listDiv", { static: false }) listDiv: ElementRef;
  @Output() threadApprovalRef: EventEmitter<ThreadsPageComponent> = new EventEmitter();
  @Output() callback: EventEmitter<ThreadsPageComponent> = new EventEmitter();
  @Output() accessLevelValue: EventEmitter<any> = new EventEmitter();
  subscription: Subscription = new Subscription();
  public pageTitleText='';
  public redirectionPage='';
  public priorityIndexValue='';
  public pushThreadArrayNotification=[];
  public subscriberDomain=localStorage.getItem('subscriber');

  public threadIdArrayInfo=[];
  public countryId;
  public domainId;
  public firebaseAuthcreds;
  public threadsAPIcall;
  public pageInfo: any = pageInfo.threadsPage;
  public windowsItems = [];
  public workstreamPage = pageInfo.workstreamPage;
  public searchPage = pageInfo.searchPage;
  public nothingtoshow: boolean = false;
  public loadedthreadAPI: boolean = false;
  public menuListloaded = [];
  public loadingelanding: boolean = true;
  public searchFromWorkstream: boolean = false;
  public tvsFlag: boolean = false;
  public pageLoading: boolean = true;
  public platformId = 0;
  public threadFilterOptions;
  public industryType: any = [];
  public userId;
  public roleId;
  public myOptions;
  public fromfirebaseData=0;
  public midHeight;
  public listHeight;
  public pTableHeight = '450px';
  public listWidth;
  public onInitload = false;
  public threadListArray = [];
  public threadListArrayNew = [];
  public threadPageListArray = [];
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public loadingthread: boolean = false;
  public updateMasonryLayout: boolean = false;
  public loadingthreadmore: boolean = false;
  public centerloading: boolean = false;
  public newThreadView: boolean = false;
  public itemLimitTotal: number = 10;
  public itemLimit: number = 10;
  public visibilityChangeLimit: number = 0;
  
  public itemwidthLimit;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public newThreadInfo = "";
  public displayNoRecordsShow = 0;
  public contentTypeValue;
  public contentTypeDefaultNewImg= DefaultNewImages.Threads;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public createThreadUrl = "threads/manage";
  public proposedFixTxt = "";
  public threadwithFixTxt = "";
  public shareFixTxt = "";
  public shareSummitFixTxt = "";
  public threadwithHelpfulFixTxt = "";
  public threadwithNotFixTxt = "";
  public threadCloseTxtTxt = "";
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number = 0;
  public loadThreadId: number = 0;
  public scrollCallback: boolean = false;
  public ItemArray = [];
  public navFromWs: boolean = false;
  public workstreamFilterArr = [];
  public workstreamFilterId = '';
  public outputFilterData: boolean = false;
  public approvalEnableDomainFlag: boolean = false;
  public makeNameArr = [];
   notes_Firebase_Data :AngularFireList<any>;

  notes_angular :Observable<any[]>;
  public optionFilter = "";
  public itemTotal: number;
  public apiData: Object;
  public threadSortType = "sortthread";
  public threadOrderByType = "desc";
  public feedbackStatus='all';
  public searchValue = "";
  public MediaTypeInfo = MediaTypeInfo;
  public DocfileExtensionTypes = DocfileExtensionTypes;
  public user: any;
  public errorDtcActiveIcon: string =
    "assets/images/workstreams-page/error-alert-icon-2.svg";
  public errorDtcIcon: string =
    "assets/images/workstreams-page/no_error_code.png";
  public techSubmmitFlag: boolean = false;

  public hideToolbar: boolean = false;
  public thumbView: boolean = false;
  public bodyClass1: string = "parts-list";
  public bodyClass2: string = "parts";
  public bodyClass3: string = "landing-page";
  public bodyElem;
  public opacityFlag: boolean = false;
  public hideFlag: boolean = false;
  public cols: any[];
  public CBADomain: boolean = false;
  public TVSDomainOnly: boolean = false;
  public threadSubTypeData: any[];
  public threadSubTypeDataArr = [];
  public threadSubType = [];
  public threadSubTypeFilterFlag: boolean = false;
  public threadSubTypeFilterFlagOn: boolean = false;
  public threadSubTypeFlag: boolean = false;
  public setTWidth;
  public setTWidthDuplicateFlag:boolean = false;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true, reply: true, close: true};

  public rmHeight: any = 160;
  public collabticDomain: boolean = false;
  public collabticFixes: boolean = false;
  public mahleDomain: boolean = false;
  public searchParams: string = '';
  public accessLazyLoad: string = "";
  public currentContentTypeId = 2;
  public solrApi: boolean = false;
  public returnFromSearch: boolean = false;

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      if (this.pageDataInfo == this.pageInfo || this.pageDataInfo == this.searchPage) {
        setTimeout(() => {
          let rmListHeight = 20;
          let containerHeight = document.getElementsByClassName('thread-container')[0];
          if(containerHeight) {
            this.listHeight = containerHeight.clientHeight - rmListHeight;
            this.pTableHeight = parseInt(this.listHeight)-53+'px';
            let listItemHeight;
            if (this.thumbView) {
              listItemHeight = document.getElementsByClassName("masonry-item-container")[0].clientHeight;
            } else {
              listItemHeight = document.getElementsByClassName("thread-list-table")[0].clientHeight;
            }
            if(containerHeight >= listItemHeight) {
              this.loadingthreadmore = true;
              this.loadThreadsPage();
              this.itemOffset += this.itemLimit;
            }
          }
        }, 500);
      }
    }, 50);

    setTimeout(() => {
      //this.loadThreadsPage();
      setTimeout(() => {
        if (this.listDiv != undefined && !this.thumbView) {
          let listWidth1 = this.listDiv.nativeElement.clientWidth;
          let listWidth2 = document.getElementsByClassName("mat-table")[0].clientWidth;
          this.listWidth = listWidth1 > listWidth2 ? listWidth1 : listWidth1;
          $(".mat-inner-container").css("width", this.listWidth);

        }
      }, 1000);

      setTimeout(() => {
        var elmnt = document.getElementById("thread-data-container");
        let itemLimitwidth = elmnt.offsetWidth;
        this.setTWidth = itemLimitwidth;
      }, 100);

    }, 200);
  }

  constructor(
    private probingApi: ProductMatrixService,
    private LandingpagewidgetsAPI: LandingpageService,
    private router: Router,
    public sharedSvc: CommonService,
    private getMenuListingApi: CommonService,
    private authenticationService: AuthenticationService,
    private dbF: AngularFireDatabase,
    public afAuth:  AngularFireAuth,
    private location: PlatformLocation,
    public apiUrl: ApiService,
    private baseSerivce: BaseService,
    private threadPostService: ThreadPostService,
  ) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // do whatever you want
       console.log('Hidden');
      }
      else {
        // do whatever you want
        console.log('Show thread');
        let mynewthread=localStorage.getItem('mynewthread');
        if(mynewthread)
        {

          setTimeout(() => {
            localStorage.removeItem('mynewthread');
          },3000);
        }
        else
        {
         // this.itemOffset = 0;
         // this.apiData['offset'] = this.itemOffset;
         let push = false, limit:any = '5',newthread=false,actionFilter='';
         this.visibilityChangeLimit=5;
         this.loadThreadsPage(push,limit,newthread,actionFilter);
        }

      }
    });


    this.location.onPopState (() => {
      this.loadingthread = false;
      this.hideFlag = true;
      this.setTWidth = 0;
      setTimeout(() => {
        var elmnt = document.getElementById("thread-data-container");
        let itemLimitwidth = elmnt.offsetWidth;
        this.setTWidth = itemLimitwidth;
        console.log('---set width flag #1');
        if(!document.body.classList.contains(this.bodyClass3)) {
          document.body.classList.add(this.bodyClass3);
        }
      }, 600);
      if(!document.body.classList.contains(this.bodyClass1)) {
        document.body.classList.add(this.bodyClass1);
      }
      if(!document.body.classList.contains(this.bodyClass2)) {
        document.body.classList.add(this.bodyClass2);
      }

      let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.Threads) {
          this.opacityFlag = true;
          this.backScroll();
      }
      if(url[1] == RedirectionPage.Workstream && this.currentContentTypeId == 2) {
        this.opacityFlag = true;
        this.backScroll();
      }
      if(url[1] == RedirectionPage.Search ) {
        if(this.pageDataInfo == pageInfo.workstreamPage) {
          this.setScreenHeight();
        }
        let sNavUrl = localStorage.getItem('sNavUrl');
        if(sNavUrl == 'threads'){
          this.loadingthread = false;
          if(this.apiUrl.searchPageRedirectFlag == "1"){
            this.apiUrl.searchPageRedirectFlag = "2";
            console.log(this.threadListArray, this.threadPageListArray)
            this.threadListArray = this.threadPageListArray;
            this.opacityFlag = true;
            this.backSearchScroll();
            this.returnFromSearch = true;
            this.callback.emit(this);
          }
        }
        else{
          this.loadingthread = false;
          this.opacityFlag = false;
          this.backSearchHomeScroll();
        }
      }
      setTimeout(() => {
        this.hideFlag = false;
      }, 100);
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('subscriptionDomainIdStr');
    localStorage.setItem('currentContentType', '2');
    window.addEventListener('scroll', this.scroll, true);
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    this.onInitload = false;
    let filterrecords = false;
    this.countryId = localStorage.getItem('countryId');

    this.industryType = this.sharedSvc.getIndustryType();
    if (this.industryType.id == 2) {
      this.errorDtcActiveIcon = "assets/images/common/engine-icon.png";
      this.errorDtcIcon = "assets/images/common/engine-gray-icon.png";
    }
    let platformId: any = localStorage.getItem('platformId');
    let domainId: any = localStorage.getItem('domainId')
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.tvsFlag = (this.platformId == 2 && (domainId == 52 || domainId==82)) ? true : false;
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.TVSDomainOnly = (this.platformId == 2 && (domainId == 52)) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.collabticFixes = (this.collabticDomain && domainId == 336) ? true : false;
    this.mahleDomain = (platformId == PlatFormType.MahleForum) ? true : false;
    this.pageTitleText = (this.industryType.id == 3 && domainId == 97) ? `${ManageTitle.feedback}s` : this.pageTitleText;
    this.pageTitleText = (platformId==3) ? `${ManageTitle.supportRequest}s` : this.pageTitleText;
    if(domainId==71 && platformId=='1')
      {
        this.pageTitleText=ManageTitle.supportServices;
      }
      if(this.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
      {
        this.pageTitleText=ManageTitle.techHelp;
      }
    this.solrApi = (this.collabticDomain || this.CBADomain || this.tvsFlag) ? true : false;
    this.approvalEnableDomainFlag = localStorage.getItem('shareFixApproval') == '1' ? true : false;
    this.newThreadInfo = `This is where your ${this.pageTitleText} will appear as you collaborate with your colleagues during a diagnostics and repair process. Get started by tapping on ‘New’.`;
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;

    this.redirectionPage = RedirectionPage.Threads;
    this.pageTitleText = (this.industryType.id == 3 && this.domainId == 97) ? `${ManageTitle.feedback}s` : PageTitleText.Threads;
    this.contentTypeValue = ContentTypeValues.Threads;
    this.contentTypeDefaultNewImg = DefaultNewImages.Threads;
    this.contentTypeDefaultNewText = (this.industryType.id == 3 && this.domainId == 97) ? `${ManageTitle.actionNew} ${ManageTitle.feedback}` : DefaultNewCreationText.Threads;

    this.contentTypeDefaultNewText = (platformId=='3') ? `${ManageTitle.actionNew} ${ManageTitle.supportRequest}` : this.contentTypeDefaultNewText;
    if( this.domainId==71 && platformId=='1')
    {
      this.contentTypeDefaultNewText=ManageTitle.supportServices;
    }
    if(this.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
    {
      this.contentTypeDefaultNewText=ManageTitle.techHelp;
    }
    // author need to remove the below text 

    // author need to remove the below text
    //this.TVSDomainOnly = false;

    this.cols = [];
    this.cols = [
      { field: 'userName', header: 'Technician', columnpclass:'w1 header thl-col-1 col-sticky' },
      { field: 'threadTitle', header: 'Problem Title', columnpclass:'w2 header thl-col-2 col-sticky' },
      { field: 'currentDtc', header: 'Error Code', columnpclass:'w3 header thl-col-3' },
      { field: 'threadId', header: 'Id', columnpclass:'w4 header thl-col-4'},
      { field: 'make', header: 'Make', columnpclass:'w5 header thl-col-5'},
      //{ field: 'model', header: 'Model',columnpclass:'w6 header thl-col-6' },
      //{ field: 'shareFix', header: 'Fix Status',columnpclass:'w8 header thl-col-8 '},
    ];
    console.log(this.cols);
    if(this.CBADomain){
      this.cols.push({ field: 'ro', header: 'RO#',columnpclass:'w8 header thl-col-8 ro'})
    }
    if(this.TVSDomainOnly){
      this.cols.push(
        { field: 'dealerName', header: 'Dealer Name',columnpclass:'w8 header thl-col-8 spec-col col-1'},
        { field: 'dealerCode', header: 'Dealer Code',columnpclass:'w8 header thl-col-8 spec-col col-2'},
        { field: 'zone', header: 'Zone',columnpclass:'w8 header thl-col-8 spec-col col-3'},
        { field: 'area', header: 'Area',columnpclass:'w8 header thl-col-8 spec-col col-4'},
      )
    }
    this.cols.push(
      { field: 'date', header: 'Created On',columnpclass:'w7 header thl-col-7 paddingTB' },
      { field: 'threadStatus', header: 'Status',columnpclass:'w9 header thl-col-9 status-col col-sticky'}
    );

    console.log(this.cols);

    setTimeout(() => {
      if(this.pageDataInfo == this.workstreamPage || this.pageDataInfo == this.searchPage) {
        console.log(this.tspageInfo)
        this.thumbView = this.tspageInfo.pageView;
      } else {
        let listView = localStorage.getItem("threadViewType");
        this.thumbView = (listView && listView == "thumb") ? true : false;
      }
    }, 5);
    setTimeout(() => {
      this.pageLoading = false;
    }, 250);
    this.subscription.add(
    this.sharedSvc.emitOnCloseDetailPageCollapseSubject.subscribe((r) => {

      let newThreadsData=localStorage.getItem('newThreadsData');
      if(newThreadsData)
      {
       let jsonDataItem= JSON.parse(newThreadsData);
       console.log(jsonDataItem);
       if(jsonDataItem)
       {
        console.log(newThreadsData);
       // this.sharedSvc.emitMessageReceived(jsonDataItem);
       }
      }
      //alert(newThreadsData);


    })
    );

    this.subscription.add(
      this.sharedSvc.threadDetailCallData.subscribe((r) => {
        if(true){
          let newUpdateID = localStorage.getItem('newUpdateOnThreadId') != null ? localStorage.getItem('newUpdateOnThreadId') : '';
          if(newUpdateID !='' ){
            let currUrl = this.router.url.split('/');
            let navFrom1 = currUrl[1];
            let navFrom2:any = currUrl[2];
            if(((navFrom2!='view-v2') || (navFrom2!='view-v3')) && navFrom2!='view')
            {
              console.log('thread call 1');
            this.callThreadDetail(newUpdateID);
            setTimeout(() => {
              localStorage.removeItem('newUpdateOnThreadId');
            }, 100);
          }
          }
          let OnNewThreadIdUpdate=localStorage.getItem("OnNewThreadIdUpdate");
      if(OnNewThreadIdUpdate)
      {
        this.loadThreadsPage(true);
        localStorage.removeItem("OnNewThreadIdUpdate");
      }



        }

      })
      );

    this.subscription.add(
      this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
        console.log("-----------253-----------", r);
        this.priorityIndexValue = "1";
        this.threadIdArrayInfo = [];
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        let pushAction = setdata.pushAction;
        if(setdata.dataId)
        {
          this.pushThreadArrayNotification.push(setdata.dataId);
        }
        let pushType = parseInt(setdata.pushType);
        let action = (setdata.pushType == 47) ? 'silentLoad' : setdata.action;
        if(pushType == 47) {
          let threadId = (setdata.messageId == '') ? 0 : setdata.messageId;
          this.loadThreadId = parseInt(threadId);
          setdata.silentLoadCount = 1;
        }
        let access = setdata.access;
        let cpageInfo = setdata.pageInfo;
        if(pushType == 45 || pushType == 46 || pushType == 48) {
          return false;
        }
        if(action == 'silentUpdate' && !this.thumbView) {
          this.opacityFlag = true;
          this.loadThreadsPage();
          this.backScroll();
          return false;
        }
        cpageInfo = (cpageInfo != '') ? cpageInfo : this.pageDataInfo;
        console.log(access, action, cpageInfo, pageInfo.threadsPage,pushAction)
        if((access == 'threads' || cpageInfo == pageInfo.threadsPage) && pushAction == 'load') {
          switch(action) {
            case 'silentCheck':
              console.log(setdata)
              let pushFlag = true;
              var checkgroups = setdata.groups;
              let make = setdata.makeName;
              let clearFields = ['workstream', 'make'];
              let groupArr = JSON.parse(checkgroups);
              let threadWs = groupArr;
              if (checkgroups) {
                let fthreadFilter = JSON.parse(
                  localStorage.getItem("threadFilter")
                );

                console.log(fthreadFilter)

                for (let ws of threadWs) {
                  let windex = fthreadFilter.workstream.findIndex(
                    (w) => w == ws
                  );
                  if (windex == -1) {
                    pushFlag = false;
                    fthreadFilter.workstream.push(ws);
                  }
                }
                let tws = fthreadFilter.workstream;
                console.log(pushFlag)
                if(fthreadFilter.make) {
                  if(pushFlag) {
                    clearFields = (fthreadFilter.make[0] == make) ? clearFields : [];
                    let chkFilterData = this.sharedSvc.checkFilterApply(fthreadFilter, clearFields);
                    if(fthreadFilter.make.length > 0 && chkFilterData.filterCount > 0) {
                      let clearItems = chkFilterData.clearItems;
                      let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                      fthreadFilter = updatedFilter;
                      console.log(updatedFilter);
                      let currUrl = this.router.url.split('/');
                      let navFrom = currUrl[1]
                      if(navFrom == 'threads') {
                        setTimeout(() => {
                          this.filterOutput.emit("push");
                        }, 1500);
                      }
                    } else {
                      this.loadThreadsPage(pushFlag);
                    }
                  } else {
                    let clearItems:any = [];
                    Object.entries(fthreadFilter).forEach((item) => {
                      let key = item[0];
                      if(key != 'workstream') {
                        clearItems.push(item[0]);
                      }
                      let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                      fthreadFilter = updatedFilter;
                    });

                    localStorage.setItem(
                      "threadFilter",
                      JSON.stringify(fthreadFilter)
                    );
                    let currUrl = this.router.url.split('/');
                    let navFrom = currUrl[1];
                    console.log(4564, navFrom)
                    if(navFrom == 'threads') {
                      this.itemOffset = 0;
                      this.apiData['offset'] = this.itemOffset;
                      this.threadListArray = [];
                      this.threadListArrayNew = [];
                      this.apiData = apiInfo;
                      setTimeout(() => {
                        this.filterOutput.emit("push");
                      }, 1500);
                    }

                    /* this.itemOffset = 0;
                    this.apiData['offset'] = this.itemOffset;
                    this.threadListArray = [];
                    this.threadListArrayNew = [];
                    this.apiData = apiInfo;
                    this.loadingthread = true;
                    this.loadThreadsPage(); */
                  }
                }

                console.log(tws, pushFlag);
                console.log(JSON.stringify(fthreadFilter));

                this.outputFilterData = true;
                console.log(this.outputFilterData);

                localStorage.setItem(
                  "threadFilter",
                  JSON.stringify(fthreadFilter)
                );
              }
              return false;
              break;
            case 'silentLoad':
              if(setdata.silentLoadCount > 0) {
                if(!document.body.classList.contains(this.bodyClass1)) {
                  document.body.classList.add(this.bodyClass1);
                }
                let limit = setdata.silentLoadCount;
                if(pushType == 47) {
                  let sflag = true;
                  setTimeout(() => {
                    this.loadThreadsPageSolr('', 1, sflag, sflag);
                  }, 10000);
                } else {
                  this.loadThreadsPage(true, limit);
                }
                return false;
              }
              break;
            case 'silentDelete':
              if (this.newThreadView) {
                localStorage.removeItem('newUpdateOnThreadId');
              }
              let threadIndex = this.threadListArray.findIndex(option => option.threadId === setdata.threadId);
              this.threadListArray.splice(threadIndex, 1);
              console.log(threadIndex)
              console.log(setdata.threadId)
              setTimeout(() => {
                if(this.thumbView) {
                  console.log('layout 7');
                  this.masonry.reloadItems();
                  this.masonry.layout();
                  this.updateMasonryLayout = true;
                  setTimeout(() => {
                    this.updateMasonryLayout = false;
                  }, 750);
                }
              }, 100);

              console.log(setdata.threadId, threadIndex, this.threadListArray);
              this.itemTotal -= 1;
              this.itemLength -= 1;
              break;
            case 'silentUpdate':
              console.log(456)
              this.opacityFlag = true;
              setTimeout(() => {
                let threadId = parseInt(setdata.dataId);
                let dataInfo = setdata.dataInfo;
                console.log(dataInfo)
                let uthreadIndex = this.threadListArray.findIndex(option => option.threadId === threadId);
                let flag: any = false;
                let pageDataIndex = pageTitle.findIndex(option => option.slug == this.redirectionPage);
                console.log(pageTitle[pageDataIndex]);
                let pageDataInfo = pageTitle[pageDataIndex] != undefined ? pageTitle[pageDataIndex].dataInfo : '' ;
                localStorage.removeItem(pageDataInfo);
                if(this.thumbView) {
                  this.setupThreadData(action, flag, dataInfo, uthreadIndex, uthreadIndex);
                  console.log('checkType 1');
                }
              }, 500);
              return false;
              break;
          }
          console.log(setdata, this.pageDataInfo, cpageInfo);
          if (this.pageDataInfo == cpageInfo || access == 'threads') {


            let sindex = PushTypes.findIndex(option => option.url == this.redirectionPage);
            let silentCountTxt = PushTypes[sindex].silentCount;
            localStorage.removeItem(silentCountTxt);
            var checkpushtype = setdata.pushType;
            var checkmessageType = setdata.messageType;
            //var checkgroups = Array.isArray(setdata.groups) ? setdata.groups : [];
            var checkgroups = Array.isArray(setdata.groups) ? setdata.groups : setdata.groups;

            console.log(checkgroups);
            let make = setdata.makeName;
            let clearFields = ['workstream', 'make', 'action', 'threadViewType', 'loadAction'];
            let additionalFields = ['action', 'threadViewType', 'loadAction'];
            //var checkgroups='["11"]';
            let fthreadFilter:any = localStorage.getItem("threadFilter");
            if(fthreadFilter == null) {
              if (checkgroups instanceof Array)
              {
                fthreadFilter = {
                  workstream :checkgroups,
                  make: []
                };
              }
              else
              {
                fthreadFilter = {
                  workstream : JSON.parse(checkgroups),
                  make: []
                };
              }

            } else {
              fthreadFilter = JSON.parse(fthreadFilter);
            }

            console.log(fthreadFilter);
            let twsLen:any = (fthreadFilter.workstream) ? fthreadFilter.workstream.length : 0;
            let emptyArray = [];
            let chkFilter = this.sharedSvc.checkFilterApply(fthreadFilter, additionalFields);
            console.log(chkFilter)
            let chkFilterCount:any = chkFilter.filterCount;
            //chkFilterCount=0;
            console.log(twsLen, chkFilterCount)
            console.log(fthreadFilter);
            console.log("message received! ####", r);
            if (
              (checkpushtype == 1 && checkmessageType == 1) ||
              checkpushtype == 12 || checkpushtype == 47
            ) {
              if (checkgroups) {
                let groupArr = (checkgroups.length > 0) ? JSON.parse(checkgroups) : [];
                console.log(groupArr);
                if (groupArr) {
                  console.log(fthreadFilter.workstream);
                  let findgroups:any = 0;
                  let notifyScreen = (fthreadFilter.workstream) ? true : false;
                  if (fthreadFilter.workstream) {
                    let arrworkstm = fthreadFilter.workstream;
                    findgroups = groupArr.filter(x => !arrworkstm.includes(x));
                    if(checkpushtype == 1) {
                      findgroups = (findgroups.length == 0) ? 0 : -1;
                      notifyScreen = (findgroups == -1 && chkFilterCount == 1) ? false : notifyScreen;
                    }
                  }
                  console.log(checkpushtype, findgroups);
                  if (checkpushtype == 12 || checkpushtype == 47) {
                    //localStorage.setItem('threadPushItem', JSON.stringify(r));
                    let threadWs = groupArr;
                    let pushFlag = true;
                    if (threadWs.length > 0) {
                      let fthreadFilter:any = localStorage.getItem("threadFilter");
                      if(fthreadFilter == null || Object.keys(fthreadFilter).length == 0) {
                        fthreadFilter = {
                          workstream : JSON.parse(checkgroups),
                          make: []
                        };
                      } else {
                        fthreadFilter = JSON.parse(fthreadFilter);
                      }
                      console.log(twsLen, chkFilterCount, fthreadFilter);
                      for (let ws of threadWs) {
                        let windex = fthreadFilter.workstream.findIndex(
                          (w) => w == ws
                        );
                        if (windex == -1) {
                          pushFlag = false;
                          fthreadFilter.workstream.push(ws);
                        }
                      }

                      let tws = fthreadFilter.workstream;
                      console.log(tws, pushFlag);
                      console.log(JSON.stringify(fthreadFilter));
                      this.outputFilterData = true;
                      console.log(this.outputFilterData);

                      if((twsLen == 0 && chkFilterCount == 0) || (twsLen == 1 && chkFilterCount == 1 && pushFlag && fthreadFilter.make.length == 0)) {
                        localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));
                        let flag: any = true;
                        setTimeout(() => {
                          this.loadThreadsPage(flag);
                        }, 1500);
                        return false;
                      }

                      localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));

                      let currUrl = this.router.url.split('/');
                      let navFrom = currUrl[1];
                      console.log(pushFlag)
                      if(pushFlag) {
                        localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));
                        setTimeout(() => {
                          fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
                          if(fthreadFilter.make) {
                            console.log(fthreadFilter, fthreadFilter.make[0])
                            clearFields = (fthreadFilter.make[0] == make) ? clearFields : additionalFields;
                            let chkFilterData = this.sharedSvc.checkFilterApply(fthreadFilter, clearFields);
                            console.log(navFrom, fthreadFilter.make.length, chkFilterData)
                            if(navFrom == 'threads' && fthreadFilter.make.length > 0 && chkFilterData.filterCount > 0) {
                              console.log('in');
                              let clearItems = chkFilterData.clearItems;
                              clearItems = clearItems.filter(item => item !== 'workstream');
                              let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                              if(fthreadFilter.make[0] == make) {
                                updatedFilter.make = [make];
                              }
                              fthreadFilter = updatedFilter;
                              console.log(updatedFilter);
                              localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));
                              setTimeout(() => {
                                this.filterOutput.emit("push");
                              }, 1500);
                            } else {
                              if(make != '' && fthreadFilter.make[0] != make) {
                                fthreadFilter.workstream = [];
                                localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));
                                setTimeout(() => {
                                  this.filterOutput.emit("push");
                                }, 1500);
                              } else {
                                setTimeout(() => {
                                  this.loadThreadsPage(pushFlag);
                                }, 1500);
                              }
                            }
                          }
                        }, 500);
                      } else {
                        console.log(JSON.parse(localStorage.getItem("threadFilter")));
                        setTimeout(() => {
                          console.log(JSON.parse(localStorage.getItem("threadFilter")));
                          if(navFrom == 'threads') {
                            fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
                            let clearItems:any = ['action', 'threadViewType'];
                            fthreadFilter.make = (fthreadFilter.make == undefined || fthreadFilter.make == 'undefined') ? [] : fthreadFilter.make;
                            let sameMake = (fthreadFilter.make.length > 0 && fthreadFilter.make[0] == make) ? true : false;
                            let makeFlag:any = (chkFilterCount == 1 && sameMake) ? true : false;
                            if(makeFlag) {
                              setTimeout(() => {
                                this.loadThreadsPage(makeFlag);
                              }, 1500);
                              return false;
                            }
                            Object.entries(fthreadFilter).forEach((item) => {
                              let key = item[0];
                              console.log(sameMake)
                              clearItems.push(key);
                            });
                            if(sameMake) {
                              clearItems = clearItems.filter(item => item !== 'make');
                            }
                            console.log(clearItems)
                            let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                            fthreadFilter = updatedFilter;
                            localStorage.setItem(
                              "threadFilter",
                              JSON.stringify(fthreadFilter)
                            );
                            setTimeout(() => {
                              this.filterOutput.emit("push");
                            }, 1500);
                          }

                          this.itemOffset = 0;
                          this.apiData['offset'] = this.itemOffset;
                          this.threadListArray = [];
                          this.threadListArrayNew = [];
                          this.apiData = apiInfo;
                          if(navFrom != 'threads') {
                            this.loadingthread = true;
                            this.loadThreadsPage();
                          }
                        }, 500);
                      }
                    }
                  }

                  if (findgroups != -1 || notifyScreen) {
                    if (checkpushtype != 12) {
                      let currUrl = this.router.url.split('/');
        let navFrom1 = currUrl[1];
        let navFrom2 = currUrl[2];

          this.loadThreadsPage(true);


                    }
                  }
                }
              }
            }
          }

          setTimeout(() => {
          // this.sharedSvc.emitOnLeftSideMenuBarSubject('');
            },4000);
        }
        else
        {
          if(setdata.threadId)
          {
            let currUrl = this.router.url.split('/');
            let navFrom1 = currUrl[1];
            let navFrom2 = currUrl[2];
            console.log('thread call 2');
            this.callThreadDetail(setdata.threadId);

          }

        }
      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {
        console.log("-----------353-----------", r);
        this.pageLoading = true;
        setTimeout(() => {
          this.pageLoading = false;
        }, 250);
        let action = r['action'];
        //alert(action);
        console.log(action)
        this.apiData['loadAction'] = r['loadAction'];
        this.thumbView = (action == '' && r['threadViewType'] == 'thumb') ? true : this.thumbView;
        this.rmHeight = 160;
        let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
        this.rmHeight =  this.rmHeight + headerHeight;
        if(r['threadViewType'] != undefined && r['threadViewType'] != 'undefined') {
          if (this.threadSubTypeDataArr.length>1) {
            this.rmHeight = (r['threadViewType'] == 'thumb') ? this.rmHeight + 50 : this.rmHeight + 30;
          }
          else{
            this.rmHeight = (r['threadViewType'] == 'thumb') ? this.rmHeight : this.rmHeight - 20;
          }
        }
        switch(action) {
          case 'view':
            let viewType = r['threadViewType'];
            let threadThumbInit = r['threadThumbInit'];
            this.thumbView = (viewType == 'list') ? false : true;
            let wsRemove = (!this.thumbView && this.pageDataInfo == this.workstreamPage) ? 20 : 0;
            this.rmHeight = this.rmHeight+wsRemove;
            let containerHeight = document.getElementsByClassName('thread-container')[0].clientHeight;
            if(this.pageDataInfo == this.workstreamPage || this.pageDataInfo == this.searchPage) {
              $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
              $(".view-type").removeClass("scroll-bg");
            }
            if (this.threadSubTypeDataArr.length>1) {
              let rmListHeight = (this.thumbView) ? 145 : 10;
              rmListHeight = rmListHeight-wsRemove;
              this.listHeight = containerHeight + rmListHeight;
              this.pTableHeight = parseInt(this.listHeight)-53+'px';
            }
            else{
              let rmListHeight = (this.thumbView) ? 95 : 10;
              rmListHeight = rmListHeight-wsRemove;
              this.listHeight = containerHeight + rmListHeight;
              this.pTableHeight = parseInt(this.listHeight)-53+'px';
            }
            if(this.thumbView && !this.collabticFixes) {
              //let timeout = (threadThumbInit == 0) ? 1000 : 750;
              this.updateThumbLayout();
            }
            setTimeout(() => {
              this.scrollTop = 0;
              let id = 'thread-data-container';
              this.scrollToElem(id);
            }, 100);
            return false;
          break;
          case 'side-menu':
            let access = r['access'];
            let page = r['page'];
            if(access == 'Threads' || page == 'threads') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
              console.log('layout 8');
             this.masonry.reloadItems();
             this.masonry.layout();
              this.updateMasonryLayout = true;
              setTimeout(() => {
             this.updateMasonryLayout = false;
                this.hideFlag = true;
              }, 750);
            }
            return false;
            break;
          case 'folder-layout':
          case 'file-layout':
            return false;
            break;
          case 'init':
          case 'get':
          case 'reset':
          case 'pin':
            if(action == 'init') {
              this.setScreenHeight();
            }
            if((action == 'init' || action == 'get') && (this.pageDataInfo == pageInfo.threadsPage || this.pageDataInfo == pageInfo.searchPage) && !this.collabticFixes) {
              console.log('in search filter');
              let ftimeout:any = 100;
              this.updateThumbLayout(ftimeout);
            }
            this.scrollTop = 0;
            let id = (this.thumbView) ? 'thread-data-container' : 'matrixTable';
            setTimeout(() => {
              this.scrollToElem(id);
            }, 100);
            break;
          case 'search':
            if(!this.collabticFixes) {
              this.updateThumbLayout();
            }
            break;
        }
        this.priorityIndexValue = "1";
        this.threadIdArrayInfo = [];
        if (this.threadsAPIcall) {
          this.threadsAPIcall.unsubscribe();
          this.loadingthread = true;
        }

        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        console.log(setdata)
        filterrecords = setdata.filterrecords;

        if (this.pageDataInfo == this.searchPage && (setdata.reset == false || setdata.reset == true) ) {
          this.setTWidthDuplicateFlag = false;
          localStorage.setItem("searchPageFilter", JSON.stringify(r));
        }

        let filterData;
        let threadSortType = this.threadSortType;
        let threadOrderType = this.threadOrderByType;

        let searchValue = this.searchValue;
        if (searchValue && (searchValue != undefined || searchValue != "undefined" || searchValue != null)) {
          searchValue = this.searchValue;
        } else {
          searchValue = "";
        }
        let actionload = setdata.action;

        if (setdata.sortOrderBy) {
          actionload = "get";
          if (setdata.type) {
            threadSortType = setdata.type;
          } else {
            let threadSortFilter = localStorage.getItem("threadSortFilter");
            if (
              threadSortFilter &&
              threadSortFilter != null &&
              threadSortFilter != "undefined" &&
              threadSortFilter != "null"
            ) {
              let sortOpt = JSON.parse(threadSortFilter);
              if (sortOpt) {
                if (sortOpt.code) {
                  threadSortType = sortOpt.code;
                }
              }
            }
          }

          if (setdata.orderBy) {
            actionload = "get";
            threadOrderType = setdata.orderBy;
          } else {
            let threadOrderFilter = localStorage.getItem("threadOrderFilter");

            if (
              threadOrderFilter &&
              threadOrderFilter != null &&
              threadOrderFilter != "undefined" &&
              threadOrderFilter != "null"
            ) {
              let orderOpt = JSON.parse(threadOrderFilter);
              if (orderOpt) {
                if (orderOpt.code) {
                  threadOrderType = orderOpt.code;
                }
              }
            }
          }

          filterData = localStorage.getItem("threadFilter");
        } else {
          let threadSortFilter = localStorage.getItem("threadSortFilter");
          if (
            threadSortFilter &&
            threadSortFilter != null &&
            threadSortFilter != "undefined" &&
            threadSortFilter != "null"
          ) {
            let sortOpt = JSON.parse(threadSortFilter);
            if (sortOpt) {
              if (sortOpt.code) {
                threadSortType = sortOpt.code;
              }
            }
          }
          let threadOrderFilter = localStorage.getItem("threadOrderFilter");

          if (
            threadOrderFilter &&
            threadOrderFilter != null &&
            threadOrderFilter != "undefined" &&
            threadOrderFilter != "null"
          ) {
            let orderOpt = JSON.parse(threadOrderFilter);
            if (orderOpt) {
              if (orderOpt.code) {
                threadOrderType = orderOpt.code;
              }
            }
          }

          console.log(localStorage.getItem("threadFilter"));
          if (filterData == true) {
            filterData = JSON.stringify(r);
          } else {
            if (this.pageDataInfo == this.searchPage) {
              filterData = localStorage.getItem("threadFilter");
            } else {
              filterData = JSON.stringify(r);
            }
          }

          console.log(filterData);
        }
        //console.log(setdata+'--'+this.pageDataInfo);
          console.log(setdata.threadViewType);
          if(setdata.feedbackStatus)
          {
            this.feedbackStatus= setdata.feedbackStatus;
          }

        if(setdata.threadViewType == 'list' ){
          this.thumbView = false;
        }
        this.threadFilterOptions = setdata;
        if (this.pageDataInfo == this.pageInfo || this.pageDataInfo == this.searchPage) {
          if (actionload == "get") {
          }

          var data_prod_values = JSON.stringify(this.workstreamFilterArr);
          this.ItemArray = [];
          this.ItemArray.push({
            groups: data_prod_values,
            likespins: [],
            make_models: [],
            rankby: [],
            Fixstatus: [],
          });
          this.itemOffset = 0;
          this.optionFilter = JSON.stringify(this.ItemArray);
          if (setdata.sortOrderBy) {
          } else {
            localStorage.setItem("threadFilter", filterData);
          }

          if (this.pageDataInfo == this.searchPage) {
            filterData = localStorage.getItem("searchPageFilter");
          }

          console.log(this.pageDataInfo, filterData,setdata.filterrecords)
          if(this.pageDataInfo == this.searchPage) {
            this.threadSubTypeDataArr = [];
            this.threadSubType = [];
          }
          if((this.CBADomain || this.collabticDomain) && this.pageDataInfo!= this.searchPage){
            let threadsPageSubType = localStorage.getItem("threadsPageSubTypeData") != null ? JSON.parse(localStorage.getItem("threadsPageSubTypeData")) : '';
            let fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
            let workstreamArr = (fthreadFilter) ? fthreadFilter.workstream : [];
            workstreamArr = (workstreamArr) ? workstreamArr : [];
            if(workstreamArr.length>0 && threadsPageSubType!= ''){
              for(let wsa of workstreamArr){
                for(let tsub of threadsPageSubType){
                  if(wsa == tsub.workstreamId){
                    console.log(wsa,tsub.workstreamId);
                    console.log(tsub.threadSubTypeData);
                    if(tsub.threadSubTypeData != ''){
                      this.getThreadSubTypeData(tsub.threadSubTypeData);
                    }
                  }
                }
              }
            }
            if(workstreamArr.length == 0 && threadsPageSubType!= ''){
              //for(let wsa of workstreamArr){
                for(let tsub of threadsPageSubType){
                  //if(wsa == tsub.workstreamId){
                    //console.log(wsa,tsub.workstreamId);
                    console.log(tsub.threadSubTypeData);
                    if(tsub.threadSubTypeData != ''){
                      this.getThreadSubTypeData(tsub.threadSubTypeData);
                    }
                  //}
                }
              //}
            }
          }
          let apiInfo = {
            apiKey: Constant.ApiKey,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId,
            escalationType: 1,
            limit: this.itemLimit,
            offset: this.itemOffset,
            type: threadSortType,
            orderBy: threadOrderType,
            optionFilter: this.optionFilter,
            filterOptions: filterData,
            feedbackStatus:this.feedbackStatus,
            searchText: searchValue,
            filterrecords: setdata.filterrecords,
          };
          this.threadListArray = [];
          this.threadListArrayNew = [];
          this.apiData = apiInfo;
          this.loadingthread = true;
          this.loadThreadsPage(false,'',false,action);
          setTimeout(() => {
            if (this.top != undefined) {
              this.top.nativeElement.scroll({
                top: 0,
                left: 0,
                behavior: "auto",
              });
              setTimeout(() => {
                if (this.listDiv != undefined  && !this.thumbView) {
                  /*let listWidth1 = this.listDiv.nativeElement.clientWidth;
                  let listWidth2 = document.getElementsByClassName("mat-table")[0].clientWidth;
                  this.listWidth = listWidth1 > listWidth2 ? listWidth1 : listWidth1;
                  $(".mat-inner-container").css("width", this.listWidth);
                  console.log(this.listWidth);*/
                }
              }, 1000);
            }
            this.callback.emit(this);
          }, 1000);
          this.onInitload = true;
        }
      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutChangeReceivedSubject.subscribe((r) => {

        setTimeout(() => {
          if (this.listDiv != undefined  && !this.thumbView) {
            let listWidth1 = this.listDiv.nativeElement.clientWidth;
            let listWidth2 = (document.getElementsByClassName("mat-table")) ? document.getElementsByClassName("mat-table")[0].clientWidth : 0;
            this.listWidth = listWidth1 > listWidth2 ? listWidth1 : listWidth1;
            $(".mat-inner-container").css("width", this.listWidth);
            console.log(this.listWidth);
          }
        }, 1000);
        setTimeout(() => {
          var elmnt = document.getElementById("thread-data-container");
          let itemLimitwidth = (elmnt == null) ? 0 : elmnt.offsetWidth;
          this.setTWidth = itemLimitwidth;
        }, 600);
        console.error("-----------547-----------");
        console.error("_OnLayoutChangeReceivedSubject");
        if(!this.collabticFixes && (this.pageDataInfo == pageInfo.threadsPage || this.pageDataInfo == pageInfo.searchPage)) {
          //console.log('in layout')
          if(this.thumbView) {
            //console.log('in thumb')
            let ftimeout: any = 750;
            this.updateThumbLayout(ftimeout);
          }
        }
      })
    );

    this.subscription.add(
      this.sharedSvc._OnWorkstreamMessageReceivedSubject.subscribe((r) => {
        console.log(JSON.stringify(r));
        if (this.threadsAPIcall) {
          this.threadsAPIcall.unsubscribe();
          this.loadingthread = true;
        }
        this.priorityIndexValue = "1";
        this.threadIdArrayInfo = [];
        this.itemLength = 0;
        console.error("_OnWorkstreamMessageReceivedSubject");
        console.error("-----------562-----------");
        var setdata = JSON.parse(JSON.stringify(r));
        console.log(setdata);
        this.threadSubTypeDataArr = [];
        this.threadSubType = [];
        if(this.CBADomain || this.collabticDomain){
          if(parseInt(setdata.contentType[0].contentTypeId) == 2){
            console.log(setdata.contentType[0].threadSubTypeData);
            if(setdata.contentType[0].threadSubTypeData != undefined){
              console.log(setdata.contentType[0].threadSubTypeData);
              if(setdata.contentType[0].threadSubTypeData.length>0){
                console.log(setdata.contentType[0].threadSubTypeData);
                this.getThreadSubTypeData(setdata.contentType[0].threadSubTypeData);
              }
              console.log(this.threadSubTypeDataArr);
              console.log(this.threadSubType);
            }
          }
          let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;


          if(r['threadViewType'] != undefined && r['threadViewType'] != 'undefined') {
            if (this.threadSubTypeDataArr.length>0) {
              this.rmHeight = 277;
              this.rmHeight =  this.rmHeight + headerHeight;
            }
            else{
              this.rmHeight = 227;
              this.rmHeight =  this.rmHeight + headerHeight;
            }
          }
        }
        let pageInfo = setdata.pageInfo;
        pageInfo = (pageInfo == null || pageInfo == undefined || pageInfo == 'undefined') ? this.pageInfo : pageInfo;
        console.log(r, setdata, this.pageDataInfo, pageInfo)
        setTimeout(() => {
          this.scrollTop = 0;
          let id = (this.thumbView) ? 'thread-data-container' : 'matrixTable';
          this.scrollToElem(id);
        }, 1000);
        //if (this.pageDataInfo != pageInfo) {
          this.loadingthread = true;
          if (setdata.id) {
            // $('.masonry-item').html('');
			      if(this.thumbView){
              console.log('layout 8');
             this.masonry.reloadItems();
              this.masonry.layout();
            }
            this.workstreamFilterArr = [];
            this.workstreamFilterArr.push(setdata.id);
          }
          if (this.workstreamFilterArr) {
            var data_prod_values = JSON.stringify(this.workstreamFilterArr);
            this.ItemArray = [];
            this.ItemArray.push({
              groups: data_prod_values,
              likespins: [],
              make_models: [],
              rankby: [],
              Fixstatus: [],
            });
            this.itemOffset = 0;
            this.optionFilter = JSON.stringify(this.ItemArray);
            let apiInfo = {
              apiKey: Constant.ApiKey,
              userId: this.userId,
              domainId: this.domainId,
              countryId: this.countryId,
              escalationType: 1,
              limit: this.itemLimit,
              offset: this.itemOffset,
              type: this.threadSortType,
              optionFilter: this.optionFilter,
              orderBy: this.threadOrderByType,
              feedbackStatus:this.feedbackStatus,
              filterrecords: setdata.filterrecords
            };

            this.apiData = apiInfo;

            if (setdata.newthreadpush == true) {
              this.loadThreadsPage(true);
             // this.dbrecordchange(true);
            } else {
              this.threadListArray = [];
              this.threadListArrayNew = [];
              this.loadingthread = true;
              if(this.threadsAPIcall){
                this.threadsAPIcall.unsubscribe();
              }
              if(this.pageDataInfo == pageInfo.workstreamPage || this.pageDataInfo == this.searchPage) {
                let platformIdInfo = localStorage.getItem('platformId');

                if(this.apiUrl.enableAccessLevel){
                  setTimeout(() => {
                    if(!this.accessLevel.view){
                      this.rmHeight = 160;
                      this.threadSubTypeDataArr = [];
                      this.threadSubType = [];
                      this.loadingthread = false;
                      this.displayNoRecords = true;
                      this.displayNoRecordsDefault = false;
                      this.displayNoRecordsShow = 5;
                      this.loadingthread = false;
                      this.centerloading = false;
                      this.loadingthreadmore = false;
                      return false;
                    }
                    else{
                      this.loadThreadsPage();
                    }
                  }, 500);

                }
                else{
                  this.loadThreadsPage();
                }

              }
              else{
                this.loadThreadsPage();
              }
              this.pageLoading = true;
              setTimeout(() => {
                this.pageLoading = false;
              }, 250);

              let listView = localStorage.getItem("threadViewType");
              this.thumbView = (listView && listView == "thumb") ? true : false;
              //this.dbrecordchange('');

             // this.fromfirebaseData=0;
             // this.loadThreadsPage();
              setTimeout(() => {
                /* if (this.top != undefined) {
                  this.top.nativeElement.scroll({
                    top: 0,
                    left: 0,
                    behavior: "auto",
                  });
                } */
              }, 100);
            }
          }
        /* } else {
          return false;
        } */
      })
    );

    this.subscription.add(
      this.sharedSvc.searchApiCallSubject.subscribe((data) => {

        console.log(data);
        let access = data['access'];
        this.scrollTop = 0;
        let id = (this.thumbView) ? 'thread-data-container' : 'matrixTable';
        this.scrollToElem(id);
        switch(access) {
          case 'threads':
          case 'threads-ws':
            this.searchValue = data['searchVal'];
            this.threadIdArrayInfo = [];
            //this.threadSubTypeDataArr = [];
            //this.threadSubType = [];
            this.threadListArray = [];
            this.threadListArrayNew = [];
            this.itemLength = 0;
            this.itemOffset = 0;
            this.loadingthread = true;
            this.threadsAPIcall.unsubscribe();
            this.loadThreadsPage(false,'',false,'search');
            break;
        }
      })
    );
    this.subscription.add(
    this.sharedSvc.emitOnThreadsPageLoadingSymbolSubject.subscribe((r) => {
      if(r['flag']){
        this.loadingthread = false;
        this.currentContentTypeId = r['currentContentTypeId'];
      }
    })
  );
  this.subscription.add(
    this.sharedSvc.emitOnCloseSearchCallSubject.subscribe((r) => {
      console.log('layout 9');
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
      setTimeout(() => {
          this.updateMasonryLayout = false;
          },1500);
    })
  );
    this.subscription.add(
      (this.sharedSvc.searchInfoDataReceivedSubject.subscribe(
        (r) => {
          if(this.apiUrl.searchPageRedirectFlag == "1"){
            this.apiUrl.searchPageRedirectFlag = "2";
            let navPage = r['navPage'];
            let scrollTop:any = this.scrollTop;
            let tArray = JSON.stringify(this.threadListArray);
            this.threadPageListArray = this.threadListArray;
            this.sharedSvc.setSearchPageLocalStorageNew(navPage, scrollTop, this.itemOffset, tArray);
          }
        })
      )
    );

    this.getnorows();
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;

   // this.firebaseAuthcreds=this.authenticationService.fbDataValue;
    console.log(this.firebaseAuthcreds);
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.checkAccessLevel();
    if (this.teamSystem && this.pageDataInfo == this.pageInfo) {
      this.getlandingpagewidgets();
      this.getHeadMenuLists();
    }

    let defaultWorkstream = localStorage.getItem("defaultWorkstream");
    let rmMidHeight, rmListHeight;
    if (this.teamSystem) {
      rmMidHeight = 20;
      rmListHeight = 25;
      //this.midHeight = windowHeight.height - rmMidHeight;
      this.midHeight = 210;
		  this.listHeight = windowHeight.height - rmListHeight;
        if(this.msTeamAccessMobile){
          rmMidHeight = 10;
          rmListHeight = 15;
          //this.midHeight = windowHeight.height + rmMidHeight;
          this.midHeight = 210;
          this.listHeight = windowHeight.height + rmListHeight;
        }
    }
    let landingpageworkstream = localStorage.getItem("landing-page-workstream");
    if (this.tapfromheader && this.tapfromheader != undefined) {
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(this.tapfromheader.id);
    } else if (landingpageworkstream) {
      this.navFromWs = true;
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(landingpageworkstream);
      setTimeout(() => {
        localStorage.removeItem("landing-page-workstream")
        this.navFromWs = false;
      }, 1500);
    } else if (defaultWorkstream) {
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(defaultWorkstream);
    }
    if (this.workstreamFilterArr) {
      var data_prod_values = JSON.stringify(this.workstreamFilterArr);
      this.ItemArray = [];
      this.ItemArray.push({
        groups: data_prod_values,
        likespins: [],
        make_models: [],
        rankby: [],
        Fixstatus: [],
      });
    }

    this.optionFilter = JSON.stringify(this.ItemArray);
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      escalationType: 1,
      limit: this.itemLimit,
      offset: this.itemOffset,
      type: this.threadSortType,
      optionFilter: this.optionFilter,
      orderBy: this.threadOrderByType,
    };
    this.apiData = apiInfo;

    if (this.pageDataInfo == pageInfo.workstreamPage || this.fromOthersTab) {
      this.loadingthread = true;
      this.loadedthreadAPI = true;
      this.threadSubTypeDataArr = [];
      this.threadSubType = [];
      if(this.CBADomain || this.collabticDomain){
        if((this.CBADomain || this.collabticDomain) && this.pageDataInfo!= this.searchPage){
          setTimeout(() => {
            let threadsPageSubType = localStorage.getItem("threadSubTypeData") != null ? JSON.parse(localStorage.getItem("threadSubTypeData")) : '';

            if(threadsPageSubType != '' )
            {
              this.getThreadSubTypeData(threadsPageSubType);
            }
          }, 1000);
        }
        setTimeout(() => {
          let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
          if(this.pageDataInfo == pageInfo.workstreamPage) {
            this.accessLazyLoad = RedirectionPage.Workstream;
            if(this.threadSubTypeDataArr.length>1){
              this.rmHeight = 232;
              this.rmHeight =  this.rmHeight + headerHeight;
            }
            else{
              this.rmHeight = 182;
              this.rmHeight =  this.rmHeight + headerHeight;
            }
          }
          this.loadThreadsPage();
        }, 1000);
      }
      else{
        this.loadThreadsPage();
      }
    }

    this.proposedFixTxt = threadBulbStatusText.proposedFix;
    this.threadwithFixTxt = threadBulbStatusText.threadwithFix;
    this.shareFixTxt = threadBulbStatusText.shareFix;
    this.shareSummitFixTxt = threadBulbStatusText.summitFix;
    this.threadwithHelpfulFixTxt = threadBulbStatusText.threadwithHelpfulFix;
    this.threadwithNotFixTxt = threadBulbStatusText.threadwithNotFix;
    this.threadCloseTxtTxt = threadBulbStatusText.threadCloseTxt;
    setTimeout(() => {
      this.setScreenHeight();
    }, 100);
    setTimeout(() => {
      this.threadApprovalRef.emit(this);
    }, 2500);
  }


  @HostListener('document:visibilitychange', ['$event'])

  visibilitychange() {
    console.log('PushCheck');
    let type1=1;
    navigator.serviceWorker.addEventListener('message', (event) => {
     // type1=type1+1;
      if(type1==1)
      {
        console.log(event.data.data);
        let threadData=event.data.data;
       /*let currUrl = this.router.url.split('/');
        let access = currUrl[1];
        */
        threadData.access = 'threads';
        threadData.pushAction = 'load';
        let dataInfoId=threadData.threadId;


        threadData.dataInfoId=dataInfoId;
        let pushType = threadData.pushType;
        let infoIndex = PushTypes.findIndex(option => option.id == pushType);
        threadData['pageInfo'] = '2';
       // this.sharedSvc.emitMessageReceived(threadData);
       this.itemOffset=0;
       if(this.pushThreadArrayNotification.length==0 && pushType==1)
{
       //this.loadThreadsPage();
       this.sharedSvc.emitMessageReceived(threadData);
}
else
{
  if(threadData.threadId)
          {
            let currUrl = this.router.url.split('/');
            let navFrom1 = currUrl[1];
            let navFrom2:any = currUrl[2];
            if((navFrom2!='view-v2' || navFrom2!='view-v3') && navFrom2!='view' && (navFrom1=='threads' || navFrom1=='workstreams-page'))
            {
              if(this.pushThreadArrayNotification.length==0)
{
              console.log('thread call 3');
              if(pushType!=46 && pushType!=47)
              {
                this.callThreadDetail(threadData.threadId);
              }

}
            }
          }
}
if(threadData.threadId)
{
  this.pushThreadArrayNotification.push(threadData.threadId)
}

      }
      setTimeout(() => {
        this.pushThreadArrayNotification=[];
      }, 100);
      return false;
    });
  }


  ChatUCode(t) {
    var S = "";
    for (let a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S +=
          "\\u" +
          ("0000" + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    console.log(S);
    return S;
  }

  convertunicode(val) {
    val = val.replace(/\\n/g, "");
    if (val == undefined || val == null) {
      return val;
    }
    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {
      JSON.stringify(val);
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
      return JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"');
    } else {
      return val;
    }
  }

  getHeadMenuLists() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);

    this.getMenuListingApi.getMenuLists(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let menuListloaded = response.sideMenu;

        for (let menu of menuListloaded) {
          let urlpathreplace = menu.urlPath;

          let urlActivePathreplace = menu.urlActivePath;
          let submenuimageClass = menu.submenuimageClass;
          let urlpth = "";
          let urlActivePath = "";

          urlpth = urlpathreplace.replace(".png", ".svg");
          urlActivePath = urlActivePathreplace.replace(".png", ".svg");

          this.menuListloaded.push({
            id: menu.id,
            disableContentType: menu.disableContentType,
            slug: menu.slug,
            contentTypeId: menu.contentTypeId,
            name: menu.name,
            urlPath: urlpth,
            urlActivePath: urlActivePath,
            submenuimageClass: submenuimageClass,
          });
        }

        localStorage.setItem(
          "sideMenuValues",
          JSON.stringify(this.menuListloaded)
        );
        // console.log(this.menuListloaded);
      }
    });
  }


  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true, replyAccess = true, closeAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(2, chkType, chkFlag);
      setTimeout(() => {
        let accessLevels = this.authenticationService.checkAccessItems;
        if(accessLevels.length > 0) {
          let reportAccess = accessLevels[0].pageAccess;
          reportAccess.forEach(item => {
            let accessId = parseInt(item.id);
            let roles = item.roles;
            let roleIndex = roles.findIndex(option => option.id == this.roleId);
            let roleAccess = roles[roleIndex].access;
            console.log(accessId, roleAccess)
            switch (accessId) {
              case 1:
                viewAccess = (roleAccess == 1) ? true : false;
                break;
              case 2:
                createAccess = (roleAccess == 1) ? true : false;
                break;
              case 3:
                editAccess = (roleAccess == 1) ? true : false;
                break;
              case 4:
                deleteAccess = (roleAccess == 1) ? true : false;
                break;
              case 5:
                replyAccess = (roleAccess == 1) ? true : false;
                break;
              case 6:
                closeAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });

        }
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess, reply: replyAccess, close: closeAccess};

        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        else{
          this.accessLevel = this.accessLevel;
        }
        console.log(this.accessLevel)

      }, 500);
  }


  getlandingpagewidgets() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);

    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe(
      (response) => {
        let rstatus = response.status;
        let rtotal = response.total;
        if (rstatus == "Success") {
          if (rtotal > 0) {
            let rlandingPage = {
              componentName: "RecentSearchesWidgetsComponent",
              id: "4",
              imageClass: "recentsearch-land-icon",
              name: "Search History",
              placeholder: "Search History",
              shortName: "search-widget",
            };
            const rcomponentName = rlandingPage.componentName;
            const rplaceholder = rlandingPage.placeholder;
            const rwid = rlandingPage.id;

            localStorage.setItem(
              "landingpage_attr" + rwid + "",
              JSON.stringify(rlandingPage)
            );

            this.loadingelanding = false;
          } else {
            this.loadingelanding = false;
          }
        } else {
          this.loadingelanding = false;
        }
      }
    );
  }

  getnorows() {
    let x = 200;
    let xy = 248;
    var elmnt = document.getElementById("thread-data-container");
    let itemLimitwidth = elmnt.offsetWidth / xy;
    //let itemLimitwidth = window.innerWidth / xy;
    let totalrows = Math.trunc(itemLimitwidth);
    let itemLimit1 = window.innerHeight / x;
    let totalCols = Math.trunc(itemLimit1);

    this.itemwidthLimit = totalrows * totalCols;
    ///alert(this.itemwidthLimit);
    console.log(this.itemwidthLimit + "-itemWidth");
    console.log(totalrows + "-totalrows--"+totalCols);

    if (totalrows > 3) {
      var newrows = 2;
      this.itemLimit = newrows * totalCols;
      if (this.itemLimit <= 9) {
        /* if(this.domainId=='97')
        {
          this.itemLimit = 12;
        }
        else
        {
          this.itemLimit = 20;
        } */
        this.itemLimit = 12;
      }
    } else {
      this.itemLimit = totalrows * totalCols;
      if (this.itemLimit <= 9) {
        /* if(this.domainId=='97')
        {
          this.itemLimit = 12;
        }
        else
        {
          this.itemLimit = 20;
        } */
        this.itemLimit = 12;
      }
    }
  }
  onDrop(ev) {}
  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.scroll(event);
  }


  dbrecordchange(push)
  {

    if(!this.firebaseAuthcreds)
    {
      this.afAuth.signInWithEmailAndPassword(firebaseCredentials.emailAddress, firebaseCredentials.password).then((userValue) => {
        this.firebaseAuthcreds= userValue.user.uid;
        console.log(this.firebaseAuthcreds);

        this.loadThreadsPageFire('');

       });
    }
    else
    {
      this.loadThreadsPageFire('');
    }

  }



  loadThreadsPageFire(wid) {
  }
  noStore(){
    this.threadListArray = [];
    this.itemLength = 0;
    this.itemOffset = 0;
    this.itemTotal = 0;
    this.displayNoRecords = true;
    this.displayNoRecordsDefault = false;
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    },10);
    this.displayNoRecordsShow = 4;
    this.loadingthread = false;
    this.centerloading = false;
    this.loadingthreadmore = false;
    this.contentTypeValue = ContentTypeValues.Threads;
  }

  loadThreadsPageSolr(searchValue,threadListing,push=false,listFlag=false,actionFilter='') {
   // console.log(this.apiData, threadListing, push, listFlag, actionFilter)
    let apiCallTimeout = 0;
    let searchparamsjson = '';
    let filterCount = 0;
    if(this.CBADomain){
      let searchParams = '';
      var searchQSVal = localStorage.getItem('searchQSVal') != null && localStorage.getItem('searchQSVal') != undefined ? localStorage.getItem('searchQSVal') : '' ;
      if(searchValue == searchQSVal){
        searchParams = localStorage.getItem('searchparamQSVal') != null && localStorage.getItem('searchparamQSVal') != undefined ? localStorage.getItem('searchparamQSVal') : '' ;
      }
      console.log(searchParams);
      this.searchParams = searchParams;
    }
    if(listFlag) {
      this.searchParams = this.apiData["filterOptions"];
    }
    if(this.pageDataInfo == this.searchPage) {
      this.searchParams = this.apiData["filterOptions"];
      this.searchParams = (this.searchParams == null || this.searchParams == undefined  || this.searchParams == 'undefined') ? localStorage.getItem(filterNames.search) : this.searchParams;
    }

    if(this.searchParams && this.searchParams != ''){
      searchparamsjson =  ((JSON.parse(this.searchParams)));
    }

      let FiltersArr={};
      //FiltersArr["domainId"]=this.domainId;
      let subscriber=localStorage.getItem('subscriber');
      if(!this.subscriberDomain)
      {
      FiltersArr["domainId"]=this.domainId;
      }
      else
      {
        let domainArr=[];
        let domainVal=this.domainId.toString();
        domainArr.push(domainVal);
        FiltersArr["sharedDomainsStrArr"]=domainArr;
      }


      if(this.threadSubType && this.threadSubType.length>0)
      {
        FiltersArr["threadCategoryStr"]=this.threadSubType;
      }
      if(this.pageDataInfo == this.searchPage && (this.collabticDomain || this.CBADomain || this.tvsFlag))
      {
        if(this.collabticDomain || this.CBADomain)
        {
          FiltersArr["approvalProcess"] = ["0","1"];
        }

        let wsArr = [];
        let landingWorkstream = localStorage.getItem('workstreamItem');
        console.log(this.approvalEnableDomainFlag, landingWorkstream)
        wsArr.push(landingWorkstream);
        console.log(wsArr)
        this.workstreamFilterArr = wsArr;
        FiltersArr["workstreamsIds"] = (threadListing == 1) ? this.workstreamFilterArr : wsArr;
      }
      if(this.pageDataInfo==pageInfo.workstreamPage && (threadListing == 1 || this.apiUrl.searchFromWorkstream) && (this.collabticDomain || this.CBADomain || this.tvsFlag))
      {
        let wsArr = [];
        let landingWorkstream = localStorage.getItem('workstreamItem');
        console.log(this.approvalEnableDomainFlag, landingWorkstream)
        wsArr.push(landingWorkstream);
        console.log(wsArr)
        this.workstreamFilterArr = wsArr;
        FiltersArr["workstreamsIds"] = (threadListing == 1) ? this.workstreamFilterArr : wsArr;
        if(this.approvalEnableDomainFlag) {
          FiltersArr["approvalProcess"] = ["0","1"];
        }
      }
      else if(this.pageDataInfo==pageInfo.threadsPage && threadListing==1 && this.solrApi) {

        if(this.approvalEnableDomainFlag) {
          FiltersArr["approvalProcess"] = ["0","1"];
        }
        console.log(this.pageDataInfo, this.searchPage, pageInfo.threadsPage)
        if(!this.navFromWs) {
          let userWorkstreams=localStorage.getItem('userWorkstreams');
          if(userWorkstreams) {
            this.workstreamFilterArr=JSON.parse(userWorkstreams);
          }
        }
        let chkFilter = Object.keys(searchparamsjson);
        let wsFlag = false;
        if(chkFilter.length > 0) {
          console.log(chkFilter)
          //filterCount
          chkFilter.forEach(key => {
            if(key == 'workstream') {
              wsFlag = true;
            }
          });
        }
        if(listFlag && !this.navFromWs && wsFlag) {
          FiltersArr["workstreamsIds"] = (searchparamsjson['workstream'].length == 0) ? this.workstreamFilterArr : searchparamsjson['workstream'];
        } else {
          FiltersArr["workstreamsIds"] = this.workstreamFilterArr;
        }
        //FiltersArr["workstreamsIds"] = this.workstreamFilterArr;
      }
      if(this.pageDataInfo == this.searchPage) {
        let userWorkstreams=localStorage.getItem('userWorkstreams');
        if(userWorkstreams) {
         // this.workstreamFilterArr=JSON.parse(userWorkstreams);
          FiltersArr["workstreamsIds"] = JSON.parse(userWorkstreams);
        }
      }
      console.log(searchparamsjson)
      if(searchparamsjson && searchparamsjson['make'] && searchparamsjson['make']!='')
      {
        let makeVal = searchparamsjson['make'];
        if(listFlag) {
          makeVal = Array.isArray(makeVal) ? makeVal[0] : makeVal;
        }
        FiltersArr["make"]= makeVal;
      }
      if(searchparamsjson && searchparamsjson['model'] && searchparamsjson['model']!='')
      {
        FiltersArr["model"]=searchparamsjson['model'];
      }
      if(searchparamsjson && searchparamsjson['year'] && searchparamsjson['year']!='')
      {
        FiltersArr["year"]=searchparamsjson['year'];
      }
      if(searchparamsjson && searchparamsjson['vinNo'] && searchparamsjson['vinNo']!='')
      {
        FiltersArr["vinNo"]=searchparamsjson['vinNo'];
      }
      if(searchparamsjson && searchparamsjson['currentDtc'] && searchparamsjson['currentDtc']!='')
      {
        FiltersArr["currentDtc"]=searchparamsjson['currentDtc'];
      }
      if(searchparamsjson && searchparamsjson['errorCode'] && searchparamsjson['errorCode']!='')
      {
        FiltersArr["currentDtcStrArr"]=searchparamsjson['errorCode'];
      }
      let feedbackStatus=this.apiData["feedbackStatus"];
  if(feedbackStatus && feedbackStatus!='all')
      {
      //objData["sortField"]='user';
    //  objData["userId"]=this.userId;
      FiltersArr["feedbackStatusInt"]=feedbackStatus;
      }
      var objData = {};
      if(searchparamsjson && searchparamsjson['keyword'] && searchparamsjson['keyword']!='')
      {
        objData["query"]=searchparamsjson['keyword'];
      }
      else
      {
        objData["query"]=searchValue;
      }
     if(push && this.loadThreadId == 0)
     {
      objData["rows"]=1;
      objData["start"]=0;
      this.loadThreadsPage(push,1,true);
      return;
     }
     else
     {
      if(this.visibilityChangeLimit==5)
      {
        objData["rows"]=this.visibilityChangeLimit;
        objData["start"]=0;
        
      }
      else
      {
        this.visibilityChangeLimit=0;
        objData["rows"]=this.apiData["limit"];
        objData["start"]=this.itemOffset;
      }
     
     }

    // Sorting
    let sortType=this.apiData["type"];
    let sortorderBy=this.apiData["orderBy"];
   // console.log(this.apiData);

    if(threadListing) {
      if(sortType=='sortthread')
      {
      objData["sortField"]='createdOnNew';
      }
      else  if(sortType=='sortbyreply')
      {
      objData["sortField"]='reply';
      }
      else  if(sortType=='ownthread')
      {
      //objData["sortField"]='user';
    //  objData["userId"]=this.userId;
      FiltersArr["userId"]=this.userId;
      }
      else  if(sortType=='escL1')
      {
      //objData["sortField"]='user';
    //  objData["userId"]=this.userId;
      FiltersArr["escalateStatusLand"]='L1';
      }


      else  if(sortType=='escL2')
      {
      //objData["sortField"]='user';
    //  objData["userId"]=this.userId;
      FiltersArr["escalateStatusLand"]='L2';
      }
      else  if(sortType=='escL3')
      {
      //objData["sortField"]='user';
    //  objData["userId"]=this.userId;
      FiltersArr["escalateStatusLand"]='L3';
      }

      else  if(sortType=='mystore')
      {
       let storeNo= localStorage.getItem("storeNo");
       if(storeNo == null || storeNo == undefined){
        this.noStore();
        return false;
       }
      //objData["sortField"]='user';
    //  objData["userId"]=this.userId;
    //myStoreFilter
    if(storeNo)
    {
      FiltersArr["storeNoStr"]=storeNo;
    }

      }
      else  if(sortType=='yourpin')
      {
    //  objData["sortField"]='pins';
      //objData["userId"]=this.userId;
      let arrayPin=[];
      arrayPin.push(this.userId);
      FiltersArr["pinedUsers"]=arrayPin;
      }

      else
      {
      objData["sortField"]='createdOnNew';
      }

      if(sortorderBy){
      objData["sortOrder"]=sortorderBy;
      }
      else
      {
      objData["sortOrder"]='desc';
      }
    }

    if(this.loadThreadId > 0) {
      FiltersArr["workstreamsIds"] = this.workstreamFilterArr;
      FiltersArr["approvalProcess"] = ["0","1"];
      FiltersArr["threadId"] = this.loadThreadId;
      objData["rows"]=1;
      objData["start"]=0;
    }
    objData["type"] = SolrContentTypeValues.Thread;
    objData["listing"] = threadListing;
    objData["filters"] = FiltersArr;

     // let push = false;
   // let data_arr=["domain_id"]
   /* let apiData = {

      "query": searchValue,
      "rows": this.apiData["limit"],
      "start": this.itemOffset,
      "filters": {"domainId":this.apiData["domainId"],"make":},
      "type":1
      //filters: {},

    };*/

if(threadListing && this.itemOffset==0)
{
  let workstreamFilterArr='';
  if(this.workstreamFilterArr)
  {
    workstreamFilterArr=JSON.stringify(this.workstreamFilterArr)
  }
  else
  {
    let userWorkstreams=localStorage.getItem('userWorkstreams');
        if(userWorkstreams)
        {
          workstreamFilterArr=userWorkstreams;
        }
  }

  let apiDatasocial = new FormData();
  apiDatasocial.append('apiKey', Constant.ApiKey);
  apiDatasocial.append('domainId', this.domainId);
  apiDatasocial.append('workstreamIds', workstreamFilterArr);
  apiDatasocial.append('userId', this.userId);
  apiDatasocial.append('contentTypeId', '2');
  let platformIdInfo = localStorage.getItem('platformId');

  this.baseSerivce.postFormData("forum", "resetWorkstreamContentTypeCount", apiDatasocial).subscribe((response: any) => { })
}
let itemOffsetData=this.itemOffset;

    if(threadListing!=1 && this.itemOffset == 0) {
      this.updateSearchKeyword(searchValue);
    }

    console.log(this.apiData["optionFilter"]);
    //setTimeout(() => {
      this.threadsAPIcall = this.LandingpagewidgetsAPI.getSolrDataDetail(
        objData
      ).subscribe((response) => {
        this.loadThreadId = 0;
        console.log(response.response);
        // let solrResponse=response.response;
        // let threadInfototal=solrResponse.numFound;
        let threadInfototal = response.total;
        this.itemTotal = threadInfototal;
        let facets = (response.facets) ? response.facets : '';
        let type = (facets.type) ? facets.type : '';
        if(threadListing!=1) {
          if(this.fromSearchPage) {
            this.searchResultData.emit(facets);
          } else {
            this.searchResultData.emit(type);
          }
        }
        if(threadInfototal == 0) {
          this.loadingthread = false;
          this.displayNoRecordsDefault = false;
          if(this.pageDataInfo==pageInfo.searchPage){
            this.displayNoRecords = true;
            this.displayNoRecordsShow = 1;
          }
          else if(this.pageDataInfo==pageInfo.workstreamPage){
            if(objData["query"]==''){
              this.displayNoRecordsShow = 2;//new button
            }
            else{
              this.displayNoRecordsShow = 1;//no result
            }
            this.displayNoRecords = true;
          }
          else{
            this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;
            this.displayNoRecords = true
          }
          this.loadingthread = false;
          this.centerloading = false;
          this.loadingthreadmore = false;

          if(actionFilter!='init' )
          {
            this.updateMasonryLayout = true;
          }
         //
        } else {
          this.centerloading = false;
          this.loadingthreadmore = false;
          this.displayNoRecords = false;
        }
        let threadInfoData_data = response.threads;
        let pushType = '';
        if(this.visibilityChangeLimit==0)
        {
        this.itemOffset += this.itemLimit;
        }
        let action = 'init';
         
          let initIndex = -1;
        for (let t = 0; t < threadInfoData_data.length; t++) {
          if(threadInfoData_data[t].attachmentCounts==0) {
            threadInfoData_data[t].uploadAttachments=[];
          }
          
          
          //  console.log(threadInfoData_data[t]);
            this.setupThreadData(action, push, threadInfoData_data[t], initIndex, t, pushType,1);
            console.log('checkType 2');
         
         
         
      }
      this.visibilityChangeLimit=0;
      this.lastScrollTop=1;
      this.scrollCallback = true;

      if (
        this.itemOffset < this.itemwidthLimit &&
        threadInfoData_data.length > 0 &&
        threadInfoData_data.length > 9
      ) {
        this.scrollCallback = false;
        setTimeout(() => {
          if(!this.setTWidthDuplicateFlag && this.pageDataInfo == this.searchPage){
            //this.itemOffset = 10;
            this.setTWidthDuplicateFlag =  true;
          }

          this.loadingthreadmore = true;
          let pushVal=false;
          let searchValueCheck='';
          if(searchValue) {
            searchValueCheck=searchValue;
          }
          this.loadThreadsPageSolr(searchValueCheck,threadListing,pushVal);
          this.centerloading = true;
        }, 1000);
      } else {
        this.lastScrollTop=1;
        this.scrollCallback = true;
        this.centerloading = false;
      }
      this.scrollInit = 1;
      this.itemLength += threadInfoData_data.length;
      let thumbLoad = false;
      if(!this.thumbView) {
        if(this.pageDataInfo == pageInfo.threadsPage) {
          thumbLoad = (this.filterOptions.threadThumbInit == 0) ? true : thumbLoad;
        }
        if(this.pageDataInfo == pageInfo.workstreamPage) {
          thumbLoad = (this.tspageInfo.threadThumbInit == 0) ? true : thumbLoad;
        }
        console.log(thumbLoad)
      }
      setTimeout(() => {
        if(this.thumbView || thumbLoad) {
          if(localStorage.getItem('filterReset')=='1')
          {
            actionFilter='get';
            localStorage.removeItem('filterReset');

          }
          actionFilter = (thumbLoad) ? 'get' : actionFilter;

        if(actionFilter!='init' && ( this.pageDataInfo == pageInfo.threadsPage || this.pageDataInfo == pageInfo.workstreamPage || actionFilter=='search' || actionFilter=='sort' ) && itemOffsetData==0) {
          if(actionFilter== '' || actionFilter=='get' || actionFilter=='search' || actionFilter=='subtype') {
            console.log(actionFilter)
            if(!this.collabticFixes && (this.pageDataInfo == pageInfo.workstreamPage && actionFilter=='search') || (actionFilter=='subtype')) {
              let ftimeout = (actionFilter=='subtype') ? 200 : 50;
              this.updateThumbLayout(ftimeout);
            }
          } else {
            if(!this.collabticFixes && actionFilter=='sort') {
              this.updateThumbLayout();
            }
          }
        }
      }
      this.loadingthread = false;
      this.loadingthreadmore = false;
    }, 500);
    });
    this.callback.emit(this);
    setTimeout(() => {
      this.threadSubTypeFilterFlag = false;
    }, 500);
    //}, apiCallTimeout);
  }

  loadThreadsPage(push = false, limit:any = '',newthread=false,actionFilter='') {
    if(this.loadThreadId > 0) {
      return false;
    }
    //console.log(push, this.apiData, this.apiUrl.searchFromWorkstream, this.apiUrl.searchFromWorkstreamValue)
    let searchValue = localStorage.getItem("searchValue");
    console.log(this.apiData["filterrecords"]);
    if (searchValue && (searchValue != undefined || searchValue != "undefined" || searchValue != null)) {
      searchValue = localStorage.getItem("searchValue");
    } else {
      searchValue = "";
    }
    console.log(this.apiData["filterrecords"]);
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    if (push == true) {
      let itemLimit:any = (limit == '') ? 1 : limit;
      apiFormData.append("limit", itemLimit);
      this.apiData["offset"] = 0;
    } else {
      apiFormData.append("limit", this.apiData["limit"]);
      this.apiData["offset"] = this.itemOffset;
    }
    if(this.CBADomain || this.collabticDomain){
      if (this.threadSubType && this.threadSubType.length > 0) {
        apiFormData.append(
          "threadSubType",
          JSON.stringify(this.threadSubType)
        );
      }
    }
    apiFormData.append("offset", this.apiData["offset"]);
    let yourThreadsValue=localStorage.getItem('yourThreadsValue');
    let yourStoreThreadsValue=localStorage.getItem('yourStoreThreadsValue');
    if(yourThreadsValue && this.pageDataInfo == pageInfo.threadsPage) {
      this.apiData["type"] = 'ownthread';
      apiFormData.append("type", this.apiData["type"]);
    }
    else if(yourStoreThreadsValue && this.pageDataInfo == pageInfo.threadsPage) {
      this.apiData["type"] = 'mystore';
      apiFormData.append("type", this.apiData["type"]);
      let storeNo= localStorage.getItem("storeNo");
       if(storeNo == null || storeNo == undefined){
        this.noStore();
        return false;
       }
    }
    else {
      apiFormData.append("type", this.apiData["type"]);
    }

    apiFormData.append("orderBy", this.apiData["orderBy"]);
    apiFormData.append("feedbackStatus", this.apiData["feedbackStatus"]);
    let solrUpdate=0;
    let threadListing=0;
    let listFlag = false;
    if (this.pageDataInfo == this.searchPage && (this.collabticDomain || this.CBADomain || this.tvsFlag)) {
      solrUpdate = 1;
      threadListing = 0;
      this.rmHeight = 200;
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      this.rmHeight =  this.rmHeight + headerHeight;
    } else if((this.pageDataInfo == pageInfo.workstreamPage && this.apiUrl.searchFromWorkstream && (this.collabticDomain || this.CBADomain || this.domainId==82 || this.domainId==52))) {
      solrUpdate = 1;
      threadListing = (this.apiUrl.searchFromWorkstreamValue == '') ? 1 : 0;
      searchValue = this.apiUrl.searchFromWorkstreamValue;
    } else if((this.pageDataInfo == pageInfo.threadsPage || (this.pageDataInfo == pageInfo.workstreamPage && !this.apiUrl.searchFromWorkstream)) && this.solrApi && (this.collabticDomain || this.CBADomain || this.domainId==82 || this.domainId==52)) {
      listFlag = (this.pageDataInfo == pageInfo.threadsPage || this.pageDataInfo == this.searchPage) ? true : false;
      solrUpdate = 1;
      threadListing = 1;
    } else{
      solrUpdate = 0;
      threadListing = 0;
      if(this.pageDataInfo == pageInfo.workstreamPage && this.apiUrl.searchFromWorkstream) {
        searchValue = this.apiUrl.searchFromWorkstreamValue;
      } else {
        searchValue = this.searchValue;
        if(this.pageDataInfo == pageInfo.workstreamPage) {
          let wsArr = [];
          let landingWorkstream = localStorage.getItem('workstreamItem');
          console.log(landingWorkstream)
          wsArr.push(landingWorkstream);
          console.log(wsArr)
          this.workstreamFilterArr = wsArr;
          let checkApi = JSON.parse(this.apiData['optionFilter']);
          let group = JSON.parse(checkApi[0].groups)
          console.log(checkApi[0], group)
          group = (group[0] == undefined || group[0] == 'undefined') ? wsArr : group;
          checkApi[0].groups = JSON.stringify(group);
          console.log(checkApi, group)
          this.apiData['optionFilter'] = JSON.stringify([checkApi[0]]);
          console.log(this.apiData)
        }
      }
      apiFormData.append("searchText", searchValue);
    }

    if (solrUpdate == 1 && !newthread) {
      if(this.pageDataInfo == pageInfo.workstreamPage || this.pageDataInfo == this.searchPage) {
        let platformIdInfo = localStorage.getItem('platformId');
        if(this.apiUrl.enableAccessLevel){
          setTimeout(() => {
            if(!this.accessLevel.view){
              this.rmHeight = 160;
              this.threadSubTypeDataArr = [];
              this.threadSubType = [];
              this.loadingthread = false;
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = false;
              this.displayNoRecordsShow = 5;
              this.loadingthread = false;
              this.centerloading = false;
              this.loadingthreadmore = false;
              return false;
            }
            else{
              this.loadThreadsPageSolr(searchValue,threadListing,push,listFlag,actionFilter);
            }
          }, 500);

        }
        else{
          this.loadThreadsPageSolr(searchValue,threadListing,push,listFlag,actionFilter);
        }
      }
      else{
        this.loadThreadsPageSolr(searchValue,threadListing,push,listFlag,actionFilter);
      }


      return;
    }
    else {
      if (searchValue && this.pageDataInfo == this.searchPage) {
        apiFormData.append("searchText", searchValue);
        if (this.threadIdArrayInfo && this.threadIdArrayInfo.length > 0) {
          apiFormData.append(
            "threadIdArray",
            JSON.stringify(this.threadIdArrayInfo)
          );
        }
        if (this.priorityIndexValue) {
          apiFormData.append("priorityIndex", this.priorityIndexValue);
        } else {
          apiFormData.append("priorityIndex", "1");
        }
      }

      apiFormData.append("platform", "3");
      console.log(this.pageDataInfo)

      if (this.pageDataInfo == pageInfo.workstreamPage) {
        apiFormData.append("optionFilter", this.apiData["optionFilter"]);
      }

      let pushType = '';
      if (push == true && this.pageDataInfo != pageInfo.workstreamPage) {
        apiFormData.append("filterOptions", localStorage.getItem("threadFilter"));
      } else if (this.apiData["filterOptions"]) {
        let apiFilterOptions = JSON.parse(this.apiData["filterOptions"]);
        console.timeLog(apiFilterOptions, apiFilterOptions.loadAction)
        let loadAction = apiFilterOptions.loadAction;
        pushType = (loadAction != undefined || loadAction != "undefined" || loadAction != null) ? loadAction : pushType;
        console.log(loadAction, pushType)
        apiFormData.append("filterOptions", this.apiData["filterOptions"]);
      } else {
        if (localStorage.getItem("searchPageFilter") && this.fromSearchPage) {
          apiFormData.append(
            "filterOptions",
            localStorage.getItem("searchPageFilter")
          );
        } else if(this.pageDataInfo != pageInfo.workstreamPage) {
          let filterItem = localStorage.getItem("threadFilter");
          apiFormData.append("filterOptions", localStorage.getItem("threadFilter"));
        }
      }

      this.threadsAPIcall = this.LandingpagewidgetsAPI.threadspageAPI(
        apiFormData
      ).subscribe((response) => {

        if(this.fromfirebaseData) {
          return false;
        }
        let rstatus = response.status;
        let rtdata = response.data;
        let threadInfototal = rtdata.total;
        let rresult = response.result;
        let newThreadInfoText = response.newInfoText;
        this.newThreadInfo = newThreadInfoText != undefined ? newThreadInfoText : this.newThreadInfo;
        this.redirectionPage = RedirectionPage.Threads;
        this.pageTitleText = (this.industryType.id == 3 && this.domainId == 97) ? `${ManageTitle.feedback}s` : PageTitleText.Threads;
        this.contentTypeValue = ContentTypeValues.Threads;
        this.contentTypeDefaultNewImg = DefaultNewImages.Threads;
        this.contentTypeDefaultNewText = (this.industryType.id == 3 && this.domainId == 97) ? `${ManageTitle.actionNew} ${ManageTitle.feedback}` : DefaultNewCreationText.Threads;
        let platformId:any = localStorage.getItem('platformId');
        this.contentTypeDefaultNewText = (platformId=='3') ? `${ManageTitle.actionNew} ${ManageTitle.supportRequest}` : this.contentTypeDefaultNewText;
        if( this.domainId==71 && platformId=='1')
        {
          this.contentTypeDefaultNewText=ManageTitle.supportServices;
        }
        if(this.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
    {
      this.contentTypeDefaultNewText=ManageTitle.techHelp;
    }
        /* if (threadInfototal == 0 && this.threadIdArrayInfo.length==0 && response.priorityIndexValue==4) {
          this.loadingthread = false;
          this.nothingtoshow = true;
        }*/
        let threadInfoData = rtdata.thread;
        this.itemTotal = threadInfototal;
        if (threadInfototal == 0 && this.apiData["offset"] == 0 && response.priorityIndexValue == 4) {
          this.loadingthread = false;
        }
        if (threadInfototal == 0 && this.apiData["offset"] == 0 && this.pageDataInfo != this.searchPage) {
          response.priorityIndexValue = 4;
        }

        if (threadInfototal == 0 && this.apiData["offset"] == 0 && this.threadIdArrayInfo.length == 0 && response.priorityIndexValue == 4) {
          if (searchValue) {
            this.displayNoRecords = true;
            this.displayNoRecordsDefault = false;
            this.displayNoRecordsShow = 1;
            this.loadingthread = false;
            this.centerloading = false;
            this.loadingthreadmore = false;
            this.updateMasonryLayout = true;

          } else {
            let teamSystem = localStorage.getItem("teamSystem");
            if (teamSystem) {
              if (this.apiData["type"] != "sortthread") {
                this.displayNoRecords = true;
                this.displayNoRecordsDefault = false;
                this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;
                this.loadingthread = false;
                this.centerloading = false;
                this.loadingthreadmore = false;
                //this.updateMasonryLayout = true;
              } else {
                this.displayNoRecords = false;
                this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;
                this.contentTypeDefaultNewTextDisabled = true;
              }

              this.displayNoRecordsDefault = true;
            } else {
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = true;
              this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;
              this.loadingthread = false;
              this.centerloading = false;
              this.loadingthreadmore = false;
            //  this.updateMasonryLayout = true;
            }
          }
        } else {
          this.displayNoRecords = false;
          this.displayNoRecordsDefault = false;
          this.displayNoRecordsShow = 0;
          // update 04-04-22
          if (response.priorityIndexValue == "4" && response.priorityIndexValue) {
            this.itemOffset += this.itemLimit;
          }
          // update 04-04-22
        }

        if (this.pageDataInfo == this.searchPage) {
          let priorityIndexValue = response.priorityIndexValue;
          let threadIdArrayInfo = response.threadIdArrayInfo;
          if (threadIdArrayInfo) {
            for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
              this.threadIdArrayInfo.push(threadIdArrayInfo[t1]);
            }
          }

          let limitoffset = this.itemOffset + this.itemLimit;
          if (priorityIndexValue < "4" && priorityIndexValue) {

            this.itemOffset += this.itemLimit;

            if (threadInfototal == 0 || limitoffset >= threadInfototal) {
              priorityIndexValue = parseInt(priorityIndexValue) + 1;
              this.setTWidthDuplicateFlag = false;
              this.priorityIndexValue = priorityIndexValue.toString();
              this.itemOffset = 0;
              this.loadThreadsPage();
              this.loadingthread = true;
              this.scrollCallback = false;
            }
            else
            {
            //this.scrollCallback = true;
            }
          }
        }
        else
        {
          this.scrollCallback = true;
          this.itemOffset += this.itemLimit;
        }

        if (threadInfoData.length > 0) {
          this.loadingthread = false;
          this.displayNoRecords = false;
          let loadItems = false;
          let action = 'init';
          let initIndex = -1;
          for (let t = 0; t < threadInfoData.length; t++) {
            this.setupThreadData(action, push, threadInfoData[t], initIndex, t, pushType);
            console.log('checkType 3');
            this.threadListArrayNew.push(threadInfoData[t]);
            if ((t) + 1 + "==" + threadInfoData.length) {
              loadItems = true;
            }
          }

          if(this.thumbView){
            setTimeout(() => {
              this.masonry?.reloadItems();
              this.masonry?.layout();
              this.loadingthread = false;
              this.loadingthreadmore = false;
              //this.updateMasonryLayout = true;
            }, 1500);
          }
        else{
            this.loadingthreadmore = false;
          }
        } else {
          if(this.thumbView){
            setTimeout(() => {
              console.log('layout 4');

              this.masonry.reloadItems();
              this.masonry.layout();
              // this.loadingthread = false;
            // this.loadingthreadmore = false;
            //  this.updateMasonryLayout = true;
            }, 1000);
            setTimeout(() => {
              //this.updateMasonryLayout = false;
            }, 1200);
          }
          else{
            this.loadingthreadmore = false;
          }
          if(this.priorityIndexValue>='4')
          {
            this.nothingtoshow = true;
          }

        }
        if (
          this.itemOffset < this.itemwidthLimit &&
          threadInfoData.length > 0 &&
          threadInfoData.length > 9
        ) {
          this.scrollCallback = false;
          setTimeout(() => {

            if(!this.setTWidthDuplicateFlag && this.pageDataInfo == this.searchPage){
              //this.itemOffset = 10;

              this.setTWidthDuplicateFlag =  true;
            }
            this.loadingthreadmore = true;
            this.loadThreadsPage();
            this.centerloading = true;
          }, 1000);
        } else {
          this.lastScrollTop=1;
          this.scrollCallback = true;
          this.centerloading = false;
        }
        this.scrollInit = 1;
        this.itemLength += threadInfoData.length;
        let currUrl = this.router.url.split('/');
        let navFrom = currUrl[1];
        let wsResData = {
          access: 'threads'
        }
        if(navFrom != 'threads') {
          this.sharedSvc.emitWorkstreamListData(wsResData);
        }
        console.log(threadInfoData);
        console.log(this.apiData["filterrecords"]);
      });
      setTimeout(() => {
        //if(this.itemOffset == 0){
          this.setScreenHeight();
          this.callback.emit(this);
        //}
      }, 200);
    }
  }

  expandAction(status) {
    if (status) {
      this.updateMasonryLayout = true;
    }
  }

  threadClick(thread, event, action='same',layout='') {
    $(".bg-image-new-thread" + thread.threadId + "").removeClass(
      "newthreadnotify"
    );
    if(thread.subscriptionDomainIdStr) {
      localStorage.setItem('subscriptionDomainIdStr',thread.subscriptionDomainIdStr);
    }
    let viewPath = (this.collabticFixes) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
    let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
    let aurl='';
    if(this.subscriberDomain) {
     aurl = `${view}${thread.threadId}/${thread.domainId}`;
    } else {
      aurl = `${view}${thread.threadId}`;
    }
    if(this.collabticFixes && this.pageDataInfo == this.searchPage) {
      let searchNav: any = true;
      localStorage.setItem('searchNav', searchNav);
    }

    let item = `${thread.threadId}-new-tab`;
    let checkNewTab = localStorage.getItem(item);
    if(action == 'new' || (event.ctrlKey) || ((checkNewTab != null || checkNewTab != undefined || checkNewTab != undefined) && item == checkNewTab)) {
      localStorage.setItem(item, item);
      /*if(this.apiUrl.enableAccessLevel){
        this.authenticationService.checkAccess(2,'View',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            window.open(aurl, aurl);
          }
          else if(!this.authenticationService.checkAccessVal){
             // no access
          }
          else{
            window.open(aurl, aurl);
          }
        }, 550);
       }
       else{
        window.open(aurl, aurl);
       }*/
       window.open(aurl, aurl);
    } else {
      let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' threads') ? false : true;
      let scrollTop:any = this.scrollTop;
      this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      if(this.apiUrl.enableAccessLevel){
        if(action == 'tooltip') {
          this.hideMenu();
        }
        this.router.navigate([aurl]);
        /*this.authenticationService.checkAccess(2,'View',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            if(action == 'tooltip') {
              this.hideMenu();
            }
            this.router.navigate([aurl]);
          }
          else if(!this.authenticationService.checkAccessVal){
             // no access
          }
          else{
            if(action == 'tooltip') {
              this.hideMenu();
            }
            this.router.navigate([aurl]);
          }
        }, 550);*/
       }
       else{
        if(action == 'tooltip') {
          this.hideMenu();
        }
        this.router.navigate([aurl]);
       }
    }
  }

  threadClickV2(thread, event, action='same',layout='') {


    $(".bg-image-new-thread" + thread.threadId + "").removeClass(
      "newthreadnotify"
    );

    let view = (this.newThreadView) ? forumPageAccess.threadpageNewV2 : forumPageAccess.threadpageNew;
    let aurl = `${view}${thread.threadId}`;
    console.log(aurl);

    let item = `${thread.threadId}-new-tab`;
    let checkNewTab = localStorage.getItem(item);
    if(action == 'new' || (event.ctrlKey) || ((checkNewTab != null || checkNewTab != undefined || checkNewTab != undefined) && item == checkNewTab)) {
      localStorage.setItem(item, item);
      if(this.apiUrl.enableAccessLevel){
        this.authenticationService.checkAccess(2,'View',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            window.open(aurl, aurl);
          }
          else if(!this.authenticationService.checkAccessVal){
             // no access
          }
          else{
            window.open(aurl, aurl);
          }
        }, 550);
       }
       else{
        window.open(aurl, aurl);
       }
    } else {
      let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' threads') ? false : true;
      let scrollTop:any = this.scrollTop;
      this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      if(this.apiUrl.enableAccessLevel){
        this.authenticationService.checkAccess(2,'View',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            if(action == 'tooltip') {
              this.hideMenu();
            }
            this.router.navigate([aurl]);
          }
          else if(!this.authenticationService.checkAccessVal){
             // no access
          }
          else{
            if(action == 'tooltip') {
              this.hideMenu();
            }
            this.router.navigate([aurl]);
          }
        }, 550);
       }
       else{
        if(action == 'tooltip') {
          this.hideMenu();
        }
        this.router.navigate([aurl]);
       }
    }
  }

  hideMenu() {
    let checkClass = 'active';
    let elemClass = 'list-menu-content';
    let chkElem:any = document.getElementsByClassName(elemClass);
    if(chkElem && chkElem[0].classList.contains(checkClass)) {
      chkElem[0].classList.remove(checkClass);
    }
  }

  navThread(action, id, uid) {
    if(this.apiUrl.enableAccessLevel){
      if(this.userId == uid){
        this.navThreadAction(action, id);
      }
      else{
        this.authenticationService.checkAccess(2,'Edit',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            this.navThreadAction(action, id);
          }
          else if(!this.authenticationService.checkAccessVal){
            // no access
          }
          else{
            this.navThreadAction(action, id);
          }
        }, 550);
      }
     }
     else{
      this.navThreadAction(action, id);
     }

  }

  navThreadAction(action, id) {
    let url;
    switch (action) {
      case "edit":
        url = "threads/manage/edit/"+id;
        break;
      default:
        break;
    }
    setTimeout(() => {
      let teamSystem = localStorage.getItem("teamSystem");
      this.router.navigate([url]);
    }, 50);
  }

  // Scroll to element
  scrollToElem(id, threadId = 0) {
    let secElement:any = document.getElementById(id);
   // console.log(id, secElement, this.thumbView, this.scrollTop)
    if(secElement != 'undefined' && secElement != undefined) {
    //  console.log(id, secElement.offsetTop, this.thumbView, this.scrollTop)
      if(this.thumbView) {
        secElement.scrollTop = this.scrollTop;
      } else {
        this.table.scrollTo({'top': this.scrollTop});
      }
    }
    //if(threadId == 0) {
      this.opacityFlag = false;
    //}
    setTimeout(() => {
      var elmnt = document.getElementById("thread-data-container");
      if(elmnt)
      {
        let itemLimitwidth = elmnt.offsetWidth;
        this.setTWidth = itemLimitwidth;
      }

    }, 100);
  }

  updateSearchKeyword(keyword)
  {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);

    this.LandingpagewidgetsAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {

    });


  }

  callThreadDetail(threadId){
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', threadId);
    apiFormData.append('platformId', this.platformId.toString());
    apiFormData.append('platform', '3');

    this.threadPostService.getthreadDetailsiosDefault(apiFormData).subscribe(res => {

      if(res.status=='Success'){
           let dataInfo =  res.data.thread[0];
           console.log(dataInfo)
           let tIndex = this.threadListArray.findIndex(option => option.threadId == threadId);
          let pushFlagNew=true;
           if(tIndex>=0)
           {
pushFlagNew=false;
           }
           setTimeout(() => {
            this.setupThreadData('silentUpdate', pushFlagNew, dataInfo, tIndex);
            console.log('checkType 4');
           }, 300);
          }
          else{}
        },
        (error => {})
        );

      }


  setupThreadData(action, push, threadInfoData, index = 0, findex = -1, pushType = '',solrUpdate=0) {


    if( pushType == '' &&  push==false){
      setTimeout(() => {
        this.opacityFlag = false;
      }, 700);
    }
    //console.log(push, pushType, index, findex, threadInfoData)
    let newPushClass = (push || (pushType != '' && findex == 0)) ? 'newthreadnotify' : '';
    let threadUserId = threadInfoData.userId;
    let threadAcces = (this.userId == threadUserId || this.roleId == '3' || this.roleId == '10') ? true : false;
    threadInfoData.threadAcces = threadAcces;
    let threadId = threadInfoData.threadId;

    let threadTitle = "None";
    if(threadInfoData.threadTitle != undefined && threadInfoData.threadTitle != ''){
      threadTitle = this.authenticationService.convertunicode(
      this.authenticationService.ChatUCode(threadInfoData.threadTitle));
    }
    let description = threadInfoData.content;
    let threadStatus = threadInfoData.threadStatus;
    let vehicleCarImage = threadInfoData.vehicleCarImage;
    let isDefaultBanner = threadInfoData.isDefaultBanner;
    let odometerMiles = threadInfoData.odometerMiles;
    let odometer = threadInfoData.odometer !='' && threadInfoData.odometer != null ? threadInfoData.odometer : '' ;
    let miles = threadInfoData.miles !='' && threadInfoData.miles != null ? threadInfoData.miles : '';
    if(odometer != ''){
      odometer = this.sharedSvc.removeCommaNum(odometer);
      odometer = this.sharedSvc.numberWithCommasThreeDigit(odometer);
      odometerMiles = odometer+" "+miles;
    }
    let badgeTopUser=0;
    if(threadInfoData.badgeTopUser)
    {
      badgeTopUser = threadInfoData.badgeTopUser;
    }
    console.log(badgeTopUser);

    let threadStatusBgColor = threadInfoData.threadStatusBgColor;
    let threadStatusColorValue = threadInfoData.threadStatusColorValue;
    //let newViewAccess = threadInfoData[t].newViewAccess;
    let newViewAccess = true;
    //let profileImage = threadInfoData.profileImage;
    //let userName = threadInfoData.userName;
    let availability = threadInfoData.availability;
    let badgeStatus = threadInfoData.badgeStatus;
    //let postedFrom = threadInfoData.postedFrom;
    let summitFix = threadInfoData.summitFix;
    let scorePoint = threadInfoData.scorePoint;
    let escalateStatus=threadInfoData.escalateStatusLand;
    let escColorCodes=threadInfoData.escColorCodes;
    let escColorCodesValue=threadInfoData.escColorCodesValue;
    let scanTool:any = (Array.isArray(threadInfoData.scanToolFlag)) ? threadInfoData.scanToolFlag[0] : threadInfoData.scanToolFlag;
    let scanToolFlag = (scanTool) ? true : false;
    let threadCatgData = threadInfoData.threadCategoryData;
    let ricohFlag = false;
    //console.log(index, Array.isArray(threadCatgData), threadCatgData)
    if(Array.isArray(threadCatgData) && threadCatgData.length > 0) {
      let threadCatgId = parseInt(threadCatgData[0].id);
      ricohFlag = (this.industryType.id == 1 && (this.domainId == 1 || this.domainId == 267) && threadCatgId == 6) ? true : false;
    }
    threadInfoData.ricohFlag = ricohFlag;
    let profileImage = "";
    let userName = "";
    let postedFrom = "";
    if (summitFix == "1") {
      let techinfo = threadInfoData.technicianInfo[0];
      profileImage = techinfo.profileImg;
      userName = techinfo.name;
      let dealerInfo = threadInfoData.dealerInfo[0];
      postedFrom =
        dealerInfo.dealerName != ""
          ? dealerInfo.dealerName
          : threadInfoData.postedFrom;
    } else {
      profileImage = threadInfoData.profileImage;
      userName = threadInfoData.userName;
      postedFrom = threadInfoData.postedFrom;
    }
    //let make = threadInfoData.make;
    let make = threadInfoData.genericProductName;
    let model = threadInfoData.model;
    let year = threadInfoData.year;
    let currentDtc = threadInfoData.currentDtc;
    let threadCategoryStr = parseInt(threadInfoData.threadCategoryStr);
    if(currentDtc && solrUpdate==1)
    {
      if(threadInfoData.scanToolFlag)
      {
        scanToolFlag = (threadInfoData.scanToolFlag[0]) ? true : false;
      }

      let findDTC=Array.isArray(currentDtc);
      if(findDTC)
      {
        currentDtc=currentDtc;
      }
      else
      {
        currentDtc=JSON.parse(currentDtc);
      }
console.log(currentDtc);
      //
    }
    else
    {
      //currentDtc=[];
    }
    let viewCount = threadInfoData.viewCount;
    let likeCount = threadInfoData.likeCount;
    let pinCount = threadInfoData.pinCount;
    let replyCount = threadInfoData.comment;
    let closeStatus = threadInfoData.closeStatus;
    let newThreadTypeSelect = threadInfoData.newThreadTypeSelect;
    let uploadContents = threadInfoData.uploadContents;
    let subscriptionDomainIdStr='';
    if(threadInfoData.subscriptionDomainIdStr)
    {
    subscriptionDomainIdStr=threadInfoData.subscriptionDomainIdStr;
    }
    let moreAttachments = false;
    if (uploadContents && uploadContents.length > 1) {
      moreAttachments = true;
    }
    let shareFix = false;
    if (newThreadTypeSelect == "share") {
      shareFix = true;
    } else {
      shareFix = false;
    }
    let workOrder = '';
    if(this.CBADomain) {
      workOrder = (threadInfoData.workOrder && threadInfoData.workOrder != '') ? threadInfoData.workOrder : '';
    }

    let tvsDealerName = '';
    let tvsDealerCode = '';
    let tvsDealerZone = '';
    let tvsDealerArea = '';
    if(this.TVSDomainOnly) {
      let arrJSON = (threadInfoData.dealerInfoJsonArr) ? threadInfoData.dealerInfoJsonArr : '' ;
      console.log(arrJSON)
      if(arrJSON && arrJSON.length>0)
      {

      
      tvsDealerName = arrJSON[0]['dealerName'] != '' ? arrJSON[0]['dealerName'] : '-' ;
      tvsDealerCode = arrJSON[0]['dealerCode'] != '' ? arrJSON[0]['dealerCode'] : '-' ;
      tvsDealerZone = arrJSON[0]['zone'] != '' ? arrJSON[0]['zone'] : '-' ;
      tvsDealerArea = arrJSON[0]['area'] != '' ? arrJSON[0]['area'] : '-' ;
    }
    }

    let fixStatus = threadInfoData.fixStatus;
    let fixPostStatus = threadInfoData.fixPostStatus;
    let postId = threadInfoData.postId;
    let domainIdInfo = threadInfoData.domainId;
    let pinStatus = threadInfoData.pinStatus;
    let likeStatus = threadInfoData.likeStatus;
    let errorCodeFlag = (this.collabticDomain && threadCategoryStr == 7) ? 3 : parseInt(threadInfoData.errorCodeFlagInt);

    let curentDtclength = 0;
    if (currentDtc && currentDtc.length > 0) {
      curentDtclength = currentDtc.length;
    }
    threadInfoData.curentDtclength = curentDtclength;
    let checkdtc = curentDtclength > 0 ? 1 : 2;
    console.log(threadInfoData.errorCodeFlagInt)
    errorCodeFlag = threadInfoData.errorCodeFlagInt == undefined ?  checkdtc : parseInt(threadInfoData.errorCodeFlagInt);
    let createdOnNew = threadInfoData.createdOnNew;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    let localcreatedOnDate = moment(createdOnDate)
      .local()
      .format("MMM DD, YYYY . h:mm A");
    let dateTime = localcreatedOnDate.split(" . ");
    //console.log(dateTime, index);

    let listlocalcreatedOnDate = moment(createdOnDate)
                 .local()
                 .format("MMM DD, YY . h:mm A");

    threadInfoData.date = dateTime[0];
    threadInfoData.time = dateTime[1];
    let tIndex = this.threadListArray.findIndex(option => option.threadId == threadId);

    if(index >= 0) {
      let threadInfo = [];

      //this.threadListArray[index] = threadInfo[0];
      this.threadListArray[index].threadId = threadId;
      this.threadListArray[index].threadTitle = threadTitle;
      this.threadListArray[index].threadStatus = threadStatus;
      this.threadListArray[index].badgeTopUser = badgeTopUser;
      this.threadListArray[index].threadStatusBgColor = threadStatusBgColor;
      this.threadListArray[index].threadStatusColorValue = threadStatusColorValue;
      this.threadListArray[index].newViewAccess = newViewAccess;
      this.threadListArray[index].domainId = domainIdInfo;
      this.threadListArray[index].description = description;
      this.threadListArray[index].isDefaultBanner = isDefaultBanner;
      this.threadListArray[index].vehicleCarImage = vehicleCarImage;
      this.threadListArray[index].odometerMiles = odometerMiles;
      this.threadListArray[index].profileImage = profileImage;
      this.threadListArray[index].availability = availability;
      this.threadListArray[index].badgeStatus = badgeStatus;
      this.threadListArray[index].postedFrom = postedFrom;
      this.threadListArray[index].userName = userName;
      this.threadListArray[index].listCreatedOn =listlocalcreatedOnDate;
      this.threadListArray[index].createdOn =localcreatedOnDate;
      this.threadListArray[index].date =dateTime[0];
      this.threadListArray[index].time =dateTime[1];
      this.threadListArray[index].make =make;
      this.threadListArray[index].model =model;
      this.threadListArray[index].year =year;
      this.threadListArray[index].threadAcces =threadAcces;
      this.threadListArray[index].errorCodeFlag = errorCodeFlag;
      this.threadListArray[index].currentDtc =currentDtc;
      this.threadListArray[index].curentDtclength =curentDtclength;
      this.threadListArray[index].viewCount =viewCount;
      this.threadListArray[index].likeCount =likeCount;
      this.threadListArray[index].pinCount =pinCount;
      this.threadListArray[index].replyCount =replyCount;
      this.threadListArray[index].threadUserId =threadUserId;
      this.threadListArray[index].closeStatus =closeStatus;
      this.threadListArray[index].newThreadTypeSelect =newThreadTypeSelect;
      this.threadListArray[index].summitFix =summitFix;
      this.threadListArray[index].scorePoint =scorePoint;
      this.threadListArray[index].escalateStatus =escalateStatus;
      this.threadListArray[index].escColorCodes =escColorCodes;
      this.threadListArray[index].escColorCodesValue =escColorCodesValue;
      this.threadListArray[index].workOrder = workOrder;
      this.threadListArray[index].tvsDealerName = tvsDealerName;
      this.threadListArray[index].tvsDealerCode = tvsDealerCode;
      this.threadListArray[index].tvsDealerZone = tvsDealerZone;
      this.threadListArray[index].tvsDealerArea = tvsDealerArea;
      this.threadListArray[index].fixStatus =fixStatus;
      this.threadListArray[index].fixPostStatus =fixPostStatus;
      this.threadListArray[index].postId =postId;
      this.threadListArray[index].likeStatus =likeStatus;
      this.threadListArray[index].shareFix =shareFix;
      this.threadListArray[index].pinStatus =pinStatus;
      this.threadListArray[index].uploadContents =uploadContents;
      this.threadListArray[index].subscriptionDomainIdStr =subscriptionDomainIdStr;
      this.threadListArray[index].moreAttachments = moreAttachments;
      this.threadListArray[index].newNotificationState = "";
      this.threadListArray[index].state = "active";
      this.threadListArray[index].threadCategoryStr = threadCategoryStr;
      if(this.thumbView) {
        this.backScroll();
      }
    }

    else if(tIndex>=0) {
      let threadInfo = [];

      //this.threadListArray[index] = threadInfo[0];
      console.log(this.threadListArray[tIndex].threadId);
      this.threadListArray[tIndex].threadId = threadId;
      this.threadListArray[tIndex].threadTitle = threadTitle;
      this.threadListArray[tIndex].threadStatus = threadStatus;
      this.threadListArray[tIndex].badgeTopUser = badgeTopUser;
      this.threadListArray[tIndex].threadStatusBgColor = threadStatusBgColor;
      this.threadListArray[tIndex].threadStatusColorValue = threadStatusColorValue;
      this.threadListArray[tIndex].newViewAccess = newViewAccess;
      this.threadListArray[tIndex].domainId = domainIdInfo;
      this.threadListArray[tIndex].description = description;
      this.threadListArray[tIndex].isDefaultBanner = isDefaultBanner;
      this.threadListArray[tIndex].vehicleCarImage = vehicleCarImage;
      this.threadListArray[tIndex].odometerMiles = odometerMiles;
      this.threadListArray[tIndex].profileImage = profileImage;
      this.threadListArray[tIndex].availability = availability;
      this.threadListArray[tIndex].badgeStatus = badgeStatus;
      this.threadListArray[tIndex].postedFrom = postedFrom;
      this.threadListArray[tIndex].userName = userName;
      this.threadListArray[tIndex].listCreatedOn =listlocalcreatedOnDate;
      this.threadListArray[tIndex].createdOn =localcreatedOnDate;
      this.threadListArray[tIndex].date =dateTime[0];
      this.threadListArray[tIndex].time =dateTime[1];
      this.threadListArray[tIndex].make =make;
      this.threadListArray[tIndex].model =model;
      this.threadListArray[tIndex].year =year;
      this.threadListArray[tIndex].threadAcces =threadAcces;
      this.threadListArray[tIndex].errorCodeFlag = errorCodeFlag;
      this.threadListArray[tIndex].currentDtc =currentDtc;
      this.threadListArray[tIndex].curentDtclength =curentDtclength;
      this.threadListArray[tIndex].viewCount =viewCount;
      this.threadListArray[tIndex].likeCount =likeCount;
      this.threadListArray[tIndex].pinCount =pinCount;
      this.threadListArray[tIndex].replyCount =replyCount;
      this.threadListArray[tIndex].threadUserId =threadUserId;
      this.threadListArray[tIndex].closeStatus =closeStatus;
      this.threadListArray[tIndex].newThreadTypeSelect =newThreadTypeSelect;
      this.threadListArray[tIndex].summitFix =summitFix;
      this.threadListArray[tIndex].scorePoint =scorePoint;
      this.threadListArray[tIndex].escalateStatus =escalateStatus;
      this.threadListArray[tIndex].escColorCodes =escColorCodes;
      this.threadListArray[tIndex].escColorCodesValue =escColorCodesValue;
      this.threadListArray[tIndex].workOrder = workOrder;
      this.threadListArray[tIndex].tvsDealerName = tvsDealerName;
      this.threadListArray[tIndex].tvsDealerCode = tvsDealerCode;
      this.threadListArray[tIndex].tvsDealerZone = tvsDealerZone;
      this.threadListArray[tIndex].tvsDealerArea = tvsDealerArea;
      this.threadListArray[tIndex].fixStatus =fixStatus;
      this.threadListArray[tIndex].fixPostStatus =fixPostStatus;
      this.threadListArray[tIndex].postId =postId;
      this.threadListArray[tIndex].likeStatus =likeStatus;
      this.threadListArray[tIndex].shareFix =shareFix;
      this.threadListArray[tIndex].pinStatus =pinStatus;
      this.threadListArray[tIndex].uploadContents =uploadContents;
      this.threadListArray[tIndex].subscriptionDomainIdStr =subscriptionDomainIdStr;
      this.threadListArray[tIndex].moreAttachments = moreAttachments;
      this.threadListArray[tIndex].newNotificationState = "";
      this.threadListArray[tIndex].state = "active";
      this.threadListArray[tIndex].threadCategoryStr = threadCategoryStr;
      if(this.thumbView) {
        this.backScroll();
      }
    }


    else {
      console.log(this.apiData["limit"]);
      console.log(push);
      if (push == true || this.apiData["limit"]=='1') {
      //  this.updateMasonryLayout = false;
        this.threadListArray.unshift({
          threadId: threadId,
          threadTitle: threadTitle,
          threadStatus: threadStatus,
          badgeTopUser: badgeTopUser,
          threadStatusBgColor: threadStatusBgColor,
          threadStatusColorValue: threadStatusColorValue,
          newViewAccess: newViewAccess,
          domainId: domainIdInfo,
          profileImage: profileImage,
          availability: availability,
          badgeStatus: badgeStatus,
          postedFrom: postedFrom,
          userName: userName,
          description,
          isDefaultBanner,
          vehicleCarImage,
          odometerMiles,
          createdOn: localcreatedOnDate,
          listCreatedOn: listlocalcreatedOnDate,
          date: dateTime[0],
          time: dateTime[1],
          make: make,
          model: model,
          year: year,
          threadAcces: threadAcces,
          errorCodeFlag: errorCodeFlag,
          currentDtc: currentDtc,
          curentDtclength: curentDtclength,
          viewCount: viewCount,
          likeCount: likeCount,
          pinCount: pinCount,
          replyCount: replyCount,
          threadUserId: threadUserId,
          closeStatus: closeStatus,
          newThreadTypeSelect: newThreadTypeSelect,
          summitFix: summitFix,
          scorePoint: scorePoint,
          escalateStatus: escalateStatus,
          escColorCodes: escColorCodes,
          escColorCodesValue: escColorCodesValue,
          workOrder: workOrder,
          tvsDealerName: tvsDealerName,
          tvsDealerCode: tvsDealerCode,
          tvsDealerArea: tvsDealerArea,
          tvsDealerZone: tvsDealerZone,
          fixStatus: fixStatus,
          fixPostStatus: fixPostStatus,
          postId: postId,
          likeStatus: likeStatus,
          shareFix: shareFix,
          pinStatus: pinStatus,
          uploadContents: uploadContents,
          subscriptionDomainIdStr:subscriptionDomainIdStr,
          moreAttachments: moreAttachments,
          newNotificationState: newPushClass,
          scanToolFlag: scanToolFlag,
          ricohFlag: ricohFlag,
          state: "active",
          threadCategoryStr:threadCategoryStr,
        });


        if(!this.collabticFixes) {
          setTimeout(() => {
            console.log('layout 5');
            this.masonry.reloadItems();
            this.masonry.layout();
          },1000);
          //  this.updateMasonryLayout = true;
          setTimeout(() => {
          //  this.opacityFlag = false;
          this.updateMasonryLayout = true;
          }, 2000);
        }
      } else {

        //console.log(newPushClass)
        this.threadListArray.push({
          threadId: threadId,
          threadTitle: threadTitle,
          threadStatus: threadStatus,
          badgeTopUser: badgeTopUser,
          threadStatusBgColor: threadStatusBgColor,
          threadStatusColorValue: threadStatusColorValue,
          newViewAccess: newViewAccess,
          domainId: domainIdInfo,
          profileImage: profileImage,
          availability: availability,
          badgeStatus: badgeStatus,
          postedFrom: postedFrom,
          userName: userName,
          description,
          isDefaultBanner,
          vehicleCarImage,
          odometerMiles,
          listCreatedOn: listlocalcreatedOnDate,
          createdOn: localcreatedOnDate,
          date: dateTime[0],
          time: dateTime[1],
          make: make,
          model: model,
          year: year,
          threadAcces: threadAcces,
          errorCodeFlag: errorCodeFlag,
          currentDtc: currentDtc,
          curentDtclength: curentDtclength,
          viewCount: viewCount,
          likeCount: likeCount,
          pinCount: pinCount,
          replyCount: replyCount,
          threadUserId: threadUserId,
          closeStatus: closeStatus,
          newThreadTypeSelect: newThreadTypeSelect,
          summitFix: summitFix,
          scorePoint: scorePoint,
          escalateStatus: escalateStatus,
          escColorCodes: escColorCodes,
          escColorCodesValue: escColorCodesValue,
          workOrder: workOrder,
          tvsDealerName: tvsDealerName,
          tvsDealerCode: tvsDealerCode,
          tvsDealerArea: tvsDealerArea,
          tvsDealerZone: tvsDealerZone,
          fixStatus: fixStatus,
          fixPostStatus: fixPostStatus,
          postId: postId,
          likeStatus: likeStatus,
          shareFix: shareFix,
          pinStatus: pinStatus,
          uploadContents: uploadContents,
          subscriptionDomainIdStr:subscriptionDomainIdStr,
          moreAttachments: moreAttachments,
          newNotificationState: newPushClass,
          scanToolFlag: scanToolFlag,
          ricohFlag: ricohFlag,
          state: "active",
          threadCategoryStr:threadCategoryStr
        });
      }
    }
  }

  backScroll(threadId = 0) {
    let scrollPos = localStorage.getItem('wsScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
    setTimeout(() => {
      localStorage.removeItem('wsScrollPos');
      //if(threadId == 0) {
        this.updateMasonryLayout = true;
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 50);
      //}
      setTimeout(() => {
        let id = (this.thumbView) ? 'thread-data-container' : 'file-datatable';
        this.scrollToElem(id, threadId);
      }, 500);
    }, 5);
  }
  backSearchScroll() {
    console.log('layout 1');
      if(!this.thumbView) {
        this.table.reset();
      }

      if(this.threadListArray.length==0){
        this.displayNoRecords = true;
        this.displayNoRecordsDefault = true;
        this.displayNoRecordsShow = 1;
        this.loadingthread = false;
        this.centerloading = false;
        this.loadingthreadmore = false;
        this.updateMasonryLayout = true;
        this.opacityFlag = false;
      }
      else{
      let itemOffset = localStorage.getItem('sOffset');
      this.itemOffset = (itemOffset == null) ? this.itemOffset : parseInt(itemOffset);
      let scrollPos = localStorage.getItem('sScrollPos');
      let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
      this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
      setTimeout(() => {
        localStorage.removeItem('sScrollPos');
        localStorage.removeItem('sOffset');
        localStorage.removeItem('sListData');
        localStorage.removeItem('sNavUrl');
        let timedelay1 = 0;
        let timedelay2 = 0;
        let timedelay3 = 0;
        if(this.tvsFlag){
          timedelay1 = 1500;
          timedelay2 = 1700;
          timedelay3 = 2200;
        }
        else{
          timedelay1 = 500;
          timedelay2 = 700;
          timedelay3 = 800;
        }
        if(this.thumbView) {
          setTimeout(() => {
           // this.masonry.reloadItems();
           // this.masonry.layout();
            this.loadingthreadmore = false;
           this.updateMasonryLayout = true;
          }, timedelay1);
          setTimeout(() => {
            //this.updateMasonryLayout = false;
          }, timedelay2);
        }
        setTimeout(() => {
          let id = (this.thumbView) ? 'thread-data-container' : 'file-datatable';
          this.scrollToElem(id, 0);
        }, timedelay3);
      }, 5);
      setTimeout(() => {
        var elmnt = document.getElementById("thread-data-container");
        let itemLimitwidth = elmnt.offsetWidth;
        this.setTWidth = itemLimitwidth;
      }, 100);
    }
  }
  backSearchHomeScroll() {
    console.log('layout 2');
    this.masonry.reloadItems();
    this.masonry.layout();
   // this.updateMasonryLayout = true;
    setTimeout(() => {
     // this.updateMasonryLayout = false;
    }, 100);
  }
  scroll = (event: any): void => {
    if(event.target.id == 'thread-data-container') {
      this.nothingtoshow = false;
      var scrollLeftevt = event.target.scrollLeft;
      var scrollTopevt = event.target.scrollTop;
      if (scrollTopevt < 2) {
        $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
        $(".view-type").removeClass("scroll-bg");
      } else {
        $(".workstream-page-center-menu-inner").addClass("scroll-bg");
        $(".view-type").addClass("scroll-bg");
      }
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 12;
      this.scrollTop = event.target.scrollTop;
      let scrollTop1 = event.target.scrollTop - 250;

      console.log(this.scrollTop, this.lastScrollTop, this.scrollInit);
      console.log(inHeight, totalHeight, this.scrollCallback);
      console.log(this.itemTotal, this.itemLength);

      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.fromfirebaseData=0;
          this.scrollCallback = false;
          this.loadThreadsPage();
          this.loadingthreadmore = true;
        }
      }
      //console.log(this.itemTotal + "--" + this.itemTotal + "-" + this.itemOffset);
      if (this.itemTotal && this.itemTotal < this.itemOffset) {
        if (inHeight >= totalHeight) {
          this.nothingtoshow = true;
        } else {
          this.nothingtoshow = false;
        }
      }
    }

    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      this.nothingtoshow = false;
      var scrollLeftevt = event.target.scrollLeft;
      var scrollTopevt = event.target.scrollTop;
      if (scrollTopevt < 2) {
        $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
        $(".view-type").removeClass("scroll-bg");
      } else {
        $(".workstream-page-center-menu-inner").addClass("scroll-bg");
        $(".view-type").addClass("scroll-bg");
      }
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight  - this.itemOffset * 12;

      if( event.target.scrollTop > 81){
        this.scrollTop = event.target.scrollTop - 80;
      }
      else{
        if(this.scrollTop > this.lastScrollTop){}
        else{
          this.scrollTop = 2;
        }
      }

      console.log(this.scrollTop, this.lastScrollTop, this.scrollInit);
      console.log(inHeight, totalHeight, this.scrollCallback);
      console.log(this.itemTotal, this.itemLength);

      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          ((inHeight >= totalHeight && this.itemOffset != 0) || (this.itemOffset == 0)) &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.fromfirebaseData=0;
          this.scrollCallback = false;
          if(!this.thumbView && this.itemOffset == 0) {
            this.threadListArray = [];
            this.threadPageListArray = [];
            this.threadListArrayNew = [];
            if (this.threadsAPIcall) {
              this.threadsAPIcall.unsubscribe();
              this.loadingthread = true;
            }
          }
          this.loadThreadsPage();
          this.loadingthreadmore = true;
        }
      }
      //console.log(this.itemTotal + "--" + this.itemTotal + "-" + this.itemOffset);
      if (this.itemTotal && this.itemTotal < this.itemOffset) {
        if (inHeight >= totalHeight) {
          this.nothingtoshow = true;
        } else {
          this.nothingtoshow = false;
        }
      }
    }

  };

  // change SUBTAB
  onChangeSubTab(id, flag){
    this.threadSubTypeFilterFlag = true;
    if(flag){
      this.threadSubTypeFilterFlagOn = false;
    }
    else{
      this.threadSubTypeFilterFlagOn = true;
    }    
    this.scrollTop = 0;
    this.lastScrollTop = 0;
    if (this.thumbView) {
      this.scrollTop = 0;
      let id = 'thread-data-container';
      this.scrollToElem(id);
    }
    if(flag){
      let index = this.threadSubType.indexOf(id);
      this.threadSubType.splice(index, 1);
      var objIndex = this.threadSubTypeDataArr.findIndex((obj => obj.subThreadType == id));
      this.threadSubTypeDataArr[objIndex].selected = false;
    }
    else{
      this.threadSubType.push(id);
      var objIndex = this.threadSubTypeDataArr.findIndex((obj => obj.subThreadType == id));
      this.threadSubTypeDataArr[objIndex].selected = true;
    }

    this.threadListArray = [];
    this.threadListArrayNew = [];
    this.loadingthread = true;
    this.threadsAPIcall.unsubscribe();
    this.itemOffset = 0;
    this.apiData['offset'] = this.itemOffset;
    let push = false, limit:any = '',newthread=false,actionFilter='subtype';
    this.loadThreadsPage(push,limit,newthread,actionFilter);
  }
  getThreadSubTypeData(data){
    this.threadSubTypeFlag = true;
    this.threadSubTypeData = data;
    for(let subdata of this.threadSubTypeData){
      let studentObj = this.threadSubTypeDataArr.find(t => t.id == subdata.id);
      if(studentObj)
      {
      }
      else
      {
        //this.threadSubType.push(subdata.subThreadType);
        this.threadSubTypeDataArr.push({
          id: subdata.id,
          name: subdata.name,
          subThreadType: subdata.subThreadType,
          threadType: subdata.threadType,
          selected: false
        });
      }

    }
    let unique =  this.threadSubType.filter((v, i, a) => a.indexOf(v) === i);
    console.log(this.threadSubType);
    /*let myArray =[];
    myArray = this.threadSubType;
    console.log(this.threadSubType);

    var unique = myArray.filter((v, i, a) => a.indexOf(v) === i);

    this.threadSubType = unique;*/
    this.setTWidth = 0;
    setTimeout(() => {
      var elmnt = document.getElementById("thread-data-container");
      let itemLimitwidth = elmnt.offsetWidth;
      this.setTWidth = itemLimitwidth;
    }, 600);
  }

  setScreenHeight() {

  if(this.pageDataInfo == pageInfo.workstreamPage) {
    this.accessLazyLoad = RedirectionPage.Workstream;
    setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      if(this.threadSubTypeDataArr.length>1){
        this.rmHeight = 232;
        this.rmHeight =  this.rmHeight + headerHeight;
      }
      else{
        this.rmHeight = 182;
        this.rmHeight =  this.rmHeight + headerHeight;
      }
    }, 1000);
  }
  else if(this.pageDataInfo == this.searchPage) {
    setTimeout(() => {
      this.rmHeight = 200;
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      this.rmHeight =  this.rmHeight + headerHeight;
    }, 1);
  }
  else{
    //if(this.pageDataInfo == pageInfo.threadsPage) {
      setTimeout(() => {
        this.rmHeight = 160;
        let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
        this.rmHeight =  this.rmHeight + headerHeight;
        if (this.threadSubTypeDataArr.length>1) {
          this.rmHeight = (this.thumbView) ? this.rmHeight + 50 : this.rmHeight + 30;
        }
        else{
          this.rmHeight = (this.thumbView) ? this.rmHeight-5 : this.rmHeight - 20;
        }
        this.rmHeight = this.rmHeight;

      }, 1000);
    //}
  }

  setTimeout(() => {
    setTimeout(() => {
      let rmListHeight = 10;
      let containerHeight = document.getElementsByClassName('thread-container')[0];
      if(containerHeight) {
        this.listHeight = containerHeight.clientHeight - rmListHeight;
        this.pTableHeight = parseInt(this.listHeight)-53+'px';
      }
    }, 100);
  }, 1500);

  }

  updateThumbLayout(actionTimeout=0) {
    console.log('layout 3');
    console.log(actionTimeout)
    let timeout:any = (actionTimeout == 0) ? 50 : actionTimeout;
    console.log(timeout)
    console.log('layout 6');
    this.masonry.reloadItems();
    this.masonry.layout();
    this.updateMasonryLayout = true;
    setTimeout(() => {
        this.updateMasonryLayout = false;
    }, timeout);
  }

  getUserProfileStatus(uid,index) {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', uid);
    this.probingApi.GetUserAvailability(apiFormData).subscribe((response) => {
      let resultData = response.items;
      let availability = resultData.availability;
      let availabilityStatusName = resultData.availabilityStatusName;
      let badgeTopUser = resultData.badgeTopUser;
      this.threadListArray[index].availability = availability;
      this.threadListArray[index].availabilityStatusName = availabilityStatusName;
      this.threadListArray[index].profileShow = true;
    });
  }
    // tab on user profile page
    taponprofileclick(userId){
      var aurl='profile/'+userId+'';
      window.open(aurl, aurl);
    }

  ngOnDestroy() {
    let flag = false;
    this.loadingthread = flag;
    this.centerloading = flag;
    this.subscription.unsubscribe();

    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove(this.bodyClass2);
  }
}
