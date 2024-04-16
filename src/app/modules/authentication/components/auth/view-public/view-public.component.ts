import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { LandingpageService } from "../../../../../services/landingpage/landingpage.service";
import * as ClassicEditor from "src/build/ckeditor";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { Subscription } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant, ContentTypeValues, PlatFormType, forumPageAccess, IsOpenNewTab, ManageTitle, pageTitle, RedirectionPage, silentItems, windowHeight,AttachmentType } from '../../../../../common/constant/constant';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { ThreadPostService } from '../../../../../services/thread-post/thread-post.service';
import { ApiService } from '../../../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PresetsManageComponent } from 'src/app/components/common/presets-manage/presets-manage.component';
import { SuccessModalComponent } from '../../../../../components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from '../../../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../../../components/common/submit-loader/submit-loader.component';
import { ProductMatrixService } from '../../../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../../../services/thread/thread.service';
import { AddLinkComponent } from '../../../../../components/common/add-link/add-link.component';
import { FollowersFollowingComponent } from '../../../../../components/common/followers-following/followers-following.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseService } from 'src/app/modules/base/base.service';
import { Editor } from "primeng/editor";
import { retry } from 'rxjs/operators';
import { ApiConfiguration } from 'src/app/models/chatmodel';
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {MediaUploadComponent} from 'src/app/components/media-upload/media-upload.component';
import { RepairOrderService } from 'src/app/services/repair-order/repair-order.service';
import { ThreadDetailViewComponent } from 'src/app/components/common/thread-detail-view/thread-detail-view.component';

declare var $: any;
@Component({
  selector: 'app-view-public',
  templateUrl: './view-public.component.html',
  styleUrls: ['./view-public.component.scss'],
  providers: [MessageService]
})
export class ViewPublicComponent implements OnInit,  OnDestroy{

  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  @ViewChild('print',{static: false}) print: ElementRef;
  @ViewChild('top',{static: false}) top: ElementRef;
  @ViewChild('tdpage',{static: false}) tdpage: ElementRef;
  @ViewChild('pdesp',{static: false}) pdesp: ElementRef;
  @ViewChild('postReplyEditor') postReplyEditor: Editor;
  @ViewChild('postNewEditor') postNewEditor: Editor;
  detailViewRef: ThreadDetailViewComponent;
  quill: any;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public dconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "thread-detail";
  public subscriberDomain=localStorage.getItem('subscriber');
  public pushThreadArrayNotification=[];
  public bodyClass1:string = "landing-page";
  public bodyClass2: string = "submit-loader";
  public bodyClass3: string = "thread-detail-v2";
  public bodyElem;
  public threadsDetailAPIcall;
  public textTitleRecent='Recent Threads';
  public subscriberAccess:boolean=true;
  public loginUserDomainId;
  public editorProgressUpload=0;
  subscription: Subscription = new Subscription();
  public nestedPosteditorProgressUpload=0;
  public nestedPostEditeditorProgressUpload=0;
  public arrayPushPostIds=[];
  public replyPush: boolean = false;
  public title:string = 'Thread ID#';
  public headerTitle: string = "";
  public loading:boolean = true;
  public detectContentLang:boolean=false;
  public translateProcess:boolean=false;
  public postLoading:boolean = true;
  public postFixLoading:boolean = true;
  public newPostLoad : boolean = false;
  public threadViewErrorMsg;
  public threadViewError;
  public threadViewData:any;
  public threadId;
  public deleteThreadId;
  public commentAssignedUsersList=[];
  public pushThreadTopbanner=[];
  public commentSelectedAssignedUsersList=[];
  public threadAssignedUsersList=[];
  public threadAssignedUsersListNew=[];
  public oldTaggedUsersList = [];
  public replyAssignedUsersList=[];
  public threadAssignedUsersPopupResponse=false;
  public commentAssignedUsersPopupResponse=false;
  public threadDeleteMsg='';
  public replyAssignedUsersPopupResponse=false;
  public headerData:any;
  public pageDetailHeaderFlag: boolean = false;
  public threadData:any;
  public replyTaggedUsers = [];
  public commentTaggedUsers = [];
  public threadTaggedUsers = [];
  public assProdOwner = [];
  public rightPanel: boolean = true;
  public leftPanel: boolean = true;
  public recentThreadsPanel: boolean = true;
  public techSupportFlag: boolean = false;
  public presetFlag: boolean = false;
  public techSupportView: boolean = false;
  public recentViewOnly: boolean = false;
  public innerHeight: number;
  public bodyHeight: number;
  public industryType: any = [];
  public viewThreadInterval: any;
  public parentPostId;
  public postReplyDesc: string= '';
  public postAttachmentNew: boolean = false;
  public disableRightPanel: boolean = true;
  public postServerError:boolean = false;
  public postFixServerError:boolean = false;
  public postReplyServerError:boolean = false;
  public postServerErrorMsg: string = '';
  public postFixServerErrorMsg: string = '';
  public postReplyServerErrorMsg: string = '';
  public enableCommentBox: boolean = false;
  public deleteActionFlag: boolean = false;
  public descMaxLen: number = 10000;
  public postUpload: boolean = true;
  public nestedPostUpload: boolean = true;
  public manageAction: string;
  public platformId: string;
  public countryId;
  public domainId;
  public userId;
  public contentType: number = 2;
  public mediaUploadItems: any = [];
  public mediaAttachments: any = [];
  public mediaAttachmentsIds: any = [];
  public uploadedItems: any = [];
  public commentUploadedItemsFlag: boolean = false;
  public commentUploadedItemsLength: number = 0;
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public displayOrder: number = 0;
  public roleId;
  public apiData: Object;
  public user: any;
  public postError: boolean = false;
  public postFixError: boolean = false;
  public postReplyError: boolean = false;
  public postErrorMsg;
  public postFixErrorMsg;
  public postReplyErrorMsg;
  public loginUsername;
  public loginUserRole;
  public loginUserProfileImg;
  public loginUserAvailability;
  public closeStatus;
  public closedDate: string = '';
  public postButtonEnable: boolean = false;
  public postReplyButtonEnable: boolean = false;
  public continueButtonEnable: boolean = true;
  public postSaveButtonEnable: boolean = false;
  public postDesc: string= '';
  public postEditDesc: string= '';
  public threadUserId: number = 0;
  public threadOwner: boolean =false;
  public escalationStatusView: boolean =false;
  public visibledealerClosePopup: boolean =false;
  public visibleDeletedThreadPopup: boolean =false;
  public isDealerAccess;
  public escalationStatusViewClass="";
  public supportFeedbackList=[];
  public imageFlag: string = 'false';
  //public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public userRoleTitle: string = '';
  public itemLimit: any = 5;
  public itemFixLimit: any = 0;
  public itemOffset: any = 0;
  public itemFixOffset: any = 0;
  public itemLength: number = 0;
  public itemFixLength: number = 0;
  public itemTotal: number;
  public itemFixTotal: number;
  public postLists = [];
  public postReplyLists = [];
  public postFixLists = [];
  public navUrl: string ='';
  public postData = [];
  public postFixData = [];
  public postDataLength: number = 0;
  public postReplyDataLength: number = 0;
  public postFixDataLength: number = 0;
  public postApiData: object;
  public nestedPostApiData: object;
  public postEditApiData: object;
  public pageAccess: string = 'post';
  public dynamicGid: number= 0;

  public posteditServerError = false;
  public postEditServerErrorMsg = "";

  public editPostUpload: boolean = true;
  public dashboard: string = 'thread-dashboard';
  public dashboardTab: string = 'views';
  public threadRemindersData: any = [];

  public buttonTop: boolean = false;
  public buttonBottom: boolean = false;
  public currentPostDataIndex: any = 0;
  public teamSystem = localStorage.getItem('teamSystem');
  public techSubmmitFlag:boolean = false;
  public groups: string = '';
  public ppfrPopVal: any = [];
  public deletePostHeight: number;
  public automobileFlag: boolean = false;

  public trim1:string= '';
  public trim2:string= '';
  public trim3:string= '';
  public trim4:string= '';
  public trim5:string= '';
  public trim6:string= '';
  public trim:string='';
  public languageArr=[];
  public trimborder: boolean = false;
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public collabticDomain: boolean = false;
  public TVSDomain:boolean = false;
  public TVSIBDomain:boolean = false;
  public knowledgeDomain: boolean = false;
  public adminUserNotOwner: boolean = false;
  public closeAccess: boolean = false;
  public postTypeAccess:Boolean = false;
  public specialOwnerAccess: boolean = false;

  public postFixRefresh: boolean = false;
  public replyPostOnFlag1: boolean = false;
  public replyPostOnFlag2: boolean = false;
  public replyPostOnFlag3: boolean = false;
  public uploadCommentFlag: boolean = false;
  public uploadReplyFlag: boolean = false;
  public tagThreadFlag: boolean = false;
  public tagCommentFlag: boolean = false;
  public tagReplyFlag: boolean = false;
  public newThreadView: boolean = false;
  public newPostFixFlag = false;
  public newPostFixScrollFlag = false;

  public fromNotificationPageFlag: boolean = false;
  public nloading: boolean = false;
  public diagnationDomain: boolean = false;
  public enableTagFlag: boolean = false;
  public moreInfoFlag: boolean = false;
  public detailInfo: any = [];
  public timeOutNt;
  public postNotificationCount: number = 0;
  public teamMemberId;
  public ticketStatus: string = '1';
  public teamId: string = localStorage.getItem('defaultTechSupportTeamId');
  public assignedToId;
  public assignedToName;
  public assignedToProfile;
  public msgs1: Message[];
  public textColorValues = [
    {color: "rgb(0, 0, 0)"},
    {color: "rgb(230, 0, 0)"},
    {color: "rgb(255, 153, 0)"},
    {color: "rgb(255, 255, 0)"},
    {color: "rgb(0, 138, 0)"},
    {color: "rgb(0, 102, 204)"},
    {color: "rgb(153, 51, 255)"},
    {color: "rgb(255, 255, 255)"},
    {color: "rgb(250, 204, 204)"},
    {color: "rgb(255, 235, 204)"},
    {color: "rgb(255, 255, 204)"},
    {color: "rgb(204, 232, 204)"},
    {color: "rgb(204, 224, 245)"},
    {color: "rgb(235, 214, 255)"},
    {color: "rgb(187, 187, 187)"},
    {color: "rgb(240, 102, 102)"},
    {color: "rgb(255, 194, 102)"},
    {color: "rgb(255, 255, 102)"},
    {color: "rgb(102, 185, 102)"},
    {color: "rgb(102, 163, 224)"},
    {color: "rgb(194, 133, 255)"},
    {color: "rgb(136, 136, 136)"},
    {color: "rgb(161, 0, 0)"},
    {color: "rgb(178, 107, 0)"},
    {color: "rgb(178, 178, 0)"},
    {color: "rgb(0, 97, 0)"},
    {color: "rgb(0, 71, 178)"},
    {color: "rgb(107, 36, 178)"},
    {color: "rgb(68, 68, 68)"},
    {color: "rgb(92, 0, 0)"},
    {color: "rgb(102, 61, 0)"},
    {color: "rgb(102, 102, 0)"},
    {color: "rgb(0, 55, 0)"},
    {color: "rgb(0, 41, 102)"},
    {color: "rgb(61, 20, 102)"}
  ];
  public accessLevel : any = {view: true, create: true, edit: true, delete:true, reply: true, close: true};
  public commentReplyAccessLevel: boolean = true;
  public closeAccessLevel: boolean = true;
  public incrementToast:number=0;
  public translatelangArray = [];
  public translatelangId: string = '';
  public accessPlatForm:any = 3;
  public replyEnable: boolean = false;
  //public newText: string = 'NEW';
  public pageRefresh: boolean = false;
  public threadActionRefresh: boolean = false;
  public CBADomain: boolean = false;
  public CBADomainOnly: boolean = false;
  public businessRoleFlag: boolean = false;
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};

  public postUploadActionTrue: boolean = false;
  public setHeight: number;
  public knowledgeArticleTitle: string = "";
  public CommentDescription: string = "Enter Comment";
  public postId;
  public Editor = ClassicEditor;
  public emptyComment: boolean = false;
  public enterKeyPressFlag: boolean = false;
