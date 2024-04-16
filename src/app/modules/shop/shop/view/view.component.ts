import { Component, OnInit, Input, Output, EventEmitter, HostListener,  ViewChild, ElementRef} from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Constant } from '../../../../common/constant/constant';
import { Title } from "@angular/platform-browser";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ThreadService } from "src/app/services/thread/thread.service";
import * as moment from 'moment';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common/common.service';
import { AnnouncementWidgetsComponent } from '../../../../components/common/announcement-widgets/announcement-widgets.component';
import { LandingpageService } from '../../../../services/landingpage/landingpage.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @ViewChild('mapRef', { static: false }) mapElement: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public domainId;
  public userId;
  public countryId;
  public user: any;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyFlag: boolean = false;
  public loading: boolean = true;
  public pageAccess: string = "shops-view";
  public platformId;
  public shopId;
  public headTitle;
  public storeDetail;
  public tab1:boolean = true;;
  public tab2: boolean = false;
  public tab3: boolean = false;
  public mapId = '';
  public landingpageWidgets=[];
  public annLanding: boolean = true;
  public center: google.maps.LatLngLiteral;
  public options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
  };
  mapData: any;
  mapValueData: any;
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }
  constructor(
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private threadApi: ThreadService,
    private router: Router,
    private route: ActivatedRoute,
    private LandingpagewidgetsAPI: LandingpageService,
  ) {

  }
  ngOnInit(): void {
    console.log(this.route.params)
    this.route.params.subscribe( params => {
      this.shopId = params.id;
    });

    this.headTitle = "Shop Details - ID# "+this.shopId;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );



    this.bodyHeight = window.innerHeight;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);

    this.getlandingpagewidgets();
    this.loadScript();
    this.setScreenHeight();
    this.getShopDetails();

  }

  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  selectTap(type){
    switch(type){
      case 'tab1':
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        break;
      case 'tab2':
        this.tab1 = false;
        this.tab2 = true;
        this.tab3 = false;
        break;
      case 'tab3':
        this.tab1 = false;
        this.tab2 = false;
        this.tab3 = true;
        break;
    }
  }
  getShopDetails(){
    this.loading = false;
    let formData = new FormData();
    formData.append('apiKey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('storeNo', this.shopId);
    this.commonApi.getStoreInfoList(formData).subscribe((response) => {
      console.log(response.items[0]);
      this.storeDetail = response.items[0];
      this.storeDetail.address1 = this.storeDetail.address1 != '' ? this.storeDetail.address1+", " : "";
      this.storeDetail.address2 = this.storeDetail.address2 != '' ? this.storeDetail.address2+", " : "";
      this.storeDetail.storeCity = this.storeDetail.storeCity != '' ? this.storeDetail.storeCity+", " : "";
      this.storeDetail.storeState = this.storeDetail.storeState != '' ? this.storeDetail.storeState+", " : "";
      this.storeDetail.storeZone = this.storeDetail.storeZone != '' ? this.storeDetail.storeZone: "";
      this.storeDetail.address = this.storeDetail.address1+this.storeDetail.address2+this.storeDetail.storeCity+this.storeDetail.storeState+this.storeDetail.storeZone;
      this.mapId = "";
      this.mapValueData='';
      this.mapValueData=this.storeDetail.address;
      console.log(this.mapValueData) ;
      if(this.mapValueData != ''){
        setTimeout(() => {
          this.renderMap();
        }, 1000);
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

  loadMap = () => {
    let index = 1;
    console.log('in load map')
    const bounds = new google.maps.LatLngBounds();
    const map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      zoom: 8
    });
    let infowindow = null;
    console.log(this.mapValueData);
    const address = this.mapValueData;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( {address}, (results, status) => {
        console.log(address)
        console.log(results)
        console.log(status)
        if (status == google.maps.GeocoderStatus.OK) {
          const marker: any = new window['google'].maps.Marker({
            map: map,
            title: results[0].formatted_address,
            position: results[0].geometry.location,
            draggable: false,
            animation: window['google'].maps.Animation.DROP,
            label: {color: '#fff', fontSize: '14px', fontWeight: 'normal',
              text: (index).toString()}
          });
          bounds.extend(new window['google'].maps.LatLng(marker.position));
          map.fitBounds(bounds);
          map.setZoom(12);
          /*marker.addListener('click', () => {
            if (infowindow) {
              infowindow.close();
            }
            infowindow = new window['google'].maps.InfoWindow({
              content: ''
            });
          }); */

        }
      });
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = this.bodyHeight-100;
   }
   close(){
    setTimeout(() => {
      var data  = {
        action : 'close'
      }
      this.commonApi.emitShopDetailDataClose(data);
    }, 0);
    let wsNav = localStorage.getItem('wsNavUrl');
    let navUrl = 'shops';
    if(wsNav == "shops"){
      navUrl = 'shops';
    }
    else{
      navUrl = 'landing-page';
    }
    this.router.navigate([navUrl]);
    setTimeout(() => {
      localStorage.removeItem('wsNav');
      localStorage.removeItem('wsNavUrl');
    }, 100);
   }
   getlandingpagewidgets(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);

    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe((response) => {
      let rstatus = response.status;
      let rtotal = response.total;

      if (rstatus == 'Success') {
        if (rtotal > 0) {
          let rlandingPage = response.landingPage;
          for (let wi in rlandingPage) {

            var rcomponentName = rlandingPage[wi].componentName;
            var rplaceholder = rlandingPage[wi].placeholder;
            var rwid = rlandingPage[wi].id;

            localStorage.setItem('landingpage_attr' + rwid + '', JSON.stringify(rlandingPage[wi]));


            if (rwid == 1) {

              this.landingpageWidgets.push({ componentName: AnnouncementWidgetsComponent, placeholder: rplaceholder });
            }

            setTimeout(() => {
              this.annLanding = false;
            }, 1500);
          }
        }
      }

  });
  }

}
