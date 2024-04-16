import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NgbModal,NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { ScrollTopService } from "../../../services/scroll-top.service";
import { PartsService } from "../../../services/parts/parts.service";
import { BaseService } from 'src/app/modules/base/base.service';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { Constant, SolrContentTypeValues, pageTitle, silentItems, IsOpenNewTab, RedirectionPage,forumPageAccess } from "../../../common/constant/constant";
import { MatAccordion } from "@angular/material";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { CommonService } from "src/app/services/common/common.service";
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
export class ViewComponent implements OnInit {
  @ViewChild("accordion", { static: true }) Accordion: MatAccordion;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public user: any;
  public apiKey;
  public platformId: number = 0;
  public countryId;
  public domainId;
  public userId;
  public roleId;
  public partId;
  public contentType: number = 6;
  public loading: boolean = true;
  public recentLoading: boolean = true;
  public recentPartEmpty: boolean = true;
  public recentLists: any;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public attachmentLoading: boolean = true;
  public rootUrl: string = "";
  public viewPartInterval: any;

  public headerData: Object;
  public title = "Parts ID#";
  public pageAccess: string = "partView";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public multipleHtml: string = "Multiple";
  public emptyCont: string = "<i class='gray'>None</i>";

  public bodyHeight: number;
  public innerHeight: number;

  public action = "view";
  public partsInfo: Object;
  public appInfo: any;

  public tagFlag: boolean = false;
  public actionFlag: boolean = true;
  public disableLikeFlag: boolean = false;
  public assetPartPath: string = "assets/images/parts/";
  public likeImg: string;
  public pinImg: string;
  public likeLoading: boolean = false;
  public pinLoading: boolean = false;

  public editRedirect: string;
  public partsPlaceholderImg: string = "assets/images/parts/part-icon.png";
  public chevronImg: string = "assets/images/parts/chevron.png";
  public imgURL: any;
  public bgClass: string;
  public partNumber: string;
  public partName: string;
  public partDesc: string;
  public partAlt: string;
  public partStatus: number;
  public partStatusText: string;
  public partType: string;
  public partsList: any = {
    productCodeList: [],
    traditionalInfo: [],
    colorNames: [],
  };
  public partSystem: string;
  public partAssembly: string;
  public figNo: string;
  public refNo: string;
  public contributedBy: string;
  public threadId: number;
  public tags: any;
  public workstreams;
  public appList: any;
  public appFlag: boolean;
  public errCode: any;
  public relatedThreads: any;
  public teamSystem = localStorage.getItem("teamSystem");

  public attachments: any;
  public systemInfo: any;
  public company: string;
  public website: string;
  public phone: string;
  public estPrice: string;
  public soldUs: string;
  public srcInfo: string;
  public warning: string;
  public likeStatus: number;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public viewCount: number;
  public createdOn: string;
  public createdBy: string;
  public createdByImg: string;
  public modifiedOn: string;
  public modifiedBy: string;
  public modifiedByImg: string;

  public threadUrl: string;
  public profileUrl: string;

  public emptyList = [];
  panelOpenState = false;
  accordionList: any;
  referenceAccordion: any;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  public industryType: any = [];
  public tvsFlag: boolean = false;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,

    private location: Location,
    private scrollTopService: ScrollTopService,
    private partsApi: PartsService,
    private baseService: BaseService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private commonApi: CommonService,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private apiUrl: ApiService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;

    config.size = "dialog-centered";
    this.accordionList = [
      {
        id: "app-info",
        class: "app-info",
        title: "Application",
        description: "",
        isDisabled: false,
        isExpanded: true,
      },
    ];

