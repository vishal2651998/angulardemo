import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  // Get Filter Widgets
  getFilterWidgets(filterData):Observable<any> {
    let flag = (filterData.historyFlag == undefined || filterData.historyFlag == 'undefined') ? '' : filterData.historyFlag;
    let filterOptions = (filterData.access == undefined || filterData.access == 'undefined') ? [] : filterData.filterOptions;
    const params = new HttpParams()
      .set('apiKey', filterData.apiKey)
      .set('userId', filterData.userId)
      .set('domainId', filterData.domainId)
      .set('countryId', filterData.countryId)
      .set('groupId', filterData.groupId)
      .set('filterOptions', filterOptions)
      .set('historyFlag', flag)
      .set('version', filterData.version)
    const body = JSON.stringify(filterData);

    return this.http.post(this.apiUrl.apiGetFilterWidgets(), body, {'params': params})
  }

  // Manage Filter Settings
  manageFilterSettings(filteredData) {
    return this.http.post<any>(this.apiUrl.apiManageFilterSettings(), filteredData)
  }

}
