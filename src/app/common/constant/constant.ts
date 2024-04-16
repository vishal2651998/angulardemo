export class Constant {
  public static readonly ApiKey: string = "dG9wZml4MTIz";
  public static readonly VonageApiKey: string = "47176494";
  public static readonly CollabticApiUrl: string = "https://collabtic-prod-v3-api.collabtic.com"; // New server Collabtic
  // public static readonly DekraApiUrl: string = "http://localhost:8080/v1/"
  public static readonly DekraApiUrl: string = "https://collabtic-network-stage-api.collabtic.com/v1/"; // Dekra Dev version
  // public static readonly DekraApiUrl: string = "https://collabtic-network-api.collabtic.com/v1/"; // Dekra Prod version
  //public static readonly CollabticApiUrl: string = "https://collabtic-stage-v2api.collabtic.com/" // Dev Server Collabtic
  public static readonly CollabticV3ApiUrl: string = "https://collabtic-v3api.collabtic.com"; // v3 url server
  public static readonly TechproMahleApi: string = "https://techpromahleapiv2.mahleforum.com"; //New server
  //public static readonly TechproMahleApi: string ="https://tvsindiaapi.mahleforum.com/"; //TVS server API
  //public static readonly TechproMahleApi: string ="https://tvsindia-stage-api.mahleforum.com/"; //TVS Stage Server API

  //public static readonly CbaApiUri: string = "https://tacapi.mahleforum.com"; //CBA V2 Prod version
  //public static readonly CbaV3ApiUri: string = "https://tacapi-v3.mahleforum.com/v1"; //CBA V3 Prod version
  public static readonly CbaApiUri: string = "https://tacapi-v2.mahleforum.com"; //CBA V2 Beta version
  public static readonly CbaV3ApiUri: string = "https://tacapi-beta-v3.mahleforum.com/v1"; //CBA V3 Beta version
  //public static readonly CbaV3ApiUri: string = "http://localhost:8084/v1"; // CBA V3 Local

  public static readonly KiaApiUri: string = "https://evalapi.mahleforum.com";

  // Solar Base API URL
  public static readonly SolrAPIUrl: string = "https://dev-beanstalk.collabtic.com/nlp/api/v2";     // Prod
  //public static readonly SolrAPIUrl: string="https://staging-beanstalk.collabtic.com/nlp/api/v2"; // Stage

  // TVS SOLR BASE API URL
  //public static readonly SolrAPIUrl: string="https://tvsbeanstalk.collabtic.com/nlp/api/v2";  // Prod
  //public static readonly SolrAPIUrl: string="https://stagetvsbeanstalk.collabtic.com/nlp/api/v2"; // Stage

  // CBT V3 API Production
  public static readonly collabticV3ApiUrl: string = "https://collabtic-v3api.collabtic.com/v1";
  //public static readonly collabticV3ApiUrl: string = "http://localhost:8084/v1";
  //public static readonly CollabticV3ApiUrl: string = "http://localhost:8084";

  // CBT V3 API Pre Production
  //public static readonly collabticV3ApiUrl: string = "https://collabtic-pre-prod-v3api.collabtic.com/v1";
  public static readonly collabticV3PreProdApiUrl: string = "https://collabtic-pre-prod-v3api.collabtic.com";
  //public static readonly CollabticV3ApiUrl: string = "https://collabtic-pre-prod-v3api.collabtic.com";

  public static readonly knowledgeForumHostName: string = "knowledge.boydgroup.com";
  public static readonly repairifyForumDomainId: string = "71";
  public static readonly repairifyForumHostName: string = "repairify.collabtic.com";
  public static readonly repairifySSoForumHostName: string = "repairifysso.collabtic.com";
  public static readonly cbatacbetaForumHostName: string = "tac-beta.cbaconnect.com";
  public static readonly cbatacForumHostName: string = "tac.cbaconnect.com";
  public static readonly knowledgeForumUrl: string = "https://knowledge.boydgroup.com";
  public static readonly diagnationURL: string = "https://diagnation.com/";

  public static readonly forumLocal: string = "localhost";
  public static readonly mahleforumDomain: string = "mahleforum";
  public static readonly forumDev: string = "forum-dev";
  public static readonly forumDevCollabtic: string = "forum-dev-collabtic";
  public static readonly forumDevCollabticStage: string = "forum-dev-stage-collabtic";
  public static readonly forumDevCollabticSolr: string = "forum-dev-solr-collabtic";
  public static readonly forumDevMahle: string = "forum-dev-mahle";
  public static readonly forumDevDekra: string = "forum-dev-dekra";

  public static readonly forumStage: string = "cbt-demo";
  public static readonly forumLive: string = "forum";

  public static readonly forumLocalURLmainPage: string = "http://localhost:4200";
  public static readonly forumLiveURLmainPage: string = "https://forum.collabtic.com";
  public static readonly forumLiveURLLogin: string = "https://forum.collabtic.com/auth/login";
  public static readonly forumLiveURLSignup: string = "https://forum.collabtic.com/auth/signup";
  //public static readonly forumLiveURLLogin: string = "https://forum.collabtic.com/cbt-stage/auth/login";
  //public static readonly forumLiveURLSignup: string = "https://forum.collabtic.com/cbt-stage/auth/signup";

  public static readonly MahleforumLiveURLLogin: string = "auth/login";
  public static readonly MahlforumLiveURLSignup: string = "auth/signup";

  // MAHLE Settings

  //public static readonly liveSuffixURLLogin: string = "/cbt-v2/auth/login";
  //public static readonly liveSuffixURLSignup: string = "/cbt-v2/auth/signup";

  //Collabtic Settings

  public static readonly liveSuffixURLLogin: string = "/auth/login";
  public static readonly liveSuffixURLSignup: string = "/auth/signup";

  //public static readonly liveSuffixURLLogin: string = "/cbt-stage/auth/login";
  //public static readonly liveSuffixURLSignup: string = "/cbt-stage/auth/signup";

  // default country id and name
  public static readonly CountryID: string = "";
  public static readonly CountryName: string = "";

  // default language id and name
  public static readonly LanguageID: string = "1";
  public static readonly LanguageName: string = "English";

  // knowledge article urls
  public static readonly uploadUrl: string = "/accounts/UploadAttachtoSvr";

  // filter - MAHLE Europe  used POPUP
  public static readonly filterProblemCategoryApiUrl: string = "/gts/GetProdCategoryV2";
  public static readonly filterSymptomApiUrl: string = "/parts/SymptomsSelections";
  public static readonly filterLanguageApiUrl: string = "/resources/getLangUageList";
  public static readonly filterErrorCodeApiUrl: string = "/forum/ErrorCodes";
  public static readonly CommonAttributeValuesApi: string = "/forum/CommonAttributeValues";
  public static readonly filterSubProductGroupUrl: string = "/Productmatrix/GetProductTypeList";
  public static readonly partUrl: string = "/Productmatrix/getproductmatrixModelsbyMake";
  public static readonly filterCommonAttributeApiUrl: string = "/forum/CommonAttributeValues";
  public static readonly getAllTagUsersList: string = "/dashboard/getAllTagUsersList";
  public static readonly getLookupTableData: string = "/Productmatrix/getLookupTableData";
  public static readonly getRecentVins: string = "/vehicle/GetRecentVin";
  public static readonly getCategoryData: string = "/softwaredl/GetKnowledgeArticlesByCategory";
  public static readonly getCountryData: string = "/accounts/countriesList";
  public static readonly getWorkstreamData: string = "/forum/GetworkstreamsList";
  public static readonly getManufacturerData: string = "/Productmatrix/getManufacturerList";
  public static readonly getThreadCategoryData: string = "/forum/GetThreadCategory";
  public static readonly getproductmakeData: string = "/Productmatrix/getproductmakeList";
  public static readonly getDekraCommonData: string = "/network/commondatalist";


  public static readonly deeplinkurl = "/deep-link";
  public static readonly DeepLinkText = "This feature is temporarily unavailable";
  public static readonly audioDescText = "See attached Audio Description";

  public static readonly androidStoreURL = "https://play.google.com/store/apps/details?id=com.fieldpulse.collabtic";
  public static readonly appStoreURL = "https://apps.apple.com/us/app/collabtic-app/id1104653432";

  public static readonly filterPlatform = "3";



  // TVS
  // TVS SSO  Process Enable, Need to set 1
  //public static readonly TVSSSO : string = "1";

  // Other domain , set 0
  public static readonly TVSSSO: string = "0";

  public static readonly NASTFpassphrase: string = "02b1c282573f6d545815e067958cbec7dbfd660e";

  public static readonly CollabticBoydDomain: string = "165";

  public static readonly CollabticKeepsDataDomain: string = "336";

  public static readonly MSSdomainId: string = "82";

  public static readonly CollabticBoydDomainValue: number = 165;

  // auto search complete
  // auto search complete Enable, Need to set 1
  public static readonly autoSearchComplete: string = "1";


  // auto search complete Disable, Need to set 0
  //public static readonly autoSearchComplete: string = "0";

}
export class LocalStorageItem {
  public static readonly reloadChatGroupId: string = "reloadChatGroupId";
  public static readonly reloadChatType: string = "reloadChatType";
  public static readonly themeJSON: string = "themeJSON";
  public static readonly activeTheme: string = "activeTheme";
}

