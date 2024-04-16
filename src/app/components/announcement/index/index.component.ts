import { Component, ViewChild, HostListener, OnInit, OnDestroy, NgModuleRef } from '@angular/core';
import { Constant,IsOpenNewTab,windowHeight,DefaultNewCreationText } from 'src/app/common/constant/constant';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { FilterService } from '../../../services/filter/filter.service';
import * as moment from 'moment';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  public title:string = 'Announcements';
  public bodyClass:string = "parts-list";
  public bodyElem;
  public footerElem;

  public headerFlag: boolean = false;
  public headerData: Object;

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

  public filterLoading: boolean = true;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public searchVal: string = '';
  public pageAccess: string = "announcement";
  public announceType: string = "more";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = true;
  
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public msTeamAccess:boolean=false;
  public announceData: Object;

  public announcementData = {
    access: this.pageAccess,
    announceType: this.announceType,
    filterOptions: [],
  }
  

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
    'groupId': this.groupId    
  };

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    /*this.filterOptions['filterExpand'] = this.expandFlag;
    this.filterLoading = false;
    setTimeout(() => {
      this.filterLoading = true;           
    }, 50);*/
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
    if(teamSystem){
      this.msTeamAccess=true;
    }
    else{
      this.msTeamAccess=false;
    }
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    console.log(this.countryId);
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);

    this.headerData = {
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': true,
      'searchVal': '',
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

    // Get Filter Widgets
    this.getFilters('init');

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        this.rightPanel = JSON.parse(flag);
      })
    );

    this.subscription.add(
      this.commonApi.announcementFilterData.subscribe((data) => {
        let access = data['access'];
        let flag = data['flag'];
        switch (access) {
          case 'more':
            if(data) {
              this.filterLoading = true;
              // Get Filter Widgets
              this.getFilters('get');
            }
            break;
        }
      })
    );
  }
  
  // Get Filter Widgets
  getFilters(action) {
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
          let fopt = this.apiData['filterOptions'];
          this.announcementData['filterOptions'] = fopt;                  
          clearInterval(this.filterInterval);
          localStorage.removeItem('filterWidget');
          localStorage.removeItem('filterData');            
        }
      },50);
    }, 1500);
  }
  
  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    let resetFlag = filterData.reset;
    if(!resetFlag) {
      this.filterOptions['action'] = 'get';
      this.filterActiveCount = 0;
      this.filterLoading = true;  
      this.filterOptions['filterLoading'] = this.filterLoading;
      this.announcementData['filterOptions'] = filterData;    
      
      this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
      localStorage.setItem('moreAnnouncementFilter', JSON.stringify(filterData));
      
      setTimeout(() => {
        this.filterLoading = false;        
        this.filterOptions['filterLoading'] = this.filterLoading;
      }, 700);
      
    } else {
      this.filterOptions['action'] = 'init';
      localStorage.removeItem('moreAnnouncementFilter');
      setTimeout(() => {
        this.resetFilter();  
      }, 100);
    }
  }

  // Reset Filter

  resetFilter() {    
    this.filterLoading = true;   
    this.filterOptions['filterLoading'] = this.filterLoading;
    this.filterOptions['action'] = 'init';  
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    this.ngOnInit();
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;      
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

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
 }

