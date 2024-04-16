import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { fromEvent } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";
import {
  ChatType,
  Constant,
  LocalStorageItem,
  SendPushType,
} from "src/app/common/constant/constant";
import { ImageCropperComponent } from "src/app/components/common/image-cropper/image-cropper.component";
import {
  InputChat,
  LandingLeftSideMenuComponent,
} from "src/app/components/common/landing-left-side-menu/landing-left-side-menu.component";

import {
  DomainUserChat,
  MemberToGroup,
  PostNotification,
} from "src/app/models/chatmodel";
import { ChartType } from "src/app/modules/base/components/google-charts/types/chart-type";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ChatService } from "src/app/services/chat/chat.service";

@Component({
  selector: "app-popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.scss"],
})
export class PopupComponent implements OnInit {
  @Input() chatgroupid: string;
  searchtext: string = "";
  public countryId;
  public user: any;
  domainId: string;
  limit: string = "20";
  offset: number = 0;
  selectedUsers: string = "0";
  userId: string;
  userlistVirtual: any[];
  userTotalCount: number;
  pagenumber: number = 1;
  userlist: any[];
  groupName: string;
  chatTypeGroupChat = ChatType.GroupChat;
  searchUserText: string = "";
  @ViewChild("searchusertext", { static: true }) seatrchInputText: ElementRef;
  @ViewChild("UserListScrollPopop", { static: true })
  UserListScroll: ElementRef;
  @Output() ReloadChatSection = new EventEmitter<any>();
  @Output() ReloadDefaultChatM = new EventEmitter<any>();
  @Input() leftmenucomponent: LandingLeftSideMenuComponent;
  @Input() public updateImgResponce;
  @Output() replyChatMessage = new EventEmitter<any>();
  @Input() access: any = "";
  @Input() title: any = 'Users';
  @Input() buttonTitle = 'Next';
  @Input() isUpdate: any = false;
  @Input() workStreamId: any = null;
  @Output() sendUserData: EventEmitter<any> = new EventEmitter();
  @Output() closeUserPopup: EventEmitter<any> = new EventEmitter();
  @Input() currentUser: any;
  @Input() selectedSalesPersonId: any = [];
  @Input() isMultipleSalesPerson = false;
  @Input() workstreams: any;
  @Input() salesPersonsList: any = [];
  @Input() isSales = false;
  @Input() isRequired = false;

