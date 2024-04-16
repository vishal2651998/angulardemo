import { Component, OnInit, ViewChild, HostListener, ElementRef  } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as ClassicEditor from "src/build/ckeditor";
import { Title } from "@angular/platform-browser";
import * as moment from "moment";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ThreadService } from "../../../services/thread/thread.service";
import { ApiService } from '../../../services/api/api.service';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { HttpClient } from "@angular/common/http";
import { SuccessModalComponent } from "../../common/success-modal/success-modal.component";
import { DomSanitizer } from '@angular/platform-browser';
import { Constant } from "../../../common/constant/constant";
import { ManageListComponent } from "../../../components/common/manage-list/manage-list.component";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
@Component({
  selector: 'app-market-place-policies',
  templateUrl: './market-place-policies.component.html',
  styleUrls: ['./market-place-policies.component.scss']
})
export class MarketPlacePoliciesComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "Policies";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public bodyClass1: string = "profile";
  public bodyClass2: string = "image-cropper";
  public domainId;
  public userId;
  public policyContent = "";
  public modifiedBy = "";
  public modifiedByImage = "";
  public modifiedOn = "";
  public bodyHeight: number;
  public innerHeight: number;
  public policies = [];
  public policyType: string = "";
  selectedPolicyId: number;
  public Editor = ClassicEditor;
  policyForm: FormGroup;
  newPolicyForm: FormGroup;
  public loading: boolean = false;
  public editMode: boolean = false;
  public navUrl: string = "market-place";
  public user: any;
  public headerData: object;
  public headerPosTop: boolean = false;
  public headerPosBottom: boolean = false;
  public msTeamAccess: boolean = false;
  public historyPopup: boolean = false;
  public policyHistory:any;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
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
    placeholder: "Enter Policy",
  };
  newPolicyPopup: boolean = false;
  @ViewChild('top', { static: false }) top: ElementRef;
  public tagItems: any;
  public filteredTagIds = [];
  public filteredTags = [];
  showEditOptions = false;
  pageAccess: string = 'market-place-policies';
  policyName: any;
  policyTags: any;
  policyTagsList = [];
  policyFormSubmitted: boolean = false;
  pageLoading: boolean = false;
  
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
    private sanitized: DomSanitizer,
    private aroute: ActivatedRoute
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.policyForm = this.formBuilder.group({
      domainId: [this.domainId],
      policyId: [0],
      userId: [this.userId],
      content: [""],
      name: [''],
      tags: ['']
    });
    this.newPolicyForm = this.formBuilder.group({
      domainId: [this.domainId],
      policyId: [0],
      userId: [this.userId],
      content: ['', Validators.required],
      name: ['', Validators.required],
      tags: ['']
    });
  }
  transformHtml(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
    this.sanitized.bypassSecurityTrustStyle(value);
  }
  get f() {
    return this.policyForm.controls;
  }
  
  get nf() {
    return this.newPolicyForm.controls;
  }

  // toggleEditMode() {
  //   this.editMode = !this.editMode;
  //   this.getPolicyData(this.selectedPolicyId)
  // }

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
    this.getPolicyTypes();
    this.msTeamAccess = false;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: false,
      search: true,
    }
    let isNew = this.aroute.snapshot.queryParams.isNew;
    if(isNew) {
      this.newPolicyPopup = true;
    }
  }

  getPolicyTypes() {
    this.loading = true;
    this.threadApi.apiMarketPlacePoliciesData(this.domainId).subscribe((res: any) => {
      if(res.status == "Success" && res.policies && res.policies.length) {
        this.policies = res.policies;
        this.getPolicyData(this.selectedPolicyId ? this.selectedPolicyId : this.policies[0].id);
      } else {
        this.loading = false;
        this.policies = [];
      }
    }, (error: any) => {
      this.loading = false;
      console.log(error);
    })
  }

  getDateFormat(value: any) {
    if (value) {
      return moment.utc(value).local().format('MMM DD, YYYY . h:mm A');
    } else {
      return '';
    }
  }

  getPolicyData(id: number) {
    this.loading = true;
    if(id == 0) this.editMode = false;
    this.selectedPolicyId = id;
    let data = {
      domainId: this.domainId,
      policyId: id,
    };
    this.f.policyId.setValue(id);
    this.threadApi.apiMarketPlacePolicyData(data).subscribe((res: any) => {
      this.policyContent = "";
      this.modifiedBy = "";
      this.modifiedByImage = "";
      this.modifiedOn = "";
      this.policyName = "";
      this.policyTags = "";
      this.policyTagsList = [];
      if(res && res.status == 'Success' && res.policy) {
        this.policyContent = res.policy.content;
        this.policyName = res.policy.name;
        this.policyTags = res.policy.tags;
        this.policyTagsList = res.policy.tagsList.map((item) => item.name);
        this.modifiedBy = res.policy.modified_by_name;
        this.modifiedByImage = res.policy.modified_by_image;
        this.modifiedOn = res.policy.modified_on;
      }
      this.f.content.setValue(this.policyContent);
      this.loading = false;
    }, (error: any) => {
      this.f.content.setValue("");
      this.loading = false;
    })
  }

  scrolled(event: any): void {
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    let topHeight = 110 * 2.5;
    let checkHt = height - topHeight
    if (position >= checkHt) {
      this.headerPosBottom = true;
      this.headerPosTop = false;
    }
    else {
      this.headerPosTop = true;
      this.headerPosBottom = false;
    }
  }

  onSubmit() {
    if (this.newPolicyForm.valid) {
      this.newPolicyPopup = false;
      this.policyFormSubmitted = false;
      this.pageLoading = true;
      this.threadApi.updateMarketPlacePolicyData({ ...this.newPolicyForm.value, tags: this.filteredTagIds.join(",") }).subscribe((res: any) => {
        this.pageLoading = false;
        if (res.status == 'Success') {
          this.editMode = false;
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = res.message;
          this.getPolicyTypes() 
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
            // location.reload();
            // this.router.navigateByUrl('market-place');
          }, 2000);
        }
      }, (error: any) => {
        this.pageLoading = false;
        console.log(error);
      })
      this.editMode = false;
    }
    else {
      this.policyFormSubmitted = true;
    }
  }

  closeWindow() {
    if(this.editMode) this.editMode = false;
    else this.router.navigate([this.navUrl]);
  }

  manageList() {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      // countryId: this.countryId,
      userId: this.userId,
      // threadType: this.threadType,
      groupId: 0,
    };

    let access;
    let filteredItems;
    let filteredTags;
    let baseUrl = "";
    let inputData = { };
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      baseUrl = Constant.TechproMahleApi;
    }
    else{
      baseUrl = Constant.CollabticApiUrl;
    }
    access = "Tags";
    filteredItems = this.filteredTagIds;
    filteredTags = this.filteredTags;
    inputData = { };

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredTags;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      let items = receivedService;
      this.filteredTagIds = [];
      this.filteredTags = [];
      for (let t in items) {
        let chkIndex = this.filteredTagIds.findIndex(
          (option) => option == items[t].id
        );
        if (chkIndex < 0) {
          this.filteredTagIds.push(items[t].id);
          this.filteredTags.push(items[t].name);
        }
      }
      console.log(this.filteredTags, this.filteredTagIds);
    });
  }

  // Disable Tag Selection
  disableTagSelection(index) {
    this.filteredTagIds.splice(index, 1);
    this.filteredTags.splice(index, 1);
  }

  
  addNewPolicy(){
    this.newPolicyPopup = true;
    this.newPolicyForm.patchValue({
      domainId: this.domainId,
      policyId: 0,
      userId: this.userId,
      content: '',
      name: '',
      tags: ''
    });
    this.filteredTagIds = [];
    this.filteredTags = [];
  }

  editPolicy(){
    this.editMode = true;
    this.newPolicyForm.patchValue({
      domainId: this.domainId,
      policyId: this.selectedPolicyId,
      userId: this.userId,
      content: this.policyContent,
      name: this.policyName,
      tags: this.policyTags
    });
    this.filteredTagIds = this.policyTags && this.policyTags != '' ? this.policyTags.split(',') : [];
    this.filteredTags = this.policyTagsList;
    this.newPolicyPopup = true;
  }

  deletePolicy(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'deletePolicy';
      modalRef.componentInstance.buttonClass = 'green-button';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        if (!receivedService) {
          return;
        } else {
          this.pageLoading = true;
          this.threadApi.deleteMarketPlacePolicy({ policyId: this.selectedPolicyId }).subscribe((res: any) => {
            this.pageLoading = false;
            if (res.status == 'Success') {
              this.editMode = false;
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = res.message;
              this.selectedPolicyId = null;
              this.getPolicyTypes() 
              setTimeout(() => {
                msgModalRef.dismiss('Cross click');
                // location.reload();
                // this.router.navigateByUrl('market-place');
              }, 2000);
            }
          }, (error: any) => {
            this.pageLoading = false;
            console.log(error);
          })
        }
      });
    
    // this.selectedPolicyId
  }
  
  showHistory() {
    this.threadApi.apiMarketPlacePolicyHistory(this.selectedPolicyId).subscribe((res) => {
      if (res.status == 'Success') {
        this.policyHistory = res.policies;
        this.historyPopup = true;
        console.log(this.policyHistory);
        
      }
    }, (error: any) => {
        this.pageLoading = false;
        console.log(error);
      })
  }
}
