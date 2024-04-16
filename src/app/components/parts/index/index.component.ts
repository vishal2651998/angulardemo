import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, filterNames, PlatFormType, pageInfo, SolrContentTypeValues, windowHeight, DefaultNewCreationText, RedirectionPage } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ApiService } from '../../../services/api/api.service';
import { FilterService } from "../../../services/filter/filter.service";
import { PartsService } from "../../../services/parts/parts.service";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { FilterComponent } from "src/app/components/common/filter/filter.component";
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
  @ViewChild("ttpaarts") tooltip: NgbTooltip;
  subscription: Subscription = new Subscription();
  filterRef: FilterComponent;
  public selectedStatus: any;
  public partPublishStatus: sortOption[];
  public partPublishOptions = [];
  public title: string = "Parts";
  public bodyClass: string = "parts-list";
  public pageCreateNew: string = DefaultNewCreationText.Parts;
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public headerFlag: boolean = false;
  public headerData: Object;

  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = false;
  public groupId: number = 6;
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
  public delayDisplay: boolean = false;
  public resize: boolean = false;
  public loading: boolean = true;
  public filterLoading: boolean = true;

  public partsUrl: string = "parts/manage/";
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public searchVal: string = "";
  public pageAccess: string = "parts";
  public pageData = pageInfo.partsPage;

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
  public collabticDomain: boolean = false;
  public mahleDomain: boolean = false;
  public CBADomain: boolean = false;
  public solrApi: boolean = false;
  public tvsDomain:boolean=false;
  public mssDomain:boolean=false;

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
  };
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
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
    private landingpageServiceApi: LandingpageService,
    public apiUrl: ApiService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(action = ''): void {
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
    if(action == 'reset') {
      localStorage.setItem('filterReset','1');
    }
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
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
      let platformId = localStorage.getItem("platformId");
      this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
      this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
      this.mahleDomain = (platformId == PlatFormType.MahleForum) ? true : false;
      this.tvsDomain=(this.domainId == '52') ? true : false;
      this.mssDomain=(this.domainId == '82') ? true : false;
      //this.solrApi = (this.collabticDomain || this.CBADomain || this.tvsDomain || this.mssDomain) ? true : false;
      this.solrApi = (this.collabticDomain || this.mssDomain) || this.tvsDomain  ? true : false;

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
      this.filterOptions['filterType'] = SolrContentTypeValues.Parts;

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
          partData: this.partData
        };
        this.commonApi.emitPartListData(data);
      }, 150);

      setTimeout(() => {
        this.setScreenHeight();
        let apiData = this.apiData;
        apiData["groupId"] = this.groupId;

        if(this.solrApi) {
          this.apiData["onload"] = true;
          this.apiData["filterOptions"] = {};
          this.apiData["filterOptions"]["pageInfo"] = this.pageData;
          let filterData = this.commonApi.setfilterData(this.pageAccess);
          console.log(filterData)
          // Setup Filter Active Data
          this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
          filterData.action = 'init';
          filterData["filterrecords"] = this.filterCheck(action);
          this.apiData["filterOptions"]["filterrecords"] = filterData["filterrecords"];
          this.apiData["filterOptions"] = filterData;
          this.partData['filterOptions'] = this.apiData["filterOptions"];
          this.commonApi.emitPartListData(this.partData);
        }

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
            if(!this.solrApi) {
              // Get Part List
              this.commonApi.emitPartListData(this.partData);
            }
            if(action == 'reset') {
              /* let filterOPt = this.filterRef.options;
              if(this.filterRef.errorCodeWidget) {
                let errCodeId = this.filterRef.errorCodeId;
                let optIndex = filterOPt.findIndex(option => option.id == errCodeId);
                if(optIndex >= 0) {
                  let errCode = filterOPt[optIndex].valueArray;
                  let errorCodelItems = [];
                  errCode.forEach(item => {
                    errorCodelItems.push({
                      id: item.value,
                      name: item.value
                    });
                  });
                  this.filterRef.errorCodeArr = errorCodelItems;
                }
              } */
            }
            let resetTimeout = (action != 'reset') ? 0 : 1500;
            setTimeout(() => {
              this.filterOptions['filterExpand'] = this.expandFlag;
              this.filterLoading = false;
              this.filterOptions["filterLoading"] = this.filterLoading;
            }, resetTimeout);
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
        console.log(data, this.partData)
        let recall = (data['recall']) ? true : false;
        if(recall) {
          this.commonApi.emitPartListData(this.partData);
        } else {
          this.loading = data["loading"];
          this.headerCheck = data["headerCheck"];
          this.headercheckDisplay = data["headercheckDisplay"];
          this.displayNoRecords = data["displayNoRecords"];
          this.itemEmpty = data["itemEmpty"];
          this.itemTotal = data["itemTotal"];
          this.itemOffset = data["itemOffset"];
          this.partsList = data["partsList"];
          this.partsSelectionList = data["partsSelectionList"];
        }
      })
    );
  }

  // status
  selectEventSort(event) {
    this.publishStatus = event.value.code;
    this.partData["publishStatus"] = this.publishStatus;
    this.partData["action"] = "status";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitPartListData(this.partData);
  }

  accessLevelValu(event){
    this.accessLevel = event;
    this.createAccess = this.accessLevel.create;
    setTimeout(() => {
      this.delayDisplay = true;
    }, 1000);
  }
  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.partData.action = "toggle";
    this.partData["filterrecords"] = this.filterCheck();
    this.commonApi.emitPartListData(this.partData);
  }

  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    filterData['pageInfo'] = this.pageData;
    if(!this.solrApi) {
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.partData['expandFlag'] = this.expandFlag;
      this.partData["toggleFlag"] = this.expandFlag;
    }
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      if(!this.solrApi) {
        this.filterLoading = true;
      }
      this.filterActiveCount = 0;
      this.filterrecords = this.filterCheck();

      if(this.solrApi) {
        filterData["loadAction"] = '';
        console.log(filterData, this.filterRef);
        // Setup Filter Active Data
        this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
        setTimeout(() => {
          filterData["filterrecords"] = this.filterCheck();
          this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
          this.filterRef.activeFilter = this.filterActiveCount > 0 ? true : false;
          this.partData['filterOptions'] = filterData;
          this.applyFilterSearch("filter", this.searchVal, filterData);
        }, 500);
      } else {
        this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
        this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
        filterData["filterrecords"] = this.filterCheck();
        this.applyFilterSearch("filter", this.searchVal, filterData);
        setTimeout(() => {
          this.filterLoading = false;
        }, 1000);
      }
    } else {
      localStorage.removeItem("partFilter");
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

    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
    if(!this.solrApi){
      localStorage.removeItem("partFilter");
      setTimeout(() => {
        this.filterLoading = true;
        this.filterOptions['expandFlag'] = true;
        this.filterOptions["filterLoading"] = this.filterLoading;
        this.filterOptions["filterActive"] = false;
        this.currYear = moment().format("Y");
        this.applyFilterSearch("reset", this.searchVal);
      }, 500);
    } else {
      this.filterOptions["filterActive"] = false;
      this.currYear = moment().format("Y");
      localStorage.removeItem("partFilter");
      this.ngOnInit('reset');
    }
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
        this.commonApi.emitPartListData(this.partData);
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
    this.commonApi.emitPartListData(this.partData);
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
    this.applyFilterSearch(action, searchVal);
  }

  // Apply Search
  applyFilterSearch(action, val, filterData: any = '') {
    let callBack = false;
    this.searchVal = val;
    this.headercheckDisplay = "checkbox-hide";
    this.headerCheck = "unchecked";
    this.partData["headerCheck"] = this.headerCheck;
    this.partData["headercheckDisplay"] = this.headercheckDisplay;
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
          this.headerFlag = true;
        }
        this.partData["filterrecords"] = this.filterCheck();
        this.commonApi.emitPartListData(this.partData);
        setTimeout(() => {
          if (action == "init") {
            this.headerFlag = true;
          }
        }, 500);
        break;
    }

    if (callBack) {
      this.partData["filterrecords"] = this.filterCheck();
      this.commonApi.emitPartListData(this.partData);
    }
  }
 // if any one filter is ON
  filterCheck(action = ''){
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
    if(this.filterActiveCount > 0 && action == ''){
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
    this.commonApi.emitPartListData(this.partData);
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
        this.commonApi.emitPartListData(this.partData);
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


    // New Window
    navPart(type,index) {
      let url;
    url = this.partsUrl;
      if(this.apiUrl.enableAccessLevel){
          this.authenticationService.checkAccess(11,'Create',true,true);

         setTimeout(() => {
           if(this.authenticationService.checkAccessVal){
            window.open(url, "_blank");
           }
           else if(!this.authenticationService.checkAccessVal){
             // no access
           }
           else{
            window.open(url, "_blank");
           }
         }, 550);
        }
        else{
          window.open(url, "_blank");
        }


    }



  // helpContent list and view
  helpContent(id) {
    id = id > 0 ? id : "";
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
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

  applySearch(action, data) {
    console.log(action, data)
  }

  filterCallback(data) {
    if(!this.solrApi) {
      return false;
    }
    console.log(data)
    this.filterRef = data;
    let action = data.actionFilter;
    switch(action) {
      case 'filter':
        this.filterRef.activeFilter = true;
        let getFilteredValues = JSON.parse(
          localStorage.getItem(filterNames.part)
        );
        console.log(getFilteredValues)
        Object.keys(getFilteredValues).forEach(key => {
          let val = getFilteredValues[key];
          switch(key) {
            case 'workstream':
              this.filterRef.storedWorkstreams = val;
              break;
            case 'model':
              this.filterRef.storedModels = val;
              break;
          }
        });
        break;
      case 'clear':
        this.filterRef.storedWorkstreams = [];
        this.filterRef.storedModels = [];
        this.filterRef.storedErrorCode = [];
        this.filterRef.activeFilter = false;
        break;
    }
  }
}
