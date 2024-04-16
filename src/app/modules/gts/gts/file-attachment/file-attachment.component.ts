import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { forumPageAccess, IsOpenNewTab, MediaTypeInfo, MediaTypeSizes, PlatFormType, RedirectionPage } from 'src/app/common/constant/constant';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { DomSanitizer } from '@angular/platform-browser';
import { KnowledgeBaseService } from 'src/app/services/knowledge-base/knowledge-base.service';
import { MediaManagerService } from 'src/app/services/media-manager/media-manager.service';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ThreadPostService } from 'src/app/services/thread-post/thread-post.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-gtsfile-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss']
})
export class FileAttachmentComponent implements OnInit {

  @Input() apiData: Object;
  @Input() attachmentItems: any = [];
  @Input() postData: any = [];
  @Input() action: string;
  @Input() pushData: any = "";
  @Output() uploadedItems: EventEmitter<any> = new EventEmitter();

  public units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  title = 'ng-bootstrap-modal-demo';
  errorMsg: string = "Media Already Exist";
  closeResult: string;

  filesArr: any;
  waitingFiles: any = 0;
  uploadedFiles: any[] = [];
  attachments: any[] = [];
  progressInfos = [];
  uploadFileLength: number;

  public pageAccess: string = "";
  public chooseLable: string = "Files From PC";
  public chooseIcon: string = "pi pi-paperclip";
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public attachmentView: boolean = false;
  public attachmentProgress: boolean = false;
  public addLinkFlag: boolean = true;
  public fileLoading: boolean = false;
  public collabticDomain: boolean = false;
  public tvsDomain: boolean = false;
  public progress = 0;
  public percentDone = 0;
  public totalSizeToUpload = 0;
  public loadedSoFar = 0;
  public actionIndex: any = -1;
  public successMsg: string = "Uploading...";
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public newThreadView: boolean = false;
  public videoInterval: any;
  public videoFlagInterval: any;

  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public mediaManagerPath: string = `${this.mediaPath}/manager`;
  public mediaIcon: string = 'media-active-icon.png';

  public imageSize: number = parseInt(MediaTypeSizes.fileSize);
  public videoSize: number = parseInt(MediaTypeSizes.fileSize);
  public audioSize: number = parseInt(MediaTypeSizes.fileSize);
  public docSize: number = parseInt(MediaTypeSizes.fileSize);
  public fileSizeTxt: string = MediaTypeSizes.fileSizeTxt;
  public processingTxt: string = MediaTypeInfo.ProcessingTxt;

