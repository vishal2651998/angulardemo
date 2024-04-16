import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import * as ClassicEditor from "src/build/ckeditor";
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ThreadService } from "../../../services/thread/thread.service";
import { ApiService } from '../../../services/api/api.service';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { Constant, IsOpenNewTab, RedirectionPage, pageTitle, windowHeight } from "../../../common/constant/constant";
import { ManageListComponent } from "../../common/manage-list/manage-list.component";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { SuccessModalComponent } from "../../common/success-modal/success-modal.component";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { HttpClient } from "@angular/common/http";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: "app-manage-repairfy-domain",
  templateUrl: "./manage-repairfy-domain.component.html",
  styleUrls: ["./manage-repairfy-domain.component.scss"],
})
export class ManageRepairfyDomainComponent implements OnInit {
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
      bannerFit: [this.bannerFit],
    });
    this.loadDomainData();
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.domainForm.controls;
  }

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
    this.loading = true;
    let data = {
      domainId: 71,
    }
    this.threadApi.apiRepairfyDomainData(data).subscribe((res: any) => {
      this.businessDomainData = res?.data;
      this.imgURL = this.businessDomainData.bannerMainImageUrl;
      this.imgName = this.businessDomainData.market_place_main_banner_image;
      this.bannerImgUrlServer = this.businessDomainData.market_place_main_banner_image;
      this.bannerFit = this.businessDomainData.market_place_main_banner_image_fit;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }
  OnUploadFile() {
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedBannerImg);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.imgName = null;
    };
  }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedBannerImg = null;
    this.imgURL = this.selectedBannerImg;
    this.imgName = null;
    this.bannerDeleted = true;
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
    body.domainId = 71;
    this.threadApi.updateRepairyDomainMarketPlace(body).subscribe((res: any) => {
      this.loading = false;
      if (res.status == 'Success') {
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = res.message;
        setTimeout(() => {
          msgModalRef.dismiss('Cross click');
          this.router.navigateByUrl('market-place');
        }, 2000);
      }
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }

  // Close Current Window
  closeWindow() {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Cancel";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      if (!receivedService) {
        return;
      } else {
        this.router.navigate([this.navUrl]);
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    this.innerHeight = this.bodyHeight - (headerHeight + 108);
  }body

  // Update Manufacturer Logo
  updateLogo() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    let access = "reportLogo";
    const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.type = "Edit";
    modalRef.componentInstance.profileType = 'banner-image';
    modalRef.componentInstance.id = 0;
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        let image = receivedService.show;
        this.bannerImgUrlServer = receivedService.response;
        let imageFile = receivedService.response;
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass1);
        this.bodyElem.classList.remove(this.bodyClass2);
        this.bodyElem.classList.remove('auth');
        modalRef.dismiss('Cross click');
        this.selectedBannerImg = imageFile;
        this.imgURL = image;
        this.imgName = null;
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
}
