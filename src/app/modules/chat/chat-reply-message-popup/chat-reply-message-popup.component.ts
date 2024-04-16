import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forumPageAccess, MediaTypeInfo, MessageType } from 'src/app/common/constant/constant';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat-reply-message-popup',
  templateUrl: './chat-reply-message-popup.component.html',
  styleUrls: ['./chat-reply-message-popup.component.scss']
})
export class ChatReplyMessagePopupComponent implements OnInit {
  messageTypenormalMessage = MessageType.normalMessage;
  messageTypeattachment =  MessageType.attachment;
  messageTypeSystem =  MessageType.systemMessage;

  mediaTypeInfoImage = MediaTypeInfo.Image;
  mediaTypeInfoVideo = MediaTypeInfo.Video;
  mediaTypeInfoAudio = MediaTypeInfo.Audio;
  mediaTypeInfoPdf = MediaTypeInfo.Pdf;
  mediaTypeInfoDocuments = MediaTypeInfo.Documents;
  mediaTypeInfoLink = MediaTypeInfo.Link;
  @Input() replyChat: any;
  @Output() OpenReplyChatPopup = new EventEmitter<any>();
  constructor(
    public chatservice : ChatService
  ) { }

  ngOnInit(): void {
  }
  IsReplyNormalMessage(chat)
  {
    return (chat && chat.messageType== this.messageTypenormalMessage && chat.flagId != this.mediaTypeInfoLink)

  }
  IsReplyLinkMessage(chat)
  {
    return (chat && chat.messageType== this.messageTypenormalMessage && chat.flagId == this.mediaTypeInfoLink)
  }
  IsReplyMessageImageExist(chat)
  {
    return (chat &&
    (
     (chat.messageType== this.messageTypenormalMessage && chat.flagId == this.mediaTypeInfoLink)
     || (chat.messageType== this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo)
     || (chat.messageType== this.messageTypeattachment && (chat.flagId == this.mediaTypeInfoImage || chat.flagId == this.mediaTypeInfoVideo))
    )))
  }
  IsReplyMessageAudioExist(chat)
  {
    return (chat.messageType== this.messageTypeattachment && chat.flagId == this.mediaTypeInfoAudio)
  }
  IsReplyFileInfoExist(chat)
  {
    return (chat &&
      (
       (chat.messageType== this.messageTypeattachment && chat.flagId == this.mediaTypeInfoAudio)
       || (chat.messageType== this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo)
       || (chat.messageType== this.messageTypeattachment && (chat.flagId == this.mediaTypeInfoImage || chat.flagId == this.mediaTypeInfoVideo))
      )))
  }
  GetReplyNormalMessage(chat)
  {
    if (chat && chat.mentionUserListArr && chat.mentionUserListArr.length > 0)
    {
      return this.GetMentionedContent(chat);
    }
    if (chat && chat.mentionUserListArr ==null ||chat.mentionUserListArr == undefined || ( chat.mentionUserListArr && chat.mentionUserListArr.length == 0))
    {
      return this.convertunicode(chat.content);
    }
    return "";
  }
  GetReplyMessageImage(chat)
  {
    if (chat && chat.messageType== this.messageTypenormalMessage && chat.flagId == this.mediaTypeInfoLink)
    {
      return (chat.isDefaultLInk == '1'? 'assets/images/chat/default-link.png' : chat.thumbFilePath)
    }
    if (chat && chat.messageType== this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo))
    {
      return this.GetDocumentIconFromFileExtension(chat.fileExt);
    }
    if (chat.flagId == this.mediaTypeInfoImage)
    {
      return chat.thumbFilePath;
    }
    if (chat.flagId == this.mediaTypeInfoVideo)
    {
      return chat.posterImage;
    }
    return "";
  }
  GetReplyMessageChatFileName(chat)
  {

    if (chat && chat.messageType== this.messageTypeattachment && (chat.flagId != this.mediaTypeInfoLink && chat.flagId != this.mediaTypeInfoAudio && chat.flagId != this.mediaTypeInfoImage && chat.flagId != this.mediaTypeInfoVideo))
    {
      return chat.fileCaption;
    }
    if (chat.flagId == this.mediaTypeInfoImage)
    {
      return chat.fileCaption;
    }
    if (chat.flagId == this.mediaTypeInfoVideo)
    {
      return chat.fileCaption;
    }
    if (chat && chat.messageType== this.messageTypeattachment && chat.flagId == this.mediaTypeInfoAudio)
    {
      return chat.fileName;
    }
    return "";
  }
  GetMentionedContent(chat)
    {

      let content :string = chat.mentionContent;
      if (content != null && content != undefined && content != "")
      {
      content = content.replace("<<USERID:","@");
      let startIndex =  content.indexOf("@") ;
      let endIndex = content.indexOf(">") ;
      let userId = content.substring(startIndex + 1 , endIndex );
     // console.log('userId' + userId);
      let mentionUserListArr :any[]= chat.mentionUserListArr;
      let  userName = ( mentionUserListArr.find(x=>x.userId == userId)) ? mentionUserListArr.find(x=>x.userId == userId).userName:"";
      content = content.replace(userId,userName);
      content = content.replace(">>","");
      let textToReplace = "<a class='TagContent replyToMessage'   href="+ forumPageAccess.profilePage+userId +" target='_blank'" + ">"+ "@"+userName +"</a>"
      content = content.replace("@"+userName,textToReplace);
    }
      return content ;
      // let newcontent = "";
      // let mappedcontent ="";
      // let isContinue :boolean ;

      // if (content!="")
      // {
      //   for (let i=0;i< content.length;i++)
      //   {
      //     if (content[i] == "<")
      //     {
      //       // while(content[i] == ">")
      //       // {
      //       //   mappedcontent = mappedcontent + content[i] ;
      //       // }
      //     }else
      //     {
      //       newcontent = newcontent + content[i];
      //     }

      //   }
      // }
    }
    convertunicode(val){
      val=val.replace(/\\n/g, '')
      .replace(/'/g, '"')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");
      if (val == undefined || val == null){
        return val;
      }
      //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
      if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1){

        JSON.stringify(val)
        //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

        //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
        return (JSON.parse('"' + val.replace(/\"/g, '\\"' + '"')+'"'));
      }

      else{
        return val;
      }

    }
    GetDocumentIconFromFileExtension(extension:string)
    {
      let iconPath = "assets/images/chat/unknown-thumb.png";
      if (extension!=null && extension!=undefined)
      {
        if (extension.toLocaleLowerCase().indexOf("pdf") != -1)
        {
          iconPath = "assets/images/chat/pdf-icon.png";
        }
        if (extension.toLocaleLowerCase().indexOf("zip") != -1)
        {
          iconPath = "assets/images/chat/zip-thumb.png";
        }
        if (extension.toLocaleLowerCase().indexOf("doc") != -1)
        {
          iconPath = "assets/images/chat/doc-thumb.png";
        }
        if (extension.toLocaleLowerCase().indexOf("xlsx") != -1)
        {
          iconPath = "assets/images/chat/xls-thumb.png";
        }
        if (extension.toLocaleLowerCase().indexOf("ppt") != -1)
        {
          iconPath = "assets/images/chat/ppt-thumb.png";
        }
        if (extension.toLocaleLowerCase().indexOf("ppt") != -1)
        {
          iconPath = "assets/images/chat/ppt-thumb.png";
        }
        if (extension.toLocaleLowerCase().indexOf("txt") != -1)
        {
          iconPath = "assets/images/chat/notepad-thumb.png";
        }
        if (extension.toLocaleLowerCase().indexOf("html") != -1)
        {
          iconPath = "assets/images/chat/html-thumb.png";
        }
      }
      return iconPath;
    }
    FileSizeInMB(filesize){
      if (filesize != null && filesize!=undefined){

        return  (filesize / (1024*1024)).toFixed(0) ;
      }
     return 0 ;
    }
    FileSize(filesize){
      if (filesize != null && filesize!=undefined){
        if (filesize < 1048576){
          return  ((filesize / (1024)).toFixed(0) + " KB");
        }else{
          return  ((filesize / (1024 * 1024)).toFixed(0) + " MB");
        }

      }
     return 0 ;
    }
    OpenReplyPopup(chat)
    {
      let model_group = document.getElementById("ReplyPopup");
      model_group.classList.add('modal-fade')
      //this.OpenReplyChatPopup.emit(chat);
     this.chatservice.ReplyMessage = chat;
    }
    isChatExist(chat){

      // some code where value of x changes and than you want to check whether it is null or some object with values
      if (chat != null && chat!=undefined)
      {
        if(Object.keys(chat).length){
          return true;
          }
      }
      return false;
    }
}

