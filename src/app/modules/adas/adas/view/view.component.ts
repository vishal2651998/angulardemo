import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constant, ContentTypeValues, RedirectionPage, SolrContentTypeValues } from "src/app/common/constant/constant";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { CommonService } from "src/app/services/common/common.service";
import { BaseService } from 'src/app/modules/base/base.service';
import { ApiService } from 'src/app/services/api/api.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { Title } from "@angular/platform-browser";
import * as moment from 'moment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input() access: string = "page";
  @Input() itemData: any = [];
  @Output() adasService: EventEmitter<any> = new EventEmitter();
  
  public sconfig: PerfectScrollbarConfigInterface = {};
  public loading: boolean = true;
  public title:string = 'ADAS ID# ';
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyElem;
  public fileId: any;
  public fileData: any = [];
  public headerData:any;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId: any;
  public domainId: any;
  public roleId: any;
  public contentType: any = ContentTypeValues.AdasProcedure;
  public solrType: any = SolrContentTypeValues.AdasProcedure;
  public newPage: any = 0;
  public copiedModal: boolean = false;
  public threadOwner: boolean = false;
  public innerHeight: number;
  public bodyHeight: number; 
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public successMsg: string = '';
  public bodyClass2: string = "submit-loader";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    private baseService: BaseService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public apiUrl: ApiService,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    if(!document.body.classList.contains(this.bodyClass)) {
      document.body.classList.add(this.bodyClass);
    }
    this.checkAccessLevel();
    this.setScreenHeight();    
  }

  getFileData() {
    let type = 'list';
    let filterItems = {
      adasIdInt: this.fileId
    }
    let apiData = {
      start: 0,
      rows: 1,
      type: this.solrType,
      filters: filterItems
    }
    this.commonApi.getSolrAdasList(type, apiData).subscribe((response) => {
      this.fileData = response.items[0];
      this.setupFileData();
    });
  }

  setupFileData() {
    let tagList = [], systemList = [];
    let bannerImage = (this.fileData.defaultBanner[0]) ? '' : this.fileData.bannerImageStr;
    this.fileData['bannerImage'] = bannerImage;
    let createdDate = moment.utc(this.fileData.createdDateStr).toDate(); 
    let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
    this.fileData['createdDate'] = localCreatedDate;
    let updatedDate = (this.fileData.updatedDateStr == '0000-00-00 00:00:00') ? '' : moment.utc(this.fileData.updatedDateStr).toDate(); 
    let localUpdatedDate = (updatedDate == '') ? '-' : moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
    this.fileData['updatedDate'] = localUpdatedDate;
    this.fileData['vehicleInfo'] = this.fileData.vehicleInfoJsonArr[0];
    this.fileData['tagInfo'] = (this.fileData.tagsJsonArr) ? this.fileData.tagsJsonArr : [];
    this.fileData['adasSystemInfo'] = (this.fileData.adasSystemInfoJsonArr) ? this.fileData.adasSystemInfoJsonArr : [];
    this.fileData['workstreamInfo'] = this.fileData.workstreamInfoJsonArr;
    this.fileData['viewCount'] = 0;
    this.fileData['styleName'] = (bannerImage == '') ? 'empty' : '';
    this.fileData['flagId'] = 0;
    this.fileData['class'] = 'doc-thumb';
    this.fileData['tagInfo'].forEach(tagItem => {
      tagList.push(tagItem.name)
    });
    this.fileData['adasSystemInfo'].forEach(sitem => {
      systemList.push(sitem.name)
    });
    this.fileData['tagList'] = (tagList.length > 0) ? tagList : '-';
    this.fileData['systemList'] = (tagList.length > 0) ? systemList : '-';
    let attachments = (this.fileData.uploadContents) ? this.fileData.uploadContents : [];
    this.fileData['attachments'] = attachments; 
    if(attachments.length > 0) {
      let attachment = attachments[0];
      let flagId = attachment.flagId;
      this.fileData['flagId'] = flagId;
      switch (flagId) {
        case 1:
          this.fileData['contentPath'] = attachment.thumbFilePath;
          break;
        case 2:
          this.fileData['contentPath'] = attachment.posterImage;
          break;
        case 3:
          this.fileData['styleName'] = 'mp3';
          this.fileData['contentPath'] = attachment.thumbFilePath;
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
          this.fileData['styleName'] = styleName;
          break;
        case 6:
          this.fileData['class'] = 'link-thumb';
          let banner = '';
          let prefix = 'http://';
          let logoImg = attachment.thumbFilePath;
          this.fileData.styleName = (logoImg == "") ? 'link-default' : '';
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
          this.fileData['contentPath'] = banner; 
          break;
        case 8:
          this.fileData['styleName'] = 'html';
          break;  
        default:
          break;
      }
    }
    this.fileData['contentPath'] = (bannerImage == '') ? this.fileData['contentPath'] : this.fileData['bannerImage'];
    if(this.userId == this.fileData.userId){
      this.threadOwner = true;
    }
    let editAccess = this.accessLevel.edit;
    let deleteAccess = this.accessLevel.delete;
    this.headerData = {
      pageName: 'adas',
      threadId: this.fileId,
      threadOwnerAccess: this.threadOwner,
      editAccess,
      deleteAccess,
      reopenThread: '',
      closeThread: '',
      convert: false
    };
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(ContentTypeValues.AdasProcedure, chkType, chkFlag);
      setTimeout(() => {
        let accessLevels = this.authenticationService.checkAccessItems;
        if(accessLevels.length > 0) {
          let reportAccess = accessLevels[0].pageAccess;
          reportAccess.forEach(item => {
            let accessId = parseInt(item.id);
            let roles = item.roles;
            let roleIndex = roles.findIndex(option => option.id == this.roleId);
            let roleAccess = roles[roleIndex].access;
            console.log(accessId, roleAccess)
            switch (accessId) {
              case 1:
                viewAccess = (roleAccess == 1) ? true : false;
                break;
              case 2:
                createAccess = (roleAccess == 1) ? true : false;
                break;
              case 3:
                editAccess = (roleAccess == 1) ? true : false;
                break;
              case 4:
                deleteAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });

        }
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess};

        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        console.log(this.accessLevel)
        switch(this.access) {
          case 'page':
            this.route.params.subscribe( params => {
              this.fileId = params.id;
            });
            this.getFileData();
            break;
          case 'popup':
            console.log(this.itemData)
            this.fileData = this.itemData;  
            this.fileId = this.fileData.adasIdInt;
            this.loading = false;  
            break;  
        }
        this.title = `${this.title}${this.fileId}`;
        this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);
      }, 500);
  }

  threadHeaderAction(event) {
    let currentURL1 = window.location.href;
    let currentURL2 = this.router.url;
    let currentURL3 = currentURL1.replace(currentURL2,"")
    let viewUrl = `${currentURL3}/${RedirectionPage.AdasProcedure}/view/${this.fileId}`;
    switch (event) {
      case "newtab":
        localStorage.setItem('adasNavNewTab', 'true');
        window.open(viewUrl,viewUrl);
        break;
      case 'copy':
        navigator.clipboard.writeText(viewUrl);
        this.copiedModal = true;
        setTimeout(() => {
          this.copiedModal = false;
        }, 1500);
        break;
      case "exit":
        window.close();
        break;
      default:
        this.checkAccess(event);
        break;  
    }
  }

  checkAccess(action) {
    this.fileAction(action);
  }

  fileAction(action) {
    switch(action){
      case 'edit':
        this.edit();
        break;
      case 'delete':
        this.delete();
        break;
    }
  }

  edit() {
    let surl, storage;
    storage = "adasNav";
    surl = RedirectionPage.AdasProcedure;
    localStorage.setItem(storage, surl);
    this.closeModal('edit');    
  }

  delete() {
    const modalRef = this.modalService.open(
      ConfirmationComponent,
      this.modalConfig
    );
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      console.log(receivedService);
      if (receivedService) {
        this.bodyElem.classList.add(this.bodyClass2);
        const submitModalRef = this.modalService.open(
          SubmitLoaderComponent,
          this.modalConfig
        );
        let adasApiFormData = new FormData();
        adasApiFormData.set('apikey', Constant.ApiKey);
        adasApiFormData.set('domainId', this.domainId);
        adasApiFormData.set('userId', this.userId);
        adasApiFormData.set('contentType', this.contentType);
        adasApiFormData.set('id', this.fileId);
        adasApiFormData.set('action', 'delete');
    
        this.commonApi.deleteAdasFile(adasApiFormData).subscribe((response) => {
          submitModalRef.dismiss("Cross click");
          this.bodyElem.classList.remove(this.bodyClass2);
          this.successMsg = response.message;
          
          let apiDatasocial = new FormData();
          apiDatasocial.append('apiKey', Constant.ApiKey);
          apiDatasocial.append('domainId', this.domainId);
          apiDatasocial.append('threadId', this.fileId);
          apiDatasocial.append('userId', this.userId);
          apiDatasocial.append('action', 'delete');
          apiDatasocial.append('actionType', this.solrType);
          this.baseService.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })

          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = this.successMsg;
          setTimeout(() => {
            msgModalRef.dismiss("Cross click");
            switch(this.access) {
              case 'popup':
                this.closeModal('delete');
                break;
              default:
                window.close();
                window.opener.location.reload();
                break;  
            }
          }, 2000);
        });
      }
    });
  }

  closeModal(caction = '') {
    let action = (caction == '') ? false : true
    let id = (action) ? this.fileId : 0;
    let data = {
      action,
      id,
      type: caction
    };
    localStorage.removeItem('adasNavNewTab');
    this.adasService.emit(data);    
  }

  popupClose(event){
    let action = event['action'];
    switch (action){
      case 'close':
        let data = {
          action: false
        }
        this.adasService.emit(data);
      break;
    }
  }

  // Set Screen Height
  setScreenHeight() {  
    this.bodyHeight = window.innerHeight;  
    this.innerHeight = (this.bodyHeight - 87 );  
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
  }


}
