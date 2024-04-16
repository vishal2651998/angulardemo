import { Injectable } from "@angular/core";
import * as moment from "moment";
import {HttpClient, HttpParams } from "@angular/common/http";
import { contentTypeInfo, industryTypes,PlatFormType, Constant, filterNames, filterFields, silentItems, pageTitle, RedirectionPage } from "../../common/constant/constant";
import { ApiService } from "../api/api.service";
import { AuthenticationService  } from "../authentication/authentication.service";
import { LandingpageService } from "../landingpage/landingpage.service";
import { UserDashboardService } from "../user-dashboard/user-dashboard.service";
import { FilterService } from "../.../../../services/filter/filter.service";
import { DashboardService } from "../.../../../services/dashboard/dashboard.service";
import { WorkstreamService } from "../.../../../services/workstream/workstream.service";
import { MediaManagerService } from "../.../../../services/media-manager/media-manager.service";
import { FormControl } from "@angular/forms";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { ThreadService } from "../thread/thread.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private messageSource = new Subject();
  public _OnMessageReceivedSubject: Subject<string>;
  public   _OnPushMessageReceivedSubject: Subject<string>;
  public _OnChatNotificationReceivedSubject: Subject<string>;
  public _OnLeftSideMenuBarSubject: Subject<string>;
  public _OnWorkstreamMessageReceivedSubject: Subject<string>;
  public _OnLayoutStatusReceivedSubject: Subject<string>;
  public _OnLayoutTSStatusReceivedSubject: Subject<string>;
  public _OnLayoutTSSuccessMsgReceivedSubject: Subject<string>;
  public _OnLayoutStatusReceivedSubjectNew: Subject<string>;
  public _toreceiveSearchValuetoHeader: Subject<string>;
  public _toreceiveSearchEmptyValuetoHeader: Subject<string>;
  public notificationHeaderSubject: Subject <string>;
  public searchApiCallSubject: Subject <string>;

  public _OnLayoutChangeReceivedSubject: Subject<string>;
  public mediaDataReceivedSubject: Subject<string>;
  public knowledgeBaseViewDataReceivedSubject: Subject<string>;
  public knowledgeBasePushDataReceivedSubject: Subject<string>;
  public knowledgeBaseListDataReceivedSubject: Subject<string>;
  public knowledgeBaseListWsDataReceivedSubject: Subject<string>;
  public tvsSSODataReceivedSubject: Subject<string>;
  public emitNotificationDataSubject: Subject<string>;
  public emitNotificationThreadRecentDataSubject: Subject<string>;

  public partListDataReceivedSubject: Subject<string>;
  public directoryListDataReceivedSubject: Subject<string>;
  public partListWsDataReceivedSubject: Subject<string>;
  public directoryListWsDataReceivedSubject: Subject<string>;
  public gtsListDataReceivedSubject: Subject<string>;
  public TechsupportFilterReceivedSubject: Subject<string>;

  public gtsListWsDataReceivedSubject: Subject<string>;
  public knowledgeArticleDataReceivedSubject: Subject<string>;
  public KADetailCloseReceivedSubject: Subject<string>;
  public KAWorkstreamReceivedSubject: Subject<string>;
  public knowledgeArticleCatListDataReceivedSubject: Subject<string>;
  public knowledgeArticleWsDataReceivedSubject: Subject<string>;
  public knowledgeBaseLayoutDataReceivedSubject: Subject<string>;
  public partLayoutDataReceivedSubject: Subject<string>;
  public TSListDataReceivedSubject: Subject<string>;
  public dynamicFieldDataReceivedSubject: Subject<string>;
  public deleteArticlesDataReceivedSubject: Subject<string>;
  public deleteRODataReceivedSubject: Subject<string>;
  public updateRODataReceivedSubject: Subject<string>;
  public dynamicFieldDataResponseSubject: Subject<string>;
  public documentListDataReceivedSubject: Subject<string>;
  public documentNewListDataReceivedSubject: Subject<string>;
  public documentApiCallSubject: Subject<string>;
  public emitOnCloseSearchCallSubject: Subject<string>;
  public emitThreadDetailReplyDataSubject: Subject<string>;
  public emitThreadDetailRecentIdSubject: Subject<string>
  public emitThreadDetailRecentUpdateSubject: Subject<string>
  public emitThreadDetailReplyIdSubject: Subject<string>;
  public emitThreadDetailReplyUpdateSubject: Subject<string>;
  public emitThreadDetailCommentUpdateSubject: Subject<string>;
  public ThreadDetailCommentDataSubject: Subject<string>;



  public emitOnHomeCallSubject: Subject<string>;
  public NewButtonHeaderCallReceivedSubject: Subject<string>;
  public NewButtonSSHeaderCallReceivedSubject: Subject<string>;
  public emitOnDocAddClassCallSubject: Subject<string>;
  public emitOnCloseDetailPageCollapseSubject: Subject<string>;
  public emitOnThreadsPageLoadingSymbolSubject: Subject<string>;
  public emitOnDocScrollSubject: Subject<string>;
  public _OnRightPanelOpenSubject: Subject<string>;
  public documentWSApiCallSubject: Subject<string>;
  public documentFileListData: Subject<string>;
  public documentInfoDataReceivedSubject: Subject<string>;
  public documentPanelDataReceivedSubject: Subject<string>;
  public documentPanelFlagReceivedSubject: Subject<string>;
  public docScroll: Subject<string>;
  public docRPanelClose: Subject<string>;
  public docNewFolderOpen: Subject<string>;
  public workoderDataReceivedSubject: Subject<string>;
  public postDataReceivedSubject: Subject<string>;
  public workorderUploadDataReceivedSubject: Subject<string>;
  public userProfileUploadDataReceivedSubject: Subject<string>;
  public presetsUploadDataReceivedSubject: Subject<string>;
  public welcomemsgUploadDataReceivedSubject: Subject<string>;
  public presetsListDataReceivedSubject: Subject<string>;
  public postDataNotificationReceivedSubject: Subject<string>;
  public welcomeContentReceivedSubject: Subject<string>;
  public helpContentReceivedSubject: Subject<string>;
  public escalationLevelDataReceivedSubject: Subject<string>;
  public announcementListDataReceivedSubject: Subject<string>;
  public announcementLayoutDataReceivedSubject: Subject<string>;
  public announcementFilterData: Subject<string>;
  public detailData: Subject<string>;
  public shopListDataReceivedSubject: Subject<string>;
  public roListDataReceivedSubject: Subject<string>;
  public roDetailDataReceivedSubject: Subject<string>;
  public shopDetailDataCloseReceivedSubject: Subject<string>;
  public sibListDataReceivedSubject: Subject<string>;
  public sibListWsDataReceivedSubject: Subject<string>;
  public sibLayoutDataReceivedSubject: Subject<string>;
  public workstreamListDataReceivedSubject: Subject<string>;
  public sidebarMenuDataReceivedSubject: Subject<string>;
  public docViewLoadSubject: Subject<string>;
  public mediaUploadDataSubject: Subject<string>;
  public searchInfoDataReceivedSubject: Subject<string>;
  public uploadInfoDataReceivedSubject: Subject<string>;
  public cloudTabDataReceivedSubject: Subject<string>;
  public cloudTabApplyDataReceivedSubject: Subject<string>;
  public directoryUserIdReceivedSubject: Subject<string>;
  public directoryUserDataReceivedSubject: Subject<string>;
  public threadListData: Subject<string>;
  public threadDetailCallData: Subject<string>;
  public dispatchBoardData: Subject<string>;
  public bugfeaturelistSubject: Subject<string>;
  public bugfeaturedataSubject: Subject<string>;

  public cartUpdateSubject: Subject<any>;
  public cartProductsList: BehaviorSubject<any>;

  currentMessage = this.messageSource.asObservable();

  public units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  private searchFlag: any = null;
  private wsFlag: any = null;
  public wsStatus: any = "";
  public wsLoading: boolean = true;

  public currYear: any = moment().add(2, 'years').format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public CBADomian: boolean = false;

  public searchRes = {
    total: 0,
    length: 0,
    userList: [],
  };
  public subscriberDomain=localStorage.getItem('subscriber');
  constructor(
    private http: HttpClient,
    private apiUrl: ApiService,
    private authenticationService: AuthenticationService,
    private dashboardApi: DashboardService,
    private userDashboardApi: UserDashboardService,
    private wsApi: WorkstreamService,
    private filterApi: FilterService,
    private mediaApi: MediaManagerService,
    private landingWidgetsApi: LandingpageService,
    private router: Router,
    private threadApi: ThreadService
  ) {
    this._OnMessageReceivedSubject = new Subject<string>();
    this._OnPushMessageReceivedSubject = new Subject<string>();
    this._OnChatNotificationReceivedSubject = new Subject<string>();
    this._OnLeftSideMenuBarSubject = new Subject<string>();
    this._OnWorkstreamMessageReceivedSubject = new Subject<string>();
    this.notificationHeaderSubject = new Subject<string>();
    this._OnLayoutStatusReceivedSubject = new Subject<string>();
    this._OnLayoutTSStatusReceivedSubject = new Subject<string>();
    this._OnLayoutTSSuccessMsgReceivedSubject = new Subject<string>();
    this._OnLayoutStatusReceivedSubjectNew = new Subject<string>();
    this._toreceiveSearchValuetoHeader = new Subject<string>();
    this._toreceiveSearchEmptyValuetoHeader = new Subject<string>();
    this._OnLayoutChangeReceivedSubject = new Subject<string>();
    this.mediaDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseViewDataReceivedSubject = new Subject<string>();
    this.knowledgeBasePushDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseListDataReceivedSubject = new Subject<string>();
    this.partListDataReceivedSubject = new Subject<string>();
    this.directoryListDataReceivedSubject = new Subject<string>();
    this.tvsSSODataReceivedSubject = new Subject<string>();
    this.emitNotificationDataSubject = new Subject<string>();
    this.emitNotificationThreadRecentDataSubject = new Subject<string>();

    this.searchApiCallSubject = new Subject<string>();
    this.gtsListDataReceivedSubject = new Subject<string>();
    this.TechsupportFilterReceivedSubject = new Subject<string>();
    this.knowledgeBaseListWsDataReceivedSubject = new Subject<string>();
    this.partListWsDataReceivedSubject = new Subject<string>();
    this.directoryListWsDataReceivedSubject = new Subject<string>();
    this.knowledgeArticleWsDataReceivedSubject = new Subject<string>();
    this.gtsListWsDataReceivedSubject = new Subject<string>();
    this.knowledgeArticleDataReceivedSubject = new Subject<string>();
    this.KADetailCloseReceivedSubject = new Subject<string>();
    this.KAWorkstreamReceivedSubject = new Subject<string>();
    this.knowledgeArticleCatListDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseLayoutDataReceivedSubject = new Subject<string>();
    this.partLayoutDataReceivedSubject = new Subject<string>();
    this.TSListDataReceivedSubject = new Subject<string>();
    this.dynamicFieldDataReceivedSubject = new Subject<string>();
    this.deleteArticlesDataReceivedSubject = new Subject<string>();
    this.deleteRODataReceivedSubject = new Subject<string>();
    this.updateRODataReceivedSubject = new Subject<string>();
    this.dynamicFieldDataResponseSubject = new Subject<string>();
    this.documentListDataReceivedSubject = new Subject<string>();
    this.documentNewListDataReceivedSubject = new Subject<string>();
    this.documentApiCallSubject = new Subject<string>();
    this.emitOnCloseSearchCallSubject = new Subject<string>();
    this.emitThreadDetailRecentIdSubject = new Subject<string>();
    this.emitThreadDetailRecentUpdateSubject = new Subject<string>();
    this.emitThreadDetailReplyDataSubject = new Subject<string>();
    this.emitThreadDetailReplyIdSubject = new Subject<string>();
    this.emitThreadDetailReplyUpdateSubject = new Subject<string>();
    this.emitThreadDetailCommentUpdateSubject = new Subject<string>();
    this.ThreadDetailCommentDataSubject = new Subject<string>();
    this.emitOnHomeCallSubject = new Subject<string>();
    this.NewButtonHeaderCallReceivedSubject = new Subject<string>();
    this.NewButtonSSHeaderCallReceivedSubject = new Subject<string>();
    this.emitOnDocAddClassCallSubject = new Subject<string>();
    this.emitOnCloseDetailPageCollapseSubject = new Subject<string>();
    this.emitOnThreadsPageLoadingSymbolSubject = new Subject<string>();
    this.emitOnDocScrollSubject = new Subject<string>();
    this._OnRightPanelOpenSubject = new Subject<string>();
    this.documentWSApiCallSubject = new Subject<string>();
    this.documentFileListData = new Subject<string>();
    this.documentInfoDataReceivedSubject = new Subject<string>();
    this.documentPanelDataReceivedSubject = new Subject<string>();
    this.documentPanelFlagReceivedSubject = new Subject<string>();
    this.docScroll = new Subject<string>();
    this.docRPanelClose = new Subject<string>();
    this.docNewFolderOpen = new Subject<string>();
    this.postDataReceivedSubject = new Subject<string>();
    this.workoderDataReceivedSubject = new Subject<string>();
    this.presetsListDataReceivedSubject = new Subject<string>();
    this.workorderUploadDataReceivedSubject = new Subject<string>();
    this.userProfileUploadDataReceivedSubject = new Subject<string>();
    this.presetsUploadDataReceivedSubject = new Subject<string>();
    this.welcomemsgUploadDataReceivedSubject = new Subject<string>();
    this.postDataNotificationReceivedSubject = new Subject<string>();
    this.welcomeContentReceivedSubject = new Subject<string>();
    this.escalationLevelDataReceivedSubject = new Subject<string>();
    this.helpContentReceivedSubject = new Subject<string>();
    this.announcementListDataReceivedSubject = new Subject<string>();
    this.announcementLayoutDataReceivedSubject = new Subject<string>();
    this.announcementFilterData = new Subject<string>();
    this.detailData = new Subject<string>();
    this.shopListDataReceivedSubject = new Subject<string>();
    this.roListDataReceivedSubject = new Subject<string>();
    this.roDetailDataReceivedSubject = new Subject<string>();
    this.shopDetailDataCloseReceivedSubject = new Subject<string>();
    this.sibListDataReceivedSubject = new Subject<string>();
    this.sibListWsDataReceivedSubject = new Subject<string>();
    this.sibLayoutDataReceivedSubject = new Subject<string>();
    this.workstreamListDataReceivedSubject = new Subject<string>();
    this.sidebarMenuDataReceivedSubject = new Subject<string>();
    this.docViewLoadSubject = new Subject<string>();
    this.mediaUploadDataSubject = new Subject<string>();
    this.searchInfoDataReceivedSubject = new Subject<string>();
    this.uploadInfoDataReceivedSubject = new Subject<string>();
    this.cloudTabDataReceivedSubject = new Subject<string>();
    this.cloudTabApplyDataReceivedSubject = new Subject<string>();
    this.directoryUserIdReceivedSubject = new Subject<string>();
    this.directoryUserDataReceivedSubject = new Subject<string>();
    this.threadListData = new Subject<string>();
    this.threadDetailCallData = new Subject<string>();
    this.dispatchBoardData = new Subject<string>();
    this.bugfeaturelistSubject = new Subject<string>();
    this.bugfeaturedataSubject = new Subject<string>();
    this.cartUpdateSubject = new Subject<any>();
    this.cartProductsList = new BehaviorSubject<any>(null);
  }

  //TVS SSO Data Receive
  public emittvsSSOData(data: any): void {
    this.tvsSSODataReceivedSubject.next(data);
  }

  public emitNotificationData(data: any): void {
    this.emitNotificationDataSubject.next(data);
  }
  public emitNotificationhreadRecentData(data: any): void {
    this.emitNotificationThreadRecentDataSubject.next(data);
  }

  public emitOnLeftSideMenuBarSubject(msg: any): void {
    this._OnLeftSideMenuBarSubject.next(msg);
  }

  public emitMessageReceived(msg: any): void {
    this._OnMessageReceivedSubject.next(msg);
  }

  public sharePushMessageReceived(msg: any): void {
    this._OnPushMessageReceivedSubject.next(msg);
  }

  public emitChatNotification(msg: any): void {
    this._OnChatNotificationReceivedSubject.next(msg);
  }

  public emitWorkstreamReceived(msg: any): void {
    this._OnWorkstreamMessageReceivedSubject.next(msg);
  }
  public emitMessageLayoutrefresh(msg: any): void {
    this._OnLayoutStatusReceivedSubject.next(msg);
  }
  public emitTSLayoutrefresh(msg: any): void {
    this._OnLayoutTSStatusReceivedSubject.next(msg);
  }
  public emitTSSuccessMsg(msg: any): void {
    this._OnLayoutTSSuccessMsgReceivedSubject.next(msg);
  }
  public emitMessageLayoutrefreshNew(msg: any): void {
    this._OnLayoutStatusReceivedSubjectNew.next(msg);
  }
  // Emit search value from search History to header
  public emitSearchValuetoHeader(msg: any): void {
    this._toreceiveSearchValuetoHeader.next(msg);
  }

  // Emit search value from search History to header
  public emitSearchEmptyValuetoHeader(msg: any): void {
    this._toreceiveSearchEmptyValuetoHeader.next(msg);
  }

  public emitMessageLayoutChange(msg: any): void {
    this._OnLayoutChangeReceivedSubject.next(msg);
  }

  public emitSearchApiCall(data: any): void {
    this.searchApiCallSubject.next(data);
  }

  // Media List Data Receive
  public emitMediaData(data: any): void {
    this.mediaDataReceivedSubject.next(data);
  }

  //knowledgebase Base View Detail Info Data Receive
  public emitKnowledgeBaseViewData(data: any): void {
    this.knowledgeBaseViewDataReceivedSubject.next(data);
  }

  //knowledgebase PUSH List Info Data Receive
  public emitKnowledgeBasePushData(data: any): void {
    this.knowledgeBasePushDataReceivedSubject.next(data);
  }

  //knowledgebase List Info Data Receive
  public emitKnowledgeBaseListData(data: any): void {
    this.knowledgeBaseListDataReceivedSubject.next(data);
  }

  // Knowledge Base List WS Info Data Receive
  public emiKnowledgeBaseListWsData(data: any): void {
    this.knowledgeBaseListWsDataReceivedSubject.next(data);
  }

  // Part List Info Data Receive
  public emitPartListData(data: any): void {
    this.partListDataReceivedSubject.next(data);
  }

  // Directory List Info Data Receive
  public emitDirectoryListData(data: any): void {
    this.directoryListDataReceivedSubject.next(data);
  }


  // Part List WS Info Data Receive
  public emitPartListWsData(data: any): void {
    this.partListWsDataReceivedSubject.next(data);
  }

  // Part List WS Info Data Receive
  public emitDirectoryListWsData(data: any): void {
    this.directoryListWsDataReceivedSubject.next(data);
  }

  //GTS List Info Data Resolve
  public emitGTSLIstData(data: any): void {
    this.gtsListDataReceivedSubject.next(data);
  }

  // Part List WS Info Data Receive
  public emitGTSLIstWsData(data: any): void {
    this.gtsListWsDataReceivedSubject.next(data);
  }
  // KA List category Data Receive
  public emitKADetailCloseData(data: any): void {
    this.KADetailCloseReceivedSubject.next(data);
  }

   // KA List category Data Receive
   public emitKAWorkstreamData(data: any): void {
    this.KAWorkstreamReceivedSubject.next(data);
  }

  // KA List Info Data Receive
  public emitKnowledgeListData(data: any): void {
    this.knowledgeArticleDataReceivedSubject.next(data);
  }
  // KA List Info Data Receive
  public emitKnowledgeCatListData(data: any): void {
    this.knowledgeArticleCatListDataReceivedSubject.next(data);
  }
  // KA List WS Info Data Receive
  public emitKnowledgeListWsData(data: any): void {
    this.knowledgeArticleWsDataReceivedSubject.next(data);
  }

  // Document List Info Data Receive
  public emitDocumentListData(data: any): void {
    this.documentListDataReceivedSubject.next(data);
  }

  // Document List Info Data Receive
  public emitDocumentNewListData(data: any): void {
    this.documentNewListDataReceivedSubject.next(data);
  }

  // Document Api Call Data Receive
  public emitDocumentApiCallData(data: any): void {
    this.documentApiCallSubject.next(data);
  }

   // Document Api Call Data Receive
   public emitCloseSearchCallData(data: any): void {
    this.emitOnCloseSearchCallSubject.next(data);
  }

  public emitThreadDetailRecentIdData(data: any): void {
    this.emitThreadDetailRecentIdSubject.next(data);
  }

  public emitThreadDetailRecentUpdateData(data: any): void {
    this.emitThreadDetailRecentUpdateSubject.next(data);
  }

  public emitThreadDetailReplyData(data: any): void {
    this.emitThreadDetailReplyDataSubject.next(data);
  }

  public emitThreadDetailReplyId(data: any): void {
    this.emitThreadDetailReplyIdSubject.next(data);
  }

  public emitThreadDetailReplyUpdate(data: any): void {
    this.emitThreadDetailReplyUpdateSubject.next(data);
  }

  public emitThreadDetailCommentUpdate(data: any): void {
    this.emitThreadDetailCommentUpdateSubject.next(data);
  }

  public ThreadDetailCommentData(data: any): void {
    this.ThreadDetailCommentDataSubject.next(data);
  }

  public emitHomeCallData(data: any): void {
    this.emitOnHomeCallSubject.next(data);
  }

  public emitNewButtonHeaderCallData(data: any): void {
    this.NewButtonHeaderCallReceivedSubject.next(data);
  }

  public emitNewButtonSSHeaderCallData(data: any): void {
    this.NewButtonSSHeaderCallReceivedSubject.next(data);
  }

  public emitDocAddClassCallData(data: any): void {
    this.emitOnDocAddClassCallSubject.next(data);
  }

  public emitCloseDetailPageCallData(data: any): void {
    this.emitOnCloseDetailPageCollapseSubject.next(data);
  }

  public emitThreadsPageLoadingSymbolCallData(data: any): void {
    this.emitOnThreadsPageLoadingSymbolSubject.next(data);
  }

  public emitDocScrollCallData(data: any): void {
    this.emitOnDocScrollSubject.next(data);
  }

  public emitRightPanelOpenCallData(data: any): void {
    this._OnRightPanelOpenSubject.next(data);
  }

  // Document Workstream Api Call Data Receive
  public emitDocumentWsApiCallData(data: any): void {
    this.documentWSApiCallSubject.next(data);
  }

  // Document File List Data Receive
  public emitFileList(data: any): void {
    this.documentFileListData.next(data);
  }

  // Document Info Data Receive
  public emitDocumentInfoData(data: any): void {
    this.documentInfoDataReceivedSubject.next(data);
  }

  // Document Panel Data Receive
  public emitDocumentPanelData(data: any): void {
    this.documentPanelDataReceivedSubject.next(data);
  }
  //Bug and Feature List
  public emitbugfeature(data: any): void {
    this.bugfeaturelistSubject.next(data);
  }

  //Bug and Feature Data
  public emitbugfeaturedata(data: any): void{
    this.bugfeaturedataSubject.next(data);
  }
  // Document Panel Flag Data Receive
  public emitDocumentPanelFlag(data: any): void {
    this.documentPanelFlagReceivedSubject.next(data);
  }

  // Document Scroll to file
  public emitDocumentScroll(data: any): void {
    this.docScroll.next(data);
  }

  public emitDocumentRightPanel(data: any): void {
    this.docRPanelClose.next(data);
  }

  public emitDocumentNewFolder(data: any): void {
    this.docNewFolderOpen.next(data);
  }

  // Part Layout Info Data Receive
  public emitPartLayoutData(data: any): void {
    this.partLayoutDataReceivedSubject.next(data);
  }

  // Part Layout Info Data Receive
  public emitTSListData(data: any): void {
    this.TSListDataReceivedSubject.next(data);
  }

  public emitTechsupportFilterData(data: any): void {
    this.TechsupportFilterReceivedSubject.next(data);
  }

  // KnowledgeBase Layout Info Data Receive
  public emitKnowledgeBaseLayoutData(data: any): void {
    this.knowledgeBaseLayoutDataReceivedSubject.next(data);
  }

  // Dynamic Field Data Receive
  public emitDynamicFieldData(data: any): void {
    this.dynamicFieldDataReceivedSubject.next(data);
  }

  public deleteArticlesData(data: any): void {
    this.deleteArticlesDataReceivedSubject.next(data);
  }

  public deleteROData(data: any): void {
    this.deleteRODataReceivedSubject.next(data);
  }

  public updateROData(data: any): void {
    this.updateRODataReceivedSubject.next(data);
  }

  // Dynamic Field Data Response
  public emitDynamicFieldResponse(data: any): void {
    this.dynamicFieldDataResponseSubject.next(data);
  }

  // post data response
  public emitPostData(data: any): void {
    this.postDataReceivedSubject.next(data);
  }

  // post data response
  public emitWorkorderData(data: any): void {
    this.workoderDataReceivedSubject.next(data);
  }

  // post data response
  public emitpresetsUpload(data: any): void {
    this.presetsUploadDataReceivedSubject.next(data);
  }

  // post data response
  public emitWelcomemsgUpload(data: any): void {
    this.welcomemsgUploadDataReceivedSubject.next(data);
  }

  // post data response
  public emitworkorderUpload(data: any): void {
    this.workorderUploadDataReceivedSubject.next(data);
  }

  // post data response
  public emitUserProfileUpload(data: any): void {
    this.userProfileUploadDataReceivedSubject.next(data);
  }

  // post data response
  public emitPresetsListCallData(data: any): void {
    this.presetsListDataReceivedSubject.next(data);
  }



  // post data response
  public emitPostDataNotification(data: any): void {
    this.postDataNotificationReceivedSubject.next(data);
  }


  // Part Layout Info Data Receive
  public emitAnnouncementLayoutData(data: any): void {
    this.announcementLayoutDataReceivedSubject.next(data);
  }

  // Announcement List Info Data Receive
  public emitAnnouncementListData(data: any): void {
    this.announcementListDataReceivedSubject.next(data);
  }

  // Announcement Filer
  public emitAnnouncementFilterData(data: any): void {
    this.announcementFilterData.next(data);
  }

  // welcome content
  public emitWelcomeContentView(data: any): void {
    this.welcomeContentReceivedSubject.next(data);
  }

   // welcome content
   public emitEscalationLevelView(data: any): void {
    this.escalationLevelDataReceivedSubject.next(data);
  }

  // help content
  public emitHelpContentView(data: any): void {
    this.helpContentReceivedSubject.next(data);
  }

  // Detail Data
  public emitDetailData(data: any): void {
    this.detailData.next(data);
  }

  // SIB List Info Data Receive
  public emitSibListData(data: any): void {
    this.sibListDataReceivedSubject.next(data);
  }

  // SHOP List Info Data Receive
  public emitShopListData(data: any): void {
    this.shopListDataReceivedSubject.next(data);
  }

  // repair order List Info Data Receive
  public emitROListData(data: any): void {
    this.roListDataReceivedSubject.next(data);
  }


  // repair order List Info Data Receive
  public emitRODetailData(data: any): void {
    this.roDetailDataReceivedSubject.next(data);
  }

  // SHOP List Info Data Receive
  public emitShopDetailDataClose(data: any): void {
    this.shopDetailDataCloseReceivedSubject.next(data);
  }

  // SIB List WS Info Data Receive
  public emitSibListWsData(data: any): void {
    this.sibListDataReceivedSubject.next(data);
  }

  // SIB Layout Info Data Receive
  public emitSibLayoutData(data: any): void {
    this.sibLayoutDataReceivedSubject.next(data);
  }

  public emitWorkstreamListData(data: any): void {
    this.workstreamListDataReceivedSubject.next(data);
  }

  // Sidebar Menu icon update
  public emitSidebarMenuData(data: any): void {
    this.sidebarMenuDataReceivedSubject.next(data);
  }

  // Document View Load on close window on nav edit
  public emitDocViewLoad(data: any): void {
    this.docViewLoadSubject.next(data);
  }

  // Media Upload Data
  public emitMediaUploadData(data: any): void {
    this.mediaUploadDataSubject.next(data);
  }

  // Notification Header on/off
  public emitNotificationHeader(data: any): void {
    this.notificationHeaderSubject.next(data);
  }

  // Search Info Data
  public emitSearchInfoData(data: any): void {
    this.searchInfoDataReceivedSubject.next(data);
  }

  // file upload Data
  public emitUploadInfoData(data: any): void {
    this.uploadInfoDataReceivedSubject.next(data);
  }

  // open cloud tab
  public emitCloudTabData(data: any): void {
    this.cloudTabDataReceivedSubject.next(data);
  }

  public emitCloudTabApplyData(data: any): void {
    this.cloudTabApplyDataReceivedSubject.next(data);
  }

  // directory
  public emitDirectoryUserId(data: any): void {
    this.directoryUserIdReceivedSubject.next(data);
  }

  // directory
  public emitDirectoryUserData(data: any): void {
    this.directoryUserDataReceivedSubject.next(data);
  }

  // Change Message
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  // get thread list
  public emitThreadListData(msg: any): void {
    this.threadListData.next(msg);
  }

   // get thread list
   public emitThreadDetailCallData(msg: any): void {
    this.threadDetailCallData.next(msg);
  }


  // Dispatch Board Data
  public emitDispatchBoardData(data: any): void {
    this.dispatchBoardData.next(data);
  }

  // Get Menu List
  getMenuLists(probingData, access = "") {
    if (access == "dashboard") {
      return this.http.post<any>(
        this.apiUrl.apiGetDashMenuLists(),
        probingData
      );
    } else {
      return this.http.post<any>(this.apiUrl.apiGetMenuLists(), probingData);
    }
  }

  checkUsername(control: FormControl): any {
    return new Promise((resolve) => {
      //Fake a slow response from server
      setTimeout(() => {
        if (control.value === "greg") {
          resolve(true);
        } else {
          resolve(null);
        }
      }, 2000);
    });
  }

  getModifiedThreadData(threadInfo, threadListData, threadType) {
    let threadLists = threadInfo[0] == "exportThread" ? [] : threadInfo[1];
    for (let i in threadListData) {
      let createdDate = moment.utc(threadListData[i].created_on).toDate();
      let localCreatedDate = moment(createdDate)
        .local()
        .format("MMM DD, YYYY h:mm A");
      let proposedFixCreatedDate = moment
        .utc(threadListData[i].proposedFix_createdOn)
        .toDate();
      let localProposedFixCreatedDate = moment(proposedFixCreatedDate)
        .local()
        .format("MMM DD, YYYY h:mm A");

        let FirstReplyCreatedDate = moment
        .utc(threadListData[i].firstReplyFromEmp)
        .toDate();
      let localFirstReplyCreatedDate = moment(FirstReplyCreatedDate)
        .local()
        .format("MMM DD, YYYY h:mm A");

      let threadFixDate = moment.utc(threadListData[i].threadFixDate).toDate();
      let localThreadFixDate = moment(threadFixDate)
        .local()
        .format("MMM DD, YYYY h:mm A");

       
      threadListData[i].created_on =
        threadListData[i].created_on == ""
          ? threadListData[i].created_on
          : localCreatedDate;
      threadListData[i].proposedFix_createdOn =
        threadListData[i].proposedFix_createdOn == ""
          ? threadListData[i].proposedFix_createdOn
          : localProposedFixCreatedDate;

          threadListData[i].firstReplyFromEmp =
          threadListData[i].firstReplyFromEmp == ""
            ? threadListData[i].firstReplyFromEmp
            : localFirstReplyCreatedDate;


      threadListData[i].threadFixDate =
        threadListData[i].threadFixDate == ""
          ? threadListData[i].threadFixDate
          : localThreadFixDate;    
      if (threadType == "closed" || threadListData[i].close_status == 1) {
        let closedDate = moment.utc(threadListData[i].close_date).toDate();
        let localClosedDate = moment(closedDate)
          .local()
          .format("MMM DD, YYYY h:mm A");
        threadListData[i].close_date =
          threadListData[i].close_date == ""
            ? threadListData[i].close_date
            : localClosedDate;
        let timeToClose;
        let closeTimeTxt;
        if (threadListData[i].close_date != "") {
          timeToClose = moment(localClosedDate)
            .utc()
            .diff(localCreatedDate, "hours");
          if (timeToClose == 0) {
            let timeToCloeMin = moment(localClosedDate)
              .utc()
              .diff(localCreatedDate, "minutes");
            if (timeToCloeMin == 0) {
              timeToClose = "-";
            } else {
              closeTimeTxt = timeToCloeMin > 1 ? " mins" : " min";
              timeToClose = timeToCloeMin;
              //timeToClose = timeToCloeMin + closeTimeTxt;
            }
          } else {
            closeTimeTxt = timeToClose > 1 ? " hrs" : " hr";
            timeToClose = timeToClose;
          }
        } else {
          timeToClose = "-";
        }
        threadListData[i]["timeToClose"] = timeToClose;
      }
      let timeToRespond;
      let timeTxt;
      let timeToFix:any = '-';
      if (threadListData[i].proposedFix_createdOn != "") {
        timeToRespond = moment(localProposedFixCreatedDate)
          .utc()
          .diff(localCreatedDate, "hours");
        if (timeToRespond == 0) {
          let timeToRespondMin = moment(localProposedFixCreatedDate)
            .utc()
            .diff(localCreatedDate, "minutes");
          if (timeToRespondMin == 0) {
            timeToRespond = "-";
          } else {
            timeTxt = timeToRespondMin > 1 ? " hr" : " hr";
            timeToRespondMin = timeToRespondMin / 60;
            let timeToRespondMin2 = timeToRespondMin.toFixed(1);
            //timeToRespond = timeToRespondMin2 + timeTxt;
            timeToRespond = timeToRespondMin2;
          }
        } else {
          timeTxt = timeToRespond > 1 ? " hrs" : " hr";
          //timeToRespond = timeToRespond + timeTxt;
          timeToRespond = timeToRespond;
        }
      } else {
        timeToRespond = "-";
      }


      if (threadListData[i].threadFixDate != "") {
        timeToFix = moment(localThreadFixDate)
          .utc()
          .diff(localCreatedDate, "hours");
        if (timeToFix == 0) {
          let timeToRespondMin = moment(localThreadFixDate)
            .utc()
            .diff(localCreatedDate, "minutes");
          if (timeToRespondMin == 0) {
            timeToFix = "-";
          } else {
            timeTxt = timeToRespondMin > 1 ? " hr" : " hr";
            timeToRespondMin = timeToRespondMin / 60;
            let timeToRespondMin2 = timeToRespondMin.toFixed(1);
           // timeToFix = timeToRespondMin2 + timeTxt;
            timeToFix = timeToRespondMin2;
          }
        } else {
          timeTxt = timeToFix > 1 ? " hrs" : " hr";
          //timeToFix = timeToFix + timeTxt;
          timeToFix = timeToFix;
        }
      } else {
        threadListData[i].threadFixDate = "-";
      }

// Time to Response first 

let timeToFirstRespond;
      let timeFirstTxt;
      let timeForFirstToFix:any = '-';
      if (threadListData[i].firstReplyFromEmp != "") {
        timeToFirstRespond = moment(localFirstReplyCreatedDate)
          .utc()
          .diff(localCreatedDate, "hours");
        if (timeToFirstRespond == 0) {
          let timeToFirstRespondMin = moment(localFirstReplyCreatedDate)
            .utc()
            .diff(localCreatedDate, "minutes");
          if (timeToFirstRespondMin == 0) {
            timeToFirstRespond = "-";
          } else {
            timeFirstTxt = timeToFirstRespondMin > 1 ? " hr" : " hr";
            timeToFirstRespondMin = timeToFirstRespondMin / 60;
            let timeToRespondMin2 = timeToFirstRespondMin.toFixed(1);
          //  timeToFirstRespond = timeToRespondMin2 + timeFirstTxt;
            timeToFirstRespond = timeToRespondMin2;
          }
        } else {
          timeFirstTxt = timeToFirstRespond > 1 ? " hrs" : " hr";
          //timeToFirstRespond = timeToFirstRespond + timeFirstTxt;
          timeToFirstRespond = timeToFirstRespond;
        }
      } else {
        timeToFirstRespond = "";
      }




      
      threadListData[i]["timeToFix"] = timeToFix;
      threadListData[i]["timeToRespond"] = timeToRespond;
      threadListData[i]["firstReplyTime"] = timeToFirstRespond;
      threadListData[i]["firstReplyFromEmp"] = localFirstReplyCreatedDate;

      
      threadListData[i]["tmName"] = threadListData[i]["territory_manager"];
      threadListData[i]["prodOwnerEmail"] =
        threadListData[i].productOwner["assigneeEmail"];
      threadListData[i]["prodOwnerPhone"] =
        threadListData[i].productOwner["assigneePhone"];
      threadListData[i]["tmEmail"] =
        threadListData[i].tm_manager["assigneeEmail"];
      threadListData[i]["tmPhone"] =
        threadListData[i].tm_manager["assigneePhone"];
      threadLists.push(threadListData[i]);
    }
    return threadLists;
  }

  // Search Dashboard Input
  dashboardSearch(apiData) {
    let result;
    if (this.searchFlag) {
      this.searchFlag.unsubscribe();
      result = this.fetchData(apiData);
    } else {
      this.fetchData(apiData);
    }
    return result;
  }

  fetchData(apiData) {
    this.searchRes["userList"] = [];
    this.searchFlag = this.dashboardApi
      .apiChartDetail(apiData)
      .subscribe((response) => {
        let responseData = response.data;
        let searchResultData = responseData.chartdetails;
        let searchNoDataFlag =
          responseData.total == 0 || searchResultData.length == 0
            ? true
            : false;
        this.searchRes["total"] = responseData.total;
        this.searchRes["length"] = searchResultData.length;
        if (!searchNoDataFlag) {
          for (let user of searchResultData) {
            let id = user.userType == 2 ? user.dealerCode : user.userId;
            let name = user.userType == 2 ? user.dealerName : user.userName;
            this.searchRes["userList"].push({
              id: id,
              name: name,
            });
          }
        }
      });
    return this.searchRes;
  }

  // Check Workstream Name Exists
  checkWorkstreamName(apiData) {
    let wsNameData = new FormData();
    wsNameData.append("apiKey", apiData.apiKey);
    wsNameData.append("userId", apiData.userId);
    wsNameData.append("domainId", apiData.domainId);
    wsNameData.append("countryId", apiData.countryId);
    wsNameData.append("workstreamId", apiData.workstreamId);
    wsNameData.append("title", apiData.title);
    let result;
    if (this.wsFlag) {
      this.wsFlag.unsubscribe();
      result = this.fetchWsData(wsNameData);
    } else {
      this.fetchWsData(wsNameData);
    }
    //if(!this.wsLoading) {
    return result;
    //}
  }

  fetchWsData(apiData) {
    this.wsFlag = this.wsApi
      .checkWorkstreamName(apiData)
      .subscribe((response) => {
        this.wsStatus = response.status == "Success" ? false : true;
        this.wsLoading = false;
      });
    //if(!this.wsLoading) {
    return this.wsStatus;
    //}
  }


    fetchlangData(contentData) {
  let apiData={
    q: contentData.contentQuery,
    key:"AIzaSyDPAkmwKyNRjJpIptkNV_4tzEbyYRWrHvk",
    target:contentData.sourceLanguage,
    source:contentData.initLanguage
  }
      return this.http.post<any>(this.apiUrl.getGooglelangApiUrl(apiData), apiData);

    }


    DetectlangData(contentData) {
      let apiData={
        q: contentData,
        key:"AIzaSyDPAkmwKyNRjJpIptkNV_4tzEbyYRWrHvk",

      }
          return this.http.post<any>(this.apiUrl.DetectGoogleContentlang(apiData), apiData);

        }

  // Get Tags List
  getTagList(tagData) {
    const params = new HttpParams()
      .set("apiKey", tagData.apiKey)
      .set("userId", tagData.userId)
      .set("domainId", tagData.domainId)
      .set("countryId", tagData.countryId)
      .set("groupId", tagData.groupId)
      .set("searchKey", tagData.searchKey)
      .set("offset", tagData.offset)
      .set("limit", tagData.limit);
    const body = JSON.stringify(tagData);

    return this.http.post<any>(this.apiUrl.apiGetTagList(), body, {
      params: params,
    });
  }

  // Get Tags List
  getKeywordsList(tagData) {
    const params = new HttpParams()
      .set("offset", tagData.offset)
      .set("searchKey", tagData.searchKey)
      .set("limit", tagData.limit);

    return this.http.get<any>(this.apiUrl.apiGetKeywordsList(), {
      params: params,
    });
  }

  getLoopUpDataList(loopUpData) {
    const params = new HttpParams()
      .set("apiKey", loopUpData.apiKey)
      .set("userId", loopUpData.userId)
      .set("domainId", loopUpData.domainId)
      .set("countryId", loopUpData.countryId)
      .set("fromPPFR", loopUpData.fromPPFR)
      .set("loopUpData", loopUpData.lookUpdataId)
      .set("searchKey", loopUpData.searchKey)
      .set("isActivetrue", loopUpData.isInActive)
      .set("offset", loopUpData.offset)
      .set("limit", loopUpData.limit);
    const body = JSON.stringify(loopUpData);

    return this.http.post<any>(this.apiUrl.apigetLookupTableData(), body, {
      params: params,
    });
  }

  getEscalationLoopUpDataList(loopUpData) {
    let makeVal = loopUpData.make != undefined ? loopUpData.make : '';
    const params = new HttpParams()
      .set("apiKey", loopUpData.apiKey)
      .set("userId", loopUpData.userId)
      .set("domainId", loopUpData.domainId)
      .set("countryId", loopUpData.countryId)
      .set("commonApiValue", loopUpData.commonApiValue)
      .set("searchKey", loopUpData.searchKey)
      .set("make", makeVal)
      .set("offset", loopUpData.offset)
      .set("limit", loopUpData.limit);

    const body = JSON.stringify(loopUpData);

    return this.http.post<any>(this.apiUrl.apigetEscalationLookupTableData(), body, {
      params: params,
    });
  }

  // Add or Save Tag
  manageTag(tagData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageTag(), tagData);
  }

  manageTagMarketPlace(tagData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiAddKeywordsList(), tagData);
  }

  updateTagMarketPlace(tagData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiUpdateKeywordsList(), tagData);
  }
  //deleteTag
  apiDeleteTag(data): Observable<any> {
    return this.http.post<any>(this.apiUrl.deleteTag(), data);
  }

  deleteTagMarketPlace(data): Observable<any> {
    const params = new HttpParams()
      .set("id", data);
    return this.http.delete<any>(this.apiUrl.apiDeleteKeywordsList(), {params: params});
  }

  ManageLookUpdata(LookupData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageLookUpdata(), LookupData);
  }

  // Get Related Thread Lists
  getRelatedThreads(threadData) {
    const params = new HttpParams()
      .set("apiKey", threadData.apiKey)
      .set("userId", threadData.userId)
      .set("domainId", threadData.domainId)
      .set("countryId", threadData.countryId)
      .set("searchKey", threadData.searchKey)
      .set("vehicleInfo", threadData.vehicleInfo)
      .set("offset", threadData.offset)
      .set("limit", threadData.limit);
    const body = JSON.stringify(threadData);

    return this.http.post<any>(this.apiUrl.apiGetRelatedThreads(), body, {
      params: params,
    });
  }

  // Get Error Codes List
  getErrorCodes(errorData) {
    const params = new HttpParams()
      .set("apiKey", errorData.apiKey)
      .set("userId", errorData.userId)
      .set("domainId", errorData.domainId)
      .set("countryId", errorData.countryId)
      .set("type", errorData.type)
      .set("typeId", errorData.typeId)
      .set("searchKey", errorData.searchKey)
      .set("vehicleInfo", errorData.vehicleInfo)
      .set('threadCategoryId', errorData.threadCategoryId)
      .set("offset", errorData.offset)
      .set("limit", errorData.limit);
    const body = JSON.stringify(errorData);

    return this.http.post<any>(this.apiUrl.apiGetErrorCodes(), body, {
      params: params,
    });
  }

  // Manage Error Code
  manageErrorCode(errorData) {
    return this.http.post<any>(this.apiUrl.apiManageErrorCode(), errorData);
  }

  // Manage Part Type
  managePartType(typeData) {
    return this.http.post<any>(this.apiUrl.apiManagePartType(), typeData);
  }

  // Manage Part system
  managePartSystem(systemData) {
    return this.http.post<any>(this.apiUrl.apiManagePartSystem(), systemData);
  }

  // Manage Part Assembly
  managePartAssembly(assemblyData) {
    return this.http.post<any>(
      this.apiUrl.apiManagePartAssembly(),
      assemblyData
    );
  }

  // doc solr api
