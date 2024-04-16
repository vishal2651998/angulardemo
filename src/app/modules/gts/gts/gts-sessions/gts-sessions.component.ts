import { Component, ViewChild, HostListener, OnInit } from "@angular/core";
import { Constant, IsOpenNewTab } from "src/app/common/constant/constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { GtsSessionsListComponent } from "src/app/components/common/gts-sessions-list/gts-sessions-list.component";

@Component({
  selector: 'app-gts-sessions',
  templateUrl: './gts-sessions.component.html',
  styleUrls: ['./gts-sessions.component.scss']
})
export class GtsSessionsComponent implements OnInit {
  gtsPageRef: GtsSessionsListComponent;
  public title: string = "GTS Sessions";
  public bodyClass: string = "gtssessions";
  public bodyClass1: string = "parts-list";
  public disableOptionCentering: boolean = false;
  public bodyElem;
  public pageLoading: boolean = true;
  public headerFlag: boolean = false;
  public headerData: Object;
  public headTitle: string = "gtssessions";
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
  public pageAccess: string = "gtssessions";
  public searchVal: string = "";
  public sessionId: string = '';

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
      this.sessionId = params.sessionid;
    });
    
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    
    this.headerData = {
      access: this.pageAccess,
      profile: false,
      welcomeProfile: true,
      search: false,
      searchVal: "",
    };


   
  }

  gtsCallback(data) {
    console.log(data);    
  }

  // Search
  /*applySearch(action, val) {
    if (action == "emit" && this.searchVal == '' && val == '') {
      
    } 
    else{
      this.searchVal = val;       
      this.customerPageRef.searchVal = val;
      this.customerPageRef.searchFlag = true;
      this.customerPageRef.searchView();
    }
  }*/

}

