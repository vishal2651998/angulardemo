import { Component, ViewChild, HostListener, OnInit, OnDestroy, Input, Output, ElementRef, EventEmitter } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Constant, windowHeight, SolrContentTypeValues, filterNames, RedirectionPage, PageTitleText, PlatFormType, pageInfo, pageTitle, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, IsOpenNewTab } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { CommonService } from "../../../services/common/common.service";
import { PartsService } from "../../../services/parts/parts.service";
import { ApiService } from '../../../services/api/api.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { Table } from "primeng/table";
import { AuthenticationService } from "../../../services/authentication/authentication.service";

@Component({
  selector: "app-parts-list",
  templateUrl: "./parts-list.component.html",
  styleUrls: ["./parts-list.component.scss"],
  styles: [
    `.masonry-item {
        width: 350px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class PartsListComponent implements OnInit, OnDestroy {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() tapfromheader;
  @Input() fromSearchPage;
  @Input() pageDataInfo;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @Output() searchResultData: EventEmitter<any> = new EventEmitter();
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  @Output() accessLevelValue: EventEmitter<any> = new EventEmitter();
  public bodyClass1: string = 'parts-list';
  public redirectionPage='';
  public pageTitleText='';
  public teamSystem = localStorage.getItem("teamSystem");
  public section: number = 1;
  public apiKey: string = Constant.ApiKey;
  public userId;
  public fromSearch = "";
  public filterOptions: any = [];
  public priorityIndexValue='';
  public partIdArrayInfo: any=[];
  public partAPICount: any="0";
  public multipleHtml: string = "Multiple";
  public assetPath: string = "assets/images/";
  public assetPartPath: string = "assets/images/parts/";
  public redirectUrl: string = "parts/view/";
  public partViewUrl: string = "parts/view";
  public partsUrl: string = "parts/manage/";
  public pageInfo: any = pageInfo.partsPage;
  public workstreamPage = pageInfo.workstreamPage;
  public searchPage = pageInfo.searchPage;
  public outputFilterData: boolean = false;
  public platformId;
  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public expandFlag: boolean;
  public accessFrom: string = "";
  public contType: number = 0;

  public tooltipClearFlag: boolean = true;
  public partTooltip: boolean = false;
  public wsTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public partActionPosition: string;
  public customTooltipData: any;

  public partApiCall;
  public partWsApiCall;
  public partType: string = "";
  public publishStatus: string = "";
  public searchValue: string = "";
  public searchParams: string = '';
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public domainId;
  public countryId;
  public apiData: Object;
  public workstreamFilterArr = [];

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
  public partsSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public newPartInfo: string = "Your parts information lives here. Parts information is either automatically parsed from threads or entered here by tapping the button ‘New’.";
  public chevronImg: string = `${this.assetPath}documents/chevron-dark.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;

  partsListColumns: any = [];
  partsList: any = [];
  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";

  public partId: number;
  public partIndex: number;
  public updateMasonryLayout: boolean = false;
  public bodyClass: string = "submit-loader";
  public bodyElem;
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public opacityFlag: boolean = false;
  public filterrecords : boolean = false;
  public rmHeight: any = 140;
  public rmlHeight: any = 190;

  public solrApi: boolean = false;
  public collabticDomain: boolean = false;
  public mssDomain: boolean = false;
  public mahleDomain: boolean = false;
  public CBADomain:boolean = false;
  public navFromWs: boolean = false;
  public partsAPIcall;

  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault: this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loading,
    action: false,
    partsList: this.partsList,
    partsSelectionList: this.partsSelectionList,
    itemOffset: this.itemOffset,
    itemTotal: this.itemTotal,
    searchVal: this.searchValue,
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
  public user: any;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  public roleId;
  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private router: Router,
    private commonApi: CommonService,
    private LandingpagewidgetsAPI: LandingpageService,
    private partsApi: PartsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private location: PlatformLocation,
    public apiUrl: ApiService,
    public baseService: BaseService,
    private authenticationService: AuthenticationService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.location.onPopState (() => {
      this.subscription.unsubscribe();
      if(!document.body.classList.contains(this.bodyClass1)) {
        document.body.classList.add(this.bodyClass1);
      }
      let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.Parts) {
          let scrollPos = localStorage.getItem('wsScrollPos');
          let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
          this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
          this.opacityFlag = true;
          setTimeout(() => {
            localStorage.removeItem('wsScrollPos');
            this.updateMasonryLayout = true;
            setTimeout(() => {
              this.updateMasonryLayout = false;
            }, 50);

            setTimeout(() => {
              let id = (this.thumbView) ? 'partList' : 'matrixTable';
              this.scrollToElem(id);
            }, 1500);
          }, 5);
      }
      if(url[1] == RedirectionPage.Search ) {
        if(this.apiUrl.searchPagePartPageRedirectFlag == "1"){
          this.apiUrl.searchPagePartRedirectFlag = "2";
          localStorage.removeItem('sNavUrl');
          this.subscription.unsubscribe();
          return false;
          /* this.fromSearch = "";
          this.loading = false;
          this.opacityFlag = true;
          this.fromSearch = "";
          this.itemOffset = 0;
          this.apiData['offset'] = this.itemOffset;
          this.apiData["searchKey"] = "";
          this.partsList = [];
          setTimeout(() => {
            this.headerCheck = "unchecked";
            this.headercheckDisplay = "checkbox-hide";
            this.partsSelectionList = [];
            this.responseData["headerCheck"] = this.headerCheck;
            this.responseData["headercheckDisplay"] = this.headercheckDisplay;
            this.responseData["partsSelectionList"] = this.partsSelectionList;
            if(!this.solrApi) {
              this.getPartList();
            } else {
              this.accessFrom = 'parts';
              this.displayNoRecords = false;
              this.subscription.unsubscribe();
              this.pageDataInfo = pageInfo.partsPage;
              this.responseData["recall"] = true;
              setTimeout(() => {
                this.opacityFlag = false;
                this.responseData["recall"] = false;
              }, 500);
            }
            this.commonApi.emitPartLayoutData(this.responseData);
          }, 10);  */
        }
      }
    });

  }

  ngOnInit(): void {
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.user = this.authenticationService.userValue;
    let domainId = localStorage.getItem('domainId');
    this.domainId = domainId;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.checkAccessLevel();
    localStorage.setItem('currentContentType', '11');
    window.addEventListener('scroll', this.scroll, true);
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    console.log(this.bodyHeight);
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;

    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.mahleDomain = (platformId == PlatFormType.MahleForum) ? true : false;
    if((this.domainId == '52' || this.domainId == '97') && platformId == '2' ){
      this.tvsDomain = true;
    }
    this.mssDomain = (this.domainId == '82') ? true : false;
    //this.solrApi = (this.collabticDomain || this.CBADomain || this.tvsDomain) ? true : false;
    this.solrApi = (this.collabticDomain || this.mssDomain || this.tvsDomain) ? true : false;
    if(this.pageDataInfo == pageInfo.workstreamPage) {
      this.rmHeight = 164 + headerHeight1;
    }

    this.partsListColumns = [
      { field: 'partImage', checkbox: true, header: 'Part Image', columnpclass:'w1 header thl-col-1 col-sticky' },
      { field: 'partNo', checkbox: false, header: 'Part Number', columnpclass:'w2 header thl-col-2 col-sticky' },
      { field: 'partName', checkbox: false, header: 'Part Name', columnpclass:'w3 header thl-col-3 col-sticky' },
      { field: 'id', checkbox: false, header: 'Id', columnpclass:'w4 header thl-col-4'},
      { field: 'make', checkbox: false, header: 'Make', columnpclass:'w5 header thl-col-5'},
      { field: 'model', checkbox: false, header: 'Model',columnpclass:'w6 header thl-col-6' },
      { field: 'year', checkbox: false, header: 'Created On',columnpclass:'w7 header thl-col-7' },
      { field: 'createdOn', checkbox: false, header: 'Created On',columnpclass:'w8 header thl-col-8'},
      { field: 'createdBy', checkbox: false, header: 'Created By',columnpclass:'w9 header thl-col-9'},
      { field: 'modifiedOn', checkbox: false, header: 'Modified On',columnpclass:'w10 header thl-col-10'},
      { field: 'modifiedBy', checkbox: false, header: 'Modified By',columnpclass:'w11 header thl-col-11'},
      { field: 'partStatus', checkbox: false, header: 'Status',columnpclass:'w9 header thl-col-12 status-col col-sticky'},
    ];

    setTimeout(() => {
      if(this.fromSearchPage) {
        let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
        this.rmHeight = 150 + headerHeight1;
        if(!this.searchAction){
          this.getPartInfoData(this.fromSearchPage);
          this.searchAction = true;
        }
      }
    }, 1000);

    this.subscription.add(
      (this.partApiCall = this.commonApi.partListDataReceivedSubject.subscribe(
        (partsData) => {
          console.log(partsData);
          console.error("-------236--------", partsData);
          let action = partsData["action"];
          let destroyFlag = partsData["destroyFlag"];
          if(destroyFlag) {
            this.ngOnDestroy();
            return false;
          }
          let tapCount = partsData['tapCount'];
          this.contType = partsData['contentTypeId'];
          console.log(this.contType)
          if (this.partsAPIcall) {
            this.partsAPIcall.unsubscribe();
          }
          this.priorityIndexValue = "1";
          this.partIdArrayInfo=[];
          this.partAPICount="0";
          let apiFlag = true, storageFlag = false, storageFilter;
          let access = partsData["accessFrom"];
          let filterOptions = partsData['filterOptions'];
          storageFlag = (action == 'filter') ? true : storageFilter;
          switch (access) {
            case 'landing':
              storageFlag = false;
              setTimeout(() => {
                this.scrollTop = 0;
                let id = (this.thumbView) ? 'partList' : 'matrixTable';
                //this.scrollToElem(id);
              }, 500);
              break;
            case 'search':
              storageFilter = filterNames.search;
              apiFlag = false;
              this.pageDataInfo = pageInfo.searchPage;
              let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
              this.rmHeight = 150 + headerHeight1;
              this.searchAction = false;
              if(!this.searchAction){
                apiFlag = true;
                this.searchAction = true;
              }
              break;
            default:
              storageFilter = filterNames.part;
              break;
          }
          if(storageFlag) {
            localStorage.setItem(storageFilter, JSON.stringify(filterOptions));
          }
          if(apiFlag) {
            this.getPartInfoData(partsData);
          }
        }
      ))
    );

    this.subscription.add(
      (this.partWsApiCall =
        this.commonApi.partListWsDataReceivedSubject.subscribe((partsData) => {
          console.log(partsData);
          this.priorityIndexValue = "1";
          this.partIdArrayInfo=[];
          this.partAPICount="0";

          console.error("----252---------");
          let action = partsData["action"];
          if (action == "unsubscribe") {
            //this.partWsApiCall.unsubscribe();
          } else {
            this.loading = true;
            this.contType = partsData['contentTypeId'];
            console.log(this.contType)
            if (this.partsAPIcall) {
              this.partsAPIcall.unsubscribe();
            }
            this.getPartInfoData(partsData);
          }
        }))
    );

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
        this.updateLayout();
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {
        let action = r['action'];
        let access = r['access'];
        let page = r['page'];
        console.log(action)
        switch(action) {
          case 'side-menu':
            if(access == 'Parts' || page == 'parts') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
              this.updateMasonryLayout = true;
              setTimeout(() => {
              this.updateMasonryLayout = false;
              }, 1500);
            }
            break;
          case 'updateLayout':
            this.updateMasonryLayout = true;
            setTimeout(() => {
              this.updateMasonryLayout = false;
            }, 50);
            break;
            default:
              if(this.thumbView) {
                /* this.masonry.reloadItems();
                this.masonry.layout();
                this.opacityFlag = false;
                this.updateMasonryLayout = true;
                setTimeout(() => {
                this.updateMasonryLayout = false;
                }, 1500); */
              }
              break;
        }
        if (this.partsAPIcall) {
          this.partsAPIcall.unsubscribe();
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        console.log(setdata)
        let pushAction = setdata.pushAction;
        let action = setdata.action;
        let access = setdata.access;
        let pageInfo = setdata.pageInfo;
        let limit: any = 1;
        if(access == 'parts' && pushAction == 'load') {
          switch(action) {
            /* case 'silentLoad':
              if(setdata.silentLoadCount > 0) {
                if(!document.body.classList.contains(this.bodyClass1)) {
                  document.body.classList.add(this.bodyClass1);
                }
                let limit = setdata.silentLoadCount;
                let obj = {}, callFromOuter = false;
                this.getPartList(true, limit);
              }
              break;
            case 'silentUpdate':
              this.opacityFlag = true;
              setTimeout(() => {
                let partId = setdata.dataId;
                let dataInfo = setdata.dataInfo;
                let ukaIndex = this.partsList.findIndex(option => option.id === partId);
                let flag: any = false;
                this.setupPartData(action, flag, dataInfo, ukaIndex, ukaIndex);
                let pageDataIndex = pageTitle.findIndex(option => option.slug == this.redirectionPage);
                let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
                localStorage.removeItem(pageDataInfo);
              }, 500);
              return false;
              break; */
            case 'silentDelete':
              console.log(this.partsList)
              let partIndex = this.partsList.findIndex(option => option.id == setdata.partId);
              this.partsList.splice(partIndex, 1);
              this.itemTotal -= 1;
              this.itemLength -= 1;
              /* if(this.thumbView) {
                this.itemTotal -= 1;
                this.itemLength -= 1;
              } else {
                this.getPartList();
              } */

              return false;
              break;
          }
          console.log(setdata, this.pageDataInfo, pageInfo);
          if (this.pageDataInfo == pageInfo) {
            var checkpushtype = setdata.pushType;
            var checkmessageType = setdata.messageType;
            var checkgroups = setdata.groups;
            let partFilter = JSON.parse(
              localStorage.getItem("partFilter")
            );
            console.log(partFilter);
            console.log("message received! ####", r);
            if (
              (checkpushtype == 1 && checkmessageType == 1) ||
              checkpushtype == 24
            ) {
              if (checkgroups) {
                let groupArr = JSON.parse(checkgroups);
                console.log(groupArr);
                if (groupArr) {
                  console.log(partFilter.workstream);
                  let findgroups = 0;

                  if (partFilter.workstream) {
                    let arrworkstm = partFilter.workstream;
                    findgroups = groupArr.filter(x => !arrworkstm.includes(x));
                  }
                  console.log(checkpushtype);
                  if (checkpushtype == 24) {
                    let threadWs = groupArr;
                    let partFilter = this.filterOptions;

                    if (threadWs.length > 0) {
                      let pushFlag = true;
                      let partFilter = JSON.parse(
                        localStorage.getItem("partFilter")
                      );

                      for (let ws of threadWs) {
                        if(partFilter.workstream) {
                          let windex = partFilter.workstream.findIndex(
                            (w) => w == ws
                          );
                          console.log(windex)
                          if (windex == -1) {
                            pushFlag = false;
                            partFilter.workstream.push(ws);
                          }
                        }
                      }

                      let tws = partFilter.workstream;
                      console.log(tws, pushFlag);
                      console.log(JSON.stringify(partFilter));

                      this.outputFilterData = true;
                      console.log(this.outputFilterData);

                      localStorage.setItem(
                        "partFilter",
                        JSON.stringify(partFilter)
                      );
                      console.log(JSON.stringify(partFilter));
                      if(pushFlag) {
                        setTimeout(() => {
                          console.log(pushFlag)
                          this.getPartList(pushFlag, limit);
                        }, 2000);
                      } else {
                        let currUrl = this.router.url.split('/');
                        let navFrom = currUrl[1];
                        if(navFrom == 'parts') {
                          setTimeout(() => {
                            this.filterOutput.emit("push");
                          }, 1500);
                        }
                        this.itemOffset = 0;
                        this.apiData['offset'] = this.itemOffset;
                        this.partsList = [];
                        this.getPartList();
                      }
                    }
                  }

                  if (findgroups != -1) {
                    if (checkpushtype != 24) {
                      this.getPartList(true);
                    }
                  }
                }
              }
            }
          }
        }
      })
    );
  }

  getPartInfoData(partsData) {
    console.log(partsData);
    console.log(this.displayNoRecords);
    this.displayNoRecords = false;
    this.displayNoRecordsDefault = false;
    let action = partsData["action"];
    if (action == "load") {
      this.loading = true;
      return;
    }
    this.userId = partsData['userId'];
    this.domainId = partsData['domainId'];
    this.countryId = partsData['countryId'];
    this.filterrecords = partsData['filterrecords'];

    let platformId = localStorage.getItem('platformId');
    if((this.domainId == '52' || this.domainId == '97') && platformId == '2' ){
      this.tvsDomain = true;
    }

    this.accessFrom = partsData["accessFrom"];
    if (partsData["accessFrom"] == "search") {
      this.fromSearch = "1";
      this.searchLoading = true;
      this.searchnorecordflag = true;
    }
    this.expandFlag = partsData["expandFlag"];
    let fopt: any = partsData["filterOptions"];
    this.filterOptions = fopt;
    console.log(this.filterOptions, fopt, partsData.filterOptions, action);

    this.thumbView = partsData["thumbView"];
    this.headercheckDisplay = partsData["headercheckDisplay"];
    this.headerCheck = partsData["headerCheck"];
    this.responseData["headercheckDisplay"] = this.headercheckDisplay;
    this.responseData["headerCheck"] = this.headerCheck;
    this.responseData["displayNoRecords"] = this.displayNoRecords;
    this.responseData["displayNoRecordsShow"] = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
    this.responseData["displayNoRecordsShow"] = (this.accessFrom == 'landing' && this.apiUrl.searchFromWorkstream) ? 1 : this.responseData["displayNoRecordsShow"];
    this.responseData["displayNoRecordsDefault"] = this.displayNoRecordsDefault;

    switch (this.accessFrom) {
      case "parts":
      case "search":
      case "landing":
        this.section = partsData["section"];
        this.partType = partsData["partType"];
        this.publishStatus = partsData["publishStatus"];
        if (this.accessFrom == "search") {
          this.fromSearch = "1";
        }
        this.searchValue = partsData["searchVal"];
        this.itemEmpty = partsData["itemEmpty"];
        break;

      default:
        break;
    }

    let apiInfo = {
      accessFrom: this.accessFrom,
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      isActive: 1,
      searchKey: this.searchValue,
      fromSearch: this.fromSearch,
      filterOptions: this.filterOptions,
      limit: this.itemLimit,
    };
    this.apiData = apiInfo;
    setTimeout(() => {
      this.setScreenHeight();
    }, 1000);
    switch (action) {
      case "status":
      case "get":
      case "filter":
      case "init":
        this.loading = true;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        setTimeout(() => {
          this.partsList = [];
          // modified date - 14-10-2021 - start
          this.displayNoRecords = this.itemTotal > 0 ? false : true;
          this.displayNoRecordsDefault = this.displayNoRecords;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          this.displayNoRecordsShow = (this.accessFrom == 'landing' && this.apiUrl.searchFromWorkstream) ? 1 : this.displayNoRecordsShow;
          // modified date - 14-10-2021 - end
          if(partsData['accessFrom'] == 'landing' || (localStorage.getItem("searchValue") && this.fromSearch == "1")) {
            if(this.apiUrl.enableAccessLevel){
              setTimeout(() => {
                if(!this.accessLevel.view){
                  this.loading = false;
                  this.displayNoRecords = true;
                  this.searchLoading = false;
                  this.displayNoRecordsShow = 5;
                  return false;
                }
                else{
                  this.getPartList();
                }
              }, 500);
            }
            else{
              this.getPartList();
            }
          }
          else{
            this.getPartList();
          }
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
        if (action == "filter") {
          this.partsSelectionList = [];
          this.responseData.partsSelectionList = this.partsSelectionList;
          this.commonApi.emitPartLayoutData(this.responseData);
        }
        if (action == "status") {
          this.partsSelectionList = [];
          this.responseData.partsSelectionList = this.partsSelectionList;
          this.commonApi.emitPartLayoutData(this.responseData);
        }
        break;
      case "clear":
        this.partsSelectionList = [];
        this.responseData["partsSelectionList"] = this.partsSelectionList;
        this.partsChangeSelection("empty");
        break;
      case "assign":
        this.loading = false;
        this.partsList = partsData["partsList"];
        this.partsSelectionList = [];
        this.responseData["partsSelectionList"] = this.partsSelectionList;
        this.commonApi.emitPartLayoutData(this.responseData);
        break;
      case "api":
        this.loading = true;
        this.commonApi.emitPartLayoutData(this.responseData);
        break;
      case "toggle":
        console.log(this.partsList);
        this.displayNoRecords = this.partsList.length > 0 ? false : true;
        this.displayNoRecordsDefault = this.displayNoRecords;
        this.updateLayout();
        break;
      default:
        this.loading = false;
        this.responseData["loading"] = this.loading;
        this.commonApi.emitPartLayoutData(this.responseData);
        setTimeout(() => {
          if (this.thumbView) {
            console.log("In Thumb view");
            let listItemHeight =
              document.getElementsByClassName("parts-grid-row")[0]
                .clientHeight + 50;
            console.log("Window Height: " + this.innerHeight);
            console.log("List Height");
            if (this.innerHeight >= listItemHeight) {
              console.log("In Lazy loading");
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getPartList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 50);
        break;
    }
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(11, chkType, chkFlag);
      setTimeout(() => {
        let accessLevels = this.authenticationService.checkAccessItems;
        if(accessLevels.length > 0) {
          let reportAccess = accessLevels[0].pageAccess;
          reportAccess.forEach(item => {
            let accessId = parseInt(item.id);
            let roles = item.roles;
            let roleIndex = roles.findIndex(option => option.id == this.roleId);
            let roleAccess = roles[roleIndex].access;
            console.log(accessId, roleAccess)
            switch (accessId) {
              case 1:
                viewAccess = (roleAccess == 1) ? true : false;
                break;
              case 2:
                createAccess = (roleAccess == 1) ? true : false;
                break;
              case 3:
                editAccess = (roleAccess == 1) ? true : false;
                break;
              case 4:
                deleteAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });

        }
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess};

        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        else{
          this.accessLevel = this.accessLevel;
        }
        this.accessLevelValue.emit(this.accessLevel);
        console.log(this.accessLevel)

      }, 500);
  }

  // Get Parts List
  getPartList(push = false, limit:any = '') {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData["partStatus"] = this.section;
    this.apiData["offset"] = this.itemOffset;
    this.apiData["fromSearch"] = this.fromSearch;
    let searchValue = localStorage.getItem("searchValue");
    if (searchValue && this.fromSearch == "1") {
      this.apiData["threadCount"] = this.partAPICount;

      if (this.partIdArrayInfo && this.partIdArrayInfo.length > 0) {

        this.apiData["threadIdArray"] = JSON.stringify(this.partIdArrayInfo);

      }
      if (this.priorityIndexValue) {

        this.apiData["priorityIndex"] =this.priorityIndexValue;
      } else {

        this.apiData["priorityIndex"] ="1";
      }
      this.apiData["searchKey"] = searchValue;
    }
    this.apiData["type"] = this.partType;
    this.apiData["publishStatus"] = this.publishStatus;
    if (push == true) {
      let itemLimit:any = (limit == '') ? 1 : limit;
      this.apiData["limit"] = itemLimit;
      this.apiData["offset"] = 0;
    } else {
      this.apiData["limit"] = this.itemLimit;
      this.apiData["offset"] = this.itemOffset;
    }
    if (this.teamSystem && searchValue) {
      this.apiData["searchKey"] = searchValue;
    }
    let solrUpdate = 0, partListing = 0, listFlag = false;
    console.log(this.pageDataInfo, this.searchPage, this.collabticDomain);
    if (this.pageDataInfo == this.searchPage && (this.collabticDomain || this.mssDomain || this.tvsDomain)) {
      console.log('in 1')
      solrUpdate = 1;
      partListing = 0;
    } else if((this.pageDataInfo == pageInfo.workstreamPage && this.apiUrl.searchFromWorkstream && (this.collabticDomain || this.mssDomain || this.tvsDomain))) {
      console.log('in 2')
      solrUpdate = 1;
      partListing = (this.apiUrl.searchFromWorkstreamValue == '') ? 1 : 0;
      searchValue = this.apiUrl.searchFromWorkstreamValue;
    } else if((this.pageDataInfo == pageInfo.partsPage || (this.pageDataInfo == pageInfo.workstreamPage && !this.apiUrl.searchFromWorkstream)) && this.solrApi && (this.collabticDomain || this.mssDomain || this.tvsDomain)) {
      console.log('in 3')
      listFlag = (this.pageDataInfo == pageInfo.partsPage || this.pageDataInfo == this.searchPage) ? true : false;
      solrUpdate = 1;
      partListing = 1;
    } else {
      console.log('in 4')
      solrUpdate = 0;
      partListing = 0;
      if(this.pageDataInfo == pageInfo.workstreamPage && this.apiUrl.searchFromWorkstream) {
        searchValue = this.apiUrl.searchFromWorkstreamValue;
      } else {
        searchValue = this.searchValue;
        if(this.pageDataInfo == pageInfo.workstreamPage) {
          let wsArr = [];
          let landingWorkstream = localStorage.getItem('workstreamItem');
          console.log(landingWorkstream)
          wsArr.push(landingWorkstream);
          console.log(wsArr)
          this.workstreamFilterArr = wsArr;
          console.log(this.apiData)
        }
      }
      this.apiData["searchKey"] = searchValue;
    }
    console.log(solrUpdate, this.filterOptions, this.apiData);
    if(solrUpdate == 1) {
      let apiCallFlag = true;
      if(this.pageDataInfo == pageInfo.workstreamPage || this.pageDataInfo == this.searchPage) {
        if(this.apiUrl.enableAccessLevel){
          //apiCallFlag = false;
          setTimeout(() => {
            if(!this.accessLevel.view){
              apiCallFlag = false;
              this.rmHeight = 160;
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = false;
              this.displayNoRecordsShow = 5;
              this.loading = false;
              this.lazyLoading = false;
              return false;
            }
          }, 500);
        }
      }
      if(apiCallFlag) {
        this.getSolrParts(searchValue,partListing,push,listFlag);
      }
      return;
    } else {
      let apiData = this.apiData;
      this.partsAPIcall = this.partsApi.getPartsList(apiData).subscribe((response) => {
        console.log(response);
        this.loading = false;
        this.lazyLoading = this.loading;
        this.responseData["loading"] = this.loading;
        this.responseData["itemOffset"] = this.itemOffset;
        this.commonApi.emitPartLayoutData(this.responseData);
        let resultData = response.partsData;
        let newInfoText = response.newInfoText;
        let wsResData = {
          access: 'parts',
          contentTypeId: this.contType
        }
        this.newPartInfo = newInfoText != undefined ? newInfoText : this.newPartInfo;
        this.redirectionPage = RedirectionPage.Parts;
        this.pageTitleText = PageTitleText.Parts;
        this.contentTypeValue = ContentTypeValues.Parts;
        this.contentTypeDefaultNewImg = DefaultNewImages.Parts;
        this.contentTypeDefaultNewText = DefaultNewCreationText.Parts;

        // Search Page - Getting 'No records found' message even if we have records -- start
        switch(response.priorityIndexValue){
          case "1":
            if (response.total>0) {
              this.searchnorecordflag = false;
            }
          break;
          case "2":
            if (response.total>0) {
              this.searchnorecordflag = false;
            }
          break;
          case "3":
            if (response.total>0) {
              this.searchnorecordflag = false;
            }
          break;
          case "4":
            if (response.total>0) {
              this.searchnorecordflag = false;
            }
            else{
              this.searchnorecordflag = false;
            }
          break;
        }
        if (response.priorityIndexValue < "5" && response.priorityIndexValue) {
          if(!this.searchnorecordflag){
            this.searchLoading = false;
          }
        }
        else{
          this.searchLoading = false;
          this.searchnorecordflag = false;
        }

        // Search Page - Getting 'No records found' message even if we have records -- end

        if (response.total == 0 && this.apiData["offset"] == 0 && response.priorityIndexValue == 4) {
          this.itemEmpty = true;
          this.responseData["itemEmpty"] = this.itemEmpty;
          if (this.apiData["searchKey"] != "" || response.total == 0) {
            this.partsList = [];
            this.itemEmpty = false;
            this.displayNoRecords = true;

            if (this.fromSearch == "1") {
              this.partAPICount=response.total;
              let priorityIndexValue = response.priorityIndexValue;
              let threadIdArrayInfo = response.partInfoArray;
              if (threadIdArrayInfo) {
                for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
                  this.partIdArrayInfo.push(threadIdArrayInfo[t1]);
                }
              }

              if (priorityIndexValue < "4" && priorityIndexValue) {
                let limitoffset = this.itemOffset + this.itemLimit;
                if (response.total == 0 || limitoffset >= response.total) {
                  priorityIndexValue = parseInt(priorityIndexValue) + 1;

                  this.priorityIndexValue = priorityIndexValue.toString();
                  this.itemOffset = 0;
                  this.lazyLoading = true;
                  this.getPartList();
                }
              }
            }

            this.responseData["partsList"] = this.partsList;
            this.responseData["itemEmpty"] = this.itemEmpty;
            this.responseData["displayNoRecords"] = this.displayNoRecords;
            this.responseData["displayNoRecordsDefault"] = this.displayNoRecordsDefault;
            let teamSystem = localStorage.getItem("teamSystem");
            let searchValue = localStorage.getItem("searchValue");
            if (teamSystem && !searchValue) {
              this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
              this.contentTypeDefaultNewTextDisabled = false;
            } else {
              this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
              this.displayNoRecordsShow = (this.accessFrom == 'landing' && this.apiUrl.searchFromWorkstream) ? 1 : this.displayNoRecordsShow;
            }

            this.commonApi.emitPartLayoutData(this.responseData);
          } else {
            this.opacityFlag = false;
            this.displayNoRecordsDefault = this.itemTotal > 0 ? false : true;
            this.responseData["displayNoRecords"] = this.displayNoRecords;
            this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
            this.displayNoRecordsShow = (this.accessFrom == 'landing' && this.apiUrl.searchFromWorkstream) ? 1 : this.displayNoRecordsShow;
            this.responseData["displayNoRecordsDefault"] = this.displayNoRecordsDefault;
            this.contentTypeDefaultNewTextDisabled = false;
          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.itemEmpty = false;
          this.itemResponse = resultData;
          this.itemTotal = response.total;
          // modified date - 14-10-2021 - start
          this.displayNoRecords = this.itemTotal > 0 ? false : true;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          this.displayNoRecordsShow = (this.accessFrom == 'landing' && this.itemOffset == 0 && this.itemTotal == 0 && this.apiUrl.searchFromWorkstream) ? 1 : this.displayNoRecordsShow;
          this.displayNoRecordsDefault = this.displayNoRecords;
          // modified date - 14-10-2021 - end
          this.itemLength += resultData.length;
          this.itemOffset += this.itemLimit;

          this.responseData["itemTotal"] = this.itemTotal;
          this.responseData["itemOffset"] = this.itemOffset;
          this.responseData["itemEmpty"] = this.itemEmpty;
          this.responseData["displayNoRecords"] = this.displayNoRecords;

          if (this.partsSelectionList.length > 0) {
            this.headerCheck = "checked";
            this.responseData["headerCheck"] = this.headerCheck;
          }

          if (this.fromSearch == "1") {
            this.partAPICount=response.total;
            let priorityIndexValue = response.priorityIndexValue;
            let threadIdArrayInfo = response.partInfoArray;
            if (threadIdArrayInfo) {
              for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
                this.partIdArrayInfo.push(threadIdArrayInfo[t1]);
              }
            }

            if (priorityIndexValue < "4" && priorityIndexValue) {
              let limitoffset = this.itemOffset + this.itemLimit;
              if (response.total == 0 || limitoffset >= response.total) {
                priorityIndexValue = parseInt(priorityIndexValue) + 1;

                this.priorityIndexValue = priorityIndexValue.toString();
                this.itemOffset = 0;
                this.lazyLoading = true;
                setTimeout(() => {
                  this.searchAction = false;
                }, 1000);
                this.getPartList();
              }
            }
          }
          let loadItems = false;
          let action = 'init';
          let initIndex = -1;
          for (let i in resultData) {
            this.setupPartData(action, push, resultData[i], initIndex, i);
            if (parseInt(i) + 1 + "==" + resultData.length) {
              loadItems = true;
            }
          }

          let timeOut = (push) ? 1500 : 500;
          setTimeout(() => {
            console.log(this.responseData)
            this.commonApi.emitPartLayoutData(this.responseData);
          }, timeOut);

          setTimeout(() => {
            if (!this.displayNoRecords) {
              let listItemHeight;
              if (this.thumbView) {
                listItemHeight = (document.getElementsByClassName("parts-grid-row")[0]) ? document.getElementsByClassName("parts-grid-row")[0].clientHeight + 50 : 0;
              } else {
                listItemHeight = (document.getElementsByClassName("parts-list-table")[0]) ? document.getElementsByClassName("parts-list-table")[0].clientHeight + 50 : 0;
              }
              console.log(
                resultData.length,
                this.partsList.length,
                response.totalList,
                this.innerHeight + "::" + listItemHeight
              );
              if (
                resultData.length > 0 &&
                this.partsList.length != response.totalList &&
                this.innerHeight >= listItemHeight
              ) {
                //this.scrollCallback = false;
                //this.lazyLoading = true;
                //this.getPartList();
                this.lastScrollTop = this.scrollTop;
              } else {
                if(this.accessFrom == 'landing' && !push) {
                  //this.commonApi.emitWorkstreamListData(wsResData);
                }
              }
            }
          }, 1500);
          console.log(this.thumbView)
          if (this.thumbView) {
            console.log(this.partsList)
            setTimeout(() => {
              this.masonry.reloadItems();
              this.masonry.layout();
              this.updateMasonryLayout = true;
              this.opacityFlag = false;
            }, 2000);
          }
          else{
            this.opacityFlag = false;
          }
        }
      });
    }
  }

  // Get Part Lists from Solr
  getSolrParts(searchValue,partListing,push,listFlag,actionFilter= '') {
    let searchparamsjson = '';
    let parseFlag = true;
    if(this.CBADomain){
      let searchParams = '';
      var searchQSVal = localStorage.getItem('searchQSVal') != null && localStorage.getItem('searchQSVal') != undefined ? localStorage.getItem('searchQSVal') : '' ;
      if(searchValue == searchQSVal){
        searchParams = localStorage.getItem('searchparamQSVal') != null && localStorage.getItem('searchparamQSVal') != undefined ? localStorage.getItem('searchparamQSVal') : '' ;
      }
      console.log(searchParams);
      this.searchParams = searchParams;
    }
    if(listFlag) {
      parseFlag = false;
      this.searchParams = this.apiData["filterOptions"];
    }
    if(this.pageDataInfo == this.searchPage) {
      this.searchParams = this.apiData["filterOptions"];
      this.searchParams = (this.searchParams == null || this.searchParams == undefined  || this.searchParams == 'undefined') ? localStorage.getItem(filterNames.search) : this.searchParams;
    }
    console.log(this.apiData)
    if(this.searchParams != ''){
      searchparamsjson =  this.searchParams;
    }
    let FiltersArr={};
    let domainId = localStorage.getItem('domainId');
    FiltersArr["domainId"] = parseInt(domainId);

    console.log(this.pageDataInfo, this.searchPage)
    if(this.pageDataInfo == this.searchPage && (this.collabticDomain || this.mssDomain)) {
      let wsArr = [];
      let landingWorkstream = localStorage.getItem('workstreamItem');
      console.log(landingWorkstream)
      wsArr.push(landingWorkstream);
      console.log(wsArr)
      this.workstreamFilterArr = wsArr;
      FiltersArr["workstreamsIds"] = (partListing == 1) ? this.workstreamFilterArr : wsArr;
      FiltersArr["approvalProcess"] = ["0","1"];
    }
    if(this.pageDataInfo==pageInfo.workstreamPage && (partListing == 1 || this.apiUrl.searchFromWorkstream) && (this.collabticDomain || this.mssDomain || this.tvsDomain)){
      if(this.apiUrl.searchFromWorkstream) {
        FiltersArr["partStatus"] = this.section;
      }
      let wsArr = [];
      let landingWorkstream = localStorage.getItem('workstreamItem');
      console.log(landingWorkstream)
      wsArr.push(landingWorkstream);
      console.log(wsArr)
      this.workstreamFilterArr = wsArr;
      FiltersArr["workstreamsIds"] = (partListing == 1) ? this.workstreamFilterArr : wsArr;
    } else if(this.pageDataInfo==pageInfo.partsPage && partListing==1 && this.solrApi) {
      FiltersArr["partStatus"] = this.section;

      let publishStatus = parseInt(this.publishStatus);
      switch (publishStatus) {
        case 1:
          FiltersArr['status'] = 'CATALOG';
          break;
        case 2:
          FiltersArr['isFromThread'] = 1;
          break;
        case 4:
          FiltersArr['isPublished'] = (this.section == 2) ? publishStatus : 1;
          break;
      }
      console.log(this.pageDataInfo, this.searchPage, pageInfo.partsPage)
      if(!this.navFromWs) {
        let userWorkstreams=localStorage.getItem('userWorkstreams');
        if(userWorkstreams) {
          this.workstreamFilterArr=JSON.parse(userWorkstreams);
        }
      }
      let chkFilter = Object.keys(searchparamsjson);
      let wsFlag = false;
      if(chkFilter.length > 0) {
        console.log(chkFilter)
        chkFilter.forEach(key => {
          if(key == 'workstream') {
            wsFlag = true;
          }
        });
      }
      console.log(listFlag, this.navFromWs, wsFlag)
      if(listFlag && !this.navFromWs && wsFlag) {
        FiltersArr["workstreamsIds"] = (searchparamsjson['workstream'].length == 0) ? this.workstreamFilterArr : searchparamsjson['workstream'];
      } else {
        FiltersArr["workstreamsIds"] = this.workstreamFilterArr;
      }
    }
    if(this.pageDataInfo == this.searchPage) {
      let userWorkstreams=localStorage.getItem('userWorkstreams');
      if(userWorkstreams) {
       // this.workstreamFilterArr=JSON.parse(userWorkstreams);
        FiltersArr["workstreamsIds"] = JSON.parse(userWorkstreams);
      }
    }
    console.log(searchparamsjson)
    if(searchparamsjson && searchparamsjson['make'] && searchparamsjson['make']!='') {
      let makeVal = searchparamsjson['make'];
      if(listFlag) {
        makeVal = (Array.isArray(makeVal) && makeVal.length > 0) ? makeVal[0] : makeVal;
      }
      FiltersArr["make"]= makeVal;
    }
    if(searchparamsjson && searchparamsjson['model'] && searchparamsjson['model']!='') {
      FiltersArr["model"]=searchparamsjson['model'];
    }
    if(searchparamsjson && searchparamsjson['year'] && searchparamsjson['year']!='') {
      FiltersArr["year"]=searchparamsjson['year'];
    }
    if(searchparamsjson && searchparamsjson['currentDtc'] && searchparamsjson['currentDtc']!='') {
      FiltersArr["currentDtc"]=searchparamsjson['currentDtc'];
    }
    if(searchparamsjson && searchparamsjson['errorCode'] && searchparamsjson['errorCode']!='') {
      FiltersArr["currentDtcStrArr"]=searchparamsjson['errorCode'];
    }
    var objData = {};
    let queryVal = (searchparamsjson && searchparamsjson['keyword'] && searchparamsjson['keyword']!='') ? searchparamsjson['keyword'] : searchValue;
    objData["start"] = (push) ? 0 : this.itemOffset;;
    objData["rows"] = (push) ? 1 : this.itemLimit;
    objData["query"] = queryVal;
    if(this.partType == 'pined') {
      let arrayPin=[];
      arrayPin.push(this.userId);
      FiltersArr["pinedUsers"]=arrayPin;

    }
    /* if(push) {
      this.getPartList(push,1);
      return;
    } */
    objData["type"] = SolrContentTypeValues.Parts;
    objData["listing"] = partListing;
    objData["filters"] = FiltersArr;
    console.log(FiltersArr, objData)
    if(partListing && this.itemOffset == 0) {
      let workstreamFilterArr='';
      if(this.workstreamFilterArr) {
        workstreamFilterArr=JSON.stringify(this.workstreamFilterArr)
      } else {
        let userWorkstreams=localStorage.getItem('userWorkstreams');
        if(userWorkstreams) {
          workstreamFilterArr=userWorkstreams;
        }
      }
      let apiDatasocial = new FormData();
      apiDatasocial.append('apiKey', Constant.ApiKey);
      apiDatasocial.append('domainId', this.domainId);
      apiDatasocial.append('workstreamIds', workstreamFilterArr);
      apiDatasocial.append('userId', this.userId);
      apiDatasocial.append('contentTypeId', '6');
      this.baseService.postFormData("forum", "resetWorkstreamContentTypeCount", apiDatasocial).subscribe((response: any) => { })
    }
    let itemOffsetData = this.itemOffset;
    if(partListing != 1 && this.itemOffset == 0) {
      this.updateSearchKeyword(searchValue);
    }
    console.log(objData)
    this.partsAPIcall = this.LandingpagewidgetsAPI.getSolrDataDetail(
      objData
    ).subscribe((response) => {
      let partInfoTotal = response.total;
      this.itemTotal = partInfoTotal;
      let facets = (response.facets) ? response.facets : '';
      let type = (facets.type) ? facets.type : '';
      if(partListing != 1) {
        if(this.fromSearchPage) {
          setTimeout(() => {
            this.searchResultData.emit(facets);
          }, 1500);
        } else {
          this.searchResultData.emit(type);
        }
      }
      if(partInfoTotal == 0) {
        this.loading = false;
        this.displayNoRecordsDefault = false;
        if(this.pageDataInfo == pageInfo.searchPage){
          this.displayNoRecords = true;
          this.displayNoRecordsShow = 1;
          this.searchLoading = false;
        } else if(this.pageDataInfo == pageInfo.workstreamPage) {
          this.displayNoRecordsShow =  (objData["query"]=='') ? 2 : 1;
          this.displayNoRecords = true;
        } else {
          this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 2 : 1;
          this.displayNoRecords = true
        }
        this.loading = false;
        this.lazyLoading = false;
        if(actionFilter!='init' ) {
          this.updateMasonryLayout = true;
        }
      } else {
        this.loading = false;
        this.lazyLoading = false;
        this.displayNoRecords = false;
        this.displayNoRecordsDefault = false;
      }
      let loadItems = false;
      let action = 'init';
      let initIndex = -1;
      let resultData = response.partsData;
      for (let i in resultData) {
        let makeModelsJsonArr = resultData[i].makeModelsJsonArr;
        resultData[i]['workstreams'] = resultData[i].workstreamsJsonArr;
        resultData[i]['makeModels'] = (makeModelsJsonArr) ? resultData[i].makeModelsJsonArr : [];
        resultData[i]['id'] = resultData[i].partId;
        this.setupPartData(action, push, resultData[i], initIndex, i);
        if (parseInt(i) + 1 + "==" + resultData.length) {
          loadItems = true;
        }
      }

      this.itemOffset += this.itemLimit;
      this.lastScrollTop=1;
      this.scrollCallback = true;


      if (!this.displayNoRecords) {
        let listItemHeight;
        if (this.thumbView) {
          listItemHeight = (document.getElementsByClassName("parts-grid-row")[0]) ? document.getElementsByClassName("parts-grid-row")[0].clientHeight + 50 : 0;
        } else {
          listItemHeight = (document.getElementsByClassName("parts-list-table")[0]) ? document.getElementsByClassName("parts-list-table")[0].clientHeight + 50 : 0;
        }
        console.log(
          resultData.length,
          this.partsList.length,
          response.totalList,
          this.innerHeight + "::" + listItemHeight
        );
        if (
          resultData.length > 0 &&
          this.partsList.length != response.totalList &&
          this.innerHeight >= listItemHeight
        ) {
          //this.scrollCallback = false;
          //this.lazyLoading = true;
          //this.getPartList();
          this.lastScrollTop = this.scrollTop;
        }
      }
      this.scrollInit = 1;
      this.itemLength += resultData.length;
      let thumbLoad = false;
      if (this.thumbView) {
        console.log(this.partsList)
        setTimeout(() => {
          /* this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true; */
          this.opacityFlag = false;
        }, 2000);
      } else{
        this.opacityFlag = false;
      }
      this.responseData["loading"] = this.loading;
      this.commonApi.emitPartLayoutData(this.responseData);
    });
  }

  // Setup Part Data
  setupPartData(action, push, dataInfo, index = 0, dataIndex) {
    dataInfo.isDefaultImg =
    dataInfo.isDefaultImg == 1 ? true : false;
    dataInfo.isSelected = false;
    dataInfo.workstream = dataInfo.workstreamsList;
    dataInfo.workstreamList = dataInfo.workstreams;
    let createdDate = moment.utc(dataInfo.createdOn).toDate();
    let localCreatedDate = moment(createdDate).local().format("MMM DD, YYYY h:mm A");
    let updatedDate = moment.utc(dataInfo.updatedOn).toDate();
    let localUpdatedDate = moment(updatedDate).local().format("MMM DD, YYYY h:mm A");
    dataInfo.createdOn = dataInfo.createdOn == "" ? "-" : localCreatedDate;
    dataInfo.modifiedOn = dataInfo.updatedOn == "" ? "-" : localUpdatedDate;
    dataInfo.createdBy = dataInfo.createdBy == "" ? "-" : dataInfo.createdBy;
    dataInfo.modifiedBy = dataInfo.modifiedBy == "" ? "-" : dataInfo.updatedBy;
    dataInfo.checkFlag = false;
    dataInfo.actionFlag = false;
    dataInfo.activeMore = false;
    dataInfo.editAccess =
      dataInfo.editAccess == 1 ? true : false;
    dataInfo.viewAccess =
      dataInfo.viewAccess == 1 ? true : false;

      //if(this.platformId == 1){
        dataInfo.access = this.userId == dataInfo.createdById ? true : false;

      /*}
      else{
        dataInfo.access = this.roleId == '3' ||  this.roleId == '10' || this.userId == dataInfo.createdById ? true : false;

      }*/
      dataInfo.isPublishedFlag = dataInfo.isPublished == 2 ? true : false;

    dataInfo.pinImg =
      dataInfo.pinStatus == 1
        ? "pin-active-red.png"
        : "pin-normal-white.png";
    dataInfo.pinTxt = dataInfo.pinStatus == 1 ? "Unpin" : "Pin";
    //let appType = dataInfo.makeModels;
    //if(appType == "") {
    let appInfo = dataInfo.makeModels;
    if(!this.solrApi) {
      appInfo = dataInfo.makeModels == "" ? dataInfo.makeModels : JSON.parse(dataInfo.makeModels);
    }

    for (let a of appInfo) {
      for (let year in a.year) {
        let y = a.year[year];
        a.year[year] = y == 0 ? "All" : y;
      }
    }
    switch (appInfo.length) {
      case 0:
        dataInfo.make = "-";
        dataInfo.makeList = [];
        dataInfo.model = "-";
        dataInfo.year = "-";
        dataInfo.modelList = [];
        dataInfo.year = "-";
        dataInfo.yearList = [];
        break;
      case 1:
        if (appInfo[0].genericProductName == "All") {
          dataInfo.make = "All Makes";
          dataInfo.makeList = [];
          dataInfo.model = "-";
          dataInfo.year = "-";
          dataInfo.modelList = [];
          dataInfo.year = "-";
          dataInfo.yearList = [];
        } else {
          dataInfo.make = appInfo[0].genericProductName;
          dataInfo.makeList = [];
          dataInfo.model =
            appInfo[0].model.length > 1
              ? this.multipleHtml + " Models"
              : appInfo[0].model[0];
          dataInfo.modelList = appInfo[0].model;
          dataInfo.year =
            appInfo[0].year.length == 0
              ? "-"
              : appInfo[0].year.length > 1
              ? this.multipleHtml + " Years"
              : appInfo[0].year;
          dataInfo.yearList = appInfo[0].year;
        }
        break;
      default:
        dataInfo.make = this.multipleHtml + " Makes";
        dataInfo.makeList = appInfo;
        dataInfo.model = this.multipleHtml + " Models";
        dataInfo.modelList = appInfo;
        dataInfo.year = this.multipleHtml + " Years";
        dataInfo.yearList = appInfo;
        break;
    }
    //}

    let ws = (dataInfo.workstreams) ? dataInfo.workstreams : [];
    let wsTxt = "";
    let sep = ", ";
    let wsLen = ws.length;
    for (let w in ws) {
      sep = parseInt(w) + 1 == wsLen ? "" : sep;
      wsTxt += ws[w].name + sep;
    }

    if (wsLen > 0) {
      dataInfo.workstreamList = ws;
      dataInfo.workstreams =
        wsLen > 1 ? this.multipleHtml : ws[0].name;
    }
    dataInfo.workstreamsLen = wsLen;
    //console.log(push, index, dataInfo)
    if (push && index < 0) {
      this.partsList.unshift(dataInfo);
    } else {
      this.partsList.push(dataInfo);
    }
    this.responseData["partsList"] = this.partsList;
  }

  // Pin Action
  socialAction(index, status) {
    this.tooltipClearFlag = false;
    this.pinImg = "";
    this.pinTxt = "Pin";
    let actionStatus = "";
    let pinCount = this.partsList[index]["pinCount"];
    actionStatus = status == 0 ? "pined" : "dispined";
    this.partsList[index]["pinStatus"] = status == 0 ? 1 : 0;
    let pinStatus = this.partsList[index]["pinStatus"];
    this.pinImg =
      pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
    this.partsList[index]["pinCount"] =
      status == 0 ? pinCount + 1 : pinCount - 1;

    this.pinImg =
      this.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
    this.pinTxt = this.pinStatus == 1 ? "Unpin" : "Pin";

    this.partsList[index]["pinImg"] = this.pinImg;
    this.partsList[index]["pinTxt"] = this.pinTxt;

    let threadId = this.partsList[index]["id"];
    let postId = this.partsList[index]["postId"];

    let apiData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      threadId: threadId,
      postId: postId,
      ismain: 1,
      status: actionStatus,
      type: "pin",
    };

    console.log(apiData);
    this.partsApi.likePinAction(apiData).subscribe((response) => {
      if (response.status != "Success") {
        this.partsList[index]["pinStatus"] = status;
        let pinStatus = this.partsList[index]["pinStatus"];
        this.pinImg =
          pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
        this.partsList[index]["pinCount"] =
          status == 0 ? pinCount - 1 : pinCount + 1;

        this.pinImg =
          this.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
        this.pinTxt = this.pinStatus == 1 ? "Unpin" : "Pin";

        this.partsList[index]["pinImg"] = this.pinImg;
        this.partsList[index]["pinTxt"] = this.pinTxt;
      }
      setTimeout(() => {
        this.tooltipClearFlag = true;
      }, 500);
    });
  }

  // View Parts
  viewParts(action, id) {
    let teamSystem = localStorage.getItem("teamSystem");
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' parts') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    if (action == "single") {
      let url = this.redirectUrl + id;
      this.router.navigate([url]);
    }
    if (
      action != "Multiple" &&
      action == "Multiple Makes" &&
      action != "Multiple Models" &&
      action != "Multiple Years"
    ) {
      let url = this.redirectUrl + id;
      this.router.navigate([url]);
    }
  }

  // Custom Action Tooltip Content
  getActionTooltip(action, index, id, event) {
    let timeout = 100;
    switch (action) {
      case "ws":
        setTimeout(() => {
          this.wsTooltip = true;
          this.partIndex = index;
          this.partActionPosition = "bs-popover-right";
          this.positionLeft = event.clientX - 180;
          this.positionTop = event.clientY - 12;
        }, timeout);
        break;
      case "more":
        console.log(123);
        this.pinImg = "";
        this.pinTxt = "Pin";
        this.wsTooltip = false;
        for (let part of this.partsList) {
          part.activeMore = false;
        }
        this.partsList[index].activeMore = true;
        setTimeout(() => {
          this.editAccess = this.partsList[index].editAccess;
          this.partTooltip = true;
          this.partId = id;
          this.partIndex = index;
          this.partActionPosition = "bs-popover-left";
          this.positionLeft = event.clientX - 120;
          this.positionTop = event.clientY - 80;
          this.pinStatus = this.partsList[index].pinStatus;
          this.pinImg =
            this.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
          this.pinTxt = this.pinStatus == 1 ? "Unpin" : "Pin";
        }, timeout);
        break;
    }
  }

  onClickedOutside() {
    if (this.tooltipClearFlag && this.partTooltip) {
      this.partTooltip = false;
      this.positionLeft = 0;
      this.positionTop = 0;
      for (let part of this.partsList) {
        part.activeMore = false;
      }
    }

    if (this.wsTooltip) {
      this.wsTooltip = false;
    }
  }

  navPartAction(action, id, cid, type){
    let url;
    if(this.apiUrl.enableAccessLevel){
      if(this.userId == cid){
        url = `${this.partsUrl}${action}/${id}`;
        localStorage.setItem("partNav", "parts");
        setTimeout(() => {
          this.router.navigate([url]);
        }, 50);
      }
      else{
        this.authenticationService.checkAccess(11,type,true,true);

       setTimeout(() => {
         if(this.authenticationService.checkAccessVal){
          url = `${this.partsUrl}${action}/${id}`;
          localStorage.setItem("partNav", "parts");
         }
         else if(!this.authenticationService.checkAccessVal){
           // no access
         }
         else{
          url = `${this.partsUrl}${action}/${id}`;
          localStorage.setItem("partNav", "parts");
         }
          setTimeout(() => {
            this.router.navigate([url]);
          }, 50);

       }, 550);
      }
      }
      else{
        url = `${this.partsUrl}${action}/${id}`;
        localStorage.setItem("partNav", "parts");
        setTimeout(() => {
          this.router.navigate([url]);
        }, 50);
      }

  }



  // Nav Part Edit or View
  navPart(action, id, cid='') {
    let url;
    switch (action) {
      case "edit":
        this.navPartAction(action, id, cid, 'Edit');
        break;
      case "duplicate":
        this.navPartAction(action, id, cid, 'Create');
        break;
      default:
        url = `${this.partViewUrl}/${id}`;
        this.router.navigate([url]);
        return false;
        break;
    }
  }

  delete(id,cid=''){
  if(this.apiUrl.enableAccessLevel){
    if(this.userId == cid){
      this.deleteAction(id);
    }
    else{
      this.authenticationService.checkAccess(11,'Delete',true,true);

     setTimeout(() => {
       if(this.authenticationService.checkAccessVal){
        this.deleteAction(id);
       }
       else if(!this.authenticationService.checkAccessVal){
         // no access
       }
       else{
        this.deleteAction(id);
       }
     }, 550);
    }
    }
    else{
      this.deleteAction(id);
    }

}


  // Delete Part
  deleteAction(pid) {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      if (receivedService) {
        this.bodyElem.classList.add(this.bodyClass);
        const submitModalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        let apiData = {
          apiKey: this.apiKey,
          domainId: this.domainId,
          countryId: this.countryId,
          userId: this.userId,
          contentType: this.groupId,
          partId: pid,
        };
        this.partsApi.deletePart(apiData).subscribe((response) => {
          submitModalRef.dismiss("Cross click");
          this.bodyElem.classList.remove(this.bodyClass);
          this.successMsg = response.result;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;
          let solrContType:any = SolrContentTypeValues.Parts;
          let apiDatasocial = new FormData();
          apiDatasocial.append('apiKey', Constant.ApiKey);
          apiDatasocial.append('domainId', this.domainId);
          apiDatasocial.append('threadId', pid);
          apiDatasocial.append('userId', this.userId);
          apiDatasocial.append('type', solrContType);
          apiDatasocial.append('action', 'delete');
          this.baseService.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            this.successMsg = "";
            let partIndex = this.partsList.findIndex(option => option.id == pid);
            this.partsList.splice(partIndex, 1);
          }, 5000);
        });
      }
    });
  }

  // Parts Selection
  partsSelection(type, index, id, flag) {
    if (this.partsAPIcall) {
      this.partsAPIcall.unsubscribe();
    }
    let emitFlag = true;
    switch (type) {
      case "single":
        this.partsList[index].checkFlag = flag;
        if (!flag) {
          let rmIndex = this.partsSelectionList.findIndex(
            (option) => option == id
          );
          this.partsSelectionList.splice(rmIndex, 1);
          setTimeout(() => {
            this.headerCheck =
              this.partsSelectionList.length == 0 ? "unchecked" : "checked";
            this.headercheckDisplay =
              this.partsSelectionList.length == 0
                ? "checkbox-hide"
                : this.headercheckDisplay;
          }, 100);
        } else {
          this.partsSelectionList.push(id);
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck =
            this.partsSelectionList.length == this.partsList.length
              ? "all"
              : "checked";
          this.headercheckDisplay =
            this.partsSelectionList.length > 0
              ? "checkbox-show"
              : "checkbox-hide";
        }
        break;
      case "all":
        emitFlag = false;
        this.partsSelectionList = [];
        this.headercheckDisplay = "checkbox-show";
        this.responseData["partsSelectionList"] = this.partsSelectionList;
        this.responseData["headerCheck"] = this.headerCheck;
        if (flag == "checked") {
          if (this.partsList.length > 0) {
            this.headerCheck = "all";
            this.responseData["headerCheck"] = this.headerCheck;
            this.partsChangeSelection(this.headerCheck);
          }
        } else if (flag == "all") {
          this.headerCheck = "unchecked";
          this.headercheckDisplay = "checkbox-hide";
          this.responseData["headerCheck"] = this.headerCheck;
          this.responseData["headercheckDisplay"] = this.headercheckDisplay;
          this.partsChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = "all";
          this.responseData["headerCheck"] = this.headerCheck;
          this.partsChangeSelection(this.headerCheck);
        }
        break;
    }

    if (emitFlag) {
      setTimeout(() => {
        this.responseData["headerCheck"] = this.headerCheck;
        this.responseData["headercheckDisplay"] = this.headercheckDisplay;
        this.responseData["partsSelectionList"] = this.partsSelectionList;
        this.commonApi.emitPartLayoutData(this.responseData);
      }, 150);
    }
  }

  // Parts Selection (Empty, All)
  partsChangeSelection(action) {
    //console.log(action)
    for (let p of this.partsList) {
      if (action != "empty" && action != "unchecked") {
        this.partsSelectionList.push(p.id);
      }
      p.checkFlag = action == "all" ? true : false;
    }

    if (action != "empty") {
      setTimeout(() => {
        this.responseData["partsSelectionList"] = this.partsSelectionList;
        this.commonApi.emitPartLayoutData(this.responseData);
      }, 150);
    }
  }

  // Apply Search
  applySearch(action, val) {
    this.searchValue = val;
    this.apiData["searchKey"] = this.searchValue;
    this.itemLimit = 20;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.itemTotal = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.loading = true;
    this.displayNoRecords = false;

    this.partsList = [];
    this.partsSelectionList = [];
    this.headerCheck = "unchecked";
    this.headercheckDisplay = "checkbox-hide";
    this.responseData["searchVal"] = this.searchValue;
    this.responseData["partsList"] = this.partsList;
    this.responseData["partsSelectionList"] = this.partsSelectionList;
    this.responseData["headerCheck"] = this.headerCheck;
    this.responseData["headercheckDisplay"] = this.headercheckDisplay;
    this.partsChangeSelection("empty");
    this.getPartList();
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = this.accessFrom == "parts" ? 0 : 84;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = this.accessFrom != "parts" ? 0 : (document.getElementsByClassName("part-list-head")[0]) ? document.getElementsByClassName("part-list-head")[0].clientHeight : 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);
    }
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    this.rmHeight = this.rmHeight + headerHeight1;
  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 500);
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    console.log(secElement, this.thumbView, this.scrollTop)
    if(this.thumbView) {
      secElement.scrollTop = this.scrollTop;
    } else {
      this.table.scrollTo({'top': this.scrollTop});
    }
    this.opacityFlag = false;
  }

  backSearchScroll() {
    this.loading = false;
    this.opacityFlag = true;
    this.fromSearch = "";
    this.apiData["searchKey"] = "";
    this.partsList = [];
    let sListData = localStorage.getItem('sListData');
    this.partsList = (sListData == null) ? this.partsList : JSON.parse(sListData);

    console.log(this.partsList);
    let itemOffset = localStorage.getItem('sOffset');
    this.itemOffset = (itemOffset == null) ? this.itemOffset : parseInt(itemOffset);
    this.apiData['offset'] = this.itemOffset;
    console.log(this.itemOffset);
    let scrollPos = localStorage.getItem('sScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
    console.log(this.scrollTop);
    setTimeout(() => {
      this.headerCheck = "unchecked";
      this.headercheckDisplay = "checkbox-hide";
      this.partsSelectionList = [];
      this.responseData["headerCheck"] = this.headerCheck;
      this.responseData["headercheckDisplay"] = this.headercheckDisplay;
      this.responseData["partsSelectionList"] = this.partsSelectionList;
      this.responseData["loading"] = this.loading;
      this.responseData["itemOffset"] = this.itemOffset;
      this.commonApi.emitPartLayoutData(this.responseData);
    }, 100);
    setTimeout(() => {
      localStorage.removeItem('sScrollPos');
      localStorage.removeItem('sOffset');
      localStorage.removeItem('sListData');

      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true;
      setTimeout(() => {
        this.updateMasonryLayout = false;
        let id = (this.thumbView) ? 'partList' : 'matrixTable';
        this.scrollToElem(id);
      }, 1500);

    }, 500);
  }
  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getPartList();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  updateSearchKeyword(keyword) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);
    this.LandingpagewidgetsAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
