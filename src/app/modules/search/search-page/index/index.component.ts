import { Component, OnInit, HostListener,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Editor } from "primeng/editor";
import * as ClassicEditor from "src/build/ckeditor";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AttachmentType, pageInfo, Constant, SolrContentTypeValues, filterNames, PlatFormType, RedirectionPage } from 'src/app/common/constant/constant';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { FilterComponent } from "src/app/components/common/filter/filter.component";
import { ThreadDetailHeaderComponent } from 'src/app/layouts/thread-detail-header/thread-detail-header.component';
import { FixThreadsComponent } from 'src/app/components/common/fix-threads/fix-threads.component';
import { AdasListComponent } from 'src/app/components/common/adas-list/adas-list.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as moment from 'moment';
declare var $:any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  host: {'window:beforeunload':'doSomething'}
})
export class IndexComponent implements OnInit, OnDestroy {
  public title='Search';
  public docDetail: any = [];
  filterRef: FilterComponent;
  threadDetailHeaderRef: ThreadDetailHeaderComponent;
  fixThreadRef: FixThreadsComponent;
  adasPageRef: AdasListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public filterItems: any = [];
  public facetsDatatems: any = [];
  public filterLoading: boolean = true;
  public emptyFlag: boolean = false;
  public expandFlag: boolean = false;
  public searchFlag: boolean=true;
  public showSearchRes: boolean=true;
  public fromSearchPage:boolean=true;
  public solrApi: boolean = true;
  public collabticDomain: boolean = false;
  public collabticFixes: boolean = false;
  public teamSystem=localStorage.getItem('teamSystem');
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public comefromOthersTab:boolean=false;
  public searchPlacehoder: string = 'Search';
  public searchVal: string = '';
  public activePageAccess="0";
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public searchReadonlyFlag: boolean=false;
  public searchBgFlag: boolean = false;
  public assetPath: string = "assets/images";
  public assetPathplatform: string = "assets/images/";
  public searchImg: string = `${this.assetPath}/search-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close.png`;
  public filterInterval: any;
  public initYear: number = 1960;
  public years = [];
  public currYear: any = moment().format("Y");
  public filterActiveCount: number = 0;
  public threadFilterOptions;
  public filterrecords: boolean = false;
  public headerData: Object;
  public outputContentTypedata:object;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public pageData=pageInfo.searchPage;
  public pageLoading: boolean = false;
  public docLoading: boolean = true;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public loadLeftside=true;
  public menuListloaded;
  public getcontentTypesArr=[];
  public roleId;
  public apiData: Object;
  public bodyHeight: number;
  public innerHeight: number = 0; 
  public feedbackHeight: number = 0;
  public workstreamId;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public currentContentTypeId:number=2;
  pageAccess: string = "search";
  public bodyClass:string = "landing-page";
  public bodyClass1:string = "knowledge-base";
  public bodyClass2:string = "search-page";
  public bodyElem;
  public thumbView: boolean = true;
  folders = [];
  files = [];
  scrollCount: number = 0;
  public filterInitFlag: boolean = false;
  public threadTypesort='';
  public groupId: number = 30;
  public pageRefresh:object={
    'type': this.threadTypesort,
    'expandFlag':this.expandFlag,
   }
   public partData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };
  public kbData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };

  public sibData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };

  public kaData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };
  public threadInfo: any;
  public threadThumbInit: number = 0;
  public viewFlag: boolean = false;
  public threadThumbView: boolean;
  public CBADomian: boolean = false;
  public rightPanel: boolean = false;
  public docInfoFlag: boolean = false;
  public docData = {
    accessFrom: this.pageAccess,
    action: 'files',
    domainId: 0,
    countryId: "",
    expandFlag: this.rightPanel,
    filterOptions: [],
    thumbView: this.thumbView,
    searchVal: '',
    userId: 0,
    partType: '',
    headerFlag: this.headerFlag
  };
  public fromURLSearchText: string = '';
  public fromURLSearchParam: string = '';
  public historyFlag:boolean=false;
  public resetFilterFlag:boolean=false;
    public filterOptions: Object = {
      'filterExpand': this.expandFlag,
      'page': this.pageAccess,
      'initFlag': this.filterInitFlag,
      'filterLoading': this.filterLoading,
      'filterData': [],
      'filterActive': true,
      'filterHeight': 0,
      'apiKey': '',
      'userId': '',
      'domainId': '',
      'countryId': "",
      'groupId': this.groupId,
      'threadType': '25',
      'action': 'init',
      'reset':this.resetFilterFlag,
      'historyFlag': this.historyFlag,
      
    };
  
  public feedbackFormFlag: boolean = false;
  public feedbackLoading: boolean = false;
  public feedbackFormValid: boolean = false;
  public feedbackFormSubmit: boolean = false;
  public feedbackSucess: string = "";
  public feedbackForm: FormGroup;
  public feedbackFields: any = [];
  public dialogPosition: string = 'top-right';
  public requiredText: string = "Required";

  public editorProgressUpload = 0;
  public Editor = ClassicEditor;
  attachmentTouploadList: FileData[] = [];
  configCke: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
      items: [
       "bold",
        "Emoji",
        "italic",
        "link",
       "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",

      ],
    },
    placeholder: 'Enter your feedback',
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
    
  constructor(
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService, 
    private formBuilder: FormBuilder,
    private documentationService: DocumentationService,
    public apiUrl: ApiService,
    private httpClient:HttpClient,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
  ) {
    console.log("index of search page");
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = 'dialog-centered';
   }

  ngOnInit(action = ''): void {
    if(action == 'reset') {
      localStorage.setItem('filterReset','1');
    }
    let platformId = localStorage.getItem("platformId");
    this.CBADomian = (platformId == PlatFormType.CbaForum) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    let fromURLSearchVal = this.getQueryParamFromURL('search'); 
    if(fromURLSearchVal != 0){
      this.fromURLSearchText = fromURLSearchVal.toString();
      console.log(this.fromURLSearchText);
      this.searchVal = this.fromURLSearchText;
      localStorage.setItem("searchQSVal",this.searchVal);
      this.applySearch('', this.searchVal,'');  
      this.pageRefresh['access'] = 'thread';
      this.currentContentTypeId = 2;
      let fromURLSearchParamVal = this.getQueryParamFromURLParams('searchParams'); 
      if(fromURLSearchParamVal != 0){
        fromURLSearchParamVal = (fromURLSearchParamVal); 
        console.log(fromURLSearchParamVal); 
        localStorage.setItem("searchparamQSVal",fromURLSearchParamVal.toString()); 
      }      
    }

    var id = localStorage.getItem('currentContentType') != null && localStorage.getItem('currentContentType') != undefined ? localStorage.getItem('currentContentType') : this.currentContentTypeId.toString();
    this.currentContentTypeId = parseInt(id);
    if(this.teamSystem){
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;  
        if(this.searchVal)
        {
          this.applySearch('', this.searchVal,'');          
        }
       
      }
    }

    if(this.searchVal)
    {
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.searchBgFlag = true;
      this.showSearchRes=true;
      this.searchTick = (this.searchVal.length > 0) ? true : false;
      this.searchClose = this.searchTick;
      this.emptyFlag = true;
      this.rightPanel = false;
      this.docInfoFlag = false;
    }
    else
    {
      this.searchImg = `${this.assetPath}/search-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close.png`;  
      this.searchBgFlag = false;
      this.showSearchRes=false;
      this.emptyFlag = true;
      this.rightPanel = false;
      this.docInfoFlag = false;
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;    
    this.sibData.domainId=this.domainId;
    this.sibData.userId=this.userId;
    this.kaData.domainId=this.domainId;
    this.kaData.userId=this.userId;
   
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');   
    
    this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      this.bodyElem.classList.add(this.bodyClass2);
    
      let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
      if(authFlag) {
        let searchKey = localStorage.getItem('searchValue');     
       
        let searchBg = (searchKey == undefined || searchKey == 'undefined' || searchKey == 'null' || searchKey == null || searchKey == '') ? false : true;
        this.partData['domainId'] = this.domainId;
        this.partData['countryId'] = this.countryId;
        this.partData['userId'] = this.userId;
     
        this.kbData['domainId'] = this.domainId;
        this.kbData['countryId'] = this.countryId;
        this.kbData['userId'] = this.userId;
       
        this.docData['userId'] = this.userId;
        let listView = localStorage.getItem("threadViewType");
        this.threadThumbView = (listView && listView == "thumb") ? true : false;

        this.thumbView = (listView && listView == "thumb") ? true : false; 
        this.docData['thumbView'] = this.thumbView;

        this.headerData = {
        'access': this.pageAccess,
        'pageName': this.pageAccess,
        'currentContentTypeId': this.currentContentTypeId,
        'showSearchRes': this.showSearchRes,       
        'profile': false,
        'welcomeProfile': false,
        'search': true,
        'searchBg': searchBg
      };
      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'searchKey': this.searchVal,
        'historyFlag': this.historyFlag
      }
      this.collabticFixes = (this.domainId == 336) ? true : false;
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
      this.apiData = apiInfo;
      this.filterOptions['apiKey'] = Constant.ApiKey;
      this.filterOptions['userId'] = this.userId;
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      let filterType = 0;
      switch(this.currentContentTypeId) {
        case 2:
          filterType = SolrContentTypeValues.Thread;
          break;
        case 4:
          filterType = SolrContentTypeValues.Documents;
          break;
        case 7:
          //filterType = SolrContentTypeValues.KnowledgeArticles;
          filterType = 1;
          break;
        case 11:
          filterType = SolrContentTypeValues.Parts;
          break;  
      }
      this.filterOptions['filterType'] = filterType;
      
      let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString()
      });
    }
    if(this.currentContentTypeId == 2 || this.currentContentTypeId == 4) {
      this.viewFlag = true;
      let listView = localStorage.getItem("threadViewType");
      this.threadThumbView = (listView && listView == "thumb") ? true : false;
      this.threadInfo = {
        pageView: this.threadThumbView,
        threadThumbInit: this.threadThumbInit
      }
      console.log(this.threadInfo)
    }

    setTimeout(() => {
      this.getFilters(action);
    }, 1500);



     this.commonService.documentPanelFlagReceivedSubject.subscribe((response) => {
      console.log(response)
      let flag = response['flag'];
      let access = response['access'];     
      switch (access) {
        case 'documents':
          this.docDetail = [];
          this.rightPanel = !flag;
          this.docInfoFlag = false;
          break;
        default:
          this.docDetail = response['docData'];
          this.emptyFlag = false;
          console.log(this.rightPanel)
          if(!this.rightPanel) {
            this.rightPanel = true;
          }
          this.emitDocInfo(this.docDetail);         
          break;  
      }
    });

      var menuListloaded=localStorage.getItem('sideMenuValues');
      console.log(menuListloaded);
      this.getcontentTypesArr=[];
    //console.log(menuListloaded+'--------storage');
    var menuListloadedArr= JSON.parse(menuListloaded);
    console.log(menuListloadedArr);
    for(let menu of menuListloadedArr) {
      if(menu.contentTypeId)
      {
      let urlpathreplace= menu.urlPath;
      let urlActivePathreplace= menu.urlActivePath;
      let submenuimageClass= menu.submenuimageClass;
     let urlpth= urlpathreplace.replace('.png','.svg');
     let urlActivePath= urlActivePathreplace.replace('.png','.svg');
     let page = RedirectionPage.TechSupport;
     if(menu.contentTypeId!=26  && menu.contentTypeId!=20  && menu.contentTypeId!=23 && menu.contentTypeId!=1 && menu.contentTypeId!=5 && menu.contentTypeId!=8 && menu.contentTypeId!=6 && menu.contentTypeId!=32 && menu.slug != page)
     {
       console.log(menu.name);
      this.getcontentTypesArr.push({
        contentTypeId:menu.contentTypeId,
        name:menu.name,
        urlPath:urlpth,
        urlActivePath:urlActivePath,
        submenuimageClass:submenuimageClass,
        slug: menu.slug,
        searchCount: 0
        });
     }

      }
    }
    let loadPageMenu = localStorage.getItem('loadMenuPageName');  
    let sideMenuValuesArr = this.getcontentTypesArr; 
    for(let smv of sideMenuValuesArr){
      if(loadPageMenu == smv.name){
        this.currentContentTypeId = smv.contentTypeId;
      }   
    }
    }
    else
    {
      this.router.navigate(['/forbidden']);
    }

    setTimeout(() => {
      this.feedbackForm = this.formBuilder.group({});
      this.getFeedbackFields();
    }, 2000);
      
  }

  emitDocInfo(docData) {
    this.docInfoFlag = true;
    let data = {
      action: 'load',
      loading: true,
      dataId: docData.resourceID,
      docData: docData
    }
    this.commonService.emitDocumentInfoData(data);
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let isNearBottom = this.documentationService.isUserNearBottom(event);
    if (isNearBottom) {
      this.scrollCount = this.scrollCount + 1;
      this.itemOffset = this.scrollCount * 10;
      this.getDocumentList(this.currentContentTypeId);
    }
  }

 
  applySearch(action, val,filterData='') {
    console.log(action, val)
    let url = this.router.url.split('/');
    var id = localStorage.getItem('currentContentType') != null && localStorage.getItem('currentContentType') != undefined ? localStorage.getItem('currentContentType') : this.currentContentTypeId.toString();
    if(this.currentContentTypeId != parseInt(id)) {
      this.currentContentTypeId = parseInt(id);
    }
    if(this.apiUrl.searchFromPageNameClose){
      localStorage.removeItem('currentContentType');
      this.apiUrl.searchFromPageNameClose = false; 
    }
    this.getcontentTypesArr.forEach(item => {
      item.searchCount = 0;
    });
    if(val == 'destroy-parts') {
      let aurl = RedirectionPage.Parts;
      this.router.navigate([aurl]);
      return false;
    }
  
    if(val || action=='filter') {
      this.searchVal = val;
      this.submitted = true;
      let searchKey=val;
      let searchBg = (searchKey == undefined || searchKey == 'undefined' || searchKey == 'null' || searchKey == null || searchKey == '') ? false : true;
      this.partData['domainId'] = this.domainId;
      this.partData['countryId'] = this.countryId;
      this.partData['userId'] = this.userId;  
      this.headerData = {
        'access': this.pageAccess,
        'pageName': this.pageAccess,
        'showSearchRes': this.showSearchRes,
        'profile': true,
        'welcomeProfile': true,
        'search': true,
        'searchBg': searchBg,
        'searchValue': this.searchVal
      };
      let timeout = (this.collabticFixes) ? 500 : 0;
      //setTimeout(() => {
        this.showSearchRes=true;
        this.emptyFlag = true;
        this.rightPanel = false;
        this.docInfoFlag = false;
        if(val) {
          localStorage.setItem('searchValue',val);
        }
      //}, timeout);
    } else {
      this.showSearchRes=false;
      this.emptyFlag = true;
      this.rightPanel = false;
      this.docInfoFlag = false;
      /*
      let resetFlag =  this.apiData['filterOptions'].reset;
      if(!resetFlag) {
        this.filterActiveCount = 0;
        //this.filterLoading = true;
        this.commonService.emitMessageLayoutrefresh(this.apiData['filterOptions']);
      }
      else
      {
        this.showSearchRes=false;
      }
      */
    }

    if(this.showSearchRes) {
      setTimeout(() => {
        // this.pageRefresh['type']=val; 
        this.searchBgFlag = true;
        this.searchImg = `${this.assetPath}/search-white-icon.png`;
        this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        this.searchTick = true ;
        this.searchClose = this.searchTick;
        this.pageRefresh['searchOption']=true;
        let searchPageFilter: any = JSON.parse(localStorage.getItem('searchPageFilter'));;
        switch(this.currentContentTypeId) {
          case 2:
            if(action=='filter') {
              this.commonService.emitMessageLayoutrefresh(filterData);
            } else {
              this.pageRefresh['access'] = 'thread';
              this.pageRefresh['action'] = 'search';
              this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
            }
            break;
          case 4:
            if(val == 'destroy') {
              this.docData.action = 'unsubscribe';
              this.commonService.emitDocumentListData(this.docData);
            } else {
              this.partData['searchVal'] = val;
              this.partData['accessFrom'] = this.pageAccess;
              this.files=[];
              this.getDocumentList(this.currentContentTypeId);
            }
            break;  
          case 7:
            this.kaData['searchVal'] = val;
            this.kaData['accessFrom'] = this.pageAccess;
            if(searchPageFilter) {
              this.kaData['filterOptions'] = searchPageFilter;
            } else {
              this.kaData['filterOptions']='';
            }
            this.kaData['searchVal'] = val;
            this.kaData['accessFrom'] = this.pageAccess;
            this.getKaList();
            break;  
          case 11:
            this.partData['searchVal'] = val;
            this.partData['accessFrom'] = this.pageAccess;
            searchPageFilter = JSON.parse(localStorage.getItem('searchPageFilter'));
            if(searchPageFilter) {
              this.partData['filterOptions'] = searchPageFilter;
            } else {
              this.partData['filterOptions']='';
            }
            this.partData['searchVal'] = val;
            this.partData['accessFrom'] = this.pageAccess;
            let destroyFlag = (val == 'destroy') ? true : false;
            this.partData['destroyFlag'] = destroyFlag;
            this.getPartList();
            break;
          case 16:
            this.sibData['searchVal'] = val;
            this.sibData['accessFrom'] = this.pageAccess;
            if(searchPageFilter) {
              this.sibData['filterOptions']=searchPageFilter;
            } else {
              this.sibData['filterOptions']='';
            }
            this.sibData['searchVal'] = val;
            this.sibData['accessFrom'] = this.pageAccess;
            this.getSibList();
            break;
          case 28:
            this.kbData['searchVal'] = val;
            this.kbData['accessFrom'] = this.pageAccess;
            if(searchPageFilter) {
              this.kbData['filterOptions']=searchPageFilter;
            } else {
              this.kbData['filterOptions']='';
            }
            this.kbData['searchVal'] = val;
            this.kbData['accessFrom'] = this.pageAccess;
            this.getKbList();
            break;
          case 53:
            setTimeout(() => {
              this.adasPageRef.loading = true;
              this.adasPageRef.itemStart = 0;
              this.adasPageRef.fileItems = [];
              this.adasPageRef.getAdasItems();  
            }, 500);
            break;  
        }
      },700);
    }
  }

  toggleAction(data) {
    console.log(data)
    let flag = data.action;
    let access = data.access;
    let toggleActionFlag = false;
    switch(access) {
      case 'info':
        this.docDetail = data.docDetail;  
        this.emptyFlag = false;
        this.rightPanel = !flag;
        this.docInfoFlag = !flag;
        break;
      case 'empty':
        this.docDetail = [];
        this.emptyFlag = true;
        this.rightPanel = !flag;
        this.docInfoFlag = !flag;
        break;
      default:
        toggleActionFlag = true;
        this.docDetail = [];
        break;  
    }
    if(toggleActionFlag) {
      this.docDetail = data.docDetail;
      this.toggleInfo(flag);
    }    
  }

  // Toogle Document Info
  toggleInfo(flag) {
    this.docData.action = 'toggle';
    this.docData.expandFlag = !flag;
    this.commonService.emitDocumentListData(this.docData);
    this.commonService.emitMessageLayoutChange(flag);
    setTimeout(() => {
      this.rightPanel = !flag;
      this.docInfoFlag = !flag;
      let docInfoData = {
        action: '',
        apiData: [],
        docDetail: [],
        loading: false,
        panelFlag: this.rightPanel
      };
      if(!this.rightPanel) {
        docInfoData.action = 'panel';
        this.commonService.emitDocumentPanelData(docInfoData);
      }
    }, 100);
  }

  applyFilter(filterData) {
    console.log(filterData)
    filterData['pageInfo'] = this.pageData;
    if(!this.solrApi) {
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.pageRefresh['expandFlag'] = this.expandFlag;
      this.pageRefresh["toggleFlag"] = this.expandFlag;
    } 
    this.itemOffset=0;
    let resetFlag = filterData.reset;
    if(!resetFlag) {
      if(!this.solrApi) {
        this.filterLoading = true;
      }
      this.filterActiveCount = 0;
      this.filterrecords = this.filterCheck(); 
      this.apiData["filterOptions"] = filterData;
      let viewType = this.thumbView ? "thumb" : "list";
      filterData['threadThumbInit'] = this.threadThumbInit;
      filterData['type']=this.threadTypesort;
      filterData["filterrecords"] = this.filterCheck();
      //this.commonService.emitMessageLayoutrefresh(filterData);
      if(this.solrApi) {
        setTimeout(() => {
          filterData["loadAction"] = '';
          console.log(filterData, this.filterRef);
          // Setup Filter Active Data
          this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
          this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
          this.filterRef.activeFilter = this.filterActiveCount > 0 ? true : false;
        }, 1500);
      } else {
        this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
        this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
        setTimeout(() => {
          this.filterLoading = false;
        }, 1000);
      }
      let searchValue=localStorage.getItem('searchValue');
      localStorage.setItem('searchPageFilter', JSON.stringify(filterData));
      if(searchValue) {
        this.applySearch('filter','',filterData);
      }      
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    let searchValue=localStorage.getItem('searchValue');
    if(searchValue && searchValue!='') {
      this.showSearchRes=true;
      this.applySearch('filter','','');
    }
    else {
      this.showSearchRes=false;
      this.emptyFlag = true;
      this.rightPanel = false;
      this.docInfoFlag = false;
    }
    if(this.solrApi){
      localStorage.removeItem(filterNames.search);
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.filterOptions["filterActive"] = false;
      this.currYear = moment().format("Y");
      setTimeout(() => {        
        this.getFilters('reset');  
      }, 500);
    } else {
      this.filterLoading = true;
      this.filterOptions["filterLoading"] = this.filterLoading;
      this.filterOptions['reset'] = true;
      this.filterOptions['filterActive'] = false;
      this.currYear = moment().format("Y");
      localStorage.removeItem('searchPageFilter');
    }
  }

  RealoadChatPageData(item:any){

        console.log(item.contentType+'---wsdata');
        this.outputContentTypedata=item.contentType;
        this.workstreamId = item.wsId;
    
        this.commonService.emitWorkstreamReceived(item);
        //alert(this.workstreamId);
        
      }

  taponContent(Id) {
    localStorage.removeItem('currentContentType');
    //alert(Id);
    this.rightPanel=false;
    this.docInfoFlag = false;
    this.emptyFlag=true;
    //alert(Id);
    let platformId= localStorage.getItem('platformId');
    //alert(Id);
    this.viewFlag = (Id == 2 || Id == 4) ? true : false;
    $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
    $(".view-type").removeClass("scroll-bg");
    if(Id==1)
    {
      var aurl = 'chat-page';
     // var aurl = '/workstream-chats';
      window.open(aurl, '_blank');
    }
    else if(Id==2)
    {
      let listView = localStorage.getItem("threadViewType");
      this.threadThumbView = (listView && listView == "thumb") ? true : false;
      this.threadInfo = {
        pageView: this.threadThumbView,
        threadThumbInit: this.threadThumbInit
      }
      //alert(Id);
      if(this.currentContentTypeId != Id) {

        this.pageRefresh['type']=localStorage.getItem('searchValue'); 
   
        this.pageRefresh['searchOption']=true;
        
       this.comefromOthersTab=true;
      
       
          this.currentContentTypeId=Id; 

      }
      else
      {
        //var aurl = 'threads';
       // window.open(aurl, '_blank');
      }
      
    }

   else if(platformId=='2')
    {
     if (Id == 7) {
      var aurl = '/mis/home/' + this.domainId + '/' + this.userId + '/2';
       //var aurl = '/mis/probing-questions';
       window.open(aurl, '_blank');
     } 
     if (Id == 8) {
       var aurl = '/knowledgearticles';
       window.open(aurl, '_blank');

     } 
     else  if (Id == 6) {
     // var aurl = '/mis/home/' + this.domainId + '/' + this.userId + '/4';
      //var aurl = '/mis/';
     // window.open(aurl, '_blank');
    }
    else if(Id==11)
    {
     


        this.currentContentTypeId=Id;
      this.partData['searchVal']='';
      if(localStorage.getItem('searchValue'))
      {
        this.partData['searchVal'] = localStorage.getItem('searchValue');
      }
      
        this.partData['accessFrom'] = this.pageAccess;
       
    
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
  
    if(searchPageFilter)
    {
      this.partData['filterOptions']=searchPageFilter;
    }
    else
    {
      this.partData['filterOptions']='';
    }
        this.partData['accessFrom'] = this.pageAccess;
        this.filterRef.filterLoading = true;
        if(this.solrApi) {
          this.getPartList();
        } else {
          this.getFilters();
        }
    }
    else if (Id == 4) {

    
        this.docLoading = true;
       this.initDoc(Id);
      
     
      //var aurl = '/documents';
     // var aurl = '/techinfopro';
     
    }    
      else if(Id == 16) {
        console.log(this.pageAccess);
        this.currentContentTypeId=Id;
        this.sibData['searchVal']='';
        let filter: any = '';
        if(localStorage.getItem('searchValue')) {
          this.sibData['searchVal'] = localStorage.getItem('searchValue');
        }
        this.sibData['accessFrom'] = this.pageAccess;
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
        if(searchPageFilter) {
          filter = searchPageFilter;
        }
        this.sibData['filterOptions'] = filter;
        this.sibData['sibType'] = '';
        this.sibData['accessFrom'] = this.pageAccess;
      }
      else if(Id == 28) {
        console.log(this.pageAccess);
        this.currentContentTypeId=Id;
        this.kbData['searchVal']='';
        let filter: any = '';
        if(localStorage.getItem('searchValue')) {
          this.kbData['searchVal'] = localStorage.getItem('searchValue');
        }
        this.kbData['accessFrom'] = this.pageAccess;
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
        if(searchPageFilter) {
          filter = searchPageFilter;
        }
        this.kbData['filterOptions'] = filter;
        this.kbData['type'] = '';
        this.kbData['accessFrom'] = this.pageAccess;
      }    
    }
    else if(platformId!='2')
    {
    
    if(Id==11)
    {
      this.currentContentTypeId=Id;
      this.partData['searchVal']='';
      if(localStorage.getItem('searchValue'))
      {
        this.partData['searchVal'] = localStorage.getItem('searchValue');
      }
      
        this.partData['accessFrom'] = this.pageAccess;
       
    
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
  
    if(searchPageFilter)
    {
      this.partData['filterOptions']=searchPageFilter;
    }
    else
    {
      this.partData['filterOptions']='';
    }
       
        this.partData['accessFrom'] = this.pageAccess;
        if(this.solrApi) {
          this.getPartList();
        } else {
          this.getFilters();
        }
       // this.getPartList();
     
    }
    else if (Id == 4) {
      this.docLoading = true;
     this.initDoc(Id);
    
    }
    else if(Id == 7) {
      console.log(this.pageAccess);
      this.currentContentTypeId=Id;
      this.kaData['searchVal']='';
      let filter: any = '';
      if(localStorage.getItem('searchValue')) {
        this.kaData['searchVal'] = localStorage.getItem('searchValue');
      }
      this.kaData['accessFrom'] = this.pageAccess;
      let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
      if(searchPageFilter) {
        filter = searchPageFilter;
      }
      this.kaData['filterOptions'] = filter;      
      this.kaData['accessFrom'] = this.pageAccess;
      this.applySearch('', this.kaData['searchVal'],'');
    } else if(Id == 53) {
      this.currentContentTypeId = Id;
    }


    
    }
   
   
    else
    {
      $('.img-contenttype').removeClass('active');
      $('.border-contenttype').removeClass('active');
      
      this.currentContentTypeId=Id;
      $('.img-contenttype'+Id+'').addClass('active');
     // $('.img-contenttype'+Id+'').attr('src','assets/images/workstreams-page/thread-w-active.svg');
      $('.border-contenttype'+Id+'').addClass('active');
    }
    
   

  }

  setScreenHeight() {
    let headerHeight = 50;
    console.log(this.bodyHeight, headerHeight);
    this.innerHeight = (this.bodyHeight - (headerHeight + 130));
    console.log(this.innerHeight)
  }
  
  initDoc(id) {
   // alert(id);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.itemOffset = 0;
    this.docLoading = true;
    this.getDocumentList(id);
  }
  

 getDocumentList(Id) {
  this.currentContentTypeId=Id;
  let groupsData=[];
  this.docDetail = [];
  if(this.workstreamId) {
    groupsData.push(this.workstreamId);
  }
 //
 
  if(!this.workstreamId) {
    this.workstreamId=localStorage.getItem('landing-page-workstream');
  }

  //let filterOptions=searchPageFilter;
  let searchVal=localStorage.getItem('searchValue');
  if(searchVal && searchVal!=null)
  {
    searchVal=searchVal;
  }
  else
  {
    searchVal='';
  }
  this.docData.action = this.pageAccess;
  
  this.docData['searchText'] = searchVal;
  let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));

  //let searchPageFilter=localStorage.getItem('searchPageFilter');
