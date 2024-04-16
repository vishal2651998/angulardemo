import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor( private http: HttpClient,private apiUrl: ApiService) { }

  // get user profile 
  getUserProfile(profileData) {
    return this.http.post<any>(this.apiUrl.apiGetUserProfile(), profileData);
  }

  // update profile 
  updateUserProfile(profileData) {
    return this.http.post<any>(this.apiUrl.apiUpdateUserProfile(), profileData);
  }

  // update stagename 
  updateStagename(profileData) {
    return this.http.post<any>(this.apiUrl.apiUpdateStagename(), profileData);
  }
  
  // get matrics 
  getProfileMetrics(profileData) {
    return this.http.post<any>(this.apiUrl.apiGetProfileMetrics(), profileData);
  }

  // get certifications 
  getCertificationList(profileData) {
    return this.http.post<any>(this.apiUrl.apiGetCertificationList(), profileData);
  }

  // select user certifications 
  selectUserCertificationList(profileData) {
    return this.http.post<any>(this.apiUrl.apiSelectUserCertificationList(), profileData);
  }

   // save user certifications 
   saveUserCertificationList(profileData) {
    return this.http.post<any>(this.apiUrl.apiSaveUserCertificationList(), profileData);
  }

  // followers and following user list
  getuserFollowerFollowing(profileData) {
    return this.http.post<any>(this.apiUrl.apiGetuserFollowerFollowing(), profileData);
  }

  // action follow/unfollow
  userFollowMethod(profileData) {
    return this.http.post<any>(this.apiUrl.apiUserFollowMethod(), profileData);
  }
 
    
}
