import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, HostListener } from "@angular/core";
import { Location, PlatformLocation } from "@angular/common";
import { Router } from "@angular/router";
import { CommonService } from "../../services/common/common.service";
import { LandingpageService } from "../../services/landingpage/landingpage.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { ApiService } from '../../services/api/api.service';
import { Constant, dispatchMenuItems, auditMenuItems, customerMenuItems, repairorderMenuItems, hqMenuItems, PushTypes, windowHeight, pageTitle, LocalStorageItem, RedirectionPage, assetPath, shopMenuItems } from '../../common/constant/constant';
declare var $: any;
declare var window: any;
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() accessModule;
  @Input() pageData;
  @Input() contentTypeId;
  @Output() sidebarComponentRef: EventEmitter<SidebarComponent> = new EventEmitter();
  @Output() menuNav: EventEmitter<any> = new EventEmitter();
  @Output() sidebarCallBack: EventEmitter<SidebarComponent> = new EventEmitter();

  public footerElem;
  public probContElem;
  public productContElem;

  public bodyHeight: number;
  public sidebarHeight: number;
  public platformId = localStorage.getItem('platformId');
  public dashSidebar: boolean;
  public escDashSidebar: boolean;
  public probingListSidebar: boolean;
  public landingListSidebar: boolean;
  public productListSidebar: boolean;
  public dispatchListSidebar: boolean;
  public repairorderListSidebar: boolean;
  public dekraSidebar: boolean;
  public assetsPath: string = "assets/images";
  public dashImgPath = `${this.assetsPath}/dashboard/`;
  public dispatchSidebarPath: string = `${this.assetsPath}/dispatch/svg/sidebar`;
  public repairorderSidebarPath: string = `${this.assetsPath}/dispatch/svg/sidebar`;
  public sidebarText = "sidebar";
  public sidebarActiveText = "sidebar-active";
  public summaryText: string = "Summary";
  public usageTypeText: string = "Usage";
  public escalationText: string = "Escalation";
  public threadText: string = "Threads";
  public gtsText: string = "GTS";
  public svcProText: string = "Probing";
  public eventMetricsText: string = "Events";
  public leaderBoardtext: string = 'Leaderboard';
  public techSupporttext: string = 'TechSupport Metrics';
  public manufactureText: string = 'Manufacture';
  public manufacturemenuicon: string = '';
  public userActivitytext: string = 'User Activity';
  public arrowClass: string;
  public arrowText: string;

  public expandFlag: boolean = false;
  public summaryFlag: boolean = false;
  public usageTypeFlag: boolean = false;
  public escalationFlag: boolean = false;
  public threadFlag: boolean = false;
  public gtsFlag: boolean = false;
  public svcProFlag: boolean = false;
  public eventFlag: boolean = false;
  public leaderboardFlag: boolean = false;
  public techsupoortmetricsFlag: boolean = false;
  public manufactureChartFlag: boolean = false;
  public userActivityFlag: boolean = false;
  public user: any;
  public domainId;
  public userId;
  public countryId;
  public roleId;
  public networkId;
  public apiData: Object;
  public menuListloadedRefer = [];
  public menuListloaded = [];
  public menuListloadedMore = [];
  public menuListLengthMoreSt: number = 0;
  public menuListLengthMoreEnd: number = 0;
  public homeText: string = "Home";
  public chatText: string = "Chat";
  public techIssueText: string = "Issues";
  public manualText: string = "Manuals";
  public documentText: string = "Document";
  public articleText: string = "Articles";
  public probingText: string = "Probings";
  public dashboardText: string = "Dashboard";

  public currUrl: string;
  public homeFlag: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public chatFlag: boolean = false;
  public techIssueFlag: boolean = false;
  public manualFlag: boolean = false;
  public documentFlag: boolean = false;
  public articleFlag: boolean = false;
  public probingFlag: boolean = false;
  public landingFlag: boolean = false;
  public dashboardFlag: boolean = false;
  public noload: boolean = false;
  public helpContent = [];
  public tooltipFlag: boolean = false;
  public helpContentName = "";
  public currentDisplayTNameFlag: boolean = false;
  public msTeamAccess: boolean = false;
  public sideMenu: boolean = true;
  public ttApiCall;
  public sideMenuMoreOption: Boolean = false;
  public moreiconArray = [];
  public siderbarHeight: number = 0;
  public dispatchMenu: any = [];
  public repairorderMenu: any = [];
  public dekraMenu: any = [];
  public industryType: any = "";
  public hqMenuItems: any = [];

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      this.setSideBarHeightRe();
    }, 100);
  }

  constructor(
    private location: Location,
    private router: Router,
    private getMenuListingApi: CommonService,
    private changeDetector: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private platformLocation: PlatformLocation,
    public apiUrl: ApiService,
  ) { }

  ngOnInit() {

    this.industryType = this.getMenuListingApi.getIndustryType();
    if (this.industryType.id != 1) {
      this.manufactureText = 'Manufacturer/Make';
      this.manufacturemenuicon = 'manufacturer-icon';
    }
    else {
      this.manufactureText = 'Make';
      this.manufacturemenuicon = 'make-icon';
    }

    console.log(this.accessModule);
    let rmVal = this.accessModule == "dashboard" ? 0 : 100;
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }

    this.sidebarHeight = window.innerHeight - rmVal;
    this.getMenuListingApi._OnMessageReceivedSubject.subscribe((r) => {
      //console.log(r)
      var setdata = JSON.parse(JSON.stringify(r));
      //alert(setdata);
      //  alert(1);

      this.noload = true;
      console.log(this.noload + "-----------In");
      //alert(1);
    });

    // welcome popup content check
    this.ttApiCall = this.getMenuListingApi.welcomeContentReceivedSubject.subscribe(
      (response) => {
        console.log(response);
        let welcomePopupDisplay = response["welcomePopupDisplay"];
        console.log(welcomePopupDisplay)
        if (welcomePopupDisplay == "1") {
          console.log(welcomePopupDisplay)
          this.menuListloaded[1]['helpContentFlagStatus'] = true;
          this.tooltipFlag = true;
          this.helpContentName = "chat";
          localStorage.setItem("helpContentName", this.helpContentName);
          let element: HTMLElement = document.getElementById(
            this.helpContentName
          ) as HTMLElement;
          if (element != null) { element.click(); }
          setTimeout(() => {
            this.ttApiCall.unsubscribe();
          }, 100);
        }
      }
    );

    //console.log(this.pageData, "--");
    this.arrowText = this.expandFlag ? "Collapse" : "Expand";
    this.arrowClass = this.expandFlag ? "collapse" : "expand";
    this.dashSidebar = false;
    this.escDashSidebar = false;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.roleId = this.user.roleId;
    this.networkId = this.user.networkId;
    //this.apiData = {};
    this.bodyHeight = screen.height;
    this.bodyHeight = window.innerHeight;
    //alert(this.bodyHeight);
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    };
    this.apiData = apiInfo;
    this.probingListSidebar = false;
    this.landingListSidebar = false;
    this.productListSidebar = false;
    this.dispatchListSidebar = false;
    this.repairorderListSidebar = false;
    this.dekraSidebar = false;
    let url = location.pathname;
    this.currUrl = url.substr(url.indexOf("/") + 1);
    //this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.probContElem = document.getElementsByClassName("probing-content")[0];
    //this.productContElem = document.getElementsByClassName('product-matrix-content')[0];

    //this.footerElem.classList.remove(this.sidebarText);
    //this.footerElem.classList.remove(this.sidebarActiveText);
    //console.log(this.accessModule + "------", this.pageData);

    hqMenuItems.forEach(item => {
      if(item.id == 8){
        if( this.roleId == 3 && this.networkId == 1){
          this.hqMenuItems.push(item);
        }
      }
      else{
        this.hqMenuItems.push(item);
      }
      
    });
    console.log(this.hqMenuItems);

    switch (this.accessModule) {
      case "dashboard":
        this.dashSidebar = true;
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case "escalation":
        this.escDashSidebar = true;
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case "web-probing":
      case "web-probing-list":
      case "mis/web-probing":
      case "landing-page":
      case "parts-list":
      case "directory-list":
      case "sib-list":
      case "cbt-v2/landing-page":
      case "landing-page":
      case "dashboard-v2":
      case "mis/web-probing-list":
        //alert(this.currUrl);
        this.probingListSidebar =
          this.currUrl == "probing-questions" || "mis/probing-questions"
            ? true
            : false;
        this.landingListSidebar =
          this.currUrl == "landing-page" || "cbt-v2/landing-page"
            ? true
            : false;
        if (this.accessModule == 'landing-page' && (this.currUrl == "workstreams-page" || "cbt-v2/workstreams-page")) {
          this.apiUrl.searchFromWorkstream = false;
          this.apiUrl.searchFromWorkstreamValue = '';
        }
        if (this.probingListSidebar || this.landingListSidebar) {
          let addFooterClass = this.expandFlag
            ? this.sidebarActiveText
            : this.sidebarText;
          //this.footerElem.classList.add(addFooterClass);
          // alert(this.probingListSidebar);
          if (!this.landingListSidebar) {
            this.probContElem.classList.add(addFooterClass);
          }
          setTimeout(() => {
            this.setSidebarHeight();
          }, 500);

          break;
        }

      case "product-matrix-list":
        this.productListSidebar =
          this.currUrl == "product-matrix" || "mis/product-matrix"
            ? true
            : false;
        if (this.productListSidebar) {
          let addFooterClass = this.expandFlag
            ? this.sidebarActiveText
            : this.sidebarText;
          //this.footerElem.classList.add(addFooterClass);
          this.probContElem.classList.add(addFooterClass);
          setTimeout(() => {
            this.setSidebarHeight();
          }, 500);
        }
        break;
      case 'dispatch':
      case 'audit':
      case 'customers':
        this.sidebarComponentRef.emit(this);
        this.dispatchListSidebar = true;
        this.dispatchMenu = (this.accessModule == 'audit') ? auditMenuItems : (this.accessModule == 'dispatch') ? dispatchMenuItems : customerMenuItems;
        console.log(this.dispatchMenu)
        if (this.accessModule == 'customers') {
          this.sidebarCallBack.emit(this);
        }
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case 'headquarters':
      case 'home':
      case 'tools':
      case 'dekra-audit':
      case 'all-users':
      case 'facility-layout':
      case 'shop-tools':
      case 'all-networks':
        

        this.sidebarComponentRef.emit(this);
        this.dekraSidebar = true;
        let hqmenuid;
        switch (this.accessModule) {
          case 'home':
            hqmenuid = '1';
            break;
          case 'headquarters':
            hqmenuid = '2';
            break;
          case 'tools':
            hqmenuid = '3';
            break;
          case 'shop-tools':
              hqmenuid = '3';
              break;
          case 'dekra-audit':
            hqmenuid = '4';
            break;
          case 'all-users':
            hqmenuid = '6';
            break;
          case 'facility-layout':
            hqmenuid = '7';
            break;
          case 'all-networks':
            hqmenuid = '8';
            break;
          default:
            hqmenuid = '1';
            break;
          
        }
        if (this.user?.data && this.user?.data?.shopId) {
          shopMenuItems.forEach(item => {
            item.activeClass = (hqmenuid == item.id) ? 1 : 0;
          });
          this.dekraMenu = shopMenuItems;
        } else {
          this.hqMenuItems.forEach(item => {
            item.activeClass = (hqmenuid == item.id) ? 1 : 0;
          });
          this.dekraMenu = this.hqMenuItems;
        }
        console.log(this.dekraMenu)
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case 'repairorder':
        this.sidebarComponentRef.emit(this);
        this.repairorderListSidebar = true;
        let romenuid;
        romenuid = 1;
        repairorderMenuItems.forEach(item => {
          item.activeClass = (romenuid == item.id) ? 1 : 0;
        });
        this.repairorderMenu = repairorderMenuItems;
        console.log(this.repairorderMenu)
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case 'jobs-ratecard':
        this.sidebarComponentRef.emit(this);
        this.repairorderListSidebar = true;
        let jobsmenuid = 4;
        repairorderMenuItems.forEach(item => {
          item.activeClass = (jobsmenuid == item.id) ? 1 : 0;
        });
        this.repairorderMenu = repairorderMenuItems;
        console.log(this.repairorderMenu)
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
    }
    //console.log(this.noload + "-----------fa");
    if (!this.dispatchListSidebar || !this.repairorderListSidebar || !this.dekraSidebar) {
      if (!this.noload) {
        this.getHeadMenuLists();
      }

      setTimeout(() => {
        this.setActiveRoute(this.currUrl);
      }, 500);
    }
  }

  // helpContentOrder
  updateHelpContentOrder(id, type) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);

    if (type == 'skip') {
      apiFormData.append('skipOption', '1');
    }
    else {
      apiFormData.append("tooltipId", id);
    }
    this.landingpageServiceApi
      .updateTooltipconfigWeb(apiFormData)
      .subscribe((response) => {
        if (response.status == "Success") {
          console.log(response.result);
        }
      });
  }

  // load tooltips
  skipTooltip(id, name) {
    this.updateHelpContentOrder(id, 'skip');
  }

  // load tooltips
  nextTooltip(id, name) {
    // update help content status
    for (let menu of this.menuListloaded) {
      if (menu.helpContentId == id) {
        menu.helpContentStatus = "1";
        menu.helpContentFlagStatus = false;
      }
      if (menu.helpContentIconName == name) {
        this.updateHelpContentOrder(menu.helpContentId, 'next');
        localStorage.setItem("helpContentName", name);
        if (name == "media") {
          localStorage.setItem("helpContentName", "workstreams");
          let data = {
            helpContentName: "workstreams",
          };
          this.getMenuListingApi.emitHelpContentView(data);
        }
      }
      if (menu.helpContentStatus == "0") {
        console.log(menu.helpContentIconName);
        let element: HTMLElement = document.getElementById(menu.helpContentIconName) as HTMLElement;
        if (element != null) { element.click(); return false; }
        else {
          localStorage.setItem("helpContentName", "workstreams");
          let data = {
            helpContentName: "workstreams",
          };
          this.getMenuListingApi.emitHelpContentView(data);
        }
      }
    }

  }

  getHeadMenuLists() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    apiFormData.append("limit", this.apiData["limit"]);
    apiFormData.append("offset", this.apiData["offset"]);
    if (this.contentTypeId) {
      apiFormData.append("contentTypeId", this.contentTypeId);
    }
    this.getMenuListingApi
      .getMenuLists(apiFormData, this.accessModule)
      .subscribe((response) => {
        if (response.status == "Success") {
          let menuListloaded = response.sideMenu;
          this.helpContentName = "";
          for (let menu of menuListloaded) {
            let urlpathreplace = menu.urlPath;

            let urlActivePathreplace = menu.urlActivePath;
            let submenuimageClass = menu.submenuimageClass;

            let toolTips = menu.toolTips;
            //console.log(toolTips);
            this.tooltipFlag =
              toolTips == undefined ||
                toolTips == "undefined" ||
                toolTips == "null" ||
                toolTips == null
                ? false
                : true;
            //console.log(this.tooltipFlag);
            let helpContentId = "";
            let helpContentTitle = "";
            let helpContentContent = "";
            let helpContentIconName = "";
            let helpContentStatus = "";
            let helpContentFlagStatus = false;
            if (this.tooltipFlag) {
              if (toolTips.length > 0) {
                this.helpContent = toolTips[0];
                helpContentId = this.helpContent["id"];
                helpContentTitle = this.helpContent["title"];
                helpContentContent = this.helpContent["content"];
                helpContentIconName = this.helpContent["itemClass"];
                helpContentStatus = this.helpContent["viewStatus"];
                helpContentFlagStatus =
                  this.helpContent["viewStatus"] == "0" ? true : false;
              }
            }

            let urlpth = "";
            let urlActivePath = "";
            if (
              this.accessModule == "dashboard" ||
              this.accessModule == "escalation"
            ) {
              urlpth = urlpathreplace;
              urlActivePath = urlActivePathreplace;
            } else {
              urlpth = urlpathreplace.replace(".png", ".svg");
              urlActivePath = urlActivePathreplace.replace(".png", ".svg");
            }
            if (menu.contentTypeId == 4) {
              localStorage.setItem('documentContentName', menu.name);
            }
            this.menuListloaded.push({
              id: menu.id,
              disableContentType: menu.disableContentType,
              slug: menu.slug,
              contentTypeId: menu.contentTypeId,
              name: menu.name,
              urlPath: urlpth,
              urlActivePath: urlActivePath,
              submenuimageClass: submenuimageClass,
              helpContentId: helpContentId,
              helpContentTitle: helpContentTitle,
              helpContentContent: helpContentContent,
              helpContentIconName: helpContentIconName,
              helpContentStatus: helpContentStatus,
              helpContentFlagStatus: helpContentFlagStatus,
            });

            if (this.tooltipFlag) {
              if (!this.currentDisplayTNameFlag) {
                if (helpContentStatus == "0") {
                  this.helpContentName = helpContentIconName;
                  localStorage.setItem("helpContentName", this.helpContentName);
                  this.currentDisplayTNameFlag = true;
                }
              }
            }
            //console.error("menu loaded us ", this.menuListloaded);
          }

          let urlVal = this.router.url;
          //console.log(urlVal);
          // welcome popup show
          if (urlVal == '/landing-page') {
            setTimeout(() => {
              if (this.tooltipFlag) {
                let welcomePopupDisplay = localStorage.getItem(
                  "welcomePopupDisplay"
                );
                //console.log("sdfds" + welcomePopupDisplay);
                if (welcomePopupDisplay == "1") {
                  if (this.helpContentName != "") {
                    let element: HTMLElement = document.getElementById(
                      this.helpContentName
                    ) as HTMLElement;
                    if (element != null) { element.click(); }
                    else {
                      if (this.helpContentName == "media") {
                        this.updateHelpContentOrder("3", 'next');
                        localStorage.setItem("helpContentName", "workstreams");
                        let data = {
                          helpContentName: "workstreams",
                        };
                        this.getMenuListingApi.emitHelpContentView(data);
                      }
                    }
                  } else {
                    if (!this.currentDisplayTNameFlag) {
                      localStorage.setItem("helpContentName", "workstreams");
                    }
                  }
                }
              }
            }, 1500);
          }

          localStorage.setItem(
            "sideMenuValues",
            JSON.stringify(this.menuListloaded)
          );
          //console.log(this.menuListloaded);

          let url = this.currUrl.replace("mis/", "");
          for (let menu of this.menuListloaded) {
            menu.activeClass = url == menu.urlPath ? 1 : 0;
          }

          let currMenu = this.pageData?.page;
          switch (currMenu) {
            case 'dashboard-v2':
            case 'landing-page':
            case 'threads':
            case 'documents':
            case 'parts':
            case 'gts':
            case 'media-manager':
            case 'knowledgearticles':
            case 'knowledge-base':
            case 'sib':
            case 'directory':
              this.menuListloaded.forEach((item) => {
                item.activeClass = (item.slug == currMenu) ? 1 : 0;
              });
              let checkArr = ['id', 'slug'];
              let unique = this.getMenuListingApi.unique(this.menuListloaded, checkArr);
              this.menuListloaded = unique;
              console.log(this.menuListloaded)
              break;
          }

          setTimeout(() => {
            this.siderbarHeight = document.getElementsByClassName("landingpage-nav-icons")[0] != undefined ? document.getElementsByClassName("landingpage-nav-icons")[0].clientHeight : 0;
            this.menuListloadedRefer = this.menuListloaded;
            this.setSideBarHeightRe();
          }, 100);

        }



      });
  }
  setSideBarHeightRe() {
    this.bodyHeight = window.innerHeight;
    let headerHeight = document.getElementById("header") != undefined ? document.getElementById("header").clientHeight : 0;
    let siderbarDyamicHeight = (this.bodyHeight - headerHeight);

    if (siderbarDyamicHeight >= this.siderbarHeight) {
      this.sideMenuMoreOption = false;
      this.menuListloadedMore = [];
      this.moreiconArray = [];
      this.menuListloaded = [];
      this.menuListloaded = this.menuListloadedRefer;
    }
    else {
      this.sideMenuMoreOption = true;
      let loadSidebarMenus = Math.round(siderbarDyamicHeight / 50);
      this.menuListLengthMoreSt = loadSidebarMenus - 2;

      let tempArray = [];
      tempArray = this.menuListloadedRefer;
      this.menuListloaded = [];
      this.menuListloadedMore = [];

      for (let ml in tempArray) {
        if (parseInt(ml) < this.menuListLengthMoreSt) {
          this.menuListloaded.push(tempArray[ml]);
        }
        else {
          tempArray[ml].morename = tempArray[ml].name.toLowerCase().replace(" ", "");
          this.menuListloadedMore.push(tempArray[ml]);
        }
      }

      this.moreiconArray = [];
      if (this.sideMenuMoreOption) {
        this.moreiconArray.push({
          id: '00',
          disableContentType: 'more',
          slug: 'more',
          contentTypeId: '00',
          name: 'more',
          urlPath: 'assets/images/landing-page/side-menu/more-normal.svg',
          urlActivePath: 'assets/images/landing-page/side-menu/more-selected.svg',
          submenuimageClass: 'more-icon',
          helpContentId: '',
          helpContentTitle: '',
          helpContentContent: '',
          helpContentIconName: '',
          helpContentStatus: '',
          helpContentFlagStatus: '',
        });
      }
    }
    this.sideMenu = true;
  }

  checkforaction(event: any) {
    // let urlpth = event.urlPath.replace(".png", ".svg");
    // let urlActivePath = event.urlActivePath.replace(".png", ".svg");
    //alert(urlActivePath);
    $(".menuListicon" + event.id + "").attr("src", "assets/images/landing-page/side-menu/" + event.urlActivePath + "");
  }

  checkforactionleave(event: any) {
    // if (event.id != 43) {
    // let urlpth = event.urlPath.replace(".png", ".svg");
    // let urlActivePath = event.urlActivePath.replace(".png", ".svg");
    //alert(urlActivePath);
    $(".menuListicon" + event.id + "").attr("src", "assets/images/landing-page/side-menu/" + event.urlPath + "");
    // }
  }

  // Expand or Collapse
  expandAction() {
    this.expandFlag = this.expandFlag ? false : true;
    if (this.probingListSidebar || this.landingListSidebar) {
      let addFooterClass = this.expandFlag
        ? this.sidebarActiveText
        : this.sidebarText;
      /* this.footerElem.classList.add(addFooterClass);
      if (!this.expandFlag) {
        this.footerElem.classList.remove(this.sidebarActiveText);
      } */
      let currUrl = location.pathname;
      currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
      switch (this.accessModule) {
        case "web-probing":
        case "landing-page":
        case "cbt-v2/landing-page":
        case "mis/web-probing":
          currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
          this.probingListSidebar =
            currUrl == "probing-questions" || "mis/probing-questions"
              ? true
              : false;
          this.landingListSidebar =
            currUrl == "landing-page" || "cbt-v2/landing-page" ? true : false;
          if (this.probingListSidebar || this.landingListSidebar) {
            this.probContElem.classList.add(addFooterClass);
            if (!this.expandFlag) {
              this.probContElem.classList.remove(this.sidebarActiveText);
            }
          }
          break;
        case "product-matrix-list":
          currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
          this.probingListSidebar =
            this.currUrl == "product-matrix" || "mis/product-matrix"
              ? true
              : false;
          if (this.probingListSidebar) {
            this.probContElem.classList.add(addFooterClass);
            if (!this.expandFlag) {
              this.probContElem.classList.remove(this.sidebarActiveText);
            }
          }
      }
    }
  }

  // Section Navigation
  sectionNav(type) {
    if (type.activeClass == 0) {
      type.slug == 'dispatch'
      switch (type.slug) {
        case 'shop-detail':
          if (this.user?.data && this.user?.data?.shopId) {
            shopMenuItems.forEach(item => {
              item.activeClass = (type.id == item.id) ? 1 : 0;
            });
            this.dekraMenu = shopMenuItems;
          } else {
            this.hqMenuItems.forEach(item => {
              item.activeClass = (type.id == item.id) ? 1 : 0;
            });
            this.dekraMenu = this.hqMenuItems;
          }
          this.menuNav.emit(type);
          this.router.navigate(['headquarters/all-shops/shop/' + this.user.data.shopId + '/summary']);
          break;
        case 'facility-layout':
          if (this.user?.data && this.user?.data?.shopId) {
            shopMenuItems.forEach(item => {
              item.activeClass = (type.id == item.id) ? 1 : 0;
            });
            this.dekraMenu = shopMenuItems;
          } else {
            this.hqMenuItems.forEach(item => {
              item.activeClass = (type.id == item.id) ? 1 : 0;
            });
            this.dekraMenu = this.hqMenuItems;
          }
          this.menuNav.emit(type);
          this.router.navigate(['headquarters/all-shops/shop/' + this.user.data.shopId + '/facility']);
          break;
        case 'shop-tools':
          if (this.user?.data && this.user?.data?.shopId) {
            shopMenuItems.forEach(item => {
              item.activeClass = (type.id == item.id) ? 1 : 0;
            });
            this.dekraMenu = shopMenuItems;
          } else {
            this.hqMenuItems.forEach(item => {
              item.activeClass = (type.id == item.id) ? 1 : 0;
            });
            this.dekraMenu = this.hqMenuItems;
          }
          this.menuNav.emit(type);
          this.router.navigate(['headquarters/all-shops/shop/' + this.user.data.shopId + '/tools-equipment']);
          break;
        case 'dispatch':
          switch (this.accessModule) {
            case 'dispatch':
              this.menuNav.emit(type);
              break;
          }
          break;
        case 'repairorder':
        case 'jobrate':
          switch (this.accessModule) {
            case 'repairorder':
            case 'jobs-ratecard':
              repairorderMenuItems.forEach(item => {
                item.activeClass = (type.id == item.id) ? 1 : 0;
              });
              this.repairorderMenu = repairorderMenuItems;
              console.log(this.repairorderMenu)
              this.menuNav.emit(type);
              break;
          }
          break;
        case 'home':
        case 'headquarters':
        case 'tools':
        case 'dekra-audit':
        case 'all-users':
        case 'all-networks':
          switch (this.accessModule) {
            case 'home':
            case 'headquarters':
            case 'tools':
            case 'dekra-audit':
            case 'all-users':
            case 'all-networks':
            case 'facility-layout':
              if (this.user?.data && this.user?.data?.shopId) {
                shopMenuItems.forEach(item => {
                  item.activeClass = (type.id == item.id) ? 1 : 0;
                });
                this.dekraMenu = shopMenuItems;
              } else {
                this.hqMenuItems.forEach(item => {
                  item.activeClass = (type.id == item.id) ? 1 : 0;
                });
                this.dekraMenu = this.hqMenuItems;
              }
              console.log(this.dekraMenu);
              this.menuNav.emit(type);
              break;
          }
          break;
        default:
          switch (this.accessModule) {
            case 'customers':
              customerMenuItems.forEach(item => {
                item.activeClass = (type.id == item.id) ? 1 : 0;
              });
              this.menuNav.emit(type);
              this.sidebarCallBack.emit(this);
              break;
          }
          break;
      }
    }
  }

  // Page Navigation
  navigatePageUrl(type) {
    /*if(this.apiUrl.enableAccessLevel){
      console.log(type);
      let page = type.contentTypeId;
      this.authenticationService.checkAccess(page,'View',true,true);
        setTimeout(() => {
          console.log(this.authenticationService.checkAccessVal)
          if(this.authenticationService.checkAccessVal){
            this.navigatePageUrlAgain(type);
          }
          else if(!this.authenticationService.checkAccessVal){
            // no access
          }
          else{
            this.navigatePageUrlAgain(type);
          }
        }, 550);
    }
    else{
     this.navigatePageUrlAgain(type);
    }*/
    this.navigatePageUrlAgain(type);
  }
  navigatePageUrlAgain(type) {
    localStorage.removeItem('landing-page-workstream');
    console.log(type)
    let aurl = "";
    let platformId: any = parseInt(localStorage.getItem("platformId"));
    let sameTabFlag = false;
    let reloadFlag = false;
    let navUrl: any = type.slug;
    let title = localStorage.getItem('platformName');
    if (!type.disableContentType) {
      if (navUrl == RedirectionPage.StandardReports) {
        localStorage.removeItem('report-ws');
      }
      sameTabFlag = false;
      let nav: any = 1;
      let contentTypeId = type.contentTypeId;
      let contentTypeName = type.name;
      let page = type.slug;
      if (contentTypeId >= 0) {
        let routeLoadText;
        let routeLoadIndex = pageTitle.findIndex(option => option.slug == page);
        if (routeLoadIndex >= 0) {
          routeLoadText = pageTitle[routeLoadIndex].routerText;
        }
        if (contentTypeId > 1) {
          localStorage.setItem("landingNav", nav);
        }
        switch (page) {
          case 'landing-page':
            sameTabFlag = true;
            let menuId = `accord-menu-1`;
            let menuClass = document.getElementsByClassName(menuId);
            setTimeout(() => {
              console.log(menuClass)
              menuClass[0].classList.add('active')
            }, 50);
            break;
          case 'dashboard':
          case 'chat-page':
            localStorage.removeItem('landing-page-workstream');
            localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
            localStorage.removeItem(LocalStorageItem.reloadChatType);
            sameTabFlag = false;
            break;
          case 'threads':
            let threadFilter = localStorage.getItem('threadFilter');
            let threadVal = localStorage.getItem('yourThreadsValue');
            let filterActiveCount = 0;
            let filterOptions = [];
            if (threadFilter && threadFilter != 'null') {
              filterActiveCount = this.getMenuListingApi.setupFilterActiveData(filterOptions, JSON.parse(threadFilter), filterActiveCount);
            }
            reloadFlag = (threadVal || (filterActiveCount > 0 && threadFilter)) ? true : false;
            localStorage.removeItem("threadOrderFilter");
            localStorage.removeItem("threadSortFilter");
            localStorage.removeItem('yourThreadsValue');
            localStorage.removeItem('yourStoreThreadsValue');
            break;
          case 'documents':
            localStorage.removeItem("documentApprovalPage");
            let docNav = localStorage.getItem('wsDocNav');
            if (docNav) {
              localStorage.removeItem('wsDocNav');
              localStorage.setItem(routeLoadText, 'true');
            }
            break;
        }
        console.log(platformId)

        if (platformId == 2) {
          if (contentTypeId == 7) {
            //navUrl = "/mis/home/" + this.domainId + "/" + this.userId + "/2";
            aurl = "knowledgearticles";
          }
          if (contentTypeId == 8) {
            aurl = "knowledgearticles";
            //   window.open(aurl, '_blank');
          }
          if (contentTypeId == 26) {
            aurl = "http://training.mahleforum.com";
            // window.open(aurl, '_blank');
          }
          // alert(contentTypeId);
          if (contentTypeId == 27) {
            aurl = "kaizen";
            localStorage.setItem("landingNav", nav);
            // window.open(aurl, '_blank');
          }

        } else {

          if (contentTypeId == 26) {
            aurl = "http://training.collabtic.com";
            // window.open(aurl, '_blank');
          }
          if (contentTypeId == 7) {
            aurl = "knowledgearticles";
            localStorage.setItem("landingNav", nav);
            // window.open(aurl, '_blank');
          }
        }
        if (contentTypeId == 23) {
          if (platformId == 2) {
            navUrl = "/mis/home/" + this.domainId + "/" + this.userId + "/1";
          } else {
            aurl = "mis/dashboard";
          }
          //  window.open(aurl, '_blank');
        }
      }

      if (!sameTabFlag) {
        navUrl = (navUrl == '') ? aurl : navUrl;
        setTimeout(() => {

          if (navUrl == 'chat-page') {
            if (!window.chatPage || window.chatPage.closed) {
              window.chatPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.chatPage.focus();
            }

          }
          else if (navUrl == 'threads') {
            if (reloadFlag || !window.threadsPage || window.threadsPage.closed) {
              window.threadsPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.threadsPage.focus();
            }

          }
          else if (navUrl == 'documents') {
            localStorage.removeItem("documentApprovalPage");
            if (!window.documentsPage || window.documentsPage.closed) {
              window.documentsPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.documentsPage.focus();
            }

          }
          else if (navUrl == 'parts') {
            if (!window.partsPage || window.partsPage.closed) {
              window.partsPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.partsPage.focus();
            }

          }
          else if (navUrl == 'kaizen') {
            localStorage.removeItem('kaizenNonApproved');
            if (!window.kaizenPage || window.kaizenPage.closed) {
              window.kaizenPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.kaizenPage.focus();
            }

          }
          else if (navUrl == 'directory') {
            if (!window.directoryPage || window.directoryPage.closed) {
              window.directoryPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.directoryPage.focus();
            }

          }
          else if (navUrl == 'gts') {
            if (!window.gtsPage || window.gtsPage.closed) {
              window.gtsPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.gtsPage.focus();
            }

          }
          else if (navUrl == 'knowledgearticles') {
            if (!window.knowledgearticlesPage || window.knowledgearticlesPage.closed) {
              window.knowledgearticlesPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.knowledgearticlesPage.focus();
            }

          }
          else if (navUrl == 'media-manager') {
            if (!window.mediamanagerPage || window.mediamanagerPage.closed) {
              window.mediamanagerPage = window.open(navUrl, '_blank' + navUrl);

            }
            else {
              window.mediamanagerPage.focus();
            }

          }
          else {
            window.open(navUrl, "_blank" + navUrl).focus();
          }

        }, 10);
        // newWindow.focus();
      } else {
        navUrl = (navUrl == '') ? aurl : navUrl;
        let sindex = PushTypes.findIndex(option => option.url == navUrl);
        let silentCountTxt, silentLoadCount: any = 0, pageInfo = '';
        let titleIndex = pageTitle.findIndex(option => option.slug == page);
        title = `${title} - ${pageTitle[titleIndex].name}`;
        document.title = title;

        if (sindex >= 0) {
          pageInfo = PushTypes[sindex].pageInfo;
          silentCountTxt = PushTypes[sindex].silentCount;
          silentLoadCount = localStorage.getItem(silentCountTxt);
          silentLoadCount = localStorage.getItem(silentCountTxt);
          silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
          setTimeout(() => {
            localStorage.removeItem(silentCountTxt);
          }, 500);
        }
        let routeLoadIndex = pageTitle.findIndex(option => option.slug == page);
        let chkRouteLoad;
        if (routeLoadIndex >= 0) {
          let routeText = pageTitle[routeLoadIndex].routerText;
          chkRouteLoad = localStorage.getItem(routeText);
        }
        let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad;
        console.log(routeLoad, sindex, silentLoadCount)
        if (!routeLoad && sindex >= 0 && silentLoadCount > 0) {
          let data = {
            access: navUrl,
            action: 'silentLoad',
            pushAction: 'load',
            pageInfo: pageInfo,
            silentLoadCount: silentLoadCount
          }
          this.getMenuListingApi.emitMessageReceived(data);
        } else {
          let data = {
            action: 'side-menu',
            access: 'side-menu',
            page: page
          }
          this.getMenuListingApi.emitMessageLayoutrefresh(data);
        }
        this.router.navigateByUrl(navUrl);
      }
    }
  }
  navigatePage(url) {
    this.setActiveRoute(url);
    this.router.navigate([url]);
    if (this.dashSidebar) {
      let navPage = "true";
      localStorage.setItem("navPage", navPage);
      let currUrl = location.pathname;
      currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
      console.log(currUrl);
      if (currUrl == "dashboard" || currUrl == "mis/dashboardnew") {
        localStorage.setItem("accessFrom", "dashboard");
        localStorage.setItem("navFrom", "summary");
      }
    }
  }

  setActiveRoute(url) {
    if (this.dashSidebar) {
      this.summaryFlag = false;
      this.usageTypeFlag = false;
      this.escalationFlag = false;
      this.threadFlag = false;
      this.gtsFlag = false;
      this.svcProFlag = false;
      this.eventFlag = false;
      this.leaderboardFlag = false;
      this.techsupoortmetricsFlag = false;
      this.manufactureChartFlag = false;
      this.userActivityFlag = false;

      switch (url) {
        case "dashboard/v1":
        case "mis/dashboard":
          this.summaryFlag = true;
          break;
        case "mis/dashboard/dealer-usage":
          this.usageTypeFlag = true;
          break;
        case "mis/dashboard/threads":
          this.threadFlag = true;
          break;
        case "mis/dashboard/leaderboard":
          this.leaderboardFlag = true;
          break;
        case "mis/dashboard/techsupport-metrics":
          this.techsupoortmetricsFlag = true;
          break;
        case "mis/dashboard/manufacture-chart":
          this.manufactureChartFlag = true;
          break;
        case "mis/dashboard/user-activity":
          this.userActivityFlag = true;
          break;
        case "mis/dashboard/escalations":
        case "mis/dashboard/escalation/models":
        case "mis/dashboard/escalation/region":
        case "mis/dashboard/escalation/monthly":
        case "mis/dashboard/escalation/active":
          this.escalationFlag = true;
          break;
        case "mis/dashboard/gts":
          this.gtsFlag = true;
          break;
        case "mis/dashboard/service-probing":
          this.svcProFlag = true;
          break;
        default:
          this.eventFlag = true;
          break;
      }
    }

    if (this.probingListSidebar) {
      this.homeFlag = false;
      this.chatFlag = false;
      this.techIssueFlag = false;
      this.manualFlag = false;
      this.documentFlag = false;
      this.articleFlag = false;
      this.probingFlag = false;
      this.landingFlag = false;
      this.dashboardFlag = false;
      switch (url) {
        case "probing-questions":
          this.probingFlag = true;
          break;
      }
    }
    if (this.landingListSidebar) {
      this.homeFlag = false;
      this.chatFlag = false;
      this.techIssueFlag = false;
      this.manualFlag = false;
      this.documentFlag = false;
      this.articleFlag = false;
      this.probingFlag = false;
      this.landingFlag = false;
      this.dashboardFlag = false;
      switch (url) {
        case "landing-page":
        case "cbt-v2/landing-page":
          this.landingFlag = true;
          break;
      }
    }
  }

  // ngAfterViewInit()
  // {
  //   this.setSidebarHeight();
  // }
  // Set Sidebar Height
  setSidebarHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      let innetHeight = 0;
      innetHeight = windowHeight.heightMsTeam + 80;
      this.sidebarHeight = innetHeight;
    } else {
      let headerHeight =
        document.getElementsByClassName("prob-header")[0].clientHeight;
      let innetHeight = 0;
      if (!this.landingListSidebar) {
        if (document.getElementsByClassName("probing-content")[0])
          innetHeight =
            document.getElementsByClassName("probing-content")[0].clientHeight;
      } else {
        innetHeight = this.bodyHeight;
      }

      switch (this.accessModule) {
        case "dashboard":
        case "escalation":
          this.sidebarHeight = window.innerHeight;
          break;
        default:
          this.sidebarHeight = innetHeight + headerHeight;
          break;
      }
      //this.sidebarHeight = innetHeight;
      //alert(this.sidebarHeight);
    }
  }

  sideMenuAction() {
    let currMenu = this.pageData.page;
    console.log(currMenu)
    switch (currMenu) {
      case 'landing-page':
      case 'threads':
        this.menuListloaded.forEach((item) => {
          item.activeClass = (item.slug == currMenu) ? 1 : 0;
        });
        let checkArr = ['id', 'slug'];
        let unique = this.getMenuListingApi.unique(this.menuListloaded, checkArr);
        this.menuListloaded = unique;
        console.log(this.menuListloaded)
        break;
    }
  }
}
