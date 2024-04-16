import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { AddToolsComponent } from '../add-tools/add-tools.component';

@Component({
  selector: 'app-add-product-step-one',
  templateUrl: './add-product-step-one.component.html',
  styleUrls: ['./add-product-step-one.component.scss']
})

export class AddProductStepOneComponent implements OnInit {
  selectedProductIndex:any = '';
  public bodyElem;
  public bodyClass2: string = "headquaters-new"
  public bodyClass4:string = "system-settings";
  public bodyClass: string = "parts-list";
  date: Date | undefined;
  showSidebar:Boolean = false
  public apiKey: string = Constant.ApiKey;
  public domainId;
  productForm = this.formBuilder.group({

  });
  dekraNetworkId: string;
  user: any;
  userId: any;
  networkName: string;
  purchaseDate
  toollist: any = [];
  backupToollist: any;
  selectedTool:any;
  selectedProduct: any;
  submitClicked:boolean =false;
  selectedProductId: any;
  level1Data:any = {};
  level2Data:any = {};
  level3Data:any = {};
  level1DropdownData:any = [];
  level2DropdownData:any = [];
  level3DropdownData:any = [];
  subAttribute: any;
  editId: any;
  shopId:any;
  shopList: any;
  shopListDropdownData: any;
  searchBrandName:string = "";
  public tableRemoveHeight: number = 160;
  access
  todayDate = new Date();
  isSerialValid: boolean = true;
  public innerHeight: number;
  public bodyHeight: number;
  public emptyHeight: number;
  public nonEmptyHeight: number;
  public headquartersFlag: boolean = true;
  validateObeservable: any;
  @Output() selectProductEmmiter:any = new EventEmitter();
  @Input() selectedShop:any = "";
  @Input() oldTool:any = "";
  
  tableDiv?;
  pageLimit:number = 25;
  pageOffset:number = 0;
  toolsListColumns = [
    { field: 'image', header: 'Image', columnpclass: 'w1 header tool-thl-col-2', width: '80px' },
    { field: 'id', header: 'ID#', columnpclass: 'w1 header tool-thl-col-2', width: '80px' },
    { field: 'categoryInfo.name', header: 'Category', columnpclass: 'w3 header tool-thl-col-3', width: '100px' },
    { field: 'vendorName', header: 'Vendor', columnpclass: 'w3 header tool-thl-col-3' , width: '100px' },
    { field: 'modelInfo.name', header: 'Model', columnpclass: 'w7 header tool-thl-col-7', width: '120px' },
    { field: 'brandInfo.name', header: 'Product Name', columnpclass: 'w2 header tool-thl-col-2' , width: '100px'},
    { field: 'toolTypeInfo.name', header: 'Type', columnpclass: 'w2 header tool-thl-col-2' , width: '100px'},
    { field: 'enteredBy', header: 'Entered By', columnpclass: 'w2 header tool-thl-col-2' , width: '100px'},
    { field: '', header: '', columnpclass: 'w10 header tool-thl-col-10 col-sticky', width: '50px' },
  ];