    this.referenceAccordion = [
      {
        id: "refer",
        class: "app-info refer",
        title: "Reference Information",
        description: "",
        isDisabled: false,
        isExpanded: true,
      },
      {
        id: "other",
        class: "other",
        title: "Other Part Information",
        description: "",
        isDisabled: false,
        isExpanded: true,
      },
      {
        id: "system",
        class: "system",
        title: "System Information",
        description: "",
        isDisabled: false,
        isExpanded: true,
      },
    ];
  }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.scrollTopService.setScrollTop();
    this.bodyHeight = window.innerHeight;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.countryId = localStorage.getItem('countryId');
    //this.tvsFlag = true;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      this.rootUrl = location.origin;
      console.log(this.rootUrl);
      this.partId = this.route.snapshot.params["pid"];

      this.title = `${this.title}${this.partId}`;
      this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

      this.editRedirect = `parts/manage/edit/${this.partId}`;
      this.apiKey = Constant.ApiKey;
      let platformId = localStorage.getItem("platformId");
      this.platformId =
        platformId == "undefined" || platformId == undefined
          ? this.platformId
          : parseInt(platformId);

      this.headerData = {
        pageName: "part",
        threadId: this.partId,
        threadStatus: "",
        threadStatusBgColor: "",
        threadStatusColorValue: "",
        threadOwnerAccess: this.actionFlag,
        reopenThread: "",
        closeThread: "",
      };

      this.industryType = this.commonApi.getIndustryType();
      this.tvsFlag = this.platformId == 2 && this.domainId == 52 ? true : false;
      console.error("this.tvsFlag", this.tvsFlag);
      let chkView = localStorage.getItem("viewPart")
      console.log(chkView)
      if(chkView == undefined || chkView == 'undefined') {
        // Get Parts Details
        setTimeout(() => {
         this.getPartsDetails();
        }, 300);
      }

      // Get Recent Part View Lists
      this.getRecentPartViews();
      this.checkAccessLevel();

      setTimeout(() => {
        this.setScreenHeight();
      }, 400);

      /* if (!this.teamSystem) {
        setTimeout(() => {
          this.viewPartInterval = setInterval(() => {
            let viewPartWidget = localStorage.getItem("viewPart");
            if (viewPartWidget) {
              console.log("in view");
              this.loading = true;
              this.getPartsDetails();
              localStorage.removeItem("viewPart");
            }
          }, 50);
        }, 1500);
      } */
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(11, chkType, chkFlag);
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



  // Get Part Details
  getPartsDetails() {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      partId: this.partId,
    };

    this.partsApi.getPartsDetail(apiData).subscribe((response: any) => {
      console.log(response);
      this.partsInfo = response.partsData[0];
      let commonData = this.partsInfo["commonData"];
      this.imgURL =
        this.partsInfo["partBannerImg"] == ""
          ? this.partsPlaceholderImg
          : commonData["partBannerImg"];
      this.bgClass =
        commonData["isDefaultImg"] == 1 ? "default-bg" : "parts-bg";
      this.partNumber = commonData["partNo"];
      this.partName = commonData["partName"];
      this.partDesc =
        commonData["partDesc"] == "" ? this.emptyCont : commonData["partDesc"];
      this.partAlt =
        commonData["alternatePartNo"] == ""
          ? this.emptyCont
          : "#" + commonData["alternatePartNo"];
      this.partStatus = parseInt(this.partsInfo["partStatus"]);
      this.partStatusText =
        this.partsInfo["partStatus"] == 1 ? "Active" : "Dicontinued";
      this.partType =
        commonData["partTypeName"] == "-"
          ? this.emptyCont
          : commonData["partTypeName"];
      this.partSystem =
        commonData["partSystemName"] == "-"
          ? this.emptyCont
          : commonData["partSystemName"];
      this.partAssembly =
        commonData["partAssemblyName"] == "-"
          ? this.emptyCont
          : commonData["partAssemblyName"];
      this.figNo =
        commonData["figNo"] == "" ? this.emptyCont : `${commonData["figNo"]}.`;
      this.refNo =
        commonData["refNo"] == "" ? this.emptyCont : `${commonData["refNo"]}.`;
      this.contributedBy = commonData["contributedBy"];
      this.threadId = this.partsInfo["threadId"];
      this.threadUrl = `${this.rootUrl}${this.partsInfo["threadUrl"]}`;
      this.profileUrl = `${this.rootUrl}${commonData["profileUrl"]}`;
      this.workstreams = this.partsInfo["workstreams"];
      this.appInfo =
        commonData["makeModels"] == ""
          ? ""
          : JSON.parse(commonData["makeModels"]);
      this.appFlag = this.appInfo == "" ? false : true;
      this.appList = [];

      if (this.appFlag) {
        for (let app of this.appInfo) {
          console.log(app);
          for (let year in app.year) {
            let y = app.year[year];
            app.year[year] = y == 0 ? "All" : y;
          }
          let appData = [];
          appData["model"] = app.model;
          appData["year"] = app.year;

          this.appList.push({
            class: "app_info",
            title: app.genericProductName,
            appData: appData,
            isDisabled: false,
            isExpanded: true,
          });
        }
      }

      if (this.tvsFlag) {
        if (commonData["productCode"].length) {
          this.partsList.productCodeList.push({
            display: "row",
            title: "Product Code",
            class: "prod_code",
            values: commonData["productCode"],
          });
        }
        let traditionalInfo = [];
        this.partsList.traditionalInfo = [];
        if (
          commonData["tadditionalInfoData1"] &&
          commonData["tadditionalInfoData1"].length
        ) {
          traditionalInfo = [...commonData["tadditionalInfoData1"]];
        }
        if (
          commonData["tadditionalInfoData2"] &&
          commonData["tadditionalInfoData2"].length
        ) {
          traditionalInfo = [...commonData["tadditionalInfoData2"]];
        }
        if (
          commonData["tadditionalInfoData3"] &&
          commonData["tadditionalInfoData3"].length
        ) {
          traditionalInfo = [...commonData["tadditionalInfoData3"]];
        }
        if (
          commonData["tadditionalInfoData4"] &&
          commonData["tadditionalInfoData4"].length
        ) {
          traditionalInfo = [...commonData["tadditionalInfoData4"]];
        }
        if (
          commonData["tadditionalInfoData5"] &&
          commonData["tadditionalInfoData5"].length
        ) {
          traditionalInfo = [...commonData["tadditionalInfoData5"]];
        }
        if (
          commonData["tadditionalInfoData6"] &&
          commonData["tadditionalInfoData6"].length
        ) {
          traditionalInfo = [...commonData["tadditionalInfoData6"]];
        }
        if (traditionalInfo.length) {
          this.partsList.traditionalInfo.push({
            display: "table",
            title: "Additional Model Info",
            class: "prod_code",
            values: [
              ...commonData["tadditionalInfoData1"],
              ...commonData["tadditionalInfoData2"],
              ...commonData["tadditionalInfoData3"],
              ...commonData["tadditionalInfoData4"],
              ...commonData["tadditionalInfoData5"],
              ...commonData["tadditionalInfoData6"],
            ],
          });
        }
        if (response.partsData[0].application.colorNames.length) {
          this.partsList.colorNames.push({
            display: "row",
            title: "Colour",
            class: "colour_code",
            values: [...response.partsData[0].application.colorNames],
          });
        }
      }
      console.log(this.appList, this.partsList.productCodeList);

      this.tags = this.partsInfo["tagsNames"];
      this.errCode =
        this.partsInfo["errorCode"]["errorCode"].length == 0
          ? "-"
          : this.partsInfo["errorCode"]["errorCode"];
      this.relatedThreads =
        this.partsInfo["relatedThreadsUserSelected"]["threads"];
      this.attachments = this.partsInfo["uploadContents"];
      console.log(this.attachments);
      this.attachmentLoading = this.attachments.length > 0 ? false : true;
      this.company = this.emptyCont;
      this.website = this.emptyCont;
      this.phone = this.emptyCont;
      this.estPrice = this.emptyCont;
      this.soldUs = this.emptyCont;
      this.srcInfo = this.emptyCont;
      this.warning = this.emptyCont;
      let createdDate = moment.utc(this.partsInfo["createdOn"]).toDate();
      let localCreatedDate = moment(createdDate)
        .local()
        .format("MMM DD, YYYY h:mm A");
      let updatedDate = moment.utc(this.partsInfo["updatedOn"]).toDate();
      let localUpdatedDate = moment(updatedDate)
        .local()
        .format("MMM DD, YYYY h:mm A");
      this.likeStatus = this.partsInfo["likeStatus"];
      this.pinStatus = this.partsInfo["pinStatus"];
      this.likeCount = this.partsInfo["likeCount"];
      this.pinCount = this.partsInfo["pinCount"];
      this.viewCount = this.partsInfo["viewCount"];

      this.disableLikeFlag =
        this.userId == this.partsInfo["createdById"] ? true : false;
      this.likeImg =
        this.likeStatus == 1 ? "like-active.png" : "like-normal.png";
      this.pinImg = this.pinStatus == 1 ? "pin-active.png" : "pin-normal.png";

      this.createdOn =
        this.partsInfo["createdOn"] == "" ? "-" : localCreatedDate;
      this.createdBy = this.partsInfo["createdBy"];
      this.createdByImg = this.partsInfo["createdByProfileImg"];
      this.modifiedOn =
        this.partsInfo["updatedOn"] == "" ? "-" : localUpdatedDate;
      this.modifiedBy = this.partsInfo["updatedBy"];
      this.modifiedByImg = this.partsInfo["updatedByProfileImg"];
      let userInfo = {
        createdBy: this.createdBy,
        createdOn: this.createdOn,
        updatedBy: this.modifiedBy,
        updatedOn: this.modifiedOn,
      };
      this.systemInfo = {
        header: false,
        workstreams: this.workstreams,
        userInfo: userInfo,
      };

      let ownaccess = false;
      let editAccess = false;
      let deleteAccess = false;
      let duplicateAccess = false;

     // if(this.platformId == 1){
        ownaccess =
        this.userId == this.partsInfo["createdById"]
          ? true
          : false;

      /*}else{
        ownaccess =
        this.roleId == '3' || this.roleId == '10' || this.userId == this.partsInfo["createdById"]
          ? true
          : false;
      }*/

      if(this.partsInfo["isPublished"] == 2){
        editAccess = ownaccess ? true : this.accessLevel.edit;
        deleteAccess = ownaccess ? true : this.accessLevel.delete;
        duplicateAccess = this.accessLevel.edit;
      }
      else if(this.partsInfo["isPublished"] == 1){
        editAccess = ownaccess;
        deleteAccess = ownaccess;
        duplicateAccess = false;
      }
      else{
        editAccess = false;
        deleteAccess = false;
        duplicateAccess = false;
      }



      let data = {
        access: 'parts',
        ownerAccess: ownaccess,
        editAccess: editAccess,
        deleteAccess: deleteAccess,
        duplicateAccess: duplicateAccess,
        loading: false
      }
      this.commonApi.emitDetailData(data);
      this.loading = false;
    });
  }

  // Get Recent Part View Lists
  getRecentPartViews() {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      offset: 0,
      limit: 10,
      partId: this.partId,
    };

    this.partsApi.recentPartViews(apiData).subscribe((response) => {
      console.log(response);
      if (response.status == "Success") {
        let recentList = response.partsData;
        this.recentPartEmpty = recentList.length > 0 ? false : true;
        console.log(this.recentPartEmpty);
        if (!this.recentPartEmpty) {
          let resultData = recentList;
          for (let i in resultData) {
            let appInfo =
              resultData[i].makeModels == ""
                ? resultData[i].makeModels
                : JSON.parse(resultData[i].makeModels);
            switch (appInfo.length) {
              case 0:
                resultData[i].make = "All Makes";
                resultData[i].makeList = [];
                resultData[i].model = "All Models";
                resultData[i].year = "-";
                resultData[i].modelList = [];
                resultData[i].year = "";
                resultData[i].yearList = [];
                break;
              case 1:
                resultData[i].make = appInfo[0].genericProductName;
                resultData[i].makeList = [];
                resultData[i].model =
                  appInfo[0].model.length > 1
                    ? this.multipleHtml + " Models"
                    : appInfo[0].model[0];
                resultData[i].modelList = appInfo[0].model;
                resultData[i].year =
                  appInfo[0].year.length == 0
                    ? ""
                    : appInfo[0].year.length > 1
                    ? this.multipleHtml + " Years"
                    : appInfo[0].year;
                resultData[i].yearList =
                  appInfo[0].year.length > 1
                    ? this.multipleHtml
                    : appInfo[0].year[0];
                break;
              default:
                resultData[i].make = this.multipleHtml + " Makes";
                resultData[i].makeList = appInfo;
                resultData[i].model = this.multipleHtml + " Models";
                resultData[i].modelList = appInfo;
                resultData[i].year = this.multipleHtml + " Years";
                resultData[i].yearList = appInfo;
                break;
            }
          }
          this.recentLists = resultData;
        }
      }
    });
  }

  // Like, Pin Action
  socialAction(type, status) {
    let actionStatus = "";
    let actionFlag:any = true;
    let likeCount = this.partsInfo["likeCount"];
    let pinCount = this.partsInfo["pinCount"];
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == RedirectionPage.Parts);
    let routeLoadText = pageTitle[routeLoadIndex].routerText;
    localStorage.setItem(routeLoadText, actionFlag);
    switch (type) {
      case "like":
        actionFlag = this.disableLikeFlag || this.likeLoading ? false : true;
        actionStatus = status == 0 ? "liked" : "disliked";
        this.partsInfo["likeStatus"] = status == 0 ? 1 : 0;
        this.likeStatus = this.partsInfo["likeStatus"];
        this.likeImg =
          this.likeStatus == 1 ? "like-active.png" : "like-normal.png";
        this.partsInfo["likeCount"] =
          status == 0 ? likeCount + 1 : likeCount - 1;
        this.likeCount = this.partsInfo["likeCount"];
        break;
      case "pin":
        actionFlag = this.pinLoading ? false : true;
        actionStatus = status == 0 ? "pined" : "dispined";
        this.partsInfo["pinStatus"] = status == 0 ? 1 : 0;
        this.pinStatus = this.partsInfo["pinStatus"];
        this.pinImg = this.pinStatus == 1 ? "pin-active.png" : "pin-normal.png";
        this.partsInfo["pinCount"] = status == 0 ? pinCount + 1 : pinCount - 1;
        this.pinCount = this.partsInfo["pinCount"];
        break;
    }
    if (actionFlag) {
      let apiData = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        threadId: this.partId,
        postId: this.partsInfo["postId"],
        ismain: 1,
        status: actionStatus,
        type: type,
      };
      this.partsApi.likePinAction(apiData).subscribe((response) => {
        if (response.status != "Success") {
          switch (type) {
            case "like":
              this.partsInfo["likeStatus"] = status;
              this.likeStatus = this.partsInfo["likeStatus"];
              this.likeImg =
                this.likeStatus == 1 ? "like-active.png" : "like-normal.png";
              this.partsInfo["likeCount"] =
                status == 0 ? likeCount - 1 : likeCount + 1;
              this.likeCount = this.partsInfo["likeCount"];
              break;
            case "pin":
              this.partsInfo["pinStatus"] = status;
              this.pinStatus = this.partsInfo["pinStatus"];
              this.pinImg =
                this.pinStatus == 1 ? "pin-active.png" : "pin-normal.png";
              this.partsInfo["pinCount"] =
                status == 0 ? pinCount - 1 : pinCount + 1;
              this.pinCount = this.partsInfo["pinCount"];
              break;
          }


        }

        let apiDatasocial = new FormData();
                    apiDatasocial.append('apiKey', Constant.ApiKey);
                    apiDatasocial.append('domainId', this.domainId);
                    apiDatasocial.append('threadId', this.partId);
                    apiDatasocial.append('actionType', '4');
                    apiDatasocial.append('postId', this.partId);
                    apiDatasocial.append('userId', this.userId);
                    apiDatasocial.append('action', type);
                    this.baseService.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
      });
    }
  }

  // Navigate URL
  navUrl(action, url) {
    if (action == "store") {
      localStorage.setItem("partNav", `parts/view/${this.partId}`);
    }
    setTimeout(() => {
      if (this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, "_blank");
      }
    }, 50);
  }

  tapOnThread(threadId)
  {
    let threadUrlNav=forumPageAccess.threadpage+threadId;
    window.open(threadUrlNav, "_blank");
  }

  // header event tab/click
  threadHeaderAction(event) {
    switch (event) {
      case "delete":
        this.delete();
        break;
    }
  }

  // Delete Part
  delete() {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      console.log(receivedService);
      if (receivedService) {
        const submitModalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        let apiData = {
          apiKey: Constant.ApiKey,
          domainId: this.domainId,
          countryId: this.countryId,
          userId: this.userId,
          contentType: this.contentType,
          partId: this.partId,
        };

        this.partsApi.deletePart(apiData).subscribe((response) => {
          submitModalRef.dismiss("Cross click");
          this.successMsg = response.result;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;
          let solrContType:any = SolrContentTypeValues.Parts;
          let apiDatasocial = new FormData();
          apiDatasocial.append('apiKey', Constant.ApiKey);
          apiDatasocial.append('domainId', this.domainId);
          apiDatasocial.append('threadId', this.partId);
          apiDatasocial.append('userId', this.userId);
          apiDatasocial.append('type', solrContType);
          apiDatasocial.append('action', 'delete');
          this.baseService.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            let wsNav:any = localStorage.getItem('wsNav');
            let wsNavUrl = localStorage.getItem('wsNavUrl');
            let url = (wsNav) ? wsNavUrl : this.navUrl;
            let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
            let chkRouteLoad, navFromEdit = '';
            if(routeLoadIndex >= 0) {
              let routeText = pageTitle[routeLoadIndex].routerText;
              let navEditText = pageTitle[routeLoadIndex].navEdit;
              chkRouteLoad = localStorage.getItem(routeText);
              let navFromEdit:any = localStorage.getItem(navEditText);
              setTimeout(() => {
                localStorage.removeItem(navEditText);
              }, 100);
              navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
            }
            let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad
            if(navFromEdit || routeLoad) {
              this.router.navigate([url]);
            } else {
              this.location.back();
            }
            let data = {
              access: 'parts',
              action: 'silentDelete',
              pushAction: 'load',
              threadId: this.partId
            }
            this.commonApi.emitMessageReceived(data);
            setTimeout(() => {
              localStorage.removeItem('wsNav');
              localStorage.removeItem('wsNavUrl');
              localStorage.removeItem(silentItems.silentPartCount);
            }, 100);
          }, 5000);
        });
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    //let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let headerHeight = 60;
    this.innerHeight = this.bodyHeight - (headerHeight + 20);
  }

  beforeParentPanelOpened(panel, appData) {
    panel.isExpanded = true;
    if (panel.id == "app-info") {
      for (let v of appData) {
        v.isExpanded = true;
      }
    }
    console.log("Panel going to  open!");
  }

  beforeParentPanelClosed(panel, appData) {
    panel.isExpanded = false;
    if (panel.id == "app-info") {
      for (let v of appData) {
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
}
