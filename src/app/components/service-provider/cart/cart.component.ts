import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject, DoCheck, ChangeDetectorRef,HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import * as moment from "moment";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ThreadService } from "../../../services/thread/thread.service";
import { ApiService } from '../../../services/api/api.service';
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";
import { CommonService } from "src/app/services/common/common.service";
import { DOCUMENT, Location } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import { ServiceProviderService } from "src/app/services/service-provider/service-provider.service";
import * as momentTimeZone from 'moment-timezone';
import { isEqual } from "lodash";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "Cart";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public bodyClass1: string = "profile";
  public bodyClass2: string = "image-cropper";
  public domainId;
  public userId;
  public bodyHeight: number;
  public innerHeight: number;
  public headerPosTop: boolean = false;
  public headerPosBottom: boolean = false;
  public participantClearPopup: boolean = false;
  public removeTrainingPopup: boolean = false;
  public removeManualPopup: boolean = false;
  public readable:boolean = true;
  public cancelledItem:boolean = false;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public innerWidth: any;

  @ViewChild('top', { static: false }) top: ElementRef;
  cartForm: FormGroup;
  companyForm: FormGroup;
  businessForm: FormGroup;
  selectedInfoType = 'training';
  defaultInfoType = [{
    label: 'Training',
    type: 'training',
    imgSrc: 'assets/images/service-provider/training-title-icon.png',
    imgSrcSelected: 'assets/images/service-provider/sidebar-training-details-white.png',
    isVisible: true,
    disable:false
  }, {
    label: 'Manuals',
    type: 'manuals',
    imgSrc: 'assets/images/service-provider/manual-black.png',
    imgSrcSelected: 'assets/images/service-provider/manual-white.png',
    isVisible: true,
    disable:false

  },
  {
    label: 'Shipping Info',
    type: 'shippingInfo',
    imgSrc: 'assets/images/service-provider/sidebar-shipping.png',
    imgSrcSelected: 'assets/images/service-provider/map-pin-white.png',
    isVisible: true,
    disable:true

  }, {
    label: "Cardholder's info",
    type: 'cardholderDetails',
    imgSrc: 'assets/images/service-provider/cardholder.png',
    imgSrcSelected: 'assets/images/service-provider/cardholder_selection.png',
    isVisible: true,
    disable:true

  },
  {
    label: 'Summary',
    type: 'summary',
    imgSrc: 'assets/images/service-provider/sidebar-payment-summery.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Summary.png',
    isVisible: true,
    disable:true

  },
  {
    label: 'Payment Details',
    type: 'paymentDetails',
    imgSrc: 'assets/images/service-provider/sidebar-payment-details.png',
    imgSrcSelected: 'assets/images/service-provider/Payment-Details.png',
    isVisible: true,
    disable:true

  }];
  infoType;

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
  selectedTrainingIndex: number = -1;
  participantSelectionPopupOff: any = [];
  countryDropdownData: any;
  stateDropdownData: any;
  companyStateDropdownData: any[];
  stateValue: any;
  companyUserStateValue:any;
  companyFormSubmitted: boolean = false;
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
  private el: ElementRef;
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
  businessData: any = [];
  searchAPI: any;
  businessFormSubmitted: boolean;
  businessLoader: boolean;
  businessFormPopup: boolean;
  businessValidation: any;
  participantMobilePopup:boolean = false;
  currParticipantIndex: number = -1;
  mobileParticipantForm: FormGroup;
  mobileParticipantFormSubmitted: boolean;
  currentTrainingName: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  constructor(
    private titleService: Title,
    private router: Router,
    private scrollTopService: ScrollTopService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private api: ApiService,
    private threadApi: ThreadService,
    private httpClient: HttpClient,
    private sanitized: DomSanitizer,
    private fb: FormBuilder,
    public location : Location,
    private commonService: CommonService,
    private _renderer2: Renderer2,
    private serviceProviderApi: ServiceProviderService,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    this.scrollTopService.setScrollTop();
    this.cartForm = this.fb.group({
      'trainings': this.fb.array([]),
      'manuals': this.fb.array([]),
      'grandTotalAmount': 0
    });
    this.mobileParticipantForm = this.fb.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': [''],
      'phoneNumber': [''],
    });
    this.cartForm = this.fb.group({
      'trainings': this.fb.array([]),
      'manuals': this.fb.array([]),
      'grandTotalAmount': 0
    });
    this.companyForm = this.fb.group({
      'phoneNumber': ['', Validators.required],
      'name': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': [''],
      'state': ['', Validators.required],
      'country': [''],
      'city': ['', Validators.required],
      'zip': ['', Validators.required],
      'addressType': 'NEW',
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
    this.domainId = localStorage.getItem('cartDomainId');
    this.getCart(true);
    this.commonService.cartUpdateSubject.subscribe((cart) => this.getCart());
  }

  loadInitialData(){
    this.loadShippingCost();
    this.loadCountryStateData();
    this.setPaymentScript();
    this.threadApi.apiForLoadEmailSetting(this.domainId).subscribe((response)=>{
      this.textMessageData = response.setting ? response.setting?.textMessageTooltip : '';
    })
  }

  setPaymentScript() {
    if (document.getElementById('velox')) {
      document.getElementById('velox').remove();
    }
    const script = this._renderer2.createElement('script');
    script.id = 'velox';
    script.src = 'https://velox.transactiongateway.com/token/Collect.js';
    if (this.domainId == 71) {
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

  getCart(showLoader = false) {
    let cartId = this.cart?.cartId || localStorage.getItem('marketplaceCartId');
    this.showLoader = showLoader;
    if (cartId) {
      this.threadApi.getCart({ cartId: cartId }).pipe(debounceTime(100)).subscribe((resp) => {
        this.setCart(resp.data);
      }, (error) => this.showLoader = false)
    }
    else {
      this.cart = {};
      this.showLoader = false
    }
  }

  changeInfoType(infoType,infoLabel) {
    this.selectedInfoType = infoType;
    if (this.selectedInfoType == "paymentDetails") {
      // this.loadingPaymentDetails = true;
      setTimeout(() => {
        if (this.paymentMethod && this.showPaymentFields) {
          this.paymentSubmit();
          this.setDisplayNonePopupStyle();
          // this.loadingPaymentDetails = false;
        }
      }, 2000)
    }
    if(this.selectedInfoType == 'summary'){
      this.getTaxForItems();
      setTimeout(() => {
        this.slipMemo = {...this.getresponse(),totalManuals: this.totalManuals(), shippingTaxPercent: (this.cart?.manualSalesTaxPercentage || 0) };
      }, 2000);
    }
  }


  goToPreviousTab(tab:string) {
    switch (tab) {
      case "manuals":
        this.selectedInfoType = "training";
        break;

      case "shippingInfo":
          this.selectedInfoType = this.cart.manuals.length == 0 ? "training" : "manuals";
        break;

      case "cardholderDetails":
        if (this.totalManuals().length == 0) {
          this.selectedInfoType = "training";
        } else {
          this.selectedInfoType = "shippingInfo";
        }
        break;

      case "summary":
        this.selectedInfoType = "cardholderDetails";

        break;
      case "paymentDetails":
        this.selectedInfoType = "summary";

        break;
    }
  }

  goToNextTab (tab:string) {
    let noParticipant = this.cart.trainings.find((training, index) => this.participants(index).length == 0);
    switch (tab) {
      case "training":
        if (noParticipant || this.companyForm.invalid || this.cartForm.invalid || this.userForm.invalid) {
          this.companyFormSubmitted = true;
          this.cartFormSubmitted = true;
          this.userFormSubmitted= true;
          this.scrollToFirstError();
        }
        else {
          if (Number(this.getTotalPrice('all', false, false)) == 0 && this.cart.manuals.length == 0) {
            this.selectedInfoType = "summary";
            setTimeout(() => {
              this.slipMemo = {...this.getresponse(),totalManuals: this.totalManuals(), shippingTaxPercent: (this.cart?.manualSalesTaxPercentage || 0)};
            }, 2000);
          }
          else if (this.totalManuals().length == 0) {
            this.selectedInfoType = "cardholderDetails";
          }
          else {
            this.selectedInfoType = this.cart.manuals.length == 0 ? "shippingInfo" : "manuals";
            this.companyFormSubmitted = false;
          }
        }
      break;

      case "manuals":
        if (((noParticipant || this.companyForm.invalid || this.userForm.invalid) && this.cart.trainings.length > 0 ) || this.cartForm.invalid) {
          this.selectedInfoType = "training";
          this.goToNextTab('training')
        }
        else {
          if(((this.companyForm.invalid || this.userForm.invalid) && this.cart.trainings.length == 0) || this.cartForm.invalid) {
            this.userFormSubmitted= true;
            this.companyFormSubmitted = true;
            } else {
              this.selectedInfoType = "shippingInfo";
            }
        }
      break;

      case "shippingInfo":
        if (this.shippingForm.invalid) {
          this.shippingFormSubmitted = true
        }
        else {
          this.selectedInfoType = "cardholderDetails";
          this.shippingFormSubmitted = false;
        }
      break;

      case "CardholderDetails":
        if (this.cardholderForm.invalid) {
          this.cardholderFormSubmitted = true;
        }
        else {
          this.getTaxForItems();
          this.selectedInfoType = "summary";
          this.cardholderFormSubmitted = false;
          setTimeout(() => {
            this.slipMemo = {...this.getresponse(),totalManuals: this.totalManuals(), shippingTaxPercent: (this.cart?.manualSalesTaxPercentage || 0)};
          }, 2000);
        }
      break;

      case "summary":
        this.changeInfoType('paymentDetails','Payment Details')
        break;
    }
    this.sidebarHandler();
  }

  setCart(data) {
    this.cart = {
      cartId: data?.id,
      email: data?.email,
      trainingIds: data?.trainingIds ? data?.trainingIds.split(',') : [],
      manualIds: data?.manualIds ? data?.manualIds.split(',') : [],
      phoneNumber: {
        countryCode: data?.countryCode,
        dialCode: data?.dialCode,
        e164Number: data?.e164Number,
        internationalNumber: data?.internationalNumber,
        phoneNumber: data?.phoneNumber,
      },
      totalAmount: 0,
      manuals: data.manuals,
      trainings: data.trainings,
      cartForm : data.cartForm ? JSON.parse(data.cartForm) : null,
      shippingForm : data.shippingForm ? JSON.parse(data.shippingForm): null,
      companyForm : data.companyForm ? JSON.parse(data.companyForm): null,
      userForm : data.userForm ? JSON.parse(data.userForm): null,
      paymentForm : data.paymentForm ? JSON.parse(data.paymentForm): null,
    };
    this.cart.trainings.map((tr) => {
      if (tr.isManualDiscountPrice == '1' && tr.manual && tr.manual?.price && !['0.00', '0'].includes(tr.manual?.price)) {
        tr.manual.discountPrice = tr.manualDiscountPrice;
        tr.manual.discountPercentage = (((tr.manual.price - tr.manualDiscountPrice) / tr.manual.price) * 100).toFixed(2)
      }
      return tr;
    })
    
    this.infoType = this.defaultInfoType;
    if (data.trainings?.length == 0) {
      this.infoType[0].isVisible = false;
      if (this.selectedInfoType == "training") {
        this.selectedInfoType = "manuals";
      }
    }

    else if (data.trainings?.length > 0) {
      if (!this.domainId || (data.trainings[0].domainID && this.domainId != data.trainings[0].domainID)) {
        this.domainId = data.trainings[0].domainID;
        localStorage.setItem('cartDomainId', this.domainId);
      }
      data.trainings.forEach((training, index) => {
        if(training.isActive != 1){
          this.cancelledItemsList.push({ itemId: training.id, itemType: 'training' })
        }
        /* push training if not pushed from cartForm i.e existed value */
        if (!this.cart?.cartForm?.trainings.map((tr) => tr.trainingId).includes(training.id)) {
          this.cartTrainings.push(this.fb.group({
            trainingId: training.id,
            participants: this.fb.array([]),
            manualCount: 0
          }))
          this.participantSelectionPopupOff.push(false)
        }
        /* push training if value exists in form */
        else {
          let currTraining = this.cart?.cartForm?.trainings.find((tr)=>tr.trainingId == training.id);
          this.cartTrainings.push(this.fb.group({
            trainingId: training.id,
            participants: this.fb.array([]),
            manualCount: currTraining.manualCount || 0
          }));
          if (currTraining?.participants && currTraining.participants.length > 0) currTraining.participants.forEach((pt, pi) => {
            this.participants(this.cartTrainings.controls.length - 1).push(this.fb.group({
              firstName: [pt.firstName, Validators.required],
              lastName: [pt.lastName, Validators.required],
              email: [pt.email],
              phoneNumber: [pt.phoneNumber],
              noDetailsCheck: pt.noDetailsCheck
            }))
            if (training.trainingMode == 'Webinar') {
              this.participants(index)?.at(this.participants(index).length - 1)?.get('email').setValidators([Validators.required, Validators.email])
              this.checkSimilarEmail(index, this.participants(index).length - 1);
            }
            this.onDetailsCheckChange(this.cartTrainings.controls.length - 1, pi, event, pt.noDetailsCheck);
          }
          );
          this.participantSelectionPopupOff.push(false)
        }
      })
      if (this.innerWidth > 960) {
        if (this.cart?.trainings.length > 0 && this.participants(0).controls.length == 0) this.addParticipant(0);
      }
      else {
        if (this.cart?.trainings.length > 0 && this.participants(0).controls.length == 1 && !Object.values(this.participants(0)?.value)?.find(val => val)) this.deleteParticipant(0, 0);
      }
    }

    if (data.manuals?.length == 0) this.infoType[1].isVisible = false;
    else if (data.manuals?.length > 0) {
      if(!this.domainId || (data.manuals[0].domainID && this.domainId != data.manuals[0].domainID)){
        this.domainId = data.manuals[0].domainID;
        localStorage.setItem('cartDomainId', this.domainId);
      }
      data.manuals.forEach((manual) => {
        if(manual.isActive != 1){
          this.cancelledItemsList.push({ itemId: manual.id, itemType: 'manual' })
        }
        /* push manual if not pushed from cartForm i.e existed value */
        if (!this.cart?.cartForm?.manuals.map((manual) => manual.id).includes(manual.id)) {
          this.cartManuals.push(this.fb.group({
            id: manual.id,
            count: 1
          }))
        }
        /* push manual if exists in cartForm */
        else {
          let currManual = this.cart?.cartForm?.manuals.find((ml)=>ml.id == manual.id);
          this.cartManuals.push(this.fb.group({
            id: manual.id,
            count: currManual.count || 1
          }))
        }
      })
    }

    if (this.cart.companyForm) {
      if (this.cart?.companyForm.name) {
        this.businessData = [{ name: this.cart?.companyForm.name, phoneNumber: this.cart?.companyForm.phoneNumber }];
      };
      if (this.cart?.companyForm?.addressType == 'OLD') {
        this.companyForm.controls.name.setValue(this.cart.companyForm.name);
        this.companyForm.controls.phoneNumber.setValue(this.cart.companyForm.phoneNumber);
        this.loadAddressData(this.cart.companyForm.name, this.cart?.companyForm?.selectedAddressId);
      }
      else {
        this.companyForm.patchValue({
          ...this.cart.companyForm
        });
        if (this.cart.companyForm.name && this.cart.companyForm.phoneNumber) {
          this.companyForm.controls.name.setValue(this.cart.companyForm.name);
          this.companyForm.controls.phoneNumber.setValue(this.cart.companyForm.phoneNumber);
        } else {
          this.companyForm.controls.name.reset();
          this.companyForm.controls.phoneNumber.reset();
        }
      }
      this.companyUserStateValue = this.cart.companyForm.state
    }
    if (this.cart.shippingForm) {
      this.shippingForm.patchValue({
        ...this.cart.shippingForm
      });
    }
    if (this.cart.userForm) {
      this.userForm.patchValue({
        ...this.cart.userForm
      });
    }
    if (this.cart.paymentForm) {
      this.cardholderForm.patchValue({
        ...this.cart.paymentForm
      });
    }
    this.showLoader = false;
    if (!(this.cart?.trainings?.length > 0 || this.cart?.manuals?.length > 0)) this.emptyCartPopup = true;
    if(data?.userId) {
      localStorage.removeItem('marketplaceCartId');
      this.cart = null;
    } else {
      localStorage.setItem('marketplaceCartId', this.cart.cartId);
    }
    this.isInitalLoading && this.loadInitialData();
    this.isInitalLoading = false
    if(this.cancelledItemsList.length > 0) {this.cancelledItem = true;}

  }

  get cartTrainings(): FormArray {
    return this.cartForm.get('trainings') as FormArray;
  }

  get cartManuals(): FormArray {
    return this.cartForm.get('manuals') as FormArray;
  }

  get compform() {
    return this.companyForm.controls;
  };

  get shippingInfoForm() {
    return this.shippingForm.controls;
  };

  get cardholderInfoForm() {
    return this.cardholderForm.controls;
  };

  get userFormControl(){
    return this.userForm.controls;
  }

  get businessInfoForm() {
    return this.businessForm.controls;
  };

  cancelTraining(index: number) {
    this.removeTrainingPopup = true;
    this.removeTrainingIndex = index;
  }

  removeTraining() {
    this.removeTrainingPopup = false;
    this.cartTrainings.removeAt(this.removeTrainingIndex);
    const itemId = this.cart.trainings[this.removeTrainingIndex].id;
    this.removeCartItem = { itemId: itemId, itemType: 'training' };
    this.cart.trainings.splice(this.removeTrainingIndex, 1);
    this.cart?.trainingIds.splice(this.cart?.trainingIds?.indexOf(itemId), 1);
    if (this.cart.trainings.length == 0) {
      this.infoType[0].isVisible = false;
      this.selectedInfoType = this.infoType.find((res) => res.isVisible == true).type
    }
    this.removeTrainingIndex = null;
    this.updateCart();
    this.updateCartForm();
  }

  cancelManual(index: number) {
    this.removeManualPopup = true;
    this.removeManualIndex = index;
  }

  removeManual() {
    this.removeManualPopup = false;
    this.cartManuals.removeAt(this.removeManualIndex);
    const itemId = this.cart.manuals[this.removeManualIndex].id;
    this.removeCartItem = { itemId: itemId, itemType: 'manual' };
    this.cart.manuals.splice(this.removeManualIndex, 1);
    this.cart?.manualIds.splice(this.cart?.manualIds?.indexOf(this.cart?.manuals[this.removeManualIndex]?.id), 1);
    if (this.cart.manuals.length == 0) {
      this.infoType[1].isVisible = false;
      this.selectedInfoType = this.infoType.find((res) => res.isVisible == true).type
    }
    this.removeManualIndex = null;
    this.updateCart();
    this.updateCartForm();
  }

  updateCart() {
    // this.showLoader = true;
    this.threadApi.updateCartItemsWithDetails({cartId: this.cart?.cartId,  ...this.removeCartItem}).subscribe((resp: any) => {
      this.setCart(resp?.data);
      this.commonService.cartUpdateSubject.next(resp.data);
    }, (error: any) => {
      console.error("error: ", error);
    });
  }

  updateCartPhone() {
    if (this.updatingPhoneNumber) { clearTimeout(this.updatingPhoneNumber) }
    this.updatingPhoneNumber = setTimeout(() => {
      this.updateCartForm();
      this.updatingPhoneNumber = false;
    }, 2000);
  }

  participants(trainingIndex: number): FormArray {
    return this.cartTrainings.at(trainingIndex)
      .get('participants') as FormArray;
  }

  newParticipant() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      phoneNumber: [''],
      noDetailsCheck: false
    })
  }

  checkSimilarEmail(trainingIndex,participantIndex, fromUser = false) {
    if (this.cart.trainings[trainingIndex].trainingMode == 'Webinar') {
      let index, prevIndex;
      if (this.innerWidth > 960 || fromUser) {
        index = this.participants(trainingIndex)?.value?.findIndex((res, index) => index != participantIndex && res.email == this.participants(trainingIndex)?.at(participantIndex)?.get('email')?.value)
        prevIndex = this.cart.trainings[trainingIndex].registeredUsers?.findIndex((res, index) => res == this.participants(trainingIndex)?.at(participantIndex)?.get('email')?.value)
      }
      else {
        index = this.participants(trainingIndex)?.value?.findIndex((res, index) => index != participantIndex && res.email == this.mobileParticipantForm.get('email').value)
        prevIndex = this.cart.trainings[trainingIndex]?.registeredUsers?.findIndex((res, index) => res == this.mobileParticipantForm.get('email').value)
      }
      if (index != -1 || prevIndex != -1) {
        if (this.innerWidth < 960) {
          this.mobileParticipantForm?.get('email')?.setValue(null);
        }
        this.participants(trainingIndex)?.at(participantIndex)?.get('email')?.setValue(null);
        setTimeout(() => {
          this.customValidator = true;
        }, 100);
      }
      else{
        this.customValidator = false;
      }
    }
  }

  addParticipant(trainingIndex: number) {
    if (trainingIndex != 0 /* && this.participants(trainingIndex).controls.length == 0 */) this.checkPreviousParticipants(trainingIndex)
    else {
      if (this.innerWidth < 960) {
        this.mobileFormSetup(trainingIndex);
      } else {
        this.participants(trainingIndex).push(this.newParticipant());
        if (this.cart.trainings[trainingIndex].trainingMode == 'Webinar') {
          this.participants(trainingIndex)?.at(this.participants(trainingIndex).length - 1)?.get('email').setValidators([Validators.required, Validators.email])
        }
      }
    };
  }

  mobileFormSetup(trainingIndex) {
    this.selectedTrainingIndex = trainingIndex;
    this.currentTrainingName = this.cart.trainings[trainingIndex].trainingName;
    this.participantMobilePopup = true;
    if (this.cart.trainings[trainingIndex]?.trainingMode == 'Webinar') {
      this.mobileParticipantForm.get('email').setValidators([Validators.required, Validators.email]);
      this.mobileParticipantForm.get('email').updateValueAndValidity(); 
    }
  }

  editParticipantMobile(trainingIndex: number, participantIndex = -1) {
    this.currParticipantIndex = participantIndex;
    let currVal = this.participants(trainingIndex).at(participantIndex).value;
    this.mobileParticipantForm.setValue({
      firstName: currVal?.firstName,
      lastName: currVal?.lastName,
      email: currVal?.email,
      phoneNumber: currVal?.phoneNumber,
      // noDetailsCheck: currVal?.noDetailsCheck || false
    })
    this.mobileFormSetup(trainingIndex);
  }

  resetMobileParticipant(){
    this.selectedTrainingIndex = -1;
    this.currParticipantIndex = -1;
    this.participantMobilePopup = false;
    this.mobileParticipantFormSubmitted = false;
    this.mobileParticipantForm.reset();
  }

  addParticipantMobile() {
    this.mobileParticipantFormSubmitted = true;
    let currVal = this.mobileParticipantForm.value;
    if (this.mobileParticipantForm.valid) {
      this.customValidator = false;
      if (this.cart.trainings[this.selectedTrainingIndex].trainingMode == 'Webinar') {
        // this.mobileParticipantForm.get('email').setValidators([Validators.required, Validators.email]);
        let participantIndex = this.participants(this.selectedTrainingIndex)?.length;
        this.checkSimilarEmail(this.selectedTrainingIndex, participantIndex)
      }
      setTimeout(() => {
        if (!this.customValidator && this.mobileParticipantForm.valid) {
          this.participants(this.selectedTrainingIndex).push(this.fb.group({
            firstName: [currVal.firstName, Validators.required],
            lastName: [currVal.lastName, Validators.required],
            email: [currVal.email],
            phoneNumber: [currVal.phoneNumber],
            noDetailsCheck: currVal?.noDetailsCheck || false
          }));
          if(this.cart.trainings[this.selectedTrainingIndex].trainingMode == 'Webinar'){
            this.participants(this.selectedTrainingIndex)?.at(this.participants(this.selectedTrainingIndex).length - 1)?.get('email')?.setValidators([Validators.required, Validators.email]);
            this.participants(this.selectedTrainingIndex)?.at(this.participants(this.selectedTrainingIndex).length - 1)?.get('email')?.updateValueAndValidity(); 
          }
          this.updateCartForm();
          this.savePrevInfo('participantForm',false);
          this.resetMobileParticipant();
        }
      }, 120);
    }
  }

  updateParticipantMobile() {
    this.mobileParticipantFormSubmitted = true;
    let currVal = this.mobileParticipantForm.value;
    if (this.mobileParticipantForm.valid) {
      this.customValidator = false;
      if (this.cart.trainings[this.selectedTrainingIndex].trainingMode == 'Webinar') {
        this.mobileParticipantForm.get('email').setValidators([Validators.required, Validators.email]);
        this.checkSimilarEmail(this.selectedTrainingIndex, this.currParticipantIndex)
      }
      setTimeout(() => {
        if (!this.customValidator && this.mobileParticipantForm.valid) {
          this.participants(this.selectedTrainingIndex)?.at(this.currParticipantIndex)?.setValue({
            firstName: currVal.firstName,
            lastName: currVal.lastName,
            email: currVal.email,
            phoneNumber: currVal.phoneNumber,
            noDetailsCheck: currVal?.noDetailsCheck || false
          });
          if(this.cart.trainings[this.selectedTrainingIndex].trainingMode == 'Webinar'){
            this.participants(this.selectedTrainingIndex)?.at(this.currParticipantIndex)?.get('email')?.setValidators([Validators.required, Validators.email]);
            this.participants(this.selectedTrainingIndex)?.at(this.currParticipantIndex)?.get('email')?.updateValueAndValidity(); 
          }
          // this.participants(this.selectedTrainingIndex).at(this.currParticipantIndex).updateValueAndValidity();
          this.updateCartForm();
          this.savePrevInfo('participantForm',false);
          this.resetMobileParticipant();
        }  
      }, 120);
    }
  }


  deleteParticipant(trainingIndex: number, participantIndex: number) {
    this.removeParticipantIndex = participantIndex;
    this.removeTrainingIndex = trainingIndex;
    let values = this.participants(trainingIndex).at(participantIndex).value;

    if ((Object.values(values).find(x => !(x == null)) || Object.values(values).find(x => !(x == '')))) {
      this.participantClearPopup = true;
    }
    else {
      this.removeParticipant();
    }
  }


  removeParticipant() {
    this.participants(this.removeTrainingIndex).removeAt(this.removeParticipantIndex);
    if (this.participants(this.removeTrainingIndex).length < this.getTrainingManualCount(this.removeTrainingIndex).value) {
      this.getTrainingManualCount(this.removeTrainingIndex).setValue(this.participants(this.removeTrainingIndex).length);
    }
    this.updateCartForm();
    this.participantClearPopup = false;
  }

  onDetailsCheckChange(trainingIndex, participantIndex, event, value = null){
    const participant = this.participants(trainingIndex).at(participantIndex) as FormArray;
    if (value || event?.target?.checked) {
      participant.get('firstName').disable()
      participant.get('lastName').disable()
      participant.get('email').disable()
      participant.get('phoneNumber').disable()
    } else {
      participant.get('firstName').enable()
      participant.get('lastName').enable()
      participant.get('email').enable()
      participant.get('phoneNumber').enable()
    }
    if (value == null) this.updateCartForm();
  }

  getTrainingManualCount(index:number) {
    return this.cartTrainings.at(index).get('manualCount') as FormControl;
  }

  setTrainingManualCount(index: number, action: string) {
    const countControl = this.getTrainingManualCount(index)
    console.log(this.participants(index).length, countControl);
    if (action == "sub" && countControl.value > 0) {
      countControl.setValue(countControl.value - 1)
    }
    if (action == "add" && countControl.value < 9 && countControl.value < this.participants(index).length) {
      countControl.setValue(countControl.value + 1);
    }
    this.updateCartForm();
  }

  getManualCount(index:number) {
    return this.cartManuals.at(index).get('count') as FormControl;
  }

  setmanualCount(manualsIndex: number, action: string) {
    const countControl = this.getManualCount(manualsIndex)
    if (action == "sub" && countControl.value > 1) {
      countControl.setValue(countControl.value - 1)
    }
    if (action == "add" && countControl.value < 9) {
      countControl.setValue(countControl.value + 1);
    }
    this.updateCartForm();
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY hh:MM A');
    } else {
      return '';
    }
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
        this.paymentLoading = false;
        this.cd.detectChanges();
      }
    }, (error: any) => {
      this.paymentLoading = false;
      this.cd.detectChanges();
    });
  }

  addSelectedParticipants() {
    this.filteredParticipants.forEach((item) => {
      if (item?.selected) {
     this.participants(this.selectedTrainingIndex).push(this.fb.group({
          firstName: [item.firstName, Validators.required],
          lastName: [item.lastName, Validators.required],
          email: [item.email],
          phoneNumber: [item.phoneNumber],
          noDetailsCheck: item.noDetailsCheck
        }))
        if (this.cart.trainings[this.selectedTrainingIndex].trainingMode == 'Webinar') {
          this.participants(this.selectedTrainingIndex).at(this.participants(this.selectedTrainingIndex).length - 1).get('email').setValidators([Validators.required, Validators.email])
          this.customValidator = false;
          this.checkSimilarEmail(this.selectedTrainingIndex,this.participants(this.selectedTrainingIndex).length - 1, true)
        }
      }
    })
    this.previousParticipantsPopup = false;
    this.updateCartForm();
  }

  addParticipantsToList(pIndex, event) {
    this.filteredParticipants[pIndex].selected = event.target.checked
  }

  checkPreviousParticipants(trainingIndex) {
    this.selectedTrainingIndex = trainingIndex;
    this.filteredParticipants = [];
    this.cartTrainings.controls.forEach((ts, ti) => {
      if (ti < trainingIndex) this.participants(ti).controls.forEach((ps, index) => {
        if (Object.values(ps.value).find(val => val) && ps.value.noDetailsCheck == false &&
          !(this.filteredParticipants.find(({ selected, ...res }) => isEqual(ps.value, res))) &&
          !this.participants(trainingIndex).controls.find((pt: any) => isEqual(pt.value, ps.value))) {
          this.filteredParticipants.push({ ...ps.value, selected: false });
        }
      })
    })
    if (this.filteredParticipants.length > 0 &&
      !this.participantSelectionPopupOff[trainingIndex]) {
      this.previousParticipantsPopup = true;
    }
    else {
      if (this.innerWidth < 960) {
        this.mobileFormSetup(trainingIndex);
      } else {
        this.participants(trainingIndex).push(this.newParticipant());
        if (this.cart.trainings[trainingIndex].trainingMode == 'Webinar') {
          this.participants(trainingIndex).at(this.participants(trainingIndex).length - 1).get('email').setValidators([Validators.required, Validators.email])
          // this.customValidator = false;
        }
      }
    }
  }

  cancelSelectParticipants(){
    this.previousParticipantsPopup = false;
    if (this.innerWidth < 960) {
      this.mobileFormSetup(this.selectedTrainingIndex);
    } else {
      this.participants(this.selectedTrainingIndex).push(this.newParticipant());
      if (this.cart.trainings[this.selectedTrainingIndex].trainingMode == 'Webinar') {
        this.participants(this.selectedTrainingIndex).at(this.participants(this.selectedTrainingIndex).length - 1).get('email').setValidators([Validators.required, Validators.email])
      }
    }
    // this.participantSelectionPopupOff[this.selectedTrainingIndex] = true;
  }

  loadAddressData(value = this.companyForm.value.name, selectedId = null) {
    if (value) {
      let body: any = {
        domainId: this.domainId,
        companyId: value,
      }
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
      this.threadApi.apiForCompanyAddressAddData(body).subscribe((response: any) => {
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
    this.updateCartForm();
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

  totalManuals() {
    let manuals = [];
    if (this.cart?.trainings) this.cart?.trainings.forEach((tr, index) => {
      if (tr.manual && this.getTrainingManualCount(index).value && this.getTrainingManualCount(index).value != 0) manuals.push({ ...tr.manual, trainingManualInfo: tr?.manualPurchase == '2' ? 'Included Manual with Training' : 'Recomended Manual for Training', count: this.getTrainingManualCount(index).value });
    })
    if (this.cart?.manuals) this.cart?.manuals.forEach((manual, index) => {
      if (this.getManualCount(index).value && this.getManualCount(index).value != 0) {
        manuals.push({ ...manual, count: this.getManualCount(index).value });
      }
    })
    return manuals;
  }

  /**
   * @param type training, manual, all
   */
  getTotalPrice(type, roundOff = false, addDollar = true) {
    let trainingPrice = 0, manualPrice = 0, trainingSalesPrice = 0, manualSalesPrice = 0, manualsShippingCost = 0;
    if (['training','trainingsSales','trainingsSalesWithoutTax','all'].includes(type)) {
      this.cart?.trainings?.forEach((tr, index) => {
        trainingPrice += this.participants(index).controls.length * parseFloat(tr.isBirdPrice == '1' ? tr.birdPrice : tr.price);
      })
      if (this.cart?.trainingSalesTaxPercentage && type != 'trainingsSalesWithoutTax') {
        trainingSalesPrice = trainingPrice * (this.cart?.trainingSalesTaxPercentage / 100);
      }
    }
    if (['manual', 'manualsSales','manualsSalesWithoutTax','all'].includes(type)) {
      this.totalManuals().forEach((manual) => {
        manualPrice += manual.count * parseFloat(manual.isDiscount == '1' ? manual.discountPrice : manual.price);
        if (this.defaultShippingCost) {/* manualsShippingCost += manual.count * parseFloat(this.defaultShippingCost) */this.defaultShippingCost }
      })
      if (this.cart?.manualSalesTaxPercentage && type != 'manualsSalesWithoutTax') {
         manualSalesPrice = manualPrice * (this.cart?.manualSalesTaxPercentage / 100);
         manualsShippingCost = 0;
      }
    }
    if (type == 'trainingsSales') return this.threadApi.isInt(trainingSalesPrice, addDollar, roundOff);
    if (type == 'manualsSales') return this.threadApi.isInt(manualSalesPrice, addDollar, roundOff);
    return this.threadApi.isInt((manualPrice + manualSalesPrice + (this.totalManuals().length > 0 && ['manual', 'all'].includes(type) ? parseFloat(this.defaultShippingCost) + parseFloat(this.cart?.shippingTax || 0) : 0) + trainingPrice + trainingSalesPrice), addDollar, roundOff);
  }

  loadShippingCost() {
    this.threadApi.apiForShippingCost(this.domainId).subscribe((response: any) => {
      if(response.status == 'Success') {
        if(response.setting && response.setting.shippingCost) {
          this.defaultShippingCost = this.threadApi.isInt((Math.round(response.setting.shippingCost * 100) / 100), false);
        }
      }
    }, (error: any) => {
      console.error(error);
    })
  }


  updateCartForm() {
    let body = {
      cartId: this.cart.cartId,
    }
    body['cartForm'] = JSON.stringify(this.cartForm.value );
    let isFormDisabled = this.companyForm.controls['address1'].disabled;
    this.companyForm.enable();
    body['companyForm'] = JSON.stringify({ ...this.companyForm.value, selectedAddressId: this.selectedCompanyAddressId });
    if (isFormDisabled) this.disableCompanyFields();
    body['shippingForm'] = JSON.stringify(this.shippingForm.value);
    if (Object.values(this.userForm.value).find((val: any) => !(['', null].includes(val)))) {
      body['userForm'] = JSON.stringify(this.userForm.value);
    }else{
      body['userForm'] = null;
    }
    body['paymentForm'] = JSON.stringify(this.cardholderForm.value);

    this.threadApi.updateCartFormDetails(body).subscribe((response: any) => {
      if (response.status == 'Success') {
        console.log(response)
      }
    }, (error: any) => {
      console.error(error);
    })
    this.sidebarHandler();
    this.updatingUserPayment = false;
  }

  sidebarHandler() {
    let noParticipant = this.cart.trainings.find((training, index) => this.participants(index).length == 0);
    let pageOneValid = ((this.companyForm.valid && this.userForm.valid && !noParticipant)) && this.cartForm.valid;
    this.defaultInfoType[2].disable = true;
    this.defaultInfoType[3].disable = true;
    this.defaultInfoType[4].disable = true;
    this.defaultInfoType[5].disable = true;
    if (Number(this.getTotalPrice('all', false, false)) == 0) {
      if (pageOneValid) {
        this.defaultInfoType[4].disable = false;
      }
    }
    else {
      if ( pageOneValid  && (this.shippingForm.valid || this.totalManuals().length == 0)) {
        this.defaultInfoType[3].disable = false;
      }
      if (this.cardholderForm.valid && !this.defaultInfoType[3].disable && pageOneValid) {
        this.defaultInfoType[4].disable = false;
        this.defaultInfoType[5].disable = false;
        this.showPaymentFields = true;
      }
      if (pageOneValid) {
        this.defaultInfoType[2].disable = false;
      }
    }
    if(this.totalManuals().length == 0){
      this.defaultInfoType[2].isVisible = false;
    }else{
      this.defaultInfoType[2].isVisible = true;
    }
  }

  disableCompanyFields(){
    this.companyForm.controls['address1'].disable();
    this.companyForm.controls['address2'].disable();
    this.companyForm.controls['city'].disable();
    this.companyForm.controls['state'].disable();
    this.companyForm.controls['country'].disable();
    this.companyForm.controls['zip'].disable();
  }

  setAddressValueNullClicked() {
    this.showChangeAddress = true;
    this.setAddressValueNull();
  }

  getTaxForItems() {
    if (this.cardholderForm.valid) {
      let ctrl = this.cardholderForm.controls;
      let body: any = {
        address1: ctrl.address1.value,
        address2: ctrl.address2.value,
        state: ctrl.state.value,
        city: ctrl.city.value,
        zip: ctrl.zip.value,
        domainId: this.domainId,
        shippingCost: this.defaultShippingCost
      }
      // price: this.manualData?.discountPrice ? this.manualData?.discountPrice : this.manualPayablePrice,
      this.cart.trainings.length > 0 &&  this.threadApi.apiForManualTax({
        ...body, type: 'training', buyManualCount: 0,
        price: 0
      }).subscribe((res) => {
        this.cart.trainingSalesTaxPercentage = this.threadApi.isInt((res.data?.tax?.rate * 100), false);
      })

      this.totalManuals().length > 0 && this.threadApi.apiForManualTax({
        ...body, type: 'manual', buyManualCount: 0, price: 0
      }).subscribe((res) => {
        this.taxResponse = res.data;
        this.cart.manualSalesTaxPercentage = this.threadApi.isInt((res.data?.tax?.rate * 100), false)
        this.cart.shippingTax = this.threadApi.isInt((res.data?.tax?.amount_to_collect || 0), false)
      })
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

  getresponse() {
    let trainings = [];
    let manuals = [];
    this.cart.trainings.forEach((tr, ti) => {
      let noOfSeats = 0;
      let usersList = [];
      let trData = (this.cartForm.value).trainings.find(element => element.trainingId == tr.id);
      trData?.participants?.forEach(({ noDetailsCheck, ...item }) => {
        noOfSeats += 1;
        usersList.push(noDetailsCheck ? {
          email: null,
          firstName: null,
          lastName: null,
          phoneNumber: null
        } : item);
      });
      if (tr.manual) {
        tr.manual.isIncluded = tr?.manualPurchase == '2' ? 1 : 0;
        if (tr?.manualPurchase == '2') {
          tr.manual = {
            ...tr.manual, buyManualCount: noOfSeats, originalPrice: tr.manual.price,
            paidPrice: 0, actualPrice: 0,
            salesTax: 0, salesTaxPercent: 0,
            taxResponse: null, shippingCost: null
          }
        }
        else {
          let paidPrice = tr.isManualDiscountPrice == '1' ? tr.manualDiscountPrice : (tr.manual.discountPrice && tr.manual.discountPrice != '0') ? tr.manual.discountPrice : tr.manual.price;
          let salesTax = this.cart?.manualSalesTaxPercentage ? (Number(trData.manualCount) * (Number(paidPrice) * Number(this.cart?.manualSalesTaxPercentage / 100))) : 0;
          let actualPrice = ((Number(paidPrice) * Number(trData.manualCount)) + Number(this.defaultShippingCost) + Number(salesTax || 0)).toFixed(2);
          tr.manual = {
            ...tr.manual, buyManualCount: trData.manualCount, originalPrice: tr.manual.price,
            paidPrice: paidPrice, actualPrice: actualPrice,
            salesTax: (paidPrice && paidPrice == '0') ? 0 : salesTax, salesTaxPercent: (paidPrice && paidPrice == '0') ? 0 : this.cart?.manualSalesTaxPercentage || 0,
            taxResponse: this.taxResponse, shippingCost: (this.defaultShippingCost || 0)
          }
        }
      }
      let paidPrice = (tr.birdPrice && tr.birdPrice != '0') ? tr.birdPrice : tr.price;
      let salesTax = this.cart?.trainingSalesTaxPercentage ? (noOfSeats * (Number(paidPrice) * Number(this.cart?.trainingSalesTaxPercentage / 100))) : 0;
      let actualPrice = this.cart?.trainingSalesTaxPercentage ? (((Number(paidPrice) * Number(this.cart?.trainingSalesTaxPercentage / 100)) + Number(paidPrice)) * noOfSeats).toFixed(2) : (Number(paidPrice) * noOfSeats).toFixed(2);
      trainings.push({
        ...tr, numberOfSeats: noOfSeats, usersList: usersList, originalPrice: tr.price, paidPrice: paidPrice, actualPrice: actualPrice,
        salesTax: (paidPrice && paidPrice == '0') ? 0 : salesTax, salesTaxPercent: (paidPrice && paidPrice == '0') ? 0 : this.cart?.trainingSalesTaxPercentage || 0,
        taxResponse: this.taxResponse
      });
    })
    this.cart.manuals.forEach((ml, mi) => {
      let mlData = (this.cartForm.value).manuals.find(element => element.id == ml.id);
      if (mlData) {
        let paidPrice = (ml.discountPrice && ml.discountPrice != '0') ? ml.discountPrice : ml.price;
        let salesTax = this.cart?.manualSalesTaxPercentage ? (Number(mlData.count) * (Number(paidPrice) * Number(this.cart?.manualSalesTaxPercentage / 100))) : 0;
        let actualPrice = ((Number(paidPrice) * Number(mlData.count)) + /* Number(this.defaultShippingCost) */ + salesTax).toFixed(2);
        manuals.push({
          ...ml, buyManualCount: mlData.count, originalPrice: ml.price,
          paidPrice: paidPrice, actualPrice: actualPrice,
          salesTax: (paidPrice && paidPrice == '0') ? 0 : salesTax, salesTaxPercent: (paidPrice && paidPrice == '0') ? 0 : this.cart?.manualSalesTaxPercentage || 0,
          taxResponse: this.taxResponse, shippingCost: (this.defaultShippingCost || 0)
        })
      }
    })

    /* getting country */
    let shipFormValue = this.shippingForm.getRawValue();
    let companyFormValue = this.companyForm.getRawValue();
    let paymentFormValue = this.cardholderForm.getRawValue();
    let userFormValue = this.userForm.getRawValue();

    let shippingStateDataValue = this.stateDropdownData?.filter((state: any) => {
      return state.name == shipFormValue.state;
    });
    let shippingCountryDataValue = this.countryDropdownData?.filter((country: any) => {
      return country.id == shippingStateDataValue[0]?.country_id;
    });

    let companyStateDataValue = this.stateDropdownData?.filter((state: any) => {
      return state.name == companyFormValue.state;
    });
    let companyCountryDataValue = this.countryDropdownData?.filter((country: any) => {
      return country.id == companyStateDataValue[0]?.country_id;
    });

    let paymentStateDataValue = this.stateDropdownData?.filter((state: any) => {
      return state.name == paymentFormValue.state;
    });
    let paymentCountryDataValue = this.countryDropdownData?.filter((country: any) => {
      return country.id == paymentStateDataValue[0]?.country_id;
    });

    this.shippingForm.controls.country.setValue(shippingCountryDataValue[0]?.name);
    this.cardholderForm.controls.country.setValue(paymentCountryDataValue[0]?.name);
    this.companyForm.controls.country.setValue(companyCountryDataValue[0]?.name);
    /*  getting countries end*/

    return {
      "cartId": this.cart.cartId,
      /* payment data */
      "policy_url": `${window.location.origin.includes('localhost') ? 'https://forum-dev-collabtic.collabtic.com' : window.location.origin}/marketplace/policy/`,
      "paymentFirstName": paymentFormValue.firstName,
      "paymentLastName": paymentFormValue.lastName,
      "paymentEmail": paymentFormValue.email,
      "paymentPhoneNumber": paymentFormValue.phoneNumber,
      'paymentAddress1': paymentFormValue.address1,
      'paymentAddress2': paymentFormValue.address2,
      'paymentCity': paymentFormValue.city,
      "paymentZip": paymentFormValue.zip,
      "paymentState": paymentFormValue.state,
      "paymentCountry": this.cardholderForm.controls.country.value,
      "paymentAddress": paymentFormValue.address1 + ', ' + paymentFormValue.address2 + ', ' + paymentFormValue.city + ', ' + paymentFormValue.state + ', ' + paymentFormValue.zip,
      'paymentCompanyName':  paymentFormValue.name,
      /* shipping data */
      "shippingFirstName": shipFormValue.firstName,
      "shippingLastName": shipFormValue.lastName,
      "shippingEmail": shipFormValue.email,
      "shippingPhoneNumber": shipFormValue.phoneNumber,
      'shippingAddress1': shipFormValue.address1,
      'shippingAddress2': shipFormValue.address2,
      'shippingCity': shipFormValue.city,
      "shippingZip": shipFormValue.zip,
      "shippingState": shipFormValue.state,
      "shippingCountry": this.shippingForm.controls.country.value,
      'shippingCompanyName':  shipFormValue.name,
      /* company data */
      'companyPhoneNumber':  companyFormValue.phoneNumber,
      'companyName':  companyFormValue.name,
      'companyAddress1': companyFormValue.address1,
      'companyAddress2': companyFormValue.address2,
      'companyCity': companyFormValue.city,
      "companyZip": companyFormValue.zip,
      "companyCountry": this.companyForm.controls.country.value,
      "companyState": companyFormValue.state,
      "companyAddressType": companyFormValue.addressType,
      "companyAddressId": this.selectedCompanyAddressId,
      // user data
      "userFirstName": userFormValue.firstName,
      "userLastName": userFormValue.lastName,
      "userEmail": userFormValue.email,
      "userPhoneNumber": userFormValue.phoneNumber,

      "domainId": this.domainId,
      "amount": this.getTotalPrice('all', false, false),
      // "bankName": this.bankName,
      // "checkNumber": this.checkNumber,
      // "paymentMethod": this.paymentMethod,
      "timeZone": moment.tz(moment.tz?.guess()).zoneAbbr(),
      "paymentTime": moment().format('MMM DD, YYYY h:mm A'),
      "trainingIds": this.cart?.trainingIds.join(','),
      "manualIds": this.cart?.manualIds.join(','),
      "trainings": trainings,
      "trainingSalesTax": this.getTotalPrice('trainingsSales', true, false) || 0,
      "trainingSalesTaxPercentage": this.cart?.trainingSalesTaxPercentage || 0,
      "trainingTotalPrice" :this.getTotalPrice('training', true, false) || 0,
      "manualSalesTax": this.getTotalPrice('manualsSales', true, false) || 0,
      "manualSalesTaxPercentage": this.cart?.manualSalesTaxPercentage || 0,
      "manualTotalPrice" :this.getTotalPrice('manual', true, false) || 0,
      "manualShippingCost": this.totalManuals().length > 0 ? this.defaultShippingCost : 0,
      "shippingTax": this.cart?.shippingTax,
      "manuals": manuals
    }
  }

  paymentSubmit() {
    this.fieldsInitalized = true;
    window["CollectJS"]?.configure({
      callback: (result: any) => {
        this.paymentCardResponse = result;
        let response: any = { ...this.getresponse(), "paymentMethod": this.paymentMethod, "token": result.token, "card_details": result.card, }
        this.hidePaymentButton = true;
        this.submitPaymentData(response);
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
      price: this.getTotalPrice('all'),
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
          this.hidePaymentButton = false;
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

  checkValidtionField(field: any) {
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

  setDisplayNonePopupStyle() {
    setTimeout(() => {
      if (document.getElementById('cardnumber')) document.getElementById('cardnumber').style.display = 'none';
      if (document.getElementById('expirydate')) document.getElementById('expirydate').style.display = 'none';
      if (document.getElementById('bankName')) document.getElementById('bankName').style.display = 'none';
      if (document.getElementById('checkNumber')) document.getElementById('checkNumber').style.display = 'none';
    }, 200);
  }

  handleSubmit() {
    if ((!this.bankName && this.paymentMethod == 'check') || (!this.checkNumber && this.paymentMethod == 'check')) {
      this.checkValidation();
      return true;
    }
    else if(this.paymentMethod == 'check') window["CollectJS"].startPaymentRequest();
    if(document.getElementById('bankName')) document.getElementById('bankName').style.display = 'none';
    if(document.getElementById('checkNumber')) document.getElementById('checkNumber').style.display = 'none';
    this.hidePaymentButton = true
    if (this.paymentMethod == 'card') {
      window["CollectJS"].startPaymentRequest();
      // this.submitByCard(this.getresponse())
      // this.showSuccessPopup = true;
    }
    else if(this.paymentMethod == 'check') this.paymentByCheckSubmit();
  }

  submitByCard(payload) {
    this.serviceProviderApi.sendCartPaymentDetail(payload).subscribe((result: any) => {
      this.paymentLoading = false;
      if (result.status === "Success") {
        this.showSuccessPopup = true;
        this.paymentMessage = result.message;
        this.successData = result.data;
        this.commonService.cartUpdateSubject.next();
      } else {
        this.paymentFailurePopup = true;
        this.paymentMessage = result.message;
        console.log(result)
      }
      this.cd.detectChanges();
    }, (error: any) => {
      this.paymentFailurePopup = true;
      this.paymentLoading = false;
      this.paymentMessage = error.message;
      console.log(error)
      this.cd.detectChanges();
    })
  }

  submitByCheck(payload) {
    this.serviceProviderApi.sendPaymentDetailByCheck(payload).subscribe((result: any) => {
      this.paymentLoading = false;
      if (result.status === "Success") {
        this.showSuccessPopup = true;
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

  registerUser() {
    this.serviceProviderApi.sendCartOrderDetail(this.getresponse()).subscribe((result: any) => {
      this.paymentLoading = false;
      if (result.status === "Success") {
        this.showSuccessPopup = true;
        this.paymentMessage = result.message;
        this.successData = result.data;
        console.log(result)
        this.commonService.cartUpdateSubject.next();
      } else {
        // this.paymentFailurePopup = true;
        // this.paymentMessage = result.message;
        console.log(result)
      }
      this.cd.detectChanges();
    }, (error: any) => {
      // this.paymentFailurePopup = true;
      // this.paymentLoading = false;
      // this.paymentMessage = error.message;
      console.log(error)
    })
  }

  checkValidation() {
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

  paymentByCheckSubmit() {
    let response: any = { ...this.getresponse(), "token": null, "card": null, }
    this.submitPaymentData(response);
    // this.showSuccessPopup = true;
  }

  submitPaymentData(event: any) {
    this.paymentCardResponse = event;
    this.hidePaymentButton = true;
    this.paymentLoading = true;
    this.showPaymentFields = false;
    this.submitUserDetails();
    this.cd.detectChanges();
  }

  submitUserDetails() {
      let timezone_offset_minutes: any = new Date().getTimezoneOffset();
      timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;

      let body: any = {
        ...this.paymentCardResponse,
        companyAddressId: this.selectedCompanyAddressId,
        timeZoneMinutes: timezone_offset_minutes,
        timeZone: momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
        paymentTime: moment().format('MMM DD, YYYY h:mm A'),
      }
      this.finishSubmit(body);
  }

  finishSubmit(response: any) {
    if(response.paymentMethod == 'card') this.submitByCard(response);
    else if(response.paymentMethod == 'check') this.submitByCheck(response);
  }

  tryAgain(){
    this.paymentFailurePopup = false;
    this.hidePaymentButton =false;
    this.selectedInfoType = 'paymentDetails';
    setTimeout(() => {
      this.paymentSubmit();
    }, 1000);
  }

  closePopup(){
    // localStorage.setItem("showRegisterTab", "true");
    location.reload();
    this.showSuccessPopup = false;
    this.displayPaymentPopup = false;
    this.paymentMessage = "";
    this.successData = null;
  }

  savePrevInfo(saveFrom: string, fromFeilds = false) {
    let user = this.userForm?.controls;
    let payment = this.cardholderForm?.controls;
    let ship = this.shippingForm?.controls;
    let company = this.companyForm?.controls;
    let firstParticipant;
    if (this.cart.trainings.length > 0) {
       firstParticipant = this.participants(0)?.at(0);
    }

    if (saveFrom == 'cardholderForm' && payment.sameAsCheck.value) {
      if (this.cart.trainings.length > 0) {
        if (fromFeilds) {
          this.commonValueSetter(payment,user);
            ['name','address1', 'address2', 'state', 'country', 'city', 'zip'].forEach(val => {
              payment[val].setValue(company[val].value);
            })
          }
          else {
            this.commonValueSetter(user,payment)
            this.savePrevInfo('userForm');
          }
      } else {
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

    if (saveFrom == 'userForm' && user.sameAsCheck.value) {
      firstParticipant?.get('email')?.setValue(user.email.value);
      firstParticipant?.get('firstName')?.setValue(user.firstName.value);
      firstParticipant?.get('lastName')?.setValue(user.lastName.value);
      firstParticipant?.get('phoneNumber')?.setValue(user.phoneNumber.value);
      if (this.cart.trainings[0].trainingMode == 'Webinar'){
        this.checkSimilarEmail(0,0, true);
      }
    }

    if (saveFrom == 'userForm' && ship.sameAsCheck?.value) {
      this.commonValueSetter(ship, user);
    }
    if (saveFrom == 'userForm' && payment.sameAsCheck?.value) {
      this.commonValueSetter(payment, user);
    }

    if (saveFrom == 'participantForm' && user.sameAsCheck?.value) {
        let participantValue = this.participants(0)?.at(0)?.value;
        user.firstName.setValue(participantValue?.firstName);
        user.lastName.setValue(participantValue?.lastName);
        user.email.setValue(participantValue?.email);
        user.phoneNumber.setValue(participantValue?.phoneNumber);
        if (ship.sameAsCheck?.value) {
          this.commonValueSetter(ship,user)
        }
        if (payment.sameAsCheck?.value) {
          this.commonValueSetter(payment,user)
        }
    }
  }

  commonValueSetter(to,from) {
    to.firstName.setValue(from.firstName.value);
    to.lastName.setValue(from.lastName.value);
    to.email.setValue(from.email.value);
    to.phoneNumber.setValue(from.phoneNumber.value);
  }

  scrollToFirstError() {
    setTimeout(() => {
      let firstError: any = document.querySelector('.error-msg');
      firstError.scrollIntoView({ block: "center" });
    }, 200);
  }

  continueShopping() {
    console.log(this.cartForm.getRawValue(),
      this.userForm.getRawValue(),
      this.companyForm.getRawValue());

    if (this.cartForm.getRawValue().manuals?.find((res) => res.count > 1) ||
      this.cartForm.getRawValue().trainings?.find((tg) => tg.participants?.find((pt) => Object.values(pt).find((res: any) => !['', null, false].includes(res)))) ||
      (Object.values(this.userForm.getRawValue()).find((res: any) => !(['', null].includes(res)))) ||
      (Object.values(this.companyForm.getRawValue()).find((res: any) => !(['', null, "NEW"].includes(res))))
    ) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'continueShopping';
      modalRef.componentInstance.buttonClass = 'green-button';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.goToMarketPlace();
        }
      })
    }
    else {
      this.goToMarketPlace();
    }
  }

  goToMarketPlace() {
    this.router.navigate(['/marketplace'])
      .then(() => {
        window.location.reload();
      });
  }

  removeCancelledItems() {
    console.log("trigegre");
    if (this.cancelledItem) {
      this.cancelledItemsList.forEach((item, index) => {
        this.threadApi.updateCartItemsWithDetails({ cartId: this.cart?.cartId, ...item }).subscribe((resp: any) => {
          if (index == (this.cancelledItemsList.length - 1)) {
            this.cancelledItemsList = [];
            this.setCart(resp?.data);
            this.commonService.cartUpdateSubject.next(resp.data);
          }
        }, (error: any) => {
          console.error("error: ", error);
        });
        this.cancelledItem = false;
        this.showLoader = true
      }
      )
    }
  }

  setEmailValidator(trainingIndex:any) {
    this.participants(trainingIndex).controls["email"].setValidators([Validators.required, Validators.email]);
  }

  goToPolicy(type, trainingId = null, manualId = null) {
    this.router.navigate([]).then(result => { window.open(`/marketplace/policy/${type}?trainingId=${trainingId}&manualId=${manualId}`, '_blank'); });
  }

 
  getBusinessDetails(type = 'name', event) {
    if (this.searchAPI) { this.searchAPI.unsubscribe(); }
    this.searchAPI = this.threadApi.apiGetBusinessData({
      'domainId': this.domainId || 1,
      'type': type,
      'value': event.filter || ''
    }).subscribe((res) => {
      let filterData = res.data.marketPlaceUsers.filter((res) => res.phoneNumber && res.name && res.name != this.companyForm?.value?.name);
      this.setDefaultAddressList()
      if (event.filter && filterData.length > 0) {
        if (filterData.map(res => res.name).includes(this.companyForm?.value?.name)) {
          this.businessData = filterData;
        } else {
          this.businessData = [...this.businessData, ...filterData];
        }
      }
    });
  }

  setDefaultAddressList() {
    if (this.companyForm?.value?.name) {
      this.businessData = [{ name: this.companyForm?.value?.name, phoneNumber: this.companyForm?.value?.phoneNumber }];
    };
  }

  businessDataName(type) {
    let dataValue = this.businessData.find((data) => data[type] == this.compform[type].value);
    if (dataValue) {
      if (type == 'phoneNumber' && this.companyForm?.value?.phoneNumber && (this.companyForm?.value?.name != dataValue.name)) {
        this.compform?.name.setValue(dataValue.name);
        this.loadAddressData();
        this.updateCartForm();
      } else if (type == 'name' && this.companyForm?.value?.name && (this.companyForm?.value?.phoneNumber != dataValue.phoneNumber)) {
        this.compform?.phoneNumber.setValue(dataValue.phoneNumber);
        this.loadAddressData();
        this.updateCartForm();
      }
    }
    else {
      if (this.companyForm?.value?.phoneNumber && this.companyForm?.value?.name) {
        this.compform?.name.setValue(this.companyForm?.value?.name);
        this.compform?.phoneNumber.setValue(this.companyForm?.value?.phoneNumber);
      }
      this.setDefaultAddressList()
    }
  }
  newBusinessUpdate() {
    if (this.businessForm.invalid || this.businessValidation?.isValid == true) {
      this.businessFormSubmitted = true;
    }
    else {
      this.businessLoader = true;
      let data = this.businessForm.value;
      this.threadApi.updateBusinessNewDetails({ ...data,phoneNumber:data.phoneNumber.number,dialCode:data.phoneNumber.dialCode, domainId: this.domainId }).subscribe((res) => {
        if (res.status == "Success") {
          setTimeout(() => {
            this.businessData.push({ name: data.name, phoneNumber: data.phoneNumber.number })
            this.compform.name.setValue(data.name);
            this.businessDataName("name")
            this.businessFormPopup = false;
            this.businessValidation = null;
          }, 500);
        } else {
          this.businessLoader = false;
          this.businessValidation = {
            message:res.message,
            value:res.data.name,
            isValid:true
          }
        }
      }, (error) => this.businessLoader = false)
    }
  }

  openBusinessNew() {
    this.businessValidation = null;
    this.businessFormSubmitted = false;
    this.businessFormPopup = true;
    this.businessLoader = false;
    this.businessForm.reset()
  }

  checkBusinessValidation() {
    if (this.businessValidation?.value != this.businessForm.value.name) {
      this.businessValidation.isValid = false;
    } else {
      this.businessValidation.isValid = true;
    }
  }

  selectedInfoField() {
    return this.defaultInfoType?.find((info) => info?.type == this.selectedInfoType)?.label
  }

  selectedInfoFieldImage() {
    return this.defaultInfoType?.find((info) => info?.type == this.selectedInfoType)?.imgSrcSelected
  }

  getParticipantmobileValidation(trainingIndex: number, participantIndex: number): string {
    let participant = this.participants(trainingIndex).at(participantIndex);
    let errorKey = ['firstName', 'lastName', 'email', 'phoneNumber'].find((key) => participant.get(key).invalid);
    let title = errorKey == 'firstName' ? 'First Name' : errorKey == 'lastName' ? 'Last Name' : errorKey == 'email' ? 'Email' : 'Phone number';
    return participant.get(errorKey).errors['required'] ? title + ' is required' : 'Enter valid ' + title;
  }
}

