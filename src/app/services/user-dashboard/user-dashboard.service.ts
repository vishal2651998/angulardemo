import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  constructor(private http: HttpClient, private apiUrl: ApiService) { }
  getUserProfile(userData): Observable<any> {
    const params = new HttpParams()
      .set('api_key', userData.api_key)
      .set('user_id', userData.user_id)
    if (userData.domain_id) {
      params.set('domain_id', userData.domain_id)
    }
    const body = JSON.stringify(userData);

    return this.http.post<any>(this.apiUrl.apiUserProfile(), body, { 'params': params })
  }

  getWorkstreamLists(userData) {
    return this.http.post<any>(this.apiUrl.apiGetWorkstreamLists(), userData)
  }

  getuserlist(userData) {
    return this.http.post<any>(this.apiUrl.apigetUserListDashboard(), userData)
  }

  getDomainListDashboard(userData) {
    return this.http.post<any>(this.apiUrl.apigetDomainListDashboard(), userData)
  }


  UpdateUserScrollPopup(userData) {
    return this.http.post<any>(this.apiUrl.apiUpdateUserScrollPopup(), userData)
  }



  updateuserdashstatus(userData) {
    return this.http.post<any>(this.apiUrl.apiUpdateUserDashstatus(), userData)
  }

  DeleteUserAccount(userData) {
    return this.http.post<any>(this.apiUrl.apiDeleteAccountUserInfo(), userData)
  }

  saveAssigneeRoles(userData) {
    return this.http.post<any>(this.apiUrl.apiSaveAssigneeRoles(), userData)
  }

  getmanagersListbyDomain(userData) {
    return this.http.post<any>(this.apiUrl.apiGetUserManagersList(), userData)
  }

  updateuserpassbyAdmin(userData) {
    return this.http.post<any>(this.apiUrl.apiUpdateUserpasswordbyAdmin(), userData)
  }

  updateuserInfobyAdmin(userData) {
    return this.http.post<any>(this.apiUrl.apiupdateuserInfobyAdmin(), userData)
  }

  AddInviteUserbyAdmin(userData) {
    return this.http.post<any>(this.apiUrl.apiAddInviteUserbyAdmin(), userData)
  }

  Checkemailstatus(userData) {
    return this.http.post<any>(this.apiUrl.apiCheckemailstatus(), userData)
  }

  GetuserExportAll(userData) {
    return this.http.post<any>(this.apiUrl.apiGetuserExportAll(), userData)
  }

  GetThreadExportAll(userData) {
    return this.http.post<any>(this.apiUrl.apiGetuserExportThread(), userData)
  }

  GetallThreadExportData(userData) {
    return this.http.post<any>(this.apiUrl.apiGetallThreadExportData(), userData)
  }


}
