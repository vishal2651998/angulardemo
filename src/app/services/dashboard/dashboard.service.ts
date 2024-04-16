import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiUrl: ApiService, private http:  HttpClient) { }

  // Get Filter Widgets
  getFilterWidgets(data): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('userId', data.userId)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('groupId', data.groupId)
    const body = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl.apiGetDashboardFilterWidgets(), body, {'params': params})
  }
  
  // Get Dashboard Metrics
  dashboardMetrics(dashboardData): Observable<any> {
    localStorage.setItem('dashFilter', JSON.stringify(dashboardData.filterOptions));
    const params = new HttpParams()
      .set('apiKey', dashboardData.apiKey)
      .set('userId', dashboardData.userId)
      .set('domainId', dashboardData.domainId)
      .set('countryId', dashboardData.countryId)
      .set('filterOptions', JSON.stringify(dashboardData.filterOptions))
    const body = JSON.stringify(dashboardData);
    
    return this.http.post<any>(this.apiUrl.apiDashboard(), body, {'params': params})
  };

  // Get Chart Detail Data
  apiChartDetail(chartData): Observable<any> {
    console.log(chartData)
    let storage = chartData.storage;
    switch(storage) {
      case 'dealerFilter':
        let dealerFilter = chartData.filterOptions;
        dealerFilter['searchKey'] = chartData.searchKey;
        localStorage.setItem('dealerFilter', JSON.stringify(dealerFilter));
        break;
      case 'threadFilter':
          localStorage.setItem('threadFilter', JSON.stringify(chartData.filterOptions));
          break;  
      case 'escModelFilter':
        localStorage.setItem('escModelFilter', JSON.stringify(chartData.filterOptions));
        break;
      case 'gtsUsageFilter':
        localStorage.setItem('gtsUsageFilter', JSON.stringify(chartData.filterOptions));
        break;
      case 'escZoneFilter':
        localStorage.setItem('escZoneFilter', JSON.stringify(chartData.filterOptions));
        break;
      case 'serviceFilter':
        let serviceFilter = chartData.filterOptions;
        serviceFilter['searchKey'] = chartData.searchKey;
        localStorage.setItem('serviceFilter', JSON.stringify(serviceFilter));
        break;
      case 'zoneMetricsFilter':
        localStorage.setItem('zoneMetricsFilter', JSON.stringify(chartData.filterOptions));
        break;
      case 'areaActivityFilter':
        localStorage.setItem('areaActivityFilter', JSON.stringify(chartData.filterOptions));
        break;
      case 'userActivityFilter':
        localStorage.setItem('userActivityFilter', JSON.stringify(chartData.filterOptions));
        break;
    }    
    
    const params = new HttpParams()
      .set('api_key', chartData.apiKey)
      .set('userId', chartData.userId)
      .set('domainId', chartData.domainId)
      .set('countryId', chartData.countryId)
      .set('limit', chartData.limit)
      .set('offset', chartData.offset)
      .set('searchKey', chartData.searchKey)
      .set('filterOptions', JSON.stringify(chartData.filterOptions))
    const body = JSON.stringify(chartData);
    return this.http.post<any>(this.apiUrl.apiChartDetail(), body, {'params': params})
  }

