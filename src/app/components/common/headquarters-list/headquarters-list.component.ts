import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ApiService } from 'src/app/services/api/api.service';
import { Table } from "primeng/table"; 
import { Title, DomSanitizer } from "@angular/platform-browser";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { countries } from 'country-data';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { ThreadService } from "../../../services/thread/thread.service";
import { BaseService } from 'src/app/modules/base/base.service';
import { Subscription } from "rxjs";
import { PlatformLocation } from "@angular/common";
import { ImageCropperComponent } from '../../../components/common/image-cropper/image-cropper.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { RenamePopupComponent } from 'src/app/modules/shared/rename-popup/rename-popup.component';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { AddShopPopupComponent } from 'src/app/modules/shop/shop/add-shop/add-shop.component';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-headquarters-list',
  templateUrl: './headquarters-list.component.html',
  styleUrls: ['./headquarters-list.component.scss'],
  providers: [MessageService]
})
export class HeadquartersListComponent implements OnInit {
  @Output() headquartersComponentRef: EventEmitter<HeadquartersListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<HeadquartersListComponent> = new EventEmitter();
  @Output() onShopSelect = new EventEmitter();
  @Output() emptyCheck = new EventEmitter();

  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};  
  public bodyClass: string = "parts-list";
  public bodyClass1: string = "submit-loader";
  public bodyClass2: string = "profile";
  public bodyClass3: string = "image-cropper";
  public bodyClass4: string = "system-settings";
  public redirectionPage = '';
  public pageTitleText = '';
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public roleId;
  public countryId;
  public shopListColumns: any = [];
  public wfListColumns: any = [];
  public contentType: any = 51;

  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;

  public bodyElem;
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
  public apiData: Object;

  public displayNoRecordsShow = 0;
  public itemEmpty;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public loading: boolean = true;
  public lazyLoading: boolean = false;

  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public createAccess: boolean = true;

  countryDropdownData: any;
  stateDropdownData: any;
  companyStateDropdownData: any[];

  serviceShopForm: FormGroup;
  serviceContactForm: FormGroup;
  public phoneNumberData: any;
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phonenoInputFlag: boolean = true;
  public phoneNumberValid: boolean = false;
  public invalidNumber: boolean = true;
  public emailValidationError: boolean = false;
  public emailValidationErrorMsg = "";
  submitClicked = false
  public serviceShopSubmit: boolean = false;
  public serviceContactSubmit: boolean = false;
  formProcessing: boolean = false;
  public actionForm = '';
  public actionTitle = '';
  public actionFlag: boolean = false;
  public existErrorFlag = true;
  public existErrorMsg: string = '';
  public headTitle: string = 'Headquarters';
  public servicefacilityflagYes: boolean = true;
  public servicefacilityflagNo: boolean = false;
  public trainingCenterflagYes: boolean = false;
  public trainingCenterflagNo: boolean = true;

  public fieldName: string = '';

  public detailLinkFlag: boolean = false;
  public regionDetailLinkFlag: boolean = false;
  public zoneDetailLinkFlag: boolean = false;
  public territoriesdetailLinkFlag: boolean = false;
  public shopDetailLinkFlag: boolean = true;
  public toolsDetailLinkFlag: boolean = false;
  public usersDetailLinkFlag: boolean = true;

  public uploadDefaultImg: any = "assets/images/hq/upload-hq-default.png";
  public showImg: string = '';
  public locationDefaultImg = "assets/images/hq/hq-location-thumb-icon.png";
  public responceImg: string = '';
  public responceExistImg: string = '';
  public responceImgFlagNew: string = '0';
  public responceImgFlag: boolean = false;
  public featuredActionName: string = '';
  public addUserVisible: boolean = false;

  public headquartersFlag: boolean = false;
  public attributeFlag: boolean = false;
  public headquaterData: any = [];
  public attributeData: any = [];
  public headquaterlist:any = [];
  public locationAddType: string = '';
  public cbox1: boolean = false;
  public cbox2: boolean = false;
  public locationId: string = '';
  public dekraNetworkId: string = '';
  public dekraNetworkHqId: string = '';
  public userData: any = '';
  public googleMapUrl: string = "https://www.google.com/maps/embed/v1"
  public googleApiKey: string = 'AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
  public selecetedLevelOneId: string = '0';
  public selecetedLevelOneIdInt: number = 0;
  public selectedLevelOneOptions: any = [];
  public selecetedLevelTwoId: string = '0';
  public selecetedLevelTwoIdInt: number = 0;
  public selectedLevelTwoOptions: any = [];
  public levelAddressFlag: boolean = true;
  public parentId: string = '';
  public childId: string = '';
  public type = "";
  shopList:any = [];
  level:string="";
  subLevel:string = "";
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  summaryData: any = [];
  hqDetails: any;
  attribute: any;
  subAttribute: any;

  public shopsCountAll: number = 0;
  public usersCountAll: number = 0;
  public toolsCountAll: number = 0;
  public toolsCountLevel: number = 0;
  public shopsCountLevel: number = 0;

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private baseSerivce: BaseService,
    private threadApi: ThreadService,
    private location: PlatformLocation,
    public sanitizer: DomSanitizer,
    public headQuarterService: HeadquarterService,
    private messageService: MessageService
  ) {
    this.location.onPopState(() => {
      //alert(1333);
      /*let fromhqpage = localStorage.getItem("fromhqpage");
       if(fromhqpage == '1'){
         alert(2);
         this.serviceAction('new', 'headquarter');
         setTimeout(() => {
           localStorage.removeItem("fromhqpage");
         }, 100);
       }*/
    });
    // this.getHqNetwork();
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.level =  event.url.split('/')[3];
        this.subLevel =  event.url.split('/')[4];     
      }
    })
  }

  get shf() { return this.serviceShopForm.controls; }
  get scf() { return this.serviceContactForm.controls; }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass4);
    window.addEventListener('scroll', this.scroll, true);
    this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';
    this.loadCountryStateData(); 
    this.getShopList();
  }

  levelList(type='',cleartype=''){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);

    if(type == 'level1list'){
      apiFormData.append("attributeType", '1');
      apiFormData.append("levelOneId", "0");
      apiFormData.append("levelTwoId", "0");
      apiFormData.append("levelThreeId", "0");
    }
    if(type == 'level2list'){
      apiFormData.append("attributeType", '2');
      apiFormData.append("levelOneId", this.selecetedLevelOneId);
      apiFormData.append("levelTwoId", "0");
      apiFormData.append("levelThreeId", "0");
    }
    this.headQuarterService.getattributeslist(apiFormData).subscribe((response:any) => {  
      if(!!response){
        let resultData = response.items;
        if(type == 'level1list'){
          this.selectedLevelOneOptions= [];
          for (let ws of resultData) {
            this.selectedLevelOneOptions.push({
              id: ws.id,
              name: ws.name,
            });
          }  
        } 
        if(type == 'level2list'){
          if(cleartype == 'refresh'){
          this.serviceShopForm.get('selecetedLevelTwo').reset();
          this.selecetedLevelTwoId = '0';
          this.selecetedLevelTwoIdInt = 0;}
          this.selectedLevelTwoOptions= [];
          for (let ws of resultData) {
            this.selectedLevelTwoOptions.push({
              id: ws.id,
              name: ws.name,
            });
          }  
        }        
      }
      console.log(this.selectedLevelOneOptions);
      console.log(this.selectedLevelTwoOptions);
  });
     
  }

  onToggleBoxChange(val){
    console.log(val);
    this.levelAddressFlag = val;
    this.createForm('serviceLevel', '');
  }

  levelChanged(type,event){

    console.log(event.value);
    if(type == 'change1'){     
      this.selecetedLevelOneIdInt = event.value;
      this.selecetedLevelOneId = this.selecetedLevelOneIdInt.toString();
      console.log(this.selecetedLevelOneId);
      console.log(this.selecetedLevelOneIdInt);
      if(this.actionForm == 'level3'){
        this.levelList('level2list','refresh');
      }
    }
    if(type == 'change2'){      
      this.selecetedLevelTwoIdInt = event.value;
      this.selecetedLevelTwoId = this.selecetedLevelTwoIdInt.toString();
      console.log(this.selecetedLevelTwoId);
      console.log(this.selecetedLevelTwoIdInt);
    }

  }

  // Create New Options
  serviceAction(action, field, item: any = '', titlename='') {   
    console.log(field,item);
    this.submitClicked = false;
    this.formProcessing = false;
    this.phoneNumberValid = false;
    let formTimeout = (action == 'new') ? 0 : 500;
    switch (field) {
      case 'headquarter':
      case 'level1':
      case 'level2':
      case 'level3':
      case 'level':     
        if (field == 'level2') {          
          this.levelList('level1list');
        }
        else if (field == 'level3') {          
          this.levelList('level1list');
        }
        else if (field == 'level') {
          switch (this.level) {
            case '1':
              field = 'level1';  
            break
            case '2':
              field = 'level2';
              this.levelList('level1list');
            break
            case '3':
              field = 'level3';
              this.selecetedLevelOneId = item.levelOneId;
              this.levelList('level1list');
              this.levelList('level2list');
              break
            default:              
            break;
          }
        }
        this.fieldName = titlename;
        this.actionTitle = (action == 'new') ? 'New ' + this.fieldName : 'Edit ' + this.fieldName;
        let sitem = (action == 'new') ? '' : item;
        if (field == 'headquarter') { 
          this.levelAddressFlag = true;
          this.createForm('serviceHQ', sitem);
        }
        else{
          if(sitem == ''){            
            this.levelAddressFlag = false;
          }
          else{
            this.levelAddressFlag = item.addressFlag == 1 ? true: false;
          }   
          this.actionForm = field;
          this.createForm('serviceLevel', sitem);
        }    
        setTimeout(() => {
          this.actionFlag = true;
          this.actionForm = field;
        }, formTimeout);
        break;
    }
  }

  createForm(action, item: any = '') {
    console.log(action,item,this.actionForm)
    let selecetedLevelOne: any = '';
    let selecetedLevelTwo: any = '';
    let dataId, dataName, cbox1, cbox2, addressLine1, addressLine2, city, state, zip, scountryName, scountryCode, sdialCode, cphone, cemail;
    this.emptyPhoneData();    
    switch (action) {
      case 'serviceHQ':
        if (item == '') {
          this.showImg = this.uploadDefaultImg;
          this.responceImg = '';
          this.responceImgFlag = false;
          this.responceImgFlagNew = '0';
        }
        else {
          this.showImg = item.dataImgFlag ? item.dataImg : this.uploadDefaultImg;
          this.responceImg = item.dataImgFlag ? item.dataImg : this.uploadDefaultImg;
          this.responceImgFlag = item.dataImgFlag;
          this.responceImgFlagNew = '0';
          this.responceExistImg = item.logoImageName;
        }
        let locationAddType = '';
        if (this.headquaterData.length == 0) {
          if (item == '') {
            locationAddType = '1';
          }
          else {
            locationAddType = item.locationAddType;
          }
        }
        else {
          if (item == '') {
            locationAddType = '2';
          }
          else {
            locationAddType = item.locationAddType;
          }
        }        
        this.locationAddType = locationAddType;
        dataId = (item == '') ? 0 : item.dataId;
        dataName = (item == '') ? '' : item.dataName;
        cbox1 = (item == '') ? false : item.cbox1;
        cbox2 = (item == '') ? false : item.cbox2;
        addressLine1 = (item == '') ? '' : item.addressLine1;
        addressLine2 = (item == '') ? '' : item.addressLine2;
        city = (item == '') ? '' : item.city;
        state = (item == '') ? '' : item.state;
        zip = (item == '') ? '' : item.zip;
        scountryName = (item == '') ? '' : item.countryName;
        scountryCode = (item == '') ? '' : item.countryCode;
        sdialCode = (item == '') ? '' : item.dialCode;
        cphone = (item == '') ? '' : item.phone;
        cemail = (item == '') ? '' : item.email;
        this.icountryName = (item = '' || scountryName) ? this.icountryName : scountryName;
        this.icountryCode = (item = '' || scountryCode == null) ? this.icountryCode : scountryCode;
        this.idialCode = (item = '' || sdialCode == '') ? this.idialCode : sdialCode;
        this.iphoneNumber = (item = '' || cphone == null) ? this.iphoneNumber : cphone;
        this.phoneNumberData = {
          countryCode: this.icountryCode,
          phoneNumber: this.iphoneNumber,
          country: this.icountryName,
          dialCode: this.idialCode,
          access: 'phone'
        }

        this.cbox1 = cbox1;
        this.cbox2 = cbox2;

        this.serviceShopForm = this.formBuilder.group({
          dataId: [dataId],
          dataName: [dataName, [Validators.required]],
          locationAddType: [locationAddType, [Validators.required]],
          cbox1: [cbox1],
          cbox2: [cbox2],
          addressLine1: [addressLine1, [Validators.required]],
          addressLine2: [addressLine2],
          city: [city, [Validators.required]],
          state: [state, [Validators.required]],
          zip: [zip, [Validators.required]],
          countryName: [scountryName],
          countryCode: [scountryCode],
          dialCode: [sdialCode],
          phone: [cphone],
          email: [cemail, [Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        });              
      break;      
      case 'serviceLevel':
        if (item == '') {
          this.selecetedLevelOneId = '0';
          this.selecetedLevelTwoId = '0';
          this.selecetedLevelOneIdInt = 0;
          this.selecetedLevelTwoIdInt = 0;
          this.showImg = this.uploadDefaultImg;
          this.responceImg = '';
          this.responceImgFlag = false;
          this.responceImgFlagNew = '0';
          if(this.actionForm == 'level2' || this.actionForm == 'level3'){
            dataName = this.serviceShopForm != undefined ? this.serviceShopForm.value.dataName : '';      
            if(this.actionForm == 'level2' || this.actionForm == 'level3'){
              selecetedLevelOne = this.serviceShopForm != undefined ? this.serviceShopForm.value.selecetedLevelOne : '';
            }
            if(this.actionForm == 'level3'){
              selecetedLevelTwo = this.serviceShopForm != undefined ? this.serviceShopForm.value.selecetedLevelTwo : '';
            }
          }
          else{
            dataName = this.serviceShopForm != undefined ? this.serviceShopForm.value.dataName : ''; 
          }
        }
        else {
          this.showImg = item.dataImgFlag ? item.dataImg : this.uploadDefaultImg;
          this.responceImg = item.dataImgFlag ? item.dataImg : this.uploadDefaultImg;
          this.responceImgFlag = item.dataImgFlag;
          this.responceImgFlagNew = '0';
          this.responceExistImg = item.logoImageName;
          dataName = this.serviceShopForm != undefined ? this.serviceShopForm.value.dataName : item.dataName; 
          if(this.actionForm == 'level2' || this.actionForm == 'level3'){ 
            if(this.actionForm == 'level2' || this.actionForm == 'level3'){
              this.selecetedLevelOneIdInt = parseInt(item.levelOneId);
              this.selecetedLevelOneId = item.levelOneId.toString();             
              selecetedLevelOne = parseInt(item.levelOneId);
            }
            if(this.actionForm == 'level3'){              
              this.selecetedLevelTwoIdInt =  parseInt(item.levelTwoId)
              this.selecetedLevelTwoId =  item.levelTwoId.toString();
              selecetedLevelTwo = parseInt(item.levelTwoId);
            }
          }
        }        
        dataId = (item == '') ? 0 : item.dataId;
        dataName = (item == '') ? dataName : item.dataName;   
        addressLine1 = (item == '') ? '' : item.addressLine1;
        addressLine2 = (item == '') ? '' : item.addressLine2;
        city = (item == '') ? '' : item.city;
        state = (item == '') ? '' : item.state;
        zip = (item == '') ? '' : item.zip;
        scountryName = (item == '') ? '' : item.countryName;
        scountryCode = (item == '') ? '' : item.countryCode;
        sdialCode = (item == '') ? '' : item.dialCode;
        cphone = (item == '') ? '' : item.phone;
        cemail = (item == '') ? '' : item.email;
        this.icountryName = (item = '' || scountryName) ? this.icountryName : scountryName;
        this.icountryCode = (item = '' || scountryCode == null) ? this.icountryCode : scountryCode;
        this.idialCode = (item = '' || sdialCode == '') ? this.idialCode : sdialCode;
        this.iphoneNumber = (item = '' || cphone == null) ? this.iphoneNumber : cphone;
        this.phoneNumberData = {
          countryCode: this.icountryCode,
          phoneNumber: this.iphoneNumber,
          country: this.icountryName,
          dialCode: this.idialCode,
          access: 'phone'
        } 
        if(this.levelAddressFlag){          
          switch(this.actionForm){
            case 'level3':
              this.serviceShopForm = this.formBuilder.group({
                dataId: [dataId],
                dataName: [dataName, [Validators.required]],
                levelAddressFlag: [this.levelAddressFlag],
                selecetedLevelOne: [selecetedLevelOne, [Validators.required]],
                selecetedLevelTwo: [selecetedLevelTwo, [Validators.required]],
                addressLine1: [addressLine1, [Validators.required]],
                addressLine2: [addressLine2],
                city: [city, [Validators.required]],
                state: [state, [Validators.required]],
                zip: [zip, [Validators.required]],
                countryName: [scountryName],
                countryCode: [scountryCode],
                dialCode: [sdialCode],
                phone: [cphone],
                email: [cemail, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
              });
            break;
            case 'level2':
              this.serviceShopForm = this.formBuilder.group({
                dataId: [dataId],
                dataName: [dataName, [Validators.required]],
                levelAddressFlag: [this.levelAddressFlag],
                selecetedLevelOne: [selecetedLevelOne, [Validators.required]],
                addressLine1: [addressLine1, [Validators.required]],
                addressLine2: [addressLine2],
                city: [city, [Validators.required]],
                state: [state, [Validators.required]],
                zip: [zip, [Validators.required]],
                countryName: [scountryName],
                countryCode: [scountryCode],
                dialCode: [sdialCode],
                phone: [cphone],
                email: [cemail, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
              });
            break;
            default:
              this.serviceShopForm = this.formBuilder.group({
                dataId: [dataId],
                dataName: [dataName, [Validators.required]],
                levelAddressFlag: [this.levelAddressFlag],
                addressLine1: [addressLine1, [Validators.required]],
                addressLine2: [addressLine2],
                city: [city, [Validators.required]],
                state: [state, [Validators.required]],
                zip: [zip, [Validators.required]],
                countryName: [scountryName],
                countryCode: [scountryCode],
                dialCode: [sdialCode],
                phone: [cphone],
                email: [cemail, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
              });
            break;
          }
        }
        else{
          switch(this.actionForm){
            case 'level3':
              this.serviceShopForm = this.formBuilder.group({
                dataId: [dataId],
                dataName: [dataName, [Validators.required]],
                levelAddressFlag: [this.levelAddressFlag],
                selecetedLevelOne: [selecetedLevelOne, [Validators.required]],
                selecetedLevelTwo: [selecetedLevelTwo, [Validators.required]],
              });
              break;
            case 'level2':
              this.serviceShopForm = this.formBuilder.group({
                dataId: [dataId],
                dataName: [dataName, [Validators.required]],
                levelAddressFlag: [this.levelAddressFlag],
                selecetedLevelOne: [selecetedLevelOne, [Validators.required]],
              });
              break;
            default:
              this.serviceShopForm = this.formBuilder.group({
                dataId: [dataId],
                dataName: [dataName, [Validators.required]],
                levelAddressFlag: [this.levelAddressFlag],
              });
              break;
          }
        }        
        console.log(this.levelAddressFlag, this.selectedLevelOneOptions, this.serviceShopForm,selecetedLevelOne,selecetedLevelTwo);
      break;
      case 'serviceContact':
        console.log(item)
        let contactId = (item == '') ? 0 : item.contactId;
        let firstName = (item == '') ? '' : item.firstName;
        let lastName = (item == '') ? '' : item.lastName;
        let email = (item == '') ? '' : item.email;
        let title = (item == '') ? '' : item.title;
        let businessRole = (item == '') ? '' : item.businessRole;
        let dept = (item == '') ? '' : item.dept;
        let locationId = this.locationId;
        let managername = (item == '') ? '' : item.managername;
        let userRefId = (item == '') ? '' : item.userRefId;
        let countryName = (item == '') ? '' : item.countryName;
        let countryCode = (item == '') ? '' : item.countryCode;
        let dialCode = (item == '') ? '' : item.dialCode;
        let phone = (item == '') ? '' : item.phone;
        this.icountryCode = (item = '') ? this.icountryCode : countryCode;
        this.iphoneNumber = (item = '' || phone == null) ? this.iphoneNumber : phone;
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
          contactId: [contactId],
          firstName: [firstName, [Validators.required]],
          lastName: [lastName, [Validators.required]],
          email: [email, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          title: [title],
          businessRole: [businessRole],
          dept: [dept],
          userRefId: [userRefId],
          locationId: [locationId],
          managername: [managername],
          countryName: [countryName],
          countryCode: [countryCode],
          dialCode: [dialCode],
          phone: [phone],
        });
        break;
    }
  }

  stageChanged(item) {
    console.log(item)
    let itemVal = item.value;
    console.log(itemVal)
  }
  navigateToShops(arg: string) {
    this.onShopSelect.emit(arg);
  }

  // check email validation
  checkEmailValition() {
    console.log(456)
    let emailVal = '';
    var emailError;
    emailVal = this.serviceShopForm.value.email.trim();
    emailError = this.serviceShopForm.controls.email.errors;
    console.log(emailVal)
    if (emailVal.length > 0) {
      this.emailValidationError = false;
      this.emailValidationErrorMsg = "";
      if (emailError) {
        this.emailValidationError = true;
        this.emailValidationErrorMsg = "Invalid Email";
      }
    }
  }

  // Form Cancel
  formCancel() {
    this.actionFlag = false;
    this.submitClicked = false;
    this.responceImg = '';
    this.responceImgFlag = false;
    switch (this.actionForm) {
      case 'contact':
        this.emptyPhoneData();
        this.serviceContactSubmit = false;
        this.serviceContactForm.reset();
        break;
      case 'headquarter':
      case 'level1':
      case 'level2':
      case 'level3':
        this.existErrorFlag = false;
        this.existErrorMsg = '';
        this.serviceShopSubmit = false;
        this.levelAddressFlag = false;
        this.selecetedLevelOneId = '0';
        this.selecetedLevelTwoId = '0';
        this.selecetedLevelOneIdInt = 0;
        this.selecetedLevelTwoIdInt = 0;
        this.serviceShopForm.reset();
        break;
    }
  }

  // Form Submit
  formSubmit() {
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      action: 'new',
    };
    console.log(this.actionForm);
    let shopObj;
    switch (this.actionForm) {
      case 'headquarter':
        this.existErrorFlag = false;
        this.serviceShopSubmit = true;
        for (const i in this.serviceShopForm.controls) {
          this.serviceShopForm.controls[i].markAsDirty();
          this.serviceShopForm.controls[i].updateValueAndValidity();
        }
        shopObj = this.serviceShopForm.value;
        this.phoneNumberValid = true;
        this.invalidNumber = shopObj.phone.length ? shopObj.phone.length > 9 ? false : true : false;
        console.log(this.iphoneNumber, this.phoneNumberValid, this.invalidNumber);
        if (this.serviceShopForm.valid && (!this.existErrorFlag && !this.invalidNumber) && (this.cbox1 || this.cbox2)) {
          this.formProcessing = true;
          let phoneNumber = (shopObj.countryCode == 'IN' && shopObj.phone.length > 10) ? shopObj.phone.substring(1) : shopObj.phone;
          let shopAction = (shopObj.dataId == 0) ? apiInfo.action : 'edit';
          apiInfo['dataAction'] = shopAction;
          apiInfo['dataId'] = shopObj.dataId;
          apiInfo['dataName'] = shopObj.dataName;
          apiInfo['locationAddType'] = shopObj.locationAddType;
          apiInfo['cbox1'] = shopObj.cbox1 ? 1 : 0;
          apiInfo['cbox2'] = shopObj.cbox2 ? 1 : 0;
          apiInfo['addressLine1'] = shopObj.addressLine1;
          apiInfo['addressLine2'] = shopObj.addressLine2;
          apiInfo['city'] = shopObj.city;
          apiInfo['state'] = shopObj.state;
          apiInfo['zip'] = shopObj.zip;
          apiInfo['countryName'] = shopObj.countryName;
          apiInfo['countryCode'] = shopObj.countryCode;
          apiInfo['dialCode'] = shopObj.dialCode;
          apiInfo['phone'] = phoneNumber;
          apiInfo['email'] = shopObj.email;
          console.log(shopObj);
          this.manageActionForm(apiInfo);
        } else {
          this.formProcessing = false;
        }
      break;
      case 'level1':
      case 'level2':
      case 'level3':
        this.existErrorFlag = false;
        let empty = '';
        this.serviceShopSubmit = true;
        for (const i in this.serviceShopForm.controls) {
          this.serviceShopForm.controls[i].markAsDirty();
          this.serviceShopForm.controls[i].updateValueAndValidity();
        }
        shopObj = this.serviceShopForm.value;
        console.log(shopObj);
                
        if(this.levelAddressFlag){
          this.phoneNumberValid = true;
          this.invalidNumber = shopObj.phone.length > 9 ? false : true;
        }     
        else{
          this.phoneNumberValid = false;
          this.invalidNumber = false;
        }
        console.log(this.serviceShopForm.valid,this.existErrorFlag, this.invalidNumber, this.levelAddressFlag);   
        if((this.serviceShopForm.valid && (!this.existErrorFlag && !this.invalidNumber) && this.levelAddressFlag)
            || (this.serviceShopForm.valid && (!this.existErrorFlag) && !this.levelAddressFlag) ) {
          console.log('success');
          this.formProcessing = true;
          let phoneNumber = '';
          if(this.levelAddressFlag){
            phoneNumber = (shopObj.countryCode == 'IN' && shopObj.phone.length > 10) ? shopObj.phone.substring(1) : shopObj.phone;
          }
          let shopAction = (shopObj.dataId == 0) ? apiInfo.action : 'edit';
          apiInfo['dataAction'] = shopAction;
          apiInfo['dataId'] = shopObj.dataId;
          apiInfo['dataName'] = shopObj.dataName;
          apiInfo['locationAddType'] = '1';
          apiInfo['addressLine1'] = this.levelAddressFlag ? shopObj.addressLine1 : empty ;
          apiInfo['addressLine2'] = this.levelAddressFlag ? shopObj.addressLine2 : empty ;
          apiInfo['city'] = this.levelAddressFlag ? shopObj.city : empty ;
          apiInfo['state'] = this.levelAddressFlag ? shopObj.state : empty ;
          apiInfo['zip'] = this.levelAddressFlag ? shopObj.zip : empty ;
          apiInfo['countryName'] = this.levelAddressFlag ? shopObj.countryName : empty ;
          apiInfo['countryCode'] = this.levelAddressFlag ? shopObj.countryCode : empty ;
          apiInfo['dialCode'] = this.levelAddressFlag ? shopObj.dialCode : empty ;
          apiInfo['phone'] = this.levelAddressFlag ? phoneNumber : empty ;
          apiInfo['email'] = this.levelAddressFlag ? shopObj.email : empty ;
          apiInfo['addressFlag'] = this.levelAddressFlag ?  "1" : 0;
          if(this.actionForm == 'level1'){
            apiInfo['selectedLevelOneId'] = this.headQuarterService.levelOneId;
            apiInfo['selectedLevelTwoId'] = "0";
            apiInfo['selectedLevelThreeId'] = "0";
          }
          if(this.actionForm == 'level2'){
            apiInfo['selectedLevelOneId'] = shopObj.selecetedLevelOne;
            apiInfo['selectedLevelTwoId'] = this.headQuarterService.levelTwoId;
            apiInfo['selectedLevelThreeId'] = "0";
          }
          if(this.actionForm == 'level3'){
            apiInfo['selectedLevelOneId'] = shopObj.selecetedLevelOne;
            apiInfo['selectedLevelTwoId'] = shopObj.selecetedLevelTwo;
            apiInfo['selectedLevelThreeId'] = this.headQuarterService.levelThreeId;
          }
          console.log(shopObj);
          this.saveLevelDataForm(apiInfo);
        } else {
          this.formProcessing = false;
        }
      break;
      case 'contact':
        this.existErrorFlag = false;
        this.serviceContactSubmit = true;
        for (const i in this.serviceContactForm.controls) {
          this.serviceContactForm.controls[i].markAsDirty();
          this.serviceContactForm.controls[i].updateValueAndValidity();
        }
        this.phoneNumberValid = true;
        this.invalidNumber = (!this.phoneNumberValid) ? false : true;
        console.log(this.iphoneNumber, this.phoneNumberValid, this.invalidNumber)
        let contactObj = this.serviceContactForm.value;
        if (this.serviceContactForm.valid && (!this.existErrorFlag || !this.invalidNumber)) {
          this.formProcessing = true;
          let phoneNumber = (contactObj.countryCode == 'IN' && contactObj.phone.length > 10) ? contactObj.phone.substring(1) : contactObj.phone;
          let shopAction = (contactObj.contactId == 0) ? apiInfo.action : 'edit';
          apiInfo['dataAction'] = shopAction;
          apiInfo['contactId'] = contactObj.contactId;
          apiInfo['firstName'] = contactObj.firstName;
          apiInfo['lastName'] = contactObj.lastName;
          apiInfo['countryCode'] = contactObj.countryCode;
          apiInfo['dialCode'] = contactObj.dialCode;
          apiInfo['phone'] = phoneNumber;
          apiInfo['email'] = contactObj.email;
          apiInfo['title'] = contactObj.title;
          apiInfo['businessRole'] = contactObj.businessRole;
          apiInfo['dept'] = contactObj.dept;
          apiInfo['userRefId'] = contactObj.userRefId;
          apiInfo['locationId'] = contactObj.locationId;
          apiInfo['managername'] = contactObj.managername;

          console.log(contactObj);
          this.manageActionForm(apiInfo);
        } else {
          this.formProcessing = false;
        }
        break;
    }
  }

  // Get Geo Code
  geocode(address): Promise<any> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(new Error(status));
          }
        }
      );
    });
  }


  // Manage HQ
  manageActionForm(apiData) {
    this.bodyElem.classList.add(this.bodyClass1);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );
    const apiFormData = new FormData();
    apiFormData.append("apiKey", apiData.apikey);
    apiFormData.append("domainId", apiData.domainId);
    apiFormData.append("platform", '3');
    apiFormData.append("userId", apiData.userId);
    apiFormData.append("networkId", this.dekraNetworkId);
    if (apiData.dataAction == 'edit') {
      apiFormData.append("id", apiData.dataId);
    }
    apiFormData.append("roleId", this.roleId);
    apiFormData.append("hqName", apiData.dataName);
    apiFormData.append("locationType", apiData.locationAddType);
    apiFormData.append("isOwner", apiData.cbox1);
    apiFormData.append("isFranchise", apiData.cbox2);
    apiFormData.append("address1", apiData.addressLine1);
    apiFormData.append("address2", apiData.addressLine2);
    apiFormData.append("city", apiData.city);
    apiFormData.append("state", apiData.state);
    apiFormData.append("zip", apiData.zip);
    apiFormData.append("emailAddress", apiData.email);
    apiFormData.append("phoneNo", apiData.phone);
    apiFormData.append("countryCode", apiData.countryCode);
    apiFormData.append("countryName", apiData.countryName);
    apiFormData.append("dialCode", apiData.dialCode);
    if (this.responceImgFlag && this.responceImgFlagNew == '1') {
      apiFormData.append("logoUrl", this.responceImg);
    }
    else if (this.responceImgFlag && this.responceImgFlagNew != '1') {
      apiFormData.append("logoUrl", this.responceExistImg);
    }
    else {
      apiFormData.append("logoUrl", '');
    }
    //new Response(apiFormData).text().then(console.log)
    //return false;
    this.headQuarterService.neworkUpdate(apiFormData).subscribe((response:any) => {
      this.headquartersComponentRef.emit(this)
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass1);

      console.log(response);
      this.formProcessing = false;
      let error = response.error;
      //let error = false;
      let type = '';
      if (!error) {
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        if (apiData.dataAction == 'new') {
          msgModalRef.componentInstance.successMessage = "New HQ added.";
        }
        else{
          msgModalRef.componentInstance.successMessage = "HQ details updated.";
        }

        //const serviceShop = response.data[0];
        switch (this.actionForm) {
          case 'headquarter':
            let hqIndex = 0;
            const serviceShop = apiData;
            serviceShop.address1 = serviceShop.addressLine1 != '' ? serviceShop.addressLine1 + ", " : "";
            serviceShop.address2 = serviceShop.addressLine2 != '' ? serviceShop.addressLine2 + ", " : "";
            serviceShop.showCity = serviceShop.city != '' ? serviceShop.city + ", " : "";
            serviceShop.showState = serviceShop.state != '' ? serviceShop.state + ", " : "";
            serviceShop.zip = serviceShop.zip != '' ? serviceShop.zip : "";
            serviceShop.address = serviceShop.address1 + serviceShop.address2 + serviceShop.showCity + serviceShop.showState + serviceShop.zip;
            serviceShop['dynamictext'] = "HQ";
            serviceShop['dataImg'] = this.responceImgFlag ? this.showImg : this.locationDefaultImg;
            serviceShop['dataImgFlag'] = this.responceImgFlag;
            serviceShop['logoImageName'] = this.responceExistImg;
            if (apiData.dataAction == 'new') {
              serviceShop.dataId = response.data.id;
              serviceShop['default'] = serviceShop.locationAddType;
              type = serviceShop.locationAddType == '1' ? 'primary' : 'sec';
              if (this.headquaterData.length == 0) {
                hqIndex = 0;
                this.itemEmpty = false;
                this.headQuarterService.networkEmpty = this.itemEmpty;
                this.headquartersFlag = true;
                serviceShop['users'] = [];
                this.headquaterData = [];
                this.headquaterData.push(serviceShop);
                setTimeout(() => {
                  this.setupMap(serviceShop, hqIndex)
                }, 1000);
              }
              else {
                hqIndex = this.headquaterData.length;
                serviceShop['users'] = [];
                /*for (let ss in this.headquaterData) {
                  if (serviceShop['default'] == '1') {
                    this.headquaterData[ss].locationAddType = '2';
                    this.headquaterData[ss].default = '2';
                  }
                }
                if (serviceShop['default'] == '1') {
                  this.headquaterData.unshift(serviceShop);
                }
                else {
                  this.headquaterData.push(serviceShop);
                }*/
                this.headquaterData.push(serviceShop);
                setTimeout(() => {
                  this.setupMap(serviceShop, hqIndex)
                }, 1000);
              }
            }
            else {
              hqIndex = this.headquaterData.findIndex(option => option.dataId == serviceShop.dataId);
              this.headquaterData[hqIndex].dataName = serviceShop.dataName;
              this.headquaterData[hqIndex].locationAddType = serviceShop.locationAddType;
              this.headquaterData[hqIndex].cbox1 = serviceShop.cbox1;
              this.headquaterData[hqIndex].cbox2 = serviceShop.cbox2;
              this.headquaterData[hqIndex].address = serviceShop.address;
              this.headquaterData[hqIndex].address1 = serviceShop.address1;
              this.headquaterData[hqIndex].addressLine1 = serviceShop.addressLine1;
              this.headquaterData[hqIndex].address2 = serviceShop.address2;
              this.headquaterData[hqIndex].addressLine2 = serviceShop.addressLine2;
              this.headquaterData[hqIndex].city = serviceShop.city;
              this.headquaterData[hqIndex].state = serviceShop.state;
              this.headquaterData[hqIndex].zip = serviceShop.zip;
              this.headquaterData[hqIndex].email = serviceShop.email;
              this.headquaterData[hqIndex].countryName = serviceShop.countryName;
              this.headquaterData[hqIndex].countryCode = serviceShop.countryCode;
              this.headquaterData[hqIndex].dialCode = serviceShop.dialCode;
              this.headquaterData[hqIndex].phone = serviceShop.phone;
              this.headquaterData[hqIndex].googleMapInfo = serviceShop.googleMapInfo;
              this.headquaterData[hqIndex].gmapcanvas = serviceShop.gmapcanvas;
              if (this.responceImgFlag) {
                this.headquaterData[hqIndex].dataImgFlag = true;
                this.headquaterData[hqIndex].dataImg = this.showImg;
                this.headquaterData[hqIndex].logoImageName = this.responceExistImg;
              }
              serviceShop['default'] = serviceShop.locationAddType;
              type = serviceShop.locationAddType == '1' ? 'primary' : 'sec';
              this.headquaterData[hqIndex].default = serviceShop['default'];
              setTimeout(() => {
                this.setupMap(serviceShop, hqIndex)
              }, 1000);
            }
            console.log(this.headquaterData);
            this.serviceShopForm.reset();
            this.serviceShopSubmit = false;
            this.responceImg = '';
            this.responceImgFlag = false;
          break;  
        }
        this.actionTitle = '';
        this.actionFlag = false;

        setTimeout(() => {
          msgModalRef.dismiss('Cross click');  
        }, 2000);

      } else {
        this.formProcessing = true;
        this.existErrorFlag = false;
        this.existErrorMsg = response.message;
        //this.existErrorMsg = "Error";
      }
    });
  }

  // Manage Level
  saveLevelDataForm(apiData) {

    this.bodyElem.classList.add(this.bodyClass1);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );

    let apiFormData = new FormData();
    apiFormData.append("apiKey", apiData.apikey);
    apiFormData.append("domainId", apiData.domainId);
    apiFormData.append("platform", '3');
    apiFormData.append("userId", apiData.userId);
    apiFormData.append("networkId", this.dekraNetworkId);
    if (apiData.dataAction == 'edit') {
      apiFormData.append("id", apiData.dataId);
    }
    apiFormData.append("roleId", this.roleId);
    apiFormData.append("name", apiData.dataName);
    apiFormData.append("locationType", "1");    
    apiFormData.append("address1", apiData.addressLine1);
    apiFormData.append("address2", apiData.addressLine2);
    apiFormData.append("city", apiData.city);
    apiFormData.append("state", apiData.state);
    apiFormData.append("zip", apiData.zip);
    apiFormData.append("emailAddress", apiData.email);
    apiFormData.append("phoneNo", apiData.phone);
    apiFormData.append("countryCode", apiData.countryCode);
    apiFormData.append("countryName", apiData.countryName);
    apiFormData.append("dialCode", apiData.dialCode);
    if (this.responceImgFlag && this.responceImgFlagNew == '1') {
      apiFormData.append("logoUrl", this.responceImg);
    }
    else if (this.responceImgFlag && this.responceImgFlagNew != '1') {
      apiFormData.append("logoUrl", this.responceExistImg);
    }
    else {
      apiFormData.append("logoUrl", '');
    }
    apiFormData.append("addressFlag", apiData.addressFlag);
    
    if(this.actionForm == 'level1'){
      apiFormData.append("attributeType", "1");    
    }
    if(this.actionForm == 'level2'){
      apiFormData.append("attributeType", "2");   
    }
    if(this.actionForm == 'level3'){
      apiFormData.append("attributeType", "3");  
    }
    apiFormData.append("levelOneId", apiData.selectedLevelOneId);
    apiFormData.append("levelTwoId", apiData.selectedLevelTwoId);
    apiFormData.append("levelThreeId", apiData.selectedLevelThreeId);
    
   // this.formProcessing = false;
    //new Response(apiFormData).text().then(console.log)
   // return false;

    this.headQuarterService.saveLevel(apiFormData).subscribe((response:any) => {     
      console.log(response);
      
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass1);

      let error = response.error;
      //let error = false;
      let type = '';
      if (!error) {

        let l1textype = '';
        switch (this.actionForm){
          case 'level1':
            l1textype = "L1";
          break;
          case 'level2':
            l1textype = "L2";
          break;
          case 'level3': 
            l1textype = "L3";
          break;
        }

        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        if (apiData.dataAction == 'new') {
          msgModalRef.componentInstance.successMessage = `New ${l1textype} added.`;
        }
        else{
          msgModalRef.componentInstance.successMessage = `${l1textype} details updated.`;
        }

        //const serviceShop = response.data[0];
        switch (this.actionForm) {
          case 'level1':
          case 'level2':
          case 'level3':            
            if (apiData.dataAction == 'new') {
              this.formProcessing = false;
               this.getData(this.actionForm);
            }
            else {
              /*this.headQuarterService.sublevelName =  apiData.dataName;
              const serviceShop = apiData;
              let attrIndex = 0;
              this.attributeData[attrIndex].dataName = serviceShop.dataName;
              this.attributeData[attrIndex].locationAddType = serviceShop.locationAddType;
              this.attributeData[attrIndex].cbox1 = serviceShop.cbox1;
              this.attributeData[attrIndex].cbox2 = serviceShop.cbox2;
              this.attributeData[attrIndex].address = serviceShop.address;
              this.attributeData[attrIndex].address1 = serviceShop.address1;
              this.attributeData[attrIndex].addressLine1 = serviceShop.addressLine1;
              this.attributeData[attrIndex].address2 = serviceShop.address2;
              this.attributeData[attrIndex].addressLine2 = serviceShop.addressLine2;
              this.attributeData[attrIndex].city = serviceShop.city;
              this.attributeData[attrIndex].state = serviceShop.state;
              this.attributeData[attrIndex].zip = serviceShop.zip;
              this.attributeData[attrIndex].email = serviceShop.email;
              this.attributeData[attrIndex].countryName = serviceShop.countryName;
              this.attributeData[attrIndex].countryCode = serviceShop.countryCode;
              this.attributeData[attrIndex].dialCode = serviceShop.dialCode;
              this.attributeData[attrIndex].phone = serviceShop.phone;
              this.attributeData[attrIndex].googleMapInfo = serviceShop.googleMapInfo;
              this.attributeData[attrIndex].gmapcanvas = serviceShop.gmapcanvas;
              if (this.responceImgFlag) {
                this.attributeData[attrIndex].dataImgFlag = true;
                this.attributeData[attrIndex].dataImg = this.showImg;
                this.attributeData[attrIndex].logoImageName = this.responceExistImg;
              }
             
              setTimeout(() => {
                this.setupMap(serviceShop, attrIndex)
              }, 1000);*/
            
              console.log(this.attributeData);
              this.showLevelDetail();              
            }
            this.responceImg = '';
            this.responceImgFlag = false;
            this.existErrorFlag = false;
            this.existErrorMsg = '';
            this.serviceShopSubmit = false;
            this.levelAddressFlag = false;
            this.selecetedLevelOneId = '0';
            this.selecetedLevelTwoId = '0';
            this.selecetedLevelOneIdInt = 0;
            this.selecetedLevelTwoIdInt = 0;
            this.serviceShopForm.reset();            
            break;  
        }

        this.actionTitle = '';
        this.actionFlag = false;

        setTimeout(() => {
          msgModalRef.dismiss('Cross click');  
        }, 2000);

      } else {
        this.formProcessing = false;
        this.existErrorFlag = true;
        this.existErrorMsg = response.message;
      }
    });
  }

 

  setupMap(serviceShop, index) {
    //set map data
    if (serviceShop.address != '') {
      const address = serviceShop.address1 + serviceShop.address2 + ',' + serviceShop.city + ',' + serviceShop.state + ',' + serviceShop.zip;
      this.headquaterData[index]['gmapcanvas'] = "gmap_canvas_" + serviceShop.dataId;
      this.headquaterData[index]['googleMapInfo'] = '';
      this.headquaterData[index]['googleMapInfo'] = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
      this.headquaterData[index]['googleMapInfo'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.headquaterData[index]['googleMapInfo']);
    }
  }

  // Form Action
  formAction(action) {
    console.log(action);
    switch (action) {
      case 'submit':
        switch (this.actionForm) {
          case 'headquarter':
          case 'level1':
          case 'level2':
          case 'level3':
            this.submitClicked = true;
            this.formSubmit();
            break;
          default:
            break;
        }
        break;
      default:
        this.formProcessing = false;
        this.formCancel();
        break;
    }
  }

  // Form Action
  /*  formAction(action) {
     console.log(action);
     switch (action) {
       case 'submit':
         this.submitClicked = true;
         this.itemEmpty = false; 
         this.actionFlag = false;
         switch(this.actionForm){
           case 'headquarter':
             this.submitClicked = true;
             this.formSubmit();
           break;
           case 'region':
             this.detailLinkFlag = true;
             this.regionDetailLinkFlag = true;
           break;
           case 'zone':
             this.detailLinkFlag = true;
             this.zoneDetailLinkFlag = true;
           break;
           case 'territories':
             this.detailLinkFlag = true;
             this.territoriesdetailLinkFlag = true;
           break;
           default:
           break;
         }          
         break;
       default:
         this.formProcessing = false;
         this.formCancel();
         break;
     }
   } */

   viewLevelDetail(pid,pname,id,name) {   
    this.headQuarterService.levelName = pname;  
    this.headQuarterService.sublevelName = name;  
    setTimeout(() => { 
      this.router.navigate([`/headquarters/level-details/${pid}/${id}`]);     
    }, 100);   
  }
  emptyPhoneData() {
    this.icountryName = '';
    this.icountryCode = '';
    this.idialCode = '';
    this.iphoneNumber = '';
    this.phoneNumberData = {
      countryCode: this.icountryCode,
      phoneNumber: this.iphoneNumber,
      country: this.icountryName,
      dialCode: this.idialCode,
      access: 'phone'
    }
  }

  // country & phone number update
  getPhoneNumberData(newValue) {
    console.log(newValue)
    if (newValue != null) {
      if (newValue.phoneVal != null) {
        if (newValue.access == 'phone') {
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0;
          let placeHolderValue = newValue.placeholderVal;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;

          let currPhValueTrim = '';
          let currPhValueLen = 0;
          if (newValue.phoneVal['number'] != '') {
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
            currPhValueLen = currPhValueTrim.length;
          }

          if (newValue.phoneVal['number'].length > 0) {
            this.phonenoInputFlag = (newValue.phoneVal['number'].length > 0) ? true : false;
            this.invalidNumber = (newValue.errorVal) ? true : false;

            this.phoneNumberValid = true;
            this.emptyPhoneData();
            this.iphoneNumber = newValue.phoneVal.number;

            if ((currPhValueLen == placeHolderValueLen) || (currPhValueLen > 9)) {
              this.phoneNumberValid = false;

              let getCode = newValue.phoneVal.countryCode;
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;
            }
          }
          else {
            this.phonenoInputFlag = false;
            this.iphoneNumber = '';
          }
        }
      }
      else {
        this.phonenoInputFlag = false;
        this.invalidNumber = (newValue.errorVal) ? true : false;
        this.phoneNumberValid = true;
        this.emptyPhoneData();
      }
    }
    else {
      this.phonenoInputFlag = false;
      this.invalidNumber = (newValue.errorVal) ? true : false;
      this.phoneNumberValid = true;
      this.emptyPhoneData();
    }
    setTimeout(() => {
      switch (this.actionForm) {
        case 'contact':
          this.serviceContactForm.patchValue({
            countryName: this.icountryName,
            countryCode: this.icountryCode,
            dialCode: this.idialCode,
            phone: this.iphoneNumber
          });
          break;
        case 'headquarter':
        case 'level1':
        case 'level2':
        case 'level3':
          this.serviceShopForm.patchValue({
            countryName: this.icountryName,
            countryCode: this.icountryCode,
            dialCode: this.idialCode,
            phone: this.iphoneNumber
          });
          break;
      }

    }, 150);
  }

  showLevelDetail() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("attributeId", this.level);
    apiFormData.append("infoId", this.subLevel);  
    this.headQuarterService.getAttributeDetail(apiFormData).subscribe((response:any) => { 
      this.loading = false;
      this.lazyLoading = this.loading;
      if(!!response && !!response.items){  
        let resultData = [];            
        resultData=(response.items); 
        console.log(resultData);   
        this.shopsCountLevel = response.data.shopsCount;
        this.toolsCountLevel = 4; 
        this.setupData(resultData, 'level');                
        this.headquartersFlag = false;
        this.attributeFlag = false;
        setTimeout(() => {
          this.attributeFlag= true;
        }, 200);                  
        this.itemEmpty = false;         
      }  
      else{
        this.itemEmpty = true;
        this.headquaterData = [];
      }     
    });
  }

  
  getHqDetails(){ 
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
     this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
        if(response && response.data && response.data.attributesInfo.length > 0 ){
          let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
          this.headQuarterService.levelName = attribute.name; 
          if(attribute){
            let currentItem = attribute.items.find(e=>e.id == this.subLevel);
            this.headQuarterService.sublevelName = (currentItem) ? currentItem.name : '';
          }
        }
      })
  }

  getData(reftype='') {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {  
      if(reftype != ''){
        let index;
        switch(reftype){
          case 'level1':
            if(!!response && !!response.data && !!response.data.attributesInfo) {
              let attributesInfo1 = (response.data.attributesInfo[0]) ? (response.data.attributesInfo[0]) : '';
              index = this.headquaterlist.findIndex(option => option.id == this.headQuarterService.levelOneId);
              this.headquaterlist[index] = attributesInfo1;
            }
            break;
          case 'level2':
            if(!!response && !!response.data && !!response.data.attributesInfo) {
              let attributesInfo2 = (response.data.attributesInfo[1]) ? (response.data.attributesInfo[1]) : '';
              index = this.headquaterlist.findIndex(option => option.id == this.headQuarterService.levelTwoId);
              this.headquaterlist[index] = attributesInfo2;
            }
            break;
          case 'level3':
            if(!!response && !!response.data && !!response.data.attributesInfo) {
              let attributesInfo3 = (response.data.attributesInfo[2]) ? (response.data.attributesInfo[2]) : '';
              index = this.headquaterlist.findIndex(option => option.id == this.headQuarterService.levelThreeId);
              this.headquaterlist[index] = attributesInfo3;
            }
            break;
        }
      }
      else{
        this.loading = false;
        this.lazyLoading = this.loading;
        if(!!response && !!response.data){
          if(!!response.data.attributesInfo){
            this.headquaterlist = response.data.attributesInfo;
            let itemIndex11 = this.headquaterlist.findIndex(option => option.id == '1');
            this.headQuarterService.levelOneId = this.headquaterlist[itemIndex11].id;            
            this.headQuarterService.levelOneName = this.headquaterlist[itemIndex11].name;         
            let itemIndex12 = this.headquaterlist.findIndex(option => option.id == '2');
            this.headQuarterService.levelTwoId = this.headquaterlist[itemIndex12].id;                
            this.headQuarterService.levelTwoName = this.headquaterlist[itemIndex12].name; 
            let itemIndex13 = this.headquaterlist.findIndex(option => option.id == '3');
            this.headQuarterService.levelThreeId = this.headquaterlist[itemIndex13].id;                
            this.headQuarterService.levelThreeName = this.headquaterlist[itemIndex13].name;
          }
          
          if(!!response.data.hqInfo){            
            if(response.data.hqInfo.length==0){
              this.itemEmpty = true;
              this.headQuarterService.networkEmpty = this.itemEmpty;
              this.headquaterData = [];
            }
            else{
              let resultData = [];
              resultData = response.data.hqInfo;
              this.itemEmpty = false;
              this.headQuarterService.networkEmpty = this.itemEmpty;
              this.headquartersFlag = true;
              this.attributeFlag = false;
              this.headquaterData = [];
              this.setupData(resultData, 'HQ');
            }            
          }

          this.shopsCountAll = response.data.shopsCount;
          this.usersCountAll = response.data.usersCount;
          this.toolsCountAll = response.data.toolsCount;
        }
        else{
          this.itemEmpty = true;
          this.headQuarterService.networkEmpty = this.itemEmpty;
          this.headquaterData = [];
        }
      } 
      
      console.log(this.headquaterlist);  
      console.log(this.headquaterData);  
    });
  }

  setupData(items, type) {
    this.type = type;
      items.forEach(item => {
        if(type == 'HQ') {
          item.dynamictext = item.locationType == '1' ? 'Primary' : 'Secondary';;
        }
        else{
          const apiFormData = new FormData();
          apiFormData.append("apiKey", this.apiKey);
          apiFormData.append("domainId", this.domainId);
          apiFormData.append("userId", this.userId);
          apiFormData.append("platform", '3');
          apiFormData.append("networkId", this.dekraNetworkId);
          this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {  
            this.summaryData = response.data.attributesInfo;  
            this.getSummaryShopsList();  
          });
          if(this.level == '1'){
            item.dynamictext = item.levelOneParentName+" - "+item.name;
            item.titletext = item.levelOneParentName;
          }
          if(this.level == '2'){
            item.dynamictext = item.levelTwoParentName+" - "+item.name;
            item.titletext = item.levelTwoParentName;
          }
          if(this.level == '3'){
            item.dynamictext = item.levelThreeParentName+" - "+item.name;
            item.titletext = item.levelThreeParentName;
          }
          this.headQuarterService.sublevelName = item.name;
          
        }
        item.dataId = item.id;
        item.dataName = item.name;
        item.locationAddType = item.locationType.toString();
        item.isOwner =  item.isOwner != undefined ? item.isOwner.toString() : "";
        item.isFranchise = item.isFranchise != undefined ? item.isFranchise.toString() : "";
        item.default = item.locationAddType;
        item.cbox1 = item.isOwner == '0' ? false : true;
        item.cbox2 = item.isFranchise == '0' ? false : true;
        item.addressLine1 = item.address1 != '' ? item.address1 : "";
        item.addressLine2 = item.address2 != '' ? item.address2 : "";
        item.showAddress1 = item.address1 != '' ? item.address1 + ", " : "";
        item.showAddress2 = item.address2 != '' ? item.address2 + ", " : "";
        item.showCity = item.city != '' ? item.city + ", " : "";
        item.showState = item.state != '' ? item.state + ", " : "";
        item.zip = item.zip != '' ? item.zip : "";
        item.address = item.showAddress1 + item.showAddress2 + item.showCity + item.showState + item.zip;
        item.email = item.emailAddress;
        // user list
        if(type == 'HQ') {
          item.type = 'hq';
        }
        else{
          item.type = 'level';
        }
        item.phone = item.phoneNo != '' ? item.phoneNo : "";
        item.users = (item.usersList && item.usersList.length > 0) ? item.usersList : [];
        item.users.forEach(itemuser => {
          itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
          itemuser.email = itemuser.email;
          itemuser.phone = itemuser.phoneNo;
          itemuser.editAccess = true;
        });
        item.userInfoData = [];
        item.userInfoData.push({
          dataId: item.dataId,
          type: item.type,
          dynamictext: item.dynamictext,
          createAccess : true,
          users: item.users
        });
        item.userinfoFlag = true;  
        // user list
        item.dataImg = item.logoUrl && item.logoUrl != '' ? item.logoUrl : this.locationDefaultImg;
        item.dataImgFlag = item.logoImageName && item.logoImageName != '' ? true : false;
        item.logoImageName = item.logoImageName;
        this.responceImgFlag = item.dataImgFlag;
        this.responceExistImg = this.responceImgFlag ? item.logoImageName : "";
        //set map data
        const address = item.address1 + item.address2 + ',' + item.city + ',' + item.state + ',' + item.zip;
        item.gmapcanvas = "gmap_canvas_" + item.dataId;
        item.googleMapInfo = '';
        item.googleMapInfo = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
        item.googleMapInfo = this.sanitizer.bypassSecurityTrustResourceUrl(item.googleMapInfo);
        // list push
        if(type == 'HQ') {
          this.headquaterData.push(item);
        }
        else{
          if(this.attributeData && this.attributeData.length>0){
            this.attributeData[0] = (item);
            this.formProcessing = false; 
          }
          else{
            this.attributeData = [];
            this.attributeData.push(item);
          } 
        }
      });
      console.log(this.attributeData)
      console.log(this.headquaterData)
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropdownData = response.data.countryData;
        this.stateDropdownData = response.data.stateData;
        this.companyStateDropdownData = [];
        response.data?.countryData.forEach((country: any) => {
          let companyObject: any = {
            id: country.name,
            name: country.name,
            items: [],
          }
          response.data?.stateData?.forEach((state: any) => {
            let stateObject: any = {};
            if (state.country_id == country.id) {
              stateObject.id = state.name;
              stateObject.name = state.name;
              companyObject?.items.push(stateObject);
            }
          });
          this.companyStateDropdownData.push(companyObject);
        });
      }
      else {

      }
    }, (error: any) => {

    });

    console.log(this.companyStateDropdownData)
  }

  changeCheckbox(type, flag) {
    if (type == 'yes-r1') {
      this.servicefacilityflagYes = flag;
      this.servicefacilityflagNo = this.servicefacilityflagYes ? false : true;
    }
    if (type == 'no-r1') {
      this.servicefacilityflagNo = flag;
      this.servicefacilityflagYes = this.servicefacilityflagNo ? false : true;
    }
    if (type == 'yes-r2') {
      this.trainingCenterflagYes = flag;
      this.trainingCenterflagNo = this.trainingCenterflagYes ? false : true;
    }
    if (type == 'no-r2') {
      this.trainingCenterflagNo = flag;
      this.trainingCenterflagYes = this.trainingCenterflagNo ? false : true;
    }
  }
  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 30;
    //let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 55 : headerHeight + 55;
  }

  updateGrapic(type = '') {
    this.bodyElem.classList.add(this.bodyClass2);
    this.bodyElem.classList.add(this.bodyClass3);
    const modalRef = this.modalService.open(ImageCropperComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.id = '';
    modalRef.componentInstance.type = "Add";
    modalRef.componentInstance.profileType = this.actionForm == 'headquarter' ? "headquarter-image" : 'level-image';
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        this.bodyElem.classList.remove(this.bodyClass2);
        this.bodyElem.classList.remove(this.bodyClass3);
        modalRef.dismiss('Cross click');
        this.showImg = receivedService.show;
        this.responceImg = receivedService.response;
        this.responceImgFlag = true;
        this.responceImgFlagNew = '1';
        this.responceExistImg = this.responceImg;
      }
    });
  }

  openAddShopModal() {
    const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    modalRef.result.then(e=>{
      this.getShopList();
    })
  }

  openAddUser(hid: any = '') {
    this.addUserVisible = true;
  }
  onEventUpdate(event: any){
    console.log(event);
    let id= event.data.id;
    let actiontype= event.data.actiontype;
    let actionFormType = event.data.actionFormType;
    let item = event.data.item;
    let titletext = event.data.titletext;
    console.log(id, actiontype, actionFormType, item, titletext);
    let primaryLocaion = false;
    if(actionFormType == 'level'){
      if(this.level == '1'){
        actionFormType = 'level1';           
      }else if(this.level == '2'){            
        actionFormType = 'level2';
        this.levelList('level1list');
      }else{           
        actionFormType = 'level3';
      }
    } 
    else{
      let hqIndex = this.headquaterData.findIndex(option => option.dataId == id);
      primaryLocaion = this.headquaterData[hqIndex].locationAddType == '1' ? true : false;
      //let userTotal = this.headquaterData[hqIndex].users.length;
      //primeStateFlag = userTotal == 0 ? false : true;
    } 
   
    this.userData = {};
    this.userData = {
      parentId: id,
      actiontype: actiontype,
      actionFormType: actionFormType,
      item: item,
      titletext: titletext,
      primaryLocaion : primaryLocaion,
      formType: "",
      hideLocation:true
    }
    this.addUserVisible = true;
  }



  closeAddUser() {
    this.addUserVisible = false;
  }

  onDrawerDismiss(event: any) {
    this.addUserVisible = false;
    if(event.action == 'cancel') {
      this.addUserVisible = false;
    }
    else{    
      console.log(event.data[0]);
      const contactData = event.data[0];     
      // user list
      contactData.phone = contactData.phoneNo != '' ? contactData.phoneNo : "";      
      contactData.nameTitle = contactData.firstName +" "+ contactData.lastName;
      contactData.email = contactData.email;
      contactData.phone = contactData.phoneNo;

      contactData.editAccess = true;
      if(event.actionFormType == 'hq'){
        contactData.type = 'hq';
        if (event.dataAction == 'new') {
          this.usersCountAll = this.usersCountAll + 1;
          let itemIndex1 = this.headquaterData.findIndex(option => option.dataId == contactData.hqId );
          console.log(itemIndex1);
          let itemIndex2 = this.headquaterData[itemIndex1].userInfoData.findIndex(item => item.dataId == contactData.hqId);
          if(contactData.isPrimaryHq == '1'){
            for(let user2 in this.headquaterData[itemIndex1].userInfoData[itemIndex2].users){
              this.headquaterData[itemIndex1].userInfoData[itemIndex2].users[user2].isPrimaryHq = '0';
            }
          }
          console.log(itemIndex2);
          this.headquaterData[itemIndex1].userInfoData[itemIndex2].users.unshift(contactData);
          console.log(this.headquaterData[itemIndex1].userInfoData);
        }
        else{
          let itemIndex1 = this.headquaterData.findIndex(option => option.dataId == contactData.hqId );
          console.log(itemIndex1);
          let itemIndex2 = this.headquaterData[itemIndex1].userInfoData.findIndex(item => item.dataId == contactData.hqId);
          console.log(itemIndex2);
          if(contactData.isPrimaryHq == '1'){
            for(let user2 in this.headquaterData[itemIndex1].userInfoData[itemIndex2].users){
              console.log(this.headquaterData[itemIndex1].userInfoData[itemIndex2].users[user2].userId);
              this.headquaterData[itemIndex1].userInfoData[itemIndex2].users[user2].isPrimaryHq = '0';
            }
          }
          let itemIndex3 = this.headquaterData[itemIndex1].userInfoData[itemIndex2].users.findIndex(item => item.userId == contactData.userId);   
          console.log(itemIndex3);    
          this.headquaterData[itemIndex1].userInfoData[itemIndex2].users[itemIndex3] = contactData;
          console.log(this.headquaterData[itemIndex1].userInfoData[itemIndex2].users[itemIndex2]);
        }
      }
      else{
        contactData.type = 'level';
        let levelId;
        if(this.level == '1'){
          levelId = contactData.levelOneId;
        }
        if(this.level == '2'){
          levelId = contactData.levelTwoId;
        }
        if(this.level == '3'){
          levelId = contactData.levelThreeId;
        }
        
        if (event.dataAction == 'new') {
          let itemIndex1 = 0;
          console.log(itemIndex1);
          let itemIndex2 = this.attributeData[itemIndex1].userInfoData.findIndex(item => item.dataId == levelId);
          console.log(itemIndex2);
          this.attributeData[itemIndex1].userInfoData[itemIndex2].users.unshift(contactData);
          console.log(this.attributeData[itemIndex1].userInfoData);
          /*this.attributeData[itemIndex1].userinfoFlag = false;
          setTimeout(() => {
            this.attributeData[itemIndex1].userinfoFlag = true;
          }, 0);*/
        }
        else{
          let itemIndex1 = 0;
          console.log(itemIndex1);
          let itemIndex2 = this.attributeData[0].userInfoData.findIndex(item => item.dataId == levelId);
          console.log(itemIndex2);
          let itemIndex3 = this.attributeData[0].userInfoData[itemIndex2].users.findIndex(item => item.userId == contactData.userId);   
          console.log(itemIndex3);    
          this.attributeData[itemIndex1].userInfoData[itemIndex2].users[itemIndex3] = contactData;
          console.log(this.attributeData[0].userInfoData[itemIndex2].users[itemIndex2]);
          /*this.attributeData[0].userinfoFlag = false;
          setTimeout(() => {
            this.attributeData[0].userinfoFlag = true;
          }, 0);*/
        }
      }
      setTimeout(() => {
        this.addUserVisible = false;
      }, 100);
    }
  }

  scroll = (event: any): void => {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openRenamePopup(renameArg:string,id:number,name:string) {
   const modalRef =  this.modalService.open(RenamePopupComponent, { size: 'lg', centered: true });
   modalRef.componentInstance.nameValue = name;
   modalRef.componentInstance.title = name;
   modalRef.componentInstance?.emitService?.subscribe((emmitedValue) => {
    let body = new FormData();
    body.append("apiKey", this.apiKey);
    body.append("domainId", this.domainId);
    body.append("userId", this.userId);
    body.append("networkId", this.dekraNetworkId);
    body.append('attributeId', `${id}`);
    body.append('name', `${emmitedValue}`);
    this.headQuarterService.manageNetworkhqList(body).subscribe((res:any) => {
      if(!!res && res.status==='Success') {
        if(this.type == "level"){
          this.showLevelDetail()
        }else{
          this.getData();
        }
      }
    })
    // do sth with emmitedValue
});
  }
  
  // getHqNetwork() {
  //   let body = new FormData();
  //   body.append('apiKey', 'dG9wZml4MTIz');
  //   body.append('domainId', '3');
  //   body.append('platform', '3');
  //   body.append('userId', '3');
  //   body.append('networkId', '3');
  //   this.headQuarterService.getNetworkhqList(body).subscribe((res:any) => {
  //     if(!!res && !!res.data && !!res.data.attributesInfo) {
  //       this.headquaterlist = res.data.attributesInfo
  //     }
  //   })
  // }
  navigateTo(navigateArg:string){
    if(navigateArg==='level-shops'){
      if(this.shopsCountLevel > 0 ){
        this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shops`]);
      }
    }else if(navigateArg==='shops'){
      if(this.shopsCountAll > 0 ){
        this.router.navigate(['/headquarters/all-shops']);
      }
    }else if(navigateArg==='level-tools' ){
      if(this.toolsCountLevel > 0 ){
        this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/tools-equipment`]);
      }
    } else if(navigateArg==='tools'){
      if(this.toolsCountAll > 0 ){
        this.router.navigate(['/headquarters/all-tools']);
      }
    } else{
      if(this.usersCountAll > 0 ){
      this.router.navigate(['/headquarters/all-users']);
      }
    }
  }

  getShopList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);

    this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      this.shopList = response.items;
    })
  }

  getSummaryShopsList(){
    this.shopList = [];
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
     this.hqDetails = response.data;
     let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
     this.attribute = attribute;
     let subAttribute = attribute.items.find(e=>e.id == this.subLevel);
     this.subAttribute = subAttribute;

     if(!!response.data.attributesInfo){
      this.headquaterlist = response.data.attributesInfo;
      let itemIndex11 = this.headquaterlist.findIndex(option => option.id == '1');
      this.headQuarterService.levelOneId = this.headquaterlist[itemIndex11].id;            
      this.headQuarterService.levelOneName = this.headquaterlist[itemIndex11].name;         
      let itemIndex12 = this.headquaterlist.findIndex(option => option.id == '2');
      this.headQuarterService.levelTwoId = this.headquaterlist[itemIndex12].id;                
      this.headQuarterService.levelTwoName = this.headquaterlist[itemIndex12].name; 
      let itemIndex13 = this.headquaterlist.findIndex(option => option.id == '3');
      this.headQuarterService.levelThreeId = this.headquaterlist[itemIndex13].id;                
      this.headQuarterService.levelThreeName = this.headquaterlist[itemIndex13].name;
    }

    //  if(subAttribute && subAttribute.levelOneId && subAttribute.levelOneId !== 0){
    //    apiFormData.append("levelOneId", subAttribute.levelOneId);
    //  }
    //  if(subAttribute && subAttribute.levelTwoId && subAttribute.levelTwoId !== 0){
    //   apiFormData.append("levelTwoId", subAttribute.levelTwoId);
    // }
    // if(subAttribute && subAttribute.levelThreeId && subAttribute.levelThreeId !== 0){
    //   apiFormData.append("levelThreeId", subAttribute.levelThreeId);
    // }
  
    if(this.subAttribute && this.subAttribute.levelOneId !== 0){
      apiFormData.append("levelOneId", this.subAttribute.levelOneId);
    }
    if(this.subAttribute && this.subAttribute.levelTwoId !== 0){
     apiFormData.append("levelTwoId", this.subAttribute.levelTwoId);
   }
   if(this.subAttribute && this.subAttribute.levelThreeId !== 0){
     apiFormData.append("levelThreeId", this.subAttribute.levelThreeId);
   }
      this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
        this.shopList = response.items;
      })
    })
  }

  serviceActionDelete(id,title){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'NDelete';
    modalRef.componentInstance.title = "Delete "+title;
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        //this.deleteConfirm(id);
      }
    });    
  }
 /* deleteConfirm(id){
      this.bodyElem.classList.add(this.bodyClass2);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );
  
      let formData = new FormData();
      formData.append('apiKey', Constant.ApiKey);
      formData.append('domainId', this.domainId);
      formData.append('userId', this.userId);
      formData.append('workOrderId', id);
      this.repairOrderApi.deleteSupportTicketsList(formData).subscribe(response => {
        console.log(response);
        
        modalRef.dismiss("Cross click");
        this.bodyElem.classList.remove(this.bodyClass2);
  
        if (response.status == "Success") {
  
          this.successMsg = response.message;
  
            const msgModalRef = this.modalService.open(
              SuccessModalComponent,
              this.modalConfig
            );
            msgModalRef.componentInstance.successMessage = this.successMsg;
  
            let threadIndex = this.repairOrderList.findIndex(option => option.id == id);
            this.repairOrderList.splice(threadIndex, 1);
  
            setTimeout(() => {
              msgModalRef.dismiss("Cross click");
              this.successMsg = "";
            }, 2000);
        }
      });
  }*/

}
