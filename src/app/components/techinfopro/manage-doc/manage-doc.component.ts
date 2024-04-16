import { Component, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant,IsOpenNewTab,pageTitle,windowHeight,RedirectionPage } from 'src/app/common/constant/constant';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { BaseService } from 'src/app/modules/base/base.service';
@Component({
  selector: 'app-manage-doc',
  templateUrl: './manage-doc.component.html',
  styleUrls: ['./manage-doc.component.scss']
})
export class ManageDocComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  subscription: Subscription = new Subscription();
  public threadTxt: string = '';
  public title:string = '';
  public teamSystem = localStorage.getItem('teamSystem');
  public bodyElem;
  public footerElem;
  public bodyClass: string = "submit-loader";
  public bodyClass1: string = "thread-detail";
  public secElement: any;
  public scrollPos: any = 0;

  public platformId: number = 0;
  public apiKey: string;
  public countryId;
  public domainId;
  public userId;
  public user: any;
  public docId: number = 0;
  public mfgId: any = 0;
  public makeId: any = 0;
  public threadInfo: any = [];
  public contentType: any = 4;

  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public docApiData: object;
  public navUrl: string = "documents";
  public manageAction: string = "new";
  public pageAccess: string = "manageDoc";
  public threadType: string = 'document';
  public docType: number = 1;
  public approvalEnableDomainFlag: boolean = false;
  public approveProcessFlag: boolean = false;
  public saveText: string = "";
  public platform: number = 3;
  public step1Title: string = "";
  public step2Title: string = "";
  public apiFormFields: any = [{'step1': []}, {'step2': []}];
  public formFields: any = [{'step1': []}, {'step2': []}];
  public successMsg: string = "";
  public uploadedItems: any = [];
  public mediaUploadItems: any = [];
  public stepIndex: number;
  public stepTxt: string;
  public optionTxt: string = "Options";
  public docTypeList = [{
    id: 1,
    type: 'attach',
    title: 'Attach or Upload Document(s)'
  },{
    id: 3,
    type: 'bulk-upload',
    title: 'Bulk Upload Documents'
  }];

  docForm: FormGroup;
  public pageInfo: any = [];
  public apiInfo: any = [];
  public baseApiUrl: string = "";
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];

  public makeInterval: any;
  public loading: boolean = true;
  public step1Loading: boolean = true;
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
  public sendNotificationFlag: boolean = false;
  public sendNotificationToggle: boolean = true;
  public sendAdminApprovalNotificationFlag: boolean = false;
  public publishSubmitAction: boolean = true;
  public TVSIBDomain: boolean = true;
  public collabticDomain: boolean = false;
  public documentStatusId: string = '';
  public contributerId: string = '';
  public draftButtonEnable: boolean = false;

  public bannerImage: string = "";
  public defaultBannerImage: string = "";
  public defaultBanner: boolean = false;
  public bannerImageDefault: boolean = true;
  public bannerFile: any = [];

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
    private baseSerivce: BaseService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.apiKey = Constant.ApiKey;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.TVSIBDomain =  (this.domainId == '97') ? true : false;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let docId = this.route.snapshot.params['id'];
    this.docId = (docId == 'undefined' || docId == undefined) ? this.docId : docId;
    let docType = (this.docId > 0) ? 'attach' : this.route.snapshot.params['access'];
    this.manageAction = (this.docId == 0) ? 'new' : 'edit';
    let docIndex = this.docTypeList.findIndex(option => option.type == docType);
    console.log(docType, docIndex)
    this.threadTxt = (this.docId > 0) ? 'Tech Info' : this.docTypeList[docIndex].title;
    this.threadTxt = (this.docId > 0) ? `${this.threadTxt}` : this.threadTxt;
    this.docType = this.docTypeList[docIndex].id;
    this.pageInfo.manageAction = this.manageAction;
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.collabticDomain = this.platformId == 1 ? true : false;

    // enable domain based
    this.approvalEnableDomainFlag = localStorage.getItem('documentApproval') == '1' ? true : false;
    this.approveProcessFlag = localStorage.getItem('approveProcessEnabled') == '1' ? true : false;

    let navUrl = localStorage.getItem('docNav');
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'documents' : navUrl;
    this.navUrl = navUrl;
    setTimeout(() => {
      localStorage.removeItem('docNav');
    }, 500);

    this.title = this.threadTxt;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);

    let headTitleText = this.threadTxt;
    this.headerData = {
      title: headTitleText,
      action: this.manageAction,
      id: this.docId
    };

    let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      let yr = y.toString();
      this.years.push({
        id: yr,
        name: yr
      });
    }

    this.docForm = this.formBuilder.group({});
    this.docApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      step: 1,
      threadCategoryId: 2,
      threadType: this.threadType,
      docType: this.docType,
      threadId: this.docId,
      platform: this.platform,
      apiType: 2,
      makeName: '',
      modelName: '',
      yearValue: '',
      productType: '',
      version: 3
    };

    this.pageInfo = {
      access: 'documents',
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
      bannerFile: this.bannerFile,
      bannerImage: this.bannerImage,
      defaultBanner: this.defaultBanner,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };

    setTimeout(() => {
      this.setScreenHeight();
      this.loading = false;
      this.step1Loading = true;

      if(this.docId > 0) {
        localStorage.removeItem('docAttachments');
      }
      // Get Thread Fields
      this.getDocFields();
    }, 200);

    this.subscription.add(
      this.commonApi.dynamicFieldDataResponseSubject.subscribe((response) => {
        console.log(response);
        if(response['type'] == 'updated-attachments') {
          console.log(response)
          if(response['action'] == 'media') {
            this.pageInfo.deletedFileIds = response['deletedFileIds'];
            this.pageInfo.removeFileIds = response['removeFileIds'];
          } else {
            this.pageInfo.updatedAttachments = response['updatedAttachments'];
            this.pageInfo.deletedFileIds = response['deletedFileIds'];
            this.pageInfo.removeFileIds = response['removeFileIds'];
            let uploadedItems = response['uploadedItems'];
            if(uploadedItems != undefined || uploadedItems != 'undefined') {
              this.uploadedItems = uploadedItems;
            }
          }
        } else if(response['type'] == 'banner') {
          console.log(response)
          this.bannerFile = response['bannerFile'];
          this.bannerImage = response['bannerImage'];
          this.defaultBanner = response['defaultBanner'];
          this.pageInfo.bannerImage = this.bannerImage;
          this.pageInfo.bannerFile = this.bannerFile;
          this.pageInfo.defaultBanner = this.defaultBanner;
        } else {
          let apiInfo = {
            apiKey: this.apiKey,
            domainId: this.domainId,
            countryId: this.countryId,
            userId: this.userId
          };
          let stepTxt = response['step'];
          let stepIndex = response['stepIndex']
          let secIndex = response['sectionIndex'];
          let fieldSec = response['fieldSec'];
          let fieldIndex = response['fieldIndex'];
          let fieldData = response['fieldData'];
          let field = this.apiFormFields[stepIndex][stepTxt][secIndex];
          let fieldName = fieldData.fieldName;
          let apiFieldKey = fieldData.apiFieldKey;
          this.docForm = response['formGroup'];
          field['cells'][fieldSec][fieldIndex] = fieldData;
          this.formFields = response['formFields'];
          let fd;
          let action = 'trigger';
          let makeFieldName = 'make';
          let modelFieldName = 'model';
          let ptFieldName = 'SelectProductType';
          let mfFieldName = 'manufacturer';
          let makeFieldIndex, modelFieldIndex, ptFieldIndex, manufacturerFieldIndex, mkIndex, mindex, ptindex, mfindex, mf;

          switch (fieldName) {
            case 'workstreams':
              mkIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == makeFieldName);
              mindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == modelFieldName);
              ptindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == ptFieldName);
              let findex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == 'make');
              secIndex = this.formFields[stepIndex][stepTxt][findex].sec;
              field = this.apiFormFields[stepIndex][stepTxt][secIndex];
              makeFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === makeFieldName);
              modelFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === modelFieldName);
              ptFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === ptFieldName);
              let cf = field['cells']['name'][makeFieldIndex];
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = false;
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].disabled = (ptFieldIndex >= 0) ? false : true;
              mfindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == mfFieldName);
              if(mfindex >= 0) {
                manufacturerFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === mfFieldName);
              }
              let mfieldData;
              //console.log(fieldData.selectedValueIds)
              if(fieldData.selectedValueIds.length > 0) {
                if(mfindex >= 0) {
                  let mfapiInfo = {
                    apiKey: this.apiKey,
                    domainId: this.domainId,
                    countryId: this.countryId,
                    userId: this.userId
                  };
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].disabled = false;
                  mf = field['cells']['name'][manufacturerFieldIndex];
                  mf.disabled = true;
                  mf.loading = mf.disabled;
                  let mfextraField = {
                    stepTxt: stepTxt,
                    stepIndex: stepIndex,
                    secIndex: secIndex,
                    fieldSec: fieldSec,
                    fieldIndex: fieldIndex,
                    f: mf,
                    field: field,
                    fieldName: fieldName
                  }
                  let mfapiData = mfapiInfo;
                  let mfapiName = mf.apiName;
                  let mfquery = JSON.parse(mf.queryValues);
                  console.log(mf, mfquery)
                  mfieldData = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex];
                  mfapiData[mfquery[0]] = mfieldData.selectedValueIds;
                  this.getData(action, secIndex, mf, mfapiName, mfapiData, mfextraField);
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].valid = true;
                  this.formFields[this.stepIndex][this.stepTxt][mfindex].valid = true;
                }

                let apiData = apiInfo;
                let apiName = cf.apiName;
                let query = JSON.parse(cf.queryValues);
                apiData[query[0]] = JSON.stringify(fieldData.selectedValueIds);
                if(mfindex >= 0) {
                  apiData[query[1]] = JSON.stringify(mfieldData.selectedValueIds);
                }
                console.log(cf, query, apiData)
                cf.disabled = true;
                cf.loading = cf.disabled;
                let extraField = {
                  stepTxt: stepTxt,
                  stepIndex: stepIndex,
                  secIndex: secIndex,
                  fieldSec: fieldSec,
                  fieldIndex: fieldIndex,
                  f: cf,
                  field: field,
                  fieldName: fieldName
                };
                console.log(extraField)
                setTimeout(() => {
                  // Get field data
                  this.getData(action, secIndex, cf, apiName, apiData, extraField);
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].valid = true;
                  this.formFields[this.stepIndex][this.stepTxt][mkIndex].valid = true;
                  console.log(this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled)
                }, 100);
              } else {
                cf.recentSelectionValue = [];
                cf.recentShow = false;
                cf.itemValues = [];
                this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, cf, field, fieldName);
                let formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].apiValueType;
                let item = (formatType == 1) ? "" : [];
                if(mfindex >= 0) {
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].disabled = true;
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].selectedValueIds = item;
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].selectedValues = item;
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].selectedVal = item;
                  this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][manufacturerFieldIndex].valid = false;
                }
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = true;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].selectedValueIds = item;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].selectedValues = item;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].selectedVal = item;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].valid = false;
                //this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = true;

                apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].apiFieldKey;
                this.formFields[this.stepIndex][this.stepTxt][mkIndex].formValue = item;
                this.formFields[this.stepIndex][this.stepTxt][mkIndex].formValueIds = item;
                this.formFields[this.stepIndex][this.stepTxt][mkIndex].formValueItems = item;
                this.formFields[this.stepIndex][this.stepTxt][mkIndex].valid = false;
                this.docForm.value[apiFieldKey] = item;

                formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].apiValueType;
                item = (formatType == 1) ? "" : [];
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedValueIds = item;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedValues = item;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].selectedVal = item;
                //this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].valid = true;
                apiFieldKey = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].apiFieldKey;

                this.formFields[this.stepIndex][this.stepTxt][mindex].formValue = item;
                this.formFields[this.stepIndex][this.stepTxt][mindex].formValueIds = item;
                this.formFields[this.stepIndex][this.stepTxt][mindex].formValueItems = item;
                //this.formFields[this.stepIndex][this.stepTxt][mindex].valid = false;
                this.docForm.value[apiFieldKey] = item;

                /*fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
                fd.optFieldsFlag = false;
                fd.optDisableFlag = true;
                fd.toggleTxt = 'Show';
                this.setupFieldData('AdditionalModelInfo', stepIndex, stepTxt, fieldSec);*/
              }
              break;
            case 'threadType':
              this.threadType = fieldData.selectedVal;
              this.docApiData['threadType'] = this.threadType;
              break;
            case 'make':
            case 'manufacturer':
              /*this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, fieldData, field, fieldName);
              fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
              fd.optFieldsFlag = false;
              fd.optDisableFlag = true;
              fd.toggleTxt = 'Show';*/
              console.log(fieldData)
              fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
              let chkFieldName = (fieldName == 'make') ? mfFieldName : makeFieldName;
              let currFieldName = (fieldName == 'make') ? makeFieldName : mfFieldName;
              let currFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === currFieldName);
              let currVal = fieldData.selectedVal;
              let chkFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === chkFieldName);
              let chkVal = (chkFieldIndex >= 0) ? fd['cells'][fieldSec][chkFieldIndex].selectedVal : '';
              let apiFlag = (chkVal == '' || (fieldName == 'make')) ? true : false;
              console.log('Current Value', currVal)
              console.log('Check Value', chkVal)
              console.log('Check Value Items', fd['cells'][fieldSec][currFieldIndex].itemValues)

              let chkItemIndex = fd['cells'][fieldSec][currFieldIndex].itemValues.findIndex(option => option.relName == chkVal);
              console.log(chkItemIndex)
              if(chkItemIndex < 0) {
                apiFlag = true;
              }
              //let apiFlag = (chkVal == '' || (fieldName == 'manufacturer' && chkVal == '')) ? true : false;
              if(chkFieldIndex >= 0 && apiFlag) {
                let chkfindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == chkFieldName);
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkFieldIndex].disabled = false;
                if(fieldName != 'make') {
                  //this.setupFieldData(chkFieldName, stepIndex, stepTxt, fieldSec);
                }
                mf = field['cells']['name'][chkFieldIndex];
                mf.disabled = true;
                //mf.loading = mf.disabled;
                let mfextraField = {
                  stepTxt: stepTxt,
                  stepIndex: stepIndex,
                  secIndex: secIndex,
                  fieldSec: fieldSec,
                  fieldIndex: fieldIndex,
                  f: mf,
                  field: field,
                  fieldName: fieldName
                }
                let mfapiData = apiInfo;
                let mfapiName = mf.apiName;
                let mfquery = JSON.parse(mf.queryValues);
                console.log(mf, mfquery)
                if(fieldName == 'make') {
                  mfapiData[mfquery[0]] = fieldData.selectedVal;
                } else {
                  let wschkFieldName = 'workstreams';
                  let wsFieldIndex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == wschkFieldName);
                  let wsVal = this.formFields[this.stepIndex][this.stepTxt][wsFieldIndex].formValue;

                  mfapiData[mfquery[0]] = JSON.stringify(wsVal);
                  mfapiData[mfquery[1]] = JSON.stringify([fieldData.selectedValues]);
                }
                this.getData(action, secIndex, mf, mfapiName, mfapiData, mfextraField);
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][chkFieldIndex].valid = true;
                this.formFields[this.stepIndex][this.stepTxt][chkfindex].valid = true;
              }
              modelFieldIndex = fd['cells']['name'].findIndex(option => option.fieldName === modelFieldName);
              this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].disabled = false;
              this.setupFieldData('model', stepIndex, stepTxt, fieldSec);
              break;
            case 'model':
              break;
            case 'dtcToggle':
              this.setupFieldData('errorCode', stepIndex, stepTxt, fieldSec);
              break;
            case 'uploadContents':
              console.log(this.docType)
              this.uploadedItems = response['uploadedItems'];
              let fieldItem = this.formFields[stepIndex][stepTxt];
              let upItems = Object.keys(this.uploadedItems);
              if(this.docType == 1) {
                let dindex = fieldItem.findIndex(option => option.fieldName == 'content');
                secIndex = fieldItem[dindex].sec;
                field = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells']['name'][0];
                console.log(field.selectedVal, upItems.length, this.uploadedItems.items.length)
                let fvalid = ((field.selectedVal != 'undefined' || field.selectedVal != undefined) && field.selectedVal != '' || (upItems.length > 0 && this.uploadedItems.items.length > 0)) ? true : false;
                console.log(fvalid)
                field.valid = fvalid;
                fieldItem[dindex].valid = fvalid;
              } else {
                let findex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == fieldName);
                let valid = (upItems.length > 0 && this.uploadedItems.items.length > 0) ? true : false;
                fieldData.valid = valid;
                this.formFields[stepIndex][stepTxt][findex].valid = valid;
              }
              break;
          }
        }

        //console.log(this.docForm)
        //console.log(this.apiFormFields)
        //console.log(this.formFields)
      })
    );
  }

  setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, fieldData, field, fieldName) {
    console.log(fieldData.selectedVal)
    let optItems:any = [];
    if(fieldName == 'make' || fieldName == 'model') {
      field.optDisableFlag = true;
      field.optFieldsFlag = false;
      field.optDisableFlag = (fieldName == 'model' && fieldData.selectedVal.length > 0) ? false : field.optDisableFlag;
      if(fieldName == 'model') {
        optItems = (fieldData.selectedVal.length != "") ? field['cells'][fieldSec][fieldIndex].itemValues : [];
      }

      for(let opt of field['cells']['optionFilter']) {
        let optField = opt.fieldName;
        let findex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName === optField);
        let optValItems = this.formFields[stepIndex][stepTxt][findex];
        switch(optField) {
          case 'SelectCategory':
            opt.itemValues = (fieldName == 'model') ? optItems.catg : [];
            // Setup Selecte Values
            this.setupValues(opt, optValItems, opt.itemValues);
            break;

          case 'SelectSubCategory':
            opt.itemValues = (fieldName == 'model') ? optItems.subCatg : [];
            // Setup Selecte Values
            this.setupValues(opt, optValItems, opt.itemValues);
            break;

          case 'SelectProductType':
            opt.itemValues = (fieldName == 'model') ? optItems.prodType : [];
            // Setup Selecte Values
            this.setupValues(opt, optValItems, opt.itemValues);
            break;

          case 'SelectRegion':
            opt.itemValues = (fieldName == 'model') ? optItems.regions : [];
            // Setup Selecte Values
            this.setupValues(opt, optValItems, opt.itemValues);
            break;
        }
      }
    }
  }

  // Setup Selecte Values
  setupValues(opt, optVal, items) {
    console.log(items)
    let optApiFieldKey = opt.apiFieldKey;
    let formatAttr = opt.apiFieldType;
    let formatType = opt.apiValueType;
    let formVal, formValItem;
    let id = [];
    let name = [];
    items = (items == 'undefined' || items == undefined) ? [] : items;
    for(let i of items) {
      id.push(i.id);
      name.push(i.name);
    }

    if(optApiFieldKey == 'manufacturer' && items.length == 1){
      opt.selectedValueIds = id.toString();
      opt.selectedValues = id.toString();
      opt.selectedVal = name.toString();
      formVal = name.toString();
      this.docForm.value[optApiFieldKey] = formVal;
      setTimeout(() => {
        let findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == optApiFieldKey);
        this.formFields[this.stepIndex][this.stepTxt][findex].formValue = formVal;
        this.formFields[this.stepIndex][this.stepTxt][findex].formValueIds = id;
        this.formFields[this.stepIndex][this.stepTxt][findex].formValueItems = name;
        this.formFields[this.stepIndex][this.stepTxt][findex].valid = true;
      }, 1);

    }
    else{
      opt.selectedValueIds = id;
      opt.selectedValues = name;
      opt.selectedVal = name;
      formVal = (formatAttr == 1) ? id : name;
      optVal.formValue = formVal;
      optVal.formValueIds = id;
      optVal.formValueItems = name;
      this.docForm.value[optApiFieldKey] = formVal;
    }
  }

  // Empty Field Info
  setupFieldData(fieldName, stepIndex, stepTxt, fieldSec) {
    let formField = this.formFields[stepIndex][stepTxt];
    console.log(fieldName)
    let addInfo = formField.findIndex(option => option.fieldName == fieldName);
    formField = formField[addInfo];
    let fsec = formField.sec;
    let fi = formField.findex;
    let apiField = this.apiFormFields[stepIndex][stepTxt][fsec]['cells'][fieldSec][fi];
    let formatType = apiField.apiValueType;
    let item = (formatType == 1) ? "" : [];

    apiField.selectedValueIds = item;
    apiField.selectedValues = item;
    apiField.selectedVal = item;
    let apiFieldKey = apiField.apiFieldKey;

    formField.formValue = item;
    formField.formValueIds = item;
    formField.formValueItems = item;
    this.docForm.value[apiFieldKey] = item;
  }

  // Get Document Fields
  getDocFields() {
    let step = this.docApiData['step'];
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    this.threadApi.apiGetThreadFields(this.docApiData).subscribe((response) => {
      console.log(response);
      if(this.approvalEnableDomainFlag){
        if(this.docId > 0){
          this.documentStatusId = response.threadInfo[0].documentStatusId;
          this.contributerId  = response.threadInfo[0].contributerId;
          this.saveText = !this.approveProcessFlag ? "Publish" : "Submit";
          if(this.documentStatusId == '6'){
            this.draftButtonEnable = true;
          }
          else{
            this.draftButtonEnable = false;
          }
        }
        else{
          this.draftButtonEnable = true;
          this.saveText = !this.approveProcessFlag ? "Publish" : "Submit";
        }
      }
      else{
        this.saveText = "Publish";
      }
      let configInfo = response.configInfo;
      let sections = configInfo.sections;
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      let i = 0;
      this.threadInfo = (this.docId > 0) ? response.threadInfo[0] : this.threadInfo;
      let action = 'onload';
      let step2FormField = this.formFields[this.stepIndex][this.stepTxt];
      let step2ApiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][0];
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
          let apiInfo = {
            apiKey: this.apiKey,
            domainId: this.domainId,
            countryId: this.countryId,
            userId: this.userId
          };
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
              fc.selectedValues = (fc.apiValueType == 1) ? "" : [];
              fc.selectedVal = (fc.apiValueType == 1) ? "" : [];
              val = (fc.apiValueType == 1) ? "" : [];



              if(this.docId > 0) {
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
                fc.selectedValueIds = (this.docId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].id : fc.selectedValueIds;
                fc.selectedValues = (this.docId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedValues;
                fc.selectedVal = (this.docId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedVal;
                fc.valid = (fc.fieldName == 'miles' && !fc.valid) ? true : fc.valid;
                val = fc.selectedVal;
              }

              //console.log(i, fc.fieldName, fc.apiFieldKey, fc.apiFieldType, val);
              this.docForm.addControl(fc.apiFieldKey, new FormControl(val));
              let flag = (fc.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, fc.apiName);

              //console.log(fc.fieldName, fc.selectedValues)
              if(this.docId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
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
            if(f.fieldType == 'slider' && this.docId == 0) {
              let sliderVal = f.minValue;
              f.selectedValueIds = sliderVal;
              f.selectedValues = sliderVal;
              f.selectedVal = sliderVal;
              f.showTicks = true;
            }

            if(this.docId == 0){
              if(f.fieldName == 'notificationToggle'){
                formVal = (f.selection == 'off') ? false: true;
                val = formVal;
              }
            }

            if(this.docId > 0 || f.fieldName == 'countries' || (this.docId == 0 && f.fieldName == 'workstreams' && f.autoselection == 1)) {
              f.recentShow = false;
              let threadVal;
              if(this.docId > 0) {
                threadVal = this.threadInfo[f.threadInfoApiKey];
                if(f.fieldType == 'banner') {
                  console.log(threadVal)
                  let bannerInfo = threadVal;
                  this.defaultBanner = (bannerInfo != '') ? false : true;
                  this.bannerImage = threadVal;
                  this.pageInfo.bannerImage = this.bannerImage;
                  this.pageInfo.defaultBanner = this.defaultBanner;
                }
              } else {
                threadVal = f.workstreamValues;
              }

              if(f.fieldName == 'threadType') {
                this.threadType = threadVal;
                this.docApiData['threadType'] = threadVal;
              }

              if(f.selection == 'multiple') {
                console.log(f.fieldName, threadVal)
                let id = [];
                let name = [];
                f.selectedIds = threadVal;

                if(f.fieldName == 'AdditionalModelInfo' && threadVal.length > 0) {
                  let trimItems = [];
                  for(let tr of JSON.parse(threadVal)) {
                    trimItems.push({
                      id: tr,
                      name: tr
                    });
                  }
                  f.selectedIds = trimItems;
                }

                if(f.fieldName == 'countries') {
                  if(threadVal == 'undefined' || threadVal == undefined || threadVal == ''){
                    let val = [];
                    let countryAll = localStorage.getItem("allCountryAccess") == "1" ? "1" : "0";
                    if(countryAll == "1"){
                      val.push({
                        id: '0',
                        name: 'All'
                      })
                    }
                    else{
                      val.push({
                        id: localStorage.getItem('countryId'),
                        name: localStorage.getItem('countryName')
                      })
                    }
                    threadVal = val;
                    f.selectedIds = threadVal;
                    f.selectedVal = name;
                  }
                }

                for(let item of f.selectedIds) {
                  id.push(item.id);
                  name.push(item.name);
                }
                if(f.fieldName == 'workstreams') {
                  f.selectedVal = name;
                }

                f.selectedIds = threadVal;
                f.selectedValueIds = id;
                f.selectedValues = name;
                f.selectedValue = name;
                val = threadVal;
                formVal = (f.apiFieldType == 1) ? id : name;
                formValueIds = id;
                formValueItems = name;
                //console.log(f.fieldName, threadVal.length)
                if(f.fieldName == 'uploadContents') {
                  if(this.docId > 0) {
                    let uploadContents = this.threadInfo[f.threadInfoApiKey];
                    localStorage.setItem('docAttachments', JSON.stringify(uploadContents));
                  }
                  this.pageInfo.attachmentItems = threadVal;
                  if(this.pageInfo.attachmentItems.length>0){
                    for (let att in this.pageInfo.attachmentItems) {
                      let fileCaption = (this.pageInfo.attachmentItems[att].fileCaption == 'undefined' || this.pageInfo.attachmentItems[att].fileCaption == undefined) ? '' : this.pageInfo.attachmentItems[att].fileCaption;
                      this.pageInfo.attachmentItems[att].fileCaption = fileCaption
                    }
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
                console.log(f.fieldName);
                switch(f.fieldName) {
                  case 'threadType':
                    this.threadType = threadVal;
                    this.docApiData['threadType'] = this.threadType;
                    break;
                  case 'dtcToggle':
                    f.selection = threadVal;
                    break;
                  case 'notificationToggle':
                  case 'mustReadToggle':
                    formVal = threadVal == '1' ? true: false;
                    f.selection = formVal;
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
                console.log(formVal)
              }

              console.log(f.fieldName, f.valid, f.threadInfoApiKey, this.threadInfo[f.threadInfoApiKey])
            }
            let threadItemVal = '';
            switch (f.fieldName) {
              case 'threadType':
                let itemLen = f.itemValues.length;
                let itemClass = (itemLen == 1) ? 'col-md-6' : (itemLen > 1 && itemLen < 4) ? `col-md-${12/itemLen}` : 'col-md-4';
                for(let i of f.itemValues) {
                  i.itemClass = itemClass;
                  if(i.active) {
                    threadItemVal = i.name;
                  }
                }
                break;

              case 'year':
                f.itemValues = this.years;
                break;
            }

            if(f.apiName != '') {
              let loadApi = true;
              let apiUrl = f.apiName;
              //console.log(apiUrl);
              let apiData = apiInfo;
              let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
              let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
              let mfIndex = formFieldItems.findIndex(option => option.fieldName == 'manufacturer');
              let ws, wsFormField, wsApiField, apiAccess;
              switch (f.fieldName) {
                case "workstreams":
                  apiData['type'] = 1;
                  apiData['contentTypeId'] = this.contentType;
                  break;
                case 'manufacturer':
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
                  let makeVal = this.threadInfo['make'];
                  makeVal = (makeVal == undefined || makeVal == 'undefined') ? '' : makeVal;
                  f.disabled = true;
                  loadApi = false;
                  if(this.docId > 0 || wsApiField.autoselection == 1) {
                    let apiName = f.apiName;
                    apiAccess = (this.docId > 0) ? 'Edit Document' : 'New Document';
                    let query = JSON.parse(f.queryValues);
                    apiData[query[0]] = makeVal;
                    apiData['access'] = apiAccess;
                    f.disabled = true;
                    f.loading = f.disabled;
                    let extraField = [];
                    console.log(i, extraField)
                    // Get field data
                    this.getData(action, c, f, apiName, apiData, extraField);
                  }
                  break;
                case 'make':
                  wsFormField = formFieldItems[wsIndex];
                  wsApiField = this.apiFormFields[this.stepIndex][this.stepTxt][wsFormField.sec]['cells']['name'][wsFormField.findex];
                  let autoSelection = wsApiField.autoselection;
                  //let timeout = (autoSelection == 1) ? 750 : 500;
                  let timeout = 750;
                  setTimeout(() => {
                    f.disabled = (wsApiField.autoselection == 1) ? false : true;
                    f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                    loadApi = false;
                    if(this.docId > 0 || autoSelection == 1) {
                      ws = wsApiField.selectedValueIds;
                      let apiName = f.apiName;
                      apiAccess = (this.docId > 0) ? 'Edit Document' : 'New Document';
                      let query = JSON.parse(f.queryValues);
                      apiData[query[0]] = JSON.stringify(ws);
                      apiData['access'] = apiAccess;
                      f.disabled = true;
                      f.loading = f.disabled;
                      let extraField = [];
                      console.log(i, extraField)
                      if(mfIndex >= 0) {
                        let mfitem = formFieldItems[mfIndex];
                        let mfi = this.apiFormFields[this.stepIndex][this.stepTxt][mfitem.sec]['cells']['name'][mfitem.findex];
                        let mval = this.threadInfo['manufacturer'];
                        let mfvi = mfi.itemValues.findIndex(option => option.name == mval);
                        let mfVal = (mfvi >= 0) ? mfi.itemValues[mfvi].id : '';
                        mfVal = (mfVal == '') ? mfVal : JSON.stringify([mfVal]);
                        apiData[query[1]] = mfVal;
                      }
                      // Get field data
                      this.getData(action, c, f, apiName, apiData, extraField);
                    }
                  }, timeout);
                  break;
                case 'model':
                  f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                  f.disabled = (this.docId > 0) ? false : true;
                  loadApi = false;
                  if(this.docId > 0) {
                    sec.optFieldsFlag = false;
                    sec.optDisableFlag = false;
                    sec.toggleTxt = "Show";
                  }
                  break;

                default:
                  loadApi = false;
                  break;
              }

              if(loadApi) {
                f.disabled = true;
                f.loading = f.disabled;
                setTimeout(() => {
                  let extraField = [];
                  // Get field data
                  this.getData(action, sec, f, apiUrl, apiData, extraField);
                }, 100);
              }
            }

            let formControlFlag = true;
            if(f.fieldName == 'threadType' || f.fieldName == 'helpType') {
              formControlFlag = false;
            }

            if(this.docId == 0 && f.fieldType == 'toggle') {
              f.selection = (f.selection == 'off') ? false : true;
            }
            if(this.docId == 0) {
              val = (f.apiValueType == 1) ? "" : [];
            }
            this.docForm.addControl(f.apiFieldKey, new FormControl(val));
            if(formControlFlag) {
              let flag = (f.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, f.apiFieldKey);
            }

            if(this.docId == 0 && f.fieldName == 'content') {
              let upItems = Object.keys(this.uploadedItems);
              f.valid = (upItems.length > 0 && this.uploadedItems.items.length > 0) ? true : false;
            }

            if(this.docId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
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
              console.log(f.fieldName, f.valid)
              let onloadFlag = (this.docId == 0) ? true : false;
              onloadFlag = (this.docId == 0 && f.fieldName == 'workstreams' && f.autoselection == 0) ? true : false;
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
                valid: f.valid
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
          if(this.docId > 0) {
            opt.recentShow = false;
            let threadVal = this.threadInfo[opt.threadInfoApiKey];
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
              opt.selectedValueIds = threadVal;
              opt.selectedValues = threadVal;
              opt.selectedVal = threadVal;
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
          this.docForm.addControl(opt.apiFieldKey, new FormControl(val));
          let flag = (opt.isMandatary == 1) ? true : false;
          this.setFormValidation(flag, opt.fieldName);
          if(this.docId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
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
      console.log(this.apiFormFields);
      console.log(this.formFields);
      console.log(this.docForm)
      setTimeout(() => {
        this.step1Loading = false;
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
              formGroup: this.docForm
            }
            this.commonApi.emitDynamicFieldData(data);
          }
        }, 10);
      }, 1000);
    });
  }

  // Set Form Validation
  setFormValidation(flag, field) {
    if(flag) {
      this.docForm.controls[field].setValidators([Validators.required]);
    }
  }

  // Get Field Data
  getData(action, sec, fi, apiUrl, apiData, extraField) {
    let modelFieldName = 'model';
    let ptFieldName = 'SelectProductTypes';
    let modelFieldIndex, ptFieldIndex, mindex, ptindex;

    apiUrl = `${this.baseApiUrl}/${fi.apiName}`;
    let body: HttpParams = new HttpParams();
    Object.keys(apiData).forEach(key => {
      let value:any = apiData[key];
      body = body.append(key, value);
    });

    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      fi.disabled = false;
      fi.loading = fi.disabled;
      //console.log(f.fieldName)
      switch (fi.fieldName) {
        case "workstreams":
          fi.itemValues = response['workstreamList'];
          let workstreamVal = (this.docId == 0 && fi.autoselection == 1) ? fi.workstreamValues : fi.selectedIds;
          if(workstreamVal != undefined && workstreamVal != 'undefined' && workstreamVal.length > 0) {
            let windex = fi.itemValues.findIndex(option => option.id == workstreamVal[0].id);
            if(windex >= 0) {
              let itemVal = fi.itemValues[windex];
              workstreamVal[0].key = itemVal.key;
              workstreamVal[0].editAccess = itemVal.editAccess;
            }
          }
          break;

        case 'make':
        case 'manufacturer':
          console.log(Object.keys(extraField).length, extraField);
          let chkFlag = (Object.keys(extraField).length > 0) ? true : false;
          let disableFlag = (action == 'trigger') ? true : false;
          let f = (chkFlag) ? extraField.f : '';
          let field = (chkFlag) ? extraField.field : '';
          let fieldIndex = (chkFlag) ? extraField.fieldIndex : '';
          let fieldName = (chkFlag) ? extraField.fieldName : '';
          let fieldSec = (chkFlag) ? extraField.fieldSec : '';
          let secIndex = (chkFlag) ? extraField.secIndex : '';
          let stepIndex = (chkFlag) ? extraField.stepIndex : '';
          let stepTxt = (chkFlag) ? extraField.stepTxt : '';
          let val = (chkFlag) ? this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedVal : '';
          val = (action == 'onload' && this.docId > 0) ? fi.selectedVal : val;
          chkFlag = (action == 'onload' && this.docId > 0) ? true : false;
          let selId = 0;
          let res;
          console.log(action,fi);
          fi.itemValues = [];
          if(fi.fieldName == 'make') {
            res = response['modelData'];
            for(let m in res) {
              let mfg = (res[m].hasOwnProperty('manufacturer')) ? res[m].manufacturer : '';
              let mfgArr = (res[m].hasOwnProperty('manufacturerArr')) ? res[m].manufacturerArr : '';
              //console.log(mfgArr);
              fi.itemValues.push({
                id: res[m].id,
                name: res[m].makeName,
                relName: mfg,
                relArr: mfgArr
              });
              if(chkFlag && val == res[m].makeName) {
                disableFlag = false;
                selId = res[m].id;
              }
            }

          } else {
            console.log(fi)
            res = response['items'];
            for(let m in res) {
              let make = (res[m].hasOwnProperty('makeName')) ? res[m].makeName : '';
              let makeArr = (res[m].hasOwnProperty('makeArr')) ? res[m].makeArr : '';
              fi.itemValues.push({
                id: res[m].id,
                name: res[m].name,
                relName: make,
                relArr: makeArr
              });
              if(chkFlag && val == res[m].name) {
                disableFlag = false;
                selId = res[m].id;
              }
            }

            if(fi.fieldName == "manufacturer" ) {
              if(fi.itemValues.length==1){
               this.setupValues(fi, fi.fieldName, fi.itemValues);
              }
            }
          }

          console.log(chkFlag, val, disableFlag);

          if(action != 'onload') {
            fi.recentSelectionValue = response['recentSelection'];
            fi.recentShow = true;
          } else {
            fi.selectedValues = selId;
            fi.valid = true;
          }

          if(chkFlag && disableFlag) {
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
            this.docForm.value[apiFieldKey] = item;

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
            this.docForm.value[apiFieldKey] = item;

            let fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
            fd.optFieldsFlag = false;
            fd.optDisableFlag = true;
            fd.toggleTxt = 'Show';
          } else {

          }
          break;

        default:
          break;
      }
    },
    error  => {
      console.log("Error", error);
    });
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
    this.docApiData['uploadedItems'] = this.uploadedItems.items;
    this.docApiData['attachments'] = this.uploadedItems.attachments;
    this.pageInfo.uploadedItems = this.uploadedItems.items;
    this.pageInfo.attachments = this.uploadedItems.attachments;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    this.pageInfo.stepBack = this.stepBack;
    console.log(this.apiFormFields)
    let data = {
      action: 'back-submit',
      pageInfo: this.pageInfo,
      step1Submitted: this.step1Submitted,
      step2Submitted: this.step2Submitted,
      formGroup: this.docForm
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
        formGroup: this.docForm
      }
      this.commonApi.emitDynamicFieldData(data);
    }, 100);
  }

  // Submit Action
  submitAction(action) {
    this.publishSubmitAction = false;
    this.onSubmit(action);
  }

  // Thread Onsubmit
  onSubmit(action) {
    console.log(this.apiFormFields, this.formFields)
    this.step1Submitted = (this.step1Action && !this.step2Action) ? true : false;
    this.step2Submitted = (this.step1Action && this.step2Action) ? true : false;
    this.pageInfo.step1Submitted = this.step1Submitted;
    this.pageInfo.step2Submitted = this.step2Submitted;
    this.pageInfo.uploadedItems = this.uploadedItems;
    let submitFlag = true;
    console.log(this.stepIndex, this.stepTxt)
    for(let f of this.formFields[this.stepIndex][this.stepTxt]) {
      console.log(f.fieldName, f.valid)
      let formVal = f.formValue;
      if(formVal == 'undefined' || formVal == undefined) {
        formVal = (f.formatType == 1) ? '' : [];
      }
      f.formValue = formVal;
      if(f.displayFlag && !f.valid) {
        console.log(f.fieldName)
        submitFlag = f.valid;
      }
    }

    if(!submitFlag) {
      let data = {
        action: 'submit',
        pageInfo: this.pageInfo,
        step1Submitted: this.step1Submitted,
        step2Submitted: this.step2Submitted,
        formGroup: this.docForm
      }
      this.commonApi.emitDynamicFieldData(data);
      this.errorSecTop();
      return;
    }

    this.bannerImage = (this.bannerImage == '' || this.bannerImage == null) ? '' : this.bannerImage;
    console.log(this.uploadedItems)
    let upItems = (this.uploadedItems == undefined || this.uploadedItems == 'undefined') ? [] : Object.keys(this.uploadedItems);
    console.log(upItems.length, this.uploadedItems)
    if(upItems.length > 0 && this.uploadedItems.items.length > 0) {
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

    this.docSubmit(action);
  }

  // Error Section Scroll
  errorSecTop(action = '') {
    this.publishSubmitAction = true;
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

  // Document Submit
  docSubmit(action) {
    if(this.approvalEnableDomainFlag){
      if(this.approveProcessFlag){
        localStorage.setItem("documentApprovalPage","1");
      }
      else{
        localStorage.removeItem("documentApprovalPage");
      }
    }

    console.log(this.formFields, this.pageInfo, this.uploadedItems);
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
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let docType: any = this.docType;
    let docFormData = new FormData();
    docFormData.set('apiKey', this.apiKey);
    docFormData.set('domainId', this.domainId);
    docFormData.set('countryId', this.countryId);
    docFormData.set('userId', this.userId);
    if(this.approvalEnableDomainFlag){
      let isDraft = action == 'save' ? '1' : '0';
      docFormData.set('isDraft', isDraft);
      if(action == 'save'){
        localStorage.setItem("documentApprovalPage","1");
        docFormData.set('approvalProcess', '6');
      }
      else{
        if(!this.approveProcessFlag){
          docFormData.set('approvalProcess', '1');
          localStorage.removeItem("documentApprovalPage");
        }
        else{
          docFormData.set('approvalProcess', '2');
          localStorage.setItem("documentApprovalPage","1");
        }
      }
    }
    docFormData.set('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    if(this.docId == 0) {
      docFormData.set('docType', docType);
    }
    let groups:any, folders:any = [];
    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
      let mf, make, model, year;
      for(let s of this.formFields[i][step]) {
        console.log(s.apiFieldKey, s.formValue, Array.isArray(s.formValue))
        let formFlag;
        switch(s.apiFieldKey) {
          case 'notificationToggle':
            formFlag = true;
            this.sendNotificationToggle = (s.formValue) ? true : false;
            if(this.approvalEnableDomainFlag){
              if(action == 'save'){
                this.sendNotificationFlag = false;
                this.sendAdminApprovalNotificationFlag = false;
                s.formValue = '0';
              }
              else{
                if(!this.approveProcessFlag){
                  this.sendNotificationFlag = true;
                  this.sendAdminApprovalNotificationFlag = false;
                  s.formValue = '1';
                }
                else{
                  this.sendNotificationFlag = false;
                  this.sendAdminApprovalNotificationFlag = true;
                  s.formValue = '0';
                }
              }
            }
            else{
              this.sendNotificationFlag = (s.formValue) ? true : false;
              s.formValue = (s.formValue) ? '1' : '0';
            }
            break;
          case 'mustRead':
            formFlag = true;
            s.formValue = (s.formValue) ? '1' : '0';
            break;
          case 'dtcToggle':
            formFlag = false;
            break;
          case 'manufacturer':
            let mfgVal = (s.formValueIds == undefined || s.formValueIds == 'undefined') ? 0 : s.formValueIds[0];
            this.mfgId = mfgVal;
            break;
          case 'make_model':
            formFlag = false;
            let makeVal = (s.formValueIds == undefined || s.formValueIds == 'undefined') ? 0 : s.formValueIds;
            this.makeId = makeVal;
            make = s.formValue;
            break;
          case 'model':
            formFlag = false;
            model = s.formValue;
            break;
          case 'year':
            formFlag = false;
            year = s.formValue;
            break;
          case 'language':
            s.formValue = (s.formValue.length > 0) ? s.formValue : ["1"];
            break;
          default:
            formFlag = true;
            break;
        }
        if(formFlag) {
          let formVal = s.formValue;
          formVal = (Array.isArray(s.formValue) && s.apiFieldKey != 'odometer') ? JSON.stringify(formVal) : formVal;
          switch (s.apiFieldKey) {
            case 'groups':
              groups = formVal;
              break;

            case 'folders':
              folders = formVal;
              break;

            case 'bannerImage':
              let bannerVal = (this.bannerFile != '') ? this.bannerFile : (this.bannerImage != '' && !this.defaultBanner) ? this.bannerImage : '';
              let bannerImgName = (bannerVal == null) ? '' : bannerVal;
              if(bannerImgName != ''){
                formVal = this.authenticationService.baseName(bannerImgName);
              }
              else{
                formVal = bannerImgName;
              }
              console.log(formVal);
              break;
          }
          if(s.displayFlag) {
            /*if(s.apiFieldKey == 'groups'){
              formVal = [...new Set(formVal)];
            }*/
            docFormData.set(s.apiFieldKey, formVal);
            console.log(s.apiFieldKey, formVal);
          }
        }
      }

      let formField = this.formFields[0]['step1'];
      let mfIndex = formField.findIndex(options => options.fieldName == 'manufacturer');
      let mkIndex = formField.findIndex(options => options.fieldName == 'make');
      make = formField[mkIndex].formValue;
      let mindex = formField.findIndex(options => options.fieldName == 'model');
      model = formField[mindex].formValue;
      let yindex = formField.findIndex(options => options.fieldName == 'year');
      year = formField[yindex].formValue;
      let makeModel = {
        make: make,
        model: model,
        year: year
      };
      if(mfIndex >= 0) {
        mf = formField[mfIndex].formValue;
        makeModel[formField[mfIndex].fieldName] = mf;
        make = formField[mkIndex].formValue.toLowerCase() == 'general' ? "" : formField[mkIndex].formValue;
      }

      docFormData.set(formField[mkIndex].apiFieldKey, JSON.stringify([makeModel]));
      docFormData.set('contentTypeId', this.contentType);
    }

    let removeClass = 'top-right-notifications-popup';
    if(!document.body.classList.contains(removeClass)) {
      document.body.classList.remove(removeClass);
    }
    console.log(this.sendNotificationFlag);
    this.pageInfo.notificationAction = (this.sendNotificationFlag) ? true : false;
    this.pageInfo.approveNotificationAction = (this.sendAdminApprovalNotificationFlag) ? true : false;
    let notificationFlag: any = this.sendNotificationFlag;

    /*groups = JSON.parse(groups);
    let uniquegroups = [...new Set(groups)];
    let uniquegroups1 = JSON.stringify(uniquegroups);*/

    let pushFormData = new FormData();
    pushFormData.set('apiKey', this.apiKey);
    pushFormData.set('domainId', this.domainId);
    pushFormData.set('countryId', this.countryId);
    //pushFormData.set('userId', this.userId);
    pushFormData.append('groups', groups);
    pushFormData.append('folders', folders);
    pushFormData.set('contentTypeId', this.contentType);
    pushFormData.set('mfgId', this.mfgId);
    pushFormData.set('makeId', this.makeId);
    let updatefl =  (this.docId > 0) ? '1': '0';
    pushFormData.set('updateFlag', updatefl);
    pushFormData.set('email', notificationFlag);

    let notifyFlag:any = 1;
    notifyFlag = (this.sendNotificationToggle) ? 1 : 0;
    pushFormData.append('notifyFlag', notifyFlag);

    let approveStatusData = new FormData();
    if(this.sendAdminApprovalNotificationFlag){
      approveStatusData.append('apiKey', this.apiKey);
      approveStatusData.append('domainId', this.domainId);
      approveStatusData.append('countryId', this.countryId);
      approveStatusData.append('userId', this.userId);
      approveStatusData.append("statusId", "2");
      approveStatusData.append("ownerId", this.userId);
      approveStatusData.append("currentStatusName", "submit");
      approveStatusData.append("oldStatusName", "");
      approveStatusData.append("oldStatusId", "");
      approveStatusData.append('contentTypeId', "4");
    }
    if(this.docId > 0) {
      if(this.approvalEnableDomainFlag && !this.approveProcessFlag && this.contributerId != this.userId){
        if(this.contributerId)
        {
          pushFormData.append('userId', this.contributerId);
        }
        pushFormData.append('approveUser', this.userId);
        pushFormData.append('approvalProcess', '1');
      }
      else{
        pushFormData.set('userId', this.userId);
      }
    }
    else{
      pushFormData.set('userId', this.userId);
    }

    console.log(docFormData);
    if(this.docId > 0) {
      let docId:any = this.docId;
      docFormData.set('dataId', docId);
      docFormData.set('updatedAttachments', JSON.stringify(this.pageInfo.updatedAttachments));
      docFormData.set('deletedFileIds', JSON.stringify(this.pageInfo.deletedFileIds));
      docFormData.set('removeFileIds', JSON.stringify(this.pageInfo.removeFileIds));
      pushFormData.set('dataId', docId);
      if(this.sendAdminApprovalNotificationFlag){
        approveStatusData.append("dataId", docId);
      }

      localStorage.removeItem('docAttachments');
      setTimeout(() => {
        this.threadApi.updateTechInfo(docFormData).subscribe((response) => {
          console.log(response);
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          let msgFlag = true;
          let flag: any = true;
          if(response.status == "Success") {
            let res = response.data;
            //let dataInfo = response.dataInfo[0];
            // Remove when silent push enabled
            let url = `documents`;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            let navEditText = pageTitle[pageDataIndex].navEdit;
            let routeLoadText = pageTitle[pageDataIndex].routerText;
            localStorage.setItem(navEditText, flag);
            localStorage.setItem(routeLoadText, flag);
            //let docId = res.dataId;
            let postId = docId;
            this.uploadedItems = (this.uploadedItems == undefined || this.uploadedItems == 'undefined') ? [] : this.uploadedItems;
            if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
              msgFlag = false;
              this.pageInfo.threadUpload = false;
              this.pageInfo.contentType = this.contentType;
              this.pageInfo.dataId = postId;
              this.pageInfo.docId = docId;
              this.pageInfo.navUrl = this.navUrl;
              this.pageInfo.bulkUpload = false;
              this.pageInfo.threadAction = 'edit';
              this.pageInfo.manageAction = 'uploading';
              this.pageInfo.uploadedItems = this.uploadedItems.items;
              this.pageInfo.attachments = this.uploadedItems.attachments;
              this.pageInfo.pushFormData = pushFormData;
              if(this.sendAdminApprovalNotificationFlag){
                this.pageInfo.approveStatusData = approveStatusData;
              }
              this.pageInfo.message = this.successMsg;
              let data = {
                action: 'document-submit',
                pageInfo: this.pageInfo,
                step1Submitted: this.step1Submitted,
                step2Submitted: this.step2Submitted,
                formGroup: this.docForm
              }
              this.commonApi.emitDynamicFieldData(data);
            }
            else{

              let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', postId);
              apiDatasocial.append('userId', this.userId);
              apiDatasocial.append('action', 'update');
              apiDatasocial.append('actionType', '2');
                let platformIdInfo = localStorage.getItem('platformId');
              if(platformIdInfo=='1' || platformIdInfo=='3' || platformIdInfo=='2')
              {
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
              }
              if(this.sendNotificationFlag){this.threadApi.documentNotification(pushFormData).subscribe((response) => {});}
              if(this.sendAdminApprovalNotificationFlag){this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});}
              //this.threadApi.documentNotification(pushFormData).subscribe((response) => {});
            }
          }
          if(msgFlag) {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              localStorage.removeItem('docNav');
              let nav = `documents/view/${docId}`;
              this.navUrl = nav;
              if(this.teamSystem) {
                this.loading = true;
                window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
              } else {
                let url = `documents`;
                localStorage.setItem('viewDoc', flag);
                //window.close();
                if(this.navUrl == 'documents') {
                  this.step1Loading = true;
                  window.location.href = this.navUrl;
                } else {
                  this.router.navigate([this.navUrl]);
                }
              }
            }, 2000);
          }
        });
      }, 500);
    } else {
      if(this.docType == 1) {
        setTimeout(() => {
          this.commonApi.createDocument(docFormData).subscribe((response) => {
            console.log(response);
            modalRef.dismiss('Cross click');
            this.bodyElem.classList.remove(this.bodyClass);
            this.successMsg = response.result;
            let msgFlag;
            let docId = response.data.dataId;
            if(response.status == "Success") {
              let res = response.data;
              let docId = res.dataId;
              pushFormData.set('dataId', docId);
              if(this.sendAdminApprovalNotificationFlag){
              approveStatusData.set('dataId', docId);
              }
              let postId = res.dataId;
              localStorage.setItem('documentTab', 'uploaded');
              if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
                msgFlag = false;
                this.pageInfo.bulkUpload = false;
                this.docUpload(postId, docId, pushFormData,approveStatusData);
              }
              else{
                let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', postId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('action', 'create');
                apiDatasocial.append('actionType', '2');
                let platformIdInfo = localStorage.getItem('platformId');
                if(platformIdInfo=='1' || platformIdInfo=='3' || platformIdInfo=='2') {
                  this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
                }

                if(action == 'publish') {
                  this.threadApi.documentNotification(pushFormData).subscribe((response) => {});
                } else {
                  if(this.sendNotificationFlag){this.threadApi.documentNotification(pushFormData).subscribe((response) => {});}
                }

                if(this.sendAdminApprovalNotificationFlag){
                  this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});
                  /* setTimeout(() => {
                    msgFlag = true;
                  }, 1000); */
                }
                //else {
                  msgFlag = true;
                //}
                /* //if(this.sendNotificationFlag){
                  this.threadApi.documentNotification(pushFormData).subscribe((response) => {});
                //}
                //msgFlag = true;
                */
              }
            }
            if(msgFlag) {
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = this.successMsg;
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');
                if(this.teamSystem) {
                  window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
                } else {
                  let opt = localStorage.getItem('documentViewOption');
                  console.log(opt);
                  if(opt == '2'){
                    setTimeout(() => {
                      console.log(docId);
                      this.viewMore(docId);
                    }, 100);
                  }
                  else{
                    window.close();
                  }
                  //window.opener.location = this.navUrl;
                  window.opener.location.reload();
                }
              }, 2000);
            } else {

            }
          });
        }, 500);
      } else {
        localStorage.setItem('documentTab', 'uploaded');
        this.bulkDocSubmit(docFormData, pushFormData, approveStatusData,  modalRef);
      }
    }
  }

  // Bulk Doc Submit
  async bulkDocSubmit(docFormData, pushFormData, approveStatusData, modalRef) {
    let uploadedItems = this.uploadedItems.items;
    let itemLen = uploadedItems.length - 1;
    let uploadCount = 0;
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
      this.uploadedItems.attachments.forEach(item => {
        if(item.accessType != 'media') {
          uploadCount++;
        }
      });
    }

    for(let u in uploadedItems) {
      let i = parseInt(u);
      docFormData.set('title', uploadedItems[u].name);
      if(this.uploadedItems.attachments[u].accessType == 'media') {
        let mediaUploadItem = [];
        mediaUploadItem.push({fileId: this.uploadedItems.attachments[u].fileId.toString()});
        docFormData.set('mediaCloudAttachments', JSON.stringify(mediaUploadItem));
      }

      console.log(uploadedItems[u])
      let flagId = uploadedItems[u].flagId;
      let title = '';
      switch(flagId) {
        case 6:
          let caption = uploadedItems[u].fileCaption;
          title = (caption == '') ? uploadedItems[u].url : caption;
          break;
        default:
          title = uploadedItems[u].name;
          break;
      }
      console.log(title)
      docFormData.set('title', title);
      await this.bulkDocCreation(docFormData, pushFormData, approveStatusData, modalRef, uploadedItems[u], u, itemLen, uploadCount);
    }
  }

  // Bulk Doc Creation
  bulkDocCreation(docFormData, pushFormData, approveStatusData, modalRef, item, index, itemLen, uploadCount) {
    return new Promise<void>((resolve, reject) => {
      this.commonApi.createDocument(docFormData).subscribe((response) => {
        console.log(response);
        let res = response.data;
        let docId = res.dataId;
        let postId = res.dataId;
        item['dataId'] = postId;
        if(index == itemLen) {
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          if(uploadCount > 0) {
            this.pageInfo.message = this.successMsg;
            this.pageInfo.bulkUpload = true;
            this.docUpload(postId, docId, pushFormData, approveStatusData);
          } else {
            let apiDatasocial = new FormData();
                apiDatasocial.append('apiKey', Constant.ApiKey);
                apiDatasocial.append('domainId', this.domainId);
                apiDatasocial.append('threadId', postId);
                apiDatasocial.append('userId', this.userId);
                apiDatasocial.append('action', 'create');
                apiDatasocial.append('actionType', '2');
                let platformIdInfo = localStorage.getItem('platformId');

                this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

                const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = this.successMsg;
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');
                if(this.teamSystem) {
                  window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
                } else {
                  let opt = localStorage.getItem('documentViewOption');
                  console.log(opt);
                  if(opt == '2'){
                    setTimeout(() => {
                      console.log(docId);
                      this.viewMore(docId);
                    }, 100);
                  }
                  else{
                    window.close();
                  }
                  //window.opener.location = this.navUrl;
                  window.opener.location.reload();
                }
              }, 2000);
          }
        } else {
          resolve();
        }
      });
    });

  }

  // Document Upload
  docUpload(docId, postId, pushFormData, approveStatusData) {
    this.pageInfo.threadUpload = false;
    this.pageInfo.contentType = this.contentType;
    this.pageInfo.dataId = postId;
    this.pageInfo.threadId = docId;
    this.pageInfo.navUrl = this.navUrl;
    this.pageInfo.threadAction = (this.docId > 0) ? 'edit' : 'new';
    this.pageInfo.manageAction = 'uploading';
    this.pageInfo.uploadedItems = this.uploadedItems.items;
    this.pageInfo.attachments = this.uploadedItems.attachments;
    this.pageInfo.pushFormData = pushFormData;
    if(this.sendAdminApprovalNotificationFlag){
    this.pageInfo.approveStatusData = approveStatusData;
    }
    this.pageInfo.message = this.successMsg;
    let data = {
      action: 'document-submit',
      pageInfo: this.pageInfo,
      step1Submitted: this.step1Submitted,
      step2Submitted: this.step2Submitted,
      formGroup: this.docForm
    }
    this.commonApi.emitDynamicFieldData(data);
  }

  // Close Current Window
  closeWindow() {
    let popupFlag = (this.docId == 0 && this.stepTxt == 'step1') ? false : true;
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

      /*if(this.docId == 0 && this.stepTxt == 'step1') {
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
            //window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
            this.router.navigate([this.navUrl]);
          } else {
            if(this.docId > 0) {
              let url = RedirectionPage.Documents;
              let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
              let navEdit = (localStorage.getItem(pageTitle[pageDataIndex].navEdit)) ? true : false;
              if(!navEdit) {
                localStorage.setItem(pageTitle[pageDataIndex].navCancel, 'true');
              }
              this.router.navigate([this.navUrl]);
            } else {
              //this.router.navigate([this.navUrl]);
              window.close();
            }
          }
        }
      });
    }
  }

  viewMore(docId){
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' documents') ? false : true;
    let scrollTop:any = 0;
    localStorage.setItem('docClosePage', "1");
    localStorage.setItem('docId', docId);
    localStorage.setItem('docIddetail', docId);
    localStorage.setItem('docInfoNav', 'true');
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
	  let nav = `documents/view/${docId}`;
    console.log(nav);
	  this.router.navigate([nav]);
  }

  // Set Screen Height
  setScreenHeight() {
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      let footerHeight = 10;
      //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
      this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+108));
    }

    if(!this.step1Loading) {
      setTimeout(() => {
        let panelWidth = document.getElementById('form-cont').offsetWidth;
        this.pageInfo.panelWidth = panelWidth;
        this.pageInfo.panelHeight = this.innerHeight;
        let data = {
          action: 'panel-width',
          pageInfo: this.pageInfo,
          step1Submitted: this.step1Submitted,
          step2Submitted: this.step2Submitted,
          formGroup: this.docForm
        }
        this.commonApi.emitDynamicFieldData(data);
      }, 100);
    }
  }

  ngOnDestroy() {
    if(this.docId > 0) {
      localStorage.removeItem('docAttachments');
    }
    this.subscription.unsubscribe();
  }
}
