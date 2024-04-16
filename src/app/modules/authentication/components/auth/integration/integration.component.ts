import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PlatFormNames, PlatFormType } from 'src/app/common/constant/constant';
import { AppService } from 'src/app/modules/base/app.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {
  pageInfo,
  Constant
  
} from "src/app/common/constant/constant";

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {
  profile!: ProfileType;
  isIframe = false;
  loginDisplay = false;
  public knowledgeBoydForum:boolean=false;
  public repairifySSOForum:boolean=false;
  public CBAForum:boolean=false;
  
  private readonly _destroying$ = new Subject<void>();
  public loading: boolean = true;
  public bodyHeight: number;
  public innerHeight: number;
  //redirectUrl: string = "landing-page";
  redirectUrl: string = "threads";

  constructor(
    private titleService: Title,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private baseSerivce: BaseService,
    private authenticationService: AuthenticationService,
    private appService: AppService,
    private router: Router
  ) { this.titleService.setTitle('Collabtic - Integration'); }

  ngOnInit(): void {

    if(window.location.host==Constant.knowledgeForumHostName)
  {
    this.knowledgeBoydForum=true;
    localStorage.removeItem("teamSystem");
  }
  else if(window.location.host==Constant.repairifyForumHostName)
  {
    this.knowledgeBoydForum=false;
    this.repairifySSOForum=true;
    localStorage.removeItem("teamSystem");
  }
  else if(window.location.host==Constant.cbatacbetaForumHostName || window.location.host==Constant.cbatacForumHostName)
  {
    this.CBAForum=true;
    localStorage.removeItem("teamSystem");
  }
  else
  {
    localStorage.setItem('teamSystem', "true");
    this.isIframe = window !== window.parent && !window.opener;
    this.authService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult) => {
        console.log(result)
      },
      error: (error) => console.log(error)
    });
    this.msalBroadcastService.inProgress$
      .pipe(
       
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe((result) => {
        console.log(result)
       
          this.loading = true;
          this.setLoginDisplay();
      
        
      }
      
      );
      localStorage.removeItem('loggedOut');
  }
   
   
   

    this.loading = false;
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

  }
  loginBoyd()
  {
    window.open('sso/index.php?sso', '_self');
  }


  loginRepairifySSO()
  {
    window.open('repairifysso/index.php?sso', '_self');
  }

  
  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = this.bodyHeight;
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    if (this.loginDisplay) {
      this.http.get(GRAPH_ENDPOINT)
        .subscribe(profile => {
          this.profile = profile;
          this.registerProfile(this.profile);
        });
    }
    else
    {
      this.loading = false;
    }
  }

  registerProfile(profileInfo: any) {
    
      const apiFormData = new FormData();
      apiFormData.append('apiKey', this.appService.appData.apiKey);
      apiFormData.append('displayName', profileInfo.displayName);
      apiFormData.append('givenName', profileInfo.givenName);
      apiFormData.append('id', profileInfo.id);
      apiFormData.append('mail', profileInfo.mail);
      apiFormData.append('surname', profileInfo.surname);
      apiFormData.append('userPrincipalName', profileInfo.userPrincipalName);
      this.baseSerivce.postFormData("accounts", "MSteamSSO", apiFormData).subscribe((response: any) => {
        this.loading = false;
        this.authenticationService.UserSuccessData(response);
        localStorage.setItem('userId', response.Userid);
        let platformId = '1';
       // localStorage.setItem('platformId', platformId);
        if (platformId == PlatFormType.Collabtic) {
          localStorage.setItem('platformName', PlatFormNames.Collabtic);
        }
        else if (platformId == PlatFormType.MahleForum) {
          localStorage.setItem('platformName', PlatFormNames.MahleForum);
        }
        else if (platformId == PlatFormType.CbaForum) {
          localStorage.setItem('platformName', PlatFormNames.CbaForum);
        }
        else if (platformId == PlatFormType.KiaForum) {
          localStorage.setItem('platformName', PlatFormNames.KiaForum);
        }
        else {
          localStorage.setItem('platformName', PlatFormNames.Collabtic);
        }
        localStorage.setItem('teamSystem', "true");
        this.router.navigate([this.redirectUrl]);
      });
   
    
  }

  login() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
    else
{
  /*
  if (this.msalGuardConfig.authRequest) {
    this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
  } else {
    this.authService.loginRedirect();
  }
  */
 
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
    
  }
  
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
