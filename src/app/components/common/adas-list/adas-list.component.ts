import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { Constant, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, pageInfo, PageTitleText, RedirectionPage, SolrContentTypeValues, windowHeight } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { NgxMasonryComponent } from "ngx-masonry";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CommonService } from "src/app/services/common/common.service";
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { AdasFilesComponent } from 'src/app/components/common/adas-files/adas-files.component';
import { RedirectHandler } from '@azure/msal-browser/dist/internals';

@Component({
  selector: 'app-adas-list',
  templateUrl: './adas-list.component.html',
  styleUrls: ['./adas-list.component.scss'],
  styles: [
    `.masonry-mfg-item {
        width: 210px !important;
      }
      .masonry-item, .masonry-item-type {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
      .masonry-mfg-item-type {
        width: 301px !important;
      }
      .masonry-year-item {
        width: 120px !important;
      }
      .masonry-year-item-type {
        width: 211px !important;
      }
      .masonry-model-item {
        width: 275px !important;
      }
      .masonry-model-item-type {
        width: 361px !important;
      }
    `,
  ],
})
export class AdasListComponent implements OnInit {
  adasFilesRef: AdasFilesComponent;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() searchValue: any = '';
  @Input() accessFrom: any = pageInfo.adasProcedure;
  @Output() adasCallback: EventEmitter<AdasListComponent> = new EventEmitter();
  @Output() searchResultData: EventEmitter<any> = new EventEmitter();

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass1: string = "parts-list";
  public pageTitleText:string = PageTitleText.AdasProcedure;
  public defaultMfgLogo = "assets/images/common/mfg-default.png";
  public newADASInfo: string = "Get started by tapping on ‘New ADAS’.";
  public contentTypeDefaultNewImg = DefaultNewImages.AdasProcedure;
  public contentTypeDefaultNewText = DefaultNewCreationText.AdasProcedure;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public actionUrl: string = "";
  public wsPage: any = pageInfo.workstreamPage;
  public searchPage: any = pageInfo.searchPage;
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId: any;
  public domainId: any;
  public roleId: any;
  public contentType: any = ContentTypeValues.AdasProcedure;
  public solrType: any = SolrContentTypeValues.AdasProcedure;
  public breadcrumbFlag: boolean = true;
  public thumbView: boolean = true;
  public updateMasonryLayout: boolean = false;
  public parentScrollDisabled: boolean = false;
  public editAccess: boolean = true;
  public deleteAccess: boolean = true;
  public loading: boolean = false;
  public folderView: boolean = true;
  public mfgView: boolean = true;
  public yearView: boolean = false;
  public modelView: boolean = false;
  public fileView: boolean = false;
  public mfgEmpty: boolean = false;
  public yearEmpty: boolean = false;
  public modelEmpty: boolean = false;
  public fileEmpty: boolean = false;
  public fileDeleteFlag: boolean = false;
  public view: number = 1;
  public mfgInfo: any = [];
  public yearInfo: any = [];
  public modelInfo: any = [];

  public mfgItems: any = [];
  public yearItems: any = [];
  public modelItems: any = [];
  public fileItems: any = [];
  
