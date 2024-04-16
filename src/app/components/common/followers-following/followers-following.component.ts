import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '../../../services/filter/filter.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { pageInfo, Constant, PlatFormType, ManageTitle, forumPageAccess } from 'src/app/common/constant/constant';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { AnnouncementService } from '../../../services/announcement/announcement.service';

@Component({
  selector: 'app-followers-following',
  templateUrl: './followers-following.component.html',
  styleUrls: ['./followers-following.component.scss']
})
export class FollowersFollowingComponent implements OnInit {

  @Input() dashboardData: any;
  @Input() apiKey: any;
  @Input() domainId: any;
  @Input() countryId: any;
  @Input() userId: any;
  @Input() type: any;
  @Input() loginUserId: any;
  @Output() updatefollowingResponce: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass:string = "manage-list";  
  public bodyClass1:string = "max-width-930";  
  public title: string = "";
  public manageList:any;
  public listItems = [];
  public selectionList = [];
  public listLength: number = 0;
  public count: number = 0;

  public loading: boolean = true;
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public empty: boolean = false;
  public actionFlag: boolean = false;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';
  public successMsg: string = "";

  public offset: number = 0;
  public DisableText: string = 'Disable';
  public limit: number = 30;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;

  public bodyHeight: number; 
  public innerHeight: number;
  public findLength: number = 0;

  public followingFlag: boolean = false;
  public followerFlag: boolean = false;
  public managerFlag: boolean = false;
  public dashboardFlag: boolean = false;
  public loading2: boolean;
  public fError;
  public fErrorMsg;
  public follow;
  public editIconFlag: boolean;
  public titleFlag: boolean = true;

  public viewTab:boolean = false;
  public contriTab:boolean = false;
  public solvedTab:boolean = false;
  public likeTab:boolean = false;
  public pinTab:boolean = false;
  public metooTab:boolean = false;

  public viewCount:number = 0;
  public contriCount:number = 0;
  public solvedbyCount:number = 0;
  public likeCount:number = 0;
  public pinCount:number = 0;
  public metooCount:number = 0;

