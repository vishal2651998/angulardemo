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

@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss']
})
export class WelcomeMessageComponent implements OnInit {
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

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
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
    

    this.commonApi.welcomemsgUploadDataReceivedSubject.subscribe((response) => {
      if(response){
        this.getUserProfile();
      }
    })
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
  apiFormData.append('systemSettingsId', '7');      
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
  apiFormData.append('settingsId', "7");    
  
          
  this.commonApi.getSystemSettings(apiFormData).subscribe(res => {
    
    if(res.status=='Success'){
       console.log(res.items);
       let itemsArr = [];
       itemsArr = res.items;
       for(let type in itemsArr){
        for(let type1 in itemsArr[type].settings){ 
          itemsArr[type].settings[type1].toggleBox = itemsArr[type].settings[type1].value == 1 ? true : false;
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

 getUserProfile() {
  let userData = {
    'api_key': Constant.ApiKey,
    'user_id': this.userId,
    'domain_id': this.domainId,
    'countryId': this.countryId
  }
  this.probingApi.getUserProfile(userData).subscribe((response) => {
    let resultData = response.welcomeBannerOption;
    if(resultData!=''){
      let fileType = resultData.fileType.split('/');
      this.loginFileType = fileType[0];
      this.loginImageUrl = resultData.filePath;
    }
    this.loading = false;
  });
}

  getDomainList(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    this.commonApi.getAllowedDomains(apiFormData).subscribe(response => {
      console.log(response)
      this.loading = false;
      if(response.status == 'Success'){
        this.configData = [];
        this.configData = response.items;
        console.log(this.configData);
      }
    });
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




  UpdateCheckBox(){
    let flag = this.landingBannerFit ? '1' : '0';
    /*const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('businessProfile', '10');
    apiFormData.append('bannerOptionFlag', flag);
    let serverUrl = this.apiUrl.apifileUpload();    
    this.httpClient.post<any>(serverUrl, apiFormData).subscribe(res => { });*/
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

    /*apiData.append('deleteMediaId', JSON.stringify(this.deletedFileIds));
    apiData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
    apiData.append('deletedFileIds',  JSON.stringify(this.deletedFileIds));
    apiData.append('removeFileIds',  JSON.stringify(this.removeFileIds));*/ 

    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0) {
      this.editPostUpload = false;            
      this.postEditApiData['uploadedItems'] = this.uploadedItems.items;
      this.postEditApiData['attachments'] = this.uploadedItems.attachments;
      this.postEditApiData['message'] = "Upload Successfully";
      this.postEditApiData['fromWelcomeMessage'] = '1';                        
      this.postEditApiData['dataId'] = "";                        
      this.manageAction = 'uploading';
      this.postEditApiData['threadAction'] = 'new';            
      setTimeout(() => {              
        this.editPostUpload = true;
      }, 100);
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
  
    if(this.updatedAttachments.length>0){}
    else{      

    }
  }

  

  
}




