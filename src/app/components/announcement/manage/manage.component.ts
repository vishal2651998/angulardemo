import { Component, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant,ContentTypeValues,IsOpenNewTab,windowHeight } from 'src/app/common/constant/constant';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
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
  public threadTxt: string = 'Announcement';
  public title:string = 'Announcement';
  public teamSystem = localStorage.getItem('teamSystem');
  public bodyElem;
  public footerElem;
  public bodyClass: string = "submit-loader";
  public secElement: any;
  public scrollPos: any = 0;

  public platformId: number = 0;
  public apiKey: string;
  public domainId;
  public userId;
  public countryId;
  public user: any;
  public ancId: number = 0;
  public threadInfo: any = [];
  public contentType: any = ContentTypeValues.Announcement;

  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public ancApiData: object;

  public navUrl: string = "announcements/dashboard";
  public manageAction: string = "new";
  public pageAccess: string = "manageDoc";
  public threadType: string = 'annoncement';
  public docType: number = 2;
  public saveText: string = "Post";
  public platform: number = 3;
  public step1Title: string = "";
  public step2Title: string = "";
  public apiFormFields: any = [{'step1': []}, {'step2': []}];
  public formFields: any = [{'step1': []}, {'step2': []}];
  public successMsg: string = "";
  public uploadedItems: any = [];
  public stepIndex: number;
  public stepTxt: string;
  public optionTxt: string = "Options";

  ancForm: FormGroup;
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
  public CBADomain: boolean = false;
  public sendStoreEmailToggle: boolean = false;
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
    private formBuilder: FormBuilder,
    public acticveModal: NgbActiveModal,
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private threadApi: ThreadService,
    private ancApi: AnnouncementService
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
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    console.log(this.countryId);
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let ancId = this.route.snapshot.params['id'];
    this.ancId = (ancId == 'undefined' || ancId == undefined) ? this.ancId : ancId;
    this.manageAction = (this.ancId == 0) ? 'new' : 'edit';
    this.threadTxt = (this.ancId > 0) ? `Edit ${this.threadTxt}` : this.threadTxt;
    this.pageInfo.manageAction = this.manageAction;
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.CBADomain = this.platformId == 3 ? true : false;
    let navUrl = localStorage.getItem('anncNav');
    console.log(navUrl);
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? this.navUrl : navUrl;
    this.navUrl = navUrl;
    setTimeout(() => {
      localStorage.removeItem('anncNav');
    }, 500);

    this.title = this.threadTxt;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);

    /*this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: false,
      search: false,
      titleFlag: (this.ancId == 0) ? false : true,
      title: `Announcement <span>ID# ${this.ancId}</span>`
    };*/

    let headTitleText = '';      
    switch(this.manageAction){
      case 'new':
        headTitleText = 'Announcement';
        break;
      case 'edit':
        headTitleText = 'Announcement';
        break;        
    }
    this.headerData = {        
      title: headTitleText,
      action: this.manageAction,
      id: this.ancId     
    };

    let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      let yr = y.toString();
      this.years.push({
        id: yr,
        name: yr
      });
    }

    this.ancForm = this.formBuilder.group({});
    this.ancApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      step: 1,
      threadCategoryId: 2,
      threadType: this.threadType,
      docType: this.docType,
      threadId: this.ancId,
      platform: this.platform,
      apiType: 2,
      makeName: '',
      modelName: '',
      yearValue: '',
      productType: '',
      version: 3
    };

    this.pageInfo = {
      access: 'annoncements',
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
      updatedAttachments: [],
      deletedFileIds: []
    };

    setTimeout(() => {
      this.setScreenHeight();
      this.loading = false;
      this.step1Loading = true;
      // Get Announcement Fields
      this.getAnnouncementFields();
    }, 200);
    
    this.subscription.add(
      this.commonApi.dynamicFieldDataResponseSubject.subscribe((response) => {
        console.log(response);
        if(response['type'] == 'updated-attachments') {
          console.log(response)
          this.pageInfo.updatedAttachments = response['updatedAttachments'];
          this.pageInfo.deletedFileIds = response['deletedFileIds'];
          let uploadedItems = response['uploadedItems'];
          if(uploadedItems != undefined || uploadedItems != 'undefined') {
            this.uploadedItems = uploadedItems;
          }
        } else {
          let apiInfo = {
            apiKey: this.apiKey,
            domainId: this.domainId,
            userId: this.userId,
            countryId: this.countryId
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
          this.ancForm = response['formGroup'];
          field['cells'][fieldSec][fieldIndex] = fieldData;
          this.formFields = response['formFields'];
          let fd;
          let action = 'trigger';
          let makeFieldName = 'make';
          let modelFieldName = 'model';
          let ptFieldName = 'SelectProductType';
          let makeFieldIndex, modelFieldIndex, ptFieldIndex, mkIndex, mindex, ptindex;
          
          switch (fieldName) {
            case 'workstreams':
              mkIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == makeFieldName);
              mindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == modelFieldName);
              ptindex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == ptFieldName);
              let findex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == 'make');
              let mkFlag = (findex >= 0) ? true : false;
              if(mkFlag) {
                secIndex = this.formFields[stepIndex][stepTxt][findex].sec;
                field = this.apiFormFields[stepIndex][stepTxt][secIndex];
                makeFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === makeFieldName);
                modelFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === modelFieldName);
                ptFieldIndex = field['cells']['name'].findIndex(option => option.fieldName === ptFieldName);
                let f = field['cells']['name'][fieldIndex];
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled = false;
                this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][modelFieldIndex].disabled = (ptFieldIndex >= 0) ? false : true;
                let apiData = apiInfo;
                let apiName = f.apiName;
                let query = JSON.parse(f.queryValues);
                apiData[query[0]] = JSON.stringify(fieldData.selectedValueIds);
                //console.log(fieldData.selectedValueIds)
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
                  // Get field data
                  this.getData(action, secIndex, f, apiName, apiData, extraField);
                  
                  console.log(this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].disabled)
                } else {
                  f.recentSelectionValue = [];
                  f.recentShow = false;
                  f.itemValues = [];
                  this.setupEquipInfo(stepTxt, stepIndex, secIndex, fieldSec, fieldIndex, f, field, fieldName);
                  let formatType = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][makeFieldIndex].apiValueType;
                  let item = (formatType == 1) ? "" : [];
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
                  this.ancForm.value[apiFieldKey] = item;
      
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
                  this.ancForm.value[apiFieldKey] = item;
      
                  /*fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
                  fd.optFieldsFlag = false;
                  fd.optDisableFlag = true;
                  fd.toggleTxt = 'Show';
                  this.setupFieldData('AdditionalModelInfo', stepIndex, stepTxt, fieldSec);*/
                }
              }
              break;
            case 'threadType':
              this.threadType = fieldData.selectedVal;
              this.ancApiData['threadType'] = this.threadType;
              break;  
            case 'make':
              fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
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
              this.uploadedItems = response['uploadedItems'];
              let fieldItem = this.formFields[stepIndex][stepTxt];
              let upItems = Object.keys(this.uploadedItems);
              if(this.docType == 1) {
                let dindex = fieldItem.findIndex(option => option.fieldName == 'content');
                secIndex = fieldItem[dindex].sec;
                field = this.apiFormFields[stepIndex][stepTxt][secIndex];
                field['cells']['name'][0].valid = (field.selectedVal != '' || (upItems.length > 0 && this.uploadedItems.items.length > 0)) ? true : false;
                fieldItem[dindex].valid = field['cells']['name'][0].valid;
              } else {
                let findex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == fieldName);
                let valid = (upItems.length > 0 && this.uploadedItems.items.length > 0) ? true : false;
                fieldData.valid = valid;
                this.formFields[stepIndex][stepTxt][findex].valid = valid;
              }
              break;
          }
        }
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
    opt.selectedValueIds = id;
    opt.selectedValues = name;
    opt.selectedVal = name;

    formVal = (formatAttr == 1) ? id : name;
    
    optVal.formValue = formVal;
    optVal.formValueIds = id;
    optVal.formValueItems = name;
    this.ancForm.value[optApiFieldKey] = formVal;
  }

  // Empty Field Info
  setupFieldData(fieldName, stepIndex, stepTxt, fieldSec) {
    let formField = this.formFields[stepIndex][stepTxt];
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
    this.ancForm.value[apiFieldKey] = item;
  }

  // Get Announcement Fields
  getAnnouncementFields() {
    let step = this.ancApiData['step'];
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    this.threadApi.apiGetThreadFields(this.ancApiData).subscribe((response) => {
      let configInfo = response.configInfo;
      let sections = configInfo.sections; 
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      let i = 0;
      this.threadInfo = (this.ancId > 0) ? response.threadInfo[0] : this.threadInfo;
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
            userId: this.userId,
            countryId: this.countryId
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
              
              if(this.ancId > 0) {
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
                fc.selectedValueIds = (this.ancId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].id : fc.selectedValueIds;
                fc.selectedValues = (this.ancId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedValues;
                fc.selectedVal = (this.ancId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedVal;
                fc.valid = (fc.fieldName == 'miles' && !fc.valid) ? true : fc.valid;
                val = fc.selectedVal;
              }

              //console.log(i, fc.fieldName, fc.apiFieldKey, fc.apiFieldType, val);
              this.ancForm.addControl(fc.apiFieldKey, new FormControl(val));
              let flag = (fc.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, fc.apiName);

              //console.log(fc.fieldName, fc.selectedValues)
              if(this.ancId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
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
            if(this.ancId == 0) {
              if(f.fieldType == 'slider') {
                let sliderVal = f.minValue;
                f.selectedValueIds = sliderVal;
                f.selectedValues = sliderVal;
                f.selectedVal = sliderVal;
                f.showTicks = true;
              }

              if(f.fieldType == 'radio') {
                for(let i of f.itemValues) {
                  i.checked = (i.default == 1) ? true : false;
                  if(i.checked) {
                    val = (f.apiFieldType == 1) ? i.id : i.name;
                    formVal = val;
                    formValueIds = i.id;
                    formValueItems = i.name;
                    f.selectedValueIds = formVal;
                    f.selectedValues = formVal;
                    f.selectedVal = formVal;
                  }
                }
              }
            }
            if(this.ancId > 0 || (this.ancId == 0 && f.fieldName == 'workstreams' && f.autoselection == 1)) {
              f.recentShow = false;
              let threadVal;
              if(this.ancId > 0) {
                threadVal = this.threadInfo[f.threadInfoApiKey];
              } else {
                threadVal = f.workstreamValues;
              }
              
              if(f.fieldType == 'radio') {
                for(let i of f.itemValues) {
                  i.checked = (threadVal == i.id) ? true : false;
                  if(i.checked) {
                    threadVal = (f.apiFieldType == 1) ? i.id : i.name;
                    formVal = threadVal;
                    formValueIds = i.id;
                    formValueItems = i.name;
                    f.selectedValueIds = formVal;
                    f.selectedValues = formVal;
                    f.selectedVal = formVal;
                  }
                }
              }

              if(f.fieldType == 'input-date') {
                let sval = (threadVal != '') ? moment(threadVal).format(f.expiryDateFormat) : '';                
                f.selectedValueIds = threadVal;
                f.selectedValues = threadVal;
                f.selectedVal = threadVal;
                f.dateVal = sval;
              }

              if(f.fieldName == 'threadType') {
                this.threadType = threadVal;
                this.ancApiData['threadType'] = threadVal;
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

                for(let item of f.selectedIds) {
                  id.push(item.id);
                  name.push(item.name);
                }
                f.selectedValueIds = id;
                f.selectedValues = name;
                f.selectedValue = name;
                if(f.fieldName == 'workstreams') {
                  f.selectedVal = name;  
                }
                val = threadVal;
                formVal = (f.apiFieldType == 1) ? id : name;
                formValueIds = id;
                formValueItems = name;
                //console.log(f.fieldName, threadVal.length)
                if(f.fieldName == 'uploadContents') {
                  this.pageInfo.attachmentItems = threadVal;
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
                  case 'threadType':
                    this.threadType = threadVal;
                    this.ancApiData['threadType'] = this.threadType;
                    break;
                  case 'dtcToggle':
                    f.selection = threadVal; 
                    break;                  
                  case 'storeEmailToggle':                            
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
              let ws, wsFormField, wsApiField, apiAccess;

              switch (f.fieldName) {
                case "workstreams":
                  apiData['type'] = 1;
                  break;
                
                case 'make':
                  wsFormField = formFieldItems[wsIndex];
                  ws = wsApiField.selectedValueIds;
                  f.disabled = (wsApiField.autoselection == 1) ? false : true;
                  f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                  loadApi = false;
                  if(this.ancId > 0 || wsApiField.autoselection == 1) {
                    ws = (wsApiField.autoselection == 1) ? wsApiField.selectedValueIds : wsFormField.formValue;
                    let apiName = f.apiName;
                    apiAccess = (this.ancId > 0) ? 'Edit Announcement' : 'New Announcement';
                    let query = JSON.parse(f.queryValues);
                    apiData[query[0]] = JSON.stringify(ws);
                    apiData['access'] = apiAccess;
                    f.disabled = true;
                    f.loading = f.disabled;
                    let extraField = [];
                    console.log(i, extraField)
                    // Get field data
                    this.getData(action, c, f, apiName, apiData, extraField);
                  }
                  break;
                case 'model':
                  f.recentShow = (f.fieldName == 'make') ? false : f.recentShow;
                  f.disabled = (this.ancId > 0) ? false : true;
                  loadApi = false;  
                  if(this.ancId > 0) {
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

            if(this.ancId == 0 && f.fieldType == 'toggle') {
              f.selection = (f.selection == 'off') ? false : true;
            }
            if(this.ancId == 0 && f.fieldType != 'radio') {
              if(f.fieldType == 'input-date') {
                val = "";
                f.selectedValueIds = val;
                f.selectedValues = val;
                f.selectedVal = val;
                f.dateVal = val;
              } else {
                val = (f.apiValueType == 1) ? "" : [];
              }              
            }            
            this.ancForm.addControl(f.apiFieldKey, new FormControl(val));
            if(formControlFlag) {
              let flag = (f.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, f.apiFieldKey);
            }
                  
            if(this.ancId == 0 && f.fieldName == 'content') {
              let upItems = Object.keys(this.uploadedItems);
              f.valid = (upItems.length > 0 && this.uploadedItems.items.length > 0) ? true : false;
            }
            
            if(this.ancId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
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
              console.log(f.fieldName, f.valid, val, formVal)
              let onloadFlag = (this.ancId == 0) ? true : false;
              onloadFlag = (this.ancId == 0 && f.fieldName == 'workstreams' && f.autoselection == 0) ? true : false; 
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
          if(this.ancId > 0) {
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
          this.ancForm.addControl(opt.apiFieldKey, new FormControl(val));
          let flag = (opt.isMandatary == 1) ? true : false;
          this.setFormValidation(flag, opt.fieldName);
          if(this.ancId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
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
      console.log(this.ancForm)
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
              formGroup: this.ancForm      
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
      this.ancForm.controls[field].setValidators([Validators.required]);
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
          let workstreamVal = (this.ancId == 0 && fi.autoselection == 1) ? fi.workstreamValues : fi.selectedIds;
          if(workstreamVal.length > 0) {
            let windex = fi.itemValues.findIndex(option => option.id == workstreamVal[0].id); 
            if(windex >= 0) {
              let itemVal = fi.itemValues[windex];
              workstreamVal[0].key = itemVal.key;
              workstreamVal[0].editAccess = itemVal.editAccess;
            }            
          }
          break;
        
        case 'make':
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
          val = (action == 'onload' && this.ancId > 0) ? fi.selectedVal : val;
          chkFlag = (action == 'onload' && this.ancId > 0) ? true : false;
          let selId = 0;
          
          console.log(action)
          let res = response['modelData'];
          for(let m in res) {
            fi.itemValues.push({
              id: res[m].id,
              name: res[m].makeName
            });
            if(chkFlag && val == res[m].makeName) {
              disableFlag = false;
              selId = res[m].id;
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
            this.ancForm.value[apiFieldKey] = item;

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
            this.ancForm.value[apiFieldKey] = item;

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
    this.ancApiData['uploadedItems'] = this.uploadedItems.items;
    this.ancApiData['attachments'] = this.uploadedItems.attachments;
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
      formGroup: this.ancForm      
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
        formGroup: this.ancForm      
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
        formGroup: this.ancForm
      }
      this.commonApi.emitDynamicFieldData(data);
      this.errorSecTop();
      return;
    }
    
    let upItems = Object.keys(this.uploadedItems);
    console.log(upItems.length)
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
    
    this.ancSubmit();
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

  // Document Submit
  ancSubmit() {
    console.log(this.formFields, this.pageInfo, this.uploadedItems);
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let docType: any = this.docType;
    let ancFormData = new FormData(); 
    ancFormData.set('apiKey', this.apiKey);
    ancFormData.set('domainId', this.domainId);
    ancFormData.set('countryId', this.countryId);
    ancFormData.set('userId', this.userId);
    if(this.ancId == 0) {
      ancFormData.set('docType', docType);
    }    
    let groups:any = [];
    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
      let make, model, year;
      for(let s of this.formFields[i][step]) {
        console.log(s.apiFieldKey, s.formValue, Array.isArray(s.formValue))
        let formFlag;
        switch(s.apiFieldKey) {
          case 'storeEmailToggle':
            formFlag = true;
            this.sendStoreEmailToggle = (s.formValue) ? true : false;
            s.formValue = (s.formValue) ? '1' : '0';
            break;
          case 'dtcToggle':
            formFlag = false;
            break;
          case 'make_model':
            formFlag = false;
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
          default:
            formFlag = true;
            break;  
        }
        if(formFlag) {
          let formVal = s.formValue;
          formVal = (Array.isArray(s.formValue) && s.apiFieldKey != 'odometer') ? JSON.stringify(formVal) : formVal;
          if(s.apiFieldKey == 'groups') {
            groups = formVal;
          }
          if(s.displayFlag) {
            ancFormData.set(s.apiFieldKey, formVal);    
          }
        }
      }
      let formField = this.formFields[0]['step1'];
      let mkIndex = formField.findIndex(options => options.fieldName == 'make');
      if(mkIndex >= 0) {
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
        ancFormData.set(formField[mkIndex].apiFieldKey, JSON.stringify([makeModel]));  
      }      
      ancFormData.set('contentTypeId', this.contentType);
    }
    let pushFormData = new FormData();
    pushFormData.set('apiKey', this.apiKey);
    pushFormData.set('domainId', this.domainId);
    pushFormData.set('countryId', this.countryId);
    pushFormData.set('userId', this.userId);
    pushFormData.set('groups', groups);
    pushFormData.set('contentTypeId', this.contentType);
    if(this.CBADomain){
      let storeNotifyFlag:any = 1;
      storeNotifyFlag = (this.sendStoreEmailToggle) ? 1 : 0;
      pushFormData.append('storeEmailToggle', storeNotifyFlag);
    }
    
    if(this.ancId > 0) {
      let ancId:any = this.ancId;
      ancFormData.set('dataId', ancId);
      ancFormData.set('updatedAttachments', JSON.stringify(this.pageInfo.updatedAttachments));
      ancFormData.set('deletedFileIds', JSON.stringify(this.pageInfo.deletedFileIds));
      pushFormData.set('dataId', ancId);
      setTimeout(() => {
        this.threadApi.updateTechInfo(ancFormData).subscribe((response) => {
          pushFormData.set('updateFlag', '1');
          console.log(response);
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          let msgFlag = true;
          if(response.status == "Success") {
            let res = response.data;
            //let ancId = res.dataId;
            let postId = ancId;
            if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0) {
              msgFlag = false;
              this.pageInfo.threadUpload = false;
              this.pageInfo.contentType = this.contentType;
              this.pageInfo.dataId = postId;
              this.pageInfo.ancId = ancId;
              this.pageInfo.navUrl = this.navUrl;
              this.pageInfo.bulkUpload = false;
              this.pageInfo.threadAction = 'edit';
              this.pageInfo.manageAction = 'uploading';
              this.pageInfo.uploadedItems = this.uploadedItems.items;
              this.pageInfo.attachments = this.uploadedItems.attachments;
              this.pageInfo.pushFormData = pushFormData;
              this.pageInfo.message = this.successMsg;
              let data = {
                action: 'document-submit',
                pageInfo: this.pageInfo,
                step1Submitted: this.step1Submitted,
                step2Submitted: this.step2Submitted,
                formGroup: this.ancForm      
              }
              this.commonApi.emitDynamicFieldData(data);
            }  else {
              this.ancApi.announcementPush(pushFormData).subscribe((response) => {});
            }         
          }
          if(msgFlag) {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {              
              localStorage.removeItem('threadNav');              
              let flag: any = true;
              //localStorage.setItem('viewAnc', flag);
              //window.close();
              let url = "announcements/view/"+this.ancId;
              //window.location.href = url;
              this.router.navigate([url]);
              msgModalRef.dismiss('Cross click');
              //window.opener.location.reload();
            }, 2000);
          }
        });
      }, 500);
    } else {
      setTimeout(() => {
        this.commonApi.createDocument(ancFormData).subscribe((response) => {       
          console.log(response);
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          let msgFlag = true;
          if(response.status == "Success") {
            let res = response.data;
            let ancId = res.dataId;
            let postId = res.dataId;
            pushFormData.set('dataId', ancId);
            localStorage.setItem('documentTab', 'uploaded');
            if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0) {
              msgFlag = false;
              this.pageInfo.bulkUpload = false;
              this.docUpload(postId, ancId, pushFormData);
            } else {
              this.ancApi.announcementPush(pushFormData).subscribe((response) => {});
            }
          }
          if(msgFlag) {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
  
              if(this.teamSystem) {
                this.loading = true;
                window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
              } else {
                window.close();
              }
            }, 3000);
          } else {
            
          }
        });
      }, 500);
    }
  }

  // Document Upload
  docUpload(ancId, postId, pushFormData) {
    this.pageInfo.threadUpload = false;
    this.pageInfo.contentType = this.contentType;
    this.pageInfo.dataId = postId;
    this.pageInfo.threadId = ancId;
    this.pageInfo.navUrl = this.navUrl;
    this.pageInfo.threadAction = (this.ancId > 0) ? 'edit' : 'new';
    this.pageInfo.manageAction = 'uploading';
    this.pageInfo.uploadedItems = this.uploadedItems.items;
    this.pageInfo.attachments = this.uploadedItems.attachments;
    this.pageInfo.pushFormData = pushFormData;
    this.pageInfo.message = this.successMsg;
    let data = {
      action: 'document-submit',
      pageInfo: this.pageInfo,
      step1Submitted: this.step1Submitted,
      step2Submitted: this.step2Submitted,
      formGroup: this.ancForm      
    }
    this.commonApi.emitDynamicFieldData(data);
  }

  // Close Current Window
  closeWindow() {
    let popupFlag = (this.ancId == 0 && this.stepTxt == 'step1') ? false : true;
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

      /*if(this.ancId == 0 && this.stepTxt == 'step1') {
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
            window.close();
          }        
        }
      });
    }
  }

  // Set Screen Height
  setScreenHeight() {
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
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
          formGroup: this.ancForm      
        }
        this.commonApi.emitDynamicFieldData(data);
      }, 100);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
