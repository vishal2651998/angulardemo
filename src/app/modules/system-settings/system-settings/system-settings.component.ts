import { Component, OnInit,  HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant} from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
  providers: [MessageService]
})
export class SystemSettingsComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public headerData: Object;
  pageAccess: string = "system-settings";
  public headTitle: string = "System Settings";
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
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public menuItemsData: any;
  public expandFlag: boolean = true;
  public rmHeight: any = 115;
  public rolemappingFlag: boolean = false;
  public messageFlag: boolean = false;

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
      this.systemSettingMenus();

    }

  }
  /**
   * Filter Expand/Collapse
   */
  expandAction() {
    this.expandFlag = this.expandFlag ? false : true;
  }

 systemSettingMenus(){
  const apiFormData = new FormData();
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);

  this.commonApi.getSystemSettingsMenus(apiFormData).subscribe(res => {

    if(res.status=='Success'){
       console.log(res);
      this.menuItemsData = [];
      let menuItemsArr = [];

      menuItemsArr = res.items;

      for (let i in menuItemsArr) {
        switch (menuItemsArr[i].id) {
          case 1:
            menuItemsArr[i].menulinkname = 'messages';
            break;
          case 2:
            menuItemsArr[i].menulinkname = 'roles-mapping';
            break;
          case 4:
            menuItemsArr[i].menulinkname = 'allowed-domains';
            break;
          case 5:
            menuItemsArr[i].menulinkname = 'loginbg-domain';
            break;
          case 6:
            menuItemsArr[i].menulinkname = 'recent-thread-tab';
            break;
          case 7:
            menuItemsArr[i].menulinkname = 'welcome-message';
            break;
          case 9:
            menuItemsArr[i].menulinkname = 'message-popup';
            break;
          case 8:
            menuItemsArr[i].menulinkname = 'directory';
            break;          
        }
        this.menuItemsData.push(menuItemsArr[i]);
      }
      this.messageFlag = true;
    }
    this.loading = false;
  });
 }
  applySearch(data) {
    let val = data.searchVal;
    console.log(val);
  }

  // Set Screen Height
  setScreenHeight() {
    this.rmHeight = 120;
    this.innerHeight = 110;
  }
}

