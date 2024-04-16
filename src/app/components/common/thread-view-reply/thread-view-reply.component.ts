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
  selector: 'app-thread-view-reply',
  templateUrl: './thread-view-reply.component.html',
  styleUrls: ['./thread-view-reply.component.scss'],
  providers: [MessageService]
})
export class ThreadViewReplyComponent implements OnInit,  OnDestroy{

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
     else if(event.key === 'Enter')
     {
      const exp = /<p[^>]*>(&nbsp;|\s+|<br\s*\/?>)*<\/p>/g;
      this.postReplyDesc=this.postReplyDesc.replace(exp, '');

        if(this.postReplyButtonEnable && this.postReplyDesc != ''){
          this.enterKeyPressFlag = true;
          this.setPostType('Comment','0',this.parentPostId,'nested-reply');
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
  }

  ngOnInit(): void {


    this.bodyElem = document.getElementsByTagName('body')[0];
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.teamMemberId = this.user.Userid;
    this.roleId = this.user.roleId;
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

    setTimeout(() => {
      this.getUserProfile();
    }, 2000);

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
              this.resetNestedReplyBox();
              this.getPostUpdateListOld(response['postId'],'refresh','replynew');
            //}
          }
          break;
        case 'post-edit':
          if(response['nestedReply'] == "1" && response['parentPostId'] == this.parentPostId){
           //if(response['viewpage'] == "0"){
              this.resetEditReplyBox();
              this.parentPostId = response['parentPostId'];
              let itemIndex2 = this.postData[0].nestedReplies.findIndex(item => item.postId == response['postId']);
              this.postData[0].nestedReplies[itemIndex2].postReplyLoading = true;
              this.moveScroll(response['parentPostId']);
              this.postData[0].nestedReplies[itemIndex2].postView = true;
              this.postFixRefresh = true;
              this.resetNestedReplyBox();
              this.getPostUpdateListOld(response['postId'],'edit','replyedit');
            //}
          }
          else{
            //if(response['viewpage'] == "0"){
              if(response['postId'] == this.parentPostId ){
                this.resetEditReplyBox();
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
              this.removeHilightColor();
            }
            if(data['type3'] != 'delete'){
              this.getPostUpdateList(data['postId'],data['type2']);
            }
            if(data['type3'] == 'delete'){
              this.deletePost(data['postId'], data['replyType'], data['parentPostId'], '1');
            }
          }
        }
      }
      if(data['type3'] == 'color'){
        this.removeHilightColor();
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
              this.resetNestedReplyBox();
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
          this.resetNestedReplyBox();
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
    }, 1000);
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
      if(this.commentUploadedItemsFlag || this.postReplyButtonEnable || this.replyAssignedUsersList.length>0){
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'Cancel';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          if(!receivedService) {
            return;
          } else {
            this.resetNestedReplyBox();
            this.emptyResult = true;
            this.postData = [];
            this.expandFlag = (this.expandFlag) ? false : true;
            this.commonApi.emitThreadDetailReplyData(this.expandFlag);
          }
        });
      }
      else{
        this.resetNestedReplyBox();
        this.emptyResult = true;
        this.postData = [];
        this.expandFlag = (this.expandFlag) ? false : true;
        this.commonApi.emitThreadDetailReplyData(this.expandFlag);
        this.loadingResult = false;
      }
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
    let pmsgHeight = (this.apiUrl.newupdateRefresh) ? 27 : 0;
    this.bodyHeight = window.innerHeight;
    setTimeout(() => {
      this.enableReplyBox = true;
    }, 1000);

    if(this.threadCloseStatus == 0){
      this.innerHeight = (this.bodyHeight - (234 + pmsgHeight));
    }
    else if(!this.commentReplyAccessLevel){
      this.innerHeight = (this.bodyHeight - (234 + pmsgHeight));
    }
    else{
      this.innerHeight = (this.bodyHeight - (76 + pmsgHeight));
    }
    //this.infoLoading = false;
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

    getUserProfile() {
      let userData = {
        'api_key': Constant.ApiKey,
        'user_id': this.userId,
        'domain_id': this.domainId,
        'countryId': this.countryId
      }
      this.probingApi.getUserProfile(userData).subscribe((response) => {
        let resultData = response.data;
        this.loginUserRole = resultData.userRole;
        this.loginUserProfileImg = resultData.profile_image;
        this.loginUserAvailability = resultData.availability;
        this.loginUsername = resultData.username;
      });
    }

    getUserProfileStatus(type,uid,pid,ppId) {
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', uid);
      this.probingApi.GetUserAvailability(apiFormData).subscribe((response) => {
        let resultData = response.items;
        let availability = resultData.availability;
        let availabilityStatusName = resultData.availabilityStatusName;
        let badgeTopUser = resultData.badgeTopUser;
        if(type == 'reply'){
          let itemIndex2 = this.postData[0]['commentNestedReplies'].findIndex(item => item.postId == pid);
          this.postData[0]['commentNestedReplies'][itemIndex2].availability = availability;
          this.postData[0]['commentNestedReplies'][itemIndex2].availabilityStatusName = availabilityStatusName;
          this.postData[0]['commentNestedReplies'][itemIndex2].profileShow = true;
        }
        else{
          let itemIndex1 = this.postData.findIndex(item => item.postId == pid);
          this.postData[itemIndex1].availability = availability;
          this.postData[itemIndex1].availabilityStatusName = availabilityStatusName;
          this.postData[itemIndex1].profileShow = true;
        }

      });
    }


  socialAction(type, status, postId, replyType='', ppId='') {
    if(replyType == 'nested-reply'){
      for (let i in this.postData) {
        if(this.postData[i].postId == ppId){
          for (let j in this.postData[i].nestedReplies) {
            if(this.postData[i].nestedReplies[j].postId == postId){
              console.log(type,status,postId);
              let actionStatus = '';
              let actionFlag = true;
              let likeCount = this.postData[i].nestedReplies[j].likeCount;
              switch(type) {
                case 'like':
                actionFlag = (this.postData[i].nestedReplies[j].likeLoading) ? false : true;
                actionStatus = (status == 0) ? 'liked' : 'disliked';
                this.postData[i].nestedReplies[j].likeStatus = (status == 0) ? 1 : 0;
                this.postData[i].nestedReplies[j].likeStatus = this.postData[i].nestedReplies[j].likeStatus;
                this.postData[i].nestedReplies[j].likeImg = (this.postData[i].nestedReplies[j].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                this.postData[i].nestedReplies[j].likeCount = (status == 0) ? likeCount+1 : likeCount-1;
                this.postData[i].nestedReplies[j].likeCount = this.postData[i].nestedReplies[j].likeCount;
                this.postData[i].nestedReplies[j].likeCountVal = this.postData[i].nestedReplies[j].likeCount == 0 ? '-' : this.postData[i].nestedReplies[j].likeCount;
                if(this.postData[i].nestedReplies[j].likeCount == 0){
                  this.postData[i].nestedReplies[j].likeCountValText = '';
                }
                else if(this.postData[i].nestedReplies[j].likeCount == 1){
                  this.postData[i].nestedReplies[j].likeCountValText = 'Like';
                }
                else{
                  this.postData[i].nestedReplies[j].likeCountValText = 'Likes';
                }
                break;
              }
              if(actionFlag) {
                const apiFormData = new FormData();
                apiFormData.append('apiKey', Constant.ApiKey);
                apiFormData.append('domainId', this.domainId);
                apiFormData.append('countryId', this.countryId);
                apiFormData.append('userId', this.userId);
                apiFormData.append('threadId', this.threadId);
                apiFormData.append('postId', postId);
                apiFormData.append('ismain','0');
                apiFormData.append('status', actionStatus);
                apiFormData.append('type', type);
                apiFormData.append('parentPostId', ppId);
                apiFormData.append('platform', this.accessPlatForm);
                this.threadPostService.addLikePinOnePlus(apiFormData).subscribe((response) => {
                  if(response.status != 'Success') {
                    switch(type) {
                      case 'like':
                      this.postData[i].nestedReplies[j].likeStatus = status;
                      this.postData[i].nestedReplies[j].likeStatus = this.postData[i].nestedReplies[j].likeStatus;
                      this.postData[this.imageFlag].nestedReplies[j].likeImg = (this.postData[i].nestedReplies[j].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                      this.postData[i].nestedReplies[j].likeCount = (status == 0) ? this.postData[i].nestedReplies[j].likeCount-1 : this.postData[i].nestedReplies[j].likeCount+1;
                      this.postData[i].nestedReplies[j].likeCount = this.postData[i].nestedReplies[j].likeCount;
                      this.postData[i].nestedReplies[j].likeCountVal = this.postData[i].nestedReplies[j].likeCount == 0 ? '-' : this.postData[i].nestedReplies[j].likeCount;
                      if(this.postData[i].nestedReplies[j].likeCount == 0){
                        this.postData[i].nestedReplies[j].likeCountValText = '';
                      }
                      else if(this.postData[i].nestedReplies[j].likeCount == 1){
                        this.postData[i].nestedReplies[j].likeCountValText = 'Like';
                      }
                      else{
                        this.postData[i].nestedReplies[j].likeCountValText = 'Likes';
                      }
                      break;
                    }
                  }
                  else{
                    this.postFixRefresh = true;
                    //this.getThreadInfo('refresh',0);
                    // PUSH API
                    let apiData = new FormData();
                    apiData.append('apiKey', Constant.ApiKey);
                    apiData.append('domainId', this.domainId);
                    apiData.append('countryId', this.countryId);
                    apiData.append('userId', this.userId);
                    apiData.append('threadId', this.threadId);
                    apiData.append('silentPush', '1');
                    apiData.append('action', 'reply-like');
                    apiData.append('parentPostId', ppId);
                    apiData.append('commentId', ppId);
                    apiData.append('replyId', postId);
                    if(actionStatus == 'disliked'){}
                    else{
                    this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
                    }
                    let apiDatasocial = new FormData();
                    apiDatasocial.append('apiKey', Constant.ApiKey);
                    apiDatasocial.append('domainId', this.domainId);
                    apiDatasocial.append('threadId', this.threadId);
                    apiDatasocial.append('postId', postId);
                    apiDatasocial.append('commentId', ppId);
                    apiDatasocial.append('replyId', postId);
                    apiDatasocial.append('userId', this.userId);
                    apiDatasocial.append('action', type);
                    this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                    // PUSH API

                    let data = {
                      type1: 'replyedit',
                      type2: 'edit',
                      type3: 'edit-old',
                      postId: postId,
                      parentPostId: this.parentPostId,
                      threadId: this.threadId
                    }
                    this.commonApi.emitThreadDetailReplyUpdate(data);
                  }
                });
              }
            }
          }
        }
      }
    }
    else{
      for (let i in this.postData) {
        if(this.postData[i].postId == postId){
          console.log(type,status,postId);
          let actionStatus = '';
          let actionFlag = true;
          let likeCount = this.postData[i].likeCount;
          switch(type) {
            case 'like':
            actionFlag = (this.postData[i].likeLoading) ? false : true;
            actionStatus = (status == 0) ? 'liked' : 'disliked';
            this.postData[i].likeStatus = (status == 0) ? 1 : 0;
            this.postData[i].likeStatus = this.postData[i].likeStatus;
            this.postData[i].likeImg = (this.postData[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
            this.postData[i].likeCount = (status == 0) ? likeCount+1 : likeCount-1;
            this.postData[i].likeCount = this.postData[i].likeCount;
            this.postData[i].likeCountVal = this.postData[i].likeCount == 0 ? '-' : this.postData[i].likeCount;
            if(this.postData[i].likeCount == 0){
              this.postData[i].likeCountValText = '';
            }
            else if(this.postData[i].likeCount == 1){
              this.postData[i].likeCountValText = 'Like';
            }
            else{
              this.postData[i].likeCountValText = 'Likes';
            }
            break;
          }
          if(actionFlag) {
            const apiFormData = new FormData();
            apiFormData.append('apiKey', Constant.ApiKey);
            apiFormData.append('domainId', this.domainId);
            apiFormData.append('countryId', this.countryId);
            apiFormData.append('userId', this.userId);
            apiFormData.append('threadId', this.threadId);
            apiFormData.append('postId', this.postData[i].postId);
            apiFormData.append('ismain','0');
            apiFormData.append('status', actionStatus);
            apiFormData.append('type', type);
            apiFormData.append('platform', this.accessPlatForm);
            this.threadPostService.addLikePinOnePlus(apiFormData).subscribe((response) => {
              if(response.status != 'Success') {
                switch(type) {
                  case 'like':
                  this.postData[i].likeStatus = status;
                  this.postData[i].likeStatus = this.postData[i].likeStatus;
                  this.postData[this.imageFlag].likeImg = (this.postData[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                  this.postData[i].likeCount = (status == 0) ? this.postData[i].likeCount-1 : this.postData[i].likeCount+1;
                  this.postData[i].likeCount = this.postData[i].likeCount;
                  this.postData[i].likeCountVal = this.postData[i].likeCount == 0 ? '-' : this.postData[i].likeCount;
                  if(this.postData[i].likeCount == 0){
                    this.postData[i].likeCountValText = '';
                  }
                  else if(this.postData[i].likeCount == 1){
                    this.postData[i].likeCountValText = 'Like';
                  }
                  else{
                    this.postData[i].likeCountValText = 'Likes';
                  }
                  break;
                }
              }
              else{
                this.postFixRefresh = true;
                //this.getThreadInfo('refresh',0);
                // PUSH API
                let apiData = new FormData();
                apiData.append('apiKey', Constant.ApiKey);
                apiData.append('domainId', this.domainId);
                apiData.append('countryId', this.countryId);
                apiData.append('userId', this.userId);
                apiData.append('threadId', this.threadId);
                apiData.append('silentPush', '1');
                apiData.append('action', 'comment-like');
                apiData.append('commentId', postId);
                if(actionStatus == 'disliked'){}
                else{
                this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
                }
                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('postId', postId);
                apiDatasocial.append('commentId', postId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('action', type);
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                // PUSH API

                let data = {
                  type1: '',
                  type2: 'edit',
                  type3: 'edit-old',
                  postId: postId,
                  threadId: this.threadId,
                  parentPostId: postId,
                }
                this.commonApi.emitThreadDetailReplyUpdate(data);

              }
            });
          }
        }
      }
    }
  }

      // hide status fix tooltip
  changeTooltip(postId){
    for (let i in this.postData) {
      if(this.postData[i].postId == postId){
        this.postData[i].postStFlag = false;
      }
    }
  }

  // set solution status api
  setSolutionStatus(postStatus,postId,currentStatus,type='',ppId=''){
    console.log(postStatus,postId,currentStatus,type,ppId);
    if(currentStatus != postStatus){

      this.postServerErrorMsg = '';
      this.postServerError = true;

      const apiFormData = new FormData();

      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('postId', postId);
      apiFormData.append('postStatus', postStatus);
      if(type == 'nested-reply'){
        apiFormData.append('parentPostId', ppId);
      }
      apiFormData.append('platform', this.accessPlatForm);
      this.threadPostService.solutionStatusAPI(apiFormData).subscribe(res => {
          if(res.status=='Success'){
            // PUSH API
            let apiData = new FormData();
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);
            apiData.append('threadId', this.threadId);
            apiData.append('silentPush', '1');

            if(type == 'nested-reply'){
              apiData.append('action', 'reply-poststatus');
              apiData.append('commentId', ppId);
              apiData.append('replyId', postId);
            }
            else{
              apiData.append('action', 'comment-poststatus');
              apiData.append('commentId', postId);
            }

            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('userId', this.userId);
            if(type == 'nested-reply'){
              apiDatasocial.append('action', 'replyCount');
              apiDatasocial.append('commentId', ppId);
              apiDatasocial.append('replyId', postId);
            }
            else{
              apiDatasocial.append('action', 'replyCount');
              apiDatasocial.append('commentId', postId);
            }
            let platformIdInfo = localStorage.getItem('platformId');

            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

            // PUSH API
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = res.result;
              setTimeout(() => {
                if(type == 'nested-reply'){
                  let itemIndex2 = this.postData[0].commentNestedReplies.findIndex(item => item.postId == postId);
                  this.postData[0].commentNestedReplies[itemIndex2].replyPostStatus = postStatus;
                  let data = {
                    type1: 'replyedit',
                    type2: 'edit',
                    type3: 'edit-old',
                    postId: postId,
                    parentPostId: this.parentPostId,
                    threadId: this.threadId
                  }
                  this.commonApi.emitThreadDetailReplyUpdate(data);
                }
                else{
                  for (let i in this.postData) {
                    if(this.postData[i].postId == postId){
                      this.postData[i].commentPostStatus = postStatus;
                    }
                  }
                  let data = {
                    type1: '',
                    type2: 'edit',
                    type3: 'edit-old',
                    postId: postId,
                    threadId: this.threadId,
                    parentPostId: postId,
                  }
                  this.commonApi.emitThreadDetailReplyUpdate(data);
                }
                this.postFixRefresh = true;
                //this.getThreadInfo('refresh',0);
                msgModalRef.dismiss('Cross click');
              }, 1500);
           }else{
            this.postLoading = false;
            this.postServerErrorMsg = res.result;
            this.postServerError = true;
          }
        },
        (error => {
          this.postLoading = false;
          this.postServerErrorMsg = error;
          this.postServerError  = true;
        })
      );
    }
   }

   // set post type
   setPostType(postType,postStatus,postId,action,ppId=''){
    if(action=='nested-reply'){
      if(this.apiUrl.enableAccessLevel){
        if(this.userId == this.threadUserId){
          this.authenticationService.checkAccessVal = true;
          this.newReplyPost(postType,postStatus,'No',postId);
        }
        else{
          this.authenticationService.checkAccess(2,'Reply',true,true);
          setTimeout(() => {
            if(this.authenticationService.checkAccessVal){
              this.newReplyPost(postType,postStatus,'No',postId);
            }
            else if(!this.authenticationService.checkAccessVal){
              // no access
            }
            else{
              this.newReplyPost(postType,postStatus,'No',postId);
            }
          }, 550);
        }
       }
       else{
        this.newReplyPost(postType,postStatus,'No',postId);
       }
    }
    else{
      this.editPost(postType,postStatus,'No',postId,action,ppId);
    }
  }

    // posted new reply
    newReplyPost(postType,postStatus,closeStatus,postId){
      this.removeHilightColor();
      console.log(postType,postStatus,closeStatus,postId);
      let autoGeneratedIdOpt=Math.floor(100000 + Math.random() * 900000);
      if(postStatus != 0){
        this.newPostFixFlag = true;
      }
      this.replyPostOnFlag1 = false;
      this.replyPostOnFlag2 = false;
      this.replyPostOnFlag3 = false;
      this.uploadCommentFlag = false;
      this.uploadReplyFlag = false;
      this.tagReplyFlag = false;
      this.tagCommentFlag = false;
      //this.parentPostId = postId;
      this.postServerErrorMsg = '';
      this.postServerError = false;
      this.postReplyButtonEnable = false;
      this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
      this.apiUrl.postReplyButtonEnable = this.postReplyButtonEnable;
      const apiFormData = new FormData();
      this.imageFlag = 'true';

      let replyText = '';
    if(this.enterKeyPressFlag){
      const exp = /<p[^>]*>(&nbsp;|\s+|<br\s*\/?>)*<\/p>/g;
      this.postReplyDesc=this.postReplyDesc.replace(exp, '');
      replyText = this.postReplyDesc;
      this.postReplyDesc = '';
      this.enterKeyPressFlag = false;
    }
    else{
      replyText = this.postReplyDesc;
      this.postReplyDesc = '';
    }

      if(this.uploadedItems != '') {
        if(this.uploadedItems.items.length>0){
          for(let a in (this.uploadedItems.items)) {
            if(this.uploadedItems.items[a].flagId == 6) {
              this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
              if(this.uploadedItems.items[a].url=='') {
                this.postReplyButtonEnable = true;
                this.apiUrl.postReplyButtonEnable = this.postReplyButtonEnable;
                return false;
              }
              else{
                this.postReplyServerErrorMsg = '';
                this.postReplyServerError = false;
              }
            }
          }
        }
      }
      let replyTaggedUsers='';
      this.replyTaggedUsers = [];
      let techSubmmitVal = (this.techSubmmitFlag) ? '1' : '0';
      console.log( this.replyAssignedUsersList);
      if(this.replyAssignedUsersList)
      {
        if(this.replyAssignedUsersList.length>0)
        {
          for(let au in this.replyAssignedUsersList)
          {

            this.replyTaggedUsers.push(this.replyAssignedUsersList[au].email);

          }
          replyTaggedUsers=JSON.stringify(this.replyTaggedUsers);
        }

      }

      let uploadCount = 0;
      if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
        this.uploadedItems.attachments.forEach(item => {
          console.log(item)
          if(item.accessType == 'media') {
            this.mediaUploadItems.push({fileId: item.fileId.toString()});
            autoGeneratedIdOpt=0;
          } else {
            uploadCount++;
          }
        });
      }
      else
      {
        let replyContent=[];
        let lastPostid=0;

        replyContent.push({
          postId:0,
          autoGeneratedId:autoGeneratedIdOpt,
          threadId:this.threadId,
          userName:this.loginUsername,
          userId:this.userId,
          replyProfileImage:this.loginUserProfileImg,
          profileImage:this.loginUserProfileImg,
          replyUserName:this.loginUsername,
          replyUserId:this.userId,
          deleteFlag:0,
          postedFrom:'Web',
          userRoleTitle:this.userRoleTitle,
          createdOnNew:new Date().toISOString().slice(0, 10)+' 00:00:00',
          uploadContents:[],
          contentWeb:replyText,
          content:replyText,
          editHistory:[],
          replyPostStatus:postStatus,
          postStatus:postStatus,
          replyPostType:postType,
          postType:postType,
          owner:this.userId,
        });
        this.updateDynamicData('replynew', 'new' , lastPostid, replyContent);
      }

      console.log( this.replyTaggedUsers);
      /*this.bodyElem.classList.add(this.bodyClass2);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );*/
      /*if(this.enterKeyPressFlag){
        const exp = /<p[^>]*>(&nbsp;|\s+|<br\s*\/?>)*<\/p>/g;
        this.postReplyDesc=this.postReplyDesc.replace(exp, '');
        this.enterKeyPressFlag = false;
      }*/
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('parentPostId', this.parentPostId);
      apiFormData.append('description', replyText);
      apiFormData.append('postType', postType);
      apiFormData.append('postStatus', postStatus);
      apiFormData.append('closeStatus', closeStatus);
      apiFormData.append('imageFlag', this.imageFlag);
      apiFormData.append('summitFix', techSubmmitVal);
      apiFormData.append('taggedUsers', replyTaggedUsers);
      apiFormData.append('autoGeneratedId', autoGeneratedIdOpt.toString());
      apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
      apiFormData.append('platform', this.accessPlatForm);
      this.threadPostService.newReplyPost(apiFormData).subscribe(res => {
       // modalRef.dismiss("Cross click");
        //this.bodyElem.classList.remove(this.bodyClass2);
          if(res.status=='Success'){
            this.commentUploadedItemsFlag = false;
            this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
            this.replyAssignedUsersList=[];
            this.replyAssignedUsersPopupResponse=false;
            this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;

            let lastPostid = res.data.postId;
            let replyContent = res.data.replyContent;
            /*if(res.escalationStatus)
            {
              this.threadViewData.escalateStatus=(res.escalationStatus.escalateStatus) ? (res.escalationStatus.escalateStatus) : '';
            }*/


            apiFormData.append('threadId', this.threadId);
            apiFormData.append('parentPostId', this.parentPostId)
            apiFormData.append('postId', lastPostid);

            if(uploadCount == 0) {
              this.uploadedItems = [];
              this.mediaUploadItems = [];
              this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
              this.nestedPostApiData['attachments'] = this.uploadedItems;
              this.nestedPostUpload = false;
              setTimeout(() => {
                this.postUploadActionTrue = true;
                this.nestedPostUpload = true;
                setTimeout(() => {
                  this.postUploadActionTrue = false;
                }, 100);
              }, 100);
            }

            if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
              this.nestedPostApiData['uploadedItems'] = this.uploadedItems.items;
              this.nestedPostApiData['attachments'] = this.uploadedItems.attachments;
              this.nestedPostApiData['nestedReply'] = "1";
              this.nestedPostApiData['viewpage'] = "0";
              this.nestedPostApiData['message'] = res.result;
              this.nestedPostApiData['threadId'] = this.threadId;
              this.nestedPostApiData['dataId'] = lastPostid;
              this.nestedPostApiData['replyId'] = lastPostid;
              this.nestedPostApiData['parentPostId'] = this.parentPostId;
              this.nestedPostApiData['commentId'] = this.parentPostId;
              this.nestedPostApiData['postId'] = this.parentPostId;
              this.nestedPostApiData['summitFix'] = techSubmmitVal;
              this.manageAction = 'uploading';
              this.nestedPostUpload = false;
              setTimeout(() => {
                this.postUploadActionTrue = true;
                this.nestedPostUpload = true;
              }, 100);
            }
            else{
                // PUSH API
                let apiData = new FormData();
                apiData.append('apiKey', Constant.ApiKey);
                apiData.append('domainId', this.domainId);
                apiData.append('countryId', this.countryId);
                apiData.append('userId', this.userId);
                apiData.append('threadId', this.threadId);
                apiData.append('replyId', lastPostid);
                apiData.append('postId', lastPostid);
                apiData.append('action', 'reply');
                apiData.append('parentPostId', this.parentPostId);
                if(!this.techSubmmitFlag){

                  this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
                  let apiDatasocial = new FormData();
                  apiDatasocial.append('apiKey', Constant.ApiKey);
                  apiDatasocial.append('domainId', this.domainId);
                  apiDatasocial.append('threadId', this.threadId);
                  apiDatasocial.append('postId', lastPostid);
                  apiDatasocial.append('userId', this.userId);
                  apiDatasocial.append('replyId', lastPostid);
                  apiDatasocial.append('commentId', this.parentPostId);
                  apiDatasocial.append('action', 'replyCount');
                  this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
                  let platformIdInfo = localStorage.getItem('platformId');
                  if(platformIdInfo=='3')
                  {
                    this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
                  }
                }
                // PUSH API
              //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              //msgModalRef.componentInstance.successMessage = res.result;
              let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
              //this.postData[itemIndex1].postReplyLoading = true;
              this.postData[itemIndex1].postNew = false;
              this.postFixRefresh = true;
              this.postUploadActionTrue = false;
              this.resetNestedReplyBox(1);
              //this.getThreadInfo('refresh',lastPostid,'replynew');
              this.updateDynamicData('replynew', 'new' , lastPostid, replyContent,autoGeneratedIdOpt);
              let data = {
                type1: 'replynew',
                type2: 'new',
                postId: lastPostid,
                content: replyContent,
                parentPostId: this.parentPostId,
                threadId: this.threadId
              }
              this.commonApi.emitThreadDetailReplyUpdate(data);

              //msgModalRef.dismiss('Cross click');
            }

          }
          else{
            //this.postReplyServerErrorMsg = res.result;
            //this.postServerError = true;
          }
        },
        (error => {
          //this.postServerErrorMsg = error;
          //this.postServerError  = true;
        })
      );
    }



    // edit post
 editPost(postType,postStatus,closeStatus,postId,action='',ppId=''){
  this.replyPostOnFlag1 = false;
  this.replyPostOnFlag2 = false;
  this.replyPostOnFlag3 = false;
  this.uploadCommentFlag = false;
  this.uploadReplyFlag = false;
  this.tagReplyFlag = false;
  this.tagCommentFlag = false;
  this.postSaveButtonEnable = false;
  this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
  this.postEditServerErrorMsg = '';
  this.posteditServerError = true;
  if(this.uploadedItems != '') {
    if(this.uploadedItems.items.length>0){
      for(let a in (this.uploadedItems.items)) {
        if(this.uploadedItems.items[a].flagId == 6) {
          this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
          if(this.uploadedItems.items[a].url=='') {
              this.postSaveButtonEnable = true;
              this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
              return false;
          }
          else{
            this.postEditServerErrorMsg = '';
            this.posteditServerError = false;
          }
        }
      }
    }
  }
  let uploadCount = 0;
  if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
    this.uploadedItems.attachments.forEach(item => {
      console.log(item)
      if(item.accessType == 'media') {
        this.mediaUploadItems.push({fileId: item.fileId.toString()});
      } else {
        uploadCount++;
      }
    });
  }
  console.log(uploadCount, this.uploadedItems);
  const apiFormData = new FormData();
  this.imageFlag = 'true';
  console.log( this.postEditDesc);
  console.log(this.mediaUploadItems, this.deletedFileIds, this.removeFileIds);
  let techSubmmitVal = (this.techSubmmitFlag) ? '1' : '0';
  this.bodyElem.classList.add(this.bodyClass2);
  const modalRef = this.modalService.open(
    SubmitLoaderComponent,
    this.modalConfig
  );
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('threadId', this.threadId);
  apiFormData.append('description', this.postEditDesc);
  apiFormData.append('postType', postType);
  apiFormData.append('postStatus', postStatus);
  apiFormData.append('closeStatus', closeStatus);
  apiFormData.append('imageFlag', this.imageFlag);
  apiFormData.append('postId', postId);

  if(action  == 'nested-reply-edit'){
    this.parentPostId = ppId;
    apiFormData.append('parentPostId', ppId);
  }
  apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
  apiFormData.append('deleteMediaId', JSON.stringify(this.deletedFileIds));
  apiFormData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
  apiFormData.append('deletedFileIds',  JSON.stringify(this.deletedFileIds));
  apiFormData.append('removeFileIds',  JSON.stringify(this.removeFileIds));
  apiFormData.append('summitFix', techSubmmitVal);
  apiFormData.append('platform', this.accessPlatForm);
   console.log(this.deletedFileIds);
   //return false;
  this.threadPostService.updateReplyPost(apiFormData).subscribe(res => {
    modalRef.dismiss("Cross click");
    this.bodyElem.classList.remove(this.bodyClass2);
      let msgFlag = true;
      if(res.status=='Success'){
        if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
          this.editPostUpload = false;
          this.postEditApiData['uploadedItems'] = this.uploadedItems.items;
          this.postEditApiData['attachments'] = this.uploadedItems.attachments;
          if(action  == 'nested-reply-edit'){
            this.postEditApiData['nestedReply'] = "1";
            this.postEditApiData['viewpage'] = "0";
            this.postEditApiData['parentPostId'] = ppId;
            this.postEditApiData['replyId'] = ppId;
          }
          else{
            this.postEditApiData['nestedReply'] = "0";
            this.postEditApiData['viewpage'] = "0";
          }
          this.postEditApiData['message'] = res.result;
          this.postEditApiData['dataId'] = postId;
          this.postEditApiData['commentId'] = postId;
          this.postEditApiData['threadId'] = this.threadId;
          this.postEditApiData['summitFix'] = techSubmmitVal;
          this.manageAction = 'uploading';
          this.postEditApiData['threadAction'] = 'edit';
          setTimeout(() => {
            this.editPostUpload = true;
          }, 100);
        }
        else{
           // PUSH API

             let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('postId', postId);
            if(action  == 'nested-reply-edit'){
              apiDatasocial.append('commentId', this.parentPostId);
              apiDatasocial.append('replyId', postId);
            }
            else

          {
            apiDatasocial.append('commentId', postId);
          }

            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('action', 'replyCount');
            let platformIdInfo = localStorage.getItem('platformId');

            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            let apiData = new FormData();
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);
            apiData.append('threadId', this.threadId);
            apiData.append('silentPush', '1');
            if(action  == 'nested-reply-edit'){
             apiData.append('commentId', this.parentPostId);
             apiData.append('replyId', postId);
             apiData.append('action', 'reply-edit');
           }
           else{
             apiData.append('commentId', postId);
             apiData.append('action', 'comment-edit');
           }
           if(!this.techSubmmitFlag){this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });}
           // PUSH API
          //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          //msgModalRef.componentInstance.successMessage = res.result;
          //setTimeout(() => {
            if(action  == 'nested-reply-edit'){
              this.resetNestedReplyBox();
              let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
              let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == postId);
              this.postData[itemIndex1].nestedReplies[itemIndex2].postReplyLoading = true;

              this.postData[itemIndex1].nestedReplies[itemIndex2].postView = true;
              this.postFixRefresh = true;
              this.getPostUpdateListOld(postId,'edit','replyedit');
              let data = {
                type1: 'replyedit',
                type2: 'edit',
                type3: 'edit-old',
                postId: postId,
                parentPostId: this.parentPostId,
                threadId: this.threadId
              }
              this.commonApi.emitThreadDetailReplyUpdate(data);
              //this.getThreadInfo('edit',postId,'replyedit');
            }
            else{
              this.resetEditReplyBox();
              let itemIndex = this.postData.findIndex(item => item.postId == postId);
              this.postData[itemIndex].postView = true;
              this.postData[itemIndex].postLoading = true;

              this.postFixRefresh = true;
              //this.getThreadInfo('edit',postId);
              this.getPostUpdateListOld(postId,'edit');
              let data = {
                type1: '',
                type2: 'edit',
                type3: 'edit-old',
                postId: postId,
                threadId: this.threadId
              }
              this.commonApi.emitThreadDetailReplyUpdate(data);
            }
            //msgModalRef.dismiss('Cross click');
          //}, 1500);
        }
        this.postSaveButtonEnable = true;
        this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
      }
      else{
        this.postLoading = false;
        this.postSaveButtonEnable = true;
        this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
        this.postData[this.currentPostDataIndex].postLoading = false;
        this.postEditServerErrorMsg = res.result;
        this.posteditServerError = true;
      }
    },
    (error => {
      this.postLoading = false;
      this.postSaveButtonEnable = true;
      this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
      this.postData[this.currentPostDataIndex].postLoading = false;
      this.postEditServerErrorMsg = error;
      this.posteditServerError  = true;
    })
  );
}

