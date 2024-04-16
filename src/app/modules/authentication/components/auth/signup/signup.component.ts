import { Component, OnInit, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NonUserComponent } from '../../../../../components/common/non-user/non-user.component';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { ApiService } from '../../../../../services/api/api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { pageInfo, Constant,PlatFormNames,PlatFormType,PlatFormDomains,PlatFormDomainsIdentity } from 'src/app/common/constant/constant';
import { ImageCropperComponent } from '../../../../../components/common/image-cropper/image-cropper.component';
import { countries } from 'country-data';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  @Input() public domainURLResponce;
  @Input() public nonuserResponce;
  @ViewChild('myInput1') myInput1Element: ElementRef;
  @ViewChild('myInput2') myInput2Element: ElementRef;
  @ViewChild('myInput3') myInput3Element: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  
  public loading: boolean = true;
  public loading1: boolean = false;
  public loading2: boolean = false;
  public loading3: boolean = false;
  public loading4: boolean = false;

  public subdomainForm: FormGroup;
  public newsubdomainForm: FormGroup;
  public subDomainFlag: boolean = false;
  public domainServerErrorMsg: string='';
  public domainServerError = false;
  public MainDomainName: string = '.collabtic.com';
  public subdomainSubmitted: boolean = false;
  public subDomainURL: string ='';
  public domainId: string ='';
  public domainName: string ='';
  public headerLogo: string ='assets/images/login/collabtic-logo-blacktext.png';
  public businessNameUserElecpage = '';
  public splittedDomainURL: string='';
  public splittedDomainURLLocal:any;
  public enterDomainNameFlag: boolean = false;

  public signupForm1: FormGroup;  
  public signupForm2: FormGroup;
  public signupForm3: FormGroup;
  public signupSuccessFlag: boolean = false;  
  public signupFlag: boolean = false;
  public signupFlagS1: boolean = false;
  public signupFlagS2: boolean = false; 
  public signupProfileFlag: boolean = false; 
  public errorMsg;
  public invalid: boolean;
  public submitted1:boolean;
  public submitted2:boolean;
  public submitted3:boolean;
  public submitted4:boolean;
   
  public companyNameInputFlag:boolean;
  public businessNameInputFlag:boolean;
  public emailInputFlag:boolean;
  public passwordInputFlag:boolean;
  public passwordInputArrowFlag: boolean;
  public firstNameInputFlag:boolean;
  public lastNameInputFlag:boolean;
  public phonenoInputFlag:boolean; 
  public techInputFlag:boolean;
  public invalidNumber:boolean = true;
  
  public signupErrorMsg: string = '';

  public signupcbox: boolean = false;

  public emailErrorMsg;
  public emailError;
  public passwordErrorMsg;
  public passwordError;
  public termsErrorMsg;
  public termsError;
  public serverErrorMsg;
  public serverError;
  public phonenoError;
  public phonenoErrorMsg; 
  public userEmail;
  public userId;

  public signupEnable: boolean = true;
  public platformIdInfo= localStorage.getItem('platformId');
  public selectedImg : File;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public profileImageFlag: boolean = false;
  public profileImage;
  public MainDomainNameIdentity: string = '.collabtic.com';
  public imgURL: any = "assets/images/login/default-img.png";
  public title='Signup';
  public bodyHeight: number; 
  public innerHeight: number;
  public innerNewSignupHeight: number;
  public redirectUrl: string = "landing-page";
  public bodyClass:string = "profile";
  public bodyClass1:string = "image-cropper";
  public bodyClass2:string = "public-email";
  public bodyElem;

  public pwdFieldTextType: boolean = false;
  public phoneNumberData:any;
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phoneNumberValid:boolean = false;
  public tvsSSOFlag: boolean = false;
  public tvsEmpType;
  public tvsEmpEmail;
  public tvsEmpId;
  public tvsEmpPwd;
  public designation;
  public passwordchecker:boolean = false;
  public disableDefaultPasswordText :boolean = false;
  public passwordValidationError:boolean = false;
  public emailValidationError:boolean = false;
  public emailValidationErrorMsg = "";
  public passwordValidationErrorMsg: string = '';
  public passwordLen:number = 6;
  public umUrl: string = 'under-maintenance';
  public newAccountSetup:boolean = false;
  public newAccountSetup1: boolean = false;
  public newAccountSetup2: boolean = false;
  public collabticDomain: boolean = false  
  public domainNameInputFlag: boolean = false;
  public newBusinessName: string = '';
  public newDomainName: string = '';
  public fromURLdomainName: any;
  public fromURLEmail: any;
  public placeholderZeroFlag: boolean = false;
  public placeholderLength: number = 0;
  public fromUserElecpageFlag = localStorage.getItem('fromUserElecpage') == '1' ? true : false;
  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private apiUrl: ApiService,
    private router: Router, 
    private httpClient: HttpClient,
    private titleService: Title
  ) { 
   // this.titleService.setTitle('Collabtic - Signup');
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = true;
    config.size = 'dialog-centered';
  }

  // convenience getter for easy access to form fields
  get f1() { return this.signupForm1.controls; }
  get f2() { return this.signupForm2.controls; }
  
  get f4() { return this.newsubdomainForm.controls; }
  get f3() { return this.signupForm3.controls; }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];    
    let platformId=localStorage.getItem('platformId');
    if(platformId!='1'){
      this.MainDomainName=PlatFormDomains.mahleDomain;
      this.MainDomainNameIdentity=PlatFormDomainsIdentity.mahleDomain;
      this.headerLogo = 'assets/images/mahle-logo.png';
      this.collabticDomain = false;
    }
    else{
      this.MainDomainName=PlatFormDomains.CollabticDomain;
      this.MainDomainNameIdentity=PlatFormDomainsIdentity.CollabticDomain;
      this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';
      this.collabticDomain = true;
    }

    this.fromURLdomainName = this.getQueryParamFromMalformedURL1('domainName');
    if(this.fromURLdomainName != 0){
      this.fromURLEmail = this.getQueryParamFromMalformedURL2('email');          
      this.domainName = this.fromURLdomainName.replace("=","");
      //this.fromURLEmail = btoa(this.fromURLEmail);
      const emailData = new FormData();
      emailData.append('apiKey', Constant.ApiKey); 
      emailData.append('encodedEmail', this.fromURLEmail); 
      this.authenticationService.decodeEmailaddress(emailData).subscribe((response) => {          
        if(response.status == "Success") {
          this.fromURLEmail = response.email;
        }
      });
    }
   
    this.loading = true;      
       
    this.subdomainForm = this.formBuilder.group({
      companyName: ['', [Validators.required]]      
    });

    this.newsubdomainForm = this.formBuilder.group({
      businessName: ['', [Validators.required]],
      domainCompName: ['', [Validators.required]],      
    });

    // enabled all domains - strong password
    //if(this.domainId == '97'){
    this.passwordchecker = true;
    this.passwordLen = 8;
    //}
      
    this.signupForm1 = this.formBuilder.group({                     
      //email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$')]],
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', [Validators.required, Validators.minLength(this.passwordLen)]]                    
    });       
    
    this.signupForm2 = this.formBuilder.group({     
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]      
    }); 

    this.signupForm3 = this.formBuilder.group({ 
      //email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$')]],
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]], 
      password: ['', [Validators.required, Validators.minLength(this.passwordLen)]],    
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]  
    });
    
    let currentURL  = window.location.href; 
    let splittedURL1 = currentURL.split("://");   
    //splittedURL1[1] = "forum.collabtic.com";        
    let splittedURL2 = splittedURL1[1].split(".");        

    this.splittedDomainURL = splittedURL2[0];  

    this.splittedDomainURLLocal = this.splittedDomainURL.split(":");

    this.splittedDomainURL = splittedURL2[0]; 

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

    let tvsOther = false;
    tvsOther = localStorage.getItem('tvsOther') == '1' ? true : false;

    if(Constant.TVSSSO == '1' && !tvsOther){  // check TVSSSO Process 
      
      this.tvsSSOFlag = true;
      this.signupForm2 = this.formBuilder.group({     
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]] ,
        designation: ['']    
      });

      this.loading = false;
      
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.myInput2Element.nativeElement.focus();
      },100); 
      this.signupProfileFlag = true;       
      this.signupFlag = false;      
      this.tvsEmpType = localStorage.getItem('employeeType');
      this.tvsEmpEmail = localStorage.getItem('employeeEmail');     
      this.tvsEmpId = localStorage.getItem('employeeId');
      this.tvsEmpPwd = localStorage.getItem('employeePwd'); 
      this.domainId = localStorage.getItem('domainId');
      this.domainName = localStorage.getItem('domainName');
      this.signupFlagS2 = true; 
      this.phoneNumberData = {  
        'countryCode': "IN", 
        'phoneNumber' : "",
        'country': "India", 
        'dialCode' : "",
        'access': 'phone'
      }      
      this.signupButtonActive(); 
      let pageNavAuth = localStorage.getItem('pageNavAuth');
      if(pageNavAuth == null || pageNavAuth == 'undefined' || pageNavAuth == undefined){
        this.router.navigate(['login']);
      } 
    }
    else if(this.fromUserElecpageFlag){  //  
        this.domainId = localStorage.getItem('domainId');
        this.domainName = localStorage.getItem('domainName');
        this.headerLogo = localStorage.getItem('headerLogoUserElecpage');
        this.subDomainURL = this.domainName+ this.MainDomainName; 
        this.businessNameUserElecpage = localStorage.getItem('businessNameUserElecpage');
        localStorage.setItem("maintanancePopup",'0');         
        this.loading = false; 
        this.clearErrorFlags();
        this.signupForm1.reset();
        this.signupForm2.reset();
        this.subDomainFlag = false;
        this.companyNameInputFlag = false; 

        this.emailInputFlag = false;
        this.passwordInputFlag = false;
        this.passwordInputArrowFlag = false;

        this.signupFlag = true;
        this.signupFlagS1 = true;   
        this.signupFlagS2 = true;  
        if(this.fromURLEmail !='' && this.fromURLEmail != undefined){              
          this.emailInputFlag = true;
        }
        setTimeout(()=>{ // this will make the execution after the above boolean has changed
          this.myInput1Element.nativeElement.focus();              
        },300);   
        this.signupcbox = false;
        this.signupProfileFlag = false; 

        this.phoneNumberData = {  
          'countryCode': this.icountryCode, 
          'phoneNumber' : this.iphoneNumber,
          'country': this.icountryName, 
          'dialCode' : this.idialCode,
          'access': 'phone'
        }
        
    }
    else{

      this.signupForm2 = this.formBuilder.group({     
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]]      
      }); 

      if(this.splittedDomainURL.length>0){      
        if(this.splittedDomainURL == Constant.forumLive || this.splittedDomainURL == Constant.forumStage || this.splittedDomainURL == Constant.forumDev || this.splittedDomainURL == Constant.forumDevCollabtic || this.splittedDomainURL ==Constant.forumDevCollabticStage || this.splittedDomainURL == Constant.forumDevCollabticSolr || this.splittedDomainURL == Constant.forumDevMahle || this.splittedDomainURL == Constant.forumDevDekra || this.splittedDomainURLLocal[0] == Constant.forumLocal ){              
          this.loading = false;
          this.subDomainFlag = true;
          setTimeout(()=>{ // this will make the execution after the above boolean has changed
            this.myInput3Element.nativeElement.focus();
          },100);
          this.signupFlag = false;
          this.signupFlagS1 = false;    
          this.signupFlagS2 = false;
          this.signupProfileFlag = false;
          this.signupSuccessFlag = false;
        }
        else{              
          this.checkSubDomainName(this.splittedDomainURL);
        }
      }

      if(this.domainName.length>0){
        this.checkSubDomainName(this.domainName);
      }

      this.phoneNumberData = {  
        'countryCode': this.icountryCode, 
        'phoneNumber' : this.iphoneNumber,
        'country': this.icountryName, 
        'dialCode' : this.idialCode,
        'access': 'phone'
      }
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
    this.innerNewSignupHeight = innerHeight - 230;    
    if(this.innerNewSignupHeight >= 462){
      this.innerNewSignupHeight = 462;
    }
    else{
      this.innerNewSignupHeight = innerHeight - 230;  
    }
  }

  // validate domain name 
  checkSubDomainName(domainName){             
    this.subDomainAPI(domainName);
  }

  getQueryParamFromMalformedURL1(domainName) {
    const results = new RegExp('[\\?&]' + domainName + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }
  getQueryParamFromMalformedURL2(email) {
    const results = new RegExp('[\\?&]' + email + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }

  // get the value from form
  subdomainFormValue(){
    this.enterDomainNameFlag = true;
    this.subDomainAPI(this.subdomainForm.value.companyName.trim());
  }

 // validate domain name 
  subDomainAPI(domainName){ 
    
    this.loading1 = true;
    const subDomainData = new FormData();
    subDomainData.append('apiKey', Constant.ApiKey);
    subDomainData.append('domainName', domainName);

    this.authenticationService.validateSubDomain(subDomainData).subscribe((response) => {
      if(response.status == "Success") {
        this.loading1 = false;
        let domainData = response.data[0];
        this.domainId = domainData.domainId;
        this.domainName = domainData.subDomain;

        localStorage.setItem('domainId', this.domainId);
        localStorage.setItem('domainName', this.domainName);

        this.subDomainURL = this.domainName+ this.MainDomainName; 
        if(this.splittedDomainURL ==  Constant.forumLive ){ 
          window.location.replace('https://'+this.subDomainURL+Constant.liveSuffixURLSignup); 
        }
        else{  
          // check the server manintenance        
          let platformId=localStorage.getItem("platformId");
          if(platformId!='1' && response.maintanancePopup == '1'){
            localStorage.setItem("maintanancePopup",'1');
            this.router.navigate([this.umUrl]);            
          }
          else{   
            localStorage.setItem("maintanancePopup",'0');         
            this.loading = false;           
            if(this.domainName!='collabtic'){
              this.headerLogo = domainData.businessLogo;
            } 
            this.clearErrorFlags();
            this.signupForm1.reset();
            this.signupForm2.reset();
            this.subDomainFlag = false;
            this.companyNameInputFlag = false; 

            this.emailInputFlag = false;
            this.passwordInputFlag = false;
            this.passwordInputArrowFlag = false;

            this.signupFlag = true;
            this.signupFlagS1 = true;   
            this.signupFlagS2 = true;  
            if(this.fromURLEmail !='' && this.fromURLEmail != undefined){              
              this.emailInputFlag = true;
            }
            setTimeout(()=>{ // this will make the execution after the above boolean has changed
              this.myInput1Element.nativeElement.focus();              
            },300);   
            this.signupcbox = false;
            this.signupProfileFlag = false;   
            
            // check password strong
            /*if(this.domainId == '97'){
              this.passwordchecker = true;
              this.passwordLen = 8;
            }*/
          }
        }
      }
      else {
        this.loading = false; 
        this.loading1 = false;
        this.companyNameInputFlag = true;       
        if(this.enterDomainNameFlag){ 
          this.domainServerErrorMsg = response.result;
          this.domainServerError = true;
        }
        else{           
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
  
  gotoStep1(){ 
    
    this.clearErrorFlags();   
    
    this.signupFlag = true;
    this.signupFlagS1 = true;   
    this.signupFlagS2 = true;  
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.myInput1Element.nativeElement.focus();
    },100); 
   
    this.signupProfileFlag = false;

  } 

  gotoMainPage(){
    if( this.splittedDomainURL == Constant.forumDev || this.splittedDomainURL == Constant.forumDevCollabtic || this.splittedDomainURL ==Constant.forumDevCollabticStage || this.splittedDomainURL == Constant.forumDevCollabticSolr || this.splittedDomainURL == Constant.forumDevMahle || this.splittedDomainURL == Constant.forumDevDekra || this.splittedDomainURL == Constant.forumStage  || this.splittedDomainURLLocal[0] == Constant.forumLocal ){
      this.subdomainForm.reset();
      this.subDomainFlag = true;
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.myInput3Element.nativeElement.focus();
      },100);
      this.companyNameInputFlag = false;  
      this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';      

      this.signupFlag = false;    
      this.signupFlagS1 = false;    
      this.signupFlagS2 = false;
    }
    else{      
      let platformId=localStorage.getItem('platformId');
      if(platformId!='1')
      {
        window.location.replace(Constant.MahlforumLiveURLSignup);
      }
      else
      {
        window.location.replace(Constant.forumLiveURLSignup);
      }      
    }
  }

  selectTermsandConditions(signupcbox){
    this.signupcbox = (signupcbox) ? false : true;    
  }

  clearErrorFlags(){
    this.emailError = false;
    this.emailErrorMsg = '';
    this.passwordError = false;
    this.passwordErrorMsg = '';
    this.termsError = false;
    this.termsErrorMsg = '';   
  }

  signupSubmitStep1(){    
    this.submitted1 = true;

    // stop here if form is invalid
    if (this.signupForm1.invalid) {
        //this.loading = false;        
        return;
    }
    let pwdVal = this.signupForm1.value.password.trim(); 
    if(this.passwordLen>pwdVal.length || this.passwordValidationError){
      return;
    }
    if(!this.signupcbox){
      this.termsError = true;   
      return;   
    }    

    this.loading2 = true;
    const signupData = new FormData();
    signupData.append('api_key', Constant.ApiKey);
    signupData.append('email', this.signupForm1.value.email.trim());      
    signupData.append('password', this.signupForm1.value.password.trim());  
    signupData.append('firstname', '');  
    signupData.append('lastname', '');  
    
    if(this.iphoneNumber!=''){        
      this.iphoneNumber = (this.placeholderZeroFlag || (this.placeholderLength == this.iphoneNumber.length) ) ? this.iphoneNumber :this.iphoneNumber.replace(/^0+/, '');              
    }

    signupData.append('phoneNumber', this.iphoneNumber);
    signupData.append('countryName', this.icountryName);  
    signupData.append('countryCode', this.icountryCode);  
    signupData.append('dialCode', this.idialCode);  
    
    signupData.append('step', '2');
    signupData.append('subdomainName', this.domainName );
    signupData.append('subdomainId', this.domainId );   

    this.authenticationService.signup(signupData).subscribe((response) => {
      if(response.status == "Success") {
        if(response.isNonDomain == 1){
          this.loading2 = false;        
          const modalRef = this.modalService.open(NonUserComponent, this.config);
          modalRef.componentInstance.okButtonDisable = false;
          modalRef.componentInstance.successMsg = response.message;
          modalRef.componentInstance.nonuserResponce.subscribe((receivedService) => {      
            if(receivedService){
              modalRef.dismiss('Cross click'); 
              this.signupProfileFlag = true;
              setTimeout(()=>{ // this will make the execution after the above boolean has changed
                this.myInput2Element.nativeElement.focus();
              },100);  
              this.signupFlag = false; 
              this.userEmail = response.Email;
              this.signupButtonActive();  
            }
          });
        }        
        else{
          this.loading2 = false;
          this.signupProfileFlag = true;
          this.signupFlag = false; 
          this.userEmail = response.Email;
          this.signupButtonActive();   
        }           
      }
      else {       
        this.loading2 = false;        
        this.serverErrorMsg = response.message;
        this.serverError = true;              
      }
    },
    (error => {
        this.loading2 = false;
        //console.log(error);        
        this.serverErrorMsg = error;
        this.serverError = true;
    })
    );    
  
    //}  
  }
  signupSubmitStep2(){ 
    
    this.submitted2 = true;
    // this.loading = true;   
    // stop here if form is invalid
    if(this.iphoneNumber!='' && this.phoneNumberValid){
      this.invalidNumber = false;
    }
    else{
      this.invalidNumber = true;
    }

    if (this.signupForm2.invalid || ( this.phoneNumberValid && this.iphoneNumber!='') ) {
        //this.loading = false;        
        return;
    }   
    else{ 
   
      this.serverErrorMsg = '';
      this.serverError = false;
      this.loading3 = true;     
      this.signupEnable = true;
      this.profileImage = (this.profileImageFlag) ? this.profileImage : '';
      //this.signupForm2.value.phonenumber = (this.signupForm2.value.phonenumber==null || this.signupForm2.value.phonenumber=='null') ? '' : this.signupForm2.value.phonenumber;
      const signupData = new FormData();
      signupData.append('api_key', Constant.ApiKey);  
      signupData.append('firstname', this.signupForm2.value.firstName.trim());  
      signupData.append('lastname', this.signupForm2.value.lastName.trim());  
      signupData.append('imagesrc', this.profileImage);  
      if(this.tvsSSOFlag){         
        signupData.append('email', this.tvsEmpEmail); 
        signupData.append('password', this.tvsEmpPwd); 
        signupData.append('designation', this.signupForm2.value.designation.trim());  
        signupData.append('employeeId', this.tvsEmpId);
        signupData.append('employeeType', this.tvsEmpType);  
      }
      else if(this.fromUserElecpageFlag){
        let bid = localStorage.getItem('businessIdUserElecpage');
        signupData.append('businessId', bid);
        let bname = localStorage.getItem('businessNameUserElecpage');
        signupData.append('businessName', bname);
        signupData.append('fromElectrician', '1');  
        signupData.append('roleId', '1');  
        signupData.append('email', this.signupForm1.value.email.trim()); 
        signupData.append('password', this.signupForm1.value.password.trim()); 
      }
      else{
        signupData.append('email', this.signupForm1.value.email.trim()); 
        signupData.append('password', this.signupForm1.value.password.trim());     
      }

      if(this.iphoneNumber!=''){        
        this.iphoneNumber = (this.placeholderZeroFlag || (this.placeholderLength == this.iphoneNumber.length) ) ? this.iphoneNumber :this.iphoneNumber.replace(/^0+/, '');             
      } 

      signupData.append('phoneNumber', this.iphoneNumber);
      signupData.append('countryName', this.icountryName);  
      signupData.append('countryCode', this.icountryCode);  
      signupData.append('dialCode', this.idialCode);  
      
      signupData.append('step', '3');
      signupData.append('subdomainName', this.domainName );
      signupData.append('subdomainId', this.domainId ); 
      signupData.append('version', '2');       

      this.authenticationService.signup(signupData).subscribe((response) => {
      if(response.status == "Success") { 
              if(this.fromUserElecpageFlag){
                  localStorage.removeItem('fromUserElecpage');
                  localStorage.removeItem('businessIdUserElecpage');
                  localStorage.removeItem('businessNameUserElecpage');
                  localStorage.removeItem('headerLogoUserElecpage'); 
                  this.fromUserElecpageFlag = false;
              }

              localStorage.removeItem("loggedOut");                  
              this.authenticationService.UserSuccessData(response);  
              localStorage.setItem('userId', response.Userid);
              localStorage.setItem('key', response.Userid);
              localStorage.setItem('domain_id', this.domainId);   
              
              let platformId='1';
            //  localStorage.setItem('platformId', platformId);
              if(platformId==PlatFormType.Collabtic)
              {
                localStorage.setItem('platformName', PlatFormNames.Collabtic);
              }
              else if(platformId==PlatFormType.MahleForum)
              {
                localStorage.setItem('platformName', PlatFormNames.MahleForum);
              }
              else if(platformId==PlatFormType.CbaForum)
              {
                localStorage.setItem('platformName', PlatFormNames.CbaForum);
              }
              else if(platformId==PlatFormType.KiaForum)
              {
                localStorage.setItem('platformName', PlatFormNames.KiaForum);
              }
              else
              {
                localStorage.setItem('platformName', PlatFormNames.Collabtic);
              }    
             // localStorage.setItem('logginState','1');
             
              this.router.navigate([this.redirectUrl]); 
              setTimeout(() => {
                this.loading3 = false;
                this.signupEnable = false;                 
              }, 1500);                      
              //this.router.navigate(['../login'], { relativeTo: this.route });                                     
            }
            else {  
              this.loading3 = false;
              this.signupEnable = false;                 
              this.serverErrorMsg = response.message;
              this.serverError = true;          
            }
        },
        (error => {
            this.loading3 = false;
            this.signupEnable = false; 
            //console.log(error);        
            this.serverErrorMsg = error;
            this.serverError = true;
        })
        );    
      
        } 
  }
   
  signupButtonActive(){
    if(!this.newAccountSetup){
      this.serverErrorMsg = '';
      this.serverError = false;
      if( (this.signupForm2.value.firstName != null ) && (this.signupForm2.value.lastName != null)) {
        if( (this.signupForm2.value.firstName.length>0) && (this.signupForm2.value.lastName.length>0)) {
          this.signupEnable = false;      
        }
        else{
          this.signupEnable = true;
        }    
      }
      else{
        this.signupEnable = true;
      }  
    }
    else{
      this.serverErrorMsg = '';
      this.serverError = false;
      if((this.signupForm3.value.firstName != null ) && (this.signupForm3.value.lastName != null) && (this.signupForm3.value.email != null ) && (this.signupForm3.value.password != null)) {       
        if((this.signupForm3.value.firstName.length>0) && (this.signupForm3.value.lastName.length>0) && (this.signupForm3.value.email.length>0) && (this.signupForm3.value.password.length>0)) {
          this.signupEnable = false;              
        }
        else{
          this.signupEnable = true;          
        }    
      }
      else{
        this.signupEnable = true;        
      }        
    }
     
  }

  //find domain url list...
  domainURL(){    
    localStorage.setItem('popuppage','domain'); 
    this.router.navigate(["/auth/login"]);     
  }

  // show/hide password  
  showPassword(type){
    this.pwdFieldTextType = (type) ? false : true;
  }

  public onKeypress(fieldName,event: any) {        
    // Remove invalid chars from the input
    this.submitted1 = false;
    this.submitted2 = false;
    this.submitted3 = false;
    this.submitted4 = false;
    this.invalidFile = false;
    this.invalidFileSize = false;
    this.invalidFileErr = "";
    var inputVal = event.target.value.trim();
    
    //this.clearErrorFlags();
    this.signupButtonActive(); 

    var inputLength = inputVal.length; 
    switch(fieldName){
      case 1:
        this.companyNameInputFlag = (inputLength>0) ? true : false;
        this.domainServerErrorMsg = '';
        this.domainServerError = false;      
        break;
      case 2:
        this.emailInputFlag = (inputLength>0) ? true : false;
        if(this.emailInputFlag){ 
          if(this.newAccountSetup){
            if(this.signupForm3.controls.email.errors){}
            else{
              this.emailValidationError = false;
              this.emailValidationErrorMsg = "";
            } 
          }
          else{
            if(this.signupForm1.controls.email.errors){}
            else{
              this.emailValidationError = false;
              this.emailValidationErrorMsg = "";
            } 
          }           
          
        }
        else{
          this.emailValidationError = false;
          this.emailValidationErrorMsg = "";
        }       
        this.emailError = false;         
        break;
      case 3:
        this.passwordInputFlag = (inputLength>0) ? true : false;        
        if(this.passwordchecker){
          if(this.passwordLen<=inputLength){
            if(!this.newAccountSetup){
              this.checkPwdStrongValidation('pass1');
            }
            else{
              this.checkPwdStrongValidation('pass2');
            }
          }
          else{
            if(inputLength == 0){              
              this.passwordValidationError = false;              
              this.passwordValidationErrorMsg = '';
            }
            if(this.passwordValidationError){
              if(!this.newAccountSetup){
                this.checkPwdStrongValidation('pass1');
              }
              else{
                this.checkPwdStrongValidation('pass2');
              }
            }
            this.passwordInputArrowFlag = false;  
            this.disableDefaultPasswordText = false;          
          }                   
        }
        else{
          this.passwordInputArrowFlag = (this.passwordLen<=inputLength) ? true : false;
        }
        this.passwordError = false;        
        if(this.passwordInputArrowFlag){          
          if (event.keyCode == 13) {
            event.preventDefault();
            this.signupSubmitStep1();
          }                                      
        }        
        break;
      case 4:
        this.firstNameInputFlag = (inputLength>0) ? true : false;
        break;
      case 5:
        this.lastNameInputFlag = (inputLength>0) ? true : false;
        break;
      case 6:
        this.phonenoInputFlag = (inputLength>0) ? true : false;
        break;
      case 7:
        this.techInputFlag = (inputLength>0) ? true : false;
        break;
      case 8:
        this.businessNameInputFlag = (inputLength>0) ? true : false;  
        if(this.newsubdomainForm.value.domainCompName != null ){
          let domainCompName = this.newsubdomainForm.value.domainCompName; 
          this.domainNameInputFlag = (domainCompName.length > 0 && this.businessNameInputFlag) ? true : false;        
        }      
        break;
      case 9:
        this.domainServerErrorMsg = '';
        this.domainServerError = false;   
        let businessName = '';
        businessName = this.newsubdomainForm.value.businessName;
        if(businessName != null ){
          businessName = this.newsubdomainForm.value.businessName.trim();
          this.domainNameInputFlag = (inputLength>0 && businessName.length>0) ? true : false;
        }  
        if(this.domainNameInputFlag){
          if (event.keyCode == 13) {
            event.preventDefault();
            this.newBussSignup();
          } 
        }    
        break;
      default:
        this.companyNameInputFlag = false;
        this.businessNameInputFlag = false;
        this.emailInputFlag = false;
        this.passwordInputFlag = false;
        this.passwordInputArrowFlag = false;
        this.firstNameInputFlag = false;
        this.lastNameInputFlag = false;
        this.phonenoInputFlag = false;
        this.techInputFlag = false;
        this.domainNameInputFlag = false;
      break;  
    }    
  }

   // On FileSelected
  changeProfile(){    
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass1);
    const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.type = "Add";
    if(this.newAccountSetup){
      modalRef.componentInstance.profileType = "businessProfile";
    }
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        this.bodyElem.classList.remove(this.bodyClass);  
        this.bodyElem.classList.remove(this.bodyClass1);
        modalRef.dismiss('Cross click');       
        this.imgURL = receivedService.show;
        this.profileImage = receivedService.response;
        this.profileImageFlag = true;
      }
    });
  }

  bookmarkURL(){
    alert('Press ' + (/Mac/i.test(navigator.platform) ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
  }

    // country & phone number update
    getPhoneNumberData(newValue){      
      if(newValue != null){
        if(newValue.access == 'phone'){
          if(newValue.phoneVal != null){      
            this.iphoneNumber = '';            
        let placeHolderValueTrim = '';       
        let placeHolderValueTrim1 = '';       
        let placeHolderValueLen = 0 ;        
        let placeHolderValueLen1 = 0 ;        
        let placeHolderValue = newValue.placeholderVal;
        placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");          
        placeHolderValueTrim1 = placeHolderValue.replace(/[^\w]/g, "");          
        placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
        this.placeholderLength = placeHolderValueTrim.length; 
        placeHolderValueLen = placeHolderValueTrim.length; 
        placeHolderValueLen1 = placeHolderValueTrim1.length; 
  
        var digit = placeHolderValueTrim1.toString()[0];
       
        if(digit == '0'){
          this.placeholderZeroFlag = true;
        }          
          
        let currPhValueTrim = '';        
        let currPhValueLen = 0 ;      
        let currPhValueLen1 = 0 ;      
        if(newValue.phoneVal['number'] != ''){                             
          if(this.placeholderZeroFlag){
            this.iphoneNumber = newValue.phoneVal.number; 
            
            currPhValueTrim = this.iphoneNumber.replace(/[^\w]/g, "");  
            currPhValueLen = currPhValueTrim.length;
            var digitFirst = currPhValueTrim.toString()[0];
            
            if(digitFirst == '0'){
              if(currPhValueLen > placeHolderValueLen){ 
                currPhValueTrim = currPhValueTrim.replace(/^0+/, ''); 
                currPhValueLen = currPhValueTrim.length; 
                this.placeholderZeroFlag = false;
                
              }
              else{
                this.placeholderZeroFlag = true;
                this.iphoneNumber = currPhValueTrim;
                currPhValueLen1 = this.iphoneNumber.length; 
                
              }              
            }            
            else{
              if(currPhValueLen != placeHolderValueLen){ 
                this.placeholderZeroFlag = true;
                this.iphoneNumber = "0"+currPhValueTrim;
                currPhValueLen1 = this.iphoneNumber.length; 
                
              }
              else{
                this.placeholderZeroFlag = false;                
              }
            } 
          }
          else{                     
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            //currPhValueTrim = currPhValueTrim.replace(/^0+/, ''); 
            currPhValueLen = currPhValueTrim.length;
          }           
        }     
              
        if(newValue.phoneVal['number'].length>0){
          this.phonenoInputFlag = (newValue.phoneVal['number'].length>0) ? true : false; 
          this.invalidNumber = (newValue.errorVal) ? true : false; 
          
          this.phoneNumberValid = true;
          this.icountryName = '';
          this.icountryCode = '';          
          this.idialCode = '';
          this.iphoneNumber = !this.placeholderZeroFlag ? newValue.phoneVal.number : this.iphoneNumber;  
  
          if(this.placeholderZeroFlag){
            if(currPhValueLen1 == placeHolderValueLen || currPhValueLen1 == placeHolderValueLen1){ 
              this.phoneNumberValid = false;  
              let getCode = newValue.phoneVal.countryCode;        
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;            
              this.idialCode = newValue.phoneVal.dialCode;                
            }
          }
          else{
            if(currPhValueLen == placeHolderValueLen){ 
              this.phoneNumberValid = false;  
              let getCode = newValue.phoneVal.countryCode;        
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;            
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;                 
            }
          }
          
        }
        else{
          this.phonenoInputFlag = false;
          this.iphoneNumber = '';
        }       
          }
          else{
            if(this.iphoneNumber == ''){
              this.phonenoInputFlag = false;
              this.invalidNumber = (newValue.errorVal) ? true : false; 
              this.phoneNumberValid = true;
              this.icountryName = '';
              this.icountryCode = '';        
              this.idialCode = '';
              this.iphoneNumber = '';
            }
          }
        }
      }
      else{
        if(this.iphoneNumber == ''){
          this.phonenoInputFlag = false;
          this.invalidNumber = (newValue.errorVal) ? true : false; 
          this.phoneNumberValid = true;
          this.icountryName = '';
          this.icountryCode = '';      
          this.idialCode = '';
          this.iphoneNumber = '';
        }
      } 
    } 



  // check email validation
  checkEmailValition(type){ 
    let emailVal = '';
    var emailError;
    if(type == 'email1') {
      emailVal = this.signupForm1.value.email.trim();
      emailError = this.signupForm1.controls.email.errors;
    }
    else{
      emailVal = this.signupForm3.value.email.trim();
      emailError = this.signupForm3.controls.email.errors;
    }    
    if(emailVal.length>0){   
      this.emailValidationError = false;
      this.emailValidationErrorMsg = "";
      if(emailError){
        this.emailValidationError = true;
        if(this.passwordchecker){this.emailValidationErrorMsg = "Invalid Email";}
        else{this.emailValidationErrorMsg = "";}
      } 
           
    }
  }
  // check strong passwordix 
  checkPwdStrongValidation(type){
    if(this.passwordchecker){
      let pwdVal;
      if(type == 'pass1'){
        pwdVal = this.signupForm1.value.password.trim(); 
      } 
      if(type == 'pass2'){
        pwdVal = this.signupForm3.value.password.trim(); 
      }      
      let validateMsg = this.authenticationService.checkPwdStrongLength(pwdVal,this.passwordLen); 
      if(pwdVal.length>0){
        if(validateMsg==''){          
          this.passwordValidationError = false;
          this.passwordInputArrowFlag = true;
          this.disableDefaultPasswordText = true;
          this.passwordValidationErrorMsg = '';
        }
        else{
          this.passwordValidationError = true;
          this.passwordInputArrowFlag = false;
          this.disableDefaultPasswordText = false;
          this.passwordValidationErrorMsg = validateMsg;
        }
      }
      else{
        this.passwordValidationError = false;        
        this.passwordInputArrowFlag = false;
        this.disableDefaultPasswordText = false;
        this.passwordValidationErrorMsg = '';
      }
    }    
  }

  /***********************  new business ******************************** */
  changeAccountType(){
    this.newAccountSetup = this.newAccountSetup ? false : true;
    if(this.newAccountSetup){
      this.newAccountSetup1 = true;
      this.newAccountSetup2 = false;
      this.newsubdomainForm.reset(); 
      this.imgURL = "assets/images/login/business-bg.png";
      this.phoneNumberData = {  
        'countryCode': "", 
        'phoneNumber' : "",
        'country': "", 
        'dialCode' : "",
        'access': 'phone'
      }  
      this.signupForm3.reset();
      this.emailInputFlag = false;
      this.passwordInputFlag = false;             
      this.disableDefaultPasswordText = false;        
      this.firstNameInputFlag = false;
      this.lastNameInputFlag = false;
      this.phonenoInputFlag = false;
      this.serverError = false;
      this.serverErrorMsg = ''; 
      this.emailValidationErrorMsg = "";
      this.emailValidationError = false;
      this.passwordValidationError = false; 
      this.passwordValidationErrorMsg = ''; 
    }
    else{
      this.imgURL = "assets/images/login/default-img.png";
      this.subdomainForm.reset(); 
      this.newAccountSetup1 = false;
      this.newAccountSetup2 = false;     
    }
    this.subDomainFlag = true;
    this.businessNameInputFlag = false; 
    this.domainNameInputFlag = false; 
    this.domainServerError = false;
    this.domainServerErrorMsg = '';

    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.myInput3Element.nativeElement.focus();
    },100);
    
  }
  backnewSubdomainForm(){
    /*this.newAccountSetup = false;
    this.changeAccountType();*/
    this.subDomainFlag = true;
    this.newAccountSetup1 = true;
    this.newAccountSetup2 = false;
  }
  // newbusiness step1
  newBussSignup(){

    this.submitted4 = true;

    // stop here if form is invalid
    if (this.newsubdomainForm.invalid) {            
        return;
    }

    this.loading4 = true;

    let businessName = this.newsubdomainForm.value.businessName.trim(); 
    let domainCompName = this.newsubdomainForm.value.domainCompName.trim(); 

    this.newBusinessName = businessName;
    this.newDomainName = domainCompName;

    const subDomainData = new FormData();
    subDomainData.append('apiKey', Constant.ApiKey);
    subDomainData.append('businessName', businessName);
    subDomainData.append('domainName', domainCompName);
    subDomainData.append('step', '1');

    this.authenticationService.newBusinessSignup(subDomainData).subscribe((response) => {   
      
      this.loading4 = false; 
      this.submitted4 = false; 
      
      if(response.continueStatus == '1'){
        this.newAccountSetup2 = true;
        this.newAccountSetup1 = false;
        this.subDomainFlag = false;        
        this.serverError = false;
        this.serverErrorMsg = ''; 
        this.emailValidationErrorMsg = "";
        this.emailValidationError = false;
        this.passwordValidationError = false; 
        this.passwordValidationErrorMsg = ''; 
         
        if(this.iphoneNumber!=''){        
          this.iphoneNumber = (this.placeholderZeroFlag || (this.placeholderLength == this.iphoneNumber.length) ) ? this.iphoneNumber :this.iphoneNumber.replace(/^0+/, '');             
          
        }      
        this.phoneNumberData = {  
          'countryCode': this.icountryCode, 
          'phoneNumber' : this.iphoneNumber,
          'country': this.icountryName, 
          'dialCode' : this.idialCode,
          'access': 'phone'
        } 
        setTimeout(()=>{ // this will make the execution after the above boolean has changed
          this.myInput2Element.nativeElement.focus();
        },100);      
      }
      else if(response.continueStatus == '2'){ 
        this.bodyElem.classList.add(this.bodyClass2);              
        const modalRef = this.modalService.open(NonUserComponent, this.config);      
        modalRef.componentInstance.publicEmail = true;
        modalRef.componentInstance.okButtonDisable = false;
        modalRef.componentInstance.successMsg = response.message;
        modalRef.componentInstance.nonuserResponce.subscribe((receivedService) => {      
          if(receivedService){
            modalRef.dismiss('Cross click');  
          }
        });
      }
      else{  
        this.domainServerErrorMsg = response.message;
        this.domainServerError = true;
      }     
    },
    (error => {
        this.loading4 = false;
        this.submitted4 = false; 
        //console.log(error);        
        this.serverErrorMsg = error;
        this.serverError = true;
    })
    );    
  }
  // new business step2
  signupSubmitStep3(){    
    this.submitted3 = true;
    this.loading3 = false;
    
    // this.loading = true;   
    // stop here if form is invalid
    if(this.iphoneNumber!='' && this.phoneNumberValid){
      this.invalidNumber = false;
    }
    else{
      this.invalidNumber = true;
    }

    let pwdVal = this.signupForm3.value.password.trim(); 
    if(this.passwordLen>pwdVal.length || this.passwordValidationError){
      return;
    }
    
    if(!this.signupcbox){
      this.termsError = true;   
      return;   
    } 

    if (this.signupForm3.invalid || ( this.phoneNumberValid && this.iphoneNumber!='') ) {
        //this.loading = false;        
        return;
    }   
    else{ 
      //this.submitted3 = false;
      this.loading3 = true;     
      this.signupEnable = true;
      this.profileImage = (this.profileImageFlag) ? this.profileImage : '';
      let businessName = this.newsubdomainForm.value.businessName.trim(); 
      let domainCompName = this.newsubdomainForm.value.domainCompName.trim(); 

      this.newBusinessName = businessName;
      this.newDomainName = domainCompName;

      const signupData3 = new FormData();
      signupData3.append('apiKey', Constant.ApiKey);
      signupData3.append('businessName', businessName);
      signupData3.append('domainName', domainCompName);
      signupData3.append('email', this.signupForm3.value.email.trim());      
      signupData3.append('password', this.signupForm3.value.password.trim());  
      signupData3.append('firstname', this.signupForm3.value.firstName.trim());  
      signupData3.append('lastname', this.signupForm3.value.lastName.trim());     
      
      if(this.iphoneNumber!=''){        
        this.iphoneNumber = (this.placeholderZeroFlag || (this.placeholderLength == this.iphoneNumber.length) ) ? this.iphoneNumber :this.iphoneNumber.replace(/^0+/, '');             
        
      }

      signupData3.append('phoneNumber', this.iphoneNumber);
      signupData3.append('countryName', this.icountryName);  
      signupData3.append('countryCode', this.icountryCode);  
      signupData3.append('dialCode', this.idialCode);
      signupData3.append('roleId', '3');     
      signupData3.append('step', '2');
      signupData3.append('imagesrc', this.profileImage); 
      
      this.authenticationService.newBusinessSignup(signupData3).subscribe((response) => {               
        if(response.status == "Success") {
          if(response.continueStatus == '1'){
            this.loading = true;            
            localStorage.removeItem("loggedOut");                  
            this.authenticationService.UserSuccessData(response);  
            localStorage.setItem('userId', response.Userid);
            localStorage.setItem('key', response.Userid);
            localStorage.setItem('domain_id', response.domain_id);  
            localStorage.setItem('newBusinessAdminSignup', '1'); 

            this.domainId = response.domain_id;
            
            let platformId='1';
            //localStorage.setItem('platformId', platformId);
            if(platformId==PlatFormType.Collabtic)
            {
              localStorage.setItem('platformName', PlatFormNames.Collabtic);
            }
            else if(platformId==PlatFormType.MahleForum)
            {
              localStorage.setItem('platformName', PlatFormNames.MahleForum);
            }
            else if(platformId==PlatFormType.CbaForum)
            {
              localStorage.setItem('platformName', PlatFormNames.CbaForum);
            }
            else if(platformId==PlatFormType.KiaForum)
            {
              localStorage.setItem('platformName', PlatFormNames.KiaForum);
            }
            else
            {
              localStorage.setItem('platformName', PlatFormNames.Collabtic);
            }            
            setTimeout(() => {       
                  
              //if( this.splittedDomainURL == Constant.forumLive ){    
                var redirectUrl = "";
                let emailVal: string;    
                emailVal = btoa(this.signupForm3.value.email.trim());
                let pwdVal: string;
                pwdVal = btoa(this.signupForm3.value.password.trim()); 
                redirectUrl = 'https://'+this.newDomainName+this.MainDomainName; 
                var paramVal = '/auth/login/?pId='+platformId+'&dId='+this.domainId+'&dName='+this.newDomainName+'&email='+emailVal+'&pwd='+pwdVal+'&fs=1';                
                var replaceURL = redirectUrl+paramVal; 
                //localStorage.setItem('logginState','1');              
                window.location.replace(replaceURL);              
              //}
              /*else{ 
                this.router.navigate([this.redirectUrl]); 
                setTimeout(() => {
                  this.loading3 = false;
                  this.signupEnable = false;                 
                }, 1500);  
              } */                       
            }, 1500);  
          }
        }
        else{
          this.loading3 = false;     
          this.signupEnable = false;  
          this.submitted3 = false; 
          //console.log(response);        
          this.serverErrorMsg = response.message;
          this.serverError = true;
        }
            
      },
      (error => {
          this.loading3 = false;     
          this.signupEnable = false;  
          this.submitted3 = false; 
          //console.log(error);        
          this.serverErrorMsg = error;
          this.serverError = true;
      })
      );  
    }  
  }

  // Only AlphaNumeric with Some Characters [-_ ]
  keyPressAlphaNumericWithCharacters(event) { 

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    //if (/[a-zA-Z0-9-_@.]/.test(inp)) {
    if (/[a-zA-Z0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  /***********************  new business ******************************** */
  
}

