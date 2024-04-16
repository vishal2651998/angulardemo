import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { PlatFormType, pageInfo, pageTitle, PageTitleText, Constant, IsOpenNewTab, ChatType, LocalStorageItem, DefaultNewImages, DefaultNewCreationText, filterNames, RedirectionPage, ContentTypeValues } from "src/app/common/constant/constant";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ProductHeaderComponent } from "src/app/layouts/product-header/product-header.component";
import { AdasListComponent } from 'src/app/components/common/adas-list/adas-list.component';
import { PlatformLocation } from "@angular/common";
import { Subscription } from "rxjs";
declare var $: any;

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  productHeaderRef: ProductHeaderComponent;
  adasPageRef: AdasListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title = "Workstream";
  public displayNoRecordsShow = 3;
  public newThreadInfo =
    "Tap on the ‘Go to Chat’ button to open the chat page.";
  public contentTypeDefaultNewImg = DefaultNewImages.chatPage;
  public contentTypeDefaultNewText = DefaultNewCreationText.chatpage;
  public contentTypeDefaultNewTextDisabled = false;
  public contentTypeValue = 1;
  public createThreadUrl = "";
  public teamSystem = localStorage.getItem("teamSystem");
  public headerData: Object;
  public outputContentTypedata: object;
  public outputContentFromLeftMenu: object;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public pageData = pageInfo.workstreamPage;
  public headerFlag: boolean = false;
  public viewFlag: boolean = false;
  public threadThumbView: boolean;
  public user: any;
  public userId;
  public loadLeftside = true;
  public menuListloaded;
  public getcontentTypesArr = [];
  public roleId;
  public filterOptions;
  public apiData: Object;
  public workstreamId;
  public currentContentTypeId: number = 0;
  public tapfromheader: boolean = false;
  public platformId: number = 0;
  public tvsFlag: boolean = false;
  pageAccess: string = "landingpage";
  public bodyClass: string = "landing-page";
  public bodyClass1: string = "knowledge-base";
  public bodyElem;
  public footerElem;
  public contentTypeWidthClass = "";
  public bodyHeight: number;
  public innerHeight: number = 0;
  public tabCount: number = 0;
  public searchValue: string = "";

  public collapseFlag: boolean = false;
  public rightPanel: boolean = true;
  public emptyFlag: boolean = true;
  public docLoading: boolean = true;
  public docLazyLoading: boolean = false;
  public docFile: boolean = true;
  public thumbView: boolean = true;
  public disableRightPanel: boolean = true;
  public threadThumbInit: number = 0;
  public threadInfo: any;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  folders = [];
  files = [];
  scrollCount: number = 0;
  public docDetail: any = [];
  public partData = {
    accessFrom: "landing",
    action: "get",
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: "",
    publishStatus: 1,
    section: 1,
    thumbView: true,
    userId: 0,
    partType: "",
    searchVal: "",
    tabCount: 0,
    actionRightPanel:"0"
  };

  public docData = {
    accessFrom: this.pageAccess,
    action: "files",
    domainId: 0,
    countryId: "",
    expandFlag: this.rightPanel,
    filterOptions: [],
    thumbView: this.thumbView,
    searchVal: "",
    userId: 0,
    partType: "",
    headerFlag: this.headerFlag,
    tabCount: 0
  };

  public directoryInfoData: any;

  public isOn1:boolean=false;
  public isOn2:boolean=false;
  public isOn3:boolean=false;
  public isOn4:boolean=false;
  public isOn5:boolean=false;
  public isOn6:boolean=false;
  public isOn7:boolean=false;
  public CBADomian: boolean = false;
  public ColabticDomain: boolean = false;
  public collabticFixes: boolean = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private apiUrl: ApiService,
    private plocation: PlatformLocation,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );

    this.plocation.onPopState (() => {

      let url = this.router.url.split('/');
      console.log(this.currentContentTypeId)
      if(url[1] == RedirectionPage.Search)  {
        switch(this.currentContentTypeId) {
         /* case 4:
            this.apiUrl.searchPageDocRedirectFlag = "1";
            break;*/
          case 7:
            this.apiUrl.searchPageKARedirectFlag = "1";
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    //this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.partData["domainId"] = this.domainId;
    this.partData["countryId"] = this.countryId;
    this.partData["userId"] = this.userId;
      
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      this.contentTypeWidthClass = "contentTypeWidthClass";
    }
    this.platformId =
      platformId == "undefined" || platformId == undefined
        ? this.platformId
        : parseInt(platformId);
    this.tvsFlag = this.platformId == 2 && this.domainId == 52 ? true : false;
    this.partData.publishStatus = this.tvsFlag ? 1 : 3;
    this.CBADomian = (platformId == PlatFormType.CbaForum) ? true : false;
    this.ColabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.collabticFixes = (this.ColabticDomain && this.domainId == 336) ? true : false;

    this.commonService.emitOnCloseDetailPageCollapseSubject.subscribe((r) => {
      if(this.emptyFlag){
        this.collapseFlag=true;
        this.emptyFlag=false;
        setTimeout(() => {
          this.emptyFlag=true;
        },1);
      }
      else{
        if(this.currentContentTypeId == 4){
          if(!this.emptyFlag){
            this.collapseFlag = false;
            this.commonService.emitDocScrollCallData('');
          }
        }
      }
      let data = {
        'currentContentTypeId' : this.currentContentTypeId,
        'flag' : true
      }
      //alert("wspage")
      this.commonService.emitThreadsPageLoadingSymbolCallData(data);
    });

    this.commonService._OnMessageReceivedSubject.subscribe((r) => {
      console.log(r);
      var setdata = JSON.parse(JSON.stringify(r));
      if(setdata.pushType == 23) {
        return false;
      }
      this.loadLeftside = false;
      this.viewFlag = (!this.collabticFixes && (this.currentContentTypeId == 2 || this.currentContentTypeId == 4 || this.currentContentTypeId == 53)) ? true : false;
      if(this.currentContentTypeId == 2 || this.currentContentTypeId == 4) {
        let listView = localStorage.getItem("threadViewType");
        this.threadThumbView = (listView && listView == "thumb") ? true : false;
        this.threadInfo = {
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit
        }
      }

      if ( this.currentContentTypeId == 53) {
        this.threadThumbView = true;
      }

      if ( this.currentContentTypeId == 5) {
        let rflag: any = r;
        this.rightPanel = rflag;
        this.collapseFlag = !rflag;
        if(this.collapseFlag){
          $('.center-middle-width-container').addClass('adding-width-10');
        }
        else{
          $('.center-middle-width-container').removeClass('adding-width-10');
        }
      }
    });

    this.subscription.add(
      this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => {
        console.log(r);
        console.log(this.currentContentTypeId)
        let flag: any = r;
        this.collapseFlag = !flag;
        if(this.collapseFlag){
          $('.center-middle-width-container').addClass('adding-width-10');
        }
        else{
          $('.center-middle-width-container').removeClass('adding-width-10');
        }
        switch(this.currentContentTypeId) {
          case 4:
            //this.rightPanel = !flag;
            //this.collapseFlag = !flag;
            break;
          case 53:
            if(this.adasPageRef.view < 4) {
              this.adasPageRef.updateLayout();
            } else {
              this.adasPageRef.adasFilesRef.updateLayout();
            }
            break;  
        }
        console.log(this.collapseFlag);

      })
    );

    this.subscription.add(
      this.commonService.documentPanelFlagReceivedSubject.subscribe(
        (response) => {
          console.log(response)
          let flag = response["flag"];
          let access = response["access"];
          switch (access) {
            case "documents":
              this.docDetail = [];
              this.rightPanel = !flag;
              break;
            default:
              this.docDetail = response["docData"];
              console.log(this.rightPanel);
              if (!this.rightPanel) {
                this.collapseFlag = false;
                $('.center-middle-width-container').removeClass('adding-width-10');
                this.rightPanel = true;
              } else {
                this.collapseFlag = false;
                $('.center-middle-width-container').removeClass('adding-width-10');
              }
              if (this.emptyFlag) {
                this.emptyFlag = false;
              } else {
                //this.emptyFlag = true;
                this.emitDocInfo(this.docDetail);
              }
              console.log(this.rightPanel, this.emptyFlag);
              break;
          }
        }
      )
    );

    this.subscription.add(
      this.commonService.workstreamListDataReceivedSubject.subscribe((response) => {
        console.log(response)
        this.getcontentTypesArr.forEach((item) => {
          item.disabled = false;
        });
      })
    );

    this.subscription.add(
      this.commonService.directoryUserIdReceivedSubject.subscribe((data) => {
        this.emptyFlag = false;
        this.directoryInfoData = data;
        this.collapseFlag = false;
        if(!this.rightPanel){
          this.partData.actionRightPanel = "1";
        }
        else{
          this.partData.actionRightPanel = "0";
        }
        this.rightPanel = true;
        $('.center-middle-width-container').removeClass('adding-width-10');
        this.commonService.emitDirectoryUserData(data);
        this.partData.action = "toggle";
        this.commonService.emitDirectoryListData(this.partData);
      })
    );

    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      limit: "20",
      offset: "0",
    };

    this.apiData = apiInfo;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
      };

      this.sidebarActiveClass = {
        page: "landing-page",
        menu: "workstreams-page",
        pageInfo: pageInfo.workstreamPage
      };

      let getModifiedWsId:any = localStorage.getItem('workstreamModifiedId');
      if(getModifiedWsId != null) {
        //this.workstreamId = getModifiedWsId;
        //this.currentContentTypeId = getModifiedWsId;
        //localStorage.setItem('landing-page-workstream', getModifiedWsId);
      }

      //this.getHeadMenuLists();

      let menuListloaded = localStorage.getItem("wscontentTypeValues");
      let cmenuListloaded = localStorage.getItem("currentWorkstreamContents");
      menuListloaded = (cmenuListloaded == null) ? menuListloaded : cmenuListloaded;
      //console.log(menuListloaded+'--------storage');
      var menuListloadedArr = JSON.parse(menuListloaded);
      console.log(menuListloadedArr);
      if((this.CBADomian || this.ColabticDomain) && menuListloadedArr){
        if(menuListloadedArr[0].threadSubTypeData && menuListloadedArr[0].threadSubTypeData.length>1)
        {
          localStorage.setItem('threadSubTypeData',JSON.stringify(menuListloadedArr[0].threadSubTypeData));
        }
      }
      let rms = 0;
      let slugIndex, slug;
      for (let menu of menuListloadedArr) {
        if (menu.contentTypeId) {
          let urlpathreplace = menu.urlPath;
          let urlActivePathreplace = menu.urlActivePath;
          let submenuimageClass = menu.submenuimageClass;
          let urlpth = urlpathreplace.replace(".png", ".svg");
          let urlActivePath = urlActivePathreplace.replace(".png", ".svg");
          if (menu.contentTypeId != 20 && menu.contentTypeId != 23) {
            rms = rms + 1;
            if (this.currentContentTypeId == 0) {
              if (menu.contentTypeId) {
                this.currentContentTypeId = menu.contentTypeId;
              }
            }

            slugIndex = pageTitle.findIndex(option => option.name == menu.name);
            slug = (slugIndex >= 0) ? pageTitle[slugIndex].slug : '';
            if(menu.contentTypeId==4 && (this.domainId==52 || this.domainId==82))
            {
              slug='documents';
            }
            this.getcontentTypesArr.push({
              contentTypeId: menu.contentTypeId,
              name: menu.name,
              shortName: menu.shortName,
              slug: slug,
              urlPath: urlpth,
              urlActivePath: urlActivePath,
              isNew: menu.isNew,
              catCount: menu.catCount,
              submenuimageClass: submenuimageClass,
              searchCount: 0,
              //disabled: true,
              disabled: false,
              tabAction: menu.tabAction,
              tabComponent: menu.tabComponent,
              tabCount: menu.tabCount,
              tabshow: menu.tabshow,
              workstreamId: menu.workstreamId
            });
          }
          console.log(this.getcontentTypesArr, this.currentContentTypeId)
        }

        if (this.currentContentTypeId == 2) {
          this.viewFlag = (!this.collabticFixes) ? true : false;
          let listView = localStorage.getItem("threadViewType");
          this.threadThumbView = (listView && listView == "thumb") ? true : false;
          this.threadInfo = {
            pageView: this.threadThumbView,
            threadThumbInit: this.threadThumbInit
          }
          this.setCountReset(
            this.currentContentTypeId,
            menu.Catcount,
            menu.isNew
          );
        }
      }

      if (this.currentContentTypeId != 2) {
        //this.currentContentTypeId = menuListloadedArr[0].contentTypeId;
        let pushitem : InputChat = { id:menuListloadedArr[0].workstreamId,name:menuListloadedArr[0].name,chatType:ChatType.Workstream,profileImg:'',contentType:menuListloadedArr};
        this.RealoadChatPageData(pushitem);
      } else {
        let listView = localStorage.getItem("threadViewType");
        this.threadThumbView = ((listView && listView == "thumb")) ? true : false;
        this.threadInfo = {
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit
        }
      }
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  applySearch(action, data) {
    console.log(action, data)
    this.searchValue = data.searchVal;
    let apiCallAction = "ws";
    let clearFlag = false;
    switch(action) {
      case "emit":
        let contType = this.currentContentTypeId;
        console.log(contType)
        this.docData.searchVal = data.searchVal;
        this.partData.searchVal = data.searchVal;
        clearFlag = (data.searchVal == '') ? true : false;
        if(clearFlag) {
          this.docData.searchVal = '';
          this.partData.searchVal = '';
          let sdata = [];
          this.searchResultData(sdata, 'clear');
        }
        switch (contType) {
          case 4:
            this.getDocumentList(contType, apiCallAction);
            break;
          case 6:
            this.getGTSList(apiCallAction);
            break;
          case 7:
            this.getKAList(apiCallAction);
            break;
          case 11:
            this.getPartList(apiCallAction);
            break;
          case 16:
            this.getSibList(apiCallAction);
            break;
          case 28:
            this.getKBList(apiCallAction);
            break;
          case 53:
            this.adasPageRef.loading = true;
            this.adasPageRef.breadcrumbFlag = (this.searchValue != '') ? false : true;
            this.adasPageRef.view = (this.searchValue != '') ? 4 : 1;
            this.adasPageRef.resetFileData();
            setTimeout(() => {
              this.adasPageRef.getAdasItems();  
            }, 500);
            break;  
          default:
            let access = this.commonService.getContentType(contType);
            data['access'] = `${access}-ws`;
            console.log(data, access)
            this.commonService.emitSearchApiCall(data);
            break;
        }
        break;
    }
  }

  getDocumentList(Id, type = "") {
    this.currentContentTypeId = Id;
    let groupsData = [];
    this.docDetail = [];
    if (this.workstreamId) {
      groupsData.push(this.workstreamId);
    }

    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }

    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.docData.action = this.pageAccess;
    this.docData["filterOptions"] = filterOptions;

    setTimeout(() => {
      if (type == "ws") {
        this.commonService.emitDocumentWsApiCallData(this.docData);
      } else {
        this.commonService.emitDocumentApiCallData(this.docData);
      }
      console.log(6546, this.docData)
      //this.commonService.emitDocumentApiCallData(this.docData);
    }, 50);
  }

  RealoadChatPageData(item: any) {
    //this.currentContentTypeId=0;
    //alert(this.currentContentTypeId);
    this.tabCount = 0;
    console.log(this.tabCount, item)
    let catisNew=false;
    let cat_catisNew=0;

    this.workstreamId = item.id;
    let wscheck = 0;
    item.contentType.forEach((citem, cindex) => {
      if(this.getcontentTypesArr.length > cindex) {
        console.log(this.getcontentTypesArr, cindex)
        let scount = this.getcontentTypesArr[cindex].searchCount;
        scount = (scount == undefined || scount == 'undefined') ? 0 : scount;
        citem.searchCount = scount;
      }
    });
    if(item.contentType.length == 1) {
      let contId = item.contentType[0].contentTypeId;
      this.viewFlag = (!this.collabticFixes && (contId == 2 || contId == 4 || contId == 53)) ? true : false;
      if(contId == 2) {
        let listView = localStorage.getItem("threadViewType");
        this.threadThumbView = (listView && listView == "thumb") ? true : false;
        this.threadInfo = {
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit
        }
      }
      this.currentContentTypeId = contId;
      switch (parseInt(contId)) {
        case 5:
        case 6:
        case 11:
          item.contentType[0].searchCount = 0;
          this.getcontentTypesArr[0].searchCount = 0;
          break;
        case 53:
          this.threadThumbView = true;
          break;  
      }
    }
    this.getcontentTypesArr = [];
    console.log(item.contentType);
    this.outputContentTypedata = item.contentType;
    let rms = 0;
    for (let menu of item.contentType) {
      if (menu.contentTypeId) {
        let urlpathreplace = menu.urlPath;
        let urlActivePathreplace = menu.urlActivePath;
        let submenuimageClass = menu.submenuimageClass;
        let urlpth = urlpathreplace.replace(".png", ".svg");
        let urlActivePath = urlActivePathreplace.replace(".png", ".svg");
        if (menu.contentTypeId != 20 && menu.contentTypeId != 23) {
          rms = rms + 1;
          if (rms == 1) {
            if (this.currentContentTypeId == 0) {
              this.currentContentTypeId = menu.contentTypeId;
              catisNew=menu.isNew;
              cat_catisNew=menu.catCount;

            }
            else
            {

            }
          }
          if(this.currentContentTypeId==1)
          {
          this.currentContentTypeId = (this.currentContentTypeId == 1 && item.contentType.length == 1) ? this.currentContentTypeId :  item.contentType[0].contentTypeId;
          }
          this.viewFlag = (!this.collabticFixes && (this.currentContentTypeId == 2 || this.currentContentTypeId == 4 || this.currentContentTypeId == 53)) ? true : false;
          if(this.currentContentTypeId == 2) {
            let listView = localStorage.getItem("threadViewType");
            this.threadThumbView = (listView && listView == "thumb") ? true : false;
            this.threadInfo = {
              pageView: this.threadThumbView,
              threadThumbInit: this.threadThumbInit
            }
          }

          console.log(this.currentContentTypeId);
          let slugIndex = pageTitle.findIndex(option => option.name == menu.name);
          let slug = (slugIndex >= 0) ? pageTitle[slugIndex].slug : '';
          if(menu.contentTypeId==4 && (this.domainId==52 || this.domainId==82))
            {
              slug='documents';
            }
          this.getcontentTypesArr.push({
            contentTypeId: menu.contentTypeId,
            name: menu.name,
            shortName: menu.shortName,
            slug: slug,
            urlPath: urlpth,
            isNew: menu.isNew,
            catCount: menu.catCount,
            urlActivePath: urlActivePath,
            submenuimageClass: submenuimageClass,
            disabled: false,
            searchCount: menu.searchCount,
            tabAction: menu.tabAction,
            tabComponent: menu.tabComponent,
            tabCount: menu.tabCount,
            tabshow: menu.tabshow,
            workstreamId: menu.workstreamId
          });
          if (this.currentContentTypeId == menu.contentTypeId) {
            //this.currentContentTypeId=0;
            wscheck = 1;
            this.currentContentTypeId = menu.contentTypeId;
            catisNew=menu.isNew;
            cat_catisNew=menu.catCount;
            //this.setCountReset(this.currentContentTypeId,menu.catCount,menu.isNew);
          }
        }
      }
    }
    if (!wscheck) {
      this.currentContentTypeId = this.outputContentTypedata[0].contentTypeId;
      catisNew=this.outputContentTypedata[0].isNew;
      cat_catisNew=this.outputContentTypedata[0].catCount;
    }
    this.workstreamId = item.id;
    item.pageInfo = pageInfo.workstreamPage;
    this.outputContentFromLeftMenu = item;
    console.log(this.currentContentTypeId);
    let searchWs = localStorage.getItem('workstreamItemName');
    let searchWorkstreamName = (searchWs && (searchWs != undefined && searchWs!= 'undefined')) ? searchWs : '';
    if(this.productHeaderRef != undefined){
      this.productHeaderRef.searchPlacehoder = `${PageTitleText.Search} in ${searchWorkstreamName}`;
    }
   // localStorage.setItem('getcontentTypesArr',JSON.stringify(this.getcontentTypesArr));

    this.setCountReset(this.currentContentTypeId, cat_catisNew, catisNew);


    switch (this.currentContentTypeId) {
      case 2:
      case 24:
        console.log(item)
        this.commonService.emitWorkstreamReceived(item);
      case 5:
        this.workstreamId = item.id;
        this.getDirectoryList("ws");
        break;
      case 11:
        this.workstreamId = item.id;
        this.getPartList("ws");
        break;
      case 6:
        this.workstreamId = item.id;
        this.getGTSList("ws");
        break;
      case 4:
        this.workstreamId = item.id;
        console.log(item)
        this.initDoc(this.currentContentTypeId, "ws");
        break;
      case 7:
        this.workstreamId = item.id;
        this.getKAList("ws");
        break;
      case 28:
        this.workstreamId = item.id;
        this.getKBList("ws");
        break;
      case 53:
        this.adasPageRef.loading = true;
        this.adasPageRef.breadcrumbFlag = (this.searchValue != '') ? false : true;
        this.adasPageRef.view = (this.searchValue != '') ? 4 : 1;
        this.adasPageRef.resetFileData();
        setTimeout(() => {
          this.adasPageRef.getAdasItems();
        }, 500);
        break;
      default:
        this.commonService.emitMessageReceived(item);
        break;
    }
  }

  setCountReset(Id, Catcount, catNew) {
    console.log(this.getcontentTypesArr);

    let getcontentAvail = [];
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let CatcountNew = 0;
    if (catNew == true) {
      CatcountNew = Catcount;
    }
    getcontentAvail.push({
      contentTypeId: Id,
      workstreamId: this.workstreamId,
      count: CatcountNew,
    });
    let totalCounts=0;
    setTimeout(() => {
      for (let iar in this.getcontentTypesArr) {
        if(this.getcontentTypesArr[iar].isNew==true)
        {
          totalCounts=totalCounts+this.getcontentTypesArr[iar].catCount;
        }

        if (this.getcontentTypesArr[iar].contentTypeId == Id) {
          //this.workstreamArr[iar].removeCount=true;
          if (this.getcontentTypesArr[iar].catCount) {
            this.getcontentTypesArr[iar].catCount =
              this.getcontentTypesArr[iar].catCount - CatcountNew;
              totalCounts=totalCounts-CatcountNew;
          }

          /*
          if(!this.totalNewWorkstreamMessage)
       {
        this.workstreamArr[iar].removeCount=true;
       }
       */
        }
      }
      /*getcontentAvail.push({
        contentTypeId: Id,
        workstreamId: this.workstreamId,
        count: totalCounts,
      });
      */
      this.commonService.emitOnLeftSideMenuBarSubject(getcontentAvail);
    }, 3000);
  }
  taponContent(Id, Catcount, catNew, content) {

    if(Id == 33) {
      let surl = RedirectionPage.StandardReports;
      let cwsId:any = this.workstreamId;
      localStorage.setItem('report-ws', cwsId);
      window.open(surl, "_blank" + surl);
      return false;
    }

    if(Id == 34) {
      let surl = RedirectionPage.MarketPlace;
      let cwsId:any = this.workstreamId;
      localStorage.setItem('marketplace-ws', cwsId);
      window.open(surl, "_blank" + surl);
      return false;
    }
    if(content.disabled) {
      return false;
    }
    let tabCount = content.tabCount;
    tabCount += 1;
    this.getcontentTypesArr.forEach((item) => {
      //item.disabled = (item.tabAction && Id == 11 && tabCount == 1) ? true : item.disabled;
    });
    //this.assignFun(Id)
    //console.log(content)
    this.viewFlag = (!this.collabticFixes && (Id == 2 || Id == 4 || Id == 53)) ? true : false;
    if(Id == 2 || Id == 4) {
      let listView = localStorage.getItem("threadViewType");
      this.threadThumbView = (listView && listView == "thumb") ? true : false;
      this.threadInfo = {
        pageView: this.threadThumbView,
        threadThumbInit: this.threadThumbInit
      }
    }
    if(Id == 53) {
      this.threadThumbView = true;
    }
    this.tabCount = tabCount;
    content.tabCount = tabCount;
    this.setCountReset(Id, Catcount, catNew);
    // this.currentContentTypeId = Id;
    //if (Id != 4 && tabCount == 0) {
    //if (Id != 4) {
      let action = "unsubscribe";
      this.docData.action = action;
      this.commonService.emitDocumentWsApiCallData(this.docData);
      this.partData.action = action;
      this.commonService.emitPartListWsData(this.partData);
      this.commonService.emitSibListWsData(this.partData);
      this.commonService.emitDirectoryListWsData(this.partData);
      console.log(localStorage.getItem('wsDocInfoCollapse'));
      this.emptyFlag = true;
    //} else {
      //this.emptyFlag = true;
    //}

    //if(this.currentContentTypeId != Id && tabCount > 0) {
    if(this.currentContentTypeId != Id && tabCount >= 0) {
      let data = {
        action: 'side-menu',
        access: content.name
      }
      //this.commonService.emitMessageLayoutrefresh(data);
    }

    if (!this.workstreamId) {
      let workstreamId = localStorage.getItem("landing-page-workstream");
      if(workstreamId == '' || workstreamId == null || workstreamId == undefined) {
      workstreamId = localStorage.getItem("currentWorkstream");
      }
      this.workstreamId = workstreamId;
    }
    let aurl = "";
    let wsId = [this.workstreamId];
    let platformId = localStorage.getItem("platformId");
    if (Id == 1) {
      this.SetChatSessionforRedirect(this.workstreamId, ChatType.Workstream);
      aurl = "chat-page";
      // var aurl = '/workstream-chats';
      //window.open(aurl, '_blank');
    } else if (Id == 2 || Id == 24) {
      if (this.currentContentTypeId != Id) {
        // alert(this.outputContentFromLeftMenu);
      } else {
        localStorage.setItem("workstreamNav", "1");
        localStorage.setItem("landing-ws", JSON.stringify(wsId));
        aurl = "threads";
        // window.open(aurl, '_blank');
      }
      this.currentContentTypeId = Id;
      this.tapfromheader = true;
    } else if (platformId == "2") {
      if (Id == 7) {

          if (this.currentContentTypeId != Id) {
            this.getKAList();
            this.currentContentTypeId = Id;
          } else {
            let wsId = [this.workstreamId];
            localStorage.setItem("workstreamNav", "1");
            localStorage.setItem("landing-ws", JSON.stringify(wsId));
            aurl = "knowledgearticles";
          }
        }

      if (Id == 8) {
        aurl = "/knowledgearticles";
        // window.open(aurl, '_blank');
      } else if (Id == 6) {
        if (this.currentContentTypeId != Id) {
          this.getGTSList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "gts";
          //window.open(aurl, '_blank');
        }
        //aurl = "/mis/home/" + this.domainId + "/" + this.userId + "/4";

        //var aurl = '/mis/';
        // window.open(aurl, '_blank');
        this.currentContentTypeId = Id;
      } else if (Id == 11) {
        if (this.currentContentTypeId != Id) {
          this.partData['contentTypeId'] = Id;
          this.getPartList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "parts";
        }
        this.currentContentTypeId = Id;
      }else if (Id == 5) {
        if (this.currentContentTypeId != Id) {
          this.partData['contentTypeId'] = Id;
          this.getDirectoryList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "directory";
        }
        this.currentContentTypeId = Id;

      } else if (Id == 16) {
        if (this.currentContentTypeId != Id) {
          this.getSibList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "sib";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 28) {
        if (this.currentContentTypeId != Id) {
          this.bodyElem.classList.add(this.bodyClass1);
          this.getKBList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "knowledge-base";
        }
        this.currentContentTypeId = Id;
      }else if (Id == 4) {
        let navFlag = false;

        if (platformId == "2") {
          if (this.currentContentTypeId != Id) {
            this.initDoc(Id);
          } else {
            navFlag = true;
          }
        } else {
          navFlag = true;
        }
        if (navFlag) {
          aurl = "documents";
          localStorage.removeItem('wsDocNav');
          console.log(this.workstreamId);
          let wsId = [this.workstreamId];
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
        }
      }/*  else if(Id == 33) {
        aurl = "standard-reports";
      } */
    } else if (platformId != "2") {
      if (Id == 7 && platformId != "2") {
        if (this.currentContentTypeId != Id) {
          this.getKAList();
        } else {
          let wsId = [this.workstreamId];
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "knowledgearticles";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 6) {
        if (this.currentContentTypeId != Id) {
          this.getGTSList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "gts";
          //window.open(aurl, '_blank');
        }
        //aurl = "/mis/home/" + this.domainId + "/" + this.userId + "/4";

        //var aurl = '/mis/';
        // window.open(aurl, '_blank');
        this.currentContentTypeId = Id;
      } else if (Id == 11) {
        if (this.currentContentTypeId != Id) {
          this.partData['contentTypeId'] = Id;
          this.getPartList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "parts";
        }
        this.currentContentTypeId = Id;
      }else if (Id == 5) {
        if (this.currentContentTypeId != Id) {
          this.partData['contentTypeId'] = Id;
          this.getDirectoryList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "directory";
        }
        this.currentContentTypeId = Id;

      } else if (Id == 16) {
        if (this.currentContentTypeId != Id) {
          this.getSibList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "sib";
        }
        this.currentContentTypeId = Id;
      }else if (Id == 28) {
        if (this.currentContentTypeId != Id) {
          this.bodyElem.classList.add(this.bodyClass1);
          this.getKBList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "knowledge-base";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 4) {
        let navFlag = true;

        if (this.currentContentTypeId != Id) {
          this.initDoc(Id);
          navFlag = false;
        }
        if (navFlag) {
          aurl = "documents";
          localStorage.removeItem('wsDocNav');
          console.log(this.workstreamId);
          let wsId = [this.workstreamId];
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));

          if (this.domainId || this.teamSystem) {
            if (this.teamSystem) {
              window.open(aurl, IsOpenNewTab.teamOpenNewTab);
              aurl = "";
            } else {
              //window.open(aurl, IsOpenNewTab.openNewTab);
            }
          } else {
            //  window.open(aurl, '_blank');
          }
        }
      } else if (Id == 53) {
        if (this.currentContentTypeId != Id) {
          //this.getGTSList();
        } else {
          localStorage.setItem('currentContentType', Id);
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = RedirectionPage.AdasProcedure;
          //window.open(aurl, '_blank');
        }
        this.currentContentTypeId = Id;
      }
    } else {
      $(".img-contenttype").removeClass("active");
      $(".border-contenttype").removeClass("active");

      this.currentContentTypeId = Id;
      $(".img-contenttype" + Id + "").addClass("active");
      // $('.img-contenttype'+Id+'').attr('src','assets/images/workstreams-page/thread-w-active.svg');
      $(".border-contenttype" + Id + "").addClass("active");
    }

    // console.log(Id);
    if (aurl) {
      console.log(aurl)
      //let filter;
      if(aurl == 'threads' || aurl == 'parts' || aurl == 'documents' || aurl == 'knowledgearticles' || aurl == 'knowledge-base' || aurl == 'sib' || aurl == 'gts' || aurl == 'directory') {
        //filter = JSON.parse(localStorage.getItem(filterNames.thread));
        let filter;
        switch (aurl) {
          case 'threads':
            localStorage.removeItem("threadOrderFilter");
            localStorage.removeItem("threadSortFilter");
            localStorage.removeItem('yourThreadsValue');
            localStorage.removeItem('yourStoreThreadsValue');
            filter = JSON.parse(localStorage.getItem(filterNames.thread));
            break;
          case 'parts':
            filter = JSON.parse(localStorage.getItem(filterNames.part));
            break;
          case 'documents':
            filter = JSON.parse(localStorage.getItem(filterNames.document));
            break;
          case 'knowledgearticles':
            filter = JSON.parse(localStorage.getItem(filterNames.knowledgeArticle));
            break;
          case 'knowledge-base':
            filter = JSON.parse(localStorage.getItem(filterNames.knowledgeBase));
            break;
          case 'gts':
            filter = JSON.parse(localStorage.getItem(filterNames.gts));
            break;
          case 'sib':
            filter = JSON.parse(localStorage.getItem(filterNames.sib));
            break;
          case 'directory':
            filter = JSON.parse(localStorage.getItem(filterNames.direcotry));
            break;
        }
        window.open(aurl, "_blank" + aurl);
        /*setTimeout(() => {
          console.log(filter)
          let loadFlag = false;
          //console.log(this.workstreamId, filter, filter.hasOwnProperty('workstream'), filter.workstream)
          if(filter.hasOwnProperty('workstream')) {
            let windex = filter.workstream.findIndex(option => option === this.workstreamId);
            console.log(windex)
            loadFlag = (windex >= 0) ? false : true;
          }
          console.log(loadFlag)
          if(loadFlag) {
            //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
            console.log(aurl)
            let routeLoadIndex = pageTitle.findIndex(option => option.slug == aurl);
            if(routeLoadIndex >= 0) {
              let routeLoadText = pageTitle[routeLoadIndex].routerText;
              localStorage.setItem(routeLoadText, 'true');
            }
            //this.router.navigate([aurl]);
          } else {
            //this.router.navigate([aurl]);
          }
          window.open(aurl, "_blank" + aurl);
          //this.router.navigate([aurl]);
        }, 500);*/

      } else {
        window.open(aurl, "_blank" + aurl);
      }

      // newWindow.focus()
    }
  }

  assignFun(contentTypeId) {
    console.log(contentTypeId)
    if(contentTypeId!=1) {
      this.isOn1=true;
      this.isOn2=true;
      this.isOn3=true;
      this.isOn4=true;
      this.isOn5=true;
      this.isOn6=true;
      this.isOn7=true;
      if(contentTypeId==2) {
        this.isOn1=false;
      }
      if(contentTypeId==4) {
        this.isOn2=false;
      }
      if(contentTypeId==7) {
        this.isOn3=false;
      }
      if(contentTypeId==11) {
        this.isOn4=false;
      }
      if(contentTypeId==6) {
        this.isOn5=false;
      }
      if(contentTypeId==16) {
        this.isOn6=false;
      }
      if(contentTypeId==5) {
        this.isOn7=false;
      }
    }
    /* this.getcontentTypesArr.forEach((item) => {
      console.log(item)
      if(contentTypeId!=1) {
        item.tabShow = (contentTypeId == item.contentTypeId) ? true : false;
      }
    }); */
  }

  // Get Knowledge Article List
  getKAList(type = "") {
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    //if(this.tabCount == 1) {
      setTimeout(() => {
        this.commonService.emitKnowledgeListData(this.partData);
      }, 50);
    //}
  }

  // Get Part List
  getPartList(type = "") {
    console.log(type, this.currentContentTypeId);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    console.log('this.workstreamId: ', this.workstreamId);
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData.tabCount = this.tabCount;
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    setTimeout(() => {
      if (type == "ws") {
        this.partData.searchVal = this.apiUrl.searchFromWorkstreamValue;
        this.commonService.emitPartListWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitPartListData(this.partData);
        //}
      }
    }, 50);
  }

  // Get Part List
  getDirectoryList(type = "") {
    this.emptyFlag = true;
    console.log(type, this.currentContentTypeId);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    console.log('this.workstreamId: ', this.workstreamId);
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData.tabCount = this.tabCount;
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    setTimeout(() => {
      if (type == "ws") {
        this.commonService.emitDirectoryListWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitDirectoryListWsData(this.partData);
        //}
      }
    }, 50);
  }

  // Get Part List
  getSibList(type = "") {
    console.log(type);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    setTimeout(() => {
      if (type == "ws") {
        this.commonService.emitSibListWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitSibListData(this.partData);
        //}
      }
    }, 50);
  }

  // Get Part List
  getKBList(type = "") {
    console.log(type);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    //if(this.tabCount == 1) {
      setTimeout(() => {
        if (type == "ws") {
          this.commonService.emiKnowledgeBaseListWsData(this.partData);
        } else {
          this.commonService.emitKnowledgeBaseListData(this.partData);
        }
      }, 50);
    //}
  }

  // Get GTS  List
  getGTSList(type = "") {
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";

    setTimeout(() => {
      console.error("---this.partsData-----", this.partData);
      if (type == "ws") {
        this.commonService.emitGTSLIstWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitGTSLIstData(this.partData);
        //}
      }
    }, 50);
  }

  // Toggle Action
  toggleAction(data) {
    console.log(data);
    let flag = data.action;
    let access = data.access;
    let toggleActionFlag = false;
    switch (access) {
      case "info":
        let collapseFlag: any = true;
        this.collapseFlag = collapseFlag;
        $('.center-middle-width-container').addClass('adding-width-10');
        localStorage.setItem("wsDocInfoCollapse", collapseFlag);
        this.docDetail = data.docDetail;
        this.emptyFlag = false;
        this.rightPanel = !flag;
        this.docData.accessFrom = "documents";
        this.docData.action = "toggle";
        this.docData.expandFlag = !flag;
        this.commonService.emitDocumentListData(this.docData);
        break;
      case "empty":
        this.docDetail = [];
        this.emptyFlag = true;
        this.rightPanel = !flag;
        break;
      default:
        toggleActionFlag = true;
        this.docDetail = [];
        break;
    }
    if (toggleActionFlag) {
      this.docDetail = data.docDetail;
      this.toggleInfo(flag);
    }
  }

  // Toogle Document Info
  toggleInfo(flag) {
    console.log(flag, this.docDetail, this.docData);
    this.docData.action = "toggle";
    this.docData.expandFlag = !flag;
    this.commonService.emitDocumentListData(this.docData);
    this.commonService.emitMessageLayoutChange(flag);
    setTimeout(() => {
      console.log(this.collapseFlag);
      this.rightPanel = !flag;
      let docInfoData = {
        action: "",
        apiData: [],
        docDetail: this.collapseFlag ? this.docDetail : [],
        loading: this.collapseFlag ? true : false,
        panelFlag: this.rightPanel,
      };
      this.collapseFlag = false;
      $('.center-middle-width-container').removeClass('adding-width-10');
      docInfoData.action = "panel";
      this.commonService.emitDocumentPanelData(docInfoData);
    }, 100);
  }



  // Toggle Action
  toggleActionDirectory(data) {

    let flag = data.action;
    this.directoryInfoData = data.directoryInfoData;
    this.rightPanel = !flag;
    this.emptyFlag = false;

    setTimeout(() => {
      let collapseFlag: any = true;
      this.collapseFlag = collapseFlag;
      $('.center-middle-width-container').addClass('adding-width-10');
    }, 100);

    if(this.rightPanel){
      this.toggleInfoDirectory(flag);
    }
    else{
      this.partData.actionRightPanel = "1";
      this.partData.action = "toggle";
      this.commonService.emitDirectoryListData(this.partData);
    }
  }

  // Toogle Document Info
  toggleInfoDirectory(flag) {
    this.rightPanel = !flag;
    setTimeout(() => {
      let collapseFlag: any = false;
      this.collapseFlag = collapseFlag;
      $('.center-middle-width-container').removeClass('adding-width-10');
    }, 100);
    this.commonService.emitDirectoryUserData(this.directoryInfoData);
    this.partData.action = "toggle";
    this.commonService.emitDirectoryListData(this.partData);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHt = document.getElementsByClassName("prob-header");
    //let footerHt = document.getElementsByClassName("footer-content");
    let headerHeight = (headerHt) ? headerHt[0].clientHeight : 0;
    //let footerHeight = (footerHt) ? footerHt[0].clientHeight : 0;
    let footerHeight = 0;
    console.log(this.bodyHeight, headerHeight, footerHeight);
    this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 110);
    console.log(this.innerHeight);
  }

  // Emit Document Info
  emitDocInfo(docData) {
    let data = {
      action: "load",
      loading: true,
      dataId: docData.resourceID,
      docData: docData,
    };
    this.commonService.emitDocumentInfoData(data);
  }

  // Initialize Documentation
  initDoc(id, type = "") {
    localStorage.setItem('wsDocNav', "1");
    this.rightPanel = true;
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.itemOffset = 0;
    this.docLoading = true;
    if(this.collapseFlag) {
      localStorage.setItem('domainCollapse', 'true');
    }
    this.getDocumentList(id, type);
  }
  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }

  searchResultData(data, action = '') {
    console.log(action, data, this.getcontentTypesArr)
    data = (data == undefined || data == 'undefined') ? [] : data;
    //action = (data.length == 0) ? 'clearContent' : '';
    action = (data.length == 0) ? 'clear' : '';
    let clearCount = 0;
    let solrCount = [2,4,7,8,11];
    switch (action) {
      case 'clearContent':
        let cmenuIndex = this.getcontentTypesArr.findIndex(option => option.contentTypeId == this.currentContentTypeId);
        if(cmenuIndex >= 0) {
          this.getcontentTypesArr[cmenuIndex].searchCount = clearCount;
        }
        break;
      case 'clear':
        //this.docData.searchVal = '';
        //this.partData.searchVal = '';
        this.getcontentTypesArr.forEach(item => {
          item.searchCount = clearCount;
        });
        break;

      default:
        let menuIndex, slug;
        data.forEach(item => {
          console.log(item)
          let val = parseInt(item.value);
          let count = item.count;
          let countFalg = true;
          let removeVal: any, contentTypeId: any = 0;
          console.log(val);

          switch (val) {
            case 1:
              slug = RedirectionPage.Threads;
              contentTypeId = ContentTypeValues.Threads;
              removeVal = 2;
              this.setupContentCount(slug, contentTypeId, count);
              break;
            case 2:
              slug = RedirectionPage.Documents;
              contentTypeId = ContentTypeValues.Documents;
              removeVal = 4;
              this.setupContentCount(slug, contentTypeId, count);
              break;
            case 4:
              slug = RedirectionPage.Parts;
              contentTypeId = ContentTypeValues.Parts;
              this.setupContentCount(slug, contentTypeId, count);
              removeVal = 11;
              break;
            case 6:
              slug = RedirectionPage.KnowledgeArticles;
              contentTypeId = ContentTypeValues.KnowledgeArticles;
              this.setupContentCount(slug, contentTypeId, count);
              removeVal = 7;
            case 8:
              slug = RedirectionPage.AdasProcedure;
              contentTypeId = ContentTypeValues.AdasProcedure;
              this.setupContentCount(slug, contentTypeId, count);
              removeVal = 53;
              break;
              break;
            default:
              countFalg = false;
              break;
          }
          /* if(countFalg) {
            let removeIndex = solrCount.findIndex(option => option == removeVal);
            solrCount.splice(removeIndex, 1);
            console.log(slug,contentTypeId,this.getcontentTypesArr);
            let menuIndex = this.getcontentTypesArr.findIndex(option => option.contentTypeId == contentTypeId);
            console.log(menuIndex)
            if(menuIndex >= 0) {
              this.getcontentTypesArr[menuIndex].searchCount = count;
              console.log(this.getcontentTypesArr[menuIndex].searchCount, count);
            } else {
              this.getcontentTypesArr.forEach(item => {
                item.searchCount = clearCount;
              });
              console.log(555);
            }

            console.log(count,this.getcontentTypesArr);
          } */
        });
        solrCount.forEach((item) => {
          menuIndex = this.getcontentTypesArr.findIndex(option => option.contentTypeId == item);
          console.log(menuIndex)
          if(menuIndex >= 0) {
            //this.getcontentTypesArr[menuIndex].searchCount = clearCount;
          }
        });
    }
  }

  setupContentCount(slug, contentTypeId, count) {
    console.log(slug,contentTypeId,this.getcontentTypesArr);
    let clearCount = 0;
    let menuIndex = this.getcontentTypesArr.findIndex(option => option.contentTypeId == contentTypeId);
    console.log(menuIndex)
    if(menuIndex >= 0) {
      this.getcontentTypesArr[menuIndex].searchCount = count;
      console.log(this.getcontentTypesArr[menuIndex].searchCount, count);
    } else {
      this.getcontentTypesArr.forEach(item => {
        item.searchCount = clearCount;
      });
    }
  }

  headerCallback(data) {
    this.productHeaderRef = data;
  }

  adasCallback(data) {
    console.log(data)
    this.adasPageRef = data;
    this.viewFlag = (this.adasPageRef.view == 4) ? true : false;
    if(this.searchValue != '') {
      
    }
  }

  changeView() {
    let action='view', access, viewType, updateApi = true;
    if(this.currentContentTypeId == 2){
      access = 'threads';
    }
    if(this.currentContentTypeId == 4){
      access = 'documents';
    }
    switch(this.currentContentTypeId) {
      case 2:
      case 4:
        this.threadThumbView = this.threadThumbView ? false : true;
        viewType = this.threadThumbView ? "thumb" : "list";
        this.threadThumbInit = (this.threadThumbView) ? this.threadThumbInit++ : this.threadThumbInit;
        this.threadInfo = {
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit
        };
        let loadThumb = false;
        let viewData = {
          action,
          threadViewType: viewType,
          loadThumb,
          pageView: this.threadThumbView,
          threadThumbInit: this.threadThumbInit,
          thumbView:viewType == "thumb" ? true : false
        }
        if(this.currentContentTypeId == 4){
          this.commonService.emitDocumentListData(viewData);
        }
        else{
          this.commonService.emitMessageLayoutrefresh(viewData);
        }
        break;
      case 53:
        updateApi = false;
        if(this.adasPageRef.view == 4) {
          this.threadThumbView = !this.threadThumbView;
          this.adasPageRef.thumbView = this.threadThumbView;
          this.adasPageRef.adasFilesRef.thumbView = this.threadThumbView;
        }
        break;  
    }
    if(updateApi) {
      let apiCall = (this.CBADomian) ? true : false;
      this.commonService.updateLsitView(access, viewType, apiCall);
    }
  }

  ngOnDestroy() {
    this.apiUrl.searchFromWorkstream = false;
    this.apiUrl.searchFromWorkstreamValue = '';
    this.subscription.unsubscribe();
    this.bodyElem.classList.remove(this.bodyClass1);
    localStorage.removeItem('workstreamItem');
    localStorage.removeItem('workstreamItemName');
    this.docData.searchVal = '';
    this.partData.searchVal = '';
  }
}

export class InputChat{
  id: string;
  name:string;
  chatType:string;
  profileImg:string;
  contentType:Object;
}
