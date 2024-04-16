import { Component, OnInit, ViewChild, OnDestroy, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage, DefaultNewImages, ContentTypeValues, DefaultNewCreationText } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../services/landingpage/landingpage.service';
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ThreadService } from "src/app/services/thread/thread.service";
import { NgxMasonryComponent } from "ngx-masonry";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SuccessModalComponent } from "../../common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../common/submit-loader/submit-loader.component";

@Component({
  selector: "app-market-place-quiz-topics",
  templateUrl: "./market-place-quiz-topics.component.html",
  styleUrls: ["./market-place-quiz-topics.component.scss"],
  styles: [
    `
      .masonry-item {
        width: 238px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class MarketPlaceQuizTopicsComponent implements OnInit, OnDestroy {
  public title: string = "Market Place Quiz";
  public sconfig: PerfectScrollbarConfigInterface = {};
  serviceProviderData: any = [];
  public headTitle: string = "";
  public filterInitFlag: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public expandFlag: boolean = false;
  public disableRightPanel: boolean = true;
  public filterActiveCount: number = 0;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  pageAccess: string = "market-place-quiz";
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public updateMasonryLayout: any;
  public pageData = pageInfo.marketPlacePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "market-place/manage";
  public groupId: number = 38;
  public threadTypesort = "sortthread";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
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
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;
  loading: any =false;

  public thumbView: boolean = true;
  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public searchVal;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public access: string;
  public msTeamAccessMobile: boolean = false;
  scrollCallback: boolean;
  scrollTop: any;
  lastScrollTop: any = 0;
  scrollInit: number = 0;
  marketPlaceTotalData: any;
  dataLimit: any = 20;
  dataOffset: any = 0;
  loadingmarketplacemore: boolean = false;
  pageTitleText = PageTitleText.MarketPlace;
  redirectionPage = RedirectionPage.MarketPlace;
  displayNoRecordsShow = 3;
  contentTypeDefaultNewImg = DefaultNewImages.MarketPlace;
  contentTypeValue = ContentTypeValues.MarketPlace;
  contentTypeDefaultNewText = DefaultNewCreationText.MarketPlace;
  contentTypeDefaultNewTextDisabled: boolean = false;
  partsUrl: string = "market-place/manage/";
  actionFlag: any = false;
  public newPartInfo: string = "Get started by tapping on \"New Training\"";
  topicData: any = [];
  topicValue: any = '';
  showTopicError: boolean;
  topicSubmitted: boolean = false;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  copyTopic: any = false;
  currentTopicId: any;
  manageTitle: string;
  buttonTitle: string;
  serverError: any = '';
  showServerTopicError: any = false;

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (
        inHeight >= totalHeight &&
        this.scrollCallback &&
        parseInt(this.marketPlaceTotalData) > this.serviceProviderData.length
      ) {
        this.loadingmarketplacemore = true;
        this.dataOffset += this.dataLimit;
        this.trainingData();
        this.scrollCallback = false;
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.updateMasonryLayout = true;
  }

  constructor(
    private threadApi: ThreadService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
  }

  ngOnInit(action = '') {
    this.msTeamAccess = false;
    this.msTeamAccessMobile = false;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.headTitle = "Marketplace";
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}s`
    );
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.thumbView = true;
    this.listTopicOptions();
    let threadViewType:any = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = threadViewType;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      searchKey: this.searchVal,
      historyFlag: this.historyFlag,
      pushAction: false
    };
    this.apiData = apiInfo;
    this.filterOptions["apiKey"] = Constant.ApiKey;
    this.filterOptions["userId"] = this.userId;
    this.filterOptions["domainId"] = this.domainId;
    this.filterOptions["countryId"] = this.countryId;
    let viewType = this.thumbView ? "thumb" : "list";
    this.filterOptions["threadViewType"] = viewType;
    let year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    setTimeout(() => {
      this.apiData["groupId"] = this.groupId;
      this.apiData["mediaId"] = 0;
      this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
      this.filterInterval = setInterval(() => {
        let filterWidget = localStorage.getItem("filterWidget");
        let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
        if (filterWidget) {
          this.filterOptions = filterWidgetData.filterOptions;
          this.apiData = filterWidgetData.apiData;
          this.threadFilterOptions = this.apiData["filterOptions"];
          this.apiData["onload"] = true;
          this.threadFilterOptions = this.apiData["onload"];
          this.filterActiveCount = filterWidgetData.filterActiveCount;
          this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
          this.apiData["filterOptions"] = this.apiData["filterOptions"];
          this.apiData["filterOptions"]["action"] = action;
          this.commonService.emitMessageLayoutrefresh(
            this.apiData["filterOptions"]
          );
          this.filterLoading = false;
          this.filterOptions["filterLoading"] = this.filterLoading;
          clearInterval(this.filterInterval);
          localStorage.removeItem("filterWidget");
          localStorage.removeItem("filterData");
        }
      }, 50);
    }, 1500);
    setTimeout(() => {
      let chkData = localStorage.getItem('threadPushItem');
      let data = JSON.parse(chkData);
      if(data) {
        data.action = 'silentCheck';
      }
    }, 15000);
    this.loading = true;
    this.trainingData();
  }

  trainingData() {

    let domainId: any = localStorage.getItem('domainId');
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: localStorage.getItem('domainId')
    }
    this.scrollInit = 1;
    this.threadApi.apiGetMarketPlaceData(payload).subscribe((response: any) => {
      if (response && response.data && response.data.marketPlaceData && response.data.marketPlaceData.length) {
        response.data.marketPlaceData.forEach((data: any) => {
          this.serviceProviderData.push(data);
        });
      }
      this.updateMasonryLayout = true;
      this.loadingmarketplacemore = false;
      this.marketPlaceTotalData = response.data.totalRecords;
      this.loading = false;
      this.scrollCallback = true;
    }, (error: any) => {
      this.loading = false;
      this.scrollCallback = true;
      this.loadingmarketplacemore = false;
    })
  }

  rediretToNew() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/market-place/manage'])
    );
    window.open(url, '_blank');
  }

  goToListing(id: any) {
    if (id && id != '0') {
      this.router.navigateByUrl('market-place/quiz-topics/'+id);
    } else {
      this.router.navigateByUrl('market-place/quiz-topics/all');
    }
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY')
    } else {
      return '';
    }
  }
  getDateFormatStartDate(value: any) {
    if (value) {
      return moment(value).format('MMM DD')
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment(value).format('h:mm A')
    } else {
      return '';
    }
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 200);
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }
  expandDomainAction(event: any) {
    console.log(event);
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 200);
  }
  applyFilter(filterData,loadpush='') {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      if(loadpush) {
        filterData["loadAction"] = 'push';
        this.apiData['pushAction'] = true;
        let filterOptionData = this.filterOptions['filterData'];
        if(filterData.startDate != undefined || filterData.startDate != 'undefined') {
          let sindex = filterOptionData.findIndex(option => option.selectedKey == 'startDate');
          if(sindex >= 0) {
            filterOptionData[sindex].value = filterData.startDate;
          }
          let eindex = filterOptionData.findIndex(option => option.selectedKey == 'endDate');
          if(eindex >= 0) {
            filterOptionData[eindex].value = filterData.endDate;
          }
        }
      }
      this.apiData["filterOptions"] = filterData;
      setTimeout(() => {
        filterData["loadAction"] = '';
      }, 500);
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
      let viewType = this.thumbView ? "thumb" : "list";
      filterData["threadViewType"] = viewType;
      filterData["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(filterData);
      setTimeout(() => {
        this.filterLoading = false;
      }, 1000);
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem("threadFilter");
    this.ngOnInit('reset');
    //this.commonService.emitMessageLayoutrefresh('');
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
    this.applyFilter(getFilteredValues,event);
  }

  filterCheck(){
    this.filterrecords = false;
    if(this.pageRefresh['orderBy'] != 'desc'){
      this.filterrecords = true;
    }
    if(this.pageRefresh['type'] != 'sortthread'){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  navPart() {
    let url = this.newThreadUrl;
    window.open(url, IsOpenNewTab.teamOpenNewTab);
  }

  mainPage() {
    this.router.navigateByUrl('market-place');
  }

  innerDetailPage() {
    this.router.navigateByUrl('market-place/training');
  }

  viewDetail(id: any) {
    this.router.navigateByUrl('market-place/view/'+ id);
  }

  ngOnDestroy() {
  }

  listTopicOptions() {
    let firstObject: any = {
      id: "0",
      name: "All Questions",
    };
    this.threadApi.listQuizTopicWithRecords(this.domainId).subscribe((response: any) => {
      let array = response.data.quizTopicCountData ? response.data.quizTopicCountData : [];
      firstObject.totalCount = response.data.allQuestionCount
      this.topicData = [firstObject].concat(array);
    },(error: any) => {
      console.log("error: ", error);
    })
  }

  checkTopicValue() {
    this.showServerTopicError = false;
    this.serverError = '';
    if (this.topicValue) {
      this.showTopicError = false;
    } else {
      this.showTopicError = true;
    }
  }

  openDelete(topic: any) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = "DeleteEntity";
    modalRef.componentInstance.deleteEntityName = topic.name;
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteTopic(topic.id);
      }
    });
  }

  deleteTopic(id: any) {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    this.threadApi.deleteQuizTopic(id).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass);
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.modalConfig
      );
      msgModalRef.componentInstance.successMessage = response.message;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        this.listTopicOptions();
      }, 2000);
    });
  }

  submitTopic() {
    if (this.topicValue) {
      this.topicSubmitted = false;
      this.showTopicError = false;
      let body = {
        topic_name: this.topicValue,
        userId: this.userId,
        id: this.currentTopicId
      }
      let url: any = this.threadApi.duplicateQuizTopic(body);
      if (this.currentTopicId && !this.copyTopic) {
        url = this.threadApi.updateQuizTopic(body);
      }
      url.subscribe((response: any) => {
        if (response.status == 'Success') {
          this.actionFlag = false;
          this.listTopicOptions();
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = response.message;
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
          }, 2000);
        } else {
          this.showServerTopicError = true;
          this.serverError = response.message;
        }
      },(error: any) => {
        console.log("error: ", error);
      })
    } else {
      this.showTopicError = true;
      this.topicSubmitted = true;
    }
  }

  openEditPopup(id: any) {
    this.currentTopicId = id;
    if (this.copyTopic) {
      this.manageTitle = `${ManageTitle.actionNew} Topic`;
      this.buttonTitle = 'Save';
    } else {
      this.manageTitle = `${ManageTitle.actionEdit} Topic`;
      this.buttonTitle = 'Update';
    }
    this.actionFlag = true;
    this.threadApi.apigetTopicSingleData(id).subscribe((response: any) => {
      if(response.status == 'Success') {
        this.topicValue = response.data.topicData.topic_name
      }
    }, (error: any) => {
      console.log("error: ", error);
    })
  }

  isVideo(ext :any) {
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }
}
