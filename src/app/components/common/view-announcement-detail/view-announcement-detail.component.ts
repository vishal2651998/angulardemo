import { Component, OnInit, HostListener, OnDestroy, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../../services/common/common.service';
import { Constant,IsOpenNewTab,pageTitle,RedirectionPage, windowHeight,silentItems,forumPageAccess } from '../../../common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { ApiService } from '../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../services/thread/thread.service';
import { FollowersFollowingComponent } from '../../../components/common/followers-following/followers-following.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { ConvertComponent } from '../../../components/common/convert/convert.component';
import { ManageDocComponent } from "src/app/components/techinfopro/manage-doc/manage-doc.component";
import { Subscription } from "rxjs";
import { PlatformLocation } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-view-announcement-detail',
  templateUrl: './view-announcement-detail.component.html',
  styleUrls: ['./view-announcement-detail.component.scss']
})
export class ViewAnnouncementDetailComponent implements OnInit {

  @Input() dataId;
  @Input() anncReadUpdate;
  @Output() documentServices: EventEmitter<any> = new EventEmitter();
  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyElem;
  public title:string = 'Announcement ID#';
  public loading:boolean = true;
  public threadViewData:any;
  public isActive: boolean = false;
  public readUpdate: boolean = false;
  public headerData:any;
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
  public viewDocument: boolean = true;
  public threadUserId: number = 0;
  public threadOwner: boolean =false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public userRoleTitle: string = '';
  public disableRightPanel: boolean = true;
  public navUrl: string ='';
  public editAccess: boolean = false;
  public deleteAccess: boolean = false;
  public dashboard: string = 'announcement-dashboard';
  public dashboardTab: string = 'views';
  public updateBtnFlag: boolean = false;
  public contentType: string = '';
  public anncType: string = '';
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
  public attachmentLoading: boolean = true;
  public action = "view";
  public attachments: any;
  public threadId;
  public likeCountVal;
  public likeCount: number = 0;
  public plusOneCount: number = 0;
  public likeImg;
  public likeLoading: boolean = false;
  public likeStatus: number = 0;
  public systemInfo: any;
  public referenceAccordion: any;
  public emptyList = [];
  public contentPath = '';
  public styleName = '';
  public flagId = 0;

  public successMsg: string = '';
  public bodyClass2: string = "submit-loader";
  public scrollPos: number = 0;

