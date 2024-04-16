import { Component, OnInit, HostListener,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../../components/common/confirmation/confirmation.component";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ScrollTopService } from "../../../../services/scroll-top.service";
import { SubmitLoaderComponent } from "../../../../components/common/submit-loader/submit-loader.component";
import { EscalationsService } from '../../../../services/escalations/escalations.service';
import { SuccessModalComponent } from "../../../../components/common/success-modal/success-modal.component";
import { ManageUserComponent } from '../../../../components/common/manage-user/manage-user.component';
import * as moment from 'moment';
import { DatePickerComponent } from 'ng2-date-picker';
import { forumPageAccess, Constant,IsOpenNewTab, windowHeight  } from 'src/app/common/constant/constant';
import { CommonService } from '../../../../services/common/common.service';
import { ManageListComponent } from '../../../../components/common/manage-list/manage-list.component';
import { ProductMatrixService } from "../../../../services/product-matrix/product-matrix.service";

interface yearOption {
  code: number;
  name: string;
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "";
  public pageAccess: string = "kaizen";
  public headerData: Object;
  public loading: boolean = true;
  public step1Action: boolean = true;
  ppfrForm: FormGroup;
  public teamSystem = localStorage.getItem("teamSystem");
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public nextUrl: string = "kaizen";
  public prevUrl: string = "kaizen/view";
  public detailViewUrl: string = "";
  public saveDraftFlag: boolean = true;
  public countryId;
  public countryName;
  public user: any;
  public domainId;
  public userId;
  public innerHeight: number;
  public bodyHeight: number;

  public selectionCountryId: any = [];
  public selectionCountryName: any = [];
  public selectionCountryOption: any = [];
  public partReplaced: string = '';
  public postUpload: boolean = true;
  public manageAction: string;
  public postApiData: object;
  public contentType: number = 46; // Kaizen
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public displayOrder: number = 0;
  public postServerError:boolean = false;
  public postServerErrorMsg: string = '';
  public kaizenViewData: any = [];
  public EditAttachmentAction: string = "attachments";
  public kaizenId: string = '';
  public occuranceFormInfo = [];
  public occurance: any = [];
  public actionInit: string = "init";
  public actionEdit: string = "edit";
  public minDate: any = '';
  public dateFormat:string = "MM/DD/YYYY";
  public datePickerConfig: any = {
    format: this.dateFormat,
    min: this.minDate
  }
  public saveButtonEnable: boolean = false;
  public prevPage: string = '';
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
  public dynamicAddFlag1: boolean = false;
  public dynamicAddFlag2: boolean = false;
  public occuranceInfoEmpty: boolean = false;
  public serviceHistoryInfoEmpty: boolean = false;
  public workstreamItems: any = [];
  public workstreamId: any = [];
  public workstreamSelection: any = [];
  public workstreamValid: boolean = true;
  public defaultWSLabel: string = 'Select Workstream';
  selectedYearOptions: yearOption[];
  public selectedYear: object;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;

  public kaizenTitle: string = '';
  public model: string = '';
  public regnonia: string = '';
  public theme: string = '';
  public complaintsReported: string = '';
  public sevirity: string = '';
  public kaizenFinish: string = '';
  public kaizenUnit: string = '';
  public kaizenArea: string = '';
  public kaizenSino: string = '';
  public territory: string = '';
  public frameNumber: string = '';
  public KMSReading: string = '';
  public problemPresentDesc: string= '';
  public observationDesc: string= '';
  public analysisDesc: string= '';
  public actionTakenDesc: string = '';
  public vehiclesModified: string = '';
  public expensesCostEstimate: string = '';
  public easyImplement: string = '';
  public costSavings: string = '';
  public sideEffectSolution: string = '';
  public modificationCheck: string = '';
  public customerComplaint: string = '';
  public presentedBy: string = '';
  public otherObservation: string = '';
  public dealerName: string = '';
  public otherActionTaken: string = '';
  public otherPlace: string = '';
  public documentApprovalFlag: string = localStorage.getItem('approveProcessEnabled');
  public kaizenAssigneeRoleId: string = '';
  public kaizenUserType: string = '';
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
    private escalationApi: EscalationsService,
    private config: NgbModalConfig,
    private commonApi: CommonService,
    private ProductMatrixApi: ProductMatrixService,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName'));
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }

  // convenience getters for easy access to form fields
   get f() {
    return this.ppfrForm.controls;
  }

  get o(){
    return this.f.occuranceInfo as FormArray;
  }

  ngOnInit(): void {

    let today = moment().add(1, 'd');
    this.minDate = moment(today).format('MM/DD/YYYY');

    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.countryName = localStorage.getItem('countryName');
    this.kaizenAssigneeRoleId=localStorage.getItem('kaizenAssigneeRoleId');
    this.kaizenUserType=localStorage.getItem('kaizenUserType');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;

    this.kaizenId = this.route.snapshot.params['id'];
    this.kaizenId = this.kaizenId != undefined ? this.kaizenId : '' ;

    if(this.kaizenId != ''){
      this.detailViewUrl = "kaizen/view/"+this.kaizenId;
    }

    let year = parseInt(this.currYear);
    let yearList = [];
    for (let y = year; y >= this.initYear; y--) {
      yearList.push({
        code: y,
        name: y.toString(),
      });
    }
    yearList.unshift({
      code: "",
      name: "Year",
    });

    this.selectedYearOptions = yearList;
     if( this.kaizenId != '' ){

      this.title = 'Edit Kaizen';
      this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('dataId', this.kaizenId);

      this.ProductMatrixApi.kaizenListDetailApi(apiFormData).subscribe(res => {
        if(res.status=='Success'){

            this.kaizenViewData = res.items[0];
            console.log(this.kaizenViewData);

            this.kaizenId = this.kaizenViewData.id;

            this.workstreamSelection = this.kaizenViewData.workstreams;
            this.workstreamId = this.kaizenViewData.workstreams;
            setTimeout(() => {
              this.ppfrForm.get('wsFormControl').patchValue(this.workstreamId);
            }, 1);
            if(this.workstreamId.length>0){
              this.saveButtonEnable = true;
            }

            this.kaizenTitle =  this.kaizenViewData.title;
            this.model =  this.kaizenViewData.modelName;
            this.regnonia = this.kaizenViewData.regNoNia;
            this.theme = this.kaizenViewData.theme;
            this.complaintsReported = this.kaizenViewData.complaintsReported;
            this.sevirity = this.kaizenViewData.sevirity;
            this.kaizenFinish = this.kaizenViewData.kaizenFinish;
            this.kaizenUnit = this.kaizenViewData.kaizenUnit;
            this.kaizenArea = this.kaizenViewData.kaizenArea;
            this.kaizenSino = this.kaizenViewData.kaizenSiNo;
            this.territory = this.kaizenViewData.territory;
            this.frameNumber = this.kaizenViewData.frameNo;
            this.KMSReading =  this.kaizenViewData.miles;
            this.problemPresentDesc = this.kaizenViewData.problemPresentStatus;
            this.observationDesc = this.kaizenViewData.otherObservation;
            this.analysisDesc = this.kaizenViewData.analysis;
            this.actionTakenDesc = this.kaizenViewData.otherActionTaken;
            this.vehiclesModified = this.kaizenViewData.vehiclesModified;
            this.expensesCostEstimate = this.kaizenViewData.expensesCostEstimate;
            this.easyImplement = this.kaizenViewData.easyToImplement;
            this.costSavings = this.kaizenViewData.costSavings;
            this.sideEffectSolution = this.kaizenViewData.sideEffectSolution;
            this.modificationCheck = this.kaizenViewData.modificationCheck;
            this.customerComplaint = this.kaizenViewData.customerComplaint;
            this.presentedBy = this.kaizenViewData.presentedBy;
            this.otherObservation = this.kaizenViewData.otherObservation;
            this.dealerName = this.kaizenViewData.dealerName;
            this.otherActionTaken = this.kaizenViewData.otherActionTaken;
            this.otherPlace = this.kaizenViewData.otherPlace;

            this.EditAttachmentAction = 'attachments';
            this.attachmentItems = [];
            this.attachmentItems  = this.kaizenViewData.uploadContents;

            for(let a of this.attachmentItems) {
              a.captionFlag = (a.fileCaption != '') ? false : true;
              if(a.flagId == 6) {
                a.url = a.filePath;
                a.linkFlag = false;
                a.valid = true;
              }
            }

            this.setFormData();
            setTimeout(() => {
              this.getWorkstreamLists();
              this.setScreenHeight();
              this.loading = false;
            }, 1000);

          }
          else{
            this.loading = false;
          }
        },
        (error => {
          this.loading = false;
        })
        );
    }
    else{
      this.title = 'New Kaizen';
      this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
      this.saveButtonEnable = false;
      this.setFormData();
      setTimeout(() => {
        this.setScreenHeight();
        this.getWorkstreamLists();
        this.loading = false;
      }, 1000);
    }
    let action1;
    let title1;
    let id1='';
    if(this.kaizenId !=''){
      action1 = 'edit';
      title1 = 'Edit Kaizen';
      id1 = this.kaizenId;
      this.title = 'Edit Kaizen';
    }
    else{
      action1 = 'new';
      title1 = 'New Kaizen';
      id1 = id1;
      this.title = 'New Kaizen';
    }


    this.headerData = {
      title: title1,
      action: action1,
      id: id1
    };

    let threadAction;
    let action;
    if(this.kaizenId == '' ){
      action = 'new';
    }
    else{
      action = 'edit';
    }

    this.postApiData = {
      access: this.pageAccess,
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
      action: action,
      threadAction:  threadAction
    };
  }

    // Get Workstream Lists
    getWorkstreamLists() {
      let type: any = 1;
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('userId', this.userId);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append("type", type);

      this.ProductMatrixApi.getWorkstreamLists(apiFormData).subscribe(
        (response) => {
          let resultData = response.workstreamList;

          this.workstreamItems= [];
          for (let ws of resultData) {
            this.workstreamItems.push({
              id: ws.id,
              name: ws.name,
            });
          }

        }
      );
    }
    //
    selectedItems(event){ console.log(event)
      this.workstreamSelection = event.value;
      this.workstreamId = event.value;
      console.log(this.workstreamId);
      if(this.workstreamId.length>0){
        this.saveButtonEnable = true;
      }
      else{
        this.saveButtonEnable = false;
      }
    }

    // Disable Workstreams Selection
  disableWSSelection(id){
    for (let wss in this.workstreamSelection ) {
      if(id == this.workstreamSelection[wss].id){
        this.workstreamSelection.splice(wss, 1);
        this.workstreamId.splice(wss, 1);
      }
    }
    setTimeout(() => {
      this.ppfrForm.get('wsFormControl').patchValue(this.workstreamId);
    }, 1);
    if(this.workstreamId.length>0){
      this.saveButtonEnable = true;
    }
    else{
      this.saveButtonEnable = false;
    }
  }

  setFormData(){
    this.ppfrForm = this.formBuilder.group({
      wsFormControl : [this.workstreamId, [Validators.required]],
      kaizenTitle : [this.kaizenTitle, []],
      model: [this.model, []],
      regnonia: [this.regnonia, []],
      theme: [this.theme, []],
      complaintsReported: [this.complaintsReported, []],
      sevirity: [this.sevirity, []],
      kaizenFinish: [this.kaizenFinish, []],
      kaizenUnit: [this.kaizenUnit, []],
      kaizenArea: [this.kaizenArea, []],
      kaizenYear: [this.selectedYear, []],
      kaizenSino: [this.kaizenSino, []],
      territory: [this.territory, []],
      frameNumber: [this.frameNumber, []],
      KMSReading: [this.KMSReading, []],
      problemPresentDesc: [this.problemPresentDesc, []],
      observationDesc: [this.observationDesc, []],
      analysisDesc: [this.analysisDesc, []],
      actionTakenDesc: [this.actionTakenDesc, []],
      vehiclesModified: [this.vehiclesModified, []],
      expensesCostEstimate: [this.expensesCostEstimate, []],
      easyImplement: [this.easyImplement, []],
      costSavings: [this.costSavings, []],
      sideEffectSolution: [this.sideEffectSolution, []],
      modificationCheck: [this.modificationCheck, []],
      occuranceInfo: this.formBuilder.array([]),
      customerComplaint: [this.customerComplaint, []],
      presentedBy: [this.presentedBy, []],
      otherObservation: [this.otherObservation, []],
      dealerName: [this.dealerName, []],
      otherActionTaken: [this.otherActionTaken, []],
      otherPlace: [this.otherPlace, []]
    });

    setTimeout(() => {
      let year : number = 0;
      if(this.kaizenViewData.kaizenYear !=''){
        year = parseInt(this.kaizenViewData.kaizenYear);
        this.ppfrForm.get('kaizenYear').patchValue(year);
      }
    }, 500);

    if(parseInt(this.kaizenId) > 0){
      let noOfOccuranceData = this.kaizenViewData.scopePlan == "" ? "" : JSON.parse(this.kaizenViewData.scopePlan);
      let data2Len = noOfOccuranceData.length;
      if(data2Len>0){
        for (let d2 = 0; d2 < data2Len; d2++) {
          this.addSections2(this.actionEdit, d2);
        }
      }
      else{
        this.addSections2(this.actionInit, 0);
      }
    }
    else{
      this.addSections2(this.actionInit, 0);
    }
  }

  // Set Screen Height
  setScreenHeight() {
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
    } else {
      this.innerHeight = this.bodyHeight-208;
    }
   }


  // change desc
  changeDesc(event,type){
    console.log(event.htmlValue);
    //if(event.htmlValue != null){
      switch(type){
        case 'desc1':
          this.problemPresentDesc = event.htmlValue;
          break;
        case 'desc2':
          this.observationDesc = event.htmlValue;
          break
        case 'desc3':
          this.analysisDesc = event.htmlValue;
          break;
        case 'desc4':
          this.actionTakenDesc = event.htmlValue;
          break;
      }
  }


  // Get Uploaded Items
  attachments(items) {
    console.log(items);
    this.uploadedItems = items;
    //this.saveButtonEnable = true;
    //console.log(this.saveButtonEnable);
  }

  // Attachment Action
  attachmentAction(data) {
    console.log(data);
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;

    switch (action) {
      case "file-delete":
        this.deletedFileIds.push(fileId);
        break;
      case "order":
        let attachmentList = data.attachments;
        for (let a in attachmentList) {
          let uid = parseInt(a) + 1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(
            (option) => option.fileId == ufileId
          );
          if (uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: flagId == 6 ? attachmentList[a].url : "",
              displayOrder: uid,
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
        };
        let index = this.updatedAttachments.findIndex(
          (option) => option.fileId == fileId
        );
        if (index < 0) {
          updatedAttachmentInfo["displayOrder"] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
        }

        console.log(this.updatedAttachments);
        break;
    }
  }

  // Publish or Save Draft
  submitAction(action) {
    this.onSubmit();
  }

  // On Submit
  onSubmit() {
    let groups = [];
    let groupsJSON = '';
    if(this.workstreamId.length>0){
      for (let ws in this.workstreamId) {
        groups.push(this.workstreamSelection[ws].id);
      }
      groupsJSON = JSON.stringify(groups);
    }

    if(this.occuranceFormInfo.length>1){
      this.checkValidationSetion2();
      for (let v in this.occuranceFormInfo) {
        let indexVal = parseInt(v) + 1;
        if(indexVal < this.occuranceFormInfo.length){
          if(this.occuranceFormInfo[indexVal].valid){
            return false;
          }
        }
      }
    }
    else{
      for (let o in this.ppfrForm.value.occuranceInfo) {

        let occSno =this.ppfrForm.value.occuranceInfo[o].occSno;
        let occScopeItem = this.ppfrForm.value.occuranceInfo[o].occScopeItem;
        let occResp = this.ppfrForm.value.occuranceInfo[o].occResp;
        let occStatus = this.ppfrForm.value.occuranceInfo[o].occStatus;

        console.log(occSno);
        console.log(occScopeItem);
        console.log(occResp);
        console.log(occStatus);

        if ((occSno != undefined && occSno != "") || (occScopeItem != undefined && occScopeItem != "" ) || ( occResp != undefined && occResp != "" ) || ( occStatus != undefined && occStatus != "" ) ) {
          this.occuranceInfoEmpty = false;
        }
        else{
          this.occuranceInfoEmpty = true;
        }
      }
    }

    let formVal = this.ppfrForm.value;

    if(this.occuranceInfoEmpty){
      this.occurance = "";
    }
    else{
      formVal.occuranceInfo = JSON.stringify(formVal.occuranceInfo);
      this.occurance = formVal.occuranceInfo;
    }
    console.log(this.occurance);
    let partFormData = new FormData();
    this.kaizenId = this.kaizenId != '' ? this.kaizenId : '';
    this.problemPresentDesc = this.problemPresentDesc == null ? '' : this.problemPresentDesc;
    this.observationDesc = this.observationDesc == null ? '' : this.observationDesc;
    this.analysisDesc = this.analysisDesc == null ? '' : this.analysisDesc;
    this.actionTakenDesc = this.actionTakenDesc == null ? '' : this.actionTakenDesc;

    partFormData.append("apiKey", Constant.ApiKey);
    partFormData.append("domainId", this.domainId);
    partFormData.append("countryId", this.countryId);
    partFormData.append("userId", this.userId);

    partFormData.append("groups", groupsJSON);
    partFormData.append("title", this.ppfrForm.value.kaizenTitle.trim());
    partFormData.append("modelName", this.model);
    partFormData.append("regNoNia", this.regnonia);
    partFormData.append("theme", this.theme);
    partFormData.append("complaintsReported", this.complaintsReported);
    partFormData.append("sevirity", this.sevirity);
    partFormData.append("kaizenFinish", this.kaizenFinish);
    partFormData.append("kaizenUnit", this.kaizenUnit);
    partFormData.append("kaizenArea", this.kaizenArea);
    partFormData.append("kaizenYear", this.ppfrForm.value.kaizenYear);
    partFormData.append("kaizenSiNo", this.kaizenSino);
    partFormData.append("territory", this.territory);
    partFormData.append("frameNo", this.frameNumber);
    partFormData.append("miles", this.KMSReading);
    partFormData.append("problemPresentStatus", this.problemPresentDesc);
    partFormData.append("keizenObeservation", this.observationDesc);
    partFormData.append("analysis", this.analysisDesc);
    partFormData.append("actionTaken", this.actionTakenDesc);
    partFormData.append("vehiclesModified", this.vehiclesModified);
    partFormData.append("expensesCostEstimate", this.expensesCostEstimate);
    partFormData.append("easyToImplement", this.easyImplement);
    partFormData.append("costSavings", this.costSavings);
    partFormData.append("sideEffectSolution", this.sideEffectSolution);
    partFormData.append("modificationCheck", this.modificationCheck);
    partFormData.append("scopePlan", this.occurance);
    partFormData.append("customerComplaint", this.customerComplaint);
    partFormData.append("presentedBy", this.presentedBy);
    partFormData.append("otherObservation", this.otherObservation);
    partFormData.append("dealerName", this.dealerName);
    partFormData.append("otherActionTaken", this.otherActionTaken);
    partFormData.append("otherPlace", this.otherPlace);
    partFormData.append('approvalProcess', '2');
    partFormData.append("userType", this.kaizenUserType);
    partFormData.append("assigneeRoleId", this.kaizenAssigneeRoleId);

    partFormData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
    //partFormData.append('deleteMediaId',  JSON.stringify(this.deletedFileIds));
    partFormData.append('deletedFileIds',  JSON.stringify(this.deletedFileIds));

    //new Response(partFormData).text().then(console.log)

    if(this.kaizenId != ''){
      partFormData.append("dataId", this.kaizenId);
    }
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );

    console.log(partFormData);
    //new Response(partFormData).text().then(console.log);
    //return false;

    this.ProductMatrixApi.kaizenUpdateApi(partFormData).subscribe(response => {
      console.log(response);
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      if(response.status=='Success'){

        let dataId = response.dataId;
        if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0) {
          this.postApiData['uploadedItems'] = this.uploadedItems.items;
          this.postApiData['attachments'] = this.uploadedItems.attachments;
          this.postApiData['message'] = response.result;
          this.postApiData['dataId'] = dataId;
          this.postApiData['navUrl'] = this.detailViewUrl;
          this.postApiData['threadAction'] = (this.kaizenId == '') ? 'new' : 'edit';
          this.manageAction = "uploading";
          this.postUpload = false;
          setTimeout(() => {
            this.postUpload = true;
          }, 100);
        }
        else{

          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = response.result;
          setTimeout(() => {
            //localStorage.removeItem('threadNav');
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              //alert(this.kaizenId);
              if(this.kaizenId != ''){
                //alert(this.detailViewUrl);
                this.router.navigate([this.detailViewUrl]);
              }
              else{
                window.close();
                window.opener.location.reload();
              }
            }, 1000);

          }, 4000);
        }
      }
    });

  }
   // Create No. of Occurance
   addSections2(action, index) {
    let addNew : boolean = true;
    if(index == 0){
      this.dynamicAddFlag2 = true;
      addNew = true;
    }
    else{
      if (action != "edit") {
        this.occuranceFormInfo[index-1].actionFlag = false;
        this.checkValidationSetion2();
        console.log(this.occuranceFormInfo);
      }
    }
    //let valid = action == "edit" ? true : false;
    setTimeout(() => {
      if (action != "edit") {
        if(index > 0){
          this.occuranceFormInfo[index-1].actionFlag = true;
        }
        if(index > 0 && this.occuranceFormInfo[index-1].valid){
          addNew = false;
        }
        else{
          addNew = true;
        }
      }
      else{
        addNew = true;
      }
      if(addNew){
        this.occuranceFormInfo.push({
          occSno: '',
          occScopeItem: '',
          occResp: '',
          occStatus: '',
          actionFlag: true,
          addFlag: true,
          removeFlag: true,
          valid: false
        });

        this.o.push(
          this.formBuilder.group({
            occSno: [""],
            occScopeItem: [""],
            occResp: [""],
            occStatus: [""]
          })
        );

        if(this.occuranceFormInfo.length>1){
          var lenVal = this.occuranceFormInfo.length;
          for (let v in this.occuranceFormInfo) {
            this.occuranceFormInfo[v].addFlag = false;
            this.occuranceFormInfo[v].removeFlag = true;
          }
          this.occuranceFormInfo[lenVal-1].addFlag = true;
        }
        else{
          this.occuranceFormInfo[0].addFlag = true;
          this.occuranceFormInfo[0].removeFlag = false;
        }

        if (action == "edit") {
          let noOfOccuranceData = JSON.parse(this.kaizenViewData.scopePlan);
          this.occuranceFormInfo[index].occSno = noOfOccuranceData[index].occSno != undefined ?  noOfOccuranceData[index].occSno : '';
          this.occuranceFormInfo[index].occScopeItem = noOfOccuranceData[index].occScopeItem != undefined ?  noOfOccuranceData[index].occScopeItem : '';
          this.occuranceFormInfo[index].occResp = noOfOccuranceData[index].occResp != undefined ?  noOfOccuranceData[index].occResp : '';
          this.occuranceFormInfo[index].occStatus = noOfOccuranceData[index].occStatus != undefined ?  noOfOccuranceData[index].occStatus : '';
        }
      }
    }, 1000);

  }
  // Remove No. of Occurance
  removeSections2(index) {
    this.o.removeAt(index);
    this.occuranceFormInfo.splice(index, 1);
    for (let v in this.occuranceFormInfo) {
      this.occuranceFormInfo[v].actionFlag = false;
    }
    setTimeout(() => {
      if(this.occuranceFormInfo.length>1){
        var lenVal = this.occuranceFormInfo.length;
        for (let v in this.occuranceFormInfo) {
          this.occuranceFormInfo[v].addFlag = false;
          this.occuranceFormInfo[v].removeFlag = true;
          this.occuranceFormInfo[v].actionFlag = true;
        }
        this.occuranceFormInfo[lenVal-1].addFlag = true;
      }
      else{
        this.occuranceFormInfo[0].addFlag = true;
        this.occuranceFormInfo[0].removeFlag = false;
        this.occuranceFormInfo[0].actionFlag = true;
      }

    }, 1000);
  }


  // input keypress
  public inputChange(fieldName, event: any, index) {
    var inputVal = event.target.value.trim();
    console.log(inputVal);
    var inputLength = inputVal.length;
    switch (fieldName) {
      case 'type2':
        if(inputLength>0){
          this.occuranceFormInfo[index].valid = false;
          //this.saveButtonEnable = true;
        }
      break;
      default:
      break;
    }
  }

  //No. of Occurance
  checkValidationSetion2(){
    for (let o in this.ppfrForm.value.occuranceInfo) {

      let occSno =this.ppfrForm.value.occuranceInfo[o].occSno;
      let occScopeItem = this.ppfrForm.value.occuranceInfo[o].occScopeItem;
      let occResp = this.ppfrForm.value.occuranceInfo[o].occResp;
      let occStatus = this.ppfrForm.value.occuranceInfo[o].occStatus;

      console.log(occSno);
      console.log(occScopeItem);
      console.log(occResp);
      console.log(occStatus);

      if ((occSno != undefined && occSno != "") || (occScopeItem != undefined && occScopeItem != "" ) || ( occResp != undefined && occResp != "" ) || ( occStatus != undefined && occStatus != "" ) ) {
        this.occuranceFormInfo[o].valid = false;
      }
      else{
        this.occuranceFormInfo[o].valid = true;
      }
    }
    console.log(this.occuranceFormInfo);
  }

  // Allow only numeric
  restrictNumeric(val) {
    let res = this.commonApi.restrictNumeric(val);
    return res;
  }

  // add comma
  addComma(val,field,type,index) {
    val = (val == undefined || val == 'undefined') ? '' : val;
    if(val != '') {
    //if(field == 'kms'){
      val = this.commonApi.removeCommaNum(val);
      val = this.commonApi.numberWithCommasTwoDigit(val);
    //}
    }
    switch(type){
      case 'type0':
        this.KMSReading = val;
        break;
      default:
        break;
    }
  }

  removeConfirm(type,index){
    const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.access = 'ppfrconfirmation';
    modalRef.componentInstance.title = '';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.removeSections2(index);
      }
    });
  }

  // allow alphanumeric
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

     // Close Current Window
     closeWindow() {

      const modalRef = this.modalService.open(
        ConfirmationComponent,
        this.modalConfig
      );
      modalRef.componentInstance.access = "Cancel";
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      this.prevUrl = this.prevUrl+"/"+this.kaizenId;
        if (!receivedService) {
          return;
        } else {
          if (this.teamSystem) {
            window.open(this.prevUrl, IsOpenNewTab.teamOpenNewTab);
          } else {

            if(this.kaizenId == ''){
              window.close();
            }
            else{
              this.router.navigate([this.prevUrl]);
            }
          }
        }
      });
    }

}