updatePostIdInfo(autoGeneratedIdOpt,postData)
{

console.log(postData);

if(this.postData)
   {
     for (let i in this.postData) {


       if(this.postData[i].autoGeneratedId==autoGeneratedIdOpt)
       {
        this.postData[i].postId=this.parentPostId;
        // this.postData[i].commentPostId=postData.postId;
        // this.postData[i].postId=postData.postId;
       }
      // this.postData[i].newComment=false;

         for (let j in this.postData[i].commentNestedReplies) {
          console.log(this.postData[i].commentNestedReplies[j].autoGeneratedId+'--'+autoGeneratedIdOpt+'--'+postData.postId);
          if(this.postData[i].commentNestedReplies[j].autoGeneratedId==autoGeneratedIdOpt)

       {
        this.postData[i].commentNestedReplies[j].replyPostId=postData.postId;
        this.postData[i].commentNestedReplies[j].replyId=postData.postId;
       this.postData[i].commentNestedReplies[j].postId=postData.postId;
        //this.postData[i].commentNestedReplies[j].editedWeb=postData.contentWeb;



        this.postData[i].commentNestedReplies[j].postNew = false;

        this.postData[i].commentNestedReplies[j].newReply = false;
        this.postData[i].commentNestedReplies[j].postView = true;
        this.postData[i].commentNestedReplies[j].postStFlag = true;
        this.postData[i].commentNestedReplies[j].postReplyLoading = false;

        let contentWeb1 = '';
        contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(postData.contentWeb));
        this.postData[i].commentNestedReplies[j].editedWeb = contentWeb1;
        this.postData[i].commentNestedReplies[j].replyId = postData.postId;
        this.postData[i].commentNestedReplies[j].replyThreadId = postData.threadId;
        this.postData[i].commentNestedReplies[j].replyProfileImage = postData.profileImage;
        this.postData[i].commentNestedReplies[j].replyUserName = postData.userName;
        this.postData[i].commentNestedReplies[j].replyUserId = postData.userId;
        this.postData[i].commentNestedReplies[j].replyPostStatus = postData.postStatus;
        this.postData[i].commentNestedReplies[j].replyPostType = postData.postType;

        this.postData[i].commentNestedReplies[j].userRoleTitle = postData.userRoleTitle !='' && postData.userRoleTitle != undefined ? postData.userRoleTitle : 'No Title';
        let createdOnNew = postData.createdOnNew;
        let createdOnDate = moment.utc(createdOnNew).toDate();
        //this.postReplyListsNew[pr].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
        this.postData[i].commentNestedReplies[j].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
        this.postData[i].commentNestedReplies[j].likeLoading = false;
        this.postData[i].commentNestedReplies[j].likeCount = postData.likeCount;
        this.postData[i].commentNestedReplies[j].likeCountVal = postData.likeCount == 0 ? '-' : postData.likeCount;
        if(postData.likeCount == 0){
          this.postData[i].commentNestedReplies[j].likeCountValText = '';
        }
        else if(postData.likeCount == 1){
          this.postData[i].commentNestedReplies[j].likeCountValText = 'Like';
        }
        else{
          this.postData[i].commentNestedReplies[j].likeCountValText = 'Likes';
        }
        this.postData[i].commentNestedReplies[j].likeStatus = 0;
        if(this.postData[i].commentNestedReplies[j].replyLikedUsers != undefined){
          for(let a in this.postData[i].commentNestedReplies[j].replyLikedUsers) {
            if(this.postData[i].commentNestedReplies[j].replyLikedUsers[a] == this.userId) {
              this.postData[i].commentNestedReplies[j].likeStatus = 1;
            }
          }
        }
        //this.postData[i].commentNestedReplies[j].likeStatus = postData.likeStatus;
        this.postData[i].commentNestedReplies[j].likeImg = (this.postData[i].commentNestedReplies[j].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
        this.postData[i].commentNestedReplies[j].attachments = postData.uploadContents;
        this.postData[i].commentNestedReplies[j].attachmentLoading = (postData.uploadContents.length>0) ? false : true;
        this.postData[i].commentNestedReplies[j].action = 'view';
        this.postData[i].commentNestedReplies[j].threadOwnerLabel = false;
        if(this.postData[i].commentNestedReplies[j].owner  ==  this.threadUserId){
          this.postData[i].commentNestedReplies[j].threadOwnerLabel = true;
        }
        this.postData[i].commentNestedReplies[j].actionDisable = false;
        if(this.userId == postData.userId || postData.ownerAccess == 1){
          this.postData[i].commentNestedReplies[j].actionDisable = true;
        }
        // post edit delete action
        this.postData[i].commentNestedReplies[j].enableActionButton = true;
        /*this.postData[i].commentNestedReplies[j].editDeleteAction = false;
        if((this.userId == this.postData[i].commentNestedReplies[j].owner)){
          this.postData[i].commentNestedReplies[j].editDeleteAction = true;
        }*/

        this.postData[i].commentNestedReplies[j].editDeleteAction = false;
        if(this.userId == this.postData[i].commentNestedReplies[j].replyUserId){
          this.postData[i].commentNestedReplies[j].editDeleteAction = true;
        }
        this.postData[i].commentNestedReplies[j].replyEditAction = this.postData[i].commentNestedReplies[j].editDeleteAction ? true : this.accessLevel.edit;
        this.postData[i].commentNestedReplies[j].replyDeleteAction = this.postData[i].commentNestedReplies[j].editDeleteAction ? true : this.accessLevel.delete;
        if(this.subscriberAccess)
        {
          this.postData[i].editDeleteAction=false;
          this.postData[i].replyEditAction=false;
          this.postData[i].replyDeleteAction=false;
        }

        this.postData[i].commentNestedReplies[j].contentWebDuplicate = postData.contentWeb;
        //this.postReplyListsNew[pr].content = this.postReplyListsNew[pr].contentWeb;
        this.postData[i].commentNestedReplies[j].contentTranslate = postData.content;
        this.postData[i].commentNestedReplies[j].remindersData = postData.remindersData != '' && postData.remindersData != undefined && postData.remindersData != 'undefined' ? postData.remindersData : '';
        if(postData.remindersData != ''){
          let prdata = postData.remindersData;
          for (let pr in prdata) {
            let reminderdate1 = prdata[pr].createdOn;
            let reminderdate2 = moment.utc(reminderdate1).toDate();
            prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');
          }
        }






       }
           //this.postData[i].commentNestedReplies[j].replyPostId=false;
         }

     }
   }
 }

 updateDynamicData(type, ptype, pid, replyContent,autoGeneratedIdOpt=0){
  if(autoGeneratedIdOpt)
  {


  this.updatePostIdInfo(autoGeneratedIdOpt,replyContent[0]);
  }
  else
  {
  let postAttachments = [];
    if(type == 'replynew'){
      console.log(replyContent);
      this.postReplyListsNew = replyContent != undefined ? replyContent: [] ;
      this.postReplyDataLength = replyContent != undefined ? replyContent.length : 0;
      if(this.postReplyDataLength>0){
        console.log(this.postReplyListsNew);
        let postReplyAttachments = [];
        console.log(this.postReplyListsNew);
        for (let pr in this.postReplyListsNew) {
          if(this.translatelangId != ''){
            this.postReplyListsNew[pr].transText = "Translate to "+this.translatelangArray['name'];
            this.postReplyListsNew[pr].transId = this.translatelangId;
          }
          else{
            this.postReplyListsNew[pr].transText = "Translate";
            this.postReplyListsNew[pr].transId = this.translatelangId;
          }
          this.postReplyListsNew[pr].postNew = false;
          console.log(this.postReplyListsNew[pr].postNew) ;
          this.postReplyListsNew[pr].newReply = false;
          this.postReplyListsNew[pr].postView = true;
          this.postReplyListsNew[pr].postStFlag = true;
          this.postReplyListsNew[pr].postReplyLoading = false;

          this.postReplyListsNew[pr].replyId = this.postReplyListsNew[pr].postId;
          this.postReplyListsNew[pr].replyThreadId = this.postReplyListsNew[pr].threadId;
          this.postReplyListsNew[pr].replyProfileImage = this.postReplyListsNew[pr].profileImage;
          this.postReplyListsNew[pr].replyUserName = this.postReplyListsNew[pr].userName;
          this.postReplyListsNew[pr].replyUserId = this.postReplyListsNew[pr].userId;
          this.postReplyListsNew[pr].replyPostStatus = this.postReplyListsNew[pr].postStatus;
          this.postReplyListsNew[pr].replyPostType = this.postReplyListsNew[pr].postType;

          this.postReplyListsNew[pr].userRoleTitle = this.postReplyListsNew[pr].userRoleTitle !='' && this.postReplyListsNew[pr].userRoleTitle != undefined ? this.postReplyListsNew[pr].userRoleTitle : 'No Title';
          let createdOnNew = this.postReplyListsNew[pr].createdOnNew;
          let createdOnDate = moment.utc(createdOnNew).toDate();
          //this.postReplyListsNew[pr].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
          this.postReplyListsNew[pr].postCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
          this.postReplyListsNew[pr].likeLoading = false;
          this.postReplyListsNew[pr].likeCount = this.postReplyListsNew[pr].likeCount;
          this.postReplyListsNew[pr].likeCountVal = this.postReplyListsNew[pr].likeCount == 0 ? '-' : this.postReplyListsNew[pr].likeCount;
          if(this.postReplyListsNew[pr].likeCount == 0){
            this.postReplyListsNew[pr].likeCountValText = '';
          }
          else if(this.postReplyListsNew[pr].likeCount == 1){
            this.postReplyListsNew[pr].likeCountValText = 'Like';
          }
          else{
            this.postReplyListsNew[pr].likeCountValText = 'Likes';
          }
          this.postReplyListsNew[pr].editDeleteAction = false;
          if(this.userId == this.postReplyListsNew[pr].userId){
            this.postReplyListsNew[pr].editDeleteAction = true;
          }
          this.postReplyListsNew[pr].replyEditAction = this.postReplyListsNew[pr].editDeleteAction ? true : this.accessLevel.edit;
          this.postReplyListsNew[pr].replyDeleteAction = this.postReplyListsNew[pr].editDeleteAction ? true : this.accessLevel.delete;
          if(this.subscriberAccess)
          {
            this.postReplyListsNew[pr].editDeleteAction=false;
            this.postReplyListsNew[pr].replyEditAction=false;
            this.postReplyListsNew[pr].replyDeleteAction=false;
          }
          this.postReplyListsNew[pr].likeStatus = this.postReplyListsNew[pr].likeStatus;
          this.postReplyListsNew[pr].likeImg = (this.postReplyListsNew[pr].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
          this.postReplyListsNew[pr].attachments = this.postReplyListsNew[pr].uploadContents;
          this.postReplyListsNew[pr].attachmentLoading = (this.postReplyListsNew[pr].uploadContents.length>0) ? false : true;
          this.postReplyListsNew[pr].action = 'view';
          this.postReplyListsNew[pr].threadOwnerLabel = false;
          if( this.threadUserId  == this.postReplyListsNew[pr].userId){
            this.postReplyListsNew[pr].threadOwnerLabel = true;
          }
          this.postReplyListsNew[pr].actionDisable = false;
          if(this.userId == this.postReplyListsNew[pr].userId || this.postReplyListsNew[pr].ownerAccess == 1){
            this.postReplyListsNew[pr].actionDisable = true;
          }

          postReplyAttachments.push({
            id: this.postReplyListsNew[pr].postId,
            attachments: this.postReplyListsNew[pr].uploadContents
          });

          if(this.postReplyListsNew[pr].editHistory){
            let editdata = this.postReplyListsNew[pr].editHistory;
            for (let ed in editdata) {
              let editdate1 = editdata[ed].updatedOnNew;
              let editdate2 = moment.utc(editdate1).toDate();
              editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
            }
          }

          /*let contentWeb1 = '';
          contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postReplyListsNew[pr].contentWeb));
          this.postReplyListsNew[pr].editedWeb = contentWeb1;

          let contentWeb2 = contentWeb1;
          this.postReplyListsNew[pr].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));
          */
          this.postReplyListsNew[pr].contentWebDuplicate = this.postReplyListsNew[pr].contentWeb;
          //this.postReplyListsNew[pr].content = this.postReplyListsNew[pr].contentWeb;
          this.postReplyListsNew[pr].contentTranslate = this.postReplyListsNew[pr].content;
          this.postReplyListsNew[pr].remindersData = this.postReplyListsNew[pr].remindersData != '' && this.postReplyListsNew[pr].remindersData != undefined && this.postReplyListsNew[pr].remindersData != 'undefined' ? this.postReplyListsNew[pr].remindersData : '';
          if(this.postReplyListsNew[pr].remindersData != ''){
            let prdata = this.postReplyListsNew[pr].remindersData;
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
    }
    this.postData[0]['postNew'] = false;
    this.postData[0]['postReplyLoading'] = false;

    let itemIndex3 = this.postData[0].commentNestedReplies.findIndex(item => item.replyId == pid);
    if (itemIndex3 < 0) {
      this.postData[0]['commentNestedReplies'].push(this.postReplyListsNew[0]);
    }
    this.postData[0]['nestedReplies'] = this.postData[0]['commentNestedReplies'];
    let itemIndex2 = this.postData[0]['commentNestedReplies'].findIndex(item => item.postId == pid);

    /*setTimeout(() => {
      this.postData[0]['commentNestedReplies'][itemIndex2]['newReply']  = true;
    }, 10);
    setTimeout(() => {
      this.postData[0]['commentNestedReplies'][itemIndex2]['newReply']  = false;
    }, 850);*/
    setTimeout(() => {
      //this.postData[0]['commentNestedReplies'][itemIndex2]['enableActionButton'] = true;
      for (let j in this.postData[0].commentNestedReplies) {
        this.postData[0].commentNestedReplies[j].enableActionButton=true;
      }
    }, 2000);
    //this.moveScroll(1);
    let ht3 = this.top.nativeElement.scrollHeight;
       //$(".threadPostcomment").scrollTop(ht3);
       $(".threadReplyPostcomment").animate({ scrollTop: ht3 }, "medium");

    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));
    /*if(this.postFixRefresh){
      //setTimeout(() => {
      this.getPostFixList();
      //}, 1);
    }*/
  }
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
          let ht3 = ((this.top.nativeElement.scrollTop + ht1) - 388);
          console.log(ht1,ht3);
          setTimeout(() => {
            this.top.nativeElement.scrollTop = ht3;
          }, 100);
        }
      }
      else{
        let ht3 = ((this.top.nativeElement.scrollTop + ht1) - 388);
        console.log(ht1,ht3);
        setTimeout(() => {
          this.top.nativeElement.scrollTop = ht3;
        }, 100);
      }
    }

  }, 500);
}
  attachmentPopup(val = 0,type) {
    let postId = val;
    if(type=='new'){
      postId = 0;
    }
    console.log(this.uploadedItems);
    let fitem = [];
    this.postApiData = {
      action: 'new',
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      threadId: this.threadId,
      postId: postId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };

    if(this.uploadedItems != '') {
      if(this.uploadedItems.items.length>0){
        fitem = this.uploadedItems;
        this.postApiData['uploadedItems'] = this.uploadedItems.items;
        this.postApiData['attachments'] = this.uploadedItems.attachments;
      }
    }

    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {
      console.log(receivedService.uploadedItems);
      if(receivedService){
        this.uploadedItems = receivedService.uploadedItems;
        if(this.uploadedItems != '') {
          if(this.uploadedItems.items.length>0){
            this.commentUploadedItemsFlag = true;
            this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
          }
          else{
            this.commentUploadedItemsFlag = false;
            this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
          }
        }
        else{
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
        }
      }
      else{
        if(this.uploadedItems.items.length>0){
          this.commentUploadedItemsFlag = true;
          this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
        }
        else{
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
        }
      }
     // this.apiUrl.attachmentNewPOPUP = false;
      modalRef.dismiss('Cross click');

    });
  }

   // edit open
 cancelPostAction(postId, type = '', ppId = ''){
  if(type == 'nested-reply'){
     this.parentPostId = ppId;
     for (let i in this.postData) {
       if(this.postData[i].postId == ppId){
         for (let j in this.postData[i].nestedReplies) {
           this.postData[i].nestedReplies[j].postReplyLoading = false;
           this.postData[i].nestedReplies[j].attachmentItems = this.postData[i].nestedReplies[j].attachments;
           if(this.postData[i].nestedReplies[j].postId == postId){
             this.postData[i].nestedReplies[j].postView = true;
               //this.currentPostDataIndex = i;
           }
         }
       }
     }
     //this.getThreadInfo('edit',postId,'replyedit');
  }
  else{
   this.mediaUploadItems = [];
   this.currentPostDataIndex = 0;
   this.resetEditReplyBox();
   for (let i in this.postData) {
     this.postData[i].postView = true;
     this.postData[i].attachmentItems = this.postData[i].attachments;
     if(this.postData[i].postId == postId){
       //this.currentPostDataIndex = i;
     }
   }
   //this.postData[this.currentPostDataIndex].postLoading = true;
   //this.getThreadInfo('edit',postId);
 }
}


   // open new reply - nested reply
 nestedReply(postId){
  if(this.closeStatus == 0){
    this.openPost(postId);
  }
 }
 openPost(postId){
  if(this.replyPostOnFlag1 && this.replyPostOnFlag2  && !this.replyPostOnFlag3 && postId>0){
    for (let i in this.postData) {
      if(this.postData[i].postId == postId){
        this.postData[i].postNew = true;
      }
      else{
        this.postData[i].postNew = false;
      }
    }
    this.replyPostOnFlag1 = true;
    this.replyPostOnFlag2 = true;
    this.replyPostOnFlag3 = false;
    setTimeout(() => {
      this.top.nativeElement.scrollTop = this.top.nativeElement.scrollTop;
    }, 10);
    setTimeout(() => {
      this.quill = this.postReplyEditor.getQuill();
      this.quill.focus();
    }, 100);
    if(this.uploadedItems != '') {
      this.uploadedItems  = [];
      this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
      this.nestedPostApiData['attachments'] = this.uploadedItems;
      this.nestedPostUpload = false;
      setTimeout(() => {
        this.nestedPostUpload = true;
      }, 100);
    }
  }
  /*else if(this.replyPostOnFlag1 && this.replyPostOnFlag2 && !this.replyPostOnFlag3 && postId==0){
    for (let i in this.postData) {
      this.postData[i].postNew = false;
    }
    this.resetNestedReplyBox();
    this.quill = this.postNewEditor.getQuill();
    this.quill.focus();
    this.replyPostOnFlag1 = false;
    this.replyPostOnFlag2 = false;
    this.replyPostOnFlag3 = true;
    let ht = this.top.nativeElement.scrollHeight - 488;
    setTimeout(() => {
      this.top.nativeElement.scrollTop = ht;
    }, 1000);
  }*/
  else{
   if(this.replyPostOnFlag1 && this.replyPostOnFlag2 && !this.replyPostOnFlag3 && postId==0){
      let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
      let uname = this.postData[itemIndex1].userName;
      const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.access = 'nestedReplyAction';
      modalRef.componentInstance.title = uname;
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        if(receivedService){
          for (let i in this.postData) {
            this.postData[i].postNew = false;
          }
          this.resetNestedReplyBox();
          this.quill = this.postNewEditor.getQuill();
          this.quill.focus();
          this.replyPostOnFlag1 = false;
          this.replyPostOnFlag2 = false;
          this.replyPostOnFlag3 = true;
          setTimeout(() => {
            this.top.nativeElement.scrollTop = this.top.nativeElement.scrollHeight-988;
          }, 1000);
          modalRef.dismiss('Cross click');
        }
        else{
          this.replyPostOnFlag1 = true;
          this.replyPostOnFlag2 = true;
          this.replyPostOnFlag3 = false;
          this.resetReplyBox();
          setTimeout(() => {
            this.quill = this.postReplyEditor.getQuill();
            this.quill.focus();
          }, 100);
          modalRef.dismiss('Cross click');
        }
      });
    }
    else if(!this.replyPostOnFlag1 && this.replyPostOnFlag3){
      const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.access = 'commentAction';
      modalRef.componentInstance.title = '';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        if(receivedService){
          this.resetReplyBox();
          this.replyPostOnFlag1 = true;
          this.replyPostOnFlag2 = false;
          this.replyPostOnFlag3 = false;
          this.parentPostId = postId;
          for (let i in this.postData) {
            this.postData[i].postNew = false;
            if(this.postData[i].postId == postId){
              this.postData[i].postNew = true;
            }
          }
          modalRef.dismiss('Cross click');
        }
        else{
          this.replyPostOnFlag1 = false;
          this.replyPostOnFlag2 = false;
          this.replyPostOnFlag3 = true;
          this.resetNestedReplyBox();
          this.quill = this.postNewEditor.getQuill();
          this.quill.focus();
          setTimeout(() => {
            this.top.nativeElement.scrollTop = this.top.nativeElement.scrollHeight-988;
          }, 1000);
          modalRef.dismiss('Cross click');
        }
      });
    }
    else{
      this.resetReplyBox();
      this.replyPostOnFlag1 = true;
      this.replyPostOnFlag2 = false;
      this.replyPostOnFlag3 = false;
      this.uploadCommentFlag = false;
      this.uploadReplyFlag = false;
      this.tagReplyFlag = false;
      this.tagCommentFlag = false;
      this.parentPostId = postId;
      for (let i in this.postData) {
        this.postData[i].postNew = false;
        if(this.postData[i].postId == postId){
          this.postData[i].postNew = true;
        }
      }
    }
  }
 }
