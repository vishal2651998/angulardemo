import { Component, OnDestroy, OnInit, HostListener, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { ScrollTopService } from "../../../services/scroll-top.service";
import * as moment from "moment";
import { trigger, transition, style, animate, sequence } from "@angular/animations";
import { pageInfo, windowHeight, filterNames, Constant, pageTitle, PlatFormType, RedirectionPage, PageTitleText, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, forumPageAccess, MediaTypeInfo, DocfileExtensionTypes } from "src/app/common/constant/constant";
import { CommonService } from "../../../services/common/common.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ApiService } from '../../../services/api/api.service';
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import { BaseService } from 'src/app/modules/base/base.service';
import { ViewKaDetailComponent } from '../../../components/common/view-ka-detail/view-ka-detail.component';
import { Title,DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;

@Component({
  selector: "app-knowledge-articles",
  templateUrl: "./knowledge-articles.component.html",
  styleUrls: ["./knowledge-articles.component.scss"],
  styles: [
    `
      .masonry-item {
        width: 268px;
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

export class KnowledgeArticlesComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() parentData;
  @Input() fromOthersTab;
  @Input() pageDataInfo;
  @Input() fromSearchPage;
  @Input() tapfromheader;
  //@Input() knowledgeArticleFilterOptions:any=[];
  @Input() filterOptions;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @Output() searchResultData: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild("top", { static: false }) top: ElementRef;
  @Output() accessLevelValue: EventEmitter<any> = new EventEmitter();
  public bodyClass1: string = "parts-list";
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
  public currentWS: any = 0;
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
  public loadingKnowledgeArticle: boolean = false;
  public updateMasonryLayout: boolean = false;
  public loadingKnowledgeArticlemore: boolean = false;
  public centerloading: boolean = false;
  public itemLimitTotal: number = 10;
  public itemLimit: number = 10;
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
  public workstreamFilterArrData = [];
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
  public catId: string = "";
  public catName: string = "";
  public breadCrumbEnable: boolean = false;
  public initLoadKAPage: boolean = false;
  public accessLazyLoad: string = "";
  public collabticDomain: boolean = false;
  public CBADomain: boolean = false;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true, reply: true, close: true};
  public bodyElem;
  public bodyClass: string = "submit-loader";
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
      let bheight = (this.breadCrumbEnable) ? 30 : 0;
      let ht = headerHeight + bheight;
      if (this.accessFrom == "landing") {
        ht -= 44;
        this.midHeight = windowHeight.height - (140 + ht);
      } else if (this.accessFrom == "search") {
        this.midHeight = windowHeight.height - (110 + ht);
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
      //this.getnorows();
    }, 100);

  }

  constructor(
    private router: Router,
    private location: PlatformLocation,
    private LandingpagewidgetsAPI: LandingpageService,
    private scrollTopService: ScrollTopService,
    public sharedSvc: CommonService,
    private getMenuListingApi: CommonService,
    private renderer: Renderer2,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private baseSerivce: BaseService,
    private modalService: NgbModal,
    private titleService: Title,
  ) { this.location.onPopState (() => {  
    if(!document.body.classList.contains(this.bodyClass1)) {
      document.body.classList.add(this.bodyClass1);
    }
    
    let url = this.router.url.split('/');  
    console.log(url)
    if(url[1] == RedirectionPage.KnowledgeArticles) {
        let scrollPos = localStorage.getItem('wsScrollPos');
        let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
        this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
        console.log(this.scrollTop)
        let deleteArticles= localStorage.getItem('deleteArticles');
           if(deleteArticles!='1')
           {
            this.opacityFlag = true;
           }
        
        setTimeout(() => {
          localStorage.removeItem('wsScrollPos');
          this.masonry.reloadItems();
          this.masonry.layout();          
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 1000);
            
          setTimeout(() => {
            let id = 'thread-data-container';
            this.scrollToElem(id);
           let deleteArticles= localStorage.getItem('deleteArticles');
           if(deleteArticles=='1')
           {
            this.loadingKnowledgeArticle = true; 
            this.centerloading=false;
            this.opacityFlag = false;
            localStorage.removeItem('deleteArticles');
           }
          }, 500);
        }, 5);
      
    }
    if(url[1] == RedirectionPage.Search ) {
      this.fromSearchPage = false;
      console.log("pop"+localStorage.getItem('KACategoryEnable')+this.apiUrl.searchPageKARedirectFlag);
      if(localStorage.getItem('KACategoryEnable') != "1"){
        this.loadingKnowledgeArticle = true; 
       // localStorage.removeItem('currentWorkstream');        
        setTimeout(() => {
          this.apiUrl.searchPageKARedirectFlag = "0";
        }, 10);  
        console.log("pop1");
        this.opacityFlag = true;
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
        let ws ='';
        let url_current = window.location.pathname.split('/');
      
        this.itemLength=0;  
        if(url_current[1] == RedirectionPage.KnowledgeArticles) 
          {
            ws ='';
          }
          else
          {
            ws = localStorage.getItem('currentWorkstream');
          }
        
        if(ws) {
          this.currentWS = ws;
        }
        if(this.currentWS > 0) {
          this.itemOffset = 0;
          this.knowledgeArticleListArray = [];
          let ws = [];
          ws.push(this.currentWS)
          this.apiData['filterOptions'] = {
            workstream: ws
          };
          console.log(this.apiData['filterOptions'])       
        }
       
        setTimeout(() => { 
          
          this.loadKnowledgeArticlePage(); 
          localStorage.removeItem('sNavUrl');  
          setTimeout(() => {
            this.currentWS = 0;
          }, 100);
        }, 500);                
      
    }
  }
});
 }

  ngOnInit(): void {
    localStorage.setItem('currentContentType', '7');
    console.error("knowledge page is loaded", this.pageDataInfo);
    this.accessFrom = this.pageDataInfo.accessFrom;
    let filterData;
    let threadSortType = this.threadSortType;
    let threadOrderType = this.threadOrderByType;
    let filterrecords = false;
    let platformId: any = localStorage.getItem('platformId');
    let domainId: any = localStorage.getItem('domainId')
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
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
      this.sharedSvc.deleteArticlesDataReceivedSubject.subscribe((r) => {
        this.loadKnowledgeArticlePage();
      })
      );
    this.subscription.add(
      this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
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
              if( this.itemLength>0){
                return false;
              }
              else{
                this.displayNoRecords = true;
                this.displayNoRecordsDefault = false;
                this.displayNoRecordsShow = 1;
                this.loadingKnowledgeArticle = false;
                this.centerloading = false;
                this.loadingKnowledgeArticlemore = false;
                this.updateMasonryLayout = true;
              }
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
      this.sharedSvc.KAWorkstreamReceivedSubject.subscribe((data) => {
      console.log(data)
        this.itemOffset = 0;
        this.knowledgeArticleListArray = [];
        let ws = [];
        ws.push(data['workstreamId'])
        this.apiData['filterOptions'] = {
          workstream: ws
        };
        this.itemOffset = 0;
        this.apiData['offset'] = this.itemOffset;
        this.loadingKnowledgeArticle = true;
        this.loadKnowledgeArticlePage();
        localStorage.removeItem('sNavUrl');
        setTimeout(() => {
          this.currentWS = 0;
        }, 100);
      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutChangeReceivedSubject.subscribe((r) => {
        console.error("_OnLayoutChangeReceivedSubject");
        this.masonry.reloadItems();
        this.masonry.layout();
        this.updateMasonryLayout = true;
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 1500);
      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {
        console.error("_OnLayoutStatusReceivedSubject");
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        let action = r['action'];
        let catpageRefresh = r['catpageRefresh'];
        if(r['access'] != 'thread') {
          if(catpageRefresh){
            this.onInitload = true;
            this.centerloading = false;
            this.loadingKnowledgeArticle = true;
            this.knowledgeArticleListArray = [];
            this.itemOffset = 0;
            this.apiData['offset'] = this.itemOffset;
            this.opacityFlag = false;
          }

          if(action == 'updateLayout'  || action == 'updateLayout-knowledgearticles'){
            let scrollPos = localStorage.getItem('wsScrollPos');
            let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
            this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
            this.loadingKnowledgeArticlemore = false;
            this.centerloading = false;
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
          } else {
            let access = r['access'];
            this.accessFrom = r['access'];
            let page = r['page'];
            switch(action) {
              case 'side-menu':
                if(access == 'Knowledge Articles' || page =='knowledgearticles') {
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
            let filterrecords = setdata.filterrecords;
            console.log(setdata);
            if (
              this.pageDataInfo == pageInfo.searchPage &&
              (setdata.reset == false || setdata.reset == true)
            ) {
              localStorage.setItem("searchPageFilter", JSON.stringify(r));
            }
            let filterData;
            let threadSortType = this.threadSortType;
            let threadOrderType = this.threadOrderByType;

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
            let actionload = setdata.action;
            if (setdata.sortOrderBy) {
              actionload = "get";
              if (setdata.type) {
                threadSortType = setdata.type;
              } else {
                let threadSortFilter = localStorage.getItem(
                  "knowledgeArticleFilter"
                );
                if (
                  threadSortFilter &&
                  threadSortFilter != null &&
                  threadSortFilter != "undefined" &&
                  threadSortFilter != "null"
                ) {
                  let sortOpt = JSON.parse(threadSortFilter);
                  if (sortOpt) {
                    if (sortOpt.code) {
                      threadSortType = sortOpt.code;
                    }
                  }
                }
              }

              if (setdata.orderBy) {
                actionload = "get";
                threadOrderType = setdata.orderBy;
              } else {
                let threadOrderFilter = localStorage.getItem("threadOrderFilter");

                if (
                  threadOrderFilter &&
                  threadOrderFilter != null &&
                  threadOrderFilter != "undefined" &&
                  threadOrderFilter != "null"
                ) {
                  let orderOpt = JSON.parse(threadOrderFilter);
                  if (orderOpt) {
                    if (orderOpt.code) {
                      threadOrderType = orderOpt.code;
                    }
                  }
                }
              }
              filterData = localStorage.getItem("knowledgeArticleFilter");
            } else {
              let threadSortFilter = localStorage.getItem("knowledgeArticleFilter");
              if (
                threadSortFilter &&
                threadSortFilter != null &&
                threadSortFilter != "undefined" &&
                threadSortFilter != "null"
              ) {
                let sortOpt = JSON.parse(threadSortFilter);
                if (sortOpt) {
                  if (sortOpt.code) {
                    threadSortType = sortOpt.code;
                  }
                }
              }
              let threadOrderFilter = localStorage.getItem(
                "knowledgeArticleFilter"
              );

              if (
                threadOrderFilter &&
                threadOrderFilter != null &&
                threadOrderFilter != "undefined" &&
                threadOrderFilter != "null"
              ) {
                let orderOpt = JSON.parse(threadOrderFilter);
                if (orderOpt) {
                  if (orderOpt.code) {
                    threadOrderType = orderOpt.code;
                  }
                }
              }

              console.log(localStorage.getItem("knowledgeArticleFilter"));
              if (filterData == true) {
                filterData = JSON.stringify(r);
              } else {
                if (this.pageDataInfo == pageInfo.searchPage) {
                  filterData = localStorage.getItem("knowledgeArticleFilter");
                } else {
                  filterData = JSON.stringify(r);
                }
              }
              console.log(filterData);
            }
            console.log(setdata, this.knowledgeArticleListArray);
            this.knowledgeArticleFilterOptions = setdata;
            if (true) {
              if (actionload == "get") {
              }
              var data_prod_values = JSON.stringify(this.workstreamFilterArr);
              this.ItemArray = [];
              this.ItemArray.push({
                groups: data_prod_values,
                likespins: [],
                make_models: [],
                rankby: [],
                Fixstatus: [],
              });
              this.optionFilter = JSON.stringify(this.ItemArray);
              if (setdata.sortOrderBy) {
              } else {
                localStorage.setItem("knowledgeArticleFilter", filterData);
              }

              if (this.pageDataInfo == pageInfo.searchPage) {
                filterData = localStorage.getItem("searchPageFilter");
              }
              let kaAction = setdata.loadAction;
              this.itemOffset = kaAction == "push" ? this.itemOffset + 1 : 0;
              let limit = kaAction == "push" ? 1 : this.itemLimit;
              let offset = kaAction == "push" ? 0 : this.itemOffset;
              this.countryId = localStorage.getItem('countryId');
              let apiInfo = {
                apiKey: Constant.ApiKey,
                userId: this.userId,
                domainId: this.domainId,
                countryId: this.countryId,
                escalationType: 1,
                limit: limit,
                offset: offset,
                type: threadSortType,
                orderBy: threadOrderType,
                optionFilter: this.optionFilter,
                filterOptions: filterData,
                searchText: searchValue,
                filterrecords: setdata.filterrecords,
              };
              this.knowledgeArticleListArray =
                kaAction == "push" ? this.knowledgeArticleListArray : [];
              this.apiData = apiInfo;
              this.loadingKnowledgeArticle = kaAction == "push" ? false : true;

              if (kaAction == "push") {
                this.loadKnowledgeArticlePage(true);
                setTimeout(() => {
                  if (this.top != undefined) {
                    this.top.nativeElement.scroll({
                      top: 0,
                      left: 0,
                      behavior: "auto",
                    });
                  }
                }, 1000);
              } else {
                this.catId = setdata.catId != '' && setdata.catId != null && setdata.catId != undefined ? setdata.catId : '';
                this.catName = setdata.catName != '' && setdata.catName != null && setdata.catName != undefined ? setdata.catName : '';

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

              this.onInitload = kaAction == "push" ? false : true;
            }
          }
        }
      })
    );

    this.subscription.add(
      this.sharedSvc.knowledgeArticleDataReceivedSubject.subscribe(
        (knowledgeData) => {

          console.error("knowledgedata", knowledgeData, this.apiData);
          if(knowledgeData["filterOptions"].workstream)
          {
            this.workstreamFilterArrData= knowledgeData["filterOptions"].workstream;
          }

          this.loadingKnowledgeArticle = true;
          this.knowledgeArticleListArray = [];
          this.callFromWS = true;
          this.itemOffset = 0;
          this.itemLength = 0;

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
          if(this.accessFrom == 'landing') {


            this.scrollTop = 0;
            let id = 'thread-data-container';
            this.scrollToElem(id);
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

    this.getnorows();
    setTimeout(() => {
      if (this.teamSystem) {
        this.midHeight = windowHeight.height - 20;
      } else {
        console.error("611------", this.midHeight, this.pageDataInfo);
        let ht = 0;
        if (this.accessFrom == "landing") {
          ht -= 62;
          this.midHeight = windowHeight.height - (140 + ht);
        } else if (this.accessFrom == "search") {
          this.midHeight = windowHeight.height - (110 + ht);
        } else {
          this.midHeight = windowHeight.height - (73 + ht);
        }
      }
    }, 100);

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

    this.checkAccessLevel();

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
  threadClick(knowledgeArticle) {
    /*$(".bg-image-new-thread" + knowledgeArticle.threadId + "").removeClass(
      "newthreadnotify"
    );

    if (this.domainId == 1 || this.domainId == 60 || this.userId == 100) {
      var aurl =
        forumPageAccess.knowledgeArticlePageNew + knowledgeArticle.threadId;
    } else {
      var aurl =
        forumPageAccess.knowledgeArticlePageNew + knowledgeArticle.threadId;
    }

    let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' knowledgearticles') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    this.router.navigate([aurl]);
    */
    this.openDetailView(knowledgeArticle.threadId);
  }

  openDetailView(id){
    const modalRef = this.modalService.open(ViewKaDetailComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.knowledgeArticleId = id;
    let KACategoryOption = localStorage.getItem('KACategoryOption');
    if( KACategoryOption == "1"){
      localStorage.setItem('kaCatID',this.catId);
      localStorage.setItem('kaCatName',this.catName);
    }
    modalRef.componentInstance.KAServices.subscribe((receivedService) => {
      console.log(receivedService);
      modalRef.dismiss('Cross click');
      if(receivedService['action'] == 'delete'){
        setTimeout(() => {
          let threadIndex = this.knowledgeArticleListArray.findIndex(option => option.threadId == id);
          this.knowledgeArticleListArray.splice(threadIndex, 1);
          this.itemTotal -= 1;
          this.itemLength -= 1;
          this.masonry.reloadItems();
          this.masonry.layout();
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 750);
        }, 1000);
      }
      if(receivedService['action'] == 'workstream-select'){
        receivedService['wdata'];
        this.itemOffset =0;
        this.knowledgeArticleListArray = [];
        console.log(JSON.parse(this.apiData["filterOptions"]) );
        let apiFilterOpt = JSON.parse(this.apiData["filterOptions"]);
        apiFilterOpt.workstream.push(receivedService['wdata']);
        this.apiData["filterOptions"] = JSON.stringify(apiFilterOpt);
        console.log(this.apiData["filterOptions"]);
        localStorage.setItem("knowledgeArticleFilter",this.apiData["filterOptions"]);
        let KACategoryOption = localStorage.getItem('KACategoryOption');
        if( KACategoryOption == "1"){
          let cdata = {
            cid: this.catId,
            cname: this.catName,
            filterUpdate: '1'
          }
          this.apiUrl.knowledgeArtCall = "1";
          this.sharedSvc.emitKnowledgeCatListData(cdata);
        }

        this.loadKnowledgeArticlePage();
      }
      setTimeout(() => {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove("view-modal-popup");
        let title = PageTitleText.KnowledgeArticles;
        this.titleService.setTitle( localStorage.getItem('platformName')+' - '+title);
        }, 100);
    });
  }

  loadCatKAList(){
    this.loadingKnowledgeArticle = true;
    this.centerloading = false;
    let cdata = {
      cid: "-1",
      cname: ""
    }
    this.apiUrl.knowledgeArtCall = "1";
    this.sharedSvc.emitKnowledgeCatListData(cdata);
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
    console.log(this.scrollTop, this.lastScrollTop, this.scrollInit)
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
        if(!this.loadingKnowledgeArticlemore && !this.initLoadKAPage) {
          this.loadingKnowledgeArticlemore = true;
          this.loadKnowledgeArticlePage();
        }
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
      let KACategoryOption = localStorage.getItem('KACategoryOption');
      if( KACategoryOption == "1" && (this.pageDataInfo == pageInfo.knowledgeArticlePage) ){
        this.breadCrumbEnable = true;
      }
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      let bheight = (this.breadCrumbEnable) ? 30 : 0;
      let ht = headerHeight + bheight;
      if (this.accessFrom == "landing") {
        ht -= 44;
        this.midHeight = windowHeight.height - (140 + ht);
      } else if (this.accessFrom == "search") {
        this.midHeight = windowHeight.height - (110 + ht);
      } else {
        this.midHeight = windowHeight.height - (73 + ht);
      }
      //this.getnorows();
    }, 100);
  }
  getnorows() {
    let x = 200;
    let xy = 248;
    var elmnt = document.getElementById("thread-data-container");
    let itemLimitwidth = elmnt.offsetWidth / xy;
    let totalrows = Math.trunc(itemLimitwidth);
    let itemLimit1 = window.innerHeight / x;
    let totalCols = Math.trunc(itemLimit1);

    this.itemwidthLimit = totalrows * totalCols;
    console.log(this.itemwidthLimit + "-itemWidth");

    if (totalrows > 3) {
      var newrows = 2;
      this.itemLimit = newrows * totalCols;
      if (this.itemLimit <= 9) {
        this.itemLimit = 10;
      }
    } else {
      this.itemLimit = totalrows * totalCols;
      if (this.itemLimit <= 9) {
        this.itemLimit = 10;
      }
    }

  }
  updateSearchKeyword(keyword)
  {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("keyword", keyword);
    apiFormData.append("userId", this.userId);

    this.LandingpagewidgetsAPI.apiUpdateSearchKeyword(apiFormData).subscribe((response) => {

    });


  }
  loadKAPageSolr(searchValue,listingSolr=0)
  {
    let searchParams = '';
    let apiData = {

      "query": searchValue,
      "rows": this.itemLimit,
      "start": this.itemOffset,
      "listing":listingSolr,
      "filters": {"domainId":this.apiData["domainId"]},
      "type":6
      //filters: {},

    };

    if(this.workstreamFilterArrData && listingSolr) {
     apiData["filters"]["workstreamsIds"]=this.workstreamFilterArrData;
    } else {
      let userWorkstreams=localStorage.getItem('userWorkstreams');
      if(userWorkstreams) {
        apiData["filters"]["workstreamsIds"]=JSON.parse(userWorkstreams);
      }
    }

    if((this.accessFrom == 'landing' && this.collabticDomain)) {
      let wsArr = [];
      let landingWorkstream = localStorage.getItem('workstreamItem');
      console.log(landingWorkstream)
      wsArr.push(landingWorkstream);
      console.log(wsArr)
      apiData["filters"]["workstreamsIds"] = (listingSolr == 1) ? apiData["filters"]["workstreamsIds"] : wsArr;
    }

    if(this.fromSearchPage) {
      searchParams = this.apiData["filterOptions"];
      searchParams = (searchParams == null || searchParams == undefined  || searchParams == 'undefined') ? localStorage.getItem(filterNames.search) : searchParams;
      let searchparamsjson = '';
      if(searchParams != ''){
        searchparamsjson =  ((JSON.parse(searchParams)));
        if(searchparamsjson && searchparamsjson['make'] && searchparamsjson['make']!='')
        {
          apiData["filters"]["make"]=searchparamsjson['make'];
        }
        if(searchparamsjson && searchparamsjson['model'] && searchparamsjson['model']!='')
        {
          apiData["filters"]["model"]=searchparamsjson['model'];
        }
        if(searchparamsjson && searchparamsjson['workstream'] && searchparamsjson['workstream']!='')
        {
          apiData["filters"]["workstreamsIds"]=searchparamsjson['workstream'];
        }
        if(searchparamsjson && searchparamsjson['errorCode'] && searchparamsjson['errorCode']!='')
        {
          apiData["filters"]["currentDtcStrArr"]=searchparamsjson['errorCode'];
        }
      }
    }

    if(listingSolr) {
      if(this.itemOffset==0) {
        let workstreamFilterArr;
        if(this.workstreamFilterArrData) {
          workstreamFilterArr=apiData["filters"]["workstreamsIds"]
        }
        else {
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
        apiDatasocial.append('contentTypeId', '7');
        let platformIdInfo = localStorage.getItem('platformId');

        this.baseSerivce.postFormData("forum", "resetWorkstreamContentTypeCount", apiDatasocial).subscribe((response: any) => { })
      }
    }
    if(!listingSolr && this.itemOffset == 0) {
      this.updateSearchKeyword(searchValue);
    }

     this.LandingpagewidgetsAPI.getSolrDataDetail(
      apiData
    ).subscribe((response) => {
      this.initLoadKAPage = false;
      this.searchLoading = false;
      this.searchnorecordflag = false;
      let rtdata = response.articlesData;
      let threadInfototal = response.total;
      let facets = response.facets;
      let type = facets.type;
      if(this.fromSearchPage) {
        this.searchResultData.emit(facets);
      } else {
        this.searchResultData.emit(type);
      }

     // let newThreadInfoText = response.newInfoText;
      //this.newThreadInfo = newThreadInfoText;
      this.redirectionPage = RedirectionPage.KnowledgeArticles;
      this.pageTitleText = PageTitleText.KnowledgeArticles;
      this.contentTypeValue = ContentTypeValues.KnowledgeArticles;
      this.contentTypeDefaultNewImg = DefaultNewImages.KnowledgeArticles;
      this.contentTypeDefaultNewText = DefaultNewCreationText.KnowledgeArticles;

      let threadInfoData = rtdata;
      this.itemTotal = threadInfototal;

      if (this.itemTotal > 0) {
        this.loadingKnowledgeArticle = false;
        let loadItems = false;
        let action = 'init';
        let initIndex = -1;
        this.displayNoRecords = false;
        this.displayNoRecordsDefault = false;
        this.displayNoRecordsShow = 0;
        this.itemOffset += this.itemLimit;
          this.scrollCallback = false;
          this.scrollInit = 1;
          this.itemLength += threadInfoData.length;
          if(threadInfoData.length>0){
            this.scrollCallback = true;
          }
       let push = false;
        for (let t = 0; t < threadInfoData.length; t++) {
          this.setupKAData(action, push, threadInfoData[t], initIndex);
        }
if (
            this.itemOffset < this.itemwidthLimit &&
            threadInfoData.length > 0 &&
            threadInfoData.length > 9 && this.itemTotal > this.itemLength
          ) {
            this.initLoadKAPage = true;
            setTimeout(() => {
              this.loadingKnowledgeArticlemore = true;
              this.loadKnowledgeArticlePage();
              this.centerloading = true;
            }, 1000);
          } else {
            //this.initLoadKAPage = true;
            this.centerloading = false;
            this.loadingKnowledgeArticlemore = false;
          }
        setTimeout(() => {
          this.masonryReloadUpdate();
        }, 2000);
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 2700);
      }
      else{
        this.displayNoRecords = true;
        this.displayNoRecordsDefault = false;
        this.loadingKnowledgeArticle = false;
        this.centerloading = false;
        this.loadingKnowledgeArticlemore = false;
        this.updateMasonryLayout = true;
        this.opacityFlag = false;
        if(this.pageDataInfo == 2){
          this.displayNoRecordsShow = (this.apiUrl.searchFromWorkstream) ? 1 : 2;
        }
      }
      console.log('solrtext',response);
    });
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(7, chkType, chkFlag);
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
        console.log(this.accessLevel)

      }, 700);
  }

  loadKnowledgeArticlePage(push = false, obj = {}, callFromOuter = false, limit = '') {
    let solrUpdate=0;
    let listingSolr=0;
    let searchValue = localStorage.getItem("searchValue");
    console.log(push, this.apiData["filterrecords"]);
    if (
      searchValue &&
      (searchValue != undefined ||
        searchValue != "undefined" ||
        searchValue != null)
    ) {
      searchValue = localStorage.getItem("searchValue");
    } else {
      searchValue = "";
    }

    if(this.fromSearchPage) {
      solrUpdate=1;
      listingSolr=0;

      let platformIdInfo = localStorage.getItem('platformId');
      if(this.apiUrl.enableAccessLevel){
          setTimeout(() => {
            if(!this.accessLevel.view){
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = false;
              this.searchLoading = false;
              this.displayNoRecordsShow = 5;
              this.loadingKnowledgeArticle = false;
              this.centerloading = false;
              this.loadingKnowledgeArticlemore = false;
              this.updateMasonryLayout = true;
              return false;
            }
            else{
              this.loadKAPageSolr(searchValue);
            }
          }, 1000);
        }
        else{
          this.loadKAPageSolr(searchValue);
        }
    } else if (this.pageDataInfo == pageInfo.workstreamPage && this.collabticDomain || (this.CBADomain && this.apiUrl.searchFromWorkstream)) {
      solrUpdate = 1;
      listingSolr = (this.apiUrl.searchFromWorkstreamValue == '') ? 1 : 0;
      searchValue = this.apiUrl.searchFromWorkstreamValue;

      let platformIdInfo = localStorage.getItem('platformId');
        if(platformIdInfo=='1' && this.apiUrl.enableAccessLevel){
          setTimeout(() => {
            if(!this.accessLevel.view){
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = false;
              this.displayNoRecordsShow = 5;
              this.loadingKnowledgeArticle = false;
              this.centerloading = false;
              this.loadingKnowledgeArticlemore = false;
              this.updateMasonryLayout = true;
              return false;
            }
            else{
              this.loadKAPageSolr(searchValue,listingSolr);
            }
          }, 1000);
        }
        else{
          this.loadKAPageSolr(searchValue,listingSolr);
        }
    } else {
      solrUpdate=0;
      //this.apiData['limit'] = this.itemLimit;
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiData["apiKey"]);
      apiFormData.append("domainId", this.apiData["domainId"]);
      apiFormData.append("countryId", this.apiData["countryId"]);
      apiFormData.append("userId", this.apiData["userId"]);
      let platformId = localStorage.getItem('platformId');
      if(this.pageDataInfo == pageInfo.knowledgeArticlePage){
        if(this.catId == "-1"){
          apiFormData.append("categoryId", "");
        }
        else if(this.catId == "0"){
          apiFormData.append("categoryId", "");
        }
        else {
          apiFormData.append("categoryId", this.catId);
        }
      }

      if (push == true) {
        let itemLimit:any = (limit == '') ? 1 : limit;
        apiFormData.append("limit", itemLimit);
        this.apiData["offset"] = 0;
      } else {
        this.apiData["limit"] = this.itemLimit;
        apiFormData.append("limit", this.apiData["limit"]);
        this.apiData["offset"] = this.itemOffset;
      }
      apiFormData.append("offset", this.apiData["offset"]);
      if(this.apiData["offset"] == 0 && !this.fromSearchPage ){
        this.knowledgeArticleListArray = [];
      }
      apiFormData.append("type", this.apiData["type"]);
      apiFormData.append("orderBy", this.apiData["orderBy"]);
      if (searchValue && this.fromSearchPage) {
        apiFormData.append("searchText", searchValue);
        if (this.KAarrayIdInfo && this.KAarrayIdInfo.length > 0) {

          apiFormData.append("threadCount", this.KAAPICount);

          apiFormData.append("threadIdArray",JSON.stringify(this.KAarrayIdInfo));

        }
        if (this.priorityIndexValue) {

          apiFormData.append("priorityIndex", this.priorityIndexValue);
        } else {

          apiFormData.append("priorityIndex", "1");
        }
      }
      else{
        localStorage.setItem('KACategoryEnable',"0");
      }

      apiFormData.append("platform", "3");
      if (this.pageDataInfo == pageInfo.workstreamPage) {
        this.accessLazyLoad = RedirectionPage.Workstream;
        apiFormData.append("optionFilter", this.apiData["optionFilter"]);
      }
      if (push == true) {
        apiFormData.append("filterOptions", localStorage.getItem("knowledgeArticleFilter"));
      } else if (this.apiData["filterOptions"] && !this.callFromWS) {
        apiFormData.append("filterOptions", this.apiData["filterOptions"]);
      } else if (this.callFromWS) {
        let objFilter = {};
        if (!obj["filterOptions"]) {
          objFilter = {
            ...JSON.parse(localStorage.getItem("knowledgeArticleFilter")),
            ...this.apiData["filterOptions"],
          };
        } else {
          objFilter = {
            ...JSON.parse(localStorage.getItem("knowledgeArticleFilter")),
            ...obj["filterOptions"],
          };
        }

        console.error("ab", objFilter);
        apiFormData.append("filterOptions", JSON.stringify(objFilter));
        this.apiData["filterOptions"] = objFilter;
      }
      console.error(apiFormData);
      console.log(apiFormData);
      this.knowledgeArticleAPIcall =
        this.LandingpagewidgetsAPI.getKnowledgeArticleList(apiFormData).subscribe(
          (response) => {
            this.initLoadKAPage = false;
            let rstatus = response.status;

            let rresult = response.result;
            let rtdata = response.articlesData;
            let threadInfototal = response.total;
          // let newThreadInfoText = response.newInfoText;
            //this.newThreadInfo = newThreadInfoText;
            this.redirectionPage = RedirectionPage.KnowledgeArticles;
            this.pageTitleText = PageTitleText.KnowledgeArticles;
            this.contentTypeValue = ContentTypeValues.KnowledgeArticles;
            this.contentTypeDefaultNewImg = DefaultNewImages.KnowledgeArticles;
            this.contentTypeDefaultNewText = DefaultNewCreationText.KnowledgeArticles;
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

        if(searchValue && this.fromSearchPage) {
          this.KAAPICount=response.total;
          let priorityIndexValue = response.priorityIndexValue;
          let threadIdArrayInfo = response.kaInfoArray;
          if (threadIdArrayInfo) {
            for (let t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
              this.KAarrayIdInfo.push(threadIdArrayInfo[t1]);
              let ki = this.KAarrayIdInfo.findIndex(option => option.threadId == threadIdArrayInfo[t1].threadId);
              if(ki < 0) {
              //this.KAarrayIdInfo.push(threadIdArrayInfo[t1]);
              }
            }
          }

          if (priorityIndexValue < "4" && priorityIndexValue) {
            let limitoffset = this.itemOffset + this.itemLimit;
            if (response.total == 0 || limitoffset >= response.total) {
              priorityIndexValue = parseInt(priorityIndexValue) + 1;
              this.priorityIndexValue = priorityIndexValue.toString();
              this.itemOffset = 0;
              this.loadKnowledgeArticlePage();
            }
          }
        }
          this.callForResize();
          let threadInfoData = rtdata;
          this.itemTotal = threadInfototal;

          if (threadInfototal == 0 && this.apiData["offset"] == 0 && response.priorityIndexValue == 4) {
            if(searchValue && this.fromSearchPage) {

              if(this.knowledgeArticleListArray.length>0){
                // array not empty
              }
              else{
                this.displayNoRecords = true;
                this.displayNoRecordsDefault = false;
                this.displayNoRecordsShow = 1;
                this.loadingKnowledgeArticle = false;
                this.centerloading = false;
                this.loadingKnowledgeArticlemore = false;
                this.updateMasonryLayout = true;
              }
            } else {
              let teamSystem = localStorage.getItem("teamSystem");
              if (teamSystem) {
                if (this.apiData["type"] != "sortthread") {
                  this.displayNoRecords = true;
                  this.displayNoRecordsDefault = false;
                  this.displayNoRecordsShow =  (this.apiData["filterrecords"]) ? 1 : 2;
                  this.loadingKnowledgeArticle = false;
                  this.centerloading = false;
                  this.loadingKnowledgeArticlemore = false;
                  this.updateMasonryLayout = true;
                } else {
                  this.displayNoRecords = false;
                  this.displayNoRecordsShow =  (this.apiData["filterrecords"]) ? 1 : 2;
                  this.contentTypeDefaultNewTextDisabled = true;
                }
                this.displayNoRecordsDefault = true;
              } else {
                this.displayNoRecords = true;
                this.displayNoRecordsDefault = true;
                this.displayNoRecordsShow =  (this.apiData["filterrecords"]) ? 1 : 2;
                this.loadingKnowledgeArticle = false;
                this.centerloading = false;
                this.loadingKnowledgeArticlemore = false;
                this.updateMasonryLayout = true;
                if (this.accessFrom == "landing") {
                  this.displayNoRecordsShow = 1;
                }
              }
            }
          } else {
            this.displayNoRecords = false;
            this.displayNoRecordsDefault = false;
            this.displayNoRecordsShow = 0;
          }

          if (threadInfoData.length > 0) {
            this.loadingKnowledgeArticle = false;
            let loadItems = false;
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
            }, 2700);
          } else {
            if(this.knowledgeArticleListArray.length>0){

              setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                // this.loadingthread = false;
              // this.loadingthreadmore = false;
                this.updateMasonryLayout = true;
              }, 2000);
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 2700);

            }
            else{
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = false;
              this.loadingKnowledgeArticle = false;
              this.centerloading = false;
              this.loadingKnowledgeArticlemore = false;
              this.updateMasonryLayout = true;
              this.opacityFlag = false;
              if(this.pageDataInfo == 2){
                this.displayNoRecordsShow = (this.apiUrl.searchFromWorkstream) ? 1 : 2;
              }
            }
          }
          if (
            this.itemOffset < this.itemwidthLimit &&
            threadInfoData.length > 0 &&
            threadInfoData.length > 9 && this.itemTotal > this.itemLength
          ) {
            this.initLoadKAPage = true;
            setTimeout(() => {
              this.loadingKnowledgeArticlemore = true;
              this.loadKnowledgeArticlePage();
              this.centerloading = true;
            }, 1000);
          } else {
            //this.initLoadKAPage = true;
            this.centerloading = false;
            this.loadingKnowledgeArticlemore = false;
          }

          console.log(threadInfoData, this.pageDataInfo, this.pageInfo)
          console.log(this.accessFrom)

          if(threadInfoData.length == 0 && (this.pageDataInfo == this.pageInfo || this.accessFrom == 'landing') && this.apiData["offset"] == 0){
            console.log(this.apiData["filterrecords"]);
            console.log(this.pageDataInfo);
            this.displayNoRecords = true;
            this.displayNoRecordsDefault = true;
            if(this.apiData["filterrecords"]==undefined && this.accessFrom == 'landing'){
              this.displayNoRecordsShow = 2;
            }
            else{
              this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;
            }
          }

          if(!this.searchnorecordflag && this.knowledgeArticleListArray.length > 0 ){
            this.displayNoRecords = false;
            this.displayNoRecordsDefault = false;
          }

          this.itemOffset += this.itemLimit;
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.itemLength += threadInfoData.length;
        /*  let currUrl = this.router.url.split('/');
          let navFrom = currUrl[1];
          let wsResData = {
            access: 'knowledge-articles'
          }
          if(navFrom != 'knowledge-articles') {
            this.sharedSvc.emitWorkstreamListData(wsResData);
          }
        */

          console.log(threadInfoData);
        console.log(this.apiData["filterrecords"]);
        }
      );
    }
  }

  masonryReloadUpdate() {
    this.loadingKnowledgeArticle = false;
    this.loadingKnowledgeArticlemore = false;
    this.opacityFlag = false;
    this.masonry.reloadItems();
    this.masonry.layout();
    this.updateMasonryLayout = true;

    if(this.knowledgeArticleListArray.length>0){
      this.displayNoRecords = false;
    }

  }

  setupKAData(action, push, threadInfoData, index = 0) {
    let createdOnNew = threadInfoData.createdOn;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    let localcreatedOnDate = moment(createdOnDate)
      .local()
      .format("MMM DD, YYYY . h:mm A");
    let obj = {
      threadId: threadInfoData.threadId,
      threadTitle: this.authenticationService.convertunicode(
        this.authenticationService.ChatUCode(
          threadInfoData.threadTitle
        )
      ),
      threadStatus: threadInfoData.threadStatus,
      threadStatusBgColor: threadInfoData.threadStatusBgColor,
      threadBannerImage: threadInfoData.bannerImage,
      bannerOption: threadInfoData.bannerOption,
      isDefaultImg: threadInfoData.isDefaultImg,
      threadDescription: threadInfoData.description,
      threadUserRole: threadInfoData.userRole,
      threadStatusColorValue:
        threadInfoData.threadStatusColorValue,
      profileImage: threadInfoData.profileImage,
      availability: threadInfoData.availability,
      badgeStatus: threadInfoData.badgeStatus,
      userName: threadInfoData.userName,
      createdOn: localcreatedOnDate,
      make: threadInfoData.genericProductName,
      model: threadInfoData.model,
      currentDtc: threadInfoData.currentDtc,
      curentDtclength: threadInfoData?.currentDtc?.length
        ? threadInfoData?.currentDtc?.length
        : 0,
      viewCount: threadInfoData.viewCount,
      likeCount: threadInfoData.likeCount,
      pinCount: threadInfoData.pinCount,
      replyCount: threadInfoData.comment,
      closeStatus: threadInfoData.closeStatus,
      newThreadTypeSelect: threadInfoData.newThreadTypeSelect,
      fixStatus: threadInfoData.fixStatus,
      fixPostStatus: threadInfoData.fixPostStatus,
      postId: threadInfoData.postId,
      likeStatus: threadInfoData.likeStatus,
      shareFix:
        threadInfoData.newThreadTypeSelect == "share"
          ? true
          : false,
      pinStatus: threadInfoData.pinStatus,
      uploadContents: threadInfoData.uploadContents,
      moreAttachments: threadInfoData.uploadContents?.length
        ? true
        : false,
      newNotificationState: "",

      state: "active",
    };
    if (push == true && index < 0) {
      obj["newNotificationState"] = "newthreadnotify";
      this.knowledgeArticleListArray.unshift(obj);
    } else {
      this.knowledgeArticleListArray.push(obj);
      let ki = this.KAarrayIdInfo.findIndex(option => option.threadId == obj.threadId);
      if(ki < 0) {
        this.KAarrayIdInfo.push(obj.threadId);
      }
    }

    setTimeout(() => {
      this.masonry.reloadItems();
      this.masonry.layout();
      // this.loadingthread = false;
     // this.loadingthreadmore = false;
      this.updateMasonryLayout = true;
    }, 2000);
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 2700);

  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    console.log(secElement, this.scrollTop)
    secElement.scrollTop = this.scrollTop;
    this.opacityFlag = false;
  }

  ngOnDestroy() {
    localStorage.removeItem('kaCatID');
    localStorage.removeItem('kaCatName');
    this.subscription.unsubscribe();
  }
}
