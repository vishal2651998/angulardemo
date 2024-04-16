import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AddToolsComponent } from '../add-tools/add-tools.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  @Input() selectedProduct:any = {};
  public showHeader:any = true;

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyElem;
  public bodyHeight: number;
  public innerHeight: number;
  public emptyHeight: number;
  public activeIndex = 0;
  public carouselLinks = [];
  public apiKey: string = Constant.ApiKey;
  dekraNetworkId:any;
  public user: any;
  public domainId;
  public userId;
  constructor(
    private route:ActivatedRoute,private modalService: NgbModal,private authenticationService: AuthenticationService,private headQuarterService: HeadquarterService
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.carouselLinks = this.selectedProduct.uploadContents.map((e,i)=>{
      return {index:i,src:e.thumbFilePath}
    })
    if(window.location.href.includes('level-details')){
      this.showHeader = false;
    }
    console.log(this.selectedProduct)
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 2000)
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight = (document.getElementsByClassName("prob-header")[0]) ? 30 : 0;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.emptyHeight = 0;
    console.log(headerHeight);
    

    // this.emptyHeight = headerHeight + 46;
    this.emptyHeight = headerHeight + 145;
  }

  editTools(){
    const modalRef = this.modalService.open(AddToolsComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
    modalRef.componentInstance.editId = this.selectedProduct.id;
    modalRef.result.then(e=>{
      this.getTool();
    },err=>{

    })
  }

  getTool() {

    // if(this.itemOffset == 0){
    //   this.toolsList = [];
    //   this.itemTotal = 0;
    //   this.itemLength = 0;
    // }
  
    // this.scrollTop = 0;
    // this.lastScrollTop = this.scrollTop;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append('id', this.selectedProduct.id);
  
    let resultData = [];
    this.headQuarterService.getToolsList(apiFormData).subscribe((response:any) => {
      if(response && response.items.length > 0){
        this.selectedProduct = response.items[0];
      }
    })
  }
  


}
