import { Component, OnInit, HostListener, Input} from "@angular/core";
import { Constant, ContentTypeValues } from "src/app/common/constant/constant";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

@Component({
  selector: 'app-thread-config',
  templateUrl: './thread-config.component.html',
  styleUrls: ['./thread-config.component.scss']
})
export class ThreadConfigComponent implements OnInit {
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
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public rmHeight: any = 115; 
  public expandFlag: boolean = true;
  public systemMsg: Message[];

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
    this.getDistpatchNotificationConfig();
  }

  // Get Dispatch Notification Config
  getDistpatchNotificationConfig(action = '', actionItems:any = '') {
    const apiFormData = new FormData();
    apiFormData.append('apikey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId); 
    apiFormData.append('contentTypeId', ContentTypeValues.Threads);
    apiFormData.append('menuId', this.menuId);
    switch(action) {
      case 'update':
        apiFormData.append('actionId', actionItems.id);
        apiFormData.append('actionVal', actionItems.actionVal);
        this.commonApi.UpdateDispatchNotification(apiFormData).subscribe(response => {
          this.systemMsg = [{severity:'success', summary:'', detail:response.message}];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.systemMsg = [];
          }, 3000);
        });
        break;
      default:
        this.commonApi.getDispatchNotificationConfig(apiFormData).subscribe(response => {
          console.log(response)
          this.loading = false;
          if(response.status == 'Success'){
            this.configData = response.data.items;
          }
        });
        break;  
    }    
  }

  onToggleBoxChange(action, id, flag) {
    console.log(action, id, flag)
    let actionVal = (flag) ? 1 : 0;
    let actionItems:any = {id, actionVal}; 
    this.getDistpatchNotificationConfig('update', actionItems);    
  }

  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight-175;
    this.rmHeight = 115;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    this.rmHeight = this.rmHeight+headerHeight;
  }
}

