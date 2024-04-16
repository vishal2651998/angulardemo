import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../services/api/api.service';
import { Constant, ManageTitle, pageTitle, pageInfo, PlatFormType, RedirectionPage, IsOpenNewTab, windowHeight,forumPageAccess } from '../../../../common/constant/constant';
import { CommonService } from '../../../../services/common/common.service';
import { ThreadPostService } from '../../../../services/thread-post/thread-post.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { ThreadService } from '../../../../services/thread/thread.service';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import * as moment from 'moment';
import { Subscription } from "rxjs";
declare var $: any;
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @ViewChild('top',{static: false}) top: ElementRef;

  subscription: Subscription = new Subscription();
  public threadTxt: string = ManageTitle.thread;
  public title:string;
  public teamSystem = localStorage.getItem('teamSystem');
  public msTeamAccessMobile: boolean = false;
  public bodyElem;
  public footerElem;
  public bodyClass: string = "submit-loader";
  public secElement: any;
  public scrollPos: any = 0;

  public threadApiCall;
  public platformId: number = 0;
  public apiKey: string;
  public countryId;
  public domainId;
  public userId;
  public roleId;
  public user: any;
  public threadId: number = 0;
  public threadCatgVal: any = 0;
  public wsVal: any = 0;
  public threadInfo: any = [];
  public contentType: any = 2;
  public platformIdInfo = localStorage.getItem('platformId');
  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public threadApiData: object;

  public navUrl: string = "";
  public viewUrl: string = "";
  public manageAction: string = "new";
  public pageAccess: string = "manageThread";
  public threadType: string = 'thread';
  public saveText: string = "Post";
  public platform: number = 3;
  public step1Title: string = "";
  public step2Title: string = "";
  public apiFormFields: any = [{'step1': []}, {'step2': []}];
  public formFields: any = [{'step1': []}, {'step2': []}];
  public successMsg: string = "";
  public uploadedItems: any = [];
  public mediaUploadItems: any = [];
  public audioUploadedItems: any = [];
  public stepIndex: number;
  public stepTxt: string;
  public optionTxt: string = "Options";
  public bannerImage: string = "";
  public defaultBanner: boolean = false;
  public submitDisableFlag: boolean = true;
  public bottomAction: boolean = false
  public collabticDomain: boolean = false;
  public CBADomain: boolean = false;
  public tvsDomain: boolean = false;
  public TVSIBDomain: boolean = false;
  public requiredFlag: boolean = false;
  public newThreadView: boolean = false;
  public requiredFields: any = [];
  
  public industryType: any = [];
  threadForm: FormGroup;
  public pageInfo: any = [];
  public apiInfo: any = [];
  public baseApiUrl: string = "";
  public currYear: any = moment().add(2, 'years').format("Y");
  public initYear: number = 1960;
  public years = [];
  public makeInterval: any;
  
  public loading: boolean = true;
  public step2Loading: boolean = true;
  public bottomHeader: boolean = false
  public headerPosTop: boolean = false
  public headerPosBottom: boolean = false
  public step1: boolean = true;
  public step2: boolean = false;
  public step1Action: boolean = true;
  public step2Action: boolean = false;
  public step1Submitted: boolean = false;
  public step2Submitted: boolean = false;
  public stepBack: boolean = false;
  public saveDraftFlag: boolean = true;
  public threadUpload: boolean = true;
  public successFlag: boolean = false;
  public dialogModal: boolean = false;
  public dialogClose: boolean = false;
  public dialogEscClose: boolean = false;
  public dialogLoader: boolean = false;
  public repairVinErr: string = 'Could not retrieve VIN for the provided RO. Please enter VIN.';
  public repairErr: string = 'RO not found.';
  public repairDecode: string = 'Retrieving and decoding VIN..';
  public vinDecode: string = 'Decoding VIN..';
  public frameDecode: string = 'Decoding Frame Number..'
  public dialogContent: string = '';
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public rmHeight: any = 110;
  public rmSHeight: any = 120;
  public approvalEnableDomainFlag: boolean = false;
  public approveProcessFlag: boolean = false;
  public mainSection: number = 0;

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(!this.step1Submitted && !this.step2Submitted) {
      this.bodyHeight = window.innerHeight;     
      this.setScreenHeight();
    }
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private baseSerivce: BaseService,
    private location: Location,
    private formBuilder: FormBuilder,
    public acticveModal: NgbActiveModal,
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private threadApi: ThreadService,
    private threadPostService: ThreadPostService,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    if(this.teamSystem){
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }  
      else{
        this.msTeamAccessMobile = false;
      }  
    }
    this.apiKey = Constant.ApiKey;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
    this.viewUrl = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
    this.userId = this.user.Userid;
    this.roleId = parseInt(this.user.roleId);
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    
    let threadId = this.route.snapshot.params['id'];
    this.threadId = (threadId == 'undefined' || threadId == undefined) ? this.threadId : threadId;
    this.manageAction = (this.threadId == 0) ? 'new' : 'edit';
    //if(this.threadId > 0) {
      this.pageInfo.manageAction = this.manageAction;
    //}
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    if(this.domainId == '52' && platformId == '2'){
      this.tvsDomain = true;      
    }
    this.TVSIBDomain = (this.domainId == '97' && platformId == '2') ? true : false;
    this.mainSection = (this.collabticDomain && this.threadId == 0) ? 1 : 0;
    let navUrl = localStorage.getItem('threadNav');
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'threads' : navUrl;
    console.log(navUrl)
    //this.viewUrl = `${this.viewUrl}${this.threadId}`
    this.navUrl = (this.manageAction == 'new') ? 'threads' : navUrl;
    setTimeout(() => {
      localStorage.removeItem('threadNav');
    }, 500);
    this.bottomAction = !this.CBADomain;
    this.industryType = this.commonApi.getIndustryType();
    console.log(this.industryType)
    this.threadTxt = (this.industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : this.threadTxt;
    let platformId1 = localStorage.getItem("platformId");
    this.threadTxt = (platformId1=='3') ? ManageTitle.supportRequest : this.threadTxt;

    if( this.domainId==71 && platformId1=='1')
      {
        this.threadTxt=ManageTitle.supportServices;
      }
      if(this.domainId==Constant.CollabticBoydDomainValue && platformId1=='1')
      {
        this.threadTxt=ManageTitle.techHelp;
      }
    this.title = (this.threadId == 0) ? `${ManageTitle.actionNew} ${this.threadTxt}` : `${ManageTitle.actionEdit} ${this.threadTxt}`;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);

    this.approvalEnableDomainFlag = localStorage.getItem('shareFixApproval') == '1' ? true : false;
    this.approveProcessFlag = (this.roleId == 3 || this.roleId == 2) ? false : true;

    let headTitleText = '';
    let ma = this.threadId == 0 ? "new" : "edit";
    switch(ma){
      case 'new':
        headTitleText = this.title;
        break;
      case 'edit':
        headTitleText = this.threadTxt;
        break;      
    }

    this.headerData = {        
      title: headTitleText,
      action: ma,
      id: this.threadId     
    };

    let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      let yr = y.toString();
      this.years.push({
        id: yr,
        name: yr
      });
    }
    
    if(this.threadId > 0) {
      localStorage.removeItem('threadAttachments');
    }

    this.threadForm = this.formBuilder.group({});
    //let version = (this.industryType.id == 2 || (this.industryType.id == 1 && (this.domainId == 1 || this.domainId == 267))) ? 2 : 1;
    let version = 3;
    this.submitDisableFlag = (this.industryType.id == 2 || (this.industryType.id == 1 && (this.domainId == 1 || this.domainId == 267))) ? false : true;
    
    this.threadApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      step: 1,
      threadCategoryId: 2,
      threadType: this.threadType,
      docType: 0,
      threadId: this.threadId,
      platform: this.platform,
      apiType: 1,
      version: version,
      makeName: '',
      modelName: '',
      yearValue: '',
      productType: '',
      threadCategoryValue: ''
    };

    this.pageInfo = {
      access: 'thread',
      baseApiUrl: this.baseApiUrl,
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      manageAction: this.manageAction,
      threadUpload: this.threadUpload,
      step: this.stepTxt,
      stepBack: this.stepBack,
      step1Submitted: this.step1Submitted,  
      step2Submitted: this.step2Submitted,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      audioUploadedItems: [],
      audioAttachments: [],
      audioAttachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: [],
      industryType: this.industryType,
    };

    setTimeout(() => {
      this.setScreenHeight();

      // Get Thread Fields
      this.getThreadFields();
    }, 200);

    this.subscription.add(
      this.commonApi.dynamicFieldDataResponseSubject.subscribe((response) => {
        console.log(response);
        let industryType = this.industryType.id;
        //console.log(industryType)
        if(response['type'] == 'updated-attachments') {
          console.log(response)
          switch(response['action']) {
            case 'media':
              this.pageInfo.deletedFileIds = response['deletedFileIds'];
              this.pageInfo.removeFileIds = response['removeFileIds'];
              break;
            case 'audio':
              this.pageInfo.deletedFileIds = response['deletedFileIds'];
              this.pageInfo.removeFileIds = response['removeFileIds'];
              let audioUploadedItems = response['uploadedItems'];
              if(audioUploadedItems != undefined || audioUploadedItems != 'undefined') {
                this.audioUploadedItems = audioUploadedItems;
                this.pageInfo.audioAttachmentItems = [];
              }
              let stepTxt = response['step'];
              let stepIndex = response['stepIndex']
              let secIndex = response['sectionIndex'];
              let fieldSec = response['fieldSec'];
              let fieldIndex = response['fieldIndex'];
              let fieldItem = this.formFields[stepIndex][stepTxt];
              let dindex = fieldItem.findIndex(option => option.fieldName == 'content');
              secIndex = fieldItem[dindex].sec;
              let dfield = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells']['name'][fieldItem[dindex].findex];
              let dsval = dfield.selectedVal.replace(/<(?:.|\n)*?>/gm, '');
              let descVal = '';
              if(dsval == Constant.audioDescText) {
                dfield.valid = false;
                dfield.selectedVal = descVal;
                dfield.selectedValueIds = descVal;
                dfield.selectedValues = descVal;
                fieldItem[dindex].valid = false;
                fieldItem[dindex].formValue = descVal;
                fieldItem[dindex].formValueIds = descVal;
                fieldItem[dindex].formValueItems = descVal;
              }  
              break;
            default:
              this.pageInfo.updatedAttachments = response['updatedAttachments'];
              this.pageInfo.deletedFileIds = response['deletedFileIds'];
              this.pageInfo.removeFileIds = response['removeFileIds'];
              let uploadedItems = response['uploadedItems'];
              if(uploadedItems != undefined || uploadedItems != 'undefined') {
                this.uploadedItems = uploadedItems;
              }
              break;    
          }
        } else {
          let apiInfo = this.baseApiInfo();
          let stepTxt = response['step'];
          let stepIndex = response['stepIndex'];
          let secIndex = response['sectionIndex'];
          let fieldSec = response['fieldSec'];
          let fieldIndex = response['fieldIndex'];
          let fieldData = response['fieldData'];
          let field = this.apiFormFields[stepIndex][stepTxt][secIndex];
          let fieldName = fieldData.fieldName;
          let apiFieldKey = fieldData.apiFieldKey;
          let fieldApiName = fieldData.apiName;
          this.threadForm = response['formGroup'];
          field['cells'][fieldSec][fieldIndex] = fieldData;
          this.formFields = response['formFields'];
          let fd;
          let action = 'trigger';
          let wsInfo;
          let query;
          let threadCatgName = 'ThreadCategory';
          let roFieldName = 'repairOrder';
          let vinFieldName = 'vinNo';
          let vinScanToolFieldName = 'vinNoScanTool';
          let makeFieldName = 'make';
          let modelFieldName = 'model';
          let ptFieldName = 'SelectProductType';
          let tyFieldName = 'threadType';
          let threadCatgFieldIndex,vinFieldIndex, makeFieldIndex, modelFieldIndex, ptFieldIndex, tcIndex, vindex, mkIndex, mindex, ptindex;
          console.log(fieldApiName)
          switch (fieldName) {
            case 'workstreams':
              let vinFlag = true;
              let wf = field['cells']['name'][fieldIndex];
              let tcextraField = [];
              tcIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == threadCatgName);
              let wfRel = (wf.relationalFields == "" || tcIndex < 0) ? [] : JSON.parse(wf.relationalFields);
              wsInfo = fieldData.selectedValueIds;
              //let cwsVal = (this.CBADomain) ? wsInfo.toString() : 0;
              let cwsVal = wsInfo.toString();
              let wsprevId = this.wsVal;
              let fieldApiFlag = (this.wsVal == 0 || ((wsprevId < 3 && cwsVal == 3) || (cwsVal < 3 && wsprevId == 3))) ? true : false;
              this.wsVal = cwsVal;
              let tcfData, tcsecIndex, tcfield, tcf;
              if(tcIndex >= 0) {
                tcfData = this.formFields[stepIndex][stepTxt][tcIndex];
                tcsecIndex = tcfData.sec;
                tcfield = this.apiFormFields[stepIndex][stepTxt][tcsecIndex];
                console.log(tcfield)
                threadCatgFieldIndex = tcfield['cells']['name'].findIndex(option => option.fieldName == threadCatgName);
                tcf = tcfield['cells']['name'][threadCatgFieldIndex];
              }
              let chkDtcFlag;
              console.log(wsprevId, cwsVal, fieldApiFlag, wsInfo, this.wsVal, this.threadCatgVal)
              this.submitDisableFlag = (!this.CBADomain) ? false : this.submitDisableFlag;
              if(this.CBADomain && (cwsVal == 1 || cwsVal == 3)) {
                this.submitDisableFlag = true;
                this.threadCatgVal = -1;
              }
              if(this.CBADomain && cwsVal == 2) {
                this.submitDisableFlag = false;
                //this.threadCatgVal = 0;
              }
              if(this.collabticDomain && this.wsVal == 0 && this.threadId == 0 && (this.threadCatgVal <= 0 || this.threadCatgVal == 7 || cwsVal == '')) {
                let tcTimeOut = 0;
                if(this.threadCatgVal > 0 && this.threadCatgVal != 7 && cwsVal == '') {
                  tcTimeOut = 500;
                  console.log(tcf)
                  this.emptyThreadCatgFields(threadCatgName, tcf, stepIndex, stepTxt, tcsecIndex, false, this.threadCatgVal);
                }
                setTimeout(() => {
                  this.threadCatgVal = 0;
                  this.emptyWorsktreamFields(wfRel, wf, stepIndex, stepTxt, fieldSec, false); 
                }, tcTimeOut);
                return false;
              }
              if(!this.CBADomain && this.threadId >= 0 && wf.selection == 'multiple') {
                this.submitDisableFlag = true;
                /* let wfRel = (wf.relationalFields == "") ? [] : JSON.parse(wf.relationalFields);
                if(wfRel.length == 0) {
                  this.wsVal = -1;
                } */
              }
              
              if(fieldApiFlag && (this.CBADomain) && this.threadId >= 0) {
                this.clearStep2();
                if(tcIndex >= 0) {
                  tcf.hiddenFlag = (this.wsVal != 2) ? true : false;
                  tcfield.hiddenSection = tcf.hiddenFlag;
                  if(tcf.hiddenFlag) {
                    this.setupFieldData(threadCatgName, stepIndex, stepTxt, 'name', false);
                  } else {
                    if(tcIndex >= 0 && (!this.CBADomain || (this.CBADomain && this.wsVal == 2))) {
                      /* if(this.threadId > 0 && (wsprevId == 1 || wsprevId == 3) && this.wsVal == 2) {
                        this.setupThreadCatg(tcf, tcfData);                          
                      } */
                      makeFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === makeFieldName);
                      this.getThreadCatg(threadCatgName, action, fieldData, fieldData, tcIndex, stepIndex, stepTxt, apiInfo, wsInfo, 'ws');
                    }
                  }
                  setTimeout(() => {
                    tcf.valid = tcf.hiddenFlag;
                    tcfData.valid = tcf.hiddenFlag;
                  }, 100);
                }
                if(wsprevId > 0) {
                  this.emptyThreadCatgFields(fieldName, fieldData, stepIndex, stepTxt, fieldSec, false, wsprevId);
                  chkDtcFlag = (cwsVal == 3) ? true : false;
                  if(stepIndex == 0) {
                    this.manageDTC(chkDtcFlag);
                  }
                }                
                let timeout = 500;
                setTimeout(() => {
                  let append = true;
                  this.submitDisableFlag = false;
                  this.threadCatgVal = parseInt(this.wsVal);
                  this.getThreadFields(this.wsVal, append, fieldName);  
                }, timeout);
                break;
              } else {
                if(this.collabticDomain && this.threadId >= 0) {
                  let timeout = 500;
                  if(this.mainSection == 1) {
                    this.mainSection = 2;
                    setTimeout(() => {
                      let append = true;
                      this.submitDisableFlag = false;
                      this.getThreadFields(this.wsVal, append, fieldName);  
                    }, timeout);
                  } else {
                    if(this.threadId > 0 || this.mainSection > 2) {
                      this.getThreadCatg(threadCatgName, action, fieldData, fieldData, tcIndex, stepIndex, stepTxt, apiInfo, wsInfo, 'ws');
                    }
                  } 
                  return false;
                }
                if(wsprevId > 0) {
                  console.log(cwsVal, stepIndex)
                  /* if(this.threadId > 0 && (wsprevId == 1 || wsprevId == 3) && this.wsVal == 2) {
                    setTimeout(() => {
                      this.setupThreadCatg(tcf, tcfData);                          
                    }, 1000);                        
                  } */
                  chkDtcFlag = (cwsVal == 3) ? true : false;
                  if(stepIndex == 0) {
                    this.manageDTC(chkDtcFlag);
                  }
                }
              }

              if((this.CBADomain && this.wsVal != 3) || (!this.CBADomain && (industryType == 2 && wfRel.length == 0) || industryType == 3)) {
                vindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == vinFieldName);
                let vsecIndex = this.formFields[stepIndex][stepTxt][vindex].sec;
                let vfield = this.apiFormFields[stepIndex][stepTxt][vsecIndex];
                vinFieldIndex = vfield['cells']['name'].findIndex(option => option.fieldName === vinFieldName);
                let currField = this.apiFormFields[stepIndex][stepTxt][vsecIndex]['cells'][fieldSec][vinFieldIndex];
                console.log(currField)
                currField.disabled = (currField.disabled) ? false : currField.disabled;
                currField.disabled = (fieldData.selectedValueIds.length > 0) ? currField.disabled : true;
                vinFlag = (fieldData.selectedValueIds.length < `17`) ? true : false;                
              }

              if(wfRel.length > 0) {
                vinFlag = ((industryType == 2 || (industryType == 1 && (this.domainId == 1 || this.domainId == 267))) && wfRel.includes('ThreadCategory')) ? false : true;
                let wfRelIndex = wfRel.findIndex(option => option == 'ThreadCategory');
                tcIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == wfRel[wfRelIndex]);
                console.log(vinFlag, tcIndex, wfRel)
                if(tcIndex >= 0) {
                  wsInfo = fieldData.selectedValueIds;
                  let tcsecIndex = this.formFields[stepIndex][stepTxt][tcIndex].sec;
                  let tcfield = this.apiFormFields[stepIndex][stepTxt][tcsecIndex];
                  threadCatgFieldIndex = tcfield['cells']['name'].findIndex(option => option.fieldName == threadCatgName);
                  console.log(this.apiFormFields[stepIndex][stepTxt][tcsecIndex]['cells']['name'][threadCatgFieldIndex])
                  if(this.apiFormFields[stepIndex][stepTxt][tcsecIndex]['cells']['name'][threadCatgFieldIndex]) {
                    this.apiFormFields[stepIndex][stepTxt][tcsecIndex]['cells']['name'][threadCatgFieldIndex].disabled = false;
                  }
                  let tcf = tcfield['cells']['name'][threadCatgFieldIndex];
                  console.log(tcf)
                  let tcapiData = apiInfo;
                  let tcapiName = tcf.apiName;
                  query = JSON.parse(tcf.queryValues);
                  tcapiData[query[0]] = JSON.stringify(wsInfo);
                  if(this.threadId == 0) {
                    if(fieldData.selectedValueIds.length > 0) {
                      tcf.disabled = true;
                      tcf.loading = tcf.disabled;  
                      this.getData(action, tcsecIndex, tcf, tcapiName, tcapiData, tcextraField);
                    } else {
                      if(tcf.selectedValueIds.length > 0) {
                        this.emptyThreadCatgFields(threadCatgName, tcf, stepIndex, stepTxt, fieldSec, true);
                        if(this.collabticDomain) {
                          this.emptyWorsktreamFields(wfRel, wf, stepIndex, stepTxt, fieldSec, false);
                        }
                      } 
                    }
                  } else {
                    tcf.disabled = true;
                  }
                }
              }

              if(vinFlag) {
                mindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == modelFieldName);
                wsInfo = fieldData.selectedValueIds;
                secIndex = this.formFields[stepIndex][stepTxt][mindex].sec;
                field = this.apiFormFields[stepIndex][stepTxt][secIndex];
                makeFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === makeFieldName);
                modelFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === modelFieldName);
                ptFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === ptFieldName);
                let f = field['cells']['name'][makeFieldIndex];
                console.log(tcIndex)
                if(tcIndex >= 0 && (!this.CBADomain || (this.CBADomain && this.wsVal == 2))) {
                  this.getThreadCatg(threadCatgName, action, f, fieldData, tcIndex, stepIndex, stepTxt, apiInfo, wsInfo, 'make');
                }

                if(makeFieldIndex >= 0) {
                  mkIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == makeFieldName);
                  secIndex = this.formFields[stepIndex][stepTxt][mkIndex].sec;
                  console.log(this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex])
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = false;
                }
                
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].disabled = (ptFieldIndex >= 0) ? false : true;
                if(ptFieldIndex >= 0) {
                  let valid = false;
                  f = field['cells']['name'][ptFieldIndex];
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].disabled = false;
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].valid = valid;
                  ptindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == ptFieldName);
                  this.formFields[stepIndex][stepTxt][ptindex].valid = valid;
                }  

                let apiData = apiInfo;
                let apiName = f.apiName;
                query = JSON.parse(f.queryValues);
                apiData[query[0]] = JSON.stringify(wsInfo);

                if(fieldData.selectedValueIds.length > 0) {
                  f.disabled = true;
                  f.loading = f.disabled;
                  let extraField = {
                    stepTxt: stepTxt,
                    stepIndex: stepIndex,
                    secIndex: secIndex,
                    fieldSec: fieldSec,
                    fieldIndex: fieldIndex,
                    f: f,
                    field: field,
                    fieldName: fieldName
                  };
                  
                  if(makeFieldIndex >= 0) {
                    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = true;
                    
                    // Get Make Field Data
                    this.getData(action, secIndex, f, apiName, apiData, extraField);
                  }    
                  if(!this.CBADomain)          
                    this.setupFieldData('model', stepIndex, stepTxt, fieldSec);
                    
                  if(ptFieldIndex >= 0) {
                    // Get Product Type Field Data
                    let queryInfo = {
                      wsInfo: wsInfo,
                      makeInfo: '',
                      modelInfo: ''
                    };
                    this.getProductTypes(action, stepIndex, stepTxt, secIndex, fieldSec, field['cells']['name'], apiInfo, queryInfo); 
                  }
                } else {
                  if(wfRel.length == 0) {
                    f.recentSelectionValue = [];
                    f.recentShow = false;
                    f.itemValues = [];
                    this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, f, field, fieldName);
                    let formatType, item;
                    
                    if(makeFieldIndex >= 0) {
                      formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].apiValueType;
                      item = (formatType == 1) ? "" : [];

                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = true;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].selectedValueIds = item;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].selectedValues = item;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].selectedVal = item;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].valid = false;
          
                      apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].apiFieldKey;
                      this.formFields[this.stepIndex][this.stepTxt][mkIndex].formValue = item;
                      this.formFields[this.stepIndex][this.stepTxt][mkIndex].formValueIds = item;
                      this.formFields[this.stepIndex][this.stepTxt][mkIndex].formValueItems = item;
                      this.formFields[this.stepIndex][this.stepTxt][mkIndex].valid = false;
                      this.threadForm.value[apiFieldKey] = item;
                    }
        
                    formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].apiValueType;
                    item = (formatType == 1) ? "" : [];
                    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].disabled = true;
                    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedValueIds = item;
                    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedValues = item;
                    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedVal = item;
                    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].valid = false;
                    apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].apiFieldKey;
                    
                    this.formFields[this.stepIndex][this.stepTxt][mindex].formValue = item;
                    this.formFields[this.stepIndex][this.stepTxt][mindex].formValueIds = item;
                    this.formFields[this.stepIndex][this.stepTxt][mindex].formValueItems = item;
                    this.formFields[this.stepIndex][this.stepTxt][mindex].valid = false;
                    this.threadForm.value[apiFieldKey] = item;

                    if(ptFieldIndex >= 0) {
                      formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].apiValueType;
                      item = (formatType == 1) ? "" : [];
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].disabled = true;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].selectedValueIds = item;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].selectedValues = item;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].selectedVal = item;
                      this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].valid = false;
                      apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].apiFieldKey;
                      
                      this.formFields[this.stepIndex][this.stepTxt][ptindex].formValue = item;
                      this.formFields[this.stepIndex][this.stepTxt][ptindex].formValueIds = item;
                      this.formFields[this.stepIndex][this.stepTxt][ptindex].formValueItems = item;
                      this.formFields[this.stepIndex][this.stepTxt][ptindex].valid = false;
                      this.threadForm.value[apiFieldKey] = item;
                    }
                    fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
                    fd.optFieldsFlag = false;
                    fd.optDisableFlag = true;
                    fd.toggleTxt = 'Show';
                    if(industryType != 2 && industryType != 3) {
                      this.setupFieldData('AdditionalModelInfo', stepIndex, stepTxt, fieldSec);
                      this.setupFieldData('AdditionalModelInfo2', stepIndex, stepTxt, fieldSec);
                    }
                  }
                }
                if(this.CBADomain && tcIndex >= 0) {
                  wsInfo = fieldData.selectedValueIds;
                  let tcfData = this.formFields[stepIndex][stepTxt][tcIndex];
                  let tcsecIndex = tcfData.sec;
                  let tcfield = this.apiFormFields[stepIndex][stepTxt][tcsecIndex];
                  threadCatgFieldIndex = tcfield['cells']['name'].findIndex(option => option.fieldName == threadCatgName);
                  let tcf = tcfield['cells']['name'][threadCatgFieldIndex];
                  tcf.hiddenFlag = (wsInfo == 1 || wsInfo == 3) ? true : false;
                  tcfield.hiddenSection = tcf.hiddenFlag;
                  if(tcf.hiddenFlag) {
                    this.setupFieldData(threadCatgName, stepIndex, stepTxt, 'name', false);
                  }
                  setTimeout(() => {
                    tcf.valid = tcf.hiddenFlag;
                    tcfData.valid = tcf.hiddenFlag;
                  }, 100);
                }
              }            
              break;
            case 'ThreadCategory':
              let prevId = parseInt(fieldData.prevId);
              this.mainSection = 3;
              if(this.CBADomain) {
                this.submitDisableFlag = true;
                this.threadCatgVal = -1;
                break;
              } 
              
              if(this.collabticDomain) {
                console.log(fieldData)
                let tcItemVal = fieldData.itemValues;
                let threadCatgVal = parseInt(fieldData.selectedValues);
                tcItemVal.forEach(tcItem => {
                  tcItem.disabled = true;
                  setTimeout(() => {
                    tcItem.disabled = false;
                  }, 2500);
                });
                
                let tyfindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == tyFieldName);
                let valid = (threadCatgVal == 7) ? false : true;
                let formField = this.formFields[stepIndex][stepTxt][tyfindex];
                let tySecIndex = formField.sec;
                let tyf = formField.findex;
                let tys = formField.sec;
                let tyselected = '';
                let apiField = this.apiFormFields[stepIndex][stepTxt][tySecIndex]['cells']['name'];
                if(tyfindex >= 0) {
                  console.log(apiField, formField)
                  apiField[tyf].disabled = false;
                  apiField[tyf].hiddenFlag = (threadCatgVal == 7) ? true : false;;
                  this.apiFormFields[stepIndex][stepTxt][tySecIndex].hiddenSection = (threadCatgVal == 7) ? true : false;;
                  let tyItemVal = apiField[tyf].itemValues;
                  let tyVal = formField.formValue;
                  console.log(tyItemVal)
                  let tcItemVal = fieldData.itemValues;
                  tcItemVal.forEach(tcItem => {
                    if(!tcItem.disabled) {
                      tcItem.disabled = true;
                      setTimeout(() => {
                        tcItem.disabled = false;
                      }, tyTimeout);
                    }
                  })
                  let tyTimeout = (threadCatgVal == 7) ? 500 : 1500;
                  tyItemVal.forEach(item => {
                    if(tyVal == item.apiValue) {
                      apiField[tyf].valid = true;
                      this.formFields[stepIndex][stepTxt][tyfindex].valid = apiField[tyf].valid;
                    }
                    switch(item.apiValue) {
                      case 'thread':
                        tyselected = item.apiValue;
                        item.hiddenFlag = (threadCatgVal == 7) ? true : false;
                        item.isActive = (threadCatgVal == 7) ? true : item.isActive;
                        item.active = 0;
                        setTimeout(() => {
                          item.active = 1;
                        }, tyTimeout);                        
                        break;
                      case 'share':
                        item.active = 0;
                        setTimeout(() => {
                          item.active = (threadCatgVal == 7) ? 0 : 1;
                        }, tyTimeout);                        
                        item.hiddenFlag = (threadCatgVal == 7) ? true : false;
                        break;  
                    }                    
                  });
                  
                } 
                if(threadCatgVal == 7) {
                  this.threadCatgVal = threadCatgVal;
                  //if(this.threadId == 0) {
                    this.clearStep2();
                    setTimeout(() => {
                      this.emptyThreadCatgFields(threadCatgName, fieldData, stepIndex, stepTxt, fieldSec, false, prevId);
                      apiField[tyf].selectedVal = tyselected;
                      apiField[tyf].selectedValueIds = tyselected;
                      apiField[tyf].selectedValues = tyselected;
                      apiField[tyf].valid = true;
                      this.formFields[stepIndex][stepTxt][tyfindex].formValue = tyselected;
                      this.formFields[stepIndex][stepTxt][tyfindex].formValueIds = tyselected;
                      this.formFields[stepIndex][stepTxt][tyfindex].formValueItems = tyselected;
                      this.formFields[stepIndex][stepTxt][tyfindex].valid = true;
                      setTimeout(() => {
                        this.submitAction();
                      }, 1000);
                    }, 500);
                  //}                  
                  return false;
                }
              }
              if(this.threadId == 0 && this.threadCatgVal > 0) {
                this.clearStep2();
              }
              console.log(fieldData)              
              let timeout = (prevId == 0) ? 0 : 500;
              timeout = (this.threadApiCall) ? 1000 : timeout;
              this.threadApiCall.unsubscribe();
              if(!this.CBADomain && prevId > 0) {
                this.emptyThreadCatgFields(threadCatgName, fieldData, stepIndex, stepTxt, fieldSec, false, prevId);  
              }
              setTimeout(() => {
                let append = true;
                this.submitDisableFlag = false;
                this.threadCatgVal = parseInt(fieldData.selectedVal);
                this.getThreadFields(fieldData.selectedVal, append, fieldName);  
              }, timeout);
              break;  
            case 'threadType':
              this.threadType = fieldData.selectedVal;
              this.threadApiData['threadType'] = this.threadType;
              break;  
            case 'make':
              this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, fieldData, field, fieldName);
              fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
              fd.optFieldsFlag = false;
              fd.optDisableFlag = true;
              fd.toggleTxt = 'Show';
              modelFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === modelFieldName);
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].disabled = false;
              //this.setupFieldData('SelectProductType', stepIndex, stepTxt, fieldSec);
              ptFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === ptFieldName);
              console.log(ptFieldIndex)
              if(ptFieldIndex >= 0) {
                query = JSON.parse(ptFieldIndex.queryValues);
                // Get Product Type Field Data            
                let queryInfo = {
                  wsInfo: wsInfo,
                  makeInfo: this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedVal,
                  modelInfo: ''
                };
                this.getProductTypes(action, stepIndex, stepTxt, secIndex, fieldSec, field['cells']['name'], apiInfo, queryInfo);
              }
              this.setupFieldData('model', stepIndex, stepTxt, fieldSec);
              break;
            case 'SelectProductType':
              let valid = false; 
              modelFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === modelFieldName);
              mindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == modelFieldName);
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].valid = valid;
              this.formFields[this.stepIndex][this.stepTxt][mindex].valid = false;
              this.setupFieldData('model', stepIndex, stepTxt, fieldSec, false);
              break;  
            case 'model':
              mkIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == makeFieldName);  
              mindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == modelFieldName);
              fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
              makeFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === makeFieldName);
              ptFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === ptFieldName);
              let itemSec = fd['cells'][fieldSec][fieldIndex];
              let flag = (fieldData.selectedVal == '') ? false : true;
              if(makeFieldIndex >= 0) {
                fd['cells'][fieldSec][makeFieldIndex].valid = true;
                console.log(this.formFields[this.stepIndex][this.stepTxt], mkIndex)
                this.formFields[this.stepIndex][this.stepTxt][mkIndex].valid = flag;              
              }
              if(ptFieldIndex >= 0) {
                fd['cells'][fieldSec][ptFieldIndex].disabled = false;
                fd['cells'][fieldSec][ptFieldIndex].valid = flag;
                ptindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == ptFieldName);
                this.formFields[this.stepIndex][this.stepTxt][ptindex].valid = flag;              
              }
              
              if(itemSec.selectedVal == "") {
                itemSec.itemValues = [];
                fd.optFieldsFlag = false;
                fd.optDisableFlag = true;
                fd.toggleTxt = 'Show';
              } else {
                fd.optDisableFlag = false;
                fd.toggleTxt = 'Show';
              }
              //if(this.industryType.id != 3) {
                this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, fieldData, field, fieldName);
                let faction = (fieldData.selectedValueIds.length > 0) ? 'load' : 'remove';
                let formField = this.formFields[stepIndex][stepTxt];
                setTimeout(() => {
                  let itemValues: any  = [{
                    id: fieldData.itemValues.id,
                    name: fieldData.itemValues.name
                  }];
                  fieldData.itemValues = itemValues;                    
                }, 100);
                if(this.industryType.id == 2 || this.industryType.id == 3) {
                  console.log(fieldData)
                  let extraField = {
                    stepTxt: stepTxt,
                    stepIndex: stepIndex,
                    secIndex: secIndex,
                    fieldSec: fieldSec,
                    fieldIndex,
                    fieldData,
                    field: field,
                    fieldName: fieldName
                  };                  
                  let checkFields = ['AdditionalModelInfo', 'AdditionalModelInfo2', 'AdditionalModelInfo3', 'AdditionalModelInfo4', 'AdditionalModelInfo5'];
                  console.log(fieldData.itemValues)
                  if(!this.CBADomain || (this.CBADomain && this.wsVal != 3)) {
                    this.setupVinDetails(itemSec.itemValues, checkFields, extraField, true, secIndex, 'manual');
                  }
                } else {
                  let checkFields = ['AdditionalModelInfo', 'AdditionalModelInfo2'];
                  checkFields.forEach(item => {
                    let checkInfo = formField.findIndex(option => option.fieldName == item);
                    if(checkInfo >= 0) {
                      this.setupFieldData('AdditionalModelInfo', stepIndex, stepTxt, fieldSec);
                      this.setupFieldData('AdditionalModelInfo2', stepIndex, stepTxt, fieldSec);
                    }
                  });
                }
              //}
              break;
            case 'vinNo':
              let vinApi = true;
              if(this.CBADomain) {
                let repairOrderIndex = field['cells']['name'].findIndex(option => option.fieldName === roFieldName);
                let vinNo = fieldData.selectedVal;
                let roInfo = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].roDetails;
                if(vinNo != roInfo.vin) {
                  this.removeRepairOrder(stepIndex, stepTxt, secIndex, fieldSec, repairOrderIndex);                  
                }
                vinApi = (vinNo == roInfo.vin) ? false : true;
              }
              if(vinApi) {
                this.getVinData(fieldData, stepTxt, stepIndex, fieldSec, fieldIndex, field, fieldName, secIndex, apiInfo, action);
              }              
              break;
            case 'vinNoScanTool':
              let svinApi = true;
              if(this.CBADomain) {
                let repairOrderIndex = field['cells']['name'].findIndex(option => option.fieldName === roFieldName);
                let vinNo = fieldData.selectedVal;
                let roInfo = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].roDetails;
                if(vinNo != roInfo.vin) {
                  this.removeRepairOrder(stepIndex, stepTxt, secIndex, fieldSec, repairOrderIndex);                  
                }
                svinApi = (vinNo == roInfo.vin) ? false : true;
              }
              if(svinApi) {
                this.getVinData(fieldData, stepTxt, stepIndex, fieldSec, fieldIndex, field, fieldName, secIndex, apiInfo, action);
              }
              break;
            case 'repairOrder':
              let rofd = fieldData;
              let rextraField = {
                stepTxt: stepTxt,
                stepIndex: stepIndex,
                secIndex: secIndex,
                fieldSec: fieldSec,
                fieldIndex: fieldIndex,
                f: rofd,
                field: field,
                fieldName: fieldName
              };
              let rcallbackItems = (rofd.relationalFields == '') ? [] : JSON.parse(rofd.relationalFields);
              if(rofd.changeAction == 'change') {
                if(rofd.selectedVal.length >= 3) {
                  let vapiData = apiInfo;
                  let vapiName = rofd.apiName;
                  console.log(rofd)
                  query = (rofd.queryValues == '') ? [] : JSON.parse(rofd.queryValues);
                  if(query.length > 0) {
                    vapiData[query[0]] = rofd.selectedVal;
                  }
                  
                  this.dialogContent = this.repairDecode;
                  this.dialogClose = false;
                  this.dialogEscClose = false;
                  this.dialogLoader = true;
                  this.dialogModal = true;
                  // Get Vin Field Data
                  this.getData(action, secIndex, rofd, vapiName, vapiData, rextraField);
                } else {
                  rofd.invalidFlag = false;
                  rofd.roNo = '';
                  this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].optDisableFlag = true;
                  let vinRes = rofd.vinDetails;
                  let vinRelFields = (rofd.relationalFields == '') ? [] : JSON.parse(rofd.relationalFields)
                  console.log(vinRelFields)
                  if(vinRelFields[0] == vinScanToolFieldName) {
                    let roformField = this.formFields[this.stepIndex][this.stepTxt];
                    let roformFieldIndex = roformField.findIndex(option => option.fieldName == fieldName);
                    roformField[roformFieldIndex].roDetails = [];
                    rofd.roDetails = [];
                    vindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == vinScanToolFieldName);
                    let vsecIndex = this.formFields[stepIndex][stepTxt][vindex].sec;
                    let vfield = this.apiFormFields[stepIndex][stepTxt][vsecIndex];
                    vinFieldIndex = vfield['cells']['name'].findIndex(option => option.fieldName === vinScanToolFieldName);
                    let currField = this.apiFormFields[stepIndex][stepTxt][vsecIndex]['cells'][fieldSec][vinFieldIndex];
                    currField.vinNo = '';
                    currField.vinDetails = [];
                    currField.invalidFlag = false;
                    currField.valid = true;
                    currField.selectedVal = "";
                    currField.selectedValueIds = "";
                    currField.selectedValues = "";
                    let vformField = vfield['cells']['name'][vinFieldIndex];
                    vformField.vinDetails = [];
                    vformField.invalidFlag = false;
                    vformField.valid = true;
                    vformField.formValue = "";
                    vformField.formValueIds = "";
                    vformField.formValueItems = "";
                    vformField.vinDetails = [];
                  }
                  //this.removeVinData(callbackItems, formField)
                  /* for(let i of rcallbackItems) {
                    let chkIndex = roformField.findIndex(option => option.fieldName === i);
                    let cfieldSec = (roformField[chkIndex].optField) ? 'optionFilter' : 'name';
                    this.setupFieldData(i, this.stepIndex, this.stepTxt, cfieldSec);
                    if(i == 'make' || i == 'model' || i == 'year') {
                      this.disableField(i, false);
                    }                    
                    if(i == 'make' || i == 'SelectProductType') {
                      let chkField = rextraField['field']['cells']['name']; 
                      let mkIndex = chkField.findIndex(option => option.fieldName == i);
                      let mkField = chkField[mkIndex];
                      let mapiData = this.baseApiInfo();
                      let mapiName = mkField.apiName;
                      let query = JSON.parse(mkField.queryValues);
                      //mapiData[query[0]] = JSON.stringify(wsVal);

                      let extra = [];
                      // Get Make Field Data
                      this.getData('onload', rextraField['secIndex'], chkField[mkIndex], mapiName, mapiData, extra);
                    }
                  }              
                  this.setupFieldData(fieldName, this.stepIndex, this.stepTxt, fieldSec); */
                }
              } else {
                rofd.invalidFlag = false;
                console.log('recent vin action');
                let vinRes = rofd.vinDetails;
                console.log(JSON.parse(rofd.relationalFields))
                //let callbackItems = ['make', 'model', 'AdditionalModelInfo', 'AdditionalModelInfo2', 'AdditionalModelInfo3', 'AdditionalModelInfo4', 'AdditionalModelInfo5', 'year'];
                // Setup Vin Details
                this.setupVinDetails(vinRes, rcallbackItems, rextraField, true, secIndex);
              }             
              break;  
            case 'dtcToggle':
              this.setupFieldData('errorCode', stepIndex, stepTxt, fieldSec, fieldData.selection);
              break;
            case 'uploadContents':
              this.uploadedItems = response['uploadedItems'];
              break;
            case 'audioDescription':
              this.audioUploadedItems = response['uploadedItems'];
              let upItems = Object.keys(this.audioUploadedItems);
              let fieldItem = this.formFields[stepIndex][stepTxt];
              let dindex = fieldItem.findIndex(option => option.fieldName == 'content');
              secIndex = fieldItem[dindex].sec;
              let dfield = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells']['name'][fieldItem[dindex].findex];
              if(upItems.length > 0 && this.audioUploadedItems.items.length == 0) {
                let dsval = dfield.selectedVal.replace(/<(?:.|\n)*?>/gm, '');
                let descVal = '';
                if(dsval == Constant.audioDescText) {
                  dfield.valid = false;
                  dfield.selectedVal = descVal;
                  dfield.selectedValueIds = descVal;
                  dfield.selectedValues = descVal;
                  fieldItem[dindex].valid = false;
                  fieldItem[dindex].formValue = descVal;
                  fieldItem[dindex].formValueIds = descVal;
                  fieldItem[dindex].formValueItems = descVal;
                }  
              }
              
              let fvalid = ((dfield.selectedVal != 'undefined' || dfield.selectedVal != undefined) && dfield.selectedVal != '' || (upItems.length > 0 && this.audioUploadedItems.items.length > 0)) ? true : false;
              if(!dfield.valid && fvalid) {
                let descVal = `<p>${Constant.audioDescText}</p>`;
                dfield.selectedVal = descVal;
                dfield.selectedValueIds = descVal;
                dfield.selectedValues = descVal;
                fieldItem[dindex].formValue = descVal;
                fieldItem[dindex].formValueIds = descVal;
                fieldItem[dindex].formValueItems = descVal;  
              }
              console.log(response, fvalid)
              console.log( dfield)
              console.log(fieldItem)
              dfield.valid = fvalid;
              fieldItem[dindex].valid = fvalid;
              break;  
          }
        }
        
        //console.log(this.threadForm)
        //console.log(this.apiFormFields)
        //console.log(this.formFields)
      })
    );
  }

  setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, fieldData, field, fieldName) {
    console.log(fieldData, fieldName)
    let makeFieldName = 'make';
    let modelFieldName = 'model';
    let ptFieldName = 'SelectProductType';
    let makeFieldIndex = field['cells'][fieldSec].findIndex(option => option.fieldName === makeFieldName);
    let ptFieldIndex = field['cells'][fieldSec].findIndex(option => option.fieldName === ptFieldName);
    let optItems:any = [];
    if(fieldName == 'make' || fieldName == 'model') {
      field.optDisableFlag = true;
      field.optFieldsFlag = false;
      field.optDisableFlag = (fieldName == 'model' && fieldData.selectedVal.length > 0) ? false : field.optDisableFlag;
      if(fieldName == 'model') {
        console.log(ptFieldIndex)
        let mkField = (makeFieldIndex >= 0) ? field['cells'][fieldSec][makeFieldIndex] : makeFieldIndex;
        let ptField;
        if(ptFieldIndex >= 0) {
          ptField = field['cells'][fieldSec][ptFieldIndex];
          let formatAttr = mkField.apiFieldType;
          let formatType = mkField.apiValueType;
          let formVal;
          let formField = this.formFields[this.stepIndex][this.stepTxt];
          
          optItems = fieldData.itemValues;
          let modelData = Object.keys(optItems).length;
          if(makeFieldIndex >= 0 && ptFieldIndex >= 0 && modelData > 0) {
            let mkIndex = formField.findIndex(option => option.fieldName == mkField.fieldName);
            let itemIndex = mkField.itemValues.findIndex(option => option.name == optItems.make);
            let itemId = mkField.itemValues[itemIndex].id;
            let itemName = mkField.itemValues[itemIndex].name;
            
            mkField.selectedValueIds = (formatType == 1) ? itemId : [itemId];
            mkField.selectedValues = itemId;
            mkField.selectedVal = (formatType == 1) ? itemName : [itemName];
            
            formVal = (formatAttr == 1) ? itemId : itemName;
            formVal = (formatType == 1) ? formVal : [formVal];
            formField[mkIndex].formValue = formVal;
            formField[mkIndex].formValueIds = (formatType == 1) ? itemId : [itemId];
            formField[mkIndex].formValueItems = (formatType == 1) ? itemName : [itemName];
          }
          formatAttr = ptField.apiFieldType;
          formatType = ptField.apiValueType;
          let ptIndex = formField.findIndex(option => option.fieldName == ptField.fieldName);
          optItems = (fieldData.selectedVal != "") ? optItems : [];
          let id, itemVal;
          let ptItems = (modelData > 0) ? optItems.prodType : [];
          if(ptItems.length > 0) {
            let ptItemIndex = ptField.itemValues.findIndex(option => option.name == ptItems[0].name);
            id = ptField.itemValues[ptItemIndex].id;
            itemVal = ptField.itemValues[ptItemIndex].name;
            id = (formatType == 1) ? id : id;
            itemVal = (formatType == 1) ? itemVal : itemVal;
          } else {
              id = (formatType == 1) ? "" : [];
              itemVal = (formatType == 1) ? "" : [];
          }        
          formVal = (formatAttr == 1) ? id : itemVal;
          ptField.selectedValueIds = id;
          ptField.selectedValues = id;
          ptField.selectedVal = itemVal;

          formField[ptIndex].formValue = (formatType == 1) ? formVal : [formVal];
          formField[ptIndex].formValueIds = id;
          formField[ptIndex].formValueItems = itemVal; 
        } else {
          optItems = (fieldData.selectedVal.length != "") ? field['cells'][fieldSec][fieldIndex].itemValues : [];
        }
      }
      
      console.log(field['cells']['optionFilter'])
      for(let opt of field['cells']['optionFilter']) {
        let optField = opt.fieldName;
        let findex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName === optField);
        let optValItems = this.formFields[stepIndex][stepTxt][findex];
        switch(optField) {
          case 'SelectCategory':
            opt.itemValues = (fieldName == 'model') ? optItems.catg : [];
            break;
          case 'SelectSubCategory':
            opt.itemValues = (fieldName == 'model') ? optItems.subCatg : [];
            break;
          case 'SelectProductType':
            this.setupValues(opt, optValItems, opt.itemValues);
            break;
          case 'SelectRegion':
            opt.itemValues = (fieldName == 'model') ? optItems.regions : [];
            break;
          case 'make':
            opt.itemValues = (fieldName == 'model') ? optItems.makeItems : [];
            break;
        }
        // Setup Selected Values
        this.setupValues(opt, optValItems, opt.itemValues);
      }
    }
  }

  // Setup Opt Selected Values
  setupValues(opt, optVal, items) {
    console.log(items, opt)
    let optApiFieldKey = opt.apiFieldKey;
    let formatAttr = opt.apiFieldType;
    let formatType = opt.apiValueType;
    let formVal, formValItem;
    let selection = opt.selection;
    let id = [];
    let name = [];
    items = (items == 'undefined' || items == undefined) ? [] : items;
    for(let i of items) {
      id.push(i.id);
      name.push(i.name);
    }
    opt.selectedValueIds = (selection == 'single') ? id.toString() : id;
    opt.selectedValues = (selection == 'single') ? id.toString() : name;
    opt.selectedVal = (selection == 'single') ? name.toString() : name;

    formVal = (formatAttr == 1) ? id : name;
    
    optVal.formValue = (formatType == 1) ? formVal.toString() : formVal;
    optVal.formValueIds = id;
    optVal.formValueItems = name;
    this.threadForm.value[optApiFieldKey] = formVal;
  }

  // Empty Field Info
  setupFieldData(fieldName, stepIndex, stepTxt, fieldSec, flag = false) {
    let formField = this.formFields[stepIndex][stepTxt];
    console.log(fieldName, formField, fieldSec, flag)
    let addInfo = formField.findIndex(option => option.fieldName == fieldName);
    formField = formField[addInfo];
    console.log(formField)
    let fsec = formField.sec;
    let fi = formField.findex;
    console.log(fieldName, formField, fieldSec, this.apiFormFields[stepIndex][stepTxt][fsec]['cells'][fieldSec], flag)
    let apiField = this.apiFormFields[stepIndex][stepTxt][fsec]['cells'][fieldSec][fi];
    console.log(apiField)
    let formatType = apiField.apiValueType;
    let item = (formatType == 1) ? "" : [];
    let disableFlag = false;
    console.log(fieldName)
    if(this.industryType.id == 3 && fieldName == 'model') {
      disableFlag = apiField.disableFlag;
      console.log(disableFlag) 
      apiField.disabled = disableFlag;
    }
    apiField.selectedValueIds = item;
    apiField.selectedValues = item;
    apiField.selectedVal = item;
    apiField.valid = (apiField.isMandatary) ? false : true;
    let apiFieldKey = apiField.apiFieldKey;
    if(fieldName == 'errorCode') {
      apiField.valid = !flag;
    }

    formField.formValue = item;
    formField.formValueIds = item;
    formField.formValueItems = item;
    formField.valid = apiField.valid;
    this.threadForm.value[apiFieldKey] = item;
  }

  // Get Thread Fields
  getThreadFields(extraValue = '', appendField = false, field = '') {
    let step = this.threadApiData['step'];
    console.log(field, extraValue, step)
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    let mainSection = (this.step2) ? 0 : this.mainSection;
    this.threadApiData['isMainSection'] = mainSection;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    console.log(this.threadApiData);
    this.headerPosTop = true;
    this.headerPosBottom = false;
    this.threadApiData['workstramId'] = this.wsVal;
    switch(field) {
      case 'ThreadCategory':
        this.threadApiData['threadCategoryValue'] = (extraValue != '') ? extraValue : this.threadCatgVal;
        break;
      case 'workstreams':
        this.threadApiData['threadCategoryValue'] = this.threadCatgVal;
        this.threadApiData['workstramId'] = (extraValue != '') ? extraValue : this.wsVal;
        break;
    }
    this.threadApiData['threadCategoryValue'] = (step == 2) ? this.threadCatgVal : this.threadApiData['threadCategoryValue'];
    this.threadApiData['workstramId'] = (step == 2) ? this.wsVal : this.threadApiData['workstramId'];
    
    //this.threadApiData['threadCategoryValue'] = (step == 2) ? '' : this.threadApiData['threadCategoryValue'];
    this.threadApiCall = this.threadApi.apiGetThreadFields(this.threadApiData).subscribe((response) => {
      let configInfo = response.configInfo;
      let sections = configInfo.sections; 
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      if(this.approvalEnableDomainFlag && this.threadApiData['threadType'] == 'share') {
        this.step2Title = (this.approveProcessFlag) ? 'Submit' : this.step2Title;
        this.saveText = (this.approveProcessFlag) ? 'Submit' : this.saveText;
      }
      let apiFormLength = this.apiFormFields[this.stepIndex][this.stepTxt].length;
      let i = (appendField) ? apiFormLength : 0;
      
      this.threadInfo = (this.threadId > 0) ? response.threadInfo[0] : this.threadInfo;
      let action = 'onload';
      let mandatoryText = '';
      let step2FormField = this.formFields[this.stepIndex][this.stepTxt];
      let step2ApiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][0];
      if(this.stepTxt == 'step2') {
        this.bannerImage = configInfo.bannerImage;
        this.defaultBanner = configInfo.isDefaultBanner;
        console.log(this.bannerImage)
      }
      
      for(let sec of sections) {
        let c = 0;
        let o = 0;
        let val: any, formVal:any, formValueIds:any, formValueItems:any = "";
        let cells = sec.cells;
        let fieldLists = cells.name;
        let fieldOptionalData = cells.optionFilter;
        sec.displayFlag = true;
        sec.optFieldsFlag = false;
        sec.optDisableFlag = true;
        sec.toggleTxt = "Show";
        let fieldFlag = true;
        for(let f of fieldLists) {
          let apiInfo = this.baseApiInfo();
          f.disabled = false;
          f.loading = false;
          f.valid = (f.isMandatary == 1) ? false : true;
          f.isNumeric = false;
          f.lazyLoading = false;
          f.hiddenSection = false;
          if(f.cellArray.length > 0) {
            for(let fc of f.cellArray) {
              fc.fieldName = fc.apiName;
              fc.displayFlag = true;
              fc.recentShow = false;
              fc.lazyLoading = false;
              fc.loading = false;
              fc.hiddenFlag = false;
              fc.valid = (fc.isMandatary == 1) ? false : true;
              fc.mandatoryText = (this.CBADomain) ? fc.mandatoryText : mandatoryText;
              fc.isNumeric = false;
              fc.isArray = (fc.apiValueType == 1) ? false : true;
              fc.selectedValueIds = (fc.apiValueType == 1) ? "" : [];
              fc.selectedValues = (fc.apiValueType == 1) ? (fc.fieldName == 'odometer') ? null : "" : [];
              fc.selectedVal = (fc.apiValueType == 1) ? "" : [];
              val = (fc.apiValueType == 1) ? "" : [];
              console.log(fc.fieldName, fc.selectedValues)
              
              if(this.threadId > 0) {
                fc.recentShow = false;
                let threadVal = this.threadInfo[fc.threadInfoApiKey];
                if(fc.selection == 'multiple') {
                  fc.selectedIds = threadVal;
                  let id = [];
                  let name = [];
                  for(let item of fc.selectedIds) {
                    id.push(item.id);
                    name.push(item.name);
                  }
                  fc.selectedValueIds = id;
                  fc.selectedValues = name;
                  fc.selectedVal = name;
                  val = threadVal;
                  formVal = (fc.apiFieldType == 1) ? id : name;
                  formValueIds = id;
                  formValueItems = name;
                  console.log(fc.fieldName, threadVal.length)
                  if(threadVal.length > 0 && f.isMandatary == 1) {
                    fc.valid = true;
                  }
                } else {
                  fc.selectedValueIds = threadVal;
                  fc.selectedValues = threadVal;
                  fc.selectedVal = threadVal;
                  val = threadVal;
                  formVal = threadVal;
                  formValueIds = threadVal;
                  formValueItems = threadVal;
                  if(threadVal != "" && fc.isMandatary == 1) {
                    fc.valid = true;
                  }
                }
                console.log(this.threadInfo[fc.threadInfoApiKey])
              }

              if(fc.fieldType == 'dropdown') {
                for(let e of fc.enumValue) {
                  fc.itemValues.push(
                    {
                      id: e,
                      name: e
                    }
                  );
                }
                console.log(fc.itemValues, fc.selectedValueIds, fc.selectedValues, fc.selectedVal) 
                fc.selectedValueIds = (this.threadId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].id : fc.selectedValueIds;
                fc.selectedValues = (this.threadId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedValues;
                fc.selectedVal = (this.threadId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedVal;
                fc.valid = (fc.fieldName == 'miles' && !fc.valid) ? true : fc.valid;
                val = fc.selectedVal;
              }

              //console.log(i, fc.fieldName, fc.apiFieldKey, fc.apiFieldType, val);
              this.threadForm.addControl(fc.apiFieldKey, new FormControl(val));
              let flag = (fc.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, fc.apiName);

              //console.log(fc.fieldName, fc.selectedValues)
              if(this.threadId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
                let chkFieldIndex = step2FormField.indexOf(option => option.fieldName == fc.fieldName);
                fieldFlag = (chkFieldIndex >= 0) ? false : true;
                if(!fieldFlag) {
                  step2FormField[chkFieldIndex]['findex'] = c;
                }
              }
              if(fieldFlag) {
                let squareBoxType = 0;
                if(this.CBADomain){
                  squareBoxType = fc.squareBoxType
                }                
                this.formFields[this.stepIndex][this.stepTxt].push({
                  apiFieldKey: fc.apiFieldKey,
                  displayFlag: fc.displayFlag,
                  fieldName: fc.fieldName,
                  fieldType: fc.fieldType,
                  findex: c,
                  formatAttr: fc.apiFieldType,
                  formatType: fc.apiValueType,
                  formValue: val,
                  formValueIds: val,
                  formValueItems: val,
                  group: sec.groups,
                  isArray: fc.isArray,
                  isMandatary: fc.isMandatary,
                  mandatoryText: fc.mandatoryText,
                  optField: false,
                  placeholder: fc.placeholder,
                  squareBoxType: squareBoxType,
                  sec: i,
                  selection: fc.selection,
                  threadType: fc.threadType,
                  valid: fc.valid                
                });                
              }
            }
          } else {
            f.displayFlag = true;
            f.recentShow = true;
            f.isNumeric = false;
            f.lazyLoading = false;
            f.loading = false;
            f.hiddenFlag = (this.collabticDomain && f.fieldName == 'threadType') ? f.hiddenFlag : false;
            f.mandatoryText = (this.CBADomain) ? f.mandatoryText : mandatoryText;
            f.isArray = (f.apiValueType == 1) ? false : true;
            f.selectedValueIds = (f.apiValueType == 1) ? "" : [];
            f.selectedValues = (f.apiValueType == 1) ? "" : [];
            f.selectedVal = (f.apiValueType == 1) ? "" : [];
            val = (f.apiValueType == 1) ? "" : [];
            
            if(f.fieldType == 'slider' && this.threadId == 0) {
              let sliderVal = f.minValue;
              f.selectedValueIds = sliderVal;
              f.selectedValues = sliderVal;
              f.selectedVal = sliderVal;
              f.showTicks = true;
            }
            let wsVal = 0;
            if(this.CBADomain && this.threadId == 0 && f.fieldName == 'ThreadCategory') {
              let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];  
              let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
              let wsFormField = formFieldItems[wsIndex];
              let wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
              wsVal = wsApiField.selectedValues;
              if(wsApiField.autoselection != 1){
                let hiddenFlag = true;
                f.hiddenFlag = hiddenFlag;
                f.hiddenSection = hiddenFlag;
                f.valid = hiddenFlag;
                sec.hiddenSection = hiddenFlag;                
              }              
            }
            if(this.threadId > 0 || (this.threadId == 0 && (f.fieldName == 'workstreams' && f.autoselection == 1)  || (this.CBADomain && f.fieldName == 'ThreadCategory' && wsVal == 2))) {
              f.recentShow = false;
              let threadVal;
              if(this.threadId > 0) {
                threadVal = this.threadInfo[f.threadInfoApiKey];
                if((this.CBADomain || (!this.CBADomain && this.industryType.id == 1 && (this.domainId == 1 || this.domainId == 267))) && f.fieldName == 'workstreams') {
                  this.wsVal = parseInt(threadVal[0].id);
                }
              } else {
                threadVal = f.workstreamValues;                
              }
              threadVal = (wsVal == 2) ? [] : threadVal;

              if(f.fieldName == 'workstreams') {
                if(!f.relationalFields.includes('ThreadCategory') || this.threadId > 0) {
                  this.threadCatgVal = -1;
                  this.submitDisableFlag = true;
                  if(!this.CBADomain && this.threadId > 0) {
                    this.wsVal = 1;
                  }
                } else {
                  if(!this.CBADomain) {
                    switch (this.industryType.id) {
                      case 1:
                        this.wsVal = (this.domainId == 1 || this.domainId == 267) ? 1 : this.wsVal;
                        break;                    
                      case 2:
                        this.wsVal = (this.domainId == 63) ? 1 : this.wsVal;
                        break;
                    }
                    this.industryType.id == 1 && (this.domainId == 1 || this.domainId == 267)
                    this.wsVal = 1;
                  }
                  if(f.autoselection == 1) {
                    let timeout = 500;
                    if(this.mainSection == 1) {
                      this.mainSection = 2;
                      setTimeout(() => {
                        let append = true;
                        this.submitDisableFlag = false;
                        this.getThreadFields(this.wsVal, append, f.fieldName);  
                      }, timeout);
                    }
                  }
                  
                }
              }
              
              if(f.fieldName == 'threadType') {
                console.log(threadVal)
                this.threadType = threadVal;
                if(this.threadId > 0) {
                  let tyItemValues = [];
                  let tyIndex = f.itemValues.findIndex(option => option.apiValue == threadVal);
                  if(tyIndex >= 0) {
                    tyItemValues.push(f.itemValues[tyIndex]);
                  }
                  f.itemValues = tyItemValues;
                }
                this.threadApiData['threadType'] = threadVal;
                if(this.approvalEnableDomainFlag && this.threadId > 0 && threadVal == 'share') {
                  this.step2Title = (this.approveProcessFlag) ? 'Submit' : this.step2Title;
                  this.saveText = (this.approveProcessFlag) ? 'Submit' : this.saveText;
                }
              }

              if(f.fieldName == 'audioDescription') {
                console.log(threadVal)
                this.pageInfo.audioAttachmentItems = threadVal;
              }

              if(f.selection == 'multiple' || (f.fieldType == 'popup' && (f.fieldName != 'model' && f.fieldName != 'vinNo') && f.selection == 'single')) {
                console.log(f.fieldName, threadVal)
                let id = [];
                let name = [];
                f.selectedIds = threadVal;
                
                /*if((f.fieldName == 'AdditionalModelInfo' || f.fieldName == 'AdditionalModelInfo2') && threadVal.length > 0) {
                  let trimItems = [];
                  for(let tr of threadVal) {
                    trimItems.push({
                      id: tr.id,
                      name: tr
                    });
                  }
                  f.selectedIds = threadVal;
                }*/

                console.log(f, f.selectedIds);
                let code = [];
                if((Array.isArray(f.selectedIds) && this.CBADomain) || !this.CBADomain){
                  console.log(f, f.selectedIds);
                  for(let item of f.selectedIds) {
                    let iname = (f.fieldName == "technicianInfo") ? `${item.name} - ${item.phoneNo}` : item.name;
                    id.push(item.id);
                    name.push(iname);
                    if(f.fieldName == 'errorCode') {
                      let codeVal = `${item.code}##${item.description}`
                      code.push(codeVal);
                    }             
                  }
                }
                
                id = (f.selection == 'single' && f.apiValueType == 1) ? id[0] : id;
                name = (f.selection == 'single' && f.apiValueType == 1) ? name[0] : name;

                if(f.selection == 'single' && f.fieldType == 'popup') {
                  if(id == undefined) {
                    id = (f.apiValueType == 1) ? [] : id;
                  }
                  if(name == undefined) {
                    name = (f.apiValueType == 1) ? [] : name;
                  }
                }
                
                f.selectedValueIds = id;
                f.selectedValues = name;
                f.selectedVal = name;
                val = threadVal;
                formVal = (f.apiFieldType == 1) ? id : name;
                formVal = (f.fieldName == 'errorCode') ? code : formVal;
                formValueIds = id;
                formValueItems = name;
                console.log(formVal)
                //console.log(f.fieldName, threadVal.length)
                if(f.fieldName == 'uploadContents') {
                  this.pageInfo.attachmentItems = threadVal;
                  if(this.threadId > 0) {
                    let uploadContents = this.threadInfo[f.threadInfoApiKey];
                    localStorage.setItem('threadAttachments', JSON.stringify(uploadContents));
                  }
                }

                if(threadVal != undefined && threadVal.length > 0 && f.isMandatary == 1) {
                  f.valid = true;
                }
              } else {
                console.log(f.fieldName, threadVal, f)
                if(f.fieldType == 'chip-input') {
                 // threadVal = threadVal.split(",");
                //  threadVal = JSON.parse(threadVal);
                  console.log(threadVal)
                }
                f.selectedValueIds = threadVal;
                f.selectedValues = threadVal;
                f.selectedVal = threadVal;
                val = threadVal;
                formVal = threadVal;
                formValueIds = threadVal;
                formValueItems = threadVal;
                switch(f.fieldName) {
                  case 'workstreams':
                  case 'ThreadCategory':
                    let itemId = '';
                    if(Array.isArray(threadVal)) {
                      itemId = (threadVal.length > 0) ? threadVal[0].id : '';
                    }  else {
                      itemId = threadVal;
                    }
                    this.threadCatgVal = (f.fieldName == 'ThreadCategory') ? itemId : this.threadCatgVal;
                    f.disabled = (f.fieldName == 'ThreadCategory' && this.threadId > 0) ? true : false;
                    f.selectedIds = threadVal;
                    f.selectedValueIds = [itemId];
                    f.selectedValues = itemId;
                    let fid, fname;
                    console.log(f,threadVal)
                    if(threadVal) {  
                      if(f.fieldName == 'workstreams') {
                        for(let item of threadVal) {
                          fid = item.id;
                          fname = item.name;
                        }
                      }
                      if(f.fieldName == 'ThreadCategory') {
                        let tcItemName = '', tcItemId = '';
                        if(Array.isArray(threadVal)) {
                          tcItemId = (threadVal.length > 0) ? threadVal[0].id : '';
                          tcItemName = (threadVal.length > 0) ? threadVal[0].name : '';
                        }  else {
                          tcItemId = threadVal;
                        }
                        fid = tcItemId;
                        fname = tcItemName;
                      }
                    }
                    let fval = (f.apiFieldType == 1) ? fid : fname;
                    formVal = (f.apiValueType == 1) ? fval : [fval];
                    formValueIds = fid;
                    formValueItems = fname;

                    if(this.CBADomain && f.fieldName == 'ThreadCategory') {
                      let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];  
                      let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
                      let wsFormField = formFieldItems[wsIndex];
                      let wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
                      let ws = (wsApiField.autoselection == 1) ? wsApiField.selectedValueIds : wsFormField.formValue;
                      //let hiddenFlag = (ws == 1 || ws == 3) ? true : false;

                      let hiddenFlag = (this.threadId == 0 && ws != 2) ? true : false;
                      if(this.threadId > 0) {
                        //let ws = (wsApiField.autoselection == 1) ? wsApiField.selectedValueIds : wsFormField.formValue;
                        hiddenFlag = (ws == 1 || ws == 3) ? true : false;
                        if(hiddenFlag) {
                          f.selectedIds = [];
                          f.selectedValueIds = [];
                          f.selectedValues = '';
                          formVal = (f.apiValueType == 1) ? '' : [];
                          formValueIds = '';
                          formValueItems = '';
                        }
                      }

                      f.hiddenFlag = hiddenFlag;
                      f.hiddenSection = hiddenFlag;
                      f.valid = hiddenFlag;
                      sec.hiddenSection = hiddenFlag;
                      this.threadCatgVal = -1;
                      break;
                    }
                    break;
                  case 'threadType':
                    if(this.collabticDomain && this.threadId > 0) {                      
                      let tyItemVal = f.itemValues;
                      console.log(tyItemVal, f)
                      setTimeout(() => {
                        f.hiddenFlag = (this.threadCatgVal == 7) ? true : false;;
                        f.hiddenSection = (this.threadCatgVal == 7) ? true : false;
                        sec.hiddenSection = f.hiddenFlag;
                        tyItemVal.forEach(item => {
                          switch(item.apiValue) {
                            case 'thread':
                              item.hiddenFlag = (this.threadCatgVal == 7) ? true : false;;
                              item.active = (threadVal == 'share') ? 0 : 1;                            
                              break;
                            case 'share':
                              item.active = (this.threadCatgVal == 7) ? 0 : 1;
                              item.hiddenFlag = (this.threadCatgVal == 7) ? true : false;
                              break;  
                          }                    
                        });  
                      }, 1500);
                    }
                    this.threadType = threadVal;
                    this.threadApiData['threadType'] = this.threadType;
                    break;
                  case 'dtcToggle':
                    f.selection = threadVal; 
                    f.hiddenFlag = (this.CBADomain && this.wsVal == 3) ? true : false;
                  case 'errorCode':
                    f.hiddenFlag = (this.CBADomain && this.wsVal == 3) ? true : false;
                    break;
                  case 'model':
                    if(f.selection == 'single' && this.threadId > 0 && !this.TVSIBDomain && (this.industryType.id == 2 || this.industryType.id == 3)) {
                      let mlist = this.threadInfo['modelDataInfo'];
                      console.log(mlist)
                      let mid = mlist[0].id;
                      let mname = mlist[0].name;
                      f.selectedValues = mid;
                      f.itemValues = [{
                        id: mid,
                        name: mname
                      }];
                    }
                    break;
                  case 'ServerityLevel':
                  case 'UserLoginMethod':
                    let cid, cname;
                    for(let item of threadVal) {
                      cid = item.id;
                      cname = item.name;
                    } 
                    let cval = (f.apiFieldType == 1) ? cid : cname;
                    formVal = (f.apiValueType == 1) ? cval : [cval];
                    formValueIds = cid;
                    formValueItems = cname;
                    f.selectedValueIds = [cid];
                    f.selectedValues = cid;
                    f.selectedVal = cname;    
                    f.selectedIds = threadVal;
                    break;
                  case 'SystemSelection':
                  case 'SelectProductType':
                    f.disabled = (f.fieldName == 'SelectProductType' && this.industryType.id == 3) ? true : f.disabled;
                    let id, name;
                    for(let item of threadVal) {
                      id = item.id;
                      name = item.name;
                    } 
                    let val = (f.apiFieldType == 1) ? id : name;
                    formVal = (f.apiValueType == 1) ? val : [val];
                    formValueIds = id;
                    formValueItems = name;
                    if(f.fieldName == 'SystemSelection' && threadVal.length > 0) {
                      f.selectedValueIds = id;
                      f.selectedValues = name;
                      f.selectedVal = name;
                    }
                    break;
                  case 'year':
                    f.disabled = (this.industryType.id == 3) ? true : false;
                    break;                    
                }
                if(f.fieldType == 'slider') {
                  let sliderVal = threadVal;
                  f.selectedValueIds = sliderVal;
                  f.selectedValues = sliderVal;
                  f.selectedVal = sliderVal;
                }

                if(threadVal != "" && f.isMandatary == 1) {
                  f.valid = true;
                }
              }
              console.log(f, f.fieldName, f.threadInfoApiKey, this.threadInfo[f.threadInfoApiKey])
            }
            let threadItemVal = '';            
            switch (f.fieldName) {
              case 'threadType':
                let itemLen = f.itemValues.length;
                let itemClass = (itemLen == 1) ? 'col-md-6' : (itemLen > 1 && itemLen < 4) ? `col-md-${12/itemLen}` : 'col-md-4';
                for(let i of f.itemValues) {
                  i.itemClass = itemClass;
                  if(i.apiValue == f.selectedVal) {
                    threadItemVal = i.name;
                  }
                }
                break;
              case 'vinNo':
              case 'vinNoScanTool':  
                let invalidTxt = (this.industryType.id == 3 && this.domainId == 97) ? 'Frame No' : 'VIN';
                let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];  
                let vwsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
                f.disabled = (this.threadId > 0 || formFieldItems[vwsIndex].valid) ? false : true;
                f.vinNo = '';
                f.vinValid = (this.threadId == 0) ? false : true;
                f.invalidFlag = false;
                f.invalidError = `Invalid ${invalidTxt}`;
                f.changeAction = '';
                f.vinDetails = [];
                if(this.threadId > 0 && val.length == 17) {
                  setTimeout(() => {
                    let relationalFields = (f.relationalFields == '') ? [] : JSON.parse(f.relationalFields);
                    for(let rf of relationalFields) {
                      this.disableField(rf, true);
                    }                    
                  }, 1500);
                  if(f.fieldName == 'vinNoScanTool') {
                    let vinRes = (this.threadInfo['scanVinInfo'] == '') ? '' : JSON.parse(this.threadInfo['scanVinInfo']);
                    console.log(vinRes)
                    let scanVinInfo = [];
                    if(vinRes != '') {
                      scanVinInfo = [{
                        vin: this.threadInfo[f.threadInfoApiKey],
                        make: vinRes.make,
                        model: vinRes.model,
                        year: vinRes.year
                      }];
                    }
                    f.vinDetails = scanVinInfo;
                    setTimeout(() => {
                      let vinIndex = formFieldItems.findIndex(option => option.fieldName == f.fieldName);
                      formFieldItems[vinIndex].vinDetails = scanVinInfo;
                      formFieldItems[vinIndex].valid = true;
                    }, 1500);
                  }
                } else {
                  setTimeout(() => {
                    let vinIndex = formFieldItems.findIndex(option => option.fieldName == f.fieldName);
                    formFieldItems[vinIndex].vinDetails = [];
                  }, 1500);
                }
                break;
              case 'repairOrder':
                if(this.CBADomain && this.threadId > 0) {
                  apiInfo.userId = this.threadInfo['owner'];
                  console.log(apiInfo.userId)
                }
                let rinvalidTxt = 'RO#';
                let rformFieldItems = this.formFields[this.stepIndex][this.stepTxt];
                let rvwsIndex = rformFieldItems.findIndex(option => option.fieldName == 'workstreams');
                f.disabled = (this.threadId > 0 || rformFieldItems[rvwsIndex].valid) ? false : true;
                f.roNo = '';
                f.roValid = true;
                f.invalidFlag = false;
                f.invalidError = `Invalid ${rinvalidTxt}`;
                f.changeAction = '';
                f.roDetails = [];
                break;  
              case 'year':
                f.itemValues = this.years;
                break;              
            }

            if(f.apiName != '') {
              let loadApi = true;
              let apiUrl = f.apiName;
              //console.log(apiUrl);
              console.log(f)
              let apiData = apiInfo;
              let query = (f.queryValues == "") ? "" : JSON.parse(f.queryValues);
              let commonApiValue = parseInt(f.commonApiValue);
              let commonApiParamName = 'commonApiValue';
              if(Array.isArray(query)) {
                let capiIndex = query.findIndex(option => option == commonApiParamName);
                if(capiIndex >= 0) {
                  apiData[query[capiIndex]] = commonApiValue;
                }
              }
              
              let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
              let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
              let tcIndex = formFieldItems.findIndex(option => option.fieldName == 'ThreadCategory');
              let ws, wsFormField, wsApiField, tc, tcFormField, tcApiField, apiAccess;
              let extraField = [];
              switch (f.fieldName) {
                case "workstreams":
                  if(!this.CBADomain && this.threadId == 0 && f.selection == 'multiple') {
                    let wfRel = (f.relationalFields == "") ? [] : JSON.parse(f.relationalFields);
                    if(wfRel.length == 0) {
                      this.wsVal = -1;
                    }
                  }
                  apiData['type'] = 1;
                  apiData['contentTypeId'] = this.contentType;
                  if(this.threadId > 0) {
                    let threadCatgVal = this.threadInfo['threadCategoryData'];
                    console.log(threadCatgVal)
                    if(Array.isArray(threadCatgVal) && threadCatgVal.length > 0) {
                      let tcId = threadCatgVal[0].id;
                      apiData[query[0]] = tcId;
                    }                    
                  }
                  break;
                case 'ThreadCategory':
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
                  ws = (wsApiField.autoselection == 1) ? wsApiField.selectedValueIds : wsFormField.formValue;
                  loadApi = (this.threadId > 0 || (this.threadId == 0 && ((this.collabticDomain && this.mainSection == 2) || (this.CBADomain && ws == 2)))) ? true : false;
                  apiAccess = (this.threadId > 0) ? 'Edit Thread' : 'New Thread';
                  f.disabled = (wsApiField.autoselection == 1) ? false : true;
                  apiData[query[0]] = JSON.stringify(ws);
                  break;
                case 'make':
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];  
                  f.disabled = (wsApiField.autoselection == 1) ? false : f.disabled;
                  f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                  loadApi = false;
                  if(this.threadId > 0 || wsApiField.autoselection == 1 || appendField) {
                    ws = wsApiField.selectedValueIds;
                    let apiName = f.apiName;
                    apiAccess = (this.threadId > 0) ? 'Edit Thread' : 'New Thread';
                    apiData[query[0]] = JSON.stringify(ws);
                    if(appendField || (this.industryType.id == 1 && (this.domainId == 1 || this.domainId == 267))) {
                      tcFormField = formFieldItems[tcIndex];
                      tcApiField = this.apiFormFields[this.stepIndex][this.stepTxt][tcFormField.sec]['cells']['name'][tcFormField.findex];   
                      console.log(tcApiField, query)
                      tc = tcApiField.selectedValueIds;
                      let tcIdIndex = query.findIndex(option => option == 'threadCategoryId');
                      if(tcIdIndex >= 0) {
                        apiData[query[tcIdIndex]] = JSON.stringify(tc);
                      }
                    }
                    apiData['access'] = apiAccess;
                    f.loading = f.disabled;
                    extraField = [];
                    console.log(i, extraField)
                    // Get field data
                    this.getData(action, c, f, apiName, apiData, extraField);
                  }
                  break;
                case 'SelectProductType':
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
                  f.valid = true;
                  let disableFlag = (this.industryType.id == 3) ? f.disableFlag : false;
                  f.disabled = (wsApiField.autoselection == 1) ? false : true;
                  f.disabled = (disableFlag) ? true : f.disabled;

                  console.log(f.disabled)
                  loadApi = false;
                  if(this.threadId > 0 || wsApiField.autoselection == 1) {
                    f.loading = f.disabled;
                    ws = (wsApiField.autoselection == 1) ? wsApiField.selectedValueIds : wsFormField.formValue;
                    query = JSON.parse(f.queryValues);
                    extraField = [];
                    for(let q of query) {
                      switch(q) {
                        case 'workstreamsList':
                          apiData[q] = JSON.stringify(ws);
                          break;
                        case 'makeName':
                          //apiData[q] = this.threadInfo['make'];
                          apiData[q] = '';
                          break;
                        case 'modelName':
                          //apiData[q] = this.threadInfo['model'];
                          apiData[q] = '';
                          break;
                      }
                    }
                    setTimeout(() => {
                      this.getData(action, sec, f, apiUrl, apiData, extraField);
                    }, 2500);                    
                  }
                  break;  
                case 'model':
                  f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                  //f.disabled = (this.threadId > 0) ? false : true;
                  f.disabled = (this.industryType.id == 3) ? true : f.disabled;
                  loadApi = false;  
                  if(this.threadId > 0) {
                    sec.optFieldsFlag = false;
                    sec.optDisableFlag = false;
                    sec.toggleTxt = "Show";
                  }
                  break;
                case 'year':
                  //f.disabled = (this.industryType.id == 2) ? true : f.disabled;
                  f.disabled = (this.industryType.id == 3) ? true : f.disabled;
                  break;                
                case 'errorCode':
                  setTimeout(() => {
                    let dtcToggleFieldName = "dtcToggle";
                    let dtcIndex = formFieldItems.findIndex(option => option.fieldName == dtcToggleFieldName);
                    let dtcToggleField = formFieldItems[dtcIndex];
                    let dtcToggleApiField = this.apiFormFields[this.stepIndex][this.stepTxt][dtcToggleField.sec]['cells']['name'][dtcToggleField.findex];  
                    console.log(dtcToggleApiField.selection)
                    f.valid = ((this.threadId == 0 && dtcToggleApiField.selection) || (this.threadId > 0 && dtcToggleApiField.selection && f.selectedIds.length == 0)) ? false : true;
                  }, 50);
                  break;
                default:
                  loadApi = (commonApiValue > 0 && Array.isArray(query)) ? true : false;
                  if(this.CBADomain && f.fieldName == 'repairOrder' && this.threadId > 0 && val.length >= 3) {
                    let roVal = this.threadInfo[f.threadInfoApiKey];
                    apiData[query[0]] = roVal;
                    loadApi = true;
                    /* this.dialogContent = this.repairDecode;
                    this.dialogClose = false;
                    this.dialogEscClose = false;
                    this.dialogLoader = true;
                    this.dialogModal = true; */
                  }
                  break;
              }

              if(loadApi) {
                console.log(f.fieldName)
                f.disabled = true;
                f.loading = f.disabled;
                setTimeout(() => {
                  extraField = [];
                  // Get field data
                  this.getData(action, sec, f, apiUrl, apiData, extraField);
                }, 1500);
              }
            }
            
            let formControlFlag = true;
            if(f.fieldName == 'threadType' || f.fieldName == 'helpType') {
              formControlFlag = false;
            }

            if(this.threadId == 0 && f.fieldType == 'toggle') {
              f.selection = (f.selection == 'off') ? false : true;
            }
            if(this.threadId == 0) {
              val = (f.apiValueType == 1) ? "" : [];
            }         
            this.threadForm.addControl(f.apiFieldKey, new FormControl(val));
            if(formControlFlag) {
              let flag = (f.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, f.apiFieldKey);
            }

            if(this.threadId == 0 && f.fieldName == 'content') {
              let upItems = Object.keys(this.audioUploadedItems);
              f.valid = (upItems.length > 0 && this.audioUploadedItems.items.length > 0) ? true : false;
            }
            
            if(this.threadId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
              if(step2ApiFormField != undefined && step2ApiFormField != 'undefined') {
                let apiField = step2ApiFormField['cells']['name'];
                let chkApiFieldIndex = apiField.findIndex(option => option.fieldName == f.fieldName);
                if(chkApiFieldIndex >= 0) {
                  let currApiField = apiField[chkApiFieldIndex]; 
                  if(f.fieldType == 'toggle') {
                    f.selection = currApiField.selection;
                  }

                  if(f.fieldType != 'toggle' && currApiField.fieldName == f.fieldName) {
                    f.selectedValueIds = currApiField.selectedValueIds;
                    f.selectedValues = currApiField.selectedValues;
                    f.selectedVal = currApiField.selectedVal;
                  }
                }
              }

              let chkFieldIndex = step2FormField.findIndex(option => option.fieldName == f.fieldName);
              fieldFlag = (chkFieldIndex >= 0) ? false : true;
              if(!fieldFlag) {
                step2FormField[chkFieldIndex]['findex'] = c;
              }
              console.log(step2ApiFormField, step2FormField, f.fieldName, chkFieldIndex, fieldFlag)
            }
            if(fieldFlag) {
              console.log(f, formVal, val, this.industryType.id);
              if(f.fieldType == 'popup' && (this.industryType.id == 2 || this.industryType.id == 3)) {
                switch (f.fieldName) {
                  case 'AdditionalModelInfo':
                  case 'AdditionalModelInfo2':
                  case 'AdditionalModelInfo3':
                  case 'AdditionalModelInfo4':
                  case 'AdditionalModelInfo5':
                    f.disabled = true;
                    console.log(f.fieldName, f.disabled)
                    break;
                }
              }
              let onloadFlag = (this.threadId == 0) ? true : false;
              onloadFlag = (this.threadId == 0 && f.fieldName == 'workstreams' && f.autoselection == 0) ? true : false;
              if(val == 'undefined' || val == undefined) {
                val = (f.apiValueType == 1) ? "" : [];
              }
              let vin = (f.fieldName == 'vinNo');
              let squareBoxType = 0;
              if(this.CBADomain){
                squareBoxType = f.squareBoxType
              } 
              this.formFields[this.stepIndex][this.stepTxt].push({
                apiFieldKey: f.apiFieldKey,
                displayFlag: f.displayFlag,
                fieldName: f.fieldName,
                fieldType: f.fieldType,
                findex: c,
                formatAttr: f.apiFieldType,
                formatType: f.apiValueType,
                formValue: (onloadFlag) ? val : formVal,
                formValueIds: (onloadFlag) ? val : formValueIds,
                formValueItems: (onloadFlag) ? val : formValueItems,
                group: sec.groups,
                isArray: f.isArray,
                isMandatary: f.isMandatary,
                mandatoryText: f.mandatoryText,
                optField: false,
                placeholder: f.placeholder,
                squareBoxType: squareBoxType,
                sec: i,
                selection: f.selection,
                selectedVal: threadItemVal,
                threadType: f.threadType,
                valid: f.valid,
                vinNo: f.vin                
              });                
            }            
          }
          c++;     
        }

        for(let opt of fieldOptionalData) {
          opt.displayFlag = true;
          opt.disabled = true;
          opt.loading = false;
          opt.valid = (opt.isMandatary == 1) ? false : true;
          opt.mandatoryText = (this.CBADomain) ? opt.mandatoryText : mandatoryText;
          opt.isNumeric = false;
          opt.errorMsg = "";
          opt.isArray = (opt.apiValueType == 1) ? false : true;
          opt.selectedValueIds = (opt.apiValueType == 1) ? "" : [];
          opt.selectedValues = (opt.apiValueType == 1) ? "" : [];
          opt.selectedVal = (opt.apiValueType == 1) ? "" : [];
          val = opt.selectedVal;         
          if(this.threadId > 0) {
            opt.recentShow = false;
            let threadVal = this.threadInfo[opt.threadInfoApiKey];
            console.log(opt, opt.threadInfoApiKey, threadVal)
            if(opt.selection == 'multiple') {
              opt.itemValues = threadVal;
              opt.selectedIds = threadVal;
              console.log(opt.itemValues, opt.fieldName, threadVal)
              let id = [];
              let name = [];
              for(let item of opt.selectedIds) {
                id.push(item.id);
                name.push(item.name);
              }
              opt.selectedValueIds = id;
              opt.selectedValues = name;
              opt.selectedValue = name;
              val = threadVal;
              formVal = (opt.apiFieldType == 1) ? id : name;
              formValueIds = id;
              formValueItems = name;
              
              console.log(opt.fieldName, threadVal.length)
              if(threadVal.length > 0 && opt.isMandatary == 1) {
                opt.valid = true;
              }
            } else {
              let id, name, list;
              if(opt.fieldName == 'make') {
                id = this.threadInfo['makeId'];
                name = threadVal;
                list = {
                  id: id,
                  name: name
                };
                opt.itemValues = [];
                opt.itemValues.push(list);
              } else {
                opt.itemValues = threadVal;
                for(let item of threadVal) {
                  id = item.id;
                  name = item.name;
                } 
              }
              
              opt.selectedValueIds = id;
              opt.selectedValues = id;
              opt.selectedVal = name;
              console.log(opt, list)
              val = threadVal;
              formVal = threadVal;
              formValueIds = threadVal;
              formValueItems = threadVal;
              if(threadVal != "" && opt.isMandatary == 1) {
                opt.valid = true;
              }
            }
          }
          
          //console.log(opt.fieldName, opt.apiFieldKey, val);
          this.threadForm.addControl(opt.apiFieldKey, new FormControl(val));
          let flag = (opt.isMandatary == 1) ? true : false;
          this.setFormValidation(flag, opt.fieldName);
          if(this.threadId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
            let chkFieldIndex = step2FormField.indexOf(option => option.fieldName == opt.fieldName);
            fieldFlag = (chkFieldIndex >= 0) ? false : true;
            if(!fieldFlag) {
              step2FormField[chkFieldIndex]['findex'] = c;
            }
          }
          if(fieldFlag) {
            let squareBoxType = 0;
            if(this.CBADomain){
              squareBoxType = opt.squareBoxType
            } 
            this.formFields[this.stepIndex][this.stepTxt].push({
              apiFieldKey: opt.apiFieldKey,
              displayFlag: opt.displayFlag,
              fieldName: opt.fieldName,
              fieldType: opt.fieldType,
              findex: c,
              formatAttr: opt.apiFieldType,
              formatType: opt.apiValueType,
              formValue: formVal,
              formValueIds: formValueIds,
              formValueItems: formValueItems,
              group: sec.groups,
              isArray: opt.isArray,
              isMandatary: opt.isMandatary,
              mandatoryText: opt.mandatoryText,
              optField: true,
              placeholder: opt.placeholder,
              squareBoxType: squareBoxType,
              sec: i,
              selection: opt.selection,
              threadType: opt.threadType,
              valid: opt.valid
            });            
            o++;
          }
        }
        
        this.apiFormFields[this.stepIndex][this.stepTxt][i] = sec;
        i++;          
      }
      /* if(this.stepTxt == 'step1' && this.CBADomain && appendField && this.threadId > 0) {
        let chkField = 'workstreams';
        let formFields = this.formFields[this.stepIndex][this.stepTxt]; 
        let wsIndex = formFields.findIndex(option => option.fieldName == chkField);
        let wsfData = formFields[wsIndex];
        let wsecIndex = wsfData.sec;
        let wsfield = this.apiFormFields[this.stepIndex][this.stepTxt][wsecIndex];
        let wsFieldIndex = wsfield['cells']['name'].findIndex(option => option.fieldName == chkField);
        let wsf = wsfield['cells']['name'][wsFieldIndex];
        let wsValue = this.threadInfo[wsf.threadInfoApiKey];
        let wsVal = parseInt(wsValue[0].id);
        if((this.wsVal < 3 && wsVal == 3) || (this.wsVal == 3 && wsVal < 3)) {
          let wsItemIndex = wsf.itemValues.findIndex(option => option.id == this.wsVal);
          let wsRelFields = wsf.itemValues[wsItemIndex].relationFields;
          wsRelFields.forEach(item => {
            let chkFieldName = item.fieldName;
            this.setupFieldData(chkFieldName, this.stepIndex, this.stepTxt, 'name');
          });
        }
      } */

      this.pageInfo['threadUpload'] = this.threadUpload;
      this.pageInfo['apiFormFields'] = this.apiFormFields;
      console.log(this.apiFormFields);
      console.log(this.formFields);
      console.log(this.threadForm)
      let timeout = (this.threadId == 0) ? 1000 : 1700;
      setTimeout(() => {
        this.loading = false;
        this.step2Loading = this.loading;
        setTimeout(() => {
          if(this.stepTxt == 'step1') {
            let tcindex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == 'ThreadCategory');
            if(tcindex < 0) {
              this.threadCatgVal = -1;
              this.submitDisableFlag = (this.threadId == 0 || (!this.CBADomain && this.threadId >= 0)) ? true : false;              
            }

            //if(appendField || this.threadId > 0) {
            if(appendField) {
              this.submitDisableFlag = true;
            }            
            let panelWidth = document.getElementById('form-cont').offsetWidth;
            this.pageInfo.panelWidth = panelWidth;
            this.pageInfo.panelHeight = this.innerHeight;
            let data = {
              action: 'panel-width',
              pageInfo: this.pageInfo,
              step1Submitted: this.step1Submitted,
              step2Submitted: this.step2Submitted,
              formGroup: this.threadForm      
            }
            this.commonApi.emitDynamicFieldData(data);
          }
        }, 200);
      }, timeout);
    });
  }

  // Set Form Validation
  setFormValidation(flag, field) {
    if(flag) {
      this.threadForm.controls[field].setValidators([Validators.required]);
    }
  }

  // Get Field Data
  getData(action, sec, fi, apiUrl, apiData, extraField) {
    console.log(action, apiData, extraField)
    let makeFieldName = 'make';
    let modelFieldName = 'model';
    let ptFieldName = 'SelectProductTypes';
    let callbackItems = [];
    switch (fi.fieldName) {
      case 'vinNo':
      case 'repairOrder':
        callbackItems = JSON.parse(fi.relationalFields);
        break;
    }
    let modelFieldIndex, ptFieldIndex, mindex, ptindex;
    let f,field,fieldIndex,fieldName,fieldSec,secIndex,stepIndex,stepTxt,itemValues,formData;
    apiUrl = `${this.baseApiUrl}/${fi.apiName}`;
    let body: HttpParams = new HttpParams();
    Object.keys(apiData).forEach(key => {
      let value:any = apiData[key];
      body = body.append(key, value);
    });
    let chkFlag = (Object.keys(extraField).length > 0) ? true : false;
    let disableFlag = (action == 'trigger') ? true : false;
    if(disableFlag && this.industryType.id == 3) {
      disableFlag = fi.disableFlag;
    }
    let callbackAction = 'loading';
    switch (fi.fieldName) {
      case 'vinNo':
        for(let i of callbackItems) {
          this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues);
        }
      break;
      case 'repairOrder':
        if(this.threadId == 0) {
          for(let i of callbackItems) {
            this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues);
          }
        }
      break;
    }
    
    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      fi.disabled = false;
      fi.loading = fi.disabled;
      let currentFieldName = fi.fieldName;
      switch (currentFieldName) {
        case "workstreams":
          fi.itemValues = response['workstreamList'];
          let displayFlag = (this.CBADomain && this.threadId > 0) ? true : false;
          console.log(displayFlag)
          fi.itemValues.forEach(witem => {
            witem.disabled = displayFlag;
            witem.imageClass = (this.CBADomain) ? witem.imageClass : '';
          });
          fi.recentSelectionValue.forEach(ritem => {
            ritem.disabled = displayFlag;
          });
          console.log(fi, fi.itemValues)
          let workstreamVal = (this.threadId == 0 && fi.autoselection == 1) ? fi.workstreamValues : fi.selectedIds;
          if(Array.isArray(workstreamVal) && workstreamVal.length > 0) {
            let windex = fi.itemValues.findIndex(option => option.id == workstreamVal[0].id); 
            if(windex >= 0) {
              let itemVal = fi.itemValues[windex];
              workstreamVal[0].key = itemVal.key;
              workstreamVal[0].editAccess = itemVal.editAccess;
              if(this.threadId == 0 && fi.autoselection == 1) {
                let threadCatgName = 'ThreadCategory';
                let wfRel = (fi.relationalFields == "") ? [] : JSON.parse(fi.relationalFields);
                let tcfIndex = wfRel.findIndex(option => option == threadCatgName);
                if(wfRel.length > 0 && tcfIndex >= 0) {
                  let apiInfo = this.baseApiInfo();
                  let query, tcIndex;
                  tcIndex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == wfRel[tcfIndex]);
                  if(tcIndex >= 0) {
                    let wsInfo = fi.selectedValueIds;
                    let tcsecIndex = this.formFields[this.stepIndex][this.stepTxt][tcIndex].sec;
                    let tcfield = this.apiFormFields[this.stepIndex][this.stepTxt][tcsecIndex];
                    let threadCatgFieldIndex = tcfield['cells']['name'].findIndex(option => option.fieldName == threadCatgName);
                    this.apiFormFields[this.stepIndex][this.stepTxt][tcsecIndex]['cells']['name'][threadCatgFieldIndex].disabled = false;
                    let tcf = tcfield['cells']['name'][threadCatgFieldIndex];
                    
                    console.log(tcf)
                    let tcapiData = apiInfo;
                    let tcapiName = tcf.apiName;
                    let tcextraField = [];
                    query = JSON.parse(tcf.queryValues);
                    tcapiData[query[0]] = JSON.stringify(wsInfo);
                    if(this.threadId == 0) {
                      tcf.disabled = true;
                      tcf.loading = tcf.disabled;  
                      this.getData(action, tcsecIndex, tcf, tcapiName, tcapiData, tcextraField);
                    }
                  }
                }
              }
            }            
          }
          break;         
        case 'vinNo':
        case 'vinNoScanTool':
          setTimeout(() => {
            this.dialogModal = false;
            this.dialogLoader = false;
            this.dialogContent = '';
            this.dialogEscClose = true;  
          }, 1500);          
          fieldIndex = extraField.findIndex;
          fieldSec = extraField.fieldSec;
          secIndex = extraField.secIndex;
          let vinStatus = response['status'];
          let vinRes = response['vinDetails'];
          let vinScanFlag = (currentFieldName == 'vinNoScanTool') ? true : false; 
          let vinFlag = (vinStatus == 'Success' && vinRes.length > 0) ? true : false; 
          console.log(action, sec, vinRes, vinFlag)
          //fi.disabled = vinFlag;
          fi.valid = vinFlag;
          let formField = this.formFields[this.stepIndex][this.stepTxt];
          let vindex = formField.findIndex(option => option.fieldName === currentFieldName);
          fi.invalidFlag = !vinFlag;
          fi.vinValid = vinFlag;
          formField[vindex].valid = vinFlag;
          
          if(vinFlag) {
            //fi.disabled = true;
            vinRes = vinRes[0];
            console.log(apiData.vin, vinScanFlag)
            fi.vinNo = apiData.vin;
            formField[vindex].vinNo = fi.vinNo;
            localStorage.setItem('VinNo', fi.vinNo); 
            if(!vinScanFlag) {
              // Setup Vin Details
              this.setupVinDetails(vinRes, callbackItems, extraField, chkFlag, sec);
            } else {
              console.log(vinRes)
              let vinInfo = [{
                vin: fi.vinNo,
                make: vinRes.makeName,
                model: vinRes.model,
                year: vinRes.year
              }];
              fi.vinDetails = vinInfo;
              formField[vindex].vinDetails = vinInfo;
            }
          } else {
            fi.vinNo = '';
            formField[vindex].vinNo = fi.vinNo; 
            if(!vinScanFlag) {
              let mindex = formField.findIndex(option => option.fieldName === 'model');
              let modelVal = formField[mindex].formValue;
              let formatType = formField[mindex].formatType;
              let confFlag, resetFlag = false;
              console.log(modelVal, formField);
              if(formatType == 1) {
                confFlag = (modelVal == '') ? false : true;
              } else {
                confFlag = (modelVal.length == 0) ? false : true;
              }
              if(confFlag) {
                this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].optDisableFlag = true;
                //this.removeVinData(callbackItems, formField)
                for(let i of callbackItems) {
                  let chkIndex = formField.findIndex(option => option.fieldName === i);
                  let cfieldSec = (formField[chkIndex].optField) ? 'optionFilter' : 'name';
                  this.setupFieldData(i, this.stepIndex, this.stepTxt, cfieldSec);
                  let flag = (this.industryType.id == 3) ? true : false;
                  this.disableField(i, flag);
                  if(i == 'make') {
                    let chkField = extraField['field']['cells']['name']; 
                    let mkIndex = chkField.findIndex(option => option.fieldName == 'make');
                    let mkField = chkField[mkIndex];
                    console.log(mkField, apiData);
                    let wsInfo = apiData['worksteamList'];
                    let mapiData = this.baseApiInfo();
                    let mapiName = mkField.apiName;
                    let query = JSON.parse(mkField.queryValues);
                    mapiData[query[0]] = wsInfo;

                    let extra = [];
                    // Get Make Field Data
                    this.getData('onload', extraField['secIndex'], chkField[mkIndex], mapiName, mapiData, extra);
                  }
                }              
                this.setupFieldData(currentFieldName, this.stepIndex, this.stepTxt, fieldSec);              
              }
              callbackAction = 'unload';
              for(let i of callbackItems) {
                this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues);
              }
            } else {
              console.log(fi)
              fi.vinDetails = [];
              formField[vindex].vinDetails = [];
            }
          }        
          break;
        case 'repairOrder':
          fieldIndex = extraField.findIndex;
          fieldSec = extraField.fieldSec;
          secIndex = extraField.secIndex;
          let roStatus = response['status'];
          let roRes = response['items'];
          let roFlag = (roStatus == 'Success' && roRes.length > 0) ? true : false; 
          //console.log(action, sec, roRes, roFlag)
          //fi.disabled = roFlag;
          fi.valid = roFlag;
          let rformField = this.formFields[this.stepIndex][this.stepTxt];
          let roindex = rformField.findIndex(option => option.fieldName === currentFieldName);
          fi.invalidFlag = !roFlag;
          fi.roValid = roFlag;
          rformField[roindex].valid = roFlag;
          console.log(rformField)
          if(roFlag) {
            //fi.disabled = true;
            roRes = roRes[0];
            console.log(apiData, fi, roRes, roRes.vin)
            let roVin = (roRes.vin == '' || roRes.vin == undefined) ? '' : roRes.vin;
            fi.roDetails = roRes;
            fi.roNo = apiData.repairOrderNo;
            rformField[roindex].roNo = fi.roNo;
            rformField[roindex].roDetails = roRes;
            localStorage.setItem('roNo', fi.roNo);
            if(this.threadId == 0 || fi.changeAction == 'change') {
              let raction = 'repairOrderCall';
              // Setup Vin Details
              this.setupVinDetails(roRes, callbackItems, extraField, chkFlag, sec, raction);
            }
            if(this.threadId > 0 && action == 'onload' && roVin) {
              this.dialogModal = false;
              this.dialogContent = '';
              this.dialogClose = true;
            }
            //this.dialogModal = (roVin) ? false : true;
            if(this.dialogModal && !roVin) {
              this.dialogClose = true;
              this.dialogEscClose = true;
              this.dialogContent = this.repairVinErr;
              this.dialogLoader = false; 
            }
          } else {
            fi.roNo = '';
            rformField[roindex].roNo = fi.roNo; 
            callbackAction = 'unload';
            for(let i of callbackItems) {
              this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues);
            }
            this.dialogClose = true;
            this.dialogEscClose = true;
            this.dialogContent = this.repairErr;
            this.dialogLoader = false;
          }        
          break;  
        case 'ThreadCategory':
          let platformId = localStorage.getItem('platformId');
          if(platformId=='3') {
            fi.itemValues = response['items'];
          } else {
            let valFlag = (fi.itemValues.length > 0 && (fi.selectedValues != '' && fi.selectedValues != undefined && fi.selectedValues != 'undefined')) ? true : false;
            let prevRel = [];
            let prevId = 0;
            let ctimeout = 0;
            if(valFlag) {
              ctimeout = 500;
              let itemIndex = fi.itemValues.findIndex(option => option.id == fi.selectedValues);
              prevId = (itemIndex >= 0) ? fi.selectedValues : 0;
              prevRel = (itemIndex >= 0) ? fi.itemValues[itemIndex].relationFields : [];
              console.log(valFlag, itemIndex, prevRel)
            }
            setTimeout(() => {
              fi.disabled = (this.threadId > 0) ? true : false;
              fi.itemValues = response['items'];
              if(this.collabticDomain && this.threadId > 0) {
                fi.itemValues.forEach(itemVal => {
                  itemVal.disabled = true;
                });
              }
              if(fi.itemValues.length == 1) {
                let id = fi.itemValues[0].id;
                let timeout = 50;
                if(prevRel.length > 0 && valFlag && prevId != id) {
                  timeout = 500;
                  this.clearStep2();
                  this.emptyThreadCatgFields(fieldName, fi, this.stepIndex, this.stepTxt, fieldSec, false, -1, prevRel);
                }
                console.log(prevRel, valFlag, prevId, id, fi)
                if(id != fi.selectedValues) {
                  this.threadCatgVal = parseInt(id);
                  console.log(this.formFields)
                  let name = fi.itemValues[0].name;            
                  let formVal = (fi.apiFieldType == 1) ? id : name;
                  formVal = (fi.apiValueType == 1) ? formVal : [formVal];
                  fi.selectedValueIds = formVal;
                  fi.selectedValues = id;
                  fi.selectedVal = formVal;
                  fi.valid = true;
                  let findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == fi.fieldName);
                  this.formFields[this.stepIndex][this.stepTxt][findex].formValue = formVal;
                  this.formFields[this.stepIndex][this.stepTxt][findex].formValueIds = formVal;
                  this.formFields[this.stepIndex][this.stepTxt][findex].formValueItems = [name];
                  this.formFields[this.stepIndex][this.stepTxt][findex].valid = true;
                  this.clearStep2();
                  let append = true;
                  setTimeout(() => {
                    this.submitDisableFlag = false;
                    this.getThreadFields(id, append, currentFieldName);
                  }, timeout);
                }
              }
            }, ctimeout);  
          }                  
          break;
        case 'make':
        case 'SelectProductType':
          console.log(Object.keys(extraField).length, extraField);
          f = (chkFlag) ? extraField.f : '';
          field = (chkFlag) ? extraField.field : '';
          fieldIndex = (chkFlag) ? extraField.fieldIndex : '';
          fieldName = (chkFlag) ? extraField.fieldName : '';
          fieldSec = (chkFlag) ? extraField.fieldSec : '';
          secIndex = (chkFlag) ? extraField.secIndex : '';
          stepIndex = (chkFlag) ? extraField.stepIndex : '';
          stepTxt = (chkFlag) ? extraField.stepTxt : '';
          let val = (chkFlag) ? this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedVal : '';
          val = (action == 'onload' && this.threadId > 0) ? fi.selectedVal : val;
          chkFlag = (action == 'onload' && this.threadId > 0) ? true : false;
          let selId = 0;
          let selName = '';
          console.log(action, chkFlag, val)
          let res = (fi.fieldName == 'make') ? response['modelData'] : response['data'].items;
          //console.log(res)
          fi.itemValues = [];
          for(let m in res) {
            fi.itemValues.push({
              id: res[m].id,
              name: (fi.fieldName == 'make') ? res[m].makeName : res[m].name
            });
            let checkArr = ['id', 'name'];
            fi.itemValues = this.commonApi.unique(fi.itemValues, checkArr);
            let makeName = res[m].makeName;
            console.log(this.industryType.id)
            if(fi.selection == 'single' && (this.tvsDomain || this.TVSIBDomain || this.industryType.id == 4)) {
              console.log(res[m], val)
              makeName = (fi.fieldName == 'make') ? res[m].makeName : res[m].name;
              if(Array.isArray(val)) {
                val = val.length > 0 ? val : '';
              }
              val = (Array.isArray(val) && val.length > 0) ? val[0]['name'] : val;
            }
            if(chkFlag && (fi.fieldName == 'make' && val.toLowerCase() == makeName.toLowerCase()) || (fi.fieldName == 'SelectProductType' && val.toLowerCase() == makeName.toLowerCase())) {
              disableFlag = false;
              selId = res[m].id;
              selName = (fi.fieldName == 'make') ? res[m].makeName : res[m].name;
            }
          }
          console.log(chkFlag, val, disableFlag);
          
          if(action != 'onload') {
            fi.recentSelectionValue = response['recentSelection'];
            fi.recentShow = true;
          } else {
            fi.selectedValues = selId;
            fi.valid = (fi.fieldName == 'make' && (this.threadId == 0 || (this.threadId > 0 && val == '')) && fi.isMandatary == 1 ) ? false : true;
          }

          fi.disabled = (this.industryType.id == 3) ? disableFlag : false;

          if(chkFlag && disableFlag) {
            ptFieldIndex = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec].findIndex(option => option.fieldName === ptFieldName);
            this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, f, field, fieldName);
            let findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == fieldName);
            
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedValueIds = "";
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedValues = "";
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedVal = "";
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].valid = false;

            let apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].apiFieldKey;
            let formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].apiValueType;
            let item = (formatType == 1) ? "" : [];
            this.formFields[this.stepIndex][this.stepTxt][findex].formValue = item;
            this.formFields[this.stepIndex][this.stepTxt][findex].formValueIds = item;
            this.formFields[this.stepIndex][this.stepTxt][findex].formValueItems = item;
            this.formFields[this.stepIndex][this.stepTxt][findex].valid = false;
            this.threadForm.value[apiFieldKey] = item;
            
            modelFieldIndex = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec].findIndex(option => option.fieldName === modelFieldName);
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedValueIds = "";
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedValues = "";
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedVal = [];
            this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].valid = false;
            apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].apiFieldKey;
            formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].apiValueType;
            item = (formatType == 1) ? "" : [];

            mindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == modelFieldName);
            this.formFields[this.stepIndex][this.stepTxt][mindex].formValue = item;
            this.formFields[this.stepIndex][this.stepTxt][mindex].formValueIds = item;
            this.formFields[this.stepIndex][this.stepTxt][mindex].formValueItems = item;
            this.formFields[this.stepIndex][this.stepTxt][mindex].valid = false;
            this.threadForm.value[apiFieldKey] = item;

            if(ptFieldIndex >= 0) {
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].selectedValueIds = "";
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].selectedValues = "";
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].selectedVal = [];
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].valid = false;
              apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].apiFieldKey;
              formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][ptFieldIndex].apiValueType;
              item = (formatType == 1) ? "" : [];

              ptindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == ptFieldName);
              this.formFields[this.stepIndex][this.stepTxt][ptindex].formValue = item;
              this.formFields[this.stepIndex][this.stepTxt][ptindex].formValueIds = item;
              this.formFields[this.stepIndex][this.stepTxt][ptindex].formValueItems = item;
              this.formFields[this.stepIndex][this.stepTxt][ptindex].valid = false;
              this.threadForm.value[apiFieldKey] = item;
            }
            let fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
            fd.optFieldsFlag = false;
            fd.optDisableFlag = true;
            fd.toggleTxt = 'Show';
          } else {
            //console.log(action, ptFieldIndex
            if(action == 'onload' && this.threadId > 0 && fi.fieldName == 'SelectProductType') {
              let checkValId = Array.isArray(val) ? val[0].id : val;
              console.log(checkValId, fi.itemValues, !isNaN(checkValId))
              let ptIndex;
              if(!isNaN(checkValId)) {
                console.log(123, checkValId)
                ptIndex = fi.itemValues.findIndex(option => option.id == parseInt(checkValId));
              } else {
                console.log(656)
                ptIndex = fi.itemValues.findIndex(option => option.name == checkValId);
              }
              console.log(ptIndex, val, selId, fi)
              let id = fi.itemValues[ptIndex].id;
              let name = fi.itemValues[ptIndex].name;
              fi.selectedValueIds = id;
              fi.selectedValues = id;
              fi.selectedVal = name;
              fi.valid = true;
              console.log(fi)
            }
          }
          break;
        default:
          let commonApiValue = parseInt(fi.commonApiValue);
          if(commonApiValue > 0) {
            fi.itemValues = [];
            let apiRes = response['items'];
            for(let r in apiRes) {
              fi.itemValues.push({
                id: apiRes[r].id,
                name: apiRes[r].name
              });              
            }
          }
          break;
      }
    },
    error  => {
      console.log("Error", error);
    });
  }

  // Setup Vin Fields
  setupVinFields(chkField, extraField, chkFlag, callbackAction, itemVal, selVal = [], vaction = '') {
    let f,field,fieldIndex,fieldName,fieldSec,secIndex,stepIndex,stepTxt,fi,findex;
    f = (chkFlag) ? extraField.f : '';
    field = (chkFlag) ? extraField.field : '';
    fieldIndex = (chkFlag) ? extraField.fieldIndex : '';
    fieldName = (chkFlag) ? extraField.fieldName : '';
    fieldSec = (chkFlag) ? extraField.fieldSec : '';
    secIndex = (chkFlag) ? extraField.secIndex : '';
    stepIndex = (chkFlag) ? extraField.stepIndex : '';
    stepTxt = (chkFlag) ? extraField.stepTxt : '';
    let loadFlag = (callbackAction == 'loading' || callbackAction == 'unload') ? false : true;
    let chkFieldIndex = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec].findIndex(option => option.fieldName === chkField);
    fi = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkFieldIndex];
    console.log(chkField, chkFieldIndex, callbackAction, loadFlag, selVal)
    switch (callbackAction) {
      case 'loading':
        fi.loading = true;
        break;    
      case 'unload':
        fi.loading = false;
        break;
    }

    if(loadFlag) {
      let id, name, formVal;
      console.log(fi)
      if(fi == undefined || fi == undefined) {
        return;
      }
      let empty = ((fi != undefined && fi != undefined) && fi.formatType == 1) ? '' : [];
      let itemLen = itemVal.length;
      switch(callbackAction) {
        case 'init':
          fi = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkFieldIndex];
          fi.itemValues = itemVal;
          if(chkField != 'vinNo' && chkField != 'vinNoScanTool') {
            let chkVin = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec].findIndex(option => option.fieldName == 'vinNo');
            //console.log(chkVin, this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkVin].vinValid)
            if(chkVin >= 0) {
              if(this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkVin].vinValid) {
                fi.disabled = true;
              }
            }
          }
          
          if(this.industryType.id == 3 && this.domainId != 94) {
            fi.disabled = true;
          }
          fi.loading = false;
          console.log(fi, fi.fieldName, itemVal)
          if(fi.selection == 'multiple') {
            fi.selectedIds = fi.itemValues;
          }
          console.log(itemLen)
          if(itemLen > 0) {
            id = (fi.apiValueType == 1) ? fi.itemValues[0].id : [fi.itemValues[0].id];
            name = (fi.apiValueType == 1) ? fi.itemValues[0].name : [fi.itemValues[0].name];
            if(selVal.length > 0) {
              id = (fi.apiValueType == 1) ? selVal[0].id : [selVal[0].id];
              name = (fi.apiValueType == 1) ? selVal[0].name : [selVal[0].name];
            }
          } else {
            id = empty;
            name = empty;
          }
          if((chkField == 'vinNo' || chkField == 'vinNoScanTool') && !Array.isArray(selVal)) {
            id = selVal;
            name = selVal;
            fi.changeAction = 'change';
            fi.vinNo = selVal;
            fi.vinValid = true;
            fi.loading = true;
          }
          fi.selectedValueIds = (fi.apiValueType == 1) ? id : id;
          if(fi.fieldType == 'popup' && fi.selection == 'single') {
            fi.selectedValues = (fi.apiFieldType == 1) ? id : name;
            fi.selectedValues = id;
            //if(this.industryType.id == 3 && fieldName == 'model') {
              //fi.selectedValueIds = (fi.apiValueType == 1) ? name : name;
            //}
          } else {
            fi.selectedValues = (fi.fieldName == 'SelectProductType' && fi.selection == 'single' && this.industryType.id == 3) ? id.toString() : id;
          }
          
          fi.selectedVal = name;
          fi.valid = true;
          formVal = (fi.apiFieldType == 1) ? id : name;
          formVal = (fi.apiValueType == 1) ? formVal : formVal;
          findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == fi.fieldName);
          this.formFields[this.stepIndex][this.stepTxt][findex].formValue = formVal;
          this.formFields[this.stepIndex][this.stepTxt][findex].formValueIds = id;
          this.formFields[this.stepIndex][this.stepTxt][findex].formValueItems = name;
          this.formFields[this.stepIndex][this.stepTxt][findex].valid = true;
          let vinVal: any = selVal;
          this.formFields[this.stepIndex][this.stepTxt][findex].vinDetails = (!Array.isArray(vinVal) && vinVal.length  == 0) ? []: fi.vinDetails;
          if((chkField == 'vinNo' || chkField == 'vinNoScanTool') && !Array.isArray(selVal)) {
            this.formFields[this.stepIndex][this.stepTxt][findex].vinNo = selVal;
            let fieldData = fi;
            let action = 'trigger';
            let apiInfo = this.baseApiInfo();
            let windex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == 'workstreams');
            let wsVal = this.formFields[stepIndex][stepTxt][windex].formValue;
            apiInfo['workstreamList'] = JSON.stringify(wsVal);
            console.log(apiInfo)
            this.getVinData(fieldData, stepTxt, stepIndex, fieldSec, fieldIndex, field, chkField, secIndex, apiInfo, action, vaction)
          }
          fi.loading = false;      
          break;
        default:
          console.log(fi, itemVal, fi.apiValueType)
          fi.loading = false;
          fi.disabled = true;
          if(itemLen > 0) {
            id = (fi.apiValueType == 1) ? itemVal : itemVal > 0 ? [itemVal] : [];
            name = (fi.apiValueType == 1) ? itemVal : itemVal > 0 ? [itemVal] : [];
          }
          console.log(id, name, itemVal)
          id = (itemLen > 0) ? id : empty;
          name = (itemLen > 0) ? name : empty;
          fi.selectedValueIds = (fi.apiValueType == 1) ? id : id;
          fi.selectedValues = (fi.apiFieldType == 1) ? id : name;
          fi.selectedVal = (fi.apiFieldType == 1) ? id : name;
          if(fi.fieldType == 'popup' && fi.selection == 'single') {
            fi.selectedValues = id;
            let itemValues = [{
              id: id,
              name: name
            }];
            fi.itemValues = itemValues;
          }
          fi.valid = true;
          formVal = (fi.apiFieldType == 1) ? id : name;
          formVal = (fi.apiValueType == 1) ? formVal : formVal;
          
          findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == fi.fieldName);
          this.formFields[this.stepIndex][this.stepTxt][findex].formValue = formVal;
          this.formFields[this.stepIndex][this.stepTxt][findex].formValueIds = formVal;
          this.formFields[this.stepIndex][this.stepTxt][findex].formValueItems = formVal;
          this.formFields[this.stepIndex][this.stepTxt][findex].valid = true;
          break;  
      }
    }   
  }

  // Optional Field Toggle
  optFieldToggle(index, flag, disableFlag) {
    if(!disableFlag) {
      this.apiFormFields[this.stepIndex][this.stepTxt][index].optFieldsFlag = !flag;
      this.apiFormFields[this.stepIndex][this.stepTxt][index].toggleTxt = (!flag) ? 'Hide' : 'Show';
    }
  }

  // Back to Step1
  backStep1() {    
    let secElement = document.getElementById('step');
    secElement.scrollTop = this.scrollPos;
    this.headerPosBottom = false;
    this.headerPosTop = true;
    this.step1 = true;
    this.step2 = false;
    this.step1Action = true;
    this.step2Action = false;
    this.stepBack = true;
    this.step2Submitted = false;
    this.stepTxt = "step1";
    this.stepIndex = 0;    
    this.threadApiData['step'] = 1;
    this.threadApiData['uploadedItems'] = this.uploadedItems.items;
    this.threadApiData['attachments'] = this.uploadedItems.attachments;
    this.pageInfo.uploadedItems = this.uploadedItems.items;
    this.pageInfo.attachments = this.uploadedItems.attachments;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    this.pageInfo.stepBack = this.stepBack;
    console.log(this.apiFormFields, this.formFields)
    let formField = this.formFields[this.stepIndex][this.stepTxt];
    let vinFieldIndex = formField.findIndex(option => option.fieldName === 'vinNo');
    if(vinFieldIndex >= 0) {
      let sec = formField[vinFieldIndex].sec;
      let findex = formField[vinFieldIndex].findex;
      let apiField = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['name'][findex];
      apiField.vinNo = apiField.selectedVal;
    }
    let data = {
      action: 'back-submit',
      pageInfo: this.pageInfo,
      step1Submitted: this.step1Submitted,
      step2Submitted: this.step2Submitted,
      formGroup: this.threadForm      
    }
    this.commonApi.emitDynamicFieldData(data);
    setTimeout(() => {
      this.stepBack = false;
      this.pageInfo.stepBack = this.stepBack;
      data = {
        action: 'back-submit',
        pageInfo: this.pageInfo,
        step1Submitted: this.step1Submitted,
        step2Submitted: this.step2Submitted,
        formGroup: this.threadForm      
      }
      this.commonApi.emitDynamicFieldData(data);
    }, 100);
  }

  // Submit Action
  submitAction() {
    if(!this.submitDisableFlag && this.threadCatgVal == 0 && this.industryType.id == 2) {
      return false;
    } else {
      this.onSubmit();
    }
  }

  // Thread Onsubmit
  onSubmit() {
    this.requiredFlag = false;
    this.requiredFields = [];
    console.log(this.apiFormFields, this.formFields)
    this.step1Submitted = (this.step1Action && !this.step2Action) ? true : false;
    this.step2Submitted = (this.step1Action && this.step2Action) ? true : false;
    this.pageInfo.step1Submitted = this.step1Submitted;
    this.pageInfo.step2Submitted = this.step2Submitted;
    this.pageInfo.uploadedItems = this.uploadedItems;
    let submitFlag = true;
    let vinFlag = true;
    console.log(this.stepIndex, this.stepTxt)
    for(let f of this.formFields[this.stepIndex][this.stepTxt]) {
      let formVal = f.formValue;
      let selVal = f.selectedVal;
      if(formVal == 'undefined' || formVal == undefined) {
        formVal = (f.formatType == 1) ? '' : [];
        selVal = (f.formatType == 1) ? '' : [];
      }
      if((this.industryType.id == 2 || this.industryType.id == 3) && (f.fieldName == 'vinNo' || f.fieldName == 'vinNoScanTool')) {
        let sec = f.sec;
        let findex = f.findex;
        let vinField = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['name'][findex];
        let vinValid = vinField.vinValid;
        console.log(vinField)
        if(vinField.isMandatary == 0 && (!vinValid || formVal.length < 17)) {
          formVal = (vinField.vinNo.length == 17) ? formVal : '';
          selVal = formVal;
          vinField.seletedIds = formVal;
          vinField.selectedValueIds = formVal;
          vinField.selectedValues = formVal;
          vinField.selectedVal = formVal;
        }

        if(vinField.isMandatary == 0) {
          let vinDet = Array.isArray(vinField.vinDetails);
          let platformIdInfo = localStorage.getItem('platformId');
          let vinNum:any;
          if(platformIdInfo=='3') {
           vinNum = (!vinDet) ? parseInt(vinField.roDetails.vin) : 0
          } else {
            vinNum = (vinField.vinNo.length == 17) ? formVal : '';
          }
          vinNum = (formVal.length == 0) ? '' : vinNum;
          console.log(vinDet)
          if(((f.isMandatary == 0 && vinNum > 0 && vinNum < 17)) && (vinDet || vinNum == 0 || parseInt(formVal) != vinNum)) {
            vinField.valid = false;
            vinField.invalidFlag = true;
            f.valid = false;          
          }
        }

        if((vinField.isMandatary == 1 && (!vinValid || formVal.length < 17))) {
          vinFlag = false;
          vinField.valid = true;
          vinField.invalidFlag = true;
          f.valid = false;
        }
        console.log(formVal)
      }
      
      if(f.fieldName == 'errorCode') {
        let dtcApiField = this.apiFormFields[this.stepIndex][this.stepTxt][f.sec]['cells']['name'][f.findex];
        f.valid = dtcApiField.valid;  
        /** new */      
        let sval=[];
        for(let er of formVal) {    
          let val:any;      
          val = er;
          val = val.toString().split("##");
          let val1 = val[0].toString().toUpperCase();
          let val2 = val[1].toString();
          val2 = val2.charAt(0).toUpperCase() + val2.slice(1);
          val = val1+"##"+val2;
          sval.push(val);
          console.log(sval);
        }
        formVal = sval;
        f.formValue = formVal;
        console.log(f.formValue); 
        /** new */   
      }

      if(this.CBADomain) {
        switch(f.fieldName) {
          case 'repairOrder':
            let roApiField = this.apiFormFields[this.stepIndex][this.stepTxt][f.sec]['cells']['name'][f.findex];
            let roDet = Array.isArray(roApiField.roDetails);
            let roNum:any = (!roDet) ? parseInt(roApiField.roDetails.repair_order_number) : 0;
            roNum = (formVal.length == 0) ? '' : roNum;
            vinFlag = (formVal.length > 0 && parseInt(formVal) != roNum) ? false : true;
            console.log(formVal, roNum, vinFlag, roDet)
            if((!vinFlag || (f.isMandatary == 0 && roNum > 0 && roNum < 3)) && (((f.isMandatary == 0 && f.isMandatary == 0 && roNum > 0 && roNum >= 3 && !roDet) || roDet) || roNum == 0 || parseInt(formVal) != roNum)) {
              roApiField.invalidFlag = true;
              f.valid = false;          
            }
            break;
        }     
      }
      
      f.formValue = formVal;
      f.selectedVal = selVal;
      let aupItems = Object.keys(this.audioUploadedItems);
      if(f.fieldName == 'content' && aupItems.length > 0 && this.audioUploadedItems.items.length > 0) {
        console.log(f)
        let descVal = `<p>${Constant.audioDescText}</p>`;
        f.formValue = descVal;
        f.selectedVal = descVal;
      }
      if(f.displayFlag && !f.valid) {
        console.log(f)
        let requiredField = (this.CBADomain) ? f.mandatoryText : f.fieldName;
        this.requiredFields.push(requiredField);
        submitFlag = f.valid;
      }         
    }

    if(!submitFlag) {
      setTimeout(() => {
        this.requiredFlag = true;  
      }, 500);      
      let data = {
        action: 'submit',
        pageInfo: this.pageInfo,
        step1Submitted: this.step1Submitted,
        step2Submitted: this.step2Submitted,
        formGroup: this.threadForm
      }
      this.commonApi.emitDynamicFieldData(data);
      this.errorSecTop();
      return;
    }
    
    if(this.step1Submitted && !this.step2Submitted) {
      this.step2Loading = true;
      this.stepBack = false;
      this.step2 = true;
      this.step2Action = true;
      this.stepBack = false;
      this.step1Submitted = false;
      this.pageInfo.stepBack = this.stepBack;
      this.pageInfo.step1Submitted = this.step1Submitted;
      this.pageInfo.step2Submitted = this.step2Submitted;
      let getFieldsFlag = false;
      let formFieldLen = this.apiFormFields[1]['step2'].length;
      if(formFieldLen > 0) {
        console.log(this.threadType, formFieldLen)
        if(this.threadType == 'thread' || (this.threadType == 'share' && formFieldLen > 1)) {
          this.stepIndex = 1;
          this.stepTxt = "step2";
          
          if(formFieldLen > 1) {
            let displayFlag = (this.threadType == 'thread') ? false : true;
            for(let ff of this.formFields[this.stepIndex][this.stepTxt]) {
              console.log(ff)
              if(ff.threadType == 'share') {
                ff.displayFlag = displayFlag;
                let apiField = this.apiFormFields[this.stepIndex][this.stepTxt][ff.sec];
                console.log(apiField)
                if(ff.fieldName != 'fixcontent') {
                  apiField.displayFlag = displayFlag;
                }                
                apiField['cells']['name'][ff.findex].displayFlag = displayFlag;
                console.log(this.apiFormFields[this.stepIndex][this.stepTxt][ff.sec])
              }              
            }
          }
          
          this.pageInfo.stepIndex = this.stepIndex;
          this.pageInfo.step = this.stepTxt;
          this.pageInfo.stepBack = this.stepBack;
          this.pageInfo.threadUpload = true;
          //this.pageInfo.manageAction = '';
          this.pageInfo.uploadedItems = this.uploadedItems.items;
          this.pageInfo.attachments = this.uploadedItems.attachments;
          let data = {
            action: 'submit',
            pageInfo: this.pageInfo,
            step1Submitted: this.step1Submitted,
            step2Submitted: this.step2Submitted,
            formGroup: this.threadForm
          }
          setTimeout(() => {
            this.step2Loading = false;
            //this.scrollToElem();
            this.commonApi.emitDynamicFieldData(data);
          }, 500);
        } else {
          getFieldsFlag = true;  
        }
      } else {
        getFieldsFlag = true;
      }

      let formField = this.formFields[0]['step1'];
      let makeIndex = formField.findIndex(option => option.fieldName == 'make');
      let modelIndex = formField.findIndex(option => option.fieldName == 'model');
      let yearIndex = formField.findIndex(option => option.fieldName == 'year');
      let ptIndex = formField.findIndex(option => option.fieldName == 'SelectProductType');
      this.bannerImage = '';
      setTimeout(() =>{
        let makeName = (makeIndex < 0 || formField[makeIndex]['selectedVal'] == 'undefined' || formField[makeIndex]['selectedVal'] == undefined) ? '' : formField[makeIndex]['selectedVal'];
        let modelName = (modelIndex < 0 || formField[modelIndex]['selectedVal'] == 'undefined' || formField[modelIndex]['selectedVal'] == undefined) ? '' : formField[modelIndex]['selectedVal'];
        let year = (yearIndex < 0 || formField[yearIndex]['selectedVal'] == 'undefined' || formField[yearIndex]['selectedVal'] == undefined) ? '' : formField[yearIndex]['selectedVal'];
        let prodType = (ptIndex >= 0) ? (formField[ptIndex]['selectedVal'] == 'undefined' || formField[ptIndex]['selectedVal'] == undefined) ? '' : formField[ptIndex]['selectedVal'] : '';
        console.log(makeName)
        if(getFieldsFlag) {
          this.step2Loading = true;
          this.threadApiData['step'] = 2;
          this.threadApiData['makeName'] = makeName;
          this.threadApiData['modelName'] = modelName;
          this.threadApiData['yearValue'] = year;
          this.threadApiData['productType'] = prodType;
          this.getThreadFields();
        } else {
          let bannerFormData = new FormData(); 
          bannerFormData.append('apiKey', this.apiKey);
          bannerFormData.append('domainId', this.domainId);
          bannerFormData.append('countryId', this.countryId);
          bannerFormData.append('userId', this.userId);
          bannerFormData.append('make', makeName);
          bannerFormData.append('model', modelName);
          bannerFormData.append('yearValue', year);
          bannerFormData.append('productType', prodType);
          bannerFormData.append('threadCategoryValue', this.threadCatgVal);
          this.commonApi.getBannerImage(bannerFormData).subscribe((response) => {
            console.log(response)
            this.bannerImage = response.bannerImage;
            this.defaultBanner = response.isDefaultBanner;
          });  
        }
      }, 100);
    } else {
      console.log(this.uploadedItems);
      let upItems = Object.keys(this.uploadedItems);
      console.log(upItems.length)
      let uploadCount = 0;
      if(upItems.length > 0 && this.uploadedItems.attachments.length > 0) {
        this.uploadedItems.attachments.forEach(item => {
          if(item.accessType != 'media') {
            uploadCount++;
          }       
        });
      }
      if(upItems.length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
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
          this.errorSecTop(eid);
          return false;
        }
      }

      this.threadSubmit();
    }
  }
  
  // Error Section Scroll
  errorSecTop(action = '') {
    let id, addPos;
    if(action != '') {
      id = action;
      addPos = 0;
    } else {
      id = 'valid-error';
      addPos = 80;
    }
    let secElement = document.getElementById('step');
    let errElement = document.getElementById(id);
    let scrollTop = errElement.offsetTop;
    this.headerPosBottom = false;
    this.headerPosTop = true;
    setTimeout(() => {
      if(action == '') {
        this.scrollPos = scrollTop+addPos;
        secElement.scrollTop = this.scrollPos;        
      } else {
        errElement.scrollIntoView();
      }
    }, 200);
  }

  // Scroll to element
  scrollToElem() {
    let element = 'step';
    const itemToScrollTo = document.getElementById(element);
    if (itemToScrollTo) {
      itemToScrollTo.scrollIntoView(true);
    }
  }

  // Thread Submit
  threadSubmit() {
    console.log(this.formFields, this.pageInfo, this.industryType);
    console.log(this.audioUploadedItems)
    this.bodyElem.classList.add(this.bodyClass);
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
    
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let threadFormData = new FormData(); 
    threadFormData.append('apiKey', this.apiKey);
    threadFormData.append('domainId', this.domainId);
    threadFormData.append('countryId', this.countryId);
    threadFormData.append('userId', this.userId);
    threadFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    let pushFlag = true;
    let approvePushFlag = false;
    let adminApproveFlag = false;
    let approveStatusData = new FormData();
    if(this.threadType == 'share' && this.approvalEnableDomainFlag) {
      adminApproveFlag = ((this.roleId == 3 || this.roleId == 2) &&  this.threadId > 0) ? true : false;
      if(this.approveProcessFlag) {
        pushFlag = false;
        approvePushFlag = (this.roleId == 3 || this.roleId == 2) ? approvePushFlag : true; 
        threadFormData.append('approvalProcess', '2');
        localStorage.setItem("threadApprovalPage","1");
      } else {
        threadFormData.append('approvalProcess', '1');
        localStorage.removeItem("threadApprovalPage"); 
      }
      if(approvePushFlag) {
        approveStatusData.append('apiKey', this.apiKey);
        approveStatusData.append('domainId', this.domainId);
        approveStatusData.append('countryId', this.countryId);
        approveStatusData.append('userId', this.userId);
        approveStatusData.append("statusId", "2");  
        approveStatusData.append("ownerId", this.userId);
        approveStatusData.append("currentStatusName", "submit");    
        approveStatusData.append("oldStatusName", "");    
        approveStatusData.append("oldStatusId", ""); 
        approveStatusData.append('contentTypeId', this.contentType);
      }
    }
    
    console.log(this.formFields)
    let groups = [], make = "";
    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
      console.log(step)
      for(let s of this.formFields[i][step]) {
        console.log(s.apiFieldKey, s.formValue, Array.isArray(s.formValue))
        if(s.apiFieldKey != 'dtcToggle') {
          let formVal = s.formValue;
          if(formVal == 'undefined' || formVal == undefined) {
            formVal = (s.formatType == 1) ? '' : [];
          }          
          formVal = (Array.isArray(s.formValue) && s.apiFieldKey != 'odometer') ? JSON.stringify(formVal) : formVal;
          if(this.industryType.id > 1 && s.apiFieldKey == 'odometer' && formVal != '') {
            console.log(formVal)
            formVal = this.commonApi.removeCommaNum(formVal);
          }
          if(s.fieldType == 'ro-input' && (s.roDetails != '' && s.roDetails != undefined)) {
            let roUrl = s.roDetails.ro_url;
            let dviPdfUrl = s.roDetails.dviPdfUrl;
            threadFormData.append('roUrl', roUrl);
            threadFormData.append('dviPdfUrl', dviPdfUrl);
          }
          switch(s.apiFieldKey) {
            case 'groups':
              groups = formVal;
              break;
            case 'make':
              if(this.industryType.id != 3 && this.industryType.id != 4) {
                make = formVal;
              }              
              break;
            case 'ProdtypeId':
              if(this.industryType.id >= 3) {
                make = s.selectedVal.toString();
              }              
              break;
            case 'trouble_code':
              if(this.CBADomain && this.wsVal == 3) {
                s.displayFlag = true;   
              }              
              break;
            case 'vin':
              if(s.fieldName == 'vinNoScanTool') {
                let vinInfo = s.vinDetails;
                let scanVinInfo:any = [];
                if(vinInfo.length > 0) {
                  vinInfo = vinInfo[0];
                  scanVinInfo = {
                    make: vinInfo.make,
                    model: vinInfo.model,
                    year: vinInfo.year
                  };
                  threadFormData.append('scanVinInfo', JSON.stringify(scanVinInfo));
                }
              }
              break;  
          }
          if(s.displayFlag && s.apiFieldKey!='') {
            threadFormData.append(s.apiFieldKey, formVal);    
          }
        }        
      }
    }
    threadFormData.forEach((value,key) => {
      console.log(key+" "+value)
      return false
    }); 
    if(Object.keys(this.audioUploadedItems).length > 0 && this.audioUploadedItems.items.length > 0) {
      console.log(this.uploadedItems)
      if(Object.keys(this.uploadedItems).length > 0) {
        this.uploadedItems.items.push(this.audioUploadedItems.items[0]);
        this.uploadedItems.attachments.push(this.audioUploadedItems.audioAttachmentItems[0]);
        this.pageInfo.attachmentItems = this.uploadedItems.attachments;
      } else {
        let uploadedItems:any = {
          items: [],
          attachments: []
        }
        uploadedItems.items.push(this.audioUploadedItems.items[0]);
        uploadedItems.attachments.push(this.audioUploadedItems.audioAttachmentItems[0]);
        this.uploadedItems = uploadedItems;
        this.pageInfo.attachmentItems = this.audioUploadedItems.audioAttachmentItems[0];
      }
      uploadCount++;
    }
    console.log(this.uploadedItems);
    let pushFormData = new FormData();
    pushFormData.append('apiKey', this.apiKey);
    pushFormData.append('domainId', this.domainId);
    pushFormData.append('countryId', this.countryId);
    pushFormData.append('userId', this.userId);
    pushFormData.append('contentTypeId', this.contentType);
    pushFormData.append('groups', JSON.stringify(groups));
    pushFormData.append('makeName', make);
    if(this.threadId > 0) {
      let threadId:any = this.threadId;
      threadFormData.append('threadId', threadId);
      threadFormData.append('updatedAttachments', JSON.stringify(this.pageInfo.updatedAttachments));
      threadFormData.append('deletedFileIds', JSON.stringify(this.pageInfo.deletedFileIds));
      threadFormData.append('removeFileIds', JSON.stringify(this.pageInfo.removeFileIds));
      pushFormData.append('threadId', threadId);
      pushFormData.append('postId', this.threadInfo['postId']);
      console.log(adminApproveFlag)
      if(adminApproveFlag) {
        pushFlag = true;
        pushFormData.append('approveUser', this.userId);
        pushFormData.append('approvalProcess', '1');
      }
      if(approvePushFlag){
        approveStatusData.append("dataId", threadId);
      }
      localStorage.removeItem('threadAttachments');
      setTimeout(() => {
        this.threadApi.updateThread(threadFormData).subscribe((response) => {
          console.log(response);
          modalRef.dismiss('Cross click');
          if(this.newThreadView){
            localStorage.setItem("newUpdateOnEditThreadId",threadId);
          }
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          let msgFlag = true;
          let url = RedirectionPage.Threads;
          let dataInfo: any = '';
          if(response.status == "Success") {
            let res = response.data;
            let threadInfo = response.dataInfo[0];
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            localStorage.setItem(pageTitle[pageDataIndex].navEdit, 'true');
            let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
            localStorage.setItem(pageDataInfo, JSON.stringify(threadInfo));
            let threadId = res.threadId;
            let postId = res.postId;
            if(this.navUrl == url) {
              dataInfo = {
                action: 'silentUpdate',
                access: url,
                pushAction: 'load',
                pageInfo: pageInfo.threadsPage,
                silentLoadCount: 0,
                dataId: this.threadId,
                dataInfo: threadInfo
              }
            }
            if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
              msgFlag = false;
              this.pageInfo.pushFlag = pushFlag;
              this.pageInfo.approvePushFlag = approvePushFlag;
              this.pageInfo.threadUpload = false;
              this.pageInfo.contentType = this.contentType;
              this.pageInfo.dataId = postId;
              this.pageInfo.threadId = this.threadId;
              this.pageInfo.dataInfo = dataInfo;
              this.pageInfo.navUrl = this.navUrl;
              this.pageInfo.threadAction = 'edit';
              this.pageInfo.manageAction = 'uploading';
              this.pageInfo.uploadedItems = this.uploadedItems.items;
              this.pageInfo.attachments = this.uploadedItems.attachments;
              this.pageInfo.pushFormData = pushFormData;
              this.pageInfo.message = this.successMsg;
              if(approvePushFlag) {
                this.pageInfo.approveStatusData = approveStatusData;
              }
              let data = {
                action: 'thread-submit',
                pageInfo: this.pageInfo,
                step1Submitted: this.step1Submitted,
                step2Submitted: this.step2Submitted,
                formGroup: this.threadForm      
              }
              this.commonApi.emitDynamicFieldData(data);
            }
            else
            {
              let apiDatasocial = new FormData();    
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', threadId);
              apiDatasocial.append('postId', postId);
              apiDatasocial.append('userId', this.userId); 
              apiDatasocial.append('action', 'updateThread');
              apiDatasocial.append('actionType', '1'); 
              let platformIdInfo = localStorage.getItem('platformId');
              if(platformIdInfo == '1' || platformIdInfo == '3' || (platformIdInfo == '2' && (this.domainId==52 || this.domainId==82))) {
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })          
              }
              if(platformIdInfo == '3') {
                this.baseSerivce.postFormData("forum", "SendtoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
              }
              if(approvePushFlag) {
                this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});
              }
              setTimeout(() => {
                if(adminApproveFlag && pushFlag) {
                  this.threadApi.threadPush(pushFormData).subscribe((response) => {});
                }  
              }, 500);              
            }            
          }
          if(msgFlag) {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            
            let apiData = new FormData();    
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('threadId', threadId);
            apiData.append('silentPush', '1'); 
            apiData.append('action', 'thread-edit'); 
            apiData.append('userId', this.userId);              
            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
            
            let apiDatasocial = new FormData();    
            apiDatasocial.append('apiKey', Constant.ApiKey);
            apiDatasocial.append('domainId', this.domainId);
            apiDatasocial.append('threadId', threadId);
            apiDatasocial.append('userId', this.userId); 
            apiDatasocial.append('action', 'view'); 
            apiDatasocial.append('actionType', '1');
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo=='1' || platformIdInfo=='3' || (platformIdInfo == '2' && (this.domainId==52 || this.domainId==82)))
            {
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            }
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              localStorage.removeItem('threadNav');
              let timeout = 0;
              if(this.navUrl == url) {
                timeout = 50;
                this.commonApi.emitMessageReceived(dataInfo);
              }
              setTimeout(() => {
                this.router.navigate([this.navUrl]);
              }, timeout);
              /* if(this.teamSystem) {
                this.loading = true;
                window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
              } else {
                this.router.navigate([this.navUrl]);
              } */
            }, 2000);
          }
        });
      }, 500);
    } else {
      setTimeout(() => {
        this.threadApi.createThread(threadFormData).subscribe((response) => {

          localStorage.setItem('mynewthread','1');
          console.log(response);
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          let msgFlag = true;
          if(response.status == "Success") {
            let res = response.data;
            let threadId = res.threadId;
            let postId = res.postId;
            pushFormData.append('threadId', threadId);
            pushFormData.append('postId', postId);
            if(approvePushFlag){
              approveStatusData.set('dataId', threadId);  
              }
            if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
              msgFlag = false;
              this.pageInfo.pushFlag = pushFlag;
              this.pageInfo.approvePushFlag = approvePushFlag;
              this.pageInfo.threadUpload = false;
              this.pageInfo.contentType = this.contentType;
              this.pageInfo.dataId = postId;
              this.pageInfo.threadId = threadId;
              this.pageInfo.navUrl = this.navUrl;
              this.pageInfo.threadAction = (this.threadId > 0) ? 'edit' : 'new';
              this.pageInfo.manageAction = 'uploading';
              this.pageInfo.uploadedItems = this.uploadedItems.items;
              this.pageInfo.attachments = this.uploadedItems.attachments;
              this.pageInfo.pushFormData = pushFormData;
              this.pageInfo.message = this.successMsg;
              if(approvePushFlag) {
                this.pageInfo.approveStatusData = approveStatusData;
              }
              let data = {
                action: 'thread-submit',
                pageInfo: this.pageInfo,
                step1Submitted: this.step1Submitted,
                step2Submitted: this.step2Submitted,
                formGroup: this.threadForm      
              }
              this.commonApi.emitDynamicFieldData(data);
            } else {
              let apiDatasocial = new FormData();    
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', threadId);
              apiDatasocial.append('postId', postId);
              apiDatasocial.append('userId', this.userId); 
              apiDatasocial.append('action', 'create'); 
              apiDatasocial.append('actionType', '1');
              let platformIdInfo = localStorage.getItem('platformId');
              if(platformIdInfo == '1' || platformIdInfo == '3' || (platformIdInfo == '2' && (this.domainId==52 || this.domainId==82))) {
                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
              }

              if(platformIdInfo == '3') {
                this.baseSerivce.postFormData("forum", "SendtoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
              }
              if(pushFlag) {
                this.threadApi.threadPush(pushFormData).subscribe((response) => {});
              }
              if(approvePushFlag) {
                this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});
              }
            }          
          }
          if(msgFlag) {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              localStorage.removeItem('threadNav');
              window.close();
            }, 2000);
          }
        });
      }, 500);
    }
  }

  // Close Current Window
  closeWindow() {
    let popupFlag = (this.threadId == 0 && this.stepTxt == 'step1') ? false : true;
    if(!popupFlag) {
      for(let f of this.formFields[this.stepIndex][this.stepTxt]) {
        if(f.isMandatary && f.valid) {
          popupFlag = f.valid;
        }
      }
      
      if(!popupFlag) {
        if(this.teamSystem) {
          window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
        } else {
          window.close();
        }
      }

      /*if(this.threadId == 0 && this.stepTxt == 'step1') {
        for(let f of this.formFields[this.stepIndex][this.stepTxt]) {
          let formVal = f.formValue;
          if(formVal == undefined || formVal == 'undefined') {
            formVal = (f.formatType == 1) ? '' : [];
          }
          if((f.formatType == 2 && formVal.length > 0) || (f.formatType == 1 && formVal != '')) {
            popupFlag = true;
          }
        }
        if(!popupFlag) {
          if(this.teamSystem) {
            window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
          } else {
            window.close();
          }
        }
      }*/
    }
    
    if(popupFlag) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
        modalRef.dismiss('Cross click'); 
        if(!receivedService) {
          return;
        } else {
          if(this.teamSystem) {
            window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
          } else {
            if(this.threadId == 0) {
              window.close();
            } else {
              let url = RedirectionPage.Threads;
              let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
              localStorage.setItem(pageTitle[pageDataIndex].navCancel, 'true');
              this.router.navigate([this.navUrl]);
            }
          }        
        }
      });
    }
  }

  // Set Screen Height
  setScreenHeight() {
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
      if(this.teamSystem){
        if (window.screen.width < 800) {
          this.innerHeight = this.innerHeight - 25;
          this.msTeamAccessMobile = true;
        }  
        else{
          this.msTeamAccessMobile = false;
        }  
      }
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
      this.innerHeight = (this.bodyHeight-(headerHeight+108));
    }
    
    if(!this.loading) {
      setTimeout(() => {
        let panelWidth = document.getElementById('form-cont').offsetWidth;
        this.pageInfo.panelWidth = panelWidth;
        this.pageInfo.panelHeight = this.innerHeight;
        let data = {
          action: 'panel-width',
          pageInfo: this.pageInfo,
          step1Submitted: this.step1Submitted,
          step2Submitted: this.step2Submitted,
          formGroup: this.threadForm      
        }
        this.commonApi.emitDynamicFieldData(data);
      }, 100);
    }
    setTimeout(() => {
      this.bottomHeader = true;
    }, 500);
  }

  // Get Product Types
  getProductTypes(action, stepIndex, stepTxt, secIndex, fieldSec, field, apiInfo, queryInfo) {
    console.log(field)
    let fieldName = 'SelectProductType';
    let ptIndex = field.findIndex(option => option.fieldName == fieldName);
    let pt = field[ptIndex];
    pt.disabled = true;
    pt.loading = pt.disabled;
    let apiData = apiInfo;
    let apiName = pt.apiName;
    let query = JSON.parse(pt.queryValues);
    for(let q of query) {
      switch(q) {
        case 'workstreamsList':
          apiData[q] = JSON.stringify(queryInfo['wsInfo']);
          break;
        case 'makeName':
          apiData[q] = queryInfo['makeInfo'];
          break;
        case 'modelName':
          apiData[q] = queryInfo['modelInfo'];
          break;
      }
    }
    
    let extraField = {
      stepTxt: stepTxt,
      stepIndex: stepIndex,
      secIndex: secIndex,
      fieldSec: fieldSec,
      fieldIndex: ptIndex,
      f: pt,
      field: field,
      fieldName: fieldName
    };
    this.getData(action, secIndex, pt, apiName, apiData, extraField);   
  }

  // Setup Vin Details
  setupVinDetails(vinRes, callbackItems, extraField, chkFlag, sec, action = 'auto') {
    let apiFields = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['name'];
    let itemValues = [];
    let callbackAction = 'init';
    console.log(vinRes, callbackItems)
    let selVal = [];
          
    for(let i of callbackItems) {
      switch(i) {
        case 'vinNo':
        case 'vinNoScanTool':  
          selVal = vinRes.vin;
          break;
        case 'make':
          selVal = [];
          vinRes.makeItems.forEach(item => {
            itemValues = [{
              id: item.id,
              name: item.name
            }];
          });
          break;        
        case 'SelectProductType':
          let prodIndex = apiFields.findIndex(option => option.fieldName == i);
          itemValues = apiFields[prodIndex].itemValues;
          console.log(apiFields, i, prodIndex, itemValues, this.industryType.id)
          if(this.industryType.id == 3) {
            selVal = itemValues.filter(option => option.name == vinRes.makeName);
          }
          break;
        case 'model':
          selVal = [];
          let modelItems = [];
          console.log(vinRes)
          modelItems.push({id: vinRes.uId, name: vinRes.modelName});
          itemValues = modelItems;
          break;
        case 'AdditionalModelInfo':
          selVal = [];
          let addInfo = (action == 'auto') ? vinRes.additionalInfo : vinRes.additionalInfo1;
          itemValues = addInfo;
          break;
        case 'AdditionalModelInfo2':
          selVal = [];
          let addInfo2 = (action == 'auto') ? vinRes.additionalInfo1 : vinRes.additionalInfo2;
          itemValues = addInfo2;
          break;
        case 'AdditionalModelInfo3':
          selVal = [];
          let addInfo3 = (action == 'auto') ? vinRes.additionalInfo2 : vinRes.additionalInfo3;
          itemValues = addInfo3;
          break;
        case 'AdditionalModelInfo4':
          selVal = [];
          let addInfo4 = (action == 'auto') ? vinRes.additionalInfo3 : vinRes.additionalInfo4;
          itemValues = addInfo4;
          break;
        case 'AdditionalModelInfo5':
          selVal = [];
          let addInfo5 = (action == 'auto') ? vinRes.additionalInfo4 : vinRes.additionalInfo5;
          itemValues = addInfo5;
          break;
        case 'year':
          selVal = [];
          callbackAction = 'setup';
          itemValues = vinRes.year;
          break;  
      }
      this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues, selVal, action);
    }
    //if(this.industryType.id != 3) {
      console.log(sec)
      let optField = this.apiFormFields[this.stepIndex][this.stepTxt][sec];
      let optFilter = optField['cells']['optionFilter'];
      for(let opt of optFilter) {
        let optField = opt.fieldName;
        let findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName === optField);
        let optValItems = this.formFields[this.stepIndex][this.stepTxt][findex];
        switch(optField) {
          case 'SelectCategory':
            opt.itemValues = vinRes.CategoryId;
            break;
          case 'SelectSubCategory':
            opt.itemValues = vinRes.SubcategoryId;
            break;
          case 'SelectProductType':
            opt.itemValues = (this.industryType.id == 3) ? vinRes.productName : vinRes.productType;
            if(this.industryType.id == 3) {
              let itemIndex = itemValues.findIndex(option => option.name == opt.itemValues);
              let itemVal = [{id: itemValues[itemIndex].id, name: opt.itemValues}];
              opt.itemValues = itemVal;
            }
            break;
          case 'SelectRegion':
            opt.itemValues = vinRes.regions;
            break;
          case 'make':
            opt.itemValues = (this.industryType.id == 3) ? vinRes.makeItems : vinRes.make;
            break;
        }
        // Setup Selected Values
        this.setupValues(opt, optValItems, opt.itemValues);
      }
      setTimeout(() => {
        optField.optDisableFlag = false;
        optField.optFieldsFlag = false;
        optField.toggleTxt = 'Show';
      }, 500);
    //}
  }

  // Disable Field
  disableField(fieldName, flag) {
    let formField = this.formFields[this.stepIndex][this.stepTxt];
    let findex = formField.findIndex(option => option.fieldName == fieldName);
    let secIndex = formField[findex].sec;
    let field = this.apiFormFields[this.stepIndex][this.stepTxt][secIndex];
    let fieldSec = 'name';
    let fieldIndex = field['cells'][fieldSec].findIndex(option => option.fieldName === fieldName);
    let currField = field['cells'][fieldSec][fieldIndex];
    currField.disabled = flag;
  }

  // Base Api Info
  baseApiInfo() {
    let apiInfo = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId
    };
    return apiInfo;
  }

  // Find scroll move position
  scrolled(event: any): void { 
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    let topHeight = 110 * 2.5;
    let checkHt = height - topHeight
    if(position >= checkHt){
      this.headerPosBottom = true;
      this.headerPosTop = false;
    }
    else{
      this.headerPosTop = true;
      this.headerPosBottom = false;
    }
    //console.log(position);
    //console.log(checkHt);
  }

  emptyThreadCatgFields(fieldName, tcf, stepIndex, stepTxt, fieldSec, emptyFlag, catgId = -1, prevRel = []) {
    console.log(catgId, tcf)
    let threadCatgName = 'Thread Category';
    let chkItem = (catgId < 0) ? tcf.selectedValueIds[0] : catgId;
    console.log(chkItem, prevRel)
    let tcItemIndex = tcf.itemValues.findIndex(option => option.id == chkItem);
    let relField = (prevRel.length == 0) ? tcf.itemValues[tcItemIndex] ? tcf.itemValues[tcItemIndex].relationFields : [] : prevRel;
    console.log(relField, this.apiFormFields, this.formFields)
    let formFields = this.formFields[stepIndex][stepTxt];
    relField.forEach(item => {
      let formIndex = formFields.findIndex(option => option.fieldName == item.fieldName);
      console.log(formIndex)
      if(formIndex >= 0) {
        let removeSec = formFields[formIndex].sec;
        console.log(stepIndex, stepTxt, removeSec);
        this.apiFormFields[stepIndex][stepTxt].splice(removeSec, 1);
      }        
    });    
    
    if(emptyFlag) {
      this.threadCatgVal = 0;
      this.setupFieldData(fieldName, stepIndex, stepTxt, fieldSec);
    }
    let cformIndex = formFields.findIndex(option => option.fieldName == 'odometer');
    if(cformIndex >= 0) {
      formFields.splice(cformIndex, 1);
    }

    let chformIndex = formFields.findIndex(option => option.fieldName == 'miles');
    if(chformIndex >= 0) {
      formFields.splice(chformIndex, 1);
    }
    relField.forEach(item => {
      let rformIndex = formFields.findIndex(option => option.fieldName == item.fieldName);
      if(rformIndex >= 0) {
        formFields.splice(rformIndex, 1);
      }
      /* if(item.cellArray != '') {
        let cellArray = JSON.parse(item.cellArray);
        cellArray.forEach(citem => {
          formIndex = formFields.findIndex(option => option.fieldName == citem.apiName);
          if(formIndex >= 0)
            formFields.splice(formIndex, 1);
        });
      } */
    });
  }

  emptyWorsktreamFields(relField, wf, stepIndex, stepTxt, fieldSec, emptyFlag) {
    this.mainSection = 1;
    let formFields = this.formFields[stepIndex][stepTxt];
    console.log(relField, formFields)
    relField.forEach(item => {
      console.log(item)
      let formIndex = formFields.findIndex(option => option.fieldName == item);
      console.log(formIndex)
      if(formIndex >= 0) {
        let removeSec = formFields[formIndex].sec;
        console.log(stepIndex, stepTxt, removeSec);
        this.apiFormFields[stepIndex][stepTxt].splice(removeSec, 1);
        formFields.splice(formIndex, 1);        
      }
    });   
  }

  clearStep2() {
    let cstepIndex = this.stepIndex+1;
    let cstepTxt = `step${cstepIndex+1}`;
    console.log(cstepIndex, cstepTxt)
    this.apiFormFields[cstepIndex][cstepTxt] = [];
    this.formFields[cstepIndex][cstepTxt] = [];
  }

  getThreadCatg(threadCatgName, action, f, fieldData, tcIndex, stepIndex, stepTxt, apiInfo, wsInfo, access) {
    let tcsecIndex = this.formFields[stepIndex][stepTxt][tcIndex].sec;
    let tcfield = this.apiFormFields[stepIndex][stepTxt][tcsecIndex];
    let threadCatgFieldIndex = tcfield['cells']['name'].findIndex(option => option.fieldName == threadCatgName);
    this.apiFormFields[stepIndex][stepTxt][tcsecIndex]['cells']['name'][threadCatgFieldIndex].disabled = false;
    let tcf = tcfield['cells']['name'][threadCatgFieldIndex];
    console.log(tcf, f)
    let tcapiData = apiInfo;
    let tcapiName = f.apiName;
    let tcextraField = [];
    switch (access) {
      case 'make':
        let query = JSON.parse(f.queryValues);
        tcapiData[query[0]] = JSON.stringify(wsInfo);    
        break;
    
      default:
        tcapiData['workstreamsList'] = JSON.stringify(wsInfo);
        break;
    }
    
    if(fieldData.selectedValueIds.length > 0) {
      tcf.disabled = true;
      tcf.loading = f.disabled;  
      this.getData(action, tcsecIndex, tcf, tcapiName, tcapiData, tcextraField);
    }
  }

  manageDTC(flag) {
    let chkStepIndex = 1;
    let chkStepTxt = 'step2';
    let chkStep2Len = this.apiFormFields[chkStepIndex][chkStepTxt].length;
    if(chkStep2Len > 0) {
      let dtcToggleIndex, errCodeIndex, dtcFieldIndex, errCodeFieldIndex;
      let dtcToggleField = 'dtcToggle';
      let errCodeField = 'errorCode';
      
      dtcToggleIndex = this.formFields[chkStepIndex][chkStepTxt].findIndex(option => option.fieldName == dtcToggleField);
      let dtcToggleData = this.formFields[chkStepIndex][chkStepTxt][dtcToggleIndex];
      let dtcsecIndex = dtcToggleData.sec;
      let dtcfield = this.apiFormFields[chkStepIndex][chkStepTxt][dtcsecIndex];
      dtcFieldIndex = dtcfield['cells']['name'].findIndex(option => option.fieldName == dtcToggleField);
      let dtcf = dtcfield['cells']['name'][dtcFieldIndex];
      dtcf.hiddenFlag = flag;
      let toggleSelection = dtcf.selection;
      
      errCodeIndex = this.formFields[chkStepIndex][chkStepTxt].findIndex(option => option.fieldName == errCodeField);
      let errCodeData = this.formFields[chkStepIndex][chkStepTxt][errCodeIndex];
      let errCodesecIndex = errCodeData.sec;
      let errfield = this.apiFormFields[chkStepIndex][chkStepTxt][errCodesecIndex];
      errCodeFieldIndex = errfield['cells']['name'].findIndex(option => option.fieldName == errCodeField);
      let errf = errfield['cells']['name'][errCodeFieldIndex];
      errf.hiddenFlag = flag;

      if(flag) {
        errf.valid = flag;
      } else {
        let errVal = Array.isArray(errf.selectedVal) ? errf.selectedVal : [];
        if(toggleSelection) {
          errf.valid = (errVal.length > 0) ? !flag : flag;
        } else {
          errf.valid = !flag;
        }
      }
    }
  }

  getVinData(fieldData, stepTxt, stepIndex, fieldSec, fieldIndex, field, fieldName, secIndex, apiInfo, action, vaction = '') {
    console.log(fieldData, stepTxt, stepIndex, fieldSec, fieldIndex, field, fieldName, secIndex, apiInfo, action);
    let vfd = fieldData;
    let extraField = {
      stepTxt,
      stepIndex,
      secIndex,
      fieldSec,
      fieldIndex,
      f: vfd,
      field,
      fieldName
    };
    let callbackItems = (field == 'vinNo') ? JSON.parse(vfd.relationalFields) : [];
    let windex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == 'workstreams');
    let wsVal = this.formFields[stepIndex][stepTxt][windex].formValue;
    let setupFlag = (fieldName == 'vinNo') ? true : false;
    if(vfd.changeAction == 'change') {
      if(vfd.selectedVal.length == 17) {
        let vinDecode = (this.tvsDomain || this.TVSIBDomain) ? this.frameDecode : this.vinDecode;
        this.dialogContent = (vaction == '') ? vinDecode : this.dialogContent;
        this.dialogClose = false;
        this.dialogEscClose = false;
        this.dialogLoader = true;
        this.dialogModal = true;
        let vapiData = apiInfo;
        let vapiName = vfd.apiName;
        console.log(vfd)
        let query = JSON.parse(vfd.queryValues);
        vapiData[query[0]] = vfd.selectedVal;
        vapiData['worksteamList'] = JSON.stringify(wsVal);
        // Get Vin Field Data
        this.getData(action, secIndex, vfd, vapiName, vapiData, extraField);
      } else {
        vfd.invalidFlag = false;
        vfd.vinNo = '';
        vfd.vinDetails = [];
        let vformField = this.formFields[this.stepIndex][this.stepTxt];
        if(field == 'vinNo') {
          this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].optDisableFlag = true;
          //this.removeVinData(callbackItems, formField)
          for(let i of callbackItems) {
            let chkIndex = vformField.findIndex(option => option.fieldName === i);
            let cfieldSec = (vformField[chkIndex].optField) ? 'optionFilter' : 'name';
            this.setupFieldData(i, this.stepIndex, this.stepTxt, cfieldSec);
            if(i == 'make' || i == 'model' || i == 'year') {
              this.disableField(i, false);
            }                    
            //console.log(i)
            if(i == 'make' || i == 'SelectProductType') {
              let chkField = extraField['field']['cells']['name']; 
              let mkIndex = chkField.findIndex(option => option.fieldName == i);
              let mkField = chkField[mkIndex];
              let mapiData = this.baseApiInfo();
              let mapiName = mkField.apiName;
              let query = JSON.parse(mkField.queryValues);
              mapiData[query[0]] = JSON.stringify(wsVal);

              let extra = [];
              // Get Make Field Data
              this.getData('onload', extraField['secIndex'], chkField[mkIndex], mapiName, mapiData, extra);
            }
          }
        }
        if(setupFlag)      
          this.setupFieldData(fieldName, this.stepIndex, this.stepTxt, fieldSec);
      }
    } else {
      vfd.invalidFlag = false;
      console.log('recent vin action');
      let vinRes = vfd.vinDetails;
      let callbackItems = [];
      if(fieldName == 'vinNo') {
        console.log(JSON.parse(vfd.relationalFields))
        if(this.tvsDomain) {
          callbackItems = JSON.parse(vfd.relationalFields);
        } else {
          callbackItems = ['make', 'model', 'AdditionalModelInfo', 'AdditionalModelInfo2', 'AdditionalModelInfo3', 'AdditionalModelInfo4', 'AdditionalModelInfo5', 'year'];
        }
        
      }
      // Setup Vin Details
      this.setupVinDetails(vinRes, callbackItems, extraField, true, secIndex);
    }
  }

  setupThreadCatg(tcf, tcfData) {
    let threadVal = this.threadInfo[tcf.threadInfoApiKey];
    console.log(threadVal)
    let itemId = (threadVal.length > 0) ? threadVal[0].id : '';  
    this.threadCatgVal = itemId;
    tcf.selectedIds = threadVal;
    tcf.selectedValueIds = [itemId];
    tcf.selectedValues = itemId;
    let fid, fname;
    for(let item of threadVal) {
      fid = item.id;
      fname = item.name;
    }
    let fval = (tcf.apiFieldType == 1) ? fid : fname;
    let formVal = (tcf.apiValueType == 1) ? fval : [fval];
    let formValueIds = fid;
    let formValueItems = fname;
    tcfData.formValue = formVal;
    tcfData.formValueIds = formValueIds;
    tcfData.formValueItems = formValueItems;
  }

  removeRepairOrder(stepIndex, stepTxt, secIndex, fieldSec, repairOrderIndex) {
    let roFieldName = 'repairOrder';
    let roindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == roFieldName);
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].roDetails = [];
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].selectedVal = '';
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].selectedValueIds = '';
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].selectedValues = '';
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].roNo = '';
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].roValid = true;
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].valid = true;
    this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][repairOrderIndex].invalidFlag = false;
    this.formFields[this.stepIndex][this.stepTxt][roindex].roDetails = [];
    this.formFields[this.stepIndex][this.stepTxt][roindex].selectedVal = '';
    this.formFields[this.stepIndex][this.stepTxt][roindex].formValue = '';
    this.formFields[this.stepIndex][this.stepTxt][roindex].formValueIds = '';
    this.formFields[this.stepIndex][this.stepTxt][roindex].formValueItems = '';
    this.formFields[this.stepIndex][this.stepTxt][roindex].valid = true;
    localStorage.removeItem('roNo');
  }

  closeRequire(event) {
    this.requiredFlag = false;
    this.requiredFields = [];
  }
    
  ngOnDestroy() {
    if(this.threadId > 0) {
      localStorage.removeItem('threadAttachments');
    }
    this.subscription.unsubscribe();
  }
}