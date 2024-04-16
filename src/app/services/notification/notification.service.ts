import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { CommonService } from '../common/common.service';
import { Constant } from '../../common/constant/constant';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppUserNotificationsComponent } from 'src/app/components/common/app-user-notifications/app-user-notifications.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LandingpageService } from '../landingpage/landingpage.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { CallsService } from 'src/app/controller/calls.service';
import * as moment from 'moment';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  user: any;
  isModalOpen: boolean = false;
  totalThreadsNotificationcount = 0;
  notificationClass = 'top-right-notifications-popup';
  totalNotificationcount = 0;
  totalunseenunreadcolor = '';
  public access: string;
  apiData: Object = { offset: '' };
  videoCall: boolean;
  videoCallData: any = null;
  currentMessage = new BehaviorSubject(null);
  bodyElem;
  private config: NgbModalConfig;
  totalAnnouncementColor = '';
  totalAnnounceNotificationcount: any;
  totalChatNotificationcount: number;
  totalChatColor: any;
  totalOthersNotificationcount;
  totalThreadsColor: string;
  totalOthersColor: string;
  loadingnotifications: boolean;
  userId;
  domainId;
  countryId;
  notificationType = 0;
  incomingCallRing: HTMLMediaElement;
  notificationChannel: BroadcastChannel;

  itemOffset: number = 0;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  notificationArr = [];
  itemLength = 0;
  public itemTotal: number;

  public noNotificationsFlag = false;
  public emptyNotificationsFlag = '';
  public loadingnotificationscontent: boolean = false;
  notificationtabType: any = '';
  public loadingnotificationsScroll: boolean = true;

  newNotificationsFCM: any = '';
  visibility: BehaviorSubject<boolean> = new BehaviorSubject(false);

  activeChatObject: any = {
    notificationId: null,
    postId: null,
    threadId: null,
    chatType: null,
    leaveGroup: 0,
    chatGroupId: 0,
    workStreamId: 0,
  };

  constructor(
    public sharedSvc: CommonService,
    private router: Router,
    private angularFireMessaging: AngularFireMessaging,
    private modalService: NgbModal,
    public landingpageAPI: LandingpageService,
    private authenticationService: AuthenticationService,
    private call: CallsService
  ) {
    this.user = this.authenticationService.userValue;
    if (this.user) {
      this.userId = this.user.Userid;
      this.domainId = this.user.domain_id;
    }
    this.countryId = localStorage.getItem('countryId');
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      ({ data }: { data: any }) => {
        console.log('new message received check for call. ', data);
        if (data.typeId == 2) {
          this.call.groupName = data.groupName;
          this.videoCall = true;
          this.videoCallData = data;
          this.initIncomingCallRing();
          localStorage.setItem('videoCallDataToken', data.tokenValue);
          localStorage.setItem('groupName', data.groupName);
          localStorage.setItem('videoCallDataSessionId', data.sessionId);
          localStorage.setItem('rejoin', 'false');
        }
      });
  }

  initIncomingCallRing() {
    this.incomingCallRing = <HTMLMediaElement>document.getElementById('incoming-call');
    this.incomingCallRing.play();

    setTimeout(() => {
      this.videoCall = false;
      this.videoCallData = null;
      this.incomingCallRing.pause();
    }, 30000);
  }

  async getUserAppNotifications(type = '', actionMethod = '', apiData: any = '') {
    this.itemOffset=0;
    // console.log("getUserAppNotifications");
    if (type == '') {
      type = '0';
    }
    if (actionMethod != 'clear' && actionMethod != 'view') {
      if (this.itemOffset == 0) {
        this.notificationArr = [];
      }
    }

    if (apiData) {
      this.apiData = apiData;
    }

    this.apiData['offset'] = this.itemOffset;

    if (this.newNotificationsFCM == 'new') {
      this.apiData['limit'] = 1;
      this.apiData['offset'] = 0;
      this.apiData['instantPush'] = 1;
    }

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('type', type);
    apiFormData.append('totalFlag', '0');
    apiFormData.append('desktop', '1');



    // notificationId=& postId=& threadId=& chatType=3 & leaveGroup=0 & chatGroupId=51 & workStreamId=0

    let data = new FormData();
    data.append('apiKey', this.apiData['apiKey']);
    data.append('userId', this.apiData['userId']);
    data.append('domainId', this.apiData['domainId']);
    data.append('type', 'chat');
    data.append('action', 'clear');

    data.append('notificationId', this.activeChatObject.notificationId);
    data.append('postId', this.activeChatObject.postId);
    data.append('threadId', this.activeChatObject.threadId);
    data.append('chatType', this.activeChatObject.chatType);
    data.append('leaveGroup', this.activeChatObject.leaveGroup);
    data.append('chatGroupId', this.activeChatObject.chatGroupId);
    data.append('workStreamId', this.activeChatObject.workStreamId);
    let currUrl = this.router.url.split('/');
    console.log(this.activeChatObject.chatType+'----service--'+currUrl[1]+'--'+currUrl[2]);
    if((this.activeChatObject.chatType!=null && this.activeChatObject.chatType!='null')){
      console.log('-------read222');
      this.landingpageAPI.readandDeleteNotification(data).subscribe(() => {

      });
    }


        this.landingpageAPI.Getusernotifications(apiFormData).subscribe((response) => {
          // console.log('Getusernotifications', response);
          let rstatus = response.status;
          let rresult = response.result;
          let rtotal = response.total;
          this.itemTotal = rtotal;
          if (rtotal > 0) {

            this.emptyNotificationsFlag = '';
          }
          else {
            this.emptyNotificationsFlag = 'disabledNotificationsColor';
          }
          let notificationdatainfo = response.datainfo;
          if (notificationdatainfo.length > 0) {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemOffset += this.apiData['limit'];
            this.itemLength += notificationdatainfo.length;
          }

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

          // this.updateNotificationCountEvent.emit(this.totalNotificationcount + '--' + this.totalunseenunreadcolor);
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
          if (notificationdatainfo.length > 0) {

            this.noNotificationsFlag = false;


            if (actionMethod != 'clear' && actionMethod != 'view') {



              for (let q = 0; q < notificationdatainfo.length; q++) {

                if (this.newNotificationsFCM == 'new') {
                  if (q == 0) {
                    this.newNotificationsFCM = 'new';
                  }

                }

                let threadpostInfo = notificationdatainfo[q].threadpost;

                let notificationInfo = notificationdatainfo[q].notification;
                let threadTitle = '';
                if (threadpostInfo.threadTitle) {
                  threadTitle = threadpostInfo.threadTitle;
                  if (notificationInfo.displayType == '2') {
                    threadTitle = threadpostInfo.content;
                  }
                }
                if (threadpostInfo.title) {
                  threadTitle = threadpostInfo.title;
                }
                let threadId = '';
                let postId = '';
                if (threadpostInfo.threadId) {
                  threadId = threadpostInfo.threadId;
                }
                if (threadpostInfo.postId) {
                  postId = threadpostInfo.postId;
                }
                if (threadpostInfo.resourceID) {
                  threadId = threadpostInfo.resourceID;
                  postId = threadpostInfo.resourceID;
                }
                let urgencyLevel = '';

                if (threadpostInfo.urgencyLevel) {
                  urgencyLevel = threadpostInfo.urgencyLevel;
                }

                let shownotificationTitle = notificationInfo.notificationTitle;
                let userList = notificationInfo.userlist;
                let badgeStatus = threadpostInfo.badgeStatus;
                if (badgeStatus) {

                }
                else {
                  let badgeStatus = threadpostInfo.badgestatus;
                }
                let WorkstreamsList = threadpostInfo.WorkstreamsList;
                let mmake = threadpostInfo.make;
                let mmodel = threadpostInfo.model;
                let myear = threadpostInfo.year;
                let availability = threadpostInfo.availability;
                let profile_image = '';

                let groupName = '';
                if (threadpostInfo.groupName) {
                  groupName = threadpostInfo.groupName;
                }

                if (badgeStatus == '') {
                  badgeStatus = 'No Title';
                }
                let readStatus = notificationInfo.readStatus;
                let userId = notificationInfo.userId;
                let userName = notificationInfo.userName;
                let countReset = notificationInfo.countReset;
                let profileImg = notificationInfo.profileImg;
                if (profileImg) {
                  profileImg = notificationInfo.profileImg;

                }
                else {
                  profileImg = threadpostInfo.profile_image;
                }
                let displayDate = notificationInfo.displayDate;
                let createdOnDate = moment.utc(displayDate).toDate();
                let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');
                let actionType = notificationInfo.actionType;
                let notifierType = notificationInfo.notifierType;
                let displayType = notificationInfo.displayType;
                let subType = notificationInfo.subType;

                let notificationId = notificationInfo.id;
                let ChatchatType = threadpostInfo.chatType;

                let ChatchatGroupId = threadpostInfo.chatGroupId;
                let ChatworkstreamId = threadpostInfo.workstreamId;

                if (this.newNotificationsFCM == 'new') {
                  if (this.notificationArr.length >= 3) {
                    this.notificationArr.splice(-1, 1);
                  }
                  // alert(12);
                  this.notificationArr.unshift(
                    {
                      threadId: threadId,
                      postId: postId,
                      threadTitle: this.ChatUCode(threadTitle),
                      make: mmake,
                      model: mmodel,
                      year: myear,

                      availability: availability,
                      WorkstreamsList: WorkstreamsList,
                      notificationTitle: shownotificationTitle,
                      badgeStatus: badgeStatus,
                      readStatus: readStatus,
                      userId: userId,
                      userName: userName,
                      countReset: countReset,
                      profileImg: profileImg,
                      displayDate: localcreatedOnDate,
                      actionType: actionType,
                      notifierType: notifierType,
                      displayType: displayType,
                      subType: subType,
                      groupName: groupName,
                      notificationId: notificationId,
                      chatType: ChatchatType,
                      chatGroupId: ChatchatGroupId,
                      workstreamId: ChatworkstreamId,
                      urgencyLevel: urgencyLevel,
                      userList: userList,
                      state: 'active'
                    }
                  )
                }
                else {
                  this.notificationArr.push(
                    {
                      threadId: threadId,
                      postId: postId,
                      threadTitle: this.ChatUCode(threadTitle),
                      make: mmake,
                      model: mmodel,
                      year: myear,

                      availability: availability,
                      WorkstreamsList: WorkstreamsList,
                      notificationTitle: shownotificationTitle,
                      badgeStatus: badgeStatus,
                      readStatus: readStatus,
                      userId: userId,
                      userName: userName,
                      countReset: countReset,
                      profileImg: profileImg,
                      displayDate: localcreatedOnDate,
                      actionType: actionType,
                      notifierType: notifierType,
                      displayType: displayType,
                      subType: subType,
                      groupName: groupName,
                      chatType: ChatchatType,
                      chatGroupId: ChatchatGroupId,
                      workstreamId: ChatworkstreamId,
                      notificationId: notificationId,
                      urgencyLevel: urgencyLevel,
                      userList: userList,
                      state: 'active'
                    }
                  )
                }
              }
            }
            else {
              this.noNotificationsFlag = false;
            }
          }
          else {
            if (this.itemOffset == 0) {
              this.noNotificationsFlag = true;
            }
          }

          this.loadingnotifications = false;
          this.loadingnotificationsScroll = false;

          this.loadingnotificationscontent = false;

          setTimeout(() => {
            $('.notification-content-bg-color00').removeClass('new');
          }, 4000);

        });

  }

  ChatUCode(t) {
    var S = '';
    for (let a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S += '\\u' + ('0000' + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    console.log(S);
    return S;

  }


  deleteAlluserNotifications(apiData, type = '') {
    this.apiData = apiData;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', apiData['apiKey']);
    apiFormData.append('domainId', apiData['domainId']);
    apiFormData.append('countryId', apiData['countryId']);
    apiFormData.append('userId', apiData['userId']);
    apiFormData.append('limit', apiData['limit']);
    apiFormData.append('offset', apiData['offset']);
    apiFormData.append('type', type);
    apiFormData.append('status', 'clear');
    apiFormData.append('desktop', '1');
    this.landingpageAPI.Dismissallnotifications(apiFormData).subscribe((response) => {
      this.changeNotificationType(0);
    });
  }

  changeNotificationType(type) {
    this.itemOffset = 0;
    this.scrollCallback = false;
    this.notificationArr = [];
    this.itemLength = 0;
    this.noNotificationsFlag = false;
    this.loadingnotificationscontent = true;
    this.notificationtabType = type;

    $('.notification-img').removeClass('active');
    if (type == 0) {
      $('.head-all').addClass('active');
    }
    else if (type == 1) {
      $('.head-threads').addClass('active');
    }
    else if (type == 2) {
      $('.head-announcement').addClass('active');
    }
    else if (type == 3) {
      $('.head-chat').addClass('active');
    }
    else if (type == 6) {
      $('.head-wrench').addClass('active');
    }
    this.getUserAppNotifications(type);
    console.log('#second');
  }
}