  public opacityFlag: boolean = false;
  public headTitle: string = "";
  public expDate = '';
  public copiedModal: boolean = false;
  public bannerClass = "doc-bg";

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
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
    this.referenceAccordion = [
      {
        id: "system",
        class: "system",
        title: "System",
        description: "",
        isDisabled: true,
        isExpanded: true
      }
    ];
   }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];

    if(!document.body.classList.contains(this.bodyClass)) {
      document.body.classList.add(this.bodyClass);
    }

    if(!document.body.classList.contains(this.bodyClass1)) {
      document.body.classList.add(this.bodyClass1);
    }

    if(!document.body.classList.contains('view-modal-popup')) {
      document.body.classList.add('view-modal-popup');
    }

    /*this.route.params.subscribe( params => {
      this.dataId = params.id;
    }); */

    this.title = `${this.title}${this.dataId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.headTitle = "Announcement - ID# "+this.dataId;

    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    setTimeout(() => {
      this.getDocInfo();
    }, 300);


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

  }

  getDocInfo()
  {

    if(!document.body.classList.contains(this.bodyClass)) {
      document.body.classList.add(this.bodyClass);
    }

    if(!document.body.classList.contains('view-modal-popup')) {
      document.body.classList.add('view-modal-popup');
    }


  const apiFormData = new FormData();

  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('dataId', this.dataId);
  apiFormData.append('platform', '3');

  this.announcementService.getAnnouncementDetail(apiFormData).subscribe(res => {

    if(res.status=='Success'){

        this.threadViewData = res.data.thread[0];
        console.log(this.threadViewData);

        if( this.threadViewData == 'undefined' || this.threadViewData == '' || this.threadViewData == undefined  ){
          this.loading = false;

        }
        else{
          this.threadViewData = res.data.thread[0];
          if(this.threadViewData != ''){

            this.contentType = this.threadViewData.contentType;

            this.threadUserId = this.threadViewData.contributerId;

            this.isActive = this.threadViewData.isActive == '1' ? true : false;
            this.readUpdate = this.anncReadUpdate;

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
            if(this.threadViewData.description != 'null' && this.threadViewData.description != '' && this.threadViewData.description != null){
              let desc = '';
              //desc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.description));
             // desc = this.authenticationService.ChatUCode(this.threadViewData.description);
              desc= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.description));
              this.threadViewData.description = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(desc));


            }
            this.threadId = this.threadViewData.resourceID;
            this.dataId = this.threadViewData.resourceID;

            this.threadUserId = this.threadViewData.contributerId;

            if(this.userId == this.threadUserId){
              this.threadOwner = true;
            }

            this.threadPosted = this.threadViewData.postedFrom == '' ? '' : this.threadViewData.postedFrom;
            this.year = this.threadViewData.year;

            let urgencyLevel= this.threadViewData.urgencyLevel;
            this.threadViewData.urgencyLevelText = (urgencyLevel == 2) ? 'URGENT' : '';

            this.taglength = 0;
            if (this.threadViewData.tags.length > 0) {
              this.taglength = this.threadViewData.tags.length;
              this.tagData = this.threadViewData.tags;
            }

            this.workStreamslength = 0;
            if (this.threadViewData.WorkstreamsList.length > 0) {
              this.workStreamslength = this.threadViewData.WorkstreamsList.length;
              this.workStreamsData = this.threadViewData.WorkstreamsList;
            }

            this.countrylength = 0;
            if(this.threadViewData.countries != undefined){
              if (this.threadViewData.countries.length > 0) {
                this.countrylength = this.threadViewData.countries.length;
                this.countryData = this.threadViewData.countries;
              }
            }

            this.threadViewData.likeCount = this.threadViewData.likeCount;
            this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
            this.threadViewData.likeStatus = this.threadViewData.likeStatus;
            this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';


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

            let createdOnNew = this.threadViewData.createdOnMobile;
            let createdOnDate = moment.utc(createdOnNew).toDate();
            this.threadCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');

            let autoExpiryDate1 = this.threadViewData.autoExpiryDate;
            if(autoExpiryDate1!=''){
            let autoExpiryDate2 = moment.utc(autoExpiryDate1).toDate();
            this.expDate = moment(autoExpiryDate2).local().format('MMM DD, YYYY');
            }

            this.threadPosted = this.threadViewData.postedFrom == '' ? '' : this.threadViewData.postedFrom;
            this.year = this.threadViewData.year;
            if(this.threadViewData.updatedOnMobile)
            {
              let updatedOnNew = this.threadViewData.updatedOnMobile;
              let updatedOnDate = moment.utc(updatedOnNew).toDate();
              this.threadupdatedOn = moment(updatedOnDate).local().format('MMM DD, YYYY . h:mm A');
            }
           

            let createdBy = this.threadViewData.createdBy;
            let modifiedBy = this.threadViewData.updatedBy == '' ? '' : this.threadViewData.updatedBy;

            let userInfo = {};

            userInfo = {
              createdBy: createdBy,
              createdOn: this.threadCreatedOn,
              updatedBy: modifiedBy,
              updatedOn: this.threadupdatedOn,
            };

            this.systemInfo = {
              header: false,
              workstreams: this.workStreamsData,
              userInfo: userInfo
            };

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

            let bannerImage = this.threadViewData.bannerImage;
            this.threadViewData.bannerImage = (bannerImage == undefined || bannerImage == 'undefined') ? '' : bannerImage;
            this.contentPath = (this.threadViewData.bannerImage == '') ? this.contentPath : this.threadViewData.bannerImage;

            // give access to Thread Edit, Delete
            let access = false;
            if((this.threadOwner || this.roleId=='3' || this.roleId=='10')){
              access = true;
            }

            this.editAccess = access;
            this.deleteAccess = access;

            this.loading = false;

          }
          else{
            this.loading = false;

          }
        }
   }
   else{
     this.loading = false;

   }

 },
 (error => {
   this.loading = false;

 })
 );
}
// Set Screen Height
setScreenHeight() {
  this.innerHeight = (this.bodyHeight - 87 );
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

  afterPanelClosed(){
    console.log("Panel closed!");
  }

  afterPanelOpened(){
    console.log("Panel opened!");
  }

  // header event tab/click
  threadHeaderAction(event) {
    this.checkAccess(event);
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

  checkAccess(type){
    switch(type){
      case 'edit':
        this.edit();
        break;
      case 'delete':
        this.removeArchiveAccouncement();
        break;
      case 'copylink':
        let currentURL1 = window.location.href;
        let currentURL2 = this.router.url;
        let currentURL3 = currentURL1.replace(currentURL2,"")
        console.log(currentURL3);
        let url = currentURL3+"/announcements/view/"+this.dataId;
        navigator.clipboard.writeText(url);
        this.copiedModal = true;
        setTimeout(() => {
          this.copiedModal = false;
        }, 1500);
        break;
      default:
        break;
    }
  }
  //edit document
  edit(){
    let url, surl, storage;
    let navOpenFlag = true;
    let contentTypeId = '4';
    contentTypeId = '4';
    navOpenFlag = false;
    storage = "docNav";
    url = `announcements/manage/edit/${this.dataId}`;
    //surl = `announcements/view/${this.dataId}`;
    surl = `announcements`;
    localStorage.setItem(storage, surl);
    //this.router.navigate([url]);
    this.closeModal();
    window.open(url,url);
  }

  // remove announcement
  removeArchiveAccouncement(){
    this.bodyElem.classList.add(this.bodyClass2);
    const submitModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('dataId', this.dataId);
    apiFormData.append('type', 'announcements');
      this.announcementService.archiveAnnouncement(apiFormData).subscribe(res => {
      submitModalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass2);
      if(res.status=='Success'){
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = res.result;
          setTimeout(() => {
            //window.location.reload();
            msgModalRef.dismiss('Cross click');
            let data = {
              action: 'delete',
              id: this.threadId
            }
            this.documentServices.emit(data);
          }, 1000);
        }
      }, (error => {
        console.log(error);
      })
    );
  }

  closeModal() {
    let data = {
      action: false
    };
    this.documentServices.emit(data);
  }

  // update announcement
  updateAccouncement(){
    this.anncReadUpdate = false;
    this.readUpdate = this.anncReadUpdate;
    this.bodyElem.classList.add(this.bodyClass2);
    const submitModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('dataId', this.dataId);
    apiFormData.append('type', this.contentType);

     this.announcementService.dismissManuals(apiFormData).subscribe(res => {
      submitModalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass2);
      if(res.status=='Success'){
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = "Announcement Dismissed";
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
            let data = {
              action: 'delete',
              id: this.dataId
            }
            this.documentServices.emit(data);
          }, 1000);
        }
        else{
          this.anncReadUpdate = true;
          this.readUpdate = this.anncReadUpdate;
        }
      }, (error => {
        console.log(error);
      })
    );
  }


  ngOnDestroy() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove("view-modal-popup");
  }

}
