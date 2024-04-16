import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from 'country-data';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { SubmitLoaderComponent } from '../../../components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThreadService } from 'src/app/services/thread/thread.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  @Input() userData: any = [];
  @Output() saveUser = new EventEmitter<Object>();

  public apiKey: string = Constant.ApiKey;
  public user: any;
  public userId;
  public roleId;
  public countryId;
  public domainId;
  public dekraNetworkId: string = '';
  public dekraNetworkHqId: string = '';
  public phoneNumberData: any;
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phonenoInputFlag: boolean = true;
  public phoneNumberValid: boolean = false;
  public invalidNumber: boolean = true;
  public selectedRegion: string = "";
  public item;
  addUserForm: FormGroup = this.formBuilder.group({});
  submitted:boolean = false;
  public passwordLen:number = 8;
  public passwordchecker:boolean = true;
  public successPasswordTextIcon: boolean = false;
  public disableDefaultPasswordText :boolean = false;
  public passwordValidationError:boolean = false;
  public passwordValidationErrorMsg: string = '';
  public fieldEnable: boolean = true;
  public primayContactFlag: boolean = false;
  public actionTitle = 'New User';
  public contactFlagShow: boolean = false;
  public primaryContactFlagShow: boolean = false;
  public existErrorFlag = true;
  public actionFormType = '';
  public parentId ='';

  submitClicked = false
  formProcessing: boolean = false;
  public fieldName: string = '';
  public existErrorMsg: string = '';
  public loading: boolean = true;
  public roleData: any = [];
  public businessRoleData: any = [];
  public managerData: any = [];

  public emailValidationError: boolean = false;
  public emailValidationErrorMsg: string = '';
  public actionType: string = '';

  public bodyElem;
  public bodyClass1: string = "submit-loader";
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  shopList: any = [];
  stateDropdownData: any = [];
  companyStateDropdownData: any = [];
  levelAddressFlag = false;
  loadingShops: boolean = false;
  hq: any = [];
  public passHidden: boolean = true;
  public moreUserInfo: boolean = false;
  constructor(
    private formBuilder:FormBuilder,
    private authenticationService: AuthenticationService,
    private headQuarterService: HeadquarterService,
    private modalService: NgbModal,
    private threadApi: ThreadService,
  ) { }
  

  get scf() { return this.addUserForm.controls; }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.dekraNetworkHqId = localStorage.getItem("dekraNetworkHqId") != undefined ? localStorage.getItem("dekraNetworkHqId") : '';

    // update
    console.log(this.userData);
    this.moreUserInfo = this.userData.moreUserInfo != undefined ? this.userData.moreUserInfo : false;
    this.actionType = this.userData.actiontype;
    this.actionFormType = this.userData.actionFormType;
    this.parentId = this.userData.parentId;
    this.contactFlagShow = this.userData.actionFormType == 'hq' && this.userData.primaryLocaion ? true : false; 
    this.primaryContactFlagShow = this.userData.actionFormType == 'shop' ? true : false; 
    let action = this.userData.actiontype;
    let formType = this.userData?.formType || 'User';
    let item = this.userData.item;
    let titletext = this.userData.titletext; 
    setTimeout(() => {
      this.serviceAction(action,item,titletext,formType); 
    }, 500);   
    this.loadCountryStateData();
    this.getShopList();
    this.getList('manager');  
    this.getList('role');  
    this.getList('businessrole');
    this.emptyPhoneData();   
  }

    // check email validation
    checkEmailValition() {
      console.log(456)
      let emailVal = '';
      var emailError;
      emailVal = this.addUserForm.value.email.trim();
      emailError = this.addUserForm.controls.email.errors;
      console.log(emailVal)
      if (emailVal.length > 0) {
        this.emailValidationError = false;
        this.emailValidationErrorMsg = "";
        if (emailError) {
          this.emailValidationError = true;
          this.emailValidationErrorMsg = "Invalid Email";
        }
      }
      else{
        this.emailValidationError = false;
        this.emailValidationErrorMsg = "";
      }
    }

    getShopList(){
        this.loadingShops = true;
        const apiFormData = new FormData();
        apiFormData.append("apiKey", this.apiKey);
        apiFormData.append("domainId", this.domainId);
        apiFormData.append("networkId",this.user.networkId.toString());
        this.headQuarterService.getShopList(apiFormData).subscribe((res:any)=>{
          this.getHqDetails()
          if(res && res.items && res.items.length > 0){
            this.shopList = res.items;
          }else{
            this.shopList = [];
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
        this.loadingShops = false;
          if(response && response.data && response.data.hqInfo && response.data.hqInfo.length > 0 ){
           let hqs = response.data.hqInfo.map((e)=>{
              return {id:e.id+"h",name:e.name}
            })

            this.hq =  response.data.hqInfo
            this.shopList = this.shopList.concat(hqs)
          }
        })
    }

    onToggleBoxChange(event){
      this.levelAddressFlag = event;
      if(!event){
        this.addUserForm.controls["address1"].disable();
        this.addUserForm.controls["address2"].disable();
        this.addUserForm.controls["state"].disable();
        this.addUserForm.controls["city"].disable();
        this.addUserForm.controls["zip"].disable();
      }else{
        this.addUserForm.controls["address1"].enable();
        this.addUserForm.controls["address2"].enable();
        this.addUserForm.controls["state"].enable();
        this.addUserForm.controls["city"].enable();
        this.addUserForm.controls["zip"].enable();
      }
    }

    /*loadCountryStateData() {
      this.threadApi.countryMasterData().subscribe((response: any) => {
        if (response.status == "Success") {
          this.stateDropdownData = response.data.stateData;
          response.data?.countryData.forEach((country: any) => {
            let companyObject: any = {
              id: country.name,
              name: country.name,
              items: [],
            }
            response.data?.stateData?.forEach((state: any) => {
              let stateObject: any = {};
              if (state.country_id == country.id) {
                stateObject.id = state.name;
                stateObject.name = state.name;
                companyObject?.items.push(stateObject);
              }
            });
            this.companyStateDropdownData.push(companyObject);
          });
        }
        else {
  
        }
      }, (error: any) => {
  
      });
      }*/

      loadCountryStateData() {
        this.threadApi.countryMasterData().subscribe((response: any) => {
          if (response.status == "Success") {
            //this.countryDropdownData = response.data.countryData;
            this.stateDropdownData = response.data.stateData;
            this.companyStateDropdownData = [];
            response.data?.countryData.forEach((country: any) => {
              let companyObject: any = {
                id: country.name,
                name: country.name,
                items: [],
              }
              response.data?.stateData?.forEach((state: any) => {
                let stateObject: any = {};
                if (state.country_id == country.id) {
                  stateObject.id = state.name;
                  stateObject.name = state.name;
                  companyObject?.items.push(stateObject);
                }
              });
              this.companyStateDropdownData.push(companyObject);
            });
          }
          else {
    
          }
        }, (error: any) => {
    
        });
    
        console.log(this.companyStateDropdownData)
      }

  // Create New Options
  serviceAction(action, item: any = '', titletext, formType) {   
    console.log(item,action,titletext);
    this.submitClicked = false;
    this.formProcessing = false;
    this.phoneNumberValid = false;
    this.fieldName = titletext;
    this.actionTitle = ((action == 'new') ? 'New ' : 'Edit ') + formType;
    if(formType == 'User' && titletext == 'User Info' || titletext == 'User Profile Info'){ this.actionTitle = ((action == 'new') ? 'New ' : 'Edit ') +  titletext };
    let citem = (action == 'new') ? '' : item; 
    this.levelAddressFlag = (action == 'new') ? false : item.addressFlag == 1 ? true: false;
    this.createForm(citem);  
    this.loading = false;   
  }

  createForm(item: any = '') {    
    console.log(item);
    let title, businessRole, deptName, empId, roleId, managerId = '';
    let primaryContact, firstName, lastName, email, password, isPrimaryHq, countryName,countryCode,dialCode,shopId,phone,address1,address2,city,state,zip;
    let contactId = (item == '') ? 0 : item.userId;
    if(this.moreUserInfo){
      title = (item == '') ? '' : item.title;
      businessRole = (item == '') ? '' : item.businessRole;
      deptName = (item == '') ? '' : item.deptName != undefined && item.deptName != null ? item.deptName : '';
      empId = (item == '') ? '' : item.empId != undefined && item.empId != null ? item.empId : '';
      roleId = (item == '') ? '' : item.roleId;
      managerId = (item == '') ? '' : item.managerId;
    }    
    else{
      primaryContact = (item == '') ? false : (item.primaryContact == 1 ? true : false);
      firstName = (item == '') ? '' : item.firstName;
      lastName = (item == '') ? '' : item.lastName;
      email = (item == '') ? '' : item.email;
      password = (item == '') ? '' : item.password;
      isPrimaryHq = item.isPrimaryHq == '1' ? true : false; 
      address1 = (item == '') ? '' : item.address1;
      address2 = (item == '') ? '' : item.address2;
      city = (item == '') ? '' : item.city;
      state = (item == '') ? '' : item.state;
      zip = (item == '') ? '' : item.zip;
      countryName = (item == '') ? '' : item.countryName;
      countryCode = (item == '') ? '' : item.countryCode;
      dialCode = (item == '') ? '' : item.dialCode;
      shopId = (item == '') ? '' : item.shopId ? item.shopId : item.hqId + "h";
      phone = (item == '') ? '' : item.phoneNo;
      this.icountryCode = (item = '') ? this.icountryCode : countryCode;
      this.iphoneNumber = (item = '' || item == null) ? this.iphoneNumber : phone;
      this.icountryName = (item = '') ? this.icountryName : countryName;
      this.idialCode = (item = '') ? this.idialCode : dialCode;
      this.phoneNumberData = {
        countryCode: this.icountryCode,
        phoneNumber: this.iphoneNumber,
        country: this.icountryName,
        dialCode: this.idialCode,
        access: 'phone'
      }
    }

    if(!this.moreUserInfo){
      if(this.contactFlagShow){
        if(this.actionType == 'new'){
          this.addUserForm = this.formBuilder.group({
            contactId: [contactId],
            firstName: [firstName, [Validators.required]],
            lastName: [lastName, [Validators.required]],
            email: [email, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            password:[password,[Validators.required, Validators.minLength(this.passwordLen)]],
            //title: [title],
            //businessRole: [businessRole],
            //deptName: [deptName],
            //empId: [empId],
            //roleId: [roleId],
            //managerId: [managerId],
            countryName: [countryName],
            countryCode: [countryCode],
            dialCode: [dialCode],
            phone: [phone],
            primaryContact: [primaryContact],
            isPrimaryHq: [isPrimaryHq],
            shopId: [shopId,[Validators.required]],
            levelAddressFlag: [this.levelAddressFlag],
            address1:[address1],
            address2:[address2],
            city:[city],
            state:[state],
            zip:[zip],

          });

          shopId = this.actionFormType == 'shop' ? this.parentId : '0' ;   
          shopId = this.actionFormType == 'shop' ? this.parentId : '0' ;   
          if(shopId){
            this.addUserForm.controls["shopId"].setValue(shopId);
          }
        }
        else{
          this.addUserForm = this.formBuilder.group({
            contactId: [contactId],
            firstName: [firstName, [Validators.required]],
            lastName: [lastName, [Validators.required]],
            email: [email, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            //title: [title],
            //businessRole: [businessRole],
            //deptName: [deptName],
            //empId: [empId],
            //roleId: [roleId],
            //managerId: [managerId],
            countryName: [countryName],
            countryCode: [countryCode],
            dialCode: [dialCode],
            phone: [phone],
            isPrimaryHq: [isPrimaryHq],
            primaryContact: [primaryContact],
            shopId: [shopId,[Validators.required]],
            levelAddressFlag: [this.levelAddressFlag],
            address1:[address1],
            address2:[address2],
            city:[city],
            state:[state],
            zip:[zip],
          });
        }
        
      }
      else{
        if(this.actionType == 'new'){
          this.addUserForm = this.formBuilder.group({
            contactId: [contactId],
            primaryContact: [primaryContact],
            firstName: [firstName, [Validators.required]],
            lastName: [lastName, [Validators.required]],
            email: [email, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            password:[password,[Validators.required, Validators.minLength(this.passwordLen)]],
            //title: [title],
            //businessRole: [businessRole],
            //deptName: [deptName],
            //empId: [empId],
            //roleId: [roleId],
            //managerId: [managerId],
            countryName: [countryName],
            countryCode: [countryCode],
            dialCode: [dialCode],
            phone: [phone],
            shopId: [shopId,[Validators.required]],
            levelAddressFlag: [this.levelAddressFlag],
            address1:[address1],
            address2:[address2],
            city:[city],
            state:[state],
            zip:[zip],
          });
          shopId = this.actionFormType == 'shop' ? this.parentId : '0' ;   
          if(shopId){
            this.addUserForm.controls["shopId"].setValue(shopId);
          }
        }
        else{
          this.addUserForm = this.formBuilder.group({
            contactId: [contactId],
            primaryContact: [primaryContact],
            firstName: [firstName, [Validators.required]],
            lastName: [lastName, [Validators.required]],
            email: [email, [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            //title: [title],
            //businessRole: [businessRole],
            //deptName: [deptName],
            //empId: [empId],
            //roleId: [roleId],
            //managerId: [managerId],
            countryName: [countryName],
            countryCode: [countryCode],
            dialCode: [dialCode],
            phone: [phone],
            shopId: [shopId,[Validators.required]],
            levelAddressFlag: [this.levelAddressFlag],
            address1:[address1],
            address2:[address2],
            city:[city],
            state:[state],
            zip:[zip],
          });
        }
        
      }  
      if(this.userData && this.userData.hideLocation !== undefined && this.userData.hideLocation == false){
        this.addUserForm.controls["shopId"].disable()
      }
  
      this.onToggleBoxChange(this.levelAddressFlag);
    }
    else{
      this.addUserForm = this.formBuilder.group({
        contactId: [contactId],
        title: [title],
        businessRole: [businessRole],
        deptName: [deptName],
        empId: [empId],
        roleId: [roleId],
        managerId: [managerId],
      });
    }
    
   
  }

  hidePass(){
    this.passHidden =  !this.passHidden
  }

  getPhoneNumberData(newValue) {
    console.log(newValue);
    if (newValue != null) {
      if (newValue.phoneVal != null) {
        if (newValue.access == 'phone') {
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0;
          let placeHolderValue = newValue.placeholderVal;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;

          let currPhValueTrim = '';
          let currPhValueLen = 0;
          if (newValue.phoneVal['number'] != '') {
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
            currPhValueLen = currPhValueTrim.length;
          }

          if (newValue.phoneVal['number'].length > 0) {
            this.phonenoInputFlag = (newValue.phoneVal['number'].length > 0) ? true : false;
            this.invalidNumber = (newValue.errorVal) ? true : false;

            this.phoneNumberValid = true;
            this.emptyPhoneData();
            this.iphoneNumber = newValue.phoneVal.number;

            if (currPhValueLen == placeHolderValueLen) {
              this.phoneNumberValid = false;

              let getCode = newValue.phoneVal.countryCode;
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;
            }
          }
          else {
            this.phonenoInputFlag = false;
            this.iphoneNumber = '';
          }
        }
      }
      else {
        this.phonenoInputFlag = false;
        this.invalidNumber = (newValue.errorVal) ? true : false;
        this.phoneNumberValid = true;
        this.emptyPhoneData();
      }
    }
    else {
      this.phonenoInputFlag = false;
      this.invalidNumber = (newValue.errorVal) ? true : false;
      this.phoneNumberValid = true;
      this.emptyPhoneData();
    }
    setTimeout(() => {
      this.addUserForm.patchValue({
        countryName: this.icountryName,
        countryCode: this.icountryCode,
        dialCode: this.idialCode,
        phone: this.iphoneNumber
      });
    }, 150);
  }

  emptyPhoneData() {
    this.icountryName = '';
    this.icountryCode = '';
    this.idialCode = '';
    this.iphoneNumber = '';
    this.phoneNumberData = {
      countryCode: this.icountryCode,
      phoneNumber: this.iphoneNumber,
      country: this.icountryName,
      dialCode: this.idialCode,
      access: 'phone'
    }
  }


    // Form Action
    formAction(action) {
      console.log(action);
      switch (action) {
        case 'submit':
          if(this.userData?.formType == '') {
            this.submitClicked = true;
            this.formSubmit();
          } else {
            this.formCancel();
          }
          break;
        default:
          this.formProcessing = false;
          this.formCancel();
          break;
      }
    }

    
  stageChanged(item) {
    console.log(item)
    let itemVal = item.value;
    console.log(itemVal)
  }


      // Form Submit
  formSubmit() {
    const apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      action: 'new',
    };
    this.existErrorFlag = false;
    this.submitted = true;
    let contactObj = this.addUserForm.value;
    console.log( this.addUserForm.value);
    for (const i in this.addUserForm.controls) {
      this.addUserForm.controls[i].markAsDirty();
      this.addUserForm.controls[i].updateValueAndValidity();
    }
    console.log( this.addUserForm.value);
    this.phoneNumberValid = true;
    this.invalidNumber = !this.moreUserInfo && (contactObj.phone.length > 9 || contactObj.phone.length == 0 ) ? false : true;
    console.log(this.addUserForm, this.iphoneNumber, this.phoneNumberValid, this.invalidNumber)
    if ((this.addUserForm.valid && !this.moreUserInfo && (!this.existErrorFlag || !this.invalidNumber ) && (!this.passwordValidationError)) || ( this.addUserForm.valid && this.moreUserInfo )) {
      this.formProcessing = true;
      let phoneNumber = (contactObj.countryCode == 'IN' && contactObj.phone.length > 10 ) ? contactObj.phone.substring(1) : contactObj.phone;
      let action = (contactObj.contactId == 0) ? apiInfo.action : 'edit';
      apiInfo['dataAction'] = action;
      apiInfo['contactId'] = contactObj.contactId;
     
      if(this.moreUserInfo){
        apiInfo['firstName'] = (this.userData.item == '') ? '' : this.userData.item.firstName;
        apiInfo['lastName'] = (this.userData.item == '') ? '' : this.userData.item.lastName;
        apiInfo['email'] = (this.userData.item == '') ? '' : this.userData.item.email;
        apiInfo['title'] = contactObj.title;
        apiInfo['businessRole'] = contactObj.businessRole;
        apiInfo['deptName'] = contactObj.deptName;
        apiInfo['empId'] = contactObj.empId;
        apiInfo['roleId'] = contactObj.roleId;
        apiInfo['managerId'] = contactObj.managerId;
      }
      else{
        apiInfo['firstName'] = contactObj.firstName;
        apiInfo['lastName'] = contactObj.lastName;
        apiInfo['countryCode'] = contactObj.countryCode;
        apiInfo['countryName'] = contactObj.countryName;
        apiInfo['shopId'] = contactObj.shopId;
        apiInfo['dialCode'] = contactObj.dialCode;
        apiInfo['phoneNumber'] = phoneNumber;
        apiInfo['email'] = contactObj.email;
        apiInfo['password'] = contactObj.password;
        apiInfo['isPrimaryHq'] = this.userData?.isPrimaryHq;
        apiInfo['primaryContact'] = this.userData?.isPrimaryHq; 
        apiInfo['addressFlag'] = this.levelAddressFlag ?  "1" : "0";
        apiInfo['address1'] = this.levelAddressFlag ? contactObj.address1 : "" ;
        apiInfo['address2'] = this.levelAddressFlag ? contactObj.address2  : "" ;
        apiInfo['city'] = this.levelAddressFlag ? contactObj.city : "" ;
        apiInfo['state'] = this.levelAddressFlag ? contactObj.state : "" ;
        apiInfo['zip'] = this.levelAddressFlag ? contactObj.zip : "" ;
      }
       
      console.log(contactObj);
      this.manageActionForm(apiInfo);
    } else {
      this.formProcessing = false;
    }
  }

    // Manage HQ
    manageActionForm(apiData) {
      this.bodyElem.classList.add(this.bodyClass1);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );
      const apiFormData = new FormData();
      apiFormData.append("apiKey", apiData.apikey);
      apiFormData.append("domainId", apiData.domainId);
      apiFormData.append("platform", '3');
      apiFormData.append("userId", apiData.userId);
      apiFormData.append("networkId", this.dekraNetworkId);
      apiFormData.append("userType", "1");      
       //if (apiData.dataAction == 'edit') {
        apiFormData.append("id", apiData.contactId);
      //}

      if(this.moreUserInfo){
        apiFormData.append("firstName", apiData.firstName);
        apiFormData.append("lastName", apiData.lastName); 
        apiFormData.append("email", apiData.email); 
        apiFormData.append("bussTitle", apiData.title);
        apiFormData.append("businessRole", apiData.businessRole);
        apiFormData.append("deptName", apiData.deptName);
        apiFormData.append("empId", apiData.empId);
        apiFormData.append("roleId", apiData.roleId);
        apiFormData.append("managerId", apiData.managerId);
      }
      else{
        let isPrimaryHq = this.contactFlagShow && apiData.isPrimaryHq ? '1' : '0';
        apiFormData.append("isPrimaryHq", isPrimaryHq);
  
        let hqId = this.actionFormType == 'hq' ? this.parentId : '0' ;    
        let level1Id = this.actionFormType == 'level1' ? this.parentId : '0' ;    
        let level2Id = this.actionFormType == 'level2' ? this.parentId : '0' ;    
        let level3Id = this.actionFormType == 'level3' ? this.parentId : '0' ;    
        let shopId = this.actionFormType == 'shop' ? this.parentId : '0' ;   
  
        if(apiData.shopId && apiData.shopId.toString().includes("h")){
          apiData['shopId'] = apiData.shopId.replace("h","");
          apiFormData.append("hqId", apiData.shopId);
          let chq =this.hq.find((e)=>e.id == apiData.shopId)
          apiFormData.append("shopId", " ");
          apiFormData.append("isPrimaryHq", chq.locationType);
          apiFormData.append("primaryContact", chq.locationType);
        }else{
          apiFormData.append("shopId", apiData.shopId);
          apiFormData.append("hqId", hqId);
          if(apiData.primaryContact){
            apiFormData.append("primaryContact", "1");
          }
          else{
            apiFormData.append("primaryContact", "0");
          }
          
        }
        apiFormData.append("levelOneId", level1Id);
        apiFormData.append("levelTwoId", level2Id);
        apiFormData.append("levelThreeId", level3Id);
  
        apiFormData.append("firstName", apiData.firstName);
        apiFormData.append("lastName", apiData.lastName); 
        apiFormData.append("email", apiData.email);    
        if (apiData.dataAction == 'new') { 
        apiFormData.append("password", apiData.password);    
        }  
        apiFormData.append("phoneNo", apiData.phoneNumber);
        apiFormData.append("countryCode", apiData.countryCode);
        apiFormData.append("countryName", apiData.countryName);
        apiFormData.append("dialCode", apiData.dialCode);
        apiFormData.append("addressFlag", apiData.addressFlag);
        if(this.levelAddressFlag){
          apiFormData.append("address1", apiData.address1);
          apiFormData.append("address2", apiData.address2);
          apiFormData.append("city", apiData.city);
          apiFormData.append("state", apiData.state);
          apiFormData.append("zip", apiData.zip);
        }
        else{
          apiFormData.append("address1", "");
          apiFormData.append("address2", "");
          apiFormData.append("city", "");
          apiFormData.append("state", "");
          apiFormData.append("zip", "");
        }

      }

      /*this.formProcessing = false;
      this.addUserForm.reset();
      this.saveUser.emit({action: apiData.dataAction, data:apiData});
      this.submitted = false;
      new Response(apiFormData).text().then(console.log)
      return false; */
  
      this.headQuarterService.saveuser(apiFormData).subscribe((response: any) => {

        modalRef.dismiss("Cross click");
        this.bodyElem.classList.remove(this.bodyClass1);

        console.log(response);
        this.formProcessing = false;
        let error = response.error;
        //let error = false;
        if (!error) {
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          if (apiData.dataAction == 'new') {
            msgModalRef.componentInstance.successMessage = "New user added.";
          }
          else{
            msgModalRef.componentInstance.successMessage = "User details updated.";
          }
          this.addUserForm.reset();
          let userInfo = response.data.userInfo[1];        
          let actionFormType = this.userData.actionFormType;
          this.saveUser.emit({dataAction: apiData.dataAction, actionFormType: actionFormType, data:userInfo});
          this.submitted = false; 
          setTimeout(() => {
            msgModalRef.dismiss('Cross click');  
          }, 2000);
        } else {
          this.formProcessing = false;
          this.existErrorFlag = true;
          this.existErrorMsg = response.message;
        }
      });      

    }

    

    /*formSubmit(){
    if(this.submitClicked){
      this.saveUser.emit({formValue:this.addUserForm,success:true})
      this.submitClicked = false;
    }else{
      this.submitClicked = true;
    }
  }*/

  // Form Cancel
  formCancel() {
    this.submitClicked = false;  
    this.emptyPhoneData();
    this.submitted = false;
    this.addUserForm.reset();
    this.saveUser.emit({action:'cancel'});       
    //this.saveUser.emit({dataAction: 'edit', actionFormType: 'hq', data:''});
  }

checkpasswordtext(event)
{
  if(this.passwordchecker){
    this.fieldEnable = false;
    var inputVal = event.target.value.trim();
    var inputLength = inputVal.length;

    if(this.passwordLen<=inputLength){
      this.checkPwdStrongValidation();
    }
    else{
      if(inputLength == 0){
        this.passwordValidationError = false;
        this.passwordValidationErrorMsg = '';
      }
      if(this.passwordValidationError){
        this.checkPwdStrongValidation();
      }
      this.disableDefaultPasswordText = false;
      this.successPasswordTextIcon = false;
    }
  }
}

// check strong password
checkPwdStrongValidation(){
  if(this.passwordchecker){
    let pwdVal = this.addUserForm.value.password.trim();

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

getList(type){
  const apiFormData = new FormData();
  apiFormData.append("apiKey", this.apiKey);
  apiFormData.append("domainId", this.domainId);
  apiFormData.append("userId", this.userId);
  apiFormData.append("platform", '3');
  apiFormData.append("networkId", this.dekraNetworkId);

  if(type == 'role'){
    apiFormData.append("type", '4');
  }
  if(type == 'manager'){
    apiFormData.append("type", '3');
  }
  if(type == 'businessrole'){
    apiFormData.append("type", '9');
  }

  this.headQuarterService.getCommonList(apiFormData).subscribe((response:any) => {  
    if(!!response){
      let resultData = response.items;
      if(type == 'role'){
        this.roleData= [];
        for (let ws of resultData) {
          this.roleData.push({
            id: ws.id,
            name: ws.name,
          });
        }  
      }
      if(type == 'businessrole'){
        this.businessRoleData= [];
        for (let ws of resultData) {
          this.businessRoleData.push({
            id: ws.id,
            name: ws.name,
          });
        }  
      }
      if(type == 'manager'){
        this.managerData= [];
        for (let ws of resultData) {
          this.managerData.push({
            id: ws.id,
            name: ws.name,
          });
        }  
      }         
    }
    console.log(this.roleData);
    console.log(this.managerData);
});
   
}


}
