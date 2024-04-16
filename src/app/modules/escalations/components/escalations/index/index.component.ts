import { Component, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../../../services/common/common.service';
import { FilterService } from '../../../../../services/filter/filter.service';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { EscalationsService } from '../../../../../services/escalations/escalations.service';
import { ManageUserComponent } from '../../../../../components/common/manage-user/manage-user.component';
import { SuccessModalComponent } from '../../../../../components/common/success-modal/success-modal.component';
import { forumPageAccess, Constant,escalationSendEmailType } from 'src/app/common/constant/constant';
import * as moment from 'moment';

declare var Quill: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('open', style({
      })),
      state('closed', style({
      })),
      transition('open => closed', [
        animate('.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class IndexComponent implements OnInit {

  @ViewChild('phone', {static: false}) phone: ElementRef;
  @ViewChild('ticket', {static: false}) ticket: ElementRef;
  @ViewChild('thread', {static: false}) thread: ElementRef;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public title:string = 'Escalations';
  public bodyClass:string = "escalation-list";
  public bodyElem;
  public footerElem;

  public headerFlag: boolean = false;
  public headerData: Object;

  public groupId: number = 21;
  public searchVal: string = '';
  public maxUser: number = 5;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemTotal: number;
  public itemEmpty: boolean;
  public escInit: any = 1;
  public displayNoRecords: boolean = false;
  public downloadExlFlag: boolean = true;
  public downloadUrl: string = "";
  public countryId;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;
  public quill: any;
  public filterInterval: any;

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;
  public infoHeight: any = 0;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public resize: boolean = false;
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLable: string = "";
  public chooseIcon: string = "";

  public tooltip: boolean = false;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public filterLoading: boolean = true;
  public actionFlag: boolean = false;
  public actionLoading: boolean = false;
  public actionPlanLoading: boolean = false;
  public saveFlag: boolean = false;

  public filterStartDate:any = moment().startOf('month');
  public filterEndDate = moment().format('YYYY-MM-DD');
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public emptyCont: string = "<i class='gray'>None</i>";
  public recentRecTxt: string = "Recent Records";

  public section: number = 1;
  public pageAccess: string = "escalation";
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public mediaManagerPath: string = `${this.mediaPath}/manager`;
  public escPath: string = `${this.assetPath}/escalations`;
  public escalationTabList: any;
  public escalationList = [];
  public techList = [];
  public csmList = [];
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public showhistoryButton: boolean = false;
  public editerHeight;
  public escPhone: string = "";
  public escTicket: string = "";
  public escDate: string = "";
  public escThreadId: string = "";
  public escId: number = 0;
  public equipNum: string = "";
  public actionPlanId: string = "";
  public escActionPlan: string = "";
  public lastUploadedDate: string = "";
  public escModifiedDate: string = "";
  public escModifiedBy: string = "";
  public prevIndex: number = -1;
  public currFocusElem: string = "";

  public showdashboardOption:boolean=false;

  public escEquipHeader = [
    {title: 'Equipment#', class: 'equip-num'},
    {title: 'Model', class: 'model'},
    {title: 'Call Number', class: 'call-num'},
    {title: 'Call Close Date', class: 'call-close-date'},
    {title: 'BW Meter', class: 'bw-meter'},
    {title: 'Color Meter', class: 'close-meter'}
  ];
  public textColorValues = [
    {color: "rgb(0, 0, 0)"},
    {color: "rgb(230, 0, 0)"},
    {color: "rgb(255, 153, 0)"},
    {color: "rgb(255, 255, 0)"},
    {color: "rgb(0, 138, 0)"},
    {color: "rgb(0, 102, 204)"},
    {color: "rgb(153, 51, 255)"},
    {color: "rgb(255, 255, 255)"},
    {color: "rgb(250, 204, 204)"},
    {color: "rgb(255, 235, 204)"},
    {color: "rgb(255, 255, 204)"},
    {color: "rgb(204, 232, 204)"},
    {color: "rgb(204, 224, 245)"},
    {color: "rgb(235, 214, 255)"},
    {color: "rgb(187, 187, 187)"},
    {color: "rgb(240, 102, 102)"},
    {color: "rgb(255, 194, 102)"},
    {color: "rgb(255, 255, 102)"},
    {color: "rgb(102, 185, 102)"},
    {color: "rgb(102, 163, 224)"},
    {color: "rgb(194, 133, 255)"},
    {color: "rgb(136, 136, 136)"},
    {color: "rgb(161, 0, 0)"},
    {color: "rgb(178, 107, 0)"},
    {color: "rgb(178, 178, 0)"},
    {color: "rgb(0, 97, 0)"},
    {color: "rgb(0, 71, 178)"},
    {color: "rgb(107, 36, 178)"},
    {color: "rgb(68, 68, 68)"},
    {color: "rgb(92, 0, 0)"},
    {color: "rgb(102, 61, 0)"},
    {color: "rgb(102, 102, 0)"},
    {color: "rgb(0, 55, 0)"},
    {color: "rgb(0, 41, 102)"},
    {color: "rgb(61, 20, 102)"}
  ];

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;

  public filterOptions: Object = {
    'filterExpand': this.expandFlag,
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'apiKey': '',
    'userId': '',
    'domainId': '',
    'countryId': '',
    'groupId': this.groupId,
    'threadType': '25',
    'action': 'init',
    'reset':this.resetFilterFlag,
    'historyFlag': this.historyFlag
  };
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-(this.itemOffset*8);
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if(inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.lazyLoading = true;
        this.scrollCallback = false;
        this.getEscalationLists('init');
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.filterLoading = false;
    setTimeout(() => {
      this.filterLoading = true;
      let listItemHeight = (document.getElementsByClassName('escalation-items')[0].clientHeight);
      if(this.itemTotal > this.escalationList.length) {
        // && this.innerHeight >= listItemHeight
        //this.getEscalationLists('get');
      }
    }, 100);
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private filterApi: FilterService,
    private escalationApi: EscalationsService,
    public acticveModal: NgbActiveModal,
    private commonApi: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,

  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
    var fontSizeStyle = Quill.import('attributors/style/size');
    fontSizeStyle.whitelist = ['24px', '48px', '100px', '200px'];
    Quill.register(fontSizeStyle, true);
  }

  ngOnInit(): void {

    this.editerHeight='500px';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    if(this.userId==100 || this.userId==122)
    {
      this.showdashboardOption=true;
    }

    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.footerElem = document.getElementsByClassName('footer-content')[0];
      this.bodyElem.classList.add(this.bodyClass);
      let searchKey = localStorage.getItem('escalationSearch');
      let searchBg = (searchKey == undefined || searchKey == 'undefined') ? false : true;
      this.searchVal = (searchBg) ? searchKey : '';
      console.log(searchBg);
      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true,
        'searchBg': searchBg
      };
      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'searchKey': this.searchVal,
        'historyFlag': this.historyFlag
      }

      this.filterOptions['apiKey'] = Constant.ApiKey;
      this.filterOptions['userId'] = this.userId;
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      this.filterOptions['searchBg'] = searchBg;
      this.filterOptions['resetFlag'] = searchBg;

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

        let escInit:any = localStorage.getItem('escInit');
        escInit = (escInit == undefined || escInit == undefined || escInit == 'undefined') ? this.escInit : 1;
        this.apiData['groupId'] = this.groupId;
        //this.apiData['filterOptions'] = [];
        this.apiData['historyFlag'] = this.historyFlag;

        // Get Filter Widgets
        this.commonApi.getFilterWidgets(this.apiData, this.filterOptions, escInit);

        this.filterInterval = setInterval(()=>{
          let filterWidget = localStorage.getItem('filterWidget');
          let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
          if(filterWidget) {
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.filterLoading = false;
            this.filterOptions['filterLoading'] = this.filterLoading;
            clearInterval(this.filterInterval);
            this.resetFilterFlag = false;
            this.escInit = 0;
            localStorage.removeItem('escInit');
            localStorage.removeItem('filterWidget');
            localStorage.removeItem('filterData');
            // Get Escalation Lists
            this.getEscalationLists('init');
          }
        },50);
      }, 1500);

    } else {
      this.router.navigate(['/forbidden']);
    }
  }


  taptoRenderdata(flag) {
    this.historyFlag = (flag == 0) ? false : true;
    localStorage.setItem('escInit', flag);
    this.resetFilter();
  }

  // Get Escalation Lists
  getEscalationLists(action) {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['type'] = this.section;
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    if(this.historyFlag) {
      this.apiData['historyFlag'] = 1;
    } else {
      this.apiData['historyFlag'] = '';
    }

    console.log(this.resetFilterFlag)
    this.escalationApi.getEscalationLists(this.apiData).subscribe((response) => {
      this.loading = false;
      this.lazyLoading = this.loading;
      this.showhistoryButton = true;
      if(response.status == 'Success') {
        this.showhistoryButton=true;
        if(action == 'init' || action == 'reset') {
          this.escalationTabList = response.tabs;
        }
        let resultData = response.escData;
        if(resultData.length == 0) {
          setTimeout(() => {
            this.itemEmpty = true;
          }, 50);

          if(this.apiData['searchKey'] != '' || response.total == 0) {
            this.escalationList = [];
            this.itemEmpty = false;
            this.displayNoRecords = true;
          }
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          this.itemEmpty = false;
          this.itemTotal = response.total;
          this.itemLength += resultData.length;
          this.itemOffset += this.itemLimit;
          let excelPath = response.excelPath;
          //this.downloadExlFlag = (excelPath != "") ? true : false;
          this.downloadUrl = excelPath;

          //let lastUploadedDate = moment.utc(response.importedTime).toDate();
          //let localLastUploadedDate = moment(lastUploadedDate).local().format('MMM DD, YYYY h:mm A');
          this.lastUploadedDate = moment(response.importedTime).format('MMM DD, YYYY');
          if(this.itemOffset == this.itemLimit) {
            this.escId = resultData[0].id;
            this.equipNum = resultData[0].equipmentNumber;
            this.actionPlanId = resultData[0].actionPlanId;

            this.escActionPlan = resultData[0].actionPlan;
            this.saveFlag = (this.escActionPlan.length > 0) ? true : false;

            let modifiedDate = moment.utc(resultData[0].actionplanUpdatedOn).toDate();
            let localModifiedDate = (resultData[0].actionplanUpdatedOn == "") ? '-' : moment(modifiedDate).local().format('MMM DD, YYYY h:mm A');
            this.escModifiedDate = localModifiedDate;
            this.escModifiedBy = (resultData[0].actionplanUpdatedByName == "") ? '-' : resultData[0].actionplanUpdatedByName;
          }
          for(let e in resultData) {
            resultData[e].selection = (this.itemOffset == this.itemLimit && parseInt(e) == 0) ? 'active' : 'normal';
            //let createdDate = moment.utc(resultData[e].dateHitsReport).toDate();
            //let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
            resultData[e].dateHitsReport = (resultData[e].dateHitsReport == "") ? '-' : moment(resultData[e].dateHitsReport).format('MMM DD, YYYY');
            //let custContDate = moment.utc(resultData[e].dateCustomerContacted).toDate();
            //let localCustContDate = moment(resultData[e].dateCustomerContacted).local().format('MMM DD, YYYY h:mm A');
            resultData[e].dateCustomerContact = (resultData[e].dateCustomerContacted == '') ? '' : resultData[e].dateCustomerContacted;
            let localCustContDate = moment(resultData[e].dateCustomerContacted).format('MMM DD, YYYY');
            resultData[e].dateCustomerContacted = (resultData[e].dateCustomerContacted == '') ? '' : localCustContDate;
            resultData[e].eqCollapse = true;
            resultData[e].ticketActionFlag = false;
            resultData[e].dateActionFlag = false;
            resultData[e].threadActionFlag = false;
            resultData[e].phoneActionLoading = false;
            resultData[e].ticketActionLoading = false;
            resultData[e].dateActionLoading = false;
            resultData[e].threadActionLoading = false;

            let moreUser = 0;
            let defUser = this.maxUser;
            let userList = resultData[e].usersList;
            let eqUsers = [];
            resultData[e].userLength = 0;
            if(userList.length > defUser) {
              moreUser = userList.length - defUser;
              resultData[e].userLength = moreUser;
            }
            for(let u in userList) {
              if(parseInt(u) < defUser) {
                eqUsers.push(userList[u])
              }
            }
            resultData[e].eqUsers = eqUsers;
            this.escalationList.push(resultData[e]);
          }
        }
      }
    });
  }

  // Escalation Edit
  escEdit(field, index, val) {
    let id = this.escalationList[index].id;
    this.currFocusElem = field;
    if(this.escId != id) {
      this.actionFlag = false;
      this.escSelection(index, id);
    }
    setTimeout(() => {
      this.focusIn();

      if(this.prevIndex >= 0) {
        this.removeAction(this.prevIndex);
      } else {
        this.removeAction(index);
        this.prevIndex = index;
      }
      switch (field) {
        case 'contact':
          this.escPhone = val;
          this.escalationList[index].phoneActionFlag = true;
          setTimeout(() => {
            this.phone.nativeElement.focus();
          }, 50);
          break;
        case 'ticket':
          this.escTicket = val;
          this.escalationList[index].ticketActionFlag = true;
          setTimeout(() => {
            this.ticket.nativeElement.focus();
          }, 50);
          break;
        case 'date':
          this.escDate = val;
          this.escalationList[index].dateActionFlag = true;
          break;
        case 'thread':
          this.escThreadId = val;
          this.escalationList[index].threadActionFlag = true;
          setTimeout(() => {
            this.thread.nativeElement.focus();
          }, 50);
          break;
      }
    }, 100);
  }

  // Escalation Selection
  escSelection(index, id) {
    if(!this.actionFlag) {
      this.removeAction(index);
      if(this.escId != id) {
        let eindex = this.escalationList.findIndex(option => option.id == this.escId);
        this.escalationList[eindex].selection = "normal";
        this.escId = id;
        this.escalationList[index].selection = "active";
        this.escActionPlan = this.escalationList[index].actionPlan;
        this.equipNum = this.escalationList[index].equipmentNumber;
        this.actionPlanId = this.escalationList[index].actionPlanId;

        let modifiedDate = moment.utc(this.escalationList[index].actionplanUpdatedOn).toDate();
        let localModifiedDate = (this.escalationList[index].actionplanUpdatedOn == "") ? '-' : moment(modifiedDate).local().format('MMM DD, YYYY h:mm A');
        this.escModifiedDate = localModifiedDate;
        this.escModifiedBy = (this.escalationList[index].actionplanUpdatedByName == "") ? '-' : this.escalationList[index].actionplanUpdatedByName;
      }
    }
  }

  // Editor Onchange
  onTextChange(field, event) {
    this.actionFlag = true;
    switch (field) {
      case 'contact':
        this.escPhone = this.phoneFormat(event.target.value);
        break;
      case 'ticket':
        this.escTicket = event.target.value;
        break;
      case 'date':
        this.escDate = moment(event).format('YYYY-MM-DD');
        //console.log(moment(event).format('MMM DD, YYYY h:mm A'))
        break;
      case 'thread':
        this.escThreadId = event.target.value;
        break;
      default:
        this.escActionPlan = event.htmlValue;
        this.saveFlag = (this.escActionPlan != null) ? true : false;
        break;
    }
    setTimeout(() => {
      this.focusIn();
    }, 100);
  }

  // Remove Actions
  removeAction(index) {
    this.escalationList[index].phoneActionFlag = false;
    this.escalationList[index].ticketActionFlag = false;
    this.escalationList[index].dateActionFlag = false;
    this.escalationList[index].threadActionFlag = false;
  }

  // Input Element Focus Out
  focusIn() {
    this.actionFlag = true;
    setTimeout(() => {
      this.actionFlag = false;
    }, 1000);
  }

  // Input Element Focus Out
  focusOut(index, field) {
    this.prevIndex = -1;
    //this.saveEscalation(index, field);
    if(this.currFocusElem == field) {
      switch (field) {
        case 'contact':
          this.escalationList[index].phoneActionFlag = true;
          break;
        case 'ticket':
          this.escalationList[index].ticketActionFlag = true;
          break;
        case 'date':
          this.escalationList[index].dateActionFlag = true;
          break;
        case 'thread':
          this.escalationList[index].threadActionFlag = true;
          break;
      }
    } else {
      setTimeout(() => {
        this.escalationList[index].phoneActionFlag = false;
        this.escalationList[index].ticketActionFlag = false;
        this.escalationList[index].dateActionFlag = false;
        this.escalationList[index].threadActionFlag = false;
      }, 500);
    }
  }

  // Save Escalation
  saveEscalation(index, action) {
    this.focusIn();
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('equipmentNo', this.equipNum);
    apiFormData.append('actionPlanId', this.actionPlanId);

    let apiAction = true;
    switch (action) {
      case 'contact':
        /*if(this.escPhone != '') {
          apiFormData.append('contactPhoneNo', this.escPhone);
        } else {
          apiAction = false;
        }*/
        apiFormData.append('contactPhoneNo', this.escPhone);
        this.escalationList[index].phoneActionLoading = apiAction;
        break;
      case 'ticket':
        /*if(this.escTicket != '') {
          apiFormData.append('MfgTicket', this.escTicket);
        } else {
          apiAction = false;
        }*/
        apiFormData.append('MfgTicket', this.escTicket);
        this.escalationList[index].ticketActionLoading = apiAction;
        break;
      case 'date':
        /*if(this.escDate != '') {
          apiFormData.append('DateofContact', this.escDate);
        } else {
          apiAction = false;
        }*/
        apiFormData.append('DateofContact', this.escDate);
        this.escalationList[index].dateActionLoading = apiAction;
        break;
      case 'thread':
        /*if(this.escThreadId != '') {
          apiFormData.append('ThreadId', this.escThreadId);
        } else {
          apiAction = false;
        }*/
        apiFormData.append('ThreadId', this.escThreadId);
        this.escalationList[index].threadActionLoading = apiAction;
        break;
      default:
        this.actionPlanLoading = true;
        apiFormData.append('actionPlan', this.escActionPlan);
        break;
    }

    if(apiAction) {
      if(action != 'action-plan') {
        this.actionLoading = true;
      }
      this.escalationApi.saveEscalation(apiFormData).subscribe((response) => {

      setTimeout(() => {
        if(action == 'action-plan') {
          const apiFormData = new FormData();
          apiFormData.append('apiKey', Constant.ApiKey);
          apiFormData.append('domainId', this.domainId);
          apiFormData.append('countryId', this.countryId);
          apiFormData.append('userId', this.userId);
          apiFormData.append('equipmentNo', this.equipNum);
          apiFormData.append('actionPlanId', this.actionPlanId);
          apiFormData.append('sendEmail', escalationSendEmailType.actionPlanuUdate);
          let apiData = {
            apiKey: Constant.ApiKey,
            sendEmail:2,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId,
            equipmentNo: this.equipNum,
            actionPlanId: this.actionPlanId,
            type:this.section
          };
          this.escalationApi.escalationNotify(apiData).subscribe((response) => {});
        }
      }, 500);

      if(!this.historyFlag) {
        index = (index < 0) ? this.escalationList.findIndex(option => option.id == this.escId) : index;
        let escalationStatus = response.escalationStatus;
        if(escalationStatus != "") {
          let newRec = this.escalationList[index].isNewRecord;
          this.escalationList[index].isNewRecord = (newRec) ? false : newRec;
          this.escalationList[index].escalationStatus = escalationStatus;
          this.escalationList[index].escalationStatusColor = response.escalationStatusColor;
          let modifiedDate = moment.utc(response.updatedDate).toDate();
          let localModifiedDate = (response.updatedDate == "") ? '-' : moment(modifiedDate).local().format('MMM DD, YYYY h:mm A');
          this.escalationList[index].actionplanUpdatedOn = response.updatedDate;
          this.escModifiedDate = localModifiedDate;
          this.escalationList[index].actionplanUpdatedByName = response.userName;
          this.escModifiedBy = (response.userName == "") ? '-' : response.userName;
        }
      }
      if(action != 'action-plan') {
        this.actionLoading = false;
      } else {
        this.prevIndex = -1;
      }

      let flag = false;
      switch (action) {
        case 'contact':
          this.escalationList[index].contactPhoneNo = this.escPhone;
          this.escPhone = "";
          this.escalationList[index].phoneActionFlag = flag;
          this.escalationList[index].phoneActionLoading = flag;
          break;
        case 'ticket':
          this.escalationList[index].mfgTicketNo = this.escTicket;
          this.escTicket = "";
          this.escalationList[index].ticketActionFlag = flag;
          this.escalationList[index].ticketActionLoading = flag;
          break;
        case 'date':
          this.escalationList[index].dateCustomerContacted = moment(this.escDate).format('MMM DD, YYYY');
          this.escalationList[index].dateCustomerContact = this.escDate;
          this.escDate = "";
          this.escalationList[index].dateActionFlag = flag;
          this.escalationList[index].dateActionLoading = flag;
          break;
        case 'thread':
          this.escalationList[index].threadId = this.escThreadId;
          this.escThreadId = "";
          this.escalationList[index].threadActionFlag = flag;
          this.escalationList[index].threadActionLoading = flag;
          break;
        default:
          this.actionPlanLoading = false;
          let eindex = this.escalationList.findIndex(option => option.id == this.escId);
          this.escalationList[eindex].actionPlan = this.escActionPlan;
          break;
        }
      });
    } else {
      return apiAction;
    }
  }

  // Custom Phone Number Format
  phoneFormat(val) {
    var numbers = val.replace(/\D/g, '');
    if(numbers!=''){
      var numberslen = numbers.length;
      // Value to store the masked input
      var newval = "";
      for (let i = 0; i < numberslen; i++) {
        if (i == 3) newval += "-" + numbers[i];
        else if (i == 6) newval += "-" + numbers[i];
        else newval += numbers[i];
      }
      return newval.substring(0, 12);
    }
  }

  // EQ Toggle Action
  eqToggleAction(index, flag) {
    let id = this.escalationList[index].id;
    if(this.escId == id) {
      this.focusIn();
    }
    this.escalationList[index].eqCollapse = !flag;
  }

  // Apply Search
  applySearch(action, val) {
    this.escInit = 0;
    this.searchVal = val;
    this.apiData['searchKey'] = this.searchVal;
    this.escalationList = [];
    this.itemLimit = 20;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.loading = true;
    this.itemEmpty = false;
    this.displayNoRecords = false;
    this.headerData['searchKey'] = this.searchVal;
    this.headerData['searchBg'] = false;
    if(action == 'reset') {
      this.ngOnInit();
    } else {
      if(action == 'emit') {
        this.headerFlag = true;
      }
      this.getEscalationLists('init');

      setTimeout(() => {
        if(action == 'init') {
          this.headerFlag = true;
        }
      }, 500);
    }
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
  }

  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    let resetFlag = filterData.reset;
    this.filterOptions['searchBg'] = false;
    if(!resetFlag) {
      this.filterOptions['action']='get';
      this.filterOptions['historyFlag'] = this.historyFlag;
      this.filterOptions['resetFlag'] = this.resetFilterFlag;
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterOptions['filterLoading'] = this.filterLoading;
      this.apiData['filterOptions'] = filterData;

      // Setup Filter Active Data
      this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
      this.applySearch('get', this.searchVal);

      setTimeout(() => {
        this.filterLoading = false;
        this.filterOptions['filterLoading'] = this.filterLoading;
      }, 700);
    } else {
      this.filterOptions['action']='init';
      this.filterOptions['historyFlag']=this.historyFlag;
      this.filterOptions['resetFlag']=this.resetFilterFlag;
      localStorage.removeItem('escalationFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Manage User
  manageUser(action, index, uid = null) {
    let users = this.escalationList[index].usersList;
    let eqNum = this.escalationList[index].equipmentNumber;
    let actionPlanId = this.escalationList[index].actionPlanId;
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      equipmentNo: eqNum,
      actionPlanId: actionPlanId,
      type: this.section
    };
    switch (action) {
      case 'new':
      case 'view':
        const modalRef = this.modalService.open(ManageUserComponent, this.config);
        modalRef.componentInstance.access = this.pageAccess;
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.height = this.innerHeight;
        modalRef.componentInstance.action = action;
        modalRef.componentInstance.selectedUsers = users;
        modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
          let init = receivedService.init;
          let empty = receivedService.empty;
          if(empty && !init) {
            modalRef.dismiss('Cross click');
          } else if(init) {
            let rmId = receivedService.uid;
            this.escalationList[index].escalationStatus = receivedService.escalationStatus;
            this.escalationList[index].escalationStatusColor = receivedService.escalationStatusColor;
            this.escRemovUser(index, rmId);
          } else {
            modalRef.dismiss('Cross click');
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = receivedService.result;
            let newRec = this.escalationList[index].isNewRecord;
            this.escalationList[index].isNewRecord = (newRec) ? false : newRec;
            this.escalationList[index].escalationStatus = receivedService.escalationStatus;
            this.escalationList[index].escalationStatusColor = receivedService.escalationStatusColor;
            let modifiedDate = moment.utc(receivedService.updatedDate).toDate();
            let localModifiedDate = (receivedService.updatedDate == "") ? '-' : moment(modifiedDate).local().format('MMM DD, YYYY h:mm A');
            this.escalationList[index].actionplanUpdatedOn = receivedService.updatedDate;
            this.escModifiedDate = localModifiedDate;
            this.escalationList[index].actionplanUpdatedByName = receivedService.userName;
            this.escModifiedBy = (receivedService.userName == "") ? '-' : receivedService.userName;

            let moreUser = 0;
            let defUser = this.maxUser;
            let newUserList = receivedService.userList;
            let eqUsers = this.escalationList[index].eqUsers;

            for(let n in newUserList) {
              this.escalationList[index].usersList.push(newUserList[n]);
              if(eqUsers.length < defUser) {
                eqUsers.push(newUserList[n]);
              }
            }

            let userList = this.escalationList[index].usersList;
            this.escalationList[index].userLength = 0;
            if(userList.length > defUser) {
              moreUser = userList.length - defUser;
              this.escalationList[index].userLength = moreUser;
            }
            this.escalationList[index].eqUsers = eqUsers;
            let escData = apiData;
            escData['type'] = this.section;
            escData['newMembers'] = receivedService.newUsers;
            escData['sendEmail'] = escalationSendEmailType.addnewmember;
            this.escalationApi.escalationNotify(escData).subscribe((response) => {});
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
            }, 2000);
          }
        });
        break;

      default:
        this.escRemovUser(index, uid);
        let removeUser = [];
        removeUser.push(uid)
        const apiFormData = new FormData();
        apiFormData.append('apiKey', apiData.apiKey);
        apiFormData.append('domainId', apiData.domainId);
        apiFormData.append('countryId', apiData.countryId);
        apiFormData.append('userId', apiData.userId);
        apiFormData.append('equipmentNo', apiData.equipmentNo);
        apiFormData.append('type', this.section.toString());
        apiFormData.append('removeMembers', JSON.stringify(removeUser));
        apiFormData.append('actionPlanId', this.actionPlanId);

        this.escalationApi.saveEscalation(apiFormData).subscribe((response) => {
          console.log(response)
          let newRec = this.escalationList[index].isNewRecord;
          this.escalationList[index].isNewRecord = (newRec) ? false : newRec;
          this.escalationList[index].escalationStatus = response.escalationStatus;
          this.escalationList[index].escalationStatusColor = response.escalationStatusColor;
          let modifiedDate = moment.utc(response.updatedDate).toDate();
          let localModifiedDate = (response.updatedDate == "") ? '-' : moment(modifiedDate).local().format('MMM DD, YYYY h:mm A');
          this.escalationList[index].actionplanUpdatedOn = response.updatedDate;
          this.escModifiedDate = localModifiedDate;
          this.escalationList[index].actionplanUpdatedByName = response.userName;
          this.escModifiedBy = (response.userName == "") ? '-' : response.userName;
        });
        break;
    }
  }

  // Remove User From List
  escRemovUser(index, uid) {
    let rindex = this.escalationList[index].usersList.findIndex(option => option.userId == uid);
    this.escalationList[index].usersList.splice(rindex, 1);
    let eindex = this.escalationList[index].eqUsers.findIndex(option => option.userId == uid);
    this.escalationList[index].eqUsers.splice(eindex, 1);
    let userLen = this.escalationList[index].userLength;
    this.escalationList[index].userLength = (userLen > 0) ? userLen - 1 : userLen;
    if(this.escalationList[index].userLength >= 0) {
      let defUserLen = this.escalationList[index].usersList.length;
      if(defUserLen > 4) {
        let eqLen = this.escalationList[index].eqUsers.length;
        this.escalationList[index].eqUsers.push(this.escalationList[index].usersList[eqLen]);
      }
    }
  }

  // Section Change
  sectionChange(action) {
    if(this.section != action) {
      this.loading = true;
      this.section = action;
      this.itemOffset = 0;
      this.itemLength = 0;
      this.itemTotal = 0;
      this.scrollInit = 0;
      this.lastScrollTop = 0;
      this.scrollCallback = true;
      this.loading = true;
      this.itemEmpty = false;
      this.displayNoRecords = false;
      this.escalationList = [];
      this.getEscalationLists('get');
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.resetFilterFlag = true;
    this.filterOptions['filterLoading'] = this.filterLoading;
    this.filterOptions['action'] = 'init';
    this.filterOptions['historyFlag'] = this.historyFlag;
    this.filterOptions['resetFlag'] = this.resetFilterFlag;
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    this.applySearch('reset', this.searchVal);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let titleHeight = document.getElementsByClassName('part-list-head')[0].clientHeight;
    //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    let footerHeight = 0;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+30));
    //this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;
    this.filterHeight = (window.innerHeight);
    this.filterOptions['filterHeight'] = this.innerHeight;
    this.innerHeight = this.innerHeight-titleHeight;
    let infoHeight = this.innerHeight/1.4;
    this.infoHeight = `${infoHeight}px`;
  }

  // Profile Navigation
  navProfile(userId) {
    let url = forumPageAccess.profilePage+userId;
    window.open(url, '_blank');

  }

  // Allow only numeric
  restrictNumeric(e) {
    let res = this.commonApi.restrictNumeric(e);
    return res;
  }

  taptoDashboard()
  {
    var aurl = 'dashboard/escalation';
   // this.router.navigate(['/dashboard']);
    window.open(aurl, '_blank');
  }

  // Export Excel
  export(url) {
    window.open(url, '_blank');
  }

  // Prevent Accrodion Toggle
  escToggle(event) {
    event.stopPropagation();
  }

}
