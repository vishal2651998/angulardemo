import { Component, OnInit, Output, Input, HostListener, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SelectCountryComponent } from '../../../../../components/common/select-country/select-country.component';
import { ForgotpasswordComponent } from '../../../../../components/common/forgotpassword/forgotpassword.component';
import { DomainUrlComponent } from '../../../../../components/common/domain-url/domain-url.component';
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { ApiService } from '../../../../../services/api/api.service';
import { Title } from '@angular/platform-browser';
import { CommonService } from "src/app/services/common/common.service";
import { pageInfo, Constant, PlatFormNames, PlatFormType,PlatFormDomains,PlatFormDomainsIdentity,MahleKIAaccess } from 'src/app/common/constant/constant';
declare var $: any;
declare var CryptoJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() public domainURLResponce;
  @Input() public selectResponce; 
  @ViewChild('myInput1') myInput1Element: ElementRef;
  @ViewChild('myInput2') myInput2Element: ElementRef;
  @ViewChild('myInput3') myInput3Element: ElementRef;  

  public loading: boolean = true;
  public loading1: boolean = false;
  public loading2: boolean = false;
  public loading3: boolean = false;

  public enterDomainNameFlag: boolean = false;
  public setbgClassName: string = 'login-bg';
  public subdomainForm: FormGroup;
  public subDomainFlag: boolean = false;
  public domainServerErrorMsg: string = '';
  public domainServerError = false;
  public MainDomainName: string = '.collabtic.com';
  public MainDomainNameIdentity: string = '.collabtic.com';
  public subdomainSubmitted: boolean = false;
  public subDomainURL: string = '';
  public domainId;
  public domainName: string = '';
  public splittedDomainURL: string = '';
  public splittedDomainURLLocal: any;
  public companyNameInputFlag: boolean;
  public headerLogo: string = 'assets/images/login/collabtic-logo-blacktext.png';
  public platformIdInfo= localStorage.getItem('platformId');
  
  public loginForm: FormGroup;
  public loginFlag: boolean = false;
  public loginFlagS1: boolean = false;
  public loginFlagS2: boolean = false;
  public loginSubmitted: boolean = false;
  public userNameInputFlag: boolean;
  public passwordInputFlag: boolean;
  public passwordInputArrowFlag: boolean = false;
  public loginUserError: boolean = false;
  public loginPwdError: boolean = false;
  public loginServerErrorMsg: string = '';
  public loginServerError = false;
  public userImg: string = "assets/images/login/default-img.png";
  public userId;
  public loginUserName: string = '';
  public loginEmail: string = '';
  public returnUrl;
  public fromSSO=false;
  public nastfUserId;
  public nastfEmailId;
  public fromNastfsso;
  public title='Login';
  public bodyHeight: number;
  public innerHeight: number;  
  public redirectUrl: string = "landing-page";
  //public redirectUrl: string = "threads";
  public pwdFieldTextType: boolean = false;
  public countryId = Constant.CountryID;
  public countryName = Constant.CountryName;
  public languageId = Constant.LanguageID;
  public languageName = Constant.LanguageName;
  public countryInfo: any;
  public showLanguageFlag: boolean = false;
  public showCountryFlag: boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public tvsSSOFlag: boolean = false;
  public tvsSSOFlagNormalFlow: boolean = false;
  public tvsSSOOtherFlag: boolean = false;
  public umUrl: string = 'under-maintenance';
  public fromSystem: string = '0';
  public fsDomainId;
  public fsDomainName;
  public fsplatformId;
  public fsemail;
  public fspwd;
  public userTypeId: string = '';
  public roleId;
  public TVSIBDomain: boolean = false;
  public repairifyFlag: boolean=false;
  public brandingPage: string = '0';
  public landingBannerFit: boolean = false;
  public loginImageUrl: string = '';

  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    private titleService: Title
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    //this.titleService.setTitle('Collabtic - Login');
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void { 
    
    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
    this.route.queryParams.subscribe(params => {
      this.fromSystem = params['fs'];
      if(this.fromSystem == '1'){
        this.fromSSO=true;
        this.fsDomainId = params['dId'];
        this.fsDomainName = params['dName'];
        this.fsplatformId = params['pId'];
        let emailVal: string;   
        emailVal = params['email']; 
        if(emailVal)
        {
          this.fsemail = atob(emailVal);
        }       
      
        let pwdVal: string;  
        pwdVal = params['pwd']; 
        if(pwdVal)
        {

              
        this.fspwd = atob(pwdVal); 
      }
        this.fromSystemLogin();
      }
     
      if(params['domainId']){

      let nastfDomainId = params['domainId'];
     nastfDomainId=nastfDomainId.replace(/ /g, '+');
  let nastfdomainInfo = CryptoJS.AES.decrypt(nastfDomainId, Constant.NASTFpassphrase);
this.fsDomainId=nastfdomainInfo.toString(CryptoJS.enc.Utf8);
     if(this.fsDomainId==317)
     {
console.log(this.fsDomainId);
let nastfuid = params['uid'];
nastfuid=nastfuid.replace(/ /g, '+');
let nastfuidInfo = CryptoJS.AES.decrypt(nastfuid, Constant.NASTFpassphrase);
this.nastfUserId=nastfuidInfo.toString(CryptoJS.enc.Utf8);
console.log(this.nastfUserId);

let nastfeid = params['eid'];
nastfeid=nastfeid.replace(/ /g, '+');
let nastfeidInfo = CryptoJS.AES.decrypt(nastfeid, Constant.NASTFpassphrase);
this.nastfEmailId=nastfeidInfo.toString(CryptoJS.enc.Utf8);
console.log(this.nastfEmailId);
this.fsemail=this.nastfEmailId;
this.fromNastfsso="1";
this.fromSystemLogin();
     }

     }
    
    });
    
    let platformId=localStorage.getItem('platformId');
    if(platformId == PlatFormType.MahleForum)
    {
      this.MainDomainName=PlatFormDomains.mahleDomain;
      this.MainDomainNameIdentity=PlatFormDomainsIdentity.mahleDomain;      
      this.headerLogo = 'assets/images/mahle-logo.png';
      this.showLanguageFlag = true;
    }
    else if(platformId == PlatFormType.CbaForum)
    {
      this.MainDomainName=PlatFormDomains.mahleDomain;
      this.MainDomainNameIdentity=PlatFormDomainsIdentity.mahleDomain;      
      this.headerLogo = 'assets/images/cba-logo.png';
      this.showLanguageFlag = true;
    }
    else
    {
      this.MainDomainName=PlatFormDomains.CollabticDomain;
      this.MainDomainNameIdentity=PlatFormDomainsIdentity.CollabticDomain;
      this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';
      this.showLanguageFlag = false;
    }   
    if(Constant.TVSSSO == '1'){  // check TVSSSO Process 
      this.tvsSSOFlag = true;
      this.tvsSSOFlagNormalFlow = true;
      localStorage.removeItem('employeeId');
      localStorage.removeItem('employeePwd');  
      localStorage.removeItem('employeeType');
      localStorage.removeItem('employeeEmail');
      localStorage.removeItem('pageNavAuth');    
    }      
    // default set country id and name
    localStorage.setItem('countryId', this.countryId);
    localStorage.setItem('countryName', this.countryName);
    localStorage.setItem('multipleCountry','0');
    let languageIdVal = localStorage.getItem('languageId');   
    let languageIdFlag =  languageIdVal == undefined || languageIdVal == 'undefined' || languageIdVal == null || languageIdVal == 'null' ? false : true;
    if(languageIdFlag){
      this.languageId = localStorage.getItem('languageId');
      this.languageName = localStorage.getItem('languageName');
    }
    else{
      localStorage.setItem('languageId', this.languageId);
      localStorage.setItem('languageName',this.languageName);
    }
   
    this.returnUrl = "";
    this.loading = true;

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    this.subdomainForm = this.formBuilder.group({
      companyName: ['', [Validators.required]]
    });

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    let currentURL = window.location.href;
    let splittedURL1 = currentURL.split("://");
   // splittedURL1[1] = "repairify.collabtic.com"; // check url
    let splittedURL2 = splittedURL1[1].split(".");
    this.splittedDomainURL = splittedURL2[0];

    this.splittedDomainURLLocal = this.splittedDomainURL.split(":");

    this.splittedDomainURL = splittedURL2[0];
    
    if (this.splittedDomainURL.length > 0) { 
      if (this.splittedDomainURL == Constant.forumLive || this.splittedDomainURL == 'repairify' || this.splittedDomainURL == Constant.forumDev || this.splittedDomainURL == Constant.forumDevCollabtic || this.splittedDomainURL == Constant.forumDevCollabticStage || this.splittedDomainURL == Constant.forumDevCollabticSolr || this.splittedDomainURL == Constant.forumDevMahle || this.splittedDomainURL == Constant.forumDevDekra || this.splittedDomainURL == Constant.forumStage || this.splittedDomainURLLocal[0] == Constant.forumLocal ||  this.splittedDomainURLLocal[0] == Constant.mahleforumDomain) {
        this.loading = false; 

        if(this.splittedDomainURL == 'repairify' && window.location.pathname=='/login')
        {
         
          this.subDomainFlag = false;
        }
        else
        {
          this.subDomainFlag = true;
        }
      
        
        if(this.splittedDomainURL == 'repairify')
        {
          this.repairifyFlag=true;
        }
       /* setTimeout(() => { // this will make the execution after the above boolean has changed
          this.myInput3Element.nativeElement.focus();
        }, 100);*/
        if(this.subDomainFlag){
          this.setbgClassName = 'login-bg';          
        }       
        else{
          if(this.domainId == '52'){
            this.setbgClassName = 'tvs-bg';
          }
          else{
            if(this.domainId == '69'){
              this.setbgClassName = 'canoo-bg'
            }
            else if(this.domainName == 'vinfast'){
              this.setbgClassName = 'vinfast-bg'
            }
            else if(this.domainId == '71'){
              this.setbgClassName = 'repairify_bg'
            }
            else{
              this.setbgClassName = 'business-bg'
            }
            //this.setbgClassName = (this.domainId == '69') ? 'canoo-bg' : 'business-bg';
          }          
        }
        //this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';
        this.loginFlag = false;
        this.loginFlagS1 = false;
        this.loginFlagS2 = false;

        if(this.subDomainFlag)
        {
          if(window.location.href==Constant.forumLiveURLmainPage || window.location.href==Constant.forumLiveURLmainPage+'/')
          {
            let umUrl='/login-type';
            this.router.navigate([umUrl]);
            this.subDomainFlag=false;

          }
          else
          {
            if(this.repairifyFlag)
            {
              if(window.location.href=='https://repairify.collabtic.com' || window.location.href=='https://repairify.collabtic.com/')
          {
              let umUrl='/login-type';
              this.router.navigate([umUrl]);
              this.subDomainFlag=false;
          }
            }

          }
          
         
        }
        else
        {
          this.checkSubDomainName(this.splittedDomainURL);
        }

      }
      else { 
        this.checkSubDomainName(this.splittedDomainURL);
      }
    }


    let popuppage = localStorage.getItem('popuppage');
    if (popuppage == 'domain') {
      this.domainURL();
      localStorage.removeItem('popuppage');
    }    

  }
  // Set Screen resize Height
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight;
  }
  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = this.bodyHeight;
  }

  // validate domain name 
  checkSubDomainName(domainName) {
    this.subDomainAPI(domainName);
  }

  // get the value from form
  subdomainFormValue() {
    this.enterDomainNameFlag = true;
    this.subDomainAPI(this.subdomainForm.value.companyName.trim());
  }
  // non tvs employee login
  returnLogin(id){
    if(id){
      this.userTypeId = id;
      this.tvsSSOFlag = false;  
      this.companyNameInputFlag = false;
      this.userNameInputFlag = false;
      this.passwordInputFlag = false;
      this.passwordInputArrowFlag = false;
      this.loginFlag = true;
      this.loginFlagS1 = true;          
      this.loginFlagS2 = false;
      this.loginForm.reset();
      this.subdomainForm.reset(); 
    }
  }
  enableTVSSSO(){
    this.tvsSSOFlag = true;
  }

  // show/hide password  
  showPassword(type) {
    this.pwdFieldTextType = (type) ? false : true;
  }

  // validate domain name 
  subDomainAPI(domainName) {
    //alert(domainName);
    this.loading1 = true;
    const subDomainData = new FormData();
    subDomainData.append('apiKey', Constant.ApiKey);
    subDomainData.append('domainName', domainName);
    let platformId=localStorage.getItem('platformId');
if(domainName.toLowerCase()=='kia' && platformId!='1')
{
  window.open(MahleKIAaccess.kiaUrl, '_self');
  return false;
}
    this.authenticationService.validateSubDomain(subDomainData).subscribe((response) => {
      if (response.status == "Success") {
        this.loading1 = false;
        let domainData = response.data[0];
        this.domainId = domainData.domainId;
        this.domainName = domainData.subDomain;            
        this.domainId = domainData.domainId;
        this.domainName = domainData.subDomain;
        if(domainData.businessBanner != null && domainData.businessBanner != ''){
          this.landingBannerFit = domainData.bannerOption == '1' ? true : false;
        }
        else{
          this.landingBannerFit = true;
        }        
        this.loginImageUrl = domainData.businessBanner != null &&  domainData.businessBanner != '' ? domainData.businessBanner : '/assets/images/login/business-bg.jpg';
        this.brandingPage = domainData.brandingPage;

        localStorage.setItem('domainId', this.domainId);
        localStorage.setItem('domainName', this.domainName);

        this.subDomainURL = this.domainName +   this.MainDomainName;

        if(this.splittedDomainURL ==  Constant.forumLive || this.splittedDomainURL ==  Constant.mahleforumDomain){ 
          
          if(this.brandingPage=='1'){           
            let loginindexdomain ='/login-index/'+this.domainId;
            window.location.replace('https://'+this.subDomainURL+loginindexdomain); 
            return false;            
          }

          window.location.replace('https://'+this.subDomainURL+Constant.liveSuffixURLLogin); 
        }
        else {  

          let currentURL = window.location.href;
          let splittedURL1 = currentURL.split("://");
                        
          if(this.brandingPage=='1' && (this.subDomainURL == splittedURL1[1] || splittedURL1[1]==this.subDomainURL+'/')){
            let umUrl='/login-index/'+this.domainId;
            this.router.navigate([umUrl]);
            return false;
          }

          // check the server manintenance        
          let platformId=localStorage.getItem("platformId");
          if(platformId!='1' && response.maintanancePopup == '1'){
            this.router.navigate([this.umUrl]);  
            localStorage.setItem("maintanancePopup",'1');          
          }
          else{
            localStorage.setItem("maintanancePopup",'0'); 
            this.loading = false;
              if (this.domainName != 'collabtic') {
                this.headerLogo = domainData.businessLogo;
              }
              this.loginForm.reset();
              this.subDomainFlag = false;
              if(this.subDomainFlag){
                this.setbgClassName = 'login-bg';
              }
              else{
                if(this.domainId == '52'){
                  this.setbgClassName = 'tvs-bg';
                }
                else{
                  if(this.domainId == '69'){
                    this.setbgClassName = 'canoo-bg'
                  }
                  else if(this.domainId == '71'){
                    this.setbgClassName = 'repairify_bg'
                  }
                  else if(this.domainName == 'vinfast'){
                    this.setbgClassName = 'vinfast-bg'
                  }
                  else{
                    this.setbgClassName = 'business-bg'
                  }
                  //this.setbgClassName = (this.domainId == '69') ? 'canoo-bg' : 'business-bg';
                }
              }
              this.TVSIBDomain = (this.domainId == '97') ? true : false;              
              this.companyNameInputFlag = false;
              this.userNameInputFlag = false;
              this.passwordInputFlag = false;
              this.passwordInputArrowFlag = false;
              this.loginFlag = true;
              this.loginFlagS1 = true;          
              this.loginFlagS2 = false; 

              //this.tvsSSOFlag = (this.domainId == '52' && this.domainName == 'tvs') ? true : false;      

            if(this.tvsSSOFlag){  // check TVSSSO Process   
                let types = response.userTypes;  
                localStorage.setItem("userTypes",JSON.stringify(types));
              } 
              else{
                setTimeout(() => { 
                  this.myInput1Element.nativeElement.focus(); 
                  // this will make the execution after the above boolean has changed 
                }, 100); 
              }  
            }   
          }            
      }
      else {
        this.subDomainFlag = true;
        setTimeout(() => { // this will make the execution after the above boolean has changed
          this.myInput3Element.nativeElement.focus();
        }, 100);
        this.loading = false;
        this.loading1 = false;
        this.companyNameInputFlag = true;
        if (this.enterDomainNameFlag) {
          this.domainServerErrorMsg = response.result;
          this.domainServerError = true;
        }
        else {
          this.router.navigate(["/auth/urlnotfound"]);
        }
      }
    },
      (error => {
        this.loading = false;
        this.loading1 = false;
        this.companyNameInputFlag = true;
        this.domainServerErrorMsg = error;
        this.domainServerError = true;
      })
    );
  }

  // validate user name
  loginSubmitStep1() {
    let networklogin = false;
    this.loading2 = true;
    const loginData = new FormData();
    //loginData.append('api_key', Constant.ApiKey);
    loginData.append('email', this.loginForm.value.userName.trim());
    loginData.append('username', this.loginForm.value.userName.trim());
    loginData.append('password', '');
    loginData.append('step', '1');
    //loginData.append('subdomainId', this.domainId);
    //loginData.append('subdomainName', this.domainName);
    if(this.userTypeId !=''){
      loginData.append('userType', this.userTypeId);
    }
    if(this.domainId == '364' || this.domainName == 'dekra'){
      networklogin = true;
      loginData.append('apiKey', Constant.ApiKey);
      loginData.append('subDomainId', '1');
      loginData.append('networkId', '');
      //loginData.append('userId', '1');
    }
    else{
      loginData.append('api_key', Constant.ApiKey);
      loginData.append('subdomainId', this.domainId);
      loginData.append('subdomainName', this.domainName);
      loginData.append('countryId', this.countryId);
    }
    let type = networklogin ? '1' : '';
    this.authenticationService.login(loginData, type).subscribe(
      response => {
        if (response.status == "Success") {

          
          localStorage.setItem('domainName', this.domainName);
          
          this.loading2 = false;
          let loginData = response.data;
          this.userImg = loginData.user_profile_img;
          this.domainId = response.domain_id;
          localStorage.setItem('domainId', this.domainId);          
          this.roleId = response.roleId;
          
          this.userId = response.Userid;
          localStorage.setItem('userId', this.userId);  
          this.loginUserName = response.Username;
          this.loginEmail = response.Email;
          this.loginFlagS1 = false;
          this.loginFlagS2 = true;  
          this.countryInfo = response.countryInfo;
          this.countryId = '';
          this.countryName = '';
          let allCAccess =  response.allCountryAccess;
          if(allCAccess == '1'){
            setTimeout(() => { // this will make the execution after the above boolean has changed
              this.myInput2Element.nativeElement.focus();
            }, 100);          
            localStorage.setItem('countryId', this.countryId);
            localStorage.setItem('countryName', this.countryName);            
            localStorage.setItem('allCountryAccess', "1");            
          }
          else{
            /*
            if(this.countryInfo != undefined){            
              //console.log(countryInfo[0]); 
              if(this.countryInfo.length>0){
                if(this.countryInfo.length == 1){
                  this.showCountryFlag = false;
                  console.log(this.countryInfo[0].id); 
                  console.log(this.countryInfo[0].name); 
                  this.countryId = this.countryInfo[0].id;
                  this.countryName = this.countryInfo[0].name;
                  localStorage.setItem('countryId', this.countryId);
                  localStorage.setItem('countryName', this.countryName);
                  setTimeout(() => { // this will make the execution after the above boolean has changed
                    this.myInput2Element.nativeElement.focus();
                  }, 100);
                }
                else{                
                  this.selectCountry(this.countryInfo);            
                } 
              }
              else{
                setTimeout(() => { // this will make the execution after the above boolean has changed
                  this.myInput2Element.nativeElement.focus();
                }, 100);
                localStorage.setItem('countryId', this.countryId);
                localStorage.setItem('countryName', this.countryName);
              }
            }
            else{  
              setTimeout(() => { // this will make the execution after the above boolean has changed
                this.myInput2Element.nativeElement.focus();
              }, 100);          
              localStorage.setItem('countryId', this.countryId);
              localStorage.setItem('countryName', this.countryName);            
            } 

            */
            setTimeout(() => { // this will make the execution after the above boolean has changed
              this.myInput2Element.nativeElement.focus();
            }, 100);          
            localStorage.setItem('countryId', this.countryId);
            localStorage.setItem('countryName', this.countryName);       
          }
                           
          
        }
        else {
          this.loading2 = false;
          this.loginServerErrorMsg = response.message;
          this.loginServerError = true;
          this.loginUserError = true;
        }
      },
      error => {
        this.loading2 = false;
        this.loginServerErrorMsg = error;
        this.loginServerError = true;
        this.loginPwdError = true;
      });
  }

  // login
  loginSubmitStep2() {
    let networklogin = false;
    this.loginPwdError = (this.loginForm.value.password.length < 6) ? true : false;

    if (this.loginPwdError) {
      return;
    }

    if(this.roleId == "10"){}
    else{
      if(this.countryInfo != undefined && this.countryId == ''){      
        if(this.countryInfo.length>0){
          if(this.countryInfo.length>1){
          //  this.selectCountry(this.countryInfo);
           // return;
          }
        }
      }
    }

    this.loading3 = true;
    const loginData = new FormData();   
    //loginData.append('api_key', Constant.ApiKey);
    loginData.append('email', this.loginEmail);
    loginData.append('username', this.loginUserName);
    loginData.append('password', this.loginForm.value.password.trim());
    loginData.append('step', '2');
    //loginData.append('subdomainId', this.domainId);
    //loginData.append('subdomainName', this.domainName);
    loginData.append('countryId', this.countryId);
    if(this.userTypeId !=''){
      loginData.append('userType', this.userTypeId);
    }
    if(this.domainId == '364' || this.domainName == 'dekra'){
      networklogin = true;
      loginData.append('apiKey', Constant.ApiKey);
      loginData.append('subDomainId', '1');
      loginData.append('networkId', '');
      //loginData.append('userId', '1');
    }
    else{
      loginData.append('api_key', Constant.ApiKey);
      loginData.append('subdomainId', this.domainId);
      loginData.append('subdomainName', this.domainName);
      loginData.append('countryId', this.countryId);
    }
    let type = networklogin ? '1' : '';
    this.authenticationService.login(loginData, type).subscribe(
      response => {
        if (response.status == "Success") {
          this.authenticationService.UserSuccessData(response);
          localStorage.setItem('userId', response.Userid);
          this.userId = response.Userid;
          if(response.firstWorkstream)
          {
            localStorage.setItem('firstWorkstream', response.firstWorkstream);
          }
          if(response.domainCountryInfo)
          {
            localStorage.setItem('domainCountryInfo', JSON.stringify(response.domainCountryInfo));
            
          }

          localStorage.setItem('userId', response.Userid);
              localStorage.setItem('key', response.Userid);
          localStorage.setItem('domain_id', this.domainId);   
        // Set Cookie for to access this value in 1.0 PHP Cookie 
          document.cookie = "key=" + response.Userid + "; path=/;";
          document.cookie = "stagename=" + response.Username + "; path=/;";
          document.cookie = "domain_id=" + response.domain_id + "; path=/;";
          document.cookie = "role_id=" + response.roleId + "; path=/;";
          document.cookie = "dommainversion=" + response.domainVersion + "; path=/;";
          document.cookie = "forumdisplaytype=" + response.displayType + "; path=/;";
          document.cookie = "dommainversion=" + response.domainVersion + "; path=/;";
          document.cookie = "domainType=" + response.domainType + "; path=/;";
          
          document.cookie = "fromV2Access=" + '1' + "; path=/;";
          localStorage.setItem('fromV2Access','1');  
          
          if(networklogin){
            localStorage.setItem("dekradomain","1");
            if((response.networkId && response.networkId != '') && ( response.networkHqId && response.networkHqId !='' )){
              localStorage.setItem("dekraNetworkId", response.networkId);
              localStorage.setItem("dekraNetworkHqId", response.networkHqId);
              localStorage.setItem("dekradomainRPage","1");
              this.redirectUrl = 'headquarters/home';
            }
            else{
              this.redirectUrl = 'headquarters/home';
            }  
            
          }      
          //localStorage.setItem('teamSystem', "true"); 

          /*var retrunUrlval = localStorage.getItem("loginRedirect");
          var retrunUrlvalFlag = retrunUrlval == undefined || retrunUrlval == 'undefined' || retrunUrlval == null || retrunUrlval == 'null' ? false : true;
          if(retrunUrlvalFlag){
            setTimeout(() => {
              localStorage.removeItem("loginRedirect");
            }, 100); 
            this.router.navigate([retrunUrlval]); 
          }
          else{
            this.router.navigate([this.redirectUrl]); 
          } */  
          
        //  this.router.navigate([this.redirectUrl]); 
       
        //this.router.navigate([this.redirectUrl]);
        

        localStorage.setItem('logginState','1');
        window.name=this.redirectUrl;
        var w = window.open(this.redirectUrl, this.redirectUrl);
        if (w) 
        {
          window.location.href=this.redirectUrl;
        }
           
          
        
      ///  var customWindow = window.open(this.redirectUrl, this.redirectUrl);
       // customWindow.close();
          setTimeout(() => {
            this.loading3 = false;
           // var customWindow = window.open('auth', '_parent');
           // customWindow.close();
           // window.close();
           
          //  self.close();
         //   setTimeout(() => {window.close();}, 2000);
          //  setTimeout(() => {window.close();}, 4000);
          
        
          }, 1500);
          //this.router.navigate(['../login'], { relativeTo: this.route });
        }
        else {
          this.loading3 = false;
          this.loginServerErrorMsg = response.message;
          this.loginServerError = true;
          this.loginPwdError = true;
        }
      },
      error => {
        this.loading3 = false;
        this.loginServerErrorMsg = error;
        this.loginServerError = true;
        this.loginPwdError = true;
      });
  }

  fromSystemLogin(){    
    this.loading = true;
    const loginData = new FormData();   
    loginData.append('api_key', Constant.ApiKey);
    loginData.append('email', this.fsemail);
    loginData.append('username', this.fsemail);
    loginData.append('password', this.fspwd);
    loginData.append('fromNastfsso', this.fromNastfsso);
    loginData.append('userId', this.nastfUserId);
    loginData.append('step', '2');
    loginData.append('subdomainId', this.fsDomainId);
    loginData.append('subdomainName', this.fsDomainName);
    loginData.append('countryId', this.countryId);
    loginData.append('fromSSO', '1');
    
    this.authenticationService.login(loginData).subscribe(
      response => {
        if (response.status == "Success") {
          this.authenticationService.UserSuccessData(response);
          localStorage.setItem('userId', response.Userid);
          this.userId = response.Userid;
          if(response.firstWorkstream)
          {
            localStorage.setItem('firstWorkstream', response.firstWorkstream);
          }
          
          if(response.domainCountryInfo)
          {
            localStorage.setItem('domainCountryInfo', JSON.stringify(response.domainCountryInfo));
            
          }
          localStorage.setItem('userId', response.Userid);
          localStorage.setItem('logginState','1');
              localStorage.setItem('key', response.Userid);
          localStorage.setItem('domain_id', this.domainId);   
        // Set Cookie for to access this value in 1.0 PHP Cookie 
          document.cookie = "key=" + response.Userid + "; path=/;";
          document.cookie = "stagename=" + response.Username + "; path=/;";
          document.cookie = "domain_id=" + response.domain_id + "; path=/;";
          document.cookie = "role_id=" + response.roleId + "; path=/;";
          document.cookie = "dommainversion=" + response.domainVersion + "; path=/;";
          document.cookie = "forumdisplaytype=" + response.displayType + "; path=/;";
          document.cookie = "dommainversion=" + response.domainVersion + "; path=/;";
          document.cookie = "domainType=" + response.domainType + "; path=/;";
          
          document.cookie = "fromV2Access=" + '1' + "; path=/;";
          localStorage.setItem('fromV2Access','1');         
          //localStorage.setItem('teamSystem', "true"); 

          /*var retrunUrlval = localStorage.getItem("loginRedirect");
          var retrunUrlvalFlag = retrunUrlval == undefined || retrunUrlval == 'undefined' || retrunUrlval == null || retrunUrlval == 'null' ? false : true;
          if(retrunUrlvalFlag){
            setTimeout(() => {
              localStorage.removeItem("loginRedirect");
            }, 100); 
            this.router.navigate([retrunUrlval]); 
          }
          else{
            this.router.navigate([this.redirectUrl]); 
          } */  
          
        //  this.router.navigate([this.redirectUrl]); 
       
        //this.router.navigate([this.redirectUrl]);
        window.name=this.redirectUrl;
      
        var w = window.open(this.redirectUrl, this.redirectUrl);
        if (w) 
        {
          window.location.href=this.redirectUrl;
        }
           
          
        
      ///  var customWindow = window.open(this.redirectUrl, this.redirectUrl);
       // customWindow.close();
          setTimeout(() => {
            this.loading3 = false;
           // var customWindow = window.open('auth', '_parent');
           // customWindow.close();
           // window.close();
           
          //  self.close();
         //   setTimeout(() => {window.close();}, 2000);
          //  setTimeout(() => {window.close();}, 4000);
          
        
          }, 1500);
          //this.router.navigate(['../login'], { relativeTo: this.route });
        }
        else {
          this.loading = false;
          this.loading3 = false;
          this.loginServerErrorMsg = response.message;
          this.loginServerError = true;
          this.loginPwdError = true;
        }
      },
      error => {
        this.loading = false;
        this.loading3 = false;
        this.loginServerErrorMsg = error;
        this.loginServerError = true;
        this.loginPwdError = true;
      });
    
  }

  gotoMainPage() {
    if(this.tvsSSOFlagNormalFlow && this.tvsSSOFlag){
      this.tvsSSOFlag = true;
    }
    else{
      if (this.splittedDomainURL == Constant.forumDev || this.splittedDomainURL == Constant.forumDevCollabtic || this.splittedDomainURL ==Constant.forumDevCollabticStage || this.splittedDomainURL == Constant.forumDevCollabticSolr || this.splittedDomainURL == Constant.forumDevMahle || this.splittedDomainURL == Constant.forumDevDekra || this.splittedDomainURL == Constant.forumStage  ||  this.splittedDomainURLLocal[0] == Constant.forumLocal ||  this.splittedDomainURLLocal[0] == Constant.mahleforumDomain) {
        this.subdomainForm.reset();
        this.subDomainFlag = true;
        setTimeout(() => { // this will make the execution after the above boolean has changed
          this.myInput3Element.nativeElement.focus();
        }, 100);
        //this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';
        if(this.subDomainFlag){
          this.setbgClassName = 'login-bg';
        }
        else{
          if(this.domainId == '52'){
            this.setbgClassName = 'tvs-bg';
          }
          else{
            if(this.domainId == '69'){
              this.setbgClassName = 'canoo-bg'
            }
            else if(this.domainId == '71'){
              this.setbgClassName = 'repairify_bg'
            }
            else if(this.domainName == 'vinfast'){
              this.setbgClassName = 'vinfast-bg'
            }
            else{
              this.setbgClassName = 'business-bg'
            }
            //this.setbgClassName = (this.domainId == '69') ? 'canoo-bg' : 'business-bg';
          }
        }
        this.companyNameInputFlag = false;

        this.loginFlag = false;
        this.loginFlagS1 = false;
        this.loginFlagS2 = false;

        this.loginPwdError = false;
        this.loginUserError = false;

        this.loginServerErrorMsg = '';
        this.loginServerError = false;
      }
      else {
        let platformId=localStorage.getItem('platformId');
        if(platformId!='1')
        {
          window.location.replace(Constant.MahleforumLiveURLLogin);
        }
        else
        {
          window.location.replace(Constant.forumLiveURLmainPage);
        }
        
      }
    }
    

  }
   // select country data...
   selectCountry(countryInfo) {  

    const modalRef = this.modalService.open(SelectCountryComponent, this.modalConfig); 
    modalRef.componentInstance.countryInfo = countryInfo;
    modalRef.componentInstance.selectResponce.subscribe((receivedService) => {
      if (receivedService) {        
        let countryData = receivedService;
        this.countryId = countryData.countryId;
        this.countryName = countryData.countryName;
        this.showCountryFlag = true;
        localStorage.setItem('multipleCountry','1');
        modalRef.dismiss('Cross click');
      }
      else{
        this.countryId = '';
        this.countryName = '';
      }
      setTimeout(() => { // this will make the execution after the above boolean has changed
        this.myInput2Element.nativeElement.focus();
      }, 100);
    });
    
  }

  // click forgotpassword link...
  forgotPassword() {    
    const modalRef = this.modalService.open(ForgotpasswordComponent, this.modalConfig);
    modalRef.componentInstance.domainID = this.domainId;
    modalRef.componentInstance.countryId = this.countryId;
    modalRef.componentInstance.domainName = this.domainName;
    modalRef.componentInstance.pageAccess = "login";
    modalRef.componentInstance.forgotResponce.subscribe((receivedService) => {
      if (receivedService) {
        modalRef.dismiss('Cross click');
        this.loginForm.reset();
        this.subDomainFlag = false;
        this.companyNameInputFlag = false;
        this.userNameInputFlag = false;
        this.passwordInputFlag = false;
        this.passwordInputArrowFlag = false;
        this.loginFlag = true;
        this.loginFlagS1 = true;
        this.loginFlagS2 = false;
        setTimeout(() => { // this will make the execution after the above boolean has changed
          this.myInput1Element.nativeElement.focus();
        }, 100);
      }
    });
  }
  //find domain url list...
  domainURL() {    
    const modalRef = this.modalService.open(DomainUrlComponent, this.modalConfig);
    modalRef.componentInstance.domainID = this.domainId;
    modalRef.componentInstance.countryId = this.countryId;
    modalRef.componentInstance.domainName = this.domainName;
    modalRef.componentInstance.domainURLResponce.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if (receivedService == 'signup') {
        this.router.navigate(["/auth/signup"]);
      }
      else {
        this.checkSubDomainName(receivedService);
      }
    });
  }

  bookmarkURL() {
    alert('Press ' + (/Mac/i.test(navigator.platform) ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
  }

  // input keypress color change
  public onKeypress(fieldName, event: any) {

    this.loginSubmitted = false;

    // Remove invalid chars from the input
    var inputVal = event.target.value.trim();
    var inputLength = inputVal.length;

    switch (fieldName) {
      case 1:
        this.companyNameInputFlag = (inputLength > 0) ? true : false;
        this.domainServerErrorMsg = '';
        this.domainServerError = false;
        break;
      case 2:
        this.userNameInputFlag = (inputLength > 0) ? true : false;
        this.loginUserError = false;
        this.loginServerErrorMsg = '';
        this.loginServerError = false;
        if (event.keyCode == 13) {
          if(this.userNameInputFlag){
            event.preventDefault();
            this.loginSubmitStep1();
          }
        }
        break;
      case 3:
        this.passwordInputFlag = (inputLength > 0) ? true : false;
        this.passwordInputArrowFlag = (inputLength > 5) ? true : false;
        this.loginPwdError = false;
        this.loginServerErrorMsg = '';
        this.loginServerError = false;
        if (event.keyCode === 13) {
          if(this.passwordInputArrowFlag){
            event.preventDefault();
            this.loginSubmitStep2();
          }
        }
        break;
      default:
        this.companyNameInputFlag = false;
        this.userNameInputFlag = false;
        this.passwordInputFlag = false;
        break;

    }

  }
  
  // selectContent
  selectLanguage(){
      let users = '';   
      let apiData = {
        api_key: Constant.ApiKey,
        user_id: this.userId,
        domain_id: this.domainId,
        countryId: this.countryId    
      };    
      const modalRef = this.modalService.open(ManageUserComponent, this.modalConfig);
      modalRef.componentInstance.access = 'login';
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.height = this.innerHeight;
      modalRef.componentInstance.action = 'new';
      modalRef.componentInstance.selectedUsers = users;
      modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
        if(!receivedService.empty)  {       
          let langData = receivedService;
          this.languageId = langData.langId;
          this.languageName = langData.langName;
          localStorage.setItem('languageId',this.languageId);
          localStorage.setItem('languageName',this.languageName);
        }          
        modalRef.dismiss('Cross click');
      });        
    }
}
