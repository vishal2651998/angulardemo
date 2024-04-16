import { Component, OnInit, HostListener, Input, Output, OnDestroy, ViewChild, ElementRef, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { CommonService } from "../../../services/common/common.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Constant, pageTitle, silentItems, IsOpenNewTab, windowHeight } from "../../../common/constant/constant";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ThreadPostService } from "../../../services/thread-post/thread-post.service";
import { ApiService } from "../../../services/api/api.service";
import * as moment from "moment";
import { Title,DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { ProductMatrixService } from "../../../services/product-matrix/product-matrix.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ThreadService } from "../../../services/thread/thread.service";
import { KnowledgeArticleService } from "src/app/services/knowledge-article/knowledge-article.service";

@Component({
  selector: 'app-view-ka-detail',
  templateUrl: './view-ka-detail.component.html',
  styleUrls: ['./view-ka-detail.component.scss']
})
export class ViewKaDetailComponent implements OnInit, OnDestroy {
  @Input() knowledgeArticleId;
  @Input() public mediaServices;
  @Output() KAServices: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string = "thread-detail";
  public bodyClass1: string = "landing-page";
  public bodyElem;
  public title: string = "Knowledge Article ID# ";
  public loading: boolean = true;
  public knowledgeViewErrorMsg;
  public knowledgeViewError: boolean = false;
  public knowledgeViewData: any;
  public headerData: any;
  public user: any;
  public roleId;
  public platformId: number = 0;
  public domainId;
  public userId;
  public countryId;
  public navUrl: string = "";
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
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  public appList: any;
  showApplication: boolean = true;
  public industryType: any = "";
  public catgOptions: string = "";
  public disableLikeFlag: boolean = false;
  public assetPartPath: string = "assets/images/thread-detail/";
  public likeImg: string;
  public pinImg: string;
  public likeLoading: boolean = false;
  public pinLoading: boolean = false;
  public innerHeight: number;
  public bodyHeight: number;
  public accordionList: any;
  referenceAccordion: any;
  public systemInfo: any;
  public workStreamsData;
  public emptyList = [];
  public tagList: any;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public successMsg: string = "";
  public copiedModal: boolean = false;
  public viewDocument: boolean = true;
  public editAccess: boolean = false;
  public deleteAccess: boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private knowledgeArticleService: KnowledgeArticleService,
    private threadPostService: ThreadPostService,
    private apiUrl: ApiService,
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService,
    private location: Location,
  ) { }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];

    if(!document.body.classList.contains(this.bodyClass)) {
      document.body.classList.add(this.bodyClass);
    }

    if(!document.body.classList.contains(this.bodyClass1)) {
      document.body.classList.add(this.bodyClass1);
    }

    if(!document.body.classList.contains('view-modal-popup')) {
      document.body.classList.add('view-modal-popup');
    }
    this.industryType = this.commonApi.getIndustryType();
    this.title = `${this.title}${this.knowledgeArticleId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.navUrl = "knowledgearticles/view/" + this.knowledgeArticleId;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');


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
        id: "system",
        class: "system",
        title: "System",
        description: "",
        isDisabled: true,
        isExpanded: true
      }
    ];
    this.setScreenHeight();
    this.checkAccessLevel();
    setTimeout(() => {
      this.getKnowledgeArticleInfo();
    }, 500);

    this.commonApi.KADetailCloseReceivedSubject.subscribe((data) => {
      console.log(data)
      if(data['wdata'] != ''){
        let data1 = {
          action: 'workstream-select',
          wdata: data['wdata']
        }
        this.KAServices.emit(data1);
        setTimeout(() => {
          this.closeModal();
        },500);
      }
      else{
        this.closeModal();
      }
    });
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true, replyAccess = true, closeAccess = true;
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

      }, 700);
  }
   getKnowledgeArticleInfo() {
    this.knowledgeViewErrorMsg = "";
    this.knowledgeViewError = false;

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
          console.log(res);
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
              console.log(make)
              let title = (this.industryType.id != 2) ? app.genericProductName : `${app.manufacturer}${make}`;
              console.log(this.industryType.id)
              console.log(title)
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
            this.knowledgeViewData.updatedOn = moment(
              moment.utc(this.knowledgeViewData.updatedOn).toDate()
            )
              .local()
              .format("MMM DD, YYYY . h:mm A");
          }

          let userInfo = {};

          userInfo = {
            createdBy: this.knowledgeViewData.userName,
            createdOn: this.knowledgeViewData.createdOn,
            updatedBy: this.knowledgeViewData.updatedBy,
            updatedOn: this.knowledgeViewData.updatedOn,
          };

          if(this.knowledgeViewData.WorkstreamsList.length > 0) {
            this.workStreamsData = this.knowledgeViewData.WorkstreamsList;
          }
          this.tagList =  this.knowledgeViewData["tagsNames"] != null && this.knowledgeViewData["tagsNames"] != "" && this.knowledgeViewData["tagsNames"] != undefined ? this.knowledgeViewData["tagsNames"] : "";
          this.catgOptions =  this.knowledgeViewData["categoryOptions"] != null && this.knowledgeViewData["categoryOptions"] != "" && this.knowledgeViewData["categoryOptions"] != undefined ? this.knowledgeViewData["categoryOptions"] : "";
          if(this.catgOptions.length==1){
            if(this.knowledgeViewData["categoryOptions"][0]['id'] == 4){
              this.catgOptions = "";
            }
          }

          this.systemInfo = {
            header: false,
            workstreamsList: this.workStreamsData,
            categoryList: this.catgOptions,
            userInfo: userInfo,
            knowledgeData: true
          };

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

          this.editAccess = editAccess;
          this.deleteAccess = deleteAccess;

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

  // tab on user profile page
  taponprofileclick(userId) {
    var aurl = "profile/" + userId + "";
    window.open(aurl, IsOpenNewTab.openNewTab);
  }

   // Set Screen Height
   setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - 87 );
  }

  showViewError(result) {
    this.loading = false;
    this.knowledgeViewErrorMsg = result;
    this.knowledgeViewError = true;
  }
  threadHeaderAction(event) {
    this.checkAccess(event);
  }

  checkAccess(type){
    switch(type){
      case 'edit':
        this.edit();
        break;
      case 'delete':
        this.delete();
        break;
      case 'copylink':
        let currentURL1 = window.location.href;
        let currentURL2 = this.router.url;
        let currentURL3 = currentURL1.replace(currentURL2,"")
        console.log(currentURL3);
        let url = currentURL3+"/knowledgearticles/view/"+this.knowledgeArticleId;
        navigator.clipboard.writeText(url);
        this.copiedModal = true;
        setTimeout(() => {
          this.copiedModal = false;
        }, 1500);
        break;
      default:
        break;
    }
  }
  //edit document
  edit(){
    let url, surl, storage;
    let navOpenFlag = true;
    let contentTypeId = '7';
    contentTypeId = '7';
    navOpenFlag = false;
    storage = "docNav";
    url = `knowledgearticles/manage/edit/${this.knowledgeArticleId}`;
    //surl = `announcements/view/${this.dataId}`;
    surl = `knowledgearticles`;
    localStorage.setItem(storage, surl);
    //this.router.navigate([url]);
    this.closeModal();
    window.open(url,url);
  }

  closeModal() {
    let data = {
      action: false
    };
    this.KAServices.emit(data);
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
              //window.location.reload();
              msgModalRef.dismiss('Cross click');
              let data = {
                action: 'delete',
                id: this.knowledgeArticleId
              }
              this.KAServices.emit(data);
            }, 1000);

          });
      }
    });
  }

  beforeParentPanelOpened(panel, appData){
    panel.isExpanded = true;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = true;
      }
    }
    console.log("Panel going to  open!");
  }

  beforeParentPanelClosed(panel, appData) {
    panel.isExpanded = false;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = false;
      }
    }
  }

  afterPanelClosed(){
    console.log("Panel closed!");
  }

  afterPanelOpened(){
    console.log("Panel opened!");
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

    ngOnDestroy() {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove(this.bodyClass);
      this.bodyElem.classList.remove("view-modal-popup");
    }

  }


