import { Component, OnInit,Input,HostListener } from '@angular/core';
import { LandingpageService }  from '../../../services/landingpage/landingpage.service';
import * as moment from 'moment';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { pageInfo, PageTitleText,RedirectionPage,Constant,PlatFormType,forumPageAccess, IsOpenNewTab } from 'src/app/common/constant/constant';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ViewAnnouncementDetailComponent } from '../../../components/common/view-announcement-detail/view-announcement-detail.component';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement-user-view',
  templateUrl: './announcement-user-view.component.html',
  styleUrls: ['./announcement-user-view.component.scss']
})
export class AnnouncementUserViewComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};

  @Input() announcementData;
  public domainId;
  public countryId;
  public noannouncement:boolean=false;
  public announcementTotal: number;
  public userId;
  public loadingann:boolean=true;
  public roleId;
  public noannounceText='';
  public landingannouncements=[];
  public apiData: Object;
  public user: any;
  public bodyHeight: number;
  public innerHeight: number;
  public viapushcall=false;
  public teamSystem = localStorage.getItem('teamSystem');
  public bodyElem;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public lazyLoading: boolean = false;
  public userInfoUpdate: boolean = false;
  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-(this.itemOffset*8);
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.announcementTotal > this.itemLength) {
        this.lazyLoading = true;
        this.scrollCallback = false;
        this.getAnnouncement();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  // Resize Window
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private titleService: Title,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
      if(!this.userInfoUpdate){
      var setdata= JSON.parse(JSON.stringify(r));
      var checkpushtype=setdata.pushType;
      var checkmessageType=setdata.messageType;
      let checkgroups = setdata.groups;
      let ancType = this.announcementData.announceType;
      console.log('message received! ####', r);
      let filterName = '';
      let wsFlag;
      let loadFlag = false;
      switch(ancType) {
        case 'dismiss':
          wsFlag = false;
          break;
        default:
          wsFlag = true;
          loadFlag = wsFlag;
          filterName = 'moreAnnouncementFilter';
          break;
      }

      let ancFilter = JSON.parse(localStorage.getItem(filterName));
      if((checkpushtype==25 && this.viapushcall==false) || (checkpushtype==1 && checkmessageType==3 && this.viapushcall==false)) {
        if (wsFlag && checkgroups) {
          let groupArr = JSON.parse(checkgroups);
          console.log(groupArr, ancFilter);
          let findgroups;
          if (groupArr) {
            let aws = ancFilter.workstream;
            if (aws) {
              findgroups = (groupArr.toString() == aws.toString()) ? true : false;
              let ancWs = groupArr;
              if (findgroups) {
                loadFlag = true;
              } else {
                console.log(aws.length)
                let data = {
                  access: ancType,
                  flag: true
                }
                if(aws.length > 0) {
                  let diff = false;
                  for(let ws of ancWs) {
                    let windex = aws.findIndex(w => w == ws);
                    if(windex == -1) {
                      diff = true;
                      ancFilter.workstream.push(ws)
                    }
                  }

                  if(diff) {
                    loadFlag = false;
                    localStorage.setItem(filterName, JSON.stringify(ancFilter));
                    setTimeout(() => {
                      this.sharedSvc.emitAnnouncementFilterData(data);
                    }, 500);
                  } else {
                    loadFlag = true;
                  }
                } else {
                  loadFlag = false;
                  aws = groupArr;
                  ancFilter.workstream = groupArr;
                  console.log(ancFilter)
                  localStorage.setItem(filterName, JSON.stringify(ancFilter));
                  setTimeout(() => {
                    //console.log(localStorage.getItem('dashboardAnnouncementFilter'))
                    this.sharedSvc.emitAnnouncementFilterData(data);
                  }, 500);
                }
              }
            }
          }
        }
        if(loadFlag) {
          this.viapushcall=true;
          setTimeout(() => {
            this.viapushcall=false;
          },5000);
          this.landingannouncements=[];
          this.loadingann=true;
          this.itemOffset=0;
          this.getAnnouncement();
        }
      }
    }
    });
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let fopt = JSON.stringify(this.announcementData.filterOptions);

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'pageName': this.announcementData.access,
      'announceType': this.announcementData.announceType,
      'filterOptions': fopt,
    }
    this.apiData = apiInfo;

    if(this.announcementData.announceType == 'dismiss'){
      localStorage.setItem('dismissedAnnouncementFilter', fopt);
    }
    else{
      localStorage.setItem('moreAnnouncementFilter', fopt);
    }

    this.getAnnouncement();

    this.bodyHeight = window.innerHeight;
    setTimeout(() => {
      this.setScreenHeight();
    }, 500);

  }


  getAnnouncement()
  {

    let apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('pageName', this.apiData['pageName']);
    apiFormData.append('announceType', this.apiData['announceType']);
    apiFormData.append('filterOptions', this.apiData['filterOptions']);
    this.apiData['itemLimit'] = this.itemLimit;
    this.apiData['itemOffset'] = this.itemOffset;
    apiFormData.append('limit', this.apiData['itemLimit']);
    apiFormData.append('offset', this.apiData['itemOffset']);

    this.lazyLoading = true;

    this.LandingpagewidgetsAPI.ManualsAndAnnouncementList(apiFormData).subscribe((response) => {

    let rstatus=response.status;
    let rsdata=response.data;
    let rresult=response.result;
    this.noannounceText=rresult;
    let rstotal=rsdata.total;
    this.announcementTotal = rstotal;


    let rsthreaddata=rsdata.thread;
    //alert(rsthreaddata);
    if(rstatus=='Success')
    {

      if(rsthreaddata.length>0)
      {
        this.scrollCallback = true;
        this.scrollInit = 1;


        this.itemLength += this.itemLimit;
        this.itemOffset += this.itemLimit;

        this.noannouncement=false;
        for (let ann in rsthreaddata)
        {

          let uId=rsthreaddata[ann].resourceID;
          let urgencyLevel=rsthreaddata[ann].urgencyLevel;
          let announce_title=rsthreaddata[ann].title;
          let announce_description=rsthreaddata[ann].description;
          let announce_contributerId=rsthreaddata[ann].contributerId;
          let announce_contributerName=rsthreaddata[ann].contributerName;
          let announce_availability=rsthreaddata[ann].availability;
          let announce_profileImage=rsthreaddata[ann].profileImage;
          let announce_likeCount='-';
          if(rsthreaddata[ann].likeCount)
          {
            announce_likeCount=rsthreaddata[ann].likeCount;
          }
          else
          {
             announce_likeCount='-';
          }
          let announce_pinCount='-';
          if(rsthreaddata[ann].pinCount)
          {
            announce_pinCount=rsthreaddata[ann].pinCount;
          }
          else
          {
            announce_pinCount='-';
          }

          let announce_viewCount='-';
          if(rsthreaddata[ann].viewCount)
          {
            announce_viewCount=rsthreaddata[ann].viewCount;
          }
          else
          {
            announce_viewCount='-';
          }


          let announce_likeStatus=rsthreaddata[ann].likeStatus;
          let announce_pinStatus=rsthreaddata[ann].pinStatus;
          let announce_createdOnMobile=rsthreaddata[ann].createdOnMobile;
          let announce_updatedOnMobile=rsthreaddata[ann].updatedOnMobile;
          let announce_WorkstreamsList=rsthreaddata[ann].WorkstreamsList;
          let announce_readStatus=rsthreaddata[ann].readStatus;
          let createdOnDate = moment.utc(announce_createdOnMobile).toDate();
          let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');

          let updatedOnDate = moment.utc(announce_updatedOnMobile).toDate();
          let localupdatedOnDate = moment(updatedOnDate).local().format('MMM DD, YYYY h:mm A');

          let urgencyLevelText = (urgencyLevel == 2) ? 'URGENT' : '';

          this.landingannouncements.push({
            uId:uId,
            urgencyLevelText:urgencyLevelText,
            title:announce_title,
            description:announce_description,
            contributerId:announce_contributerId,
            contributerName:announce_contributerName,
            availability:announce_availability,
            profileImage:announce_profileImage,
            likeCount:announce_likeCount,
            pinCount:announce_pinCount,
            viewCount:announce_viewCount,
            likeStatus:announce_likeStatus,
            pinStatus:announce_pinStatus,
            createdOn:localcreatedOnDate,
            updatedOnMobile:localupdatedOnDate,
            WorkstreamsList:announce_WorkstreamsList,
            readStatus:announce_readStatus,
            state: 'active'
          })


        }
        //alert(rsthreaddata.length);

      }
      else
      {
        this.noannouncement=true;
      }

      this.loadingann=false;
      this.lazyLoading = false;

    }
    else
    {

      this.loadingann=false;

    }


  });
  }

   // Set Screen Height
   setScreenHeight() {
    let headerHeight = 0;
    if(!this.teamSystem) {
      headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    }
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+70));
  }

   announceClick(event,Id)
  {

   /* localStorage.setItem('annType',this.announcementData.announceType);
    var aurl='announcements/view/'+Id;
    if(this.teamSystem) {
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    } else {
      window.open(aurl, aurl);
    }*/
   // alert(Id);

   this.openDetailView(Id);

  }
  openDetailView(id){
    this.userInfoUpdate = true;
    let threadIndex = this.landingannouncements.findIndex(option => option.uId == id);
    this.landingannouncements[threadIndex].readStatus = true;
    const modalRef = this.modalService.open(ViewAnnouncementDetailComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.dataId = id;
    modalRef.componentInstance.anncReadUpdate = this.announcementData.announceType == 'dismiss' ? false : true;
    modalRef.componentInstance.documentServices.subscribe((receivedService) => {
      this.userInfoUpdate = false;
      console.log(receivedService);
      modalRef.dismiss('Cross click');
      if(receivedService['action'] == 'delete'){
        setTimeout(() => {
          let threadIndex = this.landingannouncements.findIndex(option => option.uId == id);
          this.landingannouncements.splice(threadIndex, 1);
          this.announcementTotal  -= 1;
          this.itemLength -= 1;
        }, 1000);
      }
      setTimeout(() => {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove("view-modal-popup");
        let url = this.router.url.split('/');
        let title = '';
        if(url[2] == 'dismissed'){
          title = 'Dismissed Announcements';
        }
        else{
          title =  PageTitleText.Announcement;
        }
        this.titleService.setTitle( localStorage.getItem('platformName')+' - '+title);
        }, 100);
    });
  }

}
