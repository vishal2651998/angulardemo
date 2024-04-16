import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shop-list-map',
  templateUrl: './shop-list-map.component.html',
  styleUrls: ['./shop-list-map.component.scss']
})
export class ShopListMapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;
  @Input('shopList') shopList:any;
  public center
  coordinates
  public mapOptions: google.maps.MapOptions
  mapData: any;
  mapValueData: any;
  mapHeight: any;
  constructor() {
    this.loadScript();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.renderMap();
  }

  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  loadMap = () => {
    console.log('in load map')
    // const bounds = new google.maps.LatLngBounds();
    setTimeout(() => {
      this.coordinates = new google.maps.LatLng(40.730610, -73.935242);
      this.mapOptions = {
        zoomControl: true,
        mapTypeControl: false,
        center: this.coordinates,
        zoom: 3,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
      };

      const map = new window['google'].maps.Map(this.mapElement.nativeElement, this.mapOptions);
      google.maps.event.trigger(map, "resize");
      const geocoder = new google.maps.Geocoder();
      let markerCoordinates = [{ name:"Precision Auto Care", shopNo:1,location:"1506 Redwood Hwy, Corte Madera, CA 94925",lat: 40.730710, lng: -73.935342 }, {name:"Star Cycles", shopNo:2,location:"1226 Pinewood Hwy, Sarte , CA 94925", lat: 40.730810, lng: -73.934342 }, { name:"Lenovo Service Center",location:"16 Record Hwy, adera hill, CA 92225" , shopNo:3,lat: 40.731810, lng: -73.934242 }, {name:"Thinkpad Tech",location:"12 Hillvile, Medra Torn, CA 94925", shopNo:4, lat: 40.731010, lng: -73.933842 }, {name:"Core Steels",location:"1506 Redwood Hwy, Corte Madera, CA 94925", shopNo:5, lat: 40.734010, lng: -73.940842 }, { name:"Label Cosmetics" ,location:"1506 Redwood Hwy, Corte Madera, CA 94925",shopNo:6 ,lat: 40.721010, lng: -73.923842 }, {name:"Ad+ Marketing",location:"106 Winehill ,  Corta, CA 94925", shopNo:7, lat: 40.732590, lng: -73.933654 }]
      this.shopList.forEach(e => {
        e["location"] = (e.address1 ? e.address1 + "," : "") + (e.address2 ? e.address2 + "," : "") + (e.city ? e.city + "," : "") + (e.state ? e.state + "," : "") + (e.countryName? e.countryName + "," : "");
        geocoder.geocode({address:e.location},(res,status)=>{
          if(res && res.length > 0){
           e["lng"] = res[0].geometry.location.lng();
            e["lat"] = res[0].geometry.location.lat();
            let marker = new google.maps.Marker({
              map: map,
              position: { lat: e.lat, lng: e.lng },
              icon: {
                url: "assets/images/hq/map-marker.png"
              }
            });
            let infowindow = null;
            marker.addListener('click', () => {
              if (infowindow) {
                infowindow.close();
                infowindow = null;
              } else {
                let contentString = `
                <div class="card map-card">
        <div class="card-body p-0 map-body">
            <h4 class="text-light fw-bold map-title">${e.name}</h4>
            <div class="d-flex align-items-center mb-20">
                <div class="avtar">
                    <img src="../../../../assets/images/hq/location-primary.png" alt="" width="15" height="19"
                        class="map-icons">
                </div>
    
                <p class="text-light flex-wrap m-0 pl-3">${e.location} </p>
            </div>
    
            <div class="d-flex align-items-center mb-20">
                <div class="avtar">
                    <img src="../../../../assets/images/hq/white-email.png" alt="" width="19" height="14"
                        class="map-icons">
                </div>
    
                <p class="text-light flex-wrap m-0 pl-3">${e.emailAddress}</p>
            </div>
            
            <div class="d-flex align-items-center mb-3">
            <div class="avtar">
            <img src="../../../../assets/images/hq/white-dealer.png" alt="" width="17" height="17"
            class="map-icons">
            </div>
    
            <p class="text-light flex-wrap m-0 pl-3">Shop#: ${e.id} </p>
        </div>
    
        <button class="btn detail-btn w-100">
        <img src="../../../../assets/images/hq/eye.png" alt="">
        <span class="ml-2">View Detail</span>
    </button>
        </div>
    </div>
                `
                infowindow = new window['google'].maps.InfoWindow({
                  content: contentString
                });
                infowindow.open(map, marker);
              }
            })
          }
        })
      })
    }, 2000);
  }

  renderMap() {
    console.log('in render amp')
    window['initMap'] = () => {
      console.log(1)
      this.loadMap();
    };
    this.loadMap();
  }
  gmNoop() {
    console.log('GMap Callback')
  }


}