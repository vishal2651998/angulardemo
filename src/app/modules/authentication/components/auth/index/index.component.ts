import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { ThreadService } from 'src/app/services/thread/thread.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Constant } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public loading: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;
  public mobileBrowser: boolean = false;
  public headTitle: string = "Index";
  public showMobileMenu: boolean = false;
  public year = moment().year();
  public businessDomainData: any = [];
  public domainId: string = '1';
  public bodyClass:string = "auth-index";
  public bodyElem;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private threadApi: ThreadService,
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);

    this.route.params.subscribe( params => {
      this.domainId = params.id;
    });

    setTimeout(() => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        /* your code here */
        this.mobileBrowser = true;
      }
      else{
        this.mobileBrowser = false;
      }

      this.getIndexData();

    }, 100);

  }

  getIndexData(){
    if(this.domainId != ''){
      this.threadApi.getDomainMarketPlaceIndexData(this.domainId).subscribe((response) => {
        let businessDomainData = response.data.marketPlaceData;
        for (let i in businessDomainData) {
          if(businessDomainData[i].domainID == this.domainId){
            this.businessDomainData = businessDomainData[i].businessDomainData;
            this.businessDomainData.bannerImageUrl = this.businessDomainData.bannerImageUrl != null &&  this.businessDomainData.bannerImageUrl != '' ? this.businessDomainData.bannerImageUrl : '/assets/images/service-provider/inner-detail.jpg';
          }
        }
        this.loading = false;
      });
    }
  }

  redirectionPage(url,type){
    switch(type){
      case 'website':
        url = "https://"+url;
        //window.location.replace(url);
        window.open(url, url);
      break;
      case 'home':
        //url = "https://"+url;
        //window.location.replace(url);
        window.location.reload();
      break;
      case 'login':
        let redirectUrl = "/auth/login";
        if(this.domainId == '71'){
          redirectUrl = "/login-type";
        }
        this.router.navigate([redirectUrl]);
      break;
    }
  }
   goToLink(section: any) {
    this.showMobileMenu = false;
    if(section == 'home'){
      let redirectUrl = "/auth/login";
      if(this.domainId == '71'){
        redirectUrl = "/login-type";
      }
      this.router.navigate([redirectUrl]);
    }
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.loading = false;
  }

}
