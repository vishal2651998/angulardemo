import * as OT from "@opentok/client";
import { BehaviorSubject, Subscription } from 'rxjs'
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild,Injectable } from "@angular/core";
import { Constant, ContentTypeValues, LocalStorageItem,ChatType,RouterText,PlatFormType, PushTypes, RedirectionPage, DefaultNewCreationText, SolrContentTypeValues, filterNames, ManageTitle,PageTitleText,forumPageAccess, pageInfo, pageTitle, windowHeight } from 'src/app/common/constant/constant';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {Message,MessageService} from 'primeng/api';
import { ActionFormComponent } from "../../components/common/action-form/action-form.component";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ApiService } from '../.../../../services/api/api.service';
import { AppUserNotificationsComponent } from "../../components/common/app-user-notifications/app-user-notifications.component";
import { AuthenticationService } from '../.../../../services/authentication/authentication.service';
import { CallsService } from "src/app/controller/calls.service";
import { ChatService } from "src/app/services/chat/chat.service";
import { CommonService } from '../.../../../services/common/common.service';
import { ContentPopupComponent } from "../../components/common/content-popup/content-popup.component";
import { LandingpageService } from "../../services/landingpage/landingpage.service";
import { ManageListComponent } from "../../components/common/manage-list/manage-list.component";
import { ManageUserComponent } from '../../components/common/manage-user/manage-user.component';
import { NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";
import { NonUserComponent } from "../../components/common/non-user/non-user.component";
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProductMatrixService } from "../.../../../services/product-matrix/product-matrix.service";
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SuccessModalComponent } from '../../components/common/success-modal/success-modal.component';
import { VerifyEmailComponent } from "../../components/common/verify-email/verify-email.component";
import { WelcomeHomeComponent } from '../../components/common/welcome-home/welcome-home.component';
import { DaysLoginPOPUPComponent } from '../../components/common/days-login-popup/days-login-popup.component';
import { debounceTime } from "rxjs/operators";
import { environment } from '../../../environments/environment';
import { PlatformLocation } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NavigationService } from 'src/app/services/navigation.service';
import { ImageCropperComponent } from '../../components/common/image-cropper/image-cropper.component';
import { MenuItem } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { UserDashboardService } from '../../services/user-dashboard/user-dashboard.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any;
declare var $: any;
import {isEmpty} from "lodash";
import { ThreadService } from "src/app/services/thread/thread.service";

@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.component.html',
  styleUrls: ['./product-header.component.scss'],
  providers: [MessageService]

})

