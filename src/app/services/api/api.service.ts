import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  pageInfo,
  Constant,
  PlatFormType,
  thirdPartApiUrl,
} from "src/app/common/constant/constant";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  public threadListView = "1";
  public jobandratecardNewButton = false;
  public repairOrderPublicPage = false;
  public iscanPublicPage = false;
  public threadViewPublicPage = false;
  public repairOrderPublicDomainId = "338";
  public threadViewPublicDomainId = "";
  public iscanPublicDomainId = "366";
  public repairOrderPublicUserId = "4440";
  public threadViewPublicUserId = "";
  public iscanPublicUserId = "";
  public techSupportFlagServer = false;
  public domainMembersShowFlag = false;
  public newupdateRefresh = false;
  public upgradePopupShow = "";
  public techsupportNewButton = false;
  public webUpdatesArray = [];
  public attachmentLinkError = "";
  public attachmentNewPOPUP = false;
  public mediaApplyCall = false;
  public searchFromPageNameClose = false;
  public searchPageRedirectFlag = "0";
  public searchPageDocRedirectFlag = "0";
  public searchPageDocPageRedirectFlag = "0";
  public searchPagePartRedirectFlag = "0";
  public searchPagePartPageRedirectFlag = "0";
  public searchPageKARedirectFlag = "0";
  public knowledgeArtCall = "0";
  public searchFromWorkstream = false;
  public searchFromWorkstreamValue = "";
  public kaCategory = false;
  public uploadURL: string;
  public userName = "";
  public profileImage = "";
  public LastLogin = "";
  public userRole = "";
  public newThreadAccessLevel = 0; // accessLevel
  public enableAccessLevel = false; // accessLevel
  public roleMapPublishbutton = false; // rolemap
  // Thread Detail
  public checkDiscard = false;
  public postButtonEnable = false;
  public postReplyButtonEnable = false;
  public postSaveButtonEnable = false;
  public uploadCommentFlag = false;
  public tagCommentFlag = false;
  public uploadReplyFlag = false;
  public tagReplyFlag = false;

  public collabticApi: string;
  public collabticV3Api: string;
  public collabticForumApi: string;
  public collabticLandingApi: string;

  public reviewApi: string;
  public collabticDashApi: string;
  public collabticProbingApi: string;
  public collabticVehicleApi: string;
  public collabticGTSApi: string;
  public collabticAccountsApi: string;
  public productInfoApi: string;
  public escalationV2Api: string;
  public productmakeApi: string;
  public partsApi: string;
  public knowledgeBaseApi: string;
  public knowledgeArticleApi: string;
  public resourceApi: string;
  public searchApi: string;
  public uploadApi: string;
  public mediaApi: string;
  public mediaUploadApi: string;
  public testApi: string;
  public vimeoApi: string;
  public notificationApi: string;
  public pushApi: string;
  public threadPostApi: string;
  public threadPostApi2: string;
  public langApi: string;
  public platformInfo = localStorage.getItem("platformId");
  public demoGtsMahale: string = Constant.TechproMahleApi;
  public jobStatusApi: string;
  public modalapi: string;
  public serviceProviderApi: string;
  public kaizenApi: string;
  public platformIdInfo = localStorage.getItem("platformId");
  public collabticLocalhost: string = Constant.CollabticV3ApiUrl;
  public supportApi: string;
  public networkApi: string;
  public dekraApi: string;
  // http://localhost:8080/v1/
  // public collabticLocalhost: string = Constant.collabticV3PreProdApiUrl;

  constructor(private router: Router, private route: ActivatedRoute) {
    let platformId = localStorage.getItem("platformId");
    if (platformId === null || platformId === "null") {
      platformId = PlatFormType.Collabtic;
      // platformId=PlatFormType.MahleForum;
      // platformId=PlatFormType.CbaForum;
    }
    this.collabticV3Api = Constant.collabticV3ApiUrl;

    if (platformId === PlatFormType.Collabtic) {
      this.collabticApi = Constant.CollabticApiUrl;
      this.enableAccessLevel = true; // Roles and Permission - Access Level Enabled
    } else if (platformId === PlatFormType.MahleForum) {
      this.collabticApi = Constant.TechproMahleApi;
      this.enableAccessLevel = true; // Roles and Permission - Access Level Enabled
    } else if (platformId === PlatFormType.CbaForum) {
      this.collabticApi = Constant.CbaApiUri;
      this.collabticV3Api = Constant.CbaV3ApiUri;
      this.enableAccessLevel = true; // Roles and Permission - Access Level Enabled
    } else if (platformId === PlatFormType.KiaForum) {
      this.collabticApi = Constant.KiaApiUri;
    } else {
      this.collabticApi = Constant.CollabticApiUrl;
    }

    // set upload url for ckeditor
    this.uploadURL = `${this.collabticApi}/accounts/UploadAttachtoSvr`;

    // this.collabticApi = Constant.TechproMahleApi;
    this.collabticForumApi = `${this.collabticApi}/forum`;
    this.collabticLandingApi = `${this.collabticApi}/Landingpage`;
    this.collabticDashApi = `${this.collabticApi}/dashboard`;
    this.productInfoApi = `${this.collabticApi}/Productmatrix`;
    this.escalationV2Api = `${this.collabticApi}/Escalation`;
    this.partsApi = `${this.collabticApi}/parts`;
    this.knowledgeBaseApi = `${this.collabticApi}/knowledgebase`;
    this.knowledgeArticleApi = `${this.collabticApi}/softwaredl`;
    this.resourceApi = `${this.collabticApi}/resources`;
    this.searchApi = `${this.collabticApi}/search`;
    this.productmakeApi = `${this.collabticApi}/vehicle`;
    this.collabticAccountsApi = `${this.collabticApi}/accounts`;
    this.kaizenApi = `${this.collabticApi}/kaizen`;
    this.serviceProviderApi = "https://collabtic-v3api.collabtic.com/v1/";
    this.supportApi = `${this.collabticApi}/support`;
    this.networkApi = Constant.DekraApiUrl;
    this.dekraApi = Constant.DekraApiUrl;
    // this.uploadApi = `${this.collabticApi}/threadpost/AttachmentUploadNew`;

    if (this.platformInfo !== "1") {
      this.uploadApi = `${this.collabticApi}/threadpost/AttachmentUpload`;
    } else {
      this.uploadApi = `${this.collabticApi}/threadpost/AttachmentUploadV2`;
    }
    this.mediaApi = `${this.collabticApi}/media`;
    // this.mediaUploadApi = `${this.mediaApi}/UpdateandUploadattachments`;
    this.modalapi = `${this.collabticApi}/productmatrix`;

    // this.mediaUploadApi = `${this.collabticApi}/threadpost/AttachmentUpload`;
    if (this.platformInfo !== "1") {
      this.mediaUploadApi = `${this.collabticApi}/threadpost/AttachmentUpload`;
    } else {
      this.mediaUploadApi = `${this.collabticApi}/threadpost/AttachmentUploadV2`;
    }
    this.vimeoApi = "http://vimeo.com/api/v2/video";
    this.notificationApi = `${this.collabticApi}/forumnewversion`;
    this.pushApi = `${this.collabticApi}/push`;
    // this.threadPostApi = `${this.collabticApi}/threadpost/ChatFileUploadV2`;

    this.threadPostApi2 = `${this.collabticApi}/threadpost/`;
    this.langApi = `${this.resourceApi}/getLangUageList`;

    if (this.platformInfo !== "1") {
      this.threadPostApi = `${this.collabticApi}/threadpost/ChatFileUpload`;
      this.jobStatusApi = `${this.collabticForumApi}/getawsvideojobstatus`;
    } else {
      this.jobStatusApi = `${this.dekraApi}media/jobstatusvalidation`;
      //this.jobStatusApi = `${this.collabticForumApi}/getawsvideojobstatusV2`;
      this.threadPostApi = `${this.collabticApi}/threadpost/ChatFileUploadV2`;
    }
  }

  // Base Collabtic Forum API URL
  apiCollabticBaseUrl() {
    return `${this.collabticApi}`;
  }
  // Base Collabtic V3 API URL
  apiCollabticV3BaseUrl() {
    return `${this.collabticV3Api}`;
  }
  apiSolrSearchList() {
    // return 'http://devsolrsearch-env.eba-rcqceawd.us-west-2.elasticbeanstalk.com/nlp/api/v1/search';
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/search?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/search?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/search?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/search?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/search";
    }
  }

  apiSolrThreadDetail() {
    // return 'http://devsolrsearch-env.eba-rcqceawd.us-west-2.elasticbeanstalk.com/nlp/api/v1/search';
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/detail?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/detail?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/detail?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/detail?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/detail";
    }
  }

  apiSolrThreadDetailFixList() {
    // return 'http://devsolrsearch-env.eba-rcqceawd.us-west-2.elasticbeanstalk.com/nlp/api/v1/search';
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/detail/new?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/detail/new?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/detail/new?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/detail/new?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/detail/new";
    }
  }

  apiSolrDataList() {
    // return 'http://devsolrsearch-env.eba-rcqceawd.us-west-2.elasticbeanstalk.com/nlp/api/v1/search';
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/list?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/list?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/list?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/list?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/list";
    }
  }

  apiSolrFilterList() {
    const SolrAPIUrl = Constant.SolrAPIUrl;
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return `${SolrAPIUrl}/filters?client=boyd`;
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/filters?client=keeps";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return `${SolrAPIUrl}/filters?client=cbatac`;
    } else if (domainId === Constant.MSSdomainId) {
      return `${SolrAPIUrl}/filters?client=mss`;
    } else {
      return `${SolrAPIUrl}/filters`;
    }
  }

  apiSolrReportSearchList() {
    const SolrAPIUrl = Constant.SolrAPIUrl;
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return `${SolrAPIUrl}/reports/search?client=boyd`;
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return `${SolrAPIUrl}/reports/search?client=keeps`;
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return `${SolrAPIUrl}/reports/search??client=cbatac`;
    } else {
      return `${SolrAPIUrl}/reports/search`;
    }
  }

  apiSolrManageReport() {
    const SolrAPIUrl = Constant.SolrAPIUrl;
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return `${SolrAPIUrl}/admin/reports/update?client=boyd`;
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return `${SolrAPIUrl}/admin/reports/update?client=keeps`;
    } else {
      return `${SolrAPIUrl}/admin/reports/update`;
    }
  }

  apiSolrSuggList() {
    const domainId = localStorage.getItem("domainId");
    // return 'http://devsolrsearch-env.eba-rcqceawd.us-west-2.elasticbeanstalk.com/nlp/api/v1/search';

    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/suggest?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/suggest?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/suggest?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/suggest?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/suggest";
    }
  }

  apiSolrReportSuggList() {
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/suggest?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/suggest?client=keeps";
    } else {
      return Constant.SolrAPIUrl + "/reports/suggest";
    }
  }

  // document List...
  apiSolrDocumentFileList() {
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/list?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/list?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/list?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/list?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/list";
    }
    /*if (this.platformIdInfo === PlatFormType.CbaForum)
    {
      return Constant.SolrAPIUrl + '/list?client=cbatac';
    }
    else{
      return Constant.SolrAPIUrl + '/list';
    }*/
  }

  apiSolrDocumentSearchList() {
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/search?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/search?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/search?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/search?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/search";
    }
    /*if (this.platformIdInfo === PlatFormType.CbaForum)
    {
      return Constant.SolrAPIUrl + '/search?client=cbatac';
    }
    else{
      return Constant.SolrAPIUrl + '/search';
    }*/
  }

  // document List...
  apiSolrDocumentFoldersList() {
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/folders?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/folders?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/folders?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/folders?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/folders";
    }
    /*
      if (this.platformIdInfo === PlatFormType.CbaForum)
      {
        return Constant.SolrAPIUrl+'/folders?client=cbatac';
      }
      else{
        return Constant.SolrAPIUrl+'/folders';
      }
    */
  }

  // ka category List...
  apiSolrKACatFoldersList() {
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      return Constant.SolrAPIUrl + "/folders/ka?client=boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      return Constant.SolrAPIUrl + "/folders/ka?client=keeps";
    } else if (domainId === Constant.MSSdomainId) {
      return Constant.SolrAPIUrl + "/folders/ka?client=mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      return Constant.SolrAPIUrl + "/folders/ka?client=cbatac";
    } else {
      return Constant.SolrAPIUrl + "/folders/ka";
    }
  }

  // Api Solr ADAS List
  apiSolrAdasList(type) {
    const apiPath = type === "folders" ? `${type}/adas` : type;
    let apiUrl = `${Constant.SolrAPIUrl}/${apiPath}`;
    let clientFlag = true;
    let clientType = "";
    const domainId = localStorage.getItem("domainId");
    if (domainId === Constant.CollabticBoydDomain) {
      clientType = "boyd";
    } else if (domainId === Constant.CollabticKeepsDataDomain) {
      clientType = "keeps";
    } else if (domainId === Constant.MSSdomainId) {
      clientType = "mss";
    } else if (this.platformIdInfo === PlatFormType.CbaForum) {
      clientType = "cbatac";
    } else {
      clientFlag = false;
    }
    if (clientFlag) {
      apiUrl = `${apiUrl}?client=${clientType}`;
    }
    return apiUrl;
  }

  // Base Dashboard API URL
  apiDashboardBaseUrl() {
    return `${this.collabticDashApi}`;
  }

  // Get Lang Api URL
  getLangApiUrl() {
    return `${this.langApi}`;
  }

  // Get Lang Api URL
  getGooglelangApiUrl(apiData) {
    // alert(apiData.key);

    return (
      "https://translation.googleapis.com/language/translate/v2?key=" +
      apiData.key +
      "&q=" +
      apiData.q +
      "&target=" +
      apiData.target +
      "&source=" +
      apiData.source +
      ""
    );
  }

  DetectGoogleContentlang(apiData) {
    // alert(apiData.key);

    return (
      "https://translation.googleapis.com/language/translate/v2/detect?key=" +
      apiData.key +
      "&q=" +
      apiData.q +
      ""
    );
  }

  // Get Dashboard Filter Widget Lists
  apiGetDashboardFilterWidgets() {
    return `${this.collabticDashApi}/dashboardFilterWidgets`;
  }

  apiGetWebAppVersion() {
    return `${this.collabticForumApi}/WebAppVersion`;
  }

  // Dashboard
  apiDashboard() {
    return `${this.collabticDashApi}/userDashboardreportv2updated`;
  }

  // Chart Details
  apiChartDetail() {
    return `${this.collabticDashApi}/ChartDetails`;
  }

  // Geographical Lists
  apiGeoList() {
    return `${this.collabticDashApi}/geographicalwidgets`;
  }

  // Export Dealer Activity
  apiExportDealerActivity() {
    return `${this.collabticDashApi}/useractivityfilterexport`;
  }

  // Get User Profile
  apiUserProfile() {
    return `${this.collabticApi}/user/getuserdetails`;
  }

  // New Probing Question
  apiNewProbingQuest() {
    return `${this.collabticProbingApi}/createProbingQuestions`;
  }

  // Get Probing Lists
  apiGetProbingLists() {
    return `${this.collabticProbingApi}/GetProbingquestionsList`;
  }

  // Get Probing Lists
  apiGetUserAvailability() {
    return `${this.collabticForumApi}/GetUserAvailability`;
  }

  // Delete Probing Question
  apiDeleteProbingQuest() {
    return `${this.collabticProbingApi}/deleteProbingQuestions`;
  }

  // Get Workstream Lists
  apiGetWorkstreamLists() {
    return `${this.collabticForumApi}/GetworkstreamsList`;
  }

  apiGetWorkstreamListsAPI() {
    return `${this.collabticForumApi}/GetworkstreamsAPI`;
  }
  apiGetworkstreamswithCount() {
    const platformId = localStorage.getItem("platformId");
    if (platformId === PlatFormType.CbaForum) {
      return `${this.collabticForumApi}/GetworkstreamsV3`;
    } else {
      return `${this.collabticForumApi}/GetworkstreamsAPI`;
    }
  }
  // Landing page widgets
  apiGetLandingpageOptions() {
    return `${this.collabticLandingApi}/GetLandingPagewidgets`;
  }
  apiGetRecentViews() {
    return `${this.collabticLandingApi}/GetRecentViews`;
  }
  apiTechSupportWidgets() {
    return `${this.collabticLandingApi}/TechSupportWidgets`;
  }

  apiManualsAndAnnouncementList() {
    return `${this.resourceApi}/ManualsAndAnnouncementList`;
  }

  apigetescalatethreadsAPI() {
    return `${this.collabticForumApi}/getescalatethreadsAPI`;
  }

  apigetusersearchHistory() {
    return `${this.searchApi}/GetusersearchHistory`;
  }
  apithreadwithWorkstreams() {
    return `${this.searchApi}/threadwithWorkstreams`;
  }
  apiclearsearchhistory() {
    return `${this.searchApi}/clearsearchhistory`;
  }
  apiUpdateSearchKeyword() {
    return `${this.searchApi}/UpdateSearchKeyword`;
  }

  apiEnhancedSearchAPI() {
    return `${this.searchApi}/EnhancedsearchAPI`;
  }
  apiGetAlldomainUsers() {
    return `${this.collabticForumApi}/GetAlldomainUsersAPI`;
  }

  apiTechSupportCommonAPIs() {
    return `${this.collabticForumApi}/TechSupportCommonAPIs`;
  }

  readandDeleteNotification() {
    return `${this.collabticApi}/forumnewversion/ReadandDeleteNotificationAPI`;
  }

  apiThreadCharts() {
    return `${this.collabticDashApi}/threadsCharts`;
  }
  // Get Product Type Lists
  apiGetProdTypeLists() {
    return `${this.collabticForumApi}/getProdTypeList`;
  }
  // for getting knowledge articles category
  apiAllKnowledgeArticleCategory() {
    return `${this.collabticApi}/softwaredl/GetKnowledgeArticlesByCategory`;
  }
  // for getting knowledge articles
  getAllKnowledgeArticle() {
    return `${this.collabticApi}/softwaredl/getKnowledgeArticlesList`;
  }
  // for manage knowledge article new and edit
  apiManageKnowledgeType() {
    return `${this.collabticApi}/softwaredl/SaveArticleV2`;
  }
  // for deleting knowledge articles
  apiDeleteKnowledgeArticle() {
    return `${this.collabticApi}/softwaredl/deleteArticles`;
  }
  getKnowledgeArticlesDetails() {
    return `${this.collabticApi}/softwaredl/getKnowledgeArticlesDetails`;
  }
  // Get Workstream Detail
  apiGetWorkstreamDetail() {
    return `${this.collabticForumApi}/LoadWorkstreamDetail`;
  }
  // Get Workstream Detail
  apiGetCategoryDetail() {
    return `${this.collabticForumApi}/GetThreadCategory`;
  }
  // Get Workstream Users
  apiGetWorkstreamUsers() {
    return `${this.collabticForumApi}/LoadWorkstreamDetailUsers`;
  }

  // Check Workstream Name Exists
  apiCheckWorkstreamName() {
    return `${this.collabticForumApi}/CheckWorkstreamTitle`;
  }

  // New Workstream
  apiNewWorkstream() {
    return `${this.collabticForumApi}/createWorkstreams`;
  }

  // Save Workstream
  apiSaveWorkstream() {
    return `${this.collabticForumApi}/SaveWorkstreammembers`;
  }

  // Get Vehicle Model Lists
  apiGetVehicleModelLists() {
    return `${this.collabticVehicleApi}/getmodelAPI`;
  }
  // get workflow
  apiWorkFlowContentTypes() {
    return `${this.dekraApi}gts/workflowcontenttypes`;
  }

  // Get GTS Lists
  apiGetGTSLists() {
    return `${this.dekraApi}gts/getgtsprocedurelistingweb`;
  }

  // Update GTS Status
  apiUpdateGTSStatus() {
    return `${this.dekraApi}gts/gtsupdateexitstatus`;
  }

  // remove attachment
  apiDeleteAttachmentInfo() {
    return `${this.dekraApi}gts/deleteattachmentinfo`;
  }

  // Get GTS Lists
  apiGetGTSSessions() {
    return `${this.dekraApi}gts/getgtssessions`;
  }

  // Get Recent Frame Selection
  apiGetGTSRecentFrameSelection() {
    return `${this.dekraApi}gts/getrecentframenoselection`;
  }

  apiUpdateGTSCheckAction() {
    return `${this.dekraApi}gts/gtsupdatecheckactions`;
  }

  apiGTSUpdateUserInputCheckActions() {
    return `${this.dekraApi}gts/gtsupdateuserinputcheckactions`;
  }

  // Get Vehicle Model Lists
  apiGetVehicleModelListsGTS() {
    return `${this.collabticApi}/vehicle/getmodelAPI`;
  }

  // Get GTS BaseInfo
  apiGetGtsBaseInfo() {
    return `${this.dekraApi}gts/getgtsattributesinfo`;
  }

  // Get Product Category & Types
  apiGetProdCatg() {
    return `${this.dekraApi}gts/getgtsprodcategoryandtype`;
  }

  // Get Sessions List
  apiGetSessionsList() {
    return `${this.dekraApi}gts/getgtssessions`;
  }

  // Get Sessions List
  apiGetSessionSummary() {
    return `${this.dekraApi}gts/getgtssessionsummary`;
  }

  // Get Module Manufacture
  apiGetModMft() {
    return `${this.dekraApi}gts/getgtsprodcategoryandtype`;
  }

  // Get DTC Info
  apiGetDtcInfo() {
    return `${this.dekraApi}gts/getdtcinfo`;
  }

  // GET DTC Attributes
  apiGetDtcAttributes() {
    return `${this.dekraApi}gts/getdtcattributesinfo`;
  }

  // GTS Procedure Creation and Update
  apiManageGts() {
    return `${this.dekraApi}gts/savegtsprocedure`;
  }

  // Delete DTS Procedure
  apiDeleteGts() {
    return `${this.dekraApi}gts/deletegtsprocedure`;
  }

  // Delete DTS Procedure
  apiRestoreGts() {
    return `${this.dekraApi}gts/restoregtsprocedure`;
  }

  // Add or Save Manufacturer
  apiManageMFG() {
    return `${this.dekraApi}gts/saveprodmfg`;
  }

  // Add or Save System
  apiManageSystem() {
    return `${this.dekraApi}gts/saveprodsystem`;
  }

  // Add or Save DTC Code
  apiManageDTC() {
    return `${this.dekraApi}gts/saveproddtc`;
  }

  // Check DTC Code Exists
  apiCheckDTC() {
    return `${this.dekraApi}gts/checkdtcavailablity`;
  }

  // Get GTS Procedure Attachment
  apiGetGTSProcedureAttachment() {
    return `${this.dekraApi}gts/getgtsprocedureattachment`;
  }

  // Add or Save Tag
  apiManageTagGTS() {
    return `${this.dekraApi}gts/saveprodtags`;
  }

  // Add or Save Product Category
  apiManageProblemCatg() {
    return `${this.dekraApi}gts/saveprodcategory`;
  }

  // Add or Save ECU Type
  apiManageECUType() {
    return `${this.dekraApi}gts/saveprodecutype`;
  }

  // Get Product Matrix Lists
  apiGetProductLists() {
    return `${this.productInfoApi}/getproductmatrix`;
  }

  // Check Model Exists
  apiCheckModelExists() {
    return `${this.productInfoApi}/checkmakemodelexist`;
  }

  // Check Model Exists
  apicheckModelAutoComplete() {
    return `${this.productInfoApi}/getproductmodellistautocomplete`;
  }

  // Add or Save Product Matrix
  apiManageProductMatrix() {
    return `${this.productInfoApi}/saveproductmatrix`;
  }

  apiUpdateProductMatrixByModel() {
    return `${this.productInfoApi}/updateProductMatrixByModel`;
  }
  apiSaveproductMatrixBYModel() {
    return `${this.productInfoApi}/SaveproductMatrixBYModel`;
  }

  apigetPMColumns() {
    return `${this.productInfoApi}/getPMColumns`;
  }

  apigetEscalationColumns() {
    return `${this.escalationV2Api}/getPMColumns`;
  }
  apiGetEmployeeEscalation() {
    return `${this.escalationV2Api}/GetEscalationDataMetrics`;
  }
  apiupdateEscalationData() {
    return `${this.escalationV2Api}/updateEscalationData`;
  }
  apiupdateEscalationDataV2() {
    return `${this.escalationV2Api}/updateEscalationDataV2`;
  }
  apiGetAllEscalationUsers() {
    return `${this.escalationV2Api}/getallEscalationUsers`;
  }
  apigetEscalationLookupTableData() {
    return `${this.collabticForumApi}/CommonAttributeValues`;
  }
  apigetEscalationConfigData() {
    return `${this.escalationV2Api}/EscalationConfig`;
  }
  apigetAlertEscalationConfigData() {
    return `${this.escalationV2Api}/EscalationreminderAlertConfig`;
  }

  // Escalations By Levels
  apiGetEscalationsByLevels() {
    return `${this.collabticForumApi}/GetEscalationsByLevels`;
  }

  apiGetGTSProcedures() {
    return `${this.dekraApi}gts/getgtsprocedures`;
  }
  apiGetUploadAttachments() {
    return `${this.dekraApi}gtsattachment/uploadattachments`;
  }

  apiGTSFrameDecode() {
    return `${this.dekraApi}gts/framedecode`;
  }

  apicheckHeaderExists() {
    return `${this.productInfoApi}/checkHeaderExists`;
  }

  apiupdatePlaceholderByHeader() {
    return `${this.productInfoApi}/updatePlaceholderByHeader`;
  }

  apiAddNewColumn() {
    return `${this.productInfoApi}/AddNewColumn`;
  }

  apigetLookupTableData() {
    return `${this.productInfoApi}/getLookupTableData`;
  }
  apiManageLookUpdata() {
    return `${this.productInfoApi}/SaveLoopUpdata`;
  }

  apigetPMColumnsValues() {
    return `${this.productInfoApi}/getPMColumnsValues`;
  }

  // Active or Deactive Product Matrix
  apiActionProductMatrix() {
    return `${this.productInfoApi}/UpdateModelmakeStatus`;
  }

  // Get Product Make Lists
  apiGetProductmakeList() {
    return `${this.productInfoApi}/getproductmakeList`;
  }

  // Get Product Type
  apiGetProductSubGroupList() {
    return `${this.productInfoApi}/GetProductTypeList`;
  }

  // Get Product Sub Group
  apiGetProductTypeList() {
    return `${this.productInfoApi}/productTypeListDoc`;
  }

  // Add or Save Make
  apiActionMake() {
    return `${this.productInfoApi}/Saveproductmake`;
  }

  // Show Category and Subcategory
  apigetproductCategandSubcat() {
    return `${this.productInfoApi}/getproductCategandSubcat`;
  }

  // Get Menu Lists
  apiGetMenuLists() {
    return `${this.collabticAccountsApi}/getHeaderandsideMenuAPIv2`;
  }

  // Get Dashboard Menu Lists
  apiGetDashMenuLists() {
    return `${this.collabticAccountsApi}/getHeaderandsideMenuAPI`;
  }

  // Delete Workstream
  apiDeleteWorkstream() {
    return `${this.collabticForumApi}/DeleteWorkstreamItems`;
  }

  apigetUserListDashboard() {
    if (this.platformInfo !== "1") {
      return `${this.collabticDashApi}/getuserlistAPI`;
    } else {
      return `${this.collabticDashApi}/getuserlist`;
    }
  }

  apigetDomainListDashboard() {
    return `${this.collabticDashApi}/DomainsExport`;
  }

  apiUpdateUserDashstatus() {
    if (this.platformInfo !== "1") {
      return `${this.collabticDashApi}/updateusersAPI`;
    } else {
      return `${this.collabticDashApi}/updateusers`;
    }
  }
  apiGetUserManagersList() {
    return `${this.collabticDashApi}/getmanagerlistV2`;
  }

  apiDeleteAccountUserInfo() {
    return `${this.collabticAccountsApi}/DeleteAccountUserInfo`;
  }

  apiUpdateUserpasswordbyAdmin() {
    return `${this.collabticAccountsApi}/adminChangepassword`;
  }

  apiupdateuserInfobyAdmin() {
    return `${this.collabticAccountsApi}/updateuserInfo`;
  }

  apiAddInviteUserbyAdmin() {
    return `${this.collabticAccountsApi}/bussinessInviteRegister`;
  }
  apiCheckemailstatus() {
    return `${this.collabticAccountsApi}/Checkemailstatus`;
  }
  apiLikePinKnowledgeArticleAction() {
    return `${this.knowledgeArticleApi}/AddLikePins`;
  }

  apiLikePinGtsAction() {
    return `${this.dekraApi}gts/addlikepins`;
  }
  /*** Parts API Start ***/
  // Get Parts List
  apiGetPartsList() {
    return `${this.partsApi}/GetPartsListingweb`;
  }

  // Get Part Attributes
  apiGetPartBaseInfo() {
    return `${this.partsApi}/GePartsAttributesInfo`;
  }

  // Get Parts Detail
  apiGetPartsDetail() {
    return `${this.partsApi}/GetPartsDetailsweb`;
  }

  // Check part no duplicate
  apiCheckPartNoIsExist() {
    return `${this.partsApi}/CheckPartNoIsExist`;
  }

  // Manage Parts Create or Edit
  apiManageParts() {
    return `${this.partsApi}/SaveParts`;
  }

  // Get Model List By Make
  apiGetModels() {
    return `${this.productmakeApi}/GetModelformakeAPI`;
  }

  apiGetuserExportAll() {
    return `${this.collabticDashApi}/getuserlistexcelupdated`;
  }

  apiGetuserExportThread() {
    return `${this.collabticForumApi}/GetallThreadExportHeaders`;
  }

  apiGetallThreadExportData() {
    return `${this.collabticForumApi}/GetallThreadExportData`;
  }

  apiSendPaymentDetail() {
    return `${this.collabticLocalhost}/v1/payment/add`;
  }

  apiSendManualPaymentDetail() {
    return `${this.collabticLocalhost}/v1/payment/addmanual`;
  }

  apiSendPaymentDetailByCheck() {
    return `${this.collabticLocalhost}/v1/payment/addbycheck`;
  }

  apiSendCartPaymentDetail() {
    return `${this.collabticLocalhost}/v1/market-place/cartpayment`;
  }

  apiSendCartOrderDetail() {
    return `${this.collabticLocalhost}/v1/market-place/cartorder`;
  }

  /*** Parts API End ***/

  // Get Tags List
  apiGetTagList() {
    return `${this.resourceApi}/gettagslists`;
  }

  // Add or Save Tag
  apiManageTag() {
    return `${this.partsApi}/SaveprodTags`;
  }
  // delete Tag
  deleteTag() {
    return `${this.resourceApi}/DeleteTagsInfo`;
  }

  // Get Related Thread Lists
  apiGetRelatedThreads() {
    return `${this.collabticForumApi}/ReleatedThreadsWeb`;
  }

  // Get Error Codes List
  apiGetErrorCodes() {
    return `${this.collabticForumApi}/ErrorCodes`;
  }

  // Manage Error Code
  apiManageErrorCode() {
    return `${this.partsApi}/saveErrorCode`;
  }

  // Manage Part Type
  apiManagePartType() {
    return `${this.partsApi}/savePartType`;
  }

  // Manage Part System
  apiManagePartSystem() {
    return `${this.partsApi}/SavepartSystem`;
  }

  // Manage Part Assembly
  apiManagePartAssembly() {
    return `${this.partsApi}/savepartAssembly`;
  }

  // Update Part Status
  apiUpdatePartStatus() {
    return `${this.partsApi}/UpdatePartStatus`;
  }

  // Get Filter Widgets
  apiGetFilterWidgets() {
    return `${this.collabticAccountsApi}/FilterWidgets`;
  }

  // Manage Filter Settings
  apiManageFilterSettings() {
    return `${this.collabticAccountsApi}/SaveFilterSettings`;
  }

  // Get Upload URL
  apiGetUploadURL() {
    return this.uploadApi;
  }

  // Get Recent Part View Lists
  apiRecentPartViews() {
    return `${this.partsApi}/GetPartRecentViews`;
  }

  // Like & Pin Actions
  apiLikePinAction() {
    return `${this.partsApi}/AddLikePins`;
  }

  // Delate Part
  apiDeletePart() {
    return `${this.partsApi}/DeletePartInfo`;
  }

  // Delate SIB
  apiDeleteSib() {
    return `${this.demoGtsMahale}/sib/DeleteSIBInfo`;
  }

  // Get Vimeo Video Thumb
  apiGetVimeoThumb(vid) {
    return `${this.vimeoApi}/${vid}.json`;
  }

  // Get Media Lists
  getFoldersandDocumentsApi() {
    return `${this.resourceApi}/GetfoldersandDocumentsv1`;
  }

  /* Media Manager API */

  // Get Media Lists
  apiGetMediaLists() {

    let url = this.dekraApi;
    return `${url}media/GetMediaList`;
    //return `${this.mediaApi}/GetMediaList`;
  }

  // Update Media Content
  apiUpdateMediaContent() {
    return `${this.mediaApi}/UpdateMediaByContentType`;
  }

  // Check Media Name
  apiCheckMediaName() {
    let url = this.dekraApi;
    return `${url}media/checkforduplicatesmedia`;
    //return `${this.mediaApi}/CheckforDuplicatesMedia`;
  }

  // Save Media
  apiSaveMedia() {
    return `${this.mediaApi}/saveMedia`;
  }

  // Get Media Upload URL
  apiGetMediaUploadURL() {
    // return `${this.mediaApi}/UpdateandUploadattachments`;
    if (this.platformInfo !== "1") {
      return `${this.collabticApi}/threadpost/AttachmentUpload`;
    } else {
      return `${this.collabticApi}/threadpost/AttachmentUploadV2`;
    }
  }
  // Get Media Upload file URL
  apiCheckUploadMedia() {
    // return `${this.mediaApi}/UpdateandUploadattachments`;
    // return `${this.collabticApi}/threadpost/AttachmentUpload`;
    if (this.platformInfo !== "1") {
      return `${this.collabticApi}/threadpost/AttachmentUpload`;
    } else {
      return `${this.collabticApi}/threadpost/AttachmentUploadV2`;
    }
  }

  // Delete Media Api
  apiDeleteMedia() {
    return `${this.mediaApi}/DeleteMediaInfo`;
  }

  // Get Site Logo
  apiGetSiteLogo() {
    return `${this.collabticForumApi}/getLinkInfo`;
  }

  // Get user notifications
  apiusernotifications() {
    return `${this.notificationApi}/DisplayNotificationmobile`;
  }

  // FCM save User Token for sending and receive push
  apiregisterdevicetoken() {
    return `${this.pushApi}/registerdevicetokenWeb`;
  }
  apiActiveDevicesOnPageWeb() {
    return `${this.pushApi}/ActiveDevicesOnPageWeb`;
  }

  // Reset user notifications
  apiresetusernotifications() {
    return `${this.notificationApi}/Notificationcountreset`;
  }

  // Read or Delete user notifications
  apiReadandDeleteNotification() {
    return `${this.notificationApi}/ReadandDeleteNotificationAPI`;
  }

  // Delete All user notifications
  apiDismissallnotifications() {
    return `${this.notificationApi}/dismissallnotificationsAPI`;
  }

  // Like & Pin Actions
  apiMediaLikePinAction() {
    return `${this.mediaApi}/AddLikePins`;
  }

  /* Escalations API */

  // Get Escalation API
  apiGetEscalationLists() {
    return `${this.collabticForumApi}/GetEscalationexcelData`;
  }

  apigetSystemActivity() {
    return `${this.collabticForumApi}/getSystemActivity`;
  }

  // Get Escalation PPFR API
  apiGetEscalationListsPPFR() {
    return `${this.collabticForumApi}/EscformListing`;
  }

  apiGetDashboardUpdate() {
    return `${this.collabticForumApi}/GetDashboardUpdate`;
  }

  // Save Escalation API
  apiSaveEscalation() {
    return `${this.collabticForumApi}/SaveEscalationMData`;
  }

  // Escalation Notification API
  apiEscalationNotify() {
    return `${this.collabticForumApi}/SendMEscalationNotifications`;
  }

  apigetWorksteamOrGroupChat() {
    return `${this.collabticForumApi}/Getworkstramschat`;
  }
  apigetWorksteamOrGroupChatV2() {
    return `${this.collabticForumApi}/GetworkstramschatAPI`;
  }

  apigetDomainUserList() {
    return `${this.collabticForumApi}/GetAlldomainUsersAPI`;
  }

  apiAddworkstreamChat() {
    const platformId = localStorage.getItem("platformId");
    if (platformId !== "1") {
      return `${this.collabticForumApi}/addworkstreamchatAPI`;
    } else {
      return `${this.collabticForumApi}/addworkstreamchat`;
    }
  }
  apiAddPostNotification() {
    return `${this.notificationApi}/pushnotificationGroupmessage`;
  }
  apiGetChatUploadURL() {
    const platformId = localStorage.getItem("platformId");
    if (platformId !== "1") {
      return `${this.threadPostApi2}ChatFileUploadAPI`;
    } else {
      return `${this.threadPostApi}/ChatFileUploadV2`;
      // return `${this.threadPostApi}/ChatFileUpload`;
    }
  }
  apiDeleteworkstreamChat() {
    const platformId = localStorage.getItem("platformId");
    if (platformId === "1") {
      return `${this.collabticForumApi}/Deleteworkstreamchat`;
    } else {
      return `${this.collabticForumApi}/DeleteworkstreamchatAPI`;
    }
  }
  /*** Authentication ***/
  // validate domain name
  apivalidateSubDomain() {
    return `${this.collabticAccountsApi}/ValidatesubdomainAPI`;
  }
  // validate email id / user name and password
  apiLogin(type = "") {
    const platformId = localStorage.getItem("platformId");
    if (platformId === PlatFormType.CbaForum) {
      return `${this.collabticAccountsApi}/loginApiV2`;
    } else {
      if (type === "1") {
        return `${this.networkApi}accounts/loginapi`;
      } else {
        return `${this.collabticAccountsApi}/loginApi`;
      }
    }
  }

  apicheckAccountInfo() {
    return `${this.collabticAccountsApi}/checkAccountInfo`;
  }
  // validate email id / user name and password
  apiSignup() {
    return `${this.collabticAccountsApi}/checkValidUser`;
  }
  // validate email id - password reset
  apiResetPassword() {
    return `${this.collabticAccountsApi}/ResetpasswordApp`;
  }
  // reset password
  apiChangePassword() {
    return `${this.collabticAccountsApi}/changepassword`;
  }
  apiNewBusinessSignup() {
    return `${this.collabticAccountsApi}/NewBusinessRegister`;
  }
  /*** Authentication ***/

  // Change password
  apiChangeUserPassword() {
    return `${this.collabticAccountsApi}/changepasswordApp`;
  }

  // All Folders
  apiSaveDocumentFolder() {
    return `${this.resourceApi}/SaveDocumentFolder`;
  }

  // Save Folders (Add and Update and Delete)
  apiGetDocumentFolder() {
    return `${this.resourceApi}/getFoldersforDocument`;
  }

  // Save Folders (Add and Update and Delete)
  apiSaveCategoryFolder() {
    return `${this.knowledgeArticleApi}/SaveCategoryFolder`;
  }

  // get manager list
  apiGetManagerList() {
    return `${this.collabticAccountsApi}/getmanagerList`;
  }

  // update manager
  apiUpdateManagerList() {
    return `${this.collabticAccountsApi}/updateuersignupinfo`;
  }

  // landing page reports
  apiLandingreports() {
    return `${this.collabticAccountsApi}/getReportsAttr`;
  }

  // reset verification email
  apiResetVerificationEmail() {
    return `${this.collabticAccountsApi}/resendEmail`;
  }

  // user checked verification email
  apiVerifiedEmail() {
    return `${this.collabticAccountsApi}/EmailVerificationStatus`;
  }

  // get language list
  apiGetLangUageList() {
    return `${this.resourceApi}/getLangUageList`;
  }

  // set language list
  apiSaveUserLanguageOption() {
    return `${this.collabticAccountsApi}/SaveUserLanguageOption`;
  }

  // profile upload
  apifileUpload() {
    const dekradomain = localStorage.getItem("dekradomain");
    return `${this.collabticAccountsApi}/profilephoto`;
  }

  // Remove Logo
  apiRemoveLogo() {
    return `${this.collabticAccountsApi}/removeLogo`;
  }

  // user checked verification email
  apiGetPolicyContent() {
    return `${this.collabticAccountsApi}/TVSIBPrivacyPolicy`;
  }

  /*** Authentication ***/

  /*** Profile */

  apiGetUserProfile() {
    return `${this.collabticAccountsApi}/GetUserprofile`;
  }
  apiUpdateUserProfile() {
    return `${this.collabticAccountsApi}/UpdateprofileUserV2`;
  }
  apiUpdateStagename() {
    return `${this.collabticAccountsApi}/UpdateStagename`;
  }
  apiGetProfileMetrics() {
    return `${this.collabticForumApi}/ProfileMetrics`;
  }
  apiGetCertificationList() {
    return `${this.collabticAccountsApi}/certificationlistAPI`;
  }
  apiSelectUserCertificationList() {
    return `${this.collabticAccountsApi}/selectusercertificationsAPI`;
  }
  apiSaveUserCertificationList() {
    return `${this.collabticAccountsApi}/SaveusercertificationsAPI`;
  }
  apiGetuserFollowerFollowing() {
    return `${this.collabticAccountsApi}/GetuserFollowerFollowing`;
  }
  apiUserFollowMethod() {
    return `${this.collabticForumApi}/UserFollowMethod`;
  }
  /*** Profile ***/

  /** Manage Thread API */

  // Thread Field API
  apiGetThreadFields(version = 1) {
    switch (version) {
      case 1:
        return `${this.collabticAccountsApi}/accountConfigUpdatedV3`;
        break;
      case 2:
        return `${this.collabticV3Api}/account-config/dynamic-fields`;
        break;
    }
  }

  // Opportunity Field API
  apiGetOpportunityFields() {
    return `${this.collabticV3Api}/accounts/contentcreation`;
  }

  apiGetMarketPlaceFields() {
    return `${this.collabticLocalhost}/v1/market-place`;
  }

  apiGetAllManuals() {
    return `${this.collabticLocalhost}/v1/market-place/manualslistall`;
  }

  apiGetAllManualsTitle() {
    return `${this.collabticLocalhost}/v1/market-place/manualstitlelistall`;
  }

  apiGetAllTrainingsTitle() {
    return `${this.collabticLocalhost}/v1/market-place/trainingstitlelistall`;
  }

  apiGetAllReports() {
    return `${this.collabticLocalhost}/v1/market-place/getmarkettransactionsreport`;
  }

  apiGetManualFields() {
    return `${this.collabticLocalhost}/v1/market-place/manualconfig`;
  }

  apiGetSalesUserData() {
    return `${this.collabticLocalhost}/v1/market-place/getsalesperson`;
  }

  apiGetmanualSalesUserData() {
    return `${this.collabticLocalhost}/v1/market-place/getmanualsalesperson`;
  }

  apiGetParticipantsData() {
    return `${this.collabticLocalhost}/v1/market-place/zoomparticipantlist`;
  }

  apiUpdateSalesPersonApi() {
    return `${this.collabticLocalhost}/v1/market-place/updatesalepersonuser`;
  }

  apiUpdateComment() {
    return `${this.collabticLocalhost}/v1/market-place/updatecomment`;
  }

  apiUpdateManualComment() {
    return `${this.collabticLocalhost}/v1/market-place/updatemanualcomment`;
  }

  apiUpdateManualSalesPersonApi() {
    return `${this.collabticLocalhost}/v1/market-place/updatesalepersonmanual`;
  }

  apiGetKeywordsList() {
    return `${this.collabticLocalhost}/v1/market-place/keywordlist`;
  }

  apiAddKeywordsList() {
    return `${this.collabticLocalhost}/v1/market-place/keywordadd`;
  }

  apiUpdateKeywordsList() {
    return `${this.collabticLocalhost}/v1/market-place/keywordupdate`;
  }

  apiDeleteKeywordsList() {
    return `${this.collabticLocalhost}/v1/market-place/keyworddelete`;
  }

  apiUpdateMarketPlaceReminderFields() {
    return `${this.collabticLocalhost}/v1/market-place/trainingsetting`;
  }

  apiGetMarketPlaceEditData() {
    return `${this.collabticLocalhost}/v1/market-place/edit`;
  }

  apiGetManualEditData() {
    return `${this.collabticLocalhost}/v1/market-place/editmanual`;
  }

  apiGetMarketPlaceReminderData() {
    return `${this.collabticLocalhost}/v1/market-place/fetchtrainingsetting`;
  }

  apiGetMarketPlaceRegisterUserData() {
    return `${this.collabticLocalhost}/v1/market-place/userslist`;
  }

  apiGetMarketPlaceManualUserData() {
    return `${this.collabticLocalhost}/v1/market-place/manualuserslist`;
  }

  apiGetMarketPlaceEditDomainData() {
    return `${this.collabticLocalhost}/v1/market-place/domainedit`;
  }

  apiGetMarketPlacePoliciesData() {
    return `${this.collabticLocalhost}/v1/market-place/policies`;
  }

  apiGetMarketPlacePolicyData() {
    return `${this.collabticLocalhost}/v1/market-place/policydata`;
  }

  apiGetMarketPlacePoliciesDataByType() {
    return `${this.collabticLocalhost}/v1/market-place/getdatapolicy`;
  }

  apiUpdateMarketPlacePolicyData() {
    return `${this.collabticLocalhost}/v1/market-place/policyupdate`;
  }

  apiDeleteMarketPlacePolicy() {
    return `${this.collabticLocalhost}/v1/market-place/policydelete`;
  }

  apiGetMarketPlaceEditDomainBannerData() {
    return `${this.collabticLocalhost}/v1/market-place/domainbanner`;
  }

  apiGetMarketPlacePolicyHistory() {
    return `${this.collabticLocalhost}/v1/market-place/policyhistory`;
  }

  apiGetQuizEditData() {
    return `${this.collabticLocalhost}/v1/quiz/quizedit`;
  }

  apiGetTopicEditData() {
    return `${this.collabticLocalhost}/v1/quiz/edittopic`;
  }

  apiGetMarketPlaceData() {
    return `${this.collabticLocalhost}/v1/market-place/list`;
  }

  apiGetManualData() {
    return `${this.collabticLocalhost}/v1/market-place/manualslist`;
  }

  apiRepairfyDomainData() {
    return `${this.collabticLocalhost}/v1/market-place/repairfydata`;
  }

  apiGetMarketPlaceDataWithDomainName() {
    return `${this.collabticLocalhost}/v1/market-place/listdomainwithname`;
  }

  apiGetManualDataWithDomainName() {
    return `${this.collabticLocalhost}/v1/market-place/listmanualwithname`;
  }

  apiGetDomainMarketPlaceData() {
    return `${this.collabticLocalhost}/v1/market-place/listdomain`;
  }

  apiGetQuizData() {
    return `${this.collabticLocalhost}/v1/quiz/quizlist`;
  }

  apiGetAllCustomerData() {
    return `${this.collabticLocalhost}/v1/market-place/customerlist`;
  }

  apiGetAllCustomerUsers() {
    return `${this.collabticLocalhost}/v1/market-place/customerusers`;
  }

  apiGetBusinessData() {
    return `${this.collabticLocalhost}/v1/market-place/filtercustomer`;
  }

  apiGetQuizDataWithDomainName() {
    return `${this.collabticLocalhost}/v1/quiz/quizlistdomainwithname`;
  }

  apiGetDomainQuizData() {
    return `${this.collabticLocalhost}/v1/quiz/quizdomainlist`;
  }

  apiGetDomainsData() {
    return `${this.collabticLocalhost}/v1/market-place/domains`;
  }

  apiCreateMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/add`;
  }

  apiCreateMarketPlaceManual() {
    return `${this.collabticLocalhost}/v1/market-place/addmanual`;
  }

  apiForUserEmail() {
    return `${this.collabticLocalhost}/v1/market-place/useremailcheck`;
  }

  apiForManualUserEmail() {
    return `${this.collabticLocalhost}/v1/market-place/manualuseremailcheck`;
  }

  apiCreateQuizTopic() {
    return `${this.collabticLocalhost}/v1/quiz/addtopic`;
  }

  apiUpdateQuizTopic() {
    return `${this.collabticLocalhost}/v1/quiz/updatetopic`;
  }

  apiForZoomSettingUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/zoomsettingupdate`;
  }

  apiForInformedUsersUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/informedusersupdate`;
  }

  apiForNotificationSettingUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/notificationsettingupdate`;
  }

  apiForZoomConfigurationUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/zoomconfigurationupdate`;
  }

  apiForLoadZoomSetting() {
    return `${this.collabticLocalhost}/v1/market-place/zoomsettingget`;
  }

  apiForLoadInformedUsers() {
    return `${this.collabticLocalhost}/v1/market-place/informedusers`;
  }

  apiForLoadPaymentSetting() {
    return `${this.collabticLocalhost}/v1/payment/paymentsettingget`;
  }

  apiForLoadEmailSetting() {
    return `${this.collabticLocalhost}/v1/market-place/emailsettings`;
  }

  apiForLoadShippingCost() {
    return `${this.collabticLocalhost}/v1/market-place/shippingcost`;
  }

  apiForUpdateEmailSetting() {
    return `${this.collabticLocalhost}/v1/market-place/emailsettingsupdate`;
  }

  apiDuplicateQuizTopic() {
    return `${this.collabticLocalhost}/v1/quiz/duplicatetopic`;
  }

  apiDeleteQuizTopic() {
    return `${this.collabticLocalhost}/v1/quiz/deletetopic`;
  }

  apiCreateQuiz() {
    return `${this.collabticLocalhost}/v1/quiz/quizadd`;
  }

  apiUpdateQuiz() {
    return `${this.collabticLocalhost}/v1/quiz/quizupdate`;
  }

  apiGetQuizTopic() {
    return `${this.collabticLocalhost}/v1/quiz/listtopic`;
  }

  apiGetQuizTopicWithRecords() {
    return `${this.collabticLocalhost}/v1/quiz/topiclistdata`;
  }

  apiManualTax() {
    return `${this.collabticLocalhost}/v1/market-place/manualtax`;
  }

  apiForGetCart() {
    return `${this.collabticLocalhost}/v1/cart/cartdetails`;
  }

  updateCartItems() {
    return `${this.collabticLocalhost}/v1/cart/updatecartitems`;
  }

  updateCartItemsWithDetails() {
    return `${this.collabticLocalhost}/v1/cart/updatecartitemswithdetails`;
  }

  emptyCart() {
    return `${this.collabticLocalhost}/v1/cart/clearcart`;
  }

  updateCartForm() {
    return `${this.collabticLocalhost}/v1/cart/updatecartforms`;
  }

  updateBusinessNew() {
    return `${this.collabticLocalhost}/v1/market-place/createcustomer`;
  }

  apiForCustomerAdd() {
    return `${this.collabticLocalhost}/v1/market-place/customeradd`;
  }

  apiForCompanyAdd() {
    return `${this.collabticLocalhost}/v1/market-place/companyadd`;
  }

  apiForCompanyAddData() {
    return `${this.collabticLocalhost}/v1/market-place/companyadddata`;
  }

  apiForCompanyAddressAddData() {
    return `${this.collabticLocalhost}/v1/market-place/companyaddressadddata`;
  }

  apiForCustomerFileUpload() {
    return `${this.collabticLocalhost}/v1/market-place/customerfileupload`;
  }

  apiForCustomerUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/customerupdate`;
  }

  apiForCustomerDelete() {
    return `${this.collabticLocalhost}/v1/market-place/customerdelete`;
  }

  apiForRefundPayment() {
    return `${this.collabticLocalhost}/v1/payment/paymentrefund`;
  }

  apiForRefundManualPayment() {
    return `${this.collabticLocalhost}/v1/payment/manualpaymentrefund`;
  }

  apiForPartialRefundPayment() {
    return `${this.collabticLocalhost}/v1/payment/transactionrefund`;
  }

  apiForRefundHistory() {
    return `${this.collabticLocalhost}/v1/payment/refundhistory`;
  }

  apiUpdateDomainMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/domainupdate`;
  }

  apiUpdateDomainBannerMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/domainbannerupdate`;
  }

  apiUpdateRepairfyDomainMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/repairfydomainupdate`;
  }

  // Thread Creation API
  apiDeleteMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/delete`;
  }

  apiDeleteMarketPlacePermanent() {
    return `${this.collabticLocalhost}/v1/market-place/permanentdelete`;
  }

  apiDeleteManualPermanent() {
    return `${this.collabticLocalhost}/v1/market-place/permanentdeletemanual`;
  }

  apiRestoreMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/restore`;
  }

  apiDeleteManual() {
    return `${this.collabticLocalhost}/v1/market-place/deletemanual`;
  }

  apiRestoreManual() {
    return `${this.collabticLocalhost}/v1/market-place/restoremanual`;
  }

  apiSetIsNewFalse() {
    return `${this.collabticLocalhost}/v1/market-place/viewuser`;
  }

  apiSetIsNewFalseManual() {
    return `${this.collabticLocalhost}/v1/market-place/viewmanual`;
  }

  apiDeleteQuiz() {
    return `${this.collabticLocalhost}/v1/quiz/quizdelete`;
  }

  apiUpdateMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/update`;
  }

  apiUpdateManual() {
    return `${this.collabticLocalhost}/v1/market-place/updatemanual`;
  }

  apiCreateUserMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/useradd`;
  }

  apiCreateUserManualBooking() {
    return `${this.collabticLocalhost}/v1/market-place/useraddmanual`;
  }

  apiPurchaseSeatsMarketPlace() {
    return `${this.collabticLocalhost}/v1/market-place/purchaseseat`;
  }

  apiUserInfoUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/userinfoupdate`;
  }

  apiManualUserInfoUpdate() {
    return `${this.collabticLocalhost}/v1/market-place/manualuserinfoupdate`;
  }

  apiGetMasterData() {
    return `${this.collabticLocalhost}/v1/market-place/dropdownlistdata`;
  }

  apiGetStateData() {
    return `${this.collabticLocalhost}/v1/market-place/statelistdatabycountry`;
  }

  // Thread Creation API
  apiCreateThread() {
    return `${this.collabticForumApi}/createThreadV2`;
  }

  // Thread Update API
  apiUpdateThread() {
    return `${this.collabticForumApi}/updateThreadV2`;
  }

  // Thread Push Api
  apiThreadPush() {
    return `${this.pushApi}/SendbulkPushFromApp`;
  }

  // Document Notification Api
  apiDocumentNotification() {
    return `${this.resourceApi}/sendingdocumentnotification`;
  }

  // Document Approval Notification Api
  apiDocumentApprovalNotification() {
    return `${this.pushApi}/pushMessageStatusChange`;
  }

  // Announcement Push Api
  apiAnnouncementPush() {
    return `${this.pushApi}/SendbulkPushAnnouncement`;
  }

  // Document/Announcement Update API
  apiUpdateTechInfo() {
    return `${this.resourceApi}/UpdateManualsandannouncement`;
  }

  apiGetGroupAndDirectMessagewithCount() {
    return `${this.collabticForumApi}/GetChatListing`;
  }

  /*** Thread-Post ***/

  // get thread detail
  apiGetthreadDetailsios() {
    return `${this.collabticForumApi}/GetthreadDetailsios`;
  }

  apiAtomicUpdateSolr() {
    return `${this.collabticForumApi}/AtomicUpdateSolr`;
  }

  // get post list
  apiPostList() {
    return `${this.collabticForumApi}/PostListAPI`;
  }

  // new post
  apiReplyPost() {
    return `${this.collabticForumApi}/ReplyPostApi`;
  }

  // Save TechSupport Presets
  apiSaveTechSupportPresets() {
    return `${this.collabticForumApi}/SaveTechSupportPresets`;
  }

  // Preset List
  apiPresetList() {
    return `${this.collabticForumApi}/PresetList`;
  }

  // new post
  apiUpdatePost() {
    return `${this.collabticForumApi}/updatePostAPI`;
  }

  // close thread
  apiCloseThread() {
    return `${this.collabticForumApi}/CloseThreadAPI`;
  }

  apiValidateCloseThread() {
    return `${this.collabticForumApi}/ValidateCloseThread`;
  }

  apigetAllTagUsersList() {
    return `${this.collabticDashApi}/getAllTagUsersList`;
  }

  apiupdateTagUsersList() {
    return `${this.collabticForumApi}/SaveTaggedUsers`;
  }

  // re-open thread
  apiReopenThread() {
    return `${this.collabticForumApi}/updateclosethreads`;
  }

  // delete thread/post
  apiDeleteThreadPost() {
    return `${this.collabticApi}/threadpost/threadpostupdatedeletestatus`;
  }

  // delete thread/post
  apiSolutionStatusAPI() {
    return `${this.collabticForumApi}/SolutionStatusAPI`;
  }

  // Thread AddLike, Pin and OnePlus
  apiAddLikePinOnePlus() {
    return `${this.collabticForumApi}/AddLikePins`;
  }

  // Send Reminder (MOBILE PUSH)
  apiSendPushtoMobile() {
    return `${this.notificationApi}/sendPushtoMobile`;
  }

  // Add Reminder
  apiAddReminder() {
    return `${this.collabticForumApi}/SendRemindertoUsers`;
  }

  // Send Reminder (MOBILE PUSH)
  apiSendReminder() {
    return `${this.pushApi}/SendRemindertBulkPush`;
  }

  // Thread and post dashboard users
  apiDashboardUsersList() {
    const platformId = localStorage.getItem("platformId");
    if (platformId === PlatFormType.Collabtic) {
      return `${this.collabticForumApi}/dashboardusers`;
    } else {
      return `${this.collabticForumApi}/dashboardusersAPI`;
    }
  }

  /*** SaveAssigneeRoles ***/
  apiSaveAssigneeRoles() {
    return `${this.collabticForumApi}/SaveAssigneeRoles`;
  }

  /*** Thread-Post ***/
  apiAddMementToGroup() {
    return `${this.collabticForumApi}/AddMemberstochat`;
  }

  // Thread Creation API
  apiCreateDoc() {
    return `${this.resourceApi}/CreateManualsandAnnouncement`;
  }

  // Manage Adas Procedure
  apiManageAdas() {
    return `${this.collabticV3Api}/adas/manage`;
  }

  /*** Announcement ***/

  // get announcment detail
  apiGetAnnouncementDetail() {
    return `${this.resourceApi}/GetManualDetails`;
  }
  apigetUploadMediaStatus() {
    if (this.platformInfo !== "1") {
      return `${this.collabticForumApi}/getawsvideojobstatus`;
    } else {
      return `${this.collabticForumApi}/getawsvideojobstatusV2`;
    }
  }

  // announcment AddLike
  apiResourceAddLike() {
    return `${this.resourceApi}/AddLikePins`;
  }

  // announcment AddLike
  apiMigrateDoctoKA() {
    return `${this.resourceApi}/migrateDoctoKA`;
  }

  // announcement dashboard
  apiLoadAnnounceDashboard() {
    return `${this.collabticForumApi}/LoadAnnounceDashboard`;
  }

  // announcement dashboard
  apiDismissManuals() {
    return `${this.resourceApi}/DismissManuals`;
  }

  // announcement archive
  apiArchiveAnnouncements() {
    return `${this.resourceApi}/archiveAnnouncement`;
  }

  // announcement archive
  apiUpdateUserScrollPopup() {
    return `${this.collabticAccountsApi}/UpdateUserScrollPopup`;
  }

  // Get Product/Vehicle Banner Image
  apiGetBanner() {
    return `${this.productmakeApi}/getBannerImage`;
  }

  // update helpcontent
  apitooltipconfigWeb(): string {
    return `${this.collabticAccountsApi}/tooltipconfigWeb`;
  }

  // Get SIB Lists
  apiGetSibLists() {
    return `${this.demoGtsMahale}/sib/SIBListing`;
  }

  // Create SIB
  apiCreateSIB() {
    return `${this.demoGtsMahale}/sib/saveSIB`;
  }

  // GEt SIB Details
  apiGetSibDetail() {
    return `${this.demoGtsMahale}/sib/SIBDetailsAPI`;
  }

  // Like & Pin Actions
  apiSibLikePinAction() {
    return `${this.demoGtsMahale}/sib/AddLikePins`;
  }

  // Delate document
  apiDeleteDocument() {
    return `${this.resourceApi}/DeleteDocumentInfo`;
  }

  // Save PPFR Form API
  apiSavePPFRFormData() {
    return `${this.collabticForumApi}/EscFeedbackFormAction`;
  }

  // PPFR Form detail API
  apiGetEscalateThreadDetails() {
    return `${this.collabticForumApi}/FindEscFeedbackFormDetails`;
  }

  // dealer area and dealer code
  apiUsagemetricsfiltercontent() {
    return `${this.collabticForumApi}/Usagemetricsfiltercontent`;
  }

  // Get Video Job Status
  apiVideoJobStatus() {
    return `${this.jobStatusApi}`;
  }

  // dealer area and dealer code
  apiManageTokBoxsession() {
    return `${this.collabticForumApi}/ManageTokBoxsession`;
  }
  /*** KnowledgeBase API Start ***/
  // Get KnowledgeBase List
  apiGetKnowledgeBaseList() {
    return `${this.knowledgeBaseApi}/KnowledgeBaseList`;
  }

  // Knowledge Base Creation API
  apiCreateKB() {
    return `${this.knowledgeBaseApi}/SaveKnowledgeBase`;
  }

  // Knowledge Base Creation API
  apiViewKB() {
    return `${this.collabticForumApi}/ViewContentDetails`;
  }

  // Delate KB
  apiDeleteKB() {
    return `${this.knowledgeBaseApi}/DeleteKBInfo`;
  }

  // Social Actions KB
  apiSocialActionKB() {
    return `${this.knowledgeBaseApi}/AddLikePins`;
  }
  //
  apiTVSSSOLogin() {
    return `${this.collabticAccountsApi}/TVSLoginSSO`;
  }

  //
  apiTVSSSODealerLogin() {
    return `${this.collabticAccountsApi}/TVSDealerSSO`;
  }

  // Get dealer Info
  apiTVSSSOGetEmployeeInfo() {
    return `${this.collabticAccountsApi}/GetDealerEmployeeInfo`;
  }

  // Get dealer Info
  apiTVSSSOGetDealerInfo() {
    return `${this.collabticAccountsApi}/GetDealerInfo`;
  }

  apiLeaderBoard() {
    return `${this.collabticForumApi}/getleaderboardV2`;
  }

  apiTechSupportChart() {
    return `${this.collabticForumApi}/ViewDashboardByThreadCategory`;
  }

  getMfgMakeChart() {
    return `${this.collabticDashApi}/GetMfgMakeChart`;
  }

  apiUserActivities() {
    return `${this.collabticForumApi}/Usagemetrics`;
  }

  // Get DTC Lists
  apiDtcList() {
    return `${this.collabticForumApi}/DtcTypeLists`;
  }

  // GET DTC Create URL
  apiGetCreateDTC() {
    return `${this.collabticForumApi}/CreateErrorCode`;
  }

  // GET DTC Create URL
  apiEscalationDealerImport() {
    return `${this.collabticAccountsApi}/EscalationDealerImport`;
  }

  apiEscalationDealerImportValidate() {
    return `${this.collabticAccountsApi}/EscalationDealerImportV2`;
  }

  apiEscalationDealerImportValidateV3() {
    return `${this.collabticAccountsApi}/EscalationDealerImportV3`;
  }

  //
  apiNewBusinessSetup() {
    return `${this.collabticAccountsApi}/NewBusinessSetup`;
  }
  //
  apiSaveBusinessOptions() {
    return `${this.collabticAccountsApi}/SaveBusinessOptions`;
  }
  //
  apiBusinessInviteNewMembers() {
    return `${this.collabticAccountsApi}/BusinessInviteNewMembers`;
  }
  //
  apiDecodeEmailaddress() {
    return `${this.collabticAccountsApi}/DecodeEmailaddress`;
  }
  //
  apiUpdateConfigSettings() {
    return `${this.collabticForumApi}/UpdateChatConfigSettings`;
  }

  // get user
  apiGetworkstramsusersparticipants() {
    return `${this.collabticForumApi}/GetworkstramsusersparticipantsAPI`;
  }

  // get user
  apiGetContentTypeList() {
    return `${this.collabticForumApi}/GetContentTypeList`;
  }

  // apiGetloginactivity
  apiGetloginactivity() {
    return `${this.collabticAccountsApi}/loginactivity`;
  }

  apiServiceList() {
    return `${this.collabticV3Api}/services/list`;
  }

  apiBoardSettings() {
    return `${this.collabticV3Api}/board-settings/list`;
  }

  apiDispatchSettings() {
    return `${this.collabticV3Api}/dispatch-settings/list`;
  }

  apiShopList() {
    return `${this.collabticV3Api}/shop`;
  }

  apiStatusList() {
    return `${this.collabticV3Api}/services/schedule-status-list`;
  }

  apiManageService() {
    return `${this.collabticV3Api}/services/manage`;
  }

  apiManageServiceCatg() {
    return `${this.collabticV3Api}/service-type/manage`;
  }

  apiServiceContactList() {
    return `${this.collabticV3Api}/service-contact`;
  }

  apiManageServiceContact() {
    return `${this.collabticV3Api}/service-contact/manage`;
  }

  apiManageServiceShop() {
    return `${this.collabticV3Api}/shop/manage`;
  }

  apiCheckDuplicate() {
    return `${this.collabticV3Api}/services/check-duplicate`;
  }

  apiServiceCategory() {
    return `${this.collabticV3Api}/service-type`;
  }

  apiVehiclebyVIN() {
    return `${this.productmakeApi}/VehicleInfobyVIN`;
  }

  apiModels() {
    return `${this.modalapi}/getproductmatrixModelsbyMake`;
  }

  apiStandardReportLists() {
    return `${this.collabticV3Api}/repairify/list`;
  }

  apiManageReport() {
    return `${this.collabticV3Api}/repairify/manage`;
  }

  apiGetMfgList() {
    return `${this.productInfoApi}/getManufacturerList`;
  }
  // Roles and Permissions
  apiRolesAndPermissions() {
    return `${this.collabticDashApi}/accesslevelByRole`;
  }

  // Update Roles and Permissions
  updateApiRolesAndPermissions() {
    return `${this.collabticDashApi}/UpdateaccesslevelByRole`;
  }

  // Reapirify Import
  apiRepairifyImport() {
    return `${this.collabticV3Api}/repairify/upload`;
  }

  // CBT V3 API Push
  apiV3SendPush() {
    return `${this.collabticV3Api}/services/sendpushdispatch`;
    // return `${this.collabticV3Api}/services/send-push-message`;
  }

  // save team
  apiSaveTechSupportTeams() {
    return `${this.collabticForumApi}/SaveTechSupportTeams`;
  }

  // check team
  apiCheckSupportTeamName() {
    return `${this.collabticForumApi}/CheckSupportTeamName`;
  }

  // assign
  apiUpdateThreadTechSupport() {
    return `${this.collabticForumApi}/UpdateThreadTechSupport`;
  }

  // assign
  apiTechSupportMenus() {
    return `${this.collabticForumApi}/TechSupportMenus`;
  }

  apiTechSupportPriorityDataList() {
    return `${this.collabticForumApi}/TechSupportPriorityDataList`;
  }

  apiupdateTechSupportPriorityData() {
    return `${this.collabticForumApi}/updateTechSupportPriorityData`;
  }

  // status change
  apiDocApprovalStatusChange(): string {
    return `${this.resourceApi}/StatusChangeUpdate`;
  }

  apiSharedFixApprovalStatusChange() {
    return `${this.collabticForumApi}/statusChangeUpdate`;
  }

  // status change
  apiKaizenApprovalStatusChange(): string {
    return `${this.kaizenApi}/StatusChangeUpdate`;
  }

  // save
  apiKaizenUpdateApi() {
    return `${this.kaizenApi}/save`;
  }
  // list
  apiKaizenListDetail() {
    return `${this.kaizenApi}/list`;
  }
  // status list
  apiKaizenGetUserStatusList() {
    return `${this.kaizenApi}/getUserStatusList`;
  }
  // Get Opportunity Lists
  apiOpportunityList() {
    return `${this.collabticV3Api}/opportunity/list`;
  }

  // Manage Opportunity API (Create/Edit)
  apiManageOpportunity() {
    return `${this.collabticV3Api}/opportunity/manage`;
  }

  // escalation
  apiManualEscalationAction() {
    return `${this.escalationV2Api}/ManualEscalationAction`;
  }

  // Update Mfg Name Api
  apiUpdateMfgName() {
    return `${this.resourceApi}/UpdateMfgNameUpdate`;
  }

  // Get Recall Data
  apiRecallData() {
    return `${this.collabticV3Api}/repairify/recall`;
  }

  // Manage Part System
  apiGetKeyWordPriority() {
    return `${this.collabticForumApi}/getKeyWordPriority`;
  }
  // Create Bug or Feature
  apiCreatebugfeature() {
    return `${this.supportApi}/Createbugfeature`;
  }

  // List out the bug or feature
  apiBugsFeatureList() {
    return `${this.supportApi}/BugsFeatureList`;
  }

  // Reply post api
  apibugfeatureReplypost() {
    return `${this.supportApi}/ReplyPostApi`;
  }

  // Postlist
  apibugfeaturepostapicall() {
    return `${this.supportApi}/PostListAPI`;
  }

  // updatePost
  apibugfeatureupdatepost() {
    return `${this.supportApi}/updatePostAPI`;
  }

  // system setting
  apiGetSystemSettings() {
    return `${this.collabticApi}/accounts/getSystemSettings`;
  }

  apiUpdateSystemSettings() {
    return `${this.collabticApi}/accounts/UpdateSystemSettings`;
  }

  apiGetSystemSettingsMenus() {
    return `${this.collabticApi}/accounts/getSystemSettingsMenus`;
  }

  apiGetRolesMappingList() {
    return `${this.collabticApi}/accounts/getRolesMappingList`;
  }

  apiGetAccountypeandBussRoles() {
    return `${this.collabticApi}/accounts/AccountypeandBussRoles`;
  }

  apiUpdateBussRoleSettings() {
    return `${this.collabticApi}/accounts/UpdateBussRoleSettings`;
  }

  apiUpdateDefaultTeam() {
    return `${this.collabticApi}/accounts/UpdateDefaultTeam`;
  }

  apiGetShippingcost(domainId) {
    return `${this.collabticApi}/getshippingcost?domainId=${domainId}`;
  }

  apiUpdateShippingcost() {
    return `${this.collabticApi}/shippingcostupdate`;
  }
  // User Settings Menu API
  apiGetUserSettingsMenu() {
    return `${this.collabticV3Api}/accounts/get-user-settings`;
  }
  // User Settings Menu API - V2
  apiGetUserTypeContentTypeLists() {
    return `${this.collabticForumApi}/GetUserTypeContentTypeList`;
  }

  // Notification list
  apiGetConfigNotificationLists() {
    return `${this.collabticV3Api}/notification-config/list`;
  }

  // Notification list
  apiGetEscConfigLists() {
    return `${this.escalationV2Api}/getEscConfig`;
  }

  // Notification list
  apiUpdateEscConfigLists() {
    return `${this.escalationV2Api}/UpdateEscConfig`;
  }

  // Notification Update
  apiUpdateConfigNotification() {
    return `${this.collabticV3Api}/notification-config/update-user-config`;
  }

  // Dispatch Notification Config API
  apiDispatchNotificationConfig() {
    return `${this.collabticV3Api}/notification-config`;
  }

  // Dispatch Notification Update API
  apiDispatchNotificationUpdate() {
    return `${this.collabticV3Api}/notification-config/update`;
  }

  // get domain API
  apiGetAllowedDomains() {
    return `${this.collabticAccountsApi}/getAllowedDomains`;
  }

  // get domain API
  apiUpdateAllowedDomains() {
    return `${this.collabticAccountsApi}/UpdateAllowedDomains`;
  }

  // Make Notification Config API
  apiGetSettingsMakeFilterConfig() {
    return `${this.searchApi}/getSettingsMakeFilter`;
  }

  // Make update Notification Config API
  apiUpdateMakeSettingsFilterV2() {
    return `${this.searchApi}/UpdateMakeSettingsFilterV2`;
  }

  apiGetMarketPlaceShippingCost(domainId) {
    return `${this.collabticLocalhost}/v1/market-place/getshippingcost?domainId=${domainId}`;
  }

  apiGetMarketPlaceEmailNoticationsSettings(domainId) {
    return `${this.collabticLocalhost}/v1/market-place/getemailnotificationsettings?domainId=${domainId}`;
  }

  apiGetMarketPlaceEmailNoticationsSetting(domainId, type) {
    return `${this.collabticLocalhost}/v1/market-place/getemailnotificationsetting?domainId=${domainId}&type=${type}`;
  }

  apiUpdateMarketPlaceEmailNoticationsSettings() {
    return `${this.collabticLocalhost}/v1/market-place/emailnotificationsettingupdate`;
  }

  apiUpdateTextMessageTooltip() {
    return `${this.collabticLocalhost}/v1/market-place/textmessagetooltipupdate`;
  }

  apiUpdateMarketPlaceShippingCost() {
    return `${this.collabticLocalhost}/v1/market-place/shippingcostupdate`;
  }

  // store API
  apiGetStoreInfoList() {
    return `${this.collabticForumApi}/GetStoreInfoList`;
  }

  // import API
  apiImportStoreList() {
    return `${this.collabticForumApi}/ImportStoreList`;
  }

  // Audit List API
  apiGetAuditList() {
    return `${this.collabticV3Api}/audit/list`;
  }

  // FAQ List API
  apiGetFaqList() {
    return `${this.collabticV3Api}/faq/list`;
  }

  // Manage FAQ API
  apiManageFaq() {
    return `${this.collabticV3Api}/faq/manage`;
  }

  // Get Feedback Fields API
  apiGetFeedbackFields() {
    return `${this.collabticV3Api}/feedback/fields`;
  }

  // Manage FAQ API
  apiManageFeedback() {
    return `${this.collabticV3Api}/feedback/manage`;
  }

  apiManageAudit() {
    return `${this.collabticV3Api}/audit/manage`;
  }

  // Delete ADAS File API
  apiAdasFile() {
    return `${this.collabticV3Api}/adas/manage`;
  }

  // Customer List API
  apiGetCustomerList() {
    return `${this.collabticV3Api}/shop/customers`;
  }

  // Customer Notes API
  apiGetCustomerNotesSave() {
    return `${this.collabticV3Api}/shop/save-customer-notes`;
  }

  /*** repair order */

  apiGetSupportTicketsList() {
    return `${this.collabticLocalhost}/v1/support-tickets/list`;
  }

  apiUpdateSupportTicketsList() {
    return `${this.collabticLocalhost}/v1/support-tickets/manage-work-order`;
  }

  apiDeleteSupportTicketsList() {
    return `${this.collabticLocalhost}/v1/support-tickets/delete-work-order`;
  }

  apiCompleteSupportTicket() {
    return `${this.collabticLocalhost}/v1/support-tickets/complete-work-order`;
  }

  apiWooCompleteSupportTicket() {
    return `${this.collabticLocalhost}/v1/support-tickets/woo-comm-order-details`;
  }

  apiGetJOBDetailsList() {
    return `${this.collabticLocalhost}/v1/support-tickets/job-details-list`;
  }

  apiGetWorkOrderList() {
    return `${this.collabticLocalhost}/v1/support-tickets/work-order-list`;
  }
  apiUpdateJOBDetailsList() {
    return `${this.collabticLocalhost}/v1/support-tickets/manage-job-details`;
  }

  apiGetRateCardList() {
    return `${this.collabticLocalhost}/v1/support-tickets/rate-card-list`;
  }

  apiUpdatRateCardList() {
    return `${this.collabticLocalhost}/v1/support-tickets/manage-rate-card`;
  }

  // Created by pavandeep singh
  runTimeApiUrl() {
    return `${this.dekraApi}network/getprocess`;
  }
  getprocessInfo() {
    return `${this.dekraApi}network/getprocessinfo`;
  }
  getInfoProgress() {
    return `${this.dekraApi}network/gtsgetinfoprogress`;
  }
  getprocesschecksandactions() {
    return `${this.dekraApi}network/getprocesschecksandactions`;
  }
  getprocesschecksuserinputs() {
    return `${this.dekraApi}network/getprocesschecksuserinputs`;
  }
  updateActionRuntime() {
    return `${this.dekraApi}network/gtsruntimecheckactions`;
  }
  updateInputRuntimeBlur() {
    return `${this.dekraApi}network/gtsruntimeinputblur`;
  }

  updateInputOwnerRuntime() {
    return `${this.dekraApi}network/gtsruntimeassignowner`;
  }

  // Update GTS Status
  runtimeExitUpdateGTSStatus() {
    return `${this.dekraApi}network/gtsupdateexitstatus`;
  }
  // Update GTS Status
  getruntimeExitstatus() {
    return `${this.dekraApi}network/getruntimestatus`;
  }
  // Update GTS Status
  getruntimeUserInputs() {
    return `${this.dekraApi}network/getuserinputvalues`;
  }

  // Update GTS Status
  gtsUpdateInspectionStatus() {
    return `${this.dekraApi}network/gtsupdateinspectionstatus`;
  }
  gtsUpdateInfoStatus() {
    return `${this.dekraApi}network/gtsupdateinfoprogress`;
  }

  uploadAttachmentForRuntime() {
    
    let url = this.dekraApi;
    return `${url}media/attachmentupload`;
  }

  removeAttachmentForRuntime() {
    return `${this.dekraApi}network/gtsremoveattachment`;
  }
  udpateAssignUserInput() {
    return `${this.dekraApi}network/updateassignuserinput`;
  }
  getprocessinfobysection() {
    return `${this.dekraApi}network/getprocessinfobysection`;
  }
  getpiechartdetail() {
    return `${this.dekraApi}network/getpiechartdetail`;
  }
  addAssessor() {
    return `${this.dekraApi}network/addassessor`;
  }
  getAssignUserValue() {
    return `${this.dekraApi}network/getassignuservalue`;
  }
  getOnsiteInformation() {
    return `${this.dekraApi}network/getonsiteinformation`;
  }
}
