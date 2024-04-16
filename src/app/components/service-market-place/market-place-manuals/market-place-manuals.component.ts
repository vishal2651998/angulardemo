import { Component, OnInit, ViewChild, OnDestroy, HostListener, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle, PageTitleText, RedirectionPage, DefaultNewImages, ContentTypeValues, DefaultNewCreationText, filterNames } from "src/app/common/constant/constant";
import { FilterService } from "../../../services/filter/filter.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../services/landingpage/landingpage.service';
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
  selector: "app-market-place-manuals",
  templateUrl: "./market-place-manuals.component.html",
  styleUrls: ["./market-place-manuals.component.scss"],
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
export class MarketPlaceManualsComponent implements OnInit, OnDestroy {
  public title: string = "Market Place Manuals";
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
  pageAccess: string = "market-place-manuals";
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
  pageTitleText = PageTitleText.Manuals;
  redirectionPage = RedirectionPage.Manuals;
  displayNoRecordsShow = 3;
  contentTypeDefaultNewImg = DefaultNewImages.MarketPlace;
  contentTypeValue = ContentTypeValues.MarketPlace;
  contentTypeDefaultNewText = DefaultNewCreationText.Manual;
  contentTypeDefaultNewTextDisabled: boolean = false;
  partsUrl: string = "market-place/manage/";
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


  public newPartInfo: string = "Get started by tapping on \"New Manual\"";
  showCartUserPopup: boolean;
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
        this.manualsData();
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
    public threadApi: ThreadService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
  }

  ngOnDestroy() { }

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
    let threadViewType:any = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = threadViewType;
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    console.log(this.headerData)
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
    this.manualsData();
    this.getCart();
    this.commonService.cartUpdateSubject.subscribe((cart) => this.getCart());
  }

  backScroll() {
    let scrollPos = localStorage.getItem('wsScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
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
    let secElement:any = document.getElementById(id);
    if(secElement != 'undefined' && secElement != undefined) {
        secElement.scrollTop = this.scrollTop;
    }
  }

  manualsData() {
    let domainId: any = localStorage.getItem('domainId');
    let filterData = this.apiData["filterOptions"];
    let payload = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      domainId: localStorage.getItem('domainId'),
    }
    this.scrollInit = 1;
    this.threadApi.apiGetManualsData(payload).subscribe((response: any) => {
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
      this.router.createUrlTree(['/market-place/manage-manuals'])
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

  mainPage() {
    this.router.navigateByUrl('market-place');
  }

  viewDetail(id: any) {
    let navFrom = this.commonService.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == 'market-place') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    this.router.navigateByUrl('market-place/view-manual/'+ id);
  }

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
      this.defaultCart.manualIds = [];
      this.cart = this.defaultCart;
    } else {
      localStorage.setItem('adminCartId', this.cart.cartId);
    }
  }

  updateCart(params) {
    if (this.newCartItem.itemType == 'manual')
      this.cart?.manualIds.includes(this.newCartItem.itemId)
        ? this.cart?.manualIds.splice(this.cart?.manualIds?.indexOf(this.newCartItem.itemId), 1)
        : this.cart?.manualIds.push(this.newCartItem.itemId);
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
