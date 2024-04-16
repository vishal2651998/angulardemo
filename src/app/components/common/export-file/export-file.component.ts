import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { Constant, RedirectionPage, PageTitleText } from "src/app/common/constant/constant";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CommonService } from "src/app/services/common/common.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { UploadService } from 'src/app/services/upload/upload.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-export-file',
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.scss']
})
export class ExportFileComponent implements OnInit {

  @Input() userId; 
  @Input() domainId;
  @Output() updateImgResponce: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public title: string = "";
  public footerElem;
  public bodyHeight: number; 
  public innerHeight: number;
  public fileSize: number = 2000;
  public currentfileSize: number = 0;

  filesArr: any;
  uploadedFiles: any[] = [];
  attachments: any[] = [];
  public attachmentProgress: boolean = false;
  public uploadTxt: string = "Uploading dealer escalation changes..<br/>This may take a few minutes..";
  public uploadValidateTxt: string = "Validating Escalation Import...";
  public successMsg: string = this.uploadTxt;
  public successFlag: boolean = false;
  public closeDialog: boolean = false;
  public uploadFlag: any = null;
  public loadedSoFar = 0;
  public progress = 0;
  public percentDone = 0;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public errModalConfig: any = {backdrop: 'static', keyboard: true, centered: true};

  public countryId;
  public apiKey: string = Constant.ApiKey;

  public apiData: Object;
  public pageAccess: string = "escalation-export";

  public opacityFlag: boolean = false;
  public showUpload: boolean = false;
  public showCancel: boolean = false;
  public chooseLable: string = "Upload File (xls)";
  public chooseIcon: string = "";
  public process: boolean = false;
  public uploadProcess: boolean = false;

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) { }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.title = "Import";


    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

  }

  // Set Screen Height
  setScreenHeight() {    
    this.innerHeight = (this.bodyHeight - 330 );  
  }

  onUpload(event) {
    this.filesArr = event;
    console.log(event)
    let uploadFlag = (event.currentFiles.length > 0) ? true : false;
    if(uploadFlag) {
      let file = event.currentFiles[0];
      let fileExtn = file.name.split('.');
      this.successMsg = "Uploading dealer escalation changes..<br/>This may take a few minutes..";
      this.successMsg = this.uploadValidateTxt;
      this.process = true;
      this.uploadProcess = true;
      //this.attachmentProgress = true;
      let apiData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        action: 'upload',        
      };
      let totalTemp = 0;
      return new Promise<void>((resolve, reject) => {
        this.uploadService.upload(this.pageAccess, apiData, file).subscribe((event: HttpEvent<any>) => {
          console.log(event);
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              let progress = Math.round(100 * event.loaded / event.total);
              this.progress = progress;
              console.log(`Uploaded! ${this.progress}%`);
              break;
            case HttpEventType.Response:
              totalTemp = this.loadedSoFar;
              this.percentDone = 100;
              this.progress = this.percentDone;
              console.log(`Uploaded So Far! ${this.loadedSoFar}%`);
              let resBody = event.body;
              resolve();
              let status = resBody.status;
              let resData = resBody.data;
              let timeout = (status == 'Failure') ? 0 : 100;
              setTimeout(() => {
                //this.attachmentProgress = false;
                this.progress = 0;
                this.attachments = [];
                this.successMsg = resBody.result;
                if(status == "Failure") {  
                  this.process = false;                    
                  this.updateImgResponce.emit(false);                                         
                } else {
                  this.successMsg = resBody.result;
                  setTimeout(() => {     
                    this.process = false;                  
                    this.updateImgResponce.emit(resBody); 
                  }, 3000);                  
                }
              }, timeout);
              break;
          }
        },
        err => {
          this.attachments = [];
          this.attachmentProgress = false;
          this.progress = 0;      
        });
      })
    } else {
      this.uploadProcess = true; 
      this.successMsg = "Invalid File Format";      
    }
  }
}
