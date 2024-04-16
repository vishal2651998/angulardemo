import { Component, ViewChild, HostListener, OnInit, Input, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { Constant, IsOpenNewTab } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common/common.service';
import { Subscription } from "rxjs";
import { Table } from "primeng/table";
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;

  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();

  public bodyClass1: string = "parts-list";
  public redirectionPage = '';
  public pageTitleText = '';
  public apiKey: string = Constant.ApiKey;
  public userId;
  public fromSearch = "";
  public filterOptions: any = [];

  public assetPath: string = "assets/images/";
  public assetShopPath: string = `${this.assetPath}shop`;
  public assetPartPath: string = `${this.assetPath}parts`;
  public redirectUrl: string = "shop/view/";
  public defShopBanner: string = `${this.assetPath}common/default-shop-banner.png`;

  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public expandFlag: boolean;
  public accessFrom: string = "";
  public shopApiCall;
  public shopWsApiCall;
  public shopType: string = "";
  public publishStatus: string = "";
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;

  public groupId: number = 6;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public itemResponse = [];
  public shopSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public shopUrl = '';
  public newPartInfo: string = "Get started by tapping on ‘New SHOP’.";
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public priorityIndexValue = '';
  public shopIdArrayInfo: any = [];
  public shopAPICount: any = "0";
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public filterrecords: boolean = false;

  public loading: boolean = false;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;

  shopListColumns: any = [];
  shopList: any = [];
  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";

  public showMap: any = false;
  public shopId: number;
  public shopIndex: number;
  public updateMasonryLayout: boolean = false;
  public mapHeaderDate = '';
  public mapId = '';
  public center: google.maps.LatLngLiteral;
  public options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
  };
  mapData: any;
  mapValueData: any;
  mapHeight: any;

  public listView: boolean = true;

  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault: this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loading,
    action: false,
    shopList: this.shopList,
    itemOffset: this.itemOffset,
    itemTotal: this.itemTotal,
    searchVal: this.searchVal,
    headerAction: false,
    filterrecords: this.filterrecords,
  };
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  public tvsDomain: boolean = false;
  public searchAction: boolean = false;
  public bodyClass: string = "parts-list";
  public bodyElem;
  
  @HostListener('window:displayShopData', ['$event'])
  displayService(event: any): void {
    this.viewShop(event.detail.mapData.storeNo);
  }

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public apiUrl: ApiService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    window.addEventListener('scroll', this.scroll, true);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    console.log(this.bodyHeight)
    this.shopListColumns = [
      { field: 'storeNo', header: 'Store#', columnpclass: 'w1 header thl-col-1 col-sticky' },
      { field: 'storeName', header: 'Name', columnpclass: 'w2 header thl-col-2' },
      { field: 'emailAddress', header: 'Email', columnpclass: 'w3 header thl-col-3' },
      { field: 'storeCity', header: 'City', columnpclass: 'w4 header thl-col-4' },
      { field: 'storeState', header: 'State', columnpclass: 'w5 header thl-col-5' },
      { field: 'numberTechs', header: 'No. of Techs', columnpclass: 'w6 header thl-col-6' },
      { field: 'numberTickets', header: 'No. of tickets', columnpclass: 'w7 header thl-col-7' }
    ];

    this.subscription.add(
      this.shopApiCall = this.commonApi.shopDetailDataCloseReceivedSubject.subscribe((shopData) => {
        let action = shopData['action'];
        switch (action) {
          case 'close':
            if (!this.listView) {
              this.closeBack();
            }
            break;
        }
      })
    );

    this.subscription.add(
      this.shopApiCall = this.commonApi.shopListDataReceivedSubject.subscribe((shopData) => {
        console.log(shopData)
        this.shopIdArrayInfo = [];
        this.shopAPICount = "0";
        let action = shopData['action'];

        this.listView = action == "mapview" ? false : true;

        switch (action) {
          case "get":
          case "filter":
          case "import":
            this.loading = true;
            this.itemOffset = 0;
            this.itemLength = 0;
            this.itemTotal = 0;
            setTimeout(() => {
              if (this.itemOffset == 0) {
                this.shopList = [];
              }
              this.getShopList();
              setTimeout(() => {
                if (this.top != undefined) {
                  this.top.nativeElement.scroll({
                    top: 0,
                    left: 0,
                    behavior: "auto",
                  });
                }
              }, 100);
            }, 500);
            break;
          default:
            if (!this.listView) {
              this.callbackMap();
            }
            break;
        }
        if (action == 'get') {
          this.getShopInfoData(shopData);
        }

      })
    );


    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
        this.updateLayout();
      })
    );

    this.loadScript();

  }

  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  getShopInfoData(shopData) {
    console.log(shopData);
    console.log(this.displayNoRecords);
    this.displayNoRecords = false;
    this.displayNoRecordsDefault = false;
    let action = shopData['action'];

    this.userId = shopData['userId'];
    this.domainId = shopData['domainId'];
    this.filterrecords = shopData['filterrecords'];

    let platformId = localStorage.getItem('platformId');
    if (this.domainId == '52' && platformId == '2') {
      this.tvsDomain = true;
    }

    this.expandFlag = shopData['expandFlag'];
    let fopt: any = shopData['filterOptions'];
    this.filterOptions = fopt;
    console.log(this.filterOptions, fopt, shopData.filterOptions, action)

    let apiInfo = {
      accessFrom: this.accessFrom,
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      isActive: 1,
      searchKey: this.searchVal,
      fromSearch: this.fromSearch,
      filterOptions: this.filterOptions,
      limit: this.itemLimit,
    };
    this.apiData = apiInfo;
    setTimeout(() => {
      this.setScreenHeight();
    }, 2000);

  }

  // Get SHOP List
  getShopList(limit: any = '') {
    this.hideMap();
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;

    let formData = new FormData();
    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('limit', this.itemLimit);
    formData.append('offset', this.itemOffset);
    //formData.append('filterOptions', JSON.stringify(this.apiData['filterOptions']));

    console.log(this.filterOptions, this.apiData)
    this.commonApi.getStoreInfoList(formData).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.lazyLoading = this.loading;

      let resultData = response.items;
      this.itemTotal = response.total;
      if (this.itemTotal > 0) {
        if (resultData.length > 0) {

          resultData.forEach(item => {
            this.shopList.push(item);
          });

          this.scrollCallback = true;
          this.scrollInit = 1;

          this.itemEmpty = false;
          this.displayNoRecords = false;


          this.itemLength += resultData.length;
          this.itemOffset += this.itemLimit;
        }
      }
      else {
        this.itemEmpty = true;
        this.displayNoRecords = true;
        this.displayNoRecordsShow = 1;
      }

      console.log(resultData);
      setTimeout(() => {
        if (!this.displayNoRecords) {
          let listItemHeight;

          listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
            document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
          console.log(listItemHeight);
          if (this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.getShopList();
            this.lastScrollTop = this.scrollTop;
          }
        }
      }, 1500);

    });
  }


  // View SHOP
  viewShop(id) {
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' shops') ? false : true;
    let scrollTop: any = this.scrollTop;
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    console.log(id);
    let url = "shops/view/" + id;
    this.router.navigate([url]);
  }

  // Nav Part Edit or View
  navPart(action, id, i) {
    let url;
    switch (action) {
      case "view":
        url = `${this.redirectUrl}/${id}`;
        break
      default:
        break;
    }
    //console.log(url)
    setTimeout(() => {
      let teamSystem = localStorage.getItem("teamSystem");
      if (teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        // window.open(url, IsOpenNewTab.openNewTab);
        window.open(url, url);
      }
      //window.open(url, '_blank');
    }, 50);
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
    this.innerHeight = this.bodyHeight - (headerHeight + 80);
    this.mapHeight = this.innerHeight - 20 + 'px';

  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 750);
  }

  // Onscroll
  scroll = (event: any): void => {
    if (event.target.id == 'partList' || event.target.className == 'p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset - 80;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getShopList();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }
  callbackMap() {
    this.mapId = '';
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1);
    this.showMap = false;
    this.mapValueData = [];
    this.shopList.forEach(citem => {
      this.mapValueData.push(citem);
    });
    setTimeout(() => {
      this.showMap = true;
      this.renderMap();
    }, 100);
  }

  closeBack() {
    this.mapId = '';
    this.showMap = false;
    setTimeout(() => {
      this.showMap = true;
      this.renderMap();
    }, 1);
  }

  loadMap = () => {
    console.log('in load map')
    const bounds = new google.maps.LatLngBounds();
    const map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      zoom: 8
    });
    var address = [];
    let infowindow = null;
    this.mapValueData.forEach((mapData: any, index: number) => {
      const geocoder = new google.maps.Geocoder();
      if ((mapData.address1 != '' || mapData.address2 != '') && mapData.storeCity != '' && mapData.storeState != '' && mapData.storeZone != '') {
        setTimeout(function () {
          mapData.address1 = mapData.address1 != 'NaN' ? mapData.address1 : '';
          mapData.address2 = mapData.address2 != 'NaN' ? mapData.address2 : '';
          address[index] = mapData.address1 + mapData.address2 + ',' + mapData.storeCity + ',' + mapData.storeCity + ',' + mapData.storeZone;
          geocoder.geocode({ 'address': address[index] }, (results, status) => {
            console.log(address[index])
            console.log(results)
            console.log(status)
            if (status == google.maps.GeocoderStatus.OK) {
              const marker: any = new window['google'].maps.Marker({
                map: map,
                title: results[0].formatted_address,
                position: results[0].geometry.location,
                draggable: false,
                animation: window['google'].maps.Animation.DROP,
                label: {
                  color: '#fff', fontSize: '14px', fontWeight: 'normal',
                  text: (index + 1).toString()
                }
              });
              if (!index) {
                bounds.extend(new google.maps.LatLng(marker.position));
                map.fitBounds(bounds);
                map.setZoom(12);
              }

              let contentString = '<div id="content" style="padding: 20px; border-radius: 8px; background-color:#444; color: #fff; width: 300px;">' +
                '<div id="bodyContent">' +
                '<div style="width: 100%;">' +
                '<div style="width: 100%;margin-bottom: 15px;">' +
                '<span style="font-family: Roboto-Bold;font-size: 24px; font-weight: 500;line-height:normal;color:#fff">' + mapData.storeName + '</span>' +
                '</div>' +
                '<div style="width: 100%;margin-bottom: 15px;">' +
                '<div style="display:inline-block;width: 54px;vertical-align: middle;">' +
                '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">' +
                '<img style="margin:8px 0 0 0;" src="assets/images/shop/map-map.png">' +
                '</span>' +
                '</div>' +
                '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">' +
                '<span style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff;">' +
                +mapData.address1 + mapData.address2 + ', ' + mapData.storeCity + ', ' + mapData.storeState + ', ' + mapData.storeZone +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div style="width: 100%;margin-bottom: 15px;">' +
                '<div style="display:inline-block;width: 54px;vertical-align: middle;">' +
                '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">' +
                '<img style="margin:10px 0 0 0;" src="assets/images/shop/map-email.png">' +
                '</span>' +
                '</div>' +
                '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">' +
                '<a href="mailto:abcautoservice@gmail.com" style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff !important;">' + mapData.emailAddress + '</a>' +
                '</div>' +
                '</div>' +
                '<div style="width: 100%;margin-bottom: 15px;">' +
                '<div style="display:inline-block;width: 54px;vertical-align: middle;">' +
                '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">' +
                '<img style="margin:8px 0 0 0;" src="assets/images/shop/map-number.png">' +
                '</span>' +
                '</div>' +
                '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">' +
                '<span style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff;">' + mapData.storeNo + '</span>' +
                '</div>' +
                '</div>' +
                '<div style="width: 100%;margin-bottom: 15px;">' +
                '<div id="callInfoFunction" style="cursor:pointer;width: 100%;height: 36px;padding:8px 0 0 0;border-radius: 8px;background-color: #006b5b;text-align: center;">' +
                '<img style="display:inline-block;position: relative;top:-1px" src="assets/images/shop/map-view.png">' +
                '<span style="padding-left:10px;display:inline-block;font-family: Roboto-Regular;line-height: 16px; font-size: 16px;text-align: left;color:#ffffff;">View Detail</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
              // let headerDate = this.mapHeaderDate;
              marker.addListener('click', () => {
                if (infowindow) {
                  infowindow.close();
                }
                infowindow = new window['google'].maps.InfoWindow({
                  content: contentString
                });
                infowindow.open(map, marker);
                google.maps.event.addListener(infowindow, 'closeclick', function () {
                  infowindow = null;
                });
                setTimeout(() => {
                  const shopDetails: any = { mapData };
                  (document.getElementById('callInfoFunction') as HTMLInputElement).addEventListener('click', () => {
                    const event3 = new CustomEvent('displayShopData', {
                      detail: shopDetails,
                    }
                    );
                    infowindow = null;
                    window.dispatchEvent(event3);
                  }, false);
                }, 500);
              });
            }
          });
        }, index * 500);
      }
    });
  }

  renderMap() {
    console.log('in render amp')
    window['initMap'] = () => {
      console.log(1)
      this.loadMap();
    };
    this.loadMap();
  }
  hideMap() {
    this.mapId = '';
    this.showMap = false;
  }

  // Get Geo Code
  geocode(address): Promise<any> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(new Error(status));
          }
        }
      );
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}