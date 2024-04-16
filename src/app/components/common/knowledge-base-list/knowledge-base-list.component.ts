import { Component, ViewChild, HostListener, OnInit, Input, ElementRef, Output, EventEmitter } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Constant, RedirectionPage, pageTitle, PageTitleText, pageInfo, ContentTypeValues, windowHeight, DefaultNewImages, DefaultNewCreationText, IsOpenNewTab } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { CommonService } from "../../../services/common/common.service";
import { PartsService } from "../../../services/parts/parts.service";
import { KnowledgeBaseService } from "../../../services/knowledge-base/knowledge-base.service";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-knowledge-base-list',
  templateUrl: './knowledge-base-list.component.html',
  styleUrls: ['./knowledge-base-list.component.scss'],
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
export class KnowledgeBaseListComponent implements OnInit {

  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() tapfromheader;
  @Input() fromSearchpage;
  @Input() pageDataInfo;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @ViewChild("top", { static: false }) top: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  public pageTitleText='';
  public redirectionPage='';
  public teamSystem = localStorage.getItem("teamSystem");
  public section: number = 1;
  public apiKey: string = Constant.ApiKey;
  public userId;
  public fromSearch = "";
  public filterOptions: any = [];
  public multipleHtml: string = "Multiple";
  public assetPath: string = "assets/images/";
  public assetPartPath: string = "assets/images/parts/";
  public assetKBPath: string = "assets/images/knowledge-base/";
  public redirectUrl: string = "knowledge-base/view/";
  public knowledgeBaseViewUrl: string = "knowledge-base/view";
  public knowledgeBaseUrl: string = "knowledge-base/manage/";

  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public expandFlag: boolean;
  public accessFrom: string = "";

  public tooltipClearFlag: boolean = true;
  public partTooltip: boolean = false;
  public wsTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public partActionPosition: string;
  public customTooltipData: any;

  public kbApiCall;
  public kbWsApiCall;
  public kbType: string = "";
  public searchVal: string = "";
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public domainId: string = "";
  public countryId;
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;

