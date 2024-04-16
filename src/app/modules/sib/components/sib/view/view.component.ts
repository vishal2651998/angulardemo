import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { ScrollTopService } from "src/app/services/scroll-top.service";
import { SibService } from "src/app/services/sib/sib.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { Constant, pageTitle, silentItems, IsOpenNewTab } from "src/app/common/constant/constant";
import { MatAccordion } from "@angular/material";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { CommonService } from "src/app/services/common/common.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @ViewChild("accordion", { static: true }) Accordion: MatAccordion;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public user: any;
  public apiKey;
  public platformId: number = 0;
  public domainId;
  public userId;
  public roleId;
  public sibId;
  public contentType: number = 30;
  public loading: boolean = true;
  public recentLoading: boolean = true;
  public recentLists: any;
  public successFlag: boolean = false;
  public successMsg: string = "";
  public attachmentLoading: boolean = true;
  public rootUrl: string = "";
  public viewPartInterval: any;

  public headerData: Object;
  public title = "SIB ID#";
  public pageAccess: string = "partView";
  public access: string = "sib";
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public multipleHtml: string = "Multiple";
  public emptyCont: string = "<i class='gray'>None</i>";
  public systemInfo: any;
  public workstreams;

  public bodyHeight: number;
  public innerHeight: number;

  public action = "view";
  public sibInfo: Object;
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
  public sibPlaceholderImg: string = "assets/images/common/default-sib-banner.png";
  public chevronImg: string = "assets/images/parts/chevron.png";
  public imgURL: any ;
  public bgClass: string;
  public compCatg: string;
  public ref: string;
  public releaseDate: string;
  public symptom: any;
  public system: any;
  public sibInfoCount: number = 0;
  public sibActionList: any = [];
  public appFlag: boolean;
  public teamSystem = localStorage.getItem("teamSystem");

  public attachments: any;
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
  public sibFlag: boolean = true;

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
    private sibApi: SibService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private commonApi: CommonService,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer
  ) {
    config.backdrop = "static";
    config.keyboard = false;

    config.size = "dialog-centered";
    this.accordionList = [
      {
        id: "app-info",
        class: "app-info sib-info",
        title: "Cut-off frame#",
        description: "",
        isDisabled: true,
        isExpanded: true,
      },
    ];

    this.referenceAccordion = [
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

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.scrollTopService.setScrollTop();
    this.bodyHeight = window.innerHeight;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;

    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.rootUrl = location.origin;
      console.log(this.rootUrl);
      this.sibId = this.route.snapshot.params["sid"];
      this.editRedirect = `sib/manage/edit/${this.sibId}`;
      this.apiKey = Constant.ApiKey;
      let platformId = localStorage.getItem("platformId");
      this.platformId = platformId == "undefined" || platformId == undefined ? this.platformId: parseInt(platformId);

      this.title = `${this.title}${this.sibId}`;
      this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

      this.headerData = {
        pageName: "sib",
        threadId: this.sibId,
        threadStatus: "",
        threadStatusBgColor: "",
        threadStatusColorValue: "",
        threadOwnerAccess: this.actionFlag,
      };

      this.industryType = this.commonApi.getIndustryType();
      this.tvsFlag = this.platformId == 2 && this.domainId == 52 ? true : false;
      let chkView = localStorage.getItem("sibPart");
      if(chkView == undefined || chkView == 'undefined') {
        // Get SIB Details
        this.getSibDetails();
      }
      
      setTimeout(() => {
        this.setScreenHeight();
      }, 400);
      if (!this.teamSystem) {
        setTimeout(() => {
          this.viewPartInterval = setInterval(() => {
            let viewPartWidget = localStorage.getItem("sibPart");
            if (viewPartWidget) {
              console.log("in view");
              this.loading = true;
              //this.getSibDetails();
              localStorage.removeItem("sibPart");
            }
          }, 50);
        }, 1500);
      }
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  // Get SIB Details
  getSibDetails() {
    let apiData = new FormData;
    apiData.append('apiKey', Constant.ApiKey);
    apiData.append('domainId', this.domainId);
    apiData.append('userId', this.userId);
    apiData.append('sibId', this.sibId);
    
    this.sibApi.getSibDetail(apiData).subscribe((response: any) => {
      console.log(response);
      this.sibInfo = response.sibData[0];
      this.imgURL = this.sibInfo['sibImageDesktop'] == "" ? this.sibPlaceholderImg : this.sibInfo['sibImageDesktop'];
      this.bgClass = this.sibInfo['isDefaultImg'] == 1 ? "default-bg" : "sib-bg";
      this.compCatg = this.sibInfo['complaintCategoryList'].join(', ');
      this.ref = this.sibInfo['sibRef'];
      this.chkSibInfo('ref');
      this.releaseDate = this.sibInfo['releaseDate'];
      console.log(this.sibInfo['releaseDate'])
      this.releaseDate = this.releaseDate != '' ? moment(this.releaseDate).format("MMM DD, YYYY") : '';
      console.log(this.releaseDate)
      this.chkSibInfo('releaseDate');
      let symptom = this.sibInfo['symptomsDataInfo'];
      let symptomList:any = [];
      symptom.forEach(item => {
        symptomList.push(item.name);
      });
      console.log(symptom)
      this.symptom = (symptomList.length == 0) ? '' : symptomList.join(', ');
      this.chkSibInfo('symptom');
      let system = this.sibInfo['systemSelectionData'];
      let systemList:any = [];
      system.forEach(sitem => {
        systemList.push(sitem.name);
      });
      this.system = (systemList.length == 0) ? '' : systemList.join(', ');
      console.log(system, systemList, this.system)
      this.chkSibInfo('systemSelection');
      let sibActions = this.sibInfo['sibActions'];
      sibActions.forEach((sib, index) => {
        console.log(sib, index)
        let content = sib.content;
        if(content != 'null' && content != '' && content != null){  
          let desc = '';
          //desc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(content));
          desc = this.authenticationService.ChatUCode(content);
          content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(desc));
          let contentLen = desc.replace(/<(?:.-|\n)*?>/gm, '').length;
          //console.log(contentLen)
          content = (contentLen == 0) ? '-' : content;
        } else {
          content = '-';
          console.log(content)
        }
        sib.content = content;
        let tagItems = [];
        let tagList = sib.tags;
        let partItems = [];
        let partsList = sib.partsInfo;
        tagList.forEach(t => {
          tagItems.push(t.name)
        });
        partsList.forEach(p => {
          let partNo = p.partNo;
          let partName = p.partName;
          let partInfo = `<span class="part-no">${partNo}</span><span class="part-name">${partName}</span>`;
          partItems.push(partInfo);
          console.log(partItems)
        });
        let frameList = sib.frameNumbers;
        console.log(tagItems, frameList)
        frameList.forEach((frame, i) => {
          let appData = [];
          appData.push(
            {
              label: 'Model',
              class: 'model',
              value: frame.modelInfo
            },
            {
              label: 'Cut-Off frame#',
              class: 'frame',
              value: frame.cutOffFrameNo
            },
            {
              label: 'Starting frame#',
              class: 'frame',
              value: frame.startFrameNo
            }
          );
          frame.class = "app_info";
          frame.title = frame.cutOffFrameNo;
          frame.appData = appData;
          frame.isDisabled = false;
          frame.isExpanded = (i == 0) ? true : false;
        });
        sibActions[index]['tagItems'] = tagItems;
        sibActions[index]['partItems'] = partItems;
      });
      console.log(sibActions)
      this.sibActionList = sibActions;
      //this.sibInfo['']
      let createdDate = moment.utc(this.sibInfo["createdOn"]).toDate();
      let localCreatedDate = moment(createdDate).local().format("MMM DD, YYYY h:mm A");
      let updatedDate = moment.utc(this.sibInfo["updatedOn"]).toDate();
      let localUpdatedDate = moment(updatedDate).local().format("MMM DD, YYYY h:mm A");
      this.workstreams = this.sibInfo["workstreamsInfo"];
      this.likeStatus = this.sibInfo["likeStatus"];
      this.pinStatus = this.sibInfo["pinStatus"];
      this.likeCount = this.sibInfo["likeCount"];
      this.pinCount = this.sibInfo["pinCount"];
      this.viewCount = this.sibInfo["viewCount"];

      this.disableLikeFlag = this.userId == this.sibInfo["createdById"] ? true : false;
      this.likeImg = this.likeStatus == 1 ? "like-active.png" : "like-normal.png";
      this.pinImg = this.pinStatus == 1 ? "pin-active.png" : "pin-normal.png";

      this.createdOn = this.sibInfo["createdOn"] == "" ? "-" : localCreatedDate;
      this.createdBy = this.sibInfo["createdBy"];
      this.createdByImg = this.sibInfo["createdByProfileImg"];
      this.modifiedOn = this.sibInfo["updatedOn"] == "" ? "-" : localUpdatedDate;
      this.modifiedBy = this.sibInfo["updatedBy"];
      this.modifiedByImg = this.sibInfo["updatedByProfileImg"];
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
      console.log(this.systemInfo)
      this.loading = false;
    });
  }

  // Checking SIB info value
  chkSibInfo(field) {
    let inc = 1;
    switch (field) {
      case 'ref':
        this.sibInfoCount = (this.ref != '') ? this.sibInfoCount+inc : this.sibInfoCount;
        break;
      case 'releaseDate':
        this.sibInfoCount = (this.releaseDate != '') ? this.sibInfoCount+inc : this.sibInfoCount;
        break;
      case 'symptom':
        this.sibInfoCount = (this.symptom != '') ? this.sibInfoCount+inc : this.sibInfoCount;
        break;
      case 'systemSelection':
        this.sibInfoCount = (this.system != '') ? this.sibInfoCount+inc : this.sibInfoCount;
        break;
    }
  }

  // Like, Pin Action
  socialAction(type, status) {
    let actionStatus = "";
    let actionFlag = true;
    let likeCount = this.sibInfo["likeCount"];
    let pinCount = this.sibInfo["pinCount"];
    switch (type) {
      case "like":
        actionFlag = this.disableLikeFlag || this.likeLoading ? false : true;
        actionStatus = status == 0 ? "liked" : "disliked";
        this.sibInfo["likeStatus"] = status == 0 ? 1 : 0;
        this.likeStatus = this.sibInfo["likeStatus"];
        this.likeImg =
          this.likeStatus == 1 ? "like-active.png" : "like-normal.png";
        this.sibInfo["likeCount"] =
          status == 0 ? likeCount + 1 : likeCount - 1;
        this.likeCount = this.sibInfo["likeCount"];
        break;
      case "pin":
        actionFlag = this.pinLoading ? false : true;
        actionStatus = status == 0 ? "pined" : "dispined";
        this.sibInfo["pinStatus"] = status == 0 ? 1 : 0;
        this.pinStatus = this.sibInfo["pinStatus"];
        this.pinImg = this.pinStatus == 1 ? "pin-active.png" : "pin-normal.png";
        this.sibInfo["pinCount"] = status == 0 ? pinCount + 1 : pinCount - 1;
        this.pinCount = this.sibInfo["pinCount"];
        break;
    }
    if (actionFlag) {
      let apiData = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        sibId: this.sibId,
        postId: this.sibId,
        ismain: 1,
        status: actionStatus,
        type: type,
      };

      this.sibApi.likePinAction(apiData).subscribe((response) => {
        if (response.status != "Success") {
          switch (type) {
            case "like":
              this.sibInfo["likeStatus"] = status;
              this.likeStatus = this.sibInfo["likeStatus"];
              this.likeImg =
                this.likeStatus == 1 ? "like-active.png" : "like-normal.png";
              this.sibInfo["likeCount"] =
                status == 0 ? likeCount - 1 : likeCount + 1;
              this.likeCount = this.sibInfo["likeCount"];
              break;
            case "pin":
              this.sibInfo["pinStatus"] = status;
              this.pinStatus = this.sibInfo["pinStatus"];
              this.pinImg =
                this.pinStatus == 1 ? "pin-active.png" : "pin-normal.png";
              this.sibInfo["pinCount"] =
                status == 0 ? pinCount - 1 : pinCount + 1;
              this.pinCount = this.sibInfo["pinCount"];
              break;
          }
        }
      });
    }
  }

  // Navigate URL
  navUrl(action, url) {
    if (action == "store") {
      localStorage.setItem("partNav", `parts/view/${this.sibId}`);
    }
    setTimeout(() => {
      if (this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, "_blank");
      }
    }, 50);
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
          userId: this.userId,
          contentType: this.contentType,
          sibId: this.sibId,
          sibActionId: '',
          sibFrameNoId: ''
        };

        this.sibApi.deleteSib(apiData).subscribe((response) => {
          submitModalRef.dismiss("Cross click");
          this.successMsg = response.result;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            let wsNav:any = localStorage.getItem('wsNav');
            let wsNavUrl = localStorage.getItem('wsNavUrl');
            let url = (wsNav) ? wsNavUrl : this.navUrl;
            let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
            let navText = pageTitle[pageDataIndex].navEdit;
            let navFromEdit:any = localStorage.getItem(navText);
            setTimeout(() => {
              localStorage.removeItem(navText);
            }, 100);
            navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
            
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
              this.location.back();
            }
            let data = {
              access: 'sib',
              action: 'silentDelete',
              pushAction: 'load',
              sibId: this.sibId
            }
            this.commonApi.emitMessageReceived(data);
            setTimeout(() => {
              localStorage.removeItem('wsNav');
              localStorage.removeItem('wsNavUrl');
              localStorage.removeItem(silentItems.silentSIBCount);
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
    let footerHeight =
      document.getElementsByClassName("footer-content")[0].clientHeight;
    this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 20);
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
