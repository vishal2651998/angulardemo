import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Constant, pageTitle, RedirectionPage, windowHeight } from 'src/app/common/constant/constant';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadPostService } from 'src/app/services/thread-post/thread-post.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadViewRecentComponent } from 'src/app/components/common/thread-view-recent/thread-view-recent.component';
import { ThreadDetailViewComponent } from 'src/app/components/common/thread-detail-view/thread-detail-view.component';

@Component({
  selector: 'app-fix-threads',
  templateUrl: './fix-threads.component.html',
  styleUrls: ['./fix-threads.component.scss']
})
export class FixThreadsComponent implements OnInit, OnDestroy {

  @Input() public pageData: any = [];
  @Input() public filterItems: any = [];
  @Input() public facetsDatatems: any = [];
  @Output() fixThreadRef: EventEmitter<FixThreadsComponent> = new EventEmitter();
  @Output() fixThreadCallback: EventEmitter<any> = new EventEmitter();
  @ViewChild('top',{static: false}) top: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public dconfig: PerfectScrollbarConfigInterface = {};
  threadRecentRef: ThreadViewRecentComponent;
  detailViewRef: ThreadDetailViewComponent;
  public loading: boolean = true;
  public emptyListFlag: boolean = false;
  public pageRefresh: boolean = false;
  public recentFlag: boolean = true;
  public moreInfoFlag: boolean = false;
  public bodyHeight: number;
  public innerHeight: number;
  public threadId: any = 0;
  public accessPlatForm:any = 3;
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyClass2: string = "submit-loader";
  public bodyClass3: string = "thread-detail-v2";
  public bodyElem;
  public searchValue: string = "";
  public platformId: string;
  public countryId;
  public domainId;
  public userId;
  public roleId;
  public user: any;
  public contentType: number = 2;
  public translatelangArray = [];
  public translatelangId: string = '';
  public headerTitle: string = "";
  public threadViewErrorMsg;
  public threadViewError;
  public threadViewData:any;
  public industryType: any = [];
  public detailInfo: any = [];
  public threadsDetailAPIcall;
  public threadUserId: number = 0;
  public dialogPosition: string = 'top-right';

