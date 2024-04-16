import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from '../../../common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService}  from '../../../services/landingpage/landingpage.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  @Input() domainID; 
  @Input() countryId; 
  @Input() domainName;
  @Input() pageAccess;
  @Input() checkProcess;
  @Input() email;
  @Output() forgotResponce: EventEmitter<any> = new EventEmitter();
  @ViewChild('myInput1') myInput1Element: ElementRef;
  
  public emailInputFlag:boolean;  
  public forgotSuccess: boolean = false;
  public submitted :boolean = false;
  public loading: boolean = false;
  public forgotPasswordForm: FormGroup;
  public invalid: boolean;
  public user: any; 
  public serverError;
  public serverErrorMsg;
  public serverSuccess;
  public serverSuccessMsg;
  public forgotSuccessMsg;
  public loading1;
  public title;
  public bodyElem;

  constructor(   
    private landingpageAPI: LandingpageService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,    
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {  

    this.loading = true;
    this.bodyElem = document.getElementsByTagName('body')[0]; 
    console.log(this.domainID);
    console.log(this.countryId);
    console.log(this.domainName);
    if(this.pageAccess == 'landing'){
      this.title = "Edit Email";
      this.email = this.email;
      this.emailInputFlag = true;
      this.checkProcess = this.checkProcess;
    }
    else{
      this.title = "Reset Password";
      this.email = "";
      this.checkProcess = "";
    }    
    this.forgotPasswordForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.myInput1Element.nativeElement.focus();
      },200);   
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }

  checkEmail(){    
    this.submitted = true;

    this.serverErrorMsg = '';
    this.serverError = false;
    this.serverSuccess = false; 
    this.serverSuccessMsg = '';
    
    if (this.forgotPasswordForm.invalid) {      
      return;
    }
    this.loading1 = true;

    if(this.pageAccess == 'login'){
        const rpData = new FormData();
        rpData.append('apiKey', Constant.ApiKey);
        rpData.append('email', this.forgotPasswordForm.value.email.trim());   
        rpData.append('subdomainId', this.domainID); 
        rpData.append('subdomainName', this.domainName); 
        rpData.append('countryId', this.countryId); 
        rpData.append('version', '2');

        this.authenticationService.resetPassword(rpData).subscribe((response) => {
          this.loading1 = false;
          if(response.status == "Success") {        
            this.forgotSuccess = true; 
            this.forgotSuccessMsg = response.result;
          }
          else {                
            this.serverErrorMsg = response.result;
            this.serverError = true;
          }
        },
        (error => {
          this.loading1 = false;
            console.log(error);        
            this.serverErrorMsg = error;
            this.serverError = true;
        })
        );    
      }
      else{
          this.user = this.authenticationService.userValue;
          console.log(this.user);
          let userId = this.user.Userid;
          let domainId = this.user.domain_id;
          let emailId = this.forgotPasswordForm.value.email.trim();
            
          const mData = new FormData();
          mData.append('apiKey', Constant.ApiKey);
          mData.append('userId', userId);
          mData.append('domainId', domainId);
          mData.append('countryId', this.countryId);
          mData.append('sameEmail', '');
          mData.append('isProcessStatus', this.checkProcess);
          mData.append('emailId', emailId);
      
          this.landingpageAPI.updateManagerList(mData).subscribe((response) => {           
            if(response.status == "Success") {  
              let email = this.forgotPasswordForm.value.email.trim();              
              if(email != this.user.Email){
                this.user.Email = email;
                this.authenticationService.UserSuccessData(this.user); 
                this.resentverificationEmail(); 
              }
              else{
                this.serverSuccessMsg = "Already sent";
                this.serverSuccess = true; 
                this.loading1 = false;
                  setTimeout(() => {          
                    this.forgotResponce.emit(this.forgotPasswordForm.value.email.trim()); 
                  }, 2000);
                }                                                           
            }
            else {
              this.loading1 = false;
              this.serverErrorMsg = response.result;
              this.serverError = true;              
            }
          },
          (error => {
            this.loading1 = false;
              console.log(error);        
              this.serverErrorMsg = error;
              this.serverError = true;
          })
          );
        }  
  }

  resentverificationEmail(){    
    this.user = this.authenticationService.userValue;
    console.log(this.user);
    let userId = this.user.Userid;
    let domainId = this.user.domain_id;
    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', userId);
    mData.append('domainId', domainId);
    mData.append('version', '2');

    this.authenticationService.resetVerificationEmail(mData).subscribe((response) => { 
        this.serverSuccessMsg = response.result;
        this.serverSuccess = true; 
        this.loading1 = false;
        setTimeout(() => {          
          this.forgotResponce.emit(this.forgotPasswordForm.value.email.trim()); 
        }, 2000);           
    },
    (error => {
      this.loading1 = false;
        console.log(error);        
        this.serverErrorMsg = error;
        this.serverError = true;
    })
    );       
  }

  successOK(){ 
    //this.activeModal.dismiss('Cross click');  
    this.forgotResponce.emit(true);   
  }

  closePOPUP(){
    this.forgotResponce.emit(false);   
  }
  public onKeypress(fieldName,event: any) {        
    // Remove invalid chars from the input
    var inputVal = event.target.value.trim();
    //console.log(inputVal);
    var inputLength = inputVal.length; 
    this.submitted = false;

    this.serverErrorMsg = '';
    this.serverError = false;
    this.serverSuccess = false; 
    this.serverSuccessMsg = '';
   
    switch(fieldName){
      case 1:
        this.emailInputFlag = (inputLength>0) ? true : false;
        break;     
      default:     
        this.emailInputFlag = false;
        break;   
    }
  } 
  
  ngOnDestroy() {   
    this.bodyElem.classList.remove("auth-edit-email");
  }

}


