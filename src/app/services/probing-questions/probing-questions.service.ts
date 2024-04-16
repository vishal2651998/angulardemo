import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProbingQuestionsService {
  constructor(private http: HttpClient, private apiUrl: ApiService) {}

  // Get User Profile
  getUserProfile(userData): Observable<any> {
    const params = new HttpParams()
      .set("api_key", userData.api_key)
      .set("user_id", userData.user_id)
      .set("domain_id", userData.domain_id)
      .set("countryId", userData.countryId);
    const body = JSON.stringify(userData);

    return this.http.post<any>(this.apiUrl.apiUserProfile(), body, {
      params: params,
    });
  }

  // Dashboard Data
  dashboardMetrics(dashboardData): Observable<any> {
    localStorage.setItem(
      "dashFilter",
      JSON.stringify(dashboardData.filterOptions)
    );
    const params = new HttpParams()
      .set("apiKey", dashboardData.apiKey)
      .set("userId", dashboardData.userId)
      .set("domainId", dashboardData.domainId)
      .set("countryId", dashboardData.countryId)
      .set("filterOptions", JSON.stringify(dashboardData.filterOptions));
    const body = JSON.stringify(dashboardData);

    return this.http.post<any>(this.apiUrl.apiDashboard(), body, {
      params: params,
    });
  }

  // New Probing Question
  newProbingQuest(newProbData) {
    return this.http.post<any>(this.apiUrl.apiNewProbingQuest(), newProbData);
  }

  // Get Probing Lists
  getProbingLists(probingData) {
    return this.http.post<any>(this.apiUrl.apiGetProbingLists(), probingData);
  }

  // Delete Probing Question
  deleteProbingQuestion(probData) {
    return this.http.post<any>(this.apiUrl.apiDeleteProbingQuest(), probData);
  }

  // Get Workstream Lists
  getWorkstreamLists(userData) {
    return this.http.post<any>(this.apiUrl.apiGetWorkstreamLists(), userData);
  }
  // Get Workstream Lists
  getWorkstreamListsAPI(userData) {
    return this.http.post<any>(
      this.apiUrl.apiGetWorkstreamListsAPI(),
      userData
    );
  }
  // Get Workflow types
  getWorkFlowContentTypes(userData) {
    return this.http.post<any>(
      this.apiUrl.apiWorkFlowContentTypes(),
      userData
    );
  }
  
  // Get Product Type Lists
  getProdTypeLists(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("userId", data.userId)
      .set("domainId", data.domainId)
      .set("countryId", data.countryId)
      .set("makeName", data.make);
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiGetProdTypeLists(), body, {
      params: params,
    });
  }

  // Get Vehicle Model Lists
  getVehicleModels(modelData) {
    const params = new HttpParams()
      .set("apiKey", modelData.apiKey)
      .set("userId", modelData.userId)
      .set("domainId", modelData.domainId)
      .set("countryId", modelData.countryId)
      .set("make", modelData.make)
      .set("prodType", modelData.prodType);
    const body = JSON.stringify(modelData);

    return this.http.post<any>(this.apiUrl.apiGetVehicleModelLists(), body, {
      params: params,
    });
  }

  // Get Vehicle Model Lists
  getVehicleModelsGTS(modelData) {
    const params = new HttpParams()
      .set("apiKey", modelData.apiKey)
      .set("userId", modelData.userId)
      .set("domainId", modelData.domainId)
      .set("countryId", modelData.countryId)
      .set("make", modelData.make)
      .set("prodType", modelData.prodType);
    const body = JSON.stringify(modelData);

    return this.http.post<any>(this.apiUrl.apiGetVehicleModelListsGTS(), body, {
      params: params,
    });
  }
}