export enum ChatType {
  Workstream = "1",
  GroupChat = "3",
  DirectMessage = "2",
}

export enum ContentTypeValues {
  Threads = "2",
  Documents = "4",
  Kaizen = '27',
  Parts = '11',
  KnowledgeArticles = "7",
  GTS = "8",
  Announcement = "23",
  KnowledgeBase = "28",
  SIB = "30",
  Dispatch = "32",
  StandardReports = "33",
  MarketPlace = "34",
  Opportunity = "45",
  RepairOrder = "50",
  Customers = "52",
  AdasProcedure = "53",
  default = "0"
}

export enum SolrContentTypeValues {
  Thread = 1,
  Documents = 2,
  Parts = 4,
  KnowledgeArticles = 6,
  AdasProcedure = 8,
  StandardReports = 10
}

export enum FilterGroups {
  Report = 35,
  ReportAdas = 39,
  AdasProcedure = 40
}

export const contentTypeInfo = [
  { id: 2, type: 'threads' },
  { id: 4, type: 'documents' },
  { id: 6, type: 'parts' },
  { id: 7, type: 'ka' },
  { id: 8, type: 'gts' },
  { id: 23, type: 'anc' },
  { id: 27, type: 'kaizen' },
  { id: 28, type: 'kb' },
  { id: 30, type: 'sib' },
  { id: 34, type: 'market-place' },
  { id: 45, type: 'opportunity' },
  { id: -1, type: 'standard-reports' },
  { id: 32, type: 'dispatch' },
  { id: 53, type: 'adas-procedure' }
]

export enum assetPath {
  assets = "assets/images",
  customers = "customers",
  dispatch = "dispatch",
  repairorder = "repairorder",
  hq = "hq",
  landingPage = "landing-page",
  sidebar = "sidebar",
  sideMenu = "side-menu"
}

export enum DefaultNewImages {
  Threads = "assets/images/threads-blank-page.png",
  Parts = "assets/images/parts-blank-page.png",
  Documents = "assets/images/documents-blank-page.png",
  Kaizen = "assets/images/kaizen-blank-page.png",
  chatPage = "assets/images/chat-blank-page.png",
  KnowledgeArticles = "assets/images/ka-blank-page.png",
  KnowledgeBase = "assets/images/knowledge-base/no-kb.png",
  SIB = "assets/images/sib-blank-page.png",
  StandardReports = "assets/images/standard-report/standard-report-blank.png",
  DispatchTech = "assets/images/dispatch/empty-tech-icon.png",
  MarketPlace = "assets/images/service-provider/no-training.png",
  Opportunity = "assets/images/opportunity-blank-page.png",
  UserSettings = "assets/images/empty-container/user-settings-blank.png",
  Faq = "assets/images/faq/faq-blank.png",
  AdasProcedure = "assets/images/job-ratecard-blank-page.png"
}

