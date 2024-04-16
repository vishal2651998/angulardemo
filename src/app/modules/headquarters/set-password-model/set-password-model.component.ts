import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-set-password-model',
  templateUrl: './set-password-model.component.html',
  styleUrls: ['./set-password-model.component.scss']
})
export class SetPasswordModelComponent implements OnInit {
  
  passwordForm: FormGroup = this.formBuilder.group({});
  public passwordLen:number = 8;
  public passwordchecker:boolean = true;
  public successPasswordTextIcon: boolean = false;
  public disableDefaultPasswordText :boolean = false;
  public passwordValidationError:boolean = false;
  public passwordValidationErrorMsg: string = '';
  public fieldEnable: boolean = true;
  public user:any;
  public changePass = false;
  public apiKey: string = Constant.ApiKey;
  public dekraNetworkId: string = '';
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public confirmPasswordMatch: boolean = false;
  public passHidden:boolean = true;
  public confirmPassHidden:boolean = true;
  public oldPassHidden: boolean = true;

  userId: any;
  domainId: any = "";
  constructor(
    private formBuilder:FormBuilder,
    private authenticationService:AuthenticationService,
    private hqService:HeadquarterService,
    private modalService:NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.domainId = this.user.domain_id;
  }

  hideOldPass(){
    this.oldPassHidden =  !this.oldPassHidden
  }

  hidePass(){
    this.passHidden =  !this.passHidden
  }

  hideConfirmPass(){
    this.confirmPassHidden =  !this.confirmPassHidden
  }

  createForm(){
    if(this.changePass){
      this.passwordForm = this.formBuilder.group({
        oldPassword:["",[Validators.required]],
        password:["",[Validators.required,Validators.minLength(8)]],
        confirmPassword:["",[Validators.required,Validators.minLength(8)]]
      })
    }else{
      this.passwordForm = this.formBuilder.group({
        password:["",[Validators.required,Validators.minLength(8)]],
        confirmPassword:["",[Validators.required,Validators.minLength(8)]]
      })
    }
  }

  confirmPassCheck(){
    let pwdVal = this.passwordForm.value.confirmPassword.trim();
    if(pwdVal == this.passwordForm.value.password){
      this.confirmPasswordMatch = true;
    }else{
      this.confirmPasswordMatch = false;
    }
  }

  checkpasswordtext(event)
{
  if(this.passwordchecker){
    this.fieldEnable = false;
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

// check strong password
checkPwdStrongValidation(){
  if(this.passwordchecker){
    let pwdVal = this.passwordForm.value.password.trim();
    this.confirmPassCheck()
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

submitForm( ){
  if(!this.passwordValidationError && this.passwordForm.valid && this.confirmPasswordMatch){
    let formData = new FormData();
    formData.append("apiKey",this.apiKey);
    formData.append("userId",this.userId);
    formData.append("networkId",this.dekraNetworkId);
    formData.append("domainId",this.domainId);
    formData.append("password",this.passwordForm.value.password);
    this.hqService.setPassword(formData).subscribe(res=>{
      this.activeModal.close();  
    });
  }
}
}
