import { ChangeDetectorRef, Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ThreadService } from 'src/app/services/thread/thread.service';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import { DomSanitizer } from '@angular/platform-browser';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-payment-controller',
  templateUrl: './payment-controller.component.html',
  styleUrls: ['./payment-controller.component.scss']
})
export class PaymentControllerComponent implements OnInit {
  @Input() payablePrice: any;
  @Input() numberOfCounts: any;
  @Input() hidePaymentButton: boolean = false;
  @Input() countText: any;
  @Input() formValue: any;
  @Input() birdPrice: any;
  @Input() domainId: any;
  @Input() trainingData: any;
  @Input() manualData: any;
  @Input() totalManualAmount: any;
  @Input() buyManualCount: any;
  @Input() manualPayablePrice: any;
  @Input() shipping: any;
  @Input() freeOffer: any;

  @Input() shippingCost: any;
  @Input() shippingTax: any;
  @Input() salesTax: any;
  @Input() salesTaxPercent: any;
  @Input() trainingSalesTax: any;
  @Input() trainingSalesTaxPercent: any;
  @Output() sendPaymentData: EventEmitter<any> = new EventEmitter();
  @Output() sendHidePaymentButtonData: EventEmitter<any> = new EventEmitter();
  @Output() closeEvent: EventEmitter<any> = new EventEmitter();
  @Output() backToFormEvent: EventEmitter<any> = new EventEmitter();
  @Output() closePaymentPopupEvent: EventEmitter<any> = new EventEmitter();
  @Output() refundPolicyShow: EventEmitter<any> = new EventEmitter();
  @Output() paymentPopupEvent: EventEmitter<any> = new EventEmitter();
  @Input() showPaymentFields: any;
  @Input() paymentLoading: any;
  @Input() successData: any;
  @Input() paymentSuccessPopup: boolean;
  @Input() paymentFailurePopup: boolean;
  @Input() isAdmin: boolean = false;
  @Input() paymentMessage: any;
  @Input() manualId: any;
  @Input() alternatePricing = false;
  public sconfig: PerfectScrollbarConfigInterface = {};
  policyContent = "";
  checkNumber: any;
  bankName: any;
  shippingTo: any;
  addressLine1Value: any;
  addressLine2Value: any;
  cityValue: any;
  stateValue: any;
  countryValue: any = "1";
  zipValue: any;
  paymentMethod = "card";
  address = "";
  bounceFee = "";
  firstNameValue: any;
  lastNameValue: any;
  paymentEmailValue: any;
  paymentPhoneValue: any;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  phoneValue: any;
  countryDropdownData: any = [];
  stateDropdownData: any = [];
  paymentCardResponse: any;
  showRefundPolicy: boolean = false;
  fieldsInitalized: boolean = false;
  scrollBarEffect: boolean = true;
  shippingAdress: any = "";

  constructor(
    private cd: ChangeDetectorRef,
    public threadApi: ThreadService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    let data = {
      domainId: this.domainId,
      policyId: 1, // 1 refers to policy type = "refund";
    };
    this.threadApi.apiMarketPlacePolicyData(data).subscribe((res: any) => {
      if(res && res.status == 'Success' && res.policy && res.policy.content) {
        this.policyContent = res.policy.content;
      }
    }, (error: any) => {
      console.log(error);
    })
    // if(this.domainId == 71 && this.isAdmin) this.paymentMethod = "";
    this.loadCountryStateData();
    this.firstNameValue = this.formValue?.user_data_map ? this.formValue?.user_data_map[0]?.firstName : this.formValue?.firstName;
    this.lastNameValue = this.formValue?.user_data_map ? this.formValue?.user_data_map[0]?.lastName : this.formValue?.lastName;
    this.shippingTo = this.shipping?.user_data_map[0].firstName + " " + this.shipping?.user_data_map[0].lastName;
    this.paymentEmailValue = this.formValue?.user_data_map ? this.formValue?.user_data_map[0]?.email : this.formValue?.email;
    this.paymentPhoneValue = this.formValue?.user_data_map ? this.formValue?.user_data_map[0]?.phoneNumber : this.formValue?.phoneNumber;
    this.addressLine1Value = this.formValue?.companyAddress1;
    this.addressLine2Value = this.formValue?.companyAddress2;
    this.cityValue = this.formValue?.companyCity;
    this.zipValue = this.formValue?.companyZip;
    this.shippingAdress = this.shipping?.shippingAddress1  +  (this.shipping?.shippingAddress2 ? ' ' + this.shipping?.shippingAddress2 : '' ) + ', '  + this.shipping?.shippingCity + ', ' + this.shipping?.shippingState + ', '  + this.shipping?.shippingZip;
    this.loadEmailSetting();
  }

