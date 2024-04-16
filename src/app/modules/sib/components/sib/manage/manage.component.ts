import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant,IsOpenNewTab,pageTitle,RedirectionPage,windowHeight } from 'src/app/common/constant/constant';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { SibService } from 'src/app/services/sib/sib.service';
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
export class ManageComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  subscription: Subscription = new Subscription();
  public threadTxt: string = 'SIB Cut Off';
  public title:string = `New ${this.threadTxt}`;
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
  public user: any;
  public sibId: number = 0;
  public sibSecId: number = 0;
  public sibInfo: any = [];
  public contentType: any = 30;

  public headerData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public sibApiData: object;
  public sibActions: object;
  private frameRow: object;

  public monthTxt: string = 'Month';
  public navUrl: string = "sib";
  public viewUrl: string = "sib/view/";
  public manageAction: string = "new";
  public pageAccess: string = "manageSib";
  public threadType: string = 'sib';
  public saveText: string = "Publish";
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

  sibForm: FormGroup;
  public pageInfo: any = [];
  public apiInfo: any = [];
  public baseApiUrl: string = "";
  public secTabStatus: any = [true];
  public uploadInterval: any;

  public loading: boolean = true;
  public step1Loading: boolean = false;
  public step2Loading: boolean = false;
  public step1: boolean = true;
  public step2: boolean = false;
  public step1Action: boolean = true;
  public step2Action: boolean = false;
  public step1Submitted: boolean = false;
  public step2Submitted: boolean = false;
  public submitDisabled: boolean = false;
  public stepBack: boolean = false;
  public saveDraftFlag: boolean = true;
  public threadUpload: boolean = true;
  public successFlag: boolean = false;
  public actionFlag: boolean = false;
  public secSubmit: any = false;
  public secSave: any = false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  
  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(!this.step1Submitted && !this.step2Submitted) {
      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        let panelWidth = document.getElementById('form-cont').offsetWidth;
        this.pageInfo.panelWidth = panelWidth-80;
        this.pageInfo.panelHeight = this.innerHeight;
        let data = {
          action: 'panel-width',
          pageInfo: this.pageInfo,
          step1Submitted: this.step1Submitted,
          step2Submitted: this.step2Submitted,
          formGroup: this.sibForm      
        }
        this.commonApi.emitDynamicFieldData(data);
      }, 10);
      //this.setScreenHeight();
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
    private sibApi: SibService,
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
    this.userId = this.user.Userid;
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let sibId = this.route.snapshot.params['sid'];
    this.sibId = (sibId == 'undefined' || sibId == undefined) ? this.sibId : sibId;
    this.manageAction = (this.sibId == 0) ? 'new' : 'edit';
    
    this.pageInfo.manageAction = this.manageAction;
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    let navUrl = localStorage.getItem('sibNav');
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'sib' : navUrl;
    navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'threads' : navUrl;
    this.viewUrl = `${this.viewUrl}${this.sibId}`
    this.navUrl = (this.manageAction == 'new') ? 'sib' : this.viewUrl;
    this.navUrl = navUrl;
    setTimeout(() => {
      localStorage.removeItem('sibNav');
    }, 500);

    this.title = (this.sibId == 0) ? this.title : `Edit ${this.threadTxt}`;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);

    /*this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: false,
      search: false,
      titleFlag: (this.sibId == 0) ? false : true,
      title: `SIB <span>ID# ${this.sibId}</span>`
    };*/

    // Removing local storage items
    localStorage.removeItem('sibFieldUpdate');
    localStorage.removeItem('sibActions');
    localStorage.removeItem('sibAction');
    localStorage.removeItem('frameRow');

    let headTitleText = '';      
      switch(this.manageAction){
        case 'new':
          headTitleText = 'SIB Cut Off';
          break;
        case 'edit':
          headTitleText = 'SIB';
          break;        
      }

    this.headerData = {        
      title: headTitleText,
      action: this.manageAction,
      id: this.sibId     
    };

    this.sibForm = this.formBuilder.group({});
    this.sibApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId,
      step: 1,
      threadCategoryId: 1,
      threadType: this.threadType,
      docType: '',
      threadId: this.sibId,
      platform: this.platform,
      apiType: 3,
      makeName: '',
      modelName: '',
      yearValue: '',
      productType: ''
    };

    this.pageInfo = {
      access: 'sib',
      baseApiUrl: this.baseApiUrl,
      apiKey: this.apiKey,
      contentType: this.contentType,
      domainId: this.domainId,
      userId: this.userId,
      sibId: this.sibId,
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
      deletedFileIds: [],
      removeFileIds: []
    };
    
    setTimeout(() => {
      this.setScreenHeight();
      this.loading = false;
      this.step1Loading = true;
      // Get SIB Fields
      this.getSibFields();
    }, 200);

    this.subscription.add(
      this.commonApi.dynamicFieldDataResponseSubject.subscribe((response) => {
        console.log(response);
        let apiInfo = this.baseApiInfo();
        let stepTxt = response['step'];
        let stepIndex = response['stepIndex'];
        let action = response['action'];
        let secRow = response['addSection'];
        let addRow = response['addRow'];
        let secIndex = response['sectionIndex'];
        let actionSecIndex = response['actionSecIndex'];
        let rowIndex = response['rowIndex'];
        let fieldSec = response['fieldSec'];
        let fieldIndex = response['fieldIndex'];
        let fieldData = response['fieldData'];
        let field = this.apiFormFields[stepIndex][stepTxt][secIndex];
        let actionId = 0;
        if(action != '') {
          switch (action) {
            case 'addRow':
              this.initFrameField(stepIndex, stepTxt, secIndex, actionSecIndex, fieldData)
              break;
            case 'sibSecAction':
              let actionItem = response['secAction'];
              let actionFlag = (actionItem == 'edit') ? true : false;
              fieldData = response['secData'];
              if(actionItem == 'save') {
                this.secSave = true;
                this.submitDisabled = false;
                this.sibSubmit(actionSecIndex, secIndex, fieldData);
              } else {
                this.submitDisabled = (actionItem == 'cancel') ? false : true;
                if(actionItem == 'cancel') {
                  let sibSecData = localStorage.getItem('sibSectionData');
                  let forFieldData = localStorage.getItem('formFields');
                  console.log(fieldSec, actionSecIndex, field['cells'][fieldSec], JSON.parse(sibSecData), JSON.parse(forFieldData))
                  field['cells'][fieldSec][actionSecIndex] = JSON.parse(sibSecData);
                  this.formFields = JSON.parse(forFieldData);
                  this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].mainActionItems[0].editIndex = -1;
                  this.errorSecTop('sib-actions');
                  setTimeout(() => {
                    localStorage.removeItem('sibSectionData');
                    localStorage.removeItem('formFields');
                  }, 100);
                }                
                this.uploadedItems = [];
                this.pageInfo.uploadedItems = this.uploadedItems;
                this.pageInfo.attachments = this.uploadedItems;
                let sid = response['secid'];
                console.log(sid)
                this.setupSIBSecFields(actionFlag, fieldData, sid, actionItem, actionSecIndex);
              }              
              break;
            case 'update':
              if(fieldData.fieldName == 'uploadContents') {
                this.sibForm = response['formGroup'];
                this.formFields = response['formFields'];
                let formField = this.formFields[stepIndex][stepTxt];
                let fieldName = fieldData.fieldName;
                console.log(field, field['cells'][fieldSec], fieldIndex)
                this.uploadedItems = response['uploadedItems'];
                if(actionSecIndex >= 0) {
                  let uindex = formField.findIndex(option => option.actionIndex == actionSecIndex && option.fieldName == fieldName); 
                  if(response['type'] == 'updated-attachments') {
                    let fieldIndex = formField[uindex].findex;
                    let currField = this.apiFormFields[this.stepIndex][this.stepTxt][secIndex]['cells'][fieldSec][actionSecIndex].sibActions[fieldIndex];
                    currField.updatedAttachments = response['updatedAttachments'];
                    currField.deletedFileIds = response['deletedFileIds'];
                    currField.removeFileIds = response['removeFileIds'];
                    currField.uploadAction = 'attachments';
                    console.log(this.apiFormFields[this.stepIndex][this.stepTxt][secIndex]['cells'][fieldSec][actionSecIndex].sibActions[fieldIndex])
                    //currField.callback = false;
                    setTimeout(() => {
                      //currField.callback = true;
                      //this.errorSecTop('sib-actions');
                    }, 100);
                  } else {
                    if(actionId > 0) {
                      this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].mainActionItems[0].editIndex = actionSecIndex; 
                    }
                    formField[uindex].uploadedItems = [];
                    formField[uindex].uploadedItems = response['uploadedItems'];                  
                  }                
                }
              }
              break;
          }
          return false;
        } else {
          this.sibForm = response['formGroup'];
          this.formFields = response['formFields'];
          let formField = this.formFields[stepIndex][stepTxt];
          let fieldName = fieldData.fieldName;
          let apiFieldKey = fieldData.apiFieldKey;
          let fieldApiName = fieldData.apiName;
          console.log(field, field['cells'][fieldSec], fieldIndex)
          let cf, f, df;
          if(actionSecIndex >= 0) {
            field['cells'][fieldSec][actionSecIndex].sibActions[fieldIndex] = fieldData;
            cf = field['cells'][fieldSec][actionSecIndex].sibActions;
            f = field['cells'][fieldSec][actionSecIndex].sibActions[fieldIndex];
            let chkId = cf.findIndex(option => option.fieldName == 'id');
            actionId = cf[chkId].selectedValues;
            if(rowIndex < 0) {
              f = field['cells'][fieldSec][actionSecIndex]['sibActions'][fieldIndex];
            } else {
              console.log(field['cells'][fieldSec][actionSecIndex]['sibActions'])
              df = field['cells'][fieldSec][actionSecIndex]['sibActions'][fieldIndex];
              f = field['cells'][fieldSec][actionSecIndex]['sibActions'][fieldIndex][response['fieldRow']][rowIndex];
              console.log(f, fieldIndex)
              fieldName = f.cellAction[0].fieldName;
            }         
          } else {
            field['cells'][fieldSec][fieldIndex] = fieldData;
            f = field['cells'][fieldSec][fieldIndex];
          }
          let fd;
          let action = 'trigger';
          let wsInfo;
          let query;
          console.log(f, fieldName, fieldApiName)
          switch (fieldName) {
            case 'workstreams':
              /*let flag = true;
              let relFields = ['partsToggle', 'parts'];
              let apiFormField = this.apiFormFields[stepIndex][stepTxt];
              relFields.forEach(c => {
                flag = (c == 'parts') ? false : flag;
                this.setupSibActionFields(c, formField, apiFormField, stepIndex, stepTxt, flag);
              });*/
              break;
            case 'cutOffFrame':
              let fapiData = apiInfo;
              let fapiName = f.cellAction[0].apiName;
              console.log(f.cellAction, fapiName)
              let extraField = [];
              query = JSON.parse(f.cellAction[0].queryValues);
              fapiData[query[0]] = f.cellAction[0].selectedVal;
              f.cellAction.forEach(c => {
                if(c.fieldName == 'frameRange') {
                  console.log(c)  
                  fapiData[query[1]] = c.selectedValueIds;
                }
              });
              extraField = df;
              // Get Vin Field Data
              this.getData(action, secIndex, f, fapiName, fapiData, extraField, actionSecIndex, rowIndex);
              break;
            case 'partsToggle':
              let chkField = 'parts';
              console.log(cf, fieldSec)
              this.setupActionFieldData(chkField, stepIndex, stepTxt, secIndex, fieldSec, actionSecIndex, f.selection, cf);
              break;
            case 'uploadContents':
              this.uploadedItems = response['uploadedItems'];
              console.log(4654, response)
              if(actionSecIndex >= 0) {
                let uindex = formField.findIndex(option => option.actionIndex == actionSecIndex && option.fieldName == fieldName); 
                if(response['type'] == 'updated-attachments') {
                  let fieldIndex = formField[uindex].findex;
                  let currField = this.apiFormFields[this.stepIndex][this.stepTxt][secIndex]['cells'][fieldSec][actionSecIndex].sibActions[fieldIndex];
                  currField.updatedAttachments = response['updatedAttachments'];
                  currField.deletedFileIds = response['deletedFileIds'];
                  currField.removeFileIds = response['removeFileIds'];
                  currField.uploadAction = 'attachments';
                  //currField.callback = false;
                  setTimeout(() => {
                    //currField.callback = true;
                    //this.errorSecTop('sib-actions');
                  }, 100);
                } else {
                  if(actionId > 0) {
                    this.apiFormFields[this.stepIndex][this.stepTxt][secIndex].mainActionItems[0].editIndex = actionSecIndex; 
                  }
                  formField[uindex].uploadedItems = [];
                  formField[uindex].uploadedItems = response['uploadedItems'];                  
                }                
              } else {
                this.uploadedItems = response['uploadedItems'];
              }              
              break;
          }
          console.log(this.apiFormFields, this.formFields)
        }
      })
    );
  }

  // Setup SIB Action Fields
  setupSibActionFields(relField, formField, apiFormField, stepIndex, stepTxt, flag) {
    let partField = formField.filter(option => option.fieldName === relField);
    partField.forEach(item => {
      let partIndex = formField.findIndex(option => option.actionIndex == item.actionIndex && option.fieldName === relField);
      let ptSec = item.sec;
      let ptAction = item.actionIndex;
      let ptIndex = item.findex;
      let ptField = apiFormField[ptSec]['cells']['sib'][ptAction]['sibActions'][ptIndex];
      ptField.displayFlag = flag;
      if(relField == 'partsToggle') {
        ptField.selection = false;
        formField[partIndex].selection = false;
        item.selection = false;
      }
    });
  }

  // Empty Field Info
  setupActionFieldData(fieldName, stepIndex, stepTxt, secIndex, fieldSec, actionIndex, flag = false, cf:any = '') {
    let formField = this.formFields[stepIndex][stepTxt];
    //let apiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][secIndex][fieldSec]
    let addInfo = formField.findIndex(option => option.fieldName == fieldName && option.actionIndex == actionIndex);
    console.log(addInfo, actionIndex, fieldName, formField)
    if(addInfo >= 0) {
      formField = formField[addInfo];
      console.log(fieldName, cf, addInfo, formField)
      let apiField = cf[formField.findex];
      let formatType = apiField.apiValueType;
      let item = (formatType == 1) ? "" : [];
      apiField.selectedValueIds = item;
      apiField.selectedValues = item;
      apiField.selectedVal = item;
      apiField.valid = (apiField.isMandatary) ? false : true;
      let apiFieldKey = apiField.apiFieldKey;
      if(fieldName == 'parts') {
        apiField.displayFlag = flag;
        apiField.valid = !flag;
      }

      formField.formValue = item;
      formField.formValueIds = item;
      formField.formValueItems = item;
      formField.valid = apiField.valid;
      this.sibForm.value[apiFieldKey] = item;
    }    
  }

  // Get SIB Fields
  getSibFields() {
    let step = this.sibApiData['step'];
    this.stepTxt = `step${step}`;
    this.stepIndex = (step == 1) ? 0 : 1;
    this.step1 = (step == 1) ? true : false;
    this.step2 = (step == 2) ? true : false;
    this.pageInfo.step = this.stepTxt;
    this.pageInfo.stepIndex = this.stepIndex;
    console.log(this.sibApiData)
    this.threadApi.apiGetThreadFields(this.sibApiData).subscribe((response) => {
      this.sibActions = response.sibActions;
      let frameRow = response.sibFramerowItems[0];
      this.frameRow = frameRow;
      localStorage.setItem('sibActions', JSON.stringify(this.sibActions))
      localStorage.setItem('frameRow', JSON.stringify(frameRow));
      console.log(this.sibActions)
      let configInfo = response.configInfo;
      let sections = configInfo.sections; 
      this.step1Title = configInfo.topbar[0];
      this.step2Title = configInfo.topbar[1];
      let i = 0;
      this.sibInfo = (this.sibId > 0) ? response.threadInfo[0] : this.sibInfo;
      if(this.sibId > 0) {
        this.sibInfo.sibActions.forEach((item, index) => {
          if(item.frameNumbers.length == 0) {
            this.sibInfo.sibActions.splice(index, 1);
          }
        });
        console.log(this.sibInfo)
      }
      let action = 'onload';
      let step2FormField = this.formFields[this.stepIndex][this.stepTxt];
      let step2ApiFormField = this.apiFormFields[this.stepIndex][this.stepTxt][0];
      for(let sec of sections) {
        let c = 0;
        let o = 0;
        let ac = 0;
        let val: any = '', formVal:any = '', formValueIds:any = '', formValueItems:any = "";
        let cells = sec.cells;
        let fieldLists = cells.name;
        let fieldOptionalData = cells.optionFilter;
        let actionFieldLists = cells.sib;
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
              fc.displayFlag = (f.fieldType == 'frame-input') ? false : true;
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
              
              if(this.sibId > 0) {
                fc.recentShow = false;
                let threadVal = this.sibInfo[fc.threadInfoApiKey];
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
                console.log(this.sibInfo[fc.threadInfoApiKey])
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
                fc.selectedValueIds = (this.sibId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].id : fc.selectedValueIds;
                fc.selectedValues = (this.sibId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedValues;
                fc.selectedVal = (this.sibId == 0 && fc.fieldName == 'miles') ? fc.itemValues[0].name : fc.selectedVal;
                fc.valid = (fc.fieldName == 'miles' && !fc.valid) ? true : fc.valid;
                val = fc.selectedVal;
              }

              //console.log(i, fc.fieldName, fc.apiFieldKey, fc.apiFieldType, val);
              this.sibForm.addControl(fc.apiFieldKey, new FormControl(val));
              let flag = (fc.isMandatary == 1) ? true : false;
              this.setFormValidation(flag, fc.apiName);

              //console.log(fc.fieldName, fc.selectedValues)
              if(this.sibId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
                let chkFieldIndex = step2FormField.indexOf(option => option.fieldName == fc.fieldName);
                fieldFlag = (chkFieldIndex >= 0) ? false : true;
                if(!fieldFlag) {
                  step2FormField[chkFieldIndex]['findex'] = c;
                }
              }
              if(fieldFlag) {
                this.formFields[this.stepIndex][this.stepTxt].push({
                  actionIndex: -1,
                  apiFieldKey: fc.apiFieldKey,
                  displayFlag: fc.displayFlag,
                  fieldName: fc.fieldName,
                  fieldType: fc.fieldType,
                  findex: o,
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
                  rowIndex: -1,
                  sec: i,
                  selection: fc.selection,
                  threadType: fc.threadType,
                  valid: fc.valid,
                  sibActions: false
                });
                o++;
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
            if(f.fieldType == 'slider' && this.sibId == 0) {
              let sliderVal = f.minValue;
              f.selectedValueIds = sliderVal;
              f.selectedValues = sliderVal;
              f.selectedVal = sliderVal;
              f.showTicks = true;
            }
            if(this.sibId > 0 || (this.sibId == 0 && f.fieldName == 'workstreams' && f.autoselection == 1)) {
              f.recentShow = false;
              let threadVal;
              if(this.sibId > 0) {
                threadVal = this.sibInfo[f.threadInfoApiKey];
              } else {
                threadVal = f.workstreamValues;
              }

              if(f.selection == 'multiple') {
                console.log(f.fieldName, threadVal)
                let id = [];
                let name = [];
                f.selectedIds = threadVal;
                
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
                }
                if(threadVal.length > 0 && f.isMandatary == 1) {
                  f.valid = true;
                }
              } else {
                console.log(f.fieldName, threadVal)
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
                    this.sibApiData['threadType'] = this.threadType;
                    break;
                  case 'dtcToggle':
                    f.selection = threadVal; 
                    break;
                  case 'SystemSelection':
                  case 'SelectProductType':
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
                }
                if(f.fieldType == 'slider') {
                  let sliderVal = threadVal;
                  f.selectedValueIds = sliderVal;
                  f.selectedValues = sliderVal;
                  f.selectedVal = sliderVal;
                }
                if(f.fieldType == 'input-date') {
                  console.log(threadVal)
                  threadVal = (threadVal == '') ? threadVal : moment(threadVal).format('DD-MM-YYYY');
                  f.selectedValueIds = threadVal;
                  f.selectedValues = threadVal;
                  f.selectedVal = threadVal;
                  f.dateVal = threadVal;
                }
                

                if(threadVal != "" && f.isMandatary == 1) {
                  f.valid = true;
                }
              }
              console.log(f, f.fieldName, f.threadInfoApiKey, this.sibInfo[f.threadInfoApiKey])
            }
            
            let threadItemVal = '';            
            if(f.apiName != '') {
              let loadApi = true;
              let apiUrl = f.apiName;
              //console.log(apiUrl);
              console.log(f)
              let apiData = apiInfo;
              let query = (f.queryValues == "") ? "" : JSON.parse(f.queryValues);
              let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
              let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
              let ws, wsFormField, wsApiField, apiAccess;
              let extraField = [];
              switch (f.fieldName) {
                case "workstreams":
                  apiData['type'] = 1;
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
            
            if(this.sibId == 0 && f.fieldType == 'toggle') {
              f.selection = (f.selection == 'off') ? false : true;
            }
            if(this.sibId == 0) {
              val = (f.apiValueType == 1) ? "" : [];
            }            
            this.sibForm.addControl(f.apiFieldKey, new FormControl(val));
            let flag = (f.isMandatary == 1) ? true : false;
            this.setFormValidation(flag, f.apiFieldKey);
            
            if(fieldFlag) {
              console.log(f, formVal);
              let onloadFlag = (this.sibId == 0) ? true : false;
              onloadFlag = (this.sibId == 0 && f.fieldName == 'workstreams' && f.autoselection == 0) ? true : false;
              if(val == 'undefined' || val == undefined) {
                val = (f.apiValueType == 1) ? "" : [];
              }
              this.formFields[this.stepIndex][this.stepTxt].push({
                actionIndex: -1,
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
                rowIndex: -1,
                sec: i,
                selection: f.selection,
                selectedVal: threadItemVal,
                threadType: f.threadType,
                valid: f.valid,
                vinNo: f.vin,
                sibActions: false
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
          if(this.sibId > 0) {
            opt.recentShow = false;
            let threadVal = this.sibInfo[opt.threadInfoApiKey];
            console.log(opt)
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
                id = this.sibInfo['makeId'];
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
          this.sibForm.addControl(opt.apiFieldKey, new FormControl(val));
          let flag = (opt.isMandatary == 1) ? true : false;
          this.setFormValidation(flag, opt.fieldName);
          if(this.sibId == 0 && step == 2 && this.threadType == 'share' && step2FormField.length > 0) {
            let chkFieldIndex = step2FormField.indexOf(option => option.fieldName == opt.fieldName);
            fieldFlag = (chkFieldIndex >= 0) ? false : true;
            if(!fieldFlag) {
              step2FormField[chkFieldIndex]['findex'] = c;
            }
          }
          if(fieldFlag) {
            this.formFields[this.stepIndex][this.stepTxt].push({
              actionIndex: -1,
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
              rowIndex: -1,
              sec: i,
              selection: opt.selection,
              threadType: opt.threadType,
              valid: opt.valid,
              sibActions: false
            });
            o++;
          }
        }

        if(actionFieldLists.length > 0) {
          console.log(sec)
          let frameRows:any = JSON.parse(localStorage.getItem('frameRow'));
          let sibCallBack = false;
          let frameFlag = false;
          let sibList = [];
          if(this.sibId == 0) {
            sibCallBack = true;
            frameFlag = true;
            sec.mainActionItems[0].disable = true;
            sec.mainActionItems[0].editIndex = -1;
          } else {
            sibList = (this.sibId > 0) ? this.sibInfo.sibActions : [];
            sec.mainActionItems[0].disable = (sibList.length == 0) ? true : false;
            sec.mainActionItems[0].editIndex = -1;
          
            sibList = this.sibInfo.sibActions;
            console.log(sibList, actionFieldLists)
            sibList.forEach((sibData, si) => {
              let sibActions = JSON.parse(localStorage.getItem('sibActions'));
              if(si > 0) {
                this.secTabStatus.push(false)
                actionFieldLists.push({'sibActions': sibActions});
              }
              sibCallBack = (sibList.length - 1 == si) ? true : false;  
            });
          }

          if(sibCallBack) {
            console.log(actionFieldLists)
            actionFieldLists.forEach((af, sac) => {
              console.log(actionFieldLists.length, sac, sibList[sac])
              let sibData = (this.sibId > 0) ? sibList[sac] : [];
              let sid = (this.sibId > 0) ? sibList[sac].id : 0;
              let frameList = sibData.frameNumbers;
              if(this.sibId > 0) {
                console.log(af)
                af.sibActions.forEach((sitem, df) => {
                  if(sitem.rowItems.length > 0) {
                    frameList.forEach((item, fi) => {
                      if(fi > 0) {
                        console.log(frameList.length, fi);
                        this.initFrameField(this.stepIndex, this.stepTxt, i, sac, sitem, item);
                      }
                      frameFlag = (frameList.length - 1 == fi) ? true : false;
                    });
                  }
                });
              }
              if(frameFlag) {
                console.log(sid, sibData, actionFieldLists[sac])
                let secTimeout = (this.sibId == 0) ? 0 : 500;
                setTimeout(() => {
                  this.initSIB(i, actionFieldLists[sac], sac, sid, sibData);                  
                }, secTimeout);
              }
            });
          }
        }
        this.apiFormFields[this.stepIndex][this.stepTxt][i] = sec;
        i++;
      }

      this.pageInfo['threadUpload'] = this.threadUpload;
      this.pageInfo['apiFormFields'] = this.apiFormFields;
      console.log(this.apiFormFields);
      console.log(this.formFields);
      console.log(this.sibForm)
      this.loading = false;
      this.step1Loading = this.loading;
    });
  }

  // Init Frame Field
  initFrameField(stepIndex, step, sectionIndex, actionSecIndex, fieldData, frameData: any = '') {
    console.log(stepIndex, step, sectionIndex, actionSecIndex, fieldData, {'frameData': frameData})
    let val, formVal, formValueIds, formValueItems;
    let frameRows:any = JSON.parse(localStorage.getItem('frameRow'));
    let fr = frameRows['cellAction'];
    let rowIndex = fieldData.rowItems.length;
    fieldData.actionItems[0].disable = true;
    
    fr.forEach((cf, rindex) => {
      console.log(cf, rowIndex)
      switch (cf.fieldName) {
        case 'cutOffFrame':
          cf.actionId = 0;
          cf.editFlag = true;
          cf.maxLength = 17;
          cf.invalidError = 'Invalid Cutoff Frame Number';
          cf.closeFlag = false;
          cf.duplicateFlag = false;
          cf.duplicateError = 'Duplicate Cutoff Frame Number';
          break;
      }
      cf.displayFlag = (cf.fieldType == 'frame-input') ? true : false;
      cf.editFlag = true;
      cf.recentShow = false;
      cf.lazyLoading = false; 
      cf.loading = false;
      cf.valid = (cf.isMandatary == 1 && frameData == '') ? false : true;
      cf.isNumeric = false;
      cf.isArray = (cf.apiValueType == 1) ? false : true;
      cf.selectedValueIds = (cf.apiValueType == 1) ? "" : [];
      cf.selectedValues = (cf.apiValueType == 1) ? "" : [];
      cf.selectedVal = (cf.apiValueType == 1) ? "" : [];
      val = (cf.apiValueType == 1) ? "" : [];
      console.log(cf.fieldName, cf.selectedValues)
      
      if(frameData == '') {
        let controlKey = `${cf.apiFieldKey}-${actionSecIndex}-${rowIndex}-${rindex}`;
        this.sibForm.addControl(controlKey, new FormControl(val));
        let flag = (cf.isMandatary == 1) ? true : false;
        this.setFormValidation(flag, controlKey);

        this.formFields[this.stepIndex][this.stepTxt].push({
          actionIndex: actionSecIndex,
          apiFieldKey: cf.apiFieldKey,
          displayFlag: cf.displayFlag,
          fieldName: cf.fieldName,
          fieldType: cf.fieldType,
          findex: rindex,
          formatAttr: cf.apiFieldType,
          formatType: cf.apiValueType,
          formValue: val,
          formValueIds: val,
          formValueItems: val,
          group: 0,
          isArray: cf.isArray,
          isMandatary: cf.isMandatary,
          optField: false,
          placeholder: cf.placeholder,
          rowIndex: rowIndex,
          sec: sectionIndex,
          selection: cf.selection,
          threadType: cf.threadType,
          valid: cf.valid,
          sibActions: true
        });
      }
    });

    let fieldRows = [];
    fieldRows = fieldData.rowItems;
    fieldRows.push(frameRows);
    console.log(fieldRows)
  }
  
  // Set Form Validation
  setFormValidation(flag, field) {
    if(flag) {
      this.sibForm.controls[field].setValidators([Validators.required]);
    }
  }

  // Get Field Data
  getData(action, sec, fi, apiUrl, apiData, extraField, actionIndex = -1, rowIndex = -1) {
    let apiName = rowIndex < 0 ? fi.apiName : apiUrl;
    apiUrl = `${this.baseApiUrl}/${apiName}`;
    let body: HttpParams = new HttpParams();
    Object.keys(apiData).forEach(key => {
      let value:any = apiData[key];
      body = body.append(key, value);
    });
    
    console.log(sec, fi, rowIndex)
    let dfi = fi;
    let actionId = 0;
    let actionFlag = false;
    if(rowIndex >= 0) {
      actionFlag = true;      
    }
    if(actionIndex >= 0) {
      let apiField = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['sib'][actionIndex].sibActions;
      let chkId = apiField.findIndex(option => option.fieldName == 'id');
      actionId = apiField[chkId].selectedValues;
    }
    fi = (rowIndex < 0) ? fi : fi.cellAction;
    let cfi = (rowIndex < 0) ? fi : fi[0];

    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      let status = response.status;
      let fieldName;
      if(rowIndex < 0) {
        fi.disabled = false;
        fi.loading = fi.disabled;
        fieldName = fi.fieldName;
      } else {
        fieldName = cfi.fieldName;
      }
      console.log(fieldName)
      switch (fieldName) {
        case "workstreams":
          fi.itemValues = response['workstreamList'];
          let workstreamVal = (this.sibId == 0 && fi.autoselection == 1) ? fi.workstreamValues : fi.selectedIds;
          workstreamVal = (workstreamVal == undefined) ? [] : workstreamVal;
          if(workstreamVal.length > 0) {
            let windex = fi.itemValues.findIndex(option => option.id == workstreamVal[0].id); 
            if(windex >= 0) {
              let itemVal = fi.itemValues[windex];
              workstreamVal[0].key = itemVal.key;
              workstreamVal[0].editAccess = itemVal.editAccess;
            }            
          }
          break;
        case 'cutOffFrame':
          console.log(apiData, extraField)
          if(status == 'Success' && rowIndex >= 0) {
            extraField.actionItems[0].disable = false;
          }
          if(actionId > 0) {
            this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].editIndex = actionIndex;
          }
          let cutoffFields = fi;
          cutoffFields.forEach(cf => {
            let field = cf.fieldName;
            let formField = this.formFields[this.stepIndex][this.stepTxt];
            let findex, formFieldData, formatType, formVal;
            console.log(status, field)
            if(status == 'Failure' && field == 'cutOffFrame') {
              cf.vinValid = (status == 'Success') ? true : false;
              cf.invalidFlag = !cf.vinValid;
              formField.valid = false;
              return false;
            } 
            
            cf.displayFlag = (status == 'Success') ? true : false;
            switch (field) {
              case 'cutOffFrame':
                let frameVal = apiData.frameNo;
                cf.vinValid = true;
                cf.editFrame = true;
                cf.invalidFlag = !cf.vinValid;
                cf.selectedValues = frameVal;
                formVal = frameVal;
                cf.selectedValueIds = frameVal;
                cf.selectedVal = frameVal;
                formVal = frameVal;
                formField.valid = true;
                console.log(cf)
                break;
              case 'modelInfo':
                cf.selectedValues = (status == 'Success') ? response['model'] : '';
                formVal = cf.selectedValues;
                break;
              case 'cutOffFrameNo':
                cf.selectedValues = (status == 'Success') ? response['cutOffFrameNo'] : '';
                formVal = cf.selectedValues;
                break;
              case 'frameRange':
                let val = (status == 'Success') ? response['frameRange'] : '';
                console.log(val)
                let monthTxt = (val > 1) ? `${this.monthTxt}s` : this.monthTxt;
                cf.selectedValues = (status == 'Success') ? `${val} ${monthTxt}` : '';
                cf.selectedValueIds = val;
                cf.selectedVal = val;
                formVal = val;
                break;
              case 'startFrameNo':
                let resVal = (status == 'Success') ? response['startFrameNo'] : '';
                cf.selectedValues = resVal;
                cf.selectedValueIds = resVal;
                cf.selectedVal = resVal;
                formVal = resVal;
                break;  
              case 'id':
                formVal = cf.selectedValues;
                break;  
            }
            console.log(formVal)
            findex = formField.findIndex(option => option.fieldName == field && option.actionIndex == actionIndex && option.rowIndex == rowIndex);
            formFieldData = formField[findex];
            formatType = formFieldData.formatType == 1;
            formFieldData.formValue = formVal;
            formFieldData.formValueIds = formVal;
            formFieldData.formValueItems = formVal;
            let sec = formFieldData.sec;
            console.log(formFieldData, sec, this.apiFormFields[this.stepIndex][this.stepTxt][sec])
            this.apiFormFields[this.stepIndex][this.stepTxt][2].mainActionItems[0].disable = false;
          });
          console.log(cutoffFields, this.formFields)
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
    this.sibApiData['uploadedItems'] = this.uploadedItems.items;
    this.sibApiData['attachments'] = this.uploadedItems.attachments;
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
      formGroup: this.sibForm      
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
        formGroup: this.sibForm      
      }
      this.commonApi.emitDynamicFieldData(data);
    }, 100);
  }

  // Add SIB Action
  addSIB(f, sec, actionLen, flag, editIndex) {
    console.log(f, sec, actionLen, flag, editIndex)
    if(!flag && editIndex < 0 && this.sibId == 0) {
      this.actionFlag = true;
      this.onSubmit(actionLen, sec);
      this.submitDisabled = false;
    } else {
      if(!flag) {
        let newFlag = (editIndex < 0) ? true : false;
        let sibFields = f['cells']['sib'];
        sibFields.forEach(item => {
          item.sibActions.forEach(sitem => {
            if(sitem.fieldName == 'id' && sitem.selectedVal == 0) {
              newFlag = false;
            } 
          });
        });
        if(newFlag) {
          this.addSIBAction(actionLen, sec, 0, 'empty');
          this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].disable = true;
        } else {
          this.actionFlag = true;
          this.submitDisabled = false;
          this.onSubmit(actionLen, sec);
        }
      }      
    }
  }

  // Submit Action
  submitAction() {
    if(!this.submitDisabled) {
      console.log(this.formFields)
      let len = '', sec:any = 2;
      this.onSubmit(len, sec, 'publish');
    }    
  }

  // SIB Onsubmit
  onSubmit(actionLen:any = '', sec ='', actionType = '') {
    console.log(this.apiFormFields, this.formFields, this.sibForm)
    this.step1Submitted = (this.step1Action && !this.step2Action) ? true : false;
    this.step2Submitted = (this.step1Action && this.step2Action) ? true : false;
    this.pageInfo.step1Submitted = this.step1Submitted;
    this.pageInfo.step2Submitted = this.step2Submitted;
    this.pageInfo.uploadedItems = this.uploadedItems;
    let submitFlag = true;
    this.actionFlag = (actionLen == '') ? false : true;
    console.log(this.formFields[this.stepIndex][this.stepTxt], this.stepIndex, this.stepTxt);
    for(let f of this.formFields[this.stepIndex][this.stepTxt]) {
      let formVal = f.formValue;
      let selVal = f.selectedVal;
      if(formVal == 'undefined' || formVal == undefined) {
        formVal = (f.formatType == 1) ? '' : [];
        selVal = (f.formatType == 1) ? '' : [];
      }
      if(f.fieldName == 'cutOffFrame') {
        console.log(f);
        let sec = f.sec;
        let actionIndex = f.actionIndex;
        let rowIndex = f.rowIndex;
        let findex = f.findex;
        //let frameField = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['sib'][actionIndex]['sibActions'][findex]['rowItems'][rowIndex]['cellAction'][findex];
      }
      f.formValue = formVal;
      f.selectedVal = selVal;
      if((f.displayFlag) && !f.valid) {
        submitFlag = f.valid;
      }
    }

    if(!submitFlag) {
      let data = {
        action: 'submit',
        pageInfo: this.pageInfo,
        step1Submitted: this.step1Submitted,
        step2Submitted: this.step2Submitted,
        formGroup: this.sibForm
      }
      this.commonApi.emitDynamicFieldData(data);
      if(this.actionFlag) {
        this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].disable = false;
      }
      this.errorSecTop();
      return;
    }

    let sibAction: any = this.actionFlag;
    if(sibAction) {
      this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].disable = true;
      this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].editIndex = -1;
      localStorage.setItem('sibAction', sibAction);
      this.secSubmit = true;
    } else {
      localStorage.removeItem('sibAction');
    }     
    let empty = [];
    this.sibSubmit(actionLen, sec, empty, actionType);
  }
  
  // Error Section Scroll
  errorSecTop(action = '') {
    let id, addPos;
    let timeout = 200;
    if(action != '') {
      id = action;
      addPos = 0;
    } else {
      id = 'valid-error';
      addPos = 80;
    }
    let secElement = document.getElementById('step');
    let errElement = document.getElementById(id);
    if(errElement) {
      let scrollTop = errElement.offsetTop;
      setTimeout(() => {
        if(action == '') {
          this.scrollPos = scrollTop+addPos;
          secElement.scrollTop = this.scrollPos;
        } else {
          errElement.scrollIntoView();
        }
      }, timeout);
    }
  }

  // Scroll to element
  scrollToElem() {
    let element = 'step';
    const itemToScrollTo = document.getElementById(element);
    if (itemToScrollTo) {
      itemToScrollTo.scrollIntoView(true);
    }
  }

  // SIB Submit
  sibSubmit(actionLen:any = '', sec:any ='', secData: any = [], actionType = '') {
    console.log(this.formFields, this.pageInfo, this.uploadedItems);
    let isMain:any = true;
    let sibId:any = (this.sibId > 0) ? this.sibId : this.sibSecId;
    sec = (sec == '') ? 2 : sec;
    if(!isMain) {
      this.step1Submitted = true;
      this.pageInfo.step1Submitted = this.step1Submitted;
    }
    let sibSec = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['sib'];
    isMain = (sibSec.length == 1 && !this.secSave) ? true : false;
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let sibFormData = new FormData();
    sibFormData.set('apiKey', this.apiKey);
    sibFormData.set('domainId', this.domainId);
    sibFormData.set('userId', this.userId);
    if(this.sibId > 0 || !isMain) {
      sibFormData.set('sibId', sibId);
    }
    let getSIBUpdate = localStorage.getItem('sibFieldUpdate');
    isMain = (getSIBUpdate == 'undefined' || getSIBUpdate == undefined || getSIBUpdate == '') ? false : getSIBUpdate;
    let sibUpdateFlag:any = false;
    sibFormData.set('isMain', isMain);
    let groups = [];
    let sibRows = this.formFields[this.stepIndex][this.stepTxt].filter(option => option.actionIndex >= 0 && option.rowIndex >= 0 && option.fieldName == 'cutOffFrame');
    //console.log(sibRows, secData, this.formFields)
    let sibEditIndex = this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].editIndex;
    let checkActionIndex = (this.secSave) ? actionLen : sibSec.length-1;
    let actionField = sibSec[checkActionIndex].sibActions;
    let actionId:any = 0;
    let sibActionFlag:any = false;
    if(this.secSave) {
      sibActionFlag = true;
      sibUpdateFlag = false;
      localStorage.setItem('sibAction', sibActionFlag)
      let chkData = secData.sibActions;
      let aindex = chkData.findIndex(option => option.fieldName == 'id');
      actionId = chkData[aindex].selectedValues;
      console.log(actionId)
    } else {
      console.log(sibEditIndex)
      if(sibEditIndex >= 0) {
        sibUpdateFlag = true;
        checkActionIndex = sibEditIndex;
        actionField = sibSec[checkActionIndex].sibActions;
        let chkData = sibSec[checkActionIndex].sibActions;
        let aindex = chkData.findIndex(option => option.fieldName == 'id');
        actionId = chkData[aindex].selectedValues;
      }
      sibSec.forEach(sec => {
        sec.sibActions.forEach(sf => {
          if(sf.fieldName == 'id') {
            if(sf.selectedValues == 0) {
              sibActionFlag = true;
            }
          }
        });
      });
    }
    this.apiFormFields[this.stepIndex][this.stepTxt][sec].mainActionItems[0].editIndex = -1;
    sibFormData.set('sibActionId', actionId);
    let sibActions = [{id: actionId, frameNumbers: [], content: '', tags: '', partsInfo: '', uploadContents: [], updatedAttachments: [], deletedFileIds: [], removeFileIds: []}];
    console.log(this.sibId, sibActionFlag, !this.secSave, sibUpdateFlag)
    if(this.sibId == 0 || sibActionFlag || (!this.secSave && sibUpdateFlag)) {
      sibRows.forEach((item, index) => {
        if(checkActionIndex == item.actionIndex) {
          sibActions[0].frameNumbers.push({
            id: 0,
            cutOffFrameNo: '',
            modelInfo: '',
            frameRange: '',
            startFrameNo: ''
          });
        }
      });
    }

    for(let i in this.formFields) {
      let index = parseInt(i)+1;
      let step = `step${index}`;
      let sibFlag;
      for(let s of this.formFields[i][step]) {
        let formVal = s.formValue;
        if(formVal == 'undefined' || formVal == undefined) {
          formVal = (s.formatType == 1) ? '' : [];
        }          
        formVal = (!s.sibActions && Array.isArray(s.formValue) && formVal.length > 0) ? JSON.stringify(formVal) : formVal;
        console.log(s.fieldName, formVal)
        
        if(!s.sibActions) {
          if(s.fieldName == 'releaseDate') {
            formVal = (formVal != '') ? moment(formVal).format('YYYY-MM-DD') : '';
          }  

          if(s.apiFieldKey == 'groups') {
            groups = formVal;
          }
          if(s.displayFlag) {
            sibFormData.append(s.apiFieldKey, formVal);    
          }
        } else {
          console.log(sibActionFlag, this.secSave, sibUpdateFlag)
          if(this.sibId == 0 || sibActionFlag || (!this.secSave && sibUpdateFlag)) {
            let actionIndex = s.actionIndex;
            let rowIndex = s.rowIndex;
            if(checkActionIndex == actionIndex) {
              console.log(s, checkActionIndex)
            
              let actionIndex = 0;
              switch (s.fieldName) {
                case 'id':
                  if(rowIndex >= 0)
                    sibActions[actionIndex].frameNumbers[rowIndex].id = formVal;
                  break;
                case 'cutOffFrame':
                  sibActions[actionIndex].frameNumbers[rowIndex].cutOffFrameNo = formVal; 
                  break;
                case 'modelInfo':
                  sibActions[actionIndex].frameNumbers[rowIndex].modelInfo = formVal;
                  break;                
                case 'frameRange':
                  sibActions[actionIndex].frameNumbers[rowIndex].frameRange = formVal;
                  break;                
                case 'startFrameNo':
                  sibActions[actionIndex].frameNumbers[rowIndex].startFrameNo = formVal;
                  break;
                case 'content':
                  sibActions[actionIndex].content = formVal;
                  break;
                case 'tags':
                  sibActions[actionIndex].tags = formVal;
                  break;
                case 'parts':
                  sibActions[actionIndex].partsInfo = formVal;
                  break;
                case 'uploadContents':
                  console.log(actionField, actionField[s.findex])
                  console.log(s)
                  this.uploadedItems = (s.uploadedItems == undefined || s.uploadedItems == 'undefined') ? [] : s.uploadedItems;
                  sibActions[actionIndex].uploadContents = [];
                  sibActions[actionIndex].updatedAttachments = actionField[s.findex].updatedAttachments;
                  sibActions[actionIndex].deletedFileIds = actionField[s.findex].deletedFileIds;
                  sibActions[actionIndex].removeFileIds = actionField[s.findex].removeFileIds;
                  setTimeout(() => {
                    s.uploadedItems = [];
                    actionField[s.findex].updatedAttachments = [];
                    actionField[s.findex].deletedFileIds = [];
                    actionField[s.findex].removeFileIds = [];
                  }, 500);
                  break;
              }
            }
          }          
        }        
        //console.log(sibActions)
      }
    }

    if(this.sibId == 0 || sibActionFlag || (!this.secSave && sibUpdateFlag)) {
      sibFormData.append('sibActions', JSON.stringify(sibActions));
    }
    
    setTimeout(() => {
      this.sibApi.createSIB(sibFormData).subscribe((response) => {
        console.log(response)
        modalRef.dismiss('Cross click');
        this.bodyElem.classList.remove(this.bodyClass);
        this.successMsg = response.result;
        let msgFlag = true;
        localStorage.removeItem('sibFieldUpdate');
        if(response.status == "Success") {
          this.step1Submitted = false;
          let action = 'submit';
          let getSIBAction = localStorage.getItem('sibAction');
          let sibActionFlag = (getSIBAction == 'undefined' || getSIBAction == undefined || getSIBAction == '') ? false : getSIBAction;
          console.log(sibActionFlag)
          let res = response;
          let threadId = response.sibId;
          let postId = response.sibActionId;
          this.sibSecId = threadId;
          this.pageInfo.sibId = threadId;
          this.sibInfo = response.sibDetails[0];
          console.log(threadId, this.uploadedItems)
          if(this.sibId > 0) {
            //let sibInfo = response.dataInfo[0];
            let sibInfo = '';
            let url = RedirectionPage.SIB;
            let flag: any = true;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            /*let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
            localStorage.setItem(pageTitle[pageDataIndex].navEdit, 'true');
            localStorage.setItem(pageDataInfo, JSON.stringify(sibInfo));*/
            let navEditText = pageTitle[pageDataIndex].navEdit;
            let routeLoadText = pageTitle[pageDataIndex].routerText;
            localStorage.setItem(navEditText, flag);
            localStorage.setItem(routeLoadText, flag);
          }
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0) {
            msgFlag = false;
            this.pageInfo.threadUpload = false;
            this.pageInfo.contentType = this.contentType;
            this.pageInfo.dataId = postId;
            this.pageInfo.threadId = threadId;
            this.pageInfo.navUrl = this.navUrl;
            this.pageInfo.threadAction = (this.sibId > 0) ? 'edit' : 'new';
            this.pageInfo.manageAction = 'uploading';
            this.pageInfo.uploadedItems = this.uploadedItems.items;
            this.pageInfo.attachments = this.uploadedItems.attachments;
            //this.pageInfo.pushFormData = pushFormData;
            this.pageInfo.message = this.successMsg;
            sibUpdateFlag = (!sibActionFlag && this.sibId > 0) ? true : sibUpdateFlag;
            this.pageInfo.actionIndex = (sibActionFlag && !sibUpdateFlag && actionType == '') ? actionLen : -1;
            this.pageInfo.sibFields = (sibActionFlag) ? sec : [];
            if(sibActionFlag || sibUpdateFlag) {
              this.pageInfo.sibInfo = this.sibInfo;
            }
            let data = {
              action: 'sib-submit',
              pageInfo: this.pageInfo,
              step1Submitted: this.step1Submitted,
              step2Submitted: this.step2Submitted,
              formGroup: this.sibForm
            }
            this.commonApi.emitDynamicFieldData(data);
            setTimeout(() => {
              this.uploadInterval = setInterval(() => {
                let chkUploadStatus = localStorage.getItem('sibUpload');
                if (chkUploadStatus) {
                  console.log('in sib upload');
                  clearInterval(this.uploadInterval);
                  localStorage.removeItem('sibUpload');
                  this.uploadedItems = [];
                  this.pageInfo.uploadedItems = [];
                  this.pageInfo.threadUpload = false;
                  this.pageInfo.uploadedItems = [];
                  this.pageInfo.manageAction = 'new';
                  this.pageInfo.uploadedItems = [];
                  this.pageInfo.attachments = [];
                  this.pageInfo.attachmentItems = [];
                  this.pageInfo.updatedAttachments = [];
                  this.pageInfo.deletedFileIds = [];
                  this.pageInfo.removeFileIds = [];
                  let udata = {
                    action: 'sib-upload-success',
                    pageInfo: this.pageInfo,
                    step1Submitted: this.step1Submitted,
                    step2Submitted: this.step2Submitted,
                    formGroup: this.sibForm
                  }
                  this.commonApi.emitDynamicFieldData(udata);
                  setTimeout(() => {
                    let apiData = new FormData;
                    apiData.append('apiKey', Constant.ApiKey);
                    apiData.append('domainId', this.domainId);
                    apiData.append('userId', this.userId);
                    apiData.append('sibId', threadId);
                    
                    this.sibApi.getSibDetail(apiData).subscribe((response: any) => {
                      console.log(response);
                      this.sibInfo = response.sibData[0];
                      setTimeout(() => {
                        this.sibActionCallback(actionLen, sec, postId, action);
                        this.pageInfo.threadUpload = true;
                        let udata = {
                          action: 'sib-attachment',
                          pageInfo: this.pageInfo,
                          step1Submitted: this.step1Submitted,
                          step2Submitted: this.step2Submitted,
                          formGroup: this.sibForm
                        }
                        this.commonApi.emitDynamicFieldData(udata);
                      }, 500);
                    });  
                  }, 1500);
                }
              }, 50)
            }, 1500);
          }
          if(msgFlag) {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              //let sibActionFlag = true;
              sibUpdateFlag = (!sibActionFlag && this.sibId > 0) ? true : sibUpdateFlag;
              if(!this.secSave && (!sibActionFlag || sibUpdateFlag)) {
                if(this.teamSystem) {
                  window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
                } else {
                  if(this.navUrl == 'sib') {
                    window.close();
                    window.opener.location = this.navUrl;
                  } else {
                    this.router.navigate([this.navUrl]);
                  }
                }
              } else {
                let data = {
                  action: 'submit',
                  pageInfo: this.pageInfo,
                  step1Submitted: this.step1Submitted,
                  step2Submitted: this.step2Submitted,
                  formGroup: this.sibForm
                }
                this.commonApi.emitDynamicFieldData(data);
                this.sibActionCallback(actionLen, sec, postId, action);
              }
            }, 3000);
          }
        }
      })
    }, 500);
  }

  // SIB Action Callback
  sibActionCallback(actionLen, sec, postId, action) {
    let actionIndex = (this.secSave) ? actionLen : actionLen - 1; 
    let sibSec = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['sib'][actionIndex];
    console.log(this.secSave, actionLen, action, actionIndex, sibSec)
    this.setupSIBSecFields(false, sibSec, postId, action, actionIndex);
    localStorage.removeItem('sibSectionData');
    localStorage.removeItem('formFields');
    setTimeout(() => {
      this.errorSecTop('sib-actions');
      if(!this.secSave)
        this.addSIBAction(actionLen, sec);
    }, 500);    
  }

  // Add SIB Action
  addSIBAction(actionLen, sec, id = 0, action = '') {
    let sibActions = JSON.parse(localStorage.getItem('sibActions'));
    let sibSec = this.apiFormFields[this.stepIndex][this.stepTxt][sec]['cells']['sib'];
    sibSec.push({'sibActions': sibActions});
    let tabFlag: any = true;
    let i = actionLen-1;
    //id = actionLen;
    console.log(sibSec, actionLen, i, id, this.secTabStatus)
    sibSec.forEach((af, ai) => {
      if(ai == actionLen) {
        console.log(af, ai, i)
        this.initSIB(sec, af, ai, id);
        this.secTabStatus.push(tabFlag);
        setTimeout(() => {
          this.secTabStatus.forEach((tab, index) => {
            console.log(actionLen, index)
            let tabSecFlag: any = (actionLen == index) ? true : false;
            this.secTabStatus[index] = tabSecFlag;
          });
          this.errorSecTop('sib-actions');
          console.log(actionLen, this.secTabStatus, this.apiFormFields)
        }, 50);
      }   
    });
  }

  // Init SIB Fields
  initSIB(sec, af, sac, scid = 0, sibData: any = '') {
    console.log(af, sac, scid, sibData)
    let action = 'onload';
    let fieldFlag = true;
    let dataFlag = (sibData != '') ? true : false;
    let val: any = '', formVal:any = '', formValueIds:any = '', formValueItems:any = '';
    let apiInfo = this.baseApiInfo();
    af.sibActions.forEach((df, ac) => {
      console.log(af)
      df.disabled = false;
      df.loading = false;
      df.valid = (df.isMandatary == 1) ? false : true;
      df.isNumeric = false;
      df.lazyLoading = false;
      
      if(df.fieldType == 'frame-input') {
        df.editFrame = false;
        df.actionItems[0].disable = true;
      }
      df.saveFlag = (scid == 0 && !dataFlag) ? true : false;
      if(df.rowItems.length > 0) {
        df.rowItems.forEach((fr, ri) => {
          fr.cellAction.forEach((fc, o) => {
            fc.editFlag = (dataFlag) ? false : true;
            fc.disabled = !fc.editFlag;
            fc.displayFlag = (df.fieldType == 'frame-input' && fc.fieldType != 'frame-input') ? false : true;
            fc.recentShow = false;
            fc.lazyLoading = false;
            fc.loading = false;
            fc.valid = (fc.isMandatary == 1 && !dataFlag) ? false : true;
            fc.isNumeric = false;
            fc.isArray = (fc.apiValueType == 1) ? false : true;
            fc.selectedValueIds = (fc.apiValueType == 1) ? "" : [];
            fc.selectedValues = (fc.apiValueType == 1) ? (fc.fieldName == 'odometer') ? null : "" : [];
            fc.selectedVal = (fc.apiValueType == 1) ? "" : [];
            val = (fc.apiValueType == 1) ? "" : [];
            console.log(ri, fc, fc.fieldName, fc.selectedValues)

            switch (fc.fieldName) {
              case 'cutOffFrame':
                fc.actionId = (dataFlag) ? sibData.frameNumbers[ri]['id'] : 0;
                fc.vinValid = (dataFlag) ? true : false;
                fc.invalidFlag = false;
                fc.invalidError = `Invalid ${fc.placeholder}`;
                fc.closeFlag = false;
                fc.duplicateFlag = false;
                fc.duplicateError = `Duplicate ${fc.placeholder}`;
                fc.verifyError = `Verify ${fc.placeholder}`;
                break;
              case 'id':
                val = (dataFlag) ? sibData.frameNumbers[ri][fc.threadInfoApiKey] : 0;
                fc.selectedValueIds = val;
                fc.selectedValues = val;
                fc.selectedVal = val;
                break;
              default:
                fc.displayFlag = (dataFlag) ? true : false;
                break;  
            }
            
            if(dataFlag) {
              fc.recentShow = false;
              let threadVal = sibData.frameNumbers[ri][fc.threadInfoApiKey];
              val = threadVal;
              console.log(sac, ri, fc, sibData.frameNumbers[ri], sibData.frameNumbers[ri][fc.threadInfoApiKey], threadVal)
              fc.selectedValueIds = threadVal;
              fc.selectedValues = threadVal;
              fc.selectedVal = threadVal;
              fc.valid = true;
              formVal = threadVal;
              formValueIds = threadVal;
              formValueItems = threadVal;
              if(fc.fieldName == 'frameRange') {
                let monthTxt = (val > 1) ? `${this.monthTxt}s` : this.monthTxt;
                fc.selectedValues = `${val} ${monthTxt}`;
              }
              if(threadVal != "" && fc.isMandatary == 1) {
                fc.valid = true;
              }
            }
            
            let controlKey = `${fc.apiFieldKey}-${sac}-${ac}-${ri}`;
            console.log(controlKey, fc.valid)
            this.sibForm.addControl(controlKey, new FormControl(val));
            let flag = (fc.isMandatary == 1) ? true : false;
            this.setFormValidation(flag, controlKey);
            
            if(fieldFlag) {
              this.formFields[this.stepIndex][this.stepTxt].push({
                actionIndex: sac,
                apiFieldKey: fc.apiFieldKey,
                displayFlag: fc.displayFlag,
                fieldName: fc.fieldName,
                fieldType: fc.fieldType,
                findex: o,
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
                rowIndex: ri,
                sec: sec,
                selection: fc.selection,
                threadType: fc.threadType,
                valid: fc.valid,
                sibActions: true
              });
              o++;
            }
          });
        });
      }  else {
        df.editFlag = (dataFlag) ? false : true;
        df.disabled = !df.editFlag;
        df.displayFlag = true;
        df.recentShow = true;
        df.isNumeric = false;
        df.lazyLoading = false;
        df.loading = false;
        df.isArray = (df.apiValueType == 1) ? false : true;
        df.selectedValueIds = (df.apiValueType == 1) ? "" : [];
        df.selectedValues = (df.apiValueType == 1) ? "" : [];
        df.selectedVal = (df.apiValueType == 1) ? "" : [];
        val = (df.apiValueType == 1) ? "" : [];
        if(df.fieldType == 'slider' && this.sibId == 0) {
          let sliderVal = df.minValue;
          df.selectedValueIds = sliderVal;
          df.selectedValues = sliderVal;
          df.selectedVal = sliderVal;
          df.showTicks = true;
        }
        if(df.fieldName == 'uploadContents') {
          df.updatedAttachments = [];
          df.deletedFileIds = [];
          df.removeFileIds = [];
        }
        if(this.sibId > 0 && dataFlag) {
          df.recentShow = false;
          let threadVal;
          if(this.sibId > 0) {
            threadVal = sibData[df.threadInfoApiKey];
          } else {
            threadVal = df.workstreamValues;
          }              
                   
          if(df.selection == 'multiple') {
            console.log(df.fieldName, threadVal)
            let id = [];
            let name = [];
            df.selectedIds = threadVal;
            
            console.log(df, df.selectedIds);
            let code = [];
            for(let item of df.selectedIds) {
              id.push(item.id);
              name.push(item.name);
            }
            
            df.selectedValueIds = id;
            df.selectedValues = name;
            df.selectedVal = name;
            val = threadVal;
            formVal = (df.apiFieldType == 1) ? id : name;
            formValueIds = id;
            formValueItems = name;
            console.log(formVal)
            //console.log(df.fieldName, threadVal.length)
            if(df.fieldName == 'uploadContents') {
              //this.pageInfo.attachmentItems = threadVal;
              let uval = [];
              df.selectedValueIds = uval;
              df.selectedValues = uval;
              df.selectedVal = uval;
              val = uval;
              formVal = uval;
              formValueIds = uval;
              formValueItems = uval;
            }
            if(threadVal.length > 0 && df.isMandatary == 1) {
              df.valid = true;
            }
          } else {
            console.log(df.fieldName, threadVal)
            df.selectedValueIds = threadVal;
            df.selectedValues = threadVal;
            df.selectedVal = threadVal;
            val = threadVal;
            formVal = threadVal;
            formValueIds = threadVal;
            formValueItems = threadVal;
            switch(df.fieldName) {
              case 'SystemSelection':
              case 'SelectProductType':
                let id, name;
                for(let item of threadVal) {
                  id = item.id;
                  name = item.name;
                } 
                let val = (df.apiFieldType == 1) ? id : name;
                formVal = (df.apiValueType == 1) ? val : [val];
                formValueIds = id;
                formValueItems = name;
                if(df.fieldName == 'SystemSelection' && threadVal.length > 0) {
                  df.selectedValueIds = id;
                  df.selectedValues = name;
                  df.selectedVal = name;
                }
                break;
            }
            
            if(threadVal != "" && df.isMandatary == 1) {
              df.valid = true;
            }
          }
          console.log(df, df.fieldName, df.threadInfoApiKey, sibData[df.threadInfoApiKey])
        }
        let threadItemVal = '';
        let formFields = this.formFields[this.stepIndex][this.stepTxt];
        let wsIndex = formFields.findIndex(option => option.fieldName == 'workstreams');
        console.log(df.fieldName)
        switch (df.fieldName) {
          case 'threadType':
            let itemLen = df.itemValues.length;
            let itemClass = (itemLen == 1) ? 'col-md-6' : (itemLen > 1 && itemLen < 4) ? `col-md-${12/itemLen}` : 'col-md-4';
            for(let i of df.itemValues) {
              i.itemClass = itemClass;
              if(i.apiValue == df.selectedVal) {
                threadItemVal = i.name;
              }
            }
            break;
          case 'partsToggle':
            //df.displayFlag = (this.sibId > 0 || formFields[wsIndex].valid) ? true: false;
            df.displayFlag = true;
            df.selection = (dataFlag && sibData['partsInfo'].length > 0) ? true : false;
            break;
          case 'parts':
            //df.displayFlag = (this.sibId > 0) ? true: false;
            df.displayFlag = (dataFlag && sibData[df.threadInfoApiKey].length > 0) ? true : false;
            break;
          case 'id':
            console.log(scid)
            val = scid;
            formVal = val;
            formValueIds = val;
            formValueItems = val;
            df.selectedValueIds = val;
            df.selectedValues = val;
            df.selectedVal = val;
            break;
          case 'uploadContents':
            val = [];
            formVal = val;
            formValueIds = val;
            formValueItems = val;
            df.selectedValueIds = val;
            df.selectedValues = val;
            df.selectedVal = val;
            df.callback = true;
            if(dataFlag) {
              df.uploadAction = 'view';
            }
            df.uploadContents = (dataFlag) ? sibData[df.threadInfoApiKey] : []
            break;  
        }
    
        if(df.apiName != '') {
          let loadApi = true;
          let apiUrl = df.apiName;
          //console.log(apiUrl);
          console.log(df)
          let apiData = apiInfo;
          let query = (df.queryValues == "") ? "" : JSON.parse(df.queryValues);
          let formFieldItems = this.formFields[this.stepIndex][this.stepTxt];
          let wsIndex = formFieldItems.findIndex(option => option.fieldName == 'workstreams');
          let ws, wsFormField, wsApiField, apiAccess;
          let extraField = [];
          switch (df.fieldName) {
            case "workstreams":
            apiData['type'] = 1;
            break;
            
            default:
            loadApi = false;
            break;
          }
      
          if(loadApi) {
            df.disabled = true;
            df.loading = df.disabled;
            setTimeout(() => {
            extraField = [];
            // Get field data
            this.getData(action, sec, df, apiUrl, apiData, extraField);
            }, 1500);
          }
        }
        
        if(this.sibId == 0) {
          if(df.fieldType == 'toggle') {
            df.selection = false;
          }
          val = (df.apiValueType == 1) ? "" : [];
        }
        
        let dcontrolKey = `${df.apiFieldKey}-${sac}-${ac}`;
        console.log(dcontrolKey, df.displayFlag)
        this.sibForm.addControl(dcontrolKey, new FormControl(val));
        
        let flag = (df.isMandatary == 1) ? true : false;
        this.setFormValidation(flag, dcontrolKey);
        
        if(fieldFlag) {
          console.log(df, formVal);
          let onloadFlag = (this.sibId == 0) ? true : false;
          onloadFlag = (this.sibId == 0 && df.fieldName == 'workstreams' && df.autoselection == 0) ? true : false;
          if(val == 'undefined' || val == undefined) {
            val = (df.apiValueType == 1) ? "" : [];
          }
          this.formFields[this.stepIndex][this.stepTxt].push({
            actionIndex: sac,
            apiFieldKey: df.apiFieldKey,
            displayFlag: df.displayFlag,
            fieldName: df.fieldName,
            fieldType: df.fieldType,
            findex: ac,
            formatAttr: df.apiFieldType,
            formatType: df.apiValueType,
            formValue: (onloadFlag) ? val : formVal,
            formValueIds: (onloadFlag) ? val : formValueIds,
            formValueItems: (onloadFlag) ? val : formValueItems,
            group: sec.groups,
            isArray: df.isArray,
            isMandatary: df.isMandatary,
            optField: false,
            placeholder: df.placeholder,
            rowIndex: -1,
            sec: sec,
            selection: df.selection,
            selectedVal: threadItemVal,
            threadType: df.threadType,
            valid: df.valid,
            vinNo: df.vin,
            sibActions: true
          });  
        }            
      }
    });
    console.log(this.sibForm)
  }

  // Close Current Window
  closeWindow() {
    let popupFlag = (this.sibId == 0 && this.stepTxt == 'step1') ? false : true;
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
          //window.close();
          if(this.navUrl == 'sib') {
            window.close();
          } else {
            this.router.navigate([this.navUrl]);
          }
        }
      }
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
            //window.close();
            if(this.sibId == 0) {
              window.close();
            } else {
              let url = RedirectionPage.SIB;
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
    
    if(!this.step1Loading) {
      setTimeout(() => {
        let panelWidth = document.getElementById('form-cont').offsetWidth;
        this.pageInfo.panelWidth = panelWidth-80;
        this.pageInfo.panelHeight = this.innerHeight;
        let data = {
          action: 'panel-width',
          pageInfo: this.pageInfo,
          step1Submitted: this.step1Submitted,
          step2Submitted: this.step2Submitted,
          formGroup: this.sibForm      
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

  // Setup SIB Action Fields Edi Flag
  setupSIBSecFields(flag, actionFields, scId = 0, action = '', actionIndex = -1) {
    console.log(flag, action, actionFields, this.sibInfo)
    let val, formVal, formValueIds, formValueItems, findex;
    let formField = this.formFields[this.stepIndex][this.stepTxt];
    actionFields = actionFields.sibActions;
    let sibDetails = (action == '') ? [] : this.sibInfo.sibActions;
    let sibInfo = [];
    let frameInfo = [];
    sibDetails.forEach((s, si) => {
      if(s.id == scId) {
        sibInfo = sibDetails[si];
      }
    });
    console.log(actionFields, sibInfo)

    actionFields.forEach(item => {
      item.saveFlag = flag;
      if(item.rowItems.length > 0) {        
        console.log(item)
        item.actionItems[0].action = (action == 'edit') ? true : false;
        item.actionItems[0].disable = (action == 'edit') ? false : true;
        item.rowItems.forEach((rowItem, rowIndex) => {
          console.log(item.rowItems[rowIndex].cellAction)
          let rowId = item.rowItems[rowIndex].cellAction.findIndex(option => option.fieldName == 'id'); 
          console.log(rowId)
          rowItem.cellAction.forEach(rfi => {
            rfi.saveFlag = flag;
            if(action == 'submit') {
              switch(rfi.fieldName) {
                case 'cutOffFrame':
                  rfi.actionId = rowId;
                  break;
                case 'id':
                  frameInfo = sibInfo['frameNumbers'];
                  console.log(sibInfo, actionIndex, rowIndex, frameInfo)
                  val = frameInfo[rowIndex].id;
                  rfi.selectedValueIds = val;
                  rfi.selectedValues = val;
                  rfi.selectedVal = val;
                  findex = formField.findIndex(option => option.actionIndex == actionIndex && option.rowIndex == rowIndex && option.fieldName == rfi.fieldName);
                  console.log(formField, findex)
                  formField[findex].formValue = val;
                  formField[findex].formValueIds = val;
                  formField[findex].formValueItems = val;
                  break;
              }
            } 

            if(action == 'edit') {
              switch(rfi.fieldName) {
                case 'frameRange':
                  rfi.disabled = false;
                  break;
              }
            }
            rfi.editFlag = flag;
          });
        });
      } else {
        item.editFlag = flag;
        item.disabled = !flag;
        let rowIndex = -1;
        findex = formField.findIndex(option => option.actionIndex == actionIndex && option.rowIndex == rowIndex && option.fieldName == item.fieldName);
        console.log(formField, findex, item.fieldName)
        if(item.fieldName == 'id') {
          if(scId > 0) {
            val = scId;
            item.selectedValueIds = val;
            item.selectedValues = val;
            item.selectedVal = val;
            formField[findex].formValue = val;
            formField[findex].formValueIds = val;
            formField[findex].formValueItems = val;
          }
        } else {
          if(item.fieldName == 'uploadContents') {
            item.uploadAction = (flag) ? 'attachments' : 'view';
            console.log(sibInfo['uploadContents'])
            switch(action) {
              case 'submit':
              case 'edit':  
                let uploadedItems = sibInfo['uploadContents'];
                item.uploadContents = uploadedItems;
                item.disabled = !flag;
                item.callback = false;
                setTimeout(() => {
                  item.callback = true;
                  this.errorSecTop('sib-actions');
                }, 100);
                findex = formField.findIndex(option => option.actionIndex == actionIndex && option.fieldName == item.fieldName);
                item.uploadedItems = [];
                item.uploadContents = uploadedItems;
                //if(action == 'edit') {
                  item.updatedAttachments = [];
                  item.deletedFileIds = [];
                  item.removeFileIds = [];
                //}
                break;
              case 'cancel':
                item.updatedAttachments = [];
                item.deletedFileIds = [];
                item.removeFileIds = [];
                break;  
            }
            if(action != '') {
              
            }
          }
        }
      }
    });
    setTimeout(() => {
      if(this.secSave) {
        this.secSave = false;
      }
    }, 1000);
  }

  // Base Api Info
  baseApiInfo() {
    let apiInfo = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      userId: this.userId
    };
    return apiInfo;
  }

  ngOnDestroy() {
    localStorage.removeItem('sibAction');
    this.subscription.unsubscribe();
  }

}