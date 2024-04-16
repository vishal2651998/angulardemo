import { Component, ViewChild, HostListener, Renderer2, ElementRef, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatRadioChange } from '@angular/material';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { UserDashboardService } from '../../../services/user-dashboard/user-dashboard.service';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SuccessComponent } from '../../../components/common/success/success.component';
import { SortEvent } from 'primeng/api';
import { CommonService } from '../../../services/common/common.service';
import { ExcelService } from '../../../services/dashboard/excel/excel.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant,forumPageAccess,windowHeight } from '../../../common/constant/constant';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import {Table} from 'primeng/table';
import { EscalationsService } from '../../../services/escalations/escalations.service';
import { Icu } from '@angular/compiler/src/i18n/i18n_ast';
import { ThisReceiver } from '@angular/compiler';
import { ManageListComponent } from "../../../components/common/manage-list/manage-list.component";
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { WelcomeHomeComponent } from '../../../components/common/welcome-home/welcome-home.component';
import { ExportPopupComponent } from '../../../components/common/export-popup/export-popup.component';

declare var $:any;
interface workstreamsListdexport {
  name: string,
  id: number
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  workstreamsListdropdown: workstreamsListdexport[];
  selectedworkstreamsList: workstreamsListdexport;
  @ViewChild('el') elRefs: ElementRef;
 @ViewChild('ptabletdata', { static: false }) tdptabletdata: ElementRef;
 @ViewChild('myInput2') myInput2Element: ElementRef;
  totalRecords: number;
  workstreamValpush=[];
  public workstreamValpushFlag: boolean = false;
  countryValpush=[];
  public countryValpushFlag: boolean = false;
  public access: string = "";
  public refreshOption:boolean=false;
  public displaydiaLogSSO:boolean=false;
  //public title: string = "";
  public fromssoFlag=false;
  public titleFlag: boolean;
  public platfromId=localStorage.getItem("platformId");
  public exportFlag: boolean;
  public exportFlagthread: boolean;
  public newformDisable=false;
  public accounthasCountryError=false;
  public accounthasWorkstreamError=false;
  public accounthaspasswordError=false;
  public ssoEnabled=localStorage.getItem('ssoEnabled');

  public exportLoading: boolean = false;
  public excelreportdiaLog: boolean = false;
  public exportLoadingAll: boolean = false;
  public exportData: any;
  public findnewformflag=false;
  public pageaccesstitle:string = "User management";
  public isEmailExist=false;
  public defaultpasswordcheck:boolean=true;
  public workstreamArrayval=[];
  public countryArrayval=[];
  public multiselectdefaultLabel=' p-mdefaultlabel';
  public multiselectdefaultLabelNamedefaultstr=' Select workstreams';
  public multiselectdefaultLabelNameselectedstr=' Select workstreams*';
  public multiselectdefaultLabelName='Select workstreams*';
  public multiselectdefaultCLabelName='Select Country*';
  public displayPosition: boolean;

  public position: string;
  public noUserListFound:boolean=false;
  public noUserList:string="0";
  primetablerowdata: {FirstName: string,LastName: string,bussTitle: string,EmailAddress:string, dealerName:string, dealerCode:string, territory:string, zone:string, userarea:string, contactPersonName:string, contactPersonPhone:string, contactPersonEmail:string};
  public custompasswordcheck:boolean=false;
  public checkvalido=true;
  public radioOptions: string = '1';
  public resetpassvalidationmsg: string='';
  public updateuservalidationmsg: string='';
  totalRecordsActive: string ='-';
  public reguser_array=[];
  public workstreamuser_array=[];
  totalRecordsInActive: string ='-';
  totalRecordsWaitingFor: string ='-';
  totalRecordsDeletedUsers: string ='-';
  totalCountInvitedUsers:string='-';
  public dynamicColumn:string='';
  //public selectedBgColor='#C02E4C';
  public selectedBgColor='#e24e4b';
  public selectedColorCode='#FFFFFF';
  public watitingforapprovalVisible:boolean=false;
  public alreadyExistFlag:boolean=false;
  public tvsAgency: boolean = false;
  public newUserEmailAddress: string = '';

  public loadDynamicColun=false;
    public title:string = 'User Management';
    statuses: SelectItem[];
    workstreamstatus: SelectItem[];
    userActivestatus:SelectItem[];
    public userManagersList=[];
    public cityContentList=[];
    public territoryContentList=[];
    public zoneContentList=[];
    public areaContentList=[];
    colaccountTypes:SelectItem[];
    colaccountTypesNewUser:SelectItem[];
    colBusinessRoles:SelectItem[];
    colAssigneRoles:SelectItem[];
    colCountriesSelection:SelectItem[];

    waitingforApprovalues:SelectItem[];
    coluserTypesNewUser:SelectItem[];
    coluserTypesHeader:SelectItem[];
    colTypesHeader:SelectItem[];
    public selectedHeaderType: any;
    public selectedHeaderTypeId = "1";
    public selectedHeaderTypeUsers: any;
    public selectedHeaderTypeUsersId = "1";
    public displayValidationforreset:boolean=false;
    public displayValidationforfirstname:boolean=false;
    public displayValidationforlastname:boolean=false;
    public searchVal: string = '';
    displaydiaLog: boolean = false;
    displaydiaLogEdit: boolean = false;
    displaydiaLogAdd: boolean = false;
    displaydiaLogAssign: boolean = false;
    displaydiaLogAssignFlag: boolean = false;
    public publishbutton: boolean = false;
    public showuserdashboarddata: boolean = false;
    public userdashboardparam:string='1';
    public itemLimit: number = 30;
    public isCheckednoManager = false;
    public isEnableCountry: boolean = true;
    public isDisableWorkstream: boolean = false;
    public itemOffset: number = 0;
    public user: any;
    public apiKey: string;
    public countryId;
    public domainId;
    public activeuserstyle:string='';
    public inactiveuserstyle:string='';
    public activeuserstyleonchange:string='';
    public inactiveuserstylechange:string='';
    public userId;
    public userparamDataValue;
    public roleId;
    public apiData: Object;
    public itemLength: number = 0;
    public itemTotal: number;
    public itemList: object;
    public itemResponse = [];
    public lastScrollTop: number = 0;
    public scrollInit: number = 0;
    public scrollTop: number;
    public scrollCallback: boolean = true;
    public resize: boolean = false;
    public gtsSelectAll: boolean = false;
    public thumbView: boolean = false;
    public displayNoRecords: boolean;
    public loading: boolean = false;
    public matrixActionFlag: boolean = false;
    public headerFlag: boolean = false;
    public headerData: Object;
    public ItemEmpty: boolean;
    public loadDataEvent: boolean=false;
    public lazyloadDataEvent: boolean=false;
    public sortFieldEvent: string='';
    public dataFilterEvent;
    public isFilterApplied=false;
    public sortorderEvent;
    public createAccess: boolean;
    public pmtTooltip: boolean = false;
    public wsTooltip: boolean = false;
    public positionTop: number;
    public positionLeft: number;
    public pmtActionPosition: string;
    public submitFlag: boolean = false;
    public submitActionFlag: boolean = false;
    public matrixSuccess: boolean = false;
    public successMsg: string = "";
    public matrixFlag: any = null;
    public emptyIndex: any = '-1';
    public workstreamLists = [];
    public workstreamListsArr=[];
    public userDashboardheadsArr=[];
    public userDashboardheadsArrExport=[];
    public domainDashboardheadsArrExport=[];
    public userthreadheadsArr=[];
    public userDashboardheadswid=[];
    public headerFields=[];
    public getuserDetails=[];
    public matrixSelectionList = [];
    public displayedColumns=[];
    public bodyHeight: number;
    public innerHeight: number;
    public innerWidth:number;
    public innerHeightnew: number;

    public passwordchecker:boolean = false;
    public successPasswordTextIcon: boolean = false;
    public disableDefaultPasswordText :boolean = false;
    public passwordValidationError:boolean = false;
    public passwordValidationErrorMsg: string = '';
    public passwordLen:number = 6;
    public fieldEnable: boolean = false;

    public addUserType1: boolean = true;
    public addUserType2: boolean = false;
    public newUserTypeFlagDefault: boolean = true;
    public newuserForm: FormGroup;
    public edituserForm: FormGroup;
    public TVSDomain: boolean = false;
    public cbaDomain: boolean = false;
    public TVSIBDomain: boolean = false;
    public collabticDomain: boolean = false;
    public newUserType: any = '';
    public overwritePermissionFlag: boolean = false;
    public accounthasDropDownError: boolean = false;
    public accounthasDropDownErrorFlag: boolean = false;
    public ResetpasswordcontentValue: string = '';
    public updateAssignTextFlag: boolean = false;
    userListColumns: string[];
    cols: any[];
    _selectedColumns: any[];
    frozenCols: any[];
    public assignEmailId;
    public assignCountry;
    public assignGroup;
    public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
    public divHeight = '450px';
    public pTableHeight = '450px';
    public pTableHeightVal = 450;
    public editDealerCodeOld;
    public filteredCountryIds = [];
    public filteredCountries = [];
    public bodyElem;
    public bodyClass: string = "submit-loader";
    public modalRef;
    public inviteSuccessFlag: boolean = false;
    public inviteUserCount:number=0;
    public existUserCount:number=0;
    public existUserArr = [];
    public inviteUserText: string = '';
    public existUserText: string = '';
    public updateAssRoleModal: boolean = false;
    public assRoleText: string = '';
    public checkloginId: string = '';
    public assRoleTextError: string = '';

    @ViewChild("dt", { static: false }) public dt: Table;
    @ViewChild('f') myForm;
    @ViewChild('uef') usrEditForm;

    @ViewChild('unf') usrNewForm;
    @ViewChild('unf1') usrNewForm1;

  onClick() {
    this.dt.reset();
  }

  notifyPopupScreen(position: string) {
    this.position = position;
    this.displayPosition = true;
}

   // userListSource: MatTableDataSource<UserListData>;
    usersList: UserListData[] = [];
    public usersLis;

    datasource:UserListData[] = [];
   // dataSource = new MatTableDataSource(this.usersList);
    public headercheckDisplay: string = "checkbox-hide";
    public headerCheck: string = "unchecked";
    pageAccess: string = "usermanagement";
  constructor(
    private titleService: Title,
    private router: Router,
    private userForm: FormBuilder,
    private scrollTopService: ScrollTopService,
    private userDashboardApi: UserDashboardService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private renderer: Renderer2,
    private elRef : ElementRef,
    private commonService: CommonService,
    private excelService: ExcelService,
    private authenticationService: AuthenticationService,
    private escalationApi: EscalationsService,

  ) {


    /* this.cities = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
        */
       this.workstreamsListdropdown=[];


       this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }


   resetpasswordForm= this.userForm.group(
    {
      Resetradioaction:['1',Validators.required],

    Resetpasswordcontent:['',Validators.required],
}
  );

  delete(drop,wid):void{
    //console.log(this.workstreamArrayval);
    this.workstreamArrayval.forEach((item, index) => {
      if (item.id === wid)
        this.workstreamArrayval.splice(index, 1);
    });
    //console.log(this.workstreamArrayval);
    this.workstreamArrayval = this.workstreamArrayval;
    if(this.workstreamArrayval.length==0)
    {
      this.multiselectdefaultLabel=' p-mdefaultlabel';


      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNamedefaultstr;

    }
    else
    {
      this.multiselectdefaultLabel=' p-mcustomlabel';
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNameselectedstr;
    }

        drop.options=this.workstreamsListdropdown;
        this.binSelect(drop);
      }

  binSelect(event)
  {
this.workstreamArrayval=event.value;
//console.log(event.value);
if(this.workstreamArrayval.length==0)
    {
      this.multiselectdefaultLabel=' p-mdefaultlabel';
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNamedefaultstr;
      this.accounthasWorkstreamError=true;
      this.workstreamValpushFlag = false;
    }
    else
    {
      this.multiselectdefaultLabel=' p-mcustomlabel';
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNameselectedstr;
      this.accounthasWorkstreamError=false;
      this.workstreamValpushFlag = true;
    }

  }



  emailExisteValidation()
  {
    return true;
  }
  get registerFormControl() {
    return this.resetpasswordForm.controls;
  }
  get UserEditFormControl() {
    return this.edituserForm.controls;
  }
  get UserNewFormControl() {
    return this.newuserForm.controls;
  }

  ngAfterViewInit(): void {
    const frozenBody: HTMLElement | null = document.querySelector('.ui-table-frozen-view .ui-table-scrollable-body');
    const scrollableArea: HTMLElement | null = document.querySelector('.ui-table-scrollable-view.ui-table-unfrozen-view .ui-table-scrollable-body');
    if (frozenBody && scrollableArea) {
      frozenBody.addEventListener('wheel', e => {
        const canScrollDown = scrollableArea.scrollTop < (scrollableArea.scrollHeight - scrollableArea.clientHeight);
        const canScrollUp = 0 < scrollableArea.scrollTop;

        if (!canScrollDown && !canScrollUp) {
          return;
        }

        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        const scrollDelta = 100;

        if (canScrollDown && scrollingDown) {
          e.preventDefault();
          scrollableArea.scrollTop += scrollDelta;
        } else if (canScrollUp && scrollingUp) {
          e.preventDefault();
          scrollableArea.scrollTop -= scrollDelta;
        }
      });
    }
  }

