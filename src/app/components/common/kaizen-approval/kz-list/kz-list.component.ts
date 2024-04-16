import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from "@angular/core";
import { NgxMasonryComponent } from "ngx-masonry";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { AppService } from 'src/app/modules/base/app.service';
import { CommonService } from "src/app/services/common/common.service";
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { LandingpageService }  from 'src/app/services/landingpage/landingpage.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThreadService } from '../../../../services/thread/thread.service';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { Constant} from '../../../../common/constant/constant';
import { AnnouncementService } from '../../../../services/announcement/announcement.service';
import { Message,MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { AddLinkComponent } from 'src/app/components/common/add-link/add-link.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';


@Component({
  selector: 'app-kz-list',
  templateUrl: './kz-list.component.html',
  styleUrls: ['./kz-list.component.scss'] ,
  styles: [
      `:host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
          position: -webkit-sticky;
          position: sticky;
          top: 0px;
      }

      @media screen and (max-width: 64em) {
          :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
              top: 0px;
          }
      }
        .masonry-item {
          transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
        }`
  ],
  providers: [MessageService]
})

export class KzListComponent implements OnInit {

@Input() items = [];
@Input() thumbView: boolean = true;
@Input() access: string = "doc";
public sconfig: PerfectScrollbarConfigInterface = {};
public teamSystem=localStorage.getItem('teamSystem');
public assetPartPath: string = "assets/images/kaizen/";
public chevronImg: string = `${this.assetPartPath}chevron.png`;
public userId: any;
public roleId: any;
public apiData: any = [];
public domainId : string = "1";
public countryId;
public apiKey: string = this.appService.appData.apiKey;
public docInfoData: any = {};
public panelFlag: boolean = false;
public scrollPos: number = 0;
public secHeight: any = 0;
public listHeight: any = 0;
public mfg: boolean = false;
public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
public bodyElem;
public bodyClass2: string = "submit-loader";
public bodyClass3: string = "kaizen-notes";
public msgs1: Message[];
public approveText: string = 'Approve';
public returnText: string = 'Return';
public kaizenAssigneeRoleId: string = '';
public kaizenUserType: string = '';
public listId: string = '';
public myKaizen: string = '0';

@ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
@Output() scrollActionEmit: EventEmitter<any> = new EventEmitter();
@Output() emptyActionEmit: EventEmitter<any> = new EventEmitter();

public updateMasonryLayout: boolean = false;
constructor(
    public messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router : Router,
    private authenticationService: AuthenticationService,
    private documentationService: DocumentationService,
    private landingpageService: LandingpageService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private appService: AppService,
    private announcementService: AnnouncementService,
    private threadApi: ThreadService) { }

    ngAfterViewInit(): void {
        const frozenBody: HTMLElement | null = document.querySelector('.ui-table-frozen-view .ui-table-scrollable-body');
        const scrollableArea: HTMLElement | null = document.querySelector('.ui-table-scrollable-view.ui-table-unfrozen-view .ui-table-scrollable-body');
        if (frozenBody && scrollableArea) {
          frozenBody.addEventListener('wheel', e => {
            const canScrollDown = scrollableArea.scrollTop < (scrollableArea.scrollHeight - scrollableArea.clientHeight);
            const canScrollUp = 0 < scrollableArea.scrollTop;

            if (!canScrollDown && !canScrollUp) {
              return;
            }

            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;
            const scrollDelta = 100;

            if (canScrollDown && scrollingDown) {
              e.preventDefault();
              scrollableArea.scrollTop += scrollDelta;
            } else if (canScrollUp && scrollingUp) {
              e.preventDefault();
              scrollableArea.scrollTop -= scrollDelta;
            }
          });
        }
      }

ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    console.log(this.items);
    this.bodyElem = document.getElementsByTagName('body')[0];

    this.countryId = localStorage.getItem('countryId');
    let user: any = this.authenticationService.userValue;
    if (user) {
        this.domainId = user.domain_id;
        this.userId = user.Userid;
        this.roleId = user.roleId;
        this.apiData = {
            apiKey: this.apiKey,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId,
            dataId: 0,
            platformId: 3,
        };
        this.docInfoData = {
            action: 'load',
            dataId: 0,
            docData: [],
            loading: true
        };
        //this.secHeight = 200;
        //this.listHeight = 260;

        this.secHeight = 260;
        this.listHeight = 315;

        //this.secHeight = 240;
        //this.listHeight = 300;


        console.log(this.items)
        let ids = this.items.map(o => o.resourceID)
        let filtered = this.items.filter(({resourceID}, index) => !ids.includes(resourceID, index + 1));
        console.log(filtered);
        if(localStorage.getItem('searchValue'))
        {

        }
        else
        {
            this.items = filtered;
        }
        this.listId = "";
        this.kaizenUserType=localStorage.getItem('kaizenUserType');
        this.kaizenAssigneeRoleId=localStorage.getItem('kaizenAssigneeRoleId');
        if(this.kaizenAssigneeRoleId == '0'){
           this.myKaizen = '1';
           this.approveText = "Send to TM";
        }
        if(this.kaizenAssigneeRoleId == '1'){
          this.approveText = "Send to ASM";
        }
        if(this.kaizenAssigneeRoleId == '2'){
          this.approveText = "Send to NSM";
        }
        if(this.kaizenAssigneeRoleId == '3'){
          this.approveText = "Send to HO";
        }

        if(this.kaizenAssigneeRoleId == '2'){
          this.returnText = "Return to TM";
        }
        if(this.kaizenAssigneeRoleId == '3'){
          this.returnText = "Return to ASM";
        }
        if(this.kaizenAssigneeRoleId == '4'){
          this.returnText = "Return to NSM";
        }


    }

    this.commonService.documentPanelDataReceivedSubject.subscribe((response) => {
        this.panelFlag = response['panelFlag'];
    });

    this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => { //Right side panel show & hide
        console.log(r, this.docInfoData.docData.resourceID)
        this.updateLayout();
    });
    this.commonService.documentListDataReceivedSubject.subscribe((docsData: any) => { //Right side panel show & hide
        console.log(docsData)

        if(docsData['action'] == 'kaizen-htype')
        {

        }
        else if(docsData['action'] == 'header-status' ) {
          this.listId =  docsData['listId'];
          this.myKaizen =  docsData['myKaizen'];
        }
        else{
          this.thumbView = docsData['thumbView'];
          if(docsData['accessFrom'] == 'kaizen')
              this.updateLayout();
        }


    });
    this.commonService.documentFileListData.subscribe((fileData: any) => {
        this.thumbView = fileData['thumbView'];
        this.items = fileData['items'];
        console.log(fileData, this.thumbView)
        let ids = this.items.map(o => o.resourceID)
        console.log(ids)
        let filtered = this.items.filter(({resourceID}, index) => !ids.includes(resourceID, index + 1));
        this.items = filtered;
        console.log(filtered)
        //if(this.thumbView && fileData['access'] == 'kaizen')
            //this.updateLayout();
    });

    this.commonService._OnLayoutStatusReceivedSubject.subscribe((r) => {
        console.log(15346)
        let action = r['action'];
        if(action == 'folder-layout') {
            if(this.thumbView) {
                this.updateLayout();
            }
        }
    });
}

