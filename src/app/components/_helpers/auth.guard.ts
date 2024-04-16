import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Constant } from "src/app/common/constant/constant";
import { ApiService } from '../../services/api/api.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // accessLevel : any = ['threads'];
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiKey: string = Constant.ApiKey;
  public platformId=localStorage.getItem('platformId');
  rolesData: any = [];
  maper: any = {
    threads: "Threads",
    documents: "Tech Info",
    gts: "GTS",
    knowledgearticles: "Knowledge Articles",
    parts: "Parts",
    inventory: "Inventory",
    "workstreams-page": "Workstream",
  };
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;    
    if (user) {
      this.apiService.threadViewPublicPage = false;
      this.roleId = user['roleId'];
      this.rolesData = JSON.parse(localStorage.getItem("param"));
      // logged in so return true
      let currUrl = state.url.split('/');
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
      if(this.apiService.enableAccessLevel){
        if(this.rolesData){
         
          
          console.log(this.rolesData.items,this.maper[route.routeConfig.path]);
          let filtered = this.rolesData.items.find(
           
            (item) => 
            
           // item.slugName == this.maper[route.routeConfig.path]
           // item.slugName == this.maper[route.routeConfig.path]
            item.slugName == currUrl[1]
        
            );
          if (filtered !== undefined) {
            let newFiltered = filtered?.pageAccess.find(
              (item) => item.name == type
            );
            let permission = newFiltered?.roles?.find(
              (role) => role.id == this.roleId
            );
            console.log(permission);
            if (permission?.access == 0) {
              return this.router.navigate(["/no-permission"]);            
            } else {
              /*if (platformId != "1") {
                let returnVal = this.authenticationService.checkDomain();
                return returnVal;
              } else {*/
              return true;
              /*}*/
            }
          } else {
            /*if (platformId != "1") {
              let returnVal = this.authenticationService.checkDomain();
              return returnVal;
            } else {*/
              return true;
          /* }*/
          }
        } else {
          /*if (platformId != "1") {
            let returnVal = this.authenticationService.checkDomain();
            return returnVal;
          } else {*/
            return true;
          /*}*/
        }
      }
      else{
        return true;
      }
    }
     
    
    if(window.location.host=='tac-beta.cbaconnect.com')
    {
      window.open('sso/index.php?sso', '_self');
    }
    if(window.location.host=='tac.cbaconnect.com')
    {
      window.open('sso/index.php?sso', '_self');
    }
    
        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
        let authteam = '';
        if (window.location.host == Constant.knowledgeForumHostName) {
            authteam = '1';
        }
        else {
            authteam = localStorage.getItem('teamSystem');
        }

        if (authteam) {
            this.router.navigate(['auth/integration']);
        }
        else {
            this.router.navigate(['auth']);
        }
        return false;
    }
}