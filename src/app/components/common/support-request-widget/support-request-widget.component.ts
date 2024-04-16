import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, ParamMap, Router, RouterEvent } from '@angular/router';
import { trigger, transition, style, sequence, animate } from '@angular/animations';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AccordionOptions } from 'src/app/models/customAccordion.model';
import { IsOpenNewTab, PlatFormType, RedirectionPage } from 'src/app/common/constant/constant';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { CommonService } from '../../../services/common/common.service';

declare var $: any;
declare var window: any;
@Component({
  selector: 'app-support-request-widget',
  templateUrl: './support-request-widget.component.html',
  styleUrls: ['./support-request-widget.component.scss'],
  animations: [
    trigger('anim', [
      transition('* => void', [
        style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }),
        sequence([
          animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none' }))
        ])
      ]),
      transition('void => active', [
        style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
        sequence([
          animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }))
        ])
      ])
    ])
  ]
})
export class SupportRequestWidgetComponent implements OnInit {

  public accordionConfig: AccordionOptions = null;
  public options;
  public userId;
  public roleId;
  public countryId;
  public domainId;
  public CBADomain: boolean = false;
  public user: any;
  public scrollTop: number = 0;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private commonApi: CommonService,
  ) { }

  ngOnInit(): void {
    var landingpage_attr7 = localStorage.getItem('landingpage_attr7');
    this.options = JSON.parse(landingpage_attr7);
    this.accordionConfig = {
      wrapperClass: this.options.shortName,
      title: this.options.placeholder,
      imageClass: this.options.imageClass,
      isFirstSelected: this.options.isExpand,
      imageUrl: this.options.imageUrl
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.roleId = this.user.roleId;

    let platformId1 = localStorage.getItem("platformId");
    if (platformId1 == PlatFormType.CbaForum) {      
      this.CBADomain = true;
    } 

  }

  navigateTosupportPage(id) {
    let threadVal;
    switch(id) {
      case 1:
        window.open("threads/manage", IsOpenNewTab.openNewTab);
        break;
      case 2:
        threadVal = localStorage.getItem('yourThreadsValue');
        localStorage.removeItem('yourStoreThreadsValue');
        localStorage.setItem('yourThreadsValue','1');
        if (!threadVal || !window.threadsPage || window.threadsPage.closed) {
          window.threadsPage=window.open("threads",'_blank' +"threads");
        } else {
          window.threadsPage.focus();
        }
        //window.open("threads", IsOpenNewTab.openNewTab);
        //var aurl = 'workstreams-page';
        //this.router.navigate([aurl]);
        break;
      case 3:
        if (!window.documentsPage || window.documentsPage.closed) {
          window.documentsPage=window.open("documents",'_blank' +"documents");
        } else{
          window.documentsPage.focus();
        }
        //var aurl = 'documents';
        // this.router.navigate([aurl]);
        break;  
      case 4:
        threadVal = localStorage.getItem('yourStoreThreadsValue');
        localStorage.removeItem('yourThreadsValue');
        localStorage.setItem('yourStoreThreadsValue','1');
        if (!threadVal || !window.threadsPage || window.threadsPage.closed) {
          window.threadsPage=window.open("threads",'_blank' +"threads");
        } else {
          window.threadsPage.focus();
        }
        //window.open("threads", IsOpenNewTab.openNewTab);
        //var aurl = 'workstreams-page';
        //this.router.navigate([aurl]);
        break;
      case 5:
        let storeNo= localStorage.getItem("storeNo");
        if(storeNo == null || storeNo == undefined) {
        } else {
          let navFrom = this.commonApi.splitCurrUrl(this.router.url);
          let wsFlag: any = (navFrom == ' shops') ? false : true;
          let scrollTop:any = this.scrollTop;
          this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
          console.log(id);
          let url = "shops/view/"+storeNo;
          this.router.navigate([url]);
          //window.open("shops/view/"+storeNo, IsOpenNewTab.openNewTab);
        }
        break;  
      case 6:
        let faqNavUrl = RedirectionPage.faq;
        this.router.navigate([faqNavUrl]);
        break;   
    }    
  }
}
