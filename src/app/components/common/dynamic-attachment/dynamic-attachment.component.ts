import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../../../services/common/common.service';
import {MediaManagerService} from '../../../services/media-manager/media-manager.service';
import {UploadService} from '../../../services/upload/upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {NgbActiveModal, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgxImageCompressService} from 'ngx-image-compress';
import {IsOpenNewTab, MediaTypeInfo, MediaTypeSizes, RedirectionPage} from '../../../common/constant/constant';
import {ConfirmationComponent} from 'src/app/components/common/confirmation/confirmation.component';
import {MediaUploadComponent} from 'src/app/components/media-upload/media-upload.component';
import {SuccessModalComponent} from '../../../components/common/success-modal/success-modal.component';
import { AddLinkComponent } from 'src/app/components/common/add-link/add-link.component';
import {DomSanitizer} from '@angular/platform-browser';
import {GtsService} from 'src/app/services/gts/gts.service';

@Component({
  selector: 'app-dynamic-attachment',
  templateUrl: './dynamic-attachment.component.html',
  styleUrls: ['./dynamic-attachment.component.scss']
})
export class DynamicAttachmentComponent implements OnInit {
  @Input() apiData: Object;
  @Input() attachmentItems: any = [];
  @Input() postData: any = [];
  @Input() action: string;
  @Input() pushData: any = '';
  @Output() uploadedItems: EventEmitter<any> = new EventEmitter();
  @Output() processStepsEnableUpdate: EventEmitter<any> = new EventEmitter();
  @Input() showAttachment = false;
  @Input() dataId: any = 0;
  @Input() fieldId: any = 0;
  @Input() hideCloud = false;

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
  currentMediaId: any;
  public fileAttachmentFlag:boolean = true;
  public mediaCompressFlag: boolean = true;

  public pageAccess: string = '';
  public chooseLable: string = 'Files From PC';
  public chooseIcon: string = 'pi pi-paperclip';
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public attachmentView: boolean = false;
  public attachmentProgress: boolean = false;
  public addLinkFlag: boolean = true;
  public fileLoading: boolean = false;
  public tvsDomain: boolean = false;
  public progress = 0;
  public percentDone = 0;
  public totalSizeToUpload = 0;
  public loadedSoFar = 0;
  public actionIndex: any = -1;
  public successMsg: string = MediaTypeInfo.UploadingTxt;
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public videoInterval: any;
  public videoFlagInterval: any;
  public gtsAttachmentResponse: any = {
    items: []
  };
  public mediaAttachments: any = [];

