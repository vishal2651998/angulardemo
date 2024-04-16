import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import { CommonService } from "src/app/services/common/common.service";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import { EmailNotFoundComponent } from '../../../../../components/common/email-not-found/email-not-found.component';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { LandingpageService}  from '../../../../../services/landingpage/landingpage.service';
import { Constant } from '../../../../../common/constant/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tvssso',
  templateUrl: './tvssso.component.html',
  styleUrls: ['./tvssso.component.scss']
})
export class TvsssoComponent implements OnInit, OnDestroy {
  
  subscription: Subscription = new Subscription();
  @Input() public filteredUsers;
  @Input() public successResponce;
  @Input() public nonEmailResponce;
  @Output() otherUserAction: EventEmitter<any> = new EventEmitter();
  @ViewChild('myInput1') myInput1Element: ElementRef;
  
  public processStep1: boolean = false;
  public processStep2: boolean = false; 
  public tvsSSOCall;  
  public addForm1: FormGroup; 
  public addForm2: FormGroup;  
  public Form: FormGroup;
  public submitted:boolean;
  public nextEnable: boolean = false;
  public serverError;
  public serverErrorMsg;
  public userInputFlag: boolean = false;
  public loading1: boolean = false;
  public loading2: boolean = false;
  public userTypeId;
  public userType: string = '';
  public userTypeData: any;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public pwdFieldTextType: boolean = false;
  public addform2Submitted: boolean = false;
  public userCodeInputFlag: boolean = false;
  public addform2UserError: boolean = false;
  public userCode;
  public password;
  public codeDisable: boolean = false;
  public passwordInputFlag: boolean = false;
  public passwordInputArrowFlag: boolean = false;
  public addform2PwdError: boolean = false;
  public pwdDisbale: boolean = false;
  public addform2ServerError: boolean = false;
  public addform2ServerErrorMsg: string = '';
  public domainId;
  public redirectUrl: string = "landing-page";

  public processStep3: boolean = false;
  public addForm3: FormGroup;  
  public emailInputFlag:boolean = false;
  public addform3Submitted:boolean;
  public emailErrorMsg;
  public emailError;
  public addform3ServerErrorMsg: string = '';
  public addform3ServerError: boolean = false;
  public loading3: boolean = false;
  public accessToken: string = '';

  public processStep4: boolean = false;
  public addForm4: FormGroup;  
  public addform4Submitted:boolean;
  public addform4ServerErrorMsg: string = '';
  public addform4ServerError: boolean = false;
  public loading4: boolean = false;
  public loading41: boolean = false;
  public dealerCodeInputFlag: boolean = false;
  public userRoleInputFlag: boolean = false;
  public userBranchInputFlag: boolean = false;
  public userLanguageInputFlag: boolean = false;
  public dealerCodeInputTickFlag: boolean = false;
  public enableCols: boolean = false;
  public branchListData : string = '';

  public userRoleId;
  public userRole: string = '';
  public userRoleList: any;
  public userRoleListData: any;

  public userBranchId;
  public userBranch: string = '';
  public userBranchList: any;
  public userBranchListData: any;

  public userLanguageId;
  public userLanguageSn : string = '';
  public userLanguage: string = '';
  public userLanguageList: any;
  public userLanguageListData: any;

  public dealerCodeError: boolean = false;
  public countryId = Constant.CountryID;
  public countryName = Constant.CountryName;
  public languageId = Constant.LanguageID;
  public languageName = Constant.LanguageName;
  public countryInfo: any;
  public accessTokenDealer: string = '';
  public dealerUserId;

  public designation: string = '';
  public designationId;
  public designationInputFlag: boolean = false;
  public userName: string = '';
  public userNameId;
  public userNameInputFlag: boolean = false;
  public processStep5: boolean  = false;
  public addForm5: FormGroup;  
  public addform5Submitted:boolean;
  public addform5ServerErrorMsg: string = '';
  public addform5ServerError: boolean = false;
  public loading5: boolean = false;

  public userCodeDealer: string = '';
  public passwordDealer: string = '';
 
  constructor(private commonApi: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private router: Router, 
    private authenticationService: AuthenticationService,
    private landingpageService: LandingpageService,    
   ) {      
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
     }

  // convenience getter for easy access to form fields
  get f3() { return this.addForm3.controls; }

