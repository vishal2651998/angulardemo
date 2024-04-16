
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { Constant } from '../../../../../common/constant/constant';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.scss']
})
export class EmailverificationComponent implements OnInit {

  public headerLogo: string ='assets/images/login/collabtic-logo-blacktext.png';
  public loading: boolean = true;
  public userId;
  public email;
  public domainId;
  public bodyHeight: number; 
  public innerHeight: number;
  public responseMsg: string = '';
  public verifiedOKFlag: boolean = false;
  public disableManager: boolean = false;
  public noManager;
  public landingUrl: string = "landing-page";
  public loginUrl: string = "landing-page";
  public addManagerUrl: string = "landing-page";

  constructor(private router: Router, private authenticationService: AuthenticationService,private titleService: Title) { this.titleService.setTitle('Collabtic - Email Verification'); }

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
      
    this.userId = this.getQueryParamFromMalformedURL1('userid');
    this.email = this.getQueryParamFromMalformedURL2('email');          
    this.noManager = this.getQueryParamFromMalformedURL3('processCompleted');          

    if(this.noManager == '2=' || this.noManager == '2'){
      localStorage.setItem('newBusinessAdminSignup', '1');
    }
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.verifiedEmail();

    localStorage.removeItem('employeeType');
    localStorage.removeItem('employeeEmail');     
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeePwd'); 

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
  getQueryParamFromMalformedURL1(userid) {
    const results = new RegExp('[\\?&]' + userid + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
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
  getQueryParamFromMalformedURL3(processCompleted) {
    const results = new RegExp('[\\?&]' + processCompleted + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }
  //verifiedOK
  verifiedEmail(){      
    let localUserId = localStorage.getItem('userId');    
    if(localUserId == null || localUserId == 'undefined' || localUserId == undefined){
      localUserId = '0';
    } 
    
    let domainId = localStorage.getItem('domainId');
    if(domainId == null || domainId == 'undefined' || domainId == undefined){
      domainId = '';
    }

    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', localUserId);
    mData.append('domainId', this.domainId);
    mData.append('email', this.email);
    mData.append('domainId', domainId);
    mData.append('encodeUserString', this.userId);
    if(this.noManager == '2=' || this.noManager == '2'){
      mData.append('statusUpdate', '1');
    }
    this.authenticationService.verifiedEmail(mData).subscribe((response) => {      
      if(response.status == "Success") { 
          this.loading = false; 
          this.verifiedOKFlag = true;
          this.responseMsg = response.result;                 
        }
        else {  
          this.loading = false; 
          this.verifiedOKFlag = false;             
          this.responseMsg = "";           
        }
        if(response.isProcessCompleted != undefined){
          this.disableManager = (response.isProcessCompleted == '2') ? true : false;
        }        
      },
      (error => { 
        this.responseMsg = error ;                   
        this.loading = false;   
      })
      );   
  }
  verifiedOK(){
    if(this.authenticationService.userValue) {             
      if(!this.disableManager){ 
        if(this.noManager == '2'){          
          window.location.href = this.landingUrl;
        }
        else{
          this.router.navigate(['landing-page/add-manager']);          
        }        
      }
      else{        
        window.location.href = this.landingUrl;
      }        
    }
    else{      
      window.location.href = this.loginUrl;
    } 
  }
  notVerified(){
    if (this.authenticationService.userValue) {  
      window.location.href = this.landingUrl;
    }
    else{     
      window.location.href = this.loginUrl;
    } 
  }

}
