import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { Constant, filterNames, filterFields, ManageTitle, windowHeight, DefaultNewImages,ContentTypeValues } from 'src/app/common/constant/constant';
import { NgxMasonryComponent } from "ngx-masonry";
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { MatMenuTrigger } from '@angular/material';
import * as moment from 'moment';
import * as ClassicEditor from "src/build/ckeditor";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-standard-report-list',
  templateUrl: './standard-report-list.component.html',
  styleUrls: ['./standard-report-list.component.scss'],
  styles: [
    `.masonry-item {
        width: 210px;
      }
      .masonry-item, .masonry-item-type {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
      .masonry-item-type {
        width: 301px;
      }
    `,
  ],
})
export class StandardReportListComponent implements OnInit {
  @Input() apiInfo: any = [];
  @Output() reportComponentRef: EventEmitter<StandardReportListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<StandardReportListComponent> = new EventEmitter();
  @ViewChild(MatMenuTrigger, { static: false }) matMenuTrigger: MatMenuTrigger;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  subscription: Subscription = new Subscription();
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public iconfig: PerfectScrollbarConfigInterface = {};
  public dconfig: PerfectScrollbarConfigInterface = {};
  public contentTypeId=ContentTypeValues.StandardReports;
  public bodyElem;
  public bodyClass:string = "profile";
  public bodyClass1:string = "image-cropper";
  public bodyHeight: number;
  public innerHeight: number;
  public industryType: any = "";
  public seletedWs: any = "";
  public wsId: any = "";
  public wsName: string = "";

  reportForm: FormGroup;
  sectionForm: FormGroup;
  contentForm: FormGroup;
  diagnosticForm: FormGroup;
  diagnosticInfoForm: FormGroup;
  vehicleForm: FormGroup;
  adasContentForm: FormGroup;
  adasContentNotesForm: FormGroup;
  recallForm: FormGroup;

  public parentScrollDisabled: boolean = false;
  public displayModal = false;
  public copiedModal = false;
  public formValid: boolean = false;
  public reportFormSubmit: boolean = false;
  public sectionFormSubmit: boolean = false;
  public contentFormSubmit: boolean = false;
  public diagnosticFormSubmit: boolean = false;
  public diagnosticInfoFormSubmit: boolean = false;
  public vehicleFormSubmit: boolean = false;
  public adasContentFormSubmit: boolean = false;
  public adasContentNotesFormSubmit: boolean = false;
  public recallFormSubmit: boolean = false;
  public recallButtonFlag: boolean = false;
  public recallLoader: boolean = false;
  public vinLoader:boolean = false;
  public makeLoader: boolean = false;
  public modelLoader: boolean = false;
  public yearLoader: boolean = false;
  public manageTitle:any = ManageTitle.standardReport;
  public manageAction:string = 'report';

  public reportEmptyBanner = DefaultNewImages.StandardReports;
  public emptyBanner = "assets/images/no-result-media.png";
  public recallEmptyBanner = "assets/images/common/recall-empty-banner.png";
  public recallEmptyText = "Recall results will show here.";
  public emptyText = "Nothing to show";
  public defaultReportLogo = "assets/images/standard-report/report-folder-icon.png";
  public sindex: any = -1;
  public empty: any = [];
  public apikey: string = "";
  public domainId: string = "";
  public userId: string = "";
  public roleId: string = "";
  public countryId: any = "";
  public createAccess: boolean;
  public editAccess: boolean;
  public viewAccess: boolean;
  public deleteAccess: boolean;
  public initAction: boolean = true;
  public solrFlag: boolean = true;
  public loading: boolean = true;
  public reportFlag: boolean = true;
  public typeFlag: boolean = false;
  public sectionFlag: boolean = false;
  public diagnosticFlag: boolean = false;
  public adasFlag: boolean = false;
  public recallFlag: boolean = false;
  public reportFormFlag: boolean = false;
  public sectionFormFlag: boolean = false;
  public contFormFlag: boolean = false;
  public diagnosticFormFlag: boolean = false;
  public vehicleFormFlag: boolean = false;
  public adasContentFormFlag: boolean = false;
  public adasContentNotesFormFlag: boolean = false;
  public thumbView: boolean = true;
  public updateMasonryLayout: boolean = false;
  public reportItemEmpty: boolean = false;
  public sectionItemEmpty: boolean = false;
  public diagnosticItemEmpty: boolean = false;
  public adasItemEmpty: boolean = false;
  public recallEmpty: boolean = true;
  public recallItemEmpty: boolean = false;
  public reportSearchEmpty: boolean = false;
  public reportFieldDisabled: boolean = false;
  public alternateMfgFieldDisabled: boolean = false;
  public reportFieldVisible: boolean = false;
  public customReportFlag: boolean = false;
  public mfgReportFlag: boolean = false;
  public showClear:boolean = false;
  public reportExist:boolean = true;
  public sectionExist:boolean = true;
  public moduleExist: boolean = true;
  public dtcCodeExist: boolean = true;
  public vehicleExist: boolean = true;
  public searchFlag: boolean = false;
  public quickSearchFlag: boolean = false;
  public submitFlag: boolean = false;
  public checkFlag: boolean = false;
  public vinIsValid = false;
  public vinValid = true;
  public vinDisable = true;
  public vinVerfied = true;
  public modelDisable:boolean = true;
  public modelLoading:boolean = false;
  public yrData = [];
  public vinData: any = [];
  public modelPlaceHoder = "Select";

  public searchVal: string = "";
  public moduleLastUpload: string = '';
  public adasLastUpload: string = '';
  public existError:string = '';
  public redirectionPage: string = "";
  public pageTitleText: string = '';
  public displayNoRecordsShow = 2;
  public reportSelection: any = '';
  public emptyReportCont: string = 'Get started by tapping on "New".';
  public reportSelectionList: any = [{id: 1, name: 'Category'}, {id: 2, name: 'Manufacturer'}];

  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;

  public workstreamItems: any = [];
  public mfgItems: any = [];
  public makeItems: any = [];
  public modelItems: any = [];
  public yearItems: any = [];
  public modelVal: any = "";
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;

  public reportOffset: any = 0;
  public reportLimit: any = 20;
  public typeOffset: any = 0;
  public typeLimit: any = 20;
  public sectionOffset: any = 0;
  public sectionLimit: any = 10;
  public diagnosticOffset: any = 0;
  public diagnosticLimit: any = 10;
  public adasOffset: any = 0;
  public adasLimit: any = 10;
  
