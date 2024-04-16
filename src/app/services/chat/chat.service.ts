import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import {
  ChatAttachment,
  ChatMessage,
  DomainUserChat,
  MemberToGroup,
  PostNotification,
  ManageTokBoxsession,
} from "src/app/models/chatmodel";
import { WorkStreamOrGroupChat } from "src/app/models/chatmodel";

import { ApiService } from "../api/api.service";
import { catchError, map } from "rxjs/operators";
import { NotificationService } from "../notification/notification.service";
HttpClient;

@Injectable({
  providedIn: "root",
})
export class ChatService {

  public ReplyMessage: any = null;
  workstreamArr = [];
  grstreamArr = [];
  dmstreamArr = [];
  idsArr = [];
  currentWorkstreamIdInfo: any = '';
  totalNewWorkstreamMessage: any = '';
  totalNewDMMessage: number = 0;
  totalNewGroupMessage: number = 0;
  type: any = '';
  groupType = "3";
  directMessageType = "2";
  workstreamType = "1";
  channel: BroadcastChannel;

  constructor(private http: HttpClient, private apiUrl: ApiService, private noti: NotificationService) { }

  getworkstreamOrGroupChat(workStreamOrGroupInput: WorkStreamOrGroupChat) {
    const apiFormData = new FormData();
    localStorage.setItem("loadedChatType", workStreamOrGroupInput.chatType);

    localStorage.setItem(
      "loadedchatGroupId",
      workStreamOrGroupInput.chatGroupId
    );

    localStorage.setItem(
      "loadedworkstreamId",
      workStreamOrGroupInput.workstreamId
    );
    this.currentWorkstreamIdInfo = workStreamOrGroupInput.workstreamId;

    apiFormData.append("apiKey", workStreamOrGroupInput.apiKey);
    apiFormData.append("domainId", workStreamOrGroupInput.domainId);
    apiFormData.append("countryId", workStreamOrGroupInput.countryId);
    apiFormData.append("userId", workStreamOrGroupInput.userId);
    apiFormData.append("limit", workStreamOrGroupInput.limit);
    apiFormData.append("workStreamId", workStreamOrGroupInput.workstreamId);
    apiFormData.append("offset", workStreamOrGroupInput.offset);
    apiFormData.append("chatGroupId", workStreamOrGroupInput.chatGroupId);
    apiFormData.append("chatType", workStreamOrGroupInput.chatType);
    apiFormData.append("lastReply", workStreamOrGroupInput.lastReply);
    apiFormData.append("platform", '3');

    this.noti.activeChatObject = {
      notificationId: null,
      postId: null,
      threadId: null,
      chatType: workStreamOrGroupInput.chatType,
      leaveGroup: 0,
      chatGroupId: workStreamOrGroupInput.chatGroupId,
      workStreamId: workStreamOrGroupInput.workstreamId,
    }

    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      return this.http.post<any>(
        this.apiUrl.apigetWorksteamOrGroupChatV2(),
        apiFormData
      );
    } else {
      return this.http.post<any>(
        this.apiUrl.apigetWorksteamOrGroupChat(),
        apiFormData
      );
    }
  }
  getDomainUserlist(domainUsers: DomainUserChat) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", domainUsers.apiKey);
    apiFormData.append("domainId", domainUsers.domainId);
    apiFormData.append("countryId", domainUsers.countryId);
    apiFormData.append("userId", domainUsers.userId);
    // apiFormData.append('workStreamId',domainUsers.workstreamId);
    apiFormData.append("limit", domainUsers.limit);
    apiFormData.append("offset", domainUsers.offset);
    if (domainUsers.chatGroupId) {
      apiFormData.append("chatGroupId", domainUsers.chatGroupId);
    }
    apiFormData.append("selectedUsers", domainUsers.selectedUsers);
    apiFormData.append("searchText", domainUsers.searchText);
    if (
      domainUsers.isActiveUser != undefined &&
      domainUsers.isActiveUser != null
    ) {
      apiFormData.append("isActiveUser", domainUsers.isActiveUser);
    }
    if (domainUsers.workstreamId) {
      apiFormData.append("workstreamId", domainUsers.workstreamId);
    }
    if (domainUsers.dialUser) {
      apiFormData.append('dialUser', domainUsers.dialUser)
    }
    if (domainUsers.workstreams) apiFormData.append("workstreams", domainUsers.workstreams);
    if (domainUsers.fromMarketplace) apiFormData.append("fromMarketplace", domainUsers.fromMarketplace.toString());
    if (domainUsers.slectedSalesPersons) apiFormData.append("slectedSalesPersons", domainUsers.slectedSalesPersons.toString());
    return this.http.post<any>(this.apiUrl.apigetDomainUserList(), apiFormData);
  }

  SaveChatMessage(chatMessage: ChatMessage) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", chatMessage.apiKey);
    apiFormData.append("domainId", chatMessage.domainId);
    apiFormData.append("countryId", chatMessage.countryId);
    apiFormData.append("userId", chatMessage.userId);
    apiFormData.append("workStreamId", chatMessage.workstreamId);
    apiFormData.append("content", chatMessage.content);
    apiFormData.append("chatType", chatMessage.chatType);
    apiFormData.append("chatGroupId", chatMessage.chatGroupId);
    apiFormData.append("notificationVersion", "2");
    apiFormData.append("mentionContent", chatMessage.mentionContent);
    apiFormData.append("localTimeStamp", moment().format('YYYY-MM-DD H:m:s'));
   apiFormData.append("localTimeZone", momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr());

  
    apiFormData.append(
      "mentionUserList",
      JSON.stringify(chatMessage.mentionUserList)
    );
    apiFormData.append("sendpush", chatMessage.sendpush);
    apiFormData.append("messageId", chatMessage.messageId);
    apiFormData.append("messageType", chatMessage.messageType);
    return this.http.post<any>(this.apiUrl.apiAddworkstreamChat(), apiFormData);
  }
  DeleteChat(chatMessage: ChatMessage) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", chatMessage.apiKey);
    apiFormData.append("domainId", chatMessage.domainId);
    apiFormData.append("countryId", chatMessage.countryId);
    apiFormData.append("userId", chatMessage.userId);
    apiFormData.append("workStreamId", chatMessage.workstreamId);
    apiFormData.append("dataId", chatMessage.dataId);
    apiFormData.append("chatType", chatMessage.chatType);
    apiFormData.append("chatGroupId", chatMessage.chatGroupId);
    apiFormData.append("fromFcm", "2");

    return this.http.post<any>(
      this.apiUrl.apiDeleteworkstreamChat(),
      apiFormData
    );
  }
  AddPostNotification(pstNotification: PostNotification) {
    const apiFormData = new FormData();
    apiFormData.append("api_key", pstNotification.apiKey);
    apiFormData.append("domain_id", pstNotification.domainId);
    apiFormData.append("countryId", pstNotification.countryId);
    apiFormData.append("user_id", pstNotification.userId);
    apiFormData.append("param", pstNotification.param);
    apiFormData.append("limit", pstNotification.limit);
    apiFormData.append("offset", pstNotification.offset);
    apiFormData.append("dataId", pstNotification.dataId);
    apiFormData.append("chatGroupId", pstNotification.chatGroupId);
    apiFormData.append("chatType", pstNotification.chatType);
    apiFormData.append("notificationVersion", "2");
    apiFormData.append("sendpush", pstNotification.sendpush);
    apiFormData.append("mentionContent", pstNotification.mentionContent);
    apiFormData.append(
      "mentionUserList",
      JSON.stringify(pstNotification.mentionUserList)
    );
    apiFormData.append("notifyUsers", pstNotification.notifyUsers);
    apiFormData.append("file", pstNotification.file);
    apiFormData.append("groupName", pstNotification.groupName);
    apiFormData.append("oldGroupName", pstNotification.oldGroupName);
    apiFormData.append("replyUserId", pstNotification.replyUserId);

    return this.http.post<any>(
      this.apiUrl.apiAddPostNotification(),
      apiFormData
    );
  }
  private serverUrl: string;
  AddMemeberToGroup(chatMessage: MemberToGroup) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", chatMessage.apiKey);
    apiFormData.append("domainId", chatMessage.domainId);
    apiFormData.append("countryId", chatMessage.countryId);
    apiFormData.append("userId", chatMessage.userId);
    apiFormData.append("newMembers", chatMessage.newMembers);
    apiFormData.append("removeMembers", chatMessage.removeMembers);
    apiFormData.append("chatType", chatMessage.chatType);
    apiFormData.append("chatGroupId", chatMessage.chatGroupId);
    apiFormData.append("groupName", chatMessage.groupName);
    apiFormData.append("file", chatMessage.file);
    return this.http.post<any>(this.apiUrl.apiAddMementToGroup(), apiFormData);
  }
  getMediaUploadStatus(
    jobid: string,
    apiKey: string,
    userId: any,
    domainId: any
  ) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", apiKey);
    apiFormData.append("jobId", jobid);
    apiFormData.append("userId", userId);
    apiFormData.append("domainId", domainId);
    return this.http.post<any>(
      this.apiUrl.apigetUploadMediaStatus(),
      apiFormData
    );
  }
  ManageTokBoxsession(data: ManageTokBoxsession, intialCall = false) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", data.apiKey);
    apiFormData.append("domainId", data.domainId);
    apiFormData.append("countryId", data.countryId);
    apiFormData.append("userId", data.userId);
    apiFormData.append("type", "A");
    apiFormData.append("deviceName", data.deviceName);
    apiFormData.append("chatGroupId", data.chatGroupId);
    apiFormData.append("chatType", data.chatType);
    apiFormData.append("vonageApiKey", data.vonageApiKey);
    apiFormData.append("groupMembers", JSON.stringify(this.idsArr));
    apiFormData.append("groupName", data.groupName);
    apiFormData.append('baseUrl', location.origin);
    if (localStorage.getItem('videoCallDataSessionId') && localStorage.getItem('videoCallDataToken') && !intialCall) {
      apiFormData.append("sessionId", localStorage.getItem('videoCallDataSessionId'));
      apiFormData.append("sessionToken", localStorage.getItem('videoCallDataToken'));
    }
    return this.http.post<any>(
      this.apiUrl.apiManageTokBoxsession(),
      apiFormData
    );
  }

  moveArrayItemToNewIndex(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        //arr.push(undefined);
      }
    }
    if(arr && arr.length>0) {
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }    
    return arr;
  };

}