//added by karuna for Export ALL
  apiChartDetailAll(chartData_one): Observable<any> {

    //alert(22);
    let chartDatathreadAll=chartData_one;
  /*  chartDatathreadAll.filterOptions.groupId='3.1';
    chartDatathreadAll.filterOptions.startDate="";
    chartDatathreadAll.filterOptions.endDate="";
    chartDatathreadAll.filterOptions.threadType="";
    chartDatathreadAll.filterOptions.limit="";
    chartDatathreadAll.filterOptions.offset="";
    */
    let storage = chartDatathreadAll.storage;
    switch(storage) {
      case 'dealerFilter':
        let dealerFilter = chartDatathreadAll.filterOptions;
        dealerFilter['searchKey'] = chartDatathreadAll.searchKey;
        localStorage.setItem('dealerFilter', JSON.stringify(dealerFilter));
        break;
      case 'threadFilter':
          localStorage.setItem('threadFilter', JSON.stringify(chartDatathreadAll.filterOptions));
          break;  
      case 'escModelFilter':
        localStorage.setItem('escModelFilter', JSON.stringify(chartDatathreadAll.filterOptions));
        break;
      case 'escZoneFilter':
        localStorage.setItem('escZoneFilter', JSON.stringify(chartDatathreadAll.filterOptions));
        break;
      case 'serviceFilter':
        let serviceFilter = chartDatathreadAll.filterOptions;
        serviceFilter['searchKey'] = chartDatathreadAll.searchKey;
        localStorage.setItem('serviceFilter', JSON.stringify(serviceFilter));
        break;
      case 'zoneMetricsFilter':
        localStorage.setItem('zoneMetricsFilter', JSON.stringify(chartDatathreadAll.filterOptions));
        break;
      case 'areaActivityFilter':
        localStorage.setItem('areaActivityFilter', JSON.stringify(chartDatathreadAll.filterOptions));
        break;
      case 'userActivityFilter':
        localStorage.setItem('userActivityFilter', JSON.stringify(chartDatathreadAll.filterOptions));
        break;
    }    
    //alert(1);
    const params = new HttpParams()
   
      .set('api_key', chartDatathreadAll.apiKey)
      .set('userId', chartDatathreadAll.userId)
      .set('domainId', chartDatathreadAll.domainId)
      .set('countryId', chartDatathreadAll.countryId)
      .set('limit', chartDatathreadAll.limit)
      .set('offset', chartDatathreadAll.offset)
      .set('searchKey', chartDatathreadAll.searchKey)
      .set('exportAll', chartDatathreadAll.exportAll)
      .set('exportLazy', chartDatathreadAll.exportLazy)
      .set('filterOptions', JSON.stringify(chartDatathreadAll.filterOptions))
    const body = JSON.stringify(chartDatathreadAll);

   //222 alert(222);
    return this.http.post<any>(this.apiUrl.apiChartDetail(), body, {'params': params})
  }

  // Geographical Lists
  geoGraphicalData(geoData) {
    const params = new HttpParams()    
    .set('apiKey', geoData.apiKey)
      .set('userId', geoData.userId)
      .set('domainId', geoData.domainId)
      .set('countryId', geoData.countryId)
      .set('zoneValue', geoData.zoneValue)
      .set('areaValue', geoData.areaValue)
      .set('territoryValue', geoData.territoryValue)
      const body = JSON.stringify(geoData);
      return this.http.post<any>(this.apiUrl.apiGeoList(), body, {'params': params})
  }

  // Export Dealer Activity Data
  exportDealerActivity(dealerData) {
    const params = new HttpParams()
    .set('api_key', dealerData.apiKey)
    .set('userId', dealerData.userId)
    .set('domainId', dealerData.domainId)
    .set('countryId', dealerData.countryId)
    .set('month', dealerData.month)
    const body = JSON.stringify(dealerData);
    return this.http.post<any>(this.apiUrl.apiExportDealerActivity(), body, {'params': params})
  }
   // Get Roles and Permissions

   getRolesAndPermissions(data) {
    let contentTypeId = (data.contentTypeId) ? data.contentTypeId : '';
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('userId', data.userId)
      .set('domainId', data.domainId)
      .set('roleId', data.roleId)
      .set('contentTypeId', contentTypeId)
    return this.http.get<any>(this.apiUrl.apiRolesAndPermissions(), { 'params': params });
  }

  // Update Roles and Permissions
  updateRolesAndPermissions(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('userId', data.userId)
      .set('domainId', data.domainId)
      .set('accessUpdate', data.accessUpdate)
    const body = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl.updateApiRolesAndPermissions(), body, { 'params': params });
  }


}
