import { Component, ViewChild, HostListener, OnInit, OnDestroy, NgModuleRef } from '@angular/core';
import { Constant,IsOpenNewTab,windowHeight,DefaultNewCreationText } from 'src/app/common/constant/constant';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { FilterService } from '../../../services/filter/filter.service';

import * as moment from 'moment';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
 
    public title:string = 'Archive Announcements';
    public bodyClass:string = "parts-list";
    public bodyElem;
    public footerElem;
  
    public headerFlag: boolean = false;
    public headerData: Object;
    
    public displayNoRecords: boolean = false;
    public itemEmpty: boolean = false;
    public thumbView: boolean = false;
    public groupId: number = 31;
    public filterInterval: any;
  
    public apiKey: string = Constant.ApiKey;
    public user: any;
    public domainId;
    public userId;
    public roleId;
    public countryId;
    public apiData: Object;
  
    public bodyHeight: number;
    public filterHeight: number;
    public innerHeight: number;
    
    public createAccess: boolean = true;
    public resize: boolean = false;
    public loading: boolean = true;
    public filterLoading: boolean = true;
  
    public annUrl: string = "";
    public searchVal: string = '';
    public pageAccess: string = "announcement";
    public announceType: string = "archive";
  
    public filterActiveCount: number = 0;
    public filterActions: object;
    public expandFlag: boolean = true;
    public rightPanel: boolean = true;
  
    public currYear: any = moment().format("Y");
    public initYear: number = 1960;
    public years = [];
    public defaultWsVal: any;
    
    public section: number = 1;  
    public announcementsList: any = [];
    public announcementsSelectionList: any = [];
    public itemOffset: number = 0;
    public itemTotal: number = 0;
    public msTeamAccess:boolean=false;
  
    public announcementData = {
      accessFrom: this.pageAccess,
      action: 'get',
      domainId: 0,
      expandFlag: this.rightPanel,
      filterOptions: [],
      section: this.section,
      thumbView: this.thumbView,
      searchVal: this.searchVal,
      userId: 0,
      announceType: this.announceType,
      headerFlag: this.headerFlag
    };
    
    public filterOptions: Object = {
      'filterExpand': this.expandFlag,
      'page': this.announceType,
      'filterLoading': this.filterLoading,
      'filterData': [],
      'filterActive': true,
      'filterHeight': 0,
      'apiKey': '',
      'userId': '',
      'domainId': '',
      'groupId': this.groupId,
      'threadType': '25'
    };
  
    // Resize Widow
    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.filterLoading = false;
      setTimeout(() => {
        this.filterLoading = true;
        this.announcementListCallBack('section', this.section);      
      }, 50);
    }
  
    constructor(
      private titleService: Title,
      private router: Router,
      private scrollTopService: ScrollTopService,
      private commonApi: CommonService,
      private authenticationService: AuthenticationService,
      private filterApi: FilterService
    ) {
      this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    }
  
    ngOnInit(): void {
      localStorage.removeItem('searchValue');
      let teamSystem=localStorage.getItem('teamSystem');
      if(teamSystem)
      {
  this.msTeamAccess=true;
      }
      else
      {
        this.msTeamAccess=false;
      }
      this.user = this.authenticationService.userValue;
      this.domainId = this.user.domain_id;
      this.userId = this.user.Userid;
      this.roleId = this.user.roleId;
      this.countryId = localStorage.getItem('countryId');
      console.log(this.countryId);
      let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
      if(authFlag) {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.footerElem = document.getElementsByClassName('footer-content')[0];
        this.bodyElem.classList.add(this.bodyClass);
        //this.scrollTopService.setScrollTop();
        let listView = localStorage.getItem('announcementListView');      
        this.thumbView = (listView == 'undefined' || listView == undefined || listView == 'list') ? false : true;       
        this.announcementData['thumbView'] = this.thumbView;
        this.announcementData['domainId'] = this.domainId;
        this.announcementData['userId'] = this.userId;
        this.announcementData['countryId'] = this.countryId;
        this.announcementData['announceType'] = this.announceType;
        
        this.headerData = {
          'access': this.pageAccess,
          'profile': true,
          'welcomeProfile': true,
          'search': true,
          'searchVal': '',
          'navSection': 'archive'
        };
        let apiInfo = {
          'apiKey': this.apiKey,
          'userId': this.userId,
          'domainId': this.domainId,
          'countryId': this.countryId,
          'isActive': 1,
          'searchKey': this.searchVal,
        }
  
        this.filterOptions['apiKey'] = this.apiKey;
        this.filterOptions['userId'] = this.userId;
        this.filterOptions['domainId'] = this.domainId;
        this.filterOptions['countryId'] = this.countryId;
  
        this.apiData = apiInfo;
        this.bodyHeight = window.innerHeight;
        let year = parseInt(this.currYear);
        for(let y=year; y>=this.initYear; y--) {
          this.years.push({
            id: y,
            name: y.toString()
          });
        }
  
        setTimeout(() => {
          this.setScreenHeight();
          let apiData = this.apiData;
          apiData['groupId'] = this.groupId;
          
          // Get Filter Widgets
          this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);
          
          this.filterInterval = setInterval(()=>{
            let filterWidget = localStorage.getItem('filterWidget');
            let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
            if(filterWidget) {
              this.filterOptions = filterWidgetData.filterOptions;
              this.apiData = filterWidgetData.apiData;
              this.filterActiveCount = filterWidgetData.filterActiveCount;
              this.filterLoading = false;
              this.filterOptions['filterLoading'] = this.filterLoading;
              this.announcementData['filterOptions'] = this.apiData['filterOptions'];
              clearInterval(this.filterInterval);
              localStorage.removeItem('filterWidget');
              localStorage.removeItem('filterData');
              // Get List
              this.commonApi.emitAnnouncementListData(this.announcementData);
            }
          },50);
        }, 1500);
        
      } else {
        this.router.navigate(['/forbidden']);
      }
  
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        this.rightPanel = JSON.parse(flag);
      });
  
      this.commonApi.announcementListDataReceivedSubject.subscribe((data) => {
        //console.log(data)
        this.loading = data['loading'];     
        this.displayNoRecords = data['displayNoRecords'];
        this.itemEmpty = data['itemEmpty'];
        this.itemTotal = data['itemTotal'];
        this.itemOffset = data['itemOffset'];
        this.announcementsList = data['announcementsList'];
        this.announcementsSelectionList = data['announcementsSelectionList'];
      });
    }
    
    // Filter Toggle
    expandAction(toggleFlag) {
      this.expandFlag = toggleFlag;
      this.announcementData.action = 'toggle';
      this.commonApi.emitAnnouncementListData(this.announcementData);
    }
  
    // Apply Filter
    applyFilter(filterData) {
      let resetFlag = filterData.reset;
      if(!resetFlag) {
        this.filterActiveCount = 0;
        this.filterLoading = true;
        this.announcementData['filterOptions'] = filterData;
        
        this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
        this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
        this.applySearch('filter', this.searchVal);
        
        setTimeout(() => {
          this.filterLoading = false;
        }, 700);
        
      } else {
        localStorage.removeItem('archiveAnnouncementFilter');
        setTimeout(() => {
          this.resetFilter();  
        }, 100);
      }
    }
  
    // Reset Filter
    resetFilter() {
      this.filterLoading = true;
      this.filterOptions['filterActive'] = false;
      this.currYear = moment().format("Y");
      this.applySearch('reset', this.searchVal);
      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    }
  
    // Change the view
    viewType(actionFlag) {
      if(!this.itemEmpty) {
        this.thumbView = (actionFlag) ? false : true;
        let viewType = (this.thumbView) ? 'thumb' : 'list';
        localStorage.setItem('announcementListView', viewType);
        setTimeout(() => {
          this.announcementData.thumbView = this.thumbView;
          this.announcementData.action = 'view';
          this.commonApi.emitAnnouncementListData(this.announcementData);
        }, 50);
      }
    }
  
  
    // Part List Call Back
    announcementListCallBack(type, action) {    
      this.section = action;
      let searchVal = '';
      this.applySearch(action, searchVal);
    }
  
    // Apply Search
    applySearch(action, val) {
  
    }
  
    // Set Screen Height
    setScreenHeight() {
      let teamSystem=localStorage.getItem('teamSystem');
      if(teamSystem)
      {
        this.innerHeight=windowHeight.heightMsTeam;
        this.filterHeight = (window.innerHeight);
        this.filterOptions['filterHeight'] = this.innerHeight;
      }
      else
      {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      let titleHeight = document.getElementsByClassName('part-list-head')[0].clientHeight;
      let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
      this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+30));  
      this.innerHeight = this.innerHeight-titleHeight;
  
      this.filterHeight = (window.innerHeight);
      this.filterOptions['filterHeight'] = this.innerHeight;
      }
    }
  
    // Nav Part Edit or View
    navPart(action, id) {
      let url;
      url = this.annUrl;
      let teamSystem=localStorage.getItem('teamSystem');
      if(teamSystem)
      {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      }
      else
      {
        window.open(url, IsOpenNewTab.openNewTab);
      }
      
    }
  }