import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { ThreadService } from 'src/app/services/thread/thread.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Constant, ContentTypeValues } from 'src/app/common/constant/constant';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";
import { LandingpageService } from '../../../../../services/landingpage/landingpage.service';

@Component({
  selector: 'app-signup-services',
  templateUrl: './signup-services.component.html',
  styleUrls: ['./signup-services.component.scss']
})
export class SignupServicesComponent implements OnInit, OnDestroy {
  @ViewChild('top', { static: false }) top: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public loading: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;
  public mobileBrowser: boolean = false;
  public headTitle: string = "Index";
  public showMobileMenu: boolean = false;
  public year = moment().year();
  public businessDomainData: any = [];
  public domainId: string = '';
  public bodyClass:string = "auth-index";
  public bodyElem;
  public signupModal: boolean = false;
  public headerLogo: string = '';
  public headerLogoIcon: string ='assets/images/login/ev-service-logo.png';
  public domainName: string = '';
  companyForm: FormGroup;
  companyFormSubmitted: boolean = false;
  public companyLoader: boolean = false;
  public readable:boolean = true;
  public cancelledItem:boolean = false;
  public businessDataModel: any;
  public midHeight: number = 35;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };


  cartForm: FormGroup;
  businessForm: FormGroup;

  cart: any = {
    cartId: '',
    email: '',
    phoneNumber: {
      countryCode: '',
      dialCode: '',
      e164Number: '',
      internationalNumber: '',
      phoneNumber: ''
    },
    totalAmount: 0,
    manualIds: [],
    trainingIds: []
  };
  removeCartItem: { itemId: any; itemType: string; };
  cancelledItemsList = [];
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  separateDialCode = true;
  showLoader = true;
  previousParticipantsPopup = false;
  filteredParticipants: any[];
  selectedTrainingIndex: any;
  participantSelectionPopupOff: any = [];
  countryDropdownData: any;
  stateDropdownData: any;
  companyStateDropdownData: any[];
  stateValue: any;
  companyUserStateValue:any;
  businessFormSubmitted: boolean = false;
  companyPurchaseStateValue: any;
  selectedCompanyAddressId: any;
  selectedAddress: any;
  showChangeAddress: boolean = false;
  companyAddressOptions: any = [];
  showAddressPopup: boolean;
  emptyCartPopup: boolean;
  multipleAddressAvailable: any = false;
  companyOptions: any;
  shippingInfo: FormGroup;
  alternatePricingForm: FormGroup;
  shippingFormSubmitted: boolean = false;
  cardholderFormSubmitted: boolean = false;
  shippingForm: FormGroup;
  public defaultShippingCost = '0';
  cartFormSubmitted: boolean = false;
  cardholderForm: FormGroup;
  paymentMethod = 'card';
  showPaymentFields = false;
  paymentCardResponse: any;
  checkNumber: any;
  bankName: any;
  countryValue: any;
  fieldsInitalized: boolean;
  loadingPaymentDetails = false;
  hidePaymentButton: boolean;
  paymentLoading: boolean = false;
  paymentMessage: any;
  successData: any;
  paymentFailurePopup: boolean;
  showSuccessPopup = false;
  displayPaymentPopup: boolean;
  taxResponse: any = null;
  updatingPhoneNumber: any;
  removeTrainingIndex: number = null;
  removeManualIndex: number = null;
  removeParticipantIndex: number = null;
  userForm: FormGroup;
  userFormSubmitted = false;
  slipMemo:any;
  textMessageData: any;
  updatingUserPayment: boolean = false;
  isInitalLoading: boolean = true;
  customValidator: boolean;
  checkedTrue: any;
  fromFeilds: any;
  displayPricingPopup: boolean = false;
  overRidePriceTrainingIndex: any;
  overRidePriceManualIndex: any;
  alternatePricing: any = false;
  freeOffer: any = false;
  payablePrice: any;
  birdPercentage: any;
  showBirdPriceValidation: boolean;
  showBirdPercentageValidation: boolean;
  birdValue: any;
  birdValueReason: any;
  pricingFormSubmitted: any = false;
  isTrainingManualOverride: boolean;
  overRideDetails: any;
  showCartUserPopup: boolean;
  businessFormPopup: boolean;
  businessData: any = [];
  public shopId: number;
  public shopName: string = '';
  cartFilled: any;
  searchAPI: any;
  businessLoader: boolean;
  businessValidation: any = {
    message:'',
    value:'',
    isValid:false
  }
  public continuePageFlag: boolean = false;
  public splittedDomainURL: string='';
  public splittedDomainURLLocal:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private threadApi: ThreadService,
    private fb: FormBuilder,
    private LandingpagewidgetsAPI: LandingpageService,
    private authenticationService: AuthenticationService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);

    let currentURL  = window.location.href; 
    let splittedURL1 = currentURL.split("://");   
    //splittedURL1[1] = "forum.collabtic.com";        
    let splittedURL2 = splittedURL1[1].split(".");        

    this.splittedDomainURL = splittedURL2[0];  
    this.splittedDomainURLLocal = this.splittedDomainURL.split(":");

    if(this.splittedDomainURL.length>0){      
      if(this.splittedDomainURL == Constant.forumLive || this.splittedDomainURL == Constant.forumStage || this.splittedDomainURL == Constant.forumDev || this.splittedDomainURL == Constant.forumDevCollabtic || this.splittedDomainURL ==Constant.forumDevCollabticStage || this.splittedDomainURL == Constant.forumDevCollabticSolr || this.splittedDomainURL == Constant.forumDevMahle || this.splittedDomainURL == Constant.forumDevDekra || this.splittedDomainURLLocal[0] == Constant.forumLocal ){     
        let domainId = this.getQueryParamFromMalformedURL2('domainId');
        if(domainId == '343'){         
          this.checkSubDomainName('fuser');
        }
        else if(domainId == '338'){         
          this.checkSubDomainName('diagnation');
        }
        else{
          this.checkSubDomainName('collabtic');
        }
      }
      else{              
        this.checkSubDomainName(this.splittedDomainURL);
      }
    }

    setTimeout(() => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        /* your code here */
        this.mobileBrowser = true;
      }
      else{
        this.mobileBrowser = false;
      }

    }, 100);

    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
   
    this.cartForm = this.fb.group({
      'trainings': this.fb.array([]),
      'manuals': this.fb.array([]),
      'grandTotalAmount': 0
    });
    this.companyForm = this.fb.group({
      //'phoneNumber': ['', Validators.required],
      'name': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': [''],
      'state': ['', Validators.required],
      'country': [''],
      'city': ['', Validators.required],
      'zip': ['', Validators.required],
      'addressType': 'NEW',
      'shopInfo':''
    });
    this.shippingForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'address1': ['', [Validators.required]],
      'address2': [''],
      'state': ['', [Validators.required]],
      'country': [''],
      'city': ['', [Validators.required]],
      'zip': ['', [Validators.required]],
      'sameAsCheck': [false],
    });
    this.cardholderForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'address1': ['', [Validators.required]],
      'address2': [''],
      'state': ['', [Validators.required]],
      'country': [''],
      'city': ['', [Validators.required]],
      'zip': ['', [Validators.required]],
      'sameAsCheck': [false],
    })
    this.userForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'sameAsCheck': [false],
    });
    this.alternatePricingForm = this.fb.group({
      'birdPrice': [''],
      'birdPercentage': [''],
      'birdValueReason': ['']
    });
    this.businessForm = this.fb.group({
      'phoneNumber': ['', Validators.required],
      'name': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': [''],
      'state': ['', Validators.required],
      'country': [''],
      'city': ['', Validators.required],
      'zip': ['', Validators.required],
    });

    

  }
  get compform() {
    return this.companyForm.controls;
  };

  get shippingInfoForm() {
    return this.shippingForm.controls;
  };

  get businessInfoForm() {
    return this.businessForm.controls;
  };

  get userFormControl(){
    return this.userForm.controls;
  }


  getQueryParamFromMalformedURL2(domainId) {
    const results = new RegExp('[\\?&]' + domainId + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }
  
 // validate domain name 
 checkSubDomainName(domainName){ 
    
 
  const subDomainData = new FormData();
  subDomainData.append('apiKey', Constant.ApiKey);
  subDomainData.append('domainName', domainName);

  this.authenticationService.validateSubDomain(subDomainData).subscribe((response) => {
    if(response.status == "Success") {
     
      let domainData = response.data[0];
      this.domainId = domainData.domainId;
      this.domainName = domainData.subDomain;
      this.headerLogo = domainData.businessLogo;

      if(this.domainId != '343'){
        this.headerLogoIcon = '';
      }
 
      localStorage.setItem('domainId', this.domainId);
      localStorage.setItem('domainName', this.domainName);

      setTimeout(() => {
        this.loading = false;
      }, 1000);

      this.getBusinessDetails('name','')
      this.loadCountryStateData();

    }
    else {
      this.loading = false; 
    }
  },
  (error => {
      this.loading = false; 
  })
  );    

}

  redirectionPage(url,type){
    switch(type){
      case 'website':
        url = "https://"+url;
        //window.location.replace(url);
        window.open(url, url);
      break;
      case 'home':
        //url = "https://"+url;
        //window.location.replace(url);
        window.location.reload();
      break;
      case 'login':
        let redirectUrl = "/auth/login";
        this.router.navigate([redirectUrl]);
      break;
    }
  }
   goToLink(section: any) {
    this.showMobileMenu = false;
    if(section == 'home'){
      let redirectUrl = "/auth/login";
      if(this.domainId == '71'){
        redirectUrl = "/login-type";
      }
      this.router.navigate([redirectUrl]);
    }
  }

  signupPOPUP(){
    this.signupModal = true;
    this.disableCompanyFields();
    this.companyFormSubmitted = false;
    this.companyLoader = false;
    this.companyForm.reset();    
  }
  openBusinessNew() {
    this.businessValidation = {
      message:'',
      value:'',
      isValid:false
    };
    this.businessFormSubmitted = false;
    this.businessFormPopup = true;
    this.businessLoader = false;
    this.businessForm.reset();
  }



  savePrevInfo(saveFrom: string, fromFeilds = false) {
    let user = this.userForm?.controls;
    let payment = this.cardholderForm?.controls;
    let ship = this.shippingForm?.controls;
    let company = this.companyForm?.controls;
   
    if (saveFrom == 'cardholderForm' && payment.sameAsCheck.value) {
      
        if (fromFeilds) {
          this.commonValueSetter(payment,ship);
            ['name','address1', 'address2', 'state', 'country', 'city', 'zip'].forEach(val => {
              payment[val].setValue(ship[val].value);
            })
          }
          else {
            this.commonValueSetter(ship,payment);
            ['name','address1', 'address2', 'state', 'country', 'city', 'zip'].forEach(val => {
              ship[val].setValue(payment[val].value);
            })
          }
      
    }

      if (saveFrom == 'shippingForm' && ship.sameAsCheck.value) {
        if (fromFeilds) {
          this.commonValueSetter(ship, user);
          ['name','address1', 'address2', 'state', 'country', 'city', 'zip'].forEach(val => {
            ship[val].setValue(company[val].value);
          })
        }
        else {
          this.commonValueSetter(user, ship);
          this.savePrevInfo('userForm');
        }
      }

      if (saveFrom == 'shippingForm' && payment.sameAsCheck.value ) {
        if (!fromFeilds) {
          this.commonValueSetter(payment,ship);
          ['name','address1', 'address2', 'state', 'country', 'city', 'zip'].forEach(val => {
            payment[val].setValue(ship[val].value);
          })
        }
    }

    

    if (this.cart.trainings.length > 0) {
      if (saveFrom == 'userForm' && ship.sameAsCheck.value) {
        this.commonValueSetter(ship, user);
      }
      if (saveFrom == 'userForm' && payment.sameAsCheck.value) {
        this.commonValueSetter(payment, user);
      }

    }

  }



  setAddressValueNullClicked() {
    this.showChangeAddress = true;
    this.setAddressValueNull();
  }

  getBusinessDetails(type = 'name', event) {
    const apiInfo = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: "1",
      contentTypeId: ContentTypeValues.default
    };
    this.LandingpagewidgetsAPI.shopListAPI(apiInfo).subscribe((response) => {
      this.businessData = response?.data;

      this.businessLoader = false;

    });
  }
  /*
  getBusinessDetails(type = 'name', event) {
    if (this.searchAPI) { this.searchAPI.unsubscribe(); }
    this.searchAPI = this.threadApi.apiGetBusinessData({
      'domainId': this.domainId || 1,
      'type': type,
      'value': event.filter || ''
    }).subscribe((res) => {
      if (this.companyForm?.value?.name) {
        this.businessData = [{ name: this.companyForm?.value?.name, phoneNumber: this.companyForm?.value?.phoneNumber }]
      }
      let filterData = res.data.marketPlaceUsers.filter((res) => res.phoneNumber && res.name && res.name != this.companyForm?.value?.name) ;

      if(res.data.marketPlaceUsers.length > 0){
        if (filterData.map(res => res.name).includes(this.companyForm?.value?.name)) {
          this.businessData = filterData;
        } else {
          this.businessData = [...this.businessData, ...filterData];
        }
      } 
      this.businessLoader = false;
    });
  }*/

  setAddressValueNull() {
    this.showAddressPopup = false;
    this.selectedAddress = null;
    this.companyForm.controls['address1'].enable();
    this.companyForm.controls['address2'].enable();
    this.companyForm.controls['city'].enable();
    this.companyForm.controls['state'].enable();
    this.companyForm.controls['country'].enable();
    this.companyForm.controls['zip'].enable();
    this.companyUserStateValue = null;
    this.selectedCompanyAddressId = null;
    this.companyForm.patchValue({
      'address1': '',
      'address2': '',
      'city': '',
      'state': '',
      'country': '',
      'zip': '',
      'addressType': 'NEW',
    });
  }

  commonValueSetter(to,from) {
    to.firstName.setValue(from.firstName.value);
    to.lastName.setValue(from.lastName.value);
    to.email.setValue(from.email.value);
    to.phoneNumber.setValue(from.phoneNumber.value);
  }

  checkBusinessValidation() {
    if (this.businessValidation?.value != this.businessForm.value.name) {
      this.businessValidation.isValid = false;
    } else {
      this.businessValidation.isValid = true;
    }
  }

  cleanNullValue(obj) {
    for (let propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
    return obj
  }

  disableCompanyFields(){
    this.companyForm.controls['address1'].disable();
    this.companyForm.controls['address2'].disable();
    this.companyForm.controls['city'].disable();
    this.companyForm.controls['state'].disable();
    this.companyForm.controls['country'].disable();
    this.companyForm.controls['zip'].disable();
  }

  enableCompanyFields(){
    this.companyForm.controls['address1'].enable();
    this.companyForm.controls['address2'].enable();
    this.companyForm.controls['city'].enable();
    this.companyForm.controls['state'].enable();
    this.companyForm.controls['country'].enable();
    this.companyForm.controls['zip'].enable();
  }
  setAddressValue() {
    this.showChangeAddress = false;
    let address = this.companyAddressOptions[this.selectedAddress];
    this.companyForm.patchValue({
      'address1': address?.address_1,
      'address2': address?.address_2,
      'city': address?.city,
      'state': address?.state,
      'country': address?.country,
      'zip': address?.zip,
      'addressType': 'OLD',
    });
    this.disableCompanyFields();
    this.companyUserStateValue = address?.state;
    this.selectedCompanyAddressId = address?.id;
    this.showAddressPopup = false;
  }

  convertAddressString(address: any) {
    let newAddressObject: any = {
      address_1: address?.address_1,
      address_2: address?.address_2,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      zip: address?.zip
    }
    let newAddress = this.cleanNullValue(newAddressObject);
    return Object.keys(newAddress).map(function(k){return newAddress[k]}).join(", ");
  }

  loadAddressData(value = this.companyForm.value.name, selectedId = null) {
    if (value) {
      let body: any = {
        domainId: this.domainId,
        companyId: this.shopId,
      }

      const apiInfo = {
        apikey: Constant.ApiKey,        
        domainId: this.domainId,
        userId: '1',
        shopId: this.shopId
      };

      this.selectedAddress = null;
      this.companyForm.controls['address1'].enable();
      this.companyForm.controls['address2'].enable();
      this.companyForm.controls['city'].enable();
      this.companyForm.controls['state'].enable();
      this.companyForm.controls['country'].enable();
      this.companyForm.controls['zip'].enable();
      this.companyUserStateValue = null;
      this.companyPurchaseStateValue = null;
      this.selectedCompanyAddressId = null;
      this.companyForm.patchValue({
        'address1': '',
        'address2': '',
        'city': '',
        'state': '',
        'country': '',
        'zip': '',
        'addressType': 'NEW',
      });
      this.LandingpagewidgetsAPI.serviceContactListAPI(apiInfo).subscribe((response: any) => {
        this.showChangeAddress = false;
        if (response.status == 'Success') {
          this.companyAddressOptions = response?.data?.companyAddressData;
          if (this.companyAddressOptions?.length > 0) {
            if (this.companyAddressOptions.length == 1) {
              this.selectedAddress = 0;
              this.setAddressValue();
            } else {
              if (selectedId) {
                this.selectedAddress = this.companyAddressOptions.findIndex(x => x.id == selectedId);
                this.selectedAddress = this.selectedAddress == -1 ? 0 : this.selectedAddress;
                this.setAddressValue();
              }
              else { this.showAddressPopup = true; }
            }
            this.multipleAddressAvailable = true;
          } else {
            this.multipleAddressAvailable = false;
          }
        } else {
          this.multipleAddressAvailable = false;
          this.companyOptions = [];
        }
      }, (error: any) => {
        this.multipleAddressAvailable = false;
        console.error(error);
      })
    }
  }

  shopChanged(action, event){
    console.log(event.value);
    console.log(this.businessDataModel);
    let shopInfo = event.value;
    this.shopId = shopInfo.id;
    if(this.shopId>0){
      this.enableCompanyFields();
    }
    this.shopName = shopInfo.name;
    //this.compform.name.patchValue({ name : event.value.name });
    //this.compform?.name.patchValue({ id: event.value.id });
    this.companyForm.patchValue({
      'address1': shopInfo?.addressLine1,
      'address2': shopInfo?.addressLine2,
      'city': shopInfo?.city,
      'state': shopInfo?.state,
      'country': shopInfo?.country,
      'zip': shopInfo?.zip,
      'addressType': 'OLD',
      'shopInfo' : shopInfo
    });

    //this.loadAddressData();    
  }

  businessDataName(type, event) {
    /*console.log(event)
    let dataValue = this.businessData.find((data) => data[type] == this.compform[type].value);
    if (dataValue) {
      if (type == 'phoneNumber' && this.companyForm?.value?.phoneNumber && (this.companyForm?.value?.name != dataValue.name)) {
        this.compform?.name.setValue(dataValue.name);
        this.loadAddressData();
      } else if (type == 'name' && this.companyForm?.value?.name && (this.companyForm?.value?.phoneNumber != dataValue.phoneNumber)) {
        this.compform?.phoneNumber.setValue(dataValue.phoneNumber);
        this.loadAddressData();
      }
    }
    else {
      if (this.companyForm?.value?.name && this.companyForm?.value?.phoneNumber) {
        this.compform?.name.setValue(this.companyForm?.value?.name);
        this.compform?.phoneNumber.setValue(this.companyForm?.value?.phoneNumber);
      }
      if (this.companyForm?.value?.name && this.companyForm?.value?.phoneNumber) {
        this.businessData = [{ name: this.companyForm?.value?.name, phoneNumber: this.companyForm?.value?.phoneNumber }];
      };
    }*/
  }

  newBusinessUpdate() {
    if (this.businessForm.invalid || this.businessValidation?.isValid == true) {
      this.businessFormSubmitted = true;
    }
    else {
      this.businessLoader = true;
      let data = this.businessForm.value;
      const apiInfo = {};
      apiInfo['contentTypeId'] = ContentTypeValues.default
      apiInfo['apikey'] = Constant.ApiKey;
      apiInfo['domainId'] = this.domainId;
      apiInfo['userId'] = "1";
      apiInfo['action'] = 'new';
      apiInfo['shopId'] = '0';
      apiInfo['name'] = data.name;
      apiInfo['customerId'] = '';
      apiInfo['addressLine1'] = data.address1;
      apiInfo['addressLine2'] = data.address2;
      apiInfo['city'] = data.city;
      apiInfo['state'] = data.state;
      apiInfo['zip'] = data.zip;
      apiInfo['countryName'] = data.phoneNumber.countryName;
      apiInfo['countryCode'] = data.phoneNumber.countryCode;
      apiInfo['dialCode'] = data.phoneNumber.dialCode;
      apiInfo['phone'] = data.phoneNumber.number;
      apiInfo['email'] =  '';
      apiInfo['lat'] =  '';
      apiInfo['lng'] =  '';
      this.manageShop(apiInfo,'new');      
    }
  }

  continuePage(){
    
    if(!this.companyLoader){
      console.log(this.companyForm.invalid);
        if (this.companyForm.invalid ) {
          this.companyFormSubmitted = true;
        }
        else {
          this.companyFormSubmitted = false;
          this.companyLoader = true;
          let data = this.companyForm.value;          
          const apiInfo = {};
          apiInfo['contentTypeId'] = ContentTypeValues.default
          apiInfo['apikey'] = Constant.ApiKey;
          apiInfo['domainId'] = this.domainId;
          apiInfo['userId'] = "1";
          apiInfo['action'] = data.shopInfo.id > 0 ? 'edit' : 'new';
          apiInfo['shopId'] = data.shopInfo.id;
          apiInfo['name'] = data.shopInfo.name;
          apiInfo['customerId'] = data.shopInfo.customerId;
          apiInfo['addressLine1'] = data.address1;
          apiInfo['addressLine2'] = data.address2;
          apiInfo['city'] = data.city;
          apiInfo['state'] = data.state;
          apiInfo['zip'] = data.zip;
          apiInfo['countryName'] = data.shopInfo.countryName;
          apiInfo['countryCode'] = data.shopInfo.countryCode;
          apiInfo['dialCode'] = data.shopInfo.dialCode;
          apiInfo['phone'] = data.shopInfo.phone;
          apiInfo['email'] = data.shopInfo.email;
          apiInfo['lat'] = data.shopInfo.lat;
          apiInfo['lng'] = data.shopInfo.lng;
          this.manageShop(apiInfo,'edit');

        }
      }
    }

    redirectionMainPage(){
      localStorage.setItem('fromUserElecpage','1');
      localStorage.setItem('businessIdUserElecpage',this.shopId.toString());
      localStorage.setItem('businessNameUserElecpage',this.shopName);          
      localStorage.setItem('headerLogoUserElecpage',this.headerLogo);          
      setTimeout(() => {                
        this.companyFormSubmitted = false;
        this.companyLoader = false;
        this.companyForm.reset();
        this.router.navigate(['signup']);
      }, 100); 
    }

    manageShop(apiData,type){
      
        this.LandingpagewidgetsAPI.manageServiceShopAPI(apiData).subscribe((response) => {
          if (response.status == "Success") { 
            if(type == 'edit'){         
              this.redirectionMainPage(); 
            }
            else{
              const serviceShop = response.data[0];
              this.shopId = serviceShop.id;
              this.shopName = serviceShop.name;
              this.redirectionMainPage();
              this.businessFormPopup = false;
              this.businessLoader = false;
              let newDataObj = {
                addressLine1 : serviceShop?.addressLine1,
                addressLine2 : serviceShop?.addressLine2,
                city : serviceShop?.city,
                contentType : 0,
                countryCode : serviceShop?.countryCode,
                countryName : serviceShop?.countryName,
                createdOn: serviceShop?.createdOn,
                customerId : serviceShop?.customerId,
                dialCode : serviceShop?.dialCode,
                domainId : serviceShop?.domainId,
                email : serviceShop?.email,
                id : serviceShop?.id,
                isActive : 1,
                lat : serviceShop?.lat,
                lng : serviceShop?.lng,
                name : serviceShop?.name,
                phone : serviceShop?.phone,
                state : serviceShop?.state,
                updatedOn: serviceShop?.updatedOn,
                userId : 1,
                zip :  serviceShop?.zip
              };                         
              this.businessData.unshift(newDataObj);

              this.businessDataModel = newDataObj;
              console.log(this.businessDataModel);   
              this.companyForm.patchValue({
                'address1': serviceShop?.addressLine1,
                'address2': serviceShop?.addressLine2,
                'city': serviceShop?.city,
                'state': serviceShop?.state,
                'country': serviceShop?.country,
                'zip': serviceShop?.zip,
                'addressType': 'NEW',
                'shopInfo' : serviceShop
              });
              
            }        
          }
          else{
            if(type == 'edit'){
              
            }
            else{
              //this.businessFormPopup = false;
              this.businessLoader = false;
              this.businessValidation = {
                message:response.message,
                value:response.data.name,
                isValid:true
              }
            }
          }
        
    });
      
    
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

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.loading = false;
  }

}

