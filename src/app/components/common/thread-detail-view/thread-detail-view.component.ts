import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ApiService } from '../../../services/api/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { Constant,RedirectionPage,pageTitle,IsOpenNewTab,PlatFormType,forumPageAccess } from '../../../common/constant/constant';
import * as moment from 'moment';
import { NgbModal, NgbModalConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FollowersFollowingComponent } from '../../../components/common/followers-following/followers-following.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from "rxjs";
import { BaseService } from 'src/app/modules/base/base.service';
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { AddLinkComponent } from '../../../components/common/add-link/add-link.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { Router } from '@angular/router';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
@Component({
  selector: 'app-thread-detail-view',
  templateUrl: './thread-detail-view.component.html',
  styleUrls: ['./thread-detail-view.component.scss']
})
export class ThreadDetailViewComponent implements OnInit {

  //@Input() threadViewData;
  @Input() detailView: string = "view-v2";
  @Input() innerHeight: any = 0;
  @Input() public resServices;
  @Output() activePosition: EventEmitter<any> = new EventEmitter();
  @Output() threadTranslateActionEmit: EventEmitter<any> = new EventEmitter();
  @Output() detailViewComponentRef: EventEmitter<ThreadDetailViewComponent> = new EventEmitter();
  @Output() detailViewCallBack: EventEmitter<ThreadDetailViewComponent> = new EventEmitter();
  @ViewChild('ttescalationInfo') estooltip : NgbTooltip;
  subscription: Subscription = new Subscription();

  public threadViewData: any = [];
  public loading:boolean = true;
  public searchLoading: boolean = false;
  public userRole:string = '';
  public threadPosted:string = '';
  public theadTitle:string= '';
  public year:string= '';
  public trim1:string= '';
  public trim2:string= '';
  public trim3:string= '';
  public trim4:string= '';
  public trim5:string= '';
  public trim6:string= '';
  public trim:string='';
  public serialNo:string='';
  public scanVersion:string='';
  public WorkOrder:string='';
  public repairOrder:string='';
  public repairOrderLink:string='';
  public dviPdfUrlLink:string='';
  public copiedModalPublic: boolean = false;
  public scanVinInfo: any = '';
  public tvsSystem:string='';
  public threadCreatedOn;
  public problemCont:string='';
  public curentDtclength;
  public curentDtcData;
  public currentDtcList: any = [];
  public taglength;
  public tagData;
  public partslength=0;
  public partsData=[];
  public categoryData;
  public categoryLength;
  public subCategoryData;
  public subCategoryLength;
  public productTypeData;
  public productTypeLength;
  public regionsData
  public regionsLength;
  public miles;
  public odometer;
  public occrance;
  public milesOdometer;
  public threadEdited;
  public attachmentLoading: boolean = true;
  public action = "view";
  public attachments: any;
  public opendaysCount;
  public opendaysFlag: boolean = false;
  public closeStatus;
  public userRoleTitle:string='';
  public countryId;
  public user:any;
  public domainId;
  public userId;
  public roleId;
  public threadId;
  public postId;
  public pinCountVal;
  public likeCountVal;
  public plusOneCountVal;
  public pinCount: number = 0;
  public likeCount: number = 0;
  public plusOneCount: number = 0;
  public pinImg;
  public likeImg;
  public plusOneImg;
  public pinLoading: boolean = false;
  public likeLoading: boolean = false;
  public plusOneLoading: boolean = false;
  public pinStatus: number = 0;
  public likeStatus: number = 0;
  public plusOneStatus: number = 0;
  public threadOwner: boolean =false;
  public threadUserId;
  public bodyElem;
  public industryType: any = [];
  public automobileFlag: boolean = false;
  public automobileDefaultImg: boolean = false;
  public techSubmmitFlag: boolean = false;
  public fixesView: boolean = false; 
  public escalateStatusLand='';
  public escalationAction='';
  public nextEscalation='';
  public nextEscalationText='';
  public missingEscalationValue='';

  public currentEscalation='';
  public currentEscalationText='';
  public nextNewEscalation='';
  public nextNewEscalationText='';
  public escColorCodes='';
  public escColorCodesValue='';
  public technicianId: string = '';
  public trimborder: boolean = false;
  public collabticDomain: boolean = false;
  public autoMobile: boolean = false;
  public tvsDomain: boolean = false;
  public tvsIBDomain: boolean = false;
  public tvsIndiaDomain: boolean = false;
  public productCoordinator: any = [];
  public territoryManager: any = [];
  public technicianInfo: any = [];
  public modelAttributes: any = [];
  public additionalInfo: any = [];
  public kaizenCategory: string = '';
  public locationVal: string = '';
  public ipAddr: string = '';
  public severityLevel: string = '';
  public userLoginMethod: string = '';
  public userAffectedDomain: string = '';
  public userEmailAddr: string = '';
  public ricohFlag: boolean = false;
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public CBADomain: boolean = false;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public audioThumb: string = `${this.mediaPath}/audio-medium.png`;
  public audioDesc: any = [];
  public displayDetail: boolean = false;
  public loadServiceFlag: boolean = false;
  public shareFixHours: string = "";
  public threadCatgFlag: boolean = true;
  public scanToolFlag: boolean = false;
  public escalationDescription: string = "";
  public escalationDescriptionUpdate: string = "";
  public viewVersion2: boolean = false;
  public threadCategoryStr: number = 0;
  public diagNationDomain: boolean = false;
  public collabticFixesDomain: boolean = false;
  public partsDataStrArrFlag: boolean = false;
  public moreInfo: boolean = false;
  public vinDetails: any = [];
  public likeModal: boolean = false;
  public pinModal: boolean = false;
  public copiedModal: boolean = false;
  public likeActionText: string = "";
  public pinActionText: string = "";

