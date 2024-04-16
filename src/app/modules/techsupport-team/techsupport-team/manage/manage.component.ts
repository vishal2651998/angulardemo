import { Component, OnInit, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollTopService } from '../../../../services/scroll-top.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { WorkstreamService } from '../../.../../../../services/workstream/workstream.service';
import { CommonService } from '../../../../services/common/common.service';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { SuccessComponent } from '../../../../components/common/success/success.component';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Constant,IsOpenNewTab,RedirectionPage,pageTitle } from '../../../../common/constant/constant';
import { ApiService } from '../../../../services/api/api.service';
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  public sconfig: PerfectScrollbarConfigInterface = {};
  public manageAction: string = '';
  public title:string = '';
  public bodyClass: string = "submit-loader";
  public bodyElem;
  public footerElem;
  public bodyHeight: number;
  public innerHeight: number;
  public teamName: string = '';
  public existingTeamName: string = '';
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

  public wsMaxLen: number = 50;
  public descMaxLen: number = 100;
  public contentTypes: object;
  public selectedContTypes = [];

  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemUserLength: number = 0;
  public itemLoading: boolean = true;
  public itemEmpty: boolean = false;
  public itemTotal: number;
  public itemList:any = [];
  public selectedUsers = [];
  public assignedUsers = [];
  public newAssignedUsers = [];
  public deletedUsers = [];
  public workstreamUserEmpty: boolean = false;
  public url: string = '';
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
  public teamId: number = 0;
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
    private route: ActivatedRoute,
    public location: PlatformLocation,
	  private formBuilder: FormBuilder,
    private scrollTopService: ScrollTopService,
    private wsApi: WorkstreamService,
    private imageCompress: NgxImageCompressService,
    private commonService: CommonService,
    private landingpageService: LandingpageService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
  ) {
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
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
    let teamId = this.route.snapshot.params['tid'];
    this.teamId = (teamId == 'undefined' || teamId == undefined) ? this.teamId : teamId;
    this.manageAction = (this.teamId == 0) ? 'new' : 'edit';
    this.url = 'techsupport-team';
    if(this.manageAction == 'edit'){
      this.headerData = {
        title: 'Edit Team',
        action: 'edit',
        id: this.teamId
      };
      this.title = 'Edit Team';
      this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
      this.techsupportMenus();
    }
    else{
      this.headerData = {
        title: 'New Team',
        action: 'new',
        id: '0'
      };
      this.title = 'New Team';
      this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
      this.setDefaultSetup();
    }

      setTimeout(() => {
      this.userSearchForm = this.formBuilder.group({
        searchKey: ['', [Validators.required]],
      });

      this.bodyHeight = window.innerHeight;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }, 3000 );


    } else {
      this.router.navigate(['/forbidden']);
    }
  }

  // Get Workstream Data
  techsupportMenus() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("teamId", this.teamId.toString());
    apiFormData.append("fromDashboard", "1");    

    this.landingpageService.apiTechSupportMenusAPI(apiFormData).subscribe((response) => {
      if(response.teamMembers || response.teamList) {

        let teamMembers = response.teamMembers.length==0 ? '' : response.teamMembers;
        let teamList = response.teamList.length==0 ? '' : response.teamList;
        if(teamList != ''){
          for (let i in teamList) {
            if(this.teamId == teamList[i].id){
              this.teamName = teamList[i].name;
              this.existingTeamName = teamList[i].name;
              this.imgURL = ( teamList[i].techTeamImage == "") ? null :teamList[i].techTeamImage;
            }
          }
        }
        this.selectedUsers=[];
        if(teamMembers != ''){
          for (let j in teamMembers) {

            let userId=teamMembers[j].userId;
            let userName=teamMembers[j].userName;
            let profileImg=teamMembers[j].profileImg;
            let availability=teamMembers[j].availability;
            let availabilityText;
            switch(availability){
              case 1:
                availabilityText = 'Online';
                break;
              case 0:
                availabilityText = 'Offline';
                break;
              case 2:
                availabilityText = 'Idle';
                break;
              default:
                break;
            }
            this.selectedUsers.push({
              userIndex: j,
              userId: userId,
              uname: userName,
              userName: userName,
              role: '',
              workstreamRole: '',
              profileImg: profileImg,
              availStatus: availabilityText,
              title: '',
              displayFlag: true
            });
            this.assignedUsers.push(userId);
          }
        }
        console.log(this.selectedUsers);
      }
      setTimeout(() => {
        this.setDefaultSetup();
      }, 1);
    });
  }

  setDefaultSetup(){
    this.getUserLists();
    this.newWorkstreamForm = this.formBuilder.group({
      action: [1],
      domainId: [this.domainId],
      countryId: [this.countryId],
      userId: [this.userId],
      teamName: [this.teamName, [Validators.required]],
      //description: [''],
      //contentType: [''],
      //notifyUsers: [1]
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
      'type': 2,
      'techSupport': 1
    };
    this.itemLoading = true;

    this.wsApi.getWorkstreamUsers(apiData).subscribe((response) => {
      if(response.status == "Success") {
        if(this.itemOffset == 0){
          this.itemList = [];
        }
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
            if(arr.length > 0) {
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
    if(this.manageAction == 'edit'){
      this.submitButtonFlag = true;
    }
  }
  onWsChange(val){
    if(val.length > 0) {
      let wsFormData = new FormData();
      wsFormData.append('apiKey', Constant.ApiKey);
      wsFormData.append('domainId', this.domainId);
      wsFormData.append('countryId', this.countryId);
      wsFormData.append('userId', this.userId);
      wsFormData.append('title', val);
      wsFormData.append('teamName', val);
      wsFormData.append('teamId', '0');
      this.landingpageService.checkSupportTeamName(wsFormData).subscribe((response) => {
        console.log(response);
        this.wsExistFlag = (response.status == 'Success') ? false : true;
        this.submitted = this.wsExistFlag;
        this.submitButtonFlag = !this.wsExistFlag ? true : false;
      });
    }
    else{
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

      if(this.manageAction == 'edit'){
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
        this.submitButtonFlag = true;
      }

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
    if(this.manageAction == 'edit'){
      let arr = this.itemList;
      let filteredItem = arr.filter(option => option.userId.indexOf(uid) !== -1);

      if(filteredItem.length > 0) {
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
      this.submitButtonFlag = true;
    }
    else{
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
  }

  // On Submit
  onSubmit() {
    if(!this.submitButtonFlag) {
      return false;
    }
    this.submitted = true;
    if(this.wsExistFlag || this.invalidFile || this.invalidFileSize) {
      return false;
    }
    if(this.newWorkstreamForm.invalid) {
      return;
    }
    let wsFormVal = this.newWorkstreamForm.value;
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Save';
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
    if(this.manageAction == 'edit'){
      modalRef.componentInstance.msg = `<div class="ws-create-msg"> <div class="msg">Updating team <span class="ws-name">${wsFormVal.teamName}..</span></div>`;
    }
    else{
      modalRef.componentInstance.msg = `<div class="ws-create-msg"> <div class="msg">Creating new team <span class="ws-name">${wsFormVal.teamName}..</span></div>`;
    }
    let workstreamImg = (this.imgURL != null) ? this.selectedWsImg : '';
    if(this.manageAction == 'edit'){
      workstreamImg = workstreamImg == undefined ? this.imgURL : workstreamImg;
    }
    else{
      workstreamImg = workstreamImg == undefined ? "" : workstreamImg;
    }

    let selectedUsers: any = JSON.stringify(this.selectedUsers);
    let newAssignedUsers: any = JSON.stringify(this.newAssignedUsers);
    let deletedUsers: any = JSON.stringify(this.deletedUsers);
    let existWs = (wsFormVal.teamName == this.existingTeamName) ? "" : this.existingTeamName;

  	let wsFormData = new FormData();
    wsFormData.append('action', wsFormVal.action);
    wsFormData.append('apiKey', Constant.ApiKey);
    wsFormData.append('domainId', wsFormVal.domainId);
    wsFormData.append('countryId', wsFormVal.countryId);
    wsFormData.append('userId', wsFormVal.userId);
    wsFormData.append('techTeamImage', workstreamImg);
    wsFormData.append('teamName', wsFormVal.teamName);

    if(this.manageAction == 'edit'){
      wsFormData.append('newTeamMembers', newAssignedUsers);
      wsFormData.append('removeTeamMembers', deletedUsers);
      wsFormData.append('oldTeamName', existWs);
      wsFormData.append('teamId', this.teamId.toString());
    }
    else{
      wsFormData.append('newTeamMembers', selectedUsers);
    }

   // new Response(wsFormData).text().then(console.log)

    this.landingpageService.saveTechSupportTeams(wsFormData).subscribe((response) => {
      //modalRef.dismiss('Cross click');
      this.bodyElem.classList.remove(this.bodyClass);
      if(response.status == "Success") {
        modalRef.componentInstance.bgImg = "";
        modalRef.componentInstance.msgType = "";
        if(this.manageAction == 'edit'){
          modalRef.componentInstance.msg = "Team details updated successfully";
        }
        else{
          modalRef.componentInstance.msg = "Team created Successfully";
        }
        //const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        //modalMsgRef.componentInstance.msg = response.result;
        localStorage.setItem("createdTeamId",response.teamId);
        setTimeout(() => {
          localStorage.setItem("createdTeamId",response.teamId);
          modalRef.dismiss('Cross click');
          /*let url = "RedirectionPage.Home;"
          let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
          if(routeLoadIndex >= 0) {
            let routeLoadText = pageTitle[routeLoadIndex].routerText;
            localStorage.setItem(routeLoadText, 'true');
          }*/
          this.router.navigate([this.url]);
        }, 2000);
      }
      else{

      }
    });
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    let footerHeight = 0;
    this.innerHeight = (this.bodyHeight-(headerHeight+footerHeight+220));
  }

  // Close Current Window
  closeWindow() {
    if(this.submitButtonFlag){
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'Cancel';
      modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
        modalRef.dismiss('Cross click');
        if(!recivedService) {
          return;
        } else {
          let getNavFrom = localStorage.getItem('navFromUrl');
          if(getNavFrom == 'techsupport-team') {
            //let routeLoadIndex = pageTitle.findIndex(option => option.slug == getNavFrom);
            //let routeText = pageTitle[routeLoadIndex].routerText;
            //localStorage.setItem(routeText, 'true');
            setTimeout(() => {
              localStorage.removeItem('navFromUrl');
            }, 500);
            this.router.navigate([this.url]);
          } else {
            this.router.navigate([this.url]);
          }
        }
      });
    }
    else{
      this.router.navigate([this.url]);
    }
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
        if(this.manageAction == 'edit'){
          this.submitButtonFlag = true;
        }
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
