import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { Constant, ContentTypeValues } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ApiService } from 'src/app/services/api/api.service';
import { ExportPopupComponent } from 'src/app/components/common/export-popup/export-popup.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { RepairOrderListComponent } from 'src/app/components/common/repair-order-list/repair-order-list.component';
import { ProductMatrixService } from 'src/app/services/product-matrix/product-matrix.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import * as moment from 'moment';
import * as ClassicEditor from "src/build/ckeditor";

declare var $:any;
declare let google: any;


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @ViewChild('mapRef1', {static: true }) mapElement1: ElementRef;
  roListPageRef: RepairOrderListComponent;
  @Input() pageAccess: string = "";
  @Input() paramFlag: boolean = false;
  @Output() customerComponentRef: EventEmitter<CustomerListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<CustomerListComponent> = new EventEmitter();  
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass1: string = "parts-list";
  public redirectionPage='';
  public pageTitleText='';
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public roleId;
  public customerListColumns: any = [];
  public customerListData: any = [];
  public customerDetail: any = [];
  public repairOrderItems: any = [];
  public techList: any = [];
  public pTableHeight = '580px';
  public contentType: any = 52;
  public assetPath: string = "assets/images/";
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public bodyElem;
  public bodyClass2: string = "submit-loader";
  public headTitle: string = "Customers";
  public headImage: string = "assets/images/common/customer-head-icon.png";
  public backImage:string = "assets/images/site/workstream-creation/back.png";
  public access: string = "customers";
  public accessFrom: string = "customers-lazy-loader";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
  public countryId;
  public apiData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public showMap: any = false;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemResponse = [];
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public loadAddress: boolean = false;
  public mapHeaderDate = '';
  public mapId = '';
  public googleMapInfo: any = "";
  public googleMapUrl: string = "https://www.google.com/maps/embed/v1"
  public googleApiKey: string = 'AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
  public center: google.maps.LatLngLiteral;
  public options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
  };
  mapData: any;
  mapValueData: any;
  mapHeight: any;
  zoom = 4;
  mapConfig: any = {
    disableDefaultUI: true,
    fullscreenControl: true,
    zoomControl: true
  };
  public listView: boolean = true;
  public customerAccess: string = "summary";
  public cscrollHeight: any = 0;
  public customerId: number = 0;
  public view: number = 1;
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLable: string = "Upload Customers";
  public filesArr: any;
  public uploadedFiles: any[] = [];
  public attachments: any[] = [];
  public attachmentProgress: boolean = false;
  public uploadTxt: string = "Uploading...";
  public successMsg: string = this.uploadTxt;
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public summaryFlag: boolean = true;
  public searchVal: string = '';
  public searchFlag: boolean = false;
  public roFlag: boolean = false;
  public uploadFlag: any = null;
  public loadedSoFar = 0;
  public progress = 0;
  public percentDone = 0;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public errModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  public address: string = "";
  public listLoading: boolean = false;
  public customerNotesFlag: boolean = false;
  public customerNotes: string = '';
  public contentDisplay:any;
  public customerEditor: string = '';
  public notesUpdatedByName: string = '';
  public notesUpdatedOnDate: string = '';
  public notesModalFlag: boolean = false;
  public notesValid: boolean = false;
  public customerDetailView:boolean = false;
  public Editor = ClassicEditor;
  configCke: any = {
    toolbar: {
      emoji: [
        { name: 'smile', text: '😀' },
        { name: 'wink', text: '😉' },
        { name: 'cool', text: '😎' },
        { name: 'surprise', text: '😮' },
        { name: 'confusion', text: '😕' },
        { name: 'crying', text: '😢' }
    ],
      items: [
       "bold",
        "Emoji",
        "italic",
        "link",
       "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",

      ],
    },
    placeholder: 'Enter customer notes',
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.apiUrl.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
  constructor(
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public sanitizer: DomSanitizer,
    private probingApi: ProductMatrixService,
  ) {
    this.location.onPopState (() => {
      if(this.customerId > 0 && this.view > 1) {
        let backAction:any = true;
        localStorage.setItem('customerBackAction', backAction);
        let customerInfo = {
          view: this.view,
          customerAccess: this.customerAccess,
          customerId: this.customerId,
          customerListColumns: this.customerListColumns,
          customerListData: this.customerListData,
          customerDetail: this.customerDetail,
          repairOrderItems: this.repairOrderItems,
          displayNoRecords: this.displayNoRecords,
          itemEmpty: this.itemEmpty,
          itemLength: this.itemLength,
          itemTotal: this.itemTotal,
          itemOffset: this.itemOffset,
          roItemOffset: this.roListPageRef.itemOffset,
          summaryFlag: this.summaryFlag,
          roFlag: this.roFlag,
          techList: this.techList
        }
        localStorage.setItem('cutomerInfo', JSON.stringify(customerInfo));
      }
    });
  }

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  @HostListener('window:displayCustomerData', ['$event'])
  displayService(event: any): void {
    this.viewInfo(event.detail.mapData);
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId; 
    this.countryId = localStorage.getItem('countryId');
    this.customerDetailView = this.paramFlag;
    this.loadScript();
    let backAction = localStorage.getItem('customerBackAction');
    if(backAction) {
      let custInfo = JSON.parse(localStorage.getItem('cutomerInfo'));
      console.log(custInfo)
      this.view = custInfo.view;
      this.customerListColumns = custInfo.customerListColumns;
      this.customerDetail = custInfo.customerDetail;
      this.customerListData = custInfo.customerListData;
      this.displayNoRecords = custInfo.displayNoRecords;
      this.itemEmpty = custInfo.itemEmpty;
      this.itemLength = custInfo.itemLength;
      this.itemOffset = custInfo.itemOffset;
      this.itemTotal = custInfo.itemTotal;
      this.repairOrderItems = custInfo.repairOrderItems;
      this.customerAccess = custInfo.customerAccess;
      this.customerId = custInfo.customerId;
      this.summaryFlag = custInfo.summaryFlag;
      this.roFlag = custInfo.roFlag;
      this.techList = custInfo.techList;
      this.loading = false;
      this.loadAddress = false;
      this.setupMap(this.customerDetail);
      setTimeout(() => {
        localStorage.removeItem('customerBackAction');
        localStorage.removeItem('cutomerInfo');
        this.callback.emit(this);
      }, 100);
    } else {
      switch (this.pageAccess) {
        case 'customers':
          this.cscrollHeight = 184;
          this.getCustomerData();
          break;
        case 'market-place-quiz':
          this.cscrollHeight = 194;
          this.getMarketingCustomerData();
          break;  
      }
    }
  }
  getCustomerData() { 
    let offset = (this.view == 1) ? this.itemOffset : 0;
    let customerData = {
      apikey: this.apiKey,
      domainId: this.domainId,
      userId: this.userId,
      customerId: this.customerId,
      offset,
      limit: this.itemLimit,
      view: this.view,
      access: this.customerAccess,
    };
    if(this.searchFlag){
      customerData['search'] = this.searchVal;
    }
    this.customerDetail = [];
    this.repairOrderItems = [];
    this.commonApi.getCustomerList(customerData).subscribe((response) => {
      console.log(response)
      let responseData = response.data;
      let resultItems = responseData.items;
      if(this.itemOffset == 0) {
        this.customerListColumns = responseData.columns;
      }
      switch(this.view) {
        case 1:
          this.itemTotal = responseData.total;
          this.itemEmpty = (this.itemTotal == 0) ? true : false;
          this.displayNoRecords = this.itemEmpty;
          this.displayNoRecordsShow = (this.itemTotal == 0) ? 1 : this.displayNoRecordsShow;
          resultItems.forEach(item => {
            this.customerListData.push(item);            
          });
          setTimeout(() => {
            this.mapValueData = this.customerListData;
          }, 100);
          if(this.itemTotal > 0 && resultItems.length > 0) {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemLength += resultItems.length;
            this.itemOffset += this.itemLimit;
            setTimeout(() => {
              if (!this.displayNoRecords) {         
                let listItemHeight;
                listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
                  document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
                if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
                  this.scrollCallback = false;
                  this.lazyLoading = true; 
                  this.getCustomerData();
                  this.lastScrollTop = this.scrollTop;
                }
              }
            }, 1500);
          }
          this.loading = false;
          this.lazyLoading = false;
          this.listLoading = false;
          break;
        case 2:
          this.lazyLoading = false;
          this.customerDetail = resultItems[0];
          let content = ''; 
          this.customerNotesFlag = false;    
          if(this.customerDetail.customerNotes!='') {       
            this.customerNotesFlag = true;
            content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.customerDetail.customerNotes));
            this.customerNotes = content;
            let contentDisplay = content;
            this.contentDisplay = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentDisplay));
    
            let editdate1 = this.customerDetail.notesUpdatedOn;
            let editdate2 = moment.utc(editdate1).toDate();
            this.notesUpdatedOnDate = moment(editdate2).local().format('MMM DD, YYYY h:mm A');
            this.notesUpdatedByName = this.customerDetail.notesUpdatedByName;
          }
      
         
          if(this.pageAccess == 'customers') {
            this.repairOrderItems = this.customerDetail.roItems;
          }
          this.techList = this.customerDetail.techList;
          this.headTitle = `${this.customerDetail.name} (ID # ${this.customerDetail.id})`;
          this.setupMap(this.customerDetail);          
          setTimeout(() => {
            this.loading = false;
            this.lazyLoading = false;
          }, 750);
          break;  
      }
    });
    setTimeout(() => {
      this.callback.emit(this);
    }, 750);
  }

  updateNotes(type){
    if(type == 'new'){
      this.customerNotes = '';
    }    
    this.customerEditor = this.customerNotes;
    this.notesModalFlag = true;
  }

  changeNotes(event){
    this.notesValid = this.customerEditor == '' ? true : false;  
  }

  saveNotes(){
    if(!this.notesValid){
      const apiFormData = new FormData();  
      apiFormData.append('apikey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('shopId', this.customerId.toString());
      apiFormData.append('contentTypeId', '');
      apiFormData.append('customerNotes', this.customerEditor);
      
      this.commonApi.getCustomerNotesSave(apiFormData).subscribe((response) => {

        if (response.status == "Success") {
          this.customerNotesFlag = true;
          let resultnotes = response.data.customerNotes;
          this.notesUpdatedByName = response.data.notesUpdatedByName;
          let notesUpdatedOn = response.data.notesUpdatedOn;

          let editdate1 = notesUpdatedOn;
          let editdate2 = moment.utc(editdate1).toDate();
          this.notesUpdatedOnDate = moment(editdate2).local().format('MMM DD, YYYY h:mm A');

          this.customerDetail.customerNotes = resultnotes;
          let content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(resultnotes));
          this.customerNotes = content;
          let contentDisplay = content;
          this.contentDisplay = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentDisplay));

        }
        else{

        }

        this.notesModalFlag = false;

      });
      


      

    }
  }

  getMarketingCustomerData() {
    let offset = (this.view == 1) ? this.itemOffset : 0;
    let customerData = {
      domainId: this.domainId,
      offset,
      limit: this.itemLimit,
    };
    this.customerDetail = [];
    this.commonApi.apiGetMarketPlaceCustomerList(customerData).subscribe((response) => {
      let responseData = response.data;
      let resultItems = responseData.marketPlaceUsers;      
      if(this.itemOffset == 0) {
        this.customerListColumns = responseData.columns;        
      }
      this.itemTotal = responseData.totalRecords;
      this.itemEmpty = (this.itemTotal == 0) ? true : false;
      this.displayNoRecords = this.itemEmpty;
      this.displayNoRecordsShow = (this.itemTotal == 0) ? 1 : this.displayNoRecordsShow;
      resultItems.forEach(item => {
        this.customerListData.push(item);            
      });
      setTimeout(() => {
        this.mapValueData = this.customerListData;
      }, 100);
      if(this.itemTotal > 0 && resultItems.length > 0) {
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.itemLength += resultItems.length;
        this.itemOffset += this.itemLimit;
        setTimeout(() => {
          if (!this.displayNoRecords) {         
            let listItemHeight;
            listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
              document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
            if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;             
              this.getMarketingCustomerData();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 1500);
      }
      this.loading = false;
      this.lazyLoading = false;
    });
    setTimeout(() => {
      this.callback.emit(this);
    }, 750);
  }

  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  setupMap(mapData) {
    this.loadAddress = true;
    const address = mapData.address1 + mapData.address2 + ',' + mapData.city + ',' + mapData.state + ',' + mapData.zip;
    this.googleMapInfo = "";
    this.googleMapInfo = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
    this.googleMapInfo = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleMapInfo);
    console.log(this.googleMapInfo)
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
    let rmHeight = (this.pageAccess == 'customers') ? 131 : 71;
    this.innerHeight = this.bodyHeight - (headerHeight + rmHeight);  
    this.mapHeight =  this.innerHeight - 0 + 'px';
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
    this.mapId = '';
    if(action == '') {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 10);
      this.showMap = false;
      this.mapValueData = [];
      this.customerListData.forEach(citem => {
        if(citem.mapFlag) {
          this.mapValueData.push(citem);
        }                     
      });  
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
    console.log('in load map', this.mapValueData, type, mapInfoData)
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
      const lat: any = parseFloat(mapData.lat);
      const lng: any = parseFloat(mapData.lng);
      const geocoder = new google.maps.Geocoder();
      const address = mapData.address1 + mapData.address2 + ',' + mapData.city + ',' + mapData.state + ',' + mapData.zip;
      console.log(address)
      setTimeout( function () {           
          geocoder.geocode( {address}, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) { 
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
                let doorNo = mapData.address1;
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
                        contentString +=  +
                        '<div style="width: 100%;margin-bottom: 15px;">'+
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

  closeBack() {  
    this.mapId = '';
    this.showMap = false;    
    setTimeout(() => {
      this.showMap = true;
      this.renderMap();
    }, 1);
  }

  hideMap() {
    this.mapId = '';
    this.showMap = false;
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

  // Onscroll
  scroll = (event: any): void => {
    if(this.listView && event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
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
          switch (this.pageAccess) {
            case 'customers':
              this.getCustomerData();
              break;
            case 'market-place-quiz':
              this.getMarketingCustomerData();
              break;  
          }
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  viewInfo(item:any = '') { 
    if(item != '') {
      //this.customerDetailView = false;
      this.loading = true;
      this.headTitle = '';
      let id = item.id;
      this.view = 2;
      this.customerId = id;
      this.customerAccess = (id > 0) ? "summary" : "";
      if(this.view == 2) {
        this.getCustomerData();
      }
    } else {
      //this.customerDetailView = false;
      if(this.roFlag) {
        this.roFlag = false;
        this.summaryFlag = true;
        this.callback.emit(this);
      } else {
        this.loading = true;
        setTimeout(() => {
          this.customerId = 0;
          this.customerAccess = "";
          this.headTitle = "Customers";
          this.view = 1;
          this.loading = false;
          this.lazyLoading = false;
          this.callback.emit(this);  
        }, 500);
      }      
      }
  }


  searchView(){
    this.listLoading = true;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.customerListData = [];
    setTimeout(() => {
      this.getCustomerData();
    }, 500);
  }

  onUpload(access, event) {
    this.filesArr = event;
    let file = event.currentFiles[0];
    console.log(event, file)
    let uploadFlag = (event.currentFiles.length > 0) ? true : false;
    if(uploadFlag) {
      let deleteFlag:any = 0;
      let popupFlag = true;
      switch (access) {
        case 'customer':
          popupFlag = this.itemTotal > 0 ? true : false;
          break;
      }
      
      if(popupFlag) {
        let uaccess = access.charAt(0).toUpperCase() + access.slice(1);
        let uploadAccess = `Upload ${uaccess}`;
        let actionInfo = {fileName: file.name};
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = uploadAccess;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
          console.log(receivedService)
          let uploadFileFlag = receivedService.flag;
          modalRef.dismiss('Cross click'); 
          deleteFlag = (receivedService.deleteFlag) ? 1 : 0;
          if(uploadFileFlag) {
            this.importData(access, file, deleteFlag);
          }        
        });
      } else {
        this.importData(access, file, deleteFlag);
      }      
    } else {
      this.successMsg = "Invalid File Format";
      const msgModalRef = this.modalService.open(SuccessModalComponent, this.errModalConfig);
      msgModalRef.componentInstance.successMessage = this.successMsg;
      msgModalRef.componentInstance.statusFlag = false;
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.successMsg = this.uploadTxt;
      }, 3000);
    }
  }

  importData(access, file, deleteFlag) {

  }

  getUserProfileStatus(techList) {
    console.log(techList)
    const apiFormData = new FormData();  
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', techList.techId);
    this.probingApi.GetUserAvailability(apiFormData).subscribe((response) => {
      let resultData = response.items;
      let availability = resultData.availability;
      let availabilityStatusName = resultData.availabilityStatusName;
      let badgeTopUser = resultData.badgeTopUser;
      let index = this.techList.findIndex(option => option.techId == techList.techId);
      this.techList[index].availability = availability; 
      this.techList[index].availStatus = availabilityStatusName; 
      this.techList[index].profileShow = true;     
    });
  }

  // tab on user profile page
  taponprofileclick(userId){
    let url = `profile/${userId}`;
    let navHome = window.open(url, url);
    navHome.focus();
  }
  
  roListPageCallback(data) {
    this.roListPageRef = data;
  }

  editRepairOrderModal(id) {}

  openDetailView(id) {}

}
