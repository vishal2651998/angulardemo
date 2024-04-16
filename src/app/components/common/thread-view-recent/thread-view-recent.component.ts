import { ElementRef, ViewChild, Component, OnInit, Input, HostListener,EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { CommonService } from "../../../services/common/common.service";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { Constant,PlatFormType, forumPageAccess, IsOpenNewTab, ManageTitle, pageTitle, RedirectionPage, silentItems, windowHeight,AttachmentType } from '../../../common/constant/constant';
import * as moment from "moment";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-thread-view-recent',
  templateUrl: './thread-view-recent.component.html',
  styleUrls: ['./thread-view-recent.component.scss']
})
export class ThreadViewRecentComponent implements OnInit {
  @ViewChild('activeId',{static: false}) top: ElementRef;
  @Input() searchValue: string = "";
  @Input() facetsDatatems: any = [];
  @Input() filterItems: any = [];
  @Input() view: string = "view-v2";
  @Input() threadId;
  @Output() threadViewRecentActionEmit: EventEmitter<any> = new EventEmitter();
  @Output() threadRecentComponentRef: EventEmitter<ThreadViewRecentComponent> = new EventEmitter();
  @Output() threadRecentCallBack: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public apiData: Object;
  public itemOffset: number = 0;
  public activeThread:any = 0;
  public threadsAPIcall;
  public itemLength: number = 0;
  public facetsData: any = [];
  public threadListArray=[];
  public threadFilters: any = [];
  public itemLimit: number = 20;
  public subscriberDomain=localStorage.getItem('subscriber');
  public domainId;
  public userId;
  public user: any;
  public innerHeight: number;
  public bodyHeight: number;
  public rmdHeight: number;
  public limit: number = 20;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemTotal: number = 0;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public collabticDomain: boolean = false;
  public fixesView: boolean = false;
  public searchKeyword: string = "";

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setScreenHeight();
  }
// Scroll Down
@HostListener('scroll', ['$event'])
onScroll(event: any) {
  let inHeight = event.target.offsetHeight + event.target.scrollTop;
  let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
  this.scrollTop = event.target.scrollTop - 80;
  if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
    if (
      inHeight >= totalHeight &&
      this.scrollCallback &&
      this.itemTotal > this.itemLength
    ) {
      this.lazyLoading = true;
      this.scrollCallback = false;
      this.loadThreadsPageSolr();
    }
  }
  this.lastScrollTop = this.scrollTop;
}

  constructor(
    private authenticationService: AuthenticationService,
    private LandingpagewidgetsAPI: LandingpageService,
    public commonSvr: CommonService,
    private threadPostService: ThreadPostService,
    private sanitizer: DomSanitizer,
  ) {


    document.addEventListener('visibilitychange', () => {
      if(!this.fixesView) {
        if (document.hidden) {
          // do whatever you want
         console.log('Hidden');
        }
        else {
          // do whatever you want
          console.log('Show thread');
  
          this.itemOffset = 0;
  
          let push = false, limit:any = '5',newthread=false,actionFilter='';
          this.loadThreadsPageSolr('',limit);
        }
      }      
    });

  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
   // this.apiData["limit"]=this.itemLimit;
    this.user = this.authenticationService.userValue;
    let platformId = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.fixesView = (this.view == 'view-v3' || this.view == 'sview-v3') ? true : false;
    this.searchKeyword = (this.view == 'sview-v3') ? this.searchValue : this.searchKeyword;
    let loadThreadFlag = (this.view != 'view-v3') ? true : false;
    if(this.fixesView) {
      let searchVal = localStorage.getItem('searchValue');
      let navFromWs:any = localStorage.getItem('wsNav');
      if(navFromWs) {
        this.searchKeyword = (searchVal) ? searchVal : this.searchKeyword;
        loadThreadFlag = true;
      }
    } 
    if(loadThreadFlag) {
      if(this.view == 'sview-v3') {
        this.facetsData = this.facetsDatatems;
        this.threadFilters = this.filterItems;
      }
      this.loadThreadsPageSolr();  
    }
    
    setTimeout(() => {
      this.setScreenHeight();
      this.threadRecentCallBack.emit(this);
    }, 500);

    this.commonSvr.emitNotificationThreadRecentDataSubject.subscribe((data) => {
      console.log(data);
       // new push...
      let pushthread = '1';
      localStorage.setItem("OnNewThreadIdUpdate",pushthread);
      this.loadThreadsPageSolr(pushthread);
    });




    this.commonSvr.emitThreadDetailRecentIdSubject.subscribe((response) => {

      if(response['displayType']=='1')
      {
        let pushthread = '1';
        localStorage.setItem("OnNewThreadIdUpdate",pushthread);
        this.loadThreadsPageSolr(pushthread);
      }
      if(response['update'] != 1 || response['update'] == undefined ){
        setTimeout(() => {
          this.activeThread=response['threadId'];
        if(document.getElementById('active-'+this.activeThread) != undefined){
          let nst1 = document.getElementById('active-'+this.activeThread).offsetTop;
          this.top.nativeElement.scrollTop = nst1;
          var element = document.getElementById('active-'+this.activeThread);
          element.classList.add("active");
          //element.classList.remove("red-dot-notification");
        }
        }, 1400);
      }
      if(response['update']==1)
      {
        var element = document.getElementById('active-'+response['threadId']);
        if(element)
        {
          element.classList.add("red-dot-notification");
        }

        return;
      }


    });

    this.commonSvr.emitThreadDetailRecentUpdateSubject.subscribe((response) => {
      console.log(response);
      let id = response['threadId'];
      let type = response['type'];
      this.callThreadDetail(id,type);
    });
  }



