import { Component, EventEmitter, OnInit, Input, Output, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { Constant } from 'src/app/common/constant/constant';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FollowUpPopupComponent } from '../follow-up-popup/follow-up-popup.component';
import { FormBuilder, Validators } from '@angular/forms';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { AddToolsComponent } from '../add-tools/add-tools.component';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.scss']
})
export class ProductHistoryComponent implements OnInit,OnDestroy {
  @Input() toolsData: any = []; 
  @Input() toolsLocationPageData: any = []; 
  @Input() selectedLocation: any = {}; 
  @Input() selectedProduct: any = {}; 
  @Input() addProductFinal:boolean = false;
  @Input() selectedTool:any = {};
  @Input() selectedShop:any ;
  @Input() showNetwork: any = false; 
  @Output() historyPageCallback = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
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
  userData : any = [];
  public bodyElem;
  public bodyClass: string = 'product-view';
  public access = "";
  public paccess = "";
  public toolsList = [];
  public displayFlag: boolean = false;
  level:string="";
  subLevel:string = "";
  shopData:any;
  currentAttribute:any;
  currentItem:any;
  todayDate = new Date();
  purchaseDate
  shopLevelOneData:any;
  shopLevelTwoData:any;
  shopLevelThreeData:any;

  public itemTotal: number = 0;
  public itemList: object;
  public itemEmpty: boolean;
  public loading: boolean = true;
  public opacityFlag: boolean = false;
  public dekraNetworkHqId: string = '';
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  public searchVal: string = "";
  public roleId;
  public countryId='';
  public platformId: string;
  public apiData: Object;
  public tableRemoveHeight: number = 160;
  public toolsListColumns = [];
  currentShopData: any;
  shopId: string;
  productForm = this.formBuilder.group({
  });
  selectedProductId: any;
  level1Data:any = {};
  level2Data:any = {};
  level3Data:any = {};
  level1DropdownData:any = [];
  level2DropdownData:any = [];
  level3DropdownData:any = [];
  subAttribute: any;
  editId: any;
  shopList: any;
  shopListDropdownData: any;
  isSerialValid: boolean = true;
  validateObeservable: any;
  submitClicked = false;
  public action = "view";
  public attachments: any;
  public attachmentLoading: boolean = true;
  isDealer = false;
  ngModelDisable: boolean = false;
  lastUpdateId: any;
  oldTool: any;
    // Resize Widow
    @HostListener("window:resize", ["$event"])
    onResize(event) {
      this.bodyHeight = window.innerHeight;      
      this.setScreenHeight();  
    }

