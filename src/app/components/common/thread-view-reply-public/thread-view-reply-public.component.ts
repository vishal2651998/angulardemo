import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import * as ClassicEditor from "src/build/ckeditor";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant,PlatFormType, forumPageAccess, IsOpenNewTab, ManageTitle, pageTitle, RedirectionPage, silentItems, windowHeight, AttachmentType, escalationSendEmailType } from '../../../common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { ApiService } from '../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../services/thread/thread.service';
import { AddLinkComponent } from '../../../components/common/add-link/add-link.component';
import { FollowersFollowingComponent } from '../../../components/common/followers-following/followers-following.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ManageUserComponent } from '../../../components/common/manage-user/manage-user.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseService } from 'src/app/modules/base/base.service';
import { Editor } from "primeng/editor";
import { retry } from 'rxjs/operators';
import { ApiConfiguration } from 'src/app/models/chatmodel';
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {MediaUploadComponent} from 'src/app/components/media-upload/media-upload.component';
import { leadingComment } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'app-thread-view-reply-public',
  templateUrl: './thread-view-reply-public.component.html',
  styleUrls: ['./thread-view-reply-public.component.scss'],
  providers: [MessageService]
})
export class ThreadViewReplyPublicComponent implements OnInit,  OnDestroy{

  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  @ViewChild('print',{static: false}) print: ElementRef;
  @ViewChild('top',{static: false}) top: ElementRef;
  @ViewChild('tdpage',{static: false}) tdpage: ElementRef;
  @ViewChild('pdesp',{static: false}) pdesp: ElementRef;
  @ViewChild('postReplyEditor') postReplyEditor: Editor;
  @ViewChild('postNewEditor') postNewEditor: Editor;
  quill: any;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "";
  public bodyClass1:string = "";
  public bodyClass2: string = "submit-loader";
  public bodyClass3: string = "";
  public bodyElem;
  public subscriberAccess:boolean=true;
  public editorProgressUpload=0;
  public nestedPosteditorProgressUpload=0;
  public nestedPostEditeditorProgressUpload=0;
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
  public commentAssignedUsersList=[];
  public commentSelectedAssignedUsersList=[];
  public threadAssignedUsersList=[];
  public threadAssignedUsersListNew=[];
  public oldTaggedUsersList = [];
  public replyAssignedUsersList=[];
  public threadAssignedUsersPopupResponse=false;
  public commentAssignedUsersPopupResponse=false;
  public replyAssignedUsersPopupResponse=false;
  public headerData:any;
  public threadData:any;
  public replyTaggedUsers = [];
  public commentTaggedUsers = [];
  public threadTaggedUsers = [];
  public assProdOwner = [];
  public rightPanel: boolean = false;
  public newLeftCol: boolean = false;
  public innerHeight: number;
  public bodyHeight: number;
  public industryType: any = [];
  public viewThreadInterval: any;
  public parentPostId;
  public postReplyDesc: string= '';;

  public disableRightPanel: boolean = true;
  public postServerError:boolean = false;
  public postFixServerError:boolean = false;
  public postReplyServerError:boolean = false;
  public postServerErrorMsg: string = '';
  public postFixServerErrorMsg: string = '';
  public postReplyServerErrorMsg: string = '';

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
  public uploadedItems: any = [];
  public commentUploadedItemsFlag: boolean = false;
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
  public postReplyListsNew = [];
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

  public newPostFixFlag = false;
  public newPostFixScrollFlag = false;

  public fromNotificationPageFlag: boolean = false;
  public nloading: boolean = false;

