import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseService {

  constructor( private http:  HttpClient,private apiUrl: ApiService ) { }

  // Get Parts List
  getKnowledgeBaseList(kbData, formData) {

    let filterOptions = JSON.stringify(kbData.filterOptions);
    console.log(filterOptions)
    if(kbData.accessFrom == 'knowledge-base' ) {
      localStorage.setItem('knowledgeBaseFilter', filterOptions);
    }  

    return this.http.post<any>(this.apiUrl.apiGetKnowledgeBaseList(), formData);
    
  }

  // Kanowledge Base Creation API
  createKB(kbData) {
    return this.http.post<any>(this.apiUrl.apiCreateKB(), kbData);
  }

  // Kanowledge Base View API
  viewKB(kbData) {
    return this.http.post<any>(this.apiUrl.apiViewKB(), kbData);
  }

  // Kanowledge Base View API
  deleteKB(kbData) {
    return this.http.post<any>(this.apiUrl.apiDeleteKB(), kbData);
  }

  // Knowledge Base PIN API
  socialActionKB(kbData) {
    return this.http.post<any>(this.apiUrl.apiSocialActionKB(), kbData);
  }

  // Knowledge Base Push Api
  pushKB(pushData) {
    return this.http.post<any>(this.apiUrl.apiThreadPush(), pushData);
  }

  
}
