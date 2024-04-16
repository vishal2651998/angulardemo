import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';

@Component({
  selector: 'app-domain-url',
  templateUrl: './domain-url.component.html',
  styleUrls: ['./domain-url.component.scss']
})
export class DomainUrlComponent implements OnInit {

 @Output() domainURLResponce: EventEmitter<any> = new EventEmitter(); 
 @ViewChild('myInput1') myInput1Element: ElementRef;
  
  public emailInputFlag:boolean;  
  public domainSuccess: boolean = false;
  public URLFound: boolean = false;
  public submitted :boolean = false;
  public loading: boolean = false;
  public loading1: boolean = false;
  public domainForm: FormGroup;
  public invalid: boolean;
  public serverErrorMsg;
  public serverError;
  public domainDataVal: any;
  public countryId;

  constructor(   
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.loading = false;
    setTimeout(() => {      
      this.loading = true;      
      this.domainForm = this.formBuilder.group({
       email: ['', [Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
      });
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.myInput1Element.nativeElement.focus();
      },200); 
      this.countryId = localStorage.getItem('countryId');
    }, 100);  
  }

  // convenience getter for easy access to form fields
  get f() { return this.domainForm.controls; }

  checkEmail(){    
    this.submitted = true;
    if (this.domainForm.invalid) {      
      return;
    }
    this.loading1 = true;
    const domainData = new FormData();
    domainData.append('apiKey', Constant.ApiKey);
    domainData.append('email', this.domainForm.value.email.trim());
    domainData.append('username', this.domainForm.value.email.trim());
    domainData.append('countryId', this.countryId);
    domainData.append('password', '');    
    domainData.append('version', '2');

    this.authenticationService.checkAccountInfo(domainData).subscribe(
      response => { 
        this.loading1 = false;
        if(response.status == "Success") {         
          this.domainDataVal = response.dataInfo;
          console.log(this.domainDataVal); 
          this.domainSuccess = true; 
          this.URLFound = true;
          }
          else {              
            this.domainSuccess = true; 
            this.URLFound = false;     
            this.serverErrorMsg = response.message;
            this.serverError = true;            
          }        
      },       
      error => {
        this.loading1 = false;       
        this.serverErrorMsg = error;
        this.serverError = true;
        
    });     
}

  noAccount(){ 
    this.domainURLResponce.emit('signup');
  }

  successOK(domainURL){ 
    //this.activeModal.dismiss('Cross click');  
    this.domainURLResponce.emit(domainURL);   
  }

  public onKeypress(fieldName,event: any) {  
    this.submitted = false;      
    // Remove invalid chars from the input
    var inputVal = event.target.value.trim();
    //console.log(inputVal);
    var inputLength = inputVal.length; 
   
    switch(fieldName){
      case 1:
        this.emailInputFlag = (inputLength>0) ? true : false;
        break;     
      default:     
        this.emailInputFlag = false;
        break;   
    }
  } 

}


