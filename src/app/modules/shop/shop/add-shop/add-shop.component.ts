import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { countries } from 'country-data';
import { MessageService } from 'primeng/api';
import { Constant } from 'src/app/common/constant/constant';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { SubmitLoaderComponent } from 'src/app/components/common/submit-loader/submit-loader.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';

@Component({
  selector: 'app-add-shop',
  templateUrl: './add-shop.component.html',
  styleUrls: ['./add-shop.component.scss'],
  providers: [MessageService]
})

export class AddShopPopupComponent implements OnInit, OnDestroy {
  public headText: string = '';
  public phoneNumberData: any;
  public icountryName = '';
  public icountryCode = '';
  public idialCode = '';
  public iphoneNumber = '';
  public phonenoInputFlag: boolean = true;
  public phoneNumberValid: boolean = false;
  public invalidNumber: boolean = true;
  public selectedRegion: string = "";
  public apiKey: string = Constant.ApiKey;
  public domainId;
  public item;
  public regionsList: { name: string, code: string }[] = [{ name: "East", code: "East" }, { name: "West", code: "West" }, { name: "North", code: "North" }, { name: "South", code: "South" },];
  public timeZoneList: any = [{id: 'EST', name: 'EST'},{id: 'CST', name: 'CST'},{id: 'MST', name: 'MST'},{id: 'PST', name: 'PST'}];
  submitClicked = false
  addShopForm: FormGroup = this.formBuilder.group({});
  dekraNetworkId: string;
  user:any;
  userId:any;
  level1Data:any = [];
  level2Data:any = [];
  level3Data:any = [];
  level1DropdownData:any = {};
  level2DropdownData:any = {};
  level3DropdownData:any = {};
  shopType:any = {};
  parent:any = {};
  countryDropdownData: any;
  stateDropdownData: any;
  companyStateDropdownData: any[];
  imageData:any = {};
  currentAttribute:any
  subAttribute:any;
  editData:any;

