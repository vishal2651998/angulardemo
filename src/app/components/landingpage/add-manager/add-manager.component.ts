import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FollowersFollowingComponent } from '../../../components/common/followers-following/followers-following.component';
import { AuthSuccessComponent } from '../../../components/common/auth-success/auth-success.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { Constant, pageTitle } from '../../../common/constant/constant';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-manager',
  templateUrl: './add-manager.component.html',
  styleUrls: ['./add-manager.component.scss']
})

export class AddManagerComponent implements OnInit {

  @Input() public filteredUsers;
  @Input() public successResponce;
  
  public addMangerForm: FormGroup;   
  public loading: boolean = true; 
  public loading1: boolean = false;
  public managerName: string;
  public managerId;
  public managerNameInputFlag:boolean = false;  
  public errorMsg;
  public invalid: boolean;
  public submitted:boolean;
  public continueEnable: boolean = false;
  public pageAccess: string = "addmanager";

  public bodyHeight: number;  
  public innerHeight: number; 
  public countryId;
  public apiKey;
  public domainId;
  public userId;
  public roleId;
  public bodyElem;
  public user: any;
  public serverError;
  public serverErrorMsg;
  public headerLogo: string ='assets/images/login/collabtic-logo-blacktext.png';
  public disableManager: boolean = false;



 
  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private router: Router, 
    private authenticationService: AuthenticationService,
    private landingpageService: LandingpageService,
    
    private titleService: Title
  ) { 
    this.titleService.setTitle(localStorage.getItem('platformName')+' - Select Your Manager');
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }
  
  ngOnInit(): void {    
   
	let platformId=localStorage.getItem('platformId');
    if(platformId!='1')
    {     
      this.headerLogo = 'assets/images/mahle-logo.png';
      this.disableManager = true;
    }
    else
    {      
      this.headerLogo = 'assets/images/login/collabtic-logo-blacktext.png';
      this.disableManager = false;
    }

    this.bodyElem = document.getElementsByTagName('body')[0];    
    this.bodyElem.classList.add('auth');    

    this.bodyHeight = window.innerHeight;
    //this.loading = false;
    this.continueEnable = true;    

    this.addMangerForm = this.formBuilder.group({
      managerName: ['', [Validators.required]]      
    });    

    this.user = this.authenticationService.userValue;
    console.log(this.user);
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');   
    if(this.disableManager){this.router.navigate(['landing-page']);}
    else{this.loadAddManagerScreen();}
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

  continueButtonActive(){
    if( (this.addMangerForm.value.managerName ==null || this.addMangerForm.value.managerName =='') ) {
      this.continueEnable = true;
    }
    else{
      this.continueEnable = false;
    }    
  }


  selectManager() {  

    this.serverErrorMsg = '';
    this.serverError = false;

    const modalRef = this.modalService.open(FollowersFollowingComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.apiKey = Constant.ApiKey;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.countryId = this.countryId;
    modalRef.componentInstance.userId = '';     
    modalRef.componentInstance.loginUserId = this.userId; 
    modalRef.componentInstance.type = 'add-manager'; 
    modalRef.componentInstance.updatefollowingResponce.subscribe((receivedService) => {
      console.log(receivedService.empty);
      if(receivedService.empty){
        this.managerName = '';       
        this.managerNameInputFlag = false;
        this.continueEnable = true;
      }
      else{
        this.managerId = receivedService.mId;
        this.managerName = receivedService.mName;

        this.managerNameInputFlag = true;
        this.continueEnable = false;         
      } 
      modalRef.dismiss('Cross click');      
    }); 

  }

  // added manager
  addManager(){
    this.loading1 = true;
    this.continueEnable = true;
    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', this.userId);
    mData.append('domainId', this.domainId);
    mData.append('countryId', this.countryId);
    mData.append('userManagerId', this.managerId);
   
    this.landingpageService.updateManagerList(mData).subscribe((response) => {
      if(response.status == "Success") {
        this.loading1 = false;
        this.continueEnable = false;
        const msgModalRef = this.modalService.open(AuthSuccessComponent, this.config);
        msgModalRef.componentInstance.successMessage = "Account Updated!";        
        msgModalRef.componentInstance.successResponce.subscribe((receivedService) => {      
          if(receivedService){
            msgModalRef.dismiss('Cross click');
            //this.bodyElem.classList.remove('auth'); 
            //this.router.navigate(['/landing-page']);
            //window.location.href = 'landing-page';     
            var aurl =  'landing-page';
            /*let routeLoadIndex = pageTitle.findIndex(option => option.slug == aurl);
            if(routeLoadIndex >= 0) {
              let routeLoadText = pageTitle[routeLoadIndex].routerText;
              localStorage.setItem(routeLoadText, 'true');
            }*/
            window.location.href = aurl;  
            //this.bodyElem.classList.remove('auth'); 
            //this.router.navigate([aurl]);
            setTimeout(() => {
              this.bodyElem.classList.remove('auth');
            }, 900);
          }
        });       
      }
      else {
        this.loading1 = false;
        this.continueEnable = false;
        this.managerNameInputFlag = true;
        this.serverErrorMsg = response.result;
        this.serverError = true;
      }
    },
    (error => {
        this.loading1 = false;
        this.continueEnable = false;
        console.log(error);
        this.managerNameInputFlag = true;
        this.serverErrorMsg = error;
        this.serverError = true;
    })
    );    
  } 

  loadAddManagerScreen(){   
    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', this.userId);
    mData.append('domainId', this.domainId);
    mData.append('countryId', this.countryId);
    mData.append('version', '2');

    this.authenticationService.resetVerificationEmail(mData).subscribe((response) => {
        if(response.isProcessCompleted == 1 ){                
          window.location.href = "landing-page";
        }
        else{
          this.loading = false;
        }
    });       
  }
}
  

