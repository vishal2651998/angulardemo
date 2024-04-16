import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common/common.service';
import { Constant,IsOpenNewTab,windowHeight } from '../../../common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { AnnouncementService } from '../../../services/announcement/announcement.service';
import { ApiService } from '../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { ProductMatrixService } from '../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../services/thread/thread.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @Input() public mediaServices;
  @Input() public updatefollowingResponce;

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyElem;
  public title:string = 'Announcement View';
  public loading:boolean = true;  
  public threadViewErrorMsg;
  public threadViewError;
  public threadViewData:any;
  public dataId;
  public headerData:any;
  public threadData:any;
  public rightPanel: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;   
  public platformId: number = 0;
  public domainId;
  public userId;  
  public countryId;
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public displayOrder: number = 0;
  public roleId;
  public apiData: Object;
  public user: any;  

  public threadUserId: number = 0;
  public threadOwner: boolean =false;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public userRoleTitle: string = '';
  public navUrl: string ='';
  public viewAncInterval: any;

  public dashboard: string = 'thread-dashboard';
  public dashboardTab: string = 'views';
  public updateBtnFlag: boolean = false;
  public updateAnnouncement: boolean = false;
  public contentType: string = '';
  public anncType: string = '';
  public navSection: string = '';
  public anncReadUpdate: boolean = false;
  public bodyClass2: string = "submit-loader";
  public teamSystem = localStorage.getItem('teamSystem');

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }

  constructor(
    private titleService: Title,
    private route: ActivatedRoute, 
    private router: Router,
    private commonApi: CommonService,   
    private authenticationService: AuthenticationService, 
    private announcementService: AnnouncementService,
    private apiUrl: ApiService, 
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService,
  ) { this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title); }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.add(this.bodyClass); 
    this.bodyElem.classList.add(this.bodyClass1);    

    this.route.params.subscribe( params => {
      this.dataId = params.id;
    });   
   
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    console.log(this.countryId);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();  

    this.getAncInfo();

    let anntype = localStorage.getItem('annType');
    if(anntype!=null && anntype!='null'){
      this.anncType = anntype;
      console.log(this.anncType);
      switch(this.anncType) {
        case 'dismiss':
          this.navSection = 'dismissed';
          break;
        default:
          this.navSection = this.anncType;  
      }
    }

    if(!this.teamSystem) {
      setTimeout(() => {
        this.viewAncInterval = setInterval(() => {
          let viewAncWidget = localStorage.getItem('viewAnc');
          if (viewAncWidget) {
            console.log('in view');
            this.loading = true;
            this.getAncInfo();
            localStorage.removeItem('viewAnc');
          }
        }, 50)
      },1500);
    }

  }
  
  getAncInfo(){  
  this.threadViewErrorMsg = '';  
  this.threadViewError = false; 
 
  const apiFormData = new FormData();
  
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('dataId', this.dataId);
  apiFormData.append('platform', '3');

  this.announcementService.getAnnouncementDetail(apiFormData).subscribe(res => {
    
    if(res.status=='Success'){
      
        this.threadViewData = res.data.thread[0]; 
        console.log(this.threadViewData);

        if( this.threadViewData == 'undefined' || this.threadViewData == '' || this.threadViewData == undefined  ){
          this.loading = false;
          this.threadViewErrorMsg = res.result;  
          this.threadViewError = true;  
        }
        else{
          this.threadViewData = res.data.thread[0];        
          if(this.threadViewData != ''){ 

            this.contentType = this.threadViewData.contentType;

            // give access to Thread Edit, Delete
            let access = false;
            if(( ( this.roleId=='3' || this.roleId=='10' ) && this.threadViewData.isActive == '1')){
              access = true;
            }

            this.headerData = {
              'pageName': 'announcement',
              'threadId': this.dataId,
              'threadStatus': '',
              'threadStatusBgColor': '',
              'threadStatusColorValue': '',
              'threadOwnerAccess': access,                
              'editAccess': access,                
              'deleteAccess': access,                
              'reopenThread': '',
              'closeThread': '',
              'navSection': this.navSection
            };
            this.loading = false;    
              
          } 
          else{
            this.loading = false;
            this.threadViewErrorMsg = res.result;  
            this.threadViewError = true;       
          }
        }
   }
   else{
     this.loading = false;    
     this.threadViewErrorMsg = res.result;  
     this.threadViewError = true;   
   }
              
 },
 (error => {
   this.loading = false;  
   this.threadViewErrorMsg = error;
   this.threadViewError = '';       
 })
 );
}
// Set Screen Height
setScreenHeight() { 
  this.innerHeight = (this.bodyHeight - 157 );       
}
 // thread delete confirm
 /*threadDeleteConfirm(){   
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'ThreadDelete';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      console.log(receivedService);
      if(receivedService){
        this.deleteThreadPost('thread',0);
      }
    });  
 }*/

  
  // thread closed
  /*deleteThreadPost(type, id){
    this.threadViewErrorMsg = '';  
    this.threadViewError = true;     
    const apiFormData = new FormData();

    let thread_id;
    let post_id;

    if(type == 'thread'){
      thread_id = this.threadViewData.dataId;
      post_id = this.threadViewData.postId;
    }
    else{
      thread_id = this.threadViewData.dataId;
      post_id = id;
    }

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('dataId', thread_id);
    apiFormData.append('postId', post_id);
  
    this.threadPostService.deleteThreadPostAPI(apiFormData).subscribe(res => {      
        if(res.status=='Success'){
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          let successMsg = '';
          if(type == 'thread'){
            successMsg = 'Thread Deleted Successfully';
          }
          else{
            successMsg = 'Post Deleted Successfully'
          }
          msgModalRef.componentInstance.successMessage = successMsg;
          setTimeout(() => {    
            msgModalRef.dismiss('Cross click'); 
            if(type == 'thread'){
              window.close(); 
              window.opener.location.reload(); 
            }            
          }, 1500);  
        }
        else{         
          this.threadViewErrorMsg = res.result;  
          this.threadViewError = true; 
        }              
      },
      (error => {        
        this.threadViewErrorMsg = error;
        this.threadViewError  = true;  
      })
    );
  }*/


  // Get Uploaded Items
  attachments(items) {  
    console.log(items);
    this.uploadedItems = items;
  }  

  //checkbox toggle
  checkboxToggle(flag){
    this.updateBtnFlag = flag ? false:true;    
  }
  
  // update announcement
  updateAccouncement(){
    this.updateAnnouncement = true;
    this.bodyElem.classList.add(this.bodyClass2);
    const submitModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    const apiFormData = new FormData();
    
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('dataId', this.dataId);
    apiFormData.append('type', this.contentType);

     this.announcementService.dismissManuals(apiFormData).subscribe(res => {   
      submitModalRef.dismiss('Cross click'); 
      this.bodyElem.classList.remove(this.bodyClass2);
      if(res.status=='Success'){
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = "Announcement Dismissed";
          setTimeout(() => {    
            msgModalRef.dismiss('Cross click'); 
            //localStorage.setItem('annType','dismiss'); 
            this.anncReadUpdate = true;        
            this.navUrl = 'announcements/dismissed';
            //window.open(this.navUrl, this.navUrl);         
            if(this.teamSystem) {
              window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
            }
            else{
              window.close(); 
            }
          // window.opener.location = 'landing-page';         
          //  window.opener.location.reload();  
          }, 1000);
        }                   
      }, (error => {        
        console.log(error);
      })
    );
  }

  // header event tab/click
  threadHeaderAction(event){
    switch (event){     
      case 'delete':
        this.removeArchiveAccouncement();
        break;      
    }
  }

    // remove announcement
    removeArchiveAccouncement(){
      this.bodyElem.classList.add(this.bodyClass2);
      const submitModalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
      const apiFormData = new FormData();      
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('dataId', this.dataId);
      apiFormData.append('type', 'announcements');
  
       this.announcementService.archiveAnnouncement(apiFormData).subscribe(res => { 
        submitModalRef.dismiss('Cross click');  
        this.bodyElem.classList.remove(this.bodyClass2); 
        if(res.status=='Success'){
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = res.result;
            setTimeout(() => {
              msgModalRef.dismiss('Cross click'); 
              if(this.teamSystem) {
                localStorage.setItem('announcementArchiveView', 'archive');
                localStorage.setItem('announcementcView', 'archive');
                window.open('announcements/archive', IsOpenNewTab.teamOpenNewTab);
              }
              else{
                window.close(); 
              }
                //localStorage.setItem('announcementArchiveView', 'archive');
                //localStorage.setItem('announcementcView', 'archive');
                //setTimeout(() => {   
                 // window.close();             
                  //window.opener.location.reload();                  
                //}, 600);
              
            }, 1000);
          }                   
        }, (error => {        
          console.log(error);
        })
      );
    }
    
  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
  }
  
}