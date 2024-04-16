import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmedValidator  } from '../../../../../components/_helpers/confirmed.validator';
import { AuthSuccessComponent } from '../../../../../components/common/auth-success/auth-success.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Constant } from '../../../../../common/constant/constant';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})

export class ResetpasswordComponent implements OnInit {

  @Input() public successResponce;
  
  resetPasswordForm: FormGroup = new FormGroup({});
  public loading: boolean = true;
  passwordInputFlag = false;
  cpasswordInputFlag = false;
  submitted = false;
  saveEnable = true;
  public countryId;
  public userId;
  public domainId: number;
  public domainName: string ='';
  public serverError;
  public serverErrorMsg;
  public headerLogo: string ='assets/images/login/collabtic-logo-blacktext.png';
  public loading1;
  public bodyHeight: number; 
  public innerHeight: number;
  public pwdFieldTextType1: boolean = false;
  public pwdFieldTextType2: boolean = false;
  public passwordchecker:boolean = false;
  public passwordValidationError:boolean = false;
  public passwordValidationErrorMsg: string = '';
  public passwordLen:number = 6;
  public disableDefaultPasswordText :boolean = false;
  public cpasswordValidationError:boolean = false;
  public cpasswordValidationErrorMsg: string = '';
  public successPasswordTextIcon: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private router: Router,
    private route: ActivatedRoute,
    
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) { 
    this.titleService.setTitle('Collabtic - Reset Password');
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }
   
  ngOnInit(): void {

    this.loading = false;

    let platformId=localStorage.getItem('platformId');
    if(platformId!='1')
    {     
      this.headerLogo = 'assets/images/mahle-logo.png';
    }
    else
    {      
      this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';
    }
    
    this.userId = this.getQueryParamFromMalformedURL('userid');

    // enabled all domains - strong password
    let domainId = localStorage.getItem('domainId');
    //if(domainId == '97'){
      this.passwordchecker = true;
      this.passwordLen = 8;
    ///}

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(this.passwordLen)]],
      cpassword: ['', Validators.required]
    }, {
      validator: ConfirmedValidator('password', 'cpassword')
    });

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

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

  getQueryParamFromMalformedURL(userid) {
    const results = new RegExp('[\\?&]' + userid + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }

  get f(){
    return this.resetPasswordForm.controls;
  }
   
  submit(){

    this.submitted = true;

    if(this.resetPasswordForm.invalid){
      this.saveEnable = true;
      return false;
    }

    let pwdVal = this.resetPasswordForm.value.password.trim(); 
    if(this.passwordLen>pwdVal.length || this.passwordValidationError){
      return false;
    }

    this.loading1 = true;
    this.saveEnable = true;
    const cpData = new FormData();
    cpData.append('api_key', Constant.ApiKey);
    cpData.append('userid', this.userId);   
    cpData.append('password', this.resetPasswordForm.value.password.trim());
    cpData.append('cpassword', this.resetPasswordForm.value.cpassword.trim());  
    cpData.append('version', '2'); 
    this.countryId = localStorage.getItem('countryId');
    let domainId = localStorage.getItem('domainId');
    let domainName = localStorage.getItem('domainName');  
    domainId = domainId !='' && domainId != null ? domainId : '';
    domainName = domainId !='' && domainName != null ? domainName : '';  
    cpData.append('countryId', this.countryId );   
    cpData.append('subdomainId', domainId );     
    cpData.append('subdomainName', domainName );
    this.authenticationService.changePassword(cpData).subscribe((response) => {
      this.loading1 = false;
      this.saveEnable = false;
      if(response.status == 1) {        
        const msgModalRef = this.modalService.open(AuthSuccessComponent, this.config);
        msgModalRef.componentInstance.successMessage = response.message; 
        msgModalRef.componentInstance.successResponce.subscribe((receivedService) => {      
          if(receivedService){
            msgModalRef.dismiss('Cross click'); 
            this.router.navigate(["/auth/login"]);                  
          }
        }); 
      }
      else {               
        this.serverErrorMsg = response.message;
        this.serverError = true;
      }
    },
    (error => {
        this.loading1 = false;
        this.saveEnable = false;
        console.log(error);        
        this.serverErrorMsg = error;
        this.serverError = true;
    })
    );    

  }

  saveButtonActive(){   
    if( (this.resetPasswordForm.value.password !=null && this.resetPasswordForm.value.cpassword !=null )) {
      if( this.passwordLen <= this.resetPasswordForm.value.password.length && this.passwordLen <= this.resetPasswordForm.value.cpassword.length){
        if( this.resetPasswordForm.value.password == this.resetPasswordForm.value.cpassword){
          this.saveEnable = false;
        } 
        else{
          this.saveEnable = true;
        }  
      }  
      else{
        this.saveEnable = true;
      }   
    }
    else{
      this.saveEnable = true;
    }    
  }
  
  // show/hide password  
  showPassword(type, val){
    if(val == '1'){
      this.pwdFieldTextType1 = (type) ? false : true;
    }
    else{
      this.pwdFieldTextType2 = (type) ? false : true;
    }
  }

  public onKeypress(fieldName,event: any) { 
    
    this.submitted = false;
    // Remove invalid chars from the input
    var inputVal = event.target.value.trim();
    //console.log(inputVal);
    var inputLength = inputVal.length; 
    
    this.serverErrorMsg ='';
    this.serverError = false;

    this.saveButtonActive(); 
   
    switch(fieldName){
      case 1:
        this.passwordInputFlag = (inputLength>0) ? true : false;
        if(this.passwordchecker){
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
            this.successPasswordTextIcon = false;
            this.disableDefaultPasswordText = false;                          
          }                   
        }
        if(this.passwordInputFlag){
          if(this.resetPasswordForm.value.cpassword.length>0){
            if(this.resetPasswordForm.value.password == this.resetPasswordForm.value.cpassword){
                this.cpasswordValidationError = false;
                this.cpasswordValidationErrorMsg = "";
            }
            else{
              this.cpasswordValidationError = true;
              this.cpasswordValidationErrorMsg = "Confirm Password does not match"
            }  
          }
        }
        break;    
      case 2:
        this.cpasswordInputFlag = (inputLength>0) ? true : false;
        if(this.cpasswordInputFlag){
          if(this.resetPasswordForm.value.password == this.resetPasswordForm.value.cpassword){
              this.cpasswordValidationError = false;
              this.cpasswordValidationErrorMsg = "";
          }
          else{
            this.cpasswordValidationError = true;
            this.cpasswordValidationErrorMsg = "Confirm Password does not match"
          }          
        }
        else{
          this.cpasswordValidationError = false;
          this.cpasswordValidationErrorMsg = "";
        }
        break; 
      default:     
        this.passwordInputFlag = false;
        this.cpasswordInputFlag = false;
        break;   
    }
  }
  
    // check strong password
  checkPwdStrongValidation(){
    if(this.passwordchecker){
      let pwdVal = this.resetPasswordForm.value.password.trim(); 
      let validateMsg = this.authenticationService.checkPwdStrongLength(pwdVal,this.passwordLen); 
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