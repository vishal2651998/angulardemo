import { Component, OnInit, Input, Output, EventEmitter, HostListener,  ViewChild, ElementRef} from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ThreadService } from "src/app/services/thread/thread.service";
import * as moment from 'moment';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-traning-detail',
  templateUrl: './view-traning-detail.component.html',
  styleUrls: ['./view-traning-detail.component.scss']
})
export class ViewTraningDetailComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @Input() trainingId;
  @Output() trainingServices: EventEmitter<any> = new EventEmitter();

  public sconfig: PerfectScrollbarConfigInterface = {};
  public headTitle: string = "";
  public domainId;
  public userId;
  public countryId; 
  public user: any;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyFlag: boolean = false;
  public loading: boolean = true;
  public trainingData:any
  public manualData:any
  public pageAccess: string = "market-place";
  public platformId;
  openTraining: boolean;
  payablePrice: any;
  domainData: any;
  pageLoading: boolean = false
  defaultDynamicHeight: any;
  dynamicHeight: any;
  zoomWarning: any = false;
  doNotShowAgain: any = false;
  zoomLink: any;
  copiedModal = false;
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }
  constructor(
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private threadApi: ThreadService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.bodyHeight = window.innerHeight;
      
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      
    this.setScreenHeight();
    this.getTrainingDetails();

    if (typeof google === 'object' && typeof google.maps === 'object') {

    } else {
      this.loadMapScript();
    }

    this.headTitle = "Training Details - ID# "+this.trainingId;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );

  }
  copyLink(link: any) {
    navigator.clipboard.writeText(link);
    this.copiedModal = true;
    setTimeout(() => {
      this.copiedModal = false;
    }, 1500);
  }

  openSigninLink() {
    window.open('https://us06web.zoom.us/signin', '_blank');
  }


  redirectToLink(link) {
    if (link.indexOf('http://') == 0 || link.indexOf('https://') == 0) {
      window.open(link, '_blank');
    } else {
      const prefix = 'http://';
      link = prefix + link;
      window.open(link, '_blank');
    }
    this.zoomWarning = false;
  }

  storeInLocalhost() {
    localStorage.setItem('doNotShowAgain', this.doNotShowAgain);
  }

  redirectToZoomLink(link) {
    this.zoomLink = link;
    if (!this.doNotShowAgain) {
      this.zoomWarning = true;
    } else {
      window.open(link, "_blank");
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

  loadMap = () => {
  
    const bounds = new window['google'].maps.LatLngBounds();
    const mapElement = document.getElementById('map');
    const map = new window['google'].maps.Map(mapElement, {
      zoom: 8
    });
    let infowindow = null;
    const geocoder = new window['google'].maps.Geocoder();
    const address = this.trainingData.addressLine1 + this.trainingData.addressLine2 + ',' + this.trainingData.city + ',' + this.trainingData.state + ',' + this.trainingData.zipCode;
    geocoder.geocode( {address}, (results, status) => {
      if (status == window['google'].maps.GeocoderStatus.OK) {
        this.defaultDynamicHeight = "0px";
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        if (lat && lng) {
          this.dynamicHeight = "238px";
        } else {
          this.dynamicHeight = "0px";
        }
        const marker: any = new window['google'].maps.Marker({
          position: {lat, lng},
          map,
          title: this.trainingData.venueName,
          draggable: false,
          animation: window['google'].maps.Animation.DROP,
        });
        bounds.extend(new window['google'].maps.LatLng(marker.position));
        map.fitBounds(bounds);
        map.setZoom(12);
        marker.addListener('click', () => {
          if (infowindow) {
            infowindow.close();
          }
          infowindow = new window['google'].maps.InfoWindow({
            content: ''
          });
        });
      } else {
        this.defaultDynamicHeight = "238px";
      }
    });
  }

  renderMap() {
    window['initMap'] = () => {
      this.loadMap();
    };
    this.loadMap();
  }

  public loadScript() {
    /*<script src="https://velox.transactiongateway.com/token/Collect.js"
    data-tokenization-key="jQdDdW-MAC7mM-7m8NtW-Cm5V39"
    data-payment-type="cc" data-theme="material"></script>*/
    let node = document.createElement('script');
    node.src = 'https://velox.transactiongateway.com/token/Collect.js';
    node.type = 'text/javascript';
    node.setAttribute('data-tokenization-key', 'jQdDdW-MAC7mM-7m8NtW-Cm5V39');
    node.setAttribute('data-payment-type', 'cc');
    node.setAttribute('data-theme',  'material');
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  loadMapScript() {
    const mapNode = document.createElement('script');
    mapNode.src = 'https://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false&key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    mapNode.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(mapNode);
  }

  getTrainingDetails(){
    let threadApiData = {
      access: this.pageAccess,
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      threadId: this.trainingId,
      platform: this.platformId,
      apiType: 1,
    };
    this.threadApi.apiGetMarketPlaceEditData(threadApiData).subscribe((response) => {
      if (response.status == 'Success') {
        this.trainingData = response.data.marketPlaceData;
        this.manualData = response.data.manual;
        
        if (this.trainingData.isSold == '0' && this.trainingData.isClosed == '0') {
          this.openTraining = true;
        }
        else{
          this.openTraining = false;
        }

        this.payablePrice = this.trainingData.price && this.trainingData.price != '0' ? this.trainingData.price : 0;
        this.domainData = response.data.businessDomainData;

        if (this.trainingData.trainingMode == 'Seminar') {
          setTimeout(() => {
            this.renderMap();
          }, 500);
        }
        
        this.doNotShowAgain = localStorage.getItem('doNotShowAgain') ? localStorage.getItem('doNotShowAgain') : false;
        if ((this.doNotShowAgain || this.doNotShowAgain == 'true')) {
          this.zoomWarning = false;
        } else {
          if (this.trainingData.trainingMode == 'Online') {
            this.zoomWarning = true;
          } else {
            this.zoomWarning = false;
          }
        }

        this.loading = false;
      } 
    }, (error: any) => {
        console.log(error);

      });
  }
   // Set Screen Height
   setScreenHeight() {
    this.innerHeight = this.bodyHeight-120;
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
      return moment(value).format('h:mm A');
    } else {
      return '';
    }
  }

  getDayfromDate(value: any) {
    if (value) {
      return moment(value).format('ddd');
    } else {
      return '';
    }
  }

  getHourOnlyFormat(value: any) {
    if (value) {
      return moment(value).format('h A');
    } else {
      return '';
    }
  }

  addDateAndFormat(value: any, index: any) {
    if (value) {
      return moment(value).add(index, 'days').format('MMM DD, YYYY');
    } else {
      return '';
    }
  }

  getDateTimeFormat(value: any) {
    if (value) {
      return moment(value).format('MMM DD, YYYY h:mm A');
    } else {
      return '';
    }
  }


   closeModal() {
    let data = {
      action: false
    };
    this.trainingServices.emit(data);
  }

  goToManual(id) {
    let url = 'marketplace/domain/' + this.domainId + '/manual/' + id; 
    window.open(url,url);
  }


}
