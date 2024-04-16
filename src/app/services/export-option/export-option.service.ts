import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportOptionService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }
  getUserProfile(userData): Observable<any> {
    const params = new HttpParams()
      .set('api_key', userData.api_key)
      .set('user_id', userData.user_id)
      .set('domain_id', userData.domain_id)
    const body = JSON.stringify(userData);

    return this.http.post<any>(this.apiUrl.apiUserProfile(), body, {'params': params})
  }
  
  GetThreadExportAll(userData) {
    return this.http.post<any>(this.apiUrl.apiGetuserExportThread(), userData)
  }

  
  GetallThreadExportData(userData) {
    return this.http.post<any>(this.apiUrl.apiGetallThreadExportData(), userData)
  }
}
