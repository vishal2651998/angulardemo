import { Component, OnInit, HostListener,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../../../components/common/confirmation/confirmation.component";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../../../../services/authentication/authentication.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ScrollTopService } from "../../../../../services/scroll-top.service";
import { SubmitLoaderComponent } from "../../../../../components/common/submit-loader/submit-loader.component";
import { EscalationsService } from '../../../../../services/escalations/escalations.service';
import { SuccessModalComponent } from "../../../../../components/common/success-modal/success-modal.component";
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import * as moment from 'moment';
import { DatePickerComponent } from 'ng2-date-picker';
import { forumPageAccess, Constant,IsOpenNewTab, windowHeight  } from 'src/app/common/constant/constant';
import { CommonService } from '../../../../../services/common/common.service';
import { ManageListComponent } from '../../../../../components/common/manage-list/manage-list.component';

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})
export class ManageFormComponent implements OnInit {
  @ViewChild('dayPicker1', {static: false}) datePicker1: DatePickerComponent;
  @ViewChild('dayPicker2', {static: false}) datePicker2: DatePickerComponent;
  @ViewChild('dayPicker3', {static: false}) datePicker3: DatePickerComponent;
  @ViewChild('dayPicker4', {static: false}) datePicker4: DatePickerComponent;
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "PPFR Form";
  public pageAccess: string = "ppfr";
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
  public nextUrl: string = "ppfr";
  public prevUrl: string = "threads/view";
  public threadId = '';
  public postId;
  public saveDraftFlag: boolean = true;
  public countryId;
  public countryName;
  public user: any;
  public domainId;
  public userId;
  public innerHeight: number;
  public bodyHeight: number;
  public dealerName: string = '';
  public severities: string = '';
  public ppfrDate: string = '';
  public country: string = '';
  public selectionCountryId: any = [];
  public selectionCountryName: any = [];
  public selectionCountryOption: any = [];
  public location: string = '';
  public complaintDate: string = '';
  public model: string = '';
  public partNumber: string = '';
  public incidentNumber: string = '';
  public description: string = '';
  public qty: string = '';
  public frameNumber: string = '';
  public engineNumber: string = '';
  public dateOfSale: string = '';
  public dateOfRepair: string = '';
  public KMSReading: string = '';
  public partReplaced: string = '';
  public complaintDesc: string= '';
  public observationDesc: string= '';
  public dealerActionDesc: string= '';
  public otherDetails: string= '';
  public postUpload: boolean = true;
  public manageAction: string;
  public postApiData: object;
  public contentType: number = 38; // PPFR
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public displayOrder: number = 0;
  public postServerError:boolean = false;
  public postServerErrorMsg: string = '';
  public ppfrViewData: any = [];
  public EditAttachmentAction: string = "attachments";
  public selectedOil: string;
  oilArray: any[];
  public ppfrId: number = 0;
  public serviceHistoryFormInfo = [];
  public serviceHistory: any = [];
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
  public ppfrEdit: string = '';
  public ppfrValues: any = [];
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
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
    this.oilArray = [
      {name: 'Yes', code: 'Yes'},
      {name: 'No', code: 'No'},
  ];
   }

  // convenience getters for easy access to form fields
   get f() {
    return this.ppfrForm.controls;
  }

  get v() {
    return this.f.serviceHistoryInfo as FormArray;
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
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;

    let ppfrValues = localStorage.getItem("ppfrValues") != null && localStorage.getItem("ppfrValues") != undefined ? localStorage.getItem("ppfrValues") : '';
    ppfrValues = (ppfrValues !='' ) ? JSON.parse(localStorage.getItem("ppfrValues")) : '';

    console.log("ppfrValues"+ppfrValues['ppfrEdit']);
    this.ppfrEdit = ppfrValues['ppfrEdit']; // already edited
    this.threadId = ppfrValues['threadId'];
    this.prevPage = ppfrValues['page'];

    this.ppfrId = this.route.snapshot.params["ppfrid"];
    this.ppfrId = this.ppfrId != undefined ? this.ppfrId : 0 ;

     if( this.ppfrEdit == '1' || this.ppfrId>0 ){

      this.title = 'Edit PPFR Form';

      const apiFormData = new FormData();

      this.threadId = this.threadId != undefined  ? this.threadId : '';

      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('id', this.ppfrId.toString());

      this.escalationApi.getEscalateThreadDetails(apiFormData).subscribe(res => {
        if(res.status=='Success'){

            this.ppfrViewData = res.formDetails[0];
            console.log(this.ppfrViewData);

            this.dealerName = this.ppfrViewData.dealerName;
            this.severities =  this.ppfrViewData.serverity;
            this.country =  this.ppfrViewData.country;
            this.location =  this.ppfrViewData.location;
            this.threadId = this.ppfrViewData.threadId;
            this.ppfrId = this.ppfrViewData.id;
            console.log(this.ppfrViewData.ppfrDate);
            this.ppfrDate =  this.ppfrViewData.ppfrDate != 'undefined' && this.ppfrViewData.ppfrDate != undefined ? this.ppfrViewData.ppfrDate : '';
            if(this.ppfrDate!=''){
              this.ppfrDate = moment(this.ppfrDate).format('MM/DD/YYYY');
            }
            console.log(this.ppfrDate);

            console.log(this.ppfrViewData.complaintDate);
            this.complaintDate =  this.ppfrViewData.complaintDate != 'undefined' && this.ppfrViewData.complaintDate != undefined ? this.ppfrViewData.complaintDate : '';
            if(this.complaintDate!=''){
              this.complaintDate = moment(this.complaintDate).format('MM/DD/YYYY');
            }
            console.log(this.complaintDate);
            this.partNumber =  this.ppfrViewData.partNumber;
            this.incidentNumber =  this.ppfrViewData.incidentNumber != undefined ? this.ppfrViewData.incidentNumber : '';
            this.model =  this.ppfrViewData.modelName;
            this.description =  this.ppfrViewData.description;
            this.qty =  this.ppfrViewData.qty;
            this.frameNumber =  this.ppfrViewData.frameNo;
            this.engineNumber =  this.ppfrViewData.engineNo;
            console.log(this.ppfrViewData.dateOfSale);
            this.dateOfSale =  this.ppfrViewData.dateOfSale != 'undefined' && this.ppfrViewData.dateOfSale != undefined ? this.ppfrViewData.dateOfSale : '';
            if(this.dateOfSale!=''){
              this.dateOfSale = moment(this.dateOfSale).format('MM/DD/YYYY');
            }
            console.log(this.dateOfSale);
            console.log(this.ppfrViewData.dateOfRepair);
            this.dateOfRepair =  this.ppfrViewData.dateOfRepair != 'undefined' && this.ppfrViewData.dateOfRepair != undefined ? this.ppfrViewData.dateOfRepair : '';
            if(this.dateOfRepair!=''){
              this.dateOfRepair = moment(this.dateOfRepair).format('MM/DD/YYYY');
            }
            console.log(this.dateOfRepair);
            this.KMSReading =  this.ppfrViewData.kms;
            this.partReplaced =  this.ppfrViewData.partReplaced;
            this.complaintDesc= this.ppfrViewData.customerComplaint;
            this.observationDesc= this.ppfrViewData.dealerObservation;
            this.dealerActionDesc= this.ppfrViewData.dealerAction;
            this.otherDetails = this.ppfrViewData.otherDetails;
            this.EditAttachmentAction = 'attachments';
            this.attachmentItems = [];
            this.attachmentItems  = this.ppfrViewData.uploadContents;

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
              this.setScreenHeight();
              this.checkFields();
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
      this.title = 'Create PPFR Form';
      this.saveButtonEnable = false;
      /*this.model = ppfrValues['model'];
      this.dealerName = ppfrValues['dealerName'];
      this.dealerCity = ppfrValues['dealerCity'];
      this.dealerArea = ppfrValues['dealerArea'];
      this.frameNumber = ppfrValues['frameNumber'];
      this.KMSReading = ppfrValues['odometer'];*/
      this.setFormData();
      if( this.countryName != '' || this.countryName != undefined || this.countryName != null ) {
        this.country = this.countryName;
      }
      else{
        this.country = '';
      }
      setTimeout(() => {
        this.setScreenHeight();
        this.loading = false;
      }, 1000);
    }
    let action1;
    let title1;
    let id1 = this.threadId != '' && this.threadId != undefined && this.threadId != null ? this.threadId : '';
    if(this.ppfrEdit == '1' || this.ppfrId > 0){
      action1 = 'edit';
      title1 = 'Edit PPFR Form';
      id1 = this.ppfrId.toString();
    }
    else{
      action1 = 'new';
      title1 = 'New PPFR Form';
      id1 = id1;
    }
    this.headerData = {
      title: title1,
      action: action1,
      id: id1
    };
    this.title = 'PPFR Form';
    let threadAction;
    let action;
    if(this.ppfrEdit == '0' && this.ppfrId == 0 ){
      action = 'new';
    }
    else{
      action = 'edit';
    }
    if(this.prevPage == 'ppfr'){
      threadAction = 'ppfr-page';
    }
    else{
      threadAction= '';
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
  setFormData(){
    this.ppfrForm = this.formBuilder.group({
      dealerName: [this.dealerName, [Validators.required]],
      severities: [this.severities, [Validators.required]],
      ppfrDate: [this.ppfrDate, [Validators.required]],
      country: [this.country, [Validators.required]],
      location: [this.location, [Validators.required]],
      model: [this.model, [Validators.required]],
      engineNumber: [this.engineNumber, [Validators.required]],
      frameNumber: [this.frameNumber, [Validators.required]],
      KMSReading: [this.KMSReading, [Validators.required]],
      dateOfSale: [this.dateOfSale, [Validators.required]],
      complaintDate: [this.complaintDate, [Validators.required]],
      dateOfRepair: [this.dateOfRepair, [Validators.required]],
      partNumber: [this.partNumber, [Validators.required]],
      incidentNumber: [this.incidentNumber, []],
      description: [this.description, [Validators.required]],
      qty: [this.qty, [Validators.required]],
      complaintDesc: [this.complaintDesc, [Validators.required]],
      observationDesc: [this.observationDesc, [Validators.required]],
      dealerActionDesc: [this.dealerActionDesc, [Validators.required]],
      otherDetails: [this.otherDetails, []],
      serviceHistoryInfo: this.formBuilder.array([]),
      occuranceInfo: this.formBuilder.array([]),
    });

    if(this.ppfrId > 0){
      let serviceHistoryData = this.ppfrViewData.serviceHistory == "" ? "" : JSON.parse(this.ppfrViewData.serviceHistory);
      let noOfOccuranceData = this.ppfrViewData.noOfOccurance == "" ? "" : JSON.parse(this.ppfrViewData.noOfOccurance);
      let data1Len = serviceHistoryData.length;
      if(data1Len>0){
        for (let d1 = 0; d1 < data1Len; d1++) {
          this.addSections1(this.actionEdit, d1);
        }
      }
      else{
        this.addSections1(this.actionInit, 0);
      }
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
      this.addSections1(this.actionInit, 0);
      this.addSections2(this.actionInit, 0);
    }
  }

  viewPDF(){
    var aurl =  Constant.TechproMahleApi + forumPageAccess.PPFRPDFviewer + this.threadId+"&id="+this.ppfrId+"&domainId="+this.domainId;
    window.open(aurl, aurl);
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
          this.complaintDesc = event.htmlValue;
          break;
        case 'desc2':
          this.observationDesc = event.htmlValue;
          break
        case 'desc3':
          this.dealerActionDesc = event.htmlValue;
          break;
        case 'desc4':
          this.otherDetails = event.htmlValue;
          break;
      }
      //this.saveButtonEnable = true;
      //console.log(this.saveButtonEnable);
    //}
    //else{
      this.checkFields();
    //}
  }

  // change Date
  changeDate(event,type){
    console.log(event);
    let newDate = moment(event).format('MM/DD/YYYY');
    console.log(newDate);
    switch(type){
      case 'date1':
        this.ppfrDate = this.ppfrDate == newDate ? this.ppfrDate : newDate;
        //this.saveButtonEnable = true;
        break;
      case 'date2':
        this.dateOfSale = this.dateOfSale == newDate ? this.dateOfSale : newDate;
        //this.saveButtonEnable = true;
        break
      case 'date3':
        this.complaintDate = this.complaintDate == newDate ? this.complaintDate : newDate;
        //this.saveButtonEnable = true;
        break;
      case 'date4':
        this.dateOfRepair = this.dateOfRepair == newDate ? this.dateOfRepair : newDate;
        //this.saveButtonEnable = true;
        break;
    }
    this.checkFields();
  }

  changeServiceDate(event,index){
    console.log(event);
    console.log(this.ppfrForm.value.serviceHistoryInfo[index].serviceDate)
    let newDate = moment(event).format('MM/DD/YYYY');
    if(this.ppfrForm.value.serviceHistoryInfo[index].serviceDate != newDate){
      this.serviceHistoryFormInfo[index].valid = false;
    }
  }

  openDatePicker(type){
    switch(type){
      case 'date1':
        this.datePicker1.api.open();
        break;
      case 'date2':
        this.datePicker2.api.open();
        break;
      case 'date3':
        this.datePicker3.api.open();
        break
      case 'date4':
        this.datePicker4.api.open();
        break;
    }
  }
  // Close Current Window
  closeWindow() {

    localStorage.removeItem("ppfrValues");

    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Cancel";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
    modalRef.dismiss("Cross click");
    this.prevUrl = this.prevUrl+"/"+this.threadId;
      if (!receivedService) {
        return;
      } else {
        if (this.teamSystem) {
          window.open(this.prevUrl, IsOpenNewTab.teamOpenNewTab);
        } else {
          // this.router.navigate([this.prevUrl]);
          window.close();
        }
      }
    });
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
    console.log(this.serviceHistoryFormInfo);
    if(this.serviceHistoryFormInfo.length>1){
      this.checkValidationSetion1();
      for (let v in this.serviceHistoryFormInfo) {
        let indexVal = parseInt(v) + 1;
        if(indexVal < this.serviceHistoryFormInfo.length){
          if(this.serviceHistoryFormInfo[indexVal].valid){
            return false;
          }
        }
      }
    }
    else{
      for (let v in this.ppfrForm.value.serviceHistoryInfo) {
        let newDate = "";
        if(this.ppfrForm.value.serviceHistoryInfo[v].serviceDate != undefined && this.ppfrForm.value.serviceHistoryInfo[v].serviceDate != ""){
          newDate = moment(this.ppfrForm.value.serviceHistoryInfo[v].serviceDate).format('MM/DD/YYYY');
        }
        let sDate = newDate;
        this.ppfrForm.value.serviceHistoryInfo[v].serviceDate = sDate;
        console.log(this.ppfrForm.value.serviceHistoryInfo[v].serviceDate);
        let sKMs =this.ppfrForm.value.serviceHistoryInfo[v].serviceKMs;
        let sAction = this.ppfrForm.value.serviceHistoryInfo[v].serviceAction;
        let sObservations = this.ppfrForm.value.serviceHistoryInfo[v].serviceObservations;
        let sActionDetails = this.ppfrForm.value.serviceHistoryInfo[v].serviceActionDetails;
        let sSelectedOil = this.ppfrForm.value.serviceHistoryInfo[v].serviceSelectedOil;
        let sGradeOil = this.ppfrForm.value.serviceHistoryInfo[v].serviceGradeOil;

        console.log(v);
        console.log(sDate);
        console.log(sKMs);
        console.log(sAction);
        console.log(sObservations);
        console.log(sActionDetails);
        console.log(sSelectedOil);
        console.log(sGradeOil);

        if ((sDate != "") || (sKMs != undefined && sKMs != "") || (sAction != undefined && sAction != "" ) || ( sObservations != undefined && sObservations != "" ) || ( sActionDetails != undefined && sActionDetails != "" ) || ( sSelectedOil != undefined && sSelectedOil != "" ) || ( sGradeOil != undefined && sGradeOil != "") ) {
          this.serviceHistoryInfoEmpty = false;
        }
        else{
          this.serviceHistoryInfoEmpty = true;
        }
      }
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

        let occLocation =this.ppfrForm.value.occuranceInfo[o].occLocation;
        let occFrame = this.ppfrForm.value.occuranceInfo[o].occFrame;
        let occEngine = this.ppfrForm.value.occuranceInfo[o].occEngine;
        let occKMs = this.ppfrForm.value.occuranceInfo[o].occKMs;

        console.log(occLocation);
        console.log(occFrame);
        console.log(occEngine);
        console.log(occKMs);

        if ((occLocation != undefined && occLocation != "") || (occFrame != undefined && occFrame != "" ) || ( occEngine != undefined && occEngine != "" ) || ( occKMs != undefined && occKMs != "" ) ) {
          this.occuranceInfoEmpty = false;
        }
        else{
          this.occuranceInfoEmpty = true;
        }
      }
    }

    for (let v in this.serviceHistoryFormInfo) {
      console.log(this.serviceHistoryFormInfo[v].serviceDate);
      this.ppfrForm.value.serviceHistoryInfo[v].serviceDate = this.serviceHistoryFormInfo[v].serviceDate == undefined ? "" : this.serviceHistoryFormInfo[v].serviceDate;
    }

    let formVal = this.ppfrForm.value;

    if(this.serviceHistoryInfoEmpty){
      this.serviceHistory = '';
    }
    else{
      formVal.serviceHistoryInfo = JSON.stringify(formVal.serviceHistoryInfo);
      this.serviceHistory = formVal.serviceHistoryInfo;
    }
    console.log(this.serviceHistory);

    if(this.occuranceInfoEmpty){
      this.occurance = "";
    }
    else{
      formVal.occuranceInfo = JSON.stringify(formVal.occuranceInfo);
      this.occurance = formVal.occuranceInfo;
    }
    console.log(this.occurance);
    let ppfrCountry = JSON.stringify(this.selectionCountryId);

    if(this.severities !='' && this.dealerName !=''  && this.country != '' && this.location !='' && this.model != '' && this.engineNumber != '' && this.frameNumber != '' && this.KMSReading != '' && this.partNumber != '' && this.description != '' && this.qty !='' && this.complaintDesc != null && this.complaintDesc != '' && this.observationDesc != null && this.observationDesc != '' && this.dealerActionDesc != null && this.dealerActionDesc != '' && this.ppfrDate !='' && this.dateOfSale !=''  && this.complaintDate !='' && this.dateOfRepair !='' ){

    let partFormData = new FormData();
    this.threadId = this.threadId != 'undefined' && this.threadId != undefined ? this.threadId: '';
    this.ppfrDate = this.ppfrDate != 'undefined' && this.ppfrDate != undefined ? this.ppfrDate: '';
    this.complaintDate = this.complaintDate != 'undefined' && this.complaintDate != undefined ? this.complaintDate: '';
    this.dateOfSale = this.dateOfSale != 'undefined' && this.dateOfSale != undefined ? this.dateOfSale: '';
    this.dateOfRepair = this.dateOfRepair != 'undefined' && this.dateOfRepair != undefined ? this.dateOfRepair: '';
    this.complaintDesc = this.complaintDesc == null ? '' : this.complaintDesc;
    this.observationDesc = this.observationDesc == null ? '' : this.observationDesc;
    this.dealerActionDesc = this.dealerActionDesc == null ? '' : this.dealerActionDesc;
    this.otherDetails = this.otherDetails == null ? '' : this.otherDetails;

    partFormData.append("apiKey", Constant.ApiKey);
    partFormData.append("domainId", this.domainId);
    partFormData.append("countryId", this.countryId);
    partFormData.append("createdBy", this.userId);
    partFormData.append("threadId", this.threadId);
    partFormData.append("dealerName", this.dealerName);
    partFormData.append("serverity", this.severities);
    partFormData.append("ppfrDate", this.ppfrDate);
    partFormData.append("country", ppfrCountry);
    partFormData.append("location", this.location);
    partFormData.append("complaintDate", this.complaintDate);
    partFormData.append("partNumber", this.partNumber);
    partFormData.append("incidentNumber", this.incidentNumber);
    partFormData.append("modelName", this.model);
    partFormData.append("description", this.description);
    partFormData.append("qty", this.qty);
    partFormData.append("frameNo", this.frameNumber);
    partFormData.append("engineNo", this.engineNumber);
    partFormData.append("dateOfSale", this.dateOfSale);
    partFormData.append("dateOfRepair", this.dateOfRepair);
    partFormData.append("kms", this.KMSReading);
    partFormData.append("customerComplaint", this.complaintDesc);
    partFormData.append("dealerObservation", this.observationDesc);
    partFormData.append("dealerAction", this.dealerActionDesc);
    partFormData.append("serviceHistory", this.serviceHistory);
    partFormData.append("noOfOccurance", this.occurance);
    partFormData.append("otherDetails", this.otherDetails);
    partFormData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
    partFormData.append('deleteMediaId',  JSON.stringify(this.deletedFileIds));
    if(this.ppfrId > 0){
      let id = this.ppfrId;
      partFormData.append("id", id.toString());
    }
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );

    console.log(partFormData);
    //new Response(partFormData).text().then(console.log);
    //return false;

    this.escalationApi.savePPFRFormDataAPI(partFormData).subscribe(response => {
      console.log(response);
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      if(response.status=='Success'){

        localStorage.removeItem("ppfrValues");

        let dataId = response.dataId;
        if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0) {
          this.postApiData['uploadedItems'] = this.uploadedItems.items;
          this.postApiData['attachments'] = this.uploadedItems.attachments;
          this.postApiData['message'] = response.result;
          this.postApiData['dataId'] = dataId;
          this.postApiData['threadId'] = this.threadId;
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
            if(this.teamSystem) {
              window.open(this.nextUrl, IsOpenNewTab.teamOpenNewTab);
            } else {
                window.opener.location.reload();
                setTimeout(() => {
                  msgModalRef.dismiss('Cross click');
                  window.close();
                }, 1000);
            }
          }, 4000);
        }
      }
    });
  }
  }

  onChange(){
    this.checkFields();
  }
  checkFields(){
    console.log(this.severities,this.dealerName,this.country,this.location,this.model,this.engineNumber,this.frameNumber,this.KMSReading,this.partNumber,this.description,this.qty,this.complaintDesc,this.observationDesc,this.dealerActionDesc,this.ppfrDate,this.dateOfSale,this.complaintDate,this.dateOfRepair);
    if(this.severities !='' && this.dealerName !=''  && this.country != '' && this.location !='' && this.model != '' && this.engineNumber != '' && this.frameNumber != '' && this.KMSReading != '' && this.partNumber != '' && this.description != '' && this.qty !='' && this.complaintDesc != null && this.complaintDesc != '' && this.observationDesc != null && this.observationDesc != '' && this.dealerActionDesc != null && this.dealerActionDesc != '' && this.ppfrDate !='' && this.dateOfSale !=''  && this.complaintDate !='' && this.dateOfRepair !='' ){
      this.saveButtonEnable = true;
    }
    else{
      this.saveButtonEnable = false;
    }
  }

  // Create Previous Service History
  addSections1(action, index) {
    let addNew : boolean = true;
    if(index == 0){
      this.dynamicAddFlag1 = true;
      addNew = true;
    }
    else{
      if (action != "edit") {
      this.serviceHistoryFormInfo[index-1].actionFlag = false;
      this.checkValidationSetion1();
      }
    }
    //let valid = action == "edit" ? true : false;
    setTimeout(() => {
      if (action != "edit") {
        if(index > 0){
          this.serviceHistoryFormInfo[index-1].actionFlag = true;
          this.checkValidationSetion1();
        }
        if(index > 0 && this.serviceHistoryFormInfo[index-1].valid){
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
        this.serviceHistoryFormInfo.push({
          serviceDate: '',
          serviceKMs: '',
          serviceAction: '',
          serviceObservations: '',
          serviceActionDetails: '',
          serviceSelectedOil: '',
          serviceGradeOil: '',
          actionFlag: true,
          addFlag: true,
          removeFlag: true,
          valid: false
        });

        this.v.push(
          this.formBuilder.group({
            serviceDate: [""],
            serviceKMs: [""],
            serviceAction: [""],
            serviceObservations: [""],
            serviceActionDetails: [""],
            serviceSelectedOil: [""],
            serviceGradeOil: [""]
          })
        );

        if(this.serviceHistoryFormInfo.length>1){
          var lenVal = this.serviceHistoryFormInfo.length;
          for (let v in this.serviceHistoryFormInfo) {
            this.serviceHistoryFormInfo[v].addFlag = false;
            this.serviceHistoryFormInfo[v].removeFlag = true;
          }
          this.serviceHistoryFormInfo[lenVal-1].addFlag = true;
        }
        else{
          this.serviceHistoryFormInfo[0].addFlag = true;
          this.serviceHistoryFormInfo[0].removeFlag = false;
        }

        if (action == "edit") {
          let serviceHistoryData = JSON.parse(this.ppfrViewData.serviceHistory);
          let serviceDate =  serviceHistoryData[index].serviceDate != 'undefined' && serviceHistoryData[index].serviceDate != undefined ? serviceHistoryData[index].serviceDate : '';
          if(serviceDate!=''){
            this.serviceHistoryFormInfo[index].serviceDate = moment(serviceDate).format('MM/DD/YYYY');
          }
          this.serviceHistoryFormInfo[index].serviceKMs = serviceHistoryData[index].serviceKMs != undefined ?  serviceHistoryData[index].serviceKMs : '';
          this.serviceHistoryFormInfo[index].serviceAction = serviceHistoryData[index].serviceAction != undefined ?  serviceHistoryData[index].serviceAction : '';
          this.serviceHistoryFormInfo[index].serviceObservations = serviceHistoryData[index].serviceObservations != undefined ?  serviceHistoryData[index].serviceObservations : '';
          this.serviceHistoryFormInfo[index].serviceActionDetails = serviceHistoryData[index].serviceActionDetails != undefined ?  serviceHistoryData[index].serviceActionDetails : '';
          this.serviceHistoryFormInfo[index].serviceSelectedOil = serviceHistoryData[index].serviceSelectedOil != undefined ?  serviceHistoryData[index].serviceSelectedOil : '';
          this.serviceHistoryFormInfo[index].serviceGradeOil =  serviceHistoryData[index].serviceGradeOil != undefined ?  serviceHistoryData[index].serviceGradeOil : '';
        }
      }
    }, 1000);

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
          occLocation: '',
          occFrame: '',
          occEngine: '',
          occKMs: '',
          actionFlag: true,
          addFlag: true,
          removeFlag: true,
          valid: false
        });

        this.o.push(
          this.formBuilder.group({
            occLocation: [""],
            occFrame: [""],
            occEngine: [""],
            occKMs: [""]
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
          let noOfOccuranceData = JSON.parse(this.ppfrViewData.noOfOccurance);
          this.occuranceFormInfo[index].occLocation = noOfOccuranceData[index].occLocation != undefined ?  noOfOccuranceData[index].occLocation : '';
          this.occuranceFormInfo[index].occFrame = noOfOccuranceData[index].occFrame != undefined ?  noOfOccuranceData[index].occFrame : '';
          this.occuranceFormInfo[index].occEngine = noOfOccuranceData[index].occEngine != undefined ?  noOfOccuranceData[index].occEngine : '';
          this.occuranceFormInfo[index].occKMs = noOfOccuranceData[index].occKMs != undefined ?  noOfOccuranceData[index].occKMs : '';
        }
      }
    }, 1000);

  }

  // Remove Previous Service History
  removeSections1(index) {
    this.v.removeAt(index);
    this.serviceHistoryFormInfo.splice(index, 1);
    for (let v in this.serviceHistoryFormInfo) {
      this.serviceHistoryFormInfo[v].actionFlag = false;
    }
    setTimeout(() => {
      if(this.serviceHistoryFormInfo.length>1){
        var lenVal = this.serviceHistoryFormInfo.length;
        for (let v in this.serviceHistoryFormInfo) {
          this.serviceHistoryFormInfo[v].addFlag = false;
          this.serviceHistoryFormInfo[v].removeFlag = true;
          this.serviceHistoryFormInfo[v].actionFlag = true;
        }
        this.serviceHistoryFormInfo[lenVal-1].addFlag = true;
      }
      else{
        this.serviceHistoryFormInfo[0].addFlag = true;
        this.serviceHistoryFormInfo[0].removeFlag = false;
        this.serviceHistoryFormInfo[0].actionFlag = true;
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
      case 'type1':
        if(inputLength>0){
          this.serviceHistoryFormInfo[index].valid = false;
          //this.saveButtonEnable = true;
        }
      break;
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

  selectOilChange(fieldName,event,index){
    switch (fieldName) {
      case 'type1':
        this.serviceHistoryFormInfo[index].oilArray = event.value;
      break;
      default:
      break;
    }
  }

  //Previous Service History
  checkValidationSetion1(){
    for (let v in this.ppfrForm.value.serviceHistoryInfo) {
      let newDate = "";
      if(this.ppfrForm.value.serviceHistoryInfo[v].serviceDate != undefined && this.ppfrForm.value.serviceHistoryInfo[v].serviceDate != ""){
        newDate = moment(this.ppfrForm.value.serviceHistoryInfo[v].serviceDate).format('MM/DD/YYYY');
      }
      let sDate = newDate;
      this.ppfrForm.value.serviceHistoryInfo[v].serviceDate = sDate;
      console.log(this.ppfrForm.value.serviceHistoryInfo[v].serviceDate);
      let sKMs =this.ppfrForm.value.serviceHistoryInfo[v].serviceKMs;
      let sAction = this.ppfrForm.value.serviceHistoryInfo[v].serviceAction;
      let sObservations = this.ppfrForm.value.serviceHistoryInfo[v].serviceObservations;
      let sActionDetails = this.ppfrForm.value.serviceHistoryInfo[v].serviceActionDetails;
      let sSelectedOil = this.ppfrForm.value.serviceHistoryInfo[v].serviceSelectedOil;
      let sGradeOil = this.ppfrForm.value.serviceHistoryInfo[v].serviceGradeOil;

      console.log(v);
      console.log(sDate);
      console.log(sKMs);
      console.log(sAction);
      console.log(sObservations);
      console.log(sActionDetails);
      console.log(sSelectedOil);
      console.log(sGradeOil);

      if ((sDate != "") || (sKMs != undefined && sKMs != "") || (sAction != undefined && sAction != "" ) || ( sObservations != undefined && sObservations != "" ) || ( sActionDetails != undefined && sActionDetails != "" ) || ( sSelectedOil != undefined && sSelectedOil != "" ) || ( sGradeOil != undefined && sGradeOil != "") ) {
        this.serviceHistoryFormInfo[v].valid = false;
      }
      else{
        this.serviceHistoryFormInfo[v].valid = true;
      }
    }
    console.log(this.serviceHistoryFormInfo);
  }
  //No. of Occurance
  checkValidationSetion2(){
    for (let o in this.ppfrForm.value.occuranceInfo) {

      let occLocation =this.ppfrForm.value.occuranceInfo[o].occLocation;
      let occFrame = this.ppfrForm.value.occuranceInfo[o].occFrame;
      let occEngine = this.ppfrForm.value.occuranceInfo[o].occEngine;
      let occKMs = this.ppfrForm.value.occuranceInfo[o].occKMs;

      console.log(occLocation);
      console.log(occFrame);
      console.log(occEngine);
      console.log(occKMs);

      if ((occLocation != undefined && occLocation != "") || (occFrame != undefined && occFrame != "" ) || ( occEngine != undefined && occEngine != "" ) || ( occKMs != undefined && occKMs != "" ) ) {
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
      case 'type1':
        this.serviceHistoryFormInfo[index].serviceKMs = val;
        break;
      case 'type2':
        this.occuranceFormInfo[index].occKMs = val;
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
        if(type=='type1'){
          this.removeSections1(index);
        }
        else{
          this.removeSections2(index);
        }
      }
    });
  }

onChangeSelection(type)
{

  let dataId = [];
  let dataName = [];

  dataId.push(this.selectionCountryId);
  dataName.push(this.selectionCountryName);

let colName = type;
  let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
  let footerHeight = 0;
  this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+20));
  this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;

  let apiData = {
    'apiKey': Constant.ApiKey,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'userId': this.userId,
    'lookUpdataId': 29,
    'lookupHeaderName': colName,
    'groupId': 0,
    'loopUpData':  29,
    'isActivetrue': true,
    'fromPPFR': '1'
  };

  let inputData = {
    actionApiName: "",
    actionQueryValues: "",
    selectionType: "single",
    field:'countryList',
    title: colName,
    filteredItems: dataId,
    filteredLists: dataName,
    baseApiUrl: Constant.TechproMahleApi,
    apiUrl: Constant.TechproMahleApi+""+Constant.getLookupTableData,
 };

  const modalRef = this.modalService.open(ManageListComponent, this.config);
  modalRef.componentInstance.access = 'newthread';
  modalRef.componentInstance.accessAction = false;
  modalRef.componentInstance.headerPoint = 'LookupDataPM';
  modalRef.componentInstance.apiData = apiData;
  modalRef.componentInstance.inputData = inputData;
  modalRef.componentInstance.filteredTags = dataId;
  modalRef.componentInstance.filteredLists = dataName;
  modalRef.componentInstance.height = innerHeight;
  modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
    modalRef.dismiss('Cross click');
    receivedService;
    console.log(receivedService);
    let tagItems = receivedService;
    let id='';
    let name='';
    if(receivedService){
      this.selectionCountryOption = receivedService;
      if(tagItems.length>0){
        for(let tst in tagItems){
          id = tagItems[tst].id;
          name = tagItems[tst].name;
          this.country = name;
          this.selectionCountryId.push(id);
          this.selectionCountryName.push(name);
        }
      }
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

}

