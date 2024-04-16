import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { Constant, windowHeight, pageTitle } from '../../../common/constant/constant';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";

@Component({
  selector: 'app-content-popup',
  templateUrl: './content-popup.component.html',
  styleUrls: ['./content-popup.component.scss']
})
export class ContentPopupComponent implements OnInit, OnDestroy {
  @Output() privacyResponce: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "auth-bg";
  public bodyElem;
  public apiKey;
  public countryId;
  public domainId;
  public userId;
  public user: any;
  public height: number;
  public loading: boolean = true;
  public title='Privacy Policy';
  public content='';
  public checkboxFlag: boolean = false;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      this.setHeight();     
    }, 100);
  }

  constructor(
    private landingpageServiceApi: LandingpageService,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService 
  ) { }

  ngOnInit(): void {
    
    this.bodyElem = document.getElementsByTagName('body')[0];    
    this.bodyElem.classList.add(this.bodyClass);    

    this.user = this.authenticationService.userValue;    
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;    
    this.apiKey = Constant.ApiKey
    this.countryId = localStorage.getItem('countryId');
    
    this.setHeight();    
    
    setTimeout(() => {     
      this.policyContent();            
    }, 1000);

  }

  policyContent(){    
    const mData = new FormData();
    mData.append('apiKey', Constant.ApiKey);
    mData.append('userId', this.userId);
    mData.append('domainId', this.domainId);
    mData.append('countryId', this.countryId);    
    
    this.authenticationService.getPolicyContent(mData).subscribe((response) => {     
      if(response.status == 'Success') {        
        this.loading = false; 
        console.log(response); 
        this.title = response.title;;
        this.content = response.content;
      }
    },
    (error => {        
        console.log(error);  
    })
    );   
  }

  checkboxChange(flag){
    this.checkboxFlag = flag ? false : true;
  }

  buttonClick(type){
    console.log(type);
    if(type == 'cancel'){       
      this.privacyResponce.emit(true);
    }
    else{
      if(this.checkboxFlag){
        const apiFormData = new FormData();    
        apiFormData.append("apiKey", Constant.ApiKey);
        apiFormData.append("domainId", this.domainId);
        apiFormData.append("countryId", this.countryId);
        apiFormData.append("userId", this.userId);
        apiFormData.append("tooltipId", '');
        apiFormData.append("isPolicyAccepted", '1');
    
        this.landingpageServiceApi
          .updateTooltipconfigWeb(apiFormData)
          .subscribe((response) => {
            if (response.status == "Success") {
              this.activeModal.dismiss('Cross click');       
              this.bodyElem.classList.remove(this.bodyClass);
              window.location.reload();  
            }
            else{
              console.log("error");
            }
          });
        }      
      }   
  
  }

  setHeight(){
    this.height = windowHeight.height - 160; 
  }

  ngOnDestroy() {    
    this.bodyElem.classList.remove(this.bodyClass);    
  }

}
