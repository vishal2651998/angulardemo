import { Component, OnInit,  HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant, DefaultNewImages } from "src/app/common/constant/constant";
import { CommonService } from 'src/app/services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {Message,MessageService} from 'primeng/api';

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
  public activeMenuId;

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
      this.userSettingMenuItems();
    }
  }

  userSettingMenuItems() {
    const apiFormData = new FormData();
    apiFormData.append('apikey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('roleId', this.roleId);
    this.commonApi.apiGetUserSettingsMenu(apiFormData).subscribe(response => {
      console.log(response)
      if(response.status=='Success'){
        this.makeFlag = false;
        this.pushFlag = false;
        this.emailFlag = false;
        this.dispatchFlag = false;
        this.menuItemsData = [];
        let menuItemsArr = [];
        menuItemsArr = response.data.items;
        this.menuItemsData = menuItemsArr;
        this.itemEmpty = (menuItemsArr.length > 0) ? false : true;
        this.menuItemsData.forEach(mitem => {
          if(mitem.activeFlag) {
            this.activeMenuId = mitem.id;
            switch(mitem.id) {
              case 1:
                this.dispatchFlag = mitem.activeFlag;
                break;
              case 2:
                 this.emailFlag = mitem.activeFlag;
                break;
              case 3:
                this.pushFlag = mitem.activeFlag;
                break;
              case 4:
                this.makeFlag = mitem.activeFlag;
                break;
            }
          }
        });
     }
     this.loading = false;
    })
  }

  navSection(index,id){
    this.dispatchFlag = false;
    this.emailFlag = false;
    this.pushFlag = false;
    this.makeFlag = false;
    for (let i in this.menuItemsData) {
      this.menuItemsData[i].activeFlag = false;
    }
    this.menuItemsData[index].activeFlag = true;
    this.activeMenuId = id;
    switch (id) {
      case 1:
        this.dispatchFlag = true;
        break;
      case 2:
        this.emailFlag = true;
        break;
      case 3:
        this.pushFlag = true;
        break;
      case 4:
        this.makeFlag = true;
        break;
    }
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
}
