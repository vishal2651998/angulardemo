import { Component, ViewChild, HostListener, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { Constant,IsOpenNewTab,ManageTitle, DispatchText, ContentTypeValues, RedirectionPage } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { CommonService } from '../../../services/common/common.service';
import { RepairOrderService } from 'src/app/services/repair-order/repair-order.service';
import { ApiService } from '../../../services/api/api.service';
import { Title,DomSanitizer } from "@angular/platform-browser";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import * as ClassicEditor from "src/build/ckeditor";
import { countries } from 'country-data';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { ThreadService } from "../../../services/thread/thread.service";
import { BaseService } from 'src/app/modules/base/base.service';
import { Subscription } from "rxjs";
import * as moment from 'moment';
import { Table } from "primeng/table";

@Component({
  selector: 'app-repair-order-manage',
  templateUrl: './repair-order-manage.component.html',
  styleUrls: ['./repair-order-manage.component.scss']
})
export class RepairOrderManageComponent implements OnInit, OnDestroy {
  @Output() ROManageService: EventEmitter<any> = new EventEmitter();
  @Input() workOrderId;
  @Input() workOrderType;
  @Input() workOrderPage;

  public loading: boolean = true;
  public invisibleFlag: boolean = true;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();

  
  public redirectionPage='';
  public pageTitleText='';
  public apiKey: string = Constant.ApiKey;
  public fromSearch = "";
  public filterOptions: any = [];
  public attachmentLoading: boolean = true;
  public attachmentsData: any;
  public action = "view";
  public approvedFlag=0;
  public editThreadId='';
  public assetPath: string = "assets/images/";
  public assetShopPath: string = `${this.assetPath}shop`;
  public assetPartPath: string = `${this.assetPath}parts`;
  public redirectUrl: string = "shop/view/";
  public defShopBanner: string = `${this.assetPath}common/default-shop-banner.png`;
  public collabticDomain: boolean = false;
  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public expandFlag: boolean;
  public accessFrom: string = "";
  public shopApiCall;
  public shopWsApiCall;
  public shopType: string = "";
  public publishStatus: string = "";
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId='';
  public platformId: string;
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;
  public tableRemoveHeight: number = 160;

  public groupId: number = 6;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public itemResponse = [];
  public shopSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public shopUrl='';
  public newPartInfo: string = "Get started by tapping on ‘New SHOP’.";
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public priorityIndexValue='';
  public shopIdArrayInfo: any=[];
  public shopAPICount: any="0";

  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;

  repairOrderListColumns: any = [];
  repairOrderList: any = [];
  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";
  public visibilityChangeLimit=0;
  public showMap: any = false;
  public shopId: number;
  public businessName: string = '';
  public shopIndex: number;

  public description: string = '';
  public odometerFlag: boolean = false;
  public problemDescFlag: boolean = false;
  public errroMsgFlag: boolean = false;
  public jobcodeArr: any = [];

  public readOnlyFlag: boolean = false;
  public ordernumberReadOnlyFlag: boolean = false;
  public dninvoiceReadOnlyFlag: boolean = false;
  public productservicesReadOnlyFlag: boolean = false;
  public serviceError: boolean = false;
  public serviceErrorMsg: string = '';

  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  public tvsDomain: boolean = false;
  public searchAction: boolean = false;
  public bodyElem;
  public descMoreModal: boolean = true;
  public repairOrderModal: boolean = false;
  public manageTitle: string = '';
  serviceForm: FormGroup;
  serviceShopForm: FormGroup;
  serviceTechForm: FormGroup;
  serviceContactForm: FormGroup;
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

  selectedCustomer: any = [];
  selectedCustomerId: any = [];
  selectedContact: any = [];
  selectedContactId: any = [];
  selectedTech: any = [];
  selectedTechId: any = [];
  regContactId: any = [];
  serviceSubmit = false;
  serviceFormValid = false;
  Time: any = [];
  Status: any = [];
  contacts: any = [];
  bussContacts: any = [];
  bussCustomers: any = [];
  Technician: any = [];
  serviceTech: any = [];
  Models: any = [];
  Makes: any = [];
  Years: any = [];
  vinIsValid = false;
  public vinVerfied = true;
  makeList: any;
  public parkingLot: boolean = false;
  public vehicleFormInfo = [];
  public vinValid = true;
  public vinDisable = false;
  public modelDisable:boolean = true;
  public modelLoading:boolean = false;
  public vinData: any = [];
  public modelPlaceHoder = "Select";
  public serviceShopSubmit:boolean = false;
  public serviceContactSubmit:boolean = false;
  public serviceTechSubmit:boolean = false;
  submitClicked = false
  formProcessing: boolean = false;
  public actionForm = '';
  public actionTitle = '';
  public actionFlag:boolean = false;
  public modalState = 'new';
  public servicetype: string = '';
  public servicetypeOptions: any = [];

  public workstreamSelection: any = [];
  public workstreamValid: boolean = true;
  public defaultWSLabel: string = 'Select Workstream';
  public workstreamName = [];
  public workstreamItems: any = [];
  public workstreamId: any = [];
  public workstream: any = [];
  public currYear: any = moment().format('Y');
  public initYear = 1960;

  public postUploadActionTrue: boolean = false;
  public postUpload: boolean = true;
  public manageAction: string;
  public postApiData: object;
  public uploadedItems: any = [];
  public editAttachments: any = [];

  public commentUploadedItemsFlag: boolean = false;
  public commentUploadedItemsLength: number = 0;
  public contentType: number = 50;
  public mediaUploadItems: any = [];
  public mediaAttachments: any = [];
  public mediaAttachmentsIds: any = [];
  public displayOrder: number = 0;
  public EditAttachmentAction: 'attachments';
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];

  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};
  public unit: string = '';
  public unitOptions: any = [];

  public bussContact: string = '';
  public bussCustomer: string = '';
  public contactTechnician: string = '';
  public bodyClass2: string = "submit-loader";
  public bodyClass:string = "auth-index";
  public bodyClass1: string = "landing-page";

  public shopExist = true;
  public existError = '';
  public viewOptions: any = [];
  public view: any = '';
  public platform: any = 3;
  displayModal = false;
  displayNote = false;
  Shops: any = [];
  public empty: any = [];
  public contactDisable: boolean = true;
  public showClear = false;
  selectedShop;
  public serviceId: number = null;
  public odo;
  public roPageData:any;
  public roEstimationFlag: boolean = false;
  public escalationMatrix_array=[];
  public moreTitle: string = '';
  public moreDesc: string = '';
  public createRO: string = '';
  public editRO:boolean = false;
  public estimationSelectedItems: any;
  countryDropdownData: any;
  stateDropdownData: any;
  companyStateDropdownData: any[];
  public fuserDomain: boolean = false;
  public diagnationDomain: boolean = false;
  public initcomplaint: string = '';
  public billingfirstname: string = '';
  public billinglastname: string = '';

  public Editor = ClassicEditor;
  configCke: any = {
    placeholder: 'Enter Additional Problem Detail',
    toolbar: {
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
  };

  configCkeComplaint: any = {
    placeholder: 'Enter Customer Complaint',
    toolbar: {
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
  };


  constructor(
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public apiUrl: ApiService,
    private repairOrderApi: RepairOrderService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private LandingpagewidgetsAPI: LandingpageService,
    private authenticationService: AuthenticationService,
    private baseSerivce: BaseService,
    private threadApi: ThreadService,
  ) { 
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";

  }

  // convenience getters for easy access to form fields
  get sf() { return this.serviceForm.controls; }
  get stf() { return this.serviceTechForm.controls; }
  get scf() { return this.serviceContactForm.controls; }
  get shf() { return this.serviceShopForm.controls; }
  
  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');

    this.fuserDomain = this.domainId == '343' ? true : false;
    this.diagnationDomain = this.domainId == '338' ? true : false;

    this.servicetype = "Tech Support";
    this.servicetypeOptions = ["Tech Support" ,"Remote","Dispatch"];
    this.bodyHeight = window.innerHeight;
    this.platformId = localStorage.getItem('platformId');
    this.collabticDomain = (this.platformId=='1') ? true : false;
    this.setScreenHeight();
   
    this.subscription.add(
        this.commonApi.workorderUploadDataReceivedSubject.subscribe((response) => {
          console.log(response);

          this.workOrderId = (this.workOrderType == 'edit') ? this.workOrderId : response['workOrderId'];
          document.body.classList.remove("manage-popup-new");
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            if(this.workOrderType == 'edit'){
              msgModalRef.componentInstance.successMessage = "RO Updated Successfully";
            }
            else{
              msgModalRef.componentInstance.successMessage = "RO Created Successfully";
            }
            //window.location.reload();
              setTimeout(() => {
                this.commentUploadedItemsLength = 0;
                this.commentUploadedItemsFlag = false;
                this.postUploadActionTrue = false;
                this.uploadedItems = [];

                this.postApiData = {
                  access: 'workorder-page',
                  pageAccess: 'workorder-page',
                  apiKey: Constant.ApiKey,
                  domainId: this.domainId,
                  countryId: this.countryId,
                  userId: this.userId,
                  contentType: this.contentType,
                  displayOrder: this.displayOrder,
                  uploadedItems: [],
                  mediaUploadItems: [],
                  mediaAttachments: [],
                  attachments: [],
                  attachmentItems: [],
                  updatedAttachments: [],
                  deletedFileIds: [],
                  removeFileIds: []
                };
                this.postApiData['uploadedItems'] = this.uploadedItems;
                this.postApiData['attachments'] = this.uploadedItems;
                this.postUpload = false;
                setTimeout(() => {
                  this.postUpload = true;
                }, 100);

                this.resetServiceFormData();
                this.repairOrderModal = false;
                msgModalRef.dismiss('Cross click');
                               

              }, 1000);
          })
    );

    this.unit = "MI";
    this.unitOptions = ["MI" ,"KM"];

    this.servicetype = "Tech Support";
    this.servicetypeOptions = ["Tech Support" ,"Remote","Dispatch"];
    this.resetServiceFormData();          

  }

  emptyContact() {
    this.selectedContact = [];
    this.selectedContactId = [];
    this.contacts = [];
  }
  createForm(action, item:any = '', date:any = '') {
    switch (action) {
      case 'service':
        this.vinIsValid = false;
        this.vinValid = true;
        this.emptyContact();
        const vinPattern = `^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$`;
        if(this.diagnationDomain){
          if(this.editRO){
            this.serviceForm = this.formBuilder.group({
              workstream: [this.workstreamSelection, [Validators.required]],
              servicetype: [this.servicetype, []],
              repairOrder: [''],
              shopId: ['', [Validators.required]],
              serviceContact: ['', [Validators.required]],
              vin: ['', [Validators.pattern(vinPattern)]],
              make: ['', [Validators.required]],
              model: ['', [Validators.required]],
              odo: ['', []],
              year: ['', [Validators.required]],
              ordernumber: ['', [Validators.required]],
              //productservices: ['',[Validators.required]],
              dninvoice: ['',[Validators.required]],
              serviceTech: ['', []],
              description: ['', []],
              billingfirstname: ['', []],
              billinglastname: ['', []],
              initcomplaint: ['', []],
            });
          }
          else{
            this.serviceForm = this.formBuilder.group({
              workstream: [this.workstreamSelection, [Validators.required]],
              servicetype: [this.servicetype, []],
              repairOrder: [''],
              shopId: ['', [Validators.required]],
              serviceContact: ['', [Validators.required]],
              vin: ['', [Validators.pattern(vinPattern)]],
              make: ['', [Validators.required]],
              model: ['', [Validators.required]],
              odo: ['', []],
              year: ['', [Validators.required]],
              ordernumber: ['', [Validators.required]],
              //productservices: ['',[Validators.required]],
              dninvoice: ['',[Validators.required]],
              serviceTech: ['', [Validators.required]],
              description: ['', [Validators.required]],
              billingfirstname: ['', []],
              billinglastname: ['', []],
              initcomplaint: ['', []],
            });
          }          
        }
        else{
          this.serviceForm = this.formBuilder.group({
            workstream: [this.workstreamSelection, [Validators.required]],
            servicetype: [this.servicetype, []],
            repairOrder: [''],
            shopId: ['', [Validators.required]],
            serviceContact: ['', [Validators.required]],
            vin: ['', [Validators.pattern(vinPattern)]],
            make: ['', [Validators.required]],
            model: ['', [Validators.required]],
            odo: ['', [Validators.required]],
            year: ['', [Validators.required]],
            ordernumber: ['', [Validators.required]],
            //productservices: ['',[Validators.required]],
            dninvoice: ['',[Validators.required]],
            serviceTech: ['', [Validators.required]],
            description: ['', [Validators.required]]
          });
        }


        break;
      case 'serviceTech':
        console.log(item)
        let techId = (item == '') ? 0 : item.id;
        let tfirstName = (item == '') ? '' : item.firstName;
        let tlastName = (item == '') ? '' : item.lastName;
        let temail = (item == '') ? '' : item.email;
        let tcountryName = (item == '') ? '' : item.countryName;
        let tcountryCode = (item == '') ? '' : item.countryCode;
        let tdialCode = (item == '') ? '' : item.dialCode;
        let tphoneNumber = (item == '') ? '' : item.phoneNumber;
        this.icountryCode = (item = '') ? this.icountryCode : tcountryCode;
        this.iphoneNumber = (item = '') ? this.iphoneNumber : tphoneNumber;
        this.icountryName = (item = '') ? this.icountryName : tcountryName;
        this.idialCode = (item = '') ? this.idialCode : tdialCode;
        this.phoneNumberData = {
          countryCode: this.icountryCode,
          phoneNumber: this.iphoneNumber,
          country: this.icountryName,
          dialCode: this.idialCode,
          access: 'phone'
        }
        this.serviceTechForm = this.formBuilder.group({
          contactId: [techId],
          firstName: [tfirstName, [Validators.required]],
          lastName: [tlastName, [Validators.required]],
          email: [temail, [Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          countryName: [tcountryName],
          countryCode: [tcountryCode],
          dialCode: [tdialCode],
          phoneNumber: [tphoneNumber]
        });
        break;
        case 'serviceShop':
          let shopId = (item == '') ? 0 : item.id;
          let shopName = (item == '') ? '' :item.name;
          let addressLine1 = (item == '') ? '' : item.addressLine1;
          let addressLine2 = (item == '') ? '' : item.addressLine2;
          let city = (item == '') ? '' : item.city;
          let state = (item == '') ? '' : item.state;
          let zip = (item == '') ? '' : item.zip;
          let customerId = (item == '') ? '' : item.customerId;
          let scountryName = (item == '') ? '' : item.countryName;
          let scountryCode = (item == '') ? '' : item.countryCode;
          let sdialCode = (item == '') ? '' : item.dialCode;
          let phone = (item == '') ? '' : item.phone;
          let cemail = (item == '') ? '' : item.email;
          this.icountryName = (item = '' || scountryName) ? this.icountryName : scountryName;
          this.icountryCode = (item = '' || scountryCode == null) ? this.icountryCode : scountryCode;
          this.idialCode = (item = '' || sdialCode == '') ? this.idialCode : sdialCode;
          this.iphoneNumber = (item = '' || phone == null) ? this.iphoneNumber : phone;
          this.phoneNumberData = {
            countryCode: this.icountryCode,
            phoneNumber: this.iphoneNumber,
            country: this.icountryName,
            dialCode: this.idialCode,
            access: 'phone'
          }
          this.serviceShopForm = this.formBuilder.group({
            shopId: [shopId],
            shopName: [shopName, [Validators .required]],
            addressLine1: [addressLine1],
            addressLine2: [addressLine2],
            city: [city],
            state: [state],
            zip: [zip],
            customerId: [customerId],
            countryName: [scountryName],
            countryCode: [scountryCode],
            dialCode: [sdialCode],
            phone: [phone],
            email: [cemail, [Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          });
        break;
      case 'serviceContact':
        console.log(item)
        let contactId = (item == '') ? 0 : item.id;
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
          contactId: [contactId],
          firstName: [firstName, [Validators.required]],
          lastName: [lastName, [Validators.required]],
          email: [email, [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          countryName: [countryName],
          countryCode: [countryCode],
          dialCode: [dialCode],
          phoneNumber: [phoneNumber]
        });
        break;
    }
  }


  getRecentVin() {
    const vinData = this.serviceForm.get('vin');
    const apiData = {
      apiKey: Constant.ApiKey,
      countryId: this.countryId,
      userId: this.userId,
      domainId: this.domainId,
      access: 'thread'
    };
    const inputData = {
      baseApiUrl: Constant.CollabticApiUrl,
      apiUrl: Constant.CollabticApiUrl + '/' + Constant.getRecentVins,
      field: 'vinNo',
      selectionType: 'single',
      filteredItems: [vinData.value],
      filteredLists: [vinData.value],
      actionApiName: '',
      actionQueryValues: '',
      title: 'Recent VINs'
    };
    const modalRef = this.modalService.open(ManageListComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.access = 'newthread';
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService);
      const response = receivedService[0];
      this.vinDisable = true;
      this.modelDisable = true;
      this.serviceForm.patchValue({vin: response.vinNo});
      this.vinData = {
        make: response.make,
        model: response.model,
        year: response.year,
      };
      this.vinIsValid = true;
      this.vinValid = true;
      this.vinVerfied = true;
      this.setVINValues('vin');
      modalRef.dismiss('Cross click');
    });
  }

  vinChanged(action, val= '') {
    const apiCall = false;
    const vinData = this.serviceForm.get('vin');
    console.log(vinData.value)
    this.vinIsValid = (action == 'api' || val.length == 17) ? true: vinData.valid;
    switch (action) {
      case 'change':
        this.vinIsValid = true;
        this.vinValid = (val.length == 17 && vinData.value == '') ? true : false;
        val = val.toUpperCase();
        this.vinVerfied = false;
        break;
      default:
        const svcFormData = new FormData();
        svcFormData.set('apiKey', Constant.ApiKey);
        svcFormData.set('countryId', this.countryId);
        svcFormData.set('domainId', this.domainId);
        svcFormData.set('userId', this.userId);
        svcFormData.set('vin', vinData.value);
        this.LandingpagewidgetsAPI.vehicleInfoByVIN(svcFormData).subscribe(
          (response) => {
            this.vinValid = (response.status == 'Success') ? true : false;
            if (this.vinValid) {
              this.vinDisable = true;
              this.vinVerfied = true;
              this.modelDisable = true;
              this.vinData = {
                make: response?.vinDetails[0]?.make,
                model: response?.vinDetails[0]?.model,
                year: response?.vinDetails[0]?.year,
              };
              this.setVINValues('vin');
            }
          }
        );
        break;
    }
  }

  setVINValues(access) {
    this.getMakeModelsList(this.vinData.make, access);
    this.serviceForm.patchValue({
      make: this.vinData?.make,
      model: this.vinData?.model,
      year: this.vinData?.year,
    });
  }

  getMakeModelsList(makeName, access = '') {
    this.modelLoading = true;
    this.modelDisable = true;
    const apiInfo = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      displayOrder: 0,
      type: 1,
      makeName,
      offset: '',
      limit: '',
    };
    this.LandingpagewidgetsAPI.getMakeModelsList(apiInfo).subscribe(
      (response) => {
        this.modelDisable = (access == 'vin') ? true : false;
        this.modelLoading = false;
        this.Models = response?.modelData;
        setTimeout(() => {
          this.modelPlaceHoder = 'Select';
        }, 50);
      }
    );
  }

  // Form Action
  formAction(action) {
    console.log(action);
    switch (action) {
      case 'submit':
        this.submitClicked = true;
        this.formSubmit();
        break;

      default:
        this.formProcessing = false;
        this.formCancel();
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
    console.log(this.actionForm)
    switch (this.actionForm) {
      case 'shop':
        this.shopExist = false;
        this.serviceShopSubmit = true;
        for (const i in this.serviceShopForm.controls) {
          this.serviceShopForm.controls[i].markAsDirty();
          this.serviceShopForm.controls[i].updateValueAndValidity();
        }
        this.invalidNumber = (this.iphoneNumber.length > 0 && !this.phoneNumberValid) ? false : true;
        console.log(this.iphoneNumber, this.phoneNumberValid, this.invalidNumber)
        let shopObj = this.serviceShopForm.value;
        if (this.serviceShopForm.valid && (!this.shopExist || !this.invalidNumber)) {
          this.formProcessing = true;
          let phoneNumber = (shopObj.countryCode == 'IN' && shopObj.phone.length > 10) ? shopObj.phone.substring(1) : shopObj.phone;
          let shopAction = (shopObj.shopId == 0) ? apiInfo.action : 'edit';
          apiInfo.action = shopAction;
          apiInfo['contentTypeId'] = ContentTypeValues.RepairOrder
          apiInfo['shopId'] = shopObj.shopId;
          apiInfo['name'] = shopObj.shopName;
          this.businessName = shopObj.shopName;
          apiInfo['customerId'] = shopObj.customerId;
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
          apiInfo['lat'] = "0";
          apiInfo['lng'] = "0";
          this.manageShop(apiInfo);
          /* const address = shopObj.addressLine1 + shopObj.addressLine2 + ',' + shopObj.city + ',' + shopObj.state + ',' + shopObj.zip;
          if(shopObj.addressLine1 != '' && shopObj.city != '' && shopObj.state != '' && shopObj.zip != '') {
            this.geocode(address).then(response => {
              this.formProcessing = false;
              console.log(response.geometry.location.lat());
              console.log(response.geometry.location.lng());
              let lat = response.geometry.location.lat();
              let lng = response.geometry.location.lng();
              apiInfo['lat'] = lat.toString();
              apiInfo['lng'] = lng.toString();
              this.manageShop(apiInfo);
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            apiInfo['lat'] = "0";
            apiInfo['lng'] = "0";
            this.manageShop(apiInfo);
          } */
        } else {
          this.formProcessing = false;
        }
      break;
      case 'contact':
        this.serviceContactSubmit = true;
        for (const i in this.serviceContactForm.controls) {
          this.serviceContactForm.controls[i].markAsDirty();
          this.serviceContactForm.controls[i].updateValueAndValidity();
        }
        this.invalidNumber = (this.iphoneNumber.length > 0 && !this.phoneNumberValid) ? false : true;
        let contactObj = this.serviceContactForm.value;
        console.log(contactObj, this.scf.email.errors, this.serviceContactForm, this.invalidNumber)
        if (this.serviceContactForm.valid && (!this.scf.email.errors || this.scf.email.errors == null || !this.invalidNumber)) {
          this.formProcessing = true;
          let contactAction = (contactObj.contactId == 0) ? apiInfo.action : 'edit';
          let phoneNumber = (contactObj.countryCode == 'IN' && contactObj.phoneNumber.length > 10) ? contactObj.phoneNumber.substring(1) : contactObj.phoneNumber;
          apiInfo.action = contactAction;
          apiInfo['shopId'] = this.shopId;
          apiInfo['contactId'] = contactObj.contactId;
          apiInfo['firstName'] = contactObj.firstName;
          apiInfo['lastName'] = contactObj.lastName;
          apiInfo['email'] = contactObj.email;
          apiInfo['countryName'] = contactObj.countryName;
          apiInfo['countryCode'] = contactObj.countryCode;
          apiInfo['dialCode'] = contactObj.dialCode;
          apiInfo['phoneNumber'] = phoneNumber;
          console.log(apiInfo);
          this.LandingpagewidgetsAPI.manageServiceContactAPI(apiInfo).subscribe((response) => {
            this.actionTitle = '';
            this.serviceContactSubmit = false;
            this.formProcessing = false;
            const contact = response.data;
            let id = contact.id;
              let itemVal = this.renderItem(contact);
              let serviceContact = this.serviceForm.get('serviceContact');
            let contactVal = serviceContact.value;
            if(contactAction == 'new') {
              this.contacts.unshift({
                id: id,
                name: itemVal,
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                countryName: contact.countryName,
                countryCode: contact.countryCode,
                dialCode: contact.dialCode,
                phoneNumber: contact.phoneNumber
              });
              this.setupSelectedContacts(contact);
              this.bussinessContactInfo(contact);
              console.log(serviceContact.value)
              contactVal.push(id);
              contactVal = Array.from(new Set(contactVal));
              this.serviceForm.patchValue({serviceContact: contactVal});
            } else {
              let contactIndex = this.contacts.findIndex(option => option.id == id);
              this.contacts[contactIndex].name = itemVal;
              this.contacts[contactIndex].firstName = contact.firstName;
              this.contacts[contactIndex].lastName = contact.lastName;
              this.contacts[contactIndex].email = contact.email;
              this.contacts[contactIndex].countryName = contact.countryName;
              this.contacts[contactIndex].countryCode = contact.countryCode;
              this.contacts[contactIndex].dialCode = contact.dialCode;
              this.contacts[contactIndex].phoneNumber = contact.phoneNumber;
              let contactFormIndex = contactVal.findIndex(option => option == id);
              contactVal[contactFormIndex] = id;
              this.serviceForm.patchValue({serviceContact: contactVal});
              let scIndex = this.selectedContactId.findIndex(option => option == id);
              this.selectedContact[scIndex] = this.renderItem(contact);
            }
            this.actionFlag = false;
            this.actionForm = '';
            this.serviceContactForm.reset();
          });
        } else {
          this.formProcessing = false;
        }
        break;
        case 'tech':         
          this.serviceTechSubmit = true;
          for (const i in this.serviceTechForm.controls) {
            this.serviceTechForm.controls[i].markAsDirty();
            this.serviceTechForm.controls[i].updateValueAndValidity();
          }
          this.invalidNumber = (this.iphoneNumber.length > 0 && !this.phoneNumberValid) ? false : true;
          let techObj = this.serviceTechForm.value;
          console.log(techObj, this.scf.email.errors, this.serviceTechForm, this.invalidNumber)
          if (this.serviceTechForm.valid && (!this.stf.email.errors || this.stf.email.errors == null || !this.invalidNumber)) {
            this.formProcessing = true;
            let techAction = 'new';
            let techPhoneNumber = (techObj.countryCode == 'IN' && techObj.phoneNumber.length > 10) ? techObj.phoneNumber.substring(1) : techObj.phoneNumber;
            let emailVal = techObj.email != null ? techObj.email : '';
            const signupData = new FormData();
            signupData.append('api_key', Constant.ApiKey);
            signupData.append('firstname', techObj.firstName);
            signupData.append('lastname', techObj.lastName);
            signupData.append('email', emailVal);
            signupData.append('password', '@Password123');
            signupData.append('phoneNumber', techPhoneNumber);
            signupData.append('countryName', techObj.countryName);
            signupData.append('countryCode', techObj.countryCode);
            signupData.append('dialCode', techObj.dialCode);
            signupData.append('step', '3');
            signupData.append('subdomainName', this.businessName );
            signupData.append('subdomainId', this.domainId );
            signupData.append('version', '2');
            signupData.append('fromTechnician', '1');
            signupData.append('roleId', '4');
            signupData.append('businessName', this.businessName);
            signupData.append('businessId', this.shopId.toString());

            this.authenticationService.signup(signupData).subscribe((response) => {
              
              this.serviceTechSubmit = false;
              this.formProcessing = false;            
              const tech = techObj;

              let id = response.Userid;
              let name;
              let email = '';
              let ph = techPhoneNumber != '' ? ", "+techPhoneNumber : '';

              this.serviceError = response.userStatus == 1 ? true : false;
              if(this.serviceError){
                this.serviceErrorMsg = response.message;
                return false;
              }        
              else{
                this.serviceError = false;
                this.serviceErrorMsg = '';
              }
              
              this.actionTitle = '';

              if(response.status == "Failure"){
                email = response.data.email != '' && response.data.email != undefined ? ", "+response.data.email : '';                
              }
              else{
                email = response.Email != '' && response.Email != undefined ? ", "+response.Email : '';
              }
              email = emailVal == '' ? '' : email;   
              name = techObj.firstName+" "+techObj.lastName+email+ph;
              let itemVal = this.renderContact(name);              
              let contactIndex = this.Technician.findIndex(option => option.id == id);
              if(contactIndex != '-1'){
                this.Technician[contactIndex].name = name;
                this.Technician[contactIndex].label = name;
              }     
              else{
                this.Technician.unshift({
                  id: id,
                  name: name,
                  label: name,                  
                });
                
              }     
              this.setupSelectedTechs(techObj,id);        
              this.serviceForm.get('serviceTech').patchValue(id);
              
              this.serviceError = false;
              this.serviceErrorMsg = '';
              this.actionFlag = false;
              this.actionForm = '';
              this.serviceTechForm.reset();
            });
          } else {
            this.formProcessing = false;
          }
        break;
    }
  }
  // Form Cancel
  formCancel() {
    this.actionFlag = false;
    this.submitClicked = false;
    switch (this.actionForm) {
      case 'tech':
        this.serviceError = false;
        this.serviceErrorMsg = '';
        this.emptyPhoneData();
        this.serviceTechSubmit = false;
        this.serviceTechForm.reset();
      break;
      case 'contact':
        this.emptyPhoneData();
        this.serviceContactSubmit = false;
        this.serviceContactForm.reset();
      break;
      case 'shop':
        this.shopExist = false;
        this.existError = '';
        this.serviceShopSubmit = false;
        this.serviceShopForm.reset();
        break;
    }
  }

  setupShopAddress(shop, callback = true) {
    let address = '';
    address = (shop.lat != '0') ? `${shop.addressLine1}, ${shop.addressLine2}, ${shop.city}, ${shop.state} ${shop.zip}` : address;
    let shopId = shop.id;
    this.shopId = shopId;
    this.businessName = shop.name;
    this.serviceForm.patchValue({
      shopId,
      mapValue: address,
      serviceContact: this.empty
    });
    if(callback) {
      this.getContactList(shopId);
      this.getTechnicianList();
    }
  }

  setupSelectedContacts(item) {
    console.log(item)
    let citem = this.renderItem(item);
    console.log(citem)
    this.selectedContact.push(citem);
    this.selectedContactId.push(item.id);
    console.log(this.selectedContactId)
  }
  setupSelectedTechs(item,id) {
     //console.log(item)
     let citem = this.renderContact(item);
     //console.log(citem)
     //this.selectedContact.push(citem);
     //this.selectedContactId.push(id);
     this.selectedTechId = [];
     this.selectedTechId.push(id);
     //console.log(this.technician);
  }
  // Render Contact Info
  renderItem(item) {
    let fname = item.firstName;
    let lname = item.lastName;
    let name = (lname != '') ? `${fname} ${lname}` : fname;
    let email = item.email != '' && item.email != undefined && item.email != null ? ', '+item.email : '';
    let phoneNumber = (item.dialCode != '' && item.phoneNumber != '') ? `${item.dialCode} ${item.phoneNumber}` : '';
    let val = `${name}`;
    val = (email != '') ? `${val},${email}` : val;
    val = (phoneNumber != '') ? `${val}, ${phoneNumber}` : val;
    return val;
  }
  emptyPhoneData(){
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

  // country & phone number update
  getPhoneNumberData(newValue){
    console.log(newValue)
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
      switch (this.actionForm) {
        case 'tech':
          this.serviceTechForm.patchValue({
            countryName: this.icountryName,
            countryCode: this.icountryCode,
            dialCode: this.idialCode,
            phoneNumber: this.iphoneNumber
          });
          break;
        case 'contact':
          this.serviceContactForm.patchValue({
            countryName: this.icountryName,
            countryCode: this.icountryCode,
            dialCode: this.idialCode,
            phoneNumber: this.iphoneNumber
          });
          break;
        case 'shop':
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

  shopChanged(action, event) {
    console.log(action,event)
    let value = (action == 'change') ? event.value : (event != null) ? event : -1;
    if(action == 'trigger') {
      this.actionFlag = false;
    }
    this.emptyContact();
    console.log(value)
    let address = '';
    let shopId: any = 0;
    let clearShop = (value == null) ? true: false;
    value = (value == null) ? -1 : value;
    this.showClear = false;
    switch(value) {
      case -1:
        clearShop = true;
        this.selectedShop = {};
        break;
      case 0:
        clearShop = true;
        this.serviceAction('new', 'shop');
        break;
      default:
        this.contactDisable = false;
        this.showClear = true;
        const selectedShop = this.Shops.filter(
          (element) => element.id == value
        );
        console.log(selectedShop);
        this.selectedShop = selectedShop[0];
        this.setupShopAddress(selectedShop[0]);
        break;
    }
    if(clearShop) {
      this.contactDisable = clearShop;
      this.serviceForm.patchValue({
        shopId,
        mapValue: address,
        serviceContact: this.empty
      });
    }
  }

  // Contact Change
  contactChanged(item) {
    console.log(item)
    let itemVal = item.value;
    console.log(itemVal)
    this.selectedContact = [];
    this.selectedContactId = itemVal;
    itemVal.forEach(id => {
      let cindex = this.contacts.findIndex(option => option.id == id);
      this.selectedContact.push(this.contacts[cindex].name);
    });
    console.log(this.selectedContactId)
  }

 // Contact Change
  techChanged(item) {
    console.log(item)
    let itemVal = item.value;
    this.selectedTechId = [];
    this.selectedTech = [];
    this.selectedTechId.push(itemVal);
    this.selectedTechId.forEach(id => {
      let cindex = this.Technician.findIndex(option => option.id == id);
      this.selectedTech.push(this.Technician[cindex].name);
    });
    console.log(this.selectedTech)
    console.log(this.selectedTechId)
    console.log(this.serviceTech)
  }
  stageChanged(item){
    console.log(item)
    let itemVal = item.value;
    console.log(itemVal)
  }
    // check email validation
    checkEmailValition(){
      console.log(456)
      let emailVal = '';
      var emailError;
      emailVal = this.serviceContactForm.value.email.trim();
      emailError = this.serviceContactForm.controls.email.errors;
      console.log(emailVal)
      if(emailVal.length>0){
        this.emailValidationError = false;
        this.emailValidationErrorMsg = "";
        if(emailError){
          this.emailValidationError = true;
          this.emailValidationErrorMsg = "Invalid Email";
        }
      }
    }

    removeSelection(form, controller, index) {
      console.log(form, controller, index)
      switch(controller) {
        case 'serviceContact':
          this.selectedContact.splice(index, 1);
          this.selectedContactId.splice(index, 1);
          this.serviceForm.patchValue({serviceContact: this.selectedContactId});
          break;
        case 'techContact':
          this.selectedTech.splice(index, 1);
          this.selectedTechId.splice(index, 1);
          this.serviceForm.patchValue({serviceTech: this.selectedTechId});
          break;
      }

    }

      // Create New Options
  serviceAction(action, field, item:any = '') {
    console.log(field);
    this.submitClicked = false;
    this.formProcessing = false;
    let formTimeout = (action == 'new') ? 0 : 500;
    switch (field) {
      case 'shop':
        this.showClear = false;
        let shopText = DispatchText.shop;
        this.actionTitle = (action == 'new') ? `${ManageTitle.actionNew} ${shopText}` : `${ManageTitle.actionEdit} ${shopText}`;
        this.emptyPhoneData();
        let sitem = (action == 'new') ? '' : item;
        this.createForm('serviceShop', sitem);
        setTimeout(() => {
          this.actionFlag = true;
          this.actionForm = field;
        }, formTimeout);
        break;
      case 'contact':
      this.actionTitle = (action == 'new') ? 'Add Contact' : 'Edit Contact';
        if(!this.contactDisable && this.shopId>0 ) {
          let contact = DispatchText.contact;
          this.emptyPhoneData();
          let citem = (action == 'new') ? '' : item;
          this.createForm('serviceContact', citem);
          setTimeout(() => {
            this.actionFlag = true;
            this.actionForm = field;
          }, formTimeout);
        }
        break;
      case 'tech':
        if(!this.contactDisable && this.shopId>0 ) {
          this.actionTitle = (action == 'new') ? 'Add Technician' : 'Edit Technician';
          this.emptyPhoneData();
          let citem1 = (action == 'new') ? '' : item;
          this.createForm('serviceTech', citem1);
          setTimeout(() => {
            this.actionFlag = true;
            this.actionForm = field;
            this.serviceError = false;
            this.serviceErrorMsg = '';           
          }, formTimeout);
        }
        break;
    }
  }

   // Disable Workstreams Selection
   disableWSSelection(id){
    for (let wss in this.workstreamSelection ) {
      if(id == this.workstreamSelection[wss].id){
        this.workstreamSelection.splice(wss, 1);
        this.workstreamId.splice(wss, 1);
      }
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

      }
    }, (error: any) => {

    });

    console.log(this.companyStateDropdownData)
  }

     // Get Workstream Lists
     getWorkstreamLists() {
      let type: any = "1";
      let contentTypeId: any = "2";
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('type', type);
      apiFormData.append('contentTypeId', contentTypeId);
      this.LandingpagewidgetsAPI.getWorkstreamLists(apiFormData).subscribe(
        (response) => {
          let resultData = response.workstreamList;
          this.workstreamItems= [];
          for (let ws of resultData) {
            this.workstreamItems.push({
              id: ws.id,
              name: ws.name,
            });
          }          
        }
      );
    }

  selectedItems(event,type){
    console.log(event) ;
    //switch(type){
      //case 'workstream':
        let currentSelection = event.value;
        this.workstreamId = [];
        this.workstreamSelection = [];
        this.workstreamSelection = currentSelection;
        for (let cs of currentSelection) {
          this.workstreamId.push(cs.id);
        }
        console.log(this.workstreamSelection) ;
        console.log(this.workstreamId) ;
        console.log(this.workstream);
        /* this.serviceForm.value.make = "";
        this.make = '';
        this.serviceForm.value.model = "";
        this.modelName = [];
        this.serviceForm.value.year = "";
        this.year = '';
        this.onChange();
        this.getProdTypes(); */
    //}

  }

  getProductMakeList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    this.LandingpagewidgetsAPI.getProductMakeListsAPI(apiFormData).subscribe(
      (response) => {
        if (response.status == 'Success') {
          const resultData = response.modelData;
          this.makeList = resultData;
        }
      }
    );
  }

  getYearsList() {
    const year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.Years.push({
        id: y,
        name: y.toString(),
      });
    }
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
    let eitem = [];
    let ditem = [];
    let obj = {};
    this.postApiData = {
      action: 'new',
      access: 'workorder-page',
      pageAccess: 'workorder-page',
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
        this.postApiData['attachments'] = this.uploadedItems.attachsments;
      }
    }
    mitem = this.attachmentsData;
    eitem = this.updatedAttachments;
    ditem = this.deletedFileIds;

    console.log(mitem);
    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.mediaAttachments = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.presetAttchmentItems = mitem;
    modalRef.componentInstance.updatedAttachments = eitem;
    modalRef.componentInstance.deletedFileIds = ditem;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {

      console.log(receivedService);
      //(receivedService.uploadedItems);
      if(receivedService){
        this.uploadedItems = receivedService.uploadedItems;
        this.attachmentsData = receivedService.editAttachments;
        this.deletedFileIds  = receivedService.deletedFileIds;
        this.updatedAttachments = receivedService.updatedAttachments;

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
        if(this.attachmentsData != '') {
          if(this.attachmentsData && this.attachmentsData.length>0){
            this.commentUploadedItemsLength = this.commentUploadedItemsLength+this.attachmentsData.length;
            this.commentUploadedItemsFlag = true;
          }
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

        if(this.attachmentsData != '') {
          if(this.attachmentsData && this.attachmentsData.length>0){
            this.commentUploadedItemsLength = this.commentUploadedItemsLength+this.attachmentsData.length;
            this.commentUploadedItemsFlag = true;
          }
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


  defaultData() {

    setTimeout(() => {
      if(this.workOrderType == "new"){
        this.newRepairOrderDetail();    
      }
      else{
        this.editRepairOrderDetail();
      } 
    }, 1000);

  }

  getShopList() {
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      contentTypeId: ContentTypeValues.RepairOrder
    };
    this.LandingpagewidgetsAPI.shopListAPI(apiInfo).subscribe((response) => {
      this.Shops = response?.data;
      this.Shops.splice(0, 0, { id: 0, label: `${ManageTitle.actionNew} Customer` });
    });
  }


  getContactList(shopId) {
    this.contacts = [];
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      shopId: shopId
    };
    this.LandingpagewidgetsAPI.serviceContactListAPI(apiInfo).subscribe((response) => {
      let contacts = response?.data;
      contacts.forEach(item => {
        let id = item.id;
        let itemVal = this.renderContact(item);


        this.contacts.push({
          id: id,
          name: itemVal,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          countryName: item.countryName,
          countryCode: item.countryCode,
          dialCode: item.dialCode,
          phoneNumber: item.phoneNumber
        });
        if(this.serviceId == 0) {
          setTimeout(() => {
            this.selectedContact = [];
            this.selectedContactId = [];
          }, 150);
        }
      });
    });
  }

  getTechnicianList() {
    const searchText = '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    //apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('isRepairOrder', '1');
    apiFormData.append('businessName', this.businessName);
    apiFormData.append('businessId', this.shopId.toString());    
    //apiFormData.append('limit', '20');
    //apiFormData.append('offset', '0');
    apiFormData.append('searchText', searchText);
    this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe(
      (response) => {
        let technician = response?.dataInfo;
        this.Technician = [];
        if(technician.length > 0) {
          technician.forEach(item => {
            let phone = (item.phoneNo!='')? ", "+item.phoneNo : '';
            let uname;
            let email = item.email != '' && item.email != undefined ? ', '+item.email : '';
            uname = item.firstLastName+email+phone;  
            this.Technician.push({
              id:item.userId,
              name:uname,
              label:uname,
              view:'1'
            });
          });
        }
        console.log(this.Technician)
       }
    );
  }

     // Form Submit
     saveService() {
      console.log(1);
      this.serviceSubmit = true;
      console.log(this.serviceForm.valid)
      if(this.serviceForm.valid){
        this.serviceSubmit = false;

        //this.errroMsgFlag = false;
        //this.odometerFlag = false;
        //this.problemDescFlag = false;
        this.formProcessing = true;

        let uploadCount = 0;
        this.mediaUploadItems=[];
        if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
          this.uploadedItems.attachments.forEach(item => {
            //console.log(item)
            if(item.accessType == 'media') {
              this.mediaUploadItems.push({fileId: item.fileId.toString()});
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
      let workArr = this.workstreamId?.length != 0 ? JSON.stringify(this.workstreamId) : '';
      let contactArr = this.selectedContactId?.length != 0 ? JSON.stringify(this.selectedContactId) : '';

      if(this.regContactId?.length != 0 ){
        //this.selectedTechId.push(this.regContactId);
        this.regContactId.forEach(item => {
          this.selectedTechId.push(item);
        });
      }
      let techArr = this.selectedTechId?.length != 0 ? JSON.stringify(this.selectedTechId) : '';

      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('worksteamId', workArr);
      apiFormData.append('shopId', this.shopId.toString());
      apiFormData.append('contactInfo', contactArr);
      apiFormData.append('technicianId', techArr);
      apiFormData.append('createdBy', this.userId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('requestType', this.servicetype);
      apiFormData.append('businessName', this.businessName);
      apiFormData.append('vin', this.serviceForm.value.vin);
      apiFormData.append('make', this.serviceForm.value.make);
      apiFormData.append('model', this.serviceForm.value.model);
      apiFormData.append('year', this.serviceForm.value.year);
      apiFormData.append('odometer', this.odo);
      apiFormData.append('unit', this.unit);
      apiFormData.append('threadId', this.editThreadId);
      apiFormData.append('orderNumber',  this.serviceForm.value.ordernumber);
      //apiFormData.append('productService',  this.serviceForm.value.productservices);
      apiFormData.append('dnInvoice',  this.serviceForm.value.dninvoice);
      apiFormData.append('description', this.description);
      apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));

      if(this.diagnationDomain){
        apiFormData.append('billingFirstName', this.serviceForm.value.billingfirstname);
        apiFormData.append('billingLastName', this.serviceForm.value.billinglastname);
        apiFormData.append('initComplaint', this.initcomplaint);
      }
      let jobcodeJSON = ''
      if(this.jobcodeArr && this.jobcodeArr.length>0){
        jobcodeJSON = JSON.stringify(this.jobcodeArr)
      }

      apiFormData.append('jobcodeJSON', jobcodeJSON);

      if(!this.editRO){
        apiFormData.append('approved', "0");
        apiFormData.append('fromPublic', "0");
        apiFormData.append('id', "0");
        if(this.escalationMatrix_array){
          apiFormData.append('estimationParams', JSON.stringify(this.escalationMatrix_array));
        }
        else{
          apiFormData.append('estimationParams', '');
        }
      }
      else{

        apiFormData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
        apiFormData.append('deletedFileIds',  JSON.stringify(this.deletedFileIds));

        apiFormData.append('editFlag', "1");
        if(this.approvedFlag==1)
        {
          apiFormData.append('approved', "1");
        }
        else
        {
          apiFormData.append('approved', "0");
        }

        apiFormData.append('fromPublic', "0");
        apiFormData.append('id', "0");
        apiFormData.append('workOrderId', this.workOrderId);
        if((this.escalationMatrix_array)){
          if((this.escalationMatrix_array['estimationArray']?.length>0)){
            apiFormData.append('estimationParams', JSON.stringify(this.escalationMatrix_array));
          }
          else{
            apiFormData.append('estimationParams', '');
          }
        }
        else{
          apiFormData.append('estimationParams', '');
        }
      }

      //new Response(apiFormData).text().then(console.log)
      //return false;

      this.repairOrderApi.updateSupportTicketsList(apiFormData).subscribe(res => {
        //console.log(res)
        modalRef.dismiss("Cross click");
        this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){
          //this.errroMsgFlag = true;
          this.formProcessing = false;
          let postId= res.data.postId;
          let threadId= res.data.threadId;
          let workOrderId = res.data.workOrderId;
          this.workOrderId = res.data.workOrderId;

          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {

            this.postApiData['uploadedItems'] = this.uploadedItems.items;
            this.postApiData['attachments'] = this.uploadedItems.attachments;
            this.postApiData['message'] = res.result;
            this.postApiData['workOrderId'] = workOrderId;
            this.postApiData['dataId'] = workOrderId;
            if(this.editRO){
              this.postApiData['postId'] = postId;
              this.postApiData['threadId'] = threadId;
              this.postApiData['approvedFlag']= this.approvedFlag.toString();
            }

            this.manageAction = 'uploading';

            this.postUpload = false;
            setTimeout(() => {
              this.postUploadActionTrue = true;
              this.postUpload = true;
            }, 100);
          }
          else{

            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            if(this.editRO){
              msgModalRef.componentInstance.successMessage = "RO Updated Successfully";
            }
            else{
              msgModalRef.componentInstance.successMessage = "RO Created Successfully";
            }
            
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');                
                let data = {
                  action: 'update'
                };
                this.ROManageService.emit(data);
              }, 2000);

              if(this.approvedFlag==1)
              {


           let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', threadId);
              apiDatasocial.append('postId', postId);
              apiDatasocial.append('userId', this.userId);
              apiDatasocial.append('action', 'create');
              apiDatasocial.append('actionType', '1');
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { });
            }
              this.successFlag = true;

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
      if((this.description == '' || this.description == null) && !this.editRO ){
        this.problemDescFlag = true;
      }
      this.errroMsgFlag = true;
    }
   }

   resetServiceFormData(){
    this.shopId = 0;
    this.workstreamId = [];
    this.workstreamSelection = [];
    this.selectedCustomer = [];
    this.selectedCustomerId = [];
    this.selectedContact = [];
    this.selectedContactId = [];
    this.selectedTech = [];
    this.selectedTechId = [];
    this.regContactId= [];
    this.serviceSubmit = false;
    this.serviceFormValid = false;

    this.unit = "MI";
    this.unitOptions = ["MI" ,"KM"];

    this.servicetype = "Tech Support";
    this.servicetypeOptions = ["Tech Support" ,"Remote","Dispatch"];

    this.getShopList();
    this.getWorkstreamLists();
    this.getProductMakeList();
    this.loadCountryStateData();
    this.getYearsList(); 

    this.loading = false;
    if(this.workOrderType == 'new' ){
      this.editRO = false;
      this.createRO = 'Create RO';
      this.manageTitle = `New Repair Order`;      
    }
    else{
      this.editRO = true;
      this.manageTitle = `Edit Repair Order`;
      this.createRO = 'Update RO';
    }   

    this.createForm('service');
    this.createForm('serviceTech');
    this.createForm('serviceContact');
    this.defaultData();

   }
     // Manage Shop
  manageShop(apiData) {
    this.LandingpagewidgetsAPI.manageServiceShopAPI(apiData).subscribe((response) => {
      this.formProcessing = false;
      let error = response.error;
      if(!error) {
        this.actionTitle = '';
        this.serviceShopSubmit = false;
        this.actionFlag = false;
        const serviceShop = response.data[0];
        if(apiData.action == 'new') {
          this.Shops.splice(0, 1, serviceShop);
          this.Shops.splice(0, 0, { id: 0, label: `${ManageTitle.actionNew} ${DispatchText.shop}` });
          this.shopChanged('trigger', serviceShop.id);
        } else {
          console.log(this.Shops)
          let shopIndex = this.Shops.findIndex(option => option.id == serviceShop.id);
          console.log(shopIndex)
          this.Shops[shopIndex] = serviceShop;
          let shopId = this.serviceForm.get('shopId');
          if(shopId.value == serviceShop.id) {
            this.selectedShop = serviceShop;
            this.serviceForm.patchValue({shopId: serviceShop.id});
            this.setupShopAddress(serviceShop, false);
          }
        }
        this.shopExist = false;
        this.existError = '';
        this.actionForm = '';
        this.serviceShopForm.reset();
      } else {
        this.shopExist = true;
        this.existError = response.message;
      }
    });
  }

  bussinessContactInfo(obj){
    const signupData = new FormData();
    signupData.append('api_key', Constant.ApiKey);
    signupData.append('firstname', obj.firstName);
    signupData.append('lastname', obj.lastName);
    signupData.append('email', obj.email);
    signupData.append('password', '@Password123');
    signupData.append('phoneNumber', obj.phoneNumber);
    signupData.append('countryName', obj.countryName);
    signupData.append('countryCode', obj.countryCode);
    signupData.append('dialCode', obj.dialCode);
    signupData.append('step', '3');
    signupData.append('subdomainName', this.businessName );
    signupData.append('subdomainId', this.domainId );
    signupData.append('version', '2');
    signupData.append('fromTechnician', '2');
    signupData.append('roleId', '4');
    signupData.append('businessName', this.businessName);
    signupData.append('businessId', this.shopId.toString());
    //new Response(signupData).text().then(console.log)
    //return false;

    this.authenticationService.signup(signupData).subscribe((response) => {
      let id = response.Userid;
      if(id!= ''){
        let cindex1 = this.regContactId.findIndex(option => option == id);
        if(cindex1 == '-1'){
          this.regContactId.push(id);
        }
      }
    });

  }

  // Render Contact Info
  renderContact(item) {
    let fname = item.firstName;
    let lname = item.lastName;
    let name = (lname != '') ? `${fname} ${lname}` : fname;
    let email = item.email;
    let dialCode = (item.dialCode != '' && item.dialCode != null) ? `${item.dialCode}` : '';
    let phoneNumber = (item.phoneNumber != '' && item.phoneNumber != null) ? `${item.phoneNumber}` : '';
    phoneNumber = (dialCode != '') ? `${item.dialCode} ${item.phoneNumber}` : `${item.phoneNumber}`;
    let val = `${name}`;
    val = (email != '') ? `${val}, ${email}` : val;
    val = (phoneNumber != '') ? `${val}, ${phoneNumber}` : val;
    return val;
  }

  onChange(type){
    switch(type){
      case 'odo':
        if(this.odo == ''){
          //this.odometerFlag = true;
        }
        else{
          //this.odometerFlag = false;
          this.odo = this.commonApi.removeCommaNum(this.odo);
          this.odo = this.commonApi.numberWithCommasThreeDigit(this.odo);
        }
        break;
        case 'desc':
          if(this.description == '' && !this.editRO){
            this.problemDescFlag = true;
          }
          else{
            if(this.description){
              this.problemDescFlag = this.description.trim() == '' && !this.editRO ? true : false;
            }
            else{
              this.problemDescFlag = false;
            }
          }
        break;
    }
  }


  editServiceData(item) {
    this.workOrderId = item.id;    
    console.log(item)
     this.selectedContact = [];
    this.selectedContactId = [];
    this.serviceId = item.serviceId;
    this.vinIsValid = true;
    this.vinVerfied = true;
    this.vinValid = true;
    this.showClear = true;
    this.contactDisable = false;
    this.serviceSubmit = false;
    let vin = (item.vin != '') ? 'vin' : '';

    if(item.model_make != '') {
      this.getMakeModelsList(item.model_make, vin);
      this.modelPlaceHoder = (item.model_name != '') ? item.model_name : this.modelPlaceHoder;
    }
    this.attachmentsData = item.uploadContents;
    this.attachmentLoading = (item.uploadContents.length>0) ? false : true;

    this.workstreamSelection = [];
    this.workstreamId = [];

    console.log(item.workstreamsId);

    let itemwsid = item.workstreamsId != '' ? (item.workstreamsId) : '';

    console.log(itemwsid);

    for (let ws of this.workstreamItems) {
      for (let itemws of itemwsid) {
        if(ws.id == itemws){
          console.log(this.workstreamId);
          this.workstreamId.push(ws.id)
          this.workstreamSelection.push({
            id: ws.id,
            name: ws.name,
          });
        }
      }
    }

    for (let ws of this.Shops) {
      if(ws.id == item.shopId){
        this.shopId = ws.id;
        this.businessName = ws.name;
        console.log(ws);
        this.selectedShop = ws;
      }
    }

    console.log(this.selectedShop);
    this.setupShopAddress(this.selectedShop);

    item.technicianId = item.technicianId != '' ? item.technicianId.trim() : '';
    var techId = item.technicianId != '' ?  JSON.parse(item.technicianId) : '';
    var contactId = item.contactInfo != '' ?  JSON.parse(item.contactInfo) : '';

    this.selectedContact=[];
    this.selectedContactId = [];
    let selectedContactIdArr = [];

    selectedContactIdArr.push(contactId);
    this.selectedContactId=(contactId);


    this.selectedTech = [];
    this.selectedTechId = [];

    var techIdArr = [];
    if(techId != ''){
      for (const i in techId) {
        if(i=='0'){
          if(techId[i]!=''){
            techIdArr.push(techId[i]);
          }
        }
      }
    }

    let techIdStr = techIdArr.length>0 ? (techIdArr).toString() : '';
    console.log(techIdStr);
    this.selectedTechId=(techIdArr);
    this.estimationSelectedItems = '';
    this.estimationSelectedItems = item.estimationData ? JSON.parse(item.estimationData) : '';

    this.estimationSelectedItems = this.estimationSelectedItems?.estimationArray?.length>0 ? this.estimationSelectedItems : '';

    console.log(this.estimationSelectedItems);
    this.jobcodeArr=[];
    if(this.estimationSelectedItems){
      if(this.estimationSelectedItems['estimationArray']?.length>0)
      {
        for (let wsd in this.estimationSelectedItems['estimationArray'])
        {
          this.jobcodeArr.push(this.estimationSelectedItems['estimationArray'][wsd].jobcode);
          console.log(this.estimationSelectedItems['estimationArray'][wsd].jobcode)
        }
      }
    }

    this.problemDescFlag = item.description == '' && !this.editRO ? true : false;

    if(item.uploadContents && item.uploadContents?.length>0){
      this.commentUploadedItemsLength = item.uploadContents.length;
      this.commentUploadedItemsFlag = true;
    }

    this.loading = false;

    setTimeout(() => {

      this.roPageData = {
        access: "edit",
        fromaccess: 'repairorder-list',
        contentType: ContentTypeValues.RepairOrder,
        make: '',
        model: '',
        id: '0',
        selectedItems: this.estimationSelectedItems
      }

      this.roEstimationFlag = false;
      setTimeout(() => {
        this.roEstimationFlag = true;
      }, 1);
      

      selectedContactIdArr.forEach(id => {
        let cindex = this.contacts.findIndex(option => option.id == id);
        if(cindex != '-1'){
          if(this.contacts[cindex].name!=''){
            this.selectedContact.push(this.contacts[cindex].name);
          }          
        }
      });

      console.log(this.contacts);
      console.log(selectedContactIdArr);
      console.log(this.selectedContactId);

    if(this.selectedTechId != ''){
      this.selectedTechId.forEach(id => {
        let cindex = this.Technician.findIndex(option => option.id == id);
        if(cindex != '-1'){
          if(this.Technician[cindex].name!=''){
            this.selectedTech.push(this.Technician[cindex].name);
          }          
        }
      });
    }
      console.log(this.selectedTech)
      console.log(this.selectedTechId)

      if(this.diagnationDomain){
        this.initcomplaint = item.customerComplaint;
        this.billingfirstname = item.billingFirstName;
        this.billinglastname = item.billingLastName;
      }

      if(item.fromPublic == 1 && this.diagnationDomain){
        this.ordernumberReadOnlyFlag = item.order_number != '' ? true : false;
        this.dninvoiceReadOnlyFlag = item.dn_invoice != '' ? true : false;
        //this.productservicesReadOnlyFlag = item.product_service != '' ? true : false;
      }
  
      if(this.diagnationDomain){
        this.serviceForm.patchValue({
          workstream: this.workstreamSelection,
          servicetype: item.requestType,
          repairOrder: item.id,
          shopId: item.shopId,
          serviceContact: contactId,
          billingfirstname: this.billingfirstname,
          billinglastname: this.billinglastname,
          vin: item.vin,
          make: item.model_make,
          model: item.model_name,
          odo: item.odometer,
          year:item.model_year,
          ordernumber: item.order_number,
          //productservices: item.product_service,
          dninvoice: item.dn_invoice,
          serviceTech: techIdStr,
          description: item.description,
          initcomplaint: item.customerComplaint,
        });
      }
      else{
        this.serviceForm.patchValue({
          workstream: this.workstreamSelection,
          servicetype: item.requestType,
          repairOrder: item.id,
          shopId: item.shopId,
          serviceContact: contactId,
          vin: item.vin,
          make: item.model_make,
          model: item.model_name,
          odo: item.odometer,
          year:item.model_year,
          ordernumber: item.order_number,
          //productservices: item.product_service,
          dninvoice: item.dn_invoice,
          serviceTech: techIdStr,
          description: item.description,
        });
      }


      setTimeout(() => {
        this.invisibleFlag = false;
      }, 500);
      

    }, 500);

  }

  newRepairOrderDetail(){
    this.commentUploadedItemsLength = 0;
    this.commentUploadedItemsFlag = false;
    this.postUploadActionTrue = false;
    this.updatedAttachments = [];
    this.editAttachments = [];
    this.deletedFileIds = [];
    this.mediaUploadItems = [];
    this.attachmentsData= [];
    this.uploadedItems = [];
    this.approvedFlag=0;

    this.postApiData = {
      access: 'workorder-page',
      pageAccess: 'workorder-page',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      mediaUploadItems: [],
      mediaAttachments: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.postApiData['uploadedItems'] = this.uploadedItems;
    this.postApiData['attachments'] = this.uploadedItems;
    this.postUpload = false;
    setTimeout(() => {
      this.postUpload = true;
    }, 100);

    this.roPageData = {
      access: "new",
      fromaccess: 'repairorder-list',
      contentType: ContentTypeValues.RepairOrder,
      make: '',
      model: '',
      id: '0'
    }

    this.roEstimationFlag = false;
    setTimeout(() => {
      this.roEstimationFlag = true;
    }, 1);
    

    let dataLen = this.workstreamItems.length;
    if(dataLen==1){
      this.workstreamId = [];
      this.workstreamSelection = [];
      this.workstreamSelection = this.workstreamItems;
      for (let cs of this.workstreamItems) {
        this.workstreamId.push(cs.id);
      }
      this.serviceForm.patchValue({workstream: this.workstreamItems});
    }
    
    setTimeout(() => {
      this.invisibleFlag = false;
    }, 100);
        
  }

  editRepairOrderDetail(){
    let formData = new FormData();
    formData.append('apiKey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('id', this.workOrderId);
    this.repairOrderApi.getWorkOrderList(formData).subscribe(response => {
      console.log(response);
      let ROViewData = response.data.items[0];
        this.approvedFlag=ROViewData.approved;
        this.editThreadId=ROViewData.thread_id;

        this.editServiceData(ROViewData);

    });
  }

  roestimationAction(data){
    this.escalationMatrix_array = data;
    console.log(this.escalationMatrix_array);
    this.jobcodeArr = [];
    if(this.escalationMatrix_array && this.escalationMatrix_array['estimationArray']?.length>0)
    {
      for (let wsd in this.escalationMatrix_array['estimationArray'])
      { 
        this.jobcodeArr.push(this.escalationMatrix_array['estimationArray'][wsd].jobcode);          
      }
    }
   console.log(this.escalationMatrix_array);
   console.log(this.jobcodeArr)
  }

     // Set Screen Height
     setScreenHeight() {  
      this.bodyHeight = window.innerHeight;  
      this.innerHeight = (this.bodyHeight - 87 );  
    } 

    closeModal() {
      let data = {
        action: 'close'
      };
      this.ROManageService.emit(data);
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();   
      this.bodyElem.classList.remove("landing-page");    
      this.bodyElem.classList.remove("view-modal-popup");    
      this.bodyElem.classList.remove('view-modal-popup-manage');
    }
}
