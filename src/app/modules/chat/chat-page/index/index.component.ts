import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import * as OT from '@opentok/client';
import * as moment from 'moment';

import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
  Router,
} from '@angular/router';
import {
  AttachmentType,
  ChatType,
  Constant,
  LocalStorageItem,
  MediaTypeInfo,
  MessageType,
  MessageUserType,
  SendPushType,
  forumPageAccess,
  pageInfo,
  windowHeight,
} from 'src/app/common/constant/constant';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ReflectiveInjector,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ChatAttachment,
  ChatMessage,
  ChatResponse,
  DomainUserChat,
  FileData,
  ManageTokBoxsession,
  MemberToGroup,
  PostNotification,
  WorkStreamOrGroupChat,
} from 'src/app/models/chatmodel';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import { Subscription, fromEvent, interval } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { ActiveUsersComponent } from '../../active-users/active-users.component';
import { AnnouncementWidgetsComponent } from '../../../../components/common/announcement-widgets/announcement-widgets.component';
import { ApiService } from '../../../../services/api/api.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CallsService } from 'src/app/controller/calls.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatscrollDirective } from 'src/app/common/directive/chatscroll.directive';
import { CommonService } from '../../../../services/common/common.service';
import { DatePipe } from '@angular/common';
import { EscalationWidgetsComponent } from '../../../../components/common/escalation-widgets/escalation-widgets.component';
import { InputChat } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { LandingReportWidgtsComponent } from '../../../../components/common/landing-report-widgts/landing-report-widgts.component';
import { LandingpageService } from '../../../../services/landingpage/landingpage.service';
import { LeaveGroupPopupComponent } from '../leave-group-popup/leave-group-popup.component';
import { MatDialog } from '@angular/material';
import { MyMetricsWidgetsComponent } from '../../../../components/common/my-metrics-widgets/my-metrics-widgets.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Observable } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';
import { RecentSearchesWidgetsComponent } from '../../../../components/common/recent-searches-widgets/recent-searches-widgets.component';
import { RecentViewedWidgetsComponent } from '../../../../components/common/recent-viewed-widgets/recent-viewed-widgets.component';
import { RecordService } from 'src/app/services/common/record.service';
import { Session } from '@opentok/client';
import { Subject } from 'rxjs/internal/Subject';
import { SuccessComponent } from 'src/app/components/common/success/success.component';
import { Title } from '@angular/platform-browser';
import { TotaluserPopupComponent } from 'src/app/modules/shared/totaluser-popup/totaluser-popup.component';
import { UploadService } from 'src/app/services/upload/upload.service';
import { UserDashboardService } from 'src/app/services/user-dashboard/user-dashboard.service';

declare var $: any;
declare var lightGallery: any;
export const TITLE = new InjectionToken<string>('title', {
  providedIn: 'root',
  factory: () => 'title',
});

@Injectable()
class UsefulService {
}

@Injectable()
class NeedsService {
  constructor(public service: UsefulService) {
  }
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
  public dummyComponent = [
    AnnouncementWidgetsComponent,
    EscalationWidgetsComponent,
  ];

  dynamicComponentInjector: Injector;
  public bodyElem;
  public footerElem;
  public title = 'Chat';
  public announcevar = 'announcement-widgets';
  public landingpageWidgets = [];
  /* basic setup */
  public headerFlag: boolean = false;
  public midHeight;
  public headerData: Object;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public enterPressed = false;
  public apiData: Object;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public chatInnerHeight: any = 0;
  public topBandHeight: number = 0;
  public removeHeight: number = 65;
  public MediaTypeInfo = MediaTypeInfo;
  pageAccess: string = 'chat-page';
  public bodyClass: string = 'landing-page';
  public token$: string;
  public sessionId$: string;
  public apiKey$: string;
  public content: string = '';
  messageType: string;
  pagenumber: number = 1;
  pagenumberDomainUsers: number = 1;
  limitDomainUsers: string = '10';
  newMessageCount = 0;
  //public instantPushCount=0;
  public sconfig: PerfectScrollbarConfigInterface = {};

  ///girish code
  isBlankChat: boolean;
  chatBox: boolean = false;
  //chatgroupid:string ='0';
  chatGroupId: string = '0';
  limit: string = '10';
  offset: number = 0;
  offsetDomainUser: number = 0;
  chatType: string;
  lastReply: string = '0';
  //workstreamid:string ;
  groupinfo: any;
  newChatData: any;
  chats: any[];
  wsName: string;
  wsImage: string;
  totalActiveUserCount: string = '0';
  totalUserCount: string = '0';
  totalChatCount: number;
  groupchats: any[];
  loadingChatPage: boolean;
  isShowBlankPage: boolean;
  isBlock = false;
  isLoadOnInit: boolean = true;
  isActiveUser: string;

  chatResponse: ChatResponse[] = [];
  chatResponseSorted: ChatResponse[] = [];
  attachmentGallery: AttachmentGallery[] = [];
  private itemContainer: any;
  private scrollContainer: any;
  private items = [];
  private isNearBottom = true;
  IsLoadingOnChatScroll: boolean;
  activeUserCountOnHeader: string = '5';
  activeUsers: any[];
  allDomainUsers: any[];
  userTotalCount: number;
  isMessageSending: boolean;
  disableScrollDown: boolean;
  IsSendReply: boolean;
  hideDiv: boolean = true;
  public expandFlag: boolean = true;
  isSendButtonEnabled: boolean;
  totalActiveUsePopprCount: number = 0;
  @ViewChild('chatScroll', { static: true }) ChatScroll: ElementRef;
  @ViewChild('sendchatbutton', { static: true }) sendchatbutton: ElementRef;
  @ViewChildren('chatscrollsrow') chatscrollsrowElements: QueryList<any>;
  @ViewChild('UserListScroll', { static: true }) UserListScroll: ElementRef;
  // @ViewChild(ChatscrollDirective   , { static: true }) chatscrollDirective: ChatscrollDirective;
  @ViewChild(ChatscrollDirective) chatscrollDirective = null;
  @ViewChildren('item') itemElements: QueryList<any>;
  toggled: boolean = false;
  viewprofilepage = forumPageAccess.profilePage;
  public sidebarHeight;
  isSendChatButtonEnabled: boolean;
  //currentChatGroupItem:InputChat;
  deleteDMEnable: boolean;
  chatuserTypeSelf = MessageUserType.self;
  chatuserTypeOther = MessageUserType.other;
  messageTypenormalMessage = MessageType.normalMessage;
  messageTypeattachment = MessageType.attachment;
  messageTypeSystem = MessageType.systemMessage;

  mediaTypeInfoImage = MediaTypeInfo.Image;
  mediaTypeInfoVideo = MediaTypeInfo.Video;
  mediaTypeInfoAudio = MediaTypeInfo.Audio;
  mediaTypeInfoPdf = MediaTypeInfo.Pdf;
  mediaTypeInfoDocuments = MediaTypeInfo.Documents;
  mediaTypeInfoLink = MediaTypeInfo.Link;
  replyChat: any = null;
  busyGettingData = false;
  isCallEnabled: boolean = false;

  session: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef: ChangeDetectorRef;
  subscription: Subscription

  publishing;
  @ViewChild('groupUserPopup', { static: true }) groupUserPopup: ElementRef;
  @ViewChild('leaveGroupConfirmation', { static: true })
  leaveGroupConfirmation: LeaveGroupPopupComponent;
  @ViewChild('chatpopup', { static: true }) chatpopup: PopupComponent;
  @ViewChild('totalUserPopup', { static: false })
  totalUserPopup: TotaluserPopupComponent;
  @ViewChild('chatinput', { static: true }) ChatInput: ElementRef;
  @ViewChild('file', { static: false }) fileInput: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout() {
    this.IsLeveGroupenable = false;
    this.deleteDMEnable = false;
  }

  private buttonClicked = new Subject();

  constructor(
    /* basic setup */
    private probingApi: ProductMatrixService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private LandingpagewidgetsAPI: LandingpageService,
    private commonService: CommonService,
    private inj: Injector,
    private chatservice: ChatService,
    private uploadService: UploadService,
    private datePipe: DatePipe,
    public recordService: RecordService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    public call: CallsService,
    private dialog: MatDialog,
    private userDashboardService: UserDashboardService,
    private notification: NotificationService
  ) {
    this.titleService.setTitle(
      localStorage.getItem('platformName') + ' - ' + this.title
    );
    // this.router.routeReuseStrategy.shouldReuseRoute = function (future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) {
    //   if (future.url.toString().indexOf('chat-page') > -1  && curr.url.toString().indexOf('chat-page') > -1) {
    //     return false;
    //   }
    //   return (future.routeConfig === curr.routeConfig);
    // };
    const type = this.route.snapshot.paramMap.get('type') as ChatType;
    const id = this.route.snapshot.paramMap.get('id')
    if (type && id) {
      this.SetChatSessionforRedirect(id, type);
    }
  }

  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
//debugger;
    console.log('chat-session-5'+chatgroupid+'--'+chatType);
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
    if(chatType && chatType!=undefined)
    {
      localStorage.setItem('reloadChatTypeNew',chatType);
    }
    

  }

  createInjector(item) {
    const injector = Injector.create({
      providers: [
        { provide: NeedsService, deps: [UsefulService] },
        { provide: UsefulService, deps: [] },
      ],
    });
    return injector;
  }

  isSendChat: boolean = false;
  scrollTopHeight: number = 450;
  // ChatGroupIdFromQueryParam :string='';
  // ChatTypeIdFromQueryParam :string='';
  CurrentDate: Date;

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {

    const buttonClickedDebounced = this.buttonClicked.pipe(debounceTime(200));

    this.subscription = this.notification.visibility.pipe(debounceTime(500)).subscribe(res => {
      if (res) {
       // console.log('Default chat reload...')
        // this.LoadDefaultChatMessage();
        this.ReloadChatPage('', false)
      }
    })

    buttonClickedDebounced.subscribe(() =>
    //The actual action that should be performed on click
    {
      this.SendChat();
    }
    );
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.ChatGroupIdFromQueryParam =  params.get('id');
    //   this.ChatTypeIdFromQueryParam =  params.get('id1');
    //   console.log('this.ChatGroupIdFromQueryParam');
    //   console.log(this.ChatGroupIdFromQueryParam);
    //   console.log(this.ChatTypeIdFromQueryParam);
    // })

    this.commonService._OnChatNotificationReceivedSubject.subscribe((r) => {

      this.ngOnInit();
     // alert(r);

    });
    this.commonService._OnMessageReceivedSubject.subscribe((r) => {
      console.log(r)
      var setdata = JSON.parse(JSON.stringify(r));
      var checkpushtype = setdata.pushType;
      var checkmessageType = setdata.messageType;
      var pushchatGroupId = setdata.chatGroupId;
      var chatType = setdata.chatType;
      //alert(this.workstreamid);
      if (
        this.chatGroupId == pushchatGroupId && chatType == 1
      ) {
        this.loadChatFromNotification(true, true);
        this.chatscrollDirective.instantPushCount =
          this.chatscrollDirective.instantPushCount + 1;
      }
      if (
        this.chatGroupId == pushchatGroupId &&
        chatType == ChatType.DirectMessage
      ) {
        this.loadChatFromNotification(true, true);
        this.chatscrollDirective.instantPushCount =
          this.chatscrollDirective.instantPushCount + 1;

      }
      if (
        this.chatGroupId == pushchatGroupId &&
        chatType == ChatType.GroupChat
      ) {
        this.loadChatFromNotification(true, true);
        this.chatscrollDirective.instantPushCount =
          this.chatscrollDirective.instantPushCount + 1;
      }
      setTimeout(() => {
        this.commonService.emitOnLeftSideMenuBarSubject('');
      }, 4000);
    });
    this.CurrentDate = new Date();
    this.sidebarHeight = window.innerHeight - 210;
    this.isBlankChat = true;
    this.chatType = ChatType.Workstream;

    lightGallery(document.getElementById('viewGallery'));
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    //this.userId = 2069;//this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      isActive: 1,
      limit: this.itemLimit,
      offset: this.itemOffset,
    };
    let teamSystem = localStorage.getItem('teamSystem');
    if (teamSystem) {
      this.midHeight = windowHeight.heightMsTeam + 200;
    } else {
      this.midHeight = window.innerHeight - 240;
    }

    this.apiData = apiInfo;
    let authFlag =
      (this.domainId == 'undefined' || this.domainId == undefined) &&
        (this.userId == 'undefined' || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
      };
      this.sidebarActiveClass = {
        page: 'home',
        menu: 'Home',
        access: this.pageAccess,
        pageInfo: pageInfo.chatPage,
      };

      this.getlandingpagewidgets();

      if (
        localStorage.getItem(LocalStorageItem.reloadChatGroupId) != null &&
        localStorage.getItem(LocalStorageItem.reloadChatGroupId) != undefined &&
        localStorage.getItem(LocalStorageItem.reloadChatGroupId) != ''
      ) {

        this.chatGroupId = localStorage.getItem(
          LocalStorageItem.reloadChatGroupId
        );

        if(localStorage.getItem('reloadChatTypeNew'))
        {
          this.chatType =localStorage.getItem('reloadChatTypeNew');
        }
        else
        {
          //alert(localStorage.getItem(LocalStorageItem.reloadChatType));
          this.chatType = localStorage.getItem(LocalStorageItem.reloadChatType);
        }

      } else {

        this.chatGroupId = localStorage.getItem('defaultWorkstream');
        this.chatType = ChatType.Workstream;
      }
      this.LoadDefaultChatMessage();
      this.InitializeAndLoadAllDomainUserDataOnScoll();
      setTimeout(() => {
        this.setupChartHeight();
        setTimeout(() => {
          if(this.apiUrl.newupdateRefresh) {
            this.setupChartHeight();
          }
        }, 500);
      }, 1500);
    } else {
      this.router.navigate(['/forbidden']);
    }

    /* basic setup */

    this.midHeight = window.innerHeight - 140;
    //this.InitializeAndLoadChatDataOnScoll();
    this.isVontageEnabled();
  }

  setupChartHeight() {
    let topBandHeight = (document.getElementsByClassName("notification-warning-header")[0]) ? document.getElementsByClassName("notification-warning-header")[0].clientHeight : 0;
    let chatInnerHeight = this.removeHeight+topBandHeight+4;
    this.chatInnerHeight = chatInnerHeight - 0;
  }

  isVontageEnabled() {
    this.userDashboardService.getUserProfile({ api_key: Constant.ApiKey, user_id: this.userId }).subscribe(response => {
      this.isCallEnabled = response.isVonageEnabled;
    });
  }

  listActiveUsers() {
    if (this.wsName) {
      localStorage.setItem('groupName', this.wsName);
    }
    this.dialog.open(ActiveUsersComponent, {
      width: '600px',
      height: '700px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'overflow-hidden',
      data: { wsName: localStorage.getItem('groupName') ? localStorage.getItem('groupName') : '' }
    });
  }

  getlandingpagewidgets() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);

    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe(
      (response) => {
        let rstatus = response.status;
        let rtotal = response.total;
        if (rstatus == 'Success') {
          if (rtotal > 0) {
            let rlandingPage = response.landingPage;

            for (let wi in rlandingPage) {
              var rcomponentName = rlandingPage[wi].componentName;
              var rplaceholder = rlandingPage[wi].placeholder;
              var rwid = rlandingPage[wi].id;

              localStorage.setItem(
                'landingpage_attr' + rwid + '',
                JSON.stringify(rlandingPage[wi])
              );
              //localStorage.removeItem('landingpage_attr'+rwid+'');
              //localStorage.removeItem('landingpage_attr');
              if (rwid == 1) {
                this.landingpageWidgets.push({
                  componentName: AnnouncementWidgetsComponent,
                  placeholder: rplaceholder,
                });
              }
              if (rwid == 2) {
                this.landingpageWidgets.push({
                  componentName: EscalationWidgetsComponent,
                  placeholder: rplaceholder,
                });
              }
              if (rwid == 3) {
                this.landingpageWidgets.push({
                  componentName: RecentViewedWidgetsComponent,
                  placeholder: rplaceholder,
                });
              }
              if (rwid == 4) {
                this.landingpageWidgets.push({
                  componentName: RecentSearchesWidgetsComponent,
                  placeholder: rplaceholder,
                });
              }
              if (rwid == 5) {
                this.landingpageWidgets.push({
                  componentName: MyMetricsWidgetsComponent,
                  placeholder: rplaceholder,
                });
              }
              if (rwid == 6) {
                this.landingpageWidgets.push({
                  componentName: LandingReportWidgtsComponent,
                  placeholder: rplaceholder,
                });
              }
            }
          }
        }
      }
    );
  }

  applySearch(action, val) {
  }

  //#region  Save Chat Message
  async SendChat() {
    this.invalidFile = false;
    let messageUploaded: number = 0;
    if (
      (this.attachmentTouploadList == null ||
        this.attachmentTouploadList.length == 0) &&
      (this.recordService.soundstream == null ||
        this.recordService.soundstream == undefined) &&
      (this.content == undefined || this.content == null || this.content == '')
    ) {
      return;
    }
    this.IsLoadingOnChatScroll = true;
    this.isMessageSending = true;

    if (this.attachmentTouploadList && this.attachmentTouploadList.length > 0) {
      this.mentionContent = '';
      this.mentionUserList = [];
      messageUploaded = this.attachmentTouploadList.length;
      await this.attachmentUpload();
      // this.SaveAttachment();
    }

    if (this.recordService.soundstream) {
      messageUploaded = messageUploaded + 1;
      await this.SaveVoiceMessage();
    }

    if (this.content != undefined && this.content != null && this.content != '') {
      messageUploaded = messageUploaded + 1;
      await this.SaveChatMessage();
    }

    this.loadMoreChat(false, '', messageUploaded.toString());
  }

  async SaveChatMessage() {
    this.invalidFile = false;
    let alldomainusers: ChatMessage = this.prepareChatMessage();

    const index = this.chatservice.dmstreamArr.findIndex((item) => item.Id == alldomainusers.chatGroupId)
    this.chatservice.moveArrayItemToNewIndex(this.chatservice.dmstreamArr, index, 0);

    this.chatservice.channel.postMessage({
      reloadChat: true,
      groupId: alldomainusers.chatGroupId
    })

    this.chatservice.SaveChatMessage(alldomainusers).subscribe(resp => {
      this.isShowBlankPage = false;
      this.content = '';

      this.isMessageSending = false;
      this.PostNotification(resp.dataId, SendPushType.NormalMessage);
      this.mentionContent = '';
      this.mentionUserList = [];
      if (this.replyChat) {
        this.replyChat = null;
      }
      //this.ResetPaging();
      //this.loadMoreChat(false,resp.dataId,"1");
    });
  }

  startVoiceRecord() {
    this.recordService.toggleRecord();
  }

  async SaveVoiceMessage() {
    let chatAttachment: ChatAttachment = new ChatAttachment();
    chatAttachment.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      chatAttachment.chatGroupId = this.chatGroupId;
      chatAttachment.workStreamId = '0';
    } else {
      chatAttachment.workStreamId = (this.chatGroupId) ? this.chatGroupId.toString() : '1';
      this.chatGroupId;
      chatAttachment.chatGroupId = '0';
    }
    chatAttachment.domainId = this.domainId;
    chatAttachment.countryId = this.countryId;
    chatAttachment.caption = '';
    chatAttachment.chatType = this.chatType;
    chatAttachment.file = this.recordService.soundstream;
    chatAttachment.type = this.recordService.soundstream.type;
    chatAttachment.userId = this.userId;
    if (this.replyChat != null && this.replyChat != undefined) {
      chatAttachment.sendpush = '8';
      chatAttachment.messageId = this.replyChat.id;
      chatAttachment.messageType = '6';
    }
    this.attachmentTouploadList = [];
    let filedata = new FileData();
    filedata.file = this.recordService.soundstream;
    filedata.filesize = this.recordService.soundstream.size;
    filedata.fileType = this.recordService.soundstream.type;
    filedata.attachmentType = AttachmentType.voice;
    this.attachmentTouploadList.push(filedata);
    await this.attachVoice(chatAttachment);

  }

  RemoveAudio() {
    this.recordService.ResetRTC();
  }

  async attachVoice(chatAttachment) {
    await this.uploadFile(0, chatAttachment, this.recordService.soundstream);
  }

  // uploadSound( fileInfo:ChatAttachment, attachment:File) {
  //   console.log(fileInfo)
  //   console.log(attachment)
  // //  let i = parseInt(index)+1;
  //   // let uploadLen = this.attachmentTouploadList.length;
  //   let totalTemp = 0;
  //   //this.totalSizeToUpload -= attachment.size;
  //   return new Promise<void>((resolve, reject) => {
  //     this.uploadFlag = this.uploadService.uploadChatAttachment( fileInfo, attachment).subscribe((event: HttpEvent<any>) => {
  //       //console.log(event);
  //       switch (event.type) {
  //         case HttpEventType.Sent:
  //           console.log('Request has been made!');
  //           break;
  //         case HttpEventType.ResponseHeader:
  //           console.log('Response header has been received!');
  //           break;
  //         case HttpEventType.UploadProgress:
  //           /*this.loadedSoFar = totalTemp + event.loaded;
  //           this.percentDone = Math.round(100 * this.loadedSoFar / this.totalSizeToUpload);
  //           console.log(index+'::'+this.percentDone)
  //           this.attachments[index]['progress'] = this.percentDone;
  //           console.log(`Uploaded! ${this.percentDone}%`);*/

  //           let progress = Math.round(100 * event.loaded / event.total);
  //          // this.attachmentTouploadList[index].progress = progress;
  //         //  console.log(`Uploaded! ${ this.attachmentTouploadList[index].progress}%`);
  //           break;
  //         case HttpEventType.Response:
  //           // totalTemp = this.loadedSoFar;
  //           // this.percentDone = 100;
  //           // this.attachmentTouploadList[index].progress = 100;
  //           // this.attachmentTouploadList[index].uploadStatus= 1;
  //          // console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
  //           //console.log(i+'::'+uploadLen)
  //           console.log(event)
  //           let dataid = event.body.data.dataId;
  //           this.PostNotification(dataid,SendPushType.NormalMessage);
  //           // if(i == uploadLen) {
  //           //   this.attachmentTouploadList = [];

  //           //   let fileTxt = 'File';
  //           //   fileTxt = (uploadLen > 1) ? `${fileTxt}s` : fileTxt;
  //           //   let msg = `${fileTxt} successfully uploaded!`;
  //           //   // this.successMsg = msg;
  //           //    this.attachmentProgress = false;
  //           //   // this.uploadedFiles = [];
  //           //   // this.attachments = [];
  //           //   // const msgModalRef = this.modalService.open(SuccessModalComponent, this.config);
  //           //   // msgModalRef.componentInstance.successMessage = this.successMsg;
  //           //   // setTimeout(() => {
  //           //   //   msgModalRef.dismiss('Cross click');
  //           //   //   this.applySearch('init', this.searchVal);
  //           //   // }, 5000);
  //           //   console.log(msg, event.body);
  //           // } else {
  //           //   resolve();
  //           // }

  //           resolve();
  //           break;
  //       }
  //     },
  //     err => {
  //     //  this.progress = 0;
  //     });
  //   })
  // }

  ScrollToBottom() {
    this.chatscrollDirective.isFirstTime = true;
    setTimeout(() => this.chatscrollDirective.restore(), 0); // method to restore the scroll position
  }

  SaveAttachment() {
    this.attachmentUpload();
  }

  uploadFlag: any;
  mediaList: UploadMedia[] = [];

  // Upload File
  uploadFile(index, fileInfo: ChatAttachment, attachment: File) {
    let i = parseInt(index) + 1;
    let uploadLen = this.attachmentTouploadList.length;
    //this.totalSizeToUpload -= attachment.size;
    return new Promise<void>((resolve, reject) => {
      this.uploadFlag = this.uploadService.uploadChatAttachment(fileInfo, attachment).subscribe((event: HttpEvent<any>) => {
        //console.log(event);
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            if (this.attachmentTouploadList && this.attachmentTouploadList[index] && (this.attachmentTouploadList[index].attachmentType != AttachmentType.voice)) {
              let progress = Math.round(100 * event.loaded / event.total);
              this.attachmentTouploadList[index].progress = progress;
              console.log(`Uploaded! ${this.attachmentTouploadList[index].progress}%`);
            }
            break;
          case HttpEventType.Response:
            this.isShowBlankPage = false;
            if (this.attachmentTouploadList && this.attachmentTouploadList[index] && (this.attachmentTouploadList[index].attachmentType != AttachmentType.voice)) {
              this.attachmentTouploadList[index].progress = 100;
              this.attachmentTouploadList[index].uploadStatus = 1;
              this.recordService.soundstream = null;
              console.log(i + '::' + uploadLen);
              console.log(event);
            }
            let dataid = event.body.data.dataId;
            if (this.attachmentTouploadList[index].attachmentType == AttachmentType.video
              || this.attachmentTouploadList[index].attachmentType == AttachmentType.voice) {
              this.mediaList.push({ id: dataid, jobid: event.body.data.jobId, jobstatus: false });
            }
            this.PostNotification(dataid, SendPushType.NormalMessage);
            if (i == uploadLen) {
              // this.loadMoreChat(false,"",uploadLen.toString());
              this.attachmentTouploadList = [];
              this.recordService.soundstream = null;
              let fileTxt = 'File';
              fileTxt = (uploadLen > 1) ? `${fileTxt}s` : fileTxt;
              let msg = `${fileTxt} successfully uploaded!`;
              this.attachmentProgress = false;
              this.isMessageSending = false;
              console.log(msg, event.body);
            }
            //  else {
            //   resolve();
            // }
            resolve();
            break;
        }
      },
        err => {
          //  this.progress = 0;
        });
    });
  }

  attachmentProgress: boolean;

  async attachmentUpload() {

    for (let item in this.attachmentTouploadList) {
      let chatAttachment: ChatAttachment = new ChatAttachment();
      chatAttachment.apiKey = Constant.ApiKey;
      if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
        chatAttachment.chatGroupId = this.chatGroupId;
        chatAttachment.workStreamId = '0';
      } else {
        chatAttachment.workStreamId = (this.chatGroupId) ? this.chatGroupId.toString() : '1';
        this.chatGroupId;
        chatAttachment.chatGroupId = '0';
      }
      chatAttachment.domainId = this.domainId;
      chatAttachment.countryId = this.countryId;
      chatAttachment.caption = (this.attachmentTouploadList[item].fileCaption == '') ? this.attachmentTouploadList[item].fileName : this.attachmentTouploadList[item].fileCaption;
      chatAttachment.chatType = this.chatType;
      chatAttachment.file = this.attachmentTouploadList[item].file;
      chatAttachment.type = this.attachmentTouploadList[item].fileType;
      chatAttachment.userId = this.userId;
      if (this.replyChat != null && this.replyChat != undefined) {
        chatAttachment.sendpush = '8';
        chatAttachment.messageId = this.replyChat.id;
        chatAttachment.messageType = '6';
      }
      console.log(this.attachmentTouploadList[item]);
      this.attachmentProgress = true;
      //if(!this.attachments[u].cancelFlag) {
      await this.uploadFile(item, chatAttachment, chatAttachment.file);

      //}
    }
  }

  AttachmentEditClick(item) {
    this.attachmentTouploadList.find(x => x == item).attachmentEditStatus = true;
  }

  upload(event) {
    console.log('event');
    let attachmentLocalUrl: any;
    if (this.validateFile(event)) {


      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        let filedata = new FileData();
        filedata.file = element;
        filedata.fileName = element.name;
        filedata.filesize = element.size;
        filedata.fileType = element.type;
        filedata.attachmentType = this.getAttachmentType(element.type);
        let lastDot = element.name.lastIndexOf('.');
        let fileName = element.name.substring(0, lastDot);
        filedata.fileCaption = element.name;
        var reader = new FileReader();
        //this.imagePath = files;
        reader.readAsDataURL(element);
        reader.onload = (_event) => {
          //  attachmentLocalUrl = reader.result;
          filedata.localurl = _event.target.result;
          this.attachmentTouploadList.push(filedata);
          console.log(this.attachmentTouploadList);
        };

      }
    }
    this.fileInput.nativeElement.value = '';
  }

  uploadfromCopyPaste(evt) {
    console.log('event');
    let attachmentLocalUrl: any;

    const element = evt;
    let filedata = new FileData();
    filedata.file = element;
    filedata.fileName = element.name;
    filedata.filesize = element.size;
    filedata.fileType = element.type;
    filedata.attachmentType = this.getAttachmentType(element.type);
    let lastDot = element.name.lastIndexOf('.');
    let fileName = element.name.substring(0, lastDot);
    filedata.fileCaption = fileName;
    var reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(element);
    reader.onload = (_event) => {
      //  attachmentLocalUrl = reader.result;
      filedata.localurl = _event.target.result;
      this.attachmentTouploadList.push(filedata);
      console.log(this.attachmentTouploadList);
    };


  }

  PostNotification(dataid: string, SendPushType: SendPushType) {

    let notification: PostNotification = this.preparePushNotification(dataid, SendPushType);
    if (this.replyChat != null && this.replyChat != undefined) {
      notification.sendpush = '8';
      notification.replyUserId = this.replyChat.userId;
    }

    this.chatservice.AddPostNotification(notification).subscribe((resp) => {
      console.log('Post Notification  Response');
      console.log(resp);
    });
  }

  preparePushNotification(dataid: string, SendPushType: SendPushType) {
    let postNotification: PostNotification = new PostNotification();
    postNotification.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      postNotification.chatGroupId = this.chatGroupId;
    } else {
      postNotification.chatGroupId = '0';
    }
    postNotification.domainId = this.domainId;
    postNotification.countryId = this.countryId;
    postNotification.userId = this.userId;
    postNotification.chatType = this.chatType;
    postNotification.dataId = dataid;
    postNotification.limit = '10';
    postNotification.offset = '0';
    postNotification.notifyUsers = '';
    postNotification.param = 'groupmessage';

    // if (this.mentionUserList.length > 0 )
    // {

    //   for (let i = 0 ; i <this.mentionUserList.length ; i++)
    //   {
    //       if (this.content.indexOf("@" + this.mentionUserList[i].userName) == -1)
    //       {
    //         this.mentionUserList[i].userId = "0";
    //       }
    //   }
    //   this.mentionUserList = this.mentionUserList.filter(x=>x.userId!= "0");

    //   if (this.mentionUserList.length > 0 )
    //   {ngFor
    //   let content = this.content;
    //   for (let i = 0 ; i <this.mentionUserList.length ; i++)
    //   {
    //     let indexforat = this.findNthOccur(this.content,'@', i + 1) ;
    //     let indexforless = this.findNthOccur(this.content,'<', (i + 1)*2) ;
    //     let username = this.content.substring(indexforat  , indexforless );
    //     content = content.replace(username, "<<USERID:" + this.mentionUserList[i].userId + ">>");
    //     content =content.replace("<span ","");
    //     content =content.replace("class=\"TagContent\">","");
    //     content =content.replace("</span>","");
    //   }
    //   content =content.replace("class='TagContent'>","");
    //   this.mentionContent =  content;
    // }
    // postNotification.mentionContent = this.mentionContent;
    // }

    // if (this.mentionUserList.length > 0 )
    // {
    //   let startIndex =  this.content.indexOf("@") ;
    //     let endIndex = this.content.lastIndexOf("<") ;
    //     let username = this.content.substring(startIndex  , endIndex );
    //     let content = this.content.replace(username, "<<USERID:" + this.mentionUserIdSelected + ">>");
    //     content =content.replace("<span class=\"TagContent\">","");
    //     content =content.replace("</span>","");
    //   this.mentionContent = content;
    //   postNotification.mentionContent = this.mentionContent;
    // }
    postNotification.mentionContent = this.mentionContent;
    postNotification.mentionUserList = this.mentionUserList;
    postNotification.sendpush = SendPushType;
    return postNotification;
  }

  //#endregion

  //#region  Load Chat Message on Page Load

  //#region Load Chat Message on Page Load
  LoadDefaultChatMessage() {

    this.isBlock = true;
    this.attachmentTouploadList = [];
    this.recordService.ResetRTC();
    this.replyChat = null;
    this.ResetPaging();
    this.GetworkstreamOrGroupChat(true);
    this.GetActiveUserHeader();
    this.GetAllDomainUser();
    //this.left.ReloadGrouAndDMChatMenu(chatGroupId,chatType);
  }

  //#endregion
  //currentItemImage:string ="";
  //#region  Load Chat Message on Emited from Left menu
  ReloadChatPage(item: InputChat | any = '', init: boolean = true) {
    //this.currentChatGroupItem =item;
    // this.currentItemImage =  item.profileImg;
    if (item) {
      console.log(item);
      this.newChatData = item;
      this.chatType = item.chatType;
      this.chatGroupId = item.id;
      this.wsName = item.name;

      this.chatservice.channel.postMessage({
        reloadChat: true,
        chatData: item
      })

    }

    this.invalidFile = false;
    this.pagenumber = 1;
    this.offset = 0;
    // this.totalActiveUserCount = '0';
    // this.totalUserCount = '0';
    this.limit = '10';
    // this.activeUsers = [];

    this.attachmentTouploadList = [];
    this.recordService.ResetRTC();
    this.replyChat = null;
    this.chatResponse = [];
    if (init) {
      this.chatResponseSorted = [];
    }
    this.ResetPaging();
    this.SetChatSessionforRedirect(this.chatGroupId, item.chatType);
    this.GetworkstreamOrGroupChat(init);
    this.GetActiveUserHeader();
    this.GetAllDomainUser();
    setTimeout(()=> {
      this.notification.getUserAppNotifications();
  }, 1000);
  }

  //#endregion

  disableScollUp: boolean = false;


  //#region  Load Chat Message on Scroll
  loadMoreChat(isOnScroll: boolean, chatGroupId: string, limit) {
    console.log('loadMoreChat');
    this.IsLoadingOnChatScroll = true;
    if (isOnScroll) {
      // this.offset = this.pagenumber * (Number(this.limit));
      this.offset = this.offset + (Number(this.limit));
      this.limit = limit;
    } else {
      this.offset = 0;
      this.limit = limit;
    }
    //this.pagenumber = this.pagenumber + 1;
    let domainusers: WorkStreamOrGroupChat = this.prepareAllChatList();
    this.chatservice.getworkstreamOrGroupChat(domainusers).subscribe(resp => {
      if (resp.status == 'Success') {


        setTimeout(() => {

          this.busyGettingData = false;
        }, 500);

        // this.userlist = [...this.userlist, ...resp.dataInfo];
        if (isOnScroll) {
          // if (!this.groupchats.some(x=>x.offset == resp.data.groupChat.offset))
          // {
          this.groupchats = [...resp.data.groupChat, ...this.groupchats];

          let translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
          let translatelangId = translatelangArray['id'] == undefined ? '' : translatelangArray['id'];
          if(this.groupchats.length>0){
            for (let i in this.groupchats ){
              if(translatelangId == ''){
                this.groupchats[i].transText = "Translate";
              }
              else{
                this.groupchats[i].transText = "Translate to "+translatelangArray['name'];
              }
            }
          }
          //}
          if (resp.data.total == '0') {
            this.disableScollUp = true;
          } else {
            this.disableScollUp = false;
          }

        } else {
          // if (!this.groupchats.some(x=>x.Offset == resp.data.groupChat.Offset))
          // {
          this.groupchats = [...this.groupchats, ...resp.data.groupChat];

          let translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
          let translatelangId = translatelangArray['id'] == undefined ? '' : translatelangArray['id'];
          if(this.groupchats.length>0){
            for (let i in this.groupchats ){
              if(translatelangId == ''){
                this.groupchats[i].transText = "Translate";
              }
              else{
                this.groupchats[i].transText = "Translate to "+translatelangArray['name'];
              }
            }
          }
          // }
        }

        //this.groupchats = resp.data.groupChat;
        this.chatResponse = [];
        this.chatResponseSorted = [];
        let chats = this.groupchats;
        console.log('chats');
        console.log(chats);
        //let prevDate : any = this.datePipe.transform(new Date(chats[0].createdOnMobile ),"yyyy-MM-dd");
        let firstElement: ChatResponse = new ChatResponse();
        firstElement.displayDate = new Date(chats[0].createdOnMobile);
        console.log('DisplayDate: 2');
        // firstElement.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[0].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
        let createdOnDate = moment.utc(chats[0].createdOnMobile).toDate();
        //firstElement.DisplayDateyyMMdd = moment(createdOnDate).local().format('yyyy-MM-dd');
        firstElement.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[0].createdOnMobile + ' UTC'), 'yyyy-MM-dd');

        firstElement.chatmessage = [];
        chats[0].contentOriginal = chats[0].content;
        chats[0].captionOriginal = chats[0].fileCaption;

        firstElement.chatmessage.push(chats[0]);

        this.chatResponse[0] = firstElement;

        for (let i = 1; i < chats.length; i++) {

          var cMobileDate = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');

          if (this.chatResponse.some(x => x.DisplayDateyyMMdd == cMobileDate))
            //if (prevDate == this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd"))
          {
            //this.chatResponse[this.chatResponse.length -1].chatmessage.push(chats[i]) ;
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            this.chatResponse.find(x => x.DisplayDateyyMMdd == cMobileDate).chatmessage.push(chats[i]);
          } else {
            //let disDate = new Date(chats[i].createdOnMobile);
            let chatResponse: ChatResponse = new ChatResponse();
            chatResponse.displayDate = new Date(chats[i].createdOnMobile);
            console.log('DisplayDate: 4');
            chatResponse.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
            chatResponse.chatmessage = [];
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            chatResponse.chatmessage.push(chats[i]);
            // if (prevDate != this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd"))
            // {
            this.chatResponse.push(chatResponse);

          }
          // prevDate  = this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd");
        }

        this.chatResponseSorted = this.chatResponse.sort((x, y) => +new Date(x.displayDate + ' UTC') - +new Date(y.displayDate + ' UTC'));



        ///image galary
        for (let i = 1; i < chats.length; i++) {
          if (chats[i].filePath != '' || chats[i].linkUrl != '' || chats[i].posterImage != '') {
            let attachment = new AttachmentGallery();
            attachment.id = chats[i].id;
            if (chats[i].filePath.indexOf('image') !== -1) {
              attachment.attachmentName = chats[i].fileCaption;
              attachment.attachmentUrl = chats[i].filePath;
              attachment.attachmentThumbnailUrl = chats[i].thumbFilePath;
              attachment.attachmentType = MediaTypeInfo.Image;
            }
            if (chats[i].filePath.indexOf('video') !== -1) {
              attachment.attachmentName = chats[i].fileCaption;
              attachment.attachmentUrl = chats[i].filePath;
              attachment.attachmentThumbnailUrl = chats[i].posterImage;
              attachment.posterImageUrl = chats[i].posterImage;
              attachment.attachmentType = MediaTypeInfo.Video;
              attachment.type = chats[i].fileType;
            }
            if (chats[i].filePath.indexOf('audio') !== -1) {
              attachment.attachmentName = chats[i].fileName;
              attachment.attachmentUrl = '/assets/images/media/audio-thumb.png';
              attachment.attachmentThumbnailUrl = '/assets/images/media/audio-thumb.png';
              attachment.attachmentType = MediaTypeInfo.Audio;

            }
            // if( chats[i].linkUrl !== "")
            // {
            //   attachment.attachmentName = chats[i].content;
            //   attachment.attachmentUrl = chats[i].linkUrl;
            //   attachment.attachmentThumbnailUrl =   chats[i].thumbFilePath;
            //   attachment.attachmentType =  MediaTypeInfo.Link;
            //   //attachment.posterImageUrl = chats[i].posterImage;
            // }
            // if( chats[i].filePath.indexOf('image') !== -1 ||chats[i].filePath.indexOf('video') !== -1||  chats[i].linkUrl !== "" || chats[i].filePath.indexOf('audio') !== -1){
            if (chats[i].filePath.indexOf('image') !== -1 || chats[i].filePath.indexOf('video') !== -1 || chats[i].filePath.indexOf('audio') !== -1) {
            console.log('--attach-1');
              if (this.attachmentGallery.some(x => x.id == attachment.id) == false) {
                this.attachmentGallery.push(attachment);
              }
            }

          }

        }
        if (isOnScroll) {
          this.chatscrollDirective.isFirstTime = false;
        } else {
          this.chatscrollDirective.isFirstTime = true;
        }

        this.showGallery('');

        this.IsLoadingOnChatScroll = false;
        console.log('this.chatResponse from scroll');
        this.chatscrollDirective.prepareFor('up');
        setTimeout(() => this.chatscrollDirective.restore(), 0); // method to restore the scroll position
        console.log(this.chatResponse);

      }
    });
  }

  //#endregion

  //#region Common Code
  loadChatFromNotification(isOnScroll: boolean, pushValue = false) {
    console.log('loadMoreChat');
    this.IsLoadingOnChatScroll = true;
    this.offset = 0;
    this.limit = '10';
    if (pushValue) {
      this.limit = '5';
    }


    let domainusers: WorkStreamOrGroupChat = this.prepareAllChatList();
    this.chatservice.getworkstreamOrGroupChat(domainusers).subscribe(resp => {
      if (resp.status == 'Success') {
        this.chatscrollDirective.prepareFor('up');
        // this.userlist = [...this.userlist, ...resp.dataInfo];

        let responsedata: any[] = resp.data.groupChat;
        if(responsedata && responsedata.length>0)
        {
        for (let i = 0; i < responsedata.length; i++) {
          if (this.groupchats.some(x => x.id == responsedata[i].id) == false) {
            this.groupchats = [...this.groupchats, ...[responsedata[i]]];
          }
        }

        let translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
        let translatelangId = translatelangArray['id'] == undefined ? '' : translatelangArray['id'];
        if(this.groupchats.length>0){
          for (let i in this.groupchats ){
            if(translatelangId == ''){
              this.groupchats[i].transText = "Translate";
            }
            else{
              this.groupchats[i].transText = "Translate to "+translatelangArray['name'];
            }
          }
        }

        //this.groupchats = resp.data.groupChat;
        this.chatResponse = [];
        this.chatResponseSorted = [];
        let chats = this.groupchats;
        console.log('chats');
        console.log(chats);
        // let prevDate : any = this.datePipe.transform(new Date(chats[0].createdOnMobile),"yyyy-MM-dd");

        let firstElement: ChatResponse = new ChatResponse();

        firstElement.displayDate = new Date(chats[0].createdOnMobile);
        console.log('DisplayDate: 4');
        // firstElement.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[0].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
        let createdOnDate = moment.utc(chats[0].createdOnMobile).toDate();
        firstElement.DisplayDateyyMMdd = moment(createdOnDate).local().format('yyyy-MM-dd');
        firstElement.chatmessage = [];
        chats[0].contentOriginal = chats[0].content;
        chats[0].captionOriginal = chats[0].fileCaption;

        firstElement.chatmessage.push(chats[0]);
        this.chatResponse[0] = firstElement;

        for (let i = 1; i < chats.length; i++) {
          if (chats[i].filePath != '' || chats[i].linkUrl != '' || chats[i].posterImage != '') {
            let attachment = new AttachmentGallery();
            attachment.id = chats[i].id;
            if (chats[i].filePath.indexOf('image') !== -1) {
              attachment.attachmentName = chats[i].fileCaption;
              attachment.attachmentUrl = chats[i].filePath;
              attachment.attachmentThumbnailUrl = chats[i].thumbFilePath;
              attachment.attachmentType = MediaTypeInfo.Image;
            }
            if (chats[i].filePath.indexOf('video') !== -1) {
              attachment.attachmentName = chats[i].fileCaption;
              attachment.attachmentUrl = chats[i].filePath;
              attachment.attachmentThumbnailUrl = chats[i].posterImage;
              attachment.posterImageUrl = chats[i].posterImage;
              attachment.attachmentType = MediaTypeInfo.Video;
              attachment.type = chats[i].fileType;
            }
            if (chats[i].filePath.indexOf('audio') !== -1) {
              attachment.attachmentName = chats[i].fileName;
              attachment.attachmentUrl = '/assets/images/media/audio-thumb.png';
              attachment.attachmentThumbnailUrl = '/assets/images/media/audio-thumb.png';
              attachment.attachmentType = MediaTypeInfo.Audio;

            }
            // if( chats[i].linkUrl !== "")
            // {
            //   attachment.attachmentName = chats[i].content;
            //   attachment.attachmentUrl = chats[i].linkUrl;
            //   attachment.attachmentThumbnailUrl =   chats[i].thumbFilePath;
            //   attachment.attachmentType =  MediaTypeInfo.Link;
            //   //attachment.posterImageUrl = chats[i].posterImage;
            // }
            //if( chats[i].filePath.indexOf('image') !== -1 ||chats[i].filePath.indexOf('video') !== -1||  chats[i].linkUrl !== "" || chats[i].filePath.indexOf('audio') !== -1){
            if (chats[i].filePath.indexOf('image') !== -1 || chats[i].filePath.indexOf('video') !== -1 || chats[i].filePath.indexOf('audio') !== -1) {
              console.log('--attach-2');
              if (this.attachmentGallery.some(x => x.id == attachment.id) == false) {

                this.attachmentGallery.push(attachment);
              }

            }
            console.log('this.attachmentGallery');
            console.log(this.attachmentGallery);
          }
          //if (prevDate == this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd"))
          //var cMobileDate = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
          let createdOnDate = moment.utc(chats[i].createdOnMobile).toDate();
          var cMobileDate = moment(createdOnDate).local().format('yyyy-MM-dd');
          if (this.chatResponse.some(x => x.DisplayDateyyMMdd == cMobileDate)) {
            // this.chatResponse[this.chatResponse.length -1].chatmessage.push(chats[i]) ;
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            this.chatResponse.find(x => x.DisplayDateyyMMdd == cMobileDate).chatmessage.push(chats[i]);
          } else {
            //let disDate = new Date(chats[i].createdOnMobile);
            let chatResponse: ChatResponse = new ChatResponse();
            chatResponse.displayDate = new Date(chats[i].createdOnMobile);
            console.log('DisplayDate: 5');
            //chatResponse.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
            let createdOnDate = moment.utc(chats[i].createdOnMobile).toDate();
            chatResponse.DisplayDateyyMMdd = moment(createdOnDate).local().format('yyyy-MM-dd');
            chatResponse.chatmessage = [];
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            chatResponse.chatmessage.push(chats[i]);
            this.chatResponse.push(chatResponse);
          }
          // prevDate  = this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd");
        }
        this.chatResponseSorted = this.chatResponse.sort((x, y) => +new Date(x.displayDate + ' UTC') - +new Date(y.displayDate + ' UTC'));
        if (isOnScroll) {
          this.chatscrollDirective.isFirstTime = false;
        } else {
          this.chatscrollDirective.isFirstTime = true;
        }

        this.showGallery('');
        setTimeout(() => this.chatscrollDirective.restore(), 500); // method to restore the scroll position

        this.IsLoadingOnChatScroll = false;
        console.log('this.chatResponse from scroll');
        console.log(this.chatResponse);
      }
      }

    });
  }

  GetworkstreamOrGroupChat(isInit: boolean) {

    let domainusers: WorkStreamOrGroupChat = this.prepareAllChatList();
    //this.IsLoadingOnChatScroll = true ;
    if (isInit == true) {
      this.isLoadOnInit = true;
    }

    this.chatservice.getworkstreamOrGroupChat(domainusers).subscribe(resp => {
     // console.log('resp');
     // console.log(resp);
      //this.chatscrollDirective.reset();
      this.groupinfo = resp.data.groupInfo;
      let offsetfromsource = resp.offset;

      this.groupchats = resp.data.groupChat;
      this.totalChatCount = resp.data.total;
      this.wsName = this.groupinfo?.name;

      this.wsImage = this.groupinfo?.groupChatIcon;
      if (this.groupchats && this.groupchats.length > 0) {
        this.isShowBlankPage = false;

        let translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
        let translatelangId = translatelangArray['id'] == undefined ? '' : translatelangArray['id'];
        for (let i in this.groupchats ){
          if(translatelangId == ''){
            this.groupchats[i].transText = "Translate";
          }
          else{
            this.groupchats[i].transText = "Translate to "+translatelangArray['name'];
          }
        }


      } else {
        this.isShowBlankPage = true;
      }
      if (resp.data.total == '0') {
        this.disableScollUp = true;
      } else {
        this.disableScollUp = false;
      }
      this.chatResponse = [];
      this.attachmentGallery = [];
      let chats = this.groupchats;

      //this.IsLoadingOnChatScroll = false ;
      // console.log('chats');
      console.log("kkkk"+chats);
      if (chats != null && chats.length > 0 && chats[0].createdOnMobile != null && chats[0].createdOnMobile != undefined) {
        //let prevDate : any = this.datePipe.transform(new Date(chats[0].createdOnMobile),"yyyy-MM-dd");
        console.log(chats[0].createdOnMobile);
        let firstElement: ChatResponse = new ChatResponse();
        firstElement.displayDate = new Date(chats[0].createdOnMobile);
        console.log('DisplayDate: 6');
        firstElement.chatmessage = [];
        // firstElement.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[0].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
        let createdOnDate = moment.utc(chats[0].createdOnMobile).toDate();
       // firstElement.DisplayDateyyMMdd = moment(createdOnDate).local().format('yyyy-MM-dd');
        firstElement.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[0].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
        chats[0].contentOriginal = chats[0].content;
        chats[0].captionOriginal = chats[0].fileCaption;

        firstElement.chatmessage.push(chats[0]);
        this.chatResponse[0] = firstElement;

        for (let i = 1; i < chats.length; i++) {

          var cMobileDate = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
          console.log(cMobileDate+'--'+firstElement.DisplayDateyyMMdd);
          if (this.chatResponse.some(x => x.DisplayDateyyMMdd == cMobileDate))
            //if (prevDate == this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd"))
          {
            //this.chatResponse[this.chatResponse.length -1].chatmessage.push(chats[i]) ;
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            if (chats[i].filePath != '' || chats[i].linkUrl != '' || chats[i].posterImage != '') {
              let attachment = new AttachmentGallery();
              attachment.id = chats[i].id;

              if (chats[i].filePath.indexOf('image') !== -1) {
                attachment.attachmentName = chats[i].fileCaption;
                attachment.attachmentUrl = chats[i].filePath;
                attachment.attachmentThumbnailUrl = chats[i].thumbFilePath;
                attachment.attachmentType = MediaTypeInfo.Image;
              }
              if (chats[i].filePath.indexOf('video') !== -1) {
                attachment.attachmentName = chats[i].fileCaption;
                attachment.attachmentUrl = chats[i].filePath;
                attachment.attachmentThumbnailUrl = chats[i].posterImage;
                attachment.posterImageUrl = chats[i].posterImage;
                attachment.attachmentType = MediaTypeInfo.Video;
                attachment.type = chats[i].fileType;
              }
              if (chats[i].filePath.indexOf('audio') !== -1) {
                attachment.attachmentName = chats[i].fileName;
                attachment.attachmentUrl = '/assets/images/media/audio-thumb.png';
                attachment.attachmentThumbnailUrl = '/assets/images/media/audio-thumb.png';
                attachment.posterImageUrl = chats[i].posterImage;
                attachment.attachmentType = MediaTypeInfo.Audio;

              }
              // if( chats[i].linkUrl !== "")
              // {
              //   attachment.attachmentName = chats[i].content;
              //   attachment.attachmentUrl = chats[i].linkUrl;
              //   attachment.attachmentThumbnailUrl =   chats[i].thumbFilePath;
              //   attachment.attachmentType =  MediaTypeInfo.Link;
              //   //attachment.posterImageUrl = chats[i].posterImage;
              // }
              // if( chats[i].filePath.indexOf('image') !== -1 ||chats[i].filePath.indexOf('video') !== -1||  chats[i].linkUrl !== "" || chats[i].filePath.indexOf('audio') !== -1){
              if (chats[i].filePath.indexOf('image') !== -1 || chats[i].filePath.indexOf('video') !== -1 || chats[i].filePath.indexOf('audio') !== -1) {
                if (this.attachmentGallery.some(x => x.id == attachment.id) == false) {
                  this.attachmentGallery.push(attachment);
                }
              }
              console.log('this.attachmentGallery');
               console.log(this.attachmentGallery);
            }

            this.chatResponse.find(x => x.DisplayDateyyMMdd == cMobileDate).chatmessage.push(chats[i]);
          } else {
            //let disDate = new Date(chats[i].createdOnMobile);
            let chatResponse: ChatResponse = new ChatResponse();
            chatResponse.displayDate = new Date(chats[i].createdOnMobile);
            console.log('DisplayDate: 3');
            chatResponse.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
            chatResponse.chatmessage = [];

            if (chats[i].filePath != '' || chats[i].linkUrl != '' || chats[i].posterImage != '') {
              let attachment = new AttachmentGallery();
              attachment.id = chats[i].id;

              if (chats[i].filePath.indexOf('image') !== -1) {
                attachment.attachmentName = chats[i].fileCaption;
                attachment.attachmentUrl = chats[i].filePath;
                attachment.attachmentThumbnailUrl = chats[i].thumbFilePath;
                attachment.attachmentType = MediaTypeInfo.Image;
              }
              if (chats[i].filePath.indexOf('video') !== -1) {
                attachment.attachmentName = chats[i].fileCaption;
                attachment.attachmentUrl = chats[i].filePath;
                attachment.attachmentThumbnailUrl = chats[i].posterImage;
                attachment.posterImageUrl = chats[i].posterImage;
                attachment.attachmentType = MediaTypeInfo.Video;
                attachment.type = chats[i].fileType;
              }
              if (chats[i].filePath.indexOf('audio') !== -1) {
                attachment.attachmentName = chats[i].fileName;
                attachment.attachmentUrl = '/assets/images/media/audio-thumb.png';
                attachment.attachmentThumbnailUrl = '/assets/images/media/audio-thumb.png';
                attachment.posterImageUrl = chats[i].posterImage;
                attachment.attachmentType = MediaTypeInfo.Audio;

              }
              // if( chats[i].linkUrl !== "")
              // {
              //   attachment.attachmentName = chats[i].content;
              //   attachment.attachmentUrl = chats[i].linkUrl;
              //   attachment.attachmentThumbnailUrl =   chats[i].thumbFilePath;
              //   attachment.attachmentType =  MediaTypeInfo.Link;
              //   //attachment.posterImageUrl = chats[i].posterImage;
              // }
              // if( chats[i].filePath.indexOf('image') !== -1 ||chats[i].filePath.indexOf('video') !== -1||  chats[i].linkUrl !== "" || chats[i].filePath.indexOf('audio') !== -1){
              if (chats[i].filePath.indexOf('image') !== -1 || chats[i].filePath.indexOf('video') !== -1 || chats[i].filePath.indexOf('audio') !== -1) {
                if (this.attachmentGallery.some(x => x.id == attachment.id) == false) {
                  this.attachmentGallery.push(attachment);
                }
              }
              console.log('this.attachmentGallery');
               console.log(this.attachmentGallery);
            }
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            chatResponse.chatmessage.push(chats[i]);
            // if (prevDate != this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd"))
            // {
            this.chatResponse.push(chatResponse);

          }
          // prevDate  = this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd");
        }
        /*
        for (let i = 1; i < chats.length; i++) {
          if (chats[i].filePath != '' || chats[i].linkUrl != '' || chats[i].posterImage != '') {
            let attachment = new AttachmentGallery();
            attachment.id = chats[i].id;

            if (chats[i].filePath.indexOf('image') !== -1) {
              attachment.attachmentName = chats[i].fileCaption;
              attachment.attachmentUrl = chats[i].filePath;
              attachment.attachmentThumbnailUrl = chats[i].thumbFilePath;
              attachment.attachmentType = MediaTypeInfo.Image;
            }
            if (chats[i].filePath.indexOf('video') !== -1) {
              attachment.attachmentName = chats[i].fileCaption;
              attachment.attachmentUrl = chats[i].filePath;
              attachment.attachmentThumbnailUrl = chats[i].posterImage;
              attachment.posterImageUrl = chats[i].posterImage;
              attachment.attachmentType = MediaTypeInfo.Video;
              attachment.type = chats[i].fileType;
            }
            if (chats[i].filePath.indexOf('audio') !== -1) {
              attachment.attachmentName = chats[i].fileName;
              attachment.attachmentUrl = '/assets/images/media/audio-thumb.png';
              attachment.attachmentThumbnailUrl = '/assets/images/media/audio-thumb.png';
              attachment.posterImageUrl = chats[i].posterImage;
              attachment.attachmentType = MediaTypeInfo.Audio;

            }
            // if( chats[i].linkUrl !== "")
            // {
            //   attachment.attachmentName = chats[i].content;
            //   attachment.attachmentUrl = chats[i].linkUrl;
            //   attachment.attachmentThumbnailUrl =   chats[i].thumbFilePath;
            //   attachment.attachmentType =  MediaTypeInfo.Link;
            //   //attachment.posterImageUrl = chats[i].posterImage;
            // }
            // if( chats[i].filePath.indexOf('image') !== -1 ||chats[i].filePath.indexOf('video') !== -1||  chats[i].linkUrl !== "" || chats[i].filePath.indexOf('audio') !== -1){
            if (chats[i].filePath.indexOf('image') !== -1 || chats[i].filePath.indexOf('video') !== -1 || chats[i].filePath.indexOf('audio') !== -1) {
              if (this.attachmentGallery.some(x => x.id == attachment.id) == false) {
                this.attachmentGallery.push(attachment);
              }
            }
            // console.log('this.attachmentGallery');
            // console.log(this.attachmentGallery);
          }

          // if (prevDate == this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd")){
          //   this.chatResponse[this.chatResponse.length -1].chatmessage.push(chats[i]) ;
          // }
          // var cMobileDate = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
          let createdOnDate = moment.utc(chats[i].createdOnMobile).toDate();
          var cMobileDate = moment(createdOnDate).local().format('yyyy-MM-dd');

          if (this.chatResponse.some(x => x.DisplayDateyyMMdd == cMobileDate)) {
            // this.chatResponse[this.chatResponse.length -1].chatmessage.push(chats[i]) ;
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            this.chatResponse.find(x => x.DisplayDateyyMMdd == cMobileDate).chatmessage.push(chats[i]);
          } else {
            //let disDate = new Date(chats[i].createdOnMobile);
            let chatResponse: ChatResponse = new ChatResponse();
            chatResponse.displayDate = new Date(chats[i].createdOnMobile);
            console.log('DisplayDate: 1');
            //chatResponse.DisplayDateyyMMdd = this.datePipe.transform(new Date(chats[i].createdOnMobile + ' UTC'), 'yyyy-MM-dd');
            let createdOnDate = moment.utc(chats[i].createdOnMobile).toDate();
            chatResponse.DisplayDateyyMMdd = moment(createdOnDate).local().format('yyyy-MM-dd');
            chatResponse.chatmessage = [];
            chats[i].contentOriginal = chats[i].content;
            chats[i].captionOriginal = chats[i].fileCaption;

            chatResponse.chatmessage.push(chats[i]);
            this.chatResponse.push(chatResponse);
          }
          //prevDate  = this.datePipe.transform(new Date(chats[i].createdOnMobile),"yyyy-MM-dd");
        }
        */
        this.chatResponseSorted = this.chatResponse.sort((x, y) => +new Date(x.displayDate + ' UTC') - +new Date(y.displayDate + ' UTC'));
      }
     // console.log('this.chatResponse');
     // console.log(this.chatResponse);
      this.totalActiveUserCount = '0';
      this.totalActiveUserCount = this.groupinfo?.totalActiveUserCount;
      this.totalUserCount = '0';
      this.totalUserCount = this.groupinfo?.totalUserCount;
      this.showGallery('');
      if (isInit == true) {
        this.isLoadOnInit = false;
      }
      // console.log('this.ChatScroll.nativeElement.scrollTop');
      if(offsetfromsource==0)
      {
        setTimeout(() => this.chatscrollDirective.reset(), 0);
      }


    });

  }

  handleSelection(event) {
    this.content += this.ChatUCode(event.char);
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) {
      return str;
    }
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  mentionContent: string;
  mentionUserList: any[] = [];
  mentionUserListTemp: any[] = [];
  mentionUserIdSelected: any;

  findNthOccur(str, ch, N) {
    var occur = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] == ch) {
        occur += 1;
      }
      if (occur == N) {
        return i;
      }
    }
    return -1;
  }

  SelectUserForTag(username, userid) {
    let contenttoberemoved = '@' + this.sarchTextActiveUsers;
    this.mentionUserIdSelected = userid;

    for (let i = 0; i < this.mentionUserList.length; i++) {
      if (this.content.indexOf('@' + this.mentionUserList[i].userName) == -1) {
        this.mentionUserList[i].userId = '0';
      }
    }

    this.mentionUserList = this.mentionUserList.filter(x => x.userId != '0');
    console.log('this.mentionUserList111');
    console.log(this.mentionUserList);
    let indexforat = this.findNthOccur(this.content, '@', this.mentionUserList.length + 1);//this.content.indexOf('@',this.mentionUserList.length ) ;

    this.mentionUserList.push({ 'userId': userid, 'userName': username, 'isActive': 1 });

    if (indexforat == 0) {
      this.content = '<span class=\'TagContent\'>' + '@' + username + '</span>' + '&nbsp;' + this.content.substring(indexforat + ('@' + this.sarchTextActiveUsers).length);
    } else {
      let iStr = this.content.substring(0, (indexforat));
      let eStr = this.content.substring(indexforat + ('@' + this.sarchTextActiveUsers).length);
      this.content = iStr + '<span class=\'TagContent\'>' + '@' + username + '</span>' + '&nbsp;' + eStr;
    }
    //this.content =  this.content.replace(contenttoberemoved, "<span class='TagContent'>" + "@" + username + "</span>" );
    //this.content =  this.content.replace(contenttoberemoved, "<span >" + "@" + username + "</span>" );
    console.log(document.getElementById('input'));
    // var el = document.getElementById('input');
    // var range = document.createRange();
    // var sel = window.getSelection();

    // range.setStart(el.childNodes[0], el.innerText.length -1);
    // range.collapse(true);

    //   sel.removeAllRanges();
    //   sel.addRange(range)
    // sel.addRange(range)
    //     setTimeout(() => {
    //       document.getElementById('input').focus();
    //   }, 0);
    //document.getElementById('input').focus();

    this.chatBox = false;
  }

  InitiateTagSearchOrSendChatOnEnter(event) {
    this.isSendChatButtonEnabled = true;
    if (event.keyCode === 64) {
      if (this.chatType == ChatType.GroupChat || this.chatType == ChatType.Workstream) {
        this.chatBox = true;
      }
      return;
    }

    if (event.keyCode == 13 && !event.shiftKey) {


      if( !this.enterPressed){
        this.enterPressed = true;
      this.content = this.ChatUCode(event.target.innerHTML);
      event.preventDefault();
      //this.buttonClicked.next();
      console.log('send chat called...');
      this.SendChat();

      }

      setTimeout(() => {
        this.enterPressed = false;
      }, 1000);
      // this.sendchatbutton.nativeElement.click();
    }
  }

  getAttachmentType(filetype) {

    if (filetype.indexOf('image') !== -1) {
      return AttachmentType.image;
    }
    if (filetype.indexOf('video') !== -1) {
      return AttachmentType.video;
    }
    if (filetype.indexOf('audio') !== -1) {
      return AttachmentType.voice;
    }
    return AttachmentType.other;
  }

  attachmentTouploadList: FileData[] = [];

  preview(file) {
    console.log('Preview');
    console.log(file);
    if (file.length === 0 || file == null || file == undefined) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      return reader.result;
    };
  }

  isChatOfTypeImageAttachment(chat) {
    if (chat && chat.content == '' && chat.fileType.indexOf('image') !== -1) {
      return true;
    }
    return false;
  }

  isChatOfTypeOtherAttachment(chat) {
    if (chat && chat.content == '' && chat.fileType.indexOf('image') === -1) {
      return true;
    }
    return false;
  }

  FileSizeInKB(filesize) {
    if (filesize != null && filesize != undefined) {
      return (Math.round((filesize / 1024) * 100 + Number.EPSILON) / 1000);
    }
    return 0;
  }

  FileSizeInMB(filesize) {
    if (filesize != null && filesize != undefined) {

      return (filesize / (1024 * 1024)).toFixed(0);
    }
    return 0;
  }

  FileSize(filesize) {
    if (filesize != null && filesize != undefined) {
      if (filesize < 1048576) {
        return ((filesize / (1024)).toFixed(0) + ' KB');
      } else {
        return ((filesize / (1024 * 1024)).toFixed(0) + ' MB');
      }

    }
    return 0;
  }

  startNewchat() {
    this.isBlankChat = false;
  }


  SetScrollPosition(scrollHeight: any) {
    if (this.pagenumber == 1) {
      return scrollHeight.scrollHeight;
    } else {
      return (scrollHeight.scrollHeight - scrollHeight.clientHeight);
    }
  }


  closePopup() {
    this.chatBox = false;
  }

  CancelRecording() {
    this.recordService.CancelRTC();
  }

  ResetRecording() {
    this.recordService.ResetRTC();
  }

  ReplyMessage() {
    this.IsSendReply = true;
  }

  isDeleteLoading: boolean;
  deleteChatId: string;

  ReplyChatMessage(message) {
    this.replyChat = message;

  }
  chatReplaceMessage(data) {
    let translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
    let transText = "Translate to "+translatelangArray['name'];
    setTimeout(() => {
    for (let i = 0; i < this.chatResponse.length; i++) {
      for (let j = 0; j < this.chatResponse[i].chatmessage.length; j++) {
        if (this.chatResponse[i].chatmessage[j].id == data.id) {
          this.chatResponse[i].chatmessage[j].content = data.message;
          this.chatResponse[i].chatmessage[j].fileCaption = data.fileCaption;
          this.chatResponse[i].chatmessage[j].contentOriginal = data.contentOriginal;
          this.chatResponse[i].chatmessage[j].captionOriginal = data.captionOriginal;

          this.chatResponse[i].chatmessage[j].transText = data.transText;
        }
        else{
          if( data.settype == 'settings-on'){
            this.chatResponse[i].chatmessage[j].transText = transText;
          }
        }
      }
    }
  }, 100);
  }

  DeleteChatMessage(id) {
    this.isDeleteLoading = true;
    this.deleteChatId = id;
    let alldomainusers: ChatMessage = this.prepareChatMessage();
    alldomainusers.dataId = id;
    console.log(alldomainusers);
    this.limit = '10';
    // console.log('ddddddd')
    // console.log(this.chatResponse.find(x=>x.chatmessage.find(y=>y.id == "17347")).chatmessage)
    // console.log(this.chatResponse.filter(x=>x.chatmessage.filter(y=>y.id == "17347"))[0].chatmessage.filter(k=>k.id == "17347"))
    //return;
    //this.IsLoadingOnChatScroll =true ;
    this.chatservice.DeleteChat(alldomainusers).subscribe(resp => {
      this.isDeleteLoading = false;
      let DeletedChatMessage: any[] = resp.chatMessage;
      if (DeletedChatMessage.length > 0) {
        let deleteChat = DeletedChatMessage[0];
        // console.log(this.chatResponse.find(x=>x.chatmessage.find(y=>y.id == deleteChat.id)).chatmessage);
        // let chatMessages:any[] = this.chatResponse.find(x=>x.chatmessage.find(y=>y.id == deleteChat.id)).chatmessage;
        // chatMessages.filter(x=>x.id == deleteChat.id)[0] = deleteChat
        // this.chatResponse.filter(x=>x.chatmessage.filter(y=>y.id == deleteChat.id))[0].chatmessage   =  chatMessages;

        for (let i = 0; i < this.chatResponse.length; i++) {
          for (let j = 0; j < this.chatResponse[i].chatmessage.length; j++) {
            if (this.chatResponse[i].chatmessage[j].id == deleteChat.id) {
              this.chatResponse[i].chatmessage[j] = deleteChat;
            }
          }
        }

        //this.chatResponse.filter(x=>x.chatmessage.filter(y=>y.id == deleteChat.id))[0].chatmessage.filter(k=>k.id == deleteChat.id)[0] = deleteChat;

        // this.chatResponse.find(x=>x.chatmessage.find(y=>y.id == deleteChat.id)).chatmessage =
        // this.chatResponse.find(x=>x.chatmessage.find(y=>y.id == deleteChat.id)).chatmessage
        // this.chatResponse.filter(
        //   x=>x.chatmessage.filter(
        //     y=>y.id == deleteChat.id))[0].chatmessage.filter(k=>k.id == deleteChat.id)[0] = deleteChat;
      }

      this.deleteChatId = '';
      console.log('resp');
      console.log(resp);
      this.content = '';
      //  const modalMsgRef = this.modalService.open(SuccessComponent, this.config);
      //       modalMsgRef.componentInstance.msg = 'Message deleted successfully';
      //       setTimeout(() => {
      //         modalMsgRef.dismiss('Cross click');
      //        //this.showuserdashboard(1);
      //       }, 2000);
      //this.ResetPaging();
      //this.GetworkstreamOrGroupChat(false);
    });
  }

  OpenUserProfile(userid) {
    {

      var aurl = forumPageAccess.profilePage + userid;
      window.open(aurl, '_blank');
      //alert(1);
    }
  }

  converttoLocalTime(dateString) {
    new Date(dateString + ' UTC');
  }

  previtemheight: number = 0;

  ngAfterViewInit() {
    this.chatscrollDirective.isFirstTime = true;
    let sub = this.chatscrollsrowElements.changes.subscribe(data => {
      // this.chatscrollDirective.reset()
     setTimeout(() => this.chatscrollDirective.restore(), 1000);
    });
    //this.chatscrollDirective.reset();
  }


  downloadFile(fileUrl) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', `products.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  RemoveAttachment(itemTobeDeleted: any) {
    this.attachmentTouploadList = this.attachmentTouploadList.filter(x => x != itemTobeDeleted);
  }

  //get called on onblur
  //handles emoji characters
  getContent(innerText) {
    if (innerText == '' || innerText == null || innerText == undefined) {
      this.isSendButtonEnabled = false;
    } else {
      this.isSendButtonEnabled = true;
    }

    //
    this.content = this.ChatUCode(innerText);
  }

  SearchDomainUsers(innerText) {
    if (innerText == '' || innerText == null || innerText == undefined) {
      this.isSendButtonEnabled = false;
    } else {
      let searchtext = '';
      let searchtextreverse = '';
      this.isSendButtonEnabled = true;
      if (this.chatBox == true) {
        for (let i = (innerText.length - 1); i >= 0; i--) {
          searchtextreverse = searchtextreverse + innerText[i];
          if (innerText[i] == '@' || innerText == '') {
            searchtext = searchtextreverse.split('').reverse().join('');
            console.log('search text');
            console.log(searchtext);
            this.offsetDomainUser = 0;
            this.pagenumberDomainUsers = 1;

            this.sarchTextActiveUsers = searchtext.substring(searchtext.indexOf('@', this.mentionUserList.length) + 1);
            let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
            this.chatservice.getDomainUserlist(domainUsers).subscribe(resp => {
              if (resp.status == 'Success') {
                // if (resp.totalUsers == 0){
                //   this.chatBox = false ;
                // }else{
                //   this.chatBox = true ;
                // }

                this.totalActiveUsePopprCount = resp.totalUsers * 1;
                // this.isLoadingOnScroll = false ; ;

                this.allDomainUsers = resp.dataInfo;
              }
            },
              (error => {
                console.log(error);

              })
            );
          }
        }
      }
    }

  }

  ResetPaging() {
    this.offset = 0;
    this.pagenumber = 1;
  }

  //spacial function for emoji
  ChatUCode(t) {
    var S = '';
    for (let a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S += '\\u' + ('0000' + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    return S;
    //console.log(S);
  }

  convertunicode(val) {
    val = val.replace(/\\n/g, '')
      //.replace(/'/g, '"')
      .replace(/\\'/g, '\\\'')
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, '\\&')
      .replace(/\\r/g, '\\r')
      .replace(/\\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\\f/g, '\\f');

    // remove non-printable and other non-valid JSON chars
    val = val.replace(/[\u0000-\u0019]+/g, "");

    if (val == undefined || val == null) {
      return val;
    }
    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf('\\uD') != -1 || val.indexOf('\\u') != -1) {

      JSON.stringify(val);
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
      //return (JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"'));
      return (JSON.parse('"' + val.toString().replace(/\\"/g, '"').replace(/"/g, '\\"') + '"'));
    } else {
      return val;
    }

  }

  isValidUrl(userInput) {

    //var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    var regex = /^(?:https?:\/\/(?:www\.)?|www\.)[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/\S*)?$/;
    var pattern = new RegExp(regex);
    return pattern.test(userInput);


    // var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    // if(res == null)
    //    return false;
    // else
    //    return true;
  }

  public lg: any;
  public mediaGallery: any;
  public lgTimeOut: number = 0.5;

  showGallery(type) {
    let timeout;
    let gallery;

    // setTimeout(() => {
    // console.log('document.getElementById("viewGallery")');
    // console.log(document.getElementById('viewGallery'));
    setTimeout(() => {
      this.lg = lightGallery(document.getElementById('viewGallery'), {
        actualSize: true,
        autoplayFirstVideo: false,
        closable: false,
        download: true,
        escKey: false,
        loop: false,
        preload: 2,
        showAfterLoad: false,
        videojs: false,
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 1
        },
        vimeoPlayerParams: {
          byline: 0,
          portrait: 0,
          color: 'A90707'
        }
      });
    }, 0);
  }

  // lightGallery(document.getElementById("viewGallery"));
  // , {
  //   actualSize: true,
  //   closable: false,
  //   download: true,
  //   escKey: false,
  //   videojs: false,
  //   youtubePlayerParams: {
  //     modestbranding: 1,
  //     showinfo: 0,
  //     rel: 0,
  //     controls: 1
  //   },
  //   vimeoPlayerParams: {
  //     byline : 0,
  //     portrait : 0,
  //     color : 'A90707'
  //   }
  // });
  // }, 0);
  //}

  ZoomAttachment(id) {

    var element = document.getElementById('img' + id);
    element.click();
  }

  GetId(id) {
    return '#img' + id;
  }
  GetDataSrc(image) {
    let dataSrc = '';
    if (image?.attachmentType != this.mediaTypeInfoVideo && image?.attachmentType != this.mediaTypeInfoAudio) {
      dataSrc = image?.attachmentUrl;
    }
    return dataSrc;
  }


  onScrollDown() {
    if (this.chatscrollDirective.CheckScrollAtBottom() == true) {
      console.log('at bottom,..................');
      // this.instantPushCount = 0 ;
    }
  }

  setDefaultPic(chat) {
    console.log('errrrrro logged.....');

  }

  id(index, item) {
    return item.id;
  }

  //#endregion common code
  //#region  Prepare data object
  prepareChatMessage(): ChatMessage {
    let workStreamChat: ChatMessage = new ChatMessage();
    workStreamChat.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      workStreamChat.chatGroupId = this.chatGroupId;
      workStreamChat.workstreamId = '0';
    } else {
      workStreamChat.workstreamId = (this.chatGroupId) ? this.chatGroupId.toString() : '1';
      this.chatGroupId;
      workStreamChat.chatGroupId = '0';
    }
    workStreamChat.domainId = this.domainId;
    workStreamChat.countryId = this.countryId;
    workStreamChat.content = this.content;
    workStreamChat.chatType = this.chatType;
    workStreamChat.userId = this.userId;
    if (this.replyChat != null && this.replyChat != undefined) {
      workStreamChat.sendpush = '8';
      workStreamChat.messageId = this.replyChat.id;
      workStreamChat.messageType = '6';
    }
    // workStreamChat.mentionContent = this.mentionContent;
    if (this.mentionUserList.length > 0) {

      for (let i = 0; i < this.mentionUserList.length; i++) {
        if (this.content.indexOf('@' + this.mentionUserList[i].userName) == -1) {
          this.mentionUserList[i].userId = '0';
        }
      }
      this.mentionUserList = this.mentionUserList.filter(x => x.userId != '0');

      if (this.mentionUserList.length > 0) {
        let content = this.content;
        for (let i = 0; i < this.mentionUserList.length; i++) {
          let indexforat = this.findNthOccur(this.content, '@', i + 1);
          let indexforless = this.findNthOccur(this.content, '<', (i + 1) * 2);
          let username = this.content.substring(indexforat, indexforless);
          content = content.replace(username, '<<USERID:' + this.mentionUserList[i].userId + '>>');
          content = content.replace('<span ', '');
          content = content.replace('class="TagContent">', '');
          content = content.replace('</span>', '');
        }
        content = content.replace('class=\'TagContent\'>', '');
        this.mentionContent = content;
      }
      workStreamChat.mentionContent = this.mentionContent;
    }
    workStreamChat.mentionUserList = this.mentionUserList;
    return workStreamChat;
  }

  prepareAllChatList(): WorkStreamOrGroupChat {
    let workStreamOrGroupChat: WorkStreamOrGroupChat = new WorkStreamOrGroupChat();
    workStreamOrGroupChat.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      workStreamOrGroupChat.chatGroupId = this.chatGroupId;
      workStreamOrGroupChat.workstreamId = '0';
    } else {
      workStreamOrGroupChat.workstreamId = (this.chatGroupId) ? this.chatGroupId.toString() : '1';
      this.chatGroupId;
      workStreamOrGroupChat.chatGroupId = '0';
    }
    workStreamOrGroupChat.domainId = this.domainId;
    workStreamOrGroupChat.countryId = this.countryId;
    workStreamOrGroupChat.limit = this.limit;
    workStreamOrGroupChat.offset = (this.offset) ? this.offset.toString() : '0';
    workStreamOrGroupChat.chatType = this.chatType;
    workStreamOrGroupChat.notificationVersion = '2';
    workStreamOrGroupChat.lastReply = this.lastReply;
    workStreamOrGroupChat.userId = this.userId;
    return workStreamOrGroupChat;
  }

  //#endregion Prepare data object

  //#region  Active/Total User Popup

  //#endregion Active/Total User Popup
  GetActiveUserHeader() {

    let domainUsers: DomainUserChat = this.prepareActiveUserHeaderList();
    this.chatservice.getDomainUserlist(domainUsers).subscribe(resp => {
      if (resp.status == 'Success') {
        this.activeUsers = [];
        this.activeUsers = resp.dataInfo;
      }
    },
      (error => {
        console.log(error);
      })
    );
  }

  prepareActiveUserHeaderList(): DomainUserChat {
    let domainUserChat: DomainUserChat = new DomainUserChat();
    domainUserChat.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      domainUserChat.chatGroupId = this.chatGroupId;
      domainUserChat.workstreamId = '0';
    } else {
      domainUserChat.workstreamId = (this.chatGroupId) ? this.chatGroupId.toString() : '1';
      this.chatGroupId;
      domainUserChat.chatGroupId = '0';
    }
    domainUserChat.domainId = this.domainId;
    domainUserChat.countryId = this.countryId;
    domainUserChat.isActiveUser = '1';
    domainUserChat.limit = this.activeUserCountOnHeader;
    domainUserChat.offset = '0';
    domainUserChat.searchText = '';
    domainUserChat.selectedUsers = '';
    domainUserChat.userId = this.userId;
    return domainUserChat;
  }

  //#region  User Tag Popup
  GetAllDomainUser() {

    let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
    this.chatservice.getDomainUserlist(domainUsers).subscribe(resp => {
      if (resp.status == 'Success') {
        this.allDomainUsers = resp.dataInfo;
        this.userTotalCount = resp.totalUsers;
       // console.log(' allDomainUsers');
       // console.log(this.allDomainUsers);
      }
    },
      (error => {
        console.log(error);
      })
    );
  }

  sarchTextActiveUsers: string = '';

  prepareAllDomainUserList(): DomainUserChat {
    let domainUserChat: DomainUserChat = new DomainUserChat();
    domainUserChat.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      domainUserChat.chatGroupId = this.chatGroupId;
      domainUserChat.workstreamId = '0';
    } else {
      domainUserChat.workstreamId = (this.chatGroupId) ? this.chatGroupId.toString() : '1';
      this.chatGroupId;
      domainUserChat.chatGroupId = '0';
    }
    domainUserChat.domainId = this.domainId;
    domainUserChat.countryId = this.countryId;
    domainUserChat.isActiveUser = '0';
    domainUserChat.limit = this.limitDomainUsers;
    domainUserChat.offset = (this.offsetDomainUser) ? this.offsetDomainUser.toString() : '0';
    domainUserChat.searchText = this.sarchTextActiveUsers;
    domainUserChat.selectedUsers = '1';
    domainUserChat.userId = this.userId;
    return domainUserChat;
  }

  UserModelClick(isActiveUser) {
    this.isActiveUser = isActiveUser;
    this.totalUserPopup.isActiveUser = isActiveUser;
    this.totalUserPopup.LoadUsers();

  }

  InitializeAndLoadAllDomainUserDataOnScoll() {
    fromEvent(this.UserListScroll.nativeElement, 'scroll').pipe(
      map((event: any) => {
        console.log('event');
        console.log(event);
        return event;
      })
      , filter(res =>
        ((res.target.scrollTop + res.target.offsetHeight) > (res.target.scrollHeight - 10)) && (this.pagenumberDomainUsers < Math.ceil(this.userTotalCount / Number(this.limitDomainUsers))))
      , debounceTime(300)
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: any) => {
      //this.isLoadingOnScroll = true ;
      this.offsetDomainUser = this.pagenumberDomainUsers * (Number(this.limitDomainUsers));
      this.pagenumberDomainUsers = this.pagenumberDomainUsers + 1;
      let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
      this.chatservice.getDomainUserlist(domainUsers).subscribe(resp => {
        if (resp.status == 'Success') {
          // this.isLoadingOnScroll = false ; ;
          this.allDomainUsers = [...this.allDomainUsers, ...resp.dataInfo];
        }
      },
        (error => {
          console.log(error);

        })
      );
    });
  }

  DMDeleteClick($event) {
    $event.stopPropagation();
    this.deleteDMEnable = !this.deleteDMEnable;
  }

  displayMentionedContent(mentionContent, mentionUserListArr: any[]) {
    for (let i = 0; i < mentionUserListArr.length; i++) {
      var usercontent = '<<USERID:' + mentionUserListArr[i].userId + '>>';
      mentionContent = mentionContent.replace(usercontent, '<span class=\'TagContent\'>' + '@' + mentionUserListArr[i].userName + '</span>' + '&nbsp;');
    }
    return mentionContent;
  }

  //#endregion User Tag Popup
  showModel(id) {
    let model_group = document.getElementById(id);
    model_group.classList.add('modal-fade');
  }

  hideModel(id) {
    id.classList.remove('modal-fade');
  }

  ShowpopupUser() {
    console.log('ShowpopupUser called');
    this.showModel('groupUserPopup');
  }

  IsLeveGroupenable: boolean;

  GroupmenuEnable($event) {
    $event.stopPropagation();
    this.IsLeveGroupenable = !this.IsLeveGroupenable;
  }

  OpenEditGroupName() {
    this.chatpopup.OpenEditGroupPoup(this.wsName, this.chatGroupId, this.wsImage);

  }

  LeaveGroup() {

    this.leaveGroupConfirmation.OpenLeaveGroupConfirmationPopup();
    // let model_group = document.getElementById("LeveGroupConfrimation");
    //  model_group.classList.add('modal-fade')
  }

  AddNewMemberToExistingGroup() {
    this.chatpopup.AddNewMemberToExistingGroup(this.chatGroupId, this.wsName);
  }

  RemoveDMChat() {
    this.deleteDMEnable = false;
    this.chatpopup.RemoveDMChat(this.chatGroupId);

    this.chatservice.channel.postMessage({
      removeChat: true,
      groupId: this.chatGroupId
    })
  }

  GetMentionedContent(chat) {

    let content: string = chat.mentionContent;
    if (content != null && content != undefined && content != '') {
      if (chat.mentionUserListArr != null) {
        for (let i = 0; i < chat.mentionUserListArr.length; i++) {
          let userIdString = '<<USERID:' + chat.mentionUserListArr[i].userId + '>>';
          let userNameString = '@' + chat.mentionUserListArr[i].userName;
          let textToReplace = '<a class=\'TagContent\'   href=' + forumPageAccess.profilePage + chat.mentionUserListArr[i].userId + ' target=\'_blank\'' + '>' + '@' + chat.mentionUserListArr[i].userName + '</a>';
          content = content.replace(userIdString, userNameString);
          content = content.replace(userNameString, textToReplace);
          //content = content.replace(userIdString,userNameString);
        }
      }
    }
    return content;

  }

  GetDocumentIcon(fileType: string) {
    let iconPath = 'assets/images/chat/unknown-thumb.png';
    if (fileType != null && fileType != undefined) {
      if (fileType.toLocaleLowerCase().indexOf('pdf') != -1) {
        iconPath = 'assets/images/chat/pdf-icon.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('zip') != -1) {
        iconPath = 'assets/images/chat/zip-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('msword') != -1) {
        iconPath = 'assets/images/chat/doc-thumb.png';
      }

      if (fileType.toLocaleLowerCase().indexOf('wordprocessingml.document') != -1) {
        iconPath = 'assets/images/chat/doc-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('application/vnd.ms-excel') != -1) {
        iconPath = 'assets/images/chat/xls-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('spreadsheetml.sheet') != -1) {
        iconPath = 'assets/images/chat/xls-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('presentationml.presentation') != -1) {
        iconPath = 'assets/images/chat/ppt-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('audio') != -1) {
        iconPath = 'assets/images/chat/sound-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('application/vnd.ms-powerpoint') != -1) {
        iconPath = 'assets/images/chat/ppt-thumb.png';
      }

      if (fileType.toLocaleLowerCase().indexOf('text/plain') != -1) {
        iconPath = 'assets/images/chat/notepad-thumb.png';
      }
      if (fileType.toLocaleLowerCase().indexOf('text/html') != -1) {
        iconPath = 'assets/images/chat/html-thumb.png';
      }
    }
    return iconPath;
  }

  GetDocumentIconFromFileExtension(extension: string) {
    let iconPath = 'assets/images/chat/unknown-thumb.png';
    if (extension != null && extension != undefined) {
      if (extension.toLocaleLowerCase().indexOf('pdf') != -1) {
        iconPath = 'assets/images/chat/pdf-icon.png';
      }
      if (extension.toLocaleLowerCase().indexOf('zip') != -1) {
        iconPath = 'assets/images/chat/zip-thumb.png';
      }
      if (extension.toLocaleLowerCase().indexOf('doc') != -1) {
        iconPath = 'assets/images/chat/doc-thumb.png';
      }
      if (extension.toLocaleLowerCase().indexOf('xlsx') != -1) {
        iconPath = 'assets/images/chat/xls-thumb.png';
      }
      if (extension.toLocaleLowerCase().indexOf('ppt') != -1) {
        iconPath = 'assets/images/chat/ppt-thumb.png';
      }
      if (extension.toLocaleLowerCase().indexOf('ppt') != -1) {
        iconPath = 'assets/images/chat/ppt-thumb.png';
      }
      if (extension.toLocaleLowerCase().indexOf('txt') != -1) {
        iconPath = 'assets/images/chat/notepad-thumb.png';
      }
      if (extension.toLocaleLowerCase().indexOf('html') != -1) {
        iconPath = 'assets/images/chat/html-thumb.png';
      }
    }
    return iconPath;
  }

  //#endregion
  LoadDefaultMessage(evt) {
    this.chatType = ChatType.Workstream;
    this.chatGroupId = localStorage.getItem('defaultWorkstream');
    this.LoadDefaultChatMessage();
    this.InitializeAndLoadAllDomainUserDataOnScoll();
  }

  PasteContent(e) {
    console.log(e);
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let blob = null;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        e.preventDefault();
        blob = item.getAsFile();
        console.log(blob);
        this.uploadfromCopyPaste(blob);
        console.log(blob);
      }
    }
  }

  SendChatClick() {
    this.buttonClicked.next();
  }

  directCall() {
    localStorage.removeItem('groupName');
    let userData: ManageTokBoxsession = this.prepareManageTokBoxsessionData();
    this.chatservice.idsArr = [this.allDomainUsers[0]?.userId];
    this.chatservice.ManageTokBoxsession(userData, true).subscribe(resp => {
      this.call.handleOutgoingCallPopup();
      if (!this.call.onCall) {
        this.call.users = [this.allDomainUsers[0]?.userId];
        this.call.internalInitSession(resp.sessionId, resp.token, this.allDomainUsers[0]?.userName);
      }
    });
  }

  prepareManageTokBoxsessionData(): ManageTokBoxsession {
    let memberToGroup: ManageTokBoxsession = new ManageTokBoxsession();
    memberToGroup.apiKey = Constant.ApiKey;
    memberToGroup.chatGroupId = '0'; //s.chatgroupid ;
    memberToGroup.domainId = '1'; //this.domainId;
    memberToGroup.userId = this.userId;
    memberToGroup.groupName = this.user.Username;
    return memberToGroup;
  }

  removeplaceholder() {
    document.getElementById('input').setAttribute('data-placeholder', '');
  }

  Addplaceholder() {
    document.getElementById('input').setAttribute('data-placeholder', 'Type a message, drop a file or paste using Ctrl-V');
  }

  invalidFile: boolean;
  invalidFileErr: string;

  validateFile(files: Array<any>): boolean {
    for (const item of files) {
      if (item.type == '') {
        this.invalidFile = true;
        this.invalidFileErr = 'Invalid file format';
        return false;
      }
      this.invalidFile = false;
    }
    var _validFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', 'tif', '.mp4', '.avi', 'mpg', 'mpeg', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'txt', 'zip', 'docx', 'doc', 'html', 'mp3'];
    let blnValid: Boolean = false;
    for (const item of files) {
      for (let j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (item.name.substr(item.name.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (blnValid == false) {
        this.invalidFile = true;
        this.invalidFileErr = 'Invalid file format';
        return false;
      }
    }
    return true;
  }

  IsNewMediaUpload(id: string) {
    return this.mediaList.some(x => x.id == id);
  }

  CheckImageStatus(id: string) {
    if (this.mediaList.some(x => x.id == id)) {
      const source = interval(10000);
      let jobid = (this.mediaList.find(x => x.id == id)) ? this.mediaList.find(x => x.id == id).jobid : null;
      if (jobid != null) {
        var subscription = source.subscribe(
          val => this.chatservice.getMediaUploadStatus(jobid, Constant.ApiKey, this.domainId, this.userId).subscribe((resp) => {
            if (resp.jobStatus == 'Complete') {
              this.mediaList = this.mediaList.filter(x => x.id != id);
              subscription.unsubscribe();
            }
          })
        );
      }
    } else {
      return true;
    }
  }

  IsReplyNormalMessage(chat) {
    return (chat && chat.messageType == this.messageTypenormalMessage && chat.flagId != this.mediaTypeInfoLink);

  }

  IsReplyLinkMessage(chat) {
    return (chat && chat.messageType == this.messageTypenormalMessage && chat.flagId == this.mediaTypeInfoLink);
  }

  IsReplyMessageImageExist(chat) {
    return (chat &&
      (
        (chat.messageType == this.messageTypenormalMessage && chat.flagId == this.mediaTypeInfoLink)
        || (chat.messageType == this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo)
          || (chat.messageType == this.messageTypeattachment && (chat.flagId == this.mediaTypeInfoImage || chat.flagId == this.mediaTypeInfoVideo))
        )));
  }

  IsReplyMessageAudioExist(chat) {
    return (chat.messageType == this.messageTypeattachment && chat.flagId == this.mediaTypeInfoAudio);
  }

  IsReplyFileInfoExist(chat) {
    return (chat &&
      (
        (chat.messageType == this.messageTypeattachment && chat.flagId == this.mediaTypeInfoAudio)
        || (chat.messageType == this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo)
          || (chat.messageType == this.messageTypeattachment && (chat.flagId == this.mediaTypeInfoImage || chat.flagId == this.mediaTypeInfoVideo))
        )));
  }

  GetReplyNormalMessage(chat) {
    if (chat && chat.mentionUserListArr && chat.mentionUserListArr.length > 0) {
      return this.GetMentionedContent(chat);
    }
    if (chat && chat.mentionUserListArr == null || chat.mentionUserListArr == undefined || (chat.mentionUserListArr && chat.mentionUserListArr.length == 0)) {
      return this.convertunicode(chat.content);
    }
    return '';
  }

  GetReplyMessageImage(chat) {
    if (chat && chat.messageType == this.messageTypenormalMessage && chat.flagId == this.mediaTypeInfoLink) {
      return (chat.isDefaultLInk == '1' ? 'assets/images/chat/default-link.png' : chat.thumbFilePath);
    }
    if (chat && chat.messageType == this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo)) {
      return this.GetDocumentIconFromFileExtension(chat.fileExt);
    }
    if (chat.flagId == this.mediaTypeInfoImage) {
      return chat.thumbFilePath;
    }
    if (chat.flagId == this.mediaTypeInfoVideo) {
      return chat.posterImage;
    }
    return '';
  }

  GetReplyMessageChatFileName(chat) {

    if (chat && chat.messageType == this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo)) {
      return chat.fileCaption;
    }
    if (chat.flagId == this.mediaTypeInfoImage) {
      return chat.fileCaption;
    }
    if (chat.flagId == this.mediaTypeInfoVideo) {
      return chat.fileCaption;
    }
    if (chat && chat.messageType == this.messageTypeattachment && chat.flagId == this.mediaTypeInfoAudio) {
      return chat.fileName;
    }
    return '';
  }

  replyChatPopup: any;

  CloseReplyPopup() {

  }

  closeReplyMessage() {
    this.replyChat = null;
  }

  redirectToReply(id) {
    document.getElementById(id).scrollIntoView();
  }

  scrolledUpCalled() {



    if (this.disableScollUp) {
      return;
    }
    if (this.busyGettingData) {
      return;
    }
    this.busyGettingData = true;

      this.loadMoreChat(true, '', '10');




  }
  getUserProfileStatus(chat,pindex,index) {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', chat.userId);
    this.probingApi.GetUserAvailability(apiFormData).subscribe((response) => {
      let resultData = response.items;
      let availability = resultData.availability;
      let availabilityStatusName = resultData.availabilityStatusName;
      let badgeTopUser = resultData.badgeTopUser;
      chat.availability = availability;
      chat.availabilityStatusName = availabilityStatusName;
      chat.profileShow = true;
      console.log(chat)
    });
  }
  // tab on user profile page
  taponprofileclick(userId){
    var aurl='profile/'+userId+'';
    window.open(aurl, aurl);
  }
}

class AttachmentGallery {
  attachmentName: string;
  attachmentUrl: string;
  attachmentThumbnailUrl: string;
  posterImageUrl: string;
  linkURL: string;
  id: string;
  attachmentType: string;
  type: string;
}

class UploadMedia {
  id: string;
  jobid: string;
  jobstatus: boolean;
}
