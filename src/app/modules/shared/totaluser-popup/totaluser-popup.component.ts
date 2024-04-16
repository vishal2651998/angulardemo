import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DomainUserChat, MemberToGroup, PostNotification } from 'src/app/models/chatmodel';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ChatType, Constant, forumPageAccess, LocalStorageItem, SendPushType } from '../../../common/constant/constant';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { PopupComponent } from '../../chat/chat-page/popup/popup.component';
import { InputChat, LandingLeftSideMenuComponent } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-totaluser-popup',
  templateUrl: './totaluser-popup.component.html',
  styleUrls: ['./totaluser-popup.component.scss']
})
export class TotaluserPopupComponent implements OnInit, OnChanges {
  userlist: any[];
  @Input() isActiveUser: string;
  @Input() chatgroupid: string;
  @Input() chatType: string;
  @Input() workstreamName: string;
  @Input() workstreamImage: string;
  @Input() totalActiveUserCount: string;
  @Input() totalUserCount: string;
  @Input() chatpopupcomponent: PopupComponent;
  @Output() ReloadChatSection = new EventEmitter<any>();
  searchtext: string = "";
  public countryId;
  public user: any;
  domainId: string;
  limit: string = "20";
  offset: number = 0;
  selectedUsers: string = "1";
  userId: string;
  userlistVirtual: any[];
  userTotalCount: number;
  pagenumber: number = 1;
  chatTypeGroup = ChatType.GroupChat;
  totalScrollHeight: number = 700;
  SearchText: string;

  @ViewChild('searchusertext', { static: true }) seatrchInputText: ElementRef;
  @ViewChild('UserListScroll', { static: true }) UserListScroll: ElementRef;
  @ViewChild('closeButton', { static: true }) closeButton: ElementRef;

