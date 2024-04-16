import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthenticationService } from '../.../../../services/authentication/authentication.service';
import { ApiService } from '../.../../../services/api/api.service';
import { NgbModal, NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";
import { NavigationEnd, Router } from '@angular/router';
import { ProductMatrixService } from "../.../../../services/product-matrix/product-matrix.service";
import { BehaviorSubject, Subscription } from 'rxjs';
import { pageInfo, Constant, PlatFormType } from 'src/app/common/constant/constant';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { SetPasswordModelComponent } from 'src/app/modules/headquarters/set-password-model/set-password-model.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ChangePasswordComponent } from 'src/app/components/common/change-password/change-password.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() pageData;
  public bodyHeight: number;
  public innerHeight: number;
  public countryId;
  public countryName;
  public languageId;
  public languageName;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public access: string;
  public searchFlag: boolean;
  public profileFlag: boolean;
  public platformId;
  public platformLogo;
  public assetPathplatform: string = "assets/images/";
  public apiKey: string = Constant.ApiKey;
  public dekraNetworkId: string = '';
  subscription: Subscription;
  menuItems = [];
  logoUrl: any = this.assetPathplatform + "dekra-logo.jpg";
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
    size:"mySize"
  };
  constructor(
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private tooltipconfig: NgbTooltipConfig,
    private router: Router,
    private probingApi: ProductMatrixService,
    private headQuarterService: HeadquarterService,
    private modalService: NgbModal
  ) { 

    tooltipconfig.placement = 'bottom';
    tooltipconfig.triggers = 'click';

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if(event.url.includes("headquarters/audit") || event.url.includes("inspection/") || event.url.includes("template/") || event.url.includes("section/")){
         this.setAuditMenu();
        }
        else{
          this.menuItems = [
            {
              label: 'NEW'
            }
          ];
        }
       }
    })

  }

  @HostListener('document:visibilitychange', ['$event'])

  setAuditMenu(){
    this.menuItems = [
      {
        label: 'NEW',
        items: [
          {
                  label: 'New Audit/Inspection',
                  icon: 'custom-icon-inspection',
                  routerLink: '/new-inspection'
              },
              {
                label: 'New Template',
                icon: 'custom-icon-template',
                routerLink: '/new-template'
              },
              {
                  label: 'New Section',
                  icon: 'custom-icon-section',
                  routerLink: '/new-section'
              }
  ]
}
    ];
  }

  navigateToProfile(){
      this.router.navigate(["headquarters/user/" + this.userId])
  }

  openNewPasswordPopup() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Change Password';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = [];
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      //console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;
      msgModalRef.componentInstance.type = 'password';
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.logout();
      }, 3000);
    });
  }

  // openNewPasswordPopup(){
  //   const modalRef = this.modalService.open(
  //     ChangePasswordComponent,
  //     this.modalConfig
  //   );
  //   modalRef.componentInstance.changePass = true;
  //   modalRef.result.then(res=>{
  //     const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
  //     msgModalRef.componentInstance.successMessage = "Password Updated.";
  //     setTimeout(() => {
  //       msgModalRef.dismiss('Cross click'); 
  //     }, 2000);
  //   })
  // }

  visibilitychange() {


    let type1=0;
    navigator.serviceWorker.addEventListener('message', (event) => {
      let currUrl = this.router.url.split('/');
      let logoutDataevent=event.data.data;
      let logoutUser=logoutDataevent.logoutUser;
      if(logoutUser==1)
      {
        this.logout();
        this.authenticationService.logout();
      }
     // this.tapontoast(event.data.data);

    });




  }

  taponlogo() {
    let currUrl = this.router.url.split('/');
    let navUrl = "headquarters/network";
    if(this.access == 'search') {
      this.router.navigate([navUrl]);
    } else {
      if (navUrl == currUrl[1]) {
        window.location.href = navUrl;
      } else {
        //this.router.navigate([navUrl]);
        let navHome = window.open(navUrl, navUrl);
        navHome.focus();
      }
    }
  }

  ngOnDestroy(): void {
    if(this.subscription)
    {
      this.subscription.unsubscribe()
    }

  }

  ngOnInit() {

    this.getLogo();
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    let options = this.pageData;
    this.access = options.access;
    let accessCheck = false;
    this.searchFlag = options.search;
    this.profileFlag = options.profile;


    this.platformId = localStorage.getItem('platformId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.role_id;
    this.countryId = localStorage.getItem('countryId');

    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.Collabtic) {
      this.platformLogo = this.assetPathplatform + "dekra-logo.jpg";
    }

    if (this.profileFlag) {
      this.getUserProfile();
    }

    


  }

  getUserProfile() {

    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("platform", '3');
    apiFormData.append("userId", this.userId);

    this.headQuarterService.getUserDetails(apiFormData).subscribe((response:any) => {  
      let resultData = response.data;
      if(response.data && response.data.logo){
        this.logoUrl = response.data.logo;
        this.storeLogo();
      }
      this.apiUrl.userName = resultData.userName;
      this.apiUrl.profileImage = resultData.profileImage;
      //this.apiUrl.LastLogin = resultData.LastLogin != undefined ? resultData.LastLogin : '' ;
      //this.apiUrl.userRole = resultData.userRole != undefined ?  resultData.userRole : '' ;
      this.platformLogo = (response.businessLogo && response.businessLogo != '' ) ? response.businessLogo : this.platformLogo;
      
      if(resultData.networkId && resultData.networkId != ''){
        localStorage.setItem("dekraNetworkId", resultData.networkId);
      }
      if(resultData.networkHqId && resultData.networkHqId !='' ){
        localStorage.setItem("dekraNetworkHqId", resultData.networkHqId);
      }
      if((resultData.networkId && resultData.networkId != '') && ( resultData.networkHqId && resultData.networkHqId !='' )){
        localStorage.setItem("dekradomainRPage","1");
      }     
      if((resultData.networkName && resultData.networkName != '') && ( resultData.networkName && resultData.networkName !='' )){
        localStorage.setItem("networkName",resultData.networkName);
      }       

      let logoutUser=response.logoutUser;
     if(logoutUser==1)
     {

      setTimeout(() => {
        this.logout();
        this.authenticationService.logout();
      }, 2000);

    }
    });
  }

  getData(reftype='') {

  const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => { 
      let pHq = response.data.hqInfo.find(e=>e.locationType == 1);
      if(pHq?.logoUrl){
        this.logoUrl = pHq.logoUrl;
        this.storeLogo();
      }
     })
    }

  storeLogo(){
    if(this.logoUrl){
      localStorage.setItem("logoUrl",this.logoUrl);
    }
  }

  getLogo(){
    if(localStorage.getItem("logoUrl")){
      this.logoUrl =  localStorage.getItem("logoUrl");
    }
  }



  logout(){
    this.authenticationService.logout();
  }
  navigateToSystemSettings(){
    this.router.navigate(['/headquarters/system-settings'])
  }

}
