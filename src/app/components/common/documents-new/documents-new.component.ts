import { Component, OnInit, Input,OnDestroy, ViewChild, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { CommonService } from '../../../services/common/common.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import * as moment from 'moment';
import { ApiService } from '../../../services/api/api.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { Subscription } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import { NgxMasonryComponent } from "ngx-masonry";
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { NavigationStart, Router } from "@angular/router";
import { pageTitle,PageTitleText, Constant, filterNames, RedirectionPage,PlatFormType } from 'src/app/common/constant/constant';
import { Title } from '@angular/platform-browser';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { PlatformLocation } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ViewDocumentDetailComponent } from 'src/app/components/common/view-document-detail/view-document-detail.component';

@Component({
  selector: 'app-documents-new',
  templateUrl: './documents-new.component.html',
  styleUrls: ['./documents-new.component.scss'],
  styles: [
    `:host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: 0px;
      }

      @media screen and (max-width: 64em) {
          :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
              top: 0px;
          }
      }
      .masonry-item { width: 210px; }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }`
  ]
})
export class DocumentsNewComponent implements OnInit, OnDestroy {
  @ViewChild('top',{static: false}) top: ElementRef;
  activeState: boolean[] = [true, false, false];
  @Output() presetActionEmit: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() accessFrom: string = "documents";
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Output() callback: EventEmitter<DocumentsNewComponent> = new EventEmitter();
  @Input() tspageInfo: any = [];

  public bodyElem;
  public bodyHeight: number;
  public priorityIndexValue='';
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  public accessCheck : string = '0';
  public docId: number = 0;
  public tvsFlag: boolean = false;
  public innerHeight: number = window.innerHeight - 220;
  public docRowHeight: number = 0;
  public innerRecentViewWidth: number = 0;
  public thumbView: boolean = true;
  public displayNoRecords: boolean = false;
  public loading: boolean = true;
  public fileLoader: boolean = false;
  public showDocuments:boolean=false;
  public contentLoading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public fromSearchpage:string ='';
  public searchText:string ='';
  public contentTypeValue:number = 4;
  public displayNoRecordsShow: number = 0;
  public emptyFlag: boolean = false;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public listScroll: boolean = false;
  public scrollPos: number = 0;
  public docScroll: boolean = false;
  public partType: string = "";
  public searchVal: string = '';
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public documentViewOption:string =localStorage.getItem('documentViewOption');
  public documentMfgIdOption:string =localStorage.getItem('documentMfgIdOption');
  public domainId;
  public countryId;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public groupInfo: any = [];
  public docListApiCall;
  public docApiCall;
  public docWsApiCall;
  recentViewedDocuments: any;
  recentUploadedDocuments:any = [];
  user: any;
  public userId: any;
  public assetPartPath: string = 'assets/images/documents/';
  public chevronImg: string = `${this.assetPartPath}chevron-dark.png`;
  public apiData: any = [];
  public otherTechInfoFlag : boolean = false;
  public galleryFlag:boolean = true;
  public singleClick = false;
  public doubleClick = false;
  public docAction: string = "view";
  roleId: any;
  mfg: any = [];
  files:any= [];
  folders:any = [];
  folderLists: any = [];
  subFolderLists: any = [];
  mfgInfo: any = [];
  folderInfo: any = [];
  otherTechInfo: any = [];
  subFolderInfo: any = [];
  subFolderCount: number = 0;
  public filterOptions: any = [];
  public documentIdArrayInfo: any=[];
  public docAPiCount:any='';
  scrollCount: number = 0;
  lastFilesCount: number = 0;
  lastFoldersCount: number = 0;
  public viewTxt: string = "viewed";
  public uploadTxt: string = "uploaded";
  public recentTxt: string = "recently";
  public docInfoData: any = {};
  public mfgId: any = 0;
  public otherTechInfoId: any = 0;
  public folderId: any = '';
  public subFolderId: any = '';
  public pinFlag: boolean = false;
  public loadMainView: boolean = false;
  public mainView: boolean = localStorage.getItem('platformId') == '3' ? false : true;
  public folderView: boolean = false;
  public subFolderView: boolean = false;
  public mfgView: boolean = false;
  public fileView: boolean = false;
  public folderFlag: boolean = false;
  public filesFlag: boolean = false;
  public panelFlag: boolean = false;
  public filterFlag: boolean = true;
  public tabFlag: boolean = false;
  public tab: string = this.viewTxt;
  
  public pushFolders: any = [];
  public docApiData: any = [];
  public recentTabs: any = [{
    control: this.viewTxt,
    href: `#${this.viewTxt}`,
    id: `${this.viewTxt}-tab`,
    selected: false,
    title: `${this.recentTxt} ${this.viewTxt}`,
    toggle: 'tab'
  },
  {
    control: this.uploadTxt,
    href: `#${this.uploadTxt}`,
    id: `${this.uploadTxt}-tab`,
    selected: false,
    title: `${this.recentTxt} ${this.uploadTxt}`,
    toggle: 'tab'
  }]; 
  public loadDataEvent: boolean=false;
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public opacityFlag: boolean = false;
  public loadAction: string = '';
  public threadsAPIcall;
  public doconCloseAPI;
  public currentWS: any = 0;
  public approvalEnableDomainFlag: boolean = false;
  public searchParams: string = '';
  public collabticDomain: boolean = false;
  public CBADomain: boolean = false;
  public solrApi: boolean = false;
  public industryType: any = "";
  public contentType: number = 47;
  public displayOrder: number = 0;
  public pageAccess: string = 'documents';

  public items = [];
  public mainFolders = [];
  public secHeight: any = 0;
  public listHeight: any = 0;

  subscription: Subscription = new Subscription();
 
  public updateMasonryLayout: boolean = false;
  public domainAccess: boolean = true;
 
  public updateTxt: string = "Update Image"; 
  
  public currentDocAction: string = '';
  public currentFolderName: string = '';
  public currentFolderTypeId: string = '';
  public currentFolderIdArr : any = [];

