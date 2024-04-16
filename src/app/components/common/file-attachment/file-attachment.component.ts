import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../services/common/common.service';
import {MediaManagerService} from '../../../services/media-manager/media-manager.service';
import {UploadService} from '../../../services/upload/upload.service';
import {ThreadPostService} from '../../../services/thread-post/thread-post.service';
import {ThreadService} from '../../../services/thread/thread.service';
import {AnnouncementService} from 'src/app/services/announcement/announcement.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {NgbActiveModal, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgxImageCompressService} from 'ngx-image-compress';
import {forumPageAccess, IsOpenNewTab, MediaTypeInfo, MediaTypeSizes, PlatFormType, RedirectionPage} from '../../../common/constant/constant';
import {ConfirmationComponent} from 'src/app/components/common/confirmation/confirmation.component';
import {MediaUploadComponent} from 'src/app/components/media-upload/media-upload.component';
import {SuccessModalComponent} from '../../../components/common/success-modal/success-modal.component';
import {DomSanitizer} from '@angular/platform-browser';
import {KnowledgeBaseService} from 'src/app/services/knowledge-base/knowledge-base.service';
import { BaseService } from 'src/app/modules/base/base.service';
import {GtsService} from 'src/app/services/gts/gts.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss']
})
export class FileAttachmentComponent implements OnInit {

  @Input() apiData: Object;
  @Input() attachmentItems: any = [];
  @Input() postData: any = []; 
  @Input() action: string;
  @Input() pushData: any = '';
  @Input() approveStatusData: any = '';
  @Input() cloudTabApplyData: any = '';
  @Input() addLinkBool: any = true;
  @Input() acceptArray: any = "";
  @Input() fromMedia: boolean = false;
  @Output() uploadedItems: EventEmitter<any> = new EventEmitter();
  @Output() uploadComplete: EventEmitter<any> = new EventEmitter();
  public units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  title = 'ng-bootstrap-modal-demo';
  errorMsg: string = 'Media Already Exist';
  closeResult: string;

  filesArr: any;
  waitingFiles: any = 0;
  uploadedFiles: any[] = [];
  attachments: any[] = [];
  progressInfos = [];
  uploadFileLength: number;

  public pageAccess: string = '';
  public chooseLable: string = 'Files From PC';
  public chooseIcon: string = 'pi pi-paperclip';
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public attachmentView: boolean = false;
  public attachmentProgress: boolean = false;
  public addLinkFlag: boolean = true;
  public fileLoading: boolean = false;
  public checkingMedia: boolean = false;
  public collabticDomain: boolean = false;
  public tvsDomain: boolean = false;
  public newThreadView: boolean = false;
  public progress = 0;
  public percentDone = 0;
  public totalSizeToUpload = 0;
  public loadedSoFar = 0;
  public actionIndex: any = -1;
  public successMsg: string = 'Uploading...';
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public msgModalRef;
  public videoInterval: any;
  public videoFlagInterval: any;
  public gtsAttachmentResponse: any = [];

  public assetPath: string = 'assets/images';
  public mediaPath: string = `${this.assetPath}/media`;
  public mediaManagerPath: string = `${this.mediaPath}/manager`;
  public mediaIcon: string = 'media-active-icon.png';
  public linkIcon: string = 'link-icon.png';

  public imageSize: number = parseInt(MediaTypeSizes.fileSize);
  public videoSize: number = parseInt(MediaTypeSizes.fileSize);
  public audioSize: number = parseInt(MediaTypeSizes.fileSize);
  public docSize: number = parseInt(MediaTypeSizes.fileSize);
  public fileSizeTxt: string = MediaTypeSizes.fileSizeTxt;
  public processingTxt: string = MediaTypeInfo.ProcessingTxt;

