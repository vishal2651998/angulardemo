import {Component, OnInit, ViewChild, HostListener, OnDestroy, ChangeDetectorRef, Renderer2, Inject, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location, DOCUMENT } from '@angular/common';
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { silentItems, pageTitle, Constant } from "src/app/common/constant/constant";
import { GtsService } from "src/app/services/gts/gts.service";
import { MatAccordion } from "@angular/material";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ThreadService } from "src/app/services/thread/thread.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as momentTimeZone from 'moment-timezone';
import { ServiceProviderService } from "src/app/services/service-provider/service-provider.service";
import { PopupComponent } from "src/app/modules/chat/chat-page/popup/popup.component";
import { ApiService } from "src/app/services/api/api.service";
import {environment} from '../../../../environments/environment';
import { ViewPolicyComponent } from '../../common/view-policy/view-policy.component';

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent implements OnInit, OnDestroy {
  @ViewChild("accordion", { static: true }) Accordion: MatAccordion;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public apiKey;
  public domainId;
  public countryId;
  public userId;
  public roleId;
  public trainingId;
  public headerData: any;
  public title = "Training ID#";
  public pageAccess: string = "market-place";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public actionFlag: boolean = true;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public showRefundPolicy: boolean = false;
  transactionData: any;
  transactionPopup: boolean;
  public editRedirect: string;
  public duplicateRedirect: string;
  public platformId;
  public contentType: number = 44;
  public teamSystem = localStorage.getItem('teamSystem');
  public wsplit: boolean = false;
  public bodyClass1: string = "parts";
  public bodyClass2: string = "gts-new";
  public bodyHeight: number;
  public innerHeight: number;
  threadApiData: any;
  public DICVDomain: boolean = false;
  public imagesLoaded: boolean = false;
  copiedModal = false;
  public user: any;
  trainingData: any;
  manualData: any;
  totalRegistered: any;
  images: any = [];
  systemInfo: any;
  zoomWarning: any = false;
  doNotShowAgain: any = false;
  showTrainingDetails: any = true;
  showRegisteredUserDetails: any = true;
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
  paymentCols = ["authcode", "cc_type", "cc_exp","cc_hash", "date", "responsetext", "transactionid", "amount","response_code", "type", "cvvresponse", "avsresponse"];
  paymentColNames = ["Authorization Code", "CC Type", "CC Expiration Date","CC Hash", "Transaction Date", "Response", "Transaction ID", "Amount","Response Code", "Type", "CVV Response", "AVS Response"];

  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  zoomLink: any;
  marketPlaceUserData: any = [];
  marketPlaceData: any;
  totalRegisterUserData: any;
  currentFilter: any = 'ALL';
  innerLoading: boolean = false;
  registerInnerLoading: boolean = false;
  showSettingUserDetails: any = false;
  numberOfDaysOptions: any = [
    {
      name: "1 day",
      id: 1
    },
    {
      name: "2 days",
      id: 2
    },

    {
      name: "3 days",
      id: 3
    },
    {
      name: "4 days",
      id: 4
    },
    {
      name: "5 days",
      id: 5
    },
    {
      name: "6 days",
      id: 6
    },
    {
      name: "7 days",
      id: 7
    },
    {
      name: "8 days",
      id: 8
    },
    {
      name: "9 days",
      id: 9
    },
    {
      name: "10 days",
      id: 10
    }
  ];
  selectedNumberOfDays: any = 1;
  numberOfHoursOptions: any = [
    {
      name: "1 hour",
      id: 1
    },
    {
      name: "2 hours",
      id: 2
    },

    {
      name: "3 hours",
      id: 3
    },
    {
      name: "4 hours",
      id: 4
    },
    {
      name: "5 hours",
      id: 5
    },
    {
      name: "6 hours",
      id: 6
    },
    {
      name: "7 hours",
      id: 7
    },
    {
      name: "8 hours",
      id: 8
    },
    {
      name: "9 hours",
      id: 9
    },
    {
      name: "10 hours",
      id: 10
    }
  ];
  selectedNumberOfHours: any = 5;
  numberOfMinutesOptions: any = [
    {
      name: "1 minute",
      id: 1
    },
    {
      name: "2 minutes",
      id: 2
    },

    {
      name: "3 minutes",
      id: 3
    },
    {
      name: "4 minutes",
      id: 4
    },
    {
      name: "5 minutes",
      id: 5
    },
    {
      name: "6 minutes",
      id: 6
    },
    {
      name: "7 minutes",
      id: 7
    },
    {
      name: "8 minutes",
      id: 8
    },
    {
      name: "9 minutes",
      id: 9
    },
    {
      name: "10 minutes",
      id: 10
    }
  ];
  selectedNumberOfMinutes: any = 10;
  reminderOneOnOff: number = 0;
  reminderTwoOnOff: number = 0;
  reminderThreeOnOff: number = 0;
  currentUserData: any;
  showEditUserDetailPopup: boolean = false;
  userInfoForm: FormGroup;
  countryDropDownOptions: any;
  stateDropDownOptions: any;
  countryValue: any;
  phoneValue: any;
  phonePurchaseValue: any;
  userInfoFormSubmitted = false;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  stateValue: any;
  isEdit: any = false;
  showPaymentUserDetailPopup: any = false
  currentUserPaymentData: any;
  progressbarCount: any = '0';
  public exportDataFlag;
  public downloadtextflag='Exporting data to Excel..';
  public excelreportdiaLog: boolean = false;
  public exceldownloadtrue:boolean= false;
  public stopexportapi:boolean= true;
  public itemOffset: number = 0;
  public itemLimit: number = 20;
  public usersExportData: any = [];
  public itemTotal: number = 0;
  public itemOffsetinitiate:boolean= false;
  public itemLength: number = 0;
  usersDataHeader: any = [
    "Customer Name",
    "Email",
    "Company Name",
    "Phone Number",
    "Address",
    "Registered date/time",
    "Training Price",
    "Status"
  ]
  userForm: FormGroup;
  purchaseSeatForm: FormGroup;
  formSubmitted: boolean = false;
  purchaseFormSubmitted: boolean = false;
  paymentLoading: any = false;
  showPaymentFields: any = false;
  hidePaymentButton: any = false;
  registerUserId: any;
  numberOfSeatsValue: any;
  companyName: any;
  formTypeValue: string;
  paymentCardResponse: any;
  displayRegisterPopup: boolean = false;
  displayPaymentPopup: boolean = false;
  payablePrice: any;
  paymentSuccessPopup: boolean = false;
  paymentFailurePopup: boolean = false;
  paymentMessage: string = "";
  formIndexReset: any = 0;
  registerFormType: any = true;
  countryPurchaseValue: any;
  countryDropdownData: any = [];
  stateDropdownData: any = [];
  successData: any;
  public userAddLoader = false;
  pendingUsersToRegister: any;
  displayViewModal: any = false;
  userCurrentData: any;
  showSalesPersonPopup: any = false
  salesPersonData: any;
  workStreamId: any;
  baseApiUrl: any;
  isUpdateSalesPerson: any = false;
  currentUser: any;
  selectedUser: any;
  selectedSalesPersonId: any;
  showMarketingMenu: any;
  showSalesMenu: any;
  scrollTop: any;
  lastScrollTop: any;
  scrollInit: any;
  salesTotalRecords: any;
  salesData: any = [];
  loadingSalesmore: any = false;
  dataOffset: any;
  dataLimit: any;
  currentExpandedIndex: any = [];
  displayPricingPopup: any = false;
  alternatePricing: any = false;
  birdValue: any;
  birdPercentage: any;
  disableBirdValue: any = false;
  showBirdPriceValidation: boolean = false;
  showBirdPercentageValidation: boolean = false;
  freeOffer: any = false;
  pricingForm: FormGroup;
  pricingFormSubmitted: any = false;
  backAvailable: any = true;
  showEmailValidationMsg: any;
  showUserEmailValidationError: any = [];
  showParticipantsMenu: any = false;
  registrantsData: any = [];
  warningPopup: any = false;
  companyOptions: any = [];
  companyRegisterValue: any;
  companyActionFlag: boolean = false;
  companyAddSubmitted: boolean = false;
  showCompanyAddError: boolean = false;
  companyPhoneValue: any;
  companyAddFrom: FormGroup;
  companyAddFromSubmitted: any = false;
  companyStateDropdownData: any = [];
  companyRegisterPurchaseValue: any;
  companyUserValue: any;
  companyAddressOptions: any = [];
  companyPurchaseValue: any;
  selectedAddress: any;
  companyUserStateValue: any;
  companyPurchaseStateValue: any;
  selectedCompanyAddressId: any;
  showAddressPopup: any;
  multipleAddressAvailable: any;
  showChangeAddress: boolean = false;
  public buyManualCount = 0;
  public taxResponse = null;
  displayDetailsPopup: boolean = false;
  manualPayablePrice: any;
  manualId: any;
  shippingForm: FormGroup;
  shippingFormSubmitted: boolean = false;
  domainData: any;
  domainurl: any;
  loading: any = false;
  paymentMethod: any = false;
  registrationImage: any;
  dynamicHeight: any;
  nameOfCard: any;
  addressLine1Value: any;
  addressLine2Value: any;
  cityValue: any;
  totalManualAmount = 0;
  zipValue: any;
  firstNameValue: any;
  lastNameValue: any;
  defaultDynamicHeight: any;
  pageLoading: boolean = false;
  countryPurchaseDropdownData: any = [];
  statePurchaseDropdownData: any = [];
  reparifyDomain: boolean = false;
  numberOfSeatsDropdownData: any = [];
  paymentEmailValue: any;
  paymentPhoneValue: any;
  registrationImageWidth: string;
  registrationImageHeight: string;
  shippingUserStateValue: any;
  public shippingCost = 0;
  public defaultShippingCost = 0;
  public salesTax = 0;
  public salesTaxPercent = 0;
  public trainingSalesTax = 0;
  public trainingSalesTaxPercent = 0;
  shippingCostDialog: boolean;
  customShippingCost: number;
  addCommentPopup = false;
  editCommentValue: string = '';
  actualDiscountPrice: any;
  actualDiscountPercentage: any;
  shippingTax = 0;
  commonParticipants: any[] = [];
  highlighted:any;
  cartItemSelect: boolean = false;
  showCartUserPopup:boolean = false
  cartId: any = null;
  cartUserId: any;
  trainingIds: any;
  cartUpdatedMessage: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (
        inHeight >= totalHeight &&
        parseInt(this.salesTotalRecords) > this.salesData.length
      ) {
        this.loadingSalesmore = true;
        this.dataOffset += this.dataLimit;
        this.openSalesTab();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private scrollTopService: ScrollTopService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public threadApi: ThreadService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private serviceProviderApi: ServiceProviderService,
    private apiUrl: ApiService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  get userInfoFormControl() {
    return this.userInfoForm.controls;
  }

  get userFormControl() {
    return this.userForm.controls;
  }

  get pricingFormControl() {
    return this.pricingForm.controls;
  }

  get purchaseSeatFormControl() {
    return this.purchaseSeatForm.controls;
  }

  get companyAddFormControl() {
    return this.companyAddFrom.controls;
  }

  get user_data_map(): FormArray {
    return this.userForm.get('user_data_map') as FormArray;
  }

  setPaymentScript() {
    this.domainId = localStorage.getItem('domainId');
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

  ngOnInit() {
    this.setPaymentScript();
    this.imagesLoaded = false;
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass2);
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    this.scrollTopService.setScrollTop();
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.userId = localStorage.getItem("userId");
    this.roleId = localStorage.getItem("roleId");
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
        (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    this.userInfoForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'address1': ['', [Validators.required]],
      'address2': [''],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'country': ['', [Validators.required]],
      'zipCode': ['', [Validators.required]]
    });
    this.userForm = this.fb.group({
      'user_data_map': this.fb.array([]),
      'companyName': ['',[Validators.required]],
      'companyAddress1': ['',[Validators.required]],
      'companyAddress2': [''],
      'companyState': ['',[Validators.required]],
      'companyCity': ['',[Validators.required]],
      'companyZip': ['',[Validators.required]],
      'addressType': ['NEW'],
      'numberOfSeats': ['1']
    });
    this.pricingForm = this.fb.group({
      'birdPrice': [''],
      'birdPercentage': ['']
    });
    this.purchaseSeatForm = this.fb.group({
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
      'companyName': ['',[Validators.required]],
      'companyAddress1': ['',[Validators.required]],
      'companyAddress2': [''],
      'companyState': ['',[Validators.required]],
      'companyCity': ['',[Validators.required]],
      'companyZip': ['',[Validators.required]],
      'addressType': ['NEW'],
      'numberOfSeats': ['', [Validators.required]],
      'formType': ['PURCHASE_SEAT']
    });
    this.companyAddFrom = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.email]],
      'phoneNumber': [''],
      'address1': [''],
      'address2': [''],
      'city': [''],
      'state': [''],
      'zip': [''],
      'customerId': [''],
    })
    this.shippingForm = this.fb.group({
      'user_data_map': this.fb.array([]),
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
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
    this.ship_data_map.insert(this.ship_data_map.length,this.createEmptyManualItem());
    this.loadShippingCost();
    if (authFlag) {
      this.trainingId = this.route.snapshot.params["id"];
      this.editRedirect = `market-place/manage/edit/${this.trainingId}`;
      this.duplicateRedirect = `market-place/manage/duplicate/${this.trainingId}`;
      this.apiKey = "dG9wZml4MTIz";

      this.title = `${this.title}${this.trainingId}`;
      this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title);

      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      this.threadApiData = {
        access: this.pageAccess,
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        threadId: this.trainingId,
        platform: this.platformId,
        apiType: 1,
      };
      this.currentUser = {
        userId: this.user.Userid,
        isSelected: 1,
        isMemberSelected: true,
        userName: this.user.Username,
        availability: 1,
        badgeTopUser: 0,
        supportReadiness: 0,
        profileImg: localStorage.getItem('userProfile'),
        title: localStorage.getItem('userRole')
      };
      this.getWorkStreamData();
      this.getTrainingDetails();
      this.loadCompanyData();
      if (localStorage.getItem("showRegisterTab")) {
        this.showRegisteredDetail();
      }
      this.loadCountryStateData();
      setTimeout(() => {
        this.setScreenHeight();
      }, 1500);
    } else {
      this.router.navigate(["/forbidden"]);
    }
    this.getCart();
    this.commonApi.cartUpdateSubject.subscribe((cart) => this.getCart(cart ? true : false));
  }

  get shippingFormControl() {
    return this.shippingForm.controls;
  }

  get ship_data_map(): FormArray {
    return this.shippingForm.get('user_data_map') as FormArray;
  }

  backToRegisterPopup() {
    this.shippingFormSubmitted = false;
    this.displayDetailsPopup = false;
    this.displayRegisterPopup = true;
  }

  removeUserInfo(index: any) {
    let userData = this.user_data_map.value;
    if (this.checkPropertiesForForm(userData[index])){
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

  loadShippingCost() {
    this.threadApi.apiForShippingCost(this.domainId).subscribe((response: any) => {
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
        shippingCost: this.shippingCost,
        price: this.manualData?.discountPrice ? this.manualData?.discountPrice : this.manualPayablePrice,
        domainId: this.manualData.domainID,
        buyManualCount: this.buyManualCount,
        type: 'manual',
      }
      if(this.manualPayablePrice && this.buyManualCount) {
        this.shippingCost = (this.customShippingCost || this.customShippingCost == 0) && this.buyManualCount > 0 ? this.customShippingCost : this.defaultShippingCost;
        this.threadApi.apiForManualTax(body).subscribe((response: any) => {
          this.taxResponse = response.data;
          if (response.code == 200) {
            this.shippingTax = response.data?.tax?.breakdown?.shipping?.tax_collectable || 0;
            this.salesTax = response.data?.tax?.amount_to_collect || 0 - this.shippingTax;
            this.salesTaxPercent = response.data?.tax?.rate ? response.data?.tax?.rate * 100 : 0;
            this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
          } else {
            this.shippingTax = 0;
            this.salesTax = 0;
            this.salesTaxPercent = 0;
            this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.shippingCost;
          }
        }, (error: any) => {
          this.shippingTax = 0;
          this.salesTax = 0;
          this.salesTaxPercent = 0;
          this.totalManualAmount = (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.shippingCost;
        })
      } else {
        if (this.buyManualCount == 0) { this.shippingCost = 0; this.customShippingCost = this.defaultShippingCost }
        else this.shippingCost = (this.customShippingCost || this.customShippingCost == 0) ? this.customShippingCost : this.defaultShippingCost;
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
        shippingCost: this.shippingCost,
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

  addUsernfo() {
    this.showUserEmailValidationError.push('');
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
  }

  addShipUsernfo() {
    this.showUserEmailValidationError.push('');
    this.ship_data_map.insert(this.ship_data_map.length,this.createEmptyManualItem());
  }

  createEmptyItem(): FormGroup {
    return this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'formType': ['REGISTER_USER']
    });
  }

  createEmptyManualItem(): FormGroup {
    return this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phoneNumber': ['', [Validators.required]],
      'formType': ['MANUAL_USER']
    });
  }

  toggleBuyManualCount(actionType: string) {
    if (actionType == 'add' && this.buyManualCount == 0) this.shippingCost = this.defaultShippingCost;
    if(actionType == 'subtract' && this.buyManualCount >= 1) this.buyManualCount -= 1;
    else if(actionType == 'add' && this.buyManualCount < 9) this.buyManualCount += 1;
    this.totalManualAmount = this.buyManualCount == 0 ? 0 : (((this.manualData?.discountPrice && this.manualData?.discountPrice != '0') ? this.manualData?.discountPrice : this.manualPayablePrice) * this.buyManualCount) + this.salesTax  + this.shippingTax + this.shippingCost;
    this.getSalesTax();
  }

  checkPropertiesForForm(obj) {
    for (let key in obj) {
      if (key != 'formType' && key != 'country' && key != 'addressType')
        if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined)
            return false;
    }
    return true;
  }

  openWarningPopup() {
    console.log("this.trainingData?.isClosed: ", this.trainingData?.isClosed);
    if (this.trainingData?.isClosed && this.trainingData?.isClosed != '0') {
      this.warningPopup = true;
    } else {
      this.openRegisterPopup();
    }
  }

  openRegisterPopup() {
    this.warningPopup = false;
    this.showSalesPersonPopup = true;
    this.isUpdateSalesPerson = false;
  }

  updateSalesPersonData(userData: any) {
    this.selectedUser = userData;
    this.selectedSalesPersonId = userData.isSalePerson;
    this.showSalesPersonPopup = true;
    this.isUpdateSalesPerson = true;
  }

  showExpandedValues(i) {
    this.currentExpandedIndex.push(i);
  }

  hideExpandedValues(i) {
    this.currentExpandedIndex = this.currentExpandedIndex.filter((index: any) => index != i);
  }

  getWorkStreamData() {
    let apiUrl = `${this.baseApiUrl}/forum/GetworkstreamsList`;
    const apiData: any = new FormData();
    apiData.append("apiKey", this.apiKey);
    apiData.append("domainId", this.domainId);
    apiData.append("countryId", this.countryId);
    apiData.append("userId", this.userId);
    apiData.append("type", 3);
    apiData.append("contentTypeId", 34);
    this.commonApi.apiCall(apiUrl, apiData).subscribe((response) => {
      if (response.workstreamList) {
        let workStreamTrainingData  = response.workstreamList.find(x => (x.name == 'Training'));
        if (workStreamTrainingData) {
          this.workStreamId = workStreamTrainingData.id;
        } else {
          this.workStreamId = 542;
        }
      }
    }, (error: any) => {

    })
  }

  getUserData(event: any) {
    if(event) {
      this.salesPersonData = event[0];
      if (this.isUpdateSalesPerson) {
        this.updateSalesPerson();
      } else {
        // if (this.payablePrice && this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0') {
        if (this.payablePrice && this.trainingData?.price && this.trainingData?.price != '0') {
          this.backAvailable = true;
          this.alternatePricing = false;
          this.freeOffer = false;
          this.disableBirdValue = true;
          this.pricingForm.reset();
          this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
          this.showPricingPopup();
        } else {
          this.backAvailable = false;
          this.registerPopup();
        }
      }
      this.showSalesPersonPopup = false;
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

  checkAvailablity(date: any, time: any) {
    let onlyTime = this.getHourFormat(time);
    let dateTime = date+' '+onlyTime;
    let currentDate: any = new Date();
    let checkDate: any = new Date(dateTime);
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }

  showPricingPopup() {
    this.displayPricingPopup = true;
  }

  calculatePercentageValue(value: any) {
    if (value) {
      let percentageValue = parseFloat(value);
      return 100 - percentageValue;
    } else {
      return 0;
    }
  }

  closeSalePersonPopup() {
    this.showSalesPersonPopup = false;
    this.salesPersonData = null;
    this.alternatePricing = false;
    this.freeOffer = false;
    this.disableBirdValue = true;
    this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
  }

  backToSaleSelect() {
    this.showSalesPersonPopup = true;
    this.displayRegisterPopup = false;
    this.alternatePricing = false;
    this.freeOffer = false;
    this.disableBirdValue = true;
    this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
  }

  backToPricingForm() {
    this.displayPricingPopup = true;
    this.displayRegisterPopup = false;
  }

  updateSalesPerson() {
    let body: any = {
      salesPersonId: this.salesPersonData?.userId,
      id: this.selectedUser?.id
    }
    // if (this.selectedUser?.selfRegistered == '1') body['comment'] = this.editCommentValue;
    this.threadApi.apiForUpdateSalesPerson(body).subscribe((response: any) => {
      if (response.status == 'Success') {
      //   const msgModalRef = this.modalService.open(
      //     SuccessModalComponent,
      //     this.config
      //   );
      //   msgModalRef.componentInstance.successMessage = response.message;
      //   setTimeout(() => {
            this.showRegisteredDetail();
      //     msgModalRef.dismiss("Cross click");
      //   }, 2000);
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  updateComment() {
    let body: any = {
      id: this.selectedUser?.id,
      comment: this.editCommentValue
    }
    this.threadApi.apiForUpdateComment(body).subscribe((response: any) => {
       if (response.status == 'Success') {
        // const msgModalRef = this.modalService.open(
        //   SuccessModalComponent,
        //   this.config
        // );
        // msgModalRef.componentInstance.successMessage = response.message;
        // setTimeout(() => {
        //   msgModalRef.dismiss("Cross click");
          this.showRegisteredDetail();
        // }, 2000);
        }
    }, (error: any) => {
      console.error(error);
    })
    this.editCommentValue = ''
  }

  registerPopup() {
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
    this.purchaseSeatForm = this.fb.group({
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
      'companyName': ['',[Validators.required]],
      'companyAddress1': ['',[Validators.required]],
      'companyAddress2': [''],
      'companyState': ['',[Validators.required]],
      'companyCity': ['',[Validators.required]],
      'companyZip': ['',[Validators.required]],
      'addressType': ['NEW'],
      'numberOfSeats': ['', [Validators.required]],
      'formType': ['PURCHASE_SEAT']
    });
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
    this.shippingForm.reset();
    let frmArray2 = this.shippingForm.get('user_data_map') as FormArray;
    frmArray2.clear()
    this.addShipUsernfo();
  }

  openShippingPopup() {
    this.setCompanyValidations();
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

  getPurchaseStatesDropdownData(value: any) {
    this.purchaseSeatForm.patchValue({
      state: null,
    })
    if (value) {
      this.threadApi.stateMasterData(value).subscribe((response: any) => {
        if (response.status == "Success") {
          this.stateDropdownData = response.data.stateData;
        }
      }, (error: any) => {
      })
    } else {
      this.stateDropdownData = [];
    }
  }

  closePricingPopup() {
    this.pricingForm.reset();
    this.alternatePricing = false;
    this.freeOffer = false;
    this.disableBirdValue = true;
    this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
    this.displayPricingPopup = false;
  }

  checkConfirmPopup() {
    let formTouched = false;
    if (this.formIndexReset == 0) {
      let userData = this.userForm.value;
      if (userData.user_data_map.length == 1 && this.checkPropertiesForForm(userData.user_data_map[0]) && !(userData.companyName === null && userData.companyName === "" && userData.companyName === undefined)) {
        formTouched = false;
      } else {
        formTouched = true;
      }
    } else {
      if (this.checkPropertiesForForm(this.purchaseSeatForm.value)) {
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
          this.alternatePricing = false;
          this.freeOffer = false;
          this.disableBirdValue = true;
          this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
          this.displayRegisterPopup = false;
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
      this.alternatePricing = false;
      this.freeOffer = false;
      this.disableBirdValue = true;
      this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
      this.displayRegisterPopup = false;
    }
  }

  checkManualConfirmPopup() {
    let formTouched = false;
    let userData = this.shippingForm.value;
    if (userData.user_data_map.length == 1 && this.checkPropertiesForForm(userData.user_data_map[0])) {
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
        if (this.checkPropertiesForForm(this.purchaseSeatForm.value)) {
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
            // console.log('this.formIndexReset: ', this.formIndexReset);
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

  closePopup() {
    localStorage.setItem("showRegisterTab", "true");
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
        this.alternatePricing = false;
        this.freeOffer = false;
        this.disableBirdValue = true;
        this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
        this.successData = null;
      }
    });
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
      'country': CountryNewValue,
      'numberOfSeats': response.numberOfSeats,
      'numberOfManuals': this.buyManualCount,
      "address": response.address1 +', '+ response.address2 + ', '+ response.city + ', '+ stateNewValue + ', '+ CountryNewValue,
      "zip": response.zip,
      "token": response.token,
      "amount": response.amount,
      "bankName": response.bankName,
      "checkNumber": response.checkNumber,
      "paymentMethod": response.paymentMethod,
      "paidPrice": this.payablePrice,
      "birdPrice": this.trainingData?.birdPrice,
      "birdPercentage": this.trainingData?.birdPercentage,
      "originalPrice": this.trainingData?.price,
      "timeZoneMinutes": timezone_offset_minutes,
      "card":response.card,
      "timeZone": response.timeZone,
      "paymentTime": response.paymentTime,
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

  viewCustomerDetails(userData: any) {
    this.displayViewModal = true;
    this.userCurrentData = userData;
  }

  setIsNewFalse(id: any) {
    this.threadApi.setIsNewFalse(id).subscribe((response) => {
      // console.log(response)
    }, (error: any) => {
      console.error(error);
    });
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
    this.cd.detectChanges();
  }

  openPaymentPopup() {
    console.log("this.payablePrice: ", this.payablePrice);
    this.setCompanyValidations();
    if (!this.payablePrice) {
      this.manualId = null;
      this.showPaymentFields = false;
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

  setCompanyValidations() {
    if(this.domainId == 1) {
      if(!this.formIndexReset) {
        if(!this.userForm.controls.companyName.value) {
          this.userForm.controls.companyAddress1.clearValidators();
          this.userForm.controls.companyState.clearValidators();
          this.userForm.controls.companyCity.clearValidators();
          this.userForm.controls.companyZip.clearValidators();
        } else {
          this.userForm.controls.companyAddress1.setValidators(Validators.required);
          this.userForm.controls.companyState.setValidators(Validators.required);
          this.userForm.controls.companyCity.setValidators(Validators.required);
          this.userForm.controls.companyZip.setValidators(Validators.required);
        }
        this.userForm.controls.companyAddress1.updateValueAndValidity();
        this.userForm.controls.companyState.updateValueAndValidity();
        this.userForm.controls.companyCity.updateValueAndValidity();
        this.userForm.controls.companyZip.updateValueAndValidity();
      } else if(this.formIndexReset) {
        if(!this.purchaseSeatForm.controls.companyName.value) {
          this.purchaseSeatForm.controls.companyAddress1.clearValidators();
          this.purchaseSeatForm.controls.companyState.clearValidators();
          this.purchaseSeatForm.controls.companyCity.clearValidators();
          this.purchaseSeatForm.controls.companyZip.clearValidators();
        } else {
          this.purchaseSeatForm.controls.companyAddress1.setValidators(Validators.required);
          this.purchaseSeatForm.controls.companyState.setValidators(Validators.required);
          this.purchaseSeatForm.controls.companyCity.setValidators(Validators.required);
          this.purchaseSeatForm.controls.companyZip.setValidators(Validators.required);
        }
        this.purchaseSeatForm.controls.companyAddress1.updateValueAndValidity();
        this.purchaseSeatForm.controls.companyState.updateValueAndValidity();
        this.purchaseSeatForm.controls.companyCity.updateValueAndValidity();
        this.purchaseSeatForm.controls.companyZip.updateValueAndValidity();
      }
    }
  }

  backToFormPopup() {
    this.displayPaymentPopup = false;
    if(!this.manualId) this.displayRegisterPopup = true;
    else this.displayDetailsPopup = true;
  }

  calculateTotalAmount() {
    let seats: any = this.numberOfSeatsValue ? this.numberOfSeatsValue : this.user_data_map.length;
    return this.trainingSalesTax + (parseInt(seats) * this.payablePrice);
  }

  calculateTotalAmountLocal(price: any) {
    if (price) {
      return price.toLocaleString();
    } else {
      return '';
    }
  }

  calculateTotalAmountWithManual() {
    return this.totalManualAmount + this.calculateTotalAmount() + this.trainingSalesTax;
  }

  submitUserDetails() {
    if (this.userForm.valid) {
      this.userAddLoader = true;
      this.formSubmitted = false;
      let formValue = this.userForm.getRawValue();
      let timezone_offset_minutes: any = new Date().getTimezoneOffset();
      timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;

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

      let body: any = {
        user_data_map: formValue.user_data_map,
        domainId: this.domainId,
        companyName: formValue.companyName,
        companyAddress1: formValue.companyAddress1,
        companyAddress2: formValue.companyAddress2,
        companyState: formValue.companyState,
        companyCity: formValue.companyCity,
        companyZip: formValue.companyZip,
        addressType: formValue.addressType,
        companyAddressId: this.selectedCompanyAddressId,
        price: this.calculateTotalAmount(),
        birdPrice: this.trainingData?.birdPrice,
        birdPercentage: this.trainingData?.birdPercentage,
        originalPrice: this.trainingData?.price,
        trainingId: this.trainingData.id,
        paidPrice: this.payablePrice,
        timeZoneMinutes: timezone_offset_minutes,
        numberOfSeats: formValue.numberOfSeats,
        timeZone: momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
        paymentTime: moment().format('MMM DD, YYYY h:mm A'),
        salePersonId: this.salesPersonData.userId,
        manual: this.manualData,
        shippingDetails: this.shippingForm.getRawValue(),
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
        this.userAddLoader = false;
      })
    } else {
      this.formSubmitted = true;
    }
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
      let timezone_offset_minutes: any = new Date().getTimezoneOffset();
      timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
      formValue.timeZoneMinutes = timezone_offset_minutes
      formValue.price = this.calculateTotalAmount();
      formValue.birdPrice = this.trainingData?.birdPrice;
      formValue.birdPercentage = this.trainingData?.birdPercentage;
      formValue.companyAddressId = this.selectedCompanyAddressId;
      formValue.domainId = this.domainId;
      formValue.manual = this.manualData;
      formValue.shippingDetails = this.shippingForm.getRawValue();
      formValue.originalPrice = this.trainingData?.price;
      formValue.trainingId = this.trainingData.id;
      formValue.paidPrice = this.payablePrice;
      formValue.email = formValue?.email ? formValue?.email : this.paymentCardResponse.payment_email;
      formValue.timeZone = momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
      formValue.paymentTime = moment().format('MMM DD, YYYY h:mm A'),
      formValue.salePersonId = this.salesPersonData.userId
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
        this.userAddLoader = false;
      })
    } else {
      this.purchaseFormSubmitted = true;
    }
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

  threadHeaderAction(event) {
    if (event == "delete") {
      this.deleteRequest();
    } else if (event == "duplicate") {
      this.navigatePage(this.duplicateRedirect);
    } else if (event == "restore") {
      this.restoreRequest();
    } else if (event == "permanentDelete") {
      this.deletePermanentRequest();
    } else {
      this.navigatePage(this.editRedirect);
    }
  }
  closeUserDetailForm() {
    let formValue = this.userInfoForm.value;
    let country = this.countryDropDownOptions.filter(country => country.id == formValue.country);
    formValue.countryLabel = country[0]?.name;
    let state = this.stateDropDownOptions.filter(state => state.id == formValue.state);
    formValue.stateLabel = state[0]?.name;
    if (!this.checkProperties(formValue, this.currentUserData)) {
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.buttonClass = 'green-button';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.userInfoForm.reset();
          this.showEditUserDetailPopup = false;
        }
      });
    } else {
      this.showEditUserDetailPopup = false;
    }
  }
  checkProperties(obj, currentObj) {
    if (!this.isEdit) {
      for (let key in obj) {
        if (key != 'country' && key != 'countryLabel')
          if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined)
              return false;
      }
      return true;
    } else {
      if (obj.firstName == currentObj.firstName && obj.lastName == currentObj.lastName && obj.email == currentObj.email && obj.phoneNumber?.number == currentObj.phoneNumber && obj.phoneNumber?.internationalNumber == currentObj.internationalNumber && obj.phoneNumber?.nationalNumber == currentObj.phoneNumber && obj.phoneNumber?.e164Number == currentObj.e164Number && obj.phoneNumber?.countryCode == currentObj.countryCode && obj.phoneNumber?.dialCode == currentObj.dialCode && obj.address1 == currentObj.payment_address_1 && obj.address2 == currentObj.payment_address_2 && obj.city == currentObj.payment_city && obj.zipCode == currentObj.payment_zip && obj.countryLabel == currentObj.payment_country && obj.stateLabel == currentObj.payment_state) {
        return true;
      }
      return false;
    }
  }
  submitUserInfo() {
    if (this.userInfoForm.valid) {
      this.userInfoFormSubmitted = false;
      let formValue: any = this.userInfoForm.value;
      formValue.userId = this.currentUserData.id;
      let stateLabel = this.stateDropDownOptions.filter(state => state.id == formValue.state);
      formValue.state = stateLabel[0].name;
      let countryLabel = this.countryDropDownOptions.filter(country => country.id == formValue.country);
      formValue.country = countryLabel[0].name;
      formValue.zip = formValue.zipCode;
      this.threadApi.userUpdateData(formValue).subscribe((response: any) => {
        if (response.status == "Success") {
          this.showEditUserDetailPopup = false;
          this.currentUserData = false;
          this.userInfoForm.reset();
          let successMessage = response.message;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.config
          );
          msgModalRef.componentInstance.successMessage = successMessage;
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            this.showRegisteredDetail();
          }, 2000);
        }
      }, (error: any) => {
      })
    } else {
      this.userInfoFormSubmitted = true;
    }
  }
  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropDownOptions = response.data.countryData;
        this.stateDropDownOptions = response.data.stateData;
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
    }, (error: any) => {
    });
  }

  async getStatesDropdownData(value: any) {
    if (value) {
      await this.threadApi.stateMasterData(value).subscribe((response: any) => {
        if (response.status == "Success") {
          this.stateDropDownOptions = response.data.stateData;
        }
      }, (error: any) => {
      })
    } else {
      this.stateDropDownOptions = [];
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    if (!this.teamSystem) {
      headerHeight = 50;
    }
    this.innerHeight = (this.bodyHeight - (headerHeight));
  }

  getTrainingDetails() {
    this.innerLoading = true;
    this.showRegisteredUserDetails = false;
    this.showTrainingDetails = true;
    this.showSettingUserDetails = false;
    this.showMarketingMenu = false;
    this.showSalesMenu = false;
    this.showParticipantsMenu = false;
    this.salesData = [];
    this.threadApi.apiGetMarketPlaceEditData(this.threadApiData).subscribe((response) => {
      if (response.status == 'Success') {
        this.trainingData = response.data.marketPlaceData;
        if(this.domainId != this.trainingData.domainID){
          this.router.navigateByUrl('market-place');
        }
        this.trainingData.description = this.threadApi.urlify(this.trainingData.description);
        this.manualData = response.data.manual;
       this.setTrainingData();
      }
      this.innerLoading = false;
    }, (error: any) => {
      console.log(error);
      this.innerLoading = false;
    });
    this.headerData = {
      access: this.pageAccess,
      pageName: 'market-place',
      threadId: this.trainingId,
      threadOwnerAccess: this.actionFlag,
      profile: false,
      welcomeProfile: false,
      search: false,
      gtsTitle: `<span>Training ID#${this.trainingId}</span>`,
      techSubmmit: '',
      hideEditDelete: true,
      showPermanentDelete : false,
      hideDelete: true,
      showRestore: false,
      hideDuplicate: true,
    };
  }

  setTrainingData() {
    this.systemInfo = {
      workstreams: this.trainingData.workstreamInfo,
      header: false,
      userInfo: {
        createdBy: this.trainingData.createdByName,
        createdOn: this.getDateTimeFormat(this.trainingData?.createdOn),
        updatedBy: this.trainingData.updatedByName,
        updatedOn: this.getDateTimeFormat(this.trainingData?.updatedOn),
      }
    }
    this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
    if(this.manualData) {
      if(parseInt(this.trainingData.manualDiscountPrice) == parseInt(this.manualData.price) || !this.trainingData.manualDiscountPrice || this.trainingData.manualDiscountPrice == '0' || this.trainingData.manualDiscountPrice == 'null') {
        this.manualData.discountPrice = 0;
        this.manualData.discountPercentage = 0;
      } else {
        this.actualDiscountPrice = this.manualData.discountPrice;
        this.actualDiscountPercentage = this.manualData.discountPercentage;
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
    this.pendingUsersToRegister = parseInt(this.trainingData.maxParticipants) - parseInt(this.trainingData.signedupUsers ? this.trainingData.signedupUsers : '0');
    this.purchaseSeatForm.get('numberOfSeats').setValidators([Validators.required, Validators.max(this.pendingUsersToRegister)]);
    this.purchaseSeatForm.get('numberOfSeats').updateValueAndValidity();
    if (this.trainingData.attachments && this.trainingData.attachments.length > 0) {
      this.trainingData.attachments.forEach((attachment: any) => {
        this.images.push({
          previewImageSrc: this.isVideo(attachment?.fileExtension) ? attachment?.filePath : (attachment?.thumbFilePath ? attachment?.filePath : 'assets/images/service-provider/training-blank-1.png'),
          thumbnailImageSrc: this.isVideo(attachment?.fileExtension) ? attachment?.posterImage : (attachment?.thumbFilePath ? attachment?.thumbFilePath : 'assets/images/service-provider/training-blank-1.png'),
          isVideo: this.isVideo(attachment?.fileExtension) ? true : false,
          fileType: attachment?.fileType,
        });
      });
    }
    if (!this.trainingData.attachments || this.trainingData.attachments.length < 4) {
      let pushCount: any = 4 - this.images.length;
      for (let index = 0; index < pushCount; index++) {
        this.images.push({
          previewImageSrc: "assets/images/service-provider/training-blank-"+(index+1)+".png",
          thumbnailImageSrc: "assets/images/service-provider/training-blank-"+(index+1)+".png",
          isVideo: false,
          fileType: 'image/png',
        })
      }
    }
    this.doNotShowAgain = localStorage.getItem('doNotShowAgain') ? localStorage.getItem('doNotShowAgain') : false;
    if ((this.doNotShowAgain || this.doNotShowAgain == 'true')) {
      this.zoomWarning = false;
    } else {
      if (this.trainingData.trainingMode == 'Online') {
        this.zoomWarning = true;
      } else {
        this.zoomWarning = false;
      }
    }
    let currentTrainingStatus: any = 'Open';
    let currentTrainingColor: any = '#0e9a4e';
    if (this.trainingData?.isClosed == '1') {
      currentTrainingStatus = 'Closed';
      currentTrainingColor = '#444444';
    }
    if (this.trainingData?.isSold == '1') {
      currentTrainingStatus = 'Sold-out';
      currentTrainingColor = '#000000';
    }
    if (!this.trainingData.isActive || this.trainingData?.isActive == '0') {
      currentTrainingStatus = 'Canceled';
      currentTrainingColor = '#ff2626';
    }
    this.headerData = {
      access: this.pageAccess,
      pageName: 'market-place',
      threadId: this.trainingId,
      threadOwnerAccess: this.actionFlag,
      profile: false,
      welcomeProfile: false,
      search: false,
      gtsTitle: `<span>Training ID#${this.trainingId}</span>`,
      techSubmmit: '',
      hideEditDelete: this?.trainingData?.isActive && this.trainingData?.isActive != '0' ? false : true,
      hideDelete: this.trainingData?.isClosed == '1' ? true : false,
      trainingStatus: currentTrainingStatus,
      trainingStatusColor: currentTrainingColor,
      showPermanentDelete : (!this.trainingData.signedupUsers && (!this.trainingData?.isActive || this.trainingData?.isActive == '0')) ? true : false,
      showRestore: this.trainingData?.isActive && this.trainingData?.isActive != '0' ? false : true,
      hideDuplicate: this.trainingData.isActive && this.trainingData?.isActive != '0' ? false : true,
   };
  console.log(this.headerData );

 }

  isVideo(ext :any) {
    if (ext) {
      switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
          return true;
      }
    }
    return false;
  }

  deleteRequest() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = this.trainingData.signedupUsers ? 'deleteSignedupTraining' : 'deleteTrainingNormal';
    modalRef.componentInstance.buttonClass = 'green-button';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteMarketPlace();
      }
    });
  }

  deletePermanentRequest() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = 'deleteTrainingPermanent';
    modalRef.componentInstance.buttonClass = 'green-button';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteMarketPlacePermanent();
      }
    });
  }

  restoreRequest() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = 'restoreTraining';
    modalRef.componentInstance.buttonClass = 'green-button';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.restoreMarketPlace();
      }
    });
  }

  saveReminderSetting() {
    let body: any = {
      reminder1: this.selectedNumberOfDays,
      reminder2: this.selectedNumberOfHours,
      reminder3: this.selectedNumberOfMinutes,
      allow_reminder_1: this.reminderOneOnOff,
      allow_reminder_2: this.reminderTwoOnOff,
      allow_reminder_3: this.reminderThreeOnOff,
      trainingId: this.trainingId,
    }
    this.threadApi.apiUpdateMarketPlaceReminderFields(body).subscribe((response) => {
      if (response.status == 'Success') {
        let successMessage = response.message;
        const msgModalRef = this.modalService.open(
          SuccessModalComponent,
          this.config
        );
        msgModalRef.componentInstance.successMessage = successMessage;
        setTimeout(() => {
          msgModalRef.dismiss("Cross click");
          this.showSettingDetail();
        }, 2000);
      }
    }, error => {
    });
  }

  deleteMarketPlace() {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    this.threadApi.deleteMarketPlace(this.threadApiData).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      this.successMsg = response.message;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.config
      );
      msgModalRef.componentInstance.successMessage = this.successMsg;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        location.reload();
      }, 2000);
    });
  }

  deleteMarketPlacePermanent() {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    this.threadApi.deleteMarketPlacePermanent(this.threadApiData).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      this.successMsg = response.message;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.config
      );
      msgModalRef.componentInstance.successMessage = this.successMsg;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        window.open("/market-place/training", "_self")
      }, 2000);
    });
  }

  restoreMarketPlace() {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    let timezone_offset_minutes: any = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    this.threadApi.restoreMarketPlace(this.threadApiData, timezone_offset_minutes).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      this.successMsg = response.message;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.config
      );
      msgModalRef.componentInstance.successMessage = this.successMsg;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        location.reload();
      }, 2000);
    });
  }

  openRegisteredDetailTab() {
    this.innerLoading = true;
    this.showRegisteredDetail();
  }

  filterChangeRegisterDetailTab() {
    this.registerInnerLoading = true;
   this.showRegisteredDetail();
  }

  showRegisteredDetail() {
    localStorage.removeItem("showRegisterTab");
    this.sconfig = {
      scrollXMarginOffset: 0,
      scrollYMarginOffset: 0
    }
    this.showRegisteredUserDetails = true;
    this.showTrainingDetails = false;
    this.showSettingUserDetails = false;
    this.showMarketingMenu = false;
    this.showSalesMenu = false;
    this.showParticipantsMenu = false;
    this.salesData = [];
    this.headerData.hideEditDelete = true;
    this.headerData.hideDuplicate = true;
    this.headerData.hideDelete = true;
    this.headerData.showPermanentDelete = false;
    this.headerData.showRestore = false;
    this.threadApiData.status = this.currentFilter;
    this.threadApi.apiGetMarketPlaceRegisterUserData(this.threadApiData).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.marketPlaceUserData = response.data.market_place_users;
        this.totalRegistered = response.data.registered_users;
        this.marketPlaceData = response.data.market_place_data;
        this.totalRegisterUserData = response.data.totalRegisteredData;

        let sortedData = [];
        let addedIds = [];
        this.marketPlaceUserData.forEach((outerLoop) => {
          if (!(addedIds.includes(outerLoop.transaction_id))){
            let userList = [];
            this.marketPlaceUserData.forEach((innerLoop) => {
              if (innerLoop.transaction_id == outerLoop.transaction_id) {
                userList.push({ firstName: innerLoop.firstName, lastName: innerLoop.lastName, email: innerLoop.email, phoneNumber: innerLoop.phoneNumber })
              }
            })
            sortedData.push({ ...outerLoop, userList: userList })
            addedIds.push(outerLoop.transaction_id)
          }
        })
        this.marketPlaceUserData = sortedData ;

      this.innerLoading = false;
      this.registerInnerLoading = false;
      this.setIsNewFalse(this.marketPlaceData.id);
    }}, (error: any) => {
      console.log(error);
      this.innerLoading = false;
      this.registerInnerLoading = false;
    });
  }

  goToManual(id) {
    this.router.navigateByUrl('market-place/view-manual/' + id);
  }

  async setUserFillableData(userData) {
    this.isEdit = false;
    this.currentUserData = JSON.parse(JSON.stringify(userData));
    this.showEditUserDetailPopup = true;
    this.userInfoForm.reset();
    this.countryValue = null;
    this.stateValue = null;
    let phoneObject: any ={
      number: userData.phoneNumber,
      internationalNumber: userData.internationalNumber,
      nationalNumber: userData.phoneNumber,
      e164Number: userData.e164Number,
      countryCode: userData.countryCode,
      dialCode: userData.dialCode,
    };
    const country = this.countryDropDownOptions.filter(countryData => countryData.name == this.currentUserData.payment_country);
    const countryId = country[0]?.id;
    this.countryValue = countryId;
    this.threadApi.stateMasterData(countryId).subscribe((response: any) => {
      if (response.status == "Success") {
        this.stateDropDownOptions = response.data.stateData;
        const state = this.stateDropDownOptions.filter(stateData => stateData.name == this.currentUserData.payment_state);
        const stateId = state[0]?.id;
        this.userInfoForm.patchValue({
          'firstName': userData?.firstName,
          'lastName': userData?.lastName,
          'email': userData?.email,
          'phoneNumber': phoneObject,
          'address1': userData?.payment_address_1,
          'address2': userData?.payment_address_2,
          'city': userData?.payment_city,
          'zipCode': userData?.payment_zip,
          'country': countryId,
          'state': stateId
        });
        if (userData.firstName) {
          this.isEdit = true;
        }
        this.stateValue = stateId;
      }
    }, (error: any) => {
    });
  }

  setUserPaymentInfoData(userData) {
    this.currentUserData = JSON.parse(JSON.stringify(userData));
    if (userData?.payment_response) {
      this.currentUserPaymentData = JSON.parse(userData?.payment_response);
      this.showPaymentUserDetailPopup = true;
    }
    if (userData?.errorResponse) {
      this.currentUserPaymentData = userData.errorResponseType == "json" ? JSON.parse(userData?.errorResponse) : userData?.errorResponse;
      this.showPaymentUserDetailPopup = true;
    }
  }

  openSalesTab() {
    this.showRegisteredUserDetails = false;
    this.showTrainingDetails = false;
    this.showSettingUserDetails = false;
    this.showMarketingMenu = false;
    this.showSalesMenu = true;
    this.showParticipantsMenu = false;
    this.headerData.hideEditDelete = true;
    this.headerData.hideDuplicate = true;
    this.threadApi.apiGetSalesPersonData(this.trainingData.id).subscribe((response: any) => {
      if (response.status == "Success") {
        this.salesData = response?.data?.salesData;
        this.salesTotalRecords = response.data.totalRecords;
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  openRegisterDashboardTab() {
    this.showRegisteredUserDetails = false;
    this.showTrainingDetails = false;
    this.showSettingUserDetails = false;
    this.showMarketingMenu = false;
    this.showSalesMenu = false;
    this.showParticipantsMenu = true;
    this.threadApi.apiGetParticipantData(this.trainingData?.zoomWebinarId).subscribe((response: any) => {
      if (response.status == "Success") {
        this.registrantsData = response?.data?.participants;
      }
    }, (error: any) => {
      console.log(error);
    })
  }

  showSettingDetail() {
    this.sconfig = {
      scrollXMarginOffset: 0,
      scrollYMarginOffset: 0
    }
    this.innerLoading = true;
    this.showRegisteredUserDetails = false;
    this.showParticipantsMenu = false;
    this.showTrainingDetails = false;
    this.showSettingUserDetails = true;
    this.showMarketingMenu = false;
    this.showSalesMenu = false;
    this.salesData = [];
    this.threadApi.apiGetMarketPlaceReminderData(this.threadApiData).subscribe((response) => {
      if (response.status == 'Success') {
        this.selectedNumberOfDays = parseInt(this.trainingData.remainder1);
        this.selectedNumberOfHours = parseInt(this.trainingData.remainder2);
        this.selectedNumberOfMinutes = parseInt(this.trainingData.remainder3);
        this.reminderOneOnOff = parseInt(this.trainingData.allow_reminder_1);
        this.reminderTwoOnOff = parseInt(this.trainingData.allow_reminder_2);
        this.reminderThreeOnOff = parseInt(this.trainingData.allow_reminder_3);
      }
      this.innerLoading = false;
    }, (error: any) => {
      console.log(error);
      this.innerLoading = false;
    });
  }

  navigatePage(url) {
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass2);
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }

  refundProcess(userData: any) {
    if(userData.payment_method != 'card') return;
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = "refund";
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.callRefund(userData);
      }
    });
  }

  refundPolicyShow(show: boolean) {
    this.showRefundPolicy = show;
  }

  callRefund(userData: any) {
    this.registerInnerLoading = true;
    let paymentResponse = userData?.payment_response ? JSON.parse(userData?.payment_response) : '';
    let timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    if (paymentResponse){
      let body = {
        userId: this.userId,
        id: userData?.id,
        amount: paymentResponse?.amount,
        transactionId: paymentResponse?.transactionid,
        timeZoneMinutes: timezone_offset_minutes,
      }
      this.threadApi.apiForRefundPayment(body).subscribe((response: any) => {
        if (response.status == 'Success') {
          this.showRegisteredDetail();
        }
        this.registerInnerLoading = false;
      }, (error: any) => {
        this.registerInnerLoading = false;
      });
    }
  }

  copyLink(link: any) {
    navigator.clipboard.writeText(link);
    this.copiedModal = true;
    setTimeout(() => {
      this.copiedModal = false;
    }, 1500);
  }

  exportAsCSV() {
    this.itemOffset=0;
    let title = "Thread Export";
    let exportInfo = [title,'All'];
    this.exportUserALL(exportInfo);
  }

  exportUserALL(exportInfo) {
    this.excelreportdiaLog=true;
    this.downloadtextflag='Exporting data to Excel..';
    this.threadApiData.status = 'ALL';
    this.exportDataFlag= this.threadApi.apiGetMarketPlaceRegisterUserData(this.threadApiData).subscribe((response) => {
      let exportData = response.data.market_place_users;
      let total_count = response.data.totalRegisteredData;
      this.itemTotal=total_count;
      if(this.itemOffset==0) {
        this.itemOffsetinitiate=true;
      } else {
        this.itemOffsetinitiate=false;
      }
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount=((this.itemOffset/total_count)*100).toFixed(0);
      if (total_count == 0) {
      } else {
        if(this.stopexportapi) {
          if(this.itemOffset>=this.itemTotal) {
            this.exceldownloadtrue=true;
          }
          this.exportAllUsers(exportData);
        }
        if(this.itemOffset>=this.itemTotal) {
          this.stopexportapi=false;
        }
      }
    });
  }

  exportAllUsers(exportData) {
    let usersData = exportData;
    if (this.itemOffsetinitiate == true) {
    }
    for (const users in usersData) {
      const customerName = usersData[users].firstName + ' ' + usersData[users].lastName;
      const email = usersData[users].email;
      const companyName = usersData[users].companyName;
      const phoneNumber = usersData[users].dialCode + usersData[users].phoneNumber;
      const address = usersData[users].payment_address_1 ? (usersData[users].payment_address_1 + (usersData[users].payment_address_2 ? ', ' + usersData[users].payment_address_2 : '') + ', ' + usersData[users].payment_city + ', ' + usersData[users].payment_state + ', ' + usersData[users].payment_zip) : '';
      let timeZone = this.trainingData?.timeZone;
      if (this.trainingData.trainingMode == 'Seminar') {
        timeZone = this.trainingData.inPersonTrainingData[0]?.timeZone;
      }
      const registerDateTime = this.getDateTimeFormat(usersData[users].createdOn) + ' ' + timeZone;
      const trainingPrice = this.trainingData.price && this.trainingData.price != '0' ? '$' + this.trainingData.price : 'Free';
      const paymentStatus = this.capitalizeFirstLetter(usersData[users].status);
      let userListInfo;
      userListInfo = [customerName, email, companyName, phoneNumber, address, registerDateTime, trainingPrice, paymentStatus];
      this.usersExportData.push(userListInfo);
    }
    let threadListHeader;
    threadListHeader = this.usersDataHeader;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Training Registered Report');
    let openTitleRow = worksheet.addRow(['Training Registered Report']);
    openTitleRow.font = { name: 'Calibri', family: 4, size: 20, bold: true };
    worksheet.mergeCells('A1:C1');
    worksheet.addRow([]);
    worksheet.addRow([]);
    let trainingTitleRow = worksheet.addRow(['Training Name: '+ this.trainingData?.trainingName])
    trainingTitleRow.font = { name: 'Calibri', family: 4, size: 14, bold: true };
    worksheet.mergeCells('A4:C4');
    worksheet.addRow([]);
    let usersListTitleRow = worksheet.addRow(["Users List"]);
    usersListTitleRow.font = { name: 'Calibri', family: 4, size: 14, bold: true };
    worksheet.mergeCells('A6:C6');
    worksheet.addRow([]);
    let threadListHeaderRow = worksheet.addRow(threadListHeader);
    threadListHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    let t2 = 0;
    let t3 = 0;
    this.usersExportData.forEach((tl: any) => {
      t2 = t2 + 1;
      worksheet.addRow(tl);
      const collength = this.usersExportData[t3].length;
      for (let c1 = 1; c1 < collength; c1++) {
        if (c1 === 9) {
          worksheet.getColumn(c1).width = 30;
        }
        if (c1 === 19) {
          worksheet.getColumn(c1).width = 30;
        }
        if (c1 === 10) {
          worksheet.getColumn(c1).width = 50;
        }
        if (c1 !== 10 && c1 !== 9 && c1 !== 19 && threadListHeader[c1] !== 'Reply attachments') {
          worksheet.getColumn(c1).width = 20;
        }
        worksheet.getColumn(c1).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
        worksheet.properties.defaultRowHeight = 30;
      }
      t3 = t3 + 1;
    });
    worksheet.addRow([]);
    worksheet.addRow([]);
    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.downloadtextflag = 'Processing Excel';
      setTimeout(() => {
        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Training Registered Report.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.excelreportdiaLog = false;
        this.downloadtextflag = 'Exporting data to Excel..';
      }, 3000);
    } else {
      this.exportUserALL('');
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  cancelUpload() {
    this.exportDataFlag.unsubscribe();
    this.downloadtextflag = 'Canceling Export';
    this.excelreportdiaLog = false;
    this.exceldownloadtrue = false;
    this.stopexportapi = true;
    this.itemOffset = 0;
    this.usersExportData = [];
    this.progressbarCount = '0';
  }

  openSigninLink() {
    window.open('https://us06web.zoom.us/signin', '_blank');
  }

  getDateFormatStartDate(value: any) {
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

  openCompanyAddPopup() {
    this.companyActionFlag = true;
    this.companyAddFrom.reset();
    this.companyAddSubmitted = false;
  }

  getHourOnlyFormat(value: any) {
    if (value) {
      return moment(value).format('h A');
    } else {
      return '';
    }
  }

  getDateTimeFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY . h:mm A');
    } else {
      return '';
    }
  }

  getDateTimeWithoutDotFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY h:mm A');
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

  addDateAndFormat(value: any, index: any) {
    if (value) {
      return moment(value).add(index, 'days').format('MMM DD, YYYY');
    } else {
      return '';
    }
  }

  redirectToLink(link) {
    if (link.indexOf('http://') == 0 || link.indexOf('https://') == 0) {
      window.open(link, '_blank');
    } else {
      const prefix = 'http://';
      link = prefix + link;
      window.open(link, '_blank');
    }
    this.zoomWarning = false;
  }

  storeInLocalhost() {
    localStorage.setItem('doNotShowAgain', this.doNotShowAgain);
  }

  redirectToZoomLink(link) {
    this.zoomLink = link;
    if (!this.doNotShowAgain) {
      this.zoomWarning = true;
    } else {
      window.open(link, "_blank");
    }
  }

  updateIsBirdPriceValue() {
    this.disableBirdValue = this.alternatePricing;
    this.birdPercentage = '';
    this.birdValue = '';
    if(this.alternatePricing) {
      this.pricingForm.get('birdPrice').setValidators([Validators.required]);
      this.pricingForm.get('birdPercentage').setValidators([Validators.required]);
    } else {
      this.pricingForm.reset();
      this.pricingForm.get('birdPrice').clearValidators();
      this.pricingForm.get('birdPercentage').clearValidators();
      this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
    }
    this.showBirdPercentageValidation = false;
    this.showBirdPriceValidation = false;
    this.pricingForm.get('birdPrice').updateValueAndValidity();
    this.pricingForm.get('birdPercentage').updateValueAndValidity();
  }

  updateFreeOfferValue() {
    if (this.freeOffer) {
      this.alternatePricing = false;
      this.updateIsBirdPriceValue();
      this.payablePrice = 0;
      console.log("this.payablePrice: ", this.payablePrice);
    } else {
      this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
    }
  }

  goToRegisterPopup() {
    if (this.pricingForm.valid) {
      this.pricingFormSubmitted = false;
      let birdPrice = parseFloat(this.birdValue);
      let oldBirdPrice = parseFloat(this.trainingData?.birdPrice);
      if (birdPrice > oldBirdPrice) {
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'discardPricingInformation';
        modalRef.componentInstance.buttonClass = 'green-button';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          if (!receivedService) {
            return;
          } else {
            if (this.birdValue) {
              this.payablePrice = this.birdValue;
              this.trainingData.birdPrice = this.birdValue;
              this.trainingData.birdPercentage = this.birdPercentage;
            } else {
              this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
              this.birdValue = this.trainingData?.birdPrice;
              this.birdPercentage = this.trainingData?.birdPercentage;
            }
            this.displayPricingPopup = false;
            this.registerPopup();
          }
        });
      } else {
        if (!this.freeOffer) {
          if (this.birdValue) {
            this.payablePrice = this.birdValue;
            this.trainingData.birdPrice = this.birdValue;
            this.trainingData.birdPercentage = this.birdPercentage;
          } else {
            this.payablePrice = this.trainingData?.birdPrice && this.trainingData?.birdPrice != '0' && this.checkBirdPriceAvailablity(this.trainingData?.expiryDateBirdPrice) ? this.trainingData?.birdPrice : (this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0);
            this.birdValue = this.trainingData?.birdPrice;
            this.birdPercentage = this.trainingData?.birdPercentage;
          }
        } else {
          this.payablePrice = 0;
          this.trainingData.birdPrice = 0;
          this.trainingData.birdPercentage = 100;
        }
        this.displayPricingPopup = false;
        this.registerPopup();
      }
    } else {
      this.pricingFormSubmitted = true;
    }
  }

  updateBirdPriceValue(event: any){
    let price = this.trainingData?.price;
    if (event && price) {
      let val: any = parseFloat(event);
      let priceFloat: any = parseFloat(price);
      if (val < priceFloat && !this.isNegative(val)) {
        let perc: any = (val*100)/priceFloat;
        let percFloat: any = 100 - parseFloat(perc);
        this.birdPercentage = Math.round(percFloat);
        this.showBirdPriceValidation = false;
        this.showBirdPercentageValidation = false;
      } else {
        this.birdPercentage = '';
        this.birdValue = '';
        this.showBirdPriceValidation = true;
        this.showBirdPercentageValidation = true;
      }
    }
  }

  updateBirdPercentageValue(event: any) {
    let price = this.trainingData?.price;
    if (event && price) {
      let perc: any = parseFloat(event);
      let originalPerc: any = 100 - parseFloat(perc);
      let priceFloat: any = parseFloat(price);
      if (originalPerc < 100 && !this.isNegative(originalPerc)) {
        let val: any = (parseFloat(priceFloat) * parseFloat(originalPerc))/100;
        let valFloat = parseFloat(val).toFixed(2);
        this.birdValue = valFloat;
        this.showBirdPriceValidation = false;
        this.showBirdPercentageValidation = false;
      } else {
        this.birdPercentage = '';
        this.birdValue = '';
        this.showBirdPriceValidation = true;
        this.showBirdPercentageValidation = true;
      }
    }
  }

  isNegative(num) {
    if (Math.sign(num) === -1) {
      return true;
    }
    return false;
  }

  checkLabelForPrice(paidPrice: any, originalPrice: any) {
    if (parseFloat(paidPrice) == parseFloat(originalPrice)) {
      return true;
    }
    return false;
  }

  companyFormSubmit() {
    if (this.companyAddFrom.valid) {
      this.companyAddFromSubmitted = false;
      let body: any = this.companyAddFrom.value;
      body.domainId = this.domainId;
      body.userId = this.userId;
      this.threadApi.apiForCompanyAdd(body).subscribe((response: any) => {
        const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
        modalRef.dismiss("Cross click");
        this.bodyElem.classList.remove(this.bodyClass);
        this.successMsg = response.message;
        const msgModalRef = this.modalService.open(
          SuccessModalComponent,
          this.config
        );
        msgModalRef.componentInstance.successMessage = this.successMsg;
        msgModalRef.componentInstance.statusFlag = response.status == 'Success' ? true : false
        setTimeout(() => {
          msgModalRef.dismiss("Cross click");
          this.loadCompanyData();
        }, 2000);
      }, (error: any) => {
        console.error(error);
      })
    } else {
      this.companyAddFromSubmitted = true;
    }
  }

  loadCompanyData() {
    let domainId = this.domainId;
    this.companyOptions = [];
    this.threadApi.apiForCompanyAddData(domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        response?.data?.companyData?.forEach((company: any) => {
          this.companyOptions.push({
            id: company.name,
            name: company.name,
          })
        });
      } else {
        this.companyOptions = []
      }
      this.companyActionFlag = false;
    }, (error: any) => {
      console.error(error);
      this.companyActionFlag = false;
    })
  }

  loadAddressData() {
    this.setCompanyValidations();
    if ((this.formIndexReset && this.companyPurchaseValue) || (!this.formIndexReset && this.companyUserValue)) {
      let body: any = {
        domainId: this.domainId,
        companyId: this.formIndexReset ? this.companyPurchaseValue : this.companyUserValue,
      }
      this.selectedAddress = null;
      if (this.formIndexReset) {
        this.purchaseSeatForm.controls['companyAddress1'].enable();
        this.purchaseSeatForm.controls['companyAddress2'].enable();
        this.purchaseSeatForm.controls['companyCity'].enable();
        this.purchaseSeatForm.controls['companyState'].enable();
        this.purchaseSeatForm.controls['companyZip'].enable();
        this.companyPurchaseStateValue = null;
        this.purchaseSeatForm.patchValue({
          'companyAddress1': '',
          'companyAddress2': '',
          'companyCity': '',
          'companyZip': '',
          'addressType': 'NEW',
        });
      } else {
        this.userForm.controls['companyAddress1'].enable();
        this.userForm.controls['companyAddress2'].enable();
        this.userForm.controls['companyCity'].enable();
        this.userForm.controls['companyState'].enable();
        this.userForm.controls['companyZip'].enable();
        this.companyUserStateValue = null;
        this.userForm.patchValue({
          'companyAddress1': '',
          'companyAddress2': '',
          'companyCity': '',
          'companyZip': '',
          'addressType': 'NEW',
        });
      }
      this.selectedCompanyAddressId = null;
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

  setAddressValueClicked(id: number) {
    this.selectedAddress = id;
    this.setAddressValue();
  }

  setAddressValueNullClicked() {
    this.showChangeAddress = true;
    this.setAddressValueNull();
  }

  setAddressValue() {
    this.showChangeAddress = false;
    if (!this.formIndexReset) {
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

  openCommentPopup(userData){
    // userData.id, userData.user_id
    this.editCommentValue = userData?.comment || '';
    this.selectedUser = userData;
    this.addCommentPopup = true;
  }

  saveComment(){
    this.updateComment();
    this.addCommentPopup = false;
  }

  openPaymentFromEvent() {
    this.paymentFailurePopup = false;
    this.openPaymentPopup();
    this.cd.detectChanges();
  }

  public editShippingCost(action: string) {
    if (action == 'open') this.customShippingCost = this.shippingCost;
    if (action == 'save' && (this.customShippingCost || this.customShippingCost == 0)) this.shippingCost = this.customShippingCost;
    if (action != 'save' || (action == 'save' && (this.customShippingCost || this.customShippingCost == 0))) {
      if(action != 'save') this.customShippingCost = this.shippingCost;
      this.shippingCostDialog = !this.shippingCostDialog;
      this.getSalesTax();
    }
  }
  previewPolicy(id) {
    const modalRef = this.modalService.open(ViewPolicyComponent, this.modalConfig);
    modalRef.componentInstance.policyId = id;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.closePolicyPopup.subscribe((res) => {
      modalRef.dismiss('Cross click');
    });
  }
  openTransactionPopup(data) {
    this.router.navigate([]).then(result => { window.open(`/market-place/report-details/${data}`, '_blank'); });

    // this.transactionData = JSON.parse(data);
    // this.transactionData.title = "Transaction Details";
    // this.transactionPopup = true;
  }

  getCart(updateCart = false) {
    let cartId = this.cartId || localStorage.getItem('adminCartId');
    if (cartId) {
      this.threadApi.getCart({ cartId: cartId }).subscribe((resp) => {
        this.setCart(resp.data, updateCart);
      })
    }
    else {
      this.cartId = null
    }
  }

  setCart(data , updateCart) {
    this.cartId = data?.id;
    this.cartUserId = data?.userId;
    this.trainingIds = data?.trainingIds ? data?.trainingIds.split(',') : [];
    if (this.trainingIds.includes(this.trainingId)) { this.cartItemSelect = true }
    else { this.cartItemSelect = false }
    if(!data?.userId) {
      localStorage.removeItem('adminCartId');
      this.cartId = null;
    } else {
      localStorage.setItem('adminCartId', this.cartId);
    }
  if(updateCart) {
    if(this.cartItemSelect) {
      this.cartUpdatedMessage = 'Training added to cart';
      setTimeout(() => {
        this.cartUpdatedMessage = null;
      }, 2000);
    }
    if(!this.cartItemSelect) {
      this.cartUpdatedMessage = 'Training removed from cart';
      setTimeout(() => {
        this.cartUpdatedMessage = null;
      }, 2000);
    }
  }
  }

  toggleCartItem() {
    if (this.cartId && this.cartUserId) {
      this.cartItemSelect = !this.cartItemSelect
      this.commonApi.updateCartItem({ cartId: localStorage.getItem('adminCartId'), itemId: this.trainingId, itemType: 'training' })
    } else {
      this.showCartUserPopup = true;
    }
  }

  getCartUserData(data) {
    if (data) {
      this.threadApi.updateCartItems({ cartId: this.cartId, userId: data[0].userId, itemId: this.trainingId, itemType: 'training' }).subscribe((resp: any) => {
        this.setCart(resp?.data ,false );
        this.commonApi.cartUpdateSubject.next(resp?.data);
      }, (error: any) => {
        console.error("error: ", error);
      });
      this.showCartUserPopup = false;
    }
  }

  closeCartSalePersonPopup() {
    this.showCartUserPopup = false;
  }
}
