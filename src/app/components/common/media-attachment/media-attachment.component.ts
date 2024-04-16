import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { CommonService } from "src/app/services/common/common.service";
import { MediaManagerService } from 'src/app/services/media-manager/media-manager.service';
import { Constant, pageInfo } from 'src/app/common/constant/constant';
import { NgxMasonryComponent } from 'ngx-masonry';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as moment from 'moment';
import { Subscription } from "rxjs";
declare var $: any;
declare var lightGallery: any;

@Component({
  selector: 'app-media-attachment',
  templateUrl: './media-attachment.component.html',
  styleUrls: ['./media-attachment.component.scss']
})
export class MediaAttachmentComponent implements OnInit {
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() apiData: any;
  @Input() mediaSelectionList: any = [];
  @Input() attachmentList: any = [];
  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public filterLoading: boolean = true;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public pageAccess: string = "media-upload";
  public mediaType: string = "all";
  public pageData = pageInfo.partsPage;
  public groupId: number = 20;
  public filterrecords: boolean = true;
  public filterInterval: any;
  public userId: any;
  public domainId: any;
  public countryId: any;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public searchVal: string = '';
  public mediaList: any = [];
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemTotal: number;
  public itemEmpty: boolean;
  public displayNoRecords: boolean = false;
  public updateMasonryLayout: boolean = false;
  public mediaView: string = "thumb";
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public mediaManagerPath: string = `${this.mediaPath}/manager`;
  public lg: any;
  public lgTimeOut: number = 0.5;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public empty: any = [];

  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
  };
  
  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
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
 
  constructor(
    private commonApi: CommonService,
    private mediaApi: MediaManagerService
  ) { }

  ngOnInit(): void {
    if(!document.body.classList.contains("landing-page")) {
      document.body.classList.add("landing-page");
    }
    this.userId = this.apiData.userId;
    this.domainId = this.apiData.domainId;
    this.countryId = this.apiData.countryId;
    let apiInfo = {
      accessPage: 'upload',
      apiKey: Constant.ApiKey,
      userId: this.apiData.userId,
      domainId: this.apiData.domainId,
      countryId: this.apiData.countryId,
      searchKey: this.searchVal
    }
    this.filterOptions['apiKey'] = Constant.ApiKey;
    this.filterOptions['userId'] = this.userId;
    this.filterOptions['domainId'] = this.domainId;
    this.filterOptions['countryId'] = this.countryId;
    this.apiData = apiInfo;
    this.apiData['groupId'] = this.groupId;
    this.apiData['mediaId'] = 0;

    console.log(this.attachmentList)

    let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString()
      });
    }

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

    this.subscription.add(
      this.commonApi.mediaUploadDataSubject.subscribe((response) => {
        let access = response['access'];
        switch(access) {
          case 'media':
            this.checkMediaUpdate(response);
            break;
        }
      })
    );
  }

  checkMediaUpdate(data) {
    let action = data.action;
    switch(action) {
      case 'search':
        this.searchVal = data['searchVal'];
        this.applySearch('get', this.searchVal);
        break;
      case 'view':
        this.mediaView = data['viewType'];
        break;  
    }
  }

  // Get Media List
  getMediaLists() {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.apiData['access'] = 'upload';
    this.apiData['accessType'] = 2;
    this.apiData['type'] = '';
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['domainId'] = this.domainId;
    this.apiData['countryId'] = this.countryId;
    this.loading = (this.itemOffset == 0) ? true : false;
    if(this.itemOffset > 0) {
      this.lazyLoading = true;     
    }
    this.mediaApi.getMediaLists(this.apiData).subscribe((response) => {
      //console.log(response)
      let total = response.total;
      let mediaList = response.mediaArr;
      this.loading = false;
      this.lazyLoading = this.loading;
      if(total == 0) {
        setTimeout(() => {
          this.itemEmpty = true;
        }, 50);
        this.mediaList = [];
        this.itemEmpty = false;
        this.displayNoRecords = true;
      } else {
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.itemEmpty = false;
        this.itemTotal = total;
        this.itemLength += this.mediaList.length;
        this.itemOffset += this.itemLimit;
        for(let a in mediaList) {
          let ext = mediaList[a].fileExtension;
          //console.log(mediaList[a])
          mediaList[a].fileCaption = (mediaList[a].fileCaption == '' || mediaList[a].fileCaption == undefined || mediaList[a].fileCaption == 'undefined') ? '' : mediaList[a].fileCaption;
          let caption = mediaList[a].fileCaption.split('.');
          let captionSplit = (caption.length > 1) ? caption[0] : mediaList[a].fileCaption;
          let captionTruncate = captionSplit.substring(0, 12) + '..';
          
          let attachmentType = mediaList[a].flagId;
          mediaList[a].galleryHidden = `video-${a}`;
          mediaList[a].galleryId = `#${mediaList[a].galleryHidden}`;
          mediaList[a].posterImg = "";
          mediaList[a].downloadUrl = "";
          mediaList[a].fileImg = mediaList[a].filePath;
          let createdDate = moment.utc(mediaList[a].createdOn).toDate(); 
          let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
          mediaList[a].createdOn = (mediaList[a].createdOn == "") ? '-' : localCreatedDate;
          let selectFlag = this.mediaSelectionList.includes(mediaList[a].mediaId);
          //console.log(mediaList[a].mediaId, selectFlag)
          if(!selectFlag) {
            selectFlag = this.attachmentList.includes(mediaList[a].mediaId);
            //console.log(selectFlag)
          }
          mediaList[a].selectionMode = selectFlag;
          mediaList[a].linkImg = 'default';
  
          if(attachmentType < 6) {
            mediaList[a].fileSize = this.commonApi.niceBytes(mediaList[a].fileSize);            
          }
    
          switch(attachmentType) {
            case 1:
              mediaList[a].type = 'img';
              if(caption.length > 1) {
                captionTruncate = (captionSplit.length > 12) ? captionTruncate+'.'+ext : captionSplit;
              } else {
                captionTruncate = (captionSplit.length > 12) ? captionTruncate : captionSplit;
              }
              break;
            case 2:
              mediaList[a].type = 'video';
              let videoFilePath = "";
              mediaList[a].mime = 'video/mp4';
              let posterImg = mediaList[a].posterImage;
              videoFilePath = mediaList[a].filePath;
              mediaList[a].fileImg = "";
              mediaList[a].thumbFilePath = posterImg;
              mediaList[a].posterImg = posterImg;
              mediaList[a].videoUrl = videoFilePath;
              if(caption.length > 1) {
                captionTruncate = (captionSplit.length > 12) ? captionTruncate+'.mp4' : captionSplit;
              } else {
                captionTruncate = (captionSplit.length > 12) ? captionTruncate : captionSplit;
              }
              break;
            case 3:
              mediaList[a].type = 'audio';
              let audioFilePath = "";
              let audiothumb = 'assets/images/media/audio-thumb.png';
              audioFilePath = mediaList[a].filePath;
              mediaList[a].thumbFilePath = audiothumb;
              mediaList[a].fileImg = "";
              mediaList[a].posterImg = audiothumb;
              mediaList[a].audioUrl = audioFilePath;
              if(caption.length > 1) {
                captionTruncate = (captionSplit.length > 12) ? captionTruncate+'.mp3' : captionSplit;
              } else {
                captionTruncate = (captionSplit.length > 12) ? captionTruncate : captionSplit;
              }
              break;
            case 6:
              mediaList[a].fileSize = 'NA';
              let prefix = 'http://';
              mediaList[a].type = 'link';
              let logoImg = mediaList[a].thumbFilePath;
              let logo = (logoImg == "") ? 'assets/images/media/link-thumb.png' : logoImg;
              mediaList[a].linkImg = (logoImg == "") ? 'default' : 'logo';
              mediaList[a].linkType = 'site';
              let url = mediaList[a].filePath;
              if(url.indexOf("http://") != 0) {
                if(url.indexOf("https://") != 0) {
                  url = prefix + url;
                }              
              }
    
              mediaList[a].link = url;
              mediaList[a].linkCaption = (mediaList[a].fileCaption == '') ? url : mediaList[a].fileCaption;
              mediaList[a].galleryCaption = (mediaList[a].fileCaption == '') ? '' : `<p>${mediaList[a].fileCaption}</p>`;
              mediaList[a].mediaCaption = mediaList[a].galleryCaption;
              captionTruncate = (mediaList[a].linkCaption > 12) ? mediaList[a].linkCaption+'..' : mediaList[a].linkCaption;
              let youtube = this.commonApi.matchYoutubeUrl(url);
              if(youtube) {
                mediaList[a].linkImg = "default";
                logo = '//img.youtube.com/vi/'+youtube+'/0.jpg';
                mediaList[a].thumbFilePath = logo;
                mediaList[a].logo = logo;
                mediaList[a].linkType = 'youtube';
              } else {
                let vimeo = this.commonApi.matchVimeoUrl(url);
                if(vimeo) {
                  mediaList[a].linkImg = "default";
                  let vlogo = this.vimeoLoadingThumb(vimeo, a);
                  mediaList[a].linkType = 'video';
                } else {
                  mediaList[a].galleryCaption += `<p><a href="${url}" target="_blank">${url}</a></p>`;
                  mediaList[a].mediaCaption = mediaList[a].galleryCaption;
                  mediaList[a].fileImg = logo;
                  mediaList[a].thumbFilePath = logo;
                  mediaList[a].logo = logo;
                }              
              }
              break;     
          }
          if(attachmentType < 6) {
            //mediaList[a].galleryCaption = captionTruncate; 
            mediaList[a].galleryCaption = mediaList[a].fileCaption; 
            mediaList[a].mediaCaption = captionTruncate; 
          }
          this.mediaList.push(mediaList[a]);
        }
        setTimeout(() => {
          let uploadModelHeight = document.getElementsByClassName('upload-modal');
          if(uploadModelHeight) {
            let inHeight = (uploadModelHeight[0].clientHeight) ? uploadModelHeight[0].clientHeight : 0;
            let listItemHeight = (document.getElementsByClassName('media-gallery')[0].clientHeight);
            if(this.itemTotal > this.mediaList.length && inHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.getMediaLists();
              this.lastScrollTop = this.scrollTop; 
            }
          }
        }, 250);  
      }
    });
  }

  // Media Selection
  mediaSelect(index, mid, flag) {
    this.mediaList[index].selectionMode = !flag;
    let mediaExist = this.mediaSelectionList.includes(mid);
    let mlist = (!flag && !mediaExist) ? this.mediaList[index] : '';
    let rmList = (flag) ?  mid: '';
    let mflag = false;
    this.mediaList.forEach(item => {
      if(item.selectionMode) {
        mflag = true
      }
    });
    let data = {
      access: 'media',
      action: 'mediaSelection',
      mediaItem: mlist,
      removedItem: rmList,
      mediaFlag: mflag
    };
    this.commonApi.emitMediaUploadData(data);
  }

  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.commonApi.emitMessageLayoutChange(toggleFlag);
    if(this.mediaView == 'thumb') {
      this.masonry.reloadItems();
      this.masonry.layout();
      this.updateMasonryLayout = true; 
    }
     
    if(!this.expandFlag) {
      let gallery = document.getElementById('mediaType');
      let height = gallery.offsetHeight;
      setTimeout(() => {
        gallery.style.height = `${height}px`;
        gallery.style.position = 'relative';  
      }, 500);
    }
  }

  applyFilter(filterData) {
    console.log(filterData)
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
      setTimeout(() => {
        localStorage.removeItem('mediaUploadFilter');
        this.resetFilter();  
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    this.applySearch('reset', this.searchVal);
    setTimeout(() => {
      this.filterLoading = false;
    }, 700);
  }

  // Apply Search
  applySearch(action, val) {
    this.searchVal = val;
    this.apiData['searchKey'] = this.searchVal;
    this.apiData['type'] = this.mediaView;
    this.itemLimit = 20;
    this.itemOffset = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.itemEmpty = false;
    this.displayNoRecords = false;
    this.mediaList = [];
    this.apiData['accessType'] = this.mediaType;
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    
    this.loading = true;
    if(action == 'reset') {
      this.ngOnInit();
    } else {
      this.getMediaLists();
    }
  }

  // Light Gallery
  initGallery() {
    let gallery = this.mediaType;
    setTimeout(() => {
      this.lg = lightGallery(document.getElementById(gallery), {
        actualSize: true,
        autoplayFirstVideo:false,
        closable: false,
        download: true,
        escKey: false,
        loop: false,
        preload: 2,
        showAfterLoad: false,
        videojs: false,
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 1
        },
        vimeoPlayerParams: {
          byline : 0,
          portrait : 0,
          color : 'A90707'
        }
      });
    }, this.lgTimeOut);
  }


  // Getting vimeo video thumb
  vimeoLoadingThumb(id, index){    
    this.commonApi.getVimeoThumb(id).subscribe((response) => {
      let res = response[0];
      let thumb = res['thumbnail_medium'];
      this.mediaList[index]['thumbFilePath'] = thumb;
      this.mediaList[index]['logo'] = thumb;      
    });
  }

}
