import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { DekraAuditListComponent } from 'src/app/components/common/dekra-audit-list/dekra-audit-list.component';
import { Constant } from 'src/app/common/constant/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-audit-inspection',
  templateUrl: './audit-inspection.component.html',
  styleUrls: ['./audit-inspection.component.scss']
})
export class AuditInspectionComponent implements OnInit {
  dekraauditPageRef: DekraAuditListComponent;
  regionName: string = "";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2: string = "profile";
  public bodyClass3: string = "image-cropper";
  public bodyClass4: string = "system-settings";
  public bodyClass: string = "parts-list";
  public accessPage: string = '';
  public accessModule: string = 'dekra-audit';
  public bodyElem;
  sidebarRef: SidebarComponent;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  featuredActionName: string;
  public sidebarActiveClass: Object;
  public headTitle: string = "Headquarters";
  public headerFlag: boolean = false;
  public headerData: Object;
  public pageAccess: string = "headquarters";
  typeFilter = "";
  statusFilter = "";
  public apiKey: string = Constant.ApiKey;
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId='';
  public platformId: string;
  public apiData: Object;
  public dekraNetworkId: string = '';
  public dekraNetworkHqId: string = '';
  public itemTotal: number = 0;
  public locationToolsFlag: boolean = false;
  public setTWidth;
  statusList = [{id:'',name:'Select status'},{id:"1",name:"Draft"},{id:"2",name:"Published"}]
  public toolsListFlag: boolean = false;
  public toolsPageData: Object;

  public inspectionListFlag: boolean = false;
  public templateListFlag: boolean = false;
  public sectionListFlag: boolean = false;  
  gtsList: any[] = [];
  typesList: any = [];

   // Resize Widow
 @HostListener("window:resize", ["$event"])
 onResize(event) {
   this.bodyHeight = window.innerHeight;
   
   this.setScreenHeight();
  }

