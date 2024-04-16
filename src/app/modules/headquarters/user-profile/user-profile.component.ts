import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LandingpageService } from 'src/app/services/landingpage/landingpage.service';
import { UserDashboardService } from 'src/app/services/user-dashboard/user-dashboard.service';
import { Constant, pageInfo } from 'src/app/common/constant/constant';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { ImageCropperComponent } from '../../../components/common/image-cropper/image-cropper.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @ViewChild('mapRef1', {static: true }) mapElement1: ElementRef;
  @ViewChild('container', {static: true }) container!: ElementRef;
  
  public sidebarActiveClass:any = {};
  public bodyClass: string = "landing-page";
  public sections = [
    {id: 1, name: 'Home', img: 'assets/images/user-profile/sidebar/home-white.png', imgSeleted: 'assets/images/user-profile/sidebar/home-white.png'},
    {id: 2, name: 'Profile Details', img: 'assets/images/user-profile/sidebar/user-white.png', imgSeleted: 'assets/images/user-profile/sidebar/user-white.png'},
    // {id: 3, name: 'Work Orders', img: 'assets/images/user-profile/sidebar/work-order-grey.png', imgSeleted: 'assets/images/user-profile/sidebar/work-order-white.png'},
  ];
  selectedSectionId: any = 2;
  pageLoading: boolean = false;
  sidebarRef: SidebarComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  loadAddress: boolean;
  public headquartersFlag: boolean = true;
  public headTitle: string = "Headquarters";
  public headerFlag: boolean = false;
  public headerData: Object;
  public innerHeight: number;
  public bodyHeight: number;
  public leftEmptyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  subLevel:string = "";
  level:string = "";
  pageAccess: string = "market-place";
  googleMapInfo: any = '';
  public googleMapUrl: string = "https://www.google.com/maps/embed/v1"
  public googleApiKey: string = 'AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
  showMap: boolean = false;
  selectedOptions4: any;
  orderOptions = [
    { name: '7 Days', code: '7 DAY' },
    { name: '14 Days', code: '14 DAY' },
    { name: '1 Month', code: '1 MONTH' },
    { name: '2 Months', code: '2 MONTH' },
    { name: '3 Months', code: '3 MONTH' },
    { name: '4 Months', code: '4 MONTH' },
    { name: '5 Months', code: '5 MONTH' },
    { name: '6 Months', code: '6 MONTH' }
  ];
  listView: boolean = true;
  loading: boolean;
  mapValueData: any = [
    { "id": "17", "domainId": "1", "name": "Weiskopf Consulting", "customerId": null, "email": "Consulting@intuit.com", "phoneNumber": "(650) 555-1423", "dialCode": "+1", "e164Number": "", "internationalNumber": "", "countryCode": "", "address_1": "45612 Main St.", "address_2": "", "state": "California", "state_code": "CA", "city": "Bayshore", "zip": "94326", "noOfTrainings": "0" },
    { "id": "18", "domainId": "1", "name": "Wedding Planning by Whitney", "customerId": null, "email": "Dream_Wedding@intuit.com", "phoneNumber": "(650) 557-2473", "dialCode": "+1", "e164Number": "", "internationalNumber": "", "countryCode": "", "address_1": "135 Broadway", "address_2": "", "state": "California", "state_code": "CA", "city": "Menlo Park", "zip": "94304", "noOfTrainings": "0" }
  ];
  hideNavs: boolean = false;
  userData: any = "";
  profileCertificationData: any = "";
  profileTraningData: any = "";
  profileOrgData: any = "";
  user: any;
  hideBreadCrumbs: boolean;
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  shopId: string;
  public apiKey: string = Constant.ApiKey;
  shopData:any;
  dekraNetworkId:any;
  currentAttribute:any;
  currentItem:any;
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;
  public domainId;
  public userId;
  gridStatusColumns = [
    { field: 'listoflocations', header: 'List of locations', columnpclass: 'w1 header thl-col-1 ' },
    { field: 'laststatus', header: 'Number of days since last stauts change', columnpclass: 'w1 header thl-col-2' },
    // { field: 'progress', header: 'Progress', columnpclass: 'w1 header thl-col-6' },
     ];

  shopList:any = [
    {name:"Volvo",address1:'880 University Ave West, St. Paul, MN 55104',address2:" Schmelz Countryside Volkswagen",address3:"(402402)-CER 4L",progress :1 , laststatus: "Certificaiton Audit", elapsed: "12",img:"volvo.png",id:"(ID# 3454)"},
    {name:"VW of US",address1:'25 New York Ave #4, Huntington, NY 11743',address2:"Volkswagen of Smithtown",address3:"(408359)-NER 1G",progress :2 , laststatus: "CCRF Assessment", elapsed: "73",img:"vw.png",id:"ID# 4359"},
    {name:"BMW of US",address1:'5280 N Garfield Ave, Loveland, CO 80538',address2:"Ed Carroll Motor Company, Inc",address3:"(420112)-CER 4G",progress :3 , laststatus: "Repair Process Quality  Asssessment", elapsed: "33",img:"bmw.png",id:"ID# 4356"},
    {name:"Crash Champions",address1:'7920 Jaguar Trail, St. Louis, MO 63143',address2:" The Dean Team of Ballwin",address3:"(424140)-CER 4P",progress :4 , laststatus: "Collision quality", elapsed: "35",img:"crash.png",id:"ID# 43537"},
    {name:"Caliber",address1:'80-82 Olympia Ave, Woburn, MA 01801',address2:"Minuteman Volkswagen, Inc",address3:"(401057)-NER 1M",progress :5 , laststatus: "Automotive Lift Inspection2", elapsed: "03",img:"volvo.png",id:"ID# 435445"},
  ]
  isBlank = false;
  currentUser: any = "";
  addUserVisible: boolean = false;
  userModalData: { moreUserInfo: boolean; parentId: string; actiontype: any; actionFormType: string; formType: string; item: any; titletext: string; };
  level1: any;
  level2: any;
  level3: any;
  public bodyElem;

  constructor(
        /* basic setup */
        private titleService: Title,
        private router: Router,
        private LandingpagewidgetsAPI: LandingpageService,
        private location: PlatformLocation,
        private inj: Injector,
        private authenticationService: AuthenticationService,
        private userDashboardApi: UserDashboardService,
        private formBuilder: FormBuilder,
        public apiUrl: ApiService,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer,
        public headQuarterService:HeadquarterService,
        private route:ActivatedRoute,
        // private parentInjector: Injector
        /* basic setup */
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.user = this.authenticationService.userValue;
    this.hideBreadCrumbs = this.user?.data && this.user?.data?.shopId ? true : false;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.setScreenHeight()
    let url: any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
      pageInfo: pageInfo.landingPage
    };
    if(this.router.url.includes("blank")){
      this.isBlank = true;
    }
      if(this.router.url.includes("all-shops")){
        this.level =  "";
        this.subLevel =  "";    
        this.shopId = this.router.url.split('/')[4];    
      }else{
        this.level =  this.router.url.split('/')[3];
        this.subLevel =  this.router.url.split('/')[4];    
        this.shopId =  this.router.url.split('/')[6];     
      }
    this.currentUser = this.route.snapshot.params.userid;
    this.selectedSectionId = this.route.snapshot.params.sectionid == undefined ? '1' : this.route.snapshot.params.sectionid;
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if(event.url.includes("all-shops")){
          this.level =  "";
          this.subLevel =  "";    
          this.shopId = event.url.split('/')[4];    
        }else{
          this.level =  event.url.split('/')[3];
          this.subLevel =  event.url.split('/')[4];    
          this.shopId =  event.url.split('/')[6];     
        }
       }
    });    
   
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: false,
    };
    this.loadScript();
    if(this.router.url.includes("level-details") || this.router.url.includes("all-shops")){
      this.hideNavs = true;
    }

    this.getUserList(); 
    if(this.shopId != undefined){
      this.getShopDetails();
    }   

    this.profileCertificationData = {
      fieldname: 'certification',
      title: 'Certification',
      titleText: 'Certification',
      page: 'user-profile',
    }
    this.profileTraningData = {
      fieldname: 'training',
      title: 'Training',
      titleText: 'Training',
      page: 'user-profile',
    }
    this.profileOrgData = {
      fieldname: "organization",
      title: "Organization ID's",
      titleText: "Organization",
      page: 'user-profile',
    }
    this.getSectionData(2);
  }
  getShopDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("id", this.shopId);
     this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      if(response && response.items && response.items.length > 0 && response.items[0]){
      
        let resultData:any = [];
        resultData = response.items[0];
        
        this.headQuarterService.currentShopName = resultData.name;
        this.headQuarterService.currentShopId = resultData.id;

        // userlist show
        resultData.userInfoData = [];
        let type = 'shop-detail';   
         let levelone =  (resultData.levelOneUsersList && resultData.levelOneUsersList.length>0) ? true : false;
        let leveltwo =  (resultData.levelTwoUsersList && resultData.levelTwoUsersList.length>0) ? true : false;
        let levelthree =  (resultData.levelThreeUsersList && resultData.levelThreeUsersList.length>0) ? true : false;
        
        if(levelone){         
          resultData.levelOneUsersList.forEach(itemuser => {
            itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
            itemuser.email = itemuser.email;
            itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
            itemuser.editAccess = false;
          }); 
        }
        resultData.userInfoData.push({
          dataId: resultData.levelOneId,
          type: type,
          dynamictext: resultData.levelOneName,
          credateAccess : false,
          users:resultData.levelOneUsersList
        });  
        
        if(leveltwo){         
          resultData.levelTwoUsersList.forEach(itemuser => {
            itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
            itemuser.email = itemuser.email;
            itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
            itemuser.editAccess = false;
          }); 
        }
        resultData.userInfoData.push({
          dataId: resultData.levelTwoId,
          type: type,
          dynamictext: resultData.levelTwoName,
          credateAccess : false,
          users:resultData.levelTwoUsersList
        });  

        if(levelthree){         
          resultData.levelThreeUsersList.forEach(itemuser => {
            itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
            itemuser.email = itemuser.email;
            itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
            itemuser.editAccess = false;
          }); 
        }
        /*
        const address = resultData.address1 + resultData.address2 + ',' + resultData.city + ',' + resultData.state + ',' + resultData.zip;
        resultData['gmapcanvas'] = "gmap_canvas_" + resultData.id;
        resultData['googleMapInfo'] = '';
        resultData['googleMapInfo'] = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
        resultData['googleMapInfo'] = this.sanitizer.bypassSecurityTrustResourceUrl(resultData['googleMapInfo']);
        */
  
        this.shopData = resultData;

        if(this.userData?.address1 == '' && this.userData?.address2 == '' && this.userData?.city == '' && this.userData?.state == '' && this.userData?.zip == ''){
         
            if(this.shopData?.address1 != '' || this.shopData?.address2 != '' || this.shopData?.city != '' || this.shopData?.state != '' || this.shopData?.zip != ''){
              this.userData['address1'] = this.shopData?.address1;
              this.userData['address2'] = this.shopData?.address2;
              this.userData['city'] = this.shopData?.city;
              this.userData['state'] = this.shopData?.state;
              this.userData['zip'] = this.shopData?.zip;
            } 
            this.setupMap(this.userData);
                     
        }


        // this.level - this.shopData.level
      }
      this.getHqDetails();
      })
  }
  getHqDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
     this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
        if(response && response.data && response.data.attributesInfo.length > 0 ){

          if(this.level && this.subLevel){
            let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
            this.currentAttribute = attribute;
            this.headQuarterService.levelName = attribute.name;
            let currentItem = attribute.items.find(e=>e.id == this.subLevel);
            this.currentItem = currentItem;
            this.headQuarterService.sublevelName = currentItem.name;
          }

          this.level1 = response.data.attributesInfo.find(e=>(e.displayOrder == 1));
          this.level2 = response.data.attributesInfo.find(e=>(e.displayOrder == 2));
          this.level3 = response.data.attributesInfo.find(e=>(e.displayOrder == 3));

          // this.shopLevelOneData = level1?.items.find(e=>e.id == this.shopData.levelOneId);
          // this.shopLevelTwoData = level2?.items.find(e=>e.id == this.shopData.levelTwoId);
          // this.shopLevelThreeData = level3?.items.find(e=>e.id == this.shopData.levelThreeId);
        }
      })
  }

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 30;
    //let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 176);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;
    this.nonEmptyHeight = headerHeight + 115;
  }

  back(step) {
    if (step == 'Headquarters') {
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/network`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
    if (step == 'Region') {
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shops`]);
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
if(step == "allShops"){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/all-shops`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
    }
  }

  menuNav(item) {
    console.log(item)
    console.log(this.sidebarRef)
    let section = item.slug;
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case 'home':
        this.router.navigate(["/headquarters/home"]);
        return false;
      break;
      case 'tools':
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
        break;
      case 'dekra-audit':
        this.router.navigate(["/headquarters/audit"]);
        return false;
      break;
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;
      default:
        break;
    }

  }

  getSectionData(id: any) {
    if(!this.listView) this.listView = true;
    this.selectedSectionId = id;
    this.container.nativeElement.scrollTop = 0 ;
  }

  loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  getUserList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("editUserId", this.currentUser);
    this.headQuarterService.getUserList(apiFormData).subscribe((response:any) => {
        if(response.items && response.items.length){
          if( response.items[0].createdAt){
            response.items[0].createdOn = new Date(response.items[0].createdOn);
          }
        this.userData = response.items[0];
       
        if(this.userData?.address1 != '' || this.userData?.address2 != '' || this.userData?.city != '' || this.userData?.state != '' || this.userData?.zip == ''){
          this.setupMap(this.userData); 
        }
        
        if(this.shopId == undefined){
        this.shopId = this.userData.shopId;        
          this.getShopDetails();
        }        

      }
    });

    

  }

  closeDrawer(){
    this.addUserVisible = false;
    this.getUserList();
    this.getShopDetails();
  }

  setupMap(serviceShop) {
    //if (serviceShop.address1 != '') {
      this.loadAddress = true;
      const address = serviceShop.address1 + serviceShop.address2 + ',' + serviceShop.city + ',' + serviceShop.state + ',' + serviceShop.zip;
      this.googleMapInfo = "";
      this.googleMapInfo = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
      this.googleMapInfo = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleMapInfo);
    //}
      console.log(this.googleMapInfo)

    /*if (serviceShop.address != '') {
      const address = serviceShop.address1 + serviceShop.address2 + ',' + serviceShop.city + ',' + serviceShop.state + ',' + serviceShop.zip;
      this.headquaterData[index]['gmapcanvas'] = "gmap_canvas_" + serviceShop.dataId;
      this.headquaterData[index]['googleMapInfo'] = '';
      this.headquaterData[index]['googleMapInfo'] = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
      this.headquaterData[index]['googleMapInfo'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.headquaterData[index]['googleMapInfo']);
    }*/
  }

  openUserPOPUP(actiontype,type='') {  
    this.addUserVisible = true;
    this.userModalData = {
      moreUserInfo: type == 'more' ? true : false,
      parentId: this.headQuarterService.currentShopId,
      actiontype: actiontype,
      actionFormType: 'shop',
      formType: '',
      item: this.userData,
      titletext: type == 'more' ? 'User Info' : 'User Profile Info',
    }    
  }
  
  shopView(action) {
    let viewFlag = (action == 'map') ? false : true;
    if(this.listView != viewFlag) {
      this.listView = viewFlag;
      if(!this.listView) {
        this.callbackMap();
      }
    }
  }

  callbackMap(action='') {
    if(action == '') {
      // this.loading = true;
      setTimeout(() => {
        // this.loading = false;
      }, 10);
      this.showMap = false;
      // this.mapValueData = [];
      // this.customerListData.forEach(citem => {
      //   console.log(citem)
      //   if(citem.mapFlag) {
      //     this.mapValueData.push(citem);
      //   }
      // });
    } else {
      this.showMap = false;
    }
    setTimeout(() => {
      this.showMap = true;
      this.renderMap();
    }, 100);
  }

  renderMap(type = '', mapInfoData = []) {
    console.log('in render map')
    window['initMap'] = () => {
      console.log(1)
      this.loadMap(type, mapInfoData);
    };
    this.loadMap(type, mapInfoData);
  }

  loadMap = (type,mapInfoData) => {
    console.log('in load map', this.mapValueData, type, mapInfoData);
    const bounds = new google.maps.LatLngBounds();
    let map;
    if(type == '') {
      map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        zoom: 6
      });
    } else {
      map = new window['google'].maps.Map(this.mapElement1.nativeElement, {
        zoom: 6
      });
    }
    let infowindow = null;
    let mapData = (type == '') ? this.mapValueData : mapInfoData;
    mapData.forEach((mapData: any, index: number) => {
      // const lat: any = parseFloat(mapData.lat);
      // const lng: any = parseFloat(mapData.lng);
      const geocoder = new google.maps.Geocoder();
      const address = mapData.address_1 + mapData.address_2 + ',' + mapData.city + ',' + mapData.state + ',' + mapData.zip;
      console.log(address)
      setTimeout( function () {
        geocoder.geocode( {address}, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            const lat: any = results[0].geometry.location.lat();
            const lng: any = results[0].geometry.location.lng();
            const marker: any = new window['google'].maps.Marker({
              position: {lat, lng},
              map,
              title: mapData.shopName,
              draggable: false,
              animation: window['google'].maps.Animation.DROP,
              label: {color: '#fff', fontSize: '14px', fontWeight: 'normal',
                text: (index + 1).toString()}
            });
            if (!index) {
              bounds.extend(new google.maps.LatLng(marker.position));
              map.fitBounds(bounds);
              map.setZoom(6);
            }
            //console.log(mapData.address1);
            let doorNo = mapData.address_1;
            let contentString = '<div id="content" style="padding: 20px; border-radius: 8px; background-color:#444; color: #fff; width: 300px;">'+
              '<div id="bodyContent">'+
              '<div style="width: 100%;">'+
              '<div style="width: 100%;margin-bottom: 15px;">'+
              '<span style="font-family: Roboto-Bold;font-size: 24px; font-weight: 500;line-height:normal;color:#fff">'+mapData.name+'</span>'+
              '</div>'+
              '<div style="width: 100%;margin-bottom: 15px;">'+
              '<div style="display:inline-block;width: 54px;vertical-align: middle;">'+
              '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">'+
              '<img style="margin:8px 0 0 0;" src="assets/images/shop/map-map.png">'+
              '</span>'+
              '</div>'+
              '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">'+
              '<span style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff;">'+doorNo+ ', ' + mapData.city + ', ' + mapData.state + ', ' + mapData.zip+
              '</span>'+
              '</div>'+
              '</div>';

            if (mapData.email) {
              contentString +='<div style="width: 100%;margin-bottom: 15px;">'+
                '<div style="display:inline-block;width: 54px;vertical-align: middle;">'+
                '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">'+
                '<img style="margin:10px 0 0 0;" src="assets/images/shop/map-email.png">'+
                '</span>'+
                '</div>'+
                '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">'+
                '<a href="mailto:'+mapData.email+'" style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff !important;">'+mapData.email+'</a>'+
                '</div>'+
                '</div>';
            }
            contentString +='<div style="width: 100%;margin-bottom: 15px;">'+
              '<div style="display:inline-block;width: 54px;vertical-align: middle;">'+
              '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">'+
              '<img style="margin:8px 0 0 0;" src="assets/images/shop/map-number.png">'+
              '</span>'+
              '</div>'+
              '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">'+
              '<span style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff;">Customer#: '+mapData.id+'</span>'+
              '</div>'+
              '</div>'+
              '<div style="width: 100%;margin-bottom: 15px;">'+
              '<div id="callInfoFunction" style="cursor:pointer;width: 100%;height: 36px;padding:8px 0 0 0;border-radius: 8px;background-color: #006b5b;text-align: center;">'+
              '<img style="display:inline-block;position: relative;top:-1px" src="assets/images/shop/map-view.png">'+
              '<span style="padding-left:10px;display:inline-block;font-family: Roboto-Regular;line-height: 16px; font-size: 16px;text-align: left;color:#ffffff;">View Detail</span>'+
              '</div>'+
              '</div>'+
              '</div>'+
              '</div>'+
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
              google.maps.event.addListener(infowindow, 'closeclick', function() {
                infowindow = null;
              });
              setTimeout(() => {
                const customerDetails:any = { mapData };
                (document.getElementById('callInfoFunction') as HTMLInputElement).addEventListener('click', () => {
                  const event3 = new CustomEvent('displayCustomerData',  {
                      detail: customerDetails,
                    }
                  );
                  infowindow = null;
                  window.dispatchEvent(event3);
                }, false);
              }, 500);
            });
          }
        });
      }, index * 1);
    });
  }

    // Get Geo Code
    geocode(address): Promise<any> {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({address: address},
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

    updateGrapic(type = '') {
      this.bodyElem.classList.add("profile");
      this.bodyElem.classList.add("image-croppe");
      const modalRef = this.modalService.open(ImageCropperComponent, { backdrop: 'static', keyboard: false, centered: true });
      modalRef.componentInstance.userId = this.currentUser;
      modalRef.componentInstance.domainId = this.domainId;
      modalRef.componentInstance.type = "Edit";
      modalRef.componentInstance.profileType = 'user-profile';
      modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
        if (receivedService) {
          this.bodyElem.classList.remove("profile");
          this.bodyElem.classList.remove("image-croppe");
          modalRef.dismiss('Cross click');
          this.userData.profileImage = receivedService.show;   
        }
      });
    }
}
