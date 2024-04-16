export class ApiConfiguration {
  apiKey: string;
  userId: string;
  domainId: string;
  countryId: string;
}
export class PagingConfiguration extends ApiConfiguration {
  limit: string;
  offset: string;
}

export class WorkStreamOrGroupChat extends PagingConfiguration {
  chatGroupId: string;
  notificationVersion: string;
  chatType: string;
  lastReply: string;
  workstreamId: string;
}
export class DomainUserChat extends PagingConfiguration {
  chatGroupId: string;
  selectedUsers: string;
  searchText: string;
  isActiveUser: string;
  workstreamId: string;
  dialUser: string;
  fromMarketplace?: number;
  workstreams?: string;
  slectedSalesPersons?: string;
}
export class ChatMessage extends ApiConfiguration {
  chatGroupId: string;
  chatType: string;
  content: string;
  workstreamId: string;
  dataId: string;
  mentionContent: string;
  mentionUserList: any[];
  sendpush: string;
  messageId: string;
  messageType: string;
}
export class ChatAttachment extends ApiConfiguration {
  workStreamId: string;
  type: string;
  caption: string;
  chatGroupId: string;
  chatType: string;
  file: any;
  sendpush: string;
  messageId: string;
  messageType: string;
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
export class ChatResponse {
  displayDate: Date;
  DisplayDateyyMMdd: string;
  chatmessage: any[];


}
export class PostNotification extends ApiConfiguration {
  param: string;
  limit: string;
  offset: string;
  dataId: string;
  chatType: string;
  chatGroupId: string;
  sendpush: string;
  notifyUsers: string;
  groupName: string;
  oldGroupName: string;
  mentionContent: string;
  mentionUserList: any[];
  file: any;
  replyUserId: string;
}
export class MemberToGroup extends ApiConfiguration {
  chatGroupId: string;
  chatType: string;
  newMembers: string;
  removeMembers: string;
  groupName: string;
  file: any;
} export class ManageTokBoxsession extends ApiConfiguration {
  type: string;
  deviceName: string;
  chatGroupId: string;
  chatType: string;
  vonageApiKey: string;
  groupMembers: string;
  groupName: string;
}
