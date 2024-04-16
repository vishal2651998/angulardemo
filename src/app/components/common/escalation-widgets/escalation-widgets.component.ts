import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import * as moment from 'moment';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant, forumPageAccess, PlatFormType } from '../../../common/constant/constant';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare var $:any;
@Component({
  selector: 'app-escalation-widgets',
  templateUrl: './escalation-widgets.component.html',
  styleUrls: ['./escalation-widgets.component.scss']
})
export class EscalationWidgetsComponent implements OnInit {
  @ViewChild('ttescalation') tooltip: NgbTooltip;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public expandplus;
  public expandminus;
  public optionsval;
  public expandminus1;
  public domainId;
  public limit;
  public countryId;
  public escalationCount;
  public userId;
  public collabticDomain: boolean = false;
  public loadingesc:boolean=true;
  public escseemore:boolean=false;
  public noescalation:boolean=false;
  public newThreadView: boolean = false;
  public roleId;
  public landingescalations=[];
  public apiData: Object;
  public escTotal;
  public noescText:string='';
  public user: any;

  public ehelpContentId = '';
  public ehelpContentTitle = '';
  public ehelpContentContent = '';
  public ehelpContentIconName = '';
  public ehelpContentStatus= '';
  public ehelpContentFlagStatus:boolean = false;
  public tooltipFlag: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccess: boolean = false;
  public newPageAccess: boolean = false;
  public innerHeight: number = 0;
  public bodyHeight: number;

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public lazyLoading: boolean = false;
  public announcementTotal: number;

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if(this.newPageAccess){
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-(this.itemOffset*8);
      this.scrollTop = event.target.scrollTop-60;
      if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (inHeight >= totalHeight && this.scrollCallback && this.announcementTotal > this.itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          if(this.domainId == 52){
            this.getEscalationByLevels();
          }
          else{
            this.getEscalationwidgets();
          }
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  // Resize Window
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }


  constructor(
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private CommonServiceAPI: CommonService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {

    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }


    let retrunUrlval = (this.router.url );
    let wordView = 'escalation-tvs';
    let wordView1 = 'escalation';
    let viewUrl = (retrunUrlval.indexOf(wordView) !== -1) ? true : false;
    let viewUrl1 = (retrunUrlval.indexOf(wordView1) !== -1) ? true : false;

    console.log(viewUrl);

    this.bodyHeight = window.innerHeight;
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    let platformId: any = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;

    if(viewUrl){
      this.newPageAccess = true;
    }
    else if(viewUrl1){
      this.newPageAccess = true;
      this.escseemore = false;
    }
    else{
      this.newPageAccess = false;

    }


    this.CommonServiceAPI._OnMessageReceivedSubject.subscribe((response) => {
      var setdata = JSON.parse(JSON.stringify(response));
      var checkpushtype = setdata.pushType;
      var checkmessageType = setdata.messageType;
      console.log('message received! ####', response);


      //alert(checkpushtype+'--'+checkmessageType);
      if (checkpushtype == 6) {
        //this.getFilterWidgets();
        this.loadingesc=true;
        this.getEscalationwidgets();
        // this.landingrecentViews=[];
      }
      //let jsonParseData= JSON.parse(r);
      //console.log(jsonParseData.data);
      // this._receivedMessages.push(r);
      //  this.landingannouncements=[];
      // this.loadingann=true;
      // this.getAnnouncementwidgets();
    });

     // help content check
     this.CommonServiceAPI.helpContentReceivedSubject.subscribe((response) => {
      let helpContentName = response['helpContentName'];
      if(helpContentName == 'escalation'){
        this.tooltip.open();
      }
    });

    this.CommonServiceAPI.escalationLevelDataReceivedSubject.subscribe((response) => {
      //alert(response);
      this.landingescalations=[];
      this.itemOffset = 0;
      this.apiData['searchKey'] = response;
      this.loadingesc=true;

      if(this.domainId == 52){
        this.getEscalationByLevels();
      }
      else{
        this.getEscalationwidgets();
      }


    });


    var landingpage_attr1=localStorage.getItem('landingpage_attr2');
    this.optionsval=JSON.parse(landingpage_attr1);

    console.log(this.optionsval);
    //this.optionsval=this.parentData;

    let toolTips = this.optionsval.toolTips;
    console.log(toolTips);
    this.tooltipFlag = (toolTips == undefined || toolTips == 'undefined' || toolTips == 'null' || toolTips == null) ? false : true;
    console.log(this.tooltipFlag);
    this.ehelpContentId = '';
    this.ehelpContentTitle = '';
    this.ehelpContentContent = '';
    this.ehelpContentIconName = '';
    this.ehelpContentStatus = '';
     if(this.tooltipFlag && !this.msTeamAccess){
      if(toolTips.length>0){
        let helpContent = toolTips[0];
        this.ehelpContentStatus = helpContent['viewStatus'];
        this.ehelpContentFlagStatus = (this.ehelpContentStatus == '0') ? true : false;
        if(this.ehelpContentFlagStatus){
          this.ehelpContentId = helpContent['id'];
          this.ehelpContentTitle = helpContent['title'];
          this.ehelpContentContent = helpContent['content'];
          this.ehelpContentIconName = helpContent['itemClass'];
        }
      }
    }

    setTimeout(() => {
      if(this.tooltipFlag && !this.msTeamAccess){
          if(this.ehelpContentStatus == '0'){
            let tname = localStorage.getItem('helpContentName');
            if(tname == 'escalation'){
              this.tooltip.open();
            }
          }
          if(this.ehelpContentStatus == '1'){
            localStorage.removeItem('helpContentName');
            localStorage.removeItem('welcomePopupDisplay');
          }
      }
    }, 3500);

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    if(this.domainId==52)
    {
      this.limit=6;
    }
    else
    {
      this.limit=3;
    }

    this.countryId = localStorage.getItem('countryId');

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'escalationType': 1,
      'limit': this.limit,
      'offset': 0
    }
    this.apiData = apiInfo;
    if(this.domainId==52)
    {
      this.getEscalationByLevels();
    }
    else
    {
      this.getEscalationwidgets();
    }

    setTimeout(() => {
      this.setScreenHeight();
    }, 1000);
  }


