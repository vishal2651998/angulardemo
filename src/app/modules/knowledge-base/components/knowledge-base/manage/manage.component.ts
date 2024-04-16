import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/services/api/api.service';
import { Constant, RedirectionPage, pageTitle, IsOpenNewTab, windowHeight } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { KnowledgeBaseService } from 'src/app/services/knowledge-base/knowledge-base.service';
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
export class ManageComponent implements OnInit, OnDestroy{

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  
  subscription: Subscription = new Subscription();
  public kbTxt: string = 'Knowledge Base';
  public title:string = `New ${this.kbTxt}`;
  public teamSystem = localStorage.getItem('teamSystem');
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
  public kbId: any = 0;
  public threadInfo: any = [];
  public contentType: any = 28;

  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public threadApiData: object;

  public navUrl: string = "knowledge-base";
  public viewUrl: string = "knowledge-base/view/";
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
  public stepIndex: number;
  public stepTxt: string;
  public optionTxt: string = "Options";
  public bannerImage: string = "";
  public defaultBannerImage: string = "";
  public defaultBanner: boolean = false;  
  public bannerImageDefault: boolean = true;
  public bannerFile: any = [];
  
  public industryType: any = [];
  KBForm: FormGroup;
  public pageInfo: any = [];
  public apiInfo: any = [];
  public baseApiUrl: string = "";
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public makeInterval: any;
  public langList: any = [];
  
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
    private kbApi: KnowledgeBaseService
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
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let kbId = this.route.snapshot.params['kbid'];
    this.kbId = (kbId == 'undefined' || kbId == undefined) ? this.kbId : kbId;
    this.manageAction = (this.kbId == 0) ? 'new' : 'edit';
    //if(this.kbId > 0) {
      this.pageInfo.manageAction = this.manageAction;
    //}
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    let navUrl = localStorage.getItem('kbNav');
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'knowledge-base' : navUrl;
    this.viewUrl = `${this.viewUrl}${this.kbId}`
    //this.navUrl = (this.manageAction == 'new') ? navUrl : this.viewUrl;
    this.navUrl = navUrl; 
    setTimeout(() => {
      localStorage.removeItem('kbNav');
    }, 500);
    this.industryType = this.commonApi.getIndustryType();
    console.log(this.industryType)

