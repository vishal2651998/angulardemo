import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartsService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  // Get Parts List
  getPartsList(partsData) {
    let filterOptions = JSON.stringify(partsData.filterOptions);
    console.log(filterOptions)
    if(partsData.accessFrom == 'parts' ) {
      localStorage.setItem('partFilter', filterOptions);
    }    
    const params = new HttpParams()
      .set('apiKey', partsData.apiKey)
      .set('userId', partsData.userId)
      .set('domainId', partsData.domainId)
      .set('countryId', partsData.countryId)
      .set('partStatus', partsData.partStatus)
      .set('searchKey', partsData.searchKey)
      .set('fromSearch', partsData.fromSearch)
      .set('threadIdArray', partsData.threadIdArray)
      .set('priorityIndex', partsData.priorityIndex)
      .set('threadCount', partsData.threadCount)
      
      .set('filterOptions', filterOptions)
      .set('publishStatus', partsData.publishStatus)
      .set('type', partsData.type)
      .set('offset', partsData.offset)
      .set('limit', partsData.limit)
    const body = JSON.stringify(partsData);
    if(partsData.searchKey != undefined){
      return this.http.post<any>(this.apiUrl.apiGetPartsList(), body, {'params': params})
    }
      
  }

  // Get Part Attribute Info
  getPartBaseInfo(partData) {
    return this.http.post<any>(this.apiUrl.apiGetPartBaseInfo(), partData)
  }

  // Get Parts Detail
  getPartsDetail(partsData) {
    const params = new HttpParams()
      .set('apiKey', partsData.apiKey)
      .set('userId', partsData.userId)
      .set('domainId', partsData.domainId)
      .set('countryId', partsData.countryId)
      .set('partId', partsData.partId)
    const body = JSON.stringify(partsData);

    return this.http.post<any>(this.apiUrl.apiGetPartsDetail(), body, {'params': params})
  }

  // Get Parts Detail
  CheckPartNoIsExist(partsData) {
    return this.http.post<any>(this.apiUrl.apiCheckPartNoIsExist(), partsData)

   
  }

  // Manage Parts Create or Edit
  manageParts(partData) {
    return this.http.post<any>(this.apiUrl.apiManageParts(), partData)
  }

  // Get Models By Make
  getModels(data) {
    let emissionsVal = data.emissionValues != undefined ? data.emissionValues : '';
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('threadType', data.threadType)
      .set('searchKey', data.searchText)
      .set('make', data.make)
      .set('emissionValues', emissionsVal)
      
    const body = JSON.stringify(data);

    return this.http.get<any>(this.apiUrl.apiGetModels(), {'params': params})
  }

  // Update Part Status
  updatePartStatus(partData) {
    return this.http.post<any>(this.apiUrl.apiUpdatePartStatus(), partData)
  }

  // Get Recent Part View Lists
  recentPartViews(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('offset', data.offset)
      .set('limit', data.limit)
      .set('partId', data.partId)
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiRecentPartViews(), body, {'params': params});
  }

  // Like & Pin Actions
  likePinAction(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('threadId', data.threadId)
      .set('postId', data.postId)
      .set('ismain', data.ismain)
      .set('status', data.status)
      .set('type', data.type)
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiLikePinAction(), body, {'params' : params});
  }

  // Delate Part
  deletePart(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('contentTypeId', data.contentType)
      .set('dataId', data.partId)
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiDeletePart(), body, {'params': params})
  }
}
