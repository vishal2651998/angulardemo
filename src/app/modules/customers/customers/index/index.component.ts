import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab } from "src/app/common/constant/constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { SidebarComponent } from "src/app/layouts/sidebar/sidebar.component";
import { CustomerListComponent } from "src/app/components/common/customer-list/customer-list.component";
import * as moment from "moment";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  sidebarRef: SidebarComponent;
  customerPageRef: CustomerListComponent;
  public title: string = "Customers";
  public bodyClass: string = "customers";
  public bodyClass1: string = "parts-list";
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;
  public pageLoading: boolean = true;
  public roFlag: boolean = false;
  public dashView: boolean = false;
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public headerData: Object;
  public headTitle: string = "Customers";
  public paramFlag: boolean = false;
  public countryId;
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;
  public bodyHeight: number;
  public innerHeight: number;
  public loading: boolean = true;
  public pageAccess: string = "customers";
  public searchVal: string = "";
  public shopId: number = 0;

  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.route.params.subscribe( params => {
      let paramLen = Object.keys(params).length;
      this.paramFlag = (paramLen > 0) ? true : false;
      this.dashView = !this.paramFlag;
      this.shopId = parseInt(params.shopId);
      console.log(params, paramLen, this.dashView)
    });
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) {
      this.bodyElem = document.getElementsByTagName("body")[0];
      this.footerElem = document.getElementsByClassName("footer-content")[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
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
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  menuNav(item) {
    console.log(item)
    console.log(this.sidebarRef)
    let section = item.slug;
    switch (section) {
      case 'summary':
        if(!this.customerPageRef.summaryFlag) {
          this.customerPageRef.summaryFlag = true;
          this.customerPageRef.roFlag = false;
          this.roFlag = false;
        }
        break;
      case 'repair-order':
        if(!this.customerPageRef.roFlag) {
          this.customerPageRef.roFlag = true;
          this.customerPageRef.summaryFlag = false;
          this.roFlag = true;
        }
        break;
    }    
  }

  sidebarCallBack(data) {
    this.sidebarRef = data;
  }

  customerCallback(data) {
    console.log(data)
    this.customerPageRef = data;
    this.pageLoading = false;
    if(data.customerDetailView) {
      setTimeout(() => {
        this.customerPageRef.customerDetailView = false;
        this.customerPageRef.customerId = this.shopId;  
        let item = {
          id: this.shopId
        };
        this.customerPageRef.viewInfo(item);  
      }, 500);      
    }
    this.dashView = (data.view == 2) ? true : false;
    this.roFlag = data.roFlag;
    if(data.view == 2) {
      console.log(this.sidebarRef)
      if(this.sidebarRef) {
        let menuId = (data.summaryFlag) ? 1 : 2; 
        this.sidebarRef.dispatchMenu.forEach(item => {
          item.activeClass = (item.id == menuId) ? true : false;
        });  
      }
    }
  }

  // Search
  applySearch(action, val) {
    if (action == "emit" && this.searchVal == '' && val == '') {
      
    } 
    else{
      this.searchVal = val;       
      this.customerPageRef.searchVal = val;
      this.customerPageRef.searchFlag = true;
      this.customerPageRef.searchView();
    }
  }

}
