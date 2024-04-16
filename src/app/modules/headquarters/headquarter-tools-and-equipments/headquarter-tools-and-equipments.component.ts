import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { ToolsListComponent } from '../../headquarters/tools-list/tools-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from '../add-product/add-product.component';
import { AddToolsComponent } from '../add-tools/add-tools.component';

@Component({
  selector: 'app-headquarter-tools-and-equipments',
  templateUrl: './headquarter-tools-and-equipments.component.html',
  styleUrls: ['./headquarter-tools-and-equipments.component.scss']
})
export class HeadquarterToolsAndEquipmentsComponent implements OnInit {

  toolsListPageRef: ToolsListComponent;
  public nonEmptyHeight: number;
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public headquartersFlag: boolean = true;
  public bodyElem;
  public bodyClass2:string = "profile";
  public bodyClass3:string = "image-cropper";
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  headquartersPageRef: HeadquartersListComponent;

  public regionName: string="";

  level:string="";
  subLevel:string = "";

  featuredActionName: string;
  public sconfi
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

  public toolsListFlag: boolean = false;
  public toolsPageData: Object;
  public opacityFlag: boolean = false;
  subAttribute: any;

  constructor(private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public headQuarterService: HeadquarterService,
    private router: Router,
    private modalService:NgbModal
    ) { 
      router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          this.level =  event.url.split('/')[3];
          this.subLevel =  event.url.split('/')[4];     
        }
    })
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4);  
    //window.addEventListener('scroll', this.scroll, true);
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';

    this.toolsListFlag = true; 
    this.toolsPageData = {
      parentPage : 'all-tools',
      currentPage: 'location-tools',
      domainId: this.domainId,
      userId: this.userId,
      apiKey: this.apiKey,
      roleId: this.roleId,
      countryId: this.countryId,
      dekraNetworkId: this.dekraNetworkId,
      shopName: '',
      shopId: '',
    }      
    // setTimeout(() => {    
    //   this.toolsListPageRef.loading = true;             
    //   this.toolsListPageRef.locationToolsFlag = false;             
    //   this.toolsListPageRef.getToolList();                 
    // }, 100);

    this.getHQList();
    setTimeout(() => {
      this.setScreenHeight();
    }, 100);

  }

  getHQList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);

    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
     let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
     this.headQuarterService.levelName = attribute.name;
     let subAttribute = attribute.items.find(e=>e.id == this.subLevel);
     this.subAttribute = subAttribute
     this.headQuarterService.sublevelName = subAttribute.name;

})
}
     // Set Screen Height
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
      console.log("he"+ this.nonEmptyHeight);
      
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
    }

    toolsIndexListPageCallback(data){
      this.toolsListPageRef = data;
      this.itemTotal = this.toolsListPageRef.itemTotal;
    }

    addProduct(){
      const modalRef=this.modalService.open(AddProductComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl' });
      modalRef.result.then(e=>{
        this.toolsListPageRef.getToolList()
      },err=>{})
      modalRef.componentInstance.subAttribute = this.subAttribute;
      modalRef.componentInstance.selectedProduct = this.toolsListPageRef.toolsLocationPageData;
      modalRef.componentInstance.selectedProductId = this.toolsListPageRef.toolsLocationPageData?.id;
      modalRef.componentInstance.selectedProductIndex = this.toolsListPageRef.toolsLocationPageData?.id;
    }

    selectProduct(){
      this.toolsListPageRef.toolsLocationListPageRef.selectProduct({},this.toolsListPageRef.currentItem,true)
    }

      addTools(){
        const modalRef = this.modalService.open(AddToolsComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
      } 
}
