import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "../../../services/common/common.service";
import { Constant, ContentTypeValues } from "../../../common/constant/constant";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { Title } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalComponent } from "../../../components/common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../components/common/submit-loader/submit-loader.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { KnowledgeArticleService } from "src/app/services/knowledge-article/knowledge-article.service";
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-view-ro-detail',
  templateUrl: './view-ro-detail.component.html',
  styleUrls: ['./view-ro-detail.component.scss']
})
export class ViewRoDetailComponent implements OnInit, OnDestroy {
  @Input() repairOrderId;
  @Output() KAServices: EventEmitter<any> = new EventEmitter();
  @Output() roActionEmit: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string = "thread-detail";
  public bodyClass1: string = "landing-page";
  public bodyElem;
  public title: string = "Repair Order Details";
  public user: any;
  public roleId;
  public platformId: number = 0;
  public domainId;
  public userId;
  public countryId;
  public navUrl: string = "";
  public action = "view";
  public contentType ='';
  public industryType: any = "";
  public innerHeight: number;
  public bodyHeight: number; 
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public successMsg: string = "";
  public copiedModal: boolean = false;
  public viewDocument: boolean = true;
  public repairOrderEditFlag: boolean = false;
  public repairOrderDeleteFlag: boolean = false;
  public threadOwnerAccess: boolean = false;
  public repairOrderApproveFlag: boolean = false;
  public roID: string = '';
  public newPage: string = '0';
  public approveButton: boolean = true;

  constructor(
    private titleService: Title,    
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private knowledgeArticleService: KnowledgeArticleService,
    private modalService: NgbModal,
    public apiUrl: ApiService,
  ) { }

  ngOnInit(): void {


    this.bodyElem = document.getElementsByTagName('body')[0];  

    if(!document.body.classList.contains(this.bodyClass)) {
      document.body.classList.add(this.bodyClass);
    }

    if(!document.body.classList.contains(this.bodyClass1)) {
      document.body.classList.add(this.bodyClass1);
    }

    if(!document.body.classList.contains('view-modal-popup')) {
      document.body.classList.add('view-modal-popup');
    }
    this.industryType = this.commonApi.getIndustryType();
    //this.title = `${this.title}${this.knowledgeArticleId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.navUrl = "Repair Order Details/view/" + this.repairOrderId;
    this.roID = this.repairOrderId;
    
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');    
    this.setScreenHeight();
  }

   // Set Screen Height
   setScreenHeight() {  
    this.bodyHeight = window.innerHeight;  
    this.innerHeight = (this.bodyHeight - 87 );  
  } 

  threadHeaderAction(event) {
    this.checkAccess(event);
  }

  checkAccess(type){
    switch(type){
      case 'edit':
        this.edit();
        break;
      case 'approve':
      case 'complete':
      case 'order-detail':
      case 'delete':
        if(type == 'approve'){
          this.repairOrderApproveFlag = false;
        }
        let data = {
          action: type,
          id: this.repairOrderId      
        }
        this.commonApi.emitRODetailData(data);
        break;
      case 'copylink':
        let currentURL1 = window.location.href;
        let currentURL2 = this.router.url;
        let currentURL3 = currentURL1.replace(currentURL2,"")
        console.log(currentURL3);
        let url = currentURL3+"/repair-order/view/"+this.repairOrderId;
        navigator.clipboard.writeText(url);
        this.copiedModal = true;
        setTimeout(() => {
          this.copiedModal = false;
        }, 1500);
        break;
      default:
        break;
    }
  }

  closeModal() {
    let data = {
      action: false
    };
    this.KAServices.emit(data);
  }

  popupClose(event){
    let action = event['action'];
    switch (action){
      case 'close':
        let data = {
          action: 'delete',
          id: this.repairOrderId
        }
        this.KAServices.emit(data);
      break;
      case 'access':
        this.threadOwnerAccess = event['threadOwnerAccess'];
        this.repairOrderEditFlag = event['editAccess'];
        this.repairOrderDeleteFlag = event['deleteAccess'];
        this.repairOrderApproveFlag = event['approveBtnEnable'];        
      break;
      default:
      break;
    }
  }

  //edit document
  edit(){      
    var data = {
      action : 'edit',
      id: this.repairOrderId
    }
    this.commonApi.updateROData(data);
    setTimeout(() => {
      this.closeModal();
    }, 1);
  }

  ngOnDestroy() {
    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.remove("thread-detail");
    this.bodyElem.classList.remove("view-modal-popup");    
  }
    
  }