  selectedVendorId:number;
  selectedVendorName: string;
  selectedCategoryId: number;
  selectedCategoryName: string;
  vendorList = [];
  categoryList = [];
  isClearVendor = false;
  isClearCategory = false;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private config: NgbModalConfig,private formBuilder:FormBuilder, private headQuarterService:HeadquarterService, private authenticationService:AuthenticationService) { 
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.initForm();
  }

  ngOnInit(): void {
    this.bodyHeight = window.innerHeight;
    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.bodyElem.classList.add(this.bodyClass2)
    this.bodyElem.classList.add(this.bodyClass);  
    this.bodyElem.classList.add(this.bodyClass4); 
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';
    this.setScreenHeight()
    this.getToolList()
    this.getShopsList()
    this.lazyLoadingListner();
    if(this.oldTool){
      this.selectedProductId = this.oldTool.id;
      this.selectedProduct = this.oldTool;
      this.productForm.controls["toolProdId"].setValue(this.selectedProductId);
    }
    
  }

  onClearVendor(val){
    this.isClearVendor = true;
  }

  onClearCategory(val){
    this.isClearCategory = true;
  }

  // Manage List
  manageList(type: string, index = "") {
    if (this.isClearVendor) {
      this.isClearVendor = false;
      this.selectedVendorId = null;
      this.selectedVendorName = null;
      this.selectedCategoryId = null;
      this.selectedCategoryName = null;
      this.shopList = [];
      this.categoryList = [];
      return;
    }
    if (this.isClearCategory) {
      this.isClearCategory = false;
      this.selectedCategoryId = null;
      this.selectedCategoryName = null;
      this.categoryList = [];
      return;
    }
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
    apiData["type"] = type;
    access = "newthread";
    filteredItems = [];
    filteredNames = [];
    inputData = {
      actionApiName: "",
      actionQueryValues: "",
      selectionType: "single",
      field: 'dekra-shoptype',
      filteredItems: filteredItems,
      filteredLists: filteredNames,
      baseApiUrl: this.headQuarterService.dekraBaseUrl,
      apiUrl: this.headQuarterService.dekraBaseUrl + "" + Constant.getDekraCommonData,
    };

    if (type === '14') {
      if (this.selectedVendorId) {
        apiData['vendorId'] = this.selectedVendorId.toString();
        inputData['title'] = 'Category Name';
      } else {
        return;
      }
    } else {
      inputData['title'] = 'Vendor Name';
    }

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredNames;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 100;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.remove("certification-modal");
      this.bodyElem.classList.remove("profile-certificate");
      modalRef.dismiss("Cross click");
      if (type === '14') {
        this.selectedCategoryId = receivedService[0].id;
        this.selectedCategoryName = receivedService[0].name;
        this.categoryList = [{ id: this.selectedCategoryId, name: this.selectedCategoryName }]
      } else {
        this.selectedVendorId = receivedService[0].id;
        this.selectedVendorName = receivedService[0].name;
        this.vendorList = [{ id: this.selectedVendorId, name: this.selectedVendorName }]
      }
    });
  }

  validateModel(value){
    let formData = new FormData();
    formData.append('apiKey', this.apiKey);
    formData.append('userId', this.userId);
    formData.append('networkId', this.dekraNetworkId);
    formData.append('domainId', this.domainId);
    if(this.selectedProduct.vendorId){
      formData.append('vendorId', this.selectedProduct.vendorId);
    }
    if(this.selectedProduct.id){
      formData.append('toolProdId', this.selectedProduct.id);
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
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    
    this.setScreenHeight();

  }
  
  addTools(id = undefined){
    const modalRef = this.modalService.open(AddToolsComponent, { backdrop: 'static', keyboard: true, centered: true, size: 'xl',windowClass:'wh-100' });
    if(id != undefined){
      modalRef.componentInstance.editId = id;
    }
    modalRef.result.then(e=>{
      // this.scrollTop = 0;
      this.getToolList()
      this.lazyLoadingListner()
    },err=>{
    })
  }

  setScreenHeight() {
    this.innerHeight = 0;
    let headerHeight1 = 0;
    let headerHeight2 = (document.getElementsByClassName("hq-head")[0]) ? document.getElementsByClassName("hq-head")[0].clientHeight : 0;
    headerHeight1 = headerHeight1 > 20 ? 30 : 0;
    let headerHeight = headerHeight1 + headerHeight2;
    this.innerHeight = this.bodyHeight - (headerHeight + 76);
    this.innerHeight = (this.access == 'all-tools') ? this.innerHeight : this.innerHeight;
    this.emptyHeight = 0;
    this.emptyHeight = headerHeight + 80;
    this.nonEmptyHeight = 0;      
    this.nonEmptyHeight = (this.headquartersFlag) ? headerHeight + 85 : headerHeight + 115;
    this.tableRemoveHeight = (this.access == 'all-tools') ? headerHeight + 130 :  headerHeight + 130;
  }

  lazyLoadingListner(){
    setTimeout((test = this) => {
      this.tableDiv = document.getElementsByClassName('p-datatable-scrollable-body')[0]
      if(this.tableDiv){
        this.tableDiv.addEventListener("scroll", function(event){
          let tableDiv:any = document.getElementsByClassName('p-datatable-scrollable-body')[0]
          test.scrollTop = tableDiv.scrollTop;
          console.log(tableDiv.scrollTop + tableDiv.offsetHeight>= tableDiv.scrollHeight)
          if(tableDiv.scrollTop + tableDiv.offsetHeight>= (tableDiv.scrollHeight- 10)){
            test.pageOffset = test.pageOffset + 25;
            test.getToolList(true);
          }
      });
      }else{
        this.lazyLoadingListner()
      }
    }, 1500);
  }

  public lazyLoading: boolean = false;
  loading: boolean = false;

  getToolList(lazy=false) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("limit", this.pageLimit.toString());
    apiFormData.append("fromShop","1");

    if(lazy){
      this.lazyLoading = true
    }else{
      this.loading = true;
      this.toollist = [];
      this.pageOffset = 0;
    }
    apiFormData.append("offset",this.pageOffset.toString());

    if(this.selectedShop && this.selectedShop.id){
      // apiFormData.append("shopId", this.selectedShop.id);
    }
    this.headQuarterService.getToolsList(apiFormData).subscribe((response: any) => {
      if (response && response.items && response.items.length > 0) {
        this.backupToollist = response.items


        if (lazy) {
          response.items.forEach(e => {
            this.toollist.push(e)
          })
          setTimeout(() => {
            if (this.toollist.length != 0) {
              let listItemHeight;
              listItemHeight = (document.getElementsByClassName("thread-list-table")[0]) ? (document.getElementsByClassName("thread-list-table")[0] as any).offsetHeight + 50 : 0;
              
              if (
                response.items.length > 0 &&
                this.toollist.length != response.totalList &&
                this.innerHeight >= listItemHeight
              ) {            
                this.pageOffset = this.pageOffset + 25;
                this.getToolList(true);              
              } 
            }
          }, 1500);
  
         } else {
          this.toollist = response.items
          setTimeout(() => {
            if (this.toollist.length != 0) {
              let listItemHeight;
              listItemHeight = (document.getElementsByClassName("thread-list-table")[0]) ? (document.getElementsByClassName("thread-list-table")[0] as any).offsetHeight + 50 : 0;
              
              if (
                response.items.length > 0 &&
                this.toollist.length != response.totalList &&
                this.innerHeight >= listItemHeight
              ) {             
                this.pageOffset = this.pageOffset + 25;
                this.getToolList(true);              
              } 
            }
          }, 1500);
        }
      }
      this.loading = false;
      this.lazyLoading = false;

    });
    }

  initForm() {
    this.productForm =  this.formBuilder.group({
      toolProdId:['',[Validators.required]],
      serialNo:['',[Validators.required]],
      purchaseDate:[''],
      installDate:[''],
      warranty:[''],
      levelOneId:['',[Validators.required]],
      levelTwoId:['',[Validators.required]],
      levelThreeId:['',[Validators.required]],
      shopId:['',[Validators.required]]
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
            if(this.shopId && this.shopId !== 0 &&  this.productForm.controls['shopId']){
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
        if(this.selectedProductId){
          this.productForm.controls['toolProdId'].setValue(this.selectedProductId);
        }
        this.getNetworkList()
      })
  }

  onLevel1Change(){
    this.level2DropdownData = this.level2Data.items.filter(e=>e.levelOneId == this.productForm.getRawValue().levelOneId);
    if(!this.productForm.controls['levelTwoId'].disabled && !this.editId){
      this.productForm.controls['levelTwoId'].setValue('')
    }
    if(!this.productForm.controls['levelThreeId'].disabled && !this.editId){
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
      if(!this.productForm.controls['shopId'].disabled && !this.editId){
        this.productForm.controls['shopId'].setValue('')
      }
    }
  }

  onLevel2Change(){
    this.level3DropdownData = this.level3Data.items.filter(e=>e.levelOneId == this.productForm.getRawValue().levelOneId && e.levelTwoId == this.productForm.getRawValue().levelTwoId);
    if(!this.productForm.controls['levelThreeId'].disabled && !this.editId){
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
      if(!this.productForm.controls['shopId'].disabled && !this.editId){
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

  selectProduct(){
    this.selectedProductId = this.selectedProductIndex;
    this.selectedProduct = this.toollist.find(e=>e.id == this.selectedProductId);
    this.productForm.controls["toolProdId"].setValue(this.selectedProductId);
    this.showSidebar = false;
    this.selectProductEmmiter.emit(this.selectedProduct);
  }

  openSelectProduct(){
    this.showSidebar = true;
  }

  closeSelectProduct(){
    this.showSidebar = false;
  }

  dateFormat(d){
    if(!!d && d!==''){
      return  d.getFullYear()+ "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2)+ " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    }
  }

  submitForm(){
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
      let formData = this.productForm.getRawValue()
      formData.toolProdId = this.selectedProductId;
      formData.installDate = this.dateFormat(formData.installDate)
      formData.purchaseDate = this.dateFormat(formData.purchaseDate)

      for (let key in this.productForm.getRawValue()){
        saveFormData.append(key, formData[key]);
      }

      this.headQuarterService.saveProduct(saveFormData).subscribe((response: any) => {
        this.activeModal.close();
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
        }, 2000);
      })
    }
  }
  searchBrand(){
    this.toollist = this.backupToollist.filter(e=>e.brandInfo?.name?.toLowerCase().includes(this.searchBrandName.toLowerCase()));
    if(this.searchBrandName===""){
      this.toollist = this.backupToollist;
    }
  }

  clearSelectedProduct(){
    this.selectedProduct = undefined;
    this.productForm.controls["toolProdId"].setValue("");
  }

  pDateChange(){
    this.productForm.controls["installDate"].setValue("");
  }
}