  public folderType1Id: string = '';
  public folderType1Name: string = 'Folders'; 
  public folderType1Action: string = 'allfolder'; 
  public folderType2Id: string = '';
  public folderType2Name: string = '';
  public folderType2Action: string = '';
  public folderType3Id: string = '';
  public folderType3Name: string = '';
  public folderType3Action: string = '';
  public folderType4Id: string = '';
  public folderType4Name: string = '';
  public folderType4Action: string = '';

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if(this.currentDocAction == 'files' || this.currentDocAction == 'makefile' || this.currentDocAction == 'mfgfolderfile' || this.currentDocAction == 'mfgfile'){ 
      let isNearBottom = this.documentationService.isUserNearBottom(event);
      let isBottomVal:any = this.documentationService.isUserNearBottomVal(event);
      let threshold = 80;
      this.scrollTop = event.target.scrollTop;
      if( (this.scrollTop > this.lastScrollTop && this.scrollInit > 0 )
        && (this.currentDocAction == 'files' || this.currentDocAction == 'makefile' || this.currentDocAction == 'mfgfolderfile' || this.currentDocAction == 'mfgfile')) {
        console.log(this.itemTotal, this.itemLength)
        console.log(this.scrollCallback, isNearBottom)
        if (isNearBottom && this.scrollCallback && this.itemTotal > this.itemLength) { // May be check with files count also
          this.scrollCallback = false;
          this.itemOffset += this.itemLimit;
          this.lazyLoading = true;
          this.loadDataEvent = true; 
          this.scrollPos = parseInt(isBottomVal)/2;
          this.docScroll = true;        
          this.documentsList(this.currentDocAction);
        }
      }
      this.lastScrollTop = this.scrollTop+1;
    }
  }

  constructor(
    private router: Router,
    private commonApi: CommonService,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService,
    private threadPostService: ThreadPostService,
    private sanitizer: DomSanitizer,
    private documentationService: DocumentationService,
    public apiUrl: ApiService,
    private titleService: Title,
    private baseSerivce: BaseService,
    private LandingpagewidgetsAPI: LandingpageService,
    private location: PlatformLocation,
    private httpClient: HttpClient,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - Documents');
   }

  ngOnInit(): void {
    
  this.bodyElem = document.getElementsByTagName('body')[0];
  window.addEventListener('scroll', this.scroll, true); 
  let listView = localStorage.getItem("threadViewType");
  this.thumbView = (listView && listView == "thumb") ? true : false;

	this.user = this.authenticationService.userValue;
	this.domainId = this.user.domain_id;
	this.userId = this.user.Userid;
	this.countryId = localStorage.getItem('countryId');
  
  let platformIdInfo: any = localStorage.getItem('platformId');
  this.CBADomain = (platformIdInfo == PlatFormType.CbaForum) ? true : false;
  this.loading = this.CBADomain ? false : true;
  
  let platformId: any = localStorage.getItem('platformId');
  this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
  this.tvsFlag = (platformId == 2 && (this.domainId == 52 || this.domainId == 82)) ? true : false;
  
  localStorage.setItem('currentContentType', '4');

  
this.industryType = this.commonApi.getIndustryType(); 

this.checkAccessLevel();

// Remove when silent push enabled
let pageIndex = pageTitle.findIndex(option => option.slug == RedirectionPage.Documents);
let navEditText = pageTitle[pageIndex].navEdit;
localStorage.removeItem(navEditText);


this.docApiCall = this.commonApi.documentApiCallSubject.subscribe(docsData => {
  console.log(docsData)
  let action = docsData['action'];
  this.titleService.setTitle(localStorage.getItem('platformName')+' - Workstreams');
  this.displayNoRecords = false;
  let listView = localStorage.getItem("threadViewType");
  this.thumbView = (listView && listView == "thumb") ? true : false;
  this.loading = true;
  this.accessFrom = action;   
  this.mainView = false;
  this.itemOffset = 0;    
  this.currentDocAction = 'files';
  this.currentFolderName = '';
  this.currentFolderTypeId = '';
  this.currentFolderIdArr=[];
  this.searchText = docsData['searchVal']; 
  this.groupInfo = [JSON.stringify(docsData['filterOptions'].workstream)];
  this.documentsList(this.currentDocAction); 
  this.bodyHeight = window.innerHeight;
  this.setScreenHeight();  
  setTimeout(() => {
    this.callback.emit(this);
  }, 500);
});

this.docWsApiCall = this.commonApi.documentWSApiCallSubject.subscribe(docsData => {      
  console.log(docsData)
  let action = docsData['action'];
  if(action == 'unsubscribe') {
    this.docWsApiCall.unsubscribe();
    return false;          
  } else {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - Workstreams');
    this.items=[];
    //this.thumbView = docsData['thumbView'];
    let listView = localStorage.getItem("threadViewType");
    this.thumbView = (listView && listView == "thumb") ? true : false;
    setTimeout(() => {      
      this.searchCallBack(docsData);         
    }, 1);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }  
  setTimeout(() => {
    this.callback.emit(this);
  }, 500);
});


this.docListApiCall = this.commonApi.documentListDataReceivedSubject.subscribe((docsData: any) => {
    console.log(docsData)
    let action =  docsData.action;    
    switch (action) {
      case 'view':
        this.setScreenHeight();
        this.thumbView = docsData.thumbView;
        if(this.thumbView){
          this.listScroll = false;
          let ftimeout:any = 500;
          this.updateThumbLayout(ftimeout);
        }        
       break;
       case 'search':   
       this.items=[]; 
       //this.thumbView = docsData['thumbView'];
        let listView = localStorage.getItem("threadViewType");
        this.thumbView = (listView && listView == "thumb") ? true : false;        
        setTimeout(() => {   
          this.searchCallBack(docsData);              
        }, 1);
        break;   
       case 'filter': 
        this.itemOffset = 0;
        this.groupInfo = docsData['filterOptions'].workstream?.length>0 ? JSON.stringify(docsData['filterOptions'].workstream) : [];
        this.documentsList(this.currentDocAction);
        break;  
       case 'folder-creation':
        this.itemOffset = 0;
        this.documentsList(this.currentDocAction);
       case 'doc-push':
        break;
       case 'silentDelete':
        if(this.mainView){
          let rvIndex = this.recentViewedDocuments.findIndex(option => option.resourceID ==  docsData['dataId']);
          if(rvIndex >= 0) {
            this.recentViewedDocuments.splice(rvIndex, 1);
          }
          let ruIndex = this.recentUploadedDocuments.findIndex(option => option.resourceID ==  docsData['dataId']);
          if(ruIndex >= 0) {
            this.recentViewedDocuments.splice(rvIndex, 1);
          }
          this.currentDocAction = 'allfolder';
          this.currentFolderName = '';
          this.currentFolderTypeId = '';
          this.currentFolderIdArr = [];          
          this.groupInfo = docsData['filterOptions'].workstream?.length>0 ? JSON.stringify(docsData['filterOptions'].workstream) : [];
          this.documentsList('allfolder');
          if(this.recentTabs[0].selected){
            this.getdocumentForTab(1, 0); 
          }
          else{
            this.getdocumentForTab(0,1); 
          }                      
        }
        else{
          let docIndex = this.items.findIndex(option => option.threadId === docsData['dataId']);
          this.items.splice(docIndex, 1);
          console.log(this.items)
          console.log(docsData['dataId'])
          if(this.thumbView){
            let ftimeout:any = 500;
            this.updateThumbLayout(ftimeout);   
          }                 
          console.log(docsData['dataId'], docIndex, this.items);
          this.itemTotal -= 1;
          this.itemLength -= 1; 
        }
        break; 
       case 'get': 
        if(this.CBADomain){
          this.mainView = false;
          this.currentDocAction = 'mfgfolder';
          this.currentFolderName = 'Mfg/Models';
          this.currentFolderTypeId = '5';
          this.currentFolderIdArr = [];
          this.itemOffset = 0;
          this.groupInfo = docsData['filterOptions'].workstream?.length>0 ? JSON.stringify(docsData['filterOptions'].workstream) : [];
          this.documentsList('mfgfolder');
        }
        else{
          this.mainView = true;      
          if(this.mainView){
            this.currentDocAction = 'allfolder';
            this.currentFolderName = '';
            this.currentFolderTypeId = '';
            this.currentFolderIdArr = [];
            this.itemOffset = 0;
            this.groupInfo = docsData['filterOptions'].workstream?.length>0 ? JSON.stringify(docsData['filterOptions'].workstream) : [];
            this.documentsList('allfolder');
            this.getdocumentForTab(1, 0); 
            this.recentTabs[0].selected = true;
            this.recentTabs[1].selected = false;         
          }
        }                 
       break; 
       case 'pin':
        //this.emptyPanel();
        this.pinFlag = docsData['pinFlag'];
        action = (this.pinFlag) ? 'files' : 'main';
        if(this.mainView){
          this.loading = true;
          this.mainView = false;
          this.itemOffset = 0;    
          this.currentDocAction = 'files';
          this.currentFolderName = '';
          this.currentFolderTypeId = '';
          this.currentFolderIdArr=[];
          this.documentsList(this.currentDocAction);  
        }
        else{
          this.loading = true;          
          this.itemOffset = 0;            
          this.documentsList(this.currentDocAction);
        }        
        break;      
       default:        
        break;
    } 
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  });
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }
  // Set Screen Height
  setScreenHeight() {
    let rmHeight = 0;
    let rmHeight1 = 0;
    let rmHeight2 = 0;
    console.log(this.accessFrom)
   if(this.accessFrom == 'documents'){
     rmHeight1 = 45;     
     rmHeight2 = 95; 
     this.secHeight = 230;
    this.listHeight = 280;   
   }
   else if(this.accessFrom == 'search'){
     rmHeight1 = 115;
     rmHeight2 = 95;
     this.secHeight = 200;
    this.listHeight = 250;
    }
    else{
      rmHeight1 = 85;
      rmHeight2 =  145;
      this.secHeight = 200;
    this.listHeight = 250;
    }
    //let rmHeight = (this.accessFrom == 'documents') ? 0 : 70;
    rmHeight = (this.thumbView) ? rmHeight1 : rmHeight2;
    let headerHeight = 0;
    let headerHeight1 = 0;
    
    headerHeight = (document.getElementsByClassName('prob-header')[0]) ? document.getElementsByClassName('prob-header')[0].clientHeight : headerHeight;
    headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? 15 : 0 ;     
    headerHeight = headerHeight1 +  headerHeight1;
    
    let titleHeight = (this.accessFrom != 'documents') ? 10 : (document.getElementsByClassName('document-list-head')[0]) ? document.getElementsByClassName('document-list-head')[0].clientHeight : 10;
    titleHeight = (!this.thumbView) ? titleHeight - 55 : titleHeight + 5;
    let footerHeight = (document.getElementsByClassName('footer-content')[0]) ? document.getElementsByClassName('footer-content')[0].clientHeight : 0;
    this.innerHeight = (this.bodyHeight - (headerHeight + footerHeight + 46));
    this.innerHeight = this.innerHeight - titleHeight;
    this.innerHeight = this.innerHeight - rmHeight;

    //this.secHeight = 230;
    //this.listHeight = 280;

    
  }

  documentsList(action=''){
    if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {
      if(this.apiUrl.enableAccessLevel){
        setTimeout(() => {
          if(!this.accessLevel.view){
            this.mainView = false;
            this.loading = false;
            this.opacityFlag = false;
            this.items=[];
            this.displayNoRecordsShow = 5;
            this.accessCheck = '1';
          }
          else{
            this.getDocumentsList(action);
          }
        }, 600);        
      }
      else{
        this.getDocumentsList(action);
      } 
    }
    else{
      this.getDocumentsList(action);
    }  
  }

  getDocumentsList(action){
    if(this.itemOffset == 0){
      this.itemTotal = 0;
      this.itemLength = 0;
      this.items = []; 
      this.listScroll = this.thumbView ? false : true;
    }
    var objData = {};    
    let FiltersArr={};

    let listingSolr=0;
   
    let searchValue = this.searchText;

    if (this.accessFrom == 'search' && (this.collabticDomain || this.CBADomain || this.tvsFlag)) {
      //this.rmHeight = 230;
    } else if(this.accessFrom == 'landingpage' && (this.collabticDomain || this.CBADomain || this.domainId==82 || this.domainId==52)) {
      listingSolr = (this.apiUrl.searchFromWorkstreamValue == '') ? 1 : 0;
      this.searchText = this.apiUrl.searchFromWorkstreamValue;
    } else {
      listingSolr=0;
      if(this.accessFrom == 'landingpage' && this.apiUrl.searchFromWorkstream) {
        this.docApiData.searchText = this.apiUrl.searchFromWorkstreamValue;
      }      
    }

    let wsFlag = true;
    if(this.CBADomain){
      let searchParams = '';
      var searchQSVal = localStorage.getItem('searchQSVal') != null && localStorage.getItem('searchQSVal') != undefined ? localStorage.getItem('searchQSVal') : '' ;
      if(searchValue == searchQSVal){
        searchParams = localStorage.getItem('searchparamQSVal') != null && localStorage.getItem('searchparamQSVal') != undefined ? localStorage.getItem('searchparamQSVal') : '' ;      }       
        console.log(searchParams);
        this.searchParams = searchParams;
        //wsFlag = false;
    }
    if(this.fromSearchpage) {
      this.searchParams = this.apiData["filterOptions"];
      this.searchParams = (this.searchParams == null || this.searchParams == undefined  || this.searchParams == 'undefined') ? localStorage.getItem(filterNames.search) : this.searchParams;
    }
    console.log(this.searchParams);
    let searchparamsjson = '';
     if(this.searchParams != ''){
      searchparamsjson =  ((JSON.parse(this.searchParams)));   
     } 
     
      FiltersArr["domainId"]=this.domainId;
      let platformIdInfo = localStorage.getItem('platformId');
      if(platformIdInfo=='1')
      {
        FiltersArr["approvalProcess"]=[0,1];
      }
     
      if(searchparamsjson && searchparamsjson['make'] && searchparamsjson['make']!='')
      {
        FiltersArr["make"]=searchparamsjson['make'];
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
      if(this.groupInfo && this.groupInfo.length>0 && this.groupInfo != '[]')
      {
        
      FiltersArr["workstreamsIds"] = JSON.parse(this.groupInfo);
      }
      else
      {
       
        let userWorkstreams=localStorage.getItem('userWorkstreams');
        if(userWorkstreams && wsFlag)
        {
          FiltersArr["workstreamsIds"] =JSON.parse(userWorkstreams);
        }
      }
      if((this.accessFrom == 'landingpage' && (this.collabticDomain || this.CBADomain || this.tvsFlag))) {
        let wsArr = [];
        let landingWorkstream = localStorage.getItem('workstreamItem');
        console.log(landingWorkstream)
        wsArr.push(landingWorkstream);
        console.log(wsArr)
        FiltersArr["workstreamsIds"] = (listingSolr == 1) ? FiltersArr["workstreamsIds"] : wsArr;
      }
      var objData = {};

      
      // call list api
      let apiType='folders';
      if(action == 'files'){
        if(this.currentFolderIdArr.length>0){
          FiltersArr["folderIdsStrArr"] = this.currentFolderIdArr;
        } 
        objData["type"]=2; 
        
        if(searchparamsjson && searchparamsjson['keyword'] && searchparamsjson['keyword'] != ''){
          objData["query"] = searchparamsjson['keyword'];
        } else {
          objData["query"] = searchValue; 
        }

        listingSolr = searchValue == '' ?  1 : 0 ;
        apiType = searchValue == '' ?  'list' : 'search';
      }
      

      if(listingSolr)
      {
        objData["listing"]=listingSolr; 
       if(this.itemOffset==0)
       {

        
    let workstreamFilterArr='';
    if(this.groupInfo)
    {
      workstreamFilterArr=this.groupInfo
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
  apiDatasocial.append('contentTypeId', '4'); 
  let platformIdInfo = localStorage.getItem('platformId');

  this.baseSerivce.postFormData("forum", "resetWorkstreamContentTypeCount", apiDatasocial).subscribe((response: any) => { })
      }
      }
      
      if(!listingSolr && this.itemOffset == 0 && searchValue!='')
      {
        this.updateSearchKeyword(searchValue);
      }
         
    
    
    
    objData["start"]=this.itemOffset;
    
    if(action == 'allfolder'){
      objData["rows"]=100;
    }
    else{
      objData["rows"]=this.itemLimit;
      switch(this.currentDocAction){
        case 'mfgfolder':
          objData["folderTypeId"]=parseInt(this.currentFolderTypeId);          
          break;
        case 'mfgfolderfile':
          objData["folderTypeId"]=parseInt(this.currentFolderTypeId);
          FiltersArr["manufacturer"]=this.currentFolderName;
          break;
        case 'mfgfile':
          objData["folderTypeId"]=parseInt(this.currentFolderTypeId);
          FiltersArr["make"]=this.currentFolderName;
          break;
        case 'makefolder':
          objData["folderTypeId"]=parseInt(this.currentFolderTypeId);          
          break;
        case 'makefile':
          objData["folderTypeId"]=parseInt(this.currentFolderTypeId);
          FiltersArr["make"]=this.currentFolderName;
          break;        
        default:
          break;
      }
    }  

    objData["filters"]=FiltersArr;
        
      let apiFormData={};
        this.commonApi.getDocumentsSolr(apiFormData,objData,apiType).subscribe(res => {         
         
          let data = res; 

          let documents = {
            loader: true,
            folders: [],
            files: [],
            mfg: [],
            mfgInfo: [],
            otherTechInfo: [],
            folderInfo: [],
            makeInfo: [],
            docInfoArray: [],
            total: 0
          };          
          documents.total = data.total;         
          documents.mfgInfo = data.mfgInfo != undefined ? data.mfgInfo : [];
          documents.otherTechInfo = data.otherTechInfo != undefined ? data.otherTechInfo : [];
          documents.folderInfo = data.folderInfo;
          documents.makeInfo = data.makeInfo;
          documents.docInfoArray = data.docInfoArray; 

          let folders:any;
          let files:any;
          if(action == 'allfolder'){
            folders = data.folders.folderInfoStrArr;
          }
          else if(action == 'files'){
            folders = data.documentData;
          }
          else{
            switch(this.currentDocAction){
              case 'mfgfolder':
                folders = data.folders.manufacturerStrArr; 
                break;
              case 'makefolder':
                folders = data.makeStrArr; 
                break;
              case 'mfgfolderfile':              
                folders = data.folders.makeStrArr;
                files = data.documentData;
                break;
              case 'makefile':
              case 'mfgfile':
                folders = data.documentData;
                break;             
              default:
                break;
            }
          }  

          console.log(folders);          

          if(this.currentDocAction == 'mfgfolderfile'){
            folders.forEach((folder, i) => {
              this.setupDoc(folder, documents, this.filterOptions, action);              
            });
            files.forEach((file, i) => {
                this.setupDoc(file, documents, this.filterOptions, action);              
            });
          }
          else{
            folders.forEach((folder, i) => {
              this.setupDoc(folder, documents, this.filterOptions, action);              
            });
          }

          console.log(documents);
          console.log(folders);
          
          if(action == 'allfolder'){
            if (documents.files.length > 0) {
              this.mainFolders = []
              this.mainFolders.push(...documents.files); 
            }
          }
          else{
            if ((documents.files.length > 0) || (this.currentDocAction == 'mfgfolderfile' && (documents.files.length > 0 || documents.folders.length))) {              
              this.items.push(...documents.files);
              if(this.currentDocAction == 'mfgfolderfile' && this.itemOffset == 0){ 
                this.items.unshift(... documents.folders);
              }

              if(action == 'files' || this.currentDocAction == 'makefile' || this.currentDocAction == 'mfgfolderfile' || this.currentDocAction == 'mfgfile'){
                this.emptyFlag = false;
                this.lazyLoading = false;
                this.scrollInit = 1;
                this.loadDataEvent=false; 
                this.scrollCallback = true;
                
                
               /*if(this.currentDocAction == 'mfgfolderfile'){
                  this.itemTotal = documents.total - documents.folders.length;
                  this.itemLength = documents.files.length -  documents.folders.length;
                }
                else{*/
                  this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
                  this.itemLength += documents.files.length;  
               /* }  */                             

                setTimeout(() => {
                  if(action == 'files' || this.currentDocAction == 'makefile' || this.currentDocAction == 'mfgfolderfile' || this.currentDocAction == 'mfgfile'){
                    let listItemHeight;
                    console.log(this.accessFrom)
                    let rmHeight = 120;
                    if(document.getElementsByClassName('documents-row')) {
                      listItemHeight = (document.getElementsByClassName('documents-row')[0].clientHeight)-rmHeight;
                    }
                    console.log(this.itemTotal, this.itemLength, documents.total, this.innerHeight, listItemHeight)
                    if(documents.files.length > 0 && this.itemTotal > this.itemLength && this.innerHeight > listItemHeight && !this.listScroll) {
                      this.scrollCallback = false;
                      this.lazyLoading = true;
                      this.loadDataEvent = true; 
                      this.itemOffset += this.itemLimit;
                      this.documentsList(this.currentDocAction);
                    }
                  }
                }, 1200)
              }
            }
            else{
              if(action == 'files' || this.currentDocAction == 'makefile' || this.currentDocAction == 'mfgfile'){                
                if(this.itemOffset == 0 && documents.total == 0) {
                  this.displayNoRecordsShow = (this.apiUrl.searchFromWorkstream) ? 1 : 0;
                  this.emptyFlag = true;
                } 
              }
              if(this.currentDocAction == 'mfgfolderfile'){
                if(this.itemOffset == 0 && ( documents.files.length == 0 && documents.folders.length == 0 ) ) {
                  this.displayNoRecordsShow = (this.apiUrl.searchFromWorkstream) ? 1 : 0;
                  this.emptyFlag = true;
                }
              }
            }
          }

          setTimeout(() => {
            this.loading = false;         
          }, 1);

          let ftimeout:any = 2000;
          this.updateThumbLayout(ftimeout);
                       
        });
  } 

// Get Recent Document Lists
getdocumentForTab(recentHistory, recentUploaded, action = '') {
    if(recentHistory == 1){
      if(this.recentViewedDocuments?.length==0){
        this.tabFlag = false;
      }
      else{
        //return false;
      }
    }
    if(recentUploaded == 1){
      if(this.recentUploadedDocuments?.length==0){
        this.tabFlag = false;
      }
      else{
        //return false;
      }
    }
    
    const apiFormData = new FormData();
  
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('offset', '0');
    apiFormData.append('limit', '10');
    apiFormData.append('folderId', '0');
    apiFormData.append('makeId', '0');
    apiFormData.append('recentHistory', recentHistory);
    apiFormData.append('recentUploaded', recentUploaded);
    apiFormData.append('platform', '3');      
    this.commonApi.getFoldersandDocuments(apiFormData).subscribe(res => {    
      console.log(res);
      let data = res; 
      let documents = {
        loader: true,
        folders: [],
        files: [],
        mfg: [],
        mfgInfo: [],
        otherTechInfo: [],
        folderInfo: [],
        makeInfo: [],
        docInfoArray: [],
        total: 0
      };
      documents.total = data.total;
      let totalIndex = 9;
      documents.mfgInfo = data.mfgInfo != undefined ? data.mfgInfo : [];
      documents.otherTechInfo = data.otherTechInfo != undefined ? data.otherTechInfo : [];
      documents.folderInfo = data.folderInfo;
      documents.makeInfo = data.makeInfo;
      documents.docInfoArray = data.docInfoArray;           
      let folders = data.folders;
      folders.forEach((folder, i) => {
          this.setupDoc(folder, documents,'', 'recentItems');
          if(i==totalIndex){
            this.tabFlag = true;
          }
      });
      console.log(documents);
      console.log(folders);
      if(this.tabFlag) {
        if (documents.files.length > 0) {
          if (recentHistory == 1){
            this.recentViewedDocuments= [];
            this.recentViewedDocuments = documents.files;   
            this.recentViewedDocuments.forEach((item, i) => {
              this.setupAttachments('view', item.docData, i);
            });
          }
          if (recentUploaded == 1){
            this.recentUploadedDocuments= [];
            this.recentUploadedDocuments = documents.files;
          }
        }     
      }

    });
 
}

  // Setup Document Attachments
  setupAttachments(action, docData, index) {
    if(docData != undefined && docData != null){
      if(Object.keys(docData).length > 0) {      
        let attachments = (docData.uploadContents == undefined || docData.uploadContents == 'undefined') ? [] : docData.uploadContents;
        docData.attachments = [];
        docData.attachments = attachments;
        switch(action) {
          case 'view':
            this.recentViewedDocuments[index].attachments = attachments;
            break;
          case 'uploaded':
            this.recentUploadedDocuments[index].attachments = attachments;
            break;  
        }
      }
    }
  }

setupDoc(folder, documents, filterOptions, action='') {
  //console.log(folder);
  let docDetail:any;
  let folderInfo;
  if(action == 'recentItems'){
    docDetail = folder.documentDetail;
  }
  else if(action == 'allfolder'){
    docDetail = folder;
  }
  else if(action == 'files'){
    docDetail = folder;
  }
  else{
    switch(this.currentDocAction){ 
      case 'mfgfolder':
        docDetail = folder;
        break;
      case 'mfgfolderfile':
        docDetail = folder;
        break; 
      case 'mfgfile':
        docDetail = folder;
        break;
      case 'makefolder':
        docDetail = folder;
        break;
      case 'makefile':
        docDetail = folder;
        break;      
      default:
        folderInfo = folder;
        break;
    }
  }
  if (docDetail.resourceID == null && (action == 'allfolder' || action == 'mfgfolder' || (action == 'mfgfolderfile' && this.itemOffset == 0) || action == 'makefolder')) {
    let folderTypeId = folder.folderTypeId;
    let folderType;
    if(action == 'mfgfolder'){
      folderTypeId = '7';
    }
    else if(action == 'makefolder' || action == 'mfgfolderfile'){
      folderTypeId = '6';
      if(action == 'mfgfolderfile'){
        folderType = '4';
      }
    }
    else{
      folderTypeId = folder.folderTypeId;
    }
    let ws = (folder.workstreamsList == null) ? '' : folder.workstreamsList;
    let createdDate = moment.utc(folder.createdOn).toDate();
    let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
    let updatedDate = folder.updatedOn != "" ? moment.utc(folder.updatedOn).toDate() : "";
    let localUpdatedDate = updatedDate != "" ? moment(updatedDate).local().format('MMM DD, YYYY h:mm A') : "";
    let logo = (folder.logo == null) ? 'assets/images/documents/sys-folder-thumb.png' : folder.logo;
    let isDef:any = (folder.logo == null) ? true : false;
    let manufacturer = (folder.manufacturer == undefined || folder.manufacturer == 'undefined') ? '' : folder.manufacturer;
    let folderObj: DocumentListData = {
        isSystemFolder: folder.systemFolder,
        folderName: folder.name,
        manufacturer: manufacturer,
        subFolderCount: folder.subFolderCount,
        fileCount: folder.facetCount,
        isMfg: folder.isMfg,
        isMake: folder.isMake,
        viewCount: folder.viewCount,
        logo: logo,
        isDef: isDef,
        docType: 'folder',
        id: folder.id,
        folderTypeId: folderTypeId,
        createdOn: localCreatedDate,
        updatedOn: localUpdatedDate,
        userName: folder.userName,
        workstreamsList: ws,
        folderType: folderType
    }
    
    if(action == 'mfgfolderfile'){
      documents.folders.push(folderObj); 
    }
    else{
      documents.files.push(folderObj);  
    }
  }
  if (docDetail.resourceID != null) {
      let file: any = {};
      let docLogo = docDetail.logo;
      let selected = false;
      file.docType = docDetail.docType;
      file.selected = selected;
      file.title = docDetail.title;
      file.logo = (docLogo == undefined || docLogo == 'undefined') ? '' : docLogo;
      let folderOptions = docDetail.foldersOptions;
      let assignedFolderId = (folderInfo?.length > 0) ? parseInt(folderInfo[0].id) : 0;
      file.assignedFolderId = assignedFolderId;
      file.folderId = (folderOptions?.length > 0) ? parseInt(folderOptions[0].id) : 0;
      file.resourceID = docDetail.resourceID;
      let makeModelValue = docDetail.makeModelsNew;
      let isGeneral = (docDetail.isGeneral == 1) ? true : false;
      file.isGeneral = isGeneral;
      
      let makeModelVal = docDetail.makeModelsWeb[0];
      docDetail.modelList = (makeModelVal?.model.length > 0) ? makeModelVal?.model : []; 
      
      if(isGeneral) {
          file.makeTooltip = '';
          file.manufacturer = '';
          file.mfg = '';
          file.make = docDetail.make;
          file.model = '';
          file.year = '';
          file.makeTooltip = file.make;
      } else {
          file.manufacturer = '';
          file.mfg = '';
          file.model = '';
          file.year = '';
          file.makeTooltip = "";
          if (makeModelValue && makeModelValue.length == 0) {
              file.make = 'All Makes';
              file.model = 'All Models';
              file.year = '';
          } else if (makeModelValue && makeModelValue.length > 0) {
              if(makeModelValue[0].hasOwnProperty('manufacturer')) {
                  if (makeModelValue[0].manufacturer && makeModelValue[0].manufacturer != "") {
                      file.manufacturer = makeModelValue[0].manufacturer.replace(/\s?$/,'');
                      file.mfg = file.manufacturer;
                      file.makeTooltip = file.manufacturer;
                      if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                          file.make = makeModelValue[0].genericProductName;
                          file.makeTooltip = `${file.makeTooltip} > ${file.make}`;
                          if(makeModelValue[0].model.length > 0) {
                              file.model = ` ${makeModelValue[0].model}`;
                              file.makeTooltip = `${file.makeTooltip} > ${file.model}`;
                              if (makeModelValue[0].year) {
                                  file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                                  file.mfg = '';
                              }
                          }
                      } 
                  } else {
                      if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                          file.make = makeModelValue[0].genericProductName;
                      }
                      if (makeModelValue[0].model.length > 0) {
                          file.model = makeModelValue[0].model;
                      }
                      if (makeModelValue[0].year) {
                          file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                      }
                  }
              } else {
                  if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "")
                      file.make = makeModelValue[0].genericProductName;
                  else
                      file.make = 'All Makes';
                  if (makeModelValue[0].model.length > 0) {
                      file.model = makeModelValue[0].model;
                  } else {
                      file.model = '';
                  }
                  if (makeModelValue[0].year) {
                      file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                  } else {
                      file.year = '';
                  }
              }                                                                        
          }
          
          if(!makeModelValue[0].hasOwnProperty('manufacturer')) {
              let tooltip = '';
              if(file.make != '')
                  tooltip = file.make;

              if(file.model != '')
                  tooltip = `${tooltip} > ${file.model}`;

              if(file.year != '')
                  tooltip = `${tooltip} > ${file.year}`;
              
              file.makeTooltip = tooltip;
          }
      }

      let createdDate = moment.utc(docDetail.createdOnMobile).toDate(); 
      let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
      docDetail.createdOnMobile = localCreatedDate;
      let updatedDate = moment.utc(docDetail.updatedOnMobile).toDate(); 
      let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
      docDetail.updatedOnMobile = localUpdatedDate;
      let submitedByDate = moment.utc(docDetail.submitedDate).toDate(); 
      let localsubmitedByDate = moment(submitedByDate).local().format('MMM DD, YYYY h:mm A');
      docDetail.submitedByDate = localsubmitedByDate;
      /*docDetail.expand = filterOptions.expand;
      file.docData = docDetail;*/
      file.createdOnMobile = localCreatedDate;
      file.updatedOnMobile = localUpdatedDate;
      file.submitedByDate = localsubmitedByDate;
      file.viewCount = docDetail.viewCount;
      file.isDraft = docDetail.isDraft;
      file.docWS = docDetail.WorkstreamsList;
      file.docFolders = docDetail.foldersOptions;
      file.submitedBy = docDetail.submitedBy != undefined ? docDetail.submitedBy : '';
      file.submitedByUserName = docDetail.submitedByUserName != undefined ? docDetail.submitedByUserName : '';
      file.submitedByAvailability = docDetail.submitedByAvailability != undefined ? docDetail.submitedByAvailability : '';
      file.submitedByProfileImage = docDetail.submitedByProfileImage != undefined ? docDetail.submitedByProfileImage : '';
      file.documentStatusId = docDetail.documentStatusId != undefined ? docDetail.documentStatusId : '';
      file.documentStatus = docDetail.documentStatus != undefined ? docDetail.documentStatus : '';
      file.documentStatusBgColor = docDetail.documentStatusBgColor != undefined ? docDetail.documentStatusBgColor : '';
      file.documentStatusColorValue = docDetail.documentStatusColorValue != undefined ? docDetail.documentStatusColorValue : '';
      file.likeCount = docDetail.likeCount;
      if (docDetail.likeStatus == 1) file.likeStatus = true;
      else file.likeStatus = false;
      file.shareCount = docDetail.shareCount;
      file.pinCount = docDetail.pinCount;
      if (docDetail.pinStatus == 1) file.pinStatus = true;
      else file.pinStatus = false;
      
      file.styleName = (file.logo == '') ? 'empty' : '';
      file.flagId = 0;
      file.class = 'doc-thumb';
      file.attachments = [];
      let attachments = docDetail.uploadContents;
      if(attachments?.length > 0) {
          file.attachments = attachments;
          let attachment = attachments[0];
          file.flagId = attachment.flagId;
          if (attachment.flagId == 1)
              file.contentPath = attachment.thumbFilePath;
          else if (attachment.flagId == 2)
              file.contentPath = attachment.posterImage;
          else if (attachment.flagId == 3)
              file.styleName = 'mp3';
          else if (attachment.flagId == 4 || attachment.flagId == 5) {
              let fileType = attachment.fileExtension.toLowerCase();
              switch (fileType) {
                  case 'pdf':
                      file.styleName = 'pdf';
                      break;
                  case 'application/octet-stream':
                  case 'xlsx':
                  case 'xls':    
                      file.styleName = 'xls';
                      break;
                  case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                  case 'application/msword':
                  case 'docx':
                  case 'doc':
                  case 'msword':  
                      file.styleName = 'doc';
                      break;
                  case 'application/vnd.ms-powerpoint':  
                  case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                  case 'pptx':
                  case 'ppt':
                      file.styleName = 'ppt';
                      break;
                  case 'zip':
                      file.styleName = 'zip';
                      break;
                  case 'exe':
                      file.styleName = 'exe';
                      break;
                  case 'txt':
                      file.styleName = 'txt';
                      break;  
                  default:
                      file.styleName = 'unknown-thumb';
                      break;
                  }
          }
          else if (attachment.flagId == 6) { // link, youtube
              file.class = 'link-thumb';
              let banner = '';
              let prefix = 'http://';
              let logoImg = attachment.thumbFilePath;
              file.styleName = (logoImg == "") ? 'link-default' : '';
              let logo = (logoImg == "") ? 'assets/images/media/link-medium.png' : logoImg;
              let url = attachment.filePath;
              //console.log(url)
              if(url.indexOf("http://") != 0) {
                  if(url.indexOf("https://") != 0) {
                  url = prefix + url;
                  } 
              }
              let youtube = this.commonApi.matchYoutubeUrl(url);
              //console.log(url, youtube)
              if(youtube) {
                  //console.log(youtube)
                  banner = '//img.youtube.com/vi/'+youtube+'/0.jpg';
              } else {
                  let vimeo = this.commonApi.matchVimeoUrl(url);
                  if(vimeo) {
                  this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
                      let res = response[0];
                      banner = res['thumbnail_medium'];
                  });
                  } else {
                      banner = logo;
                  }
              }
              file.contentPath = banner;
          }
          else if (attachment.flagId == 8) {
              file.styleName = 'html';
          }
      }
      file.contentPath = (file.logo == '') ? file.contentPath : file.logo;
      //console.log(file.resourceID, file.logo)
      documents.files.push(file);
      documents.mfg.push(file);
  }
  
  if (folder.folderDetail?.id) {
    //console.log(folder.folderDetail.workstreamsList);
    let ws = (folder.folderDetail.workstreamsList == null) ? '' : folder.folderDetail.workstreamsList;
    let createdDate = moment.utc(folder.folderDetail.createdOn).toDate();
    let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
    let updatedDate = folder.folderDetail.updatedOn != "" ? moment.utc(folder.folderDetail.updatedOn).toDate() : "";
    let localUpdatedDate = updatedDate != "" ? moment(updatedDate).local().format('MMM DD, YYYY h:mm A') : "";
    let logo = (folder.folderDetail.logo == null) ? 'assets/images/documents/sys-folder-thumb.png' : folder.folderDetail.logo;
    let isDef:any = (folder.folderDetail.logo == null) ? true : false;
    let manufacturer = (folder.folderDetail.manufacturer == undefined || folder.folderDetail.manufacturer == 'undefined') ? '' : folder.folderDetail.manufacturer;
    let folderObj: DocumentListData = {
        isSystemFolder: folder.folderDetail.isSystemFolder,
        folderName: folder.folderDetail.folderName,
        manufacturer: manufacturer,
        subFolderCount: folder.folderDetail.subFolderCount,
        fileCount: folder.folderDetail.fileCount,
        isMfg: folder.isMfg,
        isMake: folder.folderDetail.isMake,
        viewCount: folder.folderDetail.viewCount,
        logo: logo,
        isDef: isDef,
        docType: folder.folderDetail.docType,
        id: folder.folderDetail.id,
        createdOn: localCreatedDate,
        updatedOn: localUpdatedDate,
        userName: folder.folderDetail.userName,
        workstreamsList: ws,
        folderTypeId: folder.folderTypeId,
        folderType: folder.folderTypeId
    }
    documents.folders.push(folderObj);                           
    documents.mfg.push(folderObj);
  }

}
folderType1Show(){
  this.currentDocAction = '';
  this.folderType2Id = '';
  this.folderType2Name = '';
  this.folderType2Action = '';
  this.folderType3Id = '';
  this.folderType3Name = '';
  this.folderType3Action = '';
  this.folderType4Id = '';
  this.folderType4Name = '';
  this.folderType4Action = '';
}
folderType2Show(){
  this.folderType3Id = '';
  this.folderType3Name = '';
  this.folderType3Action = '';
  this.folderType4Id = '';
  this.folderType4Name = '';
  this.folderType4Action = '';
}

