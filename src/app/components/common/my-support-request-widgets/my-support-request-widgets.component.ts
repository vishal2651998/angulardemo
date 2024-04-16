import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { trigger, transition, style, animate,sequence } from '@angular/animations';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { pageInfo, windowHeight, threadBulbStatusText, Constant, PlatFormType, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, forumPageAccess, MediaTypeInfo, DocfileExtensionTypes, IsOpenNewTab } from 'src/app/common/constant/constant';

declare var window: any;
import * as moment from 'moment';
declare var $:any;

@Component({
  selector: 'app-my-support-request-widgets',
  templateUrl: './my-support-request-widgets.component.html',
  styleUrls: ['./my-support-request-widgets.component.scss'],
  animations: [
    trigger('anim', [
       transition('* => void', [
         style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
         sequence([
           animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
           animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none'  }))
         ])
       ]),
       transition('void => active', [
         style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
         sequence([
           animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
           animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'  }))
         ])
       ])
   ])
  ]
})
export class MySupportRequestWidgetsComponent implements OnInit {

  public expandplus;
public teamSystem=localStorage.getItem('teamSystem');
public expandminus;
public optionsval;
public expandminus1;
public countryId;
public domainId;
public user: any;
public userId;
public apiData: Object;
public roleId;
public noescText:string=''
public landingrecentViews=[];
public loadingMythreads:boolean=false;
public norecentViews:boolean=false;
public norecentviewsText='';
public newThreadView: boolean = false;
public recentviewedseemore:boolean=false;
public collabticDomain: boolean = false;
  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
      var setdata= JSON.parse(JSON.stringify(r));

      var checkpushtype=setdata.pushType;
      //alert(checkpushtype);
      if(checkpushtype==3)
      {
        if(this.landingrecentViews.length>8)
        {
          this.landingrecentViews.splice(-1, 1);
        }
     // this.landingrecentViews=[];

     // this.recentviewedseemore=true;
     // this.getrecentViews(1);
      }

    });
    var landingpage_attr3=localStorage.getItem('landingpage_attr8');
    this.optionsval=JSON.parse(landingpage_attr3);

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let platformId: any = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'limit': 9,
      'offset': 0

    }
    this.apiData = apiInfo;
    //this.optionsval=this.parentData;

    this.getrecentViews('');
  }
  getrecentViews(limitvalue)
  {
    if(limitvalue)
    {
      this.apiData['limit']=1;

    }
    else
    {
      this.recentviewedseemore=false;
    }

    const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit', this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);
  apiFormData.append('type', "2");  // my support request

  this.LandingpagewidgetsAPI.GetRecentViews(apiFormData).subscribe((response) => {
   let recentviewStatus= response.status;
   let recentviewtotal= response.total;
   this.loadingMythreads=false;
   if(recentviewtotal>0)
   {
this.norecentViews=false;
   }
   else
   {
this.norecentViews=true;
this.norecentviewsText=response.result;
   }

   let recentViewsArr= response.recentViews;
   if(recentviewtotal)
   {
    this.recentviewedseemore=true;
    for (let rcv in recentViewsArr)
        {
         let recentValuearr= recentViewsArr[rcv];
         let rtypeId=recentValuearr.typeId;
         let rthreadId=recentValuearr.threadId;

         let rmake=recentValuearr.make;
         let rmodel=recentValuearr.model;
         //let rtitle=recentValuearr.title;
         let rtitle= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(recentValuearr.title));
         let rpartNo=recentValuearr.partNo;
         let rpartName=recentValuearr.partName;
         let rbannerImg=recentValuearr.bannerImg;
         let risDefault=recentValuearr.isDefault;
         let rcreatedOn=recentValuearr.createdOn;
         let rcontentType=recentValuearr.contentType;
         let rTextBgColor=recentValuearr.TextBgColor;
         let createdOnDate = moment.utc(rcreatedOn).toDate();
          let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');
          if(limitvalue)
          {
            this.landingrecentViews.unshift({
              typeId:rtypeId,
              threadId:rthreadId,
              make:rmake,
              model:rmodel,
              title:rtitle,
              partNo:rpartNo,
              partName:rpartName,
              bannerImg:rbannerImg,
              isDefault:risDefault,
              createdOn:localcreatedOnDate,
              contentType:rcontentType,
              textBgColor:rTextBgColor,
              state: 'active'



            })
          }
          else
          {
            this.landingrecentViews.push({
              typeId:rtypeId,
              threadId:rthreadId,
              make:rmake,
              model:rmodel,
              title:rtitle,
              partNo:rpartNo,
              partName:rpartName,
              bannerImg:rbannerImg,
              isDefault:risDefault,
              createdOn:localcreatedOnDate,
              contentType:rcontentType,
              textBgColor:rTextBgColor,
              state: 'active'



            })
          }


        }

    // alert(recentviewtotal);
   }
   else

   {
    this.recentviewedseemore=false;
   }
    //console.log();
  });
}