  public customError: any = [];
  public invalidFileText: string = 'Invalid file size';
  public maxUploadText: string = 'maximum upload size is';
  public uploadFlag: any = null;
  public jobStatusFlag: any = null;
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'custom-modal'};
  public teamSystem = localStorage.getItem('teamSystem');
  @Input() isUpoladButtonShow: boolean = false;
  public inc = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private baseSerivce: BaseService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private imageCompress: NgxImageCompressService,
    private commonApi: CommonService,
    private mediaApi: MediaManagerService,
    private threadApi: ThreadService,
    private ancApi: AnnouncementService,
    private threadPostService: ThreadPostService,
    private uploadService: UploadService,
    public sanitizer: DomSanitizer,
    private kbApi: KnowledgeBaseService,
    public gtsApi: GtsService,
    public apiUrl: ApiService, 
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    console.log(this.uploadedFiles);
    console.log(this.action);
    console.log(this.apiData);

    let url = this.router.url.split('/');      
      
    let platformId = localStorage.getItem('platformId');
    let domainId = localStorage.getItem('domainId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.tvsDomain = (platformId == '2' && domainId == '52') ? true : false;
    this.mediaIcon = (this.tvsDomain) ? 'media-gray-icon.png' : this.mediaIcon;       
    this.mediaIcon = this.apiUrl.attachmentNewPOPUP ? 'media-black-icon.png' : this.mediaIcon;
    this.linkIcon = this.apiUrl.attachmentNewPOPUP ? 'link-black-icon.png' : this.linkIcon;    
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;

    let msize = localStorage.getItem('uploadMaxSize');
    let mText = localStorage.getItem('uploadMaxSizeText');

    this.imageSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.videoSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.audioSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.docSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);

    this.fileSizeTxt = (mText != 'undefined' && mText != undefined) ? mText : MediaTypeSizes.fileSizeTxt;
   
    this.commonApi.uploadInfoDataReceivedSubject.subscribe(
      (r) => {  
        setTimeout(() => {
          this.setupFileSelection(r);        
        }, 1);
      });
      
    this.pageAccess = this.apiData['access'];
    console.log(this.pageAccess);
    this.actionIndex = this.apiData['actionIndex'];
    this.uploadFileLength = this.uploadedFiles.length;
    switch (this.action) {
      case 'uploading':
        this.uploadedFiles = this.apiData['uploadedItems'];
        this.attachments = this.apiData['attachments'];
        console.log(this.uploadedFiles);
        console.log(this.attachments);
        this.attachmentUpload();
        break;
      case 'attachments':
        this.attachments = this.apiData['attachmentItems'];
        break;
      case 'media-apply':
        this.uploadedFiles = this.apiData['uploadedItems'];
        this.attachments = this.apiData['attachments'];
        console.log(this.uploadedFiles);
        console.log(this.attachments);
        this.mediaApply();
        break;
      default:
        console.log(this.apiData);
        if (this.apiData['uploadedItems'] != undefined) {
          this.uploadedFiles = this.apiData['uploadedItems'];
          this.uploadFileLength = this.uploadedFiles.length;
          if (this.uploadFileLength > 0) {
            this.uploadedFiles = this.apiData['uploadedItems'];
            this.attachments = this.apiData['attachments'];
            this.attachmentView = true;
            this.fileLoading = !this.attachmentView;
          }
        }
        break;
    }

    if(this.pageAccess == 'welcome-message'){
      this.chooseLable = "Upload Image/Video";
    }   
   
    
  }

  setupFileSelection(r){
    this.uploadedFiles = r.items;
    this.attachments = r.attachments;
    console.log(this.uploadedFiles);
    console.log(this.attachments);
    this.attachmentProgress = false;
    this.attachmentView = false;
    this.fileLoading = !this.attachmentView;
    setTimeout(() => {
      this.attachmentView = true;
      this.fileLoading = !this.attachmentView;
      let uploadItems = {
        action: 'upload',
        items: this.uploadedFiles,        
        attachments: this.attachments                          
      };
      console.log(uploadItems);                
      this.uploadedItems.emit(uploadItems);
    },100);    
  }

  // On Select File Upload
  onUpload(event) {
    this.customError = [];
    console.log(this.apiData);
    this.uploadedFiles = (this.uploadedFiles == undefined) ? [] : this.uploadedFiles;
    let i = 0;
    this.attachmentView = false;
    this.fileLoading = !this.attachmentView;
    this.uploadFileLength = this.uploadedFiles.length;
    this.filesArr = event;
    console.log(this.filesArr);
    let fileLen = event.files.length;
    this.waitingFiles = fileLen;
    for (let file of event.files) {
      console.log(file);
      let flag = true;
      let fileType = file.type.split('/');
      let fileExtn = file.name.split('.').pop();
      let fileAttachment = [];
      let fname = file.name;
      let displayOrder = this.apiData['displayOrder'] + i;
      let lastDot = fname.lastIndexOf('.');
      let fileName = fname.substring(0, lastDot);
      let fileIndex = i + 1;
      console.log(this.attachments);
      if (this.attachments.length > 0) {
        for (let a of this.attachments) {
          console.log(fileName, a.fileCaption, fname, file.name);
          if (fileName == a.fileCaption || (fname == a.originalName && a.accessType == 'upload')) {
            flag = false;
            this.fileLoading = flag;
            this.invalidFileText = this.errorMsg;
            this.setErrMsg(fname, -1);
          }
        }
      }
      fileAttachment['audioDesc'] = false;
      fileAttachment['audioCaption'] = file.name;
      fileAttachment['originalfileArray'] = file;
      fileAttachment['fileId'] = 0;
      fileAttachment['accessType'] = 'upload';
      fileAttachment['accessTypeText'] = 'From PC';
      fileAttachment['fileType'] = file.type;
      fileAttachment['fileSize'] = file.size;
      fileAttachment['originalName'] = file.name;
      fileAttachment['originalFileName'] = file.name;
      //fileAttachment['fileCaption'] = fileName;
      fileAttachment['fileCaption'] = '';
      fileAttachment['captionFlag'] = false;
      fileAttachment['action'] = 'new';
      fileAttachment['progress'] = 0;
      fileAttachment['cancelFlag'] = false;
      fileAttachment['valid'] = true;
      fileAttachment['language'] = '1';
      fileAttachment['itemValues'] = [];
      fileAttachment['selectedLang'] = [];
      fileAttachment['filteredLangItems'] = [];
      fileAttachment['filteredLangList'] = [];
      fileAttachment['fileDuration'] = 0;
      fileAttachment['uploadType'] = 'upload';
      fileAttachment['binaryfile'] = file;

      file['language'] = '1';
      file['fileCaption'] = fileName;
      file['captionFlag'] = false;
      file['displayOrder'] = this.uploadFileLength + displayOrder;
      if (flag) {
        this.checkingMedia = true;
        let mediaFlag;
        const mediaFormData = new FormData();
        mediaFormData.append('apiKey', this.apiData['apiKey']);
        mediaFormData.append('domainId', this.apiData['domainId']);
        mediaFormData.append('networkId', this.apiData['networkId']);
        mediaFormData.append('platform', this.apiData['platform']);
        mediaFormData.append('countryId', this.apiData['countryId']);
        mediaFormData.append('userId', this.apiData['userId']);
        mediaFormData.append('fileName', file.name.replace(/'/g, ''));
        mediaFormData.append('fileType', file.type);
        this.mediaApi.checkMediaName(mediaFormData).subscribe((response) => {
          this.waitingFiles -= 1;
          console.log(response, this.waitingFiles);
          mediaFlag = (response.status == 'Success') ? true : false;
          if(this.pageAccess == 'welcome-message'){
            mediaFlag = true;
          }
          if(this.pageAccess == 'workorder'){
            mediaFlag = true;
          }
          if(this.pageAccess == 'userprofile-page'){
            mediaFlag = true;
          }
          flag = mediaFlag;
          let msg = response.result;
          console.log(mediaFlag);
          if (!mediaFlag) {
            //this.invalidFileText = msg;
            //this.setErrMsg(fname, -1);
            let mitem = response.mediaData;
            console.log(mitem);
            if (mitem == null) {
              this.invalidFileText = msg;
              this.setErrMsg(fname, -1);
            } else {
              let mindex = this.attachments.findIndex(option => option.fileId == mitem.mediaId);
              if (mindex < 0) {
                this.setupMediaUploadFiles(mitem, 'exists', file);
              }
            }

            console.log(fileLen, i, fileIndex, this.waitingFiles);
            if (this.waitingFiles == 0) {
              setTimeout(() => {
                this.checkingMedia = false;
                this.attachmentView = true;
                this.fileLoading = !this.attachmentView;
                if (this.attachments.length > 1) {
                  let checkArr = ['originalFileName'];
                  let unique = this.commonApi.unique(this.attachments, checkArr);
                  //this.attachments = unique;
                }
                let uploadItems = {
                  action: 'upload',
                  items: this.uploadedFiles,
                  attachments: this.attachments,
                  postData: this.postData,                  
                };
                console.log(uploadItems);
                this.uploadedItems.emit(uploadItems);                
              }, 1000);
            }
          } else {
            if (this.waitingFiles == 0) {
              setTimeout(() => {
                this.checkingMedia = false;  
              }, 1000);              
            }
            this.initFileUpload(file, fileIndex, fileLen, fileAttachment, i);
          }
        });
      }
      i++;
    }
  }

  // Init Media File Upload
  initFileUpload(file, fileIndex, fileLen, fileAttachment, itemIndex) {
    console.log(fileIndex, fileLen);
    //fileIndex += 1;
    let flag = true;
    let fileType = file.type.split('/');
    let fileExtn = file.name.split('.').pop();

    switch (fileType[0]) {
      case 'image':
        //console.warn('Size in bytes was:', this.imageCompress.byteCount(file));
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          let localUrl = event.target.result;
          this.compressFile(fileType[0], fileAttachment, file, localUrl, fileIndex, fileLen, itemIndex);
        };
        break;
      case 'video':
        flag = this.validateFileSize(fileType[0], file.size);
        fileAttachment['flagId'] = 2;
        setTimeout(() => {
          let vidSize = this.fileSizeTxt;
          if (!flag) {
            this.setErrMsg(file.name, vidSize);
          } else {
            let blobURL = URL.createObjectURL(file);
            fileAttachment['videoFilePath'] = blobURL;
            fileAttachment['thumbFilePath'] = `${this.mediaPath}/video-medium.png`;
            // Setup Uploaded Files
            this.setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex);
          }
        }, 500);
        break;
      case 'audio':
        flag = this.validateFileSize(fileType[0], file.size);
        fileAttachment['flagId'] = 3;
        setTimeout(() => {
          let audSize = this.fileSizeTxt;
          if (!flag) {
            this.setErrMsg(file.name, audSize);
          } else {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event: any) => {
              let localUrl = event.target.result;
              fileAttachment['audioFilePath'] = localUrl;
            };
            fileAttachment['thumbFilePath'] = `${this.mediaPath}/audio-medium.png`;
            // Setup Uploaded Files
            setTimeout(() => {
              this.setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex);
            }, 500);
          }
        }, 500);
        break;
      default:
        flag = this.validateFileSize(fileType[0], file.size);
        console.log(fileType);
        fileAttachment['flagId'] = (fileType[1] == 'pdf' || fileType[1] == 'PDF') ? 4 : 5;
        setTimeout(() => {

          let docSize = this.fileSizeTxt;
          if (!flag) {
            this.setErrMsg(file.name, docSize);
          } else {
            let docThumb;
            let ext = fileExtn.toLowerCase();
            switch (ext) {
              case 'pdf':
                docThumb = 'pdf-medium';
                break;
              case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              case 'xlsx':
              case 'xls':
                docThumb = 'xls-medium';
                break;
              case 'docx':
              case 'doc':
              case 'msword':
                docThumb = 'doc-medium';
                break;
              case 'vnd.openxmlformats-officedocument.presentationml.presentation':
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
            fileAttachment['thumbFilePath'] = `${this.mediaPath}/${docThumb}.png`;
            fileAttachment['fileExtension'] = fileExtn;
            // Setup Uploaded Files
            this.setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex);
          }
        }, 500);
        break;
    }

    console.log(flag);
    setTimeout(() => {
      if (!flag) {
        this.filesArr.currentFiles.splice(fileIndex, 1);
        console.log(fileLen);
        console.log(fileAttachment);
        if (fileLen == 1 || (fileLen > 1 && (fileIndex + 1) == fileLen)) {
          this.attachmentView = true;
          this.fileLoading = !this.attachmentView;
          let uploadItems = {
            action: 'upload',
            items: this.uploadedFiles,
            attachments: this.attachments,
            postData: this.postData,
            file: file
          };
          this.uploadedItems.emit(uploadItems);
        }
      }      
    }, 100);
  }

  // Compress Image
  compressFile(fileType, fileAttachment, file, image, fileIndex = -1, fileLen, itemIndex) {
    let orientation = -1;
    let originalImageSize = this.imageCompress.byteCount(image);
    console.warn('Size in bytes is now:', originalImageSize);
    this.imageCompress.compressFile(image, orientation, 75, 50).then(result => {
      console.log(result);
      let imgResultAfterCompress = result;
      let sizeOFCompressedImage = this.imageCompress.byteCount(result);
      console.warn('Size in bytes after compression:', sizeOFCompressedImage);

      // call method that creates a blob from dataUri
      let compressImg = imgResultAfterCompress.split(',');
      console.log(compressImg);
      const imageBlob = this.dataURItoBlob(compressImg);
      console.log(imageBlob);
      let flag = this.validateFileSize(fileType, sizeOFCompressedImage);
      fileAttachment['flagId'] = 1;
      console.log(flag);
      setTimeout(() => {
        let imgSize = this.fileSizeTxt;
        if (!flag) {
          this.setErrMsg(file.name, imgSize);
        } else {
          console.log(file);
          fileAttachment['fileSize'] = sizeOFCompressedImage;
          fileAttachment['thumbFilePath'] = (imgResultAfterCompress != undefined) ? imgResultAfterCompress : `${this.mediaPath}/image-thumb.png`;
          const imageFile = new File([imageBlob], file.name, {type: file.type});
          imageFile['captionFlag'] = file.captionFlag;
          imageFile['fileCaption'] = file.fileCaption;
          imageFile['displayOrder'] = file.displayOrder;
          console.log(imageFile);
          console.log(fileAttachment);
          // Setup Uploaded Files
          this.setupUploadedFiles(fileAttachment, imageFile, fileIndex, fileLen, itemIndex);
        }
      }, 500);
    });
  }

  // Setup Uploaded Files
  setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex = -1) {
    console.log(fileAttachment['flagId']);
    /*if(fileAttachment['flagId'] < 6) {
      let fileSize = this.commonApi.niceBytes(file.size);
      fileAttachment['fileSize'] = fileSize;
    }*/
    fileAttachment['fileSize'] = this.commonApi.niceBytes(fileAttachment['fileSize']);
    this.uploadedFiles.push(file);
    console.log(this.uploadedFiles);
    fileAttachment['filePath'] = file['thumbFilePath'];
    fileAttachment['videoFilePath'] = fileAttachment['videoFilePath'];
    let fa = fileAttachment['videoFilePath'];
    fa = this.sanitizer.bypassSecurityTrustResourceUrl(fa);
    fileAttachment['videoFilePath_att'] = fa;
    fileAttachment['audioFilePath'] = fileAttachment['audioFilePath'];
    fileAttachment['uploadStatus'] = 0;
    this.attachments.push(fileAttachment);
    console.log(fileIndex, itemIndex, fileLen, this.attachments);
    let viewFlag = (itemIndex < 0 || (itemIndex >= 0 && (itemIndex) == fileLen)) ? true : false;
    if (viewFlag) {
      setTimeout(() => {
        this.attachmentView = true;
        this.fileLoading = !this.attachmentView;
      }, 1000);
    }
    if (this.attachments.length > 1) {
      let checkArr = ['originalFileName'];
      let unique = this.commonApi.unique(this.attachments, checkArr);
      //this.attachments = unique;
    }
    let uploadItems = {
      action: 'upload',
      items: this.uploadedFiles,
      attachments: this.attachments,
      postData: this.postData,
      file: file
    };
    this.uploadedItems.emit(uploadItems);
  }

  dataURItoBlob(dataURI) {
    console.log(dataURI);
    const byteString = window.atob(dataURI[1]);
    const mimeString = dataURI[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {type: mimeString});
    return blob;
  }

  // Add Link
  addLink() {
    //console.log(132, this.attachments)
    //return false;
    if (this.addLinkFlag) {
      this.apiUrl.attachmentLinkError = '';
      this.addLinkFlag = false;
      this.fileLoading = true;
      this.attachmentView = false;
      console.log(123, this.uploadedFiles);
      this.uploadFileLength = this.uploadedFiles.length;
      let displayOrder = this.apiData['displayOrder'] + 1;
      let type = 'link';
      let caption = '';
      let fileAttachment = [];
      fileAttachment['accessType'] = type;
      fileAttachment['accessTypeText'] = 'From PC';
      fileAttachment['flagId'] = 6;
      fileAttachment['fileId'] = 0;
      fileAttachment['fileType'] = type;
      fileAttachment['fileCaption'] = caption;
      fileAttachment['captionFlag'] = false;
      fileAttachment['url'] = '';
      fileAttachment['actionLink'] = 'new';
      fileAttachment['action'] = 'new';
      fileAttachment['valid'] = false;
      fileAttachment['selectedLang'] = [];
      fileAttachment['filteredLangItems'] = [];
      fileAttachment['filteredLangList'] = [];
      fileAttachment['progress'] = 70;
      fileAttachment['logo'] = `${this.mediaPath}/link-medium.png`;
      let file = {
        url: '',
        type: 'link',
        fileCaption: caption,
        filetype: 'link',
        flagId: 6,
        displayOrder: this.uploadFileLength + displayOrder
      };

      this.uploadedFiles.push(file);
      this.attachments.push(fileAttachment);
      console.log(this.attachments);
      setTimeout(() => {
        this.fileLoading = false;
        this.attachmentView = true;
      }, 500);
      if (this.attachments.length > 1) {
        let checkArr = ['originalFileName'];
        let unique = this.commonApi.unique(this.attachments, checkArr);
        //this.attachments = unique;
      }
      let uploadItems = {
        action: 'upload',
        items: this.uploadedFiles,
        attachments: this.attachments,
        postData: this.postData,
        file: file
      };
      this.uploadedItems.emit(uploadItems);
    }
  }

  // Validate Max File Size
  public validateFileSize(type, size) {
    let flag;
    switch (type) {
      case 'image':
        flag = (this.imageSize < size) ? false : true;
        break;
      case 'video':
        flag = (this.videoSize < size) ? false : true;
        break;
      case 'audio':
        flag = (this.audioSize < size) ? false : true;
        break;
      default:
        flag = (this.docSize < size) ? false : true;
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

  // Attachment Action
  attachmentAction(data) {
    console.log(data);
    let action = 'upload';
    let actionFlag = false;
    let access = data.action;
    let i = data.index;
    switch (access) {
      case 'caption':
      case 'caption-link':
        this.attachments[i]['action'] = data.captionAction;
        this.attachments[i]['fileCaption'] = data.text;
        this.attachments[i]['captionFlag'] = data.flag;
        this.uploadedFiles[i]['fileCaption'] = data.text;
        this.uploadedFiles[i]['file'] = data.files;

        if (access == 'caption-link') {
          this.uploadedFiles[i]['url'] = data.url;
          this.addLinkFlag = data.valid;
          this.uploadedFiles[i]['valid'] = data.valid;
        }
        break;

      case 'file-delete':
        action = 'delete';
        this.addLinkFlag = true;
        if (this.uploadedFiles[i].type != 'media' && this.uploadedFiles[i].flagId < 6) {
          this.filesArr.currentFiles.splice(i, 1);
        }
        this.uploadedFiles.splice(i, 1);
        this.attachments.splice(i, 1);
        let fileData = {
          action: 'order',
          attachments: this.attachments,
          files: this.uploadedFiles
        };
        this.attachmentAction(fileData);
        break;

      case 'order':
        this.attachments = data.attachments;
        this.uploadedFiles = data.files;
        for (let a in this.attachments) {
          let order = this.apiData['displayOrder'] + parseInt(a);
          let index = this.uploadedFiles.findIndex(option => option.name == this.attachments[a].originalName);
          this.uploadedFiles[index].displayOrder = ++order;
        }
        console.log(this.uploadedFiles);
        break;
    }
    this.uploadedFiles = (this.uploadedFiles == undefined) ? [] : this.uploadedFiles;
    if (this.attachments.length > 1) {
      let checkArr = ['originalFileName'];
      let unique = this.commonApi.unique(this.attachments, checkArr);
      //this.attachments = unique;
    }
    let uploadItems = {
      action: action,
      items: this.uploadedFiles,
      attachments: this.attachments,
      postData: this.postData,
      actionFlag: actionFlag,
      itemIndex: i
    };
    this.uploadedItems.emit(uploadItems);
  }

  // File upload
  async attachmentUpload() {
    localStorage.removeItem('jobPosted');
    let uploadItemsCount = 0;
    let uploadedFiles = [];
    let attachments = [];
    this.uploadedFiles.forEach((item, i) => {
      if (item.type != 'media') {
        uploadItemsCount++;
        uploadedFiles.push(this.uploadedFiles[i]);
        attachments.push(this.attachments[i]);
      }
    });
    this.uploadedFiles = uploadedFiles;
    this.attachments = attachments;
    console.log(this.uploadedFiles, this.attachments);
    //let uploadCount = this.uploadedFiles.length;
    let uploadCount = uploadItemsCount;
    console.log(uploadCount);
    let bulkAccess = this.apiData['bulkUpload'];
    let bulkFlag = (bulkAccess == 'undefined' || bulkAccess == undefined) ? false : bulkAccess;
    let i = 0;
    for (let u in this.uploadedFiles) {
      let accessType = this.attachments[u]['accessType'];
      if (accessType == 'upload' || accessType == 'link') {
        //this.currentFile = this.uploadedFiles[u];
        //this.attachments[u].push(this.apiData);
        this.attachments[u]['access'] = this.apiData['access'];
        this.attachments[u]['apiKey'] = this.apiData['apiKey'];
        this.attachments[u]['domainId'] = this.apiData['domainId'];
        this.attachments[u]['countryId'] = this.apiData['countryId'];
        this.attachments[u]['userId'] = this.apiData['userId'];
        this.attachments[u]['contentType'] = this.apiData['contentType'];
        this.attachments[u]['dataId'] = (bulkFlag) ? this.uploadedFiles[u]['dataId'] : this.apiData['dataId'];
        this.attachments[u]['displayOrder'] = this.uploadedFiles[u]['displayOrder'];
        this.attachments[u]['uploadCount'] = uploadCount;
        this.attachments[u]['uploadFlag'] = true;
        this.attachments[u]['processFlag'] = false;
        if(this.pageAccess == 'gtsr') {
          this.attachments[u]['procedureId'] = this.apiData['procedureId'];
          this.attachments[u]['processId'] = this.apiData['processId'];
          this.attachments[u]['gtsId'] = this.apiData['gtsId'];
        }
        if(this.pageAccess == 'workorder') {
          this.attachments[u]['threadId'] = this.apiData['threadId'];
          this.attachments[u]['postId'] = this.apiData['postId'];
          this.attachments[u]['workOrderId'] = this.apiData['workOrderId'];
        }
        if(this.pageAccess == 'workorder-page') {
          this.attachments[u]['workOrderId'] = this.apiData['workOrderId'];
          if(this.apiData['approvedFlag']=='1' && this.apiData['threadId']!= undefined)
          {
            this.attachments[u]['threadId'] = this.apiData['threadId'];
          }         
        }
        if(this.pageAccess == 'welcome-message') {
          this.attachments[u]['fromWelcomeMessage'] = this.apiData['fromWelcomeMessage'];
        }
        if(this.pageAccess == 'presets') {
          this.attachments[u]['presetId'] = this.apiData['presetId'];
        }
        let size = this.uploadedFiles[u].size;
        //this.totalSizeToUpload = size;
        this.totalSizeToUpload = this.calculateTotalSize();
        //this.attachments[u]['progress'] = 0;
        console.log(this.attachments[u]);
        this.attachmentProgress = true;
        if (!this.attachments[u].cancelFlag) {
          await this.uploadFile(i, u, this.attachments[u], this.uploadedFiles[u], uploadCount);
          i++;
        }
      }
    }
  }

  // Upload File
  uploadFile(index, findex, fileInfo, attachment, uploadCount) {
    console.log(fileInfo);
    console.log(attachment);
    console.log(this.pageAccess, this.apiData);
    //let i = parseInt(index)+1;
    let i = parseInt(index) + 1;
    //let uploadLen = this.uploadedFiles.length;
    let uploadLen = uploadCount;
    let totalTemp = 0;
    let fileType = this.attachments[findex]['flagId'];
    //this.totalSizeToUpload -= attachment.size;
    return new Promise<void>((resolve, reject) => {
      this.uploadFlag = this.uploadService.upload(this.pageAccess, fileInfo, attachment).subscribe((event: HttpEvent<any>) => {
          //console.log(event);
          uploadLen = this.uploadedFiles.length;
          console.log(uploadLen);
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
              this.attachments[findex]['progress'] = progress;
              if (fileType == 1) {
                setTimeout(() => {
                  progress = 101;
                  this.attachments[findex]['progress'] = progress;
                }, 500);
              }
              console.log(`Uploaded! ${this.attachments[findex]['progress']}%`);
              break;
            case HttpEventType.Response:
              totalTemp = this.loadedSoFar;
              let mediaId = event.body.data.mediaId;
              let flag = (fileType == 2) ? false : true;
              console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
              console.log(i + '::' + uploadLen);
              this.percentDone = (fileType == 2) ? 99 : 101;
              this.attachments[findex]['progress'] = this.percentDone;
              this.attachments[findex]['uploadStatus'] = 1;
              if(this.pageAccess == 'gtsr') {
                this.gtsAttachmentResponse.push(event.body.data.fileAttachments);
              }
              if (fileType == 2) {
                let c = 0;
                let jobId = event.body.data.jobId;
                console.log(jobId);
                if (jobId != '') {
                  this.attachments[findex]['processFlag'] = true;
                  this.percentDone = 101;
                  this.attachments[findex]['progress'] = this.percentDone;
                  this.checkJobStatus(jobId, c);
                  this.videoFlagInterval = setInterval(() => {
                    let chkVideoFlag: any = localStorage.getItem('jobPosted');
                    console.log(chkVideoFlag);
                    if (chkVideoFlag) {
                      this.jobStatusFlag.unsubscribe();
                      clearInterval(this.videoFlagInterval);
                      localStorage.removeItem('jobPosted');
                      this.attachments[findex]['processFlag'] = false;
                      console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
                      console.log(i + '::' + uploadLen);
                      setTimeout(() => {
                        if (this.jobStatusFlag) {
                          this.jobStatusFlag.unsubscribe();
                        }
                      }, 100);
                      if (i == uploadLen) {
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

              if (flag) {
                if (i == uploadLen) {
                  this.uploadCallback(uploadLen,mediaId);
                } else {
                  resolve();
                }
              }
              break;
          }
        },
        err => {
          this.progress = 0;
          //this.attachmentProgress = false;
          //this.attachmentView = true;
          //this.uploadCallback(0);
        });
    });
  }

  // Check Job Status
  checkJobStatus(jobId, i) {
    let data = {
      apiKey: this.apiData['apiKey'],
      jobId: jobId
    };
    this.jobStatusFlag = this.commonApi.checkJobStatus(data).subscribe((response: any) => {
      console.log(i, response.status, response.jobStatus);
      if (response.jobStatus == 'Complete') {
        let flag: any = true;
        localStorage.setItem('jobPosted', flag);
        clearInterval(this.videoInterval);
      } else {
        i++;
        this.videoInterval = setInterval(() => {
          if (this.jobStatusFlag) {
            this.jobStatusFlag.unsubscribe();
          }
          this.checkJobStatus(jobId, i);
        }, 10000);
      }
    });
  }

  // Upload Callback
  uploadCallback(event,mediaId=0) {
    this.uploadedFiles = [];
    this.attachments = [];
    this.attachmentProgress = false;
    this.attachmentView = false;
    this.successMsg = this.apiData['message'];
    if(this.pageAccess != 'post' && this.pageAccess != 'workorder' && this.pageAccess != 'audit-workflow'){
      this.msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
      this.msgModalRef.componentInstance.successMessage = this.successMsg;
    }
    let timeout = (this.pageAccess == 'post' || this.pageAccess == 'workorder' || this.pageAccess != 'audit-workflow') ? 0 : 2000;
    setTimeout(() => {
      let threadAction = this.apiData['threadAction'];
      console.log(threadAction, this.pageAccess);
      if (this.pageAccess != 'post' && this.pageAccess != 'workorder' && this.pageAccess != 'audit-workflow') {
        if (this.pageAccess != 'sib') {
          this.msgModalRef.dismiss('Cross click');
        }
        //if(!this.teamSystem || (this.pageAccess != 'thread') || (this.pageAccess == 'thread' && threadAction == 'new')) {
        if (!this.teamSystem && ((this.pageAccess != 'presets' && this.pageAccess != 'welcome-message' && this.pageAccess != 'userprofile-page' && this.pageAccess != 'workorder-page' &&  this.pageAccess != 'kaizen' && this.pageAccess != 'ppfr' && this.pageAccess != 'market-place' && this.pageAccess != 'thread' && this.pageAccess != 'documents' && this.pageAccess != 'adas' && this.pageAccess != 'parts' && this.pageAccess != 'knowledgearticles' && this.pageAccess != 'sib' && this.pageAccess != "bugorfeature" && this.pageAccess != "annoncements") || ((this.pageAccess == 'thread' || this.pageAccess == 'knowledgearticles' || (this.pageAccess == 'sib' && this.actionIndex < 0))) && threadAction == 'new')) {
          this.windowClose();
        }
        let flag: any = true;
        if (threadAction == 'edit') {
          //localStorage.setItem('routeLoad', 'true');
        }
        switch (this.pageAccess) {
          case 'presets':
            let data = {};
            data = {
              action: 'presets-upload',
              presetId: this.apiData['presetId'],
            };
            this.commonApi.emitpresetsUpload(data);
            break;
            case 'welcome-message':              
              this.commonApi.emitWelcomemsgUpload(true);
              break;
          case 'workorder-page':
            console.log(this.apiData);
            if(this.apiData['approvedFlag']=='1')
            {
              setTimeout(() => {
              let apiDatasocial2 = new FormData();
              apiDatasocial2.append('apiKey', this.apiData['apiKey']);
              apiDatasocial2.append('domainId', this.apiData['domainId']);
              apiDatasocial2.append('threadId', this.apiData['threadId']);
              apiDatasocial2.append('userId', this.apiData['userId']);
              apiDatasocial2.append('actionType', '1');
              apiDatasocial2.append('action', 'create');
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial2).subscribe((response: any) => { })
              },300);
            }
           
            let data1 = {};
            data1 = {
              action: 'workorder-upload',
              workOrderId: this.apiData['workOrderId'],
            };
            this.commonApi.emitworkorderUpload(data1);
              break;
              case 'userprofile-page':
                console.log(this.apiData);                
                let data2 = {};
                data2 = {
                  action: 'userprofile-upload',
                  actiontype: this.apiData['actiontype'],
                  uploload: true,
                  dataId: this.apiData['dataId'],
                };
                this.commonApi.emitUserProfileUpload(data2);
          break;
          case 'gtsr':
            let uploadItems = {
              action: 'submit',
              items: [],
              fileArr: [],
              attachments: [],
              response: this.gtsAttachmentResponse
            };
            this.gtsApi.fileDatas.items = [];
            this.gtsApi.fileDatas.attachments = []
            this.uploadedItems.emit(uploadItems);
            setTimeout(() => {
              this.gtsAttachmentResponse = [];
            }, 100);
            return false;
            break;
          case 'ppfr':
            if (this.teamSystem) {
              window.open(this.pageAccess, IsOpenNewTab.teamOpenNewTab);
            } else {

              let domainId = localStorage.getItem('domainId');
              let platformId = localStorage.getItem('platformId');
              let TVSIBDomain: boolean = false;
              TVSIBDomain = (platformId == '2' && domainId == '97') ? true : false;
              if (TVSIBDomain) {
                window.opener.location.reload();
                setTimeout(() => {
                  this.msgModalRef.dismiss('Cross click');
                  window.close();
                }, 1000);
              } else {
                if (threadAction == 'ppfr-page') {
                  window.close();
                } else {
                  this.router.navigate([this.pageAccess]);
                }
                window.opener.location.reload();
              }
            }
            break;
            case 'kaizen':
              if (this.teamSystem) {
                window.open(this.pageAccess, IsOpenNewTab.teamOpenNewTab);
              } else { 
                if(threadAction == 'new') {
                  //window.close();
                } else {
                  this.router.navigate([this.apiData['navUrl']]);
                }
                window.opener.location.reload();                
              }
              break;
          case 'annoncements':
            //window.opener.location = `${this.pageAccess}/dashboard`;
            if (threadAction == 'new') {
              this.ancApi.announcementPush(this.pushData).subscribe((response) => {
              });
              this.windowClose();
              window.opener.location.reload();
            } else {
              localStorage.setItem('viewAnc', flag);
              let url = `announcements/view/${this.apiData['dataId']}`; 
              this.router.navigate([url]);
            }
            break;
          case 'bugorfeature':
              if(this.teamSystem) {
                this.router.navigate([this.apiData['navUrl']]);
              } else {
                if(threadAction == 'edit') {
                  localStorage.setItem('viewKB', flag);
                  let url = `bug_and_features/view/${this.apiData['threadId']}`; 
                  this.router.navigate([url]);
                  
                } else {
                  this.windowClose();
                  window.opener.location.reload();
                }                        
              }
            break;
          case 'parts':
            console.log(this.apiData['navUrl']);
            if(this.apiData['solrApi']) {
              let partSolrApiData = this.apiData['apiDataSocial'];
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", partSolrApiData).subscribe((response: any) => { })
            }
            
            if (threadAction == 'edit') {
              //localStorage.setItem('viewPart', flag);
              this.router.navigate([this.apiData['navUrl']]);
            } else {
              let url = (threadAction == 'duplicate') ? RedirectionPage.Parts : this.apiData['navUrl'];
              //this.threadApi.threadPush(this.apiData['pushFormData']).subscribe((response) => {});
              this.router.navigate([url]);
            }
            break;
          case 'documents':
            let durl = this.apiData['navUrl'];
            if (this.teamSystem) {
              window.open(durl, IsOpenNewTab.teamOpenNewTab);
            } else {
              let notificationAction = this.apiData['notificationAction'];
              let approveNotificationAction = this.apiData['approveNotificationAction'];
              console.log('pushData: ' + this.pushData);
              console.log('notificationAction: ' + notificationAction);
              let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', this.apiData['apiKey']);
              apiDatasocial.append('domainId', this.apiData['domainId']);
              apiDatasocial.append('threadId', this.apiData['dataId']);
              apiDatasocial.append('userId', this.apiData['userId']);
              apiDatasocial.append('actionType', '2');
              apiDatasocial.append('action', 'create');
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
              if (notificationAction) {
                this.threadApi.documentNotification(this.pushData).subscribe((response) => { });
              }
              if(approveNotificationAction){
                this.threadApi.documentApprovalNotification(this.approveStatusData).subscribe((response) => { });
              }
              if (threadAction == 'edit') {
                localStorage.setItem('viewDoc', flag);
                if (durl == 'documents') {
                  window.location.href = durl;
                } else {
                  this.router.navigate([durl]);
                }
              } else {

                let opt = localStorage.getItem('documentViewOption');
                  console.log(opt);
                  if(opt == '2'){
                    setTimeout(() => {
                      console.log(this.apiData['dataId']);
                      this.viewMore(this.apiData['dataId']);
                    }, 200);                     
                  }
                  else{
                    this.windowClose();
                  }  

                
                window.opener.location = this.apiData['navUrl'];
              }
            }
            break;
          case 'adas-procedure':
            let apurl = this.apiData['navUrl'];
            if (this.teamSystem) {
              window.open(durl, IsOpenNewTab.teamOpenNewTab);
            } else {
              let notificationAction = this.apiData['notificationAction'];
              let solrAction = (threadAction == 'new') ? 'create' : 'update';
              let apiDatasocial = new FormData();
              apiDatasocial.append('apiKey', this.apiData['apiKey']);
              apiDatasocial.append('domainId', this.apiData['domainId']);
              apiDatasocial.append('threadId', this.apiData['dataId']);
              apiDatasocial.append('userId', this.apiData['userId']);
              apiDatasocial.append('actionType', this.apiData['solrType']);
              apiDatasocial.append('action', solrAction);
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
              if (notificationAction) {
                //this.threadApi.documentNotification(this.pushData).subscribe((response) => { });
              }
              let adasTimeOut = (threadAction == 'edit') ? 0 : 2750;
              if (threadAction == 'edit') {
                setTimeout(() => {
                  let newTab:any = localStorage.getItem('adasNavNewTab');
                  newTab = (newTab == null || newTab == 'null') ? false : newTab;
                  if(newTab) {
                    localStorage.removeItem('adasNavNewTab');
                    window.opener.location.reload();
                    this.windowClose();                                        
                  } else {
                    localStorage.setItem('viewAdas', flag);
                    window.opener.location.reload();
                    /* if (durl == RedirectionPage.AdasProcedure) {
                      window.location.href = durl;
                    } else {
                      this.router.navigate([durl]);
                    } */
                    this.router.navigate([durl]);
                  }
                }, adasTimeOut);                
              } else {
                this.windowClose();                
                window.opener.location = this.apiData['navUrl'];
              }
            }
            break;  
          case 'thread':
            let url = 'threads';
            let notificationAction = this.apiData['notificationAction'];
            let approveNotificationAction = this.apiData['approveNotificationAction'];
            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', this.apiData['apiKey']);
            apiDatasocial.append('domainId', this.apiData['domainId']);
            apiDatasocial.append('threadId', this.apiData['threadId']);
            apiDatasocial.append('postId', this.apiData['dataId']);
            apiDatasocial.append('userId', this.apiData['userId']);
            apiDatasocial.append('actionType', '1');
            apiDatasocial.append('action', 'create');
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            let platformIdInfo = localStorage.getItem('platformId');
            if(platformIdInfo=='3')
            {
              this.baseSerivce.postFormData("forum", "SendtoZendeskfromTac", apiDatasocial).subscribe((response: any) => { })
            }
            if (threadAction == 'new') {
              if(notificationAction) {
                this.threadApi.threadPush(this.pushData).subscribe((response) => {
                });
              }
              if(approveNotificationAction) {
                this.threadApi.documentApprovalNotification(this.apiData['approveStatusData']).subscribe((response) => {});
              }
            } else {
              if(notificationAction) {
                this.threadApi.threadPush(this.pushData).subscribe((response) => {
                });
              }
              let viewPath = (this.collabticDomain && this.apiData['domainId'] == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
              let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
              url = `${view}${this.apiData['threadId']}`;
            }
            
            if (threadAction == 'edit') {
              let platformId = localStorage.getItem('platformId');
              if(platformId == '1'){    
                let apiDataEdit = new FormData();
                apiDataEdit.append('apiKey', this.apiData['apiKey']);
                apiDataEdit.append('domainId', this.apiData['domainId']);
                apiDataEdit.append('threadId', this.apiData['threadId']);
                apiDataEdit.append('postId', this.apiData['dataId']);
                apiDataEdit.append('userId', this.apiData['userId']);
                apiDataEdit.append('actionType', '1');
                apiDataEdit.append('action', 'thread-edit'); 
                this.threadPostService.sendPushtoMobileAPI(apiDataEdit).subscribe((response) => { console.log(response); });
              }  
              this.router.navigate([url]);
            }
            break;
          case 'knowledgearticles':

            let apiDatasocialKA = new FormData();
            apiDatasocialKA.append('apiKey', this.apiData['apiKey']);
            apiDatasocialKA.append('domainId', this.apiData['domainId']);
            apiDatasocialKA.append('threadId', this.apiData['threadId']);
            apiDatasocialKA.append('userId', this.apiData['userId']);
            apiDatasocialKA.append('actionType', '6');
            apiDatasocialKA.append('action', 'create');
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocialKA).subscribe((response: any) => { })
            if (this.teamSystem) {
              this.router.navigate([this.apiData['navUrl']]);
            } else {
              if (threadAction == 'edit') {
                //localStorage.setItem('viewKA', flag);
                let url = `knowledgearticles/view/${this.apiData['threadId']}`;
                this.router.navigate([url]);
              } else {
                //localStorage.setItem('kaPush', this.apiData['workstreams']);
                window.opener.location.reload();
              }
            }
            break;
          case 'knowledge-base':
            if (this.teamSystem) {
              this.router.navigate([this.apiData['navUrl']]);
            } else {
              if (threadAction == 'edit') {
                localStorage.setItem('viewKB', flag);
                let url = `knowledge-base/view/${this.apiData['threadId']}`;
                this.router.navigate([url]);
              } else {
                //this.kbApi.pushKB(this.pushData).subscribe((response) => {});
              }
            }
            break;
          case 'sib':
            if (this.actionIndex < 0) {
              this.attachmentProgress = false;
              if (this.teamSystem) {
                this.router.navigate([this.pageAccess]);
              } else {
                if (threadAction == 'edit') {
                  this.msgModalRef.dismiss('Cross click');
                  let url = `sib/view/${this.apiData['threadId']}`;
                  this.router.navigate([url]);
                } else {
                  window.opener.location.reload();
                }
                //this.windowClose();
              }
            } else {
              this.uploadedFiles = [];
              this.attachments = [];
              this.attachmentView = false;
              this.fileLoading = false;
              setTimeout(() => {
                this.attachmentProgress = false;
                this.msgModalRef.dismiss('Cross click');
                let flag: any = true;
                localStorage.setItem('sibUpload', flag);
              }, 1500);
            }
            break;
          case 'market-place':
            let threadId = this.activatedRoute.snapshot.params['id'];
            if (threadId) {
              this.router.navigateByUrl('/market-place/view/'+threadId);
            } else {
              this.router.navigateByUrl('/market-place/training');
            }
            break;
        }
      } else {
        if(this.pageAccess == 'post'){
          let data = {};
          if (threadAction == 'edit') {
            data = {
              action: 'post-edit',
              postId: this.apiData['dataId'],
              nestedReply: this.apiData['nestedReply'],
              viewpage: this.apiData['viewpage'],
              parentPostId: this.apiData['parentPostId']
            };
            console.log(data);          
            let platformId = localStorage.getItem('platformId');
            if(platformId == '1'){            
            // PUSH
              let pnData = new FormData();
              pnData.append('apiKey', this.apiData['apiKey']);
              pnData.append('domainId', this.apiData['domainId']);
              pnData.append('countryId', this.apiData['countryId']);
              pnData.append('userId', this.apiData['userId']);
              pnData.append('threadId', this.apiData['threadId']);
              pnData.append('silentPush', '1'); 

              if(this.apiData['nestedReply'] != '1'){
                pnData.append('commentId', this.apiData['dataId']);
                pnData.append('action', 'comment-edit'); 
              }
              else{
                pnData.append('commentId', this.apiData['parentPostId']);
                pnData.append('replyId', this.apiData['dataId']);
                pnData.append('action', 'reply-edit');
              }   
              this.threadPostService.sendPushtoMobileAPI(pnData).subscribe((response) => {});        
            }
            if(platformId == '1' || platformId == '3' || platformId == '2'){
              let tcrData = new FormData();
              console.log(this.apiData);
              tcrData.append('apiKey', this.apiData['apiKey']);
              tcrData.append('domainId', this.apiData['domainId']);
              tcrData.append('threadId', this.apiData['threadId']);
              tcrData.append('userId', this.apiData['userId']);
              tcrData.append('commentId', this.apiData['commentId']);
              tcrData.append('action', 'replyCount'); 
              if(this.apiData['nestedReply'] != '1'){
                tcrData.append('commentId', this.apiData['dataId']);              
              }
              else{
                tcrData.append('commentId', this.apiData['parentPostId']);
                tcrData.append('replyId', this.apiData['dataId']);              
              }
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", tcrData).subscribe((response: any) => { })          
          
          

          }
          } else {
            // PUSH
            let pnData = new FormData();
            pnData.append('apiKey', this.apiData['apiKey']);
            pnData.append('domainId', this.apiData['domainId']);
            pnData.append('countryId', this.apiData['countryId']);
            pnData.append('userId', this.apiData['userId']);
            pnData.append('threadId', this.apiData['threadId']);
          
            if(this.apiData['nestedReply'] != '1'){
              pnData.append('action', 'comment');   
            }
            else{
              pnData.append('action', 'reply');   
              pnData.append('parentPostId', this.apiData['commentId']);
            }            

            let summitFix = this.apiData['summitFix'];
            if (summitFix == '0') {
              this.threadPostService.sendPushtoMobileAPI(pnData).subscribe((response) => {});
            }
            let platformId = localStorage.getItem('platformId');
            if(platformId == '1' || platformId == '3' || (platformId == '2' && (this.apiData['domainId']==52 || this.apiData['domainId']==82))){
              let tcrData = new FormData();
              console.log(this.apiData);
              tcrData.append('apiKey', this.apiData['apiKey']);
              tcrData.append('domainId', this.apiData['domainId']);
              tcrData.append('threadId', this.apiData['threadId']);
              tcrData.append('userId', this.apiData['userId']);
              tcrData.append('commentId', this.apiData['commentId']);
              tcrData.append('action', 'replyCount'); 
              if(this.apiData['nestedReply'] == '1'){
              tcrData.append('replyId', this.apiData['replyId']);
              }
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", tcrData).subscribe((response: any) => { })          
          
            if(platformId=='3')
            {
              this.baseSerivce.postFormData("forum", "SendReplytoZendeskfromTac", tcrData).subscribe((response: any) => { })
            }

          }
            // PUSH
            data = {
              action: 'post-new',
              postId: this.apiData['dataId'],
              nestedReply: this.apiData['nestedReply'],
              parentPostId: this.apiData['parentPostId']
            };
          }
          if(mediaId){
            this.commonApi.emitPostData({data:data,mediaId:mediaId});
          }else{
            this.commonApi.emitPostData(data);
          }
          this.uploadedFiles = [];
          this.attachments = [];
          let uploadItems = {
            action: 'upload',
            items: this.uploadedFiles,
            attachments: this.attachments,
            postData: this.postData
          };
          console.log(uploadItems);
          if(mediaId){
            this.uploadedItems.emit({uploadItems:uploadItems,mediaId:mediaId,attachments:this.attachmentItems});
          }else{
            this.uploadedItems.emit(uploadItems);
          }
          let fileData = {
            action: 'order',
            attachments: this.attachments
          };
          console.log(fileData);
          this.attachmentAction(fileData);
          //this.msgModalRef.dismiss('Cross click');
        }
        switch(this.pageAccess) {
          case 'workorder':
            let apiDatasocial = new FormData();
            apiDatasocial.append('apiKey', this.apiData['apiKey']);
            apiDatasocial.append('domainId', this.apiData['domainId']);
            apiDatasocial.append('threadId', this.apiData['threadId']);
            apiDatasocial.append('postId', this.apiData['dataId']);
            apiDatasocial.append('userId', this.apiData['userId']);
            apiDatasocial.append('actionType', '1');
            apiDatasocial.append('action', 'create');
            this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
            this.threadApi.threadPush(this.apiData['pushData']).subscribe((response) => {});
            this.commonApi.emitWorkorderData(true);  
            break;
          case 'audit-workflow':
            this.uploadComplete.emit(this.apiData['formApiData']);
            break;  
        }
      }
    }, timeout);
    console.log('File uploaded successfully created!', event.body);
  }

  // Cancel Upload
  cancelUpload(i) {
    let progress = this.attachments[i].progress;
    //if(progress == 0) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel Upload';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if (receivedService) {
        /*if(progress == 0) {
          //this.attachments[i].cancelFlag = true;
          this.attachments.splice(i, 1);
        }*/
        if (progress == 0) {
          this.uploadedFiles.splice(i, 1);
          this.attachments.splice(i, 1);
        }

        if (progress > 0 && this.attachments.length > 0) {
          this.uploadFlag.unsubscribe();
          console.log(i);
          console.log(this.attachments);
          console.log(this.uploadedFiles);
          //this.uploadFile(i, this.attachments[i], this.uploadedFiles[i]);
          this.attachmentUpload();
        }

        if (progress == 0 && this.attachments.length == 0) {
          this.attachmentProgress = false;
          this.attachmentView = true;
          this.uploadCallback(0);
        }

      }
    });
    /*} else {
      this.attachments.splice(i, 1);
      this.uploadFlag.unsubscribe();
    } */
  }

  // Convert File Size
  niceBytes(x) {
    let l = 0, n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    //include a decimal point and a tenths-place digit if presenting
    //less than ten of KB or greater units
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l]);
  }

  // Calculate Total File Size
  calculateTotalSize(): number {
    let total = 0;
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      total += this.uploadedFiles[i].size;
    }
    return total;
  }

  // Video File Reader
  readVideo(fileAttachment, file) {
    let filePath;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      filePath = e.target.result;
    };

    setTimeout(() => {
      // Setup Uploaded Files
      this.setupUploadedFiles(fileAttachment, file, -1, 0);
    }, 500);
  }

  tapOnMediaUpload(){
    console.log(this.apiData, this.attachmentItems, this.postData);
    let uf = [];
    this.uploadedFiles.forEach(item => {
      uf.push(item.fileId);
    });
    let mediaList = [];
    this.attachments.forEach(item => {
      mediaList.push(item.fileId);
    });
    let aitem = [];
    this.attachmentItems.forEach(item => {
      aitem.push(parseInt(item.fileId));
    });
    let data = {
      apiData: this.apiData,
      mediaList: mediaList,
      attachmentList: aitem,
      fileList: uf
    }
    this.commonApi.emitCloudTabData(data);    
  }

  mediaApply(){
      let removedItems = this.cloudTabApplyData.mediaRemoveList;
      let mediaItems = this.cloudTabApplyData.mediaSelectionList;
      let access = this.apiData['access'];
      let postAttachments = [];
      console.log(access);
      let existItem = '';
      switch (access) {
        case 'thread':
          existItem = 'threadAttachments';
          break;
        case 'presets':
          existItem = 'presetsAttachments';
          break;
        case 'opportunity':
          existItem = 'opportunityAttachments';
          break;
        case 'documents':
          existItem = 'docAttachments';
          break;
        case 'knowledgearticles':
          existItem = 'knowledgeArticlesAttachments';
          break;
        case 'parts':
          existItem = 'partAttachments';
          break;
        case 'post':
          console.log(this.postData);
          let postId = this.postData.postId;
          let threadId = this.postData.threadId;
          let threadPostText = `thread-post-${threadId}-attachments`;
          let postAttachmentItems: any = localStorage.getItem(threadPostText);
          postAttachmentItems = (postAttachmentItems) ? JSON.parse(postAttachmentItems) : [];
          let postIndex = postAttachmentItems.findIndex(option => option.id == postId);
          postAttachments = (postIndex < 0) ? [] : postAttachmentItems[postIndex].attachments;
          break;
      }
      let existingMediaItems = (access == 'post') ? postAttachments : JSON.parse(localStorage.getItem(existItem));
      let existIndex, action;
      console.log(existingMediaItems, mediaItems, removedItems);
      removedItems.forEach(rmitem => {
        let rmindex = this.attachments.findIndex(option => option.fileId == rmitem && option.accessType == 'media');
        //let rmId = rmitem.mediaId.toString();
        existIndex = -1;
        if (existingMediaItems != null) {
          existIndex = existingMediaItems.findIndex(option => option.fileId == rmitem);
        }
        console.log(rmitem, existIndex);
        if (rmindex >= 0 && existIndex < 0) {
          this.uploadedFiles.splice(rmindex, 1);
          this.attachments.splice(rmindex, 1);
        }

        if (existIndex >= 0) {
          action = 'remove';
          let data = {
            action: 'remove',
            postData: this.postData,
            media: rmitem
          };
          this.uploadedItems.emit(data);
        }
      });
      mediaItems.forEach(mitem => {
        let mindex = this.attachments.findIndex(option => option.fileId == mitem.mediaId);
        //let mId = mitem.mediaId.toString();
        existIndex = -1;
        if (existingMediaItems != null) {
          existIndex = existingMediaItems.findIndex(option => option.fileId == mitem.mediaId);
        }
        console.log(mitem, existIndex);
        if (mindex < 0 && existIndex < 0) {
          this.setupMediaUploadFiles(mitem);
        }

        if (existIndex >= 0) {
          let data = {
            action: 'insert',
            postData: this.postData,
            media: existingMediaItems[existIndex]
          };
          this.uploadedItems.emit(data);
        }
      });
      
  }

  mediaUpload() {
    if (this.tvsDomain) {
      return false;
    }
    console.log(this.apiData, this.attachmentItems, this.postData);
    let mediaList = [];
    this.attachments.forEach(item => {
      mediaList.push(item.fileId);
    });
    let aitem = [];
    this.attachmentItems.forEach(item => {
      aitem.push(parseInt(item.fileId));
    });
    const modalRef = this.modalService.open(MediaUploadComponent, this.mediaConfig);
    modalRef.componentInstance.access = '';
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.mediaList = mediaList;
    modalRef.componentInstance.attachmentList = aitem;
    modalRef.componentInstance.uploadAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      let removedItems = receivedService.mediaRemoveList;
      let mediaItems = receivedService.mediaSelectionList;
      let access = this.apiData['access'];
      let postAttachments = [];
      console.log(access);
      let existItem = '';
      switch (access) {
        case 'thread':
          existItem = 'threadAttachments';
          break;
        case 'presets':
          existItem = 'presetsAttachments';
          break;
        case 'opportunity':
          existItem = 'opportunityAttachments';
          break;
        case 'documents':
          existItem = 'docAttachments';
          break;
        case 'knowledgearticles':
          existItem = 'knowledgeArticlesAttachments';
          break;
        case 'parts':
          existItem = 'partAttachments';
          break;
        case 'post':
          console.log(this.postData);
          let postId = this.postData.postId;
          let threadId = this.postData.threadId;
          let threadPostText = `thread-post-${threadId}-attachments`;
          let postAttachmentItems: any = localStorage.getItem(threadPostText);
          postAttachmentItems = (postAttachmentItems) ? JSON.parse(postAttachmentItems) : [];
          let postIndex = postAttachmentItems.findIndex(option => option.id == postId);
          postAttachments = (postIndex < 0) ? [] : postAttachmentItems[postIndex].attachments;
          break;
      }
      let existingMediaItems = (access == 'post') ? postAttachments : JSON.parse(localStorage.getItem(existItem));
      let existIndex, action;
      console.log(existingMediaItems, mediaItems, removedItems);
      removedItems.forEach(rmitem => {
        let rmindex = this.attachments.findIndex(option => option.fileId == rmitem && option.accessType == 'media');
        //let rmId = rmitem.mediaId.toString();
        existIndex = -1;
        if (existingMediaItems != null) {
          existIndex = existingMediaItems.findIndex(option => option.fileId == rmitem);
        }
        console.log(rmitem, existIndex);
        if (rmindex >= 0 && existIndex < 0) {
          this.uploadedFiles.splice(rmindex, 1);
          this.attachments.splice(rmindex, 1);
        }

        if (existIndex >= 0) {
          action = 'remove';
          let data = {
            action: 'remove',
            postData: this.postData,
            media: rmitem
          };
          this.uploadedItems.emit(data);
        }
      });
      mediaItems.forEach(mitem => {
        let mindex = this.attachments.findIndex(option => option.fileId == mitem.mediaId);
        //let mId = mitem.mediaId.toString();
        existIndex = -1;
        if (existingMediaItems != null) {
          existIndex = existingMediaItems.findIndex(option => option.fileId == mitem.mediaId);
        }
        console.log(mitem, existIndex);
        if (mindex < 0 && existIndex < 0) {
          this.setupMediaUploadFiles(mitem);
        }

        if (existIndex >= 0) {
          let data = {
            action: 'insert',
            postData: this.postData,
            media: existingMediaItems[existIndex]
          };
          this.uploadedItems.emit(data);
        }
      });
      let secElement = document.getElementById('step');
      setTimeout(() => {
        let scrollTop = secElement.scrollTop;
        setTimeout(() => {
          let scrollPos = scrollTop - 150;
          secElement.scrollTop = scrollPos;
        }, 200);
      }, 700);
    });
  }

  setupMediaUploadFiles(item, atype = '', binaryfile = null) {
    console.log(123, item, this.apiData, this.uploadedFiles);
    this.fileLoading = true;
    this.attachmentView = false;
    this.uploadFileLength = this.uploadedFiles.length;
    let displayOrder = this.uploadFileLength + 1;
    let type = 'media';
    let accessTypeText = 'Media Manager';
    let flagId = parseInt(item.flagId);
    let caption = item.fileCaption;
    let fileAttachment = [];
    fileAttachment['accessTypeText'] = accessTypeText;
    fileAttachment['accessType'] = type;
    fileAttachment['flagId'] = flagId;
    fileAttachment['fileId'] = item.mediaId;
    fileAttachment['fileType'] = item.fileType;
    fileAttachment['fileCaption'] = caption;
    fileAttachment['captionFlag'] = false;
    fileAttachment['url'] = '';
    fileAttachment['actionLink'] = 'new';
    fileAttachment['action'] = 'new';
    fileAttachment['valid'] = true;
    fileAttachment['selectedLang'] = [];
    fileAttachment['thumbFilePath'] = (atype == 'exists') ? item.thumbFilePath : item.fileImg;
    fileAttachment['fileSize'] = item.fileSize;
    fileAttachment['originalFileName'] = item.originalFileName;
    fileAttachment['originalName'] = item.originalFileName;
    fileAttachment['displayOrder'] = displayOrder;
    fileAttachment['progress'] = 30;
    fileAttachment['fileAction'] = 'file';
    fileAttachment['binaryfile'] = binaryfile;

    let language = item.languageOptions;
    console.log(language);
    let langId = [], langName = [];
    language.forEach(lang => {
      console.log(lang.id);
      langId.push(lang.id);
      langName.push(lang.name);
    });
    fileAttachment['filteredLangItems'] = langId;
    fileAttachment['filteredLangList'] = langName;
    fileAttachment['selectedLang'] = langName;

    switch (flagId) {
      case 2:
        console.log(465);
        if (atype == 'exists') {
          let lastDot = item.filePath.lastIndexOf('.');
          let vname = item.filePath.substring(0, lastDot);
          item.posterImage = `${vname}-thumb-00001.png`;
          item.videoUrl = item.filePath;
          fileAttachment['fileAction'] = 'media';
          console.log(item.posterImage);
        }
        let posterImage = item.posterImage;
        let videoUrl = item.videoUrl;
        fileAttachment['thumbFilePath'] = posterImage;
        fileAttachment['posterImage'] = posterImage;
        fileAttachment['videoFilePath'] = videoUrl;
        fileAttachment['videoUrl'] = (atype == 'exists') ? videoUrl : this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
        break;
      case 6:
        let url = item.filePath;
        fileAttachment['logo'] = item.logo;
        fileAttachment['url'] = item.filePath;
        let aurl;
        let youtube = this.commonApi.matchYoutubeUrl(url);
        if (youtube) {
          item.linkType = 'youtube';
          aurl = `//www.youtube.com/embed/${youtube}`;
          fileAttachment['aurl'] = this.sanitizer.bypassSecurityTrustResourceUrl(aurl);
        }
        let vimeo = this.commonApi.matchVimeoUrl(url);
        if (vimeo) {
          item.linkType = 'video';
          aurl = `https://player.vimeo.com/video/${vimeo}`;
          fileAttachment['aurl'] = this.sanitizer.bypassSecurityTrustResourceUrl(aurl);
        }
        fileAttachment['fileType'] = item.linkType;
        break;
    }
    let file = {
      url: '',
      type: type,
      fileCaption: caption,
      filetype: item.fileType,
      flagId: item.flagId,
      displayOrder: displayOrder,
      name: item.originalFileName,
    };

    this.uploadedFiles.push(file);
    this.attachments.push(fileAttachment);
    console.log(this.uploadedFiles);
    console.log(this.attachments);

   // this.attachmentProgress = false;
    this.attachmentView = false;
    this.fileLoading = !this.attachmentView;
    setTimeout(() => {
      this.attachmentView = true;
      this.fileLoading = !this.attachmentView; 
      
      let uploadItems = {
        action: 'upload',
        items: this.uploadedFiles,        
        attachments: this.attachments                          
      };
      console.log(uploadItems);                
      this.uploadedItems.emit(uploadItems);

    },750);

    
    
    
  }

  // Window Close
  windowClose() {
    setTimeout(() => {
      window.close();
    }, 200);
  }

  viewMore(docId){
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' documents') ? false : true;
    let scrollTop:any = 0;
    localStorage.setItem('docClosePage', "1");
    localStorage.setItem('docId', docId);
    localStorage.setItem('docIddetail', docId);
    localStorage.setItem('docInfoNav', 'true');
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
	  let nav = `documents/view/${docId}`;
    console.log(nav);
	  this.router.navigate([nav]);
  }

  // GTS Runtime Upload
  gtsRuntimeUpload() {
    //console.log(this.apiData)
    this.attachmentUpload();
  }

}
