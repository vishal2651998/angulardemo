import { Component, OnInit, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ThreadService } from 'src/app/services/thread/thread.service';
import { RepairOrderService } from 'src/app/services/repair-order/repair-order.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { Constant, ManageTitle, ContentTypeValues } from '../../../../common/constant/constant';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { CommonService } from 'src/app/services/common/common.service';
import { SubmitLoaderComponent } from '../../../../components/common/submit-loader/submit-loader.component';
import { Subscription } from "rxjs";
import { BaseService } from 'src/app/modules/base/base.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { countries } from 'country-data';
import { LandingpageService } from '../../../../services/landingpage/landingpage.service';
import * as moment from 'moment';
import * as ClassicEditor from "src/build/ckeditor";

@Component({
  selector: 'app-schedule-service',
  templateUrl: './schedule-service.component.html',
  styleUrls: ['./schedule-service.component.scss']
})
export class ScheduleServiceComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public loading: boolean = true;
  public mobileBrowser: boolean = false;
  public headTitle: string = "Repair Order";
  public showMobileMenu: boolean = false;
  public year = moment().year();
  public domainId;
  public userId: string = '';
  public bodyClass:string = "auth-index";
  public bodyElem;
  public innerHeight: number;
  public bodyHeight: number;
  scheduleForm: FormGroup;
  public servicetype: string = '';
  public sfirstname;
  public slastname;
  public semailaddress;
  public sphonenumber;
  public businessname;
  public businessId;
  public businessaddress1;
  public businessaddress2;
  public state;
  public city;
  public zip;
  public bussemailaddress;
  public bussphonenumber;
  public vin;
  public make;
  public model;
  public vyear;
  public odo;
  public unit: string = '';
  public ordernumber;
  public productservices;
  public dninvoice;
  public technician: any = [];
  public contactTechnician: string = '';  
  public description: string = '';
  formProcessing: boolean = false;
  public postUploadActionTrue: boolean = false;
  public postUpload: boolean = true;
  public manageAction: string;
  public postApiData: object;
  public uploadedItems: any = [];
  public commentUploadedItemsFlag: boolean = false;
  public commentUploadedItemsLength: number = 0;
  public contentType: number = 50;
  public mediaUploadItems: any = [];
  public mediaAttachments: any = [];
  public mediaAttachmentsIds: any = [];
  public odometerFlag: boolean = false;
  public problemDescFlag: boolean = false;
  public errroMsgFlag: boolean = false;
  public urlWorkOrderId;
  public urlDomainId;
  public formreadonlyflag: boolean = true;
  public businessLogo = '';
  public successFlag: boolean = false;
  public Editor = ClassicEditor;
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};
  public workOderId: string = '';
  public bodyClass2: string = "submit-loader";
  public displayOrder: number = 0;
  public actionFlag:boolean = false;
  public actionTitle = 'Add Technician';
  subscription: Subscription = new Subscription();
  public unitOptions: any = [];
  public servicetypeOptions: any = [];
  public maxLen: number = 300;
  public odoReadOnly: boolean = true;

  serviceContactForm: FormGroup;
  public serviceContactSubmit: boolean = false;
  public phoneNumberData:any;
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phonenoInputFlag:boolean = true;
  public phoneNumberValid:boolean = false;
  public invalidNumber:boolean = true; 
  public emailValidationError:boolean = false;
  public emailValidationErrorMsg = "";
  public contactDisable: boolean = true;
  submitClicked = false;
  contacts: any = [];
  selectedContact: any = [];
  selectedContactId: any = [];
  public bussContachInfo: string = '';
  public technicianValidFlag: boolean = false;
  public fuserDomain: boolean = false;
  public diagnationDomain: boolean = false;
  public splittedDomainURL: string = '';
  public billingFirstName: string = '';
  public billingLastName: string = '';
  public initComplaint: string = '';
  public serviceError: boolean = false;
  public serviceErrorMsg: string = '';
  
  configCke: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
      items: [
       "bold",
        "Emoji",
        "italic",
        "link",
       "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
       
      ],
    },
    placeholder: 'Enter Additional Problem Detail',
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
    maxLength: 10
  };


  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private titleService: Title,
    private threadApi: ThreadService,
    private repairOrderApi: RepairOrderService,
    private formBuilder: FormBuilder,
    private apiUrl: ApiService,
    private modalService: NgbModal,
    private commonApi: CommonService,
    private modalConfig: NgbModalConfig,
    private baseSerivce: BaseService,
    private authenticationService: AuthenticationService,
    private LandingpagewidgetsAPI: LandingpageService,
  ) {
    modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }

  // convenience getters for easy access to form fields
  get tscf() { return this.serviceContactForm.controls; }

  ngOnInit(): void {

    let currentURL = window.location.href;
    //let currentURL = "https://fuser.collabtic.com/repair-order/schedule-service?id=1&domainId=343";
    let splittedURL1 = currentURL.split("://");
    //splittedURL1[1] = "fuser.collabtic.com"; // check url
    let splittedURL2 = splittedURL1[1].split(".");
    this.splittedDomainURL = splittedURL2[0];

    this.domainId = this.checkSubDomainName(this.splittedDomainURL); 

    this.apiUrl.repairOrderPublicPage = true;    
    //this.domainId = this.apiUrl.repairOrderPublicDomainId;
    this.userId = this.apiUrl.repairOrderPublicUserId;

    this.urlWorkOrderId = this.getQueryParamFromMalformedURL1('id');

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);

    let defaultLanguage = [{"id":"1","name":"English"}];    
    localStorage.setItem('defaultLanguage', JSON.stringify(defaultLanguage));

    setTimeout(() => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        /* your code here */
        this.mobileBrowser = true;
      }
      else{
        this.mobileBrowser = false;
      }
      let obj = {};
      this.postApiData = {
        access: 'workorder',
        pageAccess: 'workorder',
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        userId: this.userId,
        contentType: this.contentType,      
        displayOrder: this.displayOrder,
        uploadedItems: [],
        attachments: [],
        attachmentItems: [],
        updatedAttachments: [],
        deletedFileIds: [],
        removeFileIds: [],
        pushData: obj
      };

      this.unit = "MI";
      this.unitOptions = ["MI" ,"KM"];

      this.servicetype = "Tech Support";
      this.servicetypeOptions = ["Tech Support" ,"Remote"];
      this.createForm('serviceContact');
      this.getFormData();
      this.setScreenHeight();
      

      this.subscription.add(
        this.commonApi.workoderDataReceivedSubject.subscribe((response) => {
          if(response){
            this.successFlag = true;
          }
        })
      );
     
    }, 1000);
  }

  getQueryParamFromMalformedURL1(id) {
    const results = new RegExp('[\\?&]' + id + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }
  getQueryParamFromMalformedURL2(domainId) {
    const results = new RegExp('[\\?&]' + domainId + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }

  
  get f() {
    return this.scheduleForm.controls;
  }

  // validate domain name 
  checkSubDomainName(domainName) {   
    const subDomainData = new FormData();
    subDomainData.append('apiKey', Constant.ApiKey);
    subDomainData.append('domainName', domainName);
       this.authenticationService.validateSubDomain(subDomainData).subscribe((response) => {
      if (response.status == "Success") {
        let domainData = response.data[0];
        this.domainId = domainData.domainId;
        this.businessLogo = domainData.businessLogo == '' ? 'assets/images/logo.png' : domainData.businessLogo;
      }
      else {    
        this.urlDomainId = this.getQueryParamFromMalformedURL2('domainId');  
        this.domainId = this.urlDomainId == 0 ? this.apiUrl.repairOrderPublicDomainId : this.urlDomainId;
      }

      this.fuserDomain = this.domainId == '343' ? true : false;
      this.diagnationDomain = this.domainId == '338' ? true : false;
      return this.domainId;

    },
      (error => {
        this.urlDomainId = this.getQueryParamFromMalformedURL2('domainId'); 
        this.domainId = this.urlDomainId == 0 ? this.apiUrl.repairOrderPublicDomainId : this.urlDomainId;

        this.fuserDomain = this.domainId == '343' ? true : false;
        this.diagnationDomain = this.domainId == '338' ? true : false;
        return this.domainId;

      })
    );
    
  }

  setFormData(){ 
    this.loading = false; 
    if(this.diagnationDomain){
      this.scheduleForm = this.formBuilder.group({     
        servicetype: [this.servicetype, []],
        sfirstname: [this.sfirstname, []], 
        slastname: [this.slastname, []], 
        semailaddress: [this.semailaddress, []], 
        sphonenumber: [this.sphonenumber, []],
        businessname: [this.businessname, []],
        businessaddress1: [this.businessaddress1, []],
        businessaddress2: [this.businessaddress2, []],
        state: [this.state, []],
        city: [this.city, []],       
        zip: [this.zip, []],       
        bussemailaddress: [this.bussemailaddress, []], 
        bussphonenumber: [this.bussphonenumber, []],   
        vin: [this.vin, []],   
        make: [this.make, []],   
        model: [this.model, []],   
        vyear: [this.vyear, []],   
        odo: [this.odo, []],   
        ordernumber: [this.ordernumber, []],   
        productservices: [this.productservices, []],   
        dninvoice: [this.dninvoice, []],   
        technician: [this.technician, []],   
        description: [this.description, []], 
        billingFirstName: [this.billingFirstName, []],
        billingLastName: [this.billingLastName, []], 
        initComplaint: [this.initComplaint, []],  
    });    
    } 
    else{
      this.scheduleForm = this.formBuilder.group({     
        servicetype: [this.servicetype, []],
        sfirstname: [this.sfirstname, []], 
        slastname: [this.slastname, []], 
        semailaddress: [this.semailaddress, []], 
        sphonenumber: [this.sphonenumber, []],
        businessname: [this.businessname, []],
        businessaddress1: [this.businessaddress1, []],
        businessaddress2: [this.businessaddress2, []],
        state: [this.state, []],
        city: [this.city, []],       
        zip: [this.zip, []],       
        bussemailaddress: [this.bussemailaddress, []], 
        bussphonenumber: [this.bussphonenumber, []],   
        vin: [this.vin, []],   
        make: [this.make, []],   
        model: [this.model, []],   
        vyear: [this.vyear, []],   
        odo: [this.odo, []],   
        ordernumber: [this.ordernumber, []],   
        productservices: [this.productservices, []],   
        dninvoice: [this.dninvoice, []],   
        technician: [this.technician, []],   
        description: [this.description, []],  
    });    

    } 

  
  }
   // Form Submit
   formSubmit(type) {
      let str = '';
      //if(this.odo != '' && this.description.trim() != '' && this.technician.length>0 ){
      if(this.description != ''){
        this.errroMsgFlag = false;
        this.odometerFlag = false;
        this.problemDescFlag = false;
        this.formProcessing = true;

        let uploadCount = 0;
        if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
          this.uploadedItems.attachments.forEach(item => {
            //console.log(item)
            if(item.accessType == 'media') {
              
            } else {
              uploadCount++;
            }       
          });
      }    
      this.bodyElem.classList.add(this.bodyClass2);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );
      const apiFormData = new FormData();
      if(this.bussContachInfo != ''){
        let cindex1 = this.technician.findIndex(option => option == this.bussContachInfo);
        if(cindex1 == '-1'){
          this.technician.push(this.bussContachInfo);
        }
      }
      
      let techArr = this.technician!='' ? JSON.stringify(this.technician): '' ;
      
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('shopId', "0");
      apiFormData.append('contactInfo', "");
      apiFormData.append('technicianId', techArr);
      apiFormData.append('createdBy', this.bussContachInfo);
      apiFormData.append('userId', this.userId);
      apiFormData.append('id', this.urlWorkOrderId);
      apiFormData.append('requestType', this.servicetype);
      apiFormData.append('businessName', this.businessname);
      apiFormData.append('businessId', this.businessId);
      apiFormData.append('address1', this.businessaddress1);          
      apiFormData.append('address2', this.businessaddress2);     
      apiFormData.append('firstName', this.sfirstname);     
      apiFormData.append('lastName', this.slastname);
      apiFormData.append('contactPersonEmail', this.semailaddress);
      apiFormData.append('contactPersonPhone', this.sphonenumber);          
      apiFormData.append('city', this.city);
      apiFormData.append('state', this.state);
      apiFormData.append('zip', this.zip);     
      apiFormData.append('emailAddress', this.bussemailaddress);     
      apiFormData.append('phoneNumber', this.bussphonenumber);     
      apiFormData.append('vin', this.vin);     
      apiFormData.append('make', this.make);     
      apiFormData.append('model', this.model);     
      apiFormData.append('year', this.vyear);     
      apiFormData.append('odometer', this.odo);     
      apiFormData.append('unit', this.unit);     
      apiFormData.append('orderNumber', this.ordernumber);     
      apiFormData.append('productService', this.productservices);     
      apiFormData.append('dnInvoice', this.dninvoice);     
      apiFormData.append('description', this.description); 
      if(this.diagnationDomain){
        apiFormData.append('billingFirstName', this.billingFirstName); 
        apiFormData.append('billingLastName', this.billingLastName); 
        apiFormData.append('initComplaint', this.initComplaint); 
      }
      apiFormData.append('approved', "1"); 
      apiFormData.append('fromPublic', "1");
      let pushFormData = new FormData();
      pushFormData.append('apiKey', Constant.ApiKey);
      pushFormData.append('domainId', this.domainId);    
      pushFormData.append('userId', this.userId);
      pushFormData.append('contentTypeId', ContentTypeValues.RepairOrder);
      pushFormData.append('groups', '');
      pushFormData.append('makeName', this.make);                  
      pushFormData.append('formWorkOrder', '1');
      //new Response(apiFormData).text().then(console.log)
      //return false;
      this.repairOrderApi.updateSupportTicketsList(apiFormData).subscribe(res => {
        //console.log(res)
        modalRef.dismiss("Cross click");      
        this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){ 
          this.errroMsgFlag = true;   
          this.formProcessing = false;
          let postId= res.data.postId;
          let threadId= res.data.threadId;
          let workOrderId = res.data.workOrderId;
          this.workOderId = res.data.workOrderId;
          pushFormData.append('threadId', threadId);
          pushFormData.append('postId', postId);  
          pushFormData.append('workOrderId', workOrderId); 

          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {

            this.postApiData['uploadedItems'] = this.uploadedItems.items;
            this.postApiData['attachments'] = this.uploadedItems.attachments;            
            this.postApiData['message'] = res.result;
            this.postApiData['workOrderId'] = workOrderId;
            this.postApiData['dataId'] = postId;
            this.postApiData['postId'] = postId;
            this.postApiData['threadId'] = threadId;  
            this.postApiData['pushData'] = pushFormData;                
            this.manageAction = 'uploading';

            this.postUpload = false;             
            setTimeout(() => {   
              this.postUploadActionTrue = true; 
              this.postUpload = true;              
            }, 100);    
          }
          else{
            let apiDatasocial = new FormData();    
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', threadId);
              apiDatasocial.append('postId', postId);
              apiDatasocial.append('userId', this.userId); 
              apiDatasocial.append('action', 'create'); 
              apiDatasocial.append('actionType', '1');
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { });  
              this.successFlag = true;
              this.threadApi.threadPush(pushFormData).subscribe((response) => {});
          }
        }
        else{
          this.errroMsgFlag = true;   
          this.formProcessing = false;
        }
      },
      (error => {
        this.errroMsgFlag = true;   
        this.formProcessing = false;  
      }) 
      ); 
     }
      else{        
        /*if(this.odo == ''){
          this.odometerFlag = true;
        }*/
        if(this.description == ''){
          this.problemDescFlag = true;
        }
        /*if(this.technician.length==0) {
          this.technicianValidFlag = true;
        }*/   
        this.errroMsgFlag = true;
      }        
   }
   onChange(type){
    switch(type){
      case 'odo':
        if(this.odo == ''){
          //this.odometerFlag = true;
        }
        else{
          this.odometerFlag = false;
          this.odo = this.commonApi.removeCommaNum(this.odo);
          this.odo = this.commonApi.numberWithCommasThreeDigit(this.odo);
        }
        break;     
      case 'desc':
        if(this.description.trim() == ''){
          this.problemDescFlag = true;
        }
        else{          
          this.problemDescFlag = false;
        }
        break;
    }
  }
  setScreenHeight(){
    this.bodyHeight = window.innerHeight;
    //this.innerHeight = this.bodyHeight-102;
    //this.innerHeight = 102;
  }
  redirectionPage(){    
    window.location.href = Constant.diagnationURL; 
  }
  redirectionURL(){
    window.location.href = Constant.diagnationURL;   
  }
  getFormData(){
    let apiData = new FormData();    
    apiData.append('apiKey', Constant.ApiKey);
    apiData.append('id', this.urlWorkOrderId);
    this.repairOrderApi.getSupportTicketsList(apiData).subscribe((response) => { 
      if(response.status == 'Success'){
        let loadDataTotal = response.data.total;
        if(loadDataTotal>0){
          this.formreadonlyflag = true;
          let loadData = response.data.items[0];        
          //console.log(loadData);
          //this.servicetype = loadData.requestType;
          this.sfirstname = loadData.firstName;
          this.slastname = loadData.lastName;
          this.semailaddress = loadData.contactPersonEmail;
          this.sphonenumber = loadData.contactPersonPhone;
          this.businessname = loadData.businessName;
          this.businessId = loadData.businessId != '' && loadData.businessId != undefined ? loadData.businessId : '' ;
          this.bussinessContactInfo();
          if(this.businessLogo == ''){
            // local or dev
            this.checkSubDomainName(this.businessname);
          } 
          this.businessaddress1 = loadData.address1;
          this.businessaddress2 = loadData.address2;
          this.state = loadData.buss_state;
          this.city = loadData.city;
          this.zip = loadData.zip;
          this.bussemailaddress = loadData.emailAddress;
          this.bussphonenumber = loadData.phone_number;
          this.vin = loadData.vin;
          this.make = loadData.make;
          this.model = loadData.model;
          this.vyear = loadData.year;
          this.odo = loadData.odometer;
          this.odoReadOnly = loadData.odometer == '' ? false : true;
          this.unit = loadData.unit == 'undefined' || loadData.unit != undefined || loadData.unit != '' ? "MI" : loadData.unit.toUpperCase();
          this.ordernumber = loadData.order_number;
          this.productservices = loadData.product_service;
          this.dninvoice = loadData.dn_invoice;
          this.contactTechnician = '';
          this.description = loadData.description == 'undefined' || loadData.description != undefined || loadData.description != '' ? loadData.description : '';
          this.initComplaint = loadData.initComplaint == 'undefined' || loadData.initComplaint != undefined || loadData.initComplaint != '' ? loadData.initComplaint : '';
          this.billingFirstName = loadData.billingFirstName;
          this.billingLastName = loadData.billingLastName;
        }
        else{
          this.contactTechnician = '';
          this.description = '';
          this.odo = '';
          this.formreadonlyflag = false;
          this.unit = "MI";
        }
        this.getTechnicianList();
        /*setTimeout(() => {
          this.setFormData();
        }, 500);*/
      }
      else{}
    });   
  }
  attachments(items) {
    this.uploadedItems = items;
  }
  attachmentPopup(val = 0,type) {
    let postId = val;
    if(type=='new'){
      postId = 0;
    }
    //(this.uploadedItems); 
    let fitem = [];  
    let mitem = [];  
    let obj = {};
    this.postApiData = {
      action: 'new',
      access: 'workorder',
      pageAccess: 'workorder',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: '',
      userId: this.userId,
      threadId: '',      
      postId: postId,      
      contentType: this.contentType,      
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: [],
      pushData: obj
    };

    if(this.uploadedItems != '') {            
      if(this.uploadedItems.items.length>0){
        fitem = this.uploadedItems; 
        this.postApiData['uploadedItems'] = this.uploadedItems.items;
        this.postApiData['attachments'] = this.uploadedItems.attachments;
      }
    }           
    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.mediaAttachments = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.presetAttchmentItems = mitem;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {
      //(receivedService.uploadedItems);     
      if(receivedService){
        this.uploadedItems = receivedService.uploadedItems;       
          if(this.uploadedItems != '') {            
            if(this.uploadedItems.items.length>0){
              this.commentUploadedItemsLength = this.uploadedItems.items.length;
              this.commentUploadedItemsFlag = true;              
            }
            else{
              this.commentUploadedItemsLength = 0;
              this.commentUploadedItemsFlag = false;              
            }
          }
          else{
            this.commentUploadedItemsLength = 0;
            this.commentUploadedItemsFlag = false;            
          }         
      }
      else{        
          if(this.uploadedItems.items.length>0){
            this.commentUploadedItemsLength = this.uploadedItems.items.length;
            this.commentUploadedItemsFlag = true;            
          }
          else{
            this.commentUploadedItemsLength = 0;
            this.commentUploadedItemsFlag = false;            
          }
        }      
     // this.apiUrl.attachmentNewPOPUP = false;
      modalRef.dismiss('Cross click');
      
    });      
  }  
  // Allow only numeric
  restrictNumeric(e) {
    let res = this.commonApi.restrictNumeric(e);
    return res;
  }
  // Allow only numeric
  restrictLength(e) {
   /* if(this.description.trim().length>299){
      return false;
    }*/
  }
  createForm(action, item:any = '', date:any = '') {
   // console.log(item)
    //let contactId = (item == '') ? 0 : item.id;
    let firstName = (item == '') ? '' : item.firstName;
    let lastName = (item == '') ? '' : item.lastName;
    let email = (item == '') ? '' : item.email;
    let countryName = (item == '') ? '' : item.countryName;
    let countryCode = (item == '') ? '' : item.countryCode;
    let dialCode = (item == '') ? '' : item.dialCode;
    let phoneNumber = (item == '') ? '' : item.phoneNumber;
    this.icountryCode = (item = '') ? this.icountryCode : countryCode;
    this.iphoneNumber = (item = '') ? this.iphoneNumber : phoneNumber;
    this.icountryName = (item = '') ? this.icountryName : countryName;
    this.idialCode = (item = '') ? this.idialCode : dialCode;
    this.phoneNumberData = {  
      countryCode: this.icountryCode, 
      phoneNumber: this.iphoneNumber,
      country: this.icountryName, 
      dialCode: this.idialCode,
      access: 'phone'
    }
    this.serviceContactForm = this.formBuilder.group({
      techFirstName: [firstName, [Validators.required]],
      lastName: [lastName, [Validators.required]],
      email: [email, [Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      countryName: [countryName],
      countryCode: [countryCode],
      dialCode: [dialCode],
      phoneNumber: [phoneNumber]
    });
  }
  // Form Action
  formAction(action) {
    //console.log(action);
    switch (action) {
      case 'submit':
        this.submitClicked = true;
        this.techFormSubmit();
        break;

      default:
        this.formProcessing = false;
        this.formCancel();
        break;
    }
  }

  // Form Submit
  techFormSubmit() {
    
    this.serviceContactSubmit = true;
    /*for (const i in this.serviceContactForm.controls) {
      this.serviceContactForm.controls[i].markAsDirty();
      this.serviceContactForm.controls[i].updateValueAndValidity();
    }*/

    this.invalidNumber = (this.iphoneNumber.length > 0 && this.phoneNumberValid) ? false : true;
    let contactObj = this.serviceContactForm.value;
    console.log(this.serviceContactForm.valid, contactObj, this.tscf.email.errors, this.serviceContactForm, this.invalidNumber)        

    if (this.serviceContactForm.valid && (!this.tscf.email.errors || this.tscf.email.errors == null ) && (this.invalidNumber)) {
      this.formProcessing = true;
      let contactAction = 'new';
      let phoneNumber = (contactObj.countryCode == 'IN' && contactObj.phoneNumber.length > 10) ? contactObj.phoneNumber.substring(1) : contactObj.phoneNumber;
      
      let emailVal = contactObj.email != null ? contactObj.email : '';
      
      const signupData = new FormData();
      signupData.append('api_key', Constant.ApiKey);
      signupData.append('firstname', contactObj.techFirstName);  
      signupData.append('lastname', contactObj.lastName); 
      signupData.append('email', emailVal);      
      signupData.append('password', '@Password123');     
      signupData.append('phoneNumber', phoneNumber);
      signupData.append('countryName', contactObj.countryName);  
      signupData.append('countryCode', contactObj.countryCode);  
      signupData.append('dialCode', contactObj.dialCode);
      signupData.append('step', '3');  
      signupData.append('subdomainName', this.businessname );
      signupData.append('subdomainId', this.domainId );   
      signupData.append('version', '2');  
      signupData.append('fromTechnician', '1');  
      signupData.append('roleId', '4');
      signupData.append('businessName', this.businessname);
      signupData.append('businessId', this.businessId);
      //new Response(signupData).text().then(console.log)
      //return false;

      this.authenticationService.signup(signupData).subscribe((response) => {

        this.actionTitle = '';
        this.serviceContactSubmit = false;
        this.formProcessing = false;
        let id = response.Userid;
        let name;
        let email = '';
        let ph = phoneNumber != '' ? ", "+phoneNumber : '';
        
        this.serviceError = response.userStatus == 1 ? true : false;
        if(this.serviceError){
          this.serviceErrorMsg = response.message;
          return false;
        }        
        else{
          this.serviceError = false;
          this.serviceErrorMsg = '';
        }
        if(response.status == "Failure"){
          email = response.data.email != '' && response.data.email != undefined ? ", "+response.data.email : '';            
        }
        else{
          email = response.Email != '' && response.Email != undefined ? ", "+response.Email : ''; 
        }         
        email = emailVal == '' ? '' : email;   
        name = contactObj.techFirstName+" "+contactObj.lastName+email+ph;     
       
        let contactIndex = this.contacts.findIndex(option => option.id == id);
        if(contactIndex != '-1'){
          this.contacts[contactIndex].name = name;
          this.contacts[contactIndex].label = name;
        }  
        else{
          this.contacts.unshift({
            id: id,
            name: name,
            label: name              
          });                     
        }
        this.setupSelectedContacts(contactObj,id);
        this.scheduleForm.get('technician').patchValue(id); 
        this.contactTechnician = id;
        let scIndex = this.selectedContactId.findIndex(option => option == id);
        this.selectedContact[scIndex] = this.renderContact(contactObj);              
        
        this.serviceError = false;
        this.serviceErrorMsg = '';
        this.actionFlag = false;            
        this.serviceContactForm.reset();
      });
    } else {
      this.formProcessing = false;
    }        
  }
  setupSelectedContacts(item,id) {
    //console.log(item)
    let citem = this.renderContact(item);
    //console.log(citem)
    this.selectedContact.push(citem);
    //this.selectedContactId.push(id);
    this.technician = [];
    this.technician.push(id);
    //console.log(this.technician);
    }
    // Create New Options
    serviceAction(action, field, item:any = '') {
      //console.log(field);
      this.submitClicked = false;
      this.formProcessing = false;
      let formTimeout = (action == 'new') ? 0 : 500;        
      //if(!this.contactDisable) {
        let contact = 'Technician';
        this.actionTitle = (action == 'new') ? `${ManageTitle.actionNew} ${contact}` : `${ManageTitle.actionEdit} ${contact}`;
        this.emptyPhoneData();
        let citem = (action == 'new') ? '' : item;
        //this.createForm('serviceContact', citem);
        setTimeout(() => {
          this.actionFlag = true;  
          this.serviceError = false;
          this.serviceErrorMsg = '';           
          this.serviceContactForm.reset();              
        }, formTimeout);
      //}           
    }
    // Render Contact Info
    renderContact(item) {
      let fname = item.firstName;
      let lname = item.lastName;
      let name = (lname != '') ? `${fname} ${lname}` : fname;
      let email = (item.email != '' && item.email != undefined && item.email != null) ? `, ${item.email}` : '';
      let phoneNumber = (item.dialCode != '' && item.phoneNumber != '') ? `${item.dialCode} ${item.phoneNumber}` : '';
      let val = `${name}`;
      val = (email != '') ? `${val}${email}` : val;
      val = (phoneNumber != '') ? `${val}, ${phoneNumber}` : val;    
      return val;
  }
  emptyPhoneData() {
    this.icountryName = '';
    this.icountryCode = '';          
    this.idialCode = '';
    this.iphoneNumber = '';
    this.serviceContactForm.patchValue({
      countryName: this.icountryName,
      countryCode: this.icountryCode,
      dialCode: this.idialCode,
      phoneNumber: this.iphoneNumber
    });
    this.phoneNumberData = {  
      countryCode: this.icountryCode, 
      phoneNumber: this.iphoneNumber,
      country: this.icountryName, 
      dialCode: this.idialCode,
      access: 'phone'
    }
  }
  // Contact Change
  contactChanged(item) {
    //console.log(item)
    let itemVal = item.value;
    //console.log(itemVal)
    this.selectedContact = [];
    this.selectedContactId = itemVal;
    let cindex = this.contacts.findIndex(option => option.id == itemVal);
    this.selectedContact.push(this.contacts[cindex].name);
    if(itemVal!= ''){
      this.technician = [];
      this.technician.push(itemVal);
      this.technicianValidFlag = false;
    }    
    //console.log(this.contacts);
    //console.log(this.technician);
    //console.log(this.contactTechnician);
    /*itemVal.forEach(id => {
      let cindex = this.contacts.findIndex(option => option.id == id);
      this.selectedContact.push(this.contacts[cindex].name);
      this.technician = [];
      this.technician.push(id);
    });*/
  }

  emptyContact() {
    this.selectedContact = [];
    this.selectedContactId = [];
    this.contacts = [];    
  }

  // Form Cancel
  formCancel() {
    this.actionFlag = false;
    this.submitClicked = false;
    this.emptyPhoneData();
    this.serviceContactSubmit = false;
    this.serviceContactForm.reset();
  }
  // country & phone number update
  getPhoneNumberData(newValue){
    //console.log(newValue)
    if(newValue != null){
      if(newValue.phoneVal != null){ 
        if(newValue.access == 'phone'){             
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0 ;
          let placeHolderValue = newValue.placeholderVal;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;   
          
          let currPhValueTrim = '';
          let currPhValueLen = 0 ;      
          if(newValue.phoneVal['number'] != ''){
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
            currPhValueLen = currPhValueTrim.length;   
          }     
        
          if(newValue.phoneVal['number'].length>0){
            this.phonenoInputFlag = (newValue.phoneVal['number'].length>0) ? true : false; 
            this.invalidNumber = (newValue.errorVal) ? true : false; 
            
            this.phoneNumberValid = true;
            this.emptyPhoneData();
            this.iphoneNumber = newValue.phoneVal.number;

            if(currPhValueLen == placeHolderValueLen){ 
              this.phoneNumberValid = false;

              let getCode = newValue.phoneVal.countryCode;        
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;            
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;              
            }
          }
          else{
            this.phonenoInputFlag = false;
            this.iphoneNumber = '';
          }       
        }
      }
      else{
        this.phonenoInputFlag = false;
        this.invalidNumber = (newValue.errorVal) ? true : false; 
        this.phoneNumberValid = true;
        this.emptyPhoneData();
      }
    }
    else{
      this.phonenoInputFlag = false;
      this.invalidNumber = (newValue.errorVal) ? true : false; 
      this.phoneNumberValid = true;
      this.emptyPhoneData();
    }
    setTimeout(() => {      
      this.serviceContactForm.patchValue({
        countryName: this.icountryName,
        countryCode: this.icountryCode,
        dialCode: this.idialCode,
        phoneNumber: this.iphoneNumber
      });   
    }, 150);
  }

   // check email validation
   checkEmailValition(){ 
    //console.log(456)
    let emailVal = '';
    var emailError;
    emailVal = this.serviceContactForm.value.email.trim();
    emailError = this.serviceContactForm.controls.email.errors;
    //console.log(emailVal)
    if(emailVal.length>0){   
      this.emailValidationError = false;
      this.emailValidationErrorMsg = "";
      if(emailError){
        this.emailValidationError = true;
        this.emailValidationErrorMsg = "Invalid Email";
      }            
    }
  }

  getTechnicianList() {
    const searchText = '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    //apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('isRepairOrder', '1');
    apiFormData.append('businessName', this.businessname);
    let bid = this.businessId == '' ? '#1' : this.businessId;
    apiFormData.append('businessId', bid);
    //apiFormData.append('limit', '20');
    //apiFormData.append('offset', '0');
    apiFormData.append('searchText', searchText);
    this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe(
      (response) => {
        //console.log(response);
        //console.log(response)
        let technician = response?.dataInfo;
        let emptyTech = (technician.length == 0) ? true : false;
        //const view:any = 0;
        if(emptyTech) {
          this.contacts = [];
        }
        if(technician.length > 0) {          
          technician.forEach(item => {             
            let phone = (item.phoneNo!='')? ", "+item.phoneNo : '';          
            let uname;          
            let email = item.email != '' && item.email != undefined ? ', '+item.email : '';          
            uname = item.firstLastName+email+phone;     
            this.contacts.push({
              id:item.userId,
              name:uname,
              label:uname,
              view:'1'
            });
          });
        }
        //console.log(this.contacts)

        this.setFormData();

       }        
    );
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.subscription.unsubscribe();    
  }

  bussinessContactInfo(){
    if(this.semailaddress != ''){
      const signupData = new FormData();
      signupData.append('api_key', Constant.ApiKey);
      signupData.append('firstname', this.sfirstname);  
      signupData.append('lastname', this.slastname); 
      signupData.append('email', this.semailaddress);      
      signupData.append('password', '@Password123');     
      signupData.append('phoneNumber', this.sphonenumber);
      signupData.append('countryName', "United States");  
      signupData.append('countryCode', "US");  
      signupData.append('dialCode', "+1");
      signupData.append('step', '3');  
      signupData.append('subdomainName', this.businessname );
      signupData.append('subdomainId', this.domainId );   
      signupData.append('version', '2');  
      signupData.append('fromTechnician', '2'); 
      signupData.append('roleId', '4'); 
      signupData.append('businessName', this.businessname);
      signupData.append('businessId', this.businessId);

      //new Response(signupData).text().then(console.log)
      //return false;

      this.authenticationService.signup(signupData).subscribe((response) => {    
        let id = response.Userid;
        if(id!= ''){
          this.bussContachInfo = id;
        }
      });
    }
  }

}