  public bodyElem;
  public bodyClass1: string = "submit-loader";
  public bodyClass2: string = "add-modal-popup-manage"
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };

  public shopTypeSelectedId: any = [];
  public shopTypeSelectedName: any = [];
  shopSelectedId: any[];
  shopSelectedName: any[];
  isUpdatePhonNo = false;
  isDisableImage = false;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private messageService: MessageService, private modalService: NgbModal,private authenticationService: AuthenticationService, private headQuarterService: HeadquarterService,    private threadApi: ThreadService, private config: NgbModalConfig,) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
   }

  ngOnInit(): void {

    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.bodyElem.classList.add(this.bodyClass2);

    this.loadCountryStateData()
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.getNetworkList();
    this.getCommonData("1");
    this.getCommonData("26");
    this.initForm();
console.log(this.editData)

    
  }

  setPhoneNo(value){
    this.addShopForm.controls['phoneNo'].setValue(value);
  }

  getPhoneNumberData(newValue) {
    if (newValue != null) {
      if (newValue.phoneVal != null && newValue.phoneVal.number) {
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
            // this.emptyPhoneData();
            this.iphoneNumber = newValue.phoneVal.number;
            this.setPhoneNo(this.iphoneNumber)

            if (currPhValueLen == placeHolderValueLen) {
              this.phoneNumberValid = false;

              let getCode = newValue.phoneVal.countryCode;
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;
              this.setPhoneNo(this.iphoneNumber)
            }
          }
          else {
            this.phonenoInputFlag = false;
            this.iphoneNumber = '';
            this.setPhoneNo(this.iphoneNumber)
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
  }

  emptyPhoneData() {
    this.icountryName = '';
    this.icountryCode = '';
    this.idialCode = '';
    this.iphoneNumber = '';
    this.setPhoneNo(this.iphoneNumber)
    this.phoneNumberData = {
      countryCode: this.icountryCode,
      phoneNumber: this.iphoneNumber,
      country: this.icountryName,
      dialCode: this.idialCode,
      access: 'phone'
    }
  }

  private initForm(item: any = '') {

    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.bodyElem.classList.add(this.bodyClass2);
    
    this.addShopForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      parentId: ["", [Validators.required]],
      shopType: ["", [Validators.required]],
      shopTypeName: ["", [Validators.required]],
      dealerCode: [""],
      levelOneId: [!!this.selectedRegion ? this.selectedRegion : ""],
      levelTwoId: [""],
      levelThreeId: [""],
      address1: [""],
      address2: ["", []],
      city: [""],
      state: [""],
      zip: [""],
      timezone: [""],
      emailAddress: ["", [ Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      phoneNo: [""],
    });
    this.initPhoneControl(item);
    if(this.editData){
      this.headText = "Edit Shop";
      this.editData["phoneNumber"] = this.editData?.phoneNo;
      this.iphoneNumber = this.editData?.phoneNo;
      if(this.editData.otherParentId){
        this.editData["parentId"] = this.editData.otherParentId;
      }
      this.addShopForm.patchValue(this.editData);
      this.setPhoneNo(this.editData?.phoneNo);
      // this.editData["dialCode"] = this.editData["countryCode"]
      this.editData["countryCode"] = "us"
      this.initPhoneControl(this.editData);
      this.imageData["show"] = this.editData.logoUrl ? this.editData.logoUrl : "";
      let typeid = [];
      let typename = [];
      typeid.push(this.editData?.shopType);
      typename.push(this.editData?.shopTypeName);
      this.shopTypeSelectedId = typeid;
      this.shopSelectedId = this.editData?.shopId;
      this.shopTypeSelectedName = typename;

      this.addShopForm.get('name').disable();
      this.addShopForm.updateValueAndValidity();
      if(this.editData.logoUrl){
        this.imageData.response = this.editData.logoUrl.split('/')[this.editData.logoUrl.split('/').length -1];
      }      
    }
    else{
      this.headText = "New Shop";
    }
    this.onLevel1Change();
    this.onLevel2Change();
  }

  stageChanged(item) {
    let itemVal = item.value;
  }

  private initPhoneControl(item) {
    this.emptyPhoneData();
    const countryName = (item == '') ? '' : item.countryName;
    const countryCode = (item == '') ? '' : item.countryCode;
    const dialCode = (item == '') ? '' : item.dialCode;
    const phoneNumber = (item == '') ? '' : item.phoneNumber;
    this.icountryCode = (item = '') ? this.icountryCode : countryCode;
    this.iphoneNumber = (item = '') ? this.iphoneNumber : phoneNumber;
    this.setPhoneNo(this.iphoneNumber);
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
  
  uploadLogo() {
    if(!this.isDisableImage){
      const modalRef = this.modalService.open(ImageCropperComponent,{size:'md'});
      modalRef.componentInstance.type = "Add";
      modalRef.componentInstance.profileType = "add-shop";
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.domainId = this.domainId;
      modalRef.componentInstance.id = "";     
      modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
        if (receivedService) {
          this.imageData = receivedService;
          modalRef.dismiss('Cross click');
        }
      });
    }
  }

  // Manage List
  manageList() {
  
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId,
      countryId: '',
      networkId: this.dekraNetworkId
    };

    let access;
    let filteredItems;
    let filteredNames;
    let filteredDate;
    let inputData = {};   

    apiData["type"] = "1";
    access = "newthread";
    filteredItems = this.shopTypeSelectedId;
    filteredNames = this.shopTypeSelectedName;
    inputData = {
      actionApiName: "",
      actionQueryValues: "",
      selectionType: "single",
      field:'dekra-shoptype',   
      title: "Shop Type",
      filteredItems: filteredItems,
      filteredLists: filteredNames,
      baseApiUrl: this.headQuarterService.dekraBaseUrl,
      apiUrl: this.headQuarterService.dekraBaseUrl+""+Constant.getDekraCommonData,
    };
       
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;      
    modalRef.componentInstance.inputData = inputData; 
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredNames;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove("certification-modal");
      this.bodyElem.classList.remove("profile-certificate");  
      modalRef.dismiss("Cross click");
      let items = receivedService;
     
          this.shopTypeSelectedId = [];
          this.shopTypeSelectedName = [];
          for (let t in items) {
            let chkIndex = this.shopTypeSelectedId.findIndex(
              (option) => option == items[t].id
            );
            if (chkIndex < 0) {
              this.shopTypeSelectedId.push(items[t].id);
              this.shopTypeSelectedName.push(items[t].name);
            }
          }
          console.log(this.shopTypeSelectedId, this.shopTypeSelectedName);
          this.addShopForm.get('shopTypeName').setValue(this.shopTypeSelectedName); 
          this.addShopForm.get('shopType').setValue(this.shopTypeSelectedId);                     

    });
  }

  manageShopList(){
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      userId: this.userId,
      countryId: '',
      networkId: this.dekraNetworkId
    };

    let access;
    let filteredItems;
    let filteredNames;
    let filteredDate;
    let inputData = {};   

    apiData["type"] = "36";
    access = "newthread";
    filteredItems = [this.shopSelectedId];
    filteredNames = [this.shopSelectedName];
    inputData = {
      actionApiName: "",
      actionQueryValues: "",
      selectionType: "single",
      field:'dekra-shopList',   
      title: "Shop Name",
      filteredItems: filteredItems,
      filteredLists: filteredNames,
      baseApiUrl: this.headQuarterService.dekraBaseUrl,
      apiUrl: this.headQuarterService.dekraBaseUrl+""+"network/shoplistdetail",
    };
       
    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;      
    modalRef.componentInstance.inputData = inputData; 
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredNames;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      // this.imageData = {};
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove("certification-modal");
      this.bodyElem.classList.remove("profile-certificate");  
      modalRef.dismiss("Cross click");
      let items = receivedService;
          this.shopSelectedId = [];
          this.shopSelectedName = [];
          for (let t in items) {
            let chkIndex = this.shopSelectedId.findIndex(
              (option) => option == items[t].id
            );
            if (chkIndex < 0) {
              this.shopSelectedId.push(items[t].id);
              this.shopSelectedName.push(items[t].name);
            }
          }
          this.addShopForm.get('name').setValue(this.shopSelectedName); 
          this.getShopData(receivedService[0].id)
          const phon =  document.getElementById('phonNumber');

          setTimeout(() => {
            if(receivedService[0].isNewCreated){
              this.isDisableImage = false;
              if(phon){
                phon.style.pointerEvents = 'auto';
              }
              this.addShopForm.enable();
              this.addShopForm.updateValueAndValidity();
              }else{
              this.addShopForm.disable();
              this.isDisableImage = true;
              this.addShopForm.updateValueAndValidity();

              this.addShopForm.get('dealerCode').enable();
              this.addShopForm.get('levelThreeId').enable();
              this.addShopForm.get('levelOneId').enable();
              this.addShopForm.get('levelTwoId').enable();
              this.addShopForm.get('name').enable();

              if(phon){
                phon.style.pointerEvents = 'none';
              }
              this.addShopForm.updateValueAndValidity();
            }
          }, 500);
    });
  }

  getShopData(id){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("id",id.toString());

    this.headQuarterService.getShopListDetail(apiFormData).subscribe((response:any) => {
      if(response.items && response.items.length > 0){
        let shopData = response.items[0]
        this.addShopForm.patchValue({
          address1: shopData.address1,
          address2: shopData.address2,
          city: shopData.city,
          state: shopData.state,
          zip: shopData.zip,
          timezone: shopData.timezone,
          emailAddress: shopData.emailAddress,
          parentId: shopData.parentId,
          shopType: shopData.shopType,
          shopTypeName: shopData.shopTypeName,

        });
        this.isUpdatePhonNo = true;
        shopData['phoneNumber'] = shopData?.phoneNo; 
        this.iphoneNumber = this.editData?.phoneNo;
        
        setTimeout(() => {
          this.setPhoneNo(shopData?.phoneNo);
          this.addShopForm.get('phoneNo').patchValue(shopData?.phoneNo);
          this.initPhoneControl(shopData);
          this.isUpdatePhonNo = false;
        });

        if(shopData?.logoUrl){
          this.imageData = {
            show: shopData?.logoUrl || ''
          }
        }
        this.shopTypeSelectedId = shopData.shopType;
        this.shopTypeSelectedName = shopData.shopTypeName;
      }
  })
  }

  saveShop() {
    this.submitClicked = true;
    if(this.addShopForm.valid){

      this.bodyElem.classList.add(this.bodyClass1);
      const modalRef = this.modalService.open(
        SubmitLoaderComponent,
        this.modalConfig
      );

      const saveFormData = new FormData();
      if(this.editData && this.editData.id){
        saveFormData.append("id", this.editData.id);
      }
      if(this.shopSelectedId.toString()){
        saveFormData.append("shopId", this.shopSelectedId.toString());
      }
      saveFormData.append("apiKey", this.apiKey);
      saveFormData.append("domainId", this.domainId);
      saveFormData.append("userId", this.userId);
      saveFormData.append("platform", '3');
      saveFormData.append("networkId", this.dekraNetworkId);
      if(this.imageData && this.imageData.response){
        saveFormData.append("logoUrl", this.imageData.response);
      }
      
      for (let key in this.addShopForm.getRawValue()){
        if(key == 'parentId'){
         let selectedParent = this.parent.find(e=>this.addShopForm.getRawValue()[key] == e.id)
          if(selectedParent){
            if(selectedParent.parentInfo == 0){
              saveFormData.append("otherParentId", this.addShopForm.getRawValue()[key]);
            }else{
              saveFormData.append(key, this.addShopForm.getRawValue()[key]);
            }
          }
        }else{
          saveFormData.append(key, this.addShopForm.getRawValue()[key]);
        }
      }
      saveFormData.append("countryCode", this.icountryCode);
      saveFormData.append("countryName", this.icountryName);
      saveFormData.append("dialCode", this.idialCode);

      //new Response(saveFormData).text().then(console.log);
      //return false; 

      this.headQuarterService.saveShop(saveFormData).subscribe((response:any) => {  
        
        modalRef.dismiss(response);
        this.bodyElem.classList.remove(this.bodyClass1);
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);

        if(this.editData){
        //this.messageService.add({severity:'success', summary:'Shop edited', detail: 'Shop edited successfully.'})
          msgModalRef.componentInstance.successMessage = "Shop details updated.";
        }else{
          //this.messageService.add({severity:'success', summary:'Shop added', detail: 'Shop added successfully.'})
          msgModalRef.componentInstance.successMessage = "New shop added.";
        }

      /*setTimeout(() => {
        this.activeModal.close('Cross click');    
      }, 1000);*/

      setTimeout(() => {
        msgModalRef.dismiss('Cross click'); 
        this.activeModal.close(response);    
      }, 2000);
      
      })
    }
  }

  getNetworkList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {    
      if(response && response.data && response.data.attributesInfo && response.data.attributesInfo.length > 0){
        response.data.attributesInfo.forEach(attribute=>{
          switch(attribute.displayOrder){
            case 1:
                this.level1Data = attribute;
                this.level1DropdownData = this.level1Data.items;
                if(this.subAttribute && this.subAttribute.levelOneId && this.subAttribute.levelOneId !== 0 &&  this.addShopForm.controls['levelOneId']){
                  this.addShopForm.controls['levelOneId'].setValue(this.subAttribute.levelOneId);
                  this.addShopForm.controls['levelOneId'].disable()
                }
                break;
            case 2:
              this.level2Data = attribute;
              if(this.subAttribute && this.subAttribute.levelTwoId && this.subAttribute.levelTwoId !== 0 &&  this.addShopForm.controls['levelTwoId']){
                this.addShopForm.controls['levelTwoId'].setValue(this.subAttribute.levelTwoId);
                this.addShopForm.controls['levelTwoId'].disable();
              }
              break;
              case 3:
            this.level3Data = attribute;
            if(this.subAttribute && this.subAttribute.levelThreeId && this.subAttribute.levelThreeId !== 0 &&  this.addShopForm.controls['levelThreeId']){
              this.addShopForm.controls['levelThreeId'].setValue(this.subAttribute.levelThreeId);
              this.addShopForm.controls['levelThreeId'].disable();
            } 
            break;
            default:
            break
          }
        })
      }
      this.onLevel1Change();
      this.onLevel2Change();

    })
  }

  getCommonData(type:string){
    const commonDataFormData = new FormData();
    commonDataFormData.append("apiKey", this.apiKey);
    commonDataFormData.append("domainId", this.domainId);
    commonDataFormData.append("userId", this.userId);
    commonDataFormData.append("platform", '3');
    commonDataFormData.append("networkId", this.dekraNetworkId);
    commonDataFormData.append("type", type);
    this.headQuarterService.getCommonList(commonDataFormData).subscribe((response:any) => {    
      if(response && response.items){
        if(type == "1"){
            this.shopType = response.items
        } else if(type == "26"){
            this.parent = response.items
        }
      }
    })


  }

  loadCountryStateData() {
    this.threadApi.countryMasterData().subscribe((response: any) => {
      if (response.status == "Success") {
        this.countryDropdownData = response.data.countryData;
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
  }

  onLevel1Change(){
    this.level2DropdownData = this.level2Data?.items?.filter(e=>e.levelOneId == this.addShopForm.getRawValue().levelOneId);
    if(!this.addShopForm.controls['levelTwoId'].disabled && !this.editData){
      this.addShopForm.controls['levelTwoId'].setValue('')
    }
    if(!this.addShopForm.controls['levelThreeId'].disabled && !this.editData){
      this.addShopForm.controls['levelThreeId'].setValue('')
    }
  }

  onLevel2Change(){
    this.level3DropdownData = this.level3Data?.items?.filter(e=>e.levelOneId == this.addShopForm.getRawValue().levelOneId && e.levelTwoId == this.addShopForm.getRawValue().levelTwoId);
    if(!this.addShopForm.controls['levelThreeId'].disabled && !this.editData){
      this.addShopForm.controls['levelThreeId'].setValue('')
    }
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass2);    
  }
}