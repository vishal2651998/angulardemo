import { Component, ViewChild, HostListener, OnInit, Input, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { Constant,windowHeight,PageTitleText,RedirectionPage,ContentTypeValues,DefaultNewImages,DefaultNewCreationText,pageInfo,IsOpenNewTab } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { CommonService } from '../../../services/common/common.service';
import { SibService } from '../../../services/sib/sib.service';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subscription } from "rxjs";
import * as moment from 'moment';
import { Table } from "primeng/table";
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-sib-list',
  templateUrl: './sib-list.component.html',
  styleUrls: ['./sib-list.component.scss'],
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
export class SibListComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() tapfromheader;
  @Input() fromSearchpage;
  @Input() pageDataInfo: any = pageInfo.sibPage;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;

  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();

  public bodyClass1: string = "parts-list";
  public redirectionPage='';
  public pageTitleText='';
  public  teamSystem= localStorage.getItem('teamSystem');
  public section: number = 1;
  public apiKey: string = Constant.ApiKey;
  public userId;
  public fromSearch = "";
  public filterOptions: any = [];

  public multipleHtml: string = "Multiple";
  public assetPath: string = "assets/images/";
  public assetPartPath: string = `${this.assetPath}parts/`;
  public assetSibPath: string = `${this.assetPath}sib`;
  public redirectUrl: string = "sib/view/";
  public sibUrl: string = "sib/manage/";
  public defSibBanner: string = `${this.assetPath}common/default-sib-banner.png`;

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
  public sibTooltip: boolean = false;
  public wsTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public sibActionPosition: string;
  public customTooltipData: any;

  public sibApiCall;
  public sibWsApiCall;
  public sibType: string = "";
  public publishStatus: string = "";
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public domainId;
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
  public sibSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = "single";
  public newPartInfo: string = "Get started by tapping on ‘New SIB Cut-off’.";
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public priorityIndexValue='';
  public sibIdArrayInfo: any=[];
  public sibAPICount: any="0";
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public filterrecords : boolean = false;

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;

  sibListColumns: any = [];
  sibList: any = [];
  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";

  public sibId: number;
  public sibIndex: number;
  public updateMasonryLayout: boolean = false;

  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault: this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loading,
    action: false,
    sibList: this.sibList,
    sibSelectionList: this.sibSelectionList,
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
    private location: PlatformLocation,
    private commonApi: CommonService,
    private sibApi: SibService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public apiUrl: ApiService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.location.onPopState (() => {
      let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.SIB) {
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
      }
      if(url[1] == RedirectionPage.Search ) {
        if(this.apiUrl.searchPageRedirectFlag == "1"){
          this.apiUrl.searchPageRedirectFlag = "2";
          localStorage.removeItem('sNavUrl');
          localStorage.removeItem('searchValue');
          this.accessFrom = 'sib';
          this.loading = false;
          this.opacityFlag = true;
          this.fromSearch = "";
          this.itemOffset = 0;
          this.itemLength = 0;
          this.itemTotal = 0;
          this.priorityIndexValue='';
          this.sibIdArrayInfo=[];
          this.sibAPICount="0";
          this.apiData['offset'] = this.itemOffset;
          this.apiData["searchKey"] = "";
          this.apiData['filterOptions'] = "";
          this.displayNoRecordsShow = 0;
          this.displayNoRecords = false;
          this.displayNoRecordsDefault = this.displayNoRecords;
          this.sibList = [];
          setTimeout(() => {
            this.getSibList();
          }, 100);
        }
      }
    });
  }

  ngOnInit(): void {
    this.sibList = [];
    window.addEventListener('scroll', this.scroll, true);
    this.bodyHeight = window.innerHeight;
    console.log(this.bodyHeight)
    this.sibListColumns = [
      {field: 'complaintCategoryList', header: 'complaint Category', columnpclass:'w1 header thl-col-1 col-sticky'},
      {field: 'id', header: 'ID', columnpclass: 'w2 header thl-col-2'},
      {field: 'symptom', header: 'Symptom', columnpclass: 'w3 header thl-col-3'},
      {field: 'releaseDate', header: 'Release Date', columnpclass: 'w4 header thl-col-4'},
      {field: 'model', header: 'Model', columnpclass: 'w5 header thl-col-5'},
      {field: 'createdOn', header: 'Created On', columnpclass: 'w6 header thl-col-6'},
      {field: 'createdBy', header: 'Created By', columnpclass: 'w7 header thl-col-7'},
      {field: 'status', header: 'Status', columnpclass: 'w8 header thl-col-8 status-col col-sticky'}
    ];
    console.log(this.fromSearchpage)


      if(this.fromSearchpage) {
        this.accessFrom = 'search';
        setTimeout(() => {
          if(!this.searchAction){
            this.getSibInfoData(this.fromSearchpage);
            this.searchAction = true;
          }
        }, 1000);
      }



    this.subscription.add(
      this.sibApiCall = this.commonApi.sibListDataReceivedSubject.subscribe((sibData) => {
      console.log(sibData)
      this.priorityIndexValue = "1";
      this.sibIdArrayInfo=[];
      this.sibAPICount="0";
      let action = sibData['action'];
      //this.getSibInfoData(sibData);
      if(sibData["accessFrom"] == "search") {
        this.accessFrom = sibData['accessFrom'];
        this.searchAction = false;
        if(!this.searchAction){
          this.getSibInfoData(sibData);
          this.searchAction = true;
        }
      }
      else{
        this.getSibInfoData(sibData);
      }
      setTimeout(() => {
        this.accessFrom = sibData['accessFrom'];
        if(this.accessFrom == 'landing') {
          this.loading = true;
          //this.sibApiCall.unsubscribe();
        }
      }, 100);
      })
    );

    this.subscription.add(
      this.sibWsApiCall = this.commonApi.sibListWsDataReceivedSubject.subscribe((sibData) => {
        console.log(sibData)
        this.priorityIndexValue = "1";
        this.sibIdArrayInfo=[];
        this.sibAPICount="0";
        let action = sibData['action'];
        if(action == 'unsubscribe') {
          //this.sibWsApiCall.unsubscribe();
        } else {
          this.loading = true;
          this.getSibInfoData(sibData);
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
        this.updateLayout();
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {
        console.log("-----------353-----------", r);
        let action = r['action'];
        let access = r['access'];
        let page = r['page'];
        console.log(action)
        switch(action) {
          case 'side-menu':
            if(access == 'SIB' || page == 'sib') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
              this.updateLayout();
            }
            return false;
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
        console.log(156456, r)
        var setdata = JSON.parse(JSON.stringify(r));
        let action = setdata.action;
        switch(action) {
          case 'silentDelete':
            let sibIndex = this.sibList.findIndex(option => option.id === setdata.sibId);
            this.sibList.splice(sibIndex, 1);
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
        let id = (this.thumbView) ? 'partList' : 'matrixTable';
        this.scrollToElem(id);
      }, 1000);
    }
  }

  getSibInfoData(sibData) {
    console.log(sibData);
    console.log(this.displayNoRecords);
    this.displayNoRecords = false;
    this.displayNoRecordsDefault=false;
    let action = sibData['action'];
    if(action == 'load') {
      this.loading = true;
      return;
    }
    this.userId = sibData['userId'];
    this.domainId = sibData['domainId'];
    this.filterrecords = sibData['filterrecords'];

    let platformId = localStorage.getItem('platformId');
    if(this.domainId == '52' && platformId == '2' ){
      this.tvsDomain = true;
    }

    this.accessFrom = sibData["accessFrom"];
    if (sibData["accessFrom"] == "search") {
      this.fromSearch = "1";
      this.searchLoading = true;
      this.searchnorecordflag = true;
    }
    this.expandFlag = sibData['expandFlag'];
    let fopt:any = sibData['filterOptions'];
    this.filterOptions = fopt;
    console.log(this.filterOptions, fopt, sibData.filterOptions, action)

    this.thumbView = sibData['thumbView'];
    this.responseData['displayNoRecords'] = this.displayNoRecords;
    this.responseData["displayNoRecordsShow"] = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
    this.responseData['displayNoRecordsDefault'] = this.displayNoRecordsDefault;

    switch (this.accessFrom) {
      case "sib":
      case "search":
      case "landing":
        this.section = sibData["section"];
        this.sibType = sibData["sibType"];
        if (this.accessFrom == "search") {
          this.fromSearch = "1";
        }
        this.searchVal = sibData["searchVal"];
        this.itemEmpty = sibData["itemEmpty"];
        break;

      default:
        break;
    }

    let apiInfo = {
      accessFrom: this.accessFrom,
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      isActive: 1,
      searchKey: this.searchVal,
      fromSearch: this.fromSearch,
      filterOptions: this.filterOptions,
      limit: this.itemLimit,
    };
    this.apiData = apiInfo;
    setTimeout(() => {
      this.setScreenHeight();
    }, 2000);

    switch (action) {
      case "status":
      case "get":
      case "filter":
        this.loading = true;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        setTimeout(() => {
          this.sibList = [];
          this.getSibList();
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
          this.sibSelectionList = [];
          this.responseData.sibSelectionList = this.sibSelectionList;
          this.commonApi.emitPartLayoutData(this.responseData);
        }
        if (action == "status") {
          this.sibSelectionList = [];
          this.responseData.sibSelectionList = this.sibSelectionList;
          this.commonApi.emitPartLayoutData(this.responseData);
        }
        break;
      case "clear":
        this.sibSelectionList = [];
        this.responseData["sibSelectionList"] = this.sibSelectionList;
        //this.sibChangeSelection("empty");
        break;
      case "assign":
        this.loading = false;
        this.sibList = sibData["sibList"];
        this.sibSelectionList = [];
        this.responseData["sibSelectionList"] = this.sibSelectionList;
        this.commonApi.emitPartLayoutData(this.responseData);
        break;
      case "api":
        this.loading = true;
        this.commonApi.emitPartLayoutData(this.responseData);
        break;
      case "toggle":
        console.log(this.sibList);
        this.displayNoRecords = this.sibList.length > 0 ? false : true;
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
              this.getSibList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 50);
        break;
    }
  }

  // Get SIB List
  getSibList(limit:any = '') {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['fromSearch'] = this.fromSearch;
    this.sibType = (this.sibType == undefined || this.sibType == 'undefined') ? '' : this.sibType;
    this.apiData['type'] = this.sibType;
    let itemLimit = (limit == '') ? this.itemLimit : limit;
    console.log(limit, itemLimit, this.itemLimit, this.searchVal);
    let formData = new FormData();
    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('limit', itemLimit);
    formData.append('offset', this.itemOffset);
    formData.append('type', this.sibType);

    formData.append('filterOptions', JSON.stringify(this.apiData['filterOptions']));

    if (localStorage.getItem("searchValue") && this.fromSearch == "1") {
      this.apiData["threadCount"] = this.sibAPICount;
      formData.append('threadCount', this.apiData["threadCount"]);
      if (this.sibIdArrayInfo && this.sibIdArrayInfo.length > 0) {
        this.apiData["threadIdArray"] = JSON.stringify(this.sibIdArrayInfo);
        formData.append('threadIdArray', this.apiData["threadIdArray"]);
      }
      if (this.priorityIndexValue) {
        this.apiData["priorityIndex"] = this.priorityIndexValue;
      } else {
        this.apiData["priorityIndex"] ="1";
      }
      formData.append('priorityIndex', this.apiData["priorityIndex"]);
      this.apiData["searchKey"] = localStorage.getItem("searchValue");
    }

    if(this.teamSystem && localStorage.getItem('searchValue')) {
      this.apiData['searchKey']=localStorage.getItem('searchValue');
    }

    //let searchKey = (this.apiData['searchKey'] == null || this.apiData['searchKey'] == 'null') ? '' : this.apiData['searchKey'];
    formData.append('searchKey', this.apiData['searchKey']);

    console.log(this.filterOptions, this.apiData)
    let apiData = this.apiData;
    this.sibApi.getSibList(apiData, formData).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.lazyLoading = this.loading;
      this.responseData["loading"] = this.loading;
      this.responseData["itemOffset"] = this.itemOffset;
      this.commonApi.emitPartLayoutData(this.responseData);
      let resultData = response.sibData;
      let newInfoText = response.newInfoText;
      this.newPartInfo = newInfoText != undefined ? newInfoText : this.newPartInfo;
      this.redirectionPage = RedirectionPage.SIB;
      this.pageTitleText = PageTitleText.SIB;
      this.contentTypeValue = ContentTypeValues.SIB;
      this.contentTypeDefaultNewImg = DefaultNewImages.SIB;
      this.contentTypeDefaultNewText = DefaultNewCreationText.SIB;
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


      if (response.total == 0 && this.apiData["offset"] == 0 && (response.priorityIndexValue == 4 || response.priorityIndexValue == null)) {
        this.itemEmpty = true;
        this.responseData["itemEmpty"] = this.itemEmpty;
        if (this.apiData["searchKey"] != "" || response.total == 0) {
          this.sibList = [];
          this.itemEmpty = false;
          this.displayNoRecords = true;

          if (this.fromSearch == "1") {
            this.sibAPICount=response.total;
            let priorityIndexValue = response.priorityIndexValue;
            let threadIdArrayInfo = response.partInfoArray;
            if (threadIdArrayInfo) {
              for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
                this.sibIdArrayInfo.push(threadIdArrayInfo[t1]);
              }
            }

            if (priorityIndexValue < "4" && priorityIndexValue) {
              let limitoffset = this.itemOffset + this.itemLimit;
              if (response.total == 0 || limitoffset >= response.total) {
                priorityIndexValue = parseInt(priorityIndexValue) + 1;

                this.priorityIndexValue = priorityIndexValue.toString();
                this.itemOffset = 0;
                this.lazyLoading = true;
                this.getSibList();
              }
            }
          }

          this.responseData["sibList"] = this.sibList;
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
          }

          this.commonApi.emitPartLayoutData(this.responseData);
        } else {
          this.opacityFlag = false;
          this.displayNoRecordsDefault = true;
          this.responseData["displayNoRecords"] = this.displayNoRecords;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          this.responseData["displayNoRecordsDefault"] = this.displayNoRecordsDefault;
          this.contentTypeDefaultNewTextDisabled = false;
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.itemEmpty = false;
        this.itemResponse = resultData;
        this.itemTotal = response.total;

        this.itemLength += resultData.length;
        this.itemOffset += this.itemLimit;

        if (this.itemTotal == 0 && this.fromSearch != "1" && this.itemOffset == 0) {
          this.sibList = [];
          this.itemEmpty = false;
          // modified date - 14-10-2021 - start
          this.displayNoRecords = this.itemTotal > 0 ? false : true;
          this.displayNoRecordsShow = ((this.filterrecords) || (this.fromSearch == "1")) ? 1 : 2;
          this.displayNoRecordsDefault = this.displayNoRecords;
          // modified date - 14-10-2021 - end
        }

        this.responseData["itemTotal"] = this.itemTotal;
        this.responseData["itemOffset"] = this.itemOffset;
        this.responseData["itemEmpty"] = this.itemEmpty;
        this.responseData["displayNoRecords"] = this.displayNoRecords;

        if (this.sibSelectionList.length > 0) {
          this.headerCheck = "checked";
          this.responseData["headerCheck"] = this.headerCheck;
        }


        if (this.fromSearch == "1") {
          this.sibAPICount=response.total;
          let priorityIndexValue = response.priorityIndexValue;
          let threadIdArrayInfo = response.partInfoArray;
          if (threadIdArrayInfo) {
            for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
              this.sibIdArrayInfo.push(threadIdArrayInfo[t1]);
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
              this.getSibList();
            }
          }
        }

        let loadItems = false;
        for (let i in resultData) {
          let model = resultData[i].modelData;
          resultData[i].isActive = false;
          resultData[i].complaintCategoryList = resultData[i].complaintCategoryList.join(', ');
          resultData[i].model = model.length > 1
                    ? this.multipleHtml + " Models"
                    : model[0];
          resultData[i].modelList = model;
          resultData[i].modelInfo = model.join(',');
          resultData[i].releaseDate = (resultData[i].releaseDate != '') ? moment(resultData[i].releaseDate).format('MMM DD,YYYY') : resultData[i].releaseDate;
          let createdDate = moment.utc(resultData[i].createdOn).toDate();
          let localCreatedDate = moment(createdDate)
            .local()
            .format("MMM DD, YYYY h:mm A");
          resultData[i].createdOn =
            resultData[i].createdOn == "" ? "-" : localCreatedDate;
          resultData[i].createdBy =
            resultData[i].createdBy == "" ? "-" : resultData[i].createdBy;
          resultData[i].activeMore = false;
          resultData[i].editAccess = 1;
          resultData[i].viewAccess = 1;

          resultData[i].editAccess =
            resultData[i].editAccess == 1 ? true : false;
          resultData[i].viewAccess =
            resultData[i].viewAccess == 1 ? true : false;
          resultData[i].pinImg =
            resultData[i].pinStatus == 1
              ? "pin-active-red.png"
              : "pin-normal-white.png";
          resultData[i].pinTxt = resultData[i].pinStatus == 1 ? "Unpin" : "Pin";
          this.sibList.push(resultData[i]);
          this.responseData["sibList"] = this.sibList;
          if (parseInt(i) + 1 + "==" + resultData.length) {
            loadItems = true;
          }
        }

        setTimeout(() => {
          this.commonApi.emitPartLayoutData(this.responseData);
        }, 500);

        setTimeout(() => {
          if (!this.displayNoRecords) {
            let listItemHeight;
            if (this.thumbView) {
              listItemHeight = document.getElementsByClassName("parts-grid-row")[0] == undefined ? '' :
                document.getElementsByClassName("parts-grid-row")[0]
                  .clientHeight + 50;
            } else {
              listItemHeight = document.getElementsByClassName("parts-table")[0] == undefined ? '' :
                document.getElementsByClassName("parts-table")[0].clientHeight +
                50;
            }
            console.log(resultData.length, this.sibList.length, response.totalList,  this.innerHeight+'::'+listItemHeight)
            if(resultData.length > 0 && this.sibList.length != response.totalList && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getSibList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 1500);

        if (this.thumbView) {
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateLayout();
            this.opacityFlag = false;
          }, 2000);
        }
        else{
          this.opacityFlag = false;
        }
      }
    });
  }

  // Pin Action
  socialAction(index, status) {
    this.tooltipClearFlag = false;
    this.pinImg = "";
    this.pinTxt = "Pin";
    let actionStatus = "";
    let pinCount = this.sibList[index]["pinCount"];
    actionStatus = status == 0 ? "pined" : "dispined";
    this.sibList[index]["pinStatus"] = status == 0 ? 1 : 0;
    let pinStatus = this.sibList[index]["pinStatus"];
    this.pinImg =
      pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
    this.sibList[index]["pinCount"] =
      status == 0 ? pinCount + 1 : pinCount - 1;

    this.pinImg =
      this.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
    this.pinTxt = this.pinStatus == 1 ? "Unpin" : "Pin";

    this.sibList[index]["pinImg"] = this.pinImg;
    this.sibList[index]["pinTxt"] = this.pinTxt;
    let sibId = this.sibList[index]["id"];
    let apiData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      sibId: sibId,
      postId: sibId,
      ismain: 1,
      status: actionStatus,
      type: "pin",
    };

    console.log(apiData);
    this.sibApi.likePinAction(apiData).subscribe((response) => {
      if (response.status != "Success") {
        this.sibIndex[index]["pinStatus"] = status;
        let pinStatus = this.sibIndex[index]["pinStatus"];
        this.pinImg =
          pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
        this.sibIndex[index]["pinCount"] =
          status == 0 ? pinCount - 1 : pinCount + 1;

        this.pinImg =
          this.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
        this.pinTxt = this.pinStatus == 1 ? "Unpin" : "Pin";

        this.sibIndex[index]["pinImg"] = this.pinImg;
        this.sibIndex[index]["pinTxt"] = this.pinTxt;
      }
      setTimeout(() => {
        this.tooltipClearFlag = true;
      }, 500);
    });
  }

  // View SIB
  viewSib(action, id) {
    let teamSystem = localStorage.getItem("teamSystem");
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' sib') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    setTimeout(() => {
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
  }, 600);
  }

  // Custom Action Tooltip Content
  getActionTooltip(action, index, id, event) {
    let timeout = 100;
    switch (action) {
      case "ws":
        setTimeout(() => {
          this.wsTooltip = true;
          this.sibIndex = index;
          this.sibActionPosition = "bs-popover-right";
          this.positionLeft = event.clientX - 180;
          this.positionTop = event.clientY - 12;
        }, timeout);
        break;
      case "more":
        this.pinImg = "";
        this.pinTxt = "Pin";
        this.wsTooltip = false;
        for (let part of this.sibList) {
          part.activeMore = false;
        }
        this.sibIndex[index].activeMore = true;
        setTimeout(() => {
          this.editAccess = this.sibIndex[index].editAccess;
          this.sibTooltip = true;
          this.sibId = id;
          this.sibIndex = index;
          this.sibActionPosition = "bs-popover-left";
          this.positionLeft = event.clientX - 120;
          this.positionTop = event.clientY - 80;
          this.pinStatus = this.sibIndex[index].pinStatus;
          this.pinImg =
            this.pinStatus == 1 ? "pin-active-red.png" : "pin-normal-white.png";
          this.pinTxt = this.pinStatus == 1 ? "Unpin" : "Pin";
        }, timeout);
        break;
    }
  }

  onClickedOutside(i) {
    this.sibList[i].isActive = false;
  }

  // Nav Part Edit or View
  navPart(action, id, i) {
    let url;
    this.sibList[i].isActive = false;
    switch (action) {
      case "edit":
      case "duplicate":
        url = `${this.sibUrl}${action}/${id}`;
        localStorage.setItem("sibNav", "sib");
        break;
      case "view":
        url = `${this.redirectUrl}/${id}`;
        break
      default:
        url = this.sibUrl;
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

  // Mat Menu Tooltip Click Event
  menuTooltip(i) {
    this.sibList[i].isActive = true;
  }

  // Delete Part
  delete(sibId, index) {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      if (receivedService) {
        const submitModalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        let apiData = {
          apiKey: this.apiKey,
          domainId: this.domainId,
          userId: this.userId,
          contentType: this.groupId,
          sibId: sibId,
          sibActionId: '',
          sibFrameNoId: ''
        };
        this.sibApi.deleteSib(apiData).subscribe((response) => {
          submitModalRef.dismiss("Cross click");
          this.successMsg = response.result;
          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;
          let limit:any = 1;
          this.itemOffset = this.itemOffset+limit;
          this.sibList.splice(index, 1);
          this.getSibList(limit);
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            this.successMsg = "";
          }, 5000);
        });
      }
    });
  }
