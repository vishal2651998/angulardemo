import { Component, HostListener, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NavigationEnd,NavigationStart,Router } from "@angular/router";
import { ProductMatrixService } from "../../../services/product-matrix/product-matrix.service";

import { PlatformLocation } from "@angular/common";
import { AppService } from 'src/app/modules/base/app.service';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { pageTitle,Constant, RedirectionPage,PlatFormType,PageTitleText, ContentTypeValues, DefaultNewImages, DefaultNewCreationText } from 'src/app/common/constant/constant';
import { Title } from '@angular/platform-browser';
import { Subscription } from "rxjs";
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-kaizen-approval',
  templateUrl: './kaizen-approval.component.html',
  styleUrls: ['./kaizen-approval.component.scss']
})
export class KaizenApprovalComponent implements OnInit {

  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @Input() accessFrom: string = "kaizen";
  //@Input() docData: any = [];
  subscription: Subscription = new Subscription();

  public teamSystem = localStorage.getItem('teamSystem');
  public bodyElem;
  public bodyHeight: number;
  public priorityIndexValue='';

  public innerHeight: number = window.innerHeight - 200;
  public docRowHeight: number = 0;
  public innerRecentViewWidth: number = 0;
  public thumbView: boolean = false;
  public displayNoRecords: boolean = false;
  public loading: boolean = true;
  public fileLoader: boolean = false;
  public showDocuments:boolean=false;
  public contentLoading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public fromSearchpage:string ='';
  public searchText:string ='';
  public contentTypeValue:number = 27;
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
  public domainId ='';
  public countryId;
  public apiKey: string = this.appService.appData.apiKey;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public groupInfo: any = [];
  public docApiCall;
  public docWsApiCall;
  recentViewedDocuments: any;
  recentUploadedDocuments = [];
  user: any;
  public userId: any;
  public assetPartPath: string = 'assets/images/kaizen/';
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public apiData: any = [];
  public otherTechInfoFlag : boolean = false;
  roleId: any;
  public approvedListFlag: boolean = true;
  public approvedFlag: string = '';
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
  public fileView: boolean = true;
  public folderFlag: boolean = false;
  public filesFlag: boolean = false;
  public panelFlag: boolean = false;
  public filterFlag: boolean = false;
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
  public collabticDomain: boolean = false;
  public doconCloseAPI;
  public currentWS: any = 0;
  public approvalProcessType: string = '';
  public toggleAction: boolean = false;
  public type: string = '';
  public statusList: any = [];
  public approvalStatusId: string = '';
  public kaizenAssigneeRoleId: string = '';
  public kaizenUserType: string = '';
  public listId: string = '';
  public myKaizen: string = '';
  public newThreadInfo = "Get started by tapping on New Kaizen.";
  public displayNoRecordsShow = this.myKaizen == '1' ? 2 : 1;
  public contentTypeDefaultNewImg = DefaultNewImages.Kaizen;
  public contentTypeDefaultNewText = DefaultNewCreationText.Kaizen;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public createThreadUrl = "kaizen/manage";
  public pageTitleText= PageTitleText.Kaizen;
  public redirectionPage='';
  constructor(
    private probingApi: ProductMatrixService,
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private location: PlatformLocation,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private appService: AppService,
    private titleService: Title,
    private documentationService: DocumentationService,
    public apiUrl: ApiService) {
      this.titleService.setTitle(localStorage.getItem('platformName')+' - Kaizen');
      this.location.onPopState (() => {
        let url = this.router.url.split('/');
        if(url[1] == RedirectionPage.Kaizen) {
          this.opacityFlag = true;
          setTimeout(() => {
            if(!document.body.classList.contains('landing-page')) {
              document.body.classList.add('landing-page');
            }
            this.opacityFlag = false;
          }, 100);
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
         },5000);
        //  this.opacityFlag = false;
        }

      });
    }

  ngOnInit(): void {
    this.innerHeight = window.innerHeight - 200;
    localStorage.setItem('currentContentType', '4');

    this.countryId = localStorage.getItem('countryId');
    let fromHometoDocuments=localStorage.getItem('fromHometoDocuments');
    let defaultFolderId=localStorage.getItem('defaultFolderId');

    this.kaizenAssigneeRoleId=localStorage.getItem('kaizenAssigneeRoleId');
    this.kaizenUserType=localStorage.getItem('kaizenUserType')
    let platformId: any = localStorage.getItem('platformId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    let getVal = localStorage.getItem("kaizenNonApproved") != null ? localStorage.getItem("kaizenNonApproved") : '';
    this.approvedListFlag = getVal == '1' ?  false : true;
    if(!this.approvedListFlag){
      this.approvedFlag = '';
      if(this.kaizenAssigneeRoleId == '3' || this.kaizenAssigneeRoleId == '4'){
        this.myKaizen = '0';
      }
      else{
        this.myKaizen = '1';
      }
    }
    else{
      this.approvedFlag = '1';
      this.myKaizen = '0';
    }

    setTimeout(() => {

      this.getStatusList();

    }, 1000);


    let tab = localStorage.getItem('documentTab');
    this.tab = (tab == 'undefined' || tab == undefined) ? this.tab : tab;
    for(let t of this.recentTabs) {
      t.selected = (t.control == this.tab) ? true : false;
    }

    // Remove when silent push enabled
    let pageIndex = pageTitle.findIndex(option => option.slug == RedirectionPage.Documents);
    let navEditText = pageTitle[pageIndex].navEdit;
    localStorage.removeItem(navEditText);

    this.docInfoData.action = 'empty';
    this.docInfoData.docData = [];
    let dataId = -1;
    this.emitDocInfo(dataId);

    this.apiData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      dataId: 0,
      platformId: 3,
    };

    this.docInfoData = {
      action: 'load',
      dataId: 0,
      docData: [],
      loading: true
    };

    console.log(564, this.accessFrom)


    this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        var setdata = JSON.parse(JSON.stringify(r));
        if(setdata.pushType=='40' || setdata.pushType=='41')
        {

          let itemLimit=1;
          this.itemOffset=0;

          this.getDocumentPGList(itemLimit,setdata.threadId,setdata.pushType);

        }
        console.log("-----------258-----------", setdata);

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

          console.log(this.docInfoData)
          //this.scrollToPos(this.docInfoData.docData.resourceID);
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
      })
    );

    this.subscription.add(
      this.commonApi.documentListDataReceivedSubject.subscribe((docsData: any) => {
        console.log(docsData)
        this.priorityIndexValue = "1";
        this.documentIdArrayInfo=[];
        this.docAPiCount='0';
        this.loadAction = docsData['loadAction'];
        this.displayNoRecords = false;
        let action = docsData['action'];
        this.thumbView = docsData['thumbView'];
        this.mfgView = false;
        let getVal = docsData['approved'];
        this.approvedListFlag = getVal == '1' ?  true : false;
        if(!this.approvedListFlag){
          this.approvedFlag = '';
        }
        else{
          this.approvedFlag = '1';
        }
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
            this.mfgView = (this.mfgId > 0) ? !this.mfgView : this.mfgView;
            this.loading = true;
            setTimeout(() => {
              this.setupRecentTabWidth(action, docsData['expandFlag']);
            }, 1);
            this.loading = false;
            break;
          case 'files':
            this.opacityFlag = false;
            this.subFolderCount = docsData['subFolderCount'];
            //this.emptyPanel();
            setTimeout(() => {
              this.breadcrumb(action, docsData['folderId']);
            }, 50);
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
                  /*this.recentViewedDocuments.forEach(t => {
                    t.selected = false;
                  });
                  this.recentUploadedDocuments.forEach(t => {
                    t.selected = false;
                  });
                  setTimeout(() => {
                    this.setupRecentTabWidth(action, this.panelFlag);
                  }, 100);*/
                }
                if(this.loadAction != 'push') {
                  this.files = [];
                  this.folders = [];
                }
              }
            }
            if(action == 'approval-status' || action == 'sort' ) {
              this.contentLoading = true;
              this.itemLength = 0;
              this.itemTotal = 0;
              this.itemOffset = 0;
              this.files = [];
            }
            if(action == 'header-status' ) {
              this.listId =  docsData['listId'];
              this.myKaizen =  docsData['myKaizen'];
              this.displayNoRecordsShow = this.myKaizen == '1' ? 2 : 1;
              this.contentLoading = true;
              this.itemLength = 0;
              this.itemTotal = 0;
              this.itemOffset = 0;
              this.files = [];
              this.getStatusList();
            }
            if(action == 'approved-kaizen' || action == 'ksort') {
              this.listId =  docsData['listId'];
              this.myKaizen = '0';
              if(this.kaizenAssigneeRoleId == '3' || this.kaizenAssigneeRoleId == '4'){
                this.myKaizen = '0';
              }
              else{
                this.myKaizen = docsData['type'];
              }
              this.displayNoRecordsShow = 1;
              this.contentLoading = true;
              this.itemLength = 0;
              this.itemTotal = 0;
              this.itemOffset = 0;
              this.files = [];
            }

            this.type = docsData.type;
            this.approvalProcessType = docsData.approvalType;
            this.getDocumentPGList();
            break;
        }
        this.bodyHeight = window.innerHeight;
        setTimeout(() => {
          this.setScreenHeight();
          localStorage.removeItem('fromHometoDocuments');
        },500);
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r) => {
        let action = r['action'];
        console.log(r);

        setTimeout(() => {
          let secElement = document.getElementById('documentList');
          let docId = localStorage.getItem('kaizenIddetail');
          if(docId)
          {
            let docElement = document.getElementById(docId);
            let rmVal=-80;
            let scrollPos = docElement.offsetTop+rmVal;
            secElement.scrollTop = scrollPos;
          }

          localStorage.removeItem('kaizenIddetail');
        }, 500);
        this.opacityFlag = false;
        this.onResize(r);

        switch(action) {
          case 'side-menu':
            let access = r['access'];
            let page = r['page'];
            console.log(access)
            if(access == 'Tech Info' || page == 'kaizen') {
              this.opacityFlag = false;
              let section = (this.fileView) ? 'file-layout' : 'folder-layout';
              let data = {
                action: section,
                access: section
              }
              //this.commonApi.emitMessageLayoutrefresh(data);
            }
            break;
          case 'doc-push':
            let cpushData = r['pushData'];
            let folders = JSON.parse(cpushData.fileCount);
            let wsFlag = cpushData.wsFlag;
            this.contentLoading = false;
            let timeout = (this.mainView) ? 0 : 1000;
            setTimeout(() => {
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

                if(this.fileView) {
                  console.log(this.subFolderId, fid)
                  this.contentLoading = false;
                  if(this.subFolderId == parseInt(fid)) {
                    console.log('-----3-----')
                    this.loadAction = 'push';
                    this.getDocumentPGList();
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
                this.getDocumentPGList();
                let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
                this.innerRecentViewWidth = documentWidth + 200;
                let section = (this.fileView) ? 'file-layout' : 'folder-layout';
                let data = {
                  action: section,
                  access: section
                }
                //this.commonApi.emitMessageLayoutrefresh(data);
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
          case 'updateLayout-kaizen':
            if(action == 'updateLayout-kaizen') {
              this.opacityFlag = true;
              setTimeout(() => {
                if(!document.body.classList.contains('landing-page')) {
                  document.body.classList.add('landing-page');
                }
                this.opacityFlag = false;
              }, 100);
            }
            break;
        }
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
      setTimeout(() => {
        this.setScreenHeight();
      }, 1000);
    });


    this.subscription.add(
      this.commonApi.documentPanelFlagReceivedSubject.subscribe((response) => {
        console.log(response);
        this.docScroll = false;
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
  loadDocumentPageSolr(searchValue)
  {
    let push = false;
   // let data_arr=["domain_id"]
    let apiData = {

      "query": searchValue,
      "rows": this.itemLimit,
      "start": this.itemOffset,
      "filters": {"domainId":this.apiData["domainId"]},
      "type":2
      //filters: {},

    };
    this.updateSearchKeyword(searchValue);

      this.documentationService.getALLDocumentFromSolr(apiData).then((documents: any) => {
        console.log(documents);
        if (documents.total>0) {
          this.searchnorecordflag = false;
        }

        this.files.push(...documents.files);
        this.docAPiCount=documents.total;

        this.scrollInit = 1;
        this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
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
  }

    );


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
  }

  // Deselect Tab
  deselectTab(item) {
    item.forEach(i => {
      i.selected = false;
    });
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
  }

  // Clear Page
  clearSection(item = '') {
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
    console.log(this.subFolderCount);
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
        this.itemLength = 0;
        this.itemTotal = 0;
        this.itemOffset = 0;
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
        this.itemLength = 0;
        this.itemTotal = 0;
        this.itemOffset = 0;
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
          let timeout = (this.panelFlag) ? 0 : 150;
          setTimeout(() => {
            this.deselectTab(this.recentViewedDocuments);
            this.deselectTab(this.recentUploadedDocuments);
            setTimeout(() => {
              this.setupRecentTabWidth('trigger', true);
            }, 500);
          }, timeout);
        }
        break;
    }

    if(apiCall) {
      //this.docInfoData.docData = [];
      //this.emitDocInfo(0);
      this.contentLoading = true;
      console.log('-----8-----')
      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.getDocumentPGList();
        this.setScreenHeight();
      }, 100);
    }
  }

  // Empty Right Panel
  emptyPanel() {
    let dataId = -1;
    this.docInfoData.action = 'empty';
    this.emitDocInfo(dataId);
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
    } else {
      this.groupInfo = JSON.stringify(docsData['filterOptions'].workstream);
    }

    this.loading = false;
    this.breadcrumb('files');
  }

  // Setup Recent Tab width
  setupRecentTabWidth(action, expandFlag) {
    console.log(action, expandFlag,this.contentLoading);
    setTimeout(() => {
      if(this.contentLoading){
        this.getDocumentPGList();
      }
    }, 1500);
    /*
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
    */
  }

  // Set Screen Height
  setScreenHeight() {
    let rmHeight = 0;
    rmHeight = rmHeight;
    let headerHeight = 0;
    let headerHeight1 = 0;
    if(!this.teamSystem) {
      headerHeight = (document.getElementsByClassName('prob-header')[0]) ? document.getElementsByClassName('prob-header')[0].clientHeight : headerHeight;
      headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      headerHeight = headerHeight1 +  headerHeight1;
    }

    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight;

    if(this.approvedListFlag){
      rmHeight = 120 + headerHeight;
      this.innerHeight = this.innerHeight - rmHeight;
    }
    if(!this.approvedListFlag){
      if(this.statusList.length>0){
        rmHeight = 120 + headerHeight;
        this.innerHeight = this.innerHeight - rmHeight;
      }
      else{
        rmHeight = 120 + headerHeight;
        this.innerHeight = this.innerHeight - rmHeight;
      }

    }

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
      this.setScreenHeight();
      console.log(111111);
      setTimeout(() => {
        this.opacityFlag=true;
        //if(this.mainView) { this.setupRecentTabWidth(this.panelFlag); }
        this.commonApi.emitMessageLayoutChange(true);
      }, 50);
    }
  }

  getDocumentPGList(itemLimitPush=0,resourceId='',pushtype='') {
    let newFolder='';
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.contentLoading = true;
    let expand = (this.panelFlag) ? 1 : 1;
    let filterOptions = JSON.stringify(this.filterOptions);
    this.docApiData.offset = this.itemOffset;
    this.docApiData.limit = this.itemLimit;
    if(itemLimitPush)
    {
      this.docApiData.offset = 0;
      this.docApiData.limit = 1;
    }
    this.docApiData.type = (this.pinFlag) ? 'pinned' : this.type;
    this.docApiData.filterOptions = filterOptions;

    this.docApiData.approvalProcess = this.approvalProcessType;
    this.docApiData.docuementApproval = this.approvalStatusId;


    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    apiFormData.append("offset", this.docApiData.offset);
    apiFormData.append("limit", this.docApiData.limit);
    apiFormData.append("type", this.docApiData.type);
    apiFormData.append("filterOptions", this.docApiData.filterOptions);
    apiFormData.append("approvalProcess", this.docApiData.approvalProcess);
    apiFormData.append("docuementApproval", this.docApiData.docuementApproval);
    apiFormData.append("listId", this.listId);
    apiFormData.append("myKaizen", this.myKaizen);
    apiFormData.append("userType", this.kaizenUserType);
    apiFormData.append("assigneeRoleId", '1');
    apiFormData.append("approvedFlag", this.approvedFlag);

    this.documentationService.getALLKaizenList(apiFormData).then((documents: any) => {
      if(this.accessFrom == 'kaizen') {
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
          if(pushtype=='41')
          {
            this.files.unshift(...documents.files);
          }
          else
          {
            this.files.push(...documents.files);
          }


          if(this.itemOffset >= this.itemLimit || pushtype=='41') {
            this.fileLoader = this.contentLoading;
            let fileData = {
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            console.log(this.itemLimit+'--from push');
            this.commonApi.emitFileList(fileData);
          }
          else
          {
            if(itemLimitPush)
            {
              for (let wsd in this.files)

              {
                let studentObj = this.files.find(t => t.resourceID == resourceId);

                if (studentObj) {

                  this.files.find(item => item.resourceID == resourceId).documentStatus = documents.files[0].documentStatus;
                  this.files.find(item => item.resourceID == resourceId).documentStatusBgColor = documents.files[0].documentStatusBgColor;
                  this.files.find(item => item.resourceID == resourceId).documentStatusId = documents.files[0].documentStatusId;

                }
                else
                {

                }

              }

            }
          }

        }
      }
    });
  }

  // scroll event
  scrollAction(event){
    //console.log(this.thumbView,this.fileView)
    //if(!this.thumbView) {
      //if(this.fileView) {
        this.scrollTop = event.target.scrollTop-90;
        let totalHeight = event.target.scrollTop+event.target.offsetHeight;
        let scrollHeight = event.target.scrollHeight-10;
        //console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+totalHeight+'--'+scrollHeight);
        //console.log(this.itemTotal, this.itemLength)
        if((totalHeight>=scrollHeight) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false) {
          this.scrollCallback = false;
          this.lazyLoading = true;
          this.loadDataEvent = true;
          this.itemOffset += this.itemLimit;
          this.getDocumentPGList();
          this.lastScrollTop = this.scrollTop;
          event.preventDefault;
        }
      //} else {
        //this.mainScroll(event);
      //}
    //}
  };

  mainScroll(event) {
    let isNearBottom = this.documentationService.isUserNearBottom(event);
    let isBottomVal:any = this.documentationService.isUserNearBottomVal(event);
    let threshold = 80;
    this.scrollTop = event.target.scrollTop;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      console.log(this.itemTotal, this.itemLength)
      if (isNearBottom && this.scrollCallback && this.itemTotal > this.itemLength) { // May be check with files count also
        this.scrollCallback = false;
        this.itemOffset += this.itemLimit;
        this.lazyLoading = true;
        this.loadDataEvent = true;
        this.scrollPos = parseInt(isBottomVal)/2;
        this.docScroll = true;
        console.log('-----10-----')
        this.getDocumentPGList();
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

  getStatusList(){

    let kaizenAssigneeRoleId=localStorage.getItem('kaizenAssigneeRoleId');
    let kaizenUserType=localStorage.getItem('kaizenUserType');
    this.countryId = localStorage.getItem('countryId');

    let statusData = new FormData();
    statusData.append('apiKey', this.apiKey);
    statusData.append('domainId', this.domainId);
    statusData.append('countryId', this.countryId);
    statusData.append('userId', this.userId);
    statusData.append('limit', "10");
    statusData.append('offset', "0");
    statusData.append('assigneeRole', kaizenAssigneeRoleId);
    statusData.append('userType', kaizenUserType);
    statusData.append("listId", this.listId);
    statusData.append("myKaizen", this.myKaizen);

    this.probingApi.kaizenGetUserStatusListApi(statusData).subscribe((response) => {
      console.log(response.items);
      this.statusList = [];
      this.statusList = response.items;
    });

  }

  changeStatus(sid){
    /*this.approvalStatusId = sid;
    this.contentLoading = true;
    this.itemOffset = 0;
    this.files = [];
    this.getDocumentPGList();*/
  }

  emptyAction(event){
    this.contentLoading = true;
    this.itemOffset = 0;
    this.loading = false;
    this.breadcrumb('files');
  }

  // Ondestroy
  ngOnDestroy() {
    localStorage.removeItem("documentApprovalPage");
    let ws = [];
    let docFilter = JSON.parse(localStorage.getItem('docFilter'));
    if(docFilter)
    {
      if(docFilter.workstream) {
        docFilter.workstream = ws;
      }
    }
    this.subscription.unsubscribe();
    this.doconCloseAPI.unsubscribe();
     this.bodyHeight = window.innerHeight;
  }


}

