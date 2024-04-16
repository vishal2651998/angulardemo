import { Component, EventEmitter, OnInit, Input, Output, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ResetpasswordComponent } from '../../authentication/components/auth/resetpassword/resetpassword.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() userPageData: any = []; 
  @Output() userIndexListComponentRef: EventEmitter<UserListComponent> = new EventEmitter();
  @Output() userCallback: EventEmitter<UserListComponent> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass2:string = "profile";
  public bodyClass3:string = "image-cropper";
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  public bodyElem;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  headquartersPageRef: HeadquartersListComponent;
  featuredActionName: string;
  public apiKey: string = Constant.ApiKey;
  dekraNetworkId:any;
  public user: any;
  public domainId;
  public userId;
  regionName:string="";
  addUserVisible = false;
  userData : any = [];
 
  public access = "";
  public userList = [];
  public displayFlag: boolean = false;
  level:string="";
  subLevel:string = "";
  shopData:any;
  currentAttribute:any;
  currentItem:any;
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;

  public itemLength: number = 0;
  public itemTotal: number = 0;
  public itemList: object;
  public displayNoRecordsShow = 0;
  public itemEmpty: boolean;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public fieldEnable: boolean = false;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public opacityFlag: boolean = false;
  public dekraNetworkHqId: string = '';
  public locationFilter:string
  public radioOptions: string = '1';
  public searchVal: string = "";
  public itemLimit: any = 20;
  public itemOffset: any = 0;
  public roleId;
  public countryId='';
  public defaultpasswordcheck:boolean=true;
  public custompasswordcheck:boolean=false;
  public passwordchecker:boolean = false;
  public successPasswordTextIcon: boolean = false;
  public disableDefaultPasswordText :boolean = false;
  public passwordValidationError:boolean = false;
  public passwordValidationErrorMsg: string = '';
  public displayValidationforreset:boolean=false;
  public ResetpasswordcontentValue: string = '';
  public resetpassvalidationmsg: string='';
  public passwordLen:number = 6;
  public accounthaspasswordError=false;
  public platformId: string;
  public apiData: Object;
  public tableRemoveHeight: number = 160;
  public userListColumns = [];
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  currentShopData: any;
  shopId: string | Blob;
  newuserForm =  this.userForm.group({
    newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
  })
  lastSelectedUser: any = "";
  lastLocation: string = "";
  displaydiaLog: boolean = false;
  public resetpasswordForm= this.userForm.group(
    {
      Resetradioaction:['1',Validators.required],

    Resetpasswordcontent:['',Validators.required],
}
  );
  resetPassData: any;
  public isFilterApplied: boolean;
  public sortFieldEvent: string;
  public sortOrderField = 0;
  public dataFilterEvent: any;
    // Resize Widow
    @HostListener("window:resize", ["$event"])
    onResize(event) {
      this.bodyHeight = window.innerHeight;
      
      this.setScreenHeight();
  
      setTimeout(() => {
        if (!this.displayNoRecords) {
          let listItemHeight;
          listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
          document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;
    
          console.log(this.itemTotal, this.itemLength,  this.innerHeight, listItemHeight);
    
          if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.getUserList();
            this.lastScrollTop = this.scrollTop;
          } 
        }
      }, 1500);
  
    }
  
    // Scroll Down
    @HostListener("scroll", ["$event"])
    onScroll(event: any) {
      this.scroll(event);
    }

    get registerFormControl() {
      return this.resetpasswordForm.controls;
    }

  constructor(private router:Router,private modalService: NgbModal,private headQuarterService: HeadquarterService,private authenticationService: AuthenticationService,    public activeModal: NgbActiveModal,
    private userForm: FormBuilder,
    ) { 

  router.events.forEach((event) => {
    if (event instanceof NavigationEnd) {
      if(event.url.includes("all-shops")){
        this.level =  "";
        this.subLevel =  "";    
        this.shopId = event.url.split('/')[4];    
      }else{
        this.level =  event.url.split('/')[3];
        this.subLevel =  event.url.split('/')[4];    
        this.shopId =  event.url.split('/')[6];     
      }
     }
  })

  }

  onChangeRadio($event: MatRadioChange)
{
  this.resetpassvalidationmsg = '';

if($event.value != undefined){
  if($event.value==2)
  {
    this.displayValidationforreset=true;
  }
  else
  {
    this.displayValidationforreset=false;
    this.ResetpasswordcontentValue = '';
    this.passwordValidationError = false;
    this.passwordValidationErrorMsg = '';
  }
}
}


  navigateToProfile(id){
    this.lastSelectedUser = id;
    this.lastLocation = this.router.url;
    this.headQuarterService.userListState = this;
  }

  checkresetpasstext(event)
{
  this.resetpassvalidationmsg = '';
  //if(event.target.value!='')
  //{
    this.radioOptions= '2';
    this.displayValidationforreset=true;

    if(this.passwordchecker){
      this.fieldEnable = false;
      var inputVal = event.target.value.trim();
      var inputLength = inputVal.length;

      if(this.passwordLen<=inputLength){
        this.checkPwdStrongValidation('reset');
      }
      else{
        if(inputLength == 0){
          this.passwordValidationError = false;
          this.passwordValidationErrorMsg = '';
        }
        if(this.passwordValidationError){
          this.checkPwdStrongValidation('reset');
        }
        this.disableDefaultPasswordText = false;
        this.successPasswordTextIcon = false;
      }
    }

 // }
  //else
 // {
    //this.custompasswordcheck=false;
   // this.defaultpasswordcheck=true;
   // this.displayValidationforreset=false;
  //}

console.log(event.target.value);

}

  cancelresetpopup(){
    this.displaydiaLog = false;
  }

  restoreState(){
    if(this.headQuarterService.userListState && this.headQuarterService.userListState.lastLocation == this.router.url){
      this.userList = this.headQuarterService.userListState.userList;
      this.itemOffset = this.headQuarterService.userListState.itemOffset;
      this.lastSelectedUser = this.headQuarterService.userListState.lastSelectedUser;
      this.locationFilter = this.headQuarterService.userListState.locationFilter;
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("editUserId", this.lastSelectedUser);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      this.headQuarterService.getUserList(apiFormData).subscribe((response:any) => {
        setTimeout(() => {
          document.getElementsByClassName("p-datatable-scrollable-body ng-star-inserted")[0].scrollTop = this.headQuarterService.userListState.scrollTop
        }, 500);
        if(response && response.items.length > 0)
        this.userList = this.userList.map(e=>{
          if(e.userId == response.items[0].userId){
            return response.items[0];
          }else{
            return e;
          }
        })
        this.loading = false;
      })
    }else{
      this.getUserList();
    }
  }

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.innerHeight = (this.access == 'all-users') ? this.innerHeight : this.innerHeight;
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
    this.tableRemoveHeight = (this.access == 'all-users') ? headerHeight + 130 :  headerHeight + 130;
  }

  checkPwdStrongValidation(type){
    if(this.passwordchecker){
      let pwdVal;
      if(type == 'reset'){
        pwdVal = this.resetpasswordForm.value.Resetpasswordcontent.trim();
      }
      else{
        pwdVal = this.newuserForm.value.newUserTmpPassword.trim();
      }
  
      let validateMsg = this.authenticationService.checkPwdStrongLength(pwdVal,this.passwordLen);
      if(pwdVal.length>0){
        if(validateMsg==''){
          this.passwordValidationError = false;
          this.disableDefaultPasswordText = true;
          this.successPasswordTextIcon = true;
          this.passwordValidationErrorMsg = '';
        }
        else{
          this.passwordValidationError = true;
          this.disableDefaultPasswordText = false;
          this.successPasswordTextIcon = false;
          this.passwordValidationErrorMsg = validateMsg;
        }
      }
      else{
        this.passwordValidationError = false;
        this.disableDefaultPasswordText = false;
        this.successPasswordTextIcon = false;
        this.passwordValidationErrorMsg = '';
      }
    }
  }

  onSubmitresetForm(userId)
{
  this.loading=true;
  let submitresetform;
 // console.log(userId);
  let resetforms =this.resetpasswordForm.value;
  let resetradioVal=resetforms.Resetradioaction;
  let resetpassVal=resetforms.Resetpasswordcontent;
  let resetuserId=userId;
  if(resetradioVal==1)
  {
     resetpassVal='password123';
     submitresetform=true;
  }
  else
  {
    resetpassVal=resetforms.Resetpasswordcontent;
    if(resetpassVal!='')
    {


      if(this.passwordLen>resetpassVal.length || this.passwordValidationError){
        this.accounthaspasswordError=true;
        return;
      }
      else
      {
        this.accounthaspasswordError=false;
      }

      submitresetform=true;

    }
  }
  if(submitresetform)
  {

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('logged_user', this.apiData['userId']);
    apiFormData.append('userid', resetuserId);
    apiFormData.append('password', resetpassVal);
    apiFormData.append('cpassword', resetpassVal);
    apiFormData.append('access_type', 'desktop');

    // this.userDashboardApi.updateuserpassbyAdmin(apiFormData).subscribe((response) => {
    //   if(response.status=="Success" || response.status=="1")
    //   {
    //     this.displaydiaLog = false;
    //     this.cancelresetpopup();
    //     const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
    //     modalMsgRef.componentInstance.msg = 'Password reset successfully';
    //     setTimeout(() => {
    //       modalMsgRef.dismiss('Cross click');
    //       //this.showuserdashboard(1);
    //       this.loading=false;
    //     }, 2000);
    //   }
    //   else
    //   {
    //     this.loading=false;
    //     this.resetpassvalidationmsg=response.message;

    //   }
    // });
  }

  //console.log(this.resetpasswordForm.value);

}

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4); 

    this.dekraNetworkId = this.userPageData.dekraNetworkId;
    this.access = this.userPageData.roaccess;
    this.domainId = this.userPageData.domainId;
    this.user = this.authenticationService.userValue;
    this.userId = this.userPageData.userId;
    this.roleId = this.userPageData.roleId;
    this.apiKey = this.userPageData.apiKey;
    this.countryId = this.userPageData.countryId;
    this.shopId = this.userPageData.shopId;
    if(this.router.url.includes("all-shops")){
      this.level =  "";
      this.subLevel =  "";    
      this.shopId = this.router.url.split('/')[4];    
    }else{
      this.level =  this.router.url.split('/')[3];
      this.subLevel =  this.router.url.split('/')[4];    
      this.shopId =  this.router.url.split('/')[6];     
    }

    if(this.access == 'all-users'){
    this.userListColumns = [
      { field: 'firstName', header: 'Users ', columnpclass: ' header usr-thl-col-1 col-sticky', sortName: 'Username' },
      { field: 'title', header: 'Title', columnpclass: ' header usr-thl-col-2'},
      { field: 'businessRoleStr', header: 'Bussiness Role', columnpclass: ' header usr-thl-col-3'},
      { field: 'deptName', header: 'Department', columnpclass: ' header usr-thl-col-4', sortName: 'deptName' },
      { field: 'userId', header: 'ID', columnpclass: ' header usr-thl-col-5', sortName: 'LoginID' },
      { field: 'phoneNo', header: 'Mobile Number', columnpclass: ' header usr-thl-col-6'},
      { field: 'email', header: 'Email', columnpclass: ' header usr-thl-col-7', sortName: 'EmailAddress' },
      { field: 'userTypeStr', header: 'Account Type', columnpclass: ' header usr-thl-col-3'},
      { field: 'managerStr', header: 'Manager', columnpclass: ' header usr-thl-col-9 '},      
      { field: 'levelOneName', header: 'Level 1', columnpclass: ' header usr-thl-col-9'},
      { field: 'levelTwoName', header: 'Level 2', columnpclass: ' header usr-thl-col-9'},
      { field: 'levelThreeName', header: 'Level 3', columnpclass: ' header usr-thl-col-9'},
      { field: 'shopName', header: 'Shop Name', columnpclass: ' header usr-thl-col-9'},
      { field: 'isActive', header: 'Status', columnpclass: ' header usr-thl-col-9', sortName: 'IsAccountActive' },
      { field: '', header: '', columnpclass: ' header usr-thl-col-10 col-sticky'},
    ];
  }
  else{
    this.userListColumns = [
      { field: 'firstName', header: 'Users ', columnpclass: 'header usr-thl-col-1 col-sticky', sortName: 'Username' },
      { field: 'title', header: 'Title', columnpclass: 'header usr-thl-col-2' },
      { field: 'businessRoleStr', header: 'Bussiness Role', columnpclass: 'header usr-thl-col-3' },
      { field: 'deptName', header: 'Department', columnpclass: 'header usr-thl-col-4', sortName: 'deptName'},
      { field: 'userId', header: 'ID', columnpclass: 'header usr-thl-col-5', sortName: 'LoginID' },
      { field: 'phoneNo', header: 'Mobile Number', columnpclass: 'header usr-thl-col-6' },
      { field: 'email', header: 'Email', columnpclass: ' header usr-thl-col-7', sortName: 'EmailAddress' },
      { field: 'userTypeStr', header: 'Type', columnpclass: 'header usr-thl-col-3' },
      { field: 'managerStr', header: 'Manager', columnpclass: 'header usr-usr-thl-col-9 ' },
      { field: 'isActive', header: 'Status', columnpclass: 'header usr-thl-col-9', sortName: 'IsAccountActive' },
      { field: '', header: '', columnpclass: 'header usr-thl-col-10 col-sticky' },
    ];
  }

    window.addEventListener('scroll', this.scroll, true);
    this.getShopDetails();
    // this.headquartersComponentRef.emit(this);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
    }, 1500);

    this.userCallback.emit(this);

  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset - 80;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if(inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
          this.lazyLoading = true;
          this.scrollCallback = false;
          this.getUserList();
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }



  changeStatus(type,userData){
    const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("platform", '3');
      apiFormData.append("userId", this.userId);
      apiFormData.append("networkId", this.dekraNetworkId);
      apiFormData.append("id", userData.userId);
      apiFormData.append("email", userData.email);
      apiFormData.append("firstName", userData.firstName);
      apiFormData.append("lastName", userData.lastName);
      this.userList = this.userList.map(e=>{
        if(e.userId == userData.userId){
          if(type == "active"){
          e.isActive = 1;
          }else{
            e.isActive = 0;
          }
        }
        return e;
      })
      if(type == "active"){
        apiFormData.append("isActive", "1");      
      }else{
        apiFormData.append("isActive", "2");      
      }

      this.headQuarterService.saveuser(apiFormData).subscribe((response: any) => {       
        this.showSuccessPopup()
        if(type == "active"){
          userData["isActive"] = 1;
        }else{
          userData["isActive"] = 0;
        }
      })
  }

  showSuccessPopup(){
    const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
      msgModalRef.componentInstance.successMessage = "User status updated!";
    setTimeout(() => {
      msgModalRef.dismiss('Cross click'); 
      this.activeModal.close();    
    }, 1000);
}

