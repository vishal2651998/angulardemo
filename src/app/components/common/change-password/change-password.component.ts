import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { environment } from '../../../../environments/environment';
import { pageInfo, Constant,PlatFormType,forumPageAccess } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  @Input() apiData: any = [];
  @Output() emitResponse: EventEmitter<any> = new EventEmitter();
  changePasswordForm: FormGroup;

  public oldPassword: string = "";
  public newPassword: string = "";
  public confirmNewPassword: string = "";

  public enterTxt: string = "Enter";
  public passwordTxt: string = "Password";
  public oldPwdLabel: string = `Old ${this.passwordTxt}`;
  public newPwdLabel: string = `New ${this.passwordTxt}`;
  public confirmPwdLabel: string = `Confirm ${this.passwordTxt}`;
  public minCharTxt: string = "Min. 6 chars";

  public opwdFieldTextType: boolean = false;
  public npwdFieldTextType: boolean = false;
  public cpwdFieldTextType: boolean = false;
  public submitFlag: boolean = false;
  public submitLoading: boolean = false;
  public changPasswordSubmitted: boolean = false;
  public passwordMatch: boolean = true;
  public invalidOldPwdFlag: boolean = false;
  public invalidOldPwdMsg: string = "";
  public invalidMsgFlag: boolean = false;
  public invalidMsg: String = "";
  public countryId;

  public successPasswordTextIcon: boolean = false;
  public disableDefaultPasswordText :boolean = false;
  public passwordchecker:boolean = false;
  public passwordValidationError:boolean = false;
  public passwordValidationErrorMsg: string = '';
  public passwordLen:number = 6;
  public user;
  public domainId;
  public cpFormData = new FormData();
  public emitData = {
    action: true,
    msg: ''
  };
  
  constructor(
    private landingpageAPI: LandingpageService,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private authApi: AuthenticationService
  ) { }

  // convenience getters for easy access to form fields
  get c() { return this.changePasswordForm.controls; }

  ngOnInit(): void {

    this.user = this.authApi.userValue;
    this.domainId = this.user.domain_id;
   
    // enabled all domains - strong password
    //if(this.domainId == '97'){
    this.passwordchecker = true;
    this.passwordLen = 8;
    this.minCharTxt = "";
    //}

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(this.passwordLen)]],
      //confirmNewPassword: ['', [Validators.required]]
      confirmNewPassword: [null, Validators.compose([Validators.required])]
    },
    {
      // check whether our password and confirm password match
      validators: this.passwordConfirming
    }); 
    this.countryId = localStorage.getItem('countryId');
    console.log(this.countryId);
  }

  // check whether our password and confirm password match
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmNewPassword').value) {
      return {invalid: true};
    } else {
      return {invalid: false};
    }
  }

  // Onchange Password
  onChange(field, val) {
    this.invalidOldPwdFlag = false;
    this.invalidOldPwdMsg = "";
    this.invalidMsgFlag = false;
    this.invalidMsg = "";
    let formVal = this.changePasswordForm.value;
    switch (field) {
      case 'opwd':
        if(val.length > 0) {
          if(formVal.oldPassword != null && formVal.newPassword != null) {
            this.submitFlag = true;  
          }
        } else {
          this.submitFlag = false;
        }
        break;
      case 'npwd':
        if(formVal.confirmNewPassword != null && val != formVal.confirmNewPassword) {
          this.changPasswordSubmitted = true;
          this.passwordMatch = false;
          this.submitFlag = false;          
        } else {
          this.passwordMatch = true;          
          if(val.length > 0) {           
            if(formVal.oldPassword != null && formVal.confirmNewPassword != null) {                
              this.submitFlag = true;  
            }
          } else {            
            this.submitFlag = false;
          }
        }             
        break;    
      case 'cpwd':
        if(val.length > 0 && val != formVal.newPassword) {
          this.changPasswordSubmitted = true;
          this.passwordMatch = false;
          this.submitFlag = false;
        } else {
          this.passwordMatch = true;
          if(val.length > 0) {
            if(formVal.oldPassword != null && formVal.newPassword != null) {
              this.submitFlag = true;  
            }
          } else {
            this.submitFlag = false;
          }
        }
        break;
    }
  }

  // Show or Hide Password
  showPassword(field, flag){
    switch (field) {
      case 'opwd':
        this.opwdFieldTextType = (flag) ? false : true;
        break;
      case 'npwd':
        this.npwdFieldTextType = (flag) ? false : true;
        break;
      default:
        this.cpwdFieldTextType = (flag) ? false : true;
        break;
    }
    
  }

  // Form Submit
  actionSubmit() {
    if(this.submitLoading || !this.submitFlag)
      return false;

    this.changPasswordSubmitted = true;
    let invalidFlag = true;
    let opwd = this.changePasswordForm.value.oldPassword;
    let npwd = this.changePasswordForm.value.newPassword;
    let cpwd = this.changePasswordForm.value.confirmNewPassword;

    if(opwd != '' && (npwd != '' && this.passwordLen <= npwd.length && npwd == cpwd)) {
      invalidFlag = false
    }

    if(this.changePasswordForm.invalid && invalidFlag) {
      return false;
    }

    if(this.passwordValidationError) {
      return false;
    }

    this.submitLoading = true;
    this.cpFormData = new FormData();
    this.cpFormData.append('api_key', this.apiData['apiKey']);
    this.cpFormData.append('userid', this.apiData['userId']);  
    this.cpFormData.append('oldpassword', opwd);
    this.cpFormData.append('cpassword', npwd);
	  this.cpFormData.append('countryId', this.countryId);
	  this.cpFormData.append('domainId', this.domainId);
    this.cpFormData.append('version', '2');

    this.authApi.changeUserPassword(this.cpFormData).subscribe((response) => {
      console.log(response)
      let msg = response.message;
      if(response.status == 'Success' || response.status == '1') {
        this.invalidMsgFlag = false;
        this.invalidMsg = "";
        this.emitData.msg = msg;
        this.emitData.msg = `<div class="msg-row-1 text-center">${msg}<p>Please login again</p></div>`;
        this.emitResponse.emit(this.emitData);
        setTimeout(() => {
       // this.requestPermission(0);
     
       // this.authApi.logout();
        },1000);
      } else {
        this.submitLoading = false;
        if(response.errorFlag == 1) {
          this.invalidOldPwdFlag = true;
          this.invalidOldPwdMsg = msg;
        } else {
          this.invalidMsgFlag = true;
          this.invalidMsg = msg;
        }        
      }
    });
  }

  

  requestPermission(state) {
  
  
     

        let fcmToken = localStorage.getItem('fcm_token');

       
       
          let fcmAction = 'update';
        let  fcmOldToken = fcmToken;
         
       
        
        const apiFormData = new FormData();       
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.apiData['domainId']);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.apiData['userId']);
        apiFormData.append('deviceName', '');
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', fcmOldToken);
        apiFormData.append('webAppversion', environment.webVersionCollabtic.toString());
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        //console.log(apiFormData);

        this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {

          //console.log(response);
        });


    
     
   
  }

  // Cancel Action
  cancelAction() {
    if(this.submitLoading)
      return false;

    this.emitData.action = false;
    this.emitResponse.emit(this.emitData);
  }

    // check strong password

