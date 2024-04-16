import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor( private http: HttpClient, private apiUrl: ApiService) { }

  // Thread Field API
  apiGetThreadFields(data,apiVersion = 1) {
    switch(apiVersion) {
      case 1:
        const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('step', data.step)
      .set('threadCategoryId', data.threadCategoryId)
      .set('threadType', data.threadType)
      .set('docType', data.docType)
      .set('threadId', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType)
      .set('makeName', data.makeName)
      .set('modelName', data.modelName)
      .set('yearValue', data.yearValue)
      .set('productType', data.productType)
      .set('isMainSection', data.isMainSection)
      .set('threadCategoryValue', data.threadCategoryValue)
      .set('workstreamId', data.workstramId)
      .set('version', data.version);
        const body = JSON.stringify(data);
        return this.http.get<any>(this.apiUrl.apiGetThreadFields(apiVersion), {'params': params});
        break;
      case 2:
        return this.http.post<any>(this.apiUrl.apiGetThreadFields(apiVersion), data);
        break;
    }
  }

  // Opportunity Field API
  apiGetOpportunityFields(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('userId', data.userId)
      .set('step', data.step)
      .set('apiType', data.apiType);
    const body = JSON.stringify(data);

    return this.http.get<any>(this.apiUrl.apiGetOpportunityFields(), {'params': params});
  }

  apiGetMarketPlaceFields(data: any) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('step', data.step)
      .set('threadCategoryId', data.threadCategoryId)
      .set('threadType', data.threadType)
      .set('docType', data.docType)
      .set('id', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType)
      .set('makeName', data.makeName)
      .set('modelName', data.modelName)
      .set('yearValue', data.yearValue)
      .set('productType', data.productType);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceFields(), {'params': params});
  }

  apiGetAllManuals(domainId, isFront, search) {
    const params = new HttpParams()
      .set('isFront', isFront)
      .set('search', search)
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiGetAllManuals(), {'params': params});
  }

  apiGetAllManualsTitle(domainId) {
    const params = new HttpParams()
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiGetAllManualsTitle(), { 'params': params });
  }

  apiGetAllTrainingsTitle(domainId){
    const params = new HttpParams()
    .set('domainId', domainId);
  return this.http.get<any>(this.apiUrl.apiGetAllTrainingsTitle(), { 'params': params });
  }

  apiGetAllRepots(domainId, limit, offset, sortFieldEvent?,sortorderEvent?,dataFilterEvent?, reportId?) {
    const params = new HttpParams()
      .set('domainId', domainId)
      .set('limit', limit)
      .set('offset', offset)
      .set('sortFieldEvent', sortFieldEvent ? sortFieldEvent: '' )
      .set('sortorderEvent', sortorderEvent ? sortorderEvent: '' )
      .set('dataFilterEvent', dataFilterEvent ? dataFilterEvent: '' )
      .set('reportId', reportId ? reportId: 0 )
    return this.http.get<any>(this.apiUrl.apiGetAllReports(), {'params': params});
  }
  apiGetManualFields(data: any) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('step', data.step)
      .set('threadCategoryId', data.threadCategoryId)
      .set('threadType', data.threadType)
      .set('docType', data.docType)
      .set('id', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType)
      .set('makeName', data.makeName)
      .set('modelName', data.modelName)
      .set('yearValue', data.yearValue)
      .set('productType', data.productType);
    return this.http.get<any>(this.apiUrl.apiGetManualFields(), {'params': params});
  }

  apiGetSalesPersonData(id: any) {
    const params = new HttpParams()
    .set('id', id);
    return this.http.get<any>(this.apiUrl.apiGetSalesUserData(), {'params': params});
  }

  apiGetManualSalesPersonData(id: any) {
    const params = new HttpParams()
    .set('id', id);
    return this.http.get<any>(this.apiUrl.apiGetmanualSalesUserData(), {'params': params});
  }

  apiGetParticipantData(id: any) {
    const params = new HttpParams()
    .set('id', id);
    return this.http.get<any>(this.apiUrl.apiGetParticipantsData(), {'params': params});
  }

  apiGetMarketPlaceEditData(data: any) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('id', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceEditData(), {'params': params});
  }

  apiGetManualEditData(data: any) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('id', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType);
    return this.http.get<any>(this.apiUrl.apiGetManualEditData(), {'params': params});
  }

  apiGetMarketPlaceReminderData(data: any) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('id', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceReminderData(), {'params': params});
  }

  apiGetMarketPlaceRegisterUserData(data: any) {
    const params = new HttpParams()
    .set('apiKey', data.apiKey)
    .set('domainId', data.domainId)
    .set('countryId', data.countryId)
    .set('userId', data.userId)
    .set('id', data.threadId)
    .set('platform', data.platform)
    .set('apiType', data.apiType)
    .set('filter', data.status);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceRegisterUserData(), {'params': params});
  }

  apiGetMarketPlaceManualUserData(data: any) {
    const params = new HttpParams()
    .set('apiKey', data.apiKey)
    .set('domainId', data.domainId)
    .set('countryId', data.countryId)
    .set('userId', data.userId)
    .set('id', data.threadId)
    .set('platform', data.platform)
    .set('apiType', data.apiType)
    .set('filter', data.status);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceManualUserData(), {'params': params});
  }

  apiForRefundPayment(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiForRefundPayment(), paymentData);
  }

  apiForRefundManualPayment(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiForRefundManualPayment(), paymentData);
  }

  apiForPartialRefundPayment(paymentData: any) {
    return this.http.post<any>(this.apiUrl.apiForPartialRefundPayment(), paymentData);
  }
  
  apiForRefundHistory(data: any) {
    const params = new HttpParams()
    .set('id', data.id)
    .set('typeId', data.typeId || null);
    return this.http.get<any>(this.apiUrl.apiForRefundHistory(), { 'params': params });
  }

  apiForCustomerAdd(customerData: any) {
    return this.http.post<any>(this.apiUrl.apiForCustomerAdd(), customerData);
  }

  apiForCompanyAdd(companyData: any) {
    return this.http.post<any>(this.apiUrl.apiForCompanyAdd(), companyData);
  }

  apiForCompanyAddData(domainId: any) {
    const params = new HttpParams()
    .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiForCompanyAddData(), {'params': params});
  }

  apiForCompanyAddressAddData(data: any) {
    const params = new HttpParams()
    .set('domainId', data.domainId)
    .set('companyId', data.companyId);
    return this.http.get<any>(this.apiUrl.apiForCompanyAddressAddData(), {'params': params});
  }


  apiForimportShopData(fdata: any){
    const formData: FormData = new FormData();
    formData.append('file', fdata.file);
    formData.append('domainId', fdata.domainId);
    formData.append('userId', fdata.userId);
    formData.append('apiKey', fdata.apiKey);
    return this.http.post(this.apiUrl.apiImportStoreList(), formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  apiForUploadCustomerData(payload: any){
    const formData: FormData = new FormData();
    formData.append('file', payload.file);
    formData.append('deleteFlag', payload.deleteFlag);
    formData.append('domainId', payload.domainId);
    formData.append('userId', payload.userId);
    return this.http.post(this.apiUrl.apiForCustomerFileUpload(), formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  apiForCustomerUpdate(customerData: any) {
    return this.http.post<any>(this.apiUrl.apiForCustomerUpdate(), customerData);
  }

  apiForCustomerDelete(id: any) {
    const params = new HttpParams()
      .set('id', id);
    return this.http.delete<any>(this.apiUrl.apiForCustomerDelete(), { params: params });
  }

  apiInnerGetMarketPlaceEditData(data: any) {
    const params = new HttpParams()
      .set('id', data.threadId);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceEditData(), {'params': params});
  }

  apiInnerGetManualEditData(data: any) {
    const params = new HttpParams()
      .set('id', data.threadId);
    return this.http.get<any>(this.apiUrl.apiGetManualEditData(), {'params': params});
  }

  apiMarketPlaceEditDomainData(data: any) {
    const params = new HttpParams()
      .set('id', data.id);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceEditDomainData(), {'params': params});
  }

  apiMarketPlacePoliciesData(data) {
    const params = new HttpParams()
    .set('domainId', data)
    return this.http.get<any>(this.apiUrl.apiGetMarketPlacePoliciesData(), {'params': params});
  }

  apiMarketPlacePoliciesDataByType(data){
    const params = new HttpParams()
    .set('type', data)
    return this.http.get<any>(this.apiUrl.apiGetMarketPlacePoliciesDataByType(), {'params': params});
  }

  apiMarketPlacePolicyData(data: any) {
    const params = new HttpParams()
      .set('domainId', data.domainId)
      .set('policyId', data.policyId);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlacePolicyData(), {'params': params});
  }

  updateMarketPlacePolicyData(data: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateMarketPlacePolicyData(), data);
  }

  deleteMarketPlacePolicy(data: any) {
    return this.http.post<any>(this.apiUrl.apiDeleteMarketPlacePolicy(), data);
  }

  apiMarketPlaceEditDomainBannerData(data: any) {
    const params = new HttpParams()
      .set('id', data.id);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceEditDomainBannerData(), {'params': params});
  }
  
  apiMarketPlacePolicyHistory(id: any) {
    const params = new HttpParams()
      .set('policyId', id);
    return this.http.get<any>(this.apiUrl.apiGetMarketPlacePolicyHistory(), {'params': params});
  }

  apigetQuizSingleData(id: any) {
    const params = new HttpParams()
      .set('id', id);
    return this.http.get<any>(this.apiUrl.apiGetQuizEditData(), {'params': params});
  }

  apigetTopicSingleData(id: any) {
    const params = new HttpParams()
      .set('id', id);
    return this.http.get<any>(this.apiUrl.apiGetTopicEditData(), {'params': params});
  }

  apiGetMarketPlaceData(data: any) {
    if (data.domainId && data.fromTechDomain==1)
      {
        let isFront='false';
        const params = new HttpParams()
        .set('limit', data.limit)
        .set('offset', data.offset)
        .set('domainId', data.domainId)
        .set('filter', data.currentFilter ? data.currentFilter : '')
        .set('trainingStatus', data.trainingStatus ? data.trainingStatus : '')
        .set('startDate', data.startDate ? data.startDate : '')
        .set('endDate', data.endDate ? data.endDate : '')
        .set('state', data.state ? data.state : '')
        .set('search', data.search ? data.search : '')
        .set('keyword', data.keyword ? data.keyword : '')
        .set('fromTechDomain', data.fromTechDomain ? data.fromTechDomain : '')
        .set('trainingType', data.trainingType ? data.trainingType : '')
        .set('userId', data.userId ? data.userId : '')
        .set('isFront', isFront);
      let url = this.apiUrl.apiGetMarketPlaceData();
      if (data.domainId && data.fromTechDomain!=1) {
        url = this.apiUrl.apiGetDomainMarketPlaceData();
      }
      return this.http.get<any>(url, {'params': params});
      }
      else
      {
        const params = new HttpParams()
        .set('limit', data.limit)
        .set('offset', data.offset)
        .set('domainId', data.domainId)
        .set('filter', data.currentFilter ? data.currentFilter : '')
        .set('trainingStatus', data.trainingStatus ? data.trainingStatus : '')
        .set('startDate', data.startDate ? data.startDate : '')
        .set('endDate', data.endDate ? data.endDate : '')
        .set('state', data.state ? data.state : '')
        .set('search', data.search ? data.search : '')
        .set('keyword', data.keyword ? data.keyword : '')
        .set('trainingType', data.trainingType ? data.trainingType : '')
        .set('isFront', data.isFront ? data.isFront : false);
      let url = this.apiUrl.apiGetMarketPlaceData();
      if (data.domainId) {
        url = this.apiUrl.apiGetDomainMarketPlaceData();
      }

         return this.http.get<any>(url, {'params': params});
      }


  }

  apiGetManualsData(data: any) {
    const params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainId', data.domainId)
      .set('filter', data.currentFilter ? data.currentFilter : '')
      .set('trainingStatus', data.trainingStatus ? data.trainingStatus : '')
      .set('startDate', data.startDate ? data.startDate : '')
      .set('endDate', data.endDate ? data.endDate : '')
      .set('state', data.state ? data.state : '')
      .set('search', data.search ? data.search : '')
      .set('keyword', data.keyword ? data.keyword : '')
      .set('isFront', data.isFront ? data.isFront : false);
    let url = this.apiUrl.apiGetManualData();
    return this.http.get<any>(url, {'params': params});
  }

  apiRepairfyDomainData(data: any) {
    const params = new HttpParams()
      .set('domainId', data.domainId);
    return this.http.get<any>(this.apiUrl.apiRepairfyDomainData(), {'params': params});
  }

  apiGetQuizData(data: any) {
    let params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainId', data.domainId);
    if (data.topic_id) {
      console.log("data.topic_id: ", data.topic_id);
      params = params.append('topic_id', data.topic_id);
    }
    let url = this.apiUrl.apiGetQuizData();
    if (data.domainId) {
      url = this.apiUrl.apiGetDomainQuizData();
    }
    return this.http.get<any>(url, {'params': params});
  }

  apiGetAllCustomerData(data: any) {
    let params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainId', data.domainId);
    return this.http.get<any>(this.apiUrl.apiGetAllCustomerData(), {'params': params});
  }

  apiGetAllCustomerUsers(data: any) {
    let params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainId', data.domainId)
      .set('userEmail', data.userEmail);
    return this.http.get<any>(this.apiUrl.apiGetAllCustomerUsers(), {'params': params});
  }

  apiGetBusinessData(data: any) {
    let params = new HttpParams()
      .set('domainId', data.domainId)
      .set('type', data.type)
      .set('value', data.value);
    return this.http.get<any>(this.apiUrl.apiGetBusinessData(), { 'params': params });
  }

  apiGetMarketPlaceDataWithDomainName(data: any) {
    const params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainName', data.domainName)
      .set('filter', data.currentFilter ? data.currentFilter : '')
      .set('startDate', data.startDate ? data.startDate : '')
      .set('endDate', data.endDate ? data.endDate : '')
      .set('state', data.state ? data.state : '')
      .set('search', data.search ? data.search : '')
      .set('keyword', data.keyword ? data.keyword : '')
      .set('isFront', data.isFront ? data.isFront : false);
    let url = this.apiUrl.apiGetMarketPlaceDataWithDomainName();
    return this.http.get<any>(url, {'params': params});
  }

  apiGetManualsDataWithDomainName(data: any) {
    const params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset)
      .set('domainName', data.domainName)
      .set('filter', data.currentFilter ? data.currentFilter : '')
      .set('startDate', data.startDate ? data.startDate : '')
      .set('endDate', data.endDate ? data.endDate : '')
      .set('state', data.state ? data.state : '')
      .set('search', data.search ? data.search : '')
      .set('keyword', data.keyword ? data.keyword : '')
      .set('isFront', data.isFront ? data.isFront : false);
    let url = this.apiUrl.apiGetManualDataWithDomainName();
    return this.http.get<any>(url, {'params': params});
  }

  apiForUpdateSalesPerson(data: any) {
    return this.http.post(this.apiUrl.apiUpdateSalesPersonApi(), data);
  }

  apiForUpdateComment(data: any) {
    return this.http.post(this.apiUrl.apiUpdateComment(), data);
  }

  apiForUpdatemanualComment(data: any) {
    return this.http.post(this.apiUrl.apiUpdateManualComment(), data);
  }

  apiForUpdateManualSalesPerson(data: any) {
    return this.http.post(this.apiUrl.apiUpdateManualSalesPersonApi(), data);
  }

  apiGetDomainsData(data: any) {
    const params = new HttpParams()
      .set('limit', data.limit)
      .set('offset', data.offset);
    return this.http.get<any>(this.apiUrl.apiGetDomainsData(), {'params': params});
  }

  createMarketPlace(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiCreateMarketPlace(), marketPlaceData);
  }

  createMarketPlaceManual(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiCreateMarketPlaceManual(), marketPlaceData);
  }

  createQuizTopic(quizTopic: any) {
    return this.http.post<any>(this.apiUrl.apiCreateQuizTopic(), quizTopic);
  }

  updateQuizTopic(quizTopic: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateQuizTopic(), quizTopic);
  }

  apiForZoomSettingUpdate(data){
    return this.http.post<any>(this.apiUrl.apiForZoomSettingUpdate(), data);
  }

  apiForInformedUsersUpdate(data){
    return this.http.post<any>(this.apiUrl.apiForInformedUsersUpdate(), data);
  }

  apiForNotificationSettingUpdate(data){
    return this.http.post<any>(this.apiUrl.apiForNotificationSettingUpdate(), data);
  }

  apiForZoomConfigurationUpdate(data){
    return this.http.post<any>(this.apiUrl.apiForZoomConfigurationUpdate(), data);
  }

  apiForLoadZoomSetting(domainId){
    const params = new HttpParams()
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiForLoadZoomSetting(), {'params': params});
  }

  apiForLoadInformedUsers(domainId){
    const params = new HttpParams()
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiForLoadInformedUsers(), {'params': params});
  }

  apiForLoadPaymentSetting(domainId){
    const params = new HttpParams()
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiForLoadPaymentSetting(), {'params': params});
  }

  apiForLoadEmailSetting(domainId){
    const params = new HttpParams()
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiForLoadEmailSetting(), {'params': params});
  }

  apiForShippingCost(domainId){
    const params = new HttpParams()
      .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiForLoadShippingCost(), {'params': params});
  }

  apiForEmailSettingUpdate(data: any) {
    return this.http.post<any>(this.apiUrl.apiForUpdateEmailSetting(), data);
  }

  duplicateQuizTopic(quizTopic: any) {
    return this.http.post<any>(this.apiUrl.apiDuplicateQuizTopic(), quizTopic);
  }

  apiForUserEmailDetail(email: any) {
    const params = new HttpParams()
      .set('email', email);
    return this.http.get<any>(this.apiUrl.apiForUserEmail(), {'params': params})
  }

  apiForManualTax(data: any) {
    return this.http.post<any>(this.apiUrl.apiManualTax(), data);
  }

  getCart(data: any) {
    return this.http.post<any>(this.apiUrl.apiForGetCart(), data);
  }

  updateCartItems(data: any) {
    return this.http.post<any>(this.apiUrl.updateCartItems(), data);
  }

  updateCartItemsWithDetails(data: any) {
    return this.http.post<any>(this.apiUrl.updateCartItemsWithDetails(), data);
  }

  emptyCart(data: any) {
    return this.http.post<any>(this.apiUrl.emptyCart(), data);
  }

  updateCartFormDetails(data: any) {
    return this.http.post<any>(this.apiUrl.updateCartForm(), data);
  }

  updateBusinessNewDetails(data: any) {
    return this.http.post<any>(this.apiUrl.updateBusinessNew(), data);
  }

  apiForManualUserEmailDetail(email: any) {
    const params = new HttpParams()
      .set('email', email);
    return this.http.get<any>(this.apiUrl.apiForManualUserEmail(), {'params': params})
  }

  deleteQuizTopic(id: any) {
    const params = new HttpParams()
      .set('id', id);
    return this.http.delete<any>(this.apiUrl.apiDeleteQuizTopic(), {'params': params});
  }

  createQuiz(quizTopic: any) {
    return this.http.post<any>(this.apiUrl.apiCreateQuiz(), quizTopic);
  }

  updateQuiz(quizTopic: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateQuiz(), quizTopic);
  }

  listQuizTopic() {
    return this.http.get<any>(this.apiUrl.apiGetQuizTopic());
  }

  listQuizTopicWithRecords(domainId: any) {
    const params = new HttpParams()
    .set('domainId', domainId);
    return this.http.get<any>(this.apiUrl.apiGetQuizTopicWithRecords(), {'params': params});
  }

  updateDomainMarketPlace(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateDomainMarketPlace(), marketPlaceData);
  }

  updateDomainBannerMarketPlace(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateDomainBannerMarketPlace(), marketPlaceData);
  }

  updateRepairyDomainMarketPlace(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateRepairfyDomainMarketPlace(), marketPlaceData);
  }

  apiUpdateMarketPlaceReminderFields(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateMarketPlaceReminderFields(), marketPlaceData);
  }

  deleteMarketPlace(data: any) {
    const params = new HttpParams()
      .set('id', data.threadId)
    return this.http.delete<any>(this.apiUrl.apiDeleteMarketPlace(), {'params': params});
  }

  deleteMarketPlacePermanent(data: any) {
    const params = new HttpParams()
      .set('id', data.threadId)
    return this.http.delete<any>(this.apiUrl.apiDeleteMarketPlacePermanent(), {'params': params});
  }

  deleteManualPermanent(data: any) {
    const params = new HttpParams()
      .set('id', data.threadId)
    return this.http.delete<any>(this.apiUrl.apiDeleteManualPermanent(), {'params': params});
  }

  restoreMarketPlace(data: any, timezone_offset_minutes) {
    const params = new HttpParams()
      .set('id', data.threadId)
      .set('timeZoneMinutes', timezone_offset_minutes)
    return this.http.get<any>(this.apiUrl.apiRestoreMarketPlace(), {'params': params});
  }

  deleteManual(data: any) {
    const params = new HttpParams()
      .set('id', data.threadId)
    return this.http.delete<any>(this.apiUrl.apiDeleteManual(), { 'params': params });
  }

  restoreManual(data: any, timezone_offset_minutes) {
    const params = new HttpParams()
      .set('id', data.threadId)
      .set('timeZoneMinutes', timezone_offset_minutes)
    return this.http.get<any>(this.apiUrl.apiRestoreManual(), { 'params': params });
  }

  setIsNewFalse(id: any) {
    const params = new HttpParams()
      .set('id', id)
    return this.http.delete<any>(this.apiUrl.apiSetIsNewFalse(), {'params': params});
  }

  setIsNewFalseManual(id: any) {
    const params = new HttpParams()
      .set('id', id)
    return this.http.delete<any>(this.apiUrl.apiSetIsNewFalseManual(), {'params': params});
  }

  deleteQuiz(id: any) {
    const params = new HttpParams()
      .set('id', id);
    return this.http.delete<any>(this.apiUrl.apiDeleteQuiz(), {'params': params});
  }

  userSubmitData(data: any) {
    return this.http.post<any>(this.apiUrl.apiCreateUserMarketPlace(), data);
  }

  userManualSubmitData(data: any) {
    return this.http.post<any>(this.apiUrl.apiCreateUserManualBooking(), data);
  }

  purchaseSeatsData(data: any) {
    return this.http.post<any>(this.apiUrl.apiPurchaseSeatsMarketPlace(), data);
  }

  userUpdateData(data: any) {
    return this.http.post<any>(this.apiUrl.apiUserInfoUpdate(), data);
  }

  manualUserUpdateData(data: any) {
    return this.http.post<any>(this.apiUrl.apiManualUserInfoUpdate(), data);
  }

  countryMasterData() {
    return this.http.get<any>(this.apiUrl.apiGetMasterData());
  }

  stateMasterData(countryId: any) {
    const params = new HttpParams()
      .set('country_id', countryId);
    return this.http.get<any>(this.apiUrl.apiGetStateData(), {'params': params});
  }

  // Shipping Cost
  getShippingCost(domainId){
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceShippingCost(domainId));
  }

  getEmailNoticationsSettings(domainId){
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceEmailNoticationsSettings(domainId));
  }

  getEmailNoticationsSetting(domainId, type){
    return this.http.get<any>(this.apiUrl.apiGetMarketPlaceEmailNoticationsSetting(domainId, type));
  }

  updateEmailNoticationsSettings(data){
    return this.http.post<any>(this.apiUrl.apiUpdateMarketPlaceEmailNoticationsSettings(), data );
  }

  updateTextMessageToolip(domainId){
    return this.http.post<any>(this.apiUrl.apiUpdateTextMessageTooltip(), domainId );
  }

  updateMarketPlace(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateMarketPlace(), marketPlaceData);
  }

  updateManual(marketPlaceData: any) {
    return this.http.post<any>(this.apiUrl.apiUpdateManual(), marketPlaceData);
  }

  // Thread Creation API
  createThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiCreateThread(), threadData);
  }

  // Thread Update API
  updateThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiUpdateThread(), threadData);
  }

  // Thread Push Api
  threadPush(pushData) {
    return this.http.post<any>(this.apiUrl.apiThreadPush(), pushData);
  }

  // Document/Announcement Update API
  updateTechInfo(data) {
    return this.http.post<any>(this.apiUrl.apiUpdateTechInfo(), data);
  }

  // Document Notification Api
  documentNotification(pushData) {
    return this.http.post<any>(this.apiUrl.apiDocumentNotification(), pushData);
  }

  // Document Notification Api
  documentApprovalNotification(pushData) {
    return this.http.post<any>(this.apiUrl.apiDocumentApprovalNotification(), pushData);
  }

  // Manage Opportunity
  manageOpportunity(optData) {
    return this.http.post<any>(this.apiUrl.apiManageOpportunity(), optData);
  }

  //Shipping Cost
  updateShippingCost(optData){
    return this.http.post<any>(this.apiUrl.apiUpdateMarketPlaceShippingCost() , optData);
  }


  apiGetDomainMarketPlaceIndexData(data: any) {
    return this.http.post(this.apiUrl.apiGetDomainMarketPlaceData(), data);
  }

  getDomainMarketPlaceIndexData(domainId: any) {
      const params = new HttpParams()
      .set('domainId', domainId)
      .set('offset', '0')
      .set('limit', '1');
    return this.http.get<any>(this.apiUrl.apiGetDomainMarketPlaceData(), {'params': params});
  }

  //common function for payment formatting
  isInt(value, showCurrency = true, hideDecimal = false) {
    return !isNaN(value) && ((x) => {
      let val: any;
      if (((x | 0) === x) && hideDecimal) {
        val = x;
      } else {
        val = (Math.round(x * 100) / 100).toFixed(2);
      }
      // val = (Math.round(x * 100) / 100).toFixed(2);
      if (showCurrency) {
        return '$' + val;
      } else {
        return val;
      }
    })(parseFloat(value));
  }

  urlify(text: any) {
    return text;
    const urlRegex = /(https?:\/\/[^\< ]+)/g;
    return text.replace(urlRegex, (url: string) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  }
  
}
