import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common/common.service';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../services/api/api.service';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { Constant } from '../../../../../common/constant/constant';
import { KnowledgeBaseService } from "../../../../../services/knowledge-base/knowledge-base.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy{

  public bodyClass:string = "dynamic-detail-view";  
  public bodyElem;
  public loading:boolean = true;
  public title:string = 'Knowledge Base ID#';
  public pageHeaderText:string = 'Knowledge Base';
  public roleId;
  public apiData: Object;
  public user: any;  
  public platform = '1';
  public countryId;
  public domainId;
  public userId;
  public kbId;
  public viewUrl: string ='';
  public pageUrl: string ='';
  public editUrl: string ='';
  public editAccessFlag:boolean = false;
  public deleteAccessFlag:boolean = false;
  public duplicateAccessFlag:boolean = false; 
  public pageAccess: string = 'knowledge-base';
  public innerHeight: number;
  public bodyHeight: number;
  public detailViewErrorMsg;
  public detailViewError;
  public detailViewData:any;
  public apiType = '5';
  public headerData:any;
  public otherSpecialData:any;  
  public actionAccess:boolean = true;
  public kbData = {    
    action: "get"
  }
  constructor(
    private titleService: Title,
    private route: ActivatedRoute, 
    private router: Router,    
    private commonApi: CommonService,
    private apiUrl: ApiService, 
    private modalService: NgbModal,
    private authenticationService: AuthenticationService, 
    private kbApi: KnowledgeBaseService
  ) {
   }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.add(this.bodyClass); 

    this.route.params.subscribe( params => {
      this.kbId = params.kbid;
    }); 

    this.title = `${this.title}${this.kbId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title);

    this.pageUrl = "knowledge-base";
    this.viewUrl = "knowledge-base/view/"+this.kbId;
    this.editUrl = "knowledge-base/manage/edit"+this.kbId;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');    
    this.pageAccess = this.pageAccess;

    this.bodyHeight = window.innerHeight;
    setTimeout(() => {
      this.setScreenHeight();
    }, 400);  

    this.getDetailData();

  }

  // Set Screen Height
  setScreenHeight() { 
    this.innerHeight = (this.bodyHeight - 157 );       
  } 

  getDetailData(){

    let platformId = localStorage.getItem('platformId'); 
    this.detailViewErrorMsg = '';  
    this.detailViewError = false; 

    const apiFormData = new FormData();
    
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('dataId', this.kbId);
    apiFormData.append('apiType', this.apiType);
    apiFormData.append('platform', this.platform);
  
    this.kbApi.viewKB(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){         
        this.detailViewData = res.dataInfo; 
        this.kbId = res.dataInfo.id;
        console.log(this.detailViewData);
        this.kbData["data"] = this.detailViewData;
        console.log(this.kbData);
        this.loading = false;
        this.commonApi.emitKnowledgeBaseViewData(this.kbData);  

        this.headerData = {
          'pageName': this.pageAccess,
          'dataId': this.kbId,
          'pageHeaderText': this.pageHeaderText,
          'pageUrl': this.pageUrl,
          'editAccess': this.editAccessFlag,
          'deleteAcces': this.deleteAccessFlag                
        };
        this.otherSpecialData = {
          'duplicateAccess': this.duplicateAccessFlag    
        }                      

      }
      else{
        this.loading = false;        
        this.detailViewErrorMsg = res.result;  
        this.detailViewError = true;   
      }
                 
    },
    (error => {
      this.loading = false;      
      this.detailViewErrorMsg = error;
      this.detailViewError = '';       
    })
    );
   }
  
  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);    
  }

}