// Initialize Files
initDoc() {
    this.docInfoData.docData = this.items[0].docData;
    let dataId = this.items[0].resourceID;
    if(this.items[0].docData.expand == 1) {
        let data = {
            access: 'infocallback',
            docData: this.items[0].docData,
            flag: !this.panelFlag
        }
        //this.commonService.emitDocumentPanelFlag(data);
    } else {
        //this.docSelection(this.items, this.items[0]);
    }
}

iconClick(icon) {
    console.log(icon);
    let className = icon.target.className;
    let text = icon.target.innerText;
    let id = icon.target.id;
    let type = icon.target.title;
    let status: any;
    let itemIndex = this.items.findIndex(item => item.resourceID == id);
    let likeCount = this.items[itemIndex].likeCount;
    let pinCount = this.items[itemIndex].pinCount;
    let inc = 1;
    if (className.indexOf('active') != -1) { // Make inactive
        icon.target.className = className.replace(' active', "");
        if (type == "pin") { status = "dispined";  pinCount -= inc;}
        else if (type == "like") { status = "disliked"; likeCount -= inc;}
    } else { // Make active
        icon.target.className = className + " active";
        if (type == "pin") { status = "pined";  pinCount += inc;}
        else if (type == "like") { status = "liked";  likeCount += inc;}
    }
    this.items[itemIndex].likeCount = likeCount;
    this.items[itemIndex].pinCount = pinCount;
    this.items[itemIndex].docData.likeCount = likeCount;
    this.items[itemIndex].docData.pinCount = pinCount;
    //console.log(id, type, status, likeCount, pinCount)
    this.documentationService.addLikePins(this.userId, this.domainId, this.countryId, id, type, status).then((response: any) => {
    });
}

updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
        this.updateMasonryLayout = false;
    }, 500);
}

// Document Selection
docSelection(list, item) {
    let id = item.resourceID;
    let secElement = document.getElementById(id);
    setTimeout(() => {
        console.log(id, secElement.scrollTop)
      secElement.scrollTop = this.scrollPos;
    }, 200);
    for(let d of list) {
      d.selected = (parseInt(d.resourceID) == id) ? true : false;
    }
    console.log(list, this.panelFlag)
    let timeout = 100;
    setTimeout(() => {
      this.docInfoData.flag = true;
      this.docInfoData.access = 'files';
      this.docInfoData.action = 'load';
      this.docInfoData.docData = item.docData;
      this.apiData.dataId = id;
      this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
      this.commonService.emitDocumentPanelFlag(this.docInfoData);
      if(this.panelFlag) {
        //this.emitDocInfo(id);
      } else {
        //this.commonService.emitDocumentPanelFlag(this.docInfoData);
        this.panelFlag = true;
        if(this.thumbView)
            this.updateLayout();
      }
      let secHeight = document.getElementsByClassName('documents-thumb-view')[0].clientHeight;
      let listHeight = document.getElementsByClassName('file-list')[0].clientHeight;
      console.log(secHeight, listHeight)
    }, timeout);
}

actionClick(data,type){
  if(type == 'view'){
    if(this.myKaizen == '0' && (data.documentStatusId == '4' || data.documentStatusId == '5')){}
    else{
      let actionStatus = '3';
      let currentStatusName = "In-Process";
      let id = data.resourceID;
      let ownerId = data.submitedBy;
      let oldStatusId = data.documentStatusId;
      let oldStatusName = data.documentStatus;
      if(oldStatusId == '2' && this.myKaizen == '0'){

        let findex = this.items.findIndex(option => option.resourceID == id);
        if(findex >= 0) {
          this.items[findex].documentStatusId = actionStatus;
          this.items[findex].documentStatus = currentStatusName;
          this.items[findex].documentStatusBgColor = "rgb(45, 126, 218)";
        }

        let approveStatusData = new FormData();
        approveStatusData.append('apiKey', this.apiKey);
        approveStatusData.append('domainId', this.domainId);
        approveStatusData.append('countryId', this.countryId);
        approveStatusData.append('userId', this.userId);
        approveStatusData.append("statusId", actionStatus);
        approveStatusData.append("ownerId", ownerId);
        approveStatusData.append("currentStatusName", currentStatusName);
        approveStatusData.append("oldStatusName", oldStatusName);
        approveStatusData.append("oldStatusId", oldStatusId);
        approveStatusData.append("dataId", id);
        approveStatusData.append('contentTypeId', '4');
        //this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});
      }
      let navFrom = this.commonService.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' kaizen') ? false : true;
      let scrollTop:any = 0;
      localStorage.setItem('kaizenId', id);
      localStorage.setItem('kaizenIddetail', id);
      localStorage.setItem('kaizenInfoNav', 'true');
      this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      let nav = `kaizen/view/${id}`;
      this.router.navigate([nav]);
    }
  }
  else if(type == 'edit'){
    if(this.myKaizen == '1'){
      let id = data.resourceID;
      let navFrom = this.commonService.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' parts') ? false : true;
      let scrollTop:any = 0;
      localStorage.setItem('kaizenId', id);
      localStorage.setItem('kaizenIddetail', id);
      localStorage.setItem('kaizenInfoNav', 'true');
      this.commonService.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      let nav = `kaizen/manage/edit/${id}`;
      this.router.navigate([nav]);
    }
  }
  else{
    if(this.myKaizen == '1'){
      let id = data.resourceID;
      this.delete(id);
    }
  }
}


 // Delete Document
 delete(id) {
  const modalRef = this.modalService.open(
    ConfirmationComponent,
    this.modalConfig
  );
  modalRef.componentInstance.access = "Delete";
  modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
    modalRef.dismiss("Cross click");
    console.log(receivedService);
    if (receivedService) {
      let apiData = {
        apiKey: Constant.ApiKey,
        domainId: this.domainId,
        countryId: this.countryId,
        userId: this.userId,
        contentType: "4",
        dataId: id,
      };

      this.announcementService.deleteDocument(apiData).subscribe((response) => {
         let msg = response.result;
         this.msgs1 = [{severity:'success', summary:'', detail:msg}];
         this.primengConfig.ripple = true;

         let findex = this.items.findIndex(option => option.id == id);
          if(findex >= 0) {
            this.items.splice(findex, 1);
          }
          if(this.items.length == 0){
            this.emptyActionEmit.emit(true);
          }

          setTimeout(() => {
            this.msgs1 = [];
          }, 3000);

      });
    }
  });
}

