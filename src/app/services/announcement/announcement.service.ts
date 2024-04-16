import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/modules/base/base.service';
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(private http:  HttpClient,private apiUrl: ApiService,private baseSerivce: BaseService) { }

  // Get Announcements List
  getAnnouncementsList(apiData) {
    let filterOptions = JSON.stringify(apiData.filterOptions);
    let isArchive = '';
    localStorage.setItem('dashboardAnnouncementFilter', filterOptions);
    if(apiData.announceType == 'archive')  {      
      isArchive = '1';
    }
    else{      
      isArchive = '';
    }
       
    const params = new HttpParams()
      .set('apiKey', apiData.apiKey)
      .set('userId', apiData.userId)
      .set('domainId', apiData.domainId)
      .set('countryId', apiData.countryId)
      .set('pageName', apiData.pageAccess)      
      .set('filterOptions', filterOptions)     
      .set('offset', apiData.offset)
      .set('limit', apiData.limit)
      .set('isArchive', isArchive)
    const body = JSON.stringify(apiData);

    return this.http.post<any>(this.apiUrl.apiManualsAndAnnouncementList(), body, {'params': params})
  }

  // accnouncement detail API
  getAnnouncementDetail(apiData) {
    return this.http.post<any>(this.apiUrl.apiGetAnnouncementDetail(), apiData);
  }

  // accnouncement add like API
  resourceAddLike(apiData) {
    return this.http.post<any>(this.apiUrl.apiResourceAddLike(), apiData);
  }

  // document convert knowledgeartical API
  apiMigrateDoctoKA(apiData) {
    return this.http.post<any>(this.apiUrl.apiMigrateDoctoKA(), apiData);
  }
  
  // announcement dashboard
  announceDashboard(apiData){
    return this.http.post<any>(this.apiUrl.apiLoadAnnounceDashboard(), apiData);
  }

  // announcement Dismiss
  dismissManuals(apiData){
    return this.http.post<any>(this.apiUrl.apiDismissManuals(), apiData);
  }

  // announcement Archive
  archiveAnnouncement(apiData){
    return this.http.post<any>(this.apiUrl.apiArchiveAnnouncements(), apiData);
  }

  // Announcement Push Api
  announcementPush(pushData) {
    return this.http.post<any>(this.apiUrl.apiAnnouncementPush(), pushData);
  }

  // Delate Document
  deleteDocument(data) {
    const params = new HttpParams()
    .set('apiKey', data.apiKey)
    .set('domainId', data.domainId)
    .set('countryId', data.countryId)
    .set('userId', data.userId)
    .set('contentTypeId', data.contentType)
    .set('dataId', data.dataId)
    const body = JSON.stringify(data);

    let apiDatasocial = new FormData();    
            apiDatasocial.append('apiKey', data.apiKey);
            apiDatasocial.append('domainId', data.domainId);
            apiDatasocial.append('threadId', data.dataId);
            apiDatasocial.append('userId', data.userId); 
            apiDatasocial.append('type', '2'); 
            apiDatasocial.append('action', 'delete'); 
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

    return this.http.post<any>(this.apiUrl.apiDeleteDocument(), body, {'params': params})
}

}
