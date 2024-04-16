import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { ChatAttachment } from 'src/app/models/chatmodel';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private serverUrl: string;
  public uploadFlag: any = null;

  constructor(
    private httpClient: HttpClient,
    private api: ApiService,
  ) { }

  // Upload File
  upload(access, fileInfo, file: File) {
    console.log(access)
    console.log(fileInfo)
    console.log(file)
    const mformData: FormData = new FormData();
    const formData: FormData = new FormData();
    formData.append('apiKey', fileInfo.apiKey);
    formData.append('domainId', fileInfo.domainId);
    formData.append('countryId', fileInfo.countryId);
    formData.append('userId', fileInfo.userId);
    if(access != 'userprofile-page'){
    formData.append('contentId', fileInfo.contentId);
    formData.append('workstreamId', fileInfo.workstreamId);
    formData.append('uploadByAuthor', fileInfo.uploadByAuthor);
    formData.append('userInputId', fileInfo.userInputId);
    }
    let uploadType = (fileInfo.uploadType == undefined || fileInfo.uploadType == 'undefined') ? 'upload' : fileInfo.uploadType;
    fileInfo.displayOrder = (fileInfo.displayOrder == undefined || fileInfo.displayOrder == 'undefined') ? 0 : fileInfo.displayOrder;
    if(access != 'module' && access != 'adas' && access != 'dtc' && access != 'escalation-export') {
      let defaultLanguage = JSON.parse(localStorage.getItem('defaultLanguage'));
      let langId = (access != 'media' && fileInfo.filteredLangItems.length > 0) ? fileInfo.filteredLangItems : (defaultLanguage && defaultLanguage.length>0 && defaultLanguage[0].id) ? [defaultLanguage[0].id] : [0];
      let caption = fileInfo.fileCaption;
      fileInfo.fileCaption = (caption == undefined || caption == 'undefined') ? '' : caption;

      formData.append('uploadCount', fileInfo.uploadCount);
      formData.append('uploadFlag', fileInfo.uploadFlag);
      formData.append('type', fileInfo.fileType)
      formData.append('caption', fileInfo.fileCaption);
      formData.append('linkUrl', fileInfo.linkUrl);
      formData.append('mediaId', fileInfo.mediaId);
      formData.append('isVideoCompressed', fileInfo.isVideoCompressed);
      if(access != 'userprofile-page'){
        formData.append('threadId', fileInfo.threadId);
      }      
      formData.append('directAttachment', fileInfo.directAttachment);
      if(access != 'userprofile-page'){
      formData.append('postStatus', fileInfo.postStatus);
      }
      formData.append('flagId', fileInfo.flagId);
      if(access != 'userprofile-page'){
      formData.append('postType', fileInfo.postType);
      }
      formData.append('fileDuration', fileInfo.fileDuration);
      formData.append('compressionType', fileInfo.compressionType);
      formData.append('displayOrder', fileInfo.displayOrder);
      formData.append('language', JSON.stringify(langId));
      if(access == 'gtsr') {
        formData.append('procedureId', fileInfo.procedureId);
        formData.append('processId', fileInfo.processId);
        formData.append('gtsId', fileInfo.gtsId);
      }
    }
    

    if(uploadType == 'audio') {
      formData.append('flagId', fileInfo.flagId);
      formData.append('fileDuration', fileInfo.fileDuration);
    }

    if(access == 'dtc') {
      formData.append('action', fileInfo.action);
      formData.append('type', fileInfo.type);
      formData.append('type_name', fileInfo.typeName);
      formData.append('type_id', fileInfo.typeId);
    }

    if(access == 'workorder') {
      formData.append('threadId', fileInfo.threadId);
      formData.append('postId', fileInfo.postId);
      formData.append('workOrderId', fileInfo.workOrderId);
    }

    if(access == 'workorder-page') {
      formData.append('workOrderId', fileInfo.workOrderId);
      if(fileInfo.approvedFlag=='1' && fileInfo.threadId != undefined )
          {
            formData.append('threadId', fileInfo.threadId);
          }
      
    }

    if(access == 'welcome-message') {
      formData.append('fromWelcomeMessage', fileInfo.fromWelcomeMessage);
    }

    if(access == 'module' || access == 'adas') {
      mformData.set('apikey', fileInfo.apiKey);
      mformData.set('domainId', fileInfo.domainId);
      mformData.set('userId', fileInfo.userId);
      mformData.set('apikey', fileInfo.apiKey);
      mformData.set('action', fileInfo.action);
      mformData.set('type', fileInfo.type);
      mformData.set('typeId', fileInfo.typeId);
      mformData.set('deleteFlag', fileInfo.deleteFlag);
      mformData.append('file', file);
    }
    
    formData.append('platform', '3');
    
    if(fileInfo.type != 'link') {
      formData.append('file', file);
    } else {
      formData.append('linkUrl', fileInfo.url)
    }

    switch (access) {
      case 'media':
        formData.append('workstreams', fileInfo.workstreams);
        this.serverUrl = this.api.apiGetMediaUploadURL();
        return this.fileUpload(formData);
        break;
      case 'dtc':
        this.serverUrl = this.api.apiGetCreateDTC();
        return this.fileUpload(formData);
        break;
      case 'escalation-export':
        //this.serverUrl = this.api.apiEscalationDealerImport();
        this.serverUrl = this.api.apiEscalationDealerImportValidate();
        return this.fileUpload(formData);
        break;
      case 'module':
      case 'adas':  
        this.serverUrl = this.api.apiRepairifyImport();
        return this.fileUpload(mformData);
        break;  
      case 'userprofile-page':  
      this.serverUrl = this.api.uploadAttachmentForRuntime();
      formData.append('dataId', fileInfo.dataId);
      formData.append('contentTypeId', fileInfo.contentType);
      return this.fileUpload(formData);
      break; 
      default:  
        this.serverUrl = this.api.apiGetUploadURL();
        formData.append('dataId', fileInfo.dataId);
        formData.append('contentTypeId', fileInfo.contentType);
        return this.fileUpload(formData);
        break;
    }
  }

  // File Upload
  fileUpload(formData) {
    /*const request = new HttpRequest('POST', `${this.serverUrl}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.httpClient.request(request).pipe(
      map((event: HttpEvent<any>) => this.getEventMessage(event)));
    */

    //this.serverUrl = 'http://localhost/Projects/test-api/upload.php';
      
    return this.httpClient.post(`${this.serverUrl}`, formData, {
      reportProgress: true,
      headers: new HttpHeaders({ "Accept": "application/json" }),
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    // We are now getting events and can do whatever we want with them!
    console.log(event);
    return event;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // Get Files
  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.serverUrl}/files`);
  }
  

  uploadChatAttachment( attachment:ChatAttachment, file: File) {
    console.log(attachment)
    console.log(file)
    const formData: FormData = new FormData();
    formData.append('apiKey', attachment.apiKey);
    formData.append('domainId', attachment.domainId);
    formData.append('countryId', attachment.countryId);
    formData.append('chatType', attachment.chatType);
    formData.append('userId', attachment.userId);
    formData.append('workStreamId', attachment.workStreamId);
    formData.append('type', attachment.type);
    formData.append('caption', attachment.caption)
    formData.append('chatGroupId', attachment.chatGroupId);
    formData.append('chatType', attachment.chatType);
    formData.append('file', file);
    formData.append('sendpush', attachment.sendpush);
    formData.append('messageId', attachment.messageId);
    formData.append('messageType', attachment.messageType);
    formData.append("localTimeStamp", moment().format('YYYY-MM-DD H:m:s'));
    formData.append("localTimeZone", momentTimeZone.tz(momentTimeZone.tz?.guess()).zoneAbbr());
    this.serverUrl = this.api.apiGetChatUploadURL();

    return this.httpClient.post(`${this.serverUrl}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }
}
