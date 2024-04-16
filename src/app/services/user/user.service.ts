import { Injectable } from "@angular/core";
import { DomainUserChat } from "src/app/models/chatmodel";
import { ChatType, Constant } from "../../common/constant/constant";
import { AuthenticationService } from "../authentication/authentication.service";
import { ChatService } from "../chat/chat.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  searchtext: string = "";
  public countryId;
  public user: any;
  domainId: string;
  limit: string = "20";
  offset: number = 0;
  resetOffset: boolean = false;
  selectedUsers: string = "1";
  userId: string;
  userlistVirtual: any[];
  userTotalCount: number;
  pagenumber: number = 20;
  chatTypeGroup = ChatType.GroupChat;
  totalScrollHeight: number = 700;

  constructor(
    private authenticationService: AuthenticationService,
    private chatService: ChatService
  ) { }

  resetOffsetOnSearch() {
    this.resetOffset = true;
  }
  prepareAllDomainUserList(): DomainUserChat {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem("countryId");
    if (!this.resetOffset) {
      this.offset = this.pagenumber + this.offset;
    } else {
      this.offset = 0;
      this.resetOffset = false;
    }

    let domainUserChat: DomainUserChat = new DomainUserChat();
    domainUserChat.apiKey = Constant.ApiKey;
    domainUserChat.domainId = this.domainId;
    domainUserChat.countryId = this.countryId;
    domainUserChat.isActiveUser = "1";
    domainUserChat.limit = this.limit;
    domainUserChat.offset = this.offset ? this.offset.toString() : "0";
    domainUserChat.searchText = this.searchtext;
    domainUserChat.selectedUsers = this.selectedUsers;
    domainUserChat.userId = this.userId;
    domainUserChat.dialUser = '1';
    // if (
    //   this.chatType == ChatType.DirectMessage ||
    //   this.chatType == ChatType.GroupChat
    // ) {
    //   domainUserChat.chatGroupId = this.chatgroupid;
    //   domainUserChat.workstreamId = "0";
    // } else {
    //   domainUserChat.workstreamId = this.chatgroupid
    //     ? this.chatgroupid.toString()
    //     : "1";
    //   this.chatgroupid;
    //   domainUserChat.chatGroupId = "0";
    // }
    return domainUserChat;
  }

  ResetOrInitsearch(): Promise<any> {
    return new Promise((resolve, reject) => {
      let domainUsers: DomainUserChat = this.prepareAllDomainUserList();
      this.chatService.getDomainUserlist(domainUsers).subscribe(
        (resp) => {
          if (resp.status == "Success") {
            resolve(resp.dataInfo);
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
}
