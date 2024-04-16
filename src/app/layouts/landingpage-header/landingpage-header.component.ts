import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LandingpageService } from '../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Constant } from '../../common/constant/constant';
import { AppUserNotificationsComponent } from '../../components/common/app-user-notifications/app-user-notifications.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
@Component({
  selector: 'app-landingpage-header',
  templateUrl: './landingpage-header.component.html',
  styleUrls: ['./landingpage-header.component.scss']
})
export class LandingpageHeaderComponent implements OnInit {
  @Input() pageData;
  @Output() search: EventEmitter<any> = new EventEmitter();
  public countryId;
  public user: any;
  public domainId;
  public userId;
  public apiData: Object;
  public access: string;
  public welcomeProfileFlag: boolean;
  public profileFlag: boolean;
  public landingheaderFlag: boolean = false;
  public searchFlag: boolean;

  public headTitleFlag: boolean = false;
  public headTitle: string;

  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;

  public userName: string = "";
  public profileImage: string = "";
  public isTeamChart: string = "";

  public loadingnotifications: boolean = true;
  public notificationType = 0;
  public totalNotificationcount = 0;
  public totalunseenunreadcolor = '';

  public totalAnnounceNotificationcount = 0;
  public totalAnnouncementColor = '';

  public totalChatNotificationcount = 0;
  public totalChatColor = '';

  public totalThreadsNotificationcount = 0;
  public totalThreadsColor = '';

  public totalOthersNotificationcount = 0;
  public totalOthersColor = '';
  public roleId;
  public apiKey: string = "dG9wZml4MTIz";