folderType3Show(){
  this.folderType4Id = '';
  this.folderType4Name = '';
  this.folderType4Action = '';
}

checkType(item){
  if(item.docType == 'file'){
    this.callbackClick(item, item)
  }
  else{
    this.viewDocument(item);
  }
}

viewDocument(event) {
  console.log(event);
  //this.loading = true;
  this.mainView = false;
  this.itemOffset = 0;
  let action = '';
  this.currentFolderName = event.folderName;
  this.currentFolderTypeId = event.folderTypeId;  
  if(this.currentFolderTypeId == '1' || this.currentFolderTypeId == '2' || this.currentFolderTypeId == '3'){
    action = 'files';   
    this.currentFolderIdArr = [];
    this.currentFolderIdArr.push(event.id.toString());
    this.folderType2Id = this.currentFolderTypeId;
    this.folderType2Name = this.currentFolderName;
    this.folderType2Action = action;
    this.folderType2Show();
  }
  else if(this.currentFolderTypeId == '4'){
    action = 'makefolder';
    this.folderType2Id = this.currentFolderTypeId;
    this.folderType2Name = this.currentFolderName;
    this.folderType2Action = action;
    this.folderType2Show();
  }
  else if(this.currentFolderTypeId == '5'){
    action = 'mfgfolder';
    this.folderType2Id = this.currentFolderTypeId;
    this.folderType2Name = this.currentFolderName;
    this.folderType2Action = action;
    this.folderType2Show();
  }
  else if(this.currentFolderTypeId == '6'){
    if(event.folderTypeId == '6' && event.folderType == '4'){
      action = 'mfgfile';
      this.folderType4Id = this.currentFolderTypeId;
      this.folderType4Name = this.currentFolderName;
      this.folderType4Action = action;
    }
    else{
      action = 'makefile';
      this.folderType3Id = this.currentFolderTypeId;
      this.folderType3Name = this.currentFolderName;
      this.folderType3Action = action;
      this.folderType3Show();
    }    
  }
  else if(this.currentFolderTypeId == '7'){
    action = 'mfgfolderfile';
    this.folderType3Id = this.currentFolderTypeId;
    this.folderType3Name = this.currentFolderName;
    this.folderType3Action = action;
    this.folderType3Show();
  }
  else{
    action = 'files';
  }
  this.currentDocAction = action;
  this.documentsList(action);        
}
  // Update Manufacturer Logo
  updateLogo(item, action) {
    console.log(item)
    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.bodyElem.classList.add('profile');  
    this.bodyElem.classList.add('image-cropper');
    let access = (!item.isMfg && !item.isMake) ? "folderLogo" : (item.isMake) ? "makeLogo" : "mfgLogo";
    console.log(access)
    if(action == 'upload') {
        const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
        modalRef.componentInstance.userId = this.userId;
        modalRef.componentInstance.domainId = this.domainId;
        modalRef.componentInstance.type = "Edit";
        modalRef.componentInstance.profileType = access; 
        modalRef.componentInstance.id = item.id;     
        modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
            if (receivedService) {
                //console.log(receivedService);
                this.bodyElem = document.getElementsByTagName('body')[0];
                this.bodyElem.classList.remove('profile');  
                this.bodyElem.classList.remove('image-cropper');
                modalRef.dismiss('Cross click');       
                item.logo = receivedService.show;              
            }
        });
    } else {
        const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
        modalRef.componentInstance.access = 'Delete';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
            modalRef.dismiss('Cross click'); 
            if(receivedService) {
                const formData = new FormData();
                formData.append('apiKey', Constant.ApiKey);
                formData.append('userId', this.userId);
                formData.append('domainId', this.domainId);
                formData.append('access', access);
                formData.append('id', item.id);
                let serverUrl = this.apiUrl.apiRemoveLogo();    
                this.httpClient.post<any>(serverUrl, formData).subscribe(res => {
                    if(res.status=='Success') {
                    item.logo = '';
                    }
                    console.log(res);            
                },
                (error => {})
                );
            }
        });
    }
}

  editfolderpopup(name,id,workstreamsList) {
    console.log(workstreamsList);
    console.log(name);
    console.log(id);
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    }
    let actionInfo = {
        action: 'edit',
        id: id,
        name: name,
        workstreamsList:workstreamsList
    }
    localStorage.setItem('workstreamsList',JSON.stringify(workstreamsList));
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Edit Folder';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = actionInfo;
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;          
      setTimeout(() => {            
        msgModalRef.dismiss('Cross click'); 
        localStorage.removeItem('workstreamsList');           
        let rmIndex;
        rmIndex = this.items.findIndex((option) => option.id == id); 
        this.items[rmIndex].folderName = receivedService.folderName;
        this.items[rmIndex].workstreamsList = receivedService.wslist;
        this.items[rmIndex].refresh = receivedService.refresh;
        console.log(this.items[rmIndex].workstreamsList);    
        console.log(this.items[rmIndex].folderName);    
        console.log(this.items[rmIndex].refresh);    
        console.log(this.items);
        if(this.items[rmIndex].refresh == '1'){
          this.itemOffset = 0;
          this.documentsList(this.currentDocAction);
        } 
        else{
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateMasonryLayout = true;          
          }, 100); 
        }                 
      }, 1000);
    });
}

