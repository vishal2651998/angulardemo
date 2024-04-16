import {Component, OnInit, ViewChild, HostListener, OnDestroy, ChangeDetectorRef, Renderer2, Inject} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import {DOCUMENT, Location} from '@angular/common';
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
  selector: "app-view-manual",
  templateUrl: "./view-manual.component.html",
  styleUrls: ["./view-manual.component.scss"],
})
export class ViewManualComponent implements OnInit, OnDestroy {
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
  loading: any = false;
  public editRedirect: string;
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
  public displayDetailsPopup: boolean = false;
  public userAddLoader: boolean = false;
  pageLoading: boolean = false;
  public taxResponse = null;
  public firstNameValue = "";
  public lastNameValue = "";
  public addressLine1Value = "";
  public addressLine2Value = "";
  public cityValue = "";
  public paymentEmailValue = "";
  public paymentPhoneValue = "";
  public stateValue = "";
  public countryValue = "";
  public shippingCost = 0;
  public defaultShippingCost = 0;
  public totalAmount = 0;
  public salesTax = 0;
  public salesTaxPercent = 0;
  copiedModal = false;
  public user: any;
  trainingData: any;
  images: any = [];
  systemInfo: any;
  zoomWarning: any = false;
  doNotShowAgain: any = false;
  showTrainingDetails: any = true;
  showRegisteredUserDetails: any = true;
  highlighted:any;
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
  phoneValue: any;
  phonePurchaseValue: any;
  userInfoFormSubmitted = false;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
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
  shippingForm: FormGroup;
  formSubmitted: boolean = false;
  purchaseFormSubmitted: boolean = false;
  paymentLoading: any = false;
  showPaymentFields: any = false;
  hidePaymentButton: any = false;
  registerUserId: any;
  numberOfSeatsValue: any;
  formTypeValue: string;
  paymentCardResponse: any;
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
  zipValue = "";
  buyManualCount = 1;
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
  discountValue: any;
  discountPercentage: any;
  disableDiscountValue: any = false;
  showDiscountPriceValidation: boolean = false;
  showdiscountPercentageValidation: boolean = false;
  freeOffer: any = false;
  pricingForm: FormGroup;
  pricingFormSubmitted: any = false;
  backAvailable: any = true;
  showEmailValidationMsg: any;
  showUserEmailValidationError: any = [];
  showParticipantsMenu: any = false;
  registrantsData: any = [];
  warningPopup: any = false;
  shippingOptions: any = [];
  shippingRegisterValue: any;
  shippingActionFlag: boolean = false;
  shippingAddSubmitted: boolean = false;
  showCompanyAddError: boolean = false;
  shippingPhoneValue: any;
  shippingAddFrom: FormGroup;
  shippingAddFromSubmitted: any = false;
  shippingStateDropdownData: any = [];
  shippingRegisterPurchaseValue: any;
  shippingUserValue: any;
  shippingAddressOptions: any = [];
  shippingPurchaseValue: any;
  selectedAddress: any;
  shippingUserStateValue: any;
  shippingPurchaseStateValue: any;
  selectedCompanyAddressId: any;
  showAddressPopup: any;
  multipleAddressAvailable: any;
  showChangeAddress: boolean = false;
  shippingCostDialog: boolean;
  customShippingCost: number;
  defaultDiscountValue: any;
  defaultDiscountPercentage: any;
  defaultPrice: any;
  paymentCols = ["authcode", "cc_type", "cc_exp","cc_hash", "date", "responsetext", "transactionid", "amount","response_code", "type", "cvvresponse", "avsresponse"];
  paymentColNames = ["Authorization Code", "CC Type", "CC Expiration Date","CC Hash", "Transaction Date", "Response", "Transaction ID", "Amount","Response Code", "Type", "CVV Response", "AVS Response"];
  editCommentValue: string = '';
  addCommentPopup = false;
  selectedPolicyId: any;
  showPolicyPopup = false;
  shippingTax = 0;
  cartItemSelect:boolean = false;
  showCartUserPopup:boolean = false
  cartId: any = null;
  cartUserId: any;
  manualIds: any;
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
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private serviceProviderApi: ServiceProviderService,
    private apiUrl: ApiService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";

