import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import * as ClassicEditor from "src/build/ckeditor";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { Subscription } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common/common.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Constant,PlatFormType, forumPageAccess, IsOpenNewTab, ManageTitle, pageTitle, RedirectionPage, silentItems, windowHeight,AttachmentType } from '../../../../common/constant/constant';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { ThreadPostService } from '../../../../services/thread-post/thread-post.service';
import { ApiService } from '../../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PresetsManageComponent } from 'src/app/components/common/presets-manage/presets-manage.component';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../../components/common/submit-loader/submit-loader.component';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../../services/thread/thread.service';
import { AddLinkComponent } from '../../../../components/common/add-link/add-link.component';
import { FollowersFollowingComponent } from '../../../../components/common/followers-following/followers-following.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ManageUserComponent } from '../../../../components/common/manage-user/manage-user.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseService } from 'src/app/modules/base/base.service';
import { Editor } from "primeng/editor";
import { retry } from 'rxjs/operators';
import { ApiConfiguration } from 'src/app/models/chatmodel';
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {MediaUploadComponent} from 'src/app/components/media-upload/media-upload.component';
import { ThreadDetailHeaderComponent } from 'src/app/layouts/thread-detail-header/thread-detail-header.component';
import { ThreadDetailViewComponent } from 'src/app/components/common/thread-detail-view/thread-detail-view.component';
import { ThreadViewRecentComponent } from 'src/app/components/common/thread-view-recent/thread-view-recent.component';
declare var $: any;

@Component({
  selector: 'app-view-v3',
  templateUrl: './view-v3.component.html',
  styleUrls: ['./view-v3.component.scss'],
  providers: [MessageService]
})
export class ViewV3Component implements OnInit, OnDestroy {

  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  @ViewChild('print',{static: false}) print: ElementRef;
  @ViewChild('top',{static: false}) top: ElementRef;
  @ViewChild('tdpage',{static: false}) tdpage: ElementRef;
  @ViewChild('pdesp',{static: false}) pdesp: ElementRef;
  @ViewChild('postReplyEditor') postReplyEditor: Editor;
  @ViewChild('postNewEditor') postNewEditor: Editor;
  threadDetailHeaderRef: ThreadDetailHeaderComponent;
  threadRecentRef: ThreadViewRecentComponent;
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
  public searchFilterRef: any;
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

  public feedbackLoading: boolean = false;
  public feedbackFormValid: boolean = false;
  public feedbackFormSubmit: boolean = false;
  public feedbackSucess: string = "";
  public feedbackForm: FormGroup;
  public feedbackFields: any = [];
  public requiredText: string = "Required";

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
  public moreInfoFlag: boolean = false;
  public feedbackFormFlag: boolean = false;
  public enableTagFlag: boolean = false;
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
  public emptyListFlag: boolean = false;
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
  public recentThreadsFlagDisable = false;
  public dialogPosition: string = 'top-right';
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
    placeholder: 'Please enter feedback',
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
     else if(event.key === 'Enter')
     {
      const exp = /<p[^>]*>(&nbsp;|\s+|<br\s*\/?>)*<\/p>/g;
      this.postDesc=this.postDesc.replace(exp, '');

        if(this.postButtonEnable && this.postDesc != ''){
          this.enterKeyPressFlag = true;
          this.setPostType('Comment', '0',0,'new');
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
  ) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';

      console.log(localStorage.getItem('loadDatefromFCM'));
  }

  onReject(incremented) {

    this.messageService.clear('c');
  }
  showNotification(resdata) {



    console.log(resdata,resdata.displayType,resdata.subType);

    let messageBody=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(resdata.body));
    let messagePropertiles={

      title:resdata.title,
      body:messageBody,
      messageId:resdata.messageId,
      chatGroupId:resdata.chatGroupId,
      chatType:resdata.chatType,


    }
    if(resdata.displayType=='1' && resdata.subType=='5')
    {
      //messageBody =messageBody+'<br/>'+'ID# '+resdata.dataId;
    }
    if(resdata.threadId!=this.threadId && messageBody)
    {




      this.messageService.add({key: 'c',severity:'custom', summary: resdata, detail: messageBody,life: 5000});


    }

    localStorage.setItem("notificationACTYPE",resdata.actionType);
    localStorage.setItem("notificationPOID",resdata.postId);
    localStorage.setItem("notificationPPOID",resdata.parentPostId);


    //this.messageData.push({key: 'c',severity:'custom', summary: resdata, detail: messageBody,sticky: true});

    //this.messageService.add({key: 'c',severity:'custom', summary: resdata, detail: messageBody,sticky: true});


    //this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
}

@HostListener('document:visibilitychange', ['$event'])

visibilitychange() {
  console.log('PushCheck');
//let type1=0;
let type1=1;
  navigator.serviceWorker.addEventListener('message', (event) => {
    //type1=type1+1;
    if(type1==1)
    {

      let threadInfo=event.data.data;
    console.log(event.data.data);

if(this.pushThreadArrayNotification.length==0 && (threadInfo.displayType=='1' || threadInfo.displayType=='2' || threadInfo.displayType==''))
{
  let backgroundPush=1;
  this.showNotificationData(event.data.data,type1,backgroundPush);
}


if(threadInfo.displayType=='1' && threadInfo.subType=='1' && threadInfo.threadId)
{
  this.pushThreadArrayNotification.push(threadInfo.threadId)
}
else
{
  if(threadInfo.postId)
  {
    this.pushThreadArrayNotification.push(threadInfo.postId);
  }

}







}

setTimeout(() => {
  this.pushThreadArrayNotification=[];
}, 1000);
return false;
    });
}


