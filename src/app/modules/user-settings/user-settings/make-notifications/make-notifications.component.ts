import { Component, OnInit, HostListener, Input} from "@angular/core";
import { Constant, ContentTypeValues } from "src/app/common/constant/constant";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';

@Component({
  selector: 'app-make-notifications',
  templateUrl: './make-notifications.component.html',
  styleUrls: ['./make-notifications.component.scss']
})
export class MakeNotificationsComponent implements OnInit {
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
    this.getProductMakeList();
  }

  // Get Dispatch Notification Config
  getProductMakeList(action = '', actionItems:any = '') {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('menuId', this.menuId);
    switch(action) {
      case 'update':
        apiFormData.append('make_name', actionItems.id);
        apiFormData.append('value', actionItems.actionVal);
        this.commonApi.UpdateMakeSettingsFilterV2(apiFormData).subscribe(response => {
          let successMsg = response.result;
          this.systemMsg = [{severity:'success', summary:'', detail:successMsg}];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.systemMsg = [];
          }, 3000);
        });
        break;
      default:
        this.commonApi.getSettingsMakeFilterConfig(apiFormData).subscribe(response => {
          console.log(response)
          this.loading = false;
          if(response.status == 'Success'){
            this.configData = response.makeList;
            console.log(this.configData);
            this.configLtData = [];
            this.configRtData = [];
            let col1 = this.configData.length>0 ? this.configData.length/2 : 0;
            console.log(col1)
            col1 = Math.ceil(col1);
            let j = 0;
            for (let i in this.configData){
              if(j < col1){
                this.configLtData.push(this.configData[i]);
              }
              else {
                this.configRtData.push(this.configData[i]);
              }
              j++;
            }
            console.log(this.configLtData)
            console.log(this.configRtData)
          }
        });
        break;
    }
  }

  onToggleBoxChange(action, id, flag) {
    console.log(action, id, flag)
    let actionVal = (flag) ? 1 : 0;
    let actionItems:any = {id, actionVal};
    this.getProductMakeList('update', actionItems);
  }

  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight-155;
    //this.rmHeight = 115;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    //this.rmHeight = this.rmHeight+headerHeight;
    this.innerHeight = (this.bodyHeight + headerHeight)-110;
  }
}



