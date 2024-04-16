import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../services/api/api.service';
import { Constant, ManageTitle, pageTitle, pageInfo, RedirectionPage, IsOpenNewTab, windowHeight } from '../../../common/constant/constant';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ThreadService } from '../../../services/thread/thread.service';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import * as moment from 'moment';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  
  subscription: Subscription = new Subscription();
  public threadTxt: string = ManageTitle.training;
  public title:string;
  public teamSystem = localStorage.getItem('teamSystem');
  public msTeamAccessMobile: boolean = false;
  public bodyElem;
  public footerElem;
  public bodyClass: string = "submit-loader";
  public secElement: any;
  public scrollPos: any = 0;
  
  public platformId: number = 0;
  public apiKey: string;
  public countryId;
  public domainId;
  public userId;
  public user: any;
  public threadId: number = 0;
  public threadInfo: any = [];
  public contentType: any = 2;

  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public threadApiData: object;

  public navUrl: string = "";
  public viewUrl: string = "threads/view/";
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
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public rmHeight: any = 180;
  public rmSHeight: any = 120;
  public threadFormData: any = new FormData();

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
    private location: Location,
    private formBuilder: FormBuilder,
    public acticveModal: NgbActiveModal,
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private threadApi: ThreadService
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
    this.userId = this.user.Userid;
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let threadId = this.route.snapshot.params['id'];
    this.threadId = (threadId == 'undefined' || threadId == undefined) ? this.threadId : threadId;
    this.manageAction = (this.threadId == 0) ? 'new' : 'edit';
    //if(this.threadId > 0) {
      this.pageInfo.manageAction = this.manageAction;
    //}
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    let navUrl = localStorage.getItem('threadNav');
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'threads' : navUrl;
    //this.viewUrl = `${this.viewUrl}${this.threadId}`
    this.navUrl = (this.manageAction == 'new') ? 'threads' : navUrl;
    setTimeout(() => {
      localStorage.removeItem('threadNav');
    }, 500);
    this.industryType = this.commonApi.getIndustryType();
    this.threadTxt = (this.industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : this.threadTxt;
    this.title = (this.threadId == 0) ? `${ManageTitle.actionNew} ${this.threadTxt}` : `${ManageTitle.actionEdit} ${this.threadTxt}`;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);

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
      makeName: '',
      modelName: '',
      yearValue: '',
      productType: ''
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

      let step = 1
      this.getThreadFields(step);
    }, 200);

    this.subscription.add(
      this.commonApi.dynamicFieldDataResponseSubject.subscribe((response) => {
        let industryType = this.industryType.id;
        if(response['type'] == 'updated-attachments') {
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
          let stepIndex = response['stepIndex']
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
          let vinFieldName = 'vinNo';
          let makeFieldName = 'make';
          let modelFieldName = 'model';
          let ptFieldName = 'SelectProductType';
          let threadCatgFieldIndex,vinFieldIndex, makeFieldIndex, modelFieldIndex, ptFieldIndex, tcIndex, vindex, mkIndex, mindex, ptindex;
          switch (fieldName) {
            case 'workstreams':
              let vinFlag = true;
              let wf = field['cells']['name'][fieldIndex];
              if(industryType == 2 || industryType == 3) {
                vindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == vinFieldName);
                let vsecIndex = this.formFields[stepIndex][stepTxt][vindex].sec;
                let vfield = this.apiFormFields[stepIndex][stepTxt][vsecIndex];
                vinFieldIndex = vfield['cells']['name'].findIndex(option => option.fieldName === vinFieldName);
                let currField = this.apiFormFields[stepIndex][stepTxt][vsecIndex]['cells'][fieldSec][vinFieldIndex] 
                currField.disabled = (currField.disabled) ? false : currField.disabled;
                currField.disabled = (fieldData.selectedValueIds.length > 0) ? currField.disabled : true;
                vinFlag = (fieldData.selectedValueIds.length < `17`) ? true : false;
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
                tcIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == threadCatgName);
                if(tcIndex >= 0) {
                  let tcsecIndex = this.formFields[stepIndex][stepTxt][tcIndex].sec;
                  let tcfield = this.apiFormFields[stepIndex][stepTxt][tcsecIndex];
                  threadCatgFieldIndex = tcfield['cells']['name'].findIndex(option => option.fieldName == threadCatgName);
                  this.apiFormFields[stepIndex][stepTxt][tcsecIndex]['cells']['name'][threadCatgFieldIndex].disabled = false;
                  let tcf = tcfield['cells']['name'][threadCatgFieldIndex];
                  let tcapiData = apiInfo;
                  let tcapiName = f.apiName;
                  let tcextraField = [];
                  query = JSON.parse(f.queryValues);
                  tcapiData[query[0]] = JSON.stringify(wsInfo);
                  if(fieldData.selectedValueIds.length > 0) {
                    tcf.disabled = true;
                    tcf.loading = f.disabled;  
                    this.getData(action, tcsecIndex, tcf, tcapiName, tcapiData, tcextraField);
                  }
                }

                if(makeFieldIndex >= 0) {
                  mkIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == makeFieldName);
                  secIndex = this.formFields[stepIndex][stepTxt][mkIndex].sec;
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
                let checkFields = ['AdditionalModelInfo', 'AdditionalModelInfo2'];
                checkFields.forEach(item => {
                  let checkInfo = formField.findIndex(option => option.fieldName == item);
                  if(checkInfo >= 0) {
                    this.setupFieldData('AdditionalModelInfo', stepIndex, stepTxt, fieldSec);
                    this.setupFieldData('AdditionalModelInfo2', stepIndex, stepTxt, fieldSec);
                  }
                });
                
              //}
              break;
            case 'vinNo':
              let vfd = fieldData;
              let extraField = {
                stepTxt: stepTxt,
                stepIndex: stepIndex,
                secIndex: secIndex,
                fieldSec: fieldSec,
                fieldIndex: fieldIndex,
                f: vfd,
                field: field,
                fieldName: fieldName
              };
              let callbackItems = JSON.parse(vfd.relationalFields);
              let windex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == 'workstreams');
              let wsVal = this.formFields[stepIndex][stepTxt][windex].formValue;
              if(vfd.changeAction == 'change') {
                if(vfd.selectedVal.length == 17) {
                  let vapiData = apiInfo;
                  let vapiName = vfd.apiName;
                  query = JSON.parse(vfd.queryValues);
                  vapiData[query[0]] = vfd.selectedVal;
                  vapiData['worksteamList'] = JSON.stringify(wsVal);
                  // Get Vin Field Data
                  this.getData(action, secIndex, vfd, vapiName, vapiData, extraField);
                } else {
                  vfd.invalidFlag = false;
                  vfd.vinNo = '';
                  let vformField = this.formFields[this.stepIndex][this.stepTxt];
                  this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].optDisableFlag = true;
                  //this.removeVinData(callbackItems, formField)
                  for(let i of callbackItems) {
                    let chkIndex = vformField.findIndex(option => option.fieldName === i);
                    let cfieldSec = (vformField[chkIndex].optField) ? 'optionFilter' : 'name';
                    this.setupFieldData(i, this.stepIndex, this.stepTxt, cfieldSec);
                    this.disableField(i, false);
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
                  this.setupFieldData(fieldName, this.stepIndex, this.stepTxt, fieldSec);
                }
              } else {
                vfd.invalidFlag = false;
                let vinRes = vfd.vinDetails;
                //let callbackItems = ['make', 'model', 'AdditionalModelInfo', 'AdditionalModelInfo2', 'AdditionalModelInfo3', 'AdditionalModelInfo4', 'AdditionalModelInfo5', 'year'];
                // Setup Vin Details
                this.setupVinDetails(vinRes, callbackItems, extraField, true, secIndex);
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
              dfield.valid = fvalid;
              fieldItem[dindex].valid = fvalid;
              break;  
          }
        }
        
      })
    );
  }

  setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, fieldData, field, fieldName) {
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
    
    let addInfo = formField.findIndex(option => option.fieldName == fieldName);
    formField = formField[addInfo];
    let fsec = formField.sec;
    let fi = formField.findex;
    let apiField = this.apiFormFields[stepIndex][stepTxt][fsec]['cells'][fieldSec][fi];
    let formatType = apiField.apiValueType;
    let item = (formatType == 1) ? "" : [];
    let disableFlag = false;
    if(this.industryType.id == 3 && fieldName == 'model') {
      disableFlag = apiField.disableFlag;
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
  getThreadFields(currentStep: any) {
    let step = currentStep;
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    let apiStep = 1;
    this.threadApi.apiGetMarketPlaceFields(currentStep).subscribe((response) => {
      let configInfo = response.configInfo;
      let sections = configInfo.sections; 
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      let i = 0;
      this.threadInfo = (this.threadId > 0) ? response.threadInfo[0] : this.threadInfo;
      let action = 'onload';
      let step2FormField = this.formFields[this.stepIndex][this.stepTxt];
      let step2ApiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][0];
      if(this.stepTxt == 'step2') {
        this.bannerImage = configInfo.bannerImage;
        this.defaultBanner = configInfo.isDefaultBanner;
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
          if(f.cellArray.length > 0) {
            for(let fc of f.cellArray) {
              fc.fieldName = fc.apiName;
              fc.displayFlag = true;
              fc.recentShow = false;
              fc.lazyLoading = false;
              fc.loading = false;
              fc.valid = (fc.isMandatary == 1) ? false : true;
              fc.isNumeric = false;
              fc.isArray = (fc.apiValueType == 1) ? false : true;
              fc.selectedValueIds = (fc.apiValueType == 1) ? "" : [];
              fc.selectedValues = (fc.apiValueType == 1) ? (fc.fieldName == 'odometer') ? null : "" : [];
              fc.selectedVal = (fc.apiValueType == 1) ? "" : [];
              val = (fc.apiValueType == 1) ? "" : [];
              
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
                fc.selectedValueIds = (this.threadId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].id : fc.selectedValueIds;
                fc.selectedValues = (this.threadId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedValues;
                fc.selectedVal = (this.threadId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedVal;
                fc.valid = (fc.fieldName == 'miles' && !fc.valid) ? true : fc.valid;
                val = fc.selectedVal;
              }
              this.threadForm.addControl(fc.apiFieldKey, new FormControl(val));
              let flag = (fc.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, fc.apiFieldKey);
              if(this.threadId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
                let chkFieldIndex = step2FormField.indexOf(option => option.fieldName == fc.fieldName);
                fieldFlag = (chkFieldIndex >= 0) ? false : true;
                if(!fieldFlag) {
                  step2FormField[chkFieldIndex]['findex'] = c;
                }
              }
              if(fieldFlag) {
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
                  optField: false,
                  placeholder: fc.placeholder,
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
            if(this.threadId > 0 || (this.threadId == 0 && f.fieldName == 'workstreams' && f.autoselection == 1)) {
              f.recentShow = false;
              let threadVal;
              if(this.threadId > 0) {
                threadVal = this.threadInfo[f.threadInfoApiKey];
              } else {
                threadVal = f.workstreamValues;
              }              
              
              if(f.fieldName == 'threadType') {
                this.threadType = threadVal;
                this.threadApiData['threadType'] = threadVal;
              }

              if(f.fieldName == 'audioDescription') {
                this.pageInfo.audioAttachmentItems = threadVal;
              }

              if(f.selection == 'multiple' || (f.fieldType == 'popup' && (f.fieldName != 'model' && f.fieldName != 'vinNo') && f.selection == 'single')) {
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

                let code = [];
                for(let item of f.selectedIds) {
                  let iname = (f.fieldName == "technicianInfo") ? `${item.name} - ${item.phoneNo}` : item.name;
                  id.push(item.id);
                  name.push(iname);
                  if(f.fieldName == 'errorCode') {
                    let codeVal = `${item.code}##${item.description}`
                    code.push(codeVal);
                  }             
                }

                id = (f.selection == 'single' && f.apiValueType == 1) ? id[0] : id;
                name = (f.selection == 'single' && f.apiValueType == 1) ? name[0] : name;
                
                f.selectedValueIds = id;
                f.selectedValues = name;
                f.selectedVal = name;
                val = threadVal;
                formVal = (f.apiFieldType == 1) ? id : name;
                formVal = (f.fieldName == 'errorCode') ? code : formVal;
                formValueIds = id;
                formValueItems = name;
                if(f.fieldName == 'uploadContents') {
                  this.pageInfo.attachmentItems = threadVal;
                  if(this.threadId > 0) {
                    let uploadContents = this.threadInfo[f.threadInfoApiKey];
                    localStorage.setItem('threadAttachments', JSON.stringify(uploadContents));
                  }
                }

                if(threadVal.length > 0 && f.isMandatary == 1) {
                  f.valid = true;
                }
              } else {
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
                    let itemId = threadVal[0].id;  
                    f.selectedIds = threadVal;
                    f.selectedValueIds = [itemId];
                    f.selectedValues = itemId;
                    let fid, fname;
                    for(let item of threadVal) {
                      fid = item.id;
                      fname = item.name;
                    } 
                    let fval = (f.apiFieldType == 1) ? fid : fname;
                    formVal = (f.apiValueType == 1) ? fval : [fval];
                    formValueIds = fid;
                    formValueItems = fname;
                    break;
                  case 'threadType':
                    this.threadType = threadVal;
                    this.threadApiData['threadType'] = this.threadType;
                    break;
                  case 'dtcToggle':
                    f.selection = threadVal; 
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
                    for(let rf of JSON.parse(f.relationalFields)) {
                      this.disableField(rf, true);
                    }  
                  }, 1500);
                }
                break;  
              case 'year':
                f.itemValues = this.years;
                break;
            }

            if(f.apiName != '') {
              let loadApi = true;
              let apiUrl = f.apiName;
              let apiData = apiInfo;
              let query = (f.queryValues == "") ? "" : JSON.parse(f.queryValues);
              let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
              let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
              let ws, wsFormField, wsApiField, apiAccess;
              let extraField = [];
              switch (f.fieldName) {
                case "workstreams":
                  apiData['type'] = 1;
                  apiData['contentTypeId'] = this.contentType;
                  break;
                case 'ThreadCategory':
                  loadApi = (this.threadId > 0) ? true : false;
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
                  ws = (wsApiField.autoselection == 1) ? wsApiField.selectedValueIds : wsFormField.formValue;
                  apiAccess = (this.threadId > 0) ? 'Edit Thread' : 'New Thread';
                  apiData[query[0]] = JSON.stringify(ws);
                  break;
                case 'make':
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];  
                  f.disabled = (wsApiField.autoselection == 1) ? false : f.disabled;
                  f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                  loadApi = false;
                  if(this.threadId > 0 || wsApiField.autoselection == 1) {
                    ws = wsApiField.selectedValueIds;
                    let apiName = f.apiName;
                    apiAccess = (this.threadId > 0) ? 'Edit Thread' : 'New Thread';
                    apiData[query[0]] = JSON.stringify(ws);
                    apiData['access'] = apiAccess;
                    f.loading = f.disabled;
                    extraField = [];
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
                default:
                  loadApi = false;
                  break;
              }

              if(loadApi) {
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
            }
            if(fieldFlag) {
              let onloadFlag = (this.threadId == 0) ? true : false;
              onloadFlag = (this.threadId == 0 && f.fieldName == 'workstreams' && f.autoselection == 0) ? true : false;
              if(val == 'undefined' || val == undefined) {
                val = (f.apiValueType == 1) ? "" : [];
              }
              let vin = (f.fieldName == 'vinNo');
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
                optField: false,
                placeholder: f.placeholder,
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
            if(opt.selection == 'multiple') {
              opt.itemValues = threadVal;
              opt.selectedIds = threadVal;
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
              val = threadVal;
              formVal = threadVal;
              formValueIds = threadVal;
              formValueItems = threadVal;
              if(threadVal != "" && opt.isMandatary == 1) {
                opt.valid = true;
              }
            }
          }
          this.threadForm.addControl(opt.apiFieldKey, new FormControl(val));
          let flag = (opt.isMandatary == 1) ? true : false;
          this.setFormValidation(flag, opt.apiFieldKey);
          if(this.threadId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
            let chkFieldIndex = step2FormField.indexOf(option => option.fieldName == opt.fieldName);
            fieldFlag = (chkFieldIndex >= 0) ? false : true;
            if(!fieldFlag) {
              step2FormField[chkFieldIndex]['findex'] = c;
            }
          }
          if(fieldFlag) {
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
              optField: true,
              placeholder: opt.placeholder,
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

      this.pageInfo['threadUpload'] = this.threadUpload;
      this.pageInfo['apiFormFields'] = this.apiFormFields;
      setTimeout(() => {
        this.loading = false;
        this.step2Loading = this.loading;
        setTimeout(() => {
          if(this.stepTxt == 'step1') {
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
        }, 100);
      }, 1000);
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
    let makeFieldName = 'make';
    let modelFieldName = 'model';
    let ptFieldName = 'SelectProductTypes';
    let callbackItems = [];
    if(fi.fieldName == 'vinNo') {
      callbackItems = JSON.parse(fi.relationalFields);
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
    if(fi.fieldName == 'vinNo') {
      for(let i of callbackItems) {
        this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues);
      }
    }
    
    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      fi.disabled = false;
      fi.loading = fi.disabled;
      let currentFieldName = fi.fieldName;
      switch (currentFieldName) {
        case "workstreams":
          fi.itemValues = response['workstreamList'];
          let workstreamVal = (this.threadId == 0 && fi.autoselection == 1) ? fi.workstreamValues : fi.selectedIds;
          if(Array.isArray(workstreamVal) && workstreamVal.length > 0) {
            let windex = fi.itemValues.findIndex(option => option.id == workstreamVal[0].id); 
            if(windex >= 0) {
              let itemVal = fi.itemValues[windex];
              workstreamVal[0].key = itemVal.key;
              workstreamVal[0].editAccess = itemVal.editAccess;
            }            
          }
          break;
        case 'vinNo':
          fieldIndex = extraField.findIndex;
          fieldSec = extraField.fieldSec;
          secIndex = extraField.secIndex;
          let vinStatus = response['status'];
          let vinRes = response['vinDetails'];
          let vinFlag = (vinStatus == 'Success' && vinRes.length > 0) ? true : false; 
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
            fi.vinNo = apiData.vin;
            formField[vindex].vinNo = fi.vinNo;
            localStorage.setItem('VinNo', fi.vinNo); 
            // Setup Vin Details
            this.setupVinDetails(vinRes, callbackItems, extraField, chkFlag, sec);
          } else {
            fi.vinNo = '';
            formField[vindex].vinNo = fi.vinNo; 
            let mindex = formField.findIndex(option => option.fieldName === 'model');
            let modelVal = formField[mindex].formValue;
            let formatType = formField[mindex].formatType;
            let confFlag, resetFlag = false;
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
          }        
          break;
        case 'ThreadCategory':
          fi.itemValues = response['items'];
          break;
        case 'make':
        case 'SelectProductType':
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
          
          let res = (fi.fieldName == 'make') ? response['modelData'] : response['data'].items;
          fi.itemValues = [];
          for(let m in res) {
            fi.itemValues.push({
              id: res[m].id,
              name: (fi.fieldName == 'make') ? res[m].makeName : res[m].name
            });
            let checkArr = ['id', 'name'];
            fi.itemValues = this.commonApi.unique(fi.itemValues, checkArr);
            if(chkFlag && (fi.fieldName == 'make' && val == res[m].makeName) || (fi.fieldName == 'SelectProductType' && val == res[m].name)) {
              disableFlag = false;
              selId = res[m].id;
            }
          }
          
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
            if(action == 'onload' && this.threadId > 0 && fi.fieldName == 'SelectProductType') {
              let ptIndex = fi.itemValues.findIndex(option => option.id == val[0].id);
              let id = fi.itemValues[ptIndex].id;
              let name = fi.itemValues[ptIndex].name;
              fi.selectedValueIds = id;
              fi.selectedValues = id;
              fi.selectedVal = name;
              fi.valid = true;
            }
          }
          break;
        default:
          break;
      }
    },
    error  => {
    });
  }

  // Setup Vin Fields
  setupVinFields(chkField, extraField, chkFlag, callbackAction, itemVal, selVal = []) {
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
      let empty = (fi.formatType == 1) ? '' : [];
      let itemLen = itemVal.length;
      switch(callbackAction) {
        case 'init':
          fi = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkFieldIndex];
          fi.itemValues = itemVal;
          let chkVin = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec].findIndex(option => option.fieldName == 'vinNo');
          if(chkVin >= 0) {
            if(!this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkVin].vinValid) {
              fi.disabled = true;
            }
          }
          if(this.industryType.id == 3 && this.domainId != 94) {
            fi.disabled = true;
          }
          fi.loading = false;
          if(fi.selection == 'multiple') {
            fi.selectedIds = fi.itemValues;
          }
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
          fi.selectedValueIds = (fi.apiValueType == 1) ? id : id;
          if(fi.fieldType == 'popup' && fi.selection == 'single') {
            fi.selectedValues = (fi.apiFieldType == 1) ? id : name;
            //if(this.industryType.id == 3 && fieldName == 'model') {
              //fi.selectedValueIds = (fi.apiValueType == 1) ? name : name;
            //}
          } else {
            fi.selectedValues = name;
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
          fi.loading = false;      
          break;
        default:
          fi.loading = false;
          if(itemLen > 0) {
            id = (fi.apiValueType == 1) ? itemVal : itemVal > 0 ? [itemVal] : [];
            name = (fi.apiValueType == 1) ? itemVal : itemVal > 0 ? [itemVal] : [];
          }
          id = (itemLen > 0) ? id : empty;
          name = (itemLen > 0) ? name : empty;
          fi.selectedValueIds = (fi.apiValueType == 1) ? id : id;
          fi.selectedValues = (fi.apiFieldType == 1) ? id : name;
          fi.selectedVal = (fi.apiFieldType == 1) ? id : name;
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
    this.step1 = true;
    this.step2 = false;
    this.step1Action = true;
    this.step2Action = false;
    this.stepBack = true;
    this.step2Submitted = false;
    this.stepTxt = "step1";
    this.stepIndex = 0;
    this.threadApiData['uploadedItems'] = this.uploadedItems.items;
    this.threadApiData['attachments'] = this.uploadedItems.attachments;
    this.pageInfo.uploadedItems = this.uploadedItems.items;
    this.pageInfo.attachments = this.uploadedItems.attachments;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    this.pageInfo.stepBack = this.stepBack;
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
    this.onSubmit();
  }

  // Thread Onsubmit
  onSubmit() {
    this.step1Submitted = (this.step1Action && !this.step2Action) ? true : false;
    this.step2Submitted = (this.step1Action && this.step2Action) ? true : false;
    this.pageInfo.step1Submitted = this.step1Submitted;
    this.pageInfo.step2Submitted = this.step2Submitted;
    this.pageInfo.uploadedItems = this.uploadedItems;
    let submitFlag = true;
    for(let f of this.formFields[this.stepIndex][this.stepTxt]) {
      let formVal = f.formValue;
      let selVal = f.selectedVal;
      if ((f.apiFieldKey == 'startDate' || f.apiFieldKey == 'endDate' || f.apiFieldKey == 'startTime' || f.apiFieldKey == 'endTime') && f.formValue) {
        f.valid = true;
      }
      if(formVal == 'undefined' || formVal == undefined) {
        formVal = (f.formatType == 1) ? '' : [];
        selVal = (f.formatType == 1) ? '' : [];
      }
      f.formValue = formVal;
      f.selectedVal = selVal;
      let aupItems = Object.keys(this.audioUploadedItems);
      if(f.fieldName == 'content' && aupItems.length > 0 && this.audioUploadedItems.items.length > 0) {
        let descVal = `<p>${Constant.audioDescText}</p>`;
        f.formValue = descVal;
        f.selectedVal = descVal;
      }
      if(f.displayFlag && !f.valid) {
        submitFlag = f.valid;
      }
      console.log("this.threadForm: ", this.threadForm);
      console.log("f: ", f);
      console.log("submitFlag: ", submitFlag);
    }
    if(!submitFlag) {
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
        if(this.threadType == 'thread' || (this.threadType == 'share' && formFieldLen > 1)) {
          this.stepIndex = 1;
          this.stepTxt = "step2";
          if(formFieldLen > 1) {
            let displayFlag = (this.threadType == 'thread') ? false : true;
            for(let ff of this.formFields[this.stepIndex][this.stepTxt]) {
              if(ff.threadType == 'share') {
                ff.displayFlag = displayFlag;
                let apiField = this.apiFormFields[this.stepIndex][this.stepTxt][ff.sec];
                if(ff.fieldName != 'fixcontent') {
                  apiField.displayFlag = displayFlag;
                }                
                apiField['cells']['name'][ff.findex].displayFlag = displayFlag;
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
      this.bannerImage = '';      
      let step = 2;
      this.getThreadFields(step);
    } else {
      let upItems = Object.keys(this.uploadedItems);
      let uploadCount = 0;
      if(upItems.length > 0 && this.uploadedItems) {
        this.uploadedItems.forEach(item => {
          if(item.type != 'media') {
            uploadCount++;
          }       
        });
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
    this.bodyElem.classList.add(this.bodyClass);
    let uploadCount = 0;
    if(this.uploadedItems && Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.length > 0) {
      this.uploadedItems.forEach(item => {
        if(item.type == 'media') {
          this.mediaUploadItems.push({fileId: item.fileId.toString()});
        } else {
          uploadCount++;
        }
      });
    }
    
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    // threadFormData.append('apiKey', this.apiKey);
    // threadFormData.append('domainId', this.domainId);
    // threadFormData.append('countryId', this.countryId);
    // threadFormData.append('userId', this.userId);
    this.threadFormData.append('mediaAttachments', JSON.stringify(this.mediaUploadItems));
    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
      for(let s of this.formFields[i][step]) {
        let formVal = s.formValue;
        this.threadFormData.append(s.apiFieldKey, formVal);
      }
    }
    let startDate = this.threadFormData.get('startDate') ? moment(this.threadFormData.get('startDate')).format('YYYY-MM-DD') : null;
    let endDate = this.threadFormData.get('endDate') ? moment(this.threadFormData.get('endDate')).format('YYYY-MM-DD') : null;
    let startTime = this.threadFormData.get('startTime') ? moment(this.threadFormData.get('startTime')).format('YYYY-MM-DD HH:mm') : null;
    let endTime = this.threadFormData.get('endTime') ? moment(this.threadFormData.get('endTime')).format('YYYY-MM-DD HH:mm') : null;
    this.threadFormData.set('startDate', startDate);
    this.threadFormData.set('endDate', endDate);
    this.threadFormData.set('startTime', startTime);
    this.threadFormData.set('endTime', endTime);
    this.threadApi.createMarketPlace(this.threadFormData).subscribe((response) => {
      this.threadFormData = new FormData();
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      this.successMsg = response.result;
      if(response.status == "Success") {
      }
    }, (error: any) => {
      this.threadFormData = new FormData();
      this.bodyElem.classList.remove(this.bodyClass);
    });
  }

  getFormValue(value: any) {
    if (Array.isArray(value)) { 
      value.forEach((val: any) => {
        this.getValue(val);
      });
    } else {
      return value;
    }
  }

  getValue(value: any) {
    if (Array.isArray(value)) {
      return this.getFormValue(value[0]);
    } else {
      return value;
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
  }

  // Get Product Types
  getProductTypes(action, stepIndex, stepTxt, secIndex, fieldSec, field, apiInfo, queryInfo) {
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
  setupVinDetails(vinRes, callbackItems, extraField, chkFlag, sec) {
    let apiFields = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['name'];
    let itemValues = [];
    let callbackAction = 'init';
    let selVal = [];
          
    for(let i of callbackItems) {
      switch(i) {
        case 'make':
          selVal = [];  
          itemValues = vinRes.makeItems;
          break;        
        case 'SelectProductType':
          let prodIndex = apiFields.findIndex(option => option.fieldName == i);
          itemValues = apiFields[prodIndex].itemValues;
          if(this.industryType.id == 3) {
            selVal = itemValues.filter(option => option.name == vinRes.makeName);
          }
          break;
        case 'model':
          selVal = [];
          let modelItems = [];
          modelItems.push({id: vinRes.uId, name: vinRes.modelName});
          itemValues = modelItems;
          break;
        case 'AdditionalModelInfo':
          selVal = [];
          itemValues = vinRes.additionalInfo1;
          break;
        case 'AdditionalModelInfo2':
          selVal = [];
          itemValues = vinRes.additionalInfo2;
          break;
        case 'AdditionalModelInfo3':
          selVal = [];
          itemValues = vinRes.additionalInfo3;
          break;
        case 'AdditionalModelInfo4':
          selVal = [];
          itemValues = vinRes.additionalInfo4;
          break;
        case 'AdditionalModelInfo5':
          selVal = [];
          itemValues = vinRes.additionalInfo5;
          break;
        case 'year':
          selVal = [];
          callbackAction = 'setup';
          itemValues = vinRes.year;
          break;  
      }
      this.setupVinFields(i, extraField, chkFlag, callbackAction, itemValues, selVal);
    }
    //if(this.industryType.id != 3) {
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

  ngOnDestroy() {
    if(this.threadId > 0) {
      localStorage.removeItem('threadAttachments');
    }
    this.subscription.unsubscribe();
  }
}