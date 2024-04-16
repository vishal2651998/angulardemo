import { Component, OnDestroy, OnInit, HostListener, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { ScrollTopService } from "../../../services/scroll-top.service";
import * as moment from "moment";
import { trigger, transition, style, animate, sequence } from "@angular/animations";
import { pageInfo, windowHeight, Constant, pageTitle, RedirectionPage, PageTitleText, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, forumPageAccess, MediaTypeInfo, DocfileExtensionTypes } from "src/app/common/constant/constant";
import { CommonService } from "../../../services/common/common.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { KnowledgeArticleService } from "../../../services/knowledge-article/knowledge-article.service";
import { ApiService } from '../../../services/api/api.service';
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { BaseService } from 'src/app/modules/base/base.service';

declare var $: any;

@Component({
  selector: 'app-ka-category-solr',
  templateUrl: './ka-category-solr.component.html',
  styleUrls: ['./ka-category-solr.component.scss'],
  styles: [
    `
      .masonry-item {
        width: 200px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
  animations: [
    trigger("threadsTab", [
      transition("* => void", [
        style({
          height: "*",
          opacity: "1",
          transform: "translateX(0)",
          "box-shadow": "0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        }),
        sequence([
          animate(
            ".25s ease",
            style({
              height: "*",
              opacity: ".2",
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
          animate(
            ".1s ease",
            style({
              height: "0",
              opacity: 0,
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
        ]),
      ]),
      transition("void => active", [
        style({
          height: "0",
          opacity: "0",
          transform: "translateX(20px)",
          "box-shadow": "none",
        }),
        sequence([
          animate(
            ".1s ease",
            style({
              height: "*",
              opacity: ".2",
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
          animate(
            ".35s ease",
            style({
              height: "*",
              opacity: 1,
              transform: "translateX(0)",
              "box-shadow": "0 1px 4px 0 rgba(0, 0, 0, 0.3)",
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class KaCategorySolrComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() parentData;
  @Input() fromOthersTab;
  @Input() pageDataInfo;
  @Input() fromSearchPage;
  @Input() tapfromheader;
  //@Input() knowledgeArticleFilterOptions:any=[];
  @Input() filterOptions;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild("top", { static: false }) top: ElementRef;
  public bodyClass1: string = "parts-list";
  public bodyClass2: string = "ka-category";
  public pageTitleText='';
  public redirectionPage='';
  public domainId;
  public countryId;
  public knowledgeArticleAPIcall;
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public windowsItems = [];
  public nothingtoshow: boolean = false;
  public loadedthreadAPI: boolean = false;
  public KAarrayIdInfo: any=[];
  public KAAPICount: any="0";
  public priorityIndexValue='';
  public menuListloaded = [];
  public loadingelanding: boolean = true;
  public knowledgeArticleFilterOptions;
  public userId;
  public roleId;
  subscription: Subscription = new Subscription();
  public myOptions;
  public midHeight;
  public onInitload = false;
  public knowledgeArticleListArray = [];
  public teamSystem = localStorage.getItem("teamSystem");
  public loadingKnowledgeArticle: boolean = true;
  public updateMasonryLayout: boolean = false;
  public loadingKnowledgeArticlemore: boolean = false;
  public centerloading: boolean = false;
  public itemLimitTotal: number = 100;
  public itemLimit: number = 100;
  public itemwidthLimit;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public newThreadInfo = "Get started by tapping on ‘New Knowledge Article’.";
  public displayNoRecordsShow = 0;
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public callFromWS: boolean = false;
  public createThreadUrl = "knowledgearticles/manage";
  public proposedFixTxt = "";
  public threadwithFixTxt = "";
  public shareFixTxt = "";
  public threadwithHelpfulFixTxt = "";
  public threadwithNotFixTxt = "";
  public threadCloseTxtTxt = "";
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public ItemArray = [];
  public workstreamFilterArr = [];
  public outputFilterData: boolean = false;
  public makeNameArr = [];
  public optionFilter = "";
  public itemTotal: number;
  public apiData: Object;
  public threadSortType = "sortthread";
  public threadOrderByType = "desc";
  public searchValue = "";
  public MediaTypeInfo = MediaTypeInfo;
  public DocfileExtensionTypes = DocfileExtensionTypes;
  public user: any;
  public opacityFlag: boolean = false;
  public pageInfo: any = pageInfo.knowledgeArticlePage;
  public accessFrom: string = '';
  public bodyElem;
  public bodyClass3:string = "profile";
  public bodyClass4:string = "image-cropper";
  public defaultCatLogo:string = "assets/images/ka-category-default.png";
  public catpageRefresh: boolean = false;

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    console.log(event, "onresize is called");
    let url:any = this.router.url;
    let currUrl = url.split('/');
    console.log(currUrl[1], currUrl.length)
    setTimeout(() => {
      console.error("192-------------", this.pageDataInfo);
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      let ht = headerHeight;
      if (this.accessFrom == "landing") {
        this.midHeight = windowHeight.height - (140 + ht);
      } else if (this.accessFrom == "search") {
        this.midHeight = windowHeight.height - (135 + ht);
      } else {
        if(currUrl[1] == RedirectionPage.KnowledgeArticles && currUrl.length < 2) {
          this.midHeight = windowHeight.height - (73 + ht);
        } else {
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 750);
        }
      }
    }, 100);

  }

  constructor(
    private router: Router,
    private location: PlatformLocation,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private baseSerivce: BaseService,
  ) { this.location.onPopState (() => {
    if(!document.body.classList.contains(this.bodyClass1)) {
      document.body.classList.add(this.bodyClass1);
    }
    let url = this.router.url.split('/');
      if(url[1] == RedirectionPage.Search ) {
        if(localStorage.getItem('KACategoryEnable') == "1"){
          this.apiUrl.kaCategory= true;
        if(this.apiUrl.searchPageRedirectFlag == "1"){
          //this.apiUrl.searchPageRedirectFlag = "2";
          console.log("pop1");
        this.opacityFlag = true;
        this.loadingKnowledgeArticle = true;
        this.accessFrom = "knowledgeArticles";
        localStorage.removeItem('searchValue');
        localStorage.removeItem('searchPageFilter');
        localStorage.removeItem('filterOptions');
        localStorage.removeItem('threadFilter');
        this.knowledgeArticleListArray = [];
        this.displayNoRecords = false;
        this.displayNoRecordsDefault = false;
        this.searchValue = "";
        this.filterOptions = "";
        this.itemOffset = 0;
        this.apiData["filterOptions"] = "";
        this.apiData['offset'] = this.itemOffset;
        this.loadingKnowledgeArticlemore = false;
        let apiInfo = {
          apiKey: Constant.ApiKey,
          userId: this.userId,
          domainId: this.domainId,
          countryId: this.countryId,
          escalationType: 1,
          limit: 0,
          offset: 10,
          type: "",
          orderBy: true,
          optionFilter: this.optionFilter,
          filterOptions: "",
          searchText: ""
        };
        this.apiData = apiInfo;
        setTimeout(() => {
          this.loadKnowledgeArticlePage();
          localStorage.removeItem('sNavUrl');
        }, 1000);
       }
      }
      }
    });
  }
  ngOnInit(): void {

    document.body.classList.add(this.bodyClass2);

    console.error("knowledge page is loaded", this.pageDataInfo);
    this.accessFrom = this.pageDataInfo.accessFrom;
    let filterData;
    let threadSortType = this.threadSortType;
    let threadOrderType = this.threadOrderByType;
    let filterrecords = false;

    let searchValue = this.searchValue;
    if (
      searchValue &&
      (searchValue != undefined ||
        searchValue != "undefined" ||
        searchValue != null)
    ) {
      searchValue = this.searchValue;
    } else {
      searchValue = "";
    }

    this.subscription.add(
      this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
        this.loadingKnowledgeArticle = true;
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        console.log(setdata);
        let pushAction = setdata.pushAction;
        let action = setdata.action;
        let access = setdata.access;
        this.accessFrom = setdata.access;
        let pageInfo = setdata.pageInfo;
        let limit: any = 1;
        let obj = {}, callFromOuter = false;
        this.pageDataInfo = (pageInfo != '') ? pageInfo : this.pageDataInfo;
        if(access == 'knowledgearticles' && pushAction == 'load') {
          switch(action) {
            case 'silentLoad':
              if(setdata.silentLoadCount > 0) {
                document.body.classList.add(this.bodyClass2);
                if(!document.body.classList.contains(this.bodyClass1)) {
                  document.body.classList.add(this.bodyClass1);
                }
                let limit = setdata.silentLoadCount;
                let obj = {}, callFromOuter = false;
                this.loadKnowledgeArticlePage(true, obj, callFromOuter, limit);
              }
              break;
            case 'silentUpdate':
              this.opacityFlag = true;
              setTimeout(() => {
                let threadId = parseInt(setdata.dataId);
                let dataInfo = setdata.dataInfo;
                let ukaIndex = this.knowledgeArticleListArray.findIndex(option => option.threadId === threadId);
                let flag: any = false;
                this.setupKAData(action, flag, dataInfo, ukaIndex);
                let pageDataIndex = pageTitle.findIndex(option => option.slug == this.redirectionPage);
                let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
                localStorage.removeItem(pageDataInfo);
              }, 500);
              return false;
              break;
            case 'silentDelete':
              let threadId = parseInt(setdata.threadId)
              let threadIndex = this.knowledgeArticleListArray.findIndex(option => option.threadId === threadId);
              console.log(this.knowledgeArticleListArray, setdata.threadId, threadIndex)
              this.knowledgeArticleListArray.splice(threadIndex, 1);
              this.itemTotal -= 1;
              this.itemLength -= 1;
              return false;
              break;
          }

          if (this.pageDataInfo == pageInfo) {
            var checkpushtype = setdata.pushType;
            var checkmessageType = setdata.messageType;
            var checkgroups = setdata.groups;
            let fknowledgeArticleFilter = JSON.parse(
              localStorage.getItem("knowledgeArticleFilter")
            );
            console.log(fknowledgeArticleFilter);
            console.log("message received! ####", r);
            if (
              (checkpushtype == 1 && checkmessageType == 1) ||
              checkpushtype == 25
            ) {
              if (checkgroups) {
                let groupArr = JSON.parse(checkgroups);
                console.log(groupArr);
                if (groupArr) {
                  console.log(fknowledgeArticleFilter.workstream);
                  let findgroups = 0;

                  if (fknowledgeArticleFilter.workstream) {
                    let arrworkstm = fknowledgeArticleFilter.workstream;
                    findgroups = groupArr.filter(x => !arrworkstm.includes(x));
                  }
                  console.log(checkpushtype);
                  if (checkpushtype == 25) {
                    let threadWs = groupArr;
                    let fknowledgeArticleFilter = this.filterOptions;

                    if (threadWs.length > 0) {
                      let pushFlag = true;
                      let fknowledgeArticleFilter = JSON.parse(
                        localStorage.getItem("knowledgeArticleFilter")
                      );

                      for (let ws of threadWs) {
                        let windex = fknowledgeArticleFilter.workstream.findIndex(
                          (w) => w == ws
                        );
                        console.log(windex)
                        if (windex == -1) {
                          pushFlag = false;
                          fknowledgeArticleFilter.workstream.push(ws);
                        }
                      }

                      let tws = fknowledgeArticleFilter.workstream;
                      console.log(tws, pushFlag);
                      console.log(JSON.stringify(fknowledgeArticleFilter));

                      this.outputFilterData = true;
                      console.log(this.outputFilterData);

                      localStorage.setItem(
                        "knowledgeArticleFilter",
                        JSON.stringify(fknowledgeArticleFilter)
                      );
                      console.log(JSON.stringify(fknowledgeArticleFilter));
                      if(pushFlag) {
                        setTimeout(() => {
                          console.log(pushFlag)
                          this.loadKnowledgeArticlePage(pushFlag, obj, callFromOuter, limit);
                        }, 2000);
                      } else {
                        let currUrl = this.router.url.split('/');
                        let navFrom = currUrl[1];
                        if(navFrom == 'knowledgearticles') {
                          setTimeout(() => {
                            this.filterOutput.emit("push");
                          }, 1500);
                        }
                        this.itemOffset = 0;
                        this.apiData['offset'] = this.itemOffset;
                        this.knowledgeArticleListArray = [];
                        this.apiData = apiInfo;
                        this.loadKnowledgeArticlePage();
                      }
                    }
                  }

                  if (findgroups != -1) {
                    if (checkpushtype != 25) {
                      this.loadKnowledgeArticlePage(true);
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
      this.sharedSvc._OnLayoutChangeReceivedSubject.subscribe((r) => {
        setTimeout(() => {
          console.error("_OnLayoutChangeReceivedSubject");
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 1500);
        }, 100);

      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutStatusReceivedSubjectNew.subscribe((r, r1 = "") => {

        // var knowledgeArticleFilter = localStorage.getItem('knowledgeArticleFilter');
        console.error("_OnLayoutStatusReceivedSubjectNew");
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        let action = r['action'];
        this.catpageRefresh = r['catpageRefresh'];

        if(this.catpageRefresh){
        if(action == 'updateLayout'){
          let scrollPos = localStorage.getItem('wsScrollPos');
          let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
          this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
          console.log(this.scrollTop)
          //this.opacityFlag = true;
          setTimeout(() => {
            localStorage.removeItem('wsScrollPos');
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateMasonryLayout = true;
            setTimeout(() => {
              this.updateMasonryLayout = false;
            }, 750);
            setTimeout(() => {
              let id = 'thread-data-container';
              this.scrollToElem(id);
            }, 500);
          }, 5);
        }
        else{
        let access = r['access'];
        this.accessFrom = r['access'];
        let page = r['page'];
        switch(action) {
          case 'side-menu':
            if(access == 'Knowledge Articles' || page =='knowledgearticles') {
              document.body.classList.add(this.bodyClass2);
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
              this.masonry.reloadItems();
              this.masonry.layout();
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 1500);
            }
            return false;
            break;
        }        
          
        this.itemOffset = 0;
        this.knowledgeArticleListArray = [];
        this.loadKnowledgeArticlePage();
        setTimeout(() => {
          if (this.top != undefined) {
            this.top.nativeElement.scroll({
              top: 0,
              left: 0,
              behavior: "auto",
            });
          }
        }, 1000);         
        
      }
    }
    else{
      if(action == 'updateLayout'){
        let scrollPos = localStorage.getItem('wsScrollPos');
        let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
        this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
        console.log(this.scrollTop)
        //this.opacityFlag = true;
        setTimeout(() => {
          localStorage.removeItem('wsScrollPos');
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 750);
          setTimeout(() => {
            let id = 'thread-data-container';
            this.scrollToElem(id);
          }, 500);
        }, 5);
      }

    }
      })

    );

    this.subscription.add(
      this.sharedSvc.knowledgeArticleDataReceivedSubject.subscribe(
        (knowledgeData) => {
          console.error("knowledgedata", knowledgeData, this.apiData);
          this.loadingKnowledgeArticle = true;
          this.knowledgeArticleListArray = [];
          this.callFromWS = true;
          this.itemOffset = 0;
          console.log(knowledgeData["filterrecords"]);
          this.apiData["filterrecords"] = knowledgeData["filterrecords"];
          this.fromSearchPage = knowledgeData["accessFrom"] == 'search' ? true : false;
          this.accessFrom = knowledgeData["accessFrom"];
          if(this.fromSearchPage){

            this.searchLoading = true;
            this.searchnorecordflag = true;

            this.KAarrayIdInfo = [];
            this.KAAPICount = "0";
            this.priorityIndexValue='';

          }
          this.loadKnowledgeArticlePage(false, knowledgeData, true);
          setTimeout(() => {
            if (this.top != undefined) {
              this.top.nativeElement.scroll({
                top: 0,
                left: 0,
                behavior: "auto",
              });
            }
          }, 1000);
        }
      )
    );

    if (this.teamSystem) {
      this.midHeight = windowHeight.height - 20;
    } else {
      console.error("611------", this.midHeight, this.pageDataInfo);
      if (this.accessFrom == "landing") {
        this.midHeight = windowHeight.height - 140;
      } else if (this.accessFrom == "search") {
        this.midHeight = windowHeight.height - 135;
      } else {
        this.midHeight = windowHeight.height - 73;
      }
    }

    if(this.pageDataInfo == 2) {
      setTimeout(() => {
        this.scrollTop = 0;
        let id = 'thread-data-container';
        this.scrollToElem(id);
      }, 1000);
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');

    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      escalationType: 1,
      limit: this.itemLimit,
      offset: this.itemOffset,
      type: threadSortType,
      orderBy: threadOrderType,
      optionFilter: this.optionFilter,
      filterOptions: filterData,
      searchText: searchValue

    };
    this.apiData = apiInfo;
    // this.loadKnowledgeArticlePage();

  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.nothingtoshow = false;
    var scrollLeftevt = event.target.scrollLeft;
    var scrollTopevt = event.target.scrollTop;
    //console.log(scrollTopevt+'---scrollTopevt');
    if (scrollTopevt < 2) {
      $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
    } else {
      $(".workstream-page-center-menu-inner").addClass("scroll-bg");
    }
    console.log("scrolling");
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - this.itemOffset * 12;
    this.scrollTop = event.target.scrollTop - 80;
    let scrollTop1 = event.target.scrollTop - 250;

    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      console.log(
        "scrolling -inner" +
          this.scrollCallback +
          this.itemTotal +
          "----" +
          this.itemLength
      );
      if (
        inHeight >= totalHeight &&
        this.scrollCallback &&
        this.itemTotal > this.itemLength
      ) {
        this.scrollCallback = false;
        console.log("bottom reached");

        this.loadKnowledgeArticlePage();
        this.loadingKnowledgeArticlemore = true;
      }
    }
    console.log(this.itemTotal + "--" + this.itemTotal + "-" + this.itemOffset);
    if (this.itemTotal && this.itemTotal < this.itemOffset) {
      if (inHeight >= totalHeight) {
        this.nothingtoshow = true;
      } else {
        this.nothingtoshow = false;
      }
    }
  }
  callForResize() {
    setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      let ht = headerHeight;
      if (this.accessFrom == "landing") {
        this.midHeight = windowHeight.height - (140 + ht);
      } else if (this.accessFrom == "search") {
        this.midHeight = windowHeight.height - (135 + ht);
      } else {
        this.midHeight = windowHeight.height - (73 + ht);
      }
      //this.getnorows();
    }, 100);
  }


  
  loadKnowledgeArticlePage(push = false, obj = {}, callFromOuter = false, limit = '') {

    var objData = {};    
    let FiltersArr={};

    localStorage.setItem('KACategoryEnable',"1");
    
    console.log(push, this.apiData["filterrecords"]);
  

    let searchParams = '';
    let apiData = {
      "rows": this.itemLimit,
      "start": this.itemOffset,
      "filters": {"domainId":this.apiData["domainId"]},
    };
    
    this.knowledgeArticleAPIcall =
    this.sharedSvc.getKACatSolr(apiData).subscribe(
        (response) => {

          console.log(response);
          let rtdata = response.folders.folderInfoStrArr;
          console.log(rtdata);
          let threadInfototal = response.total;

          this.redirectionPage = RedirectionPage.KnowledgeArticles;
          this.pageTitleText = PageTitleText.KnowledgeArticles;
          this.contentTypeValue = ContentTypeValues.KnowledgeArticles;
          this.contentTypeDefaultNewImg = DefaultNewImages.KnowledgeArticles;
          this.contentTypeDefaultNewText = DefaultNewCreationText.KnowledgeArticles;
               
          this.callForResize();
          let threadInfoData = rtdata;
          this.itemTotal = threadInfototal;

          if (threadInfoData.length > 0) {
            this.loadingKnowledgeArticle = false;
            let loadItems = false;
            this.centerloading = false;
            let action = 'init';
            let initIndex = -1;
            this.displayNoRecords = false;
            this.displayNoRecordsDefault = false;
            this.displayNoRecordsShow = 0;
            for (let t = 0; t < threadInfoData.length; t++) {
              this.setupKAData(action, push, threadInfoData[t], initIndex);
            }

            setTimeout(() => {
              this.masonryReloadUpdate();
            }, 2000);
            setTimeout(() => {
              this.updateMasonryLayout = false;
            }, 2200);
          } else {
            this.displayNoRecords = true;
            this.displayNoRecordsDefault = false;
            this.loadingKnowledgeArticle = false;
            this.centerloading = false;
            this.loadingKnowledgeArticlemore = false;
            this.updateMasonryLayout = true;
            this.opacityFlag = false;
          }

        }
      );
  }

  masonryReloadUpdate() {
    this.masonry.reloadItems();
    this.masonry.layout();
    this.loadingKnowledgeArticle = false;
    this.loadingKnowledgeArticlemore = false;
    this.updateMasonryLayout = true;
    this.opacityFlag = false;
  }

  setupKAData(action, push, threadInfoData, index = 0) {
    this.loadingKnowledgeArticle = false;
    let fileCountText = '';
    switch(threadInfoData.facetCount){
      case 0:
        fileCountText = 'Empty';
        break;
      case 1:
        fileCountText = '1 File';
        break;
      default:
        fileCountText = threadInfoData.facetCount+' Files';
        break;
    }
    let obj = {
      catId: threadInfoData.id,
      logo: threadInfoData.logo != '' && threadInfoData.logo != null && threadInfoData.logo != undefined ? threadInfoData.logo : "",
      categoryName: threadInfoData.name,
      fileCountText: fileCountText,
      fileCount: threadInfoData.facetCount,
      isSystemFolder: threadInfoData.systemFolder
    };
    this.knowledgeArticleListArray.push(obj);
    
    localStorage.setItem('kaCatIDAll',this.knowledgeArticleListArray[0].catId);
    localStorage.setItem('kaCatNameAll',this.knowledgeArticleListArray[0].categoryName)
  }

  loadKAList(count,cid,cname){
    if(count>0){
      this.loadingKnowledgeArticle = true;
      this.centerloading = false;
      let cdata = {
        cid: cid,
        cname: cname
      }
      this.apiUrl.knowledgeArtCall = "1";
      this.sharedSvc.emitKnowledgeCatListData(cdata);
    }
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    console.log(secElement, this.scrollTop)
    secElement.scrollTop = this.scrollTop;
    this.opacityFlag = false;
  }

  // Update Manufacturer Logo
  updateLogo(item) {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass3);
    this.bodyElem.classList.add(this.bodyClass4);
    let access = "categoryLogo";
    const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.type = "";
    modalRef.componentInstance.profileType = access;
    modalRef.componentInstance.id = item.catId;
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
        if (receivedService) {
            //console.log(receivedService);
            this.bodyElem = document.getElementsByTagName('body')[0];
            this.bodyElem.classList.remove(this.bodyClass3);
            this.bodyElem.classList.remove(this.bodyClass4);
            modalRef.dismiss('Cross click');
            item.logo = receivedService.show;
            
            const apiData = new FormData();
            apiData.append('apiKey', this.apiData['apiKey']);
            apiData.append('domainId', this.apiData['domainId']);
            apiData.append('dataId', item.catId);
            apiData.append('userId', this.apiData['userId']);
            apiData.append('action', 'categoryUpdate');
            apiData.append('actionType', '6');
            apiData.append('platform', '3');
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiData).subscribe((response: any) => { })
            
        }
    });
  }
  editCatPopup(name,id) {
    console.log(name);
    console.log(id);
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    }
    let actionInfo = {
        action: 'edit',
        id: id,
        name: name
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Edit Category';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = actionInfo;
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;
      setTimeout(() => {
        msgModalRef.dismiss('Cross click'); 
        let rmIndex;
        rmIndex = this.knowledgeArticleListArray.findIndex((option) => option.catId == id);
        this.knowledgeArticleListArray[rmIndex].categoryName = receivedService.folderName;
        this.masonry.reloadItems();
        this.masonry.layout();
        this.updateMasonryLayout = true;
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 750);
      }, 3000);
    });
  }

 deleteCatPopup(name,id,count) {
    console.log(name);
    console.log(id);
    let apiData = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId
    }
    let actionInfo = {
        action: 'delete',
        id: id,
        name: name,
        count: count
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Delete Category';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = actionInfo;
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        console.log(receivedService)
        const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
        msgModalRef.componentInstance.successMessage = receivedService.message;


        /*this.itemOffset = 0;
        this.apiData['offset'] = this.itemOffset;
        this.knowledgeArticleListArray = [];
        this.loadKnowledgeArticlePage();*/

        setTimeout(() => {
            msgModalRef.dismiss('Cross click');
            let rmIndex;
            rmIndex = this.knowledgeArticleListArray.findIndex((option) => option.catId == id);
            let updateCount = this.knowledgeArticleListArray[rmIndex].fileCount;
            let fileCountText = "";
            switch(updateCount){
              case 0:
                fileCountText = 'Empty';
                break;
              case 1:
                fileCountText = '1 File';
                break;
              default:
                fileCountText = updateCount+' Files';
                break;
            }
            this.knowledgeArticleListArray[rmIndex].fileCountText;
            this.knowledgeArticleListArray.splice(rmIndex, 1);
            console.log(updateCount, this.knowledgeArticleListArray);

            if(this.knowledgeArticleListArray.length == 1){
              this.loadingKnowledgeArticle = true;
              this.centerloading = false;
              let cdata = {
                cid: '0',
                cname: ''
              }
              this.apiUrl.knowledgeArtCall = "1";
              localStorage.setItem("KACategoryOption", "0");
              localStorage.setItem("editKAFlag", "1");
              this.sharedSvc.emitKnowledgeCatListData(cdata);
            }
            else{

              let updateFolder, fileCount;
              let platformId: any = localStorage.getItem('platformId');
              platformId = (platformId == 'undefined' || platformId == undefined) ? platformId : parseInt(platformId);

              switch(receivedService.action) {
                case 'all':
                    updateFolder = this.knowledgeArticleListArray.findIndex((option) => option.isSystemFolder == 1 && option.folderName == 'ALL FILES');
                    fileCount = this.knowledgeArticleListArray[updateFolder].fileCount-updateCount;
                    this.knowledgeArticleListArray[updateFolder].fileCount = fileCount;
                    let fileCountText = "";
                    switch(fileCount){
                      case 0:
                        fileCountText = 'Empty';
                        break;
                      case 1:
                        fileCountText = '1 File';
                        break;
                      default:
                        fileCountText = fileCount+' Files';
                        break;
                    }
                    this.knowledgeArticleListArray[rmIndex].fileCountText;
                  break;
              }

              this.masonry.reloadItems();
              this.masonry.layout();
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 750);
            }
        }, 3000);

    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

