import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common/common.service';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant,PlatFormType,statusOptions, forumPageAccess, IsOpenNewTab, ManageTitle, pageTitle, RedirectionPage, silentItems, windowHeight,AttachmentType} from '../../../../common/constant/constant';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { ThreadPostService } from '../../../../services/thread-post/thread-post.service';
import { ApiService } from '../../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../../components/common/submit-loader/submit-loader.component';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../../services/thread/thread.service';
import { AddLinkComponent } from '../../../../components/common/add-link/add-link.component';
import { ThreadDetailHeaderComponent } from 'src/app/layouts/thread-detail-header/thread-detail-header.component';
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
import * as ClassicEditor from "src/build/ckeditor";
import { PresetsManageComponent } from 'src/app/components/common/presets-manage/presets-manage.component';
declare var $: any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [MessageService]
})
export class ViewComponent implements OnInit,  OnDestroy{

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
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyClass2: string = "submit-loader";
  public bodyElem;
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
  public innerHeightNew: number;
  public innerHeightLtNew: number;
  public bodyHeight: number;
  public industryType: any = [];
  public viewThreadInterval: any;
  public parentPostId;
  public postReplyDesc: string= '';
  public postReplyDescEditor: boolean = false;
  public newThreadView: boolean = false;

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
  public tvsdealerCode: string= '';

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
  public approvalEnableDomainFlag: boolean = false;
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
  public noReplyAccess: boolean = false;
  public noCloseAccess: boolean = false;
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
  public emptyComment: boolean = false;

  public presetFlag: boolean = false;
  public presetId;
  public presetEmitFlag = false;
  public presetContent;
  public presetAttachmentsIds: any = [];
  public presetAttachments: any = [];
  public presetAttachmentAction: 'attachments';
  public presetPageAccess = "presets";
  public presetAttachmentsFlag: boolean = false;

