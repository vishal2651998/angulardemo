import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { HttpClient } from '@angular/common/http';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {

  public headerData: Object;
  public pageAccess: string = "headquarters";
  public sidebarRef: SidebarComponent;
  sidebarActiveClass: { page: any; menu: any; };
  activeView: any = "banner-settings";
  bodyElem: HTMLBodyElement;
  public bodyClass: string = "headquarters";
  public leftEmptyHeight: number = 100;
  public innerHeight: number;
  public bodyHeight: number;
  public headquartersFlag: boolean = true;
  public featuredActionName: string = '';
  headquartersPageRef: HeadquartersListComponent;
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public domainId;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  dekraNetworkId: string;
  bannerList: any = [];

  constructor(
    private router:Router,
    private headQuarterService:HeadquarterService,
    private authenticationService: AuthenticationService,
    private modalService:NgbModal,
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.getBannerList();
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
      searchVal: "",
    };

    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };

    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  uploadLogo(id = "") {
    const modalRef = this.modalService.open(ImageCropperComponent,{size:'md'});
    modalRef.componentInstance.type = "Add";
    modalRef.componentInstance.profileType = "add-banner";
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.id = id;
    // modalRef.componentInstance.id = "";     
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        setTimeout(() => {
          this.getBannerList();
          modalRef.dismiss('Cross click');
          if(id){
            this.showSuccessPopup("image")
          }else{
            this.showSuccessPopup("image-add")
          }
        }, 2000);       
      }
    });
  }


  deleteLogo(id){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        let serverUrl = `${Constant.DekraApiUrl}accounts/profilephoto`
        const formData = new FormData();
        formData.append('user_id', this.userId );
        formData.append('domainId', this.domainId );
        formData.append('businessProfile', '20');
        formData.append('bannerId', id.toString());
        formData.append('deleteFlag', "1");
        this.httpClient.post<any>(serverUrl, formData)
        .subscribe(res => {
          this.getBannerList()
        })
      }
    });
    
  }

  showSuccessPopup(type){
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);

        if(type == "image"){
          msgModalRef.componentInstance.successMessage = "Banner image updated.";
        } else if(type == "image-add"){
          msgModalRef.componentInstance.successMessage = "Banner image added.";
        }
        else{
          msgModalRef.componentInstance.successMessage = "Changes updated.";
        }
        setTimeout(() => {
          msgModalRef.dismiss('Cross click'); 
          this.activeModal.close();    
        }, 2000);
  }

  fillLogo(id,event){
    let serverUrl = `${Constant.DekraApiUrl}accounts/profilephoto`
    const formData = new FormData();
    formData.append('user_id', this.userId );
    formData.append('domainId', this.domainId );
    formData.append('businessProfile', '20');
    formData.append('bannerId', id.toString());
    formData.append('networkId', this.dekraNetworkId);
    formData.append('fillOption',event.checked ? "1" : "0");
    this.httpClient.post<any>(serverUrl, formData)
    .subscribe(res => {
      this.showSuccessPopup("fill")
    })
  }

  getBannerList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getBannerList(apiFormData).subscribe((response:any) => {
      if(response && response.data && response.data.items){
        this.bannerList = response.data.items;
        if(this.bannerList.length < 3){
          for(let i = this.bannerList.length;i <3;i++){
            this.bannerList.push({id:i,image:"",fillOption:true});
          }
        }
      }

      
    })
  }

  menuNav(item) {
    let section = item.slug;
    switch (section) {
      case 'home':
        this.router.navigate(["/headquarters/home"]);
        return false;
      break;
      case 'tools':
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
      break;
      case 'dekra-audit':
        this.router.navigate(["/headquarters/audit"]);
        return false;
      break;
      case 'facility-layout':
        this.router.navigate(["/headquarters/facility-layout"]);
        return false;
      break;
      case 'all-users':
        this.router.navigate(["/headquarters/all-users"]);
        return false;
      break; 
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;    
      default:        
      break;
    } 
     
  }

  sideBarSelect(event){
    console.log(event)
    this.activeView = event;
  }

  setScreenHeight() {
    this.innerHeight = 0;
  let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
  let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
  headerHeight1 = headerHeight1 > 20 ? 30 : 0;
  let headerHeight = headerHeight1 + headerHeight2;
  this.innerHeight = this.bodyHeight - (headerHeight + 76);
  this.leftEmptyHeight = 0;
  this.leftEmptyHeight = headerHeight + 100;
  //this.headquartersPageRef.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 85;   
 }

 back(step) {
  if (step == 'Headquarters') {
    this.headquartersFlag = true;
    this.featuredActionName = '';
    this.router.navigate([`/headquarters/home`])
    this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
    this.headquartersPageRef.featuredActionName = this.featuredActionName;
    setTimeout(() => {
      this.setScreenHeight();
    }, 500);
  }
}



}
