import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from '../../../services/common/common.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant, IsOpenNewTab, windowHeight, PlatFormType } from '../../../common/constant/constant';
declare var $: any;
@Component({
  selector: 'app-domain-members',
  templateUrl: './domain-members.component.html',
  styleUrls: ['./domain-members.component.scss']
})
export class DomainMembersComponent implements OnInit {
  @Input() disableRightPanel: boolean = false;
  @Output() toggle = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public sidebarHeight;
  public clockTImer = '';
  public expandFlag: boolean = true;
  public countryId;
  public domainId;
  public userId;
  public loadingdm: boolean = true;
  public roleId;
  public landingdomainUsers = [];
  public apiData: Object;
  public escTotal;
  public noescText: string = '';
  public loadingnousers: boolean = false;
  public clearInputIcon: boolean = false;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;
  public user: any;
  public rmdHeight: any;
  public rmsHeight: any;
  public CBADomain: boolean = false;
  public techSupportUpdate: boolean = false;
  public CollabticDomain: boolean = false;
  public access: string = '';
  public emptyText: string = "Nothing to show";

  constructor(
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private scrollTopService: ScrollTopService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {

    this.commonService.emitOnHomeCallSubject.subscribe((r) => {
      this.expandFlag = true;
      this.expandAction('init');
    });

    let url1 = this.router.url.split('/');
    let platformId = localStorage.getItem('platformId');
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
    this.CollabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.techSupportUpdate = this.CBADomain || this.CollabticDomain ? true : false

    if(url1[1] == "knowledgearticles")  {
      this.expandAction('init');
    }
    if(url1[1] == "threads" && url1[2] == "view")  {
      this.expandAction('init');
    }
    if(url1[1] == "documents" && url1[2] == "view")  {
      this.expandAction('init');
    }
    if(url1[1] == "landing-page")  {
      this.expandAction('init');
    }
    if(url1[1] == "kaizen" && url1[2] == "view")  {
      this.expandAction('init');
    }
    let teamSystem = localStorage.getItem('teamSystem');
    if (teamSystem) {
      this.sidebarHeight = windowHeight.heightMsTeam - 40;
    }
    else {
      this.sidebarHeight = windowHeight.height - 150;
    }
    let url = this.router.url.split('/');
    let currUrl = url[1];
    console.log(currUrl)
    switch (currUrl) {
      case 'landing-page':
      case 'workstreams-page':
      case 'chat-page':
        this.access = currUrl;
        this.rmdHeight = 85;
        this.rmsHeight = 270;
        this.expandFlag = (currUrl == 'chat-page') ? false : this.expandFlag;
        if(currUrl == 'chat-page') {
          $('.domain-widget').hide();
        }
        break;
      case 'threads':
      case 'opportunity':
        this.access = currUrl;
        this.rmdHeight = 95;
        this.rmsHeight = 275;
        break;
      case 'knowledgearticles':
        this.rmdHeight = 100;
        this.rmsHeight = 235;
        break;
      case 'search-page':
        this.rmdHeight = 95;
        this.rmsHeight = 230;
        break;
      case 'market-place':
      case 'market-place-quiz':
        this.access = currUrl;
        this.rmdHeight = 90;
        this.rmsHeight = 215;
        break;
      case 'market-place-training':
        this.access = currUrl;
        this.rmdHeight = 80;
        this.rmsHeight = 215;
        break;

      case 'documents':
      case 'bug_and_features':
          this.rmdHeight = 80;
          this.rmsHeight = 210;
          break;
      case 'directory':
        this.rmdHeight = 125;
        this.rmsHeight = 270;
        break;
      default:
        this.rmdHeight = 130;
        this.rmsHeight = 275;
        break;
    }
    setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      this.rmdHeight = this.rmdHeight + headerHeight;
      this.rmsHeight = this.rmsHeight + headerHeight;
    }, 1000);
    console.log(localStorage.getItem('wsDocInfoCollapse'))
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let collapseFlag: any = localStorage.getItem('wsDocInfoCollapse');
    let domainCollapse: any = localStorage.getItem('domainCollapse');
    collapseFlag = (domainCollapse == null) ? collapseFlag : domainCollapse;
    if(currUrl == 'documents' && url.length > 2) {
      collapseFlag = false;
    }
    setTimeout(() => {
      localStorage.removeItem('domainCollapse');
    }, 100);
    collapseFlag = this.disableRightPanel;
    console.log(this.expandFlag, collapseFlag, domainCollapse)
    if (collapseFlag) {
      console.log("this.expandFlag: ", this.expandFlag);
      this.expandFlag = collapseFlag;
      let action = (!this.expandFlag) ? '' : 'trigger';
      console.log(action + '::' + this.expandFlag)
      this.expandAction(action);
      setTimeout(() => {
        localStorage.removeItem('wsDocInfoCollapse')
      }, 100);
    }