  ngOnInit(): void {
$('.mat-menu-content').addClass('ptablemenubar');
    //.log(this.elRef.nativeElement+'');
    window.addEventListener('scroll', this.scroll, true); //third parameter
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

      if(this.domainId=='71' || this.domainId=='165')
      {
        this.fromssoFlag=true;
      }

    this.countryId = localStorage.getItem('countryId');
    let countryInfo=localStorage.getItem('domainCountryInfo');
    let platformId=localStorage.getItem('platformId');
    this.TVSDomain = (platformId=='2' && this.domainId == '52') ? true : false;
    this.cbaDomain = (platformId=='3') ? true : false;
    this.collabticDomain = (platformId=='1') ? true : false;
    this.TVSIBDomain = (platformId=='2' && this.domainId == '97') ? true : false;


    this.statuses = [{label: 'Verified', value: 'Verified'},{label: 'Not verified', value: 'Not verified'}];
    this.statuses = [{label: 'Verified', value: 'Verified'},{label: 'Not verified', value: 'Not verified'}];
    this.waitingforApprovalues=[{label: 'Waiting for approval', value: 'Waiting for approval'},{label: 'Approved', value: 'Approved'}];
    this.workstreamstatus = [{label: 'Select', value: 'Select'},{label: 'Admin', value: 'Admin'},{label: 'Member', value: 'Member'}];
    if(this.TVSIBDomain){
      this.colaccountTypes = [{label: 'End-User', value: 'End-User'},{label: 'Manager', value: 'Manager'},{label: 'System Admin', value: 'System Admin'},{label: 'Country Admin', value: 'Country Admin'},{label: 'Global Access', value: 'Global Access'}];
      this.colaccountTypesNewUser = [{label: 'End-User', value: '1'},{label: 'Manager', value: '2'},{label: 'System Admin', value: '3'},{label: 'Country Admin', value: '6'},{label: 'Global Access', value: '10'}]
    }
    else if(this.TVSDomain){
      this.colaccountTypes = [{label: 'End-User', value: 'End-User'},{label: 'Manager', value: 'Manager'},{label: 'System Admin', value: 'System Admin'}];
      this.colaccountTypesNewUser = [{label: 'End-User', value: '1'},{label: 'Manager', value: '2'},{label: 'System Admin', value: '3'}]
    }
    else{
      this.colaccountTypes = [{label: 'End-User', value: 'End-User'},{label: 'Manager', value: 'Manager'},{label: 'System Admin', value: 'System Admin'},{label: 'Global Access', value: 'Global Access'}];
      this.colaccountTypesNewUser = [{label: 'End-User', value: '1'},{label: 'Manager', value: '2'},{label: 'System Admin', value: '3'},{label: 'Global Access', value: '10'}]
    }
    if(this.TVSDomain){
      this.coluserTypesNewUser = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'} ,{label: 'Agency', value: '3'},{label: 'Supplier', value: '4'}];
      this.coluserTypesHeader = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'},{label: 'Dealer Employee', value: '6'}, {label: 'Agency', value: '3'},{label: 'Supplier', value: '4'}];
    }
    else{
      this.coluserTypesNewUser = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'}];
      this.coluserTypesHeader = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'}];
    }
    if(this.collabticDomain){
      this.colTypesHeader = [{label: 'Active users', value: '1'},{label: 'Inactive users', value: '3'}, {label: 'Waiting for approval', value: '4' }, {label: 'Deleted Users', value: '5' }, {label: 'Invited Users', value: '6' }];

    }
    else if(platformId=='2' && this.domainId=='82'){
      this.colTypesHeader = [{label: 'Active users', value: '1'},{label: 'Inactive users', value: '3'}, {label: 'Waiting for approval', value: '4' }, {label: 'Deleted Users', value: '5' }, {label: 'Invited Users', value: '6' }];

    }
    else{
      this.colTypesHeader = [{label: 'Active users', value: '1'},{label: 'Inactive users', value: '3'}, {label: 'Waiting for approval', value: '4' }];
    }

    this.colBusinessRoles = [{label: 'Select', value: 'Select'},{label: 'Technician', value: 'Technician'},{label: 'Tech Support', value: 'Tech Support'},{label: 'Mobile Technician', value: 'Mobile Technician'},{label: 'CSM', value: 'CSM'},{label: 'Director', value: 'Director'},{label: 'VP', value: 'VP'}]
   if(this.cbaDomain)
   {
    this.colBusinessRoles = [{label: 'Select', value: 'Select'},{label: 'Technician', value: 'Technician'},{label: 'Store Manager', value: 'Store Manager'},{label: 'Trainer', value: 'Trainer'},{label: 'Franchise', value: 'Franchise'},{label: 'Home Office Employee', value: 'Home Office Employee'},{label: 'Vendor', value: 'Vendor'}]
   }
   else if(this.TVSDomain)   {    this.colBusinessRoles = [{label: 'Select', value: 'Select'},{label: 'Tech Support', value: 'Tech Support'}]   }

   //console.log(countryInfo);

   this.loadnewuserForm();
   this.loadedituserForm();

   // enabled all domains - strong password

   //if(this.domainId == '97'){
    this.passwordchecker = true;
    this.passwordLen = 8;
    this.fieldEnable = true;
  //}

  if(this.TVSDomain || this.TVSIBDomain){
    this.newUserType = '';
    this.selectedHeaderType = {
      label: 'Employee',
      value: '1',
    };
    this.selectedHeaderTypeId = '1';
  }
  else{
    this.newUserType = '1';
  }

   if(countryInfo && platformId=='2')
   {
    setTimeout(() => {
    this.colCountriesSelection =JSON.parse(countryInfo);
    },1000);

  }



//this.activeuserstyle='color:red';
//this.inactiveuserstyle='color:blue';
    this.userActivestatus = [{label: 'Active', value: 'Active'},{label: 'In Active', value: 'In Active'}]

    this.loadPTableHeaderRowsCols();




  //this.usersList=["1",""];
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
      this.displayedColumns = ["one","tow","three","four"];
      this.displayedColumns = [this.dynamicColumn];


  let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'isActive': 1,
        'searchKey': this.searchVal,
        'limit': this.itemLimit,
        'offset': this.itemOffset
      }

      this.apiData = apiInfo;
      this.innerHeight = (window.innerHeight-300);


      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true
      };
      //this.getuserDashboard();
      setTimeout(() => {
       this.showuserdashboard(1);
        this.getWorkstreamLists();
        this.getManagersList();
        this.threadheaderexport();

        let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
        let heigtVal1 = (window.innerHeight - 200) - (headerHeight);
        let heigtVal2 = (window.innerHeight - 200) - (headerHeight) + 123;
        this.pTableHeight = heigtVal1+'px';
        this.divHeight = heigtVal2+'px';
        this.pTableHeightVal = (window.innerHeight - 110) - (headerHeight-10);

      }, 1000);

  }
  else
  {
    this.router.navigate(['/forbidden']);
  }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
}

// load/set Header
loadPTableHeaderRowsCols(){
  this.userDashboardheadsArr=[];
  this.userDashboardheadsArrExport=[];
  this.cols = [];
  this.headerFields= [];
  this.frozenCols = [];

  if(this.TVSDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.headerFields=['Login ID','Dealer Code','Dealer Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','City','State','Zone','Area','Territory','Manager name'];
    }
    else if(this.selectedHeaderTypeId == '6'){
      this.headerFields=['Login ID','Dealer Code','Dealer Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','City','State','Zone','Area','Territory','Manager name'];
    }
    else{
      this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','Manager name'];
    }
  }
  else if(this.TVSIBDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.headerFields=['Login ID','Dealer Code','Dealer Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','City','State','Contact Name', 'Contact Phone', 'Contact Email', 'Manager name'];
    }
    else{
      this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','Manager name'];
    }
  }
  else if(this.cbaDomain)
  {
    this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Name','Business Title','Bussiness Role','Stagename','Join Date','Manager name','Store No','Store Phone Number','UIN','Achivement'];
  }
  else
  {
    this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Name','Business Title','Bussiness Role','Stagename','Join Date','Manager name'];
  }