// cancel
cancelNestedReply(postId){
  this.replyPostOnFlag1 = false;
  this.replyPostOnFlag2 = false;
  this.replyPostOnFlag3 = false;
  for (let i in this.postData) {
    this.postData[i].postNew = false;
  }
  this.resetNestedReplyBox();
}



    //close thread confirm
    closeThreadConfirm(){
      if(this.escalationStatusView){
        const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
        modalRef.componentInstance.access = 'escalationAction';
        modalRef.componentInstance.title = this.headerTitle;
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');

        });
      }
      else
      {


      if(this.techSubmmitFlag){
        //this.techSummitScore();
      }
      else{
        if(this.isDealerAccess==1)
        {
          this.visibledealerClosePopup=true;
        }
        else
        {

          if(this.apiUrl.enableAccessLevel){
            this.authenticationService.checkAccess(2,'Close',true,true);
             setTimeout(() => {
               if(this.authenticationService.checkAccessVal){
                const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
                modalRef.componentInstance.access = 'ThreadClose';
                modalRef.componentInstance.title = this.headerTitle;
                modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
                  modalRef.dismiss('Cross click');
                  console.log(receivedService);
                  if(receivedService){
                    //this.closeThread();
                  }
                });
               }
               else if(!this.authenticationService.checkAccessVal){
                 // no access
               }
               else{
                 const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
                modalRef.componentInstance.access = 'ThreadClose';
                modalRef.componentInstance.title = this.headerTitle;
                modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
                  modalRef.dismiss('Cross click');
                  console.log(receivedService);
                  if(receivedService){
                    //this.closeThread();
                  }
                });
               }
             }, 550);
            }
            else{
              const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
                modalRef.componentInstance.access = 'ThreadClose';
                modalRef.componentInstance.title = this.headerTitle;
                modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
                  modalRef.dismiss('Cross click');
                  console.log(receivedService);
                  if(receivedService){
                    //this.closeThread();
                  }
                });
            }

        }



      }
    }

    }

    editPostAction(postId, replyType='', ppId='',uid=''){
      if(this.apiUrl.enableAccessLevel){
        if(this.userId == uid){
          this.authenticationService.checkAccessVal = true;
          this.editPostActionCall(postId, replyType, ppId);
        }
        else{
          this.authenticationService.checkAccess(2,'Edit',true,true);

          setTimeout(() => {
            if(this.authenticationService.checkAccessVal){
              this.editPostActionCall(postId, replyType, ppId);
            }
            else if(!this.authenticationService.checkAccessVal){
              // no access
            }
            else{
              this.editPostActionCall(postId, replyType, ppId);
            }
          }, 550);
        }
      }
      else{
        this.editPostActionCall(postId, replyType, ppId);
      }
    }

     // edit open
     editPostActionCall(postId, replyType, ppId) {
  console.log(this.postData);
  if(replyType == 'nested-reply'){
    for (let i in this.postData) {
      if(this.postData[i].postId == ppId){
        this.parentPostId = ppId;
        for (let j in this.postData[i].nestedReplies) {
          this.postData[i].nestedReplies[j].postView = true;
          if(this.postData[i].nestedReplies[j].postId == postId){
            this.mediaUploadItems = [];
            this.currentPostDataIndex = j;
            this.postData[i].nestedReplies[j].postView = false;
            this.posteditServerError = false;
            this.postEditServerErrorMsg = "";

            this.postEditDesc =  this.postData[i].nestedReplies[j].editedWeb;
            console.log( this.postEditDesc);

            this.postSaveButtonEnable = true;
            this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
            this.postData[i].nestedReplies[j].EditAttachmentAction = 'attachments';
            console.log(this.postData[i].nestedReplies[j].uploadContents);
            console.log(this.postData[i].nestedReplies[j].replyUploadContents);
            if(this.postData[i].nestedReplies[j].uploadContents == undefined){
              this.postData[i].nestedReplies[j].attachments = this.postData[i].nestedReplies[j].replyUploadContents;
              this.postData[i].nestedReplies[j].attachmentItems  = this.postData[i].nestedReplies[j].replyUploadContents;
            }
            else{
              this.postData[i].nestedReplies[j].attachments = this.postData[i].nestedReplies[j].uploadContents;
              this.postData[i].nestedReplies[j].attachmentItems  = this.postData[i].nestedReplies[j].uploadContents;
            }
            for(let a of this.postData[i].nestedReplies[j].attachmentItems) {
              a.captionFlag = (a.fileCaption != '') ? false : true;
              if(a.flagId == 6) {
                a.url = a.filePath;
                a.linkFlag = false;
                a.valid = true;
              }
            }
          }
        }
      }
    }
  }
  else{
    console.log(this.postData);
    for (let i in this.postData) {
      this.postData[i].postView = true;
      if(this.postData[i].postId == postId){
        this.mediaUploadItems = [];
        this.currentPostDataIndex = i;
        this.postData[i].postView = false;
        this.posteditServerError = false;
        this.postEditServerErrorMsg = "";

        this.postEditDesc =  this.postData[i].editedWeb;
        console.log( this.postEditDesc);

        this.postSaveButtonEnable = true;
        this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
        this.postData[i].EditAttachmentAction = 'attachments';
        this.postData[i].attachmentItems = [];
        console.log(this.postData[i].uploadContents);
        console.log(this.postData[i].commentUploadContents);
        if(this.postData[i].uploadContents == undefined){
          this.postData[i].attachments = this.postData[i].commentUploadContents;
          this.postData[i].attachmentItems  = this.postData[i].commentUploadContents;
        }
        else{
          this.postData[i].attachments = this.postData[i].uploadContents;
          this.postData[i].attachmentItems  = this.postData[i].uploadContents;
        }
        for(let a of this.postData[i].attachmentItems) {
          a.captionFlag = (a.fileCaption != '') ? false : true;
          if(a.flagId == 6) {
            a.url = a.filePath;
            a.linkFlag = false;
            a.valid = true;
          }
        }
      }
    }
  }
 }

  // post delete confirm
  postDeleteConfirm(pid, replyType='', ppId='',uid='')
  {
   if(this.apiUrl.enableAccessLevel){
    if(this.userId == uid){
      this.postDeleteConfirmCall(pid, replyType, ppId);
    }
    else{
      this.authenticationService.checkAccess(2,'Delete',true,true);
     setTimeout(() => {
       if(this.authenticationService.checkAccessVal){
        this.postDeleteConfirmCall(pid, replyType, ppId);
       }
       else if(!this.authenticationService.checkAccessVal){
         // no access
       }
       else{
        this.postDeleteConfirmCall(pid, replyType, ppId);
       }
     }, 550);
    }
    }
    else{
      this.postDeleteConfirmCall(pid, replyType, ppId);
    }
  }

  postDeleteConfirmCall(pid, replyType, ppId){
    if(pid>0){
      let title = "";
      if(ppId==''){
        title = "Delete Comment";
      }
      else{
        title = "Delete Reply";
      }
     const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
       modalRef.componentInstance.access = 'PostDelete';
       modalRef.componentInstance.title = title;
       modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
         modalRef.dismiss('Cross click');
         console.log(receivedService);
         if(receivedService){
           this.deleteThreadPost('post',pid, replyType, ppId);
         }
       });
    }
  }

      // thread closed
      deleteThreadPost(type, id, replyType='', ppId=''){
        this.postServerErrorMsg = '';
        this.postServerError = true;
        const apiFormData = new FormData();

        let thread_id;
        let post_id;
        let parent_post_id;

        if(type == 'thread'){
          thread_id = this.threadId;
          post_id = id;
        }
        else{
          if(replyType == 'nested-reply'){
            thread_id = this.threadId;
            post_id = id;
            parent_post_id = ppId;
          }
          else{
            thread_id = this.threadId;
            post_id = id;
          }
        }

        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('threadId', thread_id);
        apiFormData.append('postId', post_id);
        apiFormData.append('platform', this.accessPlatForm);
        if(replyType == 'nested-reply'){
          apiFormData.append('parentPostId', parent_post_id);
        }

        this.threadPostService.deleteThreadPostAPI(apiFormData).subscribe(res => {
            if(res.status=='Success'){

              if(type == 'thread'){

                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('type', '1');
                apiDatasocial.append('action', 'delete');
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

              }
              else

              {
                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('type', '1');

                if(replyType == 'nested-reply'){
                  apiDatasocial.append('action', 'delete-reply');
                  //apiDatasocial.append('action', 'replyCount');
                  thread_id = this.threadId;
                  post_id = id;
                  parent_post_id = ppId;
                  apiDatasocial.append('commentId', ppId);
                  apiDatasocial.append('replyId', id);
                }
                else{
                  let replyCoount = 0;
                  for (let i in this.postData) {
                    if(this.postData[i].commentPostId == post_id){
                      replyCoount = this.postData[i].commentNestedReplies != undefined ? this.postData[i].commentNestedReplies.length : 0;
                    }
                  }
                  if(replyCoount>0){
                    apiDatasocial.append('action', 'replyCount');
                  }
                  else{
                    apiDatasocial.append('action', 'delete-comment');
                  }
                  thread_id = this.threadId;
                  apiDatasocial.append('commentId', id);
                  post_id = id;
                }
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                let apiData = new FormData();
                apiData.append('apiKey', Constant.ApiKey);
                apiData.append('domainId', this.domainId);
                apiData.append('countryId', this.countryId);
                apiData.append('userId', this.userId);
                apiData.append('threadId', this.threadId);
                apiData.append('silentPush', '1');

                if(replyType == 'nested-reply'){
                  apiData.append('action', 'reply-delete');
                  apiData.append('commentId', ppId);
                  apiData.append('replyId', id);
                }
                else{
                  apiData.append('action', 'comment-delete');
                  apiData.append('commentId', id);
                }

                this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });


              }

              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              let successMsg = '';
              if(type == 'thread'){
                successMsg = 'Thread Deleted Successfully';
              }
              else{
                //successMsg = 'Post Deleted Successfully';
                if(ppId==''){
                  successMsg = 'Comment Deleted Successfully';
                }
                else{
                  successMsg = 'Reply Deleted Successfully';
                }
              }
              msgModalRef.componentInstance.successMessage = successMsg;
              setTimeout(() => {
                if(type == 'thread'){
                  msgModalRef.dismiss('Cross click');
                  let chkLandingRecentFlag = localStorage.getItem('landingRecentNav');
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
                      access: 'threads',
                      action: 'silentDelete',
                      pushAction: 'load',
                      threadId: thread_id
                    }
                    this.commonApi.emitMessageReceived(data);
                  }
                  setTimeout(() => {
                    localStorage.removeItem('wsNav');
                    localStorage.removeItem('wsNavUrl');
                    localStorage.removeItem(silentItems.silentThreadCount);
                  }, 100);
                  //let url = `${type}s`;
                  /*if(this.teamSystem) {
                    this.loading = true;
                    window.open(url, IsOpenNewTab.teamOpenNewTab);
                  } else {
                    window.close();
                    window.opener.location.reload();
                  }*/
                }
                else{
                  this.deletePost(post_id, replyType, ppId);
                  //let ht = this.top.nativeElement.scrollHeight - (this.deletePostHeight + 800);
                  if(document.getElementsByClassName('pid-'+post_id)[0] != undefined){
                    //this.deletePostHeight = document.getElementsByClassName('pid-'+post_id)[0].clientHeight;
                    //console.log(this.deletePostHeight);
                    setTimeout(() => {
                      //let ht1 = this.deletePostHeight;
                      //let ht2 = (this.top.nativeElement.scrollTop - ht1);
                      //console.log(ht1,ht2);
                      setTimeout(() => {
                        //this.top.nativeElement.scrollTop = ht2;
                        msgModalRef.dismiss('Cross click');
                      }, 1);
                      /*this.top.nativeElement.scroll({
                        top: ht,
                        left: 0,
                        behavior: 'smooth'
                      });*/
                    }, 1);
                  }
                }
              }, 1500);
            }
            else{
              this.postServerErrorMsg = res.result;
              this.postServerError = true;
            }
          },
          (error => {
            this.postServerErrorMsg = error;
            this.postServerError  = true;
          })
        );
      }

        //reset reply box
  resetReplyBox(flagNew='0'){
    this.commentAssignedUsersList=[];
    this.commentAssignedUsersPopupResponse=false;
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.mediaUploadItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postButtonEnable = false;
    this.imageFlag = 'false';
    if(flagNew!='1')
    {
    this.postDesc = '';
  }
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
      mediaUploadItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.postApiData['uploadedItems'] = this.uploadedItems;
    this.postApiData['attachments'] = this.uploadedItems;
    this.postUpload = false;
    setTimeout(() => {
      this.postUpload = true;
    }, 100);
  }

  resetNestedReplyBox(flagNew=0){
    this.commentUploadedItemsFlag = false;
    this.apiUrl.uploadReplyFlag = this.commentUploadedItemsFlag;
    this.replyAssignedUsersList=[];
    this.replyAssignedUsersPopupResponse=false;
    this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.mediaUploadItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;

    this.imageFlag = 'false';
    if(flagNew!=1)
    {
      this.postReplyDesc = '';
      this.postReplyButtonEnable = false;

    }
    this.apiUrl.postReplyButtonEnable = this.postReplyButtonEnable;
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
      mediaUploadItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
    this.nestedPostApiData['attachments'] = this.uploadedItems;
    this.nestedPostUpload = false;
    setTimeout(() => {
      this.nestedPostUpload = true;
    }, 100);
    this.setScreenHeight();
  }
  //reset reply box
  resetEditReplyBox(){
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds  = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postSaveButtonEnable = false;
    this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
    this.postEditDesc = '';
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
    this.postEditApiData['uploadedItems'] = this.uploadedItems;
    this.postEditApiData['attachments'] = this.uploadedItems;
    this.postUpload = false;
    setTimeout(() => {
      this.postUpload = true;
    }, 100);
    this.setScreenHeight();
  }

      // delete post
  deletePost(postId, replyType='', ppId='', otherComp=''){
    if(replyType == 'nested-reply'){
      for (let i in this.postData) {
        if(this.postData[i].postId == ppId){
          length = this.postData[i].nestedReplies != 'undefined' || this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;
          for (let j in this.postData[i].nestedReplies) {
            this.postData[i].nestedReplies.forEach((element,index)=>{
              if(element.postId==postId) this.postData[i].nestedReplies.splice(index,1);
            });
          }
          if(length>1){

          }
          else{
            for (let i in this.postData) {
              if(this.postData[i].postId == ppId){
                if(this.postData[i].deleteFlag == 1){
                  this.postData = [];
                  this.emptyResult = true;
                }
              }
            }
          }
        }
      }
      this.postFixRefresh = true;
      //this.getThreadInfo('delete',0,'nested-reply');
      if(otherComp == ''){
        let dataReply = {
          type3: 'delete',
          replyType: replyType,
          postId: postId,
          parentPostId: ppId,
          threadId: this.threadId
        }
        this.commonApi.emitThreadDetailReplyUpdate(dataReply);
      }

    }
    else{
        //if(this.collabticDomain){
          let length = 0;
          for (let i in this.postData) {
            if(this.postData[i].postId == postId){
              length = this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;
              //alert("bb"+length);
              if(length){
                this.postData[i].deleteFlag = "1";
              }
              else{
                this.postData.forEach((element,index)=>{
                  if(element.postId==postId) this.postData.splice(index,1);
                  this.postDataLength = this.postData.length;
                });
                this.postFixRefresh = true;
                //this.getThreadInfo('delete',0);
              }
              if(otherComp == ''){
                //alert('e');
                let dataReply = {
                  type3: 'delete',
                  replyType: replyType,
                  postId: postId,
                  parentPostId: postId,
                  threadId: this.threadId
                }
                this.commonApi.emitThreadDetailReplyUpdate(dataReply);
              }
             }
          }
          setTimeout(() => {
            if(this.postData.length == 0){
              this.infoLoading = false;
              this.expandFlag = false;
              this.emptyResult = true;
              this.loadingResult = false;
              this.setScreenHeight();
            }
            else{
              this.setScreenHeight();
            }
          }, 100);

        /*}
        else{
          this.postData.forEach((element,index)=>{
            if(element.postId==postId) this.postData.splice(index,1);
          });
          this.postFixRefresh = true;
          //this.getThreadInfo('delete',0);
        }*/
    }
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

    tapontagUsers(type)
    {
      if(this.collabticDomain){
        if(type == 'comment'){
          if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
            this.openPost(0);
            return;
          }
        }
      }
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);

      let apiData = {
        'apiKey': Constant.ApiKey,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'userId': this.userId,
        'threadId':this.threadId,
        'productOwner' : this.assProdOwner,
      };

      if(type == 'thread'){
        apiData['teamId'] = this.teamId;
        apiData['fromTechSupport'] = "1";
      }

      let users=[];
      let selectedUsers = [];
      if(type == 'thread'){
        if(this.threadAssignedUsersListNew.length>0){
          let pImg;
          let uName;
          let id;
          for(let st in this.threadAssignedUsersListNew){
            id = this.threadAssignedUsersListNew[st].id;
            pImg = this.threadAssignedUsersListNew[st].pImg;
            uName = this.threadAssignedUsersListNew[st].uName;
            selectedUsers.push({
              'img':pImg,
              'name':uName,
              'id':id,
              'profileImage':pImg
            });
          }
        }

      }
      else if(type == 'reply'){
        if(this.replyAssignedUsersList.length>0){
          let pImg;
          let uName;
          let id;
          let email;
          for(let st in this.replyAssignedUsersList){
            id = this.replyAssignedUsersList[st].id;
            pImg = this.replyAssignedUsersList[st].img;
            uName = this.replyAssignedUsersList[st].name;
            email = this.replyAssignedUsersList[st].email;
            selectedUsers.push({
              'img':pImg,
              'name':uName,
              'id':id,
              'email':email
            });
          }
        }
        //selectedUsers =  this.replyAssignedUsersList;
      }
      else{
        if(this.commentAssignedUsersList.length>0){
          let pImg;
          let uName;
          let id;
          let email;
          for(let st in this.commentAssignedUsersList){
            id = this.commentAssignedUsersList[st].id;
            pImg = this.commentAssignedUsersList[st].img;
            uName = this.commentAssignedUsersList[st].name;
            email = this.commentAssignedUsersList[st].email;
            selectedUsers.push({
              'img':pImg,
              'name':uName,
              'id':id,
              'email':email
            });
          }
        }
        //selectedUsers =  this.commentAssignedUsersList;
      }
      console.log(selectedUsers);
      const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
      modalRef.componentInstance.access = (this.platformId=='2' && this.domainId == '52') ? "tvs-tag-users" : "tag-users";
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.height = innerHeight;
      modalRef.componentInstance.action = 'new';
      modalRef.componentInstance.selectedUsers = selectedUsers

      modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
        console.log(receivedService);
        this.replyTaggedUsers=[];
        this.commentTaggedUsers=[];
        this.threadTaggedUsers=[];

        if(!receivedService.empty) {
          if(receivedService)
          {
            if(type == 'thread'){
              for(let vt in receivedService)
              {
                //receivedService[vt].email;
                if(receivedService[vt].id)
                {
                  if(this.threadTaggedUsers.length>0)
                  {
                    for(let et in this.threadTaggedUsers)
                    {
                      if(this.threadTaggedUsers[et]!=receivedService[vt].id)
                      {
                        let rmIndex = this.threadTaggedUsers.findIndex(option => option == receivedService[vt].id);
                        if(rmIndex < 0)
                          {
                            this.threadTaggedUsers.push(receivedService[vt].id);
                          }
                      }
                    }

                  }
                  else
                  {
                    this.threadTaggedUsers.push(receivedService[vt].id);
                  }

                }

              }
              this.threadAssignedUsersList=receivedService;
              this.threadAssignedUsersPopupResponse=true;
              this.tagThreadFlag = true;
              //this.threadPostOnFlag2 = true;
            }
            else if(type == 'reply'){
              for(let vt in receivedService)
              {
                //receivedService[vt].email;
                if(receivedService[vt].email)
                {
                  if(this.replyTaggedUsers.length>0)
                  {
                    for(let et in this.replyTaggedUsers)
                    {
                      if(this.replyTaggedUsers[et]!=receivedService[vt].email)
                      {
                        let rmIndex = this.replyTaggedUsers.findIndex(option => option == receivedService[vt].email);
                        if(rmIndex < 0)
                          {
                            this.replyTaggedUsers.push(receivedService[vt].email);
                          }
                      }
                    }

                  }
                  else
                  {
                    this.replyTaggedUsers.push(receivedService[vt].email);
                  }

                }

              }
              this.replyAssignedUsersList=receivedService;
              this.replyAssignedUsersPopupResponse=true;
              this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;
              this.tagReplyFlag = true;
              this.replyPostOnFlag2 = true;
            }
            else{

              for(let vt in receivedService)
              {
                //receivedService[vt].email;
                if(receivedService[vt].email)
                {
                  if(this.commentTaggedUsers.length>0)
                  {
                    for(let et in this.commentTaggedUsers)
                    {
                      if(this.commentTaggedUsers[et]!=receivedService[vt].email)
                      {
                        let rmIndex = this.commentTaggedUsers.findIndex(option => option == receivedService[vt].email);
                        if(rmIndex < 0)
                          {
                            this.commentTaggedUsers.push(receivedService[vt].email);
                          }
                      }
                    }

                  }
                  else
                  {
                    this.commentTaggedUsers.push(receivedService[vt].email);
                  }

                }

              }
              this.commentAssignedUsersList=receivedService;
              this.commentAssignedUsersPopupResponse=true;
              this.tagCommentFlag = true;
              this.replyPostOnFlag3 = true;
            }
          }

        }
        else{
          if(type == 'thread'){
            this.tagThreadFlag = false;
          }
          else if(type == 'reply'){
            this.tagReplyFlag = false;
          }
          else{
            this.tagCommentFlag = false;
          }
          if(this.replyAssignedUsersList.length>0){
            this.replyAssignedUsersPopupResponse=true;
            this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;
          }
          else{
            this.replyAssignedUsersPopupResponse=false;
            this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;
          }

        }
        console.log(this.threadTaggedUsers);
        console.log(this.replyTaggedUsers);
        console.log(this.commentTaggedUsers);
        if(this.replyAssignedUsersList.length>0){
          this.replyAssignedUsersPopupResponse=true;
          this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;
        }
        else{
          this.replyAssignedUsersPopupResponse=false;
          this.apiUrl.tagReplyFlag = this.replyAssignedUsersPopupResponse;
        }

        if(type == 'thread'){
          if(!receivedService.empty) {
            this.taggedUserUpdate();
          }
        }
        modalRef.dismiss('Cross click');
      });
    }

    taggedUserUpdate(){

      this.threadAssignedUsersListNew = [];
      if(this.threadAssignedUsersList.length>0){
        let pImg;
        let uName;
        let id;
        for(let st in this.threadAssignedUsersList){
          pImg = this.threadAssignedUsersList[st].img;
          uName = this.threadAssignedUsersList[st].name;
          id = this.threadAssignedUsersList[st].id;
          this.threadAssignedUsersListNew.push({
            'pImg':pImg,
            'uName':uName,
            'id' : id
          });
        }
      }

      console.log(this.threadTaggedUsers);
      console.log(this.oldTaggedUsersList);

      let taggedUsersJSON='';
      let taggedUsers=[];
      taggedUsers = this.threadTaggedUsers;
      taggedUsersJSON = taggedUsers.length>0 ? JSON.stringify(taggedUsers) : '';


      let removedtaggedUsers='';
      console.log(this.oldTaggedUsersList);
      console.log(this.threadTaggedUsers);
      if(this.oldTaggedUsersList.length>0){
        let arr1 = this.oldTaggedUsersList;
        let arr2 = this.threadTaggedUsers;
        let difference = arr1.filter(x => !arr2.includes(x));
        console.log(difference);
        if(difference.length>0){
          removedtaggedUsers = JSON.stringify(difference);
        }
      }

      let arr11 = this.oldTaggedUsersList;
      let arr21 = this.threadTaggedUsers;
      let difference11 = arr21.filter(x => !arr11.includes(x));
      console.log(difference11);

      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('taggedUsers', taggedUsersJSON);
      apiFormData.append('removedtaggedUsers', removedtaggedUsers);
      apiFormData.append("fromTechSupport", "1");

      this.threadPostService.updateTagUsersList(apiFormData).subscribe(res => {
        if(res.status=='Success'){
          /*this.msgs1 = [{severity:'success', summary:'', detail:res.result}];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.msgs1 = [];
          }, 3000);*/
        }
      });

    }

    removeE1scSelection(id,type) {
      if(type == 'thread'){
        let rmIndex = this.threadAssignedUsersList.findIndex(option => option.id == id);
        this.threadAssignedUsersList.splice(rmIndex, 1);
        if(this.threadAssignedUsersList.length>0)
        {
          this.tagThreadFlag = true;
        }
        else{
          this.tagThreadFlag = false;
        }
      }
      else if(type == 'reply'){
        let rmIndex = this.replyAssignedUsersList.findIndex(option => option.id == id);
        this.replyAssignedUsersList.splice(rmIndex, 1);
        if(this.replyAssignedUsersList.length>0)
        {
          this.tagReplyFlag = true;
        }
        else{
          this.tagReplyFlag = false;
        }
      }
      else{
        let rmIndex = this.commentAssignedUsersList.findIndex(option => option.id == id);
        this.commentAssignedUsersList.splice(rmIndex, 1);
        if(this.commentAssignedUsersList.length>0)
        {
          this.tagReplyFlag = true;
        }
        else{
          this.tagReplyFlag = false;
        }
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
      // change desc
  changePostDesc(event,type){
    setTimeout(() => {
    if(type=='new'){
      //this.postDesc = event.htmlValue;
      console.log( this.postDesc);
      this.postButtonEnable = (this.postDesc != '') ? true : false;
      if(this.collabticDomain){
        if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
          this.openPost(0);
        }
        else{
          if(this.postDesc != ''){
            this.replyPostOnFlag3 = true;
            if(this.replyPostOnFlag1 && !this.replyPostOnFlag2){
              this.cancelNestedReply(0);
              setTimeout(() => {
                let getP = this.top.nativeElement.scrollHeight-988;
                this.top.nativeElement.scrollTop = getP;
              }, 1000);
            }
          }
          else{
            if(this.uploadCommentFlag || this.tagCommentFlag){
              this.replyPostOnFlag3 = true;
              if(this.replyPostOnFlag1 && !this.replyPostOnFlag2){
                this.cancelNestedReply(0);
                setTimeout(() => {
                  let getP = this.top.nativeElement.scrollHeight-988;
                  this.top.nativeElement.scrollTop = getP;
                }, 1000);
              }
            }
            else
              this.replyPostOnFlag3 = false;
          }
        }
      }
    }
    else if(type=='nested-reply'){
      //this.postReplyDesc = event.htmlValue;
      //console.log( this.postReplyDesc);
      this.postReplyButtonEnable = (this.postReplyDesc != '') ? true : false;
      this.apiUrl.postReplyButtonEnable = this.postReplyButtonEnable;
      if(this.replyPostOnFlag1){
        if(this.postReplyDesc != ''){
          this.replyPostOnFlag2 = true;
        }
        else{
          if(this.uploadReplyFlag || this.tagReplyFlag){
            this.replyPostOnFlag2 = true;
          }
          else{
            this.replyPostOnFlag2 = false;
          }
        }
      }
      let element = document.getElementsByClassName("thread-view-reply");
    let height = element[0].getElementsByClassName("ck-editor__editable")[0].scrollHeight;
    var heightSet = height - 55;
    console.log(height);
    let pmsgHeight = (this.apiUrl.newupdateRefresh) ? 27 : 0;
    this.bodyHeight = window.innerHeight;
    var headerHeight = 234 + pmsgHeight;
    if(height>55){
      if(height>185)  {
        headerHeight = 133 + headerHeight;
        this.innerHeight = (this.bodyHeight - headerHeight );
      }
      else{
        headerHeight = heightSet + headerHeight;
        this.innerHeight = (this.bodyHeight - headerHeight );
      }
    }
    else{
      this.innerHeight = (this.bodyHeight - headerHeight);
    }
    }
    else{
      //this.postEditDesc = event.htmlValue;
      //console.log( this.postEditDesc);
      this.postSaveButtonEnable = (this.postEditDesc != '') ? true : false;
      this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
    }
  }, 1);
  }

  onEditorInit(event: any) { event.editor.root.focus() }

  threadDashboardOpen(){
    this.threadDashboarUserList(this.dashboard,this.dashboardTab,this.threadId,'',1);
  }
  // liked, pinned, posted and one-puls user list
  threadDashboarUserList(dashboard,dashboardTab,threadId,postId,ismain){
    if(!this.msTeamAccessMobile){
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
              this.moveScroll(1);
              /*if(fromPush!='1')
              {
              this.moveScroll(1);
              }*/

             }

        }
        let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
        localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));

  }

  // post particular list solar api
  getPostUpdateList(pid,ptype,type='',fromPush='',othertype=''){
    this.resetReplyBox();
    this.resetEditReplyBox();
    this.resetNestedReplyBox();
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
      this.resetReplyBox(fromPush);
      this.resetEditReplyBox();
      this.resetNestedReplyBox(dontclearText);
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

    removeHilightColor()
    {
      if(this.postData)
      {
        for (let i in this.postData) {

          this.postData[i].newComment=false;

            for (let j in this.postData[i].commentNestedReplies) {
              this.postData[i].commentNestedReplies[j].newReply=false;
            }

        }
      }
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
