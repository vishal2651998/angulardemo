import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import { PlatformLocation } from '@angular/common';
import { pageInfo, Constant, PushTypes, pageTitle, PlatFormType, forumPageAccess, LocalStorageItem, IsOpenNewTab, RedirectionPage, RouterText } from "src/app/common/constant/constant";
import { CommonService } from "src/app/services/common/common.service";
import { Subscription } from "rxjs";
import { filter, pairwise } from 'rxjs/operators';
import { GtsService } from "src/app/services/gts/gts.service";
import { ApiService } from '../.../../../services/api/api.service';
import { AuthenticationService } from '../.../../../services/authentication/authentication.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { NonUserComponent } from "../../components/common/non-user/non-user.component";
import { SearchFilterComponent } from "../search-filter/search-filter.component";

@Component({
  selector: "app-thread-detail-header",
  templateUrl: "./thread-detail-header.component.html",
  styleUrls: ["./thread-detail-header.component.scss"],
})
export class ThreadDetailHeaderComponent implements OnInit, OnDestroy {
  @Input() pageData;
  @Input() headingPageTitle = '';
  @Output() threadHeaderActionEmit: EventEmitter<any> = new EventEmitter();
  @Output() threadDetailHeaderRef: EventEmitter<ThreadDetailHeaderComponent> = new EventEmitter();
  @Output() callback: EventEmitter<any> = new EventEmitter();
  searchFilterRef: SearchFilterComponent;
  public platformName = "Collabtic";
  public reopenThread: boolean = false;
  public displayLogoutPopup: boolean = false;
  public navUrl: string = "";
  public reopenTextFlag: boolean = false;
  public reminderShow: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public title: string = "";
  public bodyElem;
  public newTextHead: string = "New";
  public newFlag: boolean = false;
  public editFlag: boolean = true;
  public partsEditAccess: boolean = true;
  public partsDeleteAccess: boolean = true;
  public partsDuplicateAccess: boolean = true;
  public loading: boolean = false;
  public techSubmmit: boolean = false;
  public ppfrAvailable;
  public ppfrText: string = '';
  public ppfrAccess: boolean = false;
  public newTab: boolean = false;
  public navFromEdit: boolean = false;
  public newThreadView: boolean = false;
  public pageDataInfoText: string = "";
  public dataInfo: any = {};
  public msTeamAccessMobile: boolean = false;
  public collabticDomain: boolean = false;
  public collabticFixes: boolean = false;
  public CBADomain: boolean = false;
  public reopenThreadImg: string = '';
  public convertDocKAImg: string = '';
  public duplicateCircleImg: string = '';
  public backButton: string = '';
  public asseImagetPath: string = "assets/images/documents";
  public platformLogo;
  public assetPath: string = "assets/images";
  public assetPathplatform: string = "assets/images/";
  public copiedModal: boolean = false;
  public discardInterval: any;
  public dialogData: any = {
    access: '',
    navUrl: this.navUrl,
    platformName: '',
    teamSystem: this.teamSystem,
    visible: true
  };
  subscription: Subscription = new Subscription() ;
  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setScreenResize();
  }

  constructor(public apiUrl: ApiService,private authenticationService: AuthenticationService, private commonApi: CommonService, private router: Router, private location: PlatformLocation, public gtsAPI: GtsService, private modalService: NgbModal,) { }
  @HostListener("document:visibilitychange", ["$event"])
  visibilitychange() {
   if(!this.apiUrl.threadViewPublicPage){
    this.checkHiddenDocument();
   }
  }

  closewindowPopup(data) {
    this.displayLogoutPopup = false;
    if (this.teamSystem) {
      window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
    } else {
      if (data.closeFlag) {
        window.close();
      }
      location.reload();
    }
  }
  checkHiddenDocument() {
    if (document.hidden) {
    } else {
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }
    }
  }
  ngOnInit(): void {  
    console.log(this.pageData)
    clearInterval(this.discardInterval);

    if (this.teamSystem) {
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }
      else {
        this.msTeamAccessMobile = false;
      }
    }
    console.log(this.msTeamAccessMobile);
    console.log(this.pageData);
    this.techSubmmit = this.pageData.techSubmmit ? true : false;
    console.log("techSubmmit ---- " + this.techSubmmit);
    this.ppfrAccess = this.pageData.ppfrAccess ? true : false;
    let newTab: any = localStorage.getItem('viewOpenTab');
    this.newTab = (newTab == null) ? this.newTab : newTab;
    console.log(newTab)
    if (this.ppfrAccess) {
      this.ppfrAvailable = this.pageData.ppfrAvailable;
      this.ppfrText = this.ppfrAvailable == '1' ? 'Edit' : 'Create';
    }
    console.log("PPFR Access  ---- " + this.ppfrText);
    console.log("PPFR Access  ---- " + this.ppfrAccess);
    let domainId:any
    if(this.apiUrl.threadViewPublicPage){
      domainId = this.apiUrl.threadViewPublicDomainId
    }
    else{
      domainId = localStorage.getItem('domainId');
    }
    
    let platformIdInfo: any = localStorage.getItem('platformId');
    this.collabticDomain = (platformIdInfo == PlatFormType.Collabtic) ? true : false;
    this.collabticFixes = (this.collabticDomain && domainId == 336) ? true : false;
    this.CBADomain = (platformIdInfo == PlatFormType.CbaForum) ? true : false;
    this.reopenThreadImg = (this.CBADomain) ? 'thread-reopen-cba.png' : 'thread-reopen-gray.png';
    this.convertDocKAImg = (this.CBADomain) ? 'convert-doc-ka-cba.png' : 'convert-doc-ka-gray.png';
    this.duplicateCircleImg = (this.CBADomain) ? 'duplicate-circle-cba.png' : 'duplicate-circle-gray.png';
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    this.backButton = (this.CBADomain) ? `${this.asseImagetPath}/back-white.png` : `${this.asseImagetPath}/doc-back.png`;
    let platformLogo = localStorage.getItem('blogo');
    this.platformLogo = platformLogo != null && platformLogo != undefined ? platformLogo : this.assetPathplatform + "logo.png";
    let infoFlag = true;
    let access = this.pageData.pageName;
    console.log(access);
    switch (access) {
      case "knowledgearticles":
        this.navUrl = `/${access}`;
        break;
      case "announcement":
        infoFlag = false;
        this.navUrl = `/${access}s/${this.pageData.navSection}`;
        break;
      case "faq":
        this.newFlag = this.pageData.newFlag;
        this.newTextHead = "New FAQ";
        this.threadDetailHeaderRef.emit(this);
        break;
      case "search":
        if(this.collabticFixes) {
          this.threadDetailHeaderRef.emit(this);
          setTimeout(() => {
            this.callback.emit(this);
          }, 750);          
        }
        break;    
      default:
        if(access == 'thread' && this.collabticFixes) {
          this.threadDetailHeaderRef.emit(this);
          setTimeout(() => {
            this.callback.emit(this);
          }, 750);          
        }
        this.navUrl = (access == "part" || access == "thread") ? `/${access}s` : `/${access}`;
        this.title = (access == "adas") ? 'ADAS' : access;
        this.loading = access == "part" ? true : this.loading;
        break;
    }
    
    let documentContentName=localStorage.getItem('documentContentName');
        
    if(documentContentName && this.pageData.pageName=='document')
    {
      this.title = documentContentName;
    }

    if (infoFlag) {
      let url = this.navUrl.split('/');
      console.log(url)
      let pageDataIndex = pageTitle.findIndex(option => option.slug == url[1]);
      console.log(this.navUrl, pageTitle, pageDataIndex)
      if (pageDataIndex >= 0) {
        let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
        let dataInfo = localStorage.getItem(pageDataInfo);
        if (dataInfo != null || dataInfo != undefined || dataInfo != 'undefined') {
          this.dataInfo = JSON.parse(dataInfo);
        }
      }
    }

    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        let prevUrl: any = events[0].urlAfterRedirects;
        console.log('previous url', prevUrl);
        console.log('current url', events[1].urlAfterRedirects);
        prevUrl = prevUrl.split('/');
        console.log(prevUrl)
        if (prevUrl.length > 1) {
          switch (prevUrl[1]) {
            case 'threads':
              /*case 'parts':
              case 'documents':  
              case 'gts':
              case 'knowledgearticles':
              case 'knowledge-base':
              case 'sib':*/
              console.log(prevUrl[3])
              let chkAction = (prevUrl[1] == 'gts') ? prevUrl[2] : prevUrl[3];
              if (chkAction == 'edit') {
                let navFromEdit: any = true;
                this.navFromEdit = navFromEdit;
                let pageDataIndex = pageTitle.findIndex(option => option.slug == prevUrl[1]);
                let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
                localStorage.setItem(pageTitle[pageDataIndex].navEdit, navFromEdit);
                let dataInfo = localStorage.getItem(pageDataInfo);
                if (dataInfo != null || dataInfo != undefined || dataInfo != 'undefined') {
                  this.dataInfo = JSON.parse(dataInfo);
                }
              }
              break;
          }
        }
      });
    this.platformName = localStorage.getItem("platformName");
    this.dialogData.platformName = this.platformName;
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.Collabtic) {
      this.reminderShow = true;
    }
    this.subscription.add(
      this.commonApi.detailData.subscribe((response) => {
        console.log(response);
        this.loading = response["loading"];
        this.editFlag = response["editAccess"];
        this.pageData['threadOwnerAccess'] = response["ownerAccess"];
        this.partsEditAccess = response["editAccess"];
        this.partsDeleteAccess = response["deleteAccess"];
        this.partsDuplicateAccess = response["duplicateAccess"];
      })
    );    
  }
  setScreenResize() {
    if (this.teamSystem) {
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }
      else {
        this.msTeamAccessMobile = false;
      }
      console.log(this.msTeamAccessMobile);
    }
  }
  closeWindow() {
    let access = this.pageData.pageName;
    let getRecentView = localStorage.getItem('landingRecentNav');
    let recentNavFlag: any = false;
    let checkItem = `${this.pageData.threadId}-new-tab`;
    let checkNewTab = localStorage.getItem(checkItem);
    console.log(access, checkNewTab, checkItem)

    if(this.collabticFixes) {
      let searchNavName = 'sNavUrl';
      if(access == 'search') {
        let navPage = localStorage.getItem(searchNavName);
        this.router.navigateByUrl(navPage);
        localStorage.removeItem(searchNavName);
        return false;
      } else {
        localStorage.removeItem(searchNavName);
      }
    }

    if (access == 'thread'){
      let domainId = localStorage.getItem('domainId');
      if(this.collabticFixes) {
        let navFromSearch = localStorage.getItem('searchNav');
        if(navFromSearch) {
          localStorage.removeItem('searchNav');
        }
      }
        let newUpdateID = localStorage.getItem('newUpdateOnThreadId') != null ? localStorage.getItem('newUpdateOnThreadId') : '';
        if(newUpdateID !='' ){
          setTimeout(() => {
            this.commonApi.emitThreadDetailCallData(true);
          }, 1000);        
        }
      let OnNewThreadIdUpdate=localStorage.getItem("OnNewThreadIdUpdate");
      if(OnNewThreadIdUpdate)
      {
        this.commonApi.emitThreadDetailCallData(true);
      }
    }    

    if (access == 'thread' && (checkNewTab != null || checkNewTab != undefined || checkNewTab != undefined) && checkItem == checkNewTab) {
      this.threadHeaderActionEmit.emit('exit');
      return false;
    }

    if (access == 'document' || access == 'adas') {
      this.threadHeaderActionEmit.emit('exit');
      return false;
    }
    
    if (access == 'repairorder') {
      this.threadHeaderActionEmit.emit('exit');
      return false;
    }

    if (getRecentView != null || getRecentView != undefined || getRecentView != undefined) {
      recentNavFlag = true;
      setTimeout(() => {
        localStorage.removeItem('landingRecentNav');
      }, 100);
    }

    console.log(this.pageData);
    if (this.dataInfo == null) {
      let pageDataIndex = pageTitle.findIndex(option => option.slug == this.navUrl);
      if (pageDataIndex >= 0) {
        let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
        this.dataInfo = JSON.parse(localStorage.getItem(pageDataInfo));
      }
    }
    console.log(this.dataInfo)
    //navFromEdit = this.navFromEdit;
    let sindex, silentCountTxt, silentLoadCount: any, pageInfo, routeLoadIndex, routeText;

    console.log(access);
    let loadFlag = true;
    switch (access) {
      case "ppfr":
        this.navUrl = "ppfr";
        break;        
      case "announcement":
        this.navUrl = "announcements/" + this.pageData.navSection;
        break;
      case "knowledgearticles":
        this.navUrl = "knowledgearticles/" + this.pageData.navSection;
        break;
      case "thread":
        loadFlag = false;
        if(this.apiUrl.postButtonEnable || this.apiUrl.uploadCommentFlag || this.apiUrl.tagCommentFlag ||
          this.apiUrl.postReplyButtonEnable  || this.apiUrl.postSaveButtonEnable || 
          this.apiUrl.uploadReplyFlag || this.apiUrl.tagReplyFlag) {
            this.threadHeaderActionEmit.emit('exit-thread');
            this.discardInterval = setInterval(() => {
              if(this.apiUrl.checkDiscard) {
                clearInterval(this.discardInterval);
                this.apiUrl.checkDiscard = false;
                this.navUrl = (access == 'knowledgearticles') ? access : `${access}s`;
                let pageDataIndex = pageTitle.findIndex(option => option.slug == this.navUrl);
                let navText = pageTitle[pageDataIndex].navEdit;
                console.log(navText)
                let navFromEdit: any = localStorage.getItem(navText);
                console.log(navFromEdit)
                setTimeout(() => {
                  localStorage.removeItem(navText);
                }, 100);
                navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
                console.log(navFromEdit)
                sindex = PushTypes.findIndex(option => option.url == this.navUrl);
                pageInfo = PushTypes[sindex].pageInfo;
                silentCountTxt = PushTypes[sindex].silentCount;
                silentLoadCount = localStorage.getItem(silentCountTxt);
                silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
                console.log(silentLoadCount)
                this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag, this.navUrl);
                if (silentLoadCount > 0 && !recentNavFlag) {
                  console.log(45646)
                  let data = {
                    action: 'silentLoad',
                    access: this.navUrl,
                    pushAction: 'load',
                    pageInfo: pageInfo,
                    silentLoadCount: silentLoadCount
                  }
                  setTimeout(() => {
                    this.commonApi.emitMessageReceived(data);            
                  }, 100);
                }
                setTimeout(() => {
                  this.commonApi.emitCloseDetailPageCallData(''); 
                }, 100);      
              }
            }, 50);
            return false;
        } else {
          this.navUrl = (access == 'knowledgearticles') ? access : `${access}s`;
          let pageDataIndex = pageTitle.findIndex(option => option.slug == this.navUrl);
          let navText = pageTitle[pageDataIndex].navEdit;
          console.log(navText)
          let navFromEdit: any = localStorage.getItem(navText);
          console.log(navFromEdit)
          setTimeout(() => {
            localStorage.removeItem(navText);
          }, 100);
          navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
          console.log(navFromEdit)
          sindex = PushTypes.findIndex(option => option.url == this.navUrl);
          pageInfo = PushTypes[sindex].pageInfo;
          silentCountTxt = PushTypes[sindex].silentCount;
          silentLoadCount = localStorage.getItem(silentCountTxt);
          silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
          console.log(silentLoadCount)
          this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag, this.navUrl);
          if (silentLoadCount > 0 && !recentNavFlag) {
            console.log(45646)
            let data = {
              action: 'silentLoad',
              access: this.navUrl,
              pushAction: 'load',
              pageInfo: pageInfo,
              silentLoadCount: silentLoadCount
            }
            setTimeout(() => {
              this.commonApi.emitMessageReceived(data);            
            }, 100);
          }
          setTimeout(() => {
            this.commonApi.emitCloseDetailPageCallData(''); 
          }, 100);
        }         
        break;   
      case "kaizen":    
      case "part":
      case "document":
      case "gts":
        if(access == 'document'){
          localStorage.removeItem('preScrollPos');
          let opt = localStorage.getItem('documentViewOption');
          //let navFromHome = localStorage.getItem('navFromHome');
          console.log(opt)
          if(opt == '2'){
            let closePage = localStorage.getItem('docClosePage') != null ? localStorage.getItem('docClosePage') : '0'
            if(closePage == '1'){
              localStorage.removeItem('docClosePage');
              window.close();              
              return false;
            }
          }   
          
        }
        loadFlag = false;
        this.navUrl = (access == 'knowledgearticles' || access == 'kaizen' || access == 'gts') ? access : `${access}s`;
        //if(access == 'document' || access == 'part') {          
            let data = {
              action: `updateLayout-${access}`,
              access: access
            }
            console.log(data)
            this.commonApi.emitMessageLayoutrefresh(data);                   
        //}
        // Remove when implement silent push
        this.setupRouteLoad(this.navUrl, recentNavFlag);
        //this.router.navigate([this.navUrl]);
        if(access != 'gts'){
          setTimeout(() => {
            this.commonApi.emitCloseDetailPageCallData('');  
          },100);
        }
        break;
      case "market-place":
        this.navUrl = '/market-place/training';
        this.router.navigateByUrl(this.navUrl);
        break;
      case "manual":
        this.navUrl = '/market-place/manuals';
        this.router.navigateByUrl(this.navUrl);
        break;
        case "Bug and Feature":
          loadFlag = false;
          this.navUrl = "/bug_and_features";
         let editnav = localStorage.getItem("editNav");
         if(editnav=="true"){
          this.router.navigate([this.navUrl])
          localStorage.removeItem("editNav")
          let data = {
            action:'unload'
          }
          this.commonApi.emitbugfeaturedata(data);
         }else{
          this.location.back()
          }
         
        break;
      case "sib":       
        loadFlag = false;
        this.navUrl = access;
        this.router.navigate([this.navUrl]);        
        break;
      case "knowledge-base":       
        loadFlag = false;
        this.navUrl = access;
        
        //setTimeout(() => {
          let data1 = {
            action: 'updateLayout'
          }
          this.commonApi.emitMessageLayoutrefresh(data1); 
        //}, 1);        
        // Remove when implement silent push
        this.setupRouteLoad(this.navUrl, recentNavFlag);
        setTimeout(() => {
          this.commonApi.emitCloseDetailPageCallData('');     
         },100);  
        //this.router.navigate([this.navUrl]);
        /* // Resuse startegy
        setTimeout(() => {
          localStorage.removeItem(navText);
        }, 100);
        navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
        sindex = PushTypes.findIndex(option => option.url == this.navUrl);
        pageInfo = PushTypes[sindex].pageInfo;
        silentCountTxt = PushTypes[sindex].silentCount;
        silentLoadCount = localStorage.getItem(silentCountTxt);
        silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
        this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag); */
        break;
      case "settings":
      case "faq":
          loadFlag = false;
          this.navUrl = localStorage.getItem('wsNavUrl');  
          this.navUrl = this.navUrl == null || this.navUrl == '' ? 'landing-page' : this.navUrl; 
          this.router.navigate([this.navUrl]);
          break;
      default:
       
        loadFlag = false;
        this.navUrl = `${access}s`;
        // Remove when implement silent push
        this.setupRouteLoad(this.navUrl, recentNavFlag);
        //this.router.navigate([this.navUrl]);
        /* // Resuse startegy
        sindex = PushTypes.findIndex(option => option.url == this.navUrl);
        pageInfo = PushTypes[sindex].pageInfo;
        silentCountTxt = PushTypes[sindex].silentCount;
        silentLoadCount = localStorage.getItem(silentCountTxt);
        silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
        this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag); */
        break;
    }
    console.log(this.navUrl);
    if(access != 'market-place' && access != 'manual') {
      if (loadFlag) {
        if (this.teamSystem) {
          window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
        } else {
          window.close();
        }
      }
    }
  }
  viewThread(threadId) {
    let viewPath = (this.collabticFixes) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
    let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
    let url = `${view}${threadId}`;
    let flag: any = true;
    localStorage.setItem('viewOpenTab', flag)
    //window.open(url, IsOpenNewTab.openNewTab);
    this.router.navigate([url]);
    //this.location.back();
  }
  editThread(threadId, type, action = "") {
    let url, surl, storage;
    let navOpenFlag = true;
    let contentTypeId = '';
    switch (type) {
      case "thread":
        contentTypeId = '2';
        navOpenFlag = false;
        storage = "threadNav";
        let viewPath = (this.collabticFixes) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
        let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
        url = `threads/manage/edit/${threadId}`;
        surl = `${view}${threadId}`;
        break;
      case "market-place":
        navOpenFlag = false;
        storage = "marketNav";
        url = `market-place/manage/edit/${threadId}`;
        surl = `market-place/view/${threadId}`;
        break;
      case "manual":
        navOpenFlag = false;
        storage = "manualNav";
        url = `market-place/manage-manual/edit/${threadId}`;
        surl = `market-place/view-manual/${threadId}`;
        break;
      case "knowledgearticles":
        contentTypeId = '7';
        navOpenFlag = false;
        storage = "knowledgearticles";
        url = `knowledgearticles/manage/edit/${threadId}`;
        surl = `knowledgearticles/view/${threadId}`;
        break;
      case "gts":
        contentTypeId = '6';        
        storage = "gts";
        if(action != 'workflow'){
          navOpenFlag = false;
          url = "gts/edit/" + threadId;
        }
        else{
          navOpenFlag = true;
          url = this.pageData.flowchartURL;
        }
        surl = "gts/view/" + threadId;
        let wsNav: any = localStorage.getItem('wsFlag');
        localStorage.setItem('wsNav', wsNav);
        setTimeout(() => {
          localStorage.removeItem('wsFlag');
        }, 100);
        break;
      case "Bug and Feature":
        navOpenFlag = false;
        storage = "bug_and_features";
        url = `bug_and_features/manage/edit/${threadId}`;
        surl = `bug_and_features/view/${threadId}`;
        break;
      case "kaizen":
        navOpenFlag = false;
        storage = "kaizenNav";
        url = `kaizen/manage/edit/${threadId}`;
        surl = `kaizen/view/${threadId}`;
        break;
      case "document":
        contentTypeId = '4';
        navOpenFlag = false;
        storage = "docNav";
        url = `documents/manage/edit/${threadId}`;
        surl = `documents/view/${threadId}`;
        break;
      case "part":
        contentTypeId = '11';
        navOpenFlag = false;
        let actionUrl = action == "" ? "edit" : action;
        storage = "partNav";
        url = `parts/manage/${actionUrl}/${threadId}`;
        surl = `parts/view/${threadId}`;
        if (action != '')
          localStorage.setItem("partNav", surl);
        break;
      case "sib":
        navOpenFlag = false;
        let sactionUrl = action == "" ? "edit" : action;
        storage = "sibNav";
        url = `sib/manage/${sactionUrl}/${threadId}`;
        surl = `sib/view/${threadId}`;
        break;
      case "opportunity":
        navOpenFlag = false;
        storage = "opportunityNav";
        url = `${RedirectionPage.Opportunity}/manage/edit/${threadId}`;
        surl = `${RedirectionPage.Opportunity}/view/${threadId}`;
        break;
      case "adas":
        navOpenFlag = false;
        storage = "adasNav";
        url = `${RedirectionPage.AdasProcedure}/manage/edit/${threadId}`;
        surl = `${RedirectionPage.AdasProcedure}/view/${threadId}`;
        break;
      default:
        storage = "ancNav";
        url = `announcements/manage/edit/${threadId}`;
        surl = `announcements/view/${threadId}`;
        break;
    }
    localStorage.setItem(storage, surl);
    if (navOpenFlag) {
      if (this.teamSystem || action == "duplicate") {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } 
      else if(action == 'workflow'){
        window.location.replace(url);
      }
      else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    } else {
      let platformId = localStorage.getItem("platformId");
      if(this.apiUrl.enableAccessLevel){ 
        if((this.pageData.threadOwnerAccess)){
          this.router.navigate([url]);
        }  
        else{    
          this.authenticationService.checkAccess(contentTypeId,'Edit',true,true); 
          setTimeout(() => {            
            if(this.authenticationService.checkAccessVal){
              this.router.navigate([url]);
            }
            else if(!this.authenticationService.checkAccessVal){
              // no access
            }
            else{
              this.router.navigate([url]);              
            }  
          }, 550);
        }
      }
      else{
        this.router.navigate([url]);
      }
      
    }
  }
  threadHeaderEvent(event) {
    if (event == "reopen") {
      this.reopenTextFlag = true;
      setTimeout(() => {
        this.pageData.reopenThread = false;
        this.reopenTextFlag = false;
      }, 1500);
    }
    if(this.pageData.pageName == 'repairorder' && (event == 'copylink' || event == 'approve' || event == 'complete' || event == 'order-detail')){
      if(event == 'copylink'){
        let currentURL11 = window.location.href;
        let currentURL21 = this.router.url;
        let currentURL31 = currentURL11.replace(currentURL21,"")
        console.log(currentURL31);
        let copyurl = currentURL31+"/repair-order/view/"+this.pageData.threadId;
        navigator.clipboard.writeText(copyurl);
        this.copiedModal = true;
        setTimeout(() => {
         this.copiedModal = false;
        }, 1500);
        return false;
      }            
    }

    // emit value
    if (event == "delete") {
      if(this.apiUrl.enableAccessLevel){ 
        if(this.pageData.threadOwnerAccess ){
          this.threadHeaderActionEmit.emit(event);
        }  
        else{  
          if(this.pageData.pageName == 'thread' || this.pageData.pageName == 'document' || this.pageData.pageName == 'part' || this.pageData.pageName == 'gts' || this.pageData.pageName == 'knowledgearticles'){
            let contentTypeId = '';
            switch(this.pageData.pageName){
              case 'thread':
                contentTypeId = '2';
              break;
              case 'document':
                contentTypeId = '4';
              break;
              case 'part':
                contentTypeId = '11';
              break;
              case 'gts':
                contentTypeId = '6';
                break;
              case 'knowledgearticles':
                contentTypeId = '7';
                break;
            }
            this.authenticationService.checkAccess(contentTypeId,'Delete',true,true); 
            setTimeout(() => {            
              if(this.authenticationService.checkAccessVal){
                this.threadHeaderActionEmit.emit(event);
              }
              else if(!this.authenticationService.checkAccessVal){
                // no access
              }
              else{
                this.threadHeaderActionEmit.emit(event);            
              }  
            }, 550);
          }
          else{ 
            this.threadHeaderActionEmit.emit(event);
          }
        }
      }
      else{
        this.threadHeaderActionEmit.emit(event);
      }            
    }
    else{
      this.threadHeaderActionEmit.emit(event);
    }    
  }
  duplicateRecord(event) {
    this.threadHeaderActionEmit.emit(event);
  }

  // Set Navigation
  setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag, curl = '') {
    let wsNav: any = localStorage.getItem('wsNav');
    let wsNavUrl = localStorage.getItem('wsNavUrl');
    let url = (wsNav) ? wsNavUrl : this.navUrl;
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
    let chkRouteLoad;
    if (routeLoadIndex >= 0) {
      let routeText = pageTitle[routeLoadIndex].routerText;
      chkRouteLoad = localStorage.getItem(routeText);
    }
    let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad;
    console.log(this.navFromEdit, navFromEdit, url)
    let title = localStorage.getItem('platformName');
    let titleIndex = pageTitle.findIndex(option => option.slug == url);
    title = `${title} - ${pageTitle[titleIndex].name}`;
    let pageIndex = pageTitle.findIndex(option => option.slug == curl);
    let chkIndex = (curl != '') ? pageIndex : titleIndex;
    let pageDataInfo = pageTitle[chkIndex].dataInfo;
    this.dataInfo = JSON.parse(localStorage.getItem(pageDataInfo));
    document.title = title;
    url = (recentNavFlag) ? RedirectionPage.Home : url;
    let navCancelText = pageTitle[chkIndex].navCancel;
    let navCancelFlag: any = localStorage.getItem(navCancelText);
    setTimeout(() => {
      localStorage.removeItem(navCancelText)
    }, 100);
    console.log(recentNavFlag, navCancelFlag, navFromEdit)
    //return false;
    if (recentNavFlag && !navCancelFlag && navFromEdit) {
      console.log('in')
      let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
      let chkRouteLoad;
      console.log(routeLoadIndex)
      if (routeLoadIndex >= 0) {
        routeLoad = true;
        let routeText = pageTitle[routeLoadIndex].routerText;
        chkRouteLoad = localStorage.setItem(routeText, routeLoad);
      }
    }
    if (navFromEdit || routeLoad) {
      console.log(recentNavFlag, this.dataInfo)
      let timeOut = 0;
      if (navFromEdit && Object.keys(this.dataInfo).length > 0) {
        timeOut = 50;
        let data = {
          action: 'silentUpdate',
          access: url,
          pushAction: 'load',
          pageInfo: pageInfo,
          silentLoadCount: silentLoadCount,
          dataId: this.pageData.threadId,
          dataInfo: this.dataInfo
        }
        this.commonApi.emitMessageReceived(data);       
        if(url == 'techsupport'){
          localStorage.removeItem("tspageTS"); 
          if(localStorage.getItem('tspageRefresh') == '1'){
            let pageRefresh = {
              'action' : 'update-assign',
              dataId: this.pageData.threadId,
            }
            this.commonApi.emitTSListData(pageRefresh);
          }
        }       
      }
      setTimeout(() => {
        this.router.navigate([url]);
      }, timeOut);
    } else {
      console.log(this.dataInfo)
      let timeOut = 0;
      if (navFromEdit && Object.keys(this.dataInfo).length > 0) {
        timeOut = 50;
        let data = {
          action: 'silentUpdate',
          access: url,
          pushAction: 'load',
          pageInfo: pageInfo,
          silentLoadCount: silentLoadCount,
          dataId: this.pageData.threadId,
          dataInfo: this.dataInfo
        }
        this.commonApi.emitMessageReceived(data);
        setTimeout(() => {
          this.router.navigate([url]);
        }, timeOut);
      } else {
        if (navCancelFlag && recentNavFlag) {
          this.router.navigate([url]);
        } else {
          this.location.back();
        }
      }
      //this.location.back();
    }
    setTimeout(() => {
      localStorage.removeItem('wsNav');
      localStorage.removeItem('wsNavUrl');
      localStorage.removeItem(silentCountTxt);
    }, 100);
  }

  setupRouteLoad(url, recentNav) {
    console.log(url)
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
    console.log(routeLoadIndex)
    let wsNav: any = localStorage.getItem('wsNav');
    let wsNavUrl = localStorage.getItem('wsNavUrl');
    this.navUrl = (wsNav) ? wsNavUrl : this.navUrl;

    setTimeout(() => {
      localStorage.removeItem('wsNav');
      localStorage.removeItem('wsNavUrl');
    }, 100);
    if (routeLoadIndex >= 0) {
      let routeNavText = pageTitle[routeLoadIndex].routerText;
      let navEditText = pageTitle[routeLoadIndex].navEdit;
      let navCancelText = pageTitle[routeLoadIndex].navCancel;
      let navEditFlag = localStorage.getItem(navEditText);
      let navCancelFlag = localStorage.getItem(navCancelText);
      setTimeout(() => {
        localStorage.removeItem(navEditText);
        localStorage.removeItem(navCancelText);
      }, 100);
      console.log(navEditFlag, navCancelFlag)
      let chkLandingRecentFlag: any = recentNav;
      let landingNav = RedirectionPage.Home;
      let navUrl = (chkLandingRecentFlag) ? landingNav : this.navUrl;
      console.log(navUrl)
      if (navEditFlag) {
        routeNavText = (chkLandingRecentFlag) ? RouterText.HOME : routeNavText;
        localStorage.setItem(routeNavText, 'true');
        if (this.navUrl == 'documents') {
          //this.router.navigate([navUrl]);
          let data = {
            docId: this.pageData.threadId,
            action: 'load'
          }
          this.commonApi.emitDocViewLoad(data)
          window.location.href = this.navUrl;
        } else {
          this.router.navigate([navUrl]);
        }
      } else {
        if (navCancelFlag) {
          this.router.navigate([navUrl]);
        } else {
          this.router.navigate([navUrl]);
        }
      }
    }
  }

  newPage() {
    switch(this.pageData.access) {
      case 'faq':
        let data = {
          action: 'new',
          headerData: this
        };
        this.callback.emit(data);
        break;
    }
  }

  startGTS() {
    localStorage.setItem('gtsStartFrom','0');
    this.router.navigate([`gts/start/${this.pageData.threadId}`]);
  }

  refreshPopupScreen(){
    if(this.apiUrl.upgradePopupShow == '1'){     
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.add('auth');
      const modalRef = this.modalService.open(NonUserComponent, { backdrop: 'static', keyboard: false, centered: true });
      modalRef.componentInstance.pageRefresh = true;
      modalRef.componentInstance.message = this.apiUrl.webUpdatesArray;
      modalRef.componentInstance.nonuserResponce.subscribe((receivedService) => {
        if (receivedService) {
          this.apiUrl.newupdateRefresh=false;
          modalRef.dismiss('Cross click');             
        }
      });
    }
    else{
      window.location.reload();
    }
  }

  searchFilterCallback(data) {
    this.searchFilterRef = data;
    let keyword = data.searchVal;
    let initFlag = data.initAction;
    let filterFlag = data.filterCall;
    let pinStatus = data.pinStatus;
    let sdata = {
      searchFilterData: data,
      action: 'search',
      filter: data.searchFilter,
      filterFlag,
      initFlag,
      pinStatus,
      keyword
    }
    this.threadHeaderActionEmit.emit(sdata);
  }

  actionHeader(data) {
    console.log(data)
    this.threadHeaderActionEmit.emit(data);
  }

  feedback() {
    let data = {
      action: 'feedback'
    }
    this.actionHeader(data);
  }

  taponlogo() {
    let currUrl = this.router.url.split('/');
    console.log(currUrl[1])
    let navUrl = RedirectionPage.Home;
    if (navUrl == currUrl[1]) {
      window.location.href = navUrl;
    } else {
      //this.router.navigate([navUrl]);
      let navHome = window.open(navUrl, navUrl);
      navHome.focus();
    }
  }
  

  @HostListener('window:keydown', ['$event'])
       keyEvent(event: KeyboardEvent) {
          if (event.ctrlKey || event.metaKey) {
            if (event.key === 'x' || event.key === 'X') {
              let curl = this.router.url.split('/');
              if(curl.length > 3 && (curl[2] == 'view' || curl[2] == 'view-v2' || curl[2] == 'view-v3')) {
                this.closeWindow();
              }              
            }      
          }
      }
      
  ngOnDestroy() {
    //localStorage.removeItem('viewOpenTab');
    this.subscription.unsubscribe();
  }
}