  public customError: any = [];
  public invalidFileText: string = "Invalid file size";
  public maxUploadText: string = "maximum upload size is";
  public uploadFlag: any = null;
  public jobStatusFlag: any = null;
  public mediaConfig: any = { backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal' };
  public modalConfig: any = { backdrop: 'static', keyboard: false, centered: true, windowClass: 'custom-modal' };
  public teamSystem = localStorage.getItem('teamSystem');

  constructor(
    private router: Router,
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
    private kbApi: KnowledgeBaseService
  ) {
    this.config.backdrop = 'static';
    this.config.keyboard = false;
    this.config.size = 'dialog-centered';
  }

  ngOnInit(): void {

    let platformId = localStorage.getItem("platformId");
    let domainId = localStorage.getItem("domainId");
    this.tvsDomain = (platformId == '2' && domainId == '52') ? true : false;
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.mediaIcon = (this.tvsDomain) ? 'media-gray-icon.png' : this.mediaIcon;
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;

    let msize = localStorage.getItem('uploadMaxSize');
    let mText = localStorage.getItem('uploadMaxSizeText');

    this.imageSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.videoSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.audioSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.docSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);

    this.fileSizeTxt = (mText != 'undefined' && mText != undefined) ? mText : MediaTypeSizes.fileSizeTxt;

    this.pageAccess = this.apiData['access'];
    this.actionIndex = this.apiData['actionIndex'];
    this.uploadFileLength = this.uploadedFiles.length;
    switch (this.action) {
      case 'uploading':
        this.uploadedFiles = this.apiData['uploadedItems'];
        this.attachments = this.apiData['attachments'];
        this.attachmentUpload();
        break;
      case 'attachments':
        this.attachments = this.apiData['attachmentItems'];
        break;
      default:
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
  }

  // On Select File Upload
  onUpload(event) {
    this.customError = [];
    this.uploadedFiles = (this.uploadedFiles == undefined) ? [] : this.uploadedFiles;
    let i = 0;
    this.attachmentView = false;
    this.fileLoading = !this.attachmentView;
    this.uploadFileLength = this.uploadedFiles.length;
    this.filesArr = event;
    let fileLen = event.files.length;
    this.waitingFiles = fileLen;
    for (let file of event.files) {
      let flag = true;
      let fileType = file.type.split('/');
      let fileExtn = file.name.split('.').pop();
      let fileAttachment = [];
      let fname = file.name;
      let displayOrder = this.apiData['displayOrder'] + i;
      let lastDot = fname.lastIndexOf('.');
      let fileName = fname.substring(0, lastDot);
      let fileIndex = i + 1;
      if (this.attachments.length > 0) {
        for (let a of this.attachments) {
          if (fileName == a.fileCaption || (fname == a.originalName && a.accessType == 'upload')) {
            flag = false;
            this.fileLoading = flag;
            this.invalidFileText = this.errorMsg;
            this.setErrMsg(fname, -1);
          }
        }
      }
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
      fileAttachment['action'] = "new";
      fileAttachment['progress'] = 0;
      fileAttachment['cancelFlag'] = false;
      fileAttachment['valid'] = true;
      fileAttachment['language'] = "1";
      fileAttachment['itemValues'] = [];
      fileAttachment['selectedLang'] = [];
      fileAttachment['filteredLangItems'] = [];
      fileAttachment['filteredLangList'] = [];

      file['language'] = "1";
      file['fileCaption'] = fileName;
      file['captionFlag'] = false;
      file['displayOrder'] = this.uploadFileLength + displayOrder;

      if (flag) {
        let mediaFlag;
        const mediaFormData = new FormData();
        mediaFormData.append('apiKey', this.apiData['apiKey']);
        mediaFormData.append('domainId', this.apiData['domainId']);
        mediaFormData.append('countryId', this.apiData['countryId']);
        mediaFormData.append('userId', this.apiData['userId']);
        mediaFormData.append('fileName', file.name.replace(/'/g, ''));
        mediaFormData.append('fileType', file.type);



        const uploadMediaFormData = new FormData();
        uploadMediaFormData.append('apiKey', this.apiData['apiKey']);
        uploadMediaFormData.append('workstreamId', this.apiData['workstreamId']);
        uploadMediaFormData.append('userId', this.apiData['userId']);
        uploadMediaFormData.append('domainId', this.apiData['domainId']);
        uploadMediaFormData.append('dataId', this.apiData['dataId']);
        uploadMediaFormData.append('gtsId', this.apiData['gtsId']);
        uploadMediaFormData.append('uploadByAuthor', this.apiData['uploadByAuthor']);

        uploadMediaFormData.append('linkUrl', this.apiData['linkUrl']);
        uploadMediaFormData.append('caption', fileName);

        uploadMediaFormData.append('type', file.type);
        uploadMediaFormData.append('procedureId', this.apiData['procedureId']);
        uploadMediaFormData.append('processId', this.apiData['processId']);

        uploadMediaFormData.append('contentId', this.apiData['contentId']);

        uploadMediaFormData.append('userInputId', this.apiData['userInputId']);
        uploadMediaFormData.append('countryId', this.apiData['countryId']);
        uploadMediaFormData.append('contentTypeId', this.apiData['contentTypeId']);
        uploadMediaFormData.append('file', file);
        uploadMediaFormData.append('flagId', this.apiData['flagId']);
        uploadMediaFormData.append('uploadCount', this.apiData['uploadCount']);
        uploadMediaFormData.append('uploadFlag', this.apiData['uploadFlag']);
        uploadMediaFormData.append('displayOrder', this.apiData['displayOrder']);

        this.mediaApi.checkUploadAttachment(uploadMediaFormData).subscribe((response) => {
          this.waitingFiles -= 1;
          mediaFlag = (response.status == 'Success') ? true : false;
          flag = mediaFlag;
          let msg = response.result;
          if (!mediaFlag) {
            //this.invalidFileText = msg;
            //this.setErrMsg(fname, -1);
            let mitem = response.mediaData;
            let mindex = this.attachments.findIndex(option => option.fileId == mitem.mediaId);
            if (mindex < 0) {
              this.setupMediaUploadFiles(mitem, 'exists');
            }
            if (this.waitingFiles == 0) {
              setTimeout(() => {
                this.attachmentView = true;
                this.fileLoading = !this.attachmentView;
                if (this.attachments.length > 1) {
                  let checkArr = ['originalFileName'];
                  let unique = this.commonApi.unique(this.attachments, checkArr);
                  //this.attachments = unique;
                }
                let uploadItems = {
                  items: this.uploadedFiles,
                  attachments: this.attachments,
                  postData: this.postData
                };
                this.uploadedItems.emit(uploadItems);
              }, 1000);
            }

          } else {
            this.initFileUpload(file, fileIndex, fileLen, fileAttachment, i);
          }
        });

        // this.mediaApi.checkMediaName(mediaFormData).subscribe((response) => {
        //   this.waitingFiles -= 1;
        //   mediaFlag = (response.status == 'Success') ? true : false;
        //   flag = mediaFlag;
        //   let msg = response.result;
        //   if (!mediaFlag) {
        //     //this.invalidFileText = msg;
        //     //this.setErrMsg(fname, -1);
        //     let mitem = response.mediaData;
        //     let mindex = this.attachments.findIndex(option => option.fileId == mitem.mediaId);
        //     if (mindex < 0) {
        //       this.setupMediaUploadFiles(mitem, 'exists');
        //     }
        //     if (this.waitingFiles == 0) {
        //       setTimeout(() => {
        //         this.attachmentView = true;
        //         this.fileLoading = !this.attachmentView;
        //         if (this.attachments.length > 1) {
        //           let checkArr = ['originalFileName'];
        //           let unique = this.commonApi.unique(this.attachments, checkArr);
        //           //this.attachments = unique;
        //         }
        //         let uploadItems = {
        //           items: this.uploadedFiles,
        //           attachments: this.attachments,
        //           postData: this.postData
        //         };
        //         this.uploadedItems.emit(uploadItems);
        //       }, 1000);
        //     }

        //   } else {
        //     this.initFileUpload(file, fileIndex, fileLen, fileAttachment, i);
        //   }
        // });
      }
      i++;
    }
  }

  // Init Media File Upload
  initFileUpload(file, fileIndex, fileLen, fileAttachment, itemIndex) {
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
        }
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
            }
            fileAttachment['thumbFilePath'] = `${this.mediaPath}/audio-medium.png`;
            // Setup Uploaded Files
            setTimeout(() => { this.setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex); }, 500);
          }
        }, 500);
        break;
      default:
        flag = this.validateFileSize(fileType[0], file.size);
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

    setTimeout(() => {
      if (!flag) {
        this.filesArr.currentFiles.splice(fileIndex, 1);
        if (fileLen == 1 || (fileLen > 1 && (fileIndex + 1) == fileLen)) {
          this.attachmentView = true;
          this.fileLoading = !this.attachmentView;
          let uploadItems = {
            items: this.uploadedFiles,
            attachments: this.attachments,
            postData: this.postData
          };
          this.uploadedItems.emit(uploadItems);
        }
      }
    }, 500);
  }

  // Compress Image
  compressFile(fileType, fileAttachment, file, image, fileIndex = -1, fileLen, itemIndex) {
    let orientation = -1;
    let originalImageSize = this.imageCompress.byteCount(image);
    console.warn('Size in bytes is now:', originalImageSize);
    this.imageCompress.compressFile(image, orientation, 75, 50).then(result => {
      let imgResultAfterCompress = result;
      let sizeOFCompressedImage = this.imageCompress.byteCount(result);
      console.warn('Size in bytes after compression:', sizeOFCompressedImage);

      // call method that creates a blob from dataUri
      let compressImg = imgResultAfterCompress.split(',');
      const imageBlob = this.dataURItoBlob(compressImg);
      let flag = this.validateFileSize(fileType, sizeOFCompressedImage);
      fileAttachment['flagId'] = 1;
      setTimeout(() => {
        let imgSize = this.fileSizeTxt;
        if (!flag) {
          this.setErrMsg(file.name, imgSize);
        } else {
          fileAttachment['fileSize'] = sizeOFCompressedImage;
          fileAttachment['thumbFilePath'] = (imgResultAfterCompress != undefined) ? imgResultAfterCompress : `${this.mediaPath}/image-thumb.png`;
          const imageFile = new File([imageBlob], file.name, { type: file.type });
          imageFile['captionFlag'] = file.captionFlag;
          imageFile['fileCaption'] = file.fileCaption;
          imageFile['displayOrder'] = file.displayOrder;
          // Setup Uploaded Files
          this.setupUploadedFiles(fileAttachment, imageFile, fileIndex, fileLen, itemIndex);
        }
      }, 500);
    });
  }

  // Setup Uploaded Files
  setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex = -1) {
    /*if(fileAttachment['flagId'] < 6) {
      let fileSize = this.commonApi.niceBytes(file.size);
      fileAttachment['fileSize'] = fileSize;
    }*/

    fileAttachment['fileSize'] = this.commonApi.niceBytes(fileAttachment['fileSize']);
    this.uploadedFiles.push(file);
    fileAttachment['filePath'] = file['thumbFilePath'];
    fileAttachment['videoFilePath'] = fileAttachment['videoFilePath'];
    let fa = fileAttachment['videoFilePath'];
    fa = this.sanitizer.bypassSecurityTrustResourceUrl(fa);
    fileAttachment['videoFilePath_att'] = fa;
    fileAttachment['audioFilePath'] = fileAttachment['audioFilePath'];
    fileAttachment['uploadStatus'] = 0;
    this.attachments.push(fileAttachment);
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
      items: this.uploadedFiles,
      attachments: this.attachments,
      postData: this.postData
    };
    this.uploadedItems.emit(uploadItems);
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

  // Add Link
  addLink() {
    //return false;
    if (this.addLinkFlag) {
      this.addLinkFlag = false;
      this.fileLoading = true;
      this.attachmentView = false;
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
      fileAttachment['url'] = "";
      fileAttachment['actionLink'] = "new";
      fileAttachment['action'] = "new";
      fileAttachment['valid'] = false;
      fileAttachment['selectedLang'] = [];
      fileAttachment['filteredLangItems'] = [];
      fileAttachment['filteredLangList'] = [];
      fileAttachment['progress'] = 70;
      fileAttachment['logo'] = `${this.mediaPath}/link-medium.png`;
      let file = {
        url: "",
        type: 'link',
        fileCaption: caption,
        filetype: 'link',
        flagId: 6,
        displayOrder: this.uploadFileLength + displayOrder
      };

      this.uploadedFiles.push(file);
      this.attachments.push(fileAttachment);
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
        items: this.uploadedFiles,
        attachments: this.attachments,
        postData: this.postData
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
    let access = data.action;
    let i = data.index;
    switch (access) {
      case 'caption':
      case 'caption-link':
        this.attachments[i]['action'] = data.captionAction;
        this.attachments[i]['fileCaption'] = data.text;
        this.attachments[i]['captionFlag'] = data.flag;
        this.uploadedFiles[i]['fileCaption'] = data.text;
        if (access == 'caption-link') {
          this.uploadedFiles[i]['url'] = data.url;
          this.addLinkFlag = data.valid;
          this.uploadedFiles[i]['valid'] = data.valid;
        }
        break;

      case 'file-delete':
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
        break;
    }
    this.uploadedFiles = (this.uploadedFiles == undefined) ? [] : this.uploadedFiles;
    if (this.attachments.length > 1) {
      let checkArr = ['originalFileName'];
      let unique = this.commonApi.unique(this.attachments, checkArr);
      //this.attachments = unique;
    }
    let uploadItems = {
      items: this.uploadedFiles,
      attachments: this.attachments,
      postData: this.postData
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
    //let uploadCount = this.uploadedFiles.length;
    let uploadCount = uploadItemsCount;
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
        let size = this.uploadedFiles[u].size;
        //this.totalSizeToUpload = size;
        this.totalSizeToUpload = this.calculateTotalSize();
        //this.attachments[u]['progress'] = 0;
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
    //let i = parseInt(index)+1;
    let i = parseInt(index) + 1;
    //let uploadLen = this.uploadedFiles.length;
    let uploadLen = uploadCount;
    let totalTemp = 0;
    let fileType = this.attachments[findex]['flagId'];
    //this.totalSizeToUpload -= attachment.size;
    return new Promise<void>((resolve, reject) => {
      this.uploadFlag = this.uploadService.upload(this.pageAccess, fileInfo, attachment).subscribe((event: HttpEvent<any>) => {
        uploadLen = this.uploadedFiles.length;
        switch (event.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.ResponseHeader:
            break;
          case HttpEventType.UploadProgress:
            /*this.loadedSoFar = totalTemp + event.loaded;
            this.percentDone = Math.round(100 * this.loadedSoFar / this.totalSizeToUpload);
            this.attachments[index]['progress'] = this.percentDone;
          */
            let progress = Math.round(100 * event.loaded / event.total);
            this.attachments[findex]['progress'] = progress;
            if (fileType == 1) {
              setTimeout(() => {
                progress = 101;
                this.attachments[findex]['progress'] = progress;
              }, 500);
            }
            break;
          case HttpEventType.Response:
            totalTemp = this.loadedSoFar;
            let flag = (fileType == 2) ? false : true;
            this.percentDone = (fileType == 2) ? 99 : 101;
            this.attachments[findex]['progress'] = this.percentDone;

            this.attachments[findex]['uploadStatus'] = 1;
            if (fileType == 2) {
              let c = 0;
              let jobId = event.body.data.jobId;
              if (jobId != '') {
                this.attachments[findex]['processFlag'] = true;
                this.percentDone = 101;
                this.attachments[findex]['progress'] = this.percentDone;
                this.checkJobStatus(jobId, c);
                this.videoFlagInterval = setInterval(() => {
                  let chkVideoFlag: any = localStorage.getItem('jobPosted');
                  if (chkVideoFlag) {
                    this.jobStatusFlag.unsubscribe();
                    clearInterval(this.videoFlagInterval);
                    localStorage.removeItem('jobPosted');
                    this.attachments[findex]['processFlag'] = false;
                    setTimeout(() => {
                      if (this.jobStatusFlag) {
                        this.jobStatusFlag.unsubscribe();
                      }
                    }, 100);
                    if (i == uploadLen) {
                      this.jobStatusFlag.unsubscribe();
                      this.uploadCallback(uploadLen);
                    } else {
                      resolve();
                    }
                  }
                }, 100);
              }
            }

            if (flag) {
              if (i == uploadLen) {
                this.uploadCallback(uploadLen);
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
    })
  }

  // Check Job Status
  checkJobStatus(jobId, i) {
    let data = {
      apiKey: this.apiData['apiKey'],
      jobId: jobId
    };
    this.jobStatusFlag = this.commonApi.checkJobStatus(data).subscribe((response: any) => {
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
  uploadCallback(event) {
    this.attachmentProgress = false;
    this.attachmentView = false;
    this.successMsg = this.apiData['message'];
    const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
    msgModalRef.componentInstance.successMessage = this.successMsg;

    //if(this.pageAccess != 'post'){
    //if(this.pageAccess != 'sib') {
    this.attachmentProgress = false;
    //}
    //}
    setTimeout(() => {
      let threadAction = this.apiData['threadAction'];
      if (this.pageAccess != 'post') {
        if (this.pageAccess != 'sib') {
          msgModalRef.dismiss('Cross click');
        }
        //if(!this.teamSystem || (this.pageAccess != 'thread') || (this.pageAccess == 'thread' && threadAction == 'new')) {
        if (!this.teamSystem && ((this.pageAccess != 'ppfr' && this.pageAccess != 'thread' && this.pageAccess != 'documents' && this.pageAccess != 'parts' && this.pageAccess != 'knowledgearticles' && this.pageAccess != 'sib') || ((this.pageAccess == 'thread' || this.pageAccess == 'knowledgearticles' || (this.pageAccess == 'sib' && this.actionIndex < 0))) && threadAction == 'new')) {
          this.windowClose();
        }
        let flag: any = true;
        if (threadAction == 'edit') {
          //localStorage.setItem('routeLoad', 'true');
        }
        switch (this.pageAccess) {
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
                  msgModalRef.dismiss('Cross click');
                  window.close();
                }, 1000);
              }
              else {
                if (threadAction == 'ppfr-page') {
                  window.close();
                }
                else {
                  this.router.navigate([this.pageAccess]);
                }
                window.opener.location.reload();
              }
            }
            break;
          case 'annoncements':
            //window.opener.location = `${this.pageAccess}/dashboard`;
            if (threadAction == 'new') {
              this.ancApi.announcementPush(this.pushData).subscribe((response) => { });
            } else {
              localStorage.setItem('viewAnc', flag);
            }
            break;
          case 'parts':
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
              if (notificationAction) { this.threadApi.documentNotification(this.pushData).subscribe((response) => { }); }
              if (threadAction == 'edit') {
                localStorage.setItem('viewDoc', flag);
                if (durl == 'documents') {
                  window.location.href = durl;
                } else {
                  this.router.navigate([durl]);
                }
              } else {
                this.windowClose();
                window.opener.location = this.apiData['navUrl'];
              }
            }
            break;
          case 'thread':
            let url = 'threads';
            if (threadAction == 'new') {
              this.threadApi.threadPush(this.pushData).subscribe((response) => { });
            } else {
              let domainId:any = localStorage.getItem('domainId');
              let viewPath = (this.collabticDomain && domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
              let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
              url = `${view}${this.apiData['threadId']}`;
            }
            if (threadAction == 'edit') {
              this.router.navigate([url]);
            }
            break;
          case 'knowledgearticles':
            if (this.teamSystem) {
              this.router.navigate([this.apiData['navUrl']]);
            } else {
              if (threadAction == 'edit') {
                //localStorage.setItem('viewKA', flag);
                let url = `knowledgearticles/view/${this.apiData['threadId']}`;
                this.router.navigate([url]);
              } else {
                localStorage.setItem("kaPush", this.apiData['workstreams']);
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
                  msgModalRef.dismiss('Cross click');
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
                msgModalRef.dismiss('Cross click');
                let flag: any = true;
                localStorage.setItem('sibUpload', flag);
              }, 1500);
            }
            break;
        }
      }
      else {
        let data = {};
        if (threadAction == 'edit') {
          data = {
            action: 'post-edit',
            postId: this.apiData['dataId']
          }
        }
        else {
          // PUSH
          let pnData = new FormData();
          pnData.append('apiKey', this.apiData['apiKey']);
          pnData.append('domainId', this.apiData['domainId']);
          pnData.append('countryId', this.apiData['countryId']);
          pnData.append('userId', this.apiData['userId']);
          let summitFix = this.apiData['summitFix'];
          if (summitFix == '0') { this.threadPostService.sendPushtoMobileAPI(pnData).subscribe((response) => { }); }
          // PUSH
          data = {
            action: 'post-new',
            postId: this.apiData['dataId']
          }
        }
        this.commonApi.emitPostData(data);
        this.uploadedFiles = [];
        this.attachments = [];
        let uploadItems = {
          items: this.uploadedFiles,
          attachments: this.attachments,
          postData: this.postData
        };
        this.uploadedItems.emit(uploadItems);
        let fileData = {
          action: 'order',
          attachments: this.attachments
        };
        this.attachmentAction(fileData);
        msgModalRef.dismiss('Cross click');
      }
    }, 5000);
  }

  // Cancel Upload
  cancelUpload(i) {
    let progress = this.attachments[i].progress;
    //if(progress == 0) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel Upload';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
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
    reader.onload = function (e) {
      filePath = e.target.result;
    };

    setTimeout(() => {
      // Setup Uploaded Files
      this.setupUploadedFiles(fileAttachment, file, -1, 0);
    }, 500);
  }

  mediaUpload() {
    if (this.tvsDomain) {
      return false;
    }
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
      let existItem = '';
      switch (access) {
        case 'thread':
          existItem = 'threadAttachments';
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
      removedItems.forEach(rmitem => {
        let rmindex = this.attachments.findIndex(option => option.fileId == rmitem && option.accessType == 'media');
        //let rmId = rmitem.mediaId.toString();
        existIndex = -1;
        if (existingMediaItems != null) {
          existIndex = existingMediaItems.findIndex(option => option.fileId == rmitem);
        }
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

  setupMediaUploadFiles(item, atype = '') {
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
    fileAttachment['url'] = "";
    fileAttachment['actionLink'] = "new";
    fileAttachment['action'] = "new";
    fileAttachment['valid'] = true;
    fileAttachment['selectedLang'] = [];
    fileAttachment['thumbFilePath'] = (atype == 'exists') ? item.thumbFilePath : item.fileImg;
    fileAttachment['fileSize'] = item.fileSize;
    fileAttachment['originalFileName'] = item.originalFileName;
    fileAttachment['originalName'] = item.originalFileName;
    fileAttachment['displayOrder'] = displayOrder;
    fileAttachment['progress'] = 30;
    fileAttachment['fileAction'] = 'file';

    let language = item.languageOptions;
    let langId = [], langName = [];
    language.forEach(lang => {
      langId.push(lang.id);
      langName.push(lang.name);
    });
    fileAttachment['filteredLangItems'] = langId;
    fileAttachment['filteredLangList'] = langName;
    fileAttachment['selectedLang'] = langName;

    switch (flagId) {
      case 2:
        if (atype == 'exists') {
          let lastDot = item.filePath.lastIndexOf('.');
          let vname = item.filePath.substring(0, lastDot);
          item.posterImage = `${vname}-thumb-00001.png`;
          item.videoUrl = item.filePath;
          fileAttachment['fileAction'] = 'media';
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
      url: "",
      type: type,
      fileCaption: caption,
      filetype: item.fileType,
      flagId: item.flagId,
      displayOrder: displayOrder,
      name: item.originalFileName,
    };

    this.uploadedFiles.push(file);
    this.attachments.push(fileAttachment);

    setTimeout(() => {
      this.fileLoading = false;
      this.attachmentView = true;
    }, 750);

    let uploadItems = {
      items: this.uploadedFiles,
      attachments: this.attachments,
      postData: this.postData
    };
    this.uploadedItems.emit(uploadItems);
  }

  // Window Close
  windowClose() {
    setTimeout(() => {
      window.close();
    }, 200);
  }

}
