import { Component, HostListener, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NavigationStart, Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { AppService } from 'src/app/modules/base/app.service';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { pageTitle, Constant, filterNames, RedirectionPage,PlatFormType } from 'src/app/common/constant/constant';
import { Title } from '@angular/platform-browser';
import { Subscription } from "rxjs";
import { ApiService } from '../../../services/api/api.service';
import { BaseService } from 'src/app/modules/base/base.service';
@Component({
  selector: 'app-documents-old',
  templateUrl: './documents-old.component.html',
  styleUrls: ['./documents-old.component.scss'],
  styles: [
    `.masonry-item { width: 210px; }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }`
  ]
})
export class DocumentsOldComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @Input() accessFrom: string = "documents";
  @Output() searchResultData: EventEmitter<any> = new EventEmitter();
  @Output() docComponentRef: EventEmitter<DocumentsOldComponent> = new EventEmitter();
  @Output() callback: EventEmitter<DocumentsOldComponent> = new EventEmitter();

  //@Input() docData: any = [];
  subscription: Subscription = new Subscription();

  public teamSystem = localStorage.getItem('teamSystem');
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
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public scrollPos: number = 0;
  public docScroll: boolean = false;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public partType: string = "";
  public searchVal: string = '';
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public documentViewOption:string =localStorage.getItem('documentViewOption');
  public documentMfgIdOption:string =localStorage.getItem('documentMfgIdOption');
  public domainId = 1;
  public countryId;
  public apiKey: string = this.appService.appData.apiKey;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public groupInfo: any = [];
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
  public mainView: boolean = true;
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
  constructor(
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private location: PlatformLocation,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private appService: AppService,
    private titleService: Title,
    private baseSerivce: BaseService,
    private documentationService: DocumentationService,
    public apiUrl: ApiService) {
      this.titleService.setTitle(localStorage.getItem('platformName')+' - Documents');
      this.location.onPopState (() => {
        let url = this.router.url.split('/');
        if(url[1] == RedirectionPage.Documents) {
          this.opacityFlag = true;
          setTimeout(() => {
            if(!document.body.classList.contains('landing-page')) {
              document.body.classList.add('landing-page');
            }
            setTimeout(() => {
              if(!this.mainView) {
                let docInfoNav = localStorage.getItem('docInfoNav');
                if(docInfoNav) {
                  setTimeout(() => {
                    localStorage.removeItem('docInfoNav');
                  }, 100);
                  let data = {
                    action: 'folder-layout',
                    access: 'folder-layout'
                  }
                  this.commonApi.emitMessageLayoutrefresh(data)
                }
                let id = localStorage.getItem('docId');
                if(id != null){
                  let fileIndex = this.files.findIndex(option => option.resourceID == id);
                  if(fileIndex >= 0) {
                    this.scrollToElem(id);
                  }
                  else{
                    this.opacityFlag = false;
                  }
                }
                else{
                  this.opacityFlag = false;
                }
              }
            }, 500);
          }, 5);
        }
        else
        {
         this.contentLoading=true;
         this.opacityFlag=true;
         this.loading=true;

         setTimeout(() => {
          this.contentLoading=false;
          this.opacityFlag=false;
          this.loading=false;

          let id = localStorage.getItem('docIddetail');
          if(id != null){
            let fileIndex = this.files.findIndex(option => option.resourceID == id);
            //if(fileIndex >= 0) {
              setTimeout(() => {
                this.scrollToElem(id);
              }, 600);

            //}
          }

         },5000);
        //  this.opacityFlag = false;
        }

      });
    }

  ngOnInit(): void {
    let platformIdInfo: any = localStorage.getItem('platformId');
    this.CBADomain = (platformIdInfo == PlatFormType.CbaForum) ? true : false;
    this.loading = this.CBADomain ? false : true;
    localStorage.setItem('currentContentType', '4');

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationStart) {
        if(event.url!='/workstreams-page' && event.url!='/documents')
        {

          //this.ngOnDestroy();
        }

        // save your data
      }

    });
    this.countryId = localStorage.getItem('countryId');
    let fromHometoDocuments=localStorage.getItem('fromHometoDocuments');
    let defaultFolderId=localStorage.getItem('defaultFolderId');

    // enable domain based
    this.approvalEnableDomainFlag = localStorage.getItem('documentApproval') == '1' ? true : false;


    if(fromHometoDocuments=='1')
    {
      this.showDocuments=false;
      setTimeout(() => {
        let data = {
          action: 'files',
          folderId: defaultFolderId,
          subFolderId: '',
          docData: [],
          thumbView: this.thumbView,
          subFolderCount: 0
      }

      this.commonApi.emitDocumentListData(data);
      this.commonApi.emitDocumentPanelFlag(data);
    },1);
    }
    else
    {
    this.showDocuments=true;
    }

    let platformId: any = localStorage.getItem('platformId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;

    this.tvsFlag = (platformId == 2 && (this.domainId == 52 || this.domainId == 82)) ? true : false;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.checkAccessLevel();
    let tab = localStorage.getItem('documentTab');
    this.tab = (tab == 'undefined' || tab == undefined) ? this.tab : tab;
    for(let t of this.recentTabs) {
      t.selected = (t.control == this.tab) ? true : false;
    }

    // Remove when silent push enabled
    let pageIndex = pageTitle.findIndex(option => option.slug == RedirectionPage.Documents);
    let navEditText = pageTitle[pageIndex].navEdit;
    localStorage.removeItem(navEditText);

    this.apiData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      dataId: 0,
      platformId: 3,
    };

    this.docApiData = {
      'platform': 3,
      'type': '',
      'isContentDetail': '',
      'resourceId': '',
      'recentHistory': 0,
      'offset': this.itemOffset,
      'limit': this.itemLimit,
      'apiKey': this.apiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'threadIdArray':[],
      'threadCount':'0',
      'priorityIndex':'',
      'syncWithThreadFromDoc': '',
      'folderId': '',
      'makeId': '',
      'recentUploaded': 0
    };

    this.docInfoData = {
      action: 'load',
      dataId: 0,
      docData: [],
      loading: true
    };

    console.log(564, this.accessFrom)

    this.doconCloseAPI= this.commonApi.emitOnCloseSearchCallSubject.subscribe((r) => {
      this.files = [];
      this.folders = [];
      this.loading=true;
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.bodyElem.classList.add('landing-page');
      localStorage.removeItem('searchValue');
      localStorage.removeItem('searchPageFilter');
      localStorage.removeItem('filterOptions');
      localStorage.removeItem('threadFilter');
      this.fromSearchpage='';
      this.searchText="";
      this.priorityIndexValue ="";
      this.docApiData.fromWorkstreampage = "";
      this.docApiData.expand = false;
      this.itemOffset = 0;
      this.filterOptions = [];
      this.docApiData = {
        'platform': 3,
        'type': '',
        'isContentDetail': '',
        'resourceId': '',
        'recentHistory': 0,
        'offset': this.itemOffset,
        'limit': this.itemLimit,
        'apiKey': this.apiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'threadIdArray':[],
        'threadCount':'0',
        'priorityIndex':'',
        'searchText':this.searchText,
        'fromWorkstreampage':'',
        'syncWithThreadFromDoc': '',
        'folderId': '',
        'makeId': '',
        'recentUploaded': 0,
        'fromSearch':  this.fromSearchpage
      };
      let sNavUrl = localStorage.getItem('sNavUrl');
      if(r == "documents"){
      //setTimeout(() => {
        this.apiUrl.searchPageDocPageRedirectFlag = "0";
      //}, 10);
        this.accessFrom = 'documents';
        this.loading = true;
        this.contentLoading = true;
        this.loadAction = '';
        this.folderView = false;
        this.mainView = true;
        this.fileView =  false;
        this.mfgView = false;
        if(this.CBADomain){
          this.mfg = [];
          this.mfgId = 0;
          this.opacityFlag = false;
        }
        setTimeout(() => {
          this.contentLoading = true;
          console.log('-----17-----')
          this.getDocumentList();
          this.commonApi.emitDocumentRightPanel(true);
          //this.opacityFlag = false;
          localStorage.removeItem('sNavUrl');
        }, 500);
      }
      else{
        this.setupSearchBack();
      }
    });

    setTimeout(() => {
      this.docComponentRef.emit(this);
    }, 500);

    this.subscription.add(
      this.commonApi.emitOnDocScrollSubject.subscribe((response) => {
        let id = localStorage.getItem('docIddetail');
        if(id != null){
          let fileIndex = this.files.findIndex(option => option.resourceID == id);
          //if(fileIndex >= 0) {
            setTimeout(() => {
              this.scrollToElem(id);
            }, 500);

          //}
        }
      })
      );


    this.subscription.add(
      this.commonApi.documentPanelDataReceivedSubject.subscribe((response) => {
        console.log(response)
        this.panelFlag = response['panelFlag'];
        if(!this.panelFlag) {
          this.priorityIndexValue = "1";
          this.documentIdArrayInfo=[];
          this.docAPiCount='0';

          console.log(this.docInfoData, this.recentViewedDocuments)
          //this.scrollToPos(this.docInfoData.docData.resourceID);
          this.recentViewedDocuments = (this.recentViewedDocuments == undefined || this.recentViewedDocuments == 'undefined') ? [] : this.recentViewedDocuments;
          this.recentUploadedDocuments = (this.recentUploadedDocuments == undefined || this.recentUploadedDocuments == 'undefined') ? [] : this.recentUploadedDocuments;
          if(this.recentViewedDocuments.length > 0) {
            this.recentViewedDocuments.forEach((v, i) => {
              let enable = (i == 0) ? 1 : 0;
              v.docData.expand = enable;
            });
          }
          if(this.recentUploadedDocuments.length > 0) {
            this.recentUploadedDocuments.forEach((u, i) => {
              let enable = (i == 0) ? 1 : 0;
              u.docData.expand = enable;
            });
          }
        } else {
          let docDetail = response['docDetail'];
          let id = docDetail.resourceID;
          this.docInfoData.action = 'load';
          this.docInfoData.docData = docDetail;
          this.emitDocInfo(id);
        }
        this.callback.emit(this);
      })
    );

    this.subscription.add(
      this.commonApi.documentListDataReceivedSubject.subscribe((docsData: any) => {
        console.log(docsData)
        let action = docsData['action'];
        if(action == 'unsubscribe') {
          this.ngOnDestroy();
          return false;
        }
        this.priorityIndexValue = "1";
        this.documentIdArrayInfo=[];
        this.docAPiCount='0';
        this.loadAction = docsData['loadAction'];
        this.displayNoRecords = false;
        this.thumbView = docsData['thumbView'];
        this.mfgView = this.CBADomain && action != 'landingpage' && action != 'search' ? true : false;
        switch (action) {
          case 'filter-toggle':
          case 'toggle':
            this.filterFlag = (action == 'filter-toggle') ? docsData['expandFlag'] : this.filterFlag;
            this.panelFlag = (action == 'toggle') ? docsData['expandFlag'] : this.panelFlag;
            console.log(this.panelFlag)
            if(action == 'toggle') {
              console.log(this.docInfoData)
              //this.scrollToPos(this.docInfoData.docData.resourceID);
            }
            if(!this.CBADomain) {
              this.mfgView = (this.mfgId > 0 && this.mfgInfo.length == 1 && this.subFolderInfo.length == 0) ? !this.mfgView : this.mfgView;
            }
            this.loading = true;
            setTimeout(() => {
              this.setupRecentTabWidth(action, docsData['expandFlag']);
            }, 1);
            this.loading = false;
            break;
          case 'view':
            this.mfgView = (!this.CBADomain && this.mfgId > 0 && this.mfgInfo.length == 1 && this.subFolderInfo.length == 0) ? !this.mfgView : this.mfgView;
            this.loading = false;
            break;
          case 'manufacturer':
          case 'subFolders':
            this.subFolderCount = docsData['subFolderCount'];
            console.log(this.subFolderId, docsData['folderId'])
            //this.subFolderId =
            this.breadcrumb(action, this.subFolderId, docsData['folderId']);
            break;
          case 'folders':
          case 'files':
            this.opacityFlag = false;
            this.subFolderCount = docsData['subFolderCount'];
            //this.emptyPanel();
            setTimeout(() => {
              this.breadcrumb(action, docsData['folderId']);
            }, 50);
            break;
          case 'landingpage':
          case 'search':
            this.loading = true;
            this.accessFrom = action;
            this.emptyPanel();
            this.fromLandingAccess(docsData);
            setTimeout(() => {
              this.loading = false;
            }, 100);
            break;
          case 'folder-creation':
            if(this.mainView) {
              console.log('-----1-----')
              this.getDocumentList(action);
            }
            break;
          case 'folder-edit':
            if(this.mainView) {
              this.loading = true;
              this.accessFrom = action;
              this.emptyPanel();
              this.folderView = false;
              this.mainView = true;
              this.fileView =  false;
              this.mfgView = false;
              console.log('-----18-----')
              this.getDocumentList();
              setTimeout(() => {
                this.loading = false;
              }, 100);
            }
            break;
          case 'pin':
            //this.emptyPanel();
            this.pinFlag = docsData['pinFlag'];
            action = (this.pinFlag) ? 'files' : 'main';
            this.breadcrumb(action);
            break;
          default:
            this.emptyPanel();
            this.loading = true;
            this.filterOptions = docsData.filterOptions;
            this.mfgView = false;
            this.mfgId = 0;
            if(action == 'filter') {
              this.itemOffset = 0;
              this.panelFlag = false;
              if(!this.mainView) {
                action = (this.folderView) ? 'folders' : (this.subFolderView) ? 'subFolders' : 'files';
                this.breadcrumb(action, this.subFolderId, this.folderId);
              } else {
                if(action != 'filter') {
                  this.tabFlag = false;
                  this.recentViewedDocuments = [];
                  this.recentUploadedDocuments = [];
                  this.docInfoData.dataId = 0;
                } else {
                  if(!this.CBADomain) {
                    this.recentViewedDocuments.forEach(t => {
                      t.selected = false;
                    });
                    this.recentUploadedDocuments.forEach(t => {
                      t.selected = false;
                    });
                    setTimeout(() => {
                      this.setupRecentTabWidth(action, this.panelFlag);
                    }, 100);
                  }
                }
                if(this.loadAction != 'push') {
                  this.files = [];
                  this.folders = [];
                }
              }
            }

            if(this.accessFrom == 'documents') {
              if(this.mainView) {
                if(action != 'filter') {
                  if(this.documentViewOption != '2'){
                    this.getdocumentForTab(1, 0);
                    this.getdocumentForTab(0, 1);
                  }
                  else{
                    console.log('-----19-----')
                    this.getDocumentList();
                  }
                  setTimeout(() => {
                    if(this.documentViewOption != '2'){
                      this.innerRecentViewWidth = document.getElementsByClassName('document-tab')[0].clientWidth - 15;
                    }
                  }, 150);
                } else {
                  console.log('-----2-----')
                  this.getDocumentList();
                }
              }
              this.loading = false;
            } else {
              console.log(4564)
              this.fromLandingAccess(docsData);
            }
            break;
        }
        this.bodyHeight = window.innerHeight;
        this.setScreenHeight();
        setTimeout(() => {
          this.showDocuments=true;
          localStorage.removeItem('fromHometoDocuments');
          this.callback.emit(this);
        },200);
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r) => {
        let action = r['action'];
        console.log(r);

        setTimeout(() => {
          let secElement;
          let elem = 'documentList';
          secElement = document.getElementById(elem);
          let docId = localStorage.getItem('docIddetail');
          this.docId = parseInt(r['id']);
          if(docId && !this.mainView){
            this.docId = parseInt(docId);
            let docElement = document.getElementById(docId);
            let rmVal=-80;
            let scrollPos = docElement.offsetTop+rmVal;
            if(this.thumbView) {
              secElement.scrollTop = scrollPos;
            } else {
              docElement.scrollIntoView();
            }
          }
          localStorage.removeItem('docIddetail');
        }, 500);
        this.opacityFlag = false;
        this.onResize(r);

        switch(action) {
          case 'side-menu':
            let access = r['access'];
            let page = r['page'];
            console.log(access)
            if(access == 'Tech Info' || page == 'documents') {
              this.opacityFlag = false;
              let section = (this.fileView) ? 'file-layout' : 'folder-layout';
              let data = {
                action: section,
                access: section
              }
              this.commonApi.emitMessageLayoutrefresh(data);
            }
            break;
          case 'doc-push':
            let cpushData:any = r['pushData'];
            console.log(r);
            let folders = cpushData.fileCount;
            //let wsFlag = cpushData.wsFlag;
            this.contentLoading = false;
            let timeout = (this.mainView) ? 0 : 1000;
            setTimeout(() => {
              this.getdocumentForTab(0, 1, action);
              this.recentTabs[0].selected = false;
              this.recentTabs[1].selected = true;
            }, timeout);
            //setTimeout(() => {
              console.log(folders, this.folders)
              folders.forEach(item => {
                let fid = item.id;
                let fcount = item.fileCount;
                let sfcount = item.subFolderCount;
                if(this.mainView || this.folderView) {
                  let findex = this.folders.findIndex(option => option.id == fid);
                  if(findex >= 0) {
                    this.folders[findex].fileCount = fcount;
                    this.folders[findex].subFolderCount = sfcount;
                  }
                }

                console.log('Main View: ', this.mainView)
                console.log('Folder View: ',this.folderView)
                console.log('Subfolder View: ', this.subFolderView)
                console.log('Subfolder Info: ', this.subFolderInfo)
                console.log('MFG View :', this.mfgView)
                console.log('MFG Info: ', this.mfgInfo)
                console.log('File View: ', this.fileView)
                console.log(this.subFolderId, fid)

                if(this.fileView) {
                  this.contentLoading = false;
                  if(this.subFolderId == parseInt(fid)) {
                    console.log('-----3-----')
                    this.loadAction = 'push';
                    this.getDocumentList('push');
                  }
                }
                return false;
              });
            //}, 1000);
            break;
          case 'silentDelete':
            let dataId = r['dataId'];
            if(this.mainView) {
              let rvIndex = this.recentViewedDocuments.findIndex(option => option.resourceID == dataId);
              if(rvIndex >= 0) {
                this.recentViewedDocuments.splice(rvIndex, 1);
              }
              let ruIndex = this.recentUploadedDocuments.findIndex(option => option.resourceID == dataId);
              if(ruIndex >= 0) {
                this.recentViewedDocuments.splice(rvIndex, 1);
              }
              setTimeout(() => {
                this.contentLoading = true;
                this.itemOffset = 0;
                if(this.documentViewOption != '2'){
                  this.getdocumentForTab(1, 0);
                  this.getdocumentForTab(0, 1);
                }
                else{
                  console.log('-----11-----')
                  this.getDocumentList();
                }
                let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
                this.innerRecentViewWidth = documentWidth + 200;
                let section = (this.fileView) ? 'file-layout' : 'folder-layout';
                let data = {
                  action: section,
                  access: section
                }
                this.commonApi.emitMessageLayoutrefresh(data);
              }, 500);
            } else {
              let fileIndex = this.files.findIndex(option => option.resourceID === dataId);
              this.files.splice(fileIndex, 1);

              setTimeout(() => {
                let fileLen = this.files.length;
                console.log(fileLen)
                if(fileLen > 0) {
                  console.log('in')
                  fileIndex = (fileIndex > 0 || fileIndex == fileLen) ? fileIndex-1 : fileIndex+1;
                  console.log(fileIndex)
                  this.scrollToElem(this.files[fileIndex].resourceID);
                }
                let fileData = {
                  access: this.accessFrom,
                  items: this.files,
                  thumbView: this.thumbView
                }
                this.commonApi.emitFileList(fileData);
              }, 100);
            }
            return false;
            break;
          case 'updateLayout':
          case 'updateLayout-documents':
            if(action == 'updateLayout-documents') {
              this.contentLoading = true;
              this.docApiData.threadIdArray = [];
            }
            this.commonApi.emitMessageLayoutChange(true);
            break;
        }
        setTimeout(() => {
          this.callback.emit(this);
        }, 500);
      })
    );

    this.docApiCall = this.commonApi.documentApiCallSubject.subscribe(docsData => {
      console.log(docsData)
      this.titleService.setTitle(localStorage.getItem('platformName')+' - Workstreams');
      this.displayNoRecords = false;
      let action = docsData['action'];
      this.thumbView = docsData['thumbView'];
      this.loading = true;
      this.accessFrom = action;
      this.emptyPanel();
      this.fromLandingAccess(docsData);
      setTimeout(() => {
        this.loading = false;
        this.docApiCall.unsubscribe();
      }, 100);
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      setTimeout(() => {
        this.callback.emit(this);
      }, 500);
    });


    this.subscription.add(
      this.commonApi.documentPanelFlagReceivedSubject.subscribe((response) => {
        console.log(response);
        this.docScroll = false;
        setTimeout(() => {
          this.callback.emit(this);
        }, 500);
      }));


    this.docWsApiCall = this.commonApi.documentWSApiCallSubject.subscribe(docsData => {
      console.log(docsData)
      let action = docsData['action'];
      if(action == 'unsubscribe') {
        this.docWsApiCall.unsubscribe();
        return false;
      } else {
        this.titleService.setTitle(localStorage.getItem('platformName')+' - Workstreams');
        this.displayNoRecords = false;
        let action = docsData['action'];
        this.thumbView = docsData['thumbView'];
        this.loading = true;
        this.accessFrom = action;
        this.emptyPanel();
        this.fromLandingAccess(docsData);
        setTimeout(() => {
          this.loading = false;
          this.docApiCall.unsubscribe();
        }, 100);
        this.bodyHeight = window.innerHeight;
        this.setScreenHeight();
      }
      setTimeout(() => {
        this.loading = false;
       // this.docWsApiCall.unsubscribe();
       setTimeout(() => {
          this.callback.emit(this);
        }, 500);
      }, 100);
    });

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r: any) => {
        if(this.mainView && (r != this.panelFlag)) {
          this.panelFlag = r;
          this.priorityIndexValue = "1";
          this.documentIdArrayInfo=[];
          this.docAPiCount='0';

          let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
          if(this.recentUploadedDocuments.length == 0 || this.recentViewedDocuments.length == 0) {
            this.innerRecentViewWidth = documentWidth;
          } else {
            if (!this.panelFlag) {
              let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
              this.innerRecentViewWidth = documentWidth + 200;
            } else {
              let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
              this.innerRecentViewWidth = documentWidth - 260;
            }
          }
        }
        setTimeout(() => {
          this.opacityFlag=false;
          this.callback.emit(this);
        }, 500);
      })
    );

    this.subscription.add(
      this.commonApi.docScroll.subscribe((response) => {
        console.log(response, this.fileView, this.panelFlag);
        let flag = response['expand'];
        let access = response['access'];
        if(this.fileView && (access == 'files' && !this.panelFlag) || (!flag && access == 'toggle')) {
          if(this.thumbView && document.getElementsByClassName('documents-grid-row')) {
            this.docRowHeight = document.getElementsByClassName('documents-grid-row')[0].clientHeight;
            document.getElementById('documentList').style.height = `${this.docRowHeight} px`;
          }
          setTimeout(() => {
            this.scrollToPos(response['id'], flag);
            this.callback.emit(this);
          }, 750);
        }
      })
    );
  }

  scrollToPos(id, flag) {
    this.panelFlag = flag;
    let docElement = document.getElementById(id);
    let rmVal = (flag) ? 0 : -80;
    if(docElement != null) {
      console.log(flag, docElement.offsetTop, rmVal)
      this.scrollPos = docElement.offsetTop+rmVal;
      let secElement = document.getElementById('documentList');
      setTimeout(() => {
        secElement.scrollTop = this.scrollPos;
      }, 200);
    }
  }

  // Get Recent Document Lists
  getdocumentForTab(recentHistory, recentUploaded, action = '') {
    if(this.documentViewOption != "2"){
    let expand = (this.panelFlag) ? 0 : 1;
    this.docApiData.offset = 0;
    this.docApiData.limit = 10;
    this.docApiData.folderId = 0;
    this.docApiData.makeId = 0;
    this.docApiData.type = '';
    this.docApiData.filterOptions = [];
    this.docApiData.recentHistory = recentHistory;
    this.docApiData.recentUploaded = recentUploaded;
    this.docApiData.expand = expand;

    this.documentationService.getALLDocument(this.docApiData).then((documents: any) => {
      let dataId = -1;
      let flag = false;
      let tabLoader = documents.loader;
      console.log(documents)
      this.tabFlag = !tabLoader;
      if(!tabLoader) {
        if (recentUploaded == 1 && action == '') {
          this.recentUploadedDocuments = documents.files;
          this.recentUploadedDocuments.forEach((item, i) => {
            this.setupAttachments('uploaded', item.docData, i);
          });
          console.log('-----4-----')
          this.getDocumentList();
        }
        if (documents.files.length > 0) {
          if (recentHistory == 1)
            this.recentViewedDocuments = documents.files;
            setTimeout(() => {
              this.recentViewedDocuments.forEach((item, i) => {
                this.setupAttachments('view', item.docData, i);
              });
              console.log(this.docInfoData.dataId)
              this.recentViewedDocuments = (this.recentViewedDocuments == 'undefined' || this.recentViewedDocuments == undefined) ? [] : this.recentViewedDocuments;
              if(this.docInfoData.dataId <= 0 && (this.recentViewedDocuments != 'undefined' || this.recentViewedDocuments != undefined) && (this.recentViewedDocuments.length > 0)) {
                console.log(this.recentViewedDocuments)
                //this.tabFlag = true;
                if(this.tab != 'viewed') {
                  this.recentTab('trigger', this.recentTabs[1]);
                  localStorage.removeItem('documentTab');
                }
              }
            }, 500);

        } else {
          this.recentViewedDocuments = [];
          this.recentUploadedDocuments = [];
        }
      }
    });
    }
    else{
      this.recentViewedDocuments = [];
      this.recentUploadedDocuments = [];
      console.log('-----12-----')
      this.getDocumentList();
    }
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  updateSearchKeyword(keyword)
  {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);

    this.LandingpagewidgetsAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {

    });


  }
  loadDocumentPageSolr(searchValue,listingSolr=0)
  {
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

      let FiltersArr={};
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
      if(listingSolr && this.groupInfo)
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
      /*if(searchparamsjson['keyword'] && searchparamsjson['keyword']!='' && searchparamsjson['keyword']!=null)
      {
        objData["query"]=searchparamsjson['keyword'];
      }
      else
      {
        objData["query"]=searchValue;
      }*/

      if(searchparamsjson && searchparamsjson['keyword'] && searchparamsjson['keyword'] != ''){
        objData["query"] = searchparamsjson['keyword'];
      } else {
        objData["query"] = searchValue;
      }

     // objData["query"]=searchValue;
      objData["rows"]=this.itemLimit;
      objData["start"]=this.itemOffset;
      objData["type"]=2;
      objData["filters"]=FiltersArr;

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
  apiDatasocial.append('domainId', this.apiData["domainId"]);
  apiDatasocial.append('workstreamIds', workstreamFilterArr);
  apiDatasocial.append('userId', this.userId);
  apiDatasocial.append('contentTypeId', '4');
  let platformIdInfo = localStorage.getItem('platformId');

  this.baseSerivce.postFormData("forum", "resetWorkstreamContentTypeCount", apiDatasocial).subscribe((response: any) => { })
      }
      }
      if(!listingSolr && this.itemOffset == 0)
      {
        this.updateSearchKeyword(searchValue);
      }

      let push = false;
   // let data_arr=["domain_id"]
    /*let apiData = {

      "query": searchValue,
      "rows": this.itemLimit,
      "start": this.itemOffset,
      "filters": {"domainId":this.apiData["domainId"]},
      "type":2
      //filters: {},

    };*/


      this.documentationService.getALLDocumentFromSolr(objData).then((documents: any) => {
        console.log(documents);
        if(this.fromSearchpage) {
          this.searchResultData.emit(documents.filterData);
        } else {
          this.searchResultData.emit(documents.facets);
        }

        if (documents.total>0) {
          this.searchnorecordflag = false;
          this.scrollCallback = true;
        }
        if(this.accessFrom == 'landingpage' && this.itemOffset == 0 && documents.total == 0) {
          this.displayNoRecordsShow = (this.apiUrl.searchFromWorkstream) ? 1 : 0;
        } else {
          this.displayNoRecordsShow = 0;
        }

        this.files.push(...documents.files);
        this.docAPiCount=documents.total;

        this.scrollInit = 1;
        this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
        console.log(this.itemTotal);
        console.log(this.fileView);
        if(this.fileView) {
          this.itemLength += documents.files.length;
         this.loading = false; this.contentLoading = this.loading;

        }
        //this.fileLoader = this.contentLoading;
        let fileData = {
          access: this.accessFrom,
          items: this.files,
          thumbView: this.thumbView
        }
        this.commonApi.emitFileList(fileData);
        this.searchLoading = false;
        this.lazyLoading = false;
        setTimeout(() => {
          let listItemHeight;
          console.log(this.accessFrom)
          let rmHeight = 120;
          if(document.getElementsByClassName('documents-grid-row')) {
            listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)-rmHeight;
          }

          //let listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)-10;
          console.log(this.itemTotal, this.itemLength, documents.total, this.innerHeight, listItemHeight)
          if(documents.total > 0 && this.itemTotal > this.itemLength && this.innerHeight > listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.loadDataEvent = true;
            this.itemOffset += this.itemLimit;
            if(this.accessFrom == 'documents') {
              if(!this.thumbView && this.fileView){
                console.log('-----6-----')
                this.getDocumentPGList();
              }
              else{
                this.lazyLoading = true;
                console.log('-----7-----')
                this.getDocumentList();
              }
            }
            else{
              console.log('-----8-----')
              setTimeout(() => {
                this.getDocumentList();
                if(this.accessFrom == 'landing') {
                  let wsResData = {
                    access: 'documents'
                  }
                  this.commonApi.emitWorkstreamListData(wsResData);
                }
              }, 500);
            }
            this.lastScrollTop = this.scrollTop;
          }
        }, 1200)
  }

    );


  }

  getDocumentList(action='') {
    console.log(action)
    let newFolder='';
    if(action=='folder-creation' || action == 'push')
    {
      this.itemOffset=0;
      this.itemLimit=1;
      setTimeout(() => {
        this.itemLimit = 20;
      }, 100);
      newFolder = (action == 'folder-creation') ? '1' : newFolder;
    }
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.contentLoading = (this.loadAction == 'push' || action == 'push') ? false : true;
    if(this.loadAction == 'load') {
      let timeout = (this.mainView) ? 0 : 500;
      setTimeout(() => {
        this.getdocumentForTab(0, 1);
        this.recentTabs[0].selected = false;
        this.recentTabs[1].selected = true;
      }, timeout);
    }
    this.fileLoader = this.contentLoading;
    setTimeout(() => {
      this.loadAction = '';
    }, 150);
    let expand = (this.panelFlag) ? 0 : 1;
    let filterOptions = JSON.stringify(this.filterOptions);
    let threadIdArrayInfo1 = JSON.stringify(this.documentIdArrayInfo);

    this.docApiData.offset = this.itemOffset;
    this.docApiData.limit = this.itemLimit;
    this.docApiData.type = (this.pinFlag) ? 'pinned' : '';
    this.docApiData.mfgId = this.mfgId;
    if(this.documentViewOption != '2'){
      this.docApiData.folderId = this.subFolderId;
    }
    else{
      if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {
        this.docApiData.folderId = this.subFolderId;
      }
      else{
        this.docApiData.documentViewOption = this.documentViewOption;
        this.docApiData.folderId = this.subFolderId == '' ? this.documentMfgIdOption : this.subFolderId;
        this.docApiData.ismfg = (this.subFolderId == '' || this.subFolderId == '46') && this.mfgId == '0' ? "1" : "";
        this.docApiData.isOtherTechInfo = this.subFolderId == '51' ? "1" : "";
        this.docApiData.otherTechInfoId = this.otherTechInfoId;
      }

    }
    this.docApiData.makeId = this.folderId;
    this.docApiData.filterOptions =filterOptions;
    this.docApiData.platform='3';
    this.docApiData.fromSearch=this.fromSearchpage;
    this.docApiData.searchText=this.searchText;
    this.docApiData.isNewFolder=newFolder;
    this.docApiData.recentHistory = 0;
    this.docApiData.recentUploaded = 0;
    this.docApiData.expand = expand;
    if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {
      this.docApiData.threadIdArray = threadIdArrayInfo1;
      this.docApiData.threadCount=this.docAPiCount;
      console.log(this.docInfoData)
      if(this.accessFrom == 'landingpage') {
        this.contentLoading = true;
        this.docApiData.threadIdArray = [];
      }
      this.docApiData.groups = this.groupInfo;
      this.docApiData.fromWorkstreampage = 1;
    }
    if(this.accessFrom == 'search')
    {
      if (this.priorityIndexValue) {
        this.docApiData.priorityIndex = this.priorityIndexValue;
      } else {
        this.docApiData.priorityIndex = '1';
      }
    }

    let solrUpdate=0;
    let listingSolr=0;

    if (this.accessFrom == 'search' && (this.collabticDomain || this.CBADomain || this.tvsFlag)) {
      solrUpdate=1;
      //this.rmHeight = 230;
    } else if(this.accessFrom == 'landingpage' && (this.collabticDomain || this.CBADomain || this.domainId==82 || this.domainId==52)) {
      solrUpdate = 1;
      listingSolr = (this.apiUrl.searchFromWorkstreamValue == '') ? 1 : 0;
      this.searchText = this.apiUrl.searchFromWorkstreamValue;
    } else {
      solrUpdate=0;
      listingSolr=0;
      if(this.accessFrom == 'landingpage' && this.apiUrl.searchFromWorkstream) {
        this.docApiData.searchText = this.apiUrl.searchFromWorkstreamValue;
      }
    }
    if (solrUpdate==1) {

      if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {
        if(this.apiUrl.enableAccessLevel){
          setTimeout(() => {
            if(!this.accessLevel.view){
              this.loading = false;
              this.searchLoading = false;
              this.contentLoading = false;
              this.opacityFlag = false;
              this.files=[];
              this.displayNoRecordsShow = 5;
              this.accessCheck = '1';
              return false;
            }
            else{
              this.loadDocumentPageSolr(this.searchText,listingSolr);
            }
          }, 1000);

        }
        else{
          this.loadDocumentPageSolr(this.searchText,listingSolr);
        }
      }
      else{
        this.loadDocumentPageSolr(this.searchText,listingSolr);
      }




    } else {
      console.log(this.mainView, this.folderView)
      if(this.CBADomain && !this.mainView && this.folderView) {
        console.log(this.otherTechInfoId, this.docApiData)
        //this.subFolderId = this.otherTechInfoId;
        //this.otherTechInfoId = 0;
      }


    this.documentationService.getALLDocument(this.docApiData).then((documents: any) => {
      if(this.accessFrom == 'documents') {
        //console.log(filterOptions)
        localStorage.setItem('docFilter', filterOptions);
      }
      if(this.accessFrom == 'landingpage' && this.itemOffset == 0 && documents.total == 0) {
        this.displayNoRecordsShow = (this.apiUrl.searchFromWorkstream) ? 1 : 0;
      } else {
        this.displayNoRecordsShow = 0;
      }

      this.contentLoading = documents.loader;

      if (!this.contentLoading) {
        console.log(documents)
        this.lazyLoading = this.contentLoading;
        this.loadDataEvent=false;
        this.scrollCallback = true;

        if(this.accessFrom == 'search'){
          let priorityIndexValue = documents.priorityIndexValue;
          let threadIdArrayInfo_1 = documents.docInfoArray;
          this.docAPiCount=documents.total;
          console.log(threadIdArrayInfo_1);

          // Search Page - Getting 'No records found' message even if we have records -- start
          switch(priorityIndexValue){
            case "1":
              if (documents.total>0) {
                this.searchnorecordflag = false;
              }
            break;
            case "2":
              if (documents.total>0) {
                this.searchnorecordflag = false;
              }
            break;
            case "3":
              if (documents.total>0) {
                this.searchnorecordflag = false;
              }
            break;
            case "4":
              if (documents.total>0) {
                this.searchnorecordflag = false;
              }
              else{
                this.searchnorecordflag = false;
              }
            break;
          }
          if (priorityIndexValue < "5" && priorityIndexValue) {
            if(!this.searchnorecordflag){
              this.searchLoading = false;
            }
          }
          else{
            this.searchLoading = false;
            this.searchnorecordflag = false;
          }

          // Search Page - Getting 'No records found' message even if we have records -- end

          if (threadIdArrayInfo_1 && threadIdArrayInfo_1.length>0) {
            for (let t1 = 0; t1 < threadIdArrayInfo_1.length; t1++) {
              this.documentIdArrayInfo.push(threadIdArrayInfo_1[t1]);
            }
          }
          console.log(JSON.stringify(this.documentIdArrayInfo));
          if (priorityIndexValue < "4" && priorityIndexValue) {
            let limitoffset = this.itemOffset + this.itemLimit;
            if (documents.total == 0 || limitoffset >= documents.total) {
              priorityIndexValue = parseInt(priorityIndexValue) + 1;

              this.priorityIndexValue = priorityIndexValue.toString();
              this.itemOffset = 0;
              console.log('-----5-----')
              this.getDocumentList();
              this.loadDataEvent = true;
            }
          }
        }
        this.scrollInit = 1;
        this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
        console.log(this.fileView, action)
        if(this.fileView) {
          this.itemLength += documents.files.length;
          this.loading = false; this.contentLoading = this.loading;
          if(action == 'push') {
            this.files.unshift(...documents.files);
            let fileData = {
              action,
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            this.commonApi.emitFileList(fileData);
            return false;
          } else {
            this.files.push(...documents.files);
          }

          if(this.itemOffset >= this.itemLimit) {
            this.fileLoader = this.contentLoading;
            let fileData = {
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            this.commonApi.emitFileList(fileData);
          } else {
            setTimeout(() => {
              this.loading = false;
              let docRow = document.getElementsByClassName('documents-grid-row');
              if(docRow) {
                this.docRowHeight = docRow[0].clientHeight;
              }
              this.fileLoader = this.contentLoading;
            },500)
            if(this.files.length > 0) {
              this.opacityFlag = false;
              if(this.subFolderView) {
                this.panelFlag = true;
              }
            } else {
              this.opacityFlag = false;
              this.emptyPanel();
            }
          }
        } else if(this.mfgView) {
          this.itemLength += (documents.folders.length + documents.files.length);
          this.loading = false; this.contentLoading = this.loading;
          if(this.loadAction == 'push') {
            this.mfg = documents.mfg;
          } else {
            this.mfg.push(...documents.mfg)
          }
        }
        else {
          this.itemLength += documents.folders.length;
          this.loading = false; this.contentLoading = this.loading;
          if(this.loadAction == 'push') {
            this.folders = documents.folders;
          } else {
            this.folders.push(...documents.folders);
          }
        }
        this.mfgInfo = documents.mfgInfo;
        this.folderInfo = documents.folderInfo;
        this.subFolderInfo = documents.makeInfo;
        if(this.documentViewOption == '2'){
          this.otherTechInfo = documents.otherTechInfo;
          let otid = this.folderInfo.length > 0 && this.mfgInfo.length == 0 && this.folderInfo[0].id != this.documentMfgIdOption ? this.folderInfo[0].id : '';
          this.otherTechInfoId = otid;
          console.log(this.otherTechInfo );
          console.log(this.otherTechInfoId );
        }
        console.log(this.mfgInfo );
        console.log(this.folderInfo );
        console.log(this.subFolderInfo );


        let secElement = document.getElementById('documentList');
        setTimeout(() => {
          if(!this.docScroll){
            secElement.scrollTop = this.scrollPos;
          }
        }, 200);

        setTimeout(() => {
          let listItemHeight;
          console.log(this.accessFrom)
          let rmHeight = 120;
          if(document.getElementsByClassName('documents-grid-row')) {
            listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)-rmHeight;
          }

          //let listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)-10;
          console.log(this.itemTotal, this.itemLength, documents.total, this.innerHeight, listItemHeight)
          if(documents.total > 0 && this.itemTotal > this.itemLength && this.innerHeight > listItemHeight) {
            this.scrollCallback = false;
            //this.lazyLoading = true;
            this.loadDataEvent = true;
            this.itemOffset += this.itemLimit;
            if(this.accessFrom == 'documents') {
              if(!this.thumbView && this.fileView){
                console.log('-----6-----')
                this.getDocumentPGList();
              }
              else{
                this.lazyLoading = true;
                console.log('-----7-----')
                this.getDocumentList();
              }
            }
            else{
              console.log('-----8-----')
              setTimeout(() => {
                this.getDocumentList();
                if(this.accessFrom == 'landing') {
                  let wsResData = {
                    access: 'documents'
                  }
                  this.commonApi.emitWorkstreamListData(wsResData);
                }
              }, 500);
            }
            this.lastScrollTop = this.scrollTop;
          }
        }, 500)
      }
    });
  }
  console.log("----------- set false -------")
  //this.docScroll = false;
    setTimeout(() => {
      this.callback.emit(this);
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
      this.emitDocInfo(dataId);
      setTimeout(() => {
        this.recentTabs.forEach(t => {
          t.selected = (t.control == action) ? true : false;
        });
      }, 100);
    }
    setTimeout(() => {
      if(action == 'uploaded') {
        this.deselectTab(this.recentViewedDocuments);
      } else {
        this.deselectTab(this.recentUploadedDocuments);
      }
    }, 100);

    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
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

  // Document Selection
  docSelection(list, item) {
    for(let d of list) {
      d.selected = (parseInt(d.resourceID) == item.resourceID) ? true : false;
    }
    console.log(list, this.panelFlag)
    //if(!this.panelFlag) {
      let data = {
        access: 'documents',
        flag: this.panelFlag,
        docData: item.docData
      }
      this.commonApi.emitDocumentPanelFlag(data);
    //}
    let timeout = (this.panelFlag) ? 0 : 100;
    setTimeout(() => {
      let id = item.resourceID
      this.docInfoData.action = 'load';
      this.docInfoData.docData = item.docData;
      this.emitDocInfo(id);
    }, timeout);
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  // Emit Document Info
  emitDocInfo(dataId) {
    console.log(dataId, this.docInfoData)
    this.docInfoData.loading = true;
    this.docInfoData.dataId = dataId;
    this.commonApi.emitDocumentInfoData(this.docInfoData);
    if(this.docInfoData.action != 'empty') {
      this.apiData.dataId = dataId;
      this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
    }
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  // Clear Page
  clearSection(item = '') {
    this.docId = 0;
    let emptyVal = 0;
    this.scrollTop = emptyVal;
    this.scrollInit = emptyVal;
    this.lastScrollTop = emptyVal;
    this.scrollPos = emptyVal;
    this.itemOffset = emptyVal;
    this.itemLength = emptyVal;
    this.itemTotal = emptyVal;
    this.docInfoData.action = 'empty';
    this.docInfoData.docData = [];
    let dataId = -1;
    this.emitDocInfo(dataId);
    setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  breadcrumb(action, id='', sid='') {
    if(this.documentViewOption == "2"){
      if(action == 'folders' && id == ''){
        action = "main";
      }
      if(action == 'files' && id == '51' && sid == ''){
        action = "folders";
        this.otherTechInfoFlag = false;
      }
    }
    console.log(action);
    console.log(id);
    console.log(sid);
    console.log(this.subFolderCount, this.otherTechInfo);
    this.panelFlag = false;
    let flag = false;
    let apiCall = true;
    this.clearSection();
    this.commonApi.emitDocumentRightPanel(true);
    switch(action) {
      case 'manufacturer':
        this.docRowHeight = 0;
        this.fileLoader = true;
        this.files = [];
        this.folders = [];
        this.mfg = [];
        this.mainView = flag;
        this.mfgView = true;
        this.fileView = false;
        this.mfgId = sid;
        this.subFolderView = flag;
        this.folderId = '';
        break;

      case 'subFolders':
      case 'files':
        //this.emptyPanel();
        this.docRowHeight = 0;
        this.fileLoader = true;
        this.files = [];
        this.folders = [];
        this.mfg = [];
        this.mainView = flag;
        this.folderView = flag;
        this.subFolderView = (action == 'subFolders') ? true : flag;
        this.fileView = true;
        this.subFolderId = id;
        this.folderId = sid;
        break;
      case 'folders':
      default:
        this.mainView = (action == 'main') ? true : false;
        this.folderView = (action == 'main') ? flag : true;
        this.subFolderView = flag;
        this.fileView = flag;
        this.subFolderId = (action == 'main') ? '' : id;
        this.folderId = '';
        this.files = [];
        this.folders = [];
        this.mfg = [];
        this.mfgId = 0;
        this.mfgView = false;
        if(this.folderView || action == 'main') {
          //this.emptyPanel();
        }
        if(action == 'main') {
          let data = {
            action: action,
            docData: [],
            thumbView: this.thumbView,
          }
          this.commonApi.emitDocumentPanelFlag(data);
          if(!this.CBADomain) {
            let timeout = (this.panelFlag) ? 0 : 150;
            setTimeout(() => {
              console.log(this.panelFlag)
              if(this.documentViewOption != '2'){
                this.getdocumentForTab(1, 0);
              }
              this.deselectTab(this.recentViewedDocuments);
              this.deselectTab(this.recentUploadedDocuments);
              setTimeout(() => {
                this.setupRecentTabWidth('trigger', true);
              }, 500);
            }, timeout);
          }
        }
        break;
    }

    if(apiCall) {
      //this.docInfoData.docData = [];
      //this.emitDocInfo(0);
      this.contentLoading = true;
      console.log('-----8-----')
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      setTimeout(() => {
        this.getDocumentList();
      }, 100);

    }
    setTimeout(() => {
      this.callback.emit(this);
    }, 1500);
  }

  // Empty Right Panel
  emptyPanel() {
    let dataId = -1;
    this.docInfoData.action = 'empty';
    this.emitDocInfo(dataId);
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

  // From Landing Page Access
  fromLandingAccess(docsData) {
    console.log(docsData);
    this.filterOptions = [];
    if(docsData['accessFrom']=='search') {
      this.fileView=false;
      this.folderView=false;
      if(docsData['filterOptions'] && docsData['filterOptions']!=null) {
        this.filterOptions=JSON.stringify(docsData['filterOptions']);
      }
      this.fromSearchpage='1';
      this.searchText=docsData['searchText'];
      this.searchLoading = true;
      this.searchnorecordflag = true;
      if(this.CBADomain){
        let searchParams = docsData['searchParams'] != undefined ? docsData['searchParams'] : '';
        console.log(searchParams);
        this.searchParams = searchParams;
      }
    } else {
      this.searchText = docsData['searchVal'];
      this.groupInfo = JSON.stringify(docsData['filterOptions'].workstream);
    }

    this.loading = false;
    this.breadcrumb('files');
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
    if(this.approvalEnableDomainFlag){
      setTimeout(() => {
        if(this.contentLoading){
            this.itemOffset = 0;
            if(this.documentViewOption != '2'){
              this.getdocumentForTab(1, 0);
              this.getdocumentForTab(0, 1);
            }
            else{
              console.log('-----13-----')
              this.getDocumentList();
            }
            setTimeout(() => {
              if(this.documentViewOption != '2'){
                this.innerRecentViewWidth = document.getElementsByClassName('document-tab')[0].clientWidth - 15;
              }
            }, 150);
        }
      }, 3000);
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let rmHeight = 0;
    console.log(this.accessFrom)
   if(this.accessFrom == 'documents'){
     rmHeight = 40;
   }
   else if(this.accessFrom == 'search'){
     rmHeight = 120;
    }
    else{
      rmHeight = 102;
    }
    //let rmHeight = (this.accessFrom == 'documents') ? 0 : 70;
    rmHeight = (this.thumbView) ? rmHeight : 95;
    let headerHeight = 0;
    let headerHeight1 = 0;
    if(!this.teamSystem) {
      headerHeight = (document.getElementsByClassName('prob-header')[0]) ? document.getElementsByClassName('prob-header')[0].clientHeight : headerHeight;
      headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? 0 : 0;
      headerHeight = headerHeight1 +  headerHeight1;
    }
    let titleHeight = (this.accessFrom != 'documents') ? 10 : (document.getElementsByClassName('document-list-head')[0]) ? document.getElementsByClassName('document-list-head')[0].clientHeight : 10;
    titleHeight = (!this.thumbView) ? titleHeight - 55 : titleHeight + 5;
    let footerHeight = (document.getElementsByClassName('footer-content')[0]) ? document.getElementsByClassName('footer-content')[0].clientHeight : 0;
    this.innerHeight = (this.bodyHeight - (headerHeight + footerHeight + 46));
    this.innerHeight = this.innerHeight - titleHeight;
    this.innerHeight = this.innerHeight - rmHeight;
  }

  // Scroll Down
  @HostListener('scroll', ['$event'])

  onScroll(event: any) {
    this.mainScroll(event);
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let url:any = this.router.url;
    let currUrl = url.split('/');
    //|| (currUrl[1] == RedirectionPage.Documents && currUrl[2] == 'view')
    console.log(currUrl[1], currUrl.length)
    if((currUrl[1] == RedirectionPage.Documents && currUrl.left < 2) || (currUrl[1] == RedirectionPage.Documents && currUrl[2] == 'view')) {
      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.setScreenHeight();
        this.opacityFlag=true;
        setTimeout(() => {
          this.opacityFlag=false;
        }, 500);
        //if(this.mainView) { this.setupRecentTabWidth(this.panelFlag); }
        this.commonApi.emitMessageLayoutChange(true);
      }, 50);
    }
  }

  getDocumentPGList() {
    let newFolder='';
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.contentLoading = true;
    let expand = (this.panelFlag) ? 0 : 1;
    let filterOptions = JSON.stringify(this.filterOptions);
    this.docApiData.offset = this.itemOffset;
    this.docApiData.limit = this.itemLimit;
    this.docApiData.type = (this.pinFlag) ? 'pinned' : '';
    this.docApiData.folderId = this.subFolderId;
    this.docApiData.makeId = this.folderId;
    this.docApiData.filterOptions = filterOptions;
    this.docApiData.fromSearch=this.fromSearchpage;
    this.docApiData.searchText=this.searchText;
    this.docApiData.isNewFolder=newFolder;
    this.docApiData.recentHistory = 0;
    this.docApiData.recentUploaded = 0;
    this.docApiData.expand = expand;

    if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {
      console.log(this.docInfoData)
      this.docApiData.groups = this.groupInfo;
      this.docApiData.fromWorkstreampage = 1;
    }

    this.documentationService.getALLDocument(this.docApiData).then((documents: any) => {
      if(this.accessFrom == 'documents') {
        //console.log(filterOptions)
        localStorage.setItem('docFilter', filterOptions);
      }
      this.contentLoading = documents.loader;
      if (!this.contentLoading) {
        console.log(documents)
        this.lazyLoading = this.contentLoading;
        this.loadDataEvent=false;
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
        console.log(this.fileView)
        if(this.fileView) {
          this.itemLength += documents.files.length;
          this.loading = false; this.contentLoading = this.loading;
          this.files.push(...documents.files);
          if(this.itemOffset >= this.itemLimit) {
            this.fileLoader = this.contentLoading;
            let fileData = {
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            this.commonApi.emitFileList(fileData);
          }
        }
      }
    });
  }

  // scroll event
  scrollAction(event){
    if(!this.thumbView) {
      if(this.fileView) {
        this.scrollTop = event.target.scrollTop-90;
        let totalHeight = event.target.scrollTop+event.target.offsetHeight;
        let scrollHeight = event.target.scrollHeight-10;
        console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+totalHeight+'--'+scrollHeight);
        console.log(this.itemTotal, this.itemLength)
        if((totalHeight>=scrollHeight) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false) {
          this.scrollCallback = false;
          this.lazyLoading = true;
          this.loadDataEvent = true;
          this.itemOffset += this.itemLimit;
          this.getDocumentPGList();
          this.lastScrollTop = this.scrollTop;
          event.preventDefault;
        }
      } else {
        this.mainScroll(event);
      }
    }
  };

  mainScroll(event) {
    let isNearBottom = this.documentationService.isUserNearBottom(event);
    let isBottomVal:any = this.documentationService.isUserNearBottomVal(event);
    let threshold = 80;
    this.scrollTop = event.target.scrollTop;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      console.log(this.itemTotal, this.itemLength)
      console.log(this.scrollCallback, isNearBottom)
      if (isNearBottom && this.scrollCallback && this.itemTotal > this.itemLength) { // May be check with files count also
        this.scrollCallback = false;
        this.itemOffset += this.itemLimit;
        this.lazyLoading = true;
        this.loadDataEvent = true;
        this.scrollPos = parseInt(isBottomVal)/2;
        this.docScroll = true;
        console.log('-----15-----')
        this.getDocumentList();
      }
    }
    this.lastScrollTop = this.scrollTop+1;
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    if(secElement != undefined || secElement != null){
      let scrollTop = secElement.offsetTop;
      console.log(secElement, this.thumbView, scrollTop)
      let dsecElement = document.getElementById('documentList');
      //setTimeout(() => {
        dsecElement.scrollTop = scrollTop-80;
      //}, 200);
      this.opacityFlag = false;
      setTimeout(() => {
        localStorage.removeItem('docId');
      }, 100);
    }
    else{
      this.opacityFlag = false;
    }
  }

  // Ondestroy
  ngOnDestroy() {
    let ws = [];
    let docFilterData:any = localStorage.getItem('docFilter');
    let docFilter = (docFilterData == undefined || docFilterData == 'undefined') ? [] : JSON.parse(docFilterData);
    if(docFilter) {
      if(docFilter.workstream) {
        docFilter.workstream = ws;
      }
    }
    this.subscription.unsubscribe();
    this.doconCloseAPI.unsubscribe();
     this.bodyHeight = window.innerHeight;
     setTimeout(() => {
      this.callback.emit(this);
    }, 500);
  }

  setupSearchBack() {
    console.log('in search back')
    this.fileLoader = true;
    this.mainView = false;
    this.folderView = false;
    this.subFolderView = false;
    this.fileView =  true;
    this.accessFrom = 'landingpage';
    this.loading = false;
    this.contentLoading = true;
    this.loadAction = '';
    this.files = [];
    this.folders = [];
    this.mfg = [];


      let ws ='';
      let url_current = window.location.pathname.split('/');

      this.itemLength=0;
      if(url_current[1] == RedirectionPage.Documents)
        {
          ws ='';
        }
        else
        {
          ws = localStorage.getItem('currentWorkstream');
        }

      if(ws) {
        this.currentWS = ws;
      }
      if(this.currentWS > 0) {
        this.itemOffset = 0;
        let ws = [];
        ws.push(this.currentWS)
        this.groupInfo = JSON.stringify(ws);
        console.log(this.groupInfo)
      }
      console.log('-----16-----')
      this.getDocumentList();
      //this.opacityFlag = false;
      setTimeout(() => {
        localStorage.removeItem('sNavUrl');
      }, 1000);

  }

  // Setup Document Attachments
  setupAttachments(action, docData, index) {
    //console.log(docData.uploadContents)
    docData.attachments = [];
    if(Object.keys(docData).length > 0) {
      let attachments = docData.uploadContents;
      attachments = (attachments == undefined || attachments == 'undefined') ? [] : attachments;
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
  openDetailView(item){
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
      setTimeout(() => {
        this.commonApi.emitRightPanelOpenCallData(true);
      }, 100);
  }
  callbackClick(doc, item, index) {
    if (this.singleClick === true) {
      this.doubleClick = true;
      this.openGallery(item);
    } else {
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
        if (this.doubleClick === false) {
          //this.openDetailView(item);
          this.docSelection(doc, item);
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
      let scrollTop = 0;
      let navFrom = this.commonApi.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' documents') ? false : true;
      this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      let nav = `documents/view/${docId}`;
	    this.router.navigate([nav]);
    }
  }
}
