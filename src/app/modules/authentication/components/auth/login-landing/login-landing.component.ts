import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-landing',
  templateUrl: './login-landing.component.html',
  styleUrls: ['./login-landing.component.scss']
})
export class LoginLandingComponent implements OnInit {

  public loading: boolean = true;

  public setbgClassName: string = 'login-bg';  
  public headerLogo: string = 'assets/images/login/newversion-collabtic-logo.png';
  public platformIdInfo= localStorage.getItem('platformId');
  public title='Login';
  public bodyHeight: number;
  public innerHeight: number;  
  public redirectUrl: string = "landing-page";
  public splittedDomainURL: string = '';
  
  public repairifyFlag: boolean=false;
   // Set Screen resize Height
   @HostListener('window:resize', ['$event'])
   onResize(event) {
     this.innerHeight = event.target.innerHeight;
   }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
  }

  ngOnInit(): void {     
    this.loading = false;
    this.bodyHeight = window.innerHeight;
    let currentURL = window.location.href;
    let splittedURL1 = currentURL.split("://");
   // splittedURL1[1] = "repairify.collabtic.com"; // check url
    let splittedURL2 = splittedURL1[1].split(".");
    this.splittedDomainURL = splittedURL2[0];
    if(this.splittedDomainURL == 'repairify')
    {
      this.repairifyFlag=true;
      this.headerLogo='https://forum.collabtic.com/img/repairify-logo.png';
    }
    this.setScreenHeight();    
  }
 
  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = this.bodyHeight;
  }
  
  navigatepage(type){
    if(type == 'page1'){
     // this.redirectUrl = "https://forum.collabtic.com";
     if(this.repairifyFlag)
     {
     
      window.open('https://repairifysso.collabtic.com/repairifysso/index.php?sso', '_self');
     }
     else
     {
      this.redirectUrl = "/login-index";
      //this.redirectUrl = "/login";
      this.router.navigate([this.redirectUrl]); 
     }
      
      //window.location.replace(this.redirectUrl); 
    }
    else{
      if(this.repairifyFlag)
      {
        this.redirectUrl = "https://repairify.collabtic.com/login"; 
        //this.router.navigate([this.redirectUrl]); 
        window.location.replace(this.redirectUrl);   
      }
      else
      {
        this.redirectUrl = "https://tech.collabtic.com"; 
        //this.router.navigate([this.redirectUrl]); 
        window.location.replace(this.redirectUrl); 
      }
     
    }
  }
}

