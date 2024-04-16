import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { AddShopPopupComponent } from '../shop/add-shop/add-shop.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserListComponent } from '../../headquarters/user-list/user-list.component';

@Component({
  selector: 'app-shop-detail-users',
  templateUrl: './shop-detail-users.component.html',
  styleUrls: ['./shop-detail-users.component.scss']
})
export class ShopDetailUsersComponent implements OnInit {

  userListPageRef: UserListComponent;

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
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  public apiKey: string = Constant.ApiKey;
  dekraNetworkId:any;
  public user: any;
  public domainId;
  public userId;
  regionName:string="";
  addUserVisible = false;
  userData = [];
 
  public userList = [];
  public displayFlag: boolean = false;
  level:string="";
  subLevel:string = "";
  shopData:any;
  currentAttribute:any;
  currentItem:any;
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;

  public opacityFlag: boolean = false;
  public dekraNetworkHqId: string = '';

  public searchVal: string = "";
  public roleId;
  public countryId='';
  public platformId: string;
  public apiData: Object;


  currentShopData: any;
  shopId: string | Blob;

  public userListFlag: boolean = false;
  public userPageData: Object;
  public itemTotal: number = 0;

  constructor(private router:Router,private modalService: NgbModal,public headQuarterService: HeadquarterService,private authenticationService: AuthenticationService) { 

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

  ngOnInit(): void {
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4);  
    window.addEventListener('scroll', this.scroll, true);
    this.getShopDetails();
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500);

    this.userListFlag = true; 
    this.userPageData = {
      roaccess: 'shop-users',
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey,
      roleId: this.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: this.headQuarterService.currentShopName,
      shopId: this.headQuarterService.currentShopId,
    }      
    // setTimeout(() => {    
    //   this.userListPageRef.getUserList();             
    // }, 2000);

  }
  addNewUser(){
    this.userListPageRef.openUserPOPUP('new','');    
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


  getShopDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("id", this.shopId);
     this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      if(response && response.items && response.items.length > 0 && response.items[0]){
      
        let resultData:any = [];
        resultData = response.items[0];
        
        
        this.shopData = resultData;
        this.headQuarterService.currentShopName = resultData.name;
        this.headQuarterService.currentShopId = resultData.id;      

        setTimeout(() => {
          this.displayFlag = true;
        }, 1000);

        this.getHqDetails();
      // this.level - this.shopData.level
      }
      })
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

          let level1 = response.data.attributesInfo.find(e=>(e.displayOrder == 1));
          let level2 = response.data.attributesInfo.find(e=>(e.displayOrder == 2));
          let level3 = response.data.attributesInfo.find(e=>(e.displayOrder == 3));

          this.shopLevelOneData = level1?.items.find(e=>e.id == this.shopData.levelOneId);
          this.shopLevelTwoData = level2?.items.find(e=>e.id == this.shopData.levelTwoId);
          this.shopLevelThreeData = level3?.items.find(e=>e.id == this.shopData.levelThreeId);
        }
      })
  }

  
  userIndexListPageCallback(data){
    this.userListPageRef = data;
    this.itemTotal = this.userListPageRef.itemTotal;
    console.log(this.userListPageRef);
  }

}
