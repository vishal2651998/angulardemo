import {Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Constant, ContentTypeValues, FilterGroups, filterNames, filterFields, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { StandardReportListComponent } from "src/app/components/common/standard-report-list/standard-report-list.component";
import { ExportPopupComponent } from 'src/app/components/common/export-popup/export-popup.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ProductHeaderComponent } from "src/app/layouts/product-header/product-header.component";
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { FilterComponent } from "src/app/components/common/filter/filter.component";
import { report } from "process";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public headerData: Object;
  pageAccess: string = "standard-report";
  public headTitle: string = "Standard Reports";
  public reportNew: string = DefaultNewCreationText.standardReport;
  public sectionNew: string = DefaultNewCreationText.reportSection;
  public moduleNew: string = DefaultNewCreationText.reportModule;
  public vehicleNew: string = DefaultNewCreationText.reportVehicle;
  productHeaderRef: ProductHeaderComponent;
  filterRef: FilterComponent;
  public thelpContentIconName = "";
  public thelpContentTitle = "";
  public thelpContentContent = "";
  public thelpContentId = "";
  public apiKey: string = Constant.ApiKey;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public contentTypeId: any = ContentTypeValues.StandardReports;
  public apiData: Object;
  public apiInfo: Object;
  public menuListloaded;
  public loading: boolean = true;
  public itemEmpty: boolean = false;
  public groupId: number = FilterGroups.Report;
  public filterInterval: any;
  public filterActiveCount: number = 0;
  public filterActions: object;
  public filterLoading: boolean = true;
  public expandFlag: boolean = true;
  public rightPanel: boolean = true;
  public searchVal: string = '';
  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;
  public downloadFlag: boolean = false;
  public searchFlag: boolean = false;
  public wsList: any = [];
  public selectedWs: any = 0;
  public filterCall: boolean = true;

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

  reportPageRef: StandardReportListComponent;
  public newReport: boolean = false;
  public newSection: boolean = false;
  public newDiagnostic: boolean = false;
  public newAdas: boolean = false;
  public typeId: number = 0;
  public empty: any = [];
  public sortItems: any = [{id: 'ASC', name: 'Ascending'}, {id: 'DESC', name: 'Descending'}];
  public sectionSort: any = '';
  public moduleSort: any = '';
  public lastUploaded: any = '';
  public showCleat: boolean = false;
  public reportFlag: boolean = true;
  public typeFlag: boolean = false;
  public sectionFlag: boolean = false;
  public diagnosticFlag: boolean = false;
  public adasFlag: boolean = false;
  public recallFlag: boolean = false;  
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLable: string = "Upload Module";
  public chooseLableAdas: string = "Upload Vehicle";
  public chooseIcon: string = "";
  public filesArr: any;
  public uploadedFiles: any[] = [];
  public attachments: any[] = [];
  public attachmentProgress: boolean = false;
  public uploadTxt: string = "Uploading...";
  public successMsg: string = this.uploadTxt;
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public uploadFlag: any = null;
  public loadedSoFar = 0;
  public progress = 0;
  public percentDone = 0;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public errModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public createAccess: boolean;
  public editAccess: boolean;
  public viewAccess: boolean;
  public deleteAccess: boolean;

  constructor(
    private activteRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) { 
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: false,
        newReport: this.newReport,
        newReportSection: this.newSection,
        newReportModule: this.newDiagnostic,
        newReportAdas: this.newAdas
      };
      let chkType = '', chkFlag = true;
      
      this.authenticationService.checkAccess(this.contentTypeId, chkType, chkFlag);
      setTimeout(() => {
        let accessLevels = this.authenticationService.checkAccessItems;
        if(accessLevels.length > 0) {
          let reportAccess = accessLevels[0].pageAccess;
          reportAccess.forEach(item => {
            let accessId = parseInt(item.id);
            let roles = item.roles;
            let roleIndex = roles.findIndex(option => option.id == this.roleId);
            let roleAccess = roles[roleIndex].access;
            console.log(accessId, roleAccess)
            switch (accessId) {
              case 1:
                this.viewAccess = (roleAccess == 1) ? true : false;
                break;
              case 2:
                this.createAccess = (roleAccess == 1) ? true : false;
                break;
              case 3:
                this.editAccess = (roleAccess == 1) ? true : false;
                break;
              case 4:
                this.deleteAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });
          this.newReport = this.createAccess;
        }  
      }, 500);      
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
      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.getFilters('init');
      }, 100);
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
          if(this.groupId == FilterGroups.ReportAdas) {
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

  applySearch(data) {
    let val = data.searchVal;
    let action = data.action;
    let sdata = data.item;
    let quickSearch = data.itemFlag;
    console.log(data)
    switch(action) {
      case 'search':
        if(val == '' && !this.searchFlag) {
          return;
        }
        this.productHeaderRef.searchBgFlag = (val != '') ? true : false;
        this.searchFlag = (val != '') ? true : false;
        this.reportPageRef.quickSearchFlag = quickSearch;
        this.reportPageRef.searchFlag = this.searchFlag;
        this.reportPageRef.searchVal = val;
        this.reportPageRef.loading = true;
        console.log(this.reportPageRef, val)
        let reportId, reportTypeId, reportContentTypeId;
        let type = '';
        let limit, offset, itemData;
        let typeId = (quickSearch) ? parseInt(sdata.rcId) : this.reportPageRef.typeInfo.rcId;
        let filterOptions = {};
        console.log(this.reportPageRef.typeInfo)

        if(quickSearch) {
          reportId = parseInt(sdata.reportId);
          this.newReport = false;
          this.newSection = false;
          this.newDiagnostic = false;
          this.newAdas = false;
          this.productHeaderRef.newReport = false;
          this.reportPageRef.reportFlag = false;
          this.reportPageRef.typeFlag = false;
          this.reportPageRef.sectionFlag = false;
          this.reportPageRef.diagnosticFlag = false;
          this.reportPageRef.adasFlag = false;
          let rcId = parseInt(sdata.rcId);
          console.log((rcId))
          switch(rcId) {
            case 1:
              this.sectionFlag = true;      
              this.reportPageRef.sectionFlag = true;
              filterOptions = this.reportPageRef.sectionFilterOptions;
              break;
            case 2:
              this.diagnosticFlag = true;
              this.reportPageRef.diagnosticFlag = true;
              filterOptions = this.reportPageRef.diagFilterOptions;
              break;
            case 3:
              this.adasFlag = true;
              this.reportPageRef.adasFlag = true;
              filterOptions = this.reportPageRef.adasFilterOptions;
              break;    
          }
        } else {
          reportId = this.reportPageRef.reportInfo.id;
        }
        
        if(this.reportFlag) {
          type = 'report';
          this.reportPageRef.reportTotal = 0;
          this.reportPageRef.reportOffset = 0;
          this.reportPageRef.reportItems = [];
          itemData = {
            view: 0,
            filterOptions: this.reportPageRef.reportFilterOptions,
            limit: this.reportPageRef.reportLimit,
            offset: this.reportPageRef.reportOffset
          };
        }

        if(!this.reportFlag && !this.sectionFlag && !this.diagnosticFlag && !this.adasFlag) {
          type = 'type';
          this.reportPageRef.typeTotal = 0;
          this.reportPageRef.typeOffset = 0;
          this.reportPageRef.typeItems = [];
          itemData = {
            reportId,
            view: 1,
            filterOptions: this.reportPageRef.typeFilterOptions,
            limit: this.reportPageRef.typeLimit,
            offset: this.reportPageRef.typeOffset
          };
        }

        if(this.sectionFlag || this.diagnosticFlag || this.adasFlag) {
          this.reportPageRef.reportInfo.callback = true;
          this.reportPageRef.typeInfo.callback = true;
          switch(typeId) {
            case 1:
              type = 'section';
              this.reportPageRef.sectionTotal = 0;
              this.reportPageRef.sectionOffset = 0;
              this.reportPageRef.sectionItems = [];
              limit = this.reportPageRef.sectionLimit;
              offset = this.reportPageRef.sectionOffset;
              break;
            case 2:
              type = 'diagnostic';
              this.reportPageRef.diagnosticTotal = 0;
              this.reportPageRef.diagnosticOffset = 0;
              this.reportPageRef.diagnosticItems = [];
              limit = this.reportPageRef.diagnosticLimit;
              offset = this.reportPageRef.diagnosticOffset;
              break;
            case 3:
              type = 'adas';
              this.reportPageRef.adasTotal = 0;
              this.reportPageRef.adasOffset = 0;
              this.reportPageRef.adasItems = [];
              limit = this.reportPageRef.adasLimit;
              offset = this.reportPageRef.adasOffset;
              break;    
          }
          console.log(sdata)
          reportTypeId = (quickSearch) ? parseInt(sdata.typeId) : this.reportPageRef.typeInfo.id;
          reportContentTypeId = (quickSearch) ? parseInt(sdata.rcId) : this.reportPageRef.typeInfo.rcId;
          itemData = {
            reportId,
            reportTypeId,
            reportContentTypeId,
            view: 2,
            filterOptions,
            limit,
            offset
          };
        }
        this.reportPageRef.getReportList(type, itemData);
        break;
      case 'new':
        let actionType = '';
        if(this.newReport) {
          actionType = 'report';
        }
        if(this.newSection) {
          actionType = 'section';
        }
        if(this.newDiagnostic) {
          actionType = 'diagnostic';
        }
        if(this.newAdas) {
          actionType = 'adas';
        }
        this.createAction(actionType)
        break;  
    }
    
  }

  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    let typeId = this.reportPageRef.typeInfo.rcId;
    let type = '';
    let filterFlag = false;
    let resetFlag = filterData.reset;
    let filterName = '';
    let filterOptions:any = {};
    let reportFilterFields: any = [];
    let limit, offset, reportId, reportTypeId, reportContentTypeId, itemData;
    if(this.sectionFlag || this.diagnosticFlag || this.adasFlag) {
      //this.reportPageRef.loading = true;
      this.reportPageRef.reportInfo.callback = true;
      this.reportPageRef.typeInfo.callback = true;
      switch(typeId) {
        case 1:
          type = 'section';
          this.reportPageRef.sectionTotal = 0;
          this.reportPageRef.sectionOffset = 0;
          this.reportPageRef.sectionItems = [];
          limit = this.reportPageRef.sectionLimit;
          offset = this.reportPageRef.sectionOffset;
          return false;
          break;
        case 2:
          type = 'diagnostic';
          this.reportPageRef.diagnosticTotal = 0;
          this.reportPageRef.diagnosticOffset = 0;
          this.reportPageRef.diagnosticItems = [];
          limit = this.reportPageRef.diagnosticLimit;
          offset = this.reportPageRef.diagnosticOffset;
          break;
        case 3:
          filterFlag = true;
          this.filterCall = resetFlag;
          filterName = filterNames.reportAdas;
          type = 'adas';
          reportFilterFields = localStorage.getItem(filterFields.reportAdas);
          reportFilterFields = (reportFilterFields) ? JSON.parse(reportFilterFields) : [];
          if(!resetFlag) {
            Object.entries(filterData).forEach((item, index) => {
              let key = item[0];
              let val:any = item[1];
              let findex = reportFilterFields.findIndex(option => option.name == key);
              console.log(key, findex)
              if(findex < 0) {
                delete filterData[key];
              } else {
                let selection = reportFilterFields[findex].selection;
                switch(selection) {
                  case 'single':
                    val = val.toString();
                    filterData[key] = val;
                    break;  
                }
              }
            });
            this.reportPageRef.adasFilterOptions = filterData;
            filterOptions = this.reportPageRef.adasFilterOptions;
          }
          this.reportPageRef.adasTotal = 0;
          this.reportPageRef.adasOffset = 0;
          this.reportPageRef.adasItems = [];
          limit = this.reportPageRef.adasLimit;
          offset = this.reportPageRef.adasOffset;
          break;    
      }
      if(filterFlag) {
        reportId = this.reportPageRef.reportId;
        reportTypeId = this.reportPageRef.typeInfo.id;
        reportContentTypeId = this.reportPageRef.typeInfo.rcId;
        this.reportPageRef.adasFilterOptions = this.reportPageRef.adasFilterOptions;
        let clearItems = [];
        if(resetFlag) {
          reportFilterFields.forEach(item => {
            let name = item.name;
            let selection = item.selection;
            let val:any = (selection == 'single') ? '' : [];
            clearItems.push(name);
          });
          Object.entries(filterData).forEach((item, index) => {
            let key = item[0];
            let val:any = item[1];
            let findex = reportFilterFields.findIndex(option => option.name == key);
            console.log(key, findex)
            if(findex < 0) {
              delete filterData[key];
            } else {
              let selection = reportFilterFields[findex].selection;
              switch(selection) {
                case 'single':
                  val = '';
                  break;
                default:
                  val = [];
                  break;    
              }
              filterData[key] = val;
            }            
          });
          this.clearFilters(filterData);
          console.log(filterData)
          this.reportPageRef.adasFilterOptions = filterData;
          filterOptions = this.reportPageRef.adasFilterOptions;
          //let reportFilter = localStorage.getItem(filterNames.reportAdas);
          //this.commonApi.clearFilterValues(reportFilter,clearItems);
        }
        localStorage.setItem(filterNames.reportAdas, JSON.stringify(filterOptions));
        itemData = {
          reportId,
          reportTypeId,
          reportContentTypeId,
          view: 2,
          filterOptions: JSON.stringify(filterOptions),
          limit,
          offset,
        };
        this.reportPageRef.getReportList(type, itemData);  
      }
    }    
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
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

  reportCallback(data) {
    let wsId = (Array.isArray(this.reportPageRef.wsId)) ? this.reportPageRef.wsId[0] : this.reportPageRef.wsId;
    console.log(data, wsId)
    if(data.initAction) {
      this.selectedWs = (wsId == null || wsId == '' || wsId == 0) ? this.wsList[0].id : parseInt(this.reportPageRef.wsId);
      this.reportPageRef.seletedWs = this.selectedWs;
      this.productHeaderRef.reportWs = this.selectedWs;
    }
    let searchApi = false;
    let flag = true;
    this.lastUploaded = '';
    this.newReport = data.reportFlag;
    this.newSection = data.sectionFlag;
    this.newDiagnostic = data.diagnosticFlag;
    this.newAdas = data.adasFlag;
    this.reportFlag = data.reportFlag;
    this.typeFlag = data.typeFlag;
    this.sectionFlag = data.sectionFlag;
    this.diagnosticFlag = data.diagnosticFlag;
    this.adasFlag = data.adasFlag;
    this.recallFlag = data.recallFlag;
    if(this.newReport) {
      this.newReport = (this.createAccess) ? true : false;
    }
    if(this.newSection) {
      this.newSection = (this.createAccess) ? true : false;
    }
    if(this.newDiagnostic) {
      this.newDiagnostic = (this.createAccess) ? true : false;
    }
    if(this.newAdas) {
      this.newAdas = (this.createAccess) ? true : false;
    }
    this.productHeaderRef.newButtonEnable = this.createAccess;
    this.productHeaderRef.defaultNewButton = this.createAccess;
    this.productHeaderRef.newReport = this.newReport;
    this.typeId = (this.newSection) ? data.typeInfo.id : 0;
    this.wsList = this.reportPageRef.workstreamItems;
    let filterFlag = false;
    if(this.reportPageRef.typeFlag) {
      this.productHeaderRef.newReport = !flag;
      this.groupId = FilterGroups.Report;
    }
    if(this.reportFlag) {
      this.productHeaderRef.newReportTxt = this.reportNew;
      this.groupId = FilterGroups.Report;
    }
    if(this.sectionFlag) {
      this.groupId = FilterGroups.Report;
      filterFlag = true;
      this.downloadFlag = !data.sectionItemEmpty;
      this.productHeaderRef.newReport = flag;
      this.productHeaderRef.newReportTxt = this.sectionNew;
    }
    if(this.diagnosticFlag) {
      this.groupId = FilterGroups.Report;
      filterFlag = true;
      this.downloadFlag = !data.diagnosticItemEmpty;
      let lastUpload = (!data.diagnosticItemEmpty) ? data.moduleLastUpload : '';
      this.lastUploaded = lastUpload;
      this.productHeaderRef.newReport = flag;
      this.productHeaderRef.newReportTxt = this.moduleNew;
    }
    if(this.adasFlag) {
      this.groupId = FilterGroups.ReportAdas;
      filterFlag = (this.reportPageRef.adasOffset == 0) ? true : false;
      this.downloadFlag = !data.adasItemEmpty;
      let lastUpload = (!data.adasItemEmpty) ? data.adasLastUpload : '';
      this.lastUploaded = lastUpload;
      this.productHeaderRef.newReport = flag;
      this.productHeaderRef.newReportTxt = this.vehicleNew;
    }
    if(!this.productHeaderRef.searchFlag) {
      this.productHeaderRef.initSearch();
    }
    this.productHeaderRef.searchFlag = this.reportPageRef.recallFlag ? false : true;
    this.productHeaderRef.searchReadonlyFlag = false;
    this.filterOptions['groupId'] = this.groupId;
    if(filterFlag && this.filterCall) {
      this.filterOptions['filterLoading'] = true;
      setTimeout(() => {
        this.getFilters('callback');  
      }, 250); 
    } else {
      setTimeout(() => {
        this.filterCall = true;
      }, 500);
    }
  }

  createAction(action) {
    let typeId;
    switch(action) {
      case 'report':
        let swid = parseInt(this.selectedWs);
        this.reportPageRef.wsId = [swid]
        this.reportPageRef.addReport();
        break;
      case 'section':
        typeId = this.reportPageRef.typeInfo.id;
        this.reportPageRef.addSection(typeId);
        break;
      case 'diagnostic':
        typeId = this.reportPageRef.typeInfo.id;
        this.reportPageRef.addDiagnostic(typeId);
        break;
      case 'adas':
        //typeId = this.reportPageRef.typeInfo.id;
        //this.reportPageRef.addVehicle(typeId);
        break;    
    }
  }

  download(action) {
    let actionFlag = false;
    this.authenticationService.checkAccess(this.contentTypeId, 'Create',true,true);
    setTimeout(() => {
      actionFlag = this.reportPageRef.checkReportAccess();
      if(actionFlag) {
        let pageAccess;
        let reportName = this.reportPageRef.reportInfo.name;
        let reportId = this.reportPageRef.reportInfo.id;
        let typeId = this.reportPageRef.typeInfo.id;
        let info =  'Sheet1';
        pageAccess = action;
        let apiData = {
          apikey: Constant.ApiKey,
          domainId: this.domainId,
          userId: this.userId,
          reportId: reportId,
          reportTypeId: typeId,
          view: 4,
          fileName: reportName
        };
        const modalRef = this.modalService.open(ExportPopupComponent, this.config);
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.exportInfo = info;
        modalRef.componentInstance.exportData = this.empty;
        modalRef.componentInstance.access = pageAccess;
        modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
          console.log(receivedService)
          if (receivedService == 1) {
            modalRef.dismiss('Cross click');
          }
        });
      }
    }, 500);
  }

  onUpload(access, event) {
    this.filesArr = event;
    let file = event.currentFiles[0];
    console.log(event, file)
    let uploadFlag = (event.currentFiles.length > 0) ? true : false;
    if(uploadFlag) {
      let deleteFlag:any = 0;
      let popupFlag = true;
      switch (access) {
        case 'module':
          popupFlag = this.reportPageRef.diagnosticTotal > 0 ? true : false;
          break;
        case 'section':
          popupFlag = this.reportPageRef.sectionTotal > 0 ? true : false;
          break;
        case 'adas':
          popupFlag = this.reportPageRef.adasTotal > 0 ? true : false; 
          break;
      }
      
      if(popupFlag) {
        let uaccess = access.charAt(0).toUpperCase() + access.slice(1);
        let uploadAccess = `Upload ${uaccess}`;
        let actionInfo = {fileName: file.name};
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = uploadAccess;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
          console.log(receivedService)
          let uploadFileFlag = receivedService.flag;
          modalRef.dismiss('Cross click'); 
          deleteFlag = (receivedService.deleteFlag) ? 1 : 0;
          if(uploadFileFlag) {
            this.importData(access, file, deleteFlag);
          }        
        });
      } else {
        this.importData(access, file, deleteFlag);
      }      
    } else {
      this.successMsg = "Invalid File Format";
      const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
      msgModalRef.componentInstance.successMessage = this.successMsg;
      msgModalRef.componentInstance.statusFlag = false;
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.successMsg = this.uploadTxt;
      }, 3000);
    }
  }
  
  importData(access, file, deleteFlag) {
    let fileExtn = file.name.split('.').pop();
    file.thumbFilePath = `${this.mediaPath}/xls-medium.png`;
    file.fileSize = this.commonApi.niceBytes(file.size);
    this.attachments.push(file);
    this.attachmentProgress = true
    let typeId = this.reportPageRef.typeInfo.id;
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      action: 'import',
      type: access,
      typeId: typeId,
      deleteFlag: deleteFlag
    };
    let totalTemp = 0;
    return new Promise<void>((resolve, reject) => {
      this.uploadService.upload(access, apiData, file).subscribe((event: HttpEvent<any>) => {
        console.log(event);
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            let progress = Math.round(100 * event.loaded / event.total);
            this.progress = progress;
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            totalTemp = this.loadedSoFar;
            this.percentDone = 100;
            this.progress = this.percentDone;
            console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
            let resBody = event.body;
            resolve();
            let status = resBody.status;
            const result = resBody.data;
            const total = parseInt(result.total);
            let items:any = result.items;
            const uploadedId = result.uploadedId;
            const deletedId = result.deletedId;
            let timeout = (status == 'Failure') ? 0 : 3000;
            setTimeout(() => {
              this.attachmentProgress = false;
              this.progress = 0;
              this.attachments = [];
              if(status == "Failure") {
                this.successMsg = resBody.message;
                const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
                msgModalRef.componentInstance.successMessage = this.successMsg;
                msgModalRef.componentInstance.statusFlag = false;
                setTimeout(() => {
                  msgModalRef.dismiss('Cross click');
                  this.successMsg = this.uploadTxt;
                }, 3000);            
              } else {
                this.downloadFlag = true;
                let reportId = this.reportPageRef.reportInfo.id;
                let typeId = this.reportPageRef.typeInfo.id;
                let rctId = this.reportPageRef.typeInfo.rcId;
                let solrUpdate = {
                  action: 'bulk-create-section',
                  domainId: this.domainId,
                  userId: this.userId,
                  reportId: reportId,
                  typeId: typeId,
                  reportContentTypeId: rctId,
                  sectionList: uploadedId
                };
                let solrDelete = {
                  action: 'bulk-delete-section',
                  domainId: this.domainId,
                  userId: this.userId,
                  reportId: reportId,
                  typeId: typeId,
                  reportContentTypeId: rctId,
                  sectionList: deletedId
                };
                let itemLen;
                let insertFlag;
                switch (access) {
                  case 'module':
                    this.reportPageRef.diagnosticItems = (deletedId.length > 0) ? [] : this.reportPageRef.diagnosticItems;
                    this.reportPageRef.diagnosticTotal = (deletedId.length > 0) ? 0 : this.reportPageRef.diagnosticTotal;
                    this.reportPageRef.diagnosticOffset = (deletedId.length > 0) ? 0 : this.reportPageRef.diagnosticOffset;
                    let diagTotal = this.reportPageRef.diagnosticTotal;
                    itemLen = this.reportPageRef.diagnosticItems.length;
                    insertFlag = (diagTotal == 0 || diagTotal >= itemLen || deletedId.length > 0) ? true : false;
                    if(insertFlag) {
                      this.reportPageRef.diagnosticOffset = 0;
                      const data = {
                        reportId: reportId,
                        reportTypeId: typeId,
                        reportContentTypeId: rctId,
                        view: 2,
                        offset: 0,
                        limit: this.reportPageRef.diagnosticLimit
                      };
                      this.reportPageRef.getReportList('diagnostic', data);
                    } else {
                      items.forEach(item => {
                        let mid = item.id;
                        let ditem = this.reportPageRef.diagnosticItems;
                        let mindex = ditem.findIndex(option => option.id == mid);
                        if(mindex >= 0) {
                          //item.isSelected = (ditem[mindex].isSelected) ? ditem[mindex].isSelected : item.selected;
                          item.isSelected = false;
                          ditem[mindex] = item;
                        }                      
                      });
                    }

                    if(deletedId.length == 0 && diagTotal > 0 && this.reportPageRef.diagnosticOffset > this.reportPageRef.diagnosticLimit) {
                      const data = {
                        reportId: reportId,
                        reportTypeId: typeId,
                        reportContentTypeId: rctId,
                        view: 2,
                        offset: 0,
                        limit: this.reportPageRef.diagnosticOffset
                      };
                      this.reportPageRef.getReportList('diagnostic', data, 'reload');
                    }

                    if(this.reportPageRef.diagnosticItemEmpty && items.length > 0) {
                      this.reportPageRef.diagnosticItemEmpty = false; 
                    }
                    this.reportPageRef.diagnosticTotal = total;
                    break;
                  case 'adas':
                    this.reportPageRef.adasItems = (deletedId.length > 0) ? [] : this.reportPageRef.adasItems;
                    this.reportPageRef.adasTotal = (deletedId.length > 0) ? 0 : this.reportPageRef.adasTotal;
                    this.reportPageRef.adasOffset = (deletedId.length > 0) ? 0 : this.reportPageRef.adasOffset;
                    let adasTotal = this.reportPageRef.adasTotal;
                    itemLen = this.reportPageRef.adasItems.length;
                    insertFlag = (adasTotal == 0 || adasTotal >= itemLen || deletedId.length > 0) ? true : false;
                    if(insertFlag) {
                      this.reportPageRef.adasItems = [];
                      this.reportPageRef.adasOffset = 0;
                      const data = {
                        reportId: reportId,
                        reportTypeId: typeId,
                        reportContentTypeId: rctId,
                        view: 2,
                        offset: 0,
                        limit: this.reportPageRef.adasLimit
                      };
                      this.reportPageRef.getReportList('adas', data);
                    } else {
                      items.forEach(item => {
                        let aid = item.id;
                        let aitem = this.reportPageRef.adasItems;
                        let aindex = aitem.findIndex(option => option.id == aid);
                        if(aindex >= 0) {
                          //item.isSelected = (ditem[mindex].isSelected) ? ditem[mindex].isSelected : item.selected;
                          item.isSelected = false;
                          aitem[aindex] = item;
                        }                      
                      });
                    }

                    if(deletedId.length == 0 && adasTotal > 0 && this.reportPageRef.adasOffset > this.reportPageRef.adasLimit) {
                      const data = {
                        reportId: reportId,
                        reportTypeId: typeId,
                        reportContentTypeId: rctId,
                        view: 2,
                        offset: 0,
                        limit: this.reportPageRef.adasOffset
                      };
                      this.reportPageRef.getReportList('adas', data, 'reload');
                    }

                    if(this.reportPageRef.adasItemEmpty && items.length > 0) {
                      this.reportPageRef.adasItemEmpty = false; 
                    }
                    this.reportPageRef.adasTotal = total;
                    break;
                }
                      
                
                this.successMsg = resBody.message;
                const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
                msgModalRef.componentInstance.successMessage = this.successMsg;
                setTimeout(() => {
                  msgModalRef.dismiss('Cross click');
                  this.successMsg = this.uploadTxt;
                  this.reportPageRef.solrUpdate(solrUpdate);
                  if(deletedId.length > 0) {
                    this.reportPageRef.solrUpdate(solrDelete);
                  }
                }, 3000);
              }                
            }, timeout);
            break;
        }
      },
      err => {
        this.attachments = [];
        this.attachmentProgress = false;
        this.progress = 0;      
      });
    });
  }

  fieldChange(field, val) {
    console.log(field, val);
    switch (field) {
      case 'ws':
        let wsItems = this.reportPageRef.workstreamItems;
        let wsi = wsItems.findIndex(option => option.id == val);
        this.reportPageRef.wsName = wsItems[wsi].name;
        this.selectedWs = parseInt(val);
        this.reportPageRef.seletedWs = this.selectedWs;
        this.reportPageRef.wsId = [this.selectedWs];
        this.productHeaderRef.reportWs = this.selectedWs;
        if(this.reportFlag) {
          let type = 'report';
          this.reportPageRef.reportTotal = 0;
          this.reportPageRef.reportOffset = 0;
          this.reportPageRef.reportItems = [];
          let itemData = {
            view: 0,
            limit: this.reportPageRef.reportLimit,
            offset: this.reportPageRef.reportOffset
          };
          this.reportPageRef.loading = true;
          setTimeout(() => {
            this.reportPageRef.getReportList(type, itemData);  
          }, 500);                  
        }        
        break;
    
      default:
        break;
    }
  }

  clearFilters(filterData) {
    let empty = [];
    Object.entries(filterData).forEach((item, index) => {
      let key = item[0];
      let val:any = item[1];
      console.log(this.reportPageRef.adasFilterOptions, key, val)
      switch (key) {
        case 'make':
          this.filterRef.make = val;
          break;
        case 'model':
          this.filterRef.filteredModels = val;
          this.filterRef.models = val;
          break;
        case 'year':
          this.filterRef.filteredYears = val;
          break;  
      }            
    });
    this.filterRef.storedWorkstreams = empty;
    this.filterRef.storedModels = empty;
    this.filterRef.activeFilter = false;
  }

  headerCallback(data) {}

  filterCallback(data) {
    console.log(data)
    let action = data.actionFilter;
    switch(action) {
      case 'filter':
        this.filterRef.activeFilter = true;
        let getFilteredValues = JSON.parse(
          localStorage.getItem(filterNames.reportAdas)
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
        /* this.filterRef.storedWorkstreams = [];
        this.filterRef.storedModels = [];
        this.filterRef.storedYears = [];
        this.filterRef.activeFilter = false; */
        break;  
    }
  }
}
