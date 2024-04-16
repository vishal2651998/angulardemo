import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApiService } from './api/api.service';
@Injectable({
  providedIn: 'root'
})
export class UserActivitiesService {
  offset: number = 0;
  limit: number = 30;

  startDate = moment().local().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
  endDate = moment().local().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
  sortBy: any = 1;

  constructor(private http: HttpClient, private apiUrl: ApiService) { }

  getUserActivitiesChartData(userActivitiesData): Observable<any> {
    let params = new HttpParams()
      .set('apiKey', userActivitiesData.apiKey)
      .set('userId', userActivitiesData.userId)
      .set('startMonth', userActivitiesData.startDate)
      .set('endMonth', userActivitiesData.endDate)
      .set('sortOrder', userActivitiesData.sortBy)
      .set('domainId', userActivitiesData.domainId)
      .set('offset', userActivitiesData.offset)
    if (userActivitiesData.limit) {
      params = params.append('limit', userActivitiesData.limit)
    }
    return this.http.post<any>(this.apiUrl.apiUserActivities(), params, {'params': params })
  }
}