public activeCommentId: boolean = true;
public commentNotifyRead: boolean = false;
public presetId;
public presetEmitFlag = false;
public presetContent;
public postOldHeight;
public postNewHeight;
public pushText: string = '';
public pushTextIcon: string = '';
public hideLeftSidePanel: boolean = false;
public dialogPosition: string = 'top-right';
public recentThreadsFlagDisable = false;
  configCke: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
      items: [
       "bold",
        "Emoji",
        "italic",
        "link",
       "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",

      ],
    },
    placeholder: 'Add comment. Tap Enter to send and Shift+Enter for a new line.',
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };

  configCommentCkeEdit: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
      items: [
       "bold",
        "Emoji",
        "italic",
        "link",
       "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",

      ],
    },
    placeholder: 'Add comment. Tap Shift+Enter for a new line.',
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
  configReplyCkeEdit: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
      items: [
       "bold",
        "Emoji",
        "italic",
        "link",
       "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",

      ],
    },
    placeholder: 'Add Reply. Tap Shift+Enter for a new line.',
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setScreenHeight();
  }
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {



     if (event.shiftKey || event.metaKey) {
       if (event.key === 'Enter' || event.key === 'X') {

       }
     }

 }

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private titleService: Title,
    private route: ActivatedRoute,

    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private location: Location,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private baseSerivce: BaseService,
    private authenticationService: AuthenticationService,
    private threadPostService: ThreadPostService,
    private apiUrl: ApiService,
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService,
    private sanitizer: DomSanitizer,
    private modalConfig: NgbModalConfig,
    private httpClient:HttpClient,
    private repairOrderApi: RepairOrderService,
  ) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';
      console.log(localStorage.getItem('loadDatefromFCM'));  
  }


  ngOnInit(): void {
    this.apiUrl.threadViewPublicPage = true;
    localStorage.removeItem("newUpdateOnThreadId");
    localStorage.removeItem('callbackThreadInfo');
    localStorage.setItem('view-v2','1');
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass3);
    this.bodyElem.classList.add("public-detail");
    
    let url = RedirectionPage.Threads;
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
    localStorage.removeItem(pageDataInfo);
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    //this.recentThreadsFlagDisable = localStorage.getItem('recentThreadsFlag') == '1' ? true : false;

    if (this.teamSystem) {
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }
      else{
        this.msTeamAccessMobile = false;
      }
    } else {
      this.msTeamAccess = false;
      // check fieldpulse or not...
      let currentURL = window.location.href;
      console.log(currentURL);
      let splittedURL1 = currentURL.split("://");
      console.log(splittedURL1);
      //splittedURL1[1] = "collabtic.fieldpulse.co";
      let splittedURL2 = splittedURL1[1].split(".");

      let splittedDomainURL1 = splittedURL2[0];
      let splittedDomainURL2 = splittedURL2[1];
      let splittedDomainURL = splittedURL2[0];
      let splittedDomainURLLocal = splittedDomainURL.split(":");
      console.log(splittedDomainURLLocal[0] + "---" + Constant.forumLocal);
      let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
      localStorage.removeItem(threadPostStorageText);

      if( splittedDomainURL2 == 'fieldpulse' || splittedDomainURLLocal[0] == Constant.forumLocal ){ /* fieldpulse ms integration */  }
      //if( splittedDomainURL2 == 'fieldpulse'){ /* fieldpulse ms integration */  }
      else{
         /**
       * Determine the mobile operating system.
       * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
       *
       * @returns {String}
       */
      function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return "iOS";
        }

        return "unknown";
      }
      let redirectURL = "";
      let findMobile = getMobileOperatingSystem();
      console.log(findMobile);
      switch(findMobile){
        case 'Android':
        case 'Windows Phone':
          redirectURL = Constant.androidStoreURL;
          window.location.href = redirectURL;
          break;
        case 'iOS':
          redirectURL = Constant.appStoreURL;
          window.location.href = redirectURL;
          break;
        default:
        break;
      }
      }
    }

    console.log(this.route.params)

    this.route.queryParams.subscribe(params => {

      let param1 = atob(params['param1']);
      let param2 = atob(params['param2']);
      let param3 = atob(params['param3']);
      let param4 = atob(params['param4']);
      let param5 = atob(params['param5']);
      let param6 = atob(params['param6']);
      let param7 = atob(params['param7']);

      console.log(param1,param2,param3,param4,param6,param7);
      this.threadId = param1;
      this.postId = param2;
      this.domainId = param3;
      this.apiUrl.threadViewPublicDomainId = this.domainId;      
      this.userId = param4;
      this.apiUrl.threadViewPublicUserId = this.userId;
      localStorage.setItem('platformId',param7);
      localStorage.setItem('domainId',this.domainId);      
     // this.workstreamId = params.workstreamId;
     let industryType = {
      id: param6,
      slug: '',
      class: '',
      type: ''
     }
     this.industryType = industryType;

      if(params.domainId && this.subscriberDomain)
      {
        this.domainId=params.domainId;
      }

      if(Object.keys(params).length > 1) {
        if(!this.subscriberDomain)
        {
          let item = `${this.threadId}-new-tab`;
          localStorage.setItem(item, item);
        }

      }
    });
    let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
    let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
    this.navUrl = `${view}${this.threadId}`;
  
    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');
    this.manageAction = 'new';
    this.pageAccess = 'post';
    //this.hideLeftSidePanel =  this.roleId=='1' ? true : false;
    this.diagnationDomain = this.domainId == '338' ? true : false;
    this.collabticDomain = (this.platformId=='1') ? true : false;
    this.knowledgeDomain = (this.platformId=='1' && this.domainId == '165') ? true : false;
    this.TVSDomain = (this.platformId=='2' && this.domainId == '52') ? true : false;
    this.TVSIBDomain = (this.platformId=='2' && this.domainId == '97') ? true : false;
    //this.enableTagFlag = this.platformId=='2' || this.platformId=='1' || this.platformId=='3' ? true : false;
    this.CBADomain = (this.platformId == PlatFormType.CbaForum || this.platformId == PlatFormType.Collabtic) ? true : false;
    this.CBADomainOnly = (this.platformId == PlatFormType.CbaForum) ? true : false;
    let businessRole = localStorage.getItem('businessRole') != null ? localStorage.getItem('businessRole') : '' ;
    this.businessRoleFlag = (businessRole == '6' ) ? true : false;
   
    this.apiUrl.techSupportFlagServer =  true;
    if(this.businessRoleFlag &&  this.apiUrl.techSupportFlagServer ){
      this.techSupportFlag = true;
      this.techSupportView = localStorage.getItem('wsNavUrl') == 'techsupport' ? true : false;
      this.ticketStatus = localStorage.getItem("tspageTS");
      this.recentViewOnly = false;
    }

    this.recentThreadsPanel =  this.techSupportView ? false : true;
    let flag = localStorage.getItem('presetFlag') != null ? localStorage.getItem('presetFlag') : "0" ;
    this.presetFlag = flag == "1" ? true : false;

    this.enableTagFlag = true ;
    let nestedReplyEnabled=localStorage.getItem('nestedReplyEnabled');

    if(nestedReplyEnabled=='1')
    {
      this.replyEnable=true;
    }
    //this.replyEnable =   this.domainId=='165' || this.domainId=='63' || this.domainId=='1' ? true : false;

    this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
    this.translatelangId = this.translatelangArray['id'] == undefined ? '' : this.translatelangArray['id'];

    // lazyloading hide
    this.fromNotificationPageFlag = localStorage.getItem('notificationOnTap') == "1" ? true : false;
    if(this.fromNotificationPageFlag){
      this.timeOutNt = 1000;
    }

    //let industryType = this.commonApi.getIndustryType();
    let industryType = this.industryType;
    let title = (industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : ManageTitle.thread;
    let platformId1 = localStorage.getItem("platformId");
    title = (platformId1=='3') ? ManageTitle.supportRequest : title;
    if( this.domainId==71 && platformId1=='1')
      {
        title=ManageTitle.supportServices;
      }
      if(this.domainId==Constant.CollabticBoydDomainValue && platformId1=='1')
      {
        title=ManageTitle.techHelp;
      }
    this.headerTitle = title;
    this.textTitleRecent='Recent '+this.headerTitle;
    this.title = `${title} #${this.threadId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);
    //this.industryType = this.commonApi.getIndustryType();
    console.log(this.industryType);

    this.subscription.add(
      this.commonApi.emitThreadDetailReplyDataSubject.subscribe((flag) => {
        this.rightPanel = JSON.parse(flag);
        if(this.rightPanel){
          for (let i in this.postData) {
            this.postData[i].activeBorder = false;
          }
        }
      })
      );


    setTimeout(() => {
      this.getThreadInfo('init',0);
    }, 500);
    setTimeout(() => {
      this.setScreenHeight();
    }, 100);
  }
  // user profile
  updatethreadViewSolr()
  {
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('dataId', this.threadId);
    apiFormData.append('action', 'view');
    apiFormData.append('contentTypeId', '2');
    /*
    this.threadPostService.AtomicUpdateSolr(apiFormData).subscribe(res => {

    });
    */
  }
 
  getThreadInfo(initVal,pid,type='',othertype=''){
    console.log(initVal);



    this.postTypeAccess = false;
    this.adminUserNotOwner = false;

    let getRecentView = localStorage.getItem('landingRecentNav');

  if(initVal == 'init' || initVal == 'taponload') {
    //this.loading = true;
  }
  if(this.fromNotificationPageFlag){
    //this.nloading = true;
  }
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
  //apiFormData.append('domainId', this.domainId);
let subscriptionDomainIdStr=localStorage.getItem('subscriptionDomainIdStr');
let subscriber=localStorage.getItem('subscriber');

  objData["domainId"]=this.domainId;

  apiFormData.append('countryId', this.countryId);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('threadId', this.threadId);
  apiFormData.append('platformId', this.platformId);
  apiFormData.append('platform', this.accessPlatForm);
  if(this.businessRoleFlag && this.CBADomain && this.techSupportView ){
    apiFormData.append('teamId', this.teamId);
    apiFormData.append('teamMemberId', this.teamMemberId);
    apiFormData.append('ticketStatus', this.ticketStatus);
    apiFormData.append("fromTechSupport", "1");
  }

  this.threadsDetailAPIcall=this.threadPostService.getthreadDetailsios(apiFormData,objData).subscribe(res => {
    console.log(res);

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

      if(initVal == 'init' || initVal == 'taponload') {
        //this.loading = true;

        if(this.recentThreadsFlagDisable){
          if(this.techSupportFlag){
            if(this.threadViewData.newThreadTypeSelect =='share'){
              this.hideLeftSidePanel = true;
              this.techSupportView = false;
              this.recentViewOnly = false;
            }
            else{
              this.techSupportView = true;
              this.recentViewOnly = false;
              this.recentThreadsPanel = false;
              this.hideLeftSidePanel = false;
            }
          }
          else{
            this.hideLeftSidePanel = true;
            this.techSupportView = false;
            this.recentViewOnly = false;
          }
        }
        else{
          this.hideLeftSidePanel = false;
          if(this.techSupportFlag){
            if(this.threadViewData.newThreadTypeSelect =='share'){
              this.recentViewOnly = true;
              this.techSupportView = false;
            }
            else{
              this.recentViewOnly = false;
              this.techSupportView = this.recentThreadsPanel ? false : true;
            }
          }
          else{
            this.recentViewOnly = true;
            this.techSupportView = false;
          }
        }

      }



      if(initVal != 'init' && initVal != 'taponload' ) {
        let getNavText = this.commonApi.checkNavEdit(url);
        setTimeout(() => {
          console.log(getNavText)
          localStorage.setItem(getNavText.navEditText, 'true')
        }, 150);
        this.threadViewData.init = "";
      }
      else{
        this.threadViewData.init = "init";
      }

    this.threadViewData.threadTitleTranslate = this.threadViewData.threadTitle;
    this.threadViewData.contentTranslate = this.threadViewData.content;
    if(this.TVSDomain){
      this.threadViewData.actionTakenTranslate = this.threadViewData.actionTaken;
      this.threadViewData.customerVoiceTranslate = this.threadViewData.customerVoice;
    }
    if(this.CBADomainOnly){
      this.threadViewData.teamAssistTranslate = this.threadViewData.teamAssistStr;
    }
    if(this.loginUserDomainId!=this.threadViewData.domainId)
    {
      this.subscriberAccess=false;
    }
    else
    {
      this.subscriberAccess=true;
    }

    if(this.threadViewData.threadTitle != undefined && this.threadViewData.threadTitle != ''){
      this.threadViewData.threadTitle=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadTitle));
    }
    else{
      this.threadViewData.threadTitle="None";
    }
    //this.threadViewData.threadTitle = this.sanitizer.bypassSecurityTrustHtml(this.authenticationSeifrvice.URLReplacer(this.threadViewData.threadTitle));
    if(this.threadViewData.content != undefined && this.threadViewData.content != ''){
      this.threadViewData.content=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.content));
      this.threadViewData.content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.content));
    }
    else{
      this.threadViewData.content = "";
    }
    if(this.TVSDomain){
      this.threadViewData.actionTaken=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.actionTaken));
      this.threadViewData.actionTaken = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.actionTaken));
      this.threadViewData.customerVoice=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.customerVoice));
      this.threadViewData.customerVoice = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.customerVoice));
    }
    if(this.CBADomainOnly){
    if(this.threadViewData.teamAssistStr)
    {
      this.threadViewData.teamAssist=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.teamAssistStr));
      this.threadViewData.teamAssist = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.teamAssistStr));
    }
    else
    {
      this.threadViewData.teamAssist='';

    }

    }
    this.threadViewData.threadTitleDuplicate = this.threadViewData.threadTitle;
    this.threadViewData.contentDuplicate = this.threadViewData.content;
    if(this.TVSDomain){
      this.threadViewData.actionTakenDuplicate = this.threadViewData.actionTaken;
      this.threadViewData.customerVoiceDuplicate = this.threadViewData.customerVoice;
    }
    if(this.CBADomainOnly){
      this.threadViewData.teamAssistDuplicate = this.threadViewData.teamAssistStr;
    }

    let shareFixDesc = '';
    console.log(this.threadViewData.threadDescFix);
    if(this.threadViewData.threadDescFix)
    {
      this.threadViewData.threadDescFixTranslate = this.threadViewData.threadDescFix;
      shareFixDesc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadDescFix));
      console.log(shareFixDesc);
      this.threadViewData.threadDescFix = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(shareFixDesc));
    }
    console.log(this.threadViewData.threadDescFix);
    if(this.threadViewData.threadDescFix)
     {
     this.threadViewData.threadDescFixDuplicate = this.threadViewData.threadDescFix;
    }
    if(this.translatelangId != ''){
      this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
      this.threadViewData.transId = this.translatelangId;
    }
    else{
      this.threadViewData.transText = "Translate";
      this.threadViewData.transId = this.translatelangId;
    }
    this.threadViewData['threadText'] = this.headerTitle;
    console.log(this.threadViewData);

    localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
   /*  let navEditFlag = localStorage.getItem(pageTitle[pageDataIndex].navEdit);
      if(navEditFlag) {
        localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
      } */
      console.log(this.threadViewData);
        this.techSubmmitFlag=false;
      if(this.domainId == '52' && this.platformId =='2' ){
        this.techSubmmitFlag = (this.threadViewData.summitFix == '1') ? true : false;
      }
      console.log(this.techSubmmitFlag);
      if(this.techSubmmitFlag){
        this.groups = this.threadViewData.groups;
      }

      this.threadViewData.techSubmmitFlag = this.techSubmmitFlag;
      this.threadViewData.industryType = this.industryType;

      this.threadAssignedUsersList = [];
      this.threadAssignedUsersListNew = [];
      if(this.businessRoleFlag && this.CBADomain ){
        this.threadViewData.supportTaggedUsers = this.threadViewData.supportTaggedUsers == undefined ? [] : this.threadViewData.supportTaggedUsers;  ;
        if(this.threadViewData.supportTaggedUsers.length>0){
          for(let st in this.threadViewData.supportTaggedUsers){
            this.threadViewData.supportTaggedUsers[st].img = this.threadViewData.supportTaggedUsers[st].profileImage;
          }
        }
        this.threadAssignedUsersList =  this.threadViewData.supportTaggedUsers;
        this.threadAssignedUsersListNew =  [];
        if(this.threadViewData.supportTaggedUsers.length>0){
          let pImg;
          let uName;
          let id;
          for(let st in this.threadViewData.supportTaggedUsers){
            pImg = this.threadViewData.supportTaggedUsers[st].profileImage;
            uName = this.threadViewData.supportTaggedUsers[st].name;
            id = this.threadViewData.supportTaggedUsers[st].id;
            this.threadAssignedUsersListNew.push({
              'pImg':pImg,
              'uName':uName,
              'id':id,
            });
          }
        }
        this.threadAssignedUsersPopupResponse = this.threadAssignedUsersList.length > 0 ? true : false;
        this.oldTaggedUsersList =  [];
        if(this.threadViewData.supportTaggedUsers.length>0)
        {
          for(let ou in this.threadViewData.supportTaggedUsers)
          {
            this.oldTaggedUsersList.push(this.threadViewData.supportTaggedUsers[ou].id);
          }
        }

      }

      if(this.threadViewData.industryType['id'] == 2) {

        this.threadViewData.trims = [];

        if(this.industryType.id == 2 && this.platformId !='1' && this.platformId !='3') {
          this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1[0] : '';
          if(this.trim1 != ''){
            this.threadViewData.trims.push({
              key: this.trim1['key'],
              id: this.trim1['id'],
              name: this.trim1['name']
            });
          }
          this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2[0] : '';
          if(this.trim2 != ''){
            this.threadViewData.trims.push({
              key: this.trim2['key'],
              id: this.trim2['id'],
              name: this.trim2['name']
            });
          }
          this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3 != "[]" && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3[0] : '';
          if(this.trim3 != ''){
            this.threadViewData.trims.push({
              key: this.trim3['key'],
              id: this.trim3['id'],
              name: this.trim3['name']
            });
          }
          this.trim4 = (this.threadViewData.trim4 != "" && this.threadViewData.trim4 != "[]" && this.threadViewData.trim4.length>0) ? this.threadViewData.trim4[0] : '';
          if(this.trim4 != ''){
            this.threadViewData.trims.push({
              key: this.trim4['key'],
              id: this.trim4['id'],
              name: this.trim4['name']
            });
          }
          this.trim5 = (this.threadViewData.trim5 != "" && this.threadViewData.trim5 != "[]" && this.threadViewData.trim5.length>0) ? this.threadViewData.trim5[0] : '';
          if(this.trim5 != ''){
            this.threadViewData.trims.push({
              key: this.trim5['key'],
              id: this.trim5['id'],
              name: this.trim5['name']
            });
          }
          this.trim6 = (this.threadViewData.trim6 != "" && this.threadViewData.trim6 != "[]" && this.threadViewData.trim6.length>0) ? this.threadViewData.trim6[0] : '';
          if(this.trim6 != ''){
            this.threadViewData.trims.push({
              key: this.trim6['key'],
              id: this.trim6['id'],
              name: this.trim6['name']
            });
          }
          this.threadViewData.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
          console.log(this.threadViewData.trim);

          if(this.threadViewData.trims!=''){
            if(this.threadViewData.trims.length>3){
              this.trimborder = true;
            }
          }
          console.log(this.threadViewData.trims);

        }
        else{
          this.threadViewData.trims = [];

          if(this.industryType.id == 2) {
            this.trim1 = (this.threadViewData.trimValue1 != "" &&this.threadViewData.trimValue1 != undefined && this.threadViewData.trimValue1 != "[]" && this.threadViewData.trimValue1.length>0) ? this.threadViewData.trimValue1[0] : '';
            if(this.trim1 != ''){
              this.threadViewData.trims.push({
                key: this.trim1['key'],
                id: this.trim1['id'],
                name: this.trim1['name']
              });
            }
            this.trim2 = (this.threadViewData.trimValue2 != "" &&this.threadViewData.trimValue2 != undefined && this.threadViewData.trimValue2 != "[]" && this.threadViewData.trimValue2.length>0) ? this.threadViewData.trimValue2[0] : '';
            if(this.trim2 != ''){
              this.threadViewData.trims.push({
                key: this.trim2['key'],
                id: this.trim2['id'],
                name: this.trim2['name']
              });
            }
            this.trim3 = (this.threadViewData.trimValue3 != "" && this.threadViewData.trimValue3 != undefined && this.threadViewData.trimValue3 != "[]" && this.threadViewData.trimValue3.length>0) ? this.threadViewData.trimValue3[0] : '';
            if(this.trim3 != ''){
              this.threadViewData.trims.push({
                key: this.trim3['key'],
                id: this.trim3['id'],
                name: this.trim3['name']
              });
            }
            this.trim4 = (this.threadViewData.trimValue4 != "" && this.threadViewData.trimValue4 != undefined && this.threadViewData.trimValue4 != "[]" && this.threadViewData.trimValue4.length>0) ? this.threadViewData.trimValue4[0] : '';
            if(this.trim4 != ''){
              this.threadViewData.trims.push({
                key: this.trim4['key'],
                id: this.trim4['id'],
                name: this.trim4['name']
              });
            }
            this.trim5 = (this.threadViewData.trimValue5 != "" &&this.threadViewData.trimValue5 != undefined && this.threadViewData.trimValue5 != "[]" && this.threadViewData.trimValue5.length>0) ? this.threadViewData.trimValue5[0] : '';
            if(this.trim5 != ''){
              this.threadViewData.trims.push({
                key: this.trim5['key'],
                id: this.trim5['id'],
                name: this.trim5['name']
              });
            }
            this.trim6 = (this.threadViewData.trimValue6 != "" &&this.threadViewData.trimValue6 != undefined && this.threadViewData.trimValue6 != "[]" && this.threadViewData.trimValue6.length>0) ? this.threadViewData.trimValue6[0] : '';
            if(this.trim6 != ''){
              this.threadViewData.trims.push({
                key: this.trim6['key'],
                id: this.trim6['id'],
                name: this.trim6['name']
              });
            }
            this.threadViewData.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
            console.log(this.threadViewData.trim);

            if(this.threadViewData.trims!=''){
              if(this.threadViewData.trims.length>3){
                this.trimborder = true;
              }
            }
            console.log(this.threadViewData.trims);

          }
        }
      }

        if(this.threadViewData != ''){

          if(this.platformId == '1'){
            this.threadUserId = this.threadViewData.owner;
          }
          else{
            this.threadUserId = this.threadViewData.userId;
          }

          let pImg = this.threadViewData.profileImage;
          let uName = this.threadViewData.userName;
          this.assProdOwner = [];
          this.assProdOwner.push({
            id:this.threadUserId,
            profileImage:pImg,
            emailAddress:uName
          })
          console.log(this.assProdOwner);
          this.specialOwnerAccess = this.threadViewData.ownerAccess == 1 ? true : false;
          if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || ( this.roleId=='3'  || this.roleId=='10')){
            this.threadOwner = true;
          }
          if(this.userId != this.threadUserId && ( this.roleId=='3'  || this.roleId=='10')){
            this.adminUserNotOwner = true
          }
          if(this.threadViewData.escalateStatus!='' && this.platformId=='2')
          {
            this.escalationStatusView=true;
          this.escalationStatusViewClass="lowopacity";


          }

          if(this.threadViewData.isDealer)
          {
            this.supportFeedbackList=this.threadViewData.supportFeedbackList;

          }

          this.closeStatus = this.threadViewData.closeStatus;
          if(this.closeStatus==1){
            let closedate1 = this.threadViewData.closeDate;
            let closedate2 = moment.utc(closedate1).toDate();
            this.closedDate = moment(closedate2).local().format('MMM DD, YYYY . h:mm A');

            let closedCheckStatus = localStorage.getItem('closeThreadNow');
            setTimeout(() => {
              if(closedCheckStatus == 'yes'){
                localStorage.removeItem('closeThreadNow');
                let ht = this.top.nativeElement.scrollHeight - 1100;
                setTimeout(() => {
                  console.log(this.top.nativeElement.scrollHeight);
                  console.log(ht);
                  this.top.nativeElement.scrollTop = ht;
                 
                }, 700);
              }
            }, 300);
          }
          else{
            this.continueButtonEnable = true;
          }

          // give access to Thread Edit, Delete
          let access = false;
          let editAccess = false;
          let deleteAccess = false;
          if(this.platformId == '1'){
            if(this.userId == this.threadUserId){
              access = true;
            }
          }
          else{
            if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3'  || this.roleId=='10'){
              access = true;
            }
          }
          this.closeAccessLevel = access ? true : this.accessLevel.close;
          editAccess = access ? true : this.accessLevel.edit;
          deleteAccess = access ? true : this.accessLevel.delete;
          this.commentReplyAccessLevel = access ? true : this.accessLevel.reply;
          if(this.loginUserDomainId!= this.threadViewData.domainId)
          {
            this.subscriberAccess=false;
            this.commentReplyAccessLevel=false;
            this.closeAccessLevel=false;
            editAccess=false;
            deleteAccess=false;
          }
          else
          {
            this.subscriberAccess=true;
          }
          console.log(this.userId);
          console.log(this.threadUserId);
          console.log(access);

          if(this.diagnationDomain){
            if(this.threadViewData.workOrder != '' && this.threadViewData.workOrder != undefined){
              deleteAccess=false;
            }            
          } 

          // give access to close thread
          if(this.platformId == '1' && ( this.userId == this.threadUserId || this.accessLevel.close )){
              this.closeAccess = true;
          }
          else{
            if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
              this.closeAccess = true;
            }
          }
          // give access to Reopen Thread
          let reopenThread = false;
          if(this.platformId == '1'){
            if(this.closeStatus == 1 && this.threadViewData.newThreadTypeSelect == 'thread' && (this.userId == this.threadUserId || this.accessLevel.edit)){
              reopenThread = true;
            }
          }
          else{
            if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10') && this.closeStatus==1 && this.threadViewData.newThreadTypeSelect=='thread'){
              reopenThread = true;
            }
          }

          // give access to reminderAccess
          let reminderAccess = false;
          if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
            reminderAccess = true;
          }

          // Post type Access
          if(this.platformId == '1'){
            if(this.userId == this.threadUserId){
              this.postTypeAccess = true;
            }
            else{
              this.postTypeAccess = false;
              this.postTypeAccess = this.adminUserNotOwner ? true : this.postTypeAccess;
            }

          }
          else{
            if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
              this.postTypeAccess = true;
            }
          }

          let ppfrAccess = false;
          let ppfrAvailable = '';
          if(this.TVSDomain || this.TVSIBDomain){
            let isPPFRAccess = this.threadViewData.isPPFRAccess;
            let isDealerAccess = this.threadViewData.isDealer;
            this.isDealerAccess=this.threadViewData.isDealer;
            ppfrAccess = isPPFRAccess == '1' || isDealerAccess == '1' ? true : false;
            console.log(ppfrAccess);
            if(ppfrAccess){
              let dealerInfo = this.threadViewData.dealerInfo[0];
              let dealerName = dealerInfo.dealerName;
              let dealerCity = dealerInfo.city;
              let dealerArea = dealerInfo.area;
              let vinNo = this.threadViewData.vinNo !='' && this.threadViewData.vinNo != null ? this.threadViewData.vinNo : '';
              let odometer = this.threadViewData.odometer !='' && this.threadViewData.odometer != null ? this.threadViewData.odometer : '' ;
              this.ppfrPopVal = {
                threadId: this.threadId,
                ppfrEdit : this.threadViewData.isPPFRAvailable,
                model: this.threadViewData.model,
                dealerName: dealerName,
                dealerCity: dealerCity,
                dealerArea: dealerArea,
                frameNumber: vinNo,
                odometer: odometer,
                page : this.pageAccess,
              }
              ppfrAvailable = this.threadViewData.isPPFRAvailable;
              console.log(ppfrAvailable);
            }
          }
          console.log(ppfrAccess);
          console.log(ppfrAvailable);

          let threadStatus = this.threadViewData.threadStatus;
          let threadStatusBgColor = this.threadViewData.threadStatusBgColor;
          let threadStatusColorValue = this.threadViewData.threadStatusColorValue;

          if(this.techSupportFlag && this.threadViewData.newThreadTypeSelect !='share'){
            let escalationFlagArr = this.threadViewData.escalationFlag != undefined ? this.threadViewData.escalationFlag[0] : '';
            this.threadViewData.escalationFlag = this.threadViewData.escalationFlagStr == undefined ?  escalationFlagArr : this.threadViewData.escalationFlagStr;
            if(this.threadViewData.techSupportAssignedUserIdStr == '0'){
              this.assignedToId =  '';
              this.assignedToName =  '';
              this.assignedToProfile = '';
              this.teamId = localStorage.getItem('defaultTechSupportTeamId');
              this.threadViewData.techSupportStatusId = "1";
              this.threadViewData.techSupportStatus = 'Unassigned';
              this.threadViewData.techSupportStatusBgColor = 'rgb(242, 109, 109)';
            }
            else{
              this.assignedToId =  this.threadViewData.techSupportAssignedUserIdStr;
              this.assignedToName =  this.threadViewData.techSupportAssignedUserNameStr;
              this.assignedToProfile = this.threadViewData.techSupportAssignedProfileStr;
              //this.teamId = localStorage.getItem('defaultTechSupportTeamId');
              this.teamId = this.threadViewData.assignedTeamId;

              this.closeStatus = this.threadViewData.closeStatus;
              if(this.closeStatus==1){
                this.threadViewData.techSupportStatusId = "9";
                this.threadViewData.techSupportStatus = 'Closed';
                this.threadViewData.techSupportStatusBgColor = 'rgb(14, 154, 78)';
              }
              else{
                this.threadViewData.techSupportStatusId = "2";
                this.threadViewData.techSupportStatus = 'Open';
                this.threadViewData.techSupportStatusBgColor = 'rgb(229, 183, 22)';
              }
            }
          }

          //let flag = this.techSupportView && this.hideLeftSidePanel ? true : false;
          let flag=false;
          this.headerData = {
            access: 'thread',
            title: this.headerTitle,
            'pageName': 'thread',
            'threadId': this.threadId,
            'threadStatus': '',
            'threadStatusBgColor': '',
            'threadStatusColorValue': '',
            'threadOwnerAccess': false,
            'reminderAccess': false,
            'editAccess': false,
            'deleteAccess': false,
            'closeAccess': false,
            'reopenThread': false,
            'closeThread': '',
            'techSubmmit': this.techSubmmitFlag,
            'scorePoint': this.threadViewData.scorePoint,
            'ppfrAccess': ppfrAccess,
            'ppfrAvailable': ppfrAvailable,
            'newThreadTypeSelect': this.threadViewData.newThreadTypeSelect,
            'WorkstreamsList': this.threadViewData.WorkstreamsList,
           'techSupportView': flag,
            //'assignedToName': this.assignedToName,
            //'assignedToProfile': this.assignedToProfile,
          };
          console.log(this.headerData);

          this.pageDetailHeaderFlag = true;


          this.threadRemindersData = this.threadViewData.remindersData != '' && this.threadViewData.remindersData != 'undefined' && this.threadViewData.remindersData != undefined ? this.threadViewData.remindersData : '';
          if(this.threadRemindersData!=''){
            for (let i in this.threadRemindersData) {
              let reminderdate1 = this.threadRemindersData[i].createdOn;
              let reminderdate2 = moment.utc(reminderdate1).toDate();
              this.threadRemindersData[i].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
            }
          }


          /*if(this.postFixRefresh){
            //setTimeout(() => {
            this.getPostFixList();
            //}, 1);
          }*/
          let postDataLength = (this.threadViewData.postListData) ? this.threadViewData.postListData.length : 0;
          if(this.threadViewData.comment>0 || postDataLength>0){

            if(initVal == 'init' ){
              //this.loading = false;
              this.postLoading = true;
              this.postFixLoading = true;
              //this.newPostLoad = true;
              this.itemLength = 0 ;
              this.itemOffset = 0 ;
              this.postData = [];
              this.postButtonEnable = false;
              this.apiUrl.postButtonEnable = this.postButtonEnable;
              this.imageFlag = 'false';
              this.postDesc = '';
              this.getPostFixListSolr();

              setTimeout(() => {
                this.getPostListSolr(this.threadViewData.postListData);
                console.log(this.threadViewData.postListData);
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
            }
            else if(initVal == 'taponload' ){
              this.top.nativeElement.scrollTop = 0;
              this.nloading = false;
              //this.loading = false;
              this.postLoading = true;
              this.postFixLoading = true;
              //this.newPostLoad = true;
              this.itemLength = 0 ;
              this.itemOffset = 0 ;
              this.postData = [];
              this.postButtonEnable = false;
              this.apiUrl.postButtonEnable = this.postButtonEnable;
              this.imageFlag = 'false';
              this.postDesc = '';
              this.postDataLength = this.postData.length != undefined ? this.postDataLength : 0;
              this.getPostFixListSolr();
              setTimeout(() => {
                console.log(this.threadViewData.postListData);
                this.getPostListSolr(this.threadViewData.postListData,othertype);
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
            }
            else if(initVal == 'notification'){
              //this.postButtonEnable = false;
              //this.apiUrl.postButtonEnable = this.postButtonEnable;
              this.imageFlag = 'false';
              //this.postDesc = '';
              this.itemLength = 0 ;
              this.itemOffset = 0 ;
              //this.getPostFixList();
              setTimeout(() => {
                this.getPostList();
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
            }           
            
            else{
              if(pid == 0){
                for (let i in this.postData) {
                  this.postData[i].actionDisable = false;
                  if(this.userId == this.postData[i].commentUserId || this.postData[i].ownerAccess == 1){
                    this.postData[i].actionDisable = true;
                  }
                  this.postData[i].editDeleteAction = false;
                  if(this.userId == this.postData[i].commentUserId){
                    this.postData[i].editDeleteAction = true;
                  }


                    if( this.postData[i].automatedMessageStr=='1')
                    {
                      this.postData[i].editDeleteAction = false;
                    }

                  this.postData[i].commentEditAction = this.postData[i].editDeleteAction ? true : this.accessLevel.edit;
                  this.postData[i].commentDeleteAction = this.postData[i].editDeleteAction ? true : this.accessLevel.delete;
                  if(!this.subscriberAccess)
                  {
                  //  this.postLists[i].actionDisable = true;
                    this.postData[i].commentDeleteAction=false;
                    this.postData[i].commentEditAction=false;

                  }
                }
              }
              else{
                
              }
              if(initVal != 'delete' && initVal != 'refresh'){
                setTimeout(() => {
                  this.getPostListSolr(this.threadViewData.postListData);
                  this.commonApi.emitThreadListData(this.threadViewData);
                }, 1);
              }
            }

          }
          else{
            if(initVal == 'notification'){
              //this.postButtonEnable = false;
              //this.apiUrl.postButtonEnable = this.postButtonEnable;
              this.imageFlag = 'false';
              //this.postDesc = '';
              this.itemLength = 0 ;
              this.itemOffset = 0 ;
              //this.getPostFixList();
              setTimeout(() => {
                this.getPostList();
              }, 1);
            }
            if(this.fromNotificationPageFlag){
              this.nloading = false;
              setTimeout(() => {
                localStorage.removeItem("notificationOnTap");
                localStorage.removeItem("notificationTPID");
                this.fromNotificationPageFlag = false;
              }, 100);
            }
            this.loading = false;
            this.postLoading = false;
            this.newPostLoad = false;
            setTimeout(() => {
              this.commonApi.emitThreadListData(this.threadViewData);
            }, 1);

            if(initVal != 'reminder' && initVal != 'delete'  && initVal != 'notification'){

              /*if(initVal == 'init'){
                this.postFixLoading = true;
                this.getPostFixList();
              }*/
              setTimeout(() => {
                let divHeight = this.tdpage.nativeElement.offsetHeight;
                console.log(divHeight);
                console.log(this.innerHeight);

                if(divHeight > this.innerHeight){
                  this.buttonTop = true;
                  this.threadViewData.buttonBottom = false;
                  this.buttonBottom = false;
                }
                else{
                  this.buttonTop = false;
                  this.threadViewData.buttonBottom = false;
                  this.buttonBottom = false;
                }

              }, 1500);
            }

            if(initVal == 'taponload' ){
              if(this.top)
              {
                this.top.nativeElement.scrollTop = 0;
              }

              this.nloading = false;
              this.postData = [];
              this.postButtonEnable = false;
              this.apiUrl.postButtonEnable = this.postButtonEnable;
              this.imageFlag = 'false';
              this.postDesc = '';
              this.postDataLength = 0;
              setTimeout(() => {
                console.log(this.threadViewData);
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
            }
          }
          if(initVal == 'delete'){
            this.postDataLength = this.postData.length != undefined ? this.postDataLength : 0;
            /*if(this.postDataLength>0){
              for (let i in this.postData) {
                this.postReplyDataLength = this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;
              }
            } */
          }

         

          let editID = localStorage.getItem('newUpdateOnEditThreadId') != null && localStorage.getItem('newUpdateOnEditThreadId') != undefined ? localStorage.getItem('newUpdateOnEditThreadId') : '' ;
          if(editID != ''){
            this.callThreadDetail('thread-edit');
            setTimeout(() => {
              localStorage.removeItem("newUpdateOnEditThreadId");
            }, 100);
          }

        }
        else{
          this.loading = false;
          this.postLoading = false;
          this.threadViewErrorMsg = res.result;
          this.threadViewError = true;
          setTimeout(() => {
            this.commonApi.emitThreadListData(this.threadViewData);
          }, 1);
        }
    //}
    setTimeout(() => {

      this.setScreenHeight();
      this.loading = false;
      this.enableCommentBox=true;
    }, 200);
   }
   else{
     this.loading = false;
     this.postLoading = false;
     this.threadViewErrorMsg = res.result;
     this.threadViewError = true;
     setTimeout(() => {
      this.commonApi.emitThreadListData(this.threadViewData);
    }, 1);
   }
  }
  else{

    this.loading = true;
    let callInfo = localStorage.getItem('callbackThreadInfo');

    if(callInfo == null){

      localStorage.setItem('callbackThreadInfo', '1');
      setTimeout(() => {
        this.threadViewData=[];
        this.postFixData=[];
        this.postFixDataLength=0;
        this.commentUploadedItemsLength = 0;
        this.commentUploadedItemsFlag = false;
        this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
        this.pageRefresh = false;
        this.getThreadInfo('taponload','');
      }, 11000);

    }
    else{
      if(callInfo == '1'){
        localStorage.setItem('callbackThreadInfo', '2');
        setTimeout(() => {
          this.threadViewData=[];
          this.postFixData=[];
          this.postFixDataLength=0;
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.pageRefresh = false;
          console.log(this.route.params)
          this.route.params.subscribe( params => {
            this.threadId = params.id;


      if(params.domainId && this.subscriberDomain)
      {
        this.domainId=params.domainId;
      }

          });
          this.getThreadInfo('taponload','');
        }, 11000);
      }
    }
  }

    this.updatethreadViewSolr();


 },
 (error => {
   this.loading = false;
   this.postLoading = false;
   this.threadViewErrorMsg = error;
   
   this.threadViewError = '';
   setTimeout(() => {
    this.commonApi.emitThreadListData(this.threadViewData);
  }, 1);
 })
 );



}

  taponDescription(content,type,i,selectLanguage,j='')
  {
    if(type=="thread-content"){
      content = '';
      content = this.threadViewData.contentTranslate;
    }
    else if(type=="thread-sharedfix"){
       content = '';
       content = this.threadViewData.threadDescFixTranslate;
       if(content==''){
       return false;
     }
     }
    else if(type=="thread-invoice"){
      content = '';
      content = this.threadViewData.customerVoiceTranslate;
      if(content==''){
        return false;
      }
    }
    else if(type=="thread-actiontaken"){
      content = '';
      content = this.threadViewData.actionTakenTranslate;
      if(content==''){
        return false;
      }
    }
    else if(type=="thread-teamassist"){
      content = '';
      content = this.threadViewData.teamAssistTranslate;
      if(content==''){
        return false;
      }
    }
    else if(type=="thread-title"){
      content = '';
      content = this.threadViewData.threadTitleTranslate;
    }
    else{
      content = content;
    }
    this.detectContentLang=false;
    this.translateProcess=false;
//let selectLanguage='ta';
    let initLang='en';
    if(!this.detectContentLang)
    {


    this.commonApi.DetectlangData(content).subscribe(res => {
      console.log(res.data.detections[0][0].language);

      let sourceLang=res.data.detections[0][0].language;
      let sourceLang_split=sourceLang.split('-');
      sourceLang=sourceLang_split[0];
      if(sourceLang==initLang)
      {
        sourceLang=selectLanguage;
        initLang='';
      }

        let contentData=
        {
      sourceLanguage:sourceLang,
      contentQuery:content,
      initLanguage:initLang
      //targetLang:'ta'
        };

        this.replacewithPostContent(contentData,i,sourceLang,selectLanguage,type,j);





    });

  }
  else
  {

  }

  }

  public replacewithPostContent(contentData,i,sourceLang,selectLanguage,type,j)
  {
    if(this.translateProcess)
    {
      return true;

    }
    else
    {

    this.commonApi.fetchlangData(contentData).subscribe(res => {

      console.log(res);
     let translatedText= res.data.translations[0].translatedText;
      if(translatedText)
      {
        if(sourceLang==selectLanguage || this.detectContentLang)
        {
          if(translatedText && translatedText!='undefined')
          {

            if(type=="thread-content"){
              this.threadViewData.content = translatedText;
              this.commonApi.emitThreadListData(this.threadViewData);
            }
            else if(type=="thread-sharedfix"){
              this.threadViewData.threadDescFix = translatedText;
              this.commonApi.emitThreadListData(this.threadViewData);
              }
            else if(type=="thread-title"){
              this.threadViewData.threadTitle = translatedText;
              this.commonApi.emitThreadListData(this.threadViewData);
            }
            else if(type=="thread-invoice"){
              this.threadViewData.customerVoice = translatedText;
              this.commonApi.emitThreadListData(this.threadViewData);
            }
            else if(type=="thread-actiontaken"){
              this.threadViewData.actionTaken = translatedText;
              this.commonApi.emitThreadListData(this.threadViewData);
            }
            else if(type=="thread-teamassist"){
              this.threadViewData.teamAssist = translatedText;
              this.commonApi.emitThreadListData(this.threadViewData);
            }
            else if(type=="reply"){
              this.postData[i].nestedReplies[j].contentWeb=translatedText;
            }
            else{
              this.postData[i].contentWeb=translatedText;
            }
          }
          this.translateProcess=true;
          return true;
        }
        else
        {
          this.detectContentLang=true;
          let contentData=
          {
        sourceLanguage:selectLanguage,
        contentQuery:translatedText,
        initLanguage:sourceLang
        //targetLang:'ta'
          };
          this.replacewithPostContent(contentData,i,sourceLang,selectLanguage,type,j);


        }

      }


    });
  }
  }

  tapOnComment(PostData)
  {
    //if(this.closeStatus == 0 ){
      PostData.threadCloseStatus = this.closeStatus;
      PostData.threadUserId = this.threadUserId;
      PostData.adminUserNotOwner = this.adminUserNotOwner;
      PostData.techSubmmitFlag = this.techSubmmitFlag;
      PostData.postTypeAccess = this.postTypeAccess;
      PostData.domainId=this.domainId;
      PostData.commentReplyAccessLevel = this.commentReplyAccessLevel;
      PostData.accessLevel = this.accessLevel;
      localStorage.setItem('rightCommentPostId',PostData.commentPostId);

      PostData.specialOwnerAccess = this.specialOwnerAccess;
      PostData.threadOwner = this.threadOwner;
      this.commonApi.ThreadDetailCommentData(JSON.stringify(PostData));
      for (let i in this.postData) {
this.postData[i].activeBorder = false;
        if(this.postData[i].commentPostId == PostData.commentPostId){
          this.postData[i].activeBorder = true;
        }

      }
    //}
  }

  getPostListSolr(postListData,othertype='')
  {
    let newArr = [];
    this.postLists = postListData;
    this.postDataLength = postListData.length;
    console.log(this.postLists);
    let postAttachments = [];
    for (let i in this.postLists) {

      if(this.translatelangId != ''){
        this.postLists[i].transText = "Translate to "+this.translatelangArray['name'];
        this.postLists[i].transId = this.translatelangId;
      }
      else{
        this.postLists[i].transText = "Translate";
        this.postLists[i].transId = this.translatelangId;
      }
      this.postLists[i].postView = true;
      this.postLists[i].activeBorder = false;
      this.postLists[i].enableActionButton = true;
      this.postLists[i].threadId = this.postLists[i].commentThreadId;
      this.postLists[i].postId = this.postLists[i].commentPostId;
      this.postLists[i].userName = this.postLists[i].commentUserName;
      this.postLists[i].userId = this.postLists[i].commentUserId;
      this.postLists[i].profileImage = this.postLists[i].commentProfileImage;
      this.postLists[i].postStatus = this.postLists[i].commentPostStatus;
      this.postLists[i].postType = this.postLists[i].commentPostType;
      this.postLists[i].deleteFlag = this.postLists[i].commentDeletedFlag;
      this.postLists[i].owner = this.postLists[i].commentOwnerInt;
      this.postLists[i].newComment = false;
      this.postLists[i].postStFlag = true;
      this.postLists[i].postLoading = false;

      this.postLists[i].postReplyLoading = false;
      this.postLists[i].userRoleTitle = this.postLists[i].commentuserRoleTitle !='' && this.postLists[i].commentuserRoleTitle !=undefined ? this.postLists[i].commentuserRoleTitle : 'No Title';
      let createdOnNew = this.postLists[i].commentCreatedOn;
      let createdOnDate = moment.utc(createdOnNew).toDate();
      //this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
      this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
      this.postLists[i].likeLoading = false;
      this.postLists[i].likeCount = this.postLists[i].commentLikeCount;
      this.postLists[i].likeCountVal = this.postLists[i].commentLikeCount == 0 ? '-' : this.postLists[i].commentLikeCount;
      if(this.postLists[i].likeCount == 0){
        this.postLists[i].likeCountValText = '';
      }
      else if(this.postLists[i].commentLikeCount == 1){
        this.postLists[i].likeCountValText = 'Like';
      }
      else{
        this.postLists[i].likeCountValText = 'Likes';
      }
      this.postLists[i].likeStatus = 0;
      if(this.postLists[i].commentLikedUsers != undefined){
        for(let a in this.postLists[i].commentLikedUsers) {
          if(this.postLists[i].commentLikedUsers[a] == this.userId) {
            this.postLists[i].likeStatus = 1;
          }
        }
      }
      //this.postLists[i].likeStatus = this.postLists[i].commentlikeStatus;
      this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
      this.postLists[i].attachmentLoading = false;
      if(this.postLists[i].commentUploadContents)
      {
        this.postLists[i].attachments = this.postLists[i].commentUploadContents;
        this.postLists[i].attachmentLoading = (this.postLists[i].commentUploadContents.length>0) ? false : true;
      }
      else
      {
        this.postLists[i].commentUploadContents=[];
        this.postLists[i].attachments=[];

      }
      this.postLists[i].action = 'view';
      this.postLists[i].threadOwnerLabel = false;
      this.postLists[i].userName=this.postLists[i].commentUserName;
      this.postLists[i].userId=this.postLists[i].commentUserId;
      this.postLists[i].profileImage = this.postLists[i].commentProfileImage;
      this.postLists[i].postStatus = this.postLists[i].commentPostStatus;
      this.postLists[i].postType = this.postLists[i].commentPostType;
      if(this.threadUserId  == this.postLists[i].commentUserId){
        this.postLists[i].threadOwnerLabel = true;
      }
      this.postLists[i].actionDisable = false;
      if(this.userId == this.postLists[i].commentUserId || this.postLists[i].ownerAccess == 1){
        this.postLists[i].actionDisable = true;
      }

      if(!this.subscriberAccess)
      {
       // this.postLists[i].actionDisable = true;
      }
      // post edit delete action
      /*this.postLists[i].editDeleteAction = false;
      if((this.userId == this.postLists[i].commentUserId || this.postLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
        this.postLists[i].editDeleteAction = true;
      }*/

      this.postLists[i].editDeleteAction = false;
      if(this.userId == this.postLists[i].commentUserId){
        this.postLists[i].editDeleteAction = true;
      }

                    if( this.postLists[i].automatedMessageStr=='1')
                    {
                      this.postLists[i].editDeleteAction = false;
                    }

      this.postLists[i].commentEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
      this.postLists[i].commentDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;
      if(!this.subscriberAccess)
      {
        //this.postLists[i].actionDisable = true;
        this.postLists[i].commentEditAction=false;
        this.postLists[i].commentDeleteAction=false;
      }

      postAttachments.push({
        id: this.postLists[i].postId,
        attachments: this.postLists[i].commentUploadContents
      });

      this.postLists[i].isEdited = this.postLists[i].commentIsEdited;
      if(this.postLists[i].commentEditHistory){
        let editdata = this.postLists[i].commentEditHistory;
        for (let ed in editdata) {
          editdata[ed].userName = editdata[ed].commentUserName;
          editdata[ed].profileImage = editdata[ed].commentProfileImage;
          editdata[ed].updatedOnNew = editdata[ed].commentUpdatedOn;
          let editdate1 = editdata[ed].updatedOnNew;
          let editdate2 = moment.utc(editdate1).toDate();
          editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
        }
        this.postLists[i].editHistory = editdata;
      }

      let contentWeb1 = '';
      contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].commentContent));
      this.postLists[i].editedWeb = contentWeb1;

      let contentWeb2 = contentWeb1;
      this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));


      this.postLists[i].contentWebDuplicate = this.postLists[i].commentContent;
      this.postLists[i].contentDesc=this.postLists[i].commentContent;
      this.postLists[i].contentTranslate=this.postLists[i].commentContent;
     this.postLists[i].remindersData = this.postLists[i].remindersData != '' && this.postLists[i].remindersData != 'undefined' && this.postLists[i].remindersData != undefined ? this.postLists[i].remindersData : '';
      if(this.postLists[i].remindersData != ''){
        let prdata = this.postLists[i].remindersData;
        for (let pr in prdata) {
          let reminderdate1 = prdata[pr].createdOn;
          let reminderdate2 = moment.utc(reminderdate1).toDate();
          prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
        }
      }

      this.postReplyLists = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies : [] ;
      this.postReplyDataLength = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies.length : 0;

      //get last record..
      if(this.postReplyDataLength>0){
        this.postLists[i].replyIdArr = [];
        for (let prr in this.postReplyLists) {
          this.postLists[i].replyIdArr.push(this.postReplyLists[prr].replyId);
        }
        this.postLists[i].commentReplyCount = this.postLists[i].replyIdArr.length;
        //alert(this.postLists[i].commentReplyCount);
        let cr = this.postLists[i].commentNestedReplies[this.postLists[i].commentNestedReplies.length - 1];
        this.postLists[i].commentNestedReplies = [];
        this.postLists[i].commentNestedReplies.push(cr);
      }
      else{
        this.postLists[i].replyIdArr=[];
        this.postLists[i].commentReplyCount=0;
        this.postLists[i].commentNestedReplies = []
      }

      this.postReplyLists = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies : [] ;
      this.postReplyDataLength = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies.length : 0;

      if(this.postReplyDataLength>0){
        console.log(this.postReplyLists);
        let postReplyAttachments = [];
        for (let prl in this.postReplyLists) {
          this.postReplyLists[prl].threadId = this.postLists[i].commentThreadId;
          this.postReplyLists[prl].parentPostId = this.postLists[i].commentPostId;
          this.postReplyLists[prl].postId = this.postReplyLists[prl].replyId;
          this.postReplyLists[prl].profileImage=this.postReplyLists[prl].replyProfileImage;
          this.postReplyLists[prl].userName=this.postReplyLists[prl].replyUserName;
          this.postReplyLists[prl].userId=this.postReplyLists[prl].replyUserId;
          this.postReplyLists[prl].postStatus = this.postReplyLists[prl].replyPostStatus;
          this.postReplyLists[prl].postType = this.postReplyLists[prl].replyPostType;
          this.postReplyLists[prl].deleteFlag = this.postReplyLists[prl].replyDeletedFlag;
          this.postReplyLists[prl].owner = this.postReplyLists[prl].replyOwnerInt;
          if(this.translatelangId != ''){
            this.postReplyLists[prl].transText = "Translate to "+this.translatelangArray['name'];
            this.postReplyLists[prl].transId = this.translatelangId;
          }
          else{
            this.postReplyLists[prl].transText = "Translate";
            this.postReplyLists[prl].transId = this.translatelangId;
          }
          this.postReplyLists[prl].postNew = false;
          this.postReplyLists[prl].newReply = false;
          this.postReplyLists[prl].postView = true;
          this.postReplyLists[prl].postStFlag = true;
          this.postReplyLists[prl].postReplyLoading = false;
          this.postReplyLists[prl].enableActionButton = true;
          this.postReplyLists[prl].userRoleTitle = this.postReplyLists[prl].replyUserRoleTitle !='' && this.postReplyLists[prl].replyUserRoleTitle != undefined ? this.postReplyLists[prl].replyUserRoleTitle : 'No Title';
          let createdOnNew = this.postReplyLists[prl].replyCreatedOn;
          let createdOnDate = moment.utc(createdOnNew).toDate();
          //this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
          this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
          this.postReplyLists[prl].likeLoading = false;
          this.postReplyLists[prl].likeCount = this.postReplyLists[prl].replyLikeCount;
          this.postReplyLists[prl].likeCountVal = this.postReplyLists[prl].replyLikeCount == 0 ? '-' : this.postReplyLists[prl].likeCount;
          if(this.postReplyLists[prl].likeCount == 0){
            this.postReplyLists[prl].likeCountValText = '';
          }
          else if(this.postReplyLists[prl].likeCount == 1){
            this.postReplyLists[prl].likeCountValText = 'Like';
          }
          else{
            this.postReplyLists[prl].likeCountValText = 'Likes';
          }
          this.postReplyLists[prl].likeStatus = 0;
          if(this.postReplyLists[prl].replyLikedUsers != undefined){
            for(let a in this.postReplyLists[prl].replyLikedUsers) {
              if(this.postReplyLists[prl].replyLikedUsers[a] == this.userId) {
                this.postReplyLists[prl].likeStatus = 1;
              }
            }
          }
          //this.postReplyLists[prl].likeStatus = this.postReplyLists[prl].replyLikeStatus;
          this.postReplyLists[prl].likeImg = (this.postReplyLists[prl].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
          if(this.postReplyLists[prl].replyUploadContents)
          {
            this.postReplyLists[prl].attachments = this.postReplyLists[prl].replyUploadContents;
            this.postReplyLists[prl].attachmentLoading = (this.postReplyLists[prl].replyUploadContents.length>0) ? false : true;
          }
          else
          {
            this.postReplyLists[prl].replyUploadContents=[];
            this.postReplyLists[prl].attachments=[];

          }
          this.postReplyLists[prl].action = 'view';
          this.postReplyLists[prl].threadOwnerLabel = false;
          if(this.threadUserId  == this.postReplyLists[prl].replyUserId){
            this.postReplyLists[prl].threadOwnerLabel = true;
          }
          this.postReplyLists[prl].actionDisable = false;
          if(this.userId == this.postReplyLists[prl].replyUserId || this.postReplyLists[prl].ownerAccess == 1){
            this.postReplyLists[prl].actionDisable = true;
          }
          // post edit delete action
          /*this.postReplyLists[prl].editDeleteAction = false;
          if((this.userId == this.postReplyLists[prl].replyUserId || this.postReplyLists[prl].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
            this.postReplyLists[prl].editDeleteAction = true;
          }*/

          this.postReplyLists[prl].editDeleteAction = false;
          if(this.userId == this.postReplyLists[prl].replyUserId){
            this.postReplyLists[prl].editDeleteAction = true;
          }
          this.postReplyLists[prl].replyEditAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.edit;
          this.postReplyLists[prl].replyDeleteAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.delete;

          if(!this.subscriberAccess)
          {
            this.postReplyLists[prl].actionDisable = true;
            this.postReplyLists[prl].replyEditAction=false;
            this.postReplyLists[prl].replyDeleteAction=false;
          }

          postReplyAttachments.push({
            id: this.postReplyLists[prl].postId,
            attachments: this.postReplyLists[prl].uploadContents
          });

          this.postReplyLists[prl].isEdited = this.postReplyLists[prl].replyIsEdited;
          if(this.postReplyLists[prl].replyEditHistory){
            let editdata = this.postReplyLists[prl].replyEditHistory;
            for (let ed in editdata) {
              editdata[ed].userName = editdata[ed].replyUserName;
              editdata[ed].profileImage = editdata[ed].replyProfileImage;
              editdata[ed].updatedOnNew = editdata[ed].replyUpdatedOn;
              let editdate1 = editdata[ed].updatedOnNew;
              let editdate2 = moment.utc(editdate1).toDate();
              editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
            }
            this.postReplyLists[prl].editHistory = editdata;
          }

          this.postReplyLists[prl].remindersData = this.postReplyLists[prl].remindersData != '' && this.postReplyLists[prl].remindersData != undefined && this.postReplyLists[prl].remindersData != 'undefined' ? this.postReplyLists[prl].remindersData : '';
          if(this.postReplyLists[prl].remindersData != ''){
            let prdata = this.postReplyLists[prl].remindersData;
            for (let prr in prdata) {
              let reminderdate1 = prdata[prr].createdOn;
              let reminderdate2 = moment.utc(reminderdate1).toDate();
              prdata[prr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
            }
          }

          let contentWeb1 = '';
          contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postReplyLists[prl].replyContentWeb));
          this.postReplyLists[prl].editedWeb = contentWeb1;

          let contentWeb2 = contentWeb1;
          this.postReplyLists[prl].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

          this.postReplyLists[prl].contentWebDuplicate = this.postReplyLists[prl].replyContentWeb;
          this.postReplyLists[prl].replyContent = this.postReplyLists[prl].replyContentWeb;
          this.postReplyLists[prl].content = this.postReplyLists[prl].replyContentWeb;
          this.postReplyLists[prl].contentTranslate = this.postReplyLists[prl].content;

        }

        let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
        localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));

      }
      this.postLists[i].nestedReplies = this.postReplyLists;

      // push data
      if(this.fromNotificationPageFlag){
        newArr.push(this.postLists[i]);
      }
      else{
        this.postData.push(this.postLists[i]);
      }

    }
    if(this.postAttachmentNew){
      setTimeout(() => {
        this.moveScroll(1);
      }, 1000);
      this.postAttachmentNew = false;
    }
    if(this.activeCommentId){
      setTimeout(() => {
        this.moveScrollNotify(this.parentPostId);
        this.activeCommentId = false;
      }, 800);
    }
    
    this.postLoading = false;
    this.newPostLoad = false;
    this.buttonTop = true;
    this.threadViewData.buttonBottom = false;
    this.buttonBottom = false;
    console.log(this.postData);
  }

  updateReplySolr(pid,ptype,type,fromPush,PushColor,othertype){
    console.log(this.postLists);
    this.postReplyLists = this.postLists;
    let postReplyAttachments = [];
        for (let prl in this.postReplyLists) {
          this.postReplyLists[prl].threadId = this.threadId;
          this.postReplyLists[prl].parentPostId = this.parentPostId;
          this.postReplyLists[prl].postId = this.postReplyLists[prl].replyId;
          this.postReplyLists[prl].profileImage=this.postReplyLists[prl].replyProfileImage;
          this.postReplyLists[prl].userName=this.postReplyLists[prl].replyUserName;
          this.postReplyLists[prl].userId=this.postReplyLists[prl].replyUserId;
          this.postReplyLists[prl].postStatus = this.postReplyLists[prl].replyPostStatus;
          this.postReplyLists[prl].postType = this.postReplyLists[prl].replyPostType;
          this.postReplyLists[prl].deleteFlag = this.postReplyLists[prl].replyDeletedFlag;
          this.postReplyLists[prl].owner = this.postReplyLists[prl].replyOwnerInt;
          if(this.translatelangId != ''){
            this.postReplyLists[prl].transText = "Translate to "+this.translatelangArray['name'];
            this.postReplyLists[prl].transId = this.translatelangId;
          }
          else{
            this.postReplyLists[prl].transText = "Translate";
            this.postReplyLists[prl].transId = this.translatelangId;
          }
          this.postReplyLists[prl].postNew = false;
          this.postReplyLists[prl].newReply = false;
          this.postReplyLists[prl].postView = true;
          this.postReplyLists[prl].postStFlag = true;
          this.postReplyLists[prl].postReplyLoading = false;
          this.postReplyLists[prl].enableActionButton = true;
          this.postReplyLists[prl].userRoleTitle = this.postReplyLists[prl].replyUserRoleTitle !='' && this.postReplyLists[prl].replyUserRoleTitle != undefined ? this.postReplyLists[prl].replyUserRoleTitle : 'No Title';
          let createdOnNew = this.postReplyLists[prl].replyCreatedOn;
          let createdOnDate = moment.utc(createdOnNew).toDate();
          //this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
          this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
          this.postReplyLists[prl].likeLoading = false;
          this.postReplyLists[prl].likeCount = this.postReplyLists[prl].replyLikeCount;
          this.postReplyLists[prl].likeCountVal = this.postReplyLists[prl].replyLikeCount == 0 ? '-' : this.postReplyLists[prl].likeCount;
          if(this.postReplyLists[prl].likeCount == 0){
            this.postReplyLists[prl].likeCountValText = '';
          }
          else if(this.postReplyLists[prl].likeCount == 1){
            this.postReplyLists[prl].likeCountValText = 'Like';
          }
          else{
            this.postReplyLists[prl].likeCountValText = 'Likes';
          }
          this.postReplyLists[prl].likeStatus = 0;
          if(this.postReplyLists[prl].replyLikedUsers != undefined){
            for(let a in this.postReplyLists[prl].replyLikedUsers) {
              if(this.postReplyLists[prl].replyLikedUsers[a] == this.userId) {
                this.postReplyLists[prl].likeStatus = 1;
              }
            }
          }
          //this.postReplyLists[prl].likeStatus = this.postReplyLists[prl].replyLikeStatus;
          this.postReplyLists[prl].likeImg = (this.postReplyLists[prl].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
          if(this.postReplyLists[prl].replyUploadContents)
          {
            this.postReplyLists[prl].attachments = this.postReplyLists[prl].replyUploadContents;
            this.postReplyLists[prl].attachmentLoading = (this.postReplyLists[prl].replyUploadContents.length>0) ? false : true;
          }
          else
          {
            this.postReplyLists[prl].replyUploadContents=[];
            this.postReplyLists[prl].attachments=[];

          }
          this.postReplyLists[prl].action = 'view';
          this.postReplyLists[prl].threadOwnerLabel = false;
          if(this.threadUserId  == this.postReplyLists[prl].replyUserId){
            this.postReplyLists[prl].threadOwnerLabel = true;
          }
          this.postReplyLists[prl].actionDisable = false;
          if(this.userId == this.postReplyLists[prl].replyUserId || this.postReplyLists[prl].ownerAccess == 1){
            this.postReplyLists[prl].actionDisable = true;
          }
          // post edit delete action
          /*this.postReplyLists[prl].editDeleteAction = false;
          if((this.userId == this.postReplyLists[prl].userId || this.postReplyLists[prl].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
            this.postReplyLists[prl].editDeleteAction = true;
          }*/

          this.postReplyLists[prl].editDeleteAction = false;
          if(this.userId == this.postReplyLists[prl].userId){
            this.postReplyLists[prl].editDeleteAction = true;
          }
          this.postReplyLists[prl].replyEditAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.edit;
          this.postReplyLists[prl].replyDeleteAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.delete;

          if(!this.subscriberAccess)
          {
            this.postReplyLists[prl].actionDisable = true;
            this.postReplyLists[prl].replyEditAction=false;
            this.postReplyLists[prl].replyDeleteAction=false;
          }
          postReplyAttachments.push({
            id: this.postReplyLists[prl].postId,
            attachments: this.postReplyLists[prl].replyUploadContents
          });

          this.postReplyLists[prl].isEdited = this.postReplyLists[prl].replyIsEdited;
          if(this.postReplyLists[prl].replyEditHistory){
            let editdata = this.postReplyLists[prl].replyEditHistory;
            for (let ed in editdata) {
              editdata[ed].userName = editdata[ed].replyUserName;
              editdata[ed].profileImage = editdata[ed].replyProfileImage;
              editdata[ed].updatedOnNew = editdata[ed].replyUpdatedOn;
              let editdate1 = editdata[ed].updatedOnNew;
              let editdate2 = moment.utc(editdate1).toDate();
              editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
            }
            this.postReplyLists[prl].editHistory = editdata;
          }

          this.postReplyLists[prl].remindersData = this.postReplyLists[prl].remindersData != '' && this.postReplyLists[prl].remindersData != undefined && this.postReplyLists[prl].remindersData != 'undefined' ? this.postReplyLists[prl].remindersData : '';
          if(this.postReplyLists[prl].remindersData != ''){
            let prdata = this.postReplyLists[prl].remindersData;
            for (let prr in prdata) {
              let reminderdate1 = prdata[prr].createdOn;
              let reminderdate2 = moment.utc(reminderdate1).toDate();
              prdata[prr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
            }
          }

          let contentWeb1 = '';
          contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postReplyLists[prl].replyContentWeb));
          this.postReplyLists[prl].editedWeb = contentWeb1;

          let contentWeb2 = contentWeb1;
          this.postReplyLists[prl].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

          this.postReplyLists[prl].contentWebDuplicate = this.postReplyLists[prl].replyContentWeb;
          this.postReplyLists[prl].replyContent = this.postReplyLists[prl].replyContentWeb;
          this.postReplyLists[prl].content = this.postReplyLists[prl].replyContentWeb;
          this.postReplyLists[prl].contentTranslate = this.postReplyLists[prl].replyContent;

          if(type == 'replyedit'){
            let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
            let itemIndex2 = this.postData[itemIndex1].commentNestedReplies.findIndex(item => item.postId == pid);
            this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postReplyLists[prl];
            this.postData[itemIndex1].commentNestedReplies[itemIndex2] = this.postReplyLists[prl];
            setTimeout(() => {
              this.postData[itemIndex1].commentNestedReplies[itemIndex2].enableActionButton = true;
            }, 2000);
          }
          else{
            for (let r1 in this.postData) {
              this.postData[r1].postNew = false;
              this.postData[r1].postReplyLoading = false;
              if(this.postData[r1].postId == this.parentPostId){
                console.log(this.deleteActionFlag,this.postData[r1].replyIdArr)
                if(!this.deleteActionFlag && this.postData[r1].replyIdArr && this.postData[r1].replyIdArr.length>0){
                    let itemIndex1 = this.postData[r1].commentNestedReplies.findIndex(item => item.replyId == pid);
                    if (itemIndex1 < 0) {
                      this.postData[r1].replyIdArr.push(pid);
                      this.postData[r1].commentReplyCount = parseInt(this.postData[r1]['commentReplyCount']) + 1;
                    }
                }
                else{
                    this.postData[r1]['commentReplyCount'] = 1;
                    this.postData[r1]['replyIdArr']=[];
                    this.postData[r1]['replyIdArr'].push(pid);
                }
                this.postData[r1].commentNestedReplies = [];
                this.postData[r1].nestedReplies = [];
                this.postData[r1].commentNestedReplies.push(this.postReplyLists[prl]);
                this.postData[r1].nestedReplies.push(this.postReplyLists[prl]);
              }
            }
          }

        }

        if(type == 'replynew'){
          let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
              //let itemIndex2 = this.postData[itemIndex1].commentNestedReplies.findIndex(item => item.postId == pid);
              //this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[i];

              if(PushColor=='1')
              {
                setTimeout(() => {

                  this.postData[itemIndex1].commentNestedReplies[0].newReply = true;
                  //this.postData[itemIndex1].nestedReplies[0].newReply = true;
                }, 10);
              }
              if(this.deleteActionFlag){
                setTimeout(() => {
                  this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
                  //this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
                  this.deleteActionFlag = false;
                }, 2000);
              }
              else{
                setTimeout(() => {
                  this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
                  //this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
                }, 2000);
              }


              if(fromPush!='1')
              {
            // this.moveScroll(1);
              }
              if(fromPush=='1')
              {
                setTimeout(() => {
                  this.moveScrollNotify(pid);
                }, 500);

              }
        }
        else{
          if(PushColor=='1')
          {
            setTimeout(() => {
              for (let r1 in this.postLists) {
                this.postLists[r1].newComment = true;
              }
            }, 10);
          }
          setTimeout(() => {
            for (let i in this.postData) {
              this.postData[i].enableActionButton=true;
            }
          }, 2000);
          if(fromPush!='1' && othertype != 'edit-silent-push')
          {
            this.moveScroll(1);
          }
        }

        let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
        localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));

  }
  updateCommentSolr(pid,ptype,type,fromPush,PushColor,othertype)
  {
    console.log(this.postLists);
    let postAttachments = [];
    for (let i in this.postLists) {

      if(this.translatelangId != ''){
        this.postLists[i].transText = "Translate to "+this.translatelangArray['name'];
        this.postLists[i].transId = this.translatelangId;
      }
      else{
        this.postLists[i].transText = "Translate";
        this.postLists[i].transId = this.translatelangId;
      }
      this.postLists[i].newReply = false;
      this.postLists[i].enableActionButton = true;
      this.postLists[i].newComment = false;
      this.postLists[i].postView = true;
      this.postLists[i].postLoading = false;

      this.postLists[i].threadId = this.postLists[i].commentThreadId;
      this.postLists[i].postId = this.postLists[i].commentPostId;
      this.postLists[i].userName = this.postLists[i].commentUserName;
      this.postLists[i].userId = this.postLists[i].commentUserId;
      this.postLists[i].profileImage = this.postLists[i].commentProfileImage;
      this.postLists[i].postStatus = this.postLists[i].commentPostStatus;
      this.postLists[i].postType = this.postLists[i].commentPostType;
      this.postLists[i].deleteFlag = this.postLists[i].commentDeletedFlag;
      this.postLists[i].owner = this.postLists[i].commentOwnerInt;
      this.postLists[i].newComment = false;
      this.postLists[i].postStFlag = true;
      this.postLists[i].postLoading = false;

      this.postLists[i].postReplyLoading = false;
      this.postLists[i].userRoleTitle = this.postLists[i].commentuserRoleTitle !='' && this.postLists[i].commentuserRoleTitle !=undefined ? this.postLists[i].commentuserRoleTitle : 'No Title';
      let createdOnNew = this.postLists[i].commentCreatedOn;
      let createdOnDate = moment.utc(createdOnNew).toDate();
      //this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
      this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
      this.postLists[i].likeLoading = false;
      this.postLists[i].likeCount = this.postLists[i].commentLikeCount;
      this.postLists[i].likeCountVal = this.postLists[i].commentLikeCount == 0 ? '-' : this.postLists[i].commentLikeCount;
      if(this.postLists[i].likeCount == 0){
        this.postLists[i].likeCountValText = '';
      }
      else if(this.postLists[i].commentLikeCount == 1){
        this.postLists[i].likeCountValText = 'Like';
      }
      else{
        this.postLists[i].likeCountValText = 'Likes';
      }
      this.postLists[i].likeStatus = 0;
      if(this.postLists[i].commentLikedUsers != undefined){
        for(let a in this.postLists[i].commentLikedUsers) {
          if(this.postLists[i].commentLikedUsers[a] == this.userId) {
            this.postLists[i].likeStatus = 1;
          }
        }
      }
      //this.postLists[i].likeStatus = this.postLists[i].commentlikeStatus;
      this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
      this.postLists[i].attachmentLoading = false;
      if(this.postLists[i].commentUploadContents)
      {
        this.postLists[i].attachments = this.postLists[i].commentUploadContents;
        this.postLists[i].attachmentLoading = (this.postLists[i].commentUploadContents.length>0) ? false : true;
      }
      else
      {
        this.postLists[i].commentUploadContents=[];
        this.postLists[i].attachments=[];

      }
      this.postLists[i].action = 'view';
      this.postLists[i].threadOwnerLabel = false;
      this.postLists[i].userName=this.postLists[i].commentUserName;
      this.postLists[i].userId=this.postLists[i].commentUserId;
      this.postLists[i].profileImage = this.postLists[i].commentProfileImage;
      this.postLists[i].postStatus = this.postLists[i].commentPostStatus;
      this.postLists[i].postType = this.postLists[i].commentPostType;
      if(this.threadUserId  == this.postLists[i].commentUserId){
        this.postLists[i].threadOwnerLabel = true;
      }
      this.postLists[i].actionDisable = false;
      if(this.userId == this.postLists[i].commentUserId || this.postLists[i].ownerAccess == 1){
        this.postLists[i].actionDisable = true;
      }
      // post edit delete action
      /*this.postLists[i].editDeleteAction = false;
      if((this.userId == this.postLists[i].commentUserId || this.postLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
        this.postLists[i].editDeleteAction = true;
      }*/

      this.postLists[i].editDeleteAction = false;
      if(this.userId == this.postLists[i].commentUserId){
        this.postLists[i].editDeleteAction = true;
      }


                    if( this.postLists[i].automatedMessageStr=='1')
                    {
                      this.postLists[i].editDeleteAction = false;
                    }

      this.postLists[i].commentEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
      this.postLists[i].commentDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;

      if(!this.subscriberAccess)
      {
        this.postReplyLists[i].actionDisable = true;
        this.postReplyLists[i].commentEditAction=false;
        this.postReplyLists[i].commentDeleteAction=false;
      }
      postAttachments.push({
        id: this.postLists[i].postId,
        attachments: this.postLists[i].commentUploadContents
      });

      this.postLists[i].isEdited = this.postLists[i].commentIsEdited;
      if(this.postLists[i].commentEditHistory){
        let editdata = this.postLists[i].commentEditHistory;
        for (let ed in editdata) {
          editdata[ed].userName = editdata[ed].commentUserName;
          editdata[ed].profileImage = editdata[ed].commentProfileImage;
          editdata[ed].updatedOnNew = editdata[ed].commentUpdatedOn;
          let editdate1 = editdata[ed].updatedOnNew;
          let editdate2 = moment.utc(editdate1).toDate();
          editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
        }
        this.postLists[i].editHistory = editdata;
      }

      let contentWeb1 = '';
      contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].commentContent));
      this.postLists[i].editedWeb = contentWeb1;

      let contentWeb2 = contentWeb1;
      this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

      this.postLists[i].contentWebDuplicate = this.postLists[i].commentContent;
      this.postLists[i].contentDesc=this.postLists[i].commentContent;
      this.postLists[i].contentTranslate=this.postLists[i].commentContent;
      this.postLists[i].remindersData = this.postLists[i].remindersData != '' && this.postLists[i].remindersData != 'undefined' && this.postLists[i].remindersData != undefined ? this.postLists[i].remindersData : '';
      if(this.postLists[i].remindersData != ''){
        let prdata = this.postLists[i].remindersData;
        for (let pr in prdata) {
          let reminderdate1 = prdata[pr].createdOn;
          let reminderdate2 = moment.utc(reminderdate1).toDate();
          prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
        }
      }

      if(ptype == 'edit'){
        this.postReplyLists = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies : [] ;
        this.postReplyDataLength = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies.length : 0;
        if(this.postReplyDataLength>0){
         this.postLists[i].replyIdArr = [];
         for (let prr in this.postReplyLists) {
          this.postLists[i].replyIdArr.push(this.postReplyLists[prr].replyId);
         }
         this.postLists[i].commentReplyCount = this.postLists[i].replyIdArr.length;
         let cr = this.postLists[i].commentNestedReplies[this.postLists[i].commentNestedReplies.length - 1];
         this.postLists[i].commentNestedReplies = [];
         this.postLists[i].commentNestedReplies.push(cr);
        }
        else{
          this.postLists[i].replyIdArr=[];
          this.postLists[i].commentReplyCount=0;
          this.postLists[i].commentNestedReplies = []
        }

         this.postReplyLists = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies : [] ;
         this.postReplyDataLength = this.postLists[i].commentNestedReplies != undefined ? this.postLists[i].commentNestedReplies.length : 0;

        if(this.postReplyDataLength>0){
          let postReplyAttachments = [];
          for (let prl in this.postReplyLists) {
            this.postReplyLists[prl].postId = this.postReplyLists[prl].replyId;
            this.postReplyLists[prl].profileImage=this.postReplyLists[prl].replyProfileImage;
            this.postReplyLists[prl].userName=this.postReplyLists[prl].replyUserName;
            this.postReplyLists[prl].userId=this.postReplyLists[prl].replyUserId;
            this.postReplyLists[prl].postStatus = this.postReplyLists[prl].replyPostStatus;
            this.postReplyLists[prl].postType = this.postReplyLists[prl].replyPostType;
            this.postReplyLists[prl].deleteFlag = this.postReplyLists[prl].replyDeletedFlag;
            this.postReplyLists[prl].owner = this.postReplyLists[prl].replyOwnerInt;
            if(this.translatelangId != ''){
            this.postReplyLists[prl].transText = "Translate to "+this.translatelangArray['name'];
            this.postReplyLists[prl].transId = this.translatelangId;
            }
            else{
            this.postReplyLists[prl].transText = "Translate";
            this.postReplyLists[prl].transId = this.translatelangId;
            }
            this.postReplyLists[prl].postNew = false;
            this.postReplyLists[prl].newReply = false;
            this.postReplyLists[prl].postView = true;
            this.postReplyLists[prl].postStFlag = true;
            this.postReplyLists[prl].postReplyLoading = false;
            this.postReplyLists[prl].enableActionButton = true;
            this.postReplyLists[prl].userRoleTitle = this.postReplyLists[prl].replyUserRoleTitle !='' && this.postReplyLists[prl].replyUserRoleTitle != undefined ? this.postReplyLists[prl].replyUserRoleTitle : 'No Title';
            let createdOnNew = this.postReplyLists[prl].replyCreatedOn;
            let createdOnDate = moment.utc(createdOnNew).toDate();
            //this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
            this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
            this.postReplyLists[prl].likeLoading = false;
            this.postReplyLists[prl].likeCount = this.postReplyLists[prl].replyLikeCount;
            this.postReplyLists[prl].likeCountVal = this.postReplyLists[prl].replyLikeCount == 0 ? '-' : this.postReplyLists[prl].likeCount;
            if(this.postReplyLists[prl].likeCount == 0){
            this.postReplyLists[prl].likeCountValText = '';
            }
            else if(this.postReplyLists[prl].likeCount == 1){
            this.postReplyLists[prl].likeCountValText = 'Like';
            }
            else{
            this.postReplyLists[prl].likeCountValText = 'Likes';
            }
            this.postReplyLists[prl].likeStatus = 0;
            if(this.postReplyLists[prl].replyLikedUsers != undefined){
            for(let a in this.postReplyLists[prl].replyLikedUsers) {
              if(this.postReplyLists[prl].replyLikedUsers[a] == this.userId) {
              this.postReplyLists[prl].likeStatus = 1;
              }
            }
            }
            //this.postReplyLists[prl].likeStatus = this.postReplyLists[prl].replyLikeStatus;
            this.postReplyLists[prl].likeImg = (this.postReplyLists[prl].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
            if(this.postReplyLists[prl].replyUploadContents)
            {
            this.postReplyLists[prl].attachments = this.postReplyLists[prl].replyUploadContents;
            this.postReplyLists[prl].attachmentLoading = (this.postReplyLists[prl].replyUploadContents.length>0) ? false : true;
            }
            else
            {
            this.postReplyLists[prl].replyUploadContents=[];
            this.postReplyLists[prl].attachments=[];

            }
            this.postReplyLists[prl].action = 'view';
            this.postReplyLists[prl].threadOwnerLabel = false;
            if(this.threadUserId  == this.postReplyLists[prl].replyUserId){
            this.postReplyLists[prl].threadOwnerLabel = true;
            }
            this.postReplyLists[prl].actionDisable = false;
            if(this.userId == this.postReplyLists[prl].replyUserId || this.postReplyLists[prl].ownerAccess == 1){
            this.postReplyLists[prl].actionDisable = true;
            }
            // post edit delete action
            /*this.postReplyLists[prl].editDeleteAction = false;
            if((this.userId == this.postReplyLists[prl].userId || this.postReplyLists[prl].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
            this.postReplyLists[prl].editDeleteAction = true;
            }*/

            this.postReplyLists[prl].editDeleteAction = false;
            if(this.userId == this.postReplyLists[prl].replyUserId){
              this.postReplyLists[prl].editDeleteAction = true;
            }
            this.postReplyLists[prl].replyEditAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.edit;
            this.postReplyLists[prl].replyDeleteAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.delete;
            if(!this.subscriberAccess)
            {
              this.postReplyLists[prl].actionDisable = true;
              this.postReplyLists[prl].replyEditAction=false;
              this.postReplyLists[prl].replyDeleteAction=false;
            }
            postReplyAttachments.push({
            id: this.postReplyLists[prl].postId,
            attachments: this.postReplyLists[prl].uploadContents
            });

            this.postReplyLists[prl].isEdited = this.postReplyLists[prl].replyIsEdited;
            if(this.postReplyLists[prl].replyEditHistory){
            let editdata = this.postReplyLists[prl].replyEditHistory;
            for (let ed in editdata) {
              editdata[ed].userName = editdata[ed].replyUserName;
              editdata[ed].profileImage = editdata[ed].replyProfileImage;
              editdata[ed].updatedOnNew = editdata[ed].replyUpdatedOn;
              let editdate1 = editdata[ed].updatedOnNew;
              let editdate2 = moment.utc(editdate1).toDate();
              editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
            }
            this.postReplyLists[prl].editHistory = editdata;
            }

            this.postReplyLists[prl].remindersData = this.postReplyLists[prl].remindersData != '' && this.postReplyLists[prl].remindersData != undefined && this.postReplyLists[prl].remindersData != 'undefined' ? this.postReplyLists[prl].remindersData : '';
            if(this.postReplyLists[prl].remindersData != ''){
            let prdata = this.postReplyLists[prl].remindersData;
            for (let prr in prdata) {
              let reminderdate1 = prdata[prr].createdOn;
              let reminderdate2 = moment.utc(reminderdate1).toDate();
              prdata[prr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
            }
            }

            let contentWeb1 = '';
            contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postReplyLists[prl].replyContentWeb));
            this.postReplyLists[prl].editedWeb = contentWeb1;

            let contentWeb2 = contentWeb1;
            this.postReplyLists[prl].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

            this.postReplyLists[prl].contentWebDuplicate = this.postReplyLists[prl].replyContentWeb;
            this.postReplyLists[prl].replyContent = this.postReplyLists[prl].replyContentWeb;
            this.postReplyLists[prl].content = this.postReplyLists[prl].replyContentWeb;
            this.postReplyLists[prl].contentTranslate = this.postReplyLists[prl].replyContentWeb;
          }
          let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
          localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));

          this.postLists[i].commentNestedReplies = this.postReplyLists;
        }

      }
      else{
        this.postLists[i].replyIdArr=[];
        this.postLists[i].commentReplyCount=0;
        this.postLists[i].commentNestedReplies = []
      }

      if(ptype == 'edit'){
        let itemIndex = this.postData.findIndex(item => item.postId == pid);
        this.postData[itemIndex] = this.postLists[i];
        setTimeout(() => {
          this.postData[itemIndex].enableActionButton = true;
        }, 2000);
      }
      else{
         //checking duplicate
         console.log(this.postLists[i]);
         let itemIndex1 = this.postData.findIndex(item => item.postId == pid);
         if (itemIndex1 < 0) {
           this.postData.push(this.postLists[i]);
         }
      }

    }

    if(type == 'replynew'){
      let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
          //let itemIndex2 = this.postData[itemIndex1].commentNestedReplies.findIndex(item => item.postId == pid);
          //this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[i];

          if(PushColor=='1')
          {
            setTimeout(() => {

              this.postData[itemIndex1].commentNestedReplies[0].newReply = true;
              //this.postData[itemIndex1].nestedReplies[0].newReply = true;
            }, 10);
          }
          if(this.deleteActionFlag){
            setTimeout(() => {
              this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
              //this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
              this.deleteActionFlag = false;
            }, 2000);
          }
          else{
            setTimeout(() => {
              this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
              //this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
            }, 2000);
          }


          if(fromPush!='1')
          {
        // this.moveScroll(1);
          }
          if(fromPush=='1')
          {
            setTimeout(() => {
              this.moveScrollNotify(pid);
            }, 500);

          }
    }
    else{
      if(PushColor=='1')
      {
        setTimeout(() => {
          for (let r1 in this.postLists) {
            this.postLists[r1].newComment = true;
          }
        }, 10);
      }
      setTimeout(() => {
        for (let i in this.postData) {
          this.postData[i].enableActionButton=true;
        }
      }, 2000);
      if(fromPush!='1' && othertype != 'edit-silent-push')
      {
        this.moveScroll(1);
      }
    }

    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));

  }

  // post list
  getPostList(){
    if(this.threadId != undefined){
      let newArr = [];
      this.platformId=localStorage.getItem('platformId');
      const apiFormData = new FormData();

      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      if(!this.fromNotificationPageFlag){
        apiFormData.append('limit', this.itemLimit);
        apiFormData.append('offset', this.itemOffset);
      }
      apiFormData.append('platformId', this.platformId);
      apiFormData.append('type', "0");
      apiFormData.append('version', "2");
      apiFormData.append('platform', this.accessPlatForm);
      this.threadPostService.getPostListAPI(apiFormData).subscribe(res => {
        if(res.status=='Success'){
            this.postLists = res.data.post;
            this.postDataLength = res.data.total;
            if(this.postDataLength>0){
              this.itemTotal = this.postDataLength;
              this.itemLength += this.postLists.length;
              this.itemOffset += this.itemLimit;
              let postAttachments = [];
              for (let i in this.postLists) {
                //this.postLists[i].transText = "Translate";

                this.postLists[i].commentPostId = this.postLists[i].postId;
                this.postLists[i].commentThreadId = this.postLists[i].threadId;
                this.postLists[i].commentUserName = this.postLists[i].userName;
                this.postLists[i].commentProfileImage = this.postLists[i].profileImage;
                this.postLists[i].commentUserId = this.postLists[i].userId;
                this.postLists[i].commentPostStatus = this.postLists[i].postStatus;
                this.postLists[i].commentPostType = this.postLists[i].postType;

                if(this.translatelangId != ''){
                  this.postLists[i].transText = "Translate to "+this.translatelangArray['name'];
                  this.postLists[i].transId = this.translatelangId;
                }
                else{
                  this.postLists[i].transText = "Translate";
                  this.postLists[i].transId = this.translatelangId;
                }
                this.postLists[i].postView = true;
                this.postLists[i].newComment = false;
                this.postLists[i].postStFlag = true;
                this.postLists[i].postLoading = false;
                this.postLists[i].postReplyLoading = false;
                this.postLists[i].enableActionButton = true;
                this.postLists[i].commentPostId = this.postLists[i].postId;
                this.postLists[i].commentThreadId = this.postLists[i].threadId;
                this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' && this.postLists[i].userRoleTitle !=undefined ? this.postLists[i].userRoleTitle : 'No Title';
                let createdOnNew = this.postLists[i].createdOnNew;
                let createdOnDate = moment.utc(createdOnNew).toDate();
                //this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
                this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
                this.postLists[i].likeLoading = false;
                this.postLists[i].likeCount = this.postLists[i].likeCount;
                this.postLists[i].likeCountVal = this.postLists[i].likeCount == 0 ? '-' : this.postLists[i].likeCount;
                if(this.postLists[i].likeCount == 0){
                  this.postLists[i].likeCountValText = '';
                }
                else if(this.postLists[i].likeCount == 1){
                  this.postLists[i].likeCountValText = 'Like';
                }
                else{
                  this.postLists[i].likeCountValText = 'Likes';
                }
                this.postLists[i].likeStatus = 0;
                if(this.postLists[i].commentLikedUsers != undefined){
                  for(let a in this.postLists[i].commentLikedUsers) {
                    if(this.postLists[i].commentLikedUsers[a] == this.userId) {
                      this.postLists[i].likeStatus = 1;
                    }
                  }
                }
                //this.postLists[i].likeStatus = this.postLists[i].likeStatus;
                this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                this.postLists[i].attachments = this.postLists[i].uploadContents;
                this.postLists[i].attachmentLoading = (this.postLists[i].uploadContents.length>0) ? false : true;
                this.postLists[i].action = 'view';
                this.postLists[i].threadOwnerLabel = false;
                if(this.threadUserId  == this.postLists[i].userId){
                  this.postLists[i].threadOwnerLabel = true;
                }
                this.postLists[i].actionDisable = false;
                if(this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1){
                  this.postLists[i].actionDisable = true;
                }
                // post edit delete action
                /*this.postLists[i].editDeleteAction = false;
                if((this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                  this.postLists[i].editDeleteAction = true;
                }*/

                this.postLists[i].editDeleteAction = false;
                if(this.userId == this.postLists[i].userId){
                  this.postLists[i].editDeleteAction = true;
                }
                this.postLists[i].commentEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
                this.postLists[i].commentDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;
                if(!this.subscriberAccess)
                {
                  this.postReplyLists[i].actionDisable = true;
                  this.postReplyLists[i].commentDeleteAction=false;
                  this.postReplyLists[i].commentEditAction=false;
                }
                postAttachments.push({
                  id: this.postLists[i].postId,
                  attachments: this.postLists[i].uploadContents
                });

                if(this.postLists[i].editHistory){
                  let editdata = this.postLists[i].editHistory;
                  for (let ed in editdata) {
                    let editdate1 = editdata[ed].updatedOnNew;
                    let editdate2 = moment.utc(editdate1).toDate();
                    editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                  }
                }

                let contentWeb1 = '';
                contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].contentWeb));
                this.postLists[i].editedWeb = contentWeb1;

                let contentWeb2 = contentWeb1;
                this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));


                this.postLists[i].contentWebDuplicate = this.postLists[i].contentWeb;
                this.postLists[i].contentDesc=this.postLists[i].contentWebV2;
                this.postLists[i].contentTranslate=this.postLists[i].content;
              this.postLists[i].remindersData = this.postLists[i].remindersData != '' && this.postLists[i].remindersData != 'undefined' && this.postLists[i].remindersData != undefined ? this.postLists[i].remindersData : '';
                if(this.postLists[i].remindersData != ''){
                  let prdata = this.postLists[i].remindersData;
                  for (let pr in prdata) {
                    let reminderdate1 = prdata[pr].createdOn;
                    let reminderdate2 = moment.utc(reminderdate1).toDate();
                    prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                  }
                }

                this.postReplyLists = this.postLists[i].nestedReplies != undefined ? this.postLists[i].nestedReplies : [] ;
                this.postReplyDataLength = this.postLists[i].nestedReplies != undefined ? this.postLists[i].nestedReplies.length : 0;

                //get last record..
                if(this.postReplyDataLength>0){
                  this.postLists[i].replyIdArr = [];
                  for (let prr in this.postReplyLists) {
                    this.postLists[i].replyIdArr.push(this.postReplyLists[prr].postId);
                  }
                  this.postLists[i].commentReplyCount = this.postLists[i].replyIdArr.length;
                  let cr = this.postLists[i].nestedReplies[this.postLists[i].nestedReplies.length - 1];
                  this.postLists[i].nestedReplies = [];
                  this.postLists[i].nestedReplies.push(cr);
                }
                else{
                  this.postLists[i].replyIdArr=[];
                  this.postLists[i].commentReplyCount=0;
                  this.postLists[i].commentNestedReplies = []
                }
                this.postReplyLists = this.postLists[i].nestedReplies != undefined ? this.postLists[i].nestedReplies : [] ;
                this.postReplyDataLength = this.postLists[i].nestedReplies != undefined ? this.postLists[i].nestedReplies.length : 0;
                if(this.postReplyDataLength>0){
                  let postReplyAttachments = [];
                  for (let prl in this.postReplyLists) {
                    this.postReplyLists[prl].replyId  = this.postReplyLists[prl].postId;
                    this.postReplyLists[prl].replyUserId = this.postReplyLists[prl].userId;
                    this.postReplyLists[prl].replyUserName = this.postReplyLists[prl].userName;
                    this.postReplyLists[prl].replyProfileImage = this.postReplyLists[prl].profileImage;
                    this.postReplyLists[prl].replyPostStatus = this.postReplyLists[prl].postStatus;
                    this.postReplyLists[prl].replyPostType = this.postReplyLists[prl].postType;
                    if(this.translatelangId != ''){
                      this.postReplyLists[prl].transText = "Translate to "+this.translatelangArray['name'];
                      this.postReplyLists[prl].transId = this.translatelangId;
                    }
                    else{
                      this.postReplyLists[prl].transText = "Translate";
                      this.postReplyLists[prl].transId = this.translatelangId;
                    }
                    this.postReplyLists[prl].postNew = false;
                    this.postReplyLists[prl].newReply = false;
                    this.postReplyLists[prl].postView = true;
                    this.postReplyLists[prl].postStFlag = true;
                    this.postReplyLists[prl].postReplyLoading = false;
                    this.postReplyLists[prl].enableActionButton = true;
                    this.postReplyLists[prl].userRoleTitle = this.postReplyLists[prl].userRoleTitle !='' && this.postReplyLists[prl].userRoleTitle !=undefined ? this.postReplyLists[prl].userRoleTitle : 'No Title';
                    let createdOnNew = this.postReplyLists[prl].createdOnNew;
                    let createdOnDate = moment.utc(createdOnNew).toDate();
                    //this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
                    this.postReplyLists[prl].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
                    this.postReplyLists[prl].likeLoading = false;
                    this.postReplyLists[prl].likeCount = this.postReplyLists[prl].likeCount;
                    this.postReplyLists[prl].likeCountVal = this.postReplyLists[prl].likeCount == 0 ? '-' : this.postReplyLists[prl].likeCount;
                    if(this.postReplyLists[prl].likeCount == 0){
                      this.postReplyLists[prl].likeCountValText = '';
                    }
                    else if(this.postReplyLists[prl].likeCount == 1){
                      this.postReplyLists[prl].likeCountValText = 'Like';
                    }
                    else{
                      this.postReplyLists[prl].likeCountValText = 'Likes';
                    }
                    this.postReplyLists[i].likeStatus = 0;
                    if(this.postReplyLists[i].replyLikedUsers != undefined){
                      for(let a in this.postReplyLists[i].replyLikedUsers) {
                        if(this.postReplyLists[i].replyLikedUsers[a] == this.userId) {
                          this.postReplyLists[i].likeStatus = 1;
                        }
                      }
                    }
                    //this.postReplyLists[prl].likeStatus = this.postReplyLists[prl].likeStatus;
                    this.postReplyLists[prl].likeImg = (this.postReplyLists[prl].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                    this.postReplyLists[prl].attachments = this.postReplyLists[prl].uploadContents;
                    this.postReplyLists[prl].attachmentLoading = (this.postReplyLists[prl].uploadContents.length>0) ? false : true;
                    this.postReplyLists[prl].action = 'view';
                    this.postReplyLists[prl].threadOwnerLabel = false;
                    if(this.threadUserId  == this.postReplyLists[prl].userId){
                      this.postReplyLists[prl].threadOwnerLabel = true;
                    }
                    this.postReplyLists[prl].actionDisable = false;
                    if(this.userId == this.postReplyLists[prl].userId || this.postReplyLists[prl].ownerAccess == 1){
                      this.postReplyLists[prl].actionDisable = true;
                    }
                    // post edit delete action
                    /*this.postReplyLists[prl].editDeleteAction = false;
                    if((this.userId == this.postReplyLists[prl].userId || this.postReplyLists[prl].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                      this.postReplyLists[prl].editDeleteAction = true;
                    }*/

                    this.postReplyLists[prl].editDeleteAction = false;
                    if(this.userId == this.postReplyLists[prl].userId){
                      this.postReplyLists[prl].editDeleteAction = true;
                    }
                    this.postReplyLists[prl].replyEditAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.edit;
                    this.postReplyLists[prl].replyDeleteAction = this.postReplyLists[prl].editDeleteAction ? true : this.accessLevel.delete;

                    if(!this.subscriberAccess)
                    {
                      this.postReplyLists[prl].actionDisable = true;
                      this.postReplyLists[prl].replyEditAction=false;
                      this.postReplyLists[prl].replyDeleteAction=false;
                    }
                    postReplyAttachments.push({
                      id: this.postReplyLists[prl].postId,
                      attachments: this.postReplyLists[prl].uploadContents
                    });

                    if(this.postReplyLists[prl].editHistory){
                      let editdata = this.postReplyLists[prl].editHistory;
                      for (let ed in editdata) {
                        let editdate1 = editdata[ed].updatedOnNew;
                        let editdate2 = moment.utc(editdate1).toDate();
                        editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                      }
                    }

                    this.postReplyLists[prl].remindersData = this.postReplyLists[prl].remindersData != '' && this.postReplyLists[prl].remindersData != undefined && this.postReplyLists[prl].remindersData != 'undefined' ? this.postReplyLists[prl].remindersData : '';
                    if(this.postReplyLists[prl].remindersData != ''){
                      let prdata = this.postReplyLists[prl].remindersData;
                      for (let prr in prdata) {
                        let reminderdate1 = prdata[prr].createdOn;
                        let reminderdate2 = moment.utc(reminderdate1).toDate();
                        prdata[prr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                      }
                    }

                    let contentWeb1 = '';
                    contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postReplyLists[prl].contentWeb));
                    this.postReplyLists[prl].editedWeb = contentWeb1;

                    let contentWeb2 = contentWeb1;
                    this.postReplyLists[prl].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

                    this.postReplyLists[prl].contentWebDuplicate = this.postReplyLists[prl].contentWeb;
                    this.postReplyLists[prl].content = this.postReplyLists[prl].contentWeb;
                    this.postReplyLists[prl].contentTranslate = this.postReplyLists[prl].content;
                  }

                  let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
                  localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));
                  this.postLists[i].commentNestedReplies = this.postReplyLists;
                }

                // push data
                if(this.fromNotificationPageFlag){
                  newArr.push(this.postLists[i]);
                }
                else{
                  this.postData.push(this.postLists[i]);
                }

              }

              if(this.fromNotificationPageFlag){
                this.postData = newArr;
              }

              let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
              localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));

              if(!this.fromNotificationPageFlag){
                setTimeout(() => {
                  if(this.itemTotal >= this.itemLength && this.itemTotal >= this.itemOffset ){
                    this.getPostList();
                  }
                  else{
                    this.postLoading = false;
                    this.newPostLoad = false;
                    this.buttonTop = true;
                    this.buttonBottom = false;
                  }
                }, 1000);
              }
              else{
                setTimeout(() => {
                  this.postLoading = false;
                  this.newPostLoad = false;
                  this.buttonTop = true;
                  this.buttonBottom = false;
                  let id = localStorage.getItem("notificationTPID");
                  if(this.fromNotificationPageFlag){
                    this.moveScrollNotify(id);
                    setTimeout(() => {
                      localStorage.removeItem("notificationOnTap");
                      localStorage.removeItem("notificationTPID");
                      this.fromNotificationPageFlag = false;
                    }, 100);
                  }
                }, this.timeOutNt);
              }

            }
            else{
              this.postLoading = false;
              this.postErrorMsg = res.result;
              this.postError = true;
            }
          }
          else{
          // this.postData = [];
            this.postLoading = false;
            this.postErrorMsg = res.result;
            this.postError = true;
          }
        },
        (error => {
          this.postLoading = false;
          this.postErrorMsg = error;
          this.postError  = true;
        })
      );
    }
  }


  getPostFixListSolr(){
    // return;
     this.postFixRefresh = false;
     // collabtic platform only

       this.platformId=localStorage.getItem('platformId');
      // const apiFormData = new FormData();

       var objData = {};
       var FilterData = {};

  objData["userId"]=this.userId;
  objData["type"]=1;
  objData["domainId"]=this.domainId;
  objData["threadId"]=this.threadId;

  //FilterData['commentPostType']='Fix';
 // FilterData['replyPostType']='Fix';
  FilterData['commentPostStatus']=[1,2];
  FilterData['replyPostStatus']=[1,2];
  objData["filters"]=FilterData;

    this.threadPostService.getthreadDetailsFixes(objData).subscribe(res => {

      console.log(res);

         if(res.status=='Success'){
             this.postFixLists = res.postListData;
             this.postFixDataLength = res.postListData.length;
             if(this.postFixDataLength>0){
               this.itemFixTotal = this.postFixDataLength;
               let postFixAttachments = [];
               this.postFixData = [];
               for (let i in this.postFixLists) {
                 this.postFixLists[i].availability = '';
                 this.postFixLists[i].availabilityStatusName = '';
                 this.postFixLists[i].profileShow = false;
                 this.postFixLists[i].postView = true;
                 this.postFixLists[i].newComment = false;
                 this.postFixLists[i].postStFlag = true;
                 this.postFixLists[i].postLoading = false;
                 this.postFixLists[i].postReplyLoading = false;
                 if(this.postFixLists[i].commentPostId && !this.postFixLists[i].replyPostId)
                 {



                 this.postFixLists[i].userRoleTitle = this.postFixLists[i].commentUserRoleTitle !='' && this.postFixLists[i].commentUserRoleTitle != undefined ? this.postFixLists[i].commentUserRoleTitle : 'No Title';
                 let createdOnNew = this.postFixLists[i].commentCreatedOn;
                 let createdOnDate = moment.utc(createdOnNew).toDate();
                 //this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
                 this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
                 this.postFixLists[i].likeLoading = false;
                 this.postFixLists[i].likeCount = this.postFixLists[i].commentLikeCount;
                 this.postFixLists[i].likeCountVal = this.postFixLists[i].commentLikeCount == 0 ? '-' : this.postFixLists[i].commentLikeCount;
                 this.postFixLists[i].postType=this.postFixLists[i].commentPostType;
                 this.postFixLists[i].userName=this.postFixLists[i].commentUserName;
                 this.postFixLists[i].userId=this.postFixLists[i].commentUserId;
                 this.postFixLists[i].postStatus=this.postFixLists[i].commentPostStatus;
                 this.postFixLists[i].postId = this.postFixLists[i].commentId;
                 this.postFixLists[i].postId= this.postFixLists[i].commentPostId;
                 this.postFixLists[i].owner= this.postFixLists[i].commentOwnerInt;

                 if(this.postFixLists[i].likeCount == 0){
                   this.postFixLists[i].likeCountValText = '';
                 }
                 else if(this.postFixLists[i].likeCount == 1){
                   this.postFixLists[i].likeCountValText = 'Like';
                 }
                 else{
                   this.postFixLists[i].likeCountValText = 'Likes';
                 }
                 this.postFixLists[i].likeStatus = 0;
                 if(this.postFixLists[i].commentLikedUsers != undefined){
                  for(let a in this.postFixLists[i].commentLikedUsers) {
                    if(this.postFixLists[i].commentLikedUsers[a] == this.userId) {
                      this.postFixLists[i].likeStatus = 1;
                    }
                  }
                }
                 //this.postFixLists[i].likeStatus = this.postFixLists[i].likeStatus;
                 this.postFixLists[i].likeImg = (this.postFixLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                 this.postFixLists[i].attachments=[];
                 this.postFixLists[i].attachmentLoading=false;
                 if(this.postFixLists[i].commentUploadContents)
                {
                  this.postFixLists[i].attachments = this.postFixLists[i].commentUploadContents;
                  this.postFixLists[i].attachmentLoading = (this.postFixLists[i].commentUploadContents.length>0) ? false : true;
                }
                else
                {
                  this.postFixLists[i].commentUploadContents=[];
                }


                 this.postFixLists[i].action = 'view';
                 this.postFixLists[i].threadOwnerLabel = false;
                 if(this.threadUserId  == this.postFixLists[i].commentUserId){
                   this.postFixLists[i].threadOwnerLabel = true;
                 }
                 this.postFixLists[i].actionDisable = false;
                 if(this.userId == this.postFixLists[i].commentUserId || this.postFixLists[i].ownerAccess == 1){
                   this.postFixLists[i].actionDisable = true;
                 }
                 // post edit delete action
                 /*this.postFixLists[i].editDeleteAction = false;
                 if((this.userId == this.postFixLists[i].commentUserId || this.postFixLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                   this.postFixLists[i].editDeleteAction = true;
                 }*/

                 this.postFixLists[i].editDeleteAction = false;
                 if(this.userId == this.postFixLists[i].commentUserId){
                   this.postFixLists[i].editDeleteAction = true;
                 }


                    if( this.postLists[i].automatedMessageStr=='1')
                    {
                      this.postLists[i].editDeleteAction = false;
                    }

                 this.postFixLists[i].commentEditAction = this.postFixLists[i].editDeleteAction ? true : this.accessLevel.edit;
                 this.postFixLists[i].commentDeleteAction = this.postFixLists[i].editDeleteAction ? true : this.accessLevel.delete;

                 if(!this.subscriberAccess)
                 {
                   this.postFixLists[i].actionDisable = true;
                   this.postFixLists[i].commentEditAction=false;
                   this.postFixLists[i].commentDeleteAction=false;
                 }
                 postFixAttachments.push({
                   id: this.postFixLists[i].commentPostId,
                   attachments: this.postFixLists[i].attachments
                 });

                 this.postFixLists[i].isEdited = this.postFixLists[i].commentIsEdited;
                 if(this.postFixLists[i].commentEditHistory){
                   let editdata = this.postFixLists[i].commentEditHistory;
                   for (let ed in editdata) {
                      editdata[ed].userName = editdata[ed].commentUserName;
                      editdata[ed].profileImage = editdata[ed].commentProfileImage;
                      editdata[ed].updatedOnNew = editdata[ed].commentUpdatedOn;
                     let editdate1 = editdata[ed].updatedOnNew;
                     let editdate2 = moment.utc(editdate1).toDate();
                     editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                   }
                   this.postFixLists[i].editHistory = editdata;
                 }

                 let contentWeb1 = '';
                 contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postFixLists[i].commentContent));
                 this.postFixLists[i].editedWeb = contentWeb1;

                 let contentWeb2 = contentWeb1;
                 this.postFixLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

              /* this.postFixLists[i].remindersData = this.postFixLists[i].remindersData != '' && this.postFixLists[i].remindersData != 'undefined' && this.postFixLists[i].remindersData != undefined ? this.postFixLists[i].remindersData : '';
               if(this.postFixLists[i].remindersData != ''){
                   let prdata = this.postFixLists[i].remindersData;
                   for (let pr in prdata) {
                     let reminderdate1 = prdata[pr].createdOn;
                     let reminderdate2 = moment.utc(reminderdate1).toDate();
                     prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                   }
                 }  */
                 this.postFixData.push(this.postFixLists[i]);
                }
                if(this.postFixLists[i].replyPostId)
                {



                this.postFixLists[i].userRoleTitle = this.postFixLists[i].replyUserRoleTitle !='' && this.postFixLists[i].replyUserRoleTitle != undefined ? this.postFixLists[i].replyUserRoleTitle : 'No Title';
                let createdOnNew = this.postFixLists[i].replyCreatedOn;
                let createdOnDate = moment.utc(createdOnNew).toDate();
                //this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
                this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
                this.postFixLists[i].likeLoading = false;
                this.postFixLists[i].likeCount = this.postFixLists[i].replyLikeCount;
                this.postFixLists[i].likeCountVal = this.postFixLists[i].creplyLikeCount == 0 ? '-' : this.postFixLists[i].replyLikeCount;
                this.postFixLists[i].postType=this.postFixLists[i].replyPostType;
                this.postFixLists[i].postStatus=this.postFixLists[i].replyPostStatus;
                this.postFixLists[i].userName=this.postFixLists[i].replyUserName;
                this.postFixLists[i].userId=this.postFixLists[i].replyUserId;
                this.postFixLists[i].postId = this.postFixLists[i].replyId;
                this.postFixLists[i].postId= this.postFixLists[i].replyPostId;
                this.postFixLists[i].owner= this.postFixLists[i].replyOwnerInt;

                this.postFixLists[i].postStatus=this.postFixLists[i].replyPostStatus;
                if(this.postFixLists[i].likeCount == 0){
                  this.postFixLists[i].likeCountValText = '';
                }
                else if(this.postFixLists[i].likeCount == 1){
                  this.postFixLists[i].likeCountValText = 'Like';
                }
                else{
                  this.postFixLists[i].likeCountValText = 'Likes';
                }
                this.postFixLists[i].likeStatus = 0;
                if(this.postFixLists[i].replyLikedUsers != undefined){
                  for(let a in this.postFixLists[i].replyLikedUsers) {
                    if(this.postFixLists[i].replyLikedUsers[a] == this.userId) {
                      this.postFixLists[i].likeStatus = 1;
                    }
                  }
                }
                //this.postFixLists[i].likeStatus = this.postFixLists[i].likeStatus;
                this.postFixLists[i].likeImg = (this.postFixLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                this.postFixLists[i].attachments=[];
                this.postFixLists[i].attachmentLoading=false;
                if(this.postFixLists[i].replyUploadContents)
               {
                 this.postFixLists[i].attachments = this.postFixLists[i].replyUploadContents;
                 this.postFixLists[i].attachmentLoading = (this.postFixLists[i].replyUploadContents.length>0) ? false : true;
               }
               else
               {
                 this.postFixLists[i].attachments=[];
               }


                this.postFixLists[i].action = 'view';
                this.postFixLists[i].threadOwnerLabel = false;
                if(this.threadUserId  == this.postFixLists[i].replyUserId){
                  this.postFixLists[i].threadOwnerLabel = true;
                }
                this.postFixLists[i].actionDisable = false;
                if(this.userId == this.postFixLists[i].userId || this.postFixLists[i].ownerAccess == 1){
                  this.postFixLists[i].actionDisable = true;
                }
                // post edit delete action
                /*this.postFixLists[i].editDeleteAction = false;
                if((this.userId == this.postFixLists[i].replyUserId || this.postFixLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                  this.postFixLists[i].editDeleteAction = true;
                }*/

                this.postFixLists[i].editDeleteAction = false;
                if(this.userId == this.postFixLists[i].replyUserId){
                  this.postFixLists[i].editDeleteAction = true;
                }
                this.postFixLists[i].replyEditAction = this.postFixLists[i].editDeleteAction ? true : this.accessLevel.edit;
                this.postFixLists[i].replyDeleteAction = this.postFixLists[i].editDeleteAction ? true : this.accessLevel.delete;

                if(!this.subscriberAccess)
                {
                  this.postFixLists[i].actionDisable = true;
                  this.postFixLists[i].replyEditAction=false;
                  this.postFixLists[i].replyDeleteAction=false;
                }
                postFixAttachments.push({
                  id: this.postFixLists[i].replyPostId,
                  attachments: this.postFixLists[i].attachments
                });

                this.postFixLists[i].isEdited = this.postFixLists[i].replyIsEdited;
                if(this.postFixLists[i].replyEditHistory){
                  let editdata = this.postFixLists[i].replyEditHistory;
                  for (let ed in editdata) {
                    editdata[ed].userName = editdata[ed].replyUserName;
                    editdata[ed].profileImage = editdata[ed].replyProfileImage;
                    editdata[ed].updatedOnNew = editdata[ed].replyUpdatedOn;
                    let editdate1 = editdata[ed].updatedOnNew;
                    let editdate2 = moment.utc(editdate1).toDate();
                    editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                  }
                  this.postFixLists[i].editHistory = editdata;
                }

                let contentWeb1 = '';
                contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postFixLists[i].replyContentWeb));
                this.postFixLists[i].editedWeb = contentWeb1;

                let contentWeb2 = contentWeb1;
                this.postFixLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

             /* this.postFixLists[i].remindersData = this.postFixLists[i].remindersData != '' && this.postFixLists[i].remindersData != 'undefined' && this.postFixLists[i].remindersData != undefined ? this.postFixLists[i].remindersData : '';
              if(this.postFixLists[i].remindersData != ''){
                  let prdata = this.postFixLists[i].remindersData;
                  for (let pr in prdata) {
                    let reminderdate1 = prdata[pr].createdOn;
                    let reminderdate2 = moment.utc(reminderdate1).toDate();
                    prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                  }
                }  */
                this.postFixData.push(this.postFixLists[i]);
               }
               }
               let threadPostStorageText = `thread-post-fix-${this.threadId}-attachments`;
               localStorage.setItem(threadPostStorageText, JSON.stringify(postFixAttachments));

               if(this.newPostFixFlag){
                 setTimeout(() => {
                   //this.newPostFixScrollFlag = true;
                   //this.moveScroll(this.parentPostId);
                   setTimeout(() => {
                     this.newPostFixFlag = false;
                   }, 1000);
                 }, 1);
               }
             }
             else{
               this.postFixData = [];
               this.postFixLoading = false;
               this.postFixErrorMsg = res.result;
               this.postFixError = true;
             }
           }
           else{
             this.postFixData = [];
             this.postFixLoading = false;
             this.postFixErrorMsg = res.result;
             this.postFixError = true;
           }
         },
         (error => {
           this.postFixData = [];
           this.postFixLoading = false;
           this.postFixErrorMsg = error;
           this.postFixError  = true;
         })
       );

   }
  // post list
  getPostFixList(){
    if(this.threadId != undefined){
    // return;
      this.postFixRefresh = false;
      // collabtic platform only

        this.platformId=localStorage.getItem('platformId');
        const apiFormData = new FormData();

        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('threadId', this.threadId);
        //apiFormData.append('limit', this.itemLimit);
        //apiFormData.append('offset', this.itemOffset);
        apiFormData.append('platformId', this.platformId);
        apiFormData.append('type', "1");
        apiFormData.append('version', "2");
        apiFormData.append('platform', this.accessPlatForm);
        this.threadPostService.getPostListAPI(apiFormData).subscribe(res => {
          if(res.status=='Success'){
              this.postFixLists = res.data.post;
              this.postFixDataLength = res.data.total;
              if(this.postFixDataLength>0){
                this.itemFixTotal = this.postFixDataLength;
                let postFixAttachments = [];
                this.postFixData = [];
                for (let i in this.postFixLists) {
                  this.postFixLists[i].postView = true;
                  this.postFixLists[i].newComment = false;
                  this.postFixLists[i].postStFlag = true;
                  this.postFixLists[i].postLoading = false;
                  this.postFixLists[i].postReplyLoading = false;
                  this.postFixLists[i].userRoleTitle = this.postFixLists[i].userRoleTitle !='' && this.postFixLists[i].userRoleTitle != undefined ? this.postFixLists[i].userRoleTitle : 'No Title';
                  let createdOnNew = this.postFixLists[i].createdOnNew;
                  let createdOnDate = moment.utc(createdOnNew).toDate();
                  //this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
                  this.postFixLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
                  this.postFixLists[i].likeLoading = false;
                  this.postFixLists[i].likeCount = this.postFixLists[i].likeCount;
                  this.postFixLists[i].likeCountVal = this.postFixLists[i].likeCount == 0 ? '-' : this.postFixLists[i].likeCount;
                  if(this.postFixLists[i].likeCount == 0){
                    this.postFixLists[i].likeCountValText = '';
                  }
                  else if(this.postFixLists[i].likeCount == 1){
                    this.postFixLists[i].likeCountValText = 'Like';
                  }
                  else{
                    this.postFixLists[i].likeCountValText = 'Likes';
                  }
                  this.postFixLists[i].likeStatus = 0;
                  if(this.postFixLists[i].commentLikedUsers != undefined){
                    for(let a in this.postFixLists[i].commentLikedUsers) {
                      if(this.postFixLists[i].commentLikedUsers[a] == this.userId) {
                        this.postFixLists[i].likeStatus = 1;
                      }
                    }
                  }
                  //this.postFixLists[i].likeStatus = this.postFixLists[i].likeStatus;
                  this.postFixLists[i].likeImg = (this.postFixLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                  this.postFixLists[i].attachments = this.postFixLists[i].uploadContents;
                  this.postFixLists[i].attachmentLoading = (this.postFixLists[i].uploadContents.length>0) ? false : true;
                  this.postFixLists[i].action = 'view';
                  this.postFixLists[i].threadOwnerLabel = false;
                  if(this.threadUserId  == this.postFixLists[i].userId){
                    this.postFixLists[i].threadOwnerLabel = true;
                  }
                  this.postFixLists[i].actionDisable = false;
                  if(this.userId == this.postFixLists[i].userId || this.postFixLists[i].ownerAccess == 1){
                    this.postFixLists[i].actionDisable = true;
                  }
                  // post edit delete action
                  /*this.postFixLists[i].editDeleteAction = false;
                  if((this.userId == this.postFixLists[i].userId || this.postFixLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                    this.postFixLists[i].editDeleteAction = true;
                  }*/

                  this.postFixLists[i].editDeleteAction = false;
                  if(this.userId == this.postFixLists[i].userId){
                    this.postFixLists[i].editDeleteAction = true;
                  }
                  this.postFixLists[i].commentEditAction = this.postFixLists[i].editDeleteAction ? true : this.accessLevel.edit;
                  this.postFixLists[i].commentDeleteAction = this.postFixLists[i].editDeleteAction ? true : this.accessLevel.delete;

                  if(!this.subscriberAccess)
                  {
                    this.postFixLists[i].actionDisable = true;
                    this.postFixLists[i].commentEditAction=false;
                    this.postFixLists[i].commentDeleteAction=false;
                  }
                  postFixAttachments.push({
                    id: this.postFixLists[i].postId,
                    attachments: this.postFixLists[i].uploadContents
                  });

                  if(this.postFixLists[i].editHistory){
                    let editdata = this.postFixLists[i].editHistory;
                    for (let ed in editdata) {
                      let editdate1 = editdata[ed].updatedOnNew;
                      let editdate2 = moment.utc(editdate1).toDate();
                      editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                    }
                  }

                  let contentWeb1 = '';
                  contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postFixLists[i].contentWeb));
                  this.postFixLists[i].editedWeb = contentWeb1;

                  let contentWeb2 = contentWeb1;
                  this.postFixLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

              /* this.postFixLists[i].remindersData = this.postFixLists[i].remindersData != '' && this.postFixLists[i].remindersData != 'undefined' && this.postFixLists[i].remindersData != undefined ? this.postFixLists[i].remindersData : '';
                if(this.postFixLists[i].remindersData != ''){
                    let prdata = this.postFixLists[i].remindersData;
                    for (let pr in prdata) {
                      let reminderdate1 = prdata[pr].createdOn;
                      let reminderdate2 = moment.utc(reminderdate1).toDate();
                      prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                    }
                  }  */
                  this.postFixData.push(this.postFixLists[i]);
                }
                let threadPostStorageText = `thread-post-fix-${this.threadId}-attachments`;
                localStorage.setItem(threadPostStorageText, JSON.stringify(postFixAttachments));

                if(this.newPostFixFlag){
                  setTimeout(() => {
                    //this.newPostFixScrollFlag = true;
                    //this.moveScroll(this.parentPostId);
                    setTimeout(() => {
                      this.newPostFixFlag = false;
                    }, 1000);
                  }, 1);
                }
              }
              else{
                this.postFixData = [];
                this.postFixLoading = false;
                this.postFixErrorMsg = res.result;
                this.postFixError = true;
              }
            }
            else{
              this.postFixData = [];
              this.postFixLoading = false;
              this.postFixErrorMsg = res.result;
              this.postFixError = true;
            }
          },
          (error => {
            this.postFixData = [];
            this.postFixLoading = false;
            this.postFixErrorMsg = error;
            this.postFixError  = true;
          })
        );

    }
  }


  callThreadDetail(type=''){
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('platformId', this.platformId);
    apiFormData.append('platform', this.accessPlatForm);
    apiFormData.append('threadAtomicUpdate', '1');

    if(this.businessRoleFlag && (this.CBADomain || this.collabticDomain) && this.techSupportView ){
      apiFormData.append('teamId', this.teamId);
      apiFormData.append('teamMemberId', this.teamMemberId);
      apiFormData.append('ticketStatus', this.ticketStatus);
      apiFormData.append("fromTechSupport", "1");
    }

    this.threadPostService.getthreadDetailsiosDefault(apiFormData).subscribe(res => {

      if(res.status=='Success'){

        localStorage.setItem("newUpdateOnThreadId",this.threadId);
        console.log(res);       

        if(type == 'close' || type== 'reopen'){ 
          this.threadViewData.closeStatus = res.data.thread[0].closeStatus;

          if(this.loginUserDomainId!=res.data.thread[0].domainId)
          {
            this.subscriberAccess=false;
            this.commentReplyAccessLevel=false;
          }
          else
          {
            this.subscriberAccess=true;
          }
          this.closeStatus = this.threadViewData.closeStatus;
          this.headerData['closeThread'] = this.closeStatus;

        if(this.closeStatus==1){
          let closedate1 = res.data.thread[0].closeDate;
          let closedate2 = moment.utc(closedate1).toDate();
          this.closedDate = moment(closedate2).local().format('MMM DD, YYYY . h:mm A');
          setTimeout(() => {
            this.headerData['reopenThread'] = true;
            this.headerData['reminderAccess'] = false;
          }, 1000);
          this.continueButtonEnable=false;
          }
          else{
          setTimeout(() => {
            this.headerData['reopenThread'] = false;
            this.headerData['reminderAccess'] = true;
            this.continueButtonEnable=true;
            }, 1000);
          }
          console.log(this.headerData);
          this.pageDetailHeaderFlag = false;
          setTimeout(() => {
            this.pageDetailHeaderFlag = true;
          }, 10);

          setTimeout(() => {
            this.commonApi.ThreadDetailCommentData('');
            this.setScreenHeight();
            let nht = this.top.nativeElement.scrollHeight;
            setTimeout(() => {
              this.top.nativeElement.scrollTop = nht;
            }, 1000);
          }, 1000);

        }
        if(type == 'thread-like'){
          this.threadViewData['detailType'] = type;
          this.threadViewData.likeStatus = res.data.thread[0].likeStatus;
          this.threadViewData.likeCount = res.data.thread[0].likeCount;
          this.threadViewData.likedUsers = res.data.thread[0].likedUsers;
          this.commonApi.emitThreadListData(this.threadViewData);
        }
        if(type == 'thread-pin'){
          this.threadViewData['detailType'] = type;
          this.threadViewData.pinStatus = res.data.thread[0].pinStatus;
          this.threadViewData.pinCount = res.data.thread[0].pinCount;
          this.threadViewData.pinedUsers = res.data.thread[0].pinedUsers;
          this.commonApi.emitThreadListData(this.threadViewData);
        }
        if(type == 'thread-plusOne'){
          this.threadViewData['detailType'] = type;
          this.threadViewData.plusOneStatus = res.data.thread[0].plusOneStatus;
          this.threadViewData.plusOneCount = res.data.thread[0].plusOneCount;
          this.threadViewData.plusOneUsers = res.data.thread[0].plusOneUsers;
          this.commonApi.emitThreadListData(this.threadViewData);
        }
        if(type == 'postcount'){
          this.threadViewData['detailType'] = type;
          this.threadViewData.comment = res.data.thread[0].comment;
          this.commonApi.emitThreadListData(this.threadViewData);
        }

        if(type == 'comment-poststatus' || type == 'reply-poststatus'){
          this.threadViewData['detailType'] = type;
          this.threadViewData.fixStatus = res.data.thread[0].fixStatus;
          this.threadViewData.fixPostStatus = res.data.thread[0].fixPostStatus;
          this.commonApi.emitThreadListData(this.threadViewData);
        }

        if(type == 'thread-edit'){
          this.threadViewData = res.data.thread[0];
          this.threadDetailPage(this.threadViewData);
          setTimeout(() => {
            localStorage.removeItem("newUpdateOnEditThreadId");
          }, 100);
        }

          }

          if(res.status=='Failure'){
            if(res.deleteFlag == 1){
              this.threadDeleteMsg = "Thread ID# "+this.threadId+" deleted";
              this.visibleDeletedThreadPopup = true;
              return false;
            }
          }
          else{}
        },
        (error => {})
        );

      }


  // Set Screen Height
  setScreenHeight() {

    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - (62));

  }
  // hide status fix tooltip
  changeTooltip(postId){
    for (let i in this.postData) {
      if(this.postData[i].postId == postId){
        this.postData[i].postStFlag = false;
      }
    }
  }

  // Get Uploaded Items
  nestedAttachments(items) {
    this.uploadedItems = items;
    this.replyPostOnFlag2 = true;
    this.uploadReplyFlag  = true;
  }
  attachments(items) {
    this.uploadedItems = items;
  }
  editAttachments(items) {
    console.log(items, this.postData, this.postLists);
    let postData = items.postData;
    console.log(postData)
    let postIndex = this.postData.findIndex(option => option.postId == postData.postId);
    let currPostData = this.postData[postIndex];
    if(items.action == 'insert') {
      let minfo = items.media;
      let mindex = currPostData.attachmentItems.findIndex(option => option.fileId == minfo.fileId);
      if(mindex < 0) {
        currPostData.attachmentItems.push(minfo);
        /* postData.EditAttachmentAction = false;
        setTimeout(() => {
          postData.EditAttachmentAction = true;
        }, 1); */
        let dindex = this.deletedFileIds.findIndex(option => option == minfo.fileId);
        if(dindex >= 0) {
          this.deletedFileIds.splice(dindex, 1);
          this.deletedFileIds = this.deletedFileIds;
        }
        let rindex = this.removeFileIds.findIndex(option => option.fileId == minfo.fileId);
        if(rindex >= 0) {
          this.removeFileIds.splice(rindex, 1);
          this.removeFileIds = this.removeFileIds;
        }
      }
    } else if(items.action == 'remove') {
      let rmindex = currPostData.attachmentItems.findIndex(option => option.fileId == items.media);
      currPostData.attachmentItems.splice(rmindex, 1);
      console.log(this.postLists, currPostData)
      /* postData.EditAttachmentAction = false;
      setTimeout(() => {
        postData.EditAttachmentAction = true;
      }, 1); */
      this.deletedFileIds.push(items.media);
    } else {
      this.uploadedItems = items;
    }
  }
  // Attachment Action
  attachmentAction(data) {
    console.log(data)
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;
    let lang = data.language;
    switch (action) {
      case 'file-delete':
        this.deletedFileIds.push(fileId);
        break;
      case "file-remove":
        this.removeFileIds.push(fileId);
        break;
      case 'order':
        let attachmentList = data.attachments;
        for(let a in attachmentList) {
          let uid = parseInt(a)+1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(option => option.fileId == ufileId);
          if(uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: (flagId == 6) ? attachmentList[a].url : '',
              displayOrder: uid
            };
            this.updatedAttachments.push(fileInfo);
          } else {
            this.updatedAttachments[uindex].displayOrder = uid;
          }
        }
        break;
      default:
        let updatedAttachmentInfo = {
          fileId: fileId,
          caption: caption,
          url: url,
          language: lang
        };
        let index = this.updatedAttachments.findIndex(option => option.fileId == fileId);
        if(index < 0) {
          updatedAttachmentInfo['displayOrder'] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
          this.updatedAttachments[index].language = lang;
        }

        console.log(this.updatedAttachments)
        break;
    }

    if(this.updatedAttachments.length>0){}
    else{
      this.replyPostOnFlag2 = false;
      this.replyPostOnFlag3 = false;
      this.uploadCommentFlag = false;
      this.uploadReplyFlag = false;
      this.tagReplyFlag = false;
      this.tagCommentFlag = false;
    }
  }


  dropEvent(event,tfData)
  {

   let files = event.dataTransfer.files;
   if (files.length > 0) {
    // this.onFileDropped.emit(files)
    this.uploadDataEvebt(files,tfData);
//console.log(files);

   }

  }
  validateFile(files: Array<any>): boolean {
    return true;
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
  uploadDataEvebt(event,tfData) {
    console.log(event);
    let attachmentLocalUrl: any;
    if (this.validateFile(event)) {
      if(tfData=='newComment')
      {
        this.editorProgressUpload=1;
      }
      else if(tfData=='nested-reply')
              {
                this.nestedPosteditorProgressUpload=1;
              }
              else if(tfData=='edit-reply')
              {
                this.nestedPostEditeditorProgressUpload=1;
              }
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
          console.log(tfData,filedata.fileName);
          const formData: FormData = new FormData();
            formData.append('upload', filedata.file);
          this.httpClient.post<any>(this.apiUrl.uploadURL, formData).subscribe(res => {

            if(res.url)
            {

                let linkadded='<p><a href="'+res.url+'" target="_blank">'+filedata.fileName+'</a></p>';

               // tfData.selectedValues=tfData.selectedValues+''+linkadded;
              //  tfData.selectedVal=tfData.selectedVal+''+linkadded;
               // tfData.selectedValueIds=tfData.selectedValueIds+''+linkadded;
              //  tfData.valid=true;
              if(tfData=='newComment')
              {
                this.postDesc=this.postDesc+linkadded;
              }
              else if(tfData=='nested-reply')
              {
                this.postReplyDesc=this.postReplyDesc+linkadded;
              }
              else if(tfData=='edit-reply')
              {
                this.postEditDesc=this.postEditDesc+linkadded;
              }

              localStorage.setItem('returnOnchange','1');
              this.editorProgressUpload=0;
              this.nestedPosteditorProgressUpload=0;
              this.nestedPostEditeditorProgressUpload=0;
                setTimeout(() => {

                  localStorage.removeItem('returnOnchange');

                },500);
                //this.onChange('', '', '', 'val', '','',false,-1,-1,'','1');

            }
            else
            {
              this.editorProgressUpload=0;
              this.nestedPosteditorProgressUpload=0;
              this.nestedPostEditeditorProgressUpload=0;
            }
            console.log(res.url);
          });
          //this.uploadFile(filedata,filedata.file);

        };

      }

    }
    //this.fileInput.nativeElement.value = '';
  }

  threadDashboardOpen(){
    this.threadDashboarUserList(this.dashboard,this.dashboardTab,this.threadId,'',1);
  }
  // liked, pinned, posted and one-puls user list
  threadDashboarUserList(dashboard,dashboardTab,threadId,postId,ismain){
    if(!this.msTeamAccessMobile){

      if(this.domainId=='317' && this.roleId=='1')
      {
        return false;
      }
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
          postId: postId,
          ismain: ismain,
          tap: dashboardTab
        };
      modalRef.componentInstance.dashboardData = dashboardData;
      modalRef.componentInstance.updatefollowingResponce.subscribe((receivedService) => {
      if (receivedService) {
        modalRef.dismiss('Cross click');
        this.bodyElem.classList.remove('profile');
      }
      });
    }
  }

  // select scroll name
  setActivePosition(id) {
    if(id=='bottom'){
      this.top.nativeElement.scrollTop = this.top.nativeElement.scrollHeight;
    }
    else{
      this.top.nativeElement.scrollTop = 0;
    }
  }
  // Find scroll move position
  scrolled(event: any): void {

    let bottom = this.isUserNearBottom();
    //this.isUserNearBottomorlastreply();
    let top = this.isUserNearTop();

    if(bottom){
      console.log("bottom:"+bottom);
      this.buttonTop = false;
      if(this.pageRefresh){
        this.pageRefresh = false;
      }
      this.buttonBottom = true;
    }
    if(top){
      console.log("top:"+top);
      this.buttonTop = true;
      this.buttonBottom = false;
    }
  }

  private isUserNearBottom(): boolean {
    const threshold = 100;
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    return position > height - threshold;
  }

  private isUserNearBottomorlastreply(): boolean {
    const threshold = 400;
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    console.log(position+'--'+height+'--'+threshold);
    return position > height - threshold;
  }

  private isUserNearBottomorlastreplyUpdate(): boolean {
    const threshold = 100;
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    console.log(position+'--'+height+'--'+threshold);
    return position > height - threshold;
  }

  private isUserNearTop(): boolean {
    const threshold = 100;
    const position = this.top.nativeElement.scrollTop;
    return position < threshold;
  }

  // tab on user profile page
  taponprofileclick(userId){
    var aurl='profile/'+userId+'';
    if(this.teamSystem) {
      //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else {
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

  // header event tab/click
  threadHeaderAction(event){
    switch (event){
      case 'threaddashboard':
        this.threadDashboardOpen();
        break;
      case 'print':
        this.print.nativeElement.click();
        break;
        case 'exit':
        case 'exit-thread':
        if(this.apiUrl.postButtonEnable || this.apiUrl.uploadCommentFlag || this.apiUrl.tagCommentFlag) {
            const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
            modalRef.componentInstance.access = 'commentAction';
            modalRef.componentInstance.title = '';
            modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
              if(receivedService){
                if(event == 'exit') {
                  this.exitWindow();
                } else {
                  this.apiUrl.checkDiscard = true;
                }
              }
              modalRef.dismiss('Cross click');
            });
          } else if(this.apiUrl.postReplyButtonEnable  || this.apiUrl.uploadReplyFlag || this.apiUrl.tagReplyFlag) {
            let uname = '';
            const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
            modalRef.componentInstance.access = 'nestedReplyAction';
            modalRef.componentInstance.title = uname;
            modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
              if(receivedService){
                this.exitWindow();
              }
              modalRef.dismiss('Cross click');
            });
          } else {
            this.exitWindow();
          }
          break;
    }
  }
    // Exit Window
    exitWindow() {
      let checkItem = `${this.threadId}-new-tab`;
      localStorage.removeItem(checkItem);
      setTimeout(() => {
        window.close();
        window.location.reload();
      }, 10);
    }

  moveScroll(id){
    setTimeout(() => {
      if(id==1){
        let ht3 = this.top.nativeElement.scrollHeight;
        setTimeout(() => {
          this.top.nativeElement.scrollTop = ht3;
        }, 100);
      }
      else{
        let secElement = document.getElementsByClassName('reply-'+id);
        let ht1 = document.getElementsByClassName('reply-'+id)[0].clientHeight;
        if(secElement != undefined){
          if(this.newPostFixScrollFlag){
            this.newPostFixScrollFlag = false
            let ht3 = ((this.top.nativeElement.scrollTop + 250));
            console.log(ht1,ht3);
            setTimeout(() => {
              this.top.nativeElement.scrollTop = ht3;
            }, 100);
          }
          else{
            let ht3 = ((this.top.nativeElement.scrollTop + ht1));
            console.log(ht1,ht3);
            setTimeout(() => {
              this.top.nativeElement.scrollTop = ht3;
            }, 100);
          }
        }
        else{
          let ht3 = ((this.top.nativeElement.scrollTop + ht1));
          console.log(ht1,ht3);
          setTimeout(() => {
            this.top.nativeElement.scrollTop = ht3;
          }, 100);
        }
      }
    }, 500);
  }
 moveScrollNotify(id){
    this.nloading = false;
    if(document.getElementById('notify-'+id) != undefined){
      let nst1 = document.getElementById('notify-'+id).offsetTop;
      this.top.nativeElement.scrollTop =  nst1 - 200;
      for (let i in this.postData) {
        this.postData[i].activeBorder = false;
        if(this.postData[i].commentPostId == id){
          this.postData[i].activeBorder = true;
          /*setTimeout(() => {
            this.postData[i].newComment = true;
          }, 100);
          setTimeout(() => {
            this.postData[i].newComment = false;
          }, 850);*/
          return;
        }
        else{
          for (let j in this.postData[i].nestedReplies) {
            if(this.postData[i].nestedReplies[j].postId == id){
              /*setTimeout(() => {
                this.postData[i].nestedReplies[j].newReply = true;
              }, 100);
              setTimeout(() => {
                this.postData[i].nestedReplies[j].newReply = false;
              }, 850);*/
              return;
            }
          }
        }
      }
      console.log(nst1);
    }
  }

  notifyPostPosition(id){
    this.nloading = false;
    if(document.getElementById('notify-'+id) != undefined){
      let nst1 = document.getElementById('notify-'+id).offsetTop;
      this.top.nativeElement.scrollTop =  nst1 - 200;
    }
  }

  moveReplyPosition(id){
    if(document.getElementById('notify-'+id) != undefined){
      let nst1 = document.getElementById('notify-'+id).offsetTop;
      this.top.nativeElement.scrollTop =  nst1 - 200;
    }
  }


  onEditorInit(event: any) { event.editor.root.focus() }

  /*
  // Check valid url
  isValiwindow.open(url, url);dURL(a, url) {
    if (url!= '' && !/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
      a.url = url;
    }

    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(url)) {
      return true;
    } else {
      return false;
    }
  }
  */

  // select language
  changeTranslateLanguage(type, desc, postindex, posttype, pid, replyindex='' ){
    console.log(type, desc, postindex, posttype, pid, replyindex);
    if(type=='settings' || type=='Translate'){
      let apiData = {
        api_key: Constant.ApiKey,
        user_id: this.userId,
        domain_id: this.domainId,
        countryId: this.countryId
      };
      apiData['translate'] = "1";
      let users = [];
      this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
      this.translatelangId = this.translatelangArray['id'] == undefined ? '' : this.translatelangArray['id'];
      if(this.translatelangId != ''){
        users.push({
          id: this.translatelangArray['id'],
          name: this.translatelangArray['name']
        });
      }
      const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: true, centered: true });
      modalRef.componentInstance.access =  'translate-language';
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.height = windowHeight.height;
      modalRef.componentInstance.action = 'new';
      modalRef.componentInstance.selectedUsers = users;
      modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
        console.log(receivedService);
        if (!receivedService.empty) {
          let langData = [];
          langData = receivedService;
          this.translatelangArray = langData;
          localStorage.setItem('translateLanguage',JSON.stringify(this.translatelangArray));
          this.translatelangId = this.translatelangArray['id'];
          this.languageSelect(this.translatelangId);
          if(posttype == 'thread'){
            this.threadViewData.transText = "Translate to Original";
            this.threadViewData.transId = this.translatelangId;
            for (let j in this.postData) {
              this.postData[j].transText = "Translate to "+this.translatelangArray['name'];
              for (let k in this.postData[j].nestedReplies) {
                  this.postData[j].nestedReplies[k].transText = "Translate to "+this.translatelangArray['name'];
              }
            }
            let selectLanguage = this.translatelangArray['languageCode'];
            this.taponDescription('', 'thread-title', '',selectLanguage);
            setTimeout(() => {
              this.detectContentLang = false;
              this.translateProcess = false;
              this.taponDescription('', 'thread-content', '',selectLanguage);
              setTimeout(() => {
                if(this.threadViewData.threadDescFix){                
                  this.detectContentLang = false;
                  this.translateProcess = false;
                  this.taponDescription('', 'thread-sharedfix', '',selectLanguage);
                }
                if(this.TVSDomain){
                  setTimeout(() => {
                    this.detectContentLang = false;
                    this.translateProcess = false;
                    this.taponDescription('', 'thread-invoice', '',selectLanguage);
                    setTimeout(() => {
                      this.detectContentLang = false;
                      this.translateProcess = false;
                      this.taponDescription('', 'thread-actiontaken', '',selectLanguage);
                    }, 1000);
                  }, 1000);
                }
                if(this.CBADomainOnly){
                  setTimeout(() => {
                    this.detectContentLang = false;
                    this.translateProcess = false;
                    this.taponDescription('', 'thread-teamassist', '',selectLanguage);
                  }, 1000);
                }
            }, 1000);
          
            }, 1000);
            this.commonApi.emitThreadListData(this.threadViewData);
          }
          else if(posttype == 'reply'){
            this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
            for (let j in this.postData) {
              this.postData[j].transText = "Translate to "+this.translatelangArray['name'];
              for (let k in this.postData[j].nestedReplies) {
                this.postData[j].nestedReplies[k].transText = "Translate to "+this.translatelangArray['name'];
              }
            }
            this.postData[postindex].nestedReplies[replyindex].transText = "Translate to Original";
            let selectLanguage = this.translatelangArray['languageCode'];
            this.taponDescription(desc, 'reply', postindex,selectLanguage,replyindex);
          }
          else{
            this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
            for (let j in this.postData) {
              this.postData[j].transText = "Translate to "+this.translatelangArray['name'];
              for (let k in this.postData[j].nestedReplies) {
                this.postData[j].nestedReplies[k].transText = "Translate to "+this.translatelangArray['name'];
              }
            }
            this.postData[postindex].transText = "Translate to Original";
            let selectLanguage = this.translatelangArray['languageCode'];
            this.taponDescription(desc, 'post', postindex,selectLanguage);
          }
        }
        modalRef.dismiss('Cross click');
      });
    }
    else if(type=='Translate to Original'){
      if(posttype == 'thread'){
        this.threadViewData.content = this.threadViewData.contentDuplicate;
        if(this.threadViewData.threadDescFix){ 
         this.threadViewData.threadDescFix = this.threadViewData.threadDescFixDuplicate;
          }
        if(this.TVSDomain){
          this.threadViewData.customerVoice = this.threadViewData.customerVoiceDuplicate;
          this.threadViewData.actionTaken = this.threadViewData.actionTakenDuplicate;
        }
        if(this.CBADomainOnly){
          this.threadViewData.teamAssist = this.threadViewData.teamAssistDuplicate;
        }
        this.threadViewData.threadTitle = this.threadViewData.threadTitleDuplicate;
        this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
        this.commonApi.emitThreadListData(this.threadViewData);
      }
      else if(posttype == 'reply'){
        this.postData[postindex].nestedReplies[replyindex].contentWeb = this.postData[postindex].nestedReplies[replyindex].contentWebDuplicate;
        this.postData[postindex].nestedReplies[replyindex].transText = "Translate to "+this.translatelangArray['name'];
      }
      else{
        this.postData[postindex].contentWeb = this.postData[postindex].contentWebDuplicate;
        this.postData[postindex].transText = "Translate to "+this.translatelangArray['name'];
      }
    }
    else{
      if(posttype == 'thread'){
        let selectLanguage = this.translatelangArray['languageCode'];
        this.taponDescription('', 'thread-title', '',selectLanguage);
        setTimeout(() => {
          this.detectContentLang = false;
          this.translateProcess = false;
          this.taponDescription('', 'thread-content', '',selectLanguage);
          setTimeout(() => {
            if(this.threadViewData.threadDescFix){            
             this.detectContentLang = false;
             this.translateProcess = false;
             this.taponDescription('', 'thread-sharedfix', '',selectLanguage);
            }
            if(this.TVSDomain){
              setTimeout(() => {
                this.detectContentLang = false;
                this.translateProcess = false;
                this.taponDescription('', 'thread-invoice', '',selectLanguage);
                setTimeout(() => {
                  this.detectContentLang = false;
                  this.translateProcess = false;
                  this.taponDescription('', 'thread-actiontaken', '',selectLanguage);
                },1000);
              },1000);
            }
            if(this.CBADomainOnly){
              setTimeout(() => {
                this.detectContentLang = false;
                this.translateProcess = false;
                this.taponDescription('', 'thread-teamassist', '',selectLanguage);
              },1000);
            }
        },1000);
        },1000);
        this.threadViewData.transText = "Translate to Original";
        this.commonApi.emitThreadListData(this.threadViewData);
      }
      else if(posttype == 'reply'){
        let selectLanguage = this.translatelangArray['languageCode'];
        this.taponDescription(desc, 'reply', postindex,selectLanguage,replyindex);
        this.postData[postindex].nestedReplies[replyindex].transText = "Translate to Original";
      }
      else{
        let selectLanguage = this.translatelangArray['languageCode'];
        this.taponDescription(desc, 'post', postindex,selectLanguage);
        this.postData[postindex].transText = "Translate to Original";
      }
    }
  }

  // language update
  languageSelect(langId){
    const apiFormData = new FormData();
    let countryId = localStorage.getItem('countryId');
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('update', "1");
    apiFormData.append('userLanguage', langId);
    this.authenticationService.getLanguageList(apiFormData).subscribe(res => { });
  }

  threadTranslateAction(ttype){
    this.changeTranslateLanguage(ttype, '', '', 'thread', '' );
  }


   threadDetailPage(data){

    this.postTypeAccess = false;
    this.adminUserNotOwner = false;

    let url = RedirectionPage.Threads;
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
    console.log(data);
    //this.threadViewData = [];
    this.threadViewData = data;

    this.threadViewData.threadTitleTranslate = this.threadViewData.threadTitle;
    this.threadViewData.contentTranslate = this.threadViewData.content;
    if(this.TVSDomain){
      this.threadViewData.actionTakenTranslate = this.threadViewData.actionTaken;
      this.threadViewData.customerVoiceTranslate = this.threadViewData.customerVoice;
    }
    if(this.CBADomainOnly){
      this.threadViewData.teamAssistTranslate = this.threadViewData.teamAssistStr;
    }

    this.threadViewData.threadTitle=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadTitle));
    //this.threadViewData.threadTitle = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.threadTitle));
    this.threadViewData.content=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.content));
    this.threadViewData.content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.content));
    if(this.TVSDomain){
      this.threadViewData.actionTaken=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.actionTaken));
      this.threadViewData.actionTaken = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.actionTaken));
      this.threadViewData.customerVoice=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.customerVoice));
      this.threadViewData.customerVoice = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.customerVoice));
    }
    if(this.CBADomainOnly){
      if(this.threadViewData.teamAssistStr)
      {
        this.threadViewData.teamAssist=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.teamAssistStr));
        this.threadViewData.teamAssist = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.teamAssistStr));
      }
      else
      {
        this.threadViewData.teamAssist='';

      }

    }
    this.threadViewData.threadTitleDuplicate = this.threadViewData.threadTitle;
    this.threadViewData.contentDuplicate = this.threadViewData.content;
    if(this.TVSDomain){
      this.threadViewData.actionTakenDuplicate = this.threadViewData.actionTaken;
      this.threadViewData.customerVoiceDuplicate = this.threadViewData.customerVoice;
    }
    if(this.CBADomainOnly){
      this.threadViewData.teamAssistDuplicate = this.threadViewData.teamAssistStr;
    }
    if(this.translatelangId != ''){
      this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
      this.threadViewData.transId = this.translatelangId;
    }
    else{
      this.threadViewData.transText = "Translate";
      this.threadViewData.transId = this.translatelangId;
    }
    this.threadViewData['threadText'] = this.headerTitle;
    console.log(this.threadViewData);

    localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
    console.log(this.threadViewData);
      this.techSubmmitFlag=false;
    if(this.domainId == '52' && this.platformId =='2' ){
      this.techSubmmitFlag = (this.threadViewData.summitFix == '1') ? true : false;
    }
    console.log(this.techSubmmitFlag);
    if(this.techSubmmitFlag){
      this.groups = this.threadViewData.groups;
    }

    this.threadViewData.techSubmmitFlag = this.techSubmmitFlag;
    this.threadViewData.industryType = this.industryType;

    if(this.threadViewData.industryType['id'] == 2) {

      this.threadViewData.trims = [];

      if(this.industryType.id == 2 && this.platformId !='1') {
        this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1[0] : '';
        if(this.trim1 != ''){
          this.threadViewData.trims.push({
            key: this.trim1['key'],
            id: this.trim1['id'],
            name: this.trim1['name']
          });
        }
        this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2[0] : '';
        if(this.trim2 != ''){
          this.threadViewData.trims.push({
            key: this.trim2['key'],
            id: this.trim2['id'],
            name: this.trim2['name']
          });
        }
        this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3 != "[]" && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3[0] : '';
        if(this.trim3 != ''){
          this.threadViewData.trims.push({
            key: this.trim3['key'],
            id: this.trim3['id'],
            name: this.trim3['name']
          });
        }
        this.trim4 = (this.threadViewData.trim4 != "" && this.threadViewData.trim4 != "[]" && this.threadViewData.trim4.length>0) ? this.threadViewData.trim4[0] : '';
        if(this.trim4 != ''){
          this.threadViewData.trims.push({
            key: this.trim4['key'],
            id: this.trim4['id'],
            name: this.trim4['name']
          });
        }
        this.trim5 = (this.threadViewData.trim5 != "" && this.threadViewData.trim5 != "[]" && this.threadViewData.trim5.length>0) ? this.threadViewData.trim5[0] : '';
        if(this.trim5 != ''){
          this.threadViewData.trims.push({
            key: this.trim5['key'],
            id: this.trim5['id'],
            name: this.trim5['name']
          });
        }
        this.trim6 = (this.threadViewData.trim6 != "" && this.threadViewData.trim6 != "[]" && this.threadViewData.trim6.length>0) ? this.threadViewData.trim6[0] : '';
        if(this.trim6 != ''){
          this.threadViewData.trims.push({
            key: this.trim6['key'],
            id: this.trim6['id'],
            name: this.trim6['name']
          });
        }
        this.threadViewData.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
        console.log(this.threadViewData.trim);

        if(this.threadViewData.trims!=''){
          if(this.threadViewData.trims.length>3){
            this.trimborder = true;
          }
        }
        console.log(this.threadViewData.trims);

      }
      else{
        this.threadViewData.trims = [];

        if(this.industryType.id == 2) {
          this.trim1 = (this.threadViewData.trimValue1 != "" &&this.threadViewData.trimValue1 != undefined && this.threadViewData.trimValue1 != "[]" && this.threadViewData.trimValue1.length>0) ? this.threadViewData.trimValue1[0] : '';
          if(this.trim1 != ''){
            this.threadViewData.trims.push({
              key: this.trim1['key'],
              id: this.trim1['id'],
              name: this.trim1['name']
            });
          }
          this.trim2 = (this.threadViewData.trimValue2 != "" &&this.threadViewData.trimValue2 != undefined && this.threadViewData.trimValue2 != "[]" && this.threadViewData.trimValue2.length>0) ? this.threadViewData.trimValue2[0] : '';
          if(this.trim2 != ''){
            this.threadViewData.trims.push({
              key: this.trim2['key'],
              id: this.trim2['id'],
              name: this.trim2['name']
            });
          }
          this.trim3 = (this.threadViewData.trimValue3 != "" && this.threadViewData.trimValue3 != undefined && this.threadViewData.trimValue3 != "[]" && this.threadViewData.trimValue3.length>0) ? this.threadViewData.trimValue3[0] : '';
          if(this.trim3 != ''){
            this.threadViewData.trims.push({
              key: this.trim3['key'],
              id: this.trim3['id'],
              name: this.trim3['name']
            });
          }
          this.trim4 = (this.threadViewData.trimValue4 != "" && this.threadViewData.trimValue4 != undefined && this.threadViewData.trimValue4 != "[]" && this.threadViewData.trimValue4.length>0) ? this.threadViewData.trimValue4[0] : '';
          if(this.trim4 != ''){
            this.threadViewData.trims.push({
              key: this.trim4['key'],
              id: this.trim4['id'],
              name: this.trim4['name']
            });
          }
          this.trim5 = (this.threadViewData.trimValue5 != "" &&this.threadViewData.trimValue5 != undefined && this.threadViewData.trimValue5 != "[]" && this.threadViewData.trimValue5.length>0) ? this.threadViewData.trimValue5[0] : '';
          if(this.trim5 != ''){
            this.threadViewData.trims.push({
              key: this.trim5['key'],
              id: this.trim5['id'],
              name: this.trim5['name']
            });
          }
          this.trim6 = (this.threadViewData.trimValue6 != "" &&this.threadViewData.trimValue6 != undefined && this.threadViewData.trimValue6 != "[]" && this.threadViewData.trimValue6.length>0) ? this.threadViewData.trimValue6[0] : '';
          if(this.trim6 != ''){
            this.threadViewData.trims.push({
              key: this.trim6['key'],
              id: this.trim6['id'],
              name: this.trim6['name']
            });
          }
          this.threadViewData.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
          console.log(this.threadViewData.trim);

          if(this.threadViewData.trims!=''){
            if(this.threadViewData.trims.length>3){
              this.trimborder = true;
            }
          }
          console.log(this.threadViewData.trims);

        }
      }
    }

   /* if( this.threadViewData == 'undefined' || this.threadViewData == undefined  ){
      this.loading = false;
      this.threadViewErrorMsg = res.result;
      this.threadViewError = true;
      setTimeout(() => {
        this.commonApi.emitThreadListData(this.threadViewData);
      }, 1);
    }*/
    //else{
      if(this.threadViewData != ''){

        if(this.platformId == '1'){
          this.threadUserId = this.threadViewData.owner;
        }
        else{
          this.threadUserId = this.threadViewData.userId;
        }

        let pImg = this.threadViewData.profileImage;
        let uName = this.threadViewData.userName;
        this.assProdOwner = [];
        this.assProdOwner.push({
          id:this.threadUserId,
          profileImage:pImg,
          emailAddress:uName
        })
        console.log(this.assProdOwner);
        this.specialOwnerAccess = this.threadViewData.ownerAccess == 1 ? true : false;
        if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || ( this.roleId=='3'  || this.roleId=='10')){
          this.threadOwner = true;
        }
        if(this.userId != this.threadUserId && ( this.roleId=='3'  || this.roleId=='10')){
          this.adminUserNotOwner = true
        }
        if(this.threadViewData.escalateStatus!='' && this.platformId=='2')
        {
          this.escalationStatusView=true;
        this.escalationStatusViewClass="lowopacity";


        }

        if(this.threadViewData.isDealer)
        {
          this.supportFeedbackList=this.threadViewData.supportFeedbackList;

        }

        this.closeStatus = this.threadViewData.closeStatus;
        if(this.closeStatus==1){
          let closedate1 = this.threadViewData.closeDate;
          let closedate2 = moment.utc(closedate1).toDate();
          this.closedDate = moment(closedate2).local().format('MMM DD, YYYY . h:mm A');

          let closedCheckStatus = localStorage.getItem('closeThreadNow');
          setTimeout(() => {
            if(closedCheckStatus == 'yes'){
              localStorage.removeItem('closeThreadNow');
              let ht = this.top.nativeElement.scrollHeight - 1100;
              setTimeout(() => {
                console.log(this.top.nativeElement.scrollHeight);
                console.log(ht);
                this.top.nativeElement.scrollTop = ht;
                /*this.top.nativeElement.scroll({
                  top: ht,
                  left: 0,
                  behavior: 'smooth'
                });*/
              }, 700);
            }
          }, 300);
        }
        else{
          this.continueButtonEnable = true;
        }
        // give access to Thread Edit, Delete
        let access = false;
        let editAccess = false;
        let deleteAccess = false;
        if(this.platformId == '1'){
          if(this.userId == this.threadUserId){
            access = true;
          }
        }
        else{
          if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3'  || this.roleId=='10'){
            access = true;
          }
        }
        this.closeAccessLevel = access ? true : this.accessLevel.close;
        editAccess = access ? true : this.accessLevel.edit;
        deleteAccess = access ? true : this.accessLevel.delete;
        this.commentReplyAccessLevel = access ? true : this.accessLevel.reply;


        if(this.loginUserDomainId!= this.threadViewData.domainId)
        {
          this.subscriberAccess=false;
          this.commentReplyAccessLevel=false;
          this.closeAccessLevel=false;
          editAccess=false;
          deleteAccess=false;
        }
        else
        {
          this.subscriberAccess=true;
        }

        if(this.diagnationDomain){
          if(this.threadViewData.workOrder != '' && this.threadViewData.workOrder != undefined){
            deleteAccess=false;
          }            
        } 

        console.log(this.userId);
        console.log(this.threadUserId);
        console.log(access);

        // give access to close thread
        if(this.platformId == '1' && ( this.userId == this.threadUserId || this.accessLevel.close )){
            this.closeAccess = true;
        }
        else{
          if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
            this.closeAccess = true;
          }
        }
        // give access to Reopen Thread
        let reopenThread = false;
        if(this.platformId == '1'){
          if(this.closeStatus == 1 && this.threadViewData.newThreadTypeSelect == 'thread' && (this.userId == this.threadUserId || this.accessLevel.edit)){
            reopenThread = true;
          }
        }
        else{
          if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10') && this.closeStatus==1 && this.threadViewData.newThreadTypeSelect=='thread'){
            reopenThread = true;
          }
        }

        // give access to reminderAccess
        let reminderAccess = false;
        if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
          reminderAccess = true;
        }

        // Post type Access
        if(this.platformId == '1'){
          if(this.userId == this.threadUserId){
            this.postTypeAccess = true;
          }
          else{
            this.postTypeAccess = false;
            this.postTypeAccess = this.adminUserNotOwner ? true : this.postTypeAccess;
          }

        }
        else{
          if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='10'){
            this.postTypeAccess = true;
          }
        }

        let ppfrAccess = false;
        let ppfrAvailable = '';
        if(this.TVSDomain || this.TVSIBDomain){
          let isPPFRAccess = this.threadViewData.isPPFRAccess;
          let isDealerAccess = this.threadViewData.isDealer;
          this.isDealerAccess=this.threadViewData.isDealer;
          ppfrAccess = isPPFRAccess == '1' || isDealerAccess == '1' ? true : false;
          console.log(ppfrAccess);
          if(ppfrAccess){
            let dealerInfo = this.threadViewData.dealerInfo[0];
            let dealerName = dealerInfo.dealerName;
            let dealerCity = dealerInfo.city;
            let dealerArea = dealerInfo.area;
            let vinNo = this.threadViewData.vinNo !='' && this.threadViewData.vinNo != null ? this.threadViewData.vinNo : '';
            let odometer = this.threadViewData.odometer !='' && this.threadViewData.odometer != null ? this.threadViewData.odometer : '' ;
            this.ppfrPopVal = {
              threadId: this.threadId,
              ppfrEdit : this.threadViewData.isPPFRAvailable,
              model: this.threadViewData.model,
              dealerName: dealerName,
              dealerCity: dealerCity,
              dealerArea: dealerArea,
              frameNumber: vinNo,
              odometer: odometer,
              page : this.pageAccess,
            }
            ppfrAvailable = this.threadViewData.isPPFRAvailable;
            console.log(ppfrAvailable);
          }
        }
        console.log(ppfrAccess);
        console.log(ppfrAvailable);

        let threadStatus = this.threadViewData.threadStatus;
        let threadStatusBgColor = this.threadViewData.threadStatusBgColor;
        let threadStatusColorValue = this.threadViewData.threadStatusColorValue;

        if(this.techSupportFlag && this.threadViewData.newThreadTypeSelect !='share'){
          if(this.threadViewData.techSupportAssignedUserIdStr == '0'){
            this.assignedToId =  '';
            this.assignedToName =  '';
            this.assignedToProfile = '';
            this.threadViewData.techSupportStatusId = "1";
            this.threadViewData.techSupportStatus = 'Unassigned';
            this.threadViewData.techSupportStatusBgColor = 'rgb(242, 109, 109)';
          }
          else{
            this.assignedToId =  this.threadViewData.assignedToId;
            this.assignedToName =  this.threadViewData.assignedToName;
            this.assignedToProfile = this.threadViewData.assignedToProfile;


            this.closeStatus = this.threadViewData.closeStatus;
            if(this.closeStatus==1){
              this.threadViewData.techSupportStatusId = "9";
              this.threadViewData.techSupportStatus = 'Closed';
              this.threadViewData.techSupportStatusBgColor = 'rgb(14, 154, 78)';
            }
            else{
              this.threadViewData.techSupportStatusId = "2";
              this.threadViewData.techSupportStatus = 'Open';
              this.threadViewData.techSupportStatusBgColor = 'rgb(229, 183, 22)';
            }
          }
        }

        this.headerData = {
          access: 'thread',
          title: this.headerTitle,
          'pageName': 'thread',
          'threadId': this.threadId,
          'threadStatus': threadStatus,
          'threadStatusBgColor': threadStatusBgColor,
          'threadStatusColorValue': threadStatusColorValue,
          'threadOwnerAccess': access,
          'reminderAccess': reminderAccess,
          'editAccess': editAccess,
          'deleteAccess': deleteAccess,
          'closeAccess': this.closeAccess,
          'reopenThread': reopenThread,
          'closeThread': this.closeStatus,
          'techSubmmit': this.techSubmmitFlag,
          'scorePoint': this.threadViewData.scorePoint,
          'ppfrAccess': ppfrAccess,
          'ppfrAvailable': ppfrAvailable,
          'newThreadTypeSelect': this.threadViewData.newThreadTypeSelect,
          'WorkstreamsList': this.threadViewData.WorkstreamsList
        };
        console.log(this.headerData);

        this.pageDetailHeaderFlag = true;


        this.threadRemindersData = this.threadViewData.remindersData != '' && this.threadViewData.remindersData != 'undefined' && this.threadViewData.remindersData != undefined ? this.threadViewData.remindersData : '';
        if(this.threadRemindersData!=''){
          for (let i in this.threadRemindersData) {
            let reminderdate1 = this.threadRemindersData[i].createdOn;
            let reminderdate2 = moment.utc(reminderdate1).toDate();
            this.threadRemindersData[i].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
          }
        }
      }
      this.commonApi.emitThreadListData(this.threadViewData);
   }
   expandLeftAction(){
    this.leftPanel = (this.leftPanel) ? false : true;
   }
   toggleTapAction(type){
      this.recentThreadsPanel = type == 'recent' ? true : false;
      this.techSupportView = this.recentThreadsPanel ? false : true;
   }

  detailViewCallBack(data) {
    console.log(data)
    this.detailViewRef = data;
    this.moreInfoFlag = data.moreInfo;
    this.detailInfo = data.vinDetails;
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
    this.subscription.unsubscribe();
    this.pushThreadArrayNotification=[];
    this.threadsDetailAPIcall.unsubscribe();
    localStorage.removeItem('callbackThreadInfo');
    localStorage.removeItem('notificationTPID');
    localStorage.removeItem('notificationOnTap');
    localStorage.removeItem('newThread');
    this.replyPush = false;
    this.commentNotifyRead = false;
    localStorage.removeItem("notificationPOID");
    localStorage.removeItem("notificationPPOID");
    this.apiUrl.threadViewPublicPage = false;
    this.bodyElem.classList.remove("public-detail");
  }

}
export class FileData {
  file: any;
  fileName: string;
  filenamewithoutextension: string;
  filesize: number;
  fileType: string;
  localurl: any;
  progress: number;
  uploadStatus: number;
  fileCaption: string;
  attachmentEditStatus: boolean;
  attachmentType: number;

}

