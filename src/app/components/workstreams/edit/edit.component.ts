import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { WorkstreamService } from '../../.../../../services/workstream/workstream.service';
import { CommonService } from '../../../services/common/common.service';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessComponent } from '../../../components/common/success/success.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant,IsOpenNewTab,RedirectionPage,pageTitle,windowHeight } from '../../../common/constant/constant';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};

  public title:string = 'Edit Workstream';
  public bodyClass: string = "submit-loader";
  public bodyElem;
  public footerElem;
  public bodyHeight: number;
  public innerHeight: number;

  public apiKey: string = 'dG9wZml4MTIz';
  public domainId;
  public userId;
  public wsId;
  public countryId;
  public loading: boolean = true;
  public headerData: Object;
  public selectedWsImg : File;
  public imgURL: any;
  public imgName: any;
  public submitButtonFlag: boolean = true;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public invalidContentType: boolean = false;
  public invalidContentTypeErr: string = "Select minimum two content types";
  public showCategoryType: boolean = false;
  public wsMaxLen: number = 25;
  public descMaxLen: number = 100;
  public contentTypes: object;
  public selectedContTypes = [];

  public categories: object;
  public selectedCategories = [];

  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemLoading: boolean = true;
  public itemTotal: number;
  public itemEmpty: boolean = false;
  public itemList: any = [];
  public selectedUsers = [];
  public assignedUsers = [];
  public newAssignedUsers = [];
  public deletedUsers = [];
  public workstreamUserEmpty: boolean = false;

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  
  public itemUserLimit: number = 20;
  public itemUserOffset: number = 0;
  public itemUserLength: number = 0;
  public itemUserLoading: boolean = true;
  public itemUserTotal: number;
  public userScrollInit: number = 0;
  public lastUserScrollTop: number = 0;
  public userScrollTop: number;
  public userScrollCallback: boolean = true;

  public notifyFlag: boolean = false;
  public notifyStatus: number;
  public deleteNotify: any = 0;

  editWorkstreamForm: FormGroup;
  public wsExistFlag: boolean = false;
  public descLen: number = 0;
  public submitted: boolean = false;
  public wsUserSearchForm: FormGroup;
  public wsUserSearchTick: boolean = false;
  public wsUserSearchClose: boolean = false;
  
  public userSearchForm: FormGroup;
  public userSearchTick: boolean = false;
  public userSearchClose: boolean = false;
  public userSubmitted:boolean = false;
  public wsSearchVal: string = "";
  public searchVal: string = "";

  public workstreamVal: string = "";
  public existingWorkstream: string = "";
  public descriptionVal: string = "";
  public notifyAllUsersVal: number = 1;
  public createdBy: string = "";
  public wsdefaultValue: string = "";
  public platformId;
  
  public createdDate;
  public updatedBy: string = "";
  public updatedDate;
  public wsFlag: any = null;

  public pageAccess: string = "newWorkstream";
  public user: any;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScrollAll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-10;
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        this.getUserLists();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  onScrollWS(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-10;
    this.userScrollTop = event.target.scrollTop-80;
    if(this.userScrollTop > this.lastUserScrollTop && this.userScrollInit > 0) {
      if (inHeight >= totalHeight && this.userScrollCallback && this.itemUserTotal > this.itemUserLength) {
        this.userScrollCallback = false;
        this.getWorkstreamUserLists('scroll');
      }
    }
    this.lastUserScrollTop = this.userScrollTop;
  } 

 /* onAllUserScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-10;
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        this.getUserLists();
      }
    }
    this.lastScrollTop = this.scrollTop;
  }*/

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }


  constructor(
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    public location: PlatformLocation,
	  private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
    private wsApi: WorkstreamService,
    private imageCompress: NgxImageCompressService,
    private commonService: CommonService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService, 
    
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  // convenience getters for easy access to form fields
  get f() { return this.editWorkstreamForm.controls; }

  // convenience getter for easy access to form fields
  get u() { return this.userSearchForm.controls; }
  get wu() { return this.wsUserSearchForm.controls; }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.scrollTopService.setScrollTop();
    this.countryId = localStorage.getItem('countryId');
    let platformId = localStorage.getItem('platformId');
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
      this.wsId = this.route.snapshot.params['wid'];

      this.headerData = {        
        title: 'Workstream',
        action: 'edit',
        id: this.wsId     
      };

      /*this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': false,
        'search': false
      };*/
  
      this.userSearchForm = this.formBuilder.group({
        searchKey: ['', [Validators.required]],
      });
  
      this.wsUserSearchForm = this.formBuilder.group({
        searchKey: ['', [Validators.required]],
      });

      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.setScreenHeight();  
      }, 500);

      this.getWorkstreamData();
    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  // Get Workstream Data
  getWorkstreamData() {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'action': 'view',
      'workstreamId': this.wsId
    };

    this.wsApi.getWorkstreamDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let resultData = response.workstreamDetails;
        if(resultData.editAccess == 1) {
          this.workstreamVal = resultData.workstreamName;
          this.existingWorkstream = resultData.workstreamName;
          this.descriptionVal = (resultData.description == null) ? '' : resultData.description;
          this.contentTypes = resultData.contentTypes;        
          this.createdBy = resultData.createdByUserName;
          if(resultData.defaultValue)
          {
            this.wsdefaultValue = resultData.defaultValue;
          }
         
          
          let createdDate = moment.utc(resultData.createdOn).toDate();
          let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
          this.createdDate = (resultData.createdOn == '') ? '-' : localCreatedDate;
          this.updatedBy = (resultData.UpdatedByuserName == '') ? '-' : resultData.UpdatedByuserName;
          let updatedDate = moment.utc(resultData.updatedOn).toDate(); 
          let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
          this.updatedDate = (resultData.updatedOn == '') ? '-' : localUpdatedDate;
          this.imgURL = (resultData.workstreamImg == "") ? null : resultData.workstreamImg;
          this.imgName = (resultData.workstreamBaseImg == "") ? null : resultData.workstreamBaseImg;
          
          this.editWorkstreamForm = this.formBuilder.group({
            action: [1],
            domainId: [this.domainId],
            countryId: [this.countryId],
            userId: [this.userId],
            workstreamName: [this.workstreamVal, [Validators.required]],
            description: [this.descriptionVal],
            contentType: [''],
            notifyUsers: [1],
            notifyAllUsers: [this.notifyAllUsersVal]
          });
          
          this.contentTypes = resultData.contentTypes;
          for(let c in this.contentTypes) {
            if(this.platformId == 1){
              if(this.contentTypes[c].id == '2'){
                this.showCategoryType = true;
              }
            }
            let defaultSelection = this.contentTypes[c].isDefault;
            let isSel = this.contentTypes[c].isSelected;
            if(defaultSelection == 1) {
              this.selectedContTypes.push(this.contentTypes[c].id)
              this.contentTypes[c].isDisabled = true;
            } else {
              if(isSel == 1) {
                this.selectedContTypes.push(this.contentTypes[c].id)
              }
              this.contentTypes[c].isDisabled = false;
            }
          }
          if(this.platformId == 1){
            this.getCategoryData();
          } 
          this.getWorkstreamUserLists('init');
        } else {
          this.router.navigate(['/forbidden']);
        }
      }
    });  
  }

    // Get Workstream Data
  getCategoryData() {
    let wsNameData = new FormData();
    wsNameData.append('apiKey',  Constant.ApiKey,);
    wsNameData.append('userId', this.userId);
    wsNameData.append('domainId', this.domainId);
    wsNameData.append('countryId', this.countryId);
    wsNameData.append('fromWorkstream', '1');
    let arrId = [];
    arrId.push(this.wsId);
    wsNameData.append('workstreamsList', JSON.stringify(arrId));

    this.wsApi.getCategoryDetail(wsNameData).subscribe((response) => {
      if(response.status == "Success") {
        this.categories = response.items;
        for(let c in this.categories) {
          let defaultSelection = this.categories[c].isDefault;
          let isSel = this.categories[c].isSelected;
          if(defaultSelection == 1) {
            this.selectedCategories.push(this.categories[c].id)
            this.categories[c].isDisabled = true;
          } else {
            if(isSel == 1) {
              this.selectedCategories.push(this.categories[c].id)
            }
            this.categories[c].isDisabled = false;
          }
        }
      }
    });  
  }

    // Change Selection
  changeCategorySelection(index, id, action, flag) {
    if(!flag) {
      if(action == 0) {
        this.categories[index].isSelected = 1;
        this.selectedCategories.push(id);
      } else {
        this.categories[index].isSelected = 0;
        let removeIndex = this.selectedCategories.indexOf(id);
        this.selectedCategories.splice(removeIndex, 1);
      }
    }
  }

  // Get Workstream User Lists
  getWorkstreamUserLists(action) {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'action': 'view',
      'searchKey': this.wsSearchVal,
      'workstreamId': this.wsId,
      'limit': this.itemUserLimit,
      'offset': this.itemUserOffset,
      'type': 1
    };
    this.itemUserLoading = true;

    this.wsApi.getWorkstreamUsers(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let resultData = response.workstreamUsers;
        
        this.userScrollCallback = true;
        this.userScrollInit = 1;

        this.itemUserTotal = response.totalworkstreamMembers;
        this.itemUserLength += this.itemUserLimit;
        this.itemUserOffset += this.itemUserLimit;
        this.itemUserLoading = false;
        this.workstreamUserEmpty = (action == 'search-init' && this.itemUserTotal == 0) ? true : false;

        for(let ws of resultData) {
          let uname = (this.userId == ws.userId) ? 'You' : ws.userName.trim();
          ws.uname = uname;
          //uname = (uname.length > this.strLen) ? uname.substring(0, this.strLen)+'...' : uname;
          ws.userName = uname;
          let userStatus = ws.availability;
          let availStatus = '';
          switch(userStatus) {
            case 1:
              availStatus = 'online';
              break;
            case 2:
              availStatus = 'inactive';
              break;
            case 4:
              availStatus = 'removed';
              break;   
            default:
              availStatus = 'offline';
              break;    
          }
          this.selectedUsers.push({
            userIndex: -1,
            userId: ws.userId,
            uname: uname,
            userName: ws.userName.trim(),
            workstreamRole: ws.userRole,
            workstreamOwner: ws.workstreamOwner,
            profileImg: ws.profileImg,
            availStatus: availStatus,
            role: (ws.workstreamOwner == 1) ? 'Workstream Admin' : ws.workstreamRole,
            displayFlag: true
          });
          this.assignedUsers.push(ws.userId);
        }

        switch (action) {
          case 'search-init':
            if(this.newAssignedUsers.length > 0) {
              for(let newUser of this.newAssignedUsers) {
                this.selectedUsers.push({
                  userIndex: newUser.userIndex,
                  userId: newUser.uid,
                  uname: newUser.uname,          
                  userName: newUser.uname,
                  workstreamRole: newUser.title,
                  profileImg: newUser.profileImg,
                  availStatus: newUser.availStatus,
                  role: newUser.role,
                  title: newUser.title,
                  displayFlag: true
                });
                this.assignedUsers.push(newUser.uid);
              }  
            }
            
            if(this.deletedUsers.length > 0) {
              this.clearUser();    
            }
            break;
        
          case 'clear-search':
            if(this.deletedUsers.length > 0) {
              this.clearUser();    
            }
            break;
        }

        if(action == 'init') {
          this.getUserLists();
        }
      }
    });
  }

  // Clear User
  clearUser() {
    console.log(this.deletedUsers)
    for(let delUser of this.deletedUsers) {
      let uid = delUser;
      let itemIndex = this.itemList.findIndex(option => option.userId == uid);
      this.itemList[itemIndex].disabledState = 0;
      let sitemIndex = this.selectedUsers.findIndex(option => option.userId == uid);
      this.selectedUsers.splice(sitemIndex, 1);
      let aitemIndex = this.assignedUsers.findIndex(option => option.userId == uid);
      this.assignedUsers.splice(aitemIndex, 1);
    }
  }

  // Get User Lists
  getUserLists() {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'action': 'view',
      'searchKey': this.searchVal,
      'workstreamId': this.wsId,
      'limit': this.itemLimit,
      'offset': this.itemOffset,
      'type': 2
    };
    this.itemLoading = true;

    this.wsApi.getWorkstreamUsers(apiData).subscribe((response) => {
      if(response.status == "Success") {
        this.loading = false;        
        this.itemLoading = false;
        let resultData = response.allUsers;
        if (resultData == '') {
          this.itemEmpty = true;
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;

          this.itemEmpty = false;
          this.itemTotal = response.totalAllUsers;
          this.itemLength += this.itemLimit;
          this.itemOffset += this.itemLimit;
          
          for(let item in resultData) {
            let uname = resultData[item].userName.trim();
            resultData[item].uname = uname;
            let userStatus = resultData[item].availability;
            let availStatus = '';
            switch(userStatus) {
              case 1:
                availStatus = 'online';
                break;
              case 2:
                availStatus = 'inactive';
                break;
              case 4:
                availStatus = 'removed';
                break;
              default:
                availStatus = 'offline';
                break;    
            }
            resultData[item].availStatus = availStatus;
            //uname = (uname.length > this.strLen) ? uname.substring(0, this.strLen)+'...' : uname;
            resultData[item].userName = uname;
            this.itemList.push(resultData[item]);
            resultData[item].userName = resultData[item].userName.trim();
            let uid = resultData[item].userId;
            // From Selected Users
            let arr = this.selectedUsers;
            let filteredItem = arr.filter(option => option.userId.indexOf(uid) !== -1);
            
            if(filteredItem.length > 0) {
              let chkFilteredItem = this.itemList.filter(option => option.userId.indexOf(uid) !== -1);
                if(chkFilteredItem.length > 0) {
                  let itemIndex = this.itemList.findIndex(option => option.userId == uid);
                  //this.itemList[itemIndex].disabledState = 1;
                }
            }

            // From New Assigned Users
            let newArr = this.newAssignedUsers;
            if(newArr.length > 0) {
              let newFilteredItem = newArr.filter(option => option.userId.indexOf(uid) !== -1);
              if(newFilteredItem.length > 0) {
                let chkFilteredItem = this.itemList.filter(option => option.userId.indexOf(uid) !== -1);
                if(chkFilteredItem.length > 0) {
                  let newItemIndex = this.itemList.findIndex(option => option.userId == uid);
                  this.itemList[newItemIndex].disabledState = 1;
                }
              }
            }

            let delArr = this.deletedUsers;
            if(delArr.length) {
              let delFilteredItem = delArr.includes(uid);
              if(delFilteredItem) {
                let chkFilteredItem = this.itemList.filter(option => option.userId.indexOf(uid) !== -1);
                if(chkFilteredItem.length > 0) {
                  let delItemIndex = this.itemList.findIndex(option => option.userId == uid);
                  this.itemList[delItemIndex].disabledState = 0;
                }
              }
            }
          }          
        }
      }
    });
  }

  // Change Selection
  changeSelection(index, id, action, flag) {
    if(!flag) {
      if(action == 0) {
        this.contentTypes[index].isSelected = 1;
        this.selectedContTypes.push(id);
        if(this.platformId == 1){
          if(id == '2'){
            this.showCategoryType = true;
          }
        }
      } else {
        if(this.platformId == 1){
          if(id == '2'){
            this.showCategoryType = false;
          }
        }
        this.contentTypes[index].isSelected = 0;
        let removeIndex = this.selectedContTypes.indexOf(id);
        this.selectedContTypes.splice(removeIndex, 1);
      }
      this.invalidContentType = (this.selectedContTypes.length < 2) ? true : false;
      let wsVal = this.editWorkstreamForm.value.workstreamName;
      this.submitButtonFlag = (wsVal != '' && !this.wsExistFlag && this.selectedContTypes.length > 1) ? true : false;
    }
  }

  // On File Upload
  onFileUpload(event){   
    let uploadFlag = false;
    this.selectedWsImg = event.target.files[0];
    let type = this.selectedWsImg.type.split('/');
    let type1 = type[1].toLowerCase();
    let fileSize = this.selectedWsImg.size/1024/1024;
    this.invalidFileErr = "";

    if(type1 == 'jpg' || type1 == 'jpeg' || type1 == 'png' ){
      uploadFlag = true;
    }
    else{
      this.invalidFile = true;
      this.invalidFileErr = "Allow only JPEG or PNG";
    }

    if(fileSize > 2) {
      uploadFlag = false;
      this.invalidFileSize = true;
      this.invalidFileErr = "File size exceeds 2 MB"; 
    } 

    if(uploadFlag) {
      this.OnUploadFile();
    }

    return false;
  }

  OnUploadFile() {    
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedWsImg); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result;
      this.imgName = null;
      this.compressFile(this.selectedWsImg, this.imgURL);
    }  
  }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedWsImg = null;
    this.imgURL = this.selectedWsImg;
    this.imgName = null;
    this.invalidFileSize = false;
    this.invalidFile = false;
    this.invalidFileErr = "";
  }

  // workstream Name Change
  onWsChange(val) {
    if(val.length > 0) {
      let apiData = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'workstreamId': this.wsId,
        'action': 'new',
        'title': val
      };
      this.checkWorkstreamName(apiData);
    } else {
      this.wsExistFlag = false;
      this.submitted = this.wsExistFlag;
      this.submitButtonFlag = false;
    }
  }

  // Check Workstream Name Exists
  checkWorkstreamName(apiData) {
    let wsNameData = new FormData();
    wsNameData.append('apiKey', apiData.apiKey);
    wsNameData.append('userId', apiData.userId);
    wsNameData.append('domainId', apiData.domainId);
    wsNameData.append('countryId', apiData.countryId);
    wsNameData.append('workstreamId', apiData.workstreamId);
    wsNameData.append('title', apiData.title);
        
    if(this.wsFlag){
      this.wsFlag.unsubscribe();
      this.fetchWsData(wsNameData);
    } else {
      this.fetchWsData(wsNameData);      
    }
  }

  fetchWsData(apiData) {
    this.wsFlag = this.wsApi.checkWorkstreamName(apiData).subscribe((response) => {
      this.wsExistFlag = (response.status == 'Success') ? false : true;
      this.submitted = (this.selectedContTypes.length < 2) ? true : this.wsExistFlag;
      this.submitButtonFlag = (!this.wsExistFlag && !this.invalidContentType) ? true : false;
    });
  }

  // Notify User Change
  notifyUserChange(status) {
    this.notifyFlag = (status == 1) ? true : false;
    this.editWorkstreamForm.value.notifyUsers = status;
  }

  // User Selection
  userSelection(index, userData) {
	  console.log(userData)
    let uid = userData.userId;
    let uname = userData.userName;
    let status = userData.disabledState;
    let wsRole = userData.workstreamRole;
    let title = userData.userRole;
    let role = (userData.workstreamRole == "") ? 'Member' : wsRole;
	  if(status == 0) {
      let userStatus = 1;
      this.itemList[index].disabledState = userStatus;
      
      let filteredList = this.assignedUsers.includes(uid);
      if(filteredList) {
        let rmIndex = this.deletedUsers.findIndex(x => x ==  uid);
        this.deletedUsers.splice(rmIndex, 1);
      } else {
        this.newAssignedUsers.push({
          userIndex: index,
          userId: uid,
          userName: uname,
          workstreamRole: title,
          role: role,
		      title: title,
          displayFlag: true,
          userData: userData
        });
        this.itemUserLength = this.itemUserLength - 1;
      }
      
      this.selectedUsers.push({
        userIndex: index,
        userId: uid,
        uname: uname,          
        userName: uname,
        workstreamRole: title,
        profileImg: userData.profileImg,
        availStatus: userData.availStatus,
        role: role,
		    title: title,
        displayFlag: true
      });
    }
  }

  // Workstream User Search Onchange
  onWorkstreamSearchChange(searchValue : string ) {  
    this.wsSearchVal = searchValue;
    this.wsUserSearchClose = (searchValue.length > 0) ? true : false;
    let arr = this.selectedUsers;
    let searchVal = searchValue.toLowerCase();
    let filteredList = arr.filter(option => option.userName.toLowerCase().indexOf(searchVal) !== -1);

    if(!this.wsUserSearchClose) {
      this.clearWorkstreamUserSearch();    
    }
    
    if(filteredList.length > 0) {
      for(let u in this.selectedUsers) {
        this.selectedUsers[u].displayFlag = false;
        for(let f in filteredList) {
          if(this.selectedUsers[u].userName == filteredList[f].userName) {
            this.selectedUsers[u].displayFlag = true;
          }
        }
      }
    } else {
      this.workstreamUserEmpty = true;
    }
    console.log(this.workstreamUserEmpty)
  }

  // Clear Workstream User Search
  clearWorkstreamUserSearch() {
    this.wsSearchVal = "";
    this.workstreamUserEmpty = false;
    this.wsUserSearchClose = false;
    for(let u of this.selectedUsers) {
      u.displayFlag = true;
    }
  }
  // Search Onchange
  onSearchChange(action, searchValue : string ) {
    switch (action) {
      case 'ws':
        this.wsUserSearchForm.value.search_keyword = searchValue;
        this.wsUserSearchTick = (searchValue.length > 0) ? true : false;
        this.wsUserSearchClose = this.wsUserSearchTick;
        this.wsSearchVal = searchValue;
        if(searchValue.length == 0) {
          this.workstreamUserEmpty = false;
          this.clearSearch(action);
        }
        break;
      default:
        this.userSearchForm.value.search_keyword = searchValue;
        this.userSearchTick = (searchValue.length > 0) ? true : false;
        this.userSearchClose = this.userSearchTick;
        this.searchVal = searchValue;
        if(searchValue.length == 0) {
          this.clearSearch(action);
        }
        break;
    }
    
  }

  // Submit Search
  submitSearch(action) {
    switch (action) {
      case 'ws':
        this.itemUserLimit = 20;
        this.itemUserOffset = 0;
        this.itemUserLength = 0;
        this.itemUserTotal = 0;
        this.userScrollInit = 0;
        this.lastUserScrollTop = 0;
        this.userScrollCallback = true;
        this.selectedUsers = [];
        this.getWorkstreamUserLists('search-init');
        break;
    
      default:
        this.itemLimit = 20;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        this.scrollInit = 0;
        this.lastScrollTop = 0;
        this.scrollCallback = true;
        this.itemList = [];
        this.getUserLists();
        break;
    }
  }

  // Clear Search
  clearSearch(action) {
    switch (action) {
      case 'ws':
        this.wsSearchVal = '';
        this.wsUserSearchTick = false;
        this.wsUserSearchClose = this.userSearchTick;
        this.itemUserLimit = 20;
        this.itemUserOffset = 0;
        this.itemUserLength = 0;
        this.itemUserTotal = 0;
        this.userScrollInit = 0;
        this.lastUserScrollTop = 0;
        this.userScrollCallback = true;
        this.selectedUsers = [];
        this.getWorkstreamUserLists('clear-search');
        break;
    
      default:
        this.searchVal = '';
        this.userSearchTick = false;
        this.userSearchClose = this.userSearchTick;
        this.itemLimit = 20;
        this.itemOffset = 0;
        this.itemLength = 0;
        this.itemTotal = 0;
        this.scrollInit = 0;
        this.lastScrollTop = 0;
        this.scrollCallback = true;
        this.itemList = [];
        this.getUserLists();
        break;
    }
  }

  // Remove Selection
  removeSelection(index, uid) {
    let arr = this.itemList;
    console.log(arr);
    let filteredItem = arr.filter(option => option.userId.indexOf(uid) !== -1);
    console.log(filteredItem);
    if(filteredItem.length > 0 && this.domainId!=52) {
      let itemIndex = arr.findIndex(option => option.userId == uid);
      this.itemList[itemIndex].disabledState = 0;
      this.selectedUsers.splice(index, 1);
    
      let filteredList = this.assignedUsers.includes(uid);
      if(filteredList) {
        this.deletedUsers.push(uid);
      } else {
        let filteredUser = this.newAssignedUsers.filter(option => option.userId.indexOf(uid) !== -1);
        if(filteredUser) {
          let userIndex = this.newAssignedUsers.findIndex(option => option.userId == uid);
          this.newAssignedUsers.splice(userIndex, 1);
        }
      }
    } else {
      this.selectedUsers.splice(index, 1);
      this.deletedUsers.push(uid);
    }    
  }

  // On Submit
  onSubmit() {
    if(!this.submitButtonFlag) {
      return false;
    }
    this.submitted = true;
    this.invalidContentType = (this.selectedContTypes.length < 2) ? true : false;
    if(this.wsExistFlag || this.invalidFile || this.invalidFileSize || this.invalidContentType) {
      return false;
    }
    
    if(this.editWorkstreamForm.invalid) {
      return;
    }
    
    let wsFormVal = this.editWorkstreamForm.value;
    let existWsFlag = (wsFormVal.workstreamName == this.existingWorkstream) ? true : false;
    if(!existWsFlag) {
      const modalNotifyRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalNotifyRef.componentInstance.access = 'Workstream Save';
      modalNotifyRef.componentInstance.confirmAction.subscribe((recivedService) => {
        modalNotifyRef.dismiss('Cross click'); 
        let response = recivedService;
        if(response.action) {
          wsFormVal.notifyUsers = (!response.notify) ? 0 : 1;
          this.saveWorkstream(wsFormVal);
        } else {
          wsFormVal.notifyUsers = 1;
          return;
        }
      });
    } else {
      const modalNotifyRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalNotifyRef.componentInstance.access = 'Save';
      modalNotifyRef.componentInstance.confirmAction.subscribe((rcvdService) => {
        modalNotifyRef.dismiss('Cross click');
        if(rcvdService) {
          wsFormVal.notifyUsers = (!rcvdService) ? 0 : 1;
          this.saveWorkstream(wsFormVal);
        } else {
          wsFormVal.notifyUsers = 1;
          return;        
        }
      });
    }
  }

  // Save Workstream
  saveWorkstream(wsFormVal) {
    this.bodyElem.classList.add(this.bodyClass);
    let wsImg = (this.imgURL == null || this.imgURL == undefined || this.imgURL == 'undefined') ? 'assets/images/site/workstream-creation/workstream-circle.png' : this.imgURL;
    const modalRef = this.modalService.open(SuccessComponent, this.modalConfig);
    modalRef.componentInstance.bgImg = wsImg;
    modalRef.componentInstance.msgType = "html";
    modalRef.componentInstance.msg = `<div class="ws-create-msg"> <div class="msg">Updating workstream <span class="ws-name">${wsFormVal.workstreamName}..</span></div>`;
    let workstreamImg;
    let contentType: any = JSON.stringify(this.selectedContTypes);
    let newAssignedUsers: any = JSON.stringify(this.newAssignedUsers);
    let deletedUsers: any = JSON.stringify(this.deletedUsers);
    let existWs = (wsFormVal.workstreamName == this.existingWorkstream) ? "" : this.existingWorkstream;
    let category: any;
    if(this.showCategoryType){
      category = JSON.stringify(this.selectedCategories);
    }
    if(this.imgName == null) {
      workstreamImg = (this.selectedWsImg == undefined) ? "" : this.selectedWsImg;
    } else {
      workstreamImg = this.imgName;
    }
    console.log(workstreamImg)
    let wsFormData = new FormData();
    wsFormData.append('action', wsFormVal.action);
    wsFormData.append('apiKey', Constant.ApiKey);
    wsFormData.append('domainId', wsFormVal.domainId);
    wsFormData.append('countryId', wsFormVal.countryId);
    wsFormData.append('userId', wsFormVal.userId);
    wsFormData.append('workstreamId', this.wsId);
    wsFormData.append('workstreamImage', workstreamImg);
    wsFormData.append('workstreamName', wsFormVal.workstreamName);
    wsFormData.append('description', wsFormVal.description);
    wsFormData.append('contentTypes', contentType);
    wsFormData.append('notifyUsers', wsFormVal.notifyUsers);
    wsFormData.append('notifyAllUsers', wsFormVal.notifyAllUsers);
    wsFormData.append('newAssignedUsers', newAssignedUsers);
    wsFormData.append('deletedUsers', deletedUsers);
    wsFormData.append('existingWorkstreamName', existWs);
    if(this.showCategoryType){
      wsFormData.append('threadCategories', category); 
    }
    this.wsApi.newWorkstream(wsFormData).subscribe((response) => {
      //modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      if(response.status == "Success") { 
        //const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        //modalMsgRef.componentInstance.msg = response.result;
        modalRef.componentInstance.bgImg = "";
        modalRef.componentInstance.msgType = "";
        modalRef.componentInstance.msg = response.result;
        setTimeout(() => {
          modalRef.dismiss('Cross click');
          //window.close();
          let url = RedirectionPage.Home;
          let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
          if(routeLoadIndex >= 0) {
            let routeLoadText = pageTitle[routeLoadIndex].routerText;
            localStorage.setItem(routeLoadText, 'true');
          }
          this.router.navigate([url]);
        }, 2000);
      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+220));
  }

  deleteWorkstream() {   
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'DeleteWs';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!recivedService) {
        return;
      } else {
        this.deleteWorkstreamQuest();        
      }
    });
  }

  // Delete Workstream
  deleteWorkstreamQuest() {
    this.bodyElem.classList.add(this.bodyClass);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    let wsFormData = new FormData();

    let wsData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
      'workstreamId': this.wsId,
      'notifyUsers': this.deleteNotify
    };

    this.wsApi.deleteWorkstream(wsData).subscribe((response) => {
      modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      if(response.status == "Success") { 
        const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        modalMsgRef.componentInstance.msg = response.result;
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
          window.close();
          let url = location.origin;
          window.opener.location = url;
        }, 2000);
      }
    });
  }
    
  // Close Current Window
  closeWindow() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!recivedService) {
        return;
      } else {
        let getNavFrom = localStorage.getItem('navFromUrl');
        if(getNavFrom == RedirectionPage.Workstream) {
          let routeLoadIndex = pageTitle.findIndex(option => option.slug == getNavFrom);
          let routeText = pageTitle[routeLoadIndex].routerText;
          localStorage.setItem(routeText, 'true');
          setTimeout(() => {
            localStorage.removeItem('navFromUrl');
          }, 500);
          this.router.navigate([getNavFrom]);
        } else {        
          this.location.back();
        }
      }
    });
  }

  // tab on user profile page
  taponprofileclick(userId){
    let teamSystem=localStorage.getItem('teamSystem');  
    var aurl='profile/'+userId+'';	
    if(teamSystem){
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else{
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

  compressFile(file, image) {
    let orientation = -1;
    let originalImageSize = this.imageCompress.byteCount(image);
    console.warn('Size in bytes is now:',  originalImageSize);
    this.imageCompress.compressFile(image, orientation, 75, 50).then(result => {
      console.log(result)
      let imgResultAfterCompress = result;
      let sizeOFCompressedImage = this.imageCompress.byteCount(result);
      console.warn('Size in bytes after compression:',  sizeOFCompressedImage);
      
      // call method that creates a blob from dataUri
      let compressImg = imgResultAfterCompress.split(',');
      const imageBlob = this.dataURItoBlob(compressImg);
      setTimeout(() => {
        const imageFile = new File([imageBlob], file.name, {type: file.type});
        this.selectedWsImg = imageFile;
      }, 500);
    });
  }
  
  dataURItoBlob(dataURI) {
    console.log(dataURI)
    const byteString = window.atob(dataURI[1]);
    const mimeString = dataURI[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: mimeString });
    return blob;
  }
}