export enum DefaultNewCreationText {
  Threads = "New Thread",
  Parts = "New Part",
  Documents = "New Document",
  Kaizen = "New Kaizen",
  KnowledgeArticles = "New Knowledge Article",
  chatpage = "Go to Chat",
  SIB = "New SIB Cut Off",
  KnowledgeBase = "New Knowledge Base",
  standardReport = "New Report",
  reportSection = "New Section",
  reportModule = "New Module",
  reportVehicle = "New Vehicle",
  MarketPlace = "New Market Place",
  Manual = "New Manual",
  Opportunity = "New Oppurtunity",
  AdasProcedure = "New ADAS"
}

export enum PlatFormType {
  Collabtic = "1",
  MahleForum = "2",
  CbaForum = "3",
  KiaForum = "4",
}

export enum domainNames {
  viaTek = "60",
}

export enum PlatFormNames {
  Collabtic = "Collabtic",
  MahleForum = "MAHLE Forum",
  Tvs = "TVS",
  CbaForum = "CBA",
  KiaForum = "KIA",
}
export enum PlatFormDomains {
  CollabticDomain = ".collabtic.com",
  mahleDomain = ".mahleforum.com",
  CbaForum = "CBA",
  KiaForum = "KIA",
}

export enum PlatFormDomainsIdentity {
  CollabticDomain = "collabtic.com",
  mahleDomain = "mahleforum.com",
  CbaForum = "CBA",
  KiaForum = "KIA",
}

export enum notificationType {
  thread = "1",
  reply = "2",
  announcement = "3",
  document = "7",
  groupChat = "4",
  follower = "5",
}

export enum notificationSubType {
  dispatch = "5",
  workOrder = "8"
}

export enum forumPageAccess {
  threadpage = "threads/view/",
  replypage = "threads/view/",
  threadpageNew = "threads/view/",
  replypageNew = "threads/view/",
  threadpageNewV2 = "threads/view-v2/",
  replypageNewV2 = "threads/view-v2/",
  threadpageNewV3 = "threads/view-v3/",
  partsViewPage = "parts/view/",
  documentViewPage = "documents/view/",
  kaizenViewPage = "kaizen/view/",
  announcementPage = "announcements/view/",
  gtsViewPage = "gts/view/",
  kbViewPage = "kb/view/",
  sibViewPage = "sib/view/",
  chatpage = "/workstream-chat",
  chatpageNew = "chat-page",
  profilePage = "profile/",
  dashboardPage = "/dashboard-v1",
  configurationNotifyPage = "/configure-notifications-metro",
  announcementall = "/announcement-older?param=all",
  forumSearch = "/forum_search_stream",
  newSearch = "search-page",
  knowledgeArticlePageNew = "knowledgearticles/view/",
  workOrderPageView = "repair-order/view/",
  knowledgeArticlePageOld = "knowledgearticles/view-old/",
  homePage = "landing-page",
  PPFRPDFviewer = "/pdfconvert/index2.php?thread_id=",
  dispatch = "dispatch/",
  bugorfeature = "bug_and_features/view/",
  repairorderPage = "repair-order/view/",
  adasProcedurePage = "adas-procedure/view/"
}

export enum chatMessageType {
  normalMessage = "1",
  attachmentImage = "2",
  announcementFile = "3",
}
export enum escalationSendEmailType {
  addnewmember = "1",
  actionPlanuUdate = "2",
}
export enum AttachmentType {
  image = 1,
  video = 2,
  voice = 3,
  other = 4,
}

export enum threadBulbStatusText {
  proposedFix = "Thread with proposed FIX",
  shareFix = "Shared Fix",
  summitFix = "Shared Fix",
  threadwithFix = "Thread with FIX",
  threadwithHelpfulFix = "Thread with Helpful/Possible FIX",
  threadwithNotFix = "Thread with Do not FIX",
  threadCloseTxt = "Thread Closed",
}

export enum loginActivity {
  workstreamsPage = "103",
  threadsPage = "2",
  documentPage = "4",
  sibPage = "16",
  partsPage = "11",
  gtsPage = "7"
}

export enum pageInfo {
  landingPage = "1",
  workstreamPage = "2",
  chatPage = "3",
  threadsPage = "4",
  dashboard = "5",
  searchPage = "6",
  partsPage = "7",
  mediaManagerPage = "8",
  knowledgeArticlePage = "9",
  marketPlacePage = "11",
  documentPage = "0",
  knowledgeBasePage = "0",
  sibPage = "0",
  gtsPage = "0",
  directoryPage = "0",
  dispatchPage = "0",
  kaizenPage = "0",
  opportunityPage = "0",
  adasProcedure = "10",
}

export enum MediaTypeInfo {
  Image = "1",
  Video = "2",
  Audio = "3",
  Pdf = "4",
  Documents = "5",
  Link = "6",
  ProcessingTxt = "Processing..",
  UploadingTxt = "Uploading..."
}

export enum DocfileExtensionTypes {
  docx = "docx",
  doc = "doc",
  ppt = "ppt",
  pptx = "pptx",
  xls = "xls",
  xlsx = "xlsx",
  html = "html",
}
export enum windowHeight {
  height = window.innerHeight - 100,
  heightMsTeam = window.innerHeight - 120,
}

export enum IsOpenNewTab {
  teamOpenNewTab = "_self",
  openNewTab = "_blank",
}

export enum MahleKIAaccess {
  kiaUrl = "https://mahleforum.com/login-newv2",
}
export enum MessageUserType {
  self = "1",
  other = "2",
}

