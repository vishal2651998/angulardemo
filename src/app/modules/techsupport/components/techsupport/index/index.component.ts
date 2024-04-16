import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { pageInfo, Constant, PlatFormType, IsOpenNewTab, ManageTitle } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { CommonService } from "../../../../../services/common/common.service";
import { AuthenticationService } from "../../../../../services/authentication/authentication.service";
import { LandingpageService } from "../../../../../services/landingpage/landingpage.service";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import { Subscription } from "rxjs";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { StickyDirection } from "@angular/cdk/table";
import { ApiService } from '../../../../../services/api/api.service';
import { environment } from '../../../../../../environments/environment';
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { ProductMatrixService } from '../../../../../services/product-matrix/product-matrix.service';
declare var $: any;

interface sortOption {
  name: string;
  code: string;
}
interface levelOption {
  name: string;
  code: string;
}
interface statusOption {
  name: string;
  code: string;
}
interface teamOption {
  name: string;
  code: string;
}
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [MessageService]
})
export class IndexComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  selectedGroupOptions: teamOption[];
  selectedOrderOptions: sortOption[];
  selectedLevelOptions: levelOption[];
  selectedStatusOptions: statusOption[];
  tsForm: FormGroup;
  teamForm: FormGroup;
  levelForm: FormGroup;
  public title: string = "Tech Support View";
  public bodyClass: string = "";
  public memberSelectFlag: boolean = false;
  public headerFlag: boolean = false;
  public headerData: Object;
  public typeStatusId:string='0';
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public teamMemberId;
  public roleId;
  public userProfile;
  public userName;
  public apiData: Object;
  public searchVal: string = "";
  public pageAccess: string = "techsupport";
  public selectedOrder: object;
  public selectedLevel: object;
  public selectedStatus: object;
  public selectedGroup: object;
  public rmHeight: any = 138;
  public pageData = pageInfo.threadsPage;
  public threadTypesort = "sortthread";
  public threadOrderType = "desc";
  public threadLevelType = "";
  public pageRefresh: object = {
    type: this.threadTypesort,
    orderBy: 'desc'
  };
  public accessLevel : any = {create: 1, delete: 1, edit: 1, reply: 1, view: 1};
  public sidebarActiveClass: Object;
  public countryId;
  public enableDesktopPush: boolean = false;
  public access: string;
  public msgs1: Message[];
  public actionMoreFlag: boolean = false;
  public teamList: any = [];
  public teamMembers: any = [];
  public ticketStatusList: any = [];
  public loading: boolean = true;
  public ticketStatus: string = '1';
  public teamId: string = localStorage.getItem('defaultTechSupportTeamId');
  public expandFlag: boolean = true;
  public techSupportUserFlag: boolean = false;
  public TVSDomain: boolean = false;
  public platformId = 0;

  constructor(
    private titleService: Title,
    private router: Router,
    private commonService: CommonService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    public apiUrl: ApiService,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private formBuilder: FormBuilder,
    private probingApi: ProductMatrixService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
   // this.bodyElem = document.getElementsByTagName("body")[0];
   // this.bodyElem.classList.add(this.bodyClass); 



    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;

    this.userId = this.user.Userid;
    this.userName = this.user.Username;
    this.teamMemberId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.userProfile = localStorage.getItem('userProfile');
    this.countryId = localStorage.getItem('countryId');
    this.threadLevelType = localStorage.getItem('defaultEscalation');

    let platformId: any = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.TVSDomain = (this.platformId == 2 && this.domainId == 52) ? true : false;
 
    let businessRole = localStorage.getItem('businessRole') != null ? localStorage.getItem('businessRole') : '' ;
 
    this.techSupportUserFlag = (businessRole == '6' ) ? true : false;


    this.selectedLevelOptions= [{
      'name':"All Levels",
      'code':''
    },
    {
      'name':"Escalation Level 1",
      'code':'l1'
    },
    {
      'name':"Escalation Level 2",
      'code':'l2'
    },
    {
      'name':"Escalation Level 3",
      'code':'l3'
    }];

      this.selectedOrderOptions = [
        { name: "Descending", code: "desc" },
        { name: "Ascending", code: "asc" },
      ];

     this.tsForm = this.formBuilder.group({
        tsFormControl: [this.selectedStatus, []]
     });
     this.teamForm = this.formBuilder.group({
      teamFromControl: [this.selectedGroup, []]
     });
     this.levelForm = this.formBuilder.group({
      levelFormControl: [this.selectedLevel, []]
     });


      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: false,
        searchVal: "",
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
      };

      setTimeout(() => {
        var landingTSData =  localStorage.getItem('landing-techsupport') != null ? JSON.parse(localStorage.getItem('landing-techsupport')) : '';
    console.log(landingTSData);
    switch(landingTSData['type']){
      case 'status':
        this.ticketStatus = landingTSData['statusId'];
        this.teamId = landingTSData['teamId'];
        this.threadLevelType = landingTSData['level'];
        this.techsupportMenus('tstatus','');
        this.typeStatusId = '';
        break;
      case 'member':
        this.teamMemberId = landingTSData['memberId'];
        this.teamId = landingTSData['teamId'];
        this.ticketStatus = '2';
        this.techsupportMenus('tmember','');
        break;
      case 'team':
        this.ticketStatus = landingTSData['statusId'];
        this.teamId = landingTSData['teamId'];
        this.threadLevelType = landingTSData['level'];
        this.typeStatusId = '';
        this.techsupportMenus('team','');
        break;
      default:
        this.techsupportMenus();
        break;
    }

    this.apiData = apiInfo;
    this.apiData["apiKey"] = Constant.ApiKey;
    this.apiData["userId"] = this.userId;
    this.apiData["domainId"] = this.domainId;
    this.apiData["countryId"] = this.countryId;
    this.apiData['orderBy']=this.threadOrderType;
    this.apiData['type']=this.threadTypesort;
    this.apiData['orderBy']=this.threadOrderType;
    this.apiData['level']=this.threadLevelType;
    this.apiData['type']=this.threadTypesort;
    this.apiData['teamId'] = this.teamId;
    this.apiData['ticketStatus'] = this.ticketStatus;
    this.apiData['teamMemberId'] = this.teamMemberId;

    this.setScreenHeight();

      }, 500);



    this.subscription.add(
      this.commonService.TechsupportFilterReceivedSubject.subscribe((r) => {

        let apiInfo = {
          apiKey: Constant.ApiKey,
          userId: this.userId,
          domainId: this.domainId,
          countryId: this.countryId,
          searchKey: this.searchVal,
        };
        this.apiData = apiInfo;
        this.apiData["apiKey"] = Constant.ApiKey;
        this.apiData["userId"] = this.userId;
        this.apiData["domainId"] = this.domainId;
        this.apiData["countryId"] = this.countryId;
        this.apiData['orderBy']=this.threadOrderType;
        this.apiData['level']=this.threadLevelType;
        this.apiData['type']=this.threadTypesort;
        this.apiData['teamId'] = this.teamId;
        this.apiData['ticketStatus'] = this.ticketStatus;
        this.apiData['teamMemberId'] = this.teamMemberId;
        setTimeout(() => {
          this.techsupportMenus('service',this.teamId);
          //this.commonService.emitTSLayoutrefresh(this.apiData);
        }, 1000);

      })
    );

  }

   // Resize Widow
   @HostListener("window:resize", ["$event"])
   onResize(event) {
     setTimeout(() => {
        this.setScreenHeight();
     },100);
   }

  setScreenHeight(){
    this.rmHeight = 138;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    this.rmHeight = this.rmHeight+headerHeight;
  }
  techsupportMenus(type='',id=''){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    //if(type == 'team' || type == 'service'){
      apiFormData.append("teamId", this.teamId);
    //}
    //if(type == 'member' || type == 'tmember'){
      apiFormData.append("teamMemberId", this.teamMemberId);
    //}

    this.landingpageServiceApi.apiTechSupportMenusAPI(apiFormData).subscribe((response) => {
      //if (response.status == "Success") {
        console.log(response);
        this.ticketStatusList = response.ticketStatusList;
          if(id == '' || type == 'team'){
            this.teamMembers = response.teamMembers;
            this.teamList = response.teamList;
            this.selectedGroupOptions = [];
            for (let i in this.teamList) {
              this.selectedGroupOptions.push({
                'name':this.teamList[i].name,
                'code':this.teamList[i].id
              })
            }
            for (let i in this.teamMembers) {
              this.teamMembers[i].activeClass = false;
              if(this.teamMemberId == this.teamMembers[i].userId){
                this.teamMembers[i].activeClass = true;
              }
            }

          }
          if(id == '' || type == 'service' || type == 'team' ){
            this.selectedStatusOptions = [];
            for (let j in this.ticketStatusList) {

                this.ticketStatusList[j].activeClass = false;
                if(this.userId==this.teamMemberId)
                {
                  if(this.typeStatusId)
                  {
                    if(j==this.typeStatusId)
                    {
                      this.ticketStatus = this.ticketStatusList[j].id;
                  this.ticketStatusList[j].activeClass = true;
                  this.memberSelectFlag = false;
                    }
                  }
                  else
                  {
                    if(this.ticketStatusList[j].id == this.ticketStatus){
                      this.ticketStatus = this.ticketStatusList[j].id;
                      this.ticketStatusList[j].activeClass = true;
                      this.memberSelectFlag = false;
                    }
                  }
                }


              this.selectedStatusOptions.push({
                'name':this.ticketStatusList[j].name,
                'code':this.ticketStatusList[j].id
              })
            }

            if((type == 'team' && id == '') || (type == '' ) || (type == 'tstatus')){
              setTimeout(() => {
                this.teamForm.get('teamFromControl').patchValue(this.teamId);
              }, 100);
            }

          }

          if(type == 'member' || type == 'tmember'){
            this.selectedStatusOptions = [];
            for (let j in this.ticketStatusList) {
              this.selectedStatusOptions.push({
                'name':this.ticketStatusList[j].name,
                'code':this.ticketStatusList[j].id
              })
            }
            if(type == 'member'){
              this.tsForm.get('tsFormControl').patchValue(this.ticketStatus);
              setTimeout(() => {
              this.memberSelectFlag = true;
              }, 500);
            }
            if(type == 'tmember'){
              setTimeout(() => {
                this.memberSelectFlag = true;
                this.tsForm.get('tsFormControl').patchValue(this.ticketStatus);
              }, 500);
            }
          }

          if(id == ''){
            setTimeout(() => {
              this.loading = false;
              setTimeout(() => {
                this.levelForm.get('levelFormControl').patchValue(this.threadLevelType);
              }, 100);
            }, 1);
          }
      //}
      //else{

      //}
    });

  }

  applySearch(action, val) {}

  actionStatus(type){
      this.pageRefresh['moretype'] = type;
      this.pageRefresh['action'] = 'action-more';
      this.commonService.emitTSListData(this.pageRefresh);
  }

  // nav search page
  taponSearchPage(){
    let url = "search-page";
    this.router.navigate([url]);
  }
  techsupportrulespage(){
    var url = "techsupport/assignment-rules";
    window.open(url,url);
  }
  techsupportteampage(){
    var url = "techsupport-team";
    window.open(url,url);
  }
  requestPermission(state) {

    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (token && token != null) {
          this.enableDesktopPush = false;
        }
        else {
          this.enableDesktopPush = true;
        }

        console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('webAppversion', environment.webVersionCollabtic.toString());
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        //console.log(apiFormData);

        this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {

          //console.log(response);
        });


      },
      (err) => {
        this.enableDesktopPush = true;
        console.log('Unable to get permission to notify.', err);
      }
    );
  }

      /* FCM SETUP */
  browserDetection() {
    let browserName = '';
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
      // insert conditional IE code here
      browserName = "MSIE";
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
      // insert conditional Chrome code here
      browserName = "Chrome";
    }
    //Check if browser is Firefox
    else if (navigator.userAgent.search("Firefox") >= 0) {
      // insert conditional Firefox Code here
      browserName = "Firefox";
    }
    //Check if browser is Safari
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    }

    else {
      browserName = "others";
    }
    return browserName;
  }


  accessLevelValu(event){
    this.accessLevel = event;
  }

  changeAction(data){
    console.log(data);
    switch(data.type){
      case 'success':
        this.msgs1 = [{severity:'success', summary:'', detail:data.msg}];
        this.primengConfig.ripple = true;
        if(data.actiontype == 'action-close' || data.actiontype == 'action-delete') {
          this.techsupportMenus('service',this.teamId);
        }
        else{
          this.pageRefresh['orderBy'] = this.threadOrderType;
          this.pageRefresh['level'] = this.threadLevelType;
          this.pageRefresh['teamId'] = this.teamId;
          this.pageRefresh['ticketStatus'] = this.ticketStatus;
          this.pageRefresh['teamMemberId'] = this.teamMemberId;
          this.pageRefresh['action'] = 'api';
          console.log(this.threadOrderType,this.teamId,this.ticketStatus,this.teamMemberId);
          this.commonService.emitTSListData(this.pageRefresh);
        }


        setTimeout(() => {
          this.msgs1 = [];
        }, 3000);
      break;
      case 'checkbox':
        this.actionMoreFlag = data.checkFlag;
        break;
      default:
      break;
    }
  }

  selectEvent(event,type)
  {

    if(type == 'order'){
      this.threadOrderType = event.value.code;
    }
    else if(type == 'level'){
      this.threadLevelType = event.value;
    }
    else if(type == 'team'){
      this.teamId = event.value;
      this.techsupportMenus('team',this.teamId);
      this.ticketStatus = '1';
    }
    else{
      this.ticketStatus = event.value;
    }
    console.log(event.value.code);
    this.pageRefresh['orderBy'] = this.threadOrderType;
    this.pageRefresh['level'] = this.threadLevelType;
    this.pageRefresh['teamId'] = this.teamId;
    this.pageRefresh['ticketStatus'] = this.ticketStatus;
    this.pageRefresh['teamMemberId'] = this.teamMemberId;
    this.pageRefresh['action'] = 'api';
    this.actionMoreFlag = false;
    this.commonService.emitTSListData(this.pageRefresh);
  }

  selectTap(index,type){
    this.memberSelectFlag = false;
    for (let i in this.teamMembers) {
      this.teamMembers[i].activeClass = false;
    }
    for (let j in this.ticketStatusList) {
      this.ticketStatusList[j].activeClass = false;
    }
    if(type == 'member'){
      this.teamMemberId = this.teamMembers[index].userId;
      this.teamMembers[index].activeClass = true;
      this.ticketStatus = '2';
      this.techsupportMenus('member',this.teamMemberId);
    }
    else{
      this.teamMemberId = this.userId;
      this.ticketStatus = this.ticketStatusList[index].id;
      this.ticketStatusList[index].activeClass = true;
      this.typeStatusId=index;
    }
    this.pageRefresh['orderBy'] = this.threadOrderType;
    this.pageRefresh['level'] = this.threadLevelType;
    this.pageRefresh['teamId'] = this.teamId;
    this.pageRefresh['ticketStatus'] = this.ticketStatus;
    this.pageRefresh['teamMemberId'] = this.teamMemberId;
    this.pageRefresh['action'] = 'api';
    this.actionMoreFlag = false;
    console.log(this.threadOrderType,this.teamId,this.ticketStatus,this.teamMemberId);
    this.commonService.emitTSListData(this.pageRefresh);
  }
/**
   * Filter Expand/Collapse
   */
 expandAction() {
  this.expandFlag = this.expandFlag ? false : true;
 }

 serviceAction(data){
  this.techsupportMenus('service',this.teamId);
 }

 getUserProfileStatus(uid,index) {
  const apiFormData = new FormData();
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', uid);
  this.probingApi.GetUserAvailability(apiFormData).subscribe((response) => {
    let resultData = response.items;
    let availability = resultData.availability;
    let availabilityStatusName = resultData.availabilityStatusName;
    let badgeTopUser = resultData.badgeTopUser;
    this.teamMembers[index].availability = availability;
    this.teamMembers[index].availabilityStatusName = availabilityStatusName;
    this.teamMembers[index].profileShow = true;
  });
}
// tab on user profile page
taponprofileclick(userId){
  var aurl='profile/'+userId+'';
  window.open(aurl, aurl);
}

  ngOnDestroy(): void {

  }
}
