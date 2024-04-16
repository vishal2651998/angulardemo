import { Component, OnInit, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { silentItems, pageTitle } from "src/app/common/constant/constant";
import { GtsService } from "src/app/services/gts/gts.service";
import { MatAccordion } from "@angular/material";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { CommonService } from '../../../../services/common/common.service';
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { ApiService } from '../../../../services/api/api.service';
import { FollowersFollowingComponent } from '../../../../components/common/followers-following/followers-following.component';

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
export class ViewComponent implements OnInit, OnDestroy {
  @ViewChild("accordion", { static: true }) Accordion: MatAccordion;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public apiKey;
  public domainId;
  public countryId;
  public userId;
  public roleId;
  public gtsId;
  public loading: boolean = true;

  public headerData: Object;
  public title = "GTS ID#";
  public pageAccess: string = "gts";
  public bodyElem;
  public bodyClass: string = "submit-loader";

  public gtsInfo: Object;
  public vehicleInfo: any;
  public voiceInfo: any;
  public vehicleFlag: boolean;

  public tagFlag: boolean = false;
  public dtcFlag: boolean = false;
  public assetPartPath: string = "assets/images/thread-detail/";
  public gtsChartFlag: boolean = false;
  public actionFlag: boolean = false;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public disableLikeFlag: boolean = false;
  public likeLoading: boolean = false;
  public pinLoading: boolean = false;
  public likeStatus: number;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public likeImg: string;
  public pinImg: string;
  public editRedirect: string;
  public duplicateRedirect: string;
  public gtsPlaceholderImg: string = "assets/images/gts/gts-placeholder.png";
  public imgURL: any;
  public bgClass: string;
  public workstreams: any;
  public workFlowName: string;
  public workFlowId: string;
  public probCatgName: string;
  public name: string;
  public addInfo: string;
  public system: string;
  public tags: any;
  public filteredErrorCodes: any;
  public productModuleType: string = "";
  public productModuleMfg: string = "";
  public dtcCode: string = "";
  public dtcDesc: string = "";
  public version: any;
  public createdBy: string = "";
  public createdByImg: string;
  public createdOn: string = "";
  public updatedBy: string = "";
  public updatedByImg: string;
  public updatedOn: string = "";
  public flowChartcreatedBy: string = "-";
  public flowChartcreatedOn: string = "-";
  public flowChartupdatedBy: string = "-";
  public flowChartupdatedOn: string = "-";

  public viewCount: number = 0;
  public legacyGts: boolean = false;
  public systemInfo: any;
  public tvsFlag: boolean = false;
  public collabticDomain: boolean = false;
  public splitIcon: boolean = false;
  public platformId;
  public threadType: number = 25;
  public contentType: number = 8;
  public teamSystem = localStorage.getItem('teamSystem');
  public wsplit: boolean = false;
  public bodyClass1: string = "parts";
  public bodyClass2: string = "gts-new";
  public productMakePl: string = "";
  public bodyHeight: number;
  public innerHeight: number;
  public industryType: any = [];
  public emissionList: any = [];

  panelOpenState = false;
  accordionList: any;
  vehicleList = [];
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};

  public DICVDomain: boolean = false;
  public user: any;
  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private scrollTopService: ScrollTopService,
    private gtsApi: GtsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private apiUrl: ApiService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    //this.titleService.setTitle("Mahle Forum - " + this.title);
  }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass2);
    this.scrollTopService.setScrollTop();
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.domainId = localStorage.getItem("domainId");
    this.userId = localStorage.getItem("userId");
    this.roleId = localStorage.getItem("roleId");

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    if (this.domainId == 98) {
      console.log(this.domainId);
      this.DICVDomain = true;
    }

    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
        (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.gtsId = this.route.snapshot.params["gid"];
      this.editRedirect = `gts/edit/${this.gtsId}`;
      this.duplicateRedirect = `gts/duplicate/${this.gtsId}`;
      this.apiKey = "dG9wZml4MTIz";

      this.title = `${this.title}${this.gtsId}`;
      this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title);

      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      this.collabticDomain = (this.platformId == 1) ? true : false;
      this.tvsFlag = (this.platformId == 2 && this.domainId == 52) ? true : false;
      if (this.tvsFlag) {
        this.productMakePl = "Select Product Type";
      }
      else {
        this.productMakePl = "Select Make";
      }

      this.industryType = this.commonApi.getIndustryType();

      if (this.tvsFlag) {
        this.accordionList = [
          {
            id: "vehicle-info",
            class: "vehicle-info",
            title: "Vehicle Details",
            description: "",
            isDisabled: false,
            isExpanded: true,
          },
        ];
      }
      else {
        if (this.industryType['id'] == '1') {
          this.accordionList = [
            {
              id: "equipment-info",
              class: "equipment-info",
              title: "Equipment Details",
              description: "",
              isDisabled: false,
              isExpanded: true,
            },
          ];

        }
        else {
          this.accordionList = [
            {
              id: "vehicle-info",
              class: "equipment-info",
              title: "Vehicle Details",
              description: "",
              isDisabled: false,
              isExpanded: true,
            },
          ];
        }

      }

      this.checkAccessLevel();
      setTimeout(() => {
      // Get GTS Details
      this.getGTSDetails();
      }, 300);
      setTimeout(() => {
        this.setScreenHeight();
      }, 1500);

    } else {
      this.router.navigate(["/forbidden"]);
    }
  }
  threadHeaderAction(event) {
    console.error(event);
    if (event == "delete") {
      this.deleteRequest();
    } else {
      this.navigatePage(this.duplicateRedirect);
    }
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(6, chkType, chkFlag);
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
                viewAccess = (roleAccess == 1) ? true : false;
                break;
              case 2:
                createAccess = (roleAccess == 1) ? true : false;
                break;
              case 3:
                editAccess = (roleAccess == 1) ? true : false;
                break;
              case 4:
                deleteAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });

        }
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess};

        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        else{
          this.accessLevel = this.accessLevel;
        }
        console.log(this.accessLevel)

      }, 500);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    if (!this.teamSystem) {
      headerHeight = 50;
    }
    this.innerHeight = (this.bodyHeight - headerHeight);
  }


  socialAction(type, status) {
    if (this.userId == this.createdBy) return;
    let actionStatus = "";
    let actionFlag = true;
    let likeCount = this.gtsInfo["likeCount"];
    let pinCount = this.gtsInfo["pinCount"];
    switch (type) {
      case "like":
        actionFlag = this.disableLikeFlag || this.likeLoading ? false : true;
        actionStatus = status == 0 ? "liked" : "disliked";
        this.gtsInfo["likeStatus"] = status == 0 ? 1 : 0;
        this.likeStatus = this.gtsInfo["likeStatus"];
        this.likeImg =
          this.likeStatus == 1
            ? "thread-like-active.png"
            : "thread-like-normal.png";
        this.likeCount =
          status == 0 ? parseInt(likeCount) + 1 : likeCount - 1;
       // this.likeCount = this.gtsInfo["likeCount"];
       this.gtsInfo["likeCount"]=this.likeCount;
        break;
      case "pin":
        actionFlag = this.pinLoading ? false : true;
        actionStatus = status == 0 ? "pined" : "dispined";
        this.gtsInfo["pinStatus"] = status == 0 ? 1 : 0;
        this.pinStatus = this.gtsInfo["pinStatus"];
        this.pinImg =
          this.pinStatus == 1
            ? "thread-pin-active.png"
            : "thread-pin-normal.png";
            this.pinCount =
          status == 0 ? pinCount + 1 : pinCount - 1;
        //this.pinCount = this.gtsInfo["pinCount"];
        this.gtsInfo["pinCount"]=this.pinCount;
        break;
    }
    console.error("actionFlag", actionFlag);
    if (actionFlag) {
      let apiData = {
        apiKey: this.apiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        threadId: this.gtsId,
        postId: this.gtsId,
        ismain: 1,
        status: actionStatus,
        type: type,
      };

      this.gtsApi
        .likePinAction(apiData)
        .subscribe((response) => {
          if (response.status != "Success") {
            switch (type) {
              case "like":
                this.gtsApi["likeStatus"] = status;
                this.likeStatus = this.gtsInfo["likeStatus"];
                this.likeImg =
                  this.likeStatus == 1
                    ? "thread-like-active.png"
                    : "thread-like-normal.png";
                this.gtsInfo["likeCount"] =
                  status == 0 ? likeCount - 1 : likeCount + 1;
                this.likeCount = this.gtsInfo["likeCount"];
                break;
              case "pin":
                this.gtsInfo["pinStatus"] = status;
                this.pinStatus = this.gtsInfo["pinStatus"];
                this.pinImg =
                  this.pinStatus == 1
                    ? "thread-pin-active.png"
                    : "thread-pin-normal.png";
                this.gtsInfo["pinCount"] =
                  status == 0 ? pinCount - 1 : pinCount + 1;
                this.pinCount = this.gtsInfo["pinCount"];
                break;
            }
          }
        });
    }
  }

  // Get GTS Details
  getGTSDetails() {
    let offset: any = 0;
    let limit: any = 1;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("procedureId", this.gtsId);
    apiFormData.append("limit", limit);
    apiFormData.append("offset", offset);

    this.gtsApi.getGTSLists(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        this.gtsApi.isProcedureAvailable = response.isProcedureAvailable;
        this.gtsInfo = response.procedure[0];
        this.imgURL =
          this.gtsInfo["gtsImg"] == ""
            ? this.gtsPlaceholderImg
            : this.gtsInfo["gtsImg"];
        this.bgClass = this.gtsInfo["gtsImg"] == "" ? "default" : "gts-bg";
        this.workstreams = this.gtsInfo["workstreams"];
        if(this.collabticDomain){
          this.workFlowId = this.gtsInfo["workFlowId"] && this.gtsInfo["workFlowId"] != undefined && this.gtsInfo["workFlowId"] != "0" ? this.gtsInfo["workFlowId"] : '';
          this.workFlowName = this.gtsInfo["workFlowName"] && this.gtsInfo["workFlowName"] != undefined ? this.gtsInfo["workFlowName"] : '';
        }
        this.probCatgName = this.gtsInfo["productCategoryName"];
        this.name = this.gtsInfo["name"];
        this.addInfo =
          this.gtsInfo["additionalInfo"] == ""
            ? "NA"
            : this.gtsInfo["additionalInfo"];
        this.system = this.gtsInfo["systemSelection"];
        this.tags =
          this.gtsInfo["tags"] == "-" || this.gtsInfo["tags"] == "" ? "-" : JSON.parse(this.gtsInfo["tags"]);

        let filteredErrorCod = this.gtsInfo["errorCodes"] == '' ? false : true;
        this.filteredErrorCodes = filteredErrorCod ? this.gtsInfo["errorCodes"] : '';


        this.productModuleType = this.gtsInfo["productModuleType"];
        this.productModuleMfg = this.gtsInfo["productModuleMfg"];

        let createdDate = moment.utc(this.gtsInfo["createdOn"]).toDate();
        let localCreatedDate = moment(createdDate)
          .local()
          .format("MMM DD, YYYY h:mm A");
        let updatedDate = moment.utc(this.gtsInfo["updatedOn"]).toDate();
        let localUpdatedDate = moment(updatedDate)
          .local()
          .format("MMM DD, YYYY h:mm A");
        this.createdOn =
          this.gtsInfo["createdOn"] == "" ? "-" : localCreatedDate;
        this.createdBy = this.gtsInfo["createdBy"];
        this.likeStatus=this.gtsInfo["likeStatus"];
        this.pinStatus=this.gtsInfo["pinStatus"];
        this.disableLikeFlag =
            this.userId == this.gtsInfo["createdById"] ? true : false;
          this.likeImg =
            this.likeStatus == 1
              ? "thread-like-active.png"
              : "thread-like-normal.png";
          this.pinImg =
            this.pinStatus == 1
              ? "thread-pin-active.png"
              : "thread-pin-normal.png";
        this.createdByImg = this.gtsInfo["createdByProfileImg"];
        this.updatedByImg = this.gtsInfo["updatedByProfileImg"];
        this.pinCount = this.gtsInfo["pinCount"];
        this.updatedOn =
          this.gtsInfo["updatedOn"] == "" ? "-" : localUpdatedDate;
        this.updatedBy = this.gtsInfo["updatedBy"];
        this.version = this.gtsInfo["version"];
        this.likeCount = this.gtsInfo["likeCount"];
        this.viewCount = this.gtsInfo["viewCount"];

        this.tagFlag = this.tags == "-" || this.tags == "" ? false : true;
        this.gtsChartFlag =
          this.gtsInfo["isPublishEnabled"] == 0 ? false : true;
        this.dtcFlag =
          this.gtsInfo["productCategoryName"] == "DTCs" ? true : false;

          let editAccess = false;
          let deleteAccess = false;
          let createAccess = false;

          //if(this.platformId == 1){
            this.actionFlag =
            this.userId == this.gtsInfo["createdById"]
              ? true
              : false;

         /* }else{
            this.actionFlag =
            this.roleId == '3' || this.roleId == '10' || this.userId == this.gtsInfo["createdById"]
              ? true
              : false;
          }*/

          if(this.gtsInfo["isPublishEnabled"] == 1){
            editAccess = this.actionFlag ? true : this.accessLevel.edit;
            deleteAccess = this.actionFlag ? true : this.accessLevel.delete;
            createAccess = this.accessLevel.create;
          }
          else{
            editAccess = this.actionFlag;
            deleteAccess = this.actionFlag;
            createAccess = false;
          }

        this.headerData = {
          access: this.pageAccess,
          pageName: "gts",
          threadId: this.gtsId,
          threadOwnerAccess: this.actionFlag,
          editAccess: editAccess,
          deleteAccess: deleteAccess,
          createAccess: createAccess,
          profile: false,
          welcomeProfile: false,
          search: false,
          gtsTitle: `<span>GTS ID#${this.gtsId}</span>`,
          techSubmmit: '',
          flowchartURL: this.gtsInfo["flowchartURL"] != '' && this.gtsInfo["flowchartURL"] != undefined ? this.gtsInfo["flowchartURL"] : ''
        };

        if (this.dtcFlag) {
          this.dtcCode = this.gtsInfo["dtcCode"];
          this.dtcDesc = this.gtsInfo["dtcDesc"];
        }

        this.legacyGts = this.gtsInfo["legacyGTS"] == 1 ? true : false;
        if (this.gtsChartFlag) {
          let chartCreatedDate = moment
            .utc(this.gtsInfo["flowChartcreatedOn"])
            .toDate();
          let localChartCreatedDate = moment(chartCreatedDate)
            .local()
            .format("MMM DD, YYYY h:mm A");
          let chartUpdatedDate = moment
            .utc(this.gtsInfo["flowChartupdatedOn"])
            .toDate();
          let localChartUpdatedDate = moment(chartUpdatedDate)
            .local()
            .format("MMM DD, YYYY h:mm A");
          this.flowChartcreatedBy =
            this.gtsInfo["flowChartcreatedBy"] == ""
              ? "-"
              : this.gtsInfo["flowChartcreatedBy"];
          this.flowChartcreatedOn =
            this.gtsInfo["flowChartcreatedOn"] == ""
              ? "-"
              : localChartCreatedDate;
          this.flowChartupdatedBy =
            this.gtsInfo["flowChartupdatedBy"] == ""
              ? "-"
              : this.gtsInfo["flowChartupdatedBy"];
          this.flowChartupdatedOn =
            this.gtsInfo["flowChartupdatedOn"] == ""
              ? "-"
              : localChartUpdatedDate;
        }

        console.log(this.gtsInfo["vehicleDetails"]);

        this.vehicleInfo =
          this.gtsInfo["vehicleDetails"] == ""
            ? this.gtsInfo["vehicleDetails"]
            : JSON.parse(this.gtsInfo["vehicleDetails"]);
        this.vehicleFlag = this.vehicleInfo.length == 0 ? false : true;

        console.log(this.vehicleInfo.lenth);
        console.log(this.vehicleInfo);
        console.log(this.vehicleFlag);
        if (this.vehicleFlag) {
          this.vehicleList = [];
          for (let vh of this.vehicleInfo) {
            let vehicleData = [];
            vehicleData["emissionName"] = (vh.emissionName == undefined || vh.emissionName == 'undefined') ? '' : vh.emissionName;
            vehicleData["model"] = vh.model;
            vehicleData["year"] = (vh.year == undefined || vh.year == 'undefined') ? '' : vh.year;
            this.vehicleList.push({
              class: "vh_info",
              title: vh.productType,
              vehicleData: vehicleData,
              isDisabled: false,
              isExpanded: true,
            });
          }
          console.log(this.vehicleList);
        }

        let userInfo = {
          createdBy: this.createdBy,
          createdOn: this.createdOn,
          updatedBy: this.updatedBy,
          updatedOn: this.updatedOn,
        };
       
        let workFlowFlag = false;
        let workFlowName = '';
        if(this.collabticDomain){
          workFlowName = this.workFlowId != '' ? this.workFlowName : ''
          workFlowFlag = workFlowName != '' ? true : false;
        }
        

        this.systemInfo = {
          header: true,
          workstreams: this.workstreams,
          userInfo: userInfo,
          workFlowFlag: workFlowFlag,
          workFlowName: workFlowName
        };

        console.log(this.vehicleList);
        this.loading = false;
        console.log(this.gtsInfo);
      }
    });
  }

  // Delete GTS
  deleteRequest() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteGts();
      }
    });
  }

  getEmissionsData(value) {
    // emissions
    let loopUpData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      commonApiValue: '24',
      searchKey: '',
      offset: '',
      limit: '',
      make: value
    };
    this.commonApi.getEscalationLoopUpDataList(loopUpData).subscribe((response) => {
      if (response.status == "Success") {
        this.loading = false;
        let resultData = response.items;
        this.emissionList = [];
        for (let m of resultData) {
          this.emissionList.push({
            'id': m.id,
            'name': m.name
          });
        }
      }
    });


  }

  deleteGts() {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    let gtsFormData = new FormData();
    gtsFormData.append("apiKey", this.apiKey);
    gtsFormData.append("domainId", this.domainId);
    gtsFormData.append("countryId", this.countryId);
    gtsFormData.append("userId", this.userId);
    gtsFormData.append("procedureId", this.gtsId);

    this.gtsApi.deleteGts(gtsFormData).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      this.successMsg = response.result;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.config
      );
      msgModalRef.componentInstance.successMessage = this.successMsg;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        let navUrl = 'gts';
        let pageDataIndex = pageTitle.findIndex(option => option.slug == navUrl);
        let navText = pageTitle[pageDataIndex].navEdit;
        let navFromEdit: any = localStorage.getItem(navText);
        setTimeout(() => {
          localStorage.removeItem(navText);
        }, 100);
        navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
        let wsNav: any = localStorage.getItem('wsNav');
        let wsNavUrl = localStorage.getItem('wsNavUrl');
        let url = (wsNav) ? wsNavUrl : navUrl;
        let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
        let chkRouteLoad;
        if (routeLoadIndex >= 0) {
          let routeText = pageTitle[routeLoadIndex].routerText;
          chkRouteLoad = localStorage.getItem(routeText);
        }
        let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad
        if (navFromEdit || routeLoad) {
          this.router.navigate([url]);
        } else {
          this.location.back();
        }
        let data = {
          access: 'gts',
          action: 'silentDelete',
          pushAction: 'load',
          gtsId: this.gtsId
        }
        this.commonApi.emitMessageReceived(data);
        setTimeout(() => {
          localStorage.removeItem('wsNav');
          localStorage.removeItem('wsNavUrl');
          localStorage.removeItem(silentItems.silentGTSCount);
        }, 100);
      }, 5000);
    });
  }

  beforeParentPanelOpened(panel, vehicle) {
    panel.isExpanded = true;
    if (panel.id == "vehicle-info") {
      for (let v of vehicle) {
        v.isExpanded = true;
      }
    }
    console.log("Panel going to  open!");
  }

  beforeParentPanelClosed(panel, vehicle) {
    panel.isExpanded = false;
    if (panel.id == "vehicle-info") {
      for (let v of vehicle) {
        v.isExpanded = false;
      }
    }
  }

  beforePanelOpened(panel) {
    panel.isExpanded = true;
    console.log("Panel going to  open!");
  }

  beforePanelClosed(panel) {
    panel.isExpanded = false;
    console.log("Panel going to close!");
  }

  afterPanelClosed() {
    console.log("Panel closed!");
  }

  afterPanelOpened() {
    console.log("Panel opened!");
  }

  // Page Navigation
  navigatePage(url) {
    this.router.navigate([url]);
  }

    // liked, pinned, posted and one-puls user list
    threadDashboarUserList(){
      this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.add('profile');
        const modalRef = this.modalService.open(FollowersFollowingComponent, {backdrop: 'static', keyboard: false, centered: true});
        modalRef.componentInstance.type = 'gts';
          let dashboardData = {
            apiKey: this.apiKey,
            domainId: this.domainId,
            countryId: this.countryId,
            userId: this.userId,
            threadId: this.gtsId,
            postId: '',
            ismain: '1',
            tap:  'gts'
          };
        modalRef.componentInstance.dashboardData = dashboardData;
        modalRef.componentInstance.updatefollowingResponce.subscribe((receivedService) => {
        if (receivedService) {
          modalRef.dismiss('Cross click');
          this.bodyElem.classList.remove('profile');
        }
        });

    }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass2);
  }
}
