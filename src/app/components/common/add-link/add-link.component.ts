import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { MediaManagerService } from '../../../services/media-manager/media-manager.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant , AttachmentType} from '../../../common/constant/constant';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { CommonService } from '../../../services/common/common.service';
import * as ClassicEditor from "src/build/ckeditor";
import { ApiService } from '../../../services/api/api.service';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss']
})
export class AddLinkComponent implements OnInit, OnDestroy {

  @Input() reminderPOPUP: string= '';
  @Input() threadId: string = '';
  @Input() groups: string= '';
  @Input() editData: string= '';
  @Input() access: string= '';
  @Input() workstreams: any = [];
  @Input() apiData: any = [];
  @Input() nextEscalationText: string = '';
  @Input() titleTest: string = '';
  @Input() specialText: string = '';
  @Input() contentText: string = '';
  @Input() actionText: string = '';
  @Output() confirmAction: EventEmitter<any> = new EventEmitter();
  @Output() mediaServices: EventEmitter<any> = new EventEmitter();
  @Output() resServices: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  public domainId;
  public userId;
  public countryId;
  public title: string = "Add Link";
  public action: string = "";
  public actionId: any = "";
  public link: string = "";
  public caption: string = "";
  public description: string = "";
  public score: number;
  public errTxt: string = "";
  public maxLen: number = 100;
  public editorProgressUpload=0;
  public addLinkFlag:boolean = false;
  public editLinkFlag:boolean = false;
  public addReminderFlag:boolean = false;
  public addScoreFlag:boolean = false;
  public attachmentView: boolean = false;
  uploadFileLength: number;
  linkForm: FormGroup;
  reminderForm: FormGroup;
  public linkSubmitted: boolean = false;
  public submitted1: boolean = false;
  uploadedFiles: any[] = [];
  filesArr: any;
  attachments: any[] = [];
  progressInfos = [];
  public user: any;
  public escalateFlag:boolean = false;
  public kaizenNotesFlag:boolean = false;
  public reminderFlag:boolean = false;
  public specialMsgFlag:boolean = false;
  public techSummitFlag:boolean = false;
  public scoreInvalidValue:boolean = false;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public linkThumb: string = `${this.mediaPath}/link-medium.png`;
  public linkError: boolean = false;
  public linkErrorMsg: string ='';
  public placeHolderText:string = '';
  public labelText:string = '';
  public kdescription: string = '';
  public reminderTitle: string = '';
  public reminderLabel: string = '';
  public reminderPlaceholder: string = '';
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
    placeholder: 'Enter Notes',
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
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }

  // convenience getters for easy access to form fields
  get f() { return this.linkForm.controls; }

  // convenience getters for easy access to form fields
  get s() { return this.reminderForm.controls; }

  ngOnInit(): void {

    console.log(this.reminderPOPUP);
    if(this.reminderPOPUP == "Reminder"){ 
      this.reminderTitle = 'Reminder';
      this.reminderLabel = 'Message';
      this.reminderPlaceholder = 'Enter Message (Optional)';  
      this.reminderFlag = true;
      this.reminderForm = this.formBuilder.group({
        description: [this.description, []],
      });
    }
    else if(this.reminderPOPUP == "Escalate"){
      this.escalateFlag = true;
      this.addReminderFlag = true;
      switch(this.apiData['nextEscalation']){
        case 'L1':
          this.labelText = 'Reason for manual L1 escalation';
          this.placeHolderText = 'Enter reason for manual L1 escalation';
          break;
        case 'L2':
          this.labelText = 'Reason for manual L2 escalation';
          this.placeHolderText = 'Enter reason for manual L2 escalation';
          break;
        case 'L3':
          this.labelText = 'Reason for manual L3 escalation';
          this.placeHolderText = 'Enter reason for manual L3 escalation';
          break;
        case 'L4':
          this.labelText = 'Reason for manual L4 escalation';
          this.placeHolderText = 'Enter reason for manual L4 escalation';
          break;
        case 'L5':
          this.labelText = 'Reason for manual L5 escalation';
          this.placeHolderText = 'Enter reason for manual L5 escalation';
          break;
        case 'L6':
          this.labelText = 'Reason for manual L6 escalation';
          this.placeHolderText = 'Enter reason for manual L6 escalation';
          break;
        case 'qadl1':
        case 'qadL1':
          this.labelText = 'Reason for manual QAD L1 escalation';
          this.placeHolderText = 'Enter reason for manual QAD L1 escalation';
          break;
        case 'qadL2':
        case 'qadl2':
          this.labelText = 'Reason for manual QAD L2 escalation';
          this.placeHolderText = 'Enter reason for manual QAD L2 escalation';
          break; 
        case 'qadl3':
        case 'qadL3':
          this.labelText = 'Reason for manual QAD L3 escalation';
          this.placeHolderText = 'Enter reason for manual QAD L3 escalation';
          break;  
        default:
          break;                 
      }

      this.reminderForm = this.formBuilder.group({
        description: [this.description, []],
      });

    }
    else if(this.reminderPOPUP == "kaizen-notes"){
      if(this.specialText == 'Message'){
        this.titleTest = this.actionText+' '+this.titleTest;
        this.labelText = this.specialText;
        this.placeHolderText = 'Enter '+this.specialText;
        if(this.actionText == 'Edit'){
          this.kdescription = this.contentText;
        }
      }
      else{
        this.labelText = "Notes";
      }
      this.kaizenNotesFlag = true;
      this.addReminderFlag = true;
      this.reminderForm = this.formBuilder.group({
        description: [this.description, []],
      }); 
    }
    else if(this.reminderPOPUP == "TechSummitScore"){
      this.techSummitFlag = true;

      this.reminderForm = this.formBuilder.group({
        score: [this.score, [Validators.required]]
      });

  }
    else{
      if(this.access == 'Edit Link'){
        this.editLinkFlag = true;
        this.link = this.editData['linkData'];
        this.caption = this.editData['captionData'];
        this.title = this.access;
      }
      this.linkForm = this.formBuilder.group({
        link: [this.link, [Validators.required]],
        caption: [this.caption, []],
        //description: [this.description, [Validators.required]]
      });
    }

	this.user = this.authenticationService.userValue;
	this.domainId = this.user.domain_id;
	this.userId = this.user.Userid;
	this.countryId = localStorage.getItem('countryId');

  }

  ondescChange(value){
    if(this.escalateFlag){
      if(value==''){
        this.addReminderFlag = true;
      }
      else{
        this.addReminderFlag = false; 
      }
    }
  }

  onkzdescChange(val=''){
    if(this.kaizenNotesFlag){
      if(this.specialText == 'Message'){
        if(val==''){
          this.addReminderFlag = true;
        }
        else{
          this.addReminderFlag = false; 
        }
      }
      else{
        if(this.kdescription==''){
          this.addReminderFlag = true;
        }
        else{
          this.addReminderFlag = false; 
        }
      }
      
    }
  }

  // Cancel Action
  cancelAction() {
    let data = {
      action: false
    };
    this.confirmAction.emit(data);
  }

  // Add Link
  editLink() {

    this.linkSubmitted = true;
    this.linkError = false;
    this.linkErrorMsg = '';

    if (this.linkForm.invalid) {
      this.addLinkFlag  = false;
      return;
    }

    let  val = this.linkForm.value.link;
    let valid = (val.length > 0) ? true : false;
    let url = this.isValidURL(val);
    valid = url;
    if(valid) {
      let data = new FormData();
      data.append('apiKey', Constant.ApiKey);
      data.append('link', this.link);
      data.append('domainId', this.domainId);
      this.commonApi.getSiteLogo(data).subscribe((response) => {

        console.log(response);
        this.addLinkFlag  = false;

        let logo = (response.linkImg != "") ? response.linkImg : this.linkThumb;

        let editData = {
          linkData: this.link,
          captionData: this.linkForm.value.caption,
          logoData: logo
        }
        this.mediaServices.emit(editData);

      });
    } else {
      this.addLinkFlag  = false;
      this.linkError = true;
      this.linkErrorMsg = 'Invalid Url';
      let logo = this.linkThumb;
    }

  }

   // Add Link
  addLink() {
    this.linkSubmitted = true;
    this.linkError = false;
    this.linkErrorMsg = '';

    if (this.linkForm.invalid) {
      this.addLinkFlag  = false;
      return;
    }

    let valid = this.isValidURL(this.linkForm.value.link);
    if(!valid) {
      this.linkError = true;
      this.addLinkFlag  = false;
      return;
    }

    this.addLinkFlag = true;
    let mediaData = new FormData();

    mediaData.append('apiKey', Constant.ApiKey);
    mediaData.append('domainId', this.domainId);
    mediaData.append('countryId', this.countryId);
    mediaData.append('userId', this.userId);
    mediaData.append('workstreams', JSON.stringify(this.workstreams))

    mediaData.append('linkUrl', this.linkForm.value.link);
    mediaData.append('fileCaption', this.linkForm.value.caption);
    //mediaData.append('description', this.linkForm.value.description);

    mediaData.append('uploadCount', '1');
    mediaData.append('uploadFlag', 'true');
    mediaData.append('type', 'link');
    mediaData.append('platform', '3');
    mediaData.append('displayOrder', '1');
    mediaData.append('contentId', this.apiData.contentId);
    mediaData.append('caption',  this.linkForm.value.caption);
    mediaData.append('language', this.apiData.language);
    mediaData.append('workstreamId', this.apiData.workstreamId);
    mediaData.append('uploadByAuthor', this.apiData.uploadByAuthor);
    mediaData.append('userInputId', this.apiData.userInputId);
    mediaData.append('mediaId', this.apiData.mediaId);
    mediaData.append('isVideoCompressed', "0");
    mediaData.append('threadId', '');
    mediaData.append('directAttachment', "0");
    mediaData.append('postStatus', "");
    mediaData.append('flagId', this.apiData.flagId);
    mediaData.append('postType', '');
    mediaData.append('fileDuration', "0");
    mediaData.append('compressionType', "0");
    if(this.access == 'gtsr') {
      mediaData.append('procedureId', this.apiData.procedureId);
      mediaData.append('processId', this.apiData.processId);
      mediaData.append('gtsId', this.apiData.gtsId);
      mediaData.append('contentTypeId', this.apiData.contentTypeId);
      mediaData.append('dataId', this.apiData.dataId);
    }
    console.log("mediaData", mediaData);
    this.mediaApi.getMediaUploadURL(mediaData).subscribe((response) => {
      if(response.status == 'Success') {
        this.addLinkFlag  = false;
        this.mediaServices.emit(response);
      }
      else{
        this.addLinkFlag  = false;
      }
    });
  }

  addReminder(){

    if(this.reminderFlag){
      
        this.addReminderFlag = true;
        let apiData = new FormData();
    
        apiData.append('apiKey', Constant.ApiKey);
        apiData.append('domainId', this.domainId);
        apiData.append('countryId', this.countryId);
        apiData.append('userId', this.userId);
        apiData.append('threadId', this.threadId);
        apiData.append('scorePoint', this.reminderForm.value.description);
    
        this.threadPostService.addReminderAPI(apiData).subscribe((response) => {
          if(response.status == 'Success') {
            this.addReminderFlag  = false;
            this.mediaServices.emit(response);
          }
          else{
            this.addReminderFlag  = false;
          }
        });
      
    }
    if(this.escalateFlag){
      this.addReminderFlag = true;
      const apiFormData = new FormData();    
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.apiData['domainId']);
      apiFormData.append('countryId', this.apiData['countryId']);
      apiFormData.append('userId', this.apiData['userId']);
      apiFormData.append('threadId', this.apiData['threadId']);
      apiFormData.append('postId', this.apiData['postId']);
      apiFormData.append('postedBy', this.apiData['postedBy']);     
      apiFormData.append('modelName', this.apiData['modelName']);    
      apiFormData.append('currentEscalation', this.apiData['currentEscalation']);
      apiFormData.append('nextEscalation', this.apiData['nextEscalation']);
      apiFormData.append('missingEscalation', this.apiData['missingEscalation']);
      apiFormData.append('dealerCode', this.apiData['dealerCode']);   
      apiFormData.append('description', this.reminderForm.value.description);

      this.threadPostService.manualEscalationActionAPI(apiFormData).subscribe((response) => {
        if(response.status == 'Success') {
          this.addReminderFlag  = false;
          this.resServices.emit(response);
        }
        else{
          this.addReminderFlag  = false;
      }
    });
    }
    if(this.kaizenNotesFlag){
      this.addReminderFlag = true;
      this.resServices.emit(this.reminderForm.value.description);
    }
    
  }

  addScore(){

    this.submitted1 = true;

    if (this.reminderForm.invalid) {
      this.addScoreFlag  = false;
      return;
    }

    this.addScoreFlag = true;
    let apiData = new FormData();

    apiData.append('apiKey', Constant.ApiKey);
    apiData.append('domainId', this.domainId);
    apiData.append('countryId', this.countryId);
    apiData.append('userId', this.userId);
    apiData.append('threadId', this.threadId);
    apiData.append('scorePoint', this.reminderForm.value.score);
    apiData.append('groups', this.groups);
    apiData.append('closeStatus', 'yes');
    apiData.append('emailFlag', '1');

    console.log(this.reminderForm.value.score);
    console.log(this.groups);

    this.threadPostService.closeThread(apiData).subscribe(response => {
      if(response.status == 'Success') {
        this.addReminderFlag  = false;
        this.mediaServices.emit(response);
      }
      else{
        this.addReminderFlag  = false;
      }
    });
  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      this.addScoreFlag  = false;
      this.scoreInvalidValue = false;
      this.submitted1 = false;
      return true;
    }
  }

  // Check valid url
  isValidURL(url) {
    if (url!= '' && !/^(?:f|ht)tps?\:\/\//.test(url)) {
      this.link = "https://" + url;
      url =  "https://" + url;
    }
    else{
      this.link = url;
      url = url;
    }
    var regexp = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    //let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(url)) {
      console.log(url+"url true");
      return true;
    } else {
      console.log(url+"url false");
      return false;
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

  ngOnDestroy() {
    document.body.classList.remove('kaizen-notes');
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
