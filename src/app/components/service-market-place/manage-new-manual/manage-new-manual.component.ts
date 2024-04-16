import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
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
import { ViewPolicyComponent } from '../../common/view-policy/view-policy.component';

@Component({
  selector: 'app-manage-new-manual',
  templateUrl: './manage-new-manual.component.html',
  styleUrls: ['./manage-new-manual.component.scss']
})
export class ManageNewManualComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  subscription: Subscription = new Subscription();
  public threadTxt: string = ManageTitle.manual;
  public title:string;
  public teamSystem = localStorage.getItem('teamSystem');
  public msTeamAccessMobile: boolean = false;
  public bodyElem;
  public footerElem;
  public bodyClass: string = "submit-loader";
  public secElement: any;
  public scrollPos: any = 0;
  public selectedPolicies: any = [];

  public platformId: number = 0;
  public apiKey: string;
  public countryId;
  public domainId;
  public userId;
  public user: any;
  public threadId: number = 0;
  public threadInfo: any = [];
  public contentType: any = 48;

  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public threadApiData: object;
  duplicateMarketPlace: any = false;

  public navUrl: string = "market-place/manual";
  public viewUrl: string = "market-place/view-manual/";
  public manageAction: string = "new";
  public pageAccess: string = "manageManual";
  public threadType: string = 'thread';
  public saveText: string = "Publish";
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
  policies: any = [];
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
  showOnlineField = false;
  showInPersonField = false;
  showHoursField = false;
  showAbleformFields: any = [];
  currentPaymentStatus: any;
  inPersonTimeSelect: any;
  startDate: any;
  endDate: any;
  sectionsArray: any = [];
  requiredInPersonData: any = [];
  public miniumStartDate: any = new Date();
  public miniumEndDate: any = new Date();
  public maximumEndDate: any = '';
  public maximumStartDate: any = '';
  trainingModeChanged: boolean = false;
  firstTime: any = 0;
  firstTimeSetStart: any = 0;
  firstTimeSetEnd: any = 0;
  resetStartEndDate: any = false;
  showStartDateValidation: any = false;
  marketPlaceimgUrl: any;
  marketPlaceimgName: any;
  selectedMarketPlaceBanner: any;
  businessProfileId: any = 8;
  marketPlaceBannerImgUrlServer: any;
  startTime: any;
  endTime: any;
  signedupUsers: any;
  customValidationMsg: any;
  showCustomValidation: boolean = false;
  countryDropdownData: any = [];
  stateDropdownData: any = [];
  searchValue: any = '';
  discountPercentage: any;
  miniumExpiryDateBird: any;
  discountPrice: any;
  showBirdPriceValidation: any = false;
  showBirdPercentageValidation: any = false;
  showBirdValues: any = false;
  isFreePrice: any = false;
  showPriceError: any = false
  settingPrice: boolean = false;
  settingPercent: boolean = false;
  forTrainingOnly = '0';
  disablePerfectScroll: boolean = false;
  ismanualFromList = false;
  sameName: any = {};


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
    private threadApi: ThreadService,
    private httpClient: HttpClient,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  getPolicies() {
    this.threadApi.apiMarketPlacePoliciesData(this.domainId).subscribe((res: any) => {
      if(res.status == "Success" && res.policies && res.policies.length) {
        this.policies = res.policies;
      } else {
        this.policies = [];
      }
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    });
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
    this.getPolicies();
    this.userId = this.user.Userid;
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    this.loadCountryStateData();
    let threadId = this.route.snapshot.params['id'];
    this.threadId = (threadId == 'undefined' || threadId == undefined) ? this.threadId : threadId;
    let action = this.route.snapshot.url[1]?.path;
    if (action == 'duplicate') {
      this.duplicateMarketPlace = true;
    }
    this.manageAction = (this.threadId == 0 || this.duplicateMarketPlace) ? 'new' : 'edit';
    this.saveText = (this.threadId == 0) ? 'Post' : (this.duplicateMarketPlace ? 'Post' : 'Update');
    //if(this.threadId > 0) {
      this.pageInfo.manageAction = this.manageAction;
    //}
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    let navUrl = localStorage.getItem('manualNav');
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'market-place' : navUrl;
    //this.viewUrl = `${this.viewUrl}${this.threadId}`
    this.navUrl = (this.manageAction == 'new') ? 'market-place' : navUrl;
    setTimeout(() => {
      localStorage.removeItem('manualNav');
    }, 500);
    this.industryType = this.commonApi.getIndustryType();
    this.title = (this.threadId == 0) ? `${ManageTitle.actionNew} ${this.threadTxt}` : (this.duplicateMarketPlace ? `${ManageTitle.actionDuplicate} ${this.threadTxt}` : `${ManageTitle.actionEdit} ${this.threadTxt}`);
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
      action: action ? action : "new",
      id: this.threadId,
      section: 'manual'
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
      access: 'manual',
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
              let vinFlag = (industryType == 1) ? false : true;
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

  previewPolicy(id) {
    const modalRef = this.modalService.open(ViewPolicyComponent, this.modalConfig);
    modalRef.componentInstance.policyId = id;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.closePolicyPopup.subscribe((res) => {
      modalRef.dismiss('Cross click');
    });
  }

  // Get Thread Fields
  getThreadFields() {
    let step = this.threadApiData['step'];
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    this.threadApi.apiGetManualFields(this.threadApiData).subscribe((response) => {
      let configInfo = response.configInfo;
      let sections = configInfo.sections;
      if (this.step1 && !this.step2) {
        this.sectionsArray = sections;
      }
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      let i = 0;
      this.threadInfo = (this.threadId > 0) ? response.threadInfo[0] : this.threadInfo;
      if (this.threadId > 0 && (this.domainId != this.threadInfo.domainID)) {
        this.router.navigateByUrl('market-place');
      }
      this.selectedPolicies = this.threadInfo.selectedPolicies;
      let action = 'onload';
      let step2FormField = this.formFields[this.stepIndex][this.stepTxt];
      let step2ApiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][0];
      if(this.stepTxt == 'step2') {
        this.bannerImage = configInfo.bannerImage;
        this.defaultBanner = configInfo.isDefaultBanner;
      }
      for (let s of sections) {
        if (s.stepsName == "In-person time select") {
          this.inPersonTimeSelect = s;
        }
      }
      this.pushInarray();
      let showingArray = this.step1 ? this.sectionsArray : sections;
      for(let sec of showingArray) {
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
              this.setFormValidation(flag, fc.apiName);

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
                if (f.selectedIds) {
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

                f.selectedValueIds = id;
                f.selectedValues = name;
                f.selectedVal = name;
                val = threadVal;
                formVal = (f.apiFieldType == 1) ? id : name;
                formVal = (f.fieldName == 'errorCode') ? code : formVal;
                formValueIds = id;
                formValueItems = name;
                if(f.fieldName == 'uploadContents') {
                  this.pageInfo.attachmentItems = this.threadInfo[f.fieldName];
                  if(this.threadId > 0) {
                    let uploadContents = this.threadInfo[f.fieldName];
                    localStorage.setItem('threadAttachments', JSON.stringify(uploadContents));
                  }
                }

                if(threadVal && threadVal.length > 0 && f.isMandatary == 1) {
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
                  apiData['contentTypeId'] = 34;
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
            val = f.selectedValues;
            if (f.apiFieldKey == 'isFree') {
              this.currentPaymentStatus = f.selectedValues;
            }
            if (f.apiFieldKey == 'trainingMode' && f.selectedValues == 'Webinar') {
              this.showOnlineField = true;
              this.showInPersonField = false;
              this.showHoursField = false;
            } else if (f.apiFieldKey == 'trainingMode' && f.selectedValues == 'Seminar') {
              this.showOnlineField = false;
              this.showOnlineField = true;
              this.showHoursField = false;
            } else if (f.apiFieldKey == 'trainingMode' && f.selectedValues == 'Hours') {
              this.showOnlineField = false;
              this.showInPersonField = false;
              this.showHoursField = true;
            } else {
              this.showOnlineField = false;
              this.showInPersonField = false;
              this.showHoursField = false;
            }
            if ((this.showOnlineField || this.showInPersonField) || (f.apiFieldKey == 'startDate' || f.apiFieldKey == 'endDate' || f.apiFieldKey == 'startTime' || f.apiFieldKey == 'endTime')) {
              if (f.selectedValues) {
                if (this.duplicateMarketPlace && (f.apiFieldKey == 'startDate' || f.apiFieldKey == 'endDate')) {
                  let date1: any = moment(this.threadInfo['startDate']).utc().format();
                  date1 = new Date(this.threadInfo['startDate']);
                  let date2: any = moment(this.threadInfo['endDate']).utc().format();
                  date2 = new Date(this.threadInfo['endDate']);
                  const diffTime = Math.abs(date2 - date1);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (f.apiFieldKey == 'startDate') {
                    val = new Date();
                    f.dateVal = new Date();
                  }
                  if (f.apiFieldKey == 'endDate') {
                    var date = new Date();
                    date.setDate(date.getDate() + diffDays);
                    val = date;
                    f.dateVal = date;
                  }
                } else {
                  val = moment(f.selectedValues).utc().format();
                  val = new Date(val);
                  f.dateVal = moment(f.selectedValues).utc().format();
                  f.dateVal = new Date(f.dateVal);
                }
              }
            }
            if ((f.apiFieldKey.includes('inPersonStartTime') || f.apiFieldKey.includes('inPersonEndTime'))) {
              val = moment(this.threadInfo[f.apiFieldKey]).utc().format();
              val = new Date(val);
              f.dateVal = moment(this.threadInfo[f.apiFieldKey]).utc().format();
              f.dateVal = new Date(f.dateVal);
            }
            if ((f.apiFieldKey.includes('inPersonDay') || f.apiFieldKey.includes('inPersonTimeZone') || f.apiFieldKey.includes('inPersonNotes'))) {
              val = this.threadInfo[f.apiFieldKey];
              f.selectedValues = val;
            }
            if ((f.apiFieldKey == 'country') && !this.threadId) {
              val = 'United States';
              f.selectedValues = val;
              f.valid = true;
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
            if (f.apiFieldKey == 'bannerImage' && this.threadId > 0) {
              this.marketPlaceBannerImgUrlServer = this.threadInfo['bannerImage'] ? this.threadInfo['bannerImage'] : null;
              this.marketPlaceimgUrl = this.threadInfo['bannerImageUrl'] ? this.threadInfo['bannerImageUrl'] : null;
            }
            if (f.apiFieldKey == "endDate" && this.threadId > 0) {
              this.endDate = moment(val).format();
              this.endDate = new Date(val);
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
          this.setFormValidation(flag, opt.fieldName);
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
        this.updateFreePrice(this.currentPaymentStatus);
        this.showBirdValues = this.threadInfo['isDiscount'];
        this.discountPrice = this.threadInfo['discountPrice'];
        this.discountPercentage = this.threadInfo['discountPercentage'];
        this.updateIsBirdPriceValue(this.showBirdValues);
        this.firstTime = 1;
      }, 1000);
    });
  }

  // Set Form Validation
  setFormValidation(flag, field) {
    if (flag) {
      if (field == 'email') {
        this.threadForm.controls[field].setValidators([Validators.required, Validators.pattern("^[a-zA0-9._%+-]+@[a-zA0-9.-]+\\.[a-z]{2,4}$")]);
      }
      else { this.threadForm.controls[field].setValidators([Validators.required]); }
    }
  }

  loadCountryStateData() {
    this.countryDropdownData = [];
    this.stateDropdownData = [];
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        response?.data?.countryData?.forEach((country) => {
          let countryObject = {
            name: country.name,
            id: country.name,
            key: country.id,
          }
          this.countryDropdownData.push(countryObject);
        });
        response?.data?.stateData?.forEach((state) => {
          let stateObject = {
            name: state.name,
            id: state.name,
            key: state.id,
          }
          this.stateDropdownData.push(stateObject);
        });
      }
    }, (error: any) => {
      this.loading = false;
    });
  }

  getStatesDropdownData(value: any) {
    if (value) {
      this.threadForm.patchValue({
        state: null,
      });
      this.stateDropdownData = [];
      let countryId = this.countryDropdownData.filter(country => country.name == value);
      this.threadApi.stateMasterData(countryId[0].key).subscribe((response: any) => {
        if (response.status == "Success") {
          response?.data?.stateData?.forEach((state) => {
            let stateObject = {
              name: state.name,
              id: state.name,
              key: state.id,
            }
            this.stateDropdownData.push(stateObject);
          });
        }
      }, (error: any) => {
        this.loading = false;
      })
    } else {
      this.stateDropdownData = [];
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
          if(this.threadId == 0 && fi.itemValues && fi.itemValues.length === 1) {
            let id = [];
            let name = [];
            fi.selectedIds = fi.itemValues;
            let code = [];
            if (fi.selectedIds) {
              for(let item of fi.selectedIds) {
                let iname = (fi.fieldName == "technicianInfo") ? `${item.name} - ${item.phoneNo}` : item.name;
                id.push(item.id);
                name.push(iname);
                if(fi.fieldName == 'errorCode') {
                  let codeVal = `${item.code}##${item.description}`
                  code.push(codeVal);
                }
              }
            }

            id = (fi.selection == 'single' && fi.apiValueType == 1) ? id[0] : id;
            name = (fi.selection == 'single' && fi.apiValueType == 1) ? name[0] : name;

            fi.selectedValueIds = id;
            fi.selectedValues = name;
            fi.selectedVal = name;
            fi.formValue = id;
            fi.formValueIds = id;
            fi.formValueItems = name;
            this.threadForm.patchValue({
              workstreams: name
            });
            fi.valid = true;
          }
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
    let threadFormData: any = this.threadForm.value;
    this.currentPaymentStatus = threadFormData.isFree;
    this.updateFreePrice(this.currentPaymentStatus);
    this.showBirdValues = threadFormData.isDiscount;
    this.discountPrice = threadFormData.discountPrice;
    this.discountPercentage = threadFormData.discountPercentage;
    this.updateIsBirdPriceValue(this.showBirdValues);
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
      if (f.apiFieldKey == 'workstream' && this.threadForm.get(f.apiFieldKey).value) {
        let workStreamValues: any = this.threadForm.get(f.apiFieldKey).value;
        f.valid = true;
      }
      if (f.apiFieldKey == 'policies') {
        f.valid = true;
      }
      if ((this.showOnlineField) && (f.apiFieldKey == 'venueName' || f.apiFieldKey == 'venueLink' || f.apiFieldKey == 'addressLine1' || f.apiFieldKey == 'addressLine2' || f.apiFieldKey == 'city' || f.apiFieldKey == 'state' || f.apiFieldKey == 'country' || f.apiFieldKey == 'zipCode' || f.apiFieldKey == 'hours' || f.apiFieldKey == 'recordedVideoLink' || f.apiFieldKey.includes('inPersonNotes') || f.apiFieldKey.includes('inPersonTimeZone') || f.apiFieldKey.includes('inPersonEndTime') || f.apiFieldKey.includes('inPersonDay') || f.apiFieldKey.includes('inPersonStartTime'))) {
        f.valid = true;
      } else if (this.showInPersonField && (f.apiFieldKey == 'hours' || f.apiFieldKey == 'recordedVideoLink' || f.apiFieldKey == 'startTime' || f.apiFieldKey == 'endTime' || f.apiFieldKey == 'timeZone') || f.apiFieldKey.includes('inPersonDay')) {
        f.valid = true;
      } else if ((this.showHoursField) && (f.apiFieldKey == 'venueName' || f.apiFieldKey == 'venueLink' || f.apiFieldKey == 'maxParticipants' || f.apiFieldKey == 'addressLine1' || f.apiFieldKey == 'addressLine2' || f.apiFieldKey == 'city' || f.apiFieldKey == 'state' || f.apiFieldKey == 'country' || f.apiFieldKey == 'zipCode' || f.apiFieldKey == 'hours' || f.apiFieldKey == 'startDate' || f.apiFieldKey == 'endDate' || f.apiFieldKey == 'startTime' || f.apiFieldKey == 'endTime' || f.apiFieldKey == 'timeZone' || f.apiFieldKey.includes('inPersonNotes') || f.apiFieldKey.includes('inPersonTimeZone') || f.apiFieldKey.includes('inPersonEndTime') || f.apiFieldKey.includes('inPersonDay') || f.apiFieldKey.includes('inPersonStartTime'))) {
        f.valid = true;
      }
      if ((f.apiFieldKey == 'startDate' || f.apiFieldKey == 'endDate' || f.apiFieldKey == 'startTime' || f.apiFieldKey == 'endTime' || f.apiFieldKey.includes('inPersonEndTime') || f.apiFieldKey.includes('inPersonStartTime')) && this.threadForm.get(f.apiFieldKey).value && !this.showHoursField) {
        if (f.apiFieldKey != 'workstream') {
          f.selectedValues = this.threadForm.get(f.apiFieldKey).value;
          f.selectedVal = this.threadForm.get(f.apiFieldKey).value;
          f.dateVal = this.threadForm.get(f.apiFieldKey).value;
          f.formValue = this.threadForm.get(f.apiFieldKey).value;
        }
        f.valid = true;
      }

      if (f.apiFieldKey == 'email') {
        if (this.threadForm.get('email').invalid) {
          f.valid = false;
        } else {
          f.valid = true;
        }
      }


      if (f.apiFieldKey == 'maxParticipants') {
        if (this.showCustomValidation) {
          f.valid = false;
        } else {
          f.valid = true;
        }
      }
      if (!this.showBirdValues && (f.apiFieldKey == 'discountPrice' || f.apiFieldKey == 'discountPercentage')) {
        f.valid = true;
      }
      if (this.showBirdValues && f.apiFieldKey == 'discountPrice' && this.threadForm.get('discountPrice').value) {
        f.valid = true;
      } else if (this.showBirdValues && f.apiFieldKey == 'discountPrice') {
        f.valid = false;
      }
      if (this.showBirdValues && f.apiFieldKey == 'discountPercentage' && this.threadForm.get('discountPercentage').value) {
        f.valid = true;
      } else if (this.showBirdValues && f.apiFieldKey == 'discountPercentage') {
        f.valid = false;
      }
      let formVal = f.formValue;
      let selVal = f.selectedVal;
      if(formVal == 'undefined' || formVal == undefined) {
        formVal = (f.formatType == 1) ? '' : [];
        selVal = (f.formatType == 1) ? '' : [];
      }
      if((this.industryType.id == 2 || this.industryType.id == 3) && f.fieldName == 'vinNo') {
        let sec = f.sec;
        let findex = f.findex;
        let vinField = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['name'][findex];
        let vinValid = vinField.vinValid;
        if(!vinValid || formVal.length < 17) {
          formVal = (vinField.vinNo.length == 17) ? formVal : '';
          selVal = formVal;
          vinField.seletedIds = formVal;
          vinField.selectedValueIds = formVal;
          vinField.selectedValues = formVal;
          vinField.selectedVal = formVal;
        }
      }
      f.formValue = formVal;
      f.selectedVal = selVal;
      let aupItems = Object.keys(this.audioUploadedItems);
      if(f.fieldName == 'content' && aupItems.length > 0 && this.audioUploadedItems.items.length > 0) {
        let descVal = `<p>${Constant.audioDescText}</p>`;
        f.formValue = descVal;
        f.selectedVal = descVal;
      }
      if ((f.apiFieldKey.includes('inPersonDay') || f.apiFieldKey.includes('inPersonNotes') || f.apiFieldKey.includes('inPersonEndTime') || f.apiFieldKey.includes('inPersonStartTime') || f.apiFieldKey.includes('inPersonTimeZone'))) {
        for(let i = 0; i < 7; i++) {
          if (f.apiFieldKey == 'inPersonStartTime'+i && this.threadForm.get('inPersonStartTime'+i).value) {
            f.valid = true;
          }
          if (f.apiFieldKey == 'inPersonEndTime'+i && this.threadForm.get('inPersonEndTime'+i).value) {
            f.valid = true;
          }
          if (f.apiFieldKey == 'inPersonDay'+i && this.threadForm.get('inPersonDay'+i).value) {
            f.valid = true;
          }
          if (f.apiFieldKey == 'inPersonTimeZone'+i && this.threadForm.get('inPersonTimeZone'+i).value) {
            f.valid = true;
          }
        }
      }

      if (['sku','manualName'].includes(f.apiFieldKey)) {
        if (this.threadForm.get(f.apiFieldKey).valid && this.sameName[f.apiFieldKey]) {
          f.valid = false;
        }
        let noChanges = 0;
        if (this.threadId > 0) {
          ['sku','manualName'].forEach((key) => {
            if (this.threadInfo[key] == this.threadForm.value[key]) {
              noChanges++;
            }
          });
        }
        if (noChanges > 1) {
          f.valid = true;
        }
      }
      if(f.displayFlag && !f.valid) {
        submitFlag = f.valid;
      }
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
      this.showAbleformFields = [];
      this.formFields[0]['step1'].forEach((field: any) => {
        if (field.apiFieldKey == 'workstream' && this.threadForm.get(field.apiFieldKey).value) {
          let workStreamValues: any = this.threadForm.get(field.apiFieldKey).value;
          let id = [];
          let name = [];
          workStreamValues.forEach((stream: any) => {
            id.push(stream.id);
            name.push(stream.name);
          });
          field.formValue = id
          field.formValueIds = id
          field.formValueItems = name
          field.selectedIds = workStreamValues
          field.selectedVal = name
          field.selectedValueIds = id
          field.selectedValues = name
          field.valid = true;
        }
        if (field.apiFieldKey != 'isFree' && field.apiFieldKey != 'venueName' && field.apiFieldKey != 'venueLink' && field.apiFieldKey != 'addressLine1' && field.apiFieldKey != 'addressLine2' && field.apiFieldKey != 'city' && field.apiFieldKey != 'state' && field.apiFieldKey != 'country' && field.apiFieldKey != 'zipCode' && field.apiFieldKey != 'hours' && !field.apiFieldKey.includes('inPersonNotes') && !field.apiFieldKey.includes('inPersonTimeZone') && !field.apiFieldKey.includes('inPersonEndTime') && !field.apiFieldKey.includes('inPersonDay') && !field.apiFieldKey.includes('inPersonStartTime') && field.apiFieldKey != 'recordedVideoLink' && field.apiFieldKey != 'discountPrice' && field.apiFieldKey != 'discountPercentage' && field.apiFieldKey != 'isDiscount') {
          if (field.apiFieldKey != 'workstream') {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            field.formValue = this.threadForm.get(field.apiFieldKey).value;
          }
          this.showAbleformFields.push(field);
        } else if (field.apiFieldKey != 'hours' && field.apiFieldKey != 'isFree' && field.apiFieldKey != 'timeZone' && field.apiFieldKey != 'startTime' && field.apiFieldKey != 'endTime' && !field.apiFieldKey.includes('inPerson') && field.apiFieldKey != 'recordedVideoLink' && field.apiFieldKey != 'discountPrice' && field.apiFieldKey != 'discountPercentage' && field.apiFieldKey != 'isDiscount') {
          if (field.apiFieldKey != 'workstream') {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            field.formValue = this.threadForm.get(field.apiFieldKey).value;
          }
          this.showAbleformFields.push(field);
        } else if (field.apiFieldKey != 'maxParticipants' && field.apiFieldKey != 'isFree' && field.apiFieldKey != 'venueName' && field.apiFieldKey != 'venueLink' && field.apiFieldKey != 'addressLine1' && field.apiFieldKey != 'addressLine2' && field.apiFieldKey != 'city' && field.apiFieldKey != 'state' && field.apiFieldKey != 'country' && field.apiFieldKey != 'zipCode' && field.apiFieldKey != 'startDate' && field.apiFieldKey != 'endDate' && field.apiFieldKey != 'startTime' && field.apiFieldKey != 'endTime' && field.apiFieldKey != 'timeZone' && !field.apiFieldKey.includes('inPersonNotes') && !field.apiFieldKey.includes('inPersonTimeZone') && !field.apiFieldKey.includes('inPersonEndTime') && !field.apiFieldKey.includes('inPersonDay') && !field.apiFieldKey.includes('inPersonStartTime') && field.apiFieldKey != 'discountPrice' && field.apiFieldKey != 'discountPercentage' && field.apiFieldKey != 'isDiscount') {
          if (field.apiFieldKey != 'workstream') {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            field.formValue = this.threadForm.get(field.apiFieldKey).value;
          }
          this.showAbleformFields.push(field);
        }
        let threadFormData: any = this.threadForm.value;
        this.showBirdValues = threadFormData.isDiscount;
        if (this.showBirdValues && (field.apiFieldKey == 'discountPrice' || field.apiFieldKey == 'discountPercentage')) {
          field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
          field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
          field.dateVal = this.threadForm.get(field.apiFieldKey).value;
          field.formValue = this.threadForm.get(field.apiFieldKey).value;
          this.showAbleformFields.push(field);
        }
      });
      const date1: any = this.startDate;
      const date2: any = this.endDate;
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      for (let index = 0; index <= diffDays; index++) {
        this.formFields[0]['step1'].forEach((field: any) => {
          if (field.apiFieldKey == 'inPersonDay'+index) {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            this.showAbleformFields.push(field);
          }
          if (field.apiFieldKey == 'inPersonStartTime'+index) {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            this.showAbleformFields.push(field);
          }
          if (field.apiFieldKey == 'inPersonEndTime'+index) {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            this.showAbleformFields.push(field);
          }
          if (field.apiFieldKey == 'inPersonTimeZone'+index) {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            this.showAbleformFields.push(field);
          }
          if (field.apiFieldKey == 'inPersonNotes'+index) {
            field.selectedValues = this.threadForm.get(field.apiFieldKey).value;
            field.selectedVal = this.threadForm.get(field.apiFieldKey).value;
            field.dateVal = this.threadForm.get(field.apiFieldKey).value;
            this.showAbleformFields.push(field);
          }
        });
      }
      setTimeout(() =>{
        if(getFieldsFlag) {
          this.step2Loading = true;
          this.threadApiData['step'] = 2;
          this.getThreadFields();
        }
      }, 100);
    } else {
      let upItems = Object.keys(this.uploadedItems);
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
    let scrollTop = errElement?.offsetTop;
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
    let contentType: any = 48;
    this.bodyElem.classList.add(this.bodyClass);
    let uploadCount = 0;
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
      this.uploadedItems.attachments.forEach(item => {
        if(item.accessType == 'media') {
          this.mediaUploadItems.push(item.fileId.toString());
        } else {
          uploadCount++;
        }
      });
    }

    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let threadFormData: any = new FormData();
    threadFormData.append('apiKey', this.apiKey);
    threadFormData.append('domainId', this.domainId);
    threadFormData.append('countryId', this.countryId);
    threadFormData.append('userId', this.userId);
    let timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    threadFormData.append('timeZoneMinutes', timezone_offset_minutes);
    threadFormData.append('mediaAttachments', JSON.stringify(this.mediaUploadItems));
    let groups = [], make = "";
    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
      for(let s of this.formFields[i][step]) {
        if(s.apiFieldKey != 'dtcToggle') {
          let formVal = s.formValue;
          if(formVal == 'undefined' || formVal == undefined) {
            formVal = (s.formatType == 1) ? '' : [];
          }
          formVal = (Array.isArray(s.formValue) && s.apiFieldKey != 'odometer') ? JSON.stringify(formVal) : formVal;
          if(this.industryType.id > 1 && s.apiFieldKey == 'odometer' && formVal != '') {
            formVal = this.commonApi.removeCommaNum(formVal);
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
          }
          if(s.displayFlag) {
            if (s.apiFieldKey.includes('inPersonDay') || s.apiFieldKey.includes('inPersonStartTime') || s.apiFieldKey.includes('inPersonEndTime') || s.apiFieldKey.includes('inPersonTimeZone') || s.apiFieldKey.includes('inPersonNotes')) {
              const date1: any = this.startDate;
              const date2: any = this.endDate;
              const diffTime = Math.abs(date2 - date1);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              for (let index = 0; index <= diffDays; index++) {
                if (s.apiFieldKey == 'inPersonDay'+index) {
                  threadFormData.append("inPersonTimeData["+index+"][day]", this.threadForm.get('inPersonDay'+index).value);
                }
                if (s.apiFieldKey == 'inPersonStartTime'+index) {
                  threadFormData.append("inPersonTimeData["+index+"][startTime]", moment(this.threadForm.get('inPersonStartTime'+index).value).format('YYYY-MM-DD HH:mm'));
                }
                if (s.apiFieldKey == 'inPersonEndTime'+index) {
                  threadFormData.append("inPersonTimeData["+index+"][endTime]", moment(this.threadForm.get('inPersonEndTime'+index).value).format('YYYY-MM-DD HH:mm'));
                }
                if (s.apiFieldKey == 'inPersonTimeZone'+index) {
                  threadFormData.append("inPersonTimeData["+index+"][timeZone]", this.threadForm.get('inPersonTimeZone'+index).value);
                }
                if (s.apiFieldKey == 'inPersonNotes'+index) {
                  threadFormData.append("inPersonTimeData["+index+"][notes]", this.threadForm.get('inPersonNotes'+index).value);
                }
              }
            } else {
              threadFormData.append(s.apiFieldKey, formVal);
            }
          }
        }
      }
    }
    threadFormData.append('updatedAttachments', JSON.stringify(this.pageInfo.updatedAttachments));
    threadFormData.append('deletedFileIds', JSON.stringify(this.pageInfo.deletedFileIds));
    threadFormData.append('removeFileIds', JSON.stringify(this.pageInfo.removeFileIds));
    if(Object.keys(this.audioUploadedItems).length > 0 && this.audioUploadedItems.items.length > 0) {
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

    let pushFormData = new FormData();
    pushFormData.append('apiKey', this.apiKey);
    pushFormData.append('domainId', this.domainId);
    pushFormData.append('countryId', this.countryId);
    pushFormData.append('userId', this.userId);
    pushFormData.append('contentTypeId', this.contentType);
    pushFormData.append('groups', JSON.stringify(groups));
    pushFormData.append('makeName', make);
    if(this.threadId > 0 && !this.duplicateMarketPlace) {
      let threadId:any = this.threadId;
      threadFormData.append('id', threadId);
      pushFormData.append('id', threadId);
      pushFormData.append('postId', this.threadInfo['postId']);
      if(this.pageInfo.attachmentItems && this.pageInfo.attachmentItems.length > 0) {
        this.pageInfo.attachmentItems.forEach(item => {
          if(item.fileId) {
            this.mediaUploadItems.push(item.fileId.toString());
          }
        });
      }
      threadFormData.set("mediaAttachments", JSON.stringify(this.mediaUploadItems));
      localStorage.removeItem('threadAttachments');
      setTimeout(() => {
        if (this.selectedMarketPlaceBanner) {
          let serverUrl = this.apiUrl.apifileUpload();
          let bannerFormData = new FormData();
          bannerFormData.append('user_id', this.userId);
          bannerFormData.append('domainId', this.domainId);
          bannerFormData.append('countryId', this.countryId);
          bannerFormData.append('businessProfile', this.businessProfileId);
          bannerFormData.append('file', this.selectedMarketPlaceBanner);
          bannerFormData.append('id', '');
          // this.httpClient.post<any>(serverUrl, bannerFormData).subscribe((res: any) => {
            // this.marketPlaceBannerImgUrlServer = res.profile_path;
            this.marketPlaceBannerImgUrlServer = this.selectedMarketPlaceBanner;
            threadFormData.append("serverBannerImgName", this.marketPlaceBannerImgUrlServer);
            this.threadApi.updateManual(threadFormData).subscribe((response) => {
              modalRef.dismiss('Cross click');
              this.bodyElem.classList.remove(this.bodyClass);
              this.successMsg = response.message;
              let msgFlag = true;
              if(response.status == "Success") {
                let res = response.data;
                let threadId = res;
                let postId = res;
                pushFormData.append('threadId', threadId);
                pushFormData.append('postId', postId);
                if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
                  msgFlag = false;
                  this.pageInfo.threadUpload = false;
                  this.pageInfo.contentType = contentType;
                  this.pageInfo.dataId = postId;
                  this.pageInfo.threadId = threadId;
                  this.pageInfo.navUrl = this.navUrl;
                  this.pageInfo.threadAction = 'edit';
                  this.pageInfo.manageAction = 'uploading';
                  this.pageInfo.uploadedItems = this.uploadedItems.items;
                  this.pageInfo.attachments = this.uploadedItems.attachments;
                  this.pageInfo.pushFormData = pushFormData;
                  this.pageInfo.message = this.successMsg;
                  let data = {
                    action: 'thread-submit',
                    pageInfo: this.pageInfo,
                    step1Submitted: this.step1Submitted,
                    step2Submitted: this.step2Submitted,
                    formGroup: this.threadForm
                  }
                  this.commonApi.emitDynamicFieldData(data);
                }
              }
              if(msgFlag) {
                const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
                msgModalRef.componentInstance.successMessage = this.successMsg;
                setTimeout(() => {
                  msgModalRef.dismiss('Cross click');
                  localStorage.removeItem('manualNav');
                  this.router.navigateByUrl('market-place/view-manual/'+ this.threadId);
                }, 2000);
              }
            });
          // }, (error: any) => {
          //   console.error(error);
          // });
        } else {
          threadFormData.append("serverBannerImgName", this.marketPlaceBannerImgUrlServer);
          this.threadApi.updateManual(threadFormData).subscribe((response) => {
            modalRef.dismiss('Cross click');
            this.bodyElem.classList.remove(this.bodyClass);
            this.successMsg = response.message;
            let msgFlag = true;
            if(response.status == "Success") {
              let res = response.data;
              let threadId = res;
              let postId = res;
              pushFormData.append('threadId', threadId);
              pushFormData.append('postId', postId);
              if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
                msgFlag = false;
                this.pageInfo.threadUpload = false;
                this.pageInfo.contentType = contentType;
                this.pageInfo.dataId = postId;
                this.pageInfo.threadId = threadId;
                this.pageInfo.navUrl = this.navUrl;
                this.pageInfo.threadAction = 'edit';
                this.pageInfo.manageAction = 'uploading';
                this.pageInfo.uploadedItems = this.uploadedItems.items;
                this.pageInfo.attachments = this.uploadedItems.attachments;
                this.pageInfo.pushFormData = pushFormData;
                this.pageInfo.message = this.successMsg;
                let data = {
                  action: 'thread-submit',
                  pageInfo: this.pageInfo,
                  step1Submitted: this.step1Submitted,
                  step2Submitted: this.step2Submitted,
                  formGroup: this.threadForm
                }
                this.commonApi.emitDynamicFieldData(data);
              }
            }
            if(msgFlag) {
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = this.successMsg;
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');
                localStorage.removeItem('manualNav');
                this.router.navigateByUrl('market-place/view-manual/'+ this.threadId);
              }, 2000);
            }
          });
        }
      }, 500);
    } else {
      setTimeout(() => {
        if (this.duplicateMarketPlace) {
          if(this.pageInfo.attachmentItems && this.pageInfo.attachmentItems.length > 0) {
            this.pageInfo.attachmentItems.forEach(item => {
              if(item.fileId) {
                this.mediaUploadItems.push(item.fileId.toString());
              }
            });
          }
          threadFormData.set("mediaAttachments", JSON.stringify(this.mediaUploadItems));
        }
        if (this.selectedMarketPlaceBanner) {
          let serverUrl = this.apiUrl.apifileUpload();
          let bannerFormData = new FormData();
          bannerFormData.append('user_id', this.userId);
          bannerFormData.append('domainId', this.domainId);
          bannerFormData.append('countryId', this.countryId);
          bannerFormData.append('businessProfile', this.businessProfileId);
          bannerFormData.append('file', this.selectedMarketPlaceBanner);
          bannerFormData.append('id', '');
          // this.httpClient.post<any>(serverUrl, bannerFormData).subscribe((res: any) => {
            // this.marketPlaceBannerImgUrlServer = res.profile_path;
            this.marketPlaceBannerImgUrlServer = this.selectedMarketPlaceBanner;
            threadFormData.append("serverBannerImgName", this.marketPlaceBannerImgUrlServer);
            this.threadApi.createMarketPlaceManual(threadFormData).subscribe((response) => {
              modalRef.dismiss('Cross click');
              this.bodyElem.classList.remove(this.bodyClass);
              this.successMsg = response.message;
              let trainingId = response.data;
              let msgFlag = true;
              if(response.status == "Success") {
                let res = response.data;
                let threadId = res;
                let postId = res;
                pushFormData.append('threadId', threadId);
                pushFormData.append('postId', postId);
                if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
                  msgFlag = false;
                  this.pageInfo.threadUpload = false;
                  this.pageInfo.contentType = contentType;
                  this.pageInfo.dataId = postId;
                  this.pageInfo.threadId = threadId;
                  this.pageInfo.navUrl = this.navUrl;
                  this.pageInfo.threadAction = (this.threadId > 0) ? 'edit' : 'new';
                  this.pageInfo.manageAction = 'uploading';
                  this.pageInfo.uploadedItems = this.uploadedItems.items;
                  this.pageInfo.attachments = this.uploadedItems.attachments;
                  this.pageInfo.pushFormData = pushFormData;
                  this.pageInfo.message = this.successMsg;
                  let data = {
                    action: 'thread-submit',
                    pageInfo: this.pageInfo,
                    step1Submitted: this.step1Submitted,
                    step2Submitted: this.step2Submitted,
                    formGroup: this.threadForm
                  }
                  this.commonApi.emitDynamicFieldData(data);
                }
              }
              if(msgFlag) {
                const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
                msgModalRef.componentInstance.successMessage = this.successMsg;
                setTimeout(() => {
                  msgModalRef.dismiss('Cross click');
                  localStorage.removeItem('manualNav');
                  let timeout = 50;
                  setTimeout(() => {
                    if (this.duplicateMarketPlace) {
                      this.router.navigateByUrl('market-place/manuals/');
                    } else {
                      window.close();
                    }
                  }, timeout);
                }, 2000);
              }
            });
          // }, (error: any) => {
          //   console.error(error);
          // });
        } else {
          threadFormData.append("serverBannerImgName: ", this.marketPlaceBannerImgUrlServer);
          this.threadApi.createMarketPlaceManual(threadFormData).subscribe((response) => {
            modalRef.dismiss('Cross click');
            this.bodyElem.classList.remove(this.bodyClass);
            this.successMsg = response.message;
            let trainingId = response.data;
            let msgFlag = true;
            if(response.status == "Success") {
              let res = response.data;
              let threadId = res;
              let postId = res;
              pushFormData.append('threadId', threadId);
              pushFormData.append('postId', postId);
              if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
                msgFlag = false;
                this.pageInfo.threadUpload = false;
                this.pageInfo.contentType = contentType;
                this.pageInfo.dataId = postId;
                this.pageInfo.threadId = threadId;
                this.pageInfo.navUrl = this.navUrl;
                this.pageInfo.threadAction = (this.threadId > 0) ? 'edit' : 'new';
                this.pageInfo.manageAction = 'uploading';
                this.pageInfo.uploadedItems = this.uploadedItems.items;
                this.pageInfo.attachments = this.uploadedItems.attachments;
                this.pageInfo.pushFormData = pushFormData;
                this.pageInfo.message = this.successMsg;
                let data = {
                  action: 'thread-submit',
                  pageInfo: this.pageInfo,
                  step1Submitted: this.step1Submitted,
                  step2Submitted: this.step2Submitted,
                  formGroup: this.threadForm
                }
                this.commonApi.emitDynamicFieldData(data);
              }
            }
            if(msgFlag) {
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = this.successMsg;
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');
                localStorage.removeItem('manualNav');
                let timeout = 50;
                setTimeout(() => {
                  if (this.duplicateMarketPlace) {
                    // this.router.navigateByUrl('market-place/view/'+trainingId);
                    this.router.navigateByUrl('market-place/manuals/');
                  } else {
                    window.close();
                  }
                }, timeout);
              }, 2000);
            }
          });
        }
      }, 500);
    }
  }

  // Close Current Window
  closeWindow() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if(!receivedService) {
        return;
      } else {
        if(this.threadId > 0) {
          this.router.navigateByUrl('market-place/view-manual/'+ this.threadId);
        } else {
          window.close();
        }
      }
    });
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
      if(document.getElementsByClassName('prob-header')) {
        let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
        //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
        this.innerHeight = (this.bodyHeight-(headerHeight+108));
      }
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

  updateFreePrice(event: any) {
    this.currentPaymentStatus = event;
    if (event) {
      this.threadForm.patchValue({
        price: '0',
        isDiscount: false,
      })
      this.threadForm.controls['price'].disable();
      this.threadForm.controls['isDiscount'].disable();
    } else {
      this.threadForm.patchValue({
        price: null,
        isDiscount: false,
      })
      this.threadForm.controls['price'].enable();
      this.threadForm.controls['isDiscount'].enable();
    }
    if (!this.stepBack) {
      this.updateIsBirdPriceValue(false);
    }
  }

  updateStartDateSteps(event: any) {
    if (this.endDate < event) {
      this.threadForm.patchValue({
        startDate: ''
      })
      this.startDate = '';
      this.showStartDateValidation = true;
    } else {
      this.startDate = event;
      if (!this.endDate) {
        this.threadForm.patchValue({
          endDate: event
        })
        this.endDate = event;
      }
      this.showStartDateValidation = false;
    }
    this.resetStartEndDate = true;
  }

  updateNormalStartTimeSteps(event: any) {
    this.startTime = event;
    let normalEndTime: any = moment(event).add(1, 'hours').format();
    this.threadForm.patchValue({
      endTime: new Date(normalEndTime)
    })
    this.endTime = new Date(normalEndTime);
  }

  updateNormalEndTimeSteps(event: any) {
    this.endTime = event;
  }

  pushInarray() {
    let inPersonIndex: any = this.sectionsArray.findIndex((item: any) => {
      return item.stepsName.includes('In-person time select');
    });
    this.sectionsArray = this.sectionsArray.filter((item: any) => {
      return !item.stepsName.includes('In-person time select');
    });
    // let inPersonData = JSON.parse(JSON.stringify(this.inPersonTimeSelect));
    // for(let i = 6; i >= 0; i--) {
    //   let pushedInPersonData = JSON.parse(JSON.stringify(inPersonData));
    //   pushedInPersonData.stepsName = 'In-person time select ' + i;
    //   pushedInPersonData.newSectionClass = 'hide';
    //   if (i === 0) {
    //     pushedInPersonData.name = 'Days & Time';
    //   } else {
    //     pushedInPersonData.name = '';
    //   }
    //   pushedInPersonData?.cells?.name?.forEach((inPerson: any, index: any) => {
    //     inPerson.apiFieldKey = inPerson.apiFieldKey + i;
    //     inPerson.fieldName = inPerson.fieldName + i;
    //     inPerson.disabled = inPerson.apiFieldKey.includes('inPersonDay') ? true : false;
    //     inPerson.selectedValues = inPerson.selectedVal;
    //     inPerson.selectedVal = inPerson.selectedVal;
    //     inPerson.selectedValueIds = inPerson.selectedValueIds;
    //     inPerson.newCustomLabel = '';
    //     inPerson.newCustomClass = '';
    //     inPerson.valid = inPerson.apiFieldKey.includes('inPersonDay') ? true : false;
    //   });
    //   this.sectionsArray.join();
    //   this.sectionsArray.splice(inPersonIndex, 0, pushedInPersonData);
    //   this.sectionsArray.join();
    // }
  }

  removeFormControl(control: any) {
    if (this.threadForm.contains(control)) {
      this.threadForm.removeControl(control);
    }
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }

  updateTimeZoneSteps (event: any) {
    for(let i = 0; i < 7; i++) {
      let setTimeZoneValue = {}
      setTimeZoneValue['inPersonTimeZone'+i] = event;
      this.threadForm.patchValue(setTimeZoneValue);
    }
  }
  updateStartTimeSteps (event: any) {
    if (!this.firstTimeSetStart && !this.threadId) {
      for(let i = 0; i < 7; i++) {
        let setTimeZoneValue = {}
        setTimeZoneValue['inPersonStartTime'+i] = event;
        this.threadForm.patchValue(setTimeZoneValue);
      }
      this.firstTimeSetStart = this.firstTimeSetStart + 1;
    }
  }
  updateEndTimeSteps (event: any) {
    if (!this.firstTimeSetEnd && !this.threadId) {
      for(let i = 0; i < 7; i++) {
        let setTimeZoneValue = {}
        setTimeZoneValue['inPersonEndTime'+i] = event;
        this.threadForm.patchValue(setTimeZoneValue);
      }
      this.firstTimeSetEnd = this.firstTimeSetEnd + 1;
    }
  }
  updateInpersonStartTimeSteps (event: any) {
    let setTimeZoneValue = {}
    let text = event.name;
    const spiltArray = text.split("inPersonStartTime");
    let updatedTime = moment(event.value).add(1, 'hours').format();
    setTimeZoneValue["inPersonEndTime"+spiltArray[1]] = new Date(updatedTime);
    this.threadForm.patchValue(setTimeZoneValue);
  }
  updateFileData(event: any) {
    this.marketPlaceimgUrl = event.imgUrl;
    this.marketPlaceimgName = event.imgName;
    this.selectedMarketPlaceBanner = event.selectFile;
    if (event.type == 'Delete') {
      this.marketPlaceBannerImgUrlServer = null;
      this.selectedMarketPlaceBanner = "";
    }
  }

  ngOnDestroy() {
    if(this.threadId > 0) {
      localStorage.removeItem('threadAttachments');
    }
    this.subscription.unsubscribe();
  }
  updateIsBirdPriceValue(event: any) {
    this.showBirdValues = event;
    if (event) {
      this.apiFormFields[this.stepIndex][this.stepTxt].map((form: any) => {
        form?.cells?.name?.map((field: any) => {
          if (field.apiFieldKey == 'discountPrice') {
            field.fieldClass = 'discountPrice col-md-6 show'
          }
          if (field.apiFieldKey == 'discountPercentage') {
            field.fieldClass = 'discountPercentage col-md-6 show'
          }
        })
      });
    } else {
      this.apiFormFields[this.stepIndex][this.stepTxt].map((form: any) => {
        form?.cells?.name?.map((field: any) => {
          if (field.apiFieldKey == 'discountPrice') {
            field.fieldClass = 'discountPrice col-md-6'
          }
          if (field.apiFieldKey == 'discountPercentage') {
            field.fieldClass = 'discountPercentage col-md-6'
          }
        })
      });
      if (!this.stepBack) {
        this.discountPercentage = '';
        this.discountPrice = '';
      }
    }
  }

  updateRegularPrice(event: any) {
    this.updateBirdPriceValue(this.discountPrice);
    if (event) {
      this.threadForm.controls['discountPrice'].enable();
      this.threadForm.controls['discountPercentage'].enable();
    }
  }

  birdPriceFocus(event: any) {
    this.settingPrice = event
  }

  birdPercentageFocus(event: any) {
    this.settingPercent = event
  }

  updateBirdPriceValue(event: any){
    let price = this.threadForm.get('price').value;
    this.showPriceError = false;
    if (!price) {
      this.threadForm.controls['discountPrice'].disable();
      this.threadForm.controls['discountPercentage'].disable();
      return
    }
    if (event && price) {
      let val: any = parseFloat(event);
      let priceFloat: any = parseFloat(price);
      if (val < priceFloat && !this.isNegative(val) && val != '0') {
        if(this.settingPercent) return;
        let perc: any = (val*100)/priceFloat;
        let percFloat: any = 100 - parseFloat(perc);
        this.discountPrice = event;
        this.discountPercentage = Math.round(percFloat);
        this.showBirdPriceValidation = false;
        this.showBirdPercentageValidation = false;
      } else {
        this.discountPercentage = '';
        this.discountPrice = '';
        this.showBirdPriceValidation = true;
        this.showBirdPercentageValidation = true;
      }
    } else {
      this.discountPercentage = '';
      this.discountPrice = '';
    }
  }

  updateBirdPercentageValue(event: any) {
    let price = this.threadForm.get('price').value;
    this.showPriceError = false;
    if (!price) {
      this.threadForm.controls['discountPrice'].disable();
      this.threadForm.controls['discountPercentage'].disable();
      return
    }
    if (event && price) {
      let perc: any = parseFloat(event);
      let originalPerc: any = 100 - parseFloat(perc);
      let priceFloat: any = parseFloat(price);
      if (perc < 100 && !this.isNegative(originalPerc) && perc != '0') {
        if(this.settingPrice) return;
        this.discountPercentage = event;
        let val: any = (parseFloat(priceFloat) * parseFloat(originalPerc))/100;
        let valFloat = parseFloat(val).toFixed(0);
        this.discountPrice = valFloat;
        this.showBirdPriceValidation = false;
        this.showBirdPercentageValidation = false;
      } else {
        this.discountPercentage = '';
        this.discountPrice = '';
        this.showBirdPriceValidation = true;
        this.showBirdPercentageValidation = true;
      }
    } else {
      this.discountPercentage = '';
      this.discountPrice = '';
    }
  }
  isNegative(num) {
    if (Math.sign(num) === -1) {
      return true;
    }
    return false;
  }

  getForTrainingOnly(val){
    this.forTrainingOnly = val;
  }

  scrollBarEvent(ev) {
  if (ev == 'open') {
    this.disablePerfectScroll = false;
    this.sconfig = {};
  }
  if (ev == 'close') {
    this.disablePerfectScroll = true;
    this.sconfig = { handlers: [] };
  }
}

updateTrainingFromListEvent(event){
  //  setTimeout(() => {
     this.ismanualFromList = event; 
  //  }, 500);
  }

  sameNameValidator(event) {
    this.sameName[event.fieldName] = event.value
  }
}