deletefolderpopup(name,id,count) {
    console.log(name);
    console.log(id);
    let apiData = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId                
    }
    let actionInfo = {
        action: 'delete',
        id: id,
        name: name,
        count: count
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Delete Folder';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = actionInfo;
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        console.log(receivedService)
        const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
        msgModalRef.componentInstance.successMessage = receivedService.message;  
        setTimeout(() => {            
            msgModalRef.dismiss('Cross click');            
            let rmIndex;
            rmIndex = this.items.findIndex((option) => option.id == id); 
            let updateCount = this.items[rmIndex].fileCount;
            this.items.splice(rmIndex, 1);  
            console.log(updateCount, this.items);

            let updateFolder, fileCount;
            let platformId: any = localStorage.getItem('platformId');
            platformId = (platformId == 'undefined' || platformId == undefined) ? platformId : parseInt(platformId);
                    
            switch(receivedService.action) {
                case 'all':
                    updateFolder = this.items.findIndex((option) => option.isSystemFolder == 1 && option.folderName == 'ALL FILES');
                    fileCount = this.items[updateFolder].fileCount-updateCount;
                    this.items[updateFolder].fileCount = fileCount;
                    break;
                case 'general':
                    let chkGeneralFolder = (platformId == 2 && this.domainId == 52) ? 'General Automotive Info' : 'GENERAL';
                    updateFolder = this.items.findIndex((option) => option.isSystemFolder == 1 && option.folderName == chkGeneralFolder);
                    fileCount = this.items[updateFolder].fileCount+updateCount;
                    this.items[updateFolder].fileCount = fileCount;
                    break;    
            }
            setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;          
            }, 100); 
        }, 2000);
    });
  }
  openDetailView(id){        
    const modalRef = this.modalService.open(ViewDocumentDetailComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.dataId = id; 
    modalRef.componentInstance.documentServices.subscribe((receivedService) => { 
      console.log(receivedService);  
      modalRef.dismiss('Cross click');
      setTimeout(() => {
        this.bodyElem = document.getElementsByTagName('body')[0];   
        this.bodyElem.classList.remove("view-modal-popup");       
        let url = this.router.url.split('/'); 
        let title = ''  
        if(url[1] == RedirectionPage.Documents) { 
          title = PageTitleText.Documents;
        }
        if(url[1] == RedirectionPage.Workstream) { 
          title = PageTitleText.Workstreams;
        }
        if(url[1] == RedirectionPage.Search) { 
          title = PageTitleText.Search;
        }
        this.titleService.setTitle( localStorage.getItem('platformName')+' - '+title); 
        }, 100); 
    });
  }
  openDetailViewPage(item){
    if(!document.body.classList.contains("thread-detail")) {
        document.body.classList.add("thread-detail");
      }
      let navFrom = this.commonApi.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' documents') ? false : true;
      let scrollTop:any = 0;
      let docId = item.resourceID;
      localStorage.setItem('docId', docId);
      localStorage.setItem('docIddetail', docId);
      localStorage.setItem('docInfoNav', 'true');
      this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      let nav = `documents/view/${docId}`;
      this.router.navigate([nav]);           
  }

  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
        this.updateMasonryLayout = false;
    }, 500);
}

    // Recent Tab
    recentTab(tabAction, tab) {
      console.log(tab);
      this.panelFlag = false;
      this.setupRecentTabWidth('toggle', this.panelFlag);
      let selected = (tabAction == 'trigger') ? false : tab.selected;
      let action = tab.control;
      if(!selected) {
        let dataId = -1;
        let docAction = 'callback';
        this.docInfoData.docData = [];
        this.docInfoData.action = docAction;
        let tabData = {
          access: 'tab',
          docData: [],
          flag: false
        }
        this.commonApi.emitDocumentPanelFlag(tabData)
        //this.emitDocInfo(dataId);  
        setTimeout(() => {
          this.recentTabs.forEach(t => {
            t.selected = (t.control == action) ? true : false;
          });
        }, 100);
      }
      setTimeout(() => {
        if(action == 'uploaded') {
          this.deselectTab(this.recentViewedDocuments);
          this.getdocumentForTab(0,1);
        } else {
          this.deselectTab(this.recentUploadedDocuments);
          this.getdocumentForTab(1,0);
        }
      }, 100);
  
      setTimeout(() => {
        this.callback.emit(this);
      }, 500);
    }

      // Setup Recent Tab width
  setupRecentTabWidth(action, expandFlag) {
    console.log(action, expandFlag);
    let timeout = (action == 'trigger') ? 250 : 100;       
    if(document.getElementsByClassName('document-tab')[0]) {
      this.innerRecentViewWidth = document.getElementsByClassName('document-tab')[0].clientWidth - 15;
      let actionVal;
      setTimeout(() => {
        if(this.recentUploadedDocuments.length == 0 || this.recentViewedDocuments.length == 0) {
          this.innerRecentViewWidth = this.innerRecentViewWidth+110;
        } else {
          if (expandFlag) {
            console.log(1)
            actionVal = (action == 'trigger') ? 50 : 260;
            this.innerRecentViewWidth = this.innerRecentViewWidth - actionVal;
          } else {
            console.log(1)
            actionVal = (action == 'toggle') ? 240 : (this.panelFlag) ? 160 : 210;
            this.innerRecentViewWidth = this.innerRecentViewWidth + actionVal;
          }
        }             
      }, timeout);
    }          
  }


      // Deselect Tab
  deselectTab(item) {
    item.forEach(i => {
      i.selected = false;
    });
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  
    
  callbackClick(doc, item, index='') {
    if (this.singleClick === true) {
      this.doubleClick = true;
      this.openGallery(item);
    } else {
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
        if (this.doubleClick === false) {
          let docId = item.resourceID;
          this.openDetailView(docId);         
        }
        this.doubleClick = false;
      }, 500);
    }
  }

  // Open Light Gallery
  openGallery(item) {
    let docId = item.resourceID;
    this.apiData.dataId = docId;
    this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
    if(item.attachments.length > 0) {
      let gid = `lg-0-${docId}`;
      let element: HTMLElement = document.getElementById(gid) as HTMLInputElement;
      element.click();
    } else {
      this.openDetailView(docId); 
    }
  }

  updateSearchKeyword(keyword)
  {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);
    this.LandingpagewidgetsAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {});
  }
  scroll = (event: any): void => {
    console.log(event);
    console.log(event.target.className);
    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      this.scrollAction(event);
      event.preventDefault;
    }       
  }
  // scroll event
  scrollAction(event){
    if(this.currentDocAction == 'files' || this.currentDocAction == 'makefile' || this.currentDocAction == 'mfgfolderfile' || this.currentDocAction == 'mfgfile'){ 
      if(!this.thumbView) {     
        this.scrollTop = event.target.scrollTop-90;
        let totalHeight = event.target.scrollTop+event.target.offsetHeight;
        let scrollHeight = event.target.scrollHeight-10;
        console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+totalHeight+'--'+scrollHeight);
        console.log(this.itemTotal, this.itemLength)
        if((totalHeight>=scrollHeight) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false) {
          this.scrollCallback = false;
          this.listScroll = true;
          this.lazyLoading = true;
          this.loadDataEvent = true; 
          this.itemOffset += this.itemLimit;
          this.documentsList(this.currentDocAction);
          this.lastScrollTop = this.scrollTop;
          event.preventDefault;
        }
        
      }
    }
  };
  breadcrumb(type){
    if((this.CBADomain) && (type == 'folderType1')){
      type = 'folderType2';
    }  
    console.log(type);
    this.itemOffset = 0;
    switch(type){
      case 'folderType1':
        this.mainView = true; 
        this.folderType1Show(); 
        break;
      case 'folderType2':
        this.mainView = false;
        this.currentFolderTypeId = this.folderType2Id;
        this.currentFolderName = this.folderType2Name;
        this.currentDocAction = this.folderType2Action;
        this.folderType2Show(); 
        this.documentsList(this.currentDocAction);
        break;
      case 'folderType3':
        this.currentFolderTypeId = this.folderType3Id;
        this.currentFolderName = this.folderType3Name;
        this.currentDocAction = this.folderType3Action;
        this.folderType3Show(); 
        this.documentsList(this.currentDocAction);
        this.mainView = false;  
        break;
    }
  }
  searchCallBack(docsData){
    console.log(docsData)
    //this.loading = true;
    this.mainView = false;
    this.itemOffset = 0;    
    this.currentDocAction = 'files';
    this.currentFolderName = '';
    this.currentFolderTypeId = '';
    this.currentFolderIdArr=[];

    this.groupInfo = JSON.stringify(docsData.filterOptions['workstream']);
    if(docsData['filterOptions'] && docsData['filterOptions']!=null) {
      this.filterOptions=JSON.stringify(docsData['filterOptions']);       
    }     
    this.fromSearchpage='1';  
    if(this.CBADomain){
      let searchParams = docsData['searchParams'] != undefined ? docsData['searchParams'] : '';        
      console.log(searchParams);
      this.searchParams = searchParams;
    }     
    this.displayNoRecords = false;    
    this.accessFrom = docsData.action; 
    if(this.accessFrom == 'landingpage'){
      this.searchText=docsData.searchVal; 
    }
    else{
      this.thumbView = this.tspageInfo.pageView;
      this.searchText=docsData.searchText;     
    }     
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();   
    this.documentsList(this.currentDocAction); 
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true; 
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(4, chkType, chkFlag);
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
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess};
        
        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        else{
          this.accessLevel = this.accessLevel;
        }        
        console.log(this.accessLevel)

      }, 700);  
  }

  updateThumbLayout(actionTimeout=0) {
    console.log(actionTimeout)
    let timeout:any = (actionTimeout == 0) ? 50 : actionTimeout;
    console.log(timeout);    
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
      setTimeout(() => {
        this.updateMasonryLayout = false;
      }, 100);
    }, timeout);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.docApiCall.unsubscribe();
    this.docListApiCall.unsubscribe();
    this.docWsApiCall.unsubscribe();
  }
}
export interface DocumentListData {
  id: string;
  isSystemFolder: boolean;
  isMfg: boolean;
  isMake: boolean;
  viewCount: number;
  logo: string;
  isDef: boolean,
  docType: string;
  folderName: string;
  manufacturer: string;
  subFolderCount: number;
  fileCount: number;
  createdOn: string;
  updatedOn: string;
  userName: string;
  workstreamsList: object;
  folderTypeId: string;
  folderType: string;
}

