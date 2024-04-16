import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../../../services/common/common.service';
import { Constant,IsOpenNewTab,pageTitle,RedirectionPage, windowHeight,silentItems } from '../../../../common/constant/constant';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { AnnouncementService } from '../../../../services/announcement/announcement.service';
import { ApiService } from '../../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import { SubmitLoaderComponent } from "../../../../components/common/submit-loader/submit-loader.component";
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../../services/thread/thread.service';
import { FollowersFollowingComponent } from '../../../../components/common/followers-following/followers-following.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { Subscription } from "rxjs";
import { PlatformLocation } from "@angular/common";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  subscription: Subscription = new Subscription();

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyElem;
  public title:string = 'Kaizen ID#';
  public loading:boolean = true;
  public threadViewErrorMsg;
  public threadViewError;
  public threadViewData:any;
  public dataId;
  public headerData:any;
  public threadData:any;
  public rightPanel: boolean = false;
  public innerHeight: number;
  public bodyHeight: number;
  public platformId: number = 0;
  public domainId;
  public userId;
  public countryId;
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public displayOrder: number = 0;
  public roleId;
  public apiData: Object;
  public user: any;
  public teamSystem = localStorage.getItem('teamSystem');
  public viewDocInterval: any;

  public threadUserId: number = 0;
  public threadOwner: boolean =false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public userRoleTitle: string = '';

  public navUrl: string ='';

  public dashboard: string = 'thread-dashboard';
  public dashboardTab: string = 'views';
  public updateBtnFlag: boolean = false;
  public updateAnnouncement: boolean = false;
  public contentType: string = '';
  public anncType: string = '';
  public anncReadUpdate: boolean = false;
  public userRole:string = '';
  public threadPosted:string = '';
  public theadTitle:string= '';
  public year:string= '';
  public threadCreatedOn = '';
  public threadupdatedOn = '';
  public taglength;
  public countrylength;
  public tagData;
  public countryData;
  public workStreamslength;
  public workStreamsData;
  public threadEdited;
  public attachmentLoading: boolean = true;
  public action = "view";
  public attachments: any;
  public threadId;
  public pinCountVal;
  public likeCountVal;
  public plusOneCountVal;
  public pinCount: number = 0;
  public likeCount: number = 0;
  public plusOneCount: number = 0;
  public pinImg;
  public likeImg;
  public plusOneImg;
  public pinLoading: boolean = false;
  public likeLoading: boolean = false;
  public plusOneLoading: boolean = false;
  public pinStatus: number = 0;
  public likeStatus: number = 0;
  public plusOneStatus: number = 0;
  public appInfo: any;
  public appFlag: boolean;
  public accordionList: any;
  public systemInfo: any;
  public referenceAccordion: any;
  public emptyList = [];

  public bannerClass = "doc-bg";
  public contentPath = '';
  public styleName = '';
  public flagId = 0;

  public successMsg: string = '';
  public bodyClass2: string = "submit-loader";
  public scrollPos: number = 0;

  public opacityFlag: boolean = false;
  public approveProcessFlag: boolean = false;
  public documentStatusId: string = '';
  public pTableHeight = '250px';
  public documentApprovalFlag: string = localStorage.getItem('approveProcessEnabled');

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private announcementService: AnnouncementService,
    private apiUrl: ApiService,
    private location: Location,
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService,
    private sanitizer: DomSanitizer,
    private plocation: PlatformLocation,
  ) {

  this.accordionList = [
    {
      id: "app-info",
      class: "app-info",
      title: "Application",
      description: "",
      isDisabled: false,
      isExpanded: true
    }
  ];

  this.referenceAccordion = [
    {
      id: "system",
      class: "system",
      title: "System Information",
      description: "",
      isDisabled: true,
      isExpanded: true
    }
  ];
  this.plocation.onPopState (() => {
    let url = this.router.url.split('/');
    if(url[1] == RedirectionPage.Kaizen) {
      let scrollPos = localStorage.getItem('preScrollPos');
      this.scrollPos = (scrollPos == null) ? 0 : parseInt(scrollPos);
      this.opacityFlag = true;
      setTimeout(() => {
        localStorage.removeItem('preScrollPos');
        setTimeout(() => {
          let id = 'documentView';
          this.scrollToElem(id);
        }, 500);
      }, 5);
    }
  });
}

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);

    this.route.params.subscribe( params => {
      this.dataId = params.id;
    });

    this.title = `${this.title}${this.dataId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    this.approveProcessFlag = localStorage.getItem('approveProcessEnabled') == '1' ? true : false;


    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    this.getDocInfo();

    let anntype = localStorage.getItem('annType');
    if(anntype!=null && anntype!='null'){
      this.anncType = anntype;
    }

    if(!this.teamSystem) {
      setTimeout(() => {
        this.viewDocInterval = setInterval(() => {
          let viewDocWidget = localStorage.getItem('viewDoc');
          if (viewDocWidget) {
            console.log('in view');
            this.loading = true;
            this.getDocInfo();
            localStorage.removeItem('viewDoc');
          }
        }, 50)
      },1500);
    }

    this.subscription.add(
      this.commonApi.docViewLoadSubject.subscribe((response) => {
        let action = response['action'];
        let id = response['docId'];
        if(action == 'load' && this.dataId == id) {
          this.loading = true;
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((response) => {
        console.log(response)
        let flag: any = response;
        this.rightPanel = flag;
      })
    );

  }

  getDocInfo()
  {
  this.threadViewErrorMsg = '';
  this.threadViewError = false;

  const apiFormData = new FormData();

  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('dataId', this.dataId);
  apiFormData.append('platform', '3');

  this.probingApi.kaizenListDetailApi(apiFormData).subscribe(res => {

    if(res.status=='Success'){

        this.threadViewData = res.items[0];
        console.log(this.threadViewData);

        if( this.threadViewData == 'undefined' || this.threadViewData == '' || this.threadViewData == undefined  ){
          this.loading = false;
          this.threadViewErrorMsg = res.result;
          this.threadViewError = true;
        }
        else{
          this.threadViewData = res.items[0];
          if(this.threadViewData != ''){

            this.contentType = this.threadViewData.contentType;

            this.threadUserId = this.threadViewData.contributerId;


            let postedByUser='';
            if(this.threadViewData.postedBy && (this.threadViewData.postedBy!='undefined' || this.threadViewData.postedBy!=undefined))
            {
               postedByUser = this.threadViewData.postedBy;
            }


            if(this.userId == this.threadUserId || postedByUser==this.userId){
              this.threadOwner = true;
            }

            if(this.threadViewData.title != 'null' && this.threadViewData.title != '' && this.threadViewData.title != null){
              this.threadViewData.title=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.title));
            }

            if(this.threadViewData.problemPresentStatus != 'null' && this.threadViewData.problemPresentStatus != '' && this.threadViewData.problemPresentStatus != null){
              let desc = '';
              desc= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.problemPresentStatus));
              this.threadViewData.problemPresentStatus = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(desc));
            }
            if(this.threadViewData.keizenObeservation != 'null' && this.threadViewData.keizenObeservation != '' && this.threadViewData.keizenObeservation != null){
              let keizenObeservation = '';
              keizenObeservation= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.keizenObeservation));
              this.threadViewData.keizenObeservation = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(keizenObeservation));
            }
            if(this.threadViewData.analysis != 'null' && this.threadViewData.analysis != '' && this.threadViewData.analysis != null){
              let analysis = '';
              analysis= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.analysis));
              this.threadViewData.analysis = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(analysis));
            }
            if(this.threadViewData.actionTaken != 'null' && this.threadViewData.actionTaken != '' && this.threadViewData.actionTaken != null){
              let actionTaken = '';
              actionTaken= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.actionTaken));
              this.threadViewData.actionTaken = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(actionTaken));
            }



            this.threadEdited = this.threadViewData.IsEdited;
            this.threadId = this.threadViewData.resourceID;

            this.threadUserId = this.threadViewData.contributerId;

            if(this.userId == this.threadUserId){
              this.threadOwner = true;
            }

            this.threadPosted = this.threadViewData.postedFrom == '' ? '' : this.threadViewData.postedFrom;
            this.year = this.threadViewData.year;


            this.threadViewData.likeCount = this.threadViewData.likeCount;
            this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
            this.threadViewData.likeStatus = this.threadViewData.likeStatus;
            this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';

            this.pinCount = this.threadViewData.pinCount;
            this.pinCountVal = this.threadViewData.pinCount == 0 ? '-' : this.threadViewData.pinCount;
            this.pinStatus = this.threadViewData.pinStatus;
            this.pinImg = (this.threadViewData.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';

            if(this.threadViewData.uploadContents.length>0){
              for (let att in this.threadViewData.uploadContents) {
                let fileCaption = (this.threadViewData.uploadContents[att].fileCaption == 'undefined' || this.threadViewData.uploadContents[att].fileCaption == undefined) ? '' : this.threadViewData.uploadContents[att].fileCaption;
                this.threadViewData.uploadContents[att].fileCaption = fileCaption;
              }
            }
            this.attachments = this.threadViewData.uploadContents;
            this.attachmentLoading = (this.threadViewData.uploadContents.length>0) ? false : true;

            this.userRoleTitle = this.threadViewData.userTitle !='' ? this.threadViewData.userTitle : 'No Title';

            if(this.threadViewData.editHistory){
              let editdata = this.threadViewData.editHistory;
              for (let ed in editdata) {
                let editdate1 = editdata[ed].updatedOnNew;
                let editdate2 = moment.utc(editdate1).toDate();
                editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
              }
            }

            let createdOnNew = this.threadViewData.submitedDate == null || this.threadViewData.submitedDate == '' ? this.threadViewData.createdOn: this.threadViewData.submitedDate;
            let createdOnDate = moment.utc(createdOnNew).toDate();
            this.threadCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');

            let updatedOnNew = this.threadViewData.updatedOnMobile;
            let updatedOnDate = moment.utc(updatedOnNew).toDate();
            this.threadupdatedOn = moment(updatedOnDate).local().format('MMM DD, YYYY . h:mm A');

            let createdBy = this.threadViewData.createdBy;
            let modifiedBy = '';


            modifiedBy = '';
            this.threadupdatedOn = '';

            let userInfo = {};
            //if(this.approvalEnableDomainFlag){
              let approvedBy = '';
              let threadApprovedOn = '';
              let approveFlag = false;
              console.log(this.threadViewData.kaizenStatusId);
              approvedBy = this.threadViewData.approvedByUserName != undefined ? this.threadViewData.approvedByUserName : '';
              if(approvedBy != ''){
                approveFlag = true;
                threadApprovedOn = '';
                if(this.threadViewData.approvedDate != '' && this.threadViewData.approvedDate != null && this.threadViewData.approvedDate != undefined){
                  let approvedOnNew = this.threadViewData.approvedDate;
                  let approvedOnDate = moment.utc(approvedOnNew).toDate();
                  threadApprovedOn = moment(approvedOnDate).local().format('MMM DD, YYYY . h:mm A');
                }
              }
              userInfo = {
                createdBy: createdBy,
                createdOn: this.threadCreatedOn,
                updatedBy: modifiedBy,
                updatedOn: this.threadupdatedOn,
                approveFlag: approveFlag,
                approvedBy: approvedBy,
                approvedOn: threadApprovedOn,
              };
            /*}
            else{
              userInfo = {
                createdBy: createdBy,
                createdOn: this.threadCreatedOn,
                updatedBy: modifiedBy,
                updatedOn: this.threadupdatedOn,
              };
            }  */

            this.systemInfo = {
              header: false,
              workstreams: this.threadViewData.workstreams,
              userInfo: userInfo
            };

            this.threadViewData.noOfOccurance =  this.threadViewData.scopePlan == undefined || this.threadViewData.scopePlan == "" ? "" : JSON.parse(this.threadViewData.scopePlan);

            this.styleName = 'empty';
            this.flagId = 0;
            let attachments = this.threadViewData.uploadContents;
            if(attachments.length > 0) {
                let attachment = attachments[0];
                this.flagId = attachment.flagId;
                if (attachment.flagId == 1)
                    this.contentPath = attachment.thumbFilePath;
                else if (attachment.flagId == 2)
                    this.contentPath = attachment.posterImage;
                else if (attachment.flagId == 3)
                    this.styleName = 'mp3';
                else if (attachment.flagId == 4 || attachment.flagId == 5) {
                    let fileType = attachment.fileExtension.toLowerCase();
                    switch (fileType) {
                        case 'pdf':
                            this.styleName = 'pdf';
                            break;
                        case 'application/octet-stream':
                        case 'xlsx':
                        case 'xls':
                            this.styleName = 'xls';
                            break;
                        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                        case 'application/msword':
                        case 'docx':
                        case 'doc':
                        case 'msword':
                            this.styleName = 'doc';
                            break;
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        case 'pptx':
                        case 'ppt':
                            this.styleName = 'ppt';
                            break;
                        case 'zip':
                            this.styleName = 'zip';
                            break;
						            case 'exe':
                            this.styleName = 'exe';
                            break;
                        case 'txt':
                            this.styleName = 'txt';
                            break;
                        default:
                            this.styleName = 'unknown-thumb';
                            break;
                        }
                }
                else if (attachment.flagId == 6) { // link, youtube
                    let banner = '';
                    let prefix = 'http://';
                    let logoImg = attachment.thumbFilePath;
                    this.styleName = (logoImg == "") ? 'link-default' : '';
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
                          this.bannerClass = "banner-link";
                          banner = logo;
                        }
                    }
                    this.contentPath = banner;
                }
                else if (attachment.flagId == 8) {
                  this.styleName = 'html';
                }
            }

           // give access to Thread Edit, Delete
            let access = false;
            if((this.threadOwner || this.roleId=='3' || this.roleId=='10')){
              access = true;
            }
            if(this.documentApprovalFlag != '1'){
              access = false;
            }

            let documentStatus = '';
            let documentStatusBgColor='';
            //if(this.approvalEnableDomainFlag){
              if(!this.approveProcessFlag && this.threadViewData.kaizenStatusId == '2'){
                this.documentStatusId = '3';
                documentStatus = "In-Process";
                documentStatusBgColor = "rgb(45, 126, 218)";
              }
              else{
                this.documentStatusId = this.threadViewData.kaizenStatusId;
                documentStatus = this.threadViewData.kaizenStatus;
                documentStatusBgColor = this.threadViewData.kaizenStatusBgColor;
              }
              if(this.threadOwner && this.documentStatusId == '2' || this.threadOwner && this.documentStatusId == '3'){
                access = false;
              }
            //}

            this.headerData = {
              // Enable for push
              'pageName': 'kaizen',
              'threadId': this.dataId,
              'threadStatus': documentStatus,
              'threadStatusBgColor': documentStatusBgColor,
              'threadStatusColorValue': '#ffffff',
              'threadOwnerAccess': access,
              'reopenThread': '',
              'closeThread': ''
            };
            this.loading = false;

          }
          else{
            this.loading = false;
            this.threadViewErrorMsg = res.result;
            this.threadViewError = true;
          }
        }
   }
   else{
     this.loading = false;
     this.threadViewErrorMsg = res.result;
     this.threadViewError = true;
   }

 },
 (error => {
   this.loading = false;
   this.threadViewErrorMsg = error;
   this.threadViewError = '';
 })
 );
}
// Set Screen Height
setScreenHeight() {
  this.innerHeight = (this.bodyHeight - 127 );
}

   // Like, Pin and OnePlus Action
   socialAction(type, status) {
    console.log(type,status);
    let actionStatus = '';
    let actionFlag = true;
    let likeCount = this.threadViewData.likeCount;
    let pinCount = this.threadViewData.pinCount;
    switch(type) {
      case 'like':
      actionFlag = (this.threadViewData.likeLoading) ? false : true;
      actionStatus = (status == 0) ? 'liked' : 'disliked';
      this.threadViewData.likeStatus = (status == 0) ? 1 : 0;
      this.threadViewData.likeStatus = this.threadViewData.likeStatus;
      this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
      this.threadViewData.likeCount = (status == 0) ? likeCount+1 : likeCount-1;
      this.threadViewData.likeCount = this.threadViewData.likeCount;
      this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
      break;
      case 'pin':
      actionFlag = (this.pinLoading) ? false : true;
      actionStatus = (status == 0) ? 'pined' : 'dispined';
      this.pinStatus = (status == 0) ? 1 : 0;
      this.pinStatus = this.pinStatus;
      this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';
      this.pinCount = (status == 0) ? pinCount+1 : pinCount-1;
      this.pinCount = this.pinCount;
      this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
      break;
    }
    if(actionFlag) {

      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('dataId', this.threadId);
      apiFormData.append('ismain','1');
      apiFormData.append('status', actionStatus);
      apiFormData.append('type', type);

      this.announcementService.resourceAddLike(apiFormData).subscribe((response) => {
        if(response.status != 'Success') {
          switch(type) {
            case 'like':
            this.threadViewData.threadViewData.likeStatus = status;
            this.threadViewData.likeStatus = this.threadViewData.likeStatus;
            this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
            this.threadViewData.likeCount = (status == 0) ? likeCount-1 : likeCount+1;
            this.threadViewData.likeCount = this.threadViewData.likeCount;
            this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
            break;

            case 'pin':
            this.pinStatus = status;
            this.pinStatus = this.pinStatus;
            this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';
            this.pinCount = (status == 0) ? pinCount-1 : pinCount+1;
            this.pinCount = this.pinCount;
            this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
            break;

          }
        }

      });
    }
  }

  // thread like, pinned, posted user list
  threadDashboarUserList(dashboard,dashboardTab,threadId,ismain){
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add('profile');
    const modalRef = this.modalService.open(FollowersFollowingComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.type = dashboard;
      let dashboardData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        threadId: threadId,
        postId: '',
        ismain: ismain,
        tap: dashboardTab
      };
    modalRef.componentInstance.dashboardData = dashboardData;
    modalRef.componentInstance.updatefollowingResponce.subscribe((receivedService) => {
    if (receivedService) {
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.add('profile');
    }
    });
  }

  // tab on user profile page
  taponprofileclick(userId){
    var aurl='profile/'+userId+'';
    if(this.teamSystem){
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else{
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

  beforeParentPanelOpened(panel, appData){
    panel.isExpanded = true;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = true;
      }
    }
    console.log("Panel going to  open!");
  }

  beforeParentPanelClosed(panel, appData) {
    panel.isExpanded = false;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = false;
      }
    }
  }

  afterPanelClosed(){
    console.log("Panel closed!");
  }

  afterPanelOpened(){
    console.log("Panel opened!");
  }

  // header event tab/click
  threadHeaderAction(event) {
    switch (event) {
      case "delete":
        this.delete();
        break;
    }
  }

  // Delete Kaizen
  delete() {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      console.log(receivedService);
      if (receivedService) {
        this.bodyElem.classList.add(this.bodyClass2);
        const submitModalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        let apiData = {
          apiKey: Constant.ApiKey,
          domainId: this.domainId,
          countryId: this.countryId,
          userId: this.userId,
          contentType: this.contentType,
          dataId: this.threadId,
        };

        this.announcementService.deleteDocument(apiData).subscribe((response) => {
          submitModalRef.dismiss("Cross click");
          this.bodyElem.classList.remove(this.bodyClass2);
          this.successMsg = response.result;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            let url = "kaizens";
            if (this.teamSystem) {
              this.loading = true;
              window.open(url, IsOpenNewTab.teamOpenNewTab);
            } else {
              //window.close();
              //window.opener.location.reload();
              let wsNav:any = localStorage.getItem('wsNav');
              let wsNavUrl = localStorage.getItem('wsNavUrl');
              let url = (wsNav) ? wsNavUrl : this.navUrl;
              let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
              if(routeLoadIndex >= 0) {
                let routeText = pageTitle[routeLoadIndex].routerText;
                let flag: any = true;
                localStorage.setItem(routeText, flag);
              }
              this.router.navigate([url]);
            }
            /* let chkLandingRecentFlag = localStorage.getItem('landingRecentNav');
            let chkNavData = this.commonApi.checkNavEdit();
            let navFromEdit: any = chkNavData.navFromEdit;
            let routeLoadIndex: any = chkNavData.routeLoadIndex;
            let url = chkNavData.url;
            navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
            let chkRouteLoad;
            if(routeLoadIndex >= 0) {
              let routeText = pageTitle[routeLoadIndex].routerText;
              chkRouteLoad = localStorage.getItem(routeText);
            }
            let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad;
            if(navFromEdit || routeLoad) {
              this.router.navigate([url]);
            } else {
              this.location.back();
            }
            if(!chkLandingRecentFlag) {
              let data = {
                access: 'kaizens',
                action: 'silentDelete',
                pushAction: 'load',
                threadId: this.threadId
              }
              this.commonApi.emitMessageReceived(data);
            }
            setTimeout(() => {
              localStorage.removeItem('wsNav');
              localStorage.removeItem('wsNavUrl');
              localStorage.removeItem(silentItems.silentThreadCount);
            }, 100); */
          }, 2000);
        });
      }
    });
  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='documentView'){
      this.scrollPos = event.target.scrollTop;
      let scrollTop:any = this.scrollPos;
      localStorage.setItem('preScrollPos',scrollTop);
    }
  }

   // Scroll to element
   scrollToElem(id) {
    let secElement = document.getElementById(id);
    if(secElement != undefined || secElement != null){
      secElement.scrollTop = this.scrollPos;
      this.opacityFlag = false;
    }
    else{
      this.opacityFlag = false;
    }
   }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);

  }

}
