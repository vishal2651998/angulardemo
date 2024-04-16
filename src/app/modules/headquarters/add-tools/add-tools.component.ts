import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/common/constant/constant';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AlternateModelPopupComponent } from '../alternate-model-popup/alternate-model-popup.component';

@Component({
  selector: 'app-add-tools',
  templateUrl: './add-tools.component.html',
  styleUrls: ['./add-tools.component.scss']
})
export class AddToolsComponent implements OnInit {

  public bodyElem;
  public bodyClass2: string = "add-modal-popup-manage";
  public partsFormArray: any[] = []
  public specsFormArray: any[] = []

  public apiKey: string = Constant.ApiKey;
  public domainId;
  public item;
  productForm: FormGroup = this.formBuilder.group({});
  vendorSelectedId: any[] = [];
  vendorSelectedName: any[] = [];
  userId: any;
  dekraNetworkId: any = "2";
  toastMessage: any = "";
  user: any
  loading = false;
  submitClicked: boolean = false
  productModelSelectedId: any[] = [];
  productModelSelectedName: any[] = [];
  productNameSelectedId: any[] = [];
  productNameSelectedName: any[] = [];
  departmentSelectedId: any[] = [];
  departmentSelectedName: any[] = [];
  brandSelectedId: any[];
  brandSelectedName: any[];
  categorySelectedId: any[];
  categorySelectedName: any[];
  typeSelectedId: any[];
  typeSelectedName: any[];
  manufacturerSelectedId: any[];
  postApiData = {
    action: 'new',
    access: 'post',
    pageAccess: 'post',
    apiKey: Constant.ApiKey,
    domainId: 1,
    userId: 512,
    postId: 0,
    countryId: '',
    contentType: 56,
    displayOrder: 0,
    uploadedItems: [],
    attachments: [],
    attachmentItems: [],
    updatedAttachments: [],
    deletedFileIds: [],
    removeFileIds: []
  }
  editId: any;
  imageData: any = {
    uploaded: {},
    attachments: [],
    mediaIds:[]
  };
  savedImages = [];
  manufacturerSelectedName: any[];
  postUploadActionTrue = false;
  postUpload =false;
  networkName: string = ""
  ratingOptions: Object[] = [
    { name: "1 Star", id: 1 },
    { name: "2 Star", id: 2 },
    { name: "3 Star", id: 3 },
    { name: "4 Star", id: 4 },
    { name: "5 Star", id: 5 },
  ]
  manageAction: string = "new";
  specLabel: any = [];
  unitOptions: any = [];
  oemOptions: any = [];
  modelOptions: any = [];
  selectedAlternateModel: any = [];

