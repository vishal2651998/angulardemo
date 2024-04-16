import { Component, OnInit, OnDestroy, HostListener, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import * as moment from "moment";
import { Router } from '@angular/router';
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
import { PlatformLocation } from "@angular/common";
import { Observable } from 'rxjs';
import { Table } from "primeng/table";

declare var $: any;

@Component({
  selector: 'app-opportunity-lists',
  templateUrl: './opportunity-lists.component.html',
  styleUrls: ['./opportunity-lists.component.scss'],
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
})
export class OpportunityListsComponent implements OnInit, OnDestroy {
  @Input() parentData;
  @Input() fromOthersTab;
  @Input() pageDataInfo;
  @Input() fromSearchPage;
  @Input() tapfromheader;
  @Input() filterOptions;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @Output() accessLevelValue: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild("listDiv", { static: false }) listDiv: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  public DocfileExtensionTypes = DocfileExtensionTypes;
  public searchLoading: boolean = false;
  public lazyLoading: boolean = false;
  public loading: boolean = false;
  public centerloading: boolean = false;
  public thumbView: boolean = true;
  public bodyClass1: string = "parts-list";
  public bodyClass2: string = "parts";
  public bodyElem;
  public onInitload = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public updateMasonryLayout: boolean = false;
  public displayNoRecords: boolean = false;
  public opacityFlag: boolean = false;
  public hideFlag: boolean = false;
  public accessFrom: string = '';
  public rmHeight: any = 137;
  public accessLevel : any;
  public pageInfo: any = pageInfo.opportunityPage;
  public platformId = 0;
  public threadFilterOptions;
  public industryType: any = [];
  public userId;
  public roleId;
  public countryId;
  public domainId;
  public user: any;
  public errorDtcActiveIcon: string = "assets/images/workstreams-page/error-alert-icon-2.svg";
  public errorDtcIcon: string = "assets/images/workstreams-page/no_error_code.png";
  public pageTitleText = PageTitleText.Opportunity;
  public redirectionPage:string = RedirectionPage.Opportunity;
  public displayNoRecordsShow = 2;
  public contentTypeValue: any = ContentTypeValues.Opportunity;
  public contentTypeDefaultNewText: string = DefaultNewCreationText.Opportunity;
  public contentTypeDefaultNewImg:string = DefaultNewImages.Opportunity;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public createOptUrl = `${this.redirectionPage}/manage`;
  public newOptInfo = 'Get started by tapping on "New Opportunity".';
  public proposedFixTxt = "";
  public threadwithFixTxt = "";
  public shareFixTxt = "";
  public shareSummitFixTxt = "";
  public threadwithHelpfulFixTxt = "";
  public threadwithNotFixTxt = "";
  public threadCloseTxtTxt = "";
  public midHeight;
  public listHeight;
  public pTableHeight = '450px';
  public listWidth;
  public apiData: Object;
  public itemTotal: number;
  public itemOffset: number = 0;
  public itemLimit: number = 10;
  public itemLength: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number = 0;
  public scrollCallback: boolean = false;
  public ItemArray = [];
  public workstreamFilterArr = [];
  public outputFilterData: boolean = false;
  public makeNameArr = [];
  public optionFilter = "";
  public threadSortType = "sortthread";
  public threadOrderByType = "asc";
  public feedbackStatus='all';
  public searchValue = "";
  public MediaTypeInfo = MediaTypeInfo;
  public optItems: any = [];

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private router: Router,
    public sharedSvc: CommonService,
    private getMenuListingApi: CommonService,
    private authenticationService: AuthenticationService,
    private location: PlatformLocation,
    public apiUrl: ApiService,
  ) { }

  ngOnInit(): void  {
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
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    this.proposedFixTxt = threadBulbStatusText.proposedFix;
    this.threadwithFixTxt = threadBulbStatusText.threadwithFix;
    this.shareFixTxt = threadBulbStatusText.shareFix;
    this.shareSummitFixTxt = threadBulbStatusText.summitFix;
    this.threadwithHelpfulFixTxt = threadBulbStatusText.threadwithHelpfulFix;
    this.threadwithNotFixTxt = threadBulbStatusText.threadwithNotFix;
    this.threadCloseTxtTxt = threadBulbStatusText.threadCloseTxt;

    if (this.teamSystem && this.pageDataInfo == this.pageInfo) {
      //this.getlandingpagewidgets();
      //this.getHeadMenuLists();
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
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(landingpageworkstream);
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
    setTimeout(() => {
      this.getOpportunityList();
    }, 500);
  }

  // Get Opportunity Lists
  getOpportunityList(push = false, limit:any = '') {
    this.displayNoRecords = false;
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    if (push == true) {
      let itemLimit:any = (limit == '') ? 1 : limit;
      apiFormData.append("limit", itemLimit);
      this.apiData["offset"] = 0;
    } else {
      apiFormData.append("limit", this.apiData["limit"]);
      this.apiData["offset"] = this.itemOffset;
    }
    this.LandingpagewidgetsAPI.getOpportunityList(apiFormData).subscribe((response) => {
      console.log(response)
      let itemResponse = response.data;
      let total = itemResponse.total;
      let items = itemResponse.items
      this.itemTotal = (this.itemOffset == 0) ? total : this.itemTotal;
      this.displayNoRecords = (this.itemTotal == 0) ? true : false;
      let pushType = '';
      let action = 'init';
      let initIndex = -1;
      items.forEach((item, i) => {
        this.setupOptData(action, push, item, initIndex, i, pushType,1);
      });      
      this.loading = false;
    });
  }

  setupOptData(action, push, optInfoData, index = 0, findex = -1, pushType = '',solrUpdate=0) {
    let newPushClass = (push || (pushType != '' && findex == 0)) ? 'newthreadnotify' : '';
    let threadUserId = optInfoData.userId;         
    let threadAcces = (this.userId == threadUserId || this.roleId == '3' || this.roleId == '10') ? true : false;
    optInfoData.threadAcces = threadAcces;
    let optId = optInfoData.optId;
    let threadTitle = this.authenticationService.convertunicode(
      this.authenticationService.ChatUCode(optInfoData.threadTitle)
    );
    let threadStatus = optInfoData.threadStatus;
    let badgeTopUser = (optInfoData.badgeTopUser) ? optInfoData.badgeTopUser : 0;
    let threadStatusBgColor = optInfoData.threadStatusBgColor;
    let threadStatusColorValue = optInfoData.threadStatusColorValue;
    let availability = optInfoData.availability;
    let badgeStatus = optInfoData.badgestatus;
    let summitFix = optInfoData.summitFix;
    let scorePoint = optInfoData.scorePoint;
    let escalateStatus=optInfoData.escalateStatusLand;
    let escColorCodes=optInfoData.escColorCodes;
    let escColorCodesValue=optInfoData.escColorCodesValue;
    let profileImage = "";
    let userName = "";
    let postedFrom = "";
    if (summitFix == "1") {
      let techinfo = optInfoData.technicianInfo[0];
      profileImage = techinfo.profileImg;
      userName = techinfo.name;
      let dealerInfo = optInfoData.dealerInfo[0];
      postedFrom = dealerInfo.dealerName != "" ? dealerInfo.dealerName : optInfoData.postedFrom;
    } else {
      profileImage = optInfoData.profileImage;
      userName = optInfoData.userName;
      postedFrom = optInfoData.postedFrom;
      let make = optInfoData.genericProductName;
      let model = optInfoData.model;
      let year = optInfoData.year;
      let currentDtc = optInfoData.currentDtc;
      let viewCount = optInfoData.viewCount;
      let likeCount = optInfoData.likeCount;
      let pinCount = optInfoData.pinCount;
      let replyCount = optInfoData.comment;
      let closeStatus = optInfoData.closeStatus;
      let newThreadTypeSelect = optInfoData.newThreadTypeSelect;
      let uploadContents = optInfoData.uploadContents;
      let moreAttachments = (uploadContents && uploadContents.length > 1) ? true : false;
      let shareFix = (newThreadTypeSelect == "share") ? true : false;
      let fixStatus = optInfoData.fixStatus;
      let fixPostStatus = optInfoData.fixPostStatus;
      let postId = optInfoData.postId;
      let pinStatus = optInfoData.pinStatus;
      let likeStatus = optInfoData.likeStatus;
      let curentDtclength = 0;
      if (currentDtc && currentDtc.length > 0) {
        curentDtclength = currentDtc.length;
      }
      optInfoData.curentDtclength = curentDtclength
      let createdOnNew = optInfoData.createdOnNew;
      let createdOnDate = moment.utc(createdOnNew).toDate();
      let localcreatedOnDate = moment(createdOnDate).local().format("MMM DD, YYYY . h:mm A");
      let dateTime = localcreatedOnDate.split(" . ");
      let listlocalcreatedOnDate = moment(createdOnDate).local().format("MMM DD, YY . h:mm A");
      optInfoData.date = dateTime[0];
      optInfoData.time = dateTime[1];
      if(index >= 0) {
        let threadInfo = [];
        this.optItems[index].optId = optId;
        this.optItems[index].threadTitle = threadTitle;
        this.optItems[index].threadStatus = threadStatus;
        this.optItems[index].badgeTopUser = badgeTopUser;
        this.optItems[index].threadStatusBgColor = threadStatusBgColor;
        this.optItems[index].threadStatusColorValue = threadStatusColorValue;
        this.optItems[index].profileImage = profileImage;
        this.optItems[index].availability = availability;
        this.optItems[index].badgeStatus = badgeStatus;
        this.optItems[index].postedFrom = postedFrom;
        this.optItems[index].userName = userName;
        this.optItems[index].listCreatedOn =listlocalcreatedOnDate;
        this.optItems[index].createdOn =localcreatedOnDate;
        this.optItems[index].date =dateTime[0];
        this.optItems[index].time =dateTime[1];
        this.optItems[index].make =make;
        this.optItems[index].model =model;
        this.optItems[index].year =year;
        this.optItems[index].threadAcces =threadAcces;
        this.optItems[index].currentDtc =currentDtc;
        this.optItems[index].curentDtclength =curentDtclength;
        this.optItems[index].viewCount =viewCount;
        this.optItems[index].likeCount =likeCount;
        this.optItems[index].pinCount =pinCount;
        this.optItems[index].replyCount =replyCount;
        this.optItems[index].closeStatus =closeStatus;
        this.optItems[index].newThreadTypeSelect =newThreadTypeSelect;
        this.optItems[index].summitFix =summitFix;
        this.optItems[index].scorePoint =scorePoint;
        this.optItems[index].escalateStatus =escalateStatus;
        this.optItems[index].escColorCodes =escColorCodes;
        this.optItems[index].escColorCodesValue =escColorCodesValue;
        this.optItems[index].fixStatus =fixStatus;
        this.optItems[index].fixPostStatus =fixPostStatus;
        this.optItems[index].postId =postId;
        this.optItems[index].likeStatus =likeStatus;
        this.optItems[index].shareFix =shareFix;
        this.optItems[index].pinStatus =pinStatus;
        this.optItems[index].uploadContents =uploadContents;
        this.optItems[index].moreAttachments = moreAttachments;
        this.optItems[index].newNotificationState = "";
        this.optItems[index].state = "active";      
        if(this.thumbView) {
          this.backScroll();
        }
      } else {
        if (push == true) {
          this.optItems.unshift({
            optId: optId,
            threadTitle: threadTitle,
            threadStatus: threadStatus,
            badgeTopUser: badgeTopUser,
            threadStatusBgColor: threadStatusBgColor,
            threadStatusColorValue: threadStatusColorValue,
            profileImage: profileImage,
            availability: availability,
            badgeStatus: badgeStatus,
            postedFrom: postedFrom,
            userName: userName,
            createdOn: localcreatedOnDate,
            listCreatedOn: listlocalcreatedOnDate,
            date: dateTime[0],
            time: dateTime[1],
            make: make,
            model: model,
            year: year,
            threadAcces: threadAcces,
            currentDtc: currentDtc,
            curentDtclength: curentDtclength,
            viewCount: viewCount,
            likeCount: likeCount,
            pinCount: pinCount,
            replyCount: replyCount,
            closeStatus: closeStatus,
            newThreadTypeSelect: newThreadTypeSelect,
            summitFix: summitFix,
            scorePoint: scorePoint,
            escalateStatus: escalateStatus,
            escColorCodes: escColorCodes,
            escColorCodesValue: escColorCodesValue,
            fixStatus: fixStatus,
            fixPostStatus: fixPostStatus,
            postId: postId,
            likeStatus: likeStatus,
            shareFix: shareFix,
            pinStatus: pinStatus,
            uploadContents: uploadContents,
            moreAttachments: moreAttachments,
            newNotificationState: newPushClass,
            state: "active",
          });
          if(this.thumbView) {
            this.masonry.reloadItems();
            this.updateMasonryLayout = true;
            setTimeout(() => {
              this.opacityFlag = false;
              this.updateMasonryLayout = false;
            }, 50);
          }
        } else {
          this.optItems.push({
            optId: optId,
            threadTitle: threadTitle,
            threadStatus: threadStatus,
            badgeTopUser: badgeTopUser,
            threadStatusBgColor: threadStatusBgColor,
            threadStatusColorValue: threadStatusColorValue,
            profileImage: profileImage,
            availability: availability,
            badgeStatus: badgeStatus,
            postedFrom: postedFrom,
            userName: userName,
            listCreatedOn: listlocalcreatedOnDate,
            createdOn: localcreatedOnDate,
            date: dateTime[0],
            time: dateTime[1],
            make: make,
            model: model,
            year: year,
            threadAcces: threadAcces,
            currentDtc: currentDtc,
            curentDtclength: curentDtclength,
            viewCount: viewCount,
            likeCount: likeCount,
            pinCount: pinCount,
            replyCount: replyCount,
            closeStatus: closeStatus,
            newThreadTypeSelect: newThreadTypeSelect,
            summitFix: summitFix,
            scorePoint: scorePoint,
            escalateStatus: escalateStatus,
            escColorCodes: escColorCodes,
            escColorCodesValue: escColorCodesValue,
            fixStatus: fixStatus,
            fixPostStatus: fixPostStatus,
            postId: postId,
            likeStatus: likeStatus,
            shareFix: shareFix,
            pinStatus: pinStatus,
            uploadContents: uploadContents,
            moreAttachments: moreAttachments,
            newNotificationState: newPushClass,
            state: "active",
          });
        }
      }
    }
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.scroll(event);  
  }

  scroll = (event: any): void => {

  };

  optClick(item, event, action='same') {
    console.log(item, event)
  }

  backScroll(optId = 0) {
    let scrollPos = localStorage.getItem('wsScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;    
    setTimeout(() => {
      localStorage.removeItem('wsScrollPos');
      //if(optId == 0) {
        this.updateMasonryLayout = true;
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 50);
      //}
      setTimeout(() => {
        let id = (this.thumbView) ? 'thread-data-container' : 'file-datatable';
        this.scrollToElem(id, optId);
      }, 500);
    }, 5);
  }

   // Scroll to element
   scrollToElem(id, optId = 0) {
    let secElement = document.getElementById(id);
    console.log(id, secElement.offsetTop, this.thumbView, this.scrollTop)
    if(this.thumbView) {
      secElement.scrollTop = this.scrollTop;
    } else {
      this.table.scrollTo({'top': this.scrollTop});
    }
    
    if(optId == 0) {
      this.opacityFlag = false;      
    }
  }

  ngOnDestroy() {
    let flag = false;
    this.loading = flag;
    this.centerloading = flag; 
    this.subscription.unsubscribe();
    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove(this.bodyClass2);
    this.industryType = this.sharedSvc.getIndustryType();
    if (this.industryType.id == 2) {
      this.errorDtcActiveIcon = "assets/images/common/engine-icon.png";
      this.errorDtcIcon = "assets/images/common/engine-gray-icon.png";
    }
  }
}
