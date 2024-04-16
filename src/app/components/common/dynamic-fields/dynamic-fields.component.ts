import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { ApiService } from '../../../services/api/api.service';
import { CommonService } from '../../../services/common/common.service';
import { SibService } from "src/app/services/sib/sib.service";
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import * as ClassicEditor from "src/build/ckeditor";
import { Constant, PlatFormType,AttachmentType } from 'src/app/common/constant/constant';
import { UploadService } from 'src/app/services/upload/upload.service';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { ThreadService } from 'src/app/services/thread/thread.service';

@Component({
  selector: 'app-dynamic-fields',
  templateUrl: './dynamic-fields.component.html',
  styleUrls: ['./dynamic-fields.component.scss']
})

export class DynamicFieldsComponent implements OnInit, OnDestroy {

  @Input() pageInfo: any = "";
  @Input() formType: any = "";
  @Input() secIndex: any = "";
  @Input() fieldSec: any = "";
  @Input() selectedTrainingMode: any = "";
  @Input() zoomEmail: any = "";
  @Input() policies: any = [];
  @Input() selectedPolicies: any = [];
  public bodyElem;
  public bannerField;
  public bannerFieldIndex;
  public bodyClass: string = "submit-loader";
  public bodyClass1:string = "profile";
  public bodyClass2:string = "image-cropper";
  public selectedPartsImg: File;
  @Input() actionField: boolean = false;
  @Input() public formGroup: FormGroup;
  @Input() public apiFormFields: any = [];
  @Input() public trainingManual: any;
  @Input() public formFields: any = [];
  @Input() public secTabStatus: any = [];
  @Input() public miniumStartDate: any = new Date();
  @Input() public miniumEndDate: any = new Date();
  @Input() public miniumExpiryDateBird: any = new Date();
  @Input() public maximumEndDate: any = '';
  @Input() public maximumStartDate: any = '';
  @Input() public showStartDateValidation: any = false;
  @Input() public showPriceError: any = false;
  @Input() public showBirdPriceValidation: any = false;
  @Input() public showManualDiscountPriceValidation: any = false;
  @Input() public showBirdPercentageValidation: any = false;
  @Input() marketPlaceimgUrl: any;
  @Input() marketPlaceimgName: any;
  @Input() selectedMarketPlaceBanner: any;
  @Input() customValidationMsg: any;
  @Input() showCustomValidation: any;
  @Input() birdValue: any;
  @Input() manualName: any;
  @Input() salesPersonNames: any;
  @Input() manualDiscountPrice: any;
  @Input() birdPercentage: any;
  @Input() public countryDropdownData: any = [];
  @Input() public stateDropdownData: any = [];
  @Input() salesPersonsList:any = [];
  @Input() isTrainingFromList: boolean = false;
  @Input() ismanualFromList: boolean = false;
  @Input() trainingsTitleListGet:any;
  @Input() threadInfo: any = true;
  @Input() duplicateMarketPlace: any = false;
  @Output() manualFromListEvent = new EventEmitter<boolean>();
  @Output() showManualsPopup = new EventEmitter<any>();
  @Output() removeLinkedManual = new EventEmitter<any>();
  @Output() removeSalesPerson = new EventEmitter<any>();
  @Output() sendFileData = new EventEmitter<any>();
  @Output() sendTrainingModeValue = new EventEmitter<any>();
  @Output() sendTimeZoneValue = new EventEmitter<any>();
  @Output() sendStartTimeValue = new EventEmitter<any>();
  @Output() sendEndTimeValue = new EventEmitter<any>();
  @Output() sendInPersonStartTimeValue = new EventEmitter<any>();
  @Output() sendNormalStartTimeValue = new EventEmitter<any>();
  @Output() sendNormalEndTimeValue = new EventEmitter<any>();
  @Output() sendFreeValue = new EventEmitter<any>();
  @Output() sendIsBirdPriceValue = new EventEmitter<any>();
  @Output() sendBirdPriceValue = new EventEmitter<any>();
  @Output() sendManualDiscountPriceValue = new EventEmitter<any>();
  @Output() sendBirdPriceFocus = new EventEmitter<any>();
  @Output() sendRegularPrice = new EventEmitter<any>();
  @Output() sendBirdPercentageValue = new EventEmitter<any>();
  @Output() sendBirdPercentageFocus = new EventEmitter<any>();
  @Output() sendStartDateValue = new EventEmitter<any>();
  @Output() sendEndDateValue = new EventEmitter<any>();
  @Output() sendMaxParticipantsValue = new EventEmitter<any>();
  @Output() setStateDropdown = new EventEmitter<any>();
  @Output() showSalesPersonPopup = new EventEmitter<any>();
  @Output() sendIsIncludedWithTraining = new EventEmitter<any>();
  @Output() forTrainingOnly = new EventEmitter<any>();
  @Output() scrollBarEvent = new EventEmitter<any>();
  @Output() manualNameEvent = new EventEmitter<any>();
  @Output() previewPolicyEmit = new EventEmitter<any>();
  @Output() sameNameValidator = new EventEmitter<any>();
  @Output() trainingsTitleListPass = new EventEmitter<any>();
  @ViewChild("customAuto") customAuto: ElementRef;
  subscription: Subscription = new Subscription();
  public collabticDomain: boolean = false;
  public CBADomain: boolean = false;
  public minDate: any = '';
  public panelWidth: any = 0;
  public editorProgressUpload=0;
  webForm: FormGroup;
  public baseApiUrl: string = "";
  public baseV3ApiUrl: string = "";
  public makeInterval: any;
  public apiUrl: string = "";
  public responseData: any = [];
  public apiFields: any = [];
  public apiData: any = [];
  public step: string = "";
  public stepIndex: number;
  public step1Submitted:boolean = false;
  public step2Submitted:boolean = false;
  public toggleLabel: string = "No";
  public manageAction: string = "";
  public EditAttachmentAction: string = "attachments";
  public sibAttachmentAction: string = "view";
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public audioUploadedItems: any = [];
  public audioAttachmentItems: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public displayOrder: number = 0;
  public threadUpload: boolean = true;
  public attachmentFlag: boolean = true;
  public audioAttachmentFlag: boolean = false;
  public audioAttachmentViewFlag: boolean = false;
  public requiredTxt: string = "Required";
  public dateFormat:string = "MM-DD-YYYY";
  public industryType: any = "";
  public sibAccess: string = "sib";
  public serverErrorMsg: string = '';
  public serverError: boolean = false;
  public datePickerDisableFlag: boolean = true;
  public datePickerConfig: any = {
    format: this.dateFormat,
    min: this.minDate,
    disabled: true
  }
  public sibattachmentFlag: boolean = true;
  public tvsDomain: boolean = false;
  public tvsIBDomain: boolean = false;
  public selectedBannerImg : File;
  public defaultBanner: boolean = false;
  public defImgURL: any = 'assets/images/common/default-part-banner.png';
  public imgURL: any;
  public imgName: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public showAllWS: boolean = true;
  public birdPriceInitialized: boolean = false;
  public birdPriceDiscountInitialized: boolean = false;

  public textColorValues = [
    {color: "rgb(0, 0, 0)"},
    {color: "rgb(230, 0, 0)"},
    {color: "rgb(255, 153, 0)"},
    {color: "rgb(255, 255, 0)"},
    {color: "rgb(0, 138, 0)"},
    {color: "rgb(0, 102, 204)"},
    {color: "rgb(153, 51, 255)"},
    {color: "rgb(255, 255, 255)"},
    {color: "rgb(250, 204, 204)"},
    {color: "rgb(255, 235, 204)"},
    {color: "rgb(255, 255, 204)"},
    {color: "rgb(204, 232, 204)"},
    {color: "rgb(204, 224, 245)"},
    {color: "rgb(235, 214, 255)"},
    {color: "rgb(187, 187, 187)"},
    {color: "rgb(240, 102, 102)"},
    {color: "rgb(255, 194, 102)"},
    {color: "rgb(255, 255, 102)"},
    {color: "rgb(102, 185, 102)"},
    {color: "rgb(102, 163, 224)"},
    {color: "rgb(194, 133, 255)"},
    {color: "rgb(136, 136, 136)"},
    {color: "rgb(161, 0, 0)"},
    {color: "rgb(178, 107, 0)"},
    {color: "rgb(178, 178, 0)"},
    {color: "rgb(0, 97, 0)"},
    {color: "rgb(0, 71, 178)"},
    {color: "rgb(107, 36, 178)"},
    {color: "rgb(68, 68, 68)"},
    {color: "rgb(92, 0, 0)"},
    {color: "rgb(102, 61, 0)"},
    {color: "rgb(102, 102, 0)"},
    {color: "rgb(0, 55, 0)"},
    {color: "rgb(0, 41, 102)"},
    {color: "rgb(61, 20, 102)"}
  ];

  // classicEditor
  public Editor = ClassicEditor;
  public platformId = localStorage.getItem("platformId");

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

  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Mat Slider Config
  autoTicks = false;
  disabled = false;
  invert = false;
  showTicks = true;
  thumbLabel = false;
  vertical = false;
  pendingInputText: string = '0/';
  minDateTime: any = {
    'inPersonEndTime0': new Date(),
    'inPersonEndTime1': new Date(),
    'inPersonEndTime2': new Date(),
    'inPersonEndTime3': new Date(),
    'inPersonEndTime4': new Date(),
    'inPersonEndTime5': new Date(),
    'inPersonEndTime6': new Date(),
    'endTime': new Date(),
  };
  manualsTitleList: any[] = [];
  filterdManualsTitle: any[] = [];
  trainingsTitleList: any[] = [];
  filterdTrainingsTitle: any = [];
  filterdTrainingsName: any = [];
  filterdTrainingsSku: any = [];
  filterdManualsName: any;
  filterdManualsSku: any;

