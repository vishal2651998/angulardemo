import { Component, OnInit, HostListener, Input} from "@angular/core";
import { Constant, ContentTypeValues } from "src/app/common/constant/constant";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { UserDashboardService } from 'src/app/services/user-dashboard/user-dashboard.service'; 

@Component({
  selector: 'app-allowed-domains',
  templateUrl: './allowed-domains.component.html',
  styleUrls: ['./allowed-domains.component.scss']
})
export class AllowedDomainsComponent implements OnInit {
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
  public anyDomainAllowedFlag: boolean = false;
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private LandingpagewidgetsAPI: LandingpageService,
    private userDashboardApi: UserDashboardService,
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.getAllowedDomains();
  }

  // Get Dispatch Notification Config
  getAllowedDomains(action = '', id:any = '') {
    this.errorMsgFlag = true;
    this.errorMsgText = "";
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    switch(action) {
      case 'new':
        apiFormData.append('uid', '0');
        apiFormData.append('name', this.domainName.trim());      
        this.commonApi.getUpdateDomains(apiFormData).subscribe(response => {
          if(response.status == 'Success'){
            this.getDomainList();
            this.closeDomianpopup();
            let successMsg = response.result;
            //let successMsg = "Nofitication Config Action has been successfully Updated";
            this.systemMsg = [{severity:'success', summary:'', detail:successMsg}];
            this.primengConfig.ripple = true;
            setTimeout(() => {
              this.systemMsg = [];
            }, 3000);
          }
          else{
            this.errorMsgFlag = true;
           this.errorMsgText = response.result;
          }
        });
        break;
      case 'update':
        apiFormData.append('uid', this.currentDomainId);
        apiFormData.append('name', this.domainName.trim());
        apiFormData.append('oldName', this.currentDomainName);       
        this.commonApi.getUpdateDomains(apiFormData).subscribe(response => {
          if(response.status == 'Success'){
            this.getDomainList();
            this.closeDomianpopup();
            let successMsg = response.result;
            //let successMsg = "Nofitication Config Action has been successfully Updated";
            this.systemMsg = [{severity:'success', summary:'', detail:successMsg}];
            this.primengConfig.ripple = true;
            setTimeout(() => {
              this.systemMsg = [];
            }, 3000);
          }
          else{
           this.errorMsgFlag = true;
           this.errorMsgText = response.result;
          }
        });
        break;
      case 'delete':
        apiFormData.append('uid', id);
        apiFormData.append('deleteStatus', '1');       
        this.commonApi.getUpdateDomains(apiFormData).subscribe(response => {
          if(response.status == 'Success'){
            this.closeDomianpopup();     
            let successMsg = response.result;
            let dindex = this.configData.findIndex(option => option.id == id);
            if(dindex >= 0) {
              this.configData.splice(dindex, 1);
            }
            //let successMsg = "Nofitication Config Action has been successfully Updated";
            this.systemMsg = [{severity:'success', summary:'', detail:successMsg}];
            this.primengConfig.ripple = true;
            setTimeout(() => {
              this.systemMsg = [];
            }, 3000);
          }
          else{
           this.errorMsgFlag = false;
           this.errorMsgText = response.result;
          }
          
        });
        break;
      default:
        this.getDomainList();
        break;  
    }    
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
        this.anyDomainAllowedFlag = response.anyDomainAllowed == "1" ? true: false;
        this.configData = response.items;
        console.log(this.configData);
      }
    });
  }

  onToggleBoxChange(flag){
    let flagValue = flag ? '1' : '0';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);      
    apiFormData.append('systemSettingsId', '4');      
    apiFormData.append('anyDomainAllowed', flagValue); 
        
    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe(res => {
  
      if(res.status=='Success'){
        this.systemMsg = [{severity:'success', summary:'', detail:res.result}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.systemMsg = [];
        }, 3000);
        console.log(res);
      }
      else{
  
      }
        
      },
      (error => {})
      );
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

 
  openDomainpopup(type,id,name){
    this.buttonEnableFlag = false;
    this.displayModal = true;
    if(type == 'new'){
      this.domainTitleText = "Add Allowed Domain";
      this.currentDomainName = '';
      this.currentDomainId = '';
      this.domainName = '';
    }
    else{
      this.domainTitleText = "Edit Allowed Domain";
      this.domainName = name;
      this.currentDomainName = name;
      this.currentDomainId = id;
    }    
  }

  updateDomain(){
    if (this.domainName.split('.').length>1){
      if(this.currentDomainId == ''){
        this.getAllowedDomains('new');
      }
      else{
        this.getAllowedDomains('update');
      }
    }
    else{
      this.errorMsgFlag = true;
      this.errorMsgText = "Enter valid domain";
      
    }  
  }

  closeDomianpopup(){
    this.displayModal = false;
    this.currentDomainName = '';
    this.currentDomainId = '';
    this.domainName = '';    
  }

  removeDomain(id){
    this.getAllowedDomains('delete',id);
  }

  domainNameChange(event){
    this.errorMsgFlag = true;
    this.errorMsgText = "";
    //console.log(event);
    //console.log(this.domainName);
    this.domainName = this.domainName.trim();
    if(this.domainName == ''){
      this.buttonEnableFlag = false;
    }
    else{
      this.buttonEnableFlag = true;
    }
  }
}