navigateTosupportPage(event,id) {
  if(id==1)
  {
    window.open("threads/manage", IsOpenNewTab.openNewTab);
  }
  if(id==2)
  {
    localStorage.setItem('yourThreadsValue','1');
    let threadStatusValue='{"make":[],"model":"","year":[],"threadStatus":["New","Pending - Open","In-Progress - Open","Proposed Fix - Open","Fixed - Open","Possible Fix - Open"],"otherUsers":[],"otherUserItems":[],"workstream":[],"tags":[],"tagItems":[],"errorCode":[],"startDate":"","endDate":"","reset":false,"action":"get","threadViewType":"thumb","filterrecords":true}';
    localStorage.setItem('threadFilter',threadStatusValue);
    if (!window.threadsPage || window.threadsPage.closed)
    {
      window.threadsPage=window.open("threads",'_blank' +"threads");

    }
    else
    {
      window.threadsPage.focus();
    }
   //window.open("threads", IsOpenNewTab.openNewTab);
    //var aurl = 'workstreams-page';
    //this.router.navigate([aurl]);
  }
  if(id==3)
  {

    if (!window.documentsPage || window.documentsPage.closed)
    {
      window.documentsPage=window.open("documents",'_blank' +"documents");

    }
    else
    {
      window.documentsPage.focus();
    }
    //var aurl = 'documents';
   // this.router.navigate([aurl]);

  }

  event.stopPropagation();

}
recentViewClick(event,typeId: any,Id)
  {
    console.log(typeId)
    let flag: any = true;
    let secElement = document.getElementById('homeSec');
    setTimeout(() => {
      let scrollTop = secElement.offsetTop;
      scrollTop = 530;
      this.sharedSvc.setlocalStorageItem('homeScroll', scrollTop);
    }, 50);
    this.sharedSvc.setlocalStorageItem('landingRecentNav', flag);
    //localStorage.setItem('landingRecentNav', flag);
    let url: any = '', navFlag = false;
    typeId = parseInt(typeId);
    switch(typeId) {
      case 2:
        navFlag = true;
        let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
        let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
        url = `${view}${Id}`;
        break;
      case 4:
        /*navFlag = true;
        url = `${forumPageAccess.documentViewPage}${Id}`;
        setTimeout(() => {
          this.sharedSvc.emitRightPanelOpenCallData(true);
        }, 100);*/
        this.authenticationService.openPOPUPDetailView(typeId,Id);
        break;
      case 6:
      case 11:
        navFlag = true;
        url = `${forumPageAccess.partsViewPage}${Id}`;
        break;
      case 7:
        //url = `${forumPageAccess.knowledgeArticlePageNew}${Id}`;
        this.authenticationService.openPOPUPDetailView(typeId,Id);
        break;
      case 8:
        navFlag = true;
        url = `${forumPageAccess.gtsViewPage}${Id}`;
        break;
      case 28:
        navFlag = true;
        url = `${forumPageAccess.kbViewPage}${Id}`;
        break;
      case 30:
        navFlag = true;
        url = `${forumPageAccess.sibViewPage}${Id}`;
        break;
    }
    if(navFlag){
      setTimeout(() => {
        this.router.navigate([url]);
      }, 50);
    }
  }
  onTabClose3(event) {
    //alert(1);
        this.expandplus=event.index;
        $('.minusone3'+this.expandplus+'').removeClass('hide');
        $('.minusone3'+this.expandplus+'').addClass('showinline');
        $('.plusone3'+this.expandplus+'').addClass('hide');
        $('.plusone3'+this.expandplus+'').removeClass('showinline');


        //this.expandminusFlag=false;
        //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
    }

    onTabOpen3(event) {
      //alert(2);

      this.expandminus=event.index;
      $('.minusone3'+this.expandminus+'').addClass('hide');
      $('.minusone3'+this.expandminus+'').removeClass('showinline');
      $('.plusone3'+this.expandminus+'').removeClass('hide');
      $('.plusone3'+this.expandminus+'').addClass('showinline');
      this.expandplus=2222;


       // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
    }

}
