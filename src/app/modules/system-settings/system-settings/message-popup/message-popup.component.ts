import { Component, OnInit, HostListener, Input} from "@angular/core";
import { Constant, ContentTypeValues } from "src/app/common/constant/constant";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiService } from '../../../../services/api/api.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from '@angular/common/http';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { UserDashboardService } from 'src/app/services/user-dashboard/user-dashboard.service'; 
import * as ClassicEditor from "src/build/ckeditor";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {
  @Input() menuId: any;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string = "thread-config";
  public apiKey: string = Constant.ApiKey;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public apiInfo: Object;
  public loading: boolean = true;
  public itemEmpty: boolean = false;
  public configData: any;
  public configLtData: any;
  public configRtData: any;
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public rmHeight: any = 115; 
  public expandFlag: boolean = true;
  public systemMsg: Message[];
  public displayModal: any = false;
  public domainName: string = '';
  public currentDomainName: string = '';
  public currentDomainId: string = '';
  public buttonEnableFlag: boolean = false;
  public errorMsgFlag: boolean = false;
  public errorMsgText: string = '';
  public domainTitleText: string = '';
  public landingBannerFit: boolean = true;
  public loginImageUrl: string = '';
  public loginFileType: string = '';
  public bodyClass1:string = "profile";
  public bodyClass2:string = "image-cropper";
  public notesValid: boolean = false;
  public editPostUpload: boolean = true;
  public manageAction: string;
  public postEditApiData: object;
  public contentType: number = 0;
  public displayOrder: number = 0;
  public EditAttachmentAction: 'attachments';
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public mediaUploadItems: any = [];
  public uploadedItems: any = [];
  public attachments: any = [];
  public pageAccess: string = 'welcome-message';
  public imageFlag: string = 'false'; 
  public systemSettingsData: any;
  public notesModalFlag: boolean = false;
  public customerNotesFlag: boolean = false;
  public customerNotes: string = '';
  public contentDisplay:any;
  public customerEditor: string = '';
  public Editor = ClassicEditor;
  public message: string = '';
  public settingsId;
  public itemId;
  public headText: string = '';
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
    placeholder: 'Enter Disclaimer',
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
    public sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private apiUrl: ApiService,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private LandingpagewidgetsAPI: LandingpageService,
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private userDashboardApi: UserDashboardService,
  ) { }

  ngOnInit(): void {

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   
   
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    
  this.postEditApiData = {
    access: this.pageAccess,
    pageAccess: this.pageAccess,
    apiKey: Constant.ApiKey,
    domainId: this.domainId,
    countryId: this.countryId,
    userId: this.userId,
    contentType: '',      
    displayOrder: this.displayOrder,
    uploadedItems: [],
    attachments: [],
    attachmentItems: [],
    updatedAttachments: [],
    deletedFileIds: [],
    removeFileIds: []
  };
  
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.domainName = this.user.data.subDomainUrl;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.systemSettings();
    this.getUserProfile();
 }

 onToggleBoxChange(settingsId,itemId,flag){
  console.log("systemSettingsTypeId="+settingsId,itemId,"systemSettingsId",flag);
  let flagValue = flag ? '1' : '0';
  const apiFormData = new FormData();
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('countryId', this.countryId);   
  apiFormData.append('itemId', itemId);    
  apiFormData.append('systemSettingsTypeId', settingsId);    
  apiFormData.append('systemSettingsId', '9');      
  apiFormData.append('value', flagValue); 
      
  this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe(res => {

    if(res.status=='Success'){
      this.systemMsg = [{severity:'success', summary:'', detail:res.result}];
      this.primengConfig.ripple = true;
      setTimeout(() => {
        this.systemMsg = [];
      }, 3000);
      console.log(res);
    }
    else{

    }
      
    },
    (error => {})
    );
}

 systemSettings(){
  const apiFormData = new FormData();
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);    
  apiFormData.append('settingsId', "9");      
          
  this.commonApi.getSystemSettings(apiFormData).subscribe(res => {
    this.loading = false;
    if(res.status=='Success'){
       console.log(res.items);
       let itemsArr = [];
       itemsArr = res.items;
       
       for(let type in itemsArr){
        this.headText = itemsArr[type].name;
        this.settingsId = itemsArr[type].settingsId;
        for(let type1 in itemsArr[type].settings){ 
          itemsArr[type].settings[type1].toggleBox = itemsArr[type].settings[type1].value == 1 ? true : false;          
          this.itemId = itemsArr[type].settings[type1].itemId;
        }
       }
      this.systemSettingsData = itemsArr;

      this.loading = false;
    }      
    else{} 
  },
  (error => {})
  );    
} 


  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight-155;
    //this.rmHeight = 115;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    //this.rmHeight = this.rmHeight+headerHeight;
    this.innerHeight = (this.bodyHeight + headerHeight)-138;
  }


  updateNotes(type){

    if(type == 'new'){
      this.customerNotes = '';
    }    
    this.customerEditor = this.customerNotes;
    this.notesModalFlag = true;
  }

  changeNotes(event){
    this.notesValid = this.customerEditor == '' ? true : false;  
  }

  getUserProfile() {
    let userData = {
      'api_key': Constant.ApiKey,
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {
      let resultData = response.disclaimerText;
      this.customerNotesFlag = false; 
      if(resultData!=''){
        let content = '';           
        this.customerNotesFlag = true;
        content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(resultData));
        this.customerNotes = content;
        let contentDisplay = content;
        this.contentDisplay = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentDisplay));        
      }
      this.loading = false;
    });
  }

  saveNotes(){
    if(!this.notesValid){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);      
    apiFormData.append('systemSettingsId', '9');    
    apiFormData.append('itemId', this.itemId);    
    apiFormData.append('systemSettingsTypeId', this.settingsId);    
    apiFormData.append('disclaimerText', this.customerEditor); 
        
    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe(response => {

        if (response.status == "Success") {

          this.systemMsg = [{severity:'success', summary:'', detail:response.result}];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.systemMsg = [];
          }, 3000);

          this.customerNotesFlag = true;
          let content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.customerEditor));
          this.customerNotes = content;
          let contentDisplay = content;
          this.contentDisplay = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentDisplay));
          
        }
        else{

        }

        this.notesModalFlag = false;

      });
      


      

    }
  }

  

  
}