  getEscalationByLevels()
  {

    console.log(this.apiData['limit']);
    if(this.newPageAccess){
      this.apiData['limit'] = this.itemLimit;
      this.apiData['offset'] = this.itemOffset;
    }

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('escalationType', this.apiData['escalationType']);
    apiFormData.append('myEsc', '1');
    apiFormData.append('availabilityCheck', '1');
    if(this.apiData['searchKey']) {
      apiFormData.append('searchKey', this.apiData['searchKey']);
    }


    this.LandingpagewidgetsAPI.GetEscalationsByLevels(apiFormData).subscribe((response) => {

    let rstatus=response.status;
    let rresult=response.result;
    let rsdata=response.data;
    let rstotal=rsdata.total;
    this.announcementTotal = rstotal;
    let rsescalationCount=response.escalationCount;
    if(this.apiData['domainId']==4)
    {
      this.escalationCount=rsescalationCount;
    }
    else
    {
      this.escalationCount='';
    }
    if(rstotal==0 && this.domainId!=4)
    {
      this.loadingesc=false;
      this.noescText=rresult;
      this.noescalation=true;

    }
    else
    {
      this.noescalation=false;
    }
    this.escTotal=rstotal;
    if(rstotal>3)
    {
  this.escseemore=true;
  this.escalationCount=rstotal;
    }

    let rsthreaddata=rsdata.threads;
    //alert(rstotal);
    if(rstatus=='Success')
    {
      if(rstotal>0)
      {

        if(this.newPageAccess){
          this.scrollCallback = true;
          this.scrollInit = 1;


          this.itemLength += this.itemLimit;
          this.itemOffset += this.itemLimit;
        }


        for (let esc in rsthreaddata)
        {

          let edeadlineDate=rsthreaddata[esc].deadlineDate;
          let ethreadId=rsthreaddata[esc].thread_id;
          let epostId=rsthreaddata[esc].postId;
          let euserId=rsthreaddata[esc].userId;
          let eprofileImage=rsthreaddata[esc].profileImage;
          let estageName=rsthreaddata[esc].stageName;
          let eavailability=rsthreaddata[esc].availability;
          let emake=rsthreaddata[esc].genericProductName;
          let emodel=rsthreaddata[esc].model;
          let eyear=rsthreaddata[esc].year;
          let ethreadTitle=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(rsthreaddata[esc].thread_title));
          //let ethreadTitle=rsthreaddata[esc].thread_title;
          let edescription=rsthreaddata[esc].description;
          let eescalatedType=rsthreaddata[esc].escalated_type;
          let bgColor=rsthreaddata[esc].bgColor;
          let colorCode=rsthreaddata[esc].ColorCode;

          let ebannerImage=rsthreaddata[esc].bannerImage;
          let ecreatedOnMobile=rsthreaddata[esc].createdOnMobile;

          let createdOnDate = moment.utc(ecreatedOnMobile).toDate();
          let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');

          //let updatedOnDate = moment.utc(announce_updatedOnMobile).toDate();
          //let localupdatedOnDate = moment(updatedOnDate).local().format('MMM DD, YYYY h:mm A');


          this.landingescalations.push({
            threadId:ethreadId,
            deadlineDate:edeadlineDate,
            postId:epostId,
            userId:euserId,
            profileImage:eprofileImage,
            stageName:estageName,
            make:emake,
            model:emodel,
            year:eyear,
            threadTitle:ethreadTitle,
            description:edescription,
            escalatedType:eescalatedType,
            bgColor:bgColor,
            colorCode:colorCode,

            bannerImage:ebannerImage,
           createdOn:localcreatedOnDate,


          })
        }
        //alert(rsthreaddata.length);
        this.loadingesc=false;
        this.lazyLoading = false;
      }
      else
      {
        this.loadingesc=false;
        this.lazyLoading = false;
      }


    }
    else
    {
      this.loadingesc=false;
      this.lazyLoading = false;
    }


  });




  }


  getEscalationwidgets()
  {

    console.log(this.apiData['limit']);
    if(this.newPageAccess){
      this.apiData['limit'] = this.itemLimit;
      this.apiData['offset'] = this.itemOffset;
    }
    const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit', this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);
  apiFormData.append('escalationType', this.apiData['escalationType']);
  if(this.apiData['searchKey']) {
    apiFormData.append('searchKey', this.apiData['searchKey']);
  }


  this.LandingpagewidgetsAPI.getescalatethreadsAPI(apiFormData).subscribe((response) => {

    let rstatus=response.status;
    let rresult=response.result;
    let rsdata=response.data;
    let rstotal=rsdata.total;
    this.announcementTotal = rstotal;
    let rsescalationCount=response.escalationCount;
    if(this.apiData['domainId']==4)
    {
this.escalationCount=rsescalationCount;
    }
    else
    {
      this.escalationCount='';
    }
    if(rstotal==0 && this.domainId!=4 )
    {
      this.loadingesc=false;
      this.noescText=rresult;
      this.noescalation=true;

    }
    else
    {
      this.noescalation=false;
    }
    this.escTotal=rstotal;
    if(rstotal>3)
    {
  this.escseemore=false;
    }
    if(this.domainId == 1 || this.domainId == 27){
      if(rstotal>3)
      {
      this.escseemore=true;
      }
    }

    let rsthreaddata=rsdata.threads;
    //alert(rstotal);
    if(rstatus=='Success')
    {
      if(rstotal>0)
      {

        if(this.newPageAccess){
          this.scrollCallback = true;
          this.scrollInit = 1;


          this.itemLength += this.itemLimit;
          this.itemOffset += this.itemLimit;
        }

        for (let esc in rsthreaddata)
        {

          let edeadlineDate=rsthreaddata[esc].deadlineDate;
          let ethreadId=rsthreaddata[esc].threadId;
          let epostId=rsthreaddata[esc].postId;
          let euserId=rsthreaddata[esc].userId;
          let eprofileImage=rsthreaddata[esc].profileImage;
          let estageName=rsthreaddata[esc].stageName;
          let eavailability=rsthreaddata[esc].availability;
          let emake=rsthreaddata[esc].genericProductName;
          let emodel=rsthreaddata[esc].model;
          let eyear=rsthreaddata[esc].year;
          let ethreadTitle=rsthreaddata[esc].threadTitle;
          let edescription=rsthreaddata[esc].description;
          let eescalatedType=rsthreaddata[esc].escalatedType;
          let ebannerImage=rsthreaddata[esc].bannerImage;
          let ecreatedOnMobile=rsthreaddata[esc].createdOnMobile;

          let createdOnDate = moment.utc(ecreatedOnMobile).toDate();
          let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');

          //let updatedOnDate = moment.utc(announce_updatedOnMobile).toDate();
          //let localupdatedOnDate = moment(updatedOnDate).local().format('MMM DD, YYYY h:mm A');


          this.landingescalations.push({
            threadId:ethreadId,
            deadlineDate:edeadlineDate,
            postId:epostId,
            userId:euserId,
            profileImage:eprofileImage,
            stageName:estageName,
            make:emake,
            model:emodel,
            year:eyear,
            threadTitle:ethreadTitle,
            description:edescription,
            escalatedType:eescalatedType,
            bannerImage:ebannerImage,
           createdOn:localcreatedOnDate,


          })
        }
        //alert(rsthreaddata.length);
        this.loadingesc=false;
        this.lazyLoading = false;
      }
      else
      {
        this.loadingesc=false;
        this.lazyLoading = false;
      }


    }
    else
    {
      this.loadingesc=false;
      this.lazyLoading = false;
    }


  });
  }

  taptomarcoescalation(event)
  {
    var aurl='escalations';
    window.open(aurl, '_blank');
  }
  taponMore(event){
    //this.landingNav();
    if(this.domainId == 52){
      var aurl="escalation-management/escalation-tvs";
    }
    else{
      var aurl="escalation-management/escalation";
    }
    window.open(aurl, aurl);
    event.stopPropagation();
  }
  escalationClick(event,Id)
  {
    let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
    let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
    let url = `${view}${Id}`;
    let flag: any = true;
    this.CommonServiceAPI.setlocalStorageItem('landingRecentNav', flag);
    this.router.navigate([url]);
  }
  onTabClose2(event) {
    //alert(1);
        this.expandplus=event.index;
        $('.minusone2'+this.expandplus+'').removeClass('hide');
        $('.minusone2'+this.expandplus+'').addClass('showinline');
        $('.plusone2'+this.expandplus+'').addClass('hide');
        $('.plusone2'+this.expandplus+'').removeClass('showinline');


        //this.expandminusFlag=false;
        //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
    }

    onTabOpen2(event) {
      //alert(2);

      this.expandminus=event.index;
      $('.minusone2'+this.expandminus+'').addClass('hide');
      $('.minusone2'+this.expandminus+'').removeClass('showinline');
      $('.plusone2'+this.expandminus+'').removeClass('hide');
      $('.plusone2'+this.expandminus+'').addClass('showinline');
      this.expandplus=2222;


       // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
    }

      // check next
  nextTooltip(id){
    this.updateHelpContentOrder(id);
    this.tooltip.close();
    this.ehelpContentFlagStatus = false;
    this.ehelpContentStatus = '1';
    localStorage.removeItem('helpContentName');
    localStorage.removeItem('welcomePopupDisplay');
  }

    // helpContentOrder
updateHelpContentOrder(id){

  const apiFormData = new FormData();

  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('tooltipId', id);

  this.LandingpagewidgetsAPI.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        console.log(response.result);
      }
  });
}

// Set Screen Height
setScreenHeight() {

  if(this.newPageAccess){
    this.innerHeight = (this.bodyHeight - 247);
  }
  else{
    this.innerHeight = 0;
  }
}

}
