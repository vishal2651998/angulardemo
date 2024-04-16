import { Component, OnInit,  HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant, DefaultNewImages } from "src/app/common/constant/constant";
import { CommonService } from 'src/app/services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [MessageService]
})
export class IndexComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public headerData: Object;
  pageAccess: string = "user-settings";
  public headTitle: string = "User Settings";
  public bodyClass: string = "system-settings";
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
  public dispatchFlag: boolean = false;
  public emailFlag: boolean = false;
  public pushFlag: boolean = false;
  public makeFlag: boolean = false;
  public menuItemsData: any;
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public expandFlag: boolean = true;
  public rmHeight: any = 0;
  public ermHeight: any = 0;
  public showType = 6;
  public contentTypeText = "User settings not available";
  public contentTypeDefaultNewImg = DefaultNewImages.UserSettings;
  public toggleBox: boolean = false;
  public configData: any;
  public activeContentTypeId:string = '';
  public rtLoading: boolean = true;
  public systemMsg: Message[];
  public menuId: string = '4';
  public makeConfigData: any;
  public configLtData: any;
  public configRtData: any;

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private activteRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      /*this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: false
      };*/

      this.headerData = {
        access: this.pageAccess,
        'pageName': 'settings'
      };

      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.userSettingMenuItems();
    }
  }

  userSettingMenuItems() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    //apiFormData.append('roleId', this.roleId);
    apiFormData.append('apiVersion', '3');
    apiFormData.append('platform', '1');
    this.commonApi.getUserTypeContentTypeLists(apiFormData).subscribe(response => {
      console.log(response)
      if(response.status=='Success'){
        this.menuItemsData = [];
        let menuItemsArr = [];
        menuItemsArr = response.items;
        this.menuItemsData = menuItemsArr;
        this.itemEmpty = (menuItemsArr.length > 0) ? false : true;
        console.log(this.menuItemsData);
        setTimeout(() => {
          this.loading = false;
          for (let i in this.menuItemsData) {
            this.menuItemsData[i].activeFlag = false;
          }
          this.menuItemsData[0].activeFlag = true;
          this.activeContentTypeId = this.menuItemsData[0].contentTypeId;
          this.getNotificationConfigList(this.activeContentTypeId);
        }, 1000);
      }else{
        this.loading = false;
      }
    })
  }

  navSection(index){
    for (let i in this.menuItemsData) {
      this.menuItemsData[i].activeFlag = false;
    }
    this.menuItemsData[index].activeFlag = true;
    this.activeContentTypeId = this.menuItemsData[index].contentTypeId;
    this.getNotificationConfigList(this.activeContentTypeId);
  }

  // Get Dispatch Notification Config
  getNotificationConfigList(id) {
    if(id == '2'){
      this.getProductMakeList();
    }
    const apiFormData = new FormData();
    apiFormData.append('apikey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('contentTypeId',id);
    this.commonApi.getConfigNotificationLists(apiFormData).subscribe(response => {
      console.log(response) ;
      if(response.status == 'Success'){
        let itemsArr = [];
        itemsArr = response.data.items;
        for(let item in itemsArr){
         for(let inneritem in itemsArr[item].configItems){
          itemsArr[item].titleIcon = "title-"+itemsArr[item].actionClass+"-icon.png";
          if(itemsArr[item].configItems[inneritem].showPush == 1){
            itemsArr[item].configItems[inneritem].pushToggleBox = itemsArr[item].configItems[inneritem].pushFlag == '0' ? false : true;
          }
          if(itemsArr[item].configItems[inneritem].showEmail == 1){
            itemsArr[item].configItems[inneritem].emailToggleBox = itemsArr[item].configItems[inneritem].emailFlag == '0' ? false : true;
          }
         }
        }
        this.configData = itemsArr;
        setTimeout(() => {
          this.rtLoading = false;
        }, 1000);
      }
    });
  }

  /**
   * Filter Expand/Collapse
   */
  expandAction() {
    this.expandFlag = this.expandFlag ? false : true;
  }

  applySearch(data) {
    let val = data.searchVal;
    console.log(val);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    this.rmHeight = headerHeight + 125;
    this.innerHeight = headerHeight + 113;
  }

  onToggleBoxChange(action, id, pid, flag) {
    console.log(action, id, pid, flag)
    let flagValue = flag ? '1' : '0';
    const apiFormData = new FormData();
    apiFormData.append('apikey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('contentTypeId', this.activeContentTypeId);
    //apiFormData.append('parentId', pid);
    apiFormData.append('actionId', id);
   if(action == 'pushtoggle'){
      apiFormData.append('pushVal', flagValue);
      apiFormData.append('emailVal', '');
    }
    else if(action == 'emailtoggle'){
      apiFormData.append('pushVal', '');
      apiFormData.append('emailVal', flagValue);
    }
    else{
      apiFormData.append('value', flag);
    }

    this.commonApi.updateConfigNotification(apiFormData).subscribe(response => {
      if(response.status=='Success'){
        this.systemMsg = [{severity:'success', summary:'', detail:response.message}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.systemMsg = [];
        }, 3000);
      }
      else{}

    },
    (error => {}));

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
            this.makeConfigData = response.makeList;
            console.log(this.makeConfigData);
            this.configLtData = [];
            this.configRtData = [];
            let col1 = this.makeConfigData.length>0 ? this.makeConfigData.length/2 : 0;
            console.log(col1)
            col1 = Math.ceil(col1);
            let j = 0;
            for (let i in this.makeConfigData){
              if(j < col1){
                this.configLtData.push(this.makeConfigData[i]);
              }
              else {
                this.configRtData.push(this.makeConfigData[i]);
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

  onToggleMakeBoxChange(action, id, flag) {
    console.log(action, id, flag)
    let actionVal = (flag) ? 1 : 0;
    let actionItems:any = {id, actionVal};
    this.getProductMakeList('update', actionItems);
  }

  onRadioChange(id, pid, flag){
    console.log(id, pid, flag);
    for(let item in this.configData){
      if(this.configData[item].parentId == pid){
        for(let inneritem in this.configData[item].configItems){
          let actionItems:any = {};
          actionItems['pid'] = pid;
          actionItems['id'] = this.configData[item].configItems[inneritem].id;
          if(this.configData[item].configItems[inneritem].id == id){
            actionItems['actionVal'] = (flag) ? 1 : 0;
            actionItems['type'] = "1";
          }
          else{
            actionItems['actionVal'] = (flag) ? 0 : 1;
            actionItems['type'] = "0";
          }
          this.configData[item].configItems[inneritem].pushToggleBox = actionItems.actionVal == '0' ? false : true;
          this.onToggleBoxChange('radioBox',this.configData[item].configItems[inneritem].id,pid,actionItems.actionVal);
        }
      }
    }
  }


}

