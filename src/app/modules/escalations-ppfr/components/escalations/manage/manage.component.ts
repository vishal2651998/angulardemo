import { Component, OnInit, HostListener,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../../../components/common/confirmation/confirmation.component";
import { Router } from "@angular/router";
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

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @ViewChild('dayPicker1', {static: false}) datePicker1: DatePickerComponent;
  @ViewChild('dayPicker2', {static: false}) datePicker2: DatePickerComponent;
  @ViewChild('dayPicker3', {static: false}) datePicker3: DatePickerComponent;
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
  public user: any;
  public domainId;
  public userId;
  public innerHeight: number;
  public bodyHeight: number;
  public failureStatus: string = '';
  public plant: string = '';
  public serverity: string = '';
  public category: string = '';
  public occurrence: string = '';
  public ppfrDate: string = '';
  public refNo: string = '';
  public model: string = '';
  public dealerName: string = '';
  public dealerCity: string = '';
  public dealerArea: string = '';
  public frameNumber: string = '';
  public engineNumber: string = '';
  public dateOfSale;
  public dateOfRepair;
  public KMSReading: string = '';
  public partReplaced: string = '';
  public complaintDesc: string= '';
  public observationDesc: string= '';
  public dealerActionDesc: string= '';
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
  public dealerCityArray: any = [];
  public dealerAreaArray: any = [];
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
  public TVSIBDomain:boolean = false;
  public platformId: string;
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
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
    private escalationApi: EscalationsService,
    private config: NgbModalConfig,
  ) { 
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }
   
  // convenience getters for easy access to form fields
   get f() {
    return this.ppfrForm.controls;
  }

  ngOnInit(): void {

    let today = moment().add(1, 'd');
    this.minDate = moment(today).format('MM/DD/YYYY');
   
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;  
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;

    this.platformId=localStorage.getItem('platformId');
    this.TVSIBDomain = (this.platformId=='2' && this.domainId == '97') ? true : false; 

    let ppfrValues = localStorage.getItem("ppfrValues") != null && localStorage.getItem("ppfrValues") != undefined ? localStorage.getItem("ppfrValues") : '';
    ppfrValues = (ppfrValues !='' ) ? JSON.parse(localStorage.getItem("ppfrValues")) : '';
    
    if(ppfrValues != ''){
      console.log("ppfrValues"+ppfrValues['ppfrEdit']);
      this.ppfrEdit = ppfrValues['ppfrEdit']; // already edited
      this.threadId = ppfrValues['threadId'];
      this.prevPage = ppfrValues['page'];
    }

     if(this.ppfrEdit == '1'){
      
      this.title = 'Edit PPFR Form';
      this.saveButtonEnable = true;

      const apiFormData = new FormData();
  
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
    
      this.escalationApi.getEscalateThreadDetails(apiFormData).subscribe(res => {        
        if(res.status=='Success'){

            this.ppfrViewData = res.formDetails[0]; 
            console.log(this.ppfrViewData);

            this.failureStatus = this.ppfrViewData.failureStatus;
            this.plant =  this.ppfrViewData.plant;
            this.serverity =  this.ppfrViewData.serverity;
            this.category =  this.ppfrViewData.category;
            this.occurrence =  this.ppfrViewData.noOfOccurrence;
            console.log(this.ppfrViewData.ppfrDate);
            this.ppfrDate =  this.ppfrViewData.ppfrDate != 'undefined' && this.ppfrViewData.ppfrDate != undefined ? this.ppfrViewData.ppfrDate : ''; 
            if(this.ppfrDate!=''){
              this.ppfrDate = moment(this.ppfrDate).format('MM/DD/YYYY'); 
            }
            console.log(this.ppfrDate);
            this.refNo =  this.ppfrViewData.ppfrRefNo;
            this.model =  this.ppfrViewData.modelName;
            this.dealerName =  this.ppfrViewData.dealerName;
            this.dealerCity =  this.ppfrViewData.dealerCity;
            this.dealerArea =  this.ppfrViewData.dealerArea;
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

      this.model = ppfrValues['model'];
      this.dealerName = ppfrValues['dealerName'];
      this.dealerCity = ppfrValues['dealerCity'];
      this.dealerArea = ppfrValues['dealerArea'];
      this.frameNumber = ppfrValues['frameNumber'];
      this.KMSReading = ppfrValues['odometer'];
      this.setFormData();  
      setTimeout(() => {
        this.setScreenHeight();  
        this.loading = false; 
      }, 1000);    
    }   
    

    if(!this.TVSIBDomain){
    this.headerData = {
      'pageName': 'ppfr',
      'threadId': this.threadId,
      'threadStatus': '',
      'threadStatusBgColor': '',
      'threadStatusColorValue': '',
      'threadOwnerAccess': false,                
      'reopenThread': '',
      'closeThread': '',
      'techSubmmit': false,
      'scorePoint': ''     
    };
  }
  else{

    let action1;
    let title1;
    let id1 = this.threadId != '' && this.threadId != undefined && this.threadId != null ? this.threadId : '';
    if(this.ppfrEdit == '1'){    
      action1 = 'edit'; 
      title1 = 'Edit PPFR Form';
      id1 = id1;
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
  }

    let threadAction;
    let action;
    if(this.ppfrEdit == '0'){      
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
      failureStatus: [this.failureStatus, []],
      plant: [this.plant, []],
      serverity: [this.serverity, []],
      category: [this.category, []],
      occurrence: [this.occurrence, []], 
      ppfrDate: [this.ppfrDate, []]         ,
      refNo: [this.refNo, []],
      model: [this.model, []],
      dealerName: [this.dealerName, []],
      dealerCity: [this.dealerCity, []],
      dealerArea: [this.dealerArea, []],
      dateOfSale: [this.dateOfSale, []],
      dateOfRepair: [this.dateOfRepair, []],
      frameNumber: [this.frameNumber, []],
      engineNumber: [this.engineNumber, []],     
      KMSReading: [this.KMSReading, []],
      partReplaced: [this.partReplaced, []],
      complaintDesc: [this.complaintDesc, []],
      observationDesc: [this.observationDesc, []],
      dealerActionDesc: [this.dealerActionDesc, []]      
    }); 

  }
  getDealerAreaCode(){
    const apiFormData = new FormData();
  
    apiFormData.append('api_key', Constant.ApiKey);
    apiFormData.append('domain_id', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('user_id', this.userId);    
  
    this.escalationApi.getUsagemetricsfiltercontent(apiFormData).subscribe(res => {        
      if(res.status=='Success'){ 
        this.dealerAreaArray = res.data[0].areaContent;
         this.dealerCityArray = res.data[0].cityContent;
      }
    });

  }
  
  // selectContent
  selectContent(action) {
    let users = '';   
    let apiData = {
      api_key: Constant.ApiKey,
      user_id: this.userId,
      domain_id: this.domainId,
      countryId: this.countryId    
    };    
    const modalRef = this.modalService.open(ManageUserComponent, this.config);
    modalRef.componentInstance.access = this.pageAccess;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = this.innerHeight;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.selectedUsers = users;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      console.log(receivedService);  
      if(!receivedService.empty)  {
        if(action == 'city') {
          this.dealerCity = receivedService;
        }
        else{
          this.dealerArea = receivedService;
        }
      }
      modalRef.dismiss('Cross click');    
    });
      
  }

  viewPDF(){
    var aurl =  Constant.TechproMahleApi + forumPageAccess.PPFRPDFviewer + this.threadId;
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
    if(event.htmlValue != null){ 
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
      }    
      this.saveButtonEnable = true;
      console.log(this.saveButtonEnable);
    }
    else{
      this.checkFields();
    }    
  }

  // change Date
  changeDate(event,type){
    let newDate = moment(event).format('MM/DD/YYYY'); 
    console.log(newDate);      
    switch(type){
      case 'date1':  
        this.ppfrDate = this.ppfrDate == newDate ? this.ppfrDate : newDate;
        this.saveButtonEnable = true;
        break;
      case 'date2':
        this.dateOfSale = this.dateOfSale == newDate ? this.dateOfSale : newDate;
        this.saveButtonEnable = true;
        break
      case 'date3':
        this.dateOfRepair = this.dateOfRepair == newDate ? this.dateOfRepair : newDate;
        this.saveButtonEnable = true;
        break;
    }    
  
  }
  openDatePicker(type){    
    switch(type){
      case 'date1':  
        this.datePicker1.api.open();
        break;
      case 'date2':
        this.datePicker2.api.open();
        break
      case 'date3':
        this.datePicker3.api.open();
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
    this.saveButtonEnable = true;
    console.log(this.saveButtonEnable);
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
    let partFormData = new FormData();  

    this.ppfrDate = this.ppfrDate != 'undefined' && this.ppfrDate != undefined ? this.ppfrDate: '';
    this.dateOfSale = this.dateOfSale != 'undefined' && this.dateOfSale != undefined ? this.dateOfSale: '';
    this.dateOfRepair = this.dateOfRepair != 'undefined' && this.dateOfRepair != undefined ? this.dateOfRepair: '';
    this.complaintDesc = this.complaintDesc == null ? '' : this.complaintDesc;
    this.observationDesc = this.observationDesc == null ? '' : this.observationDesc;
    this.dealerActionDesc = this.dealerActionDesc == null ? '' : this.dealerActionDesc;

    partFormData.append("apiKey", Constant.ApiKey);
    partFormData.append("domainId", this.domainId);
    partFormData.append("countryId", this.countryId);
    partFormData.append("createdBy", this.userId);   
    partFormData.append("threadId", this.threadId);
    partFormData.append("failureStatus", this.failureStatus);
    partFormData.append("plant", this.plant);
    partFormData.append("serverity", this.serverity);
    partFormData.append("category", this.category);
    partFormData.append("noOfOccurrence", this.occurrence);
    partFormData.append("ppfrDate", this.ppfrDate);
    partFormData.append("ppfrRefNo", this.refNo);
    partFormData.append("modelName", this.model);
    partFormData.append("dealerName", this.dealerName);
    partFormData.append("dealerCity", this.dealerCity);
    partFormData.append("dealerArea", this.dealerArea);
    partFormData.append("frameNo", this.frameNumber);
    partFormData.append("engineNo", this.engineNumber);
    partFormData.append("dateOfSale", this.dateOfSale);
    partFormData.append("dateOfRepair", this.dateOfRepair);
    partFormData.append("kms", this.KMSReading);
    partFormData.append("partReplaced", this.partReplaced);
    partFormData.append("customerComplaint", this.complaintDesc);
    partFormData.append("dealerObservation", this.observationDesc);
    partFormData.append("dealerAction", this.dealerActionDesc);  
    partFormData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
    partFormData.append('deleteMediaId',  JSON.stringify(this.deletedFileIds));
    
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );

    console.log(partFormData);

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
            msgModalRef.dismiss('Cross click');
            //localStorage.removeItem('threadNav');
            if(this.teamSystem) {
              window.open(this.nextUrl, IsOpenNewTab.teamOpenNewTab);
            } else { 
                window.opener.location.reload();
                if(this.prevPage == 'ppfr'){
                  window.close();
                }               
                else{
                  this.router.navigate([this.nextUrl]);
                }    
            }
          }, 5000);    
        } 
      }   
    });
  }

  onChange(){     
    if(this.ppfrEdit == '0'){
      this.checkFields();   
    }
  }
  checkFields(){
    let ppfrValues = localStorage.getItem("ppfrValues") != null && localStorage.getItem("ppfrValues") != undefined ? localStorage.getItem("ppfrValues") : '';
    ppfrValues = (ppfrValues !='' ) ? JSON.parse(localStorage.getItem("ppfrValues")) : '';      
    console.log(ppfrValues);
    if(this.model != ppfrValues['model'] || this.dealerName != ppfrValues['dealerName'] || this.dealerCity != ppfrValues['dealerCity'] || this.dealerArea != ppfrValues['dealerArea'] || this.frameNumber != ppfrValues['frameNumber'] || this.KMSReading != ppfrValues['odometer'] || this.failureStatus != '' || this.plant != '' || this.serverity != '' || this.category != '' || this.occurrence != '' || this.refNo !='' || this.engineNumber !='' || this.partReplaced !=''){           
      this.saveButtonEnable = true;
      console.log(this.saveButtonEnable);
    }
    else{
      this.saveButtonEnable = false;
    }  
    
  }

}
