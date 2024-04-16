import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { CommonService } from 'src/app/services/common/common.service';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ApiService } from 'src/app/services/api/api.service';
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import * as ClassicEditor from "src/build/ckeditor";
import { GoogleMap } from '@angular/google-maps';
import * as moment from 'moment';

declare var $:any;
declare let google: any;

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit {
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @ViewChild('mapRef1', {static: true }) mapElement1: ElementRef;
  @Output() auditComponentRef: EventEmitter<AuditListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<AuditListComponent> = new EventEmitter();

  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();

  public bodyClass1: string = "parts-list";
  public redirectionPage='';
  public pageTitleText='';
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public roleId;
  public shopListColumns: any = [];
  public wfListColumns: any = [];
  public contentType: any = 51;

  public assetPath: string = "assets/images/";
  public assetShopPath: string = `${this.assetPath}shop`;
  public assetPartPath: string = `${this.assetPath}parts`;
  public redirectUrl: string = "shop/view/";
  public defShopBanner: string = `${this.assetPath}common/default-shop-banner.png`;

  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public displayModal: boolean = false;
  public manageTitle: string = "";
  public accessFrom: string = "";
  public bodyElem;
  public bodyClass2: string = "submit-loader";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;

  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemResponse = [];

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;

  public dashboardFlag: boolean = false;
  public listFlag: boolean = false;
  public detailFlag: boolean = false;
  public workFlowFlag: boolean = false;
  public auditFormValid: boolean = false;
  public auditFormSubmit: boolean = false;
  public formAction: string = "";
  public actionButton: string = "";
  public view: number = 1;

  public uploadView: boolean = false;
  public manageAction: string = "";
  public postApiData: object;
  public uploadedItems: any = [];
  public mediaUploadItems: any = [];
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};

  public auditLocationData: any = [];
  public auditChartData: object;
  public auditListData: any = [];
  public auditShopListData: any = [];
  public auditInfo: any = [];
  public shopStatusCount: any = [];
  public auditShopDetailData: any = [];
  public auditWorkFlowData: any = [];
  public auditWorkFlowList: any = [];

  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";
  public attachmentAction: string = "view";

  workflowActionForm: FormGroup;

  public showMap: any = false;
  public auditId: number = 0;
  public shopId: number = 0;
  public auditCheckId: number = 0;
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
  public breadcrumbs: any = [
    {id: 1, action: 'landing', name: 'Landing Page', view: 1, visible: true},
    {id: 2, action: 'shop', name: 'Audit', view: 2, visible: false},
    {id: 3, action: 'workflow', name: 'Workflow', view: 3, visible: false},
    {id: 4, action: 'detail', name: 'Shop', view: 4, visible: false}
  ];
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  public tvsDomain: boolean = false;
  public searchAction: boolean = false;
  public Editor = ClassicEditor;
  configCke: any = {
    placeholder: 'Enter notes',
    toolbar: {
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


  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  @HostListener('window:displayAuditData', ['$event'])
  displayService(event: any): void {
    this.viewInfo(event.detail.mapData.shopId);
  }

  constructor(
    private router: Router,
    private location: PlatformLocation,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  get wfa() { return this.workflowActionForm.controls; }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    window.addEventListener('scroll', this.scroll, true);
    this.auditComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.loadScript();
    this.getAuditData();
    this.createForm('workflowAction');
    this.shopListColumns = [
      {field: 'shopId', header: 'Location#', columnpclass:'w1 header thl-col-1 col-sticky'},
      {field: 'shopName', header: 'Location Name', columnpclass: 'w2 header thl-col-2'},
      {field: 'city', header: 'City', columnpclass: 'w3 header thl-col-3'},
      {field: 'state', header: 'State', columnpclass: 'w4 header thl-col-4'},
      {field: 'zone', header: 'Zone', columnpclass: 'w5 header thl-col-5'},
      {field: 'region', header: 'Region', columnpclass: 'w6 header thl-col-6'},
      {field: 'statusName', header: 'Status', columnpclass: 'w7 header thl-col-7'},
      {field: 'auditChecks', header: 'Audit Checks', columnpclass: 'w8 header thl-col-8'},
      {field: 'auditStatus', header: 'Audit Status', columnpclass: 'w9 header thl-col-9'}
    ];
    this.wfListColumns = [
      {field: 'workflowStep', header: 'Steps', columnpclass:'w1 header thl-col-1 wf-step col-sticky'},
      {field: 'workflowName', header: 'Action', columnpclass: 'w2 header thl-col-2 wf-name'},
      {field: 'owner', header: 'Owner', columnpclass: 'w3 header thl-col-3 wf-owner'},
      {field: 'deliverCompany', header: 'Deliver to', columnpclass: 'w4 header thl-col-4 wf-assign'},
      {field: 'statusName', header: 'Status', columnpclass: 'w5 header thl-col-5 wf-status'},
      {field: 'workflowAuditDate', header: 'Action Date', columnpclass: 'w6 header thl-col-6 wf-date'},
      //{field: 'workflowViewDate', header: 'Date Viewed', columnpclass: 'w9 header thl-col-9 wf-date'},
      {field: 'workflowSchedulesDate', header: 'Scheduled Date', columnpclass: 'w7 header thl-col-7 wf-date'},
      {field: 'notes', header: 'Notes & Files', columnpclass: 'w8 header thl-col-8 wf-action'}
    ];
  }

  public loadScript() {
    const node = document.createElement('script');
    node.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  getAuditData(statusId = 0) {
    let auditData = {
      apikey: this.apiKey,
      domainId: this.domainId,
      userId: this.userId,
      view: this.view
    };
    let breadcrumbIndex = this.breadcrumbs.findIndex(option => option.id == this.view);
    switch(this.view) {
      case 2:
        auditData['auditId'] = this.auditId;
        auditData['statusId'] = statusId;
        break;
      case 3:
        auditData['auditId'] = this.auditId;
        auditData['auditShopId'] = this.shopId;
        auditData['auditCheckId'] = this.auditCheckId;
        break;
      case 4:
        auditData['auditId'] = this.auditId;
        auditData['auditShopId'] = this.shopId;
        break;
    }

    this.commonApi.getAuditList(auditData).subscribe((response) => {
      console.log(response)
      let responseData = response.data;
      let resultItems = responseData.items;
      switch(this.view) {
        case 1:
          this.loading = false;
          let dashboard = responseData.dashboard;
          this.auditLocationData = dashboard.locations;
          let auditChartData:any = dashboard.auditChart;
          this.auditChartData = auditChartData;
          this.auditListData = responseData.items;
          this.loadAuditChart(this.auditChartData);
          break;
        case 2:
          this.itemTotal = response.total;
          this.itemEmpty = (this.itemTotal == 0) ? true : false;
          this.displayNoRecords = this.itemEmpty;
          this.displayNoRecordsShow = (this.itemTotal == 0) ? 1 : this.displayNoRecordsShow;
          this.auditShopListData = resultItems;
          this.shopStatusCount = responseData.shopStatusCount;
          this.auditInfo = responseData.auditInfo;
          this.breadcrumbs[breadcrumbIndex].name =  this.auditInfo.auditName;
          this.breadcrumbs[breadcrumbIndex].visible =  true;
          if(this.itemTotal > 0 && resultItems.length > 0) {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemLength += resultItems.length;
            this.itemOffset += this.itemLimit;
          }
          setTimeout(() => {
            if (!this.displayNoRecords) {
              let listItemHeight;
              listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
                document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
              console.log(listItemHeight);
              if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
                this.scrollCallback = false;
                this.lazyLoading = true;
                this.getAuditData();
                this.lastScrollTop = this.scrollTop;
              }
            }
          }, 1500);
          break;
        case 3:
          this.auditWorkFlowData = resultItems[0];
          this.auditWorkFlowList = this.auditWorkFlowData.workflowItems;
          console.log(this.auditWorkFlowList)
          //this.breadcrumbs[breadcrumbIndex].name =  this.auditWorkFlowData.auditCheckName;
          this.breadcrumbs[breadcrumbIndex-1].name =  this.auditWorkFlowData.shopName;
          this.breadcrumbs[breadcrumbIndex-1].visible =  true;
          break;
        case 4:
          this.auditShopDetailData = resultItems[0];
          this.mapValueData = resultItems;
          this.breadcrumbs[breadcrumbIndex].name =  this.auditShopListData[0].shopName;
          this.breadcrumbs[breadcrumbIndex].visible =  true;
          //this.callbackMap('detail');
          break;
      }
      setTimeout(() => {
        this.loading = false;
        this.callback.emit(this);
      }, 1800);
    });
  }

  // Load Audit Chart
  loadAuditChart(auditChartData) {
    console.log(auditChartData)
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
      let gcData = new google.visualization.DataTable();
      gcData.addColumn('string', 'Audit Status');
      gcData.addColumn('number', 'Count');
      gcData.addColumn({type: 'string', role: 'tooltip'});
      let chartOptions = {
        backgroundColor: 'transparent',
        colors: [],
        title: '',
        pieHole: 0.5,
        titleTextStyle: {
          color: "#000",    // any HTML string color ('red', '#cc00cc')
          fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
          fontSize: 14, // 12, 18 whatever you want (don't specify px)
          bold: true,    // true or false
          italic: false   // true of false
        },
        chartArea:{left: 40, width:'80%', height:'80%'},
        legend: {position: 'right', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'center'},
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'value',
        pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
        tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}},
      };
      for (let data of auditChartData) {
        let perValue = data.percentageValue;
        let CntValue = data.count;
        gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
        chartOptions['colors'].push(data.colorCode);
      }
      var chart = new google.visualization.PieChart(document.getElementById('auditDonutChart'));
      chart.draw(gcData, chartOptions);
    });
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.mapHeight =  this.innerHeight - 20 + 'px';
  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
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
          this.getAuditData();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  viewInfo(id, statusId = 0) {
    console.log(this.auditId, id)
    let apiFlag = false;
    switch (this.view) {
      case 1:
        apiFlag = (this.auditId == id) ? false : true;
        this.auditId = id;
        this.view = 2;
        break;
      case 2:
        apiFlag = (this.shopId == id) ? false : true;
        this.shopId = id;
        this.view = 3;
        break;
      case 3:
        apiFlag = (this.auditCheckId == id) ? false : true;
        this.auditCheckId = id;
        this.view = 4;
        break;
    }
    if(apiFlag) {
      this.callback.emit(this);
      this.loading = true;
      this.getAuditData(statusId);
    }
  }

  breadcrumb(action) {
    this.listView = true;
    switch(action) {
      case 'back':
        this.view = this.view - 1;
        this.auditId = (this.view == 1) ? 0 : this.auditId;
        this.shopId = (this.view == 2) ? 0: this.shopId;
        if(this.view == 1) {
          setTimeout(() => {
            this.loadAuditChart(this.auditChartData);
          }, 200);
        }
        break;
      case 'landing':
        return false;
        this.view = 1;
        this.shopId = 0;
        break;
      case 'shop':
        return false;
        this.view = 2;
        break;
      case 'detail':
        return false;
        this.view = 3;
        break;
    }
    this.breadcrumbs.forEach(item => {
      if(item.id > this.view && (this.auditId != item.id && this.shopId != item.id)) {
        item.visible = false;
      }
    });
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
      this.auditShopListData.forEach(citem => {
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

  renderMap() {
    console.log('in render amp')
    window['initMap'] = () => {
      console.log(1)
      this.loadMap();
    };
    this.loadMap();
  }

  loadMap = () => {
    console.log('in load map', this.mapValueData)
    const bounds = new google.maps.LatLngBounds();
    const map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      zoom: 6
    });
    let infowindow = null;
    this.mapValueData.forEach((mapData: any, index: number) => {
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
                      '<span style="font-family: Roboto-Bold;font-size: 24px; font-weight: 500;line-height:normal;color:#fff">'+mapData.shopName+'</span>'+
                    '</div>'+
                    '<div style="width: 100%;margin-bottom: 15px;">'+
                      '<div style="display:inline-block;width: 54px;vertical-align: middle;">'+
                        '<span style="display:block; width: 38px;height: 38px;border-radius: 6px;border:1px solid #ffffff;text-align: center;">'+
                          '<img style="margin:8px 0 0 0;" src="assets/images/shop/map-map.png">'+
                        '</span>'+
                      '</div>'+
                      '<div style="display:inline-block;width: calc(100% - 54px);vertical-align: middle;">'+
                        '<span style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff;">'+doorNo+ ', ' + mapData.city + ', ' + mapData.state + ', ' + mapData.zone+
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
                        '<span style="display:block;width: 100%; font-family: Roboto-Regular;line-height: 20px; font-size: 16px;text-align: left;color:#ffffff;">Audit#: '+mapData.shopId+'</span>'+
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
                    const auditDetails:any = { mapData };
                    (document.getElementById('callInfoFunction') as HTMLInputElement).addEventListener('click', () => {
                      const event3 = new CustomEvent('displayAuditData',  {
                            detail: auditDetails,
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

  displayModel(access, item) {
    this.uploadedItems = [];
    this.mediaUploadItems = [];
    this.displayModal = true;
    this.auditFormSubmit = false;
    this.auditFormValid = false;
    this.uploadView = false;
    this.manageAction = "";
    this.formAction = access;
    this.actionButton = "";
    this.createForm(access, item);
  }

  createForm(access, item: any = '') {
    this.auditFormSubmit = false;
    this.auditFormValid = false;
    switch(access) {
      case 'workflowAction':
        let wfId = (item == '') ? 0 : item.auditWorkflowId;
        let notes = (item == '') ? '' : item.notes;
        let attachmentLength:number = (item == '') ? 0 : item.documents.length;
        let auditworkFlowStatusId = (item == '') ? 1 : item.statusId;
        this.actionButton = (item == '') ? 'Submit' : item.actionType;
        this.actionButton = (auditworkFlowStatusId > 1 && notes != '') ? 'Update' : this.actionButton;
        this.manageTitle = (item == '') ? '' : `Notes & Files - Step:${item.workflowStep} ${item.workflowName}`;
        this.workflowActionForm = this.formBuilder.group({
          auditworkFlowId: [wfId],
          action: ['edit'],
          view: [5],
          notes: [notes, [Validators .required]],
          attachmentLength: [attachmentLength],
          auditworkFlowStatusId: [auditworkFlowStatusId]
        });
        break;
    }
  }

  attachments(items) {
    this.uploadedItems = items;
  }

  attachmentPopup() {
    let val: any = 0;
    let type = 'new';
    switch (this.formAction) {
      case 'workflowAction':
        val = this.wfa.auditworkFlowId.value;
        let wfIndex = this.auditWorkFlowList.findIndex(option => option.auditWorkflowId == val);
        type = (this.auditWorkFlowList[wfIndex].documents.length == 0) ? 'new' : 'edit';
        break;
    }
    let postId = val;
    console.log(this.uploadedItems);
    let fitem = [];
    let mitem = [];
    let obj = {};
    this.postApiData = {
      action: 'new',
      access: 'audit-workflow',
      pageAccess: 'audit-workflow',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: '',
      userId: this.userId,
      dataId: postId,
      threadId: '',
      postId: postId,
      contentType: this.contentType,
      displayOrder: '',
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: [],
      pushData: obj
    };

    if(this.uploadedItems != '') {
      if(this.uploadedItems.items.length>0){
        fitem = this.uploadedItems;
        this.postApiData['uploadedItems'] = this.uploadedItems.items;
        this.postApiData['attachments'] = this.uploadedItems.attachments;
      }
    }
    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.mediaAttachments = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.presetAttchmentItems = mitem;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {
      console.log(receivedService.uploadedItems);
      if(receivedService){
        this.uploadedItems = receivedService.uploadedItems;
        switch (this.formAction) {
          case 'workflowAction':
            let uploadedItemsLength = (Object.keys(this.uploadedItems).length > 0) ? this.uploadedItems.items.length : 0;
            this.workflowActionForm.get('attachmentLength').patchValue(uploadedItemsLength);
            break;
        }
      } else {
        switch (this.formAction) {
          case 'workflowAction':
            let uploadedItemsLength = (Object.keys(this.uploadedItems).length > 0) ? this.uploadedItems.items.length : 0;
            this.workflowActionForm.get('attachmentLength').patchValue(uploadedItemsLength);
            break;
        }
      }
      modalRef.dismiss('Cross click');

    });
  }

  saveAction() {
    if(this.auditFormValid) {
      return;
    }
    this.auditFormSubmit = true;
    let uploadCount:any = 0;
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
      this.uploadedItems.attachments.forEach(item => {
        console.log(item)
        if(item.accessType == 'media') {
          this.mediaUploadItems.push({fileId: item.fileId.toString()});
        } else {
          uploadCount++;
        }
      });
    }
    switch(this.formAction) {
      case 'workflowAction':
        for (const i in this.workflowActionForm.controls) {
          this.workflowActionForm.controls[i].markAsDirty();
          this.workflowActionForm.controls[i].updateValueAndValidity();
        }
        const formObj = this.workflowActionForm.value;
        console.log(formObj)
        if (this.workflowActionForm.valid) {
          let apiData = {
            apikey: this.apiKey,
            domainId: this.domainId,
            userId: this.userId,
            action: formObj.action,
            view: formObj.view,
            notes: formObj.notes,
            auditworkFlowId: formObj.auditworkFlowId,
            auditworkFlowStatusId: formObj.auditworkFlowStatusId,
            mediaCloudAttachments: JSON.stringify(this.mediaUploadItems)
          }
          console.log(apiData)
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            this.manageAction = 'uploading';
            this.postApiData['formApiData'] = apiData;
            this.uploadView = true;
          } else {
            this.apiCallBack(apiData);
          }
        }
        break;
    }
  }

  apiCallBack(apiData) {
    this.uploadView = false;
    switch(this.formAction) {
      case 'workflowAction':
        this.bodyElem.classList.add(this.bodyClass2);
        const modalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        this.commonApi.manageAudit(apiData).subscribe((response) => {
          console.log(response)
          let data = response.data;
          let modifiedData = response.modifiedItems;
          console.log(modifiedData)
          this.setupAuditWorkflow(data);
          setTimeout(() => {
            this.displayModal = false;
            this.formAction = "";
            this.auditFormSubmit = false;
            this.auditFormValid = false;
            this.manageAction = "";
            modalRef.dismiss("Cross click");
            this.bodyElem.classList.remove(this.bodyClass2);
            if(modifiedData) {
              this.setupAuditWorkflow(modifiedData);
            }
          }, 100);
        });
        break;
    }
  }

  setupAuditWorkflow(item) {
    let wfIndex = this.auditWorkFlowList.findIndex(option => option.auditWorkflowId == item.auditWorkflowId);
    if(wfIndex >= 0) {
      this.auditWorkFlowList[wfIndex].workflowAuditDate = item.workflowAuditDate;
      this.auditWorkFlowList[wfIndex].action = item.action;
      this.auditWorkFlowList[wfIndex].actionName = item.actionName;
      this.auditWorkFlowList[wfIndex].notes = item.notes;
      this.auditWorkFlowList[wfIndex].documents = item.documents;
      this.auditWorkFlowList[wfIndex].statusId = item.statusId;
      this.auditWorkFlowList[wfIndex].statusName = item.statusName;
      this.auditWorkFlowList[wfIndex].statusClass = item.statusClass;
      this.auditWorkFlowList[wfIndex].statusColor = item.statusColor;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