getDocumentsSolr(data,docsData={},type='') {
  const body = JSON.stringify(docsData);
  if(type == 'list'){
    return this.http.post<any>(this.apiUrl.apiSolrDocumentFileList(), body)
  }
  else if(type == 'search'){
    return this.http.post<any>(this.apiUrl.apiSolrDocumentSearchList(), body)
  }
  else{
    return this.http.post<any>(this.apiUrl.apiSolrDocumentFoldersList(), body)
  }
}

  // ka solr api
  getKACatSolr(docsData={}) {
    const body = JSON.stringify(docsData);
    return this.http.post<any>(this.apiUrl.apiSolrKACatFoldersList(), body)
  }


  // Get Vimeo Video Thumb
  getVimeoThumb(vid) {
    return this.http.get<any>(this.apiUrl.apiGetVimeoThumb(vid));
  }

    // Get Vimeo Video Thumb
    getFoldersandDocuments(data) {
      return this.http.post<any>(this.apiUrl.getFoldersandDocumentsApi(), data);
    }

  // Get Workstream Count
  GetworkstreamswithCount(typeData) {
    return this.http.post<any>(
      this.apiUrl.apiGetworkstreamswithCount(),
      typeData
    );
  }

  // Get Product/Vehicle Banner Image
  getBannerImage(bannerData) {
    return this.http.post<any>(this.apiUrl.apiGetBanner(), bannerData);
  }

  // Check youtube link
  matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
      return matches[1];
    }
    return false;
  }

  // Check vimeo link
  matchVimeoUrl(url) {
    const regExp =
      /(?:https?:\/\/(?:www\.)?)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[3] : false;
  }

  // Convert File Size
  niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    //include a decimal point and a tenths-place digit if presenting
    //less than ten of KB or greater units
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + this.units[l];
  }

  // Allow only numeric
  public restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

    // Allow only numeric
    public restrictDecimal(e) {
      let input;
      if (e.metaKey || e.ctrlKey) {
        return true;
      }
      if (e.which === 32) {
        return false;
      }
      if (e.which === 46) {
        return true;
      }
      if (e.which === 0) {
        return true;
      }
      if (e.which < 33) {
        return true;
      }
      input = String.fromCharCode(e.which);
      return !!/[\d\s]/.test(input);
    }

  // Get Filter Widgets
  getFilterWidgets(apiData, filterOptions, escInit = null) {
    let platformId: any = localStorage.getItem('platformId');
    let collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    let CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    let domainIdVal=localStorage.getItem('domainId');
    let tvsDomain = (domainIdVal == '52') ? true : false;
    let mssDomain = (domainIdVal == '82') ? true : false;
    apiData['platform'] = Constant.filterPlatform;
    let filterApiCall = true;
    let groupId = apiData.groupId;
    let filterType = filterOptions["filterType"];
    filterType = (filterType && filterType > 0) ? filterType : 0;
    apiData['solrResponse'] = [];
    apiData['solrFlag'] = false;
    let solrFlag = (collabticDomain || CBADomain || tvsDomain || mssDomain || groupId == 30 || groupId == 40) ? true : false;
    apiData['version'] = (groupId == 2 || groupId == 4 || (groupId == 6 && solrFlag) || groupId == 30 || groupId == 40) ? 2 : 0;
    if(groupId == 2 || groupId == 4 || groupId == 6 || groupId == 30) {
      let query = '';
      if(groupId == 30) {
        let searchValue = localStorage.getItem('searchValue');
        query = (searchValue && searchValue != null) ? searchValue : query;
      }

      if(solrFlag) {
        filterApiCall = false;
        let userWorkstreams=localStorage.getItem('userWorkstreams');
       // let solrFilter = {'domainId': apiData.domainId, workstreamsIds: JSON.parse(userWorkstreams)};
        //let solrFilter = {'domainId': apiData.domainId};
        let solrFilter={};
        solrFilter = {'domainId': apiData.domainId};
        if(groupId == 2 && this.subscriberDomain) {
          let domainArr=[];
          let domainVal=apiData.domainId.toString();
          domainArr.push(domainVal);
          solrFilter = {'sharedDomainsStrArr': domainArr};
        }

        let filter;
        switch (groupId) {
          case 2:
            filter = filterNames.thread;
            break;
          case 4:
            filter = filterNames.document;
            break;
          case 6:
            filter = filterNames.part;
            break;
          case 40:
            filter = filterNames.adasProcedure;
            break;  
          default:
            filter = filterNames.search;
            break;
        }

        let landingFlag = false;
        let getFilteredValues = this.getFilterValues(landingFlag, filter);
        let chkFields = ['make', 'model', 'currentDtcStrArr'];
        let getFieldValues = this.getFilterByKeyVal(chkFields, getFilteredValues);
        let makeVal, modelVal, errCodeVal, makeFlag = false, modelFlag = false, errCodeFlag = false;
        getFieldValues.forEach((item, index) => {
          let field = item.field;
          switch(field) {
            case 'make':
              if(item.isActive) {
                makeVal = Array.isArray(item.val) ? item.val[0] : item.val;
                makeFlag = true;
              }
              break;
            case 'model':
              if(item.isActive) {
                modelVal = item.val;
                modelFlag = true;
              }
              break;
            case 'currentDtcStrArr':
              if(item.isActive) {
                errCodeVal = item.val;
                solrFilter[field] = errCodeVal;
                errCodeFlag = true;
              }
              break;
          }
        });
        if(modelFlag && errCodeFlag) {
          solrFilter['make'] = makeVal;
          solrFilter['model'] = modelVal;
        }
        let solrData, filterApiAccess = '';
        if(groupId == 30) {
          filterApiAccess = 'filter';
          let listing = 0, start = 0, rows = 1;
          solrData = {
            type: filterType,
            listing,
            rows,
            start,
            query,
            filters: solrFilter
          }
        } else {
          solrData = {
            type: filterType,
            filters: solrFilter
          }
        }
        setTimeout(() => {
          this.getSolrFilterList(solrData, filterApiAccess).subscribe((response) => {
              this.setupFilterApiResponse(groupId, apiData, filterOptions, escInit, solrFlag, solrData, solrFilter, response, makeFlag, modelFlag, errCodeFlag, makeVal, modelVal, errCodeVal);
          });
          /* if(groupId == 30) {
            solrData['query'] = searchVal;
            this.landingWidgetsApi.getSolrDataDetail(solrData).subscribe((response) => {
              this.setupFilterApiResponse(groupId, apiData, filterOptions, escInit, solrFlag, solrData, solrFilter, response, makeFlag, modelFlag, errCodeFlag, makeVal, modelVal, errCodeVal);
            });
          } else {
            this.getSolrFilterList(solrData).subscribe((response) => {
              this.setupFilterApiResponse(groupId, apiData, filterOptiofilterNames.threadns, escInit, solrFlag, solrData, solrFilter, response, makeFlag, modelFlag, errCodeFlag, makeVal, modelVal, errCodeVal);
            });
          } */
        }, 500);
      }
      else {
        filterApiCall = true;
        apiData['solrFlag'] = false;
        if(platformId == PlatFormType.MahleForum) {
          localStorage.removeItem(filterNames.thread);
        }
        if(filterApiCall) {
          this.filterWidgetCallback(apiData, filterOptions, escInit = null)
        }
      }
    }
    if(filterApiCall) {
      this.filterWidgetCallback(apiData, filterOptions, escInit = null)
    }
  }

  setupFilterApiResponse(groupId, apiData, filterOptions, escInit, solrFlag, solrData, solrFilter, response, makeFlag, modelFlag, errCodeFlag, makeVal, modelVal, errCodeVal) {
    apiData['solrResponse'] = response.facets;
    apiData['solrFlag'] = solrFlag;
    if(!makeFlag && !modelFlag && !errCodeFlag) {
      apiData['solrResponse']['model'] = ['All'];
      this.filterWidgetCallback(apiData, filterOptions, escInit = null);
    } else {
      solrFilter['make'] = makeVal;
      if(modelFlag) {
        solrFilter['model'] = modelVal;
      }
      if(errCodeFlag) {
        solrFilter['currentDtcStrArr'] = errCodeVal;
      }

      if(groupId == 30) {
        this.landingWidgetsApi.getSolrDataDetail(solrData).subscribe((response) => {
          let solrRes = response.facets;
          apiData['solrResponse']['model'] = solrRes.model;
          apiData['solrResponse']['currentDtcStrArr'] = solrRes.errorCodes;
          apiData['solrResponse']['errorCodes'] = solrRes.errorCodes;
          this.filterWidgetCallback(apiData, filterOptions, escInit = null);
        });
      } else {
        this.getSolrFilterList(solrData).subscribe((response) => {
          let solrRes = response.facets;
          apiData['solrResponse']['model'] = solrRes.model;
          apiData['solrResponse']['currentDtcStrArr'] = solrRes.errorCodes;
          apiData['solrResponse']['errorCodes'] = solrRes.errorCodes;
          this.filterWidgetCallback(apiData, filterOptions, escInit = null);
        });
      }
    }
  }

  filterWidgetCallback(apiData, filterOptions, escInit = null) {
    apiData['platform'] = Constant.filterPlatform;
    let filterFieldItems:any = [];
    let filterFieldStorage = 'Fields';
    let cyear = parseInt(this.currYear);
    let solrFlag = apiData.solrFlag;
    let solrData = apiData.solrResponse;
    for (let y = cyear; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    this.filterApi.getFilterWidgets(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        filterOptions["filterData"] = responseData;
        let filterLoading = false;
        filterOptions["filterLoading"] = filterLoading;
        let groupId = apiData.groupId;
        let access = filterOptions.page;
        let getFilteredValues;
        let defaultWsVal = "",
          wsVal,
          defaultMake = "",
          makeVal = "",
          defaultModel = "",
          modelVal = "";
        let yearVal = moment().format("Y");
        let filterActiveCount = 0;
        let filterValues: any = "";

        let landingNav = localStorage.getItem("landingNav");
        let landingFlag = landingNav != null ? true : false;
        let wsNav = localStorage.getItem("workstreamNav");
        let wsFlag = wsNav != null ? true : false;
        //wsFlag = false;
        let filter = "";
        switch (groupId) {
          case 4:
            filter = "docFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 6:
            filter = filterNames.part;
            console.error("part filter---", landingFlag, filter);
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 20:
            filter = (apiData.accessPage == 'media') ? 'mediaFilter' : 'mediaUploadFilter';
            //filter = "mediaFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 2:
            filter = filterNames.thread;
            let sfilter = silentItems.silentThreadFilter;
            let sfilterItem = localStorage.getItem(sfilter);
            landingFlag = (sfilterItem == null || sfilterItem == 'undefined' || sfilterItem == undefined) ? landingFlag : false;
            filter = (sfilterItem == null || sfilterItem == 'undefined' || sfilterItem == undefined) ? filter : sfilter;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            setTimeout(() => {
              localStorage.removeItem(sfilter);
            }, 500);
            break;
          case 21:
            filter = filterNames.escalation;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 30:
            filter = filterNames.search;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 31:
            switch (access) {
              case "more":
                filter = filterNames.moreAnnouncement;
                break;
              case "dismiss":
                filter = filterNames.dismissedAnnouncement;
                break;
              default:
                filter = filterNames.dashboardAnnouncement;
                break;
            }
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 33:
            filter = filterNames.escalationPPFR;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 32:
            filter = filterNames.knowledgeArticle;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 34:
            filter = filterNames.gts;
            console.error("gts filter---", landingFlag, filter);
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            console.error("gts filter---", getFilteredValues);
            break;
          case 35:
            filter = filterNames.sib;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 36:
            filter = filterNames.knowledgeBase;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 37:
            filter = filterNames.direcotry;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 46:
            filter = filterNames.kaizen;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 38:
            filter = filterNames.marketPlace;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 39:
            filter = filterNames.reportAdas;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            filterFieldStorage = filterFields.reportAdas;
            break;
          case 40:
            filter = filterNames.adasProcedure;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            filterFieldStorage = filterFields.adasProcedureFields;
            break;
        }
        let domainIdVal=localStorage.getItem('domainId');
        let i = 0;
        for (let res of responseData) {
          let wid = parseInt(res.id);
          let widgetsFlag = parseInt(res.widgetsFlag) == 1 ? true : false;
          switch (wid) {
            case 1:
              if (widgetsFlag) {
                filterFieldItems.push({name: 'make', selection: 'single'});
                if(solrFlag) {
                  filterOptions["filterData"][i]["valueArray"] = solrData.make;
                }
                if (getFilteredValues != null) {
                  if (getFilteredValues.make != undefined) {
                    let fmakeVal;
                    if(solrFlag && access != 'search') {
                      fmakeVal = Array.isArray(getFilteredValues.make) ? fmakeVal = getFilteredValues.make : [getFilteredValues.make];
                    } else {
                      fmakeVal = getFilteredValues.make
                    }
                    //console.log(fmakeVal)
                    if(domainIdVal=='97')
                    {
                      apiData["filterOptions"]["make"] = fmakeVal;
                    }
                    else
                    {
                      apiData["filterOptions"] = { make: fmakeVal };
                    }

                    makeVal = fmakeVal;
                    //console.log(makeVal)
                    if (makeVal.length > 0) {
                      if(!Array.isArray(makeVal) || (Array.isArray(makeVal) && makeVal[0] != '')) {
                        ++filterActiveCount;
                      }
                    }
                  } else {
                    if(domainIdVal=='97')
                    {
                      apiData["filterOptions"]["make"] = [];
                    }
                    else
                    {
                      apiData["filterOptions"] = { make: [] };
                    }

                  }
                } else {
                  if(domainIdVal=='97')
                  {
                    apiData["filterOptions"]["make"] = [];
                  }
                  else
                  {
                    apiData["filterOptions"] = { make: [] };
                  }
                }
              }
              break;
            case 2:
              if (widgetsFlag) {
                filterFieldItems.push({name: 'model', selection: 'multiple'});
                if(solrFlag) {
                  filterOptions["filterData"][i]["valueArray"] = solrData.model;
                }
                if (getFilteredValues != null) {
                  //console.log(getFilteredValues.model);
                  if (getFilteredValues.model != undefined) {
                    apiData["filterOptions"]["model"] = getFilteredValues.model;
                    modelVal = getFilteredValues.model;
                    if (modelVal.length > 0) {
                      ++filterActiveCount;
                    }
                  } else {
                    apiData["filterOptions"]["model"] = "";
                  }
                } else {
                  apiData["filterOptions"]["model"] = "";
                }
              }
              break;
            case 3:
              if (widgetsFlag) {
                filterFieldItems.push({name: 'year', selection: 'multiple'});
                filterOptions["filterData"][i]["valueArray"] = this.years;
                let year = [];
                if (getFilteredValues != null) {
                  year =
                    getFilteredValues.year == undefined
                      ? year
                      : getFilteredValues.year;
                  if (year.length > 0) {
                    ++filterActiveCount;
                  }
                }

                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["year"] = year;
                } else {
                  apiData["filterOptions"] = { year: year };
                }
              }
              break;
            case 4:
              if (widgetsFlag) {
                let accWsId: any = 0;
                //console.log(groupId);
                if (groupId == 2 || groupId == 6) {
                  accWsId = localStorage.getItem("accessWorkstreamId");
                  accWsId =
                    accWsId == "undefined" || accWsId == undefined
                      ? 0
                      : accWsId;

                  //console.log(accWsId);
                  setTimeout(() => {
                    localStorage.removeItem("accessWorkstreamId");
                  }, 150);
                }
                let wsItems = [];
                let wsLen = res.valueArray.length;
                for (let ws of res.valueArray) {
                  //console.log(JSON.stringify(res.valueArray));
                  localStorage.setItem('threadsPageSubTypeData', JSON.stringify(res.valueArray))
                  //wsItems.push(ws.workstreamId);
                  if (accWsId > 1) {
                    ws.defaultValue = 0;
                    if (ws.workstreamId == accWsId) {
                      wsItems = [ws.workstreamId];
                      defaultWsVal = wsItems.toString();
                      this.defaultWsVal = defaultWsVal;
                    }
                  } else {
                    /*if (ws.defaultValue == 1) {
                      wsItems = [ws.workstreamId];
                      defaultWsVal = wsItems.toString();
                      this.defaultWsVal = defaultWsVal;
                    }*/
                  }
                }

                if (wsFlag) {
                  wsItems = JSON.parse(localStorage.getItem("landing-ws"));
                  //console.log(wsItems);
                  if (wsItems.length > 0) {
                    ++filterActiveCount;
                  }
                  setTimeout(() => {
                    localStorage.removeItem("landing-ws");
                    localStorage.removeItem("workstreamNav");
                  }, 50);
                } else {
                  //console.log(1321564, getFilteredValues, accWsId)
                  //if (accWsId < 1 && getFilteredValues != null) {
                  if (getFilteredValues != null) {
                    //console.log(24465465)
                    wsItems =
                      accWsId > 0 ||
                      getFilteredValues.workstream == undefined ||
                      getFilteredValues.workstream == "undefined"
                        ? wsItems
                        : getFilteredValues.workstream;
                    //console.log(wsItems)
                    if (wsItems.length > 0) {
                      ++filterActiveCount;
                    }
                  }
                }

                wsVal = wsItems.toString();
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  //console.log(14);
                  apiData["filterOptions"]["workstream"] = wsItems;
                } else {
                  //console.log(24);
                  apiData["filterOptions"] = { workstream: wsItems };
                }
                //console.log(wsItems);
                //console.log(apiData);
              }
              break;
            case 5:
              if (widgetsFlag) {
                let tagItems = [];
                let tags = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tags"] = tags;
                  apiData["filterOptions"]["tagItems"] = tagItems;
                } else {
                  apiData["filterOptions"] = { tags: tags };
                  apiData["filterOptions"] = { tagItems: tagItems };
                }

                if (getFilteredValues != null) {
                  tags =
                    getFilteredValues.tags == undefined ||
                    getFilteredValues.tags == "undefined"
                      ? tags
                      : getFilteredValues.tags;
                  tagItems =
                    getFilteredValues.tagItems == undefined ||
                    getFilteredValues.tagItems == "undefined"
                      ? tagItems
                      : getFilteredValues.tagItems;
                  if (tags.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tags"] = tags;
                  apiData["filterOptions"]["tagItems"] = tagItems;
                } else {
                  apiData["filterOptions"] = { tags: tags };
                  apiData["filterOptions"] = { tagItems: tagItems };
                }
              }
              break;
            case 6:
              if (widgetsFlag) {
                let mediaTypes = [];
                let mediaTypeItems =
                  filterOptions["filterData"][i]["valueArray"];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["mediaTypes"] = mediaTypes;
                } else {
                  apiData["filterOptions"] = { mediaTypes: mediaTypes };
                }
                for (let m of mediaTypeItems) {
                  mediaTypes.push({
                    id: m,
                    name: m,
                  });
                }

                filterOptions["filterData"][i]["valueArray"] = mediaTypes;

                if (getFilteredValues != null) {
                  mediaTypes =
                    getFilteredValues.mediaTypes == undefined ||
                    getFilteredValues.mediaTypes == "undefined"
                      ? mediaTypes
                      : getFilteredValues.mediaTypes;
                  if (mediaTypes.length > 0) {
                    ++filterActiveCount;
                  }
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["mediaTypes"] = mediaTypes;
                  } else {
                    apiData["filterOptions"] = { mediaTypes: mediaTypes };
                  }
                } else {
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["mediaTypes"] = [];
                  } else {
                    apiData["filterOptions"] = { mediaTypes: [] };
                  }
                }
              }
              break;
            case 7:
              if (widgetsFlag) {
                let startDate = "";
                let sDate;
                //console.log(getFilteredValues);
                if (getFilteredValues != null) {
                  sDate =
                    getFilteredValues.startDate == undefined ||
                    getFilteredValues.startDate == "undefined"
                      ? startDate
                      : getFilteredValues.startDate;
                } else {
                  sDate = startDate;
                }
                if (filterOptions["searchBg"]) {
                  sDate = startDate;
                }

                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["startDate"] = sDate;
                } else {
                  apiData["filterOptions"] = { startDate: sDate };
                }
                //console.log(sDate, filterOptions, apiData)
                if(sDate != '') {
                  ++filterActiveCount;
                }
                filterOptions["filterData"][i]["value"] = sDate;
              }
              break;
            case 8:
              if (widgetsFlag) {
                let endDate = "";
                let eDate;
                if (getFilteredValues != null) {
                  eDate =
                    getFilteredValues.endDate == undefined ||
                    getFilteredValues.endDate == "undefined"
                      ? endDate
                      : getFilteredValues.endDate;
                } else {
                  eDate = endDate;
                }
                if (filterOptions["searchBg"]) {
                  eDate = endDate;
                }

                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["endDate"] = eDate;
                } else {
                  apiData["filterOptions"] = { endDate: eDate };
                }

                if(eDate != '') {
                  ++filterActiveCount;
                }
                filterOptions["filterData"][i]["value"] = eDate;
              }
              break;
            case 11:
              if (widgetsFlag) {
                let territories = [];
                let territoryItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["territories"] = territories;
                  apiData["filterOptions"]["territoryItems"] = territoryItems;
                } else {
                  apiData["filterOptions"] = { territories: territories };
                  apiData["filterOptions"] = { territoryItems: territoryItems };
                }
                if (getFilteredValues != null) {
                  territories =
                    getFilteredValues.territories == undefined ||
                    getFilteredValues.territories == "undefined"
                      ? territories
                      : getFilteredValues.territories;
                  territoryItems =
                    getFilteredValues.territoryItems == undefined ||
                    getFilteredValues.territoryItems == "undefined"
                      ? territories
                      : getFilteredValues.territoryItems;
                }

                if (filterOptions["searchBg"]) {
                  territories = [];
                  territoryItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["territories"] = territories;
                  apiData["filterOptions"]["territoryItems"] = territoryItems;
                } else {
                  apiData["filterOptions"] = { territories: territories };
                  apiData["filterOptions"] = { territoryItems: territoryItems };
                }

                if (territories.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 12:
              if (widgetsFlag) {
                let locations = [];
                let locationItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["locations"] = locations;
                  apiData["filterOptions"]["locationItems"] = locationItems;
                } else {
                  apiData["filterOptions"] = { locations: locations };
                  apiData["filterOptions"] = { locationItems: locationItems };
                }
                if (getFilteredValues != null) {
                  locations =
                    getFilteredValues.locations == undefined ||
                    getFilteredValues.locations == "undefined"
                      ? locations
                      : getFilteredValues.locations;
                  locationItems =
                    getFilteredValues.locationItems == undefined ||
                    getFilteredValues.locationItems == "undefined"
                      ? locationItems
                      : getFilteredValues.locationItems;
                }

                if (filterOptions["searchBg"]) {
                  locations = [];
                  locationItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["locations"] = locations;
                  apiData["filterOptions"]["locationItems"] = locationItems;
                } else {
                  apiData["filterOptions"] = { locations: locations };
                  apiData["filterOptions"] = { locationItems: locationItems };
                }

                if (locations.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 13:
              if (widgetsFlag) {
                let customers = [];
                let customerItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["customers"] = customers;
                  apiData["filterOptions"]["customerItems"] = customerItems;
                } else {
                  apiData["filterOptions"] = { customers: customers };
                  apiData["filterOptions"] = { customerItems: customerItems };
                }
                if (getFilteredValues != null) {
                  customers =
                    getFilteredValues.customers == undefined ||
                    getFilteredValues.customers == "undefined"
                      ? customers
                      : getFilteredValues.customers;
                  customerItems =
                    getFilteredValues.customerItems == undefined ||
                    getFilteredValues.customerItems == "undefined"
                      ? customerItems
                      : getFilteredValues.customerItems;
                }
                if (filterOptions["searchBg"]) {
                  customers = [];
                  customerItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["customers"] = customers;
                  apiData["filterOptions"]["customerItems"] = customerItems;
                } else {
                  apiData["filterOptions"] = { customers: customers };
                  apiData["filterOptions"] = { customerItems: customerItems };
                }

                if (customers.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 14:
              if (widgetsFlag) {
                let technicians = [];
                let technicianItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["technicians"] = technicians;
                  apiData["filterOptions"]["technicianItems"] = technicianItems;
                } else {
                  apiData["filterOptions"] = { technicians: technicians };
                  apiData["filterOptions"] = {
                    technicianItems: technicianItems,
                  };
                }
                if (escInit == 1) {
                  let tech = filterOptions["filterData"][i]["selectedUsers"];
                  for (let t of tech) {
                    technicians.push(t.userId);
                    technicianItems.push(t.firstLastName);
                  }
                }
                //console.log(technicians)
                //console.log(technicianItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let techDataId = [];
                  let techDataItem = [];
                  if (escInit < 1) {
                    technicians =
                      getFilteredValues.technicians == undefined ||
                      getFilteredValues.technicians == "undefined"
                        ? technicians
                        : getFilteredValues.technicians;
                    technicianItems =
                      getFilteredValues.technicianItems == undefined ||
                      getFilteredValues.technicianItems == "undefined"
                        ? technicianItems
                        : getFilteredValues.technicianItems;
                  } else {
                    techDataId =
                      getFilteredValues.csm == undefined ||
                      getFilteredValues.csm == "undefined"
                        ? techDataId
                        : getFilteredValues.technicians;
                    techDataItem =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.technicianItems == "undefined"
                        ? techDataItem
                        : getFilteredValues.technicianItems;
                    technicians =
                      techDataId.length == 0 ? technicians : techDataId;
                    technicianItems =
                      techDataId.length == 0 ? technicianItems : techDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  technicians = [];
                  technicianItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["technicians"] = technicians;
                  apiData["filterOptions"]["technicianItems"] = technicianItems;
                } else {
                  apiData["filterOptions"] = { technicians: technicians };
                  apiData["filterOptions"] = {
                    technicianItems: technicianItems,
                  };
                }

                if (technicians.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 15:
              if (widgetsFlag) {
                let csm = [];
                let csmItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["csm"] = csm;
                  apiData["filterOptions"]["csmItems"] = csmItems;
                } else {
                  apiData["filterOptions"] = { csm: csm };
                  apiData["filterOptions"] = { csmItems: csmItems };
                }

                if (escInit == 1) {
                  let cmsUsers =
                    filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of cmsUsers) {
                    csm.push(c.userId);
                    csmItems.push(c.firstLastName);
                  }
                }
                //console.log(csm)
                //console.log(csmItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let csmDataId = [];
                  let csmDataItem = [];
                  if (escInit < 1) {
                    csm =
                      getFilteredValues.csm == undefined ||
                      getFilteredValues.csm == "undefined"
                        ? csmDataId
                        : getFilteredValues.csm;
                    csmItems =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.csmItems == "undefined"
                        ? csmDataItem
                        : getFilteredValues.csmItems;
                  } else {
                    csmDataId =
                      getFilteredValues.csm == undefined ||
                      getFilteredValues.csm == "undefined"
                        ? csmDataId
                        : getFilteredValues.csm;
                    csmDataItem =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.csmItems == "undefined"
                        ? csmDataItem
                        : getFilteredValues.csmItems;
                    csm = csmDataId.length == 0 ? csm : csmDataId;
                    csmItems = csmDataId.length == 0 ? csmItems : csmDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  csm = [];
                  csmItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["csm"] = csm;
                  apiData["filterOptions"]["csmItems"] = csmItems;
                } else {
                  apiData["filterOptions"] = { csm: csm };
                  apiData["filterOptions"] = { csmItems: csmItems };
                }

                if (csm.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 16:
              if (widgetsFlag) {
                let status = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["status"] = status;
                } else {
                  apiData["filterOptions"] = { status: status };
                }
                if (getFilteredValues != null) {
                  status =
                    getFilteredValues.status == undefined ||
                    getFilteredValues.status == "undefined"
                      ? status
                      : getFilteredValues.status;
                }

                //console.log(status)

                if (filterOptions["searchBg"]) {
                  status = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["status"] = status;
                } else {
                  apiData["filterOptions"] = { status: status };
                }

                if (status.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;

            case 17:
              if (widgetsFlag) {
                let otherUsers = [];
                let otherUserItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["otherUsers"] = otherUsers;
                  apiData["filterOptions"]["otherUserItems"] = otherUserItems;
                } else {
                  apiData["filterOptions"] = { otherUsers: otherUsers };
                  apiData["filterOptions"] = { otherUserItems: otherUserItems };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    otherUsers.push(c.userId);
                    otherUserItems.push(c.firstLastName);
                  }
                }

                //console.log(otherUsers)
                //console.log(otherUserItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let otherUserDataId = [];
                  let otherUserDataItem = [];
                  if (escInit < 1) {
                    otherUsers =
                      getFilteredValues.otherUsers == undefined ||
                      getFilteredValues.otherUsers == "undefined"
                        ? otherUserDataId
                        : getFilteredValues.otherUsers;
                    otherUserItems =
                      getFilteredValues.otherUserItems == undefined ||
                      getFilteredValues.otherUserItems == "undefined"
                        ? otherUserDataItem
                        : getFilteredValues.otherUserItems;
                  } else {
                    otherUserDataId =
                      getFilteredValues.otherUsers == undefined ||
                      getFilteredValues.otherUsers == "undefined"
                        ? otherUserDataId
                        : getFilteredValues.otherUsers;
                    otherUserDataItem =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.csmItems == "undefined"
                        ? otherUserDataItem
                        : getFilteredValues.otherUserItems;
                    otherUsers =
                      otherUserDataId.length == 0
                        ? otherUsers
                        : otherUserDataId;
                    otherUserItems =
                      otherUserDataId.length == 0
                        ? otherUserItems
                        : otherUserDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  otherUsers = [];
                  otherUserItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["otherUsers"] = otherUsers;
                  apiData["filterOptions"]["otherUserItems"] = otherUserItems;
                } else {
                  apiData["filterOptions"] = { otherUsers: otherUsers };
                  apiData["filterOptions"] = { otherUserItems: otherUserItems };
                }

                if (otherUsers.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 18:
              if (widgetsFlag) {
                let threadStatus = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["threadStatus"] = threadStatus;
                } else {
                  apiData["filterOptions"] = { threadStatus: threadStatus };
                }
                if (getFilteredValues != null) {
                  threadStatus =
                    getFilteredValues.threadStatus == undefined ||
                    getFilteredValues.threadStatus == "undefined"
                      ? threadStatus
                      : getFilteredValues.threadStatus;
                }

                //console.log(status)

                if (filterOptions["searchBg"]) {
                  threadStatus = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["threadStatus"] = threadStatus;
                } else {
                  apiData["filterOptions"] = { threadStatus: threadStatus };
                }

                if (threadStatus.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
              case 19:
              if (widgetsFlag) {
                let errorCodeItems = [];
                let errorCode = [];
                filterFieldItems.push({name: 'currentDtcStrArr', selection: 'multiple'});
                if(solrFlag) {
                  filterOptions["filterData"][i]["valueArray"] = solrData.errorCodes;
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["errorCode"] = errorCode;
                  apiData["filterOptions"]["errorCodeItems"] = errorCodeItems;
                } else {
                  apiData["filterOptions"] = { errorCode: errorCode };
                  apiData["filterOptions"] = { errorCodeItems: errorCodeItems };
                }

                if (getFilteredValues != null) {
                  errorCode =
                    getFilteredValues.errorCode == undefined ||
                    getFilteredValues.errorCode == "undefined"
                      ? errorCode
                      : getFilteredValues.errorCode;
                      errorCodeItems =
                    getFilteredValues.errorCodeItems == undefined ||
                    getFilteredValues.errorCodeItems == "undefined"
                      ? errorCodeItems
                      : getFilteredValues.errorCodeItems;
                  if (errorCode.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["errorCode"] = errorCode;
                  apiData["filterOptions"]["errorCodeItems"] = errorCodeItems;
                } else {
                  apiData["filterOptions"] = { errorCode: errorCode };
                  apiData["filterOptions"] = { errorCodeItems: errorCodeItems };
                }
              }
              break;

            /*case 19:
              if (widgetsFlag) {
                let errorCodes = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["errorCode"] = errorCodes;
                } else {
                  apiData["filterOptions"] = { errorCode: errorCodes };
                }
                if (getFilteredValues != null) {
                  errorCodes =
                    getFilteredValues.errorCode == undefined ||
                    getFilteredValues.errorCode == "undefined"
                      ? errorCodes
                      : getFilteredValues.errorCode;
                }

                //console.log(status)

                if (filterOptions["searchBg"]) {
                  errorCodes = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["errorCode"] = errorCodes;
                } else {
                  apiData["filterOptions"] = { errorCode: errorCodes };
                }

                if (errorCodes.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;*/
            case 20:
              if (widgetsFlag) {
                let dealerNames = [];
                let dealerNameItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerNames"] = dealerNames;
                  apiData["filterOptions"]["dealerNameItems"] = dealerNameItems;
                } else {
                  apiData["filterOptions"] = { dealerNames: dealerNames };
                  apiData["filterOptions"] = {
                    dealerNameItems: dealerNameItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    dealerNames.push(c.userId);
                    dealerNameItems.push(c.firstLastName);
                  }
                }

                //console.log(dealerNames)
                //console.log(dealerNameItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let dealerNameDataId = [];
                  let dealerNameDataItem = [];
                  if (escInit < 1) {
                    dealerNames =
                      getFilteredValues.dealerNames == undefined ||
                      getFilteredValues.dealerNames == "undefined"
                        ? dealerNameDataId
                        : getFilteredValues.dealerNames;
                    dealerNameItems =
                      getFilteredValues.dealerNameItems == undefined ||
                      getFilteredValues.dealerNameItems == "undefined"
                        ? dealerNameDataItem
                        : getFilteredValues.dealerNameItems;
                  } else {
                    dealerNameDataId =
                      getFilteredValues.dealerNames == undefined ||
                      getFilteredValues.dealerNames == "undefined"
                        ? dealerNameDataId
                        : getFilteredValues.dealerNames;
                    dealerNameDataItem =
                      getFilteredValues.dealerNameItems == undefined ||
                      getFilteredValues.dealerNameItems == "undefined"
                        ? dealerNameDataItem
                        : getFilteredValues.dealerNameItems;
                    dealerNames =
                      dealerNameDataId.length == 0
                        ? dealerNames
                        : dealerNameDataId;
                    dealerNameItems =
                      dealerNameDataId.length == 0
                        ? dealerNameItems
                        : dealerNameDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  dealerNames = [];
                  dealerNameItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerNames"] = dealerNames;
                  apiData["filterOptions"]["dealerNameItems"] = dealerNameItems;
                } else {
                  apiData["filterOptions"] = { dealerNames: dealerNames };
                  apiData["filterOptions"] = {
                    dealerNameItems: dealerNameItems,
                  };
                }

                if (dealerNames.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 21:
              if (widgetsFlag) {
                let dealerCities = [];
                let dealerCityItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerCities"] = dealerCities;
                  apiData["filterOptions"]["dealerCityItems"] = dealerCityItems;
                } else {
                  apiData["filterOptions"] = { dealerCities: dealerCities };
                  apiData["filterOptions"] = {
                    dealerCityItems: dealerCityItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    dealerCities.push(c.userId);
                    dealerCityItems.push(c.firstLastName);
                  }
                }

                //console.log(dealerCities)
                //console.log(dealerCityItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let dealerCitiesDataId = [];
                  let dealerCitiesDataItem = [];
                  if (escInit < 1) {
                    dealerCities =
                      getFilteredValues.dealerCities == undefined ||
                      getFilteredValues.dealerCities == "undefined"
                        ? dealerCitiesDataId
                        : getFilteredValues.dealerCities;
                    dealerCityItems =
                      getFilteredValues.dealerCityItems == undefined ||
                      getFilteredValues.dealerCityItems == "undefined"
                        ? dealerCitiesDataItem
                        : getFilteredValues.dealerCityItems;
                  } else {
                    dealerCitiesDataId =
                      getFilteredValues.dealerCities == undefined ||
                      getFilteredValues.dealerCities == "undefined"
                        ? dealerCitiesDataId
                        : getFilteredValues.dealerCities;
                    dealerCitiesDataItem =
                      getFilteredValues.dealerCityItems == undefined ||
                      getFilteredValues.dealerCityItems == "undefined"
                        ? dealerCitiesDataItem
                        : getFilteredValues.dealerCityItems;
                    dealerCities =
                      dealerCitiesDataId.length == 0
                        ? dealerCities
                        : dealerCitiesDataId;
                    dealerCityItems =
                      dealerCitiesDataId.length == 0
                        ? dealerCityItems
                        : dealerCitiesDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  dealerCities = [];
                  dealerCityItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerCities"] = dealerCities;
                  apiData["filterOptions"]["dealerCityItems"] = dealerCityItems;
                } else {
                  apiData["filterOptions"] = { dealerCities: dealerCities };
                  apiData["filterOptions"] = {
                    dealerCityItems: dealerCityItems,
                  };
                }

                if (dealerCities.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 22:
              if (widgetsFlag) {
                let dealerArea = [];
                let dealerAreaItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerArea"] = dealerArea;
                  apiData["filterOptions"]["dealerAreaItems"] = dealerAreaItems;
                } else {
                  apiData["filterOptions"] = { dealerArea: dealerArea };
                  apiData["filterOptions"] = {
                    dealerAreaItems: dealerAreaItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    dealerArea.push(c.userId);
                    dealerAreaItems.push(c.firstLastName);
                  }
                }

                //console.log(dealerArea)
                //console.log(dealerAreaItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let dealerAreaDataId = [];
                  let dealerAreaDataItem = [];
                  if (escInit < 1) {
                    dealerArea =
                      getFilteredValues.dealerArea == undefined ||
                      getFilteredValues.dealerArea == "undefined"
                        ? dealerAreaDataId
                        : getFilteredValues.dealerArea;
                    dealerAreaItems =
                      getFilteredValues.dealerAreaItems == undefined ||
                      getFilteredValues.dealerAreaItems == "undefined"
                        ? dealerAreaDataItem
                        : getFilteredValues.dealerAreaItems;
                  } else {
                    dealerAreaDataId =
                      getFilteredValues.dealerArea == undefined ||
                      getFilteredValues.dealerArea == "undefined"
                        ? dealerAreaDataId
                        : getFilteredValues.dealerArea;
                    dealerAreaDataItem =
                      getFilteredValues.dealerAreaItems == undefined ||
                      getFilteredValues.dealerAreaItems == "undefined"
                        ? dealerAreaDataItem
                        : getFilteredValues.dealerAreaItems;
                    dealerArea =
                      dealerAreaDataId.length == 0
                        ? dealerArea
                        : dealerAreaDataId;
                    dealerAreaItems =
                      dealerAreaDataId.length == 0
                        ? dealerAreaItems
                        : dealerAreaDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  dealerArea = [];
                  dealerAreaItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerArea"] = dealerArea;
                  apiData["filterOptions"]["dealerAreaItems"] = dealerAreaItems;
                } else {
                  apiData["filterOptions"] = { dealerArea: dealerArea };
                  apiData["filterOptions"] = {
                    dealerAreaItems: dealerAreaItems,
                  };
                }

                if (dealerArea.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 23:
              if (widgetsFlag) {
                let productCoor = [];
                let productCoorItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["productCoor"] = productCoor;
                  apiData["filterOptions"]["productCoorItems"] =
                    productCoorItems;
                } else {
                  apiData["filterOptions"] = { productCoor: productCoor };
                  apiData["filterOptions"] = {
                    productCoorItems: productCoorItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    productCoor.push(c.userId);
                    productCoorItems.push(c.firstLastName);
                  }
                }

                //console.log(productCoor)
                //console.log(productCoorItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let productCoorDataId = [];
                  let productCoorDataItem = [];
                  if (escInit < 1) {
                    productCoor =
                      getFilteredValues.productCoor == undefined ||
                      getFilteredValues.productCoor == "undefined"
                        ? productCoorDataId
                        : getFilteredValues.productCoor;
                    productCoorItems =
                      getFilteredValues.productCoorItems == undefined ||
                      getFilteredValues.productCoorItems == "undefined"
                        ? productCoorDataItem
                        : getFilteredValues.productCoorItems;
                  } else {
                    productCoorDataId =
                      getFilteredValues.productCoor == undefined ||
                      getFilteredValues.productCoor == "undefined"
                        ? productCoorDataId
                        : getFilteredValues.productCoor;
                    productCoorDataItem =
                      getFilteredValues.productCoorItems == undefined ||
                      getFilteredValues.productCoorItems == "undefined"
                        ? productCoorDataItem
                        : getFilteredValues.productCoorItems;
                    productCoor =
                      productCoorDataId.length == 0
                        ? productCoor
                        : productCoorDataId;
                    productCoorItems =
                      productCoorDataId.length == 0
                        ? productCoorItems
                        : productCoorDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  productCoor = [];
                  productCoorItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["productCoor"] = productCoor;
                  apiData["filterOptions"]["productCoorItems"] =
                    productCoorItems;
                } else {
                  apiData["filterOptions"] = { productCoor: productCoor };
                  apiData["filterOptions"] = {
                    productCoorItems: productCoorItems,
                  };
                }

                if (productCoor.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 24:
              if (widgetsFlag) {
                let tmanagers = [];
                let tmanagersItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tmanagers"] = tmanagers;
                  apiData["filterOptions"]["tmanagersItems"] = tmanagersItems;
                } else {
                  apiData["filterOptions"] = { tmanagers: tmanagers };
                  apiData["filterOptions"] = { tmanagersItems: tmanagersItems };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    tmanagers.push(c.userId);
                    tmanagersItems.push(c.firstLastName);
                  }
                }

                //console.log(tmanagers)
                //console.log(tmanagersItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let tmanagersDataId = [];
                  let tmanagersDataItem = [];
                  if (escInit < 1) {
                    tmanagers =
                      getFilteredValues.tmanagers == undefined ||
                      getFilteredValues.tmanagers == "undefined"
                        ? tmanagersDataId
                        : getFilteredValues.tmanagers;
                    tmanagersItems =
                      getFilteredValues.tmanagersItems == undefined ||
                      getFilteredValues.tmanagersItems == "undefined"
                        ? tmanagersDataItem
                        : getFilteredValues.tmanagersItems;
                  } else {
                    tmanagersDataId =
                      getFilteredValues.tmanagers == undefined ||
                      getFilteredValues.tmanagers == "undefined"
                        ? tmanagersDataId
                        : getFilteredValues.tmanagers;
                    tmanagersDataItem =
                      getFilteredValues.tmanagersItems == undefined ||
                      getFilteredValues.tmanagersItems == "undefined"
                        ? tmanagersDataItem
                        : getFilteredValues.tmanagersItems;
                    tmanagers =
                      tmanagersDataId.length == 0 ? tmanagers : tmanagersDataId;
                    tmanagersItems =
                      tmanagersDataId.length == 0
                        ? tmanagersItems
                        : tmanagersDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  tmanagers = [];
                  tmanagersItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tmanagers"] = tmanagers;
                  apiData["filterOptions"]["tmanagersItems"] = tmanagersItems;
                } else {
                  apiData["filterOptions"] = { tmanagers: tmanagers };
                  apiData["filterOptions"] = { tmanagersItems: tmanagersItems };
                }

                if (tmanagers.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 25:

              if (widgetsFlag) {

                let countriesItems = [];
                let countries = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["countries"] = countries;
                  apiData["filterOptions"]["countriesItems"] = countriesItems;
                } else {
                  apiData["filterOptions"] = { countries: countries };
                  apiData["filterOptions"] = { countriesItems: countriesItems };
                }

                if (getFilteredValues != null) {

                  countries =
                    getFilteredValues.countries == undefined ||
                    getFilteredValues.countries == "undefined"
                      ? countries
                      : getFilteredValues.countries;
                      countriesItems =
                    getFilteredValues.countriesItems == undefined ||
                    getFilteredValues.countriesItems == "undefined"
                      ? countriesItems
                      : getFilteredValues.countriesItems;
                  if (countries.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["countries"] = countries;
                  apiData["filterOptions"]["countriesItems"] = countriesItems;
                } else {
                  apiData["filterOptions"] = { countries: countries };
                  apiData["filterOptions"] = { countriesItems: countriesItems };
                }


              }
              break;
            case 26:
              if(groupId == '36'){
                if (widgetsFlag) {
                  let probCatgItems = [];
                  let probCatg = [];
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["probCatg"] = probCatg;
                    apiData["filterOptions"]["probCatgItems"] = probCatgItems;
                  } else {
                    apiData["filterOptions"] = { probCatg: probCatg };
                    apiData["filterOptions"] = { probCatgItems: probCatgItems };
                  }

                  if (getFilteredValues != null) {
                    probCatg =
                      getFilteredValues.probCatg == undefined ||
                      getFilteredValues.probCatg == "undefined"
                        ? probCatg
                        : getFilteredValues.probCatg;
                    probCatgItems =
                      getFilteredValues.probCatgItems == undefined ||
                      getFilteredValues.probCatgItems == "undefined"
                        ? probCatgItems
                        : getFilteredValues.probCatgItems;
                    if (probCatg.length > 0) {
                      ++filterActiveCount;
                    }
                  }
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["probCatg"] = probCatg;
                    apiData["filterOptions"]["probCatgItems"] = probCatgItems;
                  } else {
                    apiData["filterOptions"] = { probCatg: probCatg };
                    apiData["filterOptions"] = { probCatgItems: probCatgItems };
                  }
                }
              }
              else{
                if (widgetsFlag) {
                  let complaintCategoryItems = [];
                  let complaintCategory = [];
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["complaintCategory"] = complaintCategory;
                    apiData["filterOptions"]["complaintCategoryItems"] = complaintCategoryItems;
                  } else {
                    apiData["filterOptions"] = { complaintCategory: complaintCategory };
                    apiData["filterOptions"] = { complaintCategoryItems: complaintCategoryItems };
                  }

                  if (getFilteredValues != null) {
                    complaintCategory =
                      getFilteredValues.complaintCategory == undefined ||
                      getFilteredValues.complaintCategory == "undefined"
                        ? complaintCategory
                        : getFilteredValues.complaintCategory;
                        complaintCategoryItems =
                      getFilteredValues.complaintCategoryItems == undefined ||
                      getFilteredValues.complaintCategoryItems == "undefined"
                        ? complaintCategoryItems
                        : getFilteredValues.complaintCategoryItems;
                    if (complaintCategory.length > 0) {
                      ++filterActiveCount;
                    }
                  }
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["complaintCategory"] = complaintCategory;
                    apiData["filterOptions"]["complaintCategoryItems"] = complaintCategoryItems;
                  } else {
                    apiData["filterOptions"] = { complaintCategory: complaintCategory };
                    apiData["filterOptions"] = { complaintCategoryItems: complaintCategoryItems };
                  }
                }
              }
              break;
            case 27:
              if (widgetsFlag) {
                let symtomItems = [];
                let symtoms = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["symtoms"] = symtoms;
                  apiData["filterOptions"]["symtomItems"] = symtomItems;
                } else {
                  apiData["filterOptions"] = { symtoms: symtoms };
                  apiData["filterOptions"] = { symtomItems: symtomItems };
                }

                if (getFilteredValues != null) {
                  symtoms =
                    getFilteredValues.symtoms == undefined ||
                    getFilteredValues.symtoms == "undefined"
                      ? symtoms
                      : getFilteredValues.symtoms;
                      symtomItems =
                    getFilteredValues.symtomItems == undefined ||
                    getFilteredValues.symtomItems == "undefined"
                      ? symtomItems
                      : getFilteredValues.symtomItems;
                  if (symtoms.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["symtoms"] = symtoms;
                  apiData["filterOptions"]["symtomItems"] = symtomItems;
                } else {
                  apiData["filterOptions"] = { symtoms: symtoms };
                  apiData["filterOptions"] = { symtomItems: symtomItems };
                }
              }
              break;
            case 28:
              if (widgetsFlag) {
                let subProductGroupItems = [];
                let subProductGroup = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["subProductGroup"] = subProductGroup;
                  apiData["filterOptions"]["subProductGroupItems"] = subProductGroupItems;
                } else {
                  apiData["filterOptions"] = { subProductGroup: subProductGroup };
                  apiData["filterOptions"] = { subProductGroupItems: subProductGroupItems };
                }

                if (getFilteredValues != null) {
                  subProductGroup =
                    getFilteredValues.subProductGroup == undefined ||
                    getFilteredValues.subProductGroup == "undefined"
                      ? subProductGroup
                      : getFilteredValues.subProductGroup;
                      subProductGroupItems =
                    getFilteredValues.subProductGroupItems == undefined ||
                    getFilteredValues.subProductGroupItems == "undefined"
                      ? subProductGroupItems
                      : getFilteredValues.subProductGroupItems;
                  if (subProductGroup.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["subProductGroup"] = subProductGroup;
                  apiData["filterOptions"]["subProductGroupItems"] = subProductGroupItems;
                } else {
                  apiData["filterOptions"] = { subProductGroup: subProductGroup };
                  apiData["filterOptions"] = { subProductGroupItems: subProductGroupItems };
                }
              }
              break;
            case 29:
              if (widgetsFlag) {
                let languageItems = [];
                let language = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["language"] = language;
                  apiData["filterOptions"]["languageItems"] = languageItems;
                } else {
                  apiData["filterOptions"] = { language: language };
                  apiData["filterOptions"] = { languageItems: languageItems };
                }

                if (getFilteredValues != null) {
                  language =
                    getFilteredValues.language == undefined ||
                    getFilteredValues.language == "undefined"
                      ? language
                      : getFilteredValues.language;
                      languageItems =
                    getFilteredValues.languageItems == undefined ||
                    getFilteredValues.languageItems == "undefined"
                      ? languageItems
                      : getFilteredValues.languageItems;
                  if (language.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["language"] = language;
                  apiData["filterOptions"]["languageItems"] = languageItems;
                } else {
                  apiData["filterOptions"] = { language: language };
                  apiData["filterOptions"] = { languageItems: languageItems };
                }
              }
              break;
            case 30:
              if (widgetsFlag) {
                let partTypeItems = [];
                let partType = [];
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partType"] = partType;
                  apiData["filterOptions"]["partTypeItems"] = partTypeItems;
                } else {
                  apiData["filterOptions"] = { partType: partType };
                  apiData["filterOptions"] = { partTypeItems: partTypeItems };
                }

                if (getFilteredValues != null) {
                  partType = getFilteredValues.partType == undefined || getFilteredValues.partType == "undefined" ? partType : getFilteredValues.partType;
                  partTypeItems = getFilteredValues.partTypeItems == undefined || getFilteredValues.partTypeItems == "undefined" ? partTypeItems : getFilteredValues.partTypeItems;
                  if (partType.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partType"] = partType;
                  apiData["filterOptions"]["partTypeItems"] = partTypeItems;
                } else {
                  apiData["filterOptions"] = { partType: partType };
                  apiData["filterOptions"] = { partTypeItems: partTypeItems };
                }
              }
              break;
            case 31:
              if (widgetsFlag) {
                let partAssemblyItems = [];
                let partAssembly = [];
                if ( apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partAssembly"] = partAssembly;
                  apiData["filterOptions"]["partAssemblyItems"] = partAssemblyItems;
                } else {
                  apiData["filterOptions"] = { partAssembly: partAssembly };
                  apiData["filterOptions"] = { partAssemblyItems: partAssemblyItems };
                }

                if (getFilteredValues != null) {
                  partAssembly = getFilteredValues.partAssembly == undefined || getFilteredValues.partAssembly == "undefined" ? partAssembly : getFilteredValues.partAssembly;
                  partAssemblyItems = getFilteredValues.partAssemblyItems == undefined || getFilteredValues.partAssemblyItems == "undefined" ? partAssemblyItems : getFilteredValues.partAssemblytems;
                  if (partAssembly.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partAssembly"] = partAssembly;
                  apiData["filterOptions"]["partAssemblyItems"] = partAssemblyItems;
                } else {
                  apiData["filterOptions"] = { partAssembly: partAssembly };
                  apiData["filterOptions"] = { partAssemblyItems: partAssemblyItems };
                }
              }
              break;
            case 32:
              if (widgetsFlag) {
                let partSystemItems = [];
                let partSystem = [];
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partSystem"] = partSystem;
                  apiData["filterOptions"]["partSystemItems"] = partSystemItems;
                } else {
                  apiData["filterOptions"] = { partSystem: partSystem };
                  apiData["filterOptions"] = { partSystemItems: partSystemItems };
                }

                if (getFilteredValues != null) {
                  partSystem = getFilteredValues.partSystem == undefined || getFilteredValues.partSystem == "undefined" ? partSystem : getFilteredValues.partSystem;
                  partSystemItems = getFilteredValues.partSystemItems == undefined || getFilteredValues.partSystemItems == "undefined" ? partSystemItems : getFilteredValues.partSystemItems;
                  if (partSystem.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partSystem"] = partSystem;
                  apiData["filterOptions"]["partSystemItems"] = partSystemItems;
                } else {
                  apiData["filterOptions"] = { partSystem: partSystem };
                  apiData["filterOptions"] = { partSystemItems: partSystemItems };
                }
              }
              break;
            case 33:
                let trainingType = '';
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["trainingType"] = trainingType;
                } else {
                  apiData["filterOptions"] = { trainingType: trainingType };
                }

                if (getFilteredValues != null) {
                  trainingType = getFilteredValues.trainingType == undefined || getFilteredValues.trainingType == "undefined" ? trainingType : getFilteredValues.trainingType;
                  if (trainingType) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["trainingType"] = trainingType;
                } else {
                  apiData["filterOptions"] = { trainingType: trainingType };
                }
                break;
            case 34:
              let trainingStatus = '';
              if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                apiData["filterOptions"]["trainingStatus"] = trainingStatus;
              } else {
                apiData["filterOptions"] = { trainingStatus: trainingStatus };
              }

              if (getFilteredValues != null) {
                trainingStatus = getFilteredValues.trainingStatus == undefined || getFilteredValues.trainingStatus == "undefined" ? trainingStatus : getFilteredValues.trainingStatus;
                if (trainingStatus) {
                  ++filterActiveCount;
                }
              }
              if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                apiData["filterOptions"]["trainingStatus"] = trainingStatus;
              } else {
                apiData["filterOptions"] = { trainingStatus: trainingStatus };
              }
              break;
          }
          i++;
        }

        //console.log(apiData)

        if (filterActiveCount == 0) {
          filterOptions["filterActive"] = false;
        }

        //console.log(apiData, solrFlag)
        let flag: any = true;
        let filterData = {
          filterOptions: filterOptions,
          apiData: apiData,
          filterActiveCount: filterActiveCount,
        };
        if(solrFlag) {
          switch (groupId) {
            case 2:
              localStorage.setItem(filterNames.thread, JSON.stringify(apiData.filterOptions));
              break;
            case 4:
              localStorage.setItem(filterNames.document, JSON.stringify(apiData.filterOptions));
              break;
            case 6:
              localStorage.setItem(filterNames.part, JSON.stringify(apiData.filterOptions));
              break;
            case 30:
              localStorage.setItem(filterNames.search, JSON.stringify(apiData.filterOptions));
              break;
          }

        }
        if(groupId == 39) {
          localStorage.setItem(filterFieldStorage, JSON.stringify(filterFieldItems))
        }
        localStorage.removeItem("landingNav");
        localStorage.setItem("filterWidget", flag);
        localStorage.setItem("filterData", JSON.stringify(filterData));
      }
    });
  }

  // Setup Filter Active Data
  setupFilterActiveData(filterOptions, filterData, filterActiveCount) {
    if (filterData.make != "undefined" && filterData.make != undefined) {
      if (filterData.make.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.model != "" && filterData.model != "undefined" && filterData.model != undefined) {
      if (filterData.model.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.year != "undefined" && filterData.year != undefined) {
      if (filterData.year.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.workstream != "undefined" && filterData.workstream != undefined) {
      if (filterData.workstream.length == 1 && filterData.workstream.length != this.defaultWsVal) {
        ++filterActiveCount;
      } else if (filterData.workstream.length > 1) {
        ++filterActiveCount;
      }
    }

    if (filterData.tags != "undefined" && filterData.tags != undefined) {
      if (filterData.tags.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.countries != "undefined" && filterData.countries != undefined) {
      if (filterData.countries.length > 0) {
        ++filterActiveCount;
      }
    }

    if (
      filterData.mediaTypes != "undefined" &&
      filterData.mediaTypes != undefined
    ) {
      if (filterData.mediaTypes.length > 0) {
        ++filterActiveCount;
      }
    }

    if (
      filterOptions["filterData"] && filterData.startDate != "undefined" &&
      filterData.startDate != undefined
    ) {
      if (filterData.startDate != "") {
        for (let f of filterOptions["filterData"]) {
          if (f.id == 7) {
            f.value = filterData.startDate;
          }
        }
        ++filterActiveCount;
      }
    }

    if (filterOptions["filterData"] && filterData.endDate != "undefined" && filterData.endDate != undefined) {
      if (filterData.endDate != "") {
        for (let f of filterOptions["filterData"]) {
          if (f.id == 8) {
            f.value = filterData.endDate;
          }
        }
        ++filterActiveCount;
      }
    }

    if (filterData.territories != "undefined" && filterData.territories != undefined) {
      if (filterData.territories.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.locations != "undefined" && filterData.locations != undefined) {
      if (filterData.locations.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.customers != "undefined" && filterData.customers != undefined) {
      if (filterData.customers.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.technicians != "undefined" && filterData.technicians != undefined) {
      if (filterData.technicians.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.csm != "undefined" && filterData.csm != undefined) {
      if (filterData.csm.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.status != "undefined" && filterData.status != undefined) {
      if (filterData.status.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.threadStatus != "undefined" && filterData.threadStatus != undefined) {
      if (filterData.threadStatus.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.errorCode != "undefined" && filterData.errorCode != undefined) {
      if (filterData.errorCode.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.otherUsers != "undefined" && filterData.otherUsers != undefined) {
      if (filterData.otherUsers.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.dealerNames != "undefined" && filterData.dealerNames != undefined) {
      if (filterData.dealerNames.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.dealerCities != "undefined" && filterData.dealerCities != undefined) {
      if (filterData.dealerCities.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.dealerArea != "undefined" && filterData.dealerArea != undefined) {
      if (filterData.dealerArea.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.productCoor != "undefined" && filterData.productCoor != undefined) {
      if (filterData.productCoor.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.tmanagers != "undefined" && filterData.tmanagers != undefined) {
      if (filterData.tmanagers.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.probCatg != "undefined" && filterData.probCatg != undefined) {
      if (filterData.probCatg.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.complaintCategory != "undefined" && filterData.complaintCategory != undefined) {
      if (filterData.complaintCategory.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.symtoms != "undefined" && filterData.symtoms != undefined) {
      if (filterData.symtoms.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.language != "undefined" && filterData.language != undefined) {
      if (filterData.language.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.subProductGroup != "undefined" && filterData.subProductGroup != undefined) {
      if (filterData.subProductGroup.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.partType != "undefined" && filterData.partType != undefined) {
      if (filterData.partType.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.partAssembly != "undefined" && filterData.partAssembly != undefined) {
      if (filterData.partAssembly.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.partSystem != "undefined" && filterData.partSystem != undefined) {
      if (filterData.partSystem.length > 0) {
        ++filterActiveCount;
      }
    }
    if (filterOptions["filterData"] && filterData.trainingType != "undefined" && filterData.trainingType != undefined) {
      if (filterData.trainingType) {
        for (let f of filterOptions["filterData"]) {
          if (f.id == 33) {
            f.value = filterData.trainingType;
          }
        }
        ++filterActiveCount;
      }
    }
    if (filterOptions["filterData"] && filterData.trainingStatus != "undefined" && filterData.trainingStatus != undefined) {
      if (filterData.trainingStatus) {
        for (let f of filterOptions["filterData"]) {
          if (f.id == 34) {
            f.value = filterData.trainingStatus;
          }
        }
        ++filterActiveCount;
      }
    }
    return filterActiveCount;
  }

  // Get Site Logo
  /*getSiteLogo(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("link", data.link);
    const body = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl.apiGetSiteLogo(), body, {
      params: params,
    });
  }*/

    // Thread Creation API
  getSiteLogo(data) {
    return this.http.post<any>(this.apiUrl.apiGetSiteLogo(), data);
  }

  GetGroupAndDirectMessagewithCount(typeData) {
    return this.http.post<any>(
      this.apiUrl.apiGetGroupAndDirectMessagewithCount(),
      typeData
    );
  }

  apiCall(url, data) {
    //console.log(url, data);
    return this.http.post<any>(url, data);
  }

  // Create Document
  createDocument(docData) {
    return this.http.post<any>(this.apiUrl.apiCreateDoc(), docData);
  }

  // Manage Adas Procedure
  manageAdasProcedure(adasData) {
    return this.http.post<any>(this.apiUrl.apiManageAdas(), adasData);
  }

   //Create Bug or Featuer
   createbugfeature(data) {
    return this.http.post<any>(this.apiUrl.apiCreatebugfeature(),data);
  }
  //Bug or Feature list
  bugsfeaturelist(data) {
    return this.http.post<any>(this.apiUrl.apiBugsFeatureList(),data);
  }
  //Bug or Feature Reply post
  bugfeatureReplypost(data){
    return this.http.post<any>(this.apiUrl.apibugfeatureReplypost(),data);
  }
  //Bug or Fetaure PostApi
  bugfeaturePostlist(data){
    return this.http.post<any>(this.apiUrl.apibugfeaturepostapicall(),data)
  }
  //Bug or Feature Update post
  bugfeatureUpdatepost(data){
    return this.http.post<any>(this.apiUrl.apibugfeatureupdatepost(),data)
  }

  unique(arr, keyProps) {
    const kvArray = arr.map((entry) => {
      const key = keyProps.map((k) => entry[k]).join("|");
      return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
  }

  // Get Filter Values
  getFilterValues(landingFlag, filter) {
    //console.log(filter);
    let getFilteredValues = null;
    if (landingFlag) {
      localStorage.removeItem(filter);
    } else {
      let filterValues = localStorage.getItem(filter);
      getFilteredValues = JSON.parse(filterValues);
      //console.log(getFilteredValues);
    }
    //console.log(getFilteredValues);
    return getFilteredValues;
  }

  // Get Industry Type
  getIndustryType() {
    let industryType: any = localStorage.getItem("industryType");
    industryType =
      industryType == "undefined" || industryType == undefined
        ? 1
        : industryType;
    let typeIndex = industryTypes.findIndex(
      (option) => option.id == industryType
    );
    let type = typeIndex >= 0 ? industryTypes[typeIndex] : industryTypes[0];
    return type;
  }

  // Number With Commas
  numberWithCommas(num) {
    //return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    var res = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
  }

  // Number With Commas
  numberWithCommasTwoDigit(x) {
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  }

  // Number With Commas
  numberWithCommasThreeDigit(num) {
    var res = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
  }

  // Remove Commas from number
  removeCommaNum(num) {
    //console.log(num);
    let re = /\,/gi;
    //console.log(num.replace(re, ""));
    return num.replace(re, "");

  }

  // Split Current Url
  splitCurrUrl(url) {
    let currUrl = url.split('/');
    let navFrom = currUrl[1];
    return navFrom;
  }

  // Set List Page Local Storage
  setListPageLocalStorage(wsFlag, navFrom, scrollTop) {
    localStorage.setItem('wsNav', wsFlag);
    localStorage.setItem('wsNavUrl', navFrom);
    localStorage.setItem('wsScrollPos', scrollTop);
  }

  // Set Search Page Local Storage
  setSearchPageLocalStorageNew(navFrom, scrollTop, offset, data) {
    localStorage.setItem('sNavUrl', navFrom);
    localStorage.setItem('sScrollPos', scrollTop);
    localStorage.setItem('sOffset', offset);
    localStorage.setItem('sListData', data);
  }

  // Set  Local Storage
  setPreviewPageLocalStorage(id, titletext,iframeurl) {
    localStorage.setItem('previewId', id);
    localStorage.setItem('previewTitle', titletext);
    localStorage.setItem('previewURL', iframeurl);
    //localStorage.setItem('previewMediaId', mid);
    //localStorage.setItem('preScrollPos', scrolls);
  }

  // Set Search Page Local Storage
  setSearchPageLocalStorage(navFrom, scrollTop) {
    localStorage.setItem('sNavUrl', navFrom);
    localStorage.setItem('sScrollPos', scrollTop);
  }

  // Set Search Page Local Storage
  setProfilePageLocalStorage(navFrom, scrollTop) {
    localStorage.setItem('pNavUrl', navFrom);
    localStorage.setItem('pScrollPos', scrollTop);
}

  // set Local storage item
  setlocalStorageItem(item, val) {
    localStorage.setItem(item, val);
  }

  // Check Video Job Status
  checkJobStatus(jobData) {
    const params = new HttpParams()
    .set('apiKey', jobData.apiKey)
    .set('jobId', jobData.jobId)
    .set('userId', localStorage.getItem('userId'))
    .set('domainId', localStorage.getItem('domainId'))
    const body = JSON.stringify(jobData);

    return this.http.post<any>(this.apiUrl.apiVideoJobStatus(), body, {'params': params})
  }

  // Checking filter applied
  checkFilterApply(fields, chkFields) {
    //console.log(fields, chkFields)
    let filterCount = 0;
    let clearItems:any = [];
    Object.entries(fields).forEach((item) => {
      let key:any = item[0];
      let val:any = item[1];
      let ValueType = Array.isArray(val);
      let chkIndex = chkFields.findIndex(option => option == key);
      if(chkIndex < 0) {
        if(ValueType) {
          if(val.length > 0) {
            clearItems.push(key);
            filterCount++;
          }
        } else {
          let isBooleanFlag: any = (typeof(item[1]) === "boolean") ? true : false;
          let chkFlg = (key == 'orderBy' || key == 'type') ? false : true;
          if(chkFlg && !isBooleanFlag && val != null && val != 0) {
            //console.log(key, val, isBooleanFlag)
            clearItems.push(key);
            filterCount++;
          }
        }
      }
    });
    let data = {
      filterCount: filterCount,
      clearItems: clearItems
    }
    return data;
  }

  // Clear Filter Values
  clearFilterValues(fields, clearItems) {
    Object.entries(fields).forEach((item) => {
      let key = item[0];
      let val:any = item[1];
      let chkIndex = clearItems.findIndex(option => option == key);
      if(chkIndex >= 0) {
        let ValueType = Array.isArray(val);
        if(ValueType) {
          val = [];
        } else {
          let isBooleanFlag: any = (typeof(item[1]) === "boolean") ? true : false;
          if(!isBooleanFlag && val != null && val != 0) {
            val = '';
            //console.log(key, isBooleanFlag, val)
          }
        }
        fields[key] = val;
      }
    });
    return fields;
  }

  // Check navigation edit
  checkNavEdit(curl = '') {
    //console.log(curl)
    let wsNav:any = localStorage.getItem('wsNav');
    let landingRecentNav = localStorage.getItem('landingRecentNav');
    let wsNavUrl = (landingRecentNav) ? RedirectionPage.Home : localStorage.getItem('wsNavUrl');
    let url = ((wsNav || landingRecentNav) && curl == '') ? wsNavUrl : curl;
    //console.log(url)
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let routeLoadIndex = pageDataIndex;
    let navText = pageTitle[pageDataIndex].navEdit;
    let navFromEdit:any = localStorage.getItem(navText);
    if(landingRecentNav) {
      let routerText = pageTitle[pageDataIndex].routerText;
      localStorage.setItem(routerText, 'true');
    }
    setTimeout(() => {
      localStorage.removeItem(navText);
      localStorage.removeItem('landingRecentNav');
    }, 100);
    let data = {
      navEditText: navText,
      url: url,
      navFromEdit: navFromEdit,
      routeLoadIndex: routeLoadIndex,
    };
    return data;
  }

  hasBlankSpaces(str){
    return  str.match(/^\s+$/) !== null;
  }

  // GET DTC Lists
  getDTCLists(dtcData): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', dtcData.apiKey)
      .set('userId', dtcData.userId)
      .set('domainId', dtcData.domainId)
      .set('countryId', dtcData.countryId)
      .set('type', dtcData.type)
      .set('searchKey', dtcData.searchKey)
      .set('offset', dtcData.offset)
      .set('limit', dtcData.limit)
    const body = JSON.stringify(dtcData);

    return this.http.post<any>(this.apiUrl.apiDtcList(),  body, {'params': params})
  }

  // GegetPageActiont Tags List
  getPageAction(data) {
    let mData = new FormData();
    let accessPlatForm:any = 3;
    mData.append("api_key", data.apikey);
    mData.append("user_id", data.user_id);
    mData.append("domain_id", data.domain_id);
    mData.append("countryId", data.countryId);
    mData.append("pageFrom", data.contentTypeId);
    mData.append('platform', accessPlatForm);
    return this.http.post<any>(this.apiUrl.apiGetloginactivity(), mData);
  }

  // Splitting the Array Into Even Chunks Using slice()
  sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
  }

  createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  // Check date
  isDate(sDate) {
    let flag =  (sDate.toString() == parseInt(sDate).toString()) ? false : true;
    return flag;
  }

  // Copy clipboard
  copyToClipboard(item): void {
    //item = item.replace(/<\/?[^>]+(>|$)/g, "");
    item = item.replace(/(<([^>]+)>)/gi, "");
    let listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (item));
        e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }

  convertHTMLEntity(text){
    const span = document.createElement('span');
      return text
      .replace(/&[#A-Za-z0-9]+;/gi, (entity,position,text)=> {
          span.innerHTML = entity;
          return span.innerText;
      });
  }

  // Get Filter List from Solr
  getSolrFilterList(data, access='') {
    const body = JSON.stringify(data);
    if(access == 'filter') {
      return this.http.post<any>(this.apiUrl.apiSolrSearchList(), body);
    } else {
      return this.http.post<any>(this.apiUrl.apiSolrFilterList(), body);
    }
  }

  // Get ADAS Procedure List from Solr
  getSolrAdasList(type, data) {
    const body = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl.apiSolrAdasList(type), body);
  }

  // Setup Filter Data from local storage
  setfilterData(access) {
    let filter;
    let getFilteredValues;
    let landingNav = localStorage.getItem("landingNav");
    let landingFlag = landingNav != null ? true : false;
    let filterOptions: any = [];
    switch(access) {
      case 'threads':
        filter = filterNames.thread;
        break;
      case 'documents':
        filter = filterNames.document;
        break;
      case 'parts':
        filter = filterNames.part;
        break;
    }
    getFilteredValues = this.getFilterValues(landingFlag, filter);
    //console.log(getFilteredValues)

    filterOptions = (getFilteredValues == null || getFilteredValues == 'undefined' || getFilteredValues == undefined) ? {} : getFilteredValues;
    Object.keys(filterOptions).forEach(key => {
      if(access == 'threads' || access == 'parts') {
        let val = filterOptions[key];
        switch(key) {
          case 'make':
            filterOptions[key] =  Array.isArray(val) ? val[0] : val;
            break;
          case 'errorCode':
          case 'errorCodeItems':
            filterOptions[key] = val;
            break;
        }
      }
    });
    return filterOptions;
  }

  getContentType(id) {
    //console.log(id)
    let type = '';
    let typeIndex = contentTypeInfo.findIndex(option => option.id == id);
    //console.log(typeIndex)
    if(typeIndex >= 0) {
      type = contentTypeInfo[typeIndex].type;
    }
    return type;
  }

  // keyword priority
  getKeyWordPriority(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetKeyWordPriority(), systemData);
  }

  // Update List View
  updateLsitView(content, view, apiCall) {
    let userInfo:any = this.authenticationService.userValue;
    let listView: any = (view == 'list') ? 1 : 0;
    let countryId = localStorage.getItem('countryId');
    localStorage.setItem('threadViewType', view);
    var apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', userInfo.domain_id);
    apiFormData.append('countryId', countryId);
    apiFormData.append('userId', userInfo.Userid);

    switch (content) {
      case 'threads':
        apiFormData.append('listViewThread', listView);
        break;

      default:
        break;
    }
    if(apiCall) {
      this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe((response) => {
        //console.log(response);
      });
    }
  }

  getFilterByKeyVal(field, getFilteredValues) {
    let response: any = [];
    field.forEach((item, index) => {
      response.push({field: item, val: '', isActive: false});
      if (getFilteredValues && getFilteredValues != null) {
        switch (item) {
          case 'make':
            if (getFilteredValues.make && getFilteredValues.make != '') {
              response[index].val = getFilteredValues.make;
              response[index].isActive = true;
            }
            break;
          case 'model':
            if (getFilteredValues.model && getFilteredValues.model != '') {
              response[index].val = getFilteredValues.model;
              response[index].isActive = true;
            }
            break;
          case 'currentDtcStrArr':
            if (getFilteredValues.errorCode && getFilteredValues.errorCode != '') {
              response[index].val = getFilteredValues.errorCode;
              response[index].isActive = true;
            }
            break;
        }
      }
    });
    return response;
  }
  // system setting
  getSystemSettings(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetSystemSettings(), systemData);
  }

  // system setting
  updateSystemSettings(systemData) {
    return this.http.post<any>(this.apiUrl.apiUpdateSystemSettings(), systemData);
  }

   // system setting
  getSystemSettingsMenus(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetSystemSettingsMenus(), systemData);
  }

   // role mapping
   getRolesMappingList(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetRolesMappingList(), systemData);
  }

  // role mapping
  getAccountypeandBussRoles(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetAccountypeandBussRoles(), systemData);
  }

  // role mapping
  updateBussRoleSettings(systemData) {
    return this.http.post<any>(this.apiUrl.apiUpdateBussRoleSettings(), systemData);
  }

  // User Settings Menu API
  apiGetUserSettingsMenu(menuData) {
    return this.http.post<any>(this.apiUrl.apiGetUserSettingsMenu(), menuData);
  }

  // User Settings Menu API V2
  getUserTypeContentTypeLists(menuData) {
    return this.http.post<any>(this.apiUrl.apiGetUserTypeContentTypeLists(), menuData);
  }

  // config notification list
 getConfigNotificationLists(menuData) {
    return this.http.post<any>(this.apiUrl.apiGetConfigNotificationLists(), menuData);
  }

// config notification list
getEscConfigLists(menuData) {
  return this.http.post<any>(this.apiUrl.apiGetEscConfigLists(), menuData);
}

// config notification list
updateEscConfigLists(menuData) {
  return this.http.post<any>(this.apiUrl.apiUpdateEscConfigLists(), menuData);
}

    // config notification update
  updateConfigNotification(menuData) {
  return this.http.post<any>(this.apiUrl.apiUpdateConfigNotification(), menuData);
}


  // Get Dispatch Notification Config
  getDispatchNotificationConfig(systemData) {
    return this.http.post<any>(this.apiUrl.apiDispatchNotificationConfig(), systemData);
  }

  // Get Dispatch Notification Update
  UpdateDispatchNotification(systemData) {
    return this.http.post<any>(this.apiUrl.apiDispatchNotificationUpdate(), systemData);
  }

  // Make Notification Config
 getAllowedDomains(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetAllowedDomains(), systemData);
  }

  // Make Notification Config
 getUpdateDomains(systemData) {
    return this.http.post<any>(this.apiUrl.apiUpdateAllowedDomains(), systemData);
  }

  // Make Notification Config
  getSettingsMakeFilterConfig(systemData) {
    return this.http.post<any>(this.apiUrl.apiGetSettingsMakeFilterConfig(), systemData);
  }

  // Get Make update Notification Config API
  UpdateMakeSettingsFilterV2(systemData) {
    return this.http.post<any>(this.apiUrl.apiUpdateMakeSettingsFilterV2(), systemData);
  }

  // Get Dispatch Notification Update
  getStoreInfoList(data) {
    return this.http.post<any>(this.apiUrl.apiGetStoreInfoList(), data);
  }

  // Get Audit List
  getAuditList(data) {
    return this.http.post<any>(this.apiUrl.apiGetAuditList(), data);
  }

  manageAudit(data) {
    return this.http.post<any>(this.apiUrl.apiManageAudit(), data);
  }

  // Get FAQ List
  getFaqList(data) {
    return this.http.post<any>(this.apiUrl.apiGetFaqList(), data);
  }

  // Get Customer List
  getCustomerList(data) {
    return this.http.post<any>(this.apiUrl.apiGetCustomerList(), data);
  }

  // Get Customer Notes 
  getCustomerNotesSave(data) {
    return this.http.post<any>(this.apiUrl.apiGetCustomerNotesSave(), data);
  }
  
  // Get FAQ List
  manageFaq(data) {
    return this.http.post<any>(this.apiUrl.apiManageFaq(), data);
  }

  // Get Feedback Fields
  getFeedbackFields(data) {
    return this.http.post<any>(this.apiUrl.apiGetFeedbackFields(), data);
  }

  // Get Manage Feedback
  manageFeedback(data) {
    return this.http.post<any>(this.apiUrl.apiManageFeedback(), data);
  }

  // Delete ADAS File
  deleteAdasFile(data) {
    return this.http.post<any>(this.apiUrl.apiAdasFile(), data);
  }

  updateCartItem(data) {
    this.threadApi.updateCartItemsWithDetails(data).subscribe((resp: any) => {
      localStorage.setItem('marketplaceCartId',resp.data.id);
      this.cartUpdateSubject.next(resp.data);
      this.cartProductsList.next({
        trainingIds: resp.data?.trainingIds?.split(','), manualIds: resp.data?.manualIds?.split(',')
      });
    }, (error: any) => {
      console.error("error: ", error);
    });
  }

  apiGetMarketPlaceCustomerList(data: any) {
    let params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainId', data.domainId);
    return this.http.get<any>(this.apiUrl.apiGetAllCustomerData(), {'params': params});
  }

  formatCompactNumber(number) {
    if (number < 1000) {
      return number;
    } else if (number >= 1000 && number < 1_000_000) {
      return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
      return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
      return (number / 1_000_000_000).toFixed(1) + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
      return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
  }
  

}
