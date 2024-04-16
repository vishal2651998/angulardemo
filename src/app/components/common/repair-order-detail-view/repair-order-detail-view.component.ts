import { Component, OnInit, HostListener, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ApiService } from 'src/app/services/api/api.service';
import { NgbModal,NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { RepairOrderService } from "src/app/services/repair-order/repair-order.service";
import { Constant,forumPageAccess, ContentTypeValues, RedirectionPage } from 'src/app/common/constant/constant';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { CommonService } from "../../../services/common/common.service";
import { BaseService } from 'src/app/modules/base/base.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { RepairOrderManageComponent } from 'src/app/components/common/repair-order-manage/repair-order-manage.component';
import { Subscription, concat } from "rxjs";
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-repair-order-detail-view',
  templateUrl: './repair-order-detail-view.component.html',
  styleUrls: ['./repair-order-detail-view.component.scss']
})
export class RepairOrderDetailViewComponent implements OnInit, OnDestroy{
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() roID;
  @Input() newPage;
  @Output() closeEventEmit: EventEmitter<any> = new EventEmitter();
  public loading: boolean = true;
  public user: any;
  public roleId;
  public platformId: number = 0;
  public domainId;
  public userId;
  public countryId;
  public ROViewData: any;
  public systemInfo: any;
  referenceAccordion: any;
  public emptyList = [];
  public emptyData: boolean = false;
  public pushThreadArrayNotification = [];
  
