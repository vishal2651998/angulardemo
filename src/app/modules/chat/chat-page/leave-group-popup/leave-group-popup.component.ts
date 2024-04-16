import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatType, Constant, SendPushType } from 'src/app/common/constant/constant';
import { LandingLeftSideMenuComponent } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { MemberToGroup, PostNotification } from 'src/app/models/chatmodel';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-leave-group-popup',
  templateUrl: './leave-group-popup.component.html',
  styleUrls: ['./leave-group-popup.component.scss']
})
export class LeaveGroupPopupComponent implements OnInit {
  @Input() chatgroupid: string;
  @Input() userid: string;
  @Input() groupname: string;
  public countryId;
  public user: any;
  domainId: string;
  limit: string = "20";
  offset: number = 0;
  selectedUsers: string = "1";
  userId: string;
  pagenumber: number = 1;
  @Input() leftmenucomponent : LandingLeftSideMenuComponent;
  @Output() ReloadDefaultChat = new EventEmitter<any>();
  constructor(private chatService: ChatService,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    this.offset = 0;
    this.pagenumber = 1;
   // this.userTotalCount = (this.isActiveUser == "1") ? Number(this.totalActiveUserCount) : Number(this.totalUserCount);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
  }
  OpenLeaveGroupConfirmationPopup(){
    let model_group = document.getElementById("LeveGroupConfrimation");
    model_group.classList.add('modal-fade')
  }
  CloseLeaveGroupConfirmationPopup(){
    let model_group = document.getElementById("LeveGroupConfrimation");
    model_group.classList.remove('modal-fade')
  }

  LeaveGroup(){
  let alldomainusers :MemberToGroup=  this.prepareMemberData(ChatType.GroupChat);
      console.log(alldomainusers);
      this.chatService.AddMemeberToGroup(alldomainusers).subscribe(resp=>{
        let chatGroupId = resp.chatGroupId;
       // this.StartNotification(chatGroupId);
        this.ReloadDefaultChat.emit("");
        console.log('added to ');
        console.log(resp);
        this.leftmenucomponent.ReloadGrouAndDMChatMenu("",ChatType.GroupChat);
        this.leftmenucomponent.SelectDefaultWorkstreamChat();

        // let profileImage  =  (chatType = ChatType.GroupChat)? "" : this.newMeberList[0].profileImg;
        // let pushitem : InputChat = { id :chatGroupId,name:displayname,chatType:chatType,profileImg:profileImage};
        // if (chatType = ChatType.DirectMessage){
        //   this.CloseUserPopup();
        // }
        // if (chatType = ChatType.GroupChat){
        //   this.CloseManagGroupPopup();
        // }
        // this.ReloadChatSection.emit(pushitem);
        //this.leftmenucomponent.
        this.CloseLeaveGroupConfirmationPopup();


    });
  }
  prepareMemberData(chatType):MemberToGroup {
    let memberTobeRemovedUserId:any[]=[];
    let memberToGroup : MemberToGroup = new MemberToGroup();
    memberToGroup.apiKey =  Constant.ApiKey;
    memberToGroup.chatGroupId = this.chatgroupid  ;
    memberToGroup.domainId = this.domainId;
    memberToGroup.domainId = this.countryId;
    memberToGroup.chatType = chatType;
    memberToGroup.userId = this.userId;
    memberToGroup.newMembers ="";
    let userid = this.userId;
    memberTobeRemovedUserId.push(this.userId) ;
    memberToGroup.removeMembers =JSON.stringify(memberTobeRemovedUserId)
    memberToGroup.groupName = this.groupname;
    return memberToGroup;
  }
  LeaveGroupCancel(){
    this.CloseLeaveGroupConfirmationPopup();
  }
  StartNotification(chatGroupId){
    let removemembers:any[]=[];
    removemembers.push(this.user);
    let notification :PostNotification   = this.preparePushNotification(chatGroupId,SendPushType.RemoveUser,[],removemembers,"","",null);
    this.chatService.AddPostNotification(notification).subscribe((resp)=>{
      console.log('Post Notification  Response');
      console.log(resp);
      });
   }
   preparePushNotification(chatgroupid:string,sendPushType:SendPushType,newMemberList:any[],removememberlist:any[],newGroupName,OldGroupName,filetoupload){
    let memberUserId:any[]=[];
    let removememberId:any[]=[];
    //let sendPushType : SendPushType = SendPushType.GroupManage;
    let postNotification  : PostNotification = new PostNotification();
    postNotification.apiKey =  Constant.ApiKey;

    postNotification.chatGroupId = chatgroupid  ;

    postNotification.domainId = this.domainId;
    postNotification.domainId = this.countryId;
    postNotification.userId = this.userId;
    postNotification.chatType= ChatType.GroupChat;
    postNotification.dataId = "";
    postNotification.limit = "10";
    postNotification.offset = "0";

    // for (let i =0 ;i < newMemberList.length ;i++ ){
    //   memberUserId.push(newMemberList[i].userId)
    // }

    for (let j =0 ;j < removememberlist.length ;j++ ){
      removememberId.push(removememberlist[j].Userid);
    }
    if (memberUserId.length > 0)
    {
      postNotification.notifyUsers =JSON.stringify(memberUserId);
    }
    if (removememberId.length > 0)
    {
      postNotification.notifyUsers =JSON.stringify(removememberId);
    }
    postNotification.param = "groupmessage";
    postNotification.sendpush = sendPushType;
    postNotification.groupName = newGroupName;
    postNotification.oldGroupName = OldGroupName;
    if (filetoupload!=null && filetoupload!=undefined)
    {
      postNotification.file = filetoupload;
    }
    return postNotification;
   }
}
