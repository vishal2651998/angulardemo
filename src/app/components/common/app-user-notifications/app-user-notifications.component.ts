import * as moment from 'moment';
import { ChatType, Constant, IsOpenNewTab, LocalStorageItem, PlatFormType, forumPageAccess, notificationType, notificationSubType, RedirectionPage } from 'src/app/common/constant/constant';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CommonService } from '../../../services/common/common.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';
import { ScrollTopService } from '../../../services/scroll-top.service';

declare var $: any;
declare var window: any;
@Component({
  selector: '.app-app-user-notifications',
  templateUrl: './app-user-notifications.component.html',
  styleUrls: ['./app-user-notifications.component.scss'],
  animations: [
    trigger('anim', [
      transition('* => void', [
        style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }),
        sequence([
          animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none' }))
        ])
      ]),
      transition('void => active', [
        style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
        sequence([
          animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }))
        ])
      ])
    ])
  ]
})
export class AppUserNotificationsComponent implements OnInit {

  @Output() updateNotificationCountEvent = new EventEmitter<any>();
  @Input() newNotificationsFCM: any;
  @Input() accessFrom: any;
  public domainId;
  public countryId;
  public userId;
  public loadingdm: boolean = true;
  public loadingnotifications: boolean = true;
  public loadingnotificationsScroll: boolean = true;
  public newThreadView: boolean = false;
  public loadingnotificationscontent: boolean = false;
  public collabticDomain: boolean = false;
  public roleId;
  public landingdomainUsers = [];
  public scrollNotificationHeight: number = 0;
  public scrollminNotificationHeight: number = 0;
  public apiData: Object;
  public itemLimit: number = 10;
  public itemOffset: number = 0;
  public itemLength: number = 0;

  public itemTotal: number;
  public notificationType = '';
  public totalNotificationcount = 0;
  public totalunseenunreadcolor = '';

  public totalAnnounceNotificationcount = 0;
  public totalAnnouncementColor = '';

  public totalChatNotificationcount = 0;
  public totalChatColor = '';

  public totalThreadsNotificationcount = 0;
  public notificationtabType = '';
  public totalThreadsColor = '';
  public setIntervalTimer: any;

