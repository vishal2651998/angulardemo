import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as ClassicEditor from "src/build/ckeditor";
import { Title } from "@angular/platform-browser";
import * as moment from "moment";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../services/common/common.service";
import { ProductMatrixService } from "../../../services/product-matrix/product-matrix.service";
import { PartsService } from "../../../services/parts/parts.service";
import { ThreadService } from "../../../services/thread/thread.service";
import { ApiService } from '../../../services/api/api.service';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { Constant, IsOpenNewTab, RedirectionPage, pageTitle, windowHeight } from "../../../common/constant/constant";
import { ManageListComponent } from "../../../components/common/manage-list/manage-list.component";
import { ConfirmationComponent } from "../../..//components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { KnowledgeArticleService } from "src/app/services/knowledge-article/knowledge-article.service";
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { HttpClient } from "@angular/common/http";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: "app-manage-domain",
  templateUrl: "./manage-domain.component.html",
  styleUrls: ["./manage-domain.component.scss"],
})
export class ManageDomainComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "Company Info";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public bodyClass1:string = "profile";
  public bodyClass2:string = "image-cropper";
  public industryType: any = "";
  public bannerFit: boolean = true;
  public bannerDeleted: boolean = false;
  public platformId: number = 0;
  public scrollPos: any = 0;
  public countryId;
  public domainId;
  public userId;
  public contentType: any = 34;
  public bodyHeight: number;
  public innerHeight: number;
  public Editor = ClassicEditor;
  configCke: any = {
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
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      uploadUrl: this.api.uploadURL,
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
    language: "en",
  };
  domainForm: FormGroup;
  showViewChanges: any = false;
  public saveDraftFlag: boolean = true;
  public saveText: string = "Save";

  public loading: boolean = false;
  public imgURL: any;
  public imgName: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public invalidCompanyFile: boolean = false;
  public invalidCompanyFileSize: boolean = false;
  public invalidCompanyFileErr: string;
  public navUrl: string = "market-place";
  public user: any;
  public businessProfileId: any = 7;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  selectedBannerImg: any;
  keywordOptions: any = [
    {
      id: "test1",
      name: "test1",
    },
    {
      id: "test2",
      name: "test2",
    },
    {
      id: "test3",
      name: "test3",
    },
    {
      id: "test4",
      name: "test4",
    },
    {
      id: "test5",
      name: "test5",
    }
  ];
  keywordValue: any = null;
  bannerImgUrlServer: any = '';
  businessDomainData: any;
  companyNameDomain: any;
  summaryServiceDomain: any;
  descriptionDomain: any;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  phoneValue: any;
  websiteValue: any;
  emailValue: any;
  cityValue: any;
  stateValue: any;
  isMobileView: any = false;
  showCompanyInfo = true;
  showBannerInfo = false;
  bannerForm: FormGroup;
  landingBannerFit: any = false;
  emailBannerFit: any = false;
  landingBannerImgUrlServer: any;
  emailImgUrlServer: any;
  landingSelectedBannerImg: any;
  emailSelectedBannerImg: any;
  landingImgUrl: any;
  emailImgUrl: any;
  landingImgName: any;
  emailImgName: any;
  landingBannerDeleted: any;
  emailBannerDeleted: any;
  businessDomainBannerData: any;
  showResponsiveView: any = 'landing';

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private api: ApiService,
    private threadApi: ThreadService,
    private httpClient: HttpClient,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.domainForm = this.formBuilder.group({
      action: [""],
      domainId: [this.domainId],
      countryId: [this.countryId],
      userId: [this.userId],
      bannerFit: [this.bannerFit],
      companyName: ['', [Validators.required]],
      serviceOffered: [''],
      phone: [''],
      website: [''],
      email: ['', [Validators.email]],
      city: [''],
      state: [''],
      description: [''],
      keywords: [null],
    });
    this.bannerForm = this.formBuilder.group({
      landingBannerFit: [""],
      emailBannerFit: [""],
      showResponsiveView: [""]
    })
    this.loadDomainData();
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.domainForm.controls;
  }

  get bannerFormController() {
    return this.bannerForm.controls;
  }
  dirty = false;
  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    this.scrollTopService.setScrollTop();
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
        (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
    } else {
      this.router.navigate(["/forbidden"]);
    }
    this.setScreenHeight();


    if(this.dirty == true) {
      console.log('yes');

    }
  }

  showResponsive(type: any) {
    this.showViewChanges = true;
    if (type == 'mobile') {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  showForm() {
    this.showViewChanges = false;
  }

  loadDomainData() {
    this.showCompanyInfo = true;
    this.showBannerInfo = false;
    this.loading = true;
    let data = {
      id: this.domainId,
    }
    this.threadApi.apiMarketPlaceEditDomainData(data).subscribe((res: any) => {
      this.businessDomainData = res?.data;
      this.imgURL = this.businessDomainData.bannerImageUrl;
      this.imgName = this.businessDomainData.market_place_banner_image;
      this.bannerImgUrlServer = this.businessDomainData.market_place_banner_image;
      let phoneObject: any ={
        number: this.businessDomainData.market_place_phone_number,
        internationalNumber: this.businessDomainData.market_place_internationalNumber,
        nationalNumber: this.businessDomainData.market_place_phone_number,
        e164Number: this.businessDomainData.market_place_e164Number,
        countryCode: this.businessDomainData.market_place_country_code,
        dialCode: this.businessDomainData.market_place_dialCode,
      }
      this.selectedCountryIS0 = this.businessDomainData?.market_place_country_code?.toLowerCase();
      this.bannerFit = (this.businessDomainData.market_place_banner_fit && parseInt(this.businessDomainData.market_place_banner_fit)) ? true : false,
      this.companyNameDomain = this.businessDomainData.market_place_company_name ? this.businessDomainData.market_place_company_name : this.businessDomainData.market_place_company_name,
      this.summaryServiceDomain = this.businessDomainData.market_place_summary_service_offered,
      this.phoneValue = phoneObject,
      this.websiteValue = this.businessDomainData.market_place_website ? this.businessDomainData.market_place_website : this.businessDomainData.business_domain,
      this.emailValue = this.businessDomainData.market_place_email,
      this.cityValue = this.businessDomainData.market_place_city ? this.businessDomainData.market_place_city : this.businessDomainData.market_place_city,
      this.stateValue = this.businessDomainData.market_place_state ? this.businessDomainData.market_place_state : this.businessDomainData.market_place_state,
      this.descriptionDomain = this.businessDomainData.market_place_description ? this.businessDomainData.market_place_description : this.businessDomainData.description,
      this.keywordValue = this.businessDomainData.market_place_keywords ? JSON.parse(this.businessDomainData.market_place_keywords) : [];
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }

  loadBannerData() {
    this.showBannerInfo = true;
    this.showCompanyInfo = false;
    let data = {
      id: this.domainId,
    }
    this.threadApi.apiMarketPlaceEditDomainBannerData(data).subscribe((res: any) => {
      this.businessDomainBannerData = res?.data;
      this.landingImgUrl = this.businessDomainBannerData?.landingBannerImageUrl ? this.businessDomainBannerData?.landingBannerImageUrl : 'assets/images/service-provider/service-provider-banner.png';
      this.landingBannerFit = this.businessDomainBannerData?.market_place_main_banner_image_fit;
      this.landingImgName = this.businessDomainBannerData?.market_place_main_banner_image;
      this.landingBannerImgUrlServer = this.businessDomainBannerData?.market_place_main_banner_image;
      this.emailImgUrl = this.businessDomainBannerData?.emailBannerImageUrl;
      this.emailBannerFit = this.businessDomainBannerData?.market_place_email_banner_image_fit && this.businessDomainBannerData?.market_place_email_banner_image_fit != '0' ? true : false;
      this.emailImgName = this.businessDomainBannerData?.market_place_email_banner_image;
      this.emailImgUrlServer = this.businessDomainBannerData?.market_place_email_banner_image;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }
  getPhoneNumberData(event: any) {
    console.log(event);
  }
  OnUploadFile() {
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedBannerImg);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.imgName = null;
    };
  }

  submitBannerAction() {
    let body = this.bannerForm.value;
    if (this.landingBannerDeleted) {
      body.landingBannerImg = '';
    } else {
      body.landingBannerImg = this.landingBannerImgUrlServer;
    }
    if (this.emailBannerDeleted) {
      body.emailBannerImg = '';
    } else {
      body.emailBannerImg = this.emailImgUrlServer;
    }
    body.id = this.domainId;
    this.threadApi.updateDomainBannerMarketPlace(body).subscribe((res: any) => {
      this.loading = false;
      if (res.status == 'Success') {
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = res.message;
        setTimeout(() => {
          msgModalRef.dismiss('Cross click');
          // localStorage.removeItem('marketNav');
          this.router.navigateByUrl('market-place');
        }, 2000);
      }
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }

  // Remove Uploaded File
  deleteUploadedFile(type: any) {
    if (type == 'banner') {
      this.selectedBannerImg = null;
      this.imgURL = this.selectedBannerImg;
      this.imgName = null;
      this.bannerDeleted = true;
    }
    if (type == 'landing') {
      this.landingSelectedBannerImg = null;
      this.landingImgUrl = this.landingSelectedBannerImg;
      this.landingImgName = null;
      this.landingBannerDeleted = true;
    }
    if (type == 'email') {
      this.emailSelectedBannerImg = null;
      this.emailImgUrl = this.emailSelectedBannerImg;
      this.emailImgName = null;
      this.emailBannerDeleted = true;
    }
  }

  // Publish or Save Draft
  submitAction(action) {
    this.saveDraftFlag = action == "save" ? true : false;
    this.onSubmit();
  }

  // On Submit
  onSubmit() {
    if (this.domainForm.valid) {
      let body = this.domainForm.value;
      this.finalSubmit(body);
    }
  }

  finalSubmit(body: any) {
    if (this.bannerDeleted) {
      body.bannerImg = '';
    } else {
      body.bannerImg = this.bannerImgUrlServer;
    }
    body.id = this.domainId;
    body.keywords = this.keywordValue ? JSON.stringify(this.keywordValue) : '';
    console.log("body: ", body);
    this.threadApi.updateDomainMarketPlace(body).subscribe((res: any) => {
      this.loading = false;
      if (res.status == 'Success') {
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = res.message;
        setTimeout(() => {
          msgModalRef.dismiss('Cross click');
          // localStorage.removeItem('marketNav');
          this.router.navigateByUrl('market-place');
        }, 2000);
      }
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
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

  // Close Current Window
  closeWindow() {
    if (this.domainForm.touched) {
      const modalRef = this.modalService.open(
        ConfirmationComponent,
        this.modalConfig
      );
      modalRef.componentInstance.access = "Cancel";
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss("Cross click");
        if (!receivedService) {
          return;
        }
        else {
          this.router.navigate([this.navUrl]);
        }
      });
    }
    else {
      this.router.navigate([this.navUrl]);
    }

  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    this.innerHeight = this.bodyHeight - (headerHeight + 108);
  }

  // Update Manufacturer Logo
  updateLogo(type: any) {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    let access = "reportLogo";
    const modalRef = this.modalService.open(ImageCropperComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.type = "Edit";
    modalRef.componentInstance.profileType = 'banner-image-second';
    modalRef.componentInstance.id = 0;
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        let image = receivedService.show;
        let imageFile = receivedService.response;
        if (type == 'banner') {
          this.bannerImgUrlServer = receivedService.response;
          this.selectedBannerImg = imageFile;
          this.imgURL = image;
          this.imgName = null;
        }
        if (type == 'landing') {
          this.landingBannerImgUrlServer = receivedService.response;
          this.landingSelectedBannerImg = imageFile;
          this.landingImgUrl = image;
          this.landingImgName = null;
        }
        if (type == 'email') {
          this.emailImgUrlServer = receivedService.response;
          this.emailSelectedBannerImg = imageFile;
          this.emailImgUrl = image;
          this.emailImgName = null;
        }
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass1);
        this.bodyElem.classList.remove(this.bodyClass2);
        this.bodyElem.classList.remove('auth');
        modalRef.dismiss('Cross click');
      }
    });
    modalRef.result.then((data) => {
      this.bodyElem.classList.remove(this.bodyClass1);
      this.bodyElem.classList.remove(this.bodyClass2);
      this.bodyElem.classList.remove('auth');
    }, (reason) => {
      this.bodyElem.classList.remove(this.bodyClass1);
      this.bodyElem.classList.remove(this.bodyClass2);
      this.bodyElem.classList.remove('auth');
      // on dismiss
    });
  }

  manageList() {
    let filterItemValue = [];
    this.keywordValue.forEach((keyword: any) => {
      filterItemValue.push(keyword.id);
    });
    let inputData = {
      baseApiUrl: this.api.apiCollabticBaseUrl(),
      apiUrl: "resources/gettagslists",
      field: 'keywords',
      selectionType: 'multiple',
      filteredItems: filterItemValue,
      filteredLists: this.keywordValue,
      actionApiName: '',
      actionQueryValues: '',
      title: 'threads'
    };
    let access = 'New Thread Tags';
    let title = 'Keywords';
    inputData['title'] = title;
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      pushAction: false
    };
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredTags = this.keywordValue;
    modalRef.componentInstance.apiData = apiInfo;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = this.innerHeight;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      this.keywordValue = receivedService;
    });
  }

  removeValue(value: any) {
    this.keywordValue = this.keywordValue?.filter((keyword: any) => keyword.name != value);
  }
}