  constructor(public activeModal: NgbActiveModal, private sanitizer:DomSanitizer,private headQuarterService: HeadquarterService, private authenticationService: AuthenticationService, private config: NgbModalConfig, private modalService: NgbModal, private formBuilder: FormBuilder) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
    this.initForm();
  }

  getImage(url:string){
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : ""
  }

  attachments(items) {
        // this.imageData.attachments.push(items);
        if(items.mediaId){
          this.imageData.mediaIds.push(items.mediaId);
        }
        this.imageData.uploaded = ""
        this.postUpload = false
        this.postUploadActionTrue = false;
  }

  ngOnInit(): void {
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';
    // this.addPartForm()
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass2) 

    if (this.editId) {
      this.getToolList(this.editId)
    }
    this.getCommonDatalist("27");
    this.getCommonDatalist("28")
    this.getCommonDatalist("20")
  }

  getToolList(id) {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("id", id);
    this.headQuarterService.getToolsList(apiFormData).subscribe((response: any) => {
      if (response && response.items && response.items.length > 0) {
        if(response.items && response.items[0].uploadContents){
          response.items[0].uploadContents.forEach(e => {
             this.savedImages.push(e); 
          });
        }
        let formArrValue;
        if(response.items[0].partsInfo){
          formArrValue = JSON.parse(response.items[0].partsInfo)
          delete response.items[0].partsInfo
            for (let i = 1; i < formArrValue.length; i++) {
            this.addPartForm()
          }
        }

      let formArrValue1 = response.items[0].toolsSpec
      delete response.items[0].toolsSpec
        for (let i = 1; i < formArrValue1.length; i++) {
        this.addSpecForm()
      }

      let formArrValue2 = response.items[0].oemInfo
      delete response.items[0].oemInfo   
      if(formArrValue2.length >= 1 && formArrValue2[0].modelId == 0){
        this.selectedAlternateModel[0] = formArrValue2[0].modelName;
      }
        for (let i = 1; i < formArrValue2.length; i++) {
        this.addOemForm()
        if( formArrValue2[i].modelId == 0){
          this.selectedAlternateModel[i] = formArrValue2[i].modelName;
        }
      }

      let formArrValue3 = response.items[0].webLinks.map(e=>{
        return {linkId:e?.id,linkName:e?.name}
      })
      delete response.items[0].webLinks   

        for (let i = 1; i < formArrValue3.length; i++) {
          this.addLinkForm()
        }
      this.vendorSelectedId = response.items[0].vendorInfo.id;
      this.vendorSelectedName = response.items[0].vendorInfo.name;
        if (this.vendorSelectedId) {
        this.productForm.controls["vendorId"].enable();
      }
      this.productModelSelectedId = response.items[0].modelInfo.id
      this.productModelSelectedName = response.items[0].modelInfo.name
        if (this.productModelSelectedId) {
        this.productForm.controls["modelId"].enable();
      }
      this.productNameSelectedId = response.items[0].productNameInfo.id
      this.productNameSelectedName = response.items[0].productNameInfo.name
        if (this.vendorSelectedId && this.productModelSelectedId) {
        this.productForm.controls["productNameId"].enable();
      }
      this.departmentSelectedId = response.items[0].departmentInfo.id
      this.departmentSelectedName = response.items[0].departmentInfo.name
        if (this.vendorSelectedId && this.productModelSelectedId) {
        this.productForm.controls["departmentId"].enable();
      }
      this.brandSelectedId = response.items[0].brandInfo.id
      this.brandSelectedName = response.items[0].brandInfo.name
        if (this.vendorSelectedId && this.productModelSelectedId) {
        this.productForm.controls["brandId"].enable();
      }
      this.categorySelectedId = response.items[0].categoryInfo.id
      this.categorySelectedName = response.items[0].categoryInfo.name
        if (this.vendorSelectedId && this.productModelSelectedId) {
        this.productForm.controls["categoryId"].enable();
      }
      this.typeSelectedId = response.items[0].toolTypeInfo.id
      this.typeSelectedName = response.items[0].toolTypeInfo.name
        if (this.vendorSelectedId && this.productModelSelectedId) {
        this.productForm.controls["toolTypeId"].enable();
      }
      this.manufacturerSelectedId = response.items[0].mfgInfo.id
        this.manufacturerSelectedName = response.items[0].mfgInfo.name
        if (this.vendorSelectedId && this.productModelSelectedId) {
        this.productForm.controls["mfgId"].enable();
      }
      this.modelOptions = [{id:this.productModelSelectedId,name:this.productModelSelectedName}];
      response.items[0]["departmentId"] =  response.items[0]["department"]
      this.productForm.patchValue(response.items[0]);
      if(formArrValue){
        this.partsInfo.patchValue(formArrValue);
      }
      this.specsInfo.patchValue(formArrValue1);
      this.oemInfo.patchValue(formArrValue2);
      this.linksInfo.patchValue(formArrValue3);

     }
     })
    }

  get partsInfo() {
    return this.productForm.controls["partsInfo"].value as FormArray;
  }

  get specsInfo() {
    return this.productForm.controls["specsInfo"].value as FormArray;
  }

  get oemInfo() {
    return this.productForm.controls["oemInfo"].value as FormArray;
  }
  
  get linksInfo() {
    return this.productForm.controls["linksInfo"].value as FormArray;
  }


  modelOptions1(i){
    // if(this.selectedAlternateModel.length > i && this.selectedAlternateModel[i]){
      return [{id:0,name:this.selectedAlternateModel[i]},...this.modelOptions];
    // }else{
    //   return this.modelOptions
    // }
  }
  submitForm() {
    this.submitClicked = true
    this.productForm.markAllAsTouched();
    setTimeout(() => {
      if(document.getElementsByClassName("invalid-input").length > 0){
        return false;
      }
      if (this.productForm.valid) {
        let request = this.productForm.value;
        const saveFormData = new FormData();
        saveFormData.append("apiKey", this.apiKey);
        saveFormData.append("domainId", this.domainId);
        saveFormData.append("userId", this.userId);
        saveFormData.append("platform", '3');
        saveFormData.append("networkId", this.dekraNetworkId);
        if (this.editId) {
          saveFormData.append("id", this.editId);
        }
  
        for (let key in request) {
          if (key == "certification") {
            saveFormData.set(key, request[key] ? '1' : '0');
          } 
          else if (key == "partsInfo") {
            // saveFormData.append(key, JSON.stringify(request[key].value));
            delete request[key];
          } 
          else if (key == "specsInfo") {
            let a = request[key].value.map(e=>{
              e.unitId.toString();
              e.labelId.toString();
              return e;
            })
            a = a.filter(e=>{
              if(e.labelId?.toString() == "" || e.value?.toString() == "" || e.unitId?.toString() == ""){
                return false;
              }else{
                return true;
              }
            })
            if(a.length > 0){
              saveFormData.append("toolsSpec", JSON.stringify(a));
            }
          }else if(key == "oemInfo"){
            let a = request[key].value.map((e,index)=>{
              e.oemId.toString();
              e.modelId.toString();
              let fg = this.modelOptions1(index).find(f=>f.id?.toString() == e.modelId?.toString());
              e["modelName"] = fg?.name;
              
              return e;
            })
            a = a.filter(e=>{
              if(e.oemId?.toString() == ""){
                return false;
              }else{
                return true;
              }
            })
            if(a.length > 0){
              saveFormData.append("oemInfo", JSON.stringify(a));
            }
          }else if(key == "linksInfo"){
            let a = request[key].value.map((e,index)=>{
              e["id"] = e.linkId.toString();
              delete e.linkId
              if(e.linkName.toString() && !e.linkName.toString().toLocaleLowerCase().includes("https://") && !e.linkName.toString().toLocaleLowerCase().includes("http://")){
                e.linkName = "https://"+ e.linkName.toString();
              }
              e["name"] = e.linkName.toString();
              delete e.linkName
              return e;
            })
            a = a.filter(e=>{
              return e.name
            })
            if(a.length){
              saveFormData.append("webLinks", JSON.stringify(a));
            }
          }
           else {
            saveFormData.append(key, request[key]);
          }
        }
        let imageIds = []
        this.savedImages.forEach(e=>{
          if(e.fileId){
            imageIds.push(e.fileId) 
          }else{
            if(this.imageData && this.imageData.mediaIds && this.imageData.mediaIds.length > 0){
              imageIds.push(this.imageData.mediaIds.shift())
            }
          }
        
        });
        
        saveFormData.append("bannerImages",  JSON.stringify(imageIds) );
        // saveFormData.append("id", "2");
        this.loading = true;
        this.headQuarterService.saveTools(saveFormData).subscribe((response: any) => {
          this.loading = false;
          // this.activeModal.close();
          // const msgModalRef = this.modalService.open(SuccessModalComponent, {
          //   backdrop: "static",
          //   keyboard: false,
          //   centered: true,
          // });
  
          if (this.editId) {
          //this.messageService.add({severity:'success', summary:'Shop edited', detail: 'Shop edited successfully.'})
            // msgModalRef.componentInstance.successMessage = "Tool/Equipment details updated.";
            this.toastMessage = 'Updated!';
          } else {
            //this.messageService.add({severity:'success', summary:'Shop added', detail: 'Shop added successfully.'})
            // msgModalRef.componentInstance.successMessage = "New Tools/Equipment added.";
            this.toastMessage = 'Added!';
          }
  
          setTimeout(() => {
            // msgModalRef.dismiss('Cross click'); 
            this.activeModal.close();    
            this.toastMessage = '';
          }, 2000);
        })
      }
    }, 500);
  }

  openAlternateModel(index,value){
    let modelRef = this.modalService.open(AlternateModelPopupComponent);
    modelRef.componentInstance.alternateModel = value;
    modelRef.result.then(e=>{
      this.selectedAlternateModel[index] = e;
      this.productForm.get('oemInfo').value.controls[index].controls['modelId'].setValue(0);
    })
  }

  uploadLogo(index = undefined) {
    let countryId = localStorage.getItem('countryId');
    this.imageData.uploaded = "";
    const modalRef = this.modalService.open(MediaUploadComponent, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'attachment-modal' });
    let postApiData = {
      action: 'new',
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: 1,
      userId: 512,
      postId: 0,
      countryId: '',
      contentType: 56,
      displayOrder: 0,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    }
    modalRef.componentInstance.uploadedItems = ""
  if(this.imageData.uploaded) {
    if(this.imageData && this.imageData.uploaded &&this.imageData.uploaded.items && this.imageData.uploaded.items.length>0){
      this.postApiData['uploadedItems'] = this.imageData.uploaded.items;
      this.postApiData['attachments'] = this.imageData.uploaded.attachments;
      modalRef.componentInstance.uploadedItems = this.imageData.uploaded;
    }
  }
    modalRef.componentInstance.access = 'post';
    modalRef.componentInstance.fileAttachmentEnable = true;
    modalRef.componentInstance.apiData = postApiData;
    modalRef.componentInstance.addLinkFlag = false;
    modalRef.componentInstance.acceptArray = ".jpg,.jpeg,.png,.webp.mp4,.mov"
    modalRef.componentInstance.uploadAttachmentAction.subscribe((receivedService) => {   
      this.postUploadActionTrue = false;
      this.postUpload = false;
      this.imageData.uploaded = receivedService.uploadedItems;
      this.savedImages = this.savedImages.concat(receivedService.uploadedItems.attachments)
      if(this.imageData.uploaded.items.length > 0){
        this.manageAction = "uploading"
        this.postApiData['uploadedItems'] = this.imageData.uploaded.items;
        this.postApiData['attachments'] = this.imageData.uploaded.attachments;
        setTimeout(() => {
          this.postUploadActionTrue = true;
          this.postUpload =true;
        }, 1000);
      }
      setTimeout(() => {
        modalRef.close();
      }, 1000);
    })
    // modalRef.componentInstance.type = "Add";
    // modalRef.componentInstance.profileType = "add-shop";
    // modalRef.componentInstance.userId = this.userId;
    // modalRef.componentInstance.domainId = this.domainId;
    // modalRef.componentInstance.id = "";     
    // modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
    //   if (receivedService) {
    //     if(index == undefined){
    //       this.imageData.push(receivedService);
    //     }else{
    //       this.imageData[index] = receivedService;
    //     }
    //     modalRef.dismiss('Cross click');
    //   }
    // });
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      vendorId: ['', [Validators.required]],
      modelId: [{ value: '', disabled: true }, [Validators.required]],
      productNameId: [{ value: '', disabled: true }],
      brandId: [{ value: '', disabled: true }],
      departmentId:[{ value: '', disabled: true }],
      categoryId: [{ value: '', disabled: true }],
      toolTypeId: [{ value: '', disabled: true }],
      mfgId: [{ value: '', disabled: true }],
      description: [''],
      partsInfo: [this.formBuilder.array([])],
      specsInfo: [this.formBuilder.array([])],
      oemInfo: [this.formBuilder.array([])],
      linksInfo: [this.formBuilder.array([])],
      certification: [false],
      distribtorName: [''],
      distribtorwebsite: [''],
      distribtorNotes: [''],
      distributorRating: [0],
      serviceCompanyName: [''],
      servicewebsite: [''],
      serviceNotes: [''],
      serviceRating: [0],
    })
    this.addPartForm()
    this.addSpecForm(true)
    this.addOemForm()
    this.addLinkForm()
  }

  deleteImage(index) {
    this.savedImages.splice(index, 1)
  }
  

  addPartForm() {
    this.partsInfo.push(
      this.formBuilder.group({
        partId: [''],
        partName: [''],
        partNotes: [''],
        partNetworkId: [this.dekraNetworkId],
      })
    )
  }

  addSpecForm(init=false) {

    if(init){
      this.specsInfo.push(
        this.formBuilder.group({
          labelId: [''],
          value: [''],
          unitId: [''],
        })
      )
    }else{
      this.specsInfo.push(
        this.formBuilder.group({
          labelId: [''],
          value: [''],
          unitId: [''],
        })
      )
    }
  }

  
  addOemForm() {
    this.oemInfo.push(
      this.formBuilder.group({
        oemId: [''],
        modelId: [""],
      })
    )
    this.selectedAlternateModel.push("")
  }

  addLinkForm() {
    this.linksInfo.push(
      this.formBuilder.group({
        linkId: ['0'],
        linkName: [''],
      })
    )
    this.selectedAlternateModel.push("")
  }

  updatePartForm(res) {
    this.partsInfo.push(
      this.formBuilder.group({
        partId: [res.partId ? res.partId : ""],
        partName: [res.partName ? res.partName : ""],
        partNotes: [res.partNotes ? res.partNotes : ""],
        partNetworkId: [res.partNetworkId ? res.partNetworkId : ""],
      })
    )
  }

  updateOemForm(res) {
    this.oemInfo.push(
      this.formBuilder.group({
        oemId: [res.oemId ? res.oemId : ""],
        modelId: [res.modelId ? res.modelId : ""],
      })
    )
  }

  updateSpecsForm(res) {
    this.partsInfo.push(
      this.formBuilder.group({
        labelId: [res.label ? res.label : ""],
        value: [res.value ? res.value : ""],
        unitId: [res.unit ? res.unit : ""],
      })
    )
  }

  removePartForm(index) {
    this.removePartControls(index);
  }

  removeSpecForm(index) {
    this.removeSpecControls(index);
  }

  removeOemForm(index) {
    this.removeOemControls(index);
  }

  removeLinkForm(index) {
    this.removeLinkControls(index);
  }

  addPartControls() {
    // this.formBuilder.array({
    //   partId :[''],
    //   partName:[''],
    //   partNotes:[''],
    //   partNetwork:[''],
    // })

    // this.productForm.addControl(`partId${index}`,new FormControl(''))
    // this.productForm.addControl(`partName${index}`,new FormControl(''))
    // this.productForm.addControl(`partNotes${index}`,new FormControl(''))
    // this.productForm.addControl(`partNetwork${index}`,new FormControl(''))
  }

  removePartControls(index) {
    this.partsInfo.removeAt(index);
  }

  removeSpecControls(index) {
    this.specsInfo.removeAt(index);
  }

  removeOemControls(index) {
    this.oemInfo.removeAt(index);
  }

  removeLinkControls(index) {
    this.linksInfo.removeAt(index);
  }

  // Manage List
  manageList(type: string,index = "") {
    if(type != "10" && type != "27" && type != "28" && this.vendorSelectedId.toString() == ""){
        return false;
    }

    if(type == "12"  && this.productModelSelectedId.toString() == ""){
      return false
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

    switch (type) {
      case '10': inputData['title'] = 'Vendor Name'
        break;
      case '11': inputData['title'] = 'Product Model'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
      case '12': inputData['title'] = 'Product Name'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        apiData['modelId'] = this.productModelSelectedId.toString()
        
        break;
      case '13': inputData['title'] = 'Brand'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
      case '14': inputData['title'] = 'Tool Category'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
      case '15': inputData['title'] = 'Type'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
      case '16': inputData['title'] = 'Manufacturer'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
      case '17': inputData['title'] = 'Department'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
      case '27': inputData['title'] = 'Spec Name'
      apiData['vendorId'] = this.vendorSelectedId.toString()
      apiData['modelId'] = this.productModelSelectedId.toString()
      break;
      case '28': inputData['title'] = 'Unit'
      apiData['vendorId'] = this.vendorSelectedId.toString()
      apiData['modelId'] = this.productModelSelectedId.toString()
      break;
      case '20': inputData['title'] = 'OEM'
      apiData['vendorId'] = this.vendorSelectedId.toString()
      apiData['modelId'] = this.productModelSelectedId.toString()
      break;
      default: inputData['title'] = 'Manage'
        apiData['vendorId'] = this.vendorSelectedId.toString()
        break;
    }

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    if(type == "20"){
      modalRef.componentInstance.addAllow = false;
      modalRef.componentInstance.oemDuplicateCheckKey = this.productForm?.get('oemInfo')?.value.controls.map(e=>{
        return e.value.oemId;
      })
    }
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.inputData = inputData;
    // modalRef.componentInstance.specData = this.specLabel
    // modalRef.componentInstance.unitData = this.unitOptions
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
      let items = receivedService;
      // if(type == "11"){
      //   items = receivedService.value;
      //   let id = receivedService.value[0].id
      //   this.specLabel = receivedService.res.items.find(e=>e.id == id)["toolSpec"].map(e=>{
      //     return {id:e.labelSpecId,name:e.labelSpecName}
      //   });
      //   this.unitOptions = receivedService.res.items.find(e=>e.id == id)["toolSpec"].map(e=>{
      //     return {id:e.unitId,name:e.unitName}
      //   });
      // }

      switch (type) {
        case '10':
          this.vendorSelectedId = [];
          this.vendorSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.vendorSelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.vendorSelectedId = items[t].id;
              this.vendorSelectedName = items[t].name;
            // }
          }
          this.productForm.controls['modelId'].enable();
          this.productForm.controls['brandId'].enable();
          this.productForm.controls['departmentId'].enable();
          this.productForm.controls['categoryId'].enable();
          this.productForm.controls['toolTypeId'].enable();
          this.productForm.controls['mfgId'].enable();
          this.productForm.get('vendorId').setValue(this.vendorSelectedId);
          this.productForm.get('modelId').setValue('');
          this.productForm.get('productNameId').setValue('');
          this.productForm.get('brandId').setValue('');
          this.productForm.get('categoryId').setValue('');
          this.productForm.get('toolTypeId').setValue('');
          this.productForm.get('departmentId').setValue('');
          // this.productForm.get('productName').setValue(''); 
          this.productForm.get('mfgId').setValue('');


          break;
        case '11':
          this.productModelSelectedId = [];
          this.productModelSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.productModelSelectedId.findIndex(
              //   (option) => option == items[t].id
              // );
              // if (chkIndex < 0) {
                this.productModelSelectedId = items[t].id;
                this.productModelSelectedName = items[t].name;
                // }
              }
              this.modelOptions = [{id:this.productModelSelectedId,name:this.productModelSelectedName}];
              if(this.productForm.get('oemInfo').value.controls.length > 0){
                this.productForm.get('oemInfo').value.controls.forEach((e,index)=>{
                  if(this.productForm.get('oemInfo').value.controls[index].controls['modelId'].value !== " " && this.productForm.get('oemInfo').value.controls[index].controls['modelId'].value){
                    this.productForm.get('oemInfo').value.controls[index].controls['modelId'].setValue(this.productModelSelectedId);
                  }
                })
              }
          this.productForm.get('modelId').setValue(this.productModelSelectedId);
          this.productForm.controls['productNameId'].enable();
          if(this.specsInfo.length > 0){
            this.specsInfo[0].enable();
          }
         
          break;
        case '12':
          this.productNameSelectedId = [];
          this.productNameSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.productNameSelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.productNameSelectedId = items[t].id;
              this.productNameSelectedName = items[t].name;
            // }
          }
          this.productForm.get('productNameId').setValue(this.productNameSelectedId);
          break;
        case '13':
          this.brandSelectedId = [];
          this.brandSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.brandSelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.brandSelectedId = items[t].id;
              this.brandSelectedName = items[t].name;
            // }
          }
          this.productForm.get('brandId').setValue(this.brandSelectedId);
          break;
        case '14':
          this.categorySelectedId = [];
          this.categorySelectedName = [];
          for (let t in items) {
            // let chkIndex = this.categorySelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.categorySelectedId = items[t].id;
              this.categorySelectedName = items[t].name;
            // }
          }
          this.productForm.get('categoryId').setValue(this.categorySelectedId);
          break;
        case '15':
          this.typeSelectedId = [];
          this.typeSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.typeSelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.typeSelectedId = items[t].id;
              this.typeSelectedName = items[t].name;
            // }
          }
          this.productForm.get('toolTypeId').setValue(this.typeSelectedId);
          break;
        case '16':
          this.manufacturerSelectedId = [];
          this.manufacturerSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.manufacturerSelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.manufacturerSelectedId = items[t].id;
              this.manufacturerSelectedName = items[t].name;
            // }
          }
          this.productForm.get('mfgId').setValue(this.manufacturerSelectedId);
          break;
        case '17':
          this.departmentSelectedId = [];
          this.departmentSelectedName = [];
          for (let t in items) {
            // let chkIndex = this.manufacturerSelectedId.findIndex(
            //   (option) => option == items[t].id
            // );
            // if (chkIndex < 0) {
              this.departmentSelectedId = items[t].id;
              this.departmentSelectedName = items[t].name;
            // }
          }
          this.productForm.get('departmentId').setValue(this.departmentSelectedId);
          break;
          case '27':
            let selectedSpecId = [];
            let selectedSpecName = [];
            for (let t in items) {
                selectedSpecId = items[t].id;
                selectedSpecName = items[t].name;
            }
            this.getCommonDatalist("27");
            this.productForm.get('specsInfo').value.controls[index].controls['labelId'].setValue(selectedSpecId);
            break;
            case '28':
              let selectedSpecUnit = [];
              let selectedSpecUnitName = [];
              for (let t in items) {
                selectedSpecUnit = items[t].id;
                selectedSpecUnitName = items[t].name;
              }
              this.getCommonDatalist("28");
              this.productForm.get('specsInfo').value.controls[index].controls['unitId'].setValue(selectedSpecUnit);
              break;
            case '20':
              let selectedOemUnit = [];
              let selectedOemName = [];
              for (let t in items) {
                selectedOemUnit = items[t].id;
                selectedOemName = items[t].name;
              }
              this.productForm.get('oemInfo').value.controls[index].controls['oemId'].setValue(selectedOemUnit);
              this.oemChange(this.vendorSelectedId.toString(),index);
              break;
        default: inputData['title'] = 'Manage'
          break;
      }


      // console.log(this.vendorSelectedId, this.vendorSelectedName);
      // this.productForm.get('shopType').setValue(this.vendorSelectedId);                     

    });
  }

  modelChange(index){
      this.openAlternateModel(index,this.selectedAlternateModel[index])
  }

  oemChange(event,index){
    if(!this.productForm.get('oemInfo').value.controls[index].controls['modelId'].value){
      this.productForm.get('oemInfo').value.controls[index].controls['modelId'].setValue(this.productModelSelectedId);
    }
  }

  getCommonDatalist(type){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("networkId", this.dekraNetworkId);
    apiFormData.append("type", type);
    // if(this.vendorSelectedId){
    //   apiFormData.append("vendorId", this.vendorSelectedId.toString());
    // }
    // if(this.productModelSelectedId){
    //   apiFormData.append("modelId", this.productModelSelectedId.toString());
    // }
    return this.headQuarterService.getCommonList(apiFormData)
    .subscribe((response: any) => {
      if(response && response.items){
        switch(type){
          case "27": this.specLabel = response.items
          break;
          case "28": this.unitOptions = response.items
          break;
          case "20": this.oemOptions = response.items
          break;
          default:;
          break;
        }
      }
    });
}

}