  @Input() leftmenucomponent: LandingLeftSideMenuComponent;
  constructor(private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnChanges() {


    // this.SearchText="";
    // this.offset = 0;
    // this.pagenumber = 1;
    // this.userTotalCount = (this.isActiveUser == "1") ? Number(this.totalActiveUserCount) : Number(this.totalUserCount);
    // this.user = this.authenticationService.userValue;
    // this.domainId = this.user.domain_id;
    // this.userId = this.user.Userid;
    // this.ResetOrInitsearch();
  }

  ResetOrInitsearch() {
    let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
    this.chatService.getDomainUserlist(domainUsers).subscribe(resp => {
      if (resp.status == "Success") {
        this.userlist = resp.dataInfo;
      }
    },
      (error => {
        console.log(error);
      })
    );
  }

  prepareAllDomainUserList(): DomainUserChat {
    let domainUserChat: DomainUserChat = new DomainUserChat();
    domainUserChat.apiKey = Constant.ApiKey;
    domainUserChat.domainId = this.domainId;
    domainUserChat.countryId = this.countryId;
    domainUserChat.isActiveUser = this.isActiveUser;
    domainUserChat.limit = this.limit
    domainUserChat.offset = (this.offset) ? this.offset.toString() : "0";
    domainUserChat.searchText = this.searchtext;
    domainUserChat.selectedUsers = this.selectedUsers;
    domainUserChat.userId = this.userId;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      domainUserChat.chatGroupId = this.chatgroupid;
      domainUserChat.workstreamId = "0";
    } else {
      domainUserChat.workstreamId = (this.chatgroupid) ? this.chatgroupid.toString() : "1"; this.chatgroupid;
      domainUserChat.chatGroupId = "0";
    }
    return domainUserChat;
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.InitilizeUserInputSearch();
    this.InitializeAndLoadUserDataOnScoll();
  }
  InitilizeUserInputSearch() {
    fromEvent(this.seatrchInputText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 || res.length == 0)

      // Time in milliseconds between key events
      , debounceTime(500)

      // If previous query is diffent from current
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      this.searchtext = text;
      this.offset = 0;
      this.pagenumber = 1;
      let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
      this.chatService.getDomainUserlist(domainUsers).subscribe(resp => {
        if (resp.status == "Success") {
          this.userlist = resp.dataInfo;
        }
      },
        (error => {
          console.log(error);
        })
      );
    });
  }

  isLoadingOnScroll: boolean;
  InitializeAndLoadUserDataOnScoll() {
    fromEvent(this.UserListScroll.nativeElement, 'scroll').pipe(
      map((event: any) => {
        return event;
      })
      , filter(res =>
        ((res.target.scrollTop + res.target.offsetHeight) > (res.target.scrollHeight - 10)) && (this.pagenumber < Math.ceil(this.userTotalCount / Number(this.limit))))
      , debounceTime(300)
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: any) => {
      this.isLoadingOnScroll = true;
      this.offset = this.pagenumber * (Number(this.limit));
      this.pagenumber = this.pagenumber + 1;
      let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
      this.chatService.getDomainUserlist(domainUsers).subscribe(resp => {
        if (resp.status == "Success") {
          this.isLoadingOnScroll = false;
          this.userlist = [...this.userlist, ...resp.dataInfo];
        }
      },
        (error => {
          console.log(error);
        })
      );
    });
  }

  StartNotification(chatGroupId, userid) {
    let removememberId: any[] = [];
    removememberId.push(userid);
    let notification: PostNotification = this.preparePushNotification(chatGroupId, SendPushType.RemoveUser, [], removememberId, "", "", null);
    this.chatService.AddPostNotification(notification).subscribe((resp) => {
      console.log('Post Notification  Response');
      console.log(resp);
    });
  }

  RemoveMemberFromGroup(user) {

    let alldomainusers: MemberToGroup = this.prepareMemberData(ChatType.GroupChat, user.userId);

    console.log(alldomainusers);
    this.chatService.AddMemeberToGroup(alldomainusers).subscribe(resp => {
      console.log('added to ');
      console.log(resp);
      //this.leftmenucomponent.ReloadGrouAndDMChatMenu("",ChatType.GroupChat);
      let chatGroupId = resp.chatGroupId;
      this.StartNotification(chatGroupId, user);
      this.ResetOrInitsearch();
      this.chatpopupcomponent.StartNotification(chatGroupId, ChatType.GroupChat);

      let displayname = this.workstreamName;
      let profileImage = this.workstreamImage;
      let pushitem: InputChat = { id: chatGroupId, name: displayname, chatType: ChatType.GroupChat, profileImg: profileImage, contentType: {} };
      this.ClearChatSessionforRedirect();
      this.ReloadChatSection.emit(pushitem);
      // var aurl='chat-page/'+this.chatgroupid+"/"+ChatType.GroupChat;
      //   this.router.navigate([aurl]);
    });

    // this.chatpopupcomponent.RemoveGroupChat(this.chatgroupid,  user.userName,user);
    //this.userlist = this.userlist.filter(x=>x.userId!=user.userId);

  }
  prepareMemberData(chatType, userid): MemberToGroup {
    let memberUserId: any[] = [];
    let removememberId: any[] = [];
    let memberToGroup: MemberToGroup = new MemberToGroup();
    memberToGroup.apiKey = Constant.ApiKey;
    memberToGroup.chatGroupId = this.chatgroupid;
    memberToGroup.domainId = this.domainId;
    memberToGroup.countryId = this.countryId;
    memberToGroup.chatType = chatType;
    memberToGroup.userId = this.userId;
    // for (let i =0 ;i < this.newMeberList.length ;i++ ){
    //   memberUserId.push(this.newMeberList[i].userId)
    // }
    // if (this.isNewGroup) {
    //    memberUserId.push(this.userId) ;
    // }

    removememberId.push(userid);

    memberToGroup.newMembers = (memberUserId.length > 0) ? JSON.stringify(memberUserId) : "";
    memberToGroup.removeMembers = (removememberId.length > 0) ? JSON.stringify(removememberId) : "";
    memberToGroup.groupName = this.workstreamName;
    return memberToGroup;
  }
  GroupName: string;
  startNewChat(user) {
    console.log('startNewChat');
    console.log(user);
    this.GroupName = "";
    this.SaveMembersToGroup(user);
  }
  SaveMembersToGroup(user) {
    this.GroupName = "";
    //let alldomainusers :MemberToGroup=  this.prepareMemberData(user);
    let memberUserId: any[] = [];
    let removememberId: any[] = [];
    let memberToGroup: MemberToGroup = new MemberToGroup();
    memberToGroup.apiKey = Constant.ApiKey;
    memberToGroup.chatGroupId = "0";
    memberToGroup.domainId = this.domainId;
    memberToGroup.countryId = this.countryId;
    memberToGroup.chatType = ChatType.DirectMessage;
    memberToGroup.userId = this.userId;
    memberUserId.push(user.userId);

    if(memberUserId.indexOf(this.userId) == -1) {
      memberUserId.push(this.userId);
    }
    memberToGroup.newMembers = (memberUserId.length > 0) ? JSON.stringify(memberUserId) : "";
    memberToGroup.removeMembers = (removememberId.length > 0) ? JSON.stringify(removememberId) : "";
    memberToGroup.groupName = this.GroupName;

    console.log(memberToGroup);
    this.chatService.AddMemeberToGroup(memberToGroup).subscribe(resp => {

      console.log('added to ');
      console.log(resp);

      let chatGroupId = resp.chatGroupId;
      this.leftmenucomponent.ReloadGrouAndDMChatMenu(chatGroupId, ChatType.DirectMessage);
      let displayname = user.userName;
      let profileImage = user.profileImg;
      let pushitem: InputChat = { id: chatGroupId, name: displayname, chatType: ChatType.DirectMessage, profileImg: profileImage, contentType: {} };
      this.closeButton.nativeElement.click();
      this.ClearChatSessionforRedirect();
      this.ReloadChatSection.emit(pushitem);
      // var aurl='chat-page/'+chatGroupId+"/"+ChatType.DirectMessage;
      //   this.router.navigate([aurl]);
    });
  }
  OpenUserProfile(userid) {
    var aurl = forumPageAccess.profilePage + userid;
    window.open(aurl, '_blank');
  }
  preparePushNotification(chatgroupid: string, sendPushType: SendPushType, newMemberList: any[], removememberlist: any[], newGroupName, OldGroupName, filetoupload) {
    let memberUserId: any[] = [];
    let removememberId: any[] = [];
    //let sendPushType : SendPushType = SendPushType.GroupManage;
    let postNotification: PostNotification = new PostNotification();
    postNotification.apiKey = Constant.ApiKey;
    if (this.chatType == ChatType.DirectMessage || this.chatType == ChatType.GroupChat) {
      postNotification.chatGroupId = chatgroupid;
    } else {
      postNotification.chatGroupId = "0";
    }
    postNotification.domainId = this.domainId;
    postNotification.countryId = this.countryId;
    postNotification.userId = this.userId;
    postNotification.chatType = this.chatType;
    postNotification.dataId = "";
    postNotification.limit = "10";
    postNotification.offset = "0";

    for (let i = 0; i < newMemberList.length; i++) {
      memberUserId.push(newMemberList[i].userId)
    }

    for (let j = 0; j < removememberlist.length; j++) {
      removememberId.push(removememberlist[j].userId)
    }
    if (memberUserId.length > 0) {
      postNotification.notifyUsers = JSON.stringify(memberUserId);
    }
    if (removememberId.length > 0) {
      postNotification.notifyUsers = JSON.stringify(removememberId);
    }
    postNotification.param = "groupmessage";
    postNotification.sendpush = sendPushType;
    postNotification.groupName = newGroupName;
    postNotification.oldGroupName = OldGroupName;
    if (filetoupload != null && filetoupload != undefined) {
      postNotification.file = filetoupload;
    }
    return postNotification;
  }
  ClosePopup() {

  }
  LoadUsers() {
    this.userlist = [];
    this.SearchText = "";
    this.searchtext = "";
    this.offset = 0;
    this.pagenumber = 1;
    this.userTotalCount = (this.isActiveUser == "1") ? Number(this.totalActiveUserCount) : Number(this.totalUserCount);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.ResetOrInitsearch();
  }
  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }
  ClearChatSessionforRedirect() {
    localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
    localStorage.removeItem(LocalStorageItem.reloadChatType);
  }
}
