import { Component, OnInit, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import * as moment from "moment";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { ProbingQuestionsService } from "src/app/services/probing-questions/probing-questions.service";
import { GtsService } from "src/app/services/gts/gts.service";
import { ActionFormComponent } from "src/app/components/common/action-form/action-form.component";
import { ManageListComponent } from "src/app/components/common/manage-list/manage-list.component";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { ManageListComponentGTS } from "src/app/components/common/manage-list-gts/manage-list.component";
import { Constant, IsOpenNewTab, PlatFormType, windowHeight } from '../../../../common/constant/constant';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { PartsService } from '../../../../services/parts/parts.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CommonService } from '../../../../services/common/common.service';
import { emit } from "process";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
export class NewComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = "GTS Procedure Creation";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public countryId;
  public apiKey: string = "dG9wZml4MTIz";
  public userId;domainId
  public make: string = "TVS";
  public headerData: Object;

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
  public titleMaxLen: number = 250;
  public descMaxLen: number = 200;

  public loading: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public selectedGtsImg: File;
  public imgURL: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public workstreamItems: any;
  public filteredWorkstreamIds = [];
  public filteredWorkstreams = [];

  public errorCodeItems: any;
  public filteredErrorCodeIds = [];
  public filteredErrorCodes = [];

  public probCategory = [];
  public filteredCategory = [];
  public dtcItems = [];
  public filteredDtcItems = [];
  public filteredDtcList = [];
   public ecuTypes = [];
  public filteredEcuTypes = [];
  public moduleMft = [];
  public filteredModuleMft = [];
  public system= [];
  public filteredSystem= [];
  public tagItems= [];
  public filteredTagIds = [];
  public filteredTags = [];
  //public newTags = [];
  public prodTypes = [];
  public vehicleProdTypes = [];
  public years = [];
  public vehicleFormInfo = [];
  public vehicleList = [];
  public defProdType: any;
  public defProdTypeVal: any;
  public prodTypeFlag: boolean = false;
  public pblmDetailFlag: boolean = false;
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

  public workstreamValid: boolean = false;
  public workflowValid: boolean = false;
  public ecuTypeValid: boolean = false;
  public mfgValid: boolean = false;
  public dtcValid: boolean = true;
  public tagValid: boolean = false;
  public notifyFlag: boolean = false;
  newGtsForm: FormGroup;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public pageAccess: string = "newGts";
  public collabticDomain: boolean = false;
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
  public productEmissionsTitle: string = "Emissions";
  public industryType: any = [];
  public user: any;  
  public errorCodeTitle: string = '';
  public errorCodebg: string = '';
  public DICVDomain: boolean = false;
  public emissionFieldClear: boolean = false;

  public workflowtype: string = '';
  public workflowtypeOptions: any = [];
  public workflowName: string = '';
 
  @ViewChild("catgSelect", { static: false }) catgSelect: any;
  @ViewChild("ecuSelect", { static: false }) ecuSelect: any;
  @ViewChild("mfgSelect", { static: false }) mfgSelect: any;
  @ViewChild("systemSelect", { static: false }) systemSelect: any;
  @ViewChild("dtcSelect", { static: false }) dtcSelect: any;

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
    private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
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
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.newGtsForm.controls;
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

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   

    if(this.domainId == 98){   
      this.DICVDomain = true;
    }

    //this.domainId = localStorage.getItem("domainId");
    //this.userId = localStorage.getItem("userId");
    this.countryId = localStorage.getItem('countryId');

    let authFlag =
      ((this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined) ) || 
      (localStorage.getItem('gtsFlag') == '0')
        ? false
        : true;
    if (authFlag) {

      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      this.tvsFlag = (this.platformId == 2 && this.domainId == 52) ? true : false;
      this.collabticDomain = this.platformId == 1 ? true : false;
      if(this.tvsFlag){
        this.productMakePl = "Product Type";
      }
      else{
        this.productMakePl = "Make"
      }

      this.industryType = this.commonApi.getIndustryType();
      //console.log(this.industryType);
      if(this.industryType['id'] == '1'){
        this.errorCodeTitle = 'Error Code';
        this.errorCodebg = 'ec';
      }
      else{
        this.errorCodeTitle = 'DTCs';
        this.errorCodebg = 'dtc';
      }

      this.headerData = {       
        title: this.title,
        action: 'new',
        id: '0'
      };
      if(this.tvsFlag || this.DICVDomain){
        this.newGtsForm = this.formBuilder.group({
          action: [""],
          domainId: [this.domainId],
          countryId: [this.countryId],
          userId: [this.userId],
          workstreams: [""],
          gtsTitle: ["", [Validators.required]],
          gtsDescription: [""],
          probCatg: ["", [Validators.required]],
          ecuType: [""],
          moduleMft: [""],
          system: ["", [Validators.required]],
          dtc: [""],
          tags: [""],
          prodTypeVal: ["", [Validators.required]],
          vehicleInfo: this.formBuilder.array([]),
          notifyUsers: [0],
        });
      }      
      else{
        if(this.collabticDomain){
          this.newGtsForm = this.formBuilder.group({
            action: [""],
            domainId: [this.domainId],
            countryId: [this.countryId],
            userId: [this.userId],
            workstreams: [""],
            workflowtype: [""],
            errorCodes:[""],
            gtsTitle: ["", [Validators.required]],
            gtsDescription: [""],
            probCatg: ["", [Validators.required]],
            ecuType: [""],
            moduleMft: [""],
            system: ["", [Validators.required]],
            dtc: [""],
            tags: [""],
            prodTypeVal: [""],
            vehicleInfo: this.formBuilder.array([]),
            notifyUsers: [0],
          });
        }
        else{
          this.newGtsForm = this.formBuilder.group({
            action: [""],
            domainId: [this.domainId],
            countryId: [this.countryId],
            userId: [this.userId],
            workstreams: [""],
            errorCodes:[""],
            gtsTitle: ["", [Validators.required]],
            gtsDescription: [""],
            probCatg: ["", [Validators.required]],
            ecuType: [""],
            moduleMft: [""],
            system: ["", [Validators.required]],
            dtc: [""],
            tags: [""],
            prodTypeVal: [""],
            vehicleInfo: this.formBuilder.array([]),
            notifyUsers: [0],
          });
        }
       
      }
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

      /*this.probCategory.push({
        id: 0,
        name: 'Create New'
      });*/

      // Get Workstream Lists
      this.getWorkstreamLists();
      if(this.collabticDomain){
      this.getWorkFlowLists();
      }

      setTimeout(() => {
        this.setScreenHeight();
      }, 1500);
      
    } else {
      this.router.navigate(["/forbidden"]);
    }
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
        //if(pc.name != 'DTCs') {
        this.probCategory.push({
          id: pc.id,
          name: pc.name,
        });
        //}
      }

      this.filteredCategory = this.probCategory;
      this.system = resultData.systemSelection;
      this.filteredSystem = this.system;
      console.log(this.system);
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
        this.loading = false;
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
        this.loading = false;
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
      }
    });   
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
    };
  }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedGtsImg = null;
    this.imgURL = this.selectedGtsImg;
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
              action: "new",
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
          console.log(action);
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
                this.probCatgName = "";
                this.probCatgVal = "0";
              }, 500);
            }
          });
        } else if (value == "DTCs") {
          this.dtcId = id;
          this.dtcFlag = true;
          this.dtcVal = 0;
          // Get DTC Info
          this.getDTCInfo();
        }
        break;
      case "ecuType":
        this.ecuTypeName = value;
        this.ecuTypeVal = id;
        this.ecuTypeValid = true;
        if (value == "Create New" || value == "Edit Newly Created") {
          this.ecuSelect.close();
          this.ecuTypeName = "";
          this.ecuTypeVal = "0";

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
                  this.ecuTypes[index].name = name;
                  this.filteredEcuTypes[index].name = name;
                }
                this.ecuAction = "edit";
              }, 500);
            } else {
              this.ecuTypeName = "";
              this.ecuTypeVal = "0";
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
              this.mfgVal = "0";
              this.mfgName = "";
            }
          });
        }
        break;
      case "system":
        this.systemVal = id;
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

                console.log(this.system);
                console.log(this.filteredSystem);

                if(this.system == null || this.system == undefined){
                  this.system = [];
                  this.filteredSystem = [];
                  this.system.push(this.sysName);
                  this.filteredSystem.push(this.sysName);
                }
                else{
                  this.system.unshift(this.sysName);
                  this.filteredSystem.unshift(this.sysName);
                }                
              }
              console.log(this.system[0]);
              console.log(this.filteredSystem[0]);

              setTimeout(() => {
                this.sysActionTxt = this.editTxt;
                this.systemVal = name;
                if (this.sysAction == "edit" && actionItem == "new") {
                  /*let index = this.system.findIndex(
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
              this.systemVal = "0";
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

             /* const modalRef = this.modalService.open(
                ConfirmationComponent,
                {backdrop: 'static', keyboard: false, centered: true}
              );
              modalRef.componentInstance.access = "DTC Replace";
              modalRef.componentInstance.confirmAction.subscribe(
                (recivedService) => {
                  modalRef.dismiss("Cross click");
                  if (recivedService) {
                    this.newGtsForm.value.gtsTitle = dtcName;
                  }
                }
              );*/
            } else {
              this.dtcVal = "0";
            }
          });
        } else {
          this.dtcSelect.close();
          /*const modalRef = this.modalService.open(
            ConfirmationComponent,
            {backdrop: 'static', keyboard: true, centered: true}
          );
          modalRef.componentInstance.access = "DTC Replace";
          modalRef.componentInstance.confirmAction.subscribe(
            (recivedService) => {
              modalRef.dismiss("Cross click");
              if (recivedService) {
                this.newGtsForm.value.gtsTitle = value;
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
      //console.log(response)
      let resultData = response.data;
      let dtc = resultData.diagnostics;
      for (let d of dtc) {
        let sep = d.description != "" ? " - " : "";
        let dtcInfo = d.trouble_code + sep + d.description;
        this.dtcItems.push({
          name: dtcInfo,
        });
        this.filteredDtcItems = this.dtcItems;
      }

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
    apiFormData.append("catId", this.dtcId);

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
    
    console.log(this.prodTypes);
    console.log(this.vehicleProdTypes);

    let action;
    console.log(field + "::" + value);
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
            this.addDICVVehicelFields(index, value);
          }
          else{
            this.addVehicelFields(index, value);
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
          if (this.vehicleFormInfo[index].actionFlag) {
            this.pblmDetailFlag = !this.workstreamValid ? true : false;
            const modalRef = this.modalService.open(
              ConfirmationComponent,
              {backdrop: 'static', keyboard: true, centered: true}
            );
            modalRef.componentInstance.access = "Remove Vehicles";
            modalRef.componentInstance.confirmAction.subscribe(
              (recivedService) => {
                modalRef.dismiss("Cross click");
                console.log(recivedService);
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
            this.getVehicleModels(index, value);
          }
          else{
            this.getModels(index, value);
          }  
        }
        break;
    }

    console.log(this.prodTypes);
    console.log(this.vehicleProdTypes);
  }
  

  // Manage Tag
  manageTag() {
    let headerHeight =
      document.getElementsByClassName("prob-header")[0].clientHeight;
    let innerHeight = this.bodyHeight - (headerHeight + 20);
    innerHeight = this.bodyHeight > 1420 ? 980 : innerHeight;

    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };

    const modalRef = this.modalService.open(
      ManageListComponentGTS,
      {backdrop: 'static', keyboard: true, centered: true}
    );
    modalRef.componentInstance.access = "Tag";
    //modalRef.componentInstance.manageList = this.tagItems;
    modalRef.componentInstance.filteredTags = this.filteredTagIds;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 240;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      let tagItems = receivedService;
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

  disableErrorCodeSelection(index) {
    this.filteredErrorCodeIds.splice(index, 1);
    this.errorCodeItems = this.filteredErrorCodeIds;
    this.filteredErrorCodes.splice(index, 1);
  }

  // Add Tag
  addTag() {
    this.tagFlag = false;
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };

    let action = {
      action: this.dtcCode == "" ? "new" : "edit",
      id: "",
      name: "",
    };

    const modalRef = this.modalService.open(ActionFormComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.access = "Tag Creation";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = action;
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      console.log(receivedService);
      this.tagFlag = true;
      if (receivedService.action) {
        let newItem = {
          editAccess: 1,
          id: receivedService.id,
          name: receivedService.name,
        };

        this.tagItems.unshift(newItem);
        this.filteredTagIds.push(receivedService.id);
        if (this.filteredTagIds.length > 0) {
          for (let t of this.tagItems) {
            for (let i of this.filteredTagIds) {
              let tagName = t.name;
              if (t.id == i) {
                this.filteredTags.push(tagName);
              }
            }
          }
        }
      }
    });
  }

  // Create Vehicle Fields
  addVehicelFields(index, value) {
    this.vehicleFormInfo.push({
      prodType: value,
      prodTypeValid: false,
      modelList: [],
      models: [],
      years: [],
      modelValid: false,
      yearValid: false,
      modelLoading: false,
      actionFlag: false,
      addFlag: true,
    });

    this.vehicleList.push({
      class: "vc-info",
      title: value,
      isDisabled: false,
      isExpanded: true,
    });
    console.error("this.vechile list", this.vehicleList);
    this.v.push(
      this.formBuilder.group({
        productType: [""],
        model: [""],
        year: [""],
      })
    );

    if (index == 0) {
      this.vehicleFormInfo[index].prodTypeValid = true;
    }

    if (index > 0) {
      if (this.prodTypes.length == this.vehicleProdTypes.length) {
         this.vehicleProdTypes.splice(0, 1); 
      }
      this.vehicleFormInfo[index - 1].addFlag = false;
    }
    if(this.tvsFlag){
      this.getVehicleModels(index, value);
      this.onScrollBottom();
    }
    else{
      this.getModels(index, value);
      this.onScrollBottom();      
    }    
  }


  // Create Vehicle Fields
  addDICVVehicelFields(index, value) {
    this.vehicleFormInfo.push({
      prodType: value,
      prodTypeValid: false,
      emissionList: [],
      emissions: [],
      modelList: [],
      models: [],
      years: [],
      emissionValid: true,
      modelValid: false,
      yearValid: false,      
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
    console.error("this.vechile list", this.vehicleList);
    this.v.push(
      this.formBuilder.group({
        productType: [""],
        emissionId: [""],
        emissionName: [""],
        model: [""],
        year: [""],
      })
    );

    if (index == 0) {
      this.vehicleFormInfo[index].prodTypeValid = true;
    }

    if (index > 0) {
      if(this.prodTypes.length > 1 ) { 
        if (this.prodTypes.length == this.vehicleProdTypes.length) {
          this.vehicleProdTypes.splice(0, 1);
        }
      }       
      this.vehicleFormInfo[index - 1].addFlag = false;
    }
    if(this.tvsFlag){
      this.getVehicleModels(index, value);
      this.onScrollBottom();
    }
    else{
      this.getModels(index, value);
      if(!this.DICVDomain){this.onScrollBottom();}
    }    
  }

  // Remove Vehicle Fields
  removeVehicleFields(index) {
    if(this.DICVDomain){
      this.removeEmissionsVehicleFields(index);
    }
    else{
      this.v.removeAt(index);
      this.vehicleList.splice(index, 1);
      this.vehicleFormInfo.splice(index, 1);
      if (index == 0) {
        this.prodTypeFlag = false;
        this.defProdType = "";
        this.newGtsForm.value.prodTypeVal = "";
        localStorage.removeItem("vehicleProdType");
        this.pblmDetailFlag = false;
      } else {
        let removeIndex =
          this.vehicleFormInfo.length == index ? index - 1 : index;
        this.vehicleFormInfo[removeIndex].addFlag = true;
      }
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
      this.newGtsForm.value.prodTypeVal = "";
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
  getVehicleModels(index, value) {   
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
        this.loading = false;
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
        console.error("this.vehicleList", this.vehicleList);
      }
      else{
        this.vehicleFormInfo[index].modelLoading = false;
      }
    });    
  }

  // Get Emissions
  getEmissionsAndModels(index, value) {
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
    this.getModelsDICVData(index, value);
       
  }

  // models
  getModelsDICVData(index, value) {
    let emissionsVal = this.newGtsForm.value.vehicleInfo[index].emissionId != undefined ? this.newGtsForm.value.vehicleInfo[index].emissionId : '';
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
        console.log(this.vehicleFormInfo[index].modelList);
        if (index == 0) {
          this.vehicleFormInfo[index].prodType = this.vehicleFormInfo[index].prodType ;
        }
        this.vehicleList[index].title = this.vehicleFormInfo[index].prodType ;
        console.error("this.vehicleList", this.vehicleList);
      }
      else{
        this.vehicleFormInfo[index].modelLoading = false;
      }
    }); 
  }

  // Get Vehicle Models
  getModels(index, value) {
    if(this.DICVDomain){
      this.getEmissionsAndModels(index, value);
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
          this.loading = false;
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
          console.log(this.vehicleFormInfo[index].modelList);
          if (index == 0) {
            this.vehicleFormInfo[index].prodType = value;
          }
          this.vehicleList[index].title = value;
          console.error("this.vehicleList", this.vehicleList);
        }
        else{
          this.vehicleFormInfo[index].modelLoading = false;
        }
      });
    }
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

    this.workstreamValid = this.filteredWorkstreams.length == 0 ? false : true;
    if (this.workstreamValid) {
      if (this.newGtsForm.value.prodTypeVal == "All") {
        this.pblmDetailFlag = true;
      } else {
        if (this.newGtsForm.value.vehicleInfo.length > 0) {
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
  this.newGtsForm.value.vehicleInfo[index].model = items;
  this.vehicleFormInfo[index].models = items;
  this.vehicleFormInfo[index].modelValid =
  this.newGtsForm.value.vehicleInfo[index].model.length == 0 ? false : true;
  console.log(this.industryType['id']);
  if(!this.tvsFlag) {   
    this.vehicleFormInfo[index].actionFlag = this.vehicleFormInfo[index].modelValid ? true : false;            
  }
  else{  
    this.vehicleFormInfo[index].actionFlag = this.vehicleFormInfo[index].modelValid && this.vehicleFormInfo[index].yearValid ? true : false;     
  }    
  /*if(this.DICVDomain){
    if(this.prodTypes.length == 1 ) { this.vehicleFormInfo[0].actionFlag = false; }
  }*/
  this.pblmDetailFlag = this.vehicleFormInfo[0].actionFlag;        
  console.error("vechileInfo model", this.newGtsForm.value.vehicleInfo);
}

