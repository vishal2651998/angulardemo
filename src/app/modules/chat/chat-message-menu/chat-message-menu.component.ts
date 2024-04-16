import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatType, Constant, forumPageAccess, LocalStorageItem, MessageUserType, windowHeight } from 'src/app/common/constant/constant';
import { InputChat, LandingLeftSideMenuComponent } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { MemberToGroup } from 'src/app/models/chatmodel';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ManageUserComponent } from 'src/app/components/common/manage-user/manage-user.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
  selector: 'app-chat-message-menu',
  templateUrl: './chat-message-menu.component.html',
  styleUrls: ['./chat-message-menu.component.scss']
})
export class ChatMessageMenuComponent implements OnInit {
  chatuserTypeSelf = MessageUserType.self;
  chatuserTypeOther = MessageUserType.other;
  chatTypeDMChat = ChatType.DirectMessage;
  @Output() ReloadChatSection = new EventEmitter<any>();
  @Input() leftmenucomponent : LandingLeftSideMenuComponent;
  @Input() chatType: string;
  public user: any;
  domainId: string;
  countryId: string;
  userId:string;
  public translateLanguage: boolean = false;
  public translatelangArray = [];
  public translatelangId: string = '';
  public platformId: string;
  public TVSDomain: boolean = false;
  public transText = "Translate";
  public transId: string = '';
  public detectContentLang:boolean=false;
  public translateProcess:boolean=false;
  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService, 
    private modalService: NgbModal,
    private commonApi: CommonService,
  ) { }
  @Input() chatmessage : any;
  @Input() messageUserType : string;
  @Output() deleteMessage =  new EventEmitter<any>();
  @Output() replyMessage =  new EventEmitter<any>();
  @Output() chatReplaceMessage =  new EventEmitter<any>();  
  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.TVSDomain = (this.platformId=='2' && this.domainId == '52') ? true : false; 
    this.translateLanguage = this.TVSDomain ? true : false;    
  }
  OpenUserProfile(userid)
  {
    var aurl=forumPageAccess.profilePage+userid;
    window.open(aurl, '_blank');
  }

  DeleteChatMessage(id)
  {
    this.deleteMessage.emit(id);
  }
  ReplyChatMessage(message)
  {
    this.replyMessage.emit(message);
  }
  GroupName:string ;
  startNewChat(user){
    console.log('startNewChat');
    console.log(user);
    this.GroupName = "" ;
    this.SaveMembersToGroup(user);
  }
  SaveMembersToGroup(user){
    this.GroupName = "";    
    let alldomainusers :MemberToGroup=  this.prepareMemberData(user);
    console.log(alldomainusers);
    this.chatService.AddMemeberToGroup(alldomainusers).subscribe(resp=>{ 
     
      console.log('added to ');
      console.log(resp);
     
      let chatGroupId = resp.chatGroupId;  
      this.leftmenucomponent.ReloadGrouAndDMChatMenu(chatGroupId,ChatType.DirectMessage);
      let displayname  =  user.userName;
      let profileImage  =  user.profileImg;
      let pushitem : InputChat = { id :chatGroupId,name:displayname,chatType:ChatType.DirectMessage,profileImg:profileImage,contentType:{}};
      this.ClearChatSessionforRedirect();
      this.ReloadChatSection.emit(pushitem);
  }); 
  }
  prepareMemberData(user):MemberToGroup {
    let memberUserId:any[]=[];
    let removememberId:any[]=[];
    let memberToGroup : MemberToGroup = new MemberToGroup();
    memberToGroup.apiKey =  Constant.ApiKey;
    memberToGroup.chatGroupId ="0" ;     
    memberToGroup.domainId = this.domainId; 
    memberToGroup.countryId = this.countryId;       
    memberToGroup.chatType = ChatType.DirectMessage;    
    memberToGroup.userId = this.userId;
    memberUserId.push(user.userId);
   
    if(memberUserId.indexOf(this.userId)== -1) {
      memberUserId.push(this.userId) ;  
    }  
    memberToGroup.newMembers =(memberUserId.length > 0)? JSON.stringify(memberUserId):"";    
    memberToGroup.removeMembers =(removememberId.length > 0)? JSON.stringify(removememberId):"";  
    memberToGroup.groupName = this.GroupName;
    
    
    return memberToGroup;
  }
  ClearChatSessionforRedirect(){
    localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
    localStorage.removeItem(LocalStorageItem.reloadChatType);
  }
  isReplyMessageExist(chat):boolean{
    // some code where value of x changes and than you want to check whether it is null or some object with values
    if (chat != null && chat!=undefined && chat.originalMessage !=null && chat.originalMessage !=undefined)
    {
      let om = chat.originalMessage;
      if(Object.keys(om).length){
        return true; 
        }
    }      
    return false;
  }

  taponDescription(selectLanguage,settype)
  {    
    let content = this.chatmessage.contentOriginal;    
    if(content=='')
    {

     let fileCaption = this.chatmessage.fileCaption;  
     if(fileCaption)
     {
      content=fileCaption;
    
     }
    }
    this.detectContentLang=false;
    this.translateProcess=false;
    //let selectLanguage='ta';
    let initLang='en';
    if(!this.detectContentLang)
    {    
    this.commonApi.DetectlangData(content).subscribe(res => {
      console.log(res.data.detections[0][0].language);

      let sourceLang=res.data.detections[0][0].language;

      if(sourceLang==initLang)
      {
        sourceLang=selectLanguage;
        initLang='';
      }
      
        let contentData=
        {
      sourceLanguage:sourceLang,
      contentQuery:content,
      initLanguage:initLang
      //targetLang:'ta'
        };
        
        this.replacewithPostContent(contentData,sourceLang,selectLanguage,settype);
            

    });

  }
  else
  {

  }

  }

  public replacewithPostContent(contentData,sourceLang,selectLanguage,settype)
  {
    if(this.translateProcess)
    {
      return true;

    }
    else
    {
     
    this.commonApi.fetchlangData(contentData).subscribe(res => {
    
      console.log(res);
     let translatedText= res.data.translations[0].translatedText;
      if(translatedText)
      {
        if(sourceLang==selectLanguage || this.detectContentLang)
        {
          if(translatedText && translatedText!='undefined')
          {           
            
            let chatData = {
              id: this.chatmessage.id,
              message: translatedText,
              fileCaption: translatedText,
              contentOriginal: this.chatmessage.contentOriginal,
              captionOriginal: this.chatmessage.captionOriginal,
              
              transText: this.transText,             
              settype: settype
            }
            this.chatReplaceMessage.emit(chatData);
            
            
          }
         
          this.translateProcess=true;

          return true;
        }
        else
        {
          this.detectContentLang=true;
          let contentData=
          {
        sourceLanguage:selectLanguage,
        contentQuery:translatedText,
        initLanguage:sourceLang
        //targetLang:'ta'
          };
          this.replacewithPostContent(contentData,sourceLang,selectLanguage,settype);


        }
        
      }
      
    
    });
  }
  }

  changeTranslateLanguage(type){   
    console.log(this.chatmessage);
    console.log(this.chatmessage.content);
    if(this.chatmessage.content=='')
    {
      if(this.chatmessage.fileName!='')
      {
        this.chatmessage.fileCaption
        
      }
      
    }
    console.log(this.chatmessage.contentOriginal);
    this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];      
    this.translatelangId = this.translatelangArray['id'] == undefined ? '' : this.translatelangArray['id'];     
    setTimeout(() => {  
  
  
      if(type=='settings' || type=='Translate'){    
        let apiData = {
          api_key: Constant.ApiKey,
          user_id: this.userId,
          domain_id: this.domainId,
          countryId: this.countryId
        };
        apiData['translate'] = "1";  
        let users = [];
        this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];      
        this.translatelangId = this.translatelangArray['id'] == undefined ? '' : this.translatelangArray['id'];
        if(this.translatelangId != ''){
          users.push({
            id: this.translatelangArray['id'],
            name: this.translatelangArray['name']
          }); 
        }         
        const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: true, centered: true });
        modalRef.componentInstance.access =  'translate-language';
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.height = windowHeight.height;
        modalRef.componentInstance.action = 'new';
        modalRef.componentInstance.selectedUsers = users;
        modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
          console.log(receivedService);
          if (!receivedService.empty) {
            let langData = [];
            langData = receivedService;          
            this.translatelangArray = langData;  
            localStorage.setItem('translateLanguage',JSON.stringify(this.translatelangArray));        
            this.translatelangId = this.translatelangArray['id']; 
            this.languageSelect(this.translatelangId);            
            let selectLanguage = this.translatelangArray['languageCode'];
            this.transText = "Translate to Original";
            this.taponDescription(selectLanguage,'settings-on'); 
          }
          modalRef.dismiss('Cross click');
        });
      } 
      else if(type=='Translate to Original'){  
        this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];             
        this.transText = "Translate to "+this.translatelangArray['name'];         
        let chatData = {
          id: this.chatmessage.id,
          message: this.chatmessage.contentOriginal,
          contentOriginal: this.chatmessage.contentOriginal,
          captionOriginal: this.chatmessage.captionOriginal,
          fileCaption: this.chatmessage.captionOriginal,

          
          transText: this.transText,          
          settype: "settings-off"
        }           
        this.chatReplaceMessage.emit(chatData);                        
      }
      else{  
        this.translatelangArray = localStorage.getItem('translateLanguage') != null ? JSON.parse(localStorage.getItem('translateLanguage')) : [];        
        let selectLanguage = this.translatelangArray['languageCode'];              
        this.transText = "Translate to Original";        
        this.taponDescription(selectLanguage,'settings-off');
      } 
    

  }, 100);
  }
    // language update
    languageSelect(langId){
      const apiFormData = new FormData();
      let countryId = localStorage.getItem('countryId');
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('countryId', countryId);
      apiFormData.append('update', "1");
      apiFormData.append('userLanguage', langId);
      this.authenticationService.getLanguageList(apiFormData).subscribe(res => { });
    }
}