  public groupId: number;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public itemResponse = [];
  public kbSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public newKBInfo: string = "Get started by tapping on ‘New Knowledge Base’.";
  public chevronImg: string = `${this.assetKBPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public priorityIndexValue='';
  public kbIdArrayInfo: any=[];
  public kbAPICount: any="0";
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;

  public loading: boolean = true;
  public sortLoading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;

  public pageAccess: string = "knowledge-base";
  public kbList: any = [];
  public successFlag: boolean = false;
  public successMsg: string = "";
  public pageInfo: any = pageInfo.knowledgeBasePage;

  public partId: number;
  public partIndex: number;
  public updateMasonryLayout: boolean = false;
  public bodyClass: string = "submit-loader";
  public bodyClass1: string = "parts-list";
  public bodyElem;
  public loadDataEvent: boolean=false;
  public filterrecords : boolean = false;

  public outputFilterData: boolean = false;
  cols: any[];
  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault: this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loading,
    action: false,
    kbList: this.kbList,
    kbSelectionList: this.kbSelectionList,
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
  public pushFlag: boolean = false;
  public sortFieldEvent: string = '';
  public sortorderEvent: number = 0;
  public isSortApplied: boolean = false;

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
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
        this.getKBList();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  constructor(
    private router: Router,
    private commonApi: CommonService,
    private partsApi: PartsService,
    private kbApi: KnowledgeBaseService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private location: PlatformLocation
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.location.onPopState (() => {
      let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.KnowledgeBase) {
        let scrollPos = localStorage.getItem('wsScrollPos');
        let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
        this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
        this.opacityFlag = true;
        setTimeout(() => {
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 50);

          setTimeout(() => {
            let id = (this.thumbView) ? 'partList' : 'file-datatable';
            this.scrollToElem(id);
          }, 500);
        }, 5);
      }
    });
  }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scroll, true); //third parameter

    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyHeight = window.innerHeight;
    if (this.fromSearchpage) {
      this.getKBInfoData(this.fromSearchpage);
    }

    this.cols = [
      { field: 'id', header: 'KB#' , columnpclass:'w1' },
      { field: 'productgroup', header: 'Product Group', columnpclass:'w2' },
      { field: 'subproductgroup', header: 'Sub-Product Group', columnpclass:'w3' },
      { field: 'part', header: 'Part#', columnpclass:'w4'},
      { field: 'problemcategory', header: 'Problem Category', columnpclass:'w5'},
      { field: 'createdOn', header: 'Created On',columnpclass:'w6' },
      { field: 'createdby', header: 'Created By',columnpclass:'w7' },
      { field: 'modifiedon', header: 'Modified On' ,columnpclass:'w8'},
      { field: 'modifiedby', header: 'Modified By' ,columnpclass:'w9'},
      { field: 'status', header: 'Status' ,columnpclass:'w10'},
    ];

     this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        console.error("-----------253-----------");
        this.priorityIndexValue = "1";
        this.kbIdArrayInfo = [];
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        let pushAction = setdata.pushAction;
        let action = setdata.action;
        let access = setdata.access;
        let pageInfo = setdata.pageInfo;
        this.pageDataInfo = (pageInfo != '') ? pageInfo : this.pageDataInfo;
        console.log(setdata);
        if(access == 'knowledge-base' && pushAction == 'load') {
          switch(action) {
            case 'silentLoad':
              if(setdata.silentLoadCount > 0) {
                if(!document.body.classList.contains(this.bodyClass1)) {
                  document.body.classList.add(this.bodyClass1);
                }
                /* this.opacityFlag = false;
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
                setTimeout(() => {
                  this.updateMasonryLayout = false;
                  this.hideFlag = true;
                }, 750); */
                let limit = setdata.silentLoadCount;
                this.getKBList(true, limit);
                return false;
              }
              break;
            case 'silentDelete':
              let kbIndex = this.kbList.findIndex(option => option.id === setdata.kbId);
              this.kbList.splice(kbIndex, 1);
              this.itemTotal -= 1;
              this.itemLength -= 1;
              return false;
              break;
            case 'silentUpdate':
              this.opacityFlag = true;
              setTimeout(() => {
                let kbId = parseInt(setdata.dataId);
                let dataInfo = setdata.dataInfo;
                let ukbIndex = this.kbList.findIndex(option => option.id === kbId);
                let flag: any = false;
                this.setupKBData(action, flag, dataInfo, ukbIndex);
                let pageDataIndex = pageTitle.findIndex(option => option.slug == this.redirectionPage);
                let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
                localStorage.removeItem(pageDataInfo);
              }, 500);
              return false;
              break;
          }
          console.log(setdata, this.pageDataInfo);
          var checkpushtype = setdata.pushType;
          var checkmessageType = setdata.messageType;
          var checkgroups = setdata.groups;
          let fthreadFilter = JSON.parse(localStorage.getItem("knowledgeBaseFilter"));
          console.log(fthreadFilter);
          console.log("message received! ####", r);
          if (this.pageDataInfo == pageInfo) {
            if (
              (checkpushtype == 1 && checkmessageType == 1) ||
              checkpushtype == 28
            ) {
              if (checkgroups) {
                let groupArr = JSON.parse(checkgroups);
                console.log(groupArr);
                if (groupArr) {
                  console.log(fthreadFilter.workstream);
                  let findgroups = 0;

                  if (fthreadFilter.workstream) {
                    let arrworkstm = fthreadFilter.workstream;
                    findgroups = groupArr.filter(x => !arrworkstm.includes(x));
                  }
                  console.log(checkpushtype);
                  if (checkpushtype == 28) {
                    let threadWs = groupArr;
                    let fthreadFilter = this.filterOptions;

                    if (threadWs.length > 0) {
                      let pushFlag = true;
                      let fthreadFilter = JSON.parse(
                        localStorage.getItem("knowledgeBaseFilter")
                      );

                      for (let ws of threadWs) {
                        //if(fthreadFilter.workstream != undefined ){
                          let windex = fthreadFilter.workstream.findIndex(
                            (w) => w == ws
                          );
                          if (windex == -1) {
                            pushFlag = false;
                            fthreadFilter.workstream.push(ws);
                          }
                        //}
                      }
                      let tws = fthreadFilter.workstream;
                      console.log(tws);
                      console.log(JSON.stringify(fthreadFilter));

                      this.outputFilterData = true;
                      console.log(this.outputFilterData);

                      localStorage.setItem(
                        "knowledgeBaseFilter",
                        JSON.stringify(fthreadFilter)
                      );
                      /* setTimeout(() => {
                        console.log(2);
                        this.filterOutput.emit("push");
                      }, 1500);
                      //   this.threadListArray = [];
                      setTimeout(() => {
                        this.getKBList(true);
                      }, 2000); */
                      if(pushFlag) {
                        setTimeout(() => {
                          console.log(pushFlag)
                          this.getKBList(pushFlag);
                        }, 2000);
                      } else {
                        let currUrl = this.router.url.split('/');
                        let navFrom = currUrl[1];
                        if(navFrom == 'knowledge-base') {
                          setTimeout(() => {
                            this.filterOutput.emit("push");
                          }, 1500);
                        }
                        this.itemOffset = 0;
                        this.apiData['offset'] = this.itemOffset;
                        this.kbList = [];
                        //this.apiData = apiInfo;
                        this.getKBList();
                      }

                    }
                  }

                  if (findgroups != -1) {
                    if (checkpushtype != 28) {
                      this.getKBList(true);
                    }
                  }
                }
              }
            }
          }
        }
      })
    );

    this.subscription.add(
      (this.kbApiCall = this.commonApi.knowledgeBaseListDataReceivedSubject.subscribe(
        (knowledgeBaseData) => {
          console.log(knowledgeBaseData)
          this.priorityIndexValue = "1";
          this.kbIdArrayInfo=[];
          this.kbAPICount="0";
          console.log(knowledgeBaseData);
          console.error("-------236--------", knowledgeBaseData);
          let action = knowledgeBaseData["action"];
          this.getKBInfoData(knowledgeBaseData);
          setTimeout(() => {
            this.accessFrom = knowledgeBaseData["accessFrom"];
            if (this.accessFrom == "landing") {
              this.loading = true;
              //this.kbApiCall.unsubscribe();
            }
          }, 100);
        }
      ))
    );

    this.subscription.add(
      (this.kbWsApiCall =
        this.commonApi.knowledgeBaseListWsDataReceivedSubject.subscribe((knowledgeBaseData) => {
          console.log(knowledgeBaseData);
          this.priorityIndexValue = "1";
          this.kbIdArrayInfo=[];
          this.kbAPICount="0";
          console.error("----252---------");
          let action = knowledgeBaseData["action"];
          if (action == "unsubscribe") {
            //this.kbWsApiCall.unsubscribe();
          } else {
            this.loading = true;
            this.getKBInfoData(knowledgeBaseData);
          }
        }))
    );

    this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
      this.updateLayout();
      console.error("---------265--------");
    });

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {
        let action = r['action'];
        let access = r['access'];
        let page = r['page'];
        console.log(action)
        switch(action) {
          case 'side-menu':
            if(access == 'Knowledge Base' || page == 'knowledge-base') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 100);
            }
            break;
            case 'updateLayout':
              let scrollPos = localStorage.getItem('wsScrollPos');
              let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
              this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
              this.opacityFlag = true;
              setTimeout(() => {
                localStorage.removeItem('wsScrollPos');
                this.updateMasonryLayout = true;
                setTimeout(() => {
                  this.updateMasonryLayout = false;
                }, 100);

                setTimeout(() => {
                  let id = (this.thumbView) ? 'partList' : 'matrixTable';
                  this.scrollToElem(id);
                }, 500);
              }, 5);
            break;
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        var setdata = JSON.parse(JSON.stringify(r));
        let action = setdata.action;
        switch(action) {
          case 'silentDelete':
            let kbIndex = this.kbList.findIndex(option => option.id === setdata.kbId);
            this.kbList.splice(kbIndex, 1);
            this.itemTotal -= 1;
            this.itemLength -= 1;
            return false;
            break;
        }
      })
    );

    if(this.pageDataInfo == 2) {
      setTimeout(() => {
        this.scrollTop = 0;
        let id = (this.thumbView) ? 'partList' : 'file-datatable';
        this.scrollToElem(id);
      }, 1000);
    }
  }

  getKBInfoData(knowledgeBaseData) {
    console.log(knowledgeBaseData);
    console.log(this.displayNoRecords);
    this.displayNoRecords = false;
    this.displayNoRecordsDefault = false;
    let action = knowledgeBaseData["action"];
    if (action == "load") {
      this.loading = true;
      return;
    }
    this.userId = knowledgeBaseData['userId'];
    this.domainId = knowledgeBaseData['domainId'];
    this.countryId = knowledgeBaseData['countryId'];
    this.filterrecords = knowledgeBaseData['filterrecords'];

    let platformId = localStorage.getItem('platformId');
    if((this.domainId == '52' || this.domainId == '97') && platformId == '2' ){
      this.tvsDomain = true;
    }

    this.accessFrom = knowledgeBaseData["accessFrom"];
    if (knowledgeBaseData["accessFrom"] == "search") {
      this.fromSearch = "1";
      this.searchLoading = true;
      this.searchnorecordflag = true;
    }
    this.expandFlag = knowledgeBaseData["expandFlag"];
    let fopt: any = knowledgeBaseData["filterOptions"];
    this.filterOptions = fopt;
    console.log(this.filterOptions, fopt, knowledgeBaseData.filterOptions, action);

    this.thumbView = knowledgeBaseData["thumbView"];
    this.headercheckDisplay = knowledgeBaseData["headercheckDisplay"];
    this.headerCheck = knowledgeBaseData["headerCheck"];
    this.responseData["headercheckDisplay"] = this.headercheckDisplay;
    this.responseData["headerCheck"] = this.headerCheck;
    this.responseData["displayNoRecords"] = this.displayNoRecords;
    this.responseData["displayNoRecordsShow"] = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
    this.responseData["displayNoRecordsDefault"] = this.displayNoRecordsDefault;

    switch (this.accessFrom) {
      case "knowledge-base":
      case "search":
      case "landing":
        this.section = knowledgeBaseData["section"];
        this.kbType = knowledgeBaseData["kbType"];
        if (this.accessFrom == "search") {
          this.fromSearch = "1";
        }
        this.searchVal = knowledgeBaseData["searchVal"];
        this.itemEmpty = knowledgeBaseData["itemEmpty"];
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
      searchKey: this.searchVal,
      fromSearch: this.fromSearch,
      filterOptions: this.filterOptions,
      limit: this.itemLimit,
    };
    this.apiData = apiInfo;
    this.setScreenHeight();
    switch (action) {
      case "status":
      case "get":
      case "filter":
        this.loading = true;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        setTimeout(() => {
          this.kbList = [];
          // modified date - 14-10-2021 - start
          this.displayNoRecords = this.itemTotal > 0 ? false : true;
          this.displayNoRecordsDefault = this.displayNoRecords;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          // modified date - 14-10-2021 - end
          this.getKBList();
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
          this.kbSelectionList = [];
          this.responseData.kbSelectionList = this.kbSelectionList;
          this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        }
        if (action == "status") {
          this.kbSelectionList = [];
          this.responseData.kbSelectionList = this.kbSelectionList;
          this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        }
        break;
      case "assign":
        this.loading = false;
        this.kbList = knowledgeBaseData["kbList"];
        this.kbSelectionList = [];
        this.responseData["kbSelectionList"] = this.kbSelectionList;
        this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        break;
      case "api":
        this.loading = true;
        this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        break;
      case "toggle":
      case "resize":
        console.log(this.kbList);
        this.displayNoRecords = this.kbList.length > 0 ? false : true;
        this.displayNoRecordsDefault = this.displayNoRecords;
        this.updateLayout();
        break;
      default:
        this.loading = false;
        this.responseData["loading"] = this.loading;
        this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        setTimeout(() => {
          if (this.thumbView && this.itemOffset == 0 && this.itemTotal > this.itemLimit) {
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
              this.getKBList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 50);
        break;
    }
  }

  // Get KBs List
  getKBList(push = false, limit:any = '') {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;

    this.apiData["offset"] = this.itemOffset;
    this.apiData["fromSearch"] = this.fromSearch;
    this.kbType = (this.kbType == undefined || this.kbType == 'undefined') ? '' : this.kbType;
    this.apiData["type"] = this.kbType;
    console.log(this.filterOptions, this.apiData);
    let apiData = this.apiData;
    apiData["filterOptions"] = this.filterOptions;
    let apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData["apiKey"]);
    apiFormData.append('domainId', this.apiData["domainId"]);
    apiFormData.append('countryId', this.apiData["countryId"]);
    apiFormData.append('userId', this.apiData["userId"]);
    apiFormData.append("type", this.apiData["type"]);

    if (push == true) {
      apiFormData.append("limit", '1');
      apiFormData.append("offset", '0');
    }
    else {
      if(this.isSortApplied){
        this.isSortApplied = false;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        this.kbList = [];
        this.apiData["offset"] = this.itemOffset;
        apiFormData.append("offset", this.apiData["offset"]);
        apiFormData.append("limit", this.apiData["limit"]);
      }
      else{
        apiFormData.append("limit", this.apiData["limit"]);
        apiFormData.append("offset", this.apiData["offset"]);
      }
    }

    if (push == true) {
      apiFormData.append("filterOptions", localStorage.getItem("knowledgeBaseFilter"));
      this.filterOptions = localStorage.getItem("knowledgeBaseFilter");
    }
    else{
      apiFormData.append('filterOptions', JSON.stringify(apiData["filterOptions"]));
    }

    this.sortFieldEvent = (this.sortFieldEvent != undefined ) ? this.sortFieldEvent : '';
    let sortorderint:any= (this.sortorderEvent != undefined ) ? this.sortorderEvent : 1;

    apiFormData.append('sortOrderField', this.sortFieldEvent);
    apiFormData.append('sortOrderBy', sortorderint);

    if (localStorage.getItem("searchValue") && this.fromSearch == "1") {
      this.apiData["threadCount"] = this.kbAPICount;
      apiFormData.append('threadCount', this.apiData["threadCount"]);
      if (this.kbIdArrayInfo && this.kbIdArrayInfo.length > 0) {
        this.apiData["threadIdArray"] = JSON.stringify(this.kbIdArrayInfo);
        apiFormData.append('threadIdArray', this.apiData["threadIdArray"]);
      }
      if (this.priorityIndexValue) {
        this.apiData["priorityIndex"] = this.priorityIndexValue;
      } else {
        this.apiData["priorityIndex"] ="1";
      }
      apiFormData.append('priorityIndex', this.apiData["priorityIndex"]);
      this.apiData["searchKey"] = localStorage.getItem("searchValue");
    }

    if(this.teamSystem && localStorage.getItem('searchValue')) {
      this.apiData['searchKey']=localStorage.getItem('searchValue');
    }

    let searchKey = (this.apiData['searchKey'] == null || this.apiData['searchKey'] == 'null') ? '' : this.apiData['searchKey'];
    apiFormData.append('searchKey', searchKey);

    this.kbApi.getKnowledgeBaseList(apiData, apiFormData).subscribe((response) => {
      console.log(response);
      this.loadDataEvent=false;
      this.loading = false;
      this.sortLoading = false;
      this.lazyLoading = this.loading;
      this.responseData["loading"] = this.loading;
      this.responseData["itemOffset"] = this.itemOffset;
      this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
      let resultData = response.kbData;
      let newInfoText = response.newInfoText;
      this.newKBInfo = newInfoText != 'undefined' ? newInfoText : this.newKBInfo;
      this.redirectionPage = RedirectionPage.KnowledgeBase;
      this.pageTitleText = PageTitleText.KnowledgeBase;
      this.contentTypeValue = ContentTypeValues.KnowledgeBase;
      this.contentTypeDefaultNewImg = DefaultNewImages.KnowledgeBase;
      this.contentTypeDefaultNewText = DefaultNewCreationText.KnowledgeBase;

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


      if (response.total == 0 && this.apiData["offset"] == 0 &&
      response.priorityIndexValue == 4) {
        this.itemEmpty = true;
        this.responseData["itemEmpty"] = this.itemEmpty;
        if (this.apiData["searchKey"] != "" || response.total == 0) {
          this.kbList = [];
          this.itemEmpty = false;
          this.displayNoRecords = true;

          if (this.fromSearch == "1") {
            this.kbAPICount=response.total;
            let priorityIndexValue = response.priorityIndexValue;
            let threadIdArrayInfo = response.partInfoArray;
            if (threadIdArrayInfo) {
              for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
                this.kbIdArrayInfo.push(threadIdArrayInfo[t1]);
              }
            }

            if (priorityIndexValue < "4" && priorityIndexValue) {
              let limitoffset = this.itemOffset + this.itemLimit;
              if (response.total == 0 || limitoffset >= response.total) {
                priorityIndexValue = parseInt(priorityIndexValue) + 1;

                this.priorityIndexValue = priorityIndexValue.toString();
                this.itemOffset = 0;
                this.lazyLoading = true;
                this.getKBList();
              }
            }
          }

          this.responseData["kbList"] = this.kbList;
          this.responseData["itemEmpty"] = this.itemEmpty;
          this.responseData["displayNoRecords"] = this.displayNoRecords;
          this.responseData["displayNoRecordsDefault"] =
            this.displayNoRecordsDefault;
          let teamSystem = localStorage.getItem("teamSystem");
          let searchValue = localStorage.getItem("searchValue");
          if (teamSystem && !searchValue) {
            this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
            this.redirectionPage = RedirectionPage.KnowledgeBase;
            this.pageTitleText = PageTitleText.KnowledgeBase;
            this.contentTypeValue = ContentTypeValues.KnowledgeBase;
            this.contentTypeDefaultNewImg = DefaultNewImages.KnowledgeBase;
            this.contentTypeDefaultNewText = DefaultNewCreationText.KnowledgeBase;
            this.contentTypeDefaultNewTextDisabled = false;
          } else {
            this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          }
          this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        } else {
          this.displayNoRecordsDefault = true;
          this.responseData["displayNoRecords"] = this.displayNoRecords;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          this.redirectionPage = RedirectionPage.KnowledgeBase;
          this.pageTitleText = PageTitleText.KnowledgeBase;
          this.contentTypeValue = ContentTypeValues.KnowledgeBase;
          this.contentTypeDefaultNewImg = DefaultNewImages.KnowledgeBase;
          this.contentTypeDefaultNewText = DefaultNewCreationText.KnowledgeBase;
          this.responseData["displayNoRecordsDefault"] =
            this.displayNoRecordsDefault;
          this.contentTypeDefaultNewTextDisabled = false;
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.itemEmpty = false;
        this.itemResponse = resultData.kbData;
        this.itemTotal = response.total;
        // modified date - 14-10-2021 - start
        this.displayNoRecords = this.itemTotal > 0 ? false : true;
        this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
        this.displayNoRecordsDefault = this.displayNoRecords;
        // modified date - 14-10-2021 - end
        this.itemLength += resultData.length;
        this.itemOffset += this.itemLimit;

        this.responseData["itemTotal"] = this.itemTotal;
        this.responseData["itemOffset"] = this.itemOffset;
        this.responseData["itemEmpty"] = this.itemEmpty;
        this.responseData["displayNoRecords"] = this.displayNoRecords;

        if (this.kbSelectionList.length > 0) {
          this.headerCheck = "checked";
          this.responseData["headerCheck"] = this.headerCheck;
        }

        if (this.fromSearch == "1") {
          this.kbAPICount=response.total;
          let priorityIndexValue = response.priorityIndexValue;
          let threadIdArrayInfo = response.partInfoArray;
          if (threadIdArrayInfo) {
            for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
              this.kbIdArrayInfo.push(threadIdArrayInfo[t1]);
            }
          }

          if (priorityIndexValue < "4" && priorityIndexValue) {
            let limitoffset = this.itemOffset + this.itemLimit;
            if (response.total == 0 || limitoffset >= response.total) {
              priorityIndexValue = parseInt(priorityIndexValue) + 1;

              this.priorityIndexValue = priorityIndexValue.toString();
              this.itemOffset = 0;
              this.lazyLoading = true;
              this.getKBList();
            }
          }
        }
        let loadItems = false;
        let action = 'init';
        let initIndex = -1;

        for (let i in resultData) {
          this.setupKBData(action, push, resultData[i], initIndex);
        }

        setTimeout(() => {
          this.commonApi.emitKnowledgeBaseLayoutData(this.responseData);
        }, 500);

        setTimeout(() => {
          if (!this.displayNoRecords) {
            let listItemHeight;
            if (this.thumbView) {
              listItemHeight =
                document.getElementsByClassName("parts-grid-row")[0]
                  .clientHeight + 50;
            } else {
              listItemHeight =
                document.getElementsByClassName("parts-table")[0].clientHeight +
                120;
            }
            console.log(
              resultData.length,
              this.kbList.length,
              response.total,
              this.innerHeight + "::" + listItemHeight
            );
            if (
              resultData.length > 0 &&
              this.kbList.length != response.total &&
              this.innerHeight >= listItemHeight
            ) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getKBList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 2500);

        if (this.thumbView) {
          //alert(this.thumbView);
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateMasonryLayout = true;
          }, 2000);
        }
      }
    });
  }

  // View KBs
  viewKBs(id) {
    let teamSystem = localStorage.getItem("teamSystem");
    let url = this.redirectUrl + id;
    if (teamSystem) {
      window.open(url, IsOpenNewTab.teamOpenNewTab);
    } else {
      window.open(url, url);
    }
  }

  // Setup KB Data
  setupKBData(action, push, dataInfo, index = 0) {
    console.log(dataInfo)
    let obj: any = {};
    dataInfo.isDefaultImg =
    dataInfo.isDefaultImg == 1 ? true : false;
    dataInfo.workstream = dataInfo.workstreamsList;
    dataInfo.workstreamList = dataInfo.workstreamsInfo;
    let createdDate = moment.utc(dataInfo.createdOn).toDate();
    let localCreatedDate = moment(createdDate)
      .local()
      .format("MMM DD, YYYY h:mm A");
    let updatedDate = moment.utc(dataInfo.updatedOn).toDate();
    let localUpdatedDate = moment(updatedDate)
      .local()
      .format("MMM DD, YYYY h:mm A");
    dataInfo.createdOn =
      dataInfo.createdOn == "" ? "-" : localCreatedDate;
    dataInfo.modifiedOn =
      dataInfo.updatedOn == "" ? "-" : localUpdatedDate;
    dataInfo.createdBy =
      dataInfo.createdBy == "" ? "-" : dataInfo.createdBy;
    dataInfo.updatedBy =
    dataInfo.updatedBy == "" ? "-" : dataInfo.updatedBy;
    dataInfo.checkFlag = false;
    dataInfo.actionFlag = false;
    dataInfo.activeMore = false;
    dataInfo.editAccess =
      dataInfo.editAccess == 1 ? true : false;
    dataInfo.viewAccess =
      dataInfo.viewAccess == 1 ? true : false;
    dataInfo.pinImg =
      dataInfo.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
    dataInfo.pinTxt = dataInfo.pinStatus == 1 ? "Unpin" : "Pin";

    let ws = dataInfo.workstreamsInfo;
    console.log(dataInfo, ws)
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
    dataInfo.kbId = dataInfo.id;
    dataInfo.productGroup = dataInfo.productGroup[0].name;
    dataInfo.subProductGroup = dataInfo.subProductGroup[0].name;
    dataInfo.partModel = dataInfo.partModel[0].name;
    dataInfo.problemCategory = dataInfo.problemCategory.length == '' ? '-' : dataInfo.problemCategory[0].name;

    //obj = dataInfo;
    if (push == true && index < 0) {
      let chkIndex = this.kbList.findIndex(
        (option) => option.kbId == dataInfo.kbId
      );
      console.log("chkIndex:"+chkIndex);
      if (chkIndex == -1) {
        this.kbList.unshift((dataInfo));
      }
    }
    else{
      this.kbList.push((dataInfo));
    }
    //this.kbList.push((dataInfo));
    this.responseData["kbList"] = this.kbList;
  }

  // Nav KB Edit or View
  navKB(action, id) {
    let url;
    switch (action) {
      case "edit":
      case "duplicate":
        url = `${this.knowledgeBaseUrl}${action}/${id}`;
        localStorage.setItem("kbNav", "knowledge-base");
        break;
      default:
        url = `${this.knowledgeBaseViewUrl}/${id}`;
        break;
    }
    //console.log(url)
    setTimeout(() => {
      let teamSystem = localStorage.getItem("teamSystem");
      if (teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        // window.open(url, IsOpenNewTab.openNewTab);
        window.open(url, url);
      }
      //window.open(url, '_blank');
    }, 50);
  }

   // Delete Part
   delete(kbId) {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.add(this.bodyClass);
      if (receivedService) {
        const submitModalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        let apiFormData = new FormData();
        apiFormData.append('apiKey', this.apiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('userId', this.userId);
        apiFormData.append("kbId", kbId);
        this.kbApi.deleteKB(apiFormData).subscribe((response) => {
          this.bodyElem.classList.remove(this.bodyClass);
          submitModalRef.dismiss("Cross click");

          this.successMsg = response.result;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;

          let chkIndex = this.kbList.findIndex(
            (option) => option.kbId == kbId
          );
          this.kbList.splice(chkIndex, 1);

          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            this.successMsg = "";
            if(this.kbList.length == 0){
              window.location.reload();
            }
          }, 3000);
        });
      }
    });
  }

  // Delete Part
  socialAction(kbId, status) {
    let actionStatus = "";
    actionStatus = status == 0 ? "pined" : "dispined";
    let chkIndex = this.kbList.findIndex(
      (option) => option.kbId == kbId
    );
    this.kbList[chkIndex]["pinStatus"] = status == 0 ? 1 : 0;
    let pinStatus = this.kbList[chkIndex]["pinStatus"];
    this.kbList[chkIndex]["pinImg"] = (pinStatus == 1) ? "pin-active-red.png" : "pin-normal-white.png";
    this.kbList[chkIndex]["pinTxt"] = pinStatus == 1 ? "Unpin" : "Pin";
    /*this.bodyElem.classList.add(this.bodyClass);
    const submitModalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    ); */
    let apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append("kbId", kbId);
    apiFormData.append("postId", kbId);
    apiFormData.append("ismain", '1');
    apiFormData.append("status", actionStatus);
    apiFormData.append("type", 'pin');
    this.kbApi.socialActionKB(apiFormData).subscribe((response) => {
      console.log(response);
      /*this.bodyElem.classList.remove(this.bodyClass);
      submitModalRef.dismiss("Cross click");
      this.successMsg = response.result;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.modalConfig
      );
      msgModalRef.componentInstance.successMessage = "Successfully updated("+kbId+") the Pin Status";
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        this.successMsg = "";
      }, 3000);*/
    });
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

    this.kbList = [];
    this.kbSelectionList = [];
    this.headerCheck = "unchecked";
    this.headercheckDisplay = "checkbox-hide";
    this.responseData["searchVal"] = this.searchVal;
    this.responseData["kbList"] = this.kbList;
    this.responseData["kbSelectionList"] = this.kbSelectionList;
    this.responseData["headerCheck"] = this.headerCheck;
    this.responseData["headercheckDisplay"] = this.headercheckDisplay;
    this.getKBList();
  }

  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = this.accessFrom == "knowledge-base" ? 0 : 84;
      rmHeight = (this.pageDataInfo == 2) ? rmHeight-36 : rmHeight;
      let headerHeight =
        document.getElementsByClassName("prob-header")[0].clientHeight;
      let titleHeight =
        this.accessFrom == "knowledge-base"
          ? document.getElementsByClassName("part-list-head")[0].clientHeight
          : 0;
      titleHeight = !this.thumbView ? titleHeight - 85 : titleHeight + 5;
      let footerHeight =
        document.getElementsByClassName("footer-content")[0].clientHeight;
      this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 30);
      //this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;
      //this.innerHeight = (this.bodyHeight < 980) ? this.innerHeight-titleHeight : this.innerHeight;
      this.innerHeight = this.innerHeight - titleHeight;
      this.innerHeight = this.innerHeight - rmHeight;
    }
  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 500);
  }



   scroll = (event: any): void => {
    console.log(event);
    console.log(event.target.className);
    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
    {

    let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-10;
      this.scrollTop = event.target.scrollTop-90;

     console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+event.target.scrollHeight);
     if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
     {
      console.log(111444441);
      this.loadDataEvent=true;
      this.lazyLoading = true;
      this.getKBList();
      event.preventDefault;
     }
    }

  };

  customSort(event: LazyLoadEvent) {
    console.log(event.sortField);
    console.log(event.sortOrder);
    this.sortLoading = true;
    this.isSortApplied = true;
    this.sortFieldEvent= '';
    this.sortorderEvent= 0;
    this.sortFieldEvent=event.sortField;
    this.sortorderEvent=event.sortOrder;
    this.loadDataEvent=true;
    this.getKBList();
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    console.log(secElement, this.thumbView, this.scrollTop)
    secElement.scrollTop = this.scrollTop;
    this.opacityFlag = false;
  }

  ngOnDestroy() {

  }
}