    this.shippingForm = this.formBuilder.group({
      'user_data_map': this.formBuilder.array([]),
      'shippingAddress1': ['',[Validators.required]],
      'shippingAddress2': [''],
      'shippingCity': ['',[Validators.required]],
      'shippingState': ['',[Validators.required]],
      'shippingCountry': [''],
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

  get shippingFormControl() {
    return this.shippingForm.controls;
  }

  get userInfoFormControl() {
    return this.userInfoForm.controls;
  }

  get pricingFormControl() {
    return this.pricingForm.controls;
  }

  get shippingAddFormControl() {
    return this.shippingAddFrom.controls;
  }

  get user_data_map(): FormArray {
    return this.shippingForm.get('user_data_map') as FormArray;
  }

  ngOnInit() {
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
    this.pricingForm = this.fb.group({
      'discountPrice': [''],
      'discountPercentage': ['']
    });
    this.shippingAddFrom = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.email]],
      'phoneNumber': [''],
      'address1': [''],
      'address2': [''],
      'city': [''],
      'state': [''],
      'zip': [''],
      'customerId': [''],
    });
    this.loadShippingCost();
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
    if (authFlag) {
      this.trainingId = this.route.snapshot.params["id"];
      this.editRedirect = `market-place/manage-manual/edit/${this.trainingId}`;
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
      this.getManualDetails();
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

  addUsernfo() {
    this.showUserEmailValidationError.push('');
    this.user_data_map.insert(this.user_data_map.length,this.createEmptyItem());
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
        let workStreamTrainingData  = response.workstreamList.filter((stream: any) => {
          return stream.name == 'Training';
        });
        if (workStreamTrainingData && workStreamTrainingData.length) {
          this.workStreamId = workStreamTrainingData[0].id;
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
        // if (this.payablePrice && this.trainingData?.discountPrice && this.trainingData?.discountPrice != '0') {
        if (this.payablePrice && this.trainingData?.price && this.trainingData?.price != '0') {
          this.backAvailable = true;
          this.alternatePricing = false;
          this.freeOffer = false;
          this.disableDiscountValue = true;
          this.pricingForm.reset();
          this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
          this.discountValue = this.trainingData.discountPrice && this.trainingData.discountPrice != '0' ? this.trainingData.discountPrice : 0;
          this.discountPercentage = this.trainingData.discountPercentage && this.trainingData.discountPercentage != '0' ? this.trainingData.discountPercentage : 0;
          this.showPricingPopup();
        } else {
          this.backAvailable = false;
          this.openPurchasePopup();
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
    this.disableDiscountValue = true;
    this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
  }

  backToSaleSelect() {
    this.displayPricingPopup = false;
    this.showSalesPersonPopup = true;
    this.displayDetailsPopup = false;
    this.alternatePricing = false;
    this.freeOffer = false;
    this.disableDiscountValue = true;
    this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
  }

  backToPricingForm() {
    this.displayPricingPopup = true;
    this.displayDetailsPopup = false;
  }

  updateSalesPerson() {
    let body: any = {
      salesPersonId: this.salesPersonData.userId,
      id: this.selectedUser.id
    }
    this.threadApi.apiForUpdateManualSalesPerson(body).subscribe((response: any) => {
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
    this.threadApi.apiForUpdatemanualComment(body).subscribe((response: any) => {
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
    this.shippingForm.reset();
    this.shippingForm.patchValue({
      'numberOfSeats': '1'
    });
    let frmArray = this.shippingForm.get('user_data_map') as FormArray;
    frmArray.clear()
    this.addUsernfo();
    this.countryPurchaseValue = 1;
    this.displayDetailsPopup = true;
    this.userAddLoader = false;
  }

  closePricingPopup() {
    this.pricingForm.reset();
    this.alternatePricing = false;
    this.freeOffer = false;
    this.disableDiscountValue = true;
    this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
    this.displayPricingPopup = false;
  }

  checkConfirmPopup() {
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
          this.alternatePricing = false;
          this.freeOffer = false;
          this.disableDiscountValue = true;
          this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
          this.displayDetailsPopup = false;
          this.formSubmitted = false;
          this.shippingForm.reset();
          this.shippingForm.patchValue({
            numberOfSeats: 1
          });
          let frmArray = this.shippingForm.get('user_data_map') as FormArray;
          frmArray.clear();
          this.addUsernfo();
        }
      });
    } else {
      this.alternatePricing = false;
      this.freeOffer = false;
      this.disableDiscountValue = true;
      this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
      this.displayDetailsPopup = false;
    }
  }

  resetForm() {
    let formTouched = false;
    setTimeout(() => {
      this.formIndexReset = this.formIndexReset ? 0 : 1;
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
            this.formIndexReset = this.formIndexReset ? 0 : 1;
            console.log('this.formIndexReset: ', this.formIndexReset);
            this.formSubmitted = false;
            this.shippingForm.reset();
            this.shippingForm.patchValue({
              numberOfSeats: 1
            });
            let frmArray = this.shippingForm.get('user_data_map') as FormArray;
            frmArray.clear();
            this.addUsernfo();
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
        this.disableDiscountValue = true;
        this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
        this.successData = null;
      }
    });
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
      "discountPrice": this.discountValue,
      "discountPercentage": this.discountPercentage,
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

  viewCustomerDetails(userData: any) {
    this.displayViewModal = true;
    this.userCurrentData = userData;
  }

  setIsNewFalse(id: any) {
    this.threadApi.setIsNewFalseManual(id).subscribe((response) => {
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
    this.submitUserDetails();
  }
  setHidePaymentButton(event) {
    this.hidePaymentButton = event;
  }

  openPaymentFromEvent() {
    this.paymentFailurePopup = false;
    this.openPaymentPopup();
    this.cd.detectChanges();
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

  calculateTotalAmount() {
    let seats: any = this.numberOfSeatsValue ? this.numberOfSeatsValue : this.user_data_map.length;
    return parseInt(seats) * this.payablePrice;
  }

  calculateTotalAmountLocal(price: any) {
    if (price && price != '0') {
      return price.toLocaleString();
    } else {
      return '';
    }
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
        price: this.discountValue ? this.discountValue : this.payablePrice,
        domainId: this.domainId,
        discountPrice: this.discountValue,
        discountPercentage: this.discountPercentage,
        originalPrice: this.trainingData?.price,
        manualId: this.trainingData.id,
        timeZoneMinutes: timezone_offset_minutes,
        buyManualCount: this.buyManualCount,
        paidPrice: this.totalAmount ? this.totalAmount : 0,
        timeZone: momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr(),
        paymentTime: moment().format('MMM DD, YYYY h:mm A'),
        salePersonId: this.salesPersonData.userId,
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
    if (event == "permanentDelete") {
      this.deletePermanentRequest();
    }
    else if (event == "delete") {
      this.deleteRequest();
    }
    else if (event == "restore") {
      this.restoreRequest();
    }
    else {
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
      if (obj.firstName == currentObj.firstName && obj.lastName == currentObj.lastName && obj.email == currentObj.email && obj.phoneNumber.number == currentObj.phoneNumber && obj.phoneNumber.internationalNumber == currentObj.internationalNumber && obj.phoneNumber.nationalNumber == currentObj.phoneNumber && obj.phoneNumber.e164Number == currentObj.e164Number && obj.phoneNumber.countryCode == currentObj.countryCode && obj.phoneNumber.dialCode == currentObj.dialCode && obj.address1 == currentObj.payment_address_1 && obj.address2 == currentObj.payment_address_2 && obj.city == currentObj.payment_city && obj.zipCode == currentObj.payment_zip && obj.countryLabel == currentObj.payment_country && obj.stateLabel == currentObj.payment_state) {
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
      let countryLabel = this.countryDropDownOptions.filter(country => country.id == formValue.country);
      formValue.state = stateLabel[0]?.name;
      formValue.country = countryLabel[0]?.name;
      formValue.zip = formValue.zipCode;
      this.threadApi.manualUserUpdateData(formValue).subscribe((response: any) => {
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
        this.shippingStateDropdownData = [];
        response.data?.countryData.forEach((country: any) => {
          let shippingObject: any = {
            id: country.name,
            name: country.name,
            items: [],
          }
          response.data?.stateData?.forEach((state: any) => {
              let stateObject: any = {};
              if (state.country_id == country.id) {
                stateObject.id = state.name;
                stateObject.name = state.name;
                shippingObject?.items.push(stateObject);
              }
          });
          this.shippingStateDropdownData.push(shippingObject);
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

  getManualDetails() {
    this.innerLoading = true;
    this.showRegisteredUserDetails = false;
    this.showTrainingDetails = true;
    this.showSettingUserDetails = false;
    this.showMarketingMenu = false;
    this.showSalesMenu = false;
    this.showParticipantsMenu = false;
    this.salesData = [];

    this.threadApi.apiGetManualEditData(this.threadApiData).subscribe((response) => {
      if (response.status == 'Success') {
        this.trainingData = response.data.marketPlaceData;
        if(this.domainId != this.trainingData.domainID){
          this.router.navigateByUrl('market-place');
        }
        this.trainingData.description = this.threadApi.urlify(this.trainingData.description);
        this.discountValue = this.trainingData?.discountPrice;
        this.discountPercentage = this.trainingData?.discountPercentage;
       this.setTrainingData();
      }
      this.innerLoading = false;
    }, (error: any) => {
      console.log(error);
      this.innerLoading = false;
    });
    this.headerData = {
      access: this.pageAccess,
      pageName: 'manual',
      threadId: this.trainingId,
      threadOwnerAccess: this.actionFlag,
      profile: false,
      welcomeProfile: false,
      search: false,
      gtsTitle: `<span>Manual ID#${this.trainingId}</span>`,
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
    this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
    this.pendingUsersToRegister = parseInt(this.trainingData.maxParticipants) - parseInt(this.trainingData.signedupUsers ? this.trainingData.signedupUsers : '0');
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
      currentTrainingStatus = 'Removed';
      currentTrainingColor = '#ff2626';
    }
    this.headerData = {
      access: this.pageAccess,
      pageName: 'manual',
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
      showPermanentDelete : this.trainingData?.canDelete,
      showRestore: this.trainingData?.isActive && this.trainingData?.isActive != '0' ? false : true,
      hideDuplicate: this.trainingData.isActive && this.trainingData?.isActive != '0' ? false : true,
   };
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
    modalRef.componentInstance.access = this.trainingData.signedupUsers ? 'deleteSignedupManual' : 'deleteManualNormal';
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
    modalRef.componentInstance.access = 'deleteManualPermanent';
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
    modalRef.componentInstance.access = 'restoreManual';
    modalRef.componentInstance.buttonClass = 'green-button';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.restoreManual();
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
    this.threadApi.deleteManual(this.threadApiData).subscribe((response) => {
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
    this.threadApi.deleteManualPermanent(this.threadApiData).subscribe((response) => {
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
        window.open("/market-place/manuals", "_self")
      }, 2000);
    });
  }

  restoreManual() {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    let timezone_offset_minutes: any = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    this.threadApi.restoreManual(this.threadApiData, timezone_offset_minutes).subscribe((response) => {
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
    // this.innerLoading = true;
    this.warningPopup = false;
    this.isUpdateSalesPerson = false;
    this.showRegisteredDetail();
  }
  openRegisterPopup() {
    this.warningPopup = false;
    this.showSalesPersonPopup = true;
    this.isUpdateSalesPerson = false;
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
    this.threadApi.apiGetMarketPlaceManualUserData(this.threadApiData).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.marketPlaceUserData = response.data.market_place_users;
        this.marketPlaceData = response.data.market_place_data;
        this.totalRegisterUserData = response.data.totalRegisteredData;
      }
      this.innerLoading = false;
      this.registerInnerLoading = false;
      this.setIsNewFalse(this.marketPlaceData.id);
    }, (error: any) => {
      console.log(error);
      this.innerLoading = false;
      this.registerInnerLoading = false;
    });
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
    const country = this.countryDropDownOptions.filter(countryData => countryData.name == this.currentUserData.shippingCountry);
    const countryId = country[0]?.id;
    this.countryValue = countryId;
    this.threadApi.stateMasterData(countryId).subscribe((response: any) => {
      if (response.status == "Success") {
        this.stateDropDownOptions = response.data.stateData;
        const state = this.stateDropDownOptions.filter(stateData => stateData.name == this.currentUserData.shippingState);
        const stateId = state[0]?.id;
        this.userInfoForm.patchValue({
          'firstName': userData?.firstName,
          'lastName': userData?.lastName,
          'email': userData?.email,
          'phoneNumber': phoneObject,
          'address1': userData?.shippingAddress1,
          'address2': userData?.shippingAddress2,
          'city': userData?.shippingCity,
          'zipCode': userData?.shippingZip,
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
    this.threadApi.apiGetManualSalesPersonData(this.trainingData.id).subscribe((response: any) => {
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
    // this.sconfig = {
    //   scrollXMarginOffset: 0,
    //   scrollYMarginOffset: 0
    // }
    // this.innerLoading = true;
    // this.showRegisteredUserDetails = false;
    // this.showTrainingDetails = false;
    // this.showSettingUserDetails = true;
    // this.showMarketingMenu = false;
    // this.showSalesMenu = false;
    // this.salesData = [];
    // this.threadApi.apiGetMarketPlaceReminderData(this.threadApiData).subscribe((response) => {
    //   if (response.status == 'Success') {
    //     this.selectedNumberOfDays = parseInt(this.trainingData.remainder1);
    //     this.selectedNumberOfHours = parseInt(this.trainingData.remainder2);
    //     this.selectedNumberOfMinutes = parseInt(this.trainingData.remainder3);
    //     this.reminderOneOnOff = parseInt(this.trainingData.allow_reminder_1);
    //     this.reminderTwoOnOff = parseInt(this.trainingData.allow_reminder_2);
    //     this.reminderThreeOnOff = parseInt(this.trainingData.allow_reminder_3);
    //   }
    //   this.innerLoading = false;
    // }, (error: any) => {
    //   console.log(error);
    //   this.innerLoading = false;
    // });
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
      this.threadApi.apiForRefundManualPayment(body).subscribe((response: any) => {
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
      const shippingName = "";
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
      userListInfo = [customerName, email, shippingName, phoneNumber, address, registerDateTime, trainingPrice, paymentStatus];
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
    let trainingTitleRow = worksheet.addRow(['Training Name: '+ this.trainingData?.manualName])
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
    this.shippingActionFlag = true;
    this.shippingAddFrom.reset();
    this.shippingAddSubmitted = false;
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
    this.disableDiscountValue = this.alternatePricing;
    this.discountPercentage = '';
    this.discountValue = '';
    if(this.alternatePricing) {
      this.pricingForm.get('discountPrice').setValidators([Validators.required]);
      this.pricingForm.get('discountPercentage').setValidators([Validators.required]);
    } else {
      this.pricingForm.reset();
      this.pricingForm.get('discountPrice').clearValidators();
      this.pricingForm.get('discountPercentage').clearValidators();
      this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
    }
    this.showdiscountPercentageValidation = false;
    this.showDiscountPriceValidation = false;
    this.pricingForm.get('discountPrice').updateValueAndValidity();
    this.pricingForm.get('discountPercentage').updateValueAndValidity();
  }

  updateFreeOfferValue() {
    if (this.freeOffer) {
      this.alternatePricing = false;
      this.updateIsBirdPriceValue();
      this.payablePrice = 0;
    } else {
      this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
    }
  }

  goToPaymentPopup() {
    if (this.pricingForm.valid) {
       this.defaultDiscountValue = this.trainingData?.discountPrice ;
       this.defaultDiscountPercentage = this.trainingData?.discountPercentage;
       this.defaultPrice = this.trainingData?.price ;
      this.pricingFormSubmitted = false;
      let discountPrice = parseFloat(this.discountValue);
      let oldDiscountPrice = parseFloat(this.trainingData?.discountPrice);
      if (discountPrice > oldDiscountPrice) {
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'discardPricingInformation';
        modalRef.componentInstance.buttonClass = 'green-button';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          if (!receivedService) {
            return;
          } else {
            this.displayPricingPopup = false;
            this.openPurchasePopup();
          }
        });
      } else {
        if (!this.freeOffer) {
          if(!this.discountValue) {
            this.discountValue = this.trainingData?.discountPrice;
            this.discountPercentage = this.trainingData?.discountPercentage;
          }
        } else {
          this.payablePrice = 0;
          this.discountValue = 0;
          this.discountPercentage = 100;
        }
        this.displayPricingPopup = false;
        this.openPurchasePopup();
      }
    } else {
      this.pricingFormSubmitted = true;
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
    this.salesTax = 0;
    this.salesTaxPercent = 0;
    this.totalAmount = (((this.discountValue && this.discountValue != '0') ? this.discountValue : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingCost;
  }

  updateBirdPriceValue(event: any){
    let price = this.trainingData?.price;
    if (event && price) {
      let val: any = parseFloat(event);
      let priceFloat: any = parseFloat(price);
      if (val < priceFloat && !this.isNegative(val)) {
        let perc: any = (val*100)/priceFloat;
        let percFloat: any = 100 - parseFloat(perc);
        this.discountPercentage = Math.round(percFloat);
        this.showDiscountPriceValidation = false;
        this.showdiscountPercentageValidation = false;
      } else {
        this.discountPercentage = '';
        this.discountValue = '';
        this.showDiscountPriceValidation = true;
        this.showdiscountPercentageValidation = true;
      }
    }
  }

  updatediscountPercentageValue(event: any) {
    let price = this.trainingData?.price;
    if (event && price) {
      let perc: any = parseFloat(event);
      let originalPerc: any = 100 - parseFloat(perc);
      let priceFloat: any = parseFloat(price);
      if (originalPerc < 100 && !this.isNegative(originalPerc)) {
        let val: any = (parseFloat(priceFloat) * parseFloat(originalPerc))/100;
        let valFloat = parseFloat(val);
        this.discountValue = Math.round(valFloat);
        this.showDiscountPriceValidation = false;
        this.showdiscountPercentageValidation = false;
      } else {
        this.discountPercentage = '';
        this.discountValue = '';
        this.showDiscountPriceValidation = true;
        this.showdiscountPercentageValidation = true;
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

  shippingFormSubmit() {
    if (this.shippingAddFrom.valid) {
      this.shippingAddFromSubmitted = false;
      let body: any = this.shippingAddFrom.value;
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
        }, 2000);
      }, (error: any) => {
        console.error(error);
      })
    } else {
      this.shippingAddFromSubmitted = true;
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
    this.showChangeAddress = false;
    let address = this.shippingAddressOptions[this.selectedAddress];
    this.shippingForm.patchValue({
      'shippingAddress1': address?.address_1,
      'shippingAddress2': address?.address_2,
      'shippingCity': address?.city,
      'shippingZip': address?.zip,
      'addressType': 'OLD',
    });
    this.shippingForm.controls['shippingAddress1'].disable();
    this.shippingForm.controls['shippingAddress2'].disable();
    this.shippingForm.controls['shippingCity'].disable();
    this.shippingForm.controls['shippingState'].disable();
    this.shippingForm.controls['shippingZip'].disable();
    this.shippingUserStateValue = address?.state;
    this.selectedCompanyAddressId = address?.id;
    this.showAddressPopup = false;
  }

  toggleBuyManualCount(actionType: string) {
    if(actionType == 'subtract' && this.buyManualCount > 1) this.buyManualCount -= 1;
    else if(actionType == 'add' && this.buyManualCount < 9) this.buyManualCount += 1;
    this.totalAmount = (((this.discountValue && this.discountValue != '0') ? this.discountValue : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingCost;
    this.getSalesTax();
  }

  getSalesTax() {
    this.shippingCost = (this.customShippingCost || this.customShippingCost == 0) ? this.customShippingCost : this.defaultShippingCost;
    if (this.shippingFormControl.shippingAddress1.valid && this.shippingFormControl.shippingCity.valid && this.shippingFormControl.shippingState.valid && this.shippingFormControl.shippingZip.valid) {
      let body: any = {
        address1: this.shippingFormControl.shippingAddress1.value,
        address2: this.shippingFormControl.shippingAddress2.value,
        state: this.shippingFormControl.shippingState.value,
        city: this.shippingFormControl.shippingCity.value,
        zip: this.shippingFormControl.shippingZip.value,
        shippingCost: this.shippingCost,
        price: this.discountValue ? this.discountValue : this.payablePrice,
        domainId: this.trainingData.domainID,
        buyManualCount: this.buyManualCount,
      }
      if(this.payablePrice) {
        this.threadApi.apiForManualTax(body).subscribe((response: any) => {
          this.taxResponse = response.data;
          if (response.code == 200) {
            this.shippingTax = response.data?.tax?.breakdown?.shipping?.tax_collectable || 0;
            this.salesTax = (response.data?.tax?.amount_to_collect || 0) - this.shippingTax;
            this.salesTaxPercent = response.data?.tax?.rate ? response.data?.tax?.rate * 100 : 0;
            this.totalAmount = (((this.discountValue && this.discountValue != '0') ? this.discountValue : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
          } else {
            this.shippingTax = 0;
            this.salesTax = 0;
            this.salesTaxPercent = 0;
            this.totalAmount = (((this.discountValue && this.discountValue != '0') ? this.discountValue : this.payablePrice) * this.buyManualCount) + this.shippingCost;
          }
        }, (error: any) => {
          console.error("error: ", error);
        })
      } else {
        this.shippingTax = 0;
        this.salesTax = 0;
        this.salesTaxPercent = 0;
        this.totalAmount = (((this.discountValue && this.discountValue != '0') ? this.discountValue : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
      }
    } else {
      this.totalAmount = (((this.discountValue && this.discountValue != '0') ? this.discountValue : this.payablePrice) * this.buyManualCount) + this.salesTax + this.shippingTax + this.shippingCost;
    }
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
      'addressType': 'NEW',
    });
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

  setCart(data, updateCart) {
    this.cartId = data?.id;
    this.cartUserId = data?.userId;
    this.manualIds = data?.manualIds ? data?.manualIds.split(',') : [];
    if (this.manualIds.includes(this.trainingId)) { this.cartItemSelect = true }
    else { this.cartItemSelect = false }
    if(!data?.userId) {
      localStorage.removeItem('adminCartId');
      this.cartId = null;
    } else {
      localStorage.setItem('adminCartId', this.cartId);
    }
    if(updateCart) {
      if(this.cartItemSelect) {
        this.cartUpdatedMessage = 'Manual added to cart';
        setTimeout(() => {
          this.cartUpdatedMessage = null;
        }, 2000);
      }
      if(!this.cartItemSelect) {
        this.cartUpdatedMessage = 'Manual removed from cart';
        setTimeout(() => {
          this.cartUpdatedMessage = null;
        }, 2000);
      }
    }
  }

  toggleCartItem() {
    if (this.cartId && this.cartUserId) {
      this.cartItemSelect = !this.cartItemSelect
      this.commonApi.updateCartItem({ cartId: localStorage.getItem('adminCartId'), itemId: this.trainingId, itemType: 'manual' })
    } else {
      this.showCartUserPopup = true;
    }
  }

  getCartUserData(data) {
    if (data) {
      this.threadApi.updateCartItems({  cartId: this.cartId, userId: data[0].userId, itemId: this.trainingId, itemType: 'manual' }).subscribe((resp: any) => {
        this.setCart(resp?.data,false);
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
  
  openTransactionPopup(data) {
    this.router.navigate([]).then(result => { window.open(`/market-place/report-details/${data}`, '_blank'); });

    // this.transactionData = JSON.parse(data);
    // this.transactionData.title = "Transaction Details";
    // this.transactionPopup = true;
  }
}
