import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SibService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  // Get SIB List
  getSibList(sibData, formData) {
    let filterOptions = JSON.stringify(sibData.filterOptions);
    console.log(sibData, filterOptions)
    if(sibData.accessFrom == 'sib' ) {
      localStorage.setItem('sibFilter', filterOptions);
    }    
    if(sibData.searchKey != undefined){
      return this.http.post<any>(this.apiUrl.apiGetSibLists(), formData);
    }    
  }

  // SIB Creation API
  createSIB(sibData) {
    return this.http.post<any>(this.apiUrl.apiCreateSIB(), sibData);
  }
  
  // Get SIB Detail
  getSibDetail(sibData) {
    return this.http.post<any>(this.apiUrl.apiGetSibDetail(), sibData);
  }

  // Delate SIB
  deleteSib(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('userId', data.userId)
      .set('contentTypeId', data.contentType)
      .set('sibId', data.sibId)
      .set('sibActionId', data.sibActionId)
      .set('sibFrameNoId', data.sibFrameNoId)
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiDeleteSib(), body, {'params': params})
  }

  // Like & Pin Actions
  likePinAction(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('userId', data.userId)
      .set('sibId', data.sibId)
      .set('postId', data.postId)
      .set('ismain', data.ismain)
      .set('status', data.status)
      .set('type', data.type)
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiSibLikePinAction(), body, {'params' : params});
  }
}
