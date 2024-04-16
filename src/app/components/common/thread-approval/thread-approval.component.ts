import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Constant, forumPageAccess, ManageTitle, PlatFormType, statusOptions } from 'src/app/common/constant/constant';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { LandingpageService } from "src/app/services/landingpage/landingpage.service";
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { ThreadPostService } from 'src/app/services/thread-post/thread-post.service';
import { BaseService } from 'src/app/modules/base/base.service';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGConfig, Message, MessageService } from 'primeng/api';
import { Table } from "primeng/table";
import * as moment from 'moment';
import { ApiService } from '../../../services/api/api.service';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
declare var $: any;

@Component({
  selector: 'app-thread-approval',
  templateUrl: './thread-approval.component.html',
  styleUrls: ['./thread-approval.component.scss'],
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
export class ThreadApprovalComponent implements OnInit {

  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild("listDiv", { static: false }) listDiv: ElementRef;
  @Input() sortOrder: string = '';
  @Output() threadApprovalRef: EventEmitter<ThreadApprovalComponent> = new EventEmitter();
  @Output() callback: EventEmitter<ThreadApprovalComponent> = new EventEmitter();

  public bodyElem;
  public bodyClass: string = "landing-page";
  public bodyClass2: string = "submit-loader";
  public user: any;
  public userId: any;
  public roleId;
  public domainId;
  public countryId;
  public apiKey: any = Constant.ApiKey;
  public itemOffset: number = 0;
  public itemLimit: number = 15;
  public itemTotal: number;
  public itemLength: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number = 0;
  public contentTypeValue: any = 4;
  public scrollCallback: boolean = false;
  public items: any = [];
  public workstreamFilterArr: any = [];
  public approveProcess: any = [];
  public statusFilter: any = 0;
  public msgs: Message[];
  public scrollPos: number = 0;
  public secHeight: any = 0;
  public listHeight: any = 0;
  public threadApprovalFlag: boolean = false;
  public newThreadView: boolean = false;
  public loading: boolean = false;
  public lazyLoading: boolean = false;
  public nothingtoshow: boolean = false;
  public thumbView: boolean = false;
  public displayNoRecords: boolean = false;
  public collabticDomain: boolean = false;
  public innerHeight: number = window.innerHeight - 200;
  public sortStatus: any
  public sfsortOrder: any;
  public accessLevel : any = {view: true, create: true, edit: true, delete:true, reply: true, close: true};

  constructor(
    private probingApi: ProductMatrixService,
    private authenticationService: AuthenticationService,
    private landingPagewidgetsApi: LandingpageService,
    private commonApi: CommonService,
    private threadApi: ThreadService,
    private threadPostService: ThreadPostService,
    private baseSerivce: BaseService,
    private primengConfig: PrimeNGConfig,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    private location: PlatformLocation,
    private router: Router,
    public apiUrl: ApiService,
  ) {
    this.location.onPopState (() => {
      setTimeout(() => {
        if(!document.body.classList.contains(this.bodyClass)) {
          document.body.classList.add(this.bodyClass);
        }
      }, 600);
    });
  }

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

  ngOnInit(): void {
    window.addEventListener('scroll', this.listScroll, true);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = parseInt(this.user.roleId);
    this.checkAccessLevel();
    this.countryId = localStorage.getItem('countryId');
    this.threadApprovalFlag = (this.roleId == 3 || this.roleId == 2) ? true : false;
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;
    let platformId: any = localStorage.getItem('platformId');
    this.collabticDomain = (platformId == PlatFormType.Collabtic) ? true : false;
    this.secHeight = 135;
    this.listHeight = 190;
    this.sfsortOrder = this.sortOrder;
    console.log(this.sortOrder, this.sfsortOrder)
    let userWorkstreams=localStorage.getItem('userWorkstreams');
    if(userWorkstreams) {
      this.workstreamFilterArr=JSON.parse(userWorkstreams);
    }
    statusOptions.forEach(item => {
      let code = (item.code != '') ? parseInt(item.code) : item.code;
      if(code != '' && code < '6') {
        this.approveProcess.push(item.code);
      }
    });
    this.getApprovedSharedFixThreads();
  }

  checkAccessLevel(){
    let viewAccess = true, createAccess = true, editAccess = true,  deleteAccess = true, replyAccess = true, closeAccess = true;
    let chkType = '', chkFlag = true;
    this.authenticationService.checkAccess(2, chkType, chkFlag);
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
              case 5:
                replyAccess = (roleAccess == 1) ? true : false;
                break;
              case 6:
                closeAccess = (roleAccess == 1) ? true : false;
                break;
            }
          });

        }
        let defaultAccessLevel : any = {view: viewAccess, create: createAccess, edit: editAccess, delete:deleteAccess, reply: replyAccess, close: closeAccess};

        if(this.apiUrl.enableAccessLevel){
          this.accessLevel =  defaultAccessLevel.create != undefined ?  defaultAccessLevel : this.accessLevel;
        }
        else{
          this.accessLevel = this.accessLevel;
        }
        console.log(this.accessLevel)

      }, 500);
  }

  getApprovedSharedFixThreads(push: any = false, pushData: any = {}) {
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    if(this.itemOffset == 0 && !push) {
      this.loading = true;
    }
    let start = (push) ? 0 : this.itemOffset;
    let listing = 1;
    let query = '';
    let listAction = (push) ? pushData.action : 'list';
    let limit:any = (push) ? pushData.limit : this.itemLimit;
    let approveProcess = (this.statusFilter == 0) ? this.approveProcess : this.statusFilter;
    let FiltersArr = {
      domainId: this.domainId,
      workstreamsIds: this.workstreamFilterArr
    };
    if(push) {
      FiltersArr['threadId'] = pushData.threadId;
    }
    if(!this.threadApprovalFlag) {
      FiltersArr['userId'] = this.userId;
    }
    let apiData = {
      query,
      listing,
      rows: limit,
      start,
      type: 1,
      filters: FiltersArr
    };
    if(!push) {
      FiltersArr['approvalProcess'] = approveProcess;
      apiData['sortOrder'] = this.sfsortOrder;
    }
    this.landingPagewidgetsApi.getSolrDataDetail(apiData).subscribe((response) => {
      let responseData = response.threads;
      this.items = (this.itemOffset == 0) ? [] : this.items;
      responseData.forEach(item => {
        let submitedByDate = moment.utc(item.submitedDate).toDate();
        let localsubmitedByDate = moment(submitedByDate).local().format('MMM DD, YYYY h:mm A');
        item.submitedByDate = localsubmitedByDate;
        let updatedDate = moment.utc(item.approvalProcessDateStr).toDate();
        let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
        item.updatedOnMobile = (item.approvalProcessDateStr == '0000-00-00 00:00:00') ? '-' : localUpdatedDate;
        console.log(listAction)
        switch (listAction) {
          case 'list':
            this.items.push(item);
            break;
          case 'push':
            this.displayNoRecords = true;
            this.items.unshift(item);
            setTimeout(() => {
              this.displayNoRecords = false;
            }, 10);
            console.log(this.items)
            break;
          case 'update':
            let findex = this.items.findIndex(option => option.threadId == query);
            if(findex >= 0) {
              this.items[findex] = item;
            }
            break;
        }
      });
      console.log(responseData, this.items)
      this.itemLength += this.items.length;
      this.itemTotal = response.total;
      this.loading = false;
      this.lazyLoading = this.loading;
      if (response.total == 0 && this.itemOffset == 0) {
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
        this.itemOffset = this.itemOffset+limit;
        this.scrollCallback = true;
        this.scrollInit = 1;
        setTimeout(() => {
          if (!this.displayNoRecords) {
            let listItemHeight;
            if (this.thumbView) {
              listItemHeight = (document.getElementsByClassName("parts-grid-row")[0]) ? document.getElementsByClassName("parts-grid-row")[0].clientHeight + 50 : 0;
            } else {
              listItemHeight = (document.getElementsByClassName("p-datatable-scrollable-body")[0]) ? document.getElementsByClassName("p-datatable-scrollable-body")[0].clientHeight + 50 : 0;
            }
            console.log(responseData.length, this.items.length, this.itemTotal, this.innerHeight + "::" + listItemHeight);
            if (responseData.length > 0 && this.items.length != this.itemTotal && this.innerHeight >= listItemHeight) {
              this.scrollCallback = false;
              this.lazyLoading = true;
              this.getApprovedSharedFixThreads();
              this.lastScrollTop = this.scrollTop;
            }
          }
        }, 1500);
      }
      this.threadApprovalRef.emit(this);
      setTimeout(() => {
        this.callback.emit(this);
      }, 500);
    });
  }

  threadAction(data, action, type = '') {
    console.log(data)
    let id = data.threadId;
    let statusId = data.documentStatusId;
    console.log(statusId, this.threadApprovalFlag)
    switch(action) {
      case 'view':
        if(!this.threadApprovalFlag || (this.threadApprovalFlag && (statusId == '2' || statusId == '3'))) {
          let actionStatus = '3';
          let currentStatusName = "In-Process";
          let ownerId = data.submitedByStr;
          let oldStatusId = data.documentStatusId;
          let oldStatusName = data.documentStatus;
          if(this.threadApprovalFlag && oldStatusId == '2'){
            let findex = this.items.findIndex(option => option.threadId == id);
            if(findex >= 0) {
              this.items[findex].documentStatusId = actionStatus;
              this.items[findex].documentStatus = currentStatusName;
              this.items[findex].documentStatusBgColorStr = "rgb(45, 126, 218)";
            }
            this.actionStatus('inprogress', data);
          }
          let viewPath = (this.collabticDomain && this.domainId == 336) ? forumPageAccess.threadpageNewV3 : forumPageAccess.threadpageNewV2;
          let view = (this.newThreadView) ? viewPath : forumPageAccess.threadpageNew;
          let nav = `${view}${id}`;
          this.router.navigate([nav]);
        }
        break;
      case 'edit':
        let nav = `threads/manage/edit/${id}`;
        this.router.navigate([nav]);
        break;
      case 'delete':
        let industryType = this.commonApi.getIndustryType();
        let title:any = (industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : ManageTitle.thread;
        let platformId1 = localStorage.getItem("platformId");
        title = (platformId1=='3') ? ManageTitle.supportRequest : title;
        if(this.domainId==71 && platformId1=='1')
      {
        title=ManageTitle.supportServices
      }
      if(this.domainId==Constant.CollabticBoydDomainValue && platformId1=='1')
      {
        title=ManageTitle.techHelp;
      }
        title = `${title} #${id}`;
        const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
        modalRef.componentInstance.access = 'ThreadDelete';
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          console.log(receivedService);
          if(receivedService){
            this.delete(id, data.postId);
          }
        });

        break;
      case 'status':
        this.actionStatus(type, data);
        break;
    }
  }

  actionStatus(type, data) {
    let id = data.threadId;
    let actionStatus = "";
    let currentStatusName = "";
    let findex = this.items.findIndex(option => option.threadId == id);
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
      default:
        break;
    }

    let docOwner = '0' , oldStatusId = '', oldStatusName = '';
    docOwner = (this.userId == parseInt(data.submitedByStr)) ? '1' : docOwner;
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

    this.landingPagewidgetsApi.sharedFixApprovalStatusChangeAPI(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let apiDatasocial = new FormData();
        apiDatasocial.append('apiKey', Constant.ApiKey);
        apiDatasocial.append('domainId', this.domainId);
        apiDatasocial.append('threadId', id);
        apiDatasocial.append('userId', this.userId);
        apiDatasocial.append('action', 'update');
        apiDatasocial.append('actionType', '1');
        let platformIdInfo = localStorage.getItem('platformId');
        if(platformIdInfo=='1') {
          this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
        }
        let msg = response.result;
        let msgFlag = (actionStatus == '3' && this.threadApprovalFlag) ? false : true;
        if(msgFlag) {
          this.msgs = [{severity:'success', summary:'', detail:msg}];
          this.primengConfig.ripple = true;
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        switch(type) {
          case 'approve':
            let submitUser = data.submitedByStr;
            console.log(submitUser);
            let wsData = data.workstreamsIds;
            let groups:any = [];
            let groupsArr=[];
            if(wsData.length>0){
              for (let i in wsData) {
                groupsArr.push(wsData[i]);
              }
              groups = JSON.stringify(groupsArr);
            }
            let pushFormData = new FormData();
            pushFormData.append('apiKey', this.apiKey);
            pushFormData.append('domainId', this.domainId);
            pushFormData.append('countryId', this.countryId);
            pushFormData.append('userId', submitUser);
            pushFormData.append('approveUser', this.userId);
            pushFormData.append('approvalProcess', '1');
            pushFormData.append('groups', groups);
            pushFormData.append('contentTypeId', '2');
            pushFormData.append('makeName', data.genericProductName);
            pushFormData.append('threadId', id);
            pushFormData.append('postId', data.postId);
            this.threadApi.threadPush(pushFormData).subscribe((response) => {});
            if(findex >= 0) {
              this.items.splice(findex, 1);
            }
            if(this.items.length == 0){
              this.displayNoRecords = true;
            }
          break;
          case 'submit':
          case 'inprogress':
          case 'return':
          case 'retract':
            let ownerId = data.submitedByStr;
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
            approveStatusData.append('contentTypeId', '2');
            this.threadApi.documentApprovalNotification(approveStatusData).subscribe((response) => {});
            if(findex >= 0) {
              this.items[findex].documentStatusId = response.documentStatusId;
              this.items[findex].documentStatus = response.documentStatus;
              this.items[findex].documentStatusBgColorStr = response.documentStatusBgColor;
            }
            break;
        }
      }
    });
  }