  public reportId: any = 0;
  public typeId: any = 0;
  public sectionId: any = 0;
  public adasId: any = 0;
  public reportInfo: any = [];
  public typeInfo: any = [];
  public reportTotal: number = 0;
  public typeTotal: number = 0;
  public sectionTotal: number = 0;
  public diagnosticTotal: number = 0;
  public adasTotal: number = 0;
  public reportItems: any = [];
  public typeItems: any = [];
  public sectionItems: any = [];
  public diagnosticItems: any = [];
  public adasItems: any = [];
  public recallItems: any = [];
  public reportFilterOptions: any = {};
  public typeFilterOptions: any = {};
  public sectionFilterOptions: any = {};
  public diagFilterOptions: any = {};
  public adasFilterOptions: any = {};
  public ckeEvent: any;
  public recallHeight: any = 330;

  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public successModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
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

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private apiUrl: ApiService,
    private commonApi: CommonService,
    private LandingpagewidgetsAPI: LandingpageService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    celement: ElementRef,
    crenderer: Renderer2
  ) {
    config.backdrop = true;
    config.keyboard = true;
    config.size = 'dialog-top';
  }


  // convenience getters for easy access to form fields
  get rf() { return this.reportForm.controls; }
  get sf() { return this.sectionForm.controls; }
  get cf() { return this.contentForm.controls; }
  get df() { return this.diagnosticForm.controls; }
  get dif() { return this.diagnosticInfoForm.controls; }
  get v() { return this.vehicleForm.controls; }
  get acf() { return this.adasContentForm.controls; }
  get acnf() { return this.adasContentNotesForm.controls; }
  get rcf() { return this.recallForm.controls; }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.bodyHeight = window.innerHeight;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.apikey = this.apiInfo.apiKey;
    this.domainId = this.apiInfo.domainId;
    this.userId = this.apiInfo.userId;
    this.roleId = this.apiInfo.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.industryType = this.industryType = this.commonApi.getIndustryType();
    console.log(this.industryType);
    this.defaultData();    
  }

  // Default Data
  defaultData() {
    let wsInfo:any = localStorage.getItem('report-ws');
    this.wsId = (wsInfo) ? [parseInt(wsInfo)] : [];
    console.log(this.wsId)
    this.getYearsList();
    this.getWorkstreamList();
    this.getMfgList();
    setTimeout(() => {
      let accessLevels = this.authenticationService.checkAccessItems;
      if(accessLevels.length > 0) {
        let reportAccess = accessLevels[0].pageAccess;
        reportAccess.forEach(item => {
          let accessId = parseInt(item.id);
          let roles = item.roles;
          let roleIndex = roles.findIndex(option => option.id == this.roleId);
          let roleAccess = roles[roleIndex].access;
          console.log(accessId, roleAccess)
          switch (accessId) {
            case 1:
              this.viewAccess = (roleAccess == 1) ? true : false;
              break;
            case 2:
              this.createAccess = (roleAccess == 1) ? true : false;
              break;
            case 3:
              this.editAccess = (roleAccess == 1) ? true : false;
              break;
            case 4:
              this.deleteAccess = (roleAccess == 1) ? true : false;
              break;
          }
        });
      }  
    }, 1000);
  }

  // Get Workstream Lists
  getWorkstreamList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apikey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('type', '1');
    this.LandingpagewidgetsAPI.getWorkstreamLists(apiFormData).subscribe((response) => {
      let wsItems = response.items;
      wsItems = wsItems.sort((a, b) => { return a.name < b.name ? -1 : 1 });
      let wsId;
      let wsName = '';
      wsItems.forEach((item, index) => {
        let cwsId = parseInt(item.id)
        if(index == 0) {
          wsId = cwsId;
          wsName = (this.wsId.length == 0) ? item.name : '';
        }
        if(this.wsId.length > 0 && this.wsId[0] == cwsId) {
          wsName = item.name;
        }
        this.workstreamItems.push({
          id: cwsId,
          name: item.name
        });
      });
      this.wsId = (this.wsId.length == 0) ? [wsId] : this.wsId;
      this.wsName = wsName;
      let data = {
        action: 'new',
        reportId: 0,
        reportType: null,
        workstreamId: 0,
        mfgName: null,
        reportName: '',
        isMfg: 0,      
        logo: null
      }
      this.createForm('report', data);  
      let rdata = {view: 0, filterOptions: this.reportFilterOptions};
      this.setScreenHeight();
      this.reportComponentRef.emit(this);
      setTimeout(() => {
        this.makeLoader = true;
        this.getMakeList();
        this.getReportList('report', rdata);
        setTimeout(() => {
          this.initAction = false;
        }, 2000);
        localStorage.removeItem('report-ws');
      }, 500);
    });
  }

  // Get Mfg List
  getMfgList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apikey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('makeName', '');
    this.LandingpagewidgetsAPI.getMfgList(apiFormData).subscribe((response) => {
      let mfgList = response.items;
      //this.mfgItems = response.items;
      mfgList.forEach(item => {
        let optionName = (item.alterMfgId == 0) ? item.originalName : item.name;
        item.mfgName = optionName;
      });
      this.mfgItems = mfgList;
      console.log(this.mfgItems)
    });
  }

  // Get Make List
  getMakeList() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('workstreamsList', JSON.stringify(this.wsId));
    this.LandingpagewidgetsAPI.getProductMakeListsAPI(apiFormData).subscribe((response) => {
      this.makeLoader = false;
      this.makeItems = [];
      if (response.status == 'Success') {
        const resultData = response.modelData;
        resultData.forEach(item => {
          this.makeItems.push({
            id: parseInt(item.id),
            name: item.makeName
          });
        });
      }
    });
  }

  getMakeModelList(makeName, access = '') {
    this.modelLoader = true;
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
    this.LandingpagewidgetsAPI.getMakeModelsList(apiInfo).subscribe((response) => {
      this.modelLoader = false;
      if (response.status == 'Success') {
        const resultData = response.modelData;
        resultData.forEach(item => {
          this.modelItems.push({
            id: item.model,
            name: item.model
          });
        });
        if(access == 'vin') {
          this.makeLoader = false;
          this.yearLoader = false;
          this.recallForm.patchValue({
            make: this.vinData?.make,
            model: this.vinData?.model,
            year: this.vinData?.year,
          });
          this.checkVehicleInfo();
          setTimeout(() => {
            if(this.recallButtonFlag) {
              this.recallLoader = this.recallButtonFlag;
              this.getRecallItems();
            }
          }, 100);
        }        
      }
    });
  }

  // Get Report List
  getReportList(type, itemData:any = [], listAction = '') {
    console.log(type, itemData, this.diagnosticOffset)
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    let actionType;
    let searchApi = (this.searchVal != '' && this.searchFlag) ? this.searchFlag : false;
    if(searchApi) {
      let filters = {
        domainId: this.domainId,
        reportId: itemData.reportId,
        typeId: itemData.reportTypeId,
        reportWorsktream: this.seletedWs
      }
      let ilimit = (this.diagnosticFlag) ? this.diagnosticLimit : this.sectionLimit;
      let ioffset = (this.diagnosticFlag) ? this.diagnosticOffset : this.sectionOffset;
      let searchData = {
        filters: filters,
        query: this.searchVal,
        rows: (itemData.limit) ? itemData.limit : ilimit,
        start: (itemData.offset) ? itemData.offset : ioffset
      }
      this.LandingpagewidgetsAPI.getSolrSearchReport(searchData).subscribe((response) => {
        console.log(type, response);
        actionType = 'search';
        let setupFlag = true;
        if(this.quickSearchFlag) {
          this.reportSearchEmpty = (response.data.total == 0) ? true : false;
          this.reportItems = response.data.facets.reportDetails;
          this.reportInfo = (this.reportItems.length > 0) ? this.reportItems[0] : this.reportItems;
          this.reportTotal = 1;
          this.typeItems = response.data.facets.typeDetails;
          this.typeInfo = (this.typeItems.length > 0) ? this.typeItems[0] : this.typeItems;
          this.typeTotal = 1;
          console.log(this.reportInfo);
          console.log(this.typeInfo);
        }
        switch (type) {
          case 'report':
            response.data.items = response.data.facets.reportDetails;
            response.data.total = response.data.facets.reportDetails.length;
            break;
          case 'type':
            response.data.items = response.data.facets.typeDetails.filter(option => option.reportId == this.reportInfo.id);
            response.data.total = response.data.facets.typeDetails.length;
            break;
        }
        if(setupFlag) {
          this.reportSearchEmpty = (response.data.total == 0) ? true : false;
          this.setupReportList(actionType, response, type, itemData, listAction);
        }
      });
    } else {
      this.reportSearchEmpty = false;
      actionType = 'report';
      const apiFormData = new FormData();
      apiFormData.append('apikey', this.apikey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('filters', itemData.filterOptions);
      switch(type) {
        case 'report':
          apiFormData.append('wsId', JSON.stringify(this.wsId));
          apiFormData.append('limit', this.reportLimit);
          apiFormData.append('offset', this.reportOffset);
          apiFormData.append('view', itemData.view);
          break;
        case 'type':
          apiFormData.append('limit', this.typeLimit);
          apiFormData.append('offset', this.typeOffset);
          apiFormData.append('view', itemData.view);
          apiFormData.append('reportId', itemData.reportId);
          break;
        case 'section':
          apiFormData.append('limit', this.sectionLimit);
          apiFormData.append('offset', this.sectionOffset);
          apiFormData.append('view', itemData.view);
          apiFormData.append('reportId', itemData.reportId);
          apiFormData.append('reportTypeId', itemData.reportTypeId);
          apiFormData.append('reportContentTypeId', itemData.reportContentTypeId);
          break;
        case 'diagnostic':
        case 'adas':  
          let doffset, dlimit;
          if(type == 'diagnostic') {
            doffset = (listAction == 'reload') ? itemData.offset : this.diagnosticOffset;
            dlimit = (listAction == 'reload') ? itemData.limit : this.diagnosticLimit;
            this.diagnosticOffset = (listAction == 'reload') ? itemData.limit : this.diagnosticOffset;
          } else {
            doffset = (listAction == 'reload') ? itemData.offset : this.adasOffset;
            dlimit = (listAction == 'reload') ? itemData.limit : this.adasLimit;
            this.adasOffset = (listAction == 'reload') ? itemData.limit : this.adasOffset;
          }
          apiFormData.append('limit', dlimit);
          apiFormData.append('offset', doffset);
          apiFormData.append('view', itemData.view);
          apiFormData.append('reportId', itemData.reportId);
          apiFormData.append('reportTypeId', itemData.reportTypeId);
          apiFormData.append('reportContentTypeId', itemData.reportContentTypeId);
          break;  
      }
      this.LandingpagewidgetsAPI.getStandardReportlistsAPI(apiFormData).subscribe((response) => {
        console.log(response)
        this.setupReportList(actionType, response, type, itemData, listAction);
      });
    }
  }

  createForm(action, data: any = []) {
    this.existError = "";
    this.resetForm();
    switch(action) {
      case 'report':
        console.log(data)
        this.reportForm = this.formBuilder.group({
          action: [data.action],
          reportId: [data.reportId],
          reportType: [data.reportType, [Validators.required]],
          workstreamId: [data.workstreamId, [Validators.required]],
          mfgName: [data.mfgName, [Validators.required]],
          mfgAltName: [data.mfgAltName],
          reportName: [data.reportName],
          mfgId: [data.mfgId],
          isMfg: [data.isMfg],
          isAltMfg: [data.isMfg],
          logo: [data.logo]
        });
        if(data.action == 'edit') {
          if(data.mfgId == 0) {
            this.updateValidators(this.reportForm, "reportName", "init");
            this.updateValidators(this.reportForm, "mfgName", "remove");
          } else {
            this.updateValidators(this.reportForm, "mfgName", "init");
            this.updateValidators(this.reportForm, "reportName", "remove");
          }
        }
        break;
      case 'section':
        this.sectionForm = this.formBuilder.group({
          action: data.action,
          sectionId: data.sectionId,
          typeId: data.typeId,
          title: [data.title, [Validators.required]],
          desc: [data.desc],
        });
        break;
      case 'content':
        this.contentForm = this.formBuilder.group({
          action: data.action,
          sectionId: data.sectionId,
          contentId: data.contentId,
          desc: [data.desc, [Validators.required]],
        });
        break;
      case 'diagnostic':
        console.log(data)
        this.diagnosticForm = this.formBuilder.group({
          action: data.action,
          moduleId: data.moduleId,
          typeId: data.typeId,
          moduleName: [data.moduleName, [Validators.required]],
          moduleSlug: data.moduleSlug,
          moduleDesc: data.moduleDesc,
        });
        break;
      case 'diagnosticInfo':
        console.log(data)
        this.diagnosticInfoForm = this.formBuilder.group({
          action: data.action,
          moduleId: data.moduleId,
          infoId: data.infoId,
          dtcId: data.dtcId,
          dtcCode: [data.dtcCode, [Validators.required]],
          dtcDesc: [data.dtcDesc, [Validators.required]],
          desc: data.desc
        });
        break;
      case 'vehicle':
        console.log(data)
        this.modelVal = data.model;
        this.modelItems = [];
        this.vehicleForm = this.formBuilder.group({
          action: data.action,
          adasId: data.adasId,
          typeId: data.typeId,
          make: [data.make, [Validators.required]],
          model: [data.model, [Validators.required]],
          year: [data.year, [Validators.required]]
        });
        break;
      case 'recall':
        console.log(data);
        this.recallForm = this.formBuilder.group({
          vin: [data.vin, [Validators.maxLength(17)]],
          make: [data.make, [Validators.required]],
          model: [data.model, [Validators.required]],
          year: [data.year, [Validators.required]]
        });
        break;
    }
  }

  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 50);
  }

  // Breadcrumb
  breadcrumb(action) {
    console.log(this.wsId)
    this.reportFlag = false;
    this.typeFlag = false;
    this.sectionFlag = false;
    this.diagnosticFlag = false;
    this.adasFlag = false;
    this.recallFlag = false;
    let apiCall, apiType, itemData;
    switch(action) {
      case 'report':
        this.updateLayout();
        this.reportFlag = true;
        apiCall = (this.reportSearchEmpty) ? false : this.reportInfo.callback;
        console.log(apiCall)
        this.recallItems = [];
        this.recallButtonFlag = false;
        this.recallEmpty = true;
        this.recallItemEmpty = false;
        this.vinData = [];
        this.modelItems = [];
        if(apiCall) {
          apiType = 'report';
          this.reportTotal = 0;
          this.reportOffset = 0;
          this.reportItems = [];
          itemData = {
            view: 0,
            filterOptions: this.reportFilterOptions,
            limit: this.reportLimit,
            offset: this.reportOffset
          };
        } else {
          this.updateLayout();
          this.callback.emit(this);
        }
        this.clearFields();
        break;
      case 'type':
        this.typeFlag = true;
        apiCall = (this.reportSearchEmpty) ? false : this.typeInfo.callback;
        if(apiCall) {
          apiType = 'type';
          this.typeTotal = 0;
          this.typeOffset = 0;
          this.typeItems = [];
          itemData = {
            reportId: this.reportInfo.id,
            view: 1,
            filterOptions: this.typeFilterOptions,
            limit: this.typeLimit,
            offset: this.typeOffset
          };
        } else {
          this.callback.emit(this);
        }        
        break;
    }
    if(apiCall) {
      this.getReportList(apiType, itemData);
    }
  }

  // Section Navigation
  sectionNav(action, item) {
    console.log(action, item)
    const data = {};
    this.reportFlag = false;
    this.typeFlag = false;
    this.sectionFlag = false;
    this.diagnosticFlag = false;
    this.adasFlag = false;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollTop = 0;
    this.scrollCallback = true
    this.reportOffset = 0;
    this.sectionOffset = 0;
    this.diagnosticOffset = 0;
    this.adasOffset = 0;
    let apiCall = true;
    let reportFilterFields:any = [];
    switch(action) {
      case 'type':
        this.typeFlag = true;
        this.reportInfo = {
          id: item.id,
          name: item.name,
          callback: (this.searchFlag && this.searchVal != '') ? true : false
        };
        data['reportId'] = item.id;
        data['view'] = 1;
        data['filterOptions'] = this.typeFilterOptions;
        this.typeItems = [];
        this.sectionItems = [];
        this.diagnosticItems = [];
        if(this.searchFlag && this.searchVal != '') {
          this.typeOffset = 0;
          this.typeTotal = 0;          
          data['limit'] = this.typeLimit;
          data['offset'] = this.typeOffset;
        }
        break;
      case 'section':
        if(item.isActive) {
          this.sectionFlag = true;
          this.typeInfo = {
            id: item.id,
            rcId: item.rcId,
            name: item.name,
            callback: (this.searchFlag && this.searchVal != '') ? true : false
          };
          this.sectionItems = [];
          data['reportId'] = item.reportId;
          data['reportTypeId'] = item.id;
          data['reportContentTypeId'] = item.rcId;
          data['view'] = 2; 
          data['filterOptions'] = this.sectionFilterOptions;
          if(this.searchFlag && this.searchVal != '') {
            this.sectionOffset = 0;
            this.sectionTotal = 0;
            data['limit'] = this.sectionLimit;
            data['offset'] = this.sectionOffset;
          }
        }
        break;
      case 'diagnostic':
        if(item.isActive) {
          this.diagnosticFlag = true;
          this.typeInfo = {
            id: item.id,
            rcId: item.rcId,
            name: item.name,
            callback: (this.searchFlag && this.searchVal != '') ? true : false
          };
          this.diagnosticItems = [];
          data['reportId'] = item.reportId;
          data['reportTypeId'] = item.id;
          data['reportContentTypeId'] = item.rcId;
          data['view'] = 2;
          data['filterOptions'] = this.diagFilterOptions;
          if(this.searchFlag && this.searchVal != '') {
            this.diagnosticOffset = 0;
            this.diagnosticTotal = 0;
            data['limit'] = this.diagnosticLimit;
            data['offset'] = this.diagnosticOffset;
          }
        }
        break;
      case 'adas':
        if(item.isActive) {
          this.adasFlag = true;
          this.typeInfo = {
            id: item.id,
            rcId: item.rcId,
            name: item.name,
            callback: (this.searchFlag && this.searchVal != '') ? true : false
          };
          console.log(this.typeInfo)
          let filter = localStorage.getItem(filterNames.reportAdas);
          console.log(filter)
          if(!filter) {
            reportFilterFields = localStorage.getItem(filterFields.reportAdas);
            reportFilterFields = (reportFilterFields) ? JSON.parse(reportFilterFields) : [];
            reportFilterFields.forEach((item, index) => {
              let name = item.name;
              let selection = item.selection;
              let val:any = (selection == 'single') ? '' : [];
              this.adasFilterOptions[name] = val;
            });
            localStorage.setItem(filterNames.reportAdas, JSON.stringify(this.adasFilterOptions));
          } else {
            this.adasFilterOptions = filter;
            console.log(this.adasFilterOptions);
          }
          this.adasItems = [];
          data['reportId'] = item.reportId;
          data['reportTypeId'] = item.id;
          data['reportContentTypeId'] = item.rcId;
          data['view'] = 2;
          data['filterOptions'] = this.adasFilterOptions;
          if(this.searchFlag && this.searchVal != '') {
            this.sectionOffset = 0;
            this.sectionTotal = 0;
            data['limit'] = this.adasLimit;
            data['offset'] = this.adasOffset;
          }
        }
        break;
      case 'recall':
        apiCall = false;
        this.recallFlag = true;
        this.typeInfo = {
          id: item.id,
          rcId: item.rcId,
          name: item.name,
          callback: (this.searchFlag && this.searchVal != '') ? true : false
        };
        let rcdata = {
          action: 'new',
          vin: '',
          make: '',
          model: '',
          year: ''
        }
        if(this.recallItems.length == 0) {
          this.makeLoader = true;
          this.getMakeList();
          this.createForm('recall', rcdata);
        }
        this.callback.emit(this);
        console.log(this.typeInfo)
        break;  
    }
    if(apiCall) {
      this.loading = true;
      this.getReportList(action, data);
    }
  }

  secDrop(event: CdkDragDrop<string[]>) {
    console.log(event);
  }

  addReport(raction = '', item:any = '') {
    console.log(item, this.mfgItems, this.wsId, this.seletedWs)
    this.reportFieldVisible = (raction == '') ? false : this.reportFieldVisible;
    let workstreamId = 0;
    this.wsId.forEach(wsItem => {
      workstreamId = parseInt(wsItem);
    });
    let action = 'report';
    let reportType = (raction == '') ? null : item.reportType;
    let data = {
      action: (raction == '') ? 'new' : 'edit',
      reportId: (raction == '') ? 0 : item.id, 
      reportType,
      workstreamId: (raction == '') ? workstreamId : item.workstreams,
      mfgName: (raction == '' || (item.mfgName == null && item.isMfg == 0)) ? null : item.mfgName,
      mfgAltName: (raction == '') ? null : item.mfgAltName,
      reportName: (raction == '') ? '' : item.reportName,
      isMfg: (raction == '') ? 0 : item.isMfg,
      isAltMfg: (raction == '') ? 0 : item.isAltMfg,
      mfgId: (raction == '') ? 0 : item.mfgId,
      logo: (raction == '') ? '' : item.logo
    }
    this.createForm(action, data);
    let actionTxt:any = (raction == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
    this.manageTitle = `${actionTxt} ${ManageTitle.standardReport}`;
    this.manageAction = action;
    //this.alternateMfgFieldDisabled = (raction == '') ? true : this.alternateMfgFieldDisabled;
    this.customReportFlag = (reportType == null || reportType == 2) ? false : true;
    this.mfgReportFlag = (reportType == null || reportType == 1) ? false : true;
    this.formValid = false;
    this.displayModal = true;
    this.reportFormFlag = true;
    this.sectionFormFlag = false;
    this.diagnosticFormFlag = false;
    this.vehicleFormFlag = false;
  }

  addSection(typeId, saction = '', itemData:any = '') {
    let action = 'section';
    let data = {
      action: (saction == '') ? 'new' : 'edit',
      sectionId: (saction == '') ? 0 : itemData.sectionId, 
      typeId: typeId,
      title: (saction == '') ? '' : itemData.title,
      desc: (saction == '') ? '' : itemData.desc
    }
    this.createForm(action, data);
    let actionTxt:any = (saction == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
    this.manageTitle = `${actionTxt} ${ManageTitle.reportSec}`;
    this.manageAction = action;
    this.sectionExist = false;
    this.displayModal = true;
    this.reportFormFlag = false;
    this.sectionFormFlag = true;
    this.diagnosticFormFlag = false;
    this.vehicleFormFlag = false;
  }

  addCont(index, item, caction = '', citem: any = '') {
    let saction = (caction == '') ? 'new' : 'edit';
    let actionFlag = (saction == 'edit') ? true : false;
    let timeout = (saction == 'edit') ? 0 : 500;
   
   
    this.authenticationService.checkAccess(this.contentTypeId, 'Create',true,true);
    setTimeout(() => {
      actionFlag = this.checkReportAccess();
      if(actionFlag) {
        this.sindex = index;
        const id = item.id;
        console.log(this.sindex, id, citem)
        let action = 'content';
        let data = {
          action: saction,
          sectionId: item.id, 
          contentId: (caction == '') ? 0 : citem.contentId,
          desc: (caction == '') ? '' : citem.desc
        }    
        setTimeout(() => {
          this.directiveRef.update();  
        }, 100);    
        item.formFlag = true;
        this.createForm(action, data);
        let actionTxt:any = (caction == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
        this.manageTitle = `${actionTxt} ${ManageTitle.secCont}`;
        this.manageAction = action;
        this.onTabOpen('section', item, index);
        this.sectionItems.forEach(sitem => {
          if(sitem.id != id) {
            sitem.addMoreFlag = false;
            //sitem.isSelected = false;
          } else {
            sitem.isSelected = true;
          }
        });
        let element = `cform-${this.sindex}`;
        setTimeout(() => {
          this.scrollToElem(element);
        }, 500);
      }
    }, timeout);
  }

  addDiagnostic(typeId, daction = '', itemData:any = '') {
    let action = 'diagnostic';
    let data = {
      action: (daction == '') ? 'new' : 'edit',
      moduleId: (daction == '') ? 0 : itemData.id, 
      typeId: typeId,
      moduleName: (daction == '') ? '' : itemData.moduleName,
      moduleDesc: (daction == '') ? '' : itemData.moduleDesc,
      moduleSlug: (daction == '') ? '' : itemData.moduleSlug,
    }
    this.createForm(action, data);
    let actionTxt:any = (daction == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
    this.manageTitle = `${actionTxt} ${ManageTitle.reportModule}`;
    this.manageAction = action;
    this.moduleExist = false;
    this.displayModal = true;
    this.reportFormFlag = false;
    this.sectionFormFlag = false;
    this.diagnosticFormFlag = true;
    this.vehicleFormFlag = false;
  }

  addDiagnosticInfo(index, item, daction = '', ditem: any = '') {
    let diAction = (daction == '') ? 'new' : 'edit';
    let actionFlag = (diAction == 'edit') ? true : false;
    let timeout = (diAction == 'edit') ? 0 : 500;
    this.authenticationService.checkAccess(this.contentTypeId, 'Create',true,true);
    setTimeout(() => {
      actionFlag = this.checkReportAccess();
      if(actionFlag) {
        this.sindex = index;
        const id = item.id;
        console.log(this.sindex, id, item, ditem)
        let action = 'diagnosticInfo';
        let data = {
          action: diAction,
          moduleId: item.id,
          infoId: (daction == '') ? 0 : ditem.infoId, 
          dtcId: (daction == '') ? 0 : ditem.dtcId,
          dtcCode: (daction == '') ? '' : ditem.dtcCode,
          dtcDesc: (daction == '') ? '' : ditem.dtcDesc,
          desc: (daction == '') ? '' : ditem.desc
        }  
        this.existError = "";
        this.dtcCodeExist = false;
        item.formFlag = true;
        setTimeout(() => {
          this.directiveRef.update();  
        }, 100);
        this.createForm(action, data);
        let actionTxt:any = (daction == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
        this.manageTitle = `${actionTxt} ${ManageTitle.diagnosticInfo}`;
        this.manageAction = action;
        this.diagnosticItems.forEach(sitem => {
          if(sitem.id != id) {
            sitem.addMoreFlag = false;
            //sitem.isSelected = false;
          } else {
            sitem.addMoreFlag = false;
            sitem.isSelected = true;
          }
        });
        let element = `dform-${this.sindex}`;
        setTimeout(() => {
          this.scrollToElem(element);
        }, 500);
      }
    }, timeout);
  }

  addVehicle(typeId, daction = '', itemData:any = '') {
    let action = 'vehicle';
    let data = {
      action: (daction == '') ? 'new' : 'edit',
      adasId: (daction == '') ? 0 : itemData.id, 
      typeId: typeId,
      make: (daction == '') ? '' : itemData.make,
      model: (daction == '') ? '' : itemData.model,
      year: (daction == '') ? '' : parseInt(itemData.year),
    }
    this.createForm(action, data);
    let actionTxt:any = (daction == '') ? ManageTitle.actionNew : ManageTitle.actionEdit;
    this.manageTitle = `${actionTxt} ${ManageTitle.reportVehicle}`;
    this.manageAction = action;
    this.vehicleExist = false;
    this.displayModal = true;
    this.reportFormFlag = false;
    this.sectionFormFlag = false;
    this.diagnosticFormFlag = false;
    this.vehicleFormFlag = true;
  }

  saveData(saction = '') {
    console.log(saction)
    this.submitFlag = (saction == 'check') ? true : false; 
    setTimeout(() => {
      if(this.checkFlag) {
        this.reportExist = this.submitFlag;
      } else {
        this.reportExist = false;
      }
    }, 100);
    
    let action = this.manageAction;
    if(this.formValid) {
      return;
    }
    console.log(action)
    switch(action) {
      case 'report':
        this.reportFormSubmit = true;
        for (const i in this.reportForm.controls) {
          this.reportForm.controls[i].markAsDirty();
          this.reportForm.controls[i].updateValueAndValidity();
          console.log(i, this.reportForm.controls[i], this.reportForm.controls[i].value)
        }
        console.log(this.reportForm, this.reportExist);
        const rformObj = this.reportForm.value;
        if (this.reportForm.valid && !this.reportExist) {
          console.log(123)
          this.formValid = true;
          rformObj.isAltMfg = (rformObj.mfgAltName != null) ? 1 : rformObj.isAltMfg;
          let altMfgAction = '';
          if(rformObj.action == 'edit' && rformObj.mfgId == 0) {
            this.reportForm.patchValue({
              isMfg: 0,
              isAltMfg: 0,
              mfgId: 0,
              mfgName: null,
              mfgAltName: null
            });
          }
          let wsId = rformObj.workstreamId;
          const apiInfo = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: rformObj.action,
            type: action,
            workstreamId: JSON.stringify([wsId]),
            reportName: (rformObj.mfgName == null) ? rformObj.reportName : rformObj.mfgName,
            isMfg: (rformObj.mfgName == null) ? 0 : 1,
            isAltMfg: rformObj.isAltMfg,
            logo: ((rformObj.action == 'edit' && rformObj.mfgName == null) || rformObj.logo == null) ? '' : rformObj.logo
          }
          if(rformObj.action != '' && rformObj.isAltMfg == 1 && (rformObj.mfgAltName != null || rformObj.mfgAltName == null)) {
            apiInfo.reportName = rformObj.mfgAltName;
            let mfi = this.mfgItems.findIndex(option => option.id == rformObj.mfgId);
            console.log(mfi)
            if(mfi >= 0) {
              apiInfo['amfgId'] = this.mfgItems[mfi].alterMfgId;
              apiInfo['mfgId'] = this.mfgItems[mfi].id;
              altMfgAction = (this.mfgItems[mfi].alterMfgId > 0) ? 'edit' : 'new';
              console.log(this.mfgItems[mfi], rformObj)
              if(this.mfgItems[mfi].alterMfgId > 0 && rformObj.mfgAltName == null) {
                altMfgAction = 'delete';
                apiInfo['reportName'] = this.mfgItems[mfi].originalName;
              }               
            }              
          }
          apiInfo['altMfgAction'] = altMfgAction;
          if(rformObj.action == 'edit') {
            apiInfo['reportId'] = rformObj.reportId;
            if(rformObj.isMfg == 1 && rformObj.mfgAltName == null) {
              apiInfo['reportName'] = rformObj.mfgName;
            }
          }
          console.log(apiInfo)
          this.reportAction(action, apiInfo, wsId);
        }
        break;
      case 'section':
        this.sectionFormSubmit = true;
        for (const i in this.sectionForm.controls) {
          this.sectionForm.controls[i].markAsDirty();
          this.sectionForm.controls[i].updateValueAndValidity();
        }
        const sformObj = this.sectionForm.value;
        if (this.sectionForm.valid && !this.sectionExist) {
          this.formValid = true;
          console.log(sformObj)
          const apiInfo = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: sformObj.action,
            type: action,
            typeId: sformObj.typeId,
            title: sformObj.title,
            desc: sformObj.desc
          }
          if(sformObj.action == 'edit') {
            apiInfo['sectionId'] = sformObj.sectionId;
          }
          //console.log(sformObj.typeId, this.typeItems);
          this.reportAction(action, apiInfo);
        }
        break;  
      case 'content':
        this.contentFormSubmit = true;
        for (const i in this.contentForm.controls) {
          this.contentForm.controls[i].markAsDirty();
          this.contentForm.controls[i].updateValueAndValidity();
        }
        const cformObj = this.contentForm.value;
        if (this.contentForm.valid) {
          this.formValid = true;
          console.log(cformObj)
          const apiInfo = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: cformObj.action,
            type: action,
            sectionId: cformObj.sectionId,
            desc: cformObj.desc
          }
          if(cformObj.action == 'edit') {
            apiInfo['contentId'] = cformObj.contentId;
          }
          console.log(apiInfo)
          this.reportAction(action, apiInfo);
        }
        break;
      case 'diagnostic':
        this.diagnosticFormSubmit = true;
        for (const i in this.diagnosticForm.controls) {
          this.diagnosticForm.controls[i].markAsDirty();
          this.diagnosticForm.controls[i].updateValueAndValidity();
        }
        const dgformObj = this.diagnosticForm.value;
        if (this.diagnosticForm.valid && !this.moduleExist) {
          this.formValid = true;
          console.log(dgformObj)
          const apiInfo = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: dgformObj.action,
            type: 'module',
            typeId: dgformObj.typeId,
            moduleName: dgformObj.moduleName,
            moduleSlug: dgformObj.moduleSlug,
            desc: dgformObj.moduleDesc
          }
          if(dgformObj.action == 'edit') {
            apiInfo['moduleId'] = dgformObj.moduleId;
          }
          this.reportAction(action, apiInfo);
        }
        break;  
      case 'diagnosticInfo':
        this.diagnosticInfoFormSubmit = true;
        for (const i in this.diagnosticInfoForm.controls) {
          this.diagnosticInfoForm.controls[i].markAsDirty();
          this.diagnosticInfoForm.controls[i].updateValueAndValidity();
        }
        const dformObj = this.diagnosticInfoForm.value;
        if (this.diagnosticInfoForm.valid && !this.dtcCodeExist) {
          this.formValid = true;
          console.log(dformObj)
          const apiInfo = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: dformObj.action,
            type: 'moduleInfo',
            moduleId: dformObj.moduleId,
            dtcCode: dformObj.dtcCode,
            dtcDesc: dformObj.dtcDesc,
            desc: dformObj.desc
          }
          if(dformObj.action == 'edit') {
            apiInfo['moduleInfoId'] = dformObj.infoId;
            apiInfo['dtcId'] = dformObj.dtcId;
          }
          this.reportAction(action, apiInfo);
        }
        break;
      case 'vehicle':
        this.vehicleFormSubmit = true;
        console.log(this.vehicleForm);
        for (const v in this.vehicleForm.controls) {
          this.vehicleForm.controls[v].markAsDirty();
          this.vehicleForm.controls[v].updateValueAndValidity();
        }
        const vformObj = this.vehicleForm.value;
        if (this.vehicleForm.valid && !this.vehicleExist) {
          this.formValid = true;
          console.log(vformObj)
          const apiInfo = {
            apikey: this.apikey,
            domainId: this.domainId,
            userId: this.userId,
            action: vformObj.action,
            type: 'adas-calibration',
            typeId: vformObj.typeId,
            make: vformObj.make,
            model: vformObj.model,
            year: vformObj.year.toString()
          }
          if(vformObj.action == 'edit') {
            apiInfo['adasId'] = vformObj.adasId;
          }
          //console.log(sformObj.typeId, this.typeItems);
          this.reportAction(action, apiInfo);
        }
        break;
    }
  }

  reportAction(action, apiInfo, workstreamId = 0) {
    let currWs = this.wsId[0];
    console.log(apiInfo, this.seletedWs, currWs, workstreamId);
    this.LandingpagewidgetsAPI.manageReportAPI(apiInfo).subscribe((response) => {
      let solrUpdate = {
        domainId: this.domainId,
        userId: this.userId
      };
      let solrFlag = this.solrFlag;
      let data = response.data;
      let msg = response.message;
      let timeout = 300;
      let popupFlag = false;
      console.log(data)
      switch (action) {
        case 'report':
          switch(apiInfo.action) {
            case 'new':
              popupFlag = true;
              solrFlag = false;
              if(this.seletedWs == workstreamId) {
                this.reportTotal += 1;
                this.reportItems.push(data);
                this.reportItemEmpty = (this.reportItemEmpty) ? false : this.reportItemEmpty;
                setTimeout(() => {
                  this.masonry.reloadItems();
                  this.masonry.layout();
                  this.updateMasonryLayout = true;            
                }, 0);
              }
              break;
            case 'edit':
              popupFlag = true;
              let rindex = this.reportItems.findIndex(option => option.id == apiInfo.reportId);
              if(this.seletedWs == workstreamId) {
                solrUpdate['action'] = "edit-report";
                solrUpdate['reportId'] = apiInfo.reportId;
                solrUpdate['valueDict'] = {'reportName': data.name};
                this.reportItems[rindex] = data;
                timeout = 500;
                setTimeout(() => {
                  //this.masonry.reloadItems();
                  this.masonry.layout();
                  this.updateMasonryLayout = true;            
                }, timeout);
              } else {
                solrFlag = false;
                this.reportTotal -= 1;
                this.reportItems.splice(rindex, 1);
              }              
              break;  
          }
          if(apiInfo.isAltMfg == 1) {
            let mfi = this.mfgItems.findIndex(option => option.id == apiInfo.mfgId);
            if(mfi >= 0) {
              this.mfgItems[mfi].alterMfgId = data.altMfgId;
              this.mfgItems[mfi].name = data.name;
              this.mfgItems[mfi].mfgName = data.name;
            }
            if(apiInfo.altMfgAction == 'edit') {
              let udata = {
                apikey: this.apikey,
                domainId: this.domainId
              }
              this.LandingpagewidgetsAPI.updateMfgName(udata).subscribe((response) => {
                console.log(response)
              });
            }
          }          
          setTimeout(() => {
            this.reportFieldDisabled = false;
            this.showClear = false;
            this.reportFormFlag = false;
          }, timeout)
          break;
        case 'section':
          this.sectionExist = false;
          solrUpdate['reportId'] = this.reportInfo.id;
          solrUpdate['typeId'] = data.typeId;
          solrUpdate['sectionId'] = data.id;
          solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
          solrUpdate['valueDict'] = {'title': data.title, 'desc': data.desc, 'realDesc': data.realDesc};
          switch(apiInfo.action) {
            case 'new':
              solrUpdate['action'] = 'create-section';
              this.sectionItems.push(data);
              this.sectionItemEmpty = (this.sectionItemEmpty) ? false : this.sectionItemEmpty;
              break;
            case 'edit':
              solrUpdate['action'] = 'edit-section';
              let sindex = this.sectionItems.findIndex(option => option.id == apiInfo.sectionId);
              this.sectionItems[sindex].title = data.title;
              this.sectionItems[sindex].desc = data.desc;
              break;  
          }
          setTimeout(() => {
            this.sectionFormFlag = false;
          }, 300);
          break;
        case 'content':
          solrUpdate['reportId'] = this.reportInfo.id;
          solrUpdate['typeId'] = data.typeId;
          solrUpdate['sectionId'] = data.sectionId;
          solrUpdate['contentId'] = data.id;
          solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
          solrUpdate['valueDict'] = {'content': data.content, 'realContent': data.realContent};
          let element = `add-more-${this.sindex}`;
          this.sectionItems[this.sindex].dataFlag = false;
          this.sectionItems[this.sindex].formFlag = false;
          switch(apiInfo.action) {
            case 'new':
              solrUpdate['action'] = 'create-content';
              solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
              this.sectionItems[this.sindex].contItems.push(data);
              let cbaseHeight = this.sectionItems[this.sindex].baseHeight;
              let contHeight = this.sectionItems[this.sindex].contHeight;
              this.sectionItems[this.sindex].contHeight = cbaseHeight+contHeight;
              break;
            case 'edit':
              solrUpdate['action'] = 'edit-content';
              let cindex = this.sectionItems[this.sindex].contItems.findIndex(option => option.id == data.id);
              this.sectionItems[this.sindex].contItems[cindex].content = data.content;
              break;  
          }          
          this.sectionItems.forEach(sitem => {
            sitem.addMoreFlag = true;
          });
          setTimeout(() => {
            this.sectionItems[this.sindex].dataFlag = true;
            this.scrollToElem(element);
          }, 100);
          setTimeout(() => {
            this.contFormFlag = false;
          }, 300);
          break;
        case 'diagnostic':
          solrUpdate['reportId'] = this.reportInfo.id;
          solrUpdate['typeId'] = data.typeId;
          solrUpdate['sectionId'] = data.id;
          solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
          this.moduleExist = false;
          switch(apiInfo.action) {
            case 'new':
              solrUpdate['action'] = 'create-section';
              solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
              this.diagnosticTotal += 1;
              this.diagnosticItems.push(data);
              this.diagnosticItemEmpty = (this.diagnosticItemEmpty) ? false : this.diagnosticItemEmpty;
              break;
            case 'edit':
              solrUpdate['action'] = 'edit-section';
              solrUpdate['valueDict'] = {'name': data.name, 'desc': data.desc};
              let dindex = this.diagnosticItems.findIndex(option => option.id == apiInfo.moduleId);
              this.diagnosticItems[dindex].name = data.name;
              this.diagnosticItems[dindex].slug = data.slug;
              this.diagnosticItems[dindex].desc = data.desc;
              break;  
          }          
          setTimeout(() => {
            this.sectionFormFlag = false;
          }, 300);
          break;  
        case 'diagnosticInfo':
          console.log(this.typeInfo)
          solrUpdate['reportId'] = this.reportInfo.id;
          solrUpdate['typeId'] = data.typeId;
          solrUpdate['sectionId'] = data.sectionId;
          solrUpdate['contentId'] = data.id;
          solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
          solrUpdate['valueDict'] = {'dtcCode': data.dtcCode, 'dtcDesc': data.dtcDesc, 'realDtcDesc': data.realDtcDesc, 'instruction': data.instruction, 'realInstruction': data.realInstruction};
          this.dtcCodeExist = false;
          let delement = `add-more-${this.sindex}`;
          this.diagnosticItems[this.sindex].dataFlag = false;
          this.diagnosticItems[this.sindex].formFlag = false;
          switch(apiInfo.action) {
            case 'new':
              solrUpdate['action'] = 'create-content';
              this.diagnosticItems[this.sindex].infoItems.push(data);
              let dbaseHeight = this.diagnosticItems[this.sindex].baseHeight;
              let dcontHeight = this.diagnosticItems[this.sindex].contHeight;
              this.diagnosticItems[this.sindex].contHeight = dbaseHeight+dcontHeight;
              break;
            case 'edit':
              solrUpdate['action'] = 'edit-content';
              let dfindex = this.diagnosticItems[this.sindex].infoItems.findIndex(option => option.id == data.id);
              console.log(this.diagnosticItems[this.sindex].infoItems[dfindex])
              this.diagnosticItems[this.sindex].infoItems[dfindex].dtcCode = data.dtcCode;
              this.diagnosticItems[this.sindex].infoItems[dfindex].dtcDesc = data.dtcDesc;
              this.diagnosticItems[this.sindex].infoItems[dfindex].instruction = data.instruction;
              break;  
          }          
          this.diagnosticItems.forEach(sitem => {
            sitem.addMoreFlag = true;
          });
          setTimeout(() => {
            this.diagnosticItems[this.sindex].dataFlag = true;
            this.scrollToElem(delement);
          }, 100);
          setTimeout(() => {
            this.diagnosticFormFlag = false;
          }, 300);
          break;
        case 'vehicle':
          this.vehicleExist = false;
          solrUpdate['reportId'] = this.reportInfo.id;
          solrUpdate['typeId'] = data.typeId;
          solrUpdate['sectionId'] = data.id;
          solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
          solrUpdate['valueDict'] = {'make': data.make, 'model': data.model, 'year': data.year};
          switch(apiInfo.action) {
            case 'new':
              solrUpdate['action'] = 'create-section';
              this.adasItems.push(data);
              this.adasTotal += 1;
              this.adasItemEmpty = (this.adasItemEmpty) ? false : this.adasItemEmpty;
              break;
            case 'edit':
              solrUpdate['action'] = 'edit-section';
              let aindex = this.adasItems.findIndex(option => option.id == apiInfo.sectionId);
              this.adasItems[aindex].make = data.make;
              this.adasItems[aindex].model = data.model;
              this.adasItems[aindex].year = data.year;
              break;  
          }
          setTimeout(() => {
            this.vehicleFormFlag = false;
          }, 300);
          break;
      }
      setTimeout(() => {
        this.directiveRef.update();
        this.formValid = false;
        this.displayModal = false;
        this.diagnosticFormSubmit = false;
        this.sindex = -1;
        if(popupFlag) {
          this.successPopup(msg);
        }
        console.log(solrUpdate, solrFlag)
        if(solrFlag) {
          this.solrUpdate(solrUpdate);          
        }
      }, timeout);
    });    
  }

   // Scroll to element
   scrollToElem(element) {
    const itemToScrollTo = document.getElementById(element);
    if (itemToScrollTo) {
      this.directiveRef.scrollTo(0, itemToScrollTo.offsetTop, 500);
      //itemToScrollTo.scrollIntoView(true);
    }
  }

  // Cancel Content Form
  cancelForm(type, item, index) {
    this.formValid = false;
    let element = `add-more-${index}`;
    switch(type) {
      case 'content':
        this.contentFormSubmit = false;
        item.formFlag = false;
        this.sectionItems.forEach(sitem => {
          sitem.addMoreFlag = true;
        });
        break;
      case 'diagnosticInfo':
        this.diagnosticInfoFormSubmit = false;
        item.formFlag = false;
        this.diagnosticItems.forEach(ditem => {
          ditem.addMoreFlag = true;
        });
        break;  
    }
    setTimeout(() => {
      this.directiveRef.update();  
    }, 100);
    setTimeout(() => {
      //this.scrollToElem(element);
    }, 500);
  }

  actionEdit(type, item, id) {
    this.authenticationService.checkAccess(this.contentTypeId, 'Edit',true,true);
    let actionFlag = false;
    setTimeout(() => {
      actionFlag = this.checkReportAccess();
      if(actionFlag) {
        console.log(item)
        let action = 'edit';
        switch(type) {
          case 'report':
            let wsId = JSON.parse(item.workstreamId);
            this.reportExist = false;
            let reportType = (item.isMfg == 0) ? 1 : 2;
            let rdata = {
              id: id,
              reportName: (item.isMfg == 0) ? item.name : '',
              mfgName: (item.isMfg == 1 && item.isAltMfg == 0) ? item.name : null,
              isMfg: item.isMfg,
              isAltMfg: item.isAltMfg,
              mfgAltName: null,
              mfgId: 0  ,
              reportType,
              logo: item.logoImg,
              workstreams: wsId[0]
            };
            //this.reportFieldDisabled = (item.isMfg == 0) ? false : true;
            //this.reportFieldVisible = (item.isMfg == 0) ? true : false;
            //this.alternateMfgFieldDisabled = (item.isMfg == 1) ? false : true;
            this.customReportFlag = (item.isMfg == 0) ? true : false;
            this.mfgReportFlag = (item.isMfg == 1) ? true : false; 
            console.log(this.alternateMfgFieldDisabled)
            this.showClear = (item.isMfg == 1) ? true : false;
            if(item.isMfg == 1) {
              let mfi;
              if(item.isAltMfg == 1) {
                mfi = this.mfgItems.findIndex(option => option.name == item.name);
                if(mfi >= 0) {
                  rdata.mfgName = this.mfgItems[mfi].mfgName;
                  rdata.mfgAltName = this.mfgItems[mfi].name;
                  rdata.mfgId = this.mfgItems[mfi].id;
                }
              } else {
                mfi = this.mfgItems.findIndex(option => option.originalName == item.name);
                if(mfi >= 0) {
                  rdata.mfgName = this.mfgItems[mfi].mfgName;
                  rdata.mfgId = this.mfgItems[mfi].id;
                }
              }
              this.updateValidators(this.reportForm, "mfgName", "init");
              this.updateValidators(this.reportForm, "reportName", "remove");          
            } else {
              this.updateValidators(this.reportForm, "reportName", "init");
              this.updateValidators(this.reportForm, "mfgName", "remove");
            }
            setTimeout(() => {
              this.addReport(action, rdata);  
            }, 500);          
            break;
          case 'section':
            this.sectionExist = false;
            let sdata = { 
              sectionId: item.id,
              typeId: item.typeId,
              title: item.title,
              desc: item.desc,
            };
            this.addSection(item.typeId, action, sdata);
            break;
          case 'content':
            let cdata = {
              sectionId: item.sectionId,
              contentId: item.id,
              desc: item.content
            };
            let sitem = this.sectionItems[id];
            this.addCont(id, sitem, action, cdata)
            break;
          case 'diagnostic':
            let diagnosticData = { 
              id: item.id,
              typeId: item.typeId,
              moduleName: item.name,
              moduleDesc: item.desc,
              moduleSlug: item.slug,
            };
            this.addDiagnostic(item.typeId, action, diagnosticData);
            break;
          case 'diagnosticInfo':
            let diagnosticInfoData = { 
              moduleId: item.moduleId,
              infoId: item.id,
              dtcId: item.dtcId,
              dtcCode: item.dtcCode,
              dtcDesc: item.dtcDesc,
              desc: item.instruction
            };
            let ditem = this.diagnosticItems[id];
            this.addDiagnosticInfo(id, ditem, action, diagnosticInfoData)
            break;
          case 'adas':
            let adasData = { 
              id: item.id,
              typeId: item.typeId,
              make: item.make,
              model: item.model,
              year: parseInt(item.year),
            };
            this.getMakeModelList(item.make);
            setTimeout(() => {
              //this.addVehicle(item.typeId, action, adasData);  
            }, 500);        
            break;
        }
      }
    }, 500);    
  }

  // Delete Report, Section, Content
  actionDelete(type, item, index) {
    let actionFlag = false;
    this.authenticationService.checkAccess(this.contentTypeId, 'Create',true,true);
    setTimeout(() => {
      actionFlag = this.checkReportAccess();
      if(actionFlag) {
        console.log(type, item, index)
        this.sindex = index;
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'Delete';
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
          modalRef.dismiss('Cross click'); 
          if(!receivedService) {
            this.sindex = -1;
            return;
          } else {
            let updateScrollFlag = true;
            let solrUpdate = {
              domainId: this.domainId
            };
            let actionType = (type == 'report') ? `${type}-delete` : type;
            const apiFormData = new FormData();
            apiFormData.append('apikey', this.apikey);
            apiFormData.append('domainId', this.domainId);
            apiFormData.append('userId', this.userId);
            apiFormData.append('action', 'delete');
            switch(type) {
              case 'report':
                this.reportItems.splice(index, 1);
                this.reportTotal = this.reportItems.length;
                this.reportItemEmpty = (this.reportItems.length == 0) ? true : false;
                updateScrollFlag = !this.reportItemEmpty;
                apiFormData.append('reportId', item.id);
                solrUpdate['action'] = 'delete-report';
                solrUpdate['reportId'] = item.id;
                break;
              case 'section':
                let sorder = item.sectionOrder;
                let sitem = this.sectionItems.filter(option => option.sectionOrder > sorder);
                sitem.forEach((sec) => {
                  let secOrder = sec.sectionOrder-1;
                  sec.sectionOrder = secOrder;
                  sec.contItems.forEach((citem) => {
                    citem.sectionOrder = secOrder;
                    citem.corder = `${secOrder}.${citem.contentOrder}`;  
                  });
                  sitem.dataFlag = false;
                  sitem.formFlag = false;
                  setTimeout(() => {
                    sitem.dataFlag = true;
                  }, 50);
                });            
                apiFormData.append('typeId', item.typeId);
                apiFormData.append('sectionId', item.id);
                solrUpdate['action'] = 'delete-section';
                solrUpdate['reportId'] = this.reportInfo.id;
                solrUpdate['typeId'] = item.typeId;
                solrUpdate['sectionId'] = item.id;
                solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
                this.sectionItems.splice(index, 1);
                this.sectionItemEmpty = (this.sectionItems.length == 0) ? true : false;
                updateScrollFlag = !this.sectionItemEmpty;
                break;
              case 'content':
                let contOrder = item.contentOrder;
                let citem = this.sectionItems[index].contItems.filter(option => option.contentOrder > contOrder);
                citem.forEach(cont => {
                  let corder = cont.contentOrder-1;
                  cont.corder = `${cont.sectionOrder}.${corder}`;
                });
                let cindex = this.sectionItems[index].contItems.findIndex(option => option.id == item.id);
                this.sectionItems[index].contItems.splice(cindex, 1);
                if(this.sectionItems[index].contItems.length == 0) {
                  this.sectionItems[index].contentHeight = 0;
                } else {
                  let baseHeight = this.sectionItems[this.sindex].baseHeight;
                  let contHeight = this.sectionItems[this.sindex].contHeight;
                  this.sectionItems[this.sindex].contHeight = baseHeight-contHeight;
                }
                this.sectionItems[index].dataFlag = false;
                this.sectionItems[index].formFlag = false;
                setTimeout(() => {
                  this.sectionItems[index].dataFlag = true;
                }, 100);
                apiFormData.append('sectionId', item.sectionId);
                apiFormData.append('contentId', item.id);
                solrUpdate['action'] = 'delete-content';
                solrUpdate['reportId'] = this.reportInfo.id;
                solrUpdate['typeId'] = this.typeInfo.id;
                solrUpdate['sectionId'] = item.sectionId;
                solrUpdate['contentId'] = item.id;
                solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
                break;
              case 'diagnostic':
                actionType = 'module';
                apiFormData.append('typeId', item.typeId);
                apiFormData.append('moduleId', item.id);
                solrUpdate['action'] = 'delete-section';
                solrUpdate['reportId'] = this.reportInfo.id;
                solrUpdate['typeId'] = item.typeId;
                solrUpdate['sectionId'] = item.id;
                solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
                this.diagnosticItems.splice(index, 1);
                this.diagnosticItemEmpty = (this.diagnosticItems.length == 0) ? true : false;
                this.diagnosticTotal = (this.diagnosticItemEmpty) ? 0 : this.diagnosticTotal;
                updateScrollFlag = !this.diagnosticItemEmpty;
                break;
              case 'diagnosticInfo':
                actionType = 'moduleInfo-delete';
                let dfindex = this.diagnosticItems[index].infoItems.findIndex(option => option.id == item.id);
                this.diagnosticItems[index].infoItems.splice(dfindex, 1);
                if(this.diagnosticItems[index].infoItems.length == 0) {
                  this.diagnosticItems[index].contentHeight = 0;
                } else {
                  console.log(this.diagnosticItems, this.sindex);
                  let dbaseHeight = this.diagnosticItems[this.sindex].baseHeight;
                  let dcontHeight = this.diagnosticItems[this.sindex].contHeight;
                  this.diagnosticItems[this.sindex].contHeight = dbaseHeight-dcontHeight;
                }
                this.diagnosticItems[index].formFlag = false;
                apiFormData.append('moduleInfoId', item.id);
                apiFormData.append('sectionId', item.sectionId);
                apiFormData.append('contentId', item.id);
                solrUpdate['action'] = 'delete-content';
                solrUpdate['reportId'] = this.reportInfo.id;
                solrUpdate['typeId'] = this.typeInfo.id;
                solrUpdate['sectionId'] = this.diagnosticItems[index].id;
                solrUpdate['contentId'] = item.id;
                solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
                break;
              case 'adas':
                actionType = 'adas-calibration-delete';
                apiFormData.append('typeId', item.typeId);
                apiFormData.append('adasId', item.id);
                solrUpdate['action'] = 'delete-section';
                solrUpdate['reportId'] = this.reportInfo.id;
                solrUpdate['typeId'] = item.typeId;
                solrUpdate['sectionId'] = item.id;
                solrUpdate['reportContentTypeId'] = this.typeInfo.rcId;
                this.adasItems.splice(index, 1);
                this.adasItemEmpty = (this.adasItems.length == 0) ? true : false;
                this.adasTotal = (this.adasItemEmpty) ? 0 : this.adasTotal;
                updateScrollFlag = !this.adasItemEmpty;
                break;
            }
            setTimeout(() => {
              if(updateScrollFlag) {
                this.directiveRef.update();
              }
              this.callback.emit(this);
            }, 100);
            apiFormData.append('type', actionType);
            this.LandingpagewidgetsAPI.manageReportAPI(apiFormData).subscribe((response) => {
              console.log(response)
              if(this.solrFlag) {
                this.LandingpagewidgetsAPI.manageSolrReport(solrUpdate).subscribe((response) => {
                  console.log(response)
                });
              }
            });
          }
        });
      }
    }, 500);
  }

  // Accordion Open
  onTabOpen(type, item, index) {
    console.log(type,item)
    let checkList;
    switch (type) {
      case 'section':
        checkList = this.sectionItems;
        break;
      case 'diagnostic':
        checkList = this.diagnosticItems;
        break;
      case 'adas':
        checkList = this.adasItems;
        break;
    }
    checkList.forEach(citem => {
      //citem.isSelected = false;
      citem.addMoreFlag = true;
      //citem.isSelected = (citem.id == item.id) ? true : false;
    });
    setTimeout(() => {
      this.directiveRef.update();
    }, 100);
  }

  // Accordion Close
  onTabClose(type, item, index) {
    let checkList, element;
    switch (type) {
      case 'section':
        element = `section-${index}`;
        checkList = this.sectionItems;
        break;
      case 'diagnostic':
        element = `diagnostic-${index}`;
        checkList = this.diagnosticItems;
        break;
      case 'adas':
        element = `section-${index}`;
        checkList = this.diagnosticItems;
        break;
    }

    checkList.forEach(citem => {
      citem.addMoreFlag = true;
    });
    
    setTimeout(() => {
      this.directiveRef.update();
      setTimeout(() => {
        //this.scrollToElem(element);
      }, 100);
    }, 100);
  }

  // Copy to clipboard
  copyToClipboard(cont) {
    cont = this.commonApi.convertHTMLEntity(cont);
    console.log(cont)
    this.commonApi.copyToClipboard(cont);
    this.copiedModal = true;
    setTimeout(() => {
      this.copiedModal = false;
    }, 1500);
  }

  // On Change
  changeItem(field, val, access = '') {
    console.log(field, val)
    let typeId = '';
    let recallFlag = false;
    switch(field) {
      case 'workstream':
        let reportId = this.reportForm.value.reportId;
        let reportType = this.reportForm.value.reportType;
        let chkDuplicateFlag = false;
        let chkVal = '', cfield = '';
        this.submitFlag = false;
        switch (reportType) {
          case 1:
            cfield = 'reportName';
            let reportName = this.reportForm.value.reportName;
            chkVal = reportName;
            chkDuplicateFlag = (reportName != '') ? true : chkDuplicateFlag;
            break;
          default:
            let reportVal = this.reportForm.value;
            let mfgId = reportVal.mfgId;
            let altMfg = reportVal.mfgAltName;
            console.log(reportVal);
            if(reportVal.mfgName != '' || reportVal.mfgAltName != '') {
              //this.alternateMfgFieldDisabled = false;
              let cmfi;
              if(reportVal.mfgName != '' && reportVal.mfgAltName == null) {
                cmfi = this.mfgItems.findIndex(option => option.name == reportVal.mfgName);
                this.reportForm.patchValue({reportName: chkVal});
              } else {
                cmfi = this.mfgItems.findIndex(option => option.originalName == reportVal.mfgAltName);
              }     
              if(cmfi >= 0) {
                console.log(this.mfgItems[cmfi]);
                mfgId = this.mfgItems[cmfi].id;
              }         
            }
            chkDuplicateFlag = ((mfgId > 0 && altMfg == null) || (mfgId > 0 && altMfg != '')) ? true : chkDuplicateFlag;
            console.log(mfgId, altMfg, chkDuplicateFlag)
            if(chkDuplicateFlag) {
              cfield = (mfgId > 0 && altMfg == null) ? 'mfg' : 'altMfgName';
              let mfi = this.mfgItems.findIndex(option => option.id == mfgId);
              if(mfi >= 0) {
                console.log(this.mfgItems[mfi])
                let caltName = this.mfgItems[mfi].name;
                let cmfgName = this.mfgItems[mfi].mfgName;
                if(mfgId > 0 && altMfg == '') {
                  chkVal = cmfgName;
                } else {
                  chkVal = caltName;
                }
              }                   
            }
            break;
         }
         if(chkDuplicateFlag) {
          this.reportForm.patchValue({reportName: chkVal});
          this.duplicateCheck(cfield, chkVal, reportId, typeId);
         }        
        break;
      case 'reportType':
        this.submitFlag = false;
        this.reportExist = false;
        this.reportFieldVisible = false;
        //this.alternateMfgFieldDisabled = false;
        this.existError = '';
        let customFlag = (val == 1) ? true : false;
        this.customReportFlag = customFlag;
        this.mfgReportFlag = !customFlag;
        const rformObj = this.reportForm.value;
        console.log(rformObj)
        if(rformObj.action != 'edit') {
          this.reportForm.patchValue({
            isMfg: 0,
            isAltMfg: 0,
            mfgId: 0,
            mfgAltName: null,
            reportName: ''
          });
        } else {
          let cmfgName = null;
          let cmfgAltName = null;
          let cisMfg = 0;
          let cisAltMfg = 0;
          let cmfgId = 0;
          let clogo = '';
          this.setUpReportValues(cisMfg, cisAltMfg, cmfgId, cmfgName, cmfgAltName, cmfgName, clogo);
        }
        if(val == 1) {
          //this.reportFieldDisabled = false;
          this.updateValidators(this.reportForm, "reportName", "init");
          this.updateValidators(this.reportForm, "mfgName", "remove");
        } else {
          this.updateValidators(this.reportForm, "mfgName", "init");
          this.updateValidators(this.reportForm, "reportName", "remove");
          //this.alternateMfgFieldDisabled = false;
          this.reportFieldVisible = false;
        }
        break;
      case 'mfg':
      case 'altMfgName':  
      case 'reportName':
        this.submitFlag = (field == 'mfg') ? false : this.submitFlag;
        this.reportExist = false;
        if(field == 'mfg' && val == null) {
          //this.alternateMfgFieldDisabled = true;
          this.existError = '';
          this.reportExist = true;
          this.reportFieldDisabled = false;
          this.reportForm.patchValue({
            isMfg: 0,
            isAltMfg: 0,
            mfgId: 0,
            mfgAltName: null
          });
          let catgVal = this.reportForm.get('reportName').value;
          if(val == null && catgVal == '') {
            this.updateValidators(this.reportForm, "mfgName", "remove");
            this.updateValidators(this.reportForm, "reportName", "init");          
          }
        } else if(field == 'altMfgName' && (val == null || val == '')) {
          let mfgId = this.reportForm.get('mfgId').value;
          let mfi = this.mfgItems.findIndex(option => option.id == mfgId);
          let isAltMfg = (this.mfgItems[mfi].alterMfgId > 0) ? 1 : 0;
          this.reportForm.patchValue({
            isAltMfg: isAltMfg,
            mfgAltName: null,
          });
          this.updateValidators(this.reportForm, "reportName", "remove");
        }
        else {
          if(field == 'mfg') {
            //this.alternateMfgFieldDisabled = false;
            let mfi = this.mfgItems.findIndex(option => option.mfgName == val);
            let altName = this.mfgItems[mfi].name;
            let mfgName = this.mfgItems[mfi].mfgName;
            val = (altName == mfgName) ? val : altName;
            if(this.mfgItems[mfi].alterMfgId > 0) {
              this.reportForm.patchValue({
                mfgId: this.mfgItems[mfi].id,
                mfgAltName: altName,
                isAltMfg: 1
              });
            } else {
              this.reportForm.patchValue({
                mfgId: this.mfgItems[mfi].id,
                mfgAltName: null,
                isAltMfg: 0
              });
            }
          }
          if(field == 'altMfgName') {            
            this.reportForm.patchValue({
              isAltMfg: 1,
              reportName: ''
            });
            this.updateValidators(this.reportForm, "mfgName", "remove");
            this.updateValidators(this.reportForm, "reportName", "init");
          }
          let reportId = this.reportForm.value.reportId;
          this.duplicateCheck(field, val, reportId, typeId);
        }        
        break;
      case 'secTitle':
        typeId = this.sectionForm.value.typeId;
        let secId = this.sectionForm.value.sectionId;
        this.duplicateCheck(field, val, secId, typeId);
        break;
      case 'moduleName':
        typeId = this.diagnosticForm.value.typeId;
        let moduleId = this.diagnosticForm.value.moduleId;
        this.duplicateCheck(field, val, moduleId, typeId);
        break;
      case 'dtcCode':
        let infoId = this.diagnosticInfoForm.value.infoId;
        let modId = this.diagnosticInfoForm.value.moduleId;
        this.duplicateCheck(field, val, infoId, modId);
        break;
      case 'make':
        this.modelItems = [];
        if(this.adasFlag) {
          console.log(this.vehicleForm);
          this.vehicleForm.patchValue({model: ''});
        }
        this.getMakeModelList(val);
        if(access == 'recall') {
          this.recallItems = [];
          this.recallEmpty = true;
          recallFlag = true;
          this.recallForm.patchValue({vin: '', model: ''});
          this.clearVin();
          this.checkVehicleInfo();
        }
        break;
      case 'model':
      case 'year':
        if(access == 'recall') {
          recallFlag = true;
          this.recallItems = [];
          this.recallEmpty = true;
        }
        break;    
    }
    if(recallFlag) {
      this.recallForm.patchValue({vin: ''});
      this.clearVin();
      this.checkVehicleInfo();
    }
  }

  updateValidators(form, field, action) {
    switch(action) {
      case 'init':
        form.get(field).setValidators([Validators.required]);//clear validation
        form.get(field).setErrors({'required':true});//updating error message
        break;
      case 'remove':
        form.get(field).clearValidators();//clear validation
        form.get(field).setErrors(null);//updating error message
        break;  
    }
    form.updateValueAndValidity();//update validation
  }

  // Update Manufacturer Logo
  updateLogo(item) {
    let actionFlag = false;
    this.authenticationService.checkAccess(this.contentTypeId, 'Create',true,true);
    setTimeout(() => {
      actionFlag = this.checkReportAccess();
      if(actionFlag) {
        this.bodyElem = document.getElementsByTagName('body')[0];  
        this.bodyElem.classList.add(this.bodyClass);  
        this.bodyElem.classList.add(this.bodyClass1);
        let access = "reportLogo";
        const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
        modalRef.componentInstance.userId = this.userId;
        modalRef.componentInstance.domainId = this.domainId;
        modalRef.componentInstance.type = "Edit";
        modalRef.componentInstance.profileType = access; 
        modalRef.componentInstance.id = item.id;     
        modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
          if (receivedService) {
            console.log(receivedService)
            this.bodyElem = document.getElementsByTagName('body')[0];
            this.bodyElem.classList.remove(this.bodyClass);  
            this.bodyElem.classList.remove(this.bodyClass1);
            modalRef.dismiss('Cross click');       
            item.logo = receivedService.show;
            let rindex = this.reportItems.findIndex(option => option.id == item.id);
            this.reportItems[rindex].logo = item.logo;
            const apiData = {
              apikey: this.apikey,
              domainId: this.domainId,
              userId: this.userId,
              type: 'updateLogo',
              action: 'update',
              reportId: item.id,
              logo: receivedService.response
            }
            this.LandingpagewidgetsAPI.manageReportAPI(apiData).subscribe((response) => {
              console.log(response)
              item.logo = response.data;
              this.reportItems[rindex].logo = item.logo;
              setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;            
              }, 0);
            });
          }
        });
      }
    }, 500);
  }

  // Duplicate Check
  duplicateCheck(field, val, id, typeId = '') {
    this.checkFlag = true;
    console.log(field, val, id, typeId)
    let workstreamId = this.reportForm.get('workstreamId').value;
    const apiInfo = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId,
      access: '',
      field: '',
      fieldVal: val,
      id: id,
      workstreamId: JSON.stringify([workstreamId])
    };
    switch (field) {
      case 'mfg':
      case 'reportName':
      case 'altMfgName':  
        apiInfo.access = 'report';
        apiInfo.field = 'name';
        break;
      case 'secTitle':
        apiInfo.access = 'reportSection';
        apiInfo.field = 'title';
        apiInfo['typeId'] = typeId;
        break;
      case 'moduleName':
        apiInfo.access = 'reportModule';
        apiInfo.field = 'moduleName';
        apiInfo['typeId'] = typeId;
        break;
      case 'dtcCode':
        apiInfo.access = 'reportModuleDtc';
        apiInfo.field = 'dtcCode';
        apiInfo['typeId'] = typeId;       
    }
    if(val == '') 
      return;

    this.LandingpagewidgetsAPI.checkDuplicate(apiInfo).subscribe((response) => {
      console.log(response);
      this.checkFlag = false;
      const flag = response.error;
      if(flag && this.submitFlag) {
        //this.submitFlag = false;
      }
      this.existError = response.message;
      switch (field) {
        case 'mfg':
          this.reportExist = flag;
          //this.reportFieldDisabled = true;
          this.reportFieldVisible = false;
          //this.alternateMfgFieldDisabled = flag;
          this.reportForm.patchValue({
            isMfg: 0,
            reportName: null
          });
          if(!flag) {
            this.showClear = true;
            //this.reportFieldDisabled = (val == null) ? false : true;
            let catgVal = this.reportForm.get('reportName').value;
            let mfgFlag = 0;
            let logo = null;
            console.log(catgVal)
            if(val == null && catgVal == '') {
              this.updateValidators(this.reportForm, "mfgName", "remove");          
            } else {
              mfgFlag = 1;
              let mfgIndex = this.mfgItems.findIndex(option => option.name.toLowerCase() == val.toLowerCase());
              logo = (mfgIndex < 0) ? '' : this.mfgItems[mfgIndex].logo;
              this.updateValidators(this.reportForm, "reportName", "remove");
            } 
            this.reportForm.updateValueAndValidity();//update validation               
            
            this.reportForm.patchValue({
              isMfg: mfgFlag,
              reportName: null,
              logo: logo
            });
          }
          break;
        case 'altMfgName':
          this.reportExist = flag;
          let reportId = this.reportForm.get('reportId').value;
          let mfgId = this.reportForm.get('mfgId').value;
          this.reportFieldVisible = false;
          console.log(mfgId)
          if(!flag) {
            let mfgIndex = this.mfgItems.findIndex(option => option.id== mfgId);
            console.log(mfgIndex)
            this.showClear = (mfgIndex < 0) ? false : true;
            //this.reportFieldDisabled = (mfgIndex < 0) ? false : true;
            let isMfg = 1;
            let logo = (mfgIndex < 0) ? '' : this.mfgItems[mfgIndex].logo;
            //let reportName = (mfgIndex < 0) ? val : null;
            let reportName = val;
            if(mfgIndex < 0) {
              this.updateValidators(this.reportForm, "mfgName", "remove");
              this.updateValidators(this.reportForm, "reportName", "init");
            }
            this.reportForm.patchValue({
              isMfg: isMfg,
              reportName: reportName,
              logo: logo
            });
            if(this.submitFlag) {
              this.updateValidators(this.reportForm, "reportName", "remove");
              this.saveData();
            }
          } else {
            this.reportForm.patchValue({
              mfgId: 0,
              isMfg: 0,
              isAltMfg: 0              
            });
          }          
          break;  
        case 'reportName':
          this.reportExist = flag;
          let reportType = this.reportForm.value.reportType;
          let reportIsMfg = this.reportForm.value.isMfg;
          if(!flag) {
            let mfgIndex, mfgName, isMfg, logo, reportName, mfgAltName, isAltMfg, mfgId;
            let checkFlag = true;
            console.log(id)
            if(id > 0) {
              let rindex = this.reportItems.findIndex(option => option.id == id);
              console.log(this.reportItems[rindex].isMfg)
              if(reportType == 1 && (this.reportItems[rindex].isMfg == 1 || this.reportItems[rindex].isAltMfg == 1)) {
                if(this.reportItems[rindex].isAltMfg == 1) {
                  mfgIndex = this.mfgItems.findIndex(option => option.name.toLowerCase() == val.toLowerCase());
                } else {
                  mfgIndex = this.mfgItems.findIndex(option => option.originalName.toLowerCase() == val.toLowerCase());
                }
                if(mfgIndex > 0) {
                  checkFlag = false;
                  this.reportForm.patchValue({reportType: 2});
                  mfgName = (mfgIndex < 0) ? null : this.mfgItems[mfgIndex].mfgName;
                  mfgAltName = (mfgIndex < 0 || this.reportItems[rindex].isAltMfg == 0) ? null : this.mfgItems[mfgIndex].name;
                  isMfg = (mfgIndex < 0) ? 0 : 1;
                  isAltMfg = (mfgIndex < 0 || this.reportItems[rindex].isAltMfg == 0) ? 0 : 1;
                  mfgId = (mfgIndex < 0) ? 0 : this.mfgItems[mfgIndex].id;
                  logo = (mfgIndex < 0) ? '' : this.mfgItems[mfgIndex].logo;
                  reportName = (mfgIndex < 0) ? val : '';
                  this.setUpReportValues(isMfg, isAltMfg, mfgId, mfgName, mfgAltName, reportName, logo);
                  this.changeItem('reportType', 2);
                  return;  
                } else {
                  if(reportIsMfg == 0) {
                    reportName = val;
                    mfgName = null;
                    mfgAltName = null;
                    isMfg = 0;
                    isAltMfg = 0;
                    mfgId = 0;
                    logo = '';
                    reportName = val; 
                  }
                }
              } else if(this.reportItems[rindex].isAltMfg == 1) {
                checkFlag = false;
                mfgIndex = this.mfgItems.findIndex(option => option.name.toLowerCase() == val.toLowerCase());
                mfgName = (mfgIndex < 0) ? null : this.mfgItems[mfgIndex].mfgName;
                mfgAltName = (mfgIndex < 0) ? null : this.mfgItems[mfgIndex].name;
                isMfg = (mfgIndex < 0) ? 0 : 1;
                isAltMfg = (mfgIndex < 0) ? 0 : 1;
                mfgId = (mfgIndex < 0) ? 0 : this.mfgItems[mfgIndex].id;
                logo = (mfgIndex < 0) ? '' : this.mfgItems[mfgIndex].logo;
                reportName = (mfgIndex < 0) ? val : ''; 
              }
            } 
            if(checkFlag) {
              mfgIndex = this.mfgItems.findIndex(option => option.originalName.toLowerCase() == val.toLowerCase());
              if(mfgIndex <= 0) {
                mfgIndex = this.mfgItems.findIndex(option => option.name.toLowerCase() == val.toLowerCase());
              }
              mfgName = (mfgIndex < 0) ? null : this.mfgItems[mfgIndex].name;
              isMfg = (mfgIndex < 0) ? 0 : 1;
              isAltMfg = 0;
              mfgAltName = (mfgIndex < 0 || this.mfgItems[mfgIndex].alterMfgId == 0) ? null : this.mfgItems[mfgIndex].name;
              logo = (mfgIndex < 0) ? '' : this.mfgItems[mfgIndex].logo;
              reportName = val; 
              //this.alternateMfgFieldDisabled = (mfgIndex < 0) ? true : false;              
            }
            console.log(mfgIndex, this.submitFlag)
            this.showClear = (mfgIndex < 0) ? false : true;
            //this.reportFieldDisabled = (mfgIndex < 0) ? false : true;
            this.reportFieldVisible = (mfgIndex < 0) ? true : false;
            if(mfgIndex < 0) {
              this.updateValidators(this.reportForm, "mfgName", "remove");
              this.updateValidators(this.reportForm, "reportName", "init");
            } else {
              this.updateValidators(this.reportForm, "mfgName", "init");
              this.updateValidators(this.reportForm, "reportName", "remove");        
            }
            this.setUpReportValues(isMfg, isAltMfg, mfgId, mfgName, mfgAltName, reportName, logo);
            if(this.submitFlag) {
              this.saveData();
            }
          }
          break;
        case 'secTitle':
          this.sectionExist = flag;
          console.log(this.sectionExist)
          break;
        case 'moduleName':
            this.moduleExist = flag;
            break;
        case 'dtcCode':
          this.dtcCodeExist = flag;
          break;    
      }
    });
  }

  // Onscroll
  scroll = (event: any): void => {
    if(this.lazyLoading) {
      event.preventDefault();
    }
    let type, itemOffset, itemLength, itemTotal, data;
    if(this.reportFlag) {
      itemOffset = this.reportOffset;
      itemLength = this.reportItems.length;
      itemTotal = this.reportTotal;
      type = 'report';
      data = {
        filterOptions: this.reportFilterOptions,
        view: 0
      };
    } else if(this.sectionFlag) {
      itemOffset = this.sectionOffset;
      itemLength = this.sectionItems.length;
      itemTotal = this.sectionTotal;
      type = 'section';
      data = {
        reportId: this.reportInfo.id,
        reportTypeId: this.typeInfo.id,
        reportContentTypeId: this.typeInfo.rcId,
        filterOptions: this.sectionFilterOptions,
        view: 2
      };
    } else if(this.diagnosticFlag) {
      itemOffset = this.diagnosticOffset;
      itemLength = this.diagnosticItems.length;
      itemTotal = this.diagnosticTotal;
      type = 'diagnostic';
      data = {
        reportId: this.reportInfo.id,
        reportTypeId: this.typeInfo.id,
        reportContentTypeId: this.typeInfo.rcId,
        filterOptions: this.diagFilterOptions,
        view: 2
      };
    } else if(this.adasFlag) {
      itemOffset = this.adasOffset;
      itemLength = this.adasItems.length;
      itemTotal = this.adasTotal;
      type = 'adas';
      let filter = localStorage.getItem(filterNames.reportAdas);
      this.adasFilterOptions = filter;
      data = {
        reportId: this.reportInfo.id,
        reportTypeId: this.typeInfo.id,
        reportContentTypeId: this.typeInfo.rcId,
        filterOptions: this.adasFilterOptions,
        view: 2
      };
      //console.log(data)
      console.log(typeof this.adasFilterOptions)
    }
    if(event.target.id=='reportList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 50;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (inHeight >= totalHeight && this.scrollCallback && itemTotal > itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getReportList(type, data);
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = 0;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);
    }
  }

  // Close Dialog
  resetForm() {
    console.log('in reset')
    if(this.reportFormSubmit) {
      this.reportForm.reset();
      this.reportFormSubmit = false;
    }    
    if(this.sectionFormSubmit) {
      this.sectionForm.reset();
      this.sectionFormSubmit = false;
    }
    if(this.contentFormSubmit) {
      this.contentForm.reset();
      this.contentFormSubmit = false;
    }
    if(this.diagnosticFormSubmit) {
      this.diagnosticForm.reset();
      this.diagnosticFormSubmit = false;
    }
    if(this.diagnosticInfoFormSubmit) {
      this.diagnosticInfoForm.reset();
      this.diagnosticInfoFormSubmit = false;
    }
    if(this.recallButtonFlag) {
      this.recallForm.reset();
      this.recallFormSubmit = false;            
    }
  }

  onScrollEvent(type, event) {
    console.log(type, event)
    let itemOffset, itemLength, itemTotal, data;
    switch(type) {
      case 'report':
        itemOffset = this.reportOffset;
        itemLength = this.reportItems.length;
        itemTotal = this.reportTotal;
        data = {view: 0};
        break;
      case 'section':
      case 'diagnostic':
        itemOffset = (type == 'section') ? this.sectionOffset : this.diagnosticOffset;
        itemLength = (type == 'section') ? this.sectionItems.length : this.diagnosticItems.length;
        itemTotal = (type == 'section') ? this.sectionTotal : this.diagnosticTotal;
        data = {
          reportId: this.reportInfo.id,
          reportTypeId: this.typeInfo.id,
          reportContentTypeId: this.typeInfo.rcId,
          view: 2
        };
        break;    
    }
    console.log(itemTotal, itemLength)
    if (itemTotal > itemLength) {
      this.lazyLoading = true;
      this.getReportList(type, data);
    }
  }

  // Setup Report Lists
  setupReportList(actionType, response, type, itemData, listAction) {
    console.log(actionType, response, type, itemData, listAction)
    const result = response.data;
    const total = parseInt(result.total);
    const items = result.items;
    let reportRow = document.getElementsByClassName("report-row");
    let listItemHeight;
    let timeout = 0;
    switch(type) {
      case 'report':
        this.reportTotal = total;
        items.forEach(item => {
          this.reportItems.push(item)
        });
        this.reportItemEmpty = (this.reportOffset == 0 && total == 0) ? true : false;
        if(!this.reportItemEmpty) {
          setTimeout(() => {
            listItemHeight = (reportRow[0]) ? reportRow[0].clientHeight + 50 : 0;
            this.reportOffset = this.reportOffset+this.reportLimit;
            this.scrollCallback = true;
            this.scrollInit = 1;
            if (items.length > 0 && this.reportItems.length != total && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getReportList(type, itemData);
              this.lastScrollTop = this.scrollTop;
            }
          }, 250);
        }
        timeout = 200;
        break;
      case 'type':
        this.typeTotal = total;
        this.typeItems = items;
        break;
      case 'section':
        this.sectionTotal = total;
        items.forEach((item, i) => {
          this.sectionItems.push(item)
        });
        this.sectionItemEmpty = (this.sectionOffset == 0 && total == 0) ? true : false;
        if(!this.sectionItemEmpty) {
          if(actionType == 'search') {
            let reportInfo = result.facets.reportDetails;
            this.reportSearchEmpty = (reportInfo.length == 0) ? true : false;
            console.log(reportInfo)
            let reportIndex = this.reportItems.findIndex(option => option.id == reportInfo.id);
            console.log(reportIndex)
            if(reportIndex > 0) {
              this.reportItems[reportIndex].facetCount = reportInfo.facetCount;
            }            
            let typeInfo = result.facets.typeDetails;
            console.log(typeInfo)
            let typeIndex = this.typeItems.findIndex(option => option.id == typeInfo.id);
            console.log(typeIndex)
            if(typeIndex > 0) {
              this.typeItems[typeIndex].facetCount = reportInfo.facetCount;
            }
          }
          setTimeout(() => {
            listItemHeight = (reportRow[0]) ? reportRow[0].clientHeight + 50 : 0;
            items.forEach((item, i) => {
              let citems = item.contItems;
              let itemHeight = 0;
              if(actionType == 'search') {
                item.isSelected = true;
                item.id = item.sectionId;
                citems.forEach((citem, cindex) => {
                  citem.id = citem.contentId;
                  citem.corder = `${citem.sectionOrder}.${cindex+1}`;
                });
              }
              if(citems.length > 5) {
                itemHeight = 0;
                citems.forEach((citem, ci) => {
                  if(ci < 4) {
                    let chkElm = `sec-cont-${item.sectionOrder}`;
                    let cheight = document.getElementsByClassName(chkElm)[0].clientHeight+20;
                    itemHeight += cheight;
                  }
                });
                item.contHeight = itemHeight;                  
                setTimeout(() => {
                  item.dataFlag = true;  
                }, 50);
              }
            });
            this.sectionOffset = this.sectionOffset+this.sectionLimit;
            this.scrollCallback = true;
            this.scrollInit = 1;
            if (items.length > 0 && this.sectionItems.length != total && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getReportList(type, itemData);
              this.lastScrollTop = this.scrollTop;
            }
          }, 250);
        }
        break;
      case 'diagnostic':
        this.diagnosticTotal = total;
        this.moduleLastUpload = "";
        let updatedOnDate:any = '';
        if(result.uploadedOn != '') {
          updatedOnDate = moment.utc(result.uploadedOn).toDate(); 
          let localupdatedOnDate = moment(updatedOnDate).local().format('MMM DD, YYYY h:mm A');
          this.moduleLastUpload = localupdatedOnDate;
        }
        
        if(actionType == 'search') {
          let reportDet = result.facets.reportDetails;
          this.reportSearchEmpty = (reportDet.length == 0) ? true : false;
          if(reportDet.length > 0) { 
            let reportInfo = reportDet[0];            
            console.log(reportInfo, this.reportItems)
            let reportIndex = this.reportItems.findIndex(option => option.id == reportInfo.id);
            console.log(reportIndex)
            this.reportItems[reportIndex].facetCount = reportInfo.facetCount;
            let typeInfo = result.facets.typeDetails[0];
            console.log(typeInfo)
            let typeIndex = this.typeItems.findIndex(option => option.id == typeInfo.id);
            console.log(typeIndex)
            this.typeItems[typeIndex].facetCount = reportInfo.facetCount;
          }
          items.forEach((item, i) => {
            item.infoItems = item.contItems;
          });
        }  
        if(listAction == 'reload') {
          items.forEach(item => {
            let dindex = this.diagnosticItems.findIndex(option => option.id == item.id);
            if(dindex >= 0) {
              item.isSelected = (this.diagnosticItems[dindex].isSelected) ? true : item.isSelected;
              let sortedItems:any = items.sort(function(a:any, b:any){
                if( a.dtcCode === b.dtcCode ){
                  return 0;
                } else if ( a.dtcCode > b.dtcCode ) {
                  return 1;
                } else {
                  return -1;
                }
              });
              item.infoItems = sortedItems;
              this.diagnosticItems[dindex] = item;
            } 
          });
        } else {
          items.forEach(item => {
            let slug;
            let pushFlag = true;
            if(actionType == 'search') {
              slug = (item.slug != '' && item.slug != undefined && item.slug != 'undefined') ? item.slug[0] : '';
            } else {
              slug = (item.slug != '' && item.slug != undefined && item.slug != 'undefined') ? item.slug : '';
              console.log(this.diagnosticItems, item.id)
              let dindex = this.diagnosticItems.findIndex(option => option.id == item.id);
              console.log(dindex)
              if(dindex >= 0) {
                pushFlag = false;
                this.diagnosticItems[dindex] = item;
              }
            }
            item.slug = slug;
            if(pushFlag)
              this.diagnosticItems.push(item)
          });
          this.diagnosticItemEmpty = (this.diagnosticOffset == 0 && total == 0) ? true : false;
          if(!this.diagnosticItemEmpty) {
            setTimeout(() => {
              listItemHeight = (reportRow[0]) ? reportRow[0].clientHeight + 50 : 0;
              items.forEach((item, i) => {
                let sortedItems:any = item.infoItems.sort(function(a:any, b:any){
                  if( a.dtcCode === b.dtcCode ){
                    return 0;
                  } else if ( a.dtcCode > b.dtcCode ) {
                    return 1;
                  } else {
                    return -1;
                  }
                });
                item.infoItems = sortedItems;
                let infoItems = item.infoItems;
                console.log(item.name, infoItems)
                let itemHeight = 0;
                if(infoItems.length > 5) {
                  itemHeight = 0;
                  infoItems.forEach((citem, ci) => {
                    if(ci < 4) {
                      let chkElm = `sec-cont-${ci}`;
                      let cheight = document.getElementsByClassName(chkElm)[0].clientHeight;
                      itemHeight += cheight;
                    }
                  });
                  item.contHeight = itemHeight;                  
                  setTimeout(() => {
                    item.dataFlag = true;  
                  }, 50);
                }
                if(actionType == 'search') {
                  item.isSelected = true;
                  item.id = item.sectionId;
                  infoItems.forEach(infoItem => {
                    infoItem.id = infoItem.contentId;
                  });
                }
              });
              this.diagnosticOffset = this.diagnosticOffset+this.diagnosticLimit;
              this.scrollCallback = true;
              this.scrollInit = 1;
              if (items.length > 0 && this.diagnosticItems.length < total && this.innerHeight >= listItemHeight) {
                this.scrollCallback = false;
                this.lazyLoading = true;
                this.getReportList(type, itemData);
                this.lastScrollTop = this.scrollTop;
              }
            }, 250);
          }
        }          
        break;
      case 'adas':
        this.adasTotal = total;
        this.adasLastUpload = "";
        let adasUpdatedOnDate:any = '';
        if(result.uploadedOn != '') {
          adasUpdatedOnDate = moment.utc(result.uploadedOn).toDate(); 
          let localupdatedOnDate = moment(adasUpdatedOnDate).local().format('MMM DD, YYYY h:mm A');
          this.adasLastUpload = localupdatedOnDate;
        }
        items.forEach((item, i) => {
          if(actionType == 'search') {
            item.contItems = item.infoItems;
          }          
          this.adasItems.push(item)
        });
        this.adasItemEmpty = (this.adasOffset == 0 && total == 0) ? true : false;
        if(!this.adasItemEmpty) {
          if(actionType == 'search') {
            let reportInfo = result.facets.reportDetails;
            this.reportSearchEmpty = (reportInfo.length == 0) ? true : false;
            console.log(reportInfo)
            let reportIndex = this.reportItems.findIndex(option => option.id == reportInfo.id);
            console.log(reportIndex)
            if(reportIndex > 0) {
              this.reportItems[reportIndex].facetCount = reportInfo.facetCount;
            }            
            let typeInfo = result.facets.typeDetails;
            console.log(typeInfo)
            let typeIndex = this.typeItems.findIndex(option => option.id == typeInfo.id);
            console.log(typeIndex)
            if(typeIndex > 0) {
              this.typeItems[typeIndex].facetCount = reportInfo.facetCount;
            }
          }
          setTimeout(() => {
            listItemHeight = (reportRow[0]) ? reportRow[0].clientHeight + 50 : 0;
            items.forEach((item, i) => {
              let citems = item.contItems;
              let itemHeight = 0;
              if(actionType == 'search') {
                item.isSelected = true;
                item.id = item.sectionId;
                citems.forEach((citem, cindex) => {
                  citem.id = citem.contentId;
                });
              }
              if(citems.length > 5) {
                itemHeight = 0;
                citems.forEach((citem, ci) => {
                  if(ci < 4) {
                    let chkElm = `sec-cont-${ci}`;
                    let cheight = document.getElementsByClassName(chkElm)[0].clientHeight+20;
                    itemHeight += cheight;
                  }
                });
                item.contHeight = itemHeight;                  
                setTimeout(() => {
                  item.dataFlag = true;  
                }, 50);
              }
            });
            console.log(this.adasItems)
            this.adasOffset = this.adasOffset+this.adasLimit;
            this.scrollCallback = true;
            this.scrollInit = 1;
            if (items.length > 0 && this.adasItems.length != total && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getReportList(type, itemData);
              this.lastScrollTop = this.scrollTop;
            }
          }, 250);
        }
        break;    
    }
    setTimeout(() => {
      this.loading = false;
      this.lazyLoading = false;
      this.callback.emit(this);
    }, timeout);
  }

  setUpReportValues(isMfg, isAltMfg, mfgId, mfgName, mfgAltName, reportName, logo) {
    console.log(reportName)
    this.reportForm.patchValue({
      isMfg: isMfg,
      isAltMfg: isAltMfg,
      mfgId: mfgId,
      mfgName: mfgName,
      mfgAltName: mfgAltName,
      reportName: reportName,
      logo: logo
    });
  }

  // Success Popup
  successPopup(message) {
    const msgModalRef = this.modalService.open(SuccessModalComponent, this.successModalConfig);
    msgModalRef.componentInstance.successMessage = message;
    msgModalRef.componentInstance.statusFlag = true;
    setTimeout(() => {
      msgModalRef.dismiss('Cross click');
    }, 2500);
  }

  solrUpdate(updateData) {
    this.LandingpagewidgetsAPI.manageSolrReport(updateData).subscribe((response) => {
      console.log(response)
    });
  }

  disableFlag(field) {
    let flag = false;
    switch (field) {
      case 'model':
        flag = (this.modelItems.length == 0) ? true : flag;
        break;
    }
    return flag;
  }

  clearFields() {
    console.log(this.adasFilterOptions)
    this.adasFilterOptions = {};
    let reportFilterFields:any = localStorage.getItem(filterFields.reportAdas);
    reportFilterFields = (reportFilterFields) ? JSON.parse(reportFilterFields) : [];
    reportFilterFields.forEach((item, index) => {
      let name = item.name;
      let selection = item.selection;
      let val:any = (selection == 'single') ? '' : [];
      this.adasFilterOptions[name] = val;
    });
    localStorage.setItem(filterNames.reportAdas, JSON.stringify(this.adasFilterOptions));
  }

  getRecentVin() {
    const vinData = this.recallForm.get('vin');
    const apiData = {
      apiKey: Constant.ApiKey,
      countryId: this.countryId,
      userId: this.userId,
      domainId: this.domainId,
      access: 'thread'
    };
    this.vinDisable = true;
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
      this.vinDisable = false;
      this.makeLoader = true;
      this.modelLoader = true;
      this.yearLoader = true;
      this.modelDisable = true;
      const response = receivedService[0];
      this.recallForm.patchValue({vin: response.vinNo});
      this.vinData = {
        make: response.make,
        model: response.model,
        year: parseInt(response.year),
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
    const vinData = this.recallForm.get('vin');
    console.log(vinData)
    //this.vinIsValid = (action == 'api' || val.length == 17) ? true : false;
    this.vinIsValid = false;
    action = (action == 'change' && val.length == 17) ? 'api': action; 
    switch (action) {
      case 'change':
        //this.vinIsValid = true;
        this.vinValid = (val.length == 17 && vinData.value == '') ? true : false;
        val = val.toUpperCase();
        this.vinVerfied = false;
        this.recallEmpty = true;
        this.recallItems = [];
        break;
      default:
        this.recallEmpty = true;
        this.vinLoader = true;
        const svcFormData = new FormData();
        svcFormData.set('apiKey', Constant.ApiKey);
        svcFormData.set('countryId', this.countryId);
        svcFormData.set('domainId', this.domainId);
        svcFormData.set('userId', this.userId);
        svcFormData.set('vin', vinData.value);
        this.vinDisable = true;
        this.LandingpagewidgetsAPI.vehicleInfoByVIN(svcFormData).subscribe(
          (response) => {
            this.vinLoader = false;
            this.makeLoader = true;
            this.modelLoader = true;
            this.yearLoader = true;
            this.vinDisable = false;
            this.vinValid = (response.status == 'Success') ? true : false;
            let vinDet = response?.vinDetails;
            if (this.vinValid && vinDet.length > 0) {
              this.vinVerfied = true;
              this.vinIsValid = true;
              this.modelDisable = true;
              this.vinData = {
                make: vinDet[0]?.make,
                model: vinDet[0]?.model,
                year: parseInt(vinDet[0]?.year),
              };
              this.setVINValues('vin');
            } else {
              this.vinIsValid = true;
              this.vinValid = false;
              this.makeLoader = false;
              this.modelLoader = false;
              this.yearLoader = false;
            }
          }
        );
        break;
    }
  }

  setVINValues(access) {
    this.getMakeModelList(this.vinData.make, 'vin');    
  }

  getYearsList() {
    let year = parseInt(this.currYear);
    let yearList = [];
    for (let y:any = year; y >= this.initYear; y--) {
      y = parseInt(y);
      yearList.push({
        id: y,
        name: y,
      });
    }    
    this.yearItems = yearList;    
  }

  getRecallItems() {
    this.callback.emit(this);
    this.recallLoader = true;
    const recallFormData = new FormData();
    recallFormData.set('apikey', Constant.ApiKey);
    recallFormData.set('domainId', this.domainId);
    recallFormData.set('userId', this.userId);
    recallFormData.set('make', this.recallForm.get('make').value);
    recallFormData.set('model', this.recallForm.get('model').value);
    recallFormData.set('year', this.recallForm.get('year').value);
    this.LandingpagewidgetsAPI.getRecallData(recallFormData).subscribe((response) => {
      console.log(response)
      let recallResponse = response.data;
      console.log(recallResponse.Count, recallResponse.results)
      this.recallEmpty = false;
      this.recallItemEmpty = (recallResponse.Count == 0) ? true : false;
      this.recallItems = recallResponse.results;
      setTimeout(() => {
        this.recallLoader = false;  
      }, 500);      
    });        
  }

  clearRecallData() {
    let rcdata = {
      action: 'new',
      vin: '',
      make: '',
      model: '',
      year: ''
    }
    this.resetForm();
    setTimeout(() => {
      this.recallButtonFlag = false;
      this.createForm('recall', rcdata);          
    }, 100);
    this.vinIsValid = false;
    this.vinValid = true;
    this.recallEmpty = true;
    this.recallItemEmpty = false;
    this.recallItems = [];
  }

  clearVin() {
    this.vinIsValid = false;
    this.vinValid = true;
    this.vinData = [];
  }

  checkVehicleInfo() {
    let makeVal = this.recallForm.get('make').value;
    let modelVal = this.recallForm.get('model').value;
    let yearVal = this.recallForm.get('year').value;
    this.recallButtonFlag = (makeVal == '' || modelVal == '' || yearVal == '') ? false : true;
  }

  checkReportAccess() {
    let emitFlag = false;
    if(this.authenticationService.checkAccessVal){
      emitFlag = true;
    }
    else if(!this.authenticationService.checkAccessVal){
      // no access
    }
    else{                
      emitFlag = true;
    }
    return emitFlag;
  }

  matmenu(elem, action, id, cid=-1) {
    //console.log(elem, action, id, cid)
    let actionText = 'hide';
    let chkElem = `${elem}-${id}`;
    chkElem = (cid < 0) ? chkElem : `${chkElem}-${cid}`;
    let menuElem = document.getElementsByClassName(chkElem);
    if(menuElem) {
      if(action == 'active') {
        menuElem[0].classList.remove(actionText);
      } else {
        if(menuElem && menuElem[0].classList)
          menuElem[0].classList.add(actionText);
      }      
    }
  }
}
