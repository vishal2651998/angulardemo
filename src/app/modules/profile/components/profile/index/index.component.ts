import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { ProfileService } from '../../../../../services/profile/profile.service';
import { ApiService } from '../../../../../services/api/api.service';
import {LandingpageService}  from '../../../../../services/landingpage/landingpage.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../../../../components/common/image-cropper/image-cropper.component';
import { FollowersFollowingComponent } from '../../../../../components/common/followers-following/followers-following.component';
import { Constant, IsOpenNewTab, windowHeight } from '../../../../../common/constant/constant';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  @Input() public updateImgResponce;
  @Input() public updatefollowingResponce;

  public title:string = 'Profile';
  public userProfileID;
  public headerData: Object;
  public personalData: Object;
  public businessData: Object;
  public paramsData: Object;
  public pageAccess: string = "profile";
  public bodyHeight: number; 
  public innerHeight: number;
  public midHeight: number;
  public teamSystem = localStorage.getItem('teamSystem');

  public selectedImg : File;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public profileImageFlag: boolean = false;
  public profileImage;
  public imgURL: any = "assets/images/login/default-img.png";
  public badgeTopUser=0;
  public navUrl: string = "";

  public landingpageWidgets=[];
  /* basic setup */
  public headerFlag: boolean = false;
  public loadingelanding: boolean = true;

  public sidebarActiveClass: Object;
  public countryId;
  public domainId;  
  public userId;
  public roleId;
  public apiData: Object;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public bodyClass:string = "landing-page";
  public user: any;
  public bodyElem;
  public profileDeleted:boolean=false;
  public isDeletedMessage:string = "";

  public loginId;
  public profileErrorMsg;
  public profileError;
  public loading;

  public userStatus
  public userName;
  public uName;
  public firstLastName;
  public badgeStatus;
  public badgeImage;
  public followers;
  public following;
  public followersText;
  public managerName;
  public joinDate;
  public role;
  public accountType;
  public loginDate;
  public devicesUsed;
  public memberOfWorkstreams;
  public editIconFlag : boolean = false;
  public follow;

  public stageNameEditFlag : boolean = false;

  public form: FormGroup;
  public loading1: boolean = false;
  public submitted: boolean = false;
  public snameErrorMsg: string = '';
  public snameError: boolean = false;

  public loading2: boolean = false;
  public fErrorMsg: string = '';
  public fError: boolean = false;
  public technicianId: string = '';
  public platformId: string = '';

   // Resize Widow
   @HostListener('window:resize', ['$event'])
   onResize(event) {
     this.bodyHeight = window.innerHeight;
     this.setScreenHeight();    
   }

  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private route: ActivatedRoute,  
    private router: Router,
    private authenticationService: AuthenticationService, 
    private apiUrl: ApiService, 
    private LandingpagewidgetsAPI: LandingpageService,
    private profileService: ProfileService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private titleService: Title
    ) { this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title); }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];    
    this.bodyElem.classList.add(this.bodyClass);   

    this.route.params.subscribe( params => {
      this.userProfileID = params.puid;
    });  
    
    let technicianId = localStorage.getItem('technicianId');
    this.technicianId = (technicianId != undefined && technicianId != 'undefined' && technicianId != 'null' && technicianId != null) ? technicianId : '';

    console.log(this.userProfileID);  
    console.log(this.technicianId);  

    this.headerData = {
      'access': this.pageAccess,
      'profile': true,
      'welcomeProfile': true,
      'search': false
    };         
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   
    this.roleId = this.user.roleId;
    this.platformId = localStorage.getItem('platformId');

    this.paramsData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userProfileID,
      'loginUserId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'technicianId': this.technicianId,     
    }

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'isActive': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset
    }

    let profileNavFrom = localStorage.getItem('profileNavFrom');
    this.navUrl = (profileNavFrom != 'undefined' || profileNavFrom != undefined) ? profileNavFrom : this.navUrl;
    console.log(this.navUrl);
    setTimeout(() => {
      localStorage.removeItem('profileNavFrom');
    }, 100);
    this.apiData = apiInfo;
    this.getUserProfileInfo();
    this.getlandingpagewidgets();
    this.bodyHeight = window.innerHeight;
    setTimeout(() => {
      this.setScreenHeight();  
    }, 1500);
  }   

  getUserProfileInfo(){
    this.profileErrorMsg = '';  
    this.profileError = false 
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.userProfileID);
    apiFormData.append('loginId', this.apiData['userId']);
    apiFormData.append('technicianId', this.technicianId);
        
    this.editIconFlag = (parseInt(this.userProfileID) == parseInt(this.userId)) ? true : false;
   
    this.profileService.getUserProfile(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
           
         let profileData = res.data
        
         if(profileData != ''){
           
          this.imgURL = profileData.profileImage;
          this.badgeTopUser = profileData.badgeTopUser;
          
          this.userName = profileData.userName;
          this.uName = profileData.userName;
          this.userStatus = profileData.availability;
          this.firstLastName = profileData.firstName+" "+profileData.lastName;
          this.badgeStatus = profileData.badgeStatus;
          if(profileData.isDeleted==1)
          {
            this.profileDeleted=true;
            this.isDeletedMessage=profileData.isDeletedMessage;
          }
          
          this.badgeImage = profileData.badgeImage;
          this.follow = profileData.follow;
          this.followers = profileData.followers;
          this.following = profileData.following;
          this.followersText = (profileData.followers) > 1 ? 'Followers' : 'Follower';    
          this.managerName = (profileData.managerName != '' && profileData.managerName != null && profileData.managerName != 'null') ? profileData.managerName : '';
          
          this.joinDate = (profileData.userRegDate != '') ? profileData.userRegDate : '';
          if(this.joinDate!=''){
            let createdDate = moment.utc(this.joinDate).toDate(); 
            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
            this.joinDate = localCreatedDate;
          }          
          this.loginDate = (profileData.LastLogin != '' && profileData.LastLogin != undefined) ? profileData.LastLogin : '';
          if(this.loginDate!=''){
            let lDate = moment.utc(this.loginDate).toDate(); 
            let lgDate = moment(lDate).local().format('MMM DD, YYYY h:mm A');
            this.loginDate = lgDate;
          }          
          
          switch(profileData.roleId){
            case '1':
              this.role = 'End User';
              break;
            case '2':
              this.role = 'Technician';
              break;
            case '3':
              this.role = 'Admin';
              break;            
          }
          
          this.businessData = { 
            'apiKey': Constant.ApiKey,
            'platformId': this.platformId,
            'roleId': this.roleId,
            'userId': this.userProfileID,
            'loginUserId': this.userId,
            'domainId': this.domainId,
            'countryId': this.countryId,
            'businessName': profileData.businessName,
            'businessTitle': profileData.businessTitle,
            'businessEmail': profileData.businessEmail,
            'msTeamEmail': profileData.msTeamEmail,
            'businessAddress1': profileData.businessAddress1,
            'businessAddress2': profileData.businessAddress2,
            'businessCity': profileData.businessCity,   
            'businessState': profileData.businessState,
            'businessZipcode': profileData.businessZipcode,
            'businessCountry': profileData.businessCountry,
            'businessCountryCode': profileData.businessCountryCode,
            'businessDialCode': profileData.businessDialCode,  
            'businessPhone': profileData.businessPhone,  
            'landLinecountryName': profileData.landLinecountryName,
            'landLinecountryCode': profileData.landLinecountryCode,
            'landLinedialCode': profileData.landLinedialCode,                
            'businessLandline': profileData.businessLandline,    
            'businessStoreNo': profileData.businessStoreNo,           
            'business_landline_ext': profileData.business_landline_ext,
            'businessofficeCode' : profileData.businessofficeCode                
          };

          this.personalData = {
            'apiKey': Constant.ApiKey,
            'platformId': this.platformId,
            'roleId': this.roleId,
            'userId': this.userProfileID,
            'loginUserId': this.userId,
            'domainId': this.domainId,
            'countryId': this.countryId,
            'firstName': profileData.firstName,
            'lastName': profileData.lastName,
            'nickName': profileData.nickName,
            'emailAddress': profileData.emailAddress,
            'country': profileData.country,
            'countryCode': profileData.countryCode,
            'dialCode': profileData.dialCode,
            'phone': profileData.phone,
            'city': profileData.city,
            'state': profileData.state,
            'zipCode': profileData.zipCode                    
          };
          
          this.accountType = profileData.accountType;          
          this.devicesUsed = profileData.usedDevices;
          this.memberOfWorkstreams = (profileData.WorkstreamsList != '') ? profileData.WorkstreamsList : '';
          this.profileErrorMsg = "";  
          this.profileError = false; 
          this.loading = false;   

         }
         else{
          if(res.deletedFlag)
          {
            this.loading = false;
            this.profileDeleted=true;
            this.isDeletedMessage=res.result;
          }
          else
          {
            this.loading = false;
            this.profileErrorMsg = res.result;  
            this.profileError = true;
          }
          
         }
      }
      else{
        this.loading = false;
        this.profileErrorMsg = res.result;  
        this.profileError = true;   
      }
                 
    },
    (error => {
      this.loading = false;
      this.profileErrorMsg = error;
      this.profileError = '';       
    })
    );
  }

  // Set Screen Height
  setScreenHeight() { 
    let teamSystem=localStorage.getItem('teamSystem');
    if(teamSystem){
      this.innerHeight = (windowHeight.heightMsTeam );  
    }
    else{
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;        
      this.innerHeight = ((this.bodyHeight - 157) - (headerHeight) );    
    }
  }  
  
  getlandingpagewidgets(){
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    
    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe((response) => {

    let rstatus=response.status;
    let rtotal=response.total;
    if(rstatus=='Success'){
      if(rtotal>0){
        let rlandingPage={
        'componentName': "RecentSearchesWidgetsComponent",
        'id': "4",
        'imageClass': "recentsearch-land-icon",
        'imageUrl': "landing-recent-search.svg",
        'name': "Search History",
        'placeholder': "Search History",
        'shortName': "search-widget"
        }
        const rcomponentName=rlandingPage.componentName;
        const rplaceholder=rlandingPage.placeholder;
        const rwid=rlandingPage.id;

        localStorage.setItem('landingpage_attr'+rwid+'',JSON.stringify(rlandingPage));    
    
        this.loadingelanding=false;
      }
      else{
        this.loadingelanding=false;
      }
    }
    else{
      this.loadingelanding=false;
    }    
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  // edit stage name
  stageNameEdit(){
    this.snameErrorMsg = '';  
    this.snameError = false; 
    this.loading1 = false;
    this.stageNameEditFlag = true;
    this.form = this.formBuilder.group({
      userName: [this.userName, [Validators.required]], 
    });
  }

  stageNameSave(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.snameErrorMsg = '';  
    this.snameError = false; 
    this.loading1 = true;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('userName', this.form.value.userName);
    
    console.log(this.form.value.userName);

    this.profileService.updateStagename(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
        this.loading1 = false;
        if(res.stagename_exist == 0){
          this.stageNameEditFlag = false;
          this.uName = res.stagename;
          this.apiUrl.userName = res.stagename;
        } 
        else{
          this.snameErrorMsg = res.result;  
          this.snameError = true;
        }        
      }
      else{   
        this.loading1 = false;      
        this.snameErrorMsg = res.result;  
        this.snameError = true;   
      }
                
    },
    (error => {
      this.loading1 = false;
      this.snameErrorMsg = error;
      this.snameError = true;        
    })
    );


    
  }

  stageNameCancel(){
    this.snameErrorMsg = '';  
    this.snameError = false; 
    this.loading1 = false;
    this.userName = this.uName;
    this.stageNameEditFlag = false;
  }

  changeProfile(){
    const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.type = "Edit";
    modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
      if (receivedService) {
        modalRef.dismiss('Cross click');
        console.log(receivedService);
        this.apiUrl.profileImage = receivedService.show;
        this.imgURL = receivedService.show;
      }
    });
  }


  userList(type){
    const modalRef = this.modalService.open(FollowersFollowingComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.apiKey = Constant.ApiKey;
    modalRef.componentInstance.domainId = this.domainId;
    modalRef.componentInstance.countryId = this.countryId;
    modalRef.componentInstance.userId = this.userProfileID;     
    modalRef.componentInstance.loginUserId = this.userId; 
    modalRef.componentInstance.type = type; 
    modalRef.componentInstance.updatefollowingResponce.subscribe((receivedService) => {
      if (receivedService) {   
        receivedService = (receivedService == 'novalue') ? 0 : receivedService;
        if(type == 'following'){
          this.following = receivedService;
          this.following = this.following > 0 ? this.following : 0;
        }
        modalRef.dismiss('Cross click');       
      }
    });
  }

  followORUnfollow(type){ 

    this.fErrorMsg = '';  
    this.fError = false; 
    this.loading2 = true;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userProfileID);
    apiFormData.append('loginId', this.userId);
    apiFormData.append('action', type);
 
    this.profileService.userFollowMethod(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
        this.loading2 = false;        
        this.follow = (type == 'follow') ? 1 : 0;  
        if(type == 'follow'){
          this.followers = parseInt(this.followers) + 1;
        }
        else{
          this.followers = parseInt(this.followers) - 1;
          this.followers = this.followers > 0 ? this.followers : 0;
        }            
         
      }
      else{   
        this.loading2 = false;      
        this.fErrorMsg = res.result;  
        this.fError = true;   
      }
                
    },
    (error => {
      this.loading2 = false;
      this.fErrorMsg = error;
      this.fError = true;        
    })
    );
  }

  closeWindow() {
    if(this.teamSystem && this.navUrl != '') {
      window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
    }
  }

  ngOnDestroy(): void{
    localStorage.removeItem('technicianId');
  }

}