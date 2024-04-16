import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef, HostListener, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { GoogleMap } from '@angular/google-maps';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';
import {environment} from '../../../../environments/environment';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common/common.service';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-service-provider-inner-detail',
  templateUrl: './service-provider-inner-detail.component.html',
  styleUrls: ['./service-provider-inner-detail.component.scss']
})
export class ServiceProviderInnerDetailComponent implements OnInit, OnDestroy {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  atgTheme:string = "";
  public bodyClass:string = "service-provider-inner-detail";
  public bodyElem;
  public footerElem;
  public userAddLoader = false;
  public buyManualCount = 0;
  public taxResponse = null;
  blogs: any;
  customerReview: any;
  scrollImages: any = [];
  responsiveOptions:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 3
      },
      {
          breakpoint: '960px',
          numVisible: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  displayRegisterPopup: boolean = false;
  displayPaymentPopup: boolean = false;
  displayDetailsPopup: boolean = false;
  payablePrice: any;
  manualPayablePrice: any;
  manualId: any;
  paymentSuccessPopup: boolean = false;
  paymentFailurePopup: boolean = false;
  paymentMessage: string = "";
  successData: any;
  threadApiData: any;
  domainId: any;
  trainingId: any;
  trainingDomainId: any;
  trainingData: any;
  manualData: any;
  user: any;
  userForm: FormGroup;
  purchaseSeatForm: FormGroup;
  shippingForm: FormGroup;
  formSubmitted: boolean = false;
  shippingFormSubmitted: boolean = false;
  purchaseFormSubmitted: boolean = false;
  domainData: any;
  domainurl: any;
  loading: any = false;
  paymentLoading: any = false;
  paymentMethod: any = false;
  showPaymentFields: any = false;
  hidePaymentButton: any = false;
  registerUserId: any;
  registrationImage: any;
  openTraining: boolean;
  dynamicHeight: any;
  mapLat: any;
  mapLng: any;
  nameOfCard: any;
  addressLine1Value: any;
  addressLine2Value: any;
  cityValue: any;
  stateValue: any;
  countryValue: any = "1";
  countryPurchaseValue: any = 1;
  totalManualAmount = 0;
  zipValue: any;
  firstNameValue: any;
  lastNameValue: any;
  defaultDynamicHeight: any;
  pageLoading: boolean = false;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  phoneValue: any;
  pendingUsersToRegister: any;
  countryDropdownData: any = [];
  countryPurchaseDropdownData: any = [];
  stateDropdownData: any = [];
  statePurchaseDropdownData: any = [];
  reparifyDomain: boolean = false;
  numberOfSeatsValue: any;
  companyName: any;
  numberOfSeatsDropdownData: any = [];
  paymentEmailValue: any;
  paymentPhoneValue: any;
  formIndexReset: any = 0;
  formTypeValue: string;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  registerFormType: any = true;
  paymentCardResponse: any;
  registrationImageWidth: string;
  registrationImageHeight: string;
  showEmailValidationMsg: any;
  showUserEmailValidationError: any = [];
  multipleAddressAvailable: any = false;
  showAddressPopup: any = false;
  companyOptions: any;
  companyUserValue: any;
  companyPurchaseValue: any;
  companyAddressOptions: any = [];
  selectedAddress: any;
  companyStateDropdownData: any = [];
  companyUserStateValue: any;
  shippingUserStateValue: any;
  companyPurchaseStateValue: any;
  selectedCompanyAddressId: any;
  showChangeAddress: boolean = false;
  public showRefundPolicy: boolean = false;
  public shippingCost = 0;
  public defaultShippingCost = 0;
  public salesTax = 0;
  public salesTaxPercent = 0;
  public trainingSalesTax = 0;
  public trainingSalesTaxPercent = 0;
  defaultDiscountPrice: any;
  defaultDiscountPercentage: any;
  public isTrainingDeleted: boolean;
  cartItemSelect: boolean;
  domainSelectPopup: boolean;
  cartDomainId: any;
  shippingTax = 0;
  showCartUserDetailPopup = false;
  userInfoForm: FormGroup;
  userInfoFormSubmitted = false;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.scrollTo(0, 0);
  }

  constructor(
    public threadApi: ThreadService,
    private scrollTopService: ScrollTopService,
    private titleService: Title,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private serviceProviderApi: ServiceProviderService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private _renderer2: Renderer2,
    public location : Location,
    private commonService: CommonService,
    @Inject(DOCUMENT) private _document: Document,
    private fb: FormBuilder
  ) {
    this.trainingId = this.route.snapshot.params["id"];
    this.trainingDomainId = this.route.snapshot.params["domainId"];
    this.user = this.authenticationService.userValue;
    if (this.user) {
      this.domainId = this.user?.domain_id;
    }
    this.threadApiData = {
      threadId: this.trainingId,
    };
    this.pageLoading = true;
    this.getTrainingDetails();
    if (typeof google === 'object' && typeof google.maps === 'object') {

    } else {
      this.loadMapScript();
    }
    this.userForm = this.formBuilder.group({
      'user_data_map': this.formBuilder.array([]),
      'companyName': ['',[Validators.required]],
      'companyAddress1': ['',[Validators.required]],
      'companyAddress2': [''],
      'companyState': ['',[Validators.required]],
      'companyCity': ['',[Validators.required]],
      'companyZip': ['',[Validators.required]],
      'addressType': ['NEW'],
      'numberOfSeats': ['1']
    });
    this.purchaseSeatForm = this.formBuilder.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'address1': ['', [Validators.required]],
      'address2': [''],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'country': ['', [Validators.required]],
      'zipCode': ['', [Validators.required]],
      'companyName': ['', [Validators.required]],
      'numberOfSeats': ['', [Validators.required]],
      'companyAddress1': ['',[Validators.required]],
      'companyAddress2': [''],
      'companyState': ['',[Validators.required]],
      'companyCity': ['',[Validators.required]],
      'companyZip': ['',[Validators.required]],
      'addressType': ['NEW'],
      'formType': ['PURCHASE_SEAT']
    });
    this.shippingForm = this.formBuilder.group({
      'user_data_map': this.formBuilder.array([]),
      'shippingAddress1': ['',[Validators.required]],
      'shippingAddress2': [''],
      'shippingState': ['',[Validators.required]],
      'shippingCountry': [''],
      'shippingCity': ['',[Validators.required]],
      'shippingZip': ['',[Validators.required]],
      'paymentFirstName': [''],
      'paymentLastName': [''],
      'paymentPhone': [''],
      'paymentEmail': [''],
      'paymentAddress1': [''],
      'paymentAddress2': [''],
      'paymentCity': [''],
      'paymentState': [''],
      'paymentCountry': [''],
      'paymentZip': [''],
    });
  }

  createEmptyItem(): FormGroup {
    return this.formBuilder.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'formType': ['REGISTER_USER']
    });
  }

  createEmptyManualItem(): FormGroup {
    return this.formBuilder.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'formType': ['MANUAL_USER']
    });
  }
  goToManual(id) {
    this.router.navigateByUrl('marketplace/domain/' + this.trainingDomainId + '/manual/' + id);
  }

  goToMarketplace() {
    this.router.navigate(['/marketplace'])
    .then(() => {
      window.location.reload();
    });
  }

  get purchaseSeatFormControl() {
    return this.purchaseSeatForm.controls;
  }

  get userFormControl() {
    return this.userForm.controls;
  }

  get user_data_map(): FormArray {
    return this.userForm.get('user_data_map') as FormArray;
  }

  get shippingFormControl() {
    return this.shippingForm.controls;
  }

  get ship_data_map(): FormArray {
    return this.shippingForm.get('user_data_map') as FormArray;
  }

  setPaymentScript() {
    if (document.getElementById('velox')) {
      document.getElementById('velox').remove();
    }
    const script = this._renderer2.createElement('script');
    script.id = 'velox';
    script.src = 'https://velox.transactiongateway.com/token/Collect.js';
    if (this.trainingDomainId == 71) {
      // Repairify Token
      // Production Tokens
      // script.setAttribute('data-tokenization-key', environment.paymentKeys.prod.atg);

      // Sandbox Token
      script.setAttribute('data-tokenization-key', environment.paymentKeys.atg);

    }
    else {
      // MarketPlace Collabtic Token
      // Production Tokens
      //  script.setAttribute('data-tokenization-key', environment.paymentKeys.prod.collabtic);

      // Sandbox Token
      script.setAttribute('data-tokenization-key', environment.paymentKeys.collabtic);
    }
    this._renderer2.appendChild(this._document.body, script);
  }
  ngOnInit() {
    this.setPaymentScript();
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Service Provider Training Detail');
    this.loadCountryStateData();
    this.loadCompanyData();
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
    this.ship_data_map.insert(this.ship_data_map.length,this.createEmptyManualItem());
    this.loadShippingCost();
    this.commonService.cartProductsList.pipe(distinctUntilChanged()).subscribe((data) => {
      if (data) {
        this.cartDomainId = data?.domainId;
        if (data?.trainingIds?.includes(this.trainingId)) {
          this.cartItemSelect = true;
        }
        else {
          this.cartItemSelect = false;
        }
      }
    })
    this.userInfoForm = this.fb.group({
      'email': ['', [Validators.email]],
      // 'phoneNumber': [''],
    });
  }

  loadShippingCost() {
    this.threadApi.apiForShippingCost(this.trainingDomainId).subscribe((response: any) => {
      if(response.status == 'Success') {
        if(response.setting && response.setting.shippingCost) {
          this.defaultShippingCost = Math.round(response.setting.shippingCost * 100) / 100;
        }
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  isAddressValid(): boolean {
    return this.shippingFormControl.shippingAddress1.valid && this.shippingFormControl.shippingCity.valid && this.shippingFormControl.shippingState.valid && this.shippingFormControl.shippingZip.valid
  }

  getSalesTax(salesType: string = 'manual' ) {
    if ((salesType == 'manual') && this.isAddressValid()) {
      let body: any = {
        address1: this.shippingFormControl.shippingAddress1.value,
        address2: this.shippingFormControl.shippingAddress2.value,
        state: this.shippingFormControl.shippingState.value,
        city: this.shippingFormControl.shippingCity.value,
        zip: this.shippingFormControl.shippingZip.value,
        price: this.manualData?.discountPrice ? this.manualData?.discountPrice : this.manualPayablePrice,
        domainId: this.manualData.domainID,
        buyManualCount: this.buyManualCount,
        type: 'manual',
      }
      if(this.manualPayablePrice && this.buyManualCount) {
        this.shippingCost = this.defaultShippingCost;
        this.threadApi.apiForManualTax(body).subscribe((response: any) => {
          this.taxResponse = response.data;
          if (response.code == 200) {
            this.shippingTax = response.data?.tax?.breakdown?.shipping?.tax_collectable || 0;
            this.salesTax = (response.data?.tax?.amount_to_collect || 0) - this.shippingTax;
            this.salesTaxPercent = response.data?.tax?.rate ? response.data?.tax?.rate * 100 : 0;
            this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
          } else {
            this.shippingTax = 0;
            this.salesTax = 0;
            this.salesTaxPercent = 0;
            this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.shippingCost;
          }
        }, (error: any) => {
          console.error("error: ", error);
        })
      } else {
        if(this.buyManualCount == 0) this.shippingCost = 0;
        else this.shippingCost = this.defaultShippingCost;
        this.shippingTax = 0;
        this.salesTax = 0;
        this.salesTaxPercent = 0;
        this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.shippingCost;
      }
    } else if(['seminar','webinar'].includes(salesType) && this.isAddressValid()){
      let body = {
        address1: this.shippingFormControl.shippingAddress1.value,
        address2: this.shippingFormControl.shippingAddress2.value ,
        state: this.shippingFormControl.shippingState.value,
        city: this.shippingFormControl.shippingCity.value,
        zip: this.shippingFormControl.shippingZip.value,
        price: this.trainingData?.birdPrice ? this.trainingData?.birdPrice : this.trainingData?.price,
        domainId: this.manualData.domainID,
        buyManualCount: this.numberOfSeatsValue ? this.numberOfSeatsValue : this.user_data_map.length,
        type: this.trainingData.trainingMode.toLowerCase(),
      }
      this.threadApi.apiForManualTax(body).subscribe((response: any) => {
        this.taxResponse = response.data;
        if (response.code == 200) {
          this.trainingSalesTax = response.data?.tax?.amount_to_collect ? response.data?.tax?.amount_to_collect : 0;
          this.trainingSalesTaxPercent = response.data?.tax?.rate ? response.data?.tax?.rate * 100 : 0;
        } else {
          this.trainingSalesTax = 0;
          this.trainingSalesTaxPercent = 0;
        }
      }, (error: any) => {
        console.error("error: ", error);
      })
    }
  }

  removeUserInfo(index: any) {
    let userData = this.user_data_map.value;
    if (this.checkProperties(userData[index])){
      this.user_data_map.removeAt(index);
      this.showUserEmailValidationError.splic(index, 1);
    } else {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.buttonClass = 'green-button';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.user_data_map.removeAt(index);
        }
      });
    }
  }

  addUsernfo() {
    this.showUserEmailValidationError.push('');
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
  }

  addShipUsernfo() {
    this.showUserEmailValidationError.push('');
    this.ship_data_map.insert(this.ship_data_map.length,this.createEmptyManualItem());
  }

  public loadScript() {
    /*<script src="https://velox.transactiongateway.com/token/Collect.js"
    data-tokenization-key="jQdDdW-MAC7mM-7m8NtW-Cm5V39"
    data-payment-type="cc" data-theme="material"></script>*/
    let node = document.createElement('script');
    node.src = 'https://velox.transactiongateway.com/token/Collect.js';
    node.type = 'text/javascript';
    node.setAttribute('data-tokenization-key', 'jQdDdW-MAC7mM-7m8NtW-Cm5V39');
    node.setAttribute('data-payment-type', 'cc');
    node.setAttribute('data-theme',  'material');
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  loadMapScript() {
    const mapNode = document.createElement('script');
    mapNode.src = 'https://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false&key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    mapNode.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(mapNode);
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropdownData = response.data.countryData;
        this.stateDropdownData = response.data.stateData;
        this.countryPurchaseDropdownData = response.data.countryData;
        this.statePurchaseDropdownData = response.data.stateData;
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
    }, (error: any) => {
      this.loading = false;
    });
  }

  getStatesDropdownData(value: any) {
    this.stateValue = null;
    if (value) {
      this.threadApi.stateMasterData(value).subscribe((response: any) => {
        if (response.status == "Success") {
          this.stateDropdownData = response.data.stateData;
        }
      }, (error: any) => {
        this.loading = false;
      })
    } else {
      this.stateDropdownData = [];
    }
  }

  toggleBuyManualCount(actionType: string) {
    if(actionType == 'subtract' && this.buyManualCount >= 1) this.buyManualCount -= 1;
    else if(actionType == 'add' && this.buyManualCount < 9) this.buyManualCount += 1;
    this.totalManualAmount = this.buyManualCount == 0 ? 0 : (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
    this.getSalesTax();
  }

  getPurchaseStatesDropdownData(value: any) {
    this.purchaseSeatForm.patchValue({
      state: null,
    })
    if (value) {
      this.threadApi.stateMasterData(value).subscribe((response: any) => {
        if (response.status == "Success") {
          this.statePurchaseDropdownData = response.data.stateData;
        }
      }, (error: any) => {
        this.loading = false;
      })
    } else {
      this.statePurchaseDropdownData = [];
    }
  }

  openRegisterPopup() {
    this.paymentFailurePopup = false;
    this.paymentSuccessPopup = false;
    this.formSubmitted = false;
    this.purchaseFormSubmitted = false;
    this.hidePaymentButton = false;
    this.formIndexReset = 0;
    this.userForm.reset();
    this.userForm.patchValue({
      'numberOfSeats': '1'
    });
    let frmArray = this.userForm.get('user_data_map') as FormArray;
    frmArray.clear()
    this.addUsernfo();
    this.purchaseSeatForm.reset();
    this.countryPurchaseValue = 1;
    if (!this.payablePrice) {
      this.getPurchaseStatesDropdownData(this.countryPurchaseValue)
    }
    if (this.payablePrice) {
      this.purchaseSeatForm.removeControl('firstName');
      this.purchaseSeatForm.removeControl('lastName');
      this.purchaseSeatForm.removeControl('email');
      this.purchaseSeatForm.removeControl('phoneNumber');
      this.purchaseSeatForm.removeControl('address1');
      this.purchaseSeatForm.removeControl('address2');
      this.purchaseSeatForm.removeControl('city');
      this.purchaseSeatForm.removeControl('state');
      this.purchaseSeatForm.removeControl('country');
      this.purchaseSeatForm.removeControl('zipCode');
    }
    this.displayRegisterPopup = true;
    this.userAddLoader = false;
    this.firstNameValue = '';
    this.lastNameValue = '';
    this.addressLine1Value = '';
    this.addressLine2Value = '';
    this.cityValue = '';
    this.paymentEmailValue = '';
    this.paymentPhoneValue = '';
    this.stateValue = null;
    this.countryValue = "1";
    this.getStatesDropdownData(this.countryValue);
    this.zipValue = '';
    this.shippingForm.reset();
    let frmArray2 = this.shippingForm.get('user_data_map') as FormArray;
    frmArray2.clear()
    this.addShipUsernfo();
  }

  openShippingPopup() {
    // this.setCompanyValidations();
    if (!this.payablePrice) {
      this.showPaymentFields = false;
      if(this.registerFormType) {
        // this.submitUserDetails();
      } else {
        this.purchaseSeatForm.controls.address1.clearValidators();
        this.purchaseSeatForm.controls.address1.updateValueAndValidity();
        this.purchaseSeatForm.controls.country.clearValidators();
        this.purchaseSeatForm.controls.country.updateValueAndValidity();
        this.purchaseSeatForm.controls.state.clearValidators();
        this.purchaseSeatForm.controls.state.updateValueAndValidity();
        this.purchaseSeatForm.controls.city.clearValidators();
        this.purchaseSeatForm.controls.city.updateValueAndValidity();
        this.purchaseSeatForm.controls.zipCode.clearValidators();
        this.purchaseSeatForm.controls.zipCode.updateValueAndValidity();
        // this.purchaseSeatFormSubmit();
      }
    }
    if ((this.registerFormType && this.userForm.valid) || (!this.registerFormType && this.purchaseSeatForm.valid)) {
      this.formSubmitted = true;
      this.purchaseFormSubmitted = true;
      let formValue = this.userForm.getRawValue();
      this.firstNameValue = formValue.user_data_map[0].firstName;
      this.lastNameValue = formValue.user_data_map[0].lastName;
      this.paymentEmailValue = formValue.user_data_map[0].email;
      this.paymentPhoneValue = formValue.user_data_map[0].phoneNumber;
      this.displayRegisterPopup = false;
      // this.displayPaymentPopup = true;
      // this.showPaymentFields = true;
      this.paymentFailurePopup = false;
      this.paymentSuccessPopup = false;
      this.shippingFormSubmitted = false;
      this.hidePaymentButton = false;
      if(this.registerFormType) {
        if(!this.ship_data_map.controls[0]['controls'].firstName.value && !this.ship_data_map.controls[0]['controls'].lastName.value && !this.ship_data_map.controls[0]['controls'].email.value && !this.ship_data_map.controls[0]['controls'].phoneNumber.value) {
          this.ship_data_map.controls[0]['controls'].firstName.setValue(this.user_data_map.controls[0]['controls'].firstName.value)
          this.ship_data_map.controls[0]['controls'].lastName.setValue(this.user_data_map.controls[0]['controls'].lastName.value)
          this.ship_data_map.controls[0]['controls'].email.setValue(this.user_data_map.controls[0]['controls'].email.value)
          this.ship_data_map.controls[0]['controls'].phoneNumber.setValue(this.user_data_map.controls[0]['controls'].phoneNumber.value)
        }
        if(!this.shippingFormControl.shippingAddress1.value && !this.shippingFormControl.shippingAddress2.value && !this.shippingFormControl.shippingState.value && !this.shippingFormControl.shippingCity.value && !this.shippingFormControl.shippingZip.value) {
          this.shippingFormControl.shippingAddress1.setValue(formValue.companyAddress1);
          this.shippingFormControl.shippingAddress2.setValue(formValue.companyAddress2);
          this.shippingFormControl.shippingState.setValue(formValue.companyState);
          this.shippingFormControl.shippingCity.setValue(formValue.companyCity);
          this.shippingFormControl.shippingZip.setValue(formValue.companyZip);
        }
      } else {
        if(!this.shippingFormControl.shippingAddress1.value && !this.shippingFormControl.shippingAddress2.value && !this.shippingFormControl.shippingState.value && !this.shippingFormControl.shippingCity.value && !this.shippingFormControl.shippingZip.value) {
          let formValue2 = this.purchaseSeatForm.getRawValue();
          this.shippingFormControl.shippingAddress1.setValue(formValue2.companyAddress1);
          this.shippingFormControl.shippingAddress2.setValue(formValue2.companyAddress2);
          this.shippingFormControl.shippingCity.setValue(formValue2.companyCity);
          this.shippingFormControl.shippingState.setValue(formValue2.companyState);
          this.shippingFormControl.shippingZip.setValue(formValue2.companyZip);
        }
      }
      this.displayDetailsPopup = true;
      this.userAddLoader = false;
      this.buyManualCount = 0;
      this.shippingCost = 0;
      this.getSalesTax(this.trainingData.trainingMode.toLowerCase());
      this.getSalesTax();
      this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
    } else {
      if (this.registerFormType) {
        this.formSubmitted = true;
      } else {
        this.purchaseFormSubmitted = true;
      }
    }
  }

  backToRegisterPopup() {
    this.shippingFormSubmitted = false;
    this.displayDetailsPopup = false;
    this.displayRegisterPopup = true;
  }

  resetForm() {
    let formTouched = false;
    setTimeout(() => {
      this.formIndexReset = this.formIndexReset ? 0 : 1;
      if (this.formIndexReset == 0) {
        if(!this.userForm.controls.companyCity.value && !this.userForm.controls.companyZip.value && !this.userForm.controls.companyName.value && !this.userForm.controls.companyAddress1.value && !this.userForm.controls.companyAddress2.value && !this.userForm.controls.companyState.value) this.userForm.markAsUntouched();
        if (this.userForm.touched) {
          formTouched = true;
        } else if(this.userForm.value.user_data_map[0].firstName || this.userForm.value.user_data_map[0].lastName || this.userForm.value.user_data_map[0].email || this.userForm.value.user_data_map[0].phoneNumber) {
          formTouched = true;
        }
      } else {
        if (this.checkProperties(this.purchaseSeatForm.value)) {
          formTouched = false;
        } else {
          formTouched = true;
        }
      }
      if (formTouched) {
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'Cancel';
        modalRef.componentInstance.buttonClass = 'green-button';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          if (!receivedService) {
            return;
          } else {
            this.formIndexReset = this.formIndexReset ? 0 : 1;
            this.formSubmitted = false;
            this.userForm.reset();
            this.userForm.patchValue({
              numberOfSeats: 1
            });
            let frmArray = this.userForm.get('user_data_map') as FormArray;
            frmArray.clear();
            this.addUsernfo();
            this.purchaseFormSubmitted = false;
            this.purchaseSeatForm.reset();
            this.purchaseSeatForm.patchValue({
              formType: 'PURCHASE_SEAT',
            });
            this.countryPurchaseValue = 1;
            if (this.payablePrice) {
              this.purchaseSeatForm.removeControl('firstName');
              this.purchaseSeatForm.removeControl('lastName');
              this.purchaseSeatForm.removeControl('email');
              this.purchaseSeatForm.removeControl('phoneNumber');
              this.purchaseSeatForm.removeControl('address1');
              this.purchaseSeatForm.removeControl('address2');
              this.purchaseSeatForm.removeControl('city');
              this.purchaseSeatForm.removeControl('state');
              this.purchaseSeatForm.removeControl('country');
              this.purchaseSeatForm.removeControl('zipCode');
            }
          }
        });
      } else {
        this.formIndexReset = this.formIndexReset ? 0 : 1;
      }
      this.setAddressValueNull();
    }, 0);
  }

  checkConfirmPopup() {
    let formTouched = false;
    if (this.formIndexReset == 0) {
      let userData = this.userForm.value;
      if (userData.user_data_map.length == 1 && this.checkProperties(userData.user_data_map[0]) && !(userData.companyName === null && userData.companyName === "" && userData.companyName === undefined)) {
        formTouched = false;
      } else {
        formTouched = true;
      }
    } else {
      if (this.checkProperties(this.purchaseSeatForm.value)) {
        formTouched = false;
      } else {
        formTouched = true;
      }
    }
    if (formTouched) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.buttonClass = 'green-button';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.displayDetailsPopup = false;
          this.shippingFormSubmitted = false;
          this.shippingForm.reset();
          let frmArray = this.shippingForm.get('user_data_map') as FormArray;
          frmArray.clear();
          this.addShipUsernfo();
          this.displayRegisterPopup = false;
          this.formSubmitted = false;
          this.userForm.reset();
          this.userForm.patchValue({
            numberOfSeats: 1
          });
          let frmArray2 = this.userForm.get('user_data_map') as FormArray;
          frmArray2.clear();
          this.addUsernfo();
          this.purchaseFormSubmitted = false;
          this.purchaseSeatForm.reset();
          this.purchaseSeatForm.patchValue({
            formType: 'PURCHASE_SEAT',
          });
          this.countryPurchaseValue = 1;
          if (this.payablePrice) {
            this.purchaseSeatForm.removeControl('firstName');
            this.purchaseSeatForm.removeControl('lastName');
            this.purchaseSeatForm.removeControl('email');
            this.purchaseSeatForm.removeControl('phoneNumber');
            this.purchaseSeatForm.removeControl('address1');
            this.purchaseSeatForm.removeControl('address2');
            this.purchaseSeatForm.removeControl('city');
            this.purchaseSeatForm.removeControl('state');
            this.purchaseSeatForm.removeControl('country');
            this.purchaseSeatForm.removeControl('zipCode');
          }
        }
      });
    } else {
      this.displayRegisterPopup = false;
    }
  }

  checkManualConfirmPopup() {
    let formTouched = false;
    let userData = this.shippingForm.value;
    if (userData.user_data_map.length == 1 && this.checkProperties(userData.user_data_map[0])) {
      formTouched = false;
    } else {
      formTouched = true;
    }
    if (formTouched) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.buttonClass = 'green-button';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.displayDetailsPopup = false;
          this.shippingFormSubmitted = false;
          this.shippingForm.reset();
          let frmArray = this.shippingForm.get('user_data_map') as FormArray;
          frmArray.clear();
          this.addShipUsernfo();
          this.displayRegisterPopup = false;
          this.formSubmitted = false;
          this.userForm.reset();
          this.userForm.patchValue({
            numberOfSeats: 1
          });
          let frmArray2 = this.userForm.get('user_data_map') as FormArray;
          frmArray2.clear();
          this.addUsernfo();
          this.purchaseFormSubmitted = false;
          this.purchaseSeatForm.reset();
          this.purchaseSeatForm.patchValue({
            formType: 'PURCHASE_SEAT',
          });
          this.countryPurchaseValue = 1;
          if (this.payablePrice) {
            this.purchaseSeatForm.removeControl('firstName');
            this.purchaseSeatForm.removeControl('lastName');
            this.purchaseSeatForm.removeControl('email');
            this.purchaseSeatForm.removeControl('phoneNumber');
            this.purchaseSeatForm.removeControl('address1');
            this.purchaseSeatForm.removeControl('address2');
            this.purchaseSeatForm.removeControl('city');
            this.purchaseSeatForm.removeControl('state');
            this.purchaseSeatForm.removeControl('country');
            this.purchaseSeatForm.removeControl('zipCode');
          }
        }
      });
    } else {
      this.displayDetailsPopup = false;
    }
  }

  checkProperties(obj) {
    for (let key in obj) {
      if (key != 'formType' && key != 'country' && key != 'addressType')
        if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined)
            return false;
    }
    return true;
  }

  finishSubmit(response: any) {
    let userForm = this.userForm.value;
    let timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    let country = this.countryDropdownData.filter((country: any) => country.id == response.country);
    let state = this.stateDropdownData.filter((state: any) => state.id == response.state);
    let stateNewValue = state ? state[0].name : '';
    let CountryNewValue = country ? country[0].name : '';
    let payload = {
      "trainingId": this.trainingData.id,
      "userId": this.registerUserId,
      "domainId": this.trainingData.domainID,
      "firstName": response.firstName,
      "lastName": response.lastName,
      "email": userForm.email,
      "payment_email": response.payment_email,
      "phoneNumber": response.phoneNumber,
      'address1': response.address1,
      'address2': response.address2,
      'city': response.city,
      'state': stateNewValue,
      'paidPrice': this.trainingData?.birdPrice && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : this.payablePrice,
      'country': CountryNewValue,
      'numberOfSeats': response.numberOfSeats,
      'numberOfManuals': this.buyManualCount,
      "address": response.address1 +', '+ response.address2 + ', '+ response.city + ', '+ stateNewValue + ', '+ CountryNewValue,
      "zip": response.zip,
      "token": response.token,
      "amount": response.amount,
      "birdPrice": this.trainingData?.birdPrice,
      "birdPercentage": this.trainingData?.birdPercentage,
      "originalPrice": this.trainingData?.price,
      "timeZoneMinutes": timezone_offset_minutes,
      "card":response.card,
      "timeZone": response.timeZone,
      "paymentTime": response.paymentTime,
      "bankName": response.bankName,
      "checkNumber": response.checkNumber,
      "paymentMethod": response.paymentMethod,
      "formType": this.formTypeValue,
      "manualId": this.manualId,
      "manual": this.manualData,
      "shippingDetails": this.shippingForm.getRawValue(),
      "taxResponse": this.taxResponse,
      "salesTax": this.salesTax,
      "salesTaxPercent": this.salesTaxPercent,
      "shippingCost": this.shippingCost,
      "shippingTax": this.shippingTax,
      "url": window.location.href,
    }
    if(response.paymentMethod == 'card') this.submitByCard(payload);
    else if(response.paymentMethod == 'check') this.submitByCheck(payload);
  }

  refundPolicyShow(show: boolean) {
    this.showRefundPolicy = show;
  }

  submitByCard(payload) {
    this.serviceProviderApi.sendPaymentDetail(payload).subscribe((result: any) => {
      this.paymentLoading = false;
      if (result.status === "Success") {
        this.paymentSuccessPopup = true;
        this.paymentMessage = result.message;
        this.successData = result.data;
      } else {
        this.paymentFailurePopup = true;
        this.paymentMessage = result.message;
      }
      this.cd.detectChanges();
    }, (error: any) => {
      this.paymentFailurePopup = true;
      this.paymentLoading = false;
      this.paymentMessage = error.message;
    })
  }

  submitByCheck(payload) {
    this.serviceProviderApi.sendPaymentDetailByCheck(payload).subscribe((result: any) => {
      this.paymentLoading = false;
      if (result.status === "Success") {
        this.paymentSuccessPopup = true;
        this.paymentMessage = result.message;
        this.successData = result.data;
      } else {
        this.paymentFailurePopup = true;
        this.paymentMessage = result.message;
      }
      this.cd.detectChanges();
    }, (error: any) => {
      this.paymentFailurePopup = true;
      this.paymentLoading = false;
      this.paymentMessage = error.message;
    })
  }

  calculatePercentageValue(value: any) {
    if (value) {
      let percentageValue = parseFloat(value);
      return 100 - percentageValue;
    } else {
      return 0;
    }
  }

  submitPaymentData(event: any) {
    this.paymentCardResponse = event;
    if (!event.firstName || !event.lastName || !event.address1  || !event.state || !event.country || !event.zip || !event.city) {
      this.checkValidation();
      this.hidePaymentButton = false;
      this.cd.detectChanges();
      return true;
    }
    this.hidePaymentButton = true;
    this.paymentLoading = true;
    this.showPaymentFields = false;
    this.cd.detectChanges();
    if (this.registerFormType) {
      this.submitUserDetails();
    } else {
      this.purchaseSeatFormSubmit();
    }
  }
  setHidePaymentButton(event) {
    this.hidePaymentButton = event;
  }

  loadMap = () => {
    const bounds = new window['google'].maps.LatLngBounds();
    const mapElement = document.getElementById('map');
    const map = new window['google'].maps.Map(mapElement, {
      zoom: 8
    });
    let infowindow = null;
    const geocoder = new window['google'].maps.Geocoder();
    const address = this.trainingData.addressLine1 + this.trainingData.addressLine2 + ',' + this.trainingData.city + ',' + this.trainingData.state + ',' + this.trainingData.zipCode;
    geocoder.geocode( {address}, (results, status) => {
      if (status == window['google'].maps.GeocoderStatus.OK) {
        this.defaultDynamicHeight = "0px";
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        if (lat && lng) {
          this.mapLat = lat;
          this.mapLng = lng;
          this.dynamicHeight = "238px";
        } else {
          this.dynamicHeight = "0px";
        }
        const marker: any = new window['google'].maps.Marker({
          position: {lat, lng},
          map,
          title: this.trainingData.venueName,
          draggable: false,
          animation: window['google'].maps.Animation.DROP,
        });
        bounds.extend(new window['google'].maps.LatLng(marker.position));
        map.fitBounds(bounds);
        map.setZoom(12);
        marker.addListener('click', () => {
          if (infowindow) {
            infowindow.close();
          }
          infowindow = new window['google'].maps.InfoWindow({
            content: ''
          });
        });
      } else {
        this.defaultDynamicHeight = "238px";
      }
    });
  }

  goToMap(trainingData) {
    const address = trainingData?.addressLine1 + ' ' + trainingData?.addressLine2  + ' ' + trainingData?.city  + ' ' + trainingData?.state  + ' ' + trainingData?.zipCode;
    window.open('https://maps.google.com/maps?q=' + address, '_blank');
  }

  renderMap() {
    window['initMap'] = () => {
      this.loadMap();
    };
    this.loadMap();
  }

  checkValidation() {
    if (this.paymentCardResponse.firstName) {
      document.getElementById('firstName').style.display = 'none';
    } else {
      document.getElementById('firstName').style.display = 'block';
    }
    if (this.paymentCardResponse.lastName) {
      document.getElementById('lastName').style.display = 'none';
    } else {
      document.getElementById('lastName').style.display = 'block';
    }
    if (this.paymentCardResponse.payment_email) {
      document.getElementById('paymentEmail').style.display = 'none';
    } else {
      document.getElementById('paymentEmail').style.display = 'block';
    }
    if (this.paymentCardResponse.phoneNumber) {
      document.getElementById('paymentPhone').style.display = 'none';
    } else {
      document.getElementById('paymentPhone').style.display = 'block';
    }
    if (this.paymentCardResponse.address1) {
      document.getElementById('address1').style.display = 'none';
    } else {
      document.getElementById('address1').style.display = 'block';
    }
    if (this.paymentCardResponse.address2) {
      document.getElementById('city').style.display = 'none';
    } else {
      document.getElementById('city').style.display = 'block';
    }
    if (this.paymentCardResponse.state) {
      document.getElementById('state').style.display = 'none';
    } else {
      document.getElementById('state').style.display = 'block';
    }
    if (this.paymentCardResponse.country) {
      document.getElementById('country').style.display = 'none';
    } else {
      document.getElementById('country').style.display = 'block';
    }
    if (this.paymentCardResponse.zip) {
      document.getElementById('zip').style.display = 'none';
    } else {
      document.getElementById('zip').style.display = 'block';
    }
  }

  openPaymentFromEvent() {
    this.paymentFailurePopup = false;
    this.openPaymentPopup();
  }

  openPaymentPopup() {
    // this.setCompanyValidations();
    if (!this.payablePrice) {
      this.showPaymentFields = false;
      this.manualId = null;
      if(this.registerFormType) {
        this.submitUserDetails();
      } else {
        this.purchaseSeatForm.controls.address1.clearValidators();
        this.purchaseSeatForm.controls.address1.updateValueAndValidity();
        this.purchaseSeatForm.controls.country.clearValidators();
        this.purchaseSeatForm.controls.country.updateValueAndValidity();
        this.purchaseSeatForm.controls.state.clearValidators();
        this.purchaseSeatForm.controls.state.updateValueAndValidity();
        this.purchaseSeatForm.controls.city.clearValidators();
        this.purchaseSeatForm.controls.city.updateValueAndValidity();
        this.purchaseSeatForm.controls.zipCode.clearValidators();
        this.purchaseSeatForm.controls.zipCode.updateValueAndValidity();
        this.purchaseSeatFormSubmit();
      }
    } else {
      if ((this.registerFormType && this.userForm.valid) || (!this.registerFormType && this.purchaseSeatForm.valid)) {
        this.manualId = null;
        this.formSubmitted = true;
        this.purchaseFormSubmitted = true;
        let formValue = this.userForm.getRawValue();
        this.firstNameValue = formValue.user_data_map[0].firstName;
        this.lastNameValue = formValue.user_data_map[0].lastName;
        this.paymentEmailValue = formValue.user_data_map[0].email;
        this.paymentPhoneValue = formValue.user_data_map[0].phoneNumber;
        this.displayRegisterPopup = false;
        this.displayDetailsPopup = false;
        this.displayPaymentPopup = true;
        this.showPaymentFields = true;
      } else {
        if (this.registerFormType) {
          this.formSubmitted = true;
        } else {
          this.purchaseFormSubmitted = true;
        }
      }
    }
  }

  openManualPaymentPopup() {
    this.manualId = parseInt(this.manualData.id);
    if (!this.payablePrice && !this.manualPayablePrice && !this.shippingCost && !this.salesTax) {
      this.showPaymentFields = false;
      this.submitUserDetails();
    } else {
      if (this.shippingForm.valid) {
        this.shippingFormSubmitted = true;
        this.purchaseFormSubmitted = true;
        let formValue = this.shippingForm.getRawValue();
        this.displayDetailsPopup = false;
        this.displayPaymentPopup = true;
        this.showPaymentFields = true;
      } else {
        this.shippingFormSubmitted = true;
      }
    }
  }

  // setCompanyValidations() {
  //   if(this.domainId == 1) {
  //     if(!this.formIndexReset) {
  //       if(!this.userForm.controls.companyName.value) {
  //         this.userForm.controls.companyAddress1.clearValidators();
  //         this.userForm.controls.companyState.clearValidators();
  //         this.userForm.controls.companyCity.clearValidators();
  //         this.userForm.controls.companyZip.clearValidators();
  //       } else {
  //         this.userForm.controls.companyAddress1.setValidators(Validators.required);
  //         this.userForm.controls.companyState.setValidators(Validators.required);
  //         this.userForm.controls.companyCity.setValidators(Validators.required);
  //         this.userForm.controls.companyZip.setValidators(Validators.required);
  //       }
  //       this.userForm.controls.companyAddress1.updateValueAndValidity();
  //       this.userForm.controls.companyState.updateValueAndValidity();
  //       this.userForm.controls.companyCity.updateValueAndValidity();
  //       this.userForm.controls.companyZip.updateValueAndValidity();
  //     } else if(this.formIndexReset) {
  //       if(!this.purchaseSeatForm.controls.companyName.value) {
  //         this.purchaseSeatForm.controls.companyAddress1.clearValidators();
  //         this.purchaseSeatForm.controls.companyState.clearValidators();
  //         this.purchaseSeatForm.controls.companyCity.clearValidators();
  //         this.purchaseSeatForm.controls.companyZip.clearValidators();
  //       } else {
  //         this.purchaseSeatForm.controls.companyAddress1.setValidators(Validators.required);
  //         this.purchaseSeatForm.controls.companyState.setValidators(Validators.required);
  //         this.purchaseSeatForm.controls.companyCity.setValidators(Validators.required);
  //         this.purchaseSeatForm.controls.companyZip.setValidators(Validators.required);
  //       }
  //       this.purchaseSeatForm.controls.companyAddress1.updateValueAndValidity();
  //       this.purchaseSeatForm.controls.companyState.updateValueAndValidity();
  //       this.purchaseSeatForm.controls.companyCity.updateValueAndValidity();
  //       this.purchaseSeatForm.controls.companyZip.updateValueAndValidity();
  //     }
  //   }
  // }

  backToFormPopup() {
    this.displayPaymentPopup = false;
    if(!this.manualId) this.displayRegisterPopup = true;
    else this.displayDetailsPopup = true;
  }

  submitUserDetails() {
    if (this.userForm.valid) {
      this.userAddLoader = true;
      this.formSubmitted = false;
      if(this.manualId) {
        let shipFormValue = this.shippingForm.getRawValue();
        let stateDataValue = this.stateDropdownData?.filter((state: any) => {
          return state.name == shipFormValue.shippingState;
        });
        let countryDataValue = this.countryDropdownData?.filter((country: any) => {
          return country.id == stateDataValue[0]?.country_id;
        });
        this.shippingFormControl.shippingCountry.setValue(countryDataValue[0]?.name);
      }
      let formValue = this.userForm.getRawValue();
      this.loading = true;
      let timezone_offset_minutes: any = new Date().getTimezoneOffset();
      timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
      let body: any = {
        user_data_map: formValue.user_data_map,
        companyName: formValue.companyName,
        companyAddress1: formValue.companyAddress1,
        companyAddress2: formValue.companyAddress2,
        companyState: formValue.companyState,
        companyCity: formValue.companyCity,
        companyZip: formValue.companyZip,
        addressType: formValue.addressType,
        companyAddressId: this.selectedCompanyAddressId,
        price: this.totalManualAmount + (this.getNumberOfCounts() * this.calculateTotalAmount()),
        domainId: this.domainId,
        birdPrice: this.trainingData?.birdPrice,
        birdPercentage: this.trainingData?.birdPercentage,
        originalPrice: this.trainingData?.price,
        trainingId: this.trainingData.id,
        timeZoneMinutes: timezone_offset_minutes,
        numberOfSeats: formValue.numberOfSeats,
        manual: this.manualData,
        shippingDetails: this.shippingForm.getRawValue(),
        paidPrice: this.trainingData?.birdPrice && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : this.payablePrice,
        timeZone: momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
        paymentTime: moment().format('MMM DD, YYYY h:mm A'),
      }
      this.threadApi.userSubmitData(body).subscribe((response: any) => {
        if (response.status == "Success") {
          this.registerUserId = response.data;
          this.userAddLoader = false;
          this.formTypeValue = 'REGISTER_USER';
          if (this.payablePrice || (this.manualId && (this.manualPayablePrice || this.shippingCost || this.salesTax))) {
            this.finishSubmit(this.paymentCardResponse);
          } else {
            this.displayDetailsPopup = false;
            this.displayRegisterPopup = false;
            this.displayPaymentPopup = true;
            this.paymentSuccessPopup = true;
          }
        }
      }, (error: any) => {
        this.loading = false;
        this.userAddLoader = false;
      })
    } else {
      this.formSubmitted = true;
    }
  }

  purchaseSeatFormSubmit() {
    if (this.purchaseSeatForm.valid) {
      this.purchaseFormSubmitted = false;
      this.userAddLoader = true;
      this.formSubmitted = false;
      if(this.manualId) {
        let shipFormValue = this.shippingForm.getRawValue();
        let stateDataValue = this.stateDropdownData?.filter((state: any) => {
          return state.name == shipFormValue.shippingState;
        });
        let countryDataValue = this.countryDropdownData?.filter((country: any) => {
          return country.id == stateDataValue[0]?.country_id;
        });
        this.shippingFormControl.shippingCountry.setValue(countryDataValue[0]?.name);
      }
      let formValue: any = this.purchaseSeatForm.getRawValue();
      this.loading = true;
      let timezone_offset_minutes: any = new Date().getTimezoneOffset();
      timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
      formValue.timeZoneMinutes = timezone_offset_minutes
      formValue.price = this.totalManualAmount + (this.getNumberOfCounts() * this.calculateTotalAmount());
      formValue.manual = this.manualData;
      formValue.shippingDetails = this.shippingForm.getRawValue();
      formValue.birdPrice = this.trainingData?.birdPrice;
      formValue.domainId = this.domainId;
      formValue.birdPercentage = this.trainingData?.birdPercentage;
      formValue.companyAddressId = this.selectedCompanyAddressId;
      formValue.originalPrice = this.trainingData?.price;
      formValue.trainingId = this.trainingData.id;
      formValue.paidPrice = this.trainingData?.birdPrice && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : this.payablePrice;
      formValue.timeZone = momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
      formValue.paymentTime = moment().format('MMM DD, YYYY h:mm A'),
      formValue.email = formValue?.email ? formValue?.email : this.paymentCardResponse.payment_email;
      this.threadApi.purchaseSeatsData(formValue).subscribe((response: any) => {
        if (response.status == "Success") {
          this.registerUserId = response.data;
          this.userAddLoader = false;
          this.formTypeValue = 'PURCHASE_SEAT';
          if (this.payablePrice || (this.manualId && (this.manualPayablePrice || this.shippingCost || this.salesTax))) {
            this.finishSubmit(this.paymentCardResponse);
          } else {
            this.displayRegisterPopup = false;
            this.displayDetailsPopup = false;
            this.displayPaymentPopup = true;
            this.paymentSuccessPopup = true;
          }
        }
      }, (error: any) => {
        this.loading = false;
        this.userAddLoader = false;
      })
    } else {
      this.purchaseFormSubmitted = true;
    }
  }

  closePopup() {
    location.reload();
    this.paymentSuccessPopup = false;
    this.displayPaymentPopup = false;
    this.paymentMessage = "";
    this.successData = null;
  }
  closePaymentPopup() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.buttonClass = 'green-button';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (!receivedService) {
        return;
      } else {
        this.paymentSuccessPopup = false;
        this.displayPaymentPopup = false;
        this.paymentMessage = "";
        this.successData = null;
      }
    });
  }

  getNumberOfCounts() {
    return this.numberOfSeatsValue ? this.numberOfSeatsValue : this.user_data_map.length;
  }

  getLabelValue() {
    if (this.formIndexReset) {
      return this.numberOfSeatsValue > 1 ? 'No. of seats' : 'No. of seat';
    } else {
      return this.user_data_map.length > 1 ? 'No. of participants' : 'No. of participant';
    }
  }

  checkBirdPriceAvailablity(date: any) {
    let currentDate: any = new Date();
    currentDate.setHours(0,0,0,0)
    let checkDate: any = new Date(date);
    checkDate.setHours(0,0,0,0)
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }
  hidePaymentPopup() {
    if (this.showPaymentFields) {
      this.displayPaymentPopup = true;
      this.closePaymentPopup();
    }
  }
  getTrainingDetails() {
    this.threadApi.apiInnerGetMarketPlaceEditData(this.threadApiData).subscribe((response) => {
      if (response.status == 'Success') {
        this.trainingData = response.data.marketPlaceData;
        this.trainingData.description = this.threadApi.urlify(this.trainingData.description);
        this.manualData = response.data.manual;
        this.domainData = response.data.businessDomainData;
        this.domainurl = 'https://' + this.domainData.subdomainurl + '.collabtic.com/marketplace/detail';
        if (this.trainingData.attachments && this.trainingData.attachments.length > 0) {
          this.trainingData.attachments.forEach((attachment: any) => {
            this.scrollImages.push({
              previewImageSrc: this.isVideo(attachment?.fileExtension) ? attachment?.filePath : (attachment?.thumbFilePath ? attachment?.filePath : 'assets/images/service-provider/training-blank-1.png'),
              thumbnailImageSrc: this.isVideo(attachment?.fileExtension) ? attachment?.posterImage : (attachment?.thumbFilePath ? attachment?.thumbFilePath : 'assets/images/service-provider/training-blank-1.png'),
              isVideo: this.isVideo(attachment?.fileExtension) ? true : false,
              fileType: attachment?.fileType,
            });
          });
        }
        if (!this.trainingData.attachments || this.trainingData.attachments.length < 4) {
          let pushCount: any = 4 - this.scrollImages.length;
          for (let index = 0; index < pushCount; index++) {
            this.scrollImages.push({
              previewImageSrc: "assets/images/service-provider/training-blank-"+(index+1)+".png",
              thumbnailImageSrc: "assets/images/service-provider/training-blank-"+(index+1)+".png",
              isVideo: false,
              fileType: 'image/png',
            })
          }
        }
        if (this.trainingData.isSold == '0' && this.trainingData.isClosed == '0') {
          this.registrationImage = "assets/images/service-provider/registration-open.png";
          this.registrationImageWidth = '150';
          this.registrationImageHeight = '50';
          this.openTraining = true;
        } else if (this.trainingData.isSold == '0' && this.trainingData.isClosed == '1') {
          this.registrationImage = "assets/images/service-provider/training-closed.png";
          this.registrationImageWidth = '73';
          this.registrationImageHeight = '75';
          this.openTraining = false;
        } else if (this.trainingData.isSold == '1' && this.trainingData.isClosed == '0') {
          this.registrationImage = "assets/images/service-provider/training-sold-out.png";
          this.registrationImageWidth = '85';
          this.registrationImageHeight = '46';
          this.openTraining = false;
        } else if (this.trainingData.isSold == '1' && this.trainingData.isClosed == '1') {
          this.registrationImage = "assets/images/service-provider/training-closed.png";
          this.registrationImageWidth = '73';
          this.registrationImageHeight = '75';
          this.openTraining = false;
        }
        this.pendingUsersToRegister = parseInt(this.trainingData.maxParticipants) - parseInt(this.trainingData.signedupUsers ? this.trainingData.signedupUsers : '0');
        this.purchaseSeatForm.get('numberOfSeats').setValidators([Validators.required, Validators.max(this.pendingUsersToRegister)]);
        this.purchaseSeatForm.get('numberOfSeats').updateValueAndValidity();
        if (this.trainingData.trainingMode == 'Seminar') {
          setTimeout(() => {
            this.renderMap();
          }, 500);
        }
        this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
        if(this.manualData) {
          if(this.trainingData?.isManualDiscountPrice && this.trainingData.isManualDiscountPrice == '1'){
            this.defaultDiscountPrice = this.manualData.discountPrice;
            this.defaultDiscountPercentage = this.manualData.discountPercentage;
            this.manualData.discountPrice = this.trainingData.manualDiscountPrice;
            this.manualData.discountPercentage = parseFloat((((this.manualData.price - this.manualData.discountPrice) / this.manualData.price) * 100).toString()).toFixed(0);
          }
          this.manualPayablePrice = this.manualData.price && this.manualData.price != '0' ? this.manualData.price : 0;
          if(!this.manualPayablePrice) {
            this.manualData.discountPrice = 0;
            this.manualData.discountPercentage = 0;
          }
        } else {
          this.manualPayablePrice = 0;
        }
        if (this.payablePrice) {
          this.purchaseSeatForm.removeControl('firstName');
          this.purchaseSeatForm.removeControl('lastName');
          this.purchaseSeatForm.removeControl('email');
          this.purchaseSeatForm.removeControl('phoneNumber');
          this.purchaseSeatForm.removeControl('address1');
          this.purchaseSeatForm.removeControl('address2');
          this.purchaseSeatForm.removeControl('city');
          this.purchaseSeatForm.removeControl('state');
          this.purchaseSeatForm.removeControl('country');
          this.purchaseSeatForm.removeControl('zipCode');
        }
        if (this.trainingData && this.trainingData?.isActive != "1") {
          this.isTrainingDeleted = true;
        }
      }
      this.pageLoading = false;
    }, (error: any) => {
      this.pageLoading = false;
    })
  }

  isVideo(ext :any) {
    switch (ext?.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }

  askAQuestionMail(email: any) {
    window.open("mailto:"+email);
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }

  getStartDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD');
    } else {
      return '';
    }
  }

  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A');
    } else {
      return '';
    }
  }

  getDayfromDate(value: any) {
    if (value) {
      return moment(value).format('ddd');
    } else {
      return '';
    }
  }

  getHourOnlyFormat(value: any) {
    if (value) {
      return moment(value).format('h A');
    } else {
      return '';
    }
  }

  addDateAndFormat(value: any, index: any) {
    if (value) {
      return moment(value).add(index, 'days').format('MMM DD, YYYY');
    } else {
      return '';
    }
  }

  getDateTimeFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY h:mm A');
    } else {
      return '';
    }
  }

  goBack(){
    history.back();
  }

  ngOnDestroy() {
    if (this.bodyElem?.classList.contains(this.bodyClass)) {
      this.bodyElem.classList.remove(this.bodyClass);
    }
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  openAddressSelectPopup() {
    this.showAddressPopup = true;
  }

  loadCompanyData() {
    let domainId = this.domainId
    this.threadApi.apiForCompanyAddData(domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.companyOptions = response?.data?.companyData;
      } else {
        this.companyOptions = []
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  loadAddressData() {
    // this.setCompanyValidations();
    if ((this.formIndexReset && this.companyPurchaseValue) || (!this.formIndexReset && this.companyUserValue)) {
      let body: any = {
        domainId: this.domainId,
        companyId: this.formIndexReset ? this.companyPurchaseValue : this.companyUserValue,
      }
      this.selectedAddress = null;
      this.userForm.controls['companyAddress1'].enable();
      this.userForm.controls['companyAddress2'].enable();
      this.userForm.controls['companyCity'].enable();
      this.userForm.controls['companyState'].enable();
      this.userForm.controls['companyZip'].enable();
      this.purchaseSeatForm.controls['companyAddress1'].enable();
      this.purchaseSeatForm.controls['companyAddress2'].enable();
      this.purchaseSeatForm.controls['companyCity'].enable();
      this.purchaseSeatForm.controls['companyState'].enable();
      this.purchaseSeatForm.controls['companyZip'].enable();
      this.companyUserStateValue = null;
      this.companyPurchaseStateValue = null;
      this.selectedCompanyAddressId = null;
      this.userForm.patchValue({
        'companyAddress1': '',
        'companyAddress2': '',
        'companyCity': '',
        'companyZip': '',
        'addressType': 'NEW',
      });
      this.purchaseSeatForm.patchValue({
        'companyAddress1': '',
        'companyAddress2': '',
        'companyCity': '',
        'companyZip': '',
        'addressType': 'NEW',
      });
      this.threadApi.apiForCompanyAddressAddData(body).subscribe((response: any) => {
        this.showChangeAddress = false;
        if (response.status == 'Success') {
          this.companyAddressOptions = response?.data?.companyAddressData;
          if (this.companyAddressOptions?.length > 0) {
            if (this.companyAddressOptions.length == 1) {
              this.selectedAddress = 0;
              this.setAddressValue();
            } else {
              this.openAddressSelectPopup();
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

  convertAddressString(address: any) {
    let newAddressObject: any = {
      address_1: address?.address_1,
      address_2: address?.address_2,
      city: address?.city,
      state: address?.state,
      zip: address?.zip
    }
    let newAddress = this.cleanNullValue(newAddressObject);
    return Object.keys(newAddress).map(function(k){return newAddress[k]}).join(", ");
  }

  cleanNullValue(obj) {
    for (let propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
    return obj
  }

  setAddressValueClicked(id: number) {
    this.selectedAddress = id;
    this.setAddressValue();
  }

  setAddressValueNullClicked() {
    this.showChangeAddress = true;
    this.setAddressValueNull();
  }

  setAddressValue() {
    if (!this.formIndexReset) {
      this.showChangeAddress = false;
      let address = this.companyAddressOptions[this.selectedAddress];
      this.userForm.patchValue({
        'companyAddress1': address?.address_1,
        'companyAddress2': address?.address_2,
        'companyCity': address?.city,
        'companyZip': address?.zip,
        'addressType': 'OLD',
      });
      this.userForm.controls['companyAddress1'].disable();
      this.userForm.controls['companyAddress2'].disable();
      this.userForm.controls['companyCity'].disable();
      this.userForm.controls['companyState'].disable();
      this.userForm.controls['companyZip'].disable();
      this.companyUserStateValue = address?.state;
      this.selectedCompanyAddressId = address?.id;
      this.showAddressPopup = false;
    } else {
      let address = this.companyAddressOptions[this.selectedAddress];
      this.purchaseSeatForm.patchValue({
        'companyAddress1': address?.address_1,
        'companyAddress2': address?.address_2,
        'companyCity': address?.city,
        'companyZip': address?.zip,
        'addressType': 'OLD',
      });
      this.purchaseSeatForm.controls['companyAddress1'].disable();
      this.purchaseSeatForm.controls['companyAddress2'].disable();
      this.purchaseSeatForm.controls['companyCity'].disable();
      this.purchaseSeatForm.controls['companyState'].disable();
      this.purchaseSeatForm.controls['companyZip'].disable();
      this.companyPurchaseStateValue = address?.state;
      this.selectedCompanyAddressId = address?.id;
      this.showAddressPopup = false;
    }
  }

  setAddressValueNull() {
    if (!this.formIndexReset) {
      this.showAddressPopup = false;
      this.selectedAddress = null;
      this.userForm.controls['companyAddress1'].enable();
      this.userForm.controls['companyAddress2'].enable();
      this.userForm.controls['companyCity'].enable();
      this.userForm.controls['companyState'].enable();
      this.userForm.controls['companyZip'].enable();
      this.companyUserStateValue = null;
      this.selectedCompanyAddressId = null;
      this.userForm.patchValue({
        'companyAddress1': '',
        'companyAddress2': '',
        'companyCity': '',
        'companyZip': '',
        'addressType': 'NEW',
      });
    } else {
      this.showAddressPopup = false;
      this.selectedAddress = null;
      this.purchaseSeatForm.controls['companyAddress1'].enable();
      this.purchaseSeatForm.controls['companyAddress2'].enable();
      this.purchaseSeatForm.controls['companyCity'].enable();
      this.purchaseSeatForm.controls['companyState'].enable();
      this.purchaseSeatForm.controls['companyZip'].enable();
      this.companyPurchaseStateValue = null;
      this.selectedCompanyAddressId = null;
      this.purchaseSeatForm.patchValue({
        'companyAddress1': '',
        'companyAddress2': '',
        'companyCity': '',
        'companyZip': '',
        'addressType': 'NEW',
      });
    }
  }

  calculateTotalAmount() {
    let seats: any = this.numberOfSeatsValue ? this.numberOfSeatsValue : this.user_data_map.length;
    return parseInt(seats) * this.trainingData?.birdPrice && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : this.payablePrice;
  }

  updateCartItem() {
    let cartId = localStorage.getItem('marketplaceCartId') || null;
    if (cartId) {
      this.updateCart()
    } else {
      this.userInfoFormSubmitted = false;
      this.showCartUserDetailPopup = true;
    }
  }

  updateCart(params = {}) {
    if (this.cartDomainId && this.trainingDomainId != this.cartDomainId) {
      this.domainSelectPopup = true;
    } else {
      this.cartItemSelect = !this.cartItemSelect
      /* cartId, itemType, id */
      this.commonService.updateCartItem({ cartId: localStorage.getItem('marketplaceCartId'), ...params, itemId: this.trainingId, itemType: 'training' })
    }
  }

  submitUserInfo(){
    this.userInfoFormSubmitted = true;
    if(this.userInfoForm.valid) {
      this.updateCart(this.userInfoForm.value);
      this.showCartUserDetailPopup = false;
    }
  }

  closeUserDetailForm(){
    this.showCartUserDetailPopup = false;
    this.updateCart();
  }
  
}