export enum MessageType {
  systemMessage = "1",
  attachment = "2",
  normalMessage = "3",
}

// Media Types Size
export enum MediaTypeSizes {
  fileSize = "1073741824",
  //imageSize = fileSize,
  //audioSize = fileSize,
  //videoSize = fileSize,
  //docSize = fileSize,
  fileSizeTxt = "1 GB",
}
export enum SendPushType {
  GroupManage = "1",
  RemoveUser = "2",
  GroupLastNameChannge = "3",
  UploadGroupIcon = "4",
  NormalMessage = "5",
}

// Industry Types
export const industryTypes = [
  { id: 1, type: "Printing & Imaging", slug: "printing", class: "printing-image" },
  { id: 2, type: "Automobile", slug: "automobile", class: "automobile" },
  { id: 3, type: "TVS", slug: "tvs", class: "tvs" },
  { id: 4, type: "Product Support", slug: "product-support", class: "product-support" },
  { id: 5, type: "Service Equipment", slug: "service-equipment", class: "service-equipment" }
];

export const frameRange = [
  { id: 1, name: '1 Month' },
  { id: 2, name: '2 Months' },
  { id: 3, name: '3 Months' },
  { id: 4, name: '4 Months' },
  { id: 5, name: '5 Months' },
  { id: 6, name: '6 Months' },
  { id: 7, name: '7 Months' },
  { id: 8, name: '8 Months' },
  { id: 9, name: '9 Months' },
  { id: 10, name: '10 Months' },
  { id: 11, name: '11 Months' },
  { id: 12, name: '12 Months' },
  { id: 13, name: '13 Months' },
  { id: 14, name: '14 Months' },
  { id: 15, name: '15 Months' },
  { id: 16, name: '16 Months' },
  { id: 17, name: '17 Months' },
  { id: 18, name: '18 Months' },
  { id: 19, name: '19 Months' },
  { id: 20, name: '20 Months' },
  { id: 21, name: '21 Months' },
  { id: 22, name: '22 Months' },
  { id: 23, name: '23 Months' },
  { id: 24, name: '24 Months' },
]

export const countryCodes = [
  { cname: 'Afghanistan', id: 93, name: 93 },
  { cname: 'Australia', id: 61, name: 61 },
  { cname: 'Colombia', id: 57, name: 57 },
  { cname: 'France', id: 33, name: 33 },
  { cname: 'Germany', id: 49, name: 49 },
  { cname: 'India', id: 91, name: 91 },
  { cname: 'Nigeria', id: 234, name: 234 },
];

