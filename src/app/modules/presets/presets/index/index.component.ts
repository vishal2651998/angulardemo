import {Component, EventEmitter, OnInit, Input, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { Constant, ContentTypeValues, FilterGroups, filterNames, filterFields, windowHeight, DefaultNewCreationText } from "src/app/common/constant/constant";
import { PresetsManageComponent } from 'src/app/components/common/presets-manage/presets-manage.component';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @Input() public presetsServices;
  public apiKey: string = Constant.ApiKey;
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public roleId;
  public contentTypeId: any = ContentTypeValues.StandardReports;
  public apiData: Object;
  public apiInfo: Object;
  public headerFlag: boolean = false;
  public headerData: Object;
  public pageAccess: string = "presets";
  public headTitle: string = "Presets";
  public presetId;
  public bodyClass: string;
  public bodyElem;
  constructor(
    private activteRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private modalConfig: NgbModalConfig,
  ) {

    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = 'dialog-centered';

    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.headTitle
    );
  }
  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let authFlag = (this.domainId == "undefined" || this.domainId == undefined) && (this.userId == "undefined" || this.userId == undefined) ? false : true;
    if (authFlag) { 
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
      };      
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.openPresetPOPUP('new');
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }
  openPresetPOPUP(type){
    this.bodyElem.classList.add("presets-popup"); 
    const modalRef = this.modalService.open(PresetsManageComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.presetType = type;
    modalRef.componentInstance.presetId = ''; 
    modalRef.componentInstance.presetsServices.subscribe((receivedService) => {      
      if(receivedService){  
        this.bodyElem.classList.remove("presets-popup"); 
        modalRef.dismiss('Cross click');  
        console.log(receivedService);  
      }
    });    
  }  
}
