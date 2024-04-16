import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';

@Component({
  selector: 'app-headquarter-sidebar',
  templateUrl: './headquarter-sidebar.component.html',
  styleUrls: ['./headquarter-sidebar.component.scss']
})
export class HeadquarterSidebarComponent implements OnInit {
  headquartersPageRef: HeadquartersListComponent;
  public sconfig: PerfectScrollbarConfigInterface = {};
  sidebarRef: SidebarComponent;

  viewType = "LIST"
  @Input("selectedTab") selectedTab:string = "SUMMARY"
  listShops:boolean = false;
  public bodyClass: string = "headquarters";
  public bodyElem;

  public sidebarActiveClass: Object;
  public headquartersFlag: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public featuredActionName: string = '';
  public innerHeight: number;
  public bodyHeight: number;
  public leftEmptyHeight: number = 100;
  public level:string = "";
  public subLevel:string = "";
  regionName:string= ""
  @Output() onSidebarSelect = new EventEmitter();

  constructor(private router: Router,private route: ActivatedRoute) { 
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.level =  event.url.split('/')[3];
        this.subLevel =  event.url.split('/')[4];

      }
  })
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        const lastUrlSegment = event.url.split('?')[0].split('/').pop();
        if(lastUrlSegment==="summary"){
          this.selectedTab="SUMMARY"
        }
        if(lastUrlSegment==="shops"){
          this.selectedTab='SHOPS'
        }
        if(lastUrlSegment==="tools-equipment"){
          this.selectedTab='TOOLS'
        }
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit(): void {
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
  //this.headquartersPageRef.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 85;   
 }
 
//  changeTab(tabName:string){
//   this.selectedTab = tabName;
//   this.onSidebarSelect.emit(this.selectedTab)
// }
navigateToSummary(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/summary`])
}
navigateToShops(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shops`])
}
navigateToTools(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/tools-equipment`])

}
}
