import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { pageInfo, Constant,PlatFormNames,PlatFormType } from 'src/app/common/constant/constant';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-under-maintenance',
  templateUrl: './under-maintenance.component.html',
  styleUrls: ['./under-maintenance.component.scss']
})
export class UnderMaintenanceComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public maintainText: string = '';
  public platformName: string = '';
  public logo;
  public serviceLogo = '';
  public bodyElem;
  public bodyClass = 'maintenance';

  constructor(private authenticationService: AuthenticationService, public activeModal: NgbActiveModal,  private router: Router, private titleService: Title) { this.titleService.setTitle(localStorage.getItem('platformName')+' - Under Maintenance'); }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];    
    this.bodyElem.classList.add(this.bodyClass);  
    this.platformName = '';
    this.maintainText = '';    
    let platformId=localStorage.getItem('platformId');
    let pname = '';
    if(platformId!='1')
    {      
      this.logo = 'assets/images/mahle-logo-um.png';
      this.platformName = 'MAHLE Forum';     
    }
    else
    {      
      this.logo = 'assets/images/login/collabtic-logo-blacktext.png';
      this.platformName = 'Collabtic'; 
    }
    this.checkDomain();
  }

  checkDomain(){   
    let domainName = localStorage.getItem("domainName");
    const subDomainData = new FormData();
    subDomainData.append('apiKey', Constant.ApiKey);
    subDomainData.append('domainName', domainName);
    this.authenticationService.validateSubDomain(subDomainData).subscribe((response) => {
      if (response.status == "Success") {       
        if(response.maintanancePopup == '1'){
          localStorage.setItem("maintanancePopup",'1');
          console.log(response.maintanancePopup);
          console.log(response.maintananceInfo);         
          let maintananceInfo =  response.maintananceInfo;    
          let msg = maintananceInfo.content.replace(this.platformName,'');
          let img = maintananceInfo.imageUrl;
          console.log(msg);
          console.log(img);
          this.maintainText = msg;  
          this.serviceLogo = img;  
          this.loading = false; 
        }
        else{
          localStorage.setItem("maintanancePopup",'0');  
          this.router.navigate(['login']);
        }                
      }
      else{
        localStorage.setItem("maintanancePopup",'0');  
        this.router.navigate(['login']);
      }
    }); 
  }
  ngOnDestroy() {    
    this.bodyElem.classList.remove(this.bodyClass);
  }
 
}