  public action = "view";
  public attachments: any;
  public attachmentLoading: boolean = true;
  public newThreadView: boolean = false;
  public bodyElem;
  public bodyClass3: string= "viewhistorypopup";
  public bodyClass: string = "repairorder-view";
  public bodyClass2: string = "submit-loader";
  public roPageData: any;
  public fuserDomain: boolean = false;
  public diagnationDomain: boolean = false;
  public initcomplaint: string = '';
  public billingfirstname: string = '';
  public billinglastname: string = '';
  public workstreamItems: any = [];
  public workStreamsData: any = []; 
  public repairOrderStatusModal: boolean = false;
  public commonOrderData: any = [];
  public viewHistoryFlag: boolean = false;
  public dialogPosition: string = 'top-right';
  public wooLastUpdatedOn: string = '';
  public wooHistoryResponse: any = [];
  subscription: Subscription = new Subscription();
  public innerHeight: number;
  public repairOrderApproveFlag: boolean = false;
  public repairOrderEditFlag: boolean = false;
  public repairOrderDeleteFlag: boolean = false;
  public description: string = '';
  public customerComplaint: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private repairOrderApi: RepairOrderService,
    private sanitizer: DomSanitizer,
    public apiUrl: ApiService,
    private commonApi: CommonService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    private baseSerivce: BaseService,
    private threadApi: ThreadService,
    private LandingpagewidgetsAPI: LandingpageService,
  ) { 
    modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';
  }
  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.newThreadView = localStorage.getItem('threadView') == '1' ? true : false;

    this.fuserDomain = this.domainId == '343' ? true : false;
    this.diagnationDomain = this.domainId == '338' ? true : false;
  
    this.referenceAccordion = [
      {
        id: "system",
        class: "system",
        title: "System",
        description: "",
        isDisabled: true,
        isExpanded: true
      }
    ];
    
    
    
    this.subscription.add(
      this.commonApi.roDetailDataReceivedSubject.subscribe((r) => {
        if(r['action'] == 'approve'){            
         
          this.bodyElem.classList.add(this.bodyClass2);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );
      const apiFormData = new FormData();      
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);

      let ws = '';
      let wsnew = '';
      var makeJSON = this.testJSON(this.ROViewData.workstreamsId);
      if(makeJSON){
        ws = JSON.parse(this.ROViewData.workstreamsId);
        wsnew = JSON.stringify(this.ROViewData.workstreamsId);
      }
      else{
        ws = this.ROViewData.workstreamsId;
        wsnew = JSON.stringify(this.ROViewData.workstreamsId);
      }

      apiFormData.append('worksteamId',wsnew );
      apiFormData.append('shopId', this.ROViewData.shopId);

      console.log(this.ROViewData.estimationData)
      let einfo = (this.ROViewData.estimationData) ? JSON.parse(this.ROViewData.estimationData) : '';
      let einfo1 = '';
      if(einfo != ''){
        console.log(einfo?.estimationArray?.length)
        einfo1 = einfo?.estimationArray?.length>0 ? JSON.stringify(einfo) : '';
      }
      apiFormData.append('estimationParams', einfo1);

      let cinfo = JSON.parse(this.ROViewData.contactInfo);
      apiFormData.append('contactInfo', JSON.stringify(cinfo));
      let tinfo = JSON.parse(this.ROViewData.technicianId)
      apiFormData.append('technicianId', JSON.stringify(tinfo));
      apiFormData.append('createdBy', this.ROViewData.userId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('workOrderId', this.ROViewData.id);
      apiFormData.append('requestType', this.ROViewData.requestType);
      apiFormData.append('businessName', this.ROViewData.businessInfo.name);
      apiFormData.append('vin', this.ROViewData.vin);     
      apiFormData.append('make', this.ROViewData.model_make);     
      apiFormData.append('model', this.ROViewData.model_name);     
      apiFormData.append('year', this.ROViewData.model_year);     
      apiFormData.append('odometer', this.ROViewData.odometer);     
      apiFormData.append('unit', this.ROViewData.unit);      
      apiFormData.append('orderNumber',  this.ROViewData.order_number);     
      apiFormData.append('productService',  this.ROViewData.product_service);     
      apiFormData.append('dnInvoice',  this.ROViewData.dn_invoice);

      apiFormData.append('dnInvoice',  this.ROViewData.dn_invoice);

      if(this.diagnationDomain){
        apiFormData.append('billingFirstName', this.ROViewData.billingFirstName); 
        apiFormData.append('billingLastName', this.ROViewData.billingLastName); 
        apiFormData.append('initComplaint', this.customerComplaint); 
      }
      apiFormData.append('description', this.description); 

      apiFormData.append('approved', "1"); 
      apiFormData.append('fromPublic', "0"); 
      apiFormData.append('editFlag', "1");

    //new Response(apiFormData).text().then(console.log)
    //return false;

      let pushFormData = new FormData();
      pushFormData.append('apiKey', Constant.ApiKey);
      pushFormData.append('domainId', this.domainId);    
      pushFormData.append('userId', this.userId);
      pushFormData.append('contentTypeId', ContentTypeValues.RepairOrder);
      pushFormData.append('groups', '');
      pushFormData.append('makeName', this.ROViewData.model_make);                  
      pushFormData.append('formWorkOrder', '1');

 


      this.repairOrderApi.updateSupportTicketsList(apiFormData).subscribe(res => {
        //console.log(res)
        modalRef.dismiss("Cross click");      
        this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){ 

          this.repairOrderApproveFlag = false;

          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = "Approved Successfully";
        
          
              let postId= res.data.postId;
              let threadId= res.data.threadId;
              let workOrderId = res.data.workOrderId;          
              pushFormData.append('threadId', threadId);
              pushFormData.append('postId', postId);  
              pushFormData.append('workOrderId', workOrderId);
              let apiDatasocial = new FormData();    
              apiDatasocial.append('apiKey', Constant.ApiKey);
              apiDatasocial.append('domainId', this.domainId);
              apiDatasocial.append('threadId', threadId);
              apiDatasocial.append('postId', postId);
              apiDatasocial.append('userId', this.userId); 
              apiDatasocial.append('action', 'create'); 
              apiDatasocial.append('actionType', '1');
              this.baseSerivce.postFormData("forum", "UpdateDatetoSolr", apiDatasocial).subscribe((response: any) => { });  
              //this.successFlag = true;
              this.threadApi.threadPush(pushFormData).subscribe((response) => {});
              //window.location.reload();
              setTimeout(() => { 
              msgModalRef.dismiss('Cross click');
              this.loading = true;
              this.getRepairOrderDetail();
              var data = {
                action : 'refresh',
                id: workOrderId
              }
              this.commonApi.updateROData(data);
            }, 2000);
          //}
        }
        else{
          //window.location.reload();
        }

         

      },
      (error => {
        
      }) 
      ); 

        }
        if(r['action'] == 'complete'){            
          
          this.bodyElem.classList.add(this.bodyClass2);
      /*const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );
      */
      const msgModalRef1 = this.modalService.open(SuccessModalComponent, this.modalConfig);
      
      if(this.ROViewData.completeStatusMessage)
      {
        msgModalRef1.componentInstance.successMessage = this.ROViewData.completeStatusMessage; 
      }
      else
      {
        msgModalRef1.componentInstance.successMessage = 'Sending data to Woocommerce ..'; 
      }
     
      setTimeout(() => { 

      const apiFormData = new FormData();      
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);      
      apiFormData.append('userId', this.userId);
      apiFormData.append('workOrderId', this.ROViewData.id);
      
      //new Response(apiFormData).text().then(console.log)
      //return false;

      this.repairOrderApi.completeSupportTicket(apiFormData).subscribe(res => {
        console.log(res)
       // modalRef.dismiss("Cross click");      
        this.bodyElem.classList.remove(this.bodyClass2);
        if(res.status=='Success'){          
          msgModalRef1.dismiss('Cross click');
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = res.message; 
         
              setTimeout(() => { 
              msgModalRef.dismiss('Cross click');
             
              this.loading = true;
              this.getRepairOrderDetail();
              var data = {
                action : 'refresh',
                id: this.ROViewData.id
              }
              this.commonApi.updateROData(data);
            }, 1500);
          //}
        }
        else{
          //window.location.reload();
        }

         

      },
      (error => {
        
      }) 
      ); 
    },1000);
        }
        if(r['action'] == 'order-detail'){ 
          this.checkStatus();
        }
        if(r['action'] == 'delete'){ 
          this.deleteConfirmRepairOrderModal();
        }
        if(r['action'] == 'edit'){
          this.openEditRepairOrderPOPUP();
        }
      })
    );

    this.getWorkstreamLists();
    setTimeout(() => {
      this.getRepairOrderDetail();
    }, 100);
    

  }