tapontoast(data)
  {
this.pushThreadArrayNotification=[];
    console.log(data);

    let flag: any = true;
    let currUrl = this.router.url.split('/');
    this.messageService.clear('c');

    if((data.displayType=='1' || data.displayType=='2') && data.subType!='5')
    {



          this.commonApi.setlocalStorageItem('landingRecentNav', flag);
      localStorage.setItem("notificationOnTap","1");
      localStorage.setItem("notificationTPID",data.postId);
      let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
      let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
      var aurl = `${view}${data.threadId}`;

        if(this.threadId == data.threadId){
          let data1 = {
            actionType: data.actionType,
            actionName: data.actionName,
            postId: data.postId,
          }
          console.log(data1);
          this.commonApi.emitPostDataNotification(data1);
        }
        else
        {
          console.log(data);
          this.arrayPushPostIds.push(data['postId']);
          this.commentNotifyRead = true;
          if(data.actionType=='comment')
          {
          this.threadId=data.threadId;
          this.threadViewData=[];
          this.postFixData=[];
          this.postData=[];
          this.postFixDataLength=0;
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.resetReplyBox();
          this.getThreadInfo('taponload',data.postId,'','comment');
          setTimeout(() => {
            let dataid = {
              threadId : this.threadId
            }
            this.commonApi.emitThreadDetailRecentIdData(dataid);
          },1000);
        }
        else{

          console.log(data);
          this.threadId=data.threadId;
          this.parentPostId=data.parentPostId;
          this.threadViewData=[];
          this.postFixData=[];
          this.postData=[];
          this.postFixDataLength=0;
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.resetReplyBox();
          console.log(data);

          this.getThreadInfo('taponload',data.postId,'','reply');
          setTimeout(() => {
            let dataid = {
              threadId : this.threadId
            }
            this.commonApi.emitThreadDetailRecentIdData(dataid);
          },1000);
        }
        }
      }
      localStorage.removeItem("notificationPOID");
      localStorage.removeItem("notificationPPOID");
  }

  ngOnInit(): void {
    localStorage.removeItem("newUpdateOnThreadId");
    localStorage.removeItem('callbackThreadInfo');
    localStorage.setItem('view-v2','1');
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass3);
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


    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;

    this.loginUserDomainId=this.user.domain_id;


    this.route.params.subscribe( params => {
      this.threadId = params.id;

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
    this.userId = this.user.Userid;
    this.teamMemberId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');
    this.manageAction = 'new';
    this.pageAccess = 'post';
    //this.hideLeftSidePanel =  this.roleId=='1' ? true : false;
    this.collabticDomain = (this.platformId=='1') ? true : false;
    this.knowledgeDomain = (this.platformId=='1' && this.domainId == '165') ? true : false;
    this.TVSDomain = (this.platformId=='2' && this.domainId == '52') ? true : false;
    this.TVSIBDomain = (this.platformId=='2' && this.domainId == '97') ? true : false;
    //this.enableTagFlag = this.platformId=='2' || this.platformId=='1' || this.platformId=='3' ? true : false;
    this.CBADomain = (this.platformId == PlatFormType.CbaForum || this.platformId == PlatFormType.Collabtic) ? true : false;
    this.CBADomainOnly = (this.platformId == PlatFormType.CbaForum) ? true : false;
    let businessRole = localStorage.getItem('businessRole') != null ? localStorage.getItem('businessRole') : '' ;
    
    this.businessRoleFlag = (businessRole == '6' ) ? true : false;
    
    this.apiUrl.techSupportFlagServer = this.collabticDomain ? true : false;
    if(this.businessRoleFlag && this.CBADomain && this.apiUrl.techSupportFlagServer ){
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

    let industryType = this.commonApi.getIndustryType();
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

    this.checkAccessLevel();

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

    this.industryType = this.commonApi.getIndustryType();
    console.log(this.industryType)
    this.subscription.add(
    this.commonApi.emitNotificationDataSubject.subscribe((data) => {
      console.log(data);
this.showNotificationData(data);


    })

    );




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
 this.subscription.add(
    this.commonApi.emitThreadDetailReplyIdSubject.subscribe((id) => {
        for (let i in this.postData) {
this.postData[i].activeBorder = false;
          if(this.postData[i].commentPostId == id){
            this.postData[i].activeBorder = true;
          }

        }
    })
 );
 this.subscription.add(
    this.commonApi.emitThreadDetailReplyUpdateSubject.subscribe((data) => {

      console.log(data);
      if(this.threadId  == data['threadId']){
        this.removeHilightColor();
        if(data['type1'] == 'replynew'){
          this.parentPostId = data['parentPostId'];
          this.postFixRefresh = true;
          //let bottom = this.isUserNearBottomorlastreplyUpdate();
          //if(bottom){
            //this.moveScroll(this.parentPostId);
          //}
          this.resetNestedReplyBox();
          this.updateDynamicData(data['type1'], data['type2'] , data['postId'], data['content']);
        }
        else if(data['type1'] == 'replyedit'){
          if(data['type3'] == 'edit-old'){
            this.getPostUpdateListOld(data['postId'],data['type2'],data['type1'],'1','','');
          }
          else{
            this.getPostUpdateList(data['postId'],data['type2'],data['type1'],'1','','');
          }
          this.parentPostId = data['parentPostId'];
        }
        else{
          if(data['type3'] == 'tap-threadId'){
            this.parentPostId = data['parentPostId'];
            this.moveScrollNotify(this.parentPostId);
          }
          else{
            if(data['type3'] != 'delete'){
             if(data['type3'] == 'edit-old'){
              this.getPostUpdateListOld(data['postId'],data['type2'],'','1','');
              }
              else{
                this.getPostUpdateList(data['postId'],data['type2'],'','1','');
              }

            }
            if(data['type3'] == 'delete'){
              this.deletePost(data['postId'], data['replyType'], data['parentPostId'], '1');
            }
          }
        }
      }
      else{
        if(data['type3'] == 'tap-threadId'){
          this.parentPostId = data['parentPostId'];
          let data1 = {
            threadId:data['threadId'],
            position:'top'
          }
          this.threadViewRecentAction(data1);
          this.activeCommentId = true;
          let dataid = {
            threadId : data['threadId']
          }
          this.commonApi.emitThreadDetailRecentIdData(dataid);
        }
      }
  })
  );

    setTimeout(() => {
      this.getUserProfile();
      this.feedbackForm = this.formBuilder.group({});
      this.getFeedbackFields();
    }, 2000);
    this.resetReplyBox();
    setTimeout(() => {
      this.getThreadInfo('init',0);
    }, 250);
    setTimeout(() => {
      this.setScreenHeight();
    }, 100);
    //this.languageSelect();
    /*if(!this.teamSystem) {
      setTimeout(() => {
        this.viewThreadInterval = setInterval(() => {
          let viewAncWidget = localStorage.getItem('viewThread');
          if (viewAncWidget) {
            console.log('in view');
            this.loading = true;
            this.getThreadInfo('init',0);
            localStorage.removeItem('viewThread');
          }
        }, 50)
      },1500);
    }*/
    this.subscription.add(
    this.commonApi.postDataNotificationReceivedSubject.subscribe((data) => {
      setTimeout(() => {

       console.log(data);
       this.arrayPushPostIds.push(data['postId']);
       this.commentNotifyRead = true;
       this.resetReplyBox();

       if(data['actionType']=='comment'){
          this.getPostUpdateList(data['postId'],'new','','','1');
          this.removeNotifications();
        }
        else if(data['actionType']=='reply'){
          this.parentPostId=data['parentPostId'];
          this.getPostUpdateList(data['postId'],'refresh','replynew','1','1');
          this.removeNotifications();
          let dataReply = {
            type1: 'replynew',
            type2: 'refresh',
            type3: 'notification',
            postId: data['postId'],
            parentPostId: this.parentPostId,
            threadId: this.threadId
          }
          this.commonApi.emitThreadDetailCommentUpdate(dataReply);
        }
        else{
            if(data['action']=='setPosition'){
              setTimeout(() => {
                this.notifyPostPosition(data['postId']);
                this.removeNotifications();
              }, 1500);
            }
        }
      }, 1000);
    })
    );
    this.subscription.add(
    this.commonApi.postDataReceivedSubject.subscribe((response) => {
      this.postUploadActionTrue = false;
      console.log(response);
      setTimeout(() => {
        let action = response['action'];
        let postId;
        switch(action) {
          case 'post-new':
              this.replyPostOnFlag1 = false;
              this.replyPostOnFlag2 = false;
              this.replyPostOnFlag3 = false;
              this.uploadCommentFlag = false;
              this.uploadReplyFlag = false;
              this.tagReplyFlag = false;
              this.tagCommentFlag = false;
              this.uploadedItems = [];
              if(response['nestedReply'] == "1"){
                this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
                this.nestedPostApiData['attachments'] = this.uploadedItems;
                this.nestedPostUpload = false;
                setTimeout(() => {
                  this.nestedPostUpload = true;
                }, 100);
                this.parentPostId = response['parentPostId'];
                let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
                //this.postData[itemIndex1].postReplyLoading = true;
                this.moveScroll(this.parentPostId);
                this.postData[itemIndex1].postNew = false;
                this.postFixRefresh = true;
                this.resetNestedReplyBox();
                //this.getThreadInfo('refresh',response['postId'],'replynew');
                this.getPostUpdateListOld(response['postId'],'refresh','replynew');
             }
             else{
              this.postApiData['uploadedItems'] = this.uploadedItems;
              this.postApiData['attachments'] = this.uploadedItems;
              this.postUpload = false;
              setTimeout(() => {
                this.postUpload = true;
              }, 100);
              this.postLoading = true;
              this.resetReplyBox();
              this.postFixRefresh = true;
              //this.getThreadInfo('refresh',response['postId']);
              this.getPostUpdateListOld(response['postId'],'new');
            }
            break;
          case 'post-edit':
            if(response['nestedReply'] == "1"){
              //if(response['viewpage'] == "1"){
                this.uploadedItems = [];
                this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
                this.nestedPostApiData['attachments'] = this.uploadedItems;
                this.nestedPostUpload = false;
                setTimeout(() => {
                  this.nestedPostUpload = true;
                }, 100);
                this.resetNestedReplyBox();
                this.postLoading = true;
                this.parentPostId = response['parentPostId'];
                let itemIndex1 = this.postData.findIndex(item => item.postId == response['parentPostId']);
                let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == response['postId']);
                this.postData[itemIndex1].nestedReplies[itemIndex2].postReplyLoading = true;
                this.moveScroll(response['parentPostId']);
                this.postData[itemIndex1].nestedReplies[itemIndex2].postView = true;
                this.postFixRefresh = true;
                this.getPostUpdateListOld(response['postId'],'edit','replyedit');
            }
            else{
              //if(response['viewpage'] == "1"){
                this.resetEditReplyBox();
                for (let i in this.postData) {
                  this.postData[i].postView = true;
                }
                this.postData[this.currentPostDataIndex].postLoading = true;
                this.postFixRefresh = true;
                this.getPostUpdateListOld(response['postId'],'edit');
            }
            break;
        }
      }, 1000);
    })
    );
  }

  showNotificationData(data,type1=1,backgroundPush=0)
  {
    if(!data['threadId'])
    {
  return false;
    }
    console.log(data);
     if(type1!=1)
     {
return;
     }

     console.log(data);

     this.pushText = data.body;

     this.postNotificationCount = this.postNotificationCount + 1;
     console.log(this.postNotificationCount);
     console.log(data['postId']);
     console.log(data['threadId']);

    let notificationTPID= localStorage.getItem('notificationTPID');
    console.log(notificationTPID+'--'+this.threadId)
     if(data['threadId'] == this.threadId){
       if(this.postNotificationCount>0 && (data['postId']!='undefined' || data['postId']!=undefined) &&  notificationTPID!=data['postId']){
        let bottom = this.isUserNearBottomorlastreplyUpdate();
   //let top = this.isUserNearTop();
   console.log("bottom:"+bottom);
   localStorage.setItem("notificationOnTap","1");
         localStorage.setItem("notificationTPID",data['postId']);
         let uploaFlag=false;
         if(this.uploadedItems != '') {
           if(this.uploadedItems.items.length>0){
             uploaFlag=true;
           }
         }


         //console.log(this.postReplyDesc+'--'+this.postDesc+'--'+this.replyTaggedUsers+'--'+uploaFlag+'--'+this.commentTaggedUsers);
  /*
         if(bottom && (this.postReplyDesc==null || this.postReplyDesc=='') && (this.postDesc==null || this.postDesc=='')  && this.replyTaggedUsers.length==0 && !uploaFlag && this.commentTaggedUsers.length==0)
   {

     this.tabonPageRefresh();

   }
   else
   {


     this.pageRefresh = true;
     this.arrayPushPostIds.push(data['postId']);


     if(data['actionType']=='comment')
     {
       this.getPostUpdateList(data['postId'],'new','','1');
     }
     else
     {
       this.parentPostId=data['parentPostId'];
       this.getPostUpdateList(data['postId'],'refresh','replynew','1');
      // this.commonApi.ThreadDetailReplyNotification(data);

       let dataReply = {
         type1: 'replynew',
         type2: 'refresh',
         postId: data['postId'],
         parentPostId: this.parentPostId,
         threadId: this.threadId
       }
       this.commonApi.emitThreadDetailCommentUpdate(dataReply);
     }

   }

   */



   if(data['actionType']=='comment-edit' || data['actionType']=='reply-edit' ||
   data['actionType']=='comment-delete' || data['actionType']=='reply-delete' ||
   data['actionType']=='comment-like' || data['actionType']=='reply-like' ||
   data['actionType']=='reopen' || data['actionType']=='close' ||
   data['actionType']=='thread-like' || data['actionType']=='thread-pin' ||
   data['actionType']=='comment-poststatus' || data['actionType']=='reply-poststatus' ||
   data['actionType']=='thread-plusOne' || data['actionType']=='thread-edit' || data['actionType']=='thread-delete'){

    this.pageRefresh = false;

    if(data['actionType']=='thread-like' || data['actionType']=='thread-pin' || data['actionType']=='thread-plusOne' || data['actionType']=='comment-like' || data['actionType']=='reply-like'){
      this.threadActionRefresh = true;
      this.pushTextIcon = data['actionType'];
      setTimeout(() => {
        this.threadActionRefresh = false;
      }, 3000);
    }


    if(data['actionType']=='comment-edit' || data['actionType']=='comment-like' || data['actionType']=='comment-poststatus' ){
      this.getPostUpdateListOld(data['postId'],'edit','','','','edit-silent-push');
      let data2 = {
        type1: '',
        type2: 'edit',
        type3: 'edit-old',
        postId: data['postId'],
        threadId: this.threadId,
        parentPostId: data['postId'],
      }
      this.commonApi.emitThreadDetailCommentUpdate(data2);
      if(data['actionType']=='comment-like'){
        setTimeout(() => {
          this.callThreadDetail('thread-like');
        }, 100);
      }
      if(data['actionType']=='comment-poststatus'){
        setTimeout(() => {
          this.callThreadDetail('comment-poststatus');
        }, 100);
      }
    }
    if(data['actionType']=='reply-edit' || data['actionType']=='reply-like' || data['actionType']=='reply-poststatus' ){
      this.parentPostId=data['parentPostId'];
      this.getPostUpdateListOld(data['postId'],'edit','replyedit','','','edit-silent-push');
      let data2 = {
        type1: 'replyedit',
        type2: 'edit',
        type3: 'edit-old',
        postId: data['postId'],
        parentPostId: this.parentPostId,
        threadId: this.threadId
      }
      this.commonApi.emitThreadDetailCommentUpdate(data2);
      if(data['actionType']=='reply-like'){
        setTimeout(() => {
          this.callThreadDetail('thread-like');
        }, 100);
      }
      if(data['actionType']=='reply-poststatus'){
        setTimeout(() => {
          this.callThreadDetail('reply-poststatus');
        }, 100);
      }
   }

   if(data['actionType']=='comment-delete' || data['actionType']=='reply-delete' ){
    this.parentPostId=data['parentPostId'];
    let replyType = data['actionType']=='reply-delete' ? 'nested-reply' : '';
    this.deletePost(data['postId'], replyType, data['parentPostId']);
   }

   if(data['actionType']=='reopen' || data['actionType']=='close' ||
   data['actionType']=='thread-like' || data['actionType']=='thread-pin' ||
   data['actionType']=='thread-plusOne' || data['actionType']=='thread-edit' || data['actionType']=='thread-delete' ){
    setTimeout(() => {
      localStorage.removeItem("notificationTPID");
      this.callThreadDetail(data['actionType']);
    }, 100);
    if(data['actionType']=='thread-edit'){
      let dataid = {
        threadId : data['threadId'],
        type: data['actionType']
      }
      //if(!this.hideLeftSidePanel){
        this.commonApi.emitThreadDetailRecentUpdateData(dataid);
      //}
    }
    if(data['actionType']=='thread-delete'){
      this.deleteThreadId = data['threadId'];
    }


   }

  }
  else{

    console.log("CHECK");

    let PushColor='1';
    this.arrayPushPostIds.push(data['postId']);
    this.commentNotifyRead = true;

   if(data['actionType']=='comment')
   {

     let fromPushData='';
     if(bottom)
   {
     //PushColor='2';
     fromPushData='';
     this.pageRefresh = false;
   }
   else
   {

    /*if(data['silentPushFlag']){
      this.pageRefresh = false;
    }
    else{
      this.pageRefresh = true;
    }*/

    this.pageRefresh = true;

     fromPushData='1';
   }
  let dontclearText=1;
     this.getPostUpdateListOld(data['postId'],'new','',fromPushData,PushColor,'comment',dontclearText);

   }
   else
   {


     let fromPushData='';
     if(bottom)
   {
     //PushColor='2';
     fromPushData='1';
     this.pageRefresh = false;
   }
   else
   {
    this.pageRefresh = true;
    /*if(this.postDesc)
    {
      fromPushData='1';
    }
    else
    {
      fromPushData='';
    }*/

   }

   this.replyPush = true;

     this.parentPostId=data['parentPostId'];
     let dontclearText=1;
     this.getPostUpdateListOld(data['postId'],'refresh','replynew',fromPushData,PushColor,'reply',dontclearText);

      let dataReply = {
       type1: 'replynew',
       type2: 'refresh',
       type3: 'notification-old',
       postId: data['postId'],
       parentPostId: this.parentPostId,
       threadId: this.threadId
     }
     this.commonApi.emitThreadDetailCommentUpdate(dataReply);
   }
  }

         //this.newText = "NEW ("+this.postNotificationCount+") ";


       }
     }
     else
     {

       console.log(data);

       let rightCommentPostId= localStorage.getItem('rightCommentPostId');
      if(data['parentPostId'] && data['parentPostId']==rightCommentPostId && data['actionType']!='comment')
      {
       let pushPostId=localStorage.getItem('pushPostId');
       if(pushPostId!=data['postId'])
       {


      localStorage.setItem('pushPostId',data['postId']);
       let PushColor='1';
       this.getPostUpdateListOld(data['postId'],'refresh','replynew','1',PushColor);

        let dataReply = {
          type1: 'replynew',
          type2: 'refresh',
          type3: 'notification-old',
          postId: data['postId'],
          parentPostId: data['parentPostId'],
          threadId: data['threadId']
        }
        this.commonApi.emitThreadDetailCommentUpdate(dataReply);



   }
      }

      else
      {
     // console.log(backgroundPush);
        if(backgroundPush==1)
        {
          if(this.threadId==data.threadId)
          {
          if(data.actionType=='comment')
          {


          this.threadId=data.threadId;
          this.threadViewData=[];
          this.postFixData=[];
          this.postData=[];
          this.postFixDataLength=0;
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.resetReplyBox();
          this.getThreadInfo('taponload',data.postId,'','comment');
          setTimeout(() => {
          let dataid = {
            threadId : this.threadId
          }
       this.commonApi.emitThreadDetailRecentIdData(dataid);
        },1000);
        }
        else{
          if(data.actionType=='reply')
          {




          this.threadId=data.threadId;

          this.parentPostId=data.parentPostId;
          this.threadViewData=[];
          this.postFixData=[];
          this.postData=[];
          this.postFixDataLength=0;
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.resetReplyBox();
          console.log(data);

          this.getThreadInfo('taponload',data.postId,'','reply');
          setTimeout(() => {
          let dataid = {
            threadId : this.threadId
          }
       this.commonApi.emitThreadDetailRecentIdData(dataid);
        },1000);
      }

        }
      }
      else
      {
        setTimeout(() => {
          let dataid = {
            threadId : data['threadId'],
            'update':1
          }
          this.commonApi.emitThreadDetailRecentIdData(dataid);

        }, 100);
      }
      if(data.displayType=='1' || data.displayType=='2' || data.displayType=='')
{
  this.commonApi.emitNotificationData(data);
}
        }
        else
        {


       console.log(data);
       if (data.body.search('new thread')!=-1 ) {

        let threadIndex= this.pushThreadTopbanner.includes(data.threadId);

        if(!threadIndex) {
          this.pushThreadTopbanner.push(data.threadId);
        }

      }
      else
      {
        this.pushThreadTopbanner=[];
      }

        this.showNotification(data);



       setTimeout(() => {
        let dataid;
        if(data['displayType']=='1' && data['subType']=='1')
{
 dataid = {
    threadId : data['threadId'],
    'update':1,
    'displayType':1
  }
}
else

{
 dataid = {
    threadId : data['threadId'],
    'update':1
  }
}

console.log(data);
if(data['displayType']=='1' && data['subType']=='1')
{
  data['pushAction']='load';
  data['access']='threads';
  data['pageInfo']='4';

  localStorage.setItem('newThreadsData',JSON.stringify(data));
}

      this.commonApi.emitThreadDetailRecentIdData(dataid);

       if(data.displayType=='1' || data.displayType=='2' || data.displayType=='')
{
  this.commonApi.emitNotificationhreadRecentData(data);
}
       }, 100);
      }
      }
     }


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
        let itemIndex1 = this.postData.findIndex(item => item.postId == ppId);
        let itemIndex2 = this.postData[itemIndex1].commentNestedReplies.findIndex(item => item.postId == pid);
        this.postData[itemIndex1].commentNestedReplies[itemIndex2].availability = availability;
        this.postData[itemIndex1].commentNestedReplies[itemIndex2].availabilityStatusName = availabilityStatusName;
        this.postData[itemIndex1].commentNestedReplies[itemIndex2].profileShow = true;
      }
      else if(type == 'fix'){
        let itemIndex1 = this.postFixData.findIndex(item => item.postId == pid);
        this.postFixData[itemIndex1].availability = availability;
        this.postFixData[itemIndex1].availabilityStatusName = availabilityStatusName;
        this.postData[itemIndex1].profileShow = true;
      }
      else{
        let itemIndex1 = this.postData.findIndex(item => item.postId == pid);
        this.postData[itemIndex1].availability = availability;
        this.postData[itemIndex1].availabilityStatusName = availabilityStatusName;
        this.postData[itemIndex1].profileShow = true;
      }

    });
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
  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true, replyAccess = true, closeAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(2, chkType, chkFlag);
      setTimeout(() => {
        let accessLevels = this.authenticationService.checkAccessItems;
        if(accessLevels.length > 0) {
          let reportAccess = accessLevels[0].pageAccess;
          reportAccess.forEach(item => {
            let accessId = parseInt(item.id);
            let roles = item.roles;
            let roleIndex = roles.findIndex(option => option.id == this.roleId);
            let roleAccess = roles[roleIndex].access;
            console.log(accessId, roleAccess)
            switch (accessId) {
              case 1:
                viewAccess = (roleAccess == 1) ? true : false;
                break;
              case 2:
                createAccess = (roleAccess == 1) ? true : false;
                break;
              case 3:
                editAccess = (roleAccess == 1) ? true : false;
                break;
              case 4:
                deleteAccess = (roleAccess == 1) ? true : false;
                break;
              case 5:
                replyAccess = (roleAccess == 1) ? true : false;
                break;
              case 6:
                closeAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });

        }
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess, reply: replyAccess, close: closeAccess};

        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        else{
          this.accessLevel = this.accessLevel;
        }
        console.log(this.accessLevel)

      }, 700);
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
      //this.loading = false;
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


    this.threadViewData.threadTitle=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadTitle));
    //this.threadViewData.threadTitle = this.sanitizer.bypassSecurityTrustHtml(this.authenticationSeifrvice.URLReplacer(this.threadViewData.threadTitle));
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

    let shareFixDesc = '';
    console.log(this.threadViewData.threadDescFix);
    if(this.threadViewData.threadDescFix)
    {
      shareFixDesc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadDescFix));
      console.log(shareFixDesc);
      this.threadViewData.threadDescFix = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(shareFixDesc));
    }
    console.log(this.threadViewData.threadDescFix);

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
            else if(initVal == 'edit'){
              this.getPostUpdateList(pid,'edit',type);
              /*if(this.postFixRefresh){
                this.getPostFixList();
              }*/
            }
            else if(initVal == 'reminder'){
              let lastposid = 0;
              for (let i in this.postData) {
                if(this.postData[i].deleteFlag != 1){
                  //this.getPostUpdateList(this.postData[i].postId,'edit');
                  lastposid = this.postData[i].postId;
                }
              }
              setTimeout(() => {
                let st1 = 300;
                if(lastposid>0){
                  st1 = document.getElementById('rpid-'+lastposid).offsetTop;
                }
                this.top.nativeElement.scrollTop = st1;
              }, 1000);

              let loadpid = this.postData[this.postData.length - 1].postId;
              setTimeout(() => {
                //this.getPostListSolr(this.threadViewData.postListData);
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
              this.getPostUpdateList(loadpid,'edit');
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
                    this.postLists[i].actionDisable = true;
                    this.postData[i].commentDeleteAction=false;
                    this.postData[i].commentEditAction=false;

                  }
                }
              }
              else{
                this.getPostUpdateList(pid,'last',type);
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
            //this.loading = false;
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
                //let divHeight = this.tdpage.nativeElement.offsetHeight;
                let divHeight = 0;
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

          if(initVal == 'taponload' && pid && othertype != 'comment' && othertype != 'reply' ){
          this.getPostUpdateList(pid,'last',type,'','1');
          }
          if(initVal == 'taponload' && othertype == 'comment'){
            this.getPostUpdateList(pid,'new','','','1',othertype);
          }
          if(initVal == 'taponload' && othertype == 'reply'){
            this.getPostUpdateList(pid,'refresh','replynew','1','1',othertype);
          }

          let editID = localStorage.getItem('newUpdateOnEditThreadId') != null && localStorage.getItem('newUpdateOnEditThreadId') != undefined ? localStorage.getItem('newUpdateOnEditThreadId') : '' ;
          if(editID != ''){
            //this.callThreadDetail('thread-edit');
            setTimeout(() => {
              localStorage.removeItem("newUpdateOnEditThreadId");
            }, 100);
          }

        }
        else{
          //this.loading = false;
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
      //this.loading = false;
      this.enableCommentBox=true;
    }, 200);
   }
   else{
     //this.loading = false;
     this.postLoading = false;
     this.threadViewErrorMsg = res.result;
     this.threadViewError = true;
     setTimeout(() => {
      this.commonApi.emitThreadListData(this.threadViewData);
    }, 1);
   }
  }
  else{

    //this.loading = true;
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
        this.resetReplyBox();
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
          this.resetReplyBox();
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



    let newThread = localStorage.getItem('newThread') != null ? localStorage.getItem('newThread') : '';
    let notificationTPID = localStorage.getItem('notificationTPID') != null ? localStorage.getItem('notificationTPID') : '';
    let notificationOnTap = localStorage.getItem('notificationOnTap') != null ? localStorage.getItem('notificationOnTap') : '';
    if(newThread == '1' && notificationTPID != '' && notificationOnTap!= ''){
      this.removeNotifications('newThread');
    }

    this.updatethreadViewSolr();


 },
 (error => {
   //this.loading = false;
   this.postLoading = false;
   this.threadViewErrorMsg = error;
   if(pid)
   {
     this.getPostUpdateList(pid,'last',type);
   }
   this.threadViewError = '';
   setTimeout(() => {
    this.commonApi.emitThreadListData(this.threadViewData);
  }, 1);
 })
 );



}
  // post particular list solar api
  getPostUpdateList(pid,ptype,type='',fromPush='',PushColor='',othertype=''){
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
                this.updateCommentSolr(pid,ptype,type,fromPush,PushColor,othertype);
                console.log(this.postLists);
              }
              else{
                this.postLists = res.commentNestedReplies;
                this.updateReplySolr(pid,ptype,type,fromPush,PushColor,othertype);
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

    localStorage.removeItem('notificationTPID');
    }, 5000);
    console.log("test"+pid,ptype,type,fromPush,PushColor,othertype);

  }

  // post particular list
  getPostUpdateListOld(pid,ptype,type='',fromPush='',PushColor='',othertype='',dontclearText=0){
    this.resetReplyBox(dontclearText);
    this.resetEditReplyBox();
    this.resetNestedReplyBox();
    console.log(othertype);
    let timeLimit = 1000;
    if(ptype == 'delete-refresh'){
      timeLimit = 0;
    }
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

                  this.postLists[i].enableActionButton = true;
                  this.postLists[i].newComment = false;
                  this.postLists[i].postView = true;
                  this.postLists[i].postView = true;
                  this.postLists[i].postLoading = false;

                  if(type != 'replyedit' && type != 'replynew'){
                    this.postLists[i].commentPostId = this.postLists[i].postId;
                    this.postLists[i].commentThreadId = this.postLists[i].threadId;
                    this.postLists[i].commentUserId = this.postLists[i].userId;
                    this.postLists[i].commentUserName = this.postLists[i].userName;
                    this.postLists[i].commentProfileImage = this.postLists[i].profileImage;
                    this.postLists[i].commentPostStatus = this.postLists[i].postStatus;
                    this.postLists[i].commentPostType = this.postLists[i].postType;


                    if(this.postLists[i].commentLikedUsers != undefined){
                      this.postLists[i].likeStatus = 0;
                      for(let a in this.postLists[i].commentLikedUsers) {
                        if(this.postLists[i].commentLikedUsers[a] == this.userId) {
                          this.postLists[i].likeStatus = 1;
                        }
                      }
                    }
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
                  if(this.threadUserId  == this.postLists[i].userId){
                    this.postLists[i].threadOwnerLabel = true;
                    this.postLists[i].postOwner = true;
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
                    this.postLists[i].actionDisable = true;
                    this.postLists[i].commentEditAction = false;
                    this.postLists[i].commentDeleteAction = false;
                  }
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
                      for (let pr in this.postReplyLists) {
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
                        this.postReplyLists[pr].enableActionButton = true;
                        this.postReplyLists[pr].postReplyLoading = false;
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
                        if(this.threadUserId  == this.postReplyLists[pr].userId){
                          this.postReplyLists[pr].threadOwnerLabel = true;
                        }
                        this.postReplyLists[pr].actionDisable = false;
                        if(this.userId == this.postReplyLists[pr].userId || this.postReplyLists[pr].ownerAccess == 1){
                          this.postReplyLists[pr].actionDisable = true;
                        }


                        // post edit delete action
                        /*this.postReplyLists[pr].editDeleteAction = false;
                        if((this.userId == this.postReplyLists[pr].userId || this.postReplyLists[pr].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                          this.postReplyLists[pr].editDeleteAction = true;
                        }*/

                        this.postReplyLists[pr].editDeleteAction = false;
                        if(this.userId == this.postReplyLists[pr].userId){
                          this.postReplyLists[pr].editDeleteAction = true;
                        }
                        this.postReplyLists[pr].replyEditAction = this.postReplyLists[pr].editDeleteAction ? true : this.accessLevel.edit;
                        this.postReplyLists[pr].replyDeleteAction = this.postReplyLists[pr].editDeleteAction ? true : this.accessLevel.delete;

                        if(!this.subscriberAccess)
                        {
                          this.postReplyLists[pr].actionDisable = true;
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
                      let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
                      let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == pid);
                      this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[i];
                      this.postData[itemIndex1].commentNestedReplies[itemIndex2] = this.postData[itemIndex1].nestedReplies[itemIndex2];
                      setTimeout(() => {
                        this.postData[itemIndex1].commentNestedReplies[itemIndex2].enableActionButton = true;
                      }, 2000);
                    }
                    else{
                      let itemIndex = this.postData.findIndex(item => item.postId == pid);
                      this.postData[itemIndex] = this.postLists[i];
                      setTimeout(() => {
                        this.postData[itemIndex].enableActionButton = true;
                      }, 2000);
                    }
                  }
                  else{
                    setTimeout(() => {
                      this.callThreadDetail('postcount');
                    }, 100);
                    if(type == 'replynew'){
                      for (let r1 in this.postData) {
                        this.postData[r1].postNew = false;
                        this.postData[r1].postReplyLoading = false;
                        if(this.postData[r1].postId == this.parentPostId){
                          if(this.postData[r1].nestedReplies.length>0){
                            if(!this.deleteActionFlag){
                              let itemIndex1 = this.postData[r1].nestedReplies.findIndex(item => item.postId == pid);
                              if (itemIndex1 < 0) {
                                this.postData[r1]['replyIdArr'].push(pid);
                                this.postData[r1]['commentReplyCount'] = this.postData[r1]['commentReplyCount'] + 1;
                              }

                            }
                          }
                          else{
                            if(!this.deleteActionFlag){
                              this.postData[r1]['commentReplyCount'] = 1;
                              this.postData[r1]['replyIdArr']=[];
                              this.postData[r1]['replyIdArr'].push(pid);
                            }
                          }
                          this.postData[r1].commentNestedReplies = [];
                          this.postData[r1].nestedReplies = [];
                          this.postData[r1].nestedReplies.push(this.postLists[i]);
                          this.postData[r1].commentNestedReplies = this.postData[r1].nestedReplies;
                        }
                      }
                    }
                    else{
                      //checking duplicate
                      let itemIndex1 = this.postData.findIndex(item => item.postId == pid);
                      console.log(itemIndex1);
                      if (itemIndex1 < 0) {
                        //if(this.postLists[i].contentWeb != ''){
                          this.postData.push(this.postLists[i]);
                        //}
                      }
                      else{
                        //if(this.postLists[i].contentWeb != ''){
                          this.postData[itemIndex1] = this.postLists[i];
                        //}
                     }
                    }
                  }
                }

                if(type == 'replynew'){
                  let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
                      //let itemIndex2 = this.postData[itemIndex1].commentNestedReplies.findIndex(item => item.postId == pid);
                      //this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[i];


                        setTimeout(() => {

                          this.postData[itemIndex1].commentNestedReplies[0].newReply = true;
                          this.postData[itemIndex1].nestedReplies[0].newReply = true;
                        }, 10);

                      if(this.deleteActionFlag){
                        setTimeout(() => {
                          this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
                          this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
                          this.deleteActionFlag = false;
                        }, 2000);
                      }
                      else{
                        setTimeout(() => {
                          this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
                          this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
                        }, 2000);
                      }


                      if(fromPush!='1')
                      {
                    // this.moveScroll(1);
                      }
                      if(fromPush=='1')
                      {
                        setTimeout(() => {
                         // this.moveScrollNotify(pid);
                         if(document.getElementById('notify-'+pid) != undefined){
                          let nst1 = document.getElementById('notify-'+pid).offsetTop;

                          $(".threadPostcomment").animate({ scrollTop: nst1 }, "medium");
                        }
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
                    //this.moveScroll(1);

                    let ht3 = this.top.nativeElement.scrollHeight;
                      $(".threadPostcomment").animate({ scrollTop: ht3 }, "medium");

                  }
                }

                if(othertype == 'comment' || othertype== 'reply'){
                  this.removeNotifications();
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
    localStorage.removeItem('notificationTPID');
    }, timeLimit);
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

  tapOnComment(PostData)
  {
    //if(this.closeStatus == 0 ){
      PostData.threadCloseStatus = this.closeStatus;
      PostData.threadUserId = this.threadUserId;
      PostData.adminUserNotOwner = this.adminUserNotOwner;
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
        this.postLists[i].actionDisable = true;
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
    if(othertype == 'bottom'){
      setTimeout(() => {
        this.tapRedDotAction();
      }, 1000);
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

        if(othertype == 'comment' || othertype== 'reply'){
          this.removeNotifications();
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

    if(othertype == 'comment' || othertype== 'reply'){
      this.removeNotifications();
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

      deletedThreadView(){
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
          if(chkLandingRecentFlag) {}
          else{
            let data = {
              access: 'threads',
              action: 'silentDelete',
              pushAction: 'load',
              threadId: this.deleteThreadId
            }
            setTimeout(() => {
              this.commonApi.emitMessageReceived(data);
            }, 1000);
          }
          setTimeout(() => {
            localStorage.removeItem('wsNav');
            localStorage.removeItem('wsNavUrl');
            localStorage.removeItem(silentItems.silentThreadCount);
          }, 100);


      }
  // Set Screen Height
  setScreenHeight() {

    this.bodyHeight = window.innerHeight;
    let pmsgHeight = (this.apiUrl.newupdateRefresh) ? 27 : 0;
    if(this.closeStatus==1){
      this.innerHeight = (this.bodyHeight - (42 + pmsgHeight));
    }
    else if(!this.commentReplyAccessLevel && !this.closeAccessLevel){
      this.innerHeight = (this.bodyHeight - (105 + pmsgHeight));
    }
    else if(!this.commentReplyAccessLevel && this.closeAccessLevel){
      this.innerHeight = (this.bodyHeight - (112 + pmsgHeight));
    }
    else{
      if(this.emptyComment){
        this.innerHeight = (this.bodyHeight - (234 + pmsgHeight));
      }
      else{
        this.innerHeight = (this.bodyHeight - (204 + pmsgHeight));
      }
    }

    this.innerHeight = this.innerHeight;

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
            apiDatasocial.append('actionType', '1');
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
                  let itemIndex1 = this.postData.findIndex(item => item.postId == ppId);
                  let itemIndex2 = this.postData[itemIndex1].commentNestedReplies.findIndex(item => item.postId == postId);
                  this.postData[itemIndex1].commentNestedReplies[itemIndex2].replyPostStatus = postStatus;
                  //this.getThreadInfo('edit',postId,'replyedit');
                  let data = {
                    type1: 'replyedit',
                    type2: 'edit',
                    type3: 'edit-old',
                    postId: postId,
                    parentPostId: ppId,
                    threadId: this.threadId
                  }
                  this.commonApi.emitThreadDetailCommentUpdate(data);
                  setTimeout(() => {
                    this.callThreadDetail('reply-poststatus');
                  }, 100);
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
                  this.commonApi.emitThreadDetailCommentUpdate(data);
                  setTimeout(() => {
                    this.callThreadDetail('comment-poststatus');
                  }, 100);
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
    else if(action=='new'){
      if(this.apiUrl.enableAccessLevel){
        if(this.userId == this.threadUserId){
          this.authenticationService.checkAccessVal = true;
          this.newPost(postType,postStatus,'No');
        }
        else{
          this.authenticationService.checkAccess(2,'Reply',true,true);

        setTimeout(() => {
          if(this.authenticationService.checkAccessVal){
            this.newPost(postType,postStatus,'No');
          }
          else if(!this.authenticationService.checkAccessVal){
            // no access
          }
          else{
            this.newPost(postType,postStatus,'No');
          }
        }, 550);
       }
      }
       else{
        this.newPost(postType,postStatus,'No');
       }
    }
    else{
      this.editPost(postType,postStatus,'No',postId,action,ppId);
    }
  }

  // posted new reply
  newReplyPost(postType,postStatus,closeStatus,postId){


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
    this.parentPostId = postId;
    this.postServerErrorMsg = '';
    this.postServerError = false;
    this.postReplyButtonEnable = false;
    const apiFormData = new FormData();
    this.imageFlag = 'true';

    if(this.uploadedItems != '') {
      if(this.uploadedItems.items.length>0){
        for(let a in (this.uploadedItems.items)) {
          if(this.uploadedItems.items[a].flagId == 6) {
            this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
            if(this.uploadedItems.items[a].url=='') {
              this.postReplyButtonEnable = true;
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
        } else {
          uploadCount++;
        }
      });
    }


    console.log( this.replyTaggedUsers);
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
    apiFormData.append('parentPostId', this.parentPostId);
    apiFormData.append('description', this.postReplyDesc);
    apiFormData.append('postType', postType);
    apiFormData.append('postStatus', postStatus);
    apiFormData.append('closeStatus', closeStatus);
    apiFormData.append('imageFlag', this.imageFlag);
    apiFormData.append('summitFix', techSubmmitVal);
    apiFormData.append('taggedUsers', replyTaggedUsers);
    apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    apiFormData.append('platform', this.accessPlatForm);
    this.threadPostService.newReplyPost(apiFormData).subscribe(res => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.replyAssignedUsersList=[];
          this.replyAssignedUsersPopupResponse=false;

          let lastPostid = res.data.postId;
          let replyContent = res.data.replyContent;
          if(res.escalationStatus)
          {
            this.threadViewData.escalateStatus=res.escalationStatus.escalateStatus;
          }


          apiFormData.append('threadId', this.threadId);
          apiFormData.append('parentPostId', this.parentPostId)
          apiFormData.append('postId', lastPostid);

          if(uploadCount == 0) {
            this.uploadedItems = [];
            this.mediaUploadItems = [];
            this.nestedPostUpload = false;
            setTimeout(() => {
              this.nestedPostUpload = true;
            }, 100);
          }

          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            this.nestedPostApiData['uploadedItems'] = this.uploadedItems.items;
            this.nestedPostApiData['attachments'] = this.uploadedItems.attachments;
            this.nestedPostApiData['nestedReply'] = "1";
            this.nestedPostApiData['viewpage'] = "1";
            this.nestedPostApiData['message'] = res.result;
            this.nestedPostApiData['dataId'] = lastPostid;
            this.nestedPostApiData['threadId'] = this.threadId;
            this.nestedPostApiData['summitFix'] = techSubmmitVal;
            this.manageAction = 'uploading';
            this.nestedPostUpload = false;
            setTimeout(() => {
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
              apiData.append('action', 'reply');
              if(!this.techSubmmitFlag){

                this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('postId', lastPostid);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('action', 'replyCount');
                apiDatasocial.append('actionType', '1');
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
            this.postData[itemIndex1].postReplyLoading = true;
            this.postData[itemIndex1].postNew = false;
            this.postFixRefresh = true;
            this.resetNestedReplyBox();
            //this.getThreadInfo('refresh',lastPostid,'replynew');
            this.updateDynamicData('replynew', 'new' , lastPostid, replyContent);
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
  // posted new reply
  newPost(postType,postStatus,closeStatus){

    this.removeHilightColor();
    let autoGeneratedIdOpt=Math.floor(100000 + Math.random() * 900000);
    this.replyPostOnFlag1 = false;
    this.replyPostOnFlag2 = false;
    this.replyPostOnFlag3 = false;
    this.uploadCommentFlag = false;
    this.uploadReplyFlag = false;
    this.tagReplyFlag = false;
    this.tagCommentFlag = false;
    this.postServerErrorMsg = '';
    this.postServerError = false;
    this.postButtonEnable = false;
    this.apiUrl.postButtonEnable = this.postButtonEnable;

    let commentText = '';
    if(this.enterKeyPressFlag){
      const exp = /<p[^>]*>(&nbsp;|\s+|<br\s*\/?>)*<\/p>/g;
      this.postDesc=this.postDesc.replace(exp, '');
      commentText = this.postDesc;
      this.postDesc = '';
      this.enterKeyPressFlag = false;
    }
    else{
      commentText = this.postDesc;
      this.postDesc = '';
    }
    const apiFormData = new FormData();
    this.imageFlag = 'true';

    if(this.uploadedItems != '') {
      if(this.uploadedItems.items.length>0){
        for(let a in (this.uploadedItems.items)) {
          if(this.uploadedItems.items[a].flagId == 6) {
            this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
           if(this.uploadedItems.items[a].url=='') {
              this.postButtonEnable = true;
              this.apiUrl.postButtonEnable = this.postButtonEnable;
              return false;
           }
           else{
              this.postServerErrorMsg = '';
              this.postServerError = false;
            }
          }
        }
      }
    }
    let commentTaggedUsers='';
    this.commentTaggedUsers = [];
    let techSubmmitVal = (this.techSubmmitFlag) ? '1' : '0';
    console.log( this.commentAssignedUsersList);
    if(this.commentAssignedUsersList)
    {
      if(this.commentAssignedUsersList.length>0)
      {
        for(let au in this.commentAssignedUsersList)
        {
          this.commentTaggedUsers.push(this.commentAssignedUsersList[au].email);
        }
        commentTaggedUsers=JSON.stringify(this.commentTaggedUsers);
      }
    }
    console.log(this.uploadedItems);
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0)
    {

    }
    else if(Object.keys(this.mediaAttachments).length > 0 && this.mediaAttachments.length > 0) {
    }
    else
    {

      let replyContent=[];
  let lastPostid=0;

  replyContent.push({
    postId:0,
    autoGeneratedId:autoGeneratedIdOpt,
    threadId:this.threadId,
    commentThreadId:this.threadId,
    userName:this.loginUsername,
    userId:this.userId,
    commentProfileImage:this.loginUserProfileImg,
    profileImage:this.loginUserProfileImg,
    commentUserName:this.loginUsername,
    commentUserId:this.userId,
    deleteFlag:0,
    postedFrom:'Web',
    userRoleTitle:this.loginUserRole,
    createdOnNew:new Date().toISOString().slice(0, 10)+' 00:00:00',
    uploadContents:[],
    contentWeb:commentText,
    content:commentText,
    editHistory:[],
    commentPostStatus:postStatus,
    commentPostType:postType,
    postStatus:postStatus,
    postType:postType,
    owner:this.userId,
  });
  this.updateDynamicData('comment', 'new' , lastPostid, replyContent);

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

    if(this.presetEmitFlag){
      this.mediaAttachmentsIds = [];
      if(Object.keys(this.mediaAttachments).length > 0 && this.mediaAttachments.length > 0) {
        this.mediaAttachments.forEach(item => {
          this.mediaAttachmentsIds.push(item.fileId.toString());
          autoGeneratedIdOpt=0;
        });
      }
    }

    console.log( this.commentTaggedUsers);
    //this.bodyElem.classList.add(this.bodyClass2);
    /*const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );*/

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('description', commentText);
    apiFormData.append('postType', postType);
    apiFormData.append('postStatus', postStatus);
    apiFormData.append('closeStatus', closeStatus);
    apiFormData.append('imageFlag', this.imageFlag);
    apiFormData.append('summitFix', techSubmmitVal);
    apiFormData.append('autoGeneratedId', autoGeneratedIdOpt.toString());
    apiFormData.append('taggedUsers', commentTaggedUsers);
    apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));

    apiFormData.append('platform', this.accessPlatForm);
    if(this.presetEmitFlag){
      apiFormData.append('presetId', this.presetId);
      apiFormData.append('mediaAttachments', JSON.stringify(this.mediaAttachmentsIds));
    }
    this.threadPostService.newReplyPost(apiFormData).subscribe(res => {
      //modalRef.dismiss("Cross click");
      //this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){

          if(this.presetEmitFlag){
            this.presetEmitFlag = false;
            this.presetId = '';
            this.presetContent = '';
            this.mediaAttachmentsIds = [];
            this.mediaAttachments = [];
          }
          this.commentUploadedItemsLength = 0;
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          this.commentAssignedUsersList=[];
          this.commentAssignedUsersPopupResponse=false;
          this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;

          let lastPostid = res.data.postId;
          let replyContent = res.data.replyContent;

          apiFormData.append('threadId', this.threadId);
          apiFormData.append('postId', lastPostid);

          if(uploadCount == 0) {
            this.uploadedItems = [];
            this.mediaUploadItems = [];
            this.mediaAttachments  = [];
            this.postApiData['uploadedItems'] = this.uploadedItems;
            this.postApiData['attachments'] = this.uploadedItems;
            this.postUpload = false;
            setTimeout(() => {
              this.postUploadActionTrue = true;
              this.postUpload = true;
              setTimeout(() => {
                this.postUploadActionTrue = false;
              }, 100);
            }, 100);
          }

          //console.log(Object.keys(this.uploadedItems).length);
          //console.log(this.uploadedItems.items.length );
          //console.log(uploadCount);
          console.log(this.uploadedItems);
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {

            this.postApiData['uploadedItems'] = this.uploadedItems.items;
            this.postApiData['attachments'] = this.uploadedItems.attachments;
            this.postApiData['nestedReply'] = "0";
            this.postApiData['viewpage'] = "1";
            this.postApiData['message'] = res.result;
            this.postApiData['commentId'] = lastPostid;
            this.postApiData['postId'] = lastPostid;
            this.postApiData['dataId'] = lastPostid;
            this.postApiData['threadId'] = this.threadId;
            this.postApiData['summitFix'] = techSubmmitVal;
            this.manageAction = 'uploading';

            this.postUpload = false;
            setTimeout(() => {
              this.postUploadActionTrue = true;
              this.postUpload = true;
            }, 100);

          }
          else{
             // PUSH API
             let apiData = new FormData();
             apiData.append('apiKey', Constant.ApiKey);
             apiData.append('domainId', this.domainId);
             apiData.append('countryId', this.countryId);
             apiData.append('threadId', this.threadId);
             apiData.append('parentPostId', lastPostid);
             apiData.append('userId', this.userId);
             apiData.append('action', 'comment');

             if(!this.techSubmmitFlag){


              this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

              let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', this.threadId);
              apiDatasocial.append('postId', lastPostid);
              apiDatasocial.append('userId', this.userId);
              apiDatasocial.append('action', 'replyCount');
              apiDatasocial.append('actionType', '1');
              let platformIdInfo = localStorage.getItem('platformId');

              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

              if(platformIdInfo=='3')
                {
                  this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
                }
            }


              // PUSH API
            //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            //msgModalRef.componentInstance.successMessage = res.result;
            this.postLoading = true;
            this.postFixRefresh = true;
            this.postUploadActionTrue = false;
            this.resetReplyBox(1);
            this.updateDynamicData('comment', 'new' , lastPostid, replyContent,autoGeneratedIdOpt);
            if(closeStatus == 'yes'){
              this.callThreadDetail('close');
            }
            //msgModalRef.dismiss('Cross click');
          }
        }
        else{
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
        //for(let a in (this.uploadedItems.items)) {
          /*if(this.uploadedItems.items[a].flagId == 6) {
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
          }*/
            let valid = true;
            let ui = 0;
            let eid = 'alink';
            for(let u of this.uploadedItems.attachments) {
              if(!u.valid) {
                valid = u.valid;
                if(!u.validError) {
                  eid = `empty-link-${ui}`;
                  let errLink = document.getElementById(eid);
                  errLink.classList.remove('hide');
                }
              }
              ui++;
              u.fileCaption = (u.fileCaption == '') ? u.fileCaptionVal : u.fileCaption;
            }

            if(!valid) {
              this.postSaveButtonEnable = true;
              this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
              return false;
            }

        //}
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
              this.postEditApiData['viewpage'] = "1";
              this.postEditApiData['parentPostId'] = ppId;
              this.postEditApiData['replyId'] = ppId;
            }
            else{
              this.postEditApiData['nestedReply'] = "0";
              this.postEditApiData['viewpage'] = "1";
            }
            this.postEditApiData['message'] = res.result;
            this.postEditApiData['dataId'] = postId;
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
             apiDatasocial.append('actionType', '1');
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
                //this.getThreadInfo('edit',postId,'replyedit');
                this.getPostUpdateListOld(postId,'edit','replyedit','1','','');
                let data = {
                  type1: 'replyedit',
                  type2: 'edit',
                  type3: 'edit-old',
                  postId: postId,
                  parentPostId: this.parentPostId,
                  threadId: this.threadId
                }
                this.commonApi.emitThreadDetailCommentUpdate(data);
              }
              else{
                this.resetEditReplyBox();
                let itemIndex = this.postData.findIndex(item => item.postId == postId);
                this.postData[itemIndex].postView = true;
                this.postData[itemIndex].postLoading = true;

                this.postFixRefresh = true;
                //this.getThreadInfo('edit',postId);
                this.getPostUpdateListOld(postId,'edit','','1','','');
                let data = {
                  type1: '',
                  type2: 'edit',
                  type3: 'edit-old',
                  postId: postId,
                  threadId: this.threadId,
                  parentPostId: postId,
                }
                this.commonApi.emitThreadDetailCommentUpdate(data);
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


 if(this.postData)
    {
      for (let i in this.postData) {

        console.log(this.postData[i].autoGeneratedId+'--'+autoGeneratedIdOpt+'--'+postData.postId);
        if(this.postData[i].autoGeneratedId==autoGeneratedIdOpt)
        {
          this.postData[i].commentPostId=postData.postId;
          this.postData[i].postId=postData.postId;
        }
       // this.postData[i].newComment=false;

          for (let j in this.postData[i].commentNestedReplies) {
           // this.postData[i].commentNestedReplies[j].newReply=false;
          }

      }
    }
  }
 updateDynamicData(type, ptype, pid, replyContent,autoGeneratedIdOpt=0){
  console.log(type, ptype, pid, replyContent,autoGeneratedIdOpt);
  console.log(autoGeneratedIdOpt);
let dataReply = {
    type3: 'color',
  }
  this.commonApi.emitThreadDetailCommentUpdate(dataReply);


  if(autoGeneratedIdOpt)
  {
  this.updatePostIdInfo(autoGeneratedIdOpt,replyContent[0]);
  }
  else
  {
    this.postLists = [];

    this.postLists = replyContent;
    console.log(this.postLists);
    let postAttachments = [];

    for (let i in this.postLists) {
      console.log(this.postLists[i].transText);
      if(this.translatelangId != ''){
        this.postLists[i].transText = "Translate to "+this.translatelangArray['name'];
        this.postLists[i].transId = this.translatelangId;
      }
      else{
        this.postLists[i].transText = "Translate";
        this.postLists[i].transId = this.translatelangId;
      }
      this.postLists[i].activeBorder = false;
      this.postLists[i].enableActionButton = true;
      this.postLists[i].newReply = false;
      this.postLists[i].newComment = false;
      this.postLists[i].postView = true;
      this.postLists[i].postLoading = false;
      this.postLists[i].postReplyLoading = false;

      if(type != 'replynew'){
        this.postLists[i].commentPostId = this.postLists[i].postId;
        this.postLists[i].commentThreadId = this.postLists[i].threadId;
        this.postLists[i].commentUserName = this.postLists[i].userName;
        this.postLists[i].commentProfileImage = this.postLists[i].profileImage;
        this.postLists[i].commentUserId = this.postLists[i].userId;
        this.postLists[i].commentPostStatus = this.postLists[i].postStatus;
        this.postLists[i].commentPostType = this.postLists[i].postType;
        this.postLists[i].likeStatus = 0;
        if(this.postLists[i].commentLikedUsers != undefined){
          for(let a in this.postLists[i].commentLikedUsers) {
            if(this.postLists[i].commentLikedUsers[a] == this.userId) {
              this.postLists[i].likeStatus = 1;
            }
          }
        }
        this.postLists[i].editDeleteAction = false;
        if(this.userId == this.postLists[i].userId){
          this.postLists[i].editDeleteAction = true;
        }
        this.postLists[i].commentEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
        this.postLists[i].commentDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;

      }
      if(type == 'replynew'){
        this.postLists[i].replyPostStatus = this.postLists[i].postStatus;
        this.postLists[i].replyPostType = this.postLists[i].postType;
        this.postLists[i].replyUserId = this.postLists[i].userId;
        this.postLists[i].replyUserName = this.postLists[i].userName;
        this.postLists[i].replyProfileImage = this.postLists[i].profileImage;
        this.postLists[i].replyId = this.postLists[i].postId;
        this.parentPostId = this.parentPostId;
        this.postLists[i].likeStatus = 0;
        if(this.postLists[i].replyLikedUsers != undefined){
          for(let a in this.postLists[i].replyLikedUsers) {
            if(this.postLists[i].replyLikedUsers[a] == this.userId) {
              this.postLists[i].likeStatus = 1;
            }
          }
        }
        this.postLists[i].editDeleteAction = false;
        if(this.userId == this.postLists[i].userId){
          this.postLists[i].editDeleteAction = true;
        }
        this.postLists[i].replyEditAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.edit;
        this.postLists[i].replyDeleteAction = this.postLists[i].editDeleteAction ? true : this.accessLevel.delete;

      }
      if(!this.subscriberAccess)
      {

        this.postReplyLists[i].replyEditAction=false;
        this.postReplyLists[i].replyDeleteAction=false;
      }
      this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' && this.postLists[i].userRoleTitle != undefined ? this.postLists[i].userRoleTitle : 'No Title';
      let createdOnNew = this.postLists[i].commentCreatedOn;
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

      //this.postLists[i].likeStatus = this.postLists[i].likeStatus;
      this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
      this.postLists[i].attachments = this.postLists[i].uploadContents;
      this.postLists[i].attachmentLoading = (this.postLists[i].uploadContents.length>0) ? false : true;
      postAttachments.push({
        id: this.postLists[i].postId,
        attachments: this.postLists[i].uploadContents
      });
      /*let contentWeb1 = '';
      contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].contentWeb));
      this.postLists[i].editedWeb = contentWeb1;

      let contentWeb2 = contentWeb1;
      this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2));
      */

      this.postLists[i].editedWeb = this.postLists[i].contentWeb;
      this.postLists[i].contentWeb = this.postLists[i].contentWeb;
      this.postLists[i].contentWebDuplicate = this.postLists[i].contentWeb;

      this.postLists[i].content=this.postLists[i].content;
      this.postLists[i].contentTranslate=this.postLists[i].content;

      this.postLists[i].action = 'view';
      this.postLists[i].postOwner = false;
      this.postLists[i].threadOwnerLabel = false;
      if(this.threadUserId  == this.postLists[i].userId){
        this.postLists[i].threadOwnerLabel = true;
        this.postLists[i].postOwner = true;
      }
      this.postLists[i].actionDisable = false;
      if(this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1){
        this.postLists[i].actionDisable = true;
      }

      if(!this.subscriberAccess)
      {
        this.postLists[i].actionDisable = true;

      }
      // post edit delete action
      /*this.postLists[i].editDeleteAction = false;
      if((this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
        this.postLists[i].editDeleteAction = true;
      }*/

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
    }

    console.log(this.postLists[0]);

    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));

    if(ptype == 'edit'){
      if(type == 'replyedit'){
        let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
        let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == pid);
        this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[0];
        this.postData[itemIndex1].commentNestedReplies[itemIndex2] = this.postData[itemIndex1].nestedReplies[itemIndex2];
        setTimeout(() => {
          this.postData[itemIndex1].nestedReplies[itemIndex2].enableActionButton = true;
        }, 2000);
      }
      else{
        let itemIndex = this.postData.findIndex(item => item.postId == pid);
        this.postData[itemIndex] = this.postLists[0];
        setTimeout(() => {
          this.postData[itemIndex].enableActionButton = true;
        }, 2000);
      }
    }
    else{
      setTimeout(() => {
        this.callThreadDetail('postcount');
      }, 100);
      if(type == 'replynew'){
          let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
          console.log(this.postData[itemIndex1].commentNestedReplies);
          console.log(this.postData[itemIndex1].commentNestedReplies);
          console.log(this.postData[itemIndex1].nestedReplies);

          if(this.postData[itemIndex1].commentNestedReplies != undefined){
            if(this.postData[itemIndex1].commentNestedReplies.length>0){
              this.postData[itemIndex1]['commentReplyCount'] = this.postData[itemIndex1]['commentReplyCount'] + 1;
              this.postData[itemIndex1]['replyIdArr'].push(pid);
            }
            else{
              this.postData[itemIndex1]['commentReplyCount'] = 1;
              this.postData[itemIndex1]['replyIdArr']=[];
              this.postData[itemIndex1]['replyIdArr'].push(pid);
            }
          }
          else{
            this.postData[itemIndex1]['commentReplyCount'] = 1;
            this.postData[itemIndex1]['replyIdArr']=[];
            this.postData[itemIndex1]['replyIdArr'].push(pid);
          }

          let lloadpid = this.postData[this.postData.length - 1]?.postId;
          this.postOldHeight = document.getElementsByClassName('reply-'+lloadpid)[0].clientHeight;

          this.postData[itemIndex1]['commentNestedReplies'] = [];
          this.postData[itemIndex1]['nestedReplies'] = [];

          this.postData[itemIndex1].commentNestedReplies.push(this.postLists[0]);
          this.postData[itemIndex1].nestedReplies = this.postData[itemIndex1].commentNestedReplies;

          console.log(this.postData[itemIndex1].commentNestedReplies);
          console.log(this.postData[itemIndex1].nestedReplies);
          //this.getThreadInfo('edit',this.postData[itemIndex1].nestedReplies[0].replyId,'replyedit');
          setTimeout(() => {
            this.postData[itemIndex1].commentNestedReplies[0].enableActionButton = true;
            this.postData[itemIndex1].nestedReplies[0].enableActionButton = true;
            let loadpid = this.postData[this.postData.length - 1].postId;
            if(loadpid == this.parentPostId){
              this.postNewHeight = document.getElementsByClassName('reply-'+loadpid)[0].clientHeight;
              let newht = 0;
              if(this.postNewHeight<this.postOldHeight){
                newht = this.postOldHeight * 1.47;
              }
              let ht3 = this.top.nativeElement.scrollHeight - newht;
              setTimeout(() => {
                //this.top.nativeElement.scrollTop = ht3;
                $(".threadPostcomment").animate({ scrollTop: ht3 }, "medium");
              }, 200);
              //this.moveScroll(1);
            }
          }, 500);

      }
      else{
        this.postLists[0]['commentNestedReplies'] = [];
        this.postLists[0]['nestedReplies'] = [];
        this.postLoading = false;
        let itemIndex1 = this.postData.findIndex(item => item.postId == pid);
        if (itemIndex1 < 0) {
          this.postData.push(this.postLists[0]);
        }
        setTimeout(() => {
          /*for (let i in this.postData) {
            this.postData[i].enableActionButton=true;
          }*/
          for (let i in this.postData) {
            this.postData[i].enableActionButton=true;
          }
        }, 2000);
        //this.moveScroll(1);
        let ht3 = this.top.nativeElement.scrollHeight;
       //$(".threadPostcomment").scrollTop(ht3);
       $(".threadPostcomment").animate({ scrollTop: ht3 }, "medium");
      }

    }

    /*if(this.postFixRefresh){
      //setTimeout(() => {
      this.getPostFixList();
      //}, 1);
    }*/
    localStorage.removeItem('notificationTPID');
  }

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
    this.presetEmitFlag = false;
    this.mediaAttachments = [];
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

editPostAction(postId, replyType='', ppId='',owner=''){
  if(this.apiUrl.enableAccessLevel){
    if(this.userId == owner){
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
  if(replyType == 'nested-reply'){
    for (let i in this.postData) {
      if(this.postData[i].postId == ppId){
        this.parentPostId = ppId;
        console.log(this.postData[i].nestedReplies);
        for (let j in this.postData[i].nestedReplies) {
          this.postData[i].nestedReplies[j].postView = true;
          if(this.postData[i].nestedReplies[j].postId == postId){
            this.mediaUploadItems = [];
            this.mediaAttachments = [];
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
    for (let i in this.postData) {
      this.postData[i].postView = true;
      if(this.postData[i].postId == postId){
        this.mediaUploadItems = [];
        this.mediaAttachments = [];
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

 closeThreadCallback(){
  const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.access = 'ThreadClose';
    modalRef.componentInstance.title = this.headerTitle;
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.closeThread();
      }
    });
 }
  //close thread confirm
  closeThreadConfirm(){
        if(this.apiUrl.enableAccessLevel){
          if(this.userId == this.threadUserId){
            this.authenticationService.checkAccessVal = true;
            this.closeThreadCallback();
          }
          else{
            this.authenticationService.checkAccess(2,'Close',true,true);

           setTimeout(() => {
             if(this.authenticationService.checkAccessVal){
              this.closeThreadCallback();
             }
             else if(!this.authenticationService.checkAccessVal){
               // no access
             }
             else{
              this.closeThreadCallback();
             }
           }, 550);
          }
        }
          else{
            this.closeThreadCallback();
          }


  }

  tapontagUsers(type)
  {

      if(type == 'comment'){
        if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
          this.openPost(0);
          return;
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
            this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;
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
        if(this.commentAssignedUsersList.length>0){
          this.commentAssignedUsersPopupResponse=true;
          this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;
        }
        else{
          this.commentAssignedUsersPopupResponse=false;
          this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;
        }
      }
      console.log(this.threadTaggedUsers);
      console.log(this.replyTaggedUsers);
      console.log(this.commentTaggedUsers);
      if(type == 'thread'){
        if(!receivedService.empty) {
          this.taggedUserUpdate();
        }
      }
      if(this.commentAssignedUsersList.length>0){
        this.commentAssignedUsersPopupResponse=true;
        this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;
      }
      else{
        this.commentAssignedUsersPopupResponse=false;
        this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;
      }
      modalRef.dismiss('Cross click');
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

  actionStatus(type){
    let thradIdData = [];
    thradIdData.push(this.threadId);
    switch(type){
      case 'assignme':
        this.assign(thradIdData,this.userId);
      break;
      case 'assignmember':
        this.assignMember(thradIdData);
      break;
    }
  }
  assign(thradIdData,tsuid,tsuname=''){
    const apiFormData = new FormData();
    let thradIdDataJSON = JSON.stringify(thradIdData);
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("techSupportUserId",tsuid);
    if(tsuname != ''){
      apiFormData.append("techSupportUserName",tsuname);
    }
    apiFormData.append("teamId", this.teamId);
    apiFormData.append("threadId", thradIdDataJSON);
    this.LandingpagewidgetsAPI.updateThreadTechSupportAPI(apiFormData).subscribe((response) => {
      if (response.status == "Success") {

        let apiDatasocial = new FormData();
        apiDatasocial.append('apiKey', Constant.ApiKey);
        apiDatasocial.append('domainId', this.domainId);
        apiDatasocial.append('threadId', this.threadId);
        //apiDatasocial.append('postId', postId);
        apiDatasocial.append('userId', this.userId);
        apiDatasocial.append('action', 'update');
        apiDatasocial.append('actionType', '1');
        let platformIdInfo = localStorage.getItem('platformId');
        if(platformIdInfo == '1' || platformIdInfo == '3') {
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
        }
        let apiDataPush = new FormData();
        apiDataPush.append('apiKey', Constant.ApiKey);
        apiDataPush.append('domainId', this.domainId);
        apiDataPush.append('countryId', this.countryId);
        apiDataPush.append('userId', this.userId);
        apiDataPush.append("techSupportUserId",tsuid);
        if(tsuname != ''){
          apiDataPush.append("techSupportUserName",tsuname);
        }
        apiDataPush.append("teamId", "1");
        apiDataPush.append("fromTechSupport", "1");
        apiDataPush.append("threadId", thradIdDataJSON);
        this.threadPostService.sendPushtoMobileAPI(apiDataPush).subscribe((response) => { console.log(response); });
        localStorage.setItem("tspageRefresh","1");
        this.ticketStatus = this.ticketStatus == "1" ? "2" : this.ticketStatus ;
        localStorage.setItem("tspageTS",this.ticketStatus);
        this.callThreadDetail('thread-edit');
        this.msgs1 = [{severity:'success', summary:'', detail:response.result}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.msgs1 = [];
        }, 3000);
      }
    });
  }
  assignMember(threadId)
  {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 157 );
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
      'teamId': this.teamId
    };
    let techSupportUserId=[];
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "techsupport";
    modalRef.componentInstance.accessTitle = "Member List";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = '';
    modalRef.componentInstance.selectedUsers = techSupportUserId;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if(!receivedService.empty) {
        console.log(receivedService.mId);
        console.log(receivedService.mName);
        if(receivedService.mId == this.assignedToId){
          this.msgs1 = [{severity:'success', summary:'', detail: "Already Assigned" }];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.msgs1 = [];
          }, 3000);
        }
        else{
          this.assign(threadId,receivedService.mId,receivedService.mName);
        }
      }
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

        let apiDatasocial = new FormData();
        apiDatasocial.append('apiKey', Constant.ApiKey);
        apiDatasocial.append('domainId', this.domainId);
        apiDatasocial.append('threadId', this.threadId);
        //apiDatasocial.append('postId', postId);
        apiDatasocial.append('userId', this.userId);
        apiDatasocial.append('action', 'update');
        apiDatasocial.append('actionType', '1');
        let platformIdInfo = localStorage.getItem('platformId');
        if(platformIdInfo == '1' || platformIdInfo == '3') {
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
        }
        let resultMsg = "Tagged Successfully";
        this.msgs1 = [{severity:'success', summary:'', detail:resultMsg}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.msgs1 = [];
        }, 3000);
      }
    });

  }

  feedbackSubmit(id)
  {
    if(id)
    {
      $('.feedback-id'+id+'').addClass('bg-border');
      this.closeThread(id);
    }
  }

  // thread closed
  closeThread(feedbackId=''){
    if((this.commentUploadedItemsFlag || this.commentAssignedUsersList.length>0)){
      if( this.postButtonEnable ){
        this.emptyComment = false;
        this.newPost('Comment',0,'yes');
      }
      else{
        this.emptyComment = true;
        this.setScreenHeight();
      }
    }
    else if( this.postButtonEnable ){
      this.emptyComment = false;
      this.newPost('Comment',0,'yes');
    }
    else{
      this.postServerErrorMsg = '';
      this.postServerError = true;
      this.postButtonEnable = false;
      this.apiUrl.postButtonEnable = this.postButtonEnable;
      this.continueButtonEnable = false;
      const apiFormData = new FormData();

      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('closeStatus', 'yes');
      apiFormData.append('emailFlag', '1');
      apiFormData.append('feedbackStatus', feedbackId);
      apiFormData.append('platform', this.accessPlatForm);
      if(feedbackId)
      {
        $('.feedback-id'+feedbackId+'').removeClass('bg-border');
        this.visibledealerClosePopup=false;
      }

      this.threadPostService.closeThread(apiFormData).subscribe(res => {
          if(res.status=='Success'){

              // PUSH API
              let apiData = new FormData();
              apiData.append('apiKey', Constant.ApiKey);
              apiData.append('domainId', this.domainId);
              apiData.append('countryId', this.countryId);
              apiData.append('threadId', this.threadId);
              apiData.append('silentPush', '1');
              apiData.append('action', 'close');
              apiData.append('userId', this.userId);
              this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

              let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', this.threadId);
              apiDatasocial.append('userId', this.userId);
              apiDatasocial.append('action', 'close');
              apiDatasocial.append('actionType', '1');
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
              // PUSH API
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo=='3')
            {
              this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
            }

            localStorage.setItem('closeThreadNow', 'yes');
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = res.result;
            setTimeout(() => {
              //this.getThreadInfo('refresh',0);

              this.postLoading = true;
              this.postFixRefresh = true;
              this.postUploadActionTrue = false;
              this.resetReplyBox();

              this.callThreadDetail('close');
              msgModalRef.dismiss('Cross click');
            }, 1500);
          }
          else{
            this.postButtonEnable = true;
            this.apiUrl.postButtonEnable = this.postButtonEnable;
            this.postServerErrorMsg = res.result;
            this.postServerError = true;
            this.continueButtonEnable = true;
          }
        },
        (error => {
          this.postButtonEnable = true;
          this.apiUrl.postButtonEnable = this.postButtonEnable;
          this.postServerErrorMsg = error;
          this.postServerError  = true;
          this.continueButtonEnable = true;
        })
      );
  }
 }

 // thread delete confirm
 threadDeleteConfirm(){
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'ThreadDelete';
    modalRef.componentInstance.title = this.headerTitle;
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.deleteThreadPost('thread',0);
      }
    });
 }

 postDeleteConfirm(pid, replyType='', ppId='', owner='')
{
 if(this.apiUrl.enableAccessLevel){
  if(this.userId == owner){
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


  // post delete confirm
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
      thread_id = this.threadViewData.threadId;
      post_id = this.threadViewData.postId;
    }
    else{
      if(replyType == 'nested-reply'){
        thread_id = this.threadViewData.threadId;
        post_id = id;
        parent_post_id = ppId;
      }
      else{
        thread_id = this.threadViewData.threadId;
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
          console.log(res);
          if(type == 'thread'){
            let apiData = new FormData();
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('threadId', this.threadId);
            apiData.append('silentPush', '1');
            apiData.append('action', 'thread-delete');
            apiData.append('userId', this.userId);

              if(res.observers != undefined){
                apiData.append('observers', (res.observers) );
              }

            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('actionType', '1');
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
            apiDatasocial.append('actionType', '1');

            if(replyType == 'nested-reply'){
              apiDatasocial.append('action', 'delete-reply');
              //apiDatasocial.append('action', 'replyCount');
              thread_id = this.threadViewData.threadId;
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

              thread_id = this.threadViewData.threadId;
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
              if(chkLandingRecentFlag) {}
              else{
                let data = {
                  access: 'threads',
                  action: 'silentDelete',
                  pushAction: 'load',
                  threadId: thread_id
                }
                setTimeout(() => {
                  this.commonApi.emitMessageReceived(data);
                }, 1000);
              }
              setTimeout(() => {
                localStorage.removeItem('wsNav');
                localStorage.removeItem('wsNavUrl');
                localStorage.removeItem(silentItems.silentThreadCount);
              }, 100);
            }
            else{
              this.deletePost(post_id, replyType, ppId);
              //let ht = this.top.nativeElement.scrollHeight - (this.deletePostHeight + 800);
              this.deletePostHeight = document.getElementsByClassName('pid-'+post_id)[0].clientHeight;
              console.log(this.deletePostHeight);
              setTimeout(() => {
                let ht1 = this.deletePostHeight;
                let ht2 = (this.top.nativeElement.scrollTop - ht1);
                console.log(ht1,ht2);
                setTimeout(() => {
                  this.top.nativeElement.scrollTop = ht2;
                  msgModalRef.dismiss('Cross click');
                }, 1);
                /*this.top.nativeElement.scroll({
                  top: ht,
                  left: 0,
                  behavior: 'smooth'
                });*/
              }, 1);
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

   // thread reopen
  reopenThreadAction(){
    this.postServerErrorMsg = '';
    this.postServerError = true;
    this.postButtonEnable = false;
    this.apiUrl.postButtonEnable = this.postButtonEnable;
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('notify', '0');
    apiFormData.append('platform', this.accessPlatForm);
    this.threadPostService.reopenThread(apiFormData).subscribe(res => {
      if(res.status=='Success'){

        let apiData = new FormData();
        apiData.append('apiKey', Constant.ApiKey);
        apiData.append('domainId', this.domainId);
        apiData.append('countryId', this.countryId);
        apiData.append('userId', this.userId);

        apiData.append('threadId', this.threadId);
        apiData.append('silentPush', '1');
        apiData.append('action', 'reopen')

        this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });


        let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('action', 'reopen');
            apiDatasocial.append('actionType', '1');
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = res.result;
        setTimeout(() => {
          //this.getThreadInfo('refresh',0);
          this.callThreadDetail('reopen');
          msgModalRef.dismiss('Cross click');

         /* let secElement = document.getElementById('step');
          setTimeout(() => {
            secElement.scrollTop = this.innerHeight;
          }, 1000); */

        }, 1500);
      }
      else{
        this.postButtonEnable = true;
        this.apiUrl.postButtonEnable = this.postButtonEnable;
        this.postServerErrorMsg = res.result;
        this.postServerError = true;
      }
    },
    (error => {
      this.postButtonEnable = true;
      this.apiUrl.postButtonEnable = this.postButtonEnable;
      this.postServerErrorMsg = error;
      this.postServerError  = true;
    })
  );
  }
  // Get Uploaded Items
  nestedAttachments(items) {
    this.uploadedItems = items;
    this.replyPostOnFlag2 = true;
    this.uploadReplyFlag  = true;
  }
  attachments(items) {
    if(this.uploadedItems.length>0){
      if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
        this.openPost(0);
      }
      else{
        this.replyPostOnFlag3 = true;
        this.uploadCommentFlag = true;
        this.uploadedItems = items;
      }
    }
    else{
      if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
        this.openPost(0);
      }
      else{
        this.replyPostOnFlag3 = true;
        this.uploadCommentFlag = true;
        this.uploadedItems = items;
      }
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
      this.replyPostOnFlag2 = false;
      this.replyPostOnFlag3 = false;
      this.uploadCommentFlag = false;
      this.uploadReplyFlag = false;
      this.tagReplyFlag = false;
      this.tagCommentFlag = false;
    }
  }


  dropEvent(event,tfData) {
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
      //console.log( this.postDesc);
      this.postButtonEnable = (this.postDesc != '') ? true : false;
      this.apiUrl.postButtonEnable = this.postButtonEnable;
      setTimeout(() => {
        let element = document.getElementsByClassName("thread-view-comments");
        let height = element[0].getElementsByClassName("ck-editor__editable")[0].scrollHeight;
        var heightSet = height - 55;
        //console.log(height);
        this.bodyHeight = window.innerHeight;
        let pmsgHeight = (this.apiUrl.newupdateRefresh) ? 27 : 0;
        if(this.closeStatus==1){
          this.innerHeight = (this.bodyHeight - ( 42 + pmsgHeight) );
        }
        else{
          var headerHeight = 204 + pmsgHeight;
          if(this.emptyComment){
            var headerHeight = 234 + pmsgHeight
          }
          if(height>56){
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
            this.innerHeight = (this.bodyHeight - (headerHeight) );
          }

        }
      }, 1);
    }
    else if(type=='nested-reply'){
      //this.postReplyDesc = event.htmlValue;
      //console.log( this.postReplyDesc);
      this.postReplyButtonEnable = (this.postReplyDesc != '') ? true : false;
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
    }
    else{
      //this.postEditDesc = event.htmlValue;
      //console.log( this.postEditDesc);
      this.postSaveButtonEnable = (this.postEditDesc != '') ? true : false;
      this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
    }
  }, 1);
  }


  // change desc
  /*changePostDesc(val,type){
    if(val!=null){
      if(type=='new'){
        let desc = val;
        if(desc!=''){
          if(desc.length>0){
            this.postButtonEnable = true;
          }
        }
        else{
          this.postButtonEnable = false;
        }
      }
      else{
        let desc = val;
        if(desc!=''){
          if(desc.length>0){
            this.postSaveButtonEnable = true;
          }
        }
        else{
          this.postSaveButtonEnable = false;
        }
      }
    }
  }*/

  //reset reply box
  resetReplyBox(flagNew=0){
    this.emptyComment = false;
    this.fromNotificationPageFlag = false;
    this.commentAssignedUsersList=[];
    this.commentAssignedUsersPopupResponse=false;
    this.apiUrl.tagCommentFlag = this.commentAssignedUsersPopupResponse;
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.mediaUploadItems  = [];
    this.mediaAttachments = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;


    this.imageFlag = 'false';
    if(flagNew!=1)
    {
      this.postButtonEnable = false;
      this.postDesc = '';
    }
    this.apiUrl.postButtonEnable = this.postButtonEnable;
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
      mediaAttachments: [],
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

  resetNestedReplyBox(){
    this.replyAssignedUsersList=[];
    this.replyAssignedUsersPopupResponse=false;
    this.manageAction = 'new';
    this.pageAccess = 'post';
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.mediaUploadItems  = [];
    this.mediaAttachments = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postReplyButtonEnable = false;
    this.imageFlag = 'false';
    this.postReplyDesc = '';
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
      mediaAttachments: [],
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
  }

  // delete post
  deletePost(postId, replyType='', ppId='', otherComp=''){
    if(replyType == 'nested-reply'){
      for (let i in this.postData) {
        if(this.postData[i].postId == ppId){
          this.postData[i].commentNestedReplies.forEach((element,index)=>{
            if(element.postId==postId) this.postData[i].commentNestedReplies.splice(index,1);
          });

          if(this.postData[i].replyIdArr) {
            console.log(this.postData[i].replyIdArr);
              this.postData[i].replyIdArr.forEach((element1,index1)=>{
              //console.log(postId,element1)
              if(element1==postId) this.postData[i].replyIdArr.splice(index1,1);
              });
              this.postData[i].commentReplyCount = this.postData[i].replyIdArr.length;
            console.log(this.postData[i].replyIdArr);
            console.log(this.postData[i].commentReplyCount);

            if(this.postData[i].replyIdArr.length>0) {
              let prevId =  this.postData[i].replyIdArr[this.postData[i].replyIdArr.length  - 1];
              console.log(prevId);
              this.parentPostId = ppId;
              this.deleteActionFlag = true;
              this.getPostUpdateListOld(prevId,'delete-refresh','replynew','','','reply');
            }
            else{
              if(this.postData[i].deleteFlag == "1"){
                this.postData[i].deleteFlag = "2";
                this.postDataLength = this.postDataLength - 1;
              }
            }
          }
          else{

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
        this.commonApi.emitThreadDetailCommentUpdate(dataReply);
      }
    }
    else{
        //if(this.collabticDomain){
          let length = 0;
          for (let i in this.postData) {
            if(this.postData[i].commentPostId == postId){
              length = this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;

              if(length){
                this.postData[i].deleteFlag = "1";
              }
              else{
                this.postData.forEach((element,index)=>{
                  if(element.commentPostId==postId) this.postData.splice(index,1);
                  this.postDataLength = this.postData.length;
                });
                if(this.postData.length==0){
                  this.postData =[];
                }
                this.postFixRefresh = true;
                //this.getThreadInfo('delete',0);
              }
              if(otherComp == ''){

                let dataReply = {
                  type3: 'delete',
                  replyType: replyType,
                  postId: postId,
                  parentPostId: postId,
                  threadId: this.threadId
                }
                this.commonApi.emitThreadDetailCommentUpdate(dataReply);
              }
             }
          }
        //}
        /*else{
          this.postData.forEach((element,index)=>{
            if(element.postId==postId) this.postData.splice(index,1);
          });
          this.postFixRefresh = true;
          this.getThreadInfo('delete',0);
        }*/

    }
    setTimeout(() => {
      this.setScreenHeight();
      this.callThreadDetail('postcount');
    }, 100);
  }
  // Like Action




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
                    apiData.append('commentId', ppId);
                    apiData.append('parentPostId', ppId);
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
                    apiDatasocial.append('userId', this.userId);
                    apiDatasocial.append('action', type);
                    apiDatasocial.append('actionType', '1');
                    this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                    // PUSH API
                    let data = {
                      type1: 'replyedit',
                      type2: 'edit',
                      type3: 'edit-old',
                      postId: postId,
                      parentPostId: ppId,
                      threadId: this.threadId
                    }
                    this.commonApi.emitThreadDetailCommentUpdate(data);
                    setTimeout(() => {
                      this.callThreadDetail('thread-like');
                    }, 100);
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
                apiDatasocial.append('actionType', '1');
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                // PUSH API END
                let data = {
                  type1: '',
                  type2: 'edit',
                  type3: 'edit-old',
                  postId: postId,
                  threadId: this.threadId,
                  parentPostId: postId,
                }
                this.commonApi.emitThreadDetailCommentUpdate(data);
                setTimeout(() => {
                  this.callThreadDetail('thread-like');
                }, 100);
              }
            });
          }
        }
      }
    }
  }

  // reminder Thread
  remainderThread(){
    const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.reminderPOPUP = "Reminder";
    modalRef.componentInstance.threadId = this.threadId;
    modalRef.componentInstance.mediaServices.subscribe((receivedService) => {
      if(receivedService){
        modalRef.dismiss('Cross click');
        console.log(receivedService);
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = receivedService.result;

        // PUSH API
        let reminderId= receivedService.reminderId;
        let apiData = new FormData();
        apiData.append('apiKey', Constant.ApiKey);
        apiData.append('domainId', this.domainId);
        apiData.append('countryId', this.countryId);
        apiData.append('userId', this.userId);
        apiData.append('threadId', this.threadId);
        apiData.append('reminderId', reminderId);
        apiData.append('platform', this.accessPlatForm);
        this.threadPostService.sendReminderAPI(apiData).subscribe((response) => { console.log(response); });
        // PUSH API

        setTimeout(() => {
          msgModalRef.dismiss('Cross click');
          this.getThreadInfo('reminder',0);
        }, 1000);
      }
    });
  }

  // tech summit Thread
  techSummitScore(){
    const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.reminderPOPUP = "TechSummitScore";
    modalRef.componentInstance.groups = this.groups;
    modalRef.componentInstance.threadId = this.threadId;
    modalRef.componentInstance.mediaServices.subscribe((receivedService) => {
      if(receivedService){
        modalRef.dismiss('Cross click');
        console.log(receivedService);
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = "Score Updated!";
        setTimeout(() => {
          //this.getThreadInfo('refresh',0);
          msgModalRef.dismiss('Cross click');
          if(this.teamSystem) {
            //this.loading = true;
            window.open('threads', IsOpenNewTab.teamOpenNewTab);
          } else {
            window.close();
            window.opener.location.reload();
          }
        }, 1500);
      }
    });
  }

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

  // select scroll name
  setActivePosition(id) {
    if(id=='bottom'){
      this.top.nativeElement.scrollTop = this.top.nativeElement.scrollHeight;
      /*this.top.nativeElement.scroll({
        top: this.top.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });*/
      if(this.pageRefresh){
        this.tabonPageRefresh('1');
      }
    }
    else{
      this.top.nativeElement.scrollTop = 0;
      /*this.top.nativeElement.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });*/
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
      if(this.commentNotifyRead){
        setTimeout(() => {
          this.removeNotifications();
          this.commentNotifyRead = false;
        }, 1);
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
  threadHeaderAction(data){
    console.log(data)
    this.searchFilterRef = data.searchFilterData;
    let action = data.action;
    console.log(data, this.threadId, this.threadRecentRef)
    switch(action) {
      case 'search':
        let keyword = data.keyword;  
        let searchKeyword = (this.threadRecentRef) ? this.threadRecentRef.searchKeyword : '';
        let loadFlag = (data.initFlag || data.filterFlag || (keyword != '' || (keyword == '' && searchKeyword != '')) && keyword != searchKeyword) ? true : false;
        if(loadFlag) {
          if(this.detailViewRef) {
            this.detailViewRef.searchLoading = true;
          }
          if(this.threadRecentRef) {
            this.threadRecentRef.loading = true;
          }

          let pinnedUser = [this.userId];
          this.threadRecentRef.threadFilters["pinedUsers"] = (data.pinStatus == 1) ? pinnedUser : [];
          let dataFilter = data.filter[0];
          Object.keys(dataFilter).forEach(key => {
            let filterVal = dataFilter[key];
            this.threadRecentRef.threadFilters[key] = filterVal;
          });
          console.log(this.threadRecentRef.threadFilters)

          this.threadRecentRef.searchKeyword = keyword;
          this.threadRecentRef.itemOffset = 0;
          this.threadRecentRef.threadListArray = [];
          this.threadRecentRef.loadThreadsPageSolr();
          if(keyword == '') {
            this.emptyListFlag = false;
            this.route.params.subscribe( params => {
              this.threadId = params.id;
            });
            setTimeout(() => {
              this.getThreadInfo('taponload','');
            }, 100);
          }
        }
        break;
      case 'load-thread':
        this.threadId = data.threadId;
        setTimeout(() => {
          this.getThreadInfo('taponload','');
          if(this.detailViewRef) {
            this.detailViewRef.searchLoading = true;
          }
          if(this.threadRecentRef) {
            this.threadRecentRef.loading = true;
          }
          let tindex = this.threadRecentRef.threadListArray.findIndex(option => option.threadId == this.threadId);
          if(tindex < 0) {
            let pushthread = '1';
            let limit = '';
            this.threadRecentRef.loadThreadsPageSolr(pushthread,limit='',this.threadId);
          } else {
            this.threadRecentRef.setupThreadActive(this.threadId);            
          }
        }, 100);
        break;
      case 'feedback':
        this.setupFeedbackForm();
        setTimeout(() => {
          this.feedbackFormFlag = true;  
        }, 100);        
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

  //ppfrForm
  ppfrForm(){
    if(!this.TVSIBDomain){
      localStorage.setItem('ppfrValues',  JSON.stringify(this.ppfrPopVal));
      let url = "ppfr/manage";
      if (this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        //window.open(url, IsOpenNewTab.openNewTab);
        window.open(url, url);
        //window.open(url, '_blank');
      }
    }
    else{
      let url = "ppfr/form";
      window.open(url, url);
    }
  }
  tapRedDotAction(){

   let rdpostId =  localStorage.getItem("notificationPOID");
   let rdparentPostId =  localStorage.getItem("notificationPPOID");
   let rdactype =  localStorage.getItem("notificationACTYPE");

    if(document.getElementById('notify-'+rdpostId) != undefined){
      let nst1 = document.getElementById('notify-'+rdpostId).offsetTop;
      this.top.nativeElement.scrollTop =  nst1 - 200;
      for (let i in this.postData) {
        if(this.postData[i].commentPostId == rdpostId){
          return;
        }
        else{
          for (let j in this.postData[i].commentNestedReplies) {
            if(this.postData[i].nestedReplies[j].replyId == rdpostId){
              return;
            }
          }
        }
      }
      console.log(nst1);
    }
    else{
      if(rdactype == 'comment'){
        setTimeout(() => {
          this.getThreadInfo('taponload',rdpostId,'','comment');
        }, 2000);

      }
      else{
        console.log(rdactype);

        if(rdactype == 'reply')
        {
          setTimeout(() => {
            this.getThreadInfo('taponload',rdpostId,'','reply');
          }, 2000);
        }

      }
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

  removeNotifications(type='')
  {
    type = type == '' ? 'threadData': 'newThread';
    console.log(this.arrayPushPostIds);

if(this.arrayPushPostIds && this.arrayPushPostIds.length>0 && !this.replyPush)
{
  for(let n1 in this.arrayPushPostIds)
  {

    let dataDelete = new FormData();
    dataDelete.append('apiKey', Constant.ApiKey,);
    dataDelete.append('userId', this.userId);
    dataDelete.append('domainId', this.domainId);
    dataDelete.append('type', type);
    dataDelete.append('action', 'clear');

    dataDelete.append('postId', this.arrayPushPostIds[n1]);
    dataDelete.append('threadId', this.threadId)

    this.LandingpagewidgetsAPI.readandDeleteNotification(dataDelete).subscribe(() => { });
  }

  this.commentNotifyRead = false;
  this.arrayPushPostIds=[];

}
else{
 if(type == 'newThread'){
  let dataDelete = new FormData();
    dataDelete.append('apiKey', Constant.ApiKey,);
    dataDelete.append('userId', this.userId);
    dataDelete.append('domainId', this.domainId);
    dataDelete.append('type', type);
    dataDelete.append('action', 'clear');
    dataDelete.append('threadId', this.threadId)

    this.LandingpagewidgetsAPI.readandDeleteNotification(dataDelete).subscribe(() => { });
    localStorage.removeItem('newThread');
 }
}

localStorage.removeItem('notificationTPID')
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

  tabonPageRefresh(fromPush=''){

if(this.arrayPushPostIds.length==1 && this.replyPush)
{
  setTimeout(() => {
    this.moveScrollNotify(this.arrayPushPostIds[0]);
    this.pageRefresh = false;
    this.replyPush = false;
    this.removeNotifications();
  }, 500);
}
else
{


    if(fromPush)
    {
      this.fromNotificationPageFlag = true;
      this.moveScroll(1);
      setTimeout(() => {
        this.pageRefresh = false;
      }, 100);
    }
    else
    {
      this.fromNotificationPageFlag = true;
      this.getThreadInfo('notification','');
      this.postNotificationCount = 0;
      setTimeout(() => {
        this.pageRefresh = false;
      }, 100);
    }
  }
  }

  attachmentPopup(val = 0,type) {
    let postId = val;
    if(type=='new'){
      postId = 0;
    }
    console.log(this.uploadedItems);
    let fitem = [];
    let mitem = [];
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

    if(this.presetEmitFlag){
      mitem = this.mediaAttachments;
    }

    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.mediaAttachments = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.presetAttchmentItems = mitem;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {
      console.log(receivedService.uploadedItems);
      if(receivedService){
        this.uploadedItems = receivedService.uploadedItems;
        this.mediaAttachments = receivedService.presetAttachments;
        if(this.presetEmitFlag){
          let uploadCount = (this.uploadedItems == '') ? 0 : parseInt(this.uploadedItems.items.length);
          let presetUploadCount = parseInt(this.mediaAttachments.length);
          this.commentUploadedItemsLength = uploadCount + presetUploadCount;
          this.commentUploadedItemsFlag = this.commentUploadedItemsLength > 0 ? true : false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
        }
        else{
          if(this.uploadedItems != '') {
            if(this.uploadedItems.items.length>0){
              this.commentUploadedItemsLength = this.uploadedItems.items.length;
              this.commentUploadedItemsFlag = true;
              this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
            }
            else{
              this.commentUploadedItemsLength = 0;
              this.commentUploadedItemsFlag = false;
              this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
            }
          }
          else{
            this.commentUploadedItemsLength = 0;
            this.commentUploadedItemsFlag = false;
            this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          }
        }

      }
      else{
        if(this.presetEmitFlag){
          let uploadCount = (this.uploadedItems == '') ? 0 : parseInt(this.uploadedItems.items.length);
          let presetUploadCount = parseInt(this.mediaAttachments.length);
          this.commentUploadedItemsLength = uploadCount + presetUploadCount;
          this.commentUploadedItemsFlag = this.commentUploadedItemsLength > 0 ? true : false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
        }
        else{
          if(this.uploadedItems.items.length>0){
            this.commentUploadedItemsLength = this.uploadedItems.items.length;
            this.commentUploadedItemsFlag = true;
            this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          }
          else{
            this.commentUploadedItemsLength = 0;
            this.commentUploadedItemsFlag = false;
            this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
          }
        }
      }
     // this.apiUrl.attachmentNewPOPUP = false;
      modalRef.dismiss('Cross click');

    });
  }

   // header event tab/click
   threadViewRecentAction(event){

    console.log(event);
    if(event.domainId && this.subscriberDomain)
    {
      this.domainId=event.domainId;
    }

      if(this.commentUploadedItemsFlag || this.postButtonEnable ||this.commentAssignedUsersList.length>0){
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'Cancel';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          if(!receivedService) {
            let dataid = {
              threadId : this.threadId
            }
            this.commonApi.emitThreadDetailRecentIdData(dataid);
            return;
          } else {
            this.threadId=event.threadId;

            this.threadViewData=[];
            this.postFixData=[];
            this.postFixDataLength=0;
            this.commentUploadedItemsLength = 0;
            this.commentUploadedItemsFlag = false;
            this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
            this.pageRefresh = false;
            this.presetId = '';
            this.presetContent = '';
            this.presetEmitFlag = false;
            this.mediaAttachments = [];
            this.mediaAttachmentsIds = [];
            this.resetReplyBox();
            this.checkAccessLevel();
            this.getThreadInfo('taponload','');
           // this.nloading = true;
            //this.commonApi.ThreadDetailCommentData('');
          }
       });
      }
      else{
        let getRecentView = localStorage.getItem('landingRecentNav');
        //alert(event.threadId);
        this.threadId=event.threadId;
        this.threadViewData=[];
        this.postFixData=[];
        this.postFixDataLength=0;
        this.commentUploadedItemsLength = 0;
        this.commentUploadedItemsFlag = false;
        this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
        this.resetReplyBox();
        this.checkAccessLevel();
        this.pageRefresh = false;
        /* if(event.position=='bottom')
        {
          this.callThreadDetail('thread-like');
        } */
        this.getThreadInfo('taponload','','',event.position);
        //this.nloading = true;
        //this.commonApi.ThreadDetailCommentData('');
      }

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

   openPresetPOPUP(type){
    this.bodyElem.classList.add("presets-popup");
    const modalRef = this.modalService.open(PresetsManageComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.presetType = type;
    modalRef.componentInstance.presetId = this.presetId;
    modalRef.componentInstance.presetsServices.subscribe((receivedService) => {
      console.log(receivedService.action) ;
      if(receivedService.action){
        this.presetId = receivedService.presetData.id;
        this.presetContent = receivedService.presetData.contentEmit;
        this.postDesc = this.presetContent;
        if(receivedService.presetData.uploadContents.length>0){
          this.mediaAttachments = receivedService.presetData.uploadContents;
          console.log(this.mediaAttachments);
        }
        this.presetEmitFlag = true;
        let uploadCount = (this.uploadedItems == '') ? 0 : parseInt(this.uploadedItems.items.length);
        let presetUploadCount = parseInt(this.mediaAttachments.length);
        this.commentUploadedItemsLength = uploadCount + presetUploadCount;
        this.commentUploadedItemsFlag = this.commentUploadedItemsLength > 0 ? true : false;
        this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
      }
      else{
       /* this.presetId = '';
        this.presetContent = '';
        this.presetEmitFlag = false;
        this.mediaAttachments = [];
        let uploadCount = (this.uploadedItems == '') ? 0 : parseInt(this.uploadedItems.items.length);
        let presetUploadCount = parseInt(this.mediaAttachments.length);
        this.commentUploadedItemsLength = uploadCount + presetUploadCount;
        if(this.commentUploadedItemsLength>0){
          this.commentUploadedItemsFlag = true;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
        }
        else{
          this.commentUploadedItemsFlag = false;
          this.apiUrl.uploadCommentFlag = this.commentUploadedItemsFlag;
        }*/
      }
      this.bodyElem.classList.remove("presets-popup");
      modalRef.dismiss('Cross click');
    });
  }

  detailHeaderCallback(data) {
    console.log(data)
    this.threadDetailHeaderRef = data;
  }

  detailViewCallBack(data) {
    console.log(data)
    this.detailViewRef = data;
    this.moreInfoFlag = data.moreInfo;
    this.detailInfo = data.vinDetails;
    setTimeout(() => {
      if(this.threadRecentRef) {
        let tindex = this.threadRecentRef.threadListArray.findIndex(option => option.threadId == this.detailViewRef.threadId);
        if(tindex < 0) {
          let pushthread = '1';
          let limit = '';
          this.threadRecentRef.loadThreadsPageSolr(pushthread,limit='',this.threadId);
          setTimeout(() => {
            this.loading = false;  
          }, 500);        
        } else {
          if(!data.searchLoading) {
            //this.loading = false;
          }
          this.loading = false;
        }  
      }
    }, 100);
  }

  threadRecentCallBack(data) {
    console.log(data)
    this.threadRecentRef = data;
    if(!this.threadRecentRef.loading) {
      this.emptyListFlag = (this.threadRecentRef.threadListArray.length == 0) ? true : false;
      console.log(this.threadRecentRef.itemLimit, this.threadRecentRef.itemOffset)
      if(this.threadRecentRef.itemLimit > 10 && this.threadRecentRef.itemOffset == this.threadRecentRef.itemLimit) {
        let total = this.threadRecentRef.itemTotal;
        if(total > 1) {
          let sfr = this.searchFilterRef;
          total = this.commonApi.numberWithCommasThreeDigit(total.toString());
          sfr.searchPlacehoder = '';
          sfr.searchFixesCount = total;
          sfr.searchPlacehoder = `${sfr.searchFromText} ${sfr.searchFixesCount} ${sfr.fixesText}`;
        }        
      }
      setTimeout(() => {
        this.setupSearchFilter();  
      }, 500);
      if(this.detailViewRef && !this.detailViewRef.searchLoading) {
        //this.loading = false;
      }
      this.loading = false;
    }
    if(this.detailViewRef) {
      this.detailViewRef.searchLoading = false;
    }    
  }

  setupSearchFilter() {
    let sfr = this.searchFilterRef;
    let facets = this.threadRecentRef.facetsData;
    if(!Array.isArray(facets)) {
      let clearFilterFlag = false;
      sfr.oemDisable = false;
      sfr.makeDisable = false;
      sfr.modelDisable = false;
      sfr.yearDisable = false;
      sfr.oemList = [];
      sfr.makeList = [];
      sfr.modelList = [];
      sfr.yearList = [];
      facets.manufacturer.forEach(oitem => {
        let oemVal = oitem.value;
        sfr.oemList.push({id: oemVal, name: oemVal});
        if(facets.manufacturer.length == 1) {
          clearFilterFlag = true;
          this.threadRecentRef.threadFilters['manufacturer'] = oemVal;
          sfr.oemVal = oemVal;
          sfr.searchFilter[0]['manufacturer'] = oemVal;
        }
      });
      facets.make.forEach(mkItem => {
        let makeVal = mkItem.value;
        sfr.makeList.push({id: makeVal, name: makeVal});
        if(facets.make.length == 1) {
          clearFilterFlag = true;
          this.threadRecentRef.threadFilters['make'] = makeVal;
          sfr.makeVal = makeVal;
          sfr.searchFilter[0]['make'] = makeVal;
        }
      });
      facets.model.forEach(mitem => {
        let modelVal = mitem.value;
        sfr.modelList.push({id: modelVal, name: modelVal});
        if(facets.model.length == 1) {
          clearFilterFlag = true;
          this.threadRecentRef.threadFilters['model'] = [modelVal];
          sfr.modelVal = modelVal;
          sfr.searchFilter[0]['model'] = [modelVal];
        }
      });
      facets.year.forEach(yitem => {
        let yearVal = yitem.value;
        sfr.yearList.unshift({id: yearVal, name: yearVal});
        if(facets.year.length == 1) {
          clearFilterFlag = true;
          this.threadRecentRef.threadFilters['year'] = [yearVal];
          sfr.yearVal = yearVal;
          sfr.searchFilter[0]['year'] = [yearVal];
        }
      });
      if(clearFilterFlag) {
        sfr.clearFlag = true;
      }
    }
  }

  closeSidebar(action) {
    switch (action) {
      case 'more-info':
        this.moreInfoFlag = false;
        this.detailViewRef.moreInfo = false;    
        break;
      default:
        this.feedbackFormFlag = false;
        break;
    }
    
  }

  getFeedbackFields() {
    let apiData = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId
    };
    this.commonApi.getFeedbackFields(apiData).subscribe((response) => {
      this.feedbackFields = response.data;
      setTimeout(() => {
        this.setupFeedbackForm();  
      }, 100);      
    });        
  }

  setupFeedbackForm() {
    this.feedbackLoading = false;
    this.feedbackFormValid = false;
    this.feedbackFormSubmit = false;
    this.feedbackSucess = "";
    this.feedbackFields.forEach((fItem, tfIndex) => {
      let required = fItem.isRequired;
      let fieldName = fItem.fieldName;
      let val = '';
      fItem.selectedValue = '';
      if(fItem.fieldType == 'radio') {
        fItem.selectionItems.forEach(sitem => {
          sitem.isChecked = 0;
        });
      }
      this.feedbackForm.addControl(fieldName, new FormControl(val));
      this.setFormValidation(required, fieldName);
    });
    setTimeout(() => {
      console.log(this.feedbackForm.controls)
    }, 1500);
  }

  // Set Form Validation
  setFormValidation(flag, field) {
    if(flag) {
      this.feedbackForm.controls[field].setValidators([Validators.required]);
    }
  }

  onEditorChange(field, item, { editor }: ChangeEvent) {
    let value = editor.getData();
    console.log(value)
    item.selectedValue = value;
    item.valid = (value?.length > 0 || !item.isRequired) ? true : false;
  }

  onChange(field, item, event, optIndex = -1) {
    console.log(field, item, event, optIndex);
    let value = (item.fieldType == 'radio') ? event.target.checked : event;
    if(item.fieldType == 'radio') {
      item.selectionItems.forEach((sitem, sindex) => {
        sitem.isChecked = (sindex == optIndex) ? true : false;
        if(sindex == optIndex) {
          value = sitem.id;
        }
      });
    }
    item.selectedValue = value;
    item.valid = (value?.length > 0 || !item.isRequired) ? true : false;
  }

  saveData() {
    let submitFlag = true;
    if(this.feedbackFormValid) {
      submitFlag = false;
      return false;
    }
    this.feedbackFormSubmit = true;
    this.feedbackFields.forEach(feedbackField => {
      feedbackField.valid = (feedbackField.selectedValue != '') ? true : feedbackField.valid;
      if(feedbackField.isRequired && !feedbackField.valid) {
        submitFlag = false;
        return false;
      }      
    });
    if(submitFlag) {
      let feedbackFieldData: any = [];
      this.feedbackFields.forEach(fItem => {
        let fieldId = fItem.fieldId;
        let fieldValue:any = fItem.selectedValue.toString();
        feedbackFieldData.push({fieldId, fieldValue})
      });
      console.log(feedbackFieldData);
      let formData = new FormData();
      formData.append('apikey', Constant.ApiKey);
      formData.append('domainId', this.domainId);
      formData.append('userId', this.userId);
      formData.append('feedbackValues', JSON.stringify(feedbackFieldData));
      formData.forEach((value,key) => {
        console.log(key+" "+value)
        return false
      }); 
      this.feedbackLoading = true;
      this.feedbackFormValid = true;
      this.commonApi.manageFeedback(formData).subscribe((response) => {
        console.log(response)
        this.feedbackLoading = false;
        this.feedbackFormFlag = false;
        this.feedbackSucess = response.message;        
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = this.feedbackSucess;
        setTimeout(() => {
          this.feedbackLoading = false;
          this.feedbackFormValid = false;
          this.feedbackFormSubmit = false;
          this.feedbackSucess = "";
          msgModalRef.dismiss('Cross click');
        }, 2000);
      });
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
    let navFromWS = localStorage.getItem('wsNav');
    if(navFromWS) {
      localStorage.removeItem('wsNav');
    }
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