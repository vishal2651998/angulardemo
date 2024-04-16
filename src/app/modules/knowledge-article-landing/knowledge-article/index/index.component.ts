import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from "@angular/platform-browser";
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { CommonService } from "../../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab } from "src/app/common/constant/constant";
import { FilterService } from "../../../../services/filter/filter.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { KnowledgeArticleService } from "../../../../services/knowledge-article/knowledge-article.service";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { ApiService } from '../../../../services/api/api.service';
import { FilterComponent } from "src/app/components/common/filter/filter.component";
declare var $: any;
import * as moment from "moment";

interface sortOption {
  name: string;
  code: string;
}
interface orderOption {
  name: string;
  code: string;
}

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit, OnDestroy {
  filterRef: FilterComponent;
  subscription: Subscription = new Subscription();
  @ViewChild('ttarticles') tooltip: NgbTooltip;
  threadSortOptions: sortOption[];
  threadOrderOptions: orderOption[];
  public title = "Knowledge Article";
  public selectedCity1 = "";
  public enableNewThread = "";
  public yourpined = false;
  public selectedCity2: object;
  public filterInitFlag: boolean = false;
  public refreshThreads: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = false;
  public filterActiveCount: number = 0;
  pageAccess: string = "knowledgeArticles";
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public pageData = pageInfo.knowledgeArticlePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "knowledgearticles/manage";
  public groupId: number = 32;
  public threadTypesort = "";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
  };
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;

  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public menuListloaded;
  public getcontentTypesArr = [];
  public roleId;
  public apiData: Object;
  public searchVal;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyClass1: string = "parts";
  public bodyClass2: string = "parts-list";
  public bodyElem;
  public footerElem;
  public silentPushInterval: any;
  public teamSystem = localStorage.getItem("teamSystem");
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;
  public kaCategoryNew: boolean = false;
  public createAccess:boolean=true;
  public delayDisplay:boolean = false;
  public displayPage: boolean = true;
  public kaCategoryId;
  public kaCategoryName;
  public cbaDomain= localStorage.getItem('platformId');
  public disableRightPanel: boolean = true;
  public kaTypeLists: any = [
    {
      class: 'create-file',
      desc: '',
      hideFlag: false,
      id: 1,
      title: 'New Knowledge Article'
    },
    {
      class: 'create-category',
      desc: '',
      hideFlag: false,
      id: 1,
      title: 'New Category'
    },
   ];
   public createFolderdiaLog:boolean=false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private filterApi: FilterService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private modalService: NgbModal,
    public apiUrl: ApiService,
    private knowledgeArticleService: KnowledgeArticleService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(loadAction = ''): void {
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }
    this.threadSortOptions = [
      { name: "Sort by latest Threads", code: "sortthread" },
      { name: "Sort by latest Reply", code: "sortbyreply" },
      { name: "Your Team Threads", code: "teamthread" },
      { name: "Your Threads", code: "ownthread" },
      { name: "Most Popular", code: "popularthread" },
      { name: "Your Fixes", code: "fixes" },
      { name: "Your Pins", code: "yourpin" },
    ];
    this.threadOrderOptions = [
      { name: "Descending", code: "desc" },
      { name: "Ascending", code: "asc" },
    ];
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let platformId = localStorage.getItem('platformId');

    this.checkAccessLevel();

        this.kaCategoryNew = true;

        if(this.domainId==71 && this.roleId==1)
        {
        this.createAccess=false;
        }
        if(this.cbaDomain=='3')
        {
          if(this.roleId!=3)
          {
            this.createAccess=false;
          }

        }
        setTimeout(() => {
        let KACategoryOption = localStorage.getItem('KACategoryOption');
        if( KACategoryOption == "1"  ){
          this.apiUrl.kaCategory = true;
          localStorage.setItem('KACategoryEnable',"1");
        }
        else{
          this.apiUrl.kaCategory= false;
          localStorage.setItem('KACategoryEnable',"0");
        }
      }, 1000);



    this.bodyElem = document.getElementsByTagName("body")[0];
    //this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);

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
      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };
      let apiInfo = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        searchKey: this.searchVal,
        historyFlag: this.historyFlag
      };
      this.apiData = apiInfo;
      this.filterOptions["apiKey"] = Constant.ApiKey;
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;
      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }

      setTimeout(() => {
        this.silentPushInterval = setInterval(() => {
          let kaPush = localStorage.getItem('kaPush');
          if (kaPush) {
            console.log('in push', kaPush);
            let groupArr = JSON.parse(kaPush);
            let kaFilter = JSON.parse(localStorage.getItem("knowledgeArticleFilter"));
            let kaWs = kaFilter.workstream;
            let resWs = [];
            loadAction = 'push';
            if(groupArr.sort().toString() != kaWs.sort().toString()) {
              resWs = groupArr.concat(kaWs);
              kaFilter.workstream = resWs;
              localStorage.setItem("knowledgeArticleFilter", JSON.stringify(kaFilter));
            }
            setTimeout(() => {
              this.ngOnInit(loadAction);
            }, 10);
            localStorage.removeItem('kaPush');
          }
        }, 50)
      },1500);

      setTimeout(() => {
        // this.setScreenHeight();
        this.filterLoading = true;
        this.apiData["groupId"] = this.groupId;
        this.apiData["mediaId"] = 0;
        // Get Filter Widgets
        this.commonService.getFilterWidgets(this.apiData, this.filterOptions);

        this.filterInterval = setInterval(() => {
          let filterWidget = localStorage.getItem("filterWidget");
          let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));
          if (filterWidget) {
            console.log(this.filterOptions, filterWidgetData);
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            //this.apiData['filterOptions']['workstream'] = ["1", "2"];
            this.threadFilterOptions = this.apiData["filterOptions"];
            this.apiData["filterOptions"]['loadAction'] = loadAction;
            this.apiData["onload"] = true;
            this.threadFilterOptions = this.apiData["onload"];
            console.log(this.apiData);
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
            this.apiData["filterOptions"]["catpageRefresh"] = true;
            this.apiData["filterOptions"]["sortOrderBy"] = true;
            this.apiData["filterOptions"]["type"] = "sortthread";
            let KACategoryOption = localStorage.getItem('KACategoryOption');
            if( KACategoryOption == "1"  ){
              this.pageRefresh["catId"] = this.kaCategoryId;
              this.pageRefresh["catName"] = this.kaCategoryName;
            }
            //this.commonService.emitMessageLayoutrefresh(this.apiData["filterOptions"]);
            this.serviceCall(this.apiData["filterOptions"]);
            //  console.log(this.apiData+'---');
            console.log(this.filterOptions);
            this.filterLoading = false;
            this.filterOptions["filterLoading"] = this.filterLoading;
            this.filterOptions["filterrecords"] = this.filterCheck();
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");

            // Get Media List
          }
        }, 50);
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);
    } else {
      this.router.navigate(["/forbidden"]);
    }


    // help content
    this.commonService.welcomeContentReceivedSubject.subscribe((response) => {
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if(welcomePopupDisplay == '1'){
        if(this.msTeamAccess){
          setTimeout(() => {
            this.helpContent(0);
          }, 900);
        }
      }
    });

    this.commonService.knowledgeArticleCatListDataReceivedSubject.subscribe((data) => {
      this.loadNewService(data);
      this.yourpined = false;
      if(data['detailview'] == '1'){
        this.displayPage = false;
        setTimeout(() => {
          this.displayPage = true;
        }, 500);
      }
      let getFilteredValues = JSON.parse(
        localStorage.getItem("knowledgeArticleFilter")
      );
      if(data['filterUpdate'] == '1'){
        this.applyFilter(getFilteredValues);
      }
    });

    this.commonService._OnLayoutChangeReceivedSubject.subscribe((flag) => {
      this.rightPanel = JSON.parse(flag);
    });
    this.subscription.add(
      this.commonService._OnRightPanelOpenSubject.subscribe((response) => {
        console.log(response)
        let flag: any = response;
        this.rightPanel = flag;
      })
    );

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
        this.createAccess = this.accessLevel.create;
        console.log(this.accessLevel)
        this.delayDisplay = true;
      }, 700);
  }


  accessLevelValu(event){
    this.accessLevel = event;
    this.createAccess = this.accessLevel.create;
  }

  loadNewService(data){
    this.pageData = pageInfo.knowledgeArticlePage;

    let loadAction = "";
    if(this.apiUrl.knowledgeArtCall == "1"){
      this.apiUrl.knowledgeArtCall = "0";
      this.kaCategoryId = data["cid"];
      this.kaCategoryName = data["cname"];
      switch(this.kaCategoryId){
        case '-1':
          this.apiUrl.kaCategory= true;
          localStorage.setItem('KACategoryEnable',"1");
          break;
        case '0':
          this.apiUrl.kaCategory= false;
          localStorage.setItem('KACategoryEnable',"0");
          break;
        default:
          this.apiUrl.kaCategory= false;
          localStorage.setItem('KACategoryEnable',"0");
          break;
      }

    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      searchKey: this.searchVal,
      historyFlag: this.historyFlag
    };
    this.apiData = apiInfo;
    this.filterOptions["apiKey"] = Constant.ApiKey;
    this.filterOptions["userId"] = this.userId;
    this.filterOptions["domainId"] = this.domainId;
    this.filterOptions["countryId"] = this.countryId;

    let year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    setTimeout(() => {
      // this.setScreenHeight();
      //this.filterLoading = true;

     let editKAFlag =  localStorage.getItem("editKAFlag");
     if(editKAFlag == "1"){
        this.filterLoading = true;
        localStorage.removeItem("editKAFlag");
      }

      this.apiData["groupId"] = this.groupId;
      this.apiData["mediaId"] = 0;
      this.apiData["catId"] = this.kaCategoryId;
      this.apiData["catName"] = this.kaCategoryName;
      // Get Filter Widgets
      this.commonService.getFilterWidgets(this.apiData, this.filterOptions);

      this.filterInterval = setInterval(() => {
        let filterWidget = localStorage.getItem("filterWidget");
        let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));

        if (filterWidget) {
          console.log(this.filterOptions, filterWidgetData);
          this.filterOptions = filterWidgetData.filterOptions;
          this.apiData = filterWidgetData.apiData;
          //this.apiData['filterOptions']['workstream'] = ["1", "2"];
          this.threadFilterOptions = this.apiData["filterOptions"];
          this.apiData["filterOptions"]['loadAction'] = loadAction;
          this.apiData["onload"] = true;
          this.threadFilterOptions = this.apiData["onload"];
          console.log(this.apiData);
          this.filterActiveCount = filterWidgetData.filterActiveCount;
          this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
          this.apiData["filterOptions"]["categoryPage"] = this.apiUrl.kaCategory;
          this.apiData["filterOptions"]["catId"] = this.kaCategoryId;
          this.apiData["filterOptions"]["catName"] = this.kaCategoryName;
          this.apiData["filterOptions"]["catpageRefresh"] = true;
          if(this.yourpined){
            this.apiData["filterOptions"]["type"] = "pined";
            this.apiData["filterOptions"]["sortOrderBy"] = true;
          }
          else{
            this.apiData["filterOptions"]["type"] = "";
          }
          //this.commonService.emitMessageLayoutrefresh(this.apiData["filterOptions"]);
          this.serviceCall(this.apiData["filterOptions"]);
          this.filterLoading = false;
          clearInterval(this.filterInterval);
          localStorage.removeItem("filterWidget");
          localStorage.removeItem("filterData");

          // Get Media List
        }
      }, 50);

    }, 500);

  }
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    setTimeout(() => {
      this.expandFlag = toggleFlag;
      this.pageRefresh['action'] = "updateLayout";
      //this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.serviceCall(this.pageRefresh);
    }, 10);

  }
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      if(!this.apiUrl.kaCategory){
        this.filterLoading = true;
      }
      this.filterrecords = this.filterCheck();
      this.apiData["filterOptions"] = filterData;

      // Setup Filter Active Data

      this.filterActiveCount = this.commonService.setupFilterActiveData(
        this.filterOptions,
        filterData,
        this.filterActiveCount
      );
      this.filterOptions["filterActive"] =
        this.filterActiveCount > 0 ? true : false;
      // alert(filterData);
      filterData["filterrecords"] = this.filterCheck();
      let KACategoryOption = localStorage.getItem('KACategoryOption');
      if( KACategoryOption == "1"  ){
        if(this.apiUrl.kaCategory){
          this.kaCategoryId = this.kaCategoryId == "" ? this.kaCategoryId = "-1" : this.kaCategoryId;
        }
        else{
          this.kaCategoryId = this.kaCategoryId == "" ? this.kaCategoryId = "0" : this.kaCategoryId;
        }
        filterData["catId"] = this.kaCategoryId;
        filterData["catName"] = this.kaCategoryName;
      }
      if(this.yourpined){
        filterData["sortOrderBy"] = true;
        filterData["type"] = "pined";
      }
      else{
        filterData["type"] = "";
      }
      //this.commonService.emitMessageLayoutrefresh(filterData);
      this.serviceCall(filterData);
      //this.applySearch('get', this.searchVal);
      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    } else {
      this.resetFilter();
    }
    //  this.commonService.emitMessageReceived(filterData);

    //alert(JSON.stringify(filterData));
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(
      localStorage.getItem("knowledgeArticleFilter")
    );

    this.applyFilter(getFilteredValues);
  }
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem("knowledgeArticleFilter");
    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
    let KACategoryOption = localStorage.getItem('KACategoryOption');
    if( KACategoryOption == "1"  ){
      if(this.apiUrl.kaCategory){
        this.kaCategoryId = this.kaCategoryId == "" ? this.kaCategoryId = "-1" : this.kaCategoryId;
      }
      else{
        this.kaCategoryId = this.kaCategoryId == "" ? this.kaCategoryId = "0" : this.kaCategoryId;
      }
      this.apiData["catId"] = this.kaCategoryId;
      this.apiData["catName"] = this.kaCategoryName;
    }
    if(this.yourpined){
      this.apiData["sortOrderBy"] = true;
      this.apiData["type"] = "pined";
    }
    else{
      this.apiData["type"] = "";
    }
    //this.commonService.emitMessageLayoutrefresh(this.apiData);
    this.serviceCall(this.apiData);
  }
  navPart() {
    //if(this.enableNewThread) {
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      if (this.userId) {
        let url = this.newThreadUrl;
        window.open(url, IsOpenNewTab.openNewTab);
      } else {
        localStorage.setItem("prod_type", "2");
        var aurl = "/new-threadv2";
        window.open(aurl, "_blank");
      }
    } else {
      let teamSystem = localStorage.getItem("teamSystem");
      let url = this.newThreadUrl;
      if (teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    }

    //}
  }

  taponpin() {
    if (this.yourpined) {
      this.yourpined = false;
      if(localStorage.getItem('KACategoryPage') == "1"){
          localStorage.removeItem('KACategoryPage');
          let cdata = {
            cid: "-1",
            cname: "All Knowledge Articles"
          }
          this.apiUrl.knowledgeArtCall = "1";
          this.loadNewService(cdata);
      }
      else{
        this.apiUrl.kaCategory= false;
        let KACategoryOption = localStorage.getItem('KACategoryOption');
        if( KACategoryOption == "1"  ){
          this.kaCategoryId = this.kaCategoryId == "" ? this.kaCategoryId = "0" : this.kaCategoryId;
          this.pageRefresh["catId"] = this.kaCategoryId;
          this.pageRefresh["catName"] = this.kaCategoryName;
        }
        this.pageRefresh["type"] = "sortthread";
        this.pageRefresh["sortOrderBy"] = true;
        this.pageRefresh["filterrecords"] = this.filterCheck();
        //this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
        this.serviceCall(this.pageRefresh);
      }

    } else {
      this.yourpined = true;
      if(!this.apiUrl.kaCategory){
        let KACategoryOption = localStorage.getItem('KACategoryOption');
        if( KACategoryOption == "1"  ){
          this.kaCategoryId = this.kaCategoryId == "" ? this.kaCategoryId = "0" : this.kaCategoryId;
          this.pageRefresh["catId"] = this.kaCategoryId;
          this.pageRefresh["catName"] = this.kaCategoryName;
          this.pageRefresh["catpageRefresh"] = true;
        }
        this.pageRefresh["type"] = "pined";
        this.pageRefresh["sortOrderBy"] = true;
        this.pageRefresh["filterrecords"] = this.filterCheck();
        //this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
        this.serviceCall(this.pageRefresh);
      }
      else{
        localStorage.setItem('KACategoryPage',"1");
        let cdata = {
          cid: "0",
          cname: "All Knowledge Articles"
        }
        this.apiUrl.knowledgeArtCall = "1";
        this.loadNewService(cdata);
      }
    }

  }

  // if any one filter is ON
  filterCheck(){
    this.filterrecords = false;
    if(this.pageRefresh["type"] == "pined" || this.yourpined ){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    console.log("**********************");
    console.log(this.filterrecords);
    console.log("**********************");
    return this.filterrecords;
  }
  navPage(type=''){
  if(this.apiUrl.enableAccessLevel){
    this.authenticationService.checkAccess(7,'Create',true,true);
     setTimeout(() => {
       if(this.authenticationService.checkAccessVal){
        this.navPageCall(type);
       }
       else if(!this.authenticationService.checkAccessVal){
        // no access
       }
       else{
        this.navPageCall(type);
       }
     }, 550);
    }
    else{
      this.navPageCall(type);
    }
  }
  // Nav Page Edit or View
  navPageCall(type) {
    /*let currUrl = this.router.url;
    currUrl = currUrl.substr(currUrl.indexOf('/') + 1);
    localStorage.setItem('docNav', currUrl);*/
    let url;
    if(type=='create-category')
    {
      // this.createFolderdiaLog=true;
      this.newCategorypopup();
    }
    else
    {
      this.createFolderdiaLog=false;
      url = `${this.newThreadUrl}`;
      if(this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      }
      else{
        window.open(url, url);
      }
    }

  }


  newCategorypopup() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'New Category';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = [];
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      //console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;

      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiData["apiKey"]);
      apiFormData.append("domainId", this.apiData["domainId"]);
      apiFormData.append("countryId", this.apiData["countryId"]);
      apiFormData.append("userId", this.apiData["userId"]);
      this.knowledgeArticleService.getAllKnowledgeArticleCategory(apiFormData).subscribe(
        (response) => {
          setTimeout(() => {
            if(response.total == 2){
              let cdata = {
                cid: "-1",
                cname: ""
              }
              localStorage.setItem("KACategoryOption", "1");
              localStorage.setItem("editKAFlag", "1");
              this.apiUrl.knowledgeArtCall = "1";
              this.yourpined = false;
              this.loadNewService(cdata);
            }
            else{
              let docData = {
                action: 'folder-creation'
              }
              this.commonService.emitKnowledgeListData(docData);
            }
            msgModalRef.dismiss('Cross click');
          }, 3000);
        }
        );

    });
  }


  serviceCall(docData){
    if(this.apiUrl.kaCategory){
      this.commonService.emitMessageLayoutrefreshNew(docData);
    }
    else{
      this.commonService.emitMessageLayoutrefresh(docData);
    }
  }

      // helpContent list and view
      helpContent(id){
        id = (id>0) ? id : '';
        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('tooltipId', id);

        this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
          if (response.status == "Success") {
            if(id == ''){
            let contentData = response.tooltips;
            for (let cd in contentData) {
              let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
              if(welcomePopupDisplay == '1'){
                if(contentData[cd].id == '5' && contentData[cd].viewStatus == '0' ){
                console.log(contentData[cd].title);
                this.thelpContentStatus = contentData[cd].viewStatus;
                this.thelpContentFlagStatus = true;
                this.thelpContentId = contentData[cd].id;
                this.thelpContentTitle = contentData[cd].title;
                this.thelpContentContent = contentData[cd].content;
                this.thelpContentIconName = contentData[cd].itemClass;
                }
              }
            }
            if(this.thelpContentFlagStatus){
                this.tooltip.open();
            }
            }
            else{
            console.log(response.result);
            this.tooltip.close();
            }
          }
        });
      }

  filterCallback(data) {
    console.log(data)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

