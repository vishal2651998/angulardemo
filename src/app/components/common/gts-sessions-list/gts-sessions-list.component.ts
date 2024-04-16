import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { Constant, ContentTypeValues } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { ApiService } from 'src/app/services/api/api.service';
import { GtsService } from "src/app/services/gts/gts.service";
import { ExportPopupComponent } from 'src/app/components/common/export-popup/export-popup.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { RepairOrderListComponent } from 'src/app/components/common/repair-order-list/repair-order-list.component';
import { ProductMatrixService } from 'src/app/services/product-matrix/product-matrix.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from "primeng/table";
import * as moment from 'moment';
declare var $:any;
declare let google: any;


@Component({
  selector: 'app-gts-sessions-list',
  templateUrl: './gts-sessions-list.component.html',
  styleUrls: ['./gts-sessions-list.component.scss']
})
export class GtsSessionsListComponent implements OnInit {
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  @ViewChild('mapRef1', {static: true }) mapElement1: ElementRef;
  roListPageRef: RepairOrderListComponent;
  @Input() pageAccess: string = "";
  @Input() paramFlag: boolean = false;
  @Output() gtsComponentRef: EventEmitter<GtsSessionsListComponent> = new EventEmitter();
  @Output() callback: EventEmitter<GtsSessionsListComponent> = new EventEmitter();  
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass1: string = "parts-list";
  public redirectionPage='';
  public pageTitleText='';
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public roleId;
  public procedureId: '';
  public customerListColumns: any = [];
  public customerListData: any = [];
  public customerDetail: any = [];
  public pTableHeight = '580px';
  public assetPath: string = "assets/images/";
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public bodyElem;
  public bodyClass2: string = "submit-loader";
  public headTitle: string = "GTS Sessions";
  public headImage: string = "assets/images/common/customer-head-icon.png";
  public backImage:string = "assets/images/site/workstream-creation/back.png";
  public access: string = "customers";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
  public countryId;
  public apiData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public listLoading: boolean = false;
  public cscrollHeight: any = 0;
  constructor(
    public gtsListingApi: GtsService,
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public sanitizer: DomSanitizer,
    private probingApi: ProductMatrixService,
  ) { }

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
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

    this.getCustomerData();
  }
  getCustomerData() { 
    let customerData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      userId: this.userId,
      offset:this.itemOffset,
      limit: this.itemLimit,
      procedureId:this.procedureId
    };
    this.customerDetail = [];

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("offset", this.itemOffset);
    apiFormData.append("limit", this.itemLimit);
    apiFormData.append("procedureId", this.procedureId);

    this.gtsListingApi.getGTSLists(apiFormData).subscribe((response) => {
      console.log(response)
      let responseData = response.data;
      let resultItems = responseData.items;
      if(this.itemOffset == 0) {
        this.customerListColumns = responseData.columns;
      }
     
          this.itemTotal = responseData.total;
          this.itemEmpty = (this.itemTotal == 0) ? true : false;
          this.displayNoRecords = this.itemEmpty;
          this.displayNoRecordsShow = (this.itemTotal == 0) ? 1 : this.displayNoRecordsShow;
          resultItems.forEach(item => {
            this.customerListData.push(item);            
          });        
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
                 
      
    });
    setTimeout(() => {
      this.callback.emit(this);
    }, 750);
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
    let rmHeight = (this.pageAccess == 'customers') ? 131 : 71;
    this.innerHeight = this.bodyHeight - (headerHeight + rmHeight);  
    this.cscrollHeight = 184;
  }

  // Onscroll
  scroll = (event: any): void => {
    if( event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
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
          this.getCustomerData();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
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
      /*let index = this.techList.findIndex(option => option.techId == techList.techId);
      this.techList[index].availability = availability; 
      this.techList[index].availStatus = availabilityStatusName; 
      this.techList[index].profileShow = true;   */  
    });
  }

  // tab on user profile page
  taponprofileclick(userId){
    let url = `profile/${userId}`;
    let navHome = window.open(url, url);
    navHome.focus();
  }
  

}

