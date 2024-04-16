import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Constant } from 'src/app/common/constant/constant';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { ImageCropperComponent } from 'src/app/components/common/image-cropper/image-cropper.component';
import { ManageListComponent } from 'src/app/components/common/manage-list/manage-list.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { HeadquarterService } from 'src/app/services/headquarter.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit {
  public bodyHeight: number;
  public innerHeight: number;
  public scrollPos: any = 0;
  public sconfig: PerfectScrollbarConfigInterface = {};
  sectionForm = this.formBuilder.group({})
  isPublished:string = "1";
  userId: any;
  dekraNetworkId: any = "2";
  user: any
  public apiKey: string = Constant.ApiKey;
  public domainId;
  public item;
  networkName: string = ""
  submitted = false;
  bodyElem: HTMLBodyElement;
  typeSelectedId: any[] = [];
  typeSelectedName: any[] = [];
  typesList:any[] = [];
  tagSelectedId: any[] = [];
  tagSelectedName: any[] = [];
  shopList: any;
  imageData: any;
  networkList: any = [];
  selectedNetworkId: boolean = false;
  editId: any;
  flowChartcreatedById: any;
  gtsData: any;
    // Resize Widow
    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
    }
  
    // Scroll Down
    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
      this.scrollPos = event.target.scrollTop;
    }

  constructor(
    private formBuilder:FormBuilder,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private headQuarterService: HeadquarterService,
    private config: NgbModalConfig,
    private router:Router,
    private activeRoute:ActivatedRoute,
    private headquarterService:HeadquarterService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  
    this.initForm()
  }

  ngOnInit(): void {
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';
    // this.addPartForm()
    this.bodyHeight = window.innerHeight;
    if(this.activeRoute.snapshot && this.activeRoute.snapshot.params && this.activeRoute.snapshot.params.id){
      this.editId = this.activeRoute.snapshot.params.id;
    }
    this.setScreenHeight();
    // this.getShopsList()
    // this.getHqDetails()
    this.getNetworkList()
    if(this.editId){
      this.getGtsData()
    }
    this.getCommonDataList("19")
  }

  getGtsData(){
    const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("limit", "10");
      apiFormData.append("offset","0");
      apiFormData.append("id",this.editId);
      apiFormData.append("networkId",this.user.networkId.toString());

      this.headQuarterService.getGtsList(apiFormData).subscribe((response:any) => {
       if(response && response.items && response.items.length > 0){
        response.items[0]["description"]=response.items[0].additionalInfo
        response.items[0]["title"]=response.items[0].name

        if(!response.items[0].gtsImg.includes("gts-placeholder"))
        this.imageData={gtsImg:response.items[0].gtsImg,gtsBaseImg:response.items[0].gtsBaseImg}

        response.items[0]["networkId"] = Number(response.items[0].networkId)
        response.items[0]["workFlowId"] = Number(response.items[0].workFlowId)

        if(response.items[0]["flowChartcreatedById"]){
          this.flowChartcreatedById = response.items[0]["flowChartcreatedById"];
        }
        if(response.items[0]["isPublished"]){
          this.isPublished = response.items[0]["isPublished"];
        }
        if(response.items[0]["tags"] !== ""){
          response.items[0]["tags"] = JSON.parse(response.items[0]["tags"])
        }

        if(response.items[0].tagsInfo && response.items[0].tagsInfo.length > 0){
          response.items[0]?.tagsInfo.forEach(e=>{
            this.tagSelectedId.push(e?.id);
            this.tagSelectedName.push(" "+e?.name);
          })
        }
        // for (let t in  response.items[0]?.tagsInfo) {
        //   this.typeSelectedId.push(response.items[0]?.tagsInfo?.id);
        //   this.typeSelectedName = response.items[0]?.tagsInfo?.name;
        // }
        // response.items[0]?.tagsInfo.forEach(e=>{
        //   this.tagSelectedId.push(e?.id);
        //   this.tagSelectedName.push(e?.name);
        // })
         this.sectionForm.patchValue(response.items[0])
         this.gtsData = response.items[0]
       }
      })

  }

  deleteLogo(){
    this.imageData = ""
  }

  initForm(){
    this.sectionForm = this.formBuilder.group({
      workFlowId:["",[Validators.required]],
      title:["",[Validators.required]],
      description:[""],
      networkId:[""],
      tags:[""]
    })
  }

  // getHqDetails(){ 
    
  //   const apiFormData = new FormData();
  //   apiFormData.append("apiKey", this.apiKey);
  //   apiFormData.append("domainId", this.domainId);
  //   apiFormData.append("userId", this.userId);
  //   apiFormData.append("platform", '3');
  //   apiFormData.append("networkId", this.dekraNetworkId);
  //    this.headQuarterService.getNetworkhqList(apiFormData).subscribe((response:any) => {
  //       if(response && response.data){
  //       this.networkList = response.data;
  //       }
  //     })
  // }

  uploadLogo() {
    const modalRef = this.modalService.open(ImageCropperComponent,{size:'md'});
    modalRef.componentInstance.type = "Add";
    modalRef.componentInstance.profileType = "add-gts-procedure";
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

  submitForm(type){
    this.submitted = true;
    if(this.sectionForm.valid){
      let request = this.sectionForm.value;
      if(request && request.tags){
        request.tags = JSON.stringify(request.tags)
      }
    const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      if(type == 'published'){
        apiFormData.append("isPublised", "2");
      }else{
        apiFormData.append("isPublised", "1");
      }

      for (let key in request) {
        if (key == "partsInfo") {
          apiFormData.append(key, JSON.stringify(request[key].value));
        } else {
          apiFormData.append(key, request[key]);
        }
      }

      if(this.editId){
        apiFormData.append("id", this.editId);
      }

      if(this.imageData && this.imageData.response){
        apiFormData.append("gtsImg", this.imageData.response);
      }

      if(this.imageData && this.imageData.gtsBaseImg){
        apiFormData.append("gtsImg", this.imageData.gtsBaseImg);
      }
        this.headQuarterService.saveGtsProcedure(apiFormData).subscribe((response:any) => {
          if(type == 'sectionEditor'){
            if(response.flowchartURL){
              window.location.href = response.flowchartURL
            }
          }else{
                const msgModalRef = this.modalService.open(SuccessModalComponent, this.config);

                if(this.editId){
                //this.messageService.add({severity:'success', summary:'Shop edited', detail: 'Shop edited successfully.'})
                  msgModalRef.componentInstance.successMessage = "Section details updated.";
                }else{
                  //this.messageService.add({severity:'success', summary:'Shop added', detail: 'Shop added successfully.'})
                  msgModalRef.componentInstance.successMessage = "New section added.";
                }

              /*setTimeout(() => {
                this.activeModal.close('Cross click');    
              }, 1000);*/

              setTimeout(() => {
                msgModalRef.dismiss('Cross click'); 
              }, 2000);
            if (!this.editId) this.router.navigate(["headquarters/audit"],{ queryParams: { type: 'section' } });
            else this.router.navigate(["section/" + this.user.networkId.toString() + '/' + this.editId]);
          }
        })
      }

  }

  backToList(){
    if (!this.editId) this.router.navigate(["headquarters/audit"],{ queryParams: { type: 'section' } });
    else this.router.navigate(["section/" + this.user.networkId.toString() + '/' + this.editId]);
  }

  submitCancel(){
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = 'Cancel';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!receivedService) {
        return;
      } else {
        this.backToList();
      }
    });
  }

  removeTag(index){
    // let ids = this.tagSelectedId
    // let names = this.tagSelectedName
    // ids.splice(index,1);
    // names.splice(index,1);
    this.tagSelectedId = this.tagSelectedId.filter((e,i)=>i != index);
    this.tagSelectedName = this.tagSelectedName.filter((e,i)=>i != index);;
    this.sectionForm.get('tags').setValue(this.tagSelectedId);
  }


  // Manage List
  manageList(type: string) {
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
    if(type == "18"){
      filteredNames = this.tagSelectedName;
      filteredItems = this.tagSelectedId
    } else if(type == "19"){
      filteredNames = this.typeSelectedName;
      filteredItems = this.typeSelectedId
    }
    inputData = {
      type :type,
      actionApiName: "",
      actionQueryValues: "",
      selectionType: "multiple",
      field: 'dekra-shoptype',
      filteredItems: filteredItems,
      filteredLists: filteredNames,
      baseApiUrl: this.headQuarterService.dekraBaseUrl,
      apiUrl: this.headQuarterService.dekraBaseUrl + "" + Constant.getDekraCommonData,
    };

    if(type == '18'){
      inputData["title"] = "Tag"
    }else{
      inputData["title"] = "Procedure Type"
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
      let items = receivedService;
      switch (type) {
        case '18':
          this.tagSelectedId = [];
          this.tagSelectedName = [];
          for (let t in items) {
              this.tagSelectedId.push(items[t].id);
              this.tagSelectedName.push(items[t].name);
          }
          this.sectionForm.get('tags').setValue(this.tagSelectedId);
          break;
        case '19':
          this.typeSelectedId = [];
          this.typeSelectedName = [];
          for (let t in items) {
              this.typeSelectedId = items[t].id;
              this.typeSelectedName = items[t].name;
          }
          this.sectionForm.get('workFlowName').setValue(this.typeSelectedId);
          break;
        default: inputData['title'] = 'Manage'
          break;
      }
    });
  }
  

    // Set Screen Height
    setScreenHeight() {
      let headerHeight = 0;
        headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
      this.innerHeight = (this.bodyHeight-(headerHeight+110));  
      console.log(this.innerHeight);
           
    }

    getCommonDataList(type:string){
      const apiFormData = new FormData();
      apiFormData.append("type", type);
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      this.headquarterService.getCommonList(apiFormData).subscribe((response: any) => {
        if(type == "19"){
          this.typesList = response.items;
        }
        
      });
    }

    // getShopsList(){
    //   const apiFormData = new FormData();
    //   apiFormData.append("apiKey", this.apiKey);
    //   apiFormData.append("domainId", this.domainId);
    //   apiFormData.append("userId", this.userId);
    //   apiFormData.append("platform", '3');
    //   apiFormData.append("networkId", this.dekraNetworkId);
    // //   if(this.subAttribute && this.subAttribute.levelOneId !== 0){
    // //     apiFormData.append("levelOneId", this.subAttribute.levelOneId);
    // //   }
    // //   if(this.subAttribute && this.subAttribute.levelTwoId !== 0){
    // //    apiFormData.append("levelTwoId", this.subAttribute.levelTwoId);
    // //  }
    // //  if(this.subAttribute && this.subAttribute.levelThreeId !== 0){
    // //    apiFormData.append("levelThreeId", this.subAttribute.levelThreeId);
    // //  }
    //     this.headQuarterService.getShopList(apiFormData).subscribe((response:any) => {
    //       if(response && response.items && response.items.length > 0){
    //         this.shopList = response.items;
    //       }
    //     })
    // }

    getNetworkList(){
      const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("networkId", this.dekraNetworkId);
      apiFormData.append("type", "20");
      this.headQuarterService.getCommonList(apiFormData).subscribe((response:any)=>{
        console.log(response)
        if(response && response.items){
          this.networkList = response.items;
        }

        if(this.user.domain_id != 1){
          this.selectedNetworkId = true;
          if(!this.editId){
            this.sectionForm.controls['networkId'].setValue(this.user.networkId); 
          }
        }else{
        }
      })
    }

}
