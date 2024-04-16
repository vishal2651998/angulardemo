import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Constant } from 'src/app/common/constant/constant';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-shop-detail-facility',
  templateUrl: './shop-detail-facility.component.html',
  styleUrls: ['./shop-detail-facility.component.scss']
})
export class ShopDetailFacilityComponent implements OnInit {
  regionName:string="";
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2:string = "profile";
  public bodyClass3:string = "image-cropper";
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  public bodyElem;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  level:string="";
  subLevel:string = "";
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  shopId: string;
  currentAttribute: any;
  currentItem: any;
  public apiKey: string = Constant.ApiKey;
  dekraNetworkId:any;
  public user: any;
  public domainId;
  public userId;
  constructor(private router:Router,
    public headQuarterService: HeadquarterService,private authenticationService: AuthenticationService) {
  //   router.events.forEach((event) => {
  //     if(event instanceof NavigationEnd) {
  //       this.regionName =  event.url.split('/')[3];
  //     }
  // })

  router.events.forEach((event) => {
    if (event instanceof NavigationEnd) {
      if(event.url.includes("all-shops")){
        this.level =  "";
        this.subLevel =  "";    
        this.shopId = event.url.split('/')[4];    
      }else{
        this.level =  event.url.split('/')[3];
        this.subLevel =  event.url.split('/')[4];    
        this.shopId =  event.url.split('/')[6];     
      }
     }
  })
  }

  ngOnInit(): void {
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4);  
    this.getHqDetails();
    window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
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
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
  }
  scroll = (event: any): void => {
  }

  back(step){
    if(step == 'Headquarters'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/network`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
    if(step == 'Region'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shops`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
    if(step == 'allShops'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/all-shops`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
  }

  getHqDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
     this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
        if(response && response.data && response.data.attributesInfo.length > 0 ){

          if(this.level && this.subLevel){
            let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
            this.currentAttribute = attribute;
            this.headQuarterService.levelName = attribute.name;
            let currentItem = attribute.items.find(e=>e.id == this.subLevel);
            this.currentItem = currentItem;
            this.headQuarterService.sublevelName = currentItem.name;
          }
        }
      })
  }


}
