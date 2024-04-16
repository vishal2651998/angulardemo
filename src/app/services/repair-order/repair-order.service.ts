import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RepairOrderService {

  constructor( private http: HttpClient,private apiUrl: ApiService) { }

  // get SupportTicketsList
  getSupportTicketsList(data) {
    return this.http.post<any>(this.apiUrl.apiGetSupportTicketsList(), data);
  }  
  
  // woo complete order
  wooCompleteSupportTicket(data) {
    return this.http.post<any>(this.apiUrl.apiWooCompleteSupportTicket(), data);
  }

  // complete order
  completeSupportTicket(data) {
    return this.http.post<any>(this.apiUrl.apiCompleteSupportTicket(), data);
  }
   // delete
   deleteSupportTicketsList(data) {
    return this.http.post<any>(this.apiUrl.apiDeleteSupportTicketsList(), data);
  }
   // get SupportTicketsList
   updateSupportTicketsList(data) {
    return this.http.post<any>(this.apiUrl.apiUpdateSupportTicketsList(), data);
  }
  // getWorkOrderList
  getWorkOrderList(data) {
    return this.http.post<any>(this.apiUrl.apiGetWorkOrderList(), data);
  }
  // getJOBDetailsList
  getJOBDetailsList(data) {
    return this.http.post<any>(this.apiUrl.apiGetJOBDetailsList(), data);
  }
  // updateJOBDetailsList
  updateJOBDetailsList(data) {
    return this.http.post<any>(this.apiUrl.apiUpdateJOBDetailsList(), data);
  }
  // getRateCardList
  getRateCardList(data) {
    return this.http.post<any>(this.apiUrl.apiGetRateCardList(), data);
  }
  // updatRateCardList
  updatRateCardList(data) {
    return this.http.post<any>(this.apiUrl.apiUpdatRateCardList(), data);
  }
}

