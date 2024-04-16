import { Component, OnInit, HostListener, Input, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { CommonService } from "../../../../services/common/common.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Constant, pageTitle, silentItems, IsOpenNewTab, windowHeight } from "../../../../common/constant/constant";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { ThreadPostService } from "../../../../services/thread-post/thread-post.service";
import { ApiService } from "../../../../services/api/api.service";
import * as moment from "moment";
import { Title,DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalComponent } from "../../../../components/common/success-modal/success-modal.component";
import { ConfirmationComponent } from "../../../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../../../components/common/submit-loader/submit-loader.component";
import { ProductMatrixService } from "../../../../services/product-matrix/product-matrix.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ThreadService } from "../../../../services/thread/thread.service";
import { KnowledgeArticleService } from "src/app/services/knowledge-article/knowledge-article.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input() public roID;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass: string = "thread-detail";
  public bodyClass1: string = "landing-page";
  public bodyElem;
  public title: string = "Repair Order Details";
  public loading: boolean = true;
  public knowledgeViewErrorMsg;
  public knowledgeViewError: boolean = false;
  public roData: any;
  public headerData: any;
  public user: any;
  public roleId;
  public platformId: number = 0;
  public domainId;
  public userId;
  public countryId;
  public navUrl: string = "";
  public action = "view";
  public attachments: any;
  public attachmentLoading: boolean = true;
  public contentType: number = 7;
  public likeStatus: number;
  public pinStatus: number;
  public likeCount: number;
  public pinCount: number;
  public viewCount: number;
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public accessLevel : any = {view: true, create: true, edit: true, delete:true};
  public appList: any;
  showApplication: boolean = true;
  public industryType: any = "";
  public catgOptions: string = "";
  public disableLikeFlag: boolean = false;
  public assetPartPath: string = "assets/images/thread-detail/";
  public likeImg: string;
  public pinImg: string;
  public likeLoading: boolean = false;
  public pinLoading: boolean = false;
  public innerHeight: number;
  public bodyHeight: number; 
  public systemInfo: any;
  public workStreamsData; 
  public emptyList = [];
  public tagList: any;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public successMsg: string = "";
  public newPage: string = '1';
  public headerDataTrue: boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private knowledgeArticleService: KnowledgeArticleService,
    private threadPostService: ThreadPostService,
    private apiUrl: ApiService,
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService,
    private location: Location,
  ) { }

  ngOnInit(): void {


    this.bodyElem = document.getElementsByTagName('body')[0]; 
    this.bodyElem.classList.add('parts-list');

    //this.title = `${this.title}${this.roID}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.navUrl = "repair-order/view/" + this.roID;
    
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    
    this.route.params.subscribe((params) => {
      this.roID = params.id;
    });
    
    let access = true;
    let editAccess = true;
    let deleteAccess = true;

    this.headerData = {
      threadId: this.roID,
      threadOwnerAccess: access,
      editAccess: editAccess,
      deleteAccess: deleteAccess,
      pageName: "repairorder",
      accessLevel: this.accessLevel
    };

    this.setScreenHeight();

  }
   // Set Screen Height
   setScreenHeight() {  
    this.bodyHeight = window.innerHeight;  
    let headerHeight = 50;
    let footerHeight = 0; 
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight));  
  } 
  
  popupClose(event){
    let action = event['action'];
    switch (action){
      case 'close':
        this.exitWindow();
        //window.opener.location.reload();
      break;
      case 'access':
        let threadOwnerAccess = event['threadOwnerAccess'];
        let repairOrderEditFlag = event['editAccess'];
        let repairOrderDeleteFlag = event['deleteAccess'];
        let repairOrderApproveFlag = event['approveBtnEnable'];
        this.headerData = {            
          threadId: this.roID,
          threadOwnerAccess: threadOwnerAccess,
          repairOrderEditFlag: repairOrderEditFlag,
          repairOrderDeleteFlag: repairOrderDeleteFlag,
          repairOrderApproveFlag: repairOrderApproveFlag,
          pageName: "repairorder",
          accessLevel: this.accessLevel
        };
        this.headerDataTrue = true;
      break;
      default:
      break;
    }
  }
    
  threadHeaderAction(event) { 
    if(event == 'exit'){
      this.exitWindow();
    }
    else{
      let data = {
        action: event,
        id: this.roID      
      }
      this.commonApi.emitRODetailData(data);
    }
  }

   // Exit Window
   exitWindow() {
    setTimeout(() => {
      window.close();
    }, 100);
  }


}