    this.title = (this.kbId == 0) ? this.title : `Edit ${this.kbTxt}`;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);

    let headTitleText = '';
    let ma = this.kbId == 0 ? "new" : "edit";
    switch(ma){
      case 'new':
        headTitleText = `New ${this.kbTxt}`;
        break;
      case 'edit':
        headTitleText = this.kbTxt;
        break;      
    }

    this.headerData = {        
      title: headTitleText,
      action: ma,
      id: this.kbId  
    };

    let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      let yr = y.toString();
      this.years.push({
        id: yr,
        name: yr
      });
    }

    this.KBForm = this.formBuilder.group({});
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
      threadId: this.kbId,
      platform: this.platform,
      apiType: 5,
      makeName: '',
      modelName: '',
      yearValue: '',
      productType: ''
    };

    this.pageInfo = {
      access: 'knowledge-base',
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
      removeFileIds: [],
      industryType: this.industryType,
    };

    // Get Language List
    this.getLangList();

    setTimeout(() => {
      this.setScreenHeight();

      // Get KB Fields
      this.getKBFields();
    }, 200);

    this.subscription.add(
      this.commonApi.dynamicFieldDataResponseSubject.subscribe((response) => {
        console.log(response);
        let industryType = this.industryType.id;
        //console.log(industryType)                
        if(response['type'] == 'updated-attachments') {
          console.log(response)
          this.pageInfo.updatedAttachments = response['updatedAttachments'];
          this.pageInfo.deletedFileIds = response['deletedFileIds'];
          this.pageInfo.removeFileIds = response['removeFileIds'];
          let uploadedItems = response['uploadedItems'];
          if(uploadedItems != undefined || uploadedItems != 'undefined') {
            this.uploadedItems = uploadedItems;
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
          this.KBForm = response['formGroup'];
          field['cells'][fieldSec][fieldIndex] = fieldData;
          this.formFields = response['formFields'];
          let fd;
          let action = 'trigger';
          let wsInfo;
          let query;
          let vinFieldName = 'vinNo';
          let makeFieldName = 'make';
          let modelFieldName = 'model';
          let ptFieldName = 'SelectProductType';
          let vinFieldIndex, makeFieldIndex, modelFieldIndex, ptFieldIndex, vindex, mkIndex, mindex, ptindex;
          let rf, extraField = [];
          let apiData = apiInfo;
          let apiName;
          console.log(fieldName, fieldApiName)
          switch (fieldName) {
            case 'workstreams':
              let wf = field['cells'][fieldSec][fieldIndex];
              rf = (fieldData.relationalFields == '') ? [] : JSON.parse(fieldData.relationalFields);
              let flag;
              let prodGroupFieldIndex = field['cells'][fieldSec].findIndex(option => option.fieldName === rf[0]);
              if(fieldData.selectedValueIds.length > 0) {
                secIndex = this.formFields[stepIndex][stepTxt][prodGroupFieldIndex].sec;
                field = this.apiFormFields[stepIndex][stepTxt][secIndex];
                let f = field['cells'][fieldSec][prodGroupFieldIndex];
                apiName = f.apiName;
                query = JSON.parse(f.queryValues);
                query.forEach((q, i) => {
                  let chkField = q;
                  let queryIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == chkField);
                  console.log(queryIndex, this.formFields[stepIndex][stepTxt][queryIndex])
                  let queryVal = (q == 'workstreams') ? this.formFields[stepIndex][stepTxt][queryIndex].formValue : this.formFields[stepIndex][stepTxt][queryIndex].formValueItems;
                  apiData[query[i]] = (q == 'workstreams') ? JSON.stringify(queryVal) : queryVal;
                });  
                this.getData(action, secIndex, f, apiName, apiData, extraField);
              } else {
                rf.forEach(item => {
                  this.disableField(item, true);
                  this.setupFieldData(item, stepIndex, stepTxt, fieldSec);
                });
              }
              break;
            case 'ProductGroup':
              rf = (fieldData.relationalFields == '') ? [] : JSON.parse(fieldData.relationalFields);
              fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
              let chkFieldIndex = fd['cells'][fieldSec].findIndex(option => option.fieldName === rf[0]);
              secIndex = this.formFields[stepIndex][stepTxt][chkFieldIndex].sec;
              field = this.apiFormFields[stepIndex][stepTxt][secIndex];
              let f = field['cells'][fieldSec][chkFieldIndex];
              apiName = f.apiName;
              query = JSON.parse(fd['cells'][fieldSec][chkFieldIndex].queryValues);
              query.forEach((q, i) => {
                let chkField = q;
                let queryIndex = this.formFields[stepIndex][stepTxt].findIndex(option => option.fieldName == chkField);
                console.log(queryIndex, this.formFields[stepIndex][stepTxt][queryIndex])
                let queryVal = (q == 'workstreams') ? this.formFields[stepIndex][stepTxt][queryIndex].formValue : this.formFields[stepIndex][stepTxt][queryIndex].formValueItems;
                apiData[query[i]] = (q == 'workstreams') ? JSON.stringify(queryVal) : queryVal;
              });
              rf.push('PartModel');
              rf.forEach(item => {
                this.disableField(item, true);
                this.setupFieldData(item, stepIndex, stepTxt, fieldSec);
              });
              this.getData(action, secIndex, f, apiName, apiData, extraField);
              break;
            case 'subProductGroup':
              rf = (fieldData.relationalFields == '') ? [] : JSON.parse(fieldData.relationalFields);
              rf.forEach(item => {
                this.disableField(item, false);
                this.setupFieldData(item, stepIndex, stepTxt, fieldSec);
              });
              break;
            case 'uploadContents':
              this.uploadedItems = response['uploadedItems'];
              break;
          }
        }
        
        //console.log(this.KBForm)
        //console.log(this.apiFormFields)
        //console.log(this.formFields)
      })
    );
  }

  // Get KB Fields
  getKBFields() {
    let step = this.threadApiData['step'];
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    console.log(this.threadApiData)
    this.threadApi.apiGetThreadFields(this.threadApiData).subscribe((response) => {
      let configInfo = response.configInfo;
      let sections = configInfo.sections; 
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      let i = 0;
      this.threadInfo = (this.kbId > 0) ? response.threadInfo : this.threadInfo;
      let action = 'onload';
      this.defaultBannerImage = configInfo.bannerImage;
      let step2FormField = this.formFields[this.stepIndex][this.stepTxt];
      let step2ApiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][0];     
      switch(this.stepTxt) {
        case 'step1':
          this.bannerImage = this.bannerImage;
          this.pageInfo.bannerImage = this.bannerImage;
          break;
        case 'step2':
          this.defaultBanner = this.bannerFile != '' && this.bannerImage != '' && this.bannerImage != 'null' && this.bannerImage != null && this.bannerImage != 'undefined' && this.bannerImage != undefined ? false : (this.kbId > 0) ? this.defaultBanner : true;
          this.bannerImage = this.bannerImage != '' && this.bannerImage != 'null' && this.bannerImage != null && this.bannerImage != 'undefined' && this.bannerImage != undefined  ? this.bannerImage : configInfo.bannerImage;
          this.pageInfo.bannerImage = this.bannerImage;
          this.pageInfo.defaultBanner = this.defaultBanner;
          break;  
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
              console.log(fc.fieldName, fc.selectedValues)
              
              if(this.kbId > 0) {
                fc.recentShow = false;
                let kbVal = this.threadInfo[fc.threadInfoApiKey];
                if(fc.selection == 'multiple') {
                  fc.selectedIds = kbVal;
                  let id = [];
                  let name = [];
                  for(let item of fc.selectedIds) {
                    id.push(item.id);
                    name.push(item.name);
                  }
                  fc.selectedValueIds = id;
                  fc.selectedValues = name;
                  fc.selectedVal = name;
                  val = kbVal;
                  formVal = (fc.apiFieldType == 1) ? id : name;
                  formValueIds = id;
                  formValueItems = name;
                  console.log(fc.fieldName, kbVal.length)
                  if(kbVal.length > 0 && f.isMandatary == 1) {
                    fc.valid = true;
                  }
                } else {
                  fc.selectedValueIds = kbVal;
                  fc.selectedValues = kbVal;
                  fc.selectedVal = kbVal;
                  val = kbVal;
                  formVal = kbVal;
                  formValueIds = kbVal;
                  formValueItems = kbVal;
                  if(kbVal != "" && fc.isMandatary == 1) {
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
                fc.selectedValueIds = (this.kbId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].id : fc.selectedValueIds;
                fc.selectedValues = (this.kbId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedValues;
                fc.selectedVal = (this.kbId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedVal;
                fc.valid = (fc.fieldName == 'miles' && !fc.valid) ? true : fc.valid;
                val = fc.selectedVal;
              }

              //console.log(i, fc.fieldName, fc.apiFieldKey, fc.apiFieldType, val);
              this.KBForm.addControl(fc.apiFieldKey, new FormControl(val));
              let flag = (fc.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, fc.apiName);
              
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
            
            if(f.fieldType == 'slider' && this.kbId == 0) {
              let sliderVal = f.minValue;
              f.selectedValueIds = sliderVal;
              f.selectedValues = sliderVal;
              f.selectedVal = sliderVal;
              f.showTicks = true;
            }
            if(this.kbId > 0 || (this.kbId == 0 && f.fieldName == 'workstreams' && f.autoselection == 1)) {
              f.recentShow = false;
              let kbVal;
              if(this.kbId > 0) {
                console.log(f.threadInfoApiKey, this.threadInfo)
                kbVal = this.threadInfo[f.threadInfoApiKey];
                if(f.fieldType == 'banner') {
                  console.log(kbVal[0])
                  let bannerInfo = kbVal[0];
                  this.defaultBanner = (bannerInfo.isDefaultImg == 0) ? false : true;
                  this.bannerImage = bannerInfo.bannerImgDesktop;
                  this.pageInfo.bannerImage = this.bannerImage;
                  this.pageInfo.defaultBanner = this.defaultBanner;
                  console.log(this.defaultBanner)
                }
              } else {
                kbVal = f.workstreamValues;
              }              

              if(f.selection == 'multiple') {
                console.log(f.fieldName, kbVal)
                let id = [];
                let name = [];
                f.selectedIds = kbVal;
                
                console.log(f, f.selectedIds);
                let code = [];
                for(let item of f.selectedIds) {
                  id.push(item.id);
                  name.push(item.name);
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
                val = kbVal;
                formVal = (f.apiFieldType == 1) ? id : name;
                formVal = (f.fieldName == 'errorCode') ? code : formVal;
                formValueIds = id;
                formValueItems = name;
                console.log(formVal)
                //console.log(f.fieldName, kbVal.length)
                if(f.fieldName == 'uploadContents') {
                  console.log(kbVal)
                  this.pageInfo.attachmentItems = kbVal;
                }
                if(kbVal.length > 0 && f.isMandatary == 1) {
                  f.valid = true;
                }
              } else {
                console.log(f.fieldName, kbVal)
                kbVal = (f.fieldType == 'textarea' && f.languageOptionForDesc == 1) ? JSON.parse(kbVal) : kbVal; 
                f.selectedValueIds = kbVal;
                f.selectedValues = kbVal;
                f.selectedVal = kbVal;
                val = kbVal;
                formVal = kbVal;
                formValueIds = kbVal;
                formValueItems = kbVal;
                
                switch(f.fieldName) {
                  case 'SystemSelection':
                  case 'SelectProductType':
                    let id, name;
                    for(let item of kbVal) {
                      id = item.id;
                      name = item.name;
                    } 
                    val = (f.apiFieldType == 1) ? id : name;
                    formVal = (f.apiValueType == 1) ? val : [val];
                    formValueIds = id;
                    formValueItems = name;
                    if(f.fieldName == 'SystemSelection' && kbVal.length > 0) {
                      f.selectedValueIds = id;
                      f.selectedValues = name;
                      f.selectedVal = name;
                    }
                    break;
                }

                if(Array.isArray(kbVal) && kbVal.length > 0) {
                  let id, name;
                  let ftype = f.fieldType;
                  for(let item of kbVal) {
                    id = item.id;
                    name = item.name;
                  }
                  console.log(f.fieldName, kbVal, name)
                  val = (f.apiFieldType == 1 && ftype == 'dropdown') ? id : name;
                  formVal = (f.apiValueType == 1) ? val : [val];
                  formValueIds = id;
                  formValueItems = name;
                  f.selectedValueIds = id;
                  f.selectedValues = (ftype == 'dropdown') ? id : formVal;
                  f.selectedVal = val;
                  val = (f.apiFieldType == 1) ? id : name;
                  formVal = (f.apiValueType == 1) ? val : [val];
                }

                if(f.fieldType == 'textarea' && f.languageOptionForDesc == 1) {
                  let descVal = kbVal[0].content;
                  let lang = kbVal[0].language;
                  console.log(kbVal, descVal, lang)
                  f.selectedValueIds = descVal;
                  f.selectedValues = descVal;
                  f.selectedVal = descVal;
                  val = descVal;
                  formVal = descVal;
                  formValueIds = descVal;
                  formValueItems = descVal;

                  f.langItemValues = this.langList;
                  let langIndex = this.langList.findIndex(option => option.name == lang);
                  f.selectedLang = this.langList[langIndex].id.toString();
                }
                
                if(kbVal != "" && f.isMandatary == 1) {
                  f.valid = true;
                }
              }
              console.log(f, f.fieldName, f.threadInfoApiKey, this.threadInfo[f.threadInfoApiKey])
            }
            let threadItemVal = '';
            let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
            switch (f.fieldName) {
              case 'vinNo':
              case 'vin':  
                let vwsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
                f.disabled = (this.kbId > 0 || formFieldItems[vwsIndex].valid) ? false : true;
                f.vinNo = '';
                f.vinValid = (this.kbId == 0) ? false : true;
                f.invalidFlag = false;
                f.invalidError = 'Invalid VIN';
                f.changeAction = '';
                f.vinDetails = [];
                break;  
              case 'year':
                f.itemValues = this.years;
                break;
            }

            if(f.fieldType == 'textarea' && f.languageOptionForDesc == 1) {
              let defId = (this.kbId == 0) ? f.defaultLanguageOPtion.toString() : f.selectedLang;
              f.langItemValues = this.langList;
              if(this.kbId == 0) {
                let langIndex = this.langList.findIndex(option => option.id === defId);
                f.selectedLang = this.langList[langIndex].id.toString();
              }
              let ctrl = `lang-${f.apiFieldKey}`;
              this.KBForm.addControl(ctrl, new FormControl(f.selectedLang));
              this.setFormValidation(true, ctrl);
            }

            if(f.apiName != '') {
              let loadApi = true;
              let apiUrl = f.apiName;
              //console.log(apiUrl);
              console.log(f)
              let apiData = apiInfo;
              let query = (f.queryValues == "") ? [] : JSON.parse(f.queryValues);
              let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
              let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
              let ws, wsFormField, wsApiField, apiAccess;
              let extraField = [];
              switch (f.fieldName) {
                case "workstreams":
                  apiData['type'] = 1;
                  break;
                
                case 'ProductGroup':
                case 'subProductGroup':
                  loadApi = (this.kbId == 0) ? false : true;
                  f.disabled = (this.kbId == 0) ? true : false;
                break;

                default:
                  loadApi = false;
                  break;
              }

              if(loadApi) {
                console.log(f.fieldName)
                query.forEach((q, i) => {
                  let chkField = q;
                  let queryIndex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == chkField);
                  console.log(queryIndex, this.formFields[this.stepIndex][this.stepTxt][queryIndex])
                  let queryVal = (q == 'workstreams') ? this.formFields[this.stepIndex][this.stepTxt][queryIndex].formValue : this.formFields[this.stepIndex][this.stepTxt][queryIndex].formValueItems;
                  apiData[query[i]] = (q == 'workstreams') ? JSON.stringify(queryVal) : queryVal;
                });
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

            if(this.kbId == 0) {
              val = (f.apiValueType == 1) ? "" : [];
            }         
            this.KBForm.addControl(f.apiFieldKey, new FormControl(val));
            if(formControlFlag) {
              let flag = (f.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, f.apiFieldKey);
            }
            
            if(fieldFlag) {
              console.log(f, formVal, val);
              let onloadFlag = (this.kbId == 0) ? true : false;
              onloadFlag = (this.kbId == 0 && f.fieldName == 'workstreams' && f.autoselection == 0) ? true : false;
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
          if(this.kbId > 0) {
            opt.recentShow = false;
            let kbVal = this.threadInfo[opt.threadInfoApiKey];
            console.log(opt)
            if(opt.selection == 'multiple') {
              opt.itemValues = kbVal;
              opt.selectedIds = kbVal;
              console.log(opt.itemValues, opt.fieldName, kbVal)
              let id = [];
              let name = [];
              for(let item of opt.selectedIds) {
                id.push(item.id);
                name.push(item.name);
              }
              opt.selectedValueIds = id;
              opt.selectedValues = name;
              opt.selectedValue = name;
              val = kbVal;
              formVal = (opt.apiFieldType == 1) ? id : name;
              formValueIds = id;
              formValueItems = name;
              
              console.log(opt.fieldName, kbVal.length)
              if(kbVal.length > 0 && opt.isMandatary == 1) {
                opt.valid = true;
              }
            } else {
              let id, name, list;
              if(opt.fieldName == 'make') {
                id = this.threadInfo['makeId'];
                name = kbVal;
                list = {
                  id: id,
                  name: name
                };
                opt.itemValues = [];
                opt.itemValues.push(list);
              } else {
                opt.itemValues = kbVal;
                for(let item of kbVal) {
                  id = item.id;
                  name = item.name;
                } 
              }
              
              opt.selectedValueIds = id;
              opt.selectedValues = id;
              opt.selectedVal = name;
              console.log(opt, list)
              val = kbVal;
              formVal = kbVal;
              formValueIds = kbVal;
              formValueItems = kbVal;
              if(kbVal != "" && opt.isMandatary == 1) {
                opt.valid = true;
              }
            }
          }
          
          //console.log(opt.fieldName, opt.apiFieldKey, val);
          this.KBForm.addControl(opt.apiFieldKey, new FormControl(val));
          let flag = (opt.isMandatary == 1) ? true : false;
          this.setFormValidation(flag, opt.fieldName);
          
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
      console.log(this.KBForm)
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
              formGroup: this.KBForm      
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
      this.KBForm.controls[field].setValidators([Validators.required]);
    }
  }

  // Get Field Data
  getData(action, sec, fi, apiUrl, apiData, extraField) {
    console.log(fi, extraField)
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
    let callbackAction = 'loading';
    
    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      fi.disabled = false;
      fi.loading = fi.disabled;
      let currentFieldName = fi.fieldName;
      switch (currentFieldName) {
        case "workstreams":
          fi.itemValues = response['workstreamList'];
          let workstreamVal = (this.kbId == 0 && fi.autoselection == 1) ? fi.workstreamValues : fi.selectedIds;
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
        case 'SelectProductType':
        case 'ProductGroup':
          console.log(Object.keys(extraField).length, extraField);
          if(this.kbId > 0 && currentFieldName == 'ProductGroup') {
            let findex = this.formFields[this.stepIndex][this.stepTxt].findIndex(option => option.fieldName == currentFieldName);
            let formatType =  this.formFields[this.stepIndex][this.stepTxt][findex].formatType;
            let formatAttr = this.formFields[this.stepIndex][this.stepTxt][findex].formatAttr;
            let fieldVal = this.threadInfo[fi.threadInfoApiKey];
            let id = Array.isArray(fieldVal) ? fieldVal[0].id : fieldVal;
            let name = Array.isArray(fieldVal) ? fieldVal[0].name : fieldVal;
            let formVal = (formatAttr == 1) ? id : name;
            let res = response['modelData'];
            fi.itemValues = [];
            for(let m in res) {
              fi.itemValues.push({
                id: res[m].id,
                name: (fi.fieldName == 'make' || fi.fieldName == 'ProductGroup') ? res[m].makeName : res[m].name
              });
              let checkArr = ['id', 'name'];
              fi.itemValues = this.commonApi.unique(fi.itemValues, checkArr);
            }
            
            fi.valid = true;
            return false;
          }
          f = (chkFlag) ? extraField.f : '';
          field = (chkFlag) ? extraField.field : '';
          fieldIndex = (chkFlag) ? extraField.fieldIndex : '';
          fieldName = (chkFlag) ? extraField.fieldName : '';
          fieldSec = (chkFlag) ? extraField.fieldSec : '';
          secIndex = (chkFlag) ? extraField.secIndex : '';
          stepIndex = (chkFlag) ? extraField.stepIndex : '';
          stepTxt = (chkFlag) ? extraField.stepTxt : '';
          let val = (chkFlag) ? this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec][fieldIndex].selectedVal : '';
          val = (action == 'onload' && this.kbId > 0) ? fi.selectedVal : val;
          chkFlag = (action == 'onload' && this.kbId > 0) ? true : false;
          let selId = 0;
          
          console.log(action, currentFieldName, val)
          let res = (fi.fieldName == 'make' || fi.fieldName == 'ProductGroup') ? response['modelData'] : response['data'].items;
          console.log(res)
          fi.itemValues = [];
          for(let m in res) {
            fi.itemValues.push({
              id: res[m].id,
              name: (fi.fieldName == 'make' || fi.fieldName == 'ProductGroup') ? res[m].makeName : res[m].name
            });
            let checkArr = ['id', 'name'];
            fi.itemValues = this.commonApi.unique(fi.itemValues, checkArr);
            if(chkFlag && ((fi.fieldName == 'make' || fi.fieldName == 'ProductGroup') && val == res[m].makeName) || (fi.fieldName == 'SelectProductType' && val == res[m].name)) {
              disableFlag = false;
              selId = res[m].id;
            }
          }
          console.log(chkFlag, val, disableFlag);
          
          if(action != 'onload') {
            fi.recentSelectionValue = response['recentSelection'];
            fi.recentShow = true;
          } else {
            console.log(selId)
            fi.selectedValues = selId;
            fi.valid = ((fi.fieldName == 'make' || fi.fieldName == 'ProductGroup') && (this.kbId == 0 || (this.kbId > 0 && val == '')) && fi.isMandatary == 1 ) ? false : true;
          }

          if(chkFlag && disableFlag) {
            ptFieldIndex = this.apiFormFields[stepIndex][stepTxt][secIndex]['cells'][fieldSec].findIndex(option => option.fieldName === ptFieldName);
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
            this.KBForm.value[apiFieldKey] = item;
            
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
            this.KBForm.value[apiFieldKey] = item;

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
              this.KBForm.value[apiFieldKey] = item;
            }
            let fd = this.apiFormFields[stepIndex][stepTxt][secIndex];
            fd.optFieldsFlag = false;
            fd.optDisableFlag = true;
            fd.toggleTxt = 'Show';
          } else {
            //console.log(action, ptFieldIndex
            if(action == 'onload' && this.kbId > 0 && fi.fieldName == 'SelectProductType') {
              let ptIndex = fi.itemValues.findIndex(option => option.id == val[0].id);
               console.log(selId, fi)
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
          fi.itemValues = (currentFieldName == 'subProductGroup') ? response.data['items'] : response['items'];
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
    if(this.bannerImageDefault){
      //alert("if back step1---"+this.bannerImage);
    }
    else{
      //alert("else back step1---"+this.bannerImage);
      this.pageInfo.bannerImage = this.bannerImage;
      this.pageInfo.bannerFile = this.bannerFile;  
    }
    console.log(this.bannerImage)       
    this.pageInfo.bannerImage = this.bannerImage;
    this.pageInfo.bannerFile = this.bannerFile;
    //alert("back step1*****"+this.pageInfo.bannerImage);
    
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
      formGroup: this.KBForm   
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
        formGroup: this.KBForm      
      }
      this.commonApi.emitDynamicFieldData(data);
    }, 100);
  }

  // Submit Action
  submitAction() {
    this.onSubmit();
  }

  // Knowledge Base Onsubmit
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
      let formVal = f.formValue;
      let selVal = f.selectedVal;
      if(formVal == 'undefined' || formVal == undefined) {
        formVal = (f.formatType == 1) ? '' : [];
        selVal = (f.formatType == 1) ? '' : [];
      }
      if((this.industryType.id == 2 || this.industryType.id == 3) && (f.fieldName == 'vinNo' || f.fieldName == 'vin')) {
        let sec = f.sec;
        let findex = f.findex;
        let vinField = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['name'][findex];
        let vinValid = vinField.vinValid;
        if(!vinValid || formVal.length < 17) {
          console.log(vinField)
          formVal = (vinField.vinNo.length == 17) ? formVal : '';
          selVal = formVal;
          vinField.seletedIds = formVal;
          vinField.selectedValueIds = formVal;
          vinField.selectedValues = formVal;
          vinField.selectedVal = formVal;
        }
        console.log(formVal)
      }
      f.formValue = formVal;
      f.selectedVal = selVal;
      if(f.displayFlag && !f.valid) {
        console.log(f)
        submitFlag = f.valid;
      }         
    }

    if(!submitFlag) {
      let data = {
        action: 'submit',
        pageInfo: this.pageInfo,
        step1Submitted: this.step1Submitted,
        step2Submitted: this.step2Submitted,
        formGroup: this.KBForm
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
        this.bannerImage = (this.bannerImage == '' || this.bannerImage == null) ? this.defaultBannerImage : this.bannerImage;
        console.log(this.threadType, formFieldLen)
        if(this.threadType == 'thread') {
          this.stepIndex = 1;
          this.stepTxt = "step2";
          
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
            formGroup: this.KBForm
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
      // now hide
      //this.bannerImage = '';
      setTimeout(() =>{
        if(getFieldsFlag) {
          this.step2Loading = true;
          this.threadApiData['step'] = 2;
          this.getKBFields();
        }
      }, 100);
    } else {
      console.log(this.uploadedItems);
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

      this.kbSubmit();
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
  kbSubmit() {
    console.log(this.formFields, this.pageInfo, this.bannerFile);
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
    let groups = [];
    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
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

          if(s.fieldType == 'textarea') {
            let apiField = this.apiFormFields[i][step][s.sec]['cells']['name'][s.findex];
            let langId = apiField.selectedLang;
            let langIndex = apiField.langItemValues.findIndex(option => option.id == langId);
            let language = apiField.langItemValues[langIndex].name;
            let descLang = [{language: language, content: apiField.selectedValues}];
            formVal = JSON.stringify(descLang);
          }

          if(s.apiFieldKey == 'groups') {
            groups = formVal;
          }

          if(s.apiFieldKey == 'bannerImage') {
            let bannerVal = (this.bannerFile != '') ? this.bannerFile : (this.bannerImage != '' && !this.defaultBanner) ? this.bannerImage : '';
            formVal = (bannerVal == null) ? '' : bannerVal;
            console.log(formVal, this.bannerImage, this.defaultBanner);
          }

          if(s.displayFlag) {
            threadFormData.append(s.apiFieldKey, formVal);    
          }
        }        
      }
    }

    //return false;

    let pushFormData = new FormData();
    pushFormData.append('apiKey', this.apiKey);
    pushFormData.append('domainId', this.domainId);
    pushFormData.append('countryId', this.countryId);
    pushFormData.append('userId', this.userId);
    pushFormData.append('groups', JSON.stringify(groups));
    pushFormData.set('contentTypeId', this.contentType);
    if(this.kbId > 0) {
      threadFormData.append('kbId', this.kbId);
      threadFormData.append('updatedAttachments', JSON.stringify(this.pageInfo.updatedAttachments));
      threadFormData.append('deletedFileIds', JSON.stringify(this.pageInfo.deletedFileIds));
      threadFormData.append('removeFileIds', JSON.stringify(this.pageInfo.removeFileIds));
    }
    
    setTimeout(() => {
      this.kbApi.createKB(threadFormData).subscribe((response) => {
        console.log(response);
        modalRef.dismiss('Cross click');
        this.bodyElem.classList.remove(this.bodyClass);
        this.successMsg = response.result;
        let msgFlag = true;
        if(response.status == "Success") {
          let res = response.data;
          let threadId = (this.kbId == 0) ? response.kbId : this.kbId;
          let postId = threadId;
          pushFormData.append('threadId', threadId);
          pushFormData.append('postId', postId);
          pushFormData.append('apiType', '5');
          if(this.kbId > 0) {
            //let kbInfo = response.dataInfo[0];
            let kbInfo = '';
            let url = RedirectionPage.KnowledgeBase;
            let flag: any = true;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            /*let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
            localStorage.setItem(pageTitle[pageDataIndex].navEdit, 'true');
            localStorage.setItem(pageDataInfo, JSON.stringify(kbInfo));*/
            let navEditText = pageTitle[pageDataIndex].navEdit;
            let routeLoadText = pageTitle[pageDataIndex].routerText;
            localStorage.setItem(navEditText, flag);
            localStorage.setItem(routeLoadText, flag);
          }
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            msgFlag = false;
            this.pageInfo.threadUpload = false;
            this.pageInfo.contentType = this.contentType;
            this.pageInfo.dataId = postId;
            this.pageInfo.threadId = threadId;
            this.pageInfo.navUrl = this.navUrl;
            this.pageInfo.threadAction = (this.kbId > 0) ? 'edit' : 'new';
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
            formGroup: this.KBForm      
            }
            this.commonApi.emitDynamicFieldData(data);
          } else {
            // Enable KB Push
            if(this.kbId == 0)
              this.kbApi.pushKB(pushFormData).subscribe((response) => {});
          }          
        }
        if(msgFlag) {
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = this.successMsg;
          let wtimeout = (this.kbId == 0) ? 1000 : 5000;
          setTimeout(() => {              
            localStorage.removeItem('kbNav');  
            if(this.kbId == 0) {
              window.close();
            } else {
              this.router.navigate([this.navUrl]);
            }
          }, wtimeout);
        }
      });
    }, 500);
  }

  // Close Current Window
  closeWindow() {
    let popupFlag = (this.kbId == 0 && this.stepTxt == 'step1') ? false : true;
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

      /*if(this.kbId == 0 && this.stepTxt == 'step1') {
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
            if(this.kbId == 0) {
              window.close();
            } else {
              let url = RedirectionPage.KnowledgeBase;
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
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
      this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+108));
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
          formGroup: this.KBForm      
        }
        this.commonApi.emitDynamicFieldData(data);
      }, 100);
    }
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

  // Get Language List
  getLangList() {
    const apiFormData = new FormData();
    let countryId = localStorage.getItem('countryId');
    apiFormData.append('apiKey', this.apiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);

    this.authenticationService.getLanguageList(apiFormData).subscribe(res => {
      let items = res.data.items;
      this.langList = items;
    });
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
    let formatType = apiField.apiValueType;
    let item = (formatType == 1) ? "" : [];

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
    this.KBForm.value[apiFieldKey] = item;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}