openResetPassword(userData){
  this.displaydiaLog = true;
  this.resetPassData = userData;
}




  openUserPOPUP(actiontype,item='') {  
    this.addUserVisible = true;
    this.userData = {
      parentId: this.headQuarterService.currentShopId,
      actiontype: actiontype,
      actionFormType: 'shop',
      formType: '',
      item: item,
      titletext: '',
    }    
  }
  closeDrawer(){
    this.addUserVisible = false;
    this.getUserList();
  }


  onDrawerDismiss(event: any) {
    this.addUserVisible = false;
    if(event.action == 'cancel') {
      this.addUserVisible = false;
      this.itemOffset = 0;
      this.getUserList();
    }
    else {
      console.log(event.data[0]);
      let contactData = event.data[0];  

     /* let contactData = 
        {
          "userId": 41,
          "userName": "sampleuser 6_1",
          "email": "sampleuser6@yopmail.com",
          "createdOn": "2023-10-17 12:45:44",
          "updatedOn": "0000-00-00 00:00:00",
          "profileImage": "https://cbt-demo-file-output.s3-accelerate.amazonaws.com/userprofile/thumb_profile_image.png",
          "roleId": 1,
          "userType": 2,
          "managerId": 8,
          "deptName": "Tech",
          "empId": "40",
          "businessRole": 1,
          "domainId": 2,
          "isPrimaryHq": 0,
          "hqId": 0,
          "levelOneId": 0,
          "levelTwoId": 0,
          "levelThreeId": 0,
          "hqName": "",
          "levelOneName": "",
          "levelTwoName": "",
          "levelThreeName": "",
          "levelOneParentName": "",
          "levelTwoParentName": "",
          "levelThreeParentName": "",
          "firstName": "sampleuser",
          "lastName": "6",
          "title": "Technician",
          "phoneNo": "(343) 434-3423",
          "countryName": "Canada",
          "countryCode": "CA",
          "dialCode": "+1"
      }*/
      

      let itemIndex1 = this.userList.findIndex(option => option.userId == contactData.userId );
      if(itemIndex1 == -1){
        this.userList.unshift(contactData);
        this.itemTotal = this.itemTotal + 1;
        this.itemLength = this.itemLength + 1;
        setTimeout(() => {
          this.userCallback.emit(this);
        }, 100);
      }
      else{
        this.userList[itemIndex1] = (contactData);
      }
         
      setTimeout(() => {
        this.addUserVisible = false;
      }, 100);
      this.itemOffset = 0;
      this.getUserList();
    }
  }

  // Get SHOP List
  getUserList() {

    if(this.itemOffset == 0){
      this.userList = [];
      this.itemTotal = 0;
      this.itemLength = 0;
    }

    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append('limit', this.itemLimit);
    apiFormData.append('offset', this.itemOffset);
    if(this.locationFilter){
      if(this.locationFilter.toString().includes("h")){
        let filter = this.locationFilter.replace("h","")
        apiFormData.append('hqId', filter);
      }else{
        apiFormData.append('shopId', this.locationFilter);
      }
    }
    if(this.access == 'all-users'){
    }
    else{
      apiFormData.append("shopId", this.shopId);
    }

    apiFormData.append('sortFieldEvent', this.sortFieldEvent ? this.sortFieldEvent: '');
    apiFormData.append('sortOrderField', this.sortOrderField ? this.sortOrderField.toString() : '');
    apiFormData.append('dataFilterEvent', this.dataFilterEvent ? this.dataFilterEvent : '');

    if(this.user && this.user.data && this.user.data.shopId){
      apiFormData.append("shopId",this.user.data.shopId);
    }

    this.headQuarterService.getUserList(apiFormData).subscribe((response:any) => {
      console.log(response);

      let resultData = [];

        resultData = response.items;
        this.itemTotal = response.total;
        this.loading = false;
        this.lazyLoading = this.loading;

        

      if(this.itemTotal>0){
        if(resultData.length>0){
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemEmpty = false;
            this.displayNoRecords = false;

            resultData.forEach(item => {
              this.userList.push(item);
            });

            
            console.log(this.userData)
            this.itemLength += resultData.length;
            this.itemOffset += this.itemLimit;
                  }
      }
      else{
        this.itemEmpty = true;
        this.displayNoRecords = true;
        this.displayNoRecordsShow = 1;
      }
      setTimeout(() => {
        this.userCallback.emit(this);
      }, 100);
      

      console.log(resultData);
        setTimeout(() => {
        if (!this.displayNoRecords) {
          let listItemHeight;
          listItemHeight = document.getElementsByClassName("parts-mat-table")[0] == undefined ? '' :
          document.getElementsByClassName("parts-mat-table")[0].clientHeight + 50;

          console.log(this.itemTotal, this.itemLength,  this.innerHeight, listItemHeight);

          if(this.itemTotal > this.itemLength && this.innerHeight >= listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.getUserList();
            this.lastScrollTop = this.scrollTop;
          }

        }

      }, 1500);
    });

    

  }


  getShopDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("id", this.shopId);
     this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
      if(response && response.items && response.items.length > 0 && response.items[0]){
      
        let resultData:any = [];
        resultData = response.items[0];
        
        
        this.shopData = resultData;
        
        setTimeout(() => {
          this.displayFlag = true;
        }, 1000);

        this.getHqDetails();
      // this.level - this.shopData.level
      }
      })
  }

  getHqDetails(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
     this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
        if(response && response.data && response.data.attributesInfo.length > 0 ){

          if(this.level && this.subLevel){
            let attribute = response.data.attributesInfo.find(e=>(e.id == this.level));
            this.currentAttribute = attribute;
            let currentItem = attribute.items.find(e=>e.id == this.subLevel);
            this.currentItem = currentItem;
          }

          let level1 = response.data.attributesInfo.find(e=>(e.displayOrder == 1));
          let level2 = response.data.attributesInfo.find(e=>(e.displayOrder == 2));
          let level3 = response.data.attributesInfo.find(e=>(e.displayOrder == 3));

          this.shopLevelOneData = level1?.items.find(e=>e.id == this.shopData.levelOneId);
          this.shopLevelTwoData = level2?.items.find(e=>e.id == this.shopData.levelTwoId);
          this.shopLevelThreeData = level3?.items.find(e=>e.id == this.shopData.levelThreeId);
        }

        this.restoreState()
      })
  }

  lazyLoad(event: LazyLoadEvent) {
    const keys = Object.keys(event.filters);
    keys.forEach((key: any) => {
      if (event.filters[key][0]?.value) {
        this.isFilterApplied = true;
      }
    });
    if (event.sortField) {
      this.isFilterApplied = true;
    }
    this.sortFieldEvent = event.sortField;
    this.sortOrderField = event.sortOrder;
    this.dataFilterEvent = event.filters ? JSON.stringify(event.filters) : '';
    if (this.isFilterApplied) {
      this.userList = [];
      this.itemOffset = 0;
      this.getUserList();
    }
  }
}

