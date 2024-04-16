import { Component, OnInit, ViewChild, OnDestroy, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage, DefaultNewImages, ContentTypeValues, DefaultNewCreationText, MarketPlaceText } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { NgbModal, NgbModalConfig, NgbModalOptions, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ThreadService } from "src/app/services/thread/thread.service";
import { NgxMasonryComponent } from "ngx-masonry";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SuccessModalComponent } from "../../common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../common/submit-loader/submit-loader.component";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";
import { ExportPopupComponent } from "../../common/export-popup/export-popup.component";
import { Workbook } from "exceljs";
import * as fs from 'file-saver';
import { ActionFormComponent } from "../../common/action-form/action-form.component";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { PrimeNGConfig } from 'primeng/api';
import { Message, MessageService } from 'primeng/api';
import { ImageCropperComponent } from '../../common/image-cropper/image-cropper.component';

@Component({
  selector: "app-market-place-settings",
  templateUrl: "./market-place-settings.component.html",
  styleUrls: ["./market-place-settings.component.scss"],
  styles: [
    `
      .masonry-item {
        width: 238px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class MarketPlaceSettingsComponent implements OnInit, OnDestroy {
  public title: string = "Setting";
  public sconfig: PerfectScrollbarConfigInterface = {};
  serviceProviderData: any = [];
  public headTitle: string = "";
  public address: string = "";
  public bounceFee: string = "";
  public zoomEmail: string = "";
  public filterInitFlag: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public expandFlag: boolean = false;
  public editInformedUsers: boolean = false;
  public filterActiveCount: number = 0;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  pageAccess: string = "market-place-settings";
  public disableRightPanel: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public updateMasonryLayout: any;
  public pageData = pageInfo.marketPlacePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "market-place/manage";
  public groupId: number = 2;
  public threadTypesort = "sortthread";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;
  loading: any = false;
  manageTitle: any = `${ManageTitle.actionNew} ${MarketPlaceText.customer}`;
  buttonTitle: any = 'Save';
  public thumbView: boolean = true;
  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public searchVal;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyClass1:string = "image-cropper";
  public bodyElem;
  public footerElem;
  public access: string;
  public msTeamAccessMobile: boolean = false;
  countryDropDownOptions: any;
  stateDropDownOptions: any;
  countryDropdownData: any = [];
  stateDropdownData: any = [];
  companyStateDropdownData: any = [];
  informedUsers: any = [];
  countryValue: any;
  stateValue: any;
  loadingmarketplacemore: boolean = false;
  pageTitleText = PageTitleText.MarketPlace;
  redirectionPage = RedirectionPage.MarketPlace;
  displayNoRecordsShow = 3;
  contentTypeDefaultNewImg = DefaultNewImages.MarketPlace;
  contentTypeValue = ContentTypeValues.MarketPlace;
  contentTypeDefaultNewText = DefaultNewCreationText.MarketPlace;
  contentTypeDefaultNewTextDisabled: boolean = false;
  postApiData: any;
  merchantId: any;
  terminalId: any;
  contentType: any = 44;
  displayOrder: any = 0;
  selectionMode: any = false;
  zoomQNA: any = false;
  zoomPracticeSession: any = false;
  editSettings: any = false;
  emailSettings: FormGroup;
  emailSettingsSubmitted = false;
  loadingInformedUsers = false;
  editSettingsType: 'bounceFee' | 'zoomEmail' | 'address' | 'shippingCost' | 'textMessage';
  bounceFeeSettings: FormGroup;
  zoomEmailSettings: FormGroup;
  zoomSettings: FormGroup;
  bounceFeeSettingsSubmitted: boolean;
  zoomEmailSettingsSubmitted: boolean;
  shippingCostSettings: FormGroup;
  shippingCostSettingsSubmitted: boolean;
  shippingCost: any;
  textMessageData: any;
  usersSelectedIds: any = [];
  usersList;
  notificationSettings: { domainId: number, notificationPurchaser: boolean, notificationSupportEmailMentioned: boolean, notificationSalesPersonMentioned: boolean } = { domainId: 0, notificationPurchaser: false, notificationSupportEmailMentioned: false, notificationSalesPersonMentioned: false }
  tooltipMessage: FormGroup;
  emailNotificationsForm: FormGroup;
  systemMsg:Message[];

  selectedSettingType = 'general';
  defaultSettingTypes = [{
    label: 'General Settings',
    type: 'general',
    imgSrc: 'assets/images/service-provider/setting.png',
    imgSrcSelected: 'assets/images/service-provider/sidebar/settings-white.png',
  }, {
    label: 'Zoom Settings',
    type: 'zoom',
    imgSrc: 'assets/images/service-provider/zoom-settings-grey.png',
    imgSrcSelected: 'assets/images/service-provider/zoom-settings-white.png',
  }, {
    label: 'Merchant Account Settings',
    type: 'merchant',
    imgSrc: 'assets/images/service-provider/user-settings-grey.png',
    imgSrcSelected: 'assets/images/service-provider/user-settings-white.png',
  }, {
    label: 'Email Notifications',
    type: 'email',
    imgSrc: 'assets/images/service-provider/email-grey.png',
    imgSrcSelected: 'assets/images/service-provider/email-white.png',
  }]
  emailNotificationTypeArray = ['webinar', 'seminar', 'handsOnSeminar', 'manual'];
  emailNotificationSettings;
  selectedIndexId: any;
  selectedSubIndexId: any;
  modalConfig: NgbModalOptions;
  isAlternateHost: boolean;
  zoomBackground: any;
  paymentTemplate: boolean = false;
  paymentTemplateType: any;

  constructor(
    private threadApi: ThreadService,
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    config.centered = true;
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title);
    this.emailSettings = this.fb.group({
      'address1': ['', [Validators.required]],
      'address2': [''],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'country': ['', [Validators.required]],
      'zipCode': ['', [Validators.required]],
      'domainId': [0, [Validators.required]],
    });
    this.bounceFeeSettings = this.fb.group({
      'bounceFee': ['', [Validators.required]],
    });
    this.zoomEmailSettings = this.fb.group({
      'zoomEmail': ['', [Validators.required, Validators.email]],
    });
    this.shippingCostSettings = this.fb.group({
      'shippingCost': ['', [Validators.required]],
    });
    this.tooltipMessage = this.fb.group({
      'textMessageTooltip': ['']
    });
    this.emailNotificationsForm = this.fb.group({
      'settings': this.fb.array([]),
    });
    this.zoomSettings = this.fb.group({
      'auto_recording':[''],
      'question_and_answer':[''],
      'practice_session':[''],
      'multiple_device':[''],
      'approval_type':[''],
      'alternative_host':[''],
      'host_list':[''],
      'virtual_background':[''],
      'hostInformation':[''],
      'zoom_image':[''], 
    })
  }

  get f() {
    return this.emailSettings.controls;
  }
  get zoomControl() {
    return this.zoomEmailSettings.controls;
  }
  get bounceFeeControl() {
    return this.bounceFeeSettings.controls;
  }
  get shippingControl() {
    return this.shippingCostSettings.controls;
  }
  get tooltipMessageControl() {
    return this.tooltipMessage.controls;
  }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.f.domainId.setValue(this.domainId);
    this.headTitle = " Zoom Settings";
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}`
    );
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    this.loadCountryStateData();
    // this.loadInformedUsers();
    this.loadZoomSetting();
    this.loadPaymentSetting();
    this.loadEmailSetting("bounceFee");
    this.loadEmailSetting("zoomEmail");
    this.loadEmailSetting("address");
    this.loadEmailSetting("shippingCost");
    this.loadEmailSetting("notification");
    this.loadEmailSetting("textMessage");
    this.loadEmailNotificationSettings();
  }

  emailNotificationsType(): FormArray {
    return this.emailNotificationsForm.get('settings') as FormArray;
  }

  setEmailNotificationSettings() {
    this.emailNotificationTypeArray.forEach((type, index) => {
      this.emailNotificationsType().push(
        this.fb.group({
          type: type,
          settings: this.fb.array([]),
        })
      );
      ['Successful', 'Failed', 'Refund'].forEach((subType, subIndex) => {
        this.getSettingType(index).push(this.PaymentTypes(subType));
      });
      // for storing values in Database 
      this.updateNotificationSettings(index, false, true);
    });
  }

  patchEmailNotificationValues() {
    /* Empty array before updating again */
    this.emailNotificationsForm = this.fb.group({
      'settings': this.fb.array([]),
    })

    this.emailNotificationTypeArray.forEach((arrType, index) => {
      this.emailNotificationsType().push(
        this.fb.group({
          type: arrType,
          settings: this.fb.array([]),
        })
      );
      let payArray = this.emailNotificationSettings.filter((data) => data.type == arrType);
      // let webArray = this.emailNotificationSettings.filter((data)=>data.type == 'webinar');
      // this.getSettingType(index).setValue([]);
      payArray.forEach((subType) => {
        this.getSettingType(index).push(this.fb.group({
          paymentType: subType.paymentType,
          buyer: subType.buyer == '1' ? true : false,
          supportEmailMention: subType.supportEmailMention == '1' ? true : false,
          salesPersonMention: subType.salesPersonMention == '1' ? true : false,
          otherUsers: subType.informedUsers.length > 0 ? subType.otherUsers == '1' ? true : false : false,
          otherUserEmails: subType.otherUserEmails,
          informedUsers: [subType.informedUsers]
        }));
      });
    });
  }

  copyFromMaster(index: any) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'copyMasterSettings';
    modalRef.componentInstance.buttonClass = 'green-button';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (!receivedService) {
        return;
      } else {
        /* 0 index for webinar(master) */
        this.getSettingType(index).clear();
        this.getSettingType(0).value.forEach((subType) => {
          this.getSettingType(index).push(this.fb.group(subType));
        });
        this.updateNotificationSettings(index, true, true);
      }
    });
  }

  getSettingType(index) {
    return (this.emailNotificationsType().at(index) as FormGroup).controls
      .settings as FormArray;
  }

  getPaymentType(index, subTypeIndex): FormGroup {
    return this.getSettingType(index).at(subTypeIndex) as FormGroup;
  }

  getInformedUsers(index, subTypeIndex) {
    if (this.getPaymentType(index, subTypeIndex)) {
      return this.getPaymentType(index, subTypeIndex)?.controls?.informedUsers?.value
    }
    else { return [] };
  }

  private PaymentTypes(subType) {
    return this.fb.group({
      paymentType: `payment${subType}`,
      buyer: true,
      supportEmailMention: true,
      salesPersonMention: true,
      otherUsers: false,
      otherUserEmails: '',
      informedUsers: []
    })
  }

  enableEditSettings(type: "bounceFee" | "zoomEmail" | "address" | "shippingCost" | "textMessage") {
    this.editSettingsType = type;
    this.editSettings = true;
    this.loadEmailSetting(type);
  }

  updateZoomConfiguration() {
    let body = {
      domainId: this.domainId,...this.zoomSettings.value
    }
    this.threadApi.apiForZoomConfigurationUpdate(body).subscribe((response: any) => {
      if (response.status == 'Success') {
        const msgModalRef = this.modalService.open(
          SuccessModalComponent,
          this.config
        );
        msgModalRef.componentInstance.successMessage = response.message;
        setTimeout(() => {
          msgModalRef.dismiss("Cross click");
          this.loadZoomSetting();
        }, 2000);
      }
    }, (error: any) => {
      console.error(error);
    })
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

  saveEmailSettings(settingsType: "bounceFee" | "zoomEmail" | "address" | "shippingCost" | "ZoomConfiguration" | "textMessage") {
    switch (settingsType) {
      case 'address':
        if (this.emailSettings.valid) {
          this.emailSettingsSubmitted = false;
          let formValue: any = this.emailSettings.value;
          let stateLabel = this.stateDropDownOptions.filter(state => state.id == formValue.state);
          formValue.state = stateLabel[0].name;
          let countryLabel = this.countryDropDownOptions.filter(country => country.id == formValue.country);
          formValue.country = countryLabel[0].name;
          this.updateEmailData(formValue, settingsType);
        } else {
          this.emailSettingsSubmitted = true;
        }
        break;
      case 'bounceFee':
        if (this.bounceFeeSettings.valid) {
          this.bounceFeeSettingsSubmitted = false;
          let formValue: any = this.bounceFeeSettings.value;
          this.updateEmailData({ ...formValue, domainId: this.domainId }, settingsType);
        } else {
          this.bounceFeeSettingsSubmitted = true;
        }
        break;
      case 'zoomEmail':
        if (this.zoomEmailSettings.valid) {
          this.zoomEmailSettingsSubmitted = false;
          let formValue: any = this.zoomEmailSettings.value;
          this.updateEmailData({ ...formValue, domainId: this.domainId }, settingsType);
        } else {
          this.zoomEmailSettingsSubmitted = true;
        }
      case 'shippingCost':
        if (this.shippingCostSettings.valid) {
          this.shippingCostSettingsSubmitted = false;
          let formValue: any = this.shippingCostSettings.value;
          this.threadApi.updateShippingCost({ ...formValue, domainId: this.domainId }).subscribe((response: any) => {
            if (response.status == 'Success') {
              const msgModalRef = this.modalService.open(
                SuccessModalComponent,
                this.config
              );
              msgModalRef.componentInstance.successMessage = response.message;
              setTimeout(() => {
                msgModalRef.dismiss("Cross click");
                this.editSettings = false;
                this.loadEmailSetting(settingsType);
              }, 2000);
            }
          }, (error: any) => {
            console.error(error);
          })
        } else {
          this.shippingCostSettingsSubmitted = true;
        }
        break;
      case 'textMessage':
        this.threadApi.updateTextMessageToolip({ ...this.tooltipMessage.value, domainId: this.domainId }).subscribe((response: any) => {
          if (response.status == 'Success') {
            const msgModalRef = this.modalService.open(
              SuccessModalComponent,
              this.config
            );
            msgModalRef.componentInstance.successMessage = response.message;
            setTimeout(() => {
              msgModalRef.dismiss("Cross click");
              this.editSettings = false;
              this.loadEmailSetting(settingsType);
            }, 2000);
          }
        }, (error: any) => {
          console.error(error);
        });
        break;
      default:
        break;
    }
  }

  updateEmailData(formValue, settingsType) {
    this.threadApi.apiForEmailSettingUpdate(formValue).subscribe((response: any) => {
      if (response.status == 'Success') {
        const msgModalRef = this.modalService.open(
          SuccessModalComponent,
          this.config
        );
        msgModalRef.componentInstance.successMessage = response.message;
        setTimeout(() => {
          msgModalRef.dismiss("Cross click");
          this.editSettings = false;
          this.loadEmailSetting(settingsType);
        }, 2000);
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  loadZoomSetting() {
    this.threadApi.apiForLoadZoomSetting(this.domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        const { auto_recording, question_and_answer, practice_session,
          multiple_device, approval_type, alternative_host, virtual_background,
          host_list, hostInformation, zoom_image, zoom_image_url } = response.data;
        this.zoomSettings.patchValue({
          'auto_recording': auto_recording == 1 ? true : false,
          'question_and_answer': question_and_answer == 1 ? true : false,
          'practice_session': practice_session == 1 ? true : false,
          'multiple_device': multiple_device == 1 ? true : false,
          'approval_type': approval_type == 1 ? true : false,
          'alternative_host': alternative_host == 1 ? true : false,
          'host_list': host_list || '',
          'hostInformation': hostInformation,
          'virtual_background': virtual_background == 1 ? true : false,
          'zoom_image': zoom_image,
        })
        this.zoomBackground = zoom_image_url;
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  toggleInformedUsers(settingIndex, subTypeIndex) {
    this.selectedIndexId = settingIndex;
    this.selectedSubIndexId = subTypeIndex;
    this.usersSelectedIds = this.getPaymentType(settingIndex, subTypeIndex).controls.otherUserEmails.value.split(',');
    this.usersList = this.getInformedUsers(settingIndex, subTypeIndex).map((data) => {
      return { email: data.email || '', userId: data.id }
    });
    this.editInformedUsers = true;
  }

  toggleAlternateHostlist(){
    this.isAlternateHost = true ;
    this.usersSelectedIds = this.zoomSettings.value.host_list.split(',');
    this.usersList = this.zoomSettings.value.hostInformation.map((data) => {
      return { email: data.email || '', userId: data.id }
    });
    this.editInformedUsers = true;
  }

  getUsers(event) {
    this.usersList = event;
    this.usersSelectedIds = [];
    this.usersList.forEach((item) => this.usersSelectedIds.push(item.userId));
    if (this.isAlternateHost) {
      this.isAlternateHost = false;
      this.zoomSettings.controls.host_list.setValue(this.usersSelectedIds.toString());
      this.updateZoomConfiguration()
      // this.loadZoomSetting();
    }
    else {
    this.getPaymentType(this.selectedIndexId, this.selectedSubIndexId).controls.otherUserEmails.setValue(this.usersSelectedIds.toString())
      this.updateNotificationSettings(this.selectedIndexId, true, true);
    }
    this.editInformedUsers = false;
  }

  removeHost(user) {
    let data = this.zoomSettings.controls.hostInformation.value;
    let index = data.indexOf(user);
    if (index !== -1) {
      data.splice(index, 1);
    }
    this.usersSelectedIds = [];
    console.log(data)
    data.forEach((item) => this.usersSelectedIds.push(item.id));
    console.log(this.usersSelectedIds)
    this.zoomSettings.controls.host_list.setValue(this.usersSelectedIds.toString());
    this.updateZoomConfiguration()
    // this.loadZoomSetting();
  }

  removeUser(user, settingIndex, subIndex) {
    let data = this.getPaymentType(settingIndex, subIndex).controls.informedUsers.value;
    let index = data.indexOf(user);
    if (index !== -1) {
      data.splice(index, 1);
    }
    this.usersSelectedIds = [];
    data.forEach((item) => this.usersSelectedIds.push(item.id));
    this.getPaymentType(settingIndex, subIndex).controls.otherUserEmails.setValue(this.usersSelectedIds.toString())
    this.updateNotificationSettings(settingIndex);
  }

  // loadInformedUsers() {
  //   this.loadingInformedUsers = true;
  //   this.threadApi.apiForLoadInformedUsers(this.domainId).subscribe((response: any) => {
  //     if (response.status == 'Success') {
  //       this.loadingInformedUsers = false;
  //       this.informedUsers = response.data;
  //     }
  //   }, (error: any) => {
  //     this.loadingInformedUsers = false;
  //     console.error(error);
  //   })
  // }

  loadPaymentSetting() {
    this.threadApi.apiForLoadPaymentSetting(this.domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.merchantId = response?.data?.merchantId;
        this.terminalId = response?.data?.terminalId;
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  loadEmailSetting(settingsType?: "bounceFee" | "zoomEmail" | "address" | "shippingCost" | "notification" | "textMessage") {
    (!settingsType || settingsType != 'shippingCost') && this.threadApi.apiForLoadEmailSetting(this.domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        const country = this.countryDropDownOptions.filter(countryData => countryData.name == response.setting.country);
        const countryId = country[0]?.id;
        this.countryValue = countryId;
        (!settingsType || settingsType == 'address')
          && this.threadApi.stateMasterData(countryId).subscribe((response2: any) => {
            if (response2.status == "Success") {
              this.stateDropDownOptions = response2.data.stateData;
              const state = this.stateDropDownOptions.filter(stateData => stateData.name == response.setting.state);
              const stateId = state[0]?.id;
              this.address = response.setting ? response.setting?.address1 + (response.setting?.address2 ? ' ' + response.setting?.address2 : '') + ', ' + response.setting?.city + ', ' + (response.setting?.state ? response.setting?.state.slice(0, 2).toUpperCase() : '') + ' ' + response.setting?.zip_code : '';
              this.emailSettings.patchValue({
                'address1': response.setting?.address1,
                'address2': response.setting?.address2,
                'city': response.setting?.city,
                'zipCode': response.setting?.zip_code,
                'country': countryId,
                'state': stateId
              });
              this.stateValue = stateId;
            }
          });
        if (!settingsType || settingsType == 'zoomEmail') {
          this.zoomEmail = response.setting ? response.setting?.zoom_email : "";
          this.zoomEmailSettings.patchValue({
            'zoomEmail': response.setting?.zoom_email,
          });
          this.zoomQNA = (response.setting && response.setting?.question_and_answer && response.setting?.question_and_answer == '1') ? true : false;
          this.zoomPracticeSession = (response.setting && response.setting?.practice_session && response.setting?.practice_session == '1') ? true : false;
        }
        if (!settingsType || settingsType == 'bounceFee') {
          this.bounceFee = response.setting ? response.setting?.bounce_fee : "0";
          this.bounceFeeSettings.patchValue({
            'bounceFee': response.setting?.bounce_fee,
          })
        }
        if (!settingsType || settingsType == 'textMessage') {
          this.textMessageData = response.setting ? response.setting?.textMessageTooltip : '';
          this.tooltipMessage.patchValue({
            'textMessageTooltip': response.setting?.textMessageTooltip,
          })
        }
        if (!settingsType || settingsType == 'notification') {
          this.notificationSettings.notificationPurchaser = (response.setting?.notificationPurchaser && response.setting?.notificationPurchaser == '1') ? true : false;
          this.notificationSettings.notificationSalesPersonMentioned = (response.setting?.notificationSalesPersonMentioned && response.setting?.notificationSalesPersonMentioned == '1') ? true : false;
          this.notificationSettings.notificationSupportEmailMentioned = (response.setting?.notificationSupportEmailMentioned && response.setting?.notificationSupportEmailMentioned == '1') ? true : false;
        }
      }
    }, (error: any) => {
      console.error(error);
    });
    (!settingsType || settingsType == 'shippingCost') && this.threadApi.getShippingCost(this.domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.shippingCost = response?.data?.shippingCost
        this.shippingCostSettings?.patchValue({
          'shippingCost': response?.data?.shippingCost ? response.data.shippingCost : 0,
        })
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  loadEmailNotificationSettings() {
    this.threadApi.getEmailNoticationsSettings(this.domainId).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.emailNotificationSettings = response.settings;
        this.patchEmailNotificationValues();
      }
      if (!response.settings || response.settings.length == 0) {
        this.setEmailNotificationSettings();
      }
      this.loading = false;
    }, (error: any) => {
      console.error(error);
      this.loading = false;
    })
  }

  mainPage() {
    this.router.navigateByUrl('market-place');
  }

  ngOnDestroy() {
  }

  // updateZoomSettingData(event: any) {
  //   let body: any = {
  //     domainId: this.domainId,
  //     name: 'auto_recording',
  //     value: event.checked
  //   }
  //   this.threadApi.apiForZoomSettingUpdate(body).subscribe((response: any) => {
  //     if (response.status == 'Success') {
  //       const msgModalRef = this.modalService.open(
  //         SuccessModalComponent,
  //         this.config
  //       );
  //       msgModalRef.componentInstance.successMessage = response.message;
  //       setTimeout(() => {
  //         msgModalRef.dismiss("Cross click");
  //         this.loadZoomSetting();
  //       }, 2000);
  //     }
  //   }, (error: any) => {
  //     console.error(error);
  //   })
  // }

  /**
   * @param index  0:'webinar', 1:'seminar', 2:'handsOnSeminar', 3:'manual'
   * @param subTypeIndex 0: sucessful, 1: failed, 2: refund
   */
  updateNotificationSettings(index,notification = true, updateForm = false) {
    let body = {
      domainId: this.domainId,
      ...this.emailNotificationsType().at(index)?.value
    }
    this.threadApi.updateEmailNoticationsSettings(body).subscribe((response: any) => {
      if (response.status == 'Success' && notification) {
         this.systemMsg = [{severity:'success', summary:'', detail:'Setting Updated'}];
          this.primengConfig.ripple = true;
        if (updateForm) {
          this.loading = true;
          this.loadEmailNotificationSettings();
        }
        setTimeout(() => {
            this.systemMsg = [];
          }, 2000);
      }
    }, (error: any) => {
      console.error(error);
    })
  }

  getSplitLabel(str: string) {
    if (str == 'webinar') return 'Webinar (Master)';
    else {
      let val = str.split(/(?=[A-Z])/);
      return val ? val.join(' ') : str;
    }
  }

  uploadLogo() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    // if (action == 'upload') {
      const modalRef = this.modalService.open(ImageCropperComponent, { backdrop: 'static', keyboard: false, centered: false });
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.domainId = this.domainId;
      modalRef.componentInstance.type = "Edit";
      modalRef.componentInstance.profileType = 'banner-image-manual';
      // modalRef.componentInstance.id = this.id;
      modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
        if (receivedService) {
          console.log(receivedService);
          this.bodyElem = document.getElementsByTagName('body')[0];
          this.bodyElem.classList.remove(this.bodyClass);
          this.bodyElem.classList.remove(this.bodyClass1);
          modalRef.dismiss('Cross click');
          this.zoomSettings.controls.zoom_image.setValue(receivedService.response);
          this.updateZoomConfiguration()
          // item.logo = receivedService.show;
        }
      });
    // }
  }
  deleteLogo() {
    this.zoomSettings.controls.zoom_image.setValue('');
    this.zoomBackground = '';
  }

  openPaymentTemplate(paymentType:any) {
    console.log(paymentType)
    this.paymentTemplateType = paymentType
    this.paymentTemplate = true
  }

}
