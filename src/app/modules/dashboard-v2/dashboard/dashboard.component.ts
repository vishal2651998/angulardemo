import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { pageInfo, Constant, PlatFormType } from 'src/app/common/constant/constant';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};

   /* basic setup */
    public headerFlag: boolean = false;
    public loadingelanding: boolean = true;
    public title: string = 'Dashboard';
    public bodyElem;
    public footerElem;
    public headerData: Object;
    public sidebarActiveClass: Object;
    public platformId;
    public countryId;
    public domainId;
    public userId;
    public Username;
    public roleId;
    public apiData: Object;
    pageAccess: string = "dashboard-v2";
    public user: any;
    public CBADomain: boolean = false;
    public midHeight: number = 0;
    public bodyClass: string = "dashboard-v2";
    public pageInfo = pageInfo.dashboard;

  constructor(
    private titleService: Title,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private router: Router,
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
   }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.Username = this.user.Username;
   
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName('body')[0];
    
    let platformId = localStorage.getItem('platformId');
    this.platformId = platformId;
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;

    this.headerData = {
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': false
    };

    let url: any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
      pageInfo: pageInfo.dashboard
    };

    setTimeout(() => {
       this.setScreenHeight();
    }, 2000);
  }
  setScreenHeight(){
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? document.getElementsByClassName("prob-header")[0].clientHeight : 0;
    this.midHeight = headerHeight + 30;
  }
  
  applySearch(action, val) {
  }

}


