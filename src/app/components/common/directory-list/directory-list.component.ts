import { Component, ViewChild, HostListener, OnInit, OnDestroy, Input, Output, ElementRef, EventEmitter } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Constant, windowHeight, RedirectionPage, PageTitleText, pageInfo, pageTitle, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, IsOpenNewTab } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { CommonService } from "../../../services/common/common.service";
import { PartsService } from "../../../services/parts/parts.service";
import { ApiService } from '../../../services/api/api.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { Table } from "primeng/table";

@Component({
  selector: "app-directory-list",
  templateUrl: "./directory-list.component.html",
  styleUrls: ["./directory-list.component.scss"],
  styles: [
    `.masonry-item {
        width: 272px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
})
export class DirectoryListComponent implements OnInit, OnDestroy {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() tapfromheader;
  @Input() fromSearchpage;
  @Input() pageDataInfo;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();

  public bodyClass1: string = "parts-list";
  public bodyClass2: string = "parts";
  public bodyClass3: string = "directory";
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
  public outputFilterData: boolean = false;

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
  public searchVal: string = "";
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public domainId;
  public countryId;
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
  public partsSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public newPartInfo: string = "Your parts information lives here. Parts information is either automatically parsed from threads or entered here by tapping the button ‘New’.";
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number = 0;
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
  public rmHeight: any = 130;
  public rmlHeight: any = 190;
  public rm2Height: any = 190;
  public viewProfileId: string = '';

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

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  constructor(
    private router: Router,
    private commonApi: CommonService,
    private partsApi: PartsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private location: PlatformLocation,
    public apiUrl: ApiService,
    private LandingpagewidgetsAPI: LandingpageService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.location.onPopState (() => {
      if(!document.body.classList.contains(this.bodyClass1)) {
        document.body.classList.add(this.bodyClass1);
      }
      let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.Profile) {
          let scrollPos = localStorage.getItem('pScrollPos');
          let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
          this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
          this.opacityFlag = true;
          setTimeout(() => {
            localStorage.removeItem('pScrollPos');
            localStorage.removeItem('pNavUrl');
            this.updateMasonryLayout = true;
            setTimeout(() => {
              this.updateMasonryLayout = false;
            }, 50);
            setTimeout(() => {
              let id = (this.thumbView) ? 'partList' : 'matrixTable';
              this.scrollToElem(id);
            }, 500);
          }, 5);
      }
    });

  }

  ngOnInit(): void {

    if(!document.body.classList.contains(this.bodyClass1)) {
      document.body.classList.add(this.bodyClass1);
    }
    if(!document.body.classList.contains(this.bodyClass2)) {
      document.body.classList.add(this.bodyClass2);
    }
    window.addEventListener('scroll', this.scroll, true);
    this.setScreenHeight();
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    console.log(this.bodyHeight);
    this.partsListColumns = [
      { field: 'profileInfo', checkbox: true, header: 'Profile Info', columnpclass:'w1 header thl-col-1 col-sticky' },
      { field: 'city', checkbox: false, header: 'City', columnpclass:'w3 header thl-col-2' },
      { field: 'state', checkbox: false, header: 'State', columnpclass:'w4 header thl-col-3' },
      { field: 'phoneNumber', checkbox: false, header: 'Phone Number', columnpclass:'w5 header thl-col-4'},
    ];

    this.subscription.add(
      (this.partApiCall = this.commonApi.directoryListDataReceivedSubject.subscribe(
        (partsData) => {
          console.log(partsData);
          console.error("-------236--------", partsData);
          let action = partsData["action"];
          let tapCount = partsData['tapCount'];
          this.contType = partsData['contentTypeId'];
          console.log(this.contType);
            this.priorityIndexValue = "1";
            this.partIdArrayInfo=[];
            this.partAPICount="0";
            if(partsData["accessFrom"] == "search") {
              this.searchAction = false;
              if(!this.searchAction){
                this.getDirectoryInfoData(partsData);
                this.searchAction = true;
              }
            }
            else{
              this.getDirectoryInfoData(partsData);
            }
            if(partsData["actionRightPanel"] == "1"){
              setTimeout(() => {
                let id = this.viewProfileId;
                let secElement1 = document.getElementById(id);
                let secElementTop1 = secElement1.offsetTop;
                let secElement2 = document.getElementById("partList");
                secElement2.scrollTop = secElementTop1;
              },1000);
            }

        }
      ))
    );

    this.subscription.add(
      (this.partWsApiCall =
        this.commonApi.directoryListWsDataReceivedSubject.subscribe((partsData) => {
          console.log(partsData);
          if(!document.body.classList.contains(this.bodyClass3)) {
            document.body.classList.add(this.bodyClass3);
          }
          console.error("----252---------");
          let action = partsData["action"];
          if (action == "unsubscribe") {
            //this.partWsApiCall.unsubscribe();
          } else {
            this.loading = true;
            this.contType = partsData['contentTypeId'];
            console.log(this.contType);
            this.getDirectoryInfoData(partsData);
            this.setScreenHeight();
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
            if(access == 'Directory' || page == 'directory') {
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
        }
      })
    );

     }

  getDirectoryInfoData(partsData) {
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
    this.responseData["displayNoRecordsDefault"] = this.displayNoRecordsDefault;

    switch (this.accessFrom) {
      case "directory":
      case "search":
      case "landing":
        this.section = partsData["section"];
        this.partType = partsData["partType"];
        this.publishStatus = partsData["publishStatus"];
        if (this.accessFrom == "search") {
          this.fromSearch = "1";
        }
        this.searchVal = partsData["searchVal"];
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
      searchKey: this.searchVal,
      fromSearch: this.fromSearch,
      filterOptions: this.filterOptions,
      limit: this.itemLimit,
    };
    this.apiData = apiInfo;

    switch (action) {
      case "status":
      case "get":
      case "filter":
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
          // modified date - 14-10-2021 - end
          this.getDirectory();
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
              this.getDirectory();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 50);
        break;
    }
  }

  // Get Parts List
  getDirectory(push = false, limit:any = '') {
    this.lastScrollTop = this.scrollTop;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    //apiFormData.append('workStreamId', '1');
    apiFormData.append('filterOptions', JSON.stringify(this.apiData['filterOptions']));

    this.apiData["limit"] = this.itemLimit;
    this.apiData["offset"] = this.itemOffset;
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);

    let searchV = this.searchVal != undefined || this.searchVal != null ? this.searchVal : '';
    this.apiData["searchKey"] = searchV;
    apiFormData.append('searchText', this.apiData["searchKey"]);
    console.log(this.filterOptions, this.apiData);
    let apiData = this.apiData;
    localStorage.setItem('directoryFilter', JSON.stringify(this.apiData['filterOptions']));
    this.LandingpagewidgetsAPI.Getworkstramsusersparticipants(apiFormData).subscribe((response) => {
    //this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.lazyLoading = this.loading;
      this.responseData["loading"] = this.loading;
      this.responseData["itemOffset"] = this.itemOffset;
      this.commonApi.emitPartLayoutData(this.responseData);
      let resultData = response.dataInfo;
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
                this.getDirectory();
              }
            }
          }

          this.responseData["partsList"] = this.partsList;
          this.responseData["itemEmpty"] = this.itemEmpty;
          this.responseData["displayNoRecords"] = this.displayNoRecords;
          this.responseData["displayNoRecordsDefault"] =
            this.displayNoRecordsDefault;
          let teamSystem = localStorage.getItem("teamSystem");
          let searchValue = localStorage.getItem("searchValue");
          if (teamSystem && !searchValue) {
            this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
            this.contentTypeDefaultNewTextDisabled = false;
          } else {
            this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          }

          this.commonApi.emitPartLayoutData(this.responseData);
        } else {
          this.displayNoRecordsDefault = true;
          this.responseData["displayNoRecords"] = this.displayNoRecords;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          this.responseData["displayNoRecordsDefault"] =
            this.displayNoRecordsDefault;
          this.contentTypeDefaultNewTextDisabled = false;
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.itemEmpty = false;
        this.itemResponse = resultData;
        this.itemTotal = parseInt(response.total);
        // modified date - 14-10-2021 - start
        this.displayNoRecords = this.itemTotal > 0 ? false : true;
        this.displayNoRecordsShow = ((this.filterrecords) || (this.apiData["searchKey"] != '')) ? 1 : 2;
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
              this.getDirectory();
            }
          }
        }
        let loadItems = false;
        let action = 'init';
        let initIndex = -1;
        for (let i in resultData) {
          this.setupDirectoryData(action, push, resultData[i], initIndex, i);
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
              response.total,
              this.innerHeight + "::" + listItemHeight
            );
            if (
              resultData.length > 0 &&
              this.partsList.length != response.total &&
              this.innerHeight >= listItemHeight
            ) {

              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getDirectory();
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

  // Setup Part Data
  setupDirectoryData(action, push, dataInfo, index = 0, dataIndex) {
    //console.log(push, index, dataInfo)
    dataInfo.selected = false;
    dataInfo.city = dataInfo.userCity != undefined ? dataInfo.userCity : '';
    dataInfo.state = dataInfo.userState != undefined ? dataInfo.userState : '';
    dataInfo.cityState = '';
    if(dataInfo.city != ''){
      if(dataInfo.state != ''){
        dataInfo.cityState = dataInfo.city+", "+dataInfo.state;
      }
      else{
        dataInfo.cityState = dataInfo.city;
      }
    }
    else{
      dataInfo.cityState = dataInfo.state;
    }
    dataInfo.phoneNumber = dataInfo.phone != undefined ? dataInfo.phone : '';
    this.partsList.push(dataInfo);
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

  viewProfile(id,index){
    let scrollTop:any = this.scrollTop;
    localStorage.setItem('pScrollPos',scrollTop);
    for (let part of this.partsList) {
      part.selected = false;
    }
    this.partsList[index].selected = true;
    this.viewProfileId = id;
    let data ={
      id: id
    }
    this.commonApi.emitDirectoryUserId(data);

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

  // Nav Part Edit or View
  navPart(action, id) {
    let url;
    switch (action) {
      case "edit":
      case "duplicate":
        url = `${this.partsUrl}${action}/${id}`;
        localStorage.setItem("partNav", "parts");
        break;
      default:
        url = `${this.partViewUrl}/${id}`;
        this.router.navigate([url]);
        return false;
        break;
    }
    //console.log(url)
    setTimeout(() => {
      let teamSystem = localStorage.getItem("teamSystem");
      if (teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        // window.open(url, IsOpenNewTab.openNewTab);
        //window.open(url, url);
        this.router.navigate([url]);
      }
      //window.open(url, '_blank');
    }, 50);
  }


  // Apply Search
  applySearch(action, val) {
    this.searchVal = val;
    this.apiData["searchKey"] = this.searchVal;
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
    this.responseData["searchVal"] = this.searchVal;
    this.responseData["partsList"] = this.partsList;
    this.responseData["partsSelectionList"] = this.partsSelectionList;
    this.responseData["headerCheck"] = this.headerCheck;
    this.responseData["headercheckDisplay"] = this.headercheckDisplay;
    this.getDirectory();
  }

  // Set Screen Height
  setScreenHeight() {
    /*let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = this.accessFrom == "parts" ? 0 : 84;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = this.accessFrom != "parts" ? 0 : (document.getElementsByClassName("part-list-head")[0]) ? document.getElementsByClassName("part-list-head")[0].clientHeight : 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);
    }*/


    setTimeout(() => {
      let height1 = this.accessFrom == "directory" ? 0 : 84;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = this.accessFrom != "directory" ? 0 : (document.getElementsByClassName("part-list-head")[0]) ? document.getElementsByClassName("part-list-head")[0].clientHeight : 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+height1);
   }, 1000);

  setTimeout(() => {
    let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    if(this.pageDataInfo == pageInfo.workstreamPage) {
      this.rmHeight = 164;
      this.rmHeight =  this.rmHeight + headerHeight1;
    }
    else{
      this.rmHeight = 130;
      this.rmlHeight = 190;
      this.rm2Height = 190;
      this.rmHeight =  this.rmHeight + headerHeight1 + 6;
      this.rmlHeight = this.rmlHeight + headerHeight1 - (54);
      this.rm2Height = this.rm2Height + headerHeight1;
    }
  }, 1000);

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
  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 80;
      let scrollTop:any = this.scrollTop;
      localStorage.setItem('pScrollPos',scrollTop);
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getDirectory();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    document.body.classList.remove(this.bodyClass3);
  }
}
