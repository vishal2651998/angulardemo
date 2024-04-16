import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, ContentTypeValues, FilterGroups, filterNames, pageInfo } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { LandingpageService } from "src/app/services/landingpage/landingpage.service";
import { FilterService } from "src/app/services/filter/filter.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProductHeaderComponent } from "src/app/layouts/product-header/product-header.component";
import { FilterComponent } from "src/app/components/common/filter/filter.component";
import { AdasListComponent } from 'src/app/components/common/adas-list/adas-list.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  productHeaderRef: ProductHeaderComponent;
  filterRef: FilterComponent;
  adasPageRef: AdasListComponent;

  public title: string = "ADAS List";
  public bodyClass: string = "adas";
  public bodyClass1: string = "adas-list";
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public pageLoading: boolean = true;
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public fileView: boolean = false;
  public headerData: Object;
  public headTitle: string = "ADAS Procedure";

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;

  public pageData = pageInfo.adasProcedure;
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public pageId = pageInfo.adasProcedure;
  public apiData: Object;
  public apiInfo: Object;
  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = true;
  public contentTypeId: any = ContentTypeValues.AdasProcedure;
  public groupId: number = 40;
  public filterInterval: any;
  public createAccess: boolean = true;
  public resize: boolean = false;
  public loading: boolean = true;
  public filterLoading: boolean = true;
  public searchVal: string = "";
  public pageAccess: string = "adas";
  public pinType: string = "";
  public pinFlag: boolean = false;
  public pinClass: string = "normal";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = false;
  
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
    private landingpageServiceApi: LandingpageService,
    private filterApi: FilterService,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    localStorage.removeItem("searchValue");
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
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
            
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
        roleId: this.roleId,
        domainId: this.domainId,
        countryId: this.countryId,
        contentTypeId: this.contentTypeId,
        isActive: 1,
        searchKey: this.searchVal,
        checkAccessItems: this.authenticationService.checkAccessItems
      };   
      this.apiInfo = apiInfo;
      this.filterOptions["apiKey"] = this.apiKey;
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;
      this.apiData = apiInfo;

      setTimeout(() => {
        this.pageLoading = false;
          //this.getFilters('init');
      }, 100);

      this.bodyHeight = window.innerHeight;
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  getFilters(action) {
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
        setTimeout(() => {
          this.filterLoading = false;
          this.loading =  false;
          this.filterOptions["filterLoading"] = this.filterLoading;
          if(action == 'callback') {
            this.filterRef.filterOptions = this.filterOptions;
            this.filterRef.ngOnInit();
          }
          if(this.groupId == FilterGroups.AdasProcedure) {
            this.filterRef.activeFilter = this.filterActiveCount > 0 ? true : false;
          }          
          console.log(this.apiData);
        }, 100);
        clearInterval(this.filterInterval);
        localStorage.removeItem("filterWidget");
        localStorage.removeItem("filterData");            
      }
    }, 50);
  }

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
  }

  headerCallback(data) {
    this.productHeaderRef = data;
  }

  adasCallback(data) {
    console.log(data)
    this.adasPageRef = data;
    this.fileView = this.adasPageRef.fileView;
    this.thumbView = this.adasPageRef.thumbView;
  }

  viewType() {
    if (!this.adasPageRef.itemEmpty) {
      this.thumbView = !this.thumbView;
      this.adasPageRef.thumbView = this.thumbView;
      this.adasPageRef.adasFilesRef.thumbView = this.thumbView;
    }
  }

  pinnedList() {}

  filterCallback(data) {
    console.log(data)
    let action = data.actionFilter;
    switch(action) {
      case 'filter':
        this.filterRef.activeFilter = true;
        let getFilteredValues = JSON.parse(
          localStorage.getItem(filterNames.adasProcedure)
        );
        Object.keys(getFilteredValues).forEach(key => {
          let val = getFilteredValues[key];
          switch(key) {
            case 'workstream':
              this.filterRef.storedWorkstreams = val;
              break;
            case 'model':
              this.filterRef.storedModels = val;
              break;
            case 'year':
              this.filterRef.storedYears = val;
              break;
          }
        });
        break;
      case 'clear':
        this.filterRef.storedWorkstreams = [];
        this.filterRef.storedModels = [];
        this.filterRef.storedYears = [];
        this.filterRef.activeFilter = false;
        break;  
    }
  }
  

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;    
  }

  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    /* filterData['pageInfo'] = this.pageData;
    this.filterOptions['filterExpand'] = this.expandFlag;
    //this.partData['expandFlag'] = this.expandFlag;
    //this.partData["toggleFlag"] = this.expandFlag;
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterrecords = this.filterCheck();

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
      localStorage.removeItem("partFilter");
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    } */
  }

  // Reset Filter
  resetFilter() {
    /* this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.filterrecords = this.filterCheck();
    this.currYear = moment().format("Y");

    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
    localStorage.removeItem("partFilter");
      setTimeout(() => {
        this.filterLoading = true;
        this.filterOptions['expandFlag'] = true;
        this.filterOptions["filterLoading"] = this.filterLoading;
        this.filterOptions["filterActive"] = false;
        this.currYear = moment().format("Y");
        this.applyFilterSearch("reset", this.searchVal);
      }, 500); */
  }

}