export enum firebaseCredentials {
  emailAddress = "system.integration@collabtic.com",
  password = "collabticintegration2021!",
}
export enum constText {
  silent = "Silent",
  filter = "filter",
  thread = "thread",
  document = "document",
  part = "part",
  ka = "ka",
  kb = "kb",
  sib = "sib",
  gts = "gts"
}
export enum filterNames {
  thread = 'threadFilter',
  document = 'docFilter',
  part = 'partFilter',
  mediaManager = 'mediaFilter',
  escalation = 'escalationFilter',
  search = 'searchPageFilter',
  moreAnnouncement = 'moreAnnouncementFilter',
  dismissedAnnouncement = 'dismissedAnnouncementFilter',
  dashboardAnnouncement = 'dashboardAnnouncementFilter',
  escalationPPFR = 'escalationPPFRFilter',
  knowledgeArticle = 'knowledgeArticleFilter',
  marketPlace = 'marketPlaceFilter',
  gts = 'gtsFilter',
  sib = 'sibFilter',
  knowledgeBase = 'knowledgeBaseFilter',
  direcotry = 'directoryFilter',
  dispatch = '',
  kaizen = 'kaizenFilter',
  reportAdas = 'adasFilter',
  opportunityFilter = 'opportunityFilter',
  adasProcedure = 'adasProcedureFilter'
}
export enum PageTitleText {
  Home = "Home",
  Threads = "Threads",
  SupportRequest = "Support Requests",
  supportServices = 'Support Service',
  Parts = "Parts",
  Documents = "Documents",
  Announcement = "Announcements",
  Kaizen = "Kaizen",
  TechInfo = "Tech Info",
  KnowledgeArticles = "Knowledge Articles",
  KnowledgeBase = "Knowledge Base",
  SIB = "SIB",
  GTS = "GTS",
  Workstreams = "Workstreams",
  MediaManager = "Media Manager",
  Search = "Search",
  DTC = "DTC List",
  Directory = "Directory",
  Profile = "Profile",
  TechSupport = "Tech Support",
  MarketPlace = "Market Place",
  Manuals = "Manuals",
  Opportunity = "Opportunity",
  AdasProcedure = "Adas Procedure"
}
export enum RedirectionPage {
  Home = "landing-page",
  Threads = "threads",
  TechSupport = "techsupport",
  RepairOrderPage = "repair-order",
  MarketPlace = "market-place",
  Parts = "parts",
  Documents = "documents",
  Announcement = "announcements",
  Kaizen = "kaizen",
  KnowledgeArticles = "knowledgearticles",
  KnowledgeBase = "knowledge-base",
  SIB = "sib",
  GTS = "gts",
  Workstream = "workstreams-page",
  ManageWorkstream = "workstreams",
  MediaManager = "media-manager",
  Search = "search-page",
  Dtc = "dtc",
  Directory = "directory",
  Profile = "profile",
  Dispatch = "dispatch",
  StandardReports = "standard-reports",
  ManageUser = "user-dashboard",
  Opportunity = "opportunity",
  Manuals = "manual",
  BugorFeature = "bug_and_features",
  faq = "faq",
  AdasProcedure = "adas-procedure",
  Customers = "customers",
}
export enum RouterText {
  HOME = "landing-router",
  Threads = "threads-router",
  TechSupport = "techsupport-router",
  Parts = "parts-router",
  Documents = "documents-router",
  Kaizen = "kaizen-router",
  KnowledgeArticles = "knowledgearticles-router",
  KnowledgeBase = "knowledge-base-router",
  SIB = "sib-router",
  GTS = "gts-router",
  Workstream = "workstreams-page-router",
  MediaManager = "media-manager-router",
  SearchRouter = 'search-router',
  Directory = 'direcotry-router',
  Profile = 'profile-router',
  AdasProcedure = "adas-procedure-router"
}
export const pageTitle = [
  { slug: RedirectionPage.Home, name: PageTitleText.Home, dataInfo: '', routerText: RouterText.HOME, navEdit: RedirectionPage.Home + '-edit', navCancel: RedirectionPage.Home + '-cancel' },
  { slug: RedirectionPage.Threads, name: PageTitleText.Threads, dataInfo: 'threadDataInfo', routerText: RouterText.Threads, navEdit: RedirectionPage.Threads + '-edit', navCancel: RedirectionPage.Threads + '-cancel' },
  { slug: RedirectionPage.Threads, name: PageTitleText.SupportRequest, dataInfo: 'threadDataInfo', routerText: RouterText.Threads, navEdit: RedirectionPage.Threads + '-edit', navCancel: RedirectionPage.Threads + '-cancel' },
  { slug: RedirectionPage.Threads, name: PageTitleText.supportServices, dataInfo: 'threadDataInfo', routerText: RouterText.Threads, navEdit: RedirectionPage.Threads + '-edit', navCancel: RedirectionPage.Threads + '-cancel' },
  { slug: RedirectionPage.Parts, name: PageTitleText.Parts, dataInfo: 'partDataInfo', routerText: RouterText.Parts, navEdit: RedirectionPage.Parts + '-edit', navCancel: RedirectionPage.Parts + '-cancel' },
  { slug: RedirectionPage.Documents, name: PageTitleText.Documents, dataInfo: 'docDataInfo', routerText: RouterText.Documents, navEdit: RedirectionPage.Documents + '-edit', navCancel: RedirectionPage.Documents + '-cancel' },
  { slug: RedirectionPage.Documents, name: PageTitleText.TechInfo, dataInfo: 'docDataInfo', routerText: RouterText.Documents, navEdit: RedirectionPage.Documents + '-edit', navCancel: RedirectionPage.Documents + '-cancel' },
  { slug: RedirectionPage.Kaizen, name: PageTitleText.Kaizen, dataInfo: 'kaizenDataInfo', routerText: RouterText.Kaizen, navEdit: RedirectionPage.Kaizen + '-edit', navCancel: RedirectionPage.Kaizen + '-cancel' },
  { slug: RedirectionPage.KnowledgeArticles, name: PageTitleText.KnowledgeArticles, dataInfo: 'kaDataInfo', routerText: RouterText.KnowledgeArticles, navEdit: RedirectionPage.KnowledgeArticles + '-edit', navCancel: RedirectionPage.KnowledgeArticles + '-cancel' },
  { slug: RedirectionPage.KnowledgeBase, name: PageTitleText.KnowledgeBase, dataInfo: 'kbDataInfo', routerText: RouterText.KnowledgeBase, navEdit: RedirectionPage.KnowledgeBase + '-edit', navCancel: RedirectionPage.KnowledgeBase + '-cancel' },
  { slug: RedirectionPage.SIB, name: PageTitleText.SIB, dataInfo: 'sibDataInfo', routerText: RouterText.SIB, navEdit: RedirectionPage.SIB + '-edit', navCancel: RedirectionPage.SIB + '-cancel' },
  { slug: RedirectionPage.GTS, name: PageTitleText.GTS, dataInfo: 'gtsDataInfo', routerText: RouterText.GTS, navEdit: RedirectionPage.GTS + '-edit', navCancel: RedirectionPage.GTS + '-cancel' },
  { slug: RedirectionPage.Workstream, name: PageTitleText.Workstreams, dataInfo: '', routerText: RouterText.Workstream, navEdit: RedirectionPage.Workstream + '-edit', navCancel: RedirectionPage.Workstream + '-cancel' },
  { slug: RedirectionPage.Search, name: PageTitleText.Search, dataInfo: '', routerText: RouterText.SearchRouter, navEdit: RedirectionPage.Search + '-edit', navCancel: RedirectionPage.Search + '-cancel' },
  { slug: RedirectionPage.MediaManager, name: PageTitleText.MediaManager, dataInfo: '', routerText: RouterText.MediaManager, navEdit: RedirectionPage.MediaManager + '-edit', navCancel: RedirectionPage.MediaManager + '-cancel' },
  { slug: RedirectionPage.Directory, name: PageTitleText.Directory, dataInfo: '', routerText: RouterText.Directory, navEdit: '', navCancel: '' },
  { slug: RedirectionPage.Profile, name: PageTitleText.Profile, dataInfo: '', routerText: RouterText.Profile, navEdit: '', navCancel: '' },
  { slug: RedirectionPage.TechSupport, name: PageTitleText.TechSupport, dataInfo: '', routerText: RouterText.TechSupport, navEdit: '', navCancel: '' },
  { slug: RedirectionPage.AdasProcedure, name: PageTitleText.AdasProcedure, dataInfo: 'adasDataInfo', routerText: RouterText.AdasProcedure, navEdit: RedirectionPage.AdasProcedure + '-edit', navCancel: RedirectionPage.AdasProcedure + '-cancel' },
];
export enum silentItems {
  silentThreadFilter = "silentThreadFilter",
  silentPartFilter = "silentPartFilter",
  silentDocumentFilter = "silentDocumentFilter",
  silentKAFilter = "silentKAFilter",
  silentKBFilter = "silentKBFilter",
  silentSIBFilter = "silentSIBFilter",
  silentGTSFilter = "silentGTSFilter",
  silentDSFilter = 'silentDSCount',
  silentThreadCount = "silentThreadCount",
  silentPartCount = "silentPartCount",
  silentDocumentCount = "silentDocumentCount",
  silentKACount = "silentKaCount",
  silentKBCount = "silentKBCount",
  silentSIBCount = "silentSIBCount",
  silentGTSCount = "silentGTSCount",
  silentDSCount = 'silentDSCount'
}
export const PushTypes = [
  { id: 12, type: 'silent', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 3, type: 'silent', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 1, type: 'normal', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 22, type: 'silent', url: RedirectionPage.Documents, filter: filterNames.document, silentFilter: silentItems.silentDocumentFilter, silentCount: silentItems.silentDocumentCount, pageInfo: pageInfo.documentPage },
  { id: 23, type: 'normal', url: RedirectionPage.Documents, filter: filterNames.document, silentFilter: silentItems.silentDocumentFilter, silentCount: silentItems.silentDocumentCount, pageInfo: pageInfo.documentPage },
  { id: 24, type: 'silent', url: RedirectionPage.Parts, filter: filterNames.part, silentFilter: silentItems.silentPartFilter, silentCount: silentItems.silentPartCount, pageInfo: pageInfo.partsPage },
  { id: 0, type: 'normal', url: RedirectionPage.Parts, filter: filterNames.part, silentFilter: silentItems.silentPartFilter, silentCount: silentItems.silentPartCount, pageInfo: pageInfo.partsPage },
  { id: 25, type: 'silent', url: RedirectionPage.KnowledgeArticles, filter: filterNames.knowledgeArticle, silentFilter: silentItems.silentKAFilter, silentCount: silentItems.silentKACount, pageInfo: pageInfo.knowledgeArticlePage },
  { id: 0, type: 'normal', url: RedirectionPage.KnowledgeArticles, filter: filterNames.knowledgeArticle, silentFilter: silentItems.silentKAFilter, silentCount: silentItems.silentKACount, pageInfo: pageInfo.knowledgeArticlePage },
  { id: 26, type: 'silent', url: RedirectionPage.GTS, filter: filterNames.gts, silentFilter: silentItems.silentGTSFilter, silentCount: silentItems.silentGTSCount, pageInfo: pageInfo.gtsPage },
  { id: 26, type: 'silent', url: RedirectionPage.GTS, filter: filterNames.gts, silentFilter: silentItems.silentGTSFilter, silentCount: silentItems.silentGTSCount, pageInfo: pageInfo.gtsPage },
  { id: 0, type: 'normal', url: RedirectionPage.GTS, filter: filterNames.gts, silentFilter: silentItems.silentGTSFilter, silentCount: silentItems.silentGTSCount, pageInfo: pageInfo.gtsPage },
  { id: 27, type: 'silent', url: RedirectionPage.SIB, filter: filterNames.sib, silentFilter: silentItems.silentSIBFilter, silentCount: silentItems.silentSIBCount, pageInfo: pageInfo.sibPage },
  { id: 0, type: 'normal', url: RedirectionPage.SIB, filter: filterNames.sib, silentFilter: silentItems.silentSIBFilter, silentCount: silentItems.silentSIBCount, pageInfo: pageInfo.sibPage },
  { id: 28, type: 'silent', url: RedirectionPage.KnowledgeBase, filter: filterNames.knowledgeBase, silentFilter: silentItems.silentKBFilter, silentCount: silentItems.silentKBCount, pageInfo: pageInfo.knowledgeBasePage },
  { id: 0, type: 'normal', url: RedirectionPage.KnowledgeBase, filter: filterNames.knowledgeBase, silentFilter: silentItems.silentKBFilter, silentCount: silentItems.silentKBCount, pageInfo: pageInfo.knowledgeBasePage },
  { id: 9, type: 'social', url: '', filter: '', silentFilter: '', silentCount: '', pageInfo: '' },
  { id: 10, type: 'silent', url: '', filter: '', silentFilter: '', silentCount: '', pageInfo: '' },
  { id: 0, type: 'normal', url: RedirectionPage.Dispatch, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 30, type: 'normal', url: RedirectionPage.RepairOrderPage, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 31, type: 'silent', url: RedirectionPage.Dispatch, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 32, type: 'silent', url: RedirectionPage.Dispatch, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 33, type: 'silent', url: RedirectionPage.Dispatch, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 34, type: 'silent', url: RedirectionPage.Dispatch, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 35, type: 'silent', url: RedirectionPage.Dispatch, filter: filterNames.dispatch, silentFilter: silentItems.silentDSFilter, silentCount: silentItems.silentDSCount, pageInfo: pageInfo.dispatchPage },
  { id: 40, type: 'normal', url: RedirectionPage.Documents, filter: filterNames.document, silentFilter: silentItems.silentDocumentFilter, silentCount: silentItems.silentDocumentCount, pageInfo: pageInfo.documentPage },
  { id: 41, type: 'normal', url: RedirectionPage.Documents, filter: filterNames.document, silentFilter: silentItems.silentDocumentFilter, silentCount: silentItems.silentDocumentCount, pageInfo: pageInfo.documentPage },
  { id: 45, type: 'normal', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 46, type: 'normal', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 47, type: 'silent', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 48, type: 'silent', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
]

export enum GTSPage {
  start = 'start-page',
  procedure = 'procedure-page',
  gts = 'gts-page'

}

export enum ManageTitle {
  actionNew = 'New',
  actionEdit = 'Edit',
  actionDuplicate = 'Duplicate',
  actionDelete = 'Delete',
  thread = 'Thread',
  feedback = 'Feedback',
  techHelp = 'Tech Help',
  supportServices = 'Support Service',
  supportRequest = 'Support Request',
  standardReport = 'Standard Report',
  reportSec = 'Section',
  reportModule = 'Module',
  reportVehicle = 'Vehicle',
  secCont = 'Content',
  diagnosticInfo = 'Diagnostic Info',
  addMoreCont = 'Add More Content',
  training = 'Training',
  manual = 'Manual',
  opportunity = 'Opportunity',
  faq = 'FAQ',
}

export enum DispatchText {
  shop = 'Shop',
  serviceReq = 'Service Request',
  serviceCatg = 'Service Category',
  contact = 'Contact',
  switchMobileTech = "Switch to Mobile Technician View",
  switchAdmin = "Switch to Admin View",
  mobileTech = "Mobile Technician View"
}


export enum MarketPlaceText {
  quiz = 'Quiz Question',
  customer = 'Customer'
}

export const MediaUpload = [
  { tab: 'media', title: "Media Manager", isSelected: true, isActive: true, class: "tab-col media" },
  { tab: 'google-drive', title: "Google Drive", isSelected: false, isActive: false, class: "tab-col google-drive disable" },
  { tab: 'drop-box', title: "Dropbox", isSelected: false, isActive: false, class: "tab-col drop-box disable" },
];

export const DefaultValues = {
  countryId: 1,
  countryName: 'US',
  language: [{ id: 1, name: 'English' }]
};

export enum filterFields {
  reportAdas = 'adasFilterFields',
  adasProcedureFields = 'adasProcedureFilterFields'
}

export enum thirdPartApiUrl {
  docViewUrl = 'https://view.officeapps.live.com/op/view.aspx?src=',
  recallApiUrl = 'https://api.nhtsa.gov/recalls/recallsByVehicle'
}

export const statusOptions = [
  { name: "All", status: "All", code: "" },
  { name: "Pending", status: "In-Process", code: "2" },
  { name: "In-Process", status: "In-Process", code: "3" },
  { name: "Return", status: "Returned", code: "4" },
  { name: "Retract", status: "Retracted", code: "5" },
  { name: "Draft", status: "Drafted", code: "6" },
];

export const dispatchMenuItems = [
  {
    "id": 1,
    "name": "Dispatch",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dispatch-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dispatch-active.svg`,
    "activeClass": 1,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "sdispatch-icon",
    "slug": "dispatch",
    "hover": false,
    "defultImg": "/uploads/menuicons/dispatch-normal.svg",
    "activeImg": "/uploads/menuicons/dispatch-active.svg"
  },
  {
    "id": 2,
    "name": "Shops",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/shop-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/shop-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "shop-icon",
    "slug": "shop",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 3,
    "name": "Resource Work Status",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/resource-work-status-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/resource-work-status-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "resource-work-status-icon",
    "slug": "resource-work-status",
    "hover": false,
    "defultImg": "/uploads/menuicons/resource-work-status-normal.svg",
    "activeImg": "/uploads/menuicons/resource-work-status-active.svg"
  },
  {
    "id": 4,
    "name": "Resource Planning",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/resource-planning-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/resource-planning-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "resource-planning-icon",
    "slug": "resource-planning",
    "hover": false,
    "defultImg": "/uploads/menuicons/resource-planning-normal.svg",
    "activeImg": "/uploads/menuicons/resource-planning-active.svg"
  },
  {
    "id": 5,
    "name": "Completed Schedules",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/completed-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/completed-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "completed-icon",
    "slug": "completed",
    "hover": false,
    "defultImg": "/uploads/menuicons/completed-normal.svg",
    "activeImg": "/uploads/menuicons/completed-active.svg"
  },
  {
    "id": 6,
    "name": "Dashboard",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dashboard-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dashboard-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "dashboard-icon",
    "slug": "dashboard",
    "hover": false,
    "defultImg": "/uploads/menuicons/dashboard-normal.svg",
    "activeImg": "/uploads/menuicons/dashboard-active.svg"
  },
  {
    "id": 7,
    "name": "Settings",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "settings-icon",
    "slug": "settings",
    "hover": false,
    "defultImg": "/uploads/menuicons/settings-normal.svg",
    "activeImg": "/uploads/menuicons/settings-active.svg"
  }
];

export const auditMenuItems = [
  {
    "id": 1,
    "name": "Dashboard",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dashboard-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dashboard-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "dashboard-icon",
    "slug": "dashboard",
    "hover": false,
    "defultImg": "/uploads/menuicons/dashboard-normal.svg",
    "activeImg": "/uploads/menuicons/dashboard-active.svg"
  },
  {
    "id": 1,
    "name": "Settings",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "settings-icon",
    "slug": "settings",
    "hover": false,
    "defultImg": "/uploads/menuicons/settings-normal.svg",
    "activeImg": "/uploads/menuicons/settings-active.svg"
  }
];

export const customerMenuItems = [
  {
    "id": 1,
    "name": "Summary",
    "urlPath": `${assetPath.assets}/${assetPath.customers}/${assetPath.sidebar}/svg/summary-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.customers}/${assetPath.sidebar}/svg/summary-active.svg`,
    "activeClass": 1,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "csummary-icon text-center",
    "slug": "summary",
    "hover": false
  },
  {
    "id": 2,
    "name": "Repair Order History",
    "urlPath": `${assetPath.assets}/${assetPath.customers}/${assetPath.sidebar}/svg/ro-icon-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.customers}/${assetPath.sidebar}/svg/ro-icon-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "cro-icon",
    "slug": "repair-order",
    "hover": false,
    "defultImg": "/uploads/menuicons/settings-normal.svg",
    "activeImg": "/uploads/menuicons/settings-active.svg"
  },
  /* {
    "id": 3,
    "name": "Equipments",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "settings-icon",
    "slug": "equipments",
    "hover": false,
    "defultImg": "/uploads/menuicons/settings-normal.svg",
    "activeImg": "/uploads/menuicons/settings-active.svg"
  } */
];

