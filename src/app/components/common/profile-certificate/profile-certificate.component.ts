import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { CertificationComponent } from '../../../components/common/certification/certification.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-certificate',
  templateUrl: './profile-certificate.component.html',
  styleUrls: ['./profile-certificate.component.scss']
})
export class ProfileCertificateComponent implements OnInit {

  @Input() certPageData;
  public loadingrs:boolean=true; 
  public certError;
  public certErrorMsg;
  public certNoData;
  public certData;
  public selectedData: any;
  public enableAddIcon: boolean = false;
  public enableEditIcon: boolean = false;
  public bodyElem;
  public bodyClass:string = "manage-list";
  public bodyClass1:string = "profile-certificate";
  
  constructor(
    private profileService: ProfileService, 
    private modalService: NgbModal,
    private config: NgbModalConfig
  ) { }

  ngOnInit(): void {

    this.userCertificationList();

  }

  userCertificationList(){

    this.certNoData =  false;
    this.certData ='';
    this.loadingrs = true;         
    this.certErrorMsg = '';  
    this.certError = false;
    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.certPageData.apiKey);
    apiFormData.append('domainId', this.certPageData.domainId);
    apiFormData.append('countryId', this.certPageData.countryId);
    apiFormData.append('userId', this.certPageData.userId);
    apiFormData.append('technicianId', this.certPageData.technicianId);
  
    this.profileService.selectUserCertificationList(apiFormData).subscribe(res => {
      
      this.certData = res.data;
      console.log(this.certData);
      if(res.status=='Success'){                      
        if(this.certData != ''){ 
          this.loadingrs = false;           
          
          this.selectedData = [];
          for(let m in this.certData) {
            for(let mm in this.certData[m].selectedcontents) {           
              this.selectedData.push(this.certData[m].selectedcontents[mm]);
            }
          } 

          if(this.certPageData.userId == this.certPageData.loginUserId){
            this.enableEditIcon = true;
            this.enableAddIcon = false;
          } 

        }
        else{
          this.certNoData =  true;
          this.loadingrs = false;         
          this.certErrorMsg = res.result;  
          this.certError = true;
          this.selectedData = [];
          if(this.certPageData.userId == this.certPageData.loginUserId){
            this.enableAddIcon = true;
            this.enableEditIcon = false;
          }
        }
      }
      else{
        this.loadingrs = false;
        this.certErrorMsg = res.result;  
        this.certError = true;   
      }
                
    },
    (error => {
      this.loadingrs = false;
      this.certErrorMsg = error;
      this.certError = '';       
    })
    ); 

  }

  addCertification(carId,type){
    const modalRef = this.modalService.open(CertificationComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.apiKey = this.certPageData.apiKey;
    modalRef.componentInstance.domainId = this.certPageData.domainId;
    modalRef.componentInstance.countryId = this.certPageData.countryId;
    modalRef.componentInstance.userId = this.certPageData.userId; 
    modalRef.componentInstance.loginUserId = this.certPageData.loginUserId; 
    modalRef.componentInstance.catId = carId;
    modalRef.componentInstance.type = type;     
    modalRef.componentInstance.filteredItems = this.selectedData; 
    modalRef.componentInstance.typeNew = this.enableAddIcon;
    modalRef.componentInstance.updateDataResponce.subscribe((receivedService) => {
      if (receivedService) {
        modalRef.dismiss('Cross click');
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.remove(this.bodyClass);
        this.bodyElem.classList.remove(this.bodyClass1);
        this.ngOnInit();       
      }
    }); 
  }

}