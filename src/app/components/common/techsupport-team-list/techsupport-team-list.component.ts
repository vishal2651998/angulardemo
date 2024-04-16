import { Component, OnInit, OnDestroy, HostListener, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { trigger, transition, style, animate, sequence } from "@angular/animations";
import * as moment from "moment";
import { Router,NavigationEnd } from '@angular/router';
import { PlatFormType, windowHeight, threadBulbStatusText, Constant, RedirectionPage, pageTitle, PageTitleText, ContentTypeValues, DefaultNewImages, DefaultNewCreationText,
  forumPageAccess,
  MediaTypeInfo,
  ManageTitle,
  DocfileExtensionTypes,
  firebaseCredentials,
  pageInfo,
  PushTypes
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
import { retry } from "rxjs/operators";
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserComponent } from '../../../components/common/manage-user/manage-user.component';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { BaseService } from 'src/app/modules/base/base.service';
declare var $: any;
@Component({
  selector: 'app-techsupport-team-list',
  templateUrl: './techsupport-team-list.component.html',
  styleUrls: ['./techsupport-team-list.component.scss']
})
export class TechsupportTeamListComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() parentData;
  @Input() fromOthersTab;
  @Input() pageDataInfo;
  @Input() fromSearchPage;
  @Input() tapfromheader;
  //@Input() threadFilterOptions:any=[];
  @Input() filterOptions;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @Output() changeAction: EventEmitter<any> = new EventEmitter();
  @Output() serviceAction: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild("listDiv", { static: false }) listDiv: ElementRef;
  subscription: Subscription = new Subscription();
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public pageTitleText='';
  public redirectionPage='';
  public priorityIndexValue='';
  public threadIdArrayInfo=[];
  public countryId;
  public domainId;
  public firebaseAuthcreds;
  public threadsAPIcall;
  public pageInfo: any = pageInfo.threadsPage;
  public windowsItems = [];
  public nothingtoshow: boolean = false;
  public loadedthreadAPI: boolean = false;
  public menuListloaded = [];
  public loadingelanding: boolean = true;
  public tvsFlag: boolean = false;
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
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public loadingthread: boolean = false;
  public updateMasonryLayout: boolean = false;
  public loadingthreadmore: boolean = false;
  public centerloading: boolean = false;
  public itemLimitTotal: number = 20;
  public itemLimit: number = 20;
  public itemwidthLimit;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public newThreadInfo = "";
  public displayNoRecordsShow = 0;
  public contentTypeValue;
  public contentTypeDefaultNewImg;
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
  public scrollCallback: boolean = false;
  public ItemArray = [];
  public workstreamFilterArr = [];
  public outputFilterData: boolean = false;
  public makeNameArr = [];
   notes_Firebase_Data :AngularFireList<any>;

  notes_angular :Observable<any[]>;
  public optionFilter = "";
  public itemTotal: number = 0;
  public apiData: Object;
  public threadSortType = "sortthread";
  public threadOrderByType = "desc";
  public feedbackStatus='all';
  public teamMemberId;
  public ticketStatus: string = '1';
  public teamId: string = localStorage.getItem('defaultTechSupportTeamId');
  public threadLevelType = "";
  public searchValue = "";
  public MediaTypeInfo = MediaTypeInfo;
  public DocfileExtensionTypes = DocfileExtensionTypes;
  public user: any;
  public errorDtcActiveIcon: string =
    "assets/images/workstreams-page/error-alert-icon-2.svg";
  public errorDtcIcon: string =
    "assets/images/workstreams-page/no_error_code.png";
  public techSubmmitFlag: boolean = false;
  public bodyClass: string = "submit-loader";
  public bodyClass1: string = "parts-list";
  public bodyClass2: string = "parts";
  public bodyElem;
  public opacityFlag: boolean = false;
  public hideFlag: boolean = false;
  public cols: any[];
  public CBADomian: boolean = false;
  public threadSubTypeData: any[];
  public threadSubTypeDataArr = [];
  public threadSubType = [];
  public threadSubTypeFlag: boolean = false;
  public setTWidth;
  public setTWidthDuplicateFlag:boolean = false;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true, reply: true, close: true};

  public rmHeight: any = 160;
  public collabticDomain: boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public innerHeight: number;
  public bodyHeight: number;
  public threadsSelectionList = [];
  public accessPlatForm:any = 3;
  public newThreadView: boolean = false;
  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault: this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loadingthread,
    action: false,
    partsList: this.threadListArray,
    threadsSelectionList: this.threadsSelectionList,
    itemOffset: this.itemOffset,
    itemTotal: this.itemTotal,
    searchKey: this.searchValue,
    headerAction: false,
    filterrecords: 2,
  };

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      if (this.pageDataInfo == this.pageInfo || this.pageDataInfo == pageInfo.searchPage) {
        setTimeout(() => {
          let rmListHeight = 0;
          let containerHeight = document.getElementsByClassName('thread-container')[0];
          if(containerHeight) {
            this.listHeight = containerHeight.clientHeight - rmListHeight;
            this.pTableHeight = parseInt(this.listHeight)-53+'px';
            let listItemHeight;
            listItemHeight = document.getElementsByClassName("thread-list-table")[0].clientHeight;
            if(containerHeight >= listItemHeight) {
              this.loadingthreadmore = true;
              this.loadThreadsPage();
              this.itemOffset += this.itemLimit;
            }
          }
        }, 500);
      }
    }, 50);
  }

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private router: Router,
    public sharedSvc: CommonService,
    private getMenuListingApi: CommonService,
    private authenticationService: AuthenticationService,
    private dbF: AngularFireDatabase,
    public afAuth:  AngularFireAuth,
    private location: PlatformLocation,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private threadPostService: ThreadPostService,
    private baseSerivce: BaseService,
  ) {
    this.location.onPopState (() => {
      let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.Threads) {
          this.opacityFlag = true;
          this.backScroll();
      }
    });
  }

  ngOnInit(): void {
    localStorage.setItem('currentContentType', '2');
    window.addEventListener('scroll', this.scroll, true);
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    this.onInitload = false;
    let filterrecords = false;
    this.countryId = localStorage.getItem('countryId');
    this.threadLevelType = localStorage.getItem('defaultEscalation');
    this.cols = [
      { field: 'technicians', checkbox: true, header: 'Technicians', columnpclass:'tsw1 header thl-col-1 col-sticky' },
      { field: 'systemstatus', checkbox: false, header: 'System Status', columnpclass:'tsw2 header thl-col-2 col-sticky' },
      { field: 'supportreadiness', checkbox: false, header: 'Support Readiness', columnpclass:'tsw3 header thl-col-3' },

    ];
    let platformId: any = localStorage.getItem('platformId');
    let domainId: any = localStorage.getItem('domainId')
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.tvsFlag = (this.platformId == 2 && domainId == 52) ? true : false;
    this.CBADomian = (platformId == PlatFormType.CbaForum) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.pageTitleText = (this.industryType.id == 3 && domainId == 97) ? `${ManageTitle.feedback}s` : this.pageTitleText;
    this.pageTitleText = (platformId=='3') ? `${ManageTitle.supportRequest}s` : this.pageTitleText;
    if(domainId==71 && platformId=='1')
      {
        this.pageTitleText=ManageTitle.supportServices
      }
      if( domainId==Constant.CollabticBoydDomainValue && platformId=='1')
      {
        this.pageTitleText=ManageTitle.techHelp;
      }
    this.subscription.add(
      this.sharedSvc.TSListDataReceivedSubject.subscribe((r) => {
        this.apiData['filterrecords'] =  '2';
        let action = r['action'];
        let atype = r['moretype'];
        switch(action) {
          case 'action-more':
            if(atype == 'assignme'){
              this.assign(this.threadsSelectionList,this.userId);
            }
            if(atype == 'assignmember'){
              this.assignMember(this.threadsSelectionList);
            }
          break;
          case 'action-close':

          break;
          case 'update-assign':
            setTimeout(() => {
              console.log(this.threadListArray,r['dataId']);
              let threadIndex = this.threadListArray.findIndex(option => option.threadId == r['dataId']);
              this.threadListArray.splice(threadIndex, 1);
              console.log(this.threadListArray,threadIndex);
              this.itemTotal -= 1;
              this.itemLength -= 1;
              this.serviceAction.emit(true);
              localStorage.removeItem('tspageRefresh');
            }, 1);
            return false;
          break;
          default:
            this.apiData['teamId'] =  r['teamId'];
            this.apiData['searchKey'] =  r['searchKey'];
            this.threadOrderByType = r['orderBy'];
            this.teamId =  r['teamId'];
            this.searchValue =  r['searchKey'];

            this.loadingthreadmore = false;
            this.threadListArray = [];
            this.threadListArrayNew = [];
            this.loadingthread = true;
            this.itemOffset = 0;
            this.itemLength = 0;
            this.itemTotal = 0;
            this.lastScrollTop = 0;
            this.scrollInit = 0;
            this.scrollTop = 0;
            this.scrollCallback = false;
            this.headerCheck = "unchecked";
            this.headercheckDisplay = "checkbox-hide";
            this.threadsSelectionList = [];
            this.threadsChangeSelection("empty");
            if (this.threadsAPIcall) {
              this.threadsAPIcall.unsubscribe();
              this.loadingthread = true;
            }
              this.loadThreadsPage();

          break;
        }
      }));

    this.subscription.add(
      this.sharedSvc._OnLayoutTSStatusReceivedSubject.subscribe((r, r1 = "") => {
        let action = r['action'];
        console.log(action)

        switch(action) {
          case 'side-menu':
            let access = r['access'];
            let page = r['page'];
            if(access == 'techsupport') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
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
          case 'get':
          case 'reset':
          case 'pin':
            this.opacityFlag = false;
            this.hideFlag = false;
            this.scrollTop = 0;
            let id = 'matrixTable';
            this.scrollToElem(id);
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

        let filterData;
        let threadSortType = this.threadSortType;
        let threadOrderType = this.threadOrderByType;


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

          }


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

          console.log(filterData);
        }
        //console.log(setdata+'--'+this.pageDataInfo);
          console.log(setdata.threadViewType);
          if(setdata.feedbackStatus)
          {
            this.feedbackStatus= setdata.feedbackStatus;
          }


        this.threadFilterOptions = setdata;
        if (this.pageDataInfo == this.pageInfo) {
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

          }

          this.itemOffset = 0;
          var searchValue = '';

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
            searchKey: searchValue,
            filterrecords: setdata.filterrecords,
          };
          this.threadListArray = [];
          this.threadListArrayNew = [];
          this.apiData = apiInfo;
          this.loadingthread = true;
          this.loadThreadsPage();
          setTimeout(() => {
            if (this.top != undefined) {
              this.top.nativeElement.scroll({
                top: 0,
                left: 0,
                behavior: "auto",
              });

            }
          }, 1000);
          this.onInitload = true;
        }
      })
    );


    //this.checkAccessLevel();
    //this.getnorows();
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;

   // this.firebaseAuthcreds=this.authenticationService.fbDataValue;
    console.log(this.firebaseAuthcreds);
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.teamMemberId = this.user.Userid;
    this.roleId = this.user.roleId;

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

    let filterrecord =  '2';
    this.teamId =  localStorage.getItem('createdTeamId') != null ? localStorage.getItem('createdTeamId') : this.teamId;
    setTimeout(() => {
      localStorage.removeItem('createdTeamId');
    }, 500);

    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      escalationType: 1,
      limit: this.itemLimit,
      offset: this.itemOffset,
      type: this.threadSortType,
      orderBy: this.threadOrderByType,
      level:this.threadLevelType,
      teamId: this.teamId,
      ticketStatus: this.ticketStatus,
      teamMemberId: this.teamMemberId,
      filterrecords: filterrecord
    };
    this.apiData = apiInfo;

    this.setScreenHeight();
    setTimeout(() => {
      this.loadingthread = true;
      this.loadThreadsPage();
    }, 100);

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
    console.log(this.itemwidthLimit + "-itemWidth");
    if (totalrows > 3) {
      var newrows = 2;
      this.itemLimit = newrows * totalCols;
      if (this.itemLimit <= 9) {
        this.itemLimit = 10;
      }
    } else {
      this.itemLimit = totalrows * totalCols;
      if (this.itemLimit <= 9) {
        this.itemLimit = 10;
      }
    }
  }
  onDrop(ev) {}
  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.scroll(event);
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true, replyAccess = true, closeAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(36, chkType, chkFlag);
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


  loadThreadsPage(push = false, limit:any = '') {
    localStorage.removeItem("landing-techsupportteam");
    let searchValue = '';
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    if(this.searchValue && this.searchValue != '' && this.searchValue  != undefined) {
      apiFormData.append('searchKey', this.searchValue);
    }
    if (push == true) {
      let itemLimit:any = (limit == '') ? 1 : limit;
      apiFormData.append("limit", itemLimit);
      this.apiData["offset"] = 0;
    } else {
      apiFormData.append("limit", this.apiData["limit"]);

      this.apiData["offset"] = this.itemOffset;
    }

    apiFormData.append("offset", this.apiData["offset"]);
    apiFormData.append("teamId", this.apiData["teamId"]);
    apiFormData.append("teamMemberId", this.apiData["userId"]);
    apiFormData.append("platform", "3");
    apiFormData.append("fromTeam", "1");
    console.log(this.pageDataInfo)

    this.threadsAPIcall = this.LandingpagewidgetsAPI.apiTechSupportMenusAPI(
      apiFormData
    ).subscribe((response) => {

      if(this.fromfirebaseData)
      {
        return false;
      }
      let rstatus = response.status;
      let rtdata = response.teamMembers;
      let threadInfototal = response.totalTeamMembers;
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
      if(this.domainId==71 && platformId=='1')
      {
        this.contentTypeDefaultNewText=ManageTitle.supportServices
      }
      if(this.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
      {
        this.contentTypeDefaultNewText=ManageTitle.techHelp;
      }
      /* if (threadInfototal == 0 && this.threadIdArrayInfo.length==0 && response.priorityIndexValue==4) {
        this.loadingthread = false;
        this.nothingtoshow = true;
      }
      */
      let threadInfoData = rtdata;
      this.itemTotal = threadInfototal;
      if (
        threadInfototal == 0 &&
        this.apiData["offset"] == 0 &&
        response.priorityIndexValue == 4
      ) {
        this.loadingthread = false;
      }
      if (
        threadInfototal == 0 &&

        this.apiData["offset"] == 0 &&
        this.pageDataInfo != pageInfo.searchPage
      ) {
        response.priorityIndexValue = 4;
      }

      if (
        threadInfototal == 0 &&
        this.apiData["offset"] == 0 &&
        this.threadIdArrayInfo.length == 0 &&
        response.priorityIndexValue == 4
      ) {
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
              this.updateMasonryLayout = true;
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
            this.updateMasonryLayout = true;
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

      if (this.pageDataInfo == pageInfo.searchPage) {
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
           //alert(priorityIndexValue);
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
        let pushType = '';
        for (let t = 0; t < threadInfoData.length; t++) {
          this.setupThreadData(action, push, threadInfoData[t], initIndex, t, pushType);
          this.threadListArrayNew.push(threadInfoData[t]);
          if ((t) + 1 + "==" + threadInfoData.length) {
            loadItems = true;
          }
        }


          this.loadingthreadmore = false;

      } else {

          this.loadingthreadmore = false;

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


          this.loadingthreadmore = true;
          this.loadThreadsPage();


          this.centerloading = true;

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
      //}
    }, 100);

  }

  expandAction(status) {
    if (status) {
      this.updateMasonryLayout = true;
    }
  }
  threadClick(thread, event, action='same') {
     localStorage.setItem("tspageTS",this.ticketStatus);
     $(".bg-image-new-thread" + thread.threadId + "").removeClass(
      "newthreadnotify"
    );

    let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
    let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
    let aurl = `${view}${thread.threadId}`;
    console.log(aurl);

    let item = `${thread.threadId}-new-tab`;
    let checkNewTab = localStorage.getItem(item);
    if(action == 'new' || (event.ctrlKey) || ((checkNewTab != null || checkNewTab != undefined || checkNewTab != undefined) && item == checkNewTab)) {
      localStorage.setItem(item, item);
      if(this.apiUrl.enableAccessLevel){
        this.authenticationService.checkAccess(36,'View',true,true);
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
      let wsFlag: any = (navFrom == ' techsupport') ? false : true;
      let scrollTop:any = this.scrollTop;
      this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      if(this.apiUrl.enableAccessLevel){
        this.authenticationService.checkAccess(36,'View',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            this.router.navigate([aurl]);
          }
          else if(!this.authenticationService.checkAccessVal){
            // no access
          }
          else{
            this.router.navigate([aurl]);
          }
        }, 550);
       }
       else{
        this.router.navigate([aurl]);
       }
    }
  }

  navThread(action, id) {
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
    let secElement = document.getElementById(id);
    this.table.scrollTo({'top': this.scrollTop});

    if(threadId == 0) {
      this.opacityFlag = false;
    }
  }


  setupThreadData(action, push, threadInfoData, index = 0, findex = -1, pushType = '',solrUpdate=0) {
    console.log(push, pushType, index, findex, threadInfoData)

    let availability=threadInfoData.availability;
    let emailAddress=threadInfoData.emailAddress;
    let isSelected=threadInfoData.isSelected;
    let profileImg=threadInfoData.profileImg;
    let supportReadiness=threadInfoData.supportReadiness;
    let threadAcces=threadInfoData.threadAcces;
    let userId=threadInfoData.userId;
    let userName=threadInfoData.userName;
    let availabilityText;
    let supportReadinessText = '';
    switch(availability){
      case 1:
        availabilityText = 'Online';
        break;
      case 0:
        availabilityText = 'Offline';
        break;
      case 2:
        availabilityText = 'Idle';
        break;
      default:
        break;
    }
    switch(supportReadiness){
      case 1:
        supportReadinessText = 'Available';
        break;
      case 0:
        supportReadinessText = 'Unavailable';
        break;
      case 2:
        supportReadinessText = 'Vocation';
        break;
      default:
        break;
    }

    let daccess = false;
    //let daccess = true;
    if(this.platformId == 1){
      if( this.userId == threadInfoData.userId || threadInfoData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='2' || this.roleId=='10'){
        daccess = true;
      }
    }
    else{
      if(this.userId == threadInfoData.userId || threadInfoData.ownerAccess == 1 || this.roleId=='3'  || this.roleId=='10'){
        daccess = true;
      }
    }

    let caccess = false;
    if(threadInfoData.closeStatus != 1){
      if(this.platformId == 1){
        caccess = true;
      }
      else{
        if(this.userId == threadInfoData.userId || threadInfoData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
          caccess = true;
        }
      }
    }


    if(index >= 0) {
      this.threadListArray[index].availability =availability;
      this.threadListArray[index].availabilityText =availabilityText;
      this.threadListArray[index].supportReadinessText =supportReadinessText;
      this.threadListArray[index].emailAddress =emailAddress;
      this.threadListArray[index].isSelected =isSelected;
      this.threadListArray[index].profileImg =profileImg;
      this.threadListArray[index].supportReadiness =supportReadiness;
      this.threadListArray[index].threadAcces =threadAcces;
      this.threadListArray[index].userId =userId;
      this.threadListArray[index].userName =userName;
      this.threadListArray[index].state = "active";

    } else {
      if (push == true) {
        this.threadListArray.unshift({
          availability: availability,
          availabilityText: availabilityText,
          supportReadinessText: supportReadinessText,
          emailAddress: emailAddress,
          isSelected: isSelected,
          profileImg: profileImg,
          supportReadiness: supportReadiness,
          threadAcces: threadAcces,
          userId: userId,
          userName: userName,
          state: "active",
        });

      } else {
        //console.log(newPushClass)
        this.threadListArray.push({
          availability: availability,
          availabilityText: availabilityText,
          supportReadinessText: supportReadinessText,
          emailAddress: emailAddress,
          isSelected: isSelected,
          profileImg: profileImg,
          supportReadiness: supportReadiness,
          threadAcces: threadAcces,
          userId: userId,
          userName: userName,
          state: "active",
        });
      }
    }
  }


  scroll = (event: any): void => {
    if(event.target.id == 'thread-data-container') {
      this.nothingtoshow = false;
      var scrollLeftevt = event.target.scrollLeft;
      var scrollTopevt = event.target.scrollTop;
      if (scrollTopevt < 2) {
        $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
      } else {
        $(".workstream-page-center-menu-inner").addClass("scroll-bg");
      }
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 12;
      this.scrollTop = event.target.scrollTop - 80;
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
      } else {
        $(".workstream-page-center-menu-inner").addClass("scroll-bg");
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

  assignMember(threadId)
  {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 157 );
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId
    };
    let techSupportUserId=[];
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "techsupport";
    modalRef.componentInstance.accessTitle = "Member List";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = '';
    modalRef.componentInstance.selectedUsers = techSupportUserId;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if(!receivedService.empty) {
        console.log(receivedService.mId);
        console.log(receivedService.mName);
        this.assign(threadId,receivedService.mId,receivedService.mName);
      }
    });
  }

  assign(thradIdData,tsuid,tsuname=''){
    const apiFormData = new FormData();
    let thradIdDataJSON = JSON.stringify(thradIdData);
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("techSupportUserId",tsuid);
    if(tsuname != ''){
      apiFormData.append("techSupportUserName",tsuname);
    }
    apiFormData.append("teamId", "1");
    apiFormData.append("threadId", thradIdDataJSON);
    this.LandingpagewidgetsAPI.updateThreadTechSupportAPI(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let data = {
          msg : response.result,
          type: 'success'
        }
        this.changeAction.emit(data);
        this.headerCheck = "unchecked";
        this.headercheckDisplay = "checkbox-hide";
        this.threadsSelectionList = [];
        this.threadsChangeSelection("empty");


        if(thradIdData && thradIdData.length>0)
        {
          for(let slr in thradIdData){

            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', thradIdData[slr]);
            //apiDatasocial.append('postId', postId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('action', 'update');
            apiDatasocial.append('actionType', '1');
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo == '1' || platformIdInfo == '3') {
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            }

          }
        }

        let apiDataPush = new FormData();
        apiDataPush.append('apiKey', Constant.ApiKey);
        apiDataPush.append('domainId', this.domainId);
        apiDataPush.append('countryId', this.countryId);
        apiDataPush.append('userId', this.userId);
        apiDataPush.append("techSupportUserId",tsuid);
        if(tsuname != ''){
          apiDataPush.append("techSupportUserName",tsuname);
        }
        apiDataPush.append("teamId", "1");
        apiDataPush.append("fromTechSupport", "1");
        apiDataPush.append("threadId", thradIdDataJSON);
        this.threadPostService.sendPushtoMobileAPI(apiDataPush).subscribe((response) => { console.log(response); });
        this.sharedSvc.emitTechsupportFilterData(data);
        //this.sharedSvc.emitTSSuccessMsg(response.result);
        //this.sharedSvc.emitTSLayoutrefresh(response.result);
      }
    });
  }

  actionStatus(data,type){
    let thradIdData = [];
    thradIdData.push(data.threadId);
    switch(type){
      case 'assignme':
        this.assign(thradIdData,this.userId);
      break;
      case 'assignmember':
        this.assignMember(thradIdData);
      break;
      case 'close':
        this.closeThreadConfirm(data);
      break;
      case 'delete':
        this.threadDeleteConfirm(data);
      break;
      default:
        break;
    }

  }

   //close thread confirm
   closeThreadConfirm(data){
    if(this.apiUrl.enableAccessLevel){
      if(this.userId == data.threadUserId){
        this.authenticationService.checkAccessVal = true;
        this.closeThreadCallback(data);
      }
      else{
        this.authenticationService.checkAccess(2,'Close',true,true);

       setTimeout(() => {
         if(this.authenticationService.checkAccessVal){
          this.closeThreadCallback(data);
         }
         else if(!this.authenticationService.checkAccessVal){
           // no access
         }
         else{
          this.closeThreadCallback(data);
         }
       }, 550);
      }
      }
      else{
        this.closeThreadCallback(data);
      }


}

   //close thread confirm
   threadDeleteConfirm(data){
    if(this.apiUrl.enableAccessLevel){
      if(this.userId == data.threadUserId){
        this.authenticationService.checkAccessVal = true;
        this.threadDeleteCallback(data);
      }
      else{
        this.authenticationService.checkAccess(36,'Delete',true,true);
       setTimeout(() => {
         if(this.authenticationService.checkAccessVal){
          this.threadDeleteCallback(data);
         }
         else if(!this.authenticationService.checkAccessVal){
           // no access
         }
         else{
          this.threadDeleteCallback(data);
         }
       }, 550);
      }
      }
      else{
        this.threadDeleteCallback(data);
      }


}

  //close thread confirm
  closeThreadCallback(data){
    const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.access = 'ThreadClose';
    modalRef.componentInstance.title = 'Thread';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.closeThread(data);
      }
    });
  }
  // thread closed
  closeThread(data){
    let dataId = data.threadId;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', dataId);
    apiFormData.append('closeStatus', 'yes');
    apiFormData.append('emailFlag', '1');

    this.threadPostService.closeThread(apiFormData).subscribe(res => {
        if(res.status=='Success'){
          if(this.platformId==1){
            // PUSH API
            let apiData = new FormData();
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);
            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', dataId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('action', 'close');
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo=='1')
            {
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            }
            // PUSH API
          }
          localStorage.setItem('closeThreadNow', 'yes');
          let data = {
            msg : res.result,
            type: 'success',
            actiontype: 'action-close'
          }
          this.changeAction.emit(data);
          let threadIndex = this.threadListArray.findIndex(option => option.threadId === dataId);
          this.threadListArray.splice(threadIndex, 1);
          this.itemTotal -= 1;
          this.itemLength -= 1;
        }
        else{
          console.log(res);
        }
      },
      (error => {
        console.log(error);
      })
    );
  }

   // thread delete confirm
   threadDeleteCallback(data){
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'ThreadDelete';
    modalRef.componentInstance.title = 'Thread';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.deleteThread(data);
      }
    });
 }
  // thread closed
  deleteThread(data){
    let thread_id;
    let post_id;

    thread_id = data.threadId;
    post_id = data.postId;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', thread_id);
    apiFormData.append('postId', post_id);
    apiFormData.append('platform', this.accessPlatForm);
    this.threadPostService.deleteThreadPostAPI(apiFormData).subscribe(res => {
      if(res.status=='Success'){
        let apiDatasocial = new FormData();
        apiDatasocial.append('apiKey', Constant.ApiKey);
        apiDatasocial.append('domainId', this.domainId);
        apiDatasocial.append('threadId', thread_id);
        apiDatasocial.append('userId', this.userId);
        apiDatasocial.append('action', 'delete');
        let platformIdInfo = localStorage.getItem('platformId');
        if(platformIdInfo=='1')
        {
        this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { });
        }
        let successMsg = '';
        successMsg = 'Thread Deleted Successfully';
        let data = {
          msg : successMsg,
          type: 'success',
          actiontype: 'action-delete'
        }
        this.changeAction.emit(data);
        let threadIndex = this.threadListArray.findIndex(option => option.threadId === thread_id);
        this.threadListArray.splice(threadIndex, 1);
        this.itemTotal -= 1;
        this.itemLength -= 1;
      }
    });
  }

  setScreenHeight() {
    this.rmHeight = 135;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    this.rmHeight =  this.rmHeight + headerHeight;
    setTimeout(() => {
      let rmListHeight = 0;
      let containerHeight = document.getElementsByClassName('thread-container')[0];
      if(containerHeight) {
        this.listHeight = containerHeight.clientHeight - rmListHeight;
        this.pTableHeight = parseInt(this.listHeight)-53+'px';
      }
    }, 1);
  }

   // Parts Selection
   techsupportSelection(type, index, id, flag) {
    let emitFlag = true;
    switch (type) {
      case "single":
        this.threadListArray[index].checkFlag = flag;
        if (!flag) {
          let rmIndex = this.threadsSelectionList.findIndex(
            (option) => option == id
          );
          this.threadsSelectionList.splice(rmIndex, 1);
          setTimeout(() => {
            this.headerCheck =
              this.threadsSelectionList.length == 0 ? "unchecked" : "checked";
            this.headercheckDisplay =
              this.threadsSelectionList.length == 0
                ? "checkbox-hide"
                : this.headercheckDisplay;
          }, 100);
        } else {
          this.threadsSelectionList.push(id);
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck =
            this.threadsSelectionList.length == this.threadListArray.length
              ? "all"
              : "checked";
          this.headercheckDisplay =
            this.threadsSelectionList.length > 0
              ? "checkbox-show"
              : "checkbox-hide";
        }
        break;
      case "all":
        emitFlag = false;
        this.threadsSelectionList = [];
        this.headercheckDisplay = "checkbox-show";
        this.responseData["threadsSelectionList"] = this.threadsSelectionList;
        this.responseData["headerCheck"] = this.headerCheck;
        if (flag == "checked") {
          if (this.threadListArray.length > 0) {
            this.headerCheck = "all";
            this.responseData["headerCheck"] = this.headerCheck;
            this.threadsChangeSelection(this.headerCheck);
          }
        } else if (flag == "all") {
          this.headerCheck = "unchecked";
          this.headercheckDisplay = "checkbox-hide";
          this.responseData["headerCheck"] = this.headerCheck;
          this.responseData["headercheckDisplay"] = this.headercheckDisplay;
          this.threadsChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = "all";
          this.responseData["headerCheck"] = this.headerCheck;
          this.threadsChangeSelection(this.headerCheck);
        }
        break;
    }

    if (emitFlag) {
      setTimeout(() => {
        this.responseData["headerCheck"] = this.headerCheck;
        this.responseData["headercheckDisplay"] = this.headercheckDisplay;
        this.responseData["threadsSelectionList"] = this.threadsSelectionList;
        //alert("222"+this.threadsSelectionList.length);
        console.log(this.threadsSelectionList);
        let checkboxFlag = this.threadsSelectionList.length>0 ? true : false;
        let data = {
          checkFlag : checkboxFlag,
          type: 'checkbox'
        }
        this.changeAction.emit(data);
        //this.sharedSvc.emitTSListData(this.responseData);
      }, 150);
    }
  }

  // Parts Selection (Empty, All)
  threadsChangeSelection(action) {
    //console.log(action)
    for (let p of this.threadListArray) {
      if (action != "empty" && action != "unchecked") {
        this.threadsSelectionList.push(p.threadId);
      }
      p.checkFlag = action == "all" ? true : false;
    }

    if (action != "empty") {
      setTimeout(() => {
        this.responseData["threadsSelectionList"] = this.threadsSelectionList;
        //alert("sss"+this.threadsSelectionList.length);
        console.log(this.threadsSelectionList);
        let checkboxFlag = this.threadsSelectionList.length>0 ? true : false;
        let data = {
          checkFlag : checkboxFlag,
          type: 'checkbox'
        }
        this.changeAction.emit(data);
        //this.sharedSvc.emitTSListData(this.responseData);
      }, 150);
    }
  }

  backScroll(threadId = 0) {
    let scrollPos = localStorage.getItem('wsScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
    setTimeout(() => {
      localStorage.removeItem('wsScrollPos');
      setTimeout(() => {
        let id = 'file-datatable';
        this.scrollToElem(id, threadId);
      }, 500);
    }, 5);
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