    this.scrollTopService.setScrollTop();
    this.getandshowtime();
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'escalationType': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset

    }
    this.apiData = apiInfo;


    setInterval(() => {
      this.getandshowtime();
    }, 1000);

    this.loadingdm = !this.disableRightPanel;
    if(!this.disableRightPanel) {
      this.getdomainMembers();
    }

    console.log("this.expandFlag: ", this.expandFlag);
  }
  expandAction(action = '') {
    this.expandFlag = (this.expandFlag) ? false : true;
    if (this.expandFlag) {
      $('.center-middle-width-container').addClass('ease-out-animate');
      $('.domain-widget').show();
      //$('.center-middle-width').css("width", "60%");
      //$('.center-middle-width').animate({width: '60%'});

      if ($(".center-middle-width-container").hasClass("adding-width-12")) {
        $('.center-middle-width-container').addClass('col-lg-10  col-lg-10 col-lg-10 col-lg-10 adding-width-10');
        $('.center-middle-width-container').removeClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
        //$('.center-middle-width-container').removeClass('col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10');
        //$('.center-middle-width-container').addClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
      }
      else {
        $('.center-middle-width-container').addClass('col-lg-8  col-md-8 col-xl-8 col-sm-8');
        $('.center-middle-width-container').removeClass('col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10');
      }

      $('.right-middle-width-container').removeClass('addon-contain');
      $('.domain-toggle').addClass('active');
      setTimeout(() => {                           //<<<---using ()=> syntax
        $('.center-middle-width-container').removeClass('ease-out-animate');
      }, 5000);
    }
    else {
      if (action == '') {
        $('.center-middle-width-container').addClass('ease-out-animate');
      }
      $('.domain-widget').hide();
      //ar ss= $('.center-middle-width-container').css('max-width');
      $('.right-middle-width-container').addClass('addon-contain');

      if ($(".center-middle-width-container").hasClass("adding-width-10")) {
        if (action == '') {
          $('.center-middle-width-container').removeClass('col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10');
          $('.center-middle-width-container').addClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
        }
        if(this.access == 'landing-page' && action == 'trigger') {
          $('.center-middle-width-container').removeClass('col-lg-8  col-md-8 col-xl-8 col-sm-8');
          if(!$(".center-middle-width-container").hasClass("col-lg-10")) {
            $('.center-middle-width-container').addClass('col-lg-10 col-md-10 col-xl-10 col-sm-10 adding-width-10');
          }
        }
      }
      else {
        $('.center-middle-width-container').removeClass('col-lg-8  col-md-8 col-xl-8 col-sm-8');
        if((this.access == 'threads' || this.access == 'market-place' || this.access == 'market-place-training' || this.access == 'market-place-quiz') && action == 'trigger') {
          $('.center-middle-width-container').addClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
        } else {
          $('.center-middle-width-container').addClass('col-lg-10 col-md-10 col-xl-10 col-sm-10 adding-width-10');
        }
      }
      $('.domain-toggle').removeClass('active');
      setTimeout(() => {
        $('.center-middle-width-container').removeClass('ease-out-animate');
      }, 5000);
    }
    this.commonService.emitMessageLayoutChange(this.expandFlag);
    this.toggle.emit(this.expandFlag);
  }
  getandshowtime() {
    this.clockTImer = moment().local().format('MMM DD, YYYY . h:mm A');
  }
  @HostListener('scroll', ['$event'])
  onScroll(event) {
    console.log('scrolling');
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;

    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        console.log('bottom reached');
        this.getdomainMembers();
        this.loadingdm = true;

      }
    }

  }
  searchDomainUserText(event) {
    this.landingdomainUsers = [];
    this.loadingdm = true;
    var searchval = event.target.value;
    if (searchval) {

      this.itemOffset = 0;
      this.clearInputIcon = true;
      this.getdomainMembers(searchval);
    }
    else {
      this.clearInputIcon = false;
      this.getdomainMembers(searchval);
    }
    //alert(event.target.value);

  }
  taponprofileclick(userDetails) {
    let teamSystem = localStorage.getItem('teamSystem');
    var userId = userDetails.userId;
    console.log(userDetails);

    var aurl = 'profile/' + userId + '';
    if (teamSystem) {
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else {
      window.open(aurl, IsOpenNewTab.openNewTab);
    }


  }
  clearText(event) {
    this.landingdomainUsers = [];
    $('.domain-text-box').val('');
    this.itemOffset = 0;
    this.clearInputIcon = false;
    this.getdomainMembers();
  }
  getdomainMembers(searchText = '') {
    this.apiData['offset'] = this.itemOffset;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('searchText', searchText);


    this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe((response) => {

      let rstatus = response.status;
      let rresult = response.result;
      let rsdata = response.dataInfo;
      let rstotal = response.total;
      this.itemTotal = rstotal;
      //alert(rstotal);
      if (searchText) {
        this.landingdomainUsers = [];
      }
      if (rsdata.length == 0) {
        this.loadingdm = false;
        this.noescText = rresult;
        this.loadingnousers = true;
      }
      else {
        this.loadingnousers = false;

        this.escTotal = rstotal;
        let rsthreaddata = rsdata;
        //alert(rsthreaddata);
        if (rstatus == 'Success') {
          if (rsthreaddata.length > 0) {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemLength += rsthreaddata.length;
            this.itemOffset += this.itemLimit;

            for (let du in rsthreaddata) {

              let duserId = rsthreaddata[du].userId;
              let duserName = rsthreaddata[du].userName;
              let davailability = rsthreaddata[du].availability;
              let dprofileImg = rsthreaddata[du].profileImg;
              let dtitle = rsthreaddata[du].title;
              let badgeTopUser = 0;
              if (rsthreaddata[du].badgeTopUser) {
                badgeTopUser = rsthreaddata[du].badgeTopUser;
              }





              this.landingdomainUsers.push({
                userId: duserId,
                userName: duserName,
                availability: davailability,
                profileImg: dprofileImg,
                title: dtitle,
                badgeTopUser: badgeTopUser,
              })
            }
            //alert(rsthreaddata.length);
            this.loadingdm = false;
          }
          else {
            this.loadingdm = false;
          }


        }
        else {
          this.loadingdm = false;
        }
      }

    });
  }


}
