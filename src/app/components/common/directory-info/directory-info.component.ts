import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { CommonService } from '../../../services/common/common.service';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Constant, IsOpenNewTab, RedirectionPage } from '../../../common/constant/constant';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-directory-info',
  templateUrl: './directory-info.component.html',
  styleUrls: ['./directory-info.component.scss']
})
export class DirectoryInfoComponent implements OnInit, OnDestroy {
  @Input() directoryInfoData: any = [];
  @Output() toggleActionDirectory: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  @Input() infoLoading: boolean;

  public profileLoading: boolean = true;
  public infoFlag: boolean = true;
  public actionFlag: boolean = false;
  public defaultBanner: boolean = true;
  public submitDocLoading = false;
  public teamSystem = localStorage.getItem('teamSystem');

  public bodyElem;
  public bodyHeight: number = 0;
  public innerHeight: number = 0;
  public innerInfoHeight1: number = 0;
  public innerInfoHeight2: number = 0;
  public countryId;
  public platformId;
  public domainId: any;
  public userId: any;
  public roleId: any;
  public userProfileID;
  public firstLastName = '';
  public businessTitle = '';
  public profileData: any;
  public resultMsg;
  public viemMoreFlag: boolean = false;

  public imgURL: any = "assets/images/login/default-img.png";

  constructor(
    private router : Router,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    private documentationService: DocumentationService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.platformId = localStorage.getItem('platformId');
    let user: any = this.authenticationService.userValue;
    if (user) {
      this.domainId = user.domain_id;
      this.userId = user.Userid;
      this.roleId = user.roleId;
    }
    console.log(this.router.url);

    this.userProfileID = this.directoryInfoData['id'];
    this.getUserProfileInfo();
      
   this.subscription.add(
    this.commonApi.directoryUserDataReceivedSubject.subscribe((data) => {
      this.directoryInfoData = data;
      this.userProfileID = this.directoryInfoData['id'];      
      this.profileLoading = true;
      this.infoLoading = true;
      this.viemMoreFlag = false;
      this.getUserProfileInfo();
    })
  );

  }

  // Setup Document Data
  getUserProfileInfo() {  
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userProfileID);
    apiFormData.append('loginId', this.userId);
    apiFormData.append('technicianId',  '');
    this.profileService.getUserProfile(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
           
         this.profileData = res.data
        
         if(this.profileData != ''){
          this.imgURL = this.profileData.profileImage;
          this.firstLastName = this.profileData.firstName+" "+this.profileData.lastName;
          this.businessTitle = this.profileData.businessTitle;
          this.profileLoading = false;
          this.infoLoading = false;
          this.setScreenHeight();          
         }
         else{
            this.profileLoading = false;
            this.infoLoading = false;
            this.resultMsg = res.result;            
            this.setScreenHeight();            
         }
      
        }
        },
          (error => {
            this.profileLoading = false;
            this.infoLoading = false;
            console.log(error);  
            this.setScreenHeight();            
          })
          );
        

      
  }

  // Set Screen Height
  setScreenHeight() {
    setTimeout(() => {
      let headerHeight1 = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
      let headerHeight = document.getElementsByClassName('info-head-row')[0].clientHeight;
      let url = this.router.url.split('/');      
      if(url[1] == RedirectionPage.Workstream) { 
        let infoHeight1 = 128;
        let infoHeight2 = 193;
        this.innerInfoHeight1 = infoHeight1+headerHeight1;
        this.innerInfoHeight2 = infoHeight2+headerHeight+headerHeight1;   
      }
      else{
        let infoHeight1 = 103;
        let infoHeight2 = 168;
        this.innerInfoHeight1 = infoHeight1+headerHeight1;
        this.innerInfoHeight2 = infoHeight2+headerHeight+headerHeight1;
      }
      
      this.viemMoreFlag = true;
    }, 100);
  }

  // Toogle Media Info
  toggleInfoDirectory(flag, access) {
    if(!this.infoLoading) {
      let data = {
        access: access,
        action: flag,
        directoryInfoData: this.directoryInfoData
      };
      this.toggleActionDirectory.emit(data);
    }    
  }

  
  viewMore(){
    // tab on user profile page
    let teamSystem=localStorage.getItem('teamSystem');  
    var aurl='profile/'+this.userProfileID+'';
    let url = this.router.url.split('/'); 
    let scrollTop: any;
    localStorage.setItem('tapProfile','profile');
    scrollTop = localStorage.getItem('pScrollPos');       
    this.commonApi.setProfilePageLocalStorage(url[1], scrollTop);
    if(teamSystem){
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else{
      this.router.navigate([aurl]);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