  constructor(
    private authenticationService: AuthenticationService,
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private threadPostService: ThreadPostService,
    private baseSerivce: BaseService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    console.log(this.pageData, this.filterItems)
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass3);
    this.searchValue = this.pageData.searchValue;
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid;
    this.domainId = this.user.domain_id;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');
    this.industryType = this.commonApi.getIndustryType();
    localStorage.setItem('view-v2','1');
    setTimeout(() => {
      this.setScreenHeight();
      this.fixThreadRef.emit(this);
    }, 200);
  }

  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    let pmsgHeight = (this.apiUrl.newupdateRefresh) ? 27 : 3;
    this.innerHeight = this.bodyHeight+pmsgHeight;
    let headerHeight = document.getElementsByClassName('detail-page-header')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(pmsgHeight+headerHeight));
  }

  threadRecentCallBack(data) {
    console.log(data)
    this.threadRecentRef = data;
    if(!this.threadRecentRef.loading) {
      this.facetsDatatems = this.threadRecentRef.facetsData;
      this.emptyListFlag = (this.threadRecentRef.threadListArray.length == 0) ? true : false;
      this.loading = false;      
    }
    if(this.detailViewRef) {
      //this.detailViewRef.searchLoading = false;      
    }    
  }

  detailViewCallBack(data) {
    this.detailViewRef = data;
    this.moreInfoFlag = data.moreInfo;
    this.detailInfo = data.vinDetails;
    this.fixThreadCallback.emit(this);
  }

  threadViewRecentAction(event) {
    console.log(event)
    this.threadId = event.threadId;
    this.threadViewData = [];
    this.pageRefresh = false;
    this.getThreadInfo();
  }

  getThreadInfo(){
    let getRecentView = localStorage.getItem('landingRecentNav');
    this.platformId=localStorage.getItem('platformId');
    this.threadViewErrorMsg = '';
    this.threadViewError = false;
    const apiFormData = new FormData();
    var objData = {};
    objData["rows"]=1;
    objData["start"]=0;
    objData["userId"]=this.userId;
    objData["type"]=1;
    objData["domainId"]=this.domainId;
    objData["threadId"]=this.threadId;
    apiFormData.append('apiKey', Constant.ApiKey);
    objData["domainId"]=this.domainId;
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('platformId', this.platformId);
    apiFormData.append('platform', this.accessPlatForm);
  
    this.threadsDetailAPIcall=this.threadPostService.getthreadDetailsios(apiFormData,objData).subscribe(res => {
      console.log(res);
      this.top.nativeElement.scrollTop = 0;
      if(res.total==1 || res.threads[0] != undefined){
        this.loading = false;
        if(res.status=='Success'){
          let apiDatasocial = new FormData();
          apiDatasocial.append('apiKey', Constant.ApiKey);
          apiDatasocial.append('domainId', this.domainId);
          apiDatasocial.append('threadId', this.threadId);
          apiDatasocial.append('userId', this.userId);
          apiDatasocial.append('action', 'view');
          apiDatasocial.append('platform', '3');
          apiDatasocial.append('actionType', '1');
          let platformIdInfo = localStorage.getItem('platformId');
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
          let url = RedirectionPage.Threads;
          let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
          let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
          console.log(res.threads);
          this.threadViewData = [];
          this.threadViewData = res.threads[0];
          this.threadViewData.threadTitleTranslate = this.threadViewData.threadTitle;
          this.threadViewData.contentTranslate = this.threadViewData.content;
          this.threadViewData.threadTitle=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadTitle));
          //this.threadViewData.threadTitle = this.sanitizer.bypassSecurityTrustHtml(this.authenticationSeifrvice.URLReplacer(this.threadViewData.threadTitle));
          this.threadViewData.content=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.content));
          this.threadViewData.content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.content));
          this.threadViewData.threadTitleDuplicate = this.threadViewData.threadTitle;
          this.threadViewData.contentDuplicate = this.threadViewData.content;
          this.threadViewData.industryType = this.industryType;
          let shareFixDesc = '';
          console.log(this.threadViewData.threadDescFix);
          if(this.threadViewData.threadDescFix) {
            shareFixDesc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadDescFix));
            console.log(shareFixDesc);
            this.threadViewData.threadDescFix = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(shareFixDesc));
          }
          console.log(this.threadViewData.threadDescFix);
          if(this.translatelangId != ''){
            this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
            this.threadViewData.transId = this.translatelangId;
          } else{
            this.threadViewData.transText = "Translate";
            this.threadViewData.transId = this.translatelangId;
          }
          //this.threadViewData['threadText'] = this.headerTitle;
          console.log(this.threadViewData);
          localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
          console.log(this.threadViewData);

          if(this.threadViewData != '') {
            if(this.platformId == '1') {
              this.threadUserId = this.threadViewData.owner;
            } else {
              this.threadUserId = this.threadViewData.userId;
            }
          }
          setTimeout(() => {
            this.commonApi.emitThreadListData(this.threadViewData);
          }, 1);
          setTimeout(() => {
            this.setScreenHeight();
            this.loading = false;
          }, 200);
        } else{
          this.loading = false;
          this.threadViewErrorMsg = res.result;
          this.threadViewError = true;
          setTimeout(() => {
            this.commonApi.emitThreadListData(this.threadViewData);
          }, 1);
        }
      }
      }, (error => {
        this.loading = false;
        this.threadViewErrorMsg = error;
        this.threadViewError = '';
        setTimeout(() => {
          this.commonApi.emitThreadListData(this.threadViewData);
        }, 1);
      })
    );
  }

  closeSidebar(action) {
    switch (action) {
      case 'more-info':
        this.moreInfoFlag = false;
        this.detailViewRef.moreInfo = false;    
        break;
    }    
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove(this.bodyClass3);
    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    localStorage.removeItem(threadPostStorageText);
    localStorage.removeItem('view-v2');
    this.threadsDetailAPIcall.unsubscribe();
    let navFromSearch = localStorage.getItem('searchNav');
    if(navFromSearch) {
      localStorage.removeItem('searchNav');
    }
  }
}