tapOnThreadTile(eventData) {
  console.log(eventData)
  if(eventData && this.isActive(eventData.threadId)) {
    return false;
  }
  /*
  if(eventData.pushFlag) {
    let threadIndex = this.threadListArray.findIndex(option => option.threadId == eventData.threadId);
    console.log(threadIndex);
    if(threadIndex != -1) {
      this.threadListArray[threadIndex].pushFlag = false;
    }
    return false;
  }
  */
  let data;
  if(this.subscriberDomain) {
    data = {
      threadId:eventData.threadId,
      domainId:eventData.domainId,
      position:'top'
    }
  } else {
    data = {
      threadId:eventData.threadId,
      position:'top'
    }
  }

  if(this.activeThread != eventData.threadId) {
    var element = document.getElementById('active-'+this.activeThread);
    if(element != undefined)
    element.classList.remove("active");
    //element.classList.remove("red-dot-notification");
  }

  this.activeThread=eventData.threadId;
  if(this.activeThread) {
    if(this.fixesView) {
      let ti = this.threadListArray.findIndex(option => option.threadId == this.activeThread);
      if(ti >= 0) {
        this.threadListArray[ti].viewCount += 1; 
      }
    }
    let element = document.getElementById('active-'+this.activeThread);
    if(element != undefined) {
      if (document.querySelector('.active-class-'+this.activeThread).classList.contains("red-dot-notification")) {
        data['position'] = 'bottom';
      }
    }

    setTimeout(() => {
      var element = document.getElementById('active-'+this.activeThread);
      if(element != undefined)
      element.classList.remove("red-dot-notification");
    }, 100);
  }
  console.log(data)
  this.threadViewRecentActionEmit.emit(data);
  this.threadRecentCallBack.emit(this);
}

  isActive(threadId)
  {
   //console.log(threadId+'--'+this.activeThread);
    return this.activeThread === threadId;
  }

  callThreadDetail(id,type){
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', id);



    this.threadPostService.getthreadDetailsiosDefault(apiFormData).subscribe(res => {

      if(res.status=='Success'){
        let threadData = res.data.thread[0];

        if(type == 'thread-edit' ){
          let threadIndex = this.threadListArray.findIndex(option => option.threadId == id);
          if(threadIndex != -1) {
            if( this.threadListArray[threadIndex].threadTitle != undefined &&  this.threadListArray[threadIndex].threadTitle != ''){
              this.threadListArray[threadIndex].threadTitle = this.authenticationService.convertunicode(
              this.authenticationService.ChatUCode( this.threadListArray[threadIndex].threadTitle));
            }
            let description:any = '';
            if(this.threadListArray[threadIndex].content != undefined && this.threadListArray[threadIndex].content != ''){
              description = this.threadListArray[threadIndex].content;
              description=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(description));
              this.threadListArray[threadIndex].description = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(description));
            }
            this.threadListArray[threadIndex].threadCategoryStr = threadData.threadCategoryStr;
            this.threadListArray[threadIndex].make = threadData.genericProductName;
            this.threadListArray[threadIndex].model = threadData.model;
            this.threadListArray[threadIndex].isDefaultBanner = threadData.isDefaultBanner;
            this.threadListArray[threadIndex].vehicleCarImage = threadData.vehicleCarImage;
            this.threadListArray[threadIndex].year = threadData.year;

        }


        }

      }

  });

  }

  loadThreadsPageSolr(pushthread='',limit='',threadId=0)
  {

    let FiltersArr:any={};
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    //FiltersArr["domainId"]=this.domainId;
    let subscriber=localStorage.getItem('subscriber');
  if(!subscriber)
  {
    FiltersArr["domainId"]=this.domainId;
    }
    else
    {
      let domainArr=[];
      let domainVal=this.domainId.toString();
      domainArr.push(domainVal);
      FiltersArr["sharedDomainsStrArr"]=domainArr;
    }
    let threadListing = (this.searchKeyword != '' && this.searchKeyword != 'undefined' && this.searchKeyword != undefined) ? 0 : 1;
    var objData = {};
    if(pushthread == '1'){
      objData["rows"]=1;
      objData["start"]=0;
      if(threadId > 0) {
        FiltersArr["threadId"] = threadId;
      }
    }
    else{
      if(limit)
      {
        objData["rows"]=this.limit;
      }
      else
      {
        objData["rows"]=this.itemLimit;
      }

      objData["start"]=this.itemOffset;
    }

      objData["type"]=1;
      objData["listing"]=threadListing;
      if(threadListing == 0) {
        objData["query"] = this.searchKeyword;
        FiltersArr["approvalProcess"] = [0, 1];
      }
      let userWorkstreams=localStorage.getItem('userWorkstreams');
      if(userWorkstreams)
      {
        FiltersArr["workstreamsIds"] = JSON.parse(userWorkstreams);
      }
      let cfilterFlag = false;
      let facetsFlag = true;
      let mfgFlag = false, makeFlag = false, modelFlag = false, yearFlag = false;
      objData["filters"] = FiltersArr;
      console.log(this.threadFilters)
      Object.keys(this.threadFilters).forEach(key => {
        let filterVal = this.threadFilters[key];
        let filterFlag = false; 
        let rmItem = true;
        if(Array.isArray(filterVal) && filterVal.length > 0) {
          filterFlag = true;          
        }
        if(!Array.isArray(filterVal) && filterVal != '') {
          filterFlag = true;
        }
        
        if(filterFlag) {
          switch (key) {
            case 'manufacturer':
              mfgFlag = true;
              break;
            case 'make':
              makeFlag = true;
              break;
            case 'model':
              modelFlag = true;
              break;
            case 'year':
              yearFlag = true;
              break;  
          }
          //facetsFlag = (key != 'pinedUsers') ? false : facetsFlag;
          cfilterFlag = filterFlag;
          objData["filters"][key] = filterVal;
          if(rmItem) {
            Object.keys(objData["filters"]).forEach((key, index) => {
              if(key == 'threadId') {
                objData["filters"].splice(index, 1);
                rmItem = false;
              }
            });
          }
        }
      });      

      this.threadsAPIcall = this.LandingpagewidgetsAPI.getSolrDataDetail(
        objData
      ).subscribe((response) => {

        if(response.status=='Success')
        {
          let facets = response.facets;
          if(facetsFlag && objData["rows"] > 1 && this.itemOffset == 0) {
            console.log(mfgFlag, makeFlag, modelFlag, yearFlag)
            if(!mfgFlag && !makeFlag && !modelFlag && !yearFlag) {
              this.facetsData = facets;
            } else if(mfgFlag && !makeFlag && !modelFlag && !yearFlag) {
              Object.keys(this.facetsData).forEach(key => {
                switch (key) {
                  case 'manufacturer':
                  case 'make':
                  case 'model':
                  case 'year':
                    this.facetsData[key] = [];  
                    this.facetsData[key] = facets[key];
                    break;
                }
              })
            } else if((mfgFlag && makeFlag && !modelFlag && !yearFlag) || (!mfgFlag && makeFlag && !modelFlag)) {
              Object.keys(this.facetsData).forEach(key => {
                switch (key) {
                  case 'model':
                  case 'year':
                    this.facetsData[key] = [];
                    console.log(key, facets[key], this.facetsData)
                    this.facetsData[key] = facets[key];
                    break;
                }
              })
            } else if((mfgFlag && makeFlag && modelFlag && !yearFlag) || (!mfgFlag && !makeFlag && modelFlag) || (!mfgFlag && makeFlag && modelFlag)) {
              Object.keys(this.facetsData).forEach(key => {
                switch (key) {
                  case 'year':    
                    this.facetsData[key] = [];
                    this.facetsData[key] = facets[key];
                    break;
                }
              })
            }
          }
          let threadData=response.threads;
          this.loading = false;
          this.lazyLoading = false;

          if(threadData.length>0)
          {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = response.total;

            if(pushthread == ''){
              this.itemLength += threadData.length;
              this.itemOffset += this.itemLimit;
            }

            for (let t = 0; t < threadData.length; t++)
            {
              let threadId = threadData[t].threadId;
              if(this.threadId == threadId){
                this.activeThread = threadId;
              }
              let threadTitle = "None";
              if(threadData[t].threadTitle != undefined && threadData[t].threadTitle != ''){
                threadTitle = this.authenticationService.convertunicode(
                this.authenticationService.ChatUCode(threadData[t].threadTitle));
              }
              let make = threadData[t].genericProductName;
              let model = threadData[t].model;
              let domainIdInfo = threadData[t].domainId;
              let vehicleCarImage= threadData[t].vehicleCarImage;
              let year = threadData[t].year;
              let description:any = 'None';
              if(threadData[t].content != undefined && threadData[t].content != ''){
                description = threadData[t].content;
                description=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(description));
                description = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(description));
              }
              let odometerMiles = threadData[t].odometerMiles;
              let odometer = threadData[t].odometer !='' && threadData[t].odometer != null ? threadData[t].odometer : '' ;
              let miles = threadData[t].miles !='' && threadData[t].miles != null ? threadData[t].miles : '';
              if(odometer != ''){
                odometer = this.commonSvr.removeCommaNum(odometer);
                odometer = this.commonSvr.numberWithCommasThreeDigit(odometer);
                odometerMiles = odometer+" "+miles;
              }
              let modelAttributes = (threadData[t].modelAttributes && threadData[t].modelAttributes.length > 0) ? threadData[t].modelAttributes : [];
              let additionalInfo:any = '';
              if(modelAttributes.length > 0) {
                let modelAttr = modelAttributes[0];
                let additionalInfo1 = modelAttr.additionalInfo;
                let additionalInfo2 = modelAttr.additionalInfo1;
                let additionalInfo3 = modelAttr.additionalInfo2;
                let additionalInfo4 = modelAttr.additionalInfo3;
                let additionalInfo5 = modelAttr.additionalInfo4;
                let additionalInfo6 = modelAttr.additionalInfo5;
                if(additionalInfo1.length > 0) { additionalInfo = `${additionalInfo1[0].name}` }
                if(additionalInfo2.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo2[0].name}` }
                if(additionalInfo3.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo3[0].name}` }
                if(additionalInfo4.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo4[0].name}` }
                if(additionalInfo5.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo5[0].name}` }
                if(additionalInfo6.length > 0) { additionalInfo = `${additionalInfo}, ${additionalInfo6[0].name}` }
              }
              let likeCount = this.commonSvr.formatCompactNumber(threadData[t].likeCount);
              let pinCount = this.commonSvr.formatCompactNumber(threadData[t].pinCount);
              let viewCount = this.commonSvr.formatCompactNumber(threadData[t].viewCount);
              viewCount = (threadId > 0) ? viewCount+1 : viewCount;
              let createdOnNew = threadData[t].createdOnNew;
              let threadCategoryStr = threadData[t].threadCategoryStr;
              let createdOnDate = moment.utc(createdOnNew).toDate();
              let localcreatedOnDate = moment(createdOnDate)
                .local()
                .format("MMM DD, YYYY . h:mm A");
                let listlocalcreatedOnDate = moment(createdOnDate)
                .local()
                .format("MMM DD, YY . h:mm A");
              let dateTime = localcreatedOnDate.split(" . ");
              //console.log(dateTime);
              threadData[t].date = dateTime[0];
              threadData[t].time = dateTime[1];
              let currentDtc = threadData[t].currentDtc;

              if(pushthread == '1'){
                let threadIndex = this.threadListArray.findIndex(option => option.threadId == threadId);
                if(threadIndex == -1) {
                  this.threadListArray.unshift({
                    threadId: threadId,
                    threadTitle: threadTitle,
                    domainId: domainIdInfo,
                    vehicleCarImage:vehicleCarImage,
                    make: make,
                    model: model,
                    year: year,
                    description,
                    odometerMiles,
                    additionalInfo,
                    threadCategoryStr,
                    likeCount,
                    pinCount,
                    viewCount,
                    listCreatedOn: listlocalcreatedOnDate,
                    createdOn: localcreatedOnDate,
                    date: dateTime[0],
                    time: dateTime[1],
                    pushFlag:true,
                  });
                  setTimeout(() => {
                    var element = document.getElementById('active-'+threadId);
                    if(element)
                    {
                      element.classList.add("red-dot-notification");
                    }
                  }, 100);
                }
              }
              else{
                let tIndex = this.threadListArray.findIndex(option => option.threadId == threadId);
                if(tIndex>=0) {
                  this.threadListArray[tIndex].threadId = threadId;
                  this.threadListArray[tIndex].threadTitle = threadTitle;
                  this.threadListArray[tIndex].domainId = domainIdInfo;
                  this.threadListArray[tIndex].vehicleCarImage = vehicleCarImage;
                  this.threadListArray[tIndex].make = make;
                  this.threadListArray[tIndex].model = model;
                  this.threadListArray[tIndex].year = year;
                  this.threadListArray[tIndex].description = description;
                  this.threadListArray[tIndex].odometerMiles = odometerMiles;
                  this.threadListArray[tIndex].additionalInfo = additionalInfo;
                  this.threadListArray[tIndex].threadCategoryStr = threadCategoryStr;
                  this.threadListArray[tIndex].likeCount = likeCount;
                  this.threadListArray[tIndex].pinCount = pinCount;
                  this.threadListArray[tIndex].viewCount = viewCount;
                  this.threadListArray[tIndex].listlocalcreatedOnDate = listlocalcreatedOnDate;
                  this.threadListArray[tIndex].listlocalcreatedOnDate = listlocalcreatedOnDate;
                  this.threadListArray[tIndex].listlocalcreatedOnDate = listlocalcreatedOnDate;
                  this.threadListArray[tIndex].localcreatedOnDate = localcreatedOnDate;
                  this.threadListArray[tIndex].localcreatedOnDate = localcreatedOnDate;
                  this.threadListArray[tIndex].date = dateTime[0];
                  this.threadListArray[tIndex].time = dateTime[1];
                }
                else
                {
                  this.threadListArray.push({
                    threadId: threadId,
                    threadTitle: threadTitle,
                    domainId: domainIdInfo,
                    vehicleCarImage:vehicleCarImage,
                    make: make,
                    model: model,
                    year: year,
                    description,
                    odometerMiles,
                    additionalInfo,
                    threadCategoryStr,
                    likeCount,
                    pinCount,
                    viewCount,
                    listCreatedOn: listlocalcreatedOnDate,
                    createdOn: localcreatedOnDate,
                    date: dateTime[0],
                    time: dateTime[1],
                    pushFlag:false,
                  });
                }
              }
            }
          }
          else{
            this.threadListArray = [];
          }
        }
        if((threadListing == 0 || cfilterFlag || (this.view == 'sview-v3' && this.activeThread == 0)) && this.itemOffset == 20) {
          this.activeThread = 0;
          this.tapOnThreadTile(this.threadListArray[0]);
        }
        setTimeout(() => {
          this.threadRecentCallBack.emit(this);
        }, 750);
      });
  }

  setScreenHeight(){
    this.rmdHeight = (this.view == 'view-v2') ? 115 : 135;
    let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;
    this.rmdHeight = this.rmdHeight + headerHeight;
    this.bodyHeight = window.innerHeight;
    this.innerHeight = (this.bodyHeight - this.rmdHeight );
  }

  setupThreadActive(threadId) {
    if(this.activeThread != threadId) {
      var element = document.getElementById('active-'+this.activeThread);
      if(element != undefined)
      element.classList.remove("active");
    }
    this.activeThread = threadId;    
    let checkElementId = `active-${this.activeThread}`;
    let activeId = document.getElementById(checkElementId);
    let activeClass = 'active';
    if(!activeId.classList.contains(activeClass)) {
      activeId.classList.add(activeClass);
      activeId.scrollTop = this.scrollTop;
    }    
  }

}
