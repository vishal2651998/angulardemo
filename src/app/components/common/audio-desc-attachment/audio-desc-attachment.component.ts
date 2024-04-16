import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-desc-attachment',
  templateUrl: './audio-desc-attachment.component.html',
  styleUrls: ['./audio-desc-attachment.component.scss']
})
export class AudioDescAttachmentComponent implements OnInit {

  @Input() audioAttachmentItems: any = [];
  @Input() action: string;
  @Output() audioAttachments: EventEmitter<any> = new EventEmitter();

  public units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  public audioUploadedFile: any[] = [];
  public chooseLable: string = "From PC";
  public invalidFile: boolean = false;
  public invalidFileErr: string = "";
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public filesArr: any;
  public uploadedFiles: any[] = [];
  public audioAttachment: any[] = [];
  public customError: any = [];
  public attachFlag: boolean = true;
  public attachmentView: boolean = false;

  constructor(
    private commonApi: CommonService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    console.log(this.audioAttachmentItems, this.action)
    this.attachFlag = (this.audioAttachmentItems.length > 0) ? false : this.attachFlag;
  }

  // On Select File Upload 
  onUpload(event) {
    this.customError = [];
    this.uploadedFiles = (this.uploadedFiles == undefined) ? [] : this.uploadedFiles;
    let i = 0;
    this.attachmentView = false;
    this.filesArr = event;
    console.log(event)
    let files = event.target.files;
    let fileLen = files.length;
    for(let file of files) {
      console.log(file);
      let flag = true;
      let fileType = file.type.split('/');
      let fileExtn = file.name.split('.').pop();
      let fileAttachment = [];
      let fname = file.name;  
      let displayOrder = 1;
      let lastDot = fname.lastIndexOf('.');
      let fileName = fname.substring(0, lastDot);
      let fileIndex = i+1;
      fileAttachment['audioDesc'] = true;
      fileAttachment['audioCaption'] = 'Audio Description';
      fileAttachment['originalfileArray'] = file;
      fileAttachment['fileId'] = 0;
      fileAttachment['accessType'] = 'upload';
      fileAttachment['accessTypeText'] = 'From PC';
      fileAttachment['fileType'] = file.type;
      fileAttachment['fileSize'] = file.size;
      fileAttachment['originalName'] = file.name;
      fileAttachment['originalFileName'] = file.name;
      fileAttachment['fileCaption'] = '';
      fileAttachment['captionFlag'] = false;
      fileAttachment['action'] = "new";
      fileAttachment['cancelFlag'] = false;
      fileAttachment['valid'] = true;
      fileAttachment['language'] = "1";
      fileAttachment['itemValues'] = [];
      fileAttachment['selectedLang'] = [];
      fileAttachment['filteredLangItems'] = [];
      fileAttachment['filteredLangList'] = [];
      fileAttachment['progress'] = 0;
      fileAttachment['uploadType'] = 'audio';
      file['language'] = "1";
      file['fileCaption'] = fileName;
      file['captionFlag'] = false;
      this.initFileUpload(file, fileIndex, fileLen, fileAttachment, i);
    }    
  }

  // Init Media File Upload
  initFileUpload(file, fileIndex, fileLen, fileAttachment, itemIndex) {
    let flag = true;
    let fileType = file.type.split('/');
    let fileExtn = file.name.split('.').pop();
    switch(fileType[0]) {
      case 'audio':
        fileAttachment['flagId'] = 7;
        fileAttachment['fileDuration'] = 0;
        new Audio(URL.createObjectURL(file)).onloadedmetadata = (e:any) =>{
          let autioDuration:any = e.currentTarget.duration;
          fileAttachment['fileDuration'] = `${autioDuration.toFixed(0)}`;
        }
        
        this.readFile(file).then(fileContents => {
          // Put this string in a request body to upload it to an API.
          let audioUrl:any = fileContents;
          fileAttachment['audioFilePath'] = this.sanitizer.bypassSecurityTrustResourceUrl(audioUrl);
        });
        // Setup Uploaded Files
        setTimeout(() => { this.setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex);  }, 50);          
        break;
    }
  }

  // Setup Uploaded Files
  setupUploadedFiles(fileAttachment, file, fileIndex, fileLen, itemIndex = -1) {
    fileAttachment['fileSize'] = this.commonApi.niceBytes(fileAttachment['fileSize']);      
    this.uploadedFiles.push(file);
    console.log(this.uploadedFiles);
    fileAttachment['filePath'] = file['thumbFilePath'];
    fileAttachment['audioFilePath'] = fileAttachment['audioFilePath'];
    fileAttachment['uploadStatus'] = 0;
    this.audioAttachment.push(fileAttachment);
    let viewFlag = true;
    if(viewFlag) {
      setTimeout(() => {
        this.attachmentView = viewFlag;
        this.attachFlag = !viewFlag;
      }, 50);
    }
    let uploadItems = {
      items: this.uploadedFiles,
      audioAttachmentItems: this.audioAttachment
    };
    this.audioAttachments.emit(uploadItems);
  }

  public async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        console.log(e)
        let src:any = (e.target as FileReader).result;
        return resolve(src);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }

  // Attachment Action
  attachmentAction(data) {
    console.log(data)
    this.attachmentView = false;
    this.attachFlag = true;
    let access = data.action;
    let i = data.index;
    this.filesArr = [];
    this.uploadedFiles = [];
    this.audioAttachment = [];
    let uploadItems = {
      items: this.uploadedFiles,
      attachments: this.audioAttachment,
    };
    this.audioAttachments.emit(uploadItems);
  }
}
