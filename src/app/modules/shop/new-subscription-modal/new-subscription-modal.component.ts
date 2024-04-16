import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Constant } from 'src/app/common/constant/constant';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-new-subscription-modal',
  templateUrl: './new-subscription-modal.component.html',
  styleUrls: ['./new-subscription-modal.component.scss'],
  providers:[MessageService]
})
export class NewSubscriptionModalComponent implements OnInit {

  postApiData= {}
  user: any;
  domainId: any;
  userId:any;
  roleId:any;
  public contentType: any = 51;
  uploadedItems: any = [];
  public mediaConfig: any = {backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal'};
  

  constructor(private messageService: MessageService,public activeModal: NgbActiveModal,    private authenticationService: AuthenticationService,    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
  }

  openAttachments(){
    let val: any = 0;
    let type = 'new';

    let postId = val;
    let fitem = [];
    let mitem = [];
    let obj = {};
    this.postApiData = {
      action: 'new',
      access: 'audit-workflow',
      pageAccess: 'audit-workflow',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: '',
      userId: this.userId,
      dataId: postId,
      threadId: '',
      postId: postId,
      contentType: this.contentType,
      displayOrder: '',
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: [],
      pushData: obj
    };

    if(this.uploadedItems != '') {
      if(this.uploadedItems.items.length>0){
        fitem = this.uploadedItems;
        this.postApiData['uploadedItems'] = this.uploadedItems.items;
        this.postApiData['attachments'] = this.uploadedItems.attachments;
      }
    }
    const modalRef = this.modalService.open(MediaUploadComponent, {backdrop:'static',keyboard: true, centered: true, windowClass: 'attachment-modal'});
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.mediaAttachments = true;
    modalRef.componentInstance.apiData = this.postApiData;
    modalRef.componentInstance.uploadedItems = fitem;
    modalRef.componentInstance.presetAttchmentItems = mitem;
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      this.uploadedItems = receivedService.uploadedItems;
    })

  }

  saveImages(){
    this.activeModal.close(this.uploadedItems)
  }

}