  public Editor = ClassicEditor;
  configCke: any = {
    toolbar: {
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

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private titleService: Title,
    private route: ActivatedRoute,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
     private httpClient:HttpClient,
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
    if(messageBody)
  {


   this.messageService.add({key: 'c',severity:'custom', summary: resdata, detail: messageBody,life: 5000});
  }
   //this.messageData.push({key: 'c',severity:'custom', summary: resdata, detail: messageBody,sticky: true});

    //this.messageService.add({key: 'c',severity:'custom', summary: resdata, detail: messageBody,sticky: true});


    //this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
}

tapontoast(data)
  {
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

        if(currUrl[3] == data.threadId){
          let data1 = {
            actionType: data.actionType,
            actionName: data.actionName,
            postId: data.postId,
          }
          console.log(data1);
          this.commonApi.emitPostDataNotification(data1);
        }


      }

  }
   ngOnInit(): void {
    localStorage.removeItem('view-v2');
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    let url = RedirectionPage.Threads;
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
    localStorage.removeItem(pageDataInfo);
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
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
    this.route.params.subscribe( params => {
      this.threadId = params.id;
      if(Object.keys(params).length > 1) {
        let item = `${this.threadId}-new-tab`;
        localStorage.setItem(item, item);
      }
    });

    this.navUrl = "/threads/view/"+this.threadId;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.teamMemberId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');
    this.manageAction = 'new';
    this.pageAccess = 'post';

    this.approvalEnableDomainFlag = localStorage.getItem('shareFixApproval') == '1' ? true : false;
    this.collabticDomain = (this.platformId=='1') ? true : false;
    this.knowledgeDomain = (this.platformId=='1' && this.domainId == '165') ? true : false;
    this.TVSDomain = (this.platformId=='2' && this.domainId == '52') ? true : false;
    this.TVSIBDomain = (this.platformId=='2' && this.domainId == '97') ? true : false;
    //this.enableTagFlag = this.platformId=='2' || this.platformId=='1' || this.platformId=='3' ? true : false;
    this.CBADomain = (this.platformId == PlatFormType.CbaForum || this.platformId == PlatFormType.Collabtic || this.platformId == PlatFormType.MahleForum) ? true : false;
    this.CBADomainOnly = (this.platformId == PlatFormType.CbaForum) ? true : false;
    let businessRole = localStorage.getItem('businessRole') != null ? localStorage.getItem('businessRole') : '' ;
 
    this.businessRoleFlag = (businessRole == '6' ) ? true : false;

    this.techSupportFlag = localStorage.getItem('wsNavUrl') == 'techsupport' ? true : false;
    if(this.businessRoleFlag && this.CBADomain && this.techSupportFlag ){
      this.ticketStatus = localStorage.getItem("tspageTS");

      //this.newLeftCol = true;
    }
    if(this.businessRoleFlag)
      {
        this.techSupportFlag=true;
      }

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
    this.title = `${title} #${this.threadId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

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

    this.commonApi.emitNotificationDataSubject.subscribe((data) => {
      console.log(data);
      this.showNotification(data);
      this.postNotificationCount = this.postNotificationCount + 1;
      console.log(this.postNotificationCount);
      console.log(data['postId']);
      console.log(data['threadId']);
     let notificationTPID= localStorage.getItem('notificationTPID');
      if(data['threadId'] == this.threadId){
        if(this.postNotificationCount>0 && (data['postId']!='undefined' || data['postId']!=undefined) &&  notificationTPID!=data['postId']){
          let bottom = this.isUserNearBottomorlastreply();
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
          console.log(this.postReplyDesc+'--'+this.postDesc+'--'+this.replyTaggedUsers+'--'+uploaFlag+'--'+this.commentTaggedUsers);
    if(bottom && (this.postReplyDesc==null || this.postReplyDesc=='') && (this.postDesc==null || this.postDesc=='')  && this.replyTaggedUsers.length==0 && !uploaFlag && this.commentTaggedUsers.length==0)
    {

      this.tabonPageRefresh();

    }
    else
    {
      this.pageRefresh = true;
    }
          //this.newText = "NEW ("+this.postNotificationCount+") ";


        }
      }
    });


    this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
      this.rightPanel = JSON.parse(flag);
    });

    this.bodyHeight = window.innerHeight;
    setTimeout(() => {
      this.setScreenHeight();
    }, 2000);


    this.getUserProfile();

    this.getThreadInfo('init',0);
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
    this.commonApi.postDataNotificationReceivedSubject.subscribe((response) => {
      setTimeout(() => {
        console.log(response);
        this.fromNotificationPageFlag = true;
        this.getThreadInfo('notification','');
        setTimeout(() => {
          this.pageRefresh = false;
        }, 100);
        this.postNotificationCount = 0;
      }, 1);
    });
    this.commonApi.postDataReceivedSubject.subscribe((response) => {
      setTimeout(() => {
        let action = response['action'];
        console.log(action);
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
            this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
            this.apiUrl.tagCommentFlag = this.tagCommentFlag;
            this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
            this.apiUrl.tagReplyFlag = this.tagReplyFlag;
            this.uploadedItems = [];
            if(response['nestedReply'] == "1"){
              this.nestedPostApiData['uploadedItems'] = this.uploadedItems;
              this.nestedPostApiData['attachments'] = this.uploadedItems;
              this.nestedPostUpload = false;
              setTimeout(() => {
                this.nestedPostUpload = true;
              }, 100);
              let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
              this.postData[itemIndex1].postReplyLoading = true;
              this.moveScroll(this.parentPostId);
              this.postData[itemIndex1].postNew = false;
              this.postFixRefresh = true;
              this.resetNestedReplyBox();
              this.getThreadInfo('refresh',response['postId'],'replynew');
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
              this.getThreadInfo('refresh',response['postId']);
            }
            break;
          case 'post-edit':
            this.resetEditReplyBox();
            if(response['nestedReply'] == "1"){
              this.parentPostId = response['parentPostId'];
              let itemIndex1 = this.postData.findIndex(item => item.postId == response['parentPostId']);
              let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == response['postId']);
              this.postData[itemIndex1].nestedReplies[itemIndex2].postReplyLoading = true;
              this.moveScroll(response['parentPostId']);
              this.postData[itemIndex1].nestedReplies[itemIndex2].postView = true;
              this.postFixRefresh = true;
              this.getThreadInfo('edit',response['postId'],'replyedit');
            }
            else{
              for (let i in this.postData) {
                this.postData[i].postView = true;
              }
              this.postData[this.currentPostDataIndex].postLoading = true;

              this.postFixRefresh = true;
              this.getThreadInfo('edit',response['postId']);
            }
            break;
        }
      }, 1000);
    });
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
    this.threadPostService.AtomicUpdateSolr(apiFormData).subscribe(res => {

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

  getThreadInfo(initVal,pid,type=''){
  if(initVal == 'init') {
    this.loading = true;
  }
  if(this.fromNotificationPageFlag){
    this.nloading = true;
  }
  this.platformId=localStorage.getItem('platformId');
  this.threadViewErrorMsg = '';
  this.threadViewError = false;
  const apiFormData = new FormData();

  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('threadId', this.threadId);
  apiFormData.append('platformId', this.platformId);
  apiFormData.append('platform', this.accessPlatForm);
  if(this.businessRoleFlag && (this.CBADomain || this.collabticDomain) && this.techSupportFlag ){
    apiFormData.append('teamId', this.teamId);
    apiFormData.append('teamMemberId', this.teamMemberId);
    apiFormData.append('ticketStatus', this.ticketStatus);
    apiFormData.append("fromTechSupport", "1");
  }

  this.threadPostService.getthreadDetailsios(apiFormData).subscribe(res => {

    if(res.status=='Success'){

      let apiDatasocial = new FormData();
          apiDatasocial.append('apiKey', Constant.ApiKey);
          apiDatasocial.append('domainId', this.domainId);
          apiDatasocial.append('threadId', this.threadId);
          apiDatasocial.append('userId', this.userId);
          apiDatasocial.append('action', 'view');
          let platformIdInfo = localStorage.getItem('platformId');

          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

          let defaultAccessLevel : any = {create: 1, delete: 1, edit: 1, reply: 1, view: 1};
      this.accessLevel = (this.apiUrl.enableAccessLevel) ? res.accesslevel : defaultAccessLevel;
      if(this.collabticDomain || this.CBADomain){
        this.noReplyAccess = this.accessLevel.reply == 0 ? true : false;
        this.noCloseAccess = this.accessLevel.close == 0 ? true : false;
      }
      else{
        this.noReplyAccess = false;
        this.noCloseAccess = false;
      }
      let url = RedirectionPage.Threads;
      let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
      let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
      this.threadViewData = res.data.thread[0];

      this.threadViewData.threadTitleTranslate = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadTitle));
      this.threadViewData.contentTranslate = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.content));
      if(this.TVSDomain){
        this.threadViewData.actionTakenTranslate = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.actionTaken));
        this.threadViewData.customerVoiceTranslate = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.customerVoice));
      }
      if(this.CBADomainOnly){
        this.threadViewData.teamAssistTranslate = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.teamAssist));
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
        this.threadViewData.teamAssist=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.teamAssist));
        this.threadViewData.teamAssist = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.threadViewData.teamAssist));
      }
      this.threadViewData.threadTitleDuplicate = this.threadViewData.threadTitle;
      this.threadViewData.contentDuplicate = this.threadViewData.content;
      if(this.TVSDomain){
        this.threadViewData.actionTakenDuplicate = this.threadViewData.actionTaken;
        this.threadViewData.customerVoiceDuplicate = this.threadViewData.customerVoice;
      }
      if(this.CBADomainOnly){
        this.threadViewData.teamAssistDuplicate = this.threadViewData.teamAssist;
      }
      let shareFixDesc = '';
      console.log(this.threadViewData.threadDescFix);
      if(this.threadViewData.threadDescFix)
      {
        shareFixDesc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadDescFix));
        this.threadViewData.threadDescFix = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(shareFixDesc));
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
      console.log(initVal)
      if(initVal != 'init') {
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
      this.threadViewData.buttonTop = (this.buttonTop) ? true : false;
      this.threadViewData.buttonBottom = (this.buttonBottom) ? true : false;
      this.threadViewData.industryType = this.industryType;

      this.threadAssignedUsersList = [];
      this.threadAssignedUsersListNew = [];

      if((this.businessRoleFlag && this.CBADomain && this.techSupportFlag)  || (this.CBADomain && this.domainId=='82')){

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
        this.assignedToId =  this.threadViewData.assignedToId;

        if(this.businessRoleFlag)
      {
        if(this.threadViewData.closeStatus && this.assignedToId)
        {
          this.newLeftCol = true;
        }
        else if(this.threadViewData.closeStatus==0)
        {
          this.newLeftCol = true;
        }

      }


        this.assignedToName =  this.threadViewData.assignedToName;
        this.assignedToProfile = this.threadViewData.assignedToProfile;
      }

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

      if( this.threadViewData == 'undefined' || this.threadViewData == undefined  ){
        this.loading = false;
        this.threadViewErrorMsg = res.result;
        this.threadViewError = true;
        setTimeout(() => {
          this.commonApi.emitThreadListData(this.threadViewData);
        }, 1);
      }
      else{
        this.threadViewData = res.data.thread[0];
        if(this.threadViewData != ''){
          this.threadViewData.likeCount = this.threadViewData.likeCount;
          this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
          this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';

          this.threadUserId = this.threadViewData.userId;
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
           this.tvsdealerCode=this.threadViewData.dealerCode;

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
          if(this.platformId == '1'){
            if( this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='2' || this.roleId=='10'){
              access = true;
            }
          }
          else{
            if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3'  || this.roleId=='10'){
              access = true;
            }
          }

          // give access to close thread
          if(this.platformId == '1'){
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
            if(this.closeStatus == 1 && this.threadViewData.newThreadTypeSelect == 'thread'){
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
          if(this.knowledgeDomain){
            this.postTypeAccess = true;
            this.adminUserNotOwner = true;
            if(this.userId == this.threadUserId){
              this.adminUserNotOwner = false;
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

          let approvalProcess = parseInt(this.threadViewData.approvalProcess);
          let threadStatus = '', threadStatusBgColor = '', threadStatusColorValue = '';

          switch (approvalProcess) {
            case 1:
              threadStatus = this.threadViewData.threadStatus;
              threadStatusBgColor = this.threadViewData.threadStatusBgColor;
              threadStatusColorValue = this.threadViewData.threadStatusColorValue;
              break;
            default:
              let statusId = parseInt(this.threadViewData.documentStatusId);
              statusId = (statusId == 2) ? 3 : statusId;
              let sindex = statusOptions.findIndex(option => option.code == statusId.toString());
              threadStatus = (sindex >= 0) ? statusOptions[sindex].status : threadStatus;
              threadStatusBgColor = (statusId == 3) ? "rgb(45, 126, 218)" : this.threadViewData.documentStatusBgColorStr;
              threadStatusColorValue = this.threadViewData.documentStatusColorValueStr;
              break;
          }


          if(this.businessRoleFlag && this.CBADomain && this.techSupportFlag && !this.approvalEnableDomainFlag){
            threadStatus = "";
            threadStatusBgColor = "";
            threadStatusColorValue = "";
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
            'editAccess': access,
            'deleteAccess': access,
            'reminderAccess': reminderAccess,
            'closeAccess': this.closeAccess,
            'reopenThread': reopenThread,
            'closeThread': this.closeStatus,
            'techSubmmit': this.techSubmmitFlag,
            'scorePoint': this.threadViewData.scorePoint,
            'ppfrAccess': ppfrAccess,
            'ppfrAvailable': ppfrAvailable,
            'newThreadTypeSelect': this.threadViewData.newThreadTypeSelect,
            'WorkstreamsList': this.threadViewData.WorkstreamsList,
			      'accessLevel' : this.accessLevel
          };


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

          if(this.threadViewData.comment>0){

            if(initVal == 'init' ){
              this.loading = false;
              this.postLoading = true;
              this.postFixLoading = true;
              this.newPostLoad = true;
              this.itemLength = 0 ;
              this.itemOffset = 0 ;
              this.postData = [];
              this.postButtonEnable = false;
              this.imageFlag = 'false';
              this.postDesc = '';
              this.getPostFixList();
              setTimeout(() => {
                this.getPostList();
                this.commonApi.emitThreadListData(this.threadViewData);
                setTimeout(() => {
                  console.log(this.apiUrl)
                  //this.apiUrl.postButtonEnable = this.postButtonEnable;
                }, 2500);
              }, 1);
            }
            else if(initVal == 'notification'){
              //this.postButtonEnable = false;
              //this.apiUrl.postButtonEnable = this.postButtonEnable;
              this.imageFlag = 'false';
              //this.postDesc = '';
              this.itemLength = 0 ;
              this.itemOffset = 0 ;
              this.getPostFixList();
              setTimeout(() => {
                this.getPostList();
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
            }
            else if(initVal == 'edit'){
              setTimeout(() => {
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
              this.getPostUpdateList(pid,'edit',type);
              /*if(this.postFixRefresh){
                this.getPostFixList();
              }*/
            }
            else if(initVal == 'reminder'){
              let lastposid = 0;
              for (let i in this.postData) {
                if(this.postData[i].deleteFlag != 1){
                  this.getPostUpdateList(this.postData[i].postId,'edit');
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

              /*let loadpid = this.postData[this.postData.length - 1].postId;
              setTimeout(() => {
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
              this.getPostUpdateList(loadpid,'edit');*/
            }
            else{
              if(pid == 0){
                for (let i in this.postData) {
                  this.postData[i].actionDisable = false;
                  if(this.userId == this.postData[i].userId || this.postData[i].ownerAccess == 1){
                    this.postData[i].actionDisable = true;
                  }
                  this.postData[i].editDeleteAction = false;
                  if((this.userId == this.postData[i].userId || this.postData[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                    this.postData[i].editDeleteAction = true;
                  }
                }
              }
              else{
                this.getPostUpdateList(pid,'last',type);
              }
              setTimeout(() => {
                this.commonApi.emitThreadListData(this.threadViewData);
              }, 1);
            }

          }
          else{
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

            if(initVal != 'reminder' && initVal != 'delete'){

              /*if(initVal == 'init'){
                this.postFixLoading = true;
                this.getPostFixList();
              }*/
              setTimeout(() => {
                let divHeight = this.tdpage.nativeElement.offsetHeight;
                console.log(divHeight);
                console.log(this.innerHeight);

                if(divHeight > this.innerHeight){
                  this.threadViewData.buttonTop = true;
                  this.buttonTop = true;
                  this.threadViewData.buttonBottom = false;
                  this.buttonBottom = false;
                }
                else{
                  this.threadViewData.buttonTop = false;
                  this.buttonTop = false;
                  this.threadViewData.buttonBottom = false;
                  this.buttonBottom = false;
                }

              }, 1500);
            }
          }
          if(initVal == 'delete'){
            this.postDataLength = this.postData.length != undefined ? this.postDataLength : 0;
            if(this.postDataLength>0){
              for (let i in this.postData) {
                this.postReplyDataLength = this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;
              }
            }
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
   if(this.platformId=='1')
   {
    this.updatethreadViewSolr();
   }

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


  // post particular list
  getPostUpdateList(pid,ptype,type=''){
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
              this.postLists[i].postReplyLoading = false;
              this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' ? this.postLists[i].userRoleTitle : 'No Title';
              if(this.TVSDomain){
                this.postLists[i].userRoleTitle = this.postLists[i].badgestatus !='' ? this.postLists[i].badgestatus : 'No Title';
              }
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
              if(this.postLists[i].owner  == this.postLists[i].userId){
                this.postLists[i].threadOwnerLabel = true;
                this.postLists[i].postOwner = true;
              }
              this.postLists[i].actionDisable = false;
              if(this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1){
                this.postLists[i].actionDisable = true;
              }
              // post edit delete action
              this.postLists[i].editDeleteAction = false;
              if((this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                this.postLists[i].editDeleteAction = true;
              }
              if(this.CBADomainOnly)
              {
                if( this.postLists[i].automatedMessage=='1')
                {
                  this.postLists[i].editDeleteAction = false;
                }
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
                if(this.postReplyDataLength>0){
                  let postReplyAttachments = [];
                  for (let pr in this.postReplyLists) {
                    this.postReplyLists[pr].postNew = false;
                    this.postReplyLists[pr].newReply = false;
                    this.postReplyLists[pr].postView = true;
                    this.postReplyLists[pr].postStFlag = true;
                    this.postReplyLists[pr].postReplyLoading = false;
                    this.postReplyLists[pr].userRoleTitle = this.postReplyLists[pr].userRoleTitle !='' ? this.postReplyLists[pr].userRoleTitle : 'No Title';
                    if(this.TVSDomain){
                      this.postReplyLists[pr].userRoleTitle = this.postReplyLists[pr].badgestatus !='' ? this.postReplyLists[pr].badgestatus : 'No Title';
                    }
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
                    if(this.postReplyLists[pr].owner  == this.postReplyLists[pr].userId){
                      this.postReplyLists[pr].threadOwnerLabel = true;
                    }
                    this.postReplyLists[pr].actionDisable = false;
                    if(this.userId == this.postReplyLists[pr].userId || this.postReplyLists[pr].ownerAccess == 1){
                      this.postReplyLists[pr].actionDisable = true;
                    }
                    // post edit delete action
                    this.postReplyLists[pr].editDeleteAction = false;
                    if((this.userId == this.postReplyLists[pr].userId || this.postReplyLists[pr].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                      this.postReplyLists[pr].editDeleteAction = true;
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
              }

              if(ptype == 'edit'){
                if(type == 'replyedit'){
                  let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
                  let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == pid);
                  this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[i];
                }
                else{
                  let itemIndex = this.postData.findIndex(item => item.postId == pid);
                  this.postData[itemIndex] = this.postLists[i];
                }
              }
              else{
                if(type == 'replynew'){
                  for (let r1 in this.postData) {
                    this.postData[r1].postNew = false;
                    this.postData[r1].postReplyLoading = false;
                    if(this.postData[r1].postId == this.parentPostId){
                      this.postData[r1].nestedReplies.push(this.postLists[i]);
                    }
                  }
                  setTimeout(() => {
                    for (let r1 in this.postLists) {
                      this.postLists[r1].newReply = true;
                    }
                  }, 10);
                  setTimeout(() => {
                    for (let r1 in this.postLists) {
                      this.postLists[r1].newReply = false;
                    }
                  }, 850);
                }
                else{
                  this.postData.push(this.postLists[i]);
                  setTimeout(() => {
                    for (let r1 in this.postLists) {
                      this.postLists[r1].newComment = true;
                    }
                  }, 10);
                  setTimeout(() => {
                    for (let r1 in this.postLists) {
                      this.postLists[r1].newComment = false;
                    }
                  }, 850);
                }
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
   if(content)
   {
     content= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(content));
   }
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

  // post list
  getPostList(){
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
              this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' ? this.postLists[i].userRoleTitle : 'No Title';
              if(this.TVSDomain){
                this.postLists[i].userRoleTitle = this.postLists[i].badgestatus !='' ? this.postLists[i].badgestatus : 'No Title';
              }
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
              this.postLists[i].action = 'view';
              this.postLists[i].threadOwnerLabel = false;
              if(this.postLists[i].owner  == this.postLists[i].userId){
                this.postLists[i].threadOwnerLabel = true;
              }
              this.postLists[i].actionDisable = false;
              if(this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1){
                this.postLists[i].actionDisable = true;
              }
              // post edit delete action
              this.postLists[i].editDeleteAction = false;
              if((this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                this.postLists[i].editDeleteAction = true;
              }
              if(this.CBADomainOnly)
              {
                if( this.postLists[i].automatedMessage=='1')
                {
                  this.postLists[i].editDeleteAction = false;
                }
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
              if(this.postReplyDataLength>0){
                let postReplyAttachments = [];
                for (let prl in this.postReplyLists) {
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
                  this.postReplyLists[prl].userRoleTitle = this.postReplyLists[prl].userRoleTitle !='' ? this.postReplyLists[prl].userRoleTitle : 'No Title';
                  if(this.TVSDomain){
                    this.postReplyLists[prl].userRoleTitle = this.postReplyLists[prl].badgestatus !='' ? this.postReplyLists[prl].badgestatus : 'No Title';
                  }
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
                  this.postReplyLists[prl].likeStatus = this.postReplyLists[prl].likeStatus;
                  this.postReplyLists[prl].likeImg = (this.postReplyLists[prl].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                  this.postReplyLists[prl].attachments = this.postReplyLists[prl].uploadContents;
                  this.postReplyLists[prl].attachmentLoading = (this.postReplyLists[prl].uploadContents.length>0) ? false : true;
                  this.postReplyLists[prl].action = 'view';
                  this.postReplyLists[prl].threadOwnerLabel = false;
                  if(this.postReplyLists[prl].owner  == this.postReplyLists[prl].userId){
                    this.postReplyLists[prl].threadOwnerLabel = true;
                  }
                  this.postReplyLists[prl].actionDisable = false;
                  if(this.userId == this.postReplyLists[prl].userId || this.postReplyLists[prl].ownerAccess == 1){
                    this.postReplyLists[prl].actionDisable = true;
                  }
                  // post edit delete action
                  this.postReplyLists[prl].editDeleteAction = false;
                  if((this.userId == this.postReplyLists[prl].userId || this.postReplyLists[prl].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                    this.postReplyLists[prl].editDeleteAction = true;
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
                  this.postReplyLists[prl].contentTranslate = this.postReplyLists[prl].content;
                }

                let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
                localStorage.setItem(threadPostStorageText, JSON.stringify(postReplyAttachments));

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
                  this.threadViewData.buttonTop = true;
                  this.buttonTop = true;
                  this.threadViewData.buttonBottom = false;
                  this.buttonBottom = false;
                }
              }, 1000);
            }
            else{
              setTimeout(() => {
                this.postLoading = false;
                this.newPostLoad = false;
                this.threadViewData.buttonTop = true;
                this.buttonTop = true;
                this.threadViewData.buttonBottom = false;
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

  // post list
  getPostFixList(){
    this.postFixRefresh = false;
    // collabtic platform only
    if(this.collabticDomain){
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
                this.postFixLists[i].userRoleTitle = this.postFixLists[i].userRoleTitle !='' ? this.postFixLists[i].userRoleTitle : 'No Title';
                if(this.TVSDomain){
                  this.postFixLists[i].userRoleTitle = this.postFixLists[i].badgestatus !='' ? this.postFixLists[i].badgestatus : 'No Title';
                }
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
                this.postFixLists[i].likeStatus = this.postFixLists[i].likeStatus;
                this.postFixLists[i].likeImg = (this.postFixLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
                this.postFixLists[i].attachments = this.postFixLists[i].uploadContents;
                this.postFixLists[i].attachmentLoading = (this.postFixLists[i].uploadContents.length>0) ? false : true;
                this.postFixLists[i].action = 'view';
                this.postFixLists[i].threadOwnerLabel = false;
                if(this.postFixLists[i].owner  == this.postFixLists[i].userId){
                  this.postFixLists[i].threadOwnerLabel = true;
                }
                this.postFixLists[i].actionDisable = false;
                if(this.userId == this.postFixLists[i].userId || this.postFixLists[i].ownerAccess == 1){
                  this.postFixLists[i].actionDisable = true;
                }
                // post edit delete action
                this.postFixLists[i].editDeleteAction = false;
                if((this.userId == this.postFixLists[i].userId || this.postFixLists[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
                  this.postFixLists[i].editDeleteAction = true;
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

  // Set Screen Height
  setScreenHeight() {
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
      if(this.teamSystem){
        if (window.screen.width < 800) {
          this.innerHeight = this.innerHeight + 45;
          this.msTeamAccessMobile = true;
        }
        else{
          this.msTeamAccessMobile = false;
        }
      }
    } else {
      let pmsgHeight = (this.apiUrl.newupdateRefresh) ? 27 : 0;
      this.innerHeightLtNew = 96 + pmsgHeight;
      this.innerHeightNew = 71 + pmsgHeight;
      this.innerHeight = (this.bodyHeight - (157 + pmsgHeight) );
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
            localStorage.setItem("newUpdateOnThreadId",this.threadId);
            let apiData = new FormData();
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);
            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('commentId', postId);
            apiDatasocial.append('action', 'replyCount');
            let platformIdInfo = localStorage.getItem('platformId');

            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

            // PUSH API
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = res.result;
              setTimeout(() => {
                if(type == 'nested-reply'){
                  let itemIndex1 = this.postData.findIndex(item => item.postId == ppId);
                  let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == postId);
                  this.postData[itemIndex1].nestedReplies[itemIndex2].postStatus = postStatus;
                }
                else{
                  for (let i in this.postData) {
                    if(this.postData[i].postId == postId){
                      this.postData[i].postStatus = postStatus;
                    }
                  }
                }
                this.postFixRefresh = true;
                this.getThreadInfo('refresh',0);
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
       else{
        this.newReplyPost(postType,postStatus,'No',postId);
       }
    }
    else if(action=='new'){
      if(this.apiUrl.enableAccessLevel){
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
    this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
    this.apiUrl.tagCommentFlag = this.tagCommentFlag;
    this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
    this.apiUrl.tagReplyFlag = this.tagReplyFlag;
    this.apiUrl.postReplyButtonEnable = this.postReplyButtonEnable;
    const apiFormData = new FormData();
    this.imageFlag = 'true';

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
            this.nestedPostApiData['message'] = res.result;
            this.nestedPostApiData['dataId'] = lastPostid;
            this.nestedPostApiData['replyId'] = lastPostid;
            this.nestedPostApiData['parentPostId'] = this.parentPostId;
            this.nestedPostApiData['commentId'] = this.parentPostId;
            this.nestedPostApiData['postId'] = this.parentPostId;
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
              if(!this.techSubmmitFlag){

                this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('postId', lastPostid);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('commentId', this.parentPostId);
                apiDatasocial.append('replyId', lastPostid);
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

  // posted new reply
  newPost(postType,postStatus,closeStatus){
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
    this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
    this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
    this.apiUrl.tagReplyFlag = this.tagReplyFlag;
    this.apiUrl.tagCommentFlag = this.tagCommentFlag;
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

    if(this.presetEmitFlag){
      this.presetAttachmentsIds = [];
      if(Object.keys(this.presetAttachments).length > 0 && this.presetAttachments.length > 0) {
        this.presetAttachments.forEach(item => {
          this.presetAttachmentsIds.push(item.fileId.toString());
        });
      }
    }

    console.log( this.commentTaggedUsers);
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
    apiFormData.append('description', this.postDesc);
    apiFormData.append('postType', postType);
    apiFormData.append('postStatus', postStatus);
    apiFormData.append('closeStatus', closeStatus);
    apiFormData.append('imageFlag', this.imageFlag);
    apiFormData.append('summitFix', techSubmmitVal);
    apiFormData.append('taggedUsers', commentTaggedUsers);
    apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    apiFormData.append('platform', this.accessPlatForm);
    if(this.presetEmitFlag){
      apiFormData.append('presetId', this.presetId);
      apiFormData.append('mediaAttachments', JSON.stringify(this.presetAttachmentsIds));
    }
    console.log( this.postDesc);
    this.threadPostService.newReplyPost(apiFormData).subscribe(res => {

     
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){
          this.commentAssignedUsersList=[];
          this.commentAssignedUsersPopupResponse=false;

          let lastPostid = res.data.postId;
          let replyContent = res.data.replyContent;
          localStorage.setItem("newUpdateOnThreadId",this.threadId);
          apiFormData.append('threadId', this.threadId);
          apiFormData.append('postId', lastPostid);

          if(this.presetEmitFlag){
            this.presetEmitFlag = false;
            this.presetId = '';
            this.presetContent = '';
            this.presetAttachmentsIds = [];
            this.presetAttachments = [];
          }

          if(uploadCount == 0) {
            this.uploadedItems = [];
            this.mediaUploadItems = [];
            this.postUpload = false;
            setTimeout(() => {
              this.postUpload = true;
            }, 100);
          }

          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            this.postApiData['uploadedItems'] = this.uploadedItems.items;
            this.postApiData['attachments'] = this.uploadedItems.attachments;
            this.postApiData['nestedReply'] = "0";
            this.postApiData['message'] = res.result;
            this.postApiData['commentId'] = lastPostid;
            this.postApiData['postId'] = lastPostid;
            this.postApiData['dataId'] = lastPostid;
            this.postApiData['threadId'] = this.threadId;
            this.postApiData['summitFix'] = techSubmmitVal;
            this.manageAction = 'uploading';
            this.postUpload = false;
            setTimeout(() => {
              this.postUpload = true;
            }, 100);
          }
          else{
             // PUSH API
             let apiData = new FormData();
             apiData.append('apiKey', Constant.ApiKey);
             apiData.append('domainId', this.domainId);
             apiData.append('countryId', this.countryId);
             apiData.append('userId', this.userId);
             if(!this.techSubmmitFlag){


              this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

              let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', this.threadId);
              apiDatasocial.append('postId', lastPostid);
              apiDatasocial.append('commentId', lastPostid);
              apiDatasocial.append('userId', this.userId);
              apiDatasocial.append('action', 'replyCount');
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
            this.resetReplyBox();
            this.updateDynamicData('comment', 'new' , lastPostid, replyContent);

            if(closeStatus == 'yes'){



              //if(this.platformId=='1' || this.platformId=='3'){
                // PUSH API
                let apiData = new FormData();
                apiData.append('apiKey', Constant.ApiKey);
                apiData.append('domainId', this.domainId);
                apiData.append('countryId', this.countryId);
                apiData.append('userId', this.userId);
                this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('action', 'close');
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
                // PUSH API
                let platformIdInfo = localStorage.getItem('platformId');
                if(platformIdInfo=='3')
                {
                  this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
                }
              //}

              localStorage.setItem('closeThreadNow', 'yes');
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = res.result;
              setTimeout(() => {
                this.getThreadInfo('refresh',0);
              },1);
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');
              }, 2000);

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
    this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
    this.apiUrl.tagCommentFlag = this.tagCommentFlag;
    this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
    this.apiUrl.tagReplyFlag = this.tagReplyFlag;
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

          localStorage.setItem("newUpdateOnThreadId",this.threadId);
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            this.editPostUpload = false;
            this.postEditApiData['uploadedItems'] = this.uploadedItems.items;
            this.postEditApiData['attachments'] = this.uploadedItems.attachments;
            if(action  == 'nested-reply-edit'){
              this.postEditApiData['nestedReply'] = "1";
              this.postEditApiData['parentPostId'] = ppId;
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

             // PUSH API
             let apiData = new FormData();
             apiData.append('apiKey', Constant.ApiKey);
             apiData.append('domainId', this.domainId);
             apiData.append('countryId', this.countryId);
             apiData.append('userId', this.userId);

             if(!this.techSubmmitFlag){this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });}
             // PUSH API
            //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            //msgModalRef.componentInstance.successMessage = res.result;
            //setTimeout(() => {
              if(action  == 'nested-reply-edit'){
                this.resetEditReplyBox();
                let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
                let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == postId);
                this.postData[itemIndex1].nestedReplies[itemIndex2].postReplyLoading = true;

                this.postData[itemIndex1].nestedReplies[itemIndex2].postView = true;
                this.postFixRefresh = true;
                this.getThreadInfo('edit',postId,'replyedit');
              }
              else{
                this.resetEditReplyBox();
                let itemIndex = this.postData.findIndex(item => item.postId == postId);
                this.postData[itemIndex].postView = true;
                this.postData[itemIndex].postLoading = true;

                this.postFixRefresh = true;
                this.getThreadInfo('edit',postId);
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
        this.postData[this.currentPostDataIndex].postLoading = false;
        this.postEditServerErrorMsg = error;
        this.posteditServerError  = true;
      })
    );
 }


 updateDynamicData(type, ptype, pid, replyContent){
    this.postLists = replyContent;
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
      this.postLists[i].newComment = false;
      this.postLists[i].postView = true;
      this.postLists[i].postLoading = false;
      this.postLists[i].postReplyLoading = false;
      this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' ? this.postLists[i].userRoleTitle : 'No Title';
      if(this.TVSDomain){
        this.postLists[i].userRoleTitle = this.postLists[i].badgestatus !='' ? this.postLists[i].badgestatus : 'No Title';
      }
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
      this.postLists[i].contentTranslate=this.postLists[i].content;
      this.postLists[i].action = 'view';
      this.postLists[i].postOwner = false;
      this.postLists[i].threadOwnerLabel = false;
      if(this.postLists[i].owner  == this.postLists[i].userId){
        this.postLists[i].threadOwnerLabel = true;
        this.postLists[i].postOwner = true;
      }
      this.postLists[i].actionDisable = false;
      if(this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1){
        this.postLists[i].actionDisable = true;
      }
      // post edit delete action
      this.postLists[i].editDeleteAction = false;
      if((this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
        this.postLists[i].editDeleteAction = true;
      }
      if(this.CBADomainOnly)
      {
        if( this.postLists[i].automatedMessage=='1')
        {
          this.postLists[i].editDeleteAction = false;
        }
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
        if(this.postReplyDataLength>0){
          let postReplyAttachments = [];
          for (let pr in this.postReplyLists) {
            if(this.translatelangId != ''){
              this.postReplyLists[pr].transText = "Translate to "+this.translatelangArray['name'];
              this.postReplyLists[pr].transId = this.translatelangId;
            }
            else{
              this.postReplyLists[pr].transText = "Translate";
              this.postReplyLists[pr].transId = this.translatelangId;
            }
            this.postReplyLists[pr].postNew = false;
            this.postReplyLists[pr].newReply = false;
            this.postReplyLists[pr].postView = true;
            this.postReplyLists[pr].postStFlag = true;
            this.postReplyLists[pr].postReplyLoading = false;
            this.postReplyLists[pr].userRoleTitle = this.postReplyLists[pr].userRoleTitle !='' ? this.postReplyLists[pr].userRoleTitle : 'No Title';
            if(this.TVSDomain){
              this.postReplyLists[pr].userRoleTitle = this.postReplyLists[pr].badgestatus !='' ? this.postReplyLists[pr].badgestatus : 'No Title';
            }
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
            if(this.postReplyLists[pr].owner  == this.postReplyLists[pr].userId){
              this.postReplyLists[pr].threadOwnerLabel = true;
            }
            this.postReplyLists[pr].actionDisable = false;
            if(this.userId == this.postReplyLists[pr].userId || this.postReplyLists[pr].ownerAccess == 1){
              this.postReplyLists[pr].actionDisable = true;
            }
            // post edit delete action
            this.postReplyLists[pr].editDeleteAction = false;
            if((this.userId == this.postReplyLists[pr].userId || this.postReplyLists[pr].ownerAccess == 1 || this.roleId == '10' || this.roleId == '3' || this.roleId == '2')){
              this.postReplyLists[pr].editDeleteAction = true;
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
      }

      if(ptype == 'edit'){
        if(type == 'replyedit'){
          let itemIndex1 = this.postData.findIndex(item => item.postId == this.parentPostId);
          let itemIndex2 = this.postData[itemIndex1].nestedReplies.findIndex(item => item.postId == pid);
          this.postData[itemIndex1].nestedReplies[itemIndex2] = this.postLists[i];
        }
        else{
          let itemIndex = this.postData.findIndex(item => item.postId == pid);
          this.postData[itemIndex] = this.postLists[i];
        }
      }
      else{
        if(type == 'replynew'){
          for (let r1 in this.postData) {
            this.postData[r1].postNew = false;
            this.postData[r1].postReplyLoading = false;
            if(this.postData[r1].postId == this.parentPostId){
              this.postData[r1].nestedReplies.push(this.postLists[i]);
            }
          }
          setTimeout(() => {
            for (let r1 in this.postLists) {
              this.postLists[r1].newReply = true;
            }
          }, 10);
          setTimeout(() => {
            for (let r1 in this.postLists) {
              this.postLists[r1].newReply = false;
            }
          }, 850);
          this.moveScroll(this.parentPostId);
        }
        else{
          this.postLoading = false;
          this.postData.push(this.postLists[i]);
          setTimeout(() => {
            for (let r1 in this.postLists) {
              this.postLists[r1].newComment = true;
            }
          }, 10);
          setTimeout(() => {
            for (let r1 in this.postLists) {
              this.postLists[r1].newComment = false;
            }
          }, 850);
        }
      }
    }
    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));
    /*if(this.postFixRefresh){
      //setTimeout(() => {
      this.getPostFixList();
      //}, 1);
    }*/
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
      this.getThreadInfo('edit',postId,'replyedit');
   }
   else{
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
    this.getThreadInfo('edit',postId);
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
    this.postReplyDescEditor = false;
    setTimeout(() => {
      this.postReplyDescEditor = true;
    }, 1000);
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
          this.postReplyDescEditor = false;
          setTimeout(() => {
            this.postReplyDescEditor = true;
          }, 1000);
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
      this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
      this.apiUrl.tagCommentFlag = this.tagCommentFlag;
      this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
      this.apiUrl.tagReplyFlag = this.tagReplyFlag;
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
 // edit open
 editPostAction(postId, replyType='', ppId='') {
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
            this.postData[i].nestedReplies[j].attachmentItems = [];
            this.postData[i].nestedReplies[j].attachmentItems  = this.postData[i].nestedReplies[j].uploadContents;

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
        this.postData[i].attachmentItems  = this.postData[i].uploadContents;

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

  //close thread confirm
  closeThreadConfirm(){

   let dealerCode= localStorage.getItem('dealerCode');
    if(dealerCode && this.threadOwner)
    {


    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('dealerCode', this.tvsdealerCode);




    this.threadPostService.validateCloseThread(apiFormData).subscribe(res => {

      if(res.status=='Success')
      {
        this.escalationStatusView=false;
      }


      this.CalltoCloseThread();

    });

  }
  else
  {
    this.CalltoCloseThread();
  }

  }


  CalltoCloseThread()
  {
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
      this.techSummitScore();
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
                  this.closeThread();
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
                  this.closeThread();
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
                  this.closeThread();
                }
              });
          }

      }



    }
  }
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
            this.tagReplyFlag = true;
            this.apiUrl.tagReplyFlag = this.tagReplyFlag;
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
            this.apiUrl.tagCommentFlag = this.tagCommentFlag;
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
          this.apiUrl.tagReplyFlag = this.tagReplyFlag;
        }
        else{
          this.tagCommentFlag = false;
          this.apiUrl.tagCommentFlag = this.tagCommentFlag;
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
      this.apiUrl.tagReplyFlag = this.tagReplyFlag;
    }
    else{
      let rmIndex = this.commentAssignedUsersList.findIndex(option => option.id == id);
      this.commentAssignedUsersList.splice(rmIndex, 1);
      if(this.commentAssignedUsersList.length>0)
      {
        this.tagCommentFlag = true;
      }
      else{
        this.tagCommentFlag = false;
      }
      this.apiUrl.tagCommentFlag = this.tagCommentFlag;
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
    apiFormData.append("teamId", "1");
    apiFormData.append("threadId", thradIdDataJSON);
    this.LandingpagewidgetsAPI.updateThreadTechSupportAPI(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        localStorage.setItem("tspageRefresh","1");
        this.ticketStatus = this.ticketStatus == "1" ? "2" : this.ticketStatus ;
        localStorage.setItem("tspageTS",this.ticketStatus);
        this.getThreadInfo('refresh',0);
        this.msgs1 = [{severity:'success', summary:'', detail:response.result}];
        this.primengConfig.ripple = true;
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
      'userId': this.userId
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
        /*this.msgs1 = [{severity:'success', summary:'', detail:res.result}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.msgs1 = [];
        }, 3000);*/
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
    if((this.uploadCommentFlag || this.commentAssignedUsersList.length>0)){
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
    if(feedbackId)
    {
      $('.feedback-id'+feedbackId+'').removeClass('bg-border');
      this.visibledealerClosePopup=false;
    }



    this.threadPostService.closeThread(apiFormData).subscribe(res => {
        if(res.status=='Success'){


          localStorage.setItem("newUpdateOnThreadId",this.threadId);
          //if(this.platformId=='1' || this.platformId=='3'){
            // PUSH API
            let apiData = new FormData();
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);
            apiData.append('action', 'close');

            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('action', 'close');
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            // PUSH API
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo=='3')
            {
              this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
            }

          //}
          localStorage.setItem('closeThreadNow', 'yes');
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = res.result;
          setTimeout(() => {
            this.getThreadInfo('refresh',0);
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

  // post delete confirm
  postDeleteConfirm(pid, replyType='', ppId=''){
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
              thread_id = this.threadViewData.threadId;
              post_id = id;
              parent_post_id = ppId;
              apiDatasocial.append('commentId', ppId);
              apiDatasocial.append('replyId', id);
            }
            else{
              apiDatasocial.append('action', 'delete-comment');
              thread_id = this.threadViewData.threadId;
              apiDatasocial.append('commentId', id);
              post_id = id;
            }
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
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

        let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', this.threadId);
            apiDatasocial.append('userId', this.userId);
            apiDatasocial.append('action', 'reopen');
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo=='3')
            {
              this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
            }
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = res.result;
        setTimeout(() => {
          this.getThreadInfo('refresh',0);
          msgModalRef.dismiss('Cross click');

          let secElement = document.getElementById('step');
          setTimeout(() => {
            secElement.scrollTop = this.innerHeight;
          }, 1000);

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
    this.uploadReplyFlag  = (items.items.length > 0) ? true : false;
    this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
  }
  attachments(items) {
    console.log(items)
    if(this.uploadedItems.length>0){
      this.uploadCommentFlag = (items.items.length > 0) ? true : false;
      if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
        this.openPost(0);
      }
      else{
        this.replyPostOnFlag3 = true;
        this.uploadCommentFlag = (items.items.length > 0) ? true : false;
        this.uploadedItems = items;
      }
      this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
    }
    else{
      if(this.replyPostOnFlag1 && this.replyPostOnFlag2){
        this.uploadCommentFlag = (items.items.length > 0) ? true : false;
        this.openPost(0);
      }
      else{
        this.replyPostOnFlag3 = true;
        this.uploadCommentFlag = (items.items.length > 0) ? true : false;
        this.uploadedItems = items;
      }
      this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
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
      this.apiUrl.uploadCommentFlag = this.uploadCommentFlag;
      this.apiUrl.tagCommentFlag = this.tagCommentFlag;
      this.apiUrl.uploadReplyFlag = this.uploadReplyFlag;
      this.apiUrl.tagReplyFlag = this.tagReplyFlag;
    }
  }


  dropEvent(event,tfData)
  {
   // console.log(event);
   // alert(222);
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
    console.log(event);
    if(type=='new'){
      console.log( this.postDesc);
      this.postButtonEnable = (this.postDesc != '') ? true : false;
      if(this.postButtonEnable){
        this.emptyComment = false;
      }
      this.apiUrl.postButtonEnable = this.postButtonEnable;
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
    }
    else{
      //this.postEditDesc = event.htmlValue;
      //console.log( this.postEditDesc);
      this.postSaveButtonEnable = (this.postEditDesc != '') ? true : false;
      this.apiUrl.postSaveButtonEnable = this.postSaveButtonEnable;
    }
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
  resetReplyBox(){
    this.commentAssignedUsersList=[];
    this.commentAssignedUsersPopupResponse=false;
    this.manageAction = 'new';
    this.pageAccess = 'post';

    this.presetEmitFlag = false;
    this.presetAttachments = [];
    this.presetAttachmentsIds = [];
    this.presetContent = '';
    this.presetId = '';

    this.contentType  = 2;
    this.uploadedItems  = [];
    this.mediaUploadItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postButtonEnable = false;
    this.apiUrl.postButtonEnable = this.postButtonEnable;
    this.imageFlag = 'false';
    this.postDesc = '';
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
    this.presetAttachmentsFlag = false;
    setTimeout(() => {
      this.presetAttachmentsFlag = true;
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
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postReplyButtonEnable = false;
    this.apiUrl.postReplyButtonEnable = this.postReplyButtonEnable;
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

    this.presetEmitFlag = false;
    this.presetAttachmentsIds = [];
    this.presetAttachments = [];
    this.presetContent = '';
    this.presetId = '';

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
  deletePost(postId, replyType='', ppId=''){
    if(replyType == 'nested-reply'){
      for (let i in this.postData) {
        if(this.postData[i].postId == ppId){
          length = this.postData[i].nestedReplies != 'undefined' || this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;
          for (let j in this.postData[i].nestedReplies) {
            this.postData[i].nestedReplies.forEach((element,index)=>{
              console.log(element.postId);
              if(element.postId==postId) this.postData[i].nestedReplies.splice(index,1);
            });
          }
          if(length>1){

          }
          else{
            for (let i in this.postData) {
              if(this.postData[i].postId == ppId){
                if(this.postData[i].deleteFlag == 1){
                  this.postData.forEach((element,index)=>{
                    if(element.postId==ppId) this.postData.splice(index,1);
                    this.postDataLength = this.postData.length;
                  });
                  this.postFixRefresh = true;
                  this.getThreadInfo('delete',0);
                }
              }
            }
          }
        }
      }
      this.postFixRefresh = true;
      this.getThreadInfo('delete',0,'nested-reply');
    }
    else{
        if(this.collabticDomain){
          let length = 0;
          for (let i in this.postData) {
            if(this.postData[i].postId == postId){
              length = this.postData[i].nestedReplies != undefined ? this.postData[i].nestedReplies.length : 0;
              if(length){
                this.postData[i].deleteFlag = "1";
              }
              else{
                this.postData.forEach((element,index)=>{
                  if(element.postId==postId) this.postData.splice(index,1);
                  this.postDataLength = this.postData.length;
                });
                this.postFixRefresh = true;
                this.getThreadInfo('delete',0);
              }
             }
          }
        }
        else{
          this.postData.forEach((element,index)=>{
            if(element.postId==postId) this.postData.splice(index,1);
          });
          this.postFixRefresh = true;
          this.getThreadInfo('delete',0);
        }
    }
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
                    this.getThreadInfo('refresh',0);
                    // PUSH API
                    let apiData = new FormData();
                    apiData.append('apiKey', Constant.ApiKey);
                    apiData.append('domainId', this.domainId);
                    apiData.append('countryId', this.countryId);
                    apiData.append('userId', this.userId);
                    this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });

                    let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', this.threadId);
                apiDatasocial.append('postId', postId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('action', type);
               this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                    // PUSH API
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
              localStorage.setItem("newUpdateOnThreadId",this.threadId);
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
                this.getThreadInfo('refresh',0);
                // PUSH API
                let apiData = new FormData();
                apiData.append('apiKey', Constant.ApiKey);
                apiData.append('domainId', this.domainId);
                apiData.append('countryId', this.countryId);
                apiData.append('userId', this.userId);
                this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
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
            this.loading = true;
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

    this.threadViewData.buttonTop = (this.buttonTop) ? true : false;
    this.threadViewData.buttonBottom = (this.buttonBottom) ? true : false;

    let bottom = this.isUserNearBottom();
    //this.isUserNearBottomorlastreply();
    let top = this.isUserNearTop();

    if(bottom){
      console.log("bottom:"+bottom);
      this.threadViewData.buttonTop = false;
      this.buttonTop = false;
      this.threadViewData.buttonBottom = true;
      this.buttonBottom = true;
    }
    if(top){
      console.log("top:"+top);
      this.threadViewData.buttonTop = true;
      this.buttonTop = true;
      this.threadViewData.buttonBottom = false;
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
      case 'reopen':
        this.reopenThreadAction();
        break;
      case 'delete':
        if(this.apiUrl.enableAccessLevel){
          this.authenticationService.checkAccess(2,'Delete',true,true);
          setTimeout(() => {
            if(this.authenticationService.checkAccessVal){
              this.threadDeleteConfirm();
            }
            else if(!this.authenticationService.checkAccessVal){
              // no access
            }
            else{
              this.threadDeleteConfirm();
            }
          }, 550);
         }
         else{
        this.threadDeleteConfirm();
         }
        break;
      case 'reminder':
        this.remainderThread();
        break;
      case 'close':
        this.closeThreadConfirm();
        break;
      case 'threaddashboard':
        this.threadDashboardOpen();
        break;
      case 'print':
        this.print.nativeElement.click();
        break;
      case 'ppfr':
        this.ppfrForm();
        break;
      case 'exit':
      case 'exit-thread':
        if(this.postButtonEnable || this.uploadCommentFlag || this.tagCommentFlag) {
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
        } else if(this.postReplyButtonEnable  || this.postSaveButtonEnable || this.uploadReplyFlag || this.tagReplyFlag) {
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
  moveScroll(id){
    setTimeout(() => {
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
    }, 500);
  }
  moveScrollNotify(id){
    this.nloading = false;
    if(document.getElementById('notify-'+id) != undefined){
      let nst1 = document.getElementById('notify-'+id).offsetTop;
      this.top.nativeElement.scrollTop = nst1 - 200;
      for (let i in this.postData) {
        if(this.postData[i].postId == id){
          setTimeout(() => {
            this.postData[i].newComment = true;
          }, 100);
          setTimeout(() => {
            this.postData[i].newComment = false;
          }, 850);
          return;
        }
        else{
          for (let j in this.postData[i].nestedReplies) {
            if(this.postData[i].nestedReplies[j].postId == id){
              setTimeout(() => {
                this.postData[i].nestedReplies[j].newReply = true;
              }, 100);
              setTimeout(() => {
                this.postData[i].nestedReplies[j].newReply = false;
              }, 850);
              return;
            }
          }
        }
      }
      console.log(nst1);
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
            this.detectContentLang = false;
            this.translateProcess = false;
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
                  }, 3000);
                }, 3000);
              }
              if(this.CBADomainOnly){
                setTimeout(() => {
                  this.detectContentLang = false;
                  this.translateProcess = false;
                  this.taponDescription('', 'thread-teamassist', '',selectLanguage);
                }, 3000);
              }
            }, 3000);
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
        this.detectContentLang = false;
        this.translateProcess = false;
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
            },3000);
          },3000);
        }
        if(this.CBADomainOnly){
          setTimeout(() => {
            this.detectContentLang = false;
            this.translateProcess = false;
            this.taponDescription('', 'thread-teamassist', '',selectLanguage);
          },3000);
        }
        },3000);
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

  tabonPageRefresh(){
    this.fromNotificationPageFlag = true;
    this.getThreadInfo('notification','');
    this.postNotificationCount = 0;
    setTimeout(() => {
      this.pageRefresh = false;
    }, 100);
  }

  checkReplyAccess(){
    if(this.apiUrl.enableAccessLevel){
      this.authenticationService.checkAccess(2,'Reply',true,true);
      setTimeout(() => {
        if(this.authenticationService.checkAccessVal){
          // access
          this.noReplyAccess = false;
        }
        else if(!this.authenticationService.checkAccessVal){
          // no access
          this.noReplyAccess = true;
        }
        else{
          // access
          this.noReplyAccess = false;
        }
      }, 550);
     }
  }

  checkCloseAccess(){
    if(this.apiUrl.enableAccessLevel){
      this.authenticationService.checkAccess(2,'Close',true,true);
      setTimeout(() => {
        if(this.authenticationService.checkAccessVal){
          // access
          this.noCloseAccess = false;
        }
        else if(!this.authenticationService.checkAccessVal){
          // no access
          this.noCloseAccess = true;
        }
        else{
          // access
          this.noCloseAccess = false;
        }
      }, 550);
     }
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
          this.presetAttachments = [];
          this.presetAttachments = receivedService.presetData.uploadContents;
          this.presetAttachmentAction = 'attachments';
        }
        this.presetAttachmentsFlag = false;
        setTimeout(() => {
          this.presetAttachmentsFlag = true;
        }, 300);
        setTimeout(() => {
          this.top.nativeElement.scrollTop = this.top.nativeElement.scrollHeight;
        }, 400);
        this.presetEmitFlag = true;
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

    // Attachment Action
    presetsAttachmentAction(data) {
      console.log(data)
      let action = data.action;
      let fileId = data.fileId;
      let caption = data.text;
      let url = data.url;
      let lang = data.language;
      switch (action) {
        case 'file-delete':
          let uindex1 = this.presetAttachments.findIndex(option => option.fileId == fileId);
          if(uindex1 >= 0) {
            this.presetAttachments.splice(uindex1);
          }
          break;
        case "file-remove":
          let uindex2 = this.presetAttachments.findIndex(option => option.fileId == fileId);
          if(uindex2 >= 0) {
            this.presetAttachments.splice(uindex2);
          }
          break;
        case 'order':
          let attachmentList = data.attachments;
          for(let a in attachmentList) {
            let uid = parseInt(a)+1;
            let flagId = attachmentList[a].flagId;
            let ufileId = attachmentList[a].fileId;
            let caption = attachmentList[a].caption;
            let uindex = this.presetAttachments.findIndex(option => option.fileId == ufileId);
            if(uindex < 0) {
              let fileInfo = {
                fileId: ufileId,
                caption: caption,
                url: (flagId == 6) ? attachmentList[a].url : '',
                displayOrder: uid
              };
              this.presetAttachments.push(fileInfo);
            } else {
              this.presetAttachments[uindex].displayOrder = uid;
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
          let index = this.presetAttachments.findIndex(option => option.fileId == fileId);
          if(index < 0) {
            updatedAttachmentInfo['displayOrder'] = 0;
            this.presetAttachments.push(updatedAttachmentInfo);
          } else {
            this.presetAttachments[index].caption = caption;
            this.presetAttachments[index].url = url;
            this.presetAttachments[index].language = lang;
          }

          console.log(this.presetAttachments)
          break;
      }
    }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    let flag = false;
    localStorage.removeItem(threadPostStorageText);
    this.apiUrl.uploadCommentFlag = flag;
    this.apiUrl.tagCommentFlag = flag;
    this.apiUrl.uploadReplyFlag = flag;
    this.apiUrl.tagReplyFlag = flag;
    this.apiUrl.postButtonEnable = flag;
    this.apiUrl.postReplyButtonEnable = flag;
    this.apiUrl.postSaveButtonEnable = flag;
    this.apiUrl.checkDiscard = flag;
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