checkpasswordtext(event)
{
  if(this.passwordchecker){   
    var inputVal = event.target.value.trim();
    var inputLength = inputVal.length; 

    if(this.passwordLen<=inputLength){
      this.checkPwdStrongValidation();
    }
    else{
      if(inputLength == 0){
        this.passwordValidationError = false;              
        this.passwordValidationErrorMsg = '';
      }
      if(this.passwordValidationError){
        this.checkPwdStrongValidation();
      }
      this.disableDefaultPasswordText = false;  
      this.successPasswordTextIcon = false;                 
    }  
  }
}

onBlur(){
  this.checkPwdStrongValidation();
}

checkPwdStrongValidation(){
  if(this.passwordchecker){
    let pwdVal = this.changePasswordForm.value.newPassword.trim(); 
    let validateMsg = this.authApi.checkPwdStrongLength(pwdVal,this.passwordLen); 
    if(pwdVal.length>0){
      if(validateMsg==''){          
        this.passwordValidationError = false;        
        this.disableDefaultPasswordText = true;
        this.successPasswordTextIcon = true;
        this.passwordValidationErrorMsg = '';
      }
      else{
        this.passwordValidationError = true;        
        this.disableDefaultPasswordText = false;
        this.successPasswordTextIcon = false;
        this.passwordValidationErrorMsg = validateMsg;
      }
    }
    else{
      this.passwordValidationError = false;     
      this.disableDefaultPasswordText = false;
      this.successPasswordTextIcon = false;
      this.passwordValidationErrorMsg = '';
    } 
  }    
}

}