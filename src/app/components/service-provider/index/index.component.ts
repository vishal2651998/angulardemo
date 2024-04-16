import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import {NgxMasonryComponent} from 'ngx-masonry';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CommonService } from '../../../services/common/common.service';
import {Constant, RedirectionPage} from '../../../common/constant/constant';
import {PlatformLocation} from '@angular/common';
import { ManageListComponent } from '../../common/manage-list/manage-list.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  styles: [
    `
      .masonry-item {
        width: 268px;
        margin: 20px 20px 20px 0px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})

export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  atgTheme:any = [];
  domainSelectPopup:boolean;
  public updateMasonryLayout: any;
  public updateMasonryDomainLayout: any;
  reparifyDomain: boolean = false;
  subDomainName: any = '';
  pageLoading: any = false;
  scrollTop: any;
  public bodyClass = 'service-provider';
  public bodyElem;
  public footerElem;
  bannerImage: any;
  imageHeight: any;
  dataLimit: any = 16;
  dataOffset: any = 0;
  dataDomainLimit: any = 8;
  dataDomainOffset: any = 0;
  marketPlaceTotalData: any;
  serviceProviderData: any = [];
  domainsTotalData: any;
  domainData: any = [];
  user: any;
  loadingList: any = false;
  loadingDomain: any = false;
  loadList: any = false;
  loadDomain: any = false;
  stopAutoScroll: any = false;
  isMobile: any = false;
  currentFilter = 'All';
  oldFilter = 'All';
  screenResponsive: boolean = false;
  cart: any = {
    cartId: '',
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

  filterOptions: any = [
    {
      selectedImage: 'assets/images/service-provider/training-2-small-white.png',
      image: 'assets/images/service-provider/training-2-small-white.png',
      name: 'All',
      id: 'All'
    },
    {
      selectedImage: 'assets/images/service-provider/webinar-white.png',
      image: 'assets/images/service-provider/webinar-white.png',
      name: 'Webinar',
      id: 'Webinar'
    },
    {
      selectedImage: 'assets/images/service-provider/seminar-white.png',
      image: 'assets/images/service-provider/seminar-white.png',
      name: 'Seminar',
      id: 'Seminar'
    },
    {
      selectedImage: 'assets/images/service-provider/recorded-video-white.png',
      image: 'assets/images/service-provider/recorded-video-white.png',
      name: 'Recorded',
      id: 'Recorded'
    },
    // {
    //   selectedImage: 'assets/images/service-provider/manual-white.png',
    //   image: 'assets/images/service-provider/manual-white.png',
    //   name: 'Manuals',
    //   id: 'Manuals'
    // }
  ];
  trainingLoading: boolean = false;
  rangeDates: any;
  stateValue: any = '';
  showClearFilter: boolean = false;
  groupedStates: any = [];
  showFilterPopup: boolean = false;
  countryValue: any = '';
  searchValue: any = '';
  ranges: any = {
    'Today': [moment(), moment()],
    'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Next 7 Days': [moment(), moment().add(7, 'days'), moment()],
    'Next 30 Days': [moment(), moment().add(29, 'days'), moment()],
    'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
  }
  alwaysShowCalendars: boolean = true;
  keywordValue: any = [];
  countryId: string;
  domainId: any;
  selectedDomainId: any;
  userId: any;
  innerHeight: number;
  bodyHeight: number;
  businessDomainData: any;
  reparifyBannerImage: any;
  showCartUserDetailPopup = false;
  userInfoForm: FormGroup;
  phoneValue: any;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Australia, CountryISO.India];
  selectedCountryIS0: any = '';
  userInfoFormSubmitted = false;
  separateDialCode = true;
  newCartItem: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let screenSize = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
    if (screenSize > 480) {
      if (!this.reparifyDomain) {
        this.bannerImage = "assets/images/service-provider/service-provider-banner.png";
      } else {
        if (this.reparifyBannerImage) {
          this.bannerImage = this.reparifyBannerImage;
        } else if (!this.bannerImage) {
          this.bannerImage = "assets/images/service-provider/atg-banner-image.jpg";
        }
      }
    } else {
      if (!this.reparifyDomain) {
        this.bannerImage = "assets/images/service-provider/Layer 1.png";
      } else {
        if (this.reparifyBannerImage) {
          this.bannerImage = this.reparifyBannerImage;
        } else if (!this.bannerImage) {
          this.bannerImage = "assets/images/service-provider/atg-banner-image.jpg";
        }
      }
    }
    let screenResponsiveSize = document.documentElement.clientWidth;
    if (screenResponsiveSize <= 980) {
      this.imageHeight = "170px";
      this.screenResponsive = true;
    } else if (screenResponsiveSize > 980) {
      this.imageHeight = "230px";
      this.screenResponsive = false;
    }
    this.updateMasonryLayout = true;
    this.updateMasonryDomainLayout = true;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scrollTop: any;
    scrollTop = window.pageYOffset;
    this.scrollTop = scrollTop;
  }
  constructor(
    public threadApi: ThreadService,
    private scrollTopService: ScrollTopService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private location: PlatformLocation,
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private api: ApiService,
    private fb: FormBuilder,
  ) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }
    this.location.onPopState (() => {
     // window.scrollTo(0, 0);
      setTimeout(() => {
        if (!this.isMobile) {
          this.updateMasonryLayout = true;
          this.updateMasonryDomainLayout = true;
          this.masonry.reloadItems();
          this.masonry.layout();
        }
        this.backScroll();
      }, 50);
    });
  }

  ngOnInit(): void {
    let section = this.route.snapshot.params['section'];
    if(section) {
      if(section.toLowerCase() == 'training-manuals') this.setFilterAndResetData('Manuals');
      else if(section.toLowerCase() == 'webinar') this.setFilterAndResetData('Webinar');
      else if(section.toLowerCase() == 'seminar') this.setFilterAndResetData('Seminar');
      else if(section.toLowerCase() == 'recorded') this.setFilterAndResetData('Recorded');
    }
    this.user = this.authenticationService.userValue;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyHeight = window.innerHeight;
    window.scrollTo(0, 0);
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Service Provider');
    let screenSize = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
    let host = window.location.host
    let subdomain = host.split('.')[0];
    // let subdomain = 'atgtraining-stage';
    this.subDomainName = subdomain;
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user?.domain_id ? this.user?.domain_id : 1;
    // this.domainId = 71;
    this.userId = this.user?.Userid ? this.user?.Userid : 1;
    if (subdomain == "atgtraining-stage") {
      this.reparifyDomain = true;
      this.atgTheme = "atgThemeColor"
    } else {
      this.reparifyDomain = false;
    }
    if (screenSize > 480) {
      if (!this.reparifyDomain) {
        this.bannerImage = "assets/images/service-provider/service-provider-banner.png";
      } else {
        if (this.reparifyBannerImage) {
          this.bannerImage = this.reparifyBannerImage;
        } else if (!this.bannerImage) {
          this.bannerImage = "assets/images/service-provider/atg-banner-image.jpg";
        }
      }
    } else {
      if (!this.reparifyDomain) {
        this.bannerImage = "assets/images/service-provider/Layer 1.png";
      } else {
        if (this.reparifyBannerImage) {
          this.bannerImage = this.reparifyBannerImage;
        } else if (!this.bannerImage) {
          this.bannerImage = "assets/images/service-provider/atg-banner-image.jpg";
        }
      }
    }
    let screenResponsiveSize = document.documentElement.clientWidth;
    if (screenResponsiveSize <= 767) {
      this.imageHeight = "170px";
      this.screenResponsive = true;
    } else if (screenResponsiveSize > 767) {
      this.imageHeight = "230px";
      this.screenResponsive = false;
    }
    window.scrollTo(0, 0);
    this.pageLoading = true;
    this.loadCountryStateData();
    this.trainingData(true, false);
    this.domainsData(true);
    this.setScreenHeight();
    this.userInfoForm = this.fb.group({
      'email': ['', [Validators.email]],
      // 'phoneNumber': [''],
    });
    this.getCart();
    this.commonService.cartUpdateSubject.subscribe((cart) => this.getCart());
  }

  getCart() {
    let cartId = this.cart?.cartId || localStorage.getItem('marketplaceCartId');
    if (cartId) {
      this.threadApi.getCart({ cartId: cartId }).subscribe((resp) => {
        this.setCart(resp.data);
        this.selectedDomainId = resp.data.trainings?.length > 0 ? resp.data.trainings[0]?.domainID : resp.data.manuals?.length > 0 ? resp.data.manuals[0]?.domainID : undefined;
      })
    } else {
      this.cart = {};
    }
  }

  toggleCartItem(event, id, type,domainId) {
    event.stopPropagation();
    this.newCartItem = { itemId: id, itemType: type };
    if (this.cart.cartId) {
      if (this.selectedDomainId && this.selectedDomainId != domainId)
        this.domainSelectPopup = true;
      else
        this.updateCart({ cartId: this.cart.cartId });
    } else {
      this.userInfoFormSubmitted = false;
      this.showCartUserDetailPopup = true;
    }
  }

  setCart(data) {
    this.cart = {
      cartId: data?.id,
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
    if(data?.userId) {
      localStorage.removeItem('marketplaceCartId');
      this.cart.cartId = null;
    } else {
      localStorage.setItem('marketplaceCartId', this.cart.cartId);
    }
  }

  updateCart(params) {
    if (this.newCartItem.itemType == "training")
      this.cart?.trainingIds?.includes(this.newCartItem.itemId)
        ? this.cart?.trainingIds?.splice(this.cart?.trainingIds?.indexOf(this.newCartItem.itemId), 1)
        : this.cart?.trainingIds?.push(this.newCartItem.itemId);
    else if (this.newCartItem.itemType == 'manual')
      this.cart?.manualIds?.includes(this.newCartItem.itemId)
        ? this.cart?.manualIds?.splice(this.cart?.manualIds?.indexOf(this.newCartItem.itemId), 1)
        : this.cart?.manualIds?.push(this.newCartItem.itemId);
    this.threadApi.updateCartItems({ ...params, ...this.newCartItem }).subscribe((resp: any) => {
      this.setCart(resp?.data);
      this.commonService.cartUpdateSubject.next(resp?.data);
    }, (error: any) => {
      console.error("error: ", error);
    });
  }

  submitUserInfo(){
    this.userInfoFormSubmitted = true;
    if(this.userInfoForm.valid) {
      this.updateCart({cartId: null, ...this.userInfoForm.value});
      this.showCartUserDetailPopup = false;
    }
  }

  closeUserDetailForm(){
    this.showCartUserDetailPopup = false;
    this.updateCart({cartId: null});
  }

  backScroll() {
    let scrollPos = localStorage.getItem('wsScrollPos');
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos);
    setTimeout(() => {
      window.scroll(0, this.scrollTop);
    }, 0);
  }

  setScreenHeight() {
    this.innerHeight = this.bodyHeight;
  }

  setScrollingLocalStorage() {
    let navFrom = this.commonService.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == 'marketplace') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
  }

  redirectToInnerDetailPage(id: any, training: any) {
    this.setScrollingLocalStorage();
    if(this.currentFilter == 'Manuals') window.open('marketplace/domain/' + training?.domainID + '/manual/' + id);
    else window.open('marketplace/domain/' + training?.domainID + '/detail/' + id, '_blank');
  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        response?.data?.countryData.forEach((country: any) => {
          let items: any = [];
          response?.data?.stateData.forEach((state => {
            if (country.id == state.country_id) {
              let stateOptionObject = {
                id: state.name,
                name: state.name
              }
              items.push(stateOptionObject);
            }
          }));
          this.groupedStates.push(
            {
              label: country.name,
              value: country.id,
              items: items
            },
          );
        });
      }
    }, (error: any) => {
    });
  }

  openFilterPopup() {
    this.showFilterPopup = true;
  }
  redirectToInnerDetailPageByRouter(id: any, training: any) {
    this.setScrollingLocalStorage();
    if(this.currentFilter == 'Manuals') this.router.navigateByUrl('marketplace/domain/' + training?.domainID + '/manual/' + id);
    else this.router.navigateByUrl('marketplace/domain/' + training?.domainID + '/detail/' + id);
  }
  redirectToDomainTrainingByRouter(id: any) {
    this.setScrollingLocalStorage();
    this.router.navigateByUrl('marketplace/domain/' + id);
  }

  setShowClearFilter() {
    if (this.searchValue || !this.checkProperties(this.rangeDates) || this.stateValue) {
      this.showClearFilter = true;
    } else {
      this.showClearFilter = false;
    }
  }

  applyFilterForText() {
    if (this.searchValue) {
      this.showClearFilter = true;
    }
    this.applyFilter();
  }

  checkProperties(obj) {
    for (let key in obj) {
      if (key != 'formType' && key != 'country')
        if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined)
            return false;
    }
    return true;
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

  redirectToDetail(domain: any, domainId: any) {
    if (localStorage.getItem('domainId')) {
      this.redirectToDetailDomainPage(domain, domainId);
    } else {
      this.redirectToDetailDomainPage(domain, domainId);
    }
  }

  redirectToDetailPage() {
    this.router.navigateByUrl('marketplace/detail');
  }

  redirectToDetailDomainPage(domain: any, domainId: any) {
    window.open('https://' + domain.subdomainurl + '.collabtic.com/marketplace/detail/', "_self");
  }


  goToUrl(url: any) {
    window.open(url, "_blank");
  }

  setFilterAndResetData(type: any){
    if (type != this.oldFilter) {
      this.oldFilter = type;
      this.currentFilter = type;
      this.serviceProviderData = [];
      this.dataOffset = 0;
      this.trainingLoading = true;
      // this.keywordValue = [];
      this.trainingData(false, true);
    }
  }

  applyFilter() {

    this.dataLimit = 16;
    this.dataOffset = 0;
    this.serviceProviderData = [];
    this.trainingLoading = true;
    this.trainingData(false, true);
    this.showFilterPopup = false;
  }

  clearFilter() {
    this.rangeDates = null;
    this.stateValue = '';
    this.searchValue = '';
    this.trainingLoading = true;
    this.keywordValue = [];
    this.trainingData(false, true);
    this.showFilterPopup = false;
  }
  datesUpdated(event: any) {
    if (this.rangeDates.startDate != event.startDate || this.rangeDates.endDate != event.startDate) {
      this.applyFilter();
    }
  }
  checkBirdPriceAvailablity(date: any) {
    let currentDate: any = new Date();
    currentDate.setHours(0,0,0,0)
    let checkDate: any = new Date(date);
    checkDate.setHours(0,0,0,0)
    if (currentDate <= checkDate) {
      return true;
    } else {
      return false;
    }
  }
  trainingData(scroll, filterReset = false) {
    if (this.rangeDates?.startDate){
      if (!this.rangeDates.endDate.isValid()) {
        this.rangeDates.endDate = this.rangeDates.startDate;
      }
    }
    if (filterReset) {
      this.serviceProviderData = [];
    }
    let keywordIds: any = [];
    this.keywordValue.forEach((keyword: any) => {
      keywordIds.push(keyword.id);
    });
    this.loadingList = true;
    let payload: any = {
      limit: this.dataLimit,
      offset: this.dataOffset,
      currentFilter: this.currentFilter,
      startDate: this.rangeDates?.startDate ? this.rangeDates?.startDate.format('YYYY-MM-DD') : '',
      endDate: this.rangeDates?.endDate && this.rangeDates?.endDate.isValid() ? this.rangeDates?.endDate.format('YYYY-MM-DD') : (this.rangeDates?.startDate && this.rangeDates?.startDate ? this.rangeDates?.startDate.format('YYYY-MM-DD') : ''),
      state: this.stateValue,
      search: this.searchValue,
      keyword: keywordIds?.toString(),
      isFront: true,
    }
    let url: any;
    if(this.currentFilter == 'Manuals') url = this.threadApi.apiGetManualsData(payload);
    else url = this.threadApi.apiGetMarketPlaceData(payload);
    if (this.reparifyDomain) {
      payload.domainName = this.subDomainName;
      if (this.currentFilter != 'Manuals') url = this.threadApi.apiGetMarketPlaceDataWithDomainName(payload);
      else if (this.currentFilter == 'Manuals') url = this.threadApi.apiGetManualsDataWithDomainName(payload);
    }
    url.subscribe((response: any) => {
      if (response && response.data && response.data.marketPlaceData && response.data.marketPlaceData.length) {
        response.data.marketPlaceData.forEach((data: any) => {
          this.serviceProviderData.push(data);
        });
      }
      if (this.reparifyDomain) {
        this.businessDomainData = response?.data?.businessDomainData;
        if (this.businessDomainData.bannerMainImageUrl) {
          this.reparifyBannerImage = this?.businessDomainData?.bannerMainImageUrl
          this.bannerImage = this?.businessDomainData?.bannerMainImageUrl;
        }
      }
      this.loadingList = false;
      this.trainingLoading = false;
      this.marketPlaceTotalData = response.data.totalRecords;
      this.updateMasonryLayout = true;
      if (this.marketPlaceTotalData > this.serviceProviderData.length) {
        this.loadList = true;
      } else {
        this.loadList = false;
      }

      this.pageLoading = false;
      if (scroll) {

        window.scroll(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }, (error: any) => {
      this.loadingList = false;
      this.trainingLoading = false;
      this.pageLoading = false;
    })
  }

  domainsData(scroll) {
    this.loadingDomain = true;
    let payload = {
      limit: this.dataDomainLimit,
      offset: this.dataDomainOffset
    }
    this.threadApi.apiGetDomainsData(payload).subscribe((response: any) => {
      if (response && response.data && response.data.businessDomains && response.data.businessDomains.length) {
        response.data.businessDomains.forEach((data: any) => {
          this.domainData.push(data);
        });
      }
      this.loadingDomain = false;
      this.domainsTotalData = response.data.totalRecords;
      this.updateMasonryDomainLayout = true;
      if (this.domainsTotalData > this.domainData.length) {
        this.loadDomain = true;
      } else {
        this.loadDomain = false;
      }
      if (scroll) {
        window.scroll(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }, (error: any) => {
      this.loadingDomain = false;
    });
  }

  getDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY');
    } else {
      return '';
    }
  }
  getStartDateFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD');
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
  loadMoreData() {
    if (this.marketPlaceTotalData > this.serviceProviderData.length) {
      this.dataOffset += parseInt(this.dataLimit);
      this.trainingData(false, false);
      this.loadList = true;
    } else {
      this.loadList = false;
    }
  }
  loadMoreDomainData() {
    if (this.domainsTotalData > this.domainData.length) {
      this.dataDomainOffset += this.dataDomainLimit;
      this.domainsData(false);
      this.loadDomain = true;
    } else {
      this.loadDomain = false;
    }
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

  manageList() {
    let filterItemValue = [];
    this.keywordValue.forEach((keyword: any) => {
      filterItemValue.push(keyword.id);
    });
    let inputData = {
      baseApiUrl: this.api.apiCollabticBaseUrl(),
      apiUrl: "resources/gettagslists",
      field: 'keywords',
      selectionType: 'multiple',
      filteredItems: filterItemValue,
      filteredLists: this.keywordValue,
      actionApiName: '',
      actionQueryValues: '',
      title: 'threads'
    };
    let access = 'New Thread Tags';
    let title = 'Keywords';
    inputData['title'] = title;
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      pushAction: false
    };
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.listAction = false;
    modalRef.componentInstance.saveButtonColor = 'green-button-new';
    modalRef.componentInstance.checkboxColor = 'active-green';
    modalRef.componentInstance.filteredTags = this.keywordValue;
    modalRef.componentInstance.apiData = apiInfo;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.pageType = 'market-place';
    modalRef.componentInstance.height = this.innerHeight;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      this.keywordValue = receivedService;
      if(!this.screenResponsive) {
        this.showClearFilter = true;
        this.applyFilter();
      }
    });
  }

  convertArrayToString(array: any) {
    let arrayName = [];
    array.forEach((field: any) => {
      arrayName.push(field.name);
    });
    return arrayName?.join(', ');
  }

  removeValue(value: any) {
    this.keywordValue = this.keywordValue?.filter((keyword: any) => keyword.name != value);
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
  }

  openContactUs() {
    window.open("https://collabtic.com/contact-us/", "_blank")
  }

  checkDisable() {
    if (this.currentFilter == 'Manuals') {
      return true;
    } else {
      return false;
    }
  }
}