  ngOnInit(): void { 
    
    this.addForm1 = this.formBuilder.group({
      userType: ['', [Validators.required]]      
    }); 
    this.addForm2 = this.formBuilder.group({
      userCode: ['', [Validators.required]],
      password: ['', [Validators.required]]     
    });  
    this.addForm3 = this.formBuilder.group({
      //email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$')]],                       
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],                       
    });
    this.addForm4 = this.formBuilder.group({
      dealerCode: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      userBranch: ['', [Validators.required]],
      userLanguage: ['', [Validators.required]],
      userCode: ['', [Validators.required]],
      password: ['', [Validators.required]] 
   });
   this.addForm5 = this.formBuilder.group({        
    designation: ['', [Validators.required]],
    userName: ['', [Validators.required]]      
  }); 

    this.domainId = localStorage.getItem('domainId');
    this.countryId = localStorage.getItem('countryId');
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
    this.processStep1 = true;
    localStorage.removeItem('tvsOther'); 
    localStorage.removeItem('employeeType');
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeePwd'); 
    localStorage.removeItem('pageNavAuth');  
  }

  addUserType() {  
    let userTypeData = localStorage.getItem("userTypes");
    this.userTypeData = JSON.parse(userTypeData); 
    if(this.userType == ''){
      this.nextEnable = false;
      this.loading1 = false;      
    }
    this.userInputFlag = true;
    this.serverErrorMsg = '';
    this.serverError = false;  
    let innerHeight = window.innerHeight;
    let userType = {
      userTypeId: this.userTypeId,
      userTypeName: this.userType,
    }   
    const modalRef = this.modalService.open(ManageUserComponent, this.modalConfig);
    modalRef.componentInstance.access = 'tvssso';
    modalRef.componentInstance.apiData = this.userTypeData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = 'get';
    modalRef.componentInstance.selectedUsers = userType;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      if(!receivedService.empty)  {       
        let userTypeData = receivedService;
        this.userTypeId = userTypeData.uTypeId;
        this.userType = userTypeData.uTypeName; 
        this.nextEnable = true;
        this.loading1 = false;
      }
      else{
        if(this.userType == ''){
          this.userInputFlag = false;        
        }
      }               
      modalRef.dismiss('Cross click');
    }); 

  }

  // added manager
  submitNextStep1(){
    this.loading1 = true;
    this.nextEnable = true;
    this.serverError = false;
    this.serverErrorMsg = "";

    switch(this.userTypeId){
      case 1:
        localStorage.removeItem('tvsOther');     
        this.processStep2 = true;
        this.processStep1 = false;
        setTimeout(() => { 
          this.myInput1Element.nativeElement.focus(); 
          // this will make the execution after the above boolean has changed 
        }, 100);
        break;
      case 5:
        localStorage.removeItem('tvsOther');     
        this.processStep4 = true;
        this.processStep1 = false;
        setTimeout(() => { 
          this.myInput1Element.nativeElement.focus();           
          this.dealerCodeInputFlag = false;
          this.userRoleInputFlag = false;
          this.userBranchInputFlag = false;
          this.userLanguageInputFlag = false;
          this.userCodeInputFlag = false;
          this.passwordInputFlag = false;
          this.passwordInputArrowFlag = false;
          this.dealerCodeError = false;
          this.dealerCodeInputTickFlag = false;
          this.addform4ServerError = false;
          this.addform4ServerErrorMsg = '';
          this.addForm4.reset();
          this.addForm4.controls['userCode'].disable();
          this.addForm4.controls['password'].disable();
          this.userCodeDealer = '';
          this.passwordDealer = '';
          this.userRole = '';
          this.userBranch = '';
          this.userLanguage = '';
          this.enableCols = false;
          // this will make the execution after the above boolean has changed 
        }, 100);
        break;
      default:
         //this.serverError = true;
          //this.serverErrorMsg = "Select valid user Type";
          this.nextEnable = true;
          this.loading1 = true;
          localStorage.setItem('tvsOther','1');    
          setTimeout(() => {        
            this.otherUserAction.emit(this.userTypeId);        
            this.nextEnable = false;
            this.loading1 = false;
          }, 1000); 
        break;
    }
  }

  submitNextStep2(){

    
    this.addform2PwdError = (this.addForm2.value.password.length < 6) ? true : false;
    
    if (this.addform2PwdError && this.addform2UserError) {
      return;
    }

    this.loading2 = true;
    const loginData = new FormData();   
    loginData.append('apiKey', Constant.ApiKey);
    loginData.append('employeeId', this.addForm2.value.userCode.trim());    
    loginData.append('password', this.addForm2.value.password.trim());
    loginData.append('step', '1');
    loginData.append('version', '1');
    loginData.append('subDomainId', this.domainId);
    loginData.append('userType', this.userTypeId);
    
    this.authenticationService.tvsSSOLogin(loginData).subscribe(
      response => {
                 
        if(response.actionStatus == 1){ // set 1            

          localStorage.removeItem("loggedOut");

          this.authenticationService.UserSuccessData(response);
          localStorage.setItem('userId', response.Userid);
          
          if(response.firstWorkstream)
          {
            localStorage.setItem('firstWorkstream', response.firstWorkstream);
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
       
        // this.router.navigate([aurl]);
        window.name=this.redirectUrl;
        var w = window.open(this.redirectUrl, this.redirectUrl);
        if (w) 
        {
          window.location.href=this.redirectUrl;
        }
           
          
        
      ///  var customWindow = window.open(this.redirectUrl, this.redirectUrl);
       // customWindow.close();
          setTimeout(() => {
            this.loading2 = false;
           // var customWindow = window.open('auth', '_parent');
           // customWindow.close();
           // window.close();
           
          //  self.close();
         //   setTimeout(() => {window.close();}, 2000);
          //  setTimeout(() => {window.close();}, 4000);
          
        
          }, 1500);
          //this.router.navigate(['../login'], { relativeTo: this.route });                 
        }    
        else if(response.actionStatus == 2){ // set 2     
          this.processStep3 = true;
          this.processStep2 = false;
          this.processStep1 = false;
          this.accessToken = response.accessToken;
        }     
        else {
          this.loading2 = false;
          this.addform2ServerErrorMsg = response.message;
          this.addform2ServerError = true;
          this.addform2UserError = true;
          this.addform2PwdError = true;

          /*this.processStep3 = true;
          this.processStep2 = false;
          this.processStep1 = false;*/
        }
      },
      error => {
        this.loading2 = false;
        this.addform2ServerErrorMsg = error;
        this.addform2ServerError = true;
        this.addform2UserError = true;
        this.addform2PwdError = true;
      });
    

  }


  submitNextStep3(){

    this.addform3Submitted = true;  
    // stop here if form is invalid
    if (this.addForm3.invalid) {           
        return;
    }

    this.loading3 = true;
    const loginData = new FormData();   
    loginData.append('apiKey', Constant.ApiKey);
    loginData.append('employeeId', this.addForm2.value.userCode.trim());    
    loginData.append('password', this.addForm2.value.password.trim());
    loginData.append('step', '2');
    loginData.append('version', '1');
    loginData.append('subDomainId', this.domainId);
    loginData.append('userType', this.userTypeId);
    loginData.append('accessToken', this.accessToken);
    loginData.append('emailAddress', this.addForm3.value.email.trim());
    
    this.authenticationService.tvsSSOLogin(loginData).subscribe(
      response => {           
        if(response.actionStatus == 3){ // set 3
          const modalRef = this.modalService.open(EmailNotFoundComponent, this.config);         
          modalRef.componentInstance.successMsg = response.message;
          modalRef.componentInstance.action = "email";
          modalRef.componentInstance.nonEmailResponce.subscribe((receivedService) => { 
            if(receivedService){
              localStorage.setItem('employeeType', this.userTypeId);
              localStorage.setItem('employeeEmail', this.addForm3.value.email.trim());
              localStorage.setItem('employeeId', this.addForm2.value.userCode.trim());
              localStorage.setItem('employeePwd', this.addForm2.value.password.trim());
              localStorage.setItem('pageNavAuth','signup');  
              setTimeout(() => {
                this.router.navigate(['signup']);
                modalRef.dismiss('Cross click'); 
              }, 100);              
            } 
            else{
              modalRef.dismiss('Cross click'); 
              window.location.reload();  
            }                                     
          });
        }
        else if(response.actionStatus == 1){ // set 1  
          localStorage.removeItem("loggedOut");
          this.authenticationService.UserSuccessData(response);
          localStorage.setItem('userId', response.Userid);
          
          if(response.firstWorkstream)
          {
            localStorage.setItem('firstWorkstream', response.firstWorkstream);
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
       
        // this.router.navigate([aurl]);
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
          this.addform3ServerErrorMsg = response.message;
          this.addform3ServerError = true;          
        }
      },
      error => {
        this.loading3 = false;
        this.addform3ServerErrorMsg = error;
        this.addform3ServerError = true;        
      });   
  }  

  // show/hide password  
  showPassword(type) {
    this.pwdFieldTextType = (type) ? false : true;
  }

  // input keypress 
  public inputChange(fieldName, event: any) {

    this.addform4Submitted = false;
    this.addform3Submitted = false;
    this.addform5Submitted = false;
    this.addform2Submitted = false;  
    // Remove invalid chars from the input
    var inputVal = event.target.value.trim();

    var inputLength = inputVal.length;

    switch (fieldName) {
      case 1:       
        this.userCodeInputFlag = (inputLength > 0) ? true : false;  
        this.addform2UserError = false;          
        break;
      case 2:
        this.passwordInputFlag = (inputLength > 0) ? true : false;
        this.passwordInputArrowFlag = (inputLength > 2) ? true : false;
        this.addform2PwdError = false;
        this.addform2ServerErrorMsg = '';
        this.addform2ServerError = false;        
        break;
      case 3:
        this.emailInputFlag = (inputLength>0) ? true : false;
        this.emailError = false;   
        this.addform3ServerErrorMsg = '';
        this.addform3ServerError = false;        
        break;
      case 4:
        this.dealerCodeInputFlag = (inputLength>0) ? true : false; 
        this.dealerCodeInputTickFlag = (inputLength>3) ? true : false; 
        this.addform4ServerErrorMsg = '';
        this.dealerCodeError = false;  
        if(!this.dealerCodeInputFlag){
          this.userRoleInputFlag = false;
          this.userBranchInputFlag = false;
          this.userLanguageInputFlag = false;
          this.userCodeInputFlag = false;
          this.passwordInputFlag = false;
          this.passwordInputArrowFlag = false;
          this.dealerCodeError = false;
          this.addform4ServerError = false;
          this.addform4ServerErrorMsg = '';
          this.addForm4.controls['userCode'].disable();
          this.addForm4.controls['password'].disable();
          this.userCodeDealer = '';
          this.passwordDealer = '';
          this.userRole = '';
          this.userBranch = '';
          this.userLanguage = '';
          this.enableCols = false;
        }      
        break;
      case 5:       
        this.userCodeInputFlag = (inputLength > 0) ? true : false;  
        this.addform4ServerErrorMsg = '';
        this.addform4ServerError = false;      
        break;
      case 6:
        this.passwordInputFlag = (inputLength > 0) ? true : false;
        this.passwordInputArrowFlag = (inputLength > 2 && this.userCodeInputFlag && this.dealerCodeInputFlag && this.userLanguageInputFlag && this.userBranchInputFlag && this.userRoleInputFlag ) ? true : false;
        this.addform4ServerErrorMsg = '';
        this.addform4ServerError = false;        
        break;
      default:       
        this.userCodeInputFlag = false;
        this.passwordInputFlag = false;
        break;

    }

  }

  // input keypress color change
  public onKeypress(fieldName, event: any) {  
    this.addform4Submitted = false;
    this.addform3Submitted = false;
    this.addform5Submitted = false;
    this.addform2Submitted = false;   
    switch (fieldName) {     
      case 2:
        if (event.keyCode === 13) {
          if(this.passwordInputArrowFlag){
            event.preventDefault();
            this.submitNextStep2();
          }
        }
        break;
      case 3:
        if (event.keyCode === 13) {
          if(this.passwordInputArrowFlag){
            event.preventDefault();
            this.submitNextStep3();
          }
        }
        break;
      case 4:        
        if (event.keyCode === 13) {
          if(this.dealerCodeInputTickFlag){
            event.preventDefault();
            this.submitDealerCode();
          }
        }
        break;
      case 6:        
        if (event.keyCode === 13) {
          if(this.passwordInputArrowFlag){
            event.preventDefault();
            this.submitNextStep4();
          }
        }
        break;
      default: 
      break;
    }

  }

  gotoStep1(){ 

    this.processStep1 = true;
    this.loading1 = false;
    this.nextEnable = false;
    this.serverError = false;
    this.serverErrorMsg = "";
    this.userType='';
    this.userInputFlag = false;
    this.addForm1.reset();
    
    this.processStep2 = false;
    this.loading2 = false;
    this.userCodeInputFlag = false;
    this.passwordInputFlag = false;
    this.passwordInputArrowFlag = false;
    this.addform2ServerError = false;
    this.addform2ServerErrorMsg = '';
    this.addForm2.reset();

    this.processStep3 = false;
    this.loading3 = false;
    this.emailInputFlag = false;
    this.addform3ServerError = false;
    this.addform3ServerErrorMsg = '';
    this.addForm3.reset();

    this.processStep4 = false;
    this.loading4 = false;
    this.dealerCodeInputFlag = false;
    this.userRoleInputFlag = false;
    this.userBranchInputFlag = false;
    this.userLanguageInputFlag = false;
    this.userCodeInputFlag = false;
    this.passwordInputFlag = false;
    this.passwordInputArrowFlag = false;
    this.dealerCodeError = false;
    this.dealerCodeInputTickFlag = false;
    this.addform4ServerError = false;
    this.addform4ServerErrorMsg = '';
    this.addForm4.reset();
    this.addForm4.controls['userCode'].disable();
    this.addForm4.controls['password'].disable();
    this.userCodeDealer = '';
    this.passwordDealer = '';
    this.userRole = '';
    this.userBranch = '';
    this.userLanguage = '';
    this.enableCols = false;
  }

  // select dealer Code
  
  
  submitDealerCode() {     
  this.loading4 = true;
  this.enableCols = false;
  this.addform4ServerErrorMsg = "";
  this.dealerCodeError = false;
  this.dealerCodeInputTickFlag = true;
  const loginData = new FormData();   
  loginData.append('apiKey', Constant.ApiKey);
  loginData.append('dealerCode', this.addForm4.value.dealerCode.trim()); 
  this.authenticationService.getDealerInfoTVSSSO(loginData).subscribe((response) => {
      if (response.successCode == '1') {
        this.loading4 = false;
        this.enableCols = true;
        this.addForm4.controls['userCode'].enable();
        this.addForm4.controls['password'].enable();

        let branchList = response.dealerInfo.branchList;
        let languageList = response.dealerInfo.languageList;
        let roleList = response.dealerInfo.roleList;

        if(languageList.length == 1){         
          this.userLanguageId = languageList[0].id;
          this.userLanguage = languageList[0].name; 
          this.userLanguageSn = languageList[0].shortName; 
          this.userLanguageInputFlag = true;
        }
        if(branchList.length == 1){         
          this.userBranchId = branchList[0].branchId;
          this.userBranch = branchList[0].branchName;          
          this.userBranchInputFlag = true;
        }
        if(roleList.length == 1){         
          this.userRoleId = roleList[0].roleId;
          this.userRole = roleList[0].roleName;          
          this.userRoleInputFlag = true;
        }
       
        localStorage.setItem("branchListTVSSSO",JSON.stringify(branchList));
        localStorage.setItem("languageListTVSSSO",JSON.stringify(languageList));
        localStorage.setItem("roleListTVSSSO",JSON.stringify(roleList));
        this.dealerCodeInputTickFlag = false;
        this.dealerCodeError = false;
        this.addform4ServerErrorMsg = '';        
      }
      else {
        this.loading4 = false;
        this.enableCols = false;
        this.dealerCodeError = true;
        this.addform4ServerErrorMsg = response.message;
      
        this.userRoleInputFlag = false;
        this.userBranchInputFlag = false;
        this.userLanguageInputFlag = false;
        this.userCodeInputFlag = false;
        this.passwordInputFlag = false;
        this.passwordInputArrowFlag = false;
        this.addForm4.controls['userCode'].disable();
        this.addForm4.controls['password'].disable();
        this.userCodeDealer = '';
        this.passwordDealer = '';
        this.userRole = '';
        this.userBranch = '';
        this.userLanguage = '';
        this.enableCols = false;

      }
    },
    (error => {
      this.loading4 = false;
      
      this.addform4ServerErrorMsg = error;
      this.dealerCodeError = true;
      
      this.userRoleInputFlag = false;
      this.userBranchInputFlag = false;
      this.userLanguageInputFlag = false;
      this.userCodeInputFlag = false;
      this.passwordInputFlag = false;
      this.passwordInputArrowFlag = false;
     
      this.addForm4.controls['userCode'].disable();
      this.addForm4.controls['password'].disable();
      this.userCodeDealer = '';
      this.passwordDealer = '';
      this.userRole = '';
      this.userBranch = '';
      this.userLanguage = '';
      this.enableCols = false;

    })
    );
  } 
  // selected the types
  selectedType(type){
    if(this.enableCols){
      let innerHeight = window.innerHeight;
      const modalRef = this.modalService.open(ManageUserComponent, this.modalConfig);      
      modalRef.componentInstance.access = 'tvsssoDealer';
      modalRef.componentInstance.height = innerHeight;
      modalRef.componentInstance.action = 'get';

      switch(type){
        case 'role':
          if(this.userRole == ''){
            this.userRoleInputFlag = false; 
            this.userRoleId = '';
            this.userRole = '';                         
          }
          let userRoleListData = localStorage.getItem("roleListTVSSSO");
          this.userRoleListData = JSON.parse(userRoleListData);
           
          this.serverErrorMsg = '';
          this.serverError = false;         
          let userRoleList = {
            id: this.userRoleId,
            name: this.userRole,
          }    
          modalRef.componentInstance.accessTitle = 'Select Role';      
          modalRef.componentInstance.apiData = this.userRoleListData;        
          modalRef.componentInstance.selectedUsers = userRoleList;
          modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
            
            if(!receivedService.empty){       
              let data = receivedService;              
              this.userRoleId = data.id;
              this.userRole = data.name; 
              this.userRoleInputFlag = true;
              this.loading4 = false;
            }                          
            modalRef.dismiss('Cross click');
            this.checkedAllFields();
          }); 
          break;
        case 'branch':
          if(this.userBranch == ''){
            this.userBranchInputFlag = false;            
            this.userBranchId = '';
            this.userBranch = '';                  
          }
          let userBranchListData = localStorage.getItem("branchListTVSSSO");
          this.userBranchListData = JSON.parse(userBranchListData);                  
          this.serverErrorMsg = '';
          this.serverError = false;  
          let innerHeight = window.innerHeight;
          let userBranchList = {
            id: this.userBranchId,
            name: this.userBranch,
          } 
          modalRef.componentInstance.accessTitle = 'Select Branch';   
          modalRef.componentInstance.apiData = this.userBranchListData;       
          modalRef.componentInstance.selectedUsers = userBranchList;
          modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
           
            if(!receivedService.empty)  {       
              let data = receivedService;             
              this.userBranchId = data.id;
              this.userBranch = data.name; 
              this.userBranchInputFlag = true;              
            }                        
            modalRef.dismiss('Cross click');
            this.checkedAllFields();
          }); 
          break;
        case 'language':
          if(this.userLanguage == ''){
            this.userLanguageInputFlag = false; 
            this.userLanguageId = '';
            this.userLanguage = ''; 
            this.userLanguageSn = '';        
          }
          let userLanguageListData = localStorage.getItem("languageListTVSSSO");
          this.userLanguageListData = JSON.parse(userLanguageListData);                  
          this.userBranchInputFlag = true;
          this.serverErrorMsg = '';
          this.serverError = false;  
          let userLanguageList = {
            id: this.userLanguageId,
            name: this.userLanguage,
          } 
          modalRef.componentInstance.accessTitle = 'Select Language';
          modalRef.componentInstance.apiData = this.userLanguageListData;       
          modalRef.componentInstance.selectedUsers = userLanguageList;
          modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {            
            if(!receivedService.empty)  {       
              let data = receivedService;              
              this.userLanguageId = data.id;
              this.userLanguage = data.name; 
              this.userLanguageSn = data.shortName; 
              this.userLanguageInputFlag = true;
              this.loading4 = false;              
            }            
            this.checkedAllFields();            
            modalRef.dismiss('Cross click');
          }); 
          break;
        default:
          break;
      }
    }
  }

  submitNextStep4(){
    
    this.addform4ServerErrorMsg = '';
    this.addform4ServerError = false;
    
    if (!this.passwordInputArrowFlag || !this.userCodeInputFlag || !this.dealerCodeInputFlag || !this.userLanguageInputFlag || !this.userBranchInputFlag || !this.userRoleInputFlag ) {
      return;
    }

    this.loading41 = true;
    const loginData = new FormData();   
    loginData.append('apiKey', Constant.ApiKey);
    loginData.append('dealerCode', this.addForm4.value.dealerCode.trim());    
    loginData.append('roleId', this.userRoleId);
    loginData.append('roleName', this.userRole);
    loginData.append('branchId', this.userBranchId);
    loginData.append('languageId', this.userLanguageSn);
    loginData.append('subDomainId', this.domainId);
    loginData.append('loginId', this.addForm4.value.userCode.trim());  
    //loginData.append('userId', this.addForm4.value.userCode.trim());  
    loginData.append('password', this.addForm4.value.password.trim());   
    loginData.append('step', '1');
    loginData.append('userType', this.userTypeId);
   
    this.authenticationService.tvsSSODealerLogin(loginData).subscribe(
      response => {                 
        if(response.actionStatus == 1){ // set 1    
                    
          this.accessTokenDealer = response.accessToken;
          this.dealerUserId = response.dealerUserId;
          this.loading41 = false;
          this.processStep5 = true;
          this.processStep4 = false;
                  
          /*this.userBranchInputFlag = false;
          this.userLanguageInputFlag = false;
          this.userCodeInputFlag = false;
          this.passwordInputFlag = false;
          this.passwordInputArrowFlag = false;
          this.dealerCodeError = false;
          this.dealerCodeInputTickFlag = false;
          this.addform4ServerError = false;
          this.addform4ServerErrorMsg = '';
          this.addForm4.reset();
          this.addForm4.controls['userCode'].disable();
          this.addForm4.controls['password'].disable();
          this.userRole = '';
          this.userBranch = '';
          this.userLanguage = '';
          this.enableCols = false;*/
          
        }  
        else if(response.actionStatus == 3){ // set 3   
          this.loading41 = false; 
          this.addform4ServerErrorMsg = "";
          this.addform4ServerError = false;
          const modalRef = this.modalService.open(EmailNotFoundComponent, this.config);         
          modalRef.componentInstance.successMsg = response.message;
          modalRef.componentInstance.action = "license";
          //modalRef.componentInstance.successMsg = "Number of licenses exceeded. Please contact administrator. ";
          modalRef.componentInstance.nonEmailResponce.subscribe((receivedService) => { 
            if(receivedService){             
                modalRef.dismiss('Cross click');                       
            }                                 
          });
        }         
        else {
          this.loading41 = false;
          this.addform4ServerErrorMsg = response.message;
          this.addform4ServerError = true;
        }
      },
      error => {
        this.loading41= false;
        this.addform4ServerErrorMsg = error;
        this.addform4ServerError = true;
        
      });
    

  }

  addDesignation(){
    let apiData = {
      apiKey: Constant.ApiKey,
      dealerCode: this.addForm4.value.dealerCode.trim(),
      roleName: this.userRole,
      branchId: this.userBranchId,
      roleId: this.userRoleId,
      requestType: '1',
      designation: ''
    };
    if(this.designation == ''){
      this.designationInputFlag = false;
      this.loading5 = false;        
    }
    this.designationInputFlag = true;
    this.addform5ServerError = false;
    this.addform5ServerErrorMsg = '';
    this.serverError = false;  
    let innerHeight = window.innerHeight;
    let desg = [];
    desg.push({
      id: this.designationId,
      name: this.designation
    });
    let action = 'new';
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "tvsssoEmployee";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.accessTitle = 'Select Designation';   
    modalRef.componentInstance.selectedUsers = desg;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {      
      if(!receivedService.empty)  {       
        let data = receivedService;
        this.designationId = data.id;
        this.designation = data.name; 
        this.designationInputFlag = true;              
      }                        
      modalRef.dismiss('Cross click');
    }); 
  }

  addUserName(){
    if(this.designationInputFlag){
    let apiData = {
      apiKey: Constant.ApiKey,
      dealerCode: this.addForm4.value.dealerCode.trim(),
      roleName: this.userRole,
      branchId: this.userBranchId,
      roleId: this.userRoleId,
      requestType: '2',
      designation: this.designation
    };
    if(this.userName == ''){
      this.userNameInputFlag = false;
      this.loading5 = false;        
    }
    this.userNameInputFlag = true;
    this.addform5ServerError = false;
    this.addform5ServerErrorMsg = '';
    this.serverError = false;  
    let innerHeight = window.innerHeight;
    let users = [];
    users.push({
      id: this.userNameId,
      name: this.userName
    });
    let action = 'new';
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "tvsssoEmployee";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.accessTitle = 'Select User Name';   
    modalRef.componentInstance.selectedUsers = users;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {      
      if(!receivedService.empty)  {       
        let data = receivedService;       
        this.userNameId = data.id;
        this.userName = data.name; 
        this.userNameInputFlag = true;              
      }                        
      modalRef.dismiss('Cross click');
    }); 
  }
  }

  submitNextStep5(){
    
    this.addform4ServerErrorMsg = '';
    this.addform4ServerError = false;
    
    if (!this.passwordInputArrowFlag || !this.userCodeInputFlag || !this.dealerCodeInputFlag || !this.userLanguageInputFlag || !this.userBranchInputFlag || !this.userRoleInputFlag ) {
      return;
    }

    this.loading5 = true;
    const loginData = new FormData();   
    loginData.append('apiKey', Constant.ApiKey);
    loginData.append('dealerCode', this.addForm4.value.dealerCode.trim());    
    loginData.append('roleId', this.userRoleId);
    loginData.append('branchId', this.userBranchId);
    loginData.append('branchName', this.userBranch);
    loginData.append('languageId', this.userLanguageSn);
    loginData.append('subDomainId', this.domainId);
    loginData.append('loginId', this.addForm4.value.userCode.trim());  
    //loginData.append('userId', this.addForm4.value.userCode.trim());  
    loginData.append('password', this.addForm4.value.password.trim());   
    loginData.append('accessToken', this.accessTokenDealer);
    loginData.append('dealerUserId', this.dealerUserId);    
    loginData.append('roleName', this.userRole);
    loginData.append('employeeId', this.userNameId);
    loginData.append('designation', this.designation);
    loginData.append('step', '2');
    loginData.append('userType', this.userTypeId);
   
    this.authenticationService.tvsSSODealerLogin(loginData).subscribe(
      response => {
                   
        if(response.actionStatus == 1){ // set 1         
          this.userBranchInputFlag = false;
          this.userLanguageInputFlag = false;
          this.userCodeInputFlag = false;
          this.passwordInputFlag = false;
          this.passwordInputArrowFlag = false;
          this.dealerCodeError = false;
          this.dealerCodeInputTickFlag = false;
          this.addform4ServerError = false;
          this.addform4ServerErrorMsg = '';
          this.addForm4.reset();
          this.addForm4.controls['userCode'].disable();
          this.addForm4.controls['password'].disable();
          this.userCodeDealer = '';
          this.passwordDealer = '';
          this.userRole = '';
          this.userBranch = '';
          this.userLanguage = '';
          this.enableCols = false;

          localStorage.removeItem("loggedOut");

          this.authenticationService.UserSuccessData(response);
          localStorage.setItem('userId', response.Userid);

          this.countryInfo = response.countryInfo;
          
          this.countryId = '';
          this.countryName = '';
          if(this.countryInfo != undefined){ 
            this.countryId = this.countryInfo[0].id;
            this.countryName = this.countryInfo[0].name;
            localStorage.setItem('countryId', this.countryId);
            localStorage.setItem('countryName', this.countryName);
          }
          
          if(response.firstWorkstream)
          {
            localStorage.setItem('firstWorkstream', response.firstWorkstream);
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
       
        // this.router.navigate([aurl]);
        window.name=this.redirectUrl;
        var w = window.open(this.redirectUrl, this.redirectUrl);
        if (w) 
        {
          window.location.href=this.redirectUrl;
        }
           
          
        
      ///  var customWindow = window.open(this.redirectUrl, this.redirectUrl);
       // customWindow.close();
          setTimeout(() => {
            this.loading5 = false;
           // var customWindow = window.open('auth', '_parent');
           // customWindow.close();
           // window.close();
           
          //  self.close();
         //   setTimeout(() => {window.close();}, 2000);
          //  setTimeout(() => {window.close();}, 4000);
          
        
          }, 1500);
          
        }           
        else {
          this.loading5 = false;
          this.addform5ServerErrorMsg = response.message;
          this.addform5ServerError = true;
        }
      },
      error => {
        this.loading5= false;
        this.addform5ServerErrorMsg = error;
        this.addform5ServerError = true;
        
      });
    

  }


  // enable password arrow 
  checkedAllFields(){
    if (this.userCodeInputFlag && this.dealerCodeInputFlag && this.userLanguageInputFlag && this.userBranchInputFlag && this.userRoleInputFlag ) {
      this.passwordInputArrowFlag = true
    }
    else{
      this.passwordInputArrowFlag = false
    }
  }

  gotoStep4(){
    this.processStep5 = false;
    this.processStep4 = true;
  }



  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

}
  