  public dashboardUserList:any;
  public dashboardTab:string="";

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }

  constructor(
    private profileService: ProfileService, 
    public activeModal: NgbActiveModal,
    private filterApi: FilterService,
    private formBuilder: FormBuilder,
    private landingApi: LandingpageService,
    private threadPostService: ThreadPostService,
    private announcementService: AnnouncementService
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    localStorage.removeItem('searchVal');
    this.selectionList = [];
    
    this.bodyHeight = window.innerHeight;    
    this.setScreenHeight();

    switch(this.type){     
      case 'add-manager':
        this.getMgrList();
        break; 
      case 'thread-dashboard':
        this.dashboardTab = this.dashboardData.dashboardTab;
        this.getDashboardList(this.dashboardData); 
        break;
      case 'announcement-dashboard':
      case 'document-dashboard':
        this.dashboardTab = this.dashboardData.dashboardTab;
        this.getAnnouncementList(this.dashboardData); 
        break; 
      case 'gts-dashboard':
        this.dashboardTab = this.dashboardData.dashboardTab;
        this.getGTSList(this.dashboardData); 
        break; 
      case 'ka-dashboard':
        this.dashboardTab = this.dashboardData.dashboardTab;
        this.getKAList(this.dashboardData); 
        break;
      default:
        this.editIconFlag = (parseInt(this.loginUserId) == parseInt(this.userId)) ? true : false;
        this.getFollowingUserList(); 
        break;
    }
   
  }

  // Set Screen Height
  setScreenHeight() {    
    this.innerHeight = (this.bodyHeight - 170 );  
  }

  // Get manager Data
  getDashboardList(data) {   
    let industryType:any = localStorage.getItem('industryType');
    let title = (industryType == 3 && data.domainId == 97) ? ManageTitle.feedback : ManageTitle.thread;
    let platformId=localStorage.getItem('platformId');
    title = (platformId=='3') ? ManageTitle.supportRequest : title;
   
            if(data.domainId==71 && platformId=='1')
            {
              title=ManageTitle.supportServices
            }
            if( data.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
            {
              title=ManageTitle.techHelp;
            }
    this.titleFlag = true;
    this.title = `${title} Dashboard`;
   
    const apiFormData = new FormData();
    apiFormData.append('apiKey', data.apiKey);     
    apiFormData.append('domainId', data.domainId);   
    apiFormData.append('countryId', data.countryId); 
    apiFormData.append('userId', data.userId);  
    apiFormData.append('threadId', data.threadId);  
    apiFormData.append('postId', data.postId); 
    apiFormData.append('ismain', data.ismain); 

    this.threadPostService.dashboardUsersListAPI(apiFormData).subscribe(response => {
        console.log(response); 
        this.dashboardUserList = response;

        if(data.ismain == '1' ){
          this.viewCount = this.dashboardUserList.data.views != '' ? this.dashboardUserList.data.views.length : 0;
          this.contriCount = this.dashboardUserList.data.contributers !='' ? this.dashboardUserList.data.contributers.length : 0;
          this.solvedbyCount = this.dashboardUserList.data.solvedby !='' ? this.dashboardUserList.data.solvedby.length : 0;
          this.likeCount = this.dashboardUserList.data.likes != '' ? this.dashboardUserList.data.likes.length : 0
          this.pinCount = this.dashboardUserList.data.pins != '' ? this.dashboardUserList.data.pins.length : 0
          this.metooCount = 0;
        }
        else{
          this.likeCount = this.dashboardUserList.data.likes ? this.dashboardUserList.data.likes.length : 0;
          this.likeTab = true;
        }

        if(this.likeCount > 0 || this.viewCount > 0 || this.contriCount > 0 || this.solvedbyCount > 0 || this.pinCount > 0 || this.metooCount > 0 ) {
          if(data.ismain == '1' ){
             this.dashboardListView(this.dashboardTab); 
          }
          else{
            this.dashboardListView('like'); 
            this.dashboardTab = 'like';
          }
          //this.empty = false;  
        } else {
          this.loading = false; 
          this.dashboardFlag = true; 
          this.empty = true;     
          this.successMsg = "No Result Found";
        } 

              
    });

  }

  // Get manager Data
  getAnnouncementList(data) {   

    this.titleFlag = true;    
    
    this.title = (this.type == 'announcement-dashboard') ? "Announcement Dashboard" : "Document Dashboard" ;
    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', data.apiKey);     
    apiFormData.append('domainId', data.domainId); 
    apiFormData.append('countryId', data.countryId);     
    apiFormData.append('userId', data.userId);  
    apiFormData.append('dataId', data.threadId);

    this.announcementService.announceDashboard(apiFormData).subscribe(response => {
        console.log(response); 
        this.dashboardUserList = response;      
        
        this.viewCount = this.dashboardUserList.readUsersTotal;          
        this.likeCount = this.dashboardUserList.LikesTotal;   
        this.pinCount = this.dashboardUserList.pinTotal;   


        if(this.likeCount > 0 || this.viewCount > 0 || this.viewCount > 0 ) {          
              this.annDashboardListView(this.dashboardTab);           
        } else {
          this.loading = false; 
          this.dashboardFlag = true; 
          this.empty = true;     
          this.successMsg = "No Result Found";
        } 

              
    });

  }

  // Get manager Data
  getGTSList(data) {   

    this.titleFlag = true;    
    
    this.title = "GTS Dashboard" ;
    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', data.apiKey);     
    apiFormData.append('domainId', data.domainId); 
    apiFormData.append('countryId', data.countryId);     
    apiFormData.append('userId', data.userId);  
    apiFormData.append('dataId', data.threadId);

    this.announcementService.announceDashboard(apiFormData).subscribe(response => {
        console.log(response); 
        this.dashboardUserList = response;      
        
        this.viewCount = this.dashboardUserList.readUsersTotal;          
        this.likeCount = this.dashboardUserList.LikesTotal;   
        this.pinCount = this.dashboardUserList.pinTotal;   


        if(this.likeCount > 0 || this.viewCount > 0 || this.viewCount > 0 ) {          
              this.annDashboardListView(this.dashboardTab);           
        } else {
          this.loading = false; 
          this.dashboardFlag = true; 
          this.empty = true;     
          this.successMsg = "No Result Found";
        } 

              
    });
  
  }

  // Get manager Data
  getKAList(data) {   

    this.titleFlag = true;    
    
    this.title = "Knowledge Article Dashboard" ;
    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', data.apiKey);     
    apiFormData.append('domainId', data.domainId); 
    apiFormData.append('countryId', data.countryId);     
    apiFormData.append('userId', data.userId);  
    apiFormData.append('dataId', data.threadId);

    this.announcementService.announceDashboard(apiFormData).subscribe(response => {
        console.log(response); 
        this.dashboardUserList = response;      
        
        this.viewCount = this.dashboardUserList.readUsersTotal;          
        this.likeCount = this.dashboardUserList.LikesTotal;   
        this.pinCount = this.dashboardUserList.pinTotal;   


        if(this.likeCount > 0 || this.viewCount > 0 || this.viewCount > 0 ) {          
              this.annDashboardListView(this.dashboardTab);           
        } else {
          this.loading = false; 
          this.dashboardFlag = true; 
          this.empty = true;     
          this.successMsg = "No Result Found";
        } 

              
    });
  
  }
    
  
  dashboardListView(tab){ 
    
    this.viewTab = false;
    this.contriTab = false;
    this.solvedTab = false;
    this.likeTab = false;
    this.pinTab = false;
    this.metooTab = false;
    this.dashboardTab = tab;    
    switch(tab){
      case 'views':             
        this.manageList = this.viewCount > 0 ? this.dashboardUserList.data.views : [];
        this.viewTab = true;         
        break; 
      case 'contributors':
        this.manageList = this.contriCount > 0 ? this.dashboardUserList.data.contributers : []; 
        this.contriTab = true;
        break;
      case 'solvedby':
        this.manageList = this.solvedbyCount > 0 ? this.dashboardUserList.data.solvedby : []; 
        this.solvedTab = true;
        break;
      case 'like':
        this.manageList = this.likeCount > 0 ? this.dashboardUserList.data.likes: [];
        this.likeTab = true;
        break;
      case 'pin':
        this.manageList = this.pinCount > 0 ? this.dashboardUserList.data.pins: []; 
        this.pinTab = true;
        break;
      case 'metoo':
        this.manageList = [];
        this.metooTab = true;
        break;
      default:
        this.manageList = this.viewCount > 0 ? this.dashboardUserList.data.views : [];
        this.viewTab = true; 
        break;
    }
    
    this.loading = false; 
    this.dashboardFlag = true; 
    
    console.log(this.manageList);
    this.manageList = this.manageList;
    this.listLength = this.manageList == '' ? 0 : this.manageList.length; 
        
    this.listItems = [];
    this.listItems = this.manageList;

    for(let t in this.listItems) {  
      this.listItems[t].displayFlag = true;  
    }         
    
    
    if(this.listLength == 0) { console.log(this.listLength);
      this.empty = true;      
      this.successMsg = "No Result Found";
    } else {     
      this.empty = false; 
    } 
  }

  annDashboardListView(tab){ 
    
    this.viewTab = false;   
    this.likeTab = false;   
    this.pinTab = false;   
    this.dashboardTab = tab;    
    switch(tab){
      case 'views':       
        this.manageList = this.viewCount > 0 ? this.dashboardUserList.readUsers : [];
        this.viewTab = true;         
        break;       
      case 'like':
        this.manageList = this.likeCount > 0 ? this.dashboardUserList.Likes: [];
        this.likeTab = true;
        break;  
      case 'pin':
        this.manageList = this.pinCount > 0 ? this.dashboardUserList.pins: [];
        this.pinTab = true;
        break; 
      default:
        this.manageList = this.viewCount > 0 ? this.dashboardUserList.readUsers : [];
        this.viewTab = true; 
        break;
    }
    
    this.loading = false; 
    this.dashboardFlag = true; 
    
    console.log(this.manageList);
    this.manageList = this.manageList;
    this.listLength = this.manageList == '' ? 0 : this.manageList.length; 
        
    this.listItems = [];
    this.listItems = this.manageList;

    for(let t in this.listItems) {  
      this.listItems[t].profile = this.listItems[t].profileImg;
      this.listItems[t].username = this.listItems[t].userName;
      this.listItems[t].userid = this.listItems[t].loginId;
      this.listItems[t].displayFlag = true;  
    }        
        
    if(this.listLength == 0) { console.log(this.listLength);
      this.empty = true;      
      this.successMsg = "No Result Found";
    } else {     
      this.empty = false; 
    } 
  }

  // Get Filter Data
  getFollowingUserList() {

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiKey);     
    apiFormData.append('userId', this.userId);   

    this.profileService.getuserFollowerFollowing(apiFormData).subscribe(response => {
     
      this.loading = false;  

      if(this.type == 'following'){      
        this.manageList = response.response.following;
        this.listLength = this.manageList.length;
        this.count = this.listLength;
        this.title = "Following";
        this.followingFlag = true;
        this.titleFlag = false;
      }
      else{  
        this.manageList = response.response.followers;
        this.listLength = this.manageList.length;
        this.count = this.listLength;
        this.title = ( this.listLength > 1 ) ? 'Followers' : 'Follower';
        this.followerFlag = true;
        this.titleFlag = false;
      }
    
      this.listItems = [];
      this.listItems = this.manageList;

      for(let t in this.listItems) {  
        this.listItems[t].displayFlag = true;  
      }         
     
      if(this.listLength > 0) {
        this.empty = false;        
      } else {
        this.empty = true;
        this.successMsg = "No Result Found";
      }

    });
  }

   // Get manager Data
   getMgrList() {    
 
    this.managerFlag = true; 
    this.titleFlag = true;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiKey);     
    apiFormData.append('userId', this.loginUserId);   
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('type', '1');

    this.landingApi.getManagerList(apiFormData).subscribe((response) => {

      this.loading = false;         
      this.manageList = response.managerList;
      this.listLength = response.data;
      this.title = "Select Manager";
      
      this.listItems = [];
      this.listItems = this.manageList;

      for(let t in this.listItems) {  
        this.listItems[t].displayFlag = true;  
      }         
     
      if(this.listLength > 0) {
        this.empty = false;        
      } else {
        this.empty = true;
        this.successMsg = "No Result Found";
      }

    });
  }


  // On Submit
  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {  
      return;
    } else {
      this.searchVal = this.searchForm.value.searchKey;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue : string ) {  
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if(searchValue.length == 0) {
      this.submitted = false;
    }

    let filteredList = this.manageList.filter(option => option.userName.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
    if(filteredList.length > 0) {
      this.empty = false;
      for(let t in this.listItems) {
        this.listItems[t].displayFlag = false;
        for(let f in filteredList) {
          if(this.listItems[t].userName == filteredList[f].userName) {
            this.listItems[t].displayFlag = true;
          }
        }
      }
    } else {
      this.empty = true;
      this.successMsg = "No Result Found";
    }               
  }

  // Submit Search
  submitSearch() {
        
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.submitted = this.searchTick;
    this.empty = this.searchTick;
    for(let m in this.listItems) {
      this.listItems[m].displayFlag = true;     
    }
  }

  // Close
  close() {
    this.searchVal = '';
    this.bodyElem.classList.remove(this.bodyClass);    
    this.bodyElem.classList.remove(this.bodyClass1);    
    if(this.type=='add-manager'){
      let data = {
        empty: true,
        init: false
      };
      this.updatefollowingResponce.emit(data); 
    }
    else{     
      this.count = this.count > 0 ? this.count : 0;
      let value = this.count > 0 ? this.count : 'novalue' ;
      this.updatefollowingResponce.emit(value); 
    }
    
  }

  followORUnfollow(type,userId){ 

    this.fErrorMsg = '';  
    this.fError = false; 
   
    document.getElementById("unfollow-"+userId).classList.add('setOpacity3');
    document.getElementById("follow-"+userId).classList.add('setOpacity3');

    const apiFormData = new FormData();
    if(this.type == 'thread-dashboard' || this.type == 'announcement-dashboard' || this.type == 'thread-dashboard'){      
      apiFormData.append('apiKey', this.dashboardData.apiKey);
      apiFormData.append('domainId', this.dashboardData.domainId);
      apiFormData.append('countryId', this.dashboardData.countryId);
      apiFormData.append('userId', userId);
      apiFormData.append('loginId', this.dashboardData.userId);
      apiFormData.append('action', type);
    }
    else{      
      apiFormData.append('apiKey', this.apiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.dashboardData.countryId);
      apiFormData.append('userId', userId);
      apiFormData.append('loginId', this.loginUserId);
      apiFormData.append('action', type);
    }
 
    this.profileService.userFollowMethod(apiFormData).subscribe(res => {

      if(res.status=='Success'){
        
        if(this.type == 'thread-dashboard'){    
          this.getDashboardList(this.dashboardData);
        }
        else{
          
        
      
        
        document.getElementById("unfollow-"+userId).classList.remove('setOpacity3');
        document.getElementById("follow-"+userId).classList.remove('setOpacity3');
  
        if(type == 'follow'){
          this.count = this.count + 1;

          document.getElementById("follow-"+userId).classList.remove('showButton');
          document.getElementById("follow-"+userId).classList.add('hideButton');
          document.getElementById("unfollow-"+userId).classList.remove('hideButton');
          document.getElementById("unfollow-"+userId).classList.add('showButton');

        }
        else{
          this.count = this.count - 1;
          this.count = this.count > 0 ? this.count : 0;
          
          document.getElementById("follow-"+userId).classList.add('showButton');
          document.getElementById("follow-"+userId).classList.remove('hideButton');
          document.getElementById("unfollow-"+userId).classList.add('hideButton');
          document.getElementById("unfollow-"+userId).classList.remove('showButton');
        }     
      }
         
      }
      else{   
        document.getElementById("unfollow-"+userId).classList.remove('setOpacity3');
        document.getElementById("follow-"+userId).classList.remove('setOpacity3');
        this.fErrorMsg = res.result;  
        this.fError = true;   
      }
                
    },
    (error => {
      document.getElementById("unfollow-"+userId).classList.remove('setOpacity3');
      document.getElementById("follow-"+userId).classList.remove('setOpacity3');

      this.fErrorMsg = error;
      this.fError = true;        
    })
    );


    
  }

  // Item Selection
  itemSelection( uid, name) {
    let data = {
      mId: uid,
      mName: name
    };
    this.updatefollowingResponce.emit(data); 
    console.log(name); 
  }

  tapfrompopup(id)
  {

  var aurl=forumPageAccess.profilePage+id;
 
  window.open(aurl, '_blank');

  }
  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.close();
  }

}

