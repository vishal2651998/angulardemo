import { Component, OnInit, ViewChild, OnDestroy, HostListener, ElementRef, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage, DefaultNewImages, ContentTypeValues, DefaultNewCreationText, filterNames } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ThreadService } from "src/app/services/thread/thread.service";
import { NgxMasonryComponent } from "ngx-masonry";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FilterComponent } from "../../common/filter/filter.component";

@Component({
  selector: "app-market-place-inner-page",
  templateUrl: "./market-place-inner-page.component.html",
  styleUrls: ["./market-place-inner-page.component.scss"],
  styles: [
    `
      .masonry-item {
        width: 240px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class MarketPlaceInnerPageComponent implements OnInit, OnDestroy {
  public title: string = "Market Place Training";
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
  @ViewChild("top", { static: false }) top: ElementRef;
  pageAccess: string = "market-place-training";
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
  loading: any = false;

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
  public sideMenuActive = 'market-place/training';
  public bodyElem;
  public footerElem;
  public access: string;
  public msTeamAccessMobile: boolean = false;
  scrollCallback: boolean;
  scrollTop: any;
  lastScrollTop: any = 0;
  scrollInit: number = 0;
  marketPlaceTotalData: any;
  dataLimit = 20;
  dataOffset = 0;
  loadingmarketplacemore: boolean = false;
  pageTitleText = PageTitleText.MarketPlace;
  redirectionPage = RedirectionPage.MarketPlace;
  displayNoRecordsShow = 3;
  contentTypeDefaultNewImg = DefaultNewImages.MarketPlace;
  contentTypeValue = ContentTypeValues.MarketPlace;
  contentTypeDefaultNewText = DefaultNewCreationText.MarketPlace;
  contentTypeDefaultNewTextDisabled: boolean = false;
  partsUrl: string = "market-place/manage/";

  public newPartInfo: string = "Get started by tapping on \"New Training\"";
  trainingType = 'upcoming';
  selectedTrainingType;
  defaultCart: any = {
    cartId: null,
    userId: null,
    email: '',
    phoneNumber: {
      countryCode: '',
      dialCode: '',
      e164Number: '',
      internationalNumber: '',
      phoneNumber: ''
    },
    totalAmount: 0,
    manualIds: [],
    trainingIds: []
  };
  cart: any = this.defaultCart;
  newCartItem: any;
  showCartUserPopup = false;
  workStreamIds: any;

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
    private ref: ChangeDetectorRef,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - ' + this.title);
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
    let threadViewType: any = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = threadViewType;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    let url: any = this.router.url;
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
    this.backScroll();
    this.displayNoRecordsShow = 3;
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
      if (data) {
        data.action = 'silentCheck';
      }
    }, 15000);
    setTimeout(() => {
      if (this.top != undefined) {
        this.top.nativeElement.scroll({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }
    }, 1000);
    this.serviceProviderData = [];
    this.loading = true;
    this.trainingData();
    this.getCart();
    this.commonService.cartUpdateSubject.subscribe((cart) => this.getCart());
  }

  backScroll() {
    let scrollPos = localStorage.getItem('wsScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos) + inc;
    setTimeout(() => {
      localStorage.removeItem('wsScrollPos');
      this.updateMasonryLayout = true;
      setTimeout(() => {
        this.updateMasonryLayout = false;
      }, 50);
      setTimeout(() => {
        let id = 'marketplace-data-container';
        this.scrollToElem(id);
      }, 500);
    }, 5);
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement: any = document.getElementById(id);
    if (secElement != 'undefined' && secElement != undefined) {
      secElement.scrollTop = this.scrollTop;
    }
  }

  trainingData() {
    let domainId: any = localStorage.getItem('domainId');
    let filterData = this.apiData["filterOptions"];
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: localStorage.getItem('domainId'),
      currentFilter: filterData?.trainingType,
      trainingStatus: filterData?.trainingStatus,
      startDate: filterData?.startDate,
      endDate: filterData?.endDate,
      trainingType: this.trainingType
    }
    this.scrollInit = 1;
    this.threadApi.apiGetMarketPlaceData(payload).subscribe((response: any) => {
      if (response && response.data && response.data.marketPlaceData && response.data.marketPlaceData.length) {
        response.data.marketPlaceData.forEach((data: any) => {
          console.log(data)
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

  getDateFormat(value: any) {
    if (value) {
      return moment.utc(value).format('MMM DD, YYYY')
    } else {
      return '';
    }
  }
  getDateFormatStartDate(value: any) {
    if (value) {
      return moment.utc(value).format('MMM DD')
    } else {
      return '';
    }
  }
  getHourFormat(value: any) {
    if (value) {
      return moment.utc(value).format('h:mm A')
    } else {
      return '';
    }
  }
  applySearch(action, val) { }
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
  checkBirdPriceAvailablity(date: any) {
    let currentDate: any = new Date();
    currentDate.setHours(0, 0, 0, 0)
    let checkDate: any = new Date(date);
    checkDate.setHours(0, 0, 0, 0)
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }
  expandDomainAction(event: any) {
    // console.log(event);
    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
    }, 200);
  }
  applyFilter(filterData, loadPush = '') {
    this.dataOffset = 0;
    const resetFlag = filterData.reset;
    this.displayNoRecordsShow = 1;
    this.filterOptions['filterExpand'] = this.expandFlag;
    this.pageOptions['expandFlag'] = this.expandFlag;
    this.pageRefresh['expandFlag'] = this.expandFlag;
    this.pageRefresh["toggleFlag"] = this.expandFlag;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck();
      if (loadPush) {
        filterData['loadAction'] = 'push';
        this.apiData['pushAction'] = true;
        const filterOptionData = this.filterOptions['filterData'];
        if (filterData.startDate != undefined || filterData.startDate != 'undefined') {
          const sIndex = filterOptionData.findIndex(option => option.selectedKey == 'startDate');
          if (sIndex >= 0) {
            filterOptionData[sIndex].value = filterData.startDate;
          }
          const eindex = filterOptionData.findIndex(option => option.selectedKey == 'endDate');
          if (eindex >= 0) {
            filterOptionData[eindex].value = filterData.endDate;
          }
        }
        if (filterData.trainingType) {
          const sIndex = filterOptionData.findIndex(option => option.selectedKey == 'Training type');
          if (sIndex >= 0) {
            filterOptionData[sIndex].value = filterData.trainingType;
          }
        }
        if (filterData.trainingType) {
          const eIndex = filterOptionData.findIndex(option => option.selectedKey == 'Training Status');
          if (eIndex >= 0) {
            filterOptionData[eIndex].value = filterData.trainingStatus;
          }
        }
      }
      this.apiData['filterOptions'] = filterData;
      setTimeout(() => {
        filterData['loadAction'] = '';
      }, 500);
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = this.filterActiveCount > 0 ? true : false;
      const viewType = this.thumbView ? 'thumb' : 'list';
      filterData['threadViewType'] = viewType;
      filterData['filterrecords'] = this.filterCheck();
      localStorage.setItem(filterNames.marketPlace, JSON.stringify(filterData));
      this.commonService.emitMessageLayoutrefresh(filterData);
      this.serviceProviderData = [];
      this.loading = true;
      this.trainingData();
    } else {
      this.resetFilter();
    }
  }

  resetFilter() {
    this.filterLoading = true;
    this.filterOptions['expandFlag'] = true;
    this.filterOptions["filterLoading"] = this.filterLoading;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem(filterNames.marketPlace);
    this.ngOnInit('reset');
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem(filterNames.marketPlace));
    this.applyFilter(getFilteredValues, event);
  }

  filterCheck() {
    this.filterrecords = false;
    if (this.pageRefresh['orderBy'] != 'desc') {
      this.filterrecords = true;
    }
    if (this.pageRefresh['type'] != 'sortthread') {
      this.filterrecords = true;
    }
    if (this.filterActiveCount > 0) {
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
    let navFrom = this.commonService.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == 'market-place') ? false : true;
    let scrollTop: any = this.scrollTop;
    this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    this.router.navigateByUrl('market-place/view/' + id);
  }

  ngOnDestroy() {
  }

  isVideo(ext: any) {
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }

  checkShowSeatsLeft(training: any) {
    let pendingParticipant: any = parseInt(training?.maxParticipants) - parseInt(training?.signedupUsers ? training?.signedupUsers : "0");
    if (pendingParticipant < 10) {
      return true;
    } else {
      return false;
    }
  }

  pendingParticipantsCount(training: any) {
    let pendingParticipant: any = parseInt(training?.maxParticipants) - parseInt(training?.signedupUsers ? training?.signedupUsers : "0");
    return pendingParticipant;
  }

  selectTrainingType(event) {
    this.dataOffset = 0;
    this.loading = true;
    this.trainingType = event.value.value;
    this.serviceProviderData = [];
    this.trainingData();
  }

  resetTrainingType(){
    if(this.trainingType != 'upcoming') {
      this.selectedTrainingType = {label: 'Upcoming Trainings', value: 'upcoming'};
    this.selectTrainingType({value: {label: 'Upcoming Trainings', value: 'upcoming'}});
    }
  }

  /* cart */
  getCart() {
    let cartId = this.cart?.cartId || localStorage.getItem('adminCartId');
    if (cartId) {
      this.threadApi.getCart({ cartId: cartId }).subscribe((resp) => {
        this.setCart(resp.data);
      })
    }
    else {
      this.cart = this.defaultCart;
    }
  }

  toggleCartItem(event, id, type) {
    event.stopPropagation();
    this.newCartItem = { itemId: id, itemType: type };
    if (this.cart.cartId && this.cart.userId) {
        this.updateCart({ cartId: this.cart.cartId });
    } else {
      this.showCartUserPopup = true;
    }
  }

  setCart(data) {
    this.cart = {
      cartId: data?.id,
      userId: data?.userId,
      email: data?.email,
      trainingIds: data?.trainingIds ? data?.trainingIds.split(',') : [],
      manualIds: data?.manualIds ? data?.manualIds.split(',') : [],
      phoneNumber: {
        countryCode: data?.countryCode,
        dialCode: data?.dialCode,
        e164Number: data?.e164Number,
        internationalNumber: data?.internationalNumber,
        phoneNumber: data?.phoneNumber,
      },
      totalAmount: 0
    };
    if(!data?.userId) {
      localStorage.removeItem('adminCartId');
      this.defaultCart.trainingIds = [];
      this.cart = this.defaultCart;
    } else {
      localStorage.setItem('adminCartId', this.cart.cartId);
    }
  }

  updateCart(params) {
      this.cart?.trainingIds.includes(this.newCartItem.itemId)
        ? this.cart?.trainingIds.splice(this.cart?.trainingIds?.indexOf(this.newCartItem.itemId), 1)
        : this.cart?.trainingIds.push(this.newCartItem.itemId);
    this.threadApi.updateCartItems({ ...params, ...this.newCartItem }).subscribe((resp: any) => {
      this.setCart(resp?.data);
      this.commonService.cartUpdateSubject.next(resp?.data);
    }, (error: any) => {
      console.error("error: ", error);
    });
  }

  getUserData(data) {
    if(data) {
      this.updateCart({ cartId: this.cart.cartId, userId: data[0].userId });
      this.showCartUserPopup = false;
    }
  }

  closeSalePersonPopup() {
    this.showCartUserPopup = false;
  }
}
