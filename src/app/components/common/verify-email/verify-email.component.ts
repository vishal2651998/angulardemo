import { Component, OnInit, Input, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import {  NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotpasswordComponent } from '../../../components/common/forgotpassword/forgotpassword.component';
import { LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { Constant, windowHeight, pageTitle } from '../../../common/constant/constant';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  @Input() firstLastname; 
  @Input() email;
  @Input() stageName;
  @Input() newSignupAdmin;  
  @Input() subDomainUrl;
  @Input() businessName;
  @Input() isprocessCompleted;
  @ViewChild("bottom", { static: false }) top: ElementRef;

  public bodyClass:string = "auth";
  public bodyClass1:string = "auth-bg";
  public bodyElem;
  public apiKey;
  public countryId;
  public domainId;
  public userId;
  public roleId;
  public user: any;
  public serverError;
  public serverMsg;
  public serverSuccess;
  public recentFlag;
  public notGetFlag;
  public verifyFlag;
  public height = 0;
  public loading: boolean = false;
  public tvsSSOFlag: boolean = false;
  public showEmailProcess: boolean = false;  
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public disableManager: boolean = false;
  public continueServerMsg: string = '';
  public newDomainName: string = '';
  public newAccountSetup: boolean = false;
  public editEmailFlag: boolean = false;
  public checkProcess: string = '';

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      this.height = windowHeight.height;       
      if(this.height>614){
        this.height = 614;
      }    
    }, 200);
  }

  constructor(
    private landingpageAPI: LandingpageService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,   
    private authenticationService: AuthenticationService 
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.bodyElem = document.getElementsByTagName('body')[0];    
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);

    this.user = this.authenticationService.userValue;
    console.log(this.user);
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;    
    this.apiKey = Constant.ApiKey
    this.countryId = localStorage.getItem('countryId');

    this.newSignupAdmin = (this.newSignupAdmin) ? true : false;
    this.newAccountSetup = (this.newSignupAdmin) ? true : false;
    this.newDomainName = this.subDomainUrl != '' ? this.subDomainUrl : '';
    this.businessName = this.businessName != '' ? this.businessName : '';
    this.checkProcess = this.isprocessCompleted != '' ? this.isprocessCompleted : '';

    if(Constant.TVSSSO == '1'){  // check TVSSSO Process 
      this.tvsSSOFlag = true;
    }

    let platformId=localStorage.getItem('platformId');
    if(platformId!='1'){ 
      this.disableManager = true;
    }

    if(this.newAccountSetup){
      this.email = this.user.Email;
      this.stageName = this.user.Username;
    }

    setTimeout(() => {      
      this.height = windowHeight.height;       
      if(this.height>614){
        this.height = 614;
      }  
      setTimeout(() => {   
        this.loading = false;
      }, 1000); 
    }, 1);
  }

 
  verifiedEmail(){      
    this.verifyFlag = true;
    this.continueServerMsg = '';
    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', this.userId);
    mData.append('domainId', this.domainId);
    mData.append('countryId', this.countryId);
    mData.append('version', '2');    

    this.authenticationService.verifiedEmail(mData).subscribe((response) => {
       
      if(response.status == "Success") {
         this.continueServerMsg = ''; 
         setTimeout(() => {
          this.verifyFlag = false;                  
         }, 5000); 
        this.activeModal.dismiss('Cross click');  
        this.bodyElem.classList.remove(this.bodyClass); 
        this.bodyElem.classList.remove(this.bodyClass1);           
        window.location.reload();             
      }
      else { 
        this.continueServerMsg = response.result;  
        this.verifyFlag = false;       
        setTimeout(() => {           
          this.continueServerMsg = '';          
         }, 3000);        
      }
    },
    (error => {
        this.verifyFlag = false;
        console.log(error);       
        this.continueServerMsg = error;        
    })
    );   
  }

  resentverificationEmail(){
    this.recentFlag = true;
    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', this.userId);
    mData.append('domainId', this.domainId);
    mData.append('version', '2');
    mData.append('domainId', this.domainId);

    this.authenticationService.resetVerificationEmail(mData).subscribe((response) => {
      this.recentFlag = false;
      if(response.status == "Success") {
         console.log(response);   
         this.serverMsg = response.result;
         this.serverSuccess = true;
         this.serverError = false;                
         setTimeout(() => {
          this.serverMsg = '';
          this.serverSuccess = false;
          this.serverError = false;
         }, 3000);  
      }
      else {      
        this.serverMsg = response.result;
        this.serverError = true;
        this.serverSuccess = false;
        setTimeout(() => {
          this.serverMsg = '';
          this.serverSuccess = false;
          this.serverError = false;
         }, 3000); 
      }
    },
    (error => {
        this.recentFlag = false;
        console.log(error);       
        this.serverMsg = error;
        this.serverError = false;
        this.serverSuccess = true;
    })
    );       
  }

  redirecttoLogin(){
    this.activeModal.dismiss('Cross click')    
    this.bodyElem.classList.remove(this.bodyClass1);  
    this.authenticationService.logout();
  }

  notGetVerificationEmail(){    
    this.showEmailProcess = true;       
  }

  hideViewEmailBox(){    
    this.showEmailProcess = false;
  }

  confirmEmail(){
      this.user = this.authenticationService.userValue;
      console.log(this.user);
      let userId = this.user.Userid;
      let domainId = this.user.domain_id;
      this.verifyFlag = true;    
      const mData = new FormData();
      mData.append('apiKey', Constant.ApiKey);
      mData.append('userId', userId);
      mData.append('domainId', domainId);
      mData.append('countryId', this.countryId);
      mData.append('sameEmail', '1');
      mData.append('isProcessStatus', this.checkProcess);
      mData.append('emailId', '');
      if(this.checkProcess == '2'){
        mData.append('statusUpdate', '1');
      }
  
      this.landingpageAPI.updateManagerList(mData).subscribe((response) => {  
        this.verifyFlag = false;         
        if(response.status == "Success") {        
          this.activeModal.dismiss('Cross click');  
          this.bodyElem.classList.remove(this.bodyClass); 
          this.bodyElem.classList.remove(this.bodyClass1);           
          window.location.reload();                                           
        }
        else {      
          this.serverMsg = response.result;
          this.serverError = true;
          this.serverSuccess = false;
          setTimeout(() => {
            this.serverMsg = '';
            this.serverSuccess = false;
            this.serverError = false;
           }, 3000); 
        }
      },
      (error => {
        this.verifyFlag = false;
        console.log(error);       
        this.serverMsg = error;
        this.serverError = false;
        this.serverSuccess = true;
    })
    );       
  }

  // click forgotpassword link...
  editEmailPOPUP() {  
    this.editEmailFlag = true;
    let domainName = localStorage.getItem('domainName'); 
    this.bodyElem.classList.add("auth-edit-email");
   // setTimeout(() => {
      const modalRef = this.modalService.open(ForgotpasswordComponent, { backdrop: 'static', keyboard: false, centered: true });     
      modalRef.componentInstance.domainID = this.domainId;
      modalRef.componentInstance.countryId = this.countryId;
      modalRef.componentInstance.domainName = domainName;
      modalRef.componentInstance.email = this.email;
      modalRef.componentInstance.checkProcess = this.checkProcess;
      modalRef.componentInstance.pageAccess = "landing";    
      modalRef.componentInstance.forgotResponce.subscribe((receivedService) => {        
        if (receivedService) {
          this.email = receivedService;
          console.log(this.email);        
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove("auth-edit-email");
          this.hideViewEmailBox(); 
          this.editEmailFlag = false;       
        }
        else{
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove("auth-edit-email");
          this.editEmailFlag = false;
        }
      });
    //}, 700);    
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove("auth-edit-email");
  }

}
