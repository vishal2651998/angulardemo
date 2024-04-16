import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductMatrixService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  getUserProfile(userData): Observable<any> {
    const params = new HttpParams()
      .set('api_key', userData.api_key)
      .set('user_id', userData.user_id)
      .set('domain_id', userData.domain_id)
      .set('countryId', userData.countryId)
    const body = JSON.stringify(userData);

    return this.http.post<any>(this.apiUrl.apiUserProfile(), body, {'params': params})
  }

// Get profile status
GetUserAvailability(probingData) {
  return this.http.post<any>(this.apiUrl.apiGetUserAvailability(), probingData)
}

  // Get Product Matrix Lists
  fetchProductLists(probingData) {
    return this.http.post<any>(this.apiUrl.apiGetProductLists(), probingData)
  }

  // Active or Deactive Product Matrix
  actionProductMatrix(matrixIds) {
    return this.http.post<any>(this.apiUrl.apiActionProductMatrix(), matrixIds)
  }

  // Check Model Exists
  checkModelExists(matrixData) {
    return this.http.post<any>(this.apiUrl.apiCheckModelExists(), matrixData)
  }

   //  Model Auto Complete
   checkModelAutoComplete(matrixData) {
    return this.http.post<any>(this.apiUrl.apicheckModelAutoComplete(), matrixData)
  }

  // Add or Save Product Matrix
  manageMatrix(matrixData) {
    return this.http.post<any>(this.apiUrl.apiManageProductMatrix(), matrixData)
  }

  // Get Product Make Lists
  fetchProductMakeLists(probingData) {
    let platformId=localStorage.getItem('platformId');
    let industryType=localStorage.getItem('industryType');
    
    if(platformId!='1' && industryType!='2')
    {
      
      return this.http.post<any>(this.apiUrl.apiGetProductTypeList(), probingData)
    }
    else
    {
      
      return this.http.post<any>(this.apiUrl.apiGetProductmakeList(), probingData)
    }
    
  }

  fetchProductMakeListsUpdate(probingData) {
    let platformId=localStorage.getItem('platformId');
    let industryType=localStorage.getItem('industryType');
    
    if(platformId!='1' && industryType!='2')
    {
      
      return this.http.post<any>(this.apiUrl.apiGetProductmakeList(), probingData)
    }
    else
    {
      
      return this.http.post<any>(this.apiUrl.apiGetProductmakeList(), probingData)
    }
    
  }

  // Get Workstream Lists
  getWorkstreamLists(userData) {
    return this.http.post<any>(this.apiUrl.apiGetWorkstreamLists(), userData)
  }

  // Add or Save Make
  manageMake(makeData) {
    return this.http.post<any>(this.apiUrl.apiActionMake(), makeData)
  }

  UpdateProductMatrixByModel(apiData) {
    return this.http.post<any>(this.apiUrl.apiUpdateProductMatrixByModel(), apiData)
  }
  updatePlaceholderByHeader(apiData) {
    return this.http.post<any>(this.apiUrl.apiupdatePlaceholderByHeader(), apiData)
  }
  getPMColumns(apiData) {
    return this.http.post<any>(this.apiUrl.apigetPMColumns(), apiData)
  }
  checkHeaderExists(apiData) {
    return this.http.post<any>(this.apiUrl.apicheckHeaderExists(), apiData)
  }
  AddNewColumn(apiData) {
    return this.http.post<any>(this.apiUrl.apiAddNewColumn(), apiData)
  }

  getLookupTableData(apiData) {
    return this.http.post<any>(this.apiUrl.apigetLookupTableData(), apiData)
  }
  getPMColumnsValues(apiData) {
    return this.http.post<any>(this.apiUrl.apigetPMColumnsValues(), apiData)
  }
  SaveproductMatrixBYModel(apiData) {
    return this.http.post<any>(this.apiUrl.apiSaveproductMatrixBYModel(), apiData)
  }
  getproductCategandSubcat(apiData) {
    return this.http.post<any>(this.apiUrl.apigetproductCategandSubcat(), apiData)
  }
  getProductSubGroupList(apiData) {
    return this.http.post<any>(this.apiUrl.apiGetProductSubGroupList(), apiData)
  }
  kaizenUpdateApi(apiData) {
    return this.http.post<any>(this.apiUrl.apiKaizenUpdateApi(), apiData)
  }
  kaizenListDetailApi(apiData) {
    return this.http.post<any>(this.apiUrl.apiKaizenListDetail(), apiData)
  }
  kaizenGetUserStatusListApi(apiData) {
    return this.http.post<any>(this.apiUrl.apiKaizenGetUserStatusList(), apiData)
  }
}