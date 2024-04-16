import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import * as moment from 'moment';
import { LeaderboardService } from 'src/app/services/leaderboard.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UserActivitiesService } from 'src/app/services/user-activities.service';


@Component({
  selector: 'app-dash-filter',
  templateUrl: './dash-filter.component.html',
  styleUrls: ['./dash-filter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class DashFilterComponent implements OnInit {
  @Input() filterOptions;
  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() filterAction: EventEmitter<any> = new EventEmitter();

  public expandFlag: boolean = true;
  public dashImgPath = "assets/images/dashboard/";
  public filterHeight: number;

  public apiData: any;
  public activeFilter: boolean;
  public workstreamWidget: boolean = false;
  public userTypeWidget: boolean = false;
  public yearWidget: boolean = false;
  public monthWidget: boolean = false;
  public timeDurationWidget: boolean = false;
  public startDateWidget: boolean = false;
  public endDateWidget: boolean = false;
  public geoGraphWidget: boolean = false;
  public platformId = localStorage.getItem('platformId');
  public searchDealerWidget: boolean = false;
  public statusWidget: boolean = false;
  public searchModelWidget: boolean = false;
  public searchUserWidget: boolean = false;
  public resetFlag: boolean = false;
  public splitIcon: boolean = false;

  public workstreamId: number;
  public userTypeId: number;
  public yearId: number;
  public monthId: number;
  public timeDurationId: number;
  public startDateId: number;
  public endDateId: number;
  public geoGraphId: number;
  public zoneId: any;
  public areaId: any;
  public stateId: any;
  public territoryId: any;
  public townId: any;
  public searchDealerId: number;
  public statusId: number;
  public searchModelId: number;
  public searchUserId: number;

  public filterLoading: boolean;
  public initFlag: boolean = true;

  public workstreams: any;
  public storedWorkstreams = [];
  public filteredWorkstreams = [];

  public userTypeValue;
  public userTypeValueName;
  public userTypes: any;
  public filteredUserTypes = [];

  public filterYearValue;
  public filterYears = [];

  public today = moment().format();
  public startOfMonth = moment().subtract(30, 'days').format();

  public currYear: any = moment().format('Y');
  public currMonth: string = moment().format('MM');
  public currMonthName: string = moment().format('MMMM');
  public months: any;
  public filterMonthValue = this.currMonth;
  public filterMonthName = this.currMonthName;
  public filterMonths = [];

  public thumbLabel: boolean = true;
  public durationValue: number = 0;
  public minDuration: number = 1;
  public maxDuration: number = 60;

  public statusValue: number = 0;
  public statusValueName: string = '';
  public status = [];

  public startDateValue = '';
  public endDateValue = '';

  public zoneValue = '';
  public zones = [{ 'option': 'Select Zones', 'val': '' }];
  public areaValue = '';
  public areas = [{ 'option': 'Select Areas', 'val': '' }];
  public stateDisable: boolean = true;
  public stateValue = '';
  public states = [];
  public territoryValue = '';
  public territories = [{ 'option': 'Select Territories', 'val': '' }];
  public townValue = '';
  public towns = [{ 'option': 'Select Towns', 'val': '' }];

  public geoZone: boolean = false;
  public geoArea: boolean = false;
  public geoTerritory: boolean = false;
  public geoTown: boolean = false;

  public geoAreaFilter: boolean = true;
  public geoTerFilter: boolean = true;
  public geoTownFilter: boolean = true;

  public dealers: any;
  public dealerValue = '';
  public filteredDealers = [""];
  public selectedDealerLists = [""];
  public dealerFilter: boolean = true;

  public models: any;
  public modelValue = '';
  public filteredModels = [""];

  public users: any;
  public userValue = '';
  public filteredUsers = [""];
  public userFilter: boolean = true;

  public filteredData = {};
  public disableFilterAction: boolean = false;
  public dateErrorFlag: boolean = this.disableFilterAction;
  public sortByWidget: boolean = false;
  public sortById: number;
  public sortBy: any;
  public filteredsortBy: any;
  public sortByValue: any;

  durationFormatLabel(value: number | null) {
    if (!value || value == 0) {
      return 0;
    }
    let duration;

    switch (true) {
      case (value < 15):
        duration = Math.round((value / 7));
        let weekTxt = (duration >= 2) ? ' Weeks' : ' Week';
        return duration + weekTxt;
        break;
      default:
        duration = Math.round((value / 30));
        let monthTxt = (duration >= 2) ? ' Months' : ' Month';
        return duration + monthTxt;
        break;
    }
  }

  constructor(
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private dashboardApi: DashboardService,
    private leaderboardApi: LeaderboardService,
    private userActiviesApi: UserActivitiesService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    this.filterLoading = this.filterOptions.filterLoading;

    if (!this.filterLoading) {
      this.apiData = {
        'apiKey': this.filterOptions['apiKey'],
        'userId': this.filterOptions['userId'],
        'domainId': this.filterOptions['domainId'],
        'countryId': this.filterOptions['countryId']
      };

      this.filterHeight = this.filterOptions['filterHeight'] - 80;
      this.activeFilter = this.filterOptions.filterActive;

      let access = this.filterOptions.page;
      let getFilteredValues;
      switch (access) {
        case 'summary':
          getFilteredValues = JSON.parse(localStorage.getItem('dashFilter'));
          break;
        case 'dealerUsage':
          getFilteredValues = JSON.parse(localStorage.getItem('dealerFilter'));
          break;
        case 'escModel':
          getFilteredValues = JSON.parse(localStorage.getItem('escModelFilter'));
          break;
        case 'escZone':
          getFilteredValues = JSON.parse(localStorage.getItem('escZoneFilter'));
          break;
        case 'threads':
          getFilteredValues = JSON.parse(localStorage.getItem('threadFilter'));
          break;
        case 'serviceProbing':
          getFilteredValues = JSON.parse(localStorage.getItem('serviceFilter'));
          break;
        case 'zoneMetrics':
          getFilteredValues = JSON.parse(localStorage.getItem('zoneMetricsFilter'));
          break;
        case 'areaMetrics':
          getFilteredValues = JSON.parse(localStorage.getItem('areaActivityFilter'));
          break;
        case 'userMetrics':
          getFilteredValues = JSON.parse(localStorage.getItem('userActivityFilter'));
          break;
        case 'leaderboard':
        case 'techsupport':
          this.startOfMonth = this.leaderboardApi.startDate;
          this.endDateValue = this.leaderboardApi.endDate;
          break;
        case 'user-activities':
          this.startOfMonth = this.userActiviesApi.startDate;
          this.endDateValue = this.userActiviesApi.endDate;
          this.sortByValue = this.userActiviesApi.sortBy;
          break;
      }
      let options = this.filterOptions.filterData;
      setTimeout(() => {
        for (let opt of options) {
          let wid = parseInt(opt.id);
          switch (wid) {
            case 1:
              this.workstreamWidget = true;
              this.workstreamId = wid;
              this.workstreams = opt.valueArray;
              this.filteredData['workstream'] = [opt.valueArray[0].workstreamId];
              if (getFilteredValues != null) {
                this.filteredData['workstream'] = (getFilteredValues.workstream == undefined || getFilteredValues.workstream == 'undefined') ? this.filteredData['workstream'] : getFilteredValues.workstream;
              }
              this.filteredWorkstreams = this.filteredData['workstream'];
              break;
            case 2:
              this.userTypeWidget = true;
              this.userTypeId = wid;
              this.userTypeValue = opt.valueArray[0].id;
              if (getFilteredValues != null) {
                this.userTypeValue = (getFilteredValues.userType == undefined || getFilteredValues.userType == 'undefined') ? this.userTypeValue : getFilteredValues.userType[0];
                console.log(this.userTypeValue)
              }
              this.userTypes = opt.valueArray;
              for (let ut of this.userTypes) {
                if (ut.id == this.userTypeValue) {
                  this.userTypeValueName = ut.name;
                }
              }
              this.filteredData['userType'] = [this.userTypeValue];
              break;
            case 3:
              this.yearWidget = true;
              this.yearId = wid;
              this.filterYearValue = opt.valueArray[0].year;
              if (getFilteredValues != null) {
                this.filterYearValue = (getFilteredValues.year == undefined || getFilteredValues.year == 'undefined') ? this.filterYearValue : getFilteredValues.year;
              }
              this.filteredData['year'] = this.filterYearValue;
              for (let year of opt.valueArray) {
                this.filterYears.push(year.year);
              }
              break;
            case 4:
              this.monthWidget = true;
              this.monthId = wid;
              this.getMonthList();
              break;
            case 5:
              /*this.timeDurationWidget = true;
              this.timeDurationId = wid;*/
              break;
            case 6:
              this.startDateWidget = true;
              this.startDateId = wid;
              if (opt.value != 'undefined' && opt.value != undefined) {
                this.startDateValue = moment(opt.value).format();
                this.filteredData['startDate'] = opt.value;
                console.log(this.filteredData['startDate']);
              } else {
                this.startDateValue =moment(new Date()).subtract(30, 'days').format();
                //this.filteredData['startDate'] = moment().startOf('month').subtract(30, 'days').format('YYYY-MM-DD');
                this.filteredData['startDate'] = moment(new Date()).add(-1, 'months').format('YYYY-MM-DD');
                console.log("this.filteredData: ", this.filteredData);
              }
              break;
            case 7:
              this.geoGraphWidget = true;
              this.zoneId = 7.1;
              this.areaId = 7.2;
              //this.stateId = 7.3;
              this.territoryId = 7.4;
              //this.townId = 7.5;
              this.zoneValue = opt.zone;
              this.filteredData['zone'] = this.zoneValue;
              this.areaValue = opt.area;
              this.filteredData['area'] = this.areaValue;
              //this.filteredData['state'] = "";
              this.territoryValue = opt.territory;
              this.filteredData['territory'] = this.territoryValue;
              //this.townValue = opt.town;
              //this.filteredData['town'] = this.townValue;
              break;
            case 8:
              let dealerListData = this.filterOptions['dealerList'];
              this.dealerValue = opt.value;
              if (getFilteredValues != null) {
                this.dealerValue = (getFilteredValues.dealerCode == undefined || getFilteredValues.dealerCode == 'undefined') ? this.dealerValue : getFilteredValues.dealerCode;
              }
              this.filteredData['dealerCode'] = this.dealerValue;
              this.filteredDealers = this.filteredData['dealerCode'];
              //let dlist = [{'dealerName': 'All Users', 'dealerCode': ''}];
              let dlist = [];
              for (let d of dealerListData) {
                let code = d.dealerCode;
                let name = d.dealerName;
                dlist.push({
                  'dealerName': code + ' - ' + name,
                  'dealerCode': code
                });
              }
              this.dealers = dlist;
              this.searchDealerWidget = true;
              this.searchDealerId = wid;
              break;
            case 9:
              this.statusId = wid;
              this.statusValue = (opt.status == "") ? 0 : opt.status;
              this.filteredData['status'] = this.statusValue;
              this.status = opt.valueArray;
              for (let st of this.status) {
                if (st.id == this.statusValue) {
                  this.statusValueName = st.name;
                }
              }
              this.statusWidget = true;
              break;
            case 10:
              this.endDateWidget = true;
              this.endDateId = wid;
              if (!opt.value && (this.filterOptions.page == 'leaderboard' || this.filterOptions.page == 'techsupport')) {
                opt.value = this.leaderboardApi.endDate;
              }
              if (!opt.value && this.filterOptions.page == 'user-activities') {
                opt.value = this.userActiviesApi.endDate;
              }
              this.endDateValue = moment(opt.value).format();
              this.filteredData['endDate'] = opt.value;
              let sdate = moment(this.startDateValue).format();
              let edate = moment(this.endDateValue).format();
              let res = moment(edate).diff(moment(sdate), 'days', true);
              this.durationValue = (res > 60) ? 0 : res;
              break;
            case 11:
              console.log(getFilteredValues);
              let escModelListData = this.filterOptions['modelList'];
              this.searchModelId = wid;
              this.modelValue = opt.valueArray;
              this.filteredData['models'] = [];
              let mlist = [];
              for (let m of escModelListData) {
                mlist.push({
                  'id': m.name,
                  'name': m.name
                });
              }
              this.models = mlist;
              console.log(getFilteredValues.models);
              if (getFilteredValues != null) {
                this.modelValue = (getFilteredValues.models == '' || getFilteredValues.models == undefined || getFilteredValues.models == 'undefined') ? this.modelValue : getFilteredValues.model;
              }
              console.log(this.modelValue);
              this.filteredData['models'] = this.modelValue;

              if (this.filteredData['models'].length > 0) {
                for (let m of this.filteredData['models']) {
                  this.filteredModels.push(m);
                }
              }

              this.searchModelWidget = true;
              break;
            case 13:
              let userListData = this.filterOptions['userList'];
              this.searchUserId = wid;
              this.userValue = opt.userId;
              if (getFilteredValues != null) {
                this.userValue = (getFilteredValues.userId == undefined || getFilteredValues.userId == 'undefined') ? this.userValue : getFilteredValues.userId;
              }
              this.filteredData['userId'] = this.userValue;
              this.filteredUsers = this.filteredData['userId'];
              //let userList = [{'userName': 'All Users', 'userId': ''}];
              let userList = [];
              for (let u of userListData) {
                let uid = u.user_id;
                let name = u.stagename;
                userList.push({
                  'userName': name,
                  'userId': uid
                });
              }
              this.users = userList;
              this.searchUserWidget = true;
              break;
            case 17:
              this.sortByWidget = true;
              this.sortById = wid;
              this.sortByValue = opt.valueArray[0].id
              this.filteredData['sortBy'] = opt.valueArray[0].id;
              this.sortBy = opt.valueArray;
              this.filteredsortBy = this.filteredData['sortBy'];
              break;
          }
        }

        if (this.geoGraphWidget) {
          let geoApiData = this.apiData;
          if (this.zoneValue != '' && this.areaValue != '' && this.territoryValue != '') {
            this.geoZone = true;
            this.geoArea = true;
            this.geoTerritory = true;
            //this.geoTown = true;
            geoApiData['zoneValue'] = this.zoneValue;
            geoApiData['areaValue'] = this.areaValue;
            geoApiData['territoryValue'] = this.territoryValue;
          } else if (this.zoneValue != '' && this.areaValue != '') {
            this.geoZone = true;
            this.geoArea = true;
            geoApiData['zoneValue'] = this.zoneValue;
            geoApiData['areaValue'] = this.areaValue;
            geoApiData['territoryValue'] = "";
          } else {
            this.geoZone = true;
            geoApiData['zoneValue'] = this.zoneValue;
            geoApiData['areaValue'] = "";
            geoApiData['territoryValue'] = "";
          }

          this.getGeoGraphicalData('init', geoApiData);
        }
      }, 800);
    }
  }

  // Get Month List
  getMonthList() {
    let getFilteredValues = JSON.parse(localStorage.getItem('dashFilter'));
    let m = moment();
    let monthList = [];
    monthList.push({
      id: 0,
      name: 'All'
    });
    for (let i = 0; i < 12; i++) {
      let id = m.months(i).format('MM');
      let name = m.months(i).format('MMMM');
      monthList.push({
        id: id,
        name: name
      });
    }
    this.months = monthList;
    this.filterMonthValue = this.filterMonthValue;
    if (getFilteredValues != null) {
      this.filterMonthValue = (getFilteredValues.month == undefined || getFilteredValues.month == 'undefined') ? this.filterMonthValue : getFilteredValues.month;
    }
    this.filteredData['month'] = this.filterMonthValue;
    const number = (parseInt(this.filterMonthValue) < 1) ? 0 : parseInt(this.filterMonthValue) - 1; // 0 = Jan & 11 = Dec
    this.filterMonthName = moment().month(number).format("MMMM"); // Feb

  }

  // Filtered Workstreams
  /*selectedWorkstreams(items) {
    this.filteredWorkstreams = items;
    this.filteredData['workstream'] = items;
  }*/
  selectedWorkstreams(list) {
    console.log(list)
    let items = list.items;
    let flag = (JSON.stringify(this.storedWorkstreams) == JSON.stringify(items)) ? false : !list.init;
    flag = (items.length == 0 && this.storedWorkstreams.length > 0) ? true : flag;
    this.filteredWorkstreams = items;
    this.filteredData['workstream'] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }

  // Filtered User Types
  selectedUserTypes(items) {
    this.filteredUserTypes = items;
  }

  // Get Geograhical Data
  getGeoGraphicalData(action, apiData) {
    this.dashboardApi.geoGraphicalData(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let resData = response.data;
        switch (action) {
          case 'init':
            if (this.geoZone) {
              let zone = resData.zoneContent;
              this.setZoneList(zone);
            }
            if (this.geoArea) {
              let area = resData.areaContent;
              if (area.length == 0) {
                this.areas = [{ 'option': 'Select Areas', 'val': '' }];
                this.geoAreaFilter = true;
              } else {
                this.setAreaList(area);
              }
            }
            if (this.geoTerritory) {
              this.territories = [];
              let territory = resData.territoryContent;
              if (territory.length == 0) {
                this.territories = [{ 'option': 'Select Territories', 'val': '' }]
                this.geoTerFilter = true;
              } else {
                this.setTerritoryList(territory);
              }
            }
            if (this.geoTown) {
              /*let town = resData.townContent;
              if(town.length == 0) {
                this.towns = [{'option' : 'Select Towns', 'val' : ''}];
                this.geoTownFilter = true;
              } else {
                this.setTownList(town);
              }*/
            }
            break;
          case 'zone':
            let area = resData.areaContent;
            if (this.zoneValue == "" || area.length == 0) {
              this.areas = [];
              this.territories = [];
              this.towns = [];

              this.areaValue = "";
              this.territoryValue = "";
              this.townValue = "";

              this.areas = [{ 'option': 'Select Areas', 'val': '' }];
              this.territories = [{ 'option': 'Select Territories', 'val': '' }];
              //this.towns = [{'option' : 'Select Towns', 'val' : ''}];

              this.filteredData['area'] = this.areaValue;
              this.filteredData['territory'] = this.territoryValue;
              //this.filteredData['town'] = this.townValue;
              this.geoAreaFilter = true;
              this.geoTerFilter = true;
              //this.geoTownFilter = true;
            } else {
              this.setAreaList(area);
            }
            break;
          case 'area':
            this.territories = [];
            this.territoryValue = "";
            this.townValue = "";

            let territory = resData.territoryContent;
            if (territory.length == 0) {
              this.towns = [];
              this.territories = [{ 'option': 'Select Territories', 'val': '' }];
              //this.towns = [{'option' : 'Selcet Towns', 'val' : ''}];
              this.filteredData['territory'] = this.territoryValue;
              this.filteredData['town'] = this.townValue;
              this.geoTerFilter = true;
              //this.geoTownFilter = true;
            } else {
              this.territories = [{ 'option': 'Select Territories', 'val': '' }];
              this.setTerritoryList(territory);
            }
            break;
          case 'territory':
            /*this.towns = [];
            this.townValue = "";
            let town = resData.townContent;
            if(town.length == 0) {
              //this.towns = [{'option' : 'Select Towns', 'val' : ''}];
              this.filteredData['town'] = this.townValue;
            } else {
              //this.towns = [{'option' : 'Select Towns', 'val' : ''}];
              this.setTownList(town);
            }*/
            break;
        }
      }
    });
  }

  // Set Zone List
  setZoneList(zoneData) {
    for (let z of zoneData) {
      this.zones.push({
        'option': z,
        'val': z
      });
    }
    this.geoAreaFilter = true;
  }

  // Set Area List
  setAreaList(areaData) {
    for (let a of areaData) {
      this.areas.push({
        'option': a,
        'val': a
      });
    }
    this.geoAreaFilter = true;
    this.geoTerFilter = true;
    //this.geoTownFilter = true;
  }

  // Set Territory List
  setTerritoryList(territoryData) {
    for (let ter of territoryData) {
      this.territories.push({
        'option': ter,
        'val': ter
      });
    }
    this.geoTerFilter = true;
    //this.geoTownFilter = true;
  }

  // Set Town List
  setTownList(townData) {
    for (let tw of townData) {
      this.towns.push({
        'option': tw,
        'val': tw
      });
    }
    this.geoTownFilter = true;
  }

  // User Type Change
  filterChange(action, id, value) {
    console.log(value);
    switch (id) {
      case 2:
        this.userTypeValue = value;
        this.filteredData['userType'] = [];
        this.userTypeValueName = value;
        for (let ut of this.userTypes) {
          if (ut.id == value) {
            this.userTypeValueName = ut.name;
          }
        }
        this.filteredData['userType'].push(this.userTypeValue);
        if (action == 'change') { this.instantApply(); }
        if (this.searchUserWidget) {
          this.getThreadUsers();
        }
        if (this.searchDealerWidget) {
          this.getDealerUsers();
        }
        break;
      case 3:
        this.filterYearValue = value;
        this.filteredData['year'] = this.filterYearValue;
        if (action == 'change') { this.instantApply(); }
        this.months = [];
        this.getMonthList();
        break;
      case 4:
        this.filterMonthValue = value;
        this.filteredData['month'] = this.filterMonthValue;
        const number = (parseInt(this.filterMonthValue) < 1) ? 0 : parseInt(this.filterMonthValue) - 1; // 0 = Jan & 11 = Dec
        this.filterMonthName = moment().month(number).format("MMMM"); // Feb
        if (action == 'change') { this.instantApply(); }
        break;
      case 6:
        this.startDateValue = value;
        console.log("this.startDateValue: ", this.startDateValue);
        console.log("this.filteredData: ", this.filteredData);
        let sdate = moment(this.startDateValue).format();
        let edate = moment(this.endDateValue).format();
        let res = moment(edate).diff(moment(sdate), 'days', true);
        this.disableFilterAction = (res < 0) ? true : false;
        this.dateErrorFlag = this.disableFilterAction;
        if (!this.disableFilterAction) {
          this.durationValue = (res > 60) ? 0 : res;
          this.filteredData['startDate'] = moment(value).format('YYYY-MM-DD');
          console.log(this.filteredData['startDate']);
          this.filteredData['endDate'] = moment(this.endDateValue).format('YYYY-MM-DD');
          this.instantApply();
        }
        console.log("this.filteredData: ", this.filteredData);
        break;
      case 7.1:
        this.zoneValue = value;
        this.filteredData['zone'] = this.zoneValue;
        let zoneApiData = this.apiData;
        zoneApiData.zoneValue = this.zoneValue;
        if (this.zoneValue == "") {
          zoneApiData.areaValue = this.zoneValue;
          zoneApiData.territoryValue = this.zoneValue;
        }
        this.geoAreaFilter = false;
        this.geoTerFilter = false;
        //this.geoTownFilter = false;
        this.getGeoGraphicalData('zone', zoneApiData);
        if (action == 'change') { this.instantApply(); }
        break;
      case 7.2:
        this.areaValue = value;
        this.filteredData['area'] = this.areaValue;
        let areaApiData = this.apiData;
        areaApiData.zoneValue = this.zoneValue;
        areaApiData.areaValue = this.areaValue;
        this.geoTerFilter = false;
        this.geoTownFilter = false;
        this.getGeoGraphicalData('area', areaApiData);
        break;
      case 7.3:
        this.stateValue = value;
        this.filteredData['state'] = this.stateValue;
        break;
      case 7.4:
        this.territoryValue = value;
        this.filteredData['territory'] = this.territoryValue;
        let territoryApiData = this.apiData;
        territoryApiData.zoneValue = this.zoneValue;
        territoryApiData.areaValue = this.areaValue;
        territoryApiData.territoryValue = (this.territoryValue == 'Select Territories') ? '' : this.territoryValue;
        this.geoTownFilter = false;
        this.getGeoGraphicalData('territory', territoryApiData);
        break;
      case 7.5:
        this.townValue = value;
        this.filteredData['town'] = this.townValue;
        break;
      case 8:
        this.dealerValue = value;
        this.filteredData['dealerCode'] = this.dealerValue;
        break;
      case 9:
        this.statusValue = value;
        this.filteredData['status'] = (value == 0) ? '' : this.statusValue;
        for (let st of this.status) {
          if (st.id == this.statusValue) {
            this.statusValueName = st.name;
          }
        }
        if (action == 'change') { this.instantApply(); }
        break;
      case 10:
        this.endDateValue = value;
        let stdate = moment(this.startOfMonth).format();
        let endate = moment(this.endDateValue).format();
        let enres = moment(endate).diff(moment(stdate), 'days', true);
        this.disableFilterAction = (enres < 0) ? true : false;

        if (moment(this.startOfMonth).date() == moment(this.endDateValue).date() &&
          moment(this.startOfMonth).month() == moment(this.endDateValue).month() &&
          moment(this.startOfMonth).year() == moment(this.endDateValue).year()) {
          this.disableFilterAction = false;
        }

        this.dateErrorFlag = this.disableFilterAction;
        if (!this.disableFilterAction) {
          this.durationValue = (enres > 60) ? 0 : enres;
          this.filteredData['startDate'] = moment(this.startOfMonth).format('YYYY-MM-DD');
          console.log(this.filteredData['startDate']);
          this.filteredData['endDate'] = moment(value).format('YYYY-MM-DD');
          this.instantApply();
        }
        break;
      case 17:
        this.sortByValue = value;
        this.filteredData['sortBy'] = this.sortByValue;
        console.log("this.filteredData: ", this.filteredData);
        if (action == 'change') {
          this.instantApply();
        }
        break;
    }
  }

  sliderOnChange(value) {
    let duration;
    if (value < 1) {

    } else if (value < 15) {
      duration = Math.round((value / 7));
      let date = moment(this.today).format();
      if (duration >= 2) {
        date = moment(date).subtract(duration, 'weeks').format();
      } else {
        date = moment(date).subtract(duration, 'week').format();
      }
      this.startDateValue = date;
      this.filteredData['startDate'] = moment(this.startDateValue).format('YYYY-MM-DD');
      console.log(this.filteredData['startDate']);
      this.endDateValue = this.today;
      this.filteredData['endDate'] = moment(this.endDateValue).format('YYYY-MM-DD');
    } else {
      duration = Math.round((value / 30));
      let date = moment(this.today).format();
      if (duration >= 2) {
        date = moment(date).subtract(duration, 'months').format();
      } else {
        date = moment(date).subtract(duration, 'month').format();
      }
      this.startDateValue = date;
      this.filteredData['startDate'] = moment(this.startDateValue).format('YYYY-MM-DD');
      console.log(this.filteredData['startDate']);
      this.endDateValue = this.today;
      this.filteredData['endDate'] = moment(this.endDateValue).format('YYYY-MM-DD');
    }
  }

  // Get Dealer User Lists
  getDealerUsers() {
    this.dealerFilter = false;
    this.apiData['storage'] = 'dealerUserFilter';
    this.apiData['limit'] = 30;
    this.apiData['offset'] = 0;
    this.apiData['filterOptions'] = this.filteredData;
    this.apiData['filterOptions']['groupId'] = "1";
    this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        let dealerListData = responseData.chartdetails;
        this.dealerValue = '';
        this.filteredData['dealerCode'] = this.dealerValue;
        this.filteredUsers = this.filteredData['deakerCode'];
        this.dealers = [];
        //let dlist = [{'dealerName': 'All Users', 'dealerCode': ''}];
        let dlist = [];
        for (let dealer of dealerListData) {
          let code = (dealer.Usertype == 2) ? dealer.dealerCode : dealer.userId;
          let name = (dealer.Usertype == 2) ? dealer.dealerName : dealer.userName;
          dlist.push({
            'dealerName': code + ' - ' + name,
            'dealerCode': code
          });
        }
        this.dealers = dlist;
        this.dealerFilter = true;
      }
    });
  }

  // Get Thread User Lists
  getThreadUsers() {
    this.userFilter = false;
    this.apiData['storage'] = 'threadUserFilter';
    this.apiData['limit'] = 30;
    this.apiData['offset'] = 0;
    this.apiData['filterOptions'] = this.filteredData;
    this.apiData['filterOptions']['groupId'] = "3.2";
    this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        let userListData = responseData.chartdetails;
        this.userValue = '';
        this.filteredData['userId'] = this.userValue;
        this.filteredUsers = this.filteredData['userId'];
        //let userList = [{'userName': 'All Users', 'userId': ''}];
        let userList = [];
        for (let u of userListData) {
          let uid = u.user_id;
          let name = u.stagename;
          userList.push({
            'userName': name,
            'userId': uid
          });
        }
        this.users = userList;
        this.userFilter = true;
      }
    });
  }

  // Filtered Dealers
  selectedDealers(items) {
    this.filteredDealers = items;
    this.filteredData['dealerCode'] = this.filteredDealers;
  }

  // Filtered Areas
  selectedAreas(value) {
    value = (value == "Select Areas") ? "" : value;
    if (value != "") {
      this.instantApply();
    }
  }

  // Filtered Terriroties
  selectedTerritories(value) {
    value = (value == "Select Territories") ? "" : value;
    if (value != "") {
      this.instantApply();
    }
  }

  // Filtered Towns
  selectedTowns(value) {
    //value = (value == "Select Towns") ? "" : value;
  }

  // Selected Models
  selectedModels(list) {
    let items = list.items;
    this.filteredModels = items;
    this.filteredData['models'] = items;
    if (list.emit) {
      this.instantApply();
    }
  }

  // Filtered Users
  selectedUsers(items) {
    this.filteredUsers = items;
    this.filteredData['userId'] = this.filteredUsers;
    this.initFlag = false;
    this.applyFilter(this.resetFlag)
  }

  // Instant Apply
  instantApply() {
    let access = this.filterOptions.page;
    this.initFlag = false;
    this.applyFilter(this.resetFlag)
  }
  // Apply Filter
  applyFilter(resetAction) {

    console.log(localStorage.getItem('threadFilter'));
    this.filterLoading = (resetAction) ? true : false;
    this.filteredData['reset'] = resetAction;
    this.filteredData['action'] = 'get';
    this.activeFilter = (resetAction) ? false : true;
    console.log("this.filteredData: ", this.filteredData);
    if (resetAction) {
      let access = this.filterOptions.page;

      switch (access) {
        case 'leaderboard':
        case 'techsupport':
          this.filteredData['startDate'] = this.leaderboardApi.startDate;
          console.log(this.filteredData['startDate']);
          this.filteredData['endDate'] = this.leaderboardApi.endDate;
          break;
        case 'user-activities':
          this.filteredData['startDate'] = this.userActiviesApi.startDate;
          console.log(this.filteredData['startDate']);
          this.filteredData['endDate'] = this.userActiviesApi.endDate;
          this.filteredData['sortBy'] = this.userActiviesApi.sortBy;
          break;
      }
    }
    this.filterAction.emit(this.filteredData);
  }

  /**
   * Filter Expand/Collapse
   */
  expandAction() {
    this.expandFlag = (this.expandFlag) ? false : true;
    this.toggle.emit(this.expandFlag);
  }

  /* Disable Month */
  disableMonthSelection(month) {
    if (this.currYear == this.filterYearValue) {
      let flag = (month > 0 && this.currMonth >= month) ? false : true;
      return flag;
    } else {
      return false;
    }
  }

}
