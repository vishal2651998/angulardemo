import {Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Constant, DispatchText } from "src/app/common/constant/constant";
import { CommonService } from 'src/app/services/common/common.service';
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Title } from "@angular/platform-browser";
import { DispatchPageComponent } from "src/app/components/common/dispatch-page/dispatch-page.component";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProductHeaderComponent } from "src/app/layouts/product-header/product-header.component";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import * as moment from "moment";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
  @ViewChild("ttthreads") tooltip: NgbTooltip;
  productHeaderRef: ProductHeaderComponent;
  sidebarRef: SidebarComponent;
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public headerData: Object;
  pageAccess: string = "dispatch";
  public title = "Dispatch";
  public bodyClass: string = "dispatch";
  public headTitle: string = "";
  public thelpContentIconName = "";
  public thelpContentTitle = "";
  public thelpContentContent = "";
  public thelpContentId = "";
  public countryId;
  public domainId;
  public user: any;
  public userId: any;
  public roleId: any;
  public menuListloaded;
  public dispatchFlag: boolean = false;
  public isMobileTech: boolean = false;
  public thelpContentStatus = "";
  public thelpContentFlagStatus: boolean = false;
  public disableNextBtn: boolean = false;
  public disablePreviousBtn: boolean = false;
  public newFlag: boolean = false;
  public selectionFlag: boolean = false;
  public switchText: string = "";
  public techTotal: any = 0;
  public currIndex: any = 0;
  public prevIndex: any = -1;
  public nextIndex: any = -1;
  public pageLoading: boolean = true;
  public sidebarActiveClass: Object;
  @Output() dispatchModal: EventEmitter<any> = new EventEmitter();
  displayView: any = [];
  selectedView: any = '';
  range: any = [];
  selectedRange: any = '';
  displayModal: boolean = false;
  dispatchPageRef: DispatchPageComponent;
  currDate: any = '';
  curr_date: any = moment();
  displayToday: boolean = false;
  public dispatchOptions: any = [];
  public viewOptions: any = [];
  public view: any = '';
  public serviceId: any = 0;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private titleService: Title,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    console.log(this.activeRoute.params)
    this.activeRoute.params.subscribe( params => {
      this.serviceId = params.id;
      console.log(this.serviceId)
    });
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
      newButton: false
    };
    this.user = this.authenticationService.userValue;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.domainId = localStorage.getItem('domainId');
    let isMobileTech = parseInt(localStorage.getItem('isMobileTech'));
    this.isMobileTech = (isMobileTech == 1) ? true : false;
    this.dispatchFlag = (this.roleId == 3) ? true : false;
    if(this.roleId == 3 && this.isMobileTech) {
      this.switchText = (this.dispatchFlag) ? DispatchText.switchMobileTech : DispatchText.switchAdmin;
    } else {
      this.switchText = DispatchText.mobileTech;
    }
    this.headTitle = (this.dispatchFlag) ? "Dispatch Board" : "Schedule";
    this.currDate = this.commonApi.createDateAsUTC(new Date());
    this.checkSameDate();
    this.getDispatchSettings();
    setTimeout(() => {
      if(this.serviceId > 0) {
        this.dispatchPageRef.serviceDetails(this.serviceId);
      }
    }, 100);
  }

  // Get Dispatch Settings
  getDispatchSettings() {
    const apiData = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId
    };
    this.landingpageServiceApi.dispatchSettingsAPI(apiData).subscribe((response) => {
      this.dispatchOptions = response.data;
      this.getBoardSettings();
    })
  }

  // Get Board Settings
  getBoardSettings() {
    const apiData = {
      apikey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId
    };
    this.landingpageServiceApi.boardSettingsAPI(apiData).subscribe((response) => {
      this.viewOptions = response.data;
      let statusList = [];
      this.viewOptions.forEach((item, i) => {
        if(this.roleId == 3) {
          this.displayView.push({
            label: item.name,
            value: item.id
          });
          //if(item.isDefault) {
          if(item.id == 3) {
            this.view = item.id;
            this.selectedView = this.view;
            this.range.push({
              label: item.range,
              value: item.rangeValue
            });
            this.selectedRange = item.rangeValue;
          }
        } else {
          if(i == 0) {
            this.displayView.push({
              label: item.name,
              value: item.id
            });
            this.view = item.id;
            this.selectedView = this.view;
            this.range.push({
              label: item.range,
              value: item.rangeValue
            });
            this.selectedRange = item.rangeValue;
          }
        }
        if(item.id == 4) {
          statusList = item.items;
        }
      });
      let boardData = {
        options: this.viewOptions,
        view: this.view,
        range: this.selectedRange,
        isMobileTech: false,
        initAction: true,
        techSelection: this.dispatchOptions.techSelection,
        statusList
      };
      setTimeout(() => {
        this.dispatchPageRef.dispatchBoardData(boardData, 'init');
      }, 500);
      if(this.view == 2) {
        setTimeout(() => {
          let techList = this.dispatchPageRef.getTechIndex();
          this.techTotal = techList.length;
          this.nextIndex = (this.techTotal == this.currIndex+1) ? -1 : this.currIndex+1;
        }, 5000);
      }
      this.pageLoading = false;
    });
  }

  checkSameDate() {
    let today = moment().format("YYYY-MM-DD");
    this.curr_date = moment(this.curr_date).format("YYYY-MM-DD");
    this.displayToday = moment(today).isSame(this.curr_date)
  }

  changeDate(action) {
    if(action != 'view') {
      switch (this.view) {
        case 1:
          if (action == "previous") {
            this.curr_date = moment(this.curr_date)
              .subtract(5, "d")
              .format("YYYY-MM-DD");
          } else if (action == "next") {
            this.curr_date = moment(this.curr_date).add(5, "d").format("YYYY-MM-DD");
          } else {
            this.curr_date = moment(this.curr_date).format("YYYY-MM-DD");
          }
          let mobileTech = !this.dispatchFlag;
          this.dispatchPageRef.currDate = this.curr_date;
          this.dispatchPageRef.getDispatchList(this.curr_date, -1, 0, false, mobileTech);
          this.checkSameDate();
          break;
        default:
          let flag = false;
          console.log(action, this.prevIndex, this.nextIndex)
          if(action == 'previous' && this.newFlag) {
            this.nextIndex = (this.nextIndex < 0) ? 0 : this.nextIndex;
            if(this.prevIndex >= 0) {
              console.log('in prev')
              this.currIndex = this.prevIndex;
              this.prevIndex -= 1;
              this.nextIndex += 1;
              flag = true;
            }
          }
          if(action == 'next' && this.newFlag) {
            if(this.nextIndex >= 0) {
              console.log('in next')
              this.currIndex = this.nextIndex;
              this.prevIndex += 1;
              console.log(this.techTotal, this.currIndex, this.currIndex+1)
              this.nextIndex = (this.techTotal == this.currIndex+1) ? -1 : this.nextIndex+1;
              console.log(this.nextIndex)
              flag = true;
            }
          }
          if(flag) {
            let techViewIndex = -1;
            this.dispatchPageRef.currTechIndex = this.currIndex;
            this.dispatchPageRef.getDispatchList(this.curr_date, techViewIndex, this.currIndex, true);
          }
          break;
      }
    }
  }

  todayClicked(action = '') {
    this.curr_date = this.currDate;
    this.changeDate(action);
  }

  applySearch(action, val) {
    console.log(val)
    if(Array.isArray(val)) {
      let daction = val[0];
      let id = val[1];
      switch (daction) {
        case 'new':
          this.newService();
          break;

        default:
          let push = (daction == 'emitData') ? false: true;
          let timeout = (this.dispatchPageRef.view == 4 && daction == 'status-remove') ? 2000 : 0;
          setTimeout(() => {
            this.dispatchPageRef.serviceDetails(id, daction, push);
          }, timeout);
          break;
      }
    }
  }

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
                  contentData[cd].id == "7" &&
                  contentData[cd].viewStatus == "0"
                ) {
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
            this.tooltip.close();
          }
        }
      });
  }

  newService() {
    console.log(123, this.currDate)
    this.displayModal = true;
    this.dispatchPageRef.serviceData = [];
    this.dispatchPageRef.displayModel(this.currDate);
  }

  selectedDayChanged(event) {
    //this.selectedRange = event;
    const access = event.access;
    switch(access) {
      case 'techIndex':
        this.techTotal = event.total;
        break;
    }
  }

  changeAction(field, val) {
    this.todayClicked(field);
    console.log(field, val)
    switch (field) {
      case 'view':
        this.displayToday = true;
        this.view = val;
        this.dispatchPageRef.loadingDispatch = true;
        if(val == 2) {
          setTimeout(() => {
            let techList = this.dispatchPageRef.getTechIndex();
            this.techTotal = techList.length;
            this.currIndex = 0;
            this.prevIndex = -1;
            this.nextIndex = -1;
            this.nextIndex = (this.techTotal == this.currIndex+1) ? this.nextIndex : this.currIndex+1;
          }, 5000);
        }
        this.viewOptions.forEach(item => {
          item.isDefault = false;
          if(item.id == val) {
            item.isDefault = true;
            this.range.push({
              label: item.range,
              value: item.rangeValue
            });
            this.selectedRange = item.rangeValue;
          }
        });
        let boardData = {
          options: this.viewOptions,
          view: this.view,
          range: this.selectedRange,
          isMobileTech: false,
          initAction: false,
          techSelection: this.dispatchOptions.techSelection
        };
        this.dispatchPageRef.dispatchBoardData(boardData, 'change');
        break;

      default:
        break;
    }
  }

  dispatchCallback(data) {
    console.log(data)
    let view = data.view;
    let emptyTech = data.emptyTech;
    this.newFlag = (view == 1) ? true : !emptyTech;
    this.selectionFlag = !emptyTech;
    this.productHeaderRef.newButtonEnable = (this.newFlag && this.dispatchFlag) ? true : false;
  }

  switchView() {
    let mobileTech = false;
    this.displayToday = true;
    if(this.dispatchFlag) {
      this.switchText = DispatchText.switchAdmin;
      mobileTech = true;
      this.view = this.viewOptions[0].id;
      this.selectedView = this.view;
      this.selectedRange = this.viewOptions[0].rangeValue;
    } else {
      this.switchText = DispatchText.switchMobileTech;
      this.view = this.viewOptions[2].id;
      this.selectedView = this.view;
      this.selectedRange = this.viewOptions[2].rangeValue;
    }

    this.dispatchFlag = !this.dispatchFlag;
    this.dispatchPageRef.isMobileTech = mobileTech;
    this.productHeaderRef.newButtonEnable = (this.newFlag && this.dispatchFlag) ? true : false;
    let boardData = {
      options: this.viewOptions,
      view: this.view,
      range: this.selectedRange,
      isMobileTech: mobileTech,
      initAction: false,
      techSelection: this.dispatchOptions.techSelection
    };
    this.dispatchPageRef.dispatchBoardData(boardData);
  }

  headerCallback(data) {}

  menuNav(item) {
    console.log(item)
    console.log(this.sidebarRef)
    let section = item.slug;
    switch (section) {
      case 'dispatch':
        this.headTitle = (this.dispatchFlag) ? "Dispatch Board" : "Schedule";
        break;
      default:
        this.headTitle = item.name;
        break;
    }
  }
}