  constructor(
    private probingApi: ProductMatrixService,
    private router: Router,
    private commonApi: CommonService, 
    private baseSerivce: BaseService,
    private LandingpagewidgetsAPI: LandingpageService,
    private threadPostService: ThreadPostService,
    private authenticationService:AuthenticationService,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private modalConfig: NgbModalConfig,
  ) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';
   }

  ngOnInit(): void {

    if(this.apiUrl.threadViewPublicPage){
      this.domainId = this.apiUrl.threadViewPublicDomainId;
      this.userId = this.apiUrl.threadViewPublicUserId;
    }
    else{
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.roleId = this.user.roleId;
    this.userId = this.user.Userid;
    }
    this.countryId = localStorage.getItem('countryId');
    this.viewVersion2 = localStorage.getItem('threadView') == '1' ? true : false;
    /* let currUrl = this.router.url.split('/');
    if(currUrl[1] == 'threads' && currUrl[2] == 'view'){
      this.viewVersion2 = false;
    }
    else{
      this.viewVersion2 = true;
    } */
    this.displayDetail = (this.detailView == 'view-v2') ? true :false;
    let industryType:any = localStorage.getItem('industryType');
    let platformId = localStorage.getItem('platformId');
    if((this.domainId == '52' || this.domainId == '97') && platformId == '2' ){
      this.tvsDomain = true;
    }
    if((this.domainId == '97') && platformId == '2' ){
      this.tvsIBDomain = true;
    }
    if(this.domainId == '338'){
      this.diagNationDomain = true;
    }
    if(this.domainId == '336'){
      this.collabticFixesDomain = true;
    }
    this.tvsIndiaDomain = (this.domainId == '52' && platformId == '2' ) ? true : false;
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    if(!this.apiUrl.threadViewPublicPage){
      this.autoMobile = (industryType == 2) ? true : false;
    }

    this.fixesView = (this.detailView == 'view-v3') ? true : false;
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
      this.msTeamAccessMobile = false;
    }

    this.subscription.add(
      this.commonApi.threadListData.subscribe((r) => {
        console.log(r)
        console.log(this.threadViewData.detailType)
        // notification
        if(this.threadViewData.detailType!=undefined && this.threadViewData.detailType!=''){
          
          if(this.threadViewData.detailType == 'postcount'){
            this.threadViewData.comment = r['comment'];
            //return false;
          }
          else if(this.threadViewData.detailType == 'thread-like'){
    
            this.threadViewData.likeStatus = r['likeStatus'];
            this.threadViewData.likeCount =  r['likeCount'];
            this.threadViewData.likedUsers =  r['likedUsers'];
    
            if(this.threadViewData.likedUsers != undefined){
              this.threadViewData.likeStatus = 0;
              for(let a in this.threadViewData.likedUsers) {
                if(this.threadViewData.likedUsers[a] == this.userId) {
                  this.threadViewData.likeStatus = 1;
                }
              }
            }
            this.threadViewData.likeStatus = this.threadViewData.likeStatus;
            this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
            this.threadViewData.likeCount = this.threadViewData.likeCount;
            this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
            //return false;
          }
          else if(this.threadViewData.detailType == 'thread-pin'){
    
            this.threadViewData.pinStatus = r['pinStatus'];
              this.threadViewData.pinCount = r['pinCount'];
              this.threadViewData.pinedUsers = r['pinedUsers'];
    
            if(this.threadViewData.pinedUsers != undefined){
              this.threadViewData.pinStatus = 0;
              for(let a in this.threadViewData.pinedUsers) {
                if(this.threadViewData.pinedUsers[a] == this.userId) {
                  this.threadViewData.pinStatus = 1;
                }
              }
            }
    
            this.pinCount = this.threadViewData.pinCount;
            this.pinCountVal = this.threadViewData.pinCount == 0 ? '-' : this.threadViewData.pinCount;
            this.pinStatus = this.threadViewData.pinStatus;
            this.pinImg = (this.threadViewData.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';
            //return false;
          }
          else if(this.threadViewData.detailType == 'thread-plusOne'){
    
            this.threadViewData.plusOneStatus = r['plusOneStatus'];
            this.threadViewData.plusOneCount = r['plusOneCount'];
            this.threadViewData.plusOneUsers = r['plusOneUsers'];
    
            if(this.threadViewData.plusOneUsers != undefined){
              this.threadViewData.plusOneStatus = 0;
              for(let a in this.threadViewData.plusOneUsers) {
                if(this.threadViewData.plusOneUsers[a] == this.userId) {
                  this.threadViewData.plusOneStatus = 1;
                }
              }
            }
            this.plusOneCount = this.threadViewData.plusOneCount;
            this.plusOneCountVal = (this.threadViewData.plusOneCount == 0) ? '-' : this.threadViewData.plusOneCount;
            this.plusOneStatus = this.threadViewData.plusOneStatus;
            this.plusOneImg = (this.threadViewData.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';
            //return false;
          }
          else if(this.threadViewData.detailType == 'comment-postStatus' || this.threadViewData.detailType == 'reply-postStatus'){
            this.threadViewData.fixStatus = r['fixStatus'];
            this.threadViewData.fixPostStatus = r['fixPostStatus'];
            //return false;
          }
          else if(this.threadViewData.detailType == 'thread-edit' ){
            this.threadViewData = [];
            this.threadViewData = r;
            this.getThreadInfo();
          }
          else{ }
          this.threadViewData.detailType = '';
        }
        // notification
        else{
          console.log(132)
          this.threadViewData = [];
          this.threadViewData = r;
          this.getThreadInfo();
        }
      })
    );

    setTimeout(() => {
      this.detailViewCallBack.emit(this);
    }, 150);

   }
   taponDescription1(content,postData)
   {
 this.commonApi.fetchlangData(content).subscribe(res => {

   console.log(res);
   console.log(res.data.translations[0].translatedText);
   if(res.data.translations[0].translatedText)
   {
     this.threadViewData.threadTitle=res.data.translations[0].translatedText;
   }


 });


   }

   taponDescription2(content,postData)
   {
 this.commonApi.fetchlangData(content).subscribe(res => {

   console.log(res);
   console.log(res.data.translations[0].translatedText);
   if(res.data.translations[0].translatedText)
   {
     this.threadViewData.content=res.data.translations[0].translatedText;
   }


 });


   }
   getThreadInfo(){
    this.threadCategoryStr = parseInt(this.threadViewData.threadCategoryStr);
    this.modelAttributes = (this.threadViewData.modelAttributes && this.threadViewData.modelAttributes.length > 0) ? this.threadViewData.modelAttributes : [];
    let additionalInfo:any = '';
    if(this.modelAttributes.length > 0) {
      let modelAttr = this.modelAttributes[0];
      let additionalInfo1 = modelAttr.additionalInfo;
      let additionalInfo2 = modelAttr.additionalInfo1;
      let additionalInfo3 = modelAttr.additionalInfo2;
      let additionalInfo4 = modelAttr.additionalInfo3;
      let additionalInfo5 = modelAttr.additionalInfo4;
      let additionalInfo6 = modelAttr.additionalInfo5;
      if(additionalInfo1 && additionalInfo1.length > 0) { additionalInfo = `${additionalInfo1[0].name}` }
      if(additionalInfo2 && additionalInfo2.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo2[0].name}` }
      if(additionalInfo3 && additionalInfo3.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo3[0].name}` }
      if(additionalInfo4 && additionalInfo4.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo4[0].name}` }
      if(additionalInfo5 && additionalInfo5.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo5[0].name}` }
      if(additionalInfo6 && additionalInfo6.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo6[0].name}` }
    }

    if(this.apiUrl.threadViewPublicPage) {
      this.autoMobile = (this.threadViewData.industryType.id == 2) ? true : false;
    }
    this.additionalInfo = additionalInfo;
    if(this.collabticDomain && this.autoMobile) {
      console.log(this.threadViewData)
      let replacement = 'XXXXXX';
      if(this.threadViewData.vinNo) {
        this.threadViewData['vinFixes'] = this.threadViewData.vinNo.slice(0, -6) + replacement;
        this.getVinDetail();
      }
    }
    
    let platformId = localStorage.getItem('platformId');
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.displayDetail = true;
    console.log(this.threadViewData);
    this.industryType = this.threadViewData.industryType;
    console.log(this.industryType);
    this.threadEdited = this.threadViewData.IsEdited;
    this.threadViewData.comment=this.threadViewData.comment;
    this.threadViewData.contentWeb=this.threadViewData.contentWeb;
    this.threadId = this.threadViewData.threadId;
    this.postId =  this.threadViewData.postId;
    this.threadViewData.userId = this.threadViewData.userId;
    this.threadViewData.availability = this.threadViewData.availability;
    if(this.collabticFixesDomain){

      this.partsDataStrArrFlag = true;
    }
    /*this.userRoleTitle = this.threadViewData.userRoleTitle !='' && this.threadViewData.userRoleTitle != 'undefined' && this.threadViewData.userRoleTitle != undefined ? this.threadViewData.userRoleTitle : '';
    this.userRoleTitle = this.userRoleTitle == '' ? this.threadViewData.badgeStatus : this.threadViewData.badgeStatus+", "+this.userRoleTitle;*/
    this.userRoleTitle = this.threadViewData.userRoleTitle !='' && this.threadViewData.userRoleTitle != undefined ? this.threadViewData.userRoleTitle : this.threadViewData.badgeStatus;
    this.techSubmmitFlag = (this.threadViewData.summitFix == '1') ? true : false;
    console.log(this.techSubmmitFlag);
    this.escalateStatusLand =this.threadViewData.escalateStatusLand != undefined ? this.threadViewData.escalateStatusLand:'';
    if(this.tvsIBDomain){
      if(this.threadViewData.escalationDescription != ''){
        this.escalationDescription = this.threadViewData.escalationDescription;
        setTimeout(() => {
          this.estooltip.open();
        }, 1000);
      }
      if(this.threadViewData.escalationDescriptionArr){
        this.escalationDescription='';
       let escalationDescriptionUpdate=this.threadViewData.escalationDescriptionArr;
        for(let desUpdate in escalationDescriptionUpdate) {
          let createdOnNew = escalationDescriptionUpdate[desUpdate].date;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    let createdOnDateEsc = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');

          //this.escalationDescription += '<div style="margin-top:5px;"><span class="estext-title">'+escalationDescriptionUpdate[desUpdate].title+' on '+createdOnDateEsc+' </span><div *ngIf="escalationDescriptionUpdate[desUpdate].missingEscalation" class="estext-desp" style="padding-bottom: 6px;">'+escalationDescriptionUpdate[desUpdate].missingEscalation+'</div><div class="estext-desp">Note: '+escalationDescriptionUpdate[desUpdate].notes+'</div></div>'
          this.escalationDescription += '<div ><div><span class="estext-titleV-img" style="vertical-align:text-bottom"><img src="assets/images/thread-detail/escalation_esc_icon.png"></span><span class="estext-titleV-text">'+escalationDescriptionUpdate[desUpdate].title+'</span</div><div><span class="estext-titleV-img" style="vertical-align:text-bottom"><img src="assets/images/thread-detail/escalation_esc_calender.png"></span><span class="estext-titleV-text">'+createdOnDateEsc+'</span</div><div><span class="estext-titleV-img" style="vertical-align:text-bottom"><img src="assets/images/thread-detail/escalation_esc_notes.png"></span><span class="estext-titleV-text">'+escalationDescriptionUpdate[desUpdate].notes+'</span</div><div class="main-escV-header"></div></div>'
        }
        setTimeout(() => {
          this.estooltip.open();
        }, 1000);
      }

      this.escalationAction  = this.threadViewData.escalationAction;
      //this.escalationAction  = '1';
      this.currentEscalation = this.threadViewData.escalateStatusLand;
      this.nextNewEscalation = '';

      this.nextNewEscalationText = '';

      this.nextEscalation= this.threadViewData.nextEscalationValue;
      this.nextEscalationText= this.threadViewData.nextEscalationText;
      this.missingEscalationValue= this.threadViewData.missingEscalationValue;

      switch(this.currentEscalation){
        case 'L1':
          this.currentEscalationText = 'L1';
       //   this.nextEscalation = 'L2';
         // this.nextEscalationText = 'Escalate to L2';
          break;
        case 'L2':
          this.currentEscalationText = 'L2';
         // this.nextEscalation = 'L3';
         // this.nextEscalationText = 'Escalate to L3';
          break;
        case 'L3':
          this.currentEscalationText = 'L3';
        //  this.nextEscalation = 'L4';
         // this.nextEscalationText = 'Escalate to L4';
          break;
        case 'L4':
          this.currentEscalationText = 'L4';
        //  this.nextEscalation = 'L5';
        //  this.nextEscalationText = 'Escalate to L5';
          break;
        case 'L5':
          this.currentEscalationText = 'L5';
         // this.nextEscalation = 'L6';
        //  this.nextEscalationText = 'Escalate to L6';
          //this.nextNewEscalation = 'qadL1';
          //this.nextNewEscalationText = 'QAD L1';
          break;
        case 'L6':
          this.currentEscalationText = 'L6';
         // this.nextEscalation = 'qadL1';
         // this.nextEscalationText = 'QAD L1';
          break;
        case 'qadl1':
        case 'qadL1':
          this.currentEscalationText = 'QAD L1';
        //  this.nextEscalation = 'qadL2';
        //  this.nextEscalationText = 'QAD L2';
          break;
        case 'qadL2':
        case 'qadl2':
          this.currentEscalationText = 'QAD L2';
        //  this.nextEscalation = 'qadL3';
         // this.nextEscalationText = 'QAD L3';
          break;
        case 'qadl3':
        case 'qadL3':
          this.currentEscalationText = 'QAD L3';
         // this.nextEscalation = '';
         // this.nextEscalationText = '';
          break;
        default:
          this.currentEscalationText = '';
          this.nextEscalation = '';
          this.nextEscalationText = '';
        break;
      }

    }

    this.escColorCodes = this.threadViewData.escColorCodes;
    this.escColorCodesValue = this.threadViewData.escColorCodesValue;
    this.threadViewData.techSubmmitFlag = this.techSubmmitFlag;

    if(this.threadViewData.techSubmmitFlag){
      let techinfo = this.threadViewData.technicianInfo[0];
      this.technicianId = techinfo.id;
      this.threadViewData.userName = techinfo.name;
      this.threadViewData.profileImage = techinfo.profileImg;

      let dealerInfo:any;
      if(this.displayDetail){
        dealerInfo = (this.threadViewData.dealerInfoJsonArr !="" && this.threadViewData.dealerInfoJsonArr != undefined) ? this.threadViewData.dealerInfoJsonArr[0] : '';
      }
      else{
        dealerInfo = (this.threadViewData.dealerInfo !="" && this.threadViewData.dealerInfo != undefined) ? this.threadViewData.dealerInfo[0] : '';
      }
            
      this.userRoleTitle = dealerInfo.dealerName != '' ? this.userRoleTitle+", "+dealerInfo.dealerName : this.userRoleTitle ;
    }
    else{
      this.threadViewData.userName = this.threadViewData.userName;
      this.threadViewData.profileImage = this.threadViewData.profileImage;
    }

    this.threadUserId = this.threadViewData.userId;

    if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1){
      this.threadOwner = true;
    }
    else{
      this.threadOwner = false;
    }

    if(this.domainId!=this.threadViewData.domainId)
    {
      //this.threadOwner = true;
    }

    if(this.CBADomain) {
      let wsItem = this.threadViewData.WorkstreamsList;
      let wsId = wsItem[0].workstreamId
      this.threadCatgFlag = (wsId == 1) ? false : this.threadCatgFlag;
      this.scanToolFlag = (this.threadViewData.scanToolFlag) ? true : false;
      if(this.scanToolFlag) {
        this.scanVersion = this.threadViewData.scanVersion;
      }
    }

    if(platformId == PlatFormType.Collabtic && (this.domainId == 1 || this.domainId == 267)) {
      let threadCatgData = this.threadViewData.threadCategoryData;
      if(Array.isArray(threadCatgData) && threadCatgData.length > 0) {
        let threadCatgId = parseInt(threadCatgData[0].id);
        this.ricohFlag = (threadCatgId == 6) ? true : false;
      }
      this.locationVal = this.threadViewData.location;
      this.ipAddr = this.threadViewData.ipAddress;
      this.severityLevel = this.threadViewData.serverityLevelName;
      this.userLoginMethod = this.threadViewData.userLoginMethodName;
      this.userAffectedDomain = this.threadViewData.affectedUserDomain;
      let replace = /,/gi;
      //this.threadViewData.userEmailAddress = this.threadViewData.userEmailAddress.replace(replace, ", ");
      //this.userEmailAddr = this.threadViewData.userEmailAddress;

      let userEmailAddr: any = this.threadViewData.userEmailAddressData;
      if(Array.isArray(userEmailAddr)) {
        userEmailAddr = userEmailAddr.join(', ');
        this.userEmailAddr = userEmailAddr;
      }
    }

    let createdOnNew = this.threadViewData.createdOnNew;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    this.threadCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
    //this.threadCreatedOn = moment(createdOnDate).local().format('MMM DD, h:mm A');
    console.log(this.threadViewData.createdOnNew);

    this.closeStatus = this.threadViewData.closeStatus;
    if(this.closeStatus == 0){
      var now = moment(new Date()); //todays date
      var end = moment(createdOnDate).local().format('YYYY-MM-DD'); // another date
      var duration = moment.duration(now.diff(end));
      var days = duration.asDays();
      this.opendaysCount = Math.trunc(days);
      this.opendaysFlag = this.opendaysCount==0 ? true : false;
      this.opendaysCount = this.opendaysCount>1 ? 'open '+this.opendaysCount+' days' :  'open '+this.opendaysCount+' day';
    }

    this.threadPosted = this.threadViewData.postedFrom == '' ? '' : this.threadViewData.postedFrom;
    this.year = this.threadViewData.year;
    if(this.industryType.id != 2) {
      this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1 != undefined && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1 : '';
      this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2 != undefined && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2 : '';
      this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3 && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3 : '';
      if(this.trim1 != ''){
        if(this.trim2 != ''){
          if(this.trim3 != ''){
            this.trim = this.trim1+", "+this.trim2+", "+this.trim3;
          }
          else{
            this.trim = this.trim1+", "+this.trim2;
          }
        }
        else{
          if(this.trim3 != ''){
            this.trim = this.trim1+", "+this.trim3;
          }
          else{
            this.trim = this.trim1;
          }
        }
      }
      else{
        if(this.trim2 != ''){
          if(this.trim3 != ''){
            this.trim = this.trim2+", "+this.trim3;
          }
          else{
            this.trim = this.trim2;
          }
        }
        else{
          if(this.trim3 != ''){
            this.trim = this.trim3;
          }
          else{
            this.trim = "";
          }
        }
      }
    }

    if(this.industryType.id == 2) {
      /*this.trim = '';
      this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1[0].name : '';
      this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2[0].name : '';
      this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3 != "[]" && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3 : '';
      this.trim4 = (this.threadViewData.trim4 != "" && this.threadViewData.trim4 != "[]" && this.threadViewData.trim4.length>0) ? this.threadViewData.trim4[0].name : '';
      this.trim5 = (this.threadViewData.trim5 != "" && this.threadViewData.trim5 != "[]" && this.threadViewData.trim5.length>0) ? this.threadViewData.trim5[0].name : '';
      this.trim6 = (this.threadViewData.trim6 != "" && this.threadViewData.trim6 != "[]" && this.threadViewData.trim6.length>0) ? this.threadViewData.trim6[0].name : '';
      this.trim  = (this.trim1 != '') ? this.trim1 : '';
      this.trim  = (this.trim2 != '') ? `${this.trim}, ${this.trim2}` : this.trim;
      this.trim  = (this.trim3 != '') ? `${this.trim}, ${this.trim3}` : this.trim;
      this.trim  = (this.trim4 != '') ? `${this.trim}, ${this.trim4}` : this.trim;
      this.trim  = (this.trim5 != '') ? `${this.trim}, ${this.trim5}` : this.trim;
      this.trim  = (this.trim6 != '') ? `${this.trim}, ${this.trim6}` : this.trim;
      this.trim = (this.trim.length && this.trim[0] === ',') ? this.trim.substring(1) : this.trim;
      this.trim = (this.trim.length && this.trim[0] === ' ') ? this.trim.substring(1) : this.trim;*/
      this.automobileFlag = true;
      this.automobileDefaultImg = (this.threadViewData.isDefaultBanner == 0) ? false : true;

      /*this.threadViewData.trims = [];

      if(this.industryType.id == 2) {
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
        this.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
        console.log(this.trim);

        if(this.threadViewData.trims!=''){
          if(this.threadViewData.trims.length>3){
            this.trimborder = true;
          }
        }
        console.log(this.threadViewData.trims);

      }*/
    }

    let hoursforFix = this.threadViewData.hoursforFix != '' && this.threadViewData.hoursforFix != null ? this.threadViewData.hoursforFix : '';
    let minforFix = this.threadViewData.minforFix != '' && this.threadViewData.minforFix != null ? this.threadViewData.minforFix : '';
    if(hoursforFix != "" && minforFix != "" ){
      this.shareFixHours = hoursforFix+" - "+minforFix;
    }
    else if(hoursforFix != "" && minforFix == "" ){
      this.shareFixHours = hoursforFix;
    }
    else if(hoursforFix == "" && minforFix != "" ){
      this.shareFixHours = minforFix;
    }
    else{
      this.shareFixHours = "";
    }
    this.serialNo = this.threadViewData.serialNo != '' && this.threadViewData.serialNo != null ? this.threadViewData.serialNo : '';
    this.WorkOrder = this.threadViewData.WorkOrder !='' && this.threadViewData.WorkOrder != null ? this.threadViewData.WorkOrder : '';
    this.WorkOrder = this.threadViewData.workOrder !='' && this.threadViewData.workOrder != null ? this.threadViewData.workOrder : this.WorkOrder;
   console.log(this.WorkOrder +'--'+this.threadViewData.WorkOrder);
    this.odometer = this.threadViewData.odometer !='' && this.threadViewData.odometer != null ? this.threadViewData.odometer : '' ;
    this.miles = this.threadViewData.miles !='' && this.threadViewData.miles != null ? this.threadViewData.miles : '';

    if(this.tvsDomain){
      this.kaizenCategory = this.threadViewData.kaizenCategory !='' && this.threadViewData.kaizenCategory != null ? this.threadViewData.kaizenCategory : '';
      // this.tvsSystem = this.threadViewData.systemSelection !='' && this.threadViewData.systemSelection != null ? this.threadViewData.systemSelection : '';
      // this.repairOrder = this.threadViewData.repairOrder !='' && this.threadViewData.repairOrder != null ? this.threadViewData.repairOrder : '';
      this.occrance = this.threadViewData.occrance !='' && this.threadViewData.occrance != null ? this.threadViewData.occrance : '';
       
      if(this.displayDetail){
        this.productCoordinator = (this.threadViewData.productCoordinatorJsonArr !="" && this.threadViewData.productCoordinatorJsonArr != undefined) ? this.threadViewData.productCoordinatorJsonArr[0] : '';
        this.territoryManager = (this.threadViewData.territoryManagerJsonArr !="" && this.threadViewData.territoryManagerJsonArr != undefined) ? this.threadViewData.territoryManagerJsonArr : '';
        this.technicianInfo = (this.threadViewData.technicianInfoJsonArr !="" && this.threadViewData.technicianInfoJsonArr != undefined) ? this.threadViewData.technicianInfoJsonArr[0] : '';
     
      }
      else{
        this.productCoordinator = (this.threadViewData.productCoordinator !="" && this.threadViewData.productCoordinator != undefined) ? this.threadViewData.productCoordinator[0] : '';
        this.territoryManager = (this.threadViewData.territoryManager !="" && this.threadViewData.territoryManager != undefined) ? this.threadViewData.territoryManager : '';
        this.technicianInfo = (this.threadViewData.technicianInfo !="" && this.threadViewData.technicianInfo != undefined) ? this.threadViewData.technicianInfo[0] : '';
     
      }
    }

    if(this.CBADomain) {
      let workOrder = this.threadViewData.workOrder;
      if(workOrder != '') {
        this.WorkOrder = workOrder;
        this.repairOrderLink = this.threadViewData.roUrl;
        this.dviPdfUrlLink = this.threadViewData.dviPdfUrl;
      }
      this.scanVinInfo = (this.threadViewData.scanVinInfo && this.threadViewData.scanVinInfo != '') ? JSON.parse(this.threadViewData.scanVinInfo) : this.threadViewData.scanVinInfo;
    }

    if(this.odometer != ''){
      console.log(this.odometer);
      this.odometer = this.commonApi.removeCommaNum(this.odometer);
      if(this.tvsDomain) {
        this.odometer = this.commonApi.numberWithCommasTwoDigit(this.odometer);
      }
      else{
        this.odometer = this.commonApi.numberWithCommasThreeDigit(this.odometer);
      }
      this.milesOdometer = this.odometer+" "+this.miles;
    }

    this.curentDtclength = 0;
    if (this.threadViewData.currentDtc && this.threadViewData.currentDtc.length > 0) {
      this.curentDtclength = this.threadViewData.currentDtc.length;
      this.curentDtcData = this.threadViewData.currentDtc;
      let dtcList = [];
      this.curentDtcData.forEach((item, i) => {
        let dtcItem = item.code;
        let seperator = (this.curentDtclength > 1 && this.curentDtclength < i) ? ',' : '';
        dtcItem = (item.description != '') ? `${dtcItem} ${item.description}` : dtcItem;
        dtcItem = (i > 0) ? `${seperator} ${dtcItem}` : dtcItem;
        dtcList.push(dtcItem);
      });
      this.currentDtcList = dtcList;
    }
    this.taglength = 0;
    if (this.threadViewData.tags && this.threadViewData.tags.length > 0) {
      this.taglength = this.threadViewData.tags.length;
      this.tagData = this.threadViewData.tags;
    }
    console.log(this.threadViewData.partsDataStrArr)
    console.log(this.threadViewData.partsDataJsonArr)

    this.partsData=[];
    this.partslength=0;
    if(this.partsDataStrArrFlag){
      if (this.threadViewData.partsDataJsonArr) {
        let arrVal = (this.threadViewData.partsDataJsonArr);
        console.log(arrVal)
        this.partslength = arrVal.length;
        if(this.partslength>0){
          for(let st in arrVal){
            let id = arrVal[st].id;
            let partDesc = arrVal[st].partDesc;
            let partNumber = arrVal[st].partNumber;
            let partData = "Part# "+partNumber+" - "+partDesc;
            console.log(partData)
            this.partsData.push(partData);
          }
          console.log(this.partsData)
        }

      }
    }


    this.categoryLength = 0;
    this.categoryData = this.threadViewData.prodappId !='' && this.threadViewData.prodappId != null ? this.threadViewData.prodappId : '';
    if(this.categoryData!= '' ){ this.categoryLength = this.categoryData.length;}

    this.subCategoryLength = 0;
    this.subCategoryData = this.threadViewData.prodcatId !='' && this.threadViewData.prodcatId != null ? this.threadViewData.prodcatId : '';
    this.subCategoryLength = this.subCategoryData.length;

    this.productTypeLength = 0;
    this.productTypeData = this.threadViewData.prodtypeId !='' && this.threadViewData.prodtypeId != null ? this.threadViewData.prodtypeId : '';
    this.productTypeLength = this.productTypeData.length;

    this.regionsLength = 0;
    this.regionsData = this.threadViewData.regions !='' && this.threadViewData.regions != null ? this.threadViewData.regions : '';
    this.regionsLength = this.regionsData.length;

    this.likeCount = this.threadViewData.likeCount;
    this.threadViewData.likeCount = this.threadViewData.likeCount;
    this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
    if(this.viewVersion2){
      if(this.threadViewData.likedUsers != undefined){
        this.threadViewData.likeStatus = 0;
        for(let a in this.threadViewData.likedUsers) {
          if(this.threadViewData.likedUsers[a] == this.userId) {
            this.threadViewData.likeStatus = 1;
          }
        }
      }
    }

    this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';

    if(this.viewVersion2){
      if(this.threadViewData.pinedUsers != undefined){
        this.threadViewData.pinStatus = 0;
        for(let a in this.threadViewData.pinedUsers) {
          if(this.threadViewData.pinedUsers[a] == this.userId) {
            this.threadViewData.pinStatus = 1;
          }
        }
      }
    }
    this.pinCount = this.threadViewData.pinCount;
    this.pinCountVal = this.threadViewData.pinCount == 0 ? '-' : this.threadViewData.pinCount;
    this.pinStatus = this.threadViewData.pinStatus;
    this.pinImg = (this.threadViewData.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';

    if(this.viewVersion2){
      if(this.threadViewData.plusOneUsers != undefined){
        this.threadViewData.plusOneStatus = 0;
        for(let a in this.threadViewData.plusOneUsers) {
          if(this.threadViewData.plusOneUsers[a] == this.userId) {
            this.threadViewData.plusOneStatus = 1;
          }
        }
      }
    }
    this.plusOneCount = this.threadViewData.plusOneCount;
    this.plusOneCountVal = (this.threadViewData.plusOneCount == 0) ? '-' : this.threadViewData.plusOneCount;
    this.plusOneStatus = this.threadViewData.plusOneStatus;
    this.plusOneImg = (this.threadViewData.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';

    if(!this.loadServiceFlag){
      this.audioDesc = [];
      if(this.threadViewData.audioDescription) {
        let a = 0;
        this.audioDesc = this.threadViewData.audioDescription;
      }
      this.attachments = [];
      if((this.threadViewData.uploadContents && this.threadViewData.uploadContents.length>0)){
        this.attachments = this.threadViewData.uploadContents;
        this.attachmentLoading = true;
        setTimeout(() => {
          this.attachmentLoading = false;
        }, 100);
      }

       }
      let likeCount = this.commonApi.formatCompactNumber(this.likeCount);
      let pinCount = this.commonApi.formatCompactNumber(this.pinCount);
      let viewCount = this.commonApi.formatCompactNumber(this.threadViewData.viewCount);
      this.threadViewData.likeCount = likeCount;
      this.threadViewData.pinCount = pinCount;
      this.threadViewData.viewCount = viewCount;
       
    this.threadViewData.causeOfProblem = (this.threadViewData.causeOfProblem != undefined && this.threadViewData.causeOfProblem !=  '') ? this.threadViewData.causeOfProblem : '' ;
    if(this.threadViewData.editHistory != undefined){
        let editdata =this.threadViewData.editHistory;
        for (let ed in editdata) {
        let editdate1 = editdata[ed].updatedOnNew;
        let editdate2 = moment.utc(editdate1).toDate();
        editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');
      }
    }

    setTimeout(() => {
      this.loading = false;
      this.detailViewCallBack.emit(this);
    }, 100);
   }

   gotoPosition(val){
    this.activePosition.emit(val);
   }


   // Like, Pin and OnePlus Action
  socialAction(type, status) {
    console.log(type,status);
    let actionStatus = '';
    let actionFlag = true;
    let pinCount = this.pinCount;
    let likeCount = this.threadViewData.likeCount;
    let plusOneCount = this.plusOneCount;
    let url = RedirectionPage.Threads;
    let getNavDet = this.checkNavEdit(url);
    let pageDataInfo = getNavDet.dataInfo;
    setTimeout(() => {
      localStorage.setItem(getNavDet.navEditText, 'true')
    }, 150);
    switch(type) {
      case 'like':
      actionFlag = (this.threadViewData.likeLoading) ? false : true;
      actionStatus = (status == 0) ? 'liked' : 'disliked';
      this.threadViewData.likeStatus = (status == 0) ? 1 : 0;
      this.threadViewData.likeStatus = this.threadViewData.likeStatus;
      this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
      this.threadViewData.likeCount = (status == 0) ? likeCount+1 : likeCount-1;
      this.threadViewData.likeCount = this.commonApi.formatCompactNumber(this.threadViewData.likeCount);
      this.threadViewData.likeCount = this.threadViewData.likeCount;
      this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
      this.likeActionText = (status == 0) ? 'Liked' : 'Disliked';
      this.likeModal = true;
      setTimeout(() => {
        this.likeActionText = '';
        this.likeModal = false;
      }, 1200);
      break;
      case 'pin':
      actionFlag = (this.pinLoading) ? false : true;
      actionStatus = (status == 0) ? 'pined' : 'dispined';
      this.pinStatus = (status == 0) ? 1 : 0;
      this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';
      this.pinCount = (status == 0) ? pinCount+1 : pinCount-1;
      this.threadViewData.pinCount = this.commonApi.formatCompactNumber(this.pinCount);
      this.pinCount = this.pinCount;
      this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
      this.threadViewData.pinCount = this.pinCountVal;
      this.threadViewData.pinStatus = this.pinStatus;
      this.pinActionText = (status == 0) ? 'Pinned' : 'Unpinned';
      this.pinModal = true;
      setTimeout(() => {
        this.pinActionText = '';
        this.pinModal = false;
      }, 1200);
      break;

      case 'plusone':
      actionFlag = (this.plusOneLoading) ? false : true;
      actionStatus = (status == 0) ? 'Yes' : 'No';
      this.plusOneStatus = (status == 0) ? 1 : 0;
      this.plusOneStatus = this.plusOneStatus;
      this.plusOneImg = (this.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';
      this.plusOneCount = (status == 0) ? plusOneCount+1 : plusOneCount-1;
      this.plusOneCount = this.plusOneCount;
      this.plusOneCountVal = this.plusOneCount == 0 ? '-' : this.plusOneCount;
      this.threadViewData.plusOneCount = this.plusOneCountVal;
      break;
    }
    localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
    if(actionFlag) {
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('postId', this.postId);
      apiFormData.append('ismain','1');
      apiFormData.append('status', actionStatus);
      apiFormData.append('type', type);

      this.threadPostService.addLikePinOnePlus(apiFormData).subscribe((response) => {
        localStorage.setItem("newUpdateOnThreadId",this.threadId);
        if(response.status != 'Success') {
         
          switch(type) {
            case 'like':
            this.threadViewData.likeStatus = status;
            this.threadViewData.likeStatus = this.threadViewData.likeStatus;
            this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';
            this.threadViewData.likeCount = (status == 0) ? likeCount-1 : likeCount+1;
            this.threadViewData.likeCount = this.threadViewData.likeCount;
            this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
            break;

            case 'pin':
            this.pinStatus = status;
            this.pinStatus = this.pinStatus;
            this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';
            this.pinCount = (status == 0) ? pinCount-1 : pinCount+1;
            this.pinCount = this.pinCount;
            this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
            this.threadViewData.pinCount = this.pinCountVal;
            break;

            case 'plusone':
            this.plusOneStatus = status;
            this.plusOneStatus = this.plusOneStatus;
            this.plusOneImg = (this.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';
            this.plusOneCount = (status == 0) ? plusOneCount-1 : plusOneCount+1;
            this.plusOneCount = this.plusOneCount;
            this.plusOneCountVal = this.plusOneCount == 0 ? '-' : this.plusOneCount;
            this.threadViewData.plusOneCount = this.plusOneCountVal;
            break;
          }
          setTimeout(() => {
            localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
          }, 50);
        }
        else{

          let apiData = new FormData();
          apiData.append('apiKey', Constant.ApiKey);
          apiData.append('domainId', this.domainId);
          apiData.append('countryId', this.countryId);
          apiData.append('userId', this.userId);
          if(this.viewVersion2){
            apiData.append('threadId', this.threadId);
            apiData.append('silentPush', '1');
            if(type == 'like'){
              apiData.append('action', 'thread-like');
            }
            if(type == 'pin'){
              apiData.append('action', 'thread-pin');
            }
            if(type == 'plusone'){
              apiData.append('action', 'thread-plusOne');
            }
            localStorage.setItem("newUpdateOnThreadId",this.threadId);
          }
          if(actionStatus == 'disliked' || actionStatus == 'dispined' || actionStatus == 'No'){}
          else{
          this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
          }

          let apiDatasocial = new FormData();
          apiDatasocial.append('apiKey', Constant.ApiKey);
          apiDatasocial.append('domainId', this.domainId);
          apiDatasocial.append('threadId', this.threadId);
          apiDatasocial.append('userId', this.userId);
          apiDatasocial.append('action', type);
          apiDatasocial.append('actionType', '1');
          let platformIdInfo = localStorage.getItem('platformId');
          if(platformIdInfo=='1' || platformIdInfo=='3' || platformIdInfo=='2')
          {
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
          }
        }
      });
    }
  }





  // thread like, pinned, posted user list
  threadDashboarUserList(dashboard,dashboardTab,threadId,postId,ismain){
    if(!this.msTeamAccessMobile && !this.apiUrl.threadViewPublicPage){
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
/*
  URLReplacer(str){
    let match = str.match(/(?:href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final=str;
    if(match)
    {
      match.map(url=>{
        console.log(url)
        final=final.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
      })
    }

    return final;
  }

  URLReplacer2(str){
    let match = str.match(/(?:href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final=str;
    if(match)
    {
    match.map(url=>{
      console.log(url)
      final=final.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
    })
  }
    return final;
  }
*/
  checkNavEdit(url) {
    //let wsNav:any = localStorage.getItem('wsNav');
    //let wsNavUrl = localStorage.getItem('wsNavUrl');
    //let url = (wsNav) ? wsNavUrl : this.navUrl;
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let navText = pageTitle[pageDataIndex].navEdit;
    let navFromEdit:any = localStorage.getItem(navText);
    let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
    setTimeout(() => {
      localStorage.removeItem(navText);
    }, 100);
    let data = {
      navEditText: navText,
      url: url,
      navFromEdit: navFromEdit,
      routeLoadIndex: routeLoadIndex,
      dataInfo: pageDataInfo
    };
    return data;
  }
  

  // tab on user profile page
  taponprofileclick(userId){
    if(!this.apiUrl.threadViewPublicPage){
      let teamSystem=localStorage.getItem('teamSystem');
      var aurl='profile/'+userId+'';
      //let viewUrl = `threads/view/${this.threadId}`;
      let domainId = localStorage.getItem('domainId');
      let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
      let view = (this.viewVersion2) ? viewPath : forumPageAccess.threadpageNew;
      let viewUrl = `${view}${this.threadId}`;
      /* if(domainId=='165' || domainId=='1' || domainId=='63')
      {
        viewUrl = `threads/view-v2/${this.threadId}`;
      } */
      localStorage.setItem('profileNavFrom', viewUrl);
      localStorage.setItem('technicianId', this.technicianId);
      if(teamSystem){
        //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
      }
      else{
        window.open(aurl, IsOpenNewTab.openNewTab);
      }
    }
  }

  changeTranslateType(ttype){
    this.threadTranslateActionEmit.emit(ttype);
  }

  updateEScalation(currentEsc){
    if(this.tvsIBDomain){
      this.remainderThread(currentEsc);
    }
  }


    // reminder Thread
    remainderThread(currentEsc){

      this.currentEscalation = this.currentEscalation;
      if(this.currentEscalation != currentEsc){
        this.nextEscalation = currentEsc;
      }

      let apiData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.threadViewData.countries,
        userId: this.userId,
        threadId: this.threadId,
        postId: this.postId,
        postedBy: this.threadViewData.userId,
        modelName: this.threadViewData.model,
        currentEscalation: this.currentEscalation,
        nextEscalation: this.nextEscalation,
        missingEscalation: this.missingEscalationValue,
        dealerCode: this.threadViewData.dealerCode
    }

      const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.reminderPOPUP = 'Escalate';
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.nextEscalationText = this.nextEscalationText;
      modalRef.componentInstance.threadId = this.threadId;
      modalRef.componentInstance.resServices.subscribe((receivedService) => {
        if(receivedService){
          modalRef.dismiss('Cross click');
          console.log(receivedService);
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = receivedService.result;
          setTimeout(() => {
            this.currentEscalation =  this.nextEscalation;
            this.nextEscalation = '';
            this.nextEscalationText = '';
            this.nextNewEscalation = '';
            this.nextNewEscalationText = '';
            this.escalationDescription = '';

            switch(this.currentEscalation){
              case 'L1':
                this.currentEscalationText = 'Escalate to L1';
                //this.nextEscalation = 'L2';
                //this.nextEscalationText = 'L2';
                break;
              case 'L2':
                this.currentEscalationText = 'Escalate to L2';
                //this.nextEscalation = 'L3';
                //this.nextEscalationText = 'L3';
                break;
              case 'L3':
                this.currentEscalationText = 'Escalate to L3';
                //this.nextEscalation = 'L4';
                //this.nextEscalationText = 'L4';
                break;
              case 'L4':
                this.currentEscalationText = 'Escalate to L4';
                //this.nextEscalation = 'L5';
                //this.nextEscalationText = 'L5';
                break;
              case 'L5':
                this.currentEscalationText = 'Escalate to L5';
                //this.nextEscalation = 'L6';
                //this.nextEscalationText = 'L6';
                //this.nextNewEscalation = 'qadl1';
                //this.nextNewEscalationText = 'QAD L1';
                break;
              case 'L6':
                this.currentEscalationText = 'Escalate to L6';
                //this.nextEscalation = 'qadl1';
                //this.nextEscalationText = 'QAD L1';
                break;
              case 'qadl1':
              case 'qadL1':
                this.currentEscalationText = 'QAD L1';
                //this.nextEscalation = 'qadl2';
                //this.nextEscalationText = 'QAD L2';
                break;
              case 'qadl2':
              case 'qadL2':
                this.currentEscalationText = 'QAD L2';
                //this.nextEscalation = 'qadl3';
                //this.nextEscalationText = 'QAD L3';
                break;
              case 'qadl3':
              case 'qadL3':
                this.currentEscalationText = 'QAD L3';
                //this.nextEscalation = '';
                //this.nextEscalationText = '';
                break;
              default:
                this.currentEscalationText = '';
                this.nextEscalation = '';
                this.nextEscalationText = '';
              break;
            }
            msgModalRef.dismiss('Cross click');
          },2000);
        }
      });
    }
    getUserProfileStatus(uid) {
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
        this.threadViewData.availability = availability;
        this.threadViewData.availabilityStatusName = availabilityStatusName;
        this.threadViewData.profileShow = true;
      });
    }

    gotoRepairOrderPage(threadId){
      if(this.diagNationDomain){
        let view = forumPageAccess.repairorderPage;
        let aurl = `${view}${threadId}`;
        let item = `${threadId}-new-tab`;
        localStorage.setItem(item, item);
        window.open(aurl, aurl);
      }
    }

  moreInfoNav() {
    this.moreInfo = true;
    this.detailViewCallBack.emit(this);
  }

  closeSidebar() {
    this.moreInfo = false;
  }

  getVinDetail() {
    const svcFormData = new FormData();
    svcFormData.set('apiKey', Constant.ApiKey);
    svcFormData.set('countryId', this.countryId);
    svcFormData.set('domainId', this.domainId);
    svcFormData.set('userId', this.userId);
    svcFormData.set('vin', this.threadViewData.vinNo);
    svcFormData.set('isDetail', '1')
    this.LandingpagewidgetsAPI.vehicleInfoByVIN(svcFormData).subscribe((response) => {
      let vinDetails = response.moreVinDetails;
      let validInfo = [];
      let invalidInfo = [];
      vinDetails.forEach(item => {
        if(item.value != '' && item.value != null) {
          if(item.name == 'VIN_number') {
            let replacement = 'XXXXXX';
            item.value = item.value.slice(0, -6) + replacement;
          }
          validInfo.push(item);
        } else {
          item.value = 'Unavailable';
          invalidInfo.push(item);
        }
      });
      this.vinDetails = [...validInfo, ...invalidInfo];
    });
  }

  copyLink(){
    console.log(this.router, this.router['location']._platformLocation.location.href)
    let currUrl = this.router['location']._platformLocation.location.href;
    let urlSplit = currUrl.split('/');
    let checkParam = 'search-page';
    let searchFlag = urlSplit.includes(checkParam);
    let lastIndex = parseInt(currUrl.lastIndexOf("/"));
    let copyUrl = currUrl.slice(0,lastIndex+1);
    if(searchFlag) {
      let navParam = 'threads/view-v3/'
      copyUrl = `${copyUrl}${navParam}${this.threadId}`;
    } else {
      copyUrl = `${copyUrl}${this.threadId}`;
    }    
    console.log(copyUrl)
    navigator.clipboard.writeText(copyUrl);
    this.copiedModal = true;
    setTimeout(() => {
      this.copiedModal = false;
    }, 1200);
  }

  publicCopyLink(){
    let currentURL11 = window.location.href;
    let currentURL21 = this.router.url;
    let currentURL31 = currentURL11.replace(currentURL21,"")
    let inId = this.industryType.id;
    let wsid = "1";
    let platformId = localStorage.getItem('platformId');

    let param1 = btoa(this.threadId);
    let param2 = btoa(this.postId);
    let param3 = btoa(this.domainId);
    let param4 = btoa(this.userId);
    let param5 = btoa(wsid);
    let param6 = btoa(inId);
    let param7 = btoa(platformId);
    
    console.log(param1,param2,param3,param4,param5,param6,param7);
    let copyUrl = currentURL31+"/auth/thread-view?param1="+param1+"&param2="+param2+"&param3="+param3+"&param4="+param4+"&param5="+param5+"&param6="+param6+"&param7="+param7;

    console.log(copyUrl);
    copyUrl = `${copyUrl}`;
    navigator.clipboard.writeText(copyUrl);
    this.copiedModalPublic = true;
    setTimeout(() => {
      this.copiedModalPublic = false;
    }, 1500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
