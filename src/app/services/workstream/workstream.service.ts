import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkstreamService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  // Get Workstream Detail
  getWorkstreamDetail(wsData) {
    let wsId = (wsData.action == 'new') ? '' : wsData.workstreamId;
    const params = new HttpParams()
      .set('apiKey', wsData.apiKey)
      .set('userId', wsData.userId)
      .set('domainId', wsData.domainId)
      .set('countryId', wsData.countryId)
      .set('workstreamId', wsId)
    const body = JSON.stringify(wsData);

    return this.http.post<any>(this.apiUrl.apiGetWorkstreamDetail(), body, {'params': params})
  }

  // Get Workstream Detail
  getCategoryDetail(wsData) {
    return this.http.post<any>(this.apiUrl.apiGetCategoryDetail(), wsData)
  }

  // Get Workstream Users
  getWorkstreamUsers(userData) {
    let wsId = (userData.action == 'new') ? '' : userData.workstreamId;
    let params = new HttpParams()
      .set('apiKey', userData.apiKey)
      .set('userId', userData.userId)
      .set('domainId', userData.domainId)
      .set('countryId', userData.countryId)
      .set('workstreamId', wsId)
      .set('searchKey', userData.searchKey)
      .set('limit', userData.limit)
      .set('offset', userData.offset)
      .set('type', userData.type)    
      if (userData.techSupport !=  undefined) {
        params = params.append('techSupport', userData.techSupport)
      }
      const body = JSON.stringify(userData);
      return this.http.post<any>(this.apiUrl.apiGetWorkstreamUsers(), body, {'params': params})
  }

  // Check Workstream Name Exists
  checkWorkstreamName(wsData) {
    return this.http.post<any>(this.apiUrl.apiCheckWorkstreamName(), wsData)
  }

  // New Workstream
  newWorkstream(workstreamData) {
    return this.http.post<any>(this.apiUrl.apiNewWorkstream(), workstreamData)
  }

  // Save Workstream
  saveWorkstream(workstreamData) {
    return this.http.post<any>(this.apiUrl.apiSaveWorkstream(), workstreamData)
  }

  // Delete Workstream
  deleteWorkstream(workstreamData) {
    const params = new HttpParams()
      .set('apiKey', workstreamData.apiKey)
      .set('userId', workstreamData.userId)
      .set('domainId', workstreamData.domainId)
      .set('countryId', workstreamData.countryId)
      .set('workstreamId', workstreamData.workstreamId)
      .set('searchKey', workstreamData.notifyUsers)
      const body = JSON.stringify(workstreamData);

    return this.http.post<any>(this.apiUrl.apiDeleteWorkstream(), body, {'params': params})    
  }

}