  public enableTagFlag: boolean = false;
  public timeOutNt;
  public postNotificationCount: number = 0;
  public teamMemberId;
  public ticketStatus: string = '1';
  public teamId: string = '1';
  public assignedToId;
  public assignedToName;
  public assignedToProfile;
  public commentReplyAccessLevel: boolean = true;
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
  public accessLevel : any;
  public incrementToast:number=0;
  public translatelangArray = [];
  public translatelangId: string = '';
  public accessPlatForm:any = 3;
  public replyEnable: boolean = false;
  //public newText: string = 'NEW';
  public pageRefresh: boolean = false;
  public CBADomain: boolean = false;
  public CBADomainOnly: boolean = false;
  public businessRoleFlag: boolean = false;
  public techSupportFlag: boolean = false;
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};

  public postUploadActionTrue: boolean = false;
  public setHeight: number;
  public knowledgeArticleTitle: string = "";
  public CommentDescription: string = "Enter Comment";
  public Editor = ClassicEditor;

  public infoLoading: boolean = true;
  public expandFlag:boolean = true;
  public emptyResult: boolean = true;
  public loadingResult: boolean = true;
  public threadCloseStatus;
  public enableReplyBox: boolean = false;
  public commentId;
  public enterKeyPressFlag: boolean = false;
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
    placeholder: 'Add Reply. Tap Enter to send and Shift+Enter for a new line.',
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
    this.bodyHeight = window.innerHeight;
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
    private httpClient:HttpClient,
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
  ) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';
      if(this.apiUrl.threadViewPublicPage){
        this.toggleReplyInfo();
      }
  }

  ngOnInit(): void {

    
    this.bodyElem = document.getElementsByTagName('body')[0];
    if(this.apiUrl.threadViewPublicPage){
      this.domainId = this.apiUrl.threadViewPublicDomainId;
      this.userId = this.apiUrl.threadViewPublicUserId;
      
    }
    else{
      this.user = this.authenticationService.userValue;
      this.domainId = this.user.domain_id;
      this.userId = this.user.Userid;
      this.teamMemberId = this.user.Userid;
      this.roleId = this.user.roleId;
    }

    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');

    this.postApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.nestedPostApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.postEditApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };


    this.enableTagFlag = true ;
    let nestedReplyEnabled=localStorage.getItem('nestedReplyEnabled');

    if(nestedReplyEnabled=='1')
    {
      this.replyEnable=true;
    }


    this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];
    this.translatelangId = this.translatelangArray['id'] == undefined ? '' : this.translatelangArray['id'];

    this.commonApi.postDataReceivedSubject.subscribe((response) => {
      this.postUploadActionTrue = false;
      console.log(response);
      setTimeout(() => {
        let action = response['action'];
        console.log(action);
        switch(action) {
        case 'post-new':
          if(response['nestedReply'] == "1"){
            //if(response['viewpage'] == "0"){
              this.replyPostOnFlag1 = false;
              this.replyPostOnFlag2 = false;
              this.replyPostOnFlag3 = false;
              this.uploadCommentFlag = false;
              this.uploadReplyFlag = false;
              this.tagReplyFlag = false;
              this.tagCommentFlag = false;
              this.uploadedItems = [];
              this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
              this.nestedPostApiData['attachments'] = this.uploadedItems;
              this.nestedPostUpload = false;
              setTimeout(() => {
                this.nestedPostUpload = true;
              }, 100);
              //this.postData[0].postReplyLoading = true;
              this.postData[0].postNew = false;
              this.postFixRefresh = true;
              
              this.getPostUpdateListOld(response['postId'],'refresh','replynew');
            //}
          }
          break;
        case 'post-edit':
          if(response['nestedReply'] == "1" && response['parentPostId'] == this.parentPostId){
           //if(response['viewpage'] == "0"){
              
              this.parentPostId = response['parentPostId'];
              let itemIndex2 = this.postData[0].nestedReplies.findIndex(item => item.postId == response['postId']);
              this.postData[0].nestedReplies[itemIndex2].postReplyLoading = true;
             // this.moveScroll(response['parentPostId']);
              this.postData[0].nestedReplies[itemIndex2].postView = true;
              this.postFixRefresh = true;
              
              this.getPostUpdateListOld(response['postId'],'edit','replyedit');
            //}
          }
          else{
            //if(response['viewpage'] == "0"){
              if(response['postId'] == this.parentPostId ){
                
                this.postData[0].postView = true;
                this.postData[0].postLoading = true;
                this.postFixRefresh = true;
                this.getPostUpdateListOld(response['postId'],'edit');
              }
            //}
          }
        break;
        }
      }, 1000);
    });

    /*this.commonApi.postDataNotificationReceivedSubject.subscribe((response) => {
      setTimeout(() => {
        console.log(response);
        this.fromNotificationPageFlag = true;
        //this.getThreadInfo('notification','');
        this.getCommentList();
        setTimeout(() => {
          this.pageRefresh = false;
        }, 100);
        this.postNotificationCount = 0;
      }, 1);
    });*/

    this.commonApi.emitThreadDetailCommentUpdateSubject.subscribe((data) => {
      // came reply notification place
      console.log(this.parentPostId);
      console.log(this.threadId);
      console.log(data);
      if(this.threadId  == data['threadId']){
        if(data['parentPostId'] == this.parentPostId){
          if(data['type1'] == 'replyedit' && data['type2'] == 'edit'){
            if(data['type3'] == 'edit-old'){
              this.getPostUpdateListOld(data['postId'],data['type2'],data['type1']);
            }
            else{
              this.getPostUpdateList(data['postId'],data['type2'],data['type1']);
            }
          }
          else if(data['type1'] == '' && data['type2'] == 'edit'){
            if(data['type3'] == 'edit-old'){
              this.getPostUpdateListOld(data['postId'],data['type2']);
            }
            else{
              this.getPostUpdateList(data['postId'],data['type2']);
            }
          }
          else if(data['type1'] == 'replynew')
          {
            var nval = '';
            let bottom = this.isUserNearBottomorlastreplyUpdate();
            if(data['type3'] == 'notification-old'){
              let dontclearText=1;
              if(bottom){
                nval = '1';
              }
              else{
                nval = '';
              }
              this.getPostUpdateListOld(data['postId'],data['type2'],data['type1'],nval,'',dontclearText);
            }
            else{
              if(data['type3'] == 'notification'){
                if(bottom){
                  nval = '1';
                }
                else{
                  nval = '';
                }
              }
              this.getPostUpdateList(data['postId'],data['type2'],data['type1'],nval);
            }
          }
          else{

            if(data['type3'] == 'color'){
              
            }
            if(data['type3'] != 'delete'){
              this.getPostUpdateList(data['postId'],data['type2']);
            }
           
          }
        }
      }
      if(data['type3'] == 'color'){
        
      }
  });

    this.commonApi.ThreadDetailCommentDataSubject.subscribe((postData) => {
      if(postData == ''){
        this.infoLoading = false;
        this.expandFlag = true;
        this.emptyResult = false;
        this.loadingResult = false;
        this.commonApi.emitThreadDetailReplyData(this.expandFlag);
      }
      else{
        if(this.commentUploadedItemsFlag || this.postReplyButtonEnable || this.replyAssignedUsersList.length>0){
          const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
          modalRef.componentInstance.access = 'Cancel';
          modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
            modalRef.dismiss('Cross click');
            if(!receivedService) {
              this.setScreenHeight();
              this.commonApi.emitThreadDetailReplyId(this.commentId);
              return;
            } else {
              this.loadingResult = true;
              this.expandFlag = false;
              this.commonApi.emitThreadDetailReplyData(this.expandFlag);
              
              this.postData = [];

              let  commentData= JSON.parse(postData);
              if(this.domainId!=commentData.domainId)
              {
                this.subscriberAccess=true;
              }
              else
              {
                this.subscriberAccess=false;
              }
              this.threadId=commentData.commentThreadId;
              this.commentId=commentData.commentPostId;
              this.parentPostId=commentData.commentPostId;
              this.commentReplyAccessLevel=commentData.commentReplyAccessLevel;
              this.techSubmmitFlag = commentData.techSubmmitFlag;
              this.accessLevel = commentData.accessLevel;
              this.threadCloseStatus=commentData.threadCloseStatus;
              this.closeStatus=commentData.threadCloseStatus;
              this.threadUserId=commentData.threadUserId;
              this.adminUserNotOwner = commentData.adminUserNotOwner;
              this.postTypeAccess = commentData.postTypeAccess;
              this.specialOwnerAccess=commentData.specialOwnerAccess;
              this.threadOwner=commentData.threadOwner;
              console.log(JSON.parse(postData).commentThreadId);
              this.getCommentList(commentData.domainId);
            }
          });
        }
        else{
          this.loadingResult = true;
          this.expandFlag = false;
          this.commonApi.emitThreadDetailReplyData(this.expandFlag);
          
          this.postData = [];
          let  commentData= JSON.parse(postData);

          if(this.domainId!=commentData.domainId)
          {
            this.subscriberAccess=true;
          }
          else
          {
            this.subscriberAccess=false;
          }
          this.threadId=commentData.commentThreadId;
          this.commentId=commentData.commentPostId;
          this.parentPostId=commentData.commentPostId;
          this.commentReplyAccessLevel=commentData.commentReplyAccessLevel;
          this.accessLevel = commentData.accessLevel;
          this.threadCloseStatus=commentData.threadCloseStatus;
          this.closeStatus=commentData.threadCloseStatus;
          this.threadUserId=commentData.threadUserId;
          this.adminUserNotOwner = commentData.adminUserNotOwner;
          this.postTypeAccess = commentData.postTypeAccess;
          this.specialOwnerAccess=commentData.specialOwnerAccess;
          this.threadOwner=commentData.threadOwner;
          console.log(JSON.parse(postData).commentThreadId);
          setTimeout(() => {
          this.getCommentList(commentData.domainId);
          }, 1);
        }
      }

    });
  }

  getCommentList(domainIdInfo='')
  {

    var objData = {};
  objData["rows"]=1;
  objData["start"]=0;
  objData["userId"]=this.userId;
  objData["type"]=1;

  if(domainIdInfo && this.subscriberAccess)
  {
    objData["domainId"]=domainIdInfo;
  }
  else
  {
    objData["domainId"]=this.domainId;
  }

  objData["threadId"]=this.threadId;
  objData["commentId"]=this.commentId;
  let apiFormData={};
    this.threadPostService.getthreadDetailsios(apiFormData,objData).subscribe(res => {

      console.log(res.postListData);

      //this.replyListArray = res;

      this.infoLoading = false;

      //this.expandFlag = false;
      //this.commonApi.emitThreadDetailReplyData(this.expandFlag);

      this.getPostListSolr(res.postListData);
      if(res.postListData){
        this.emptyResult = false;
        this.loadingResult = false;
      }
      else{
        this.emptyResult = true;
        this.loadingResult = false;
      }

    });
    setTimeout(() => {
      this.setScreenHeight();
    }, 1);
  }

  getPostListSolr(postListData)
  {

    let newArr = [];
    this.postData = [];
    this.postLists = postListData;
    this.postDataLength = postListData.length;
    console.log(this.postLists);
    let postAttachments = [];

      if(this.translatelangId != ''){
        this.postLists['transText']= "Translate to "+this.translatelangArray['name'];
        this.postLists['transId']= this.translatelangId;
      }
      else{
        this.postLists['transText']= "Translate";
        this.postLists['transId'] = this.translatelangId;
      }
      this.postLists['postView'] = true;
      this.postLists['threadId'] = this.postLists['commentThreadId'];
      this.postLists['postId'] = this.postLists['commentPostId'];
      this.postLists['userName'] = this.postLists['commentUserName'];
      this.postLists['userId'] = this.postLists['commentUserId'];
      this.postLists['profileImage'] = this.postLists['commentProfileImage'];
      this.postLists['postStatus'] = this.postLists['commentPostStatus'];
      this.postLists['postType'] = this.postLists['commentPostType'];
      this.postLists['deleteFlag'] = this.postLists['commentDeletedFlag'];
      this.postLists['owner'] = this.postLists['commentOwnerInt'];
      this.postLists['newComment'] = false;
      this.postLists['postStFlag'] = true;
      this.postLists['postLoading'] = false;

      this.postLists['postReplyLoading'] = false;
      this.postLists['userRoleTitle'] = this.postLists['commentuserRoleTitle'] !='' && this.postLists['commentuserRoleTitle'] !=undefined ? this.postLists['commentuserRoleTitle'] : 'No Title';
      let createdOnNew = this.postLists['commentCreatedOn'];
      let createdOnDate = moment.utc(createdOnNew).toDate();
      //this.postLists['postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
      this.postLists['postCreatedOn'] = moment(createdOnDate).local().format('MMM DD, h:mm A');
      this.postLists['likeLoading'] = false;
      this.postLists['likeCount'] = this.postLists['commentLikeCount'];
      this.postLists['likeCountVal'] = this.postLists['commentLikeCount'] == 0 ? '-' : this.postLists['commentLikeCount'];
      if(this.postLists['likeCount'] == 0){
        this.postLists['likeCountValText'] = '';
      }
      else if(this.postLists['commentLikeCount'] == 1){
        this.postLists['likeCountValText'] = 'Like';
      }
      else{
        this.postLists['likeCountValText'] = 'Likes';
      }
      this.postLists['likeStatus'] = 0;
      if(this.postLists['commentLikedUsers'] != undefined){
        for(let a in this.postLists['commentLikedUsers']) {
          if(this.postLists['commentLikedUsers'][a] == this.userId) {
            this.postLists['likeStatus'] = 1;
          }
        }
      }
      //this.postLists['likeStatus'] = this.postLists['commentlikeStatus'];
      this.postLists['likeImg'] = (this.postLists['likeStatus'] == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
      this.postLists['attachmentLoading'] = false;
      if(this.postLists['commentUploadContents'])
      {
        this.postLists['attachments'] = this.postLists['commentUploadContents'];
        this.postLists['attachmentLoading'] = (this.postLists['commentUploadContents'].length>0) ? false : true;
      }
      else
      {
        this.postLists['commentUploadContents']=[];
        this.postLists['attachments']=[];

      }


      this.postLists['action'] = 'view';
      this.postLists['threadOwnerLabel'] = false;
      if(this.postLists['owner']  == this.postLists['commentUserId']){
        this.postLists['threadOwnerLabel'] = true;
      }
      this.postLists['actionDisable']= false;
      if(this.userId == this.postLists['commentUserId'] || this.postLists['ownerAccess'] == 1){
        this.postLists['actionDisable'] = true;
      }
      this.postLists['enableActionButton'] = true;
      // post edit delete action

      /*this.postLists['editDeleteAction'] = false;
      if((this.userId == this.postLists['commentUserId'] || this.postLists['ownerAccess'] == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
        this.postLists['editDeleteAction'] = true;
      }*/

      this.postLists['editDeleteAction'] = false;
      if(this.userId == this.postLists['commentUserId']){
        this.postLists['editDeleteAction'] = true;
      }
      this.postLists['commentEditAction'] = this.postLists['editDeleteAction'] ? true : this.accessLevel.edit;
      this.postLists['commentDeleteAction'] = this.postLists['editDeleteAction'] ? true : this.accessLevel.delete;
     if(this.subscriberAccess)
     {
      this.postLists['editDeleteAction'] =false;
      this.postLists['commentEditAction'] =false;
      this.postLists['commentDeleteAction'] =false;
     }
      postAttachments.push({
        id: this.postLists['postId'],
        attachments: this.postLists['commentUploadContents']
      });

      this.postLists['isEdited'] = this.postLists['commentIsEdited'];
      if(this.postLists['commentEditHistory']){
        let editdata = this.postLists['commentEditHistory'];
        for (let ed in editdata) {
          editdata[ed].userName = editdata[ed].commentUserName;
          editdata[ed].profileImage = editdata[ed].commentProfileImage;
          editdata[ed].updatedOnNew = editdata[ed].commentUpdatedOn;
          let editdate1 = editdata[ed].updatedOnNew;
          let editdate2 = moment.utc(editdate1).toDate();
          editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
        }
        this.postLists['editHistory'] = editdata;
      }

      let contentWeb1 = '';
      contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists['commentContent']));
      this.postLists['editedWeb'] = contentWeb1;

      let contentWeb2 = contentWeb1;
      this.postLists['contentWeb'] = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));


      this.postLists['contentWebDuplicate'] = this.postLists['commentContent'];
      this.postLists['contentDesc']=this.postLists['commentContent'];
      this.postLists['contentTranslate']=this.postLists['commentContent'];
     this.postLists['remindersData'] = this.postLists['remindersData'] != '' && this.postLists['remindersData'] != 'undefined' && this.postLists['remindersData'] != undefined ? this.postLists['remindersData'] : '';
      if(this.postLists['remindersData'] != ''){
        let prdata = this.postLists['remindersData'];
        for (let pr in prdata) {
          let reminderdate1 = prdata[pr].createdOn;
          let reminderdate2 = moment.utc(reminderdate1).toDate();
          prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
        }
      }

      this.postReplyLists = this.postLists['commentNestedReplies'] != undefined ? this.postLists['commentNestedReplies'] : [] ;
      this.postReplyDataLength = this.postLists['commentNestedReplies'] != undefined ? this.postLists['commentNestedReplies'].length : 0;
      if(this.postReplyDataLength>0){
        console.log(this.postReplyLists);
        let postReplyAttachments = [];
        for (let prl in this.postReplyLists) {
          this.postReplyLists[prl].threadId = this.postLists['commentThreadId'];
          this.postReplyLists[prl].commentPostId = this.postLists['commentPostId'];
          this.postReplyLists[prl].postId = this.postReplyLists[prl].replyId;
          this.postReplyLists[prl].profileImage=this.postReplyLists[prl].replyProfileImage;
          this.postReplyLists[prl].userName=this.postReplyLists[prl].replyUserName;
          this.postReplyLists[prl].userId=this.postReplyLists[prl].replyUserId;
          this.postReplyLists[prl].postStatus = this.postReplyLists[prl].replyPostStatus;
          this.postReplyLists[prl].postType = this.postReplyLists[prl].replyPostType;
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
          this.postReplyLists[prl].action = 'view';
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
          this.postReplyLists[prl].threadOwnerLabel = false;
          if( this.threadUserId == this.postReplyLists[prl].replyUserId){
            this.postReplyLists[prl].threadOwnerLabel = true;
          }
          this.postReplyLists[prl].actionDisable = false;
          if(this.userId == this.postReplyLists[prl].replyUserId || this.postReplyLists[prl].ownerAccess == 1){
            this.postReplyLists[prl].actionDisable = true;
          }
          this.postReplyLists[prl].enableActionButton = true;
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
          if(this.subscriberAccess)
          {
            this.postReplyLists[prl].editDeleteAction=false;
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
      this.postLists['nestedReplies'] = this.postReplyLists;
      // push data
      if(this.fromNotificationPageFlag){
        newArr.push(this.postLists);
      }
      else{
        this.postData.push(this.postLists);
      }



    //this.postLoading = false;
    //this.newPostLoad = false;
    //this.threadViewData.buttonTop = true;
    //this.threadViewData.buttonBottom = false;
    console.log(this.postData);
  }

  // Toogle Media Info
  toggleReplyInfo() {
   
      if(!this.expandFlag){        
        this.emptyResult = true;
        this.postData = [];
        this.expandFlag = (this.expandFlag) ? false : true;
        this.commonApi.emitThreadDetailReplyData(this.expandFlag);
      }
      else{
        this.expandFlag = (this.expandFlag) ? false : true;
        this.commonApi.emitThreadDetailReplyData(this.expandFlag);
        this.loadingResult = false;
      }
    
  }
// Get Uploaded Items
nestedAttachments(items) {
  this.uploadedItems = items;
  //this.replyPostOnFlag2 = true;
  //this.uploadReplyFlag  = true;
}
attachments(items) {
  this.uploadedItems = items;
  if(this.uploadedItems.length>0){
    /*if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
      this.openPost(0);
    }
    else{
      this.replyPostOnFlag3 = true;
      this.uploadCommentFlag = true;
      this.uploadedItems = items;
    }*/
  }
  else{
    /*if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
      this.openPost(0);
    }
    else{
      this.replyPostOnFlag3 = true;
      this.uploadCommentFlag = true;
      this.uploadedItems = items;
    }  */
  }
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
    /*this.replyPostOnFlag2 = false;
    this.replyPostOnFlag3 = false;
    this.uploadCommentFlag = false;
    this.uploadReplyFlag = false;
    this.tagReplyFlag = false;
    this.tagCommentFlag = false;*/
  }
}
  setScreenHeight(){
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - (93));
  }

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
              this.commonApi.emitThreadListData(this.threadViewData);
            }
            else if(posttype == 'reply'){
              //this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
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
              //this.threadViewData.transText = "Translate to "+this.translatelangArray['name'];
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

    taponDescription(content,type,i,selectLanguage,j='')
    {
      if(type=="thread-content"){
        content = '';
        content = this.threadViewData.contentTranslate;
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



  updateCommentSolr(pid,ptype,type,fromPush,othertype){

    this.postDataLength = this.postLists.length;
    console.log(this.postLists);
    this.postLists = this.postLists[0];
    let postAttachments = [];

    if(this.translatelangId != ''){
            this.postLists['transText']= "Translate to "+this.translatelangArray['name'];
            this.postLists['transId']= this.translatelangId;
          }
          else{
            this.postLists['transText']= "Translate";
            this.postLists['transId'] = this.translatelangId;
          }
          this.postLists['postView'] = true;
          this.postLists['threadId'] = this.postLists['commentThreadId'];
          this.postLists['postId'] = this.postLists['commentPostId'];
          this.postLists['userName'] = this.postLists['commentUserName'];
          this.postLists['userId'] = this.postLists['commentUserId'];
          this.postLists['profileImage'] = this.postLists['commentProfileImage'];
          this.postLists['postStatus'] = this.postLists['commentPostStatus'];
          this.postLists['postType'] = this.postLists['commentPostType'];
          this.postLists['deleteFlag'] = this.postLists['commentDeletedFlag'];
          this.postLists['owner'] = this.postLists['commentOwnerInt'];
          this.postLists['newComment'] = false;
          this.postLists['postStFlag'] = true;
          this.postLists['postLoading'] = false;

          this.postLists['postReplyLoading'] = false;
          this.postLists['userRoleTitle'] = this.postLists['commentuserRoleTitle'] !='' && this.postLists['commentuserRoleTitle'] !=undefined ? this.postLists['commentuserRoleTitle'] : 'No Title';
          let createdOnNew = this.postLists['commentCreatedOn'];
          let createdOnDate = moment.utc(createdOnNew).toDate();
          //this.postLists['postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
          this.postLists['postCreatedOn'] = moment(createdOnDate).local().format('MMM DD, h:mm A');
          this.postLists['likeLoading'] = false;
          this.postLists['likeCount'] = this.postLists['commentLikeCount'];
          this.postLists['likeCountVal'] = this.postLists['commentLikeCount'] == 0 ? '-' : this.postLists['commentLikeCount'];
          if(this.postLists['likeCount'] == 0){
            this.postLists['likeCountValText'] = '';
          }
          else if(this.postLists['commentLikeCount'] == 1){
            this.postLists['likeCountValText'] = 'Like';
          }
          else{
            this.postLists['likeCountValText'] = 'Likes';
          }
          this.postLists['likeStatus'] = 0;
          if(this.postLists['commentLikedUsers'] != undefined){
            for(let a in this.postLists['commentLikedUsers']) {
              if(this.postLists['commentLikedUsers'][a] == this.userId) {
                this.postLists['likeStatus'] = 1;
              }
            }
          }
          //this.postLists['likeStatus'] = this.postLists['commentlikeStatus'];
          this.postLists['likeImg'] = (this.postLists['likeStatus'] == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
          this.postLists['attachmentLoading'] = false;
          if(this.postLists['commentUploadContents'])
          {
            this.postLists['attachments'] = this.postLists['commentUploadContents'];
            this.postLists['attachmentLoading'] = (this.postLists['commentUploadContents'].length>0) ? false : true;
          }
          else
          {
            this.postLists['commentUploadContents']=[];
            this.postLists['attachments']=[];

          }


          this.postLists['action'] = 'view';
          this.postLists['threadOwnerLabel'] = false;
          if(this.postLists['owner']  == this.postLists['commentUserId']){
            this.postLists['threadOwnerLabel'] = true;
          }
          this.postLists['actionDisable']= false;
          if(this.userId == this.postLists['commentUserId'] || this.postLists['ownerAccess'] == 1){
            this.postLists['actionDisable'] = true;
          }
          this.postLists['enableActionButton'] = true;
          // post edit delete action

          /*this.postLists['editDeleteAction'] = false;
          if((this.userId == this.postLists['commentUserId'] || this.postLists['ownerAccess'] == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
            this.postLists['editDeleteAction'] = true;
          }*/

          this.postLists['editDeleteAction'] = false;
          if(this.userId == this.postLists['commentUserId']){
            this.postLists['editDeleteAction'] = true;
          }
          this.postLists['commentEditAction'] = this.postLists['editDeleteAction'] ? true : this.accessLevel.edit;
          this.postLists['commentDeleteAction'] = this.postLists['editDeleteAction'] ? true : this.accessLevel.delete;
          postAttachments.push({
            id: this.postLists['postId'],
            attachments: this.postLists['commentUploadContents']
          });

          this.postLists['isEdited'] = this.postLists['commentIsEdited'];
          if(this.postLists['commentEditHistory']){
            let editdata = this.postLists['commentEditHistory'];
            for (let ed in editdata) {
              editdata[ed].userName = editdata[ed].commentUserName;
              editdata[ed].profileImage = editdata[ed].commentProfileImage;
              editdata[ed].updatedOnNew = editdata[ed].commentUpdatedOn;
              let editdate1 = editdata[ed].updatedOnNew;
              let editdate2 = moment.utc(editdate1).toDate();
              editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
            }
            this.postLists['editHistory'] = editdata;
          }

          let contentWeb1 = '';
          contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists['commentContent']));
          this.postLists['editedWeb'] = contentWeb1;

          let contentWeb2 = contentWeb1;
          this.postLists['contentWeb'] = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));


          this.postLists['contentWebDuplicate'] = this.postLists['commentContent'];
          this.postLists['contentDesc']=this.postLists['commentContent'];
          this.postLists['contentTranslate']=this.postLists['commentContent'];
         this.postLists['remindersData'] = this.postLists['remindersData'] != '' && this.postLists['remindersData'] != 'undefined' && this.postLists['remindersData'] != undefined ? this.postLists['remindersData'] : '';
          if(this.postLists['remindersData'] != ''){
            let prdata = this.postLists['remindersData'];
            for (let pr in prdata) {
              let reminderdate1 = prdata[pr].createdOn;
              let reminderdate2 = moment.utc(reminderdate1).toDate();
              prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
            }
          }



                    this.postReplyLists = this.postLists['commentNestedReplies'] != undefined ? this.postLists['commentNestedReplies'] : [] ;
                    this.postReplyDataLength = this.postLists['commentNestedReplies'] != undefined ? this.postLists['commentNestedReplies'].length : 0;

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
                        if( this.threadUserId == this.postReplyLists[prl].replyUserId){
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
                        if(this.subscriberAccess)
                        {
                          this.postReplyLists[prl].editDeleteAction=false;
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

                        this.postLists['commentNestedReplies'] = this.postReplyLists;
                      this.postLists['nestedReplies'] = this.postLists['commentNestedReplies'];

                      }

                    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
                    localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));

                    let newArr = [];
                    newArr = this.postLists;
                    this.postData[0]=newArr;
                    console.log(this.postLists);
                    console.log(this.postData);
        setTimeout(() => {
        this.postData[0].enableActionButton = true;
        }, 2000);

  }

  updateReplySolr(pid,ptype,type,fromPush,othertype){

    console.log(this.postLists);
    this.postReplyLists = this.postLists;
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
          if( this.threadUserId == this.postReplyLists[prl].replyUserId){
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
            if(this.subscriberAccess)
            {
              this.postReplyLists[prl].editDeleteAction=false;
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

          if(type == 'replyedit'){
            //let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
            let itemIndex2 = this.postData[0].commentNestedReplies.findIndex(item => item.postId == pid);
            this.postData[0].commentNestedReplies[itemIndex2] = this.postReplyLists[prl];
            this.postData[0].nestedReplies[itemIndex2] = this.postReplyLists[prl];
            setTimeout(() => {
            this.postData[0].commentNestedReplies[itemIndex2].enableActionButton = true;
            //this.postData[0].nestedReplies[itemIndex2].enableActionButton = true;
            }, 2000);
          }
          else{
              for (let r1 in this.postData) {
              this.postData[r1].postNew = false;
              this.postData[r1].postReplyLoading = false;
              if(this.postData[r1].postId == this.parentPostId){

              let itemIndex3 = this.postData[r1].commentNestedReplies.findIndex(item => item.replyId == pid);
              if (itemIndex3 < 0) {
                this.postData[r1]['nestedReplies'] = [];
                this.postData[r1].commentNestedReplies.push(this.postReplyLists[prl]);
                this.postData[r1]['nestedReplies'] = this.postData[r1]['commentNestedReplies'];
              }


              }
              }

              let itemIndex2 = this.postData[0].commentNestedReplies.findIndex(item => item.replyId == pid);
              if(fromPush=='1'){
              setTimeout(() => {
                this.postData[0].commentNestedReplies[itemIndex2].newReply = true;
                //this.postData[0].nestedReplies[itemIndex2].newReply = true;
              }, 10);
              }
              setTimeout(() => {
                 this.postData[0].commentNestedReplies[itemIndex2].enableActionButton=true;
                 //this.postData[0].nestedReplies[itemIndex2].enableActionButton=true;
              }, 2000);
              

             }

        }
        let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
        localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));

  }

  // post particular list solar api
  getPostUpdateList(pid,ptype,type='',fromPush='',othertype=''){

    setTimeout(() => {
      var objData = {};
      objData["rows"]=1;
      objData["start"]=0;
      objData["userId"]=this.userId;
      objData["type"]=1;
      objData["domainId"]=this.domainId;
      objData["threadId"]=this.threadId;

      if(type != 'replyedit' && type != 'replynew'){
        objData["commentId"]=pid;
      }
      else{
        objData["commentId"]=this.parentPostId;
        objData["replyId"]=pid;
      }
      let apiFormData={};
        this.threadPostService.getthreadDetailsios(apiFormData,objData).subscribe(res => {
          if(res.status=='Success'){
            this.postLists = [];

              if(type != 'replyedit' && type != 'replynew'){
                this.postLists.push(res.postListData);
                this.updateCommentSolr(pid,ptype,type,fromPush,othertype);
                console.log(this.postLists);
              }
              else{
                this.postLists = res.commentNestedReplies;
                this.updateReplySolr(pid,ptype,type,fromPush,othertype);
                console.log(this.postLists);
              }
          }
          else{
            this.postData = [];
            this.postLoading = false;
            this.postErrorMsg = res.result;
            this.postError = true;
          }
        }, (error => {
            this.postLoading = false;
            this.postErrorMsg = error;
            this.postError  = true;
          })
        );

    }, 5000);
    console.log("test"+pid,ptype,type,fromPush,othertype);
  }

    // post get particular list not solar api
    getPostUpdateListOld(pid,ptype,type='',fromPush='',othertype='',dontclearText=0){

      setTimeout(() => {
        if(this.threadId != undefined){
          this.platformId=localStorage.getItem('platformId');
          const apiFormData = new FormData();

          apiFormData.append('apiKey', Constant.ApiKey);
          apiFormData.append('domainId', this.domainId);
          apiFormData.append('countryId', this.countryId);
          apiFormData.append('userId', this.userId);
          apiFormData.append('threadId', this.threadId);
          apiFormData.append('postId', pid);
          apiFormData.append('platformId', this.platformId);
          apiFormData.append('type', "0");
          apiFormData.append('version', "2");
          apiFormData.append('platform', this.accessPlatForm);

          this.threadPostService.getPostListAPI(apiFormData).subscribe(res => {
            if(res.status=='Success'){
              this.postErrorMsg = "";
              this.postError = false;
              this.postLoading = false;

                this.postLists = res.data.post;
                this.postDataLength = res.data.total;
                let postAttachments = [];
                if(this.postDataLength>0){
                  for (let i in this.postLists) {
                    //this.postLists[i].transText = "Translate";
                    if(this.translatelangId != ''){
                      this.postLists[i].transText = "Translate to "+this.translatelangArray['name'];
                      this.postLists[i].transId = this.translatelangId;
                    }
                    else{
                      this.postLists[i].transText = "Translate";
                      this.postLists[i].transId = this.translatelangId;
                    }
                    this.postLists[i].newReply = false;
                    this.postLists[i].newComment = false;
                    this.postLists[i].postView = true;
                    this.postLists[i].postLoading = false;
                    if(type != 'replyedit' && type != 'replynew'){
                      this.postLists[i].commentPostId = this.postLists[i].postId;
                      this.postLists[i].commentThreadId = this.postLists[i].threadId;
                      this.postLists[i].commentUserName = this.postLists[i].userName;
                      this.postLists[i].commentProfileImage = this.postLists[i].profileImage;
                      this.postLists[i].commentUserId = this.postLists[i].userId;
                      this.postLists[i].commentPostStatus = this.postLists[i].postStatus;
                      this.postLists[i].commentPostType = this.postLists[i].postType;
                    }
                    if(type == 'replyedit' || type == 'replynew'){
                      this.postLists[i].replyUserId = this.postLists[i].userId;
                      this.postLists[i].replyUserName = this.postLists[i].userName;
                      this.postLists[i].replyProfileImage = this.postLists[i].profileImage;
                      this.postLists[i].replyId = this.postLists[i].postId;
                      this.postLists[i].replyPostStatus = this.postLists[i].postStatus;
                      this.postLists[i].replyPostType = this.postLists[i].postType;

                      this.postLists[i].editDeleteAction = false;
                      if(this.userId == this.postLists[i].userId){
                        this.postLists[i].editDeleteAction = true;
                      }
                      this.postLists[i].replyEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
                      this.postLists[i].replyDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;

                      if(this.subscriberAccess)
                        {
                          this.postLists[i].editDeleteAction=false;
                          this.postLists[i].replyEditAction=false;
                          this.postLists[i].replyDeleteAction=false;
                        }

                    }

                    this.postLists[i].postReplyLoading = false;
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
                    if(this.postLists[i].commentLikedUsers != undefined){
                      this.postLists[i].likeStatus = 0;
                      for(let a in this.postLists[i].commentLikedUsers) {
                        if(this.postLists[i].commentLikedUsers[a] == this.userId) {
                          this.postLists[i].likeStatus = 1;
                        }
                      }
                    }
                    this.postLists[i].likeStatus = this.postLists[i].likeStatus;
                    this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                    this.postLists[i].attachments = this.postLists[i].uploadContents;
                    this.postLists[i].attachmentLoading = (this.postLists[i].uploadContents.length>0) ? false : true;
                    postAttachments.push({
                      id: this.postLists[i].postId,
                      attachments: this.postLists[i].uploadContents
                    });
                    let contentWeb1 = '';
                    contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].contentWeb));
                    this.postLists[i].editedWeb = contentWeb1;

                    let contentWeb2 = contentWeb1;
                    this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

                    this.postLists[i].contentWebDuplicate = this.postLists[i].contentWeb;
                    this.postLists[i].contentTranslate = this.postLists[i].content;
                    this.postLists[i].action = 'view';
                    this.postLists[i].postOwner = false;
                    this.postLists[i].threadOwnerLabel = false;
                    if( this.threadUserId == this.postLists[i].userId){
                      this.postLists[i].threadOwnerLabel = true;
                      this.postLists[i].postOwner = true;
                    }
                    this.postLists[i].actionDisable = false;
                    if(this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1){
                      this.postLists[i].actionDisable = true;
                    }
                    this.postLists[i].enableActionButton = true;
                    // post edit delete action
                    /*this.postLists[i].editDeleteAction = false;
                    if((this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                      this.postLists[i].editDeleteAction = true;
                    }*/

                    this.postLists[i].editDeleteAction = false;
                    if(this.userId == this.postLists[i].userId){
                      this.postLists[i].editDeleteAction = true;
                    }
                    this.postLists[i].commentEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
                    this.postLists[i].commentDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;


                    if(this.postLists[i].editHistory){
                      let editdata = this.postLists[i].editHistory;
                      for (let ed in editdata) {
                        let editdate1 = editdata[ed].updatedOnNew;
                        let editdate2 = moment.utc(editdate1).toDate();
                        editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                      }
                    }

                    this.postLists[i].remindersData = this.postLists[i].remindersData != '' && this.postLists[i].remindersData != undefined && this.postLists[i].remindersData != 'undefined' ? this.postLists[i].remindersData : '';
                    if(this.postLists[i].remindersData != ''){
                      let prdata = this.postLists[i].remindersData;
                      for (let pr in prdata) {
                        let reminderdate1 = prdata[pr].createdOn;
                        let reminderdate2 = moment.utc(reminderdate1).toDate();
                        prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                      }
                    }

                    if(type != 'replyedit' && ptype == 'edit'){
                      this.postReplyLists = this.postLists[i].nestedReplies != undefined ? this.postLists[i].nestedReplies : [] ;
                      this.postReplyDataLength = this.postLists[i].nestedReplies != undefined ? this.postLists[i].nestedReplies.length : 0;
                      if(this.postReplyDataLength>0){
                        let postReplyAttachments = [];
                        for (let pr in this.postReplyLists) {
                          this.postReplyLists[pr].deleteFlag = this.postReplyLists[pr].replyDeletedFlag;
                          this.postReplyLists[pr].replyUserId = this.postReplyLists[pr].userId;
                          this.postReplyLists[pr].replyUserName = this.postReplyLists[pr].userName;
                          this.postReplyLists[pr].replyProfileImage = this.postReplyLists[pr].profileImage;
                          this.postReplyLists[pr].replyId = this.postReplyLists[pr].postId;
                          this.postReplyLists[pr].replyPostStatus = this.postReplyLists[pr].postStatus;
                          this.postReplyLists[pr].replyPostType = this.postReplyLists[pr].postType;
                          this.postReplyLists[pr].postNew = false;
                          this.postReplyLists[pr].newReply = false;
                          this.postReplyLists[pr].postView = true;
                          this.postReplyLists[pr].postStFlag = true;
                          this.postReplyLists[pr].postReplyLoading = false;
                          this.postReplyLists[pr].enableActionButton = true;
                          this.postReplyLists[pr].userRoleTitle = this.postReplyLists[pr].userRoleTitle !='' && this.postReplyLists[pr].userRoleTitle != undefined ? this.postReplyLists[pr].userRoleTitle : 'No Title';
                          let createdOnNew = this.postReplyLists[pr].createdOnNew;
                          let createdOnDate = moment.utc(createdOnNew).toDate();
                          //this.postReplyLists[pr].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
                          this.postReplyLists[pr].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
                          this.postReplyLists[pr].likeLoading = false;
                          this.postReplyLists[pr].likeCount = this.postReplyLists[pr].likeCount;
                          this.postReplyLists[pr].likeCountVal = this.postReplyLists[pr].likeCount == 0 ? '-' : this.postReplyLists[pr].likeCount;
                          if(this.postReplyLists[pr].likeCount == 0){
                            this.postReplyLists[pr].likeCountValText = '';
                          }
                          else if(this.postReplyLists[pr].likeCount == 1){
                            this.postReplyLists[pr].likeCountValText = 'Like';
                          }
                          else{
                            this.postReplyLists[pr].likeCountValText = 'Likes';
                          }

                          this.postReplyLists[pr].likeStatus = this.postReplyLists[pr].likeStatus;
                          this.postReplyLists[pr].likeImg = (this.postReplyLists[pr].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                          this.postReplyLists[pr].attachments = this.postReplyLists[pr].uploadContents;
                          this.postReplyLists[pr].attachmentLoading = (this.postReplyLists[pr].uploadContents.length>0) ? false : true;
                          this.postReplyLists[pr].action = 'view';
                          this.postReplyLists[pr].threadOwnerLabel = false;
                          if( this.threadUserId == this.postReplyLists[pr].replyUserId){
                            this.postReplyLists[pr].threadOwnerLabel = true;
                          }
                          this.postReplyLists[pr].actionDisable = false;
                          if(this.userId == this.postReplyLists[pr].replyUserId || this.postReplyLists[pr].ownerAccess == 1){
                            this.postReplyLists[pr].actionDisable = true;
                          }
                          // post edit delete action
                          this.postReplyLists[pr].editDeleteAction = false;
                          if(this.userId == this.postReplyLists[pr].userId){
                            this.postReplyLists[pr].editDeleteAction = true;
                          }
                          this.postReplyLists[pr].replyEditAction = this.postReplyLists[pr].editDeleteAction ? true : this.accessLevel.edit;
                          this.postReplyLists[pr].replyDeleteAction = this.postReplyLists[pr].editDeleteAction ? true : this.accessLevel.delete;
                          if(this.subscriberAccess)
                          {
                            this.postReplyLists[pr].editDeleteAction=false;
                            this.postReplyLists[pr].replyEditAction=false;
                            this.postReplyLists[pr].replyDeleteAction=false;
                          }
                          postReplyAttachments.push({
                            id: this.postReplyLists[pr].postId,
                            attachments: this.postReplyLists[pr].uploadContents
                          });

                          if(this.postReplyLists[pr].editHistory){
                            let editdata = this.postReplyLists[pr].editHistory;
                            for (let ed in editdata) {
                              let editdate1 = editdata[ed].updatedOnNew;
                              let editdate2 = moment.utc(editdate1).toDate();
                              editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
                            }
                          }

                          let contentWeb1 = '';
                          contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postReplyLists[pr].contentWeb));
                          this.postReplyLists[pr].editedWeb = contentWeb1;

                          let contentWeb2 = contentWeb1;
                          this.postReplyLists[pr].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));

                          this.postReplyLists[pr].contentWebDuplicate = this.postReplyLists[pr].contentWeb;
                          this.postReplyLists[pr].content = this.postReplyLists[pr].contentWeb;
                          this.postReplyLists[pr].contentTranslate = this.postReplyLists[pr].content;
                          this.postReplyLists[pr].remindersData = this.postReplyLists[pr].remindersData != '' && this.postReplyLists[pr].remindersData != undefined && this.postReplyLists[pr].remindersData != 'undefined' ? this.postReplyLists[pr].remindersData : '';
                          if(this.postReplyLists[pr].remindersData != ''){
                            let prdata = this.postReplyLists[pr].remindersData;
                            for (let pr in prdata) {
                              let reminderdate1 = prdata[pr].createdOn;
                              let reminderdate2 = moment.utc(reminderdate1).toDate();
                              prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
                            }
                          }

                        }
                        let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
                        localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));
                      }
                      this.postLists[i].commentNestedReplies = this.postReplyLists;

                    }

                    if(ptype == 'edit'){
                      if(type == 'replyedit'){
                        //let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
                        let itemIndex2 = this.postData[0].nestedReplies.findIndex(item => item.postId == pid);
                        this.postData[0].nestedReplies[itemIndex2] = this.postLists[i];
                        setTimeout(() => {
                          this.postData[0].nestedReplies[itemIndex2].enableActionButton = true;
                        }, 2000);
                      }
                      else{
                        //let itemIndex = this.postData.findIndex(item => item.postId == pid);
                        this.postData[0] = this.postLists[i];
                        setTimeout(() => {
                          this.postData[0].enableActionButton = true;
                        }, 2000);
                      }
                    }
                    else{
                      if(type == 'replynew'){
                        for (let r1 in this.postData) {
                          this.postData[r1].postNew = false;
                          this.postData[r1].postReplyLoading = false;
                          if(this.postData[r1].postId == this.parentPostId){

                          let itemIndex3 = this.postData[r1].commentNestedReplies.findIndex(item => item.replyId == pid);
                          if (itemIndex3 < 0) {
                            this.postData[r1].commentNestedReplies.push(this.postLists[i]);
                          }
                          this.postData[r1]['nestedReplies'] = this.postData[r1]['commentNestedReplies'];

                          }
                        }

                        if(fromPush=='1')
                        {
                          let ht3 = this.top.nativeElement.scrollHeight;
                          //$(".threadPostcomment").scrollTop(ht3);
                          $(".threadReplyPostcomment").animate({ scrollTop: ht3 }, "medium");
                        }

                      }
                      else{  }
                    }
                  }
                  let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
                  localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));
              }
              else{
                this.postLoading = false;
                this.postErrorMsg = res.result;
                this.postError = true;
              }
            }
            else{
              this.postData = [];
              this.postLoading = false;
              this.postErrorMsg = res.result;
              this.postError = true;
            }
          }, (error => {
              this.postLoading = false;
              this.postErrorMsg = error;
              this.postError  = true;
            })
          );
        }
      }, 1000);
    }

    tapOnThreadId(){
      let data = {
        type3: 'tap-threadId',
        parentPostId: this.parentPostId,
        threadId: this.threadId
      }
      this.commonApi.emitThreadDetailReplyUpdate(data);
    }

    private isUserNearBottomorlastreplyUpdate(): boolean {
      const threshold = 100;
      const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
      const height = this.top.nativeElement.scrollHeight;
      console.log(position+'--'+height+'--'+threshold);
      return position > height - threshold;
    }


    ngOnDestroy() {
      //this.bodyElem.classList.remove(this.bodyClass);
     // this.bodyElem.classList.remove(this.bodyClass1);
      let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
      localStorage.removeItem(threadPostStorageText);
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
