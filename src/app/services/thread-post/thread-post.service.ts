import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThreadPostService {
  constructor(private http: HttpClient, private apiUrl: ApiService) {}

  // Thread detail API
  getthreadDetailsios(threadData,partsData={}) {

   let  platformId=localStorage.getItem('platformId');
   let viewnewpage = localStorage.getItem('view-v2');  
   if(((platformId=='1' || platformId=='2') && viewnewpage == '1'))
   {
    
  const body = JSON.stringify(partsData);
   
    return this.http.post<any>(this.apiUrl.apiSolrThreadDetail(), body)
   }
   else
   {
    return this.http.post<any>(
      this.apiUrl.apiGetthreadDetailsios(),
      threadData
    );
   }
   
  }
  
  getthreadDetailsiosDefault(threadData,partsData={}) {
  return this.http.post<any>(
    this.apiUrl.apiGetthreadDetailsios(),
    threadData
  );
  }

  getthreadDetailsFixes(partsData) {

    let  platformId=localStorage.getItem('platformId');
   let viewnewpage = localStorage.getItem('view-v2');  
   if(((platformId=='1' || platformId=='2') && viewnewpage == '1'))
    {
     
   const body = JSON.stringify(partsData);
    
     return this.http.post<any>(this.apiUrl.apiSolrThreadDetailFixList(), body)
    }

  }

  AtomicUpdateSolr(threadData) {
    return this.http.post<any>(
      this.apiUrl.apiAtomicUpdateSolr(),
      threadData
    );
  }

  // Post list API
  getPostListAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiPostList(), threadData);
  }

  // new post
  newReplyPost(threadData) {
    return this.http.post<any>(this.apiUrl.apiReplyPost(), threadData);
  }

   // saveTechSupportPresets
   saveTechSupportPresets(threadData) {
    return this.http.post<any>(this.apiUrl.apiSaveTechSupportPresets(), threadData);
  }

  // saveTechSupportPresets
  presetList(threadData) {
    return this.http.post<any>(this.apiUrl.apiPresetList(), threadData);
  }

  // update post
  updateReplyPost(threadData) {
    return this.http.post<any>(this.apiUrl.apiUpdatePost(), threadData);
  }

  // close thread
  closeThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiCloseThread(), threadData);
  }

  validateCloseThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiValidateCloseThread(), threadData);
  }

  getAllTagUsersList(threadData) {
    return this.http.post<any>(this.apiUrl.apigetAllTagUsersList(), threadData);
  }

  updateTagUsersList(threadData) {
    return this.http.post<any>(this.apiUrl.apiupdateTagUsersList(), threadData);
  }

  // reopen thread
  reopenThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiReopenThread(), threadData);
  }

  // delete thread/post
  deleteThreadPostAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiDeleteThreadPost(), threadData);
  }

  // delete thread/post
  solutionStatusAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiSolutionStatusAPI(), threadData);
  }

  // reopen thread
  addLikePinOnePlus(threadData) {
    return this.http.post<any>(this.apiUrl.apiAddLikePinOnePlus(), threadData);
  }

  // Send Reminder (MOBILE PUSH)
  sendPushtoMobileAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiSendPushtoMobile(), threadData);
  }

  // Add Reminder
  addReminderAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiAddReminder(), threadData);
  }

  // Send Reminder (MOBILE PUSH)
  sendReminderAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiSendReminder(), threadData);
  }

  // Thread and post dashboard users
  dashboardUsersListAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiDashboardUsersList(), threadData);
  }

   // reopen thread
   manualEscalationActionAPI(threadData) {
    return this.http.post<any>(this.apiUrl.apiManualEscalationAction(), threadData);
  }
}