visibilitychange() {
    console.log('PushCheck');
    
  //let type1=0;
  let type1=1;
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log(event.data.data);
      let backgroundPush=1;
      let threadInfo=event.data.data;
      if(threadInfo.postId)
  {
    this.pushThreadArrayNotification.push(threadInfo.workOrderId);
  }
      this.showNotificationData(event.data.data,backgroundPush);
      setTimeout(() => {
        this.pushThreadArrayNotification=[];
      }, 1000);
      return false;
    });
  }

  showNotificationData(data,backgroundPush)
  {
    let workOrderId=data['workOrderId'];
    if(workOrderId==this.roID)
    {
      //this.getRepairOrderDetail();
    }
    else
    {
     // this.getRepairOrderDetail();
    }
  }
  checkStatus(){
   
    let wheight = window.innerHeight;
    this.innerHeight = (wheight - 157 );
          
      this.bodyElem.classList.add(this.bodyClass2);
  const modalRef = this.modalService.open(
    SubmitLoaderComponent,
    this.modalConfig
  );
  const apiFormData = new FormData();      
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);      
  apiFormData.append('userId', this.userId);
  apiFormData.append('workOrderId', this.ROViewData.id);
  apiFormData.append('orderId', this.ROViewData.order_number);
    
  //new Response(apiFormData).text().then(console.log)
  //return false;

  this.repairOrderApi.wooCompleteSupportTicket(apiFormData).subscribe(res => {
    console.log(res)
    modalRef.dismiss("Cross click");      
    this.bodyElem.classList.remove(this.bodyClass2);
    if(res.status=='Success'){
      
      this.repairOrderStatusModal = true;
     
      this.commonOrderData =(res.data.items);
      this.commonOrderData = (this.commonOrderData);
      console.log(this.commonOrderData);
      
    }
    else{
      //window.location.reload();
    }
  },
  (error => {
    
  }) 
  ); 

    
  }

       // Get Workstream Lists
       getWorkstreamLists() {
        let type: any = "1";
        let contentTypeId: any = "2";
        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('type', type);
        apiFormData.append('contentTypeId', contentTypeId);
        this.LandingpagewidgetsAPI.getWorkstreamLists(apiFormData).subscribe(
          (response) => {
            let resultData = response.workstreamList;          
            this.workstreamItems= [];
            for (let ws of resultData) {
              this.workstreamItems.push({
                id: ws.id,
                name: ws.name,
              });
            } 
            console.log(this.workstreamItems) 
                        
          }
        );
      }

  getRepairOrderDetail(){
    let formData = new FormData();
    formData.append('apiKey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('id', this.roID);
    this.repairOrderApi.getWorkOrderList(formData).subscribe(response => {    
      console.log(response);  
      if(response.data.total == 0){
        this.emptyData = true;
      }
      else{
      this.ROViewData = response.data.items[0];
        
      this.repairOrderApproveFlag = this.ROViewData.approved == 0 && this.roleId == 3 ? true : false;
      let ownerId = (this.ROViewData.contactDetailInfo && this.ROViewData.contactDetailInfo[0].userId) ? this.ROViewData.contactDetailInfo[0].userId : '';
      this.repairOrderEditFlag = this.roleId == 3 || this.userId == ownerId ? true : false;
      this.repairOrderDeleteFlag = this.roleId == 3 || this.userId == ownerId ? true : false;

      let data = {
        action: 'access',
        threadOwnerAccess: true,
        editAccess: this.repairOrderEditFlag,
        deleteAccess: this.repairOrderDeleteFlag,
        approveBtnEnable: this.repairOrderApproveFlag
      }
      this.closeEventEmit.emit(data); 

      if(this.ROViewData.createdOn !='0000-00-00 00:00:00'){
        let createdOn = moment.utc(this.ROViewData.createdOn).toDate(); 
        this.ROViewData.requestedDate = moment(createdOn).local().format('MMM DD, YYYY h:mm A');
      }
      else{
        this.ROViewData.requestedDate = "-";
      }

      if(this.ROViewData.createdOn !='0000-00-00 00:00:00'){
        let createdOn = moment.utc(this.ROViewData.createdOn).toDate(); 
        this.ROViewData.createdOn = moment(createdOn).local().format('MMM DD, YYYY h:mm A');
      }
      else{
        this.ROViewData.createdOn = "-";
      }

      if(this.diagnationDomain){
        if(this.ROViewData.wooStatusText !='' && this.ROViewData.wooStatusText != undefined){}
        else{
          this.ROViewData.wooStatusText = '';
        }
        if(this.ROViewData.wooLastUpdatedOn !='' && this.ROViewData.wooLastUpdatedOn != undefined){
          let wooLastUpdatedOn = moment.utc(this.ROViewData.wooLastUpdatedOn).toDate(); 
          this.ROViewData.wooLastUpdatedOn = moment(wooLastUpdatedOn).local().format('MMM DD, YYYY h:mm A');
          this.wooLastUpdatedOn = this.ROViewData.wooLastUpdatedOn;
        }
        else{
          this.ROViewData.wooLastUpdatedOn = "";
          this.wooLastUpdatedOn = this.ROViewData.wooLastUpdatedOn;
        }
        this.wooHistoryResponse = [];
        if(this.ROViewData.wooHistoryResponse){
          if(this.ROViewData.wooHistoryResponse.length>0){
            let wooResponseMessage = '';
            let wooCreatedOn = '';
            let wooMessage = '';
            for(let whr in this.ROViewData.wooHistoryResponse){  
              wooResponseMessage = this.ROViewData.wooHistoryResponse[whr].wooResponseMessage != '' ? this.ROViewData.wooHistoryResponse[whr].wooResponseMessage : ''; 
              if(this.ROViewData.wooHistoryResponse[whr].createdOn !='' && this.ROViewData.wooHistoryResponse[whr].createdOn != undefined && this.ROViewData.wooHistoryResponse[whr].createdOn != null){
                let wooLastUpdatedOn = moment.utc(this.ROViewData.wooHistoryResponse[whr].createdOn).toDate(); 
                wooCreatedOn = moment(wooLastUpdatedOn).local().format('h:mm A, MMM DD, YYYY');
              }
              wooMessage = wooCreatedOn != '' ?  `${wooResponseMessage} at ${wooCreatedOn}` : `${wooResponseMessage}`;
              this.wooHistoryResponse.push(wooMessage)
            }               
          }
        }
      }      

      if(this.ROViewData.contactDetailInfo?.length>0){
        this.ROViewData.contactDetailInfoArr=[];
        for(let cdi in this.ROViewData.contactDetailInfo){  
          let firstName = this.ROViewData.contactDetailInfo[cdi].firstName != undefined && this.ROViewData.contactDetailInfo[cdi].firstName != '' && this.ROViewData.contactDetailInfo[cdi].firstName != null ? this.ROViewData.contactDetailInfo[cdi].firstName : ''; 
          let lastName = this.ROViewData.contactDetailInfo[cdi].lastName != undefined && this.ROViewData.contactDetailInfo[cdi].lastName != '' && this.ROViewData.contactDetailInfo[cdi].lastName != null ? this.ROViewData.contactDetailInfo[cdi].lastName : ''; 
          let email = this.ROViewData.contactDetailInfo[cdi].email != undefined && this.ROViewData.contactDetailInfo[cdi].email != '' && this.ROViewData.contactDetailInfo[cdi].email != null ? ", "+this.ROViewData.contactDetailInfo[cdi].email : ''; 
          let phone = this.ROViewData.contactDetailInfo[cdi].phone != undefined && this.ROViewData.contactDetailInfo[cdi].phone != '' && this.ROViewData.contactDetailInfo[cdi].phone != null ? ", "+this.ROViewData.contactDetailInfo[cdi].phone : ''; 
          this.ROViewData.contactDetailInfo[cdi].name = '';
          this.ROViewData.contactDetailInfo[cdi].info = '';
          if(firstName != '' || lastName != '' || email != '' || phone != ''){            
            this.ROViewData.contactDetailInfo[cdi].name = firstName+" "+lastName; 
            this.ROViewData.contactDetailInfo[cdi].info = firstName+" "+lastName+email+phone; 
            this.ROViewData.contactDetailInfoArr.push(this.ROViewData.contactDetailInfo[cdi].info);
          }                   
        }
        console.log(this.ROViewData.contactDetailInfoArr);
      }

      if(this.ROViewData.technicanInfo?.length>0){
        for(let cdi in this.ROViewData.technicanInfo){          
          let firstName = this.ROViewData.technicanInfo[cdi].firstName != '' ? this.ROViewData.technicanInfo[cdi].firstName : ''; 
          let lastName = this.ROViewData.technicanInfo[cdi].lastName != '' ? this.ROViewData.technicanInfo[cdi].lastName : ''; 
          let email = this.ROViewData.technicanInfo[cdi].email != '' ? ", "+this.ROViewData.technicanInfo[cdi].email : ''; 
          let phone = this.ROViewData.technicanInfo[cdi].phone != '' ? ", "+this.ROViewData.technicanInfo[cdi].phone : ''; 
          this.ROViewData.technicanInfo[cdi].info = firstName+" "+lastName+email+phone;
          this.ROViewData.technicanInfo[cdi].name = firstName+" "+lastName;
        }        
      }
      let einfo = this.ROViewData.estimationData != '' ? JSON.parse(this.ROViewData.estimationData) : '';
      
      
      this.roPageData = {
        access: "view",
        fromaccess: 'repairorder-list',
        contentType: ContentTypeValues.RepairOrder,
        id: this.roID,
        estimationData: einfo        
      }

      console.log(this.ROViewData.technicanInfo);
      this.ROViewData.makeVal = this.ROViewData.model_make+'<i class="pi pi-chevron-right" style="font-size: 11px; vertical-align: text-top; margin-top: 0px;margin-left:12px;"></i>'+this.ROViewData.model_name+'<i class="pi pi-chevron-right" style="font-size: 11px; vertical-align: text-top; margin-top: 0px;margin-left:12px;"></i>'+this.ROViewData.model_year;
      let content = '';     
      if(this.ROViewData.description!='') {       
      content = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.ROViewData.description));
      this.description = content;
      }
      if(this.diagnationDomain){
        if(this.ROViewData.customerComplaint!='') {    
        let customerComplaint = '';              
        customerComplaint = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.ROViewData.customerComplaint));
        //this.ROViewData.customerComplaint = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(customerComplaint)); 
        this.customerComplaint = customerComplaint;
        } 
      }
    
      let userInfo = {};
      
      let createdBy = this.ROViewData.contactDetailInfo[0].name != '' ? this.ROViewData.contactDetailInfo[0].name : "-";

      userInfo = {
        createdBy: createdBy,
        createdOn: this.ROViewData.createdOn,
        updatedBy: "-",
        updatedOn: "-",               
      };
      console.log(this.workstreamItems);
      let itemwsid = this.ROViewData.workstreamsId != '' ? (this.ROViewData.workstreamsId) : '';
      if(itemwsid != ''){
        console.log(itemwsid);
        this.workStreamsData = [];
        for (let ws of this.workstreamItems) {
          for (let itemws of itemwsid) {
            console.log(itemws);
            if(ws.id == itemws){
              this.workStreamsData.push({
                id: ws.id,
                name: ws.name,
              });
            }
          }
        }       
      } 

    
    
    console.log(this.workStreamsData);

      this.systemInfo = {
        header: false,
        workstreams: this.workStreamsData,
        userInfo: userInfo
      }; 

      this.attachments = this.ROViewData["uploadContents"];
      this.attachmentLoading = this.attachments.length > 0 ? false : true;
    }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  
  }

  beforeParentPanelOpened(panel, appData){
    panel.isExpanded = true;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = true;
      }
    }
    console.log("Panel going to  open!");
  }
  
  beforeParentPanelClosed(panel, appData) {
    panel.isExpanded = false;
    if(panel.id == 'app-info') {
      for(let v of appData) {
        v.isExpanded = false;
      }
    }
  }

  afterPanelClosed(){
    console.log("Panel closed!");
  }
  
  afterPanelOpened(){
    console.log("Panel opened!");
  }

  gotoThreadsPage(threadId){
    let view = (this.newThreadView) ? forumPageAccess.threadpageNewV2 : forumPageAccess.threadpageNew;
    let aurl = `${view}${threadId}`;
    let item = `${threadId}-new-tab`;
    localStorage.setItem(item, item);
    window.open(aurl, aurl);
  }

  viewHistorysideMenu(){
    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.add("viewhistorypopup");
    this.viewHistoryFlag = true;
  }
  closeSidebar(){
    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.remove("viewhistorypopup");
    this.viewHistoryFlag = false;
  }

  openEditRepairOrderPOPUP(){
    this.bodyElem = document.getElementsByTagName('body')[0];   
    if(!document.body.classList.contains('view-modal-popup')) {
      document.body.classList.add('view-modal-popup');
    }
    if(!document.body.classList.contains('view-modal-popup-manage')) {
      document.body.classList.add('view-modal-popup-manage');
    }
    if(!document.body.classList.contains("landing-page")) {
      document.body.classList.add("landing-page");
    }    
    const modalRef = this.modalService.open(RepairOrderManageComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.workOrderPage = 'view-page';
    modalRef.componentInstance.workOrderType = 'edit';
    modalRef.componentInstance.workOrderId = this.roID;
    modalRef.componentInstance.ROManageService.subscribe((receivedService) => {
      console.log(receivedService);
      if(receivedService['action'] == 'update'){ 
        if(this.newPage == '1'){      
            this.loading = true;
            this.getRepairOrderDetail();            
        }
        else if(this.newPage == '0'){    
          setTimeout(() => {            
            this.loading = true;
            this.getRepairOrderDetail();
            var data = {
              action : 'edit',
              id: this.roID
            }
            this.commonApi.updateROData(data);
          }, 2000);
        }
      }
      else{}
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove("landing-page");    
      this.bodyElem.classList.remove("view-modal-popup");    
      this.bodyElem.classList.remove('view-modal-popup-manage');
    });
  
  }
  
  deleteConfirmRepairOrderModal(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Delete';
    modalRef.componentInstance.title = "Delete RO";
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService);
      if(receivedService){
        this.deleteRepairOrderModal();
      }
    });    
  }


  deleteRepairOrderModal(){

    this.bodyElem.classList.add(this.bodyClass2);
    const modalRef = this.modalService.open(
      SubmitLoaderComponent,
      this.modalConfig
    );

    let formData = new FormData();
    formData.append('apiKey', Constant.ApiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('workOrderId', this.roID);
    this.repairOrderApi.deleteSupportTicketsList(formData).subscribe(response => {
      console.log(response);
      
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass2);

      if (response.status == "Success") {

        let successMsg = response.message;

          const msgModalRef = this.modalService.open(
            SuccessModalComponent,
            this.modalConfig
          );
          msgModalRef.componentInstance.successMessage = successMsg;
          setTimeout(() => {
            let data = {
              action: 'close'
            }
            this.closeEventEmit.emit(data); 
            //if(this.newPage == "0"){
              msgModalRef.dismiss("Cross click");
              successMsg = "";
            //}
          }, 2000);
          }
      
    });

  }

  onChange(type){
    console.log(type);
    console.log(this.description);
  }

  testJSON(text){
    if (typeof text!=="string"){
        return false;
    }
    try{
        var json = JSON.parse(text);
        return (typeof json === 'object');
    }
    catch (error){
        return false;
    }
  }

  viewBusinessDetail(id) {
    let url = `${RedirectionPage.Customers}/${id}`;
    let navHome = window.open(url, url);
    navHome.focus();
  }

  ngOnDestroy() {
    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.remove("thread-detail");
    this.bodyElem.classList.remove("view-modal-popup");   
    this.bodyElem.classList.remove("repairorder");   
    this.bodyElem.classList.remove("viewhistorypopup");
    this.subscription.unsubscribe();
  }

}