  canShowMoreButtons = false;
  constructor(public activeModal: NgbActiveModal,private router:Router,private modalService: NgbModal,private formBuilder:FormBuilder,private headQuarterService: HeadquarterService,private authenticationService: AuthenticationService) { 
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.canShowMoreButtons = (user.businessRole === 4 || user.businessRole === '4');
    }

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

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.innerHeight = (this.access == 'all-tools') ? this.innerHeight : this.innerHeight;
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 60;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = headerHeight + 100;
    this.tableRemoveHeight = (this.access == 'all-tools') ? headerHeight + 240 :  headerHeight + 240;
  }

  validateModel(value){
    let formData = new FormData();
    formData.append('apiKey', this.apiKey);
    formData.append('userId', this.userId);
    formData.append('networkId', this.dekraNetworkId);
    formData.append('domainId', this.domainId);
    if(this.selectedLocation && this.selectedLocation.vendorId){
      formData.append('vendorId', this.selectedLocation.vendorId);
    }else if(this.toolsLocationPageData && this.toolsLocationPageData.vendorId){
      formData.append('vendorId', this.toolsLocationPageData.vendorId);
    }
    if(this.selectedLocation && this.selectedLocation.id){
      formData.append('toolProdId', this.selectedLocation.id);
    }else  if(this.toolsLocationPageData && this.toolsLocationPageData.id){
      formData.append('toolProdId', this.toolsLocationPageData.id);
    }
      formData.append('serialNo', value.target.value);
      formData.append('type', "2");
    if(this.validateObeservable){
      this.validateObeservable.unsubscribe();
    }
      this.validateObeservable =  this.headQuarterService.validateTools(formData).subscribe((e:any)=>{
        if(e && e.data && e.data.alreadyExist == 1){
          this.isSerialValid = false;
        }else{
          this.isSerialValid = true;
        }
      })
  }

  pDateChange(){
    if(!this.ngModelDisable){
      this.productForm.controls["installDate"].setValue("");
    }else{
      this.ngModelDisable = false;
    }
  }

  
  initForm() {
   
    this.productForm =  this.formBuilder.group({
      toolProdId:['',[Validators.required]],
      serialNo:['',[Validators.required]],
      purchaseDate:[''],
      installDate:[''],
      warranty:[''],
      levelOneId:[''],
      levelTwoId:[''],
      levelThreeId:[''],
      shopId:['',[Validators.required]]
    })

    if(this.selectedShop){
      this.productForm.controls["levelOneId"].setValue(this.selectedShop.levelOneId);
      this.level1DropdownData = [{id:this.selectedShop.levelOneId,name:this.selectedShop.levelOneName}]
      this.productForm.controls["levelTwoId"].setValue(this.selectedShop.levelTwoId);
      this.level2DropdownData = [{id:this.selectedShop.levelTwoId,name:this.selectedShop.levelTwoName}]
      this.productForm.controls["levelThreeId"].setValue(this.selectedShop.levelThreeId);
      this.level3DropdownData = [{id:this.selectedShop.levelThreeId,name:this.selectedShop.levelThreeName}]
      this.productForm.controls["shopId"].setValue(this.selectedShop.id);
      this.shopListDropdownData = [{id:this.selectedShop.id,name:this.selectedShop.name}]
    }
  }

  cancelConfirm(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.title = "Cancel";
    modalRef.componentInstance.access = "Cancel"
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      if(receivedService){
        this.back('historyback')
      }
      modalRef.close()
    })

  }

  editProduct(){
    this.editId = this.selectedLocation.id
    if(this.selectedLocation && this.selectedLocation.installDate && this.selectedLocation.installDate != "0000-00-00 00:00:00"){
      this.selectedLocation.installDate = new Date(this.selectedLocation.installDate)
      this.ngModelDisable = true;
    }else{
      delete this.selectedLocation.installDate
    }

    if(this.selectedLocation && this.selectedLocation.purchaseDate && this.selectedLocation.purchaseDate != "0000-00-00 00:00:00"){
      this.selectedLocation.purchaseDate = new Date(this.selectedLocation.purchaseDate)
      this.purchaseDate = new Date(this.selectedLocation.purchaseDate);
    }else{
       delete this.selectedLocation.purchaseDate
    }
    this.addProductFinal = true;
    this.productForm.patchValue(this.selectedLocation);
    // this.productForm =  this.formBuilder.group({
    //   toolProdId:[this.selectedLocation.toolProdId,[Validators.required]],
    //   serialNo:[this.selectedLocation.serialNo,[Validators.required]],
    //   purchaseDate:[this.selectedLocation.purchaseDate],
    //   installDate:[this.selectedLocation.installDate],
    //   warranty:[this.selectedLocation.warranty],
    //   levelOneId:[this.selectedLocation.levelOneId],
    //   levelTwoId:[this.selectedLocation.levelTwoId],
    //   levelThreeId:[this.selectedLocation.levelThreeId],
    //   shopId:[this.selectedLocation.shopId,[Validators.required]]
    // })

  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);  

    console.log(this.toolsLocationPageData)
    console.log(this.toolsData)

    this.dekraNetworkId = this.toolsData.dekraNetworkId;
    this.paccess = this.toolsData.parentPage;
    this.access = this.toolsData.currentPage;
    this.domainId = this.toolsData.domainId;
    this.userId = this.toolsData.userId;
    this.roleId = this.toolsData.roleId;
    this.apiKey = this.toolsData.apiKey;
    this.countryId = this.toolsData.countryId;
    this.shopId = this.toolsData.shopId;
    this.user = this.authenticationService.userValue;
    if(this.user && this.user.data && this.user.data.shopId){
      this.isDealer = true;
    }
    this.initForm()

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    setTimeout(() => {
      this.setScreenHeight();
      this.getProductHistory();
    }, 500);
    this.selectedProductId = this.selectedLocation?.id
    this.getShopsList()
  }

  ngOnDestroy(): void {
    // this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
  }

  // getProductHistory
  getProductHistory() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    if(this.access == 'all-tools'){
    }
    else{
      apiFormData.append("shopId", this.shopId);
    }    

    //this.headQuarterService.getUserList(apiFormData).subscribe((response:any) => {
     // console.log(response);

     this.attachments = [
      {
          "languageOptions": [
              {
                  "id": "1",
                  "name": "English",
                  "key": "",
                  "editAccess": 0
              }
          ],
          "flagId": 1,
          "thumbFilePath": "https://cbt-demo-file-output.s3-accelerate.amazonaws.com/images/thumb_16986451166545ert5re45ert6tretyrewr4ert.jpg",
          "fileDuration": "",
          "fileExtension": "jpg",
          "mediaId": "28083",
          "fileId": "28083",
          "filePath": "https://cbt-demo-file-output.s3-accelerate.amazonaws.com/images/16986451166545ert5re45ert6tretyrewr4ert.jpg",
          "fileType": "image/jpeg",
          "fileSize": "49125",
          "fileName": "16986451166545ert5re45ert6tretyrewr4ert.jpg",
          "originalName": "6545ert5re45ert6tretyrewr4ert.jpeg",
          "originalFileName": "6545ert5re45ert6tretyrewr4ert.jpeg",
          "fileCaption": "6545ert5re45ert6tretyrewr4ert.jpeg"
      },
      {
        "languageOptions": [
            {
                "id": "1",
                "name": "English",
                "key": "",
                "editAccess": 0
            }
        ],
        "flagId": 1,
        "thumbFilePath": "https://cbt-demo-file-output.s3-accelerate.amazonaws.com/images/thumb_1695361274233ewr4ewr43sdfwer5sfret43wer5.jpg",
        "fileDuration": "",
        "fileExtension": "jpg",
        "mediaId": "27511",
        "fileId": "27511",
        "filePath": "https://cbt-demo-file-output.s3-accelerate.amazonaws.com/images/1695361274233ewr4ewr43sdfwer5sfret43wer5.jpg",
        "fileType": "image/jpeg",
        "fileSize": "12445",
        "fileName": "1695361274233ewr4ewr43sdfwer5sfret43wer5.jpg",
        "originalName": "233ewr4ewr43sdfwer5sfret43wer5.jpg",
        "originalFileName": "233ewr4ewr43sdfwer5sfret43wer5.jpg",
        "fileCaption": "233ewr4ewr43sdfwer5sfret43wer5.jpg"
    }
  ];
      this.attachmentLoading = this.attachments.length > 0 ? false : true;

      let resultData = []; 

        this.itemTotal = 1;

        this.loading = false;
        

      if(this.itemTotal>0){
        if(resultData.length>0){
 
            this.itemEmpty = false;

            /*resultData.forEach(item => {
              this.toolsList.push(item);
            });*/
                
      
                  }
      }
      else{
        this.itemEmpty = true;
      }
    //});
  }


  back(step){
    if(step == 'Headquarters'){
      this.headquartersFlag = true;
      this.featuredActionName = '';
      this.router.navigate([`/headquarters/network`]);
      this.headquartersPageRef.headquartersFlag = this.headquartersFlag;
      this.headquartersPageRef.featuredActionName = this.featuredActionName;
      setTimeout(() => {
        this.setScreenHeight();
      }, 500);
    }
    if(step == 'historyback'){
      this.historyPageCallback.emit(step);
    }
  }

  openFollowup(){
    const modalRef = this.modalService.open(FollowUpPopupComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
    modalRef.result.then(e=>{
    },err=>{

    })
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
        let currentId = ""
        response.data.attributesInfo.forEach(attribute=>{
          switch(attribute.displayOrder){
            case 1:
                this.level1Data = attribute;
                this.level1DropdownData = this.level1Data.items;
                if(this.shopId && this.shopList && this.shopList.length > 0 && this.productForm.controls['levelOneId']){
                  let currentShop = this.shopList.find(e=>e.id == this.shopId);
                  currentId = currentShop.levelOneId
                  this.productForm.controls['levelOneId'].setValue(currentId);
                  this.productForm.controls['levelOneId'].disable();
               }else
                if(this.subAttribute && this.subAttribute.levelOneId && this.subAttribute.levelOneId !== 0 &&  this.productForm.controls['levelOneId']){
                  this.productForm.controls['levelOneId'].setValue(this.subAttribute.levelOneId);
                  this.productForm.controls['levelOneId'].disable()
                }
                break;
            case 2:
              this.level2Data = attribute;
            if(this.shopId && this.shopList && this.shopList.length > 0 && this.productForm.controls['levelTwoId']){
               let currentShop = this.shopList.find(e=>e.id == this.shopId);
               currentId = currentShop.levelTwoId
               this.productForm.controls['levelTwoId'].setValue(currentId);
               this.productForm.controls['levelTwoId'].disable();
            }else
              if(this.subAttribute && this.subAttribute.levelTwoId && this.subAttribute.levelTwoId !== 0 &&  this.productForm.controls['levelTwoId']){
                this.productForm.controls['levelTwoId'].setValue(this.subAttribute.levelTwoId);
                this.productForm.controls['levelTwoId'].disable();
              }
              break;
              case 3:
            this.level3Data = attribute;
            if(this.shopId && this.shopList && this.shopList.length > 0 && this.productForm.controls['levelThreeId']){
               let currentShop = this.shopList.find(e=>e.id == this.shopId);
               currentId = currentShop.levelThreeId
               this.productForm.controls['levelThreeId'].setValue(currentId);
               this.productForm.controls['levelThreeId'].disable();
            }else
            if(this.subAttribute && this.subAttribute.levelThreeId && this.subAttribute.levelThreeId !== 0 &&  this.productForm.controls['levelThreeId']){
              this.productForm.controls['levelThreeId'].setValue(this.subAttribute.levelThreeId);
              this.productForm.controls['levelThreeId'].disable();
            } 
            break;
            default:
              break
            }
            if(this.shopId && this.shopId !== "0" &&  this.productForm.controls['shopId']){
              this.productForm.controls['shopId'].setValue(this.shopId);
              this.productForm.controls['shopId'].disable();
            } 
        })
      }
        this.onLevel1Change();
        this.onLevel2Change();
        this.onLevel3Change(); 
    })
  }

  getShopsList(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    if(this.subAttribute && this.subAttribute.levelOneId !== 0 && this.subAttribute.levelOneId !== ""){
      apiFormData.append("levelOneId", this.subAttribute.levelOneId );
    }
    if(this.subAttribute && this.subAttribute.levelTwoId !== 0 && this.subAttribute.levelTwoId !== ""){
     apiFormData.append("levelTwoId", this.subAttribute.levelTwoId);
   }
   if(this.subAttribute && this.subAttribute.levelThreeId !== 0 && this.subAttribute.levelThreeId !== ""){
     apiFormData.append("levelThreeId", this.subAttribute.levelThreeId);
   }
      this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
        if(response && response.items && response.items.length > 0){
          this.shopList = response.items;
        }
          this.productForm.controls['toolProdId'].setValue(this.toolsLocationPageData.id);
        this.getNetworkList()
      })
  }

  onLevel1Change(){
    this.level2DropdownData = this.level2Data.items.filter(e=>e.levelOneId == this.productForm.getRawValue().levelOneId);
    if(!this.productForm.controls['levelTwoId'].disabled && !this.editId && !this.selectedShop){
      this.productForm.controls['levelTwoId'].setValue('')
    }
    if(!this.productForm.controls['levelThreeId'].disabled && !this.editId && !this.selectedShop){
      this.productForm.controls['levelThreeId'].setValue('')
    }

    if(this.shopList && this.shopList.length > 0){
      this.shopListDropdownData = this.shopList.filter(e=>{
        if(!this.productForm.getRawValue().levelOneId){
          return true
        }else 
        if(e.levelOneId == this.productForm.getRawValue().levelOneId){
          return true
        } else{
          return false
        }

      });
      if(!this.productForm.controls['shopId'].disabled && !this.editId && !this.selectedShop){
        this.productForm.controls['shopId'].setValue('')
      }
    }
  }

  onLevel2Change(){
    this.level3DropdownData = this.level3Data.items.filter(e=>e.levelOneId == this.productForm.getRawValue().levelOneId && e.levelTwoId == this.productForm.getRawValue().levelTwoId);
    if(!this.productForm.controls['levelThreeId'].disabled && !this.editId && !this.selectedShop){
      this.productForm.controls['levelThreeId'].setValue('')
    }

    this.shopListDropdownData = this.shopList.filter(e=>{
      if(!this.productForm.getRawValue().levelOneId && !this.productForm.getRawValue().levelTwoId){
        return true
      }else 
      if(e.levelOneId == this.productForm.getRawValue().levelOneId && e.levelTwoId == this.productForm.getRawValue().levelTwoId){
        return true
      } else{
        return false
      }

    });
  }

  onLevel3Change(){
    if(this.shopList && this.shopList.length > 0){
      this.shopListDropdownData = this.shopList.filter(e=>{
        if(!this.productForm.getRawValue().levelOneId && !this.productForm.getRawValue().levelTwoId && !this.productForm.getRawValue().levelThreeId){
          return true
        }else 
        if(e.levelOneId == this.productForm.getRawValue().levelOneId && e.levelTwoId == this.productForm.getRawValue().levelTwoId && e.levelThreeId == this.productForm.getRawValue().levelThreeId){
          return true
        } else{
          return false
        }

      });
      if(!this.productForm.controls['shopId'].disabled && !this.editId && !this.selectedShop){
        this.productForm.controls['shopId'].setValue('')
      }
    }
  }

  onShopChange(){
    let selectedShop = this.shopList.find(e=>e.id == this.productForm.getRawValue().shopId);
    this.productForm.controls['levelOneId'].setValue(selectedShop.levelOneId);
    this.onLevel1Change();
    this.productForm.controls['levelTwoId'].setValue(selectedShop.levelTwoId);
    this.onLevel2Change();
    this.productForm.controls['levelThreeId'].setValue(selectedShop.levelThreeId);
    this.onLevel3Change();
    this.productForm.controls['shopId'].setValue(selectedShop.id);
  }

  dateFormat(d){
    if(!!d && d!==''){
      return  d.getFullYear()+ "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2)+ " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    }
  }

  clickOnL2() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.title = "Confirmation";
    modalRef.componentInstance.access = "confirmL2"
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      if(receivedService){
        this.submitForm('L2', '2');
      }
      modalRef.close()
    })
  }

  clickOnL3() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.title = "Confirmation";
    modalRef.componentInstance.access = "confirmL3"
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      if(receivedService){
        this.submitForm('L3', '3');
      }
      modalRef.close()
    })
  }



  clickOnL1() {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.title = "Confirmation";
    modalRef.componentInstance.access = "confirmL1"
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      if(receivedService){
        this.submitForm('L1', '1');
      }
      modalRef.close()
    })
  }

  submitForm(strVal?: string,value?: string){
    this.submitClicked = true;
    if(this.productForm.valid && this.isSerialValid){
      const saveFormData = new FormData();
      if(this.editId){
        saveFormData.append("id", this.editId);
      }
      saveFormData.append("apiKey", this.apiKey);
      saveFormData.append("domainId", this.domainId);
      saveFormData.append("userId", this.userId);
      saveFormData.append("platform", '3');
      saveFormData.append("networkId", this.dekraNetworkId);
      
      if (strVal && value) {
        saveFormData.append('validationStatus', value);
      }

      let formData = this.productForm.getRawValue()
      if(this.selectedLocation && this.selectedLocation.id){
        formData.toolProdId = this.productForm.value.toolProdId;
      }else{
        formData.toolProdId = this.toolsLocationPageData.id;
      }
      formData.installDate = this.dateFormat(formData.installDate)
      formData.purchaseDate = this.dateFormat(formData.purchaseDate)

      for (let key in this.productForm.getRawValue()){
        saveFormData.append(key, formData[key]);
      }
      this.loading = true;
      this.headQuarterService.saveProduct(saveFormData).subscribe((response: any) => {
        this.loading = false;
        this.lastUpdateId = response.data.id
        this.editId = response.data.id;
        const msgModalRef = this.modalService.open(SuccessModalComponent, {
          backdrop: "static",
          keyboard: false,
          centered: true,
        });

        if (this.editId) {
        //this.messageService.add({severity:'success', summary:'Shop edited', detail: 'Shop edited successfully.'})
          msgModalRef.componentInstance.successMessage = "Product details updated.";
        } else {
          //this.messageService.add({severity:'success', summary:'Shop added', detail: 'Shop added successfully.'})
          msgModalRef.componentInstance.successMessage = "Product added.";
        }

        setTimeout(() => {
          msgModalRef.dismiss('Cross click'); 
          this.activeModal.close();    
          this.getToolsLocationsList()
          this.addProductFinal = false;
        }, 2000);
      })
    }
  }

 // Get SHOP List
 getToolsLocationsList() {

  // if(this.itemOffset == 0){
  //   this.toolsList = [];
  //   this.itemTotal = 0;
  //   this.itemLength = 0;
  // }

  // this.scrollTop = 0;
  // this.lastScrollTop = this.scrollTop;
  this.loading = true
  const apiFormData = new FormData();
  apiFormData.append("apiKey", this.apiKey);
  apiFormData.append("domainId", this.domainId);
  apiFormData.append("userId", this.userId);
  apiFormData.append("platform", '3');
  apiFormData.append("networkId", this.dekraNetworkId);
  apiFormData.append('id', this.lastUpdateId);

  let resultData = [];
  this.headQuarterService.getShopToolsList(apiFormData).subscribe((response:any) => {
    if(response && response.items.length > 0){
      let newData = response.items[0].products.find(e=>{
        return e.id == this.lastUpdateId
      })

      this.selectedLocation = newData;
      this.selectedTool =  response.items[0];
    }
    this.loading = false;
  })
}

selectProduct(event,selectedShop=""){
  this.selectedTool = event;
  this.toolsLocationPageData = event
  this.oldTool = JSON.parse(JSON.stringify(event)) ;
  // this.selectedShop = event
  this.productForm.controls['toolProdId'].setValue(this.toolsLocationPageData.id);
}

}




