import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../../services/common/common.service";
import { AuthenticationService } from "../../../../../services/authentication/authentication.service";
import { LandingpageService } from "../../../../../services/landingpage/landingpage.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild("ttparts") tooltip: NgbTooltip;
  subscription: Subscription = new Subscription();

  public title: string = "SIB";
  public bodyClass: string = "sib-list";
  public bodyClass1: string = "parts-list";
  public pageCreateNew: string = DefaultNewCreationText.SIB;
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public headerFlag: boolean = false;
  public headerData: Object;

  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = true;
  public groupId: number = 35;
  public filterInterval: any;
  public countryId;

  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;

  public createAccess: boolean = true;
  public resize: boolean = false;
  public loading: boolean = true;
  public filterLoading: boolean = true;

  public sibUrl: string = "sib/manage/";
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public searchVal: string = "";
  public pageAccess: string = "sib";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = true;

  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;

  public section: number = 1;
  public sibType: string = "";
  public pinFlag: boolean = false;
  public pinClass: string = "normal";
  public sibList: any = [];
  public sibSelectionList: any = [];
  public itemOffset: number = 0;
  public itemTotal: number = 0;
  public msTeamAccess: boolean = false;
  public thelpContentId = "";
  public thelpContentTitle = "";
  public thelpContentContent = "";
  public thelpContentIconName = "";
  public thelpContentStatus = "";
  public thelpContentFlagStatus: boolean = false;
  public resetFilterFlag: boolean = false;
  public sibFlag: boolean = false;
  public filterrecords: boolean = false;

  public sibData = {
    accessFrom: this.pageAccess,
    action: "get",
    countryId: "",
    domainId: 0,
    expandFlag: this.rightPanel,
    filterOptions: [],
    thumbView: this.thumbView,
    searchVal: this.searchVal,
    userId: 0,
    sibType: this.sibType,
    headerFlag: this.headerFlag,
    filterrecords: this.filterrecords,
  };

  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
  };

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    localStorage.removeItem("searchValue");
    let teamSystem = localStorage.getItem("teamSystem");
    this.msTeamAccess =  (teamSystem) ? true : false;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag =
    (this.domainId == "undefined" || this.domainId == undefined) &&
    (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      //let listView = localStorage.getItem("sibListView");
      let partPinFlag: any = localStorage.getItem("sibPinFlag");
      //this.thumbView = listView == "undefined" || listView == undefined || listView == "list" ? false : true;
      this.sibType = this.pinFlag ? "pined" : "";
      this.pinClass = this.pinFlag ? "active" : "normal";

      this.sibData["thumbView"] = this.thumbView;
      this.sibData["domainId"] = this.domainId;
      this.sibData["countryId"] = this.countryId;
      this.sibData["userId"] = this.userId;
      this.sibData["sibType"] = this.sibType;

      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };

      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
        searchVal: "",
      };
      let apiInfo = {
        apiKey: this.apiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        isActive: 1,
        searchKey: this.searchVal,
      };

      this.filterOptions["apiKey"] = this.apiKey;
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;

      this.apiData = apiInfo;
      this.bodyHeight = window.innerHeight;
      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }

      setTimeout(() => {
        let data = {
          action: "load",
        };
        this.commonApi.emitSibListData(data);
      }, 150);

      setTimeout(() => {
        this.setScreenHeight();
        let apiData = this.apiData;
        apiData["groupId"] = this.groupId;

        // Get Filter Widgets
        this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);

        this.filterInterval = setInterval(() => {
          let filterWidget = localStorage.getItem("filterWidget");
          let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
          if (filterWidget) {
            console.log(filterWidgetData);
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.sibData["filterrecords"] = this.filterCheck();
            this.sibData["filterOptions"] = this.apiData["filterOptions"];
            console.log(this.sibData);
            // Get Part List
            this.commonApi.emitSibListData(this.sibData);
            setTimeout(() => {
              this.filterLoading = false;
              this.loading =  false;
              this.filterOptions["filterLoading"] = this.filterLoading;
              console.log(this.apiData);
            }, 500);
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");
          }
        }, 50);
        if (this.msTeamAccess) {
          this.helpContent(0);
        }
      }, 1500);
    } else {
      this.router.navigate(["/forbidden"]);
    }

    // help content
    this.commonApi.welcomeContentReceivedSubject.subscribe((response) => {
      let welcomePopupDisplay = response["welcomePopupDisplay"];
      if (welcomePopupDisplay == "1") {
        if (this.msTeamAccess) {
          setTimeout(() => {
            this.helpContent(0);
          }, 900);
        }
      }
    });

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        this.rightPanel = JSON.parse(flag);
      })
    );

    this.subscription.add(
      this.commonApi.partLayoutDataReceivedSubject.subscribe((data) => {
        //console.log(data)
        this.loading = data["loading"];
        this.headerCheck = data["headerCheck"];
        this.headercheckDisplay = data["headercheckDisplay"];
        this.displayNoRecords = data["displayNoRecords"];
        this.itemEmpty = data["itemEmpty"];
        this.itemTotal = data["itemTotal"];
        this.itemOffset = data["itemOffset"];
        this.sibList = data["sibList"];
        this.sibSelectionList = data["sibSelectionList"];
      })
    );
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.sibData.action = "toggle";
    this.sibData.filterrecords = this.filterCheck();
    this.commonApi.emitSibListData(this.sibData);
  }

  // Apply Filter
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      this.sibData["filterOptions"] = filterData;

      this.filterActiveCount = this.commonApi.setupFilterActiveData(
        this.filterOptions,
        filterData,
        this.filterActiveCount
      );
      this.filterOptions["filterActive"] =
        this.filterActiveCount > 0 ? true : false;
        this.filterrecords = this.filterCheck();
      this.applySearch("filter", this.searchVal);

      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    } else {
      localStorage.removeItem("sibFilter");
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.filterrecords = this.filterCheck();
    this.currYear = moment().format("Y");
    this.applySearch("reset", this.searchVal);
    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
  }

  // Change the view
  viewType(actionFlag) {
    if (!this.itemEmpty) {
      this.thumbView = actionFlag ? false : true;
      let viewType = this.thumbView ? "thumb" : "list";
      localStorage.setItem("sibListView", viewType);
      setTimeout(() => {
        this.sibData.thumbView = this.thumbView;
        this.sibData.action = "view";
        this.sibData.filterrecords = this.filterCheck();
        this.commonApi.emitSibListData(this.sibData);
      }, 50);
    }
  }

  // Pin or Unpin
  pinnedSibList(flag) {
    this.pinFlag = flag;
    this.sibType = flag ? "pined" : "";
    this.pinClass = flag ? "active" : "normal";
    localStorage.setItem("partPinFlag", flag);
    this.sibData["sibType"] = this.sibType;
    this.sibData["action"] = "status";
    this.sibData["filterrecords"] = this.filterCheck();
    this.sibListCallBack("pin", this.section);
  }

  // SIB List Call Back
  sibListCallBack(type, action) {
    this.headerFlag = type == "pin" ? this.headerFlag : false;
    this.section = action;
    let searchVal = "";
    this.applySearch(action, searchVal);
  }

  // Apply Search
  applySearch(action, val) {
    let callBack = false;
    this.searchVal = val;
    this.headercheckDisplay = "checkbox-hide";
    this.headerCheck = "unchecked";
    this.sibData["headerCheck"] = this.headerCheck;
    this.sibData["headercheckDisplay"] = this.headercheckDisplay;
    this.sibData["searchVal"] = this.searchVal;
    this.sibData["action"] = "filter";
    switch (action) {
      case "reset":
        this.resetFilterFlag = true;
        this.ngOnInit();
        break;
      default:
        if (action == "emit") {
          this.headerData["searchVal"] = this.searchVal;
          this.headerFlag = true;
        }
        this.sibData["filterrecords"] = this.filterCheck();
        this.commonApi.emitSibListData(this.sibData);
        setTimeout(() => {
          if (action == "init") {
            this.headerFlag = true;
          }
        }, 500);
        break;
    }

    if (callBack) {
      this.sibData["filterrecords"] = this.filterCheck();
      this.commonApi.emitSibListData(this.sibData);
    }
  }

   // if any one filter is ON
   filterCheck(){
    this.filterrecords = false;
    if(this.pinFlag){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
      this.filterHeight = window.innerHeight;
      this.filterOptions["filterHeight"] = this.innerHeight;
    } else {
      let headerHeight =
        document.getElementsByClassName("prob-header")[0].clientHeight;
      let titleHeight =
        document.getElementsByClassName("part-list-head")[0].clientHeight;
      let footerHeight =
        document.getElementsByClassName("footer-content")[0].clientHeight;
      this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 30);
      this.innerHeight = this.innerHeight - titleHeight;

      this.filterHeight = window.innerHeight;
      this.filterOptions["filterHeight"] = this.innerHeight;
    }
  }

  // Nav Part Edit or View
  navPage(action, id) {
    let url;
    url = this.sibUrl;
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      window.open(url, IsOpenNewTab.teamOpenNewTab);
    } else {
      window.open(url, IsOpenNewTab.openNewTab);
    }
  }

  // helpContent list and view
  helpContent(id) {
    id = id > 0 ? id : "";
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("tooltipId", id);

    this.landingpageServiceApi
      .updateTooltipconfigWeb(apiFormData)
      .subscribe((response) => {
        if (response.status == "Success") {
          if (id == "") {
            let contentData = response.tooltips;
            for (let cd in contentData) {
              let welcomePopupDisplay = localStorage.getItem(
                "welcomePopupDisplay"
              );
              if (welcomePopupDisplay == "1") {
                if (
                  contentData[cd].id == "4" &&
                  contentData[cd].viewStatus == "0"
                ) {
                  console.log(contentData[cd].title);
                  this.thelpContentStatus = contentData[cd].viewStatus;
                  this.thelpContentFlagStatus = true;
                  this.thelpContentId = contentData[cd].id;
                  this.thelpContentTitle = contentData[cd].title;
                  this.thelpContentContent = contentData[cd].content;
                  this.thelpContentIconName = contentData[cd].itemClass;
                }
              }
            }
            if (this.thelpContentFlagStatus) {
              this.tooltip.open();
            }
          } else {
            console.log(response.result);
            this.tooltip.close();
          }
        }
      });
  }

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    //this.setScreenHeight();
    this.filterOptions["filterExpand"] = this.expandFlag;
    this.filterLoading = false;
    setTimeout(() => {
      this.filterLoading = true;
      this.sibListCallBack("section", this.section);
    }, 50);
  }

}
