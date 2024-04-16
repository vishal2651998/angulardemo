import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../../../image-cropper/interfaces/index';
import { base64ToFile } from '../../../image-cropper/utils/blob.utils';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ApiService } from '../../../services/api/api.service';
import { Constant } from '../../../common/constant/constant';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BaseService } from 'src/app/modules/base/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, OnDestroy {

  @Input() userId;
  @Input() domainId;
  @Input() type;
  @Input() fromPage;
  @Input() profileType = "";
  @Input() id;
  @Input() bannerOption = "0";
  @Output() updateImgResponce: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass:string = "auth";
  public bodyClass1:string = "profile-certificate";
  public bodyClass2:string = "image-cropper";
  public bodyClass3:string = "profile";
  public title: string = "";
  public footerElem;
  public bodyHeight: number;
  public innerHeight: number;
  public fileSize: number = 2000;
  public currentfileSize: number = 0;
  public uploadReady: boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageNew: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  public fileName: any = '';
  public invalidFileErr: string = '';
  public errorMsg = "Please upload file size below 2MB";
  public invalidFile: boolean = false;
  public loading: boolean = false;
  public selectImgError: boolean = true;
  public selectImgErrorMsg:string = 'Not Supported';
  public cropImgLoad: boolean = false;
  public dekraNetworkId: string = '';

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }


  constructor(
    private authenticationService: AuthenticationService,
    private apiUrl: ApiService,
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal,
    private imageCompress: NgxImageCompressService,
    private baseSerivce: BaseService,
    private router: Router,
    ) { }

  ngOnInit(): void {

    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);

    this.selectImgError = false;
    this.selectImgErrorMsg = '';

    if(this.profileType == '' || this.profileType == 'user-profile'){
      this.title = "profile picture";
    } else {
      switch(this.profileType) {
        case 'headquarter-image':
          this.title = "HQ Grapic";
          break;
        case 'categoryLogo':
          this.title = "Update Graphic";
          break;
        case 'ka-banner':
          this.title = "Knowledge Article Banner";
          break;
        case 'banner-image':
          this.title = "Company Banner";
          break;
        case 'banner-image-second':
        case 'landing-header-banner':
        case 'document-banner':
        case 'adas-procedure-banner':    
          this.title = "Banner Image";
          break;
        case 'login-bg':
          this.title = "Login Page BG";
          break;
        case 'add-shop':
          this.title = "Shop Logo/Image"
        case 'add-banner':
          this.title = "Banner Image"
        case 'add-tools':
          this.title = "Tools Image"
        case 'add-gts-procedure':
          this.title = "GTS Banner"
        case 'add-template':
          this.title = "Template"
        case 'add-inspection':
          this.title = "Audit/Inspection"  
        default:
          this.title = "logo";
          break;  
      }
    }
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
  }

  // Set Screen Height
  setScreenHeight() {
    this.innerHeight = (this.bodyHeight - 130 );
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    let selectFile = event.target.files[0];
    let name = selectFile.name.split('.');
    this.fileName = name[0]+".png";
    console.log(this.fileName);
    console.log(selectFile.size);
    this.currentfileSize = Math.round((selectFile.size / 1024));
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.croppedImageNew = event;
      console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.invalidFile = false;
    this.invalidFileErr = "";
    if(this.currentfileSize > this.fileSize){
      this.loading = false;
      this.invalidFile = true;
      this.invalidFileErr = this.errorMsg;
      this.cropImgLoad = false;
    }
    else{
      this.showCropper = true;
      this.cropImgLoad = true;
      this.selectImgError = false;
      this.selectImgErrorMsg = '';
    }
  }

  cropperReady(sourceImageDimensions: Dimensions) {
      console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
      console.log('Load failed');
      this.showCropper = false;
      this.cropImgLoad = false;
      this.loading = false;
      this.invalidFile = true;
      this.selectImgError = true;
      this.selectImgErrorMsg = 'Not Supported';
  }

  rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
  }

  rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
  }

  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }


  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }

  flipVertical() {
      this.transform = {
          ...this.transform,
          flipV: !this.transform.flipV
      };
  }

  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
  }

  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
      this.transform = {
          ...this.transform,
          rotate: this.rotation
      };
  }


  uploadFile(){
    this.loading = true;
    const block = this.croppedImage.split(";");
    const contentType = block[0].split(":")[1];
    const realData = block[1].split(",")[1];
    const blob = this.b64toBlob(realData, contentType);
    const imageFile = new File([blob], this.fileName, {type: contentType});
    console.log(imageFile);
    if(this.fromPage == "chat-page")
    {
      this.updateImgResponce.emit(imageFile);
    }else{
      this.OnUploadFile(imageFile);
    }
  }

  uploadFileNew(){
    this.uploadReady = true;
    this.loading = true;
    if(this.currentfileSize < 600 ){
      console.log("not compressing..");
      setTimeout(() => {
        this.notCompressFile();
      }, 1);
    }
    else{
      setTimeout(() => {
        console.log("compressing..")
        this.compressFile(this.croppedImage,this.croppedImage);
      }, 1);
    }
  }

  // no need Compress Image
  notCompressFile(){
    const block = this.croppedImage.split(";");
    const contentType = block[0].split(":")[1];
    const realData = block[1].split(",")[1];
    const blob = this.b64toBlob(realData, contentType);
    const imageFile = new File([blob], this.fileName, {type: contentType});
    console.log(imageFile);
    if(this.fromPage == "chat-page")
    {
      this.updateImgResponce.emit(imageFile);
    }else{
      this.OnUploadFile(imageFile);
    }
  }


  // Compress Image
  compressFile(file, image) {
    let orientation = -1;
    let originalImageSize = this.imageCompress.byteCount(image);
    console.warn('Size in bytes is now:', originalImageSize);
    this.imageCompress.compressFile(image, orientation, 75, 50).then(result => {
      console.log(result);
      let imgResultAfterCompress = result;
      let sizeOFCompressedImage = this.imageCompress.byteCount(result);
      console.warn('Size in bytes after compression:', sizeOFCompressedImage);
      this.currentfileSize = sizeOFCompressedImage;
      // call method that creates a blob from dataUri
      let compressImg = imgResultAfterCompress.split(',');
      console.log(compressImg);
      const imageBlob = this.dataURItoBlob(compressImg);
      console.log(imageBlob);
      const block = this.croppedImage.split(";");
      const fileType = block[0].split(":")[1];
      setTimeout(() => {
        const imageFile = new File([imageBlob], this.fileName, {type: fileType});
        if(this.fromPage == "chat-page")
        {
          this.updateImgResponce.emit(imageFile);
        }else{
          this.OnUploadFile(imageFile);
        }
      }, 500);
    });
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


  b64toBlob(realData, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(realData);
    var byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays);

    return blob;
  }

  OnUploadFile(imageFile) {
    let countryId = localStorage.getItem('countryId') == null || localStorage.getItem('countryId') == undefined ? '' : localStorage.getItem('countryId');
    console.log(imageFile);
    if(this.profileType == 'ka-banner') {
      this.uploadReady = false;
        this.loading = false;
        var imgData = {
          'show':this.croppedImage,
          'response': imageFile
        }
        this.updateImgResponce.emit(imgData);
    } else {
      const formData = new FormData();
      formData.append('file', imageFile);
      if(this.profileType == "add-banner" || this.profileType == 'user-profile'){
        formData.append('userId', this.userId );
      }
      else{
        formData.append('user_id', this.userId );
      }     
      formData.append('domainId', this.domainId );
      formData.append('countryId', countryId );

      switch (this.profileType) {
        case 'businessProfile':
          formData.append('businessProfile', '1');
          break;
        case 'mfgLogo':
          formData.append('businessProfile', '2');
          formData.append('id', this.id);
          break;
        case 'makeLogo':
          formData.append('businessProfile', '3');
          formData.append('id', this.id);
          break;
        case 'categoryLogo':
          formData.append('businessProfile', '4');
          formData.append('id', this.id);
          break;
        case 'reportLogo':
          formData.append('businessProfile', '5');
          formData.append('id', this.id);
          break;
        case 'document-banner':
        case 'folderLogo':
          formData.append('businessProfile', '6');
          formData.append('id', this.id);
          break;
        case 'banner-image':
        case 'banner-image-second':
          formData.append('businessProfile', '7');
          formData.append('id', this.id);
          break;
        case 'banner-image-manual':
          formData.append('businessProfile', '8');
          formData.append('id', '');
          break;
        case 'landing-header-banner':
          formData.append('businessProfile', '9');
          formData.append('id', this.id);
          break;
        case 'login-bg':
          formData.append('businessProfile', '10');
          formData.append('bannerOption', this.bannerOption);
          break;
        case 'adas-procedure-banner':
          formData.append('businessProfile', '11');
          formData.append('id', this.id);
          break;  
        case 'headquarter-image':
          formData.append('businessProfile', '12');
          formData.append('id', this.id);
          break;
        case 'add-shop':
          formData.append('businessProfile', '14');
          formData.append('id', this.id);
          break;       
        case 'add-gts-procedure':
          formData.append('businessProfile', '16');
          formData.append('id', this.id);
          break;
        case 'add-template':
          formData.append('businessProfile', '17');
          formData.append('id', this.id);
          break;
        case 'add-inspection':
          formData.append('businessProfile', '18');
          formData.append('id', this.id);
          break;
        case 'add-tools':
          formData.append('businessProfile', '15');
          formData.append('id', this.id);
          break;
        case 'level-image':
          formData.append('businessProfile', '13');
          formData.append('id', this.id);
          break;
        case 'add-banner':
          formData.append('businessProfile', '20');
          formData.append('id', this.id);
          formData.append("networkId",this.dekraNetworkId);
          formData.append("bannerId",this.id);
          break;
        case 'user-profile':
          formData.append('businessProfile', '21');
          formData.append("networkId",this.dekraNetworkId);
          break;
      }

      let serverUrl = this.apiUrl.apifileUpload();
      if(this.profileType == "add-banner" || this.profileType == 'user-profile'){
        serverUrl = `${Constant.DekraApiUrl}accounts/profilephoto`
      }
      this.httpClient.post<any>(serverUrl, formData)
      .subscribe(res => {
        console.log(res);
        this.invalidFile = false;
        this.invalidFileErr = "";
        if(res.status=='Success'){
          this.uploadReady = false;
          this.loading = false;
          var imgData = {
            'show':this.croppedImage,
            'response':res.data,
            'successmsg':res.result
          }
          this.updateImgResponce.emit(imgData);
        }
        else{
          this.uploadReady = false;
          this.showCropper = false;
          this.cropImgLoad = false;
          this.loading = false;
          this.invalidFile = true;
          this.invalidFileErr = res.data;
        }
        console.log(res);
      },
      (error => {
        this.uploadReady = false;
        this.showCropper = false;
        this.cropImgLoad = false;
        this.loading = false;
        this.invalidFile = true;
        this.invalidFileErr = error;
      })
      );
    }
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove(this.bodyClass2);
    this.bodyElem.classList.remove(this.bodyClass);
    let urlVal = this.router.url;
    if(urlVal == '/headquarters/network'){
      this.bodyElem.classList.remove(this.bodyClass);
      this.bodyElem.classList.remove(this.bodyClass3);
    }

  }



}