  public totalOthersNotificationcount = 0;
  public totalOthersColor = '';
  public teamSystem = localStorage.getItem('teamSystem')
  public shownotificationTitle = '';
  public noNotificationsFlag = false;
  public emptyNotificationsFlag = '';
  public notificationArr = [];

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public user: any;
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);

    // ESC key
    if (event.key == 'Escape') {

    this.closenotification();
      // your logic;
    }
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {


    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    console.log(this.scrollTop + '--' + this.lastScrollTop + '--' + this.scrollInit);
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        //alert(this.notificationtabType);
        if (this.newNotificationsFCM != 'new') {
          this.getUserAppNotifications(this.notificationtabType);
          console.log('#collabtic-5');
          this.loadingnotificationsScroll = true;
        }

      }
    }
    this.lastScrollTop = this.scrollTop;
  }
  constructor(
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private scrollTopService: ScrollTopService,
    public activeModal: NgbActiveModal,
    public ModalRef: NgbModal,
    public commonService: CommonService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    public chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.notificationService.notificationChannel = new BroadcastChannel('notification-channel');
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    let platformId = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.notificationService.notificationChannel.onmessage = (event) => {
      if (event.data.clearAll === true) {
        this.notificationService.deleteAlluserNotifications(event.data.apiData, '')
      } else if (event.data.clearIndividual === true) {
        console.log('#collabtic-6');
        this.getUserAppNotifications(this.apiData['type'], this.apiData['action']);
      }
    }
    //alert(this.newNotificationsFCM);
    localStorage.setItem('notificationOpened', '1');
    this.setTImeInterval();
    if (this.teamSystem) {
      $('.app-app-user-notifications').addClass('teams-integration');
    }


    this.commonService._OnMessageReceivedSubject.subscribe((r) => {

      console.log('#collabtic-1');
      this.getUserAppNotifications('');
    });
    if (this.newNotificationsFCM == 'new') {
      $('.app-app-user-notifications').addClass('new');
    }

    setTimeout(() => {
      // $('.top-right-notifications-popup').find('.modal-dialog').removeClass('modal-dialog-centered');
    }, 500);
    if (this.newNotificationsFCM == 'new') {
      this.scrollNotificationHeight = window.innerHeight;
      this.scrollminNotificationHeight = window.innerHeight;
    }
    else {
      this.scrollNotificationHeight = window.innerHeight - 350;
      this.scrollminNotificationHeight = window.innerHeight - 450;
    }


    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'escalationType': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset,
      'type': this.notificationType
    }
    this.apiData = apiInfo;
    if (this.newNotificationsFCM != 'new') {
      this.getUserAppNotifications('');
      console.log('#collabtic-2');
    }

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

  convertunicode(val) {
    val = val.replace(/\\n/g, '');
    if (val == undefined || val == null) {
      return val;
    }
    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {

      JSON.stringify(val)
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
      return (JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"'));
    }

    else {
      return val;
    }

  }
  setTImeInterval() {
    this.setIntervalTimer = setInterval(() => {
      if (this.newNotificationsFCM == 'new') {
        if (this.notificationArr.length > 0) {
          if (this.notificationArr.length == 1) {
            this.notificationArr.splice(-1, 1);
            this.activeModal.dismiss('Cross Click');
            this.updateNotificationCountEvent.emit('reset');
          }
          else {
            this.notificationArr.splice(-1, 1);
          }


        }
        else {

        }
      }

    }, 8000);
  }

  checkonHover() {
    // clearInterval(this.setIntervalTimer);
  }
  checkonleave() {
    //this.setTImeInterval();
  }

  clearNotification(event, ndata) {
    var notificationId = ndata.notificationId;
    var threadId = ndata.threadId;
    var postId = ndata.postId;
    $('.notification-content-remove-' + notificationId + '').addClass('left-animation');
    setTimeout(() => {
      $('.notification-content-remove-' + notificationId + '').remove();
    }, 750);

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'threadId': threadId,
      'limit': this.itemLimit,
      'offset': this.itemOffset,
      'type': this.notificationtabType,
      'postId': postId,
      'action': 'clear',
      'notificationId': notificationId

    }
    this.apiData = apiInfo;

    this.notificationService.notificationChannel.postMessage({
      clearIndividual: true,
      apiData: this.apiData
    })

    this.clearuserNotifications();
  }

  changeNotificationType(type) {
    this.itemOffset = 0;
    this.scrollCallback = false;
    this.notificationArr = [];
    this.itemLength = 0;
    this.noNotificationsFlag = false;
    this.loadingnotificationscontent = true;
    // alert(type);
    this.notificationtabType = type;
    //  alert(this.notificationtabType);
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
    console.log('#collabtic-3');
  }


  resetuserNotifications(type = '') {
    if (type == '') {
      type = '0';
    }

    this.apiData['offset'] = this.itemOffset;
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
    this.LandingpagewidgetsAPI.Resetusernotifications(apiFormData).subscribe((response) => {
      this.getUserAppNotifications('');
      console.log('#collabtic-4');
    });
  }



  clearuserNotifications() {

    this.apiData['offset'] = this.itemOffset;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('threadId', this.apiData['threadId']);

    apiFormData.append('postId', this.apiData['postId']);
    apiFormData.append('action', this.apiData['action']);
    apiFormData.append('notificationId', this.apiData['notificationId']);
    console.log(apiFormData);
    this.LandingpagewidgetsAPI.ReadandDeleteNotification(apiFormData).subscribe((response) => {

      this.getUserAppNotifications(this.apiData['type'], this.apiData['action']);
      console.log('#collabtic-5');


    });
  }

  async getUserAppNotifications(type = '', actionMethod = '') {
    console.log('how many times');
    // alert(this.newNotificationsFCM+'-----FCM');
    if (type == '') {
      type = '0';
    }
    if (actionMethod != 'clear' && actionMethod != 'view') {
      if (this.itemOffset == 0) {
        this.notificationArr = [];
      }

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
    if (this.newNotificationsFCM!= 'new') {
      //commented due to back ground push
    //this.notificationService.landingpageAPI.readandDeleteNotification(data).subscribe(() => { });

    }
    this.LandingpagewidgetsAPI.Getusernotifications(apiFormData).subscribe((response) => {
      console.log('chat count 4', response);
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
      console.log(notificationdatainfo);
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

      this.updateNotificationCountEvent.emit(this.totalNotificationcount + '--' + this.totalunseenunreadcolor);
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
            let threadCategoryStr='';
            if (threadpostInfo.threadCategoryStr)
            {
              threadCategoryStr= threadpostInfo.threadCategoryStr;
            }

            if (threadpostInfo.threadTitle) {
              threadTitle = threadpostInfo.threadTitle;
              if (notificationInfo.displayType == '2') {
                threadTitle = threadpostInfo.content;
              }
            }
            if (threadpostInfo.title) {
              threadTitle = threadpostInfo.title;
            }
            let newThreadTypeSelect='';
            if (threadpostInfo.newThreadTypeSelect=='share')
            {
              newThreadTypeSelect='share';
            }
            else
            {
              newThreadTypeSelect='thread';
            }
            let threadId = '';
            let workOrderId = '';
            let postId = '';
            let scheduleData = '';
            if (threadpostInfo.workOrderId) {
              workOrderId = threadpostInfo.workOrderId;
            }
            if (threadpostInfo.threadId) {
              threadId = threadpostInfo.threadId;
            }
            if (threadpostInfo.scheduleData) {
              scheduleData = threadpostInfo.scheduleData;
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

            let attachmentCounts = '';

            if (threadpostInfo.attachmentCounts != undefined) {
              attachmentCounts = threadpostInfo.attachmentCounts;
            }
            console.log(attachmentCounts);

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
            let changeStatusTItle =  threadpostInfo.changeStatusTItle
            let mmodel = threadpostInfo.model;
            let docPostedBy =  threadpostInfo.stageName

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
            let contributerId='';
            if(threadpostInfo.contributerId)
            {
            contributerId = threadpostInfo.contributerId;
            }


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
            let actionName = notificationInfo.action_name;
            let actionType = notificationInfo.actionType;
            let notifierType = notificationInfo.notifierType;
            let displayType = notificationInfo.displayType;
            let subType = notificationInfo.subType;
            console.log(threadpostInfo)
            let threadCatg = 0, isGeneral = false;
            if(threadpostInfo.threadCategoryStr) {
              threadCatg = (this.collabticDomain) ? parseInt(threadpostInfo.threadCategoryStr) : 0;
              isGeneral = (this.collabticDomain && threadCatg == 7) ? true : false;
            }
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
                  workOrderId: workOrderId,
                  
                  postId: postId,
                  threadTitle: this.ChatUCode(threadTitle),
                  make: mmake,
                  changeStatusTItle: changeStatusTItle,
                  docPostedBy: docPostedBy,
                  contributerId:contributerId,
                  isGeneral,
                  model: mmodel,
                  year: myear,
                  scheduleData: scheduleData,
                  availability: availability,
                  WorkstreamsList: WorkstreamsList,
                  notificationTitle: shownotificationTitle,
                  newThreadTypeSelect: newThreadTypeSelect,
                  badgeStatus: badgeStatus,
                  readStatus: readStatus,
                  userId: userId,
                  userName: userName,
                  countReset: countReset,
                  profileImg: profileImg,
                  displayDate: localcreatedOnDate,
                  actionType: actionType,
                  actionName: actionName,
                  notifierType: notifierType,
                  displayType: displayType,
                  subType: subType,
                  groupName: groupName,
                  notificationId: notificationId,
                  chatType: ChatchatType,
                  chatGroupId: ChatchatGroupId,
                  workstreamId: ChatworkstreamId,
                  urgencyLevel: urgencyLevel,
                  attachmentCounts: attachmentCounts,
                  userList: userList,
                  threadCategoryStr: threadCategoryStr,
                  state: 'active'
                }
              )
            }
            else {
              this.notificationArr.push(
                {
                  threadId: threadId,
                  workOrderId: workOrderId,
                  postId: postId,
                  threadTitle: this.ChatUCode(threadTitle),
                  make: mmake,
                  changeStatusTItle: changeStatusTItle,
                  docPostedBy: docPostedBy,
                  contributerId:contributerId,
                  isGeneral,
                  scheduleData: scheduleData,
                  model: mmodel,
                  year: myear,
                  availability: availability,
                  WorkstreamsList: WorkstreamsList,
                  notificationTitle: shownotificationTitle,
                  newThreadTypeSelect: newThreadTypeSelect,
                  badgeStatus: badgeStatus,
                  readStatus: readStatus,
                  userId: userId,
                  userName: userName,
                  countReset: countReset,
                  profileImg: profileImg,
                  displayDate: localcreatedOnDate,
                  actionType: actionType,
                  actionName: actionName,
                  notifierType: notifierType,
                  displayType: displayType,
                  subType: subType,
                  groupName: groupName,
                  chatType: ChatchatType,
                  chatGroupId: ChatchatGroupId,
                  workstreamId: ChatworkstreamId,
                  notificationId: notificationId,
                  urgencyLevel: urgencyLevel,
                  attachmentCounts: attachmentCounts,
                  userList: userList,
                  threadCategoryStr: threadCategoryStr,
                  state: 'active'
                }
              )
            }



          }
          // this.resetuserNotifications(type);

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

  tapOnTile(notification) {
    let currUrl = this.router.url.split('/');
    let flag: any = true;
    if (notification.displayType == notificationType.thread && notification.subType == notificationSubType.dispatch) {
      this.commonService.setlocalStorageItem('landingRecentNav', flag);
      localStorage.setItem("notificationOnTap","1");
      localStorage.setItem("notificationTPID",notification.postId);
      var aurl = forumPageAccess.dispatch + notification.threadId;
      if(currUrl[1] == RedirectionPage.Dispatch) {
        if(notification.actionType != 'dispatch-tech-order') {
          let data = `emitData--${notification.threadId}`;
          this.updateNotificationCountEvent.emit(data);
        }
      } else {
        aurl = (notification.actionType == 'dispatch-tech-order') ? forumPageAccess.dispatch : aurl;
        if (!window.dispatchPage || window.dispatchPage.closed) {
          window.dispatchPage=window.open(aurl,'_blank' +aurl);
        } else {
          window.dispatchPage.focus();
        }
      }
      this.closenotification();
    }

    if(notification.displayType == notificationType.thread && notification.subType == notificationSubType.workOrder)
      {
        var aurl = forumPageAccess.workOrderPageView + notification.workOrderId;
        window.open(aurl, '_blank');
        this.closenotification();
      }
    if((notification.displayType == notificationType.thread || notification.displayType == notificationType.reply) &&
        notification.subType != notificationSubType.dispatch &&
        notification.subType != notificationSubType.workOrder) {
      this.commonService.setlocalStorageItem('landingRecentNav', flag);
      localStorage.setItem("notificationOnTap","1");
      localStorage.setItem("notificationTPID",notification.postId);
      let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
      let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
      var aurl = `${view}${notification.threadId}`;
      if(currUrl[1] == 'threads' && currUrl[2] == 'view'){
        if(currUrl[3] == notification.threadId){
          let data = {
            actionType: notification.actionType,
            actionName: notification.actionName,
            postId: notification.postId,
          }
          console.log(data);
          this.commonService.emitPostDataNotification(data);
        }
        else{

        }
      }
      else{
        if(this.newThreadView && (notification.actionType == 'post')){
          this.router.navigate([aurl]);
          let data1 = {
            threadId: notification.threadId,
            actionType: notification.actionType,
            actionName: notification.actionName,
            postId: notification.postId,
            action: 'setPosition'
          }
          console.log(data1);
          setTimeout(() => {
            this.commonService.emitPostDataNotification(data1);
          }, 1000);
        }
        else{
          this.router.navigate([aurl]);
        }
      }
      this.closenotification();
    }

    if (notification.displayType == notificationType.groupChat) {
      localStorage.setItem('chatTab_chatType', notification.chatType);
      localStorage.setItem('chatTab_chatGroupId', notification.chatGroupId);
      localStorage.setItem('chatTab_workstreamId', notification.workstreamId);
      let chatgroupid = (notification.chatType == ChatType.Workstream) ? notification.workstreamId : notification.chatGroupId;
      this.SetChatSessionforRedirect(chatgroupid, notification.chatType);
      var aurl = forumPageAccess.chatpageNew + '';
      if (this.accessFrom == 'chat-page') {
       // window.open(aurl, '_self');
       this.commonService.emitChatNotification('chat-page');
       this.closenotification();
      }
      else {
        window.open(aurl, '_blank');
      }

      //alert(1);
    }

    if (notification.displayType == notificationType.announcement) {
      var aurl = forumPageAccess.announcementPage + notification.threadId;
      window.open(aurl, '_blank');
      //alert(1);
    }
    if (notification.displayType == notificationType.document) {
      this.commonService.setlocalStorageItem('landingRecentNav', flag);
      var aurl = forumPageAccess.documentViewPage + notification.threadId;
      setTimeout(() => {
        this.commonService.emitRightPanelOpenCallData(true);
      }, 100);
      //window.open(aurl, '_blank');
      this.router.navigate([aurl]);
      this.closenotification();
      //alert(1);
    }
    if (notification.displayType == notificationType.follower) {
      var aurl = forumPageAccess.profilePage + notification.userList.userid;
      window.open(aurl, '_blank');
      //alert(1);
    }


    var notificationId = notification.notificationId;
    var threadId = notification.threadId;
    var postId = notification.postId;
    var countReset = notification.countReset;
    var readStatus = notification.readStatus;
    $('.notification-content-view-' + notificationId + '').removeClass('notification-content-bg-color' + countReset + readStatus + '');
    $('.notification-content-view-' + notificationId + '').addClass('notification-content-bg-color11');

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'threadId': threadId,
      'limit': this.itemLimit,
      'offset': this.itemOffset,
      'type': this.notificationtabType,
      'postId': postId,
      'action': 'view',
      'notificationId': notificationId

    }
    this.apiData = apiInfo;
    this.clearuserNotifications();
    //alert(notification.displayType+'--'+notification.readStatus+'--'+notification.countReset);
  }
  closenotification() {
    $('body').removeClass('top-right-notifications-popup');
    if (this.teamSystem) {
      $('body').removeClass('top-right-notifications-popup-ms');
    }
    this.activeModal.dismiss('Cross Click');
    this.updateNotificationCountEvent.emit('reset');
    this.resetuserNotifications('');
  }
  closenotificationNew(event, ndata) {
    if (this.notificationArr.length == 1) {
      $('body').removeClass('top-right-notifications-popup');
      if (this.teamSystem) {
        $('body').removeClass('top-right-notifications-popup-ms');
      }
      this.activeModal.dismiss('Cross Click');
      this.updateNotificationCountEvent.emit('reset');
      // this.resetuserNotifications('');
    }
    if (this.notificationArr.length > 0) {
      var notificationId = ndata.notificationId;
      var threadId = ndata.threadId;
      var postId = ndata.postId;
      $('.notification-content-remove-' + notificationId + '').addClass('left-animation');
      setTimeout(() => {
        $('.notification-content-remove-' + notificationId + '').remove();
        this.notificationArr.splice(event, 1);
      }, 750);

    }




  }




  deleteAlluserNotifications(type = '') {


    this.apiData['offset'] = this.itemOffset;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('type', type);
    apiFormData.append('status', 'clear');
    apiFormData.append('desktop', '1');
    this.LandingpagewidgetsAPI.Dismissallnotifications(apiFormData).subscribe((response) => {
      this.changeNotificationType(0);
      this.closenotification();
    });
  }

  dismissAllnotification(event) {

    this.notificationService.notificationChannel.postMessage({
      clearAll: true,
      apiData: this.apiData
    });
    this.noNotificationsFlag = false;
    this.loadingnotificationscontent = true;
    this.deleteAlluserNotifications('');

    //this.activeModal.dismiss('Cross click');
    this.chatService.totalNewWorkstreamMessage = 0;
    this.chatService.totalNewGroupMessage = 0;
    this.chatService.totalNewDMMessage = 0;
  }
  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }


}
