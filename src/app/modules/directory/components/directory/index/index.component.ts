import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../../services/common/common.service";
import { Constant, IsOpenNewTab, pageInfo, windowHeight, DefaultNewCreationText, RedirectionPage } from "src/app/common/constant/constant";
import { AuthenticationService } from "../../../../../services/authentication/authentication.service";
import { FilterService } from "../../../../../services/filter/filter.service";
import { PartsService } from "../../../../../services/parts/parts.service";
import { LandingpageService } from "../../../../../services/landingpage/landingpage.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Subscription } from "rxjs";
interface sortOption {
  name: string;
  code: string;
}
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
  subscription: Subscription = new Subscription();
  public selectedStatus: any;
  public partPublishStatus: sortOption[];
  public partPublishOptions = [];
  public title: string = "Directory";
  public bodyClass: string = "landing-page";
  public bodyClass1: string = "directory";
  public pageCreateNew: string = DefaultNewCreationText.Parts;
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;
  public pageData = pageInfo.directoryPage;
  public directoryInfoData : Object;
  public headerFlag: boolean = false;
  public headerData: Object;

  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = false;
  public groupId: number = 37;
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

  public partsUrl: string = "parts/manage/";
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public searchVal: string = "";
  public pageAccess: string = "directory";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = false;
  public rightPanelEnable: boolean = false;

  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;

  public section: number = 1;
  public partType: string = "";
  public publishStatus: string = "";
  public publishDefaultStatus: string = '';
  public partsStatusInfo: any = [];
  public pinFlag: boolean = false;
  public pinClass: string = "normal";
  public partsList: any = [];
  public partsSelectionList: any = [];
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
  public partFlag: boolean = false;
  public filterrecords: boolean = false;

  public docDetail: any;
  public partData = {
    accessFrom: this.pageAccess,
    action: "get",
    countryId: "",
    domainId: 0,
    expandFlag: this.rightPanel,
    filterOptions: [],
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    section: this.section,
    thumbView: this.thumbView,
    searchVal: this.searchVal,
    userId: 0,
    partType: this.partType,
    partStatus: this.publishStatus,
    headerFlag: this.headerFlag,
    filterrecords: this.filterrecords,
    actionRightPanel: "0",
    rightPanel : this.rightPanel
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
    threadType: "",
  };

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    let url:any = this.router.url;
    let currUrl = url.split('/');
    if(currUrl[1] == RedirectionPage.Parts && currUrl.length < 2) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.filterOptions["filterExpand"] = this.expandFlag;
      this.filterLoading = false;
      setTimeout(() => {
        this.filterLoading = true;
        this.partListCallBack("section", this.section);
      }, 50);
    }
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private partsApi: PartsService,
    private filterApi: FilterService,
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
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      //let listView = localStorage.getItem("partListView");
      let partPinFlag: any = localStorage.getItem("partPinFlag");
      //this.thumbView = listView == "undefined" || listView == undefined || listView == "list" ? false : true;
      this.thumbView = true;
      this.pinFlag =
        partPinFlag == "undefined" || partPinFlag == undefined
          ? false
          : partPinFlag == "false"
          ? false
          : true;
      this.partType = this.pinFlag ? "pined" : "";
      this.pinClass = this.pinFlag ? "active" : "normal";

      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };

      this.partData["thumbView"] = this.thumbView;
      this.partData["domainId"] = this.domainId;
      this.partData["countryId"] = this.countryId;
      this.partData["userId"] = this.userId;
      this.partData["partType"] = this.partType;

      if (!this.resetFilterFlag) {
        let partsStatusInfo = JSON.parse(
          localStorage.getItem("partsStatusInfo")
        );
        console.log(this.partPublishOptions);
        let getPartStatus:any = localStorage.getItem('partNavStatus');
        for (let ps in partsStatusInfo) {
          let flag = (partsStatusInfo[ps].isDefault == 1)
          if (partsStatusInfo[ps].isDefault == 1 ) {
            this.publishStatus = partsStatusInfo[ps].id;
            this.publishDefaultStatus = this.publishStatus;
            this.selectedStatus = {
              code: partsStatusInfo[ps].id,
              name: partsStatusInfo[ps].name,
            };
          }
          this.partPublishOptions.push({
            code: partsStatusInfo[ps].id,
            name: partsStatusInfo[ps].name,
          });
          console.log(this.publishStatus);
          console.log(this.selectedStatus);
          console.log(this.partPublishOptions);
        }

        //alert(getPartStatus)
        this.publishStatus = (getPartStatus != null && (getPartStatus != 'undefined' || getPartStatus != undefined)) ? getPartStatus : this.publishStatus;
        let statusIndex = this.partPublishOptions.findIndex(option => option.code == this.publishStatus);
        this.selectedStatus = {
          code: partsStatusInfo[statusIndex].id,
          name: partsStatusInfo[statusIndex].name,
        };
        //alert(this.publishStatus)
        setTimeout(() => {
          localStorage.removeItem('partNavStatus');
        }, 100);
        this.partData["publishStatus"] = this.publishStatus;
        this.partPublishStatus = this.partPublishOptions;
        console.log(this.partPublishStatus);
      }

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
        filterrecords: this.filterrecords,
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
        this.commonApi.emitDirectoryListData(data);
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
            this.partData["filterrecords"] = this.filterCheck();
            this.partData["filterOptions"] = this.apiData["filterOptions"];
            console.log(this.partData);
            // Get Part List
            this.commonApi.emitDirectoryListData(this.partData);
            setTimeout(() => {
              this.filterLoading = false;
              this.filterOptions["filterLoading"] = this.filterLoading;
              console.log(this.apiData);
            }, 500);
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");
          }
        }, 50);

      }, 1500);
    } else {
      this.router.navigate(["/forbidden"]);
    }

    this.subscription.add(
      this.commonApi.partLayoutDataReceivedSubject.subscribe((data) => {
        //console.log(data)
        this.loading = data["loading"];
        this.displayNoRecords = data["displayNoRecords"];
        this.itemEmpty = data["itemEmpty"];
        this.itemTotal = data["itemTotal"];
        this.itemOffset = data["itemOffset"];
        this.partsList = data["partsList"];
      })
    );


    this.subscription.add(
      this.commonApi.directoryUserIdReceivedSubject.subscribe((data) => {
        this.directoryInfoData = data;
        this.rightPanelEnable = true;
        if(!this.rightPanel){
          this.partData.actionRightPanel = "1";
        }
        else{
          this.partData.actionRightPanel = "0";
        }
        this.rightPanel = true;
        this.partData.rightPanel = this.rightPanel;
        this.commonApi.emitDirectoryUserData(data);
        this.partData.action = "toggle";
        this.partData["filterrecords"] = this.filterCheck();
        this.commonApi.emitDirectoryListData(this.partData);
      })
    );
  }

  // status
  selectEventSort(event) {
    this.publishStatus = event.value.code;
    this.partData["publishStatus"] = this.publishStatus;
    this.partData["action"] = "status";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitDirectoryListData(this.partData);
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.partData.action = "toggle";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitDirectoryListData(this.partData);
  }

  // Apply Filter
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      this.partData["filterOptions"] = filterData;

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
      localStorage.removeItem("directoryFilter");
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
      localStorage.setItem("partListView", viewType);
      setTimeout(() => {
        this.partData.thumbView = this.thumbView;
        this.partData.action = "view";
        this.partData.filterrecords = this.filterCheck();
        this.commonApi.emitDirectoryListData(this.partData);
      }, 50);
    }
  }

  // Clear Selection
  clearSelection() {
    this.headerCheck = "unchecked";
    this.headercheckDisplay = "checkbox-hide";
    this.partData["headerCheck"] = this.headerCheck;
    this.partData["headercheckDisplay"] = this.headercheckDisplay;
    this.partData["action"] = "clear";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitDirectoryListData(this.partData);
  }

  // Pin or Unpin
  pinnedPartList(flag) {
    this.pinFlag = flag;
    this.partType = flag ? "pined" : "";
    this.pinClass = flag ? "active" : "normal";
    localStorage.setItem("partPinFlag", flag);
    this.partData["partType"] = this.partType;
    this.partData["action"] = "status";
    this.partData["filterrecords"] = this.filterCheck();
    this.partListCallBack("pin", this.section);
  }

  // Section Change
  sectionChange(action) {
    if (this.section != action) {
      this.section = action;
      this.partData["section"] = action;
      this.partListCallBack("section", action);
    }
  }

  // Part List Call Back
  partListCallBack(type, action) {
    this.headerFlag = type == "pin" ? this.headerFlag : false;
    this.section = action;
    let searchVal = "";
    this.applySearch(action, searchVal);
  }

  // Apply Search
  applySearch(action, val) {
    if (action == "emit" && this.searchVal == '' && val == '') {

    }
    else{
      this.rightPanel = false;
      this.rightPanelEnable = false;
      setTimeout(() => {
      let callBack = false;
      this.searchVal = val;
      this.partData["searchVal"] = this.searchVal;
      this.partData["action"] = "filter";
      switch (action) {
        case "reset":
          this.resetFilterFlag = true;
          this.ngOnInit();
          break;
        default:
          if (action == "emit") {
            this.headerData["searchVal"] = this.searchVal;
          }
          this.partData["filterrecords"] = this.filterCheck();
          this.commonApi.emitDirectoryListData(this.partData);
          setTimeout(() => {
            if (action == "init") {
              this.headerFlag = true;
            }
          }, 500);
          break;
      }

      if (callBack) {
        this.partData["filterrecords"] = this.filterCheck();
        this.commonApi.emitDirectoryListData(this.partData);
      }
      }, 1);
    }

  }
 // if any one filter is ON
  filterCheck(){
    this.filterrecords = false;
    if(this.publishDefaultStatus != this.publishStatus ){
      this.filterrecords = true;
    }
    if(this.section == 2){
      this.filterrecords = true;
    }
    if(this.pinFlag){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  // Parts Selection Deactivate or Delete
  partsListAction(status) {
    this.headerCheck = "unchecked";
    this.headercheckDisplay = "checkbox-hide";

    this.partData["headercheckDisplay"] = this.headercheckDisplay;
    let loadList = false;
    let offset = this.itemOffset;
    switch (true) {
      case offset > 0:
        let availItems = this.partsList.length - this.partsSelectionList.length;
        loadList = availItems > 0 ? false : true;
        break;
      case offset < 1:
        loadList = true;
        break;
    }

    this.loading = true;
    this.partData["action"] = "api";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitDirectoryListData(this.partData);
    let partsSelectionList = JSON.stringify(this.partsSelectionList);

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    apiFormData.append("status", status);
    apiFormData.append("partArray", partsSelectionList);

    this.partsApi.updatePartStatus(apiFormData).subscribe((response) => {
      if (loadList) {
        this.partsSelectionList = [];
        this.itemOffset = 0;
        setTimeout(() => {
          this.partsList = [];
          this.partData["action"] = "get";
        }, 250);
      } else {
        this.itemTotal = this.itemTotal - this.partsSelectionList.length;
        for (let rm of this.partsSelectionList) {
          let rmIndex = this.partsList.findIndex((option) => option.id == rm);
          this.partsList.splice(rmIndex, 1);
        }
        this.partData["action"] = "assign";
        this.partData["partsList"] = this.partsList;

        setTimeout(() => {
          this.partsSelectionList = [];
        }, 500);
      }

      setTimeout(() => {
        this.headerCheck = "unchecked";
        this.partData["headerCheck"] = this.headerCheck;
        this.partData["headercheckDisplay"] = this.headercheckDisplay;
        this.loading = false;
        this.partData["filterrecords"] = this.filterCheck();
        this.commonApi.emitDirectoryListData(this.partData);
      }, 500);
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;
      this.filterHeight = window.innerHeight;
      this.filterOptions["filterHeight"] = this.innerHeight;
    } else {
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let footerHeight = (document.getElementsByClassName("footer-content")[0]) ? document.getElementsByClassName("footer-content")[0].clientHeight : 0;
      this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 30);
      this.innerHeight = this.innerHeight;

      this.filterHeight = window.innerHeight;
      this.filterOptions["filterHeight"] = this.innerHeight;
    }
  }

  // Nav Part Edit or View
  navPart(action, id) {
    let url;
    url = this.partsUrl;
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      window.open(url, IsOpenNewTab.teamOpenNewTab);
    } else {
      window.open(url, IsOpenNewTab.openNewTab);
    }
  }


  // Toggle Action
  toggleActionDirectory(data) {
    let flag = data.action;
    this.directoryInfoData = data.directoryInfoData;
    this.rightPanel = !flag;
    if(this.rightPanel){
      this.toggleInfoDirectory(flag);
    }
    else{
      this.partData.actionRightPanel = "1";
      this.partData.action = "toggle";
      this.partData["filterrecords"] = this.filterCheck();
      this.commonApi.emitDirectoryListData(this.partData);
    }
  }

  // Toogle Document Info
  toggleInfoDirectory(flag) {
    this.rightPanel = !flag;
    if(this.rightPanel){
      this.partData.actionRightPanel = "1";
    }
    else{
      this.partData.actionRightPanel = "0";
    }
    this.commonApi.emitDirectoryUserData(this.directoryInfoData);
    this.partData.action = "toggle";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitDirectoryListData(this.partData);
  }


}
