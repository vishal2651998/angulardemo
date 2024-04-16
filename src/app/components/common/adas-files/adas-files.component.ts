import { Component, ViewChild, HostListener, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { RedirectionPage } from "src/app/common/constant/constant";
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NgxMasonryComponent } from "ngx-masonry";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewComponent } from 'src/app/modules/adas/adas/view/view.component';
import { Table } from "primeng/table";
import * as moment from 'moment';

@Component({
  selector: 'app-adas-files',
  templateUrl: './adas-files.component.html',
  styleUrls: ['./adas-files.component.scss'],
  styles: [
    `:host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 0px;
    }
    @media screen and (max-width: 64em) {
        :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            top: 0px;
        }
    }
    .masonry-item {
      width: 210px;
    }
    .masonry-item, .masonry-item-type {
      transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
    }`
  ]
})
export class AdasFilesComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() items: any = [];
  @Input() thumbView: boolean = true;
  @Input() itemTotal: any = 0;
  @Input() itemLength: any = 0;
  @Output() filesCallback: EventEmitter<AdasFilesComponent> = new EventEmitter();
  @ViewChild("table", { static: false }) table: Table;

  public bodyElem: any = "";
  public updateMasonryLayout: boolean = false;
  public galleryFlag: boolean = true;
  public singleClick: boolean = false;
  public doubleClick: boolean = false;
  public fileDeleteFlag: boolean = false;
  public fileAction: string = "view";
  public secHeight: any = 0;
  public listHeight: any = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public listScroll: boolean = false;
  public scrollPos: number = 0;
  public docScroll: boolean = false;
  public loadDataEvent: boolean = false;

  constructor(
    private commonApi: CommonService,
    private documentationService: DocumentationService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

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
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.secHeight = 215;
    this.listHeight = 265;
    this.setupFiles(); 
    console.log(this.items)
  }

  setupFiles() {
    this.items.forEach((item, index) => {
      let tagList = [], systemList = [];
      let bannerImage = (item.defaultBanner[0]) ? '' : item.bannerImageStr;
      this.items[index]['bannerImage'] = bannerImage;
      let createdDate = moment.utc(item.createdDateStr).toDate(); 
      let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
      this.items[index]['createdDate'] = localCreatedDate;
      let updatedDate = (item.updatedDateStr == '0000-00-00 00:00:00') ? '' : moment.utc(item.updatedDateStr).toDate(); 
      let localUpdatedDate = (updatedDate == '') ? '-' : moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
      this.items[index]['updatedDate'] = localUpdatedDate;
      this.items[index]['vehicleInfo'] = item.vehicleInfoJsonArr[0];
      this.items[index]['tagInfo'] = (item.tagsJsonArr) ? item.tagsJsonArr : [];
      this.items[index]['adasSystemInfo'] = (item.adasSystemInfoJsonArr) ? item.adasSystemInfoJsonArr : [];
      this.items[index]['workstreamInfo'] = item.workstreamInfoJsonArr;
      this.items[index]['viewCount'] = 0;
      this.items[index]['styleName'] = (bannerImage == '') ? 'empty' : '';
      this.items[index]['flagId'] = 0;
      this.items[index]['class'] = 'doc-thumb';
      this.items[index]['tagInfo'].forEach(tagItem => {
        tagList.push(tagItem.name)
      });
      this.items[index]['adasSystemInfo'].forEach(sitem => {
        systemList.push(sitem.name)
      });
      this.items[index]['tagList'] = (tagList.length > 0) ? tagList.join(', ') : '-';
      this.items[index]['systemList'] = (systemList.length > 0) ? systemList.join(', ') : '-';
      let attachments = (item.uploadContents) ? item.uploadContents : [];
      this.items[index]['attachments'] = attachments; 
      if(attachments.length > 0) {
        let attachment = attachments[0];
        let flagId = attachment.flagId;
        this.items[index]['flagId'] = flagId;
        this.items[index]['contentPath'] = "";
        switch (flagId) {
          case 1:
            this.items[index]['contentPath'] = attachment.thumbFilePath;
            break;
          case 2:
            this.items[index]['contentPath'] = attachment.posterImage;
            break;
          case 3:
            this.items[index]['styleName'] = 'mp3';
            this.items[index]['contentPath'] = attachment.thumbFilePath;
            break;
          case 4:
          case 5:
            let fileType = attachment.fileExtension.toLowerCase();
            let styleName = '';
            switch (fileType) {
              case 'pdf':
                styleName = 'pdf';
                break;
              case 'application/octet-stream':
              case 'xlsx':
              case 'xls':    
                styleName = 'xls';
                break;
              case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
              case 'application/msword':
              case 'docx':
              case 'doc':
              case 'msword':  
                styleName = 'doc';
                break;
              case 'application/vnd.ms-powerpoint':  
              case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
              case 'pptx':
              case 'ppt':
                styleName = 'ppt';
                break;
              case 'zip':
                styleName = 'zip';
                break;
              case 'exe':
                styleName = 'exe';
                break;
              case 'txt':
                styleName = 'txt';
                break;  
              default:
                styleName = 'unknown-thumb';
                break;
            }
            this.items[index]['styleName'] = styleName;
            break;
          case 6:
            this.items[index]['class'] = 'link-thumb';
            let banner = '';
            let prefix = 'http://';
            let logoImg = attachment.thumbFilePath;
            item.styleName = (logoImg == "") ? 'link-default' : '';
            let logo = (logoImg == "") ? 'assets/images/media/link-medium.png' : logoImg;
            let url = attachment.filePath;
            if(url.indexOf("https://") != 0) {
              url = prefix + url;
            }
            let youtube = this.commonApi.matchYoutubeUrl(url);
            if(youtube) {
                banner = '//img.youtube.com/vi/'+youtube+'/0.jpg';
            } else {
                let vimeo = this.commonApi.matchVimeoUrl(url);
                if(vimeo) {
                this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
                    let res = response[0];
                    banner = res['thumbnail_medium'];
                });
                } else {
                  banner = logo;
                }
            }
            this.items[index]['contentPath'] = banner; 
            break;
          case 8:
            this.items[index]['styleName'] = 'html';
            break;  
          default:
            break;
        }
      }
      this.items[index]['contentPath'] = (bannerImage == '') ? this.items[index]['contentPath'] : this.items[index]['bannerImage'];
    });
    setTimeout(() => {
      this.filesCallback.emit(this);
    }, 500);
  }

  fileClick(id) {
    let adasViewUrl = `${RedirectionPage.AdasProcedure}/view/${id}`;
    window.open(adasViewUrl, adasViewUrl);
  }

  callbackClick(doc, item, index='') {
    if (this.singleClick === true) {
      this.doubleClick = true;
      this.openGallery(item);
    } else {
      this.singleClick = true;
      setTimeout(() => {
        this.singleClick = false;
        if (this.doubleClick === false) {
          this.openDetailView(item);         
        }
        this.doubleClick = false;
      }, 500);
    }
  }

  // Open Light Gallery
  openGallery(item) {
    let id = item.adasIdInt;
    if(item.attachments.length > 0) {
      let gid = `lg-0-${id}`;
      let element: HTMLElement = document.getElementById(gid) as HTMLInputElement;
      element.click();
    } else {
      this.openDetailView(item); 
    }
  }

  openDetailView(item) {
    this.bodyElem = document.getElementsByTagName('body')[0];
    if(!document.body.classList.contains("view-modal-popup")) {
      this.bodyElem.classList.add("view-modal-popup");
    }
    const modalRef = this.modalService.open(ViewComponent, {backdrop: 'static', keyboard: true, centered: true});
    modalRef.componentInstance.access = "popup";
    modalRef.componentInstance.itemData = item;
    modalRef.componentInstance.adasService.subscribe((receivedService) => {
      console.log(receivedService);
      let actionFlag = receivedService.action;
      let actionType = receivedService.type;
      let actionId = receivedService.id;
      modalRef.dismiss('Cross click');
      if(actionFlag) {
        switch(actionType) {
          case 'edit':
            let url = `${RedirectionPage.AdasProcedure}/manage/edit/${actionId}`;
            localStorage.setItem('adasNavNewTab', 'true');
            setTimeout(() => {
              window.open(url,url);  
            }, 500);
            break;
          case 'delete':
            this.fileDeleteFlag = true;
            let findex = this.items.findIndex(option => option.adasIdInt == actionId);
            if(findex >= 0) {
              this.items.splice(findex, 1);
              this.itemLength -= 1;
              this.itemTotal -= 1;
            }
            this.filesCallback.emit(this);
            break;
        }        
      }
    });
  }

  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 50);
  }

  scroll = (event: any): void => {
    console.log(event);
    //console.log(event.target.className);
    if(event.target.className == 'p-datatable-scrollable-body ng-star-inserted') {
      this.scrollTop = event.target.scrollTop-90;
      let totalHeight = event.target.scrollTop+event.target.offsetHeight;
      let scrollHeight = event.target.scrollHeight-10;
      //console.log(event.target.scrollTop+"::"+event.target.offsetHeight+"::"+totalHeight+'::'+scrollHeight);
      //console.log(this.itemTotal, this.itemLength)
      if((totalHeight >= scrollHeight) &&  this.itemTotal > this.itemLength && this.loadDataEvent == false) {
        this.scrollCallback = false;
        this.listScroll = true;
        this.loadDataEvent = true; 
        this.lastScrollTop = this.scrollTop;
        this.filesCallback.emit(this);
      }
      event.preventDefault;
    }       
  }

}
