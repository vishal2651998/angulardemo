import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef, HostListener, Renderer2, Inject, ViewEncapsulation} from '@angular/core';
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
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {environment} from '../../../../environments/environment';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common/common.service';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-manual-detail',
  templateUrl: './manual-detail.component.html',
  styleUrls: ['./manual-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManualDetailComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  public bodyClass:string = "service-provider-inner-detail";
  public bodyElem;
  public footerElem;
  public userAddLoader = false;
  public buyManualCount = 1;
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
  displayDetailsPopup: boolean = false;
  displayPaymentPopup: boolean = false;
  payablePrice: any;
  paymentSuccessPopup: boolean = false;
  paymentFailurePopup: boolean = false;
  paymentMessage: string = "";
  successData: any;
  threadApiData: any;
  domainId: any;
  manualId: any;
  trainingDomainId: any;
  trainingData: any;
  user: any;
  shippingForm: FormGroup;
  formSubmitted: boolean = false;
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
  nameOfCard: any;
  addressLine1Value: any;
  addressLine2Value: any;
  cityValue: any;
  stateValue: any;
  countryValue: any = "1";
  countryPurchaseValue: any = 1;
  totalAmount = 0;
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
  atgTheme: string = '';
  paymentEmailValue: any;
  paymentPhoneValue: any;
  formTypeValue: string;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  paymentCardResponse: any;
  registrationImageWidth: string;
  registrationImageHeight: string;
  showEmailValidationMsg: any;
  showUserEmailValidationError: any = [];
  showAddressPopup: any = false;
  selectedAddress: any;
  shippingStateDropdownData: any = [];
  shippingUserStateValue: any;
  selectedCompanyAddressId: any;
  showChangeAddress: boolean = false;
  public showRefundPolicy: boolean = false;
  public shippingCost = 0;
  public defaultShippingCost = 0;
  public salesTax = 0;
  public salesTaxPercent = 0;
  public isManualDeleted:boolean = false;
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
    public location:Location,
    private commonService: CommonService,
    @Inject(DOCUMENT) private _document: Document,
    private fb: FormBuilder
  ) {
    this.manualId = this.route.snapshot.params["id"];
    this.trainingDomainId = this.route.snapshot.params["domainId"];
    this.user = this.authenticationService.userValue;

    // if (this.user) {
    //   this.domainId = this.user?.domain_id;
    // }
    this.threadApiData = {
      threadId: this.manualId,
    };
    this.pageLoading = true;
    this.getTrainingDetails();
    if (typeof google === 'object' && typeof google.maps === 'object') {

    } else {
      this.loadMapScript();
    }
    this.shippingForm = this.formBuilder.group({
      'user_data_map': this.formBuilder.array([]),
      'shippingAddress1': ['',[Validators.required]],
      'shippingAddress2': [''],
      'shippingState': ['',[Validators.required]],
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
      'formType': ['MANUAL_USER']
    });
  }

  get shippingFormControl() {
    return this.shippingForm.controls;
  }

  get user_data_map(): FormArray {
    return this.shippingForm.get('user_data_map') as FormArray;
  }


  ngOnInit() {
    const host = window.location.host;
    const subdomain = host.split('.')[0];
    // let subdomain = 'atgtraining-stage';
    if (this.trainingDomainId == 71) {
      this.reparifyDomain = true;
      this.atgTheme = 'atgThemeColor';
    } else {
      this.reparifyDomain = false;
    }
    if (document.getElementById('velox')) {
      document.getElementById('velox').remove();
    }
    const script = this._renderer2.createElement('script');
    script.id = 'velox';
    script.src = 'https://velox.transactiongateway.com/token/Collect.js';
    if (this.reparifyDomain) {
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

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Manual Detail');
    this.loadCountryStateData();
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
    this.loadShippingCost();
    this.commonService.cartProductsList.pipe(distinctUntilChanged()).subscribe((data) => {
      if (data) {
        this.cartDomainId = data?.domainId ;
        if (data?.manualIds?.includes(this.manualId)) {
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

  getSalesTax() {
    if (this.shippingFormControl.shippingAddress1.valid && this.shippingFormControl.shippingCity.valid && this.shippingFormControl.shippingState.valid && this.shippingFormControl.shippingZip.valid) {
      let body: any = {
        address1: this.shippingFormControl.shippingAddress1.value,
        address2: this.shippingFormControl.shippingAddress2.value,
        state: this.shippingFormControl.shippingState.value,
        city: this.shippingFormControl.shippingCity.value,
        zip: this.shippingFormControl.shippingZip.value,
        shippingCost: this.shippingCost,
        price: this.trainingData?.discountPrice ? this.trainingData?.discountPrice : this.payablePrice,
        domainId: this.trainingData.domainID,
        buyManualCount: this.buyManualCount,
      }
      this.shippingCost = this.defaultShippingCost;
      if(this.payablePrice) {
        this.threadApi.apiForManualTax(body).subscribe((response: any) => {
          this.taxResponse = response.data;
          if (response.code == 200) {
            this.shippingTax = response.data?.tax?.breakdown?.shipping?.tax_collectable || 0;
            this.salesTax = (response.data?.tax?.amount_to_collect || 0) - this.shippingTax;
            this.salesTaxPercent = response.data?.tax?.rate ? response.data?.tax?.rate * 100 : 0;
            this.totalAmount = (((this.trainingData?.discountPrice && this.trainingData?.discountPrice != '0') ? this.trainingData?.discountPrice : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingCost + this.shippingTax;
          } else {
            this.shippingTax = 0;
            this.salesTax = 0;
            this.salesTaxPercent = 0;
            this.totalAmount = (((this.trainingData?.discountPrice && this.trainingData?.discountPrice != '0') ? this.trainingData?.discountPrice : this.payablePrice) * this.buyManualCount) + this.shippingCost;
          }
        }, (error: any) => {
          console.error("error: ", error);
        })
      } else {
        this.salesTax = 0;
        this.salesTaxPercent = 0;
      }
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

  toggleBuyManualCount(actionType: string) {
    if(actionType == 'subtract' && this.buyManualCount > 1) this.buyManualCount -= 1;
    else if(actionType == 'add' && this.buyManualCount < 9) this.buyManualCount += 1;
    this.totalAmount = (((this.trainingData?.discountPrice && this.trainingData?.discountPrice != '0') ? this.trainingData?.discountPrice : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingCost + this.shippingTax;
    this.getSalesTax();
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropdownData = response.data.countryData;
        this.stateDropdownData = response.data.stateData;
        this.countryPurchaseDropdownData = response.data.countryData;
        this.statePurchaseDropdownData = response.data.stateData;
        this.shippingStateDropdownData = [];
        response.data?.countryData.forEach((country: any) => {
          let adrObject: any = {
            id: country.name,
            name: country.name,
            items: [],
          }
          response.data?.stateData?.forEach((state: any) => {
              let stateObject: any = {};
              if (state.country_id == country.id) {
                stateObject.id = state.name;
                stateObject.name = state.name;
                adrObject?.items.push(stateObject);
              }
          });
          this.shippingStateDropdownData.push(adrObject);
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

  openPurchasePopup() {
    this.paymentFailurePopup = false;
    this.paymentSuccessPopup = false;
    this.formSubmitted = false;
    this.purchaseFormSubmitted = false;
    this.hidePaymentButton = false;
    this.shippingForm.reset();
    let frmArray = this.shippingForm.get('user_data_map') as FormArray;
    frmArray.clear()
    this.addUsernfo();
    this.countryPurchaseValue = 1;
    this.displayDetailsPopup = true;
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
    this.shippingCost = this.defaultShippingCost;
    this.totalAmount = (((this.trainingData?.discountPrice && this.trainingData?.discountPrice != '0') ? this.trainingData?.discountPrice : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingCost + this.shippingTax;
  }

  resetForm() {
    let formTouched = false;
    setTimeout(() => {
      if(!this.shippingForm.controls.shippingCity.value && !this.shippingForm.controls.shippingZip.value && !this.shippingForm.controls.shippingAddress1.value && !this.shippingForm.controls.shippingAddress2.value && !this.shippingForm.controls.shippingState.value) this.shippingForm.markAsUntouched();
      if (this.shippingForm.touched) {
        formTouched = true;
      } else if(this.shippingForm.value.user_data_map[0].firstName || this.shippingForm.value.user_data_map[0].lastName || this.shippingForm.value.user_data_map[0].email || this.shippingForm.value.user_data_map[0].phoneNumber) {
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
            this.formSubmitted = false;
            this.shippingForm.reset();
            let frmArray = this.shippingForm.get('user_data_map') as FormArray;
            frmArray.clear();
            this.addUsernfo();
            this.purchaseFormSubmitted = false;
          }
        });
      }
      this.setAddressValueNull();
    }, 0);
  }

  checkConfirmPopup() {
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
          this.formSubmitted = false;
          this.shippingForm.reset();
          let frmArray = this.shippingForm.get('user_data_map') as FormArray;
          frmArray.clear();
          this.addUsernfo();
          this.purchaseFormSubmitted = false;
        }
      });
    } else {
      this.displayDetailsPopup = false;
    }
  }

  checkProperties(obj) {
    for (let key in obj) {
      if (key != 'formType' && key != 'country')
        if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined)
            return false;
    }
    return true;
  }

  finishSubmit(response: any) {
    console.log(response)
    let shippingForm = this.shippingForm.value;
    let timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    let stateNewValue = response.state;
    let CountryNewValue = response.country
    let payload = {
      "manualId": this.trainingData.id,
      "userId": this.registerUserId,
      "domainId": this.trainingData.domainID,
      "firstName": response.firstName,
      "lastName": response.lastName,
      "email": shippingForm.email,
      "payment_email": response.payment_email,
      "phoneNumber": response.phoneNumber,
      'address1': response.address1,
      'address2': response.address2,
      'city': response.city,
      'state': stateNewValue,
      'paidPrice': this.totalAmount ? this.totalAmount : 0,
      'country': CountryNewValue,
      'buyManualCount': this.buyManualCount,
      "address": response.address1 +', '+ response.address2 + ', '+ response.city + ', '+ stateNewValue + ', '+ CountryNewValue,
      "zip": response.zip,
      "token": response.token,
      "amount": response.amount,
      "discountPrice": this.trainingData?.discountPrice,
      "discountPercentage": this.trainingData?.discountPercentage,
      "originalPrice": this.trainingData?.price,
      "timeZoneMinutes": timezone_offset_minutes,
      "card":response.card,
      "timeZone": response.timeZone,
      "paymentTime": response.paymentTime,
      "bankName": response.bankName,
      "checkNumber": response.checkNumber,
      "paymentMethod": response.paymentMethod,
      "formType": this.formTypeValue,
      "salesTax": this.salesTax,
      "salesTaxPercent": this.salesTaxPercent,
      "taxResponse": JSON.stringify(this.taxResponse),
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
    this.serviceProviderApi.sendManualPaymentDetail(payload).subscribe((result: any) => {
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
    // this.serviceProviderApi.sendManualPaymentDetailByCheck(payload).subscribe((result: any) => {
    //   this.paymentLoading = false;
    //   if (result.status === "Success") {
    //     this.paymentSuccessPopup = true;
    //     this.paymentMessage = result.message;
    //     this.successData = result.data;
    //   } else {
    //     this.paymentFailurePopup = true;
    //     this.paymentMessage = result.message;
    //   }
    //   this.cd.detectChanges();
    // }, (error: any) => {
    //   this.paymentFailurePopup = true;
    //   this.paymentLoading = false;
    //   this.paymentMessage = error.message;
    // })
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
    if (!event.firstName || !event.lastName || !event.payment_email || !event.phoneNumber || !event.address1  || !event.state || !event.country || !event.zip || !event.city) {
      this.checkValidation();
      this.hidePaymentButton = false;
      this.cd.detectChanges();
      return true;
    }
    this.shippingFormControl.paymentFirstName.setValue(event.firstName);
    this.shippingFormControl.paymentLastName.setValue(event.lastName);
    this.shippingFormControl.paymentEmail.setValue(event.payment_email);
    this.shippingFormControl.paymentPhone.setValue(event.phoneNumber);
    this.shippingFormControl.paymentAddress1.setValue(event.address1);
    this.shippingFormControl.paymentAddress2.setValue(event.address2);
    this.shippingFormControl.paymentCity.setValue(event.city);
    this.shippingFormControl.paymentState.setValue(event.state);
    this.shippingFormControl.paymentCountry.setValue(event.country);
    this.shippingFormControl.paymentZip.setValue(event.zip);
    this.hidePaymentButton = true;
    this.paymentLoading = true;
    this.showPaymentFields = false;
    this.cd.detectChanges();
    this.submitUserDetails();
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
    if (!this.payablePrice && !this.shippingCost && !this.salesTax) {
      this.showPaymentFields = false;
      this.submitUserDetails();
    } else {
      if (this.shippingForm.valid) {
        this.formSubmitted = true;
        this.purchaseFormSubmitted = true;
        let formValue = this.shippingForm.getRawValue();
        this.firstNameValue = formValue.user_data_map[0].firstName;
        this.lastNameValue = formValue.user_data_map[0].lastName;
        this.paymentEmailValue = formValue.user_data_map[0].email;
        this.paymentPhoneValue = formValue.user_data_map[0].phoneNumber;
        this.displayDetailsPopup = false;
        this.displayPaymentPopup = true;
        this.showPaymentFields = true;
      } else {
        this.formSubmitted = true;
      }
    }
  }

  backToFormPopup() {
    this.displayPaymentPopup = false;
    this.displayDetailsPopup = true;
  }

  submitUserDetails() {
    if (this.shippingForm.valid) {
      this.userAddLoader = true;
      this.formSubmitted = false;
      let formValue = this.shippingForm.getRawValue();
      this.loading = true;
      let timezone_offset_minutes: any = new Date().getTimezoneOffset();
      timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
      let stateDataValue = this.stateDropdownData?.filter((state: any) => {
        return state.name == formValue.shippingState;
      });
      let countryDataValue = this.countryDropdownData?.filter((country: any) => {
        return country.id == stateDataValue[0]?.country_id;
      });
      let body: any = {
        user_data_map: formValue.user_data_map,
        shippingAddress1: formValue.shippingAddress1,
        shippingAddress2: formValue.shippingAddress2,
        shippingState: formValue.shippingState,
        shippingCountry: countryDataValue[0]?.name,
        shippingCity: formValue.shippingCity,
        shippingZip: formValue.shippingZip,
        paymentFirstName: formValue.paymentFirstName,
        paymentLastName: formValue.paymentLastName,
        paymentEmail: formValue.paymentEmail,
        paymentPhone: formValue.paymentPhone,
        paymentAddress1: formValue.paymentAddress1,
        paymentAddress2: formValue.paymentAddress2,
        paymentState: formValue.paymentState,
        paymentCity: formValue.paymentCity,
        paymentCountry: formValue.paymentCountry,
        paymentZip: formValue.paymentZip,
        price: this.trainingData?.discountPrice ? this.trainingData?.discountPrice : this.payablePrice,
        domainId: this.trainingDomainId,
        discountPrice: this.trainingData?.discountPrice,
        discountPercentage: this.trainingData?.discountPercentage,
        originalPrice: this.trainingData?.price,
        manualId: this.trainingData.id,
        timeZoneMinutes: timezone_offset_minutes,
        buyManualCount: this.buyManualCount,
        paidPrice: this.totalAmount ? this.totalAmount : 0,
        timeZone: momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
        paymentTime: moment().format('MMM DD, YYYY h:mm A'),
      }
      this.threadApi.userManualSubmitData(body).subscribe((response: any) => {
        if (response.status == "Success") {
          this.registerUserId = response.data;
          this.userAddLoader = false;
          this.formTypeValue = 'MANUAL_USER';
          if (this.payablePrice || this.shippingCost || this.salesTax) {
            this.finishSubmit(this.paymentCardResponse);
          } else {
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
      this.formSubmitted = true;
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
    this.threadApi.apiInnerGetManualEditData(this.threadApiData).subscribe((response) => {
      if (response.status == 'Success') {
        this.trainingData = response.data.marketPlaceData;
        this.trainingData.description = this.threadApi.urlify(this.trainingData.description);

        // this.domainData = response.data.businessDomainData;
        // this.domainurl = 'https://' + this.domainData.subdomainurl + '.collabtic.com/marketplace/detail';
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
        this.openTraining = true;
        this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
        if(!this.payablePrice) {
          this.shippingCost = 0;
          this.shippingTax = 0;
          this.salesTax = 0;
          this.salesTaxPercent = 0;
        } else {
          this.shippingCost = this.defaultShippingCost;
        }
        if (this.trainingData && this.trainingData?.isActive != "1") {
          this.isManualDeleted = true;
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

  goToMarketplace() {
    this.router.navigate(['/marketplace'])
    .then(() => {
      window.location.reload();
    });
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

  setAddressValueNullClicked() {
    this.showChangeAddress = true;
    this.setAddressValueNull();
  }

  setAddressValueNull() {
    this.showAddressPopup = false;
    this.selectedAddress = null;
    this.shippingForm.controls['shippingAddress1'].enable();
    this.shippingForm.controls['shippingAddress2'].enable();
    this.shippingForm.controls['shippingCity'].enable();
    this.shippingForm.controls['shippingState'].enable();
    this.shippingForm.controls['shippingZip'].enable();
    this.shippingUserStateValue = null;
    this.selectedCompanyAddressId = null;
    this.shippingForm.patchValue({
      'shippingAddress1': '',
      'shippingAddress2': '',
      'shippingCity': '',
      'shippingZip': '',
    });
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
      this.commonService.updateCartItem({ cartId: localStorage.getItem('marketplaceCartId'), ...params, itemId: this.manualId, itemType: 'manual' })
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