  constructor(private router: Router,private titleService: Title,
    private authenticationService: AuthenticationService,
    private activeRoute: ActivatedRoute,
    public headQuarterService: HeadquarterService,
    public modalService: NgbModal) { 
      const currentUrl = this.router.url.split('/'); 
      this.titleService.setTitle(
        localStorage.getItem("platformName") + " - Audit/Inspection"
      );
      this.accessPage = currentUrl[2];
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.regionName = event.url.split('/')[3];
      }
    })
  }
  setScreenHeight() {
    setTimeout(() => {
      var elmnt = document.getElementById("matrixTable");
      if(!elmnt){
        this.setScreenHeight();
      }else{
        let itemLimitwidth = elmnt.offsetWidth;
        this.setTWidth = itemLimitwidth - 231;
      }
    }, 1000);

    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
      searchVal: "",
    };
  }
  scroll = (event: any): void => {
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass4);
    window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setTWidth = 1100;
    this.setScreenHeight();

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';

    this.toolsListFlag = true; 
    this.toolsPageData = {
      parentPage : this.accessPage,
      currentPage: 'all-list',
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey,
      roleId: this.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: '',
      shopId: '',
    }       

    this.getCommonDataList("19");
    setTimeout(() => {  
      if(this.activeRoute.snapshot.queryParams['type'] && this.activeRoute.snapshot.queryParams['type'] == "section"){
        this.dekraauditPageRef.sectionListFlag = true;
        this.dekraauditPageRef.templateListFlag = false;
        this.dekraauditPageRef.inspectionListFlag = false;
      }else if(this.activeRoute.snapshot.queryParams['type'] && this.activeRoute.snapshot.queryParams['type'] == "template"){
        this.dekraauditPageRef.sectionListFlag = false;
        this.dekraauditPageRef.templateListFlag = true;
        this.dekraauditPageRef.inspectionListFlag = false;
      }
      else if(this.activeRoute.snapshot.queryParams['type'] && this.activeRoute.snapshot.queryParams['type'] == "audit"){
        this.dekraauditPageRef.sectionListFlag = false;
        this.dekraauditPageRef.templateListFlag = false;
        this.dekraauditPageRef.inspectionListFlag = true;
      }
      else{
        this.dekraauditPageRef.sectionListFlag = false;      
        this.dekraauditPageRef.templateListFlag = false;      
        this.dekraauditPageRef.inspectionListFlag = true; 
      }
      this.dekraauditPageRef.itemOffset = 0;
      this.templateListFlag = this.dekraauditPageRef.templateListFlag;
      this.sectionListFlag = this.dekraauditPageRef.sectionListFlag;     
      this.inspectionListFlag = this.dekraauditPageRef.inspectionListFlag;      
      this.dekraauditPageRef.getList();             
    }, 100);
    
  }

  ngOnDestroy() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass4);
  }

  filterData(){
    this.dekraauditPageRef.filterList(true,this.statusFilter,this.typeFilter)
  }

  getCommonDataList(type:string){
    const apiFormData = new FormData();
    apiFormData.append("type", type);
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getCommonList(apiFormData).subscribe((response: any) => {
      if(type == "19"){
        
        this.typesList = [{id:'',name:'Select type'},...response.items];
      }
      
    });
  }

  menuNav(item) {
    console.log(item)
    console.log(this.sidebarRef)
    let section = item.slug;
    this.headTitle = item.name;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
    switch (section) {
      case 'home':
        this.router.navigate(["/headquarters/home"]);
        return false;
      break;
      case 'headquarters':
        this.router.navigate(["/headquarters/network"]);
        return false;
      break;
      case 'tools':
        this.router.navigate(["/headquarters/tools-equipment"]);
        return false;
      break;
      case 'facility-layout':
        this.router.navigate(["/headquarters/facility-layout"]);
        return false;
      break;
      case 'all-users':
        this.router.navigate(["/headquarters/all-users"]);
        return false;
      break;
      case 'all-networks':
        this.router.navigate(["/headquarters/all-networks"]);
        return false;
      break;
      default:        
      break;
    } 
     
  }

  dekraauditCallback(data){
    this.dekraauditPageRef = data;
    //this.itemTotal = this.dekraauditPageRef.itemTotal;
    //this.locationToolsFlag = this.dekraauditPageRef.locationToolsFlag;
    //console.log(this.dekraauditPageRef);
  }

  onChangeSubTab(id, flag){
  }

  onChangeTab(level1){
    switch(level1){
      case 'level1':
        this.dekraauditPageRef.sectionListFlag = true;
        this.dekraauditPageRef.templateListFlag = false;
        this.dekraauditPageRef.inspectionListFlag = false;
        this.dekraauditPageRef.pageOffset = 0;
      break;
      case 'level2':
        this.dekraauditPageRef.sectionListFlag = false;
        this.dekraauditPageRef.templateListFlag = true;
        this.dekraauditPageRef.inspectionListFlag = false;
        this.dekraauditPageRef.pageOffset = 0;

      break;
      case 'level3':
        this.dekraauditPageRef.sectionListFlag = false;
        this.dekraauditPageRef.templateListFlag = false;
        this.dekraauditPageRef.inspectionListFlag = true;
        this.dekraauditPageRef.pageOffset = 0;
      break;
    }
    this.dekraauditPageRef.sortFieldEvent = '';
    this.dekraauditPageRef.sortOrderField = 0;
    this.dekraauditPageRef.dataFilterEvent = '';
    this.dekraauditPageRef.isFilterApplied = false;
    this.templateListFlag = this.dekraauditPageRef.templateListFlag;
    this.sectionListFlag = this.dekraauditPageRef.sectionListFlag;     
    this.inspectionListFlag = this.dekraauditPageRef.inspectionListFlag;
    this.dekraauditPageRef.itemOffset = 0;
    setTimeout(() => {                
      this.dekraauditPageRef.getList();            
    }, 1);
  }

  



}
