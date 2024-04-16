import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  constructor(private http: HttpClient, private apiUrl: ApiService) { }

  sendPaymentDetail(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiSendPaymentDetail(), paymentData)
  }

  sendManualPaymentDetail(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiSendManualPaymentDetail(), paymentData)
  }

  sendPaymentDetailByCheck(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiSendPaymentDetailByCheck(), paymentData)
  }

  sendManualPaymentDetailByCheck(paymentData: any) {
    // return this.http.post<any>(this.apiUrl.apiSendPaymentDetailByCheck(), paymentData)
  }
  
  sendCartPaymentDetail(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiSendCartPaymentDetail(), paymentData)
  }
  
  sendCartOrderDetail(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiSendCartOrderDetail(), paymentData)
  }
}