let headerFieldsExport;
  if(this.TVSIBDomain)
  {
    headerFieldsExport=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','Manager name','Dealer Code','Dealer Name','State','City','Contact Email', 'Contact Phone', 'Contact Name'];
    for(let w1=0;w1<headerFieldsExport.length;w1++)
    {
      this.userDashboardheadsArrExport.push(headerFieldsExport[w1]);
    }
  }
  if(this.TVSDomain)
  {
    headerFieldsExport=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Title','Bussiness Role','Stagename','Join Date','Manager name','Dealer Code','Dealer Name','Zone','Area','Territory'];
    for(let w1=0;w1<headerFieldsExport.length;w1++)
    {
      this.userDashboardheadsArrExport.push(headerFieldsExport[w1]);
    }
  }

  for(let w1=0;w1<this.headerFields.length;w1++)
  {
    this.userDashboardheadsArr.push(this.headerFields[w1]);
  }
  if(this.TVSDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.cols = [
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        { width:'200px',field: 'city',header: "City",columnpclass:'normalptabletow'},
        { width:'200px',field: 'state',header: "State",columnpclass:'normalptabletow'},
        { width:'200px',field: 'zone',header: "Zone",columnpclass:'normalptabletow'},
        { width:'200px',field: 'userarea',header: "Area",columnpclass:'normalptabletow'},
        { width:'200px',field: 'territory',header: "Territory",columnpclass:'normalptabletow'},
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },
      ];
    }
    else if(this.selectedHeaderTypeId == '6'){
      this.cols = [
        { width:'200px',field: 'dealerName',header: 'Dealer Name' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'dealerCode',header: 'Dealer Code' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'SUBGROUP_DESC',header: 'Designation',columnpclass:'normalptabletow' },
        { width:'200px',field: 'GROUP_DESC',header: 'Employee Role',columnpclass:'normalptabletow' },
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'200px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        //{ width:'200px',field: 'state',header: "State",columnpclass:'normalptabletow'},
        //{ width:'200px',field: 'zone',header: "Zone",columnpclass:'normalptabletow'},
        //{ width:'200px',field: 'userarea',header: "Area",columnpclass:'normalptabletow'},
        //{ width:'200px',field: 'territory',header: "Territory",columnpclass:'normalptabletow'},
        { width:'200px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'220px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },
        { width:'200px',field: 'EMPLOYEE_ID',header: 'Employee ID',columnpclass:'normalptabletow' },
        { width:'200px',field: 'EMP_SUBGRP_ID',header: 'Subgroup ID',columnpclass:'normalptabletow' },
        { width:'200px',field: 'EMP_BRANCH_ID',header: 'Branch ID',columnpclass:'normalptabletow' },
        { width:'200px',field: 'branchName',header: 'Branch Name',columnpclass:'normalptabletow' },
        { width:'200px',field: 'DATE_OF_BIRTH',header: 'Date of Birth',columnpclass:'normalptabletow' },
        { width:'200px',field: 'JOIN_DATE',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'LEAVE_DATE',header: 'Leave Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ADDRESS_LINE_1',header: 'Address 1',columnpclass:'normalptabletow' },
        { width:'200px',field: 'ADDRESS_LINE_2',header: 'Address 2',columnpclass:'normalptabletow' },
        { width:'200px',field: 'ADDRESS_LINE_3',header: 'Address 3',columnpclass:'normalptabletow' },
        { width:'200px',field: 'LANDMARK',header: 'Landmark',columnpclass:'normalptabletow' },
        { width:'200px',field: 'CITY',header: "City",columnpclass:'normalptabletow'},
        { width:'200px',field: 'STATE_ID',header: "State ID",columnpclass:'normalptabletow'},
        { width:'200px',field: 'PIN_CODE',header: 'Pincode',columnpclass:'normalptabletow' },
        { width:'200px',field: 'PERM_PHONE_NO',header: 'Phone Number',columnpclass:'normalptabletow' },
        { width:'200px',field: 'LOC_ADDRESS',header: 'Local Address',columnpclass:'normalptabletow' },
        { width:'200px',field: 'LOCAL_PHONE_NO',header: 'Local Phone Number',columnpclass:'normalptabletow' },
        { width:'250px',field: 'EMAIL_ID',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'250px',field: 'PAN_NO',header: 'PAN Number',columnpclass:'normalptabletow' },
        { width:'200px',field: 'CREATED_ON',header: 'Created Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'MODIFIED_ON',header: 'Modified Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ACTIVE',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'GENDER',header: 'Gender',columnpclass:'normalptabletow' },
        { width:'200px',field: 'SON_DAU_OF',header: 'Son Of',columnpclass:'normalptabletow' },
        { width:'200px',field: 'MARRIED',header: 'Married',columnpclass:'normalptabletow' },
        { width:'200px',field: 'WORK_EXP_YRS',header: 'Work Exp Years',columnpclass:'normalptabletow' },
        { width:'220px',field: 'WORK_EXP_MONTHS',header: 'Work Exp Months',columnpclass:'normalptabletow' },
        { width:'250px',field: 'WORK_EXP_COMPANY',header: 'Work Exp Company',columnpclass:'normalptabletow' },
        { width:'200px',field: 'IS_DRIVING_LICENSE',header: 'Driving License',columnpclass:'normalptabletow' },
        { width:'200px',field: 'DL_NO',header: 'Dl Number',columnpclass:'normalptabletow' },
        { width:'200px',field: 'DL_EXPIRY_DATE',header: 'Dl Expiry Date',columnpclass:'normalptabletow' },
        { width:'200px',field: 'COMP_KNOWLEDGE_MS_OFFICE',header: 'MS Office',columnpclass:'normalptabletow' },
        { width:'300px',field: 'COMP_KNOWLEDGE_PROGRAMMING_LANGUAGE',header: 'Programming Language',columnpclass:'normalptabletow' },
        { width:'300px',field: 'COMP_KNOWLDGE_OTHERS',header: 'Others Program Languages',columnpclass:'normalptabletow' },
        { width:'200px',field: 'EMP_EDU_ID',header: 'EMP Edu Id',columnpclass:'normalptabletow' },
        { width:'180px',field: 'EDUCATION',header: 'Education',columnpclass:'normalptabletow' },
        { width:'200px',field: 'EMPLOYEE_AADHAR_NO',header: 'Aadhar Number',columnpclass:'normalptabletow' }
      ];
    }
    else{
      this.cols = [
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },
      ];
    }


  }
  else if(this.TVSIBDomain)
  {

    if(this.selectedHeaderTypeId == '2'){
      this.cols = [
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'countrySelection',header: 'Country' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        { width:'200px',field: 'zone',header: "State",columnpclass:'normalptabletow'},
        { width:'200px',field: 'userarea',header: "City",columnpclass:'normalptabletow'},
        { width:'200px',field: 'contactPersonName',header: "Contact Name",columnpclass:'normalptabletow'},
        { width:'200px',field: 'contactPersonPhone',header: "Contact Phone",columnpclass:'normalptabletow'},
        { width:'200px',field: 'contactPersonEmail',header: "Contact Email",columnpclass:'normalptabletow'},
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },
      ];
    }
    else{
      this.cols = [
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'countrySelection',header: 'Country' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },
      ];
    }

  }
  else if(this.cbaDomain)
  {
    this.cols = [

      { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
      { width:'170px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
      { width:'170px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
     // { width:'170px',field: 'countrySelection',header: 'Country' ,columnpclass:'normalptabletow'},
      { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
      { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
      { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},

      { width:'200px',field: 'st_no',header: "Store No",columnpclass:'normalptabletow'},
      { width:'200px',field: 'StorePhoneNumber',header: "Store Phone Number",columnpclass:'normalptabletow'},
      { width:'200px',field: 'Achivement',header: "Achivement",columnpclass:'normalptabletow'},
      { width:'200px',field: 'uin',header: "UIN",columnpclass:'normalptabletow'},
      { width:'200px',field: 'batch_id',header: "Batch Id",columnpclass:'normalptabletow'},

      { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
      { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
      { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
      { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
      { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },


  ];

  }
  else
  {

  this.cols = [
    { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
    { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
    { width:'170px',field: 'bussName',header: 'Business Name' ,columnpclass:'normalptabletow'},
    { width:'170px',field: 'bussTitle',header: 'Business Title' ,columnpclass:'normalptabletow'},
    { width:'170px',field: 'businessRole',header: 'Business Role' ,columnpclass:'normalptabletow'},
   // { width:'170px',field: 'countrySelection',header: 'Country' ,columnpclass:'normalptabletow'},
    { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
    { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
    { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},



    { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
    { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
    { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
    { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },


];
}

this._selectedColumns = this.cols;
if(this.TVSDomain || this.TVSIBDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.frozenCols = [
        { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
        { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
          { width:'165px',field: 'dealerName',header: 'Dealer Name' ,columnpclass:'frozenptabletow'},
         { width:'160px',field: 'dealerCode',header: 'Dealer Code' ,columnpclass:'frozenptabletow'},];
    }
    else if(this.selectedHeaderTypeId == '6'){
      this.frozenCols = [
        { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
        { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
        { width:'165px',field: 'Username',header: 'Employee Name' ,columnpclass:'frozenptabletow'},];
    }
    else{
      this.frozenCols = [
        { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
        { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
        { width:'165px',field: 'FirstName',header: 'First Name' ,columnpclass:'frozenptabletow'},
        { width:'160px',field: 'LastName',header: 'Last Name' ,columnpclass:'frozenptabletow'}];

    }

  }
  else{
this.frozenCols = [
  { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
  { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
    { width:'165px',field: 'FirstName',header: 'First Name' ,columnpclass:'frozenptabletow'},
    { width:'160px',field: 'LastName',header: 'Last Name' ,columnpclass:'frozenptabletow'},
    //{ width:'150px',field: 'DealerName',header: 'Dealer Name' ,columnpclass:'frozenptabletow'},
   // { width:'180px',field: 'DealerCode',header: 'Dealer Code' ,columnpclass:'frozenptabletow'},

];
  }
let DomainFieldsExport=[];
DomainFieldsExport=['Domain ID','Business Name','Domain Url','Industry','Created On','Email Address','Admin Name','Phone no'];
  for(let wd1=0;wd1<DomainFieldsExport.length;wd1++)
  {
    this.domainDashboardheadsArrExport.push(DomainFieldsExport[wd1]);
  }
}
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}


makeRowsSameHeight() {
  setTimeout(() => {
      if (document.getElementsByClassName('p-datatable-scrollable-wrapper').length) {
          let wrapper = document.getElementsByClassName('p-datatable-scrollable-wrapper');
          for (let i = 0; i < wrapper.length; i++) {
             let w = wrapper.item(i) as HTMLElement;
             let frozen_rows: any = w.querySelectorAll('.p-datatable-frozen-view tr');
             let unfrozen_rows: any = w.querySelectorAll('.p-datatable-unfrozen-view tr');
             for (let i = 0; i < frozen_rows.length; i++) {
                if (frozen_rows[i].clientHeight > unfrozen_rows[i].clientHeight) {
                   unfrozen_rows[i].style.height = frozen_rows[i].clientHeight+"px";
                   }
                else if (frozen_rows[i].clientHeight < unfrozen_rows[i].clientHeight)
                {
                   frozen_rows[i].style.height = unfrozen_rows[i].clientHeight+"px";
                }
              }
            }
          }
       });
     }

loadPage(event : LazyLoadEvent) {


  if(event.filters.EmailAddress[0].value!=null && event.filters.EmailAddress[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.FirstName[0].value!=null && event.filters.FirstName[0].value!='null')
  {
    this.isFilterApplied=true;
  }

  if(event.filters.IsVerified[0].value!=null && event.filters.IsVerified[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.LastName[0].value!=null && event.filters.LastName[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.ManagerName[0].value!=null && event.filters.ManagerName[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.Username[0].value!=null && event.filters.Username[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.businessRole[0].value!=null && event.filters.businessRole[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.bussTitle[0].value!=null && event.filters.bussTitle[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.userRole[0].value!=null && event.filters.userRole[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.waitingforApproval[0].value!=null && event.filters.waitingforApproval[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(event.filters.last_updated_on[0].value!=null && event.filters.last_updated_on[0].value!='null')
  {
    this.isFilterApplied=true;
  }
  if(this.sortFieldEvent!='undefined' && this.sortFieldEvent!=undefined)
  {
    this.isFilterApplied=true;
  }
  this.sortFieldEvent=event.sortField;
  this.sortorderEvent=event.sortOrder;
  this.dataFilterEvent=event.filters;

  //this.loading=true;
  console.log(this.sortFieldEvent);
  console.log(this.sortorderEvent);
  console.log(this.dataFilterEvent);

  if(this.isFilterApplied)
  {


    this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
    this.loadDataEvent=true;
  }


  /*
  setTimeout(() => {
    if(this.loadDataEvent==true)
    {
      this.showuserdashboard(this.userdashboardparam,'',event.sortField,event.sortOrder);
      this.loadDataEvent=false;
    }

    return false;
  },5000);
  */


  //event.preventDefault();
  //console.log(event);
  //return false;
  console.log(event);
  //console.log(event.sortField);
 // console.log(event.sortOrder);
  console.log(event.filters.EmailAddress);

  /*
  if (event.filters != undefined && event.filters["name"] != undefined){
  console.log(event.filters["name"]);
  console.log(event.filters);
  }
  */
}
scroll = (event: any): void => {
  console.log(event);
  console.log(event.target.className);
  if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
  {



  let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-10;
    this.scrollTop = event.target.scrollTop-90;
    this.makeRowsSameHeight();
   // console.log(this.scrollTop +'--'+ this.lastScrollTop +'--'+ this.scrollInit);
/*
    if(this.scrollTop >= this.lastScrollTop && this.scrollInit > 0) {
      console.log(inHeight +'--'+ totalHeight +'--'+ this.scrollCallback +'--'+ this.itemTotal +'--'+ this.itemLength);
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        this.loading=true;
        this.getuserDashboard();
      }
    }
    this.lastScrollTop = this.scrollTop;
    */
   console.log(this.userdashboardparam);
   console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+event.target.scrollHeight);
   if((event.target.scrollTop>0 && event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
   {

    //this.dt.reset();
    this.loading=true;
    this.loadDataEvent=true;
    console.log('1223');
    this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);

    event.preventDefault;
   }
  }
};

collectionHas(a, b) { //helper function (see below)
  for (let i = 0, len = a.length; i < len; i ++) {
      if(a[i] == b) return true;
  }
  return false;
}
findParentBySelector(elm, selector) {
  var all = document.querySelectorAll(selector);
  var cur = elm.parentNode;
  while(cur && !this.collectionHas(all, cur)) { //keep going up until you find a match
      cur = cur.parentNode; //go up
  }
  return cur; //will return null if not found
}
randomString(length, chars) {
  var result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
addNewcolumn()
{
  var rString = this.randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  this.cols.push({width:'180px',field: 'column'+rString,header: 'column '+rString,columnpclass:'normalptabletow'});

}
userActivestatusfun(event,userparam)
{
  let useractivevalue=0;
  if(event.value=='Active')
  {
    useractivevalue=1;
  }
  if(event.value=='In Active')
  {
    useractivevalue=0;
  }

  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "IsAccountActive":useractivevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('activeuser'+userparam);

  //var yourElm = document.getElementById("yourElm"); //div in your original code
var selector = "td";
var parent = this.findParentBySelector(elss, selector);


 //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
 // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

  this.renderer.addClass(parent, 'selectedItemp-table');
  this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');

  this.publishbutton=true;
}, 1000);


}
exportallThreads()
{
  let title = "Thread Expor";

        let exportInfo = [title,'All'];
        this.exportUserThreadALL(exportInfo);
}
exportUserThreadALL(exportInfo)
{
  this.excelreportdiaLog=true;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);


  this.userDashboardApi.GetallThreadExportData(apiFormData).subscribe((response) => {
    let exportData = response.threadData;
    this.excelreportdiaLog=false;
  //this.excelService.generateExcel('userThread', exportInfo, exportData,this.userthreadheadsArr,this.userDashboardheadswid);
  });
}
assigneeroleChange(){
  this.assRoleTextError='';
}
addNewRole(lid,event){
  this.updateAssRoleModal = true;
  this.checkloginId = lid;
  this.assRoleText = '';
  this.myInput2Element.nativeElement.blur();
  setTimeout(() => { // this will make the execution after the above boolean has changed    
    this.myInput2Element.nativeElement.focus();
  }, 100);
  this.assRoleTextError = '';
}
saveAssigneeRole(){
  if(this.assRoleText != ''){

    let colAssigneRolesItems = this.colAssigneRoles;
    let itemExit:boolean = false;
    for(let cr2 in colAssigneRolesItems)
    {
      if(colAssigneRolesItems[cr2].value == this.assRoleText){
        itemExit = true;
      }
    }
    if(!itemExit){
      this.colAssigneRoles.shift();
      this.colAssigneRoles.shift();
      this.colAssigneRoles.unshift({ label: this.assRoleText, value: this.assRoleText });
      this.colAssigneRoles.unshift({ label: `Select`, value: `Select` });
      this.colAssigneRoles.splice(0, 0, { label: `Add New`, value: `Add New` });
    }

    let selectedText = this.assRoleText;

    for (let t in this.usersList) {
      if(this.usersList[t]['LoginID'] == this.checkloginId){
        this.usersList[t]['assigneeRole'] = selectedText;
      }
    }
    
    console.log('role :' + JSON.stringify(this.colAssigneRoles));

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('name', this.assRoleText);

    this.userDashboardApi.saveAssigneeRoles(apiFormData).subscribe((response) => {
      if(response.status=="Success"){
        this.updateAssRoleModal = false;
        this.reguser_array.push({
          "userID":this.checkloginId,
          "assigneeRole":selectedText
        });
      }
      else{
        this.assRoleTextError = response.result;
        //this.updateAssRoleModal = false;
      }
    });
    
    setTimeout(()=>{                           //<<<---using ()=> syntax
      let elss=document.getElementById('assigneeList'+this.checkloginId);
      var selector = "td";
      var parent = this.findParentBySelector(elss, selector);
      this.renderer.addClass(parent, 'selectedItemp-table');
      this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
      this.publishbutton=true;
    }, 1000);

  }

}

userAssigneeRolefun(event,userparam)
{

  if(event.value == 'Add New'){
    for (let t in this.usersList) {
      if(this.usersList[t]['LoginID'] == userparam){
        this.usersList[t]['assigneeRole'] = 'Select';
      }
    }
  }
  else{

  //moment.tz.guess();
  console.log('event :' + event.value);  
 
  this.activeuserstyleonchange='background:yellow';

  this.reguser_array.push({
    "userID":userparam,
    "assigneeRole":event.value
  });
  console.log(this.reguser_array);

  setTimeout(()=>{                           //<<<---using ()=> syntax
    let elss=document.getElementById('assigneeList'+userparam);
    var selector = "td";
    var parent = this.findParentBySelector(elss, selector);
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
    this.publishbutton=true;
  }, 1000);

}

}
threadheaderexport()
{
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);


  this.userDashboardApi.GetThreadExportAll(apiFormData).subscribe((response) => {

   
    if(response.status=='Success')
    {
     let threadHeaderDataInfo= response.threadHeader;
     let businessRoleItems,colAssigneRolesItems;
     if(response.items)
     {
    
    if(this.TVSDomain)
    {
      businessRoleItems= response.items;
      colAssigneRolesItems= response.items;
      //this.colBusinessRoles=[];
      this.colAssigneRoles=[];
      /*for(let br2 in businessRoleItems)
      {
        this.colBusinessRoles.push({label: businessRoleItems[br2].label, value: businessRoleItems[br2].value});
      }*/
      for(let ar2 in colAssigneRolesItems)
      {
        this.colAssigneRoles.push({ label: colAssigneRolesItems[ar2].label, value: colAssigneRolesItems[ar2].value});        
      }
      this.colAssigneRoles.push({ label: `Not Available`, value: `Not Available` });
      this.colAssigneRoles.splice(0, 0, { label: `Add New`, value: `Add New` });
    }
     }
    
     for (let md2  in threadHeaderDataInfo)
     {
       this.userthreadheadsArr.push(threadHeaderDataInfo[md2].name);
       //console.log(headdataInfo[md1].name);
     }
     let modelDataInfo= response.modelData;
    for (let md in  modelDataInfo)
    {
      let headdataInfo=modelDataInfo[md].data;
      //console.log(modelDataInfo[md]);
      for (let md1  in headdataInfo)
      {
        this.userthreadheadsArr.push(headdataInfo[md1].name);
        //console.log(headdataInfo[md1].name);
      }

    }
    }
   // console.log(response);
  });
}

exportallUsersDashboard()
{
  let title = "userDashboard Reports";

        let exportInfo = [title,'All'];
        //this.exportUserDashALL(exportInfo);
       // console.log(this.userDashboardheadswid);
     this.exportPOPUP();


}
exportPOPUP(){

  let exportHeader;

   if(this.TVSIBDomain || this.TVSDomain)
   {
    exportHeader=this.userDashboardheadsArrExport;
   }
   else
   {
    exportHeader=this.userDashboardheadsArr;
   }



  let pageAccess = 'user-dashboard';
  let selectedHeaderType = '';
  if(this.TVSDomain || this.TVSIBDomain){
    selectedHeaderType = this.selectedHeaderType['label'];
  }
  else{
    selectedHeaderType = 'All';
  }
  let apiData = {
    apiKey: Constant.ApiKey,
    userId: this.userId,
    domainId: this.domainId,
    exportHeader: exportHeader,
    countryId: this.countryId,
    userType: this.selectedHeaderTypeId,
    workstreamArr:this.userDashboardheadswid,
    userTypeName: selectedHeaderType,
    limit: this.itemLimit,
  };
  const modalRef = this.modalService.open(ExportPopupComponent, {backdrop: 'static', keyboard: false, centered: true});
  modalRef.componentInstance.apiData = apiData;
  modalRef.componentInstance.exportInfo = '';
  modalRef.componentInstance.exportData = [];
  modalRef.componentInstance.access = pageAccess;
  modalRef.componentInstance.exportAllFlag = false;
  modalRef.componentInstance.updateonExportisDone.subscribe((receivedService) => {
    if (receivedService == 1) {
      modalRef.dismiss('Cross click');
    }
  });
}

exportallDomainDashboard()
{
  let title = "Domain Reports";

        let exportInfo = [title,'All'];
        this.exporDomainDashALL(exportInfo);
}

exportUserDashALL(exportInfo)
{
  this.excelreportdiaLog=true;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  let exportHeader;

   if(this.TVSIBDomain || this.TVSDomain)
   {
    exportHeader=this.userDashboardheadsArrExport;
   }
   else
   {
    exportHeader=this.userDashboardheadsArr;
   }
  this.userDashboardApi.getuserlist(apiFormData).subscribe((response) => {
    let exportData = response.data.user_details;
    this.excelreportdiaLog=false;
  this.excelService.generateExcel('userDashboard', exportInfo, exportData,exportHeader,this.userDashboardheadswid,this.domainId);
  });
}

exporDomainDashALL(exportInfo)
{
  this.excelreportdiaLog=true;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  let exportHeader;


    exportHeader=this.domainDashboardheadsArrExport;

  this.userDashboardApi.getDomainListDashboard(apiFormData).subscribe((response) => {
    let exportData = response.items;
    this.excelreportdiaLog=false;
  this.excelService.generateExcel('domainDashboard', exportInfo, exportData,exportHeader,this.userDashboardheadswid,this.domainId);
  });
}
userVerifystatusfun(event,userparam)
{
  //moment.tz.guess();
  let userverifiedvalue=0;
  if(event.value=='Verified')
  {
    userverifiedvalue=1;
  }
  if(event.value=='Not Verified')
  {
    userverifiedvalue=0;
  }

  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "IsVerified":userverifiedvalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('verifyuseruser'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);


   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);


}

userAccountTypefun(event,userparam)
{
  //moment.tz.guess();
  let useraccountTypevalue=0;
  if(event.value=='End-User')
  {
    useraccountTypevalue=1;
  }
  if(event.value=='Manager')
  {
    useraccountTypevalue=2;
  }
  if(event.value=='System Admin')
  {
    useraccountTypevalue=3;
  }
  if(event.value=='Country Admin')
  {
    useraccountTypevalue=6;
  }
  if(event.value=='Global Access')
  {
    useraccountTypevalue=10;
  }
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "RoleID":useraccountTypevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('accounttype'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);


   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
  this.refreshOption=true;
}, 1000);

}


userBussinessRolefun(event,userparam)
{
  //moment.tz.guess();
  let useraccountTypevalue=0;

  
  if(this.cbaDomain)
  {
    if(event.value=='Technician')
    {
      useraccountTypevalue=1;
    }
    if(event.value=='Store Manager')
    {
      useraccountTypevalue=2;
    }
    if(event.value=='Trainer')
    {
      useraccountTypevalue=3;
    }
    if(event.value=='Franchise')
    {
      useraccountTypevalue=4;
    }
    if(event.value=='Home Office Employee')
    {
      useraccountTypevalue=5;
    }
    if(event.value=='Vendor')
    {
      useraccountTypevalue=6;
    }
  }
  else if(this.TVSDomain)
  {

 useraccountTypevalue=event.value;
  }
  else
  {



  if(event.value=='Technician')
  {
    useraccountTypevalue=1;
  }
  if(event.value=='CSM')
  {
    useraccountTypevalue=2;
  }

  if(event.value=='Director')
  {
    useraccountTypevalue=3;
  }
  if(event.value=='VP')
  {
    useraccountTypevalue=4;
  }

  if(event.value=='Mobile Technician')
  {
    useraccountTypevalue=5;
  }
  if(event.value=='Tech Support')
  {
    useraccountTypevalue=6;
  }
}
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';

this.reguser_array.push({
  "userID":userparam,
  "businessRole":useraccountTypevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('businessRole'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);


   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}

userCountryRolefun(event,userparam)
{
let CountryValueSelect=[];
if(event.value.length>0)
{
  for (let c=0;c<event.value.length;c++)
  {
    let cvalue=event.value[c].value;
    CountryValueSelect.push(cvalue);
  }

}
this.reguser_array.push({
  "userID":userparam,
  "countries":JSON.stringify(CountryValueSelect)
});
 //console.log(JSON.stringify(CountryValueSelect));
  setTimeout(()=>{                           //<<<---using ()=> syntax
    let elss=document.getElementById('countrySelection'+userparam);
    var selector = "td";
    var parent = this.findParentBySelector(elss, selector);


     //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
     // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

      this.renderer.addClass(parent, 'selectedItemp-table');
      this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
    this.publishbutton=true;
  }, 1000);
  this.publishbutton=true;
}

updateAssigneeRole(event,userparam)
{
  //moment.tz.guess();
  let assigneeRolevalue=(event.target.value);;


  console.log('event :' + event);
  console.log((event.target.value)+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "assigneeRole":assigneeRolevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('assigneeList'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);


   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}

userManagersfun(event,userparam)
{
  //moment.tz.guess();
  let userManagervalue=event.value;


  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "ManagerName":userManagervalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('managersList'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);


   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}
userwaitingForapprovalfun(event,userparam)
{
  //moment.tz.guess();
  let userManagervalue=event.value;

  let userwaitingforvalue=0;
  if(event.value=='Approved')
  {
    userwaitingforvalue=0;
  }
  if(event.value=='Waiting for approval')
  {
    userwaitingforvalue=1;
  }
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "waitingforApproval":userwaitingforvalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('waitingforapproval'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);


   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}
handleKeyup($event)
{

}
cancelresetpopup()
{

  this.loading = false;
  this.resetpasswordForm.reset();
  this.radioOptions= '1';
  this.resetpassvalidationmsg='';
  this.displaydiaLog = false;
  this.displayValidationforreset=false;
  this.ResetpasswordcontentValue = '';
  this.passwordValidationError = false;
  this.passwordValidationErrorMsg = '';
  this.successPasswordTextIcon = false;
  this.disableDefaultPasswordText = false;
}

cancelnewusrpopup()
{
  this.loading = false;
  this.newuserForm.reset();
  this.radioOptions= '1';
  this.resetpassvalidationmsg='';
  this.displaydiaLog = false;
  this.displaydiaLogAdd=false;
  this.findnewformflag=false;
  this.isEmailExist=false;
  this.accounthasWorkstreamError = false;
  this.disableDefaultPasswordText = false;
  this.passwordValidationError = false;
  this.updateuservalidationmsg = '';
  this.workstreamValpush=[];
  this.workstreamValpushFlag = false;
  this.countryValpush=[];
  this.countryValpushFlag = false;
  this.addUserType1 = true;
  this.addUserType2 = false;
  this.successPasswordTextIcon = false;
  this.isDisableWorkstream = false;
  this.filteredCountries = [];
  this.filteredCountryIds = [];
  if(this.TVSDomain || this.TVSIBDomain){
    this.newUserType = '';
    this.newUserTypeFlagDefault = false;
    this.newuserForm.disable();
    this.newuserForm.get('newUserType').enable();
  }
  this.loadnewuserForm();
}


cancelEdituserpopup()
{

  this.usrEditForm.resetForm();
 this.updateuservalidationmsg='';
  this.displaydiaLogEdit = false;
  this.overwritePermissionFlag = false;
  this.alreadyExistFlag = false;

 // this.displayValidationforreset=false;
 if(this.TVSDomain || this.TVSIBDomain){
  this.newUserType = '';
  this.newUserTypeFlagDefault = false;
}
this.loadedituserForm();
this.loading = false;
}

closeresetpopup()
{

this.cancelresetpopup();
}
showDialog(usersLis) {
  this.usersLis = usersLis;
  this.displaydiaLog = true;
  //this.cancelresetpopup();
}

DeleteUserDialog(usersLis,event)
{

  console.log(usersLis);
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'userDelete';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss('Cross click');
      console.log(recivedService);
      if(!recivedService) {
        return;
      } else {
       this.deleteUserAccunt(usersLis);
      }
    });
}
deleteUserAccunt(usersLis)
{
  let type:any = 1;
  let countryId = localStorage.getItem('countryId');
  console.log(countryId);
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('deletedUserId', usersLis.LoginID);
  apiFormData.append('countryId', countryId);

  apiFormData.append('userId', this.apiData['userId']);



  this.userDashboardApi.DeleteUserAccount(apiFormData).subscribe((response) => {
    if(response.status=="Success")


    {

      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = response.result;
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');




            this.showuserdashboard(this.userdashboardparam);


      }, 2000);

      }

      });

}

RestoreUserDialog(usersLis,event)
{

  console.log(usersLis);
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'userRestore';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss('Cross click');
      console.log(recivedService);
      if(!recivedService) {
        return;
      } else {
        let type='restore';
       this.onSubmitedituserForm(usersLis,type);
      }
    });
}


EditUserDialog(usersLis,event) {
  this.overwritePermissionFlag = false;
  this.alreadyExistFlag = false;
  this.primetablerowdata=usersLis;
  console.log(this.primetablerowdata);

  let userTypeValue = this.primetablerowdata['userType'];
  console.log(userTypeValue);
  if(this.TVSDomain || this.TVSIBDomain){
    this.newUserType = userTypeValue;
  }
  else{
    this.newUserType = '1';
  }
  this.addUserType2 = (userTypeValue=='2') ? true : false;
  this.addUserType1 = (userTypeValue=='2') ? false : true;
  if(this.TVSDomain){
    this.loadDealerUsageMetrics();
  }
  this.loadedituserForm();
setTimeout(() => {
  if(this.addUserType2){
    if(this.TVSDomain){
      var zoneVal = usersLis.zone.toUpperCase();
      this.edituserForm.patchValue({
        editUserEmailAddress:usersLis.EmailAddress,
        editUserBussTitle:usersLis.bussTitle,
        editDealerName:usersLis.dealerName,
        editDealerCode:usersLis.dealerCode,
        editUserTerritory:usersLis.territory,
        editUserArea:usersLis.userarea,
        editUserZone:zoneVal,
      });
      this.editDealerCodeOld = usersLis.dealerCode;
    }
    else{
    this.edituserForm.patchValue({
      editUserEmailAddress:usersLis.EmailAddress,
      editDealerName:usersLis.dealerName,
      editDealerCode:usersLis.dealerCode,
      editUserBussTitle:usersLis.bussTitle,
      editcontactPersonName:usersLis.contactPersonName,
      editcontactPersonPhone:usersLis.contactPersonPhone,
      editcontactPersonEmail:usersLis.contactPersonEmail,
    });
    }
  }
  else{
    this.edituserForm.patchValue({
      editUserEmailAddress:usersLis.EmailAddress,
      editUserFirstname:usersLis.FirstName,
      editUserLastname:usersLis.LastName,
      editUserBussTitle:usersLis.bussTitle,
    });
  }
  this.displaydiaLogEdit = true;
}, 100);

  console.log(usersLis.zone);
  this.usersLis =usersLis;

}

AssignDialog() {
  this.displaydiaLogAssign = true;
}
cancelAssignpopup() {
  this.displaydiaLogAssign = false;
  this.newUserEmailAddress = '';
}
updateAssignpopup(){
  this.displaydiaLogAssign = false;

  const apiFormData = new FormData();
apiFormData.append('apiKey', this.apiData['apiKey']);
apiFormData.append('domainId', this.apiData['domainId']);
apiFormData.append('countryId', this.apiData['countryId']);
apiFormData.append('userId', this.apiData['userId']);
apiFormData.append('email', this.assignEmailId);
apiFormData.append('password', 'password123');
apiFormData.append('roleId', "");
apiFormData.append('firstname', "");
apiFormData.append('lastname',"");
apiFormData.append('groups', this.assignGroup);
apiFormData.append('userType', this.newuserForm.value.newUserType);
this.userDashboardApi.AddInviteUserbyAdmin(apiFormData).subscribe((response) => {
 if(response.status=="Success")
  {
    this.displaydiaLogAssignFlag = false;
    this.newformDisable=false;
   // this.displaydiaLog = false;
   this.cancelnewusrpopup();
  const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
  modalMsgRef.componentInstance.msg = response.message;
  setTimeout(() => {

      modalMsgRef.dismiss('Cross click');
      this.showuserdashboard(1,'2');
      this.workstreamArrayval=[];
      this.workstreamValpush=[];
      this.workstreamValpushFlag = false;
      this.loading=false;

  }, 2000);

  }
  else
{
this.loading=false;
this.newformDisable=false;

}
});

}

AddUserDialog() {

  if(this.ssoEnabled=='1')
  {
    this.displaydiaLogSSO=true;
    return;
  }

  this.findnewformflag=true;
  console.log();

  this.displaydiaLogAdd = true;
  if(this.TVSDomain){
    this.loadDealerUsageMetrics();
  }
  if(this.TVSDomain || this.TVSIBDomain){
    let value = '';
    this.addUserType2 = (value=='2') ? true : false;
    this.addUserType1 = (value=='2') ? false : true;
    this.newUserTypeFlagDefault = true;
    this.newUserType = value;
    this.workstreamValpushFlag = false;
    this.workstreamValpush = [];
    this.workstreamArrayval = [];
   // this.isEnableCountry = true;
    this.filteredCountries=[];
    this.filteredCountryIds=[];
    this.loadnewuserForm();
  }


}
onChangeRadio($event: MatRadioChange)
{
  this.resetpassvalidationmsg = '';

if($event.value != undefined){
  if($event.value==2)
  {
    this.displayValidationforreset=true;
  }
  else
  {
    this.displayValidationforreset=false;
    this.ResetpasswordcontentValue = '';
    this.passwordValidationError = false;
    this.passwordValidationErrorMsg = '';
  }
}
}
checkfirstnametext(event)
{

}
checklastanmetext(event)
{

}
checkpasswordtext(event)
{
  if(this.passwordchecker){
    this.fieldEnable = false;
    var inputVal = event.target.value.trim();
    var inputLength = inputVal.length;

    if(this.passwordLen<=inputLength){
      this.checkPwdStrongValidation('new');
    }
    else{
      if(inputLength == 0){
        this.passwordValidationError = false;
        this.passwordValidationErrorMsg = '';
      }
      if(this.passwordValidationError){
        this.checkPwdStrongValidation('new');
      }
      this.disableDefaultPasswordText = false;
      this.successPasswordTextIcon = false;
    }
  }
}
/*get accounthasDropDownError()
{
  return (
    this.newuserForm.get('newUserAccountType').touched
    && this.newuserForm.get('newUserAccountType').invalid
  )
}*/
get userTypehasDropDownErrorType()
{
  return (
    this.newuserForm.get('newUserType').touched
    && this.newuserForm.get('newUserType').invalid
  )
}
// user type change
onChange(value){
  this.addUserType2 = (value=='2') ? true : false;
  this.addUserType1 = (value=='2') ? false : true;
  if(value == '3'){
    this.tvsAgency = true;
  }
  this.newUserTypeFlagDefault = true;
  this.newUserType = value;
  this.workstreamValpushFlag = false;
  this.workstreamValpush = [];
  this.workstreamArrayval = [];
  this.loadnewuserForm();
}
onChangeAccountType(value){
  if(value > 0){
    this.accounthasDropDownError = false;
    this.accounthasDropDownErrorFlag = true;
  }
  if(this.TVSIBDomain){
    if(value > 0){
      this.filteredCountries=[];
      this.filteredCountryIds=[];

      if(value == 10){
        this.isEnableCountry = true;
        this.filteredCountries.push('All');
        this.filteredCountryIds.push('0');
      }
      else{
        this.isEnableCountry = false;
        let countryId = localStorage.getItem('countryId');
        let countryName = localStorage.getItem('countryName');
        if(countryId!=''){
          this.filteredCountries.push(countryName);
          this.filteredCountryIds.push(countryId);
        }
        else{
          this.filteredCountries=[];
          this.filteredCountryIds=[];
        }
      }
    }
    else{
      this.isEnableCountry = true;
    }
  }


}
// header user type change
selectTypeLoad(event){

  this.selectedHeaderTypeId = event.value.value;
  this.loadPTableHeaderRowsCols();
  setTimeout(() => {
    this.showuserdashboard(1);
    this.getWorkstreamLists();
    this.getManagersList();
    this.threadheaderexport();
  }, 100);
}

// header user type change
selectTypeUsersLoad(event){

  this.selectedHeaderTypeUsersId = event.value.value;
  this.showuserdashboard(this.selectedHeaderTypeUsersId);

}

checkresetpasstext(event)
{
  this.resetpassvalidationmsg = '';
  //if(event.target.value!='')
  //{
    this.radioOptions= '2';
    this.displayValidationforreset=true;

    if(this.passwordchecker){
      this.fieldEnable = false;
      var inputVal = event.target.value.trim();
      var inputLength = inputVal.length;

      if(this.passwordLen<=inputLength){
        this.checkPwdStrongValidation('reset');
      }
      else{
        if(inputLength == 0){
          this.passwordValidationError = false;
          this.passwordValidationErrorMsg = '';
        }
        if(this.passwordValidationError){
          this.checkPwdStrongValidation('reset');
        }
        this.disableDefaultPasswordText = false;
        this.successPasswordTextIcon = false;
      }
    }

 // }
  //else
 // {
    //this.custompasswordcheck=false;
   // this.defaultpasswordcheck=true;
   // this.displayValidationforreset=false;
  //}

console.log(event.target.value);

}
onSubmitresetForm(userId)
{
  this.loading=true;
  let submitresetform;
 // console.log(userId);
  let resetforms =this.resetpasswordForm.value;
  let resetradioVal=resetforms.Resetradioaction;
  let resetpassVal=resetforms.Resetpasswordcontent;
  let resetuserId=userId;
  if(resetradioVal==1)
  {
     resetpassVal='password123';
     submitresetform=true;
  }
  else
  {
    resetpassVal=resetforms.Resetpasswordcontent;
    if(resetpassVal!='')
    {


      if(this.passwordLen>resetpassVal.length || this.passwordValidationError){
        this.accounthaspasswordError=true;
        return;
      }
      else
      {
        this.accounthaspasswordError=false;
      }

      submitresetform=true;

    }
  }
  if(submitresetform)
  {

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('logged_user', this.apiData['userId']);
    apiFormData.append('userid', resetuserId);
    apiFormData.append('password', resetpassVal);
    apiFormData.append('cpassword', resetpassVal);
    apiFormData.append('access_type', 'desktop');

    this.userDashboardApi.updateuserpassbyAdmin(apiFormData).subscribe((response) => {
      if(response.status=="Success" || response.status=="1")
      {
        this.displaydiaLog = false;
        this.cancelresetpopup();
        const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        modalMsgRef.componentInstance.msg = 'Password reset successfully';
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
          //this.showuserdashboard(1);
          this.loading=false;
        }, 2000);
      }
      else
      {
        this.loading=false;
        this.resetpassvalidationmsg=response.message;

      }
    });
  }

  //console.log(this.resetpasswordForm.value);

}
onRowSelect(event)
{

  this.primetablerowdata=event.data;
console.log(event.data);
//event.data.FirstName='ddasdadsddadd';
}
onSubmitNewuserFormDealer()
{
}
onSubmitNewuserForm()
{

  let pwdVal = this.newuserForm.value.newUserTmpPassword.trim();
  if(this.passwordLen>pwdVal.length || this.passwordValidationError){
    this.accounthaspasswordError=true;
    return;
  }
  else
  {
    this.accounthaspasswordError=false;
  }



  this.updateuservalidationmsg='';
  this.loading=true;
  let newuserFormValues =this.newuserForm.value;
  let newUserEmailAddressvar='';
  let newUserFirstnamevar='';
  let newUserLastnamevar='';
  let newUserManagervar='';
  let newUserNoManagervar='';
  let newUserTmpPasswordvar='';
  let newUserAccountTypevar='';
  let newUserBussTitlevar='';
  let workstreamVal;

  let newUserTypevar='';
  let newUserDealerCodevar='';
  let newUserDealerNamevar='';
  let newUserCityvar='';
  let newUserStatevar='';
  let newUserAreavar='';
  let newUserZonevar='';
  let newUserAddress1var='';
  let newUserAddress2var='';
  let newUserTerritoryvar='';
  let contactPersonNamevar='';
  let contactPersonPhonevar='';
  let contactPersonEmailvar='';
  let countryVal;

  if(this.addUserType1){
    newUserTypevar =newuserFormValues.newUserType;
    newUserEmailAddressvar =newuserFormValues.newUserEmailAddress;
    newUserFirstnamevar =newuserFormValues.newUserFirstname;
    newUserLastnamevar =newuserFormValues.newUserLastname;
    newUserManagervar  =newuserFormValues.newUserManager;
    newUserNoManagervar=newuserFormValues.newUserNoManager;
    newUserTmpPasswordvar=newuserFormValues.newUserTmpPassword;
    newUserAccountTypevar=newuserFormValues.newUserAccountType;
    newUserBussTitlevar=newuserFormValues.newUserBussTitle;
    workstreamVal=newuserFormValues.newUserworkstream;
    if(this.TVSIBDomain){
      countryVal=this.filteredCountryIds;
    }
  }
  else{
    newUserTypevar =newuserFormValues.newUserType;
    newUserEmailAddressvar =newuserFormValues.newUserEmailAddress;
    newUserTmpPasswordvar=newuserFormValues.newUserTmpPassword;
    newUserDealerNamevar =newuserFormValues.newUserDealerName;
    newUserDealerCodevar =newuserFormValues.newUserDealerCode;
    newUserCityvar  =newuserFormValues.newUserCity;
    newUserStatevar =newuserFormValues.newUserState;
    newUserAddress1var =newuserFormValues.newUserAddress1;
    newUserAddress2var =newuserFormValues.newUserAddress2;
    newUserAccountTypevar='1';
    workstreamVal =newuserFormValues.newUserworkstream;
    if(this.TVSDomain){
      newUserTerritoryvar =newuserFormValues.newUserTerritory;
      newUserAreavar  =newuserFormValues.newUserArea;
      //newUserZonevar =newuserFormValues.newUserState;
      newUserZonevar =newuserFormValues.newUserZone;
    }
    if(this.TVSIBDomain){
      contactPersonNamevar =newuserFormValues.contactPersonName;
      contactPersonPhonevar  =newuserFormValues.contactPersonPhone;
      contactPersonEmailvar =newuserFormValues.contactPersonEmail;
      countryVal=this.filteredCountryIds;
    }
  }
  let managerNameVal='';
  let noManager = '0';
  if(newUserNoManagervar)
  {
    managerNameVal='';
    noManager = '1';
  }
  else
{
  managerNameVal=newUserManagervar;
}
  console.log(newuserFormValues);


if(workstreamVal)
{
  for(let workstreamVals of workstreamVal) {
    console.log(workstreamVals.id);
    this.workstreamValpush.push(workstreamVals.id);
  }
}

this.accounthasDropDownError=false;
this.accounthasWorkstreamError=false;

if(newUserAccountTypevar == ''){
  this.accounthasDropDownError = true;
  this.accounthasDropDownErrorFlag = false;
  return;
}
else{
  this.accounthasDropDownErrorFlag = true;
}
/*
if(this.TVSIBDomain){
  if(this.filteredCountries.length==0)
  {
    this.accounthasCountryError=true;
    this.countryValpushFlag = false;
    return;
  }
  else{
    this.accounthasCountryError=false;
    this.countryValpushFlag = true;
  }
}
*/


if(this.workstreamValpush.length==0)
  {
    this.accounthasWorkstreamError=true;
    this.workstreamValpushFlag = false;
    if(this.TVSIBDomain && !this.isDisableWorkstream && !this.workstreamValpushFlag){
      return;
    }
    else if(this.TVSIBDomain && this.isDisableWorkstream && !this.workstreamValpushFlag){
      this.accounthasWorkstreamError=false;
      this.workstreamValpushFlag = true;
    }
    else{
      return;
    }

  }
  else
  {
    this.accounthasWorkstreamError=false;
    this.workstreamValpushFlag = true;
  }




console.log(noManager);

const apiFormData = new FormData();
apiFormData.append('apiKey', this.apiData['apiKey']);
apiFormData.append('domainId', this.apiData['domainId']);
apiFormData.append('countryId', this.apiData['countryId']);
apiFormData.append('userId', this.apiData['userId']);
apiFormData.append('email', newUserEmailAddressvar);
apiFormData.append('password', newUserTmpPasswordvar);
apiFormData.append('roleId', newUserAccountTypevar);
if(this.TVSIBDomain && this.isDisableWorkstream && !this.workstreamValpushFlag){
  this.workstreamValpush = [];
}
apiFormData.append('groups', JSON.stringify(this.workstreamValpush));
apiFormData.append('firstname', newUserFirstnamevar);
apiFormData.append('lastname', newUserLastnamevar);

if(this.TVSDomain || this.TVSIBDomain){
  apiFormData.append('userType', newUserTypevar);
}
if(this.addUserType1){
  apiFormData.append('bussTitle', newUserBussTitlevar);
}
if(this.TVSIBDomain){
  apiFormData.append('countries',JSON.stringify(countryVal));
}
if(this.addUserType1 && !this.tvsAgency){
  apiFormData.append('managername', managerNameVal);
  apiFormData.append('noManager', noManager);
}
else{
  apiFormData.append('dealerName', newUserDealerNamevar);
  apiFormData.append('dealerCode', newUserDealerCodevar);
  apiFormData.append('city', newUserCityvar);
  apiFormData.append('state', newUserStatevar);
  apiFormData.append('address1', newUserAddress1var);
  apiFormData.append('address2', newUserAddress2var);
  if(this.TVSDomain){
    apiFormData.append('territory', newUserTerritoryvar);
    apiFormData.append('area', newUserAreavar);
    apiFormData.append('zone', newUserZonevar);
  }
  if(this.TVSIBDomain){
    apiFormData.append('contactPersonName', contactPersonNamevar);
    apiFormData.append('contactPersonPhone', contactPersonPhonevar);
    apiFormData.append('contactPersonEmail', contactPersonEmailvar);
  }
}

this.newformDisable=true;
//new Response(apiFormData).text().then(console.log)

this.userDashboardApi.AddInviteUserbyAdmin(apiFormData).subscribe((response) => {
  if(response.status=="Success")
  {
    this.newformDisable=false;
   // this.displaydiaLog = false;
   this.cancelnewusrpopup();
  const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
  modalMsgRef.componentInstance.msg = 'User added Successfully';
  setTimeout(() => {
   if(this.TVSDomain || this.TVSIBDomain){
    if(this.selectedHeaderTypeId != newUserTypevar){
      this.selectedHeaderTypeId = newUserTypevar;
      if(this.selectedHeaderTypeId == '1'){
        this.selectedHeaderType = {
          label: 'Employee',
          value: '1',
        };
      }
      if(this.selectedHeaderTypeId == '2'){
        this.selectedHeaderType = {
          label: 'Dealer',
          value: '2',
        };
      }
      else{
        this.selectedHeaderType = {
          label: 'Agency',
          value: '3',
        };
      }
      this.loadPTableHeaderRowsCols();
      setTimeout(() => {
        this.showuserdashboard(1,'2');
        this.getWorkstreamLists();
        this.getManagersList();
        this.threadheaderexport();
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
          this.workstreamArrayval=[];
          this.workstreamValpush=[];
          this.workstreamValpushFlag = false;
          this.loading=false;
        }, 1000);
      }, 100);
     }
     else{
      modalMsgRef.dismiss('Cross click');
      this.showuserdashboard(1,'2');
      this.workstreamArrayval=[];
      this.workstreamValpush=[];
      this.workstreamValpushFlag = false;
      this.loading=false;
     }
    }
    else{
      modalMsgRef.dismiss('Cross click');
      this.showuserdashboard(1,'2');
      this.workstreamArrayval=[];
      this.workstreamValpush=[];
      this.workstreamValpushFlag = false;
      this.loading=false;
    }
  }, 2000);

  }
  else
{
this.loading=false;
this.updateuservalidationmsg=response.message;
this.newformDisable=false;

}
});



  console.log(JSON.stringify(this.workstreamValpush));
}
checkemailvalidationnew($event)
{

  var searchres=$event.target.value;
  var re = /.com/gi;
//var str = "Apples are round, and apples are juicy.";
if (searchres.search(re) == -1 ) {
   console.log("Does not contain Apples" );
} else {
   console.log("Contains Apples" );

   const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', '');
    apiFormData.append('email', searchres);

    this.userDashboardApi.Checkemailstatus(apiFormData).subscribe((response) => {


       console.log(response.status);
       if(response.status=="Success")
       {
        this.isEmailExist=false;
        if(this.TVSIBDomain){
          if(response.emailExist == '1'){
            this.assignGroup = response.groups;
            this.isEmailExist=true;
            this.assignEmailId = searchres;
            this.assignCountry = localStorage.getItem('countryName');
            this.displaydiaLogAssign = true;
            this.displaydiaLogAssignFlag = true;
          }
          else{
            this.displaydiaLogAssignFlag = false;
          }
        }
        else{
          this.displaydiaLogAssignFlag = false;
        }
       }
       else
 {
  this.displaydiaLogAssignFlag = false;
  //this.isEmailExist=true;


 }
     });

}



}
onSubmitedituserForm(userId,type='')
{

  this.bodyElem = document.getElementsByTagName('body')[0];
  this.bodyElem.classList.add(this.bodyClass);
  this.modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);

  this.updateuservalidationmsg='';
  this.loading=true;



  if(type == 'restore'){
    userId = userId.LoginID;
  }

  let edituserFormValues =this.edituserForm.value;
  let editUserEmailAddressval=edituserFormValues.editUserEmailAddress;
  let editUserBussTitleval=edituserFormValues.editUserBussTitle;
  editUserBussTitleval = editUserBussTitleval != undefined ? editUserBussTitleval : '';
  let newUserTypevar = this.newUserType;
  let editUserFirstnameval='';
  let editUserLastnameval='';
  let editDealerNameval='';
  let editDealerCodeval='';
  let editTerritoryval='';
  let editAreaval='';
  let editZoneval='';
  let editcontactPersonNameval='';
  let editcontactPersonPhoneval='';
  let editcontactPersonEmailval='';
  let editUserId=userId;

  if(this.addUserType2){
    editDealerNameval=edituserFormValues.editDealerName;
    editDealerCodeval=edituserFormValues.editDealerCode;
    if(this.TVSDomain){
      editTerritoryval=edituserFormValues.editUserTerritory;
      editZoneval=edituserFormValues.editUserZone;
      editAreaval=edituserFormValues.editUserArea;
    }
    if(this.TVSIBDomain){
      editcontactPersonNameval=edituserFormValues.editcontactPersonName;
      editcontactPersonPhoneval=edituserFormValues.editcontactPersonPhone;
      editcontactPersonEmailval=edituserFormValues.editcontactPersonEmail;
    }
  }
  else{
    editUserFirstnameval=edituserFormValues.editUserFirstname;
    editUserLastnameval=edituserFormValues.editUserLastname;
  }

  var apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('dealerId', editUserId);
    if(type == 'restore'){
      apiFormData.append('reStoreFlag', '1');
    }
    else{
      apiFormData.append('firstname', editUserFirstnameval);
      apiFormData.append('lastname', editUserLastnameval);
      apiFormData.append('bussTitle', editUserBussTitleval);
      apiFormData.append('emailAddress', editUserEmailAddressval);
    }
    apiFormData.append('access_type', 'desktop');
    if(this.addUserType2){
      apiFormData.append('dealerName', editDealerNameval);
      apiFormData.append('dealerCode', editDealerCodeval);
      if(this.TVSDomain){
        apiFormData.append('territory', editTerritoryval);
        apiFormData.append('area', editAreaval);
        apiFormData.append('zone', editZoneval);
        apiFormData.append('oldDealerCode', this.editDealerCodeOld);
      }
      if(this.TVSIBDomain){
        apiFormData.append('contactPersonName', editcontactPersonNameval);
        apiFormData.append('contactPersonPhone', editcontactPersonPhoneval);
        apiFormData.append('contactPersonEmail', editcontactPersonEmailval);
      }
    }
    if(this.TVSDomain || this.TVSIBDomain){
      apiFormData.append('userType', newUserTypevar);
    }
    if(this.overwritePermissionFlag){
      apiFormData.append('overwrite', '1');
    }
    else{
      if(type != 'restore'){
        apiFormData.append('overwrite', '0');
      }

    }

    // Display the key/value pairs

//new Response(apiFormData).text().then(console.log)

    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe((response) => {

      this.modalRef.dismiss('Cross click');
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove(this.bodyClass);

      console.log(response.status);
      this.overwritePermissionFlag = false;
      if(response.status=="Success" && this.addUserType1)
      {
        if(type == 'restore'){
          const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
          modalMsgRef.componentInstance.msg = "User data restored successfully";
          setTimeout(() => {
            modalMsgRef.dismiss('Cross click');




                this.showuserdashboard(this.userdashboardparam);


          }, 2000);

        }
        else{

        let rowdataonce=this.primetablerowdata;

        if(this.addUserType2){
          this.primetablerowdata.dealerName=editDealerNameval;
          this.primetablerowdata.dealerCode=editDealerCodeval;
        }
        else{
          this.primetablerowdata.FirstName=editUserFirstnameval;
          this.primetablerowdata.LastName=editUserLastnameval;
        }

        this.primetablerowdata.bussTitle=editUserBussTitleval;
        this.primetablerowdata.EmailAddress=editUserEmailAddressval;
        //rowdataonce.FirstName='';
       // this.displaydiaLog = false;
      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'User data updated successfully';
      setTimeout(() => {
        this.loading=false;
        this.cancelEdituserpopup();
        modalMsgRef.dismiss('Cross click');
       //this.showuserdashboard(1);


      }, 2000);
    }

      }
      else if(response.status=="Success" && this.addUserType2)
      {
        if(response.successCode == '0'){

            // console.log(response);
             this.loading=false;
             this.updateuservalidationmsg=response.result;

        }
        else if(response.successCode == '2'){
          this.loading=false;
          this.alreadyExistFlag = true;
        }
        else{

        let rowdataonce=this.primetablerowdata;

        if(this.addUserType2){
          this.primetablerowdata.dealerName=editDealerNameval;
          this.primetablerowdata.dealerCode=editDealerCodeval;
          if(this.TVSDomain){
            var zoneVal = editZoneval.toUpperCase();
            this.primetablerowdata.territory=editTerritoryval;
            this.primetablerowdata.userarea=editAreaval;
            this.primetablerowdata.zone=zoneVal;
          }
          if(this.TVSIBDomain){
            this.primetablerowdata.contactPersonName=editcontactPersonNameval;
            this.primetablerowdata.contactPersonPhone=editcontactPersonPhoneval;
            this.primetablerowdata.contactPersonEmail=editcontactPersonEmailval;
          }
        }
        else{
          this.primetablerowdata.FirstName=editUserFirstnameval;
          this.primetablerowdata.LastName=editUserLastnameval;
        }

        this.primetablerowdata.bussTitle=editUserBussTitleval;
        this.primetablerowdata.EmailAddress=editUserEmailAddressval;

        //rowdataonce.FirstName='';
       // this.displaydiaLog = false;

      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'User data updated successfully';
      setTimeout(() => {
        this.loading=false;
        this.cancelEdituserpopup();
        modalMsgRef.dismiss('Cross click');
       //this.showuserdashboard(1);


      }, 2000);

    }

      }
      else
{
 // console.log(response);
  this.loading=false;
  this.updateuservalidationmsg=response.result;
}
    });


  //console.log(edituserFormValues);
}
overwriteYes(userId){
  this.overwritePermissionFlag = true;
  this.alreadyExistFlag = false;
  this.onSubmitedituserForm(userId);
}
overwriteNo(){
  this.overwritePermissionFlag = false;
  this.alreadyExistFlag = false;
}
loadedituserForm(){
  if(this.addUserType1){
      this.edituserForm= this.userForm.group(
        {
          editUserEmailAddress:['',[Validators.required,Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
          editUserFirstname:['',Validators.required],
          editUserLastname:['',Validators.required],
          editUserBussTitle:[''],
        }
      );
  }
  else{
    if(this.TVSDomain){
      this.edituserForm= this.userForm.group({
        editUserEmailAddress:['',[Validators.required,Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        editUserBussTitle:[''],
        editDealerName:['',Validators.required],
        editDealerCode:['',Validators.required],
        editUserTerritory:[''],
        editUserArea:[''],
        editUserZone:[''],
      });
    }
    else if(this.TVSIBDomain){
      this.edituserForm= this.userForm.group({
        editUserEmailAddress:['',[Validators.required,Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        editUserBussTitle:[''],
        editDealerName:['',Validators.required],
        editDealerCode:['',Validators.required],
        editcontactPersonName:[''],
        editcontactPersonPhone:['',Validators.pattern('[- +()0-9]+')],
        editcontactPersonEmail:['',[Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      });
    }
  }
}
loadnewuserForm(){
  if(this.addUserType1){
    if(this.TVSIBDomain){
      this.newuserForm =  this.userForm.group({
        newUserType:[this.newUserType,[Validators.required]],
        newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        newUserFirstname:['',Validators.required],
        newUserLastname:['',Validators.required],
        newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
        newUserBussTitle:[''],
        newUserAccountType:[''],
        //newUserCountry:['',Validators.required],
        newUserNoManager:[''],
        newUserManager:[''],
        newUserworkstream:['',Validators.required],
      });
    }
    else{
      this.newuserForm =  this.userForm.group({
        newUserType:[this.newUserType,[Validators.required]],
        newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        newUserFirstname:['',Validators.required],
        newUserLastname:['',Validators.required],
        newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
        newUserBussTitle:[''],
        newUserAccountType:[''],
        newUserNoManager:[''],
        newUserManager:[''],
        newUserworkstream:['',Validators.required],
      });
    }
  }
  else{
    if(this.TVSDomain){
      this.newuserForm =  this.userForm.group({
        newUserType:[this.newUserType,[Validators.required]],
        newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
        newUserDealerName:['',[Validators.required]],
        newUserDealerCode:['',[Validators.required]],
        newUserCity:[''],
        newUserState:[''],
        newUserTerritory:[''],
        newUserZone:[''],
        newUserArea:[''],
        newUserAddress1:[''],
        newUserAddress2:[''],
        newUserworkstream:['',Validators.required],
      });
    }
    else{
      this.newuserForm =  this.userForm.group({
        newUserType:[this.newUserType,[Validators.required]],
        newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
        newUserDealerName:['',[Validators.required]],
        newUserDealerCode:['',[Validators.required]],
        newUserCity:[''],
        newUserState:[''],
        newUserAddress1:[''],
        contactPersonName:[''],
        contactPersonPhone:['',Validators.pattern('[- +()0-9]+')],
        contactPersonEmail:['',[Validators.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        newUserAddress2:[''],
        newUserworkstream:['',Validators.required],
       // newUserCountry:['',Validators.required],
      });
    }

}
setTimeout(() => {
  if(this.newUserType == ''){
    this.newUserTypeFlagDefault = false;
    this.newuserForm.disable();
    this.newuserForm.get('newUserType').enable();
  }
  else{
    this.newuserForm.enable();
    if(this.TVSIBDomain && this.addUserType1){
      //this.newuserForm.get('newUserCountry').disable();
    }
    if(this.TVSIBDomain && this.addUserType2){
      this.isEnableCountry = false;
      //this.isDisableWorkstream = true;
    }
  }
}, 1000);
}
onChangeworkstreams(event,wid,userparam)
{
 // console.log('event :' + event);
    //console.log(event.value+'--'+wid+'--'+userparam);



  //moment.tz.guess();
  let wsselectedvalue="0";
  if(event.value=='Admin')
  {
    wsselectedvalue="1";
  }
  if(event.value=='Member')
  {
    wsselectedvalue="2";
  }
  if(event.value=='Select')
  {
    wsselectedvalue="0";
  }

  //console.log('event :' + event);
 // console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
/*
this.reguser_array.push({
  "userID":userparam,
  "IsVerified":wsselectedvalue
});
*/
this.workstreamuser_array.push({
  "param":wid,
  "status":wsselectedvalue,
  "user_id":userparam,
});
console.log(this.workstreamuser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('workstreamforuser'+wid+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);

    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);



}
getManagersList()
{
  let type:any = 1;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('type', type);

  this.userDashboardApi.getmanagersListbyDomain(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    {
      let resultset=response.data;
      let total_managers=resultset.total;
      let managers_array=resultset.data;
      let rowmanger=0;
      this.userManagersList.push({label: 'Select Manager', value: ''});
      for(let managers of managers_array) {
        rowmanger=rowmanger+1;
        if(rowmanger>1)
        {
          this.userManagersList.push({label: managers.userName, value: managers.userName});
        }


      }
    }

  });

console.log('--------------------');
console.log(this.userManagersList);
}
  getWorkstreamLists(cid='') {
    if(cid == '1'){
    this.workstreamsListdropdown=[];
    //this.workstreamLists = [];
    //this.workstreamListsArr=[];

    let type:any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', type);
    apiFormData.append('fromUserDashboard', '1');
    apiFormData.append('countries', JSON.stringify(this.filteredCountryIds));

    this.userDashboardApi.getWorkstreamLists(apiFormData).subscribe((response) => {
      let resultData = response.workstreamList;
      for(let ws of resultData) {
        //this.workstreamLists.push({workstreamId: ws.id, workstreamName: ws.name});
        this.workstreamsListdropdown.push({name: ws.name, id: ws.id});
        //this.selectedworkstreamsList=this.workstreamsListdropdown[0];
        //this.cols.push({width:'180px',field: 'workstreams'+ws.id+'',header: ws.name,'dynamicheader':'workstreams',columnpclass:'normalptabletow','workstreamId':ws.id});
        //let wnamearr='"'+ws.name+'"';
        //this.workstreamListsArr.push(wnamearr);
        //this.userDashboardheadsArr.push(ws.name);
        //this.userDashboardheadsArrExport.push(ws.name);
     //this.userDashboardheadswid.push(ws.id);
        this.isDisableWorkstream = false;
      }


      //this.cols.push( { width:'50px',field: 'toolbar',header: 'Menu',columnpclass:'normalptabletow' });
     // this.frozenCols.push( { width:'150px',field: 'isactive',header: 'Status' });

      console.log(this.cols);
      //let showcolumns=this.workstreamListsArr;
      //this.dynamicColumn=showcolumns.toString();
      //this.loadDynamicColun=true;
    });
    }
    else{
      this.workstreamsListdropdown=[];
      this.workstreamLists = [];
      this.workstreamListsArr=[];

      let type:any = 1;
      const apiFormData = new FormData();
      apiFormData.append('apiKey', this.apiData['apiKey']);
      apiFormData.append('domainId', this.apiData['domainId']);
      apiFormData.append('countryId', this.apiData['countryId']);
      apiFormData.append('userId', this.apiData['userId']);
      apiFormData.append('type', type);
      apiFormData.append('fromUserDashboard', '1');

      this.userDashboardApi.getWorkstreamLists(apiFormData).subscribe((response) => {
        let resultData = response.workstreamList;
        for(let ws of resultData) {
          this.workstreamLists.push({workstreamId: ws.id, workstreamName: ws.name});
          this.workstreamsListdropdown.push({name: ws.name, id: ws.id});
          this.selectedworkstreamsList=this.workstreamsListdropdown[0];
          this.cols.push({width:'180px',field: 'workstreams'+ws.id+'',header: ws.name,'dynamicheader':'workstreams',columnpclass:'normalptabletow','workstreamId':ws.id});
          let wnamearr='"'+ws.name+'"';
          this.workstreamListsArr.push(wnamearr);
          this.userDashboardheadsArr.push(ws.name);
          this.userDashboardheadsArrExport.push(ws.name);
          this.userDashboardheadswid.push(ws.id);

        }


        this.cols.push( { width:'50px',field: 'toolbar',header: 'Menu',columnpclass:'normalptabletow' });
       // this.frozenCols.push( { width:'150px',field: 'isactive',header: 'Status' });

        console.log(this.cols);
        let showcolumns=this.workstreamListsArr;
        this.dynamicColumn=showcolumns.toString();
        this.loadDynamicColun=true;
      });
    }

  }

   // Resize Widow
   @HostListener("window:resize", ["$event"])
   onResize(event) {
     setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
      let heigtVal1 = (window.innerHeight - 200) - (headerHeight);
      let heigtVal2 = (window.innerHeight - 200) - (headerHeight) + 123;
      this.pTableHeight = heigtVal1+'px';
      this.divHeight = heigtVal2+'px';
      this.pTableHeightVal = (window.innerHeight - 110) - (headerHeight-10);

    }, 100);
  }

  @HostListener('scroll', ['$event'])
    scrollHandler(event) {
      console.debug("Scroll Event");
    }

    @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
     // console.log(event);

      // ESC key
      if (event.key == 'Escape') {
        this.updateuserScollPopup();

        // your logic;
      }
  }

  //@HostListener('scroll', ['$event'])
  lazyLoad(event: LazyLoadEvent) {

    console.log(11);
    console.log('1223');
    this.getuserDashboard();


  }
  showuserdashboard(param,orderby='',usersortField='',usersortOrder=0)
  {

    this.usersList=[];

  if(this.dt)
  {
   // this.dt.reset();
  }

    if(param==1)
    {
      $('.total_active_userdash').addClass('countcoloractive');
      $('.total_iactive_userdash').removeClass('countcoloractive');
      $('.total_waitingfor_userdash').removeClass('countcoloractive');
      this.watitingforapprovalVisible=false;
      let elss=document.getElementsByClassName('tab-1');
      let el = this.elRef.nativeElement.querySelector(".tab-1");
      let el2 = this.elRef.nativeElement.querySelector(".tab-2");
      let el3 = this.elRef.nativeElement.querySelector(".tab-3");
      if(el)

      {

        this.renderer.addClass(el, 'active');

      }
      if(el2)
      {
        this.renderer.removeClass(el2, 'active');

      }
      if(el3)
      {
        this.renderer.removeClass(el3, 'active');

      }



      //this.renderer.remove('tab');;
      //this.renderer.setStyle(elss, 'color', '#FFFFFF');
    }
    if(param==3)
    {
      $('.total_active_userdash').removeClass('countcoloractive');
        $('.total_iactive_userdash').addClass('countcoloractive');
        $('.total_waitingfor_userdash').removeClass('countcoloractive');
      this.watitingforapprovalVisible=false;
      let elss=document.getElementsByClassName('tab-1');
      let el = this.elRef.nativeElement.querySelector(".tab-1");
      let el2 = this.elRef.nativeElement.querySelector(".tab-2");
      let el3 = this.elRef.nativeElement.querySelector(".tab-3");
      if(el)
      {
        this.renderer.removeClass(el, 'active');
      }
      if(el2)
      {
        this.renderer.addClass(el2, 'active');
      }
      if(el3)
      {
        this.renderer.removeClass(el3, 'active');
      }


      //this.renderer.remove('tab');;
      //this.renderer.setStyle(elss, 'color', '#FFFFFF');
    }
    if(param==4)
    {
      $('.total_active_userdash').removeClass('countcoloractive');
      $('.total_iactive_userdash').removeClass('countcoloractive');
      $('.total_waitingfor_userdash').addClass('countcoloractive');
      this.watitingforapprovalVisible=true;
      let elss=document.getElementsByClassName('tab-1');
      let el = this.elRef.nativeElement.querySelector(".tab-1");
      let el2 = this.elRef.nativeElement.querySelector(".tab-2");
      let el3 = this.elRef.nativeElement.querySelector(".tab-3");
      if(el)
      {
        this.renderer.removeClass(el, 'active');
      }
      if(el2)
      {
        this.renderer.removeClass(el2, 'active');
      }
      if(el3)
      {
        this.renderer.addClass(el3, 'active');
      }



      //this.renderer.remove('tab');;
      //this.renderer.setStyle(elss, 'color', '#FFFFFF');
    }
  this.userdashboardparam=param;
    this.loading=true;
    this.itemLimit=30;
    this.itemOffset=0;
    this.usersList=[];
    let orderbyparam='';
    if(orderby)
    {
  orderbyparam=orderby;
    }
    console.log('1223');
    this.getuserDashboard(param,orderbyparam,this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
  }
  onCancelaction()
  {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'userdashboard discard';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss('Cross click');
      if(!recivedService) {
        return;
      } else {
       this.publishbutton=false;
       this.showuserdashboard(this.userdashboardparam);
      }
    });
}


onPublishaction()
{



  //this.elRef.nativeElement.classList.remove('selectedItemp-table');
  //this.renderer.removeClass(this.tdptabletdata.nativeElement, 'oneclassstep');
  //const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
  this.loading=true;

  this.publishbutton=false;
  let workstreamuser_arrayjson='';
  let updatereg='';
  if(this.workstreamuser_array.length>0)
  {
    workstreamuser_arrayjson= JSON.stringify(this.workstreamuser_array);
  }
  if(this.reguser_array.length>0)
  {
  updatereg= JSON.stringify(this.reguser_array);
  }

  if(this.reguser_array.length>0)
  {
    let activeCountText = '';
    let inactiveCountText = '';

    for(let rg of this.reguser_array){
      if(this.selectedHeaderTypeUsersId != '3' && rg.IsAccountActive == '0'){
        let userIndex = this.usersList.findIndex(option => option['LoginID'] == rg.userID );
        this.usersList.splice(userIndex, 1);

        console.log(this.totalRecordsActive);

        this.totalRecordsActive = (parseInt(this.totalRecordsActive) - 1).toString();;
        activeCountText = "("+this.totalRecordsActive+")";

        console.log(this.totalRecordsActive);
        console.log(this.totalRecordsInActive);

        this.totalRecordsInActive = (parseInt(this.totalRecordsInActive) + 1).toString();;
        inactiveCountText = "("+this.totalRecordsInActive+")";

        console.log(this.totalRecordsActive);

        let waitingforCountText = "("+this.totalRecordsWaitingFor+")";
        let deletedUsersCountText;
        let invitedUsersCountText;
        if(this.collabticDomain){
           deletedUsersCountText = "("+this.totalRecordsDeletedUsers+")";
           invitedUsersCountText = "("+this.totalCountInvitedUsers+")";
        }

        if(this.collabticDomain){
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

        }
       else  if(this.domainId=='82'){
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

        }
        else{
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];

        }

      }
      if(this.selectedHeaderTypeUsersId != '1' && rg.IsAccountActive == '1'){
        let userIndex = this.usersList.findIndex(option => option['LoginID'] == rg.userID );
        this.usersList.splice(userIndex, 1);

        this.totalRecordsActive = (parseInt(this.totalRecordsActive) + 1).toString();
        activeCountText = "("+this.totalRecordsActive+")";

        this.totalRecordsInActive = (parseInt(this.totalRecordsInActive) - 1).toString();
        inactiveCountText = "("+this.totalRecordsInActive+")";

        let waitingforCountText = "("+this.totalRecordsWaitingFor+")";
        let deletedUsersCountText;
        let invitedUsersCountText;
        if(this.collabticDomain){
           deletedUsersCountText = "("+this.totalRecordsDeletedUsers+")";
           invitedUsersCountText = "("+this.totalCountInvitedUsers+")";
        }

        if(this.collabticDomain){
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

        }
        else  if(this.domainId=='82'){
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

        }
        else{
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];

        }
      }
      if(rg.IsAccountActive == '0' || rg.IsAccountActive == '1'){
      switch(this.selectedHeaderTypeUsersId){
        case '1':
          this.selectedHeaderTypeUsers = {
            label: 'Active users '+activeCountText,
            value: this.selectedHeaderTypeUsersId,
          };
          break;
        case '3':
          this.selectedHeaderTypeUsers = {
            label: 'Inactive users '+inactiveCountText,
            value: this.selectedHeaderTypeUsersId,
          };
          break;
      }
    }

    }


  }

   /*
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'isActive': 1,
    'searchKey': this.searchVal,
    'limit': this.itemLimit,
    'offset': this.itemOffset
  }
  */
  //this.apiData = apiInfo;
  let type:any = 1;
  let countryId = localStorage.getItem('countryId');
  console.log(countryId);
  const apiFormData = new FormData();
  apiFormData.append('api_key', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('params', updatereg);
  apiFormData.append('paramArray', workstreamuser_arrayjson);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit',  this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);

  this.userDashboardApi.updateuserdashstatus(apiFormData).subscribe((response) => {
    if(response.status=="Success")



    {
      this.reguser_array=[];
      this.workstreamuser_array=[];

      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'User data successfully updated';
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');
        if(this.refreshOption)
        {
          this.publishbutton=false;
          this.refreshOption=false;
          this.getManagersList();
            this.showuserdashboard(this.userdashboardparam);
            //this.loading=true;

        }
        else

        {
          $( "td" ).removeClass( "selectedItemp-table" );
          $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor" );

          if(this.selectedHeaderTypeUsersId == '3' && this.totalRecordsInActive == '0'){

            this.showuserdashboard(this.selectedHeaderTypeUsersId);
          }
          if(this.selectedHeaderTypeUsersId == '1' && this.totalRecordsActive == '0'){

            this.showuserdashboard(this.selectedHeaderTypeUsersId);
          }

         this.loading=false;
        }


      }, 2000);

    }


});



}

updateuserScollPopup()
{
  this.displayPosition=false;
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'userScollOption': 1,

  }
  this.apiData = apiInfo;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userScollOption', this.apiData['userScollOption']);
  this.userDashboardApi.UpdateUserScrollPopup(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    {

    }
  });

}
  getuserDashboard(userparamData='',orderbyparam='',gusersortField='',gusersortOrder=0,dataFilterEvent='',fromInvite='')
{
  setTimeout(() => {

    if(fromInvite=='1')
    {
      this.itemOffset=0;
      this.usersList=[];
    }
  if(dataFilterEvent)
  {
    dataFilterEvent=JSON.stringify(dataFilterEvent);
    if(this.isFilterApplied || this.itemOffset==0)
    {
      this.itemOffset=0;
      this.usersList=[];
    }
    this.isFilterApplied=false;
  }
  if(userparamData=='')
  {
    this.userparamDataValue=1;
  }
  else
  {
    this.userparamDataValue=userparamData;
  }
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'isActive': 1,
    'searchKey': this.searchVal,
    'limit': this.itemLimit,
    'offset': this.itemOffset
  }
  this.apiData = apiInfo;
  let type:any = 1;
  let sortorderint:any=gusersortOrder;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('param', this.userparamDataValue);
  apiFormData.append('searchtext', this.apiData['searchKey']);

  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit',  this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);
  apiFormData.append('orderby', orderbyparam);
  apiFormData.append('sortOrderField', gusersortField);
  apiFormData.append('sortOrderBy', sortorderint);
  apiFormData.append('filterOptions', dataFilterEvent);

  if(this.TVSDomain || this.TVSIBDomain){
    apiFormData.append('userType', this.selectedHeaderTypeId);
  }

  this.userDashboardApi.getuserlist(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    {
      this.loadDataEvent=false;
      this.noUserListFound=false;
      this.noUserList= "0";
      //console.log(response.status);
      let getuserdetailvar=response.data;
      let userScollOption=response.userScollOption;
      let total_count=getuserdetailvar.total;
      if(userScollOption==0)
      {
        this.notifyPopupScreen('center');
      }


      let total_count_active=getuserdetailvar.totalActive;
      let total_count_inactive=getuserdetailvar.totalInActive;
      let total_count_waitingfor=getuserdetailvar.totalWaitingFor;
      let total_count_deletedusers;
      let total_count_invitedUsers;
      if(this.collabticDomain || this.domainId=='82'){
        total_count_deletedusers=getuserdetailvar.totalDeleted != undefined? getuserdetailvar.totalDeleted : '0';
        total_count_invitedUsers=getuserdetailvar.totalInvited != undefined? getuserdetailvar.totalInvited : '0';
      }
      let resultData=response.data.user_details;
      console.log(resultData);
      this.showuserdashboarddata=true;
      if (total_count == 0) {
        this.loading=false;
        if(this.apiData['offset']==0)
        {
          this.noUserListFound=true;
          this.noUserList = this.apiData['searchKey'] == '' ? "0" : "1";

          //if(total_count_active)
          //{
            this.totalRecordsActive=total_count_active;
            let activeCountText = "("+this.totalRecordsActive+")";
          //}
          //if(total_count_inactive)
          //{
            this.totalRecordsInActive=total_count_inactive;
            let inactiveCountText = "("+this.totalRecordsInActive+")";
          //}
          //if(total_count_waitingfor)
          //{
            this.totalRecordsWaitingFor=total_count_waitingfor;
            let waitingforCountText = "("+this.totalRecordsWaitingFor+")";
         // }

         let deletedUsersCountText;
         let invitedUsersCountText;
         if(this.collabticDomain || this.domainId=='82'){
            this.totalRecordsDeletedUsers=total_count_deletedusers;
            this.totalCountInvitedUsers=total_count_invitedUsers;
            deletedUsersCountText = "("+this.totalRecordsDeletedUsers+")";
            invitedUsersCountText = "("+this.totalCountInvitedUsers+")";
         }

         if(this.collabticDomain){
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

         }
         else  if(this.domainId=='82'){
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

        }
         else{
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];

         }

        }

        this.ItemEmpty = true;
        this.headercheckDisplay = 'checkbox-hide';
        if(this.apiData['searchKey'] != '') {
          this.getuserDetails = [];
          this.ItemEmpty = false;
          this.displayNoRecords = true;
          //this.userListSource = new MatTableDataSource(this.usersList);
          //setTimeout(() => {
           // this.userListSource.sort = this.sort;
          //}, 1000);
        }

      }
      else
      {

        this.scrollCallback = true;
        this.scrollInit = 1;

        this.ItemEmpty = false;
        this.itemTotal = total_count;
        this.totalRecords = total_count;
        if(this.apiData['offset']==0)
        {

        //  this.totalRecordsActive=total_count_active;

          //if(total_count_active)
          //{
            this.totalRecordsActive=total_count_active;
            let activeCountText = "("+this.totalRecordsActive+")";
          //}
          //if(total_count_inactive)
          //{
            this.totalRecordsInActive=total_count_inactive;
            let inactiveCountText = "("+this.totalRecordsInActive+")";
          //}
          //if(total_count_waitingfor)
          //{
            this.totalRecordsWaitingFor=total_count_waitingfor;
            let waitingforCountText = "("+this.totalRecordsWaitingFor+")";
          //}
          let deletedUsersCountText;
          let invitedUsersCountText;
          if(this.collabticDomain || this.domainId=='82')
            {
              this.totalRecordsDeletedUsers=total_count_deletedusers;
              this.totalCountInvitedUsers=total_count_invitedUsers;
              deletedUsersCountText = "("+this.totalRecordsDeletedUsers+")";
              invitedUsersCountText = "("+this.totalCountInvitedUsers+")";
            }

          if(this.collabticDomain){
            this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

          }
          else  if(this.domainId=='82'){
            this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }, {label: 'Deleted Users '+deletedUsersCountText, value: '5' }, {label: 'Invited Users '+invitedUsersCountText, value: '6' }];

          }
          else{
            this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];

          }


          switch(this.userparamDataValue){
            case '1':
              this.selectedHeaderTypeUsers = {
                label: 'Active users '+activeCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
            case '3':
              this.selectedHeaderTypeUsers = {
                label: 'Inactive users '+inactiveCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
            case '4':
              this.selectedHeaderTypeUsers = {
                label: 'Waiting for approval '+waitingforCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
            case '5':
              this.selectedHeaderTypeUsers = {
                label: 'Deleted Users '+deletedUsersCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
              case '6':
                this.selectedHeaderTypeUsers = {
                  label: 'Invited Users '+invitedUsersCountText,
                  value: this.userparamDataValue,
                };
                this.selectedHeaderTypeUsersId = this.userparamDataValue;
                break;
            default:
              this.selectedHeaderTypeUsers = {
                label: 'Active users '+activeCountText,
                value: '1',
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
            break;
          }
        }

        //this.primengConfig.ripple = true;
        //console.log(this.matrixSelectionList.length)
        if(this.matrixSelectionList.length > 0) {
          this.headerCheck = 'checked';
        }
        let loadItems = false;

        for (let i in resultData) {
          {

            for ( const [key,value] of Object.entries( resultData[i] ) ) {

             // resultData[i].key=value;

            }
            if(resultData[i].last_updated_on)
            {
              resultData[i].last_updated_on= moment(moment.utc(resultData[i].lastUpdatedOn).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].last_updated_on='';
            }

            if(resultData[i].DATE_OF_BIRTH)
            {
              resultData[i].DATE_OF_BIRTH= moment(moment.utc(resultData[i].DATE_OF_BIRTH).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].DATE_OF_BIRTH='';
            }

            if(resultData[i].JOIN_DATE)
            {
              resultData[i].JOIN_DATE= moment(moment.utc(resultData[i].JOIN_DATE).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].JOIN_DATE='';
            }

            if(resultData[i].LEAVE_DATE)
            {
              resultData[i].LEAVE_DATE= moment(moment.utc(resultData[i].LEAVE_DATE).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].LEAVE_DATE='';
            }

            if(resultData[i].CREATED_ON)
            {
              resultData[i].CREATED_ON= moment(moment.utc(resultData[i].CREATED_ON).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].CREATED_ON='';
            }

            if(resultData[i].MODIFIED_ON)
            {
              resultData[i].MODIFIED_ON= moment(moment.utc(resultData[i].MODIFIED_ON).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].MODIFIED_ON='';
            }

            if(resultData[i].DL_EXPIRY_DATE)
            {
              resultData[i].DL_EXPIRY_DATE= moment(moment.utc(resultData[i].DL_EXPIRY_DATE).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].DL_EXPIRY_DATE='';
            }


           // let lastUpdatedOn = moment.utc(resultData[i].lastUpdatedOn).toDate();

            resultData[i].created_on= moment(moment.utc(resultData[i].createdOn).toDate()).local().format('MMM DD, YYYY');


            this.usersList.push(resultData[i]);
            //this.datasource.push(resultData[i]);
            //this.usersList.push(mapusersListData(resultData[i]));
            if ((parseInt(i) + 1) + '==' + resultData.length) {
              loadItems = true;
            }
          }
         // console.log(this.usersList+'----');


        }
      this.loading=false;

      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;

      if(loadItems){
        setTimeout(() => {
          if(this.itemOffset == 0){
            this.usersList=[];
          }
            let listItemHeight =
              document.getElementsByClassName("user-dashboard-p-table")[0]
                .clientHeight + 5;
            console.log("Window Height: " + this.pTableHeightVal);
            console.log("List Height" + listItemHeight);
            if (this.pTableHeightVal >= listItemHeight ) {
              //this.makeRowsSameHeight();
              //this.loading=true;
              this.loadDataEvent=true;
            //  this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
            }
        }, 650);
    }

    }



  }
  else
{
  this.loadDataEvent=false;
  this.loading=false;
  if(this.apiData['offset']==0)
  {
    this.noUserListFound=true;
    this.noUserList = this.apiData['searchKey'] == '' ? "0" : "1";
  }


}
  });

}, 100);

}

showprofilePage(userProfile)
{

  let url = forumPageAccess.profilePage+userProfile;
  window.open(url, '_blank');
}
applySearch(val) {

  this.searchVal = val;
  this.apiData['searchKey'] = this.searchVal;
  this.itemLimit = 30;
  this.itemOffset = 0;
  this.itemLength = 0;
  this.itemTotal = 0;
  this.scrollInit = 0;
  this.lastScrollTop = 0;
  this.scrollCallback = true;
  this.loading = true;
  this.displayNoRecords = false;
  this.matrixActionFlag = false;
  this.usersList = [];
  this.headerData['searchKey'] = this.searchVal;
  this.headerFlag = true;
  this.headerCheck = 'unchecked';
  this.headercheckDisplay = 'checkbox-hide';
 // this.matrixChangeSelection('empty');
 //console.log('1223');
 this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
}

// check strong password
checkPwdStrongValidation(type){
  if(this.passwordchecker){
    let pwdVal;
    if(type == 'reset'){
      pwdVal = this.resetpasswordForm.value.Resetpasswordcontent.trim();
    }
    else{
      pwdVal = this.newuserForm.value.newUserTmpPassword.trim();
    }

    let validateMsg = this.authenticationService.checkPwdStrongLength(pwdVal,this.passwordLen);
    if(pwdVal.length>0){
      if(validateMsg==''){
        this.passwordValidationError = false;
        this.disableDefaultPasswordText = true;
        this.successPasswordTextIcon = true;
        this.passwordValidationErrorMsg = '';
      }
      else{
        this.passwordValidationError = true;
        this.disableDefaultPasswordText = false;
        this.successPasswordTextIcon = false;
        this.passwordValidationErrorMsg = validateMsg;
      }
    }
    else{
      this.passwordValidationError = false;
      this.disableDefaultPasswordText = false;
      this.successPasswordTextIcon = false;
      this.passwordValidationErrorMsg = '';
    }
  }
}


// load dealer code metrics
loadDealerUsageMetrics(){
  const apiFormData = new FormData();
	  apiFormData.append('api_key', this.apiData['apiKey']);
  apiFormData.append('domain_id', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('user_id', this.apiData['userId']);
    this.escalationApi.getUsagemetricsfiltercontent(apiFormData).subscribe(res => {
      if(res.status=='Success'){
        // city
        let city_array=res.data[0].cityContent;
        let rowcity=0;
        this.cityContentList = [];
        this.cityContentList.push({label: 'Select City', value: ''});
        for(let cityval of city_array) {
          rowcity=rowcity+1;
          if(rowcity>1)
          {
            this.cityContentList.push({label: cityval, value: cityval});
          }
        }
        // territory
        let territory_array=res.data[0].territoryContent;
        let rowterritory=0;
        this.territoryContentList = [];
        this.territoryContentList.push({label: 'Select Territory', value: ''});
        for(let territoryval of territory_array) {
          rowterritory=rowterritory+1;
          if(rowterritory>1)
          {
            this.territoryContentList.push({label: territoryval, value: territoryval});
          }
        }
        // zone
        let zone_array=res.data[0].zoneContent;
        let rowzone=0;
        this.zoneContentList = [];
        this.zoneContentList.push({label: 'Select Zone', value: ''});
        for(let zoneval of zone_array) {
          rowzone=rowzone+1;
          if(rowzone>1)
          {
            this.zoneContentList.push({label: zoneval, value: zoneval});
          }
        }
        // area
        let area_array=res.data[0].areaContent;
        let rowarea=0;
        this.areaContentList = [];
        this.areaContentList.push({label: 'Select Area', value: ''});
        for(let areaval of area_array) {
          rowarea=rowarea+1;
          if(rowarea>1)
          {
            this.areaContentList.push({label: areaval, value: areaval});
          }
        }


      }
    });
  }



   // Manage List
   manageList(field) {

if(!this.isEnableCountry){
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
    };
    let access;
    let baseUrl = "";
    let inputData = { };
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      baseUrl = Constant.TechproMahleApi;
    }
    else{
      baseUrl = Constant.getCountryData;
    }
    switch (field) {
      case "country":
        access = "newthread";
        inputData = {
          actionApiName: "",
          actionQueryValues: "",
          selectionType: "multiple",
          field:'countries',
          title: "Country",
          filteredItems: this.filteredCountryIds,
          filteredLists: this.filteredCountries,
          baseApiUrl: baseUrl,
          apiUrl: baseUrl+""+Constant.getCountryData,
       };
        break;
    }

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    if(field == "country"){
      modalRef.componentInstance.inputData = inputData;
    }
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.filteredItems = this.filteredCountryIds;
    modalRef.componentInstance.filteredLists = this.filteredCountries;
    modalRef.componentInstance.filteredTags = this.filteredCountryIds;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight + 10;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      let items = receivedService;
      switch (field) {
        case 'country':
          this.filteredCountryIds = [];
          this.filteredCountries = [];
          for (let t in items) {
            let chkIndex = this.filteredCountryIds.findIndex(
              (option) => option == items[t].id
            );
            if (chkIndex < 0) {
              this.filteredCountryIds.push(items[t].id.toString());
              this.filteredCountries.push(items[t].name);
            }
          }
          console.log(this.filteredCountries, this.filteredCountryIds);
          break;
      }
      if(this.filteredCountryIds.length == 0){
        this.countryValpushFlag = false;
      }
      else{
        if(this.addUserType1){
          this.getWorkstreamLists('1');
          this.countryValpushFlag = true;
          let cid = localStorage.getItem("countryId");
          if(cid == '' && this.roleId == '10'){
            //this.isDisableWorkstream = true;
            this.workstreamArrayval=[];
            this.workstreamValpush=[];
            this.workstreamValpushFlag = false;
          }
          else{
            if(this.filteredCountryIds.length == 1){
              if(this.filteredCountryIds[0] == cid){
                //this.isDisableWorkstream = false;
                this.workstreamValpushFlag = true;
              }
              else{
                //this.isDisableWorkstream = true;
                this.workstreamArrayval=[];
                this.workstreamValpush=[];
                this.workstreamValpushFlag = false;
              }
            }
            else{
              //this.isDisableWorkstream = true;
              this.workstreamArrayval=[];
              this.workstreamValpush=[];
              this.workstreamValpushFlag = false;
            }
          }
        }
        else{
          this.getWorkstreamLists('1')
        }
      }
    });
  }
   }
  // Disable disableCountrySelection
  disableCountrySelection(index) {
    if(this.newuserForm.value.newUserAccountType == 10){}
    else{
      this.filteredCountryIds.splice(index, 1);
      this.filteredCountries.splice(index, 1);
    }
  }

  inviteUserDialog(){
   const modalRef = this.modalService.open(WelcomeHomeComponent, {backdrop: 'static', keyboard: true, centered: true});
      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
      }
      this.apiData = apiInfo;
      modalRef.componentInstance.data = this.apiData;
      modalRef.componentInstance.inviteUser = true;
      modalRef.componentInstance.startedNextResponce.subscribe((receivedService) => {
        if (receivedService) {
          console.log(receivedService)
          modalRef.dismiss('Cross click');
          this.inviteSuccessFlag = true;

          let arr1 = [];
          let arr2 = [];

          arr1 = receivedService.newUsers;
          arr2 = receivedService.existUsers;

          this.inviteUserCount = arr1?.length;
          this.existUserCount = arr2?.length;

          this.inviteUserText = this.inviteUserCount == 1 ? 'user' : 'users';
          this.existUserText = this.existUserCount == 1 ? 'user' : 'users';

          if(this.existUserCount>0){
            for(let w1=0;w1<arr2.length;w1++)
            {
              this.existUserArr.push(" "+arr2[w1]);
            }
          }

          //this.existUserArr = arr2;

          //const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
          //modalMsgRef.componentInstance.msg = 'User(s) invited Successfully';
          this.userdashboardparam='6';
          this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent,'1');
          //setTimeout(() => {
            //modalMsgRef.dismiss('Cross click');
          //}, 1000);
        }
        else{
          modalRef.dismiss('Cross click');
        }
      });
    }
    closeInviteSuccess(){
      this.inviteSuccessFlag = false;
      this.inviteUserCount = 0;
      this.existUserCount = 0;
      this.existUserArr = [];
    }

}



export interface UserListData {
  //[key: string]: Object[]

}



