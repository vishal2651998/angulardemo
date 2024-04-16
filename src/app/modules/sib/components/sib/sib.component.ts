import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ScrollTopService } from 'src/app/services/scroll-top.service';

@Component({
  selector: 'app-sib',
  templateUrl: './sib.component.html',
  styleUrls: ['./sib.component.scss']
})
export class SibComponent implements OnInit, OnDestroy {
  public bodyClass:any = "sib";
  public bodyElem;
  public footerElem;
  public platformId: number = 0;
  public domainId;
  public userId;
  public tvsFlag: boolean = false;
  public user: any;

  constructor(
    private scrollTopService: ScrollTopService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    let forbiddenFlag = false;
    if(authFlag) {
      let platformId = localStorage.getItem('platformId');
      this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
      this.tvsFlag = (this.platformId == 2 && this.domainId == 52) ? true : false;
      forbiddenFlag = !this.tvsFlag;
    }

    if(forbiddenFlag) {
      this.router.navigate(['/forbidden']);
    }
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.footerElem.classList.remove("sidebar");
    this.footerElem.classList.remove("sidebar-active");
  }

}
