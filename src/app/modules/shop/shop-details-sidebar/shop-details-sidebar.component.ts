import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-shop-details-sidebar',
  templateUrl: './shop-details-sidebar.component.html',
  styleUrls: ['./shop-details-sidebar.component.scss']
})
export class ShopDetailsSidebarComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input("selectedTab") selectedTab:string = "SUMMARY"
  innerHeight: number;
  bodyHeight: number;
  leftEmptyHeight: number;
  regionName:string = "";
  shopId:string="";
  level:string="";
  sublevel:string = ""
  constructor(private router:Router) { 
    // this.setScreenHeight();
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.level =  event.url.split('/')[3];
        this.sublevel =  event.url.split('/')[4];

        this.shopId =  event.url.split('/')[6];

      }
    })
  }

  ngOnInit(): void {
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500)
  }

  setScreenHeight() {
    this.innerHeight = 0;
  let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
  let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
  headerHeight1 = headerHeight1 > 20 ? 30 : 0;
  let headerHeight = headerHeight1 + headerHeight2;
  this.innerHeight = this.bodyHeight - (headerHeight + 76);
  this.leftEmptyHeight = 0;
  this.leftEmptyHeight = headerHeight + 100;
 }
 navigateToSummary(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.sublevel}/shop/${this.shopId}/summary`])
 }
 navigateToUsers(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.sublevel}/shop/${this.shopId}/users`])
 }
 navigateToFacility(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.sublevel}/shop/${this.shopId}/facility`])
 }
 navigateToInspection(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.sublevel}/shop/${this.shopId}/inspection`])
 }
 navigateToTools(){
  this.router.navigate([`/headquarters/level-details/${this.level}/${this.sublevel}/shop/${this.shopId}/tools-equipment`])
 }
}
