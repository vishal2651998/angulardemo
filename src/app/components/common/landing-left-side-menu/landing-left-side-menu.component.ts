import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, ParamMap, Router, RouterEvent } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { ChatType, Constant, IsOpenNewTab, LocalStorageItem, RedirectionPage, pageInfo, pageTitle, windowHeight } from '../../../common/constant/constant';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatscrollDirective } from 'src/app/common/directive/chatscroll.directive';
import { CommonService } from '../../../services/common/common.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { Location } from '@angular/common';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PopupComponent } from 'src/app/modules/chat/chat-page/popup/popup.component';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { Subscription } from "rxjs";
import { SuccessComponent } from '../../../components/common/success/success.component';
import { Title } from "@angular/platform-browser";
import { debounceTime } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-landing-left-side-menu',
  templateUrl: './landing-left-side-menu.component.html',
  styleUrls: ['./landing-left-side-menu.component.scss']
})
export class LandingLeftSideMenuComponent implements OnInit, AfterViewInit {

  @Input() pageData;
  @Input() workstreamId;
  @Input() chatScrollDirective: ChatscrollDirective;
  @Input() newChatData: any;
  @Input() chatpopupcomponent: PopupComponent;
  @ViewChild('chatpopup', { static: true }) chatpopup: PopupComponent;
  @ViewChild('ttworksteam') tooltip: NgbTooltip;
  @ViewChild('ttchat') chattooltip: NgbTooltip;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  public sidebarHeight;
  public activemenu = '';
  public domainId;
  public countryId;
  public currentWorkstreamIdInfo: any = '';
  public currentWorkstreamType: number = 1;
  public loadingws: boolean = true;
  public userId;
  public roleId;
  public emitvalue = 0;
  // public workstreamArr=[];
  public menuListloaded;
  public expandFlag: boolean = false;
  public expandplus;
  public expandminus;
  public expandminus1;
  public expandplusFlag: boolean = true;
  public expandminusFlag: boolean = false;
  public accorodianMenu = [];
  public normalMenu = [];
  public defaultWorkstream = '';
  public responseResults;
  public WorkstreamelectedFlag: boolean = false;
  public apiData: Object;
  public platformName: any = 'Collabtic';

  public currUrl: string;
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  public user: any;
  // public grstreamArr=[];
  // public dmstreamArr=[];
  chatpage = pageInfo.chatPage;
  workstreamAction: boolean;
  //  ChatGroupIdFromQueryParam:string;
  //  ChatTypeIdFromQueryParam:string;

  public whelpContentId = '';
  public whelpContentTitle = '';
  public whelpContentContent = '';
  public whelpContentIconName = '';
  public whelpContentStatus = '';
  public whelpContentFlagStatus: boolean = false;
  public tooltipFlag: boolean = false;
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus: boolean = false;
  public msTeamAccess: boolean = false;
  notificationData: any = {};
  loadSidebar: boolean = true;
  public chatWorkstreamType = parseInt(ChatType.Workstream);
  public currentWorkstreamTypeFlag: boolean = false;
  public chatGroupType = ChatType.GroupChat;
  public chatGroupTypeFlag: boolean = false;
  public chatDirectType = ChatType.DirectMessage;
  public chatDirectTypeFlag: boolean = false;
  displaydiaLogNotifications: boolean = false;

  checked1: boolean = true;
  public currentSettingArr = [];
  public currentSettingId: string = '';
  public currentSettingName: string = '';
  public currentSettingType: string = '';
  public modalConfig: any = { backdrop: 'static', keyboard: false, centered: true };
  public platformId: string = '';
  public techDomain: boolean = false;
  public pushThreadArrayNotification=[];
  public pushThreadArrayWsEvent=[];
  @Output() ReloadChatSection = new EventEmitter<any>();
  constructor(
    private commonService: CommonService,
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    public apiUrl: ApiService,
    private landingpageServiceApi: LandingpageService,
    private _location: Location,
    public chatService: ChatService,
    private notification: NotificationService,
    private modalService: NgbModal,
  ) {
    this.workstreamAction = false;
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
    let wsmenu = document.getElementsByClassName("workstream-bg active");
    this.WorkstreamelectedFlag = false;
    for (let i = 0; i < wsmenu.length; i++) {
      wsmenu[i].classList.remove('active')
    }

    const type = this.route.snapshot.paramMap.get('type') as ChatType;
    const id = this.route.snapshot.paramMap.get('id')
    if (type && id) {
      this.SetChatSessionforRedirect(id, type);
    }
  }

  ngAfterViewInit(): void {
    //const element = document.querySelector('div.p-accordion.p-component') as HTMLElement
    //element.style.height = `${this.sidebarHeight - 90}px`;
    //element.style.overflowY = 'auto';
  }

