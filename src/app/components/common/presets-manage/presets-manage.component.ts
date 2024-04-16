import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { MediaManagerService } from '../../../services/media-manager/media-manager.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant , AttachmentType, PlatFormType} from '../../../common/constant/constant';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { CommonService } from '../../../services/common/common.service';
import * as ClassicEditor from "src/build/ckeditor";
import { ApiService } from '../../../services/api/api.service';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import * as moment from 'moment';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { Subscription } from "rxjs";
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';

@Component({
  selector: 'app-presets-manage',
  templateUrl: './presets-manage.component.html',
  styleUrls: ['./presets-manage.component.scss']
})

export class PresetsManageComponent implements OnInit, OnDestroy {

  @Input() apiData: any = [];
  @Input() presetType: string= '';
  @Input() presetId;

  @Output() presetsServices: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  public newFlag : boolean = false;
  public editFlag : boolean = false;
  public viewFlag : boolean = false;
  public bodyClass: string = "popup-new"
  public bodyElem;
  public headTitle: string = "";
  subscription: Subscription = new Subscription();
  public Editor = ClassicEditor;
  public domainId;
  public userId;
  public countryId;
  public workstreamItems: any = [];
  public workstreamId: any = [];
  public manufacturerId: any = [];
  public manufacturerName: any = [];
  public workstreamSelection: any = [];
  public workstreamValid: boolean = true;
  public defaultWSLabel: string = 'Select Workstream';
  public workstreamName = [];
  public make: string = "";
  public modelName = [];
  public year: string = "";
  public title: string = '';
  public description: string = "";
  public errTxt: string = "";
  public maxLen: number = 100;
  public editorProgressUpload=0;
  public addPresetsFlag:boolean = false;
  public addScoreFlag:boolean = false;
  public attachmentView: boolean = false;
  uploadFileLength: number;
  linkForm: FormGroup;
  presetsForm: FormGroup;
  public linkSubmitted: boolean = false;
  public submitted1: boolean = false;
  uploadedFiles: any[] = [];
  filesArr: any;
  attachments: any[] = [];
  progressInfos = [];
  public user: any;
  public linkErrorMsg: string ='';
  public placeHolderText:string = '';
  public labelText:string = '';
  public innerHeight: number;
  public bodyHeight: number;
  public industryType: any = "";
  public currYear: any = moment().format('Y');
  public initYear = 1960;
  Years: any = [];
  public makes: any = [];
  public manufacturers: any = [];
  public manufacturerSelection: any = [];
  public manufacturerSelectionArr: any = [];
  public baseApiUrl: string = "";
  public collabticApi: string;
  public presetsEditData = [];
  public posteditServerError = false;
  public postEditServerErrorMsg = "";
  public editPostUpload: boolean = true;
  public manageAction: string;
  public postEditApiData: object;
  public contentType: number = 47;
  public displayOrder: number = 0;
  public EditAttachmentAction: 'attachments';
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public mediaUploadItems: any = [];
  public uploadedItems: any = [];
  public pageAccess: string = 'presets';
  public imageFlag: string = 'false';
  public bodyClass2: string = "submit-loader";
  public emptyFlag: boolean = false;
  public loading: boolean = true;
  configCke: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
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
    placeholder: 'Description',
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

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private mediaApi: MediaManagerService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService,
    private threadPostService: ThreadPostService,
    private apiUrl: ApiService,
    private httpClient:HttpClient,
    private titleService: Title,
    private modalConfig: NgbModalConfig,
    private LandingpagewidgetsAPI: LandingpageService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }

  // convenience getters for easy access to form fields
  get f() { return this.linkForm.controls; }

  // convenience getters for easy access to form fields
  get s() { return this.presetsForm.controls; }

  ngOnInit(): void {
    this.apiUrl.attachmentNewPOPUP = true;
  this.bodyHeight = window.innerHeight;

	this.user = this.authenticationService.userValue;
	this.domainId = this.user.domain_id;
	this.userId = this.user.Userid;
	this.countryId = localStorage.getItem('countryId');

  let platformId = localStorage.getItem("platformId");
    if (platformId == null || platformId == 'null') {
      platformId = PlatFormType.Collabtic;
    }
    if (platformId == PlatFormType.Collabtic) {
      this.collabticApi = Constant.CollabticApiUrl;
    } else if (platformId == PlatFormType.MahleForum) {
      this.collabticApi = Constant.TechproMahleApi;
    } else if (platformId == PlatFormType.CbaForum) {
      this.collabticApi = Constant.CbaApiUri;
    } else if (platformId == PlatFormType.KiaForum) {
      this.collabticApi = Constant.KiaApiUri;
    } else {
      this.collabticApi = Constant.CollabticApiUrl;
    }

  this.postEditApiData = {
    access: this.pageAccess,
    pageAccess: this.pageAccess,
    apiKey: Constant.ApiKey,
    domainId: this.domainId,
    countryId: this.countryId,
    userId: this.userId,
    contentType: this.contentType,
    displayOrder: this.displayOrder,
    uploadedItems: [],
    attachments: [],
    attachmentItems: [],
    updatedAttachments: [],
    deletedFileIds: [],
    removeFileIds: []
  };

  this.openPresetsAction(this.presetType,this.presetId);
  this.setScreenHeight();
  this.getYearsList();
  this.getWorkstreamLists();
  this.industryType = this.commonApi.getIndustryType();

   this.titleService.setTitle(
    localStorage.getItem("platformName") + " - " + this.headTitle
  );

  this.subscription.add(
    this.commonApi.presetsUploadDataReceivedSubject.subscribe((response) => {
      console.log(response);
      this.addPresetsFlag  = false;
      let presetId = (this.presetType == 'edit') ? this.presetId : response['presetId'];
      this.resetForm();
      this.openPresetsAction('view', presetId, true);
      document.body.classList.remove("manage-popup-new");
    })
    );

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

  selectedItems(event,type){
    console.log(event) ;
    switch(type){
      case 'workstream':
        let currentSelection = event.value;
        this.workstreamId = [];
        this.workstreamSelection = [];
        this.workstreamSelection = currentSelection;
        for (let cs of currentSelection) {
          this.workstreamId.push(cs.id);
        }
        console.log(this.workstreamSelection) ;
        console.log(this.workstreamId) ;
        if(this.industryType.id != 1){
          this.manufacturerId = [];
          this.manufacturerName = [];
          this.manufacturerSelectionArr = [];
          this.manufacturerSelection = [];
          this.presetsForm.value.manufacturer = "";
          this.getMfgList();
        }
        this.presetsForm.value.make = "";
        this.make = '';
        this.presetsForm.value.model = "";
        this.modelName = [];
        this.presetsForm.value.year = "";
        this.year = '';
        this.onChange();
        this.getProdTypes();
      break;
      case 'make':
        console.log(event.value) ;
        console.log(this.make) ;
        this.presetsForm.value.model = "";
        this.modelName = [];
        this.presetsForm.value.year = "";
        this.year = '';
      break;
      case 'manufacturer':
        let currentSelect = event.value;
        this.manufacturerId = [];
        this.manufacturerName = [];
        this.manufacturerSelectionArr = [];
        this.manufacturerSelection = [];
        this.manufacturerSelection = currentSelect;
        this.manufacturerSelectionArr.push({
          id:currentSelect['id'],
          name:currentSelect['name']
        })
        this.manufacturerId.push(currentSelect['id']);
        this.manufacturerName.push(currentSelect['name']);
        console.log(this.manufacturerSelection) ;
        console.log(this.manufacturerSelectionArr) ;
        console.log(this.presetsForm.value.manufacturer);
        this.presetsForm.value.make = "";
        this.make = '';
        this.presetsForm.value.model = "";
        this.modelName = [];
        this.presetsForm.value.year = "";
        this.year = '';
        this.getProdTypes();
      break;
    }

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

  // Get Mfg List
  getMfgList(make='') {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("workstreamsList", JSON.stringify(this.workstreamId));
    apiFormData.append('makeName', '');
    this.LandingpagewidgetsAPI.getMfgList(apiFormData).subscribe((response) => {
      let resultData = response.items;
      this.manufacturers = [];
      for (let p of resultData) {
        let optionName = (p.alterMfgId == 0) ? p.originalName : p.name;
        this.manufacturers.push({
            id: p.id,
            name: optionName,
          });
      }
    });
  }

    // Get Product Types
    getProdTypes() {
      const apiFormData = new FormData();
      apiFormData.append("apiKey", Constant.ApiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("countryId", this.countryId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("workstreamsList", JSON.stringify(this.workstreamId));
      if(this.industryType.id != 1){
        apiFormData.append("manufacturer", JSON.stringify(this.manufacturerId));
      }

      this.LandingpagewidgetsAPI.getProductMakeListsAPI(apiFormData).subscribe(
        (response) => {
          if (response.status == "Success") {
            console.log(response);
            this.loading = false;
            let resultData = response.modelData;
            this.makes = [];
            for (let p of resultData) {
              this.makes.push({
                id: p.makeName,
                name: p.makeName,
            });
          }
        }
      });
    }

  // event tab/click
  presetAction(event){
    console.log(event);
    let presetType = event.presetType;
    let presetPushAction = event.presetPushAction;
    let presetId = event.presetId;
    if(presetType == 'emit'){
      let data = {
        presetData : event.presetData,
        action: true
      }
      this.presetsServices.emit(data);
    }
    else{
      this.openPresetsAction(presetType,presetId,presetPushAction);
    }
  }

  openPresetsAction(type, id='',push=false,action=''){
    this.presetType = type;
    this.newFlag = false;
    this.editFlag = false;
    this.viewFlag = false;
    this.emptyFlag = false;
    switch(this.presetType){
      case 'new':
        this.presetId = '';
        this.newFlag = true;
        this.headTitle = "New Preset";
        this.titleService.setTitle(localStorage.getItem("platformName") + " - " + this.headTitle);
        this.loadFormControl();
        this.resetForm();
        this.loading = false;
        break;
      case 'edit':
        this.headTitle = "Edit Preset";
        this.editFlag = true;
        this.loading = true;
        this.titleService.setTitle(localStorage.getItem("platformName") + " - " + this.headTitle);
        this.presetId = id;
        if(this.presetId != ''){
          this.presetsEdit();
        }
        break;
      case 'view':
        this.presetId = '';
        this.headTitle = "Presets";
        this.titleService.setTitle(localStorage.getItem("platformName") + " - " + this.headTitle);
        this.viewFlag = true;
        let data = {};
        data = {
          presetAction: action,
          presetPushAction: push,
          presetId: id,
        };
       setTimeout(() => {
        this.loading = false;
        this.commonApi.emitPresetsListCallData(data);
       }, 500);
        break;
     }
  }

  loadFormControl(){
    if(this.industryType.id != 1){
      this.presetsForm = this.formBuilder.group({
        workstream: [this.workstreamSelection, []],
        title: [this.title, []],
        description: [this.description, []],
        manufacturer: [this.manufacturerSelection, []],
        make: [this.make, []],
        model: [this.modelName, []],
        year: [this.year, []],
      });
    }
    else{
      this.presetsForm = this.formBuilder.group({
        workstream: [this.workstreamSelection, []],
        title: [this.title, []],
        description: [this.description, []],
        make: [this.make, []],
        model: [this.modelName, []],
        year: [this.year, []],
      });
    }

  }
  presetsEdit(){
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('presetId', this.presetId);

    this.threadPostService.presetList(apiFormData).subscribe(res => {

      if(res.status=='Success'){
          console.log(res.items[0]);

          if(res.total == 0){
             this.loading = false;
             this.emptyFlag = true;
             this.newFlag = false;
             this.editFlag = false;
             this.viewFlag = false;
          }
          else{

            this.emptyFlag = false;

            this.presetsEditData = res.items[0];

            this.workstreamName = [];
            this.workstreamId = [];
            if(this.presetsEditData['WorkstreamsList'].length>0){
              this.workstreamSelection = [];
              for(let ws of this.presetsEditData['WorkstreamsList']) {
                this.workstreamName.push(ws.workstreamName);
                this.workstreamId.push(ws.workstreamId);
                this.workstreamSelection.push({
                  id:ws.workstreamId,
                  name:ws.workstreamName,
                })
              }
            }

            this.manufacturerId = [];
            this.manufacturerName = [];
            this.manufacturerSelectionArr = [];
            let manufacturerSelection = [];
            manufacturerSelection = this.presetsEditData['manufacturer'] == '' ?  manufacturerSelection : JSON.parse(this.presetsEditData['manufacturer']);
            if(manufacturerSelection.length>0){
              this.manufacturerSelectionArr = manufacturerSelection;
              for(let mfg of manufacturerSelection) {
                this.manufacturerId.push(mfg.id);
                this.manufacturerName.push(mfg.name);
                this.manufacturerSelection = {
                  id:mfg.id,
                  name:mfg.name,
                };
              }
            }

            var makeJSON = this.testJSON(this.presetsEditData['make']);
            if(makeJSON){
              let makeArr = JSON.parse(this.presetsEditData['make']);
              for(let m of makeArr) {
                this.make = m.name;
              }
            }
            else{
              this.make = this.presetsEditData['make'];
            }
            this.modelName = this.presetsEditData['model'];
            this.year = this.presetsEditData['year'];

            this.description = this.presetsEditData['content'];
            this.title = this.presetsEditData['title'];

            this.EditAttachmentAction = 'attachments';
            this.attachmentItems = [];
            if(this.presetsEditData['uploadContents'] && this.presetsEditData['uploadContents'].length>0){
              this.attachments = this.presetsEditData['uploadContents'];
              this.attachmentItems  = this.presetsEditData['uploadContents'];
            }

            if(this.industryType.id != 1){
              this.getMfgList();
            }
            setTimeout(() => {
              this.getProdTypes();
            }, 500);
            setTimeout(() => {
              this.loadFormControl();
              this.loading = false;
            }, 1000);

          }
      }
      else{

      }

    },
    (error => {})
    );

  }



  testJSON(text){
    if (typeof text!=="string"){
        return false;
    }
    try{
        var json = JSON.parse(text);
        return (typeof json === 'object');
    }
    catch (error){
        return false;
    }
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

  onChange(type=''){
    this.addPresetsFlag = false;
    if(this.presetsForm.value.description.trim()!='' && this.presetsForm.value.title.trim()!= '' && this.workstreamId.length>0){
      this.addPresetsFlag = true;
    }
  }

  onChangeSelection(type){

    let inputData = {};
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };
    let title = '';

    switch(type){


          case 'model':
            title = 'Model';
            apiData['workstreamsList'] = JSON.stringify(this.workstreamId);
            apiData['make'] = this.make;
            inputData = {
              baseApiUrl: this.collabticApi,
              apiUrl: this.collabticApi+"/"+Constant.partUrl,
              field: 'model',
              selectionType: "single",
              filteredItems: this.modelName,
              filteredLists: this.modelName,
              actionApiName: "",
              actionQueryValues: "",
              title: title
            };
         break;
    }

    document.body.classList.add("manage-popup-new");
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = this.innerHeight;
    modalRef.componentInstance.access = "newthread";

    if(type == 'model'){
      modalRef.componentInstance.filteredTags = this.modelName;
      modalRef.componentInstance.filteredLists = this.modelName;
    }
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {

      let tagItems = receivedService;
      console.log(tagItems)
      let idArr = [];
      let idNameArr = [];
      let nameArr = [];
      if(tagItems.length>0){
        for (let t in tagItems) {
          nameArr.push(tagItems[t].name);
          idArr.push(tagItems[t].id);
          idNameArr.push({id:tagItems[t].id, name: tagItems[t].name});
        }
        if(type == 'model'){
          this.modelName = nameArr;
        }
      }
    });

    if(this.presetType == 'edit' && this.presetId != ''){
      this.addPresetsFlag = true;
    }
  }

  resetForm(){
    this.manageAction = "";
    this.uploadedItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds  = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;
    this.postEditApiData = {
      access: this.pageAccess,
      pageAccess: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.postEditApiData['uploadedItems'] = this.uploadedItems;
    this.postEditApiData['attachments'] = this.uploadedItems;
    this.editPostUpload = false;
    setTimeout(() => {
      this.editPostUpload = true;
    }, 100);
    this.workstreamId = [];
    this.workstreamName = [];
    this.workstreamSelection = [];
    this.manufacturers = [];
    this.makes = [];
    this.modelName = [];
    this.make = '';
    this.year = '';
    this.title = '';
    this.description = '';
    this.manufacturerSelection = [];
    this.manufacturerId = [];
    this.manufacturerName = [];
  }
  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = this.bodyHeight-148;
   }
  // Cancel Action
  cancelPresets() {
    document.body.classList.add("manage-popup-new");
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      document.body.classList.remove("manage-popup-new");
      if(!receivedService) {
        return;
      } else {
        this.openPresetsAction('view','',false,'visibile');
      }
    });
  }

  closePresets() {
    let data = {
      action: false
    };
    this.presetsServices.emit(data);
  }

  addPresets(){

    if(this.addPresetsFlag){


      let apiData = new FormData();
      this.imageFlag = 'true';

      if(this.uploadedItems != '') {
        if(this.uploadedItems.items.length>0){
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
                this.addPresetsFlag = false
                return false;
              }

          //}
        }
      }
      let uploadCount = 0;
      this.mediaUploadItems = [];
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
      console.log(uploadCount, this.uploadedItems);

      document.body.classList.add("manage-popup-new");
      document.body.classList.add(this.bodyClass2);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );

      apiData.append('apiKey', Constant.ApiKey);
      apiData.append('domainId', this.domainId);
      apiData.append('countryId', this.countryId);
      apiData.append('userId', this.userId);
      if(this.presetType == 'edit' && this.presetId != ''){
        apiData.append('presetId', this.presetId);
        apiData.append('deleteMediaId', JSON.stringify(this.deletedFileIds));
        apiData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
        apiData.append('deletedFileIds',  JSON.stringify(this.deletedFileIds));
        apiData.append('removeFileIds',  JSON.stringify(this.removeFileIds));
      }
      apiData.append('groups',  JSON.stringify(this.workstreamId));
      apiData.append('description', this.presetsForm.value.description.trim());
      apiData.append('title', this.presetsForm.value.title.trim());

      if(this.industryType.id != 1){
        let manufacturer = this.presetsForm.value.manufacturer == '' ? '' : JSON.stringify(this.manufacturerSelectionArr)
        apiData.append('manufacturer', manufacturer);
      }

      apiData.append('make',  this.presetsForm.value.make);
      apiData.append('model', this.presetsForm.value.model);
      apiData.append('year', this.presetsForm.value.year);
      apiData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));

      //new Response(apiData).text().then(console.log)
      //return false;

     this.threadPostService.saveTechSupportPresets(apiData).subscribe((response) => {
      modalRef.dismiss("Cross click");
      document.body.classList.remove(this.bodyClass2);
      if(response.status == 'Success') {
        this.presetId= response.presetId;
        if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
          this.editPostUpload = false;
          this.postEditApiData['uploadedItems'] = this.uploadedItems.items;
          this.postEditApiData['attachments'] = this.uploadedItems.attachments;
          this.postEditApiData['message'] = response.result;
          this.postEditApiData['presetId'] = response.presetId;
          this.postEditApiData['dataId'] = response.presetId;
          this.manageAction = 'uploading';
          this.postEditApiData['threadAction'] = 'new';
          setTimeout(() => {
            this.editPostUpload = true;
          }, 100);
        }
        else{
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = response.result;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              document.body.classList.remove("manage-popup-new");
              this.addPresetsFlag  = false;
              let presetId = (this.presetType == 'edit') ? this.presetId : response.presetId;
              this.resetForm();
              this.openPresetsAction('view', presetId, true);
              //this.presetsServices.emit(response);
            }, 1000);
        }
      }
      else{
        this.addPresetsFlag  = false;
      }
      });
    }
  }


  dropEvent(event,tfData)
  {

   let files = event.dataTransfer.files;
   if (files.length > 0) {
    // this.onFileDropped.emit(files)
    this.uploadDataEvebt(files,tfData);
//console.log(files);

   }

  }
  validateFile(files: Array<any>): boolean {
    return true;
  }
  getAttachmentType(filetype) {

    if (filetype.indexOf('image') !== -1) {
      return AttachmentType.image;
    }
    if (filetype.indexOf('video') !== -1) {
      return AttachmentType.video;
    }
    if (filetype.indexOf('audio') !== -1) {
      return AttachmentType.voice;
    }
    return AttachmentType.other;
  }
  attachmentTouploadList: FileData[] = [];
  uploadDataEvebt(event,tfData) {
    console.log(event);
    let attachmentLocalUrl: any;
    if (this.validateFile(event)) {
      this.editorProgressUpload=1;
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        let filedata = new FileData();
        filedata.file = element;
        filedata.fileName = element.name;
        filedata.filesize = element.size;
        filedata.fileType = element.type;
        filedata.attachmentType = this.getAttachmentType(element.type);
        let lastDot = element.name.lastIndexOf('.');
        let fileName = element.name.substring(0, lastDot);
        filedata.fileCaption = element.name;
        var reader = new FileReader();
        //this.imagePath = files;
        reader.readAsDataURL(element);
        reader.onload = (_event) => {
          //  attachmentLocalUrl = reader.result;
          filedata.localurl = _event.target.result;
          this.attachmentTouploadList.push(filedata);
          console.log(this.attachmentTouploadList);
          console.log(tfData,filedata.fileName);
          const formData: FormData = new FormData();
            formData.append('upload', filedata.file);
          this.httpClient.post<any>(this.apiUrl.uploadURL, formData).subscribe(res => {

            if(res.url)
            {

                let linkadded='<p><a href="'+res.url+'" target="_blank">'+filedata.fileName+'</a></p>';

               // tfData.selectedValues=tfData.selectedValues+''+linkadded;
              //  tfData.selectedVal=tfData.selectedVal+''+linkadded;
               // tfData.selectedValueIds=tfData.selectedValueIds+''+linkadded;
              //  tfData.valid=true;
              this.description=this.description+linkadded;


              localStorage.setItem('returnOnchange','1');
              this.editorProgressUpload=0;
                   setTimeout(() => {

                  localStorage.removeItem('returnOnchange');

                },500);
                //this.onChange('', '', '', 'val', '','',false,-1,-1,'','1');

            }
            else
            {
              this.editorProgressUpload=0;

            }
            console.log(res.url);
          });
          //this.uploadFile(filedata,filedata.file);

        };

      }

    }
    //this.fileInput.nativeElement.value = '';
  }
  editAttachments(items) {
    if(items.action == 'insert') {
      let minfo = items.media;
      let mindex = this.attachmentItems.findIndex(option => option.fileId == minfo.fileId);
      if(mindex < 0) {
        this.attachmentItems.push(minfo);
        this.editPostUpload = false;
        setTimeout(() => {
          this.editPostUpload = true;
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
      this.editPostUpload = false;
        setTimeout(() => {
          this.editPostUpload = true;
        }, 10);
      this.deletedFileIds.push(items.media);
    } else {
      this.uploadedItems = items;
    }
    if(this.presetType == 'edit' && this.presetId != ''){
      this.addPresetsFlag = true;
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
      case "file-remove":
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
  ngOnDestroy() {
     this.subscription.unsubscribe();
     this.apiUrl.attachmentNewPOPUP = false;
  }
}
export class FileData {
  file: any;
  fileName: string;
  filenamewithoutextension: string;
  filesize: number;
  fileType: string;
  localurl: any;
  progress: number;
  uploadStatus: number;
  fileCaption: string;
  attachmentEditStatus: boolean;
  attachmentType: number;

}
