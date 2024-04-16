import { Component, OnInit, OnDestroy, HostListener, Input, Inject, Injector, Injectable, InjectionToken } from '@angular/core';
import { PlatformLocation } from "@angular/common";
import { NavigationStart,Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { AnnouncementWidgetsComponent } from '../../../components/common/announcement-widgets/announcement-widgets.component';
import { EscalationWidgetsComponent } from '../../../components/common/escalation-widgets/escalation-widgets.component';
import { RecentViewedWidgetsComponent } from '../../../components/common/recent-viewed-widgets/recent-viewed-widgets.component';
import { RecentSearchesWidgetsComponent } from '../../../components/common/recent-searches-widgets/recent-searches-widgets.component';
import { MyMetricsWidgetsComponent } from '../../../components/common/my-metrics-widgets/my-metrics-widgets.component';
import { LandingReportWidgtsComponent } from '../../../components/common/landing-report-widgts/landing-report-widgts.component';
import { pageInfo, Constant, PlatFormType } from 'src/app/common/constant/constant';
import { Subscription } from "rxjs";
import { SupportRequestWidgetComponent } from '../../common/support-request-widget/support-request-widget.component';
import { RecentTechInfoWidgetsComponent } from '../../common/recent-tech-info-widgets/recent-tech-info-widgets.component';
import { MySupportRequestWidgetsComponent } from '../../common/my-support-request-widgets/my-support-request-widgets.component';
import { MyPinnedContentComponent } from '../../common/my-pinned-content/my-pinned-content.component';
import { MyTicketsWidgetsComponent } from 'src/app/components/common/my-tickets-widgets/my-tickets-widgets.component';
import { TeamSupportRequestWidgetsComponent } from 'src/app/components/common/team-support-request-widgets/team-support-request-widgets.component';
import { TeamMembersStatusWidgetsComponent } from 'src/app/components/common/team-members-status-widgets/team-members-status-widgets.component';
import { YourPerformanceStatsWidgetsComponent } from 'src/app/components/common/your-performance-stats-widgets/your-performance-stats-widgets.component';
import { RecentMacrosWidgetsComponent } from 'src/app/components/common/recent-macros-widgets/recent-macros-widgets.component';
import { RegisteredTrainingsWidgetsComponent } from 'src/app/components/common/registered-trainings-widgets/registered-trainings-widgets.component';
import { UserDashboardService } from '../../../services/user-dashboard/user-dashboard.service';
import { FormGroup, FormBuilder  } from '@angular/forms';
// import timeGreetings from "time-greetings";
import greetingTime from 'greeting-time';
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import * as moment from "moment";
import { DomSanitizer } from '@angular/platform-browser';

export const TITLE = new InjectionToken<string>('title', { providedIn: 'root', factory: () => 'title' });

@Injectable()
class UsefulService {
}
@Injectable()
class NeedsService {
  constructor(public service: UsefulService) {


   }
}
interface SelectItem {
  name: string;
  id: string;
  label: string;
}
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit, OnDestroy {
  @Input() public updateImgResponce;
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = 'Home';
  public scrollTop: number = 0;
  public displayloadPopup:boolean=false;
  public landingBannerBgFlag: boolean = false;
  public lastLoginDate;

  message;
  //outlet = DynamicComponent;
  public dummyComponent = [AnnouncementWidgetsComponent, EscalationWidgetsComponent];
  public TVSIBdomain:boolean=false;
  public frompageCheck = pageInfo.landingPage;
  dynamicComponentInjector: Injector;
  public bodyElem;
  public footerElem;
  public announcevar = 'announcement-widgets';
  public landingpageWidgets = [];
  /* basic setup */
  public headerFlag: boolean = false;
  public loadingelanding: boolean = true;
  public disableRightPanel: boolean = true;

  public pageInfo = pageInfo.landingPage;
  public midHeight: number = 0;
  public headerData: Object;
  public sidebarActiveClass: Object;
  public platformId;
  public countryId;
  public domainId;
  public userId;
  public Username;
  public roleId;
  public apiData: Object;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  pageAccess: string = "landingpage";
  public bodyClass: string = "landing-page";
  public user: any;
  public CBADomain: boolean = false;
  public businessRoleFlag: boolean = false;
  public headerBanner: boolean = false;
  public selectedGroup: object;
  listItems: SelectItem[];
  public supportReadiness: string = '0';
  tsForm: FormGroup;
  public businessRoleForm: boolean = false;
  public welcomeText: string = '';
  public timeText: string = '';
  public landingBannerBg: string = "";
  public automatedMsgPopup: boolean = false;
  public automatedSystemMessage:object;
  /*
    set dynamicComponentInputTitle(title) {
      this.dynamicComponentInjector = ReflectiveInjector.resolveAndCreate([{ provide: TITLE, useValue: title }], this.parentInjector);
    }
    */
  /* basic setup */
  constructor(
    /* basic setup */
    private titleService: Title,
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private commonService: CommonService,
    private location: PlatformLocation,
    private inj: Injector,
    private authenticationService: AuthenticationService,
    private userDashboardApi: UserDashboardService,
    private formBuilder: FormBuilder,
    public apiUrl: ApiService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    // private parentInjector: Injector
    /* basic setup */

  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Home');
    let logginState=localStorage.getItem('logginState');
    if(logginState)
    {
      this.displayloadPopup=true;
    }

    //let title = 'My dynamic title works!';
    //this.dynamicComponentInputTitle = title;

    this.location.onPopState(() => {
      let id = "recentView";
      setTimeout(() => {
        this.scrollToElem(id);
      }, 100);

    });

  }
  createInjector(item) {
    const injector = Injector.create({
      providers:
        [{ provide: NeedsService, deps: [UsefulService] }, { provide: UsefulService, deps: [] }]
    });
    return injector;
  }
  ngOnInit(): void {
    // console.log(greetingTime(new Date()));
    localStorage.removeItem('searchValue');
    this.user = this.authenticationService.userValue;
    console.log(this.user);
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.Username = this.user.Username;
    this.TVSIBdomain = (this.domainId == '97') ? false : false;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    let platformId = localStorage.getItem('platformId');
    this.platformId = platformId;
    this.CBADomain = (platformId == PlatFormType.CbaForum || platformId == PlatFormType.Collabtic) ? true : false;
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'isActive': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset

    }
    let teamSystem = localStorage.getItem('teamSystem');
    if(this.TVSIBdomain)
    {
      this.midHeight = (teamSystem) ? 35 : 35;
    }
    else
    {
      this.midHeight = (teamSystem) ? 87 : 87;
    }
    this.apiData = apiInfo;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if (authFlag) {
      let dekradomain = localStorage.getItem('dekradomain');
      if(dekradomain == '1'){
        /*let dekradomainRPage = localStorage.getItem('dekradomainRPage');
        if(dekradomainRPage == '1'){
          this.router.navigate(['/headquarters/network']);
          localStorage.setItem("dekradomainRPage","1");
        }
        else{
          this.router.navigate(['/headquarters/home']);
        }*/  
        this.router.navigate(['/headquarters/home']);      
      }
      else{

      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true
      };
      let url: any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
        pageInfo: pageInfo.landingPage
      };
      setTimeout(() => {
        this.getlandingpagewidgets();

        this.timeText = greetingTime(new Date());
       // this.timeText = ''; // timeGreetings.timeGreetingsAutoDetectTime() == "Good Night" ? "Good Evening" : timeGreetings.timeGreetingsAutoDetectTime();

        let businessRole = localStorage.getItem('businessRole') != null ? localStorage.getItem('businessRole') : '' ;
        let firstName = localStorage.getItem('firstName') != null ? localStorage.getItem('firstName') : '' ;
        this.businessRoleFlag = (businessRole == '6' ) ? true : false;
        if(this.businessRoleFlag && this.CBADomain){
          this.welcomeText = this.timeText+" "+firstName+".";
          this.tsForm = this.formBuilder.group({
            tsFormControl: [this.selectedGroup, []]
         });
        }

        if(this.domainId == '318'){
          this.headerBanner = true;
          let lastLogin = moment.utc(this.apiUrl.LastLogin).toDate();
          this.lastLoginDate = moment(lastLogin).local().format("MMM DD, YYYY h:mm A");
        }

        //this.apiUrl.domainMembersShowFlag = localStorage.getItem("isUserListOPtion") == '1' ? true : false;
        /*this.automatedSystemMessage= localStorage.getItem("automatedSystemMessage");
        if(this.automatedSystemMessage != ''){
          this.automatedMsgPopup = true;
        }
        else{
          this.automatedMsgPopup = false;
        }
        */

      }, 1000);

      }

    }
    else {
      this.router.navigate(['/forbidden']);
    }
    /* basic setup */

  }


  getlandingpagewidgets() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);

    if(this.businessRoleFlag && this.CBADomain){
      apiFormData.append('techSupport', '1');
    }

    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe((response) => {

      let rstatus = response.status;
      let rtotal = response.total;
      this.supportReadiness = response.supportReadiness;
      if(response.automatedSystemMessage)
      {



      if(response.automatedSystemMessage != ''){
        this.automatedMsgPopup = true;
        let content = '';
        content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(response.automatedSystemMessage));
        this.automatedSystemMessage = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(content));
      }
      else{
        this.automatedMsgPopup = false;
      }
    }
      if(this.businessRoleFlag && this.CBADomain)
      {
      this.listItems = [
        {
          name: "Available",
          id: "0",
          label: "status0"
        },
        {
          name: "Unavailable ",
          id: "1",
          label: "status1"
        },
        {
          name: "Vacation",
          id: "2",
          label: "status2"
        }
      ];


this.tsForm.get('tsFormControl').patchValue(this.supportReadiness);
      }

      if (rstatus == 'Success') {
        if (rtotal > 0) {
          let rlandingPage = response.landingPage;

          if(this.headerBanner){
            this.landingBannerBg = response.techBannerImage == '' ? 'assets/images/landing-header-banner-bg.jpg' : response.techBannerImage ;
            this.landingBannerBgFlag = true;
          }

          for (let wi in rlandingPage) {

            var rcomponentName = rlandingPage[wi].componentName;
            var rplaceholder = rlandingPage[wi].placeholder;
            var rwid = rlandingPage[wi].id;

            localStorage.setItem('landingpage_attr' + rwid + '', JSON.stringify(rlandingPage[wi]));


            if (rwid == 1) {

              this.landingpageWidgets.push({ componentName: AnnouncementWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 2) {

              this.landingpageWidgets.push({ componentName: EscalationWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 3) {

              this.landingpageWidgets.push({ componentName: RecentViewedWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 4) {

              this.landingpageWidgets.push({ componentName: RecentSearchesWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 5) {

              this.landingpageWidgets.push({ componentName: MyMetricsWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 7) {

              this.landingpageWidgets.push({ componentName: SupportRequestWidgetComponent, placeholder: rplaceholder });
            }
            if (rwid == 8) {

              this.landingpageWidgets.push({ componentName: MySupportRequestWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 10) {

              this.landingpageWidgets.push({ componentName: MyPinnedContentComponent, placeholder: rplaceholder });
            }

            if (rwid == 9) {

              this.landingpageWidgets.push({ componentName: RecentTechInfoWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 6) {

              this.landingpageWidgets.push({ componentName: LandingReportWidgtsComponent, placeholder: rplaceholder });
            }
            // CBA Tech Support
            if (rwid == 21) {

              this.landingpageWidgets.push({ componentName: MyTicketsWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 22) {

              this.landingpageWidgets.push({ componentName: TeamSupportRequestWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 23) {

              this.landingpageWidgets.push({ componentName: TeamMembersStatusWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 24) {

              this.landingpageWidgets.push({ componentName: YourPerformanceStatsWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 25) {

              this.landingpageWidgets.push({ componentName: RecentMacrosWidgetsComponent, placeholder: rplaceholder });
            }
            // CBA Tech Support

            if (rwid == 30) {
              this.landingpageWidgets.push({ componentName: RegisteredTrainingsWidgetsComponent, placeholder: rplaceholder });
            }

          }

          let rlandingPage1 = {
            'componentName': "RecentSearchesWidgetsComponent",
            'id': "4",
            'imageClass': "recentsearch-land-icon",
            'imageUrl': "landing-recent-search.svg",
            'name': "Search History",
            'placeholder': "Search History",
            'shortName': "search-widget"
          }

          const rwid1 = rlandingPage1.id;

          localStorage.setItem('landingpage_attr' + rwid1 + '', JSON.stringify(rlandingPage1));

          this.loadingelanding = false;

        }
        else {
          this.loadingelanding = false;
        }

      }
      else {
        this.loadingelanding = false;
      }


    });
  }

  applySearch(action, val) {
  }

  selectEvent(event)
  {
      console.log(event.value);
      this.updateUserStatus(event.value);
  }
  updateUserStatus(id){
    var apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('supportReadiness', id);

    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe((response) => {
      console.log(response);
    });

  }

  // Scroll to element
  scrollToElem(id) {
    let scrollPos = localStorage.getItem('homeScroll');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos) + inc;
    let secElement = document.getElementById(id);
    if(this.scrollTop)
    {
      secElement.scrollTop = this.scrollTop;
    }

  }



  onScroll(event) {
    this.scrollTop = event.target.scrollTop - 80;
  }
  ngAfterViewInit() {

    setTimeout(() => {
      this.displayloadPopup=false;
      localStorage.removeItem('logginState');
    }, 5000);

}
// Update Manufacturer Logo
updateBannerImage() {
  this.bodyElem = document.getElementsByTagName('body')[0];
  this.bodyElem.classList.add('profile');
  this.bodyElem.classList.add('image-cropper');
  const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
  modalRef.componentInstance.userId = this.userId;
  modalRef.componentInstance.domainId = this.domainId;
  modalRef.componentInstance.type = "";
  modalRef.componentInstance.profileType = 'landing-header-banner';
  modalRef.componentInstance.id = this.userId;
  modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
    if (receivedService) {
      console.log(receivedService)
      let image = receivedService.show;
      let imageFile = receivedService.response;
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove('profile');
      this.bodyElem.classList.remove('image-cropper');
      modalRef.dismiss('Cross click');
      this.landingBannerBg = image;
    }
  });
}

automatedMsgPopupUpdate(){
  var apiFormData = new FormData();
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('automatedHomePopup', '1');

  this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe((response) => {
    console.log(response);
    localStorage.removeItem("automatedSystemMessage");
    this.automatedMsgPopup = false;
  });

}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
