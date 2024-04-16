import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { MediaManagerService } from '../../../services/media-manager/media-manager.service';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PartsService } from '../../../services/parts/parts.service';
import * as moment from 'moment';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { Title } from '@angular/platform-browser';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { AddLinkComponent } from '../../../components/common/add-link/add-link.component';
import { windowHeight } from 'src/app/common/constant/constant';
declare var lightGallery: any;

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {

  @Input() mediaInfo: any;
  @Output() toggleAction: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  public title:string = 'Media Info';
  public bodyElem;
  public bodyClass: string = "submit-loader";
  public mediaId: number;
  public infoLoading: boolean = true;
  public mediaInfoFlag: boolean = true;
  public mediaRelatedFlag: boolean = false;
  public deleteFlag: boolean = false;
  public actionFlag: boolean = false;
  public splitIcon: boolean = true;
  public apiData: object;

  public mediaForm: FormGroup;
  public modelLoading: boolean = false;
  public mediaSubmitted: boolean = false;
  public makeInputFilter: FormControl = new FormControl();
 
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public maxLen: number = 100;

  public flagId: number;
  public filePath: string = "";
  public fileSrc: string = "";
  public videoID: string = "";
  public vimeoId: string = "";
  public fileType: string = "";
  public mediaImg: string = "";
  public fullCaption: string = "";
  public caption: string = "";
  public viewCaption: string = "";
  public link: string = '';
  public linkClass: string = "default";
  //public description: string = "";
  public linkUrl: string = "";
  public linkType: string = "";
  public linkWithTxt: string = "Linked with";
  public contentTypes: any = [];
  public uploadedBy: string = "";
  public uploadedOn: string = "";
  public modifiedBy: string = "";
  public modifiedOn: string = "";
  public pinStatus: number = 0;
  public pinCount: number = 0;
  public viewCount: number = 0;
  public pinCountVal;
  public viewCountVal;

  public makes: any = [];
  public modelValue = '';
  public filteredMakes = [];
  public models: any = [];
  public filteredModels = [];
  public defaultModels = {id: 'All', name: 'All'};
  public years = [];
  public filteredYears = [];
  public tags: any;
  public filteredTags = [];

  //public userI
  public makeVal: string = "";
  public modelId: number;
  public yearId: number;
  public tagId: number;

  public apiFormData: object;
  public threadType: number = 25;
  public tagItems: any;
  public filteredTagIds = [];

  public make: any;
  public filteredData = {};
  public getFilteredValues;

  public bodyHeight: number;
  public innerHeight: number;
  public innerMediaHeight: number;
  public modelWidget: boolean = false;
  public saveMediaFlag: boolean = false;
  public sameDateFlag: boolean = false;

  public uploadedUserImg: string;
  public modifiedUserImg: string;
  public editMakeVal: string;
  public editModelVal = [];
  public editYearVal = [];
  public editTagVal = [];
  public submitMediaLoading = false;

  public pinLoading: boolean = false;
  public pinImg: string;  
  public disableEditIcon: boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public textAreaDisabled: boolean = false;
  public bottomBtnFixed: boolean = false;

  public heightCheck: boolean = false;
  public buttonVisible: boolean = false;
  public copiedModal: boolean = false;
  constructor(
    private titleService: Title,
    private commonApi: CommonService,
    private mediaApi: MediaManagerService,
    private formBuilder: FormBuilder,
    private ProductMatrixApi: ProductMatrixService,
    private partsApi: PartsService,
    private modalService: NgbModal,
    private config: NgbModalConfig
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  // convenience getters for easy access to form fields
  get f() { return this.mediaForm.controls; }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    let mediaInfo = this.mediaInfo;
    let apiData = {
      apiKey: mediaInfo.apiKey,
      domainId: mediaInfo.domainId,
      countryId: mediaInfo.countryId,
      userId: mediaInfo.userId,
      accessType: mediaInfo.accessType,
      mediaId: mediaInfo.mediaId
    }
    console.log(mediaInfo)

    // Setup Media Data
    if(mediaInfo.exists) {
      this.infoLoading = false;
      this.setupMediaInfo(mediaInfo.mediaData);
    }

    // Get Media Info
    if(mediaInfo.mediaId > 0 && !mediaInfo.exists) {
      this.getMediaInfo(apiData);
    }
  }

  // Get Media Info
  getMediaInfo(apiData) {
    this.submitMediaLoading = false;
    this.mediaApi.getMediaDetail(apiData).subscribe((response) => {
      let result = response.mediaArr[0];
      let data = {
        access: 'detail',
        action: false,
        mediaId: this.mediaInfo.mediaId,
        mediaData: result
      };
      this.toggleAction.emit(data);
      this.setupMediaInfo(result);
    });
  }

  // Setup Media Info
  setupMediaInfo(result) {
    this.flagId = result.flagId;
    this.filePath = result.filePath;
    //this.description = (result.content.length>0) ? result.content : '';    
    this.mediaId = result.mediaId;
    this.mediaImg = (this.flagId == 1) ? result.thumbFilePath : result.posterImage;
    result.fileCaption = (result.fileCaption == undefined || result.fileCaption == 'undefined') ? '' : result.fileCaption
    let caption = result.fileCaption.split('.');
    let captionSplit = (caption.length > 1) ? caption[0] : result.fileCaption;
    let captionTruncate = captionSplit.substring(0, 15) + '..';
    this.caption = result.fileCaption;
    this.viewCaption = result.fileCaption;
    this.deleteFlag = result.deleteMode;

    switch (this.flagId) {
      case 1:
        if(caption.length > 1) {
          captionTruncate = (captionSplit.length > 15) ? captionTruncate+'.'+result.fileExtension : captionSplit;
        } else {
          captionTruncate = (captionSplit.length > 15) ? captionTruncate : captionSplit;
        }
        break;
      case 2:
        if(caption.length > 1) {
          captionTruncate = (captionSplit.length > 15) ? captionTruncate+'.mp4' : captionSplit;
        } else {
          captionTruncate = (captionSplit.length > 15) ? captionTruncate : captionSplit;
        }
        break;
      case 3:
        if(caption.length > 1) {
          captionTruncate = (captionSplit.length > 15) ? captionTruncate+'.mp3' : captionSplit;
        } else {
          captionTruncate = (captionSplit.length > 15) ? captionTruncate : captionSplit;
        }
        break;
      case 6:   
        this.textAreaDisabled = true;
        let prefix = 'https://';
        let logoImg = result.thumbFilePath;
        let logo = (logoImg == "") ? 'assets/images/media/link-thumb.png' : logoImg;
        this.mediaImg = "";
        this.linkType = 'link';
        this.linkClass = (logoImg == "") ? 'default' : 'logo';
        let url = result.filePath;
        //let url = 'https://vimeo.com/347119375';
        if(url.indexOf("http://") != 0) {
          if(url.indexOf("https://") != 0) {
            url = prefix + url;
          } 
        }
        this.linkUrl = `<p><a href="${url}" target="_blank">${url}</a></p>`;
        result.link = url;
        this.link = url;
        result.linkCaption = (result.fileCaption == '') ? url : result.fileCaption;
        this.viewCaption = (result.fileCaption == '') ? url : result.fileCaption;
        let youtube = this.commonApi.matchYoutubeUrl(url);
        if(youtube) {
          this.linkClass = "default";
          this.fileSrc = result.filePath;
          this.videoID = youtube;
          this.mediaImg = '//img.youtube.com/vi/'+youtube+'/0.jpg';
          this.linkType = 'youtube';  
          if(this.linkType == 'youtube'){
            setTimeout(() => {
              document.getElementById("myframe").setAttribute("src", "//www.youtube.com/embed/"+this.videoID);
            }, 600);
          }     
        } else {
          let vimeo = this.commonApi.matchVimeoUrl(url);
          //this.vimeoId = `https://player.vimeo.com/video/${vimeo}`;
          this.vimeoId = vimeo;           
          if(vimeo) {
            this.linkClass = "default";
            this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
              let res = response[0];
              let thumb = res['thumbnail_medium'];
              this.mediaImg = thumb;                
            });
            this.linkType = 'video';
            setTimeout(() => {              
              document.getElementById("myframe").setAttribute("src", "https://player.vimeo.com/video/"+this.vimeoId);
            }, 600);
          } else {
            result.galleryCaption = (result.fileCaption != '') ? `<p><a href="${url}" target="_blank">${url}</a></p>` : result.galleryCaption;
            this.mediaImg = logo;
          }             
        }
        this.mediaImg = logo;        
        break;
    }
    
    if(this.flagId > 1 && this.flagId < 4) {
      let ext = (this.flagId == 2) ? 'mp4' : 'mp3';
      let src = this.filePath.split(ext);
      this.fileSrc = src[0];
    }

    this.contentTypes = result.contentTypes;
    for(let ct of this.contentTypes) {
      ct.flag = (ct.count == 1) ? true : false;
      if(ct.count == 1) {
        this.mediaRelatedFlag = true;
      }
    }
    
    /*let createdDate = moment.utc(result.createdOn).toDate(); 
    let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
    let updatedDate = moment.utc(result.updatedOn).toDate(); 
    let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');

    var a = moment(createdDate,'M/D/YYYY');
    var b = moment(updatedDate,'M/D/YYYY');
    var diffDays = b.diff(a, 'days');

    console.log(diffDays);

    if(diffDays != 0){
      this.sameDateFlag = true;
    }*/    

    let localCreatedDate = '';
    let localUpdatedDate = '';
    let createdDate;
    let updatedDate;
    let checkDate1;
    let checkDate2;

    if(moment(result.createdOn, 'MMM DD, YYYY h:mm A').format('MMM DD, YYYY h:mm A') === result.createdOn){      
      localCreatedDate = result.createdOn;                
    }
    else{
      createdDate = moment.utc(result.createdOn).toDate(); 
      localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
    }
    if(moment(result.updatedOn, 'MMM DD, YYYY h:mm A').format('MMM DD, YYYY h:mm A') === result.updatedOn){ 
      localUpdatedDate = result.updatedOn;    
    }
    else{      
      updatedDate = moment.utc(result.updatedOn).toDate(); 
      localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
    }

    checkDate1 = moment(result.createdOn).local().format('M/D/YYYY');
    checkDate2 = moment(result.updatedOn).local().format('M/D/YYYY');
    var a = moment(checkDate1,'M/D/YYYY');
    var b = moment(checkDate2,'M/D/YYYY');
    var diffDays = b.diff(a, 'days');  

    console.log(checkDate1);
    console.log(diffDays);
    console.log(checkDate2);

    if(diffDays != 0){
      this.sameDateFlag = true;
    } 

    this.uploadedOn = (result.createdOn == "") ? '-' : localCreatedDate;
    this.modifiedOn = (result.updatedOn == "") ? '-' : localUpdatedDate;
    this.uploadedBy = (result.createdBy == "") ? '-' : result.createdBy;
    this.modifiedBy = (result.modifiedBy == "") ? '-' : result.updatedBy;        

    this.uploadedUserImg = (result.createdByProfileImg != '') ? result.createdByProfileImg  : 'assets/images/media/manager/media-user.png';
    this.modifiedUserImg = (result.updatedByProfileImg != '') ? result.updatedByProfileImg  : 'assets/images/media/manager/media-user.png';     
   
    let uploadUserId = result.createdById;
    let mediaInfo = this.mediaInfo;  
    let userId = mediaInfo.userId;
   
    this.disableEditIcon = result.editMode;
    let vehicleInfo = result.vehicleInfo;
    this.getFilteredValues = (vehicleInfo != '') ? JSON.parse(vehicleInfo) : '';

    this.filteredData['make'] = [];        
    this.make = "";
    this.editMakeVal = "";
    if(this.getFilteredValues.length>0) {
      this.filteredData['make'] = this.getFilteredValues[0].genericProductName;          
      if(this.filteredData['make'].length > 0) {
        this.make = this.filteredData['make'];           
        this.getModels(this.make);  
      }
      this.editMakeVal = this.make;           
    }               
    
    this.filteredData['model'] = [];    
    this.filteredModels = [];

    if(this.getFilteredValues.length>0) {
      let model = this.getFilteredValues[0].model;
      this.filteredData['model'] = (model == "" || model.length < 1) ? [] : model;
    }
    
    if(this.filteredData['model'].length > 0) {
      for(let m of this.filteredData['model']) {
        this.filteredModels.push(m);    
      }
      this.editModelVal = this.filteredModels;
    }

    this.filteredData['year'] = [];      
    this.filteredYears = [];
    //this.editYearVal = [];

    this.years = []
    let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString()
      });
    }
    
    if(this.getFilteredValues.length>0) {
      this.filteredData['year'] = this.getFilteredValues[0].year.items == undefined ? '' : this.getFilteredValues[0].year.items;
      this.filteredYears = this.filteredData['year'];
      this.editYearVal = this.filteredYears;
    }

    console.log(this.editYearVal);
    console.log(this.filteredYears);

    this.filteredTagIds = [];
    this.filteredTags = [];
    this.editTagVal = [];

    this.tagItems = result.tagsList;
    this.filteredTagIds = (this.tagItems != "") ? JSON.parse(this.tagItems) : this.tagItems;
    this.filteredTags = result.tagsNames;
    console.log(this.filteredTagIds);
    console.log(this.filteredTags);
    this.editTagVal = result.tagsNames;
  
    this.pinStatus = result.pinStatus;     
    this.pinCount = result.pinCount;
    this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
    this.viewCount = result.viewCount;
    this.viewCountVal = this.viewCount == 0 ? '-' : this.viewCount;
    this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';      
    this.saveMediaFlag = true;

    setTimeout(() => {
      this.initLightGallery();
      this.getProdTypes();
      this.setScreenHeight();    
      this.infoLoading = false;
    }, 500);
    
    this.mediaForm = this.formBuilder.group({
      link: [this.link, []],
      caption: [this.caption, []],
      //description: [this.description, [Validators.required]]
    });
  }

  // Get Mate List
  getProdTypes(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.mediaInfo.apiKey);
    apiFormData.append('domainId', this.mediaInfo.domainId);
    apiFormData.append('countryId', this.mediaInfo.countryId);
    apiFormData.append('userId', this.mediaInfo.userId);

    this.ProductMatrixApi.fetchProductMakeLists(apiFormData).subscribe((response) => {
      if(response.status == "Success") {
        let resultData = response.modelData;
        this.makes = [];
        this.filteredMakes = [];
        for(let p of resultData) {          
          this.makes.push(p.makeName);        
        } 
        this.filteredMakes = this.makes;
      }  
    });
  }

  // caption change
  onEnterCaption(event) {
    if(event.target.value == '' && (this.make == '' && this.filteredModels.length == 0 && this.filteredYears.length == 0 && this.filteredTagIds.length == 0)) {
      this.saveMediaFlag = true;
    }
    else{
      this.saveButtonEnable();
    }
  }
  // save button enable
  saveButtonEnable(){
    if((this.caption == '') && (this.make == '' && this.filteredModels.length == 0 && this.filteredYears.length == 0 && this.filteredTagIds.length == 0)) {
      this.saveMediaFlag = true;
    }
    else{
      this.saveMediaFlag = false;      
    }   
  }

  // Set Screen Height
  /*setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
    this.innerMediaHeight = (this.bodyHeight-(headerHeight+footerHeight+30));  
    this.innerMediaHeight = (this.bodyHeight > 1420) ? 980 : this.innerMediaHeight;  
    this.innerMediaHeight = this.innerMediaHeight-40;
  }
  */
  setScreenHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
      this.innerMediaHeight = (this.bodyHeight-(headerHeight+footerHeight+30));  
      this.innerMediaHeight = (this.bodyHeight > 1420) ? 980 : this.innerMediaHeight;         
    }
    console.log(this.innerMediaHeight);
  }

  getHeight(){  
    let h = 90;
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
    this.innerMediaHeight = (this.bodyHeight-(headerHeight+footerHeight+30));  
    this.innerMediaHeight = (this.bodyHeight > 1420) ? 980 : this.innerMediaHeight;  
    this.innerMediaHeight = this.innerMediaHeight - h;       
    setTimeout(() => { 
      console.log(document.getElementsByClassName('ps--active-y').length);
      if (document.getElementsByClassName('ps--active-y').length > 1) { 
        this.heightCheck = true;
        this.buttonVisible = true;  
      }
      else{ 
        this.innerMediaHeight = this.innerMediaHeight + h;  
        this.heightCheck = false;
        this.buttonVisible = true; 
      }      
    }, 1500);  
  }

  // Initialize LightGallery
  initLightGallery() {
    lightGallery(document.getElementById('info-gallery'), {
      actualSize: true,
      closable: false,
      download: true,
      escKey: false,
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
  }

 // Custom Selection Change
  selectChange(field, value) { 
    this.make = value;
    this.modelLoading = true;
    this.getModels(this.make); 
    this.saveMediaFlag = false; 
  }

  // Get App Models
  getModels(value) {
    let apiData = {
      'apiKey': this.mediaInfo.apiKey,
      'domainId': this.mediaInfo.domainId,
      'countryId': this.mediaInfo.countryId,
      'threadType': this.threadType,
      'searchText': '',
      'make': value
    };
    this.partsApi.getModels(apiData).subscribe((response) => {
      this.modelLoading = false;
      if(response.status == "Success") {
        let resultData = response.data.model;
        this.models = [];       
        for(let m of resultData) {          
          this.models.push({
            id: m,
            name: m
          });
        }

      }
    });    
  }

  // Option Search
  filterSearchOptions(field, value) {
    switch(field) {
      case 'make':
        this.filteredMakes = [];
        break;
    }
    this.selectSearch(field, value);
  }

  // Filter Search
  selectSearch(field, value:string) {
    let filter = value.toLowerCase();
    switch (field) {
      case 'make':
        this.filteredMakes = [];
        for ( let i = 0 ; i < this.makes.length; i ++ ) {
          let option = this.makes[i];         
          if (option.toLowerCase().indexOf(filter) >= 0) {
              this.filteredMakes.push(option);
          }
        }
        break;
    }
  }

  // Selected Models
  selectedModels(list) {
    this.filteredModels = list.items;
    this.saveMediaFlag = false;
    this.saveButtonEnable();    
    this.getHeight();
  }

  // Selected Years
  selectedYears(items) {
    console.log(items);
    this.filteredYears = items;
    this.saveMediaFlag = false;
    this.saveButtonEnable();    
    this.getHeight();
  }

  // Manage List
  manageList(field) {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
    
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+20));  
    this.innerHeight = (this.bodyHeight > 1420) ? 980 : this.innerHeight;

    let apiData = {
      'apiKey': this.mediaInfo.apiKey,
      'domainId': this.mediaInfo.domainId,
      'countryId': this.mediaInfo.countryId,
      'userId': this.mediaInfo.userId,
      'threadType': this.threadType,
      'groupId': this.mediaInfo.groupId
    };

    let access;
    let filteredItems;
    console.log(this.filteredTagIds);
    switch(field) {
      case 'tag':
        access = 'Tags';
        filteredItems = this.filteredTagIds;
        break;
    }    
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.filteredLists = this.filteredTags; 
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight-140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click');
      let items = receivedService;
      switch (field) {
        case 'tag':
          this.filteredTagIds = [];
          this.filteredTags = [];
          for(let t in items) {
            let chkIndex = this.filteredTagIds.findIndex(option => option == items[t].id);
            if(chkIndex < 0) {
              this.filteredTagIds.push(items[t].id);
              this.filteredTags.push(items[t].name);
              this.saveMediaFlag = false;
            }        
          }
        break;
      }      
      this.getHeight();
    });
  }

  // Disable Tag Selection
  disableTagSelection(index) {
    this.filteredTags.splice(index, 1);
    this.filteredTagIds.splice(index, 1);
    this.saveButtonEnable();    
    this.getHeight();
  }
 
  // Toogle Media Info
  toggleInfo(flag) {
    this.commonApi.emitMessageLayoutChange(flag);
    this.actionFlag = false;
    let data = {
      access: 'info',
      callback: this.mediaInfo.mediaType,
      action: flag,
      mediaId: this.mediaInfo.mediaId
    };
    this.toggleAction.emit(data);    
    this.infoLoading = true;
  }

  // Media Action
  mediaAction(flag) {
    this.actionFlag = flag;
    let h = 90;
    if(this.actionFlag) {       
      this.getHeight();          
    } else { // cancel
      this.innerMediaHeight = this.innerMediaHeight+h;
      let mediaInfo = this.mediaInfo;
      let apiData = {
        apiKey: mediaInfo.apiKey,
        domainId: mediaInfo.domainId,
        countryId: mediaInfo.countryId,
        userId: mediaInfo.userId,
        accessType: mediaInfo.accessType,
        mediaId: mediaInfo.mediaId
      }
      this.getMediaInfo(apiData); 
    }
    
    setTimeout(() => {
      if(this.linkType == 'youtube'){
        document.getElementById("myframe").setAttribute("src", "//www.youtube.com/embed/"+this.videoID);
      }
      if(this.linkType == 'video'){
        document.getElementById("myframe").setAttribute("src", "https://player.vimeo.com/video/"+this.vimeoId);
      }
    }, 50);    

  }

  // save media
  mediaSubmit() {
    this.mediaSubmitted = true;

    if(this.mediaForm.invalid) {  
      this.saveMediaFlag  = false;
      return;
    }

    this.submitMediaLoading = true;
    this.saveMediaFlag  = true;
    let mediaFormData = new FormData();

    mediaFormData.append('apiKey', this.mediaInfo.apiKey);
    mediaFormData.append('domainId', this.mediaInfo.domainId);
    mediaFormData.append('countryId', this.mediaInfo.countryId);
    mediaFormData.append('userId', this.mediaInfo.userId);
    mediaFormData.append('mediaId', this.mediaInfo.mediaId);    
    mediaFormData.append('caption', this.mediaForm.value.caption);

    if(this.flagId == 6){
      mediaFormData.append('linkUrl', this.mediaForm.value.link);
      mediaFormData.append('type', 'link');
    }

    //mediaFormData.append('description', this.mediaForm.value.description);

    let vehicleData = [];
    vehicleData.push({
      genericProductName: this.make,
      model : this.filteredModels,
      year: this.filteredYears
    });

    mediaFormData.append('vehicleInfo', JSON.stringify(vehicleData));
    mediaFormData.append('tags', JSON.stringify(this.filteredTagIds));

    this.mediaApi.saveMedia(mediaFormData).subscribe((inofResponse) => {
      this.infoLoading = true;
      if(inofResponse.status == 'Success') {
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = "Media Detail Updated Successfully";        
        setTimeout(() => {
          msgModalRef.dismiss('Cross click');          
          this.saveMediaFlag  = false;
          this.infoLoading = false;
          this.submitMediaLoading = false;
          this.actionFlag = false;
          let infoResult = inofResponse.mediaData[0];  
          let mediaInfo = this.mediaInfo;
          let data = {
            access: 'save',
            callback: mediaInfo.mediaType,
            action: false,
            mediaId: mediaInfo.mediaId,
            mediaInfo: infoResult
          };
          this.toggleAction.emit(data);
          this.setupMediaInfo(infoResult);
        }, 1000);
      } 
      else{
        this.saveMediaFlag  = false;
        this.infoLoading = false;
        this.submitMediaLoading = false;
      }
    });    
  }
  // Like, Pin Action
  socialAction(type, status) {
    let actionStatus = '';
    let actionFlag = true;    
    let pinCount = this.pinCount;
    switch(type) {
      case 'pin':
        actionFlag = (this.pinLoading) ? false : true;
        actionStatus = (status == 0) ? 'pined' : 'dispined';
        this.pinStatus = (status == 0) ? 1 : 0;
        this.pinStatus = this.pinStatus;
        this.pinImg = (this.pinStatus == 1) ? 'assets/images/pin-icon-active.png' : 'assets/images/pin-icon-normal.png';    
        this.pinCount = (status == 0) ? pinCount+1 : pinCount-1;
        this.pinCount = this.pinCount;
        this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
        break;
    }
    let mediaInfo = this.mediaInfo;  
    if(actionFlag) {
      let apiData = {
        apiKey: mediaInfo.apiKey,
        domainId: mediaInfo.domainId,
        countryId: mediaInfo.countryId,
        userId: mediaInfo.userId,
        ismain: 1,
        mediaId: mediaInfo.mediaId,
        status: actionStatus,
        type: type
      }    
            
      this.mediaApi.mediaLikePinAction(apiData).subscribe((response) => {
        if(response.status != 'Success') {
          switch(type) {
            case 'pin':
              this.pinStatus = status;
              this.pinStatus = this.pinStatus;
              this.pinImg = (this.pinStatus == 1) ? 'assets/images/pin-icon-active.png' : 'assets/images/pin-icon-normal.png';   
              this.pinCount = (status == 0) ? pinCount-1 : pinCount+1;
              this.pinCount = this.pinCount;
              this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
              break;
          }
        }
      });
    }
  }

  // Delete Media
  deleteMedia(mid) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');      
      if(receivedService) {
        this.bodyElem.classList.add(this.bodyClass);
        let mediaId = [];
        mediaId.push(mid.toString());
        let apiData = {
          apiKey: this.mediaInfo.apiKey,
          domainId: this.mediaInfo.domainId,
          countryId: this.mediaInfo.countryId,
          userId: this.mediaInfo.userId,
          mediaId: mediaId
        }
        const msgModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
        this.mediaApi.deleteMedia(apiData).subscribe((response) => {
          msgModalRef.dismiss('Cross click');
          this.bodyElem.classList.remove(this.bodyClass);
          let data = {
            access: 'delete',
            callback: this.mediaInfo.mediaType,
            action: true,
            mediaId: this.mediaInfo.mediaId
          };
          this.toggleAction.emit(data);
          this.infoLoading = true;        
        });  
      }
    });
  }

  copyLink(){
    navigator.clipboard.writeText(this.filePath);
    this.copiedModal = true;
    setTimeout(() => {
      this.copiedModal = false;
    }, 1500);
  }
   // Add Link
  editLink() {
    let editData = {
      linkData: this.link,
      captionData: this.caption
    }
    const modalRef = this.modalService.open(AddLinkComponent, this.config);
    modalRef.componentInstance.editData = editData;
    modalRef.componentInstance.access = 'Edit Link';
    modalRef.componentInstance.mediaServices.subscribe((receivedService) => { 
      modalRef.dismiss('Cross click');
      if(receivedService){
        this.textAreaDisabled  = true;
        console.log(receivedService);
        this.link = receivedService['linkData'];
        this.caption = receivedService['captionData']; 
        this.viewCaption = (receivedService['captionData'] == '') ? this.link : receivedService['captionData'];      
        let logoData =  receivedService['logoData'];

        console.log(this.link);
        console.log(this.caption);
        console.log(logoData);

        this.mediaForm = this.formBuilder.group({
          link: [this.link, []],
          caption: [this.caption, []],
          //description: [this.description, [Validators.required]]
        });   
        
        this.saveMediaFlag = false;  
        let prefix = 'https://';       
        let logo = logoData;
        this.mediaImg = logoData;
        this.linkType = 'link';        
        this.linkClass = (logoData == "") ? 'default' : 'logo';
        let url = this.link;       
        if(url.indexOf("http://") != 0) {
          if(url.indexOf("https://") != 0) {
            url = prefix + url;
          } 
        }
        this.linkUrl = `<p><a href="${url}" target="_blank">${url}</a></p>`;       
        this.link = url;                
        let youtube = this.commonApi.matchYoutubeUrl(url);
        if(youtube) {
          this.linkClass = "default";          
          this.videoID = youtube;
          this.mediaImg = '//img.youtube.com/vi/'+youtube+'/0.jpg';
          this.linkType = 'youtube';  
          if(this.linkType == 'youtube'){
            setTimeout(() => {
              document.getElementById("myframe").setAttribute("src", "//www.youtube.com/embed/"+this.videoID);
            }, 600);
          }     
        } else {
          let vimeo = this.commonApi.matchVimeoUrl(url);          
          this.vimeoId = vimeo;           
          if(vimeo) {
            this.linkClass = "default";
            this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
              let res = response[0];
              let thumb = res['thumbnail_medium'];
              this.mediaImg = thumb;                
            });
            this.linkType = 'video';
            setTimeout(() => {              
              document.getElementById("myframe").setAttribute("src", "https://player.vimeo.com/video/"+this.vimeoId);
            }, 600);
          } else {
           this.mediaImg = logo;
          }             
        }        
        this.mediaImg = logo;        
      }
    });
  }

  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  screenChange(event) {
    let flag: any = 1;
    console.log(flag)
    localStorage.setItem('fullscreen', flag);
  }

}
