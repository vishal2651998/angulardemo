import { Component, EventEmitter, OnInit, Output, ViewChild, HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant, ContentTypeValues, FilterGroups, filterNames, filterFields, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AddLinkComponent } from '../../../../components/common/add-link/add-link.component';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { ApiService } from '../../../../services/api/api.service';
import * as ClassicEditor from "src/build/ckeditor";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public headerData: Object;
  pageAccess: string = "system-settings";
  public headTitle: string = "System Settings";
  public bodyClass: string = "message";
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
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public toggleBox1: boolean = false;
  public toggleBox2: boolean = false;
  public toggleBox3: boolean = false;
  public maximumDate: any = '';
  public miniumDate: any = '';
  public startDate: any = '';
  public endDate: any = ''; 
  public startTime: any = '';
  public endTime: any = '';
  public systemSettingsData: any;
  public menuItemsData: any;
  public systemMsg: Message[];
  public rmHeight: any = 115; 
  public expandFlag: boolean = true;
  public tvsDomain: boolean = false;
  public platformId: string;
  public holidayModal: boolean = false;
  public holidayModalType: string = '';
  public saveServiceEnable: boolean = true;
  public updateEventName: string = '';
  public updateStartDate: any = ''; 
  public updateEndDate: any = ''; 
  public updateMaximumDate: any = '';
  public updateMinimumDate: any = '';
  public updateToggleBox: boolean = false;
  public updateToggle: string = '0';
  public settingsId;
  public typeId;
  public itemId;
  public dataId = 1;
  public timeZoneList: any = [{id: 'IST', name: 'IST'},{id: 'EST', name: 'EST'},{id: 'CST', name: 'CST'},{id: 'MST', name: 'MST'},{id: 'PST', name: 'PST'}]
  public displaySuccessMsg: boolean = true;
  public notesModalFlag: boolean = false;
  public customerNotesFlag: boolean = false;
  public customerNotes: string = '';
  public contentDisplay:any;
  public customerEditor: string = '';
  public Editor = ClassicEditor;
  public notesValid: boolean = false;
  public headText;
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
    placeholder: 'Enter Message',
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
    private apiUrl: ApiService,
    private activteRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private sanitizer: DomSanitizer,
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = 'dialog-centered';
  }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');
    this.tvsDomain = (this.platformId=='2' && this.domainId == '52') ? true : false;
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) { 
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: false
      };

      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.systemSettings();

    }  

  }

  systemSettings(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);    
            
    this.commonApi.getSystemSettings(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
         console.log(res.items);
         let itemsArr = [];
         itemsArr = res.items;
         for(let type in itemsArr){
          itemsArr[type].toggleBox = false;
          for(let type1 in itemsArr[type].settings){            
            let autoSettingsDisableFlag = itemsArr[type].settings[type1].autoSettings == '0' ? true : false;                       
            itemsArr[type].settings[type1].toggleBox = itemsArr[type].settings[type1].autoSettings == '0' ? false : true;
            itemsArr[type].settings[type1].autoSettingsDisableFlag = autoSettingsDisableFlag;            
            for(let type2 in itemsArr[type].settings[type1].items){ 
              
              console.log(itemsArr[type]);
              let descriptionDisplay = itemsArr[type].settings[type1].items[type2].description;
              if(descriptionDisplay != ''){
                let content = '';
                content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(descriptionDisplay));
                itemsArr[type].settings[type1].items[type2].descriptionContent = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(content));
              }

              for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){
                if(itemsArr[type].settings[type1].items[type2].innerItems[type3].inputType == 'datePicker' ||
                itemsArr[type].settings[type1].items[type2].innerItems[type3].inputType == 'datePicker-toggle'){                 
                  let sdate;
                  let edate;
                  if(itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate != '' &&
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate != null &&
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate != undefined &&
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate != "0000-00-00 00:00:00"
                  ){
                    sdate = itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate.trim();
                    sdate = moment(sdate).format('MMM DD, YYYY');
                    sdate = new Date(sdate);
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate = sdate;                    
                  }
                  else{
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate = "";
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validsdate = false;
                  }
                  if(itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate != '' &&
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate != null &&
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate != undefined &&
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate != "0000-00-00 00:00:00"
                  ){
                    edate = itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate.trim();
                    edate = moment(edate).format('MMM DD, YYYY');
                    edate = new Date(edate);
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate = edate;                    
                  }
                  else{
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate = "";
                  }
                  this.miniumDate = sdate == '' ? '' : new Date(sdate);
                  this.maximumDate = edate == '' ? '' : new Date(edate);

                  let flag = itemsArr[type].settings[type1].items[type2].innerItems[type3].value == '0' ? false : true;
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox = flag;
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].validsdate = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate == '' && flag) ? true : false;                  
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].validedate = (itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate == '' && flag) ? true : false;                  
                }
                else if(itemsArr[type].settings[type1].items[type2].innerItems[type3].inputType == 'time-toggle'){ 
                  let flag = itemsArr[type].settings[type1].items[type2].innerItems[type3].day == '0' ? false : true;
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].dayFlag = flag;

                  let flag1 = itemsArr[type].settings[type1].items[type2].innerItems[type3].value == '0' ? false : true;
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox = flag1;

                  itemsArr[type].settings[type1].items[type2].innerItems[type3].startTimeOld = itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime;
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].endTimeOld = itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime; 
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime == '' && itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime == '' && !flag && flag1) ? true : false;                  
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime == '' && !flag && flag1) ? true : false;                  
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime = (itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime == '' && !flag && flag1) ? true : false; 

                }
                else{
                  let flag = itemsArr[type].settings[type1].items[type2].innerItems[type3].value == '0' ? false : true;
                  itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox = flag;
                }  
              }
            }
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

  applySearch(data) {
    let val = data.searchVal;
    console.log(val);
  }
  validationCheck(type,inputType,settingsId,itemId,dataId,flag,eventtype){
    console.log(type,inputType,settingsId,itemId,dataId,flag,eventtype);
    
    this.settingsId = settingsId;
    this.typeId = type;
    this.itemId = itemId;
    this.dataId = dataId;
    
    let itemsArr = [];
    itemsArr = this.systemSettingsData;
    for(let type in itemsArr){      
      if(this.settingsId == itemsArr[type].settingsId){
        console.log(itemsArr[type].settingsId);
        for(let type1 in itemsArr[type].settings){         
          for(let type2 in itemsArr[type].settings[type1].items){            
            if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
              console.log(itemsArr[type].settings[type1].items[type2].type)              
              for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){                
                if(this.dataId == itemsArr[type].settings[type1].items[type2].innerItems[type3].datId){
                 if(itemsArr[type].settings[type1].items[type2].innerItems[type3].inputType == 'datePicker-toggle' && eventtype == 'datePicker-toggle'){  
                  let flagValue = flag ? true : false;
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validsdate = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate == '' && flagValue) ? true : false;                  
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validedate = (itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate == '' && flagValue) ? true : false; 
                    if(itemsArr[type].settings[type1].items[type2].innerItems[type3].validsdate ||
                      itemsArr[type].settings[type1].items[type2].innerItems[type3].validedate
                      ){
                        return false;
                      }               
                  }
                  if(itemsArr[type].settings[type1].items[type2].innerItems[type3].inputType == 'time-toggle' && eventtype == 'time-toggle'){ 
                    let flagValue;
                    let flagday;
                    if(inputType == 'toggle'){
                      flagValue = flag ? true : false;
                      flagday = itemsArr[type].settings[type1].items[type2].innerItems[type3].dayFlag;
                    }
                    if(inputType == 'checkbox'){
                      flagValue = itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox;
                      flagday  = flag ? true : false;
                    }  
                    if(inputType == 'startdate'){    
                    }             
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime == '' && itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime == '' && !flagday && flagValue) ? true : false;                  
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime == '' && !flagday && flagValue) ? true : false;                  
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime = (itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime == '' && !flagday && flagValue) ? true : false;  
                    
                    if(itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid ||
                      itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime ||
                      itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime
                      ){
                        //return false;
                      }

                      if(itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid &&
                        itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime &&
                        itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime
                        ){
                          this.displaySuccessMsg = false;
                        }
                    
                  }               
                }                  
              }              
            }
          }          
        }
      }
    }
    this.systemSettingsData = itemsArr;
    console.log(this.systemSettingsData);

    this.onToggleBoxChange(type,inputType,settingsId,itemId,dataId,flag);
  }

  onToggleBoxChange(type,inputType,settingsId,itemId,dataId,flag,msg='',msgFlag=false){
    console.log(type,inputType,settingsId,itemId,dataId,msg,msgFlag);

    let flagValue = flag ? '1' : '0';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('type', type);    
    apiFormData.append('itemId', itemId);    
    apiFormData.append('dataId', dataId);    
    apiFormData.append('settingsId', settingsId);      
    if(msgFlag){
      apiFormData.append('content', msg);
    }

    if(this.tvsDomain){
      switch(inputType){
        case 'startDate':
          let stDate = this.startDate;
          stDate = moment(stDate).format('YYYY-MM-DD');
          apiFormData.append('startDate', stDate); 
          apiFormData.append('action', "datePicker");
        break;
        case 'endDate':
          let edDate = this.endDate;
          edDate = moment(edDate).format('YYYY-MM-DD');
          apiFormData.append('endDate', edDate);
          apiFormData.append('action', "time");
        break;
        case 'startTime':
          apiFormData.append('startTime', this.startTime); 
          apiFormData.append('action', "time");
        break;
        case 'endTime':
          apiFormData.append('endTime', this.endTime);
          apiFormData.append('action', "time");
        break;
        case 'checkbox':
          apiFormData.append('day', flagValue); 
          apiFormData.append('action', "checkbox");
        break;
        case 'toggle':
          apiFormData.append('value', flagValue); 
          apiFormData.append('action', "toggle");
        break;
        case 'timeZone':
          apiFormData.append('timeZone', flag); 
          apiFormData.append('action', "timeZone");
        break;
        case 'holiday-event-new':
          apiFormData.append('action', "new");
          apiFormData.append('eventName', this.updateEventName);
          apiFormData.append('value', this.updateToggle);
          this.updateStartDate = moment(this.updateStartDate).format('YYYY-MM-DD');
          this.updateEndDate = moment(this.updateEndDate).format('YYYY-MM-DD');
          apiFormData.append('startDate', this.updateStartDate); 
          apiFormData.append('endDate', this.updateEndDate);
        break;
        case 'holiday-event-edit':
          apiFormData.append('action', "edit");
          apiFormData.append('eventName', this.updateEventName);
          apiFormData.append('value', this.updateToggle);
          this.updateStartDate = moment(this.updateStartDate).format('YYYY-MM-DD');
          this.updateEndDate = moment(this.updateEndDate).format('YYYY-MM-DD');
          apiFormData.append('startDate', this.updateStartDate); 
          apiFormData.append('endDate', this.updateEndDate);
        break;
        case 'holiday-event-delete':
          apiFormData.append('action', "delete");
        break;
      }
    }
    else{
      if(inputType != 'toggle'){
        apiFormData.append('value', '0'); 
        let startDateVal = this.startDate;
        let endDateVal = this.endDate
        apiFormData.append('startDate', startDateVal); 
        apiFormData.append('endDate', endDateVal);
      }
      if(inputType == 'toggle'){
        apiFormData.append('value', flagValue); 
      } 
    }
          
    //new Response(apiFormData).text().then(console.log);
    //return false;
       
    this.commonApi.updateSystemSettings(apiFormData).subscribe(res => {
      if(res.status=='Success'){
        if(this.displaySuccessMsg){
          this.systemMsg = [{severity:'success', summary:'', detail:res.result}];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.systemMsg = [];
          }, 3000);
        }
        //setTimeout(() => {
          this.displaySuccessMsg = true;
        //}, 100);
        console.log(res);
        if(msgFlag){
          if(this.tvsDomain){
            let itemsArr = [];
            itemsArr = this.systemSettingsData;
            for(let type in itemsArr){      
              if(this.settingsId == itemsArr[type].settingsId){
                console.log(itemsArr[type].settingsId);
                for(let type1 in itemsArr[type].settings){         
                  for(let type2 in itemsArr[type].settings[type1].items){            
                    if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                      console.log(itemsArr[type].settings[type1].items[type2].description);                    
                      itemsArr[type].settings[type1].items[type2].description = msg;
                      let descriptionDisplay = msg;
                      if(descriptionDisplay != ''){
                        let content = '';
                        content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(descriptionDisplay));
                        itemsArr[type].settings[type1].items[type2].descriptionContent = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(content));
                      }

                    }
                  }
                }
              }
            }
            this.systemSettingsData = itemsArr;
          }
          else{
            for(let type in this.systemSettingsData){
              this.systemSettingsData[type].toggleBox = false;
              for(let type1 in this.systemSettingsData[type].settings){                       
                for(let type2 in this.systemSettingsData[type].settings[type1].items){                       
                  this.systemSettingsData[type].settings[type1].items[type2].description = msg;
                  let descriptionDisplay = msg;
                  if(descriptionDisplay != ''){
                    let content = '';
                    content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(descriptionDisplay));
                    this.systemSettingsData[type].settings[type1].items[type2].descriptionContent = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(content));
                  }
                }
              }
            }
          }
          
          let itemsArr = [];
          itemsArr = this.systemSettingsData;
          for(let type in itemsArr){      
            if(this.settingsId == itemsArr[type].settingsId){
              console.log(itemsArr[type].settingsId);
              for(let type1 in itemsArr[type].settings){         
                for(let type2 in itemsArr[type].settings[type1].items){            
                  if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                    console.log(itemsArr[type].settings[type1].items[type2].description);                    
                    itemsArr[type].settings[type1].items[type2].description = msg;
                  }
                }
              }
            }
          }
          this.systemSettingsData = itemsArr;
        }
        if(type == '0'){
          let autoSettingsDisableFlag;
          autoSettingsDisableFlag = flagValue == '0' ? true : false;
          for(let type in this.systemSettingsData){
            this.systemSettingsData[type].toggleBox = false;
            for(let type1 in this.systemSettingsData[type].settings){                       
              this.systemSettingsData[type].settings[type1].autoSettingsDisableFlag = autoSettingsDisableFlag;
            }
          }
        }
        if(inputType == 'startTime' || inputType == 'endTime'){  
          let itemsArr = [];
          itemsArr = this.systemSettingsData;
          for(let type in itemsArr){      
            if(this.settingsId == itemsArr[type].settingsId){
              console.log(itemsArr[type].settingsId);
              for(let type1 in itemsArr[type].settings){         
                for(let type2 in itemsArr[type].settings[type1].items){            
                  if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                    console.log(itemsArr[type].settings[type1].items[type2].type)                     
                      for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){                        
                        if(this.dataId == itemsArr[type].settings[type1].items[type2].innerItems[type3].datId){ 
                          if(inputType == 'startTime'){
                            itemsArr[type].settings[type1].items[type2].innerItems[type3].startTimeOld = this.startTime;
                          } 
                          else{
                            itemsArr[type].settings[type1].items[type2].innerItems[type3].endTimeOld = this.endTime;
                          }                          
                        }
                      }
                  }
                }
              }
            }
          }
          this.systemSettingsData = itemsArr;
        }
        if(inputType == 'holiday-event-new' || inputType == 'holiday-event-edit'){   
          this.holidayModal = false;    
           console.log(res.items[0].datId);
           let sdate,edate;
           sdate = this.updateStartDate;
           sdate = moment(sdate).format('MMM DD, YYYY');
           sdate = new Date(sdate);
         
           edate = this.updateEndDate;
           edate = moment(edate).format('MMM DD, YYYY');
           edate = new Date(edate);

          let newArr = {
            "datId": res.items[0].datId,
            "inputType": "datePicker-toggle",
            "imageClass": "datepicker-icon-green",
            "title": this.updateEventName,
            "value": this.updateToggle,
            "toggleBox" :this.updateToggle == '1' ? true : false,
            "startDate": sdate,
            "endDate": edate,
            "startTime": "",
            "endtime": "",
            "day":"0",
            "disabled": false
          };
      
          console.log(newArr);
      
          let itemsArr = [];
          itemsArr = this.systemSettingsData;
          for(let type in itemsArr){      
            if(this.settingsId == itemsArr[type].settingsId){
              console.log(itemsArr[type].settingsId);
              for(let type1 in itemsArr[type].settings){         
                for(let type2 in itemsArr[type].settings[type1].items){            
                  if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                    console.log(itemsArr[type].settings[type1].items[type2].type) 
                    if(inputType == 'holiday-event-new'){
                      itemsArr[type].settings[type1].items[type2].innerItems.push(newArr);
                    }
                    else{
                      for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){
                        
                        if(this.dataId == itemsArr[type].settings[type1].items[type2].innerItems[type3].datId){  
                          itemsArr[type].settings[type1].items[type2].innerItems[type3].title = this.updateEventName;
                          itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate = sdate;                           
                          itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate = edate; 
                          itemsArr[type].settings[type1].items[type2].innerItems[type3].value = this.updateToggle;
                          itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox = this.updateToggle == '1' ? true : false;                    
                        }                  
                      }
                    } 
                  }
                }
                
              }
            }
          }
          this.systemSettingsData = itemsArr;
          console.log(this.systemSettingsData);          
        }
        if(inputType == 'holiday-event-delete'){   
          let itemsArr = [];
          itemsArr = this.systemSettingsData;
          for(let type in itemsArr){      
            console.log(itemsArr[type].settingsId);
            if(this.settingsId == itemsArr[type].settingsId){
              console.log(itemsArr[type].settingsId);
              for(let type1 in itemsArr[type].settings){         
                for(let type2 in itemsArr[type].settings[type1].items){            
                  if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                    console.log(itemsArr[type].settings[type1].items[type2].type) 
                    let length = itemsArr[type].settings[type1].items[type2].innerItems.length;
                    if(length>0){
                      for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){
                        if(this.dataId == itemsArr[type].settings[type1].items[type2].innerItems[type3].datId){ 
                          itemsArr[type].settings[type1].items[type2].innerItems.splice(type3, 1);
                        }
                      }                
                    }
                  }
                }
              }
            }
          }
          this.systemSettingsData = itemsArr;
        }

        this.settingsId = '';
        this.typeId = '';
        this.itemId = '';
        this.dataId = 0;
      }
      else{
        if(msgFlag){
          if(this.tvsDomain){
            let itemsArr = [];
            itemsArr = this.systemSettingsData;
            for(let type in itemsArr){      
              if(this.settingsId == itemsArr[type].settingsId){
                console.log(itemsArr[type].settingsId);
                for(let type1 in itemsArr[type].settings){         
                  for(let type2 in itemsArr[type].settings[type1].items){            
                    if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                      console.log(itemsArr[type].settings[type1].items[type2].description);                    
                      itemsArr[type].settings[type1].items[type2].description = msg;
                    }
                  }
                }
              }
            }
            this.systemSettingsData = itemsArr;
          }
          else{
            for(let type in this.systemSettingsData){
              this.systemSettingsData[type].toggleBox = false;
              for(let type1 in this.systemSettingsData[type].settings){                       
                for(let type2 in this.systemSettingsData[type].settings[type1].items){                       
                  this.systemSettingsData[type].settings[type1].items[type2].description = msg;
                }
              }
            }
          }
          
          let itemsArr = [];
          itemsArr = this.systemSettingsData;
          for(let type in itemsArr){      
            if(this.settingsId == itemsArr[type].settingsId){
              console.log(itemsArr[type].settingsId);
              for(let type1 in itemsArr[type].settings){         
                for(let type2 in itemsArr[type].settings[type1].items){            
                  if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                    console.log(itemsArr[type].settings[type1].items[type2].description);                    
                    itemsArr[type].settings[type1].items[type2].description = msg;
                  }
                }
              }
            }
          }
          this.systemSettingsData = itemsArr;
        }
      }        
      },
      (error => {})
      );


  }

  onChangeDate(event,eventtype,type,index,settingsId,itemId,dataId,flag){
    console.log(event);
    let val = moment(event).format('YYYY-MM-DD');
    console.log(val);
    let dhangeType='';
   if (eventtype == 'start') {
      this.startDate = val;
      this.miniumDate = new Date(this.startDate);
      dhangeType = this.tvsDomain ? 'startDate' : 'dataPicker';
    }
    else{
      this.endDate = val;
      this.maximumDate = new Date(this.endDate);
      dhangeType = this.tvsDomain ? 'endDate' : 'dataPicker';
    } 
    this.onToggleBoxChange(type,dhangeType,settingsId,itemId,dataId,flag);
  }
  onChangeTime(event,ctime,eventtype,type,index,settingsId,itemId,dataId,flag,timeflag){

    if(timeflag == '1'){
      event = moment(event).format('hh:mm A');
      this.displaySuccessMsg = false;
    }
    let cheventtype = '';
    if(event == ctime){
      this.displaySuccessMsg = false;
    }
    event = event;
    console.log(event,ctime,eventtype,type,index,settingsId,itemId,dataId,flag);
    //return false;
    if (eventtype == 'start') {
      this.startTime = event;
      cheventtype = 'startTime';
      
    }
    else{
      this.endTime = event;
      cheventtype = 'endTime';
    }      

    this.settingsId = settingsId;
    this.typeId = type;
    this.itemId = itemId;
    this.dataId = dataId;
    
    let itemsArr = [];
    itemsArr = this.systemSettingsData;
    for(let type in itemsArr){      
      if(this.settingsId == itemsArr[type].settingsId){
        //console.log(itemsArr[type].settingsId);
        for(let type1 in itemsArr[type].settings){         
          for(let type2 in itemsArr[type].settings[type1].items){            
            if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
              //console.log(itemsArr[type].settings[type1].items[type2].type)              
              for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){                
                if(this.dataId == itemsArr[type].settings[type1].items[type2].innerItems[type3].datId){
                  
                  if(itemsArr[type].settings[type1].items[type2].innerItems[type3].inputType == 'time-toggle'){ 
                    let flagValue;
                    let flagday;
                    flagday = itemsArr[type].settings[type1].items[type2].innerItems[type3].dayFlag;
                    flagValue = itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox;                                 
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime == '' && itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime == '' && !flagday && flagValue) ? true : false;                  
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime = (itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime == '' && !flagday && flagValue) ? true : false;                  
                    itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime = (itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime == '' && !flagday && flagValue) ? true : false;  
                    
                    if(itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid ||
                      itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime ||
                      itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime
                      ){
                        //return false;
                      }

                      if(itemsArr[type].settings[type1].items[type2].innerItems[type3].chekboxvalid &&
                        itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime &&
                        itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime
                        ){
                          this.displaySuccessMsg = false;
                        }

                        let _starttime:any;
                        let _endtime:any;

                        if(cheventtype == 'startTime' && !itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime){
                          
                          let sval1 = moment(this.startTime).format('hh:mm A');
                          if(sval1  == 'Invalid date'){
                            _starttime = this.startTime;
                          }
                          else{
                            _starttime = moment(this.startTime).format('hh:mm A');
                          }                           
                          
                          let eval1 = moment(itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime).format('hh:mm A');
                          if(eval1  == 'Invalid date'){
                            _endtime = itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime
                          }
                          else{
                            _endtime = moment(itemsArr[type].settings[type1].items[type2].innerItems[type3].endTime).format('hh:mm A');
                          }

            
                        }
                        if(cheventtype == 'endTime' && !itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime){
                          
                                                    
                          let sval2 = moment(itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime).format('hh:mm A');
                          if(sval2  == 'Invalid date'){
                            _starttime = itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime;
                          }
                          else{
                            _starttime = moment(itemsArr[type].settings[type1].items[type2].innerItems[type3].startTime).format('hh:mm A');
                          } 
                          let eval2 = moment(this.endTime).format('hh:mm A');
                          if(eval2  == 'Invalid date'){
                            _endtime = this.endTime;
                          }
                          else{
                            _endtime = moment(this.endTime).format('hh:mm A');
                          } 
                                
                        }

                        console.log(_starttime);      
                        console.log(_endtime);
                        
                        if(!itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime && 
                          !itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime ){

                        //divide AM/PM from time
                        let _split_starttime = _starttime.split(" ");
                        let _split_endtime = _endtime.split(" ");
                  
                        //check if start time is bigger than end time
                        let _start_timenumber = _split_starttime[0].split(":");
                        let _end_timenumber = _split_endtime[0].split(":");
                
                        //start time hour & minute
                        let _start_hour = parseInt(_start_timenumber[0]); 
                        let _start_min = parseInt(_start_timenumber[1]); 
                
                        //end time hour & minute
                        let _end_hour = parseInt(_end_timenumber[0]); 
                        let _end_min = parseInt(_end_timenumber[1]); 
                
                        //get hour duration
                        let _hour_format = 0;
                        if (_split_endtime[1] == "PM" && _split_starttime[1] == "AM") {
                          if(_end_hour == 12){
                            _end_hour = 0;
                          }
                          _hour_format = _end_hour + 12;
                        }
                        else{
                          _hour_format = _end_hour;
                        }
                        //calculate hours
                        let _duration_hour = _hour_format - _start_hour;
                
                        //calculate minutes
                        let _remained_min = _end_min - _start_min;
                        
                        console.log(_duration_hour);
                        console.log(_remained_min);

                        if(_duration_hour<0 || ( _duration_hour== 0 && _remained_min<0)){
                          if(cheventtype == 'startTime'){
                            itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime = false;
                            itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime = true;
                            return false;
                          }
                          if(cheventtype == 'endTime'){
                            itemsArr[type].settings[type1].items[type2].innerItems[type3].validetime = false;
                            itemsArr[type].settings[type1].items[type2].innerItems[type3].validstime = true;
                            return false;
                          }
                        }
                    }
                                              
                  }               
                }                  
              }              
            }
          }          
        }
      }
    }
    this.systemSettingsData = itemsArr;
    console.log(this.systemSettingsData);

    this.onToggleBoxChange(type,cheventtype,settingsId,itemId,dataId,flag); 
      
  }

  saveService(){
    if(!this.saveServiceEnable){
    let eventName = ''; 
    if(this.dataId>0){
      eventName = 'holiday-event-edit';
    }
    else{
      eventName = 'holiday-event-new';
    }
    this.holidayModal = false;
    
    console.log(this.typeId,eventName,this.settingsId,this.itemId,this.dataId,false);
    this.onToggleBoxChange(this.typeId,eventName,this.settingsId,this.itemId,this.dataId,false);
  }

  }

  deleteHoliday(settingsId,itemId,typeId,dataId){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.title = "Delete Holiday";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        let eventName = 'holiday-event-delete';
        this.settingsId = settingsId;
        this.typeId = typeId;
        this.itemId = itemId; 
        this.dataId = dataId;
        this.onToggleBoxChange(typeId,eventName,settingsId,itemId,dataId,false);
      }
    });    
  }

  updateHoliday(type,settingsId,itemId,typeId,dataId){

    console.log(type,settingsId,itemId,typeId,dataId);
    this.holidayModal = true;
    this.holidayModalType = type;

    this.settingsId = settingsId;
    this.typeId = typeId;
    this.itemId = itemId; 
    
    if(type == 'Add'){
      this.updateEventName = '';
      this.updateStartDate = '';
      this.updateMinimumDate = '';
      this.updateEndDate = '';
      this.updateMaximumDate = '';
      this.updateToggle = '0';
      this.updateToggleBox = false
      this.saveServiceEnable = true;
      this.dataId = 0;
    }
    else{
      this.dataId = dataId;
      let itemsArr = [];
      itemsArr = this.systemSettingsData;
      for(let type in itemsArr){      
        console.log(this.settingsId,itemsArr[type].settingsId);
        if(this.settingsId == itemsArr[type].settingsId){
          console.log(itemsArr[type].settingsId);
          for(let type1 in itemsArr[type].settings){  
            for(let type2 in itemsArr[type].settings[type1].items){            
              if(this.typeId == itemsArr[type].settings[type1].items[type2].type){ 
                console.log(itemsArr[type].settings[type1].items[type2].type) 
                let length = itemsArr[type].settings[type1].items[type2].innerItems.length;
                if(length>0){                 
                  for(let type3 in itemsArr[type].settings[type1].items[type2].innerItems){
                    if(this.dataId == itemsArr[type].settings[type1].items[type2].innerItems[type3].datId){ 
                      this.updateEventName = itemsArr[type].settings[type1].items[type2].innerItems[type3].title;
                      this.updateStartDate = itemsArr[type].settings[type1].items[type2].innerItems[type3].startDate;
                      this.updateMinimumDate = new Date(this.updateStartDate);
                      this.updateEndDate = itemsArr[type].settings[type1].items[type2].innerItems[type3].endDate;
                      this.updateMaximumDate = new Date(this.updateEndDate);
                      this.updateToggle = itemsArr[type].settings[type1].items[type2].innerItems[type3].value;
                      this.updateToggleBox = itemsArr[type].settings[type1].items[type2].innerItems[type3].toggleBox;   
                    }
                  }
                }
              }
            }
          }
        }
      }
              
    }

  }

  onUpdate(event,eventtype){
    let val = event; 
    console.log(event)
    console.log(eventtype)
    if(eventtype == 'start'){
      this.updateStartDate = val;
      val = moment(val).format('YYYY-MM-DD');
      this.updateMinimumDate = new Date(val);
    }
    else if(eventtype == 'end'){    
      this.updateEndDate = val;  
      val = moment(val).format('YYYY-MM-DD');      
      this.updateMaximumDate = new Date(val);
    }
    else if(eventtype == 'toggle'){
      let flagValue = val ? '1' : '0';
      this.updateToggle = flagValue;
    }
    else{
      this.updateEventName = val;
    }

    console.log(this.updateStartDate)
    console.log(this.updateEndDate)

    if(this.updateEventName!='' && this.updateStartDate != '' && this.updateStartDate != undefined && this.updateEndDate !='' && this.updateEndDate != undefined ){
      this.saveServiceEnable = false;
    }
    else{
      this.saveServiceEnable = true;
    }

  }

  // UpdateContent
  UpdateContent(editStr,editContent,type,index,settingsId,itemId,dataId,flag){ 
     
    const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.reminderPOPUP = "kaizen-notes";
    modalRef.componentInstance.specialText = "Message";
    modalRef.componentInstance.titleTest = "Message";
    modalRef.componentInstance.actionText = editStr;
    modalRef.componentInstance.contentText = editContent;
    modalRef.componentInstance.resServices.subscribe((receivedService) => {      
      if(receivedService){  
        modalRef.dismiss('Cross click');  
        console.log(receivedService); 
        let msg = receivedService;
        let msgFlag = true;
        //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        //msgModalRef.componentInstance.successMessage = receivedService.result;

        this.settingsId = settingsId;
        this.typeId = type;
        this.itemId = itemId; 
        this.dataId = dataId;
        this.onToggleBoxChange(type,index,settingsId,itemId,dataId,flag,msg,msgFlag);
        /*setTimeout(() => {  
          msgModalRef.dismiss('Cross click');   
        }, 500); */   
      }
    });    
  }
  
  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight-109;
    this.rmHeight = 115;
    this.rmHeight = this.rmHeight;
  }

  updateNotes(editStr,editContent,type,index,settingsId,itemId,dataId,flag){
    
    if(editStr == 'new'){
      this.customerNotes = '';
      this.headText = 'New Message';
    }  
    else{
      this.headText = 'Edit Message';
    } 
    this.customerNotes = editContent;
    this.customerEditor = this.customerNotes;
    this.notesModalFlag = true;

    this.settingsId = settingsId;
    this.typeId = type;
    this.itemId = itemId; 
    this.dataId = dataId;

  }

  changeNotes(event){
    this.notesValid = this.customerEditor == '' ? true : false;  
  }

  saveNotes(){
    if(!this.notesValid){
      let msg = this.customerEditor;
      let msgFlag = true;
      this.onToggleBoxChange(this.typeId,0,this.settingsId,this.itemId,this.dataId,'0',msg,msgFlag);    
      this.notesModalFlag = false;       
    }
  }


}
