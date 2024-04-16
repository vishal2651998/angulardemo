import { Component, ViewChild, HostListener, OnInit, OnDestroy, Input } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ScrollTopService } from '../../../../../services/scroll-top.service';
import { ApiService } from '../../../../../services/api/api.service';
import { CommonService } from '../../../../../services/common/common.service';
import { FilterService } from '../../../../../services/filter/filter.service';
import { MediaManagerService } from '../../../../../services/media-manager/media-manager.service';
import { AddLinkComponent } from '../../../../../components/common/add-link/add-link.component';
import { UploadService } from '../../../../../services/upload/upload.service';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { Constant, MediaTypeInfo, windowHeight } from '../../../../../common/constant/constant';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SuccessModalComponent } from '../../../../../components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from '../../../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../../../components/common/submit-loader/submit-loader.component';
import { ManageListComponent } from '../../../../../components/common/manage-list/manage-list.component';
import * as moment from 'moment';
import { LandingpageService }  from '../../../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @ViewChild('ttmedia') tooltip: NgbTooltip;
  @Input() public mediaServices;
  public sconfig: PerfectScrollbarConfigInterface = {};

  public title:string = 'Media Manager';
  public bodyClass:string = "media-manager";
  public bodyClass1:string = "parts-list";
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public headerFlag: boolean = false;
  public headerData: Object;

  public groupId: number = 20;
  public section: number = 1;
  public filterInterval: any;
  public videoInterval: any;
  public videoFlagInterval: any;

  public searchVal: string = '';
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemTotal: number;
  public itemEmpty: boolean;
  public displayNoRecords: boolean = false;
  public countryId;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;
  public msTeamAccess:boolean=false;
  filesArr: any;
  uploadedFiles: any[] = [];
  attachments: any[] = [];

  //public imageSize: number = 5000000;
  //public videoSize: number = 20000000;
  //public audioSize: number = 5000000;

  public imageSize: number = 1073741824;
  public videoSize: number = 1073741824;
  public audioSize: number = 1073741824;

  public customError: any = [];
  public invalidFileText: string = "Invalid file size";
  public maxUploadText: string = "maximum upload size is";
  public mediaCheckText: string = "";
  public selectTxt: string = "Selected";
  public fileSelectedTxt: string = "";
  public processingTxt: string = MediaTypeInfo.ProcessingTxt;

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;
  public infoHeight: number = 0;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public resize: boolean = false;
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLable: string = "Choose Files";
  public chooseIcon: string = "";

  public thumbView: boolean = true;
  public loading: boolean = true;
  public lazyIn: boolean = false;
  public lazyOut: boolean = false;
  public filterLoading: boolean = true;
  public mediaInfoLoading: boolean = true;
  public mediaInfoFlag: boolean = true;
  public mediaCompressFlag: boolean = true;
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public pageAccess: string = "media";

  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public mediaManagerPath: string = `${this.mediaPath}/manager`;
  public mediaId: number = 0;
  public mediaLists = [];
  public mediaSelectionList:any = [];
  public mediaListExpandFlag: boolean = false;
  public recentLoading: boolean = false;
  public allLoading: boolean = false;
  public recentMediaCount: number = 0;
  public allMediaCount: number = 0;
  public attachmentProgress: boolean = false;
  public uploadFlag: any = null;
  public jobStatusFlag: any = null;
  public progress = 0;
  public percentDone = 0;
  public totalSizeToUpload = 0;
  public loadedSoFar = 0;
  public uploadFileLength: number;
  public successMsg: string = "Uploading...";
  public successFlag: boolean = false;

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public mediaPinType: string = "";
  public pinFlag: boolean = false;
  public pinClass: string = "normal";
  public currentMedia: any;
  public baseApiUrl:string = "";
  public filteredItems: any = [];
  public filterLists: any = [];

  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;
  public tvsDomain: boolean = false;

  public filterOptions: Object = {
    'filterExpand': this.expandFlag,
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': '',
    'filterActive': true,
    'filterHeight': 0,
    'apiKey': '',
    'userId': '',
    'domainId': '',
    'countryId': '',
    'groupId': this.groupId,
    'threadType': '25'
  };

  public filterrecords: boolean = true;
  public mediaData: any = {
    mediaId: this.mediaId,
    mediaPath: this.mediaPath,
    mediaManagerPath: this.mediaManagerPath,
    mediaDetail: false,
    expandFlag: this.expandFlag,
    deleteAccess: false,
    saveAccess: false,
    saveData: '',
    saveIndex: '',
    height: this.infoHeight,
    loader: false,
    lazyLoader: false,
    action: '',
    filterrecords: this.filterrecords
  };

  public mediaInfo: any;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if(this.section == 2) {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight-(this.itemOffset*8);
      this.scrollTop = event.target.scrollTop+80;
      if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if(inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
          this.scrollCallback = false;
          this.getMediaLists();
        }
      }
      this.lastScrollTop = this.scrollTop+1;
    }
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    setTimeout(() => {
      let chkFullScreen = localStorage.getItem('fullscreen');
      console.log(chkFullScreen)
      if(chkFullScreen == null || chkFullScreen == undefined || chkFullScreen == 'undefined') {
        this.bodyHeight = window.innerHeight;
        this.setScreenHeight();
        this.mediaInfoLoading = false;
        this.filterLoading = false;
        setTimeout(() => {
          this.filterLoading = true;
          this.mediaData.mediaList = [];
          this.mediaInfoLoading = true;
        }, 50);
      } else {
        setTimeout(() => {
          localStorage.removeItem('fullscreen');
        }, 250);
      }
    }, 50);
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private apiUrl: ApiService,
    private scrollTopService: ScrollTopService,
    private filterApi: FilterService,
    private mediaApi: MediaManagerService,
    public acticveModal: NgbActiveModal,
    private commonApi: CommonService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private imageCompress: NgxImageCompressService,
    private uploadService: UploadService,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    let teamSystem=localStorage.getItem('teamSystem');
    this.msTeamAccess = (teamSystem) ? true : false;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let msize = localStorage.getItem('uploadMaxSize');
    let mText = localStorage.getItem('uploadMaxSizeText');
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();

    this.imageSize = (msize != 'undefined' && msize!= undefined ) ? parseInt(msize) : this.imageSize;
    this.videoSize = (msize != 'undefined' && msize!= undefined ) ? parseInt(msize) : this.videoSize;
    this.audioSize = (msize != 'undefined' && msize!= undefined ) ? parseInt(msize) : this.audioSize;

    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.footerElem = document.getElementsByClassName('footer-content')[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      let mediaPinFlag:any = localStorage.getItem('mediaPinFlag');

      this.pinFlag = (mediaPinFlag == 'undefined' || mediaPinFlag == undefined) ? false : (mediaPinFlag == 'false') ? false : true;
      this.pinClass = (this.pinFlag) ? "active" : "normal";
      this.mediaData['view'] = (this.thumbView) ? 'thumb' : 'list';
      this.mediaPinType = (this.pinFlag) ? 'pined' : '';
      this.pinClass = (this.pinFlag) ? "active" : "normal";

      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true
      };
      let apiInfo = {
        'accessPage': 'media',
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'searchKey': this.searchVal
      }

      let platformId = localStorage.getItem('platformId');
      if(this.domainId == '52' && platformId == '2' ){
        this.tvsDomain = true;
      }

      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };

      this.mediaInfo = {
        infoLoading: true,
        mediaType: '',
        mediaId: 0,
        accessType: 0,
        exists: false,
        mediaData: [],
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        groupId: this.groupId
      };

      this.filterOptions['apiKey'] = Constant.ApiKey;
      this.filterOptions['userId'] = this.userId;
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;

      this.apiData = apiInfo;
      this.bodyHeight = window.innerHeight;
      let year = parseInt(this.currYear);
      for(let y=year; y>=this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString()
        });
      }

      setTimeout(() => {
        this.setScreenHeight();
        this.apiData["filterOptions"] = {};
        this.apiData['groupId'] = this.groupId;
        this.apiData['mediaId'] = 0;
        // Get Filter Widgets
        this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);

        this.filterInterval = setInterval(()=>{
          let filterWidget = localStorage.getItem('filterWidget');
          let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
          if(filterWidget) {
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.filterLoading = false;
            this.filterOptions['filterLoading'] = this.filterLoading;
            clearInterval(this.filterInterval);
            localStorage.removeItem('filterWidget');
            localStorage.removeItem('filterData');

            // Get Media List
            this.getMediaLists();
          }
        },50);
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);

    } else {
      this.router.navigate(['/forbidden']);
    }

     // help content
     this.commonApi.welcomeContentReceivedSubject.subscribe((response) => {
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if(welcomePopupDisplay == '1'){
        if(this.msTeamAccess){
          setTimeout(() => {
            this.helpContent(0);
          }, 900);
        }
      }
    });
  }

  // Get Media Lists
  getMediaLists() {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['accessType'] = this.section;
    this.apiData['type'] = this.mediaPinType;
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['domainId'] = this.domainId;
    this.apiData['countryId'] = this.countryId;

    switch (this.section) {
      case 1:
        this.recentLoading = true;
        break;
      case 2:
        this.allLoading = true;
        break;
    }

    if(this.section == 2 && this.itemOffset > 0) {
      this.loading = true;
      let lazyIn = this.loading;
      this.mediaData['loader'] = lazyIn;
      this.mediaData['lazyLoader'] = lazyIn;
      this.mediaData['filterrecords'] = this.filterCheck();
      this.lazyIn = lazyIn;
      this.commonApi.emitMediaData(this.mediaData);
    }

    this.mediaApi.getMediaLists(this.apiData).subscribe((response) => {
      let mediaList = response.mediaArr;
      let total = response.total;
      this.recentMediaCount = response.recentMediaCount;
      this.allMediaCount = response.allMediaCount;
      if(response.total == 0) {
        setTimeout(() => {
          this.itemEmpty = true;
        }, 50);
        //if(this.apiData['searchKey'] != '') {
          this.mediaLists = [];
          this.itemEmpty = false;
          this.displayNoRecords = true;
          this.mediaInfoFlag = false;
          this.mediaData['mediaType'] = (this.section == 1) ? 'recent' : 'all';
          this.mediaData['mediaList'] = this.mediaLists;
          this.mediaData['filterrecords'] = this.filterCheck();
        //}
        setTimeout(() => {
          this.commonApi.emitMediaData(this.mediaData);
        }, 50);
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.itemEmpty = false;
        this.itemTotal = total;
        this.itemLength += mediaList.length;
        this.itemOffset += this.itemLimit;
        for(let m in mediaList) {
          this.mediaLists.push(mediaList[m]);
        }
        this.mediaData['mediaType'] = (this.section == 1) ? 'recent' : 'all';
        this.mediaData['mediaList'] = this.mediaLists;
        //let timeOut = (this.itemOffset > 20) ? 1000 : 50;
        let timeOut = 50;
        if(this.itemOffset == 20) {
          setTimeout(() => {
            this.mediaData.mediaId = this.mediaId;
            this.mediaData.filterrecords = this.filterCheck();
            this.commonApi.emitMediaData(this.mediaData);
          }, timeOut);
        }

        if(this.section == 2) {
          setTimeout(() => {
            let listItemHeight = (document.getElementsByClassName('media-gallery')[0].clientHeight);
            if(this.allMediaCount > this.mediaLists.length && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.getMediaLists();
              this.lastScrollTop = this.scrollTop;
            }
          }, 250);
        }
      }

      if(this.section == 2 && this.lazyIn) {
        this.loading = false;
        this.lazyIn = this.loading;
        this.mediaData.mediaId = this.mediaId;
        this.mediaData.loader = this.lazyIn;
        this.mediaData.lazyLoader = this.lazyIn;
        this.mediaData.filterrecords = this.filterCheck();
        //setTimeout(() => {
          this.commonApi.emitMediaData(this.mediaData);
        //}, 50);
        this.lazyOut = true;
      } else {
        this.loading = false;
      }

      switch (this.section) {
        case 1:
          this.recentLoading = false;
          break;
        case 2:
          this.allLoading = false;
          break;
      }
    });
  }

  // if any one filter is ON
  filterCheck(){
    this.filterrecords = false;
    if(this.pinFlag){
      this.filterrecords = true;
    }
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }
    return this.filterrecords;
  }

  // Set Screen Height
  setScreenHeight() {
    let teamSystem=localStorage.getItem('teamSystem');
    if(teamSystem)
    {
      this.innerHeight=windowHeight.heightMsTeam;
      this.filterHeight = windowHeight.heightMsTeam;
      this.filterOptions['filterHeight'] = this.innerHeight;
      this.infoHeight = windowHeight.heightMsTeam;
      this.mediaData['height'] = this.infoHeight;
    }
    else
    {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let titleHeight = document.getElementsByClassName('part-list-head')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+30));
    //this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;
    this.filterHeight = (window.innerHeight);
    this.filterOptions['filterHeight'] = this.innerHeight;
    this.innerHeight = this.innerHeight-titleHeight+10;
    this.infoHeight = this.innerHeight-titleHeight+10;
    this.mediaData['height'] = this.infoHeight;
    }
  }

  // Section Change
  sectionChange(action) {
    if((action == 2 && this.recentLoading) || (action == 1 && this.allLoading)) {
      return false;
    }
    if(this.section != action) {
      this.mediaId = 0;
      this.mediaData.mediaId = this.mediaId;
      this.recallMedia(action);
    }
  }

  // Recall Media List
  recallMedia(action) {
    this.mediaId = 0;
    this.loading = true;
    this.section = action;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.itemTotal = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.itemEmpty = false;
    this.displayNoRecords = false;
    this.mediaLists = [];
    this.mediaInfo.mediaId = 0;
    this.mediaInfoFlag = false;
    setTimeout(() => {
      this.mediaInfoFlag = true;
    }, 50);
    this.apiData['accessType'] = this.section;
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.getMediaLists();
  }

  // Apply Search
  applySearch(action, val) {
    if(this.searchVal == "" && val == "" && action == 'emit'){}
    else{
      this.searchVal = val;
      this.apiData['searchKey'] = this.searchVal;
      this.apiData['type'] = this.mediaPinType;
      this.mediaId = 0;
      this.itemLimit = 20;
      this.itemOffset = 0;
      this.scrollInit = 0;
      this.lastScrollTop = 0;
      this.scrollCallback = true;
      this.itemEmpty = false;
      this.displayNoRecords = false;
      this.mediaLists = [];
      this.apiData['accessType'] = this.section;
      this.apiData['limit'] = this.itemLimit;
      this.apiData['offset'] = this.itemOffset;

      this.loading = true;
      this.mediaInfoFlag = false;
      this.mediaInfoLoading = false;

      this.headerData['searchKey'] = this.searchVal;
      if(action == 'reset') {
        this.ngOnInit();
      } else {
        if(action == 'emit') {
          this.headerFlag = true;
        }
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';
        this.getMediaLists();

        setTimeout(() => {
          if(action == 'init') {
            this.headerFlag = true;
          }
        }, 500);
      }
    }
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.commonApi.emitMessageLayoutChange(toggleFlag);
    /*this.loading = true;
    this.initMediaLists('filter');*/
  }

  // Apply Filter
  applyFilter(filterData) {
    console.log(filterData)
    this.mediaId = 0;
    let resetFlag = filterData.reset;

    if(!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.apiData['filterOptions'] = filterData;

      // Setup Filter Active Data
      this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;

      this.applySearch('get', this.searchVal);
      setTimeout(() => {
        this.filterLoading = false;
      }, 700);

    } else {
      localStorage.removeItem('mediaFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.mediaId = 0;
    this.filterLoading = true;
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    this.applySearch('reset', this.searchVal);
    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
  }

  // Upload Files
  onUpload(event) {
    let apiUrl = `${this.baseApiUrl}/forum/GetworkstreamsList`;
    let selectionType = 'multiple';
    let innerHeight = this.innerHeight;
    let access = 'mediaUpload';
    let title = 'Select Workstream';
    let action = false;
    let inputData = {
      actionApiName: '',
      actionQueryValues: '',
      apiUrl: apiUrl,
      baseApiUrl: this.baseApiUrl,
      field: 'Media Manager',
      filteredItems: this.filteredItems,
      filteredLists: this.filterLists,
      selectionType: selectionType,
      title: title
    };
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      type: 1
    }
    if(this.tvsDomain) {
      this.initOnUpload(event);
    } else {
      const modalRef = this.modalService.open(ManageListComponent, this.config);
      modalRef.componentInstance.access = access;
      modalRef.componentInstance.accessAction = action;
      modalRef.componentInstance.filteredTags = this.filteredItems;
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.inputData = inputData;
      modalRef.componentInstance.height = innerHeight;
      modalRef.componentInstance.commonApiValue = '';
      modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
        let response = receivedService;
        this.filteredItems = [];
        this.filterLists = [];
        response.forEach(item => {
          this.filteredItems.push(item.id);
          this.filterLists.push(item.name);
        });
        console.log(receivedService);
        console.log(event);
        this.initOnUpload(event);
      });
    }
  }

  initOnUpload(event) {
    let i = 1;
    this.uploadFileLength = this.uploadedFiles.length;
    this.filesArr = event;
    let files = event.currentFiles;
    let filesLen = files.length;
    console.log(filesLen)
    for(let file of files) {
      let flag = true;
      let fileType = file.type.split('/');
      let fileExtn = file.name.split('.').pop();
      let fileAttachment = [];
      let fname = file.name;
      let displayOrder = this.uploadFileLength+i;
      let lastDot = fname.lastIndexOf('.');
      let fileName = fname.substring(0, lastDot);
      let fileIndex = i-1;

      fileAttachment['fileId'] = 0;
      fileAttachment['fileType'] = file.type;
      fileAttachment['fileSize'] = file.size;
      fileAttachment['originalName'] = file.name;
      fileAttachment['originalFileName'] = file.name;
      fileAttachment['fileCaption'] = fileName;
      fileAttachment['captionFlag'] = false;
      fileAttachment['action'] = "new";
      fileAttachment['progress'] = 0;
      fileAttachment['cancelFlag'] = false;
      fileAttachment['valid'] = true;
      fileAttachment['workstreams'] = JSON.stringify(this.filteredItems);
      file['fileCaption'] = fileName;
      file['captionFlag'] = false;
      file['displayOrder'] = this.uploadFileLength+displayOrder;

      let mediaFlag;
      const mediaFormData = new FormData();
      mediaFormData.append('apiKey', this.apiData['apiKey']);
      mediaFormData.append('domainId', this.apiData['domainId']);
      mediaFormData.append('countryId', this.apiData['countryId']);
      mediaFormData.append('userId', this.apiData['userId']);
      mediaFormData.append('fileName', file.name);
      mediaFormData.append('workstreams', JSON.stringify(this.filteredItems));

      this.mediaApi.checkMediaName(mediaFormData).subscribe((response) => {
        console.log(response)
        mediaFlag = (response.status == 'Success') ? true : false;
        flag = mediaFlag;
        let msg = response.result
        if(!mediaFlag) {
          this.invalidFileText = msg;
          this.setErrMsg(fname, -1);
          filesLen = filesLen - 1;
          this.filesArr.currentFiles.splice(fileIndex, 1);
          fileAttachment.splice(fileIndex, 1);
        } else {
          this.initFileUpload(file, fileIndex, fileAttachment, filesLen);
        }
      });
      i++;
    }
  }

  // Init Media File Upload
  initFileUpload(file, fileIndex, fileAttachment, filesLen) {
    let flag = true;
    let fileType = file.type.split('/');
    console.log(fileType)
    switch(fileType[0]) {
      case 'image':
        if(!this.attachmentProgress) {
          this.attachmentProgress = true;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          console.log("event", event);
          let localUrl = event.target.result;
          this.compressFile(fileType[0], fileAttachment, file, localUrl, filesLen);
        }
        break;
      case 'video':
        if(!this.attachmentProgress) {
          this.attachmentProgress = true;
        }
        flag = this.validateFileSize(fileType[0], file.size);
        console.log(flag)
        fileAttachment['flagId'] = 2;
        setTimeout(() => {
          let vidSize = '20MB';
          if(!flag) {
            this.setErrMsg(file.name, vidSize);
          } else {
            this.mediaCompressFlag = true;
            fileAttachment['thumbFilePath'] = 'assets/images/media/video-thumb.png';
            // Setup Uploaded Files
            this.setupUploadedFiles(fileAttachment, file, filesLen);
          }
        }, 500);
        break;
      case 'audio':
        if(!this.attachmentProgress) {
          this.attachmentProgress = true;
        }
        flag = this.validateFileSize(fileType[0], file.size);
        fileAttachment['flagId'] = 3;
        setTimeout(() => {
          let audSize = '5MB';
          if(!flag) {
            this.setErrMsg(file.name, audSize);
          } else {
            this.mediaCompressFlag = true;
            fileAttachment['thumbFilePath'] = 'assets/images/media/audio-medium.png';
            // Setup Uploaded Files
            this.setupUploadedFiles(fileAttachment, file, filesLen);
          }
        }, 500);
        break;
      default:
        if(this.uploadFileLength == 1) {
          this.attachmentProgress = false;
        }
        break;
    }
    setTimeout(() => {
      if(!flag) {
        this.filesArr.currentFiles.splice(fileIndex, 1);
      }
    }, 500);
  }


  // Compress Image
  compressFile(fileType, fileAttachment, file, image, filesLen) {
    let orientation = -1;
    let originalImageSize = this.imageCompress.byteCount(image);
    console.warn('Size in bytes is now:',  originalImageSize);
    this.imageCompress.compressFile(image, orientation, 75, 50).then(result => {
      let imgResultAfterCompress = result;
      let sizeOFCompressedImage = this.imageCompress.byteCount(result);
      console.warn('Size in bytes after compression:',  sizeOFCompressedImage);

      // call method that creates a blob from dataUri
      let compressImg = imgResultAfterCompress.split(',');
      const imageBlob = this.dataURItoBlob(compressImg);
      let flag = this.validateFileSize(fileType, sizeOFCompressedImage);
      console.log('flag: ', flag);
      fileAttachment['flagId'] = 1;
      setTimeout(() => {
        let imgSize = '5MB';
        this.mediaCompressFlag = true;
        if(!flag) {
          this.mediaCompressFlag = false;
          this.setErrMsg(file.name, imgSize);
        } else {
          fileAttachment['fileSize'] = sizeOFCompressedImage;
          fileAttachment['thumbFilePath'] = (imgResultAfterCompress != undefined) ? imgResultAfterCompress : 'assets/images/media/image-thumb.png';
          const imageFile = new File([imageBlob], file.name, {type: file.type});
          imageFile['captionFlag'] = file.captionFlag;
          imageFile['fileCaption'] = file.fileCaption;
          imageFile['displayOrder'] = file.displayOrder;
          // Setup Uploaded Files
          this.setupUploadedFiles(fileAttachment, imageFile, filesLen);
        }
      }, 500);
    });
  }

  // Setup Uploaded Files
  setupUploadedFiles(fileAttachment, file, filesLen) {
    fileAttachment['fileSize'] = this.commonApi.niceBytes(fileAttachment['fileSize']);
    //this.uploadedFiles = [];
    this.uploadedFiles.push(file);

    fileAttachment['filePath'] = file['thumbFilePath'];
    fileAttachment['uploadStatus'] = 0;
    this.attachments.push(fileAttachment);
    this.mediaCompressFlag = false;
    setTimeout(() => {
      filesLen = this.filesArr.currentFiles.length;
      console.log(this.attachments, this.filesArr.currentFiles)
      console.log(this.attachments.length, this.filesArr.currentFiles.length, filesLen)
      if(this.attachments.length == filesLen) {
        this.attachmentUpload();
      }
    }, 100);
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI[1]);
    const mimeString = dataURI[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: mimeString });
    return blob;
  }

  // Validate Max File Size
  public validateFileSize(type, size) {
    let flag;
    switch(type) {
      case 'image':
        flag = (this.imageSize < size) ? false : true;
        break;
      case 'video':
        flag = (this.videoSize < size) ? false : true;
        break;
      case 'audio':
        flag = (this.audioSize < size) ? false : true;
        break;
    }
    return flag;
  }

  // Set Error Message
  setErrMsg(fname, mSize) {
    this.customError.push({
      fileName: fname,
      maxSize: mSize
    });
  }

  // Remove Error Messae
  removeMessage(i) {
    this.customError.splice(i, 1);
  }

  // Calculate Total File Size
  calculateTotalSize(): number {
    let total = 0;
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      total += this.uploadedFiles[i].size;
    }
    return total;
  }

  // Add Link
  addLink() {
    if(this.tvsDomain) {
      this.mediaLink();
    } else {
      let apiUrl = `${this.baseApiUrl}/forum/GetworkstreamsList`;
      let selectionType = 'multiple';
      let innerHeight = this.innerHeight;
      let access = 'mediaUpload';
      let title = 'Select Workstream';
      let action = false;
      let inputData = {
        actionApiName: '',
        actionQueryValues: '',
        apiUrl: apiUrl,
        baseApiUrl: this.baseApiUrl,
        field: 'Media Manager',
        filteredItems: this.filteredItems,
        filteredLists: this.filterLists,
        selectionType: selectionType,
        title: title,
      };
      let apiData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        type: 1
      }
      const modalRef = this.modalService.open(ManageListComponent, this.config);
      modalRef.componentInstance.access = access;
      modalRef.componentInstance.accessAction = action;
      modalRef.componentInstance.filteredTags = this.filteredItems;
      modalRef.componentInstance.apiData = apiData;
      modalRef.componentInstance.inputData = inputData;
      modalRef.componentInstance.height = innerHeight;
      modalRef.componentInstance.commonApiValue = '';
      modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
        let response = receivedService;
        this.filteredItems = [];
        this.filterLists = [];
        response.forEach(item => {
          this.filteredItems.push(item.id);
          this.filterLists.push(item.name);
        });
        console.log(receivedService)
        this.mediaLink();
      });
    }
  }

  // Media Link
  mediaLink() {
    const modalRef = this.modalService.open(AddLinkComponent, this.config);
      modalRef.componentInstance.workstreams = this.filteredItems;
      modalRef.componentInstance.mediaServices.subscribe((receivedService) => {
        modalRef.dismiss('Cross click');
        this.filteredItems = [];
        this.filterLists = [];
        if(receivedService){
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = receivedService.result;
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');
            this.applySearch('init', this.searchVal);
          }, 5000);
        }
      });
  }

  // Pined Media List
  pinnedMediaList(flag) {
    this.pinFlag = flag;
    this.mediaPinType = (flag) ? 'pined' : '';
    this.pinClass = (flag) ? 'active' : 'normal';
    localStorage.setItem('mediaPinFlag', flag);
    this.headerFlag = true;
    this.mediaLists = [];
    this.mediaSelectionList = [];
    this.fileSelectedTxt = "";
    this.applySearch('pin', this.searchVal);
  }

  // Change the view
  viewType(actionFlag) {
    this.thumbView = (actionFlag) ? false : true;
    let viewType = (this.thumbView) ? 'thumb' : 'list';
    this.mediaData['view'] = viewType;
    this.setScreenHeight();
    this.initMediaLists('init');
    if(this.thumbView) {
      let secElement = document.getElementById('gallery');
      setTimeout(() => {
        let scrollPos = 0;
        secElement.scrollTop = scrollPos;
      }, 200);
    }
    if(this.thumbView && this.section == 2) {
      setTimeout(() => {
        console.log('In Thumb View')
        let listItemHeight = (document.getElementsByClassName('media-gallery')[0].clientHeight);
        listItemHeight = listItemHeight != undefined ? listItemHeight : 0;
        console.log('Window Height: '+this.innerHeight)
        console.log('List Height '+listItemHeight)
        if(this.allMediaCount > this.mediaLists.length && this.innerHeight >= listItemHeight) {
          console.log('In Lazy loading')
          this.scrollCallback = false;
          this.getMediaLists();
          this.lastScrollTop = this.scrollTop;
        }
      }, 250);
    }
  }

  // Init Media Lists
  initMediaLists(action) {
    //this.loading = true;
    setTimeout(() => {
      //this.loading = false;
      if(this.mediaId > 0) {
        let mid = this.mediaId;
        this.mediaData['mediaId'] = mid;
        let mi = this.mediaLists.findIndex(option => option.mediaId == mid);
        this.mediaLists[mi].activeMode = true;
      }
      this.mediaData['filterrecords'] = this.filterCheck();
      this.mediaData['mediaList'] = this.mediaLists;
      this.commonApi.emitMediaData(this.mediaData);
    }, 150);

    if(action == 'filter') {
      this.mediaData['expandFlag'] = this.expandFlag;
    }
  }

  // Media Selection
  mediaSelection(data) {
    this.mediaInfoFlag = false;
    this.mediaInfoLoading = false;
    for(let am of this.mediaLists) {
      am.activeMode = false;
    }

    let flag = data.action;
    let access = data.callback;
    let mid = data.mid;
    let mindex = this.mediaSelectionList.findIndex(option => option.mid == mid);
    let fileTxt = 'File';
    switch (flag) {
      case 1:
        if(mindex < 0) {
          this.mediaSelectionList.push({
            mid: mid,
            type: access
          });
          fileTxt = (this.mediaSelectionList.length > 1) ? `${fileTxt}s` : fileTxt
          this.fileSelectedTxt = `${this.mediaSelectionList.length} ${fileTxt} ${this.selectTxt}`;
        } else {
          this.mediaSelectionList[mindex].type = 'both';
        }
        break;
      default:
        this.mediaSelectionList.splice(mindex, 1);
        fileTxt = (this.mediaSelectionList.length > 1) ? `${fileTxt}s` : fileTxt
        this.fileSelectedTxt = `${this.mediaSelectionList.length} ${fileTxt} ${this.selectTxt}`;
        for(let am of this.mediaLists) {
          if(am.mediaId == mid) {
            am.selectionMode = false;
          }
        }
        this.mediaListExpandFlag = true;
        setTimeout(() => {
          this.mediaListExpandFlag = false;
        }, 150);
        break;
    }
    let mlength = this.mediaSelectionList.length;
    this.headerCheck = (mlength > 0) ? 'checked' : 'unchecked';
  }

  // Expand Media Info
  expandMediaInfo(flag) {
    this.commonApi.emitMessageLayoutChange(flag);
    if(flag != 'checked' || flag != 'all') {
      console.log(this.mediaInfoFlag)
      let access = (this.section == 1) ? 'recent' : 'all';
      let data = {
        action: false,
        access: access,
        mid: this.mediaId,
        type: 'expand'
      }
      for(let rm of this.mediaLists) {
        if(rm.mediaId == this.mediaId) {
          rm.activeMode = true;
        }
      }
      this.toggleAction(data);
    }
  }

  // Toggle Action
  toggleAction(data) {
    console.log(data)
    console.log(this.mediaData.deleteAccess)
    let flag = data.action;
    let loadFlag = (data.type == 'get') ? true : false;
    this.mediaInfo.exists = (this.mediaId == data.mid) ? true : false;
    let type = (this.mediaInfo.exists && !this.mediaInfoFlag) ? 'expand' : data.type;
    let access = (type != 'expand' && this.mediaInfo.exists) ? 'exists' : data.access;
    let mid, mindex;
    this.headerCheck = "unchecked";
    this.mediaSelectionList = [];
    this.fileSelectedTxt = "";
    switch (access) {
      case 'recent':
      case 'all':
        mid = data.mid;
        this.mediaId = (this.mediaData.deleteAccess) ? this.mediaId : mid;
        this.mediaInfo.infoLoading = true,
        this.mediaInfo.mediaId = this.mediaId;
        this.mediaInfo.mediaType = data.access;
        this.mediaInfo.accessType = this.section;
        console.log(loadFlag)
        if(loadFlag) {
          this.mediaListExpandFlag = false;
          this.mediaData.infoLoading = false;
          this.mediaInfoLoading = false;
          setTimeout(() => {
            this.mediaInfoLoading = true;
          }, 150);
          this.mediaData['deleteAccess'] = false;
        }

        if(type == 'init' || type == 'expand') {
          console.log(type, mid, this.mediaId)
          if(type == 'expand') {
            this.mediaData.mediaId = mid;
            this.mediaData.mediaDetail = true;
            this.mediaInfo.mediaData = this.currentMedia;
            this.mediaData.filterrecords = this.filterCheck();
            this.commonApi.emitMediaData(this.mediaData);
            setTimeout(() => {
              this.mediaData.mediaDetail = false;
            }, 500);
          }
          this.mediaInfoLoading = false;
          setTimeout(() => {
            this.mediaInfoLoading = true;
          }, 150);
        }
        break;
      case 'save':
        mid = data.mediaId;
        mindex = this.mediaLists.findIndex(option => option.mediaId == mid);
        let minfo = data.mediaInfo;
        this.mediaLists[mindex] = minfo;
        this.mediaData['mediaId'] = mid;
        this.mediaData['mediaDetail'] = true;
        this.mediaData['mediaList'] = this.mediaLists;
        this.mediaData['saveAccess'] = true;
        this.mediaData['saveData'] = minfo;
        this.mediaData['saveIndex'] = mindex;
        this.mediaData['filterrecords'] = this.filterCheck();
        this.commonApi.emitMediaData(this.mediaData);
        this.lazyIn = true;
        setTimeout(() => {
          this.lazyIn = false;
        }, 150);
        break;
      case 'detail':
        this.currentMedia = data.mediaData;
        break;
      case 'delete':
        this.allMediaCount = this.allMediaCount - 1;
        mid = data.mediaId;
        mindex = this.mediaLists.findIndex(option => option.mediaId == mid);
        console.log(mid)
        console.log(this.mediaLists.length+'::'+(mindex+1))
        let currIndex = (this.mediaLists.length-1 == (mindex)) ? mindex-1 : mindex+1;
        console.log(currIndex, this.mediaLists[currIndex])
        if(currIndex >= 0) {
          this.mediaLists[currIndex].activeMode = true;
        }
        console.log(currIndex)
        this.mediaId = (currIndex <= 0) ? -1 : this.mediaData.mediaList[currIndex].mediaId;
        this.mediaData['deleteAccess'] = true;
        this.mediaData['mediaId'] = this.mediaId;
        this.mediaLists.splice(mindex, 1);
        this.mediaData['mediaList'] = this.mediaLists;
        this.mediaData['filterrecords'] = this.filterCheck();
        this.commonApi.emitMediaData(this.mediaData);
        break;
      case 'exists':
        this.mediaInfo.mediaData = this.currentMedia;
        break;
      default:
        for(let rm of this.mediaLists) {
          rm.activeMode = false;
        }

        this.mediaListExpandFlag = true;
        setTimeout(() => {
          this.mediaListExpandFlag = false;
        }, 150);
        this.mediaInfoLoading = false;
      break;
    }

   // if(loadFlag) {
      this.toggleInfo(flag);
    //}
  }

  // Toogle Media Info Flag
  toggleInfo(flag) {
    console.log(flag)
    //this.mediaId = 0;
    //if(flag) {
      this.mediaInfoFlag = !flag;
    //}
  }

  // Clear All Media Selection
  clearAll() {
    //this.mediaId = 0;
    this.mediaSelectionList = [];
    this.fileSelectedTxt = "";
    for(let rm of this.mediaLists) {
      rm.selectionMode = false;
      rm.activeMode = false;
    }
    this.mediaListExpandFlag = true;
    setTimeout(() => {
      this.mediaListExpandFlag = false;
      this.headerCheck = 'unchecked';
      this.headercheckDisplay = 'checkbox-hide';
    }, 150);
  }

  // Delete Multiple Media
  deleteMedia() {
    let loaderClass = "submit-loader";
    console.log(this.mediaSelectionList)
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if(receivedService) {
        this.bodyElem.classList.add(loaderClass);
        let mediaId = [];
        for(let rm of this.mediaSelectionList) {
          mediaId.push(rm.mid.toString());
          let mi = this.mediaLists.findIndex(option => option.mediaId == rm.mid);
          console.log(mi)
          this.mediaLists.splice(mi, 1);
          this.mediaData.mediaList.splice(mi, 1);
        }

        let apiData = {
          apiKey: this.mediaInfo.apiKey,
          domainId: this.mediaInfo.domainId,
          countryId: this.mediaInfo.countryId,
          userId: this.mediaInfo.userId,
          mediaId: mediaId
        }

        const msgModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
        this.mediaId = (this.mediaLists.length == 0) ? -1 : this.mediaLists[0].mediaId;
        if(this.mediaId < 0) {
          this.headerCheck = 'unchecked';
        }

        this.mediaApi.deleteMedia(apiData).subscribe((response) => {
          msgModalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(loaderClass);
          /*for(let rm of this.mediaSelectionList) {
            let mi = this.mediaLists.findIndex(option => option.mediaId == rm.mid);
            console.log(mi)
            this.mediaLists.splice(mi, 1);
            this.mediaData.mediaList.splice(mi, 1);
          }*/
          console.log(this.mediaData.mediaList)

          this.mediaId = (this.mediaLists.length == 0) ? -1 : this.mediaLists[0].mediaId;
          if(this.mediaId < 0) {
            this.headerCheck = 'unchecked';
          }
          console.log(this.allMediaCount,mediaId.length)
          this.allMediaCount = this.allMediaCount - mediaId.length;
          this.mediaData['deleteAccess'] = true;
          this.mediaData['mediaId'] = this.mediaId;
          this.mediaData['mediaList'] = this.mediaLists;
          this.mediaData['filterrecords'] = this.filterCheck();
          this.commonApi.emitMediaData(this.mediaData);
        });
      }
    });
  }

  // File upload
  async attachmentUpload() {
    localStorage.removeItem('jobPosted');
    this.customError = [];
    let uploadCount = this.uploadedFiles.length;
    console.log(uploadCount)

    for(let u in this.uploadedFiles) {
      this.attachments[u]['access'] = this.apiData['access'];
      this.attachments[u]['apiKey'] = this.apiData['apiKey'];
      this.attachments[u]['domainId'] = this.apiData['domainId'];
      this.attachments[u]['countryId'] = this.apiData['countryId'];
      this.attachments[u]['userId'] = this.apiData['userId'];
      this.attachments[u]['displayOrder'] = this.uploadedFiles[u]['displayOrder'];
      this.attachments[u]['uploadCount'] = uploadCount;
      this.attachments[u]['uploadFlag'] = true;
      this.attachments[u]['processFlag'] = false;
      let size = this.uploadedFiles[u].size;
      //this.totalSizeToUpload = size;
      this.totalSizeToUpload = this.calculateTotalSize();
      this.attachments[u]['progress'] = 0;

      this.attachmentProgress = true;
      if(!this.attachments[u].cancelFlag) {
        console.log(u, this.attachments[u])
        this.filesArr.currentFiles.splice(u);
        await this.uploadFile(u, this.attachments[u], this.uploadedFiles[u]);
      }
    }
  }

  // Upload File
  uploadFile(index, fileInfo, attachment) {
    let i = parseInt(index)+1;
    let uploadLen = this.uploadedFiles.length;
    let totalTemp = 0;
    //this.totalSizeToUpload -= attachment.size;
    return new Promise<void>((resolve, reject) => {
      this.uploadFlag = this.uploadService.upload(this.pageAccess, fileInfo, attachment).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            /*this.loadedSoFar = totalTemp + event.loaded;
            this.percentDone = Math.round(100 * this.loadedSoFar / this.totalSizeToUpload);
            console.log(index+'::'+this.percentDone)
            this.attachments[index]['progress'] = this.percentDone;
            console.log(`Uploaded! ${this.percentDone}%`);*/

            let progress = Math.round(100 * event.loaded / event.total);
            this.attachments[index]['progress'] = progress;
            console.log(`Uploaded! ${this.attachments[index]['progress']}%`);
            break;
          case HttpEventType.Response:
            totalTemp = this.loadedSoFar;
            let fileType = this.attachments[index]['flagId'];
            let flag = (fileType == 2) ? false : true;
            this.percentDone = (fileType == 2) ? 99 : 100;
            this.attachments[index]['progress'] = this.percentDone;
            this.attachments[index]['uploadStatus'] = 1;
            console.log(fileType, this.attachments[index], this.uploadedFiles, event)

            if(fileType == 2) {
              let c = 0;
              let jobId = event.body.data.jobId;
              console.log(jobId);
              if(jobId != '') {
                this.attachments[index]['processFlag'] = true;
                this.percentDone = 100;
                this.attachments[index]['progress'] = this.percentDone;
                this.checkJobStatus(jobId, c);
                this.videoFlagInterval = setInterval(()=>{
                  let chkVideoFlag:any = localStorage.getItem('jobPosted');
                  console.log(chkVideoFlag)
                  if(chkVideoFlag) {
                    this.jobStatusFlag.unsubscribe();
                    clearInterval(this.videoFlagInterval);
                    localStorage.removeItem('jobPosted');
                    this.attachments[index]['processFlag'] = false;
                    console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
                    console.log(i+'::'+uploadLen);
                    setTimeout(() => {
                      if(this.jobStatusFlag){
                        this.jobStatusFlag.unsubscribe();
                      }
                    }, 100);
                    if(i == uploadLen) {
                      this.jobStatusFlag.unsubscribe();
                      this.uploadCallback(uploadLen);
                      //console.log(msg, event.body);
                    } else {
                      resolve();
                    }
                  }
                }, 100);
              }
            }

            if(flag) {
              console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
              console.log(i+'::'+uploadLen)
              if(i == uploadLen) {
                this.uploadCallback(uploadLen);
                //console.log(msg, event.body);
              } else {
                resolve();
              }
            }
            break;
        }
      },
      err => {
        this.progress = 0;
      });
    })
  }

  // Check Job Status
  checkJobStatus(jobId, i) {
    let data = {
      apiKey: Constant.ApiKey,
      jobId: jobId
    };
    this.jobStatusFlag = this.commonApi.checkJobStatus(data).subscribe((response: any) => {
      console.log(i, response.status, response.jobStatus)
      if(response.jobStatus == 'Complete' || response.jobStatus == 'Error') {
        let flag: any = true;
        localStorage.setItem('jobPosted', flag);
        clearInterval(this.videoInterval);
      } else {
        this.videoInterval = setInterval(()=>{
          if(this.jobStatusFlag){
            this.jobStatusFlag.unsubscribe();
          }
          this.checkJobStatus(jobId, i);
        }, 10000);
      }
    });
  }

  // upload CallBack
  uploadCallback(uploadLen) {
    let fileTxt = 'File';
    fileTxt = (uploadLen > 1) ? `${fileTxt}s` : fileTxt;
    let msg = `${fileTxt} successfully uploaded!`;
    this.successMsg = msg;
    this.attachmentProgress = false;
    this.uploadedFiles = [];
    this.attachments = [];
    this.filteredItems = [];
    this.filterLists = [];
    const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
    msgModalRef.componentInstance.successMessage = this.successMsg;
    setTimeout(() => {
      msgModalRef.dismiss('Cross click');
      this.applySearch('init', this.searchVal);
    }, 5000);
  }

  // Cancel Upload
  cancelUpload(i) {
    let progress = this.attachments[i].progress;
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel Upload';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if(receivedService) {
        this.uploadedFiles.splice(i, 1);
        this.attachments.splice(i, 1);
        this.filesArr.currentFiles.splice(i);
        if(this.attachments.length == 0) {
          this.attachmentProgress = false;
        }
        if(progress > 0 && this.attachments.length > 0) {
          this.uploadFlag.unsubscribe();
          this.attachmentUpload();
        }
      }
    });
  }

  // helpContent list and view
  helpContent(id){
    id = (id>0) ? id : '';
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('tooltipId', id);

    this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        if(id == ''){
        let contentData = response.tooltips;
        for (let cd in contentData) {
          let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
          if(welcomePopupDisplay == '1'){
            if(contentData[cd].id == '3' && contentData[cd].viewStatus == '0' ){
            console.log(contentData[cd].title);
            this.thelpContentStatus = contentData[cd].viewStatus;
            this.thelpContentFlagStatus = true;
            this.thelpContentId = contentData[cd].id;
            this.thelpContentTitle = contentData[cd].title;
            this.thelpContentContent = contentData[cd].content;
            this.thelpContentIconName = contentData[cd].itemClass;
            }
          }
        }
        if(this.thelpContentFlagStatus){
            this.tooltip.open();
        }
        }
        else{
        console.log(response.result);
        this.tooltip.close();
        }
      }
    });
  }

  copyLink(){
    /*alert(type)
    var link = url;
    navigator.clipboard.writeText(link);
    this.copiedModal = true;
    setTimeout(() => {
      this.copiedModal = false;
    }, 1500);*/
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
