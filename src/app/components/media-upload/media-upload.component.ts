import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MediaUpload, MediaTypeSizes, MediaTypeInfo, Constant } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subscription } from "rxjs";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent implements OnInit, OnDestroy{
  subscription: Subscription = new Subscription();
  @Input() access;
  @Input() apiData;
  @Input() fileAttachmentEnable;
  @Input() mediaList: any = [];
  @Input() presetAttchmentItems: any = [];
  @Input() editAttchmentItems: any = [];
  @Input() updatedAttchmentItems: any = [];
  @Input() deletedFileIds: any = [];
  @Input() attachmentList: any = [];
  @Input() addLinkFlag: any = false;
  @Output() uploadAction: EventEmitter<any> = new EventEmitter();

  @Input() uploadedItems: any = []; 
  @Input() fileList: any = [];
  @Output() uploadAttachmentAction: EventEmitter<any> = new EventEmitter();  
  public sconfig: PerfectScrollbarConfigInterface = {};
  public mediaFile: boolean = false;
  public fromMedia: boolean = true;
  public attachmentTabs: any = MediaUpload;
  public removeFileIds: any = [];
  public thumbView: boolean = true;
  public fileLoading: boolean = false;
  public searchBgFlag: boolean = false;
  public searchReadonlyFlag: boolean = false;
  public searchPlacehoder: string = 'Search';
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public assetPath: string = "assets/images";
  public searchImg: string = `${this.assetPath}/search-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close.png`;
  public empty: any = [];
  public mediaSelectionList: any = [];
  public mediaRemoveList: any = [];
  public selectedFileView: boolean = false;

  // attachement file
  public postUpload: boolean = true;
  public manageAction: string = 'new';
  public postApiData: object;
  public user: any;
  public platformId: string;
  public countryId;
  public domainId;
  public userId;
  public contentType: number = 2;
  public displayOrder: number = 0;
  public uploadedItemsFlag: boolean = false;
  public postServerError:boolean = false;
  public postServerErrorMsg: string = '';
  public selectedFileArrData: any = [];
  public fileUpload: boolean = true;
  public cloudTabApplyData: any = [];
  
  public presetAttachments: any = [];
  public updatedAttachments: any = [];
  public presetAttachmentAction: 'attachments';
  public mediaAttachments: any[] = [];
  public presetPageAccess = "presets";
  public acceptArray = "";
  // attachement file

  // convenience getter for easy access to form fields
  get f() {
    return this.searchForm.controls;
  }
  
  constructor(
    public activeModal: NgbActiveModal,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService, 
  ) { }

  ngOnInit(): void {
    //localStorage.removeItem('mediaUploadFilter');
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });

    console.log(this.mediaList, this.attachmentList, this.fileAttachmentEnable)

    this.fileAttachmentEnable = this.fileAttachmentEnable == undefined ? false : this.fileAttachmentEnable;
    if(this.fileAttachmentEnable){
      this.apiUrl.attachmentNewPOPUP = true; // show black icons
      this.postApiData = this.apiData;
    }

    /*this.user = this.authenticationService.userValue;*/
    this.domainId = this.apiData['domainId'];
    this.userId = this.apiData['userId'];
   
    console.log(this.uploadedItems);

    if(this.fileAttachmentEnable){  
      if(this.uploadedItems != '') {            
        if(this.uploadedItems.items.length>0){
          this.selectedFileView = true;
        }
      }           
    }

    if(this.selectedFileView){
      this.selectedFileArrData = this.uploadedItems;
      console.log(this.selectedFileArrData);
      setTimeout(() => {
        this.commonApi.emitUploadInfoData(this.selectedFileArrData);
      }, 100);  
    }

    console.log(this.presetAttchmentItems);

    this.presetAttachmentAction = 'attachments';
    this.presetAttachments = [];
    if(this.presetAttchmentItems && this.presetAttchmentItems.length>0){
      this.presetAttachments  = this.presetAttchmentItems; 
      this.updatedAttchmentItems  = this.updatedAttchmentItems; 
      this.deletedFileIds  = this.deletedFileIds; 
      this.uploadedItemsFlag=true;
    }

    this.subscription.add(
      this.commonApi.cloudTabDataReceivedSubject.subscribe(
        (r) => {  
          console.log(r);   
          console.log(r['action']); 
          this.apiData = r['apiData'];
          this.mediaList = r['mediaList'];
          this.attachmentList = r['attachmentList'];
          this.fileList = r['fileList'];
          this.fileAttachmentEnable = false; 
          setTimeout(() => {
            this.ngOnInit(); 
          }, 1);                
        })
    );

    this.subscription.add(
      this.commonApi.mediaUploadDataSubject.subscribe((response) => {
        console.log(response)
        let access = response['access'];
        switch(access) {
          case 'media':
            this.setupAction(response);
            break;
        }
      })
    );
  }

  setupAction(data) {
    let action = data['action'];
    switch(action) {
      case 'mediaSelection':
        let mediaItem = data['mediaItem'];
        let rmId = data['removedItem'];
        this.mediaFile = data['mediaFlag'];
        if(mediaItem != '') {
          let mid = mediaItem.mediaId;
          let mindex = this.mediaSelectionList.findIndex(option => option.mediaId == mid);
          console.log(this.mediaRemoveList)
          let rmindex = this.mediaRemoveList.findIndex(option => option == mid);
          if(rmindex >= 0) {
            this.mediaRemoveList.splice(rmindex);
          }
          if(mindex < 0) {
            this.mediaSelectionList.push(mediaItem);
          }                
        }
        if(rmId != '') {
          this.chkMediaExists(rmId);
        }        
        break;
    }
  }

  chkMediaExists(mid) {
    let mindex = this.mediaList.findIndex(option => option == mid);
    if(mindex >= 0) {
      this.mediaList.splice(mindex, 1);
      this.mediaRemoveList.push(mid);
    }

    if(this.attachmentList.includes(mid) && !this.mediaRemoveList.includes(mid)) {
      this.mediaRemoveList.push(mid);
    }

    let msindex = this.mediaSelectionList.findIndex(option => option.mediaId == mid);
    if(msindex >= 0) {
      this.mediaSelectionList.splice(msindex, 1);
    }

    console.log(this.mediaSelectionList, this.mediaRemoveList)
    console.log(this.mediaSelectionList.length, this.mediaRemoveList.length)

    setTimeout(() => {
      if(this.mediaSelectionList.length == 0 && this.mediaRemoveList.length > 0) {
        this.mediaFile = true;
      }  
    }, 100);
    
  }

  changeTab(item) {
    console.log(item)
    if(!item.isActive) {
      return false;
    }
    this.attachmentTabs.forEach(tabItem => {
      tabItem.isSelected = (tabItem.tab != item.tab) ? false : true;
    });
  }

  changeView(actionFlag) {
    this.thumbView = (actionFlag) ? false : true;
    let action = 'view'; 
    this.emitMedia(action);
    if(this.thumbView) {
      let secElement = document.getElementById('gallery');        
      setTimeout(() => {
        let scrollPos = 0;
        secElement.scrollTop = scrollPos;
      }, 200);        
    }    
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    let searchLen = searchValue.length;
    if (searchLen == 0) {
      this.submitted = false;
      this.clearSearch();
    }
  }

  onSubmit() {
    //console.log(this.searchVal)
    this.searchForm.value.search_keyword = this.searchVal;
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      this.submitSearch();
    }
  }

  // Submit Search
  submitSearch() {
    this.emitMedia('search');
  }

  // Clear Search
  clearSearch() {
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
    this.emitMedia('search');
  }

  emitMedia(action) {
    let tabItem = this.checkTabIndex();
    let tabName = tabItem.tab;
    let data = {
      access: tabName,
      action: action,
      searchVal: this.searchVal
    };
    switch(action) {
      case 'search':
        data['searchVal'] = this.searchVal;
        break;
      case 'view':
        let view = (this.thumbView) ? 'thumb' : 'list';
        data['viewType'] = view;
        break;  
    }
    this.commonApi.emitMediaUploadData(data);
  }

  applySelection() {
    if(this.apiUrl.attachmentNewPOPUP){
      let tabItem = this.checkTabIndex();
      let tabName = tabItem.tab;
      let data = {};
      switch(tabName) {
        case 'media':
          if(this.mediaFile) {
            data = {
              mediaSelectionList: this.mediaSelectionList,
              mediaRemoveList: this.mediaRemoveList,
              apiData : this.apiData,
              fileList : this.fileList,
            };
          }
          break;
      }        
      this.apiUrl.mediaApplyCall = true; 
      this.fileAttachmentEnable = true;
      this.manageAction = 'media-apply';
      this.cloudTabApplyData = data;
      this.fileUpload = false;
      setTimeout(() => {
        this.fileUpload = true;
      }, 100);    
    }
    else{
      let tabItem = this.checkTabIndex();
      let tabName = tabItem.tab;
      let data = {
        mediaSelectionList: [],
        mediaRemoveList: []
      };
      switch(tabName) {
        case 'media':
          if(this.mediaFile) {
            data.mediaSelectionList = this.mediaSelectionList;
            data.mediaRemoveList = this.mediaRemoveList;
          }
          break;
      }
      this.uploadAction.emit(data);
    }
    
  }

  checkTabIndex() {
    let flag = true;
    let tindex = this.attachmentTabs.findIndex(option => option.isSelected == flag);
    let tabItem = this.attachmentTabs[tindex];
    return tabItem;
  }

  closeMedia() {
    //localStorage.removeItem('mediaUploadFilter');
    
    if(this.fileAttachmentEnable){
      this.fileAttachmentEnable = true;
    } 
    else{
      this.subscription.unsubscribe();
      this.activeModal.dismiss('Cross click');
    } 
  }

  closePOPUP() {
    if(this.fileAttachmentEnable){      
      this.addAttachment();
    } 
    else if(!this.fileAttachmentEnable && this.presetAttchmentItems.length>0){
      this.addAttachment();
    }
    else{
      this.subscription.unsubscribe();
      this.activeModal.dismiss('Cross click');
    }
     
  }

  closePop(){
    this.subscription.unsubscribe();
    this.activeModal.dismiss('Cross click');
  }

  attachments(items) {
    this.uploadedItems = items;
    console.log(items);
    this.uploadedItemsFlag = false;
    if(this.uploadedItems != '') {            
      if(this.uploadedItems.items.length>0){
        this.uploadedItemsFlag = true;
        this.apiData['uploadedItems'] = this.uploadedItems.items;
        this.apiData['attachments'] = this.uploadedItems.attachments;
      }

      if(this.presetAttchmentItems && this.presetAttchmentItems.length>0){
        this.presetAttachments  = this.presetAttchmentItems; 
        this.uploadedItemsFlag=true;
      }
    }  
    
    /*setTimeout(() => {
      let secElement = document.getElementById('f-attachments');     
      setTimeout(() => {
        secElement.scrollTop = secElement.scrollHeight;
        console.log(secElement.scrollHeight);      
      }, 400);
    }, 700);*/

  }

  addAttachment(){
    this.postServerErrorMsg = '';  
    this.postServerError = false;     
    if(this.uploadedItems != '') {      
      if(this.uploadedItems.items.length>0){
        for(let a in (this.uploadedItems.items)) {          
          if(this.uploadedItems.items[a].flagId == 6) {
            this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
            if(this.uploadedItems.items[a].url=='') {
              if(this.apiUrl.attachmentLinkError == ''){
                var element = document.getElementById('empty-link-'+a);
                element.classList.remove("hide");              
                this.apiUrl.attachmentLinkError = '1';
              }                
              return false;
            }
          }
        }
      }
    }
    
    let data = {
      'uploadedItems': this.uploadedItems,
      'presetAttachments': this.presetAttachments,
      'editAttachments': this.presetAttachments,      
      'updatedAttachments': this.updatedAttachments,
      'deletedFileIds': this.deletedFileIds
    }
    this.uploadAttachmentAction.emit(data);
      
  }

  // Attachment Action
  attachmentAction(data) {
  console.log(data)
  let action = data.action;
  let fileId = data.fileId;
  let caption = data.text;
  let url = data.url;
  let lang = data.language;
  switch (action) {
    case 'file-delete':
      this.deletedFileIds.push(fileId);
      let uindex1 = this.presetAttachments.findIndex(option => option.fileId == fileId);
      if(uindex1 >= 0) {
        this.presetAttachments.splice(uindex1); 
        //this.updatedAttachments.splice(uindex1); 
      }

      let uindex11 = this.updatedAttachments.findIndex(option => option.fileId == fileId);
      if(uindex11 >= 0) {
        this.updatedAttachments.splice(uindex1); 
      }

      break;
    case "file-remove":
      this.deletedFileIds.push(fileId);
      let uindex2 = this.presetAttachments.findIndex(option => option.fileId == fileId);
      if(uindex2 >= 0) {
        this.presetAttachments.splice(uindex2);                
      }
      let uindex21 = this.updatedAttachments.findIndex(option => option.fileId == fileId);
      if(uindex21 >= 0) {
        this.updatedAttachments.splice(uindex1); 
      }
      break;
    case 'order':
      let attachmentList = data.attachments;
      for(let a in attachmentList) {
        let uid = parseInt(a)+1;
        let flagId = attachmentList[a].flagId;
        let ufileId = attachmentList[a].fileId;
        let caption = attachmentList[a].caption;
        let uindex = this.presetAttachments.findIndex(option => option.fileId == ufileId);
        if(uindex < 0) {
          let fileInfo = {
            fileId: ufileId,
            caption: caption,
            url: (flagId == 6) ? attachmentList[a].url : '',
            displayOrder: uid
          };
          this.presetAttachments.push(fileInfo);
        } else {
          this.presetAttachments[uindex].displayOrder = uid;    
        }
      }
      // edit
      for(let a in attachmentList) {
        let uid = parseInt(a)+1;
        let flagId = attachmentList[a].flagId;
        let ufileId = attachmentList[a].fileId;
        let caption = attachmentList[a].caption;
        let uindex = this.updatedAttachments.findIndex(option => option.fileId == ufileId);
        if(uindex < 0) {
          let fileInfo = {
            fileId: ufileId,
            caption: caption,
            url: (flagId == 6) ? attachmentList[a].url : '',
            displayOrder: uid
          };
          this.updatedAttachments.push(fileInfo);
        } else {
          this.updatedAttachments[uindex].displayOrder = uid;    
        }
      }
      // edit
      break;  
    default:
      let updatedAttachmentInfo = {
        fileId: fileId,
        caption: caption,
        url: url,
        language: lang
      };
      let index = this.presetAttachments.findIndex(option => option.fileId == fileId);   
      if(index < 0) {
        updatedAttachmentInfo['displayOrder'] = 0;
        this.presetAttachments.push(updatedAttachmentInfo);
      } else {
        this.presetAttachments[index].caption = caption;
        this.presetAttachments[index].url = url;
        this.presetAttachments[index].language = lang;
      }      
      
      //edit
      let eindex = this.updatedAttachments.findIndex(option => option.fileId == fileId);   
      if(eindex < 0) {
        updatedAttachmentInfo['displayOrder'] = 0;
        this.updatedAttachments.push(updatedAttachmentInfo);
      } else {
        this.updatedAttachments[eindex].caption = caption;
        this.updatedAttachments[eindex].url = url;
        this.updatedAttachments[eindex].language = lang;
      }
      //edit
      break;
  }   
  console.log(this.presetAttachments)
  console.log(this.deletedFileIds)
}

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.apiUrl.attachmentNewPOPUP = false;
  }

}
