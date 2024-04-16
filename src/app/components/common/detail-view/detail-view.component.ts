import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { Constant,IsOpenNewTab,windowHeight } from '../../../common/constant/constant';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FollowersFollowingComponent } from '../../../components/common/followers-following/followers-following.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  @Input() threadViewData;

  public loading:boolean = true;
  public userRole:string = '';
  public threadPosted:string = '';
  public theadTitle:string= '';
  public year:string= '';
  public threadCreatedOn = '';
  public expDate = '';
  public taglength;
  public tagData;
  public workStreamslength;
  public workStreamsData;
  public threadEdited;
  public attachmentLoading: boolean = true;
  public action = "view";
  public attachments: any;
  public userRoleTitle:string='';
  public user:any;
  public domainId;
  public userId;
  public threadId;
  public countryId;
  public likeCountVal;
  public likeCount: number = 0;
  public likeImg;
  public likeLoading: boolean = false;
  public likeStatus: number = 0;
  public threadOwner: boolean =false;
  public threadUserId;
  public bodyElem;

  constructor(private sanitizer: DomSanitizer, private announcementService: AnnouncementService, private authenticationService:AuthenticationService,private modalService: NgbModal,) { }

  ngOnInit(): void {

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    console.log(this.threadViewData)
    this.getThreadInfo();
   }

   getThreadInfo(){
     console.log('announcement');
    this.threadViewData  = this.threadViewData;
    console.log(this.threadViewData);

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
    this.threadEdited = this.threadViewData.IsEdited;
    this.threadId = this.threadViewData.resourceID;

    this.threadUserId = this.threadViewData.contributerId;

    if(this.userId == this.threadUserId){
      this.threadOwner = true;
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

    this.threadViewData.likeCount = this.threadViewData.likeCount;
    this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
    this.threadViewData.likeStatus = this.threadViewData.likeStatus;
    this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';

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
   }

   // Like, Pin and OnePlus Action
  socialAction(type, status) {
    console.log(type,status);
    let actionStatus = '';
    let actionFlag = true;
    let likeCount = this.threadViewData.likeCount;
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

  // tab on user profile page
  taponprofileclick(userId){
    let teamSystem = localStorage.getItem('teamSystem');
    var aurl='profile/'+userId+'';
    let viewUrl = `announcements/view/${this.threadId}`;
    localStorage.setItem('profileNavFrom', viewUrl);
    if(teamSystem) {
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else{
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

}
