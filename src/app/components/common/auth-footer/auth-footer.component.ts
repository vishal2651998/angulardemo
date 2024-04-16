import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pageInfo, Constant, PlatFormNames, PlatFormType,PlatFormDomains } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-auth-footer',
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss']
})
export class AuthFooterComponent implements OnInit {
  public year: number;
  public PlatFormDomainsNames:string='';
  public iosAppUrl='';
  public androidAppUrl='';
  public msTeamAccess: boolean = false;
  public domainId;
  constructor(private router: Router) { }
  ngOnInit(): void { 
    //console.log(this.router.url);
    let retrunUrlval = this.router.url;
    retrunUrlval = retrunUrlval.substring(1);
    let wordView = "integration";              
    //console.log(retrunUrlval);
    let integrationUrl = (retrunUrlval.indexOf(wordView) !== -1) ? true : false;
    //console.log((retrunUrlval.indexOf(wordView) !== -1));
    if(integrationUrl){
      this.msTeamAccess = true;
    }
    this.year = new Date().getFullYear();
    let platformId=localStorage.getItem('platformId');
    if(platformId!='1'){
      this.PlatFormDomainsNames=PlatFormNames.MahleForum;
      this.iosAppUrl='https://apps.apple.com/us/app/mss-mahle-forum/id1170395629';
      this.androidAppUrl='https://play.google.com/store/apps/details?id=com.collabtic.mahleforum';
    }
    else
    {
      this.PlatFormDomainsNames=PlatFormNames.Collabtic;
      this.iosAppUrl='https://apps.apple.com/us/app/collabtic-app/id1104653432';
      this.androidAppUrl='https://play.google.com/store/apps/details?id=com.fieldpulse.collabtic';
    }
    this.domainId = localStorage.getItem("domainId");
  }
}