import { Component, OnInit, ViewChild, HostListener, OnDestroy, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import * as moment from "moment";
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { ProbingQuestionsService } from "src/app/services/probing-questions/probing-questions.service";
import { GtsService } from "src/app/services/gts/gts.service";
import { ActionFormComponent } from "src/app/components/common/action-form/action-form.component";
import { ManageListComponent } from "src/app/components/common/manage-list/manage-list.component";
import { ManageListComponentGTS } from "src/app/components/common/manage-list-gts/manage-list.component";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Constant, IsOpenNewTab, PlatFormType, RedirectionPage, pageTitle, windowHeight } from '../../../../common/constant/constant';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { PartsService } from '../../../../services/parts/parts.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CommonService } from '../../../../services/common/common.service';
declare var $: any;

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = " GTS Procedure";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public countryId;
  public apiKey: string = "dG9wZml4MTIz";
  public domainId;
  public userId;
  public roleId;
  public gtsId;
  public gtsTitle;
  public gtsAction: string;
  public actionId: any = 1;
  public make: string = "TVS";
  public headerData: Object;
  public gtsInfo: Object;

  public bodyHeight: number;
  public innerHeight: number;
  public scrollPos: any = 0;

  public step1: boolean = true;
  public step2: boolean = false;
  public step1Action: boolean = true;
  public step2Action: boolean = false;
  public step1Submitted: boolean = false;
  public step2Submitted: boolean = false;
  public stepBack: boolean = false;
  public saveDraftFlag: boolean = false;
  public disableErrorCodeFlag: boolean = true;
  public gtsEditorFlag: boolean = false;
  public gtsPublishFlag: boolean = false;
  public gtsChartFlag: boolean = false;
  public titleMaxLen: number = 250;
  public descMaxLen: number = 200;

  public loading: boolean = true;
  public loadingMessage: string;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public selectedGtsImg: File;
  public gtsPlaceholderImg: string = "assets/images/gts/gts-placeholder.png";
  public imgURL: any;
  public imgName: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public workstreamItems: any;
  public filteredWorkstreamIds = [];
  public filteredWorkstreams = [];
  public probCategory = [];
  public filteredCategory = [];
  public dtcItems = [];
  public filteredDtcItems = [];
  public ecuTypes = [];
  public filteredEcuTypes = [];
  public moduleMft = [];
  public filteredModuleMft = [];
  public system: any;
  public filteredSystem: any;
  public tagItems: any;
  public filteredTagIds = [];
  public filteredTags = [];
  public prodTypes = [];
  public vehicleProdTypes = [];
  public years = [];
  public vehicleFormInfo = [];
  public vehicleList = [];
  public defProdType: any;
  public defProdTypeVal: any;
  public prodTypeFlag: boolean = false;
  public pblmDetailFlag: boolean = true;
  public dtcFlag: boolean = false;
  public tagFlag: boolean = true;
  public dtcId: any = 0;

  public probCatgName: string = "";
  public probCatgVal: any = "";
  public dtcVal: any = "";
  public ecuTypeName: string = "";
  public ecuTypeVal: any = "";
  public mfgName: string = "";
  public mfgVal: any = "";
  public systemVal: any = "";

  public newTxt: string = "Create New";
  public editTxt: string = "Edit Newly Created";

  public catgAction: string = "new";
  public catgActionTxt: string = this.newTxt;
  public catgId: any = "-1";
  public catgName: string = "";
  public ecuAction: string = "new";
  public ecuActionTxt: string = this.newTxt;
  public ecuId: any = "-1";
  public ecuName: string = "";
  public mfgAction: string = "new";
  public mfgActionTxt: string = this.newTxt;
  public mfgId: any = "-1";
  public mftName: string = "";
  public sysAction: string = "new";
  public sysActionTxt: string = this.newTxt;
  public sysId: any = "-1";
  public sysName: string = "";
  public tagActionTxt: string = this.newTxt;
  public dtcAction: string = "new";
  public dtcActionTxt: string = this.newTxt;
  public dtcCode: string = "";
  public dtcDesc: string = "";

  public catgInputFilter: FormControl = new FormControl();
  public ecuInputFilter: FormControl = new FormControl();
  public mfgInputFilter: FormControl = new FormControl();
  public systemInputFilter: FormControl = new FormControl();
  public dtcInputFilter: FormControl = new FormControl();

  public actionInit: string = "init";
  public actionEdit: string = "edit";
  public editActionStatus: number;
  public workstreamValid: boolean = true;
  public workflowValid: boolean = false;
  public ecuTypeValid: boolean = false;
  public mfgValid: boolean = false;
  public dtcValid: boolean = false;
  public tagValid: boolean = false;
  public notifyFlag: boolean = false;
  public legacyGts: boolean = false;
  editGtsForm: FormGroup;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public pageAccess: string = "newGts";
  public tvsFlag: boolean = false;
  public splitIcon: boolean = false;
  public platformId;
  public threadType: number = 25;
  public contentType: number = 8;
  public teamSystem=localStorage.getItem('teamSystem');
  public wsplit: boolean = false;
  public bodyClass1: string = "parts";
  public bodyClass2: string = "gts-new";
  public productMakePl: string = "";
  public industryType: any = [];
  public user: any;  
  public navUrl: string = "gts/view/";
  public errorCodeTitle: string = '';
  public errorCodebg: string = '';
  
  public errorCodeItems: any;
  public filteredErrorCodeIds = [];
  public filteredErrorCodes = [];
  public wsNav: boolean = false;
  public DICVDomain: boolean = false;
  public TVSDomain: boolean = false;
  public TVSIBDomain: boolean = false;
  public emissionFieldClear: boolean = false;

  public workflowtype: string = '';
  public workflowtypeId: number;
  public workflowtypeOptions: any = [];
  public collabticDomain: boolean = false;
  public workflowName: string = '';

  @ViewChild("catgSelect", { static: false }) catgSelect: any;
  @ViewChild("ecuSelect", { static: false }) ecuSelect: any;
  @ViewChild("mfgSelect", { static: false }) mfgSelect: any;
  @ViewChild("systemSelect", { static: false }) systemSelect: any;
  @ViewChild("dtcSelect", { static: false }) dtcSelect: any;
  @ViewChild("top", { static: false }) top: ElementRef;  

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    this.scrollPos = event.target.scrollTop;
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
    private common: CommonService,
    private probingApi: ProbingQuestionsService,
    private gtsApi: GtsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private ProductMatrixApi: ProductMatrixService,
    private partsApi: PartsService,
    private authenticationService: AuthenticationService, 
    private commonApi: CommonService,
  ) {
    //this.titleService.setTitle('Mahle Forum - '+this.title);
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.editGtsForm.controls;
  }
  get v() {
    return this.f.vehicleInfo as FormArray;
  }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    this.bodyHeight = window.innerHeight;
    this.scrollTopService.setScrollTop();
    //this.domainId = localStorage.getItem("domainId");
    //this.userId = localStorage.getItem("userId");
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;  
    this.roleId = localStorage.getItem("roleId");
    this.countryId = localStorage.getItem('countryId');
    this.gtsAction = this.route.snapshot.url[0].path;
    this.actionId = this.route.snapshot.params['actionId'];       
    let actionTitle = this.gtsAction == "duplicate" ? "New " : "Edit";
    this.title = `${actionTitle} ${this.title}`;
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    let stepActionFlag = (this.actionId == 'undefined' || this.actionId == undefined) ? false : true;
    if(stepActionFlag) {
      authFlag = (this.actionId < 1 || this.actionId > 2) ? false : true;
    }

    if (authFlag) { 
      this.gtsId = this.route.snapshot.params["gid"];
      this.navUrl = `${this.navUrl}${this.gtsId}`;
      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      this.tvsFlag = (this.platformId == 2 && this.domainId == 52) ? true : false;
      this.TVSIBDomain = (this.platformId == 2 && this.domainId == 97) ? true : false;
      this.collabticDomain = this.platformId == 1 ? true : false;
      if(this.tvsFlag){
        this.productMakePl = "Product Type";        
      }
      else{
        this.productMakePl = "Make"
      }

      if(this.domainId == 98){
        console.log(this.domainId);      
        this.DICVDomain = true;
      }

      this.industryType = this.common.getIndustryType();
      console.log(this.industryType);
      if(this.industryType['id'] == '1'){
        this.errorCodeTitle = 'Error Code';
        this.errorCodebg = 'ec';
      }
      else{
        this.errorCodeTitle = 'DTCs';
        this.errorCodebg = 'dtc';
      } 
      
      let wsNav:any = (localStorage.getItem('wsNav') == null || localStorage.getItem('wsNav') == 'undefined' || localStorage.getItem('wsNav') == undefined) ? 0 : parseInt(localStorage.getItem('wsNav'));
      this.wsNav = (wsNav == 0) ? false : true;
      setTimeout(() => {
        localStorage.removeItem('wsNav');
      }, 100);

      /*this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: false,
        search: false,
      };*/

      let actionText = (this.gtsAction == "duplicate" ) ? 'duplicate': 'edit';
      this.headerData = {       
        title: 'GTS',
        action: actionText,
        id: this.gtsId
      };

      let year = parseInt(this.currYear)+2;
      this.years.push({
        id: 0,
        name: "All",
      });
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }
      this.loadingMessage =
        this.gtsAction == "edit"
          ? "Loading GTS Details..."
          : "Creating duplicate GTS...";

      // Get GTS Details
      this.getGTSDetails();

      setTimeout(() => {
        this.setScreenHeight();
      }, 1500);

    } else {      
      this.router.navigate(["/forbidden"]);
    }
  }

  // Get GTS Details
  getGTSDetails() {
    let offset: any = 0;
    let limit: any = 1;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("procedureId", this.gtsId);
    apiFormData.append("limit", limit);
    apiFormData.append("offset", offset);

    this.gtsApi.getGTSLists(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        this.gtsInfo = response.procedure[0];
        //console.log('gts detail--'+JSON.stringify(this.gtsInfo));
        let actionFlag = true;
       /* let actionFlag =
          this.roleId == '3' || this.roleId == '10' || this.userId == this.gtsInfo["createdById"]
            ? true
            : false;*/
                       
        /*if (actionFlag) {
          actionFlag = this.gtsInfo["editAccess"] == 1 ? true : false;
        }*/
        
        if (actionFlag) {
          this.gtsPublishFlag =
            this.gtsInfo["isPublishEnabled"] == 1 && this.gtsAction == "edit"
              ? true
              : false;
          this.editActionStatus =
            this.gtsInfo["isPublished"] == 2 && this.gtsAction == "edit"
              ? this.gtsInfo["isPublished"]
              : 1;
          this.imgURL =
            this.gtsInfo["gtsImg"] == ""
              ? this.gtsPlaceholderImg
              : this.gtsInfo["gtsImg"];
          this.gtsInfo["bgClass"] =
            this.gtsInfo["gtsImg"] == "" ? "default" : "gts-bg";
          this.dtcFlag =
            this.gtsInfo["productCategoryName"] == "DTCs" ? true : false;
          this.probCatgVal = this.gtsInfo["productCategoryId"];
          this.probCatgName = this.gtsInfo["productCategoryName"];
          this.systemVal = this.gtsInfo["systemSelection"];
          if(this.collabticDomain){
            let wft = this.gtsInfo["workFlowId"] && this.gtsInfo["workFlowId"] !="0" ? this.gtsInfo["workFlowId"] : '';
            if(wft != ''){
              this.workflowName = this.gtsInfo["workFlowName"];
              this.workflowtype = (wft);
              this.workflowtypeId = parseInt(wft);
            }
          }

          if (this.dtcFlag) {
            // Get DTC Info
            this.getDTCInfo();

            //this.pblmDetailFlag = this.dtcFlag;
            this.gtsInfo["dtcVal"] =
              this.gtsInfo["dtcCode"] + " - " + this.gtsInfo["dtcDesc"];
            this.dtcVal = this.gtsInfo["dtcVal"];
            this.gtsInfo["productModuleType"] =
              this.gtsInfo["productModuleType"] == "-"
                ? ""
                : this.gtsInfo["productModuleType"];
            this.gtsInfo["productModuleTypeId"] =
              this.gtsInfo["productModuleTypeId"] == "-"
                ? 0
                : this.gtsInfo["productModuleTypeId"];
            this.gtsInfo["productModuleMfg"] =
              this.gtsInfo["productModuleMfg"] == "-"
                ? ""
                : this.gtsInfo["productModuleMfg"];
            this.gtsInfo["productModuleMfgId"] =
              this.gtsInfo["productModuleMfgId"] == "-"
                ? 0
                : parseInt(this.gtsInfo["productModuleMfgId"]);

            this.ecuTypeName = this.gtsInfo["productModuleType"];
            this.ecuTypeVal = this.gtsInfo["productModuleTypeId"];
            this.mfgVal = this.gtsInfo["productModuleMfgId"];
            this.mfgName = this.gtsInfo["productModuleMfg"];

            if (this.gtsInfo["productCategoryEditAccess"] == 1) {
              this.catgAction = "edit";
              this.catgActionTxt = this.editTxt;
              this.catgName = this.gtsInfo["productCategoryName"];
              this.catgId = this.gtsInfo["productCategoryId"];
            }

            if (this.gtsInfo["productECUtypeEditAccess"] == 1) {
              this.ecuAction = "edit";
              this.ecuActionTxt = this.editTxt;
              this.ecuName = this.gtsInfo["productModuleType"];
              this.ecuId = this.gtsInfo["productModuleTypeId"];
            }

            if (this.gtsInfo["productMfgEditAccess"] == 1) {
              this.mfgAction = "edit";
              this.mfgActionTxt = this.editTxt;
              this.mftName = this.gtsInfo["productModuleMfg"];
              this.mfgId = this.gtsInfo["productModuleMfgId"];
            }

            if (this.gtsInfo["productSystemEditAccess"] == 1) {
              this.mfgAction = "edit";
              this.sysActionTxt = this.editTxt;
              this.sysId = this.gtsInfo["systemSelection"];
              this.systemVal = this.sysId;
              this.sysName = this.sysId;
            }

            if (this.gtsInfo["productDtcEditAccess"] == 1) {
              this.dtcAction = "edit";
              this.dtcActionTxt = this.editTxt;
              this.dtcCode = this.gtsInfo["dtcCode"];
              this.dtcDesc = this.gtsInfo["dtcDesc"];
            }
          }
          this.gtsInfo["tags"] =
            this.gtsInfo["tags"] == "-" ? "" : JSON.parse(this.gtsInfo["tags"]);

          this.gtsChartFlag =
            this.gtsInfo["isPublishEnabled"] == 0
              ? false
              : this.gtsAction == "duplicate"
              ? false
              : true;
          this.legacyGts =
            this.gtsInfo["legacyGTS"] == 1 && this.gtsAction == "edit"
              ? true
              : false;
             
          if (this.gtsChartFlag) {
            let chartCreatedDate = moment
              .utc(this.gtsInfo["flowChartcreatedOn"])
              .toDate();
            let localChartCreatedDate = moment(chartCreatedDate)
              .local()
              .format("MMM DD, YYYY h:mm A");
            let chartUpdatedDate = moment
              .utc(this.gtsInfo["flowChartupdatedOn"])
              .toDate();
            let localChartUpdatedDate = moment(chartUpdatedDate)
              .local()
              .format("MMM DD, YYYY h:mm A");
            this.gtsInfo["flowChartcreatedOn"] =
              this.gtsInfo["flowChartcreatedOn"] == ""
                ? "-"
                : localChartCreatedDate;
            this.gtsInfo["flowChartupdatedOn"] =
              this.gtsInfo["flowChartupdatedOn"] == ""
                ? "-"
                : localChartUpdatedDate;
                
          }          
          // Get Workstream Lists
          this.getWorkstreamLists();
          if(this.collabticDomain){
          this.getWorkFlowLists();
          }
        } else {
          this.router.navigate(["/forbidden"]);
        }
      }
    });
  }

  // Get Workstream Lists
  getWorkstreamLists() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    this.probingApi.getWorkstreamListsAPI(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.data;
        this.workstreamItems = resultData;

        // Get GTS Base Info
        this.getGtsBaseInfo();
      }
    });
  }

  
    // Get Worksflow Lists
    getWorkFlowLists() {
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("countryId", this.countryId);
      apiFormData.append("userId", this.userId);
      this.probingApi.getWorkFlowContentTypes(apiFormData).subscribe((response) => {
        if (response.status == "Success") {
          let resultData = response.system;
          this.workflowtypeOptions = [];
          this.workflowtypeOptions = resultData;  
        }
      });
    }

  // Get GTS Base Info
  getGtsBaseInfo() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);

    this.gtsApi.getGtsBaseInfo(apiFormData).subscribe((response) => {
      let resultData = response.attributesInfo;
      let problemCatg = resultData.problemCategory;

      for (let pc of problemCatg) {
        this.probCategory.push({
          id: pc.id,
          name: pc.name,
        });
        this.filteredCategory = this.probCategory;
      }

      this.filteredCategory = this.probCategory;
      this.system = resultData.systemSelection;
      this.filteredSystem = this.system;
      this.tagItems = resultData.tagsSelection;

      // Get Product Types
      if(this.tvsFlag){
        this.getTVSProdTypes();
      }
      else{
        this.getProdTypes();
      }

    });
  }

  // Get Product Types
  getTVSProdTypes() {
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      make: this.make,
    };

    this.probingApi.getProdTypeLists(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.data;
        this.defProdTypeVal = "";
        this.defProdType = "";

        for (let p of resultData) {
          if (p.prodType != "None") {
            this.prodTypes.push({
              id: p.prodType,
              name: p.prodType,
            });
            this.vehicleProdTypes.push({
              id: p.prodType,
              name: p.prodType,
            });
          }
        }

        // Setup Form Fields
        setTimeout(() => {
          this.setupStepFields();
        }, 1800);
      }
    });
  }

    // Get Product Types
    getProdTypes() {
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);    
      this.ProductMatrixApi.fetchProductMakeLists(apiFormData).subscribe((response) => {
        if(response.status == "Success") {
          console.log(response)
          //this.loading = false;
          let resultData = response.modelData;
          this.defProdTypeVal = "";
          this.defProdType = "";
          
          for(let p of resultData) {          
            this.prodTypes.push({
              'id': p.makeName,
              'name': p.makeName
            });
            this.vehicleProdTypes.push({
              'id': p.makeName,
              'name': p.makeName
            });
          }
          
          // Setup Form Fields
          setTimeout(() => {
            this.setupStepFields();
          }, 1800);
        }
      });   
    }

  // Setup Form Fields
  setupStepFields() {
    let duplicateTxt = "[DUPLICATE]";
    let chkGtsTitle = this.gtsInfo["name"].includes(duplicateTxt);
    let gtsName = chkGtsTitle
      ? this.gtsInfo["name"]
      : `${this.gtsInfo["name"]} ${duplicateTxt}`;
    this.gtsTitle =
      this.gtsAction == "edit" ? this.gtsInfo["name"] : `${gtsName}`;
    this.filteredWorkstreamIds = JSON.parse(this.gtsInfo["groups"]);

    let filteredErrorCod = this.gtsInfo["errorCodes"] == '' ? false : true ;    
   // this.filteredErrorCodeIds = filteredErrorCod ? JSON.parse(this.gtsInfo["errorCodesData"]) : '';
    if(filteredErrorCod)
    {
      if(this.gtsInfo["errorCodesData"])
      {
        this.filteredErrorCodeIds=JSON.parse(this.gtsInfo["errorCodesData"]);
      }
    }
    this.errorCodeItems = filteredErrorCod ? this.filteredErrorCodeIds : '' ;
    this.filteredErrorCodes = filteredErrorCod ? this.gtsInfo["errorCodeNames"] : '';

    this.filteredTags = this.gtsInfo["tags"] == "-" ? [] : this.gtsInfo["tags"];
    let vehicleData =
      this.gtsInfo["vehicleDetails"] == ""
        ? ""
        : JSON.parse(this.gtsInfo["vehicleDetails"]);
    this.defProdType = vehicleData == "" ? "All" : "";
    this.prodTypeFlag = this.defProdType == "All" ? false : true;
    this.imgURL = this.gtsInfo["gtsImg"] == "" ? null : this.gtsInfo["gtsImg"];
    this.imgName =
      this.gtsInfo["gtsBaseImg"] == "" ? null : this.gtsInfo["gtsBaseImg"];
    this.gtsInfo["productModuleMfg"] =
      this.gtsInfo["productModuleMfg"] == "-"
        ? ""
        : this.gtsInfo["productModuleMfg"];
    this.gtsInfo["productModuleMfgId"] = parseInt(
      this.gtsInfo["productModuleMfgId"]
    );
    this.gtsInfo["productModuleTypeId"] =
      this.gtsInfo["productModuleTypeId"] == "-"
        ? ""
        : this.gtsInfo["productModuleTypeId"];
    this.gtsInfo["systemSelection"] =
      this.gtsInfo["systemSelection"] == "-"
        ? ""
        : this.gtsInfo["systemSelection"];

    if (this.prodTypeFlag) {
      this.defProdType = vehicleData[0].productType;
    }
    console.log(this.mfgVal);
    console.log(this.defProdType);
    if(!this.tvsFlag){
      this.defProdType = this.defProdType == 'All' ? '' : this.defProdType;
    }

    if(this.tvsFlag || this.DICVDomain){
      this.editGtsForm = this.formBuilder.group({
        editMode: [1], 
        domainId: [this.domainId],
        countryId: [this.countryId],
        userId: [this.userId],
        action: [this.editActionStatus],
        procedureId: [this.gtsId],
        workstreams: [""],
        gtsTitle: [this.gtsTitle, [Validators.required]],
        gtsDescription: [this.gtsInfo["additionalInfo"]],
        probCatg: [this.probCatgVal, [Validators.required]],
        ecuType: [this.gtsInfo["productModuleTypeId"]],
        moduleMft: [this.gtsInfo["productModuleMfgId"]],
        system: [this.gtsInfo["systemSelection"], [Validators.required]],
        prodTypeVal: [this.defProdType, [Validators.required]],
        dtc: [this.gtsInfo["dtcVal"]],
        tags: [""],
        vehicleInfo: this.formBuilder.array([]),
        notifyUsers: [0],
      });
    }
    else{
      let mfgId = this.gtsInfo['productModuleMfgId'];
      this.gtsInfo['productModuleMfgId'] = isNaN(mfgId) ? 0 : mfgId;
      let dtcVal = this.gtsInfo["dtcVal"];
      this.gtsInfo["dtcVal"] = (dtcVal == 'undefined' || dtcVal == undefined) ? '' : dtcVal;

      if(this.collabticDomain){
        this.editGtsForm = this.formBuilder.group({
          editMode: [1],
          domainId: [this.domainId],
          countryId: [this.countryId],
          userId: [this.userId],
          action: [this.editActionStatus],
          procedureId: [this.gtsId],
          workstreams: [""],
          workflowtype: [""],
          errorCodes: [""],
          gtsTitle: [this.gtsTitle, [Validators.required]],
          gtsDescription: [this.gtsInfo["additionalInfo"]],
          probCatg: [this.probCatgVal, [Validators.required]],
          ecuType: [this.gtsInfo["productModuleTypeId"]],
          moduleMft: [this.gtsInfo["productModuleMfgId"]],
          system: [this.gtsInfo["systemSelection"], [Validators.required]],
          prodTypeVal: [this.defProdType],
          dtc: [this.gtsInfo["dtcVal"]],
          tags: [""],
          vehicleInfo: this.formBuilder.array([]),
          notifyUsers: [0],
        });
      }
      else{
        this.editGtsForm = this.formBuilder.group({
          editMode: [1],
          domainId: [this.domainId],
          countryId: [this.countryId],
          userId: [this.userId],
          action: [this.editActionStatus],
          procedureId: [this.gtsId],
          workstreams: [""],
          errorCodes: [""],
          gtsTitle: [this.gtsTitle, [Validators.required]],
          gtsDescription: [this.gtsInfo["additionalInfo"]],
          probCatg: [this.probCatgVal, [Validators.required]],
          ecuType: [this.gtsInfo["productModuleTypeId"]],
          moduleMft: [this.gtsInfo["productModuleMfgId"]],
          system: [this.gtsInfo["systemSelection"], [Validators.required]],
          prodTypeVal: [this.defProdType],
          dtc: [this.gtsInfo["dtcVal"]],
          tags: [""],
          vehicleInfo: this.formBuilder.array([]),
          notifyUsers: [0],
        });
      }
     
    }

    console.log(this.prodTypeFlag);
    if (this.prodTypeFlag) {
      let vhLen = vehicleData.length;
      if(this.DICVDomain){
        for (let v = 0; v < vhLen; v++) {
          this.addDICVVehicelFields(this.actionEdit, v, vehicleData[v].productType);
        }
      }
      else{
        for (let v = 0; v < vhLen; v++) {
          this.addVehicelFields(this.actionEdit, v, vehicleData[v].productType);
        }
      }      
    } else {
      if (this.actionId == 2) {
        this.gtsEditorAction();
      }
      this.loading = this.actionId == 2 ? true : false;
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    if(!this.teamSystem) {
      headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    }
    this.innerHeight = (this.bodyHeight-(headerHeight+110));       
  }
  

  // On File Upload
  onFileUpload(event) {
    let uploadFlag = true;
    this.selectedGtsImg = event.target.files[0];
    let type = this.selectedGtsImg.type.split("/");
    let type1 = type[1].toLowerCase();
    let fileSize = this.selectedGtsImg.size / 1024 / 1024;
    this.invalidFileErr = "";

    if (fileSize > 2) {
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
    reader.readAsDataURL(this.selectedGtsImg);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.imgName = null;
    };
  }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedGtsImg = null;
    this.imgURL = this.selectedGtsImg;
    this.imgName = null;
  }

  // Disable Selection
  disableSelection() {
    return true;
  }

  // Custom Selection Change
  selectChange(field, event) {
    let id = event.value;
    let value = event.source.triggerValue;
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };
    console.log(field + "::" + id + "::" + value);
    switch (field) {
      case "probCatg":
        console.log(123);
        this.dtcFlag = false;
        this.probCatgVal = id;
        this.probCatgName = value;
        if (value == "Create New" || value == "Edit Newly Created") {
          this.catgSelect.close();
          let action;
          if(value == "Create New"){
            this.probCatgName = "";
            this.probCatgVal = 0;
            action = {
              action: this.probCatgVal < 0 ? "new" : "edit",
              id: this.probCatgVal < 0 ? 0 : this.probCatgVal,
              name: this.probCatgVal < 0 ? "" : this.probCatgName,
            };
          }
          else{
            console.log(this.probCategory);                        
            action = {
              action: "edit",
              id: this.probCategory[0].id,
              name: this.probCategory[0].name
            };
          }
          const modalRef = this.modalService.open(
            ActionFormComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "Catg Creation";
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss("Cross click");
            console.log(receivedService);
            if (receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let cid = parseInt(receivedService.id);
              let newItem = {
                id: cid,
                name: name,
              };
              if (this.catgAction == "new" && actionItem == "new") {
                this.probCategory.unshift(newItem);
                this.filteredCategory.unshift(newItem);
              }
              setTimeout(() => {
                if (actionItem == "new") {
                  this.catgName = name;
                  this.catgId = cid;
                }
                this.catgActionTxt = this.editTxt;
                this.probCatgName = name;
                this.probCatgVal = cid;
                if (this.catgAction == "edit" && actionItem == "new") {
                  let index = this.probCategory.findIndex(
                    (option) => option.id == cid
                  );
                  this.probCategory[index].name = name;
                  this.filteredCategory[index].name = name;
                }
                this.catgAction = "edit";
              }, 500);
            } else {
              setTimeout(() => {
                this.probCatgName = this.gtsInfo["productCategoryName"];
                this.probCatgVal = this.gtsInfo["productCategoryId"];
                this.dtcFlag = this.probCatgVal == 13 ? true : false;
              }, 500);
            }
          });
        } else if (value == "DTCs") {
          this.dtcId = id;
          this.dtcFlag = true;

          // Get DTC Info
          this.getDTCInfo();
        }
        break;
      case "ecuType":
        //this.ecuTypeName = value;
        //this.ecuTypeVal = id;
        this.ecuTypeValid = true;
        if (value == "Create New" || value == "Edit Newly Created") {
          this.ecuTypeName =
            value == "Create New" ? "" : this.gtsInfo["productModuleType"];
          this.ecuTypeVal =
            value == "Create New"
              ? 0
              : parseInt(this.gtsInfo["productModuleTypeId"]);
          //setTimeout(() => {
          this.ecuSelect.close();
          //}, 100);

          let action = {
            action: this.ecuId < 0 ? "new" : "edit",
            id: this.ecuId < 0 ? 0 : this.ecuId,
            name: this.ecuId < 0 ? "" : this.ecuName,
          };

          const modalRef = this.modalService.open(
            ActionFormComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "ECU Creation";
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss("Cross click");
            console.log(receivedService);
            if (receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let id = parseInt(receivedService.id);
              let newItem = {
                id: id,
                name: name,
              };

              if (this.ecuAction == "new" && actionItem == "new") {
                //this.ecuTypes.unshift(newItem);
                this.filteredEcuTypes.unshift(newItem);
                this.ecuTypes = this.filteredEcuTypes;
              }

              setTimeout(() => {
                if (actionItem == "new") {
                  this.ecuName = name;
                  this.ecuId = id;
                }
                this.ecuActionTxt = this.editTxt;
                this.ecuTypeName = name;
                this.ecuTypeVal = id;
                if (this.ecuAction == "edit" && actionItem == "new") {
                  let index = this.ecuTypes.findIndex(
                    (option) => option.id == id
                  );
                  this.filteredEcuTypes.splice(index, 1);
                  this.filteredEcuTypes.unshift(newItem);
                  this.ecuTypes = this.filteredEcuTypes;
                }
                this.ecuAction = "edit";
              }, 500);
            } else {
              this.ecuTypeName = this.gtsInfo["productModuleType"];
              this.ecuTypeVal = this.gtsInfo["productModuleTypeId"];
              setTimeout(() => {
                let newItem = {
                  id: this.ecuTypeVal,
                  name: this.ecuTypeName,
                };
                console.log();
                let index = this.ecuTypes.findIndex(
                  (option) => option.id == this.ecuTypeVal
                );
                this.filteredEcuTypes.splice(index, 1);
                this.filteredEcuTypes.unshift(newItem);
                this.ecuTypes = this.filteredEcuTypes;
              }, 500);
            }
          });
        }
        break;
      case "moduleMft":
        this.mfgName = value;
        this.mfgVal = id;
        this.mfgValid = true;
        if (value == "Create New" || value == "Edit Newly Created") {
          this.mfgSelect.close();
          this.mfgName = "";
          this.mfgVal = "0";
          console.log(this.mfgId);
          let action = {
            action: this.mfgId < 0 ? "new" : "edit",
            id: this.mfgId < 0 ? 0 : this.mfgId,
            name: this.mfgId < 0 ? "" : this.mftName,
          };

          const modalRef = this.modalService.open(
            ActionFormComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "MFG Creation";
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss("Cross click");
            console.log(receivedService);
            if (receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let id = parseInt(receivedService.id);

              let newItem = {
                id: id,
                name: name,
              };

              if (this.mfgAction == "new" && actionItem == "new") {
                //this.moduleMft.unshift(newItem);
                this.filteredModuleMft.unshift(newItem);
                this.moduleMft = this.filteredModuleMft;
              }

              setTimeout(() => {
                if (actionItem == "new") {
                  this.mftName = name;
                  this.mfgId = id;
                }
                this.mfgActionTxt = this.editTxt;
                this.mfgName = name;
                this.mfgVal = id;
                if (this.mfgAction == "edit" && actionItem == "new") {
                  let index = this.moduleMft.findIndex(
                    (option) => option.id == id
                  );
                  this.moduleMft[index].name = name;
                  this.filteredModuleMft[index].name = name;
                }
                this.mfgAction = "edit";
              }, 500);
            } else {
              this.mfgVal = this.gtsInfo["productModuleMfgId"];
              this.mfgName = this.gtsInfo["productModuleMfg"];
            }
          });
        }
        break;
      case "system":
        this.systemVal = id;
        console.log(value);
        if (value == "Create New" || value == "Edit Newly Created") {
          this.systemSelect.close();
          this.systemVal = "0";

          let action = {
            action: this.sysId < 0 ? "new" : "edit",
            id: this.sysId < 0 ? 0 : this.sysId,
            name: this.sysId < 0 ? "" : this.sysName,
          };

          const modalRef = this.modalService.open(
            ActionFormComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "System Creation";
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss("Cross click");
            console.log(receivedService);
            if (receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let id = receivedService.id;

              if (this.sysAction == "new" && actionItem == "new") {
                this.sysName = name;
                this.sysId = id;
                this.system.unshift(this.sysName);
                this.filteredSystem.unshift(this.sysName);
              }
              console.log(this.system[0]);
              console.log(this.filteredSystem[0]);

              setTimeout(() => {
                this.sysActionTxt = this.editTxt;
                this.systemVal = name;
                if (this.sysAction == "edit" && actionItem == "new") {
                 /* let index = this.system.findIndex(
                    (option) => option == receivedService.exname
                  );*/
                  this.system[0] = this.systemVal;
                  this.filteredSystem[0] = this.systemVal;
                }
                console.log(this.system[0]);
                console.log(this.filteredSystem[0]);
                
                this.sysAction = "edit";
              }, 500);
            } else {
              this.systemVal = this.gtsInfo["systemSelection"];
            }
          });
        }
        break;
      case "dtc":
        this.dtcValid = true;
        if (value == "Create New" || value == "Edit Newly Created") {
          this.dtcSelect.close();
          this.dtcVal = 0;

          let action = {
            action: this.dtcCode == "" ? "new" : "edit",
            id: this.dtcCode,
            name: this.dtcDesc,
          };

          const modalRef = this.modalService.open(
            ActionFormComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "DTC Creation";
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss("Cross click");
            console.log(receivedService);
            if (receivedService.action) {
              let dtcName = receivedService.id + " - " + receivedService.name;
              let newItem = {
                name: dtcName,
              };
              console.log(this.dtcAction);

              if (this.dtcAction == "new") {
                //this.dtcItems.unshift(newItem);
                this.filteredDtcItems.unshift(newItem);
                //this.dtcItems = this.filteredDtcItems;
              }

              setTimeout(() => {
                this.dtcActionTxt = this.editTxt;
                this.dtcVal = dtcName;
                this.dtcCode = receivedService.id;
                this.dtcDesc = receivedService.name;
                if (this.dtcAction == "edit") {
                  this.dtcVal = dtcName;
                  let index = this.dtcItems.findIndex(
                    (option) => option.name == receivedService.exname
                  );
                  this.filteredDtcItems.splice(index, 1);
                  this.filteredDtcItems.unshift(newItem);
                  //this.dtcItems[index].name = dtcName;
                  //this.filteredDtcItems[index].name = dtcName;
                }
                this.dtcAction = "edit";
              }, 500);

              /*const modalRef = this.modalService.open(
                ConfirmationComponent,
                {backdrop: 'static', keyboard: true, centered: true}
              );
              modalRef.componentInstance.access = "DTC Replace";
              modalRef.componentInstance.confirmAction.subscribe(
                (recivedService) => {
                  modalRef.dismiss("Cross click");
                  if (recivedService) {
                    this.editGtsForm.value.gtsTitle = dtcName;
                  }
                }
              );*/
            } else {
              this.dtcVal = this.gtsInfo["dtcVal"];
            }
          });
        } else {
          this.dtcSelect.close();
         /* const modalRef = this.modalService.open(
            ConfirmationComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "DTC Replace";
          modalRef.componentInstance.confirmAction.subscribe(
            (recivedService) => {
              modalRef.dismiss("Cross click");
              if (recivedService) {
                this.editGtsForm.value.gtsTitle = value;
              }
            }
          );*/
        }
        break;
    }
  }

  // Get DTC Info
  getDTCInfo() {
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      limit: 200,
      offset: 0,
    };

    this.gtsApi.getDtcInfo(apiData).subscribe((response) => {
      let resultData = response.data;
      let dtc = resultData.diagnostics;
      for (let d of dtc) {
        let sep = d.description != "" ? " - " : "";
        let dtcInfo = d.trouble_code + sep + d.description;
        this.dtcItems.push({
          name: dtcInfo,
        });
      }

      this.filteredDtcItems = this.dtcItems;
      // Get DTC Attributes
      this.getDTCAttributes();
    });
  }

  // Get DTC Attributes
  getDTCAttributes() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("catId", this.probCatgVal);

    this.gtsApi.getDtcAttributes(apiFormData).subscribe((response) => {
      let resultData = response.attributesInfo;
      this.ecuTypes = resultData.ProductEcuType;
      this.filteredEcuTypes = this.ecuTypes;
      this.moduleMft = resultData.ProductMfg;
      this.filteredModuleMft = this.moduleMft;
    });
  }

  // Selection Change
  fieldChange(index, field, value) {
    let action;
    switch (field) {
      case "defProdType":
        if (value != "All") {
          action = "create";
          this.prodTypeFlag = true;
          this.pblmDetailFlag = false;
          if (index == 0) {
            localStorage.setItem("vehicleProdType", value);
          }
          if(this.DICVDomain){
            this.addDICVVehicelFields(this.actionInit, index, value);
          }
          else{
            this.addVehicelFields(this.actionInit, index, value);
          }
          setTimeout(() => {
            this.defProdType = value;
          }, 500);
        } else {
          this.pblmDetailFlag = this.workstreamValid ? true : false;
        }
        break;
      case "prodType":
        let removeFlag = false;
        let vehLen = this.vehicleFormInfo.length;
        if (index == 0 && value == "All") {
          this.pblmDetailFlag = !this.workstreamValid ? true : false;
          if (this.vehicleFormInfo[index].actionFlag) {
            const modalRef = this.modalService.open(
              ConfirmationComponent,
              {backdrop: 'static', keyboard: true, centered: true}
            );
            modalRef.componentInstance.access = "Remove Vehicles";
            modalRef.componentInstance.confirmAction.subscribe(
              (recivedService) => {
                modalRef.dismiss("Cross click");
                removeFlag = recivedService;
                if (!removeFlag) {
                  let ptype = localStorage.getItem("vehicleProdType");
                  this.vehicleFormInfo[index].prodType = ptype;
                } else {
                  localStorage.removeItem("vehicleProdType");
                  for (let v = 0; v < vehLen; v++) {
                    this.removeVehicleFields(v);
                  }
                }
              }
            );
          } else {
            removeFlag = true;
          }
          if (removeFlag) {
            localStorage.removeItem("vehicleProdType");
            for (let v = 0; v < vehLen; v++) {
              this.removeVehicleFields(v);
            }
          }
          return false;
        } else {
          if (index == 0) {
            localStorage.setItem("vehicleProdType", value);
          }
          this.vehicleFormInfo[index].prodTypeValid = true;
          action = "change";
          this.vehicleFormInfo[index].modelLoading = true;
          if(this.DICVDomain){this.vehicleFormInfo[index].emissionLoading = true;}
          if(this.tvsFlag){
            this.getVehicleModels(this.actionInit, index, value);
          }
          else{
            this.getModels(this.actionInit, index, value);
          }
        }
        break;
    }
  }

  // Manage Tag
  manageTag() {
    let headerHeight =
      document.getElementsByClassName("prob-header")[0].clientHeight;
      let innerHeight = this.bodyHeight - (headerHeight + 20);
    innerHeight = this.bodyHeight > 1420 ? 980 : innerHeight;    
      console.log(this.filteredTags);
    for (let tag of this.tagItems) {
      for (let f of this.filteredTags)
        if (tag.name == f) {
          this.filteredTagIds.push(tag.id);
        }
    }

    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };
    
    const modalRef = this.modalService.open(ManageListComponentGTS, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.access = "Tag";
    //modalRef.componentInstance.manageList = this.tagItems;
    modalRef.componentInstance.filteredTags = this.filteredTagIds;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      let tagItems = receivedService;
      console.log(tagItems);
      this.filteredTagIds = [];
      this.filteredTags = [];
      for (let t in tagItems) {
        let chkIndex = this.filteredTagIds.findIndex(
          (option) => option == tagItems[t].id
        );
        if (chkIndex < 0) {
          this.filteredTagIds.push(tagItems[t].id);
          this.filteredTags.push(tagItems[t].name);
        }
      }
    });
  }

  disableTagSelection(index) {
    this.filteredTagIds.splice(index, 1);
    this.filteredTags.splice(index, 1);
  }

  // Create Vehicle Fields
  addVehicelFields(action, index, value) {
    let valid = action == "edit" ? true : false;
    this.vehicleFormInfo.push({
      prodType: value,
      prodTypeValid: valid,
      modelList: [],
      models: [],
      years: [],
      modelValid: valid,
      yearValid: valid,
      modelLoading: false,
      actionFlag: valid,
      addFlag: true,
    });

    this.vehicleList.push({
      class: "vc-info",
      title: value,
      isDisabled: false,
      isExpanded: true,
    });

    this.v.push(
      this.formBuilder.group({
        productType: [""],
        model: [""],
        year: [""],
      })
    );

    if (action == this.actionInit) {
      if (index == 0) {
        this.vehicleFormInfo[index].prodTypeValid = true;
      }

      if (index > 0) {
        if (this.prodTypes.length == this.vehicleProdTypes.length) {
          this.vehicleProdTypes.splice(0, 1);
        }
        this.vehicleFormInfo[index - 1].addFlag = false;
      }
    }
    console.log(action);
    console.log('dicv Emission data',this.gtsInfo["vehicleDetails"]);
    if (action == "edit") {
      let vehicleDetails = JSON.parse(this.gtsInfo["vehicleDetails"]);
      this.vehicleFormInfo[index].models = vehicleDetails[index].model;
      this.editGtsForm.value.vehicleInfo[index].model = this.vehicleFormInfo[index].models;        
      this.vehicleFormInfo[index].years = vehicleDetails[index].year == 'All' ? [0] : vehicleDetails[index].year ;
      this.editGtsForm.value.vehicleInfo[index].year = this.vehicleFormInfo[index].years;
      if (index == 0) {
        this.defProdType = value;
        this.editGtsForm.value.prodTypeVal = value;
      }
    }
    setTimeout(() => {
      if(this.tvsFlag){
        this.getVehicleModels(action, index, value);
        this.onScrollBottom();
      }
      else{
        this.getModels(action, index, value);
        this.onScrollBottom();
      } 
    }, 500);
  }

  onScrollBottom(){
    let secElement = document.getElementById('step');    
    if(secElement) {
      setTimeout(() => {
        let scrollTop = secElement.scrollTop;
        setTimeout(() => {
          this.scrollPos = scrollTop+300;
          secElement.scrollTop = this.scrollPos;
        }, 200);        
      }, 500); 
    }
  }
  
  // Create Vehicle Fields
  addDICVVehicelFields(action, index, value) {
    let valid = action == "edit" ? true : false;
    this.vehicleFormInfo.push({
      prodType: value,
      prodTypeValid: valid,
      emissionList: [],
      emissionName: [],
      emissionId: [],
      emissions: [],
      modelList: [],
      models: [],
      years: [],
      emissionValid: true,
      modelValid: valid,
      yearValid: valid,
      modelLoading: false,
      emissionLoading: false,
      actionFlag: false,
      addFlag: true,
    });

    this.vehicleList.push({
      class: "vc-info",
      title: value,
      isDisabled: false,
      isExpanded: true,
    });

    this.v.push(
      this.formBuilder.group({
        productType: [""],
        emissionId: [""],
        emissionName: [""],
        model: [""],
        year: [""],
      })
    );

    if (action == this.actionInit) {
      if (index == 0) {
        this.vehicleFormInfo[index].prodTypeValid = true;
      }

      if (index > 0) {
        /*if (this.prodTypes.length == this.vehicleProdTypes.length) {
          this.vehicleProdTypes.splice(0, 1);
        }*/
        this.vehicleFormInfo[index - 1].addFlag = false;
      }
    }
    console.log(action);
    
    if (action == "edit") {
      let vehicleDetails = JSON.parse(this.gtsInfo["vehicleDetails"]);      
      this.vehicleFormInfo[index].emissions = vehicleDetails[index].emissionId != undefined ?  vehicleDetails[index].emissionId : '';      
      this.editGtsForm.value.vehicleInfo[index].emissionId =
        this.vehicleFormInfo[index].emissions;
        console.log(vehicleDetails[index].emissionId);
       
      this.editGtsForm.value.vehicleInfo[index].emissionName =
      vehicleDetails[index].emissionName != undefined ? vehicleDetails[index].emissionName : '' ;
      console.log(vehicleDetails[index].emissionName);
      this.vehicleFormInfo[index].emissionId=vehicleDetails[index].emissionId;
      this.vehicleFormInfo[index].emissionName=vehicleDetails[index].emissionName;
      this.vehicleFormInfo[index].models = vehicleDetails[index].model;
      this.editGtsForm.value.vehicleInfo[index].model =
        this.vehicleFormInfo[index].models;
      this.vehicleFormInfo[index].years = vehicleDetails[index].year;
      this.editGtsForm.value.vehicleInfo[index].year =
        this.vehicleFormInfo[index].years;
      if (index == 0) {
        this.defProdType = value;
        this.editGtsForm.value.prodTypeVal = value;
      }
    }
    setTimeout(() => {
      if(this.tvsFlag){
        this.getVehicleModels(action, index, value);
        this.onScrollBottom();
      }
      else{
        this.getModels(action, index, value);
        if(!this.DICVDomain){this.onScrollBottom();}
      } 
    }, 500);
  }

  // Remove Vehicle Fields
  removeVehicleFields(index) {
    this.v.removeAt(index);
    this.vehicleList.splice(index, 1);
    this.vehicleFormInfo.splice(index, 1);
    if (index == 0) {
      this.prodTypeFlag = false;
      this.defProdType = "";
      this.editGtsForm.value.prodTypeVal = "";
      localStorage.removeItem("vehicleProdType");
      this.pblmDetailFlag = false;
    } else {
      let removeIndex =
        this.vehicleFormInfo.length == index ? index - 1 : index;
      this.vehicleFormInfo[removeIndex].addFlag = true;
    }
  }

  // Remove Vehicle Fields
  removeEmissionsVehicleFields(index) {
    if(this.domainId == 98 && !this.disableErrorCodeFlag && this.filteredErrorCodes.length > 0) {
      const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: true, centered: true});
      modalRef.componentInstance.access = "Vehicle Remove Warning";
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
        modalRef.dismiss("Cross click");
        if(receivedService) {
          this.setupVehicleInfo(index);
        }
      });
    } else {
      this.setupVehicleInfo(index);
    }
  }

  setupVehicleInfo(index) {
    this.v.removeAt(index);
    this.vehicleList.splice(index, 1);
    this.vehicleFormInfo.splice(index, 1);
    if (index == 0) {
      this.prodTypeFlag = false;
      this.defProdType = "";
      this.editGtsForm.value.prodTypeVal = "";
      localStorage.removeItem("vehicleProdType");
      this.pblmDetailFlag = false;
    } else {
      let removeIndex = this.vehicleFormInfo.length == index ? index - 1 : index;
      this.vehicleFormInfo[removeIndex].addFlag = true;
    }
    
    if(this.domainId == 98) {
      let emissions = this.getEmissions();
      let emissionIds = emissions.emissionIds;
      this.disableErrorCodeFlag = (emissionIds.length == 0) ? true : false;
      if(this.filteredErrorCodes.length > 0) {
        this.setupErrorCodeItems();    
      }
    }
  }

  // Get Vehicle Models
  getVehicleModels(action, index, value) {
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      make: this.make,
      prodType: value,
    };
    this.vehicleFormInfo[index].modelLoading = true;
    this.vehicleFormInfo[index].modelList = [];
    this.probingApi.getVehicleModelsGTS(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.data.model;
        this.vehicleFormInfo[index].modelList.push({
          id: "All",
          name: "All",
        });
        for (let m of resultData) {
          this.vehicleFormInfo[index].modelList.push({
            id: m.model_name,
            name: m.model_name,
          });
        }
        this.vehicleFormInfo[index].modelLoading = false;

        if (index == 0) {
          this.vehicleFormInfo[index].prodType = value;
        }
        this.vehicleList[index].title = value;

        if (action == "edit" && this.actionId == 2) {
          console.log(this.gtsInfo["vehicleDetails"],'check dicv');
          let vehicleData =
            this.gtsInfo["vehicleDetails"] == ""
              ? ""
              : JSON.parse(this.gtsInfo["vehicleDetails"]);
          let vlen = vehicleData.length - 1;
          if (vlen == index) {
            this.gtsEditorAction();
          }
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      }
      else{
        this.vehicleFormInfo[index].modelLoading = false;
      }
    });
  }

  
  // Get Vehicle Models
  getModels(action, index, value) {
    if(this.DICVDomain){
      this.getEmissionsAndModels(action,index, value);
    }
    else{
    let apiData = { 
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      threadType: this.threadType,
      searchText: '',
      make: value      
    };
    this.vehicleFormInfo[index].modelLoading = true;
    this.vehicleFormInfo[index].modelList = [];
    this.partsApi.getModels(apiData).subscribe((response) => {
      if (response.status == "Success") {
        //this.loading = false;
        let resultData = response.data.model;
        this.vehicleFormInfo[index].modelList.push({
          id: "All",
          name: "All",
        });        
        for(let m of resultData) {          
          this.vehicleFormInfo[index].modelList.push({
            'id': m,
            'name': m
          });
        }
        this.vehicleFormInfo[index].modelLoading = false;

        if (index == 0) {
          this.vehicleFormInfo[index].prodType = value;
        }
        this.vehicleList[index].title = value;
        
        if (action == "edit" && this.actionId == 2) {
          let vehicleData =
            this.gtsInfo["vehicleDetails"] == ""
              ? ""
              : JSON.parse(this.gtsInfo["vehicleDetails"]);
          let vlen = vehicleData.length - 1;
          if (vlen == index) {
            this.gtsEditorAction();
          }
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }

      }
      else{
        this.vehicleFormInfo[index].modelLoading = false;
      }
    });
    }
  }

  getModelsDICVData(action, index, value) {
    let emissionsVal = this.editGtsForm.value.vehicleInfo[index].emissionId != undefined ? this.editGtsForm.value.vehicleInfo[index].emissionId : '';
    emissionsVal = emissionsVal == '' ? '' : JSON.stringify(emissionsVal);
    let apiData = { 
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      threadType: this.threadType,
      searchText: '',
      make: value,
      emissionValues: emissionsVal     
    };
    this.vehicleFormInfo[index].modelLoading = true;
    if(this.emissionFieldClear){
      this.vehicleFormInfo[index].models = [];
    }
    this.vehicleFormInfo[index].modelList = [];
    this.partsApi.getModels(apiData).subscribe((response) => {
      if (response.status == "Success") {
        //setTimeout(() => {        
          let resultData = response.data.model;
          this.vehicleFormInfo[index].modelList.push({
            id: "All",
            name: "All",
          });        
          for(let m of resultData) {          
            this.vehicleFormInfo[index].modelList.push({
              'id': m,
              'name': m
            });
          }
        this.vehicleFormInfo[index].modelLoading = false;
        //}, 600);
        if (index == 0) {
          this.vehicleFormInfo[index].prodType = value;
        }
        this.vehicleList[index].title = value;
        
        if (action == "edit" && this.actionId == 2) {
          let vehicleData =
            this.gtsInfo["vehicleDetails"] == ""
              ? ""
              : JSON.parse(this.gtsInfo["vehicleDetails"]);
          let vlen = vehicleData.length - 1;
          if (vlen == index) {
            this.gtsEditorAction();
          }
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }

      }
      else{
        this.vehicleFormInfo[index].modelLoading = false;
      }
    });
  }

  // Get Vehicle Models
  getEmissionsAndModels(action, index, value) {

    // emissions
    let loopUpData = { 
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      commonApiValue: '24',
      searchKey: '',
      offset: '',
      limit: '',
      make: value      
    };    
    this.vehicleFormInfo[index].emissionLoading = true;
    this.vehicleFormInfo[index].emissionList = [];
    this.commonApi.getEscalationLoopUpDataList(loopUpData).subscribe((response) => {
      if (response.status == "Success") {
        this.loading = false;
        let resultData = response.items;        
        for(let m of resultData) {                
          this.vehicleFormInfo[index].emissionList.push({
            'id':m.id,
            'name': m.name
          });
        }        
        console.log(this.vehicleFormInfo[index].emissionList);
        this.vehicleFormInfo[index].emissionLoading = false;
        if (index == 0) {
          this.vehicleFormInfo[index].prodType = value;
        }
        this.vehicleList[index].title = value;
        console.error("this.vehicleList", this.vehicleList);
      }
      else{
        this.vehicleFormInfo[index].emissionLoading = false;
      }     
    });    
    this.getModelsDICVData(action, index, value);    
  }

  // Option Search
  filterOptions(field, value) {
    switch (field) {
      case "catg":
        this.filteredCategory = [];
        break;
      case "ecu":
        this.filteredEcuTypes = [];
        break;
      case "mfg":
        this.filteredModuleMft = [];
        break;
      case "sys":
        this.filteredSystem = [];
        break;
      case "dtc":
        this.filteredDtcItems = [];
        break;
    }
    this.selectSearch(field, value);
  }

  // Filter Search
  selectSearch(field, value: string) {
    let filter = value.toLowerCase();
    switch (field) {
      case "catg":
        this.filteredCategory = [];
        for (let i = 0; i < this.probCategory.length; i++) {
          let option = this.probCategory[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
            this.filteredCategory.push(option);
          }
        }
        break;
      case "ecu":
        this.filteredEcuTypes = [];
        for (let i = 0; i < this.ecuTypes.length; i++) {
          let option = this.ecuTypes[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
            this.filteredEcuTypes.push(option);
          }
        }
        break;
      case "mfg":
        this.filteredModuleMft = [];
        for (let i = 0; i < this.moduleMft.length; i++) {
          let option = this.moduleMft[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
            this.filteredModuleMft.push(option);
          }
        }
        break;
      case "sys":
        this.filteredSystem = [];
        for (let i = 0; i < this.system.length; i++) {
          let option = this.system[i];
          if (option.toLowerCase().indexOf(filter) >= 0) {
            this.filteredSystem.push(option);
          }
        }
        break;
      case "dtc":
        this.filteredDtcItems = [];
        for (let i = 0; i < this.dtcItems.length; i++) {
          let option = this.dtcItems[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
            this.filteredDtcItems.push(option);
          }
        }
        break;
    }
  }

  // Selected Workstreams
  selectedWorkstreams(items) {
    this.filteredWorkstreamIds = items;
    this.filteredWorkstreams = [];
    for (let ws of this.workstreamItems) {
      for (let i of items) {
        if (ws.workstreamId == i) {
          this.filteredWorkstreams.push(ws.workstreamName);
        }
      }
    }

    if (this.workstreamValid) {
      if (this.editGtsForm.value.prodTypeVal == "All") {
        this.pblmDetailFlag = true;
      } else {
        if (this.editGtsForm.value.vehicleInfo.length > 0) {
          this.pblmDetailFlag = this.vehicleFormInfo[0].actionFlag
            ? true
            : false;
        }
      }
    } else {
      this.pblmDetailFlag = false;
    }
  }

  // Selected Models
  selectedModels(index, items) {
    this.editGtsForm.value.vehicleInfo[index].model = items;
    this.vehicleFormInfo[index].models = items;
    this.vehicleFormInfo[index].modelValid =
      this.editGtsForm.value.vehicleInfo[index].model.length == 0
        ? false
        : true;       
    console.log(this.industryType['id']);
    if(this.industryType['id'] == '1') {      
      this.vehicleFormInfo[index].actionFlag = this.vehicleFormInfo[index].modelValid ? true : false;
      /*this.editGtsForm.value.vehicleInfo[index].year = '';
      this.vehicleFormInfo[index].years ='';*/
    }
    else{
      this.vehicleFormInfo[index].actionFlag = this.vehicleFormInfo[index].modelValid && this.vehicleFormInfo[index].yearValid ? true : false;
    } 
    if(this.vehicleFormInfo[index].actionFlag){
      if(index>0){
        this.vehicleFormInfo[index-1].actionFlag = false;
      }
    }
    /*if(this.DICVDomain){
      if(this.prodTypes.length == 1 ) { this.vehicleFormInfo[0].actionFlag = false; }
    }*/
    this.pblmDetailFlag = this.vehicleFormInfo[0].actionFlag;
  }
  // Selected EmissionId
  selectedEmissions(index, items) {
    let value = this.vehicleFormInfo[index].prodType;
    this.editGtsForm.value.vehicleInfo[index].emissionId = items;    
    this.vehicleFormInfo[index].emissions = items;  
    this.vehicleFormInfo[index].modelLoading = true;  
    if(this.editGtsForm.value.vehicleInfo[index].emissionId == ''){         
        this.emissionFieldClear = true;               
    }    
    setTimeout(() => {
      this.getModelsDICVData(this.actionInit, index, value);
    }, 1000);      
  }
  // Selected EmissionName
  selectedEmiNames(index, items) { 
    this.disableErrorCodeFlag = (items.length == 0) ? true : false;
    this.editGtsForm.value.vehicleInfo[index].emissionName = items;  
    if(this.domainId == 98 && this.filteredErrorCodes.length > 0) {
      setTimeout(() => {
        this.setupErrorCodeItems();
      }, 100);
    }
  }
  // Selected Years
  selectedYears(index, items) {
    this.editGtsForm.value.vehicleInfo[index].year = items.items;
    this.vehicleFormInfo[index].years = items.items;

    this.vehicleFormInfo[index].yearValid =
    this.editGtsForm.value.vehicleInfo[index].year.length == 0 ? false : true;
    
  this.vehicleFormInfo[index].actionFlag =
    this.vehicleFormInfo[index].modelValid &&
    this.vehicleFormInfo[index].yearValid
      ? true
      : false;

    console.log(this.industryType['id']);
    if(this.industryType['id'] == '1') {      
      this.vehicleFormInfo[index].actionFlag = this.vehicleFormInfo[index].modelValid ? true : false;
      /*if(!this.vehicleFormInfo[index].yearValid){
        this.editGtsForm.value.vehicleInfo[index].year = '';
        this.vehicleFormInfo[index].years = '';
      }*/
    }
    /*if(this.DICVDomain){
      if(this.prodTypes.length == 1 ) { this.vehicleFormInfo[0].actionFlag = false; }
    } */
    this.pblmDetailFlag = this.vehicleFormInfo[0].actionFlag;
    console.error("vechileInfo year", this.editGtsForm.value.vehicleInfo);
  }

  // Selected Tags
  selectedTags(items) {
    this.filteredTagIds = items;
    this.filteredTags = [];
    for (let t of this.tagItems) {
      for (let i of items) {
        let tagName = t.name;
        if (tagName == i) {
          this.filteredTags.push(tagName);
        }
      }
    }
    //this.tagValid = (this.filteredTags.length == 0) ? false : true;
  }

  gtsEditorAction() {
    for (let ws of this.workstreamItems) {
      for (let i of this.filteredWorkstreamIds) {
        if (ws.workstreamId == i) {
          this.filteredWorkstreams.push(ws.workstreamName);
        }
      }
    }
    let vehicleData =
      this.gtsInfo["vehicleDetails"] == ""
        ? []
        : JSON.parse(this.gtsInfo["vehicleDetails"]);
       
        console.log(vehicleData);  
    this.editGtsForm.value.vehicleInfo = vehicleData;
    console.log('before time out');
    console.log(this.editGtsForm.value.vehicleInfo);  

    setTimeout(() => {
      this.step2 = true;
      this.step2Action = true;
      this.stepBack = false;
      this.editGtsForm.value.workstreams = this.filteredWorkstreamIds;
      this.editGtsForm.value.errorCodes = this.filteredErrorCodeIds;
      this.editGtsForm.value.tags = JSON.stringify(this.filteredTags);
      this.step1Submitted = false;
      this.loading = false;
      console.log('after time out');
      console.log(this.editGtsForm.value.vehicleInfo);
      console.log(this.vehicleFormInfo);
    }, 1000);
  }

  // Publish or Save Draft
  submitAction(action) {
    this.saveDraftFlag = action == "save" ? true : false;
    this.gtsEditorFlag = action == "editor" ? true : false;
    if (action == "publish") {
      if (this.gtsPublishFlag) {
        this.onSubmit();
      }
    } else {
      this.onSubmit();
    }
  }

  workflowtypeChange(){
    this.workflowtype = this.workflowtypeId.toString();
    this.workflowValid = this.workflowtype == '' ? false : true ;
    for(let wft of this.workflowtypeOptions){
      if(wft.id == this.workflowtype){
        this.workflowName = wft.name;
      }
    }
  }

  // Back to Step1
  backStep1() {
    this.step1 = true;
    this.step2 = false;
    this.step1Action = true;
    this.step2Action = false;
    this.stepBack = true;
    this.step2Submitted = false;
  }

  // Notify User Change
  notifyUserChange(status) {
    this.notifyFlag = status == 1 ? true : false;
    this.editGtsForm.value.notifyUsers = status;
  }

  // On Submit
  onSubmit() {
    console.log('in')
    if (this.step1Action && !this.step2Action) {
      console.log('in step1')
      this.step1Submitted = true;
      if (this.invalidFile || this.invalidFileSize) {
        console.log('invalid file or file size')
        return false;
      }

      if (this.filteredWorkstreams.length == 0) {
        console.log('invalid ws')
        this.workstreamValid = false;
        return false;
      } else {
        this.workstreamValid = true;
      }
      if(this.collabticDomain){
        if(this.workflowtype == ''){
          this.workflowValid = false;
          return false;
        }
        else{
          this.workflowValid = true;
        }
      }

      /*if(this.filteredTags.length == 0) {
        console.log(2)
        this.tagValid = false;
        return false;
      } else {
        this.tagValid = true;
      }*/
      if(this.tvsFlag || this.DICVDomain) {
        if (this.editGtsForm.value.prodTypeVal == "") {
          return false;
        }
      }

      if (this.editGtsForm.value.probCatg == 13) {
        this.ecuTypeValid =
          this.editGtsForm.value.ecuType == null ||
          this.editGtsForm.value.ecuType == ""
            ? false
            : true;
        this.mfgValid =
          this.editGtsForm.value.moduleMft == null ||
          this.editGtsForm.value.moduleMft == ""
            ? false
            : true;
        this.dtcValid =
          this.editGtsForm.value.dtc == null || this.editGtsForm.value.dtc == ""
            ? false
            : true;

        if (!this.ecuTypeValid || !this.mfgValid || !this.dtcValid) {
          return false;
        }
      }
     
      if(this.tvsFlag) {    
        for (let v of this.editGtsForm.value.vehicleInfo) {
          let ptype = v.productType;
          let model = v.model;
          let year = v.year;
          if (ptype == "" || model.length == 0 || year.length == 0) {
            return false;
          }
        }
      }        

      // stop here if form is invalid
      if (this.editGtsForm.invalid) {
        console.log('invalid form', this.editGtsForm)
        return;
      }

      this.step2 = true;
      this.step2Action = true;
      this.stepBack = false;
      this.editGtsForm.value.workstreams = this.filteredWorkstreamIds;
      this.editGtsForm.value.errorCodes = this.filteredErrorCodeIds;
      this.editGtsForm.value.tags = JSON.stringify(this.filteredTags);
      this.step1Submitted = false;
    } else {
      this.step2Submitted = true;
      let gtsFormVal = this.editGtsForm.value;
      this.editGtsForm.value.workstreams = this.filteredWorkstreamIds;
      this.editGtsForm.value.errorCodes = this.filteredErrorCodeIds;
      this.editGtsForm.value.tags = JSON.stringify(this.filteredTags);

      console.log(gtsFormVal.vehicleInfo);
      // empty check
      if(gtsFormVal.vehicleInfo.length>0) {   
        for (let v in gtsFormVal.vehicleInfo) {
          let ptype = gtsFormVal.vehicleInfo[v].productType;
          let model = gtsFormVal.vehicleInfo[v].model;
          let year = gtsFormVal.vehicleInfo[v].year;
          if (ptype != "") {         
            if (model.length == 0) {
              gtsFormVal.vehicleInfo[v]['model'] = [];
            }
            if (year.length == 0) {
              gtsFormVal.vehicleInfo[v]['year'] = [];
            }
          }
          else{
            gtsFormVal.vehicleInfo.splice(v, 1);
          }
        }
      }


      if (this.actionId == 2) {
        let vinfo = [];
        for (let v of this.vehicleFormInfo) {
          if(this.DICVDomain){
            vinfo.push({
              productType: v.prodType,
              emissionId: v.emissionId,
              emissionName: v.emissionName,
              model: v.models,
              year: v.years,
            });
          }
          else{
            vinfo.push({
              productType: v.prodType,
              model: v.models,
              year: v.years,
            });
          }
          
        }
        gtsFormVal.vehicleInfo = JSON.stringify(vinfo);
        this.editGtsForm.value.tags = JSON.stringify(this.filteredTags);
      } else {
        gtsFormVal.vehicleInfo = JSON.stringify(gtsFormVal.vehicleInfo);
      }

      console.log(JSON.stringify(gtsFormVal.vehicleInfo));
      console.log(gtsFormVal.vehicleInfo);
      //return false;

      let action;
      if (this.gtsPublishFlag) {
        action = 2;
        gtsFormVal.action = action;
      } else {
        action = this.editActionStatus;
      }

      //console.log(gtsFormVal)
      this.saveGts(action, gtsFormVal);
      
    }
  }

  // Save GTS
  saveGts(action, gtsFormVal) {

    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, {backdrop: 'static', keyboard: false, centered: true});
    let gtsImg;
    if (this.imgName == null) {
      gtsImg = this.selectedGtsImg == undefined ? "" : this.selectedGtsImg;
    } else {
      gtsImg = this.imgName;
    }
    let prodTypeId: any = 0;
    let editMode = this.gtsAction == "edit" ? gtsFormVal.editMode : 0;
    let gtsFormData = new FormData();
    let workstreams: any = JSON.stringify(gtsFormVal.workstreams);
    let errorCodes: any = JSON.stringify(gtsFormVal.errorCodes); 
    gtsFormData.append("editMode", editMode);
    gtsFormData.append("action", action);
    gtsFormData.append("apiKey", this.apiKey);
    gtsFormData.append("domainId", gtsFormVal.domainId);
    gtsFormData.append("countryId", gtsFormVal.countryId);
    gtsFormData.append("userId", gtsFormVal.userId);
    gtsFormData.append("gtsImg", gtsImg);
    gtsFormData.append("workstreams", workstreams);
    if(this.collabticDomain){
    gtsFormData.append("workFlowId", this.workflowtype);
    }
    gtsFormData.append("gtsTitle", gtsFormVal.gtsTitle);
    gtsFormData.append("description", gtsFormVal.gtsDescription);
    gtsFormData.append("productCatId", gtsFormVal.probCatg);
    gtsFormData.append("productTypeId", prodTypeId);
    gtsFormData.append("systemSelection", gtsFormVal.system);
    gtsFormData.append("selectedTags", gtsFormVal.tags);
    gtsFormData.append("prodTypeVal", gtsFormVal.prodTypeVal);
    gtsFormData.append("vehicleInfo", gtsFormVal.vehicleInfo);
    gtsFormData.append("notifyUsers", gtsFormVal.notifyUsers);
    gtsFormData.append("errorCodes", errorCodes);

    switch (this.gtsAction) {
      case "edit":
        gtsFormData.append("gtsProcedureId", this.gtsId);
        break;
      case "duplicate":
        gtsFormData.append("duplicateProcedureId", this.gtsId);
        break;
    }

    if (gtsFormVal.probCatg == 13) {
      let dtc = gtsFormVal.dtc.split(" - ");
      gtsFormData.append("productMfgId", gtsFormVal.moduleMft);
      gtsFormData.append("GTSECUtype", gtsFormVal.ecuType);
      gtsFormData.append("dtcCode", dtc[0]);
      gtsFormData.append("dtcDesc", dtc[1]);
    } else {
      gtsFormData.append("productMfgId", prodTypeId);
      gtsFormData.append("GTSECUtype", prodTypeId);
      gtsFormData.append("dtcCode", "");
      gtsFormData.append("dtcDesc", "");
    }

    /*new Response(gtsFormData).text().then(console.log);
    return false;*/

    this.gtsApi.manageGts(gtsFormData).subscribe((response) => {
      this.successMsg = response.result;
      let timeout = 5000;
      let url = RedirectionPage.GTS;
      let flag: any = true;
      let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
      /*let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
      localStorage.setItem(pageTitle[pageDataIndex].navEdit, 'true');
      localStorage.setItem(pageDataInfo, JSON.stringify(threadInfo));*/
      let navEditText = pageTitle[pageDataIndex].navEdit;
      let routeLoadText = pageTitle[pageDataIndex].routerText;
      localStorage.setItem(navEditText, flag);
      localStorage.setItem(routeLoadText, flag);
      if (!this.gtsEditorFlag) {
        modalRef.dismiss("Cross click");
        this.bodyElem.classList.remove(this.bodyClass);
        let msgModalRef = this.modalService.open(
          SuccessModalComponent,
          {backdrop: 'static', keyboard: false, centered: true}
        );
        msgModalRef.componentInstance.successMessage = this.successMsg;
        setTimeout(() => {
          msgModalRef.dismiss("Cross click");
        }, timeout);
      }

      if (response.status == "Success") {
        console.log(response);
        this.successFlag = this.gtsEditorFlag ? false : true;
        setTimeout(() => {
          this.successFlag = false;
          if (this.gtsEditorFlag) { 
            let editorUrl = response.flowchartURL;   
            console.log(editorUrl);  
            window.location.href = editorUrl;  

            setTimeout(() => {
              modalRef.dismiss("Cross click");
              this.bodyElem.classList.remove(this.bodyClass);              
            }, 3000);

            setTimeout(() => {
              //window.close();
            }, 1000);
          } else {
            //window.close();
            this.router.navigate([this.navUrl]);
          }

          if(!this.wsNav && this.actionId == 1) {
            let url = "gts";
            this.router.navigate([url]);
          }

          if(this.actionId == 2 && !this.gtsEditorFlag) {
            this.router.navigate([this.navUrl]);
          }
        }, timeout);
      }
    });
  }

  // Close Current Window
  closeWindow() {
    const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.access = "Cancel";
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        if(this.gtsId == 0) {
          window.close();
        } else {
          let url = RedirectionPage.GTS;
          let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
          localStorage.setItem(pageTitle[pageDataIndex].navCancel, 'true');
          this.router.navigate([this.navUrl]);
        }
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

  disableErrorCodeSelection(index) {
    this.filteredErrorCodeIds.splice(index, 1);
    this.errorCodeItems = this.filteredErrorCodeIds;
    this.filteredErrorCodes.splice(index, 1);
  }
    
  // Manage List
  manageList(fieldName) {
    let headerHeight =
    document.getElementsByClassName("prob-header")[0].clientHeight;
    let innerHeight = this.bodyHeight - (headerHeight + 20);
    innerHeight = this.bodyHeight > 1420 ? 980 : innerHeight;
    let selectionType  = 'multiple';    
    let filteredItems = this.filteredErrorCodeIds;
    let filterLists = this.filteredErrorCodes;
    let actionApiName = '';
    let actionQueryVal = '';
    let action = true;    
    let fieldData = '';
    let typeId:any = [];
    let gtsAccess = false;
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,type: '',
      typeId: typeId
    };
    let apiUrl = '';
    let inputData = {
      baseApiUrl: '',
      apiUrl: '',
      field: fieldName,
      selectionType: selectionType,
      filteredItems: filteredItems,
      filteredLists: filterLists,
      actionApiName: actionApiName,
      actionQueryValues: actionQueryVal
    };
    let access = 'newthread';
    let title = '';
    console.log(fieldName, apiUrl, apiData, filterLists, filteredItems)
    let apiFieldData: any = fieldData;
    console.log(fieldData)    
    
    switch(fieldName) {
      case 'errorCode':
        access = 'New Thread Error Codes';
        title = 'Error codes';
        if(this.DICVDomain) {
          action = false;
          gtsAccess = true;
          let emissions = this.getEmissions();
          let emissionIds = emissions.emissionIds;
          if(emissionIds.length == 0) {
            return false;
          }
          apiData.type = 'emission';
          apiData.typeId = JSON.stringify(emissionIds);
        }
        break;
      /*case 'tags':
        access = 'New Thread Tags';
        title = 'Tags';
        break;      
      case 'model':
        title = 'Model';
        break;  */
    }
    console.log("access" +access);
    console.log("action" +action);
    console.log("filteredItems" +filteredItems);
    console.log("inputData" +(JSON.stringify(inputData)));
    console.log("innerHeight"+innerHeight);
    inputData['title'] = title;

    const modalRef = this.modalService.open(ManageListComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = action;
    modalRef.componentInstance.gtsAccess = gtsAccess;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight - 88;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService)
      let res = receivedService;
      let id, itemVal;     
      id = [];
      itemVal = [];  
      if(receivedService.length>0){
        for(let i of res) {
          id.push(i.id);
          this.filteredErrorCodeIds = id;
          this.errorCodeItems = id;
          itemVal.push(i.name);
          this.filteredErrorCodes = itemVal;        
        }     
      } else {
        this.filteredErrorCodeIds = [];
        this.filteredErrorCodes = [];
      }
    });
  }

  getEmissions() {
    let emission:any = [];
    let emissionName: any = [];
    let vinfo = this.editGtsForm.value.vehicleInfo;
    vinfo.forEach(item => {
      console.log(item)
      emission.push(...item.emissionId);
      emissionName.push(...item.emissionName);
    });  
    let emissionIds:any = [...new Set(emission)];
    let emissionNames:any = [...new Set(emissionName)]
    let res = {
      emissionIds: emissionIds,
      emissionNames: emissionNames
    }
    return res;
  }

  setupErrorCodeItems() {
    let emissions = this.getEmissions();
    let emissionIds = emissions.emissionIds;
    let emissionNames = emissions.emissionNames;
    this.disableErrorCodeFlag = (emissionIds.length == 0) ? true : false;
    if(emissionIds.length == 0) {
      this.filteredErrorCodeIds = [];
      this.filteredErrorCodes = [];
    } else {
        let fcodes = [], fids = [];
        console.log(emissionNames)
        this.filteredErrorCodes.forEach((item, index) => {
          let code = item.split('-');
          console.log(item, code[0], emissionNames.includes(code[0]))
          if(emissionNames.includes(code[0].replace(/ /g, ""))) {
            fids.push(this.filteredErrorCodeIds[index]);
            fcodes.push(this.filteredErrorCodes[index]);
          }
        });
        console.log(fids, fcodes)
        this.filteredErrorCodeIds = fids;
        this.filteredErrorCodes = fcodes;
    }
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass); 
    this.bodyElem.classList.remove(this.bodyClass1);  
    this.bodyElem.classList.remove(this.bodyClass2);  
  }
}
