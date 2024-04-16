import { Component, OnInit, Output, EventEmitter, Input, OnDestroy} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';

@Component({
  selector: 'app-non-user',
  templateUrl: './non-user.component.html',
  styleUrls: ['./non-user.component.scss']
})
export class NonUserComponent implements OnInit, OnDestroy{

  @Output() nonuserResponce: EventEmitter<any> = new EventEmitter();
  @Input() okButtonDisable;
  @Input() successMsg;
  @Input() publicEmail:boolean=false;
  @Input() newSignupSetup;
  @Input() accessType;
  @Input() message;
  @Input() pageRefresh;

  public bodyClass:string = "auth";
  public bodyClass1:string = "auth-bg";
  public bodyClass2:string = "auth-refresh-page";
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

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,   
    private authenticationService: AuthenticationService,
    private probingApi: ProductMatrixService    ) { }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0]; 
    console.log(this.successMsg);
    console.log(this.message);
    this.successMsg = (this.successMsg != undefined && this.successMsg != 'undefined' && this.successMsg != '' ) ? this.successMsg : '';
    this.accessType = (this.accessType != undefined && this.accessType != 'undefined' && this.accessType != '' ) ? this.accessType : '';
    this.message = (this.message != undefined && this.message != 'undefined' && this.message != '' ) ? this.message : '';
    this.newSignupSetup = this.newSignupSetup ? true : false;
    this.pageRefresh = this.pageRefresh ? true : false;

    if(this.pageRefresh){
      this.bodyElem.classList.add(this.bodyClass2); 
    }
    
    this.user = this.authenticationService.userValue;
    if(this.user != null) {      
      this.domainId = this.user.domain_id;
      this.userId = this.user.Userid;
      this.roleId = this.user.roleId;
      this.apiKey = Constant.ApiKey
      this.countryId = localStorage.getItem('countryId');
    }  
    
  }

  pageReload(){
    this.nonuserResponce.emit(true);  
    window.location.reload();
  }
  closeRefreshPOPUP(){
    this.activeModal.dismiss('Cross click');  
  }
  closePOPUP(){ 
    //this.activeModal.dismiss('Cross click');  
    this.nonuserResponce.emit(true);   
  }
  returnLogin(){
    this.activeModal.dismiss('Cross click');  
    this.nonuserResponce.emit(true);
  }
  continue(){
    let userData = {
      'api_key': "dG9wZml4MTIz",
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {    
      let isVerified = response.isVerified;
      let waitingforApproval = response.waitingforApproval;      
      if(isVerified == '1' && waitingforApproval == '0'){
        this.activeModal.dismiss('Cross click');       
        this.bodyElem.classList.remove(this.bodyClass); 
        this.bodyElem.classList.remove(this.bodyClass1); 
        window.location.reload();  
      }             
    });
  
  
  }
  completedOK(type){
   
    this.nonuserResponce.emit(type);  
    if(this.newSignupSetup)
    {
      location.reload();
    }   
  }
  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass1);    
    this.bodyElem.classList.remove("public-email");
    this.bodyElem.classList.remove(this.bodyClass2);     
  }
}