  async ngOnInit() {

    this.platformName = localStorage.getItem('platformName');
    this.platformId = localStorage.getItem('platformId');

    //alert(localStorage.getItem(LocalStorageItem.reloadChatGroupId));
    if (
      localStorage.getItem(LocalStorageItem.reloadChatGroupId) != null &&
      localStorage.getItem(LocalStorageItem.reloadChatGroupId) != undefined &&
      localStorage.getItem(LocalStorageItem.reloadChatGroupId) != ''
    ) {
      this.currentWorkstreamIdInfo=localStorage.getItem(LocalStorageItem.reloadChatGroupId);
    }




    this.chatService.channel = new BroadcastChannel('collabtic_sidebar_channel');
    this.chatService.channel.onmessage = (event) => {
      if (this.chatService.groupType == event.data.type) {
        this.chatService.grstreamArr.map((arr) => {
          if (event.data.groupId == arr.Id) {
            arr.grCount = 0;
            arr.grNew = false;
          }
        })
        this.chatService.totalNewGroupMessage = event.data.totalNewGroupMessage
      }

      if (this.chatService.directMessageType == event.data.type) {
        this.chatService.dmstreamArr.map((arr) => {
          if (event.data.groupId == arr.Id) {
            arr.grCount = 0;
            arr.grNew = false;
          }
        })
        this.chatService.totalNewDMMessage = event.data.totalNewDMMessage
      }

      if (this.chatService.workstreamType == event.data.type) {
        let totalNewWorkstreamMessage = 0;
        for (let iar in this.chatService.workstreamArr) {
          if (this.chatService.workstreamArr[iar].wsId == event.data.groupId) {
            totalNewWorkstreamMessage = this.chatService.totalNewWorkstreamMessage - Math.abs(this.chatService.workstreamArr[iar].wsCount);
            if (totalNewWorkstreamMessage > 0) {
              this.chatService.totalNewWorkstreamMessage = totalNewWorkstreamMessage;
            } else {
              // this.chatService.totalNewWorkstreamMessage = 0;
            }
            this.chatService.workstreamArr[iar].wsCount = this.chatService.workstreamArr[iar].wsCount - event.data.oldCount;
          }

        }
      }

      if (event.data.removeChat) {
        this.chatService.dmstreamArr = this.chatService.dmstreamArr.filter((arr) => {
          return arr.Id != event.data.groupId
        })
      }

      if (event.data.reloadChat) {
        if (event.data.chatData) {
          this.newChatData = event.data.chatData;
          this.ReloadGrouAndDMChatMenu(this.newChatData.id, this.newChatData.chatType);
        } else if (event.data.groupId) {
          const index = this.chatService.dmstreamArr.findIndex((item) => item.Id == event.data.groupId)
          this.chatService.moveArrayItemToNewIndex(this.chatService.dmstreamArr, index, 0);
        }
      }
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let wsId: any = '';

    this.techDomain = this.domainId == '318' ? true : false;

    if (this.pageData.access == 'chat-page') {

      let teamSystem = localStorage.getItem('teamSystem');
      if (teamSystem) {
        this.msTeamAccess = true;
        this.helpContent(0);
      }
      else {
        this.msTeamAccess = false;
      }

    } else {
      let getModifiedWsId: any = localStorage.getItem('workstreamModifiedId');
      wsId = (getModifiedWsId == null) ? '' : getModifiedWsId;
    }
    this.commonService._OnChatNotificationReceivedSubject.subscribe((r) => {

      this.ngOnInit();
     // alert(r);

    });
    // help content
    this.commonService.welcomeContentReceivedSubject.subscribe((response) => {
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if (welcomePopupDisplay == '1') {
        if (this.msTeamAccess) {
          setTimeout(() => {
            this.helpContent(0);
          }, 900);
        }
      }
    });

    let type1=0;
    this.commonService._OnLeftSideMenuBarSubject.subscribe((r) => {

      //this.getWorkstreamwithCountLists('');



      if (r) {

       // this.getWorkstreamwithCountLists('');
        let workstreamInfoData = JSON.parse(JSON.stringify(r));
        // console.log(workstreamInfoData);
        // console.log(this.chatService.workstreamArr);
        //alert(workstreamInfoData[0].count+'--'+workstreamInfoData[0].workstreamId);
        if (workstreamInfoData[0].count) {
          for (let iar in this.chatService.workstreamArr) {
            if (this.chatService.workstreamArr[iar].wsId == workstreamInfoData[0].workstreamId) {
              //alert(this.chatService.totalNewWorkstreamMessage);
              //this.chatService.workstreamArr[iar].removeCount=true;
              if (this.chatService.workstreamArr[iar].wsCount) {
                this.chatService.workstreamArr[iar].wsCount = this.chatService.workstreamArr[iar].wsCount - workstreamInfoData[0].count;
                /// console.log('count updated...')
              }
              if (this.chatService.totalNewWorkstreamMessage && this.chatService.totalNewWorkstreamMessage > 0) {

                this.chatService.totalNewWorkstreamMessage = this.chatService.totalNewWorkstreamMessage - Math.abs(this.chatService.workstreamArr[iar].wsCount);
              }

              /*
                  if(!this.chatService.totalNewWorkstreamMessage)
               {
                this.chatService.workstreamArr[iar].removeCount=true;
               }
               */

            }
          }
        }
      }
    });
    this.subscription.add(
      this.commonService._OnMessageReceivedSubject.subscribe(async (r) => {
        var setdata = JSON.parse(JSON.stringify(r));
        //alert(setdata);
        this.responseResults = setdata;
        var checkpushtype = setdata.pushType;
        var checkmessageType = setdata.messageType;
        var checkchatType = setdata.chatType;
        if (checkpushtype == 21) {
          console.log('----2');
          this.getWorkstreamwithCountLists('');
        }
        if (checkpushtype == 9 || checkpushtype == 10) {
          //this.loadingws=true;
          //this.chatService.workstreamArr=[];
          // this.chatService.totalNewWorkstreamMessage=0;
          console.log('----3');
          this.getWorkstreamwithCountLists(this.emitvalue);
        }

        if (checkchatType == 2) {
          // this.chatService.dmstreamArr=[];
          // this.chatService.totalNewDMMessage=0;
          await this.getGroupAndDirectChatwithCountLists(checkchatType, '', '');
        }
        if (checkchatType == 3) {

          // this.chatService.grstreamArr=[];
          // this.chatService.totalNewGroupMessage=0;
          await this.getGroupAndDirectChatwithCountLists(checkchatType, '', '');
        }





      })
    );
    // help content check
    this.commonService.helpContentReceivedSubject.subscribe((response) => {
      let helpContentName = response['helpContentName'];
      if (helpContentName == 'workstreams') {
        this.tooltip.open();
      }
    });


    //alert(JSON.stringify(this.pageData));
    if (this.pageData.pageInfo != pageInfo.landingPage) {
      this.WorkstreamelectedFlag = true;
    }
    if (localStorage.getItem(LocalStorageItem.reloadChatGroupId) == null || localStorage.getItem(LocalStorageItem.reloadChatGroupId) == undefined || localStorage.getItem(LocalStorageItem.reloadChatGroupId) == '') {
      let workstreamId = localStorage.getItem("landing-page-workstream");
      this.defaultWorkstream = workstreamId;
      if(this.pageData.pageInfo == pageInfo.workstreamPage && (workstreamId == '' || workstreamId == null || workstreamId == undefined)) {
        workstreamId = localStorage.getItem("currentWorkstream");
      }
      this.currentWorkstreamIdInfo = workstreamId;
      let selectedMenuTy = localStorage.getItem('selectedMenuTy');
      this.currentWorkstreamType = selectedMenuTy != undefined && selectedMenuTy != null ? parseInt(selectedMenuTy) : 1;
    }
    else {
      // if (this.ChatGroupIdFromQueryParam!= null && this.ChatGroupIdFromQueryParam!= undefined&& this.ChatGroupIdFromQueryParam!= "")
      // {
      //   this.defaultWorkstream= this.ChatGroupIdFromQueryParam;
      //   this.currentWorkstreamIdInfo=this.defaultWorkstream;
      // }else{
      //   this.defaultWorkstream=localStorage.getItem('defaultWorkstream');
      // this.currentWorkstreamIdInfo=this.defaultWorkstream;
      // }
      setTimeout(() => {
        if (localStorage.getItem(LocalStorageItem.reloadChatGroupId) != null && localStorage.getItem(LocalStorageItem.reloadChatGroupId) != undefined && localStorage.getItem(LocalStorageItem.reloadChatGroupId) != "") {
          this.defaultWorkstream = localStorage.getItem(LocalStorageItem.reloadChatGroupId);
          this.currentWorkstreamIdInfo = this.defaultWorkstream;
          let selectedMenuTy = localStorage.getItem('selectedMenuTy');
          this.currentWorkstreamType = selectedMenuTy != undefined && selectedMenuTy != null ? parseInt(selectedMenuTy) : 1;

        } else {
          this.defaultWorkstream = localStorage.getItem('defaultWorkstream');
          this.currentWorkstreamIdInfo = this.defaultWorkstream;
          let selectedMenuTy = localStorage.getItem('selectedMenuTy');
          this.currentWorkstreamType = selectedMenuTy != undefined && selectedMenuTy != null ? parseInt(selectedMenuTy) : 1;

        }
        //localStorage.removeItem('landing-page-workstream');
      }, 0);



    }
    setTimeout(() => {
      //localStorage.removeItem('landing-page-workstream');
    }, 500);
    let landingpageworkstream = localStorage.getItem('landing-page-workstream');

    this.commonService._OnMessageReceivedSubject.subscribe((r) => {
      var setdata = JSON.parse(JSON.stringify(r));
      var checkpushtype = setdata.pushType;
      var checkmessageType = setdata.messageType;
      var checkgroups = setdata.groups;
      console.log('message received! ####', r);
      this.notificationData = setdata;

      if (this.currentWorkstreamIdInfo == Number(this.notificationData.chatGroupId)) {
        let audio = document.createElement('audio');
        //audio.src = 'assets/sounds/silentpushactivechat.mp3';
        //audio.play();
      }

      if (checkpushtype == 1 && checkmessageType == 1) {
        if (checkgroups) {
          let groupArr = JSON.parse(checkgroups);
          let findgroups = groupArr.indexOf(this.currentWorkstreamIdInfo);
          /* if(findgroups!=-1)
          {
            this.emitvalue=1;
          }
          else
          {
            this.emitvalue=0;
          } */
          this.emitvalue = 0;
          console.log('----4');
          this.getWorkstreamwithCountLists(this.emitvalue);
        }
      }
    });
    let options = this.pageData;
    // console.log(options+'----++');
    //console.log(options.page+'----++');
    //alert(options.menu)
    this.activemenu = (options.menu == 'landing-page') ? 'Home' : options.menu;

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId
    }
    this.apiData = apiInfo;
    let url = this.router.url.split('/');
    let currUrl = url[1];
    let teamSystem = localStorage.getItem('teamSystem');
    console.log(currUrl);
    let rmHeight;
    switch (currUrl) {
      case 'landing-page':
      case 'workstreams-page':
      case 'chat-page':
      case 'threads':
      case 'parts':
      case 'directory':
      case 'search-page':
        rmHeight = 85;
        break;
      default:
        rmHeight = 130;
        break;
    }
    this.sidebarHeight = (teamSystem) ? rmHeight : rmHeight;
    setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      this.sidebarHeight = (teamSystem) ? rmHeight + headerHeight : rmHeight + headerHeight;
    }, 1000);
    if (this.responseResults) {
      let response = this.responseResults;
      if (response.status == "Success") {
        this.menuListloaded = response.menus;
        // console.log(this.menuListloaded);
        for (let m in this.menuListloaded) {
          let mname = this.menuListloaded[m].name;
          let mid = this.menuListloaded[m].id;
          let mexpandFlag = this.menuListloaded[m].expandFlag;

          let msubmenuimageClass = this.menuListloaded[m].submenuimageClass;
          if (this.menuListloaded[m].accordianFlag == 1) {

            this.accorodianMenu.push({ id: mid, name: mname, expandFlag: mexpandFlag, submenuimageClass: msubmenuimageClass });
          }
          else {
            this.normalMenu.push({ id: mid, name: mname, expandFlag: mexpandFlag, submenuimageClass: msubmenuimageClass });
          }
          console.log('this.normalMenu');
          console.log(this.normalMenu);
        }
        let url = this.currUrl.replace("mis/", "");
        for (let menu of this.menuListloaded) {

          menu.activeClass = (url == menu.urlPath) ? 1 : 0;
        }

        for (let e in this.accorodianMenu) {
          let mexpandFlag1 = this.accorodianMenu[e].expandFlag;
          // alert(mexpandFlag1);
          if (mexpandFlag1 == 1) {
            this.expandminus1 = e;
          }

        }
      }

    }
    else {
      this.getHeadMenuLists();
    }


    this.subscription = this.notification.visibility.pipe(debounceTime(2000)).subscribe(async res => {
      if (res) {
       // console.log('reload sidebar...')
       console.log('----5');
        this.getWorkstreamwithCountLists(this.emitvalue, wsId);
        await this.getGroupAndDirectChatwithCountLists(this.chatService.groupType, this.emitvalue, "");
        await this.getGroupAndDirectChatwithCountLists(this.chatService.directMessageType, this.emitvalue, "");
      }
    })

    console.log('----6');
    this.getWorkstreamwithCountLists(this.emitvalue, wsId);
    await this.getGroupAndDirectChatwithCountLists(this.chatService.groupType, this.emitvalue, "");
    await this.getGroupAndDirectChatwithCountLists(this.chatService.directMessageType, this.emitvalue, "");
  }