  constructor(
    private landingpageAPI: LandingpageService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {


    config.backdrop = false;
    config.keyboard = true;
    // config.size = 'dialog-centered';
    // config.windowClass = 'top-right-notifications-popup-only';
  }
  get f() { return this.searchForm.controls; }
  ngOnInit(): void {
    let options = this.pageData;
    //alert(options);
    console.log(options);
    this.access = options.access;
    this.searchFlag = options.search;
    this.profileFlag = options.profile;
    this.welcomeProfileFlag = options.welcomeProfile;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    if (this.searchFlag) {
      this.searchVal = options.searchKey;
      if (this.searchVal != undefined && this.searchVal != 'undefined' && this.searchVal != '') {
        this.searchTick = true;
        this.searchClose = this.searchTick;
      }
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
    }


    if (this.profileFlag) {
      this.getUserProfile();
    }

    switch (this.access) {
      case 'landingpage':
        this.landingheaderFlag = true;
        break;

    }

  }

  tapnotifications() {
    let bodyElem = document.getElementsByTagName('body')[0];
    bodyElem.classList.add('top-right-notifications-popup');
    const modalRef = this.modalService.open(AppUserNotificationsComponent, this.config);
  }

  async getUserAppNotifications(type = '') {

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'escalationType': 1,
      'limit': 1,
      'offset': 0,
      'type': this.notificationType

    }
    this.apiData = apiInfo;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('type', this.apiData['type']);
    apiFormData.append('totalFlag', '0');
    apiFormData.append('desktop', '1');


    let data = new FormData();
    data.append('apiKey', this.apiData['apiKey']);
    data.append('userId', this.apiData['userId']);
    data.append('domainId', this.apiData['domainId']);
    data.append('type', 'chat');
    data.append('action', 'clear');

    data.append('notificationId', this.notificationService.activeChatObject.notificationId);
    data.append('postId', this.notificationService.activeChatObject.postId);
    data.append('threadId', this.notificationService.activeChatObject.threadId);
    data.append('chatType', this.notificationService.activeChatObject.chatType);
    data.append('leaveGroup', this.notificationService.activeChatObject.leaveGroup);
    data.append('chatGroupId', this.notificationService.activeChatObject.chatGroupId);
    data.append('workStreamId', this.notificationService.activeChatObject.workStreamId);
    this.notificationService.landingpageAPI.readandDeleteNotification(data).subscribe(() => { });


    this.landingpageAPI.Getusernotifications(apiFormData).subscribe((response) => {
      console.log('chat count 3', response);
      let rstatus = response.status;
      let rresult = response.result;
      let rtotal = response.total;

      let totalUnseen = response.totalUnseen;
      let totalUnread = response.totalUnread;

      let totalthreadCount = response.threadCount;
      let totalthreadUnreadCount = response.threadUnreadCount;

      let totalchatCount = response.chatCount;
      let totalchatUnreadCount = response.chatUnreadCount;

      let totalannouncementCount = response.announcementCount;
      let totalannouncementUnreadCount = response.announcementUnreadCount;

      let totalothersUnseenount = response.othersUnseenount;
      let totalothersUnreadount = response.othersUnreadount;

      //Total Notifications

      if (totalUnseen) {
        this.totalNotificationcount = totalUnseen;
        this.totalunseenunreadcolor = 'unseenColor';

      }
      else {
        if (totalUnread) {
          this.totalNotificationcount = totalUnread;
          this.totalunseenunreadcolor = 'unreadColor';
        }
        else {
          this.totalNotificationcount = 0;
          this.totalunseenunreadcolor = '';
        }
      }
      //total announcement
      if (totalannouncementCount) {
        this.totalAnnounceNotificationcount = totalannouncementCount;
        this.totalAnnouncementColor = 'unseenColor';

      }
      else {
        if (totalUnread) {
          this.totalAnnounceNotificationcount = totalannouncementUnreadCount;
          this.totalAnnouncementColor = 'unreadColor';
        }
        else {
          this.totalAnnounceNotificationcount = 0;
          this.totalAnnouncementColor = '';
        }
      }


      //total Chat
      if (totalchatCount) {
        this.totalChatNotificationcount = totalchatCount;
        this.totalChatColor = 'unseenColor';

      }
      else {
        if (totalchatUnreadCount) {
          this.totalChatNotificationcount = totalchatUnreadCount;
          this.totalChatColor = 'unreadColor';
        }
        else {
          this.totalChatNotificationcount = 0;
          this.totalChatColor = '';
        }
      }

      //total Threads
      if (totalthreadCount) {
        this.totalThreadsNotificationcount = totalthreadCount;
        this.totalThreadsColor = 'unseenColor';

      }
      else {
        if (totalthreadUnreadCount) {
          this.totalThreadsNotificationcount = totalthreadUnreadCount;
          this.totalThreadsColor = 'unreadColor';
        }
        else {
          this.totalThreadsNotificationcount = 0;
          this.totalThreadsColor = '';
        }
      }

      //total Others wrench
      if (totalothersUnseenount) {
        this.totalOthersNotificationcount = totalothersUnseenount;
        this.totalOthersColor = 'unseenColor';

      }
      else {
        if (totalthreadUnreadCount) {
          this.totalOthersNotificationcount = totalothersUnreadount;
          this.totalOthersColor = 'unreadColor';
        }
        else {
          this.totalOthersNotificationcount = 0;
          this.totalOthersColor = '';
        }
      }

      this.loadingnotifications = false;


    });
  }

  getUserProfile() {
    let userData = {
      'api_key': Constant.ApiKey,
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.landingpageAPI.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.userName = resultData.username;
      this.profileImage = resultData.profile_image;
      this.isTeamChart = resultData.isTeamChart;
      localStorage.setItem('userRole', resultData.userRole);
      localStorage.setItem('roleId', resultData.roleId);
      localStorage.setItem('userProfile', this.profileImage);
      localStorage.setItem('isTeamChart', this.isTeamChart);

      this.getUserAppNotifications('');
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      this.submitSearch();
    }
  }


  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if (searchValue.length == 0) {
      this.submitted = false;
      this.clearSearch();
    }
  }
  // Submit Search
  submitSearch() {
    //alert(111);
    this.search.emit(this.searchVal);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.search.emit(this.searchVal);
  }


}
