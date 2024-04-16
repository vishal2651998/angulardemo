import { Component, ViewChild, HostListener, OnInit, Input, ElementRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { Constant,PageTitleText,RedirectionPage,windowHeight,ContentTypeValues,DefaultNewImages,DefaultNewCreationText,IsOpenNewTab } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common/common.service';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { ViewAnnouncementDetailComponent } from '../../../components/common/view-announcement-detail/view-announcement-detail.component';
import { NgxMasonryComponent } from 'ngx-masonry';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss'],
  styles: []
})

export class AnnouncementListComponent implements OnInit {

  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() tapfromheader;
  @ViewChild('top',{static: false}) top: ElementRef;


  public sconfig: PerfectScrollbarConfigInterface = {};
  public teamSystem = localStorage.getItem('teamSystem');
  public section: number = 1;
  public apiKey: string = Constant.ApiKey;
  public userId;
  public filterOptions: any = [];

  public multipleHtml: string = "Multiple";
  public assetPath: string = "assets/images/";
  public assetAnnPath: string = "assets/images/announcements/";
  public redirectUrl: string = "announcements/view/";
  public annUrl: string = "announcements/manage/";
  public expiryDateFormat: string = "";

  public editAccess: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled:boolean=false;
  public expandFlag: boolean;
  public accessFrom: string = "";

  public tooltipClearFlag: boolean = true;
  public annTooltip: boolean = false;
  public wsTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public annActionPosition: string;
  public customTooltipData: any;

  public announceType: string = "";
  public pageName: string = 'announcement'
  public searchVal: string = '';
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public domainId;
  public countryId;
  public apiData: Object;

  public bodyHeight: number;
  public innerHeight: number;

  public groupId: number = 31;
  public displayNoRecordsShow=0;
  public itemEmpty: boolean;
  public thumbView: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public itemResponse = [];
  public announcementsSelectionList = [];
  public pinImg: string;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public pinTxt: string;
  public navAction: string = 'single';
  public newPartInfo:string='';
  public chevronImg: string = `${this.assetAnnPath}chevron.png`;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";

  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public viapushcall=false;
  public announceList = [];
  public pageAccess: string = "parts";
  public successFlag: boolean = false;
  public successMsg: string = "";
  public viewTxt: string = "view";
  public editTxt: string = "edit";

  public annId: number;
  public annIndex: number;
  public updateMasonryLayout: boolean = false;

  public noannounceText = '';
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public loadDataEvent: boolean=false;

