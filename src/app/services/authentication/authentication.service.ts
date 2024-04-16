import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { BehaviorSubject, Observable } from "rxjs";
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import {
  pageInfo,
  Constant,
  PlatFormType,
  PlatFormNames,
} from "src/app/common/constant/constant";
import { map } from "rxjs/operators";
import { User } from "../../components/_models/user";
import { Router } from "@angular/router";
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoPermissionPopupComponent } from '../../components/common/no-permission-popup/no-permission-popup.component';
import { ViewKaDetailComponent } from '../../components/common/view-ka-detail/view-ka-detail.component';
import { ViewDocumentDetailComponent } from 'src/app/components/common/view-document-detail/view-document-detail.component';

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public apiKey: string = Constant.ApiKey;
  public checkAccessVal : boolean = false;
  public checkAccessItems: any = [];
  public bodyElem;
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private http: HttpClient,
    private apiUrl: ApiService,
    private dashboardService: DashboardService,
    private modalService: NgbModal,
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();

    let user = JSON.parse(localStorage.getItem("user"));
      if(user && this.apiUrl.enableAccessLevel) {
        let domainId = user?.domain_id;
        let userId = user?.Userid;
        let roleId = user?.roleId;
        let apiData = {
          'apiKey': this.apiKey,
          'userId': userId,
          'domainId': domainId,
          'roleId': roleId,
          'adminPage' : 0
        };
        this.dashboardService.getRolesAndPermissions(apiData).subscribe(roles => {
          localStorage.setItem('param',JSON.stringify(roles));
        })
      }
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  //register email id / user name and password
  //register profile details
  signup(signupData) {
    return this.http.post<any>(this.apiUrl.apiSignup(), signupData);
  }
  // validate username or email
  // validate password
  // login
  login(loginData,type='') {
    localStorage.removeItem("loggedOut");
    return this.http.post<any>(this.apiUrl.apiLogin(type), loginData);
  }

  checkAccountInfo(loginData) {

    return this.http.post<any>(this.apiUrl.apicheckAccountInfo(), loginData);
  }

  //register / login success data
  UserSuccessData(user) {
    // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
    localStorage.setItem("user", JSON.stringify(user));
    //console.log(JSON.stringify(user));
    this.userSubject.next(user);
    return user;
  }

  ChatUCodeNew(theString) {
    var unicodeString = '';
    for (let i = 0; i < theString.length; i++) {
      var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    return unicodeString;
  }

  ChatUCode(t) {
    var S = '';
    for (let a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S += '\\u' + ('0000' + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    return S;
    //console.log(S);
  }

  ChatUCode1(t) {
    var S = "";
    for (let a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S +=
          "\\u" +
          ("0000" + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    //console.log(S);
    return S;
  }

  convertunicode(val) {
    val = val.replace(/\\n/g, '')
      //.replace(/'/g, '"')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
      .replace(/\\u2019/g, "'")
      .replace(/\\u201C/g, '"')
      .replace(/\\u201D/g, '"');

      // remove non-printable and other non-valid JSON chars
      val = val.replace(/[\u0000-\u0019]+/g,"");

    if (val == undefined || val == null) {
      return val;
    }
    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {

      JSON.stringify(val)
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
      //return (JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"'));\
      if (this.IsJsonString(val)) {
        return (JSON.parse('"' + val.toString().replace(/\\"/g, '"').replace(/"/g, '\\"') + '"'));
      }
      else
      {
        let platformId = localStorage.getItem("platformId");
        if(platformId=='3')
        {
          //return val;
          return (JSON.parse('"' + val.toString().replace(/\\"/g, '"').replace(/"/g, '\\"') + '"'));
        }
        else
        {
          return (JSON.parse('"' + val.toString().replace(/\\"/g, '"').replace(/"/g, '\\"') + '"'));
        }

      }

  //return val;
  }

    else {
      return val;
    }

  }

  convertunicode1(val) {
    val = val.replace(/\\n/g, '')

      .replace("\\u2013", "")
      .replace(/'/g, '"')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");

    if (val == undefined || val == null) {
      return val;
    }

    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {
      //  JSON.stringify(val)
      if (this.IsJsonString(val)) {
        return JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"');
      } else {
        return val;
      }
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
    } else {
      return val;
    }
  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  urladdTarget(text) {
   // return text;
    if (/href/.test(text)) {
      return text.toString().replace(/<a/gi, '<a target="_blank"');
    }
    else
    {
      return text;
    }


    //return text.replace('<a ','<a ');
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

 URLReplacer(str){

    let userAgent = navigator.userAgent;
    let browserName;
    if(userAgent.match(/chrome|chromium|crios/i)){
      browserName = "chrome";
    }else if(userAgent.match(/firefox|fxios/i)){
      browserName = "firefox";
    }  else if(userAgent.match(/safari/i)){
      browserName = "safari";
    }else if(userAgent.match(/opr\//i)){
      browserName = "opera";
    } else if(userAgent.match(/edg/i)){
      browserName = "edge";
    }else{
      browserName="No browser detection";
    }

    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    if (/img/.test(str)) {

      str =this.urladdTarget(str);
      return str;
    }

    if (/href/.test(str)) {

      str =this.urladdTarget(str);
      return str;
    }

    let match = str.match(/(?!href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);

    let match2 = str.match(/(?!href=")(^|[^\/])(www\.[\S]+(\b|$))/ig);
    let final=str;
    if(match)
    {
      match.map(url=>{
        final=final.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
      });
      replacePattern2 = /(?!href=")(^|[^\/])(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //content.replace(/<[^>]*>/g, '');
      final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

     // replacePattern3 = /(?href=")([\S]+(\b|$))(^.com)/ig;
      //content.replace(/<[^>]*>/g, '');
     // final = final.replace(replacePattern3, '<a href="http://$1" target="_blank">$1</a>');


      // replacePattern1 = /(?<!href=")(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      //final = final.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

     // replacePattern2 = /(?<!href=")(^|[^\/])(www\.[\S]+(\b|$))/gim;
      //final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    }
    else
    {
      replacePattern2 = /(?!href=")(^|[^\/])(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //content.replace(/<[^>]*>/g, '');
      final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    }
final =this.urladdTarget(final);
    return final;
  }
 /*
 // safari issue, updated below function
 URLReplacer1111(str) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.CbaForum) {
      if (/href/.test(str)) {
        return str;
      }
      if (/img/.test(str)) {
        return str;
      }
    }

    let match = str.match(/(?<!href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);

    let match2 = str.match(/(?<!href=")(^|[^\/])(www\.[\S]+(\b|$))/ig);
    let final = str;
    if (match) {
      match.map(url => {
        console.log(url)
        final = final.replace(url, "<a href=\"" + url + "\" target=\"_BLANK\">" + url + "</a>")
      });
      replacePattern2 = /(?<!href=")(^|[^\/])(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //content.replace(/<[^>]*>/g, '');
      final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      // replacePattern3 = /(?:href=")([\S]+(\b|$))(^.com)/ig;
      //content.replace(/<[^>]*>/g, '');
      // final = final.replace(replacePattern3, '<a href="http://$1" target="_blank">$1</a>');


      // replacePattern1 = /(?:href=")(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      //final = final.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

      // replacePattern2 = /(?:href=")(^|[^\/])(www\.[\S]+(\b|$))/gim;
      //final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    }
    else {
      replacePattern2 = /(?<!href=")(^|[^\/])(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //content.replace(/<[^>]*>/g, '');
      final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    }

    return final;
  }
  */
  baseName(str){
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
    /*if(base.lastIndexOf(".") != -1)
    base = base.substring(0, base.lastIndexOf("."));
    console.log(base);*/
    return base;
  }
  openPOPUPDetailView(typeId,id){
    switch(typeId){
      case 4:
        this.bodyElem = document.getElementsByTagName('body')[0];
        if(document.body.classList.contains("view-modal-popup")) { }
        else{ this.bodyElem.classList.add("view-modal-popup"); }
        const modalRef1 = this.modalService.open(ViewDocumentDetailComponent, {backdrop: 'static', keyboard: true, centered: true});
        modalRef1.componentInstance.dataId = id;
        modalRef1.componentInstance.documentServices.subscribe((receivedService) => {
          console.log(receivedService);
          modalRef1.dismiss('Cross click');
          setTimeout(() => {
            this.bodyElem = document.getElementsByTagName('body')[0];
            this.bodyElem.classList.remove("view-modal-popup");
            }, 100);
        });

        break;
      case 7:
        this.bodyElem = document.getElementsByTagName('body')[0];
        if(document.body.classList.contains("view-modal-popup")) { }
        else{ this.bodyElem.classList.add("view-modal-popup"); }
        const modalRef2 = this.modalService.open(ViewKaDetailComponent, {backdrop: 'static', keyboard: true, centered: true});
        modalRef2.componentInstance.knowledgeArticleId = id;
        modalRef2.componentInstance.KAServices.subscribe((receivedService) => {
          console.log(receivedService);
          modalRef2.dismiss('Cross click');
          setTimeout(() => {
            this.bodyElem = document.getElementsByTagName('body')[0];
            this.bodyElem.classList.remove("view-modal-popup");
            }, 100);
        });
        break;
    }


  }
  checkPwdStrongLength(password, maxLength) {
    let toLowerCaseCount = 0;
    let toUpperCaseCount = 0;
    let toSpecialCaseCount = 0
    let validateMsg = '';

    if (password.match(/[a-z]+/)) {
      toLowerCaseCount = 1;
    }
    if (password.match(/[A-Z]+/)) {
      toUpperCaseCount = 1;
    }
    if (password.match(/[#$%&!'()*+,-./:;<=>?@[\]^_`{|}~]+/)) {
      toSpecialCaseCount = 1;
    }

    if (password.length < maxLength) {
      validateMsg = 'Password must have min. ' + maxLength + ' chars.';
    }
    else {
      if (toLowerCaseCount == 0 && toUpperCaseCount == 1 && toSpecialCaseCount == 1) {
        validateMsg = 'Password must have one lowercase';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 0 && toSpecialCaseCount == 1) {
        validateMsg = 'Password must have one uppercase';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 1 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one special character';
      }
      if (toLowerCaseCount == 0 && toUpperCaseCount == 0 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one uppercase, one lowercase & one special character';
      }
      if (toLowerCaseCount == 0 && toUpperCaseCount == 0 && toSpecialCaseCount == 1) {
        validateMsg = 'Password must have one lowercase  & one uppercase';
      }
      if (toLowerCaseCount == 0 && toUpperCaseCount == 1 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one lowercase & one special character';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 0 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one uppercase  & one special character';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 1 && toSpecialCaseCount == 1) {
        validateMsg = '';
      }
    }
    return validateMsg;
  }

  checkAccess(page,type,iscontentType=false,iscontentTypeCheck=false){
    let user = JSON.parse(localStorage.getItem("user"));
    let domainId = user?.domain_id;
    let accessData = [];
    if(user) {
      let userId = user?.Userid;
      let roleId = user?.roleId;
      let apiData = {
        'apiKey': this.apiKey,
        'userId': userId,
        'domainId': domainId,
        'roleId': roleId,
        'adminPage' : 0
      };
      if(iscontentType) {
        apiData['contentTypeId'] = page
      }

      this.dashboardService.getRolesAndPermissions(apiData).subscribe(roles => {
        localStorage.setItem('param',JSON.stringify(roles));
        let rolesData = roles;
        if(rolesData){
          if(iscontentType && !iscontentTypeCheck) {
            accessData = rolesData.items;
          } else if(iscontentType && iscontentTypeCheck && page!=33) {
            let newFiltered = rolesData.items[0].pageAccess.find((item) => item.name == type);
            let permission = newFiltered?.roles?.find((role) => role.id == roleId);
            if(permission?.access == 0){
              this.modalService.open(NoPermissionPopupComponent, {backdrop: 'static', keyboard: false, centered: true});
              this.checkAccessVal = false;
            } else {
              this.checkAccessVal = true;
            }
          } else {
            let filtered = rolesData.items.find((item) => item.contentTypeId == page);
            if (filtered !== undefined) {
              let newFiltered = filtered?.pageAccess.find((item) => item.name == type);
              let permission = newFiltered?.roles?.find((role) => role.id == roleId);
              if(permission?.access == 0){
                this.modalService.open(NoPermissionPopupComponent, {backdrop: 'static', keyboard: false, centered: true});
                this.checkAccessVal = false;
              }
              else{
                this.checkAccessVal = true;
              }
            }
            else{
              this.checkAccessVal = true;
            }
          }
        } else {
          if(!iscontentType)
            this.checkAccessVal = true;
        }
        if(iscontentType && !iscontentTypeCheck) {
          this.checkAccessItems = accessData;
        }
      });
    }
  }

  checkDomain() {
    let umUrl = 'under-maintenance';
    let maintanancePopup = localStorage.getItem("maintanancePopup");
    if (maintanancePopup == '0') {
      return true;
    }
    else {
      let domainName = localStorage.getItem("domainName");
      const subDomainData = new FormData();
      subDomainData.append('apiKey', Constant.ApiKey);
      subDomainData.append('domainName', domainName);
      this.validateSubDomain(subDomainData).subscribe((response) => {
        if (response.status == "Success") {
          if (response.maintanancePopup == '1') {
            localStorage.setItem("maintanancePopup", '1');
            setTimeout(() => {
              this.router.navigate([umUrl]);
            }, 500);
          }
          else {
            localStorage.setItem("maintanancePopup", '0');
            return true;
          }
        }
        else {
          localStorage.setItem("maintanancePopup", '0');
          return true;
        }
      });
    }

  }

  //logout user
  logout() {
    // remove user from local storage to log user out
    let lid = localStorage.getItem("languageId");
    let lname = localStorage.getItem("languageName");

    let teamSystem = localStorage.getItem("teamSystem");
    localStorage.removeItem("user");
    if (teamSystem) {
      this.authService.logoutRedirect();
      /*
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
   });
   */
    }

    this.userSubject.next(null);

    localStorage.clear();

    // Collabtic setup
    let platformId = PlatFormType.Collabtic;
    let PlatFormName = PlatFormNames.Collabtic;

    // Mahle setup
    //let platformId = PlatFormType.MahleForum;
    //let PlatFormName = PlatFormNames.MahleForum;
    //let PlatFormName = PlatFormNames.Tvs;

    // CBA Forum
    //let platformId = PlatFormType.CbaForum;
    //let PlatFormName = PlatFormNames.CbaForum;

    localStorage.setItem("languageId", lid);
    localStorage.setItem("languageName", lname);

    localStorage.setItem("platformId", platformId);
    localStorage.setItem("platformName", PlatFormName);

    localStorage.setItem("loggedOut", "1");
    if (teamSystem) {
      this.router.navigate(["auth/integration"]);
    } else {
      localStorage.removeItem("teamSystem");
      let url = '/auth/login';
      let platformId = localStorage.getItem("platformId");
      if(window.location.host==Constant.knowledgeForumHostName)
      {
        url = 'auth/integration';
        //this.router.navigate(["auth/integration"]);
        window.location.href = url;
      }
      else if( window.location.host==Constant.repairifySSoForumHostName  || window.location.host==Constant.repairifyForumHostName)
      {
        url = '/auth/login-type';
        //url='login-index/'+Constant.repairifyForumDomainId;
        //this.router.navigate(["auth/integration"]);
        window.location.href = url;
      }
      else if (window.location.host==Constant.cbatacbetaForumHostName || window.location.host==Constant.cbatacForumHostName) {
        window.location.href = 'sso/index.php?slo';
      }
      else
      {

        window.location.href = url;
      }

      //this.router.navigate(["auth"]);
    }
  }

  // validate sub domain
  validateSubDomain(domainData) {
    return this.http.post<any>(this.apiUrl.apivalidateSubDomain(), domainData);
  }

  //validate email
  resetPassword(rpData) {
    return this.http.post<any>(this.apiUrl.apiResetPassword(), rpData);
  }

  //reset password
  changePassword(cpData) {
    return this.http.post<any>(this.apiUrl.apiChangePassword(), cpData);
  }

  // Change password
  changeUserPassword(cpData) {
    return this.http.post<any>(this.apiUrl.apiChangeUserPassword(), cpData);
  }

  apiSaveDocumentFolder(cpData) {
    return this.http.post<any>(this.apiUrl.apiSaveDocumentFolder(), cpData);
  }

  apiGetDocumentFolder(cpData) {
    return this.http.post<any>(this.apiUrl.apiGetDocumentFolder(), cpData);
  }

  apiGetDashboardUpdate(cpData) {
    return this.http.post<any>(this.apiUrl.apiGetDashboardUpdate(), cpData);
  }

  
  apiSaveCategoryFolder(cpData) {
    return this.http.post<any>(this.apiUrl.apiSaveCategoryFolder(), cpData);
  }

  // resent verification email
  resetVerificationEmail(mData) {
    return this.http.post<any>(this.apiUrl.apiResetVerificationEmail(), mData);
  }

  // user checked verification email
  verifiedEmail(mData) {
    return this.http.post<any>(this.apiUrl.apiVerifiedEmail(), mData);
  }

  // get language list
  getLanguageList(mData) {
    return this.http.post<any>(this.apiUrl.apiGetLangUageList(), mData);
  }

  // set language list
  saveUserLanguageOption(mData) {
    return this.http.post<any>(this.apiUrl.apiSaveUserLanguageOption(), mData);
  }
  //
  tvsSSOLogin(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSOLogin(), mData);
  }
  //
  tvsSSODealerLogin(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSODealerLogin(), mData);
  }
  // Get employee Info
  getEmployeeInfoTVSSSO(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSOGetEmployeeInfo(), mData);
  }
   // Get dealer Info
   getDealerInfoTVSSSO(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSOGetDealerInfo(), mData);
  }

  // user checked verification email
  getPolicyContent(mData) {
    return this.http.post<any>(this.apiUrl.apiGetPolicyContent(), mData);
  }
  newBusinessSignup(newbsignupData) {
    return this.http.post<any>(this.apiUrl.apiNewBusinessSignup(), newbsignupData);
  }
  //
  newBusinessSetup(mData) {
    return this.http.post<any>(this.apiUrl.apiNewBusinessSetup(), mData);
  }
  saveBusinessOptions(mData) {
    return this.http.post<any>(this.apiUrl.apiSaveBusinessOptions(), mData);
  }
  businessInviteNewMembers(mData) {
    return this.http.post<any>(this.apiUrl.apiBusinessInviteNewMembers(), mData);
  }
  decodeEmailaddress(mData) {
    return this.http.post<any>(this.apiUrl.apiDecodeEmailaddress(), mData);
  }
}

