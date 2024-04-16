import { Component,Renderer2, ElementRef, ViewChild,Inject  } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import {
  pageInfo,
  Constant,
  PlatFormType,
  PlatFormNames,
  loginActivity
} from "src/app/common/constant/constant";
import "hammerjs";
import { Title } from "@angular/platform-browser";
import { NotificationService } from './services/notification/notification.service';
import { Router, NavigationEnd } from '@angular/router';
import { CallsService } from './controller/calls.service';
import { ThemeService } from './services/theme.service';
import { CommonService } from "./services/common/common.service";
import { AuthenticationService } from "./services/authentication/authentication.service";
import { ApiService } from './services/api/api.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { LocalStorageItem } from 'src/app/common/constant/constant';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  isMicOn: boolean = false;
  testing = [1];
  platformId: string;
  PlatFormName: string;
  maper: any = {
    threads: "Threads",
    documents: "Tech Info",
    gts: "GTS",
    knowledgearticles: "Knowledge Articles",
    parts: "Parts",
    inventory: "Inventory",
    "workstreams-page": "Workstream",
  };
  @ViewChild("publisherDiv") publisherDiv: ElementRef;

  constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document,private titleService: Title, public call: CallsService, public notification: NotificationService, private router: Router, private themeService: ThemeService,public sharedSvc: CommonService,private authenticationService: AuthenticationService,private dashboardService: DashboardService,private apiService: ApiService) {
    this.titleService.setTitle(PlatFormNames.Collabtic);
    //this.titleService.setTitle(PlatFormNames.MahleForum);
    //this.titleService.setTitle(PlatFormNames.Tvs);
    //this.titleService.setTitle(PlatFormNames.CbaForum);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // do whatever you want
        // console.log('Hidden');
      }
      else {
        // do whatever you want
        if (this.notification.visibility) {
          this.notification.visibility.next(true);
          setTimeout(() => {
            this.notification.visibility.next(false);
          }, 5000);
        }
      }
    });

    // Collabtic setup
    this.platformId = PlatFormType.Collabtic;
    this.PlatFormName = PlatFormNames.Collabtic;

    // Mahle setup
    //this.platformId = PlatFormType.MahleForum;
    //this.PlatFormName = PlatFormNames.MahleForum;
    //this.PlatFormName = PlatFormNames.Tvs;

    // CBA setup
    //this.platformId = PlatFormType.CbaForum;
    //this.PlatFormName = PlatFormNames.CbaForum;

    const platform: any = this.platformId;
    this.themeService.attachTheme(platform);
  }

  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  ngOnInit(): void {
    const script = this._renderer2.createElement('script');
    script.id = 'velox';
    script.src = 'https://velox.transactiongateway.com/token/Collect.js';
    if (this.platformId == '1') {
      if (window.location.host == 'repairify.collabtic.com' || window.location.host == 'repairify-stage.collabtic.com' || window.location.host == 'atgtraining-stage.collabtic.com' || window.location.host == 'repairifysso.collabtic.com') {
        // Repairify Token

        script.setAttribute('data-tokenization-key', environment.paymentKeys.atg);

      }
      else {
        // MarketPlace Collabtic Token

        script.setAttribute('data-tokenization-key', environment.paymentKeys.collabtic);
      }
      this._renderer2.appendChild(this._document.body, script);
    }

    localStorage.setItem('platformId', this.platformId);
    localStorage.setItem('platformName', this.PlatFormName);

    this.changeIcon();
    // user activity start
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      let user : any;
      let currUrl = this.router.url.split('/');
      let type = "View";
      let urlLen = currUrl.length;
      if(urlLen>2){
        if(currUrl[2] == 'manage' && currUrl[3]== undefined){
          type = "Create";
        }
        /*if(currUrl[3]!= undefined && currUrl[3] =='edit'){
          type = "Edit";
        }*/
      }
      user = this.authenticationService.userValue;
      if(user != null){
        let currUrl = event.url.split('/');
        let navFrom = currUrl[1];
        let contentTypeId = "";
        let countryId = localStorage.getItem('countryId');
        let domain_id = user.domain_id;
        let user_id = user.Userid;
        let roleId = user.roleId;
        let tvsFlag = (this.platformId == '2' && domain_id == 52) ? true : false;
        if(this.apiService.enableAccessLevel){
          let apiData = {
            'apiKey': Constant.ApiKey,
            'userId': user_id,
            'domainId': domain_id,
            'roleId': roleId,
            'adminPage' : 0
          };
          this.dashboardService.getRolesAndPermissions(apiData).subscribe((roles) => {
            localStorage.setItem('param',JSON.stringify(roles));
            let rolesData = roles;
            if(rolesData){
              let filtered = rolesData.items.find(
                (item) => item.name == this.maper[currUrl[1]]
              );
              if (filtered !== undefined) {
                let newFiltered = filtered?.pageAccess.find(
                (item) => item.name == type
                );
                let permission = newFiltered?.roles?.find(
                (role) => role.id == roleId
                );
                console.log(type);
                console.log(this.maper[currUrl[1]]);
                console.log(permission?.access);
                if(permission?.access == 0){
                  this.router.navigate(["/no-permission"]);
                  return false;
                }
              }
            }
          });
        }
        if(tvsFlag){
          setTimeout(() => {
            switch(navFrom){
              case 'threads':
                contentTypeId = loginActivity.threadsPage;
                break;
              case 'documents':
                contentTypeId = loginActivity.documentPage;
                break;
              case 'parts':
                contentTypeId = loginActivity.partsPage;
                break;
              case 'gts':
                contentTypeId = loginActivity.gtsPage;
                break;
              case 'sib':
                contentTypeId = loginActivity.sibPage;
                break;
              case 'workstreams-page':
                contentTypeId = loginActivity.workstreamsPage;
                break;
              default:
                contentTypeId = "";
                break;
            }
            let data = {
              apikey : Constant.ApiKey,
              domain_id : domain_id,
              user_id : user_id,
              contentTypeId : contentTypeId,
              countryId : countryId,
            }
            this.sharedSvc.getPageAction(data).subscribe((response) => {
              console.log(response)
            });
          },2000);
        }
      }
    });
// user activity end
  }

  changeIcon() {
    let favUrl = "favicon.ico";
    this.favIcon.href = favUrl;
  }
}

window.onbeforeunload = function () {
  return "Do you really want to close?";
};
