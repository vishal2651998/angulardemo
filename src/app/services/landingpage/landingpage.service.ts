import {
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef,
} from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Constant,ContentTypeValues } from 'src/app/common/constant/constant';
@Injectable({
  providedIn: "root",
})
export class LandingpageService {
  private isLoggedIn = true;
  constructor(
    private cfr: ComponentFactoryResolver,
    private http: HttpClient,
    private apiUrl: ApiService
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Methods':'DELETE, POST, GET, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin':'*'
    })
  };

  getUserProfile(userData): Observable<any> {
    const params = new HttpParams()
      .set("api_key", userData.api_key)
      .set("user_id", userData.user_id)
      .set("domain_id", userData.domain_id);
    const body = JSON.stringify(userData);

    return this.http.post<any>(this.apiUrl.apiUserProfile(), body, {
      params: params,
    });
  }

  GetLandingpageOptions(userData) {
    return this.http.post<any>(
      this.apiUrl.apiGetLandingpageOptions(),
      userData
    );
  }
  ManualsAndAnnouncementList(userData) {
    return this.http.post<any>(
      this.apiUrl.apiManualsAndAnnouncementList(),
      userData
    );
  }
  getSolrDataDetail(partsData) {
    console.log(partsData)
    let query = (partsData.query) ? partsData.query : '';
    const params = new HttpParams()
      .set('apiKey', partsData.apiKey)
      .set('userId', partsData.userId)
      .set('domainId', partsData.domainId)
      .set('countryId', partsData.countryId)
      .set('partId', partsData.partId)
      .set('query', query)
    const body = JSON.stringify(partsData);
    if(partsData.listing == 1) {
      return this.http.post<any>(this.apiUrl.apiSolrDataList(), body)
    } else {
      return this.http.post<any>(this.apiUrl.apiSolrSearchList(), body)
    }
  }

  getSolrSuggDetail(type, data) {
    switch(type) {
      case 'report':
        let params = new HttpParams()
        .set("type", data.type)
        .set("domainId", data.domainId)
        .set("query", data.query)
        .set("reportWorsktream", data.reportWorsktream);
        return this.http.get<any>(this.apiUrl.apiSolrReportSuggList(), {
          params: params,
        });
        break;
      default:
        let platformId=localStorage.getItem('platformId');
        let cparams;
        if(platformId=='1')
        {
        cparams = new HttpParams()
          .set("type", data.type)
          .set("domainId", data.domainId)
          .set("query", data.query)
          .set("workstreamsIds", data.workstreamsIds)
          .set("approvalProcess", data.approvalProcess)
          return this.http.get<any>(this.apiUrl.apiSolrSuggList(), {
            params: cparams,
          });
        }
        else
        {
          cparams = new HttpParams()
          .set("type", data.type)
          .set("domainId", data.domainId)
          .set("query", data.query)
          .set("workstreamsIds", data.workstreamsIds)
         
          return this.http.get<any>(this.apiUrl.apiSolrSuggList(), {
            params: cparams,
          });

        }
       
        break;  
    }    
  }

  apiclearsearchhistory(userData) {
    return this.http.post<any>(
      this.apiUrl.apiclearsearchhistory(),
      userData
    );
  }

  apiUpdateSearchKeyword(userData) {
    return this.http.post<any>(
      this.apiUrl.apiUpdateSearchKeyword(),
      userData
    );
  }

  getescalatethreadsAPI(userData) {
    return this.http.post<any>(
      this.apiUrl.apigetescalatethreadsAPI(),
      userData
    );
  }

  GetEscalationsByLevels(userData) {
    return this.http.post<any>(
      this.apiUrl.apiGetEscalationsByLevels(),
      userData
    );
  }



  getusersearchHistory(userData) {
    return this.http.post<any>(this.apiUrl.apigetusersearchHistory(), userData);
  }

  getAlldomainUsers(userData) {
    return this.http.post<any>(this.apiUrl.apiGetAlldomainUsers(), userData);
  }

  getTechSupportCommonAPIs(userData) {
    return this.http.post<any>(this.apiUrl.apiTechSupportCommonAPIs(), userData);
  }
  

  readandDeleteNotification(data) {
    return this.http.post<any>(this.apiUrl.readandDeleteNotification(), data);
  }

  getThreadCharts(userData) {
    return this.http.post<any>(this.apiUrl.apiThreadCharts(), userData);
  }
  getKnowledgeArticleList(userData) {
    return this.http.post<any>(this.apiUrl.getAllKnowledgeArticle(), userData);
  }
  GetRecentViews(userData) {
    return this.http.post<any>(this.apiUrl.apiGetRecentViews(), userData);
  }
  Getusernotifications(userData) {
   // console.log('chat userData', userData);
    return this.http.post<any>(this.apiUrl.apiusernotifications(), userData);
  }

  Resetusernotifications(userData) {
    return this.http.post<any>(
      this.apiUrl.apiresetusernotifications(),
      userData
    );
  }

  ReadandDeleteNotification(userData) {
    return this.http.post<any>(
      this.apiUrl.apiReadandDeleteNotification(),
      userData
    );
  }

  Dismissallnotifications(userData) {
    return this.http.post<any>(
      this.apiUrl.apiDismissallnotifications(),
      userData
    );
  }
  Registerdevicetoken(userData) {
    return this.http.post<any>(this.apiUrl.apiregisterdevicetoken(), userData);
  }

  getSystemActivity(userData) {
    return this.http.post<any>(this.apiUrl.apigetSystemActivity(), userData);
  }
  ActiveDevicesOnPageWeb(userData) {
    return this.http.post<any>(
      this.apiUrl.apiActiveDevicesOnPageWeb(),
      userData
    );
  }

  threadspageAPI(userData) {

    
    return this.http.post<any>(
      this.apiUrl.apithreadwithWorkstreams(),
      userData
    );
  }

  apiGetWebAppVersion(userData) {
    return this.http.post<any>(this.apiUrl.apiGetWebAppVersion(), userData);
  }

  EnhancedSearchAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiEnhancedSearchAPI(), userData);
  }
  // add manager
  getManagerList(mData) {
    return this.http.post<any>(this.apiUrl.apiGetManagerList(), mData);
  }

  // update manager
  updateManagerList(mData) {
    return this.http.post<any>(this.apiUrl.apiUpdateManagerList(), mData);
  }
  //report widgets
  getReportsAttr(mData) {
    return this.http.post<any>(this.apiUrl.apiLandingreports(), mData);
  }

  /*
  async loadComponent(vcr: ViewContainerRef, isLoggedIn: boolean) {
    const { AnnouncementWidgetsComponent } = await import('../../components/common/announcement-widgets/announcement-widgets.component');

    //const { UserCardComponent } = await import('./user-card/user-card.component');

    vcr.clear();

    let component : any = isLoggedIn ? AnnouncementWidgetsComponent;

    return vcr.createComponent(
      this.cfr.resolveComponentFactory(component))
}
*/

  // updatehelp content
  updateTooltipconfigWeb(mData) {
    return this.http.post<any>(this.apiUrl.apitooltipconfigWeb(), mData);
  }

  //
  updateConfigSettings(mData) {
    return this.http.post<any>(this.apiUrl.apiUpdateConfigSettings(), mData);
  }

   //
   Getworkstramsusersparticipants(mData) {
    return this.http.post<any>(this.apiUrl.apiGetworkstramsusersparticipants(), mData);
  }

    //
    getContentTypeList(mData) {
    return this.http.post<any>(this.apiUrl.apiGetContentTypeList(), mData);
  }

  serviceListAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiServiceList(), userData);
  }

  dispatchSettingsAPI(apiData) {
    return this.http.post<any>(this.apiUrl.apiDispatchSettings(), apiData);
  }

  boardSettingsAPI(apiData) {
    return this.http.post<any>(this.apiUrl.apiBoardSettings(), apiData);
  }

  shopListAPI(userData) {
    let ctid =  (userData.contentTypeId) ? userData.contentTypeId : ContentTypeValues.Dispatch; 
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("countryId", userData.countryId)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId)
      .set("contentTypeId", ctid);
    return this.http.get<any>(this.apiUrl.apiShopList(), {
      params: params,
    });
  }

  statusListAPI(userData) {
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("countryId", userData.countryId)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId);
    return this.http.get<any>(this.apiUrl.apiStatusList(), {
      params: params,
    });
  }

  serviceContactListAPI(userData) {
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId)
      .set("shopId", userData.shopId);
    return this.http.get<any>(this.apiUrl.apiServiceContactList(), {
      params: params,
    });
  }

  /* technicianAPI(userData) {
    return this.http.post<any>(this.apiUrl.apoTechnicianList(), userData);
  } */

  manageServiceAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiManageService(), userData);
  }

  manageServiceCatgAPI(catgData) {
    return this.http.post<any>(this.apiUrl.apiManageServiceCatg(), catgData);
  }

  manageServiceContactAPI(contactData) {
    return this.http.post<any>(this.apiUrl.apiManageServiceContact(), contactData);
  }

  manageServiceShopAPI(shopData) { 
    return this.http.post<any>(this.apiUrl.apiManageServiceShop(), shopData);
  }

  checkDuplicate(data) {
    return this.http.post<any>(this.apiUrl.apiCheckDuplicate(), data);
  }

  serviceCategory(userData) {
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId);
    return this.http.get<any>(this.apiUrl.apiServiceCategory(), {
      params: params,
    });
  }

  vehicleInfoByVIN(userData) {
    return this.http.post<any>(this.apiUrl.apiVehiclebyVIN(), userData);
  }

  getProductMakeListsAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiGetProductmakeList(), userData);
  }

  getMakeModelsList(userData) {
    const params = new HttpParams()
      .set("apiKey", userData.apiKey)
      .set("domainId", String(userData.domainId))
      .set("countryId", userData.countryId)
      .set("userId", userData.userId)
      .set("displayOrder", userData.displayOrder)
      .set("type", userData.type)
      .set("makeName", userData.makeName)
      .set("offset", userData.offset)
      .set("limit", userData.limit);
    return this.http.post<any>(this.apiUrl.apiModels(), "", {
      params: params,
    });
  }

  // Standard Report API's
  getStandardReportlistsAPI(reportData) { 
    return this.http.post<any>(this.apiUrl.apiStandardReportLists(), reportData);
  }

  // Manage Report
  manageReportAPI(reportData) {
    return this.http.post<any>(this.apiUrl.apiManageReport(), reportData);
  }

  // Get Mfg List
  getMfgList(apiData) {
    return this.http.post<any>(this.apiUrl.apiGetMfgList(), apiData);
  }

  // Get Workstream Lists
  getWorkstreamLists(userData) {
    return this.http.post<any>(this.apiUrl.apiGetWorkstreamLists(), userData);
  }

  // CBT V3 Push
  cbtV3SendPush(pushData) {
    return this.http.post<any>(this.apiUrl.apiV3SendPush(), pushData);
  }

  updateThreadTechSupportAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiUpdateThreadTechSupport(), userData);
  }

  saveTechSupportTeams(userData) {
    return this.http.post<any>(this.apiUrl.apiSaveTechSupportTeams(), userData);
  }

  updateDefaultTeam(userData) {
    return this.http.post<any>(this.apiUrl.apiUpdateDefaultTeam(), userData);
  }

  checkSupportTeamName(userData) {
    return this.http.post<any>(this.apiUrl.apiCheckSupportTeamName(), userData);
  }
  
  apiTechSupportMenusAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiTechSupportMenus(), userData);
  }

  
  techSupportWidgetsAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiTechSupportWidgets(), userData);
  }

  techSupportPriorityDataList(userData) {
    return this.http.post<any>(this.apiUrl.apiTechSupportPriorityDataList(), userData);
  }
  updateTechSupportPriorityData(userData) {
    return this.http.post<any>(this.apiUrl.apiupdateTechSupportPriorityData(), userData);
  }
  

  getSolrSearchReport(reportData) {
    const body = JSON.stringify(reportData);
    return this.http.post<any>(this.apiUrl.apiSolrReportSearchList(), body)
  }

  manageSolrReport(reportData) {
    const body = JSON.stringify(reportData);
    return this.http.post<any>(this.apiUrl.apiSolrManageReport(), body)
  }

  // updatehelp content
  docApprovalStatusChangeAPI(mData) {
    return this.http.post<any>(this.apiUrl.apiDocApprovalStatusChange(), mData);
  }

  // updatehelp content
  sharedFixApprovalStatusChangeAPI(mData) {
    return this.http.post<any>(this.apiUrl.apiSharedFixApprovalStatusChange(), mData);
  }

  // updatehelp content
  kaizenApprovalStatusChangeAPI(mData) {
    return this.http.post<any>(this.apiUrl.apiKaizenApprovalStatusChange(), mData);
  }

  
  getOpportunityList(optData) {
    return this.http.post<any>(this.apiUrl.apiOpportunityList(), optData);
  }

  // Update Mfg Name Api
  updateMfgName(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("domainId", data.domainId)
    return this.http.get<any>(this.apiUrl.apiUpdateMfgName(), {
      params: params,
    });
  }

  // Get Recall Data
  getRecallData(recallData) {
    return this.http.post<any>(this.apiUrl.apiRecallData(), recallData);
  }

}
