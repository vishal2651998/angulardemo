import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { pageInfo, Constant,PlatFormNames,PlatFormType } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public countryId;
  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    let domainId = this.route.snapshot.params['domainId'];
    let userId = this.route.snapshot.params['uid'];
    let accessId = parseInt(this.route.snapshot.params['accessId']);
    let platformId = this.route.snapshot.params['platformId'];
    let workstreamId = this.route.snapshot.params['workstreamId'];
    
    this.countryId = localStorage.getItem('countryId');
    
    // url value set
    var setObj = {Userid: userId, domain_id: domainId, roleId: ''};

    this.authenticationService.UserSuccessData(setObj);
    

    let authFlag = ((domainId == 'undefined' || domainId == undefined) && (userId == 'undefined' || userId == undefined) ) ? false : true;
    let localDomainId = localStorage.getItem('domainId');
    let localUserId = localStorage.getItem('userId');

    //if (!authFlag && (localDomainId == null || localDomainId == 'undefined' || localDomainId == undefined) && (localUserId == null || localUserId == 'undefined' || localUserId == undefined)) {
      if (!authFlag) {
          this.router.navigate(['/auth']);
      } else {
      domainId = (authFlag) ? domainId : localDomainId;
      userId = (authFlag) ? userId : localUserId;
      //localStorage.clear();
      localStorage.setItem('domainId', domainId);
      localStorage.setItem('userId', userId);
      localStorage.setItem('platformId', platformId);
      if(platformId==PlatFormType.Collabtic)
      {
        localStorage.setItem('platformName', PlatFormNames.Collabtic);
      }
      else if(platformId==PlatFormType.MahleForum)
      {
        localStorage.setItem('platformName', PlatFormNames.MahleForum);
      }
      else if(platformId==PlatFormType.CbaForum)
      {
        localStorage.setItem('platformName', PlatFormNames.CbaForum);
      }
      else if(platformId==PlatFormType.KiaForum)
      {
        localStorage.setItem('platformName', PlatFormNames.KiaForum);
      }
      else
      {
        localStorage.setItem('platformName', PlatFormNames.Collabtic);
      }
   
      let redirectUrl;
      console.log(domainId+'::'+userId+'::'+accessId+'::'+workstreamId)
      localStorage.removeItem('loggedOut');
      switch (accessId) {
        
        case 1:
        case 2:
          redirectUrl = '/workstreams';
          let action = this.route.snapshot.params['action'];
          let actionId = this.route.snapshot.params['actionId'];
          if (action != 'undefined' && action != undefined && actionId != 'undefined' && actionId != undefined) {
            redirectUrl += '/' + action + '/' + actionId;
          }
          break;
        case 3:
          redirectUrl = '/media-manager';
          break;
        case 4:
          redirectUrl = '/product-matrix';
          break;
        case 5:
          redirectUrl = '/parts';
          this.setWorkstream(workstreamId);
          break;
        case 6:
          redirectUrl = '/user-dashboard';
          break;
        case 7:
          redirectUrl = '/escalations';
          let searchKey = this.route.snapshot.queryParams.searchKey;
          if (searchKey != 'undefined' || searchKey != undefined) {
            localStorage.setItem('escalationSearch', searchKey);
            localStorage.setItem('escInit', '1');
            localStorage.removeItem('escalationFilter');
          }
          break;
        case 10:
          redirectUrl = '/export-option';
          break;
        case 11:
          redirectUrl = '/landing-page';
          break;
        case 12:
          redirectUrl = '/chat-page';
          break;
        case 13:
          redirectUrl = '/workstreams-page';
          break;
        case 14:
          redirectUrl = '/threads';
          this.setWorkstream(workstreamId);
          break;
        case 15:
          redirectUrl = '/dashboard';
          break;
          case 16:
          redirectUrl = '/search-page';
          break;
        case 18:
          redirectUrl = '/ppfr';
          let searchKey1 = this.route.snapshot.queryParams.searchKey;
          if (searchKey1 != 'undefined' || searchKey1 != undefined) {
            localStorage.setItem('escalationPPFRSearch', searchKey1);
            localStorage.setItem('escInit', '1');
            localStorage.removeItem('escalationPPFRFilter');
          }
          break;
      }
      setTimeout(() => {
        this.router.navigate([redirectUrl]);  
      }, 100);
    }
  }

  // Setup Workstream
  setWorkstream(workstreamId) {
    if (workstreamId != 'undefined' || workstreamId != undefined) {
      localStorage.setItem('accessWorkstreamId', workstreamId);
    }
  }

}
