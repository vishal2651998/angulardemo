import { Component, OnInit, HostListener, Input} from "@angular/core";
import { Constant, ContentTypeValues } from "src/app/common/constant/constant";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiService } from '../../../../services/api/api.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loginbg-domain',
  templateUrl: './loginbg-domain.component.html',
  styleUrls: ['./loginbg-domain.component.scss']
})
export class LoginbgDomainComponent implements OnInit {
  @Input() menuId: any;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string = "thread-config";
  public apiKey: string = Constant.ApiKey;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public apiInfo: Object;
  public loading: boolean = true;
  public itemEmpty: boolean = false;
  public configData: any;
  public configLtData: any;
  public configRtData: any;
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public rmHeight: any = 115; 
  public expandFlag: boolean = true;
  public systemMsg: Message[];
  public displayModal: any = false;
  public domainName: string = '';
  public currentDomainName: string = '';
  public currentDomainId: string = '';
  public buttonEnableFlag: boolean = false;
  public errorMsgFlag: boolean = false;
  public errorMsgText: string = '';
  public domainTitleText: string = '';
  public landingBannerFit: boolean = true;
  public loginImageUrl: string = '';
  public bodyClass1:string = "profile";
  public bodyClass2:string = "image-cropper";

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private httpClient: HttpClient,
    private apiUrl: ApiService,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private LandingpagewidgetsAPI: LandingpageService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.domainName = this.user.data.subDomainUrl;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.loadImageData();
 }

  loadImageData(){
    const subDomainData = new FormData();
    subDomainData.append('apiKey', Constant.ApiKey);
    subDomainData.append('domainName', this.domainName);
    this.authenticationService.validateSubDomain(subDomainData).subscribe((response) => {
      if (response.status == "Success") {
        this.loading = false;
        let domainData = response.data[0];
        if(domainData.businessBanner != null && domainData.businessBanner != ''){
          this.landingBannerFit = domainData.bannerOption == '1' ? true : false;
        }
        else{
          this.landingBannerFit = true;
        } 
        this.loginImageUrl = domainData.businessBanner != null &&  domainData.businessBanner != '' ? domainData.businessBanner : '/assets/images/login/business-bg.jpg';
      }
    });
  }

  getDomainList(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    this.commonApi.getAllowedDomains(apiFormData).subscribe(response => {
      console.log(response)
      this.loading = false;
      if(response.status == 'Success'){
        this.configData = [];
        this.configData = response.items;
        console.log(this.configData);
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight-155;
    //this.rmHeight = 115;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    //this.rmHeight = this.rmHeight+headerHeight;
    this.innerHeight = (this.bodyHeight + headerHeight)-138;
  }

  // Update image
  updateLogo() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    const modalRef = this.modalService.open(ImageCropperComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.type = 'Edit';
    modalRef.componentInstance.profileType = 'login-bg';
    modalRef.componentInstance.id = 0;
    modalRef.componentInstance.bannerOption = this.landingBannerFit ? '1' : '0';
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        //let successMsg = receivedService.successmsg;
        let successMsg = 'Login Page BG Updated';
        this.systemMsg = [{severity:'success', summary:'', detail:successMsg}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.systemMsg = [];
        }, 3000);
        this.loginImageUrl = receivedService.show;
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass1);
        this.bodyElem.classList.remove(this.bodyClass2);
        this.bodyElem.classList.remove('auth');
        modalRef.dismiss('Cross click');
      }
    });
    modalRef.result.then((data) => {
      this.bodyElem.classList.remove(this.bodyClass1);
      this.bodyElem.classList.remove(this.bodyClass2);
      this.bodyElem.classList.remove('auth');
    }, (reason) => {
      this.bodyElem.classList.remove(this.bodyClass1);
      this.bodyElem.classList.remove(this.bodyClass2);
      this.bodyElem.classList.remove('auth');
      // on dismiss
    });
  }

  removeLogo(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('businessProfile', '10');
    apiFormData.append('removeFlag', '1');
    let serverUrl = this.apiUrl.apifileUpload();    
    this.httpClient.post<any>(serverUrl, apiFormData).subscribe(res => {
      if(res.status == 'Success'){
        this.loginImageUrl = '/assets/images/login/business-bg.jpg';
        //let successMsg = res.result;
        let successMsg = 'Login Page BG Removed';
        this.systemMsg = [{severity:'success', summary:'', detail:successMsg}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.systemMsg = [];
        }, 3000);
      }
    });
  }


  UpdateCheckBox(){
    let flag = this.landingBannerFit ? '1' : '0';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('businessProfile', '10');
    apiFormData.append('bannerOptionFlag', flag);
    let serverUrl = this.apiUrl.apifileUpload();    
    this.httpClient.post<any>(serverUrl, apiFormData).subscribe(res => { });
  }

  
}