// tab on user profile page
  taponprofileclick(userId){
    var aurl='profile/'+userId+'';
    window.open(aurl, aurl);
  }
  getUserProfileStatus(uid,index) {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', uid);
    this.probingApi.GetUserAvailability(apiFormData).subscribe((response) => {
      let resultData = response.items;
      let availability = resultData.availability;
      let availabilityStatusName = resultData.availabilityStatusName;
      let badgeTopUser = resultData.badgeTopUser;
      this.items[index].availability = availability;
      this.items[index].availabilityStatusName = availabilityStatusName;
      this.items[index].profileShow = true;
    });
  }

  // Delete Thread
  delete(threadId, postId) {
    let findex = this.items.findIndex(option => option.threadId == threadId);
    if(findex >= 0) {
      this.items.splice(findex, 1);
    }
    if(this.items.length == 0){
      this.displayNoRecords = true;
    }
    let accessPlatForm:any = 1;
    let apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', threadId);
    apiFormData.append('postId', postId);
    apiFormData.append('platform', accessPlatForm);
    this.threadPostService.deleteThreadPostAPI(apiFormData).subscribe(res => {
      let apiDatasocial = new FormData();
      apiDatasocial.append('apiKey', Constant.ApiKey);
      apiDatasocial.append('domainId', this.domainId);
      apiDatasocial.append('threadId', threadId);
      apiDatasocial.append('userId', this.userId);
      apiDatasocial.append('type', '1');
      apiDatasocial.append('action', 'delete');
      this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { })
      const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
      let successMsg = '';
      successMsg = 'Thread Deleted Successfully';
      msgModalRef.componentInstance.successMessage = successMsg;
      msgModalRef.dismiss('Cross click');
    });
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.listScroll(event);
  }

  listScroll = (event: any): void => {
    console.log(event)
    if(event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getApprovedSharedFixThreads();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }

  };
}
