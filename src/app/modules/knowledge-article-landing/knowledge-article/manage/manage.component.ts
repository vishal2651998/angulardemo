import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as ClassicEditor from "src/build/ckeditor";
import { Title } from "@angular/platform-browser";
import * as moment from "moment";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../services/common/common.service";
import { ProductMatrixService } from "../../../../services/product-matrix/product-matrix.service";
import { PartsService } from "../../../../services/parts/parts.service";
import { ThreadService } from "../../../../services/thread/thread.service";
import { ApiService } from '../../../../services/api/api.service';
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { Constant, IsOpenNewTab, RedirectionPage, pageTitle, windowHeight } from "../../../../common/constant/constant";
import { ManageListComponent } from "../../../../components/common/manage-list/manage-list.component";
import { ConfirmationComponent } from "../../../..//components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../../components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "../../../../components/common/success-modal/success-modal.component";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { KnowledgeArticleService } from "src/app/services/knowledge-article/knowledge-article.service";
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { BaseService } from 'src/app/modules/base/base.service';
@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "New Knowledge Article";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public bodyClass1:string = "profile";
  public bodyClass2:string = "image-cropper";
  public industryType: any = "";
  public bannerFit: boolean = true;

  public validatePartNo: boolean = true;
  public validatePartMsg: string = "";
  public platformId: number = 0;
  public scrollPos: any = 0;
  public countryId;
  public domainId;
  public userId;
  public make: string = "";
  public headerData: Object;
  public threadType: number = 25;
  public contentType: any = 7;
  public partApiData: object;

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
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
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
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
  knowledgeArticleForm: FormGroup;
  public partId: number = 0;
  public systemId: number = 0;
  public assemblyId: number = 0;
  public manageAction: string;
  public EditAttachmentAction: string = "attachments";
  public partInfo: any;
  public partUpload: boolean = true;
  public attachmentFlag: boolean = true;

  public newTxt: string = "Create New";
  public editTxt: string = "Edit Newly Created";
  public actionInit: string = "init";
  public actionEdit: string = "edit";
  public emptyCont: string = "<i class='gray'>None</i>";

  public splitIcon: boolean = false;
  public step1: boolean = true;

  public step1Action: boolean = true;

  public step1Submitted: boolean = false;

  public saveDraftFlag: boolean = true;
  public saveText: string = "Publish";
  public nameMaxLen: number = 30;
  public maxLen: number = 60;
  public descMaxLen: number = 250;

  public loading: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public selectedPartsImg: File;
  public imgURL: any;
  public imgName: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public styleObject: any;
  public statusTxt: string = "Active";
  public partStatus: number = 1;

  public partName: string = "";
  public defaultSelection: any = 0;

  public teamSystem = localStorage.getItem("teamSystem");
  public partTypes: any;
  public partSystems: any;
  public partAssemblyItems: any;
  public soldItems: any;
  public filteredPartTypes = [];
  public filteredPartSystems = [];
  public filteredPartAssemblyItems = [];

  public partTypeId: any = "-1";
  public partTypeName: string = "";

  public knowledgeArticleTitle: string = "";
  public knowledgeArticleDescription: string = "";

  public defList: any = [{id: "All", name: "All"}];
  public mfgItems: any = [{id: "All", name: "All"}];
  public prodTypes = [{id: "All", name: "All"}];
  public appProdTypes = [{id: "All", name: "All"}];
  public years = [];
  public appFormInfo = [];
  public appList = [];
  public defMfg: any;
  public defMfgVal: any;
  public defProdType: any;
  public defProdTypeVal: any;
  public prodTypeFlag: boolean = false;

  public newWorkstreamItems = [];
  public existingWorkstreams = [];
  public workstreamItems = [];
  public filteredWorkstreamIds = [];
  public filteredWorkstreams = [];

  public tagItems: any;
  public filteredTagIds = [];
  public filteredTags = [];

  public catItems: any;
  public filteredCatIds = [];
  public filteredCats = [];

  public workstreamValid: boolean = false;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public pageAccess: string = "manageKnowledgearticles";
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public mediaUploadItems: any = [];
  public displayOrder: number = 0;
  public navUrl: string = "";
  public viewUrl: string = "knowledgearticles/view/";
  public user: any;
  public collabticDomain: boolean = false;
  public TVSDomain:boolean = false;
  public TVSIBDomain:boolean = false;
  public knowledgeDomain: boolean = false;

  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  @ViewChild("typeSelect") typeSelect: any;
  @ViewChild("systemSelect") systemSelect: any;
  @ViewChild("assemblySelect") assemblySelect: any;
  @ViewChild("soldSelect") soldSelect: any;

  public typeInputFilter: FormControl = new FormControl();
  public systemInputFilter: FormControl = new FormControl();
  public assemblyInputFilter: FormControl = new FormControl();

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private baseSerivce: BaseService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private threadApi: ThreadService,
    private scrollTopService: ScrollTopService,
    private commonApi: CommonService,
    private LandingpagewidgetsAPI: LandingpageService,
    private knowledgeArticleService: KnowledgeArticleService,
    private ProductMatrixApi: ProductMatrixService,
    private partsApi: PartsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private api: ApiService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.knowledgeArticleForm.controls;
  }
  get a() {
    return this.f.appInfo as FormArray;
  }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    this.scrollTopService.setScrollTop();
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      let pid = this.route.snapshot.params["id"];
      this.partId = pid == "undefined" || pid == undefined ? this.partId : pid;
      this.manageAction = this.partId == 0 ? "new" : "edit";
      let platformId = localStorage.getItem("platformId");
      this.platformId =
        platformId == "undefined" || platformId == undefined
          ? this.platformId
          : parseInt(platformId);
      this.industryType = this.commonApi.getIndustryType();
      this.collabticDomain =  true ; 
      this.knowledgeDomain = (platformId=='1' && this.domainId == '165') ? true : false; 
      this.TVSDomain = (platformId=='2' && this.domainId == '52') ? true : false; 
      this.TVSIBDomain = (platformId=='2' && this.domainId == '97') ? true : false; 
      console.log(this.TVSDomain);
      console.log(this.TVSIBDomain);

      let navUrl = localStorage.getItem("partNav");
      navUrl =
        navUrl == "undefined" || navUrl == undefined
          ? "knowledgearticles"
          : navUrl;
      this.viewUrl = `${this.viewUrl}${this.partId}`;
      this.navUrl =
        this.manageAction == "new" ? "knowledgearticles" : this.viewUrl;
      setTimeout(() => {
        localStorage.removeItem("partNav");
      }, 500);
      if(this.partId > 0) {
        localStorage.removeItem('knowledgeArticlesAttachments');
      }
      /*this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: false,
        search: false,
        titleFlag: this.partId == 0 ? false : true,
        title: `Knowledge Article <span>ID# ${this.partId}</span>`,
      };*/
      
      let headTitleText = '';
      let ma = this.partId == 0 ? "new" : "edit";
      switch(ma){
        case 'new':
          headTitleText = 'New Knowledge Article';
          break;
        case 'edit':
          headTitleText = 'Knowledge Article';
          break;      
      }
  
      this.headerData = {        
        title: headTitleText,
        action: ma,
        id: this.partId     
      };

      console.error(this.headerData);
      this.styleObject = {
        "background-image": "url(" + this.imgURL + ")",
        "background-repeat": "no-repeat",
        "background-position": "initial !important",
        "background-size": "cover !important",
      };
      this.partApiData = {
        access: "knowledgearticles",
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        contentType: this.contentType,
        dataId: this.partId,
        displayOrder: this.displayOrder,
      };

      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }

      if (this.partId == 0) {
        // Setup Part Form Fields
        this.setupForm();

        // Get Workstream Lists
        this.getWorkstreamLists();
      } else {
        this.title = "Edit Knowledge Article";
        this.titleService.setTitle(
          localStorage.getItem("platformName") + " - " + this.title
        );
        // Get Parts Details
        this.getKnowledgeArticlesDetails();
      }

      setTimeout(() => {
        this.setScreenHeight();
      }, 200);
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  // Get GTS Details
  getKnowledgeArticlesDetails() {
    const apiFormData = new FormData();

    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("threadId", this.partId.toString());

    this.knowledgeArticleService
      .getKnowledgeArticlesDetails(apiFormData)
      .subscribe((response) => {
        console.log(response);
        let partsInfo = response.articlesData[0];
        this.partInfo = partsInfo;

        if (this.partInfo.isDefaultImg == 1) {
          this.imgURL = null;
          this.imgName = null;
        } else {
          this.imgURL = this.partInfo.bannerImage == "" ? null : this.partInfo.bannerImage;
          this.imgName = this.partInfo.bannerImage == "" ? null : this.partInfo.kaBaseImage;
          this.bannerFit = (this.partInfo.bannerOption == 0) ? false : true;
        }

        this.knowledgeArticleTitle = this.partInfo.threadTitle;
        this.knowledgeArticleDescription = this.partInfo.description;
        // this.partName = commonData.partName;

        this.existingWorkstreams = JSON.parse(partsInfo.groups);
        this.filteredWorkstreamIds = this.existingWorkstreams;

        this.tagItems = partsInfo.tagsList;
        this.filteredTagIds =
          this.tagItems != "" ? JSON.parse(this.tagItems) : this.tagItems;
        this.filteredTags = partsInfo.tagsNames;
        
        if(partsInfo.categoryOptions != undefined){
          if(partsInfo.categoryOptions.length>0){
            for (let t in partsInfo.categoryOptions) {
                this.filteredCatIds.push(partsInfo.categoryOptions[t].id);
                this.filteredCats.push(partsInfo.categoryOptions[t].name);
            }
          }
        }
        this.attachmentItems = partsInfo.uploadContents;
        localStorage.setItem('knowledgeArticlesAttachments', JSON.stringify(this.attachmentItems));
        // this.displayOrder = partsInfo.lastOrder;
        // this.partApiData['displayOrder'] = this.displayOrder;
        for (let a of this.attachmentItems) {
          a.captionFlag = a.fileCaption != "" ? false : true;
          if (a.flagId == 6) {
            a.url = a.filePath;
            a.linkFlag = false;
            a.valid = true;
          }
        }

        // let editActionStatus = (partsInfo.isPublished == 2) ? partsInfo.isPublished : 1;
        // this.saveDraftFlag = (editActionStatus == 1) ? true : false;
        // this.saveText = (this.saveDraftFlag) ? 'Publish' : 'Save';
        // Get Workstream Lists
        this.getWorkstreamLists();
      });
  }

  // Get Workstream Lists
  getWorkstreamLists() {
    let type: any = 1;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("type", type);

    this.ProductMatrixApi.getWorkstreamLists(apiFormData).subscribe(
      (response) => {
        let resultData = response.workstreamList;
        for (let ws of resultData) {
          this.workstreamItems.push({
            workstreamId: ws.id,
            workstreamName: ws.name,
          });
        }

        if(this.industryType.id == 2) {
          this.getMfgList();
        }
        // Get Parts Base Info
        this.getProdTypes();
      }
    );
  }

  // Get Mfg List
  getMfgList(make='') {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('makeName', make);
    this.LandingpagewidgetsAPI.getMfgList(apiFormData).subscribe((response) => {
      let mfgItems = response.items;
      mfgItems.forEach(item => {
        this.mfgItems.push({
          id: item.id,
          name: item.name
        });
      });
      this.defMfgVal = "";
      this.defMfg = "";
      console.log(this.mfgItems)
    });
  }

  // Get Product Types
  getProdTypes(index:any='', mfg='', modalFlag=false) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    if(mfg != '') {
      let mfgId: any = [];
      this.appFormInfo[index].makeList = [];
      mfgId.push(mfg);
      apiFormData.append('manufacturer', JSON.stringify(mfgId));
    }
    if (this.partId > 0) {
      apiFormData.append("access", "Edit Part");
    }
    this.ProductMatrixApi.fetchProductMakeLists(apiFormData).subscribe(
      (response) => {
        if (response.status == "Success") {
          console.log(response);
          this.loading = false;
          let resultData = response.modelData;
          this.defProdTypeVal = "";
          this.defProdType = "";

          for (let p of resultData) {
            if(this.industryType.id == 2 && this.appFormInfo.length > 0) {
              this.appFormInfo[index].makeList.push({
                id: p.makeName,
                name: p.makeName,
              });
            }
            if(index == '') {
              this.prodTypes.push({
                id: p.makeName,
                name: p.makeName,
              });
              this.appProdTypes.push({
                id: p.makeName,
                name: p.makeName,
              });
            }            
          }
          if(mfg == '') {
            // Setup App Form Fields
            this.setupForm();
          } else {
            if(modalFlag) {
              this.appFormInfo[index].models = [];
              this.appFormInfo[index].modelList = [];
            }
            console.log(this.appFormInfo[index].makeList.length)
            if(this.appFormInfo[index].makeList.length == 1) {
              this.appFormInfo[index].modelLoading = true;
              this.getAppModels(this.actionInit, index, this.appFormInfo[index].makeList[0]['name']);
            }
          }            
        }
      }
    );
  }
  get knowledgeArticleFormControl() {
    return this.knowledgeArticleForm.controls;
  }
  // Setup Part Form Fields
  setupForm() {
    if (this.partId > 0) {
      let commonData = this.partInfo;
      let appData =
        commonData.makeModels == "" ? "" : JSON.parse(commonData.makeModels);
      if(this.industryType.id == 2) {
        if (appData.length == 1 && appData[0].manufacturer == "All") {
          this.defMfg = "All";
          this.defMfgVal = "All";
          this.prodTypeFlag = false;
        } else {
          this.defMfg = appData;
          this.prodTypeFlag = this.defMfg == "" ? false : true;
        }
        if (this.prodTypeFlag) {
          this.defMfgVal = appData[0].manufacturer;
        }
      } else {   
        if (appData.length == 1 && appData[0].genericProductName == "All") {
          this.defProdType = "All";
          this.prodTypeFlag = false;
        } else {
          this.defProdType = appData;
          this.prodTypeFlag = this.defProdType == "" ? false : true;
        }

        if (this.prodTypeFlag) {
          this.defProdType = appData[0].genericProductName;
        }
      }
    }

    this.knowledgeArticleForm = this.formBuilder.group({
      action: [""],
      domainId: [this.domainId],
      countryId: [this.countryId],
      userId: [this.userId],
      bannerFit: [this.bannerFit],
      knowledgeArticleTitle: [this.knowledgeArticleTitle, [Validators.required]],
      knowledgeArticleDescription: [this.knowledgeArticleDescription, [Validators.required]],
      mfgVal: [this.defMfgVal],
      prodTypeVal: [this.defProdType],
      appInfo: this.formBuilder.array([]),
      workstreams: [""],
      tags: [this.tagItems],
    });

    if (this.partId > 0) {
      let commonData = this.partInfo;
      let appData = commonData.makeModels == "" ? "" : JSON.parse(commonData.makeModels);
      if(this.industryType.id == 2) {
        if (appData.length == 1 && appData[0].manufacturer == "All") {
          this.defMfgVal = "All";
          this.defMfg = "All";
          this.prodTypeFlag = false;
        } else {
          this.defMfg = appData;
          this.prodTypeFlag = this.defMfgVal == "" ? false : true;
        }

        if (this.prodTypeFlag) {
          if(appData.length > 0) {
            console.log(appData)
            this.defMfg = appData[0].manufacturer;
          }
          let appLen = appData.length;
          for (let a = 0; a < appLen; a++) {
            let mfi = this.mfgItems.findIndex(option => option.name == appData[a].manufacturer);
            let mfg = this.mfgItems[mfi].id;
            this.addAppFields(this.actionEdit, a, appData[a].genericProductName, mfg);
            this.getProdTypes(a, mfg);            
          }
        }
      } else {
        if (appData.length == 1 && appData[0].genericProductName == "All") {
          this.defProdType = "All";
          this.prodTypeFlag = false;
        } else {
          this.defProdType = appData;
          this.prodTypeFlag = this.defProdType == "" ? false : true;
        }

        if (this.prodTypeFlag) {
          this.defProdType = appData[0].genericProductName;
          let appLen = appData.length;
          for (let a = 0; a < appLen; a++) {
            this.addAppFields(this.actionEdit, a, appData[a].genericProductName);
          }
        }
      }      
    }
  }

  // On File Upload
  onFileUpload(event) {
    let uploadFlag = true;
    this.selectedPartsImg = event.target.files[0];
    let type = this.selectedPartsImg.type.split("/");
    let type1 = type[1].toLowerCase();
    let fileSize = this.selectedPartsImg.size / 1024 / 1024;
    this.invalidFileErr = "";

    if (fileSize > 8) {
      uploadFlag = false;
      this.invalidFileSize = true;
      this.invalidFileErr = "File size exceeds 2 MB";
    }

    if (uploadFlag) {
      if (type1 == "jpg" || type1 == "jpeg" || type1 == "png") {
        this.OnUploadFile();
      } else {
        this.invalidFile = true;
        this.invalidFileErr = "Allow only JPEG or PNG";
      }
    }

    return false;
  }

  OnUploadFile() {
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedPartsImg);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.imgName = null;
    };
  }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedPartsImg = null;
    this.imgURL = this.selectedPartsImg;
    this.imgName = null;
  }

  // Disable Selection
  disableSelection() {
    return true;
  }

  fieldChange(index, field, value) {
    let action;
    console.log(field + "::" + value+ "::" +index);
    switch (field) {
      case 'defMfg':
        if (value != "All") {
          this.prodTypeFlag = true;  
          this.addAppFields(this.actionInit, index, '', value);
          if (index == 0) {
            localStorage.setItem("appMfg", value);
          }
          this.getProdTypes(index, value);
          setTimeout(() => {
            this.defMfgVal = value;
          }, 500);
        }        
        break;
      case "defProdType":
        if (value != "All") {
          action = "create";
          this.prodTypeFlag = true;
          if (index == 0) {
            localStorage.setItem("appProdType", value);
          }
          this.addAppFields(this.actionInit, index, value);
          setTimeout(() => {
            this.defProdType = value;
          }, 500);
        }
        break;
      case "mfg":  
      case "prodType":
        let removeFlag = false;
        let appLen = this.appFormInfo.length;
        let appType = (field == 'mfg') ? 'appMfg' : 'appProdType';
        if (index == 0 && value == "All") {
          if(field == 'mfg') {
            this.defMfg = "All";
            this.defMfgVal = "All";
            this.appFormInfo[index].actionFlag = true;
          }
          if (this.appFormInfo[index].actionFlag) {
            const modalRef = this.modalService.open(
              ConfirmationComponent,
              this.modalConfig
            );
            modalRef.componentInstance.access = "Remove Vehicles";
            modalRef.componentInstance.confirmAction.subscribe(
              (receivedService) => {
                modalRef.dismiss("Cross click");
                console.log(receivedService);
                removeFlag = receivedService;
                this.appFormInfo[index].makeValid = false;
                this.appFormInfo[index].actionFlag = false;
                if (!removeFlag) {
                  let ptype = localStorage.getItem(appType);
                  if(field == 'mfg') {
                    this.defMfgVal = "";
                    this.appFormInfo[index].mfgValid = true;
                    this.appFormInfo[index].manufacturer = ptype;
                  } else {
                    this.appFormInfo[index].genericProductName = ptype;
                  }
                } else {
                  localStorage.removeItem(appType);
                  for (let a = 0; a < appLen; a++) {
                    this.removeAppFields(a);
                  }
                }
              }
            );
          } else {
            removeFlag = true;
          }
          if (removeFlag) {
            localStorage.removeItem(appType);
            for (let a = 0; a < appLen; a++) {
              this.removeAppFields(a);
            }
          }
          return false;
        } else {
          if(field == 'mfg') {
            this.prodTypeFlag = true;  
            this.appFormInfo[index].mfgValid = true;
            this.appFormInfo[index].actionFlag = true;
            if (index == 0) {
              localStorage.setItem("appMfg", value);
            }
            this.getProdTypes(index, value, true);
            setTimeout(() => {
              this.defMfgVal = value;
            }, 500);
          } else {
            this.appFormInfo[index].makeValid = true;
            this.appFormInfo[index].actionFlag = true;
            if (index == 0) {
              localStorage.setItem("appProdType", value);
            }
            action = "change";
            this.appFormInfo[index].modelLoading = true;
            this.getAppModels(this.actionInit, index, value);
          }          
          this.appFormInfo[index].prodTypeValid = true;
        }
        break;
    }
  }

  // Create Application Fields
  addAppFields(action, index, value, mfgVal='') {
    let valid = action == "edit" ? true : false;
    console.log(action, index, value, mfgVal)
    let mfgName = '';
    let industryType = this.industryType.id;
    let validFlag = (industryType == 2) ? true : false;
    this.appFormInfo.push({
      genericProductName: value,
      prodTypeValid: false,
      modelList: [],
      models: [],
      years: [],
      yearVal: [],
      modelValid: validFlag,
      yearValid: true,
      modelLoading: true,
      actionFlag: false,
      addFlag: true,
    });

    if(this.industryType.id == 2) {
      console.log(this.appFormInfo[index])
      let mfi = this.mfgItems.findIndex(option => option.id == mfgVal);
      mfgName = (mfi >= 0) ? this.mfgItems[mfi].name : mfgName;
      this.appFormInfo[index]['makeList'] = this.appProdTypes,
      this.appFormInfo[index]['manufacturer'] = mfgVal; 
      this.appFormInfo[index]['mfgValid'] = (index > 0 && action == 'init') ? false : true;
      this.appFormInfo[index]['actionFlag'] = (index > 0 && action == 'init') ? false : true;
      this.appFormInfo[index]['makeValid'] = false;
      console.log(this.appFormInfo)
    }

    this.appList.push({
      class: "app-info",
      title: (this.industryType.id == 2) ? mfgName : value,
      isDisabled: false,
      isExpanded: true,
    });

    if(this.industryType.id == 2) {
      console.log(mfgName, index)
      //this.appFormInfo[index].mfgValid = true;
      this.a.push(
        this.formBuilder.group({
          manufacturer: [mfgName],
          genericProductName: [""],
          model: [""],
          year: [""],
        })
      );
      console.log(this.a)
    } else {
      this.a.push(
        this.formBuilder.group({
          genericProductName: [""],
          model: [""],
          year: [""],
        })
      );
    }

    if (action == this.actionInit) {
      if (index == 0) {
        this.appFormInfo[index].prodTypeValid = true;
      }

      if (index > 0) {
        if (this.prodTypes.length == this.appProdTypes.length) {
          this.appProdTypes.splice(0, 1);
        }
        console.log(index, this.appProdTypes, this.appFormInfo[index]);
        this.appFormInfo[index - 1].addFlag = false;
      }
    }

    if (action == "edit") {
      if(index > 0) {
        this.appFormInfo[index - 1].addFlag = false;
      }
      let commonData = this.partInfo;
      let appDetails = JSON.parse(commonData.makeModels);
      console.log(index, appDetails)
      this.appFormInfo[index].models = appDetails[index].model;
      this.knowledgeArticleForm.value.appInfo[index].model =  this.appFormInfo[index].models;
      for (let year in appDetails[index].year) {
        let y = appDetails[index].year[year];
        let sy = y == "All" ? [0] : y;
        appDetails[index].year[year] = sy;
      }
      this.appFormInfo[index].years = appDetails[index].year;
      this.knowledgeArticleForm.value.appInfo[index].year =
        this.appFormInfo[index].years;
      if (index == 0) {
        this.defProdType = value;
        this.knowledgeArticleForm.value.prodTypeVal = value;
      }
      console.log(this.appFormInfo[index].models);
    }
    setTimeout(() => {
      if(this.industryType.id != 2 || action == 'edit') {
        this.getAppModels(action, index, value);
      }
    }, 500);
  }

  // Remove Application Fields
  removeAppFields(index) {
    this.a.removeAt(index);
    this.appList.splice(index, 1);
    this.appFormInfo.splice(index, 1);
    if (index == 0) {
      this.prodTypeFlag = (this.appFormInfo.length == 0) ? false : true;
      let removeItem = (this.industryType.id == 2) ? 'appMfg' : 'appProdType';
      if(this.industryType.id == 2) {
        this.defMfg = "";
        this.defMfgVal = "";
        this.knowledgeArticleForm.value.mfgVal = "";
      } else {
        this.defProdType = "";
        this.knowledgeArticleForm.value.prodTypeVal = "";  
      }
      localStorage.removeItem(removeItem);
    } else {
      let removeIndex = this.appFormInfo.length == index ? index - 1 : index;
      this.appFormInfo[removeIndex].addFlag = true;
    }
  }

  // Get App Models
  getAppModels(action, index, value) {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      threadType: this.threadType,
      searchText: "",
      make: value,
    };
    this.appFormInfo[index].modelList = [];
    this.partsApi.getModels(apiData).subscribe((response) => {
      if (response.status == "Success") {
        this.loading = false;
        let resultData = response.data.model;
        this.appFormInfo[index].modelList.push({
          id: "All",
          name: "All",
        });
        for (let m of resultData) {
          this.appFormInfo[index].modelList.push({
            id: m,
            name: m,
          });
        }
        this.appFormInfo[index].modelLoading = false;

        if (index == 0 || this.industryType.id == 2) {
          this.appFormInfo[index].genericProductName = value;
        }
        this.appList[index].title = value;
      }
    });
  }

  // Manage List
  manageList(field) {
    // if (this.teamSystem) {
    //   console.error("windowHeight.heightMsTeam", windowHeight.heightMsTeam);
    //   this.innerHeight = windowHeight.heightMsTeam;
    // } else {
    //   let headerHeight =
    //     document.getElementsByClassName("prob-header")[0].clientHeight;
    //   let footerHeight =
    //     document.getElementsByClassName("footer-content")[0].clientHeight;
    //   this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 20);
    //   this.innerHeight = this.bodyHeight > 1420 ? 980 : this.innerHeight;
    //   console.error("this.innrheight----", this.innerHeight);
    // }

    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      threadType: this.threadType,
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
    switch (field) {
      case "tag":
        access = "Tags";
        filteredItems = this.filteredTagIds;
        filteredTags = this.filteredTags;
        inputData = { };
        break;
      case "category":
        apiData["isNew"] = "1";
        access = "newthread";
        filteredItems = this.filteredCatIds;
        filteredTags = this.filteredCats;
        inputData = {
          actionApiName: "",
          actionQueryValues: "",
          selectionType: "multiple",
          field:'category',   
          title: "Category",
          filteredItems: filteredItems,
          filteredLists: filteredTags,
          baseApiUrl: baseUrl,
          apiUrl: baseUrl+""+Constant.getCategoryData,
       };
        break;
    }

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    if(field == "category"){
      modalRef.componentInstance.inputData = inputData;
    }
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredTags;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      let items = receivedService;
      switch (field) {
        case "tag":
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
          break;
        case 'category':
          this.filteredCatIds = [];
          this.filteredCats = [];
          for (let t in items) {
            let chkIndex = this.filteredCatIds.findIndex(
              (option) => option == items[t].id
            );
            if (chkIndex < 0) {
              this.filteredCatIds.push(items[t].id.toString());
              this.filteredCats.push(items[t].name);
            }
          }
          console.log(this.filteredCats, this.filteredCatIds);
          break;
      }
    });
  }

  // Disable Tag Selection
  disableTagSelection(index) {
    this.filteredTagIds.splice(index, 1);
    this.filteredTags.splice(index, 1);
  }

    // Disable Tag Selection
    disableCatgSelection(index) {
      this.filteredCatIds.splice(index, 1);
      this.filteredCats.splice(index, 1);
    }

  // Publish or Save Draft
  submitAction(action) {
    this.saveDraftFlag = action == "save" ? true : false;
    this.onSubmit();
  }

  // On Submit
  onSubmit() {
    console.log(this.knowledgeArticleForm.value);

    this.step1Submitted = true;

    if (this.invalidFile || this.invalidFileSize) {
      return false;
    }

    /*if(this.knowledgeArticleForm.value.prodTypeVal == '') {
        return false;
      }*/
    console.log(this.knowledgeArticleForm.value.appInfo);
    let industryType = this.industryType.id;
    if (Array.isArray(this.knowledgeArticleForm.value.appInfo) && this.knowledgeArticleForm.value.appInfo.length) {
      for (let a of this.knowledgeArticleForm.value.appInfo) {
        let mfg = a.manufacturer;
        let ptype = a.genericProductName;
        let model = a.model;
        let year = a.year == 0 ? [0] : a.year;
        a.year = year;
        console.log(a);
        //if(ptype == '' || model.length == 0 ||  year.length == 0) {
          if(industryType != 2 && (ptype == '' || model.length == 0 ||  year.length == 0) || 
          (industryType == 2 && mfg == '')) {
          return false;
        }
      }
    }

    // stop here if form is invalid
    if (this.knowledgeArticleForm.invalid) {
      return;
    }

    // this.step1Submitted = false;
    // this.partUpload = true;

    if (this.filteredWorkstreams.length == 0) {
      this.workstreamValid = false;
      return false;
    } else {
      this.workstreamValid = true;
    }

    console.log(this.uploadedItems);
    let upItems = Object.keys(this.uploadedItems);
    console.log(upItems.length);
    if (upItems.length > 0 && this.uploadedItems.items.length > 0) {
      let valid = true;
      let ui = 0;
      let eid = "alink";
      for (let u of this.uploadedItems.attachments) {
        if (!u.valid) {
          valid = u.valid;
          if (!u.validError) {
            eid = `empty-link-${ui}`;
            let errLink = document.getElementById(eid);
            errLink.classList.remove("hide");
          }
        }
        ui++;
        u.fileCaption = u.fileCaption == "" ? u.fileCaptionVal : u.fileCaption;
      }

      if (!valid) {
        this.errorSecTop(eid);
        return false;
      }
    }

    this.knowledgeArticleForm.value.workstreams = this.filteredWorkstreamIds;
    this.knowledgeArticleForm.value.tags = JSON.stringify(this.filteredTags);
    let knowledgeArticleFormVal = this.knowledgeArticleForm.value;
    console.error(knowledgeArticleFormVal);
    let action = this.saveDraftFlag ? 1 : 2;
    let actionTxt = this.saveDraftFlag ? "Save" : "Publish";
    knowledgeArticleFormVal.action = action;

    if (knowledgeArticleFormVal.prodTypeVal == "All") {
      let appInfo = [
        {
          genericProductName: knowledgeArticleFormVal.prodTypeVal,
          model: [],
          year: [0],
        },
      ];
      if(industryType == 2) {
        appInfo['manufacturer'] = '';
      }
      knowledgeArticleFormVal.appInfo = JSON.stringify(appInfo);
    } else {
      let kappInfo = knowledgeArticleFormVal.appInfo;
      knowledgeArticleFormVal.appInfo = Array.isArray(kappInfo) ? JSON.stringify(kappInfo) : kappInfo;
    }

    if (action == 2) {
      const modalRef = this.modalService.open(
        ConfirmationComponent,
        this.modalConfig
      );
      modalRef.componentInstance.access = actionTxt;
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss("Cross click");
        if (!receivedService) {
          return;
        } else {
          console.log(knowledgeArticleFormVal);
          this.partSubmit(action, knowledgeArticleFormVal);
        }
      });
    } else {
      console.log(knowledgeArticleFormVal);
      this.partSubmit(action, knowledgeArticleFormVal);
    }
  }

  // Error Section Scroll
  errorSecTop(action = "") {
    let id, addPos;
    if (action != "") {
      id = action;
      addPos = 0;
    } else {
      id = "valid-error";
      addPos = 80;
    }
    let secElement = document.getElementById("step");
    let errElement = document.getElementById(id);
    let scrollTop = errElement.offsetTop;
    setTimeout(() => {
      if (action == "") {
        this.scrollPos = scrollTop + addPos;
        secElement.scrollTop = this.scrollPos;
      } else {
        errElement.scrollIntoView();
      }
    }, 200);
  }

  // Submit Part
  partSubmit(action, partFormVal) {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );
    let partImg = this.imgURL != null ? this.selectedPartsImg : "";
    if(this.industryType.id == 2) {
      let kappInfo = JSON.parse(this.knowledgeArticleForm.value.appInfo);
      this.knowledgeArticleForm.value.appInfo = kappInfo;
      for (let i in kappInfo) {
        let item = kappInfo[i];
        console.log(i, item)
        if(item.manufacturer != 'All') {
          let mfi = this.mfgItems.findIndex(option => option.id == parseInt(item.manufacturer));
          console.log(mfi)
          item.manufacturer = this.mfgItems[mfi].name;
        }
        if(item.make != '') {
          item.model = (item.model.length == 0) ? ['All'] : item.model;
        } else {
          item.model = [];
        }       
        this.knowledgeArticleForm.value.appInfo[i] = item;
      }
      kappInfo = this.knowledgeArticleForm.value.appInfo;
      this.knowledgeArticleForm.value.appInfo = Array.isArray(kappInfo) ? JSON.stringify(kappInfo) : kappInfo;
    }
    
    console.log(this.knowledgeArticleForm.value)
    if(this.partId > 0) {
      if(this.imgName == null) {
        partImg = (this.selectedPartsImg == undefined) ? "" : this.selectedPartsImg;
      } else {
        partImg = this.imgName;
      }
    }

    let uploadCount = 0;
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
      this.uploadedItems.attachments.forEach(item => {
        console.log(item)
        if(item.accessType == 'media') {
          this.mediaUploadItems.push({fileId: item.fileId.toString()});
        } else {
          uploadCount++;
        }       
      });
    }

    let bannerFit:any = 1;
    if(partImg != '') {
      bannerFit = (partFormVal.bannerFit) ? 1 : 0;
    }

    let partFormData = new FormData();
    let workstreams: any = JSON.stringify(this.filteredWorkstreamIds);
    let tags: any = JSON.stringify(this.filteredTagIds);
    partFormData.append("action", action);
    partFormData.append("apiKey", Constant.ApiKey);
    partFormData.append("domainId", partFormVal.domainId);
    partFormData.append("countryId", partFormVal.countryId);
    partFormData.append("userId", partFormVal.userId);
    partFormData.append("bannerImage", partImg);
    partFormData.append("bannerOption", bannerFit);
    partFormData.append("title", partFormVal.knowledgeArticleTitle);
    partFormData.append("description", partFormVal.knowledgeArticleDescription);
    partFormData.append("makeModel", partFormVal.appInfo);
    partFormData.append("groups", workstreams);
    partFormData.append("tags", tags);
    partFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    //let data = ["2"];

    if(this.collabticDomain){
      let data = this.filteredCatIds;
      partFormData.append('categories', JSON.stringify(data));
    }
    console.log(this.partId);
    let pushFormData = new FormData();
    pushFormData.append('apiKey', Constant.ApiKey);
    pushFormData.append('domainId', this.domainId);
    pushFormData.append('countryId', this.countryId);
    pushFormData.append('userId', this.userId);
    pushFormData.append('groups', workstreams);
    pushFormData.append('contentTypeId', this.contentType);    
    if (this.partId > 0) {
      console.log(this.deletedFileIds);
      let action: any = 1;
      let partId: any = this.partId;
      partFormData.append("editMode", action);
      partFormData.append("dataId", partId);
      partFormData.append("updatedAttachments",JSON.stringify(this.updatedAttachments));
      partFormData.append("deletedFileIds",JSON.stringify(this.deletedFileIds));
      partFormData.append('removeFileIds', JSON.stringify(this.removeFileIds));
      localStorage.removeItem('knowledgeArticlesAttachments');
    }
    console.log(partFormData);

    this.knowledgeArticleService
      .manageKnowledgeArticle(partFormData)
      .subscribe((response) => {
        modalRef.dismiss("Cross click");
        this.bodyElem.classList.remove(this.bodyClass);
        this.successMsg = response.result;
        if (response.status == "Success") {
          if(this.partId > 0) {
            let flag: any = true;
            //let threadInfo = response.dataInfo[0];
            let url = RedirectionPage.KnowledgeArticles;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            let routeLoadText = pageTitle[pageDataIndex].routerText;
            let navEditText = pageTitle[pageDataIndex].navEdit;
            localStorage.setItem(navEditText, flag);
            localStorage.setItem(routeLoadText, flag);
            localStorage.setItem("editKAFlag", "1");
            /*let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
            localStorage.setItem(pageTitle[pageDataIndex].navEdit, 'true');
            localStorage.setItem(pageDataInfo, JSON.stringify(threadInfo));*/
          } else {
            let threadId = (this.partId == 0) ? response.data.threadId : this.partId;
            let postId = threadId;
            pushFormData.append('threadId', threadId);
            pushFormData.append('postId', postId);
          }
          if (Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            this.partUpload = false;
            this.partApiData["uploadedItems"] = this.uploadedItems.items;
            this.partApiData["attachments"] = this.uploadedItems.attachments;
            this.partApiData["message"] = this.successMsg;
            this.partApiData["threadId"] = response.data.threadId; // navigate to view page
            this.partApiData["dataId"] = response.data.postId;
            this.partApiData["threadAction"] = this.partId > 0 ? "edit" : "new";
            this.partApiData["navUrl"] = this.navUrl;
            this.partApiData["workstreams"] = workstreams;
            this.manageAction = "uploading";
            setTimeout(() => {
              this.partUpload = true;
            }, 500);
          } else {
            if(this.partId == 0) {
              //this.threadApi.threadPush(pushFormData).subscribe((response) => {});
            }
            let apiDatasocial = new FormData();    
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', response.data.threadId);
              apiDatasocial.append('userId', this.userId); 
              apiDatasocial.append('action', 'create'); 
              apiDatasocial.append('actionType', '6'); 
                let platformIdInfo = localStorage.getItem('platformId');
             
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
             
            const msgModalRef = this.modalService.open(
              SuccessModalComponent,
              this.modalConfig
            );
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss("Cross click");
              if(this.partId > 0 && this.manageAction == 'edit' && this.navUrl != RedirectionPage.KnowledgeArticles) {
                let flag: any = true;
                let pageDataIndex = pageTitle.findIndex(option => option.slug == RedirectionPage.KnowledgeArticles);
                let navEditText = pageTitle[pageDataIndex].navEdit;
                let routeLoadText = pageTitle[pageDataIndex].routerText;
                localStorage.setItem(navEditText, flag);
                localStorage.setItem(routeLoadText, flag);
              }
              if(this.partId > 0) {
                this.router.navigate([this.navUrl]);
              } else {
                window.close();
                window.opener.location.reload();
              }
            }, 2000);
          }
        }
      });
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
        if (this.teamSystem) {
          window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
        } else {
          if(this.partId == 0) {
            window.close();
          } else {
            window.close();
           /* let url = RedirectionPage.KnowledgeArticles;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            localStorage.setItem(pageTitle[pageDataIndex].navCancel, 'true');
            this.router.navigate([this.navUrl]);*/
          }
        }
      }
    });
  }

  // Selected Models
  selectedModels(index, list) {    
    let items = list.items;
    this.knowledgeArticleForm.value.appInfo[index].model = items;
    this.appFormInfo[index].models = items;
    if(this.industryType.id != 2) {
      this.appFormInfo[index].modelValid = this.knowledgeArticleForm.value.appInfo[index].model.length == 0 ? false : true;
      this.appFormInfo[index].actionFlag = this.appFormInfo[index].modelValid ? true : false;
      this.appFormInfo[index].prodTypeValid = this.appFormInfo[index].genericProductName.length == 0 ? false : true;
    }
  }

  // Selected Years
  selectedYears(index, list) {
    console.log(list);
    let items = list.items;
    this.knowledgeArticleForm.value.appInfo[index].year = items;
    this.appFormInfo[index].years = items;
    if(this.industryType.id != 2) {
      //this.appFormInfo[index].yearValid = (this.knowledgeArticleForm.value.appInfo[index].year.length == 0) ? false : true;
      //this.appFormInfo[index].actionFlag = (this.appFormInfo[index].modelValid && this.appFormInfo[index].yearValid) ? true : false;
      this.appFormInfo[index].actionFlag = this.appFormInfo[index].modelValid ? true : false;
    }
  }

  // Selected Workstreams
  selectedWorkstreams(items) {
    this.filteredWorkstreamIds = items;
    if (this.manageAction == "new") {
      this.newWorkstreamItems = this.filteredWorkstreamIds;
    } else {
      this.newWorkstreamItems = [];
      for (let ws of items) {
        let index = this.existingWorkstreams.findIndex(
          (option) => option == ws
        );
        if (index < 0) {
          this.newWorkstreamItems.push(ws);
        }
      }
    }

    this.filteredWorkstreams = [];
    for (let ws of this.workstreamItems) {
      for (let i of items) {
        if (ws.workstreamId == i) {
          this.filteredWorkstreams.push(ws.workstreamName);
        }
      }
    }

    this.workstreamValid = this.filteredWorkstreams.length == 0 ? false : true;
  }

  // Get Uploaded Items
  attachments(items) {
    if(items.action == 'insert') {
      let minfo = items.media;
      let mindex = this.attachmentItems.findIndex(option => option.fileId == minfo.fileId);
      if(mindex < 0) {
        this.attachmentItems.push(minfo);
        this.attachmentFlag = false;
        setTimeout(() => {
          this.attachmentFlag = true;
        }, 10);
        let dindex = this.deletedFileIds.findIndex(option => option == minfo.fileId);
        if(dindex >= 0) {
          this.deletedFileIds.splice(dindex, 1);
          this.deletedFileIds = this.deletedFileIds;
        }
        let rindex = this.removeFileIds.findIndex(option => option.fileId == minfo.fileId);
        if(rindex >= 0) {
          this.removeFileIds.splice(rindex, 1);
          this.removeFileIds = this.removeFileIds;
        }
      }
    } else if(items.action == 'remove') {
      let rmindex = this.attachmentItems.findIndex(option => option.fileId == items.media);
      this.attachmentItems.splice(rmindex, 1);
      this.attachmentFlag = false;
        setTimeout(() => {
          this.attachmentFlag = true;
        }, 10);
      this.deletedFileIds.push(items.media);
    } else {
      this.uploadedItems = items;
    }  
  }

  // Attachment Action
  attachmentAction(data) {
    console.log(data);
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;

    switch (action) {
      case "file-delete":
        this.deletedFileIds.push(fileId);
        break;
      case "file-remove":
        this.removeFileIds.push(fileId);
        break;
      case "order":
        let attachmentList = data.attachments;
        for (let a in attachmentList) {
          let uid = parseInt(a) + 1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(
            (option) => option.fileId == ufileId
          );
          if (uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: flagId == 6 ? attachmentList[a].url : "",
              displayOrder: uid,
            };
            this.updatedAttachments.push(fileInfo);
          } else {
            this.updatedAttachments[uindex].displayOrder = uid;
          }
        }
        break;
      default:
        let updatedAttachmentInfo = {
          fileId: fileId,
          caption: caption,
          url: url,
        };
        let index = this.updatedAttachments.findIndex(
          (option) => option.fileId == fileId
        );
        if (index < 0) {
          updatedAttachmentInfo["displayOrder"] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
        }

        console.log(this.updatedAttachments);
        break;
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    if (!this.teamSystem) {
      headerHeight =
        document.getElementsByClassName("prob-header")[0].clientHeight;
    }
    let footerHeight = 0;
    this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 108);
  }

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
    modalRef.componentInstance.profileType = 'ka-banner'; 
    modalRef.componentInstance.id = 0;     
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        console.log(receivedService)
        let image = receivedService.show;
        let imageFile = receivedService.response;
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass1);  
        this.bodyElem.classList.remove(this.bodyClass2);
        modalRef.dismiss('Cross click');       
        this.selectedPartsImg = imageFile;
        this.imgURL = image;
        this.imgName = null;
      }
    });
  }

  beforePanelClosed(panel) {
    panel.isExpanded = false;
    console.log("Panel going to close!");
  }
  beforePanelOpened(panel) {
    panel.isExpanded = true;
    console.log("Panel going to  open!");
  }

  afterPanelClosed() {
    console.log("Panel closed!");
  }
  afterPanelOpened() {
    console.log("Panel opened!");
  }
}