  public bodyHeight: number;
  public innerHeight: number;
  public innerSectionRemove: number = 154;
  public rmHeight: any = 140;
  public rmlHeight: any = 190;
  public rows: number = 20;
  public start: number = 0;
  public itemStart: number = 0;
  public filterItems: any = {};
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean = false;

  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.bodyHeight = window.innerHeight;
    let redirectUrl = RedirectionPage.AdasProcedure;
    let searchFlag =  (this.accessFrom == this.searchPage || (this.searchValue != '' && this.accessFrom == this.wsPage)) ? true : false;
    this.view = (searchFlag) ? 4 : this.view;
    this.breadcrumbFlag = (searchFlag) ? false : this.breadcrumbFlag;
    this.loading = searchFlag;
    this.actionUrl = `${redirectUrl}/manage`;
    this.adasCallback.emit(this);
    this.setScreenHeight();
    this.getAdasItems();
  }

  sectionNav(action, item) {
    console.log(action, item)
    this.loading = true;
    this.innerSectionRemove = 208;
    switch (action) {
      case 'year':
        let mfgInfo = {
          id: parseInt(item.id),
          name: item.name
        }
        this.mfgInfo = mfgInfo;
        this.view = 2;
        break;
      case 'model':
        let yearInfo = {
          id: item.name,
          name: item.name
        }
        this.yearInfo = yearInfo;
        this.view = 3;
        break;
      default:
        let modelInfo = {
          id: item.name,
          name: item.name
        }
        this.modelInfo = modelInfo;
        this.resetFileData();
        this.view = 4;
        break;
    }
    this.getAdasItems();
  }

  // Breadcrumbs
  breadcrumb(action) {
    console.log(action, this.fileDeleteFlag)
    switch(action) {
      case 'mfg':
        this.innerSectionRemove = 162;
        this.view = 1;
        break;
      case 'year':
        this.view = 2;
        break;
      case 'model':
        this.view = 3;
        break;  
    }
    this.setupAdasView(action);
    setTimeout(() => {
      this.adasCallback.emit(this);
    }, 100);
  }

  // Get ADAS Items
  getAdasItems() {
    let type = 'folders';
    let start = this.start;
    let sortFlag = false;
    let searchValue = '';
    let searchFlag = (this.accessFrom == this.searchPage || (this.view == 4 && this.searchValue != '' && this.accessFrom == this.wsPage)) ? true : false;
    switch(this.view) {
      case 1:
        this.filterItems = {
          domainId: this.domainId 
        };
        if(this.accessFrom == pageInfo.workstreamPage) {
          let wsArr = [];
          let landingWorkstream = localStorage.getItem('workstreamItem');
          wsArr.push(landingWorkstream);
          this.filterItems['workstreamId'] = wsArr;
        }
        break;
      case 2:
        this.filterItems = {
          domainId: this.domainId,
          manufacturerIdInt: this.mfgInfo.id
        }        
        break;
      case 3:
        this.filterItems = {
          domainId: this.domainId,
          manufacturerIdInt: this.mfgInfo.id,
          vehicleYear: this.yearInfo.id
        }
        break;    
      case 4:
        type = (searchFlag) ? 'search' : 'list';
        start = this.itemStart;
        searchValue = (searchFlag) ? localStorage.getItem('searchValue') : searchValue;
        searchValue = (searchFlag && this.accessFrom == this.wsPage) ? this.searchValue : searchValue;
        if(searchFlag) {
          let userWorkstreams: any = [];
          if(this.accessFrom == this.wsPage) {
            let landingWorkstream = localStorage.getItem('workstreamItem');
            userWorkstreams.push(landingWorkstream);
            console.log(userWorkstreams)
          } else {
            userWorkstreams = JSON.parse(localStorage.getItem('userWorkstreams'));
          }
          this.filterItems = {
            domainId: this.domainId,
            approvalProcess: ["0", "1"],
            workstreamsIds: userWorkstreams
          }
          let searchPageFilter:any = JSON.parse(localStorage.getItem('searchPageFilter'));
          if(searchPageFilter && this.accessFrom == this.searchPage) {
            Object.keys(searchPageFilter).forEach(key => {
              let filterVal = searchPageFilter[key];
              let filterFlag = false;
              switch(key) {
                case 'make':
                case 'model':
                  filterFlag = (Array.isArray(filterVal) && filterVal.length > 0) ? true : filterFlag;
                  filterFlag = (!Array.isArray(filterVal) && filterVal != '') ? true : filterFlag;
                  if(filterFlag) {
                    this.filterItems[key] = searchPageFilter[key];
                  }
                  break;
              }
            });
          }
        } else {
          this.filterItems = {
            domainId: this.domainId,
            manufacturerIdInt: this.mfgInfo.id,
            vehicleYear: this.yearInfo.id,
            model: this.modelInfo.id
          };
        }
        sortFlag = true;
        break;
    }
    this.setupAdasView();
    let apiData = {
      start,
      rows: this.rows,
      type: this.solrType,
      filters: this.filterItems
    }
    if(searchFlag) {
      apiData['query'] = searchValue;
    }
    if(sortFlag) {
      apiData['sortField'] = "adasIdInt";
      apiData['sortOrder'] = "desc";
    }
    this.commonApi.getSolrAdasList(type, apiData).subscribe((response) => {
      console.log(response)
      let responseItems;
      let resultData = (this.view == 4) ? response.items : response.folders;
      this.itemTotal = response.total;
      switch(this.view) {
        case 1:
          responseItems = resultData.manufacturerStrArr;
          this.mfgItems = responseItems;
          this.fileDeleteFlag = false;
          this.itemEmpty = (responseItems.length == 0) ? true : false;
          this.displayNoRecords = this.itemEmpty;
          this.displayNoRecordsShow = (this.displayNoRecords) ? 2 : this.displayNoRecordsShow;
          if(this.fileDeleteFlag) {
            this.adasFilesRef.fileDeleteFlag = this.fileDeleteFlag;
            setTimeout(() => {
              this.updateLayout();  
            }, 500);
          }
          break;
        case 2:
          responseItems = resultData.vehicleYear;
          this.yearItems = responseItems;
          if(this.fileDeleteFlag) {
            this.fileDeleteFlag = (this.itemTotal > 0) ? false : this.fileDeleteFlag;
            this.adasFilesRef.fileDeleteFlag = this.fileDeleteFlag;
            if(this.itemTotal == 0) {
              this.breadcrumb('mfg');
            }
          }
          break;
        case 3:
          responseItems = resultData.modelStrArr;
          responseItems.forEach(mitem => {
            let mfCount = mitem.facetCount;
            let fileTxt = 'File';
            mitem['files'] = (mfCount > 1) ? `${fileTxt}s` : fileTxt;
          });
          this.modelItems = responseItems;
          if(this.fileDeleteFlag) {
            this.fileDeleteFlag = (this.itemTotal > 0) ? false : this.fileDeleteFlag;
            this.adasFilesRef.fileDeleteFlag = this.fileDeleteFlag;
            if(this.itemTotal == 0) {
              this.breadcrumb('year');
            }
          }
          break;
        case 4:
          this.itemTotal = response.total;
          responseItems = resultData;
          this.itemEmpty = (responseItems.length == 0) ? true : false;
          if(this.itemStart == 0 && searchFlag) {
            let emitInfo = (this.accessFrom == this.searchPage) ? response.facets : response.facets.type;
            this.searchResultData.emit(emitInfo);
          }
          responseItems.forEach(ritem => {
            this.fileItems.push(ritem);
          });
          if(this.itemTotal > 0 && responseItems.length > 0) {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemLength += responseItems.length;
            this.itemStart += this.rows;
          }
          setTimeout(() => {
            let listItemHeight;
            if (this.thumbView) {
              listItemHeight = (document.getElementsByClassName("parts-grid-row")[0]) ? document.getElementsByClassName("parts-grid-row")[0].clientHeight + 50 : 0;
            } else {
              listItemHeight = (document.getElementsByClassName("adas-file-table")[0]) ? document.getElementsByClassName("adas-file-table")[0].clientHeight + 50 : 0;
            }
            console.log(listItemHeight, this.itemTotal, this.itemLength, this.innerHeight);
            if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getAdasItems();
              this.lastScrollTop = this.scrollTop;
            }
          }, 1500);
          break;
      }
      this.loading = false;
      setTimeout(() => {
        if(this.view == 4 && this.lazyLoading) {
          this.adasFilesRef.itemTotal = this.itemTotal;
          this.adasFilesRef.itemLength = this.itemLength;
          this.adasFilesRef.items = this.fileItems;
          this.adasFilesRef.setupFiles();
          this.lazyLoading = false;
        }
        this.adasCallback.emit(this);
      }, 100);
    });
  }

  setupAdasView(action = '') {
    this.mfgView = false;
    this.yearView = false;
    this.modelView = false;
    this.fileView = false;
    switch(this.view) {
      case 1:
        this.mfgView = true;
        break;
      case 2:
        this.yearView = true;
        break;
      case 3:
        this.modelView = true;
        break;
      case 4:
        this.fileView = true;
        break;
    }
    if(action != '' && this.fileDeleteFlag) {
      this.loading = true;
      setTimeout(() => {
        this.getAdasItems();  
      }, 500);      
    }
  }

  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 500);
  }

  filesCallback(data) {
    this.adasFilesRef = data;
    this.fileDeleteFlag = data.fileDeleteFlag;
    if(this.fileDeleteFlag) {
      this.fileItems = data.items;
      this.itemTotal = data.itemTotal;
      this.itemLength = data.itemLength;
      if(this.itemLength == 0) {
        this.breadcrumb('model');
      }
    }
    if(!this.thumbView) {
      if(this.adasFilesRef.loadDataEvent) {
        this.lazyLoading = true;
        this.getAdasItems();
        setTimeout(() => {
          this.adasFilesRef.loadDataEvent = false;  
        }, 200);        
      }
    }
  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id == 'adasFile') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemStart;
      this.scrollTop = event.target.scrollTop;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (inHeight >= totalHeight && this.itemTotal > this.itemLength && this.scrollCallback) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getAdasItems();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  resetFileData() {
    this.fileItems = [];
    this.itemStart = 0;
    this.itemLength = 0;
    this.itemTotal = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollTop = 0;
    this.itemEmpty = false;
    this.displayNoRecords = false;
    this.displayNoRecordsDefault = false;
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = 0;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = this.accessFrom != "parts" ? 0 : (document.getElementsByClassName("part-list-head")[0]) ? document.getElementsByClassName("part-list-head")[0].clientHeight : 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);
    }
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    this.rmHeight = this.rmHeight + headerHeight1;
  }

}
