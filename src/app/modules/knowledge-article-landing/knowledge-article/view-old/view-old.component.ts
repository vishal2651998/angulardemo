import { Component, OnInit, HostListener, Input, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { CommonService } from "../../../../services/common/common.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Constant, pageTitle, silentItems, IsOpenNewTab, windowHeight } from "../../../../common/constant/constant";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { ThreadPostService } from "../../../../services/thread-post/thread-post.service";
import { ApiService } from "../../../../services/api/api.service";
import * as moment from "moment";
import { Title,DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalComponent } from "../../../../components/common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../../components/common/submit-loader/submit-loader.component";
import { ProductMatrixService } from "../../../../services/product-matrix/product-matrix.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ThreadService } from "../../../../services/thread/thread.service";
import { KnowledgeArticleService } from "src/app/services/knowledge-article/knowledge-article.service";

@Component({
  selector: "app-view-old",
  templateUrl: "./view-old.component.html",
  styleUrls: ["./view-old.component.scss"],
})
export class ViewOldComponent implements OnInit {
  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  @ViewChild("print", { static: false }) print: ElementRef;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("tdpage", { static: false }) tdpage: ElementRef;

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string = "thread-detail";
  public bodyClass1: string = "landing-page";
  public bodyElem;
  public title: string = "Knowledge Article ID#";
  public industryType: any = "";
  public loading: boolean = true;
  public postLoading: boolean = true;
  public newPostLoad: boolean = false;
  public knowledgeViewErrorMsg;
  public knowledgeViewError: boolean = false;
  public knowledgeViewData: any;
  public knowledgeArticleId;
  public headerData: any;
  public disableLikeFlag: boolean = false;
  public assetPartPath: string = "assets/images/thread-detail/";
  public likeImg: string;
  public pinImg: string;
  public likeLoading: boolean = false;
  public pinLoading: boolean = false;
  public threadData: any;
  public rightPanel: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;
  public newPostForm: FormGroup;
  public editPostForm: FormGroup;
  public postServerError: boolean = false;
  public postServerErrorMsg: string = "";
  public submitted: boolean;
  public descMaxLen: number = 10000;
  public postUpload: boolean = true;
  public manageAction: string;
  public platformId: number = 0;
  public domainId;
  public userId;
  public countryId;
  public action = "view";
  public attachments: any;
  public attachmentLoading: boolean = true;
  public contentType: number = 7;
  public likeStatus: number;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public viewCount: number;
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public displayOrder: number = 0;
  public roleId;
  public showUpdatedOn: boolean = false;
  public apiData: Object;
  public user: any;
  public postError: boolean = false;
  public successMsg: string = "";
  public postErrorMsg;
  public loginUsername;
  public loginUserRole;
  public loginUserProfileImg;
  public midHeight;
  public loginUserAvailability;
  public closeStatus;
  public closedDate: string = "";
  public postButtonEnable: boolean = false;
  public continueButtonEnable: boolean = true;
  public postSaveButtonEnable: boolean = false;
  public postDesc: string = "";
  public postEditDesc: string = "";
  public threadUserId: number = 0;
  public threadOwner: boolean = false;
  public imageFlag: string = "false";
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public userRoleTitle: string = "";

  public itemLimit: any = 5;
  public itemOffset: any = 0;
  public itemLength: number = 0;
  public itemTotal: number;
  public postLists = [];
  public navUrl: string = "";
  public postData = [];
  public postDataLength: number = 0;
  public viewKAInterval: any;

  public postApiData: object;
  public postEditApiData: object;
  public pageAccess: string = "post";
  public dynamicGid: number = 0;

  public posteditServerError = false;
  public postEditServerErrorMsg = "";
  public submitted1 = false;
  public editPostUpload: boolean = true;
  public dashboard: string = "thread-dashboard";
  public dashboardTab: string = "views";
  public threadRemindersData: any = [];
  public accordionList: any;
  referenceAccordion: any;
  public emptyList = [];
  panelOpenState = false;
  public appList: any;
  showApplication: boolean = true;
  public buttonTop: boolean = false;
  public buttonBottom: boolean = false;
  public currentPostDataIndex: any = 0;
  public teamSystem = localStorage.getItem("teamSystem");
  public catgOptions: string = "";
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  constructor(
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private knowledgeArticleService: KnowledgeArticleService,
    private threadPostService: ThreadPostService,
    private apiUrl: ApiService,
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService
  ) {
  }
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    console.log(event, "onresize is called");
    setTimeout(() => {
      this.midHeight = windowHeight.height;
      this.midHeight = this.midHeight - 30;
      //this.getnorows();
    }, 50);

    setTimeout(() => {
      // alert(1);
      //this.loadKnowledgeArticlePage();
    }, 200);
  }
  callResizeFunc() {
    setTimeout(() => {
      this.midHeight = windowHeight.height;
      this.midHeight = this.midHeight - 30;
      //this.getnorows();
    }, 50);
  }
  // convenience getters for easy access to form fields
  get f() {
    return this.newPostForm.controls;
  }

  get f1() {
    return this.editPostForm.controls;
  }
  onScroll(event) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.knowledgeArticleId = params.id;
    });
    this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
      this.rightPanel = JSON.parse(flag);
    });

    this.title = `${this.title}${this.knowledgeArticleId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.navUrl = "knowledgearticles/view/" + this.knowledgeArticleId;
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
    ];
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.industryType = this.commonApi.getIndustryType();
    this.manageAction = "new";
    this.pageAccess = "post";
    this.postApiData = {
      access: "post",
      pageAccess: "post",
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
    };
    this.postEditApiData = {
      access: "post",
      pageAccess: "post",
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
    };

    this.checkAccessLevel();
    setTimeout(() => {
      this.getKnowledgeArticleInfo("init", 0);
    }, 300);
    if (!this.teamSystem) {
      setTimeout(() => {
        this.viewKAInterval = setInterval(() => {
          let viewPartWidget = localStorage.getItem("viewKA");
          if (viewPartWidget) {
            console.log("in view");
            this.loading = true;
            this.getKnowledgeArticleInfo("init", 0);
            localStorage.removeItem("viewKA");
          }
        }, 50);
      }, 1500);
    }
  }
  // tab on user profile page
  taponprofileclick(userId) {
    var aurl = "profile/" + userId + "";
    if (this.teamSystem) {
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    } else {
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(7, chkType, chkFlag);
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

  getKnowledgeArticleInfo(ininVal, pid) {
    this.knowledgeViewErrorMsg = "";
    this.knowledgeViewError = false;
    //if (ininVal == "init") {
      //this.loading = true;
    //}
    const apiFormData = new FormData();

    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("threadId", this.knowledgeArticleId);
    apiFormData.append("platform", '3');

    this.knowledgeArticleService
      .getKnowledgeArticlesDetails(apiFormData)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.knowledgeViewData = res.articlesData[0];
          this.attachments = this.knowledgeViewData["uploadContents"];
          this.attachmentLoading = this.attachments.length > 0 ? false : true;
          // let techTage = JSON.parse(this.knowledgeViewData.techTags);
          // if (techTage) {
          //   techTage = techTage.map((tag) => tag.techtag_name);
          //   this.knowledgeViewData.techTags = techTage;
          // }
          if (
            this.knowledgeViewData.makeModelsNew &&
            !this.knowledgeViewData.makeModelsNew.length
          ) {
            this.showApplication = false;
          }
          if (this.knowledgeViewData.makeModelsNew.length == 1) {
            let makeModel = this.knowledgeViewData.makeModelsNew[0];
            if (
              makeModel.genericProductName == "" &&
              !makeModel.year.length &&
              (makeModel.model || makeModel.model[0] == "")
            ) {
              this.showApplication = false;
            }
          }
          if (this.showApplication) {
            this.appList = [];

            for (let app of this.knowledgeViewData.makeModelsNew) {
              let appData = [];
              let appModel = [];

              if (
                app.model != null &&
                app.model &&
                app.model.length &&
                app.model[0] != "" &&
                app.model[0].includes(",")
              ) {
                appModel = app.model[0].split(",");
              }
              appData["model"] =
              app.model != null && app.model.length && app.model[0] != ""
                  ? appModel.length
                    ? appModel
                    : app.model
                  : [];
              let year =
                app.year.length == 1 && app.year[0] == 0 ? [] : app.year;
              appData["year"] = year;
              console.log(appData);
              let make = (app.genericProductName != '') ? `<span class="title-sep"></span>${app.genericProductName}` : app.genericProductName;
              let title = (this.industryType.id != 2) ? app.genericProductName : `${app.manufacturer}${make}`;
              title = title.replace("undefined", "All");
              this.appList.push({
                class: "app_info",
                title: title,
                appData: appData,
                isDisabled: false,
                isExpanded: true,
              });

            }
          }
          if (this.knowledgeViewData.createdOn != "") {
            this.knowledgeViewData.createdOn = moment(
              moment.utc(this.knowledgeViewData.createdOn).toDate()
            )
              .local()
              .format("MMM DD, YYYY . h:mm A");
          }
          if (this.knowledgeViewData.updatedOn != "") {
            this.showUpdatedOn = true;
            this.knowledgeViewData.updatedOn = moment(
              moment.utc(this.knowledgeViewData.updatedOn).toDate()
            )
              .local()
              .format("MMM DD, YYYY . h:mm A");
          }
          this.knowledgeViewData["description"]=this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(this.knowledgeViewData["description"]));
          this.likeStatus = this.knowledgeViewData["likeStatus"];
          this.pinStatus = this.knowledgeViewData["pinStatus"];
          this.likeCount = this.knowledgeViewData["likeCount"];
          this.pinCount = this.knowledgeViewData["pinCount"];
          this.viewCount = this.knowledgeViewData["viewCount"];
          this.catgOptions =  this.knowledgeViewData["categoryOptions"] != null && this.knowledgeViewData["categoryOptions"] != "" && this.knowledgeViewData["categoryOptions"] != undefined ? this.knowledgeViewData["categoryOptions"] : "";
          if(this.catgOptions.length==1){
            if(this.knowledgeViewData["categoryOptions"][0]['id'] == 4){
              this.catgOptions = "";
            }
          }
          this.disableLikeFlag =
            this.userId == this.knowledgeViewData["createdById"] ? true : false;
          this.likeImg =
            this.likeStatus == 1
              ? "thread-like-active.png"
              : "thread-like-normal.png";
          this.pinImg =
            this.pinStatus == 1
              ? "thread-pin-active.png"
              : "thread-pin-normal.png";

          this.callResizeFunc();
        }
        if (
          this.knowledgeViewData == "undefined" ||
          this.knowledgeViewData == undefined
        ) {
          this.loading = false;
          this.knowledgeViewErrorMsg = res.result;
          this.knowledgeViewError = true;
        } else {

          if (this.knowledgeViewData != "") {

          let access = false;
          let editAccess = false;
          let deleteAccess = false;

         // if(this.platformId == 1){
            access = this.userId == this.knowledgeViewData.userId ? true : false;
         /* }else{
            access = this.roleId == "3" || this.roleId == "10" ||
            this.userId == this.knowledgeViewData.userId
              ? true
              : false;
          }*/

          editAccess = access ? true : this.accessLevel.edit;
          deleteAccess = access ? true : this.accessLevel.delete;

            this.headerData = {
              threadId: this.knowledgeViewData.threadId,
              threadStatus: "",
              threadStatusBgColor: "",
              threadStatusColorValue: this.knowledgeViewData.colorValues,
              threadOwnerAccess: access,
              editAccess: editAccess,
              deleteAccess: deleteAccess,
              reopenThread: "",
              closeThread: this.closeStatus,
              pageName: "knowledgearticles",
              accessLevel: this.accessLevel
            };

            setTimeout(() => {
              this.loading = false;
            }, 1000);
          } else {
            this.showViewError(res.result);
          }
        }
        console.error(res);
      });
  }
  // Delete knowledge article
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
          postId: this.knowledgeViewData["postId"],
          dataId: this.knowledgeViewData["threadId"],
        };

        this.knowledgeArticleService
          .deleteKnowledgeArticle(apiData)
          .subscribe((response) => {
            submitModalRef.dismiss("Cross click");
            console.error("deleted", response);
            this.successMsg = response.result;
            const msgModalRef = this.modalService.open(
              SuccessModalComponent,
              this.modalConfig
            );
            msgModalRef.componentInstance.successMessage = this.successMsg;
            setTimeout(() => {
              msgModalRef.dismiss("Cross click");
              let navUrl = "knowledgearticles";
              let pageDataIndex = pageTitle.findIndex(option => option.slug == navUrl);
              let navText = pageTitle[pageDataIndex].navEdit;
              let navFromEdit:any = localStorage.getItem(navText);
              setTimeout(() => {
                localStorage.removeItem(navText);
              }, 100);
              navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
              let wsNav:any = localStorage.getItem('wsNav');
              let wsNavUrl = localStorage.getItem('wsNavUrl');
              let url = (wsNav) ? wsNavUrl : navUrl;

              let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
              let chkRouteLoad;
              if(routeLoadIndex >= 0) {
                let routeText = pageTitle[routeLoadIndex].routerText;
                chkRouteLoad = localStorage.getItem(routeText);
              }
              let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad
              if(navFromEdit || routeLoad) {
                this.router.navigate([url]);
              } else {
                localStorage.setItem('deleteArticles','1');


                this.location.back();
                this.commonApi.deleteArticlesData('delete');
              }
              let data = {
                access: 'knowledgearticles',
                action: 'silentDelete',
                pushAction: 'load',
                threadId: this.knowledgeArticleId
              }
              this.commonApi.emitMessageReceived(data);
              setTimeout(() => {
                localStorage.removeItem('wsNav');
                localStorage.removeItem('wsNavUrl');
                localStorage.removeItem(silentItems.silentKACount);
              }, 100);
            }, 2000);
          });
      }
    });
  }
  showViewError(result) {
    this.loading = false;
    this.postLoading = false;
    this.knowledgeViewErrorMsg = result;
    this.knowledgeViewError = true;
  }
  // Like, Pin Action
  socialAction(type, status) {
    if (this.userId == this.knowledgeViewData.userId) return;
    let actionStatus = "";
    let actionFlag = true;
    let likeCount = this.knowledgeViewData["likeCount"];
    let pinCount = this.knowledgeViewData["pinCount"];
    switch (type) {
      case "like":
        actionFlag = this.disableLikeFlag || this.likeLoading ? false : true;
        actionStatus = status == 0 ? "liked" : "disliked";
        this.knowledgeViewData["likeStatus"] = status == 0 ? 1 : 0;
        this.likeStatus = this.knowledgeViewData["likeStatus"];
        this.likeImg =
          this.likeStatus == 1
            ? "thread-like-active.png"
            : "thread-like-normal.png";
        this.knowledgeViewData["likeCount"] =
          status == 0 ? likeCount + 1 : likeCount - 1;
        this.likeCount = this.knowledgeViewData["likeCount"];
        break;
      case "pin":
        actionFlag = this.pinLoading ? false : true;
        actionStatus = status == 0 ? "pined" : "dispined";
        this.knowledgeViewData["pinStatus"] = status == 0 ? 1 : 0;
        this.pinStatus = this.knowledgeViewData["pinStatus"];
        this.pinImg =
          this.pinStatus == 1
            ? "thread-pin-active.png"
            : "thread-pin-normal.png";
        this.knowledgeViewData["pinCount"] =
          status == 0 ? pinCount + 1 : pinCount - 1;
        this.pinCount = this.knowledgeViewData["pinCount"];
        break;
    }
    console.error("actionFlag", actionFlag);
    if (actionFlag) {
      let apiData = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        threadId: this.knowledgeViewData["threadId"],
        postId: this.knowledgeViewData["postId"],
        ismain: 1,
        status: actionStatus,
        type: type,
      };

      this.knowledgeArticleService
        .likePinAction(apiData)
        .subscribe((response) => {
          if (response.status != "Success") {
            switch (type) {
              case "like":
                this.knowledgeViewData["likeStatus"] = status;
                this.likeStatus = this.knowledgeViewData["likeStatus"];
                this.likeImg =
                  this.likeStatus == 1
                    ? "thread-like-active.png"
                    : "thread-like-normal.png";
                this.knowledgeViewData["likeCount"] =
                  status == 0 ? likeCount - 1 : likeCount + 1;
                this.likeCount = this.knowledgeViewData["likeCount"];
                break;
              case "pin":
                this.knowledgeViewData["pinStatus"] = status;
                this.pinStatus = this.knowledgeViewData["pinStatus"];
                this.pinImg =
                  this.pinStatus == 1
                    ? "thread-pin-active.png"
                    : "thread-pin-normal.png";
                this.knowledgeViewData["pinCount"] =
                  status == 0 ? pinCount - 1 : pinCount + 1;
                this.pinCount = this.knowledgeViewData["pinCount"];
                break;
            }
          }
        });
    }
  }
  threadHeaderAction(event) {
    if (event == "delete") {
      this.delete();
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