  constructor(
    public chatService: ChatService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal
  ) {}
  ngOnChanges() {
    this.offset = 0;
    this.pagenumber = 1;
    // this.userTotalCount = (this.isActiveUser == "1") ? Number(this.totalActiveUserCount) : Number(this.totalUserCount);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.LoadAllUsers();
  }
  LoadAllUsers() {
    let domainUsers: DomainUserChat = this.prepareAllDomainUserList('0');
    if (this.access == 'market-place') {
      domainUsers.workstreamId = this.workStreamId;
      domainUsers.fromMarketplace = 1;
      domainUsers.workstreams = JSON.stringify(this.workstreams);
    }
    this.chatService.getDomainUserlist(domainUsers).subscribe(
      (resp) => {
        if (resp.status == 'Success') {
          if (this.access == 'market-place' && !this.isSales) {
            resp.dataInfo.push(this.currentUser);
          }
          this.userlist = resp.dataInfo;
          this.userTotalCount = resp.totalUsers;
          for (let i = 0; i < this.userlist.length; i++) {
            if (this.access == 'market-place') {
              if (this.userlist[i].userId == this.user.Userid && !this.selectedSalesPersonId) {
                this.userlist[i].isMemberSelected = true;
                this.SelectMember(this.userlist[i]);
              } else if (this.selectedSalesPersonId && this.selectedSalesPersonId.length > 0
                && this.isMultipleSalesPerson) {
                this.selectedSalesPersonId.forEach((id) => {
                  if (this.userlist[i].userId == id) {
                    this.userlist[i].isMemberSelected = true;
                    this.SelectMember(this.userlist[i]);
                  }
                });
                this.salesPersonsList.forEach((data) => {
                  Object.defineProperty(data, 'isMemberSelected', { // using Object.defineProperty() method of JavaScript object class
                    value: true,
                    writable: true // configured writable property as false, and hence, the id property of object obj can't be changed now
                  });
                  this.SelectMember(data);
                });
              } else if (this.selectedSalesPersonId && this.userlist[i].userId == this.selectedSalesPersonId) {
                this.userlist[i].isMemberSelected = true;
                this.SelectMember(this.userlist[i]);
              } else {
                this.userlist[i].isMemberSelected = false;
              }
            } else {
              this.userlist[i].isMemberSelected = false;
            }
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  LoadExistingUsersForGroup(groupid, groupname) {
    this.chatgroupid = groupid;
    this.groupName = groupname;
    this.GroupName = groupname;
    let domainUsers: DomainUserChat = this.prepareAllDomainUserList("1");
    this.chatService.getDomainUserlist(domainUsers).subscribe(
      (resp) => {
        if (resp.status == "Success") {
          this.memberSelectedList = resp.dataInfo;
          for (let i = 0; i < this.memberSelectedList.length; i++) {
            this.memberSelectedList[i].isMemberSelected = true;
          }
          console.log("this.userlist");
          console.log(this.userlist);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  prepareAllDomainUserList(isSelected): DomainUserChat {
    let domainUserChat: DomainUserChat = new DomainUserChat();
    domainUserChat.apiKey = Constant.ApiKey;
    domainUserChat.domainId = this.domainId;
    domainUserChat.countryId = this.countryId;
    // domainUserChat.isActiveUser = this.isActiveUser;
    domainUserChat.limit = this.limit;
    domainUserChat.offset = this.offset ? this.offset.toString() : "0";
    domainUserChat.searchText = this.searchtext;
    domainUserChat.selectedUsers = JSON.stringify(isSelected);
    domainUserChat.userId = this.userId;
    domainUserChat.chatGroupId = this.chatgroupid;
    return domainUserChat;
  }

  ngOnInit(): void {
    if(!this.selectedSalesPersonId) {
      this.selectedSalesPersonId = [];
    }
    this.countryId = localStorage.getItem("countryId");
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.InitilizeUserInputSearch();
    this.InitializeAndLoadUserDataOnScoll();
    if (this.access == 'market-place') {
      let model_group = document.getElementById("groupUserPopup");
      model_group.classList.add("modal-fade");
      this.LoadAllUsers();
    }
  }
  InitilizeUserInputSearch() {
    fromEvent(this.seatrchInputText.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 2
        filter((res) => res.length > 2 || res.length == 0),

        // Time in milliseconds between key events
        debounceTime(500),

        // If previous query is diffent from current
        distinctUntilChanged()

        // subscription for response
      )
      .subscribe((text: string) => {
        this.searchtext = text;
        this.offset = 0;
        this.pagenumber = 1;
        let domainUsers: DomainUserChat = this.prepareAllDomainUserList("0");
        if (this.access == 'market-place') {
          domainUsers.workstreamId = this.workStreamId;
          domainUsers.fromMarketplace = 1;
          domainUsers.workstreams = JSON.stringify(this.workstreams);
        }
        this.chatService.getDomainUserlist(domainUsers).subscribe(
          (resp) => {
            if (resp.status == "Success") {
              this.userlist = resp.dataInfo;
              for (let i = 0; i < this.userlist.length; i++) {
                this.userlist[i].isMemberSelected = false;
              }
              console.log("this.userlist1");
              console.log(this.userlist);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }
  isLoadingOnScroll: boolean;
  InitializeAndLoadUserDataOnScoll() {
    fromEvent(this.UserListScroll.nativeElement, "scroll")
      .pipe(
        map((event: any) => {
          return event;
        }),
        filter(
          (res) =>
            res.target.scrollTop + res.target.offsetHeight >
              res.target.scrollHeight - 10 &&
            this.pagenumber <
              Math.ceil(this.userTotalCount / Number(this.limit))
        ),
        debounceTime(300),
        distinctUntilChanged()
        // subscription for response
      )
      .subscribe((text: any) => {
        this.isLoadingOnScroll = true;
        this.offset = this.pagenumber * Number(this.limit);
        this.pagenumber = this.pagenumber + 1;
        let domainUsers: DomainUserChat = this.prepareAllDomainUserList("0");
        if (this.access = 'market-place') {
          domainUsers.workstreamId = this.workStreamId;
          domainUsers.fromMarketplace = 1;
          domainUsers.workstreams = JSON.stringify(this.workstreams);
        }
        this.chatService.getDomainUserlist(domainUsers).subscribe(
          (resp) => {
            if (resp.status == "Success") {
              this.isLoadingOnScroll = false;
              this.userlist = [...this.userlist, ...resp.dataInfo];
              for (let i = 0; i < this.userlist.length; i++) {
                this.userlist[i].isMemberSelected = false;
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }
  AddNewMemberToExistingGroup(groupid, groupname) {
    this.ResetMemberUpdated();
    this.groupAction = "Edit";
    this.chatgroupid = groupid;
    this.GroupName = groupname;
    this.groupName = groupname;
    this.searchUserText = "";
    this.searchtext = "";
    this.offset = 0;
    this.userlist = [];
    let model_group = document.getElementById("groupUserPopup");
    model_group.classList.add("modal-fade");
    this.LoadAllUsers();
    // this.LoadExistingUsersForGroup(groupid,groupname);
  }
  //CreateGroupwithMembersOrDirectChat
  AddGroupOrDMClick() {
    this.groupAction = "New";
    this.searchUserText = "";
    this.searchtext = "";
    this.groupName = "";
    this.GroupName = "";
    this.oldGroupName = "";
    this.userlist = [];
    this.ResetMemberUpdated();
    this.chatgroupid = "0";
    this.offset = 0;
    let model_group = document.getElementById("groupUserPopup");
    model_group.classList.add("modal-fade");
    this.LoadAllUsers();
  }
  scrolled(evt) {
    console.log("scrolled.........");
    console.log(evt);
  }
  CloseUserPopup() {
    let model_group = document.getElementById("groupUserPopup");
    model_group.classList.remove("modal-fade");
    this.closeUserPopup.emit(true);
  }
  isImageUpload: boolean;
  oldGroupName: string = "";
  OpenEditGroupPoup(grNmme, grId, imageUrl) {
    this.isImageUpload = false;
    this.imgURL = imageUrl;
    this.isNewGroup = false;
    this.groupAction = "Edit";
    this.oldGroupName = grNmme;
    this.groupName = grNmme;
    this.GroupName = grNmme;
    this.ResetMemberUpdated();
    this.chatgroupid = grId;
    this.OpenManagGroupPopup();
  }
  groupAction: string;
  isNewGroup: boolean;
  OpenAddGroupPoup() {
    this.isImageUpload = false;
    this.imgURL = "";
    this.isNewGroup = true;
    this.groupAction = "New";
    this.OpenManagGroupPopup();
  }
  OpenManagGroupPopup() {
    let model_group = document.getElementById("manageGroupPopup");
    model_group.classList.add("modal-fade");
  }
  CloseManagGroupPopup() {
    let model_group = document.getElementById("manageGroupPopup");
    model_group.classList.remove("modal-fade");
  }
  newMeberList: any[] = [];
  removedMeberList: any[] = [];
  memberSelectedList: any[] = [];
  SelectMember(user) {
    if (this.access == 'market-place' && !this.isMultipleSalesPerson) {
      this.newMeberList = [];
      this.memberSelectedList = [];
      this.userlist?.map((user: any) => user.isMemberSelected = false);
    }
    if (this.userlist.find((x) => x.userId == user.userId)) {
      this.userlist.find((x) => x.userId == user.userId).isMemberSelected = true;
    }
    if (!this.newMeberList.find((x) => x.userId == user.userId)) {
      this.newMeberList.push(user);
    }
    if (!this.memberSelectedList.find((x) => x.userId == user.userId)) {
      this.memberSelectedList.push(user);
    }

    console.log(this.newMeberList);
    //this.memberSelectedList = this.memberSelectedList.filter(x=>x.userId != user.userId);
  }
  removeemberSelected(user) {
    this.memberSelectedList = this.memberSelectedList.filter(
      (x) => x.userId != user.userId
    );
    if (this.userlist.find((x) => x.userId == user.userId)) {
      this.userlist.find((x) => x.userId == user.userId).isMemberSelected =
        false;
    }
   // this.removedMeberList.push(user);
    if (this.newMeberList.find((x) => x.userId == user.userId)) {
      //this.newMeberList.find((x) => x.userId == user.userId).splice(0, 1);
      let index = this.newMeberList.findIndex(x => x.userId === user.userId);
      this.newMeberList.splice(index, 1);
    }
    console.log(this.newMeberList);
  }
  RemoveDMChat(groupid) {
    this.GroupName = "";
    let userid = this.userId;
    this.chatgroupid = groupid;
    this.removedMeberList = [];
    let user = this.user;
    user.userId = this.userId;
    this.removedMeberList.push(this.user);
    let alldomainusers: MemberToGroup = this.prepareMemberData(
      ChatType.DirectMessage
    );
    this.chatService.AddMemeberToGroup(alldomainusers).subscribe((resp) => {
      this.isImageUpload = true;
      console.log("added to ");
      console.log(resp);
      this.fileToUpload = null;

      this.chatService.dmstreamArr = this.chatService.dmstreamArr.filter((arr) => {
        return arr.Id != resp.chatGroupId
      })

      this.leftmenucomponent.ReloadGrouAndDMChatMenu(
        "",
        ChatType.DirectMessage
      );
      this.ReloadDefaultChatM.emit("");
      this.leftmenucomponent.SelectDefaultWorkstreamChat();
    });
  }
  RemoveGroupChat(groupid, groupName, user) {
    this.chatgroupid = groupid;
    this.GroupName = groupName;
    this.groupName = groupName;
    this.removedMeberList = [user];
    let alldomainusers: MemberToGroup = this.prepareMemberData(
      ChatType.GroupChat
    );
    console.log(alldomainusers);
    this.chatService.AddMemeberToGroup(alldomainusers).subscribe((resp) => {
      this.fileToUpload = null;
      console.log("added to ");
      console.log(resp);
      //this.leftmenucomponent.ReloadGrouAndDMChatMenu("",ChatType.GroupChat);
      let chatGroupId = resp.chatGroupId;
    });
  }

  GroupName: string = "";

  AddMemberToGroup() {
    if (this.access == 'market-place') {
      this.sendUserData.emit(this.newMeberList);
    } else {
      let chatType: ChatType;

      if (this.groupAction == "Edit") {

        if (this.newMeberList.length == 1) {
        chatType = ChatType.GroupChat;
        this.SaveMembersToGroup(chatType);
        }

      } else {
        if (this.newMeberList.length == 0) {
          return;
        }
        if (this.newMeberList.length == 1) {
          this.GroupName = "";
          chatType = ChatType.DirectMessage;
          this.chatgroupid = "0";
          this.SaveMembersToGroup(chatType);
        } else {
          chatType = ChatType.GroupChat;
          this.CloseUserPopup();
          this.OpenAddGroupPoup();
        }
      }
    }
  }
  SaveMembersToGroup(chatType) {
    if (chatType == ChatType.GroupChat) {
      if (this.groupName == "") {
        return;
      }
      this.GroupName = this.groupName;
    } else {
      this.GroupName = "";
    }
    let alldomainusers: MemberToGroup = this.prepareMemberData(chatType);
    console.log(alldomainusers);
    this.chatService.AddMemeberToGroup(alldomainusers).subscribe((resp) => {
      console.log("added to ");
      console.log(resp);
      //this.PostNotification(resp.dataId);
      let chatGroupId = resp.chatGroupId;
      this.StartNotification(chatGroupId, chatType);
      this.leftmenucomponent.ReloadGrouAndDMChatMenu(chatGroupId, chatType);
      this.fileToUpload = null;
      let displayname =
        chatType == ChatType.GroupChat
          ? this.GroupName
          : this.newMeberList[0].userName;
      let profileImage =
        chatType == ChatType.GroupChat
          ? this.imgURL
          : this.newMeberList[0].profileImg;
      let pushitem: InputChat = {
        id: chatGroupId,
        name: displayname,
        chatType: chatType,
        profileImg: profileImage,
        contentType: {},
      };
      if ((chatType = ChatType.DirectMessage)) {
        this.CloseUserPopup();
      }
      if ((chatType = ChatType.GroupChat)) {
        this.CloseManagGroupPopup();
        // if (this.groupName !=this.oldGroupName)
        // {

        // }
      }
      this.ClearChatSessionforRedirect();
      this.ReloadChatSection.emit(pushitem);
      // var aurl='chat-page/'+chatGroupId+"/"+chatType;
      // this.router.navigate([aurl]);
    });
  }
  ResetMemberUpdated() {
    this.newMeberList = [];
    this.removedMeberList = [];
    this.memberSelectedList = [];
    //this.searchtext = "";
  }
  prepareMemberData(chatType): MemberToGroup {
    let memberUserId: any[] = [];
    let removememberId: any[] = [];
    let memberToGroup: MemberToGroup = new MemberToGroup();
    memberToGroup.apiKey = Constant.ApiKey;
    memberToGroup.chatGroupId = this.chatgroupid;
    memberToGroup.domainId = this.domainId;
    memberToGroup.countryId = this.countryId;
    memberToGroup.chatType = chatType;
    memberUserId.push(this.userId);
    memberToGroup.userId = this.userId;
    for (let i = 0; i < this.newMeberList.length; i++) {
      memberUserId.push(this.newMeberList[i].userId);
    }
    if (this.isNewGroup) {
      memberUserId.push(this.userId);
    }
    for (let j = 0; j < this.removedMeberList.length; j++) {
      removememberId.push(this.removedMeberList[j].userId);
    }
    memberToGroup.newMembers =
      memberUserId.length > 0 ? JSON.stringify(memberUserId) : "";
    memberToGroup.removeMembers =
      removememberId.length > 0 ? JSON.stringify(removememberId) : "";
    memberToGroup.groupName = this.GroupName;
    if (this.fileToUpload != null && this.fileToUpload != undefined) {
      memberToGroup.file = this.fileToUpload;
    }

    return memberToGroup;
  }
  LoadDirectChat(group: any) {
    let pushitem: InputChat = {
      id: group.Id,
      name: group.grName,
      chatType: ChatType.DirectMessage,
      profileImg: group.profileImg,
      contentType: {},
    };
    //this.ReloadChatSection.emit(pushitem);
  }
  ClearAllMember() {
    for (let i = 0; i < this.memberSelectedList.length; i++) {
      if (this.userlist.find((x) => x.userId == this.memberSelectedList[i])) {
        this.userlist.find(
          (x) => x.userId == this.memberSelectedList[i].userId
        ).isMemberSelected = false;
      }
    }
    this.searchtext = "";
    this.searchUserText = "";
    this.userlist = [];
    this.LoadAllUsers();
    this.newMeberList = [];
    this.memberSelectedList = [];
  }
  imgURL: any;
  editIconFlag: boolean;
  fileToUpload: any;
  changeProfile() {
    const modalRef = this.modalService.open(ImageCropperComponent, {
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.type = "Edit";
    modalRef.componentInstance.fromPage = "chat-page";
    modalRef.componentInstance.updateImgResponce.subscribe(
      (receivedService) => {
        if (receivedService) {
          this.editIconFlag = true;
          modalRef.dismiss("Cross click");
          console.log(receivedService);
          //this.apiUrl.profileImage = receivedService.show;
          // this.imgURL = receivedService;
          this.fileToUpload = receivedService;
          var reader = new FileReader();
          //this.imagePath = files;
          reader.readAsDataURL(receivedService);
          reader.onload = (_event) => {
            //  attachmentLocalUrl = reader.result;
            this.imgURL = _event.target.result;
            if (this.groupAction == "Edit") {
              let displayname = this.GroupName;
              let profileImage = this.imgURL;
              let pushitem: InputChat = {
                id: this.chatgroupid,
                name: displayname,
                chatType: ChatType.GroupChat,
                profileImg: profileImage,
                contentType: {},
              };
              this.ClearChatSessionforRedirect();
              this.ReloadChatSection.emit(pushitem);
              // var aurl='chat-page/'+this.chatgroupid+"/"+ChatType.GroupChat;
              // this.router.navigate([aurl]);
            }
            console.log("this.imgURL");
            console.log(this.imgURL);
          };
        }
      }
    );
  }
  // PostNotification(dataid:string){

  //   let notification :PostNotification = this.preparePushNotification(dataid);
  //   this.chatService.AddPostNotification(notification).subscribe((resp)=>{
  //     console.log('Post Notification  Response');
  //     console.log(resp);
  //   })
  //  }
  preparePushNotification(
    chatgroupid: string,
    sendPushType: SendPushType,
    newMemberList: any[],
    removememberlist: any[],
    newGroupName,
    OldGroupName,
    filetoupload
  ) {
    let memberUserId: any[] = [];
    let removememberId: any[] = [];
    //let sendPushType : SendPushType = SendPushType.GroupManage;
    let postNotification: PostNotification = new PostNotification();
    postNotification.apiKey = Constant.ApiKey;
    if (
      this.chatTypeGroupChat == ChatType.DirectMessage ||
      this.chatTypeGroupChat == ChatType.GroupChat
    ) {
      postNotification.chatGroupId = chatgroupid;
    } else {
      postNotification.chatGroupId = "0";
    }
    postNotification.domainId = this.domainId;
    postNotification.countryId = this.countryId;
    postNotification.userId = this.userId;
    postNotification.chatType = this.chatTypeGroupChat;
    postNotification.dataId = "";
    postNotification.limit = "10";
    postNotification.offset = "0";

    for (let i = 0; i < newMemberList.length; i++) {
      memberUserId.push(newMemberList[i].userId);
    }
    if (this.isNewGroup) {
      memberUserId.push(this.userId);
    }
    for (let j = 0; j < removememberlist.length; j++) {
      removememberId.push(removememberlist[j].userId);
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
  StartNotification(chatgroupid: string, chatType: ChatType) {
    let notification: PostNotification;
    if (chatType == ChatType.DirectMessage) {
      notification = this.preparePushNotification(
        chatgroupid,
        SendPushType.GroupManage,
        this.newMeberList,
        [],
        "",
        "",
        null
      );
      this.chatService.AddPostNotification(notification).subscribe((resp) => {
        console.log("Post Notification  Response");
        console.log(resp);
      });
    } else {
      if (this.newMeberList.length > 0) {
        notification = this.preparePushNotification(
          chatgroupid,
          SendPushType.GroupManage,
          this.newMeberList,
          [],
          "",
          "",
          null
        );
        this.chatService.AddPostNotification(notification).subscribe((resp) => {
          console.log("Post Notification  Response");
          console.log(resp);
        });
      }
      if (this.removedMeberList.length > 0) {
        notification = this.preparePushNotification(
          chatgroupid,
          SendPushType.RemoveUser,
          [],
          this.removedMeberList,
          "",
          "",
          null
        );
        this.chatService.AddPostNotification(notification).subscribe((resp) => {
          console.log("Post Notification  Response");
          console.log(resp);
        });
      }
      if (this.fileToUpload != null && this.fileToUpload != undefined) {
        notification = this.preparePushNotification(
          chatgroupid,
          SendPushType.UploadGroupIcon,
          [],
          [],
          "",
          "",
          this.fileToUpload
        );
        this.chatService.AddPostNotification(notification).subscribe((resp) => {
          console.log("Post Notification  Response");
          console.log(resp);
        });
      }
      if (this.groupName && this.groupName != this.oldGroupName && this.newMeberList.length==0 && this.removedMeberList.length==0) {
        notification = this.preparePushNotification(
          chatgroupid,
          SendPushType.GroupLastNameChannge,
          [],
          [],
          this.GroupName,
          this.oldGroupName,
          null
        );
        this.chatService.AddPostNotification(notification).subscribe((resp) => {
          console.log("Post Notification  Response");
          console.log(resp);
        });
      }
    }
  }
  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }
  ClearChatSessionforRedirect() {
    localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
    localStorage.removeItem(LocalStorageItem.reloadChatType);
  }
  replyChatPopup: any;
  OpenReplyPopup(replychat: any) {
    this.replyChatPopup = replychat;
  }
  CloseReplyPopup() {
    let model_group = document.getElementById("ReplyPopup");
    model_group.classList.remove("modal-fade");
  }
  ReplyChatMessage(message) {
    this.CloseReplyPopup();
    this.replyChatMessage.emit(message);
  }
}
