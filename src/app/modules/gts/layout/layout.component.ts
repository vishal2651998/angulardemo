import * as moment from 'moment';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { GTSPage } from 'src/app/common/constant/constant';
import { GtsService } from 'src/app/services/gts/gts.service';
import { PopupComponent } from '../gts/popup/popup.component';
import { ScrollTopService } from 'src/app/services/scroll-top.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild('childAttachmentComponent') childComponent: any;
  public apiKey;
  public domainId;
  public countryId;
  public userId;
  public roleId;
  public gtsId;
  public loading: boolean = true;

  public headerData: Object;
  public title = "GTS View";
  public pageAccess: string = "gts";
  public bodyElem;
  public bodyClass: string = "submit-loader";

  public gtsInfo: Object;
  public vehicleInfo: any;
  public voiceInfo: any;
  public vehicleFlag: boolean;

  public tagFlag: boolean = false;
  public dtcFlag: boolean = false;
  public gtsChartFlag: boolean = false;
  public actionFlag: boolean = false;
  public successFlag: boolean = false;
  public successMsg: string = "";

  public editRedirect: string;
  public duplicateRedirect: string;
  public gtsPlaceholderImg: string = "assets/images/gts/gts-placeholder.png";
  public imgURL: any;
  public bgClass: string;
  public workstreams: any;
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
  public likeCount: number = 0;
  public viewCount: number = 0;
  public legacyGts: boolean = false;
  public systemInfo: any;
  public tvsFlag: boolean = false;
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
  public allAttachments: any = [];
  public totalAttachments: any = 0;
  public scrollCount: any = 1;
  public attachmentLimit: any = 10;
  public attachmentOffset: any = 0;
  public loadingdm: any = false;
  public scrollEventSet = false;
  public gettingAttachment = false;

  vehicleList = [];
  gtsRunTimeInfo: Object;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }


  constructor(
    private router: Router,
    public gtsApi: GtsService,
    private scrollTopService: ScrollTopService,
    private route: ActivatedRoute,
    private config: NgbModalConfig,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    localStorage.removeItem("InternalProcessID");
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass2);
    this.scrollTopService.setScrollTop();
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.domainId = localStorage.getItem("domainId");
    this.userId = localStorage.getItem("userId");
    this.roleId = localStorage.getItem("roleId");

    //document.getElementById('footer').classList.add('d-none');

    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
        (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.gtsId = this.route.snapshot.params["gid"];
      this.apiKey = "dG9wZml4MTIz";

      this.gtsApi.procedureId = this.gtsId;
      console.log("getGTSDetails");
      this.getGTSDetails();
      setTimeout(() => {
        this.setScreenHeight();
      }, 1500);
    }
    this.setAllAttachmentData(this.scrollCount);
  }

  setScreenHeight() {
    let headerHeight = 0;
    if (!this.teamSystem) {
      headerHeight = 50;
    }
    this.innerHeight = (this.bodyHeight - (headerHeight));
  }

  setAllAttachmentData(count: any) {
    this.loadingdm = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("procedureId", this.gtsId);
    apiFormData.append("limit", this.attachmentLimit);
    apiFormData.append("offset", this.attachmentOffset);
    this.allAttachments = [];
    this.gtsApi.allAttachmentData = [];
    this.gtsApi.getProcedureAttachment(apiFormData).then(() => {
      this.allAttachments = this.gtsApi.allAttachmentData;
      this.totalAttachments = this.gtsApi.totalAllAttachmentData;
      this.attachmentOffset = this.attachmentOffset + this.attachmentLimit;
      this.loadingdm = false;
      this.gettingAttachment = false;

      if (!this.scrollEventSet) {
        this.scrollEventSet = true;
        setTimeout(() => {
          const frozenBody: HTMLElement | null = document.querySelector('.all-gts-attachments .content-pad.h-100.show-scroller-on-hover');
          frozenBody.addEventListener('scroll', (e) => {
            const scrollTop: number = document.querySelector('.all-gts-attachments .content-pad.h-100.show-scroller-on-hover').scrollTop;
            const scrollMax: number = document.querySelector('.all-gts-attachments .content-pad.h-100.show-scroller-on-hover')
              .scrollHeight - document.querySelector('.all-gts-attachments .content-pad.h-100.show-scroller-on-hover').clientHeight;
            if (Math.trunc(scrollTop) === Math.trunc(scrollMax)) {
              console.log(scrollTop, scrollMax);
              console.log('You are at the bottom!');
              const limit = this.attachmentOffset;
              console.log(this.totalAttachments + '>' + limit);
              if (this.totalAttachments > limit) {
                if (!this.gettingAttachment) {
                  this.gettingAttachment = true;
                  this.setAllAttachmentData(this.scrollCount);
                }
              }
            }

          });
        }, 1000);
      } else {
        this.childComponent.ngOnInit();
      }

    }).catch((error: any) => {
      console.log(error);

      this.gettingAttachment = false;
      this.loadingdm = false;
    });
  }

  getFileSize(fileSize: any, decimals = 2) {
    if (fileSize === 0) return '0 MB';
    return (
        parseFloat((fileSize / 1024).toFixed(decimals)) + " MB"
    );
  }

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
        document.body.classList.remove('gts');
        this.gtsInfo = response.procedure[0];
        this.gtsRunTimeInfo = response.gtsRuntimeInfo
        this.gtsApi.isProcedureAvailable = response.isProcedureAvailable;
        this.gtsApi.processId = response.firstProcessId;
        this.gtsApi.optionButtonData.isButtonEnabled = false;
        this.imgURL =
          this.gtsInfo["gtsImg"] == ""
            ? this.gtsPlaceholderImg
            : this.gtsInfo["gtsImg"];
        this.bgClass = this.gtsInfo["gtsImg"] == "" ? "default" : "gts-bg";
        this.workstreams = this.gtsInfo["workstreams"];
        this.probCatgName = this.gtsInfo["productCategoryName"];
        this.name = this.gtsInfo["name"];
        this.addInfo =
          this.gtsInfo["additionalInfo"] == ""
            ? "NA"
            : this.gtsInfo["additionalInfo"];
        this.system = this.gtsInfo["systemSelection"];
        this.tags =
          this.gtsInfo["tags"] == "-" || this.gtsInfo["tags"] == "" || this.gtsInfo["tags"] == []
            ? "-"
            : JSON.parse(this.gtsInfo["tags"]);

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
        this.createdByImg = this.gtsInfo["createdByProfileImg"];
        this.updatedByImg = this.gtsInfo["updatedByProfileImg"];
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
        this.actionFlag =
          this.roleId == '3' || this.roleId == '10' || this.userId == this.gtsInfo["createdById"]
            ? true
            : false;
        /*if (this.actionFlag) {
          this.actionFlag = this.gtsInfo["editAccess"] == 1 ? true : false;
        }*/

        //this.headerData["threadOwnerAccess"] = this.actionFlag;

        this.headerData = {
          access: this.pageAccess,
          pageName: "gts",
          threadId: this.gtsId,
          threadOwnerAccess: this.actionFlag,
          profile: false,
          welcomeProfile: false,
          search: false,
          gtsTitle: `<span>GTS ID#${this.gtsId}</span>`,
          techSubmmit: '',
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

        this.vehicleInfo =
          this.gtsInfo["vehicleDetails"] == ""
            ? this.gtsInfo["vehicleDetails"]
            : JSON.parse(this.gtsInfo["vehicleDetails"]);
        this.vehicleFlag = this.vehicleInfo.length == 0 ? false : true;

        if (this.vehicleFlag) {
          this.vehicleList = [];
          for (let vh of this.vehicleInfo) {
            let vehicleData = [];
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
        }

        let userInfo = {
          createdBy: this.createdBy,
          createdOn: this.createdOn,
          updatedBy: this.updatedBy,
          updatedOn: this.updatedOn,
        };
        this.systemInfo = {
          header: true,
          workstreams: this.workstreams,
          userInfo: userInfo,
        };

        // console.log(this.vehicleList);
        this.loading = false;
        // console.log(this.gtsInfo);
      }
    });
  }
  exitData() {
    console.log('Step 1');
    if (this.gtsApi.procedure == undefined) {

      console.log('Step 2');
      console.log('check this.gtsApi.procedure if exitdata undefined==>', this.gtsApi.procedure);
      let gtslistpage = localStorage.getItem('gtsStartFrom');
      localStorage.removeItem('gtsStartFrom');
      if(gtslistpage == '1'){
        this.router.navigate(['gts/']).then(() => {
          (this.gtsApi.apiData as any) = {};
          console.log(' this.gtsApi.apiData in layout page', this.gtsApi.apiData);
          this.gtsApi.pageType = GTSPage.start;
          console.log(' this.gtsApi.pageType in layout page', this.gtsApi.pageType);
        });
      }
      else{
        this.router.navigate(['gts/view/', this.gtsId]).then(() => {
          (this.gtsApi.apiData as any) = {};
          console.log(' this.gtsApi.apiData in layout page', this.gtsApi.apiData);
          this.gtsApi.pageType = GTSPage.start;
          console.log(' this.gtsApi.pageType in layout page', this.gtsApi.pageType);
        });
      }
    } else {
      console.log('Step 3');
      this.config.backdrop = true;
      this.config.keyboard = true;
      this.config.windowClass = 'top-right-notification-popup';
      const modalRef = this.modalService.open(PopupComponent, this.config);
      modalRef.result.then((res) => {
        console.log('check res if exitData true ==>', this.gtsApi.procedure);
        document.body.classList.remove(this.config.windowClass);
      }).catch(err => {
        document.body.classList.remove(this.config.windowClass);
        console.log(err);
      });
    }
  }

  exit() {
    this.exitData();
  }
  ngOnDestroy(): void {
    //document.getElementById('footer').classList.remove('d-none');
  }

}
