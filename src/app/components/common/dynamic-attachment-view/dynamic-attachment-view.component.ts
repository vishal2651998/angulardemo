import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { MediaManagerService } from 'src/app/services/media-manager/media-manager.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from '../../../services/common/common.service';
import { Constant } from 'src/app/common/constant/constant';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
declare var lightGallery: any;

@Component({
  selector: 'app-dynamic-attachment-view',
  templateUrl: './dynamic-attachment-view.component.html',
  styleUrls: ['./dynamic-attachment-view.component.scss']
})
export class DynamicAttachmentViewComponent implements OnInit {

  @Input() loading: boolean;
  @Input() action: string;
  @Input() files: any = [];
  @Input() attachments: any;
  @Input() access:string = "";
  @Input() dynamicGid:number = 0;
  @Input() dataId: any = 0;
  @Input() fieldId: any = 0;
  @Input() apiData: any = [];
  @Output() attachmentAction: EventEmitter<any> = new EventEmitter();
  @Output() setProcessStepEnable: EventEmitter<any> = new EventEmitter();

  public apiKey: string;
  public domainId;
  public countryId;
  public userId;
  public user: any;

  public bodyElem;
  public secElement: any;
  public units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  public attachmentLength: number = 0;
  public attachmentText: string = "Attachments";
  public sectionHead: string = "";
  public newGallery: any;
  public editGallery: any;
  public viewGallery: any;
  public lgTimeOut: number = 10;
  public inputFocus: boolean = true;
  public initLoad: boolean = false;
  public scrollPos: any = 0;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public audioThumb: string = `${this.mediaPath}/audio-medium.png`;
  public videoThumb: string = `${this.mediaPath}/video-medium.png`;
  public linkThumb: string = `${this.mediaPath}/link-medium.png`;
  public baseApiUrl: string = "";
  public langPlaceholder: string = "Select Language";
  public defLang: any = [];
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  @ViewChild('target') private myScrollContainer: ElementRef;
  currentFile: any;

