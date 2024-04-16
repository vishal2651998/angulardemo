import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { CommonService } from '../../../services/common/common.service';
import { ExcelService } from '../../../services/dashboard/excel/excel.service';
import { ExportPopupComponent } from '../../../components/common/export-popup/export-popup.component';
import { PlatFormType } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

  @Input() pageData;
  @Output() userSearch: EventEmitter<any> = new EventEmitter();
  @Output() techsuppotTabActionEmit: EventEmitter<any> = new EventEmitter();
  @Output() manufactureTabActionEmit: EventEmitter<any> = new EventEmitter();

  public access: string = "";
  public title: string = "";
  public titleFlag: boolean;
  public exportFlag: boolean;
  public exportFlagthread: boolean;

  public exportLoading: boolean = false;
  public exportLoadingAll: boolean = false;
  public exportData: any;

  public apiData: any = {};
  public startDate: any;

  public menuFlag: boolean = false;
  public menuItems: any;

  public searchVal: string;
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public resetFlag: boolean = false;
  public searchFlag: boolean = false;
  public searchNoDataFlag: boolean = false;
  public searchResultLoading: boolean = false;
  public userResultFlag: boolean = false;
  public searchPlaceHolder: string = "";
  public userType: any;
  public userList = [];
  public menuCol: string = "";
  public searchCol: string = "";
  public techsupoortmetricsFlag  : boolean = false;
  public manufacturemetricsFlag  : boolean = false;
  public industryType: any = "";

  platformId = localStorage.getItem("platformId");

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dashboardApi: DashboardService,
    private excelService: ExcelService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = false;
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  ngOnInit() {
    let options = this.pageData;
    this.access = options.access;

    this.title = options.title;
    this.titleFlag = options.titleFlag;
    this.exportFlag = options.exportFlag;
    this.exportFlagthread = options.exportFlagthread;
    //alert(this.exportFlagthread);
    if (this.exportFlag) {
      this.apiData = options.apiInfo;
      this.apiData['offset'] = 0;
      this.apiData['limit'] = options.total;
      //this.apiData['month'] = options.startDate;
      this.exportData = options.exportData;
    }

    this.industryType = this.commonService.getIndustryType();

    if (!this.titleFlag) {
      let activePage = options.activePage;
      let baseLink = "/mis/dashboard";
      switch (this.access) {
        case 'escModel':
        case 'escZone':
          activePage = (activePage == baseLink + '/escalations') ? baseLink + '/escalation/models' : activePage;
          this.menuItems = [
            {
              'menuItem': 'Escalation By Models',
              'menuLink': `${baseLink}/escalation/models`,
              'menuActive': false
            },
            {
              'menuItem': 'Escalation By Region',
              'menuLink': `${baseLink}/escalation/region`,
              'menuActive': false
            },
            /*{
              'menuItem': 'Monthly Escalations',
              //'menuLink': `${baseLink}/monthly/escalations`,
              'menuLink': 'javascript:void(0)',
              'menuActive': false
            },
            {
              'menuItem': 'Active Escalations',
              //'menuLink': `${baseLink}/active/escalations`,
              'menuLink': 'javascript:void(0)',
              'menuActive': false
            }*/
          ];

          for (let item of this.menuItems) {
            if (activePage == item.menuLink) {
              item.menuActive = true;
            }
          }
          this.menuFlag = true;
          break;
        case 'zoneMetrics':
        case 'areaMetrics':
        case 'userMetrics':
          activePage = (activePage == baseLink + '/events') ? baseLink + '/events/zone-metrics' : activePage;
          this.menuItems = [
            {
              'menuItem': 'Zone Based Event View',
              'menuLink': `${baseLink}/events/zone-metrics`,
              'menuActive': false
            },
            {
              'menuItem': 'Area Based Event View',
              'menuLink': `${baseLink}/events/area-metrics`,
              'menuActive': false
            },
            {
              'menuItem': 'User Activity',
              'menuLink': `${baseLink}/events/user-activity`,
              'menuActive': false
            }
          ];
          for (let item of this.menuItems) {
            if (activePage == item.menuLink) {
              item.menuActive = true;
            }
          }
          this.menuFlag = true;
          break;
        case 'gtsUsage':
        case 'gtsDealer':
          activePage = (activePage == baseLink + '/gts/gts-usage') ? baseLink + '/gts/dealer-usage' : activePage;
          this.menuItems = [
            {
              'menuItem': 'GTS Usage',
              'menuLink': `${baseLink}/gts`,
              'menuActive': false
            },
            {
              'menuItem': 'Dealer Usage',
              'menuLink': `${baseLink}/gts/dealer-usage`,
              'menuActive': false
            }
          ];

          for (let item of this.menuItems) {
            if (activePage == item.menuLink) {
              item.menuActive = true;
            }
          }
          this.menuFlag = true;
          options.searchPlaceHolder = 'Search';
          this.menuCol = "split-menu-col";
          this.searchCol = "split-search-col";
          this.initSearch(options);
          break;
          case 'manufacturechart':
            this.manufacturemetricsFlag = true;
            if(this.industryType.id != 1){
              this.menuItems = [
                {
                  'menuItem': 'Manufacturer',
                  'id': '1',
                  'name':'Manufacturer',
                  'type' : 1,
                  'menuActive': false
                },
                {
                  'menuItem': 'Make',
                  'id': '2',
                  'name': 'Make',
                  'type' : 2,
                  'menuActive': false
                }
              ];
            }
            else{
              this.menuItems = [
                {
                  'menuItem': 'Make',
                  'id': '2',
                  'name': 'Make',
                  'type' : 2,
                  'menuActive': false
                }
              ];
            }
            console.log(this.menuItems);
            this.menuItems[0].menuActive = true;
          this.menuFlag = true;
          options.searchPlaceHolder = 'Search';
          this.menuCol = "split-menu-col";
          this.searchCol = "split-search-col";
          this.initSearch(options);
          break;
          case 'techsupport':
            setTimeout(() => {
              this.techsupoortmetricsFlag = true;
            let techSupportChartsTabs = JSON.parse(
              localStorage.getItem("techSupportChartsTabs")
            );
            console.log(techSupportChartsTabs);
            this.menuItems = [];
            for (let ps in techSupportChartsTabs) {
              this.menuItems.push({
                menuItem: techSupportChartsTabs[ps].name,
                id: techSupportChartsTabs[ps].id,
                name: techSupportChartsTabs[ps].name,
                type: techSupportChartsTabs[ps].type,
                menuActive: false,
              });
            }
            console.log(this.menuItems);
            this.menuFlag = true;
            this.menuItems[0].menuActive = true;
            options.searchPlaceHolder = 'Search';
          this.menuCol = "split-menu-col";
          this.searchCol = "split-search-col";
          this.initSearch(options);
            }, 1000);
            break;
      }
    } else {
      switch (this.access) {
        case 'dealerUsage':
        case 'serviceProbing':
          this.initSearch(options);
          break;
        case 'leaderboard':
          break;

      }
    }
  }

  // Init Search
  initSearch(options) {
    this.apiData = options.apiInfo;
    this.searchFlag = options.searchFlag;
    if (this.searchFlag) {
      let searchVal = options.searchKey;
      if (this.searchVal != undefined && this.searchVal != 'undefined' && this.searchVal != '') {
        this.searchVal = searchVal;
        this.searchTick = true;
        this.searchClose = this.searchTick;
      }
      this.searchPlaceHolder = options.searchPlaceHolder;
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
    }
  }

  // Page Navigation
  navigatePage(url) {
    this.router.navigate([url]);
    let navPage = 'true';
    localStorage.setItem('navPage', navPage);
  }
  navigateTap(menu,index) {
    for (let i in this.menuItems) {
      this.menuItems[i].menuActive = false;
    }
    this.menuItems[index].menuActive = true;
    this.techsuppotTabActionEmit.emit(menu);
  }
  navigateManufactureTap(menu,index) {
    for (let i in this.menuItems) {
      this.menuItems[i].menuActive = false;
    }
    this.menuItems[index].menuActive = true;
    this.manufactureTabActionEmit.emit(menu);
  }
  exportall() {
    //alert(222);
    this.exportLoadingAll = true;
    // alert(this.access);
    switch (this.access) {

      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealerActivity();
        break;
      case 'threads':
        let threadInfo = this.pageData.exportData;
        let title = "Thread Reports";
        this.apiData['groupId'] = this.pageData.groupId;
        this.apiData['filterOptions']['groupId'] = this.apiData['groupId'];
        let exportInfo = [title, 'All'];
        this.exportThreadReportALL(exportInfo);
        break;
      case 'user-activities':
        let userActivitiesInfo = this.pageData.exportData;
        let userActivitiestitle = "User Activity Reports";
        let exportUserActivitiesInfo = [userActivitiestitle, 'All'];
        this.exportUserActivitiesReportALL(exportUserActivitiesInfo);
        break;
      default:
        return false;
        break;
    }
  }
  export() {
    let title = ''
    let exportInfo = []
    //alert(5555);
    //this.exportLoading = true;
    switch (this.access) {
      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealerActivity();
        break;
      case 'threads':
        let threadInfo = this.pageData.exportData;
        title = "Thread Reports";
        this.apiData['groupId'] = this.pageData.groupId;
        this.apiData['filterOptions']['groupId'] = this.apiData['groupId'];
        exportInfo = [title, threadInfo.threadTitle];

        this.exportThreadReport(exportInfo);
        break;
      case 'leaderboard':
        let leaderBoardInfo = this.pageData.exportData
        if (leaderBoardInfo.leaderBoardData.length) {
          title = 'Leaderboard Data'
          this.apiData['groupId'] = this.pageData.groupId;
          //   this.apiData.filterOptions = this.apiData['groupId']
          this.apiData['filterOptions'] = {
            groupId: this.apiData['groupId']
          };
          //    this.apiData['filterOptions']['groupId'] = this.apiData['groupId'];
          exportInfo = [title, leaderBoardInfo.threadTitle];
          this.exportLeaderBoardReport(exportInfo);
        }
        break;
      case 'user-activities':
        let userActivitiesInfo = this.pageData.exportData
        console.log(userActivitiesInfo);
        if (userActivitiesInfo.userActivitiesData.length) {
          title = 'User Activity Data'
          exportInfo = [title, userActivitiesInfo.threadTitle];
          this.exportUserActivitiesReport(exportInfo);
        }
        break;
      default:
        return false;
        break;
    }
  }

  // Export Dealer Activity
  /*
  exportDealerActivity() {
    this.exportLoading = true;
    this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let exportData = responseData.chartdetails;
      this.excelService.generateExcel(this.access, this.title, exportData);
      setTimeout(() => {
        this.exportLoading = false;
      }, 1500);
    });
  }
  */

  exportLeaderBoardReport(exportInfo) {


    this.exportLoading = false;

    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.exportInfo = exportInfo;
    modalRef.componentInstance.exportData = this.exportData;
    modalRef.componentInstance.access = this.access;
    if (this.platformId == PlatFormType.Collabtic) {
      modalRef.componentInstance.isCollabtic = true;
    }
    modalRef.componentInstance.exportAllFlag = false;

    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
  }

  exportUserActivitiesReport(exportInfo) {
    this.exportLoading = false;
    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.exportInfo = exportInfo;
    modalRef.componentInstance.exportData = this.exportData;
    modalRef.componentInstance.access = this.access;
    if (this.platformId == PlatFormType.Collabtic) {
      modalRef.componentInstance.isCollabtic = true;
    }
    modalRef.componentInstance.exportAllFlag = false;
    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
  }

  exportDealerActivity() {
    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = this.apiData;

    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.exportInfo = '';
    modalRef.componentInstance.exportData = '';
    modalRef.componentInstance.access = this.access;
    modalRef.componentInstance.exportAllFlag = false;
    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
  }

  // Export Thread Report
  exportThreadReport(exportInfo) {


    this.exportLoadingAll = false;

    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.exportInfo = exportInfo;
    modalRef.componentInstance.exportData = this.exportData;
    modalRef.componentInstance.access = this.access;
    if (this.platformId == PlatFormType.Collabtic || this.platformId == PlatFormType.CbaForum) {
      modalRef.componentInstance.isCollabtic = true;
    }
    modalRef.componentInstance.exportAllFlag = false;
    let threadType = exportInfo[1];

    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
    /*
    this.exportLoading = true;
    let threadType = exportInfo[1];
   // alert();
    this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let exportThreadData = responseData.chartdetails;
      let threadInfo = ['exportThread'];
      let threadList = this.commonService.getModifiedThreadData(threadInfo, exportThreadData, threadType);
      this.exportData['threadList'] = threadList;
      this.excelService.generateExcel(this.access, exportInfo, this.exportData);
      setTimeout(() => {
        this.exportLoading = false;
      }, 1500);
    });
    */
  }

  exportThreadReportALL(exportInfo) {
    this.exportLoadingAll = false;

    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.exportInfo = exportInfo;
    modalRef.componentInstance.exportData = this.exportData;
    modalRef.componentInstance.access = this.access;
    modalRef.componentInstance.exportAllFlag = true;
    if (this.platformId == PlatFormType.Collabtic || this.platformId == PlatFormType.CbaForum) {
      modalRef.componentInstance.isCollabtic = true;
    }
    let threadType = exportInfo[1];
    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
    /*
    this.dashboardApi.apiChartDetailAll(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let exportThreadData = responseData.chartdetails;
      let threadInfo = ['exportThread'];
      let threadList = this.commonService.getModifiedThreadData(threadInfo, exportThreadData, threadType);
      this.exportData['threadList'] = threadList;

     // this.excelService.generateExcel(this.access, exportInfo, this.exportData);
      setTimeout(() => {
        this.exportLoadingAll = false;
      }, 1500);
    });
    */
  }

  exportUserActivitiesReportALL(exportInfo) {
    this.exportLoadingAll = false;
    const modalRef = this.modalService.open(ExportPopupComponent, this.config);
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.exportInfo = exportInfo;
    modalRef.componentInstance.exportData = this.exportData;
    modalRef.componentInstance.access = this.access;
    modalRef.componentInstance.exportAllFlag = true;
    if (this.platformId == PlatFormType.Collabtic) {
      modalRef.componentInstance.isCollabtic = true;
    }
    let threadType = exportInfo[1];
    modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
      if (receivedService == 1) {
        modalRef.dismiss('Cross click');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    if (this.access == 'gtsUsage' || this.access == 'gtsDealer') {
      if (searchValue.length > 1) {
        this.searchForm.value.search_keyword = searchValue;
        this.searchTick = (searchValue.length > 0) ? true : false;
        this.searchClose = this.searchTick;
      } else {
        this.searchResultLoading = false;
        this.userResultFlag = false;
      }
      return false;
    }
    setTimeout(() => {
      this.searchResultLoading = true;
      if (searchValue.length > 1) {
        let options = this.pageData;
        this.searchForm.value.search_keyword = searchValue;
        this.searchTick = (searchValue.length > 0) ? true : false;
        this.searchClose = this.searchTick;
        //added by karuna
        //this.searchVal = searchValue;
        let getFilteredValues;
        switch (this.access) {
          case 'dealerUsage':
            getFilteredValues = JSON.parse(localStorage.getItem('dealerFilter'));
            break;
          case 'serviceProbing':
            getFilteredValues = JSON.parse(localStorage.getItem('serviceFilter'));
            break;
        }
        this.userList = [];
        this.userType = (getFilteredValues.userType != undefined || getFilteredValues.userType != 'undefined') ? [] : getFilteredValues.userType;
        this.apiData['offset'] = 0;
        this.apiData['limit'] = options.total;
        this.apiData['storage'] = 'searchFilter';
        // this.apiData['searchKey'] = this.searchVal;
        //added by karuna
        this.apiData['searchKey'] = searchValue;

        let searchRes = this.commonService.dashboardSearch(this.apiData);
        /*
         setTimeout(() => {
           this.userList = [];
           let resFlag = (searchRes == undefined || searchRes == 'undefined') ? false : true;
           if(resFlag) {
             this.searchNoDataFlag = (searchRes.total == 0 || searchRes.length == 0) ? true : false;
             this.userList = searchRes.userList;
             let duration = (searchRes.total > 150) ? 1500 : 100;
             this.searchResultLoading = false;
             this.userResultFlag = true;
           }
         }, 500);
         */
        this.userList = [];
        let resFlag = (searchRes == undefined || searchRes == 'undefined') ? false : true;
        if (resFlag) {
          this.searchNoDataFlag = (searchRes.total == 0 || searchRes.length == 0) ? true : false;
          this.userList = searchRes.userList;
          let duration = (searchRes.total > 150) ? 1500 : 100;
          this.searchResultLoading = false;
          this.userResultFlag = true;
        }
      } else {
        this.searchResultLoading = false;
        this.userResultFlag = false;
      }
    }, 700);
  }

  selectUser(value) {
    this.searchVal = value;
    this.userSearch.emit(this.searchVal);
  }

  // Submit Search
  submitSearch() {
    console.log(2)
    this.userSearch.emit(this.searchVal);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    let getFilteredValues;
    switch (this.access) {
      case 'dealerUsage':
        getFilteredValues = JSON.parse(localStorage.getItem('dealerFilter'));
        getFilteredValues.searchKey = this.searchVal;
        break;
      case 'serviceProbing':
        getFilteredValues = JSON.parse(localStorage.getItem('serviceFilter'));
        getFilteredValues.searchKey = this.searchVal;
        break;
    }
    this.userSearch.emit(this.searchVal);
  }

}
