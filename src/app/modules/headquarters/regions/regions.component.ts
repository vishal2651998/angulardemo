import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AddShopPopupComponent } from '../../shop/shop/add-shop/add-shop.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit,OnChanges {
  headquartersPageRef: HeadquartersListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  sidebarRef: SidebarComponent;

  viewType = "LIST"
  selectedTab = "SUMMARY"
  listShops:boolean = false;
  public bodyClass: string = "headquarters";
  public bodyElem;
  public pageAccess: string = "headquarters";
  public sidebarActiveClass: Object;
  public headquartersFlag: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public featuredActionName: string = '';
  public innerHeight: number;
  public bodyHeight: number;
  public leftEmptyHeight: number;
  public selectedSideBar: string="SUMMARY";
  public regionName: string="";
  shopFacility: boolean = false;
  user:any
  shopTools: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService:NgbModal,
    private authenticationService: AuthenticationService,
  ) { 
    this.regionName = this.route.snapshot.paramMap.get('region');
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        const lastUrlSegment = event.url.split('?')[0].split('/').pop();
        if(lastUrlSegment==="summary"){
          this.selectedSideBar="SUMMARY"
        }
        if(lastUrlSegment==="shops"){
          this.selectedSideBar='SHOPS'
        }
        if(lastUrlSegment==="tools-equipment"){
          this.selectedSideBar='TOOLS'
        }
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit(): void {
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: false,
      searchVal: "",
    };
    this.user = this.authenticationService.userValue;
    if(this.router.url.includes("facility")){
      this.shopFacility = true;
    }

    if(this.router.url.includes("tools-equipment")){
      this.shopTools = true;
    }

    let url:any = this.router.url;
    let currUrl = url.split('/');
    this.sidebarActiveClass = {
      page: currUrl[1],
      menu: currUrl[1],
    };
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();   
    this.navigateToRoute();
  
  }
  ngOnChanges(){
    this.navigateToRoute();
    
  }

  openAddShopModal(){
    const modalRef = this.modalService.open(AddShopPopupComponent, {backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
  }
  back(step){
    if(step == 'step1'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
  }
  
   // Set Screen Height
   setScreenHeight() {
    this.innerHeight = 0;
  let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
  let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
  headerHeight1 = headerHeight1 > 20 ? 30 : 0;
  let headerHeight = headerHeight1 + headerHeight2;
  this.innerHeight = this.bodyHeight - (headerHeight + 76);
  this.leftEmptyHeight = 0;
  this.leftEmptyHeight = headerHeight + 100;
    this.headquartersPageRef.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 85;   
 }
 getSelectedSidebar(event:string){
  this.selectedSideBar = event;
  this.navigateToRoute();
 }
 navigateToRoute(){
  if(this.selectedSideBar==='SUMMARY'){
    this.router.navigate([`/headquarters/region/${this.regionName}/summary`])
  }
  if(this.selectedSideBar==='SHOPS'){
    this.router.navigate([`/headquarters/region/${this.regionName}/shops`])
  }
  if(this.selectedSideBar==='TOOLS'){
    this.router.navigate([`/headquarters/region/${this.regionName}/tools-equipment`])
  }
 }

 menuNav(item) {
  console.log(item)
  console.log(this.sidebarRef)
  let section = item.slug;
  switch (section) {
    case 'home':
      this.router.navigate(["/headquarters/home"]);
      return false;
    break;
    case 'tools':
      this.router.navigate(["/headquarters/tools-equipment"]);
      return false;
    break;
    case 'dekra-audit':
      this.router.navigate(["/headquarters/audit"]);
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


}