/*
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
    this.loading = (action != 'init-delete') ? true : false;
    this.displayNoRecords = false;

    this.sibList = [];
    this.sibSelectionList = [];
    this.headerCheck = "unchecked";
    this.headercheckDisplay = "checkbox-hide";
    this.responseData["searchVal"] = this.searchVal;
    this.responseData["sibList"] = this.sibList;
    this.responseData["sibSelectionList"] = this.sibSelectionList;
    this.responseData["headerCheck"] = this.headerCheck;
    this.responseData["headercheckDisplay"] = this.headercheckDisplay;
    //this.sibChangeSelection("empty");
    this.getSibList();
  }
*/
  // Set Screen Height
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
     /* let rmHeight = this.accessFrom == "sib" ? 0 : 80;
      let headerHeight =
        document.getElementsByClassName("prob-header")[0].clientHeight;
      let titleHeight =
        this.accessFrom == "sib"
          ? document.getElementsByClassName("part-list-head")[0].clientHeight
          : 0;
      titleHeight = !this.thumbView ? titleHeight - 80 : titleHeight - 15;
      let footerHeight = document.getElementsByClassName("footer-content")[0].clientHeight;
      this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 30);
      this.innerHeight = this.innerHeight - titleHeight;
      this.innerHeight = this.innerHeight - rmHeight;*/

      let rmHeight = this.accessFrom == "sib" ? 0 : 84;
      rmHeight = (this.pageDataInfo == 2) ? rmHeight-36 : rmHeight;
      let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
      let titleHeight = this.accessFrom != "sib" ? 0 : (document.getElementsByClassName("part-list-head")[0]) ? document.getElementsByClassName("part-list-head")[0].clientHeight : 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      this.innerHeight = this.bodyHeight - (headerHeight + 30);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);

    }
  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 750);
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
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getSibList();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
