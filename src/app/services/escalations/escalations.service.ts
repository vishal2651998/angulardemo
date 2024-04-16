import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class EscalationsService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  // Get Escalation API
  getEscalationLists(escData) {
    let filterOptions = JSON.stringify(escData.filterOptions);
    localStorage.setItem('escalationFilter', filterOptions);
    
    const params = new HttpParams()
    .set('apiKey', escData.apiKey)
    .set('userId', escData.userId)
    .set('domainId', escData.domainId)
    .set('countryId', escData.countryId)
    .set('type', escData.type)
    .set('searchKey', escData.searchKey)
    .set('filterOptions', filterOptions)
    .set('offset', escData.offset)
    .set('limit', escData.limit)
    .set('historyFlag', escData.historyFlag)
    const body = JSON.stringify(escData);

    return this.http.post<any>(this.apiUrl.apiGetEscalationLists(), body, {'params': params});
  }

  // Get Escalation API
  getEscalationListsPPFR(escData) {
    let filterOptions = JSON.stringify(escData.filterOptions);
    localStorage.setItem('escalationPPFRFilter', filterOptions);
    
    const params = new HttpParams()
    .set('apiKey', escData.apiKey)
    .set('userId', escData.userId)
    .set('domainId', escData.domainId)
    .set('countryId', escData.countryId)
    .set('type', escData.type)
    .set('searchKey', escData.searchKey)
    .set('filterOptions', filterOptions)
    .set('offset', escData.offset)
    .set('limit', escData.limit)
    .set('historyFlag', escData.historyFlag)
    const body = JSON.stringify(escData);

    return this.http.post<any>(this.apiUrl.apiGetEscalationListsPPFR(), body, {'params': params});
  }

  // Save Escalation API
  saveEscalation(escData) {
    return this.http.post<any>(this.apiUrl.apiSaveEscalation(), escData);
  }

  UpdateDealerEscalationData(escData) {
    return this.http.post<any>(this.apiUrl.apiEscalationDealerImportValidateV3(), escData);
  }
  getEscalationColumns(apiData) {
    return this.http.post<any>(this.apiUrl.apigetEscalationColumns(), apiData)
  }
  GetProductEscalation(apiData) {
    return this.http.post<any>(this.apiUrl.apiGetEmployeeEscalation(), apiData)
  }

  SaveProductEscalationData(apiData) {
    return this.http.post<any>(this.apiUrl.apiupdateEscalationData(), apiData)
  }
  SaveProductEscalationDataV2(apiData) {
    return this.http.post<any>(this.apiUrl.apiupdateEscalationDataV2(), apiData)
  }
  
  getAllEscalationUsers(apiData) {
    return this.http.post<any>(this.apiUrl.apiGetAllEscalationUsers(), apiData)
  }

  // get es-model list
  getEscalationLookupTableData(apiData) {
    return this.http.post<any>(this.apiUrl.apigetEscalationLookupTableData(), apiData);
  }
  
  // get escalation detail api
  getEscalateThreadDetails(escData){
    return this.http.post<any>(this.apiUrl.apiGetEscalateThreadDetails(), escData);
  }
  
  // Escalation Notification API
  escalationNotify(escData) {
    const params = new HttpParams()
    .set('apiKey', escData.apiKey)
    .set('userId', escData.userId)
    .set('domainId', escData.domainId)
    .set('countryId', escData.countryId)
    .set('equipmentNo', escData.equipmentNo)
    .set('type', escData.type)
    .set('newMembers', escData.newMembers)
    .set('sendEmail', escData.sendEmail)
    const body = JSON.stringify(escData);

    return this.http.post<any>(this.apiUrl.apiEscalationNotify(), body, {'params': params});
  }

  // Save PPFR
  savePPFRFormDataAPI(escData) {
    return this.http.post<any>(this.apiUrl.apiSavePPFRFormData(), escData);
  }

  // get dealer area and dea;er code
  
  getUsagemetricsfiltercontent(escData) {
    return this.http.post<any>(this.apiUrl.apiUsagemetricsfiltercontent(), escData);
  }

  // get Escalation Data list
  getEscalationConfigData(apiData) {
    return this.http.post<any>(this.apiUrl.apigetEscalationConfigData(), apiData);
  }

   // get Escalation Data list
   getAlertEscalationConfigData(apiData) {
    return this.http.post<any>(this.apiUrl.apigetAlertEscalationConfigData(), apiData);
  }
}