actionStatus(data,type){

  if(type == 'approve' && this.kaizenAssigneeRoleId == '4'){
    document.body.classList.add(this.bodyClass3);
    const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.reminderPOPUP = "kaizen-notes";
    modalRef.componentInstance.titleTest = data.title;
    modalRef.componentInstance.resServices.subscribe((receivedService) => {
      if(receivedService){
        document.body.classList.remove(this.bodyClass3);
        modalRef.dismiss('Cross click');
        console.log(receivedService);
        data['commentNotes'] = receivedService;
        this.actionStatusCallAPI(data,type);
      }
    });
  }
  else{
    this.actionStatusCallAPI(data,type);
  }


}

actionStatusCallAPI(data,type){
  console.log(data);
  let id = data.id;
  let actionStatus = "";
  let currentStatusName = "";

  console.log(data);
  switch(type){
    case 'approve':
      actionStatus = '1';
      currentStatusName = "Approved";
      break;
    case 'submit':
      actionStatus = '2';
      currentStatusName = "Pending";
      break;
    case 'inprogress':
      actionStatus = '3';
      currentStatusName = "In-Process";
      break;
    case 'return':
      actionStatus = '4';
      currentStatusName = "Returned";
      break;
    case 'retract':
      actionStatus = '5';
      currentStatusName = "Retracted";
      break;
    case 'draft':
      actionStatus = '6';
      currentStatusName = "Draft";
      break;
    default:
      break;
  }

  let docOwner = '0' , oldStatusId = '', oldStatusName = '';
  if(this.userId == data.createdById){
    docOwner = '1';
  }
  oldStatusId = data.documentStatusId;
  oldStatusName = data.documentStatus;

  const apiFormData = new FormData();
  apiFormData.append("apiKey", this.apiKey);
  apiFormData.append("domainId", this.domainId);
  apiFormData.append("countryId", this.countryId);
  apiFormData.append("userId", this.userId);
  apiFormData.append("actionStatus", actionStatus);
  apiFormData.append("dataId", id);
  apiFormData.append("docOwner", docOwner);
  apiFormData.append("currentStatusName", currentStatusName);
  apiFormData.append("oldStatusName", oldStatusName);
  apiFormData.append("oldStatusId", oldStatusId);
  apiFormData.append("listId", this.listId);
  apiFormData.append("myKaizen", this.myKaizen);
  apiFormData.append("userType", this.kaizenUserType);
  apiFormData.append("assigneeRoleId", this.kaizenAssigneeRoleId);
  apiFormData.append("kaizenUserId", data.createdById);
  apiFormData.append("escalationLevel", data.escalationLevel);

  if(type == 'approve' && this.kaizenAssigneeRoleId == '4'){
    apiFormData.append("approvedStatus", actionStatus);
    apiFormData.append("commentNotes", data.commentNotes);
  }

  //new Response(apiFormData).text().then(console.log);
  //return false;

  this.landingpageService.kaizenApprovalStatusChangeAPI(apiFormData).subscribe((response) => {

    if (response.status == "Success") {

      console.log(response);

      let msg = response.result;
      this.msgs1 = [{severity:'success', summary:'', detail:msg}];
      this.primengConfig.ripple = true;
      setTimeout(() => {
        this.msgs1 = [];
      }, 3000);

      if(type == 'approve' ){

        let findex = this.items.findIndex(option => option.id == id);
        if(findex >= 0) {
          this.items[findex].documentStatusId = response.documentStatusId;
          this.items[findex].documentStatus = response.documentStatus;
          this.items[findex].documentStatusBgColor = response.documentStatusBgColor;
          this.items[findex].moreOption = response.moreOption;
        }

        let submitUser = data.submitedBy;
        console.log(submitUser);
        let groups:any, folders:any = [];
        let groupsArr=[], foldersArr= [];
        /*if(data.docWS.length>0){
          for (let i in data.docWS) {
            groupsArr.push(data.docWS[i].id);
          }
          groups = JSON.stringify(groupsArr);
        }
        if(data.docFolders.length>0){
          for (let j in data.docFolders) {
            foldersArr.push(data.docFolders[j].id);
          }
          folders = JSON.stringify(foldersArr);
        }*/

        let pushFormData = new FormData();
        pushFormData.append('apiKey', this.apiKey);
        pushFormData.append('domainId', this.domainId);
        pushFormData.append('countryId', this.countryId);
        pushFormData.append('userId', submitUser);
        pushFormData.append('approveUser', this.userId);
        pushFormData.append('approvalProcess', '1');
        pushFormData.append('groups', groups);
        pushFormData.append('folders', folders);
        pushFormData.append('contentTypeId', '4');
        let updatefl =  "0";
        pushFormData.append('updateFlag', updatefl);
        pushFormData.append('email', 'true');
        pushFormData.append('dataId', id);

        this.threadApi.documentNotification(pushFormData).subscribe((response) => {});

        if(this.kaizenAssigneeRoleId == '4'){
          let findex1 = this.items.findIndex(option => option.id == id);
          if(findex1 >= 0) {
            this.items.splice(findex, 1);
          }
          if(this.items.length == 0){
            this.emptyActionEmit.emit(true);
          }
        }
      }
      else{

        if(type == 'submit' || type == 'inprogress' || type == 'return' || type == 'retract'){
          let ownerId = data.submitedBy;
          let approveStatusData = new FormData();
          approveStatusData.append('apiKey', this.apiKey);
          approveStatusData.append('domainId', this.domainId);
          approveStatusData.append('countryId', this.countryId);
          approveStatusData.append('userId', this.userId);
          approveStatusData.append("statusId", actionStatus);
          approveStatusData.append("ownerId", ownerId);
          approveStatusData.append("currentStatusName", currentStatusName);
          approveStatusData.append("oldStatusName", oldStatusName);
          approveStatusData.append("oldStatusId", oldStatusId);
          approveStatusData.append("dataId", id);
          approveStatusData.append('contentTypeId', '4');
          //this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});
        }
        let findex = this.items.findIndex(option => option.id == id);
        if(findex >= 0) {
          this.items[findex].documentStatusId = response.documentStatusId;
          this.items[findex].documentStatus = response.documentStatus;
          this.items[findex].documentStatusBgColor = response.documentStatusBgColor;
        }
      }
      console.log(response);
    }
  });
}