/*
  @HostListener('document:visibilitychange', ['$event'])

  visibilitychange() {


    let type1=0;
    navigator.serviceWorker.addEventListener('message', (event) => {

      console.log(this.pushThreadArrayNotification);
      let currUrl = this.router.url.split('/');
      if(((currUrl[2]!='view' && currUrl[2]!='view-v2')))
      {
      type1=type1+1;




        let threadInfo=event.data.data;

      console.log(event);



  console.log('----5');
  let getModifiedWsId: any = localStorage.getItem('workstreamModifiedId');
     let wsId = (getModifiedWsId == null) ? '' : getModifiedWsId;
  this.getWorkstreamwithCountLists(this.emitvalue, wsId);
  this.getGroupAndDirectChatwithCountLists(this.chatService.groupType, this.emitvalue, "");
 this.getGroupAndDirectChatwithCountLists(this.chatService.directMessageType, this.emitvalue, "");
        //this.tapontoast(event.data.data);




      this.pushThreadArrayNotification.push(threadInfo.threadId)
      }
     // this.tapontoast(event.data.data);
     event.stopPropagation();
    });

    setTimeout(() => {
      console.log(this.pushThreadArrayNotification);
      this.pushThreadArrayNotification=[];
    }, 5000);

  }
  */
  taponleftmenu(event) {
    console.log(event.id);
    localStorage.removeItem('selectedMenuTy');
    if (event.id == 1){
      setTimeout(() => {
        this.commonService.emitHomeCallData('');
      }, 10);
      //this.apiUrl.domainMembersShowFlag = true;
    }
    else{
      //this.apiUrl.domainMembersShowFlag = false;
    }
    if (event.id == 1 || event.id == 16) {
      let menuId = `accord-menu-${event.id}`;
      let menuClass = document.getElementsByClassName(menuId);
      setTimeout(() => {
        console.log(menuClass)
        menuClass[0].classList.add('active')
      }, 50);
      if (this.pageData.pageInfo != pageInfo.landingPage) {
        this.apiUrl.searchFromWorkstream = false;
        this.apiUrl.searchFromWorkstreamValue = '';
        var aurl = 'landing-page';
        //  window.open(aurl);
        let data = {
          action: 'ws-tab'
        }
        let title = `${localStorage.getItem('platformName')} - Home`;
        this.titleService.setTitle(title);
        this.commonService.emitSidebarMenuData(data);

        this.router.navigate([aurl]);

      }
    }
  }

  ngOnDestroy() {
    if(this.subscription)
    {
      this.subscription.unsubscribe();
    }

  }
  getHeadMenuLists() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    this.commonService.getMenuLists(apiFormData).subscribe((response) => {

      this.responseResults = response;

      if (response.status == "Success") {
        this.menuListloaded = response.menus;
        console.log(this.menuListloaded);
        for (let m in this.menuListloaded) {
          let mname = this.menuListloaded[m].name;
          let mid = this.menuListloaded[m].id;
          let mexpandFlag = this.menuListloaded[m].expandFlag;
          let msubmenuimageClass = this.menuListloaded[m].submenuimageClass;
          if (this.menuListloaded[m].accordianFlag == 1) {

            //if(mid == '3'){
            let toolTips = this.menuListloaded[m].toolTips;
            console.log(toolTips);
            this.tooltipFlag = (toolTips == undefined || toolTips == 'undefined' || toolTips == 'null' || toolTips == null) ? false : true;
            console.log(this.tooltipFlag);
            if (this.tooltipFlag && !this.msTeamAccess) {
              if (toolTips.length > 0) {
                let helpContent = toolTips[0];
                this.whelpContentStatus = helpContent['viewStatus'];
                console.log(this.whelpContentStatus);
                this.whelpContentFlagStatus = (this.whelpContentStatus == '0') ? true : false;
                if (this.whelpContentStatus == '0') {
                  this.whelpContentId = helpContent['id'];
                  this.whelpContentTitle = helpContent['title'];
                  this.whelpContentContent = helpContent['content'];
                  this.whelpContentIconName = helpContent['itemClass'];
                }
              }
            }
            //}

            this.accorodianMenu.push({ id: mid, name: mname, expandFlag: mexpandFlag, submenuimageClass: msubmenuimageClass });
          }
          else {
            this.normalMenu.push({ id: mid, name: mname, expandFlag: mexpandFlag, submenuimageClass: msubmenuimageClass });
          }
          console.log('this.normalMenu');
          console.log(this.normalMenu);
        }

        setTimeout(() => {
          if (this.tooltipFlag && !this.msTeamAccess) {
            if (this.whelpContentStatus == '0') {
              let tname = localStorage.getItem('helpContentName');
              console.log(tname);
              if (tname == 'workstreams') {
                this.tooltip.open();
              }
            }
            if (this.whelpContentStatus == '1') {
              localStorage.setItem('helpContentName', 'announcements');
            }
          }
        }, 2000);

        let url = this.currUrl?.replace("mis/", "");
        for (let menu of this.menuListloaded) {
          menu.activeClass = (url == menu.urlPath) ? 1 : 0;
        }

        for (let e in this.accorodianMenu) {
          let mexpandFlag1 = this.accorodianMenu[e].expandFlag;
          // alert(mexpandFlag1);
          if (mexpandFlag1 == 1) {
            this.expandminus1 = e;
          }

        }
      }
    });




  }


  // totalNewWorkstreamMessage:number = 0 ;
  // totalNewGroupMessage:number = 0 ;
  // totalNewDMMessage:number = 0 ;

  getWorkstreamwithCountLists(emitValue, wsId: any = '') {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    if (this.pageData.pageInfo == pageInfo.chatPage) {
      apiFormData.append('fromChatPage', '1');
      apiFormData.append('isGroupChat', '1');

    }

    apiFormData.append('platform', '3');

    this.commonService.GetworkstreamswithCount(apiFormData).subscribe((response) => {
      let res = response;
      let resData = response.data;

      if (res.status = "Success") {
        //this.chatService.workstreamArr =[];
        this.loadingws = false;
        for (let ws in resData) {
          let ws_id = resData[ws].workstreamId;
          let ws_name = resData[ws].workstreamName;
          let chat_conf = resData[ws].chatConfigurations;
          //console.log(chat_conf);
          let ws_img = resData[ws].imgNameWhite;
          let ws_totalCount = resData[ws].totalCount;
          let ws_contentType = resData[ws].contentType;
          let ws_editAccess = resData[ws].editAccess;
          ws_contentType.forEach(citem => {
            citem.searchCount = 0;
          });
          resData[ws].workstreamAction = false;
          if ((this.pageData.pageInfo == pageInfo.landingPage || this.pageData.pageInfo == pageInfo.workstreamPage) && (ws == '0' && wsId == '') && (wsId != '' && ws_id == wsId)) {
            //console.log(56456)
            localStorage.setItem('wscontentTypeValues', JSON.stringify(ws_contentType));

            //console.log(JSON.stringify(ws_contentType));
          }


          //console.log(ws_contentType);
          let ws_profileimage = resData[ws].profileImg;

          if (ws_totalCount > 100) {
            ws_totalCount = 99 + '+';
          }
          let ws_isNew = resData[ws].isNew;
          if (this.chatService.workstreamArr.length > 0) {

            for (let wsd in this.chatService.workstreamArr) {
              let studentObj = this.chatService.workstreamArr.find(t => t.wsId == ws_id);

              if (studentObj) {
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).wsName = resData[ws].workstreamName;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).workstreamIcon = resData[ws].workstreamIcon;


                this.chatService.workstreamArr.find(item => item.wsId == ws_id).cConfig = resData[ws].chatConfigurations;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).wsImg = resData[ws].imgNameWhite;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).wsCount = resData[ws].totalCount;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).wsNew = resData[ws].isNew;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).contentType = resData[ws].contentType;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).wsEditAccess = resData[ws].editAccess;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).wsAction = resData[ws].workstreamAction;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).newthreadpush = false;
                this.chatService.workstreamArr.find(item => item.wsId == ws_id).removeCount = false;

                /* this.chatService.workstreamArr[wsd].wsName=ws_name;
                  this.chatService.workstreamArr[wsd].wsImg=ws_img;
                  this.chatService.workstreamArr[wsd].wsCount=resData[ws].totalCount;
                  this.chatService.workstreamArr[wsd].wsNew=ws_isNew;
                  this.chatService.workstreamArr[wsd].contentType=ws_contentType;
                  this.chatService.workstreamArr[wsd].wsEditAccess=ws_editAccess;
                  this.chatService.workstreamArr[wsd].wsAction=resData[ws].workstreamAction;
                  this.chatService.workstreamArr[wsd].newthreadpush=false;
                  this.chatService.workstreamArr[wsd].removeCount=false;
              */
              }
              else {
                this.chatService.workstreamArr.push({ wsId: ws_id, wsName: ws_name, cConfig: chat_conf, wsImg: ws_img, wsCount: resData[ws].totalCount,workstreamIcon:resData[ws].workstreamIcon, wsNew: ws_isNew, contentType: ws_contentType, wsEditAccess: ws_editAccess, wsAction: resData[ws].workstreamAction, newthreadpush: false, removeCount: false });
              }
            }
          }
          else {
            this.chatService.workstreamArr.push({ wsId: ws_id, wsName: ws_name, cConfig: chat_conf, wsImg: ws_img, wsCount: resData[ws].totalCount,workstreamIcon:resData[ws].workstreamIcon, wsNew: ws_isNew, contentType: ws_contentType, wsEditAccess: ws_editAccess, wsAction: resData[ws].workstreamAction, newthreadpush: false, removeCount: false });
          }
          if (this.currentWorkstreamIdInfo == ws_id) {
            if(ws_contentType[0].contentTypeId == '2'){
              if(ws_contentType[0].threadSubTypeData  != undefined || ws_contentType[0].threadSubTypeData  != 'undefined'){
                localStorage.setItem('threadSubTypeData',JSON.stringify(ws_contentType[0].threadSubTypeData));
              }
            }
            if (emitValue) {
              // let pushitem : InputChat ={ id :ws_id,name:ws_name,chatType:ChatType.Workstream};
              this.ClearChatSessionforRedirect();
              let pushitem: InputChat = { id: ws_id, name: ws_name, chatType: ChatType.Workstream, profileImg: ws_profileimage, contentType: ws_contentType };
              this.ClearChatSessionforRedirect();
              this.ReloadChatSection.emit(pushitem);

              // // var aurl='chat-page/'+ws_id+"/"+ChatType.Workstream;
              // // this.router.navigate([aurl]);
              // this.SetChatSessionforRedirect(ws_id,ChatType.Workstream);
              // var aurl='chat-page';
              // this.router.navigate([aurl]);
            }

          }




        }

        if (this.currentWorkstreamIdInfo != Number(this.notificationData?.chatGroupId)) {
          let totalNewWorkstreamMessage = 0;
          for (let i = 0; i < this.chatService.workstreamArr.length; i++) {
            if (this.chatService.workstreamArr[i].wsNew) {
              totalNewWorkstreamMessage += this.chatService.workstreamArr[i].wsCount;
            }
          }
          if (totalNewWorkstreamMessage > 0) {
            this.chatService.totalNewWorkstreamMessage = totalNewWorkstreamMessage;
          } else {
            this.chatService.totalNewWorkstreamMessage = 0;
          }
        }
      }
      else {
        this.loadingws = false;
      }


      const workStream = this.chatService.workstreamArr.some(workstream => workstream.wsId == this.currentWorkstreamIdInfo);

      if (workStream) {
        this.accorodianMenu.map((menu) => {
          this.expandminus1 = 0;
          return menu.expandFlag = (menu.id == 3 || menu.id == 18) ? true : false
        })
      }

    });

    for (let ws in this.chatService.workstreamArr) {
      if (this.chatService.workstreamArr[ws].wsId == this.currentWorkstreamIdInfo) {
        this.chatService.workstreamArr[ws].totalCount = 0;
        this.chatService.workstreamArr[ws].removeCount = true;
      }
    }


  }
  //mouse enter
  mouseenterWS(wid) {
    //console.log(wid);
    for (let ws in this.chatService.workstreamArr) {
      this.chatService.workstreamArr[ws].wsAction = false
      if (this.chatService.workstreamArr[ws].wsId == wid) {
        this.chatService.workstreamArr[ws].wsAction = true;
      }
    }
  }

  //mouse enter
  mouseleaveWS(wid) {
    //console.log(wid);
    for (let ws in this.chatService.workstreamArr) {
      if (this.chatService.workstreamArr[ws].wsId == wid) {
        this.chatService.workstreamArr[ws].wsAction = false;
      }
    }
  }

  onTabClose(event) {
    //alert(1);
    this.expandplus = event.index;
    $('.minusone' + this.expandplus + '').addClass('hide');
    $('.minusone' + this.expandplus + '').removeClass('showinline');
    $('.plusone' + this.expandplus + '').removeClass('hide');
    $('.plusone' + this.expandplus + '').addClass('showinline');

    this.expandplusFlag = true;
    //this.expandminusFlag=false;
    //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }
  onTabOpenFromOtherComponenet(index) {
    //alert(2);

    this.expandminus = index;
    //alert(this.expandminus);
    let reloadChatType=localStorage.getItem(LocalStorageItem.reloadChatType);

    //alert(reloadChatType);
    if(reloadChatType=='1')
    {

      let gheight= $('#p-accordiontab-0-content').css("height");

       $('#p-accordiontab-0-content').css("height", "");

    }
    if(reloadChatType=='2')
    {

       $('#p-accordiontab-2-content').css("height", "");

    }
    if(reloadChatType=='3')
    {

      $('#p-accordiontab-1-content').css("height", "");


    }

    //$('.minusone' + this.expandminus + '').removeClass('hide');
    //$('.minusone' + this.expandminus + '').addClass('showinline');
   // $('.plusone' + this.expandminus + '').addClass('hide');
    //$('.plusone' + this.expandminus + '').removeClass('showinline');
    this.expandplus = 2222;
    //this.expandplusFlag = false;
    //this.expandminusFlag = true;

    // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }
  onTabOpen(event) {
    //alert(2);

    this.expandminus = event.index;
    $('.minusone' + this.expandminus + '').removeClass('hide');
    $('.minusone' + this.expandminus + '').addClass('showinline');
    $('.plusone' + this.expandminus + '').addClass('hide');
    $('.plusone' + this.expandminus + '').removeClass('showinline');
    this.expandplus = 2222;
    this.expandplusFlag = false;
    this.expandminusFlag = true;

    // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }
  LoadWorkstreamChat(workstream: any) {

    console.log("LoadWorkstreamChat");
    let currUrl = this.router.url.replace('/', '');
    let loadFlag = (currUrl == 'landing-page') ? true : false;
    this.currentWorkstreamIdInfo = workstream.wsId;
    this.chatService.currentWorkstreamIdInfo = this.currentWorkstreamIdInfo;
    this.chatService.type = this.chatService.workstreamType;
    this.currentWorkstreamType = parseInt(this.chatService.workstreamType);
    localStorage.setItem('selectedMenuTy', this.currentWorkstreamType.toString());
    this.currentWorkstreamTypeFlag = (this.pageData.pageInfo == 2) ? true : false;
    $('.workstream-bg').removeClass('active');
    $('.workstream-bg' + workstream.wsId + '' + this.chatService.type).addClass('active');

    //alert(this.currentWorkstreamType);
    if (this.chatService.workstreamArr) {
      for (let iar in this.chatService.workstreamArr) {
        if (this.chatService.workstreamArr[iar].wsId == this.currentWorkstreamIdInfo) {
          this.chatService.workstreamArr[iar].removeCount = true;
          this.chatService.workstreamArr[iar].wsNew = false;
          console.log("workstream.wsCount", workstream.wsCount);
          if (this.chatService.totalNewWorkstreamMessage > 0) {
            this.chatService.totalNewWorkstreamMessage = this.chatService.totalNewWorkstreamMessage - Math.abs(workstream.wsCount);
          }
        }
      }
    }
    this.chatService.channel.postMessage({
      type: this.chatService.type,
      groupId: this.currentWorkstreamIdInfo,
      totalNewGroupMessage: this.chatService.totalNewWorkstreamMessage,
      oldCount: workstream.wsCount
    });


    if (this.pageData.pageInfo == pageInfo.workstreamPage) {
      localStorage.setItem('currentWorkstream', workstream.wsId);
      localStorage.setItem('currentWorkstreamContents', JSON.stringify(workstream.contentType));
      localStorage.setItem('landing-page-workstream', workstream.wsId);
      localStorage.setItem('workstreamItem', workstream.wsId);
      localStorage.setItem('workstreamItemName', workstream.wsName);
    }

    if (this.pageData.pageInfo == pageInfo.landingPage) {
      console.log(workstream)
      localStorage.setItem('currentWorkstream', workstream.wsId);
      localStorage.setItem('workstreamItem', workstream.wsId);
      localStorage.setItem('workstreamItemName', workstream.wsName);
      this.titleService.setTitle(localStorage.getItem('platformName') + ' - Home');
      let chkws = localStorage.getItem('landing-page-workstream');
      localStorage.setItem('wscontentTypeValues', JSON.stringify(workstream.contentType));
      localStorage.setItem('currentWorkstreamContents', JSON.stringify(workstream.contentType));
      localStorage.setItem('landing-page-workstream', workstream.wsId);
      var aurl = 'workstreams-page';
      let routeLoadIndex = pageTitle.findIndex(option => option.slug == aurl);
      // console.log(pageTitle[routeLoadIndex])
      if (routeLoadIndex >= 0) {
        let routeLoadText = pageTitle[routeLoadIndex].routerText;
        localStorage.setItem(routeLoadText, 'true');
      }
      this.activemenu = 'workstream';
      this.router.navigate([aurl]);
    }
    else {
      if(this.pageData.pageInfo != pageInfo.workstreamPage) {
        localStorage.removeItem('landing-page-workstream');
        //localStorage.removeItem('currentWorkstream');
      }
    }
    this.ClearChatSessionforRedirect();
    this.SetChatSessionforRedirect(workstream.wsId, ChatType.Workstream);

    // if (this.pageData.access == 'chat-page') {


    //   for (let iar in this.chatService.workstreamArr) {
    //     if (this.chatService.workstreamArr[iar].wsId == workstream.wsId) {
    //       this.chatService.workstreamArr[iar].removeCount = true;
    //       if (this.chatService.totalNewWorkstreamMessage > 0) {
    //         this.chatService.totalNewWorkstreamMessage = this.chatService.totalNewWorkstreamMessage - Math.abs(this.chatService.workstreamArr[iar].wsCount);
    //       }
    //       // this.chatService.workstreamArr[iar].wsCount = 0;
    //     }

    //   }
    // }
    //this.chatService.workstreamArr.push({wsId:ws_id,wsName:ws_name,wsImg:ws_img,wsCount:ws_totalCount,wsNew:ws_isNew,contentType:ws_contentType,newthreadpush:false});


    let pushitem: InputChat = { id: workstream.wsId, name: workstream.ws_name, chatType: ChatType.Workstream, profileImg: workstream.profileImg, contentType: workstream.contentType };
    //console.log(pushitem)
    console.log(pushitem);
    this.ReloadChatSection.emit(pushitem);

    // var aurl='chat-page/'+workstream.wsId+"/"+ChatType.Workstream;
    // this.router.navigate([aurl]);
    if (this.pageData.access == 'chat-page') {
      this._location.replaceState('/chat-page')
    }
    setTimeout(() => {
      workstream.wsCount = 0;
    }, 1000);
    // workstream.wsCount = 0;
    //this.getWorkstreamwithCountLists('');
  }
  SelectDefaultWorkstreamChat() {

    $('.workstream-bg').removeClass('active');
    $('.workstream-bg' + localStorage.getItem('defaultWorkstream') + '' + this.chatWorkstreamType).addClass('active');

  }
  LoadGroupChat(group: any) {
    $('.group-bg').removeClass('active');
    this.chatService.currentWorkstreamIdInfo = group.Id;
    this.chatService.type = this.chatService.groupType;
    this.currentWorkstreamType = parseInt(this.chatService.groupType);
    localStorage.setItem('selectedMenuTy', this.currentWorkstreamType.toString());
    if (this.pageData.pageInfo == 3) {
      $('.workstream-bg').removeClass('active');
      //$('.group-bg' + group.Id + ''+this.chatService.type).addClass('active');
      this.currentWorkstreamIdInfo = group.Id;
    }

    for (let iar in this.chatService.grstreamArr) {
      if (this.chatService.grstreamArr[iar].Id == group.Id) {
        this.chatService.grstreamArr[iar].removeCount = true;
        this.chatService.grstreamArr[iar].type = this.currentWorkstreamType;
        this.chatService.totalNewGroupMessage = this.chatService.totalNewGroupMessage - group.grCount;
      }
    }

    this.chatService.channel.postMessage({
      type: this.chatService.groupType,
      groupId: group.Id,
      totalNewGroupMessage: this.chatService.totalNewGroupMessage
    })

    if (this.pageData.pageInfo == pageInfo.landingPage || this.pageData.pageInfo == pageInfo.workstreamPage) {

      // var aurl='chat-page/'+group.Id+"/"+ChatType.GroupChat;
      // this.router.navigate([aurl]);
      this.SetChatSessionforRedirect(group.Id, ChatType.GroupChat);
      var aurl = 'chat-page';
      // this.router.navigate([aurl]);
      window.open(aurl, aurl);

    }
    else {
      this.ClearChatSessionforRedirect();
      this.SetChatSessionforRedirect(group.Id, ChatType.GroupChat);
      let pushitem: InputChat = { id: group.Id, name: group.grName, chatType: ChatType.GroupChat, profileImg: group.profileImg, contentType: {} };
      this.ReloadChatSection.emit(pushitem);
      this._location.replaceState('/chat-page')
      // var aurl='chat-page/'+group.Id+"/"+ChatType.GroupChat;
      // this.router.navigate([aurl]);
    }

  }
  LoadDirectChat(group: any) {
    $('.chat-bg').removeClass('active');

    this.chatService.type = this.chatService.directMessageType;
    this.chatService.currentWorkstreamIdInfo = group.Id;
    this.currentWorkstreamType = parseInt(this.chatService.directMessageType);
    localStorage.setItem('selectedMenuTy', this.currentWorkstreamType.toString());
    if (this.pageData.pageInfo == 3) {
      //$('.group-bg' + group.Id + ''+this.chatService.type).addClass('active');
      this.currentWorkstreamIdInfo = group.Id;
    }

    let pushitem: InputChat = { id: group.Id, name: group.grName, chatType: ChatType.DirectMessage, profileImg: group.profileImg, contentType: {} };
    // console.log(pushitem)
    for (let iar in this.chatService.dmstreamArr) {
      if (this.chatService.dmstreamArr[iar].Id == group.Id) {
        this.chatService.dmstreamArr[iar].removeCount = true;
        this.chatService.dmstreamArr[iar].type = this.currentWorkstreamType;
        this.chatService.totalNewDMMessage = this.chatService.totalNewDMMessage - this.chatService.dmstreamArr[iar].grCount;
        this.chatService.dmstreamArr[iar].grCount = 0
      }

    }

    this.chatService.channel.postMessage({
      type: this.chatService.directMessageType,
      groupId: group.Id,
      totalNewDMMessage: this.chatService.totalNewDMMessage
    })

    if (this.pageData.pageInfo == pageInfo.landingPage || this.pageData.pageInfo == pageInfo.workstreamPage) {
      // console.log('ksjkfjkdfjkk')
      // var aurl='chat-page/'+group.Id+"/"+ChatType.GroupChat;
      // this.router.navigate([aurl]);
      this.SetChatSessionforRedirect(group.Id, ChatType.DirectMessage);
      var aurl = 'chat-page';
      //this.router.navigate([aurl]);
      window.open(aurl, aurl);
    }
    else {
      this.ClearChatSessionforRedirect();
      this.SetChatSessionforRedirect(group.Id, ChatType.DirectMessage);
      this.ReloadChatSection.emit(pushitem);
      // var aurl='chat-page/'+group.Id+"/"+ChatType.DirectMessage;
      //   this.router.navigate([aurl]);
      this._location.replaceState('/chat-page')
    }

  }
  loadingGroupDirectChat: boolean;
  // groupType = "3";
  // directMessageType = "2";
  limit = "10";
  offset = "0";
  async ReloadGrouAndDMChatMenu(groupid, chatType: ChatType) {
    this.loadSidebar = true;
    if (chatType == ChatType.GroupChat && groupid) {
      this.expandminus1 = 1;
      this.accorodianMenu.map((menu) => {
        if (menu.id == 6 || menu.id == 21) {
          return menu.expandFlag = true;
        } else {
          return menu.expandFlag = false;
        }
      })
      await this.getGroupAndDirectChatwithCountLists(this.chatService.groupType, this.emitvalue, groupid);
    } else if (chatType == ChatType.DirectMessage && groupid) {
      this.expandminus1 = 2;
      this.accorodianMenu.map((menu) => {
        if (menu.id == 5 || menu.id == 20) {
          return menu.expandFlag = true;
        } else {
          return menu.expandFlag = false;
        }
      })
      await this.getGroupAndDirectChatwithCountLists(this.chatService.directMessageType, this.emitvalue, groupid);
    } else {
      this.expandminus1 = 0;
      this.accorodianMenu.map((menu) => {
        if (menu.id == 3 || menu.id == 18) {
          return menu.expandFlag = true;
        } else {
          return menu.expandFlag = false;
        }
      })
      //alert(this.expandminus1);
    }
    this.SetChatSessionforRedirect(groupid, ChatType.GroupChat);
  }
  getGroupAndDirectChatwithCountLists(type, emitValue, activeGroupId) {
    // console.log(this.accorodianMenu)
    return new Promise<void>((resolve, reject) => {
      const apiFormData = new FormData();
      apiFormData.append('apiKey', this.apiData['apiKey']);
      apiFormData.append('domainId', this.apiData['domainId']);
      apiFormData.append('countryId', this.apiData['countryId']);
      apiFormData.append('userId', this.apiData['userId']);
      apiFormData.append('limit', this.limit);
      //apiFormData.append('limit', "500");
      apiFormData.append('offset', this.offset);
      apiFormData.append('type', type);
      this.commonService.GetGroupAndDirectMessagewithCount(apiFormData).subscribe((response) => {
        let res = response;
        let resData = response.messages;
        if (res.status = "Success") {

          // if (type == this.chatService.groupType){
          //   this.chatService.grstreamArr=[];
          //   }
          //   if (type == this.chatService.directMessageType){
          //     this.chatService.dmstreamArr=[];
          //     }

          this.loadingGroupDirectChat = false;
          for (let item in resData) {
            let id = resData[item].chatGroupId;
            let name = resData[item].groupName;
            let img = resData[item].groupChatIcon;
            let img_profile = resData[item].groupChatIcon;
            if (type == this.chatService.directMessageType) {
              img = resData[item].imgNameWhite;
              img_profile = resData[item].imgNameWhite;
            }
            let availability = resData[item].availability;
            let totalCount = resData[item].chatCount;
            //let gr_contentType= resData[item].contentType;

            if (totalCount > 100) {
              totalCount = 99 + '+';
            }
            let isNew = resData[item].isNewChat;
            if (type == this.chatService.groupType) {
              if (this.chatService.grstreamArr.length > 0) {
                this.chatService.grstreamArr.forEach(_grStream => {
                  let _object = this.chatService.grstreamArr.find(t => t.Id == id);
                  if (_object) {
                    if (this.chatScrollDirective?.isNearBottom && id == this.currentWorkstreamIdInfo) {
                      this.chatService.grstreamArr.find(_item => _item.Id == id).grCount = totalCount;
                      this.chatService.grstreamArr.find(_item => _item.Id == id).removeCount = true;
                      this.chatService.grstreamArr.find(_item => _item.Id == id).grNew = false;
                    } else {
                      this.chatService.grstreamArr.find(_item => _item.Id == id).grCount = totalCount;
                      this.chatService.grstreamArr.find(_item => _item.Id == id).removeCount = false;
                      this.chatService.grstreamArr.find(_item => _item.Id == id).grNew = isNew;
                    }
                  } else {
                    this.chatService.grstreamArr.push({
                      Id: id,
                      grName: name,
                      type: this.chatGroupType,
                      grImg: img,
                      grCount: totalCount,
                      grNew: isNew,
                      profileImg: img_profile,
                      removeCount: false
                    });
                  }
                })
              } else {
                this.chatService.grstreamArr.push({
                  Id: id,
                  grName: name,
                  type: this.chatGroupType,
                  grImg: img,
                  grCount: totalCount,
                  grNew: isNew,
                  profileImg: img_profile,
                  removeCount: false
                });
              }
            }

            // console.clear();
            // console.log(this.currentWorkstreamIdInfo);
            // console.log(this.chatService.grstreamArr)
            // console.log('this.chatService.dmstreamArr', this.chatService.dmstreamArr);

            if (type == this.chatService.directMessageType) {

              if (this.chatService.dmstreamArr.length > 0) {
                this.chatService.dmstreamArr.forEach(_grStream => {
                  let _object = this.chatService.dmstreamArr.find(t => t.Id == id);
                  if (_object) {
                    if (this.chatScrollDirective?.isNearBottom && id == this.currentWorkstreamIdInfo) {
                      this.chatService.dmstreamArr.find(_item => _item.Id == id).grCount = totalCount;
                      this.chatService.dmstreamArr.find(_item => _item.Id == id).removeCount = true;
                      this.chatService.dmstreamArr.find(_item => _item.Id == id).grNew = false
                    } else {
                      this.chatService.dmstreamArr.find(_item => _item.Id == id).grCount = totalCount;
                      this.chatService.dmstreamArr.find(_item => _item.Id == id).removeCount = false;
                      this.chatService.dmstreamArr.find(_item => _item.Id == id).grNew = isNew
                    }
                  } else {
                    this.chatService.dmstreamArr.push({
                      Id: id,
                      grName: name,
                      type: this.chatDirectType,
                      grImg: img,
                      grCount: totalCount,
                      grNew: isNew,
                      profileImg: img_profile,
                      removeCount: false,
                      availability: availability
                    });
                  }
                })
              } else {
                this.chatService.dmstreamArr.push({
                  Id: id,
                  grName: name,
                  type: this.chatDirectType,
                  grImg: img,
                  grCount: totalCount,
                  grNew: isNew,
                  profileImg: img_profile,
                  removeCount: false,
                  availability: availability
                });
              }
            }
          }
          if (type == this.chatService.directMessageType && typeof this.newChatData != 'undefined') {
            const index = this.chatService.dmstreamArr.findIndex((item) => item.Id == this.newChatData.id)
            if (index == -1) {
              this.chatService.dmstreamArr.push({
                Id: this.newChatData.id,
                grName: this.newChatData.name,
                type: this.chatDirectType,
                grImg: this.newChatData.profileImg,
                grCount: 0,
                grNew: 1,
                profileImg: this.newChatData.profileImg,
                removeCount: false,
                availability: 1
              });
            }
          }

          if (this.chatService.dmstreamArr && this.chatService.dmstreamArr[0] && type == this.chatService.directMessageType && typeof this.notificationData.chatGroupId != 'undefined') {
            const index = this.chatService.dmstreamArr.findIndex((item) => item.Id == this.notificationData.chatGroupId || (typeof this.newChatData != 'undefined' && item.Id == this.newChatData.id))
            if (index > -1) {
              this.chatService.moveArrayItemToNewIndex(this.chatService.dmstreamArr, index, 0);
            }
          }

          if (this.chatService.grstreamArr && this.chatService.grstreamArr[0] && type == this.chatService.groupType && this.notificationData) {
            const index = this.chatService.grstreamArr.findIndex((item) => item.Id == this.notificationData.chatGroupId)
            if (index > -1) {
              this.chatService.moveArrayItemToNewIndex(this.chatService.grstreamArr, index, 0);
            }
          }

          let totalNewGroupMessage = 0;
          if (this.chatService.grstreamArr) {
            for (let i = 0; i < this.chatService.grstreamArr.length; i++) {
              if (this.chatService.grstreamArr[i] && this.chatService.grstreamArr[i].hasOwnProperty('grNew')) {
                totalNewGroupMessage += this.chatService.grstreamArr[i].grCount;
              }
            }
          }

          this.chatService.totalNewGroupMessage = totalNewGroupMessage;

          let totalNewDMMessage = 0;
          if (this.chatService.dmstreamArr) {
            for (let i = 0; i < this.chatService.dmstreamArr.length; i++) {
              if (this.chatService.dmstreamArr[i] && this.chatService.dmstreamArr[i].hasOwnProperty('grNew')) {
                totalNewDMMessage += this.chatService.dmstreamArr[i].grCount;
              }
            }
          }

          this.chatService.totalNewDMMessage = totalNewDMMessage;

          this.newChatData = undefined; // Clear new DM object
          setTimeout(() => {
            if(!activeGroupId)
            {
              if (localStorage.getItem(LocalStorageItem.reloadChatGroupId) != null && localStorage.getItem(LocalStorageItem.reloadChatGroupId) != undefined && localStorage.getItem(LocalStorageItem.reloadChatGroupId) != "")
              {
 activeGroupId=localStorage.getItem(LocalStorageItem.reloadChatGroupId);
 type=localStorage.getItem(LocalStorageItem.reloadChatType);
              }
            }
           //alert(activeGroupId+''+type);
            if (activeGroupId != "") {
              if (type == this.chatService.directMessageType) {
                this.onTabOpenFromOtherComponenet(2);

              }
              if (type == this.chatService.groupType) {
                this.onTabOpenFromOtherComponenet(1);
              }
              if (this.pageData.access == 'chat-page') {
                $('.workstream-bg').removeClass('active');
                if (type == 3 || type == 2) {
                  $('.group-bg' + activeGroupId + '' + type).addClass('active');
                } else {
                  $('.workstream-bg' + activeGroupId + '' + type).addClass('active');
                }

              }
              this.chatService.currentWorkstreamIdInfo = activeGroupId;
            }
          }, 0);
        } else {
          this.loadingGroupDirectChat = false;
        }
        if (this.chatService.grstreamArr && this.chatService.grstreamArr[0]) {
          const groupChat = this.chatService.grstreamArr.some(grstream => grstream.Id == this.currentWorkstreamIdInfo);
          if (groupChat) {
            this.chatService.type = this.chatService.groupType;
            this.chatService.currentWorkstreamIdInfo = this.currentWorkstreamIdInfo;
            this.expandminus1 = 1;
            if (this.loadSidebar) {
              // console.log('load sidebar')
              this.accorodianMenu.map((menu) => {
                // return menu.expandFlag = (menu.id == 6 || menu.id == 21) ? true : false;
                let selectedMenuTy = localStorage.getItem('selectedMenuTy');
                this.currentWorkstreamType = selectedMenuTy != undefined && selectedMenuTy != null ? parseInt(selectedMenuTy) : 1;
                if (this.currentWorkstreamType == 3) {
                  return menu.expandFlag = (menu.id == 6 || menu.id == 21) ? true : false;
                }

              });
            }
            // console.log(this.accorodianMenu);
          }
        }
        if (this.chatService.dmstreamArr && this.chatService.dmstreamArr[0]) {
          const directMsg = this.chatService.dmstreamArr.some(dmArr => dmArr.Id == this.currentWorkstreamIdInfo);
          if (directMsg) {
            this.chatService.type = this.chatService.directMessageType;
            this.chatService.currentWorkstreamIdInfo = this.currentWorkstreamIdInfo;
            this.expandminus1 = 2;
            let currentUrl = this.router.url.split('/');
            if (this.loadSidebar && currentUrl[1] == 'chat-page') {
              this.accorodianMenu.map((menu) => {
                //return menu.expandFlag = (menu.id == 5 || menu.id == 20) ? true : false;
                let selectedMenuTy = localStorage.getItem('selectedMenuTy');
                this.currentWorkstreamType = selectedMenuTy != undefined && selectedMenuTy != null ? parseInt(selectedMenuTy) : 1;
                if (this.currentWorkstreamType == 2) {
                  return menu.expandFlag = (menu.id == 5 || menu.id == 20) ? true : false;
                }
              });
            }
          }
          if (this.chatScrollDirective?.isNearBottom) {
            this.chatScrollDirective.restore()
          }
        }
        // this.loadSide
        setTimeout(() => {
          this.loadSidebar = false;
        }, 2000);
        if (this.chatService.dmstreamArr.length > 0) {
          this.chatService.dmstreamArr = this.chatService.dmstreamArr.filter((arr) => {
            return arr.type == this.chatService.directMessageType && arr.grName != undefined;
          });
        }
        // console.log('check this 1');
        resolve();
      });
    });
  }

  isSearchPlaceholderEnabled: boolean;
  EnableSearch() {
    this.isSearchPlaceholderEnabled = true;
  }
  ClearEnableSearch() {
    this.isSearchPlaceholderEnabled = false;
  }
  AddMember() {
    this.chatpopupcomponent.AddGroupOrDMClick();
  }

  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    console.log('chat-session-3'+chatgroupid+'--'+chatType);
    localStorage.setItem('reloadChatTypeNew',chatType);
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);

    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }
  ClearChatSessionforRedirect() {
    localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
    localStorage.removeItem(LocalStorageItem.reloadChatType);
  }

  //new worksteam
  workstreamPageNew() {
    this.setupNavUrl();
    let url = RedirectionPage.ManageWorkstream;
    this.router.navigate([url]);
  }


  //edit worksteam
  workstreamPageEdit(eid) {
    //var aurl='workstreams/edit/'+eid;
    //window.open(aurl, IsOpenNewTab.openNewTab);
    this.setupNavUrl();
    let url = `${RedirectionPage.ManageWorkstream}/edit/${eid}`;
    this.router.navigate([url]);
  }
  // check next
  nextTooltip(id) {
    this.updateHelpContentOrder(id,'next');
    this.tooltip.close();
    this.whelpContentFlagStatus = false;
    this.whelpContentStatus = '1';
    localStorage.setItem('helpContentName', 'announcements');
    let data = {
      helpContentName: 'announcements'
    }
    this.commonService.emitHelpContentView(data);
  }
  // check next
  skipTooltip(id) {
    this.updateHelpContentOrder(id,'skip');
    this.tooltip.close();
    this.whelpContentFlagStatus = false;
    this.whelpContentStatus = '1';
  }

  // helpContentOrder
  updateHelpContentOrder(id,type) {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    if(type == 'skip'){
      apiFormData.append('skipOption', '1');
    }
    else{
      apiFormData.append('tooltipId', id);
    }
    this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        console.log(response.result);
      }
    });
  }

  // helpContent list and view
  helpContent(id) {
    id = (id > 0) ? id : '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('tooltipId', id);

    this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        if (id == '') {
          let contentData = response.tooltips;
          for (let cd in contentData) {
            let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
            if (welcomePopupDisplay == '1') {
              if (contentData[cd].id == '8' && contentData[cd].viewStatus == '0') {
                this.thelpContentStatus = contentData[cd].viewStatus;
                this.thelpContentFlagStatus = true;
                this.thelpContentId = contentData[cd].id;
                this.thelpContentTitle = contentData[cd].title;
                this.thelpContentContent = contentData[cd].content;
                this.thelpContentIconName = contentData[cd].itemClass;
              }
            }
          }
          if (this.thelpContentFlagStatus) {
            this.chattooltip.open();
          }
        }
        else {
          console.log(response.result);
          this.chattooltip.close();
        }
      }
    });
  }

  // Setup Local storage on New/Edit Workstream
  setupNavUrl() {
    let url = this.router.url.split('/');
    localStorage.setItem('navFromUrl', url[1]);
  }


  // notification settings popup
  openDialogNotification(wid) {
    this.displaydiaLogNotifications = true;
    this.currentSettingArr = [];
    this.currentSettingId = '';
    this.currentSettingType = '';

    console.log(this.chatService.workstreamArr);

    for (let cw in this.chatService.workstreamArr) {
      if (this.chatService.workstreamArr[cw].wsId == wid) {
        this.currentSettingName = this.chatService.workstreamArr[cw].wsName;
        this.currentSettingArr = this.chatService.workstreamArr[cw].cConfig[0].messageTypes;
        this.currentSettingId = this.chatService.workstreamArr[cw].cConfig[0].id;
        this.currentSettingType = this.chatService.workstreamArr[cw].cConfig[0].chatType;
      }
    }
    for (let cs in this.currentSettingArr) {
      if (this.currentSettingArr[cs].value == '1') {
        this.currentSettingArr[cs].valFlag = true;
      }
      else {
        this.currentSettingArr[cs].valFlag = false;
      }
    }

    /*console.log(this.currentSettingArr);
    console.log(this.currentSettingName);
    console.log(this.currentSettingId);
    console.log(this.currentSettingType);*/

  }
  cancelNotificationPopup() {
    this.displaydiaLogNotifications = false;
    this.currentSettingArr = [];
    this.currentSettingId = '';
    this.currentSettingName = '';
    this.currentSettingType = '';
  }
  onChangeSettings(event) {
    let val;
    if (event.checked) {
      val = 1;
    }
    else {
      val = 0;
    }
    this.updateChatConfig(val);
  }
  updateChatConfig(val) {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('workStreamId', this.currentSettingId);
    apiFormData.append('chatType', this.currentSettingType);
    apiFormData.append('postMessage', val);

    this.landingpageServiceApi.updateConfigSettings(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        console.log('----7');
        this.getWorkstreamwithCountLists(this.emitvalue, this.currentSettingId);
      }
    });
  }

}

export class InputChat {
  id: string;
  name: string;
  chatType: string;
  profileImg: string;
  contentType: Object;
}
