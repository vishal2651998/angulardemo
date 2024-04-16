import { Component, EventEmitter, OnInit, Output, ViewChild, HostListener} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Constant, ContentTypeValues, FilterGroups, filterNames, filterFields, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AddLinkComponent } from '../../../../components/common/add-link/add-link.component';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {Message,MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { UserDashboardService } from 'src/app/services/user-dashboard/user-dashboard.service'; 

@Component({
  selector: 'app-directory-config',
  templateUrl: './directory-config.component.html',
  styleUrls: ['./directory-config.component.scss']
})

export class DirectoryConfigComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public headerData: Object;
  pageAccess: string = "system-settings";
  public headTitle: string = "System Settings";
  public bodyClass: string = "message";
  public apiKey: string = Constant.ApiKey;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public apiData: Object;
  public apiInfo: Object;
  public loading: boolean = true;
  public itemEmpty: boolean = false;
  public bodyHeight: number;
  public innerHeight: number;
  public bodyElem;
  public toggleBox1: boolean = false;
  public toggleBox2: boolean = false;
  public toggleBox3: boolean = false;
  public maximumDate: any = '';
  public miniumDate: any = '';
  public startDate: any = '';
  public endDate: any = ''; 
  public systemSettingsData: any;
  public menuItemsData: any;
  public systemMsg: Message[];
  public rmHeight: any = 115; 
  public expandFlag: boolean = true;
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private activteRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private userDashboardApi: UserDashboardService,
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = 'dialog-centered';
  }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) { 
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: false
      };

      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.systemSettings();

    }  

  }

  systemSettings(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);    
    apiFormData.append('settingsId', "8");    
    
            
    this.commonApi.getSystemSettings(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
         console.log(res.items);
         let itemsArr = [];
         itemsArr = res.items;
         for(let type in itemsArr){
          for(let type1 in itemsArr[type].settings){ 
            itemsArr[type].settings[type1].toggleBox = itemsArr[type].settings[type1].value == 1 ? true : false;
          }
         }
        this.systemSettingsData = itemsArr;
        this.loading = false;
      }      
      else{} 
    },
    (error => {})
    );    
  } 

  applySearch(data) {
    let val = data.searchVal;
    console.log(val);
  }

  onToggleBoxChange(settingsId,itemId,flag){
    console.log("systemSettingsTypeId="+settingsId,itemId,"systemSettingsId",flag);
    let flagValue = flag ? '1' : '0';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('countryId', this.countryId);   
    apiFormData.append('itemId', itemId);    
    apiFormData.append('systemSettingsTypeId', settingsId);    
    apiFormData.append('systemSettingsId', '8');      
    apiFormData.append('value', flagValue); 
        
    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe(res => {

      if(res.status=='Success'){
        this.systemMsg = [{severity:'success', summary:'', detail:res.result}];
        this.primengConfig.ripple = true;
        setTimeout(() => {
          this.systemMsg = [];
        }, 3000);
        console.log(res);
      }
      else{

      }
        
      },
      (error => {})
      );
  }
  
  // Set Screen Height
  setScreenHeight() {
    this.bodyHeight = window.innerHeight;
    this.innerHeight = this.bodyHeight-205;
    this.rmHeight = 115;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    this.rmHeight = this.rmHeight+headerHeight;
  }

}


