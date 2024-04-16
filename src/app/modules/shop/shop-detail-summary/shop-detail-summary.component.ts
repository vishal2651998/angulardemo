import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NewSubscriptionModalComponent } from '../new-subscription-modal/new-subscription-modal.component';
import { NewCertificationModalComponent } from '../new-certification-modal/new-certification-modal.component';
import { DmsSmsModalComponent } from '../dms-sms-modal/dms-sms-modal.component';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { AddShopPopupComponent } from '../shop/add-shop/add-shop.component';
import { Subscription } from 'rxjs';
import { Title, DomSanitizer } from "@angular/platform-browser";
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { MessageService } from 'primeng/api';

declare var lightGallery: any;

@Component({
  selector: 'app-shop-detail-summary',
  templateUrl: './shop-detail-summary.component.html',
  styleUrls: ['./shop-detail-summary.component.scss'],
  providers: [MessageService]
})
export class ShopDetailSummaryComponent implements OnInit, AfterViewInit {

  public nonEmptyHeight: number;
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public headquartersFlag: boolean = true;
  public bodyElem;
  public bodyClass2: string = "profile";
  public bodyClass3: string = "image-cropper";
  public bodyClass4: string = "system-settings";
  public bodyClass: string = "parts-list";
  headquartersPageRef: HeadquartersListComponent;
  public countryId;
  public domainId;
  public userId;
  featuredActionName: string;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public sconfigX: PerfectScrollbarConfigInterface = { suppressScrollX : true};
  regionName: string = "";
  addUserVisible: boolean = false;
  public modalConfig: any = { backdrop: 'static', keyboard: false, centered: true };
  public user: any;
  public baseApiUrl: string = "";
  public prodCodeSelectedList = [];
  public attachmentAction = "view";
  attachments = {}
  level:string="";
  subLevel:string = "";
  public apiKey: string = Constant.ApiKey;
  shopData:any;
  networkShopDetail: any;
  dekraNetworkId:any;
  shopId:any;
  currentAttribute:any;
  currentItem:any;
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;

  public dmsSelectedId = [];
  public dmsSelectedName = [];

  public franchiseSelectedId = [];
  public franchiseSelectedName = [];

  public subscriptionSelect = [];
  public subscriptionSelectedId = [];
  public subscriptionSelectedName = [];

  public certificationSelect = [];
  public certificationSelectedId = [];
  public certificationSelectedName = [];

  public displayFlag: boolean = false;
  public googleMapUrl: string = "https://www.google.com/maps/embed/v1"
  public googleApiKey: string = 'AIzaSyDTl6RmKfWJCO4m09HwmhZwjyDMtZTc594';

  public timeList = [
    {time: '1 AM'},
    {time: '2 AM'},
    {time: '3 AM'},
    {time: '4 AM'},
    {time: '5 AM'},
    {time: '6 AM'},
    {time: '7 AM'},
    {time: '8 AM'},
    {time: '9 AM'},
    {time: '10 AM'},
    {time: '11 AM'},
    {time: '12 AM'},
];
  shopServicesOfferedSelectedId: any = [];
  shopServicesOfferedSelectedName: any = [];
  shopFacilityFeaturesSelectedId: any  = [];
  shopFacilityFeaturesSelectedName: any  = [];
  shopWebLinksSelectedId: any  = [];
  shopWebLinksSelectedName: any = [];
  shopSystemsTechnology: any=[];
  shopSubscriptionsPolicies: any;
  shopSalesHours: any;
  shopServiceHours: any;
  public editSec: any = [] ;
  shopSystemsTechnologySelectedId: any = [] ;
  shopSystemsTechnologySelectedName: any = [] ;
  shopSubscriptionsPoliciesSelectedId: any  = [];
  shopSubscriptionsPoliciesSelectedName: any  = [];
  loading: boolean = false;
  hideBreadCrumbs: boolean = true;

  shopCertification: any = "";
  systemsTechnologyData: any = "";
  subscriptionsPoliciesData: any = "";
  currentActiveLink:string="volvo";
  constructor(
    private router: Router, 
    private modalService: NgbModal, 
    private authenticationService: AuthenticationService,    
    public headQuarterService: HeadquarterService,
    private config: NgbModalConfig,
    public sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {

    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";

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
  ngAfterViewInit(): void {
    const lg = document.getElementById('lightgallery');
    if (lg) {
      lightGallery(lg);
    }
  }
  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 85;
    console.log("he" + this.nonEmptyHeight);

  }

  userInfoData = [];

  scroll = (event: any): void => {
  }
  userType : 'SHOP' | 'DEKRA' | 'NETWORK';

  ngOnInit(): void {
    this.countryId = localStorage.getItem('countryId');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.hideBreadCrumbs = this.user?.data && this.user?.data?.shopId ? true : false;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass4);
    if(this.domainId === 1){
      this.userType = 'DEKRA';
    }else{
      if(this.user && this.user.data && (!!this.user.data.shopId || this.user.data.shopId !== '')){
        this.userType = 'SHOP';
      }else{
        this.userType = 'NETWORK'
      }
    }

    this.getShopDetails();
    
    window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500)

