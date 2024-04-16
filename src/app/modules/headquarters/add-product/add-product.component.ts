import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  selectedProductIndex:any = '';
  public bodyElem;
  public bodyClass2: string = "headquaters-new"
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
  toollist: any;
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
  todayDate = new Date();
  isSerialValid: boolean = true;
  validateObeservable: any;
  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private config: NgbModalConfig,private formBuilder:FormBuilder, private headQuarterService:HeadquarterService, private authenticationService:AuthenticationService) { 
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.initForm();
  }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];  
    this.bodyElem.classList.add(this.bodyClass2)
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';
    this.getToolList()
    this.getShopsList()
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

  getToolList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getToolsList(apiFormData).subscribe((response: any) => {
      if (response && response.items && response.items.length > 0) {
      this.backupToollist = response.items
      this.toollist = response.items
     }
     })
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