// Selected EmissionId
 selectedEmissions(index, items) {
  let value = this.vehicleFormInfo[index].prodType;
  this.newGtsForm.value.vehicleInfo[index].emissionId = items;
  this.vehicleFormInfo[index].emissions = items;
  this.vehicleFormInfo[index].modelLoading = true;
  if(this.newGtsForm.value.vehicleInfo[index].emissionId == ''){         
    this.emissionFieldClear = true;               
  }
  setTimeout(() => {    
    this.getModelsDICVData(index, value);
  }, 1000);
}
// Selected EmissionName
selectedEmiNames(index, items) {
  console.log(items)
  this.disableErrorCodeFlag = (items.length == 0) ? true : false;
  this.newGtsForm.value.vehicleInfo[index].emissionName = items;
  if(this.domainId == 98 && this.filteredErrorCodes.length > 0) {
    this.setupErrorCodeItems();    
  }
}

// Selected Years
selectedYears(index, items) {
  this.newGtsForm.value.vehicleInfo[index].year = items.items;
  this.vehicleFormInfo[index].years = items.items;
  this.vehicleFormInfo[index].yearValid =
  this.newGtsForm.value.vehicleInfo[index].year.length == 0 ? false : true;
  console.log(this.industryType['id']);
  if(!this.tvsFlag) {        
    this.vehicleFormInfo[index].actionFlag = this.vehicleFormInfo[index].modelValid ? true : false;     
  }
  else{
    this.vehicleFormInfo[index].actionFlag =
    this.vehicleFormInfo[index].modelValid &&
    this.vehicleFormInfo[index].yearValid
      ? true
      : false;
  }
  /*if(this.DICVDomain){
    if(this.prodTypes.length == 1 ) { this.vehicleFormInfo[0].actionFlag = false; }
  } */    
  this.pblmDetailFlag = this.vehicleFormInfo[0].actionFlag;    
  console.error("vechileInfo year", this.newGtsForm.value.vehicleInfo);
  }

  onScrollBottom(){
    let secElement = document.getElementById('step');    
    setTimeout(() => {
      let scrollTop = secElement.scrollTop;
      setTimeout(() => {
        this.scrollPos = scrollTop+300;
        secElement.scrollTop = this.scrollPos;
      }, 200);        
    }, 500); 
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
    this.tagValid = this.filteredTags.length == 0 ? false : true;
  }

  // Publish or Save Draft
  submitAction(action) {
    this.saveDraftFlag = action == "save" ? true : false;
    this.gtsEditorFlag = action == "editor" ? true : false;
    this.onSubmit();
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

  workflowtypeChange(){
    this.workflowValid = this.workflowtype == '' ? false : true ;
    for(let wft of this.workflowtypeOptions){
      if(wft.id == this.workflowtype){
        this.workflowName = wft.name;
      }
    }
    
  }

  // Notify User Change
  notifyUserChange(status) {
    this.notifyFlag = status == 1 ? true : false;
    this.newGtsForm.value.notifyUsers = status;
  }

  // On Submit
  onSubmit() {
    if (this.step1Action && !this.step2Action) {
      this.step1Submitted = true;
     
      if (this.invalidFile || this.invalidFileSize) {
        return false;
      }

      if (this.filteredWorkstreams.length == 0) {
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
        this.tagValid = false;
        return false;
      } else {
        this.tagValid = true;
      }*/
      if(this.tvsFlag || this.DICVDomain) {
        if (this.newGtsForm.value.prodTypeVal == "") {
          return false;
        }
      }

      if (this.newGtsForm.value.probCatg == 13) {
        this.ecuTypeValid = this.newGtsForm.value.ecuType != "" ? true : false;
        this.mfgValid = this.newGtsForm.value.moduleMft != "" ? true : false;
        this.dtcValid =
          this.newGtsForm.value.dtc != "" && this.newGtsForm.value.dtc != 0
            ? true
            : false;
        console.log(this.newGtsForm.value.dtc);
        if (!this.ecuTypeValid || !this.mfgValid || !this.dtcValid) {
          return false;
        }
      }
        

      console.log(this.industryType['id']);
      if(this.tvsFlag) {    
        for (let v of this.newGtsForm.value.vehicleInfo) {
          let ptype = v.productType;
          let model = v.model;
          let year = v.year;
          if (ptype == "" || model.length == 0 || year.length == 0) {
            return false;
          }
        }
      }     

      console.log(this.newGtsForm.value.vehicleInfo);
      
      // stop here if form is invalid
      if (this.newGtsForm.invalid) {
        return;
      }

      this.step2 = true;
      this.step2Action = true;
      this.stepBack = false;
      this.newGtsForm.value.workstreams = this.filteredWorkstreamIds;
      this.newGtsForm.value.errorCodes = this.filteredErrorCodeIds;
      this.newGtsForm.value.tags = JSON.stringify(this.filteredTags);
      this.step1Submitted = false;
    } else {
      this.step2Submitted = true;
      let gtsFormVal = this.newGtsForm.value;
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

      gtsFormVal.vehicleInfo = JSON.stringify(gtsFormVal.vehicleInfo);

      console.log(JSON.stringify(gtsFormVal.vehicleInfo));
      console.log(gtsFormVal.vehicleInfo);
      console.log(JSON.parse(gtsFormVal.vehicleInfo));      

      if (this.saveDraftFlag) {
        let action = 1;
        gtsFormVal.action = action;
        this.newGts(action, gtsFormVal);
      } else {
        let action = 1;
        gtsFormVal.action = action;
        this.newGts(action, gtsFormVal);
      }
    }
    
  }

  // New GTS
  newGts(action, gtsFormVal) {   
    let sws = [];
    sws = [];
    console.log(gtsFormVal);
    //return false;
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, {backdrop: 'static', keyboard: false, centered: true});
    let gtsImg = this.imgURL != null ? this.selectedGtsImg : "";
    let prodTypeId: any = 0;
    let gtsFormData = new FormData();
    let workstreams: any = JSON.stringify(gtsFormVal.workstreams);
    let errorCodes: any = JSON.stringify(gtsFormVal.errorCodes);    
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
    gtsFormData.append("productMfgId", prodTypeId);
    gtsFormData.append("GTSECUtype", prodTypeId);
    gtsFormData.append("duplicateProcedureId", prodTypeId);
    gtsFormData.append("dtcCode", "");
    gtsFormData.append("dtcDesc", "");
    gtsFormData.append("errorCodes", errorCodes);

    if (gtsFormVal.probCatg == 13) {
      let dtc = gtsFormVal.dtc.split(" - ");
      gtsFormData.append("productMfgId", gtsFormVal.moduleMft);
      gtsFormData.append("GTSECUtype", gtsFormVal.ecuType);
      gtsFormData.append("dtcCode", dtc[0]);
      gtsFormData.append("dtcDesc", dtc[1]);
    }

    /*new Response(gtsFormData).text().then(console.log);
    return false;*/

    this.gtsApi.manageGts(gtsFormData).subscribe((response) => {
      let timeout = 5000;
      this.successMsg = response.result;
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
        //console.log(response)
        this.successFlag = this.gtsEditorFlag ? false : true;
        setTimeout(() => {
          this.successFlag = false;
          if (this.gtsEditorFlag) {
            //modalRef.dismiss("Cross click");
            //this.bodyElem.classList.remove(this.bodyClass);
            let editorUrl = response.flowchartURL;
            console.log(editorUrl);
            //window.open(editorUrl, "_blank");
            
            /*let newTab = window.open();
            newTab.location.href = editorUrl;*/
            // popup allowed
            /*this.top.nativeElement.click = () => {
              alert(editorUrl);
              window.open(editorUrl, "_blank");
              alert(editorUrl);
            };*/
            /*alert(editorUrl);
            window.open(editorUrl, editorUrl);
            alert(editorUrl);*/

            //let url = `${this.newGtsUrl}`;
           // window.open(url, "_blank");           
            
           window.location.href = editorUrl;

           setTimeout(() => {
            modalRef.dismiss("Cross click");
            this.bodyElem.classList.remove(this.bodyClass);
          }, 3000);
           

            setTimeout(() => {
              //window.close();
            }, 1000);
          } else {
            window.close();
          }

          let url = "gts";
          window.opener.location = url;
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
        window.close();
        let url = "gts";
        window.opener.location = url;
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

  // Manage List
  manageList(fieldName) {
    let headerHeight = document.getElementsByClassName("prob-header")[0].clientHeight;
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
      userId: this.userId,
      type: '',
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

    const modalRef = this.modalService.open(ManageListComponent, this.config);
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
      if(selectionType == 'single') {
        res = res[0];
        id = res.id;
        itemVal = res.name;
      }
      else{          
        id = [];
        itemVal = [];  
      }
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
    let vinfo = this.newGtsForm.value.vehicleInfo;
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