    this.shopCertification = {
      fieldname: 'certification',
      title: 'Certification',
      titleText: 'Certification',
      page: 'shop-summary',
    }
    this.systemsTechnologyData = {
      fieldname: 'technology',
      title: 'Systems/Technology',
      titleText: 'Systems/Technology',
      page: 'shop-summary',
    }
    this.subscriptionsPoliciesData = {
      fieldname: "policies",
      title: "Subscriptions / Policies",
      titleText: "Subscriptions / Policies",
      page: 'shop-summary',
    }
    
  }
  back(step) {
    if (step == 'Headquarters') {
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/network`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
    if (step == 'Region') {
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/level-details/${this.level}/${this.subLevel}/shops`]);
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
if(step == "allShops"){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/all-shops`])
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
    }
  }

  openAddUser() {
    this.addUserVisible = true;
  }

  closeAddUser() {
    this.addUserVisible = false;
  }

  onDrawerDismiss(event: any) {
    if (!!event && !!event.success) {
      this.addUserVisible = false;
    }
  }
  /*openDmsModal() {
    const modalRef = this.modalService.open(DmsSmsModalComponent, { size: 'lg' });
  }
  openCertificationModal() {
    const modalRef = this.modalService.open(NewCertificationModalComponent, { size: 'lg', windowClass: "subs", backdropClass: "subs" });
  }
  openSubscriptionModal() {
    const modalRef = this.modalService.open(NewSubscriptionModalComponent, { size: 'lg', windowClass: "subs", backdropClass: "subs" });
    modalRef.result.then(res => {
      this.attachments = res.attachments;
    })
  }*/
  manageShopDetail(sectionType,actionType,id='',labelId = ''){
    let addItems: any = [];
    let removeItems: any = [];
    let typeVal = '';
    let successMessage = {
      summary: '', 
      detail: ''
    };
    /*if(actionType == 'delete')
    {
      removeItems.push(id.toString());
      removeItems = JSON.stringify(removeItems);
    }*/
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    
    switch(sectionType){
      case 'dms':
        typeVal = '24';
        if(this.shopSystemsTechnologySelectedId && this.shopSystemsTechnologySelectedId.length>0){
          for (let dms in this.shopSystemsTechnologySelectedId) {
            addItems.push({
              id : this.shopSystemsTechnologySelectedId[dms],
              startDate: '',
              endDate: '',
              labelId : labelId
            })
          }
        }
        addItems = JSON.stringify(addItems);
        break;
      case 'franchise':
        typeVal = '6';
        if(this.franchiseSelectedId && this.franchiseSelectedId.length>0){
          for (let fra in this.franchiseSelectedId) {
            addItems.push({
              id : this.franchiseSelectedId[fra],
              startDate: '',
              endDate: '',
            })
          }
        }     
        addItems = JSON.stringify(addItems);
        successMessage.summary = 'Franchise updated.';   
        break;
      case 'ServiceOffered':
        typeVal = '21';
        if(this.shopServicesOfferedSelectedId && this.shopServicesOfferedSelectedId.length>0){
          for (let fra in this.shopServicesOfferedSelectedId) {
            addItems.push({
              id : this.shopServicesOfferedSelectedId[fra],
              startDate: '',
              endDate: '',
            })
          }
        }     
        addItems = JSON.stringify(addItems);  
        successMessage.summary = ' Type of service offered updated.'; 
        break;
      case 'FacilityFeatures':
        typeVal = '22';
        if(this.shopFacilityFeaturesSelectedId && this.shopFacilityFeaturesSelectedId.length>0){
          for (let fra in this.shopFacilityFeaturesSelectedId) {
            addItems.push({
              id : this.shopFacilityFeaturesSelectedId[fra],
              startDate: '',
              endDate: '',
            })
          }
        }     
        addItems = JSON.stringify(addItems);  
        successMessage.summary = 'Other facility features updated.';   
        break;
      case 'webLinks':
        typeVal = '23';
        if(this.shopWebLinksSelectedId && this.shopWebLinksSelectedId.length>0){
          for (let fra in this.shopWebLinksSelectedId) {
            addItems.push({
              id : this.shopWebLinksSelectedId[fra],
              startDate: '',
              endDate: '',
            })
          }
        }     
        addItems = JSON.stringify(addItems);  
        successMessage.summary = 'Web links updated.'; 
        break;
      case 'subscription':
        if(this.subscriptionSelect && this.subscriptionSelect.length>0){
          for (let sub in this.subscriptionSelect) {
            addItems.push({
              id : this.subscriptionSelect[sub].id,
              startDate: this.subscriptionSelect[sub].startDate,
              endDate: this.subscriptionSelect[sub].endDate,
            })
          }
        }  
        addItems = JSON.stringify(addItems);      
        typeVal = '7';
        break;
      case 'certification':
        if(this.certificationSelect && this.certificationSelect.length>0){
          for (let sub in this.certificationSelect) {
            addItems.push({
              id : this.certificationSelect[sub].id,
              startDate: this.certificationSelect[sub].startDate,
              endDate: this.certificationSelect[sub].endDate,
            })
          }
        }
        addItems = JSON.stringify(addItems);
        typeVal = '8';
        successMessage.summary = 'Certification updated.'; 
        break;
    }
    console.log(addItems);
    console.log(removeItems);
    apiFormData.append("type",typeVal);
    apiFormData.append("shopId", this.shopId);
    apiFormData.append("addItems", addItems);
    apiFormData.append("removeItems", removeItems);
    this.headQuarterService.manageShopDetail(apiFormData).subscribe((response:any) => {
      console.log(response);
      this.messageService.add({severity:'success', summary:successMessage.summary, closable: false, life: 2000});

    });
  }
  manageShopModify(sectionType){
    this.loading = true;
    let addItems: any;
    let removeItems: any = [];
    let typeVal = '';
    let successMessage = {
      summary: '', 
      detail: ''
    };
    /*if(actionType == 'delete')
    {
      removeItems.push(id.toString());
      removeItems = JSON.stringify(removeItems);
    }*/
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    
    switch(sectionType){
      case 'Systems/Technology':
        typeVal = '24';
        if(this.shopSystemsTechnologySelectedId && this.shopSystemsTechnologySelectedId.length>0){
        addItems = this.shopSystemsTechnology;
        }
        addItems = JSON.stringify(addItems);
        successMessage.summary = 'Systems/Technology updated.';
        break;
      case 'subscription':
        typeVal = '25';
        if(this.shopSubscriptionsPoliciesSelectedId && this.shopSubscriptionsPoliciesSelectedId.length>0){
        addItems = this.shopSubscriptionsPolicies;
        }
        addItems = JSON.stringify(addItems);
        successMessage.summary = 'Subscriptions/Policies updated.';
        break;
      case 'salesHour':
        typeVal = '26';
        addItems = [];
        this.shopSalesHours.forEach(res => {
          let hours: any = {...res};
          let fromDate = new Date(hours.from);
          let toDate = new Date(hours.to);
          hours.from = fromDate.getHours()+':'+fromDate.getMinutes();
          hours.to = toDate.getHours()+':'+toDate.getMinutes();
          addItems.push(hours);
          let resHourFrom = fromDate.getHours() - 12 > 0 ? fromDate.getHours() - 12 : (fromDate.getHours() ? fromDate.getHours() : 12);
          let resMinFrom = `${fromDate.getMinutes() > 9 ? fromDate.getMinutes() : `0${fromDate.getMinutes()}`}`;
          let resFromAmPm = fromDate.getHours() > 11 ? 'PM' : 'AM';
          let resHourTo = toDate.getHours() - 12 > 0 ? toDate.getHours() - 12 : (toDate.getHours() ? toDate.getHours() : 12);
          let resMinTo = `${toDate.getMinutes() > 9 ? toDate.getMinutes() : `0${toDate.getMinutes()}`}`;
          let resToAmPm = toDate.getHours() > 11 ? 'PM' : 'AM';
          res.name = `${resHourFrom+':'+resMinFrom+' '+resFromAmPm} - ${resHourTo+':'+resMinTo+' '+resToAmPm}`
        });
        addItems = JSON.stringify(addItems);
        successMessage.summary = 'Sales hours updated.';
        break;
      case 'serviceHour':
        typeVal = '27';
        addItems = [];
        this.shopServiceHours.forEach(res => {
          let hours: any = {...res};
          let fromDate = new Date(hours.from);
          let toDate = new Date(hours.to);
          hours.from = fromDate.getHours()+':'+fromDate.getMinutes();
          hours.to = toDate.getHours()+':'+toDate.getMinutes();
          addItems.push(hours);
          let resHourFrom = fromDate.getHours() - 12 > 0 ? fromDate.getHours() - 12 : (fromDate.getHours() ? fromDate.getHours() : 12);
          let resMinFrom = `${fromDate.getMinutes() > 9 ? fromDate.getMinutes() : `0${fromDate.getMinutes()}`}`;
          let resFromAmPm = fromDate.getHours() > 11 ? 'PM' : 'AM';
          let resHourTo = toDate.getHours() - 12 > 0 ? toDate.getHours() - 12 : (toDate.getHours() ? toDate.getHours() : 12);
          let resMinTo = `${toDate.getMinutes() > 9 ? toDate.getMinutes() : `0${toDate.getMinutes()}`}`;
          let resToAmPm = toDate.getHours() > 11 ? 'PM' : 'AM';
          res.name = `${resHourFrom+':'+resMinFrom+' '+resFromAmPm} - ${resHourTo+':'+resMinTo+' '+resToAmPm}`
        });
        addItems = JSON.stringify(addItems);
        successMessage.summary = 'Service hours updated.';
        break;
      
    }
    console.log(addItems);
    console.log(removeItems);
    apiFormData.append("type",typeVal);
    apiFormData.append("shopId", this.shopId);
    apiFormData.append("addItems", addItems);
    apiFormData.append("removeItems", removeItems);
    this.headQuarterService.manageShopDetail(apiFormData).subscribe((response:any) => {
      console.log(response);
      this.loading = false;
          this.messageService.add({severity:'success', summary:successMessage.summary, closable: false, life: 2000});
    });
  }

  onClickOnShopTab(data){
    this.networkShopDetail = data;
    this.userInfoData = [];
    if(data.levelOneUsersList){
      data.levelOneUsersList.forEach(itemuser => {
        itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
        itemuser.email = itemuser.email;
        itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
        itemuser.editAccess = false;
      });
      this.userInfoData.push({
        dataId: data.levelOneId,
        type: 'shop-detail',
        dynamictext: data.levelOneName,
        credateAccess : false,
        users: data.levelOneUsersList
      });
    }

    if(data.levelTwoUsersList){
        data.levelTwoUsersList.forEach(itemuser => {
        itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
        itemuser.email = itemuser.email;
        itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
        itemuser.editAccess = false;
      });
      this.userInfoData.push({
        dataId: data.levelTwoId,
        type: 'shop-detail',
        dynamictext: data.levelTwoName,
        credateAccess : false,
        users: data.levelTwoUsersList
      });
    }

    if(data.levelThreeUsersList){
        data.levelThreeUsersList.forEach(itemuser => {
        itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
        itemuser.email = itemuser.email;
        itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
        itemuser.editAccess = false;
      });
      this.userInfoData.push({
        dataId: data.levelThreeId,
        type: 'shop-detail',
        dynamictext: data.levelThreeName,
        credateAccess : false,
        users: data.levelThreeUsersList
      });
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
    if(this.userType === 'SHOP' || this.userType === 'DEKRA'){
      apiFormData.append("fromShopUser", '1');
    }

     this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      if(response && response.items && response.items.length > 0 && response.items[0]){
      
        let resultData:any = [];
        resultData = response.items[0];
        
        this.headQuarterService.currentShopName = resultData.name;
        this.headQuarterService.currentShopId = resultData.id;

        // userlist show
        resultData.userInfoData = [];
        let type = 'shop-detail';   
         let levelone =  (resultData.levelOneUsersList && resultData.levelOneUsersList.length>0) ? true : false;
        let leveltwo =  (resultData.levelTwoUsersList && resultData.levelTwoUsersList.length>0) ? true : false;
        let levelthree =  (resultData.levelThreeUsersList && resultData.levelThreeUsersList.length>0) ? true : false;
        
        if(levelone){         
          resultData.levelOneUsersList.forEach(itemuser => {
            itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
            itemuser.email = itemuser.email;
            itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
            itemuser.editAccess = false;
          }); 
        }
        resultData.userInfoData.push({
          dataId: resultData.levelOneId,
          type: type,
          dynamictext: resultData.levelOneName,
          credateAccess : false,
          users:resultData.levelOneUsersList
        });  
        
        if(leveltwo){         
          resultData.levelTwoUsersList.forEach(itemuser => {
            itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
            itemuser.email = itemuser.email;
            itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
            itemuser.editAccess = false;
          }); 
        }
        resultData.userInfoData.push({
          dataId: resultData.levelTwoId,
          type: type,
          dynamictext: resultData.levelTwoName,
          credateAccess : false,
          users:resultData.levelTwoUsersList
        });  

        if(levelthree){         
          resultData.levelThreeUsersList.forEach(itemuser => {
            itemuser.nameTitle = itemuser.firstName +" "+ itemuser.lastName;
            itemuser.email = itemuser.email;
            itemuser.phone = itemuser.phoneNo != '' ? itemuser.phoneNo : "";
            itemuser.editAccess = false;
          }); 
        }
        resultData.userInfoData.push({
          dataId: resultData.levelThreeId,
          type: type,
          dynamictext: resultData.levelThreeName,
          credateAccess : false,
          users:resultData.levelThreeUsersList
        });        

        resultData.userinfoFlag = true; 

        if(resultData.shopDmsInfoArr){
          if(resultData.shopDmsInfoArr.length>0){
            for (let dms in resultData.shopDmsInfoArr) {
                this.dmsSelectedId.push(resultData.shopDmsInfoArr[dms].id);
                this.dmsSelectedName.push(resultData.shopDmsInfoArr[dms].name);
            }
          }
        }

        if(resultData.shopFranchiseInfoArr){
          if(resultData.shopFranchiseInfoArr.length>0){
            for (let franchise in resultData.shopFranchiseInfoArr) {
                this.franchiseSelectedId.push(resultData.shopFranchiseInfoArr[franchise].id);
                this.franchiseSelectedName.push(resultData.shopFranchiseInfoArr[franchise].name);
            }
          }
        }

        if(resultData.shopServicesOfferedInfoArr){
          if(resultData.shopServicesOfferedInfoArr.length>0){
            for (let shopServices in resultData.shopServicesOfferedInfoArr) {
                this.shopServicesOfferedSelectedId.push(resultData.shopServicesOfferedInfoArr[shopServices].id);
                this.shopServicesOfferedSelectedName.push(resultData.shopServicesOfferedInfoArr[shopServices].name);
            }
          }
        }

        if(resultData.shopFacilityFeaturesInfoArr){
          if(resultData.shopFacilityFeaturesInfoArr.length>0){
            for (let shopFacility in resultData.shopFacilityFeaturesInfoArr) {
                this.shopFacilityFeaturesSelectedId.push(resultData.shopFacilityFeaturesInfoArr[shopFacility].id);
                this.shopFacilityFeaturesSelectedName.push(resultData.shopFacilityFeaturesInfoArr[shopFacility].name);
            }
          }
        }
        
        if(resultData.shopWebLinksInfoArr){
          if(resultData.shopWebLinksInfoArr.length>0){
            for (let links in resultData.shopWebLinksInfoArr) {
                this.shopWebLinksSelectedId.push(resultData.shopWebLinksInfoArr[links].id);
                this.shopWebLinksSelectedName.push(resultData.shopWebLinksInfoArr[links].name);
            }
          }
        }

        if(resultData.shopSystemsTechnologyInfoArr){
          if(resultData.shopSystemsTechnologyInfoArr.length>0){
          this.shopSystemsTechnology = resultData.shopSystemsTechnologyInfoArr;
          for (let links in resultData.shopSystemsTechnologyInfoArr) {
            this.shopSystemsTechnologySelectedId.push(resultData.shopSystemsTechnologyInfoArr[links].id);
            this.shopSystemsTechnologySelectedName.push(resultData.shopSystemsTechnologyInfoArr[links].name);
        }
          }
        }

        if(resultData.shopSubscriptionsPoliciesInfoArr){
          if(resultData.shopSubscriptionsPoliciesInfoArr.length>0){
          this.shopSubscriptionsPolicies = resultData.shopSubscriptionsPoliciesInfoArr
          };
          for (let links in resultData.shopSubscriptionsPoliciesInfoArr) {
            this.shopSubscriptionsPoliciesSelectedId.push(resultData.shopSubscriptionsPoliciesInfoArr[links].id);
            this.shopSubscriptionsPoliciesSelectedName.push(resultData.shopSubscriptionsPoliciesInfoArr[links].name);
        }
        }

        if(resultData.shopSalesHoursInfoArr){
          if(resultData.shopSalesHoursInfoArr.length>0){
          this.shopSalesHours = resultData.shopSalesHoursInfoArr;
          this.shopSalesHours.forEach(res => {
            let startTime = res.from.split(':');
            let endTime = res.to.split(':');
            res.from = new Date(new Date().setHours(startTime[0],startTime[1]));
            res.to = new Date(new Date().setHours(endTime[0],endTime[1]));
            let fromDate = new Date(res.from);
            let toDate = new Date(res.to);
            let resHourFrom = fromDate.getHours() - 12 > 0 ? fromDate.getHours() - 12 : (fromDate.getHours() ? fromDate.getHours() : 12);
            let resMinFrom = `${fromDate.getMinutes() > 9 ? fromDate.getMinutes() : `0${fromDate.getMinutes()}`}`;
            let resFromAmPm = fromDate.getHours() > 11 ? 'PM' : 'AM';
            let resHourTo = toDate.getHours() - 12 > 0 ? toDate.getHours() - 12 : (toDate.getHours() ? toDate.getHours() : 12);
            let resMinTo = `${toDate.getMinutes() > 9 ? toDate.getMinutes() : `0${toDate.getMinutes()}`}`;
            let resToAmPm = toDate.getHours() > 11 ? 'PM' : 'AM';
            res.name = `${resHourFrom+':'+resMinFrom+' '+resFromAmPm} - ${resHourTo+':'+resMinTo+' '+resToAmPm}`
          });
          }
        }

        if(resultData.shopServiceHoursInfoArr){
          if(resultData.shopServiceHoursInfoArr.length>0){
          this.shopServiceHours = resultData.shopServiceHoursInfoArr;
          this.shopServiceHours.forEach(res => {
            let startTime = res.from.split(':');
            let endTime = res.to.split(':');
            res.from = new Date(new Date().setHours(startTime[0],startTime[1]));
            res.to = new Date(new Date().setHours(endTime[0],endTime[1]));
            let fromDate = new Date(res.from);
            let toDate = new Date(res.to);
            let resHourFrom = fromDate.getHours() - 12 > 0 ? fromDate.getHours() - 12 : (fromDate.getHours() ? fromDate.getHours() : 12);
            let resMinFrom = `${fromDate.getMinutes() > 9 ? fromDate.getMinutes() : `0${fromDate.getMinutes()}`}`;
            let resFromAmPm = fromDate.getHours() > 11 ? 'PM' : 'AM';
            let resHourTo = toDate.getHours() - 12 > 0 ? toDate.getHours() - 12 : (toDate.getHours() ? toDate.getHours() : 12);
            let resMinTo = `${toDate.getMinutes() > 9 ? toDate.getMinutes() : `0${toDate.getMinutes()}`}`;
            let resToAmPm = toDate.getHours() > 11 ? 'PM' : 'AM';
            res.name = `${resHourFrom+':'+resMinFrom+' '+resFromAmPm} - ${resHourTo+':'+resMinTo+' '+resToAmPm}`
          });
          }
        }

        if(resultData.shopSupscriptionInfoArr){
          if(resultData.shopSupscriptionInfoArr.length>0){
            for (let subscribe in resultData.shopSupscriptionInfoArr) {
                this.subscriptionSelectedId.push(resultData.shopSupscriptionInfoArr[subscribe].id);
                this.subscriptionSelectedName.push(resultData.shopSupscriptionInfoArr[subscribe].name);
                this.subscriptionSelect.push({
                  id : resultData.shopSupscriptionInfoArr[subscribe].id,
                  name : resultData.shopSupscriptionInfoArr[subscribe].name,
                  startDate: resultData.shopSupscriptionInfoArr[subscribe].startDate,
                  endDate: resultData.shopSupscriptionInfoArr[subscribe].endDate,
                });
            }
          }
        }

        if(resultData.shopCertificationInfoArr){
          if(resultData.shopCertificationInfoArr.length>0){
            for (let certificate in resultData.shopCertificationInfoArr) {
              this.certificationSelectedId.push(resultData.shopCertificationInfoArr[certificate].id);
              this.certificationSelectedName.push(resultData.shopCertificationInfoArr[certificate].name);
              this.certificationSelect.push({
                id : resultData.shopCertificationInfoArr[certificate].id,
                name: resultData.shopCertificationInfoArr[certificate].name,
                startDate: resultData.shopCertificationInfoArr[certificate].startDate,
                endDate: resultData.shopCertificationInfoArr[certificate].endDate,
              });
            }
          }
        }

        
        const address = resultData.address1 + resultData.address2 + ',' + resultData.city + ',' + resultData.state + ',' + resultData.zip;
        resultData['gmapcanvas'] = "gmap_canvas_" + resultData.id;
        resultData['googleMapInfo'] = '';
        resultData['googleMapInfo'] = `${this.googleMapUrl}/place?key=${this.googleApiKey}&q=${address}&zoom=6`;
        resultData['googleMapInfo'] = this.sanitizer.bypassSecurityTrustResourceUrl(resultData['googleMapInfo']);
        
  
        this.shopData = resultData;
        if(this.shopData && this.shopData.networkShopData && this.shopData.networkShopData.length > 0){
          this.currentActiveLink = this.shopData.networkShopData[0].networkname;
          this.onClickOnShopTab(this.shopData.networkShopData[0]);
        }
        this.currentActiveLink
        setTimeout(() => {
          this.displayFlag = true;
        }, 1000);

        this.getHqDetails();
      // this.level - this.shopData.level
      }
      })
  }

    // Manage List
    manageList(field, label = '') {
  console.log(label)
      let apiData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        networkId: this.dekraNetworkId,
      };
  
      let access;
      let filteredItems;
      let filteredNames;
      let filteredDate;
      let inputData = {};
      switch (field) {
        // case "dms":
        //   apiData["type"] = "5";
        //   access = "newthread";
        //   filteredItems = this.dmsSelectedId;
        //   filteredNames = this.dmsSelectedName;
        //   inputData = {
        //     actionApiName: "",
        //     actionQueryValues: "",
        //     selectionType: "multiple",
        //     field:'dekra-dms',   
        //     title: "DMS/SMS",
        //     filteredItems: filteredItems,
        //     filteredLists: filteredNames,
        //     baseApiUrl: this.headQuarterService.dekraBaseUrl,
        //     apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
        //  };
        //  break;
        case "dms":
          apiData["type"] = "24";
          apiData["label"] = label;
          access = "newthread";
          filteredItems = this.shopSystemsTechnologySelectedId;
          filteredNames = this.shopServicesOfferedSelectedName;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "single",
            field:'dekra-dms',   
            title: "Systems/Technology",
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
        case "subscriptionPolicy":
          apiData["type"] = "25";
          apiData["label"] = label;
          access = "newthread";
          filteredItems = this.shopSubscriptionsPoliciesSelectedId;
          filteredNames = this.shopSubscriptionsPoliciesSelectedName;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "single",
            field:'dekra-subscriptionPolicy',   
            title: "Certificates",
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
        case "franchise":
          apiData["type"] = "6";
          access = "newthread";
          filteredItems = this.franchiseSelectedId;
          filteredNames = this.franchiseSelectedName;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "multiple",
            field:'dekra-franchise',   
            title: "Franchise",
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
        case "ServiceOffered":
          apiData["type"] = "21";
          access = "newthread";
          filteredItems = this.shopServicesOfferedSelectedId;
          filteredNames = this.shopServicesOfferedSelectedName;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "multiple",
            field:'dekra-ServiceOffered',   
            title: "Service Offered",
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
        case "FacilityFeatures":
          apiData["type"] = "22";
          access = "newthread";
          filteredItems = this.shopFacilityFeaturesSelectedId;
          filteredNames = this.shopFacilityFeaturesSelectedName;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "multiple",
            field:'dekra-FacilityFeatures',   
            title: "Facility Features",
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
        case "webLinks":
          apiData["type"] = "23";
          access = "newthread";
          filteredItems = this.shopWebLinksSelectedId;
          filteredNames = this.shopWebLinksSelectedName;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "multiple",
            field:'dekra-webLinks',   
            title: "Web Links",
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
        //  case "subscription":
        //   this.bodyElem = document.getElementsByTagName('body')[0];
        //   this.bodyElem.classList.add("certification-modal");
        //   this.bodyElem.classList.add("profile-certificate");  
        //   apiData["type"] = "7";
        //   access = "newthread";
        //   filteredItems = this.subscriptionSelectedId;
        //   filteredNames = this.subscriptionSelectedName;
        //   filteredDate = this.subscriptionSelect;
        //   inputData = {
        //     actionApiName: "",
        //     actionQueryValues: "",
        //     selectionType: "multiple",
        //     field:'dekra-subscription',   
        //     title: "Subscription",
        //     filteredItems: filteredItems,
        //     filteredLists: filteredNames,
        //     filteredDate: filteredDate,
        //     baseApiUrl: this.headQuarterService.dekraBaseUrl,
        //     apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
        //  };
        //  break;
         case "certification":
          this.bodyElem = document.getElementsByTagName('body')[0];
          this.bodyElem.classList.add("certification-modal");
          this.bodyElem.classList.add("profile-certificate");          
          apiData["type"] = "8";
          access = "newthread";
          filteredItems = this.certificationSelectedId;
          filteredNames = this.certificationSelectedName;
          filteredDate = this.certificationSelect;
          inputData = {
            actionApiName: "",
            actionQueryValues: "",
            selectionType: "multiple",
            field:'dekra-certification',   
            title: "Certification",
            filteredDate: filteredDate,
            filteredItems: filteredItems,
            filteredLists: filteredNames,
            baseApiUrl: this.headQuarterService.dekraBaseUrl,
            apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
         };
         break;
      }  
      if (['ServiceOffered', 'FacilityFeatures', 'subscriptionPolicy', 'dms'].includes(field)) {
        this.config['windowClass'] = 'modal-custom-class';
      } else {
        this.config['windowClass'] = '';
      }
      const modalRef = this.modalService.open(ManageListComponent, this.config);
      modalRef.componentInstance.access = access;      
      modalRef.componentInstance.inputData = inputData; 
      modalRef.componentInstance.accessAction = true;
      modalRef.componentInstance.filteredItems = filteredItems;
      modalRef.componentInstance.filteredLists = filteredNames;
      modalRef.componentInstance.filteredTags = filteredItems;
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.height = this.innerHeight + 140;
      modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove("certification-modal");
        this.bodyElem.classList.remove("profile-certificate");  
        modalRef.dismiss("Cross click");
        let items = receivedService;
        switch (field) {
          // case "dms":
          //   this.dmsSelectedId = [];
          //   this.dmsSelectedName = [];
          //   for (let t in items) {
          //     let chkIndex = this.dmsSelectedId.findIndex(
          //       (option) => option == items[t].id
          //     );
          //     if (chkIndex < 0) {
          //       this.dmsSelectedId.push(items[t].id);
          //       this.dmsSelectedName.push(items[t].name);
          //     }
          //   }
          //   console.log(this.dmsSelectedId, this.dmsSelectedName);
          //   break;
          case "dms":
            this.shopSystemsTechnologySelectedId = [];
            this.shopSystemsTechnologySelectedName = [];
            for (let t in items) {
              let chkIndex = this.shopSystemsTechnologySelectedId.findIndex(
                (option) => option == items[t].id
              );
              if (chkIndex < 0) {
                this.shopSystemsTechnologySelectedId.push(items[t].id);
                this.shopSystemsTechnologySelectedName.push(items[t].name);
              }
            }
            this.shopSystemsTechnology.forEach((res)=>{
              if (res.labelId == label) {
                res.id = items[0].id ;
                res.name = items[0].name ;
              }
            })
            console.log(this.shopSystemsTechnologySelectedId, this.shopSystemsTechnologySelectedName);
            break;
          case "subscriptionPolicy":
            this.shopSubscriptionsPoliciesSelectedId = [];
            this.shopSubscriptionsPoliciesSelectedName = [];
            for (let t in items) {
              let chkIndex = this.shopSubscriptionsPoliciesSelectedId.findIndex(
                (option) => option == items[t].id
              );
              if (chkIndex < 0) {
                this.shopSubscriptionsPoliciesSelectedId.push(items[t].id);
                this.shopSubscriptionsPoliciesSelectedName.push(items[t].name);
              }
            }
            this.shopSubscriptionsPolicies.forEach((res)=>{
              if (res.labelId == label) {
                res.id = items[0].id ;
                res.name = items[0].name ;
              }
            })
            console.log(this.shopSubscriptionsPoliciesSelectedId, this.shopSubscriptionsPoliciesSelectedName);
            break;
          case 'franchise':
            this.franchiseSelectedId = [];
            this.franchiseSelectedName = [];
            for (let t in items) {
              let chkIndex = this.franchiseSelectedId.findIndex(
                (option) => option == items[t].id
              );
              if (chkIndex < 0) {
                this.franchiseSelectedId.push(items[t].id.toString());
                this.franchiseSelectedName.push(items[t].name);
              }
            }
            console.log(this.franchiseSelectedId, this.franchiseSelectedName);
            break;
          case 'ServiceOffered':
            this.shopServicesOfferedSelectedId = [];
            this.shopServicesOfferedSelectedName = [];
            for (let t in items) {
              let chkIndex = this.shopServicesOfferedSelectedId.findIndex(
                (option) => option == items[t].id
              );
              if (chkIndex < 0) {
                this.shopServicesOfferedSelectedId.push(items[t].id.toString());
                this.shopServicesOfferedSelectedName.push(items[t].name);
              }
            }
            console.log(this.shopServicesOfferedSelectedId, this.shopServicesOfferedSelectedName);
            break;
          case 'FacilityFeatures':
            this.shopFacilityFeaturesSelectedId = [];
            this.shopFacilityFeaturesSelectedName = [];
            for (let t in items) {
              let chkIndex = this.shopFacilityFeaturesSelectedId.findIndex(
                (option) => option == items[t].id
              );
              if (chkIndex < 0) {
                this.shopFacilityFeaturesSelectedId.push(items[t].id.toString());
                this.shopFacilityFeaturesSelectedName.push(items[t].name);
              }
            }
            console.log(this.shopFacilityFeaturesSelectedId, this.shopFacilityFeaturesSelectedName);
            break;
          case 'webLinks':
            this.shopWebLinksSelectedId = [];
            this.shopWebLinksSelectedName = [];
            for (let t in items) {
              let chkIndex = this.shopWebLinksSelectedId.findIndex(
                (option) => option == items[t].id
              );
              if (chkIndex < 0) {
                this.shopWebLinksSelectedId.push(items[t].id.toString());
                this.shopWebLinksSelectedName.push(items[t].name);
              }
            }
            console.log(this.shopWebLinksSelectedId, this.shopWebLinksSelectedName);
            break;
          // case 'subscription':
          //   this.subscriptionSelect = [];
          //   this.subscriptionSelectedId = [];
          //   this.subscriptionSelectedName = [];
          //   this.subscriptionSelectedName = [];
          //   for (let t in items) {
          //     let chkIndex = this.subscriptionSelectedId.findIndex(
          //       (option) => option == items[t].id
          //     );
          //     if (chkIndex < 0) {
          //       this.subscriptionSelectedId.push(items[t].id.toString());
          //       this.subscriptionSelectedName.push(items[t].name);
          //       this.subscriptionSelect.push({
          //         id : items[t].id.toString(),
          //         name : items[t].name,
          //         startDate: items[t].sdate != undefined && items[t].sdate != '' ? items[t].sdate : '',
          //         endDate: items[t].edate != undefined && items[t].edate != '' ? items[t].edate : '',
          //       }); 
          //     }
          //   }
          //   console.log(this.subscriptionSelectedId, this.subscriptionSelectedName);
          //   break;
            case 'certification':
              this.certificationSelect = [];
              this.certificationSelectedId = [];
              this.certificationSelectedName = [];
              for (let t in items) {
                let chkIndex = this.certificationSelectedId.findIndex(
                  (option) => option == items[t].id
                );
                if (chkIndex < 0) {
                  this.certificationSelectedId.push(items[t].id.toString());
                  this.certificationSelectedName.push(items[t].name);
                  this.certificationSelect.push({
                    id : items[t].id.toString(),
                    name : items[t].name,
                    startDate: items[t].sdate != undefined && items[t].sdate != '' ? items[t].sdate : '',
                    endDate: items[t].edate != undefined && items[t].edate != '' ? items[t].edate : '',
                  });
                }
              }
              console.log(this.certificationSelectedId, this.certificationSelectedName);
              break;
         }
         setTimeout(() => {
          if(!['subscriptionPolicy', 'dms'].includes(field)){
            this.manageShopDetail(field,'new','',label);
          }
         }, 500);         

      });
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

  openEditShopModal() {
    const modalRef = this.modalService.open(AddShopPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
    modalRef.componentInstance.editData = this.shopData;
    modalRef.componentInstance.selectedRegion = this.featuredActionName && this.featuredActionName.split('Region - ').length > 1 ? this.featuredActionName.split('Region - ')[1] : "";
    // modalRef.componentInstance.item = this.item
    modalRef.result.then(() => {
      this.getShopDetails();
    },err=>{
      
    });
  }

  removeSelection(index,type){
    let title ='';
    switch(type){
      case 'dms':
        title = 'DMS/SMS';
        break;
      case 'franchise':
        title = 'Franchise';
        break;
      case 'subscription':
        title = 'Subscriptions';
        break;
      case 'certification':
        title = 'Certification';
        break;
    }

    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'Remove';
        modalRef.componentInstance.title = "Remove "+title;
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          console.log(receivedService);
          if(receivedService){
            this.deleteSelection(index,type);
          }
        }); 
  }
  deleteSelection(index,type){
        let deleteId ;
        switch(type){
          case 'dms':
            deleteId = this.dmsSelectedId[index]; 
            this.dmsSelectedId.splice(index, 1);
            this.dmsSelectedName.splice(index, 1);
          break;
          case 'franchise':
            deleteId = this.franchiseSelectedId[index];
            this.franchiseSelectedId.splice(index, 1);
            this.franchiseSelectedName.splice(index, 1);
          break;
          case 'subscription':
            deleteId = this.subscriptionSelectedId[index];
            this.subscriptionSelect.splice(index, 1);
            this.subscriptionSelectedId.splice(index, 1);
            this.subscriptionSelectedName.splice(index, 1);
          break;
          case 'certification':
            deleteId = this.certificationSelectedId[index];
            this.certificationSelect.splice(index, 1);
            this.certificationSelectedId.splice(index, 1);
            this.certificationSelectedName.splice(index, 1);
          break;
        }
        setTimeout(() => {
          this.manageShopDetail(type, 'delete',deleteId);
         }, 500);  
      }


      serviceActionDelete(id,title){
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'NDelete';
        modalRef.componentInstance.title = "Delete "+title;
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          console.log(receivedService);
          if(receivedService){
            //this.deleteConfirm(id);
          }
        });    
      }

      editValues(type: string) {
        if (!this.editSec.includes(type)) {
          this.editSec.push(type);
        } else {
          let index = this.editSec.findIndex((res: any) => res == type);
          this.editSec.splice(index, 1);
        }
      }

      navigatePage(id){
        this.router.navigate([`/headquarters/all-shops/shop/${id}`]).then(() => {
          window.location.reload();
        });
        //window.location.href = `/headquarters/all-shops/shop/${id}`;
      }

}