  constructor(
    private http: HttpClient,
    private apiUrl: ApiService,
    private mediaApi: MediaManagerService,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public sanitizer: DomSanitizer
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    console.log(this.action, this.access, this.apiData);
    console.log(this.dynamicGid);
    this.apiKey = Constant.ApiKey;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    this.sectionHead = (this.action == 'view' || this.action == 'attachments') ? this.attachmentText : `New ${this.attachmentText}`;
    this.attachmentLength = this.attachments.length;
    this.baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let defaultLanguage = JSON.parse(localStorage.getItem('defaultLanguage'));
    this.langPlaceholder = `${this.langPlaceholder} (Default: ${defaultLanguage[0]['name']})`;
    this.defLang = [];
    this.defLang.push(defaultLanguage[0].id);
    console.log(this.attachmentLength)
    for(let a in this.attachments) {
      //console.log(a)
      let fileExtn = this.attachments[a]['filePath'].split('.').pop();
      console.log(this.attachments[a])
      this.attachments[a]['fileExtension'] = fileExtn;
      this.attachments[a]['iframe'] = false;
      this.attachments[a].validError = false;
      let attachmentType = this.attachments[a].flagId;
      let mediaId = this.attachments[a].mediaId;
      if((this.action == 'view' || this.action == 'attachments') && attachmentType < 6) {
        this.attachments[a].flagId = parseInt(attachmentType);
        let fileSize = this.niceBytes(this.attachments[a].fileSize);
        this.attachments[a].fileSize = fileSize;
      }

      if((this.action == 'view' && this.access == 'post')){
        this.attachments[a]['galleryHidden'] = `video-${this.action}-${mediaId}`;
      }
      else{
        this.attachments[a]['galleryHidden'] = `video-${this.action}-${a}`;
      }
      this.attachments[a]['galleryCaption'] = this.attachments[a]['fileCaption'];

      this.attachments[a]['galleryId'] = `#${this.attachments[a]['galleryHidden']}`;
      this.attachments[a]['posterImg'] = "";
      this.attachments[a]['downloadUrl'] = "";
      this.attachments[a]['fileImg'] = this.attachments[a]['filePath'];

      if(this.action == 'attachments') {
        let langTtem = this.attachments[a]['languageOptions'];
        let lang = (langTtem == undefined || langTtem == 'undefined') ? this.attachments[a]['selectedLang'] : langTtem;
        this.attachments[a]['itemValues'] = [];
        this.attachments[a]['selectedLang'] = [];
        this.attachments[a]['filteredLangItems'] = [];
        this.attachments[a]['filteredLangList'] = [];
        if(lang.length > 0) {
          this.attachments[a].itemValues = lang;
          let id = [];
          let name = [];
          for(let i of lang) {
            id.push(i.id);
            name.push(i.name);
          }
          this.attachments[a].filteredLangItems = id;
          this.attachments[a].filteredLangList = name;
          this.attachments[a].selectedLang = name;
        }
      }

      switch(attachmentType) {
        case 1:
          this.attachments[a]['type'] = 'img';
          break;
        case 2:
          this.attachments[a]['type'] = 'video';
          let posterImg = this.videoThumb;
          let videoFilePath = "";
          if(this.action != 'view' && this.action != 'attachments') {
            this.attachments[a]['mime'] = this.attachments[a]['fileType'];
            //videoFilePath = this.attachments[a]['filePath'];
            videoFilePath = this.attachments[a]['videoFilePath'];
            this.attachments[a]['videoUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(videoFilePath);
          } else {
            this.attachments[a]['mime'] = 'video/mp4';
            posterImg = this.attachments[a]['posterImage'];
            videoFilePath = this.attachments[a]['filePath'];
            this.attachments[a]['videoUrl'] = videoFilePath;
          }
          this.attachments[a]['fileImg'] = "";
          this.attachments[a]['thumbFilePath'] = posterImg;
          this.attachments[a]['posterImg'] = posterImg;
          //this.attachments[a]['videoUrl'] = videoFilePath;
          break;
        case 3:
          this.attachments[a]['type'] = 'audio';
          let audioFilePath = "";
          let audiothumb = this.audioThumb;
          if(this.action != 'view' && this.action != 'attachments') {
            //audioFilePath = this.attachments[a]['audioFilePath'];
            //this.attachments[a]['audioUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(audioFilePath);
            audioFilePath = this.attachments[a]['filePath'];
            this.attachments[a]['audioUrl'] = audioFilePath;
          } else {
            audioFilePath = this.attachments[a]['filePath'];
            this.attachments[a]['audioUrl'] = audioFilePath;
          }
          this.attachments[a]['fileImg'] = "";
          this.attachments[a]['thumbFilePath'] = audiothumb;
          this.attachments[a]['posterImg'] = audiothumb;
          //this.attachments[a]['audioUrl'] = audioFilePath;
          break;
        case 4:
        case 5:
          let docThumb;
          let fileExt = 'png';
          let ext = this.attachments[a]['fileExtension'].toLowerCase();
          console.log(ext)
          switch (ext) {
            case 'pdf':
            case 'PDF':
              docThumb = 'pdf-medium';
              break;
            case 'xlsx':
            case 'xls':
              docThumb = 'xls-medium';
              break;
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'docx':
            case 'doc':
            case 'msword':
              docThumb = 'doc-medium';
              break;
            case 'pptx':
            case 'ppt':
              docThumb = 'ppt-medium';
              break;
            case 'txt':
              docThumb = 'txt-medium';
              break;
            case 'x-zip-compressed':
            case 'zip':
              docThumb = 'zip-medium';
              break;
            case 'exe':
              docThumb = 'exe-medium';
              break;
            default:
              docThumb = 'unknown-thumb';
              break;
          }
          let fileImg = `${this.mediaPath}/${docThumb}.${fileExt}`;
          console.log(fileImg)
          let filePath = this.attachments[a]['filePath'];
          this.attachments[a]['type'] = 'doc';
          this.attachments[a]['fileImg'] = fileImg;
          this.attachments[a]['thumbFilePath'] = fileImg;
          this.attachments[a]['downloadUrl'] = filePath;
          if(this.action == 'view' && attachmentType == 4) {
            this.attachments[a]['fileImg'] = this.attachments[a]['downloadUrl'];
            this.attachments[a]['iframe'] = true;
          }
          let caption = (this.attachments[a]['fileCaption'] == '') ? this.attachments[a]['originalName'] : this.attachments[a]['fileCaption'];
          this.attachments[a]['galleryCaption'] = `<p><a href="${filePath}" target="_blank">${caption}</a></p>`;
          break;
        case 6:
          let prefix = 'https://';
          this.attachments[a]['captionAction'] = this.attachments[a]['actionLink'];
          this.attachments[a]['type'] = 'link';
          let logoImg = this.attachments[a].thumbFilePath;
          let logo = (logoImg == "") ? this.linkThumb : logoImg;
          //this.attachments[a]['linkType'] = 'site';
          let url = this.attachments[a]['filePath'];
          if(this.action != 'view' && this.action != 'attachments') {
            this.attachments[a]['linkType'] = (this.attachments[a].accessType != 'media') ? 'site' : this.attachments[a]['fileType'];
          } else {
            this.attachments[a]['linkType'] = 'site';
            url = this.attachments[a]['filePath'];
            if(url.indexOf("http://") != 0) {
              if(url.indexOf("https://") != 0) {
                url = prefix + url;
              }
            }

            if(this.action == 'attachments') {
              console.log(this.action)
              this.initLoad = true;
              this.attachments[a]['captionFlag'] = (this.attachments[a]['fileCaption'] != null) ? false : true;
              this.attachments[a]['linkFlag'] = (this.attachments[a]['fileCaption'] != null) ? true : false;
              this.attachments[a]['valid'] = true;
              //this.('link', a, !this.attachments[a]['linkFlag']);
            }

            this.attachments[a]['valid'] = (this.attachments[a].accessType == 'media') ? true : this.attachments[a]['valid'];

            this.attachments[a]['link'] = url;
            this.attachments[a]['galleryCaption'] = `<p>${this.attachments[a]['fileCaption']}</p>`;
            let youtube = this.commonApi.matchYoutubeUrl(url);
            console.log(youtube)
            if(youtube) {
              logo = '//img.youtube.com/vi/'+youtube+'/0.jpg';
              this.attachments[a]['thumbFilePath'] = logo;
              this.attachments[a]['logo'] = logo;
              this.attachments[a]['linkType'] = 'youtube';
            } else {
              let vimeo = this.commonApi.matchVimeoUrl(url);
              console.log(vimeo)
              if(vimeo) {
                let vlogo = this.vimeoLoadingThumb(vimeo, a);
                this.attachments[a]['linkType'] = 'video';
                console.log(vlogo)
              } else {
                this.attachments[a]['galleryCaption'] += `<p><a href="${url}" target="_blank">${url}</a></p>`;
                this.attachments[a]['fileImg'] = logo;
                this.attachments[a]['thumbFilePath'] = logo;
                this.attachments[a]['logo'] = logo;
              }
            }
          }
          break;
      }
    }
    console.log(this.action, this.attachments);
    let secElement = document.getElementById('step');
    if(secElement != undefined){
      if((this.action == 'new' || this.action == 'edit' || (this.action !='attachments' && this.access == 'ppfr') ) && this.attachmentLength > 0) {
        setTimeout(() => {
          let scrollTop = secElement.scrollTop;
          setTimeout(() => {
            this.scrollPos = scrollTop+80;
            secElement.scrollTop = this.scrollPos;
          }, 200);
        }, 700);
      } else {
        if(this.access != 'post'){
          setTimeout(() => {
            this.initLoad = false;
            this.scrollPos = 0;
            secElement.scrollTop = this.scrollPos;
          }, 50);
        }
      }
    }
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.showGallery(this.action,this.dynamicGid);
  }

  scrollToElement(el): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  // Convert File Size
  niceBytes(x){
    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }
    //include a decimal point and a tenths-place digit if presenting
    //less than ten of KB or greater units
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l]);
  }

  // Drag & Drop Functionality
  drop(event: CdkDragDrop<string[]>) {
    if(this.action != 'view') {
      setTimeout(() => {
        this.hideGallery('callback');
      }, this.lgTimeOut);
      moveItemInArray(this.attachments, event.previousIndex, event.currentIndex);
      moveItemInArray(this.files, event.previousIndex, event.currentIndex);
      console.log(this.files, this.attachments)
      let data = {
        action: 'order',
        attachments: this.attachments,
        files: this.files
      };
      this.attachmentAction.emit(data);
    }
  }

  // Caption On Change
  onChange(field, i, val) {
    let action = this.attachments[i].captionAction;
    let flag = true;
    if(field == 'link') {
      flag = false;
      this.attachments[i].valid = (val.length > 0) ? true : false;
      //this.attachments[i]['url'] = val;
      let url = this.isValidURL(this.attachments[i], val);
      this.attachments[i].valid = url;
      this.attachments[i].validError = !url;
      action = (this.action == 'attachments') ? 'caption-link' : action;
      if(this.attachments[i].valid) {
        /*let data = {
          apiKey: Constant.ApiKey,
          linkVal: this.attachments[i]['url']
        };*/
        let data = new FormData();
        data.append('apiKey', this.apiKey);
        data.append('link', this.attachments[i]['url']);
        data.append('domainId', this.domainId);
        this.commonApi.getSiteLogo(data).subscribe((response) => {
          console.log(response);
          this.attachments[i].logo = (response.linkImg != "") ? response.linkImg : this.linkThumb;
          this.attachments[i].thumbFilePath = this.attachments[i].logo;
        });
        setTimeout(() => {
          this.manageCaption(action, i);
        }, 100);
      } else {
        this.attachments[i].logo = this.linkThumb;
        this.attachments[i].thumbFilePath = this.attachments[i].logo;
      }
    } else {
      console.log(this.attachments[i])
      this.attachments[i].fileCaption = val;
      this.attachments[i].fileCaptionVal = (val.length > 0) ? val : this.attachments[i].originalFileName;
      action = (this.action == 'attachments') ? 'caption' : action;
      this.manageCaption(action, i);
    }
  }

  // On Focus Caption
  onFocusEvent(field, index, flag) {
    console.log(field)
    if(!this.initLoad) {
      setTimeout(() => {
        this.hideGallery('callback');
      }, this.lgTimeOut);
      setTimeout(() => {
        if(flag) {
          let id = `input-${index}`;
          let input = document.getElementById(id);
          if(input) {
            setTimeout(() => {
              input.focus();
            }, 20);
          }
        }
        if(field == 'caption') {
          this.attachments[index]['captionFlag'] = flag;
        } else {
          if(flag) {
            let linkId = `linkinput-${index}`;
            let linkInput = document.getElementById(linkId);
            setTimeout(() => {
              linkInput.focus();
            }, 20);
          }
          this.attachments[index]['linkFlag'] = flag;
        }
      }, 500);
    }
  }

  // Remove Attachment
  delete(i) {
    this.currentFile = this.attachments[i];
    let access = (this.attachments[i].is_delete) ? 'Remove' : 'Delete';
    access = `${access} Media`;
    let fname = (this.attachments[i].originalFileName == '') ? this.attachments[i].originalFileName : this.attachments[i].fileName;
    let title = `Confirmation - ${fname}`;
    let actionInfo = {
      contentType: '',
      title: title,
      removeFlag: this.attachments[i].is_delete
    }
    setTimeout(() => {
      this.hideGallery('callback');
    }, this.lgTimeOut);

    const modalRef = this.modalService.open(ConfirmationComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService) {
        let data = {
          action: 'file-delete'
        };
        this.attachmentConfirmAction(i, data);
      }
    });
  }

  // Attachment Confimation Action
  attachmentConfirmAction(i, data) {
    let deletedId = [];
    let fileIds = [];
    let fileId: any;
    if (!this.attachments[i].mediaId) {
      fileId = this.attachments[i].fileId.toString();
    } else {
      fileId = this.attachments[i].mediaId.toString();
    }
    deletedId.push(fileId);
    fileIds.push(fileId);
    this.attachments.splice(i, 1);
    this.attachmentLength = this.attachments.length;
    let rmPos = (this.access == 'post') ? 200 : 150;
    let secElement = document.getElementById('step');
    setTimeout(() => {
      let scrollTop = secElement.scrollTop;
      setTimeout(() => {
        this.scrollPos = scrollTop-rmPos;
        secElement.scrollTop = this.scrollPos;
      }, 200);
    }, 700);
    this.updateMediaContent('delete', deletedId, fileIds);
  }

  // Manage Caption
  manageCaption(action, i) {
    console.log(action)
    console.log(this.attachments[i])
    this.attachments[i].captionAction = (action == 'new') ? 'edit' : 'new';
    this.attachments[i].captionFlag = (action == 'new') ? true : false;
    let data = {
      action: 'caption',
      captionAction: action,
      text: this.attachments[i].fileCaption,
      flag: true,
      index: i,
      language: this.attachments[i].filteredLagItems
    };

    if(this.action == 'attachments') {
      if (!this.attachments[i].mediaId) {
        data['fileId'] = this.attachments[i].fileId;
      } else {
        data['fileId'] = this.attachments[i].mediaId;
      }
      data['url'] = '';
      if(this.attachments[i].type == 'link') {
        this.attachments[i].linkFlag = (action == 'new') ? true : false;
      }
    }

    if(this.attachments[i].type == 'link') {
      console.log(this.attachments[i])
      data['action'] = 'caption-link',
      data['url'] = this.attachments[i].url;
      data['valid'] = this.attachments[i].valid;
    }
    console.log(data)
    this.attachmentAction.emit(data);
  }

  // Validating URL
  isValidURL1(str) {
    var a  = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  }

  // Check valid url
  isValidURL(a, url) {
    if (url!= '' && !/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://" + url;
      a.url = url;
    }
    else{
      url = url;
      a.url = url;
    }

    var regexp = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    //let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(url)) {
      console.log(url+"url true");
      return true;
    } else {
      console.log(url+"url false");
      return false;
    }
  }

  // Navigate URL
  navUrl(url) {
    setTimeout(() => {
      this.hideGallery('callback');
    }, this.lgTimeOut);
    window.open(url, '_blank');
  }
  // Navigate URL
  navUrlLink(url) {
    window.open(url, '_blank');
  }
   // Navigate URL
   navUrlDownload(url) {
    window.open(url, '_blank');
  }

  // Getting vimeo video thumb
  vimeoLoadingThumb(id, index){
    this.commonApi.getVimeoThumb(id).subscribe((response) => {
      let res = response[0];
      let thumb = res['thumbnail_medium'];
      this.attachments[index]['thumbFilePath'] = thumb;
      this.attachments[index]['logo'] = thumb;
    });
  }

  // Show Gallery
  showGallery(type,id) {
    let timeout;
    let gallery;
    console.log(type)
    switch (type) {
      case 'edit':
      case 'attachments':
        timeout = (type == 'edit') ? 0 : this.lgTimeOut;
        gallery = 'editGallery';
        break;
      default:
        timeout = (type == 'gview') ? 0 : this.lgTimeOut;
        gallery = 'viewGallery_'+id;
        break;
    }
    setTimeout(() => {
      console.log(gallery);
      var lg = document.getElementById(gallery);

      lightGallery(lg, {
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

      var alg = document.getElementById(gallery);
      if(alg) {
        alg.addEventListener('onAfterSlide', function(event){
          let index = event['detail'].index;
          let elm = `lg-${index}`;
          let chkElem = document.getElementById(elm);
          if(chkElem && chkElem.classList.contains('lg-4')) {
            let iframeCont = document.getElementsByClassName('lg-video-cont');
            if(iframeCont) {
              iframeCont[0].classList.add('iframe');
              let thumb = document.getElementsByClassName('lg-thumb-outer');
              if(thumb) {
                //thumb[0].classList.add('hide');
              }
              let subHtml = document.getElementsByClassName('lg-sub-html');
              if(subHtml) {
                subHtml[0].classList.add('hide');
              }
            }
          }
        }, false);
      }
    }, timeout);
  }

  // Get Language List
  getLang(i) {
    if(this.attachments[i].accessType == 'media') {
      return false;
    }
    setTimeout(() => {
      this.hideGallery('callback');
    }, this.lgTimeOut);
    console.log(i, this.attachments[i])
    let access = 'newthread';
    let fieldName = 'language';
    let selectionType = 'multiple';
    let title = 'Language';
    let action = false;
    let apiData = {
      apiKey: this.apiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      access: 'documents'
    }
    let inputData = {
      baseApiUrl: this.baseApiUrl,
      apiUrl: this.apiUrl.getLangApiUrl(),
      field: fieldName,
      selectionType: selectionType,
      filteredItems: this.attachments[i].filteredLangItems,
      filteredLists: this.attachments[i].filteredLangList,
      title: title
    };

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = action;
    modalRef.componentInstance.filteredTags = this.attachments[i].filteredLangItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService)
      let res = receivedService;
      let id = [];
      let name = [];
      this.attachments[i].itemValues = res;
      this.currentFile = this.attachments[i];
      for(let a of res) {
        id.push(a.id);
        name.push(a.name);
      }
      this.attachments[i].filteredLangItems = id;
      this.attachments[i].filteredLangList = name;
      this.attachments[i].selectedLang = name;
      this.onFocusOutEvent(i);
    });
  }

  // Hide Gallery
  hideGallery(action) {
    console.log(this.access, action)
    let timeout = 0;
    setTimeout(() => {
        $('.lg-backdrop, .lg-outer').remove();
        this.bodyElem.classList.remove('lg-on');
    }, timeout);
  }

  // Disable Tag Selection
  disableTagSelection(i, item, rmIndex) {
    setTimeout(() => {
      this.hideGallery('callback');
    }, this.lgTimeOut);

    if(this.action == 'attachments') {
      this.attachments[i].itemValues.splice(rmIndex, 1);
      this.attachments[i].selectedLang.splice(rmIndex, 1);
      this.attachments[i].filteredLangItems.splice(rmIndex, 1);
      let id = this.attachments[i].filteredLangItems;
      this.currentFile = this.attachments[i];
      this.onFocusOutEvent(i);
    }
  }

  onFocusOutEvent(i) {
    setTimeout(() => {
      this.hideGallery('callback');
    }, this.lgTimeOut);
    this.currentFile = this.attachments[i];
    let fileIds = [];
    let fileId: any;
    if (!this.attachments[i].mediaId) {
      fileId = this.attachments[i].fileId.toString();
    } else {
      fileId = this.attachments[i].mediaId.toString();
    }
    const fileInfo = [{
      fileId: fileId,
      caption: this.attachments[i].fileCaption,
      url: (this.attachments[i].flagId == 6) ? this.attachments[i].url : '',
      language: this.attachments[i].filteredLangItems,
      displayOrder: ''
    }];
    fileIds.push(fileId);
    this.updateMediaContent('update', fileInfo, fileIds);
  }

  updateMediaContent(action, fileInfo, fileIds) {
    console.log("this.currentFile: ", this.currentFile);
    let updatedAttachments = [], deleteMedia = [], mediaCloudAttachments = [];
    let mediaFormData = new FormData();
    let defaultLanguage = JSON.parse(localStorage.getItem('defaultLanguage'));
    let platformId = localStorage.getItem('platformId');
    let fileType = this.currentFile?.fileType;
    mediaFormData.append('apiKey', this.apiKey);
    mediaFormData.append('userId', this.userId);
    mediaFormData.append('domainId', this.domainId);
    mediaFormData.append('dataId', this.dataId);
    mediaFormData.append('contentTypeId', this.apiData.contentType);
    mediaFormData.append('mediaCloudAttachments', JSON.stringify(mediaCloudAttachments));
    let uploadCount: any = 0;
    let uploadFlag: any = false;
    switch (action) {
      case 'update':
        updatedAttachments = fileInfo;
        uploadCount = this.attachments.length;
        uploadFlag = true;
        break;
      case 'delete':
        uploadCount = this.attachmentLength + 1;
        deleteMedia = fileInfo;
        if (uploadCount) {
          uploadFlag = true;
        }
        break;
    }
    mediaFormData.append('platform', platformId);
    mediaFormData.append('contentId', this.dataId);
    mediaFormData.append('updatedAttachments', JSON.stringify(updatedAttachments));
    mediaFormData.append('uploadCount', uploadCount);
    mediaFormData.append('language', JSON.stringify(defaultLanguage[0].id));
    mediaFormData.append('procedureId', this.apiData['procedureId']);
    mediaFormData.append('gtsId', this.apiData['gtsId']);
    mediaFormData.append('processId', this.apiData['processId']);
    mediaFormData.append('uploadFlag', uploadFlag);
    mediaFormData.append('displayOrder', "1");
    mediaFormData.append('type', fileType);
    mediaFormData.append('caption',  this.currentFile?.fileCaption);
    mediaFormData.append('deleteMedia', JSON.stringify(deleteMedia));
    mediaFormData.append('workstreamId', this.apiData['workstreamId']);
    mediaFormData.append('uploadByAuthor', this.apiData['uploadByAuthor']);
    mediaFormData.append('userInputId', this.fieldId);
    mediaFormData.append('linkUrl', this.apiData['linkUrl']);
    mediaFormData.append('mediaId', this.currentFile?.mediaId);
    mediaFormData.append('isVideoCompressed', "0");
    mediaFormData.append('threadId', '');
    mediaFormData.append('directAttachment', "0");
    mediaFormData.append('postStatus', "");
    mediaFormData.append('flagId', this.apiData['flagId']);
    mediaFormData.append('postType', '');
    mediaFormData.append('fileDuration', "0");
    mediaFormData.append('compressionType', "0");
    mediaFormData.append('countryId', this.apiData['countryId']);
    mediaFormData.append('fileId', JSON.stringify(fileIds));
    this.mediaApi.updateMediaContent(mediaFormData).subscribe((response) => {
      console.log('response after upload', response);
      if (response.hasOwnProperty('processStepEnabled')) {
        this.setProcessStepEnable.emit(response.processStepEnabled);
      }
    });
  }

}