export const serviceDurations = [
  {
    "id": '30 m',
    "value": '30 Minutes'
  },
  {
    "id": '1 h',
    "value": '1 Hour'
  },
  {
    "id": '1.5 h',
    "value": '1.5 Hours'
  },
  {
    "id": '2 h',
    "value": '2 Hours'
  },
  {
    "id": '2.5 h',
    "value": '2.5 Hours'
  },
  {
    "id": '3 h',
    "value": '3 Hours'
  },
  {
    "id": '3.5 h',
    "value": '3.5 Hours'
  },
  {
    "id": '4 h',
    "value": '4 Hours'
  },
  {
    "id": '4.5 h',
    "value": '4.5 Hours'
  },
  {
    "id": '5 h',
    "value": '5 Hours'
  },
  {
    "id": '5.5 h',
    "value": '5.5 Hours'
  },
  {
    "id": '6 h',
    "value": '6 Hours'
  },
  {
    "id": '6.5 h',
    "value": '6.5 Hours'
  },
  {
    "id": '7 h',
    "value": '7 Hours'
  },
  {
    "id": '7.5 h',
    "value": '7.5 Hours'
  },
  {
    "id": '8 h',
    "value": '8 Hours'
  }
];

export const repairorderMenuItems = [
  {
    "id": 1,
    "name": "Repair Order",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/ro-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/ro-active.svg`,
    "activeClass": 1,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "repairorder-icon",
    "slug": "repairorder",
    "hover": false,
    "defultImg": "/uploads/menuicons/ro-normal.svg",
    "activeImg": "/uploads/menuicons/ro-active.svg"
  },
  {
    "id": 2,
    "name": "Dispatch",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dispatch-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/dispatch-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "sdispatch-icon",
    "slug": "dispatch",
    "hover": false,
    "defultImg": "/uploads/menuicons/dispatch-normal.svg",
    "activeImg": "/uploads/menuicons/dispatch-active.svg"
  },
  {
    "id": 3,
    "name": "Tech Support",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/tech-support-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/tech-support-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "tech-support-icon",
    "slug": "techsupport",
    "hover": false,
    "defultImg": "/uploads/menuicons/tech-support-normal.svg",
    "activeImg": "/uploads/menuicons/tech-support-active.svg"
  },
  {
    "id": 4,
    "name": "Job and Rate",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/job-rate-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/job-rate-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "job-rate-icon",
    "slug": "jobrate",
    "hover": false,
    "defultImg": "/uploads/menuicons/job-rate-normal.svg",
    "activeImg": "/uploads/menuicons/job-rate-active.svg"
  },
  {
    "id": 5,
    "name": "Fixes",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/light-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/light-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "light-icon",
    "slug": "fixes",
    "hover": false,
    "defultImg": "/uploads/menuicons/light-normal.svg",
    "activeImg": "/uploads/menuicons/light-active.svg"
  },
  {
    "id": 6,
    "name": "List",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/list-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/list-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "list-icon",
    "slug": "list",
    "hover": false,
    "defultImg": "/uploads/menuicons/list-normal.svg",
    "activeImg": "/uploads/menuicons/list-active.svg"
  },
  {
    "id": 7,
    "name": "Settings",
    "urlPath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.dispatch}/svg/sidebar/settings-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "settings-icon",
    "slug": "settings",
    "hover": false,
    "defultImg": "/uploads/menuicons/settings-normal.svg",
    "activeImg": "/uploads/menuicons/settings-active.svg"
  }
];

export const hqMenuItems = [
  {
    "id": 1,
    "name": "Home",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/home-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/home-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "home-icon",
    "slug": "home",
    "hover": false,
    "defultImg": "/uploads/menuicons/dashboard-normal.svg",
    "activeImg": "/uploads/menuicons/dashboard-active.svg"
  },
  {
    "id": 2,
    "name": "Network",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/network-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/network-active-white.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "network-icon",
    "slug": "headquarters",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 8,
    "name": "All Networks",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/all-network-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/all-network-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "network-icon",
    "slug": "all-networks",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 3,
    "name": "Tools & Equipment",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/tools-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/tools-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "tools-icon",
    "slug": "tools",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 4,
    "name": "Audit/Inspection",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/audit-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/audit-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "audit-icon",
    "slug": "dekra-audit",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 5,
    "name": "Vendors",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/vendors-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/vendors-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "vendors-icon",
    "slug": "shop",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },

];

export const shopMenuItems = [
  {
    "id": 1,
    "name": "Home",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/home-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/home-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "home-icon",
    "slug": "home",
    "hover": false,
    "defultImg": "/uploads/menuicons/dashboard-normal.svg",
    "activeImg": "/uploads/menuicons/dashboard-active.svg"
  },
  {
    "id": 2,
    "name": "Shop Profile",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/shops-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/shops-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "network-icon",
    "slug": "shop-detail",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 3,
    "name": "Tools & Equipment",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/tools-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/tools-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "tools-icon",
    "slug": "shop-tools",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 4,
    "name": "Audit/Inspection",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/audit-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/audit-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "audit-icon",
    "slug": "dekra-audit",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 5,
    "name": "Vendors",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/vendors-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/svg/sidebar/vendors-active.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "vendors-icon",
    "slug": "shop",
    "hover": false,
    "defultImg": "/uploads/menuicons/shop-normal.svg",
    "activeImg": "/uploads/menuicons/shop-active.svg"
  },
  {
    "id": 6,
    "name": "Users",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/user-normal.svg`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/user-selected.svg`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "vendors-icon",
    "slug": "all-users",
    "hover": false,
    "defultImg": "/assets/images/hq/user-normal.svg",
    "activeImg": "/assets/images/hq/user-selected.svg"
  },
  {
    "id": 7,
    "name": "Facility Layout",
    "urlPath": `${assetPath.assets}/${assetPath.hq}/facility-layout.png`,
    "urlActivePath": `${assetPath.assets}/${assetPath.hq}/facility-layout.png`,
    "activeClass": 0,
    "toolTips": [],
    "disableContentType": false,
    "submenuimageClass": "vendors-icon p-9px",
    "slug": "facility-layout",
    "hover": false,
    "defultImg": "/assets/images/hq/facility-layout.png",
    "activeImg": "/assets/images/hq/facility-layout.png"
  },

];
