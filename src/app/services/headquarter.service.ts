import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../common/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class HeadquarterService {

  public networkEmpty: boolean;
  public levelOneName: string = "";
  public levelOneId: string = "0";
  public levelTwoName: string = "";
  public levelTwoId: string = "0";
  public levelThreeName: string = "";
  public levelThreeId: string = "0";
  public levelName: string = "";
  public sublevelName: string = "";
  public sublevelId: string = "";
  public currentShopName: string = "";
  public currentShopId: string = "";
  public dekraBaseUrl: string = Constant.DekraApiUrl;
  public userListState: any
  public toolListState: any


  constructor(private http: HttpClient) { }
  baseUrl = Constant.DekraApiUrl;


  neworkUpdate(payLoad) {
    return this.http.post(this.baseUrl + `network/manage-network-update`, payLoad)
  }
  saveuser(payLoad) {
    return this.http.post(this.baseUrl + `accounts/saveusers`, payLoad)
  }
  getUserDetails(payLoad) {
    return this.http.post(this.baseUrl + `accounts/get-user-details`, payLoad)
  }
  getNetworkhqList(payLoad) {
    return this.http.post(this.baseUrl + `network/network-hq-list`, payLoad)
  }
  manageNetworkhqList(payLoad) {
    return this.http.post(this.baseUrl + `network/manageattributesinfo`, payLoad)
  }
  getAttributeDetail(payLoad) {
    return this.http.post(this.baseUrl + `network/getattributesdetail`, payLoad)
  }
  saveLevel(payLoad) {
    return this.http.post(this.baseUrl + `network/manageattrdatainfo`, payLoad)
  }
  getattributeslist(payLoad) {
    return this.http.post(this.baseUrl + `network/getattributeslist`, payLoad)
  }
  getShopList(payLoad) {
    return this.http.post(this.baseUrl + `network/shoplist`, payLoad)
  }
  getShopListDetail(payLoad) {
    return this.http.post(this.baseUrl + `network/shoplistdetail`, payLoad)
  }
  saveShop(payLoad) {
    return this.http.post(this.baseUrl + `network/manageshop`, payLoad)
  }
  manageShopDetail(payLoad) {
    return this.http.post(this.baseUrl + `network/manageshopdetail`, payLoad)
  }
  getCommonList(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `network/commondatalist`, payLoad)
  }
  getUserList(payLoad) {
    return this.http.post(this.baseUrl + `accounts/userslist`, payLoad)
  }

  saveTools(payLoad) {
    return this.http.post(this.baseUrl + `network/managetooleqipment`, payLoad)
  }

  getToolsList(payLoad) {
    return this.http.post(this.baseUrl + `network/toolsequiplist`, payLoad)
  }

  saveProduct(payLoad) {
    return this.http.post(this.baseUrl + `network/managetoolshop`, payLoad)
  }

  getShopToolsList(payLoad) {
    return this.http.post(this.baseUrl + `network/toolshoplist`, payLoad)
  }

  getShopProdList(payLoad) {
    return this.http.post(this.baseUrl + `network/toolshopprodlist`, payLoad)
  }

  deleteTool(payLoad) {
    return this.http.post(this.baseUrl + `network/toolsdelete`, payLoad)
  }

  getGtsList(payLoad) {
    return this.http.post(this.baseUrl + `gts/list`, payLoad)
  }

  saveGtsProcedure(payLoad) {
    return this.http.post(this.baseUrl + `gts/savegtsprocedure`, payLoad)
  }


  getTemplateList(payLoad) {
    return this.http.post(this.baseUrl + `network/templatelist`, payLoad)
  }

  saveTemplate(payLoad) {
    return this.http.post(this.baseUrl + `network/managetemplates`, payLoad)
  }

  getInspectionList(payLoad) {
    return this.http.post(this.baseUrl + `network/inspectionlist`, payLoad)
  }

  updateInspectionDescription(payLoad) {
    return this.http.post(this.baseUrl + `network/updateinspectionassessment`, payLoad)
  }

  saveInspection(payLoad) {
    return this.http.post(this.baseUrl + `network/manageinspections`, payLoad)
  }

  deleteInspection(payLoad) {
    return this.http.post(this.baseUrl + `network/inspectiondelete`, payLoad)
  }

  deleteTemplate(payLoad) {
    return this.http.post(this.baseUrl + `network/templatedelete`, payLoad)
  }

  deleteSection(payLoad) {
    return this.http.post(this.baseUrl + `network/sectiondelete`, payLoad)
  }

  setPassword(payLoad) {
    return this.http.post(this.baseUrl + `accounts/setnewuserpassword`, payLoad)
  }

  getBannerList(payLoad) {
    return this.http.post(this.baseUrl + `accounts/bannerlist`, payLoad)
  }

  validateTools(payLoad) {
    return this.http.post(this.baseUrl + `network/validatetools`, payLoad)
  }

  manageUserData(payLoad) {
    return this.http.post(this.baseUrl + `/network/manageuserdata`, payLoad)
  }

  updateCommonValue(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `network/managecommonvalue`, payLoad)
  }

  getCertificationsList(data) {

  let url = this.baseUrl;
    return this.http.post(url + `certifications/list-certifications`, data)
  }
  getShopTechnologyList(data) {
    let url = this.baseUrl;
    let params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('userId', data.userId)
    return this.http.get<any>(url + `systemtechnology/list-system-technology`, { 'params': params })
  }
  getShopCertificationsList(data) {
    let url = this.baseUrl;
    let params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('userId', data.userId)
    return this.http.get<any>(url + `shopcertification/list-shop-certification`, { 'params': params })
  }
  getShopPoliciesList(data) {
    let url = this.baseUrl;
    let params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('userId', data.userId)
    return this.http.get<any>(url + `subscriptionpolicies/list-subscription-policies`, { 'params': params })
  }

  getTrainingsList(data) {

   let url = this.baseUrl;
    return this.http.post(url + `trainingdata/list-trainings`, data)
  }

  getOrganisationsList(data) {
   let url = this.baseUrl;
    return this.http.post(url + `organisations/list-organisations`, data)
  }



  createCertification(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `certifications/create-certifications`, payLoad)
  }
  createTraining(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `trainingdata/create-training`, payLoad)
  }
  createOrganization(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `organisations/create-organisations`, payLoad)
  }
  createShopTechnology(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `systemtechnology/create-system-technology`, payLoad)
  }
  createSubscriptionPolicies(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `subscriptionpolicies/create-subscription-policies`, payLoad)
  }
  createShopCertification(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `shopcertification/create-shop-certification`, payLoad)
  }
  updateCertification(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `certifications/update-certifications`, payLoad)
  }
  updateTraining(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `trainingdata/update-trainings`, payLoad)
  }
  updateOrganization(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `organisations/update-organisations`, payLoad)
  }
  updateSystemTechnology(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `systemtechnology/update-system-technology`, payLoad)
  }
  updateSubscriptionsPolicies(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `subscriptionpolicies/update-subscription-policies`, payLoad)
  }
  updateShopCertification(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `shopcertification/update-shop-certification`, payLoad)
  }

  deleteCertification(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `certifications/delete-certifications`, payLoad)
  }
  deleteShopCertification(payLoad) {

    let url = this.baseUrl;
     return this.http.post(url + `shopcertification/delete-shop-certification`, payLoad)
   }
  deleteTraining(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `trainingdata/delete-trainings`, payLoad)
  }
  deleteSystemTechnology(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `systemtechnology/delete-system-technology`, payLoad)
  }
  deleteSubscriptionsPolicies(payLoad) {

    let url = this.baseUrl;
    return this.http.post(url + `subscriptionpolicies/delete-subscription-policies`, payLoad)
  }
  deleteOrganization(payLoad) {

   let url = this.baseUrl;
    return this.http.post(url + `organisations/delete-organisations`, payLoad)
  }

}