  constructor(
    private api: ApiService,
    private commonApi: CommonService,
    private sibApi: SibService,
    private modalService: NgbModal,
    private httpClient:HttpClient,
    private config: NgbModalConfig,
    private uploadService: UploadService,
    private threadApi: ThreadService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  // convenience getters for easy access to form fields
  get f() { return this.webForm.controls; }
  dropEvent(event,tfData)
  {
   // console.log(event);
   // alert(222);
   let files = event.dataTransfer.files;
   if (files.length > 0) {
    // this.onFileDropped.emit(files)
    this.uploadDataEvebt(files,tfData);
//console.log(files);

   }

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

  previewPolicy(index) {
    this.previewPolicyEmit.emit(this.apiFormFields[this.stepIndex].selectedIds[index].id);
  }

  validateFile(files: Array<any>): boolean {
    for (const item of files) {
      if (item.type == '') {
        this.invalidFile = true;
        this.invalidFileErr = 'Invalid file format';
        return false;
      }
      this.invalidFile = false;
    }
    var _validFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', 'tif', '.mp4', '.avi', 'mpg', 'mpeg', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'txt', 'zip', 'docx', 'doc', 'html', 'mp3'];
    let blnValid: Boolean = false;
    for (const item of files) {
      for (let j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (item.name.substr(item.name.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (blnValid == false) {
        this.invalidFile = true;
        this.invalidFileErr = 'Invalid file format';
        return false;
      }
    }
    return true;
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
          this.httpClient.post<any>(this.api.uploadURL, formData).subscribe(res => {

            if(res.url)
            {
              if(tfData.isEditor == 1 && tfData.isRichEditor == 1)
              {
                let linkadded='<p><a href="'+res.url+'" target="_blank">'+filedata.fileName+'</a></p>';

                tfData.selectedValues=tfData.selectedValues+''+linkadded;
                tfData.selectedVal=tfData.selectedVal+''+linkadded;
                tfData.selectedValueIds=tfData.selectedValueIds+''+linkadded;
                tfData.valid=true;
              localStorage.setItem('returnOnchange','1');
              this.editorProgressUpload=0;
                setTimeout(() => {

                  localStorage.removeItem('returnOnchange');

                },500);
                //this.onChange('', '', '', 'val', '','',false,-1,-1,'','1');
              }
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

  ngOnInit(): void {
    this.panelWidth = this.pageInfo.panelWidth;
    this.webForm = this.formGroup;
    let trainingMode = '';

    if (this.webForm?.value?.trainingMode) {
      trainingMode = this.webForm?.value?.trainingMode;
    }
    if (this.pageInfo?.domainId == 71 && trainingMode == 'Webinar') {
      this.webForm.get('zoomEmail').setValue(this.zoomEmail);
      this.webForm.get('zoomEmail').disable();
    } else if (this.webForm.get('zoomEmail')) {
      this.webForm.get('zoomEmail').enable();
    }

    this.baseApiUrl = this.pageInfo.baseApiUrl;
    this.baseV3ApiUrl = this.pageInfo.baseV3ApiUrl;
    this.step1Submitted = this.pageInfo.step1Submitted;
    this.step2Submitted = this.pageInfo.step2Submitted;
    this.apiFields = this.pageInfo.apiFormFields;
    this.manageAction = this.pageInfo.manageAction;
    this.threadUpload = this.pageInfo.threadUpload;
    this.industryType = this.commonApi.getIndustryType();
    this.step = this.pageInfo.step;
    this.stepIndex = this.pageInfo.stepIndex;
    this.attachmentItems = this.pageInfo.attachmentItems;
    this.audioAttachmentItems = (this.pageInfo.audioAttachmentItems == undefined || this.pageInfo.audioAttachmentItems == 'undefined') ? [] : this.pageInfo.audioAttachmentItems;
    console.log(this.apiFormFields, this.pageInfo, this.industryType, this.webForm)
    console.log(this.audioAttachmentItems)
    this.audioAttachmentFlag = (this.audioAttachmentItems.length == 0) ? true : false;
    this.audioAttachmentViewFlag = (this.audioAttachmentItems.length > 0) ? true : false;
    //console.log(this.pageInfo, this.industryType)
	  let platformId = localStorage.getItem('platformId');
    if(this.pageInfo.domainId == '52' && platformId == '2' ){
      this.tvsDomain = true;
    }
    if(this.pageInfo.domainId == '97' && platformId == '2' ){
      this.tvsIBDomain = true;
      this.showAllWS = false;
    }
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;

    this.responseData = {
      action: '',
      type: 'field',
      step: this.step,
      stepIndex: this.stepIndex,
      sectionIndex: this.secIndex,
      fieldSec: this.fieldSec,
      addRow: false,
      addSection: false,
      actionSecIndex: -1,
      rowIndex: -1,
      makeItems: []
    }

    this.apiData = {
      apiKey: this.pageInfo.apiKey,
      apikey: this.pageInfo.apiKey,
      domainId: this.pageInfo.domainId,
      countryId: this.pageInfo.countryId,
      userId: this.pageInfo.userId,
      uploadedItems: this.pageInfo.uploadedItems,
      attachments: this.pageInfo.attachments,
      access: this.pageInfo.access,
      displayOrder: this.displayOrder,
      solrType: this.pageInfo.solrType
    };

    let today = moment().add(1, 'd');
    this.minDate = moment(today).format('MM-DD-YYYY');
    if(this.actionField) {
      console.log(this.apiFormFields)
    }
    let apiFormFields = (this.actionField) ? this.apiFormFields.cells.sib : this.apiFormFields;
    if (this.pageInfo.access == 'market-place' || this.pageInfo.access == 'manual') {
      this.imgURL = this.marketPlaceimgUrl;
      this.imgName = this.marketPlaceimgName;
      this.selectedBannerImg = this.selectedMarketPlaceBanner;
    }
    for(let f of apiFormFields) {
      console.log(apiFormFields)
      switch(f.fieldName) {
        case 'policies':
          this.selectedItems('policies', this.selectedPolicies);
          break;
        case 'threadType':
        case 'helpType':
          if(f.selectedVal == '') {
            for(let i of f.itemValues) {
              i.isActive = false;
            }
          } else {
            for(let i of f.itemValues) {
              if(f.selectedVal == i.apiValue) {
                i.isActive = true;
              }
            }
          }
          break;
        case 'workstreams':
        case 'ThreadCategory':
          if(f.squareBoxType == 1 && this.CBADomain){
            if(f.selectedValues == '') {
              for(let i of f.itemValues) {
                i.isActive = false;
              }
            } else {
              if(Array.isArray(f.selectedIds)) {
                for(let i of f.selectedIds) {
                  if(f.selectedValues == i.id) {
                    i.isActive = true;
                  }
                }
              }
            }
          }
          break
        case 'expiryDate':
          if(this.industryType.id == 3) {
            this.dateFormat = f.expiryDateFormat;
          }
          //this.dateFormat = (this.manageAction == 'new') ? f.expiryDateFormat : "yy-mm-dd";
          //this.dateFormat = (this.manageAction == 'new') ? f.expiryDateFormat : this.dateFormat;
          this.datePickerConfig.format = this.dateFormat;
          this.datePickerConfig.min = this.minDate;
          break;
        case 'manualPurchase':
          if (f.selectedVal == '' || !f.selectedVal) {
            for (let i of f.itemValues) {
              if (i.id == 1) f.selectedVal = i.id;
            }
          }
          break;
        case 'forTrainingOnly':
          console.log(f)
          if (f.selectedVal == '' || !f.selectedVal) {
              f.selectedVal = f.itemValues[0].id;
          }
          break;
        case 'manualName':
          this.threadApi.apiGetAllManualsTitle(this.pageInfo.domainId).subscribe((response) => {
            if (response.status == "Success") {
              this.manualsTitleList = response.data.marketPlaceData.filter((res) => res.manualName && res.sku);
              this.filterdManualsTitle = this.manualsTitleList;
              this.filterdManualsName = this.manualsTitleList.map((res) => res.manualName);
              this.filterdManualsSku = this.manualsTitleList.map((res) => res.sku);
              if (this.filterdManualsName.includes(this.webForm.get('manualName').value)) {
                this.manualFromListEvent.emit(true);
              }
            }
          }, (error: any) => {
            console.log(error);
          })
          /* for training's SKU (to test duplicate Entry) */
          this.threadApi.apiGetAllTrainingsTitle(this.pageInfo.domainId).subscribe((response) => {
            if (response.status == 'Success') {
              this.trainingsTitleList = response.data?.trainingList?.filter((res) => res.trainingName && res.sku);
            }
          })
          break;
        default:
          //this.datePickerConfig.format = this.dateFormat;
          //this.datePickerConfig.min = this.minDate;
        break;
      }

      if(this.apiFormFields.length > 0) {
        switch(f.fieldName) {
          case 'releaseDate':
          case 'startDate':
          case 'endDate':
            this.minDate = moment(today).format('DD-MM-YYYY');
            this.dateFormat = 'DD-MM-YYYY';
            this.datePickerConfig.format = this.dateFormat;
            //this.datePickerConfig.min = this.minDate;
            break;
        }
      }
      if (f.fieldName == 'trainingName') {
        this.threadApi.apiGetAllTrainingsTitle(this.pageInfo.domainId).subscribe((response) => {
          if (response.status == 'Success') {
            this.trainingsTitleList = response.data.trainingList.filter((res) => res.trainingName && res.sku);
            this.trainingsTitleListPass.emit(this.trainingsTitleList);
            this.filterdTrainingsTitle = this.trainingsTitleList;
            this.filterdTrainingsName = this.filterdTrainingsTitle.map((res)=>res.trainingName);
            this.filterdTrainingsSku  = this.filterdTrainingsTitle.map((res)=>res.sku);
          }
        }, (error: any) => {
          console.log(error);
        });
        /* for training's SKU (to test duplicate Entry) */
        this.threadApi.apiGetAllManualsTitle(this.pageInfo.domainId).subscribe((response) => {
          if (response.status == "Success") {
            this.manualsTitleList = response.data.marketPlaceData.filter((res) => res.manualName && res.sku);
          }
        })
        this.valueChange(f.selectedValues);
      }
    }

    this.subscription.add(
      this.commonApi.dynamicFieldDataReceivedSubject.subscribe((response) => {
        console.log(response);
        let action = response['action'];
        this.step1Submitted = response['step1Submitted'];
        this.step2Submitted = response['step2Submitted'];
        this.webForm = response['formGroup'];
        this.pageInfo = response['pageInfo'];
        this.panelWidth = this.pageInfo.panelWidth-50;
        this.manageAction = this.pageInfo.manageAction;
        this.threadUpload = this.pageInfo.threadUpload;
        this.updatedAttachments = this.pageInfo.updatedAttachments;
        this.step = this.pageInfo.step;

        if(this.pageInfo.access == 'knowledge-base' || this.pageInfo.access == 'documents' || this.pageInfo.access == 'adas-procedure') {
          console.log(this.pageInfo.bannerImage)
          this.imgURL = this.pageInfo.bannerImage != '' && this.pageInfo.bannerImage != 'undefined' && this.pageInfo.bannerImage != undefined && this.pageInfo.bannerImage != 'null' && this.pageInfo.bannerImage != null ? this.pageInfo.bannerImage : null ;
          this.selectedBannerImg = this.pageInfo.bannerImage != '' && this.pageInfo.bannerImage != 'undefined' && this.pageInfo.bannerImage != undefined && this.pageInfo.bannerImage != 'null' && this.pageInfo.bannerImage != null ? this.pageInfo.bannerFile: null;
          this.defaultBanner = this.pageInfo.defaultBanner;
          console.log(this.defaultBanner)
        }

        if(this.step == 'step1' && (action == 'sib-upload-success' || action == 'sib-attachment')) {
          switch(action) {
            case 'sib-upload-success':
            case 'sib-attachment':
              this.apiData.uploadedItems = [];
              this.apiData.attachments = [];
              this.uploadedItems = [];
              this.responseData.uploadedItems = this.uploadedItems;
              this.threadUpload = this.pageInfo.threadUpload;
              if(action == 'sib-attachment') {
                this.sibattachmentFlag = false;
                setTimeout(() => {
                  this.sibattachmentFlag = true;
                }, 50);
              }
              break;
          }
          return false;
        }
        //console.log(action, this.pageInfo)

        if(this.step == 'step2' || (action == 'document-submit' || action == 'adas-procedure-submit' || action == 'sib-submit')) {
          switch(action) {
            case 'add-row':
              this.actionField = false;
              this.apiFields = this.pageInfo.apiFormFields;
              console.log(response,this.apiFields)
              setTimeout(() => {
                this.actionField = true;
              }, 50);
              break;
            case 'thread-submit':
            case 'document-submit':
            case 'adas-procedure-submit':
            case 'sib-submit':
              this.attachmentItems = this.pageInfo.attachmentItems;
              this.apiData.contentType = this.pageInfo.contentType;
              this.apiData.dataId = this.pageInfo.dataId;
              this.apiData.threadId = this.pageInfo.threadId;
              this.apiData.uploadedItems = this.pageInfo.uploadedItems;
              this.apiData.attachments = this.pageInfo.attachments;
              this.apiData.displayOrder = this.displayOrder;
              this.apiData.navUrl = this.pageInfo.navUrl;
              this.apiData.message = this.pageInfo.message;
              this.apiData.threadAction = this.pageInfo.threadAction;
              if(action == 'thread-submit') {
                this.apiData['notificationAction'] = this.pageInfo.pushFlag;
                this.apiData['approveNotificationAction'] = this.pageInfo.approvePushFlag;
                if(this.pageInfo.approvePushFlag) {
                  this.apiData['approveStatusData'] = this.pageInfo.approveStatusData;
                }
              }
              if(action == 'document-submit' || action == 'adas-procedure-submit'){this.apiData.notificationAction = this.pageInfo.notificationAction;}
              if(action == 'sib-submit') {
                this.threadUpload = this.pageInfo.threadUpload;
                this.apiData.actionIndex = this.pageInfo.actionIndex;
                this.apiData.sibFields = this.pageInfo.sibFields;
                this.apiData.sibInfo = this.pageInfo.sibInfo;
              }
              this.apiData.bulkUpload = this.pageInfo.bulkUpload;
              setTimeout(() => {
                this.threadUpload = true;
              }, 250);
              setTimeout(() => {
                this.apiData.uploadedItems = [];
                this.apiData.attachments = [];
                this.uploadedItems = [];
                this.responseData.uploadedItems = this.uploadedItems;
              }, 2500);
              break;
            case 'submit':
              //console.log(this.apiData, this.threadUpload)
              this.apiData.uploadedItems = this.pageInfo.uploadedItems;
              this.apiData.attachments = this.pageInfo.attachments;
              this.updatedAttachments = this.pageInfo.updatedAttachments;
              break;
          }
        }
      })
    );
  }

  removeLinkedManualEmit(){
    this.removeLinkedManual.emit(true);
  }

  removeLinkedSalesPersonEmit(person){
    this.removeSalesPerson.emit(person);
  }

  // Recent Selection
  recentSelection(field, item, c) {
    let sitem = [item];
    let fname = field.fieldName;
    switch (fname) {
      case 'workstreams':
        if(field.squareBoxType == 1 && this.CBADomain){
          //console.log(field, item);
          let ftype1 = field.fieldType;
          let val1 = item.id;
          let optIndex1 = -1;
          let itemIndex1 = this.apiFormFields[c].itemValues.findIndex(option => option.id == val1);
          let fval1 = this.apiFormFields[c].itemValues[itemIndex1].id;
          this.onChange(ftype1, fname, c, fval1, optIndex1);
        }
        else{
          this.selectedItems(fname, sitem);
        }

        break;

      case 'make':
        //console.log(field, item);
        let ftype = field.fieldType;
        let val = item.genericProductName;
        let model = item.modelName;
        let year = item.modelYear;
        let optIndex = -1;
        let itemIndex = this.apiFormFields[c].itemValues.findIndex(option => option.name == val);
        let fval = this.apiFormFields[c].itemValues[itemIndex].id;
        this.onChange(ftype, fname, c, fval, optIndex);
        break;
    }
  }

  // Selected Items
  selectedItems(field, event) {
    console.log(field, event)
    let items: any = [];
    let itemVal: any = [];
    for(let e of event) {
      items.push(e.id);
      itemVal.push(e.name);
    }
    //console.log(event)
    console.log(items);
    console.log(itemVal);

    // avoid duplicate
    items = Array.from(new Set(items));
    itemVal = Array.from(new Set(itemVal));

    //console.log(items);
    //console.log(itemVal);

    this.setupSelecteditems(field, event, items, itemVal);
  }

  updateLogo(bannerField: any, bannerFieldIndex: any) {
    this.bannerField = bannerField;
    this.bannerFieldIndex = bannerFieldIndex;

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);

    const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.userId = this.pageInfo.userId;
    modalRef.componentInstance.domainId = this.pageInfo.domainId;
    switch(this.pageInfo.access) {
      case 'documents':
        modalRef.componentInstance.profileType = 'document-banner';
        modalRef.componentInstance.type = "";
        break;
      case 'adas-procedure':
        modalRef.componentInstance.profileType = 'adas-procedure-banner';
        modalRef.componentInstance.type = "";
        break;
      default:
        modalRef.componentInstance.profileType = 'banner-image-manual';
        modalRef.componentInstance.type = "Edit";
        break;  
    }
    modalRef.componentInstance.id = 0;
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        console.log(receivedService)
        let image = receivedService.show;
        let imageFile = receivedService.response;
        this.selectedMarketPlaceBanner = receivedService.response;
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass1);
        this.bodyElem.classList.remove(this.bodyClass2);
        modalRef.dismiss('Cross click');
        this.selectedPartsImg = imageFile;
        this.imgURL = image;
        this.imgName = null;
        this.marketPlaceimgUrl = image;
        this.marketPlaceimgName = null;
        this.defaultBanner = false;
        let event: any;
        if (this.pageInfo.access == 'documents' || this.pageInfo.access == 'adas-procedure') {
         this.responseData['bannerImage'] = this.imgURL;
         this.responseData['bannerFile'] = this.selectedMarketPlaceBanner;
         this.responseData['defaultBanner'] = this.defaultBanner;
          event = {
            imgUrl: this.marketPlaceimgUrl,
            imgName: this.selectedMarketPlaceBanner,
            selectFile: this.selectedMarketPlaceBanner,
            type: 'Upload'
          }
        }
        else{
          this.responseData['bannerImage'] = this.imgURL;
          this.responseData['bannerFile'] = this.selectedBannerImg;
          this.responseData['defaultBanner'] = this.defaultBanner;
          event = {
            imgUrl: this.marketPlaceimgUrl,
            imgName: this.marketPlaceimgName,
            selectFile: this.selectedMarketPlaceBanner,
            type: 'Upload'
          }
        }
        this.sendFileData.emit(event);
        this.sendBannerData(this.bannerField, this.bannerFieldIndex);
      }
    });
  }

  setupSelecteditems(field, sitem, items, itemVal) {
    console.log(field, sitem, items, itemVal);

    let fieldName = field;
    let fieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
    let apiFieldKey = this.apiFormFields[fieldIndex].apiFieldKey;
    let formatAttr = this.apiFormFields[fieldIndex].apiFieldType;
    let val = (formatAttr == 1) ? items : itemVal;
    let selVal = itemVal;
    if(field == 'workstreams') {
      if(sitem.length > 0) {
        let windex = this.apiFormFields[fieldIndex].itemValues.findIndex(option => option.id == sitem[0].id);
        if(windex >= 0) {
          let itemVal = this.apiFormFields[fieldIndex].itemValues[windex];
          sitem[0].key = itemVal.key;
          sitem[0].editAccess = itemVal.editAccess;
          sitem[0].imageClass = itemVal.imageClass;
        }
      }
      console.log(this.apiFormFields[fieldIndex].selection, itemVal)
      if(this.apiFormFields[fieldIndex].selection == 'single') {
        selVal = items.toString();
      }
    }
    //console.log(val)
    this.webForm.value[apiFieldKey] = val;
    this.apiFormFields[fieldIndex].selectedIds = sitem;
    this.apiFormFields[fieldIndex].selectedValueIds = items;
    this.apiFormFields[fieldIndex].selectedValues = selVal;
    this.apiFormFields[fieldIndex].selectedVal = selVal;
    this.apiFormFields[fieldIndex].valid = (field == 'year' || (this.apiFormFields[fieldIndex].isMandatary == 1 && items.length > 0)) ? true : false;

    let findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
    this.formFields[this.stepIndex][this.step][findex].formValue = val;
    this.formFields[this.stepIndex][this.step][findex].formValueIds = items;
    this.formFields[this.stepIndex][this.step][findex].formValueItems = itemVal;
    this.formFields[this.stepIndex][this.step][findex].valid = this.apiFormFields[fieldIndex].valid;

    this.responseData.fieldIndex = fieldIndex;
    this.responseData.fieldData = this.apiFormFields[fieldIndex];
    this.responseData.formGroup = this.webForm;
    this.responseData.formFields = this.formFields;

    this.commonApi.emitDynamicFieldResponse(this.responseData);
  }

  disableActionSelection() {

  }

  // Disable Selection
  disableTagSelection(f, val, t, fieldData: any = '', fi:any = '') {
    console.log(f, t, fieldData, fi)
    let responseFlag = (fieldData.length == 0) ? true : false;
    let apiFormFields = (fieldData.length == 0) ? this.apiFormFields : fieldData.sibActions;
    let fieldIndex =  (fi == '') ? apiFormFields.findIndex(option => option.fieldName == f) : fi;
    let findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == f);
    //let fieldType = apiFormFields[fieldIndex].fieldType;
    let fieldSel = apiFormFields[fieldIndex].selection;
    let selValueIds = apiFormFields[fieldIndex].selectedIds;

    if(this.pageInfo.access == 'adas-procedure' && f == 'model') {
      let modelId = apiFormFields[fieldIndex].selectedIds[t].id;
      let mindex = this.responseData.makeItems.findIndex(option => option.model == modelId);
      console.log(modelId, mindex, val)
      if(mindex >= 0) {
        this.responseData.makeItems.splice(mindex, 1);
      }
    }

    if(fieldSel == 'multiple' && selValueIds.length > 0) {
      apiFormFields[fieldIndex].selectedIds.splice(t, 1);
      let sitem = apiFormFields[fieldIndex].selectedIds;
      apiFormFields[fieldIndex].selectedIds = sitem;
      let fieldAttr = apiFormFields[fieldIndex].apiFieldType;
      apiFormFields[fieldIndex].selectedValueIds = [];
      apiFormFields[fieldIndex].selectedValues = [];
      apiFormFields[fieldIndex].selectedVal = [];

      this.formFields[this.stepIndex][this.step][findex].formValue = [];
      this.formFields[this.stepIndex][this.step][findex].formValueIds = [];
      this.formFields[this.stepIndex][this.step][findex].formValueItems = [];
      for(let s of apiFormFields[fieldIndex].selectedIds) {
        console.log(apiFormFields[fieldIndex])
        let formVal;
        if(f == 'errorCode') {
          formVal = (fieldAttr == 1) ? s.id : s.ename;
        } else {
          formVal = (fieldAttr == 1) ? s.id : s.name;
        }
        apiFormFields[fieldIndex].selectedValueIds.push(s.id);
        apiFormFields[fieldIndex].selectedValues.push(s.name);
        apiFormFields[fieldIndex].selectedVal.push(s.name);
        this.formFields[this.stepIndex][this.step][findex].formValue.push(formVal);
        this.formFields[this.stepIndex][this.step][findex].formValueIds.push(s.id);
        this.formFields[this.stepIndex][this.step][findex].formValueItems.push(s.name);
      }
    } else {
      apiFormFields[fieldIndex].selectedValueIds = "";
      apiFormFields[fieldIndex].selectedValues = "";
      apiFormFields[fieldIndex].selectedVal = "";

      this.formFields[this.stepIndex][this.step][findex].formValue = "";
      this.formFields[this.stepIndex][this.step][findex].formValueIds = "";
      this.formFields[this.stepIndex][this.step][findex].formValueItems = "";
    }

    //console.log(apiFormFields[fieldIndex], selValueIds.length)

    this.webForm.value[f] = apiFormFields[fieldIndex].formValue;
    let items = apiFormFields[fieldIndex].selectedValues;
    let valid = (apiFormFields[fieldIndex].isMandatary == 0 || (apiFormFields[fieldIndex].isMandatary == 1 && items.length > 0)) ? true : false;
    valid = (f == 'errorCode' && items.length == 0) ? false : valid;
    apiFormFields[fieldIndex].valid = valid;
    this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;

    if(responseFlag) {
      setTimeout(() => {
        this.responseData.addRow = false;
        this.sendResponse(fieldIndex);
      }, 150);
    }
  }

  onChange(type, field, c, val, optIndex, action = '', actionField:any = false, actionIndex:any = -1, rowIndex: any = -1, triggerAction = '',fromEditor='') {
    let valid, platformId;
    let returnOnchange=localStorage.getItem('returnOnchange');
    if(returnOnchange) {
      let findex,fieldIndex;
      fieldIndex =this.apiFormFields.findIndex(option => option.fieldName == field);
      let editorDescVal=this.apiFormFields[fieldIndex].selectedVal;
      console.log(editorDescVal);
      findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field);
      this.formFields[this.stepIndex][this.step][findex].formValue = editorDescVal;
      this.formFields[this.stepIndex][this.step][findex].formValueIds = editorDescVal;
      this.formFields[this.stepIndex][this.step][findex].formValueItems = editorDescVal;
      this.formFields[this.stepIndex][this.step][findex].valid=true;
      this.sendResponse(fieldIndex);
      return;
    }

    if (field == 'trainingMode') {
      let trainingObject = {
        val: val,
        isChange: true
      }
      this.sendTrainingModeValue.emit(trainingObject);
      if(this.pageInfo.domainId == 71 && val == 'Webinar') {
        this.webForm.get('zoomEmail').setValidators([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
        this.webForm.get('zoomEmail').setValue(this.zoomEmail);
        this.webForm.get('zoomEmail').disable();
      } else {
        this.webForm.get('zoomEmail').enable();
      }
    }
    if (field.includes('inPersonTimeZone')) {
      this.sendTimeZoneValue.emit(val);
    }
    if (field == 'inPersonStartTime0') {
      this.minDateTime['inPersonEndTime0'] = new Date(val);
      this.sendStartTimeValue.emit(val);
    }
    if (field == 'inPersonEndTime0') {
      this.sendEndTimeValue.emit(val);
    }
    if (field.includes('inPersonStartTime')) {
      let obj = {
        name: field,
        value: val
      }
      this.sendInPersonStartTimeValue.emit(obj);
    }
    if (field == 'maxParticipants') {
      this.sendMaxParticipantsValue.emit(val);
    }
    if (field == 'inPersonStartTime1') {
      this.minDateTime['inPersonEndTime1'] = new Date(val);
    }
    if (field == 'country') {
      this.setStateDropdown.emit(val);
    }
    if (field == 'inPersonStartTime2') {
      this.minDateTime['inPersonEndTime2'] = new Date(val);
    }
    if (field == 'inPersonStartTime3') {
      this.minDateTime['inPersonEndTime3'] = new Date(val);
    }
    if (field == 'inPersonStartTime4') {
      this.minDateTime['inPersonEndTime4'] = new Date(val);
    }
    if (field == 'inPersonStartTime5') {
      this.minDateTime['inPersonEndTime5'] = new Date(val);
    }
    if (field == 'inPersonStartTime6') {
      this.minDateTime['inPersonEndTime6'] = new Date(val);
    }
    if (field == 'startTime') {
      this.minDateTime['endTime'] = new Date(val);
      this.sendNormalStartTimeValue.emit(new Date(val));
    }
    if (field == 'endTime') {
      this.sendNormalEndTimeValue.emit(new Date(val));
    }
    if (field == 'isFree') {
      this.sendFreeValue.emit(val);
    }
    if (field == 'isBirdPrice' || field == 'isDiscount') {
      this.sendIsBirdPriceValue.emit(val);
    }
    if (field == 'startDate') {
      this.miniumEndDate = new Date(val);
      this.sendStartDateValue.emit(new Date(val));
      this.maximumEndDate = new Date(this.miniumEndDate.getTime());
      this.maximumEndDate.setDate(this.maximumEndDate.getDate() + 6);
    }
    if (field == 'endDate') {
      this.sendEndDateValue.emit(new Date(val));
    }
    if (field == 'birdPrice' || field == 'discountPrice') {
      if(this.birdPriceInitialized) this.sendBirdPriceValue.emit(val);
    }
    if (field == 'manualDiscountPrice') {
      this.sendManualDiscountPriceValue.emit(val);
    }
    if (field == 'birdPercentage' || field == 'discountPercentage') {
      if(this.birdPriceDiscountInitialized) this.sendBirdPercentageValue.emit(val);
    }
    if (field == 'price') {
      this.sendRegularPrice.emit(val);
    }
    if(field == 'manualPurchase'){
      this.sendIsIncludedWithTraining.emit(val)
    }
    if (field == 'forTrainingOnly') {
      this.forTrainingOnly.emit(val);
    }
    if (field == 'salesPerson') {
      console.log(this.webForm, this.formGroup)
    }
    if(!this.pageInfo.stepBack) {
      let fieldIndex;
      let apiFieldKey, formatAttr, formatType;
      if(this.manageAction != 'new' && field == 'threadType') {
        return false;
      }

      val = (val == undefined || val == 'undefined') ? '' : val;
      console.log(type,field,c,val,optIndex,action);
      // ckeditor get value
      //if(this.pageInfo.access == 'documents'){
       // if(action == '1'){
          if(type == 'textarea'){
            if(val == 'description'){
              val = this.webForm.value.description;
            }
            if(val == 'teamAssist'){
              val = this.webForm.value.teamAssist;
            }
            if(val == 'thread_desc_fix'){
              val = this.webForm.value.thread_desc_fix;
            }

          }
       // }
     // }
      // ckeditor get value
      console.log(val);
      /*if(field == 'odometer' && val != '' && this.industryType.id > 1) {
        val = this.commonApi.removeCommaNum(val);
        val = this.commonApi.numberWithCommas(val);
      }*/
      if(field == 'odometer' && val != '') {
        if(this.tvsDomain){
          val = this.commonApi.removeCommaNum(val);
          val = this.commonApi.numberWithCommasTwoDigit(val);
        }
        else{
          val = this.commonApi.removeCommaNum(val);
          val = this.commonApi.numberWithCommasThreeDigit(val);
        }
      }

      console.log(val, type, this.stepIndex, this.step, field, optIndex)
      val = (type == 'inputbox' && this.commonApi.hasBlankSpaces(val)) ? '' : val;
      let findex;
      let actionId = 0;
      console.log(actionIndex, rowIndex, this.formFields[this.stepIndex][this.step])
      if(actionIndex >= 0) {
        let chkId = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'id' && option.actionIndex == actionIndex && option.rowIndex == -1);
        actionId = this.formFields[this.stepIndex][this.step][chkId].formValue;
        if(rowIndex >= 0) {
          findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field && option.actionIndex == actionIndex && option.rowIndex == rowIndex);
        } else {
          findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field && option.actionIndex == actionIndex);
        }
        console.log(findex, actionIndex, rowIndex, actionId)
        console.log(this.apiFormFields)
      } else {
        findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field);
      }
      let loadFlag = true;
      let responseFlag = true;
      if(optIndex < 0) {
        let cfField = this.formFields[this.stepIndex][this.step][findex];
        console.log(findex, field, actionIndex, cfField, this.formFields[this.stepIndex][this.step])
        //let rowIndex = cfField.rowIndex;
        let cfIndex = cfField.findex;
        let apiFormFields;
        if(actionField) {
          console.log(actionIndex, rowIndex, cfIndex, this.apiFormFields.cells.sib[actionIndex].sibActions)
          apiFormFields = rowIndex < 0 ? this.apiFormFields.cells.sib[actionIndex].sibActions : this.apiFormFields.cells.sib[actionIndex].sibActions[c].rowItems[rowIndex].cellAction;
          console.log(apiFormFields)
          this.responseData.rowIndex = rowIndex;
        } else {
          apiFormFields = this.apiFormFields;
          if(this.pageInfo.access == 'sib') {
            let sflag: any = true;
            localStorage.setItem('sibFieldUpdate', sflag);
          }
        }
        if(field == 'threadType') {
          console.log(this.manageAction, val)
          if(this.collabticDomain) {
            let tyItemVal = apiFormFields[c].itemValues;
            let tyIndex = tyItemVal.findIndex(option => option.apiValue == val);
            if(tyItemVal[tyIndex].active == 0) {
              return false;
            }
          }
        }
        // this.apiFormFields = (actionField) ? this.apiFormFields[actionIndex] : this.apiFormFields;
        fieldIndex = (actionField && rowIndex >= 0) ? cfIndex : apiFormFields.findIndex(option => option.fieldName == field);
        console.log(apiFormFields, actionIndex, findex,  actionField, cfField, fieldIndex)
        apiFieldKey = apiFormFields[fieldIndex].apiFieldKey;
        formatAttr = apiFormFields[fieldIndex].apiFieldType;
        formatType = apiFormFields[fieldIndex].apiValueType;

        if(type == 'chip-input') {
          apiFormFields[fieldIndex].selectedValueIds = val;
          apiFormFields[fieldIndex].selectedValues = val;
          apiFormFields[fieldIndex].selectedVal = val;
          this.formFields[this.stepIndex][this.step][findex].formValue = val;
          this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
          this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
          this.responseData.addRow = false;
          this.sendResponse(fieldIndex, actionField, actionIndex);
        }

        let selVal = '';
        //console.log(field, findex)
        switch (field) {
          case 'workstreams':
            if(apiFormFields[fieldIndex].selection == 'single') {
              let itemValues = apiFormFields[fieldIndex].itemValues;
              let windex = itemValues.findIndex(option => option.id == val);
              apiFormFields[fieldIndex].selectedIds = [itemValues[windex]];
            }

            if(this.CBADomain){
              if(this.manageAction == 'edit') {
                return false;
              } else {
                for(let i of apiFormFields[c].itemValues) {
                  i.isActive = false;
                  if(i.id == val) {
                    i.isActive = true;
                  }
                }
              }
            }

            break;
          case 'ThreadCategory':
            if(this.collabticDomain) {
              let tcItemIndex = apiFormFields[c].itemValues.findIndex(option => parseInt(option.id) == parseInt(val));
              if(tcItemIndex >= 0 && apiFormFields[c].itemValues[tcItemIndex].disabled) {
                return false;
              }
            }
            let prevVal = (apiFormFields[fieldIndex].selectedValueIds.length == 0) ? 0 : apiFormFields[fieldIndex].selectedValueIds[0];
            apiFormFields[fieldIndex].prevId = prevVal;


            if(this.CBADomain){
              for(let i of apiFormFields[c].itemValues) {
                i.isActive = false;
                if(i.id == val) {
                  i.isActive = true;
                }
              }
            }

            break;
          case 'startDate':
          case 'startTime':
          case 'endDate':
          case 'endTime':
            apiFormFields[fieldIndex].valid = apiFormFields[fieldIndex].selectedVal ? true : false;
            break;
          case 'expiryDate':
            val = moment(val).format('YYYY-MM-DD');
            let sval = moment(val).format(apiFormFields[fieldIndex].expiryDateFormat);
            apiFormFields[fieldIndex].dateVal = sval;
            break;
          case 'threadType':
            console.log(this.manageAction, val)
            let tyFlag = true;
            if(this.collabticDomain) {
              let tyItemVal = apiFormFields[c].itemValues;
              let tyIndex = tyItemVal.findIndex(option => option.apiValue == val);
              tyFlag = (tyItemVal[tyIndex].active > 0) ? true : false;
            }
            if(this.manageAction == 'new' && tyFlag) {
              for(let i of apiFormFields[c].itemValues) {
                i.isActive = false;
                if(i.apiValue == val) {
                  i.isActive = true;
                  this.formFields[this.stepIndex][this.step][findex].selectedVal = i.name;
                }
              }
            } else {
              responseFlag = false;
            }
            break;
          case 'helpType':
            for(let i of apiFormFields[c].itemValues) {
              i.isActive = false;
              if(i.apiValue == val) {
                i.isActive = true;
              }
            }
            break;
          case 'announcementType':
            for(let i of apiFormFields[c].itemValues) {
              i.checked = false;
              if(i.id == val) {
                i.checked = true;
                let formVal = (apiFormFields[c].apiFieldType == 1) ? i.id : i.name;
                apiFormFields[c].selectedValueIds = formVal;
                apiFormFields[c].selectedValues = formVal;
                apiFormFields[c].selectedVal = formVal;
                this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
                this.formFields[this.stepIndex][this.step][findex].formValueIds = formVal;
                this.formFields[this.stepIndex][this.step][findex].formValueItems = formVal;
              }
            }
            break;
          case 'vin':
            loadFlag = false;
            val = val.toUpperCase();
            console.log(val.length);
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            let kvalid = (val != 0 && val.length >= 0 && val.length < 17) ? false : true;
            console.log(val, kvalid, findex, fieldIndex)
            apiFormFields[fieldIndex].valid = kvalid;
            apiFormFields[fieldIndex].validVin = kvalid;
            apiFormFields[fieldIndex].invalidFlag = !kvalid;
            this.formFields[this.stepIndex][this.step][findex].valid = kvalid;
            break;
          case 'vinNo':
          case 'vinNoScanTool':
          case 'cutOffFrame':
            console.log(fieldIndex, apiFormFields, action)
            loadFlag = false;
            val = val.toUpperCase();
            platformId = localStorage.getItem('platformId');
            //if(action=='' && platformId=='3') {
            if(action=='') {
              if(val.length==17) {
                action='vin-api';
              }
            }
            apiFormFields[fieldIndex].changeAction = 'change';
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            console.log(findex, apiFormFields[fieldIndex], this.formFields[this.stepIndex][this.step], val)
            //let sbfIndex = cfIndex.multiIndexOf('a');
            valid = (action == '' && val != 0 && val.length >= 0 && val.length < 17) ? false : true;
            if(field == 'cutOffFrame') {
              console.log(valid)
              if(action == 'frame-api' && val.length == 0) {
                return false;
              }
              if(val.length == 17) {
                let frameFilter = this.formFields[this.stepIndex][this.step].filter(option => option.actionIndex == actionIndex && option.rowIndex != rowIndex && option.fieldName == field && option.formValue === val);
                console.log(frameFilter)
                apiFormFields[fieldIndex].duplicateFlag = (frameFilter.length == 0) ? false : true;
              } else {
                apiFormFields[fieldIndex].duplicateFlag = false;
              }
            }
            valid = (action == 'vin-api') ? true : valid;
            let localVin = localStorage.getItem('VinNo');
            apiFormFields[c].vinNo = (localVin == undefined || localVin == 'undefined') ? apiFormFields[fieldIndex].vinNo : localVin;
            let verifiedVin = (apiFormFields[fieldIndex].vinNo == undefined || apiFormFields[fieldIndex].vinNo == 'undefined') ? '' : apiFormFields[fieldIndex].vinNo;
            console.log(apiFormFields[fieldIndex],this.formFields[this.stepIndex][this.step][findex])
            //apiFormFields[c].vinNo = verifiedVin;
            if(verifiedVin != '' && verifiedVin != val && ((field == 'vinNo' && apiFormFields[fieldIndex].decodeConcept == 1) || field == 'cutOffFrame')) {
              valid = false;
              apiFormFields[fieldIndex].validVin = valid;
              apiFormFields[fieldIndex].invalidFlag = !valid;
            } else {
              valid = (val.length < 17) ? false : true;
              valid = (action == '' && field == 'cutOffFrame' && apiFormFields[fieldIndex].vinValid) ? false : valid;
              if(field == 'cutOffFrame' && apiFormFields[fieldIndex].vinValid) {
                apiFormFields[fieldIndex].validVin = valid;
                apiFormFields[fieldIndex].invalidFlag = !valid;
              }
            }
            if(action == '' && field == 'vinNo') {
              valid = (val.length > 0 && val.length < 17) ? false : true;
            }
            console.log(valid)
            setTimeout(() => {
              localStorage.removeItem('VinNo')
            }, 50);
            console.log(verifiedVin, valid)
            apiFormFields[c].valid = valid;

            this.formFields[this.stepIndex][this.step][findex].valid = valid;
            console.log(action, valid)

            responseFlag = ((field == 'vinNo' && action == '' && val.length == 0) || action == 'vin-api' || action == 'frame-api' || action == 'frame-range' && valid) ? true : false;
            responseFlag = (field == 'vinNo' && apiFormFields[fieldIndex].decodeConcept == 0) ? false : responseFlag;
            console.log(responseFlag, rowIndex, triggerAction, action)
            if(responseFlag && rowIndex >= 0 && triggerAction == 'change' && action == 'frame-range') {
              let frIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'frameRange' && option.actionIndex == actionIndex && option.rowIndex == rowIndex);
              console.log(this.formFields[this.stepIndex][this.step][frIndex])
              let cfrIndex = this.formFields[this.stepIndex][this.step][frIndex].findex;
              apiFormFields[cfrIndex].selectedVal = '';
              apiFormFields[cfrIndex].selectedValueIds = '';
              apiFormFields[cfrIndex].selectedValues = '';
              this.formFields[this.stepIndex][this.step][frIndex].formValue = '';
              this.formFields[this.stepIndex][this.step][frIndex].formValueIds = '';
              this.formFields[this.stepIndex][this.step][frIndex].formValueItems = '';
            }
            console.log(responseFlag)
            break;
          case 'repairOrder':
            console.log(fieldIndex, apiFormFields, action)
            loadFlag = false;
            val = val.toUpperCase();
            let cplatformId = localStorage.getItem('platformId');
            if(action == '' && cplatformId=='3') {
              if(val.length == 20) {
                //action='ro-api';
              }
            }
            apiFormFields[fieldIndex].changeAction = 'change';
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            console.log(findex, apiFormFields[fieldIndex], this.formFields[this.stepIndex][this.step], val)
            //let sbfIndex = cfIndex.multiIndexOf('a');
            valid = (action == '' && val != 0 && val.length >= 0 && val.length < 3) ? false : true;
            valid = (action == 'ro-api') ? true : valid;
            let localRo = localStorage.getItem('roNo');
            apiFormFields[c].roNo = (localRo == undefined || localRo == 'undefined') ? apiFormFields[fieldIndex].roNo : localRo;
            let verifiedRo = (apiFormFields[fieldIndex].roNo == undefined || apiFormFields[fieldIndex].roNo == 'undefined') ? '' : apiFormFields[fieldIndex].roNo;
            console.log(apiFormFields[fieldIndex],this.formFields[this.stepIndex][this.step][findex])
            //apiFormFields[c].vinNo = verifiedVin;
            if(verifiedRo != '' && verifiedRo != val && (field == 'roNo' && apiFormFields[fieldIndex].decodeConcept == 1)) {
              valid = false;
              apiFormFields[fieldIndex].validRo = valid;
              apiFormFields[fieldIndex].invalidFlag = !valid;
            } else {
              valid = (val.length > 0 && val.length < 3) ? false : true;
              apiFormFields[fieldIndex].invalidFlag = !valid;
            }
            if(action == '' && field == 'repairOrder') {
              valid = (val.length > 0 && val.length < 3) ? false : true;
            }
            console.log(valid)
            setTimeout(() => {
              localStorage.removeItem('roNo')
            }, 50);
            console.log(verifiedRo, valid)
            apiFormFields[c].valid = valid;

            this.formFields[this.stepIndex][this.step][findex].valid = valid;
            console.log(action, valid)

            responseFlag = ((field == 'repairOrder' && action == '' && val.length == 0) || action == 'ro-api' && valid) ? true : false;
            responseFlag = (field == 'repairOrder' && apiFormFields[fieldIndex].decodeConcept == 0) ? false : responseFlag;
            console.log(responseFlag, rowIndex, triggerAction, action)
            console.log(responseFlag)
            break;
          case 'make':
          case 'manufacturer':
          case 'SelectProductType':
            loadFlag = false;
            let itemIndex = apiFormFields[c].itemValues.findIndex(option => option.id == val);
            let currApiFieldKey = apiFormFields[fieldIndex].apiFieldKey;

            let modelField = 'model';
            let modelIndex = apiFormFields.findIndex(option => option.fieldName == modelField);
            let mindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == modelField);

            apiFormFields[modelIndex].selectedValueIds = "";
            apiFormFields[modelIndex].selectedValues = "";
            apiFormFields[modelIndex].selectedVal = [];
            //apiFormFields[modelIndex].valid = false;
            let apiFieldKey = apiFormFields[modelIndex].apiFieldKey;
            let formVal = (formatType == 1) ? "" : [];
            this.formFields[this.stepIndex][this.step][mindex].formValue = formVal;
            this.formFields[this.stepIndex][this.step][mindex].formValueIds = formVal;
            this.formFields[this.stepIndex][this.step][mindex].formValueItems = formVal;
            //this.formFields[this.stepIndex][this.step][mindex].valid = false;
            this.webForm.value[apiFieldKey] = formVal;

            let itemId = apiFormFields[c].itemValues[itemIndex].id;
            let itemName = apiFormFields[c].itemValues[itemIndex].name;
            apiFormFields[fieldIndex].selectedValueIds = (formatType == 1) ? itemId : [itemId];
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = (formatType == 1) ? itemName : [itemName];

            formVal = (formatAttr == 1) ? itemId : itemName;
            formVal = (formatType == 1) ? formVal : [formVal];

            this.webForm.value[currApiFieldKey] = formVal;
            this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = (formatType == 1) ? itemId : [itemId];
            this.formFields[this.stepIndex][this.step][findex].formValueItems = (formatType == 1) ? itemName : [itemName];
            break;

          case 'dtcToggle':
            apiFormFields[fieldIndex].selection = val;
            this.toggleLabel = (val) ? 'Yes' : 'No';
            let chkField = 'errorCode';
            let efieldIndex = apiFormFields.findIndex(option => option.fieldName == chkField);
            let efindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkField);
            apiFormFields[efieldIndex].valid = !val;
            this.formFields[this.stepIndex][this.step][efindex].valid = !val;
            break;
          case 'partsToggle':
            if(actionId > 0) {
              this.apiFormFields.mainActionItems[0].editIndex = actionIndex;
            }
            if(!val) {
              responseFlag = false;
              let chkField = 'parts';
              let pfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkField);
              console.log('part info field',pfindex, this.formFields[this.stepIndex][this.step][pfindex])
              let partInfo = this.formFields[this.stepIndex][this.step][pfindex].formValue;
              console.log(partInfo)
              if(partInfo.length > 0) {
                const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
                modalRef.componentInstance.access = 'Parts Cancel';
                modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
                  modalRef.dismiss('Cross click');
                  console.log(receivedService)
                  if(!receivedService) {
                    val = true;
                  } else {
                    val = false;
                    if(actionField) {
                      this.responseData.actionSecIndex = actionIndex;
                      this.responseData.fieldSec = 'sib';
                      this.responseData.fieldRow = 'rowItems';
                      this.responseData.rowIndex = rowIndex;
                    }
                    console.log(this.responseData, this.formFields)
                    this.responseData.addRow = false;
                    this.sendResponse(fieldIndex, actionField, actionIndex);
                  }
                  apiFormFields[fieldIndex].selection = val;
                });
              } else {
                responseFlag = true;
              }
            }

            //apiFormFields[fieldIndex+1].displayFlag = true;
            break;
        }

        if(responseFlag && apiFormFields[fieldIndex].isMandatary == 1) {
          apiFormFields[fieldIndex].valid = true;
        }

        if(field == 'content') {
          if(actionIndex >= 0 && actionId > 0) {
            this.apiFormFields.mainActionItems[0].editIndex = actionIndex;
          }
          let upItems = Object.keys(this.uploadedItems);
          apiFormFields[fieldIndex].valid = (val != '' || (upItems.length > 0 && this.uploadedItems.items.length > 0)) ? true : false;
          let audioUpItems = Object.keys(this.audioUploadedItems);
          apiFormFields[fieldIndex].valid = (val != '' || (audioUpItems.length > 0 && this.audioUploadedItems.items.length > 0)) ? true : false;
        }

        this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;

        if(loadFlag) {
          apiFormFields[fieldIndex].selectedValues = val;
          if(type == 'slider') {
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedVal = val;
          }
          val = (formatType == 1) ? val : [val];
          this.formFields[this.stepIndex][this.step][findex].formValue = val;
          this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
          this.formFields[this.stepIndex][this.step][findex].formValueItems = val;

          if(type == 'dropdown') {
            let dindex = apiFormFields[fieldIndex].itemValues.findIndex(option => option.id == val);
            let itemId = apiFormFields[fieldIndex].itemValues[dindex].id;
            let itemName = apiFormFields[fieldIndex].itemValues[dindex].name;
            let formVal = (formatAttr == 1) ? itemId : itemName;
            formVal = (formatType == 1) ? formVal : [formVal];
            apiFormFields[fieldIndex].selectedValueIds = [itemId];
            apiFormFields[fieldIndex].selectedValues = val.toString();
            apiFormFields[fieldIndex].selectedVal = [val];
            if(apiFormFields[fieldIndex].isMandatary == 1) {
              apiFormFields[fieldIndex].valid = (val != '') ? true : false;
            }
            this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = (formatType == 1) ? itemId : [itemId];
            this.formFields[this.stepIndex][this.step][findex].formValueItems = (formatType == 1) ? itemName : [itemName];
            this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;
            this.webForm.value[apiFieldKey] = formVal;
          } else {
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            if(apiFormFields[fieldIndex].isMandatary == 1) {
              apiFormFields[fieldIndex].valid = (val.length > 0) ? true : false;
              let minLen = parseInt(apiFormFields[fieldIndex].minLength);
              if(minLen > 0) {
                let valid = apiFormFields[fieldIndex].valid;
                valid = (minLen <= val.length) ? true : false;
                console.log(val.length, minLen, valid)
                apiFormFields[fieldIndex].valid = valid;
              }
            }

            val = (formatType == 1) ? val : [val];
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;
            this.webForm.value[apiFieldKey] = val;
          }
        }
      } else {
        fieldIndex = c;
        apiFieldKey = this.apiFormFields[fieldIndex].cellArray[optIndex].apiFieldKey;
        formatAttr = this.apiFormFields[fieldIndex].cellArray[optIndex].apiFieldType;
        formatType = this.apiFormFields[fieldIndex].cellArray[optIndex].apiValueType;
        if(type == 'dropdown') {
          let dindex = this.apiFormFields[fieldIndex].cellArray[optIndex].itemValues.findIndex(option => option.id == val);
          let itemId = this.apiFormFields[fieldIndex].cellArray[optIndex].itemValues[dindex].id;
          let itemName = this.apiFormFields[fieldIndex].cellArray[optIndex].itemValues[dindex].name;
          let formVal = (formatAttr == 1) ? itemId : itemName;
          formVal = (formatType == 1) ? formVal : formVal;
          val = (formatType == 1) ? val : [val];
          console.log(this.apiFormFields[fieldIndex].cellArray[optIndex], formatType, val)
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValueIds = itemId;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValues = val;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedVal = val;
          if(this.apiFormFields[fieldIndex].cellArray[optIndex].isMandatary == 1) {
            this.apiFormFields[fieldIndex].cellArray[optIndex].valid = (val.length > 0) ? true : false;
          }
          this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
          this.formFields[this.stepIndex][this.step][findex].formValueIds = (formatType == 1) ? itemId : [itemId];
          this.formFields[this.stepIndex][this.step][findex].formValueItems = (formatType == 1) ? itemName : [itemName];
          this.formFields[this.stepIndex][this.step][findex].valid = this.apiFormFields[fieldIndex].cellArray[optIndex].valid;
          this.webForm.value[apiFieldKey] = formVal;
        } else {
          val = (formatType == 1) ? val : [val];
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValueIds = val;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValues = val;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedVal = val;
          if(this.apiFormFields[fieldIndex].cellArray[optIndex].isMandatary == 1) {
            this.apiFormFields[fieldIndex].cellArray[optIndex].valid = (val.length > 0) ? true : false;
          }
          val = (formatType == 1) ? val : [val];
          this.formFields[this.stepIndex][this.step][findex].formValue = val;
          this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
          this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
          this.formFields[this.stepIndex][this.step][findex].valid = this.apiFormFields[fieldIndex].cellArray[optIndex].valid;
          this.webForm.value[apiFieldKey] = val;
        }
        console.log(this.apiFormFields[fieldIndex])
      }

      if(responseFlag) {
        if(actionField) {
          this.responseData.actionSecIndex = actionIndex;
          this.responseData.fieldSec = 'sib';
          this.responseData.fieldRow = 'rowItems';
          this.responseData.rowIndex = rowIndex;
        }
        console.log(this.responseData, this.formFields, fieldIndex)
        this.responseData.addRow = false;
        this.sendResponse(fieldIndex, actionField, actionIndex);
      }
    }

    if ((field == 'trainingName' || field == 'sku') && Object.keys(this.webForm.value).includes('trainingName')) {
      let data = this.trainingsTitleList?.find((data) => data[field] == val);
      if (data) {
        if (this.webForm.value.trainingName != data.trainingName) {
          this.webForm.get('trainingName').setValue(data.trainingName);
        }
        else if (this.webForm.value.sku != data.sku) {
          this.webForm.get('sku').setValue(data.sku);
        }
        if (field == 'sku' && data?.type && (!this.selectedTrainingMode || (this.selectedTrainingMode != data.type))) {
            this.onChange("dropdown",'trainingMode', 2, data.type, -1);
        }
      }
    }
    if ((field == 'manualName' || field == 'sku') && Object.keys(this.webForm.value).includes('manualName')) {
      let data = this.manualsTitleList?.find((data) => data[field] == val);
      if (data) {
        if (this.webForm.value.manualName != data.manualName) {
          this.webForm.get('manualName').setValue(data.manualName);
        }
        else if (this.webForm.value.sku != data.sku) {
          this.webForm.get('sku').setValue(data.sku);
        }
      } else {
        let changedField = (field == 'sku') ? 'manualName' : 'sku';
        let data1 = this.manualsTitleList?.find((data) => data[changedField] == this.webForm.value[changedField]);
        if (data1) {
          this.webForm.get(changedField).setValue('');
          if (this.ismanualFromList) { this.manualFromListEvent.emit(false) };
        }
      }
    }
  }

  checkIsValid(fieldName, value) {
    if (['startDate', 'endDate', 'startTime', 'endTime', 'timeZone', 'country', 'state'].find(val => val == fieldName)) {
      return this.webForm.get(fieldName).errors ? true : false;
    }
    if (fieldName == 'maxParticipants' && this.selectedTrainingMode == 'Recorded') { return false; }
    if ((this.webForm.get(fieldName) && this.webForm.get(fieldName).value) || value) {
      if (['trainingMode', 'trainingName', 'sku', 'manualName'].includes(fieldName)) {
        let dataSku, dataMode;
        if (Object.keys(this.webForm.value).includes('manualName')) {
          dataMode = this.manualsTitleList?.find((data) => data['manualName'] === this.webForm.get('manualName').value);
          dataSku = [...this.manualsTitleList, ...this.trainingsTitleList]?.find((data) => data['sku'] === this.webForm.get('sku').value);
          let isTrue: boolean = fieldName === 'sku' ? dataSku ? true : false : dataMode ? true : false;
          this.sameNameValidator.emit({ fieldName: fieldName, value: isTrue });
          if (this.threadInfo) {
            let noChanges = 0;
            ['sku', 'manualName'].forEach((key) => {
              if (this.threadInfo[key] == this.webForm.getRawValue()[key]) {
                noChanges++;
              }
            });
            if (noChanges > 1) {
              return false;
            }
          }
          return isTrue;
        }
        if (Object.keys(this.webForm.value).includes('trainingName')) {
          dataSku = [...this.manualsTitleList, ...this.trainingsTitleListGet]?.find((data) => data.sku === this.webForm.getRawValue()['sku']);
          dataMode = this.trainingsTitleListGet?.find((data) => (data['trainingName'] === this.webForm.getRawValue()['trainingName']) && data.type === this.selectedTrainingMode);
          let isTrue: boolean = fieldName === 'sku' ? dataSku ? true : false : dataMode ? true : false;
          this.sameNameValidator.emit({ fieldName: fieldName, value: isTrue });
          if (this.threadInfo) {
            let noChanges = 0;
            ['sku', 'trainingMode', 'trainingName'].forEach((key) => {
              if (this.threadInfo[key] == this.webForm.getRawValue()[key]) {
                noChanges++;
              }
            });
            if (noChanges > 2) {
              return false;
            }
          }
          return isTrue;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  // Manage Lists
  manageSelection(field, secIndex='', sc = '', fc = -1, ri = -1) {
    console.log(field, secIndex, sc, fc, this.industryType)
    let manageFlag = true;
    //let manageFlag = ((this.industryType.id == 2 || this.industryType.id == 3) && field.disabled) ? false : true;
    switch (this.industryType.id) {
      case 2:
      case 3:
        manageFlag = (field.disabled) ? false : manageFlag;
        break;
      default:
        manageFlag = true;
        break;
    }
    if(manageFlag) {
      let fieldName = field.fieldName;
      let fieldApiName = (fieldName == 'vinNo' || fieldName == 'vinNoScanTool') ? 'vehicle/GetRecentVin' : field.apiName;
      let apiUrl = (fieldName == 'adasSystem') ? this.baseV3ApiUrl : this.baseApiUrl;
      let apiName = `${apiUrl}/${fieldApiName}`;
      let actionApi = '';
      let actionQueryVal: any = [];
      let selectionType = field.selection;
      let apiData = this.apiData;
      let chkMfgField = 'manufacturer';
      let chkMakeField = 'make';
      let chkModelField = 'model';
      let chkWsField = 'workstreams';
      let chkPtField = 'SelectProductType';
      let chkTcField = 'ThreadCategory';
      let wsFieldIndex, findex, currFieldIndex, currfindex, mfgIndex, ptIndex, tcIndex, item, wsVal, mfgVal, makeVal, ptVal, tcVal, modelVal, filterItems, filterLists, action, formatAttr, formatType, itemId, itemName;
      console.log(secIndex, this.stepIndex, this.step, fieldName, selectionType)
      switch(fieldName) {
        case 'model':
          let makeFieldIndex = -1, ptFieldIndex = -1, mfgIndex = -1;
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = (selectionType == 'single') ? [item.formValueIds] : item.formValueIds;
          filterLists = (selectionType == 'single') ? [item.formValueItems] : item.formValueItems;
          action = this.apiFormFields[currFieldIndex].action;
          wsFieldIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkWsField);
          console.log(this.formFields, wsFieldIndex)
          wsVal = this.formFields[this.stepIndex][this.step][wsFieldIndex].formValue;
          if(this.pageInfo.access == 'adas-procedure') {
            console.log(item)
            //filterLists = item.formValueIds;
            mfgVal = '';
            mfgIndex = this.apiFormFields.findIndex(option => option.fieldName == chkMfgField);
            if(mfgIndex >= 0) {
              findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkMfgField);
              console.log(this.formFields[this.stepIndex][this.step][findex])
              let valItem = this.formFields[this.stepIndex][this.step][findex].formValueIds;
              mfgVal = (valItem.length > 0) ? valItem[0] : '';
            }
          } else {
            makeVal = '';
            makeFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == chkMakeField);
            ptFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == chkPtField);
            if(makeFieldIndex >= 0) {
              findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkMakeField);
              console.log(this.formFields[this.stepIndex][this.step][findex])
              if(this.pageInfo.access == 'adas-procedure') {
                let valItem = this.formFields[this.stepIndex][this.step][findex].formValueItems;
                makeVal = (valItem.length > 0) ? valItem[0] : '';
              } else {
                makeVal = this.formFields[this.stepIndex][this.step][findex].formValue;
              }
            }

            if(ptFieldIndex >= 0) {
              console.log(this.formFields[this.stepIndex][this.step][ptIndex])
              ptVal = this.formFields[this.stepIndex][this.step][ptIndex].formValueItems;
              ptVal = (ptVal == undefined || ptVal == 'undefined') ? '' : ptVal;
              if(this.industryType.id == 3) {
                filterItems = filterLists;
              }
            }
          }
          
          //console.log(item, makeVal, wsVal, ptVal)
          if((mfgIndex >= 0 && wsVal.length > 0) || (ptFieldIndex >= 0 && wsVal.length > 0) || (ptFieldIndex < 0 && makeVal != '')) {
            let query = JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
            query.forEach(q => {
              console.log(q)
              switch(q) {
                case 'workstreamsList':
                  apiData[q] = JSON.stringify(wsVal);
                  break;
                case 'manufacturer':
                  apiData[q] = mfgVal;
                  break;  
                case 'makeName':
                  apiData[q] = makeVal;
                  break;
                case 'productType':
                  if(ptFieldIndex >= 0) {
                    apiData[q] = ptVal;
                  }
                  break;
                case 'type':
                  apiData[q] = 1;
                  break;
                case 'commonApiValue':
                  apiData[q] = this.apiFormFields[currFieldIndex][q];
                  break;
              }
            });
            this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal);
          }
          break;

        case 'AdditionalModelInfo':
        case 'AdditionalModelInfo2':
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          let modelfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkModelField);
          let makefindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkMakeField);
          makeVal = this.formFields[this.stepIndex][this.step][makefindex].formValue;
          modelVal = this.formFields[this.stepIndex][this.step][modelfindex].formValue;
          let selectedIndex, sindex;
          let selectedVal:any = "";
          if(fieldName == 'AdditionalModelInfo') {
            selectedIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
            if(selectedIndex >= 0) {
              sindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'AdditionalModelInfo2');
            }
          }
          if(fieldName == 'AdditionalModelInfo2') {
            selectedIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
            if(selectedIndex >= 0) {
              sindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'AdditionalModelInfo');
            }
          }
          selectedVal = this.formFields[this.stepIndex][this.step][sindex].formValue;
          selectedVal = (selectedVal == undefined || selectedVal == 'undefined') ? [] : selectedVal;
          console.log(selectedVal);
          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = item.formValueIds;
          filterLists = item.formValueItems;

          filterItems = this.formFields[this.stepIndex][this.step][currfindex].formValue;
          filterLists = filterItems;
          action = this.apiFormFields[currFieldIndex].action;

          if(makeVal != '' && modelVal != '') {
            let query = JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
            console.log(query)
            query.forEach(q => {
              switch(q) {
                case 'makeName':
                  apiData[q] = makeVal;
                  break;
                case 'modelName':
                  apiData[q] = modelVal;
                  break;
                case 'selectedinfo':
                  apiData[q] = JSON.stringify(selectedVal);
                  break;
                case 'commonApiValue':
                  apiData[q] = this.apiFormFields[currFieldIndex][q];
                  break;
              }
            });
            this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal);
          }
          break;

        case 'technicianInfo':
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = item.formValueIds;
          filterLists = item.formValueItems;

          filterItems = this.formFields[this.stepIndex][this.step][currfindex].formValue;
          filterItems = (filterItems == undefined || filterItems == 'undefined') ? [] : filterItems;
          filterLists = filterItems;
          action = this.apiFormFields[currFieldIndex].action;
          actionApi = field.actionApiName;
          actionQueryVal = field.actionQueryValues;

          let query = JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
          console.log(query, filterItems)
          query.forEach(q => {
            switch(q) {
              case 'dealerCode':
                apiData[q] = localStorage.getItem('dealerCode');
                break;
              case 'commonApiValue':
                apiData[q] = this.apiFormFields[currFieldIndex][q];
                break;
            }
          });
          this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal);
          break;

        case 'frameRange':
        case 'tags':
        case 'parts':          
        case 'adasSystem':
          console.log(field)
          if(field.disabled) {
            return false;
          }
          //currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currFieldIndex = fc;
          if(ri >= 0) {
            currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName && option.actionIndex == fc && option.rowIndex == ri);
            if(fieldName == 'frameRange') {
              let chkIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'cutOffFrame' && option.actionIndex == fc && option.rowIndex == ri);
              if(!this.formFields[this.stepIndex][this.step][chkIndex].valid) {
                return false;
              }
            }
          } else {
            if(fc >= 0) {
              currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName && option.actionIndex == fc);
            } else {
              currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
              currFieldIndex = this.formFields[this.stepIndex][this.step][currfindex].findex;
            }
          }
          filterItems = (fieldName == 'frameRange') ? [field.selectedValueIds] : field.selectedValueIds;
          filterLists = (fieldName == 'frameRange') ? [field.selectedValues] : field.selectedValues;
          let actionIndex = this.formFields[this.stepIndex][this.step][currfindex].actionIndex;
          console.log(actionIndex)
          let rowIndex = this.formFields[this.stepIndex][this.step][currfindex].rowIndex;
          action = (fieldName == 'parts') ? false : field.action;
          actionApi = field.actionApiName;
          actionQueryVal = field.actionQueryValues;

          if(fieldName == 'adasSystem') {
            let query = JSON.parse(field.queryValues);
            let view = 2;
            query.forEach(q => {
              switch(q) {
                case 'view':
                  apiData[q] = view;
                  break;
              }
            });
          }

          if(fieldName == 'parts') {
            wsFieldIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkWsField);
            console.log(this.formFields, wsFieldIndex)
            ///wsVal = this.formFields[this.stepIndex][this.step][wsFieldIndex].formValue;
            wsVal = [];
            apiData['groups'] = JSON.stringify(wsVal);
            let query = JSON.parse(field.queryValues);
            console.log(query)
            let status = 1;
            query.forEach(q => {
              switch(q) {
                case 'partStatus':
                case 'publishStatus':
                  apiData[q] = status;
                  break;
                case 'groups':
                  apiData[q] = JSON.stringify(wsVal);
                  break;
                case 'commonApiValue':
                  apiData[q] = field.commonApiValue;
                  break;
              }
            });
          }

          let actionData:any = '';
          if(this.pageInfo.access == 'sib') {
            actionData = {
              field: field,
              index: secIndex,
              actionField: sc,
              actionIndex: fc,
              rowIndex: rowIndex,
              fieldIndex: 0
            };

            this.responseData.rowIndex = rowIndex;
            this.responseData.fieldSec = 'sib';
            this.responseData.fieldRow = 'rowItems';
          }
          this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal, field, actionData);
          break;

        default:
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          let tcFieldIndex = -1;
          if(fieldName == 'errorCode') {
            let cstepIndex = this.stepIndex-1;
            let cstepTxt = `step${this.stepIndex}`;
            tcIndex = this.formFields[cstepIndex][cstepTxt].findIndex(option => option.fieldName == chkTcField);
            tcVal = '';
            if(tcIndex >= 0) {
              console.log(this.formFields[cstepIndex][cstepTxt][tcIndex])
              tcVal = this.formFields[cstepIndex][cstepTxt][tcIndex].formValue;
              tcVal = (tcVal == undefined || tcVal == 'undefined') ? '' : tcVal[0];
              console.log(tcVal)
            }
          }
          let dquery = (this.apiFormFields[currFieldIndex].queryValues == '') ? [] : JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
          dquery.forEach((q, i) => {
            console.log(q)
            switch(q) {
              case 'commonApiValue':
                apiData[q] = this.apiFormFields[currFieldIndex][q];
                break;
              case 'threadCategoryId':
                console.log(tcVal)
                apiData[q] = tcVal;
                break;
              default:
                let chkField = q;
                let queryIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkField);
                console.log(chkField, queryIndex, this.formFields[this.stepIndex][this.step][queryIndex])
                if(queryIndex >= 0) {
                  let queryVal = (q == 'workstreams') ? this.formFields[this.stepIndex][this.step][queryIndex].formValue : this.formFields[this.stepIndex][this.step][queryIndex].formValueItems;
                  apiData[dquery[i]] = (q == 'workstreams') ? JSON.stringify(queryVal) : queryVal;
                }
                break;
            }
          });
          console.log(apiData)
          let actionQuery = (this.apiFormFields[currFieldIndex].actionQueryValues == '') ? [] : JSON.parse(this.apiFormFields[currFieldIndex].actionQueryValues);
          let commonApiValue = '';
          actionQuery.forEach((q, i) => {
            switch(q) {
              case 'commonApiValue':
                commonApiValue = this.apiFormFields[currFieldIndex][q];
                break;
              }
          });

          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = (item.selection == 'multiple' && (item.formValueIds == 'undefined' || item.formValueIds == undefined)) ? [] : (item.formValueIds == 'undefined' || item.formValueIds == undefined) ? '' : item.formValueIds;
          filterLists = (item.selection == 'multiple' && (item.formValueItems == 'undefined' || item.formValueIds == undefined)) ? [] : (item.formValueItems == 'undefined' || item.formValueItems == undefined) ? '' : item.formValueItems;
          filterItems = (item.selection == 'multiple') ? filterItems : [filterItems];
          filterLists = (item.selection == 'multiple') ? filterLists : [filterLists];
          console.log(item, filterItems, filterLists)
          action = this.apiFormFields[currFieldIndex].action;
          actionApi = this.apiFormFields[currFieldIndex].actionApiName;
          actionQueryVal = this.apiFormFields[currFieldIndex].actionQueryValues;
          if(fieldName == 'folders'){
            wsFieldIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkWsField);
            console.log(this.formFields, wsFieldIndex)
            wsVal = this.formFields[this.stepIndex][this.step][wsFieldIndex].formValue;
            console.log(wsVal);
            if(wsVal.length>0){
              wsVal=JSON.stringify(wsVal);
            }
            else{
              wsVal="";
              return false;
            }
            apiData['workstreamsList'] = wsVal;
          }

          this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal, '', '', commonApiValue);
          break;
      }
    }
  }

  // Manage List
  manageList(fieldName, selectionType, apiData, apiUrl, fieldIndex, findex, filteredItems, filterLists, action, actionApiName, actionQueryVal, fieldData = '', actionData: any = '', commonApiValue: any = '') {
    let innerHeight = this.pageInfo.panelHeight;
    let inputData = {
      baseApiUrl: this.baseApiUrl,
      apiUrl: apiUrl,
      pageAccess: this.pageInfo.access,
      field: fieldName,
      selectionType: selectionType,
      filteredItems: filteredItems,
      filteredLists: filterLists,
      actionApiName: actionApiName,
      actionQueryValues: actionQueryVal
    };
    let access = 'newthread';
    let title = '';
    console.log(fieldName, fieldIndex, findex, apiUrl, apiData, filterLists, filteredItems)
    let apiFieldData: any = fieldData;
    console.log(fieldData)
    let apiField = (fieldName == 'frameRange' || fieldName == 'tags' || fieldName == 'parts') ? apiFieldData : this.apiFormFields[fieldIndex];
    let sibFields:any = false;
    let fieldTitle = apiField.title;
    switch(fieldName) {
      case 'errorCode':
      case 'Dtc':
        access = 'New Thread Error Codes';
        title = (fieldName == 'Dtc') ? fieldTitle : 'Error codes';
        break;
      case 'tags':
      case 'Tag':
        access = 'New Thread Tags';
        title = this.formType == 'market-place' ? 'Keywords' : 'Tags';
        break;
      case 'parts':
        access = 'New Parts';
        title = 'New Parts To Be Used';
        inputData.field = 'parts';
        break;
      case 'model':
        title = 'Model';
        filteredItems = filterLists;
        if(this.pageInfo.access != 'adas-procedure') {
          inputData.filteredItems = filterLists;
        }
        break;
      case 'AdditionalModelInfo':
        title = 'Additional Info';
        break;
      case 'AdditionalModelInfo2':
        title = 'Additional Info';
        break;
      case 'folders':
        title = 'Folder';
        break;
      case 'language':
        title = 'Language';
        break;
      case 'vinNo':
      case 'vinNoScanTool':
        title = 'Recent VINs';
        break;
      case 'SystemSelection':
        title = "System Selection";
        sibFields = true;
        break;
      case 'frameRange':
        title = 'Frame Range';
        break;
      case 'complaintCategory':
        title = 'Complaint Category';
        sibFields = true;
        break;
      case 'symptom':
        title = 'Symptoms';
        sibFields = true;
        break;
      case 'technicianInfo':
        title = 'Technician Info';
        access = 'techinfo';
        break;
      case 'Occurance':
        title = 'Occurance';
        break;
      case 'adasSystem':
        action = false;
        access = "newAdasSystem";
        title = "System Selection";
        break;  
      default:
        access = 'newthread';
        title = fieldTitle;
        break;
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
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.pageType = this.formType;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.commonApiValue = commonApiValue;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService)
      let res = receivedService;
      let id, itemVal, eitemVal, formVal, formValItem, formatAttr, formatType;
      console.log(fieldData)
      formatAttr = apiField.apiFieldType;
      formatType = apiField.apiValueType;
      let responseFlag = (actionData.length == 0) ? true : false;
      if(this.pageInfo.access == 'sib' && sibFields) {
        localStorage.setItem('sibFieldUpdate', sibFields);
      }
      if(selectionType == 'single') {
        res = res[0];
        id = (fieldName == 'vinNo' || fieldName == 'vinNoScanTool') ? res.id : res.id.toString();
        itemVal = res.name;
        switch (fieldName) {
          case 'model':
            let modelItems = apiField.itemValues;
            let itemValues = Object.keys(modelItems);
            let itemFlag = true;
            if(itemValues.length > 0) {
              itemFlag = (id == modelItems.id) ? false : true;
            }
            if(itemFlag) {
              apiField.itemValues = {
                id: id,
                name: itemVal,
                catg: res.catg,
                make: res.make,
                prodType: res.prodType,
                regions: res.regions,
                subCatg: res.subCatg,
                makeItems: res.makeItems,
                additionalInfo: res.additionalInfo,
                additionalInfo1: res.additionalInfo1,
                additionalInfo2: res.additionalInfo2,
                additionalInfo3: res.additionalInfo3,
                additionalInfo4: res.additionalInfo4,
                additionalInfo5: res.additionalInfo5
              }
            }
            break;

          case 'vinNo':
          case 'vinNoScanTool':
            let vinNo = res.vinNo;
            itemVal = vinNo;
            id = vinNo;
            apiField.changeAction = 'recent';
            apiField.itemValues = {
              id: vinNo,
              name: vinNo
            }
            let vinInfo = res;
            console.log(vinInfo)
            if(fieldName == 'vinNoScanTool') {
              vinInfo = [{
                vinNo,
                make: vinInfo.makeName,
                model: vinInfo.model,
                year: vinInfo.year
              }];
              this.formFields[this.stepIndex][this.step][findex].vinDetails = vinInfo;
            }
            apiField.vinNo = vinNo;
            apiField.vinDetails = vinInfo;
            apiField.vinValid = true;
            break;
        }

        id = (formatType == 1) ? id : [id];
        itemVal = (formatType == 1) ? itemVal : [itemVal];
        formVal = (formatAttr == 1) ? id : itemVal;
        apiField.valid = true;
        if(fieldName == 'frameRange') {
          fieldIndex = 0;
          apiField.selectedValueIds = id;
          apiField.selectedVal = formVal;
          apiField.selectedValues = formVal;
          //fieldData['valid'] = true;
          //this.formFields[this.stepIndex][this.step][findex].valid = apiField.valid;
          let sbf = actionData.actionField;
          let ac = actionData.actionIndex;
          let d = actionData.index;
          let ri = actionData.rowIndex;
          if(ri >= 0) {
            sbf = sbf.rowItems[ri].cellAction[fieldIndex];
          }
          console.log(actionData)
          this.onChange(sbf.fieldType, sbf.fieldName, d, sbf.selectedValues, -1, 'frame-range', true, ac, this.responseData.rowIndex);
          return false;
        } else {
          //apiField.valid = true;
          this.formFields[this.stepIndex][this.step][findex].valid = apiField.valid;
        }
      } else {
        if(this.pageInfo.access == 'adas-procedure' && fieldName == 'model') {
          let makeItems = [];
          res.forEach(ritem => {
            let makeId = ritem.make;
            let makeIndex = makeItems.findIndex(option => option == makeId);
            console.log(makeId, makeIndex)
            let makeModel = {
              make: makeId,
              model: ritem.id
            }
            makeItems.push(makeModel);
          });
          this.responseData.makeItems = makeItems;
        }
        
        let list = [];
        id = [];
        itemVal = [];
        eitemVal = [];
        for(let i of res) {
          id.push(i.id);
          itemVal.push(i.name);
          if(fieldName == 'errorCode') {
            eitemVal.push(i.ename);
            list.push({id: i.id, name: i.name, ename: i.ename});
          } else {
            list.push({id: i.id, name: i.name});
          }
        }
        id = (formatType == 1) ? id[0] : id;
        itemVal = (formatType == 1) ? itemVal[0] : itemVal;
        if(fieldName == 'errorCode') {
          formVal = (formatAttr == 1) ? id : eitemVal;
        } else {
          formVal = (formatAttr == 1) ? id : itemVal;
        }
        console.log(actionData, fieldName, fieldIndex)
        //console.log(apiField)
        if(actionData.length == 0) {
          apiField.valid = true;
          this.formFields[this.stepIndex][this.step][findex].valid = apiField.valid;
          apiField.selectedIds = list;
        } else {
          fieldIndex = 0;
          console.log(id)
          apiField.selectedValueIds = id;
          apiField.selectedVal = itemVal;
          apiField.selectedValues = itemVal;
          apiField.selectedIds = list;
          console.log(apiField)
        }
      }

      console.log(fieldName, itemVal, formVal, id, findex)
      if(responseFlag) {
        apiField.selectedValueIds = id;
        apiField.selectedValues = itemVal;
        apiField.selectedVal = itemVal;
        if(apiField.selection == 'single' && fieldName == 'model' && (this.industryType.id == 2 || this.industryType.id == 3)) {
          apiField.selectedValues = id;
        }
        if(apiField.selection == 'single' && fieldName != 'model') {
          apiField.itemValues = [{
            id: id,
            name: itemVal
          }];
        }
      }
      if(fieldName != 'frameRange') {
        this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
        this.formFields[this.stepIndex][this.step][findex].formValueIds = id;
        this.formFields[this.stepIndex][this.step][findex].formValueItems = itemVal;
      } else {
        apiField.selectedValueIds = id;
      }

      if(responseFlag) {
        this.responseData.addRow = false;
        this.sendResponse(fieldIndex);
      }
    });
  }

  // Attachments
  attachments(items, actionData:any = '', actionIndex:any = '', sindex:any = '') {
    console.log(this.apiFormFields, actionData, sindex)
    console.log(items)
    if(items.action == 'insert') {
      let minfo = items.media;
      let mindex = this.attachmentItems.findIndex(option => option.fileId == minfo.fileId);
      if(mindex < 0) {
        this.attachmentItems.push(minfo);
        this.pageInfo.attachmentItems = this.attachmentItems;
        this.attachmentFlag = false;
        setTimeout(() => {
          this.attachmentFlag = true;
        }, 10);
        let dindex = this.pageInfo.deletedFileIds.findIndex(option => option == minfo.fileId);
        if(dindex >= 0) {
          this.deletedFileIds.splice(dindex, 1);
          this.pageInfo.deletedFileIds = this.deletedFileIds;
        }
        let rindex = this.pageInfo.removeFileIds.findIndex(option => option.fileId == minfo.fileId);
        if(rindex >= 0) {
          this.removeFileIds.splice(rindex, 1);
          this.pageInfo.removeFileIds = this.removeFileIds;
        }
        this.responseData.action = 'media';
        this.responseData.type = 'updated-attachments';
        this.responseData.deletedFileIds = this.deletedFileIds;
        this.responseData.removeFileIds = this.removeFileIds;
        this.commonApi.emitDynamicFieldResponse(this.responseData);
      }
    } else if(items.action == 'remove') {
      let rmindex = this.attachmentItems.findIndex(option => option.fileId == items.media);
      this.attachmentItems.splice(rmindex, 1);
      this.attachmentFlag = false;
        setTimeout(() => {
          this.attachmentFlag = true;
        }, 10);
      this.deletedFileIds.push(items.media);
      this.pageInfo.deletedFileIds = this.deletedFileIds;
      this.pageInfo.attachmentItems = this.attachmentItems;
      this.responseData.action = 'media';
      this.responseData.type = 'updated-attachments';
      this.responseData.deletedFileIds = this.deletedFileIds;
      this.responseData.removeFileIds = this.removeFileIds;
      this.commonApi.emitDynamicFieldResponse(this.responseData);
    } else {
      this.uploadedItems = items;
      let fieldIndex = (actionData == '') ? this.apiFormFields.findIndex(option => option.fieldName == 'uploadContents') : actionIndex;
      console.log(fieldIndex)
      this.responseData.uploadedItems = this.uploadedItems;
      let actionFlag = (actionData == '') ? false : true;
      let fieldData = (actionData == '') ? [] : actionData;
      if(actionData != '') {
        this.responseData.actionSecIndex = actionIndex;
        this.responseData.fieldSec = 'sib';
        this.responseData.fieldIndex = sindex;
        this.responseData.rowIndex = -1;
        this.responseData.addRow = false;
        this.responseData.addSec = false;
        console.log(this.responseData)
      }
      this.responseData.addRow = false;
      this.sendResponse(fieldIndex, actionFlag, actionIndex, fieldData);
    }
  }

  // Audio Attachment
  audioAttachment(audioItem, actionData:any = '', actionIndex:any = '', sindex:any = '') {
    console.log(audioItem)
    this.audioUploadedItems = audioItem;
    let fieldIndex = (actionData == '') ? this.apiFormFields.findIndex(option => option.fieldName == 'audioDescription') : actionIndex;
    console.log(fieldIndex)
    this.responseData.uploadedItems = this.audioUploadedItems;
    let actionFlag = (actionData == '') ? false : true;
    let fieldData = (actionData == '') ? [] : actionData;
    if(actionData != '') {
      this.responseData.actionSecIndex = actionIndex;
      this.responseData.fieldSec = 'sib';
      this.responseData.fieldIndex = sindex;
      this.responseData.rowIndex = -1;
      this.responseData.addRow = false;
      this.responseData.addSec = false;
      console.log(this.responseData)
    }
    this.responseData.addRow = false;
    this.sendResponse(fieldIndex, actionFlag, actionIndex, fieldData);
  }

  // Attachment Action
  attachmentAction(data, actionData:any = '', actionIndex:any = '', sindex:any = '') {
    console.log(this.apiFormFields, actionData, actionIndex, sindex)
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;
    let lang = data.language;
    let type = 'updated-attachments';
    let uploadAction = 'update';
    let uploadedItems = this.uploadedItems;
    let timeout = 100;
    if(actionData != '') {
      this.apiFormFields.mainActionItems[0].editIndex = actionIndex;
      this.responseData.fieldData = actionData;
      timeout = 1500;
      //let sflag: any = true;
      //localStorage.setItem('sibFieldUpdate', sflag);
    }

    if(action == 'audio-delete' || action == 'audio-remove') {
      this.audioAttachmentItems = [];
      this.audioAttachmentViewFlag = false;
      this.audioAttachmentFlag = true;
      uploadAction = 'audio';
      this.audioUploadedItems = [];
      this.audioAttachmentItems = [];
      uploadedItems = this.audioUploadedItems;
    }

    switch (action) {
      case 'file-delete':
      case 'audio-delete':
        this.deletedFileIds.push(fileId);
        this.responseData.secData = this.responseData.secData;
        break;
      case 'file-remove':
      case 'audio-remove':
        this.removeFileIds.push(fileId);
        this.responseData.secData = this.responseData.secData;
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
    setTimeout(() => {
      this.responseData.secAction = '';
      this.responseData.action = uploadAction;
      this.responseData.type = type;
      this.responseData.updatedAttachments = this.updatedAttachments;
      this.responseData.deletedFileIds = this.deletedFileIds;
      this.responseData.removeFileIds = this.removeFileIds;
      this.responseData.addRow = false;
      this.responseData.uploadedItems = uploadedItems;
      this.responseData.formFields = this.formFields;
      this.responseData.formGroup = this.webForm;
      //this.sendResponse(0);
      this.commonApi.emitDynamicFieldResponse(this.responseData);
      setTimeout(() => {
        this.responseData.action = '';
        this.responseData.type = '';
        if(actionData != '')
          this.responseData.fieldData = '';
      }, timeout);
    }, 100);
  }

  // Add Frame Row
  addFrameRow(fdata, secIndex, rowIndex, flag) {
    console.log(fdata, secIndex, rowIndex);
    if(!flag) {
      this.responseData.addRow = true;
      this.responseData.action = 'addRow';
      this.responseData.actionSecIndex = secIndex;
      this.responseData.rowIndex = rowIndex;
      console.log(this.formFields)
      this.sendResponse(0, true, secIndex);
      setTimeout(() => {
        this.responseData.action = '';
      }, 100);
    }
  }

  // Remove Frame Row
  removeFrameRow(rowItems, actionIndex, rowIndex) {
    console.log(rowItems, actionIndex, rowIndex)
    let sibActionId = 0;
    let frameAactionId = 0;
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Remove Frame';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      if(receivedService) {
        let formField = this.formFields[this.stepIndex][this.step];
        let frameIndex = formField.findIndex(option => option.actionIndex == actionIndex && option.rowIndex == rowIndex && option.fieldName == 'id');
        frameAactionId = formField[frameIndex].formValue;
        console.log(frameAactionId)

        if(frameAactionId > 0) {
          let sibActIndex = formField.findIndex(option => option.actionIndex == actionIndex && option.rowIndex == -1 && option.fieldName == 'id');
          sibActionId = formField[sibActIndex].formValue;
          let apiData = {
            apiKey: this.pageInfo.apiKey,
            domainId: this.pageInfo.domainId,
            userId: this.pageInfo.userId,
            contentType: this.pageInfo.contentType,
            sibId: this.pageInfo.sibId,
            sibActionId: sibActionId,
            sibFrameNoId: frameAactionId
          };

          this.sibApi.deleteSib(apiData).subscribe((response) => {
            this.removingFrame(actionIndex, rowIndex, rowItems, formField);
          });
        } else {
          this.removingFrame(actionIndex, rowIndex, rowItems, formField);
        }

      }
    });
  }

  // Removing Frame Numbers
  removingFrame(actionIndex, rowIndex, rowItems, formField) {
    rowItems.splice(rowIndex, 1);
    formField = formField.filter(option => option.actionIndex <= actionIndex && option.rowIndex != rowIndex);
    //this.formFields[this.stepIndex][this.step] = formField;
    setTimeout(() => {
      let filteredRows = formField.filter(option => option.actionIndex === actionIndex && option.rowIndex > rowIndex);
      filteredRows.forEach(item => {
        item.rowIndex = item.rowIndex-1;
        if(item.fieldName == 'cutOffFrame') {
          let updateField = rowItems[item.rowIndex].cellAction[item.findex];
          let val = '';
          updateField.selectedValue = val;
          updateField.selectedVal = val;
          updateField.selectedValueIds = val;
        }
      });
      this.formFields[this.stepIndex][this.step] = formField;
      console.log(rowItems, formField);
    }, 50);
  }

  // SIB Section Action
  sibSectionAction(action, actionIndex, secData, id) {
    console.log(action, actionIndex, secData, id)
    switch (action) {
      case 'edit':
        localStorage.setItem('sibSectionData', JSON.stringify(secData));
        localStorage.setItem('formFields', JSON.stringify(this.formFields));
        break;
      case 'delete':
        this.removeSIBAction(secData, actionIndex, id);
        return false;
        break;
    }
    this.responseData.action = 'sibSecAction';
    this.responseData.fieldSec = 'sib';
    this.responseData.secAction = action;
    this.responseData.sectionIndex = this.secIndex;
    this.responseData.actionSecIndex = actionIndex;
    this.responseData.secData = secData;
    this.responseData.secid = id;
    this.commonApi.emitDynamicFieldResponse(this.responseData);
    setTimeout(() => {
      this.responseData.action = '';
    }, 100);
  }

  // Remove SIB Action
  removeSIBAction(actionItems, actionIndex, sibActionId) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Remove SIB Action';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      if(receivedService) {
        let apiData = {
          apiKey: this.pageInfo.apiKey,
          domainId: this.pageInfo.domainId,
          userId: this.pageInfo.userId,
          contentType: this.pageInfo.contentType,
          sibId: this.pageInfo.sibId,
          sibActionId: sibActionId,
          sibFrameNoId: 0
        };

        this.sibApi.deleteSib(apiData).subscribe((response) => {
          actionItems.splice(actionIndex, 1);
          let formField = this.formFields[this.stepIndex][this.step];
          formField = formField.filter(option => option.actionIndex != actionIndex);
          setTimeout(() => {
            let filteredSec = formField.filter(option => option.actionIndex > actionIndex);
            filteredSec.forEach(item => {
              item.actionIndex = item.actionIndex-1;
            });
            this.formFields[this.stepIndex][this.step] = formField;
            console.log(actionItems, formField);
            this.secTabStatus.splice(actionIndex, 1);
            this.secTabStatus.forEach((tab, t) => {
              tab = false;
            });
            let cindex = (actionIndex == 0) ? actionIndex : actionIndex-1;
            this.secTabStatus[cindex] = true;
          }, 50);
        });
      }
    });
  }

  // Send Response
  sendResponse(fieldIndex, actionField:any =false, actionIndex:any = '', fieldData:any = '') {
    console.log(fieldIndex, fieldData, this.apiFormFields)
    let apiField = (actionField) ? this.apiFormFields.cells.sib[actionIndex].sibActions[fieldIndex] : this.apiFormFields[fieldIndex];
    this.responseData.fieldIndex = (fieldData == '') ? fieldIndex : this.responseData.fieldIndex;
    this.responseData.fieldData = apiField;
    this.responseData.formGroup = this.webForm;
    this.responseData.formFields = this.formFields;
    if(fieldData != '') {
      this.responseData.fieldData = fieldData;
    }
    this.commonApi.emitDynamicFieldResponse(this.responseData);
  }

  // Allow only numeric
  restrictNumeric(type, field, c, val, optIndex) {
    let res = this.commonApi.restrictNumeric(val);
    return res;
  }

  onTabClose(event) {
    console.log(event);
    console.log({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }

  onTabOpen(event) {
    console.log(event, this.apiFormFields, this.secTabStatus)
    let currIndex = event.index;
    let editIndex = this.apiFormFields.mainActionItems[0].editIndex;
    this.secTabStatus.forEach((tab, t) => {
      tab = false;
    });
    this.secTabStatus[currIndex] = true;
    this.apiFormFields.cells.sib.forEach((sitem, si) => {
      console.log(sitem, si, currIndex)
      let sibAct = sitem.sibActions;
      let sindex = sibAct.findIndex(option => option.fieldName == 'id');
      let sid = sibAct[sindex].selectedValues;
      let upindex = sibAct.findIndex(option => option.fieldName == 'uploadContents');
      sibAct[upindex].disabled = (si == currIndex) ? false : true;
      console.log(sid);
      if(si != currIndex) {
        sibAct.forEach(item => {
          item.saveFlag = false;
          if(item.fieldName == 'uploadContents') {
            item.disabled = true;
          }
        });
      } else {
        sibAct.forEach(sitem => {
          if(sid == 0) {
            sitem.saveFlag = true;
            if(sitem.fieldName == 'uploadContents') {
              //sitem.disabled = true;
            }
          }
        });
      }
    });
    console.log(this.apiFormFields.cells.sib)
    if(editIndex >= 0) {
      let secData = this.apiFormFields.cells.sib[editIndex];
      console.log(secData)
      this.sibSectionAction('save', editIndex, secData, 0);
    }
    console.log({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }

  // On File Upload
  // onFileUpload(event) {
  //   let uploadFlag = true;
  //   this.selectedPartsImg = event.target.files[0];
  //   let type = this.selectedPartsImg.type.split("/");
  //   let type1 = type[1].toLowerCase();
  //   let fileSize = this.selectedPartsImg.size / 1024 / 1024;
  //   this.invalidFileErr = "";

  //   if (fileSize > 8) {
  //     uploadFlag = false;
  //     this.invalidFileSize = true;
  //     this.invalidFileErr = "File size exceeds 2 MB";
  //   }

  //   if (uploadFlag) {
  //     if (type1 == "jpg" || type1 == "jpeg" || type1 == "png") {
  //       this.OnUploadFile();
  //     } else {
  //       this.invalidFile = true;
  //       this.invalidFileErr = "Allow only JPEG or PNG";
  //     }
  //   }

  //   return false;
  // }

  // // On File Upload
  // onFileUpload(event, fieldData, sec){
  //   let uploadFlag = true;
  //   this.selectedBannerImg = event.target.files[0];
  //   this.selectedMarketPlaceBanner = event.target.files[0]
  //   let type = this.selectedBannerImg.type.split('/');
  //   let type1 = type[1].toLowerCase();
  //   let fileSize = this.selectedBannerImg.size/1024/1024;
  //   this.invalidFileErr = "";

  //   if(fileSize > 8) {
  //     uploadFlag = false;
  //     this.invalidFileSize = true;
  //     this.invalidFileErr = "File size exceeds 2 MB";
  //   }

  //   if(uploadFlag) {
  //     if(type1 == 'jpg' || type1 == 'jpeg' || type1 == 'png' ){
  //       this.OnUploadFile(fieldData, sec);
  //     }
  //     else{
  //       this.invalidFile = true;
  //       this.invalidFileErr = "Allow only JPEG or PNG";
  //     }
  //   }

  //   return false;
  // }

  audioItem(event) {
    console.log(event)
  }

  // OnUploadFile(fieldData, sec) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(this.selectedBannerImg);
  //   reader.onload = (_event) => {
  //     this.imgURL = reader.result;
  //     this.imgName = null;
  //     this.marketPlaceimgUrl = reader.result;
  //     this.marketPlaceimgName = null;
  //     this.defaultBanner = false;
  //     this.responseData['bannerImage'] = this.imgURL;
  //     this.responseData['bannerFile'] = this.selectedBannerImg;
  //     this.responseData['defaultBanner'] = this.defaultBanner;
  //     let event: any = {
  //       imgUrl: this.marketPlaceimgUrl,
  //       imgName: this.marketPlaceimgName,
  //       selectFile: this.selectedMarketPlaceBanner,
  //       type: 'Upload'
  //     }
  //     this.sendFileData.emit(event);
  //     this.sendBannerData(fieldData, sec);
  //   }
  // }

  onBlur(field: any, val: any) {
    if (field == 'birdPrice' || field == 'discountPrice') {
      this.sendBirdPriceValue.emit(Math.round(val));
      setTimeout(() => {
        this.sendBirdPriceFocus.emit(false);
      }, 500);
    }
    if (field == 'birdPercentage' || field == 'discountPercentage') {
      this.sendBirdPercentageValue.emit(Math.round(val));
      setTimeout(() => {
        this.sendBirdPercentageFocus.emit(false);
      }, 500);
    }
    if (field == 'price') {
      this.sendRegularPrice.emit(val);
    }
  }

  onFocus(field: any, val: any, event: any) {
    if (field == 'birdPrice' || field == 'discountPrice') {
      this.sendBirdPriceFocus.emit(true);
      this.birdPriceInitialized = true;
    }
    if (field == 'birdPercentage' || field == 'discountPercentage') {
      this.sendBirdPercentageFocus.emit(true);
      this.birdPriceDiscountInitialized = true;
    }
    if(this.pageInfo.access == 'market-place' && field == 'manualId') {
      event.currentTarget.blur();
      this.showManualsPopup.emit(true);
    }
    if(this.pageInfo.access == 'market-place' && field == 'salesPerson') {
      event.currentTarget.blur();
      this.showSalesPersonPopup.emit(true);
    }
  }

  // // Remove Uploaded File
  // deleteUploadedFile(fieldData, sec) {
  //   this.selectedBannerImg = null;
  //   this.imgURL = this.selectedBannerImg;
  //   this.imgName = null;
  //   this.marketPlaceimgUrl = this.selectedBannerImg;
  //   this.marketPlaceimgName = null;
  //   this.defaultBanner = true;
  //   this.responseData['bannerImage'] = this.imgURL;
  //   this.responseData['bannerFile'] = this.selectedBannerImg;
  //   this.responseData['defaultBanner'] = this.defaultBanner;
  //   let event: any = {
  //     imgUrl: this.marketPlaceimgUrl,
  //     imgName: this.marketPlaceimgName,
  //     selectFile: this.selectedMarketPlaceBanner,
  //     type: 'Delete'
  //   }
  //   this.sendFileData.emit(event);
  //   this.sendBannerData(fieldData, sec);
  // }

  // OnUploadFile() {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(this.selectedPartsImg);
  //   reader.onload = (_event) => {
  //     this.imgURL = reader.result;
  //     this.imgName = null;
  //     this.marketPlaceimgUrl = reader.result;
  //     this.marketPlaceimgName = null;
  //     this.defaultBanner = false;
  //     this.responseData['bannerImage'] = this.imgURL;
  //     this.responseData['bannerFile'] = this.selectedBannerImg;
  //     this.responseData['defaultBanner'] = this.defaultBanner;
  //     let event: any = {
  //       imgUrl: this.marketPlaceimgUrl,
  //       imgName: this.marketPlaceimgName,
  //       selectFile: this.selectedMarketPlaceBanner,
  //       type: 'Upload'
  //     }
  //     this.sendFileData.emit(event);
  //     this.sendBannerData(this.bannerField, this.bannerFieldIndex);
  //   };
  // }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedPartsImg = null;
    this.imgURL = this.selectedPartsImg;
    this.imgName = null;

    if (this.pageInfo.access == 'documents' || this.pageInfo.access == 'adas-procedure') {
      let event: any = {
        bannerImage: "",
        bannerFile: "",
        defaultBanner: true,
        type: 'banner'
      }
      this.commonApi.emitDynamicFieldResponse(event);
    }

  }

  // Disable Selection
  disableSelection() {
    return true;
  }

  // Send Banner Data
  sendBannerData(fieldData, sec) {
    let fieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldData.fieldName);
    this.responseData.fieldIndex = (fieldData == '') ? fieldIndex : this.responseData.fieldIndex;
    this.responseData.fieldData = fieldData;
    this.responseData.formGroup = this.webForm;
    this.responseData.formFields = this.formFields;
    this.responseData.type = 'banner';
    this.commonApi.emitDynamicFieldResponse(this.responseData);
    setTimeout(() => {
      this.responseData.type = '';
    }, 500);
  }

  valueChange(value: any) {
    let pendingText: any;
    if (value) {
      pendingText = value.length
    } else {
      pendingText = 0;
    }
    this.pendingInputText = pendingText+'/';
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode == 46  && event?.target?.value?.split('.')?.length < 2) || (charCode >= 48 && charCode <= 57)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addedEmail(field, fieldType, fieldName, c, event, index) {
    if(event.value != undefined){
      if(event.value.length>0){
        this.serverErrorMsg = '';
        this.serverError = false;
        console.log(this.validateEmail(event.value));
        if(!this.validateEmail(event.value)) {
          this.serverError = true;
          this.serverErrorMsg = event.value + ' is not a valid email address';
          field.selectedValues.pop();
          setTimeout(() => {
            this.serverError = false;
            this.serverErrorMsg = '';
          }, 2500);
        }
        this.onChange(fieldType, fieldName, c, field.selectedValues, index);
      }
    }
  }
  removedEmail(field, fieldType, fieldName, c, event, index){
    this.serverErrorMsg = '';
    this.serverError = false;
    this.onChange(fieldType, fieldName, c, field.selectedValues, index);
  }
  validateEmail(email) {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(String(email).toLowerCase());
  }

  completeTrainingsMethod(val, type) {
    this.filterdTrainingsTitle = this.trainingsTitleList;
    const value = val?.query; //!= '' ? val?.query : selectedVal;
    if (type == 'trainingName') { this.filterdTrainingsTitle = this.trainingsTitleList.filter((item) => (item.trainingName?.toLowerCase().indexOf(value.toLowerCase()) == 0)) }
    else if (type == 'sku') { this.filterdTrainingsTitle = this.trainingsTitleList.filter((item) => (item.sku?.toLowerCase().indexOf(value.toLowerCase()) == 0)) };
    this.filterdTrainingsName = this.filterdTrainingsTitle.map((res) => res.trainingName);
    this.filterdTrainingsSku = this.filterdTrainingsTitle.map((res) => res.sku);
  }

  completeManualsMethod(val, type) {
    this.filterdManualsTitle = this.manualsTitleList;
    const value = val?.query; //!= '' ? val?.query : selectedVal;
    if (type == 'manualName') { this.filterdManualsTitle = this.manualsTitleList.filter((item) => (item.manualName?.toLowerCase().indexOf(value.toLowerCase()) == 0)) }
    else if (type == 'sku') { this.filterdManualsTitle = this.manualsTitleList.filter((item) => (item.sku?.toLowerCase().indexOf(value.toLowerCase()) == 0)) };
    this.filterdManualsName = this.filterdManualsTitle.map((res) => res.manualName);
    this.filterdManualsSku = this.filterdManualsTitle.map((res) => res.sku);
  }

  openDropdownEvent(ev) {
    this.scrollBarEvent.emit(ev);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