if(searchPageFilter)
{
this.docData['filterOptions']=searchPageFilter;
}
else
{
this.docData['filterOptions']=[];
}

 
// this.docData['filterOptions'] = searchPageFilter;
  
  setTimeout(() => {
    this.commonService.emitDocumentListData(this.docData);  
  }, 50);    
}

    
  submitSearch()
  {
    if(this.teamSystem){
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;  
        if(this.searchVal)
        {
          this.applySearch('', this.searchVal,'');          
        }
       
      }
    }

  }
  clearSearch()
  {
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
   //alert(11);
    localStorage.removeItem('searchValue');
    //this.ngOnInit();
    this.showSearchRes=false;
    this.emptyFlag = true;
    this.rightPanel = false;
    this.docInfoFlag = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
    localStorage.removeItem('loadMenuPageName');
  }
  onSearchChange(searchValue: string)
  {
    
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;   
    this.searchVal = searchValue;
    if (searchValue.length == 0) {
      this.submitted = false;
      this.clearSearch();
    }
    else{
      this.searchBgFlag = true;
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.searchTick = true ;
      this.searchClose = this.searchTick;
    }   
  }

  onSubmit() {
    if(this.teamSystem)
    {
     
      console.log(this.searchVal)
      this.searchForm.value.search_keyword = this.searchVal;
      this.submitted = true;
      if (this.searchForm.invalid) {
        return;
      } else {
        this.searchVal = (this.searchBgFlag) ? localStorage.getItem('searchValue') : this.searchForm.value.search_keyword;
        this.searchVal = this.searchForm.value.search_keyword;
       // this.submitSearch();
       //localStorage.setItem('searchValue',this.searchVal);
       this.ngOnInit();
      }
    }
    
  }
