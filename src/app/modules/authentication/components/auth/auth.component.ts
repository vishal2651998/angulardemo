import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Constant, IsOpenNewTab, windowHeight } from '../../../../common/constant/constant';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  public bodyClass:string = "auth";
  public bodyElem;
  public footerElem;
  public redirectUrl = "landing-page";
  public redirectUrlTeam = "threads";
  public userId: any = '0';
  public loading: boolean = true;
  public teamSystem = localStorage.getItem("teamSystem");

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {

    // check fieldpulse or not...
    let currentURL = window.location.href;
    let splittedURL1 = currentURL.split("://");
    let splittedURL2 = splittedURL1[1].split(".");
    let splittedDomainURL1 = splittedURL2[0];
    let splittedDomainURL2 = splittedURL2[1];
    let splittedDomainURL = splittedURL2[0];
    let splittedDomainURLLocal = splittedDomainURL.split(":");

    if( splittedDomainURL2 == 'fieldpulse' || splittedDomainURLLocal[0] == Constant.forumLocal ){ /* fieldpulse ms integration */  }
    //if( splittedDomainURL2 == 'fieldpulse'){ /* fieldpulse ms integration */  }
    else{
        /**
       * Determine the mobile operating system.
       * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
       *
       * @returns {String}
       */
      function getMobileOperatingSystem() {

        if(window.location.hostname === 'marketplace.collabtic.com')
        {
          return false;
        }

        if(window.location.hostname === 'atgtraining-stage.collabtic.com')
        {
          return false;
        }

        var userAgent = navigator.userAgent || navigator.vendor;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return "iOS";
        }

        return "unknown";
      }
      let redirectURL = "";
      let findMobile = getMobileOperatingSystem();
      switch(findMobile){
        case 'Android':
        case 'Windows Phone':
          redirectURL = Constant.androidStoreURL;
          window.location.href = redirectURL;
          break;
        case 'iOS':
          redirectURL = Constant.appStoreURL;
          window.location.href = redirectURL;
          break;
        default:
        break;
      }
    }

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.remove('parts-list');
    this.bodyElem.classList.add(this.bodyClass);

    this.userId = this.getQueryParamFromMalformedURL('userid');

    if(this.userId == '0'){
      if (this.authenticationService.userValue) {
        let teamSystem= localStorage.getItem('teamSystem');
        if(teamSystem){
          this.router.navigate([this.redirectUrlTeam]);
        }
        else{
          this.router.navigate([this.redirectUrl]);
        }
      }
      else{
        this.loading = false;
      }
    }
    else
    {
      this.loading = false;
    }

  }

  getQueryParamFromMalformedURL(userid) {
    const results = new RegExp('[\\?&]' + userid + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.loading = false;
  }

}