  transformHtml(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  loadEmailSetting() {
    this.threadApi.apiForLoadEmailSetting(this.domainId).subscribe((response: any) => {
      if(response.status == 'Success') {
        this.address = response.setting ? response.setting?.address1+(response.setting?.address2?' '+response.setting?.address2:'')+', '+response.setting?.city+', '+(response.setting?.state?response.setting?.state.slice(0, 2).toUpperCase():'')+' '+response.setting?.zip_code:'';
        this.bounceFee = response.setting ? response.setting?.bounce_fee:"0";
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  showRefundPolicyFn() {
    this.showRefundPolicy = true;
    this.refundPolicyShow.emit(true);
  }

  hideRefundPolicy() {
    this.showRefundPolicy = false;
    this.refundPolicyShow.emit(false);
  }

  calculateTotalAmount() {
    return ((this.manualId && this.manualId != '0' && this.buyManualCount != 0) ? parseFloat(this.totalManualAmount) : 0) + (parseInt(this.numberOfCounts) * (this.birdPrice ? parseFloat(this.birdPrice) : parseFloat(this.payablePrice)));
  }

  calculateTrainingTotalAmount() {
    return (parseInt(this.numberOfCounts) * (this.birdPrice ? parseFloat(this.birdPrice) : parseFloat(this.payablePrice)));
  }

  handleSubmit() {
    if ((!this.bankName && this.paymentMethod == 'check') || (!this.checkNumber && this.paymentMethod == 'check') || !this.firstNameValue || !this.lastNameValue || !this.addressLine1Value || !this.cityValue || !this.stateValue || !this.countryValue || !this.zipValue) {
      this.checkValidation();
      return true;
    }
    else if(this.paymentMethod == 'check') window["CollectJS"].startPaymentRequest();
    if(document.getElementById('firstName')) document.getElementById('firstName').style.display = 'none';
    if(document.getElementById('lastName')) document.getElementById('lastName').style.display = 'none';
    if(document.getElementById('paymentEmail')) document.getElementById('paymentEmail').style.display = 'none';
    if(document.getElementById('paymentPhone')) document.getElementById('paymentPhone').style.display = 'none';
    if(document.getElementById('address1')) document.getElementById('address1').style.display = 'none';
    if(document.getElementById('city')) document.getElementById('city').style.display = 'none';
    if(document.getElementById('state')) document.getElementById('state').style.display = 'none';
    if(document.getElementById('country')) document.getElementById('country').style.display = 'none';
    if(document.getElementById('zip')) document.getElementById('zip').style.display = 'none';
    if(document.getElementById('bankName')) document.getElementById('bankName').style.display = 'none';
    if(document.getElementById('checkNumber')) document.getElementById('checkNumber').style.display = 'none';
    this.sendHidePaymentButtonData.emit(true);
    if(this.paymentMethod == 'card') window["CollectJS"].startPaymentRequest();
    else if(this.paymentMethod == 'check') this.paymentByCheckSubmit();
  }

  paymentByCheckSubmit() {
    let response: any = {
      "firstName": this.firstNameValue,
      "lastName": this.lastNameValue,
      "payment_email": this.paymentEmailValue,
      "phoneNumber": this.paymentPhoneValue,
      'address1': this.addressLine1Value,
      'address2': this.addressLine2Value,
      'city': this.cityValue,
      'numberOfSeats': this.numberOfCounts,
      "zip": this.zipValue,
      "token": null,
      "country": this.countryValue,
      "state": this.stateValue,
      "bankName": this.bankName,
      "checkNumber": this.checkNumber,
      "paymentMethod": this.paymentMethod,
      "amount": this.calculateTotalAmount(),
      "card": null,
      "timeZone": moment.tz(moment.tz?.guess()).zoneAbbr(),
      "paymentTime": moment().format('MMM DD, YYYY h:mm A'),
    }
    this.sendPaymentData.emit(response);
  }

  checkValidation() {
    if (this.firstNameValue) {
      document.getElementById('firstName').style.display = 'none';
    } else {
      document.getElementById('firstName').style.display = 'block';
    }
    if (this.lastNameValue) {
      document.getElementById('lastName').style.display = 'none';
    } else {
      document.getElementById('lastName').style.display = 'block';
    }
    if (this.paymentEmailValue) {
      document.getElementById('paymentEmail').style.display = 'none';
    } else {
      document.getElementById('paymentEmail').style.display = 'block';
    }
    if (this.paymentPhoneValue) {
      document.getElementById('paymentPhone').style.display = 'none';
    } else {
      document.getElementById('paymentPhone').style.display = 'block';
    }
    if (this.addressLine1Value) {
      document.getElementById('address1').style.display = 'none';
    } else {
      document.getElementById('address1').style.display = 'block';
    }
    if (this.cityValue) {
      document.getElementById('city').style.display = 'none';
    } else {
      document.getElementById('city').style.display = 'block';
    }
    if (this.stateValue) {
      document.getElementById('state').style.display = 'none';
    } else {
      document.getElementById('state').style.display = 'block';
    }
    if (this.countryValue) {
      document.getElementById('country').style.display = 'none';
    } else {
      document.getElementById('country').style.display = 'block';
    }
    if (this.zipValue) {
      document.getElementById('zip').style.display = 'none';
    } else {
      document.getElementById('zip').style.display = 'block';
    }
    if (this.checkNumber || this.paymentMethod == 'card') {
      document.getElementById('checkNumber').style.display = 'none';
    } else {
      document.getElementById('checkNumber').style.display = 'block';
    }
    if (this.bankName || this.paymentMethod == 'card') {
      document.getElementById('bankName').style.display = 'none';
    } else {
      document.getElementById('bankName').style.display = 'block';
    }
  }

  checkValidtionField(field: any) {
    if (field == 'firstName') {
      if (this.firstNameValue) {
        document.getElementById('firstName').style.display = 'none';
      } else {
        document.getElementById('firstName').style.display = 'block';
      }
    }
    if (field == 'lastName') {
      if (this.lastNameValue) {
        document.getElementById('lastName').style.display = 'none';
      } else {
        document.getElementById('lastName').style.display = 'block';
      }
    }
    if (field == 'email') {
      if (this.paymentEmailValue) {
        document.getElementById('paymentEmail').style.display = 'none';
      } else {
        document.getElementById('paymentEmail').style.display = 'block';
      }
    }
    if (field == 'phone') {
      if (this.paymentPhoneValue) {
        document.getElementById('paymentPhone').style.display = 'none';
      } else {
        document.getElementById('paymentPhone').style.display = 'block';
      }
    }
    if (field == 'address1') {
      if (this.addressLine1Value) {
        document.getElementById('address1').style.display = 'none';
      } else {
        document.getElementById('address1').style.display = 'block';
      }
    }
    if (field == 'city') {
      if (this.cityValue) {
        document.getElementById('city').style.display = 'none';
      } else {
        document.getElementById('city').style.display = 'block';
      }
    }
    if (field == 'state') {
      if (this.stateValue) {
        document.getElementById('state').style.display = 'none';
      } else {
        document.getElementById('state').style.display = 'block';
      }
    }
    if (field == 'country') {
      if (this.countryValue) {
        document.getElementById('country').style.display = 'none';
      } else {
        document.getElementById('country').style.display = 'block';
      }
    }
    if (field == 'zip') {
      if (this.zipValue) {
        document.getElementById('zip').style.display = 'none';
      } else {
        document.getElementById('zip').style.display = 'block';
      }
    }
    if (field == 'checkNumber') {
      if (this.checkNumber) {
        document.getElementById('checkNumber').style.display = 'none';
      } else {
        document.getElementById('checkNumber').style.display = 'block';
      }
    }
    if (field == 'bankName') {
      if (this.bankName) {
        document.getElementById('bankName').style.display = 'none';
      } else {
        document.getElementById('bankName').style.display = 'block';
      }
    }
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropdownData = response.data.countryData;
        this.stateDropdownData = response.data.stateData;
        let stateDataValue = this.stateDropdownData?.filter((state: any) => {
          return state.name == this.formValue?.companyState;
        });
        if (stateDataValue) {
          this.countryValue = stateDataValue[0]?.country_id;
        }
        this.getStatesDropdownData(this.countryValue);
      }
    }, (error: any) => {
    });
  }

  getStatesDropdownData(value: any) {
    this.stateValue = null;
    if (value) {
      this.threadApi.stateMasterData(value).subscribe((response: any) => {
        if (response.status == "Success") {
          this.stateDropdownData = response.data.stateData;
          let stateDataValue = this.stateDropdownData?.filter((state: any) => {
            return state.name == this.formValue?.companyState;
          });
          if (stateDataValue) {
            this.stateValue = stateDataValue[0]?.id;
          }
          console.log("this.stateValue: ", this.stateValue);
        }
      }, (error: any) => {
      })
    } else {
      this.stateDropdownData = [];
    }
  }

  setPaymentMethod(method) {
    if(this.paymentMethod && this.paymentMethod == method) {
      return;
    } else {
      this.paymentMethod = method;
      if(this.paymentMethod == 'card') this.paymentSubmit();
    }
  }

  paymentSubmit() {
    this.fieldsInitalized = true;
    window["CollectJS"]?.configure({
      callback: (result: any) => {
        this.paymentCardResponse = result;
        let response: any = {
          "firstName": this.firstNameValue,
          "lastName": this.lastNameValue,
          "payment_email": this.paymentEmailValue,
          "phoneNumber": this.paymentPhoneValue,
          'address1': this.addressLine1Value,
          'address2': this.addressLine2Value,
          'city': this.cityValue,
          'numberOfSeats': this.numberOfCounts,
          "zip": this.zipValue,
          "token": result.token,
          "country": this.countryValue,
          "state": this.stateValue,
          "bankName": this.bankName,
          "checkNumber": this.checkNumber,
          "paymentMethod": this.paymentMethod,
          "amount": this.calculateTotalAmount(),
          "card":result.card,
          "timeZone": moment.tz(moment.tz?.guess()).zoneAbbr(),
          "paymentTime": moment().format('MMM DD, YYYY h:mm A'),
        }
        this.sendHidePaymentButtonData.emit(true);
        this.sendPaymentData.emit(response)
      },
      "paymentSelector" : "#demoPayButton",
      "variant" : "inline",
      "customCss" : {
          "background-color": "#fff",
          "padding": "15px",
          "border-radius": "2px",
          "width": "100%",
          "max-width": "99%",
          "font-family": "'Lato', sans-serif",
          "font-size": "20px",
          "font-weight": "bold",
          "font-stretch": "normal",
          "font-style": "normal",
          "line-height": "1.1",
          "letter-spacing": "normal",
          "text-align": "left",
          "color": "#000",
          "border": "solid 1px #d3d3d3",
      },
      "invalidCss": {
        "width": "100%",
        "max-width": "99%",
          "color": "black",
          "border": "solid 1px #f00",
      },
      "validCss": {
        "width": "100%",
        "max-width": "99%",
        "color": "black",
        "background-color": "#fff",
      },
      "placeholderCss": {
        "width": "100%",
        "max-width": "99%",
        "background-color": "#fff",
        "font-family": "'Lato', sans-serif",
        "font-size": "14px",
        "font-weight": "bold",
        "font-stretch": "normal",
        "font-style": "normal",
        "line-height": "1.1",
        "letter-spacing": "normal",
        "text-align": "left",
        "color": "#9d9d9d",
      },
      "focusCss": {
        "width": "100%",
        "max-width": "99%",
        "color": "black",
        "background-color": "#fff",
      },
      fields: {
        "ccnumber": {
            "selector": "#ccnumber",
            "title": "Card Number",
            "placeholder": "0000 0000 0000 0000"
        },
        "ccexp": {
            "selector": "#ccexp",
            "title": "Expiry Date",
            "placeholder": "MM/YY"
        },
        "cvv": {
            "display": "hide",
            "selector": "#cvv",
            "title": "CVV",
            "placeholder": "CVV"
        },
      },
      price: this.calculateTotalAmount(),
      "currency":"USD",
      "country": "US",
      'validationCallback' : (function(field, status, message) {
        if (status) {
          if (field === "ccnumber") {
            document.getElementById('cardnumber').style.display = 'none';
          }
          if (field === "ccexp") {
            document.getElementById('expirydate').style.display = 'none';
          }
        } else {
          this.sendHidePaymentButtonData.emit(false);
          if (field === "ccnumber") {
            document.getElementById('cardnumber').style.display = 'block';
          }
          if (field === "ccexp") {
            document.getElementById('expirydate').style.display = 'block';
          }
        }
      }).bind(this),
      "timeoutDuration" : 10000,
      "timeoutCallback" : function () {
      },
      "fieldsAvailableCallback" : function () {
      },
    });
  }
  ngOnChanges() {
    if (this.paymentMethod && this.showPaymentFields) {
      if(!this.fieldsInitalized) {
        this.paymentSubmit();
        this.setDisplayNonePopupStyle();
      }
    }
  }
  setDisplayNonePopupStyle() {
    setTimeout(() => {
      if(document.getElementById('cardnumber')) document.getElementById('cardnumber').style.display = 'none';
      if(document.getElementById('expirydate')) document.getElementById('expirydate').style.display = 'none';
      if(document.getElementById('firstName')) document.getElementById('firstName').style.display = 'none';
      if(document.getElementById('lastName')) document.getElementById('lastName').style.display = 'none';
      if(document.getElementById('paymentEmail')) document.getElementById('paymentEmail').style.display = 'none';
      if(document.getElementById('paymentPhone')) document.getElementById('paymentPhone').style.display = 'none';
      if(document.getElementById('address1')) document.getElementById('address1').style.display = 'none';
      if(document.getElementById('bankName')) document.getElementById('bankName').style.display = 'none';
      if(document.getElementById('checkNumber')) document.getElementById('checkNumber').style.display = 'none';
      if(document.getElementById('city')) document.getElementById('city').style.display = 'none';
      if(document.getElementById('state')) document.getElementById('state').style.display = 'none';
      if(document.getElementById('country')) document.getElementById('country').style.display = 'none';
      if(document.getElementById('zip')) document.getElementById('zip').style.display = 'none';
    }, 200);
  }
  closePopup() {
    this.closeEvent.emit(true);
  }
  backToFormPopup() {
    // if(!this.paymentMethod || !(this.domainId == 71 && this.isAdmin)) this.backToFormEvent.emit(true);
    // else this.paymentMethod = "";
    this.backToFormEvent.emit(true);
  }
  closePaymentPopup() {
    this.closePaymentPopupEvent.emit(true);
  }
  convertIntoInt(amount: any) {
    return parseInt(amount);
  }

  ScrollBarEffect(data : boolean){
    this.scrollBarEffect = data;
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

  tryAgain(){
    // this.paymentFailurePopup = false;
    this.sendHidePaymentButtonData.emit(false);
    this.paymentPopupEvent.emit(true);
    setTimeout(() => {
      this.paymentSubmit();
    }, 1000);
  }
}