  public responseData = {
    displayNoRecords: this.displayNoRecords,
    displayNoRecordsDefault:this.displayNoRecordsDefault,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    itemEmpty: false,
    loading: this.loading,
    action: false,
    announceList: this.announceList,
    announcementsSelectionList: this.announcementsSelectionList,
    itemOffset: this.itemOffset,
    itemTotal: this.itemTotal,
    searchVal: this.searchVal,
    headerAction: false
  };
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-(this.itemOffset*8);
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.lazyLoading = true;
        this.scrollCallback = false;
        this.getAnnounceList();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
  constructor(
    private router: Router,
    private commonApi: CommonService,
    private announcementApi: AnnouncementService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private titleService: Title,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngAfterViewInit(): void {
    const frozenBody: HTMLElement | null = document.querySelector('.ui-table-frozen-view .ui-table-scrollable-body');
    const scrollableArea: HTMLElement | null = document.querySelector('.ui-table-scrollable-view.ui-table-unfrozen-view .ui-table-scrollable-body');
    if (frozenBody && scrollableArea) {
      frozenBody.addEventListener('wheel', e => {
        const canScrollDown = scrollableArea.scrollTop < (scrollableArea.scrollHeight - scrollableArea.clientHeight);
        const canScrollUp = 0 < scrollableArea.scrollTop;

        if (!canScrollDown && !canScrollUp) {
          return;
        }

        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        const scrollDelta = 100;

        if (canScrollDown && scrollingDown) {
          e.preventDefault();
          scrollableArea.scrollTop += scrollDelta;
        } else if (canScrollUp && scrollingUp) {
          e.preventDefault();
          scrollableArea.scrollTop -= scrollDelta;
        }
      });
    }
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);

    this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
      var setdata= JSON.parse(JSON.stringify(r));
      var checkpushtype=setdata.pushType;
      var checkmessageType=setdata.messageType;
      let checkgroups = setdata.groups;
      let ancFilter = JSON.parse(localStorage.getItem('dashboardAnnouncementFilter'));
      console.log('message received list! ####', r);

      if((checkpushtype==25 && this.viapushcall==false) || (checkpushtype==1 && checkmessageType==3 && this.viapushcall==false)) {
        if (checkgroups) {
          let groupArr = JSON.parse(checkgroups);
          console.log(groupArr, ancFilter);
          let findgroups;
          if (groupArr) {
            let loadFlag;
            let aws = ancFilter.workstream;
            if (aws) {
              findgroups = (groupArr.toString() == aws.toString()) ? true : false;
              let ancWs = groupArr;
              if (findgroups) {
                loadFlag = true;
              } else {
                console.log(aws.length)
                let data = {
                  access: 'dash-list',
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
                    localStorage.setItem('dashboardAnnouncementFilter', JSON.stringify(ancFilter));
                    setTimeout(() => {
                      this.commonApi.emitAnnouncementFilterData(data);
                    }, 500);
                  } else {
                    loadFlag = true;
                  }
                } else {
                  loadFlag = false;
                  aws = groupArr;
                  ancFilter.workstream = groupArr;
                  console.log(ancFilter)
                  localStorage.setItem('dashboardAnnouncementFilter', JSON.stringify(ancFilter));
                  setTimeout(() => {
                    //console.log(localStorage.getItem('dashboardAnnouncementFilter'))
                    this.commonApi.emitAnnouncementFilterData(data);
                  }, 500);
                }
              }
            }

            if(loadFlag) {
              this.viapushcall=true;
              this.loading = true;
              this.itemOffset = 0;
              setTimeout(() => {
                this.announceList = [];
                this.getAnnounceList();
                setTimeout(() => {
                  this.top.nativeElement.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'auto'
                  });
                }, 100);
              }, 500);
            }
          }
        }
      }
      setTimeout(() => {
        this.viapushcall=false;
      },5000)
    });

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    console.log(this.bodyHeight)
    this.expiryDateFormat = localStorage.getItem('expiryDateFormat');

    this.commonApi.announcementListDataReceivedSubject.subscribe((announceData) => {
     this.getAnnounceInfoData(announceData);
    });

    this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
      this.updateLayout();
    });
  }


  getAnnounceInfoData(announceData)
  {
    console.log(announceData)
    console.log(this.displayNoRecords)
    this.displayNoRecords = false;
    this.displayNoRecordsDefault=false;
    let action = announceData['action'];
    this.userId = announceData['userId'];
    this.domainId = announceData['domainId'];
    this.countryId = announceData['countryId'];
    this.accessFrom = announceData['accessFrom'];
    this.expandFlag = announceData['expandFlag'];
    this.filterOptions = announceData['filterOptions'];
    this.thumbView = announceData['thumbView'];
    this.headercheckDisplay = announceData['headercheckDisplay'];
    this.headerCheck = announceData['headerCheck'];
    this.responseData['headercheckDisplay'] = this.headercheckDisplay;
    this.responseData['headerCheck'] = this.headerCheck;
    this.responseData['displayNoRecords'] = this.displayNoRecords;
    this.responseData['displayNoRecordsShow'] = 1;
    this.responseData['displayNoRecordsDefault'] = this.displayNoRecordsDefault;

    switch (this.accessFrom) {
      case 'announcement':
        this.section = announceData['section'];
        this.announceType = announceData['announceType'];
        this.searchVal = announceData['searchVal'];
        this.itemEmpty = announceData['itemEmpty'];
        break;

      default:
        break;
    }

    let apiInfo = {
      'apiKey': this.apiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'isActive': 1,
      'filterOptions': this.filterOptions,
      'limit': this.itemLimit
    }
    this.apiData = apiInfo;
    this.setScreenHeight();
    switch (action) {
      case 'get':
      case 'filter':
        this.loading = true;
        this.itemOffset = 0;
        setTimeout(() => {
          this.announceList = [];
          this.getAnnounceList();
          setTimeout(() => {
            if(this.thumbView){
              this.top.nativeElement.scroll({
                top: 0,
                left: 0,
                behavior: 'auto'
              });
            }
          }, 100);
        }, 500);
        if(action == 'filter') {
          this.announcementsSelectionList = [];
          this.responseData.announcementsSelectionList = this.announcementsSelectionList;
          this.commonApi.emitAnnouncementLayoutData(this.responseData);
        }
        break;
      case 'api':
        this.loading = true;
        this.commonApi.emitAnnouncementLayoutData(this.responseData);
        break;
      case 'toggle':
        console.log(this.announceList)
        this.displayNoRecords = (this.announceList.length > 0) ? false : true;
        this.displayNoRecordsDefault = this.displayNoRecords;
        this.updateLayout();
        break;
      default:
        setTimeout(() => {
          if(this.thumbView){
            this.top.nativeElement.scroll({
              top: 0,
              left: 0,
              behavior: 'auto'
            });
          }
        }, 0);
        this.loading = false;
        this.responseData['loading'] = this.loading;
        this.commonApi.emitAnnouncementLayoutData(this.responseData);
        /*setTimeout(() => {
          if(this.thumbView) {
            console.log('In Thumb view')
            let listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)+50;
            console.log('Window Height: '+this.innerHeight)
            console.log('List Height')
            if(this.innerHeight >= listItemHeight) {
              console.log('In Lazy loading')
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getAnnounceList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 50);*/
        break;
    }
  }

  // Get List
  getAnnounceList() {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['announceType'] = this.announceType;
    this.apiData['pageAccess'] = this.pageName;
    if(this.announceType != 'dashboard'){
      this.apiData['isArchive'] = '1';
    }

    let apiData = this.apiData;
    this.announcementApi.getAnnouncementsList(apiData).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.lazyLoading = this.loading;
      this.loadDataEvent=false;
      this.responseData['loading'] = this.loading;
      this.responseData['itemOffset'] = this.itemOffset;
      this.commonApi.emitAnnouncementLayoutData(this.responseData);
      let resultData = response.data.thread;
      if (response.data.total == 0) {
        this.itemEmpty = true;
        this.noannounceText = response.result;
        this.responseData['itemEmpty'] = this.itemEmpty;
        if(this.apiData['searchKey'] != '' || response.data.total == 0) {
          this.announceList = [];
          this.displayNoRecords = true;
          this.responseData['announceList'] = this.announceList;
          this.responseData['itemEmpty'] = this.itemEmpty;
          this.responseData['displayNoRecords'] = this.displayNoRecords;
          this.responseData['displayNoRecordsDefault'] = this.displayNoRecordsDefault;
          this.commonApi.emitAnnouncementLayoutData(this.responseData);
        }
        else
        {
          this.displayNoRecordsDefault = true;
          this.responseData['displayNoRecords'] = this.displayNoRecords;
          this.displayNoRecordsShow = 2;
          this.contentTypeValue=ContentTypeValues.Parts;
          this.contentTypeDefaultNewImg=DefaultNewImages.Parts;
          this.responseData['displayNoRecordsDefault'] = this.displayNoRecordsDefault;
          this.contentTypeDefaultNewText=DefaultNewCreationText.Parts;
          this.contentTypeDefaultNewTextDisabled=false;
        }
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.itemEmpty = false;
        this.itemResponse = resultData;
        this.itemTotal = response.data.total;
        this.itemLength += resultData.length;
        this.itemOffset += this.itemLimit;

        this.responseData['itemTotal'] = this.itemTotal;
        this.responseData['itemOffset'] = this.itemOffset;
        this.responseData['itemEmpty'] = this.itemEmpty;
        this.responseData['displayNoRecords'] = this.displayNoRecords;

        console.log(resultData);
        for (let i in resultData) {
          let createdOnNew = resultData[i].createdOnMobile;
          let createdOnDate = moment.utc(createdOnNew).toDate();
          //resultData[i].cretedOn = moment(createdOnDate).local().format('MMM DD, YYYY . hh:mm A');
          resultData[i].cretedOn = moment(createdOnDate).local().format('MMM DD, YYYY');

          let autoExpiryDate1 = resultData[i].autoExpiryDate;
          if(resultData[i].autoExpiryDate!=''){
          let autoExpiryDate2 = moment.utc(autoExpiryDate1).toDate();
          //resultData[i].cretedOn = moment(createdOnDate).local().format('MMM DD, YYYY . hh:mm A');
          resultData[i].expDate = moment(autoExpiryDate2).local().format(this.expiryDateFormat);
          }
          else{
            resultData[i].expDate = "-";
          }

          resultData[i].editAccess = (resultData[i].editAccess == 1) ? true : false;
          resultData[i].viewAccess = (resultData[i].viewAccess == 1) ? true : false;
          resultData[i].showAccess =  true ;
          resultData[i].disableAccess =  false ;
          resultData[i].activeMore = false;
          resultData[i].index = i;
          let ws = resultData[i].WorkstreamsList;
          let wsLen = ws.length;
          resultData[i].WorkstreamsList = (wsLen > 0 ) ? ws[0].name : '' ;
          let urgencyLevelText='';
          if( resultData[i].urgencyLevel==1)
          {
            urgencyLevelText='URGENT';
          }
          resultData[i].urgencyLevelText = urgencyLevelText;
          resultData[i].WorkstreamsTileList = ws;
          this.announceList.push(resultData[i]);
          this.responseData['announceList'] = this.announceList;
        }
        setTimeout(() => {
          this.commonApi.emitAnnouncementLayoutData(this.responseData);
        }, 500);

        /*setTimeout(() => {
          if(!this.displayNoRecords) {
            let listItemHeight;
            if(this.thumbView) {
              listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)+50;
            } else {
              listItemHeight = (document.getElementsByClassName('file-datatable')[0].clientHeight)+50;
            }
            //console.log(this.innerHeight+'::'+listItemHeight)
            if(resultData.length > 0 && this.announceList.length != response.totalList && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getAnnounceList();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 1500);*/

        if(this.thumbView) {
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateMasonryLayout = true;
          }, 2000);
        }
      }
    });
  }

    // Nav Part Edit or View
    navPart(action, id) {
      let url;
      switch (action) {
        case 'edit':
          url = this.annUrl+'edit/'+id;
          break;
        case 'view':
          url = this.redirectUrl+id;
          break;
        default:
          url = this.annUrl;
          break;
      }
      //console.log(url)
      setTimeout(() => {
        if(this.teamSystem) {
          window.open(url, IsOpenNewTab.teamOpenNewTab);
        } else {
          window.open(url, url);
        }
      }, 50);
    }

  navUrl(event,action,Id,type) {
    let aurl = 'announcements';
    switch(action) {
      case 'view':
       /* let annType = 'dismiss';
        if(type == 0){
          annType = 'more';
        }
        localStorage.setItem('annType', annType);
        aurl = `${aurl}/${action}/${Id}`;
        window.open(aurl, aurl);*/
        this.openDetailView(Id);
        break;
      default:
        aurl = `${aurl}/manage/${action}/${Id}`;
        window.open(aurl, aurl);
        break;
    }
  }

  openDetailView(id){
    const modalRef = this.modalService.open(ViewAnnouncementDetailComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.dataId = id;
    modalRef.componentInstance.anncReadUpdate = true;
    modalRef.componentInstance.documentServices.subscribe((receivedService) => {
      console.log(receivedService);
      modalRef.dismiss('Cross click');
      if(receivedService['action'] == 'delete'){
        setTimeout(() => {
          let threadIndex = this.announceList.findIndex(option => option.resourceID == id);
          this.announceList.splice(threadIndex, 1);
          this.itemTotal -= 1;
          this.itemLength -= 1;
        }, 1000);
      }
      setTimeout(() => {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove("view-modal-popup");
        let title = PageTitleText.Announcement;
        this.titleService.setTitle( localStorage.getItem('platformName')+' - '+title);
        }, 100);
    });
  }

  // Set Screen Height
  setScreenHeight() {
    if(this.teamSystem) {
      this.innerHeight=windowHeight.heightMsTeam+80;
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
      this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+30));
      this.innerHeight = this.innerHeight-40;
    }
  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 500);
  }


    // update announcement
    removeArchiveAccouncement(id){
      this.viapushcall=true;
      for (let j in this.announceList) {
        if(this.announceList[j].resourceID == id){
          this.announceList[j].disableAccess = true;
        }
      }
      this.bodyElem.classList.add(this.bodyClass);
      const submitModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
      const apiFormData = new FormData();
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('dataId', id);
      apiFormData.append('type', 'announcements');

       this.announcementApi.archiveAnnouncement(apiFormData).subscribe(res => {
        submitModalRef.dismiss('Cross click');
        this.bodyElem.classList.remove(this.bodyClass);
        if(res.status=='Success'){
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = res.result;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click');
              for (let j in this.announceList) {
                if(this.announceList[j].resourceID == id){
                  this.announceList[j].showAccess = false;
                }
              }
              if(this.thumbView) {
                setTimeout(() => {
                  if(this.masonry !== undefined) {
                    this.masonry.reloadItems();
                    this.masonry.layout();
                    this.updateMasonryLayout = true;
                  }
                }, 600);
              }
            }, 1000);
          }
        }, (error => {
          console.log(error);
        })
      );
    }

     // Custom Action Tooltip Content
  getActionTooltip(action, index, id, event) {
    let timeout = 100;
    switch(action) {
      case 'more':
        this.wsTooltip = false;
        for(let ann of this.announceList) {
          ann.activeMore = false;
        }
        this.announceList[index].activeMore = true;
        setTimeout(() => {
          this.editAccess = this.announceList[index].editAccess;
          this.annTooltip = true;
          this.annId = id;
          this.annIndex = index;
          this.annActionPosition = "bs-popover-left";
          this.positionLeft = event.clientX-120;
          this.positionTop = event.clientY-80;
        }, timeout);
        break;
    }
  }

  onClickedOutside() {
    if(this.tooltipClearFlag && this.annTooltip) {
      this.annTooltip = false;
      this.positionLeft = 0;
      this.positionTop = 0;
      for(let ann of this.announceList) {
        ann.activeMore = false;
      }
    }

    if(this.wsTooltip) {
      this.wsTooltip = false;
    }
  }

  scroll = (event: any): void => {
    console.log(event);
    console.log(event.target.className);
    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
    {

    let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-10;
      this.scrollTop = event.target.scrollTop-90;

     console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+event.target.scrollHeight);
     if((event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
     {
      console.log(111444441);
      this.lazyLoading=true;
      this.loadDataEvent=true;
      this.getAnnounceList();
      event.preventDefault;
     }
    }

  };
}