// Document Selection
docListViewSelection(list) {
  /*
    let id = list.resourceID;
    let secElement = document.getElementById(id);
    setTimeout(() => {
        console.log(id, secElement.scrollTop)
      secElement.scrollTop = this.scrollPos;
    }, 200);
    for(let d of this.items) {
      d.selected = (parseInt(d.resourceID) == id) ? true : false;
    }
    console.log(this.items, this.panelFlag)
    let timeout = 100;
    setTimeout(() => {
      this.docInfoData.flag = true;
      this.docInfoData.access = 'files';
      this.docInfoData.action = 'load';
      this.docInfoData.docData = list.docData;
      this.apiData.dataId = id;
      this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
      this.commonService.emitDocumentPanelFlag(this.docInfoData);
      if(this.panelFlag) {
        //this.emitDocInfo(id);
      } else {
        //this.commonService.emitDocumentPanelFlag(this.docInfoData);
        this.panelFlag = true;
        if(this.thumbView)
            this.updateLayout();
      }
    }, timeout);
    */
}

// Emit Document Info
emitDocInfo(dataId) {
    this.docInfoData.loading = true;
    this.docInfoData.dataId = dataId;
    console.log(this.docInfoData)
    this.commonService.emitDocumentInfoData(this.docInfoData);
}


scroll = (event: any): void => {
    //console.log(event.target.id);
    //console.log(event.target.className);
    if(event.target.id=='documentList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
        this.scrollActionEmit.emit(event);
        event.preventDefault;
    }
}



}

