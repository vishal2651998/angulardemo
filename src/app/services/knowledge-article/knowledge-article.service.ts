import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { BaseService } from 'src/app/modules/base/base.service';

@Injectable({
  providedIn: "root",
})
export class KnowledgeArticleService {
  constructor(private http: HttpClient, private apiUrl: ApiService,private baseSerivce: BaseService) {}
  // Get individual Knowledge Article
  getKnowledgeArticlesDetails(data) {
    return this.http.post<any>(this.apiUrl.getKnowledgeArticlesDetails(), data);
  }
  // Delate knowledge article
  deleteKnowledgeArticle(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("domainId", data.domainId)
      .set("countryId", data.countryId)
      .set("userId", data.userId)
      .set("contentTypeId", data.contentType)
      .set("postId", data.postId);
    const body = JSON.stringify(data);

    let apiDatasocial = new FormData();    
            apiDatasocial.append('apiKey', data.apiKey);
            apiDatasocial.append('domainId', data.domainId);
            apiDatasocial.append('threadId', data.dataId);
            apiDatasocial.append('userId', data.userId); 
            apiDatasocial.append('type', '6'); 
            apiDatasocial.append('action', 'delete'); 
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

    return this.http.post<any>(this.apiUrl.apiDeleteKnowledgeArticle(), body, {
      params: params,
    });
  }
  // Manage knowledge article Create or Edit
  manageKnowledgeArticle(knowledgeData) {
    return this.http.post<any>(
      this.apiUrl.apiManageKnowledgeType(),
      knowledgeData
    );
  }
  // Like & Pin Actions
  likePinAction(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("domainId", data.domainId)
      .set("countryId", data.countryId)
      .set("userId", data.userId)
      .set("threadId", data.threadId)
      .set("postId", data.postId)
      .set("ismain", data.ismain)
      .set("status", data.status)
      .set("type", data.type);
    const body = JSON.stringify(data);

    return this.http.post<any>(
      this.apiUrl.apiLikePinKnowledgeArticleAction(),
      body,
      { params: params }
    );
  }
   // Get Knowledge Article category
   getAllKnowledgeArticleCategory(data) {
    return this.http.post<any>(this.apiUrl.apiAllKnowledgeArticleCategory(), data);
  }
}