/*
  getPartList() {
    setTimeout(() => {
      this.commonService.emitPartListData(this.partData);  
    }, 50);    
  }
*/
  getPartList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitPartListData(this.partData);  
    }, 50);    
  }

  getSibList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitSibListData(this.sibData);  
    }, 50);    
  }
  getKaList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitKnowledgeListData(this.kaData);  
    }, 50);    
  }
  getKbList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitKnowledgeBaseListData(this.kbData);  
    }, 50);    
  }
  

  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag; 
    this.pageRefresh['toggleFlag']=toggleFlag; 
    this.commonService.emitMessageLayoutChange(toggleFlag);
    
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    localStorage.removeItem('searchValue');
  }

  backPage(){
    this.router.navigate(["threads"]);   
  }

  searchResultData(sdata) {
    console.log(sdata, this.getcontentTypesArr, this.currentContentTypeId, this.filterRef)
    let menuIndex, slug;
    let data = sdata.type;
    if(this.filterRef) {
      switch(this.currentContentTypeId) {
        case 2:
        case 4:
        case 7:
        case 53:  
        case 11:
          let makeVal = [];
          let modelVal = [];
          let errorCodeVal = [];
          this.filterRef.models = modelVal;
          this.filterRef.errorCodeArr = errorCodeVal;
          let makeValidFlag = true, modelValidFlag = true, errcodeValidFlag = true;
          sdata.make.forEach(mkItem => {
            if(mkItem != 'NA') {
              makeVal.push(mkItem.value);
            }
          });
          
          sdata.errorCodes.forEach(errItem => {
            errorCodeVal.push({id: errItem.value, name: errItem.value});
          });
          console.log(this.filterRef)
          setTimeout(() => {
            console.log(this.filterRef)
            if(this.filterRef) {
              this.filterRef.makes = makeVal;
              this.filterRef.filteredMakes = makeVal;
              let filterMake = this.filterRef.make;
              if(Array.isArray(filterMake)) {
                filterMake = (filterMake.length > 0) ? filterMake[0] : '';           
              }
              console.log(filterMake, makeVal, makeVal.includes(filterMake))
              if(filterMake != '') {
                sdata.model.forEach(mItem => {
                  let mval = mItem.value;
                  if(mval != 'NA') {
                    modelVal.push({id: mItem.value, name: mItem.value});
                  }              
                });
                makeValidFlag = makeVal.includes(filterMake);
                if(!makeValidFlag) {
                  this.filterRef.makes.push(filterMake)
                }
                this.filterRef.modelLoading = true;
                this.filterRef.models = modelVal;
                modelVal.forEach(item => {
                  let modelValue = item.name;
                  let fmindex = this.filterRef.filteredModels.findIndex(option => option == modelValue);
                  console.log(fmindex)
                  let mindex = this.filterRef.models.findIndex(option => option.name == modelValue);
                  if(fmindex < 0) {
                    modelValidFlag = false;
                    if(mindex < 0) {
                      this.filterRef.models.push(item);
                    }
                  }
                });
                if(modelVal.length == 0 && this.filterRef.filteredModels.length > 0) {
                  modelValidFlag = false;
                  this.filterRef.filteredModels.forEach(mitem => {
                    let mindex = this.filterRef.models.findIndex(option => option.name == mitem);
                    if(mindex < 0) {
                      this.filterRef.models.push({
                        id: mitem,
                        name: mitem
                      });
                    }
                  });            
                }
                if(this.filterRef.filteredModels.length == 0) {
                  modelValidFlag = true;
                }  
                setTimeout(() => {
                  this.filterRef.modelLoading = false;
                }, 50);
              }        
              
              errorCodeVal.forEach(item => {
                let errValue = item.value;
                let efindex = this.filterRef.filteredData["errorCode"].findIndex(option => option.name == errValue);
                let eindex = this.filterRef.errorCodeArr.findIndex(option => option.name == errValue);
                if(efindex < 0) {
                  errcodeValidFlag = false;
                  if(eindex < 0) {
                    this.filterRef.errorCodeArr.push(item);
                  }
                }
              });
              if(errorCodeVal.length == 0 && (this.filterRef.filteredData["errorCode"] && this.filterRef.filteredData["errorCode"].length > 0)) {
                errcodeValidFlag = false;
                this.filterRef.filteredData["errorCode"].forEach(eitem => {
                  let eindex = this.filterRef.errorCodeArr.findIndex(option => option.name == eitem);
                  if(eindex < 0) {
                    this.filterRef.errorCodeArr.push({
                      id: eitem,
                      name: eitem
                    });
                  }
                });
              }
              if(this.filterRef.filteredData["errorCode"] && this.filterRef.filteredData["errorCode"].length == 0) {
                errcodeValidFlag = true;
              }
              this.filterRef.errorCodeArr = this.getUniqueListBy(this.filterRef.errorCodeArr, 'id');
              setTimeout(() => {
                this.filterRef.makeValidFlag = makeValidFlag;
                this.filterRef.modelValidFlag = modelValidFlag;
                this.filterRef.errcodeValidFlag = errcodeValidFlag;
              }, 100);
              console.log(this.filterRef)
            }
          }, 750);        
          break;  
      }
    }
    
    data.forEach(item => {
      console.log(item)
      let val = parseInt(item.value);
      let count = item.count;
      let countFalg = true;
      switch (val) {
        case 1:
          slug = RedirectionPage.Threads;
          break;
        case 2:
          slug = RedirectionPage.Documents;
          break;
        case 4:
          slug = RedirectionPage.Parts;
          break;
        case 6:
          slug = RedirectionPage.KnowledgeArticles;          
          break;
        case 8:
          slug = RedirectionPage.AdasProcedure;
          break;  
        default:
          countFalg = false;  
      }
      if(countFalg) {
        menuIndex = this.getcontentTypesArr.findIndex(option => option.slug == slug);
        console.log(menuIndex)
        if(menuIndex >= 0) {
          this.getcontentTypesArr[menuIndex].searchCount = count;
        }
      }
    });
  }

  ngOnDestroy() {
    this.bodyElem.classList.removeClass(this.bodyClass1);
    this.bodyElem.classList.removeClass(this.bodyClass2);
    localStorage.removeItem('loadMenuPageName');
    localStorage.removeItem('currentContentType');
  }

  getQueryParamFromURL(search) {
    const results = new RegExp('[\\?&]' + search + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }
  getQueryParamFromURLParams(searchParams) {
    const results = new RegExp('[\\?&]' + searchParams + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }

  changeView() {
    let action='view', access, viewType;
    if(this.currentContentTypeId == 2){
      access = 'threads';
    }
    if(this.currentContentTypeId == 4){
      access = 'documents';
    } 
    switch(this.currentContentTypeId) {
      case 2:
      case 4:
        access = 'threads';
        this.threadThumbView = this.threadThumbView ? false : true;
        viewType = this.threadThumbView ? "thumb" : "list"; 
        this.threadThumbInit = (this.threadThumbView) ? this.threadThumbInit++ : this.threadThumbInit;
        this.threadInfo = {
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit
        };
        let loadThumb = false;
        let viewData = {
          action,
          threadViewType: viewType,
          loadThumb,
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit,
          thumbView:viewType == "thumb" ? true : false
        }
        if(this.currentContentTypeId == 4){
          this.commonService.emitDocumentListData(viewData);
        }
        else{
          this.commonService.emitMessageLayoutrefresh(viewData);
        }
        break;
    }
    let apiCall = (this.CBADomian) ? true : false;
    this.commonService.updateLsitView(access, viewType, apiCall);
  }

  filterCallback(data) {
    if(!this.solrApi) {
      return false;
    }
    console.log(data)
    this.filterRef = data;
    let action = data.actionFilter;
    switch(action) {
      case 'filter':
        this.filterRef.activeFilter = true;
        let getFilteredValues = JSON.parse(
          localStorage.getItem(filterNames.search)
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

   // if any one filter is ON
   filterCheck(){
    this.filterrecords = false;
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }   
    console.log("**********************");
    console.log(this.filterrecords);
    console.log("**********************");   
    return this.filterrecords;
  }

  getFilters(action = '') {
    this.setScreenHeight();
    this.apiData["onload"] = true;
    this.apiData["filterOptions"] = {};
    this.threadFilterOptions = this.apiData["onload"];
    this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
    this.apiData["filterOptions"]["pageInfo"] = this.pageData;
    let filterData = this.commonService.setfilterData(this.pageAccess);
    this.apiData["filterOptions"] = filterData;
    filterData.action = 'init';
    this.commonService.emitMessageLayoutrefresh(
      filterData
    );
      this.apiData['groupId'] = this.groupId;
      this.apiData['mediaId'] = 0;
      // Get Filter Widgets
      this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
      
      this.filterInterval = setInterval(()=>{
      let filterWidget = localStorage.getItem('filterWidget');
      let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
      if(filterWidget) {
        console.log(this.filterOptions)
        this.filterOptions = filterWidgetData.filterOptions;
        this.apiData = filterWidgetData.apiData;
        this.threadFilterOptions=this.apiData['filterOptions'];
        this.apiData['onload']=true;
        this.threadFilterOptions = this.apiData['onload'];
        this.filterActiveCount = filterWidgetData.filterActiveCount;
        this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
        this.apiData["filterOptions"] = this.apiData["filterOptions"];
        this.apiData["filterOptions"]["action"] = action; 
        if(!this.solrApi) {
          this.commonService.emitMessageLayoutrefresh(
            this.apiData["filterOptions"]
          );
        }
        let resetTimeout = (action != 'reset') ? 0 : 1500;
        setTimeout(() => {
          this.filterOptions['filterExpand'] = this.expandFlag;
          this.filterLoading = false;
          this.filterOptions["filterLoading"] = this.filterLoading;  
        }, resetTimeout);
        clearInterval(this.filterInterval);
        localStorage.removeItem("filterWidget");
        localStorage.removeItem("filterData");
      }
    },50);
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  threadHeaderAction(data) {
    console.log(data)
    let action = data.action;
    switch(action) {
      case 'search':
        this.filterItems = [];
        this.facetsDatatems = [];
        let keyword = data.keyword;
        this.searchVal = keyword;
        this.showSearchRes = (keyword == '' && !this.collabticFixes) ? false : this.showSearchRes;
        this.headerData['searchValue'] = keyword;
        if(keyword == '' && !this.collabticFixes) {
          localStorage.removeItem('searchValue');
          this.headerData = {
            'access': this.pageAccess,
            'pageName': this.pageAccess,
            'showSearchRes': this.showSearchRes,
            'profile': false,
            'welcomeProfile': false,
            'search': true,
            'searchBg': false,
            'searchValue': this.searchVal
          };
          this.headerFlag = false;
          setTimeout(() => {
            this.headerFlag = true;
          }, 100);
        } else {
          let itemOffset = this.fixThreadRef.threadRecentRef.itemOffset;
          let itemKeyword = this.fixThreadRef.threadRecentRef.searchKeyword;
          let searchFlag = (itemKeyword == keyword) ? false : true;
          searchFlag = (data.filterFlag) ? true : searchFlag;
          console.log(searchFlag)
          if(searchFlag) {
            this.fixThreadRef.threadRecentRef.activeThread = 0;
            console.log(this.fixThreadRef)
            let pinnedUser = [this.userId];
            this.filterItems["pinedUsers"] = (data.pinStatus == 1) ? pinnedUser : [];
            let dataFilter = data.filter[0];
            Object.keys(dataFilter).forEach(key => {
              let filterVal = dataFilter[key];
              this.filterItems[key] = filterVal;
            });

            this.fixThreadRef.searchValue = keyword;
            this.fixThreadRef.loading = true;
            if(this.fixThreadRef.threadRecentRef.itemTotal == 0) {
              this.fixThreadRef.emptyListFlag = false;
            }
            this.fixThreadRef.recentFlag = false;
            setTimeout(() => {
              this.fixThreadRef.recentFlag = true;              
            }, 100);
          }
        }        
        break;
      case 'load-thread':
        let threadId = data.threadId;
        this.fixThreadRef.threadId = threadId;
        setTimeout(() => {
          this.fixThreadRef.getThreadInfo();
          this.fixThreadRef.detailViewRef.searchLoading = false;
          let tindex = this.fixThreadRef.threadRecentRef.threadListArray.findIndex(option => option.threadId == threadId);
          if(tindex < 0) {
            let pushthread = '1';
            let limit:any = 1;
            this.fixThreadRef.threadRecentRef.loadThreadsPageSolr(pushthread,limit,threadId);
          } else {
            this.fixThreadRef.threadRecentRef.setupThreadActive(threadId);
          }
        }, 100);
        break;
      case 'feedback':
        this.setupFeedbackForm();
        setTimeout(() => {
          this.feedbackFormFlag = true;  
        }, 100);        
        break;
    }
  }

  detailHeaderCallback(data) {
    console.log(data)
    this.threadDetailHeaderRef = data;
  }

  fixThreadCallback(data) {
    console.log(data)
    this.fixThreadRef = data;
    if(!this.fixThreadRef.loading) {
      if(this.threadDetailHeaderRef.searchFilterRef) {
        let itemTotal = this.fixThreadRef.threadRecentRef.itemTotal;
        let sfr = this.threadDetailHeaderRef.searchFilterRef;
        sfr.fixesCount = itemTotal;
        this.feedbackHeight = this.fixThreadRef.innerHeight;
        setTimeout(() => {
          this.setupSearchFilter();  
        }, 500);
      }
    }
  }

  setupSearchFilter() {
    let sfr = this.threadDetailHeaderRef.searchFilterRef;
    let facets = this.fixThreadRef.threadRecentRef.facetsData;
    console.log(facets)
    if(facets) {
      let clearFilterFlag = false;
      sfr.oemDisable = false;
      sfr.makeDisable = false;
      sfr.modelDisable = false;
      sfr.yearDisable = false;
      sfr.oemList = [];
      sfr.makeList = [];
      sfr.modelList = [];
      sfr.yearList = [];
      facets.manufacturer.forEach(oitem => {
        let oemVal = oitem.value;
        sfr.oemList.push({id: oemVal, name: oemVal});
        if(facets.manufacturer.length == 1) {
          clearFilterFlag = true;
          this.fixThreadRef.filterItems['manufacturer'] = oemVal;
          sfr.oemVal = oemVal;
          sfr.searchFilter[0]['manufacturer'] = oemVal;
        }
      });
      facets.make.forEach(mkItem => {
        let makeVal = mkItem.value;
        sfr.makeList.push({id: makeVal, name: makeVal});
        if(facets.make.length == 1) {
          clearFilterFlag = true;
          this.fixThreadRef.filterItems['make'] = makeVal;
          sfr.makeVal = makeVal;
          sfr.searchFilter[0]['make'] = makeVal;
        }
      });
      facets.model.forEach(mitem => {
        let modelVal = mitem.value;
        sfr.modelList.push({id: modelVal, name: modelVal});
        if(facets.model.length == 1) {
          clearFilterFlag = true;
          this.fixThreadRef.filterItems['model'] = [modelVal];
          sfr.modelVal = modelVal;
          sfr.searchFilter[0]['model'] = [modelVal];
        }
      });
      facets.year.forEach(yitem => {
        let yearVal = yitem.value;
        sfr.yearList.unshift({id: yearVal, name: yearVal});
        if(facets.year.length == 1) {
          clearFilterFlag = true;
          this.fixThreadRef.filterItems['year'] = [yearVal];
          sfr.yearVal = yearVal;
          sfr.searchFilter[0]['year'] = [yearVal];
        }
      });
      if(clearFilterFlag) {
        sfr.clearFlag = true;
      }
    }
  }

  closeSidebar(action) {
    switch (action) {
      case 'feedback':
        this.feedbackFormFlag = false;
        break;
    }    
  }

  getFeedbackFields() {
    let apiData = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId
    };
    this.commonService.getFeedbackFields(apiData).subscribe((response) => {
      this.feedbackFields = response.data;
      setTimeout(() => {
        this.setupFeedbackForm();  
      }, 100);      
    });        
  }

  setupFeedbackForm() {
    this.feedbackLoading = false;
    this.feedbackFormValid = false;
    this.feedbackFormSubmit = false;
    this.feedbackSucess = "";
    this.feedbackFields.forEach((fItem, tfIndex) => {
      let required = fItem.isRequired;
      let fieldName = fItem.fieldName;
      let val = '';
      fItem.selectedValue = '';
      if(fItem.fieldType == 'radio') {
        fItem.selectionItems.forEach(sitem => {
          sitem.isChecked = 0;
        });
      }
      this.feedbackForm.addControl(fieldName, new FormControl(val));
      this.setFormValidation(required, fieldName);
    });
    setTimeout(() => {
      console.log(this.feedbackForm.controls)
    }, 1500);
  }

  // Set Form Validation
  setFormValidation(flag, field) {
    if(flag) {
      this.feedbackForm.controls[field].setValidators([Validators.required]);
    }
  }

  onEditorChange(field, item, { editor }: ChangeEvent) {
    let value = editor.getData();
    console.log(value)
    item.selectedValue = value;
    item.valid = (value?.length > 0 || !item.isRequired) ? true : false;
  }

  onChange(field, item, event, optIndex = -1) {
    console.log(field, item, event, optIndex);
    let value = (item.fieldType == 'radio') ? event.target.checked : event;
    if(item.fieldType == 'radio') {
      item.selectionItems.forEach((sitem, sindex) => {
        sitem.isChecked = (sindex == optIndex) ? true : false;
        if(sindex == optIndex) {
          value = sitem.id;
        }
      });
    }
    item.selectedValue = value;
    item.valid = (value?.length > 0 || !item.isRequired) ? true : false;
  }

  saveData() {
    let submitFlag = true;
    if(this.feedbackFormValid) {
      submitFlag = false;
      return false;
    }
    this.feedbackFormSubmit = true;
    this.feedbackFields.forEach(feedbackField => {
      feedbackField.valid = (feedbackField.selectedValue != '') ? true : feedbackField.valid;
      if(feedbackField.isRequired && !feedbackField.valid) {
        submitFlag = false;
        return false;
      }      
    });
    if(submitFlag) {
      let feedbackFieldData: any = [];
      this.feedbackFields.forEach(fItem => {
        let fieldId = fItem.fieldId;
        let fieldValue:any = fItem.selectedValue.toString();
        feedbackFieldData.push({fieldId, fieldValue})
      });
      console.log(feedbackFieldData);
      let formData = new FormData();
      formData.append('apikey', Constant.ApiKey);
      formData.append('domainId', this.domainId);
      formData.append('userId', this.userId);
      formData.append('feedbackValues', JSON.stringify(feedbackFieldData));
      formData.forEach((value,key) => {
        console.log(key+" "+value)
        return false
      }); 
      this.feedbackLoading = true;
      this.feedbackFormValid = true;
      this.commonService.manageFeedback(formData).subscribe((response) => {
        console.log(response)
        this.feedbackLoading = false;
        this.feedbackFormFlag = false;
        this.feedbackSucess = response.message;        
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = this.feedbackSucess;
        setTimeout(() => {
          this.feedbackLoading = false;
          this.feedbackFormValid = false;
          this.feedbackFormSubmit = false;
          this.feedbackSucess = "";
          msgModalRef.dismiss('Cross click');
        }, 2000);
      });
    }
  }

  dropEvent(event,tfData) {
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      // this.onFileDropped.emit(files)
      this.uploadDataEvebt(files,tfData);
      //console.log(files);
    }
  }

  uploadDataEvebt(event,tfData) {
    console.log(event);
    if (this.validateFile(event)) {
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        let filedata = new FileData();
        filedata.file = element;
        filedata.fileName = element.name;
        filedata.filesize = element.size;
        filedata.fileType = element.type;
        filedata.attachmentType = this.getAttachmentType(element.type);
        let lastDot = element.name.lastIndexOf('.');
        filedata.fileCaption = element.name;
        var reader = new FileReader();
        //this.imagePath = files;
        reader.readAsDataURL(element);
        reader.onload = (_event) => {
          //  attachmentLocalUrl = reader.result;
          filedata.localurl = _event.target.result;
          this.attachmentTouploadList.push(filedata);
          console.log(this.attachmentTouploadList);
          console.log(tfData,filedata.fileName);
          const formData: FormData = new FormData();
          formData.append('upload', filedata.file);
          this.httpClient.post<any>(this.apiUrl.uploadURL, formData).subscribe(res => {
            if(res.url) {
              let linkadded='<p><a href="'+res.url+'" target="_blank">'+filedata.fileName+'</a></p>';
              this.editorProgressUpload=0;
            }
            console.log(res.url);
          });
        };
      }
    }
  }

  validateFile(files: Array<any>): boolean {
    return true;
  }

  getAttachmentType(filetype) {
    if (filetype.indexOf('image') !== -1) {
      return AttachmentType.image;
    }
    if (filetype.indexOf('video') !== -1) {
      return AttachmentType.video;
    }
    if (filetype.indexOf('audio') !== -1) {
      return AttachmentType.voice;
    }
    return AttachmentType.other;
  }

  adasCallback(data) {
    console.log(data)
    this.adasPageRef = data;
    this.viewFlag = (this.adasPageRef.view == 4) ? true : false;
  }
}

export class FileData {
  file: any;
  fileName: string;
  filenamewithoutextension: string;
  filesize: number;
  fileType: string;
  localurl: any;
  progress: number;
  uploadStatus: number;
  fileCaption: string;
  attachmentEditStatus: boolean;
  attachmentType: number;
}