  public assetPath: string = 'assets/images';
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
  public invalidFileText: string = 'Invalid file size';
  public maxUploadText: string = 'maximum upload size is';
  public uploadFlag: any = null;
  public jobStatusFlag: any = null;
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'custom-modal'};
  public teamSystem = localStorage.getItem('teamSystem');
  @Input() isUpoladButtonShow: boolean = false;
  currentFile: any;

  constructor(
    private router: Router,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private imageCompress: NgxImageCompressService,
    private commonApi: CommonService,
    private mediaApi: MediaManagerService,
    private uploadService: UploadService,
    public sanitizer: DomSanitizer,
    public gtsApi: GtsService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    console.log(this.uploadedFiles);
    console.log(this.action);
    console.log(this.apiData);

    let platformId = localStorage.getItem('platformId');
    let domainId = localStorage.getItem('domainId');
    this.tvsDomain = (platformId == '2' && domainId == '52') ? true : false;
    this.mediaIcon = (this.tvsDomain) ? 'media-gray-icon.png' : this.mediaIcon;

    let msize = localStorage.getItem('uploadMaxSize');
    let mText = localStorage.getItem('uploadMaxSizeText');

    this.imageSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.videoSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.audioSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);
    this.docSize = (msize != 'undefined' && msize != undefined) ? parseInt(msize) : parseInt(MediaTypeSizes.fileSize);

    this.fileSizeTxt = (mText != 'undefined' && mText != undefined) ? mText : MediaTypeSizes.fileSizeTxt;

    this.pageAccess = this.apiData['access'];
    console.log(this.pageAccess);
    this.actionIndex = this.apiData['actionIndex'];
    this.uploadFileLength = this.uploadedFiles.length;
  }

  // On Select File Upload
  onUpload(event) {
    this.customError = [];
    this.uploadedFiles = [];
    this.fileLoading = true;
    console.log(this.apiData);
    let i = 1;
    this.uploadFileLength = this.uploadedFiles.length;
    this.filesArr = event;
    let files = event.currentFiles;
    let filesLen = files.length;
    console.log(filesLen)
    for(let file of files) {
      this.currentFile = file;
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
      fileAttachment['selectedLang'] = [];
      fileAttachment['filteredLangItems'] = [];
      fileAttachment['filteredLangList'] = [];
      fileAttachment['fileDuration'] = 0;
      fileAttachment['uploadType'] = 'upload';

      file['language'] = '1';
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

      this.mediaApi.checkMediaName(mediaFormData).subscribe((response) => {
        this.currentMediaId = response.mediaData ? response.mediaData.mediaId : "";
        mediaFlag = (response.status == 'Success') ? true : false;
        flag = mediaFlag;
        let msg = response.result
        if(!mediaFlag) {
          /* this.invalidFileText = msg;
          this.setErrMsg(fname, -1); */
          filesLen = filesLen - 1;
          this.filesArr.currentFiles.splice(fileIndex, 1);
          fileAttachment.splice(fileIndex, 1);
          this.fileLoading = false;
          let mitem = response.mediaData;
          console.log(mitem);
          if (mitem == null) {
            this.invalidFileText = msg;
            this.setErrMsg(fname, -1);
          } else {
            let mindex = this.mediaAttachments.findIndex(option => option == mitem.mediaId);
            console.log(mindex)
            if (mindex < 0) {
              let language = mitem.languageOptions;
              console.log(language);
              let langId = [], langName = [];
              language.forEach(lang => {
                console.log(lang.id);
                langId.push(lang.id);
                langName.push(lang.name);
              });
              mitem.ilteredLangItems = langId;
              mitem.filteredLangList = langName;
              mitem.selectedLang = langName;
              this.gtsAttachmentResponse.items.push(mitem);
              setTimeout(() => {
                let mid = mitem.mediaId.toString();
                this.mediaAttachments.push({fileId: mid.toString()});
                this.updateMediaContent(this.mediaAttachments);
              }, 500);
            }
          }
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
    let fileExtn = file.name.split('.').pop();
    console.log(fileType)
    switch(fileType[0]) {
      case 'image':
        if(!this.attachmentProgress) {
          //this.attachmentProgress = true;
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
          //this.attachmentProgress = true;
        }
        flag = this.validateFileSize(fileType[0], file.size);
        console.log(flag)
        fileAttachment['flagId'] = 2;
        setTimeout(() => {
          let vidSize = this.imageSize;
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
          //this.attachmentProgress = true;
        }
        flag = this.validateFileSize(fileType[0], file.size);
        fileAttachment['flagId'] = 3;
        setTimeout(() => {
          let audSize = this.imageSize;
          if(!flag) {
            this.setErrMsg(file.name, audSize);
          } else {
            this.mediaCompressFlag = true;
            fileAttachment['thumbFilePath'] = 'assets/images/media/audio-thumb.png';
            // Setup Uploaded Files
            this.setupUploadedFiles(fileAttachment, file, filesLen);
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
            this.setupUploadedFiles(fileAttachment, file, filesLen);
          }
        }, 50);
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
        this.fileLoading = false;
        this.attachmentUpload();
      }
    }, 100);
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
    let defaultLanguage = JSON.parse(localStorage.getItem('defaultLanguage'));
    let platformId = localStorage.getItem('platformId');
    let uploadFlag: any = true;
    let gtsData = {
      contentTypeId: this.apiData['contentType'],
      dataId: this.dataId,
      procedureId: this.apiData['procedureId'],
      processId: this.apiData['processId'],
      gtsId: this.apiData['gtsId'],
      apiKey: this.apiData['apiKey'],
      userId: this.apiData['userId'],
      domainId: this.apiData['domainId'],
      contentId: this.dataId,
      platform: platformId,
      uploadFlag: uploadFlag,
      uploadCount: 1,
      language: JSON.stringify(defaultLanguage[0].id),
      workstreamId: this.apiData['workstreamId'],
      uploadByAuthor: this.apiData['uploadByAuthor'],
      userInputId: this.fieldId,
      mediaId: "",
      isVideoCompressed: "0",
      threadId: '',
      directAttachment: "0",
      postStatus: "",
      flagId: this.apiData['flagId'],
      postType: '',
      fileDuration: "0",
      compressionType: "0",
    }
    const modalRef = this.modalService.open(AddLinkComponent, this.config);
    modalRef.componentInstance.access = this.pageAccess;
    modalRef.componentInstance.apiData = gtsData;
    modalRef.componentInstance.mediaServices.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      if(receivedService){
        if (receivedService.status == 'Success') {
          this.processStepsEnableUpdate.emit(receivedService.data.processStepEnabled);
        }
        console.log("receivedService: ", receivedService);
        //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        //msgModalRef.componentInstance.successMessage = receivedService.result;
        this.gtsAttachmentResponse.items = receivedService.data.fileAttachments;
        setTimeout(() => {
          let uploadItems = {
            action: 'submit',
            items: [],
            attachments: [],
            fieldId: this.fieldId,
            userAttachments: this.gtsAttachmentResponse.items,
            mediaId: receivedService.data.mediaId
          };
          console.log(this.gtsAttachmentResponse)
          this.uploadedItems.emit(uploadItems);
          setTimeout(() => {
            this.gtsAttachmentResponse.items = [];
          }, 100);
         // msgModalRef.dismiss('Cross click');
        }, 2000);
      }
    });
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
    this.customError = [];
    let uploadCount = this.uploadedFiles.length;
    console.log(uploadCount);
    console.log("this.uploadedFiles: ", this.uploadedFiles);
    let i = 0;
    for (let u in this.uploadedFiles) {
      this.attachments[u]['access'] = this.apiData['access'];
      this.attachments[u]['apiKey'] = this.apiData['apiKey'];
      this.attachments[u]['domainId'] = this.apiData['domainId'];
      this.attachments[u]['countryId'] = this.apiData['countryId'];
      this.attachments[u]['userId'] = this.apiData['userId'];
      this.attachments[u]['contentType'] = this.apiData['contentType'];
      this.attachments[u]['type'] = this.apiData['type'];
      this.attachments[u]['contentId'] = this.dataId;
      this.attachments[u]['dataId'] = this.dataId;
      this.attachments[u]['displayOrder'] = this.uploadedFiles[u]['displayOrder'];
      this.attachments[u]['uploadCount'] = uploadCount;
      this.attachments[u]['uploadFlag'] = true;
      this.attachments[u]['processFlag'] = false;
      this.attachments[u]['workstreamId'] = this.apiData['workstreamId'];
      this.attachments[u]['uploadByAuthor'] = this.apiData['uploadByAuthor'];
      this.attachments[u]['userInputId'] = this.fieldId;
      this.attachments[u]['mediaId'] = this.currentMediaId;
      this.attachments[u]['flagId'] = this.apiData['flagId'];
      this.attachments[u]['linkUrl'] = this.apiData['linkUrl'];
      this.attachments[u]['isVideoCompressed'] = 0;
      this.attachments[u]['threadId'] = '';
      this.attachments[u]['directAttachment'] = 0;
      this.attachments[u]['postStatus'] = '';
      this.attachments[u]['postType'] = '';
      this.attachments[u]['compressionType'] = 0;
      if(this.pageAccess == 'gtsr') {
        this.attachments[u]['procedureId'] = this.apiData['procedureId'];
        this.attachments[u]['processId'] = this.apiData['processId'];
        this.attachments[u]['gtsId'] = this.apiData['gtsId'];
      }
      let size = this.uploadedFiles[u].size;
      //this.totalSizeToUpload = size;
      this.totalSizeToUpload = this.calculateTotalSize();
      //this.attachments[u]['progress'] = 0;
      console.log(this.attachments[u]);
      this.attachmentProgress = true;
      console.log("this.apiData: ", this.apiData);
      if (!this.attachments[u].cancelFlag) {
        await this.uploadFile(i, u, this.attachments[u], this.uploadedFiles[u], uploadCount);
        i++;
      }
    }
  }

  // Upload File
  uploadFile(index, findex, fileInfo, attachment, uploadCount) {
    console.log("fileInfo: ", fileInfo);
    console.log("attachment: ", attachment);
    console.log("this.pageAccess: ", this.pageAccess);
    console.log("this.apiData: ", this.apiData);
    //let i = parseInt(index)+1;
    let i = parseInt(index) + 1;
    //let uploadLen = this.uploadedFiles.length;
    let uploadLen = uploadCount;
    let totalTemp = 0;
    let fileType = this.attachments[findex]['flagId'];
    //this.totalSizeToUpload -= attachment.size;
    return new Promise<void>((resolve, reject) => {
      this.uploadFlag = this.uploadService.upload(this.pageAccess, fileInfo, attachment).subscribe((event: HttpEvent<any>) => {
          console.log("event: ", event);
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
              this.attachments[findex].mediaId = mediaId;
              this.processStepsEnableUpdate.emit(event.body.data.processStepEnabled);
              let flag = (fileType == 2) ? false : true;
              console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
              console.log(i + '::' + uploadLen);
              this.filesArr.currentFiles.splice(findex, 1);
              this.percentDone = (fileType == 2) ? 99 : 101;
              this.attachments[findex]['progress'] = this.percentDone;
              this.attachments[findex]['uploadStatus'] = 1;
              this.gtsAttachmentResponse.items.push(event.body.data.fileAttachments);
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
  uploadCallback(event) {
    this.uploadedFiles = [];
    this.attachments = [];
    this.attachmentProgress = false;
    this.attachmentView = false;
    this.successMsg = this.apiData['message'];
    //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);    
    //msgModalRef.componentInstance.successMessage = this.successMsg;
    setTimeout(() => {
      let threadAction = this.apiData['threadAction'];
      console.log(threadAction, this.pageAccess);
      switch (this.pageAccess) {
        case 'gtsr':
          //msgModalRef.dismiss('Cross click');
          let uploadItems = {
            action: 'submit',
            items: [],
            attachments: [],
            fieldId: this.fieldId,
            userAttachments: this.gtsAttachmentResponse.items
          };
          console.log(this.gtsAttachmentResponse)
          this.uploadedItems.emit(uploadItems);
          setTimeout(() => {
            this.gtsAttachmentResponse.items = [];
          }, 100);
          break;
      }
      this.successMsg = MediaTypeInfo.UploadingTxt;
    }, 2000);
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
        case 'opportunity':
          existItem = 'opportunityAttachments';
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
          //this.uploadedItems.emit(data);
        }
      });
      mediaItems.forEach(mitem => {
        let mindex = this.attachments.findIndex(option => option.fileId == mitem.mediaId);
        let mId = mitem.mediaId.toString();
        existIndex = -1;
        if (existingMediaItems != null) {
          existIndex = existingMediaItems.findIndex(option => option.fileId == mitem.mediaId);
        }
        console.log(mitem, mindex, existIndex);
        if (mindex < 0 && existIndex < 0) {
          let language = mitem.languageOptions;
          console.log(language);
          let langId = [], langName = [];
          language.forEach(lang => {
            console.log(lang.id);
            langId.push(lang.id);
            langName.push(lang.name);
          });
          mitem.ilteredLangItems = langId;
          mitem.filteredLangList = langName;
          mitem.selectedLang = langName;
          //this.setupMediaUploadFiles(mitem);
          this.gtsAttachmentResponse.items.push(mitem);
          this.mediaAttachments.push({fileId: mId.toString()});
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
        this.updateMediaContent(this.mediaAttachments);
      }, 1500);
    });
  }

  setupMediaUploadFiles(item, atype = '', binaryfile = null) {
    console.log(123, item, this.apiData, this.uploadedFiles);
    if(this.attachments.length == 0) {
      this.fileLoading = true;
    }
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
    fileAttachment['thumbFilePath'] = (atype == 'exists') ? item.thumbFilePath : item.fileImg;
    fileAttachment['fileSize'] = item.fileSize;
    fileAttachment['originalFileName'] = item.originalFileName;
    fileAttachment['originalName'] = item.originalFileName;
    fileAttachment['displayOrder'] = displayOrder;
    fileAttachment['progress'] = 30;
    fileAttachment['fileAction'] = 'file';
    fileAttachment['binaryfile'] = binaryfile;
    fileAttachment['filteredLangItems'] = [];
    fileAttachment['filteredLangList'] = [];
    fileAttachment['selectedLang'] = [];

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
    setTimeout(() => {
      this.gtsAttachmentResponse.items.push(fileAttachment);
    }, 100);
  }

  // Window Close
  windowClose() {
    setTimeout(() => {
      window.close();
    }, 200);
  }

  updateMediaContent(fileInfo) {
    this.fileLoading = true;
    let updatedAttachments = [], deleteMedia = [], mediaCloudAttachments = this.mediaAttachments;
    console.log(updatedAttachments, deleteMedia, mediaCloudAttachments);
    let mediaFormData = new FormData();
    let defaultLanguage = JSON.parse(localStorage.getItem('defaultLanguage'));
    let platformId = localStorage.getItem('platformId');
    let uploadFlag: any = true;
    mediaFormData.append('apiKey', this.apiData['apiKey']);
    mediaFormData.append('userId', this.apiData['userId']);
    mediaFormData.append('domainId', this.apiData['domainId']);
    mediaFormData.append('dataId', this.dataId);
    mediaFormData.append('procedureId', this.apiData['procedureId']);
    mediaFormData.append('processId', this.apiData['processId']);
    mediaFormData.append('gtsId', this.apiData['gtsId']);
    mediaFormData.append('contentTypeId', this.apiData['contentType']);
    mediaFormData.append('contentId', this.dataId);
    mediaFormData.append('platform', platformId);
    mediaFormData.append('uploadFlag', uploadFlag);
    mediaFormData.append('displayOrder', this.currentFile.displayOrder);
    mediaFormData.append('type', this.currentFile.type);
    mediaFormData.append('caption',  this.currentFile.name);
    mediaFormData.append('mediaCloudAttachments', JSON.stringify(mediaCloudAttachments));
    mediaFormData.append('updatedAttachments', JSON.stringify(updatedAttachments));
    mediaFormData.append('deleteMedia', JSON.stringify(deleteMedia));
    mediaFormData.append('uploadCount', this.mediaAttachments.length);
    mediaFormData.append('language', JSON.stringify(defaultLanguage[0].id));
    mediaFormData.append('workstreamId', this.apiData['workstreamId']);
    mediaFormData.append('uploadByAuthor', this.apiData['uploadByAuthor']);
    mediaFormData.append('userInputId', this.fieldId);
    mediaFormData.append('linkUrl', this.apiData['linkUrl']);
    mediaFormData.append('mediaId', this.currentMediaId);
    mediaFormData.append('isVideoCompressed', "0");
    mediaFormData.append('threadId', '');
    mediaFormData.append('directAttachment', "0");
    mediaFormData.append('postStatus', "");
    mediaFormData.append('flagId', this.apiData['flagId']);
    mediaFormData.append('postType', '');
    mediaFormData.append('fileDuration', "0");
    mediaFormData.append('compressionType', "0");
    mediaFormData.append('countryId', this.apiData['countryId']);
    this.mediaApi.updateMediaContent(mediaFormData).subscribe((response) => {
      if (response.status == 'Success') {
        this.processStepsEnableUpdate.emit(response.processStepEnabled);
      }
      if(this.attachments.length == 0) {
        this.fileLoading = false;
        //const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        //msgModalRef.componentInstance.successMessage = response.result;
        setTimeout(() => {
          let uploadItems = {
            action: 'submit',
            items: [],
            attachments: [],
            fieldId: this.fieldId,
            userAttachments: this.gtsAttachmentResponse.items
          };
          console.log(this.gtsAttachmentResponse)
          this.uploadedItems.emit(uploadItems);
          setTimeout(() => {
            this.mediaAttachments = [];
            this.gtsAttachmentResponse.items = [];
          }, 100);
          //msgModalRef.dismiss('Cross click');
        }, 2000);
      }
    })
  }

}
