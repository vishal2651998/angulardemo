import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { ApiService } from '../../../services/api/api.service';
import { CommonService } from '../../../services/common/common.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
import { PartsService } from '../../../services/parts/parts.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant, SolrContentTypeValues, ContentTypeValues, IsOpenNewTab, pageInfo, PlatFormType, pageTitle, RedirectionPage, windowHeight } from '../../../common/constant/constant';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { ManageProductCodesComponent } from '../../../components/common/manage-product-codes/manage-product-codes.component';
import { ActionFormComponent } from '../../../components/common/action-form/action-form.component';
import { RelatedThreadListsComponent } from '../../../components/common/related-thread-lists/related-thread-lists.component';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public title:string = 'Parts Creation';
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public validatePartNo:boolean=true;
  public validatePartMsg:string='';
  public platformId: number = 0;
  public countryId;
  public domainId;
  public userId;
  public make: string = "";
  public headerData: Object;
  public threadType: number = 25;
  public contentType: any = 6;
  public partApiData: object;
  public baseApiUrl: string = "";

  public bodyHeight: number;
  public innerHeight: number;
  public scrollPos: any = 0;

  partsForm: FormGroup;
  public partId: number = 0;
  public systemId: number = 0;
  public assemblyId: number = 0;
  public manageAction: string;
  public EditAttachmentAction: string = "attachments";
  public partInfo: Object;
  public partUpload: boolean = true;
  public attachmentFlag: boolean = true;

  public newTxt: string = "Create New";
  public editTxt: string = "Edit Newly Created";
  public actionInit: string = "init";
  public actionEdit: string = "edit";
  public emptyCont: string = "<i class='gray'>None</i>";
  public mssDomain: boolean = false;
  public tvsFlag: boolean = false;
  public splitIcon: boolean = false;
  public step1: boolean = true;
  public step2: boolean = false;
  public step1Action: boolean = true;
  public step2Action: boolean = false;
  public step1Submitted: boolean = false;
  public step2Submitted: boolean = false;
  public stepBack: boolean = false;
  public saveDraftFlag: boolean = true;
  public saveText: string = "Publish";
  public nameMaxLen: number = 30;
  public maxLen: number = 60;
  public descMaxLen: number = 250;

  public loading: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public selectedPartsImg : File;
  public defImgURL: any = 'assets/images/common/default-part-banner.png';
  public imgURL: any;
  public imgName: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;

  public statusTxt: string = "Active";
  public partStatus: number = 1;
  public partNumber: string = "";
  public partName: string = "";
  public partDesc: string = "";
  public altPartNumber: string = "";
  public defaultSelection: any = 0;
  public partType: any = "0";
  public partTypeVal: any = "0";
  public partSystem: any = "0";
  public partSystemVal: any = "0";
  public partAssembly: any = "0";
  public partAssemblyVal: any = "0";
  public figNo: any = "";
  public refNo: any = "";
  public teamSystem=localStorage.getItem('teamSystem');
  public partTypes: any;
  public partSystems: any;
  public partAssemblyItems: any;
  public soldItems: any;
  public filteredPartTypes = [];
  public filteredPartSystems = [];
  public filteredPartAssemblyItems = [];
  public filteredSoldItems = [];
  public filteredRelatedThreadIds = [];
  public filteredRelatedThreads = [];
  public additionalFields: any = ['colour', 'additionalInfo1', 'additionalInfo2', 'additionalInfo3', 'additionalInfo4', 'additionalInfo5', 'additionalInfo6'];
  public quantityItems: any = [{id: 1, name: 1},{id: 2, name: 2},{id: 3, name: 3},{id: 4, name: 4},{id: 5, name: 5}];

  public partTypeAction: string = "new";
  public partTypeActionTxt: string = this.newTxt;
  public partTypeId: any = "-1";
  public partTypeName: string = "";
  
  public partSystemAction: string = "new";
  public partSystemActionTxt: string = this.newTxt;
  public partSystemId: any = "-1";
  public partSystemName: string = "";

  public partAssemblyAction: string = "new";
  public partAssemblyActionTxt: string = this.newTxt;
  public partAssemblyId: any = "-1";
  public partAssemblyName: string = "";

  public prodTypes = [{'id': 'All', 'name': 'All'}];
  public appProdTypes = [{'id': 'All', 'name': 'All'}];
  public years = [];
  public appFormInfo = [];
  public addFormInfo = [];
  public appList = [];
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

  public prodCodes: any = [];
  public prodCodeSelectedList = [];
  public filteredProdCodes = [];

  public colourCodes: any;
  public filteredColourCodeIds = [];
  public filteredColourCodes = [];

  public errorCodes: any;
  public filteredErrorCodeIds = [];
  public filteredErrorCodes = [];

  public prodColour: any = [];
  public company: string = "";
  public website: string = "";
  public source: string = "";
  public phone: string = "";
  public price: string = "";
  public sold: string = "";
  public warning: string = "";
  
  public wsplit: boolean = false;
  public workstreamValid: boolean = false;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public pageAccess: string = "managePart";
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public mediaUploadItems: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public displayOrder: number = 0;
  public navUrl: any = "";
  public user: any;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public isPublishedFlag: string = "";
  public rmHeight: any = 180;
  public rmsHeight: any = 110;
  
  @ViewChild('typeSelect') typeSelect:any;
  @ViewChild('systemSelect') systemSelect:any;
  @ViewChild('assemblySelect') assemblySelect:any;
  @ViewChild('soldSelect') soldSelect:any;

  public typeInputFilter: FormControl = new FormControl();
  public systemInputFilter: FormControl = new FormControl();
  public assemblyInputFilter: FormControl = new FormControl();

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
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private baseService: BaseService,
    private ProductMatrixApi: ProductMatrixService,
    private partsApi: PartsService,
    private threadApi: ThreadService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService, 
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  // convenience getters for easy access to form fields
  get f() { return this.partsForm.controls; }
  get a() { return this.f.appInfo as FormArray; }
  get ai() { return this.f.addInfo as FormArray; }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    this.scrollTopService.setScrollTop();
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {      
      let pid = this.route.snapshot.params['pid'];
      this.partId = (pid == 'undefined' || pid == undefined) ? this.partId : pid;
      this.manageAction = (this.partId > 0) ? this.route.snapshot.url[1].path : 'new';
      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      this.tvsFlag = (this.platformId == 2 && this.domainId == 52) ? true : false;
      let navUrl = localStorage.getItem('partNav');
      navUrl = (navUrl == 'undefined' || navUrl == undefined) ? 'parts' : navUrl;
      //this.navUrl = (this.manageAction == 'new' || this.manageAction == 'duplicate') ? 'parts' : navUrl;
      this.navUrl = (this.manageAction == 'new') ? 'parts' : navUrl;
      console.log(navUrl, this.navUrl, this.manageAction);
      setTimeout(() => {
        localStorage.removeItem('partNav');  
      }, 500);
      if(this.partId > 0) {
        localStorage.removeItem('partAttachments');
      }

      if(this.tvsFlag) {
        this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
        let partsQuantity = JSON.parse(localStorage.getItem('partsQuantity'));
        this.quantityItems = (partsQuantity == 'undefined' || partsQuantity == undefined) ? this.quantityItems : partsQuantity;
      }
      
      let dupText = (this.manageAction == 'duplicate') ? ' [DUPLICATE]' : ''; 
      let headTitle = `Part <span>ID# ${this.partId}${dupText}</span>`;
      /*this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: false,
        search: false,
        titleFlag: (this.partId == 0) ? false : true,
        title: headTitle
      };*/

      let headTitleText = '';      
      switch(this.manageAction){
        case 'new':
          headTitleText = 'Parts Creation';
          break;
        case 'edit':
          headTitleText = 'Part';
          break;
        case 'duplicate': 
          headTitleText = 'Part';
          break;
      }
      this.headerData = {        
        title: headTitleText,
        action: this.manageAction,
        id: this.partId     
      };

      this.partApiData = {
        access: 'parts',
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        contentType: this.contentType,
        dataId: this.partId,
        displayOrder: this.displayOrder
      };

      let year = parseInt(this.currYear);
      for(let y=year; y>=this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString()
        });
      }

      if(this.partId == 0) {
        // Setup Part Form Fields
        this.setupForm();

        // Get Workstream Lists
        this.getWorkstreamLists();
      } else {
        this.title = (this.manageAction == 'edit') ? "Edit Part" : this.title;
        this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
        // Get Parts Details
        this.getPartsDetails();
      }

      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  // Get GTS Details
  getPartsDetails() {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      partId: this.partId
    };
    this.partsApi.getPartsDetail(apiData).subscribe((response) => {
      console.log(response)
      let partsInfo = response.partsData[0];
      this.partInfo = partsInfo;
      let commonData = partsInfo.commonData;
      this.partStatus = parseInt(partsInfo.partStatus);
      if(commonData.isDefaultImg == 1) {
        this.imgURL = null;
        this.imgName = null;
      } else {
        this.imgURL = (commonData.partBannerImg == "") ? null : commonData.partBannerImg;
        this.imgName = (commonData.partBannerImg == "") ? null : commonData.partBaseImg;
      }
      
      this.partNumber = (this.manageAction == 'edit') ? commonData.partNo : '';
      this.partName = (this.manageAction == 'edit') ? commonData.partName : '';
      this.partDesc = commonData.partDesc;
      this.altPartNumber = commonData.alternatePartNo;
      this.partType = (commonData.partType == '-') ? '' : commonData.partType;
      this.partTypeVal = (this.partType == '') ? '' :  commonData.partTypeName;
      this.partSystem = (commonData.partSystem == '-') ? '' : commonData.partSystem;
      this.partSystemVal = (this.partSystem == '') ? '' :  commonData.partSystemName;
      this.partAssembly = (commonData.partAssembly == '-') ? '' : commonData.partAssembly;
      this.partAssemblyVal = commonData.partAssemblyName;
      this.figNo = commonData.figNo;
      this.refNo = commonData.refNo;
      this.existingWorkstreams = JSON.parse(partsInfo.groups);
      this.filteredWorkstreamIds = this.existingWorkstreams;
      this.tagItems = partsInfo.tagsList;
      this.filteredTagIds = (this.tagItems != "") ? JSON.parse(this.tagItems) : this.tagItems;
      this.filteredTags = partsInfo.tagsNames;
      this.errorCodes = (partsInfo.errorCode.errorCode.length > 0) ? JSON.parse(partsInfo.errorCodeList) : [];
      this.filteredErrorCodeIds = this.errorCodes;
      this.filteredErrorCodes = partsInfo.errorCodeNames;
      this.attachmentItems = partsInfo.uploadContents;
      localStorage.setItem('partAttachments', JSON.stringify(this.attachmentItems));
      this.displayOrder = partsInfo.lastOrder;
      this.partApiData['displayOrder'] = this.displayOrder;
      for(let a of this.attachmentItems) {
        a.captionFlag = (a.fileCaption != '') ? false : true;
        if(a.flagId == 6) {
          a.url = a.filePath;
          a.linkFlag = false;
          a.valid = true;
        }
      }
      let relatedThreads = partsInfo.relatedThreadsUserSelected.threads;
      for(let thread of relatedThreads) {
        let threadId = thread.threadId.toString();
        let title = thread.title;
        this.filteredRelatedThreadIds.push(threadId);
        this.filteredRelatedThreads.push(threadId+' - '+title);
      }      
      this.isPublishedFlag = partsInfo.isPublished;
      let editActionStatus = (partsInfo.isPublished == 2) ? partsInfo.isPublished : 1;
      this.saveDraftFlag = (editActionStatus == 1 || this.manageAction == 'duplicate') ? true : false;
      this.saveText = (this.saveDraftFlag) ? 'Publish' : 'Save';
      // Get Workstream Lists
      this.getWorkstreamLists();
    });
  }

  // Get Workstream Lists
  getWorkstreamLists() {
    let type:any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('type', type);

    this.ProductMatrixApi.getWorkstreamLists(apiFormData).subscribe((response) => {
      let resultData = response.workstreamList;
      for(let ws of resultData) {
        this.workstreamItems.push({workstreamId: ws.id, workstreamName: ws.name});
      }

      // Get Parts Base Info
      this.getPartsBaseInfo();
    });
  }

  getPartsBaseInfo() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);

    this.partsApi.getPartBaseInfo(apiFormData).subscribe((response) => {
      console.log(response)
      let resultData = response.attributesInfo;
      this.partTypes = resultData.PartType;
      this.filteredPartTypes = this.partTypes;
      this.partSystems = resultData.partSystem;
      this.filteredPartSystems = this.partSystems;
      this.partAssemblyItems = resultData.partAssembly;
      this.filteredPartAssemblyItems = this.partAssemblyItems;
      
      if(!this.tvsFlag) {
        // Get Product Types
        this.getProdTypes();
      } else {
        this.loading = false;
        this.setupForm('get');
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
    if(this.partId > 0) {
      apiFormData.append('access', 'Edit Part');
    }
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
          this.appProdTypes.push({
            'id': p.makeName,
            'name': p.makeName
          });
        }

        //setTimeout(() => {
          // Setup Part Form Fields
          this.setupForm('get');  
        //}, 500);        
      }
    });
  }

  // Setup Part Form Fields
  setupForm(action = '') {
    if(this.partId > 0) {
      let commonData = this.partInfo['commonData'];
      let appData = (commonData.makeModels == "") ? "" : JSON.parse(commonData.makeModels);
      console.log(appData);
      
      if(appData.length == 1 && appData[0].genericProductName == 'All') {
        this.defProdType = 'All';
        this.prodTypeFlag = false;
      } else {
        this.defProdType = appData;
        this.prodTypeFlag = (this.defProdType == "") ? false : true;
      }
     
      console.log(this.prodTypeFlag)
      if(this.prodTypeFlag) {
        this.defProdType = appData[0].genericProductName;
      }
    }
    this.partsForm = this.formBuilder.group({
      action: [''],
      domainId: [this.domainId],
      countryId: [this.countryId],
      userId: [this.userId],
      partStatus: [this.partStatus],
      partNumber: [this.partNumber, [Validators.required]],
      partName: [this.partName, [Validators.required]],
      partDesc: [this.partDesc],
      altPartNumber: [this.altPartNumber],
      partType: [this.partType],
      partSystem: [this.partSystem],
      partAssembly: [this.partAssembly],
      figNo: [this.figNo],
      refNo: [this.refNo],
      prodTypeVal: [this.defProdType],
      appInfo: this.formBuilder.array([]),
      workstreams: [''],
      tags: [this.tagItems],
      relatedThreads: [this.filteredRelatedThreadIds],
      company: [{value: this.company, disabled:true}],
      website: [{value: this.website, disabled:true}],
      source: [{value: this.source, disabled:true}],
      phone: [{valie: this.phone, disabled:true}],
      price: [{value: this.price, disabled:true}],
      sold: [{value: this.sold, disabled:true}],
      warning: [{value: this.warning, disabled:true}]
    });

    if(this.tvsFlag && action == 'get') {
      this.partsForm.addControl('productCode', this.formBuilder.control(this.prodCodes));
      this.partsForm.addControl('colorValues', this.formBuilder.control(this.prodColour));
      this.partsForm.addControl('addInfo', this.formBuilder.array([]));
      setTimeout(() => {
        let val = '';
        let partAction = (this.partId == 0) ? this.actionInit : this.actionEdit;
        for(let ai in this.additionalFields) {
          this.addInfoFields(partAction, ai, this.additionalFields[ai], val);
        }        
      }, 500);
    } else {
      this.partsForm.addControl('prodTypeVal', this.formBuilder.control(this.defProdType));
    }

    console.log(this.partsForm)

    if(this.partId > 0) {
      let commonData = this.partInfo['commonData'];      
      let appData = (commonData.makeModels == "") ? "" : JSON.parse(commonData.makeModels);
      if(!this.tvsFlag) {       
        console.log("appData: "+appData);
        console.log(appData[0].genericProductName);
        
        if(appData.length == 1 && appData[0].genericProductName == 'All' ) {
          this.defProdType = 'All';
          this.prodTypeFlag = false;
        } else {
          /*let data = [];
          data.push(appData);
          console.log(data);
          appData  = data ;*/
          this.defProdType = appData;
          this.prodTypeFlag = (this.defProdType == "") ? false : true;
        }
        
        if(this.prodTypeFlag) {
          this.defProdType = appData[0].genericProductName;
        }
      
        if(this.prodTypeFlag) {
          let appLen = appData.length;            
          for(let a = 0; a < appLen; a++) {
            //if(appData[a].genericProductName != undefined){
              let genericProductName = appData[a].genericProductName;
              this.addAppFields(this.actionEdit, a, genericProductName);
            //}
          }
        }  
      } else {
        let items = JSON.parse(commonData.productgroupInfo);
        this.prodCodeSelectedList = items;
        let applicationData = this.partInfo['application'];
        let colourValue = applicationData.colorNames;
        console.log(colourValue)
        if(colourValue.length > 0) {
          this.filteredColourCodeIds = [colourValue[0].id];
          this.filteredColourCodes = [colourValue[0].name];
        }
        // Setup Product Code App Data
        this.setupProdAppData('init', items);
      }
    }
  }

  // Change Part Status
  changePartStatus(type, status) {
    switch(type) {
      case 'active':
        if(status == 2) {
          this.partStatus = 1;
          this.statusTxt = "Active";
        }
        break;
      case 'discon':
        if(status == 1) {
          this.partStatus = 2;
          this.statusTxt = "Discontinued";
        }
        break;  
    }
  }

  // On File Upload
  onFileUpload(event){   
    let uploadFlag = true;
    this.selectedPartsImg = event.target.files[0];
    let type = this.selectedPartsImg.type.split('/');
    let type1 = type[1].toLowerCase();
    let fileSize = this.selectedPartsImg.size/1024/1024;
    this.invalidFileErr = "";
   
    if(fileSize > 8) {
      uploadFlag = false;
      this.invalidFileSize = true;
      this.invalidFileErr = "File size exceeds 2 MB"; 
    }
    
    if(uploadFlag) {
      if(type1 == 'jpg' || type1 == 'jpeg' || type1 == 'png' ){
        this.OnUploadFile();
      }
      else{
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
    }  
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

  // Custom Selection Change
  selectChange(field, event) {
    let id = event.value;
    let value = event.source.triggerValue;
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId
    };
    
    switch (field) {
      case 'type':
        this.partType = id;
        this.partTypeVal = value;
        if(value == 'Create New' || value == 'Edit Newly Created') {
          this.partType = 0;
          this.partTypeVal = "";
          this.typeSelect.close();

          let action = {
            action: (this.partTypeId < 0) ? 'new' : 'edit',
            id: (this.partTypeId < 0) ? 0 : this.partTypeId,
            name: (this.partTypeId < 0) ? '' : this.partTypeName
          }
          const modalRef = this.modalService.open(ActionFormComponent, this.modalConfig);
          modalRef.componentInstance.access = 'Type Creation';
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {  
            modalRef.dismiss('Cross click'); 
            console.log(receivedService)
            if(receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let cid = parseInt(receivedService.id);
              let newItem = {
                id: cid,
                name: name,
              };
              if(this.partTypeAction == 'new' && actionItem == 'new') {
                this.partTypes.unshift(newItem);
                this.filteredPartTypes.unshift(newItem);
              }
              setTimeout(() => {
                if(actionItem == 'new') {
                  this.partTypeName = name;
                  this.partTypeId = cid;
                }
                this.partTypeActionTxt = this.editTxt;
                this.partTypeVal = name;
                this.partType = cid;
                if(this.partTypeAction == 'edit' && actionItem == 'new') {
                  let index = this.partTypes.findIndex(option => option.id == cid);
                  this.partTypes[index].name = name;
                  this.filteredPartTypes[index].name = name;                  
                }
                this.partTypeAction = "edit";                
              }, 500);            
            } else {
              setTimeout(() => {
                if(this.partId == 0) {
                  this.partTypeVal = "";
                  this.partTypeId = "0";
                } else {
                  this.partTypeVal = this.partInfo['commonData'].partTypeName;
                  this.partType = this.partInfo['commonData'].partType;
                  this.partTypeId = this.partType;
                }
              }, 500);
            }
          });
        }
        break;
      case 'system':
        this.partSystem = id;
        this.partSystemVal = value;
        if(value == 'Create New' || value == 'Edit Newly Created') {
          this.partSystem = 0;
          this.partSystemVal = "";
          this.systemSelect.close();

          let action = {
            action: (this.partSystemId < 0) ? 'new' : 'edit',
            id: (this.partSystemId < 0) ? 0 : this.partSystemId,
            name: (this.partSystemId < 0) ? '' : this.partSystemName
          }
          const modalRef = this.modalService.open(ActionFormComponent, this.modalConfig);
          modalRef.componentInstance.access = 'System Creation';
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {  
            modalRef.dismiss('Cross click'); 
            console.log(receivedService)
            if(receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let cid = parseInt(receivedService.id);
              let newItem = {
                id: cid,
                name: name,
              };
              if(this.partSystemAction == 'new' && actionItem == 'new') {
                this.partSystems.unshift(newItem);
                this.filteredPartSystems.unshift(newItem);
              }
              setTimeout(() => {
                if(actionItem == 'new') {
                  this.partSystemName = name;
                  this.partSystemId = cid;
                }
                this.partSystemActionTxt = this.editTxt;
                this.partSystemVal = name;
                this.partSystem = cid;
                if(this.partSystemAction == 'edit' && actionItem == 'new') {
                  let index = this.partSystems.findIndex(option => option.id == cid);
                  this.partSystems[index].name = name;
                  this.filteredPartSystems[index].name = name;                  
                }
                this.partSystemAction = "edit";                
              }, 500);            
            } else {
              setTimeout(() => {
                if(this.systemId == 0) {
                  this.partSystemVal = "";
                  this.partSystemId = "0";
                } else {
                  this.partSystemVal = this.partInfo['commonData'].partSystemName;
                  this.partSystem = this.partInfo['commonData'].partSystem;
                  this.partSystemId = this.partSystem;
                }
              }, 500);
            }
          });
        }
        break;
      case 'assembly':
        this.partAssembly = id;
        this.partAssemblyVal = value;
        if(value == 'Create New' || value == 'Edit Newly Created') {
          this.partAssembly = 0;
          this.partAssemblyVal = "";
          this.assemblySelect.close();

          let action = {
            action: (this.partAssemblyId < 0) ? 'new' : 'edit',
            id: (this.partAssemblyId < 0) ? 0 : this.partAssemblyId,
            name: (this.partAssemblyId < 0) ? '' : this.partAssemblyName
          }
          const modalRef = this.modalService.open(ActionFormComponent, this.modalConfig);
          modalRef.componentInstance.access = 'Assembly Creation';
          modalRef.componentInstance.apiData = apiData;
          modalRef.componentInstance.actionInfo = action;
          modalRef.componentInstance.dtcAction.subscribe((receivedService) => {  
            modalRef.dismiss('Cross click'); 
            console.log(receivedService)
            if(receivedService.action) {
              let actionItem = receivedService.actionItem;
              let name = receivedService.name;
              let cid = parseInt(receivedService.id);
              let newItem = {
                id: cid,
                name: name,
              };
              if(this.partAssemblyAction == 'new' && actionItem == 'new') {
                this.partAssemblyItems.unshift(newItem);
                this.filteredPartAssemblyItems.unshift(newItem);
              }
              setTimeout(() => {
                if(actionItem == 'new') {
                  this.partAssemblyName = name;
                  this.partAssemblyId = cid;
                }
                this.partAssemblyActionTxt = this.editTxt;
                this.partAssemblyVal = name;
                this.partAssembly = cid;
                if(this.partAssemblyAction == 'edit' && actionItem == 'new') {
                  let index = this.partAssemblyItems.findIndex(option => option.id == cid);
                  this.partAssemblyItems[index].name = name;
                  this.filteredPartAssemblyItems[index].name = name;                  
                }
                this.partAssemblyAction = "edit";                
              }, 500);            
            } else {
              setTimeout(() => {
                if(this.assemblyId == 0) {
                  this.partAssemblyVal = "";
                  this.partAssemblyId = "0";
                } else {
                  this.partAssemblyVal = this.partInfo['commonData'].partAssemblyName;
                  this.partAssembly = this.partInfo['commonData'].partAssembly;
                  this.partAssemblyId = this.partAssembly;
                }
              }, 500);
            }
          });
        }
        break;
    }
  }

  // Option Search
  filterOptions(field, value) {
    switch(field) {
      case 'type':
        this.filteredPartTypes = [];
        break;
      case 'system':
        this.filteredPartSystems = [];
        break;      
      case 'assembly':
        this.filteredPartAssemblyItems = []; 
        break;
    }
    this.selectSearch(field, value);
  }

  // Filter Search
  selectSearch(field, value:string) {
    let filter = value.toLowerCase();
    switch (field) {
      case 'type':
        this.filteredPartTypes = [];
        for ( let i = 0 ; i < this.partTypes.length; i ++ ) {
          let option = this.partTypes[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
              this.filteredPartTypes.push( option );
          }
        }
        break;
      case 'system':
        this.filteredPartSystems = [];
        for ( let i = 0 ; i < this.partSystems.length; i ++ ) {
          let option = this.partSystems[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
              this.filteredPartSystems.push( option );
          }
        }
        break;
      case 'assembly':
        this.filteredPartAssemblyItems = [];
        for ( let i = 0 ; i < this.partAssemblyItems.length; i ++ ) {
          let option = this.partAssemblyItems[i];
          if (option.name.toLowerCase().indexOf(filter) >= 0) {
              this.filteredPartAssemblyItems.push( option );
          }
        }
        break;
    }    
  }

  fieldChange(index, field, value) {
    let action;
    console.log(index+'::'+field+'::'+value)
    switch(field) {
      case 'defProdType':
        if(value != 'All') {
          action = 'create';
          this.prodTypeFlag = true;
          if(index == 0) {
            localStorage.setItem('appProdType', value);
          }
          this.addAppFields(this.actionInit, index, value);
          setTimeout(() => {
            this.defProdType = value;
          }, 500);
        }
        break;
      case 'prodType':
        let removeFlag = false;
        let appLen = this.appFormInfo.length;
        if(index == 0 && value == 'All') {
          if(this.appFormInfo[index].actionFlag) {
            const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
            modalRef.componentInstance.access = 'Remove Vehicles';
            modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
              modalRef.dismiss('Cross click'); 
              console.log(receivedService);
              removeFlag = receivedService;
              if(!removeFlag) {
                let ptype = localStorage.getItem('AppProdType');
                this.appFormInfo[index].genericProductName = ptype;
              } else {
                localStorage.removeItem('appProdType');
                for(let a = 0; a < appLen; a++) {
                  this.removeAppFields(a);
                }
              }
            });            
          } else {
            removeFlag = true;
          }
          if(removeFlag) {
            localStorage.removeItem('appProdType');
            for(let a = 0; a < appLen; a++) {
              this.removeAppFields(a);
            }
          }
          return false;
        } else {
          if(index == 0) {
            localStorage.setItem('appProdType', value);
          }
          this.appFormInfo[index].prodTypeValid = true;
          action = 'change';
          this.appFormInfo[index].modelLoading = true;
          this.getAppModels(this.actionInit, index, value);
        }
        break;
      case 'info':
        this.addFormInfo[index].qtyValid = true;
        this.addFormInfo[index].qty = value;
        let i = parseInt(index)+1;
        let info = this.addFormInfo[index].infoItems.toString();
        let afi = `tadditionalInfo${index}`;
        let infoObj = {};
        infoObj[info] = value;
        this.addFormInfo[index][afi] = [infoObj];
        this.addFormInfo[i].infoDisabled = false;
        this.addFormInfo[index].info = [infoObj];
        console.log(this.addFormInfo[index][afi])
        break;  
    }    
  }

  // Create TVS Part Application Fields based on Product Code
  addTvsAppFields(action, index, item, initAction) {
    console.log(item)
    let valid = (action == 'edit') ? true : false;
    let prodCode = [];
    prodCode.push(item.prodCode);
    let prodType = item.prodType;
    let model:any = [];
    model.push(item.model) 
    this.appFormInfo.push({
      prodCode: prodCode,
      genericProductName: prodType,
      modelList: model,
      models: model,
      years: [],
      yearVal: [],
      prodTypeValid: true,
      modelValid: true,
      yearValid: true,
      actionFlag: false,
      addFlag: false,
      disable: true
    });

    this.appList.push({
      class: "app-info",
      title: prodType,
      isDisabled:false,
      isExpanded:true
    });

    this.a.push(this.formBuilder.group({
      prodCode: [prodCode],
      genericProductName: [prodType],
      model : [model],
      year: ['']
    }));
    
    if(action == 'edit' && initAction == 'init') {
      let commonData = this.partInfo['commonData'];
      let appDetails = JSON.parse(commonData.makeModels);
      for(let year in appDetails[index].year) {
        let y = appDetails[index].year[year];
        let sy = (y == 'All') ? [0] : y
        appDetails[index].year[year] = sy;
      }
      this.appFormInfo[index].years = appDetails[index].year;
      this.partsForm.value.appInfo[index].year = this.appFormInfo[index].years;
    }
    console.log(this.appFormInfo, this.a)
  }

  // Create Application Fields
  addAppFields(action, index, value) {
    console.log(action);console.log(index);console.log(value);
    let valid = (action == 'edit') ? true : false;
    let prodTypeValid = false;
    if(valid){
      prodTypeValid = (value == '') ? false : true; 
    }   
    this.appFormInfo.push({
      genericProductName: value,
      prodTypeValid: prodTypeValid,
      modelList: [],
      models: [],
      years: [],
      yearVal: [],
      modelValid: false,
      yearValid: true,
      modelLoading: true,
      actionFlag: false,
      addFlag: true
    });

    this.appList.push({
      class: "app-info",
      title: value,
      isDisabled:false,
      isExpanded:true
    });
        
    this.a.push(this.formBuilder.group({
      genericProductName: [''],
      model : [''],
      year: ['']
    }));

    if(action == this.actionInit) {
      if(index == 0) {
        this.appFormInfo[index].prodTypeValid = true;
      }
      if(index > 0) {
        if(this.prodTypes.length == this.appProdTypes.length) {
          this.appProdTypes.splice(0, 1);
        }
        this.appFormInfo[index-1].addFlag = false;
      }
    }

    if(action == 'edit') {
      let commonData = this.partInfo['commonData'];
      let appDetails = JSON.parse(commonData.makeModels);
      this.appFormInfo[index].models = appDetails[index].model;      
      this.partsForm.value.appInfo[index].model = this.appFormInfo[index].models;
      //this.appFormInfo[index].modelValid = (this.partsForm.value.appInfo[index].model.length == 0) ? false : true;
      for(let year in appDetails[index].year) {
        let y = appDetails[index].year[year];
        let sy = (y == 'All') ? [0] : y
        appDetails[index].year[year] = sy;
      }
      this.appFormInfo[index].years = appDetails[index].year;
      this.partsForm.value.appInfo[index].year = this.appFormInfo[index].years;
      if(index == 0) {
        this.defProdType = value;
        this.partsForm.value.prodTypeVal = value;        
      }
      console.log(this.appFormInfo[index].models)
    }
    setTimeout(() => {
      this.getAppModels(action, index, value);
    }, 500);
  }  

  // Remove Application Fields
  removeAppFields(index) {
    if(this.tvsFlag) {
      let prodCodes = this.appFormInfo[index].prodCode;
      console.log(prodCodes, this.scrollPos)
      for(let pc of prodCodes) {
        let rmPcIndex = this.filteredProdCodes.findIndex(option => option === pc);
        this.filteredProdCodes.splice(rmPcIndex, 1);
        let rmSel = this.prodCodeSelectedList.findIndex(option => option.id === pc);
        let selCount = this.prodCodeSelectedList.filter(option => option.id === pc).length;
        this.prodCodeSelectedList.splice(rmSel, selCount);
      }        
      if(index == 0 && this.appFormInfo.length == 1) this.prodTypeFlag = false;
      this.a.removeAt(index);
      this.appList.splice(index, 1);
      this.appFormInfo.splice(index, 1);
      if(!this.prodTypeFlag) {
        let val = -650;
        this.scrollProdCode('empty', val);
      }   
    } else {
      this.a.removeAt(index);
      this.appList.splice(index, 1);
      this.appFormInfo.splice(index, 1);
      if(index == 0) {
        this.prodTypeFlag = false;
        this.defProdType = "";
        this.partsForm.value.prodTypeVal = "";
        localStorage.removeItem('appProdType');
      } else {
        let removeIndex = (this.appFormInfo.length == index) ?  index -1 : index;
        this.appFormInfo[removeIndex].addFlag = true;      
      }
    }
  }

  // Get App Models
  getAppModels(action, index, value) {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'threadType': this.threadType,
      'searchText': '',
      'make': value
    };
    this.appFormInfo[index].modelList = [];
    this.partsApi.getModels(apiData).subscribe((response) => {
      if(response.status == "Success") {
        this.loading = false;
        let resultData = response.data.model;
        this.appFormInfo[index].modelList.push({
          'id': 'All',
          'name': 'All'
        });
        for(let m of resultData) {          
          this.appFormInfo[index].modelList.push({
            'id': m,
            'name': m
          });
        }
        this.appFormInfo[index].modelLoading = false;
        this.appFormInfo[index].modelValid = false;
        if(index == 0) {
          this.appFormInfo[index].genericProductName = value;
        }
        this.appList[index].title = value;
      }
    });
  }


  // Create Additional Info Fields
  addInfoFields(action, index, item, value) {
    console.log(index, item)
    let valid = (action == 'edit') ? true : false;
    let i = parseInt(index)+1;
    let splitCol = (item == 'colour') ? false : true;
    let label = (item == 'colour') ? 'Colour' : `Additional Model Info ${index}`;
    let fieldClass = (item == 'colour') ? 'colour' : `add-info-field-${index}`;
    let field = (item == 'colour') ? 'colour' : `info-${index}`;
    let controlName = (item == 'colour') ? 'colour' : `info${index}`;
    let placeholder = (item == 'colour') ? 'N/A' : 'Select';
    this.addFormInfo.push({
      fieldName: field,
      controlName: controlName,
      infoLabel: label,
      infoClass: fieldClass,
      placeholder: placeholder,
      qtyLabel: `Part Quantity`,
      qtyClass: 'qty-field',
      info: [],
      infoItems: [],
      infoLists: [],
      qty: '',
      splitCol: splitCol,
      infoDisabled: true,
      infoValid: true,
      qtyDisabled: true,
      qtyValid: true,
      qtyList: this.quantityItems
    });
    
    let ci = parseInt(index);
          
    if(item == 'colour') {
      if(this.partId > 0) {
        let placeholder = this.addFormInfo[index].placeholder;
        placeholder = (this.filteredColourCodes.length == 0) ? placeholder : this.filteredColourCodes[0];
        this.addFormInfo[index].placeholder = placeholder;
      }
      this.ai.push(this.formBuilder.group({
        colour: ''
      }));
    } else {
      let infoVal = (this.partId > 0) ? this.partInfo['commonData'] : [];
      switch (ci) {
        case 1:
          let info1 = 'tadditionalInfo1';
          let infoData1 = 'tadditionalInfoData1';
          /*console.log(infoVal, infoVal[infoData1])
          */
          this.addFormInfo[index][info1] = [];
          this.addFormInfo[index].infoDisabled = false;
          this.addFormInfo[index].infoValid = false;
          this.addFormInfo[index].qtyValid = false;
          if(action == 'edit') {
            this.setupAdditionalInfo(ci, infoVal, info1, infoData1);
          }
          break;
        case 2:
          let info2 = 'tadditionalInfo2';
          let infoData2 = 'tadditionalInfoData2';
          this.addFormInfo[index][info2] = [];
          if(action == 'edit') {
            this.setupAdditionalInfo(ci, infoVal, info2, infoData2);
          }
          break;
        case 3:
          let info3 = 'tadditionalInfo3';
          let infoData3 = 'tadditionalInfoData3';
          this.addFormInfo[index][info3] = [];
          if(action == 'edit') {
            this.setupAdditionalInfo(ci, infoVal, info3, infoData3);
          }
          break;
        case 4:
          let info4 = 'tadditionalInfo4';
          let infoData4 = 'tadditionalInfoData4';
          this.addFormInfo[index][info4] = [];
          if(action == 'edit') {
            this.setupAdditionalInfo(ci, infoVal, info4, infoData4);
          }
          break;
        case 5:
          let info5 = 'tadditionalInfo5';
          let infoData5 = 'tadditionalInfoData5';
          this.addFormInfo[index][info5] = [];
          if(action == 'edit') {
            this.setupAdditionalInfo(ci, infoVal, info5, infoData5);
          }
          break;
        case 6:
          let info6 = 'tadditionalInfo6';
          let infoData6 = 'tadditionalInfoData6';
          this.addFormInfo[index][info6] = [];
          if(action == 'edit') {
            this.setupAdditionalInfo(ci, infoVal, info6, infoData6);
          }
          break;
      }

      this.ai.push(this.formBuilder.group({
        additionalInfo: [''],
        qty: ['']
      }));
    }
  }

  // Setup Additional Info Values
  setupAdditionalInfo(i, data, info, infoData) {
    let infoVal = data[infoData];
    console.log(i, data, info, infoData, infoVal)
    if(infoVal.length > 0) {
      let id = infoVal[0].id;
      let name = infoVal[0].name;
      let qty = parseInt(infoVal[0].partQuantity);
      let infoObj = {};
      infoObj[id] = qty;
      this.addFormInfo[i][info] = [infoObj];
      this.addFormInfo[i].info = [infoObj];
      this.addFormInfo[i].infoItems = [id];
      this.addFormInfo[i].infoLists = [name];
      this.addFormInfo[i].qty = qty;
      this.addFormInfo[i].infoDisabled = false;
      this.addFormInfo[i].qtyDisabled = false;
      this.addFormInfo[i].infoValid = true;
      this.addFormInfo[i].qtyValid = true;
    } else {
      if(i > 1) {
        console.log(i-1)
        let chkInfo = this.addFormInfo[i-1];
        let chkFlag = chkInfo.qty;
        this.addFormInfo[i].infoDisabled = (chkFlag != '') ? false : true;
      }      
    }
  }

  // Manage Product codes
  manageProdCodes() {
    let apiUrl = `${this.baseApiUrl}/forum/GetProductCodeInfo`;
    let title = 'Product Codes';
    let selectionType = 'single';
    
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      threadType: this.threadType,
      groupId: 0
    };

    let inputData = {
      apiUrl: apiUrl,
      baseApiUrl: this.baseApiUrl,
      filteredItems: this.prodCodeSelectedList,
      prodCodeSelectedList: this.prodCodeSelectedList,
      title: title
    };

    const modalRef = this.modalService.open(ManageProductCodesComponent, this.modalConfig);
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService)
      let items = receivedService.selectedItems;
      let removedItems = receivedService.removedItems;
      let action = (this.partId > 0) ? this.actionEdit : this.actionInit;
      this.prodCodeSelectedList = items;
      
      if(items.length == 0 && removedItems.length == 0) {
        this.prodTypeFlag = false;
        this.appFormInfo.forEach((e, index) => {
          console.log(index);
          this.a.removeAt(index);
        });
        this.a.reset();
        this.filteredProdCodes = [];
        this.prodCodeSelectedList = [];
        setTimeout(() => {
          this.appFormInfo = [];
          this.appList = [];
          this.a.removeAt(0);
          let val = -450;
          this.scrollProdCode('empty', val);
          console.log(this.appFormInfo, this.appList, this.a)
        }, 50);
      }

      // Setup Product Code App Data
      this.setupProdAppData('trigger', items);
      
      if(removedItems.length > 0) {
        console.log(inputData.filteredItems)
        for(let t in removedItems) {
          let prodCode = removedItems[t].id;
          let prodType = removedItems[t].prodType;
          let model = removedItems[t].model;
          let fitems = inputData.filteredItems;
          let chkprodTypeIndex = this.appFormInfo.findIndex(option => option.genericProductName == prodType);
          console.log(chkprodTypeIndex)
          let appFormInfo = this.appFormInfo[chkprodTypeIndex];
          let chkmindex = appFormInfo.models.findIndex(option => option == model);
          let cainfo = this.a.value[chkprodTypeIndex];
          let cainfomi = cainfo.model.findIndex(option => option == model);
          console.log(chkmindex, this.filteredProdCodes)
          
          if(chkmindex >= 0) {
            let cpmIndex = fitems.findIndex(option => option.model == model);
            let code = fitems[cpmIndex].id;
            let codeLen = items.filter(option => option.id == code).length;
            let
             fcodeLen = fitems.filter(option => option.id === code).length;
            console.log(items, codeLen, fcodeLen, code, model)
            let filterRemoveFlag = false;
            if(codeLen == 0 && fcodeLen > 0) {
              let codeItemIndex = appFormInfo.prodCode.findIndex(option => option === prodCode);
              if(codeItemIndex >= 0) {
                filterRemoveFlag = true;
                //cainfo.prodCode.splice(codeItemIndex);
                appFormInfo.prodCode.splice(codeItemIndex, 1);  
              }
              console.log(prodCode, codeItemIndex, appFormInfo, filterRemoveFlag)
              if(filterRemoveFlag) {
                let chkfcIndex = this.filteredProdCodes.findIndex(option => option === prodCode);
                console.log(prodCode, chkfcIndex)
                console.log(this.filteredProdCodes)
                this.filteredProdCodes.splice(chkfcIndex, 1);
              }              
            }
            console.log(this.filteredProdCodes, chkmindex, appFormInfo.models[chkmindex])
            appFormInfo.models.splice(chkmindex, 1);
            if(appFormInfo.models.length == 0) {
              this.a.removeAt(chkprodTypeIndex);
              this.appList.splice(chkprodTypeIndex, 1);
              this.appFormInfo.splice(chkprodTypeIndex, 1);
              this.prodTypeFlag = (this.appFormInfo.length == 0) ? false : this.prodTypeFlag;
            }

            this.filteredProdCodes = (appFormInfo.length == 0) ? [] : this.filteredProdCodes;
          }
        }
      }
      console.log(this.filteredProdCodes);
      this.prodCodes = this.filteredProdCodes;
    });
  }

  // Setup Product Code App Data
  setupProdAppData(action, items) {
    let partAction = (this.partId > 0) ? this.actionEdit : this.actionInit;
    let itemLen = items.length;
    for(let t in items) {
      let prodCode = items[t].id;
      let prodType = items[t].prodType;
      let model = items[t].model;
      let appItem = {
        prodCode: prodCode,
        prodType: prodType,
        model: model
      }
      let sval = 0;
      let scrollFlag = false;
      if(!this.prodTypeFlag && itemLen > 0) {
        this.prodTypeFlag = true;
        this.filteredProdCodes.push(items[t].id);
        this.addTvsAppFields(partAction, t, appItem, action);
        scrollFlag = true;
      } else if(this.prodTypeFlag && itemLen > 0) {
        this.prodTypeFlag = true;
        console.log(items[t], prodCode, prodType, model)
        let chkCodeIndex = this.filteredProdCodes.findIndex(option => option == prodCode);
        if(chkCodeIndex < 0) {
          this.filteredProdCodes.push(items[t].id);
        }
        let chkprodTypeIndex = this.appFormInfo.findIndex(option => option.genericProductName == prodType);
        console.log(chkprodTypeIndex)
        if(chkprodTypeIndex < 0) {
          let appIndex = this.appFormInfo.length;
          this.addTvsAppFields(partAction, appIndex, appItem, action);
          scrollFlag = true;
        } else {
          let appFormInfo = this.appFormInfo[chkprodTypeIndex];
          let ainfo = this.a.value[chkprodTypeIndex];
          console.log(appFormInfo, ainfo, this.a.value)
          let appCodeData = appFormInfo.prodCode;
          let appCodeIndex = appCodeData.findIndex(option => option == prodCode);
          if(appCodeIndex < 0) {
            appCodeData.push(prodCode);
            appCodeData = [...new Set(appCodeData)];
            appFormInfo.prodCode = appCodeData;
            ainfo.prodCode = appCodeData;
          }
          let appModelData = appFormInfo.models;
          console.log(ainfo, appModelData)
          let appModelIndex = appModelData.findIndex(option => option == model);
          console.log(model, appModelIndex)
          if(appModelIndex < 0) {
            appModelData.push(model);
            appModelData = [...new Set(appModelData)];
            appFormInfo.models = appModelData;
            ainfo.model = appModelData;
          }
        }
      }
      if(scrollFlag && action == 'trigger') {
        this.scrollProdCode('add', sval);
      }
    }
  }

  // Manage Tvs Part Field
  manageTvsPartField(item, index) {
    let checkArr = ['fieldName'];
    item = this.commonApi.unique(item, checkArr);
    console.log(item, item[index], this.baseApiUrl)
    let apiUrl = this.baseApiUrl;
    let access = 'newthread';
    let field = item[index].fieldName;
    let title = '';
    let action = false;
    let selectionType = 'single';
    let filteredItems, filteredLists;
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };

    switch(field) {
      case 'colour':
        action = true;
        apiUrl = `${apiUrl}/parts/GetColorValuesInfo`;
        title = 'Colours';
        filteredItems = this.filteredColourCodeIds;
        filteredLists = this.filteredColourCodes;
        apiData['threadType'] = this.threadType;
        apiData['groupId'] = 0;
        break;
      default:
        if(!item[index].infoDisabled) {
          action = true;
          apiUrl = `${apiUrl}/vehicle/GetAdditionalInfo`;
          title = item[index].infoLabel;
          filteredItems = this.addFormInfo[index].infoItems;
          filteredLists = this.addFormInfo[index].infoLists;
          this.addFormInfo[index].qtyDisabled = true;
          console.log(this.addFormInfo[index])
          //selectionType = 'multiple';
          let selectedInfo = [];
          let addFormInfo = this.addFormInfo;
          let itemLen = item.length;
          console.log(itemLen)
          for(let ai = 0; ai < itemLen; ai++) {
            if(ai != index && addFormInfo[ai].fieldName != 'colour') {
              selectedInfo = selectedInfo.concat(addFormInfo[ai].infoItems);
            }
          }
          console.log(selectedInfo)
          apiData['contentTypeId'] = 6;
          apiData['makeName'] = '';
          apiData['modelName'] = '';
          apiData['selectedInfo'] = JSON.stringify(selectedInfo);
        } else {
          return false;
        }        
        break;  
    }

    let inputData = {
      baseApiUrl: this.baseApiUrl,
      apiUrl: apiUrl,
      field: field,
      selectionType: selectionType,
      filteredItems: filteredItems,
      filteredLists: filteredLists
    };

    console.log(inputData)

    inputData['title'] = title;
    const modalRef = this.modalService.open(ManageListComponent, this.modalConfig);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = action;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService)
      let items = receivedService;
      switch (field) {
        case 'colour':
          this.filteredColourCodeIds = [];
          this.filteredColourCodes = [];
          for(let t in items) {
            let chkIndex = this.filteredColourCodeIds.findIndex(option => option == items[t].id);
            if(chkIndex < 0) {
              this.filteredColourCodeIds.push(items[t].id);
              this.filteredColourCodes.push(items[t].name);
              this.prodColour = this.filteredColourCodeIds;
              this.addFormInfo[index].placeholder = items[t].name;    
            }        
          }
          if(receivedService.length == 0) {
            this.addFormInfo[index].placeholder = 'N/A';
          }
          console.log(this.filteredColourCodes, this.filteredColourCodeIds)
          break;
        default:
          console.log(index)
          this.addFormInfo[index].infoValid = true;
          this.addFormInfo[index].qtyDisabled = false;
          
          this.addFormInfo[index].infoItems = [];
          this.addFormInfo[index].infoLists = [];
          for(let t in items) {
            let id = items[t].id;
            let chkIndex = item[index].infoItems.findIndex(option => option == items[t].id);
            if(chkIndex < 0) {
              this.addFormInfo[index].infoItems.push(id);
              this.addFormInfo[index].infoLists.push(items[t].name);
              let afi = `tadditionalInfo${index}`;
              let infoObj = {};
              infoObj[id] = this.addFormInfo[index].qty;
              this.addFormInfo[index][afi] = [infoObj];
              this.addFormInfo[index].info = [infoObj];
              let qty = this.addFormInfo[index].qty;
              if(qty == '') {
                this.addFormInfo[index].qtyValid = false;
              }
            }        
          }
          
          if(receivedService.length == 0) {
            this.disableItemSelection(index, 0, 'info');
          }
          console.log(this.addFormInfo[index])
          break;  
      }
    });
  }

  // Manage List
  manageList(field) {
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
      this.innerHeight = (this.bodyHeight-(headerHeight+20));  
      this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;
    }

    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
      'threadType': this.threadType,
      'groupId': 0
    };

    let access;
    let filteredItems;
    switch(field) {
      case 'tag':
        access = 'Tags';
        filteredItems = this.filteredTagIds;
        break;
    }
    
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.filteredLists = this.filteredTags;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight-140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click');
      let items = receivedService;
      switch (field) {
        case 'tag':
          this.filteredTagIds = [];
          this.filteredTags = [];
          for(let t in items) {
            let chkIndex = this.filteredTagIds.findIndex(option => option == items[t].id);
            if(chkIndex < 0) {
              this.filteredTagIds.push(items[t].id);
              this.filteredTags.push(items[t].name);
            }        
          }
          console.log(this.filteredTags, this.filteredTagIds)
        break;
      }
    });
  }
  

  // Manage Error Codes
  manageErrorCodes() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
    this.innerHeight = (this.bodyHeight-(headerHeight+20));  
    this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;

    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
      'vehicleInfo': JSON.stringify(this.partsForm.value.appInfo)
    };
    
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = 'Error Codes';
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredErrorCodes = this.filteredErrorCodeIds;
    modalRef.componentInstance.filteredLists = this.filteredErrorCodes;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight-140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click');
      let errCodeItems = receivedService;
      this.filteredErrorCodeIds = [];
      this.filteredErrorCodes = [];
      for(let t in errCodeItems) {
        let chkIndex = this.filteredTagIds.findIndex(option => option == errCodeItems[t].id);
        if(chkIndex < 0) {
          this.filteredErrorCodeIds.push(errCodeItems[t].id);
          this.filteredErrorCodes.push(errCodeItems[t].name);
        }        
      }
    });
  }
  processChange(event)
  {
console.log(event.target.value);
let apiData = {
  apiKey: Constant.ApiKey,
  domainId: this.domainId,
  countryId: this.countryId,
  userId: this.userId,
  partId: this.partId,
  partNo: event.target.value
};
const apiFormData = new FormData();
apiFormData.append('apiKey', Constant.ApiKey);
apiFormData.append('domainId', this.domainId);
apiFormData.append('countryId', this.countryId);
apiFormData.append('userId', this.userId);
apiFormData.append('partNo', event.target.value);
apiFormData.append('partId', this.partId.toString());
this.partsApi.CheckPartNoIsExist(apiFormData).subscribe((response) => {

  if(response.status=='Failure')
  {
 this.validatePartNo=false;
 this.validatePartMsg=response.result;
 //alert(this.validatePartMsg);

  }
  else
  {
    this.validatePartNo=true;
  }

});
  }
  // Related Threads
  getRelatedThreads() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
    this.innerHeight = (this.bodyHeight-(headerHeight+20));  
    this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;

    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
      'threadType': this.threadType,
      'vehicleInfo': JSON.stringify(this.partsForm.value.appInfo)
    };
    
    const modalRef = this.modalService.open(RelatedThreadListsComponent, this.config);
    modalRef.componentInstance.access = 'Threads';
    modalRef.componentInstance.filteredThreads = this.filteredRelatedThreadIds;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight-140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click');
      let threadItems = receivedService;
      this.filteredRelatedThreadIds = [];
      this.filteredRelatedThreads = [];
      for(let t in threadItems) {
        let chkIndex = this.filteredRelatedThreadIds.findIndex(option => option == threadItems[t].id);
        if(chkIndex < 0) {
          let threadId = threadItems[t].id.toString();
          this.filteredRelatedThreadIds.push(threadId);
          this.filteredRelatedThreads.push(threadItems[t].id+' '+threadItems[t].name);
        }        
      }
    });
  }

  // Disable Related Thread Selection
  disableRelatedThreadSelection(index) {
    this.filteredRelatedThreadIds.splice(index, 1);
    this.filteredRelatedThreads.splice(index, 1);
  }

  // Disable Tag Selection
  disableTagSelection(index) {
    this.filteredTagIds.splice(index, 1);
    this.filteredTags.splice(index, 1);
  }

  disableItemSelection(index, itemIndex, field) {
    switch (field) {
      case 'colour':
        this.filteredColourCodeIds.splice(itemIndex, 1);
        this.filteredColourCodes.splice(itemIndex, 1);
        this.addFormInfo[index].placeholder = 'N/A';
        break;
      default:
        console.log(this.addFormInfo)
        let empty = [];
        let afi = `tadditionalInfo${index}`;
        this.addFormInfo[index][afi] = [];
        this.addFormInfo[index].info = empty;
        this.addFormInfo[index].infoItems = empty;
        this.addFormInfo[index].infoLists = empty;
        this.addFormInfo[index].qty = '';
        let validFlag = (index > 1 && index < 7) ? false : true;
        if(index < 7) {
          let nextIndex = index+1;
          let chkinfo = this.addFormInfo[nextIndex].info;
          if(chkinfo.length > 0) {
            validFlag = true;
          } else {
            this.addFormInfo[nextIndex].infoDisabled = true;
          }
          let prevIndex = index-1;
          let chkPrevInfo = this.addFormInfo[prevIndex];
          console.log(prevIndex, chkPrevInfo, index)
          if(!chkPrevInfo.qtyValid && index > 1) {
            let flag = true;
            this.addFormInfo[prevIndex].infoValid = flag;
            this.addFormInfo[prevIndex].qtyValid = flag;
            this.addFormInfo[prevIndex].qtyDisabled = flag;            
            this.addFormInfo[index].infoValid = flag;
            this.addFormInfo[index].infoDisabled = flag;
            this.addFormInfo[index].qtyValid = flag;
            this.addFormInfo[index].qtyDisabled = flag;
          }
        }
        if(validFlag) {
          this.addFormInfo[index].infoValid = false;
          this.addFormInfo[index].qtyValid = false;
          this.addFormInfo[index].qtyDisabled = true;
        }
        break;
    }
  }

  // Disable Error Code Selection
  disableErrorCodeSelection(index) {
    this.filteredErrorCodeIds.splice(index, 1);
    this.filteredErrorCodes.splice(index, 1);
  }

  // Publish or Save Draft
  submitAction(action) {
   // this.saveDraftFlag = (action == 'save') ? true : false;
    this.onSubmit(action);
  }

  // Back to Step1
  backStep1() {
    this.step1 = true;
    this.step2 = false;
    this.step1Action = true;
    this.step2Action = false;
    this.stepBack = true;
    this.step2Submitted = false;
    this.partUpload = false;
    console.log(this.partApiData)
    this.partApiData['uploadedItems'] = this.uploadedItems.items;
    this.partApiData['attachments'] = this.uploadedItems.attachments;
  }

  // On Submit
  onSubmit(submitAction='null') {
    console.log(this.partsForm.value)
    //this.partUpload = false;
    if(!this.validatePartNo)
    {
      this.step1Submitted = false;
      return false;
    }
    if(this.step1Action && !this.step2Action) {
      this.step1Submitted = true;

      if(this.invalidFile || this.invalidFileSize) {
        //this.errorSecTop();
        return false;
      }

      /*if(this.partsForm.value.prodTypeVal == '') {
        return false;
      }*/

      for(let a of this.partsForm.value.appInfo) {
        let ptype = a.genericProductName;
        let model = a.model; 
        let year = (a.year == 0) ? [0] : a.year;
        a.year = year;
        console.log(a)
        //if(ptype == '' || model.length == 0 ||  year.length == 0) {
        if(!this.tvsFlag && (ptype == '' || model.length == 0)) {
          //this.errorSecTop();
          return false;
        }
      }

      if(this.tvsFlag) {
        let submitFlag = true;
        submitFlag = (this.filteredProdCodes.length == 0) ? false : submitFlag;
        for(let af of this.addFormInfo) {
          let infoValid = af.infoValid;
          let qtyValid = af.qtyValid;
          if(af.fieldName != 'colour' && (!infoValid || !qtyValid)) {
            submitFlag = false;
          }
        }
        console.log(submitFlag)
        if(!submitFlag) {
          return false;
        }
      }

      // stop here if form is invalid
      if (this.partsForm.invalid) {
        //this.errorSecTop();
        return;
      }

      let checkArr = ['fieldName'];
      this.addFormInfo = this.commonApi.unique(this.addFormInfo, checkArr);
      console.log(this.addFormInfo)
      this.scrollPos = 0;
      this.step2 = true;
      this.step2Action = true;
      this.stepBack = false;
      this.step1Submitted = false;
      this.partUpload = true;
      setTimeout(() => {
        this.errorSecTop('step');  
      }, 50);
    } else {
      this.step2Submitted = true;

      if(this.filteredWorkstreams.length == 0) {
        this.workstreamValid = false;
        //this.errorSecTop();
        return false;
      } else {
        this.workstreamValid = true;
      }

      console.log(this.uploadedItems);
      let upItems = Object.keys(this.uploadedItems);
      console.log(upItems.length)
      if(upItems.length > 0 && this.uploadedItems.items.length > 0) {
        let valid = true;
        let ui = 0;
        let eid = 'alink';
        for(let u of this.uploadedItems.attachments) {
          if(!u.valid) {
            valid = u.valid;
            if(!u.validError) {
              eid = `empty-link-${ui}`;
              let errLink = document.getElementById(eid);
              errLink.classList.remove('hide');
            }
          }
          ui++;
          u.fileCaption = (u.fileCaption == '') ? u.fileCaptionVal : u.fileCaption;
        }
        
        if(!valid) {          
          this.errorSecTop(eid);
          return false;
        }
      }

      this.saveDraftFlag = (submitAction == 'save') ? true : false;
      this.partsForm.value.workstreams = this.filteredWorkstreamIds;
      this.partsForm.value.tags = JSON.stringify(this.filteredTags);
      let partsFormVal = this.partsForm.value;
      
      let action =  (this.saveDraftFlag) ? 1 : 2;
      let actionTxt = (this.saveDraftFlag) ? 'Save' : 'Publish'
      partsFormVal.action = action;
      if(partsFormVal.prodTypeVal == 'All') {
        let appInfo = [{
          genericProductName: partsFormVal.prodTypeVal,
          model: [],
          year: [0]
        }];
        partsFormVal.appInfo = JSON.stringify(appInfo);
      } else {
        partsFormVal.appInfo = JSON.stringify(partsFormVal.appInfo);
      }

      if(this.tvsFlag) {
        partsFormVal.productCode = this.prodCodes;
        partsFormVal.colorValues = this.prodColour;
        partsFormVal.productgroupInfo = this.prodCodeSelectedList;        
      }

      if(action == 2) {
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = actionTxt;
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
          modalRef.dismiss('Cross click'); 
          if(!receivedService) {
            if(this.partId > 0){
              if(this.isPublishedFlag == '1' ){
                this.saveDraftFlag = true;
              }
            }
            else{              
              this.saveDraftFlag = true;
            }
            //return;
          } else {
            console.log(partsFormVal);
            this.partSubmit(action, partsFormVal);
          }
        });
      } else {
        this.partSubmit(action, partsFormVal);
      }      
    }
  }

  // Error Section Scroll
  errorSecTop(action = '') {
    let id, addPos;
    if(action != '') {
      id = action;
      addPos = 0;
    } else {
      id = 'valid-error';
      addPos = 80;
    }
    let secElement = document.getElementById('step');
    let errElement = document.getElementById(id);
    let scrollTop = (action == 'step') ? 0 : errElement.offsetTop;
    console.log(id, scrollTop)
    setTimeout(() => {
      if(action == '' || action == 'step') {
        this.scrollPos = scrollTop+addPos;
        secElement.scrollTop = this.scrollPos;
      } else {
        errElement.scrollIntoView();
      }
    }, 200);
  }

  // Submit Part
  partSubmit(action, partFormVal) {
    console.log(partFormVal)
    this.bodyElem.classList.add(this.bodyClass);
    let platformId = localStorage.getItem('platformId');
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let partImg = (this.imgURL != null) ? this.selectedPartsImg : '';
    
    if(this.partId > 0) {
      if(this.imgName == null) {
        partImg = (this.selectedPartsImg == undefined) ? "" : this.selectedPartsImg;
      } else {
        partImg = this.imgName;
      }
      localStorage.removeItem('partAttachments');
    }

    let partFilters = JSON.parse(localStorage.getItem('partFilter'));
    console.log(partFilters)
    if(partFilters && partFilters != undefined) {
      let partWs = partFilters.workstream;
      console.log(partWs)
      if(partFilters != undefined && partWs != undefined) {
        for(let ws of this.newWorkstreamItems) {
          let index = partWs.findIndex(option => option == ws);
          if(index < 0) {
            partWs.push(ws)
          }  
        }
      }
      console.log(JSON.stringify(partFilters))
      localStorage.setItem('partFilter', JSON.stringify(partFilters));
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

    let partFormData = new FormData();
    let workstreams: any = JSON.stringify(this.filteredWorkstreamIds);
    let system: any = (partFormVal.partSystem == 0) ? "" : partFormVal.partSystem;
    let assembly: any = (partFormVal.partAssembly == 0) ? "" : partFormVal.partAssembly;
    let tags: any = JSON.stringify(this.filteredTagIds);
    let errorCodes: any = JSON.stringify(this.filteredErrorCodeIds);
    let relatedThreadItems: any = JSON.stringify(this.filteredRelatedThreadIds);
    let partStatus:any = this.partStatus;
    partFormData.append('action', action);
    partFormData.append('apiKey', Constant.ApiKey);
    partFormData.append('domainId', partFormVal.domainId);
    partFormData.append('countryId', partFormVal.countryId);
    partFormData.append('userId', partFormVal.userId);
    partFormData.append('partStatus', partStatus);
    partFormData.append('partImg', partImg);
    partFormData.append('partNo', partFormVal.partNumber);
    partFormData.append('partName', partFormVal.partName);
    partFormData.append('additionalInfo', partFormVal.partDesc);
    partFormData.append('alternatePartNo', partFormVal.altPartNumber);
    partFormData.append('partType', partFormVal.partType);
    partFormData.append('partSystem', system);
    partFormData.append('partAssembly', assembly);
    partFormData.append('vehicleInfo', partFormVal.appInfo);
    partFormData.append('workstreams', workstreams);
    partFormData.append('selectedTags', tags);
    partFormData.append('errorCodes', errorCodes);
    partFormData.append('relatedThreads', relatedThreadItems);
    partFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));

    let solrContType:any = SolrContentTypeValues.Parts;
    let apiDataSocial = new FormData();    
    apiDataSocial.append('apiKey', Constant.ApiKey);
    apiDataSocial.append('domainId', this.domainId);
    apiDataSocial.append('userId', this.userId); 
    apiDataSocial.append('actionType', solrContType);
    this.mssDomain=(this.domainId == '82') ? true : false;
    let solrApi = (platformId == PlatFormType.Collabtic || this.mssDomain || this.tvsFlag) ? true : false;
    
    if(this.platformId == 2 && this.domainId == 52) {
      partFormData.append('figNo', partFormVal.figNo);
      partFormData.append('refNo', partFormVal.refNo);
    }

    if(this.tvsFlag) {
      partFormData.append('productCode', JSON.stringify(partFormVal.productCode));
      partFormData.append('colorValues', JSON.stringify(partFormVal.colorValues));
      partFormData.append('productgroupInfo', JSON.stringify(partFormVal.productgroupInfo));
      this.addFormInfo.forEach((e, index) => {
        console.log(index, e)
        if(index > 0) {
          let afi = `tadditionalInfo${index}`;
          partFormData.append(afi, JSON.stringify(this.addFormInfo[index][afi]));
          console.log(JSON.stringify(this.addFormInfo[index][afi]))
        }
      });
    }

    let pushFormData = new FormData();
    pushFormData.append('apiKey', Constant.ApiKey);
    pushFormData.append('domainId', this.domainId);
    pushFormData.append('countryId', this.countryId);
    pushFormData.append('userId', this.userId);
    pushFormData.append('groups', workstreams);
    pushFormData.set('contentTypeId', this.contentType);

    if(this.partId > 0) {
      let action:any = 1;
      let partId: any = this.partId;
      partFormData.append('editMode', action);
      partFormData.append('updatedAttachments', JSON.stringify(this.updatedAttachments));
      partFormData.append('deletedFileIds', JSON.stringify(this.deletedFileIds));
      partFormData.append('removeFileIds', JSON.stringify(this.removeFileIds));
      if(this.manageAction == 'edit') {
        partFormData.append('partId', partId);
      } else {
        partFormData.append('duplicatedPartId', partId);
      }
    }
    
    this.partsApi.manageParts(partFormData).subscribe((response) => {
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      this.successMsg = response.result;
      if(response.status == "Success") {
        let status:any = (action == 1) ? 4 : 1;
        let partId = (this.partId > 0) ? this.partId : response.partId;
        let postId = partId;        
        let partAtion = (this.partId == 0) ? 'create' : 'update';
        pushFormData.append('threadId', partId);
        pushFormData.append('postId', postId);
        apiDataSocial.append('threadId', postId);
        apiDataSocial.append('action', partAtion);
        localStorage.setItem('partNavStatus', status);
        if(this.partId > 0) {
          //let partInfo = response.dataInfo[0];
          let partInfo = '';
          let url = RedirectionPage.Parts;
          let flag: any = true;
          let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
          /*let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
          localStorage.setItem(pageTitle[pageDataIndex].navEdit, 'true');
          localStorage.setItem(pageDataInfo, JSON.stringify(partInfo));*/
          let navEditText = pageTitle[pageDataIndex].navEdit;
          let routeLoadText = pageTitle[pageDataIndex].routerText;
          localStorage.setItem(navEditText, flag);
          localStorage.setItem(routeLoadText, flag);
        }
        if(Object.keys(this.uploadedItems).length && this.uploadedItems.items.length > 0 && uploadCount > 0) {
          this.partUpload = false;
          this.partApiData['uploadedItems'] = this.uploadedItems.items;
          this.partApiData['attachments'] = this.uploadedItems.attachments;
          this.partApiData['message'] = this.successMsg;
          this.partApiData['dataId'] = partId;
          this.partApiData['navUrl'] = this.navUrl;
          this.partApiData['solrApi'] = solrApi;
          this.partApiData['threadAction'] = (this.partId > 0) ? this.manageAction : 'new';
          if(this.partId == 0) {
            this.partApiData['pushFormData'] = pushFormData;
          }
          this.partApiData['apiDataSocial'] = apiDataSocial;
          this.manageAction = 'uploading';
          setTimeout(() => {
            this.partUpload = true;  
          }, 500);
        } else {
          //this.threadApi.threadPush(pushFormData).subscribe((response) => {});
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = this.successMsg;
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
            localStorage.removeItem('partNav');
            let closeTimeout = (solrApi) ? 2500 : 0;
            if(solrApi) {
              this.baseService.postFormData("forum", "UpdateDatetoSolr", apiDataSocial).subscribe((response: any) => { }) 
            }
            if(this.teamSystem) {
              this.loading = true;
              window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
            } else {
              if(this.partId > 0 && (this.manageAction == 'edit' || this.manageAction == 'duplicate')) {
                let url = (this.manageAction == 'duplicate') ? RedirectionPage.Parts : this.navUrl;
                this.router.navigate([url]);
              } else {
                setTimeout(() => {
                  window.close();
                  window.opener.location = this.navUrl;  
                }, closeTimeout);
              }                           
            }
            /* if(this.partId > 0 && this.manageAction == 'edit' && this.navUrl != 'parts') {
              let flag: any = true;
              this.router.navigate([this.navUrl]);
            } else {
              window.close();
            } */            
          }, 2000);
        }        
      }
    });
  }

  // Close Current Window
  closeWindow() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        if(this.teamSystem) {
          //window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
          this.router.navigate([this.navUrl]);
        } else {
          if(this.partId == 0) {
            window.close();
          } else {
            let url = RedirectionPage.Parts;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            localStorage.setItem(pageTitle[pageDataIndex].navCancel, 'true');
            this.router.navigate([this.navUrl]);
          }
        }
      }
    });
  }

  // Selected Models
  selectedModels(index, list) {
    let items = list.items;
    this.partsForm.value.appInfo[index].model = items;
    this.appFormInfo[index].models = items;
    this.appFormInfo[index].modelValid = (this.partsForm.value.appInfo[index].model.length == 0) ? false : true;
    //this.appFormInfo[index].actionFlag = (this.appFormInfo[index].modelValid && this.appFormInfo[index].yearValid) ? true : false;
    this.appFormInfo[index].actionFlag = (this.appFormInfo[index].modelValid) ? true : false;
  }

  // Selected Years
  selectedYears(index, list) {
    let items = list.items;
    this.partsForm.value.appInfo[index].year = items;
    this.appFormInfo[index].years = items;
    
    //this.appFormInfo[index].yearValid = (this.partsForm.value.appInfo[index].year.length == 0) ? false : true;
    //this.appFormInfo[index].actionFlag = (this.appFormInfo[index].modelValid && this.appFormInfo[index].yearValid) ? true : false;
    this.appFormInfo[index].actionFlag = (this.appFormInfo[index].modelValid) ? true : false;
  }

  // Selected Workstreams
  selectedWorkstreams(items) {
    this.filteredWorkstreamIds = items;
    if(this.manageAction == 'new' || this.manageAction == 'duplicate') {
      this.newWorkstreamItems = this.filteredWorkstreamIds;
    } else {
      this.newWorkstreamItems = [];
      for(let ws of items) {
        let index = this.existingWorkstreams.findIndex(option => option == ws);
        if(index < 0) {
          this.newWorkstreamItems.push(ws)
        }  
      }
    }
    
    this.filteredWorkstreams = [];
    for(let ws of this.workstreamItems) {
      for(let i of items) {
        if(ws.workstreamId == i) {
          this.filteredWorkstreams.push(ws.workstreamName);
        }
      }
    }
    
    this.workstreamValid = (this.filteredWorkstreams.length == 0) ? false : true;
  }

  // Selected Error Codes
  selectedErrorCodes(items) {
    this.filteredErrorCodeIds = items;
    this.filteredErrorCodes = [];
    for(let e of this.errorCodes) {
      for(let i of items) {
        if(e.id == i) {
          this.filteredErrorCodes.push(e.name);
        }
      }
    }
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
    console.log(data)
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;
    let lang = data.language;
    
    switch (action) {
      case 'file-delete':
        this.deletedFileIds.push(fileId);
        break;
      case 'file-remove':
        this.removeFileIds.push(fileId);
        break;
      case 'order':
        let attachmentList = data.attachments;
        for(let a in attachmentList) {
          let uid = parseInt(a)+1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(option => option.fileId == ufileId);
          if(uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: (flagId == 6) ? attachmentList[a].url : '',
              displayOrder: uid
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
          language: lang
        };
        let index = this.updatedAttachments.findIndex(option => option.fileId == fileId);   
        if(index < 0) {
          updatedAttachmentInfo['displayOrder'] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
          this.updatedAttachments[index].language = lang;
        }
        
        console.log(this.updatedAttachments)
        break;
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    if(!this.teamSystem) {
      headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    }
    //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight+110));       
  }

  // Scroll to product code
  scrollProdCode(action, val) {
    console.log(val)
    let scrollEle = document.getElementById('step');
    let secElement = document.getElementById('tvsField');
    let scrollTop = secElement.offsetTop;
    setTimeout(() => {
      this.scrollPos = scrollTop+val;
      scrollEle.scrollTop = this.scrollPos
    }, 200);
  }

  beforePanelClosed(panel){
    panel.isExpanded = false;
    console.log("Panel going to close!");
  }
  beforePanelOpened(panel){
    panel.isExpanded = true;
    console.log("Panel going to  open!");
  }

  afterPanelClosed(){
    console.log("Panel closed!");
  }
  afterPanelOpened(){
    console.log("Panel opened!");
  }

}
