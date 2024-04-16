import { Component, OnInit, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { WorkstreamService } from '../../.../../../services/workstream/workstream.service';
import { CommonService } from '../../../services/common/common.service';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SuccessComponent } from '../../../components/common/success/success.component';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant,IsOpenNewTab,RedirectionPage,pageTitle } from '../../../common/constant/constant';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  
  public title:string = 'New Workstream Creation';
  public bodyClass: string = "submit-loader";
  public bodyElem;
  public footerElem;
  public bodyHeight: number;
  public innerHeight: number;
  public platformId;
  public user: any;
  public domainId;
  public userId;
  public role;
  public countryId;
  public loading: boolean = true;
  public headerData: Object;
  public selectedWsImg : File;
  public imgURL: any;
  public submitButtonFlag: boolean = false;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;
  public invalidContentType: boolean = true;
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
  public itemEmpty: boolean = false;
  public itemTotal: number;
  public itemList:any = [];
  public selectedUsers = [];
  public workstreamUserEmpty: boolean = false;

  public wsProfImg = 'assets/images/site/workstream-creation/profile-icon.png';

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public notifyFlag: boolean = false;

  newWorkstreamForm: FormGroup;
  public wsExistFlag: boolean = false;
  public submitted: boolean = false;
  public wsUserSearchClose: boolean = false;
  
  public userSearchForm: FormGroup;
  public userSearchTick: boolean = false;
  public userSearchClose: boolean = false;
  public userSubmitted:boolean = false;
  public successMsg: boolean = false;
  public wsSearchVal: string = "";
  public searchVal: string = "";
  public wsFlag: any = null;

  public pageAccess: string = "newWorkstream";
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
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

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }

  constructor(
    private titleService: Title,
    private router: Router,
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
    public apiUrl: ApiService
  ) {
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  // convenience getters for easy access to form fields
  get f() { return this.newWorkstreamForm.controls; }

  // convenience getter for easy access to form fields
  get u() { return this.userSearchForm.controls; }

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

      this.headerData = {        
        title: 'New Workstream Creation',
        action: 'new',
        id: '0'     
      };
      
      this.role = localStorage.getItem('userRole');
      
      setTimeout(() => { 
      let profileImg = localStorage.getItem('userProfile');   
      console.log(profileImg);
      //let profileImg = this.apiUrl.profileImage; 
      console.log(profileImg);
      let uname = 'You';

      this.selectedUsers.push({
        userIndex: -1,
        userId: this.userId,
        uname: uname,
        userName: uname,
        role: 'Workstream Admin',
        workstreamRole: '',
        profileImg: profileImg,
        availStatus: 'online',
		    title: this.role,
        displayFlag: true
      });
  
      this.userSearchForm = this.formBuilder.group({
        searchKey: ['', [Validators.required]],
      });

      this.bodyHeight = window.innerHeight;    
      setTimeout(() => {
        this.setScreenHeight();  
      }, 500);

      this.getWorkstreamData();
      this.newWorkstreamForm = this.formBuilder.group({
        action: [1],
        domainId: [this.domainId],
        countryId: [this.countryId],
        userId: [this.userId],
        workstreamName: ['', [Validators.required]],
        description: [''],
        contentType: [''],
        notifyUsers: [1]
      });

        
    }, 3000 );
    

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
      'action': 'new'
    };

    this.wsApi.getWorkstreamDetail(apiData).subscribe((response) => {
      if(response.status == "Success") {
        let resultData = response.workstreamDetails;
        this.contentTypes = resultData.contentTypes;
        for(let c in this.contentTypes) {
          let defaultSelection = this.contentTypes[c].isDefault;
          if(defaultSelection == 1) {
            this.selectedContTypes.push(this.contentTypes[c].id)
            this.contentTypes[c].isDisabled = true;
          } else {
            this.contentTypes[c].isDisabled = false;
          }
        }
        if(this.platformId == 1){
          this.getCategoryData();
        }        
        this.getUserLists();
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

    this.wsApi.getCategoryDetail(wsNameData).subscribe((response) => {
      if(response.status == "Success") {
        this.categories = response.items;
        for(let c in this.categories) {
          let defaultSelection = this.categories[c].isDefault;
          if(defaultSelection == 1) {
            this.selectedCategories.push(this.categories[c].id)
            this.categories[c].isDisabled = true;
          } else {
            this.categories[c].isDisabled = false;
          }
        }
      }
    });  
  }

  // Get User Lists
  getUserLists() {
    let apiData = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'action': 'new',
      'searchKey': this.searchVal,
      'limit': this.itemLimit,
      'offset': this.itemOffset,
      'type': 2
    };
    this.itemLoading = true;

    this.wsApi.getWorkstreamUsers(apiData).subscribe((response) => {
      if(response.status == "Success") {
        this.loading = false;
        let resultData = response.allUsers;
        this.itemLoading = false;
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
            let uid = resultData[item].userId;
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
            this.itemList.push(resultData[item]);
            let arr = this.selectedUsers;
            if(arr.length > 1) {
              let filteredItem = arr.filter(option => option.userId.indexOf(uid) !== -1);
              if(filteredItem.length > 0) {
                let chkFilteredItem = this.itemList.filter(option => option.userId.indexOf(uid) !== -1);
                if(chkFilteredItem.length > 0) {
                  let itemIndex = this.itemList.findIndex(option => option.userId == uid);
                  this.itemList[itemIndex].disabledState = 1;
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
      let wsVal = this.newWorkstreamForm.value.workstreamName;
      this.submitButtonFlag = (wsVal != '' && !this.wsExistFlag && this.selectedContTypes.length > 1) ? true : false;
    }
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
      this.compressFile(this.selectedWsImg, this.imgURL);
    }  
  }

  // Remove Uploaded File
  deleteUploadedFile() {
    this.selectedWsImg = null;
    this.imgURL = this.selectedWsImg;
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
        'workstreamId': 0,
        'action': 'new',
        'title': val
      };
      this.checkWorkstreamName(apiData);
    } else {
      this.wsExistFlag = false;
      this.submitted = false;
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
    this.newWorkstreamForm.value.notifyUsers = status;
  }

  // User Selection
  userSelection(index, userData) {
    let uid = userData.userId;
    let uname = userData.userName;
    let status = userData.disabledState;
    let wsRole = userData.workstreamRole;
	  let title = userData.userRole;
    let role = (userData.workstreamRole == "") ? 'Member' : wsRole;
    if(status == 0) {
      let userStatus = 1;
      this.itemList[index].disabledState = userStatus;
      this.selectedUsers.push({
        userIndex: index,
        userId: uid,
        uname: uname,
        userName: uname,
        workstreamRole: role,
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
  onSearchChange(searchValue : string ) {  
    this.userSearchForm.value.search_keyword = searchValue;
    this.userSearchTick = (searchValue.length > 0) ? true : false;
    this.userSearchClose = this.userSearchTick;
    this.searchVal = searchValue;
    if(searchValue.length == 0) {
      this.clearSearch();
    }
  }

  // Submit Search
  submitSearch() {
    this.itemLimit = 20;
    this.itemOffset = 0;
    this.itemLength = 0;
    this.itemTotal = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.itemList = [];
    this.getUserLists();
  }

  // Clear Search
  clearSearch() {
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
  }

  // Remove Selection
  removeSelection(index, uid) {
    let arr = this.itemList;
    let filteredItem = arr.filter(option => option.userId.indexOf(uid) !== -1);
    if(filteredItem.length > 0) {
      let itemIndex = arr.findIndex(option => option.userId == uid);
      this.itemList[itemIndex].disabledState = 0;
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.splice(index, 1);
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

    if(this.newWorkstreamForm.invalid) {
      return;
    }
    
    let wsFormVal = this.newWorkstreamForm.value;
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Publish';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!recivedService) {
        return;
      } else {
        this.newWorkstream(wsFormVal);
      }
    });
  }

  // New Workstream
  newWorkstream(wsFormVal) {
    this.bodyElem.classList.add(this.bodyClass);
    //const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
    console.log(this.imgURL, this.selectedWsImg);
    let wsImg = (this.imgURL == null || this.imgURL == undefined || this.imgURL == 'undefined') ? 'assets/images/site/workstream-creation/workstream-circle.png' : this.imgURL;
    const modalRef = this.modalService.open(SuccessComponent, this.modalConfig);
    modalRef.componentInstance.bgImg = wsImg;
    modalRef.componentInstance.msgType = "html";
    modalRef.componentInstance.msg = `<div class="ws-create-msg"> <div class="msg">Creating new workstream <span class="ws-name">${wsFormVal.workstreamName}..</span></div>`;
    let workstreamImg = (this.imgURL != null) ? this.selectedWsImg : '';
    let category: any;
    if(this.showCategoryType){
      category = JSON.stringify(this.selectedCategories);
    }
    let contentType: any = JSON.stringify(this.selectedContTypes);
    let selectedUsers: any = JSON.stringify(this.selectedUsers);
 	
  	let wsFormData = new FormData();
    wsFormData.append('action', wsFormVal.action);
    wsFormData.append('apiKey', Constant.ApiKey);
    wsFormData.append('domainId', wsFormVal.domainId);
    wsFormData.append('countryId', wsFormVal.countryId);
    wsFormData.append('userId', wsFormVal.userId);
    wsFormData.append('workstreamImage', workstreamImg);
    wsFormData.append('workstreamName', wsFormVal.workstreamName);
    wsFormData.append('description', wsFormVal.description);
    wsFormData.append('contentTypes', contentType);
    if(this.showCategoryType){
      wsFormData.append('threadCategories', category); 
    }       
    wsFormData.append('notifyUsers', wsFormVal.notifyUsers);
    wsFormData.append('workStreamUsers', selectedUsers);

    //new Response(wsFormData).text().then(console.log)
    //return false;
	
    this.wsApi.newWorkstream(wsFormData).subscribe((response) => {
      //modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      if(response.status == "Success") {
        modalRef.componentInstance.bgImg = "";
        modalRef.componentInstance.msgType = "";
        modalRef.componentInstance.msg = response.result;
        //const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        //modalMsgRef.componentInstance.msg = response.result;
        setTimeout(() => {
          modalRef.dismiss('Cross click');
          //window.close();
          let url = RedirectionPage.Home;
          let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
          if(routeLoadIndex >= 0) {
            let routeLoadText = pageTitle[routeLoadIndex].routerText;
            localStorage.setItem(routeLoadText, 'true');
          }
          this.router.navigate([url])
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