@Injectable({ providedIn: 'root' })
export class ProductHeaderComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  videoCallData: any = null;
  public pushThreadArrayNotification=[];
  @ViewChild("subscriberDiv") subscriberDiv: ElementRef;
  @ViewChild('autocomplete') autocomplete:AutoComplete;
  public _OnMessageReceivedSubject: Subject<string>;
  @Input() pageData;
  @Input() nonuserResponce;
  @Input() privacyResponce;
  @Output() productHeaderComponentRef: EventEmitter<ProductHeaderComponent> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() showQuizPopup: EventEmitter<any> = new EventEmitter();
  @Output() FcmData: EventEmitter<any> = new EventEmitter();
  @Output() policyPopup: EventEmitter<any> = new EventEmitter();
  currentMessage = new BehaviorSubject(null);
  message;
  public bodyHeight: number;
  public innerHeight: number;
  public countryId;
  public countryName;
  public languageId;
  public languageName;
  public user: any;
  public domainId;
  public userId;
  public videoCall: boolean = false;
  public messageData=[];
  public cbaDomain= localStorage.getItem('platformId');
  public tvsDomain: boolean = false;
  public definedNotifyText = "";
  public enableDesktopPush: boolean = false;
  public isIncognitoBrowser: boolean = false;
  public pageTitleText='New Thread';
  public dropdownAccess: boolean = true;
  public ssoEnabledFlag=localStorage.getItem('ssoEnabled');
  public subscriberDomain=localStorage.getItem('subscriber');
  public displayLogoutPopup: boolean = false;
  public displayPosition: boolean;
  public cba90DaysLoginFlag: boolean = false;
  public kaizenAssigneeRoleId: string = '';
  public position: string;
  public apiData: Object;
  public apiDataInfo: Object;
  public access: string;
  public enableCloseIcon: boolean = false;
  public welcomeProfileFlag: boolean;
  public profileFlag: boolean;
  public profileContainerFlag: boolean = false;
  public productListFlag: boolean = false;
  public headTitleFlag: boolean = false;
  public headTitle: string = '';
  public superAdmin: string;
  public isVerified: string;
  public popupVerified: string;
  public searchBgFlag: boolean = false;
  public searchReadonlyFlag: boolean = true;
  public searchFlag: boolean;
  public searchPlacehoder: string = '';
  public searchVal: string = '';
  public activePageAccess = "0";
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public newReport: boolean = false;
  public newReportTxt: string;
  subscription: Subscription;
  public dialogClose: boolean = false;
  public dialogEscClose: boolean = false;
  public landingWelcomeVideoFlag: boolean = false;
  public landingWelcomeMsgFlag: boolean = false;

  //public userName: string = "";
  //public profileImage: string = "";
  public isModalOpen = false;
  public loadingnotifications: boolean = true;
  public notificationType = 0;
  public totalNotificationcount = 0;
  public totalunseenunreadcolor = '';

  public totalAnnounceNotificationcount = 0;
  public totalAnnouncementColor = '';

  public totalChatNotificationcount = 0;
  public totalChatColor = '';

  public soundPushFlagUpdate=[];

  public totalThreadsNotificationcount = 0;
  public totalThreadsColor = '';
  public notificationClass = 'top-right-notifications-popup';
  public bodyElem;
  public platformName = 'Collabtic';
  public totalOthersNotificationcount = 0;
  public totalOthersColor = '';
  public roleId;
  public teamSystem = localStorage.getItem('teamSystem');
  public platformLogo;
  public assetPath: string = "assets/images";
  public assetPathplatform: string = "assets/images/";
  public searchImg: string = `${this.assetPath}/search-white-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close-white.png`;
  public showItemheader: boolean = true;
  public platformId;
  public platFormTypes: any = PlatFormType;
  public showLanguageFlag: boolean = false;
  public showCountryFlag: boolean = false;
  public tvslogoHeight: boolean = false;
  public disableManager: boolean = false;
  public policyFlag: boolean = false;
  public tvsIBDomain: boolean = false;
  public recentVinFlag: boolean = false;
  public industryType: any = [];
  public newBusinessAdmin: boolean = false;
  public collabticDomain: boolean = false;
  public collabticFixes: boolean = false;
  public tacDomain: boolean = false;
  public mahleDomain: boolean = false;
  public loadLogo: boolean = false;
  public bodyClass:string = "profile";
  public bodyClass1:string = "image-cropper";
  public bodyClass2:string = "thread-detail";
  public defaultNewButton: boolean = false;
  public dialogData: any = {
    access: '',
    navUrl: '',
    platformName: this.platformName,
    teamSystem: this.teamSystem,
    visible: true
  };
  public newButtonEnable: boolean = false;

  public notificationButtonEnable: boolean = false;
  public newCol2Width: any = localStorage.getItem("newCol2Width") == null ? 300 : localStorage.getItem("newCol2Width");
  public TVSIBDomain:boolean = false;
  public items: MenuItem[];
  public autoSearchCompleteEnable: boolean = Constant.autoSearchComplete == "1" && localStorage.getItem('platformId') != '2' ? true : false;
  public acText: string;
  public acResults: string[];
  public acResultsNew: any[];
  public incrementToast:number=0;
  public acResultsTotal: number;
  public acResultsData: string[];
  public autoCompleteWidthPX: string;
  public cbaloginmsg: Message[];
  public itemsEmptyRecord: boolean = false;
  public reportWs: any = "";
  public autoSearchApiCall;
  public newTextHead: string = "NEW";
  public displayGTSModal: boolean = false;
  public displayWelcomeMessage: boolean = false;
  public disclaimerMessage: boolean = false;
  public disclaimerText: string = '';
  public welcomeVideoOptionFlag: boolean = false;
  public disclaimerMsgOptionFlag: boolean = false;
  public loginFileType: string = '';
  public loginImageUrl: string = '';
  public gtsText: string = '';
  /* cart */
  openCartPopup: boolean = false;
  showCartIcon: boolean = false;
  openCartClearPopup: boolean = false;
  removeTrainingConfirmation: boolean = false;
  defaultCart: any = {
    cartId: null,
    userId: null,
    email: '',
    phoneNumber: {
      countryCode: '',
      dialCode: '',
      e164Number: '',
      internationalNumber: '',
      phoneNumber: ''
    },
    totalAmount: 0,
    manualIds: [],
    trainingIds: []
  };
  cart: any = this.defaultCart;
  removeCartItem: { itemId: any; itemType: string; };
  cartUpdatedMessage:any;
  oldCart: any;
  removeManualIndex: number = null;
  removeTrainingIndex: number = null;
  manualpopup: boolean = false;
  trainingpopup: boolean = false;

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    let urlVal = this.router.url;
    if(urlVal == '/landing-page' || urlVal == '/dashboard-v2' || urlVal == '/workstreams-page' || urlVal == '/search' || urlVal == '/threads' || urlVal == '/documents' || urlVal == '/kaizen' ||  urlVal == '/headquarters' || urlVal == '/gts' || (urlVal == '/techsupport' && this.access=='techsupportrules' ) || (urlVal == '/techsupport-team' ) || (urlVal == '/repair-order' )){
      setTimeout(() => {
        this.setWidthNewButton();
      },100);
    }
  }


  constructor(
    public sanitizer: DomSanitizer,
    public messageService: MessageService,
    private titleService: Title,
    private probingApi: ProductMatrixService,
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    readonly afMessaging: AngularFireMessaging,
    //readonly snackBar: MatSnackBar,
    public sharedSvc: CommonService,
    private formBuilder: FormBuilder,
    public chatservice: ChatService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private location: PlatformLocation,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private tooltipconfig: NgbTooltipConfig,
    private router: Router,
    public call: CallsService,
    public notification: NotificationService,
    private navigation: NavigationService,
    private userDashboardApi: UserDashboardService,
    private threadApi: ThreadService,
  ) {
    const currentUrl = this.router.url.split('/');
    if (currentUrl[1].includes('market-place')) {
      this.showCartIcon = true;
    }
    this.location.onPopState (() => {
      setTimeout(() => {
      this.notification.getUserAppNotifications();
      },600);
      console.log(1111);
    });
    config.backdrop = true;
    config.keyboard = false;
    config.size = 'dialog-top';
    this._OnMessageReceivedSubject = new Subject<string>();
    // config.windowClass= 'top-right-notifications-popup';
    tooltipconfig.placement = 'bottom';
    tooltipconfig.triggers = 'click';
  }

  @HostListener('document:visibilitychange', ['$event'])

  visibilitychange() {


    let type1=0;
    navigator.serviceWorker.addEventListener('message', (event) => {
      let currUrl = this.router.url.split('/');
      let logoutDataevent=event.data.data;
      let logoutUser=logoutDataevent.logoutUser;
      if(logoutUser==1)
      {
        this.logout();
        this.authenticationService.logout();
      }
     // this.tapontoast(event.data.data);

    });



  }


  ngOnDestroy(): void {
    if(this.subscription)
    {
      this.subscription.unsubscribe()
    }

  }

  receivedCall(data) {
    this.call.initSession(data.sessionId, data?.tokenValue);
  }




  tapontoast(data)
  {
    let flag: any = true;
    let currUrl = this.router.url.split('/');
    this.messageService.clear('c');
    if((data.displayType=='1' || data.displayType=='2') && data.subType!='5' && data.subType!='6')
    {


      this.sharedSvc.setlocalStorageItem('landingRecentNav', flag);
      localStorage.setItem("notificationOnTap","1");
      localStorage.setItem("notificationTPID",data.postId);
      let newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
      let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
      let view = (newThreadView) ? viewPath : forumPageAccess.threadpageNew;
      var aurl = `${view}${data.threadId}`;
      if(currUrl[1] == 'threads' && currUrl[2] == 'view'){
        if(currUrl[3] == data.threadId){
          let data1 = {
            actionType: data.actionType,
            actionName: data.actionName,
            postId: data.postId,
          }
          console.log(data1);
          this.sharedSvc.emitPostDataNotification(data1);
        }
        else{

        }
      }
      else{

        let newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
        if((currUrl[1] == 'threads' || currUrl[1] == 'landing-page' || currUrl[1] == 'workstreams-page') && (newThreadView) ){

          if(data.threadId){
            if(data.actionType != 'comment' && data.actionType != 'reply'){
              localStorage.setItem('newThread','1');
            }
          }


          let data1 = {
          threadId: data.threadId,
          actionType: data.actionType,
          actionName: data.actionName,
          postId: data.postId,
          parentPostId: data.parentPostId,
          }
          console.log(data1);
          this.router.navigate([aurl]);
          setTimeout(() => {
          this.sharedSvc.emitPostDataNotification(data1);
          }, 1000);
        }
        else{
          this.router.navigate([aurl]);
        }
      }

    }
    else  if(data.displayType=='1' && data.subType=='5')
    {

      this.sharedSvc.setlocalStorageItem('landingRecentNav', flag);
      localStorage.setItem("notificationOnTap","1");
      localStorage.setItem("notificationTPID",data.dataId);
      var aurl = forumPageAccess.dispatch + data.dataId;
      if(currUrl[1] == RedirectionPage.Dispatch) {
        if(data.pushType != 35) {
          let data1 = `emitData--${data.dataId}`;
          const notificationSplit = data1.split('--');
          this.search.emit(notificationSplit);
        }
        //this.updateNotificationCountEvent.emit(data);
      } else {
        aurl = (data.pushType == 35) ? forumPageAccess.dispatch : aurl;
        if (!window.dispatchPage || window.dispatchPage.closed) {
          window.dispatchPage=window.open(aurl,'_blank' +aurl);
        } else {
          window.dispatchPage.focus();
        }
      }

    }
    else  if (data.displayType == '1' && data.subType == '6') {
      var aurl = forumPageAccess.workOrderPageView + data.workOrderId;
      window.open(aurl, '_blank');

    }
   else  if (data.displayType == '3') {
      var aurl = forumPageAccess.announcementPage + data.threadId;
      window.open(aurl, '_blank');

    }
    else  if (data.displayType == '7') {
      this.sharedSvc.setlocalStorageItem('landingRecentNav', flag);
      var aurl = forumPageAccess.documentViewPage + data.threadId;
      setTimeout(() => {
        this.sharedSvc.emitRightPanelOpenCallData(true);
      }, 100);
      //window.open(aurl, '_blank');
      this.router.navigate([aurl]);

    }
    else if (data.displayType == '6') {
      var aurl = forumPageAccess.profilePage + data.userId;
      window.open(aurl, '_blank');

    }
   else  if(data.displayType=='4')
    {
      localStorage.setItem('chatTab_chatType', data.chatType);
      if(data.chatType=='1')
      {
        localStorage.setItem('chatTab_workstreamId', data.chatGroupId);
      }
      else
      {
        localStorage.setItem('chatTab_chatGroupId', data.chatGroupId);
      }

      var aurl = forumPageAccess.chatpageNew + '';
      let chatgroupid = (data.chatType == ChatType.Workstream) ? data.chatGroupId : data.chatGroupId;
      this.SetChatSessionforRedirect(chatgroupid, data.chatType);
      if(this.access == 'chat-page')
        {
          this.sharedSvc.emitChatNotification('chat-page');
        }
        else
        {
          window.open(aurl, '_blank');

        }

    }




  }
  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }
  bugOrFeature(){
    window.open('bug_and_features');
  }
  showNotification(resdata) {



    console.log(resdata,resdata.displayType,resdata.subType);


    if(resdata.displayType=='1' && resdata.subType=='5')
    {
      //messageBody =messageBody+'<br/>'+'ID# '+resdata.dataId;
    }
    if(resdata.title)
    {
      let messageBody=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(resdata.body));
    let messagePropertiles={

      title:resdata.title,
      body:messageBody,
      messageId:resdata.messageId,
      chatGroupId:resdata.chatGroupId,
      chatType:resdata.chatType,


    }
    if(messageBody)
    {
      let urlVal = this.router.url;


      this.messageService.add({key: 'c',severity:'custom', summary: resdata, detail: messageBody,life: 5000});
      //this.messageData.push({key: 'c',severity:'custom', summary: resdata, detail: messageBody,sticky: true});
      console.log(this.messageData);
      //this.messageService.add({key: 'c',severity:'custom', summary: resdata, detail: messageBody,sticky: true});
      this.incrementToast=this.incrementToast+1;
    }

    }


    //this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
}
onConfirm() {
  this.messageService.clear('c');
}
onReject(incremented) {

  this.messageService.clear('c');
}
  rejectCall() {
    this.videoCall = false;
    this.videoCallData = null;
  }
  acceptCall() {
    console.log('Call Accepted All');
    this.receivedCall(this.videoCallData);
    this.videoCall = false;
  }


  get getTotalCount() {

    let total = 0;
    let chatCal = false;

    return this.notification.totalNotificationcount;
    /*
    if(this.pageData.access != 'chat-page') {
      total += this.notification.totalNotificationcount;
    }

    if(this.pageData.access == 'chat-page')
    {
        if(this.chatservice.totalNewWorkstreamMessage > 0) {
          total += this.chatservice.totalNewWorkstreamMessage;
          chatCal = true;
        }
        if(this.chatservice.totalNewGroupMessage > 0) {
          total += this.chatservice.totalNewGroupMessage;
          chatCal = true;
        }
        if(this.chatservice.totalNewDMMessage > 0) {
          total += this.chatservice.totalNewDMMessage;
          chatCal = true;
        }

        if(this.notification.totalAnnounceNotificationcount > 0) {
          total += this.notification.totalAnnounceNotificationcount;
        }
        if(this.notification.totalThreadsNotificationcount > 0) {
          total += this.notification.totalThreadsNotificationcount;
        }
        if(this.notification.totalOthersNotificationcount > 0) {
          total += this.notification.totalOthersNotificationcount;
        }
    }


    // if(this.notification.totalChatNotificationcount > 0 && chatCal === false) {
    //   total += this.notification.totalChatNotificationcount;
    // }


    return total;
    */
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.searchForm.controls;
  }
  isIncognito() {
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      console.log("cccc");
      return;
    }
    fs(
      window.TEMPORARY,
      100,
      function (fs) {
        // result.textContent = "it does not seem like you are in incognito mode";
        console.log("it does not seem like you are in incognito mode");
        localStorage.removeItem("incognitoMode");
      },
      function (err) {
        // result.textContent = "it seems like you are in incognito mode";
        console.log("it seems like you are in incognito mode");
        localStorage.setItem("incognitoMode", "1");
      }
    );
  }
  ngOnInit() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = 0;
    this.innerHeight = this.bodyHeight;
    let urlVal1: any = this.router.url;
    console.log("urlVal: ", urlVal1);
    if(this.cbaDomain=='3') {
      if(this.roleId==3) {
        switch (urlVal1) {
          case '/dashboard-v2':
          case '/landing-page':
          case '/workstreams-page':
          case '/threads':
          case '/search-page':
          case '/market-place':
          case '/market-place/training':
            this.newButtonEnable = true;
            break;
          default:
            this.newButtonEnable = false;
            break;
        }
      } else {
        switch (urlVal1) {
          case '/dashboard-v2':
          case '/landing-page':
          case '/workstreams-page':
          case '/threads':
          case '/search-page':
            this.newButtonEnable = true;
            break;
          default:
            this.newButtonEnable = false;
            break;
        }
      }
    }

    console.log('notification', this.notification.totalunseenunreadcolor)
    this.isIncognito();

    // Notification channel for listen notification clear events
    this.notification.notificationChannel = new BroadcastChannel('notification-channel');

    this.notification.notificationChannel.onmessage = (event) => {
      console.log('notification clear event fire...')
      if (event.data.clearAll === true) {
        this.notification.deleteAlluserNotifications(event.data.apiData, '')
      } else if (event.data.clearIndividual === true) {
        this.notification.getUserAppNotifications(event.data.apiData['type'], event.data.apiData['action']);
      }
    }

    this.subscription = this.notification.visibility.pipe(debounceTime(500)).subscribe(res => {
      if (res) {
      console.log('notification reload')
        this.notification.getUserAppNotifications();
        this.checkHiddenDocument();
      }
    })

    let incognitoMode = localStorage.getItem("incognitoMode");
    if (incognitoMode == "1") {
      this.isIncognitoBrowser = true;
    }
    console.error(navigator.userAgent);
    console.error(Notification.permission);
    let action = 'change';
    if (Notification.permission == "granted") {
      this.definedNotifyText = "";
      this.enableDesktopPush = false;
      action = 'init';
    } else if (Notification.permission == "denied") {
      action = 'init';
      this.definedNotifyText =
        "Notifications blocked. Please enable them in your browser.";
      this.enableDesktopPush = false;
    } else {
      action = 'init';
      this.definedNotifyText = "";
      this.enableDesktopPush = true;
    }

    this.platformName = localStorage.getItem("platformName");
    this.dialogData.platformName = this.platformName;







    // Notification on/off
    this.sharedSvc.emitOnCloseDetailPageCollapseSubject.subscribe((r) => {
      this.messageService.clear('c');
    });
    this.sharedSvc._OnPushMessageReceivedSubject.subscribe((r) => {

      console.log(r);
     this.showNotification(r);
     });

    this.sharedSvc.notificationHeaderSubject.subscribe((data: any) => {
      this.enableDesktopPush = data;
    });

    this.sharedSvc._toreceiveSearchEmptyValuetoHeader.subscribe((r) => {
      if(r==''){
        this.submitted = false;
        this.searchVal = '';
        this.searchTick = false;
        this.searchClose = this.searchTick;
        this.searchBgFlag = false;
        localStorage.removeItem('loadMenuPageName');
        localStorage.removeItem('searchValue');
        localStorage.removeItem('escalationPPFRSearch');
        this.searchImg = `${this.assetPath}/search-icon.png`;
        this.searchCloseImg = `${this.assetPath}/select-close.png`;
      }

    });

    this.sharedSvc._toreceiveSearchValuetoHeader.subscribe((r) => {
      if(r==''){
        this.clearSearch();
      }
      else{
        this.searchVal = r;
        this.searchBgFlag = true;
        this.searchTick = true;
        this.searchClose = this.searchTick;
        if (this.searchBgFlag) {
          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
      }

    });
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.showItemheader = false;
    }
    let platformId = localStorage.getItem("platformId");

    if (platformId == PlatFormType.Collabtic) {
      //this.platformLogo = this.assetPathplatform + "logo.png";
      //this.platformLogo = this.assetPathplatform + "loading.svg";
      this.collabticDomain = true;      
    } else if (platformId == PlatFormType.MahleForum) {
      this.mahleDomain=true;
      this.platformLogo = this.assetPathplatform + "mahle-logo.png";
    } else if (platformId == PlatFormType.CbaForum) {
      this.tacDomain = true;

      this.platformLogo = this.assetPathplatform + "cba-logo.png";

    } else if (platformId == PlatFormType.KiaForum) {
      this.platformLogo = this.assetPathplatform + "mahle-logo.png";
    } else {
      this.platformLogo = this.assetPathplatform + "logo.png";
    }

    let options = this.pageData;
    console.log(options)
    this.access = options.access;
    let accessCheck = false;
    this.searchFlag = options.search;
    this.profileFlag = options.profile;
    setTimeout(() => {
      this.profileContainerFlag = true;
    }, 1000);
    console.log(this.profileFlag);
    let navfrom = localStorage.getItem('tapProfile');
    if(this.access == 'search'){
      this.enableCloseIcon = true;
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'repairorder' || this.access == 'jobs-ratecard'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'headquarters'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'techsupportrules'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'techsupportteam'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'threads' || this.access == 'adas'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'parts'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'gtsList'){
      this.newButtonEnable = true;
      this.defaultNewButton = true;
    }
    else if(this.access == 'docpreview'){
      this.enableCloseIcon = true;
    }
    else if(this.access == 'profile' && navfrom == 'profile'){
      this.profileFlag = false;
      this.enableCloseIcon = true;
    }
    else{
      this.enableCloseIcon = false;
    }

    this.welcomeProfileFlag = options.welcomeProfile;

    this.platformId = localStorage.getItem('platformId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.roleId = this.user.role_id;
    this.countryId = localStorage.getItem('countryId');
    let cname = localStorage.getItem('countryName');
    this.countryName = this.roleId == "10" ? "Global" : cname ;
    let multipleCountry = localStorage.getItem('multipleCountry');
    this.showCountryFlag = multipleCountry == '1' ? true : false;
    this.TVSIBDomain = (this.platformId=='2' && this.domainId == '97') ? true : false;
    this.pageTitleText = (this.domainId == '97') ? `New ${ManageTitle.feedback}` : this.pageTitleText;
    this.pageTitleText = (this.platformId == '3') ? `New ${ManageTitle.supportRequest}` : this.pageTitleText;
    this.collabticFixes = (this.collabticDomain && this.domainId == 336) ? true : false;
    if( this.domainId=='71' && this.platformId=='1')
    {
      this.pageTitleText=ManageTitle.supportServices;
    }
    if(this.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
    {
      this.pageTitleText=ManageTitle.techHelp;
    }
    if (this.platformId != '1') {
      this.showLanguageFlag = true;
      this.disableManager = true;
      this.languageId = localStorage.getItem('languageId');
      this.languageName = localStorage.getItem('languageName');

      if (this.domainId == '97') {
        this.tvsIBDomain = true;
        this.policyFlag = true;
      }
      if((this.domainId == '52' || this.domainId == '97') && this.platformId == '2'){
        this.tvsDomain = true;
      }

    }
    else {
      this.showLanguageFlag = false;
    }
    let urlVal: any = this.router.url;
    let urlSplit = urlVal.split('/');
    urlVal = (urlSplit.length > 2) ? `/${urlSplit[1]}` : urlVal;
    console.log("urlVal: ", urlVal, urlSplit);

    switch(urlVal) {
      case '/dispatch':
        this.newButtonEnable = this.pageData.newButton;
        let data = ['new'];
        this.items = [{
          label: 'New',
          command: () => this.search.emit(data)
        }];
        break;
      case '/standard-reports':
        console.log(this.pageData)
        this.newButtonEnable = false;
        this.defaultNewButton = false;
        if(this.pageData.newReport) {
          this.newReportTxt = DefaultNewCreationText.standardReport;
        }
        if(this.pageData.newReportSection) {
          this.newReportTxt = DefaultNewCreationText.reportSection;
        }
        if(this.pageData.newReportModule) {
          this.newReportTxt = DefaultNewCreationText.reportModule;
        }
        if(this.pageData.newReportAdas) {
          this.newReportTxt = DefaultNewCreationText.reportVehicle;
        }
        break;
      case '/documents':
        this.newButtonEnable = true;
        this.defaultNewButton = false;
        this.itemsEmptyRecord = false;
        break;
      case '/faq':
        this.newButtonEnable = this.pageData.newButton;
        this.defaultNewButton = true;
        break;
    }


    if(urlVal == '/landing-page' || urlVal == '/dashboard-v2' || urlVal == '/workstreams-page' || urlVal == '/threads' || urlVal == '/parts' || urlVal == '/market-place' || urlVal == '/market-place/training' || urlVal == '/opportunity' || urlVal == '/techsupport-team' || urlVal == '/repair-order' || urlVal == '/headquarters' || urlVal == '/gts' || (urlVal == '/techsupport' && this.access=='techsupportrules' ) || urlVal.includes('/market-place/quiz-topics/')){
      setTimeout(() => {
        if(this.apiUrl.enableAccessLevel){
          if(urlVal == '/gts' || urlVal == '/headquarters'){
            this.apiUrl.newThreadAccessLevel = 1;
          }
          else{
            this.checkThreadAccess();
          }          
        }
        else{
          this.apiUrl.newThreadAccessLevel = 1;
        }
      }, 1000);
      if (this.platformId != '1') {
        if(this.platformId!='3' && this.platformId!='2')
        {
          this.newButtonEnable = false;
          this.notificationButtonEnable = true;
        }
        else

        {
          if(urlVal == '/opportunity'){
            this.newButtonEnable = true;
            this.items = [{
              //label: `New ${PageTitleText.Opportunity}`,
              label: 'New',
              title: "",
              url: "/opportunity/manage",
              target: "_blank",
            }];
          }
          else if(urlVal == '/market-place' || urlVal == '/market-place/training'){
            if(this.cbaDomain!='3')
            {
            this.newButtonEnable = true;
            }
            this.items = [
              {
                label: this.pageTitleText,
                title: "",
                url: "/market-place/manage",
                target: "_blank",
              }
            ];
          }
          else{
            if(this.cbaDomain!='3')
            {
            this.newButtonEnable = true;
            }
            this.items = [
              {
                label: 'NEW'
              }
            ];
          }
        }

      }
      else{
       if(urlVal == '/opportunity'){
          this.newButtonEnable = true;
          this.items = [{
            //label: `New ${PageTitleText.Opportunity}`,
            label: 'New',
            title: "",
            url: "/opportunity/manage",
            target: "_blank",
          }];
        }
        else if(urlVal == '/market-place' || urlVal == '/market-place/training'){
          this.newButtonEnable = true;
          if (urlSplit.length > 2 && urlSplit[2] == 'manuals') {
            this.items = [
              {
                label: 'New',
                title: "",
                command: () => this.addNewManualPage(),
                target: "_blank",
              }
            ];
          } else {
            if (urlVal == '/market-place/manuals') {
              this.items = [
                {
                  label: 'New',
                  title: "",
                  command: () => this.addNewManualPage(),
                  target: "_blank",
                }
              ];
            }
            else {
              if (urlSplit.length > 2 && (urlSplit[2] == 'settings' || urlSplit[2].match('policies')) ) {
                this.getHeaderMenuItems();
              }
              else {
                this.items = [
                {
                  label: 'New',
                  title: "",
                  command: () => this.addNewMarketPlacePage(),
                  target: "_blank",
                }
              ];
            }
            }
          }
        } else if (urlVal.includes('/market-place/quiz-topics/')) {
          this.newButtonEnable = true;
          this.items = [
            {
              label: 'New',
              title: "",
              command: () => this.showQuizPopup.emit(true),
            }
          ];
        }
        else{
          this.newButtonEnable = true;
          this.items = [
            {
              label: 'NEW'
            }
          ];
        }
      }

    } else {
      this.notificationButtonEnable = true;
    }

    setTimeout(() => {
      let urlVal = this.router.url;
      console.log(urlVal);
      this.industryType = this.sharedSvc.getIndustryType();
      console.log(this.industryType);
      let platformId = localStorage.getItem('platformId');
      if (platformId == '1' && this.domainId!='317') {
        this.notificationButtonEnable = true;
        this.recentVinFlag = ((urlVal == '/landing-page' || urlVal == '/dashboard-v2' || urlVal == '/workstreams-page' ) && this.industryType['id'] == 2) ? true : false;
        this.recentVinFlag = (this.collabticFixes) ? false : this.recentVinFlag;
      }
      else{
        this.notificationButtonEnable = true;
      }
      if(urlVal == '/landing-page' || urlVal == '/dashboard-v2' || urlVal == '/workstreams-page' || urlVal == '/documents'){
        this.getHeaderMenuItems();
        this.setWidthNewButton();
      }
      if(urlVal == '/threads' || urlVal == '/parts' || urlVal == '/search' || urlVal == '/documents' || urlVal == '/standard-reports' || urlVal == '/kaizen' || urlVal == '/gts' || urlVal == '/headquarters' || urlVal == '/repair-order' || urlVal == '/techsupport-team' || (urlVal == '/techsupport' && this.access=='techsupportrules' )){
        this.setWidthNewButton();
      }
    }, 1000);

    switch (this.domainId) {
      case 52:
      case 97:
        this.platformLogo = 'https://mss.mahleforum.com/img/tvs_logo1.png';
        this.tvslogoHeight = true;
        break;

      case 94:
        this.platformLogo =
          "https://mss.mahleforum.com/img/Lordstown_Logo.jpg";
        break;
    }

    this.userId = this.user.Userid;
    if (this.domainId == "60" || this.domainId == "22" || this.teamSystem) {
      this.dropdownAccess = false;
    }


    console.log(action)
    this.requestPermission(1, action);
    this.requestActivePageAccess(1);
    this.receiveMessage();
    // this.notification.receiveMessage();
    //this.listenForMessages();
    this.message = this.currentMessage;
    //console.log(options)
    if (this.profileFlag) {
      this.getUserProfile();
    }

    //(this.access);
    switch (this.access) {
      case "escalation":
      case "usermanagement":
      case "search":
      case "Product Matrix":
      case "productList":
      case "escalation-product":
      case "repairorder":
      case "gtsList":
      case "customers":
      case "headquarters":
      case "jobs-ratecard":
      case "techsupportrules":
      case "techsupportteam":
      case "ppfr":
      case "dtc":
        this.searchReadonlyFlag = false;
        if(this.access == 'search') {
          this.getUserProfile();
        }
        break;
    }
    switch (this.access) {
      case "productList":
        this.searchPlacehoder = "Search Product Matrix";
        break;
      case "escalation-product":
      case "repairorder":
      case "jobs-ratecard":
      case "techsupportrules":
      case "techsupportteam":
      case 'knowledge-base':
      case 'chat-page':
        this.searchPlacehoder = 'Search'
        break;
      case 'escalation':
        this.searchPlacehoder = 'Search Escalations';
        this.searchBgFlag = options.searchBg;
        if (this.searchBgFlag) {
          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
        break;
      case "ppfr":
        this.searchPlacehoder = "Search";
        this.searchBgFlag = options.searchBg;
        if (this.searchBgFlag) {
          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
        break;
      case 'market-place':
      case 'media':
      case 'directory':
      case 'customers':
      case 'gtsList':
      case "headquarters":
        this.searchPlacehoder = 'Search';
        this.searchReadonlyFlag = false;
        break;
      case 'usermanagement':
        this.searchPlacehoder = 'Search users';
        break;
      case 'sib':
      case 'parts':
      case 'threads':
      case 'knowledgeArticles':
      case 'landingpage':
      case "documents":
      case "announcement":
      case 'opportunity':
        this.searchPlacehoder = 'Search';
        this.searchReadonlyFlag = (this.access == 'opportunity') ? true : false;
        if(this.access == 'landingpage') {
          if(urlVal == '/workstreams-page') {
            let searchWs = localStorage.getItem('workstreamItemName');
            let searchWorkstreamName = (searchWs && (searchWs != undefined && searchWs!= 'undefined')) ? searchWs : '';
            this.searchPlacehoder = `${this.searchPlacehoder} in ${searchWorkstreamName}`;
          } else {
            this.searchPlacehoder = `${this.searchPlacehoder} all..`;
          }
        }
        break;
      case 'manageThread':
      case 'managePart':
      case 'manageSib':
      case 'manageKnowledgearticles':
        this.headTitleFlag = options.titleFlag;
        this.headTitle = options.title;
        break;
      case 'docpreview':
        this.headTitleFlag = options.titleFlag;
        this.headTitle = options.title;
        break;
      case 'standard-report':
      case 'adas':  
        this.searchPlacehoder ='Search';
        break;
      case 'search':
        console.log(this.pageData)
        this.searchPlacehoder = 'Search';
        this.searchBgFlag = options.searchBg;
        if (this.searchBgFlag) {
          this.searchVal = this.searchBgFlag
            ? localStorage.getItem("searchValue")
            : options.searchKey;
          this.submitSearch();

          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
        break;
    }

    if (this.searchFlag) {
      if (this.access == 'search') {
        this.searchVal = (this.searchBgFlag) ? localStorage.getItem('searchValue') : options.searchKey;
      } else if (this.access == 'parts' || this.access == 'sib' || this.access == 'knowledge-base') {
        this.searchVal = options.searchVal;
      } else if (this.access == "ppfr") {
        this.searchVal = this.searchBgFlag
          ? localStorage.getItem("escalationPPFRSearch")
          : options.searchKey;
      } else {
        this.searchVal = this.searchBgFlag
          ? localStorage.getItem("escalationSearch")
          : options.searchKey;
      }
      if (
        this.searchVal != undefined &&
        this.searchVal != "undefined" &&
        this.searchVal != ""
      ) {
        this.searchTick = true;
        this.searchClose = this.searchTick;
      }
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
    }

    setTimeout(() => {
      switch (this.access) {
        case 'repairorder':
        case 'headquarters':
        case 'dispatch':
        case 'standard-report':
        case 'adas':  
        case 'faq':
          this.productHeaderComponentRef.emit(this);
          break;
        case 'landingpage':
          if(urlVal == '/workstreams-page') {
            this.productHeaderComponentRef.emit(this);
          }
          break;
      }
      localStorage.removeItem('escalationSearch');
    }, 500);

    this.getCart();
    /* listens to cart Update from other pages */
    this.sharedSvc.cartUpdateSubject.subscribe((cart) => {
      this.oldCart = this.cart;
      this.getCart(cart ? true : false)
    });
  }
  setWidthNewButton(){
    this.newCol2Width = 264;
    let headerWidth = 0;
    if(this.access == 'opportunity' || this.access == 'market-place'){
      headerWidth = (document.getElementsByClassName("cbt-filter")[0]) ? document.getElementsByClassName("cbt-filter")[0].clientWidth : 0 ;
      this.newCol2Width = headerWidth+23;
    } else if(this.access == 'dashboard-v2') {
      this.newCol2Width = 316;
    } else if(this.access == 'kaizen'){
      this.newButtonEnable = true;
      this.newCol2Width = 160;      
    } else if(this.access == 'gtsList'){
      this.newButtonEnable = true;
      this.newCol2Width = 264;
    } else if(this.access == 'headquarters'){
      this.newCol2Width = 264;
    } else if(this.access == 'repairorder'){
      this.newCol2Width = 264;
    }else if(this.access == 'jobs-ratecard'){
      this.newCol2Width = 264;
    } else if(this.access == 'techsupportrules'){
      this.newCol2Width = 264;
    } else if(this.access == 'techsupportteam'){
      this.newCol2Width = 303;
      this.newTextHead = "NEW TEAM";
    } else if(this.access == 'search'){
      this.newButtonEnable = true;
      this.newCol2Width = 264;
    } else if(this.access == 'documents') {
      this.newCol2Width = 264;
    } else if(this.access == 'threads' || this.access == 'standard-report') {
      this.newCol2Width = 264;
    } else{
      headerWidth = (document.getElementsByClassName("second-left-width")[0]) ? document.getElementsByClassName("second-left-width")[0].clientWidth : 0 ;
      this.newCol2Width = headerWidth+85;
    }
    localStorage.setItem("newCol2Width",this.newCol2Width);
  }
  closewindowPopup(data) {
    if (data.closeFlag) {
      window.close();
    }
    this.displayLogoutPopup = false;
    location.reload();
  }


  public checkwithWebVersion()
  {
    let platformId = localStorage.getItem('platformId');
    if(platformId=='1' || platformId=='3' || platformId=='2')
    {


    let webVersionApp: any = '';
    switch(platformId) {
      case '1':
        webVersionApp = environment.webVersionCollabtic;
        break;
      case '3':
        webVersionApp = environment.webVersionCBA;
        break;
        case '2':
          if(this.domainId==52)
          {
            webVersionApp = environment.webVersionTVS;
          }
          if(this.domainId==82)
          {
            webVersionApp = environment.webVersionMAHLE;
          }

          break;
    }
    localStorage.setItem('webVersionApp', webVersionApp);
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('webAppversion', webVersionApp.toString());
    apiFormData.append('accessFrom', this.access);

    this.landingpageAPI.apiGetWebAppVersion(apiFormData).subscribe((response) => {
      let refreshFlag = false;
      switch(platformId) {
        case '1':
          refreshFlag = (environment.webVersionCollabtic<response.versionNumber) ? true : false;
          break;
        case '3':
          refreshFlag = (environment.webVersionCBA<response.versionNumber) ? true : false;
          break;
          case '2':
            if(this.domainId==52)
          {
            refreshFlag = (environment.webVersionTVS<response.versionNumber) ? true : false;
          }
          if(this.domainId==82)
          {
            refreshFlag = (environment.webVersionMAHLE<response.versionNumber) ? true : false;
          }


            break;
      }
      if(refreshFlag)
      {

       this.apiUrl.newupdateRefresh=true;
       this.apiUrl.upgradePopupShow = response.upgradePopup;
       this.apiUrl.webUpdatesArray=response.webUpdates;
       console.log(response.versionNumber);
      } else {
        this.apiUrl.newupdateRefresh=false;
      }

    });
  }
  }
  checkHiddenDocument() {
    if (document.hidden) {
      this.activePageAccess = "0";
    } else {
      this.activePageAccess = "1";
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }
     this.checkwithWebVersion();

      let notificationToggle = localStorage.getItem("notificationToggle");
      if (notificationToggle) {
        let headerNotify: any = localStorage.getItem('headerNotify');
        let enableDesktopPush = (headerNotify == 'granted') ? false : true;
        this.sharedSvc.emitNotificationHeader(enableDesktopPush);
        this.displayLogoutPopup = true;
        this.dialogData.access = 'reload';
        setTimeout(() => {
          localStorage.removeItem('headerNotify');
        }, 100);
      }
    }
    this.requestActivePageAccess(1);
  }
  taponlogo() {
    let currUrl = this.router.url.split('/');
    console.log(currUrl[1])
    let navUrl = RedirectionPage.Home;
    if(this.access == 'search') {
      this.router.navigate([navUrl]);
    } else {
      if (navUrl == currUrl[1]) {
        window.location.href = navUrl;
      } else {
        //this.router.navigate([navUrl]);
        let navHome = window.open(navUrl, navUrl);
        navHome.focus();
      }
    }
  }
  loadMenuPageName() {
    var loadMenuPageName = '';
    switch (this.access) {
      case 'threads':
        loadMenuPageName = 'Threads';
        break;
      case 'knowledgeArticles':
        loadMenuPageName = 'Knowledge Articles';
        break;
      case 'documents':
        let platformId = localStorage.getItem('platformId');
        if (platformId == '1') {
          loadMenuPageName = 'Tech Info';
        }
        else {
          loadMenuPageName = 'Documentation';
        }
        break;
      case 'parts':
        loadMenuPageName = 'Parts';
        break;
      case 'Inventory':
        loadMenuPageName = 'Inventory';
        break;
      case 'sib':
        loadMenuPageName = 'SIB';
        break;
      default:
        loadMenuPageName = 'Threads';
        break;
    }
    localStorage.setItem('loadMenuPageName', loadMenuPageName);
  }
  taponsearch(event) {
    this.loadMenuPageName();
    switch (this.access) {
      case 'announcement':
      case 'landingpage':
      case 'threads':
      case 'knowledgeArticles':
      case 'sib':
      case 'documents':
      case 'parts':
      case 'directory':
      case 'gtsList':
      case 'customers':
      case 'headquarters':
      case 'media':
      case 'escalation':
      case 'usermanagement':
      case 'search':
      case 'productList':
      case 'escalation-product':
      case 'ppfr':
      case 'dtc':
      case 'market-place':
      case 'standard-report':
      case 'adas':  
      case 'opportunity':
      case 'repairorder':
      case 'jobs-ratecard':
      case 'techsupportrules':
      case 'techsupportteam':
        break;

      default:
        let platformId = localStorage.getItem('platformId');
        if (platformId == '1') {
          if (this.domainId == '1' || this.domainId == '60' || this.domainId == '22' || this.teamSystem) {
            var aurl = forumPageAccess.newSearch;
          }
          else {
            // var aurl=forumPageAccess.forumSearch;
            var aurl = forumPageAccess.newSearch;
          }
        }
        else {
          var aurl = forumPageAccess.newSearch;
        }
        console.log('aurl: ', aurl);
        window.open(aurl, '_blank' + aurl).focus();
        break;
    }
  }

  tapnotifications(type = '') {
    this.isModalOpen = true;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.notificationClass);
    document.body.classList.add('top-right-notifications-popup');
    let config = Object.assign({}, this.config);
    config.windowClass = 'top-right-notifications-popup-only';
    const modalRef = this.modalService.open(AppUserNotificationsComponent, config);

    modalRef.componentInstance.newNotificationsFCM = type;
    modalRef.componentInstance.accessFrom = this.access;
    modalRef.componentInstance.updateNotificationCountEvent.subscribe((receivedService) => {

      if (receivedService == 'reset') {
        this.isModalOpen = false;
        setTimeout(() => {
          document.body.classList.remove('top-right-notifications-popup');
        }, 500);
      }
      else {
        const notificationSplit = receivedService.split('--');
        if(notificationSplit[0] == 'emitData') {
          this.search.emit(notificationSplit);
        } else {
          this.notification.totalNotificationcount = notificationSplit[0];
          this.notification.totalunseenunreadcolor = notificationSplit[1];
        }
      }
    });
  }

  /* FCM SETUP */
  browserDetection() {
    let browserName = '';
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
      // insert conditional IE code here
      browserName = "MSIE";
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
      // insert conditional Chrome code here
      browserName = "Chrome";
    }
    //Check if browser is Firefox
    else if (navigator.userAgent.search("Firefox") >= 0) {
      // insert conditional Firefox Code here
      browserName = "Firefox";
    }
    //Check if browser is Safari
    else if (
      navigator.userAgent.search("Safari") >= 0 &&
      navigator.userAgent.search("Chrome") < 0
    ) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    } else {
      browserName = "others";
    }
    return browserName;
  }
  /*
  listenForMessages() {
    this.afMessaging.messages.subscribe(
      ({ data }: { data: any }) =>
        this.snackBar.open(`${data.title} - ${data.alert}`, 'Close', {
          duration: 1000,
        }),
      err => console.log(err),
    );
  }
  */
  requestPermission(state, action = '') {

    this.checkwithWebVersion();
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (token && token != null) {
          this.enableDesktopPush = false;
        }
        else {
          this.enableDesktopPush = true;
        }
        this.sharedSvc.emitNotificationHeader(this.enableDesktopPush);

        //console.log(action)
        console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }
        let webVersionApp=environment.webVersionCollabtic;
        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('webAppversion', environment.webVersionCollabtic.toString());
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }
        //console.log(apiFormData);
        this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {
            if(state==0)
            {
              this.authenticationService.logout();
            }

          //console.log(response);
        });

        if ('permissions' in navigator) {
          navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
            notificationPerm.onchange = function () {
              console.log("User decided to change his seettings. New permission: " + notificationPerm.state);
              localStorage.setItem('headerNotify', notificationPerm.state);
              localStorage.setItem('notificationToggle', 'true');
              setTimeout(() => {
                localStorage.removeItem('notificationToggle');
              }, 5000);
            };
          });
        }
      },
      (err) => {
        this.enableDesktopPush = true;
        if(state==0)
        {
        this.authenticationService.logout();
        }
        console.log('Unable to get permission to notify.', err);
      }
    );
  }

  customfunction = (event: any): void => {

  };

  requestActivePageAccess(state) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        //console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('pageAccess', this.access);
        apiFormData.append('isActivePage', this.activePageAccess);
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        //console.log(apiFormData);

        this.landingpageAPI.ActiveDevicesOnPageWeb(apiFormData).subscribe((response) => {

          //console.log(response);
        });


      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    console.log("=================== PUSH Update 814 ===============");
    this.angularFireMessaging.messages.subscribe(({ data }: { data: any }) => {
      console.log("new message received. ", data);
      console.log("=================== PUSH Update 817 ===============");
      console.log(data)
      let urlVal = this.router.url;
      let logoutUser=data.logoutUser;

      if(logoutUser==1)
      {
        this.logout();
        this.authenticationService.logout();
      }
      if (data['access'] == 'parts' && data['chatType'] == '' || (this.access == 'landingpage' && urlVal == '/workstreams-page' && this.apiUrl.searchFromWorkstream && this.collabticDomain)) {
        return false;
      }
      let dataInfoId=data.threadId;


      let currUrl = this.router.url.split('/');
      let access = currUrl[1];
      data.access = access;
      let loginUserId=localStorage.getItem('userId');
      let desktopPush = data.desktopPush;
      desktopPush = (desktopPush == undefined || desktopPush == "undefined" || desktopPush == "") ? 0 : parseInt(desktopPush);
      let pushUserId = data.userId;
      let audioFlag = (desktopPush == 0 && loginUserId == pushUserId) ? false : true;
      console.log(data.access, desktopPush)
      if(data.access == RedirectionPage.Dispatch) {
        console.log(desktopPush)
        let id = data.dataId;
        let pushAction = '';
        let pushType = data.pushType;
        let removeFlag = (data.removeNotify == 1) ? true : false;
        if(desktopPush == 1) {
          //pushAction = (pushType == 34) ? 'silent-tech' : 'push';
          pushType = (pushType == undefined || pushType == "undefined" || pushType == "") ? '' : parseInt(data.pushType);
          switch (pushType) {
            case 32:
              pushAction = (removeFlag) ? 'status-remove' : 'push';
              break;
            case 34:
              pushAction = 'tech-push';
              break;
            case 35:
              pushAction = 'tech-order';
              break;
            default:
              pushAction = 'push';
              break;
          }

          //this.dispatchSilentPush(pushType)
        } else {
          pushType = (pushType == undefined || pushType == "undefined" || pushType == "") ? '' : parseInt(data.pushType);
          switch (pushType) {
            case 31:
              pushAction = 'silent-new';
              break;
            case 32:
              pushAction = (removeFlag) ? 'status-remove' : 'silent-status';
              break;
            case 33:
              pushAction = 'silent-edit';
            case 34:
              pushAction = 'silent-tech';
              removeFlag = false;
              break;
            case 35:
              pushAction = 'tech-order';
            default:
              pushAction = 'push';
              break;
          }
        }
        let dispatchData: any = [];
        pushAction = (pushType != 32 && removeFlag) ? 'push-remove' : pushAction
        dispatchData.push(pushAction);
        dispatchData.push(id);
        dispatchData.push(removeFlag)
        this.search.emit(dispatchData);
      }

      //silent push
      let urlLen = currUrl.length;
      let silentPushFlag = (urlLen > 2) ? false : true;
      data['pageInfo'] = '';

      if (data.typeId == 2) {
        this.call.groupName = data.groupName;
        this.notification.videoCall = true;
        this.notification.videoCallData = data;
        this.notification.initIncomingCallRing();
        localStorage.setItem('videoCallDataToken', data.tokenValue);
        localStorage.setItem('groupName', data.groupName);
        localStorage.setItem('videoCallDataSessionId', data.sessionId);
        localStorage.setItem('rejoin', 'false');
        return false;
      }
      let pushType = data.pushType;
      pushType = (pushType == undefined || pushType == "undefined" || pushType == "") ? '' : parseInt(data.pushType);
      let sindex: any = '', pageUrl = '', pageFilter = '', silentFilter = '', silentCountTxt = '', filter: any = [], silentLoadCount: any = 0;
      if (pushType != '') {
        sindex = PushTypes.findIndex(option => option.id == pushType);
        if(sindex < 0) {
          return false;
        }
        console.log(sindex, pushType, PushTypes)
        if (PushTypes[sindex].hasOwnProperty('url')) {
          pageUrl = PushTypes[sindex].url;
        }

        pageFilter = PushTypes[sindex].filter;
        silentFilter = PushTypes[sindex].silentFilter;
        silentCountTxt = PushTypes[sindex].silentCount;
        filter = JSON.parse(localStorage.getItem(pageFilter));
        silentLoadCount = localStorage.getItem(silentCountTxt);
      } else {
        silentPushFlag = false;
      }

      if (access == 'threads') {


        this.sharedSvc.emitNotificationData(data);


      }
      if (access == 'workstreams-page') {
        silentPushFlag = false;
        data['access'] = pageUrl;
        let wsTab = document.getElementsByClassName('ws-tab');
        Array.from(wsTab).forEach((el) => {
          let activeTab = el.classList.contains('active-tab');
          let checkSlug = el.classList.contains(pageUrl);
          let wsTabFlag = false;


          if (pushType >= 1) {
            //if(activeTab && checkSlug) {
            let infoIndex = PushTypes.findIndex(option => option.url == pageUrl);
            let pageInfoAct = pageInfo.workstreamPage;
            data['pageInfo'] = pageInfoAct;
            //}
          }

          let wsg = [];
          try {
            wsg = JSON.parse(data.groups);
            wsg.forEach(item => {
              let chkWsTab = `ws-tab-${item}`
              let chkWs = el.classList.contains(chkWsTab);
              if (chkWs) {
                wsTabFlag = true;
              }
            });
          } catch {
            console.log(data.groups);
          }


          if (activeTab && checkSlug && wsTabFlag) {
            let actWs = 0;
            let chkActiveWs = document.getElementsByClassName('workstream-bg');
            Array.from(chkActiveWs).forEach((el) => {
              let chkActWs = el.classList.contains('active');
              if (chkActWs) {
                let wsId = el.getAttribute('id');
                console.log(wsId)
                actWs = wsg.findIndex(option => option == wsId);
              }
            });
            silentPushFlag = (actWs >= 0) ? true : false;
          }
        });
      } else {

        if (this.access != pageUrl && urlLen < 2 && pushType!=3) {
          return false;
        }
        silentPushFlag = (silentPushFlag && access == pageUrl && urlLen < 3) ? silentPushFlag : false;
        if (silentPushFlag && pushType == 1) {
          let make = data.makeName;
          let filteredMake = (filter.make) ? filter.make : [];
          let additionalFields = ['workstream', 'make', 'action', 'threadViewType', 'loadAction'];
          console.log(silentPushFlag, make, filteredMake)
          let chkFilter = this.sharedSvc.checkFilterApply(filter, additionalFields);
          let chkFilterCount: any = chkFilter.filterCount;
          console.log(filter, chkFilter, chkFilterCount)
          silentPushFlag = (silentPushFlag && (filteredMake.length > 0 && (make != filteredMake[0] || (make == filteredMake[0] && chkFilterCount > 0)))) ? false : silentPushFlag;
          console.log(silentPushFlag)
        }
      }

      silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
      console.log("workstream msg ==>", currUrl, urlLen, pushType, silentPushFlag)
      let groups: any = data.groups?.toString();
      data.pushAction = (silentPushFlag) ? 'load' : 'notify';

      data.dataInfoId=dataInfoId;

      //if (data.pushType == 3 || data.pushType == 6 || data.pushType == 4 || data.pushType == 10 || data.pushType == 12 || data.pushType == 15 || data.pushType == 22 || data.pushType == 25) {
      switch (pushType) {
        case 9:
          if (this.isModalOpen == false) {
            if (this.access == 'chat-page') {
              let pushchatType = data.chatType;
              let pushchatGroupId = data.chatGroupId;
              if (pushchatType != '' && pushchatGroupId != '') {
                var src = '../../assets/sounds/pushalert.wav';
                var c = document.createElement('audio');
                c.src = src; c.play();

                let loadedChatType = localStorage.getItem('loadedChatType');
                let loadedchatGroupId = localStorage.getItem('loadedchatGroupId');
                let loadedworkstreamId = localStorage.getItem('loadedworkstreamId');
                if (loadedChatType == '1') {
                  if (loadedworkstreamId != pushchatGroupId) {
                    if (desktopPush == 1) {

                      this.sharedSvc.sharePushMessageReceived(data);
                     // $('body').addClass('top-right-notifications-popup');
                      //this.tapnotifications('new');
                    }
                  }
                }
                if (loadedChatType == '2' || loadedChatType == '3') {
                  if (loadedchatGroupId != pushchatGroupId) {
                    if (desktopPush == 1) {
                     // $('body').addClass('top-right-notifications-popup');
                    //  this.tapnotifications('new');

                     //this.showNotification(data);
                     this.sharedSvc.sharePushMessageReceived(data);
                    }
                  }
                }
              }
            }
            else {
              if (desktopPush == 1) {
               // $('body').addClass('top-right-notifications-popup');
                //this.tapnotifications('new');

                this.sharedSvc.sharePushMessageReceived(data);
              }
            }

            setTimeout(() => {
              this.sharedSvc.emitMessageReceived(data);
              this.currentMessage.next(data);
            }, 500);
          }
          else {
            this.sharedSvc.emitMessageReceived(data);
            this.currentMessage.next(data);
          }
          break;
        case 3:
        case 4:
        case 6:
        case 10:
        case 12:
        case 15:
        case 22:
        case 24:
        case 25:
          case 30:
            if (pushType == 30) {

              this.sharedSvc.sharePushMessageReceived(data);
            }
          if (pushType == 22) {
            let folderInfo = JSON.parse(data.fileCount);
            folderInfo = folderInfo[0];
            let fileInfo = JSON.parse(data.fileData);
            fileInfo = fileInfo[0];
            let folderId = folderInfo.id;
            let docId = data.messageId;
            fileInfo.documentDetail.assignedFolderId = folderId;
            data.fileCount = JSON.parse(data.fileCount);
            data.action = 'silent-push';
            return false;
          }

          if (access != 'workstreams-page') {
            let infoIndex = PushTypes.findIndex(option => option.id == pushType);
            data['pageInfo'] = PushTypes[infoIndex].pageInfo;
          }
          if (silentPushFlag || pushType == 10 || pushType == 3) {
            this.sharedSvc.emitMessageReceived(data);
          } else {
            if ( pushType != 25 && access != 'workstreams-page' && filter && filter.hasOwnProperty('workstream') && filter.workstream) {
              groups = JSON.parse(data.groups)
              let chkWs = groups.filter(x => !filter.workstream.includes(x));
              console.log(chkWs)
              if (chkWs.length > 0) {
                let routeLoadIndex = pageTitle.findIndex(option => option.slug == access);
                if (routeLoadIndex >= 0) {
                  let routeLoadText = pageTitle[routeLoadIndex].routerText;
                  localStorage.setItem(routeLoadText, 'true');
                }
                let chkFilter: any = localStorage.getItem(silentFilter);
                if (chkFilter == null) {
                  chkWs.forEach(item => {
                    filter.workstream.unshift(item);
                  });
                } else {
                  chkFilter = JSON.parse(chkFilter);
                  let schkWs = chkWs.filter(x => !chkFilter.includes(x));
                  if (schkWs.length > 0) {
                    chkWs.forEach(item => {
                      chkFilter.workstream.unshift(item);
                    });
                  }
                  filter = chkFilter;
                }
                console.log(chkWs, JSON.stringify(filter))
                localStorage.setItem(silentFilter, JSON.stringify(filter))
              } else {
                silentLoadCount = silentLoadCount + 1;
                localStorage.setItem(silentCountTxt, silentLoadCount);
              }
            } else if (pushType == 24 && filter.workstream == undefined) {
              silentLoadCount = silentLoadCount + 1;
              localStorage.setItem(silentCountTxt, silentLoadCount);
            }

            if (pushType==25) {
              this.sharedSvc.emitMessageReceived(data);
            }
          }
          break;
        default:
          if(audioFlag) {
            console.log(data);
            if(this.soundPushFlagUpdate.length==0)
            {
              if(data.title && data.title!='')
              {
                if((data.actionType && data.actionType!='') || data.pushType=='1')
                  {

                    let currUrl = this.router.url.split('/');
                let roleId=localStorage.getItem('roleId');
               /*
                if((currUrl[1] == 'threads' && (currUrl[2] == 'view' || currUrl[2] == 'view-v2')) && roleId=='1')
                {
                  if(data.actionType && (data.actionType=='comment' || data.actionType=='reply'))
                  {
                    if(roleId=='1')
                    {
                      if(currUrl[3] == data.threadId)
                      {
                        var src = '../../assets/sounds/pushalert.wav';
                        var c = document.createElement('audio');
                        c.src = src; c.play();
                      }
                    }
                  }
                }
*/

                 if(data.messageType=='3')
                    {
                      var src = '../../assets/sounds/pushalert.wav';
                      var c = document.createElement('audio');
                      c.src = src; c.play();
                    }

                    else if((currUrl[1] == 'threads' || currUrl[1] == 'workstreams-page' || currUrl[1] == 'landing-page'))
                    {
                      var src = '../../assets/sounds/pushalert.wav';
                      var c = document.createElement('audio');
                      c.src = src; c.play();

                    }
                  }
                  else if(currUrl[1] == 'chat-page')
                {

                  let pushchatType = data.chatType;
                  let pushchatGroupId = data.chatGroupId;
                  let messageType = data.messageType;
                  let displayType = data.displayType;

                  if (messageType=='9' || displayType=='4')
                  {
                    var src = '../../assets/sounds/pushalert.wav';
                    var c = document.createElement('audio');
                    c.src = src; c.play();
                  }
                }




              }
              else
              {
                let currUrl = this.router.url.split('/');
                let roleId=localStorage.getItem('roleId');
                if((currUrl[1] == 'threads' && (currUrl[2] == 'view' || (currUrl[2] == 'view-v2' || currUrl[2] == 'view-v3'))))
                {
                  if(data.actionType && (data.actionType=='comment' || data.actionType=='reply'))
                  {

                      console.log(data);
                      var src = '../../assets/sounds/pushalert.wav';
                    var c = document.createElement('audio');
                    c.src = src; c.play();


                  }
                }
                else if(currUrl[1] == 'chat-page')
                {
                  let pushchatType = data.chatType;
                  let pushchatGroupId = data.chatGroupId;
                  if (pushchatType != '' && pushchatGroupId != '')
                  {
                    var src = '../../assets/sounds/pushalert.wav';
                    var c = document.createElement('audio');
                    c.src = src; c.play();
                  }
                }


              }

            }


            this.soundPushFlagUpdate.push(dataInfoId);
            setTimeout(() => {
              this.soundPushFlagUpdate=[];
            },5000);
          }
          if (desktopPush == 1) {
            this.notification.getUserAppNotifications('1');
          }

          if (this.isModalOpen == false) {
            if (this.access == 'chat-page') {
              let pushchatType = data.chatType;
              let pushchatGroupId = data.chatGroupId;
              if (pushchatType != '' && pushchatGroupId != '') {
                let loadedChatType = localStorage.getItem('loadedChatType');
                let loadedchatGroupId = localStorage.getItem('loadedchatGroupId');
                let loadedworkstreamId = localStorage.getItem('loadedworkstreamId');
                if (loadedChatType == '1') {
                  if (loadedworkstreamId != pushchatGroupId) {
                    if (desktopPush == 1) {
                      //$('body').addClass('top-right-notifications-popup');
                      //this.tapnotifications('new');

                      this.sharedSvc.sharePushMessageReceived(data);
                    }
                  }
                }
                if (loadedChatType == '2' || loadedChatType == '3') {
                  if (loadedchatGroupId != pushchatGroupId) {
                    if (desktopPush == 1) {
                      //$('body').addClass('top-right-notifications-popup');
                     // this.tapnotifications('new');

                     this.sharedSvc.sharePushMessageReceived(data);
                    }
                  }
                }
              }
            }
            else {
              if (desktopPush == 1) {
                //$('body').addClass('top-right-notifications-popup');
                //this.tapnotifications('new');
                console.log('docpush1--'+data);
                this.sharedSvc.sharePushMessageReceived(data);
              }
            }

            setTimeout(() => {

              console.log('docpush--'+JSON.stringify(data));

              this.sharedSvc.emitMessageReceived(data);
              this.currentMessage.next(data);
            }, 500);
          }
          else {
            console.log('docpush2--'+data);

            this.sharedSvc.emitMessageReceived(data);
            this.currentMessage.next(data);
          }

          console.log(filter)
          if (!silentPushFlag && access != 'workstreams-page' && (filter != null && filter.length > 0)) {
            let chkWs = filter.workstream.filter(element => groups.includes(element));
            console.log(chkWs, groups)
            silentLoadCount = (chkWs.length > 0) ? silentLoadCount + 1 : silentLoadCount;
            localStorage.setItem(silentCountTxt, silentLoadCount);
          }
          break;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    //console.log(event)
    //console.log(localStorage.getItem('notificationOpened'));
    if (localStorage.getItem('notificationOpened') == null) {
      $('body').removeClass('top-right-notifications-popup');
    }
  }

  /* FCM SETUP */
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);

    // ESC key
    if (event.key == 'Escape') {

      this.displayPosition = false;
      // your logic;
    }
  }

  notifyMe() {
    //Notification.requestPermission();
    this.handlePermission();
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  notifyPopupScreen(position: string) {
    this.position = position;
    this.displayPosition = true;
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
      window.location.reload(true);
    }

  }
  handlePermission() {


    if (Notification.permission == 'denied') {
      this.definedNotifyText = 'Notifications blocked. Please enable them in your browser.';
    }

    return navigator.permissions
      .query({ name: 'notifications' })
      .then(this.permissionQuery)
      .catch(this.permissionError);

  }
  permissionError(Error) {
    console.log(Error);
    return false;
  }

  permissionQuery(result) {
    console.debug({ result });


    var newPrompt;

    if (result.state == 'granted') {
      this.enableDesktopPush = false;
      // notifications allowed, go wild

    } else if (result.state == 'prompt' || result.state == 'default') {
      // we can ask the user
      newPrompt = Notification.requestPermission();

    } else if (result.state == 'denied') {

      this.definedNotifyText = 'Notifications blocked. Please enable them in your browser.';

      alert('Notifications are blocked Please enable it');
      newPrompt = Notification.requestPermission();
      //  newPrompt = Notification.requestPermission();
      // notifications were disabled
    }

    result.onchange = () => console.debug({ updatedPermission: result });

    return newPrompt || result;
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
      'nickName': '',
      'phone': '',
      'personalEmail': '',
      'dialCode': '',
      'countryCode': '',
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
    apiFormData.append('instantPush', type);


    let data = new FormData();
    data.append('apiKey', this.apiData['apiKey']);
    data.append('userId', this.apiData['userId']);
    data.append('domainId', this.apiData['domainId']);
    data.append('type', 'chat');
    data.append('action', 'clear');
    data.append('notificationId', this.notification.activeChatObject.notificationId);
    data.append('postId', this.notification.activeChatObject.postId);
    data.append('threadId', this.notification.activeChatObject.threadId);
    data.append('chatType', this.notification.activeChatObject.chatType);
    data.append('leaveGroup', this.notification.activeChatObject.leaveGroup);
    data.append('chatGroupId', this.notification.activeChatObject.chatGroupId);
    data.append('workStreamId', this.notification.activeChatObject.workStreamId);

    let currUrl = this.router.url.split('/');
    if((currUrl[1] == 'threads' && (currUrl[2] == 'view' || currUrl[2] == 'view-v2' || currUrl[2] == 'view-v3')) || this.notification.activeChatObject.chatType){
    console.log('-------read');
      this.landingpageAPI.readandDeleteNotification(data).subscribe(() => { });
    }

    this.landingpageAPI.Getusernotifications(apiFormData).subscribe((response) => {

      console.log("Getusernotifications", response);

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
        this.notification.totalNotificationcount = totalUnseen;
        this.notification.totalunseenunreadcolor = 'unseenColor';

      }
      else {
        if (totalUnread) {
          this.notification.totalNotificationcount = totalUnread;
          this.notification.totalunseenunreadcolor = 'unreadColor';
        }
        else {
          this.notification.totalNotificationcount = 0;
          this.notification.totalunseenunreadcolor = '';
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
    this.countryId = localStorage.getItem('countryId');
    let userData = {
      'api_key': "dG9wZml4MTIz",
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.loadLogo = true;
      this.roleId = resultData.roleId;
      let urlVal: any = this.router.url;

      if(response.welcomeVideoOption != undefined){
        if(response.welcomeVideoOption  == '0'){
          if(localStorage.getItem('welcomeVideoOptionStorage') != '1'){
            localStorage.setItem('welcomeVideoOptionStorage','1');
            this.welcomeVideoOptionFlag = true;
            let datastr = response.welcomeBannerOption;
            if(datastr!=''){
              let fileType = datastr.fileType.split('/');
              this.loginFileType = fileType[0];
              this.loginImageUrl = datastr.filePath;
            }
          }
        }
      }

      if(response.disclaimerCheckOption != undefined){
        if(response.disclaimerCheckOption == '0'){
          if(localStorage.getItem('disclaimerCheckOptionStorage') != '1'){
            localStorage.setItem('disclaimerCheckOptionStorage','1');            
            let datastr = response.disclaimerText;
            if(datastr!=''){
              let content = '';
              let content1:any;
              content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(datastr));
              content1 = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(content));
              this.disclaimerText = content1;
              this.disclaimerMsgOptionFlag = true;
            }
          }
        }
      }

      this.apiUrl.userName = resultData.username;
      this.apiUrl.profileImage = resultData.profile_image;
      this.apiUrl.LastLogin = resultData.LastLogin != undefined ? resultData.LastLogin : '' ;
      this.apiUrl.userRole = resultData.userRole != undefined ?  resultData.userRole : '' ;

      let automatedSystemMessage = response.automatedSystemMessage != undefined ? response.automatedSystemMessage : '' ;
      localStorage.setItem("automatedSystemMessage", automatedSystemMessage);
      /*if(this.cbaDomain=='3')
      {
        if(this.roleId==3)
        {
          let urlVal: any = this.router.url;
          console.log("urlVal: ", urlVal);
          if(urlVal == '/landing-page' || urlVal == '/workstreams-page' || urlVal == '/threads' || urlVal == '/market-place' || urlVal == '/market-place/training'){
            this.newButtonEnable = true;
          }
          else
          {
            this.newButtonEnable = false;
          }
      }
        else
        {
          if(urlVal=='/threads')
          {
            this.newButtonEnable = true;
          }
          else
          {
            this.newButtonEnable = false;
          }

        }
      }*/

      let cname = localStorage.getItem('countryName');
      this.countryName = localStorage.getItem("allCountryAccess") == "1" ? "Global" : cname ;


     let logoutUser=response.logoutUser;
     if(logoutUser==1)
     {

      setTimeout(() => {
        this.logout();
        this.authenticationService.logout();
      }, 2000);

     }
      if(this.collabticDomain || this.tacDomain || this.mahleDomain){
        if(this.collabticDomain)
        {
          this.platformLogo = response.businessLogo;
          localStorage.setItem('blogo',this.platformLogo);
        }
        /*let rv = response.threadDetailRecentView != undefined ? response.threadDetailRecentView : '0';
        localStorage.setItem("recentThreadsFlag", rv);*/
        let kaoption = response.KACategoryOption == "1" ? "1" : "0";
        localStorage.setItem("KACategoryOption", kaoption);
        if(response.documentViewOption)
        {
          localStorage.setItem("documentViewOption", response.documentViewOption);
        }
        if(response.userWorkstreams)
        {
          localStorage.setItem("userWorkstreams", JSON.stringify(response.userWorkstreams));
        }

        if(response.subscriber)
        {
          localStorage.setItem("subscriber", response.subscriber);
        }

        if(response.storeNo)
        {
          localStorage.setItem("storeNo", response.storeNo);
        }




        let defaultFolderId = response.defaultFolderId;
        if(defaultFolderId)
        {
          localStorage.setItem("defaultFolderId", defaultFolderId);
        }

      }
      let firstLastname = resultData.first_name + ' ' + resultData.last_name;

      this.isVerified = response.isVerified;
      this.popupVerified = response.popupVerified;

      let gtsFlag = response.gtsFlag != undefined ? response.gtsFlag : '1' ;
      let gtsText = response.gtsText != undefined ? response.gtsText : '' ;
      localStorage.setItem('gtsFlag', gtsFlag);
      localStorage.setItem('gtsText', gtsText);

      let ulopt = response.isUserListOPtion != undefined ? response.isUserListOPtion : '1' ;
      localStorage.setItem('isUserListOPtion', ulopt);



      let dvopt = response.documentViewOption != undefined ? response.documentViewOption : '1' ;
      localStorage.setItem('documentViewOption', dvopt);

      let persionalInfoFlag = response.persionalInfoFlag != undefined ? response.persionalInfoFlag : '1' ;
      localStorage.setItem('persionalInfoFlag', persionalInfoFlag);

      let dmfgopt = response.documentMfgIdOption != undefined ? response.documentMfgIdOption : '' ;
      localStorage.setItem('documentMfgIdOption', dmfgopt);

      let docAppPro = response.approveProcessEnabled != undefined ? response.approveProcessEnabled : '0' ;
      localStorage.setItem('approveProcessEnabled', docAppPro);

      let docAppProUpdate = response.documentApproval != undefined ? response.documentApproval : '' ;
      localStorage.setItem('documentApproval', docAppProUpdate);

      let sharedFixAppProUpdate = response.shareFixApproval != undefined ? response.shareFixApproval : '' ;
      localStorage.setItem('shareFixApproval', sharedFixAppProUpdate);

      let threadListView:any = response.listViewThread != undefined ? response.listViewThread : 0;
      let threadViewType = (threadListView == 1) ? 'list' : 'thumb';
      threadViewType =  localStorage.getItem('threadViewType') == null ? threadViewType : localStorage.getItem('threadViewType');
      localStorage.setItem('threadViewType', threadViewType)

      let threadView = response.newThreadDetailSolr != undefined ? response.newThreadDetailSolr : '' ;
      localStorage.setItem('threadView', threadView);

      let techtd = response.defaultTechSupportTeamId != undefined ? response.defaultTechSupportTeamId : '' ;
      localStorage.setItem('defaultTechSupportTeamId', techtd);

      if(response.presetFlag != undefined){
        localStorage.setItem('presetFlag', (response.presetFlag ));
      }

      if(this.mahleDomain && this.domainId == '52'){
        this.kaizenAssigneeRoleId = response.assigneeRoleId;
        localStorage.setItem('kaizenAssigneeRoleId', response.assigneeRoleId);
        localStorage.setItem('kaizenUserType', response.Usertype);
        if(this.access == 'kaizen'){
            if(this.kaizenAssigneeRoleId  == '0' || this.kaizenAssigneeRoleId  == '1' || this.kaizenAssigneeRoleId  == '2'){
              this.newButtonEnable = true;
              this.defaultNewButton = true;
            }
        }
      }

      let newAnnouncementOption = response.newAnnouncementOption;
      localStorage.setItem('newAnnouncementOption', newAnnouncementOption);
      if(response.ssoEnabled)
      {
        let ssoEnabled = response.ssoEnabled;
        localStorage.setItem('ssoEnabled', ssoEnabled);
      }
      if(persionalInfoFlag!=1)
      {
        this.cba90DaysLoginFlag = true;
      }
      if(this.cba90DaysLoginFlag){
        let apiInfo = {
          'apiKey': Constant.ApiKey,
          'userId': this.userId,
          'domainId': this.domainId,
          'countryId': this.countryId,
          'escalationType': 1,
          'nickName': '',
          'countryName': '',
          'firstLastname': '',
          'phone': '',
          'personalEmail': '',
          'dialCode': '',
          'countryCode': '',
          'type': this.notificationType

        }
        this.apiDataInfo = apiInfo;
        this.apiDataInfo['nickName']=resultData.nickName;
        this.apiDataInfo['countryCode']=resultData.country_code;
        this.apiDataInfo['countryName']=resultData.country;
        this.apiDataInfo['personalEmail']=resultData.personalEmail;
        this.apiDataInfo['phone']=resultData.phone;
        this.apiDataInfo['dialCode']=resultData.dialCode;
        let firstLastname = resultData.first_name + ' ' + resultData.last_name;
        this.apiDataInfo['firstLastname']=firstLastname;


        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.add('days-login-popup');
        const modalRef = this.modalService.open(DaysLoginPOPUPComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.data = this.apiDataInfo;
        modalRef.componentInstance.daysLoginResponce.subscribe((receivedService) => {
          if (receivedService) {
            modalRef.dismiss('Cross click');
            this.bodyElem = document.getElementsByTagName('body')[0];
            this.bodyElem.classList.remove('welcomepopupNewSign');
            let msg = "Contact information updated";
            this.cbaloginmsg = [{severity:'success', summary:'', detail:msg}];
            setTimeout(() => {
              this.cbaloginmsg = [];
            }, 3000);
          }
          else{
            return false;
          }
        });
      }

      // collabtic domain check add manager process, other domain no need
      let isprocessCompleted = this.disableManager ? '1' : response.isprocessCompleted;

      this.newBusinessAdmin = isprocessCompleted == '2' && this.collabticDomain ? true : false;
      let newBusinessAdminSignup = localStorage.getItem('newBusinessAdminSignup');
      // tvsib domain check policy popup, other domain no need
      let isPolicyAccepted = (this.tvsIBDomain && this.policyFlag) ? response.isPolicyAccepted : '1';

      if (this.newBusinessAdmin) {
        localStorage.setItem('newBusinessAdminSignup', '1');
        /************************ NEW SIGNUP/BUSINESS ********************** */
        if (this.isVerified == '0') {
          const modalRef = this.modalService.open(VerifyEmailComponent, { backdrop: 'static', keyboard: false, centered: true });
          modalRef.componentInstance.countryId = this.countryId;
          modalRef.componentInstance.domainID = this.domainId;
          modalRef.componentInstance.firstLastname = firstLastname;
          modalRef.componentInstance.email = resultData.email_adress;
          modalRef.componentInstance.stageName = resultData.username;
          modalRef.componentInstance.businessName = resultData.business_name;
          modalRef.componentInstance.subDomainUrl = response.subDomainUrl;
          modalRef.componentInstance.isprocessCompleted = isprocessCompleted;
          modalRef.componentInstance.newSignupAdmin = true;
        }
        else {
          this.bodyElem = document.getElementsByTagName('body')[0];
          this.bodyElem.classList.add('welcomepopup');
          this.bodyElem.classList.add('welcomepopupNewSign');
          const modalRef = this.modalService.open(WelcomeHomeComponent, { backdrop: 'static', keyboard: false, centered: true });
          let apiInfo = {
            'apiKey': Constant.ApiKey,
            'userId': this.userId,
            'domainId': this.domainId,
            'countryId': this.countryId,
            'newAccountSetup': true
          }
          this.apiData = apiInfo;
          modalRef.componentInstance.data = this.apiData;
          modalRef.componentInstance.startedNextResponce.subscribe((receivedService) => {
            if (receivedService) {
              if (receivedService == 'productmatrix') {
                console.log(receivedService);
                let url = "product-matrix";
                window.open(url, url);
              }
              // welcome POPUP
              this.loadGetStartedPOPUP();
            }
          });
        }
        /************************ NEW SIGNUP/BUSINESS ********************** */
      }
      else {
        // policy popup
        if (isPolicyAccepted == '0') {
          this.bodyElem = document.getElementsByTagName('body')[0];
          const modalRef = this.modalService.open(ContentPopupComponent, { backdrop: 'static', keyboard: false, centered: true });
          modalRef.componentInstance.privacyResponce.subscribe((receivedService) => {
            if (receivedService) {
              modalRef.dismiss('Cross click');
              this.bodyElem.classList.remove('auth-bg');
              this.logout();
            }
          });
        }
        else {
          // verification email popup show
          if (this.isVerified == '0') {
            const modalRef = this.modalService.open(VerifyEmailComponent, { backdrop: 'static', keyboard: false, centered: true });
            modalRef.componentInstance.countryId = this.countryId;
            modalRef.componentInstance.domainID = this.domainId;
            modalRef.componentInstance.firstLastname = firstLastname;
            modalRef.componentInstance.email = resultData.email_adress;
            modalRef.componentInstance.stageName = resultData.username;
            modalRef.componentInstance.businessName = '';
            modalRef.componentInstance.subDomainUrl = '';
            modalRef.componentInstance.isprocessCompleted = '';
            modalRef.componentInstance.newSignupAdmin = false;
          }
          else {
            if (Constant.TVSSSO == '1') {
              localStorage.removeItem('employeeType');
              localStorage.removeItem('employeeEmail');
              localStorage.removeItem('employeeId');
              localStorage.removeItem('employeePwd');
              localStorage.removeItem('pageNavAuth');
            }
            // add manager screen display
            if (isprocessCompleted == '0' && newBusinessAdminSignup != '1') {
              this.router.navigate(['landing-page/add-manager']);
            }
            else {
              // administrator approval popup show
              if (response.waitingforApproval == '1') {
                this.bodyElem = document.getElementsByTagName('body')[0];
                this.bodyElem.classList.add('auth');
                this.bodyElem.classList.add('auth-bg');
                const modalRef = this.modalService.open(NonUserComponent, { backdrop: 'static', keyboard: false, centered: true });
                modalRef.componentInstance.okButtonDisable = true;
                modalRef.componentInstance.nonuserResponce.subscribe((receivedService) => {
                  if (receivedService) {
                    modalRef.dismiss('Cross click');
                    this.bodyElem.classList.remove('auth-bg');
                    this.logout();
                  }
                });
              }
              else {
                // welcome POPUP
                this.loadGetStartedPOPUP();
              }
            }
          }
        }

      }

      this.superAdmin = response.superAdmin;
      localStorage.setItem('userProfile', this.apiUrl.profileImage);
      localStorage.setItem('userRole', resultData.userRole);
      localStorage.setItem('roleId', resultData.roleId);
      localStorage.setItem('isMobileTech', resultData.isMobileTechnician);


      localStorage.setItem('nestedReplyEnabled', response.nestedReplyEnabled);
      localStorage.setItem('firstLastName', firstLastname);
      localStorage.setItem('firstName', resultData.first_name);
      localStorage.setItem('userRoleType', resultData.userRoleType);
      localStorage.setItem('businessRole', resultData.businessRole);
      localStorage.setItem('defaultWorkstream', response.defaultWorkstream);
      localStorage.setItem('defaultLanguage', JSON.stringify(response.defaultLanguage));
      localStorage.setItem('expiryDateFormat', response.expiryDateFormat);
      localStorage.setItem('industryType', response.displayType);
      localStorage.setItem('dealerCode', response.dealerCode);
      // alert(JSON.stringify(response.countryInfo));
      localStorage.setItem('countryInfo', JSON.stringify(response.countryInfo));
      if(response.domainCountryInfo)
      {
        localStorage.setItem('domainCountryInfo', JSON.stringify(response.domainCountryInfo));

      }
      if (response.displayType == 3 && this.domainId == 52) {
        localStorage.setItem('partsQuantity', JSON.stringify(response.partsQuantity));
      }

      /*let deLang = {
        default: 1,
        id: 1,
        languageCode: "en",
        name: "English"
      }*/

      let ul = isEmpty(response.userLanguage) ? '' : response.userLanguage;
      if(ul != ''){
        localStorage.setItem('translateLanguage', JSON.stringify(response.userLanguage));
      }

      localStorage.setItem('uploadMaxSize', response.uploadMaxSize);
      localStorage.setItem('uploadMaxSizeText', response.uploadMaxSizeText);
      localStorage.setItem('uploadMaxSizeText', response.uploadMaxSizeText);
      localStorage.setItem('partsStatusInfo', JSON.stringify(response.partsStatusInfo));
      if(response.techSupportChartsTabs!=undefined){
        localStorage.setItem('techSupportChartsTabs', JSON.stringify(response.techSupportChartsTabs));
      }

      this.user.roleId = resultData.roleId;
      this.user.newAnnouncementOption =response.newAnnouncementOption;
      this.authenticationService.UserSuccessData(this.user);

      /*if(resultData.escTechUsers.length>0)
      {
        localStorage.setItem('escTechUsers',JSON.stringify(resultData.escTechUsers));

      }

      if(resultData.escCSMUsers.length>0)
      {
        localStorage.setItem('escCSMUsers',JSON.stringify(resultData.escCSMUsers));

      }*/

      localStorage.setItem('historyAvailable', resultData.historyAvailable);
      localStorage.setItem('superAdmin', this.superAdmin);

      let defaultEscalation = response.defaultEscalation != undefined ? response.defaultEscalation : '';
      localStorage.setItem('defaultEscalation', defaultEscalation);

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

      this.notification.apiData = apiInfo;
      this.notification.getUserAppNotifications('');
    });
  }
  UpdateCheckBox(type){
    
    let flag = '';
    if(type == 'disclaimer'){    
      flag = this.landingWelcomeMsgFlag ? '1' : '0';
    }
    else{
      flag = this.landingWelcomeVideoFlag ? '1' : '0';
    }
    var apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    if(type == 'disclaimer'){
      apiFormData.append('disclaimerCheckOption', flag);      
    }
    else{
      apiFormData.append('welcomeVideoOption', flag);
    }
    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe((response) => {
      console.log(response);
    });

  }
  

  closeWelcomeMessagePOPUP(){
    this.welcomeVideoOptionFlag = false;
    this.displayWelcomeMessage = false;
    this.loadGetStartedPOPUP();
  }

  closeDisclaimerMessagePOPUP(){
    this.disclaimerMsgOptionFlag = false;
    this.disclaimerMessage = false;
    this.loadGetStartedPOPUP();
  }

  loadGetStartedPOPUP() {
    let urlVal = this.router.url;
    console.log(urlVal);
    // welcome popup show
    if (urlVal == '/landing-page') {

      if(this.welcomeVideoOptionFlag){
        this.displayWelcomeMessage = true;
        return false;
      }

      if(this.disclaimerMsgOptionFlag){
        this.disclaimerMessage = true;
        return false;
      }


      if (this.popupVerified == '0') {
        localStorage.setItem('welcomePopupDisplay', '0');
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.add('welcomepopup');
        const modalRef = this.modalService.open(WelcomeHomeComponent, { backdrop: 'static', keyboard: false, centered: true });
        let apiInfo = {
          'apiKey': Constant.ApiKey,
          'userId': this.userId,
          'domainId': this.domainId,
          'countryId': this.countryId
        }
        this.apiData = apiInfo;
        modalRef.componentInstance.data = this.apiData;
        modalRef.componentInstance.startedNextResponce.subscribe((receivedService) => {
          if (receivedService) {
            this.bodyElem.classList.remove('welcomepopup');
            modalRef.dismiss('Cross click');
            let data = {
              welcomePopupDisplay: '1'
            }
            console.log(data);
            this.sharedSvc.emitWelcomeContentView(data);
            console.log(data);
          }
        });
      }
      else {
        // welcome popup displayed
        console.log("no welcome popup");
        localStorage.setItem('welcomePopupDisplay', '1');
      }
    }
  }
  onSubmit() {
    this.searchForm.value.search_keyword = this.searchVal;
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      if(this.access == 'directory' || this.access == 'announcement' || this.access == 'usermanagement' || this.access == 'escalation-product' || this.access == 'productList' || this.access == 'gtsList' || this.access=='headquarters' || this.access == 'customers' || this.access == 'media' || this.access == 'escalation' || this.access == 'ppfr' || this.access == 'dtc' || this.access == 'repairorder' || this.access == 'jobs-ratecard' || this.access == 'techsupportrules' || this.access == 'techsupportteam'){
        this.submitSearch();
      }
      else{
        if(!this.submitSearch) {
          this.submitSearch();
        }
      }
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    let searchLen = searchValue.length;
    if (searchLen == 0) {
      this.submitted = false;
      this.clearSearch();
      /*
      if(this.access != 'standard-report') {
        this.clearSearch();
      }
      */
    }
  }

  closeWindowHeader() {
    if(this.access == 'docpreview'){
      let dNavUrl = localStorage.getItem('dNavUrl');
      dNavUrl = (dNavUrl != null) ? dNavUrl : dNavUrl;
      if(dNavUrl == 'documents'){
        let title = localStorage.getItem('platformName');
        let titleIndex = pageTitle.findIndex(option => option.slug == dNavUrl);
        title = `${title} - ${pageTitle[titleIndex].name}`;
        this.titleService.setTitle(title);
      }
      history.pushState(null, null, "/"+dNavUrl);
      history.pushState(null, null, "/documents");
      setTimeout(() => {
        this.location.back();
      }, 10);
    }
    else{
      localStorage.removeItem('searchQSVal');
      localStorage.removeItem('searchparamQSVal');
      localStorage.removeItem('searchPageFilter');
      this.sharedSvc.emitSearchEmptyValuetoHeader("");
      this.apiUrl.searchPageRedirectFlag = "1";
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove('knowledge-base');
      this.bodyElem.classList.remove('search-page');
      let timeout = 800;
      let aurl = 'threads';
      let sNavUrl = localStorage.getItem('sNavUrl');
      aurl = (sNavUrl != null) ? sNavUrl : aurl;

      // title
      let url = aurl.split('/');
      let url1 = url[0];
      let curl = this.router.url.split('/');
      if(curl[1] == RedirectionPage.Profile) {
        localStorage.removeItem('tapProfile');
        let title1 = localStorage.getItem('platformName');
        let sNavUrl = localStorage.getItem('pNavUrl');
        aurl = (sNavUrl != null) ? sNavUrl : aurl;
        if(aurl == 'directory'){
          let title2 = " - Directory";
          let title = title1+title2;
          this.titleService.setTitle(title);
        }
        else{
          let title2 = " - Workstream";
          let title = title1+title2;
          this.titleService.setTitle(title);
        }
      }
      else{
        if(url1 == 'announcements'){
          let title1 = localStorage.getItem('platformName');
          let title2 = "";
          let url2 = url[1];
          if(url2 == 'dismissed'){
            title2 = 'Dismissed Announcements';
          }
          else{
            title2 = 'Announcements';
          }
          let title = title1+title2;
          this.titleService.setTitle(title);
        }
        else if(url1 == 'profile'){
          let title1 = localStorage.getItem('platformName');
          let title2 = " - Profile";
          let title = title1+title2;
          this.titleService.setTitle(title);
        }
        else if(url1 == 'documents'){
          this.apiUrl.searchPageDocRedirectFlag = "1";
          this.apiUrl.searchPageDocPageRedirectFlag = "1";
          timeout = 1500;
          localStorage.setItem('documents-router', 'true');
          let daction = 'destroy';
	        this.search.emit(daction);
        } else if(url1 == 'parts') {
          this.apiUrl.searchPagePartRedirectFlag = "1";
          this.apiUrl.searchPagePartPageRedirectFlag = "1";
          timeout = 1500;
          localStorage.setItem(RouterText.Parts, 'true');
          let daction = 'destroy';
	        this.search.emit(daction);
        }
        else{
          let title = localStorage.getItem('platformName');
          let titleIndex = pageTitle.findIndex(option => option.slug == aurl);
          title = `${title} - ${pageTitle[titleIndex].name}`;
          this.titleService.setTitle(title);
        }
        timeout = (url1 == RedirectionPage.Search) ? 0 : timeout;
      }
    //  localStorage.setItem('documents-`router`', 'true');

      setTimeout(() => {

        this.navigation.back();
        this.sharedSvc.emitCloseSearchCallData(url1);

      }, timeout);
    }
  }

  // Submit Search
  submitSearch(itemData = []) {
    if (this.searchVal && (this.access == 'threads' || this.access == 'sib' || this.access == 'documents' || this.access == 'knowledgeArticles' || this.access == 'parts' || this.access == 'landingpage' || this.access == 'announcement' || this.access == 'workstreams-page' || this.access == 'market-place' || this.access == 'standard-report' || this.access == 'adas')) {
      let navFlag = true;
      this.apiUrl.searchFromPageNameClose = true;
      switch(this.access){
        case 'sib':
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '16');
          this.sharedSvc.setSearchPageLocalStorage(this.access, "");
        break;
        case 'parts':
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '11');
          this.sharedSvc.setSearchPageLocalStorage(this.access, "");
          let saction = 'destroy';
	        this.search.emit(saction);
        break;
        case 'documents':
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '4');
          this.sharedSvc.setSearchPageLocalStorage(this.access, "");
          let daction = 'destroy';
	        this.search.emit(daction);
        break;
        case 'knowledgeArticles':
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '7');
          this.sharedSvc.setSearchPageLocalStorage('knowledgearticles', "");
        break;
        case 'landingpage':
          let currentContentType = localStorage.getItem('currentContentType');
          let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
          console.log(navFrom, currentContentType, this.collabticDomain, this.tvsIBDomain, this.tvsDomain, this.industryType.id)
          if(this.searchVal && this.collabticFixes) {
            this.updateSearchKeyword(this.searchVal);
          }
          if(navFrom == RedirectionPage.Workstream && ((this.collabticDomain || this.domainId==82) || (this.cbaDomain && this.tvsDomain  && !this.tvsIBDomain))) {
            if(this.collabticFixes) {
              localStorage.setItem('searchValue', this.searchVal);
              localStorage.setItem('currentContentType', currentContentType);
            }
            this.searchBgFlag = true;
            this.acResults = [];
            this.autocomplete.hide();
            if(this.autoSearchApiCall) {
              this.autoSearchApiCall.unsubscribe();
            }
            this.apiUrl.searchFromWorkstream = true;
            this.apiUrl.searchFromWorkstreamValue = this.searchVal;
            navFlag = false;
            let wdata = {
              action: 'search',
              searchVal: this.searchVal,
              contentTypeId: parseInt(currentContentType)
            };
            this.search.emit(wdata);
          } else if(navFrom == RedirectionPage.Workstream && (this.tvsDomain || this.domainId==82))  {
            localStorage.setItem('searchValue', this.searchVal);
            localStorage.setItem('currentContentType', currentContentType);
            this.sharedSvc.setSearchPageLocalStorage(navFrom, "");
          } else {
            localStorage.setItem('searchValue', this.searchVal);
            if(!currentContentType) {
              localStorage.setItem('currentContentType', '2');
            }
            this.search.emit(this.searchVal);
            let urll = this.router.url.split('/');
            this.sharedSvc.setSearchPageLocalStorage(urll[1], '');
          }
          break;
        case 'announcement':
            let url = this.router.url.split('/');
            let url1 = url[1];
            let url2 = url[2] == undefined ? '' : "/"+url[2];
            let urlVal = url1 + url2;
            localStorage.setItem('searchValue', this.searchVal);
            localStorage.setItem('currentContentType', '2');
            this.sharedSvc.setSearchPageLocalStorage(urlVal, '');
        break;
        case 'threads':
          this.apiUrl.searchPageRedirectFlag = "1";
          let data = {
            navPage: this.access,
            searchVal: this.searchVal
          }
          localStorage.removeItem('searchPageFilter');
          this.sharedSvc.emitSearchInfoData(data);
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '2');
          break;
        case 'market-place':
          this.apiUrl.searchPageRedirectFlag = "1";
          let marketPlacedata = {
            navPage: this.access,
            searchVal: this.searchVal
          }
          this.sharedSvc.emitSearchInfoData(marketPlacedata);
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '44');
          break;
        case 'standard-report':
        case 'adas':
          navFlag = false;
          this.searchBgFlag = true;
          let itemFlag = Array.isArray(itemData) ? false : true;
          let sdata = {
            action: 'search',
            searchVal: this.searchVal,
            item: itemData,
            itemFlag
          };
          if(this.access == 'adas') {
            localStorage.setItem('searchValue', this.searchVal);
          }
          this.search.emit(sdata);
          break;
        default:
          break;
      }

      if(navFlag) {
        localStorage.setItem('search-router', 'true');
        //this.search.emit(this.searchVal);
        setTimeout(() => {
          var aurl = 'search-page';
          //clear field
          this.submitted = false;
          this.searchVal = '';
          this.searchTick = false;
          this.searchClose = this.searchTick;
          this.searchBgFlag = false;
          this.searchImg = `${this.assetPath}/search-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close.png`;
          //window.location.replace(aurl).focus();
          //localStorage.setItem('search-router', 'true');
          this.router.navigate([aurl]);
        }, 600);
      }
    }
    else if (this.access == 'ppfr') {
      localStorage.setItem('escalationPPFRSearch', this.searchVal);
      this.searchBgFlag = true;
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.search.emit(this.searchVal);

    } else if (this.searchVal && this.access == 'search' || this.access == 'escalation-product') {
      this.searchBgFlag = true;
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.search.emit(this.searchVal);
    }

    else{
      this.search.emit(this.searchVal);
    }



  }

  // Clear Search
  clearSearchValue() {
    this.acResults = [];
    this.autocomplete.hide();
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
  }

  // Clear Search
  clearSearch() {
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    console.log(this.access)

    switch(this.access) {
      case 'standard-report':
      case 'adas':  
        let itemFlag = false;
        let sdata = {
          action: 'search',
          searchVal: this.searchVal,
          item: [],
          itemFlag
        };
        this.search.emit(sdata);
        break;
      case 'landingpage':
        let currentContentType = localStorage.getItem('currentContentType');
        let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
        console.log(navFrom, currentContentType)
        if(navFrom == RedirectionPage.Workstream && (this.collabticDomain || this.cbaDomain)) {
          this.searchBgFlag = false;
          if(this.apiUrl.searchFromWorkstream) {
            this.apiUrl.searchFromWorkstream = false;
            this.apiUrl.searchFromWorkstreamValue = this.searchVal;
            let wdata = {
              action: 'search',
              searchVal: this.searchVal,
              contentTypeId: parseInt(currentContentType)
            };
            this.search.emit(wdata);
          }
        } else {
          this.search.emit(sdata);
        }
        break;
      default:
        this.search.emit(this.searchVal);
        break;
    }
    localStorage.removeItem('loadMenuPageName');
    localStorage.removeItem('searchValue');
    localStorage.removeItem('escalationPPFRSearch');
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
  //this.closeWindowHeader();
  }

  // Change Password
  changePassword() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Change Password';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = [];
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      //console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;
      msgModalRef.componentInstance.type = 'password';
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.logout();
      }, 3000);
    });
  }


  logout() {

   this.requestPermission(0);
    this.requestActivePageAccess(0);

  }

  tapfrompopup(Item) {
    if (Item == 1) {
      var aurl = forumPageAccess.profilePage + this.userId;

      window.open(aurl, '_blank');
    }
    if (Item == 2) {
      aurl = forumPageAccess.configurationNotifyPage;

      window.open(aurl, '_blank');
    }
    if (Item == 3) {
      aurl = forumPageAccess.dashboardPage;

      window.open(aurl, '_blank');
    }
  }

  // recentVins
  recentVins() {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      access: 'newthread'
    };
    let inputData = {
      baseApiUrl: Constant.CollabticApiUrl,
      apiUrl: Constant.CollabticApiUrl + "/" + Constant.getRecentVins,
      field: "vinNo",
      selectionType: "single",
      filteredItems: "",
      filteredLists: "",
      actionApiName: "",
      actionQueryValues: "",
      title: "Recent VINs"
    };
    const modalRef = this.modalService.open(ManageListComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.access = "newthread";
    modalRef.componentInstance.filteredTags = "";
    modalRef.componentInstance.filteredLists = "";
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService);
      modalRef.dismiss('Cross click');
    });
  }

  // selectContent
  selectLanguage() {
    let users = '';
    let apiData = {
      api_key: Constant.ApiKey,
      user_id: this.userId,
      domain_id: this.domainId,
      countryId: this.countryId
    };
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.access = 'profile';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = windowHeight.height;
    modalRef.componentInstance.action = 'new';
    modalRef.componentInstance.selectedUsers = users;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      console.log(receivedService);
      if (!receivedService.empty) {
        let langData = receivedService;
        console.log(langData.langId);
        console.log(langData.langName);
        this.languageId = langData.langId;
        this.languageName = langData.langName;
        localStorage.setItem('languageId', this.languageId);
        localStorage.setItem('languageName', this.languageName);
      }
      modalRef.dismiss('Cross click');
    });
  }

  close() {
    this.searchVal = '';
    //this.bodyElem.classList.remove(this.bodyClass);
    this.activeModal.dismiss('Cross click');
  }


     // On FileSelected
     changeBusinessLogo(){
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);

      const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.domainId = this.domainId;
      modalRef.componentInstance.type = "Edit";
      modalRef.componentInstance.profileType = "businessProfile";
      modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
        if (receivedService) {
          //console.log(receivedService);
          this.bodyElem = document.getElementsByTagName('body')[0];
          if(this.access != 'profile' ){
            this.bodyElem.classList.remove(this.bodyClass);
            this.bodyElem.classList.remove(this.bodyClass1);
          }
          modalRef.dismiss('Cross click');
          this.platformLogo = receivedService.show;
        }
      });
    }

    acSearch(event) {
      let typeId: any;
      let reportFlag = '';
      let flag = true;
      console.log(this.access)
      switch (this.access) {
        case 'threads':
          typeId = SolrContentTypeValues.Thread;
          break;
        case 'documents':
          typeId = SolrContentTypeValues.Documents;
          break;
        case 'knowledgeArticles':
          typeId = SolrContentTypeValues.KnowledgeArticles;
          break;
        case 'standard-report':
          reportFlag = 'report';
          typeId = SolrContentTypeValues.StandardReports;
          break;
        case 'parts':
          typeId = SolrContentTypeValues.Parts;
          break;
        case 'adas':
          typeId = SolrContentTypeValues.AdasProcedure;
          break;
        default:
          typeId = "";
          let currUrl = this.router.url.replace('/', '');

          let  currentContentType:any = localStorage.getItem('currentContentType');
          if(currentContentType && currUrl != 'landing-page') {
            switch (currentContentType) {
              case 2:
                typeId="1";  
                break;
              case 4:
                typeId="2";
                break;
              case 7:
                typeId="6";
                break;
              case 11:
                typeId="4";
                break;
              case 53:
                typeId="8";
                break;
            }
          }
          /* let currentContentType:any = localStorage.getItem('currentContentType');
          switch(parseInt(currentContentType)) {
            case 2:
            case 4:
            case 7:
              flag = true;
              break;
            default:
              flag = false;
              break;
          } */
          break;
      }
      if(flag) {
        let data = {
          'query': event.query,
          'domainId': this.domainId,
          'type': typeId

        }
        if(this.access == 'standard-report') {
          data['reportWorsktream'] = this.reportWs;
        }
        else {
          let userWorkstreams=localStorage.getItem('userWorkstreams');
          let platformId=localStorage.getItem('platformId');
          let approvalProcessArr;
          if(platformId=='1' && (typeId==1 || typeId==2 || typeId==4 || typeId==6 || typeId==''))
          {
          approvalProcessArr=["0","1"];
          }
          else
          {
            approvalProcessArr='';
          }


          data["approvalProcess"] = JSON.stringify(approvalProcessArr);
          if(userWorkstreams) {
            data["workstreamsIds"]=userWorkstreams;

          }
        }
        let currentSearchVal = event.query;
        console.log(currentSearchVal);
        this.autoSearchApiCall = this.landingpageAPI.getSolrSuggDetail(reportFlag, data).subscribe((response) => {
          console.log(response);
          this.acResults = [];
          if(!this.submitted) {
            this.acResults = response;
            this.acResults.forEach((item, index) => {
              let ctype = parseInt(item['type']);
              if(ctype == 8) {
                item['make'] = item['make'].replace(/'/g, '"');
                item['model'] = item['model'].replace(/'/g, '"');
                this.acResults[index]['make'] = JSON.parse(item['make']);
                this.acResults[index]['model'] = JSON.parse(item['model']);
              }
            });
          } else {
            this.autocomplete.hide();
          }
        });
      }
    }
    newPage(){
      let url = "";
      switch(this.access){
        case 'headquarters':
          this.sharedSvc.emitNewButtonHeaderCallData('addnew');
          break;
        case 'repairorder':
        case 'jobs-ratecard':
            this.sharedSvc.emitNewButtonHeaderCallData(this.access);
            break;
        case 'techsupportrules':
        case 'techsupportteam':
          this.sharedSvc.emitNewButtonHeaderCallData('addnew');
          break;
        case 'gtsList':
          this.sharedSvc.emitNewButtonHeaderCallData('addnew');
          break;          
        case 'kaizen':
          url = "/kaizen/manage";
         // window.open(url,url);
          window.open(url, '_blank');
          break;
        case 'threads':
          url = "/threads/manage";
          if(this.apiUrl.enableAccessLevel){
            this.addNewContentPage('2',url);
          }
          else{
            window.open(url, '_blank');
          }
          break;
        case 'parts':
          url = "/parts/manage";
          if(this.apiUrl.enableAccessLevel){
            this.addNewContentPage('11',url);
          }
          else{
            window.open(url, '_blank');
          }
          break;
        case 'standard-report':
          let actionData = {
            action: 'new',
            searchVal: this.searchVal,
            item: [],
            itemFlag: false
          };
          let emitFlag = false;
          this.authenticationService.checkAccess(ContentTypeValues.StandardReports,'Create',true,true);
          setTimeout(() => {
            if(this.authenticationService.checkAccessVal){
              emitFlag = true;
            }
            else if(!this.authenticationService.checkAccessVal){
              // no access
            }
            else{
              emitFlag = true;
            }
            if(emitFlag)
              this.search.emit(actionData);
          }, 550);
          break;
        case 'faq':
          let factionData = {
            action: 'new',
            searchVal: this.searchVal
          };
          this.search.emit(factionData);
          break;
        case 'adas':
          let aadasEmitFlag = false;
          this.authenticationService.checkAccess(ContentTypeValues.AdasProcedure,'Create',true,true);
          setTimeout(() => {
            if(this.authenticationService.checkAccessVal){
              aadasEmitFlag = true;
            }
            else if(!this.authenticationService.checkAccessVal){
              // no access
            }
            else{
              aadasEmitFlag = true;
            }
            if(aadasEmitFlag) {
              url = `${RedirectionPage.AdasProcedure}/manage`;
              window.open(url, '_blank');
            }
          }, 500);
          break;
        default:
          break;
      }
    }
    onSearchSubmit(event) {
      //event.query = current value in input field
      console.log(event);
      console.log(this.searchVal);
      this.submitSearch();
    }
    goToDetailPage(item, id, type,domainId){
      console.log(item)
      switch(this.access) {
        case 'standard-report':
          this.onSearchChange(item.term);
          setTimeout(() => {
            this.submitSearch(item);
          }, 50);
          break;
        default:
          this.clearSearchValue();
          type = parseInt(type);
          let aurl = '', wsFlag: any, scrollTop:any = 0, navFlag = false;
          let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
          switch (type) {
            case 1:
              let newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
              let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
              let view = (newThreadView) ? viewPath : forumPageAccess.threadpageNew;
              if(this.subscriberDomain)
              {
                aurl = `${view}${id}/${domainId}`;
              }
              else
              {
                aurl = `${view}${id}`;
              }

              wsFlag = (navFrom == ' threads') ? false : true;
              this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
              if(this.apiUrl.enableAccessLevel){
                this.authenticationService.checkAccess(ContentTypeValues.Threads,'View',true,true);
                setTimeout(() => {
                  if(this.authenticationService.checkAccessVal){
                    this.router.navigate([aurl]);
                  }
                  else if(!this.authenticationService.checkAccessVal){
                    // no access
                  }
                  else{
                    this.router.navigate([aurl]);
                  }
                }, 550);
              }
              else{
                this.router.navigate([aurl]);
              }
              break;
            case 2:
              this.authenticationService.openPOPUPDetailView(4,id);
              /*wsFlag = (navFrom == ' documents') ? false : true;
              localStorage.setItem('docId', id);
              //localStorage.setItem('docIddetail', id);
              localStorage.setItem('docInfoNav', 'true');
              this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
              aurl = forumPageAccess.documentViewPage + id;
              setTimeout(() => {
                this.sharedSvc.emitRightPanelOpenCallData(true);
              }, 100);
              navFlag = true;*/
              break;
            case 4:
              wsFlag = (navFrom == ' parts') ? false : true;
              this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
              aurl = forumPageAccess.partsViewPage + id;
              navFlag = true;
              setTimeout(() => {
                this.sharedSvc.emitRightPanelOpenCallData(true);
              }, 100);
              break;
            case 6:
              this.authenticationService.openPOPUPDetailView(7,id);
              /*navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
              wsFlag = (navFrom == ' knowledgearticles') ? false : true;
              scrollTop = 0;
              this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
              aurl = forumPageAccess.knowledgeArticlePageNew + id;
              navFlag = true;
              setTimeout(() => {
                this.sharedSvc.emitRightPanelOpenCallData(true);
              }, 100);*/
              break;
            case 8:
              navFlag = false;;
              wsFlag = (navFrom == 'adas-procedure') ? false : true;
              this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
              aurl = `${forumPageAccess.adasProcedurePage}${id}`;
              window.open(aurl, aurl);
              break;
          }
          if(navFlag) {
            setTimeout(() => {
              this.router.navigate([aurl]);
            }, 1);
          }
      }
    }

    getHeaderMenuItems() {
      this.countryId = localStorage.getItem('countryId');

      if (this.access == 'market-place-settings' || this.access == 'market-place-policies') {
        this.items = [
          {
            label: 'NEW',
            items: [
              {
                styleClass: '',
                label: 'Training',
                title: "",
                command: () => { let aurl = "/market-place/manage";
                window.open(aurl, '_blank')},
                icon: 'custom-icon-training'
              },
              {
                styleClass: '',
                label: 'Manual',
                title: "",
                command: () => { let aurl = "/market-place/manage-manual";
                window.open(aurl, '_blank')},
                icon: 'custom-icon-manual'
              },
              {
                styleClass: '',
                label: 'Policy',
                title: "",
                command: () => {
                  if (this.access == 'market-place-policies') {
                    this.policyPopup.emit(true);
                  }
                  else {
                    let aurl = "/market-place/policies?isNew=true";
                    window.open(aurl, '_blank')
                  }
                },
                icon: 'custom-icon-policy'
              },
            ]
          }
        ];
      }
      // else if (this.access == 'market-place-cart'){}
      else {
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      this.landingpageAPI.getContentTypeList(apiFormData).subscribe((response) => {
        let resultData = response.items;
        let data1 = [];
        let data2 = [];
        let submenu;
        let docMenu = [];
        let menu;

        if(resultData.length>0){
          this.itemsEmptyRecord = false;
          for(let rd in resultData) {
            let options = resultData[rd].options;
            data2=[];
            let menunametext = resultData[rd].name.toLowerCase();
            menunametext = menunametext.replace(" ","");
            if(options != ''){
              for(let oprd in options) {
                let submenunametext = options[oprd].name.toLowerCase();
                let submenuurl = "/"+options[oprd].url;
                submenunametext = submenunametext.replace(" ","");
                submenu = {
                  label: options[oprd].name,
                  title: "",
                  command: () => this.addNewContentPage(resultData[rd].id,submenuurl),
                  icon: 'custom-icon-'+submenunametext
                };
                data2.push(submenu);
                if(menunametext == 'techinfo' || menunametext == 'documents' || menunametext == 'documentation') {
                  docMenu.push(submenu);
                }
              }
            }
            if(menunametext == 'techinfo' || menunametext == 'documents' || menunametext == 'documentation'){
              menu = {
                label: resultData[rd].name,
                title:"",
                items: data2,
                icon: 'custom-icon-'+menunametext
              };
            }
            else{
              let menunametextId = resultData[rd].id;
              let menuurl = "/"+resultData[rd].url;
              let menuClass = (this.access == 'documents') ? 'hide' : '';
              if(menunametextId == '2' && this.apiUrl.enableAccessLevel){
                menuurl = "/threads/manage";
                menu = {
                  styleClass: menuClass,
                  label: resultData[rd].name,
                  title: "",
                  command: () => this.addNewContentPage(menunametextId,menuurl),
                  icon: 'custom-icon-'+menunametext
                }
              }
              else{
                menu = {
                  styleClass: menuClass,
                  label: resultData[rd].name,
                  title: "",
                  command: () => this.addNewContentPage(menunametextId,menuurl),
                  icon: 'custom-icon-'+menunametext
                }
              }
            }
            console.log(menu)
            if(this.access != 'documents') {
              data1.push(menu);
            }
          }

          let cfolder;
          cfolder = {
            label: "Create new folder",
            title: "",
            command: () => this.addNewFolderDoc(),
            icon: 'custom-icon-folder'
          };
          docMenu.push(cfolder);
          console.log(docMenu);

          let itemData = (this.access == 'documents') ? docMenu : data1;
          this.items = [
            {
              label: 'NEW',
              items: itemData
            }
          ];
        }
        else{
          this.itemsEmptyRecord = true;
          this.items = [
            {
              label: 'NEW'
            }
          ];
        }
      });
      }
    }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    //console.log(event);
    let removeClass = 'top-right-notifications-popup';
    if (document.body.classList.contains(removeClass)) {
      document.body.classList.remove(removeClass);
    }
    this.close();
  }

  addNewContentPage(id,url){
    if(id == '6' && localStorage.getItem('gtsFlag') == '0'){
      this.gtsText = localStorage.getItem('gtsText');
      this.displayGTSModal = true;
    }
    else{
        if(this.domainId=='52')
        {
          window.open(url, '_blank');
        }
        else
        {


        this.authenticationService.checkAccess(id,'Create',true,true);
        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
          // window.open(url, url);
            window.open(url, '_blank');
          }
          else if(!this.authenticationService.checkAccessVal){
          // no access
          }
          else{
          // window.open(url, url);
            window.open(url, '_blank');
          }
        }, 550);
      }
    }
  }

  addNewFolderDoc(){
    this.authenticationService.checkAccess(4,'Folder',true,true);
    setTimeout(() => {
      if(this.authenticationService.checkAccessVal){
        let data = {
          action: 'folder',
          access: 'documents'
        }
        this.sharedSvc.emitDocumentNewFolder(data);
      }
      else if(!this.authenticationService.checkAccessVal){
       // no access
      }
      else{
        let data = {
          action: 'folder',
          access: 'documents'
        }
        this.sharedSvc.emitDocumentNewFolder(data);
      }
    }, 550);

  }

  addNewMarketPlacePage(){
    // this.authenticationService.checkAccess('Market-place','Create');
    // setTimeout(() => {
      // if(this.authenticationService.checkAccessVal){
    let aurl = "/market-place/manage";
    window.open(aurl, aurl);
    //   }
    //   else{
    //     // no access
    //   }
    // }, 650);
  }
  addNewManualPage(){
    let aurl = "/market-place/manage-manual";
    window.open(aurl, aurl);
  }

  checkThreadAccess(){
    let rolesData = JSON.parse(localStorage.getItem("param"));
    if(rolesData){
      let filtered = rolesData.items.find(
        (item) => item.contentTypeId == "2"
      );
      if (filtered !== undefined) {
        let newFiltered = filtered?.pageAccess.find(
        (item) => item.name == "Create"
        );
        let permission = newFiltered?.roles?.find(
        (role) => role.id == this.roleId
        );
        this.apiUrl.newThreadAccessLevel = permission?.access;
      }
    }
    else {
      this.apiUrl.newThreadAccessLevel = 1;
    }
  }

  initSearch() {
    this.searchVal = '';
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
  }

  profileLinkNav(type) {
    let url = '';
    if(type == 'system-settings'){
      url='system-settings/messages';
    }
    if(type == 'user-settings'){
      url='user-settings';
    }
    let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
    let wsFlag: any = true;
    let scrollTop:any = '0';
    this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    this.router.navigate([url]);
  }

  getCart(updateCart = false) {
    let cartId = this.cart?.cartId || localStorage.getItem('adminCartId');
    if (cartId) {
      this.threadApi.getCart({ cartId: cartId }).subscribe((resp) => {
        this.setCart(resp.data, updateCart);
        this.sharedSvc.cartProductsList.next({
          domainId: (resp.data?.trainings[0]?.domainID || resp.data?.manuals[0]?.domainID), trainingIds: resp.data?.trainingIds?.split(','), manualIds: resp.data?.manualIds?.split(',')
        });
      })
    }
    else {
      this.cart = this.defaultCart;
    }
  }

  removeTraining() {
    const itemId = this.cart.trainings[this.removeTrainingIndex].id;
    this.removeCartItem = { itemId: itemId, itemType: 'training' };
    this.removeTrainingIndex = null;
    // this.cart.trainings.splice(index, 1);
    this.trainingpopup = false;
    this.updateCart();
  }

  removeTrainingPopup(index:number) {
    this.removeTrainingIndex = index;
    this.trainingpopup = true;

  }
  removeManualPopup(index:number) {
    this.removeManualIndex = index;
    this.manualpopup = true;

  }
  removeManual() {
    const itemId = this.cart.manuals[this.removeManualIndex].id;
    this.removeCartItem = { itemId: itemId, itemType: 'manual' };
    this.removeManualIndex = null;
    this.manualpopup = false;
    // this.cart.manuals?.splice(index, 1);
    this.updateCart();
  }

  clearCart() {
    this.openCartClearPopup = false
    this.threadApi.emptyCart({cartId: this.cart?.cartId}).subscribe((res) => {
      this.sharedSvc.cartUpdateSubject.next(null);
    }, (error: any) => {
      console.error("error: ", error);
    })
  }

  updateCart() {
    this.threadApi.updateCartItemsWithDetails({cartId: this.cart?.cartId,  ...this.removeCartItem}).subscribe((resp: any) => {
      // this.setCart(resp?.data);
      this.sharedSvc.cartUpdateSubject.next(resp.data);
    }, (error: any) => {
      console.error("error: ", error);
    });
  }

  setCart(data, updatecart = false) {
    this.cart = {
      cartId: data?.id,
      email: data?.email,
      trainingIds: data?.trainingIds ? data?.trainingIds.split(',') : [],
      manualIds: data?.manualIds ? data?.manualIds.split(',') : [],
      phoneNumber: {
        countryCode: data?.countryCode,
        dialCode: data?.dialCode,
        e164Number: data?.e164Number,
        internationalNumber: data?.internationalNumber,
        phoneNumber: data?.phoneNumber,
      },
      totalAmount: 0,
      manuals:  data.manuals.length> 0 ? data.manuals : [],
      trainings: data.trainings.length > 0 ? data.trainings : [],
    };
    this.cart['totalItems'] = this.cart?.trainings?.length + this.cart?.manuals.length;
    // localStorage.setItem('adminCartId', this.cart.cartId);
    if(!data?.userId) {
      localStorage.removeItem('adminCartId');
      this.cart = null;
    } else {
      localStorage.setItem('adminCartId', this.cart.cartId);
    }
    if (updatecart) {
      let oldManualsLength = this.oldCart?.manuals?.length || 0;
      let oldTrainingsLength = this.oldCart?.trainings?.length || 0;
      let manualsLength = this.cart?.manuals?.length || 0;
      let trainingsLength = this.cart?.trainings?.length || 0;
      let actionOn = oldTrainingsLength != trainingsLength ? 'Training' : 'Manual';
      let action = '';
      if (actionOn == 'Training') { action = trainingsLength > oldTrainingsLength ? 'added' : 'removed' };
      if (actionOn == 'Manual') { action = manualsLength > oldManualsLength ? 'added' : 'removed' };
      this.cartUpdatedMessage = `${actionOn} ${action} ${action == 'added' ? 'to' : 'from'} cart`;
      if (trainingsLength == oldTrainingsLength && manualsLength == oldManualsLength) {
        this.cartUpdatedMessage = 'Sales Person Updated';
      }
      setTimeout(() => {
        this.cartUpdatedMessage = null;
      }, 2000);
    }
  }

  onClickedOutside() {
    this.openCartPopup = false;
  }

  redirectToInnerDetailPageByRouter(data, isManual = false) {
    this.openCartPopup = false;
    if (isManual) this.router.navigateByUrl('market-place/view-manual' + data?.id);
    else this.router.navigateByUrl('market-place/view/' + data?.id);
  }

  checkoutToCart() {
    this.openCartPopup = false;
     this.router.navigateByUrl('market-place/cart');
  }

  updateSearchKeyword(keyword) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);
    this.landingpageAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {});
  }

}
