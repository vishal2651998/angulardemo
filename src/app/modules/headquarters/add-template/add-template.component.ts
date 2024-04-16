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
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {

  public bodyHeight: number;
  public innerHeight: number;ini
  public scrollPos: any = 0;
  public sconfig: PerfectScrollbarConfigInterface = {};
  isSelectSections:boolean = true;
  sectionList: any[] = [];
  selectedSectionList: any[] = [];
  templateForm = this.formBuilder.group({})
  userId: any;
  dekraNetworkId: any = "2";
  user: any
  public apiKey: string = Constant.ApiKey;
  public domainId;
  networkList: any[] = [];
  selectedNetworkId: boolean;
  editId: any;
  loading = false;
  inspectionTimeOptions = [
    {name:"1 Day",id:"1 Day"},
    {name:"2 Days",id:"2 Days"},
    {name:"3 Days",id:"3 Days"},
    {name:"4 Days",id:"4 Days"},
    {name:"5 Days",id:"5 Days"}
  ]
  previousNetwork = 0;
  bodyElem: HTMLBodyElement;
  tagSelectedName: any = [];
  tagSelectedId: any = [];
  typeSelectedId: any = [];
  typeSelectedName: any = [];
  typesList: any = [];
  submitted: boolean;
  imageData: any;
  isPublished: any = "1";
  searchStr = "";
  filteredSections: any[];
  selectedType: any = "";
  editingSection: any;
  noteStr = "";
  
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


  constructor(private router:Router,private activeRoute:ActivatedRoute,private headQuarterService:HeadquarterService,private formBuilder:FormBuilder, private config: NgbModalConfig,private authenticationService : AuthenticationService,private modalService:NgbModal) { 
    this.initForm();
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    this.bodyHeight = window.innerHeight;
    this.dekraNetworkId = localStorage.getItem("dekraNetworkId") != undefined ? localStorage.getItem("dekraNetworkId") : '';
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    if(this.activeRoute.snapshot && this.activeRoute.snapshot.params && this.activeRoute.snapshot.params.id){
      this.editId = this.activeRoute.snapshot.params.id;
    }
    this.getSections(true)
    // this.networkName = localStorage.getItem('networkName') != undefined ? localStorage.getItem("networkName") : '';
      this.setScreenHeight();
      this.getNetworkList();
      this.getCommonDataList("19")
  }

  filterSections(){
    this.filteredSections.sort((a,b)=>{
      return b.procedureId - a.procedureId;
    })
  }

  deleteLogo(){
    this.imageData = ""
  }

  getTemplateData(){
    const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("limit", "10");
      apiFormData.append("offset","0");
      apiFormData.append("id",this.editId);
      apiFormData.append("networkId",this.user.networkId.toString());

      this.headQuarterService.getTemplateList(apiFormData).subscribe((response:any) => {
        this.loading = false;
       if(response && response.items && response.items.length > 0){
        // if(!response.items[0].gtsImg.includes("gts-placeholder"))
        if(response.items[0].logoUrl && response.items[0].logoImageName){
          this.imageData={logoUrl:response.items[0].logoUrl,logoImageName:response.items[0].logoImageName}
        }
        if(response.items[0]["isPublished"]){
          this.isPublished = response.items[0]["isPublished"];
        }
        // if(response.items[0]["tags"] && response.items[0]["tags"].length !== 0){
        //   response.items[0]["tags"] = JSON.parse(response.items[0]["tags"])
        // }

        if(response.items[0]["networkId"]){
          response.items[0]["networkId"] = Number(response.items[0]["networkId"]);
        }

        if(response.items[0].tagsInfo && response.items[0].tagsInfo.length > 0){
          response.items[0]?.tagsInfo.forEach(e=>{
            this.tagSelectedId.push(e?.id);
            this.tagSelectedName.push(" "+e?.name);
          })
        }

        if(response.items[0]["typeId"]){
          response.items[0]["typeId"] = Number(response.items[0]["typeId"]);
        }

        if(response.items[0]["typeName"]){
          this.selectedType = response.items[0]["typeName"];
        }

        if(response.items[0]["sections"] && response.items[0]["sections"].length > 0){
          response.items[0]["sections"].forEach((e)=>{
            this.sectionList = this.sectionList.filter((f) =>{
              if(f.procedureId == e.sectionId){
                this.selectedSectionList.push({...f,note:e.sectionNotes ? e.sectionNotes : ""});
                return false
              }else{
                return true
              }
            });
          })
          this.filteredSections = JSON.parse(JSON.stringify(this.sectionList));
          this.filterSections();
        }


        // for (let t in  response.items[0]?.tagsInfo) {
        //   this.tagSelectedId.push(response.items[0]?.tagsInfo?.id);
        //   this.tagSelectedName = response.items[0]?.tagsInfo?.name;
        // }
        response.items[0]?.tagsInfo.forEach(e=>{
          this.tagSelectedId.push(e?.id);
          this.tagSelectedName.push(" "+e?.name);
        })
         this.templateForm.patchValue(response.items[0])
         this.templateForm.controls["networkId"].valueChanges.subscribe(e=>{
          if(this.selectedSectionList.length > 0){
            const modalRef = this.modalService.open(ConfirmationComponent, this.config);
            modalRef.componentInstance.access = 'Cancel';
            modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
              modalRef.dismiss('Cross click'); 
              if(!receivedService) {
                this.templateForm.controls["networkId"].setValue(this.previousNetwork,{ emitEvent: false })
                return;
              } else {
                this.previousNetwork = e;
                this.selectedSectionList = [];
                this.getSections();
              }
            });
          }else{
            this.previousNetwork = e;
            this.getSections();
          }
        })
         let templateData = response.items[0]
       }
      })

  }

  networkChange(event:any){
    event.originalEvent.preventDefault()
    return false
  }
  typeChange(event:any){
    console.log(event)
  }

  uploadLogo() {
    const modalRef = this.modalService.open(ImageCropperComponent,{size:'md'});
    modalRef.componentInstance.type = "Add";
    modalRef.componentInstance.profileType = "add-template";
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

  removeTag(index){
    // let ids = this.tagSelectedId
    // let names = this.tagSelectedName
    // ids.splice(index,1);
    // names.splice(index,1);
    this.tagSelectedId = this.tagSelectedId.filter((e,i)=>i != index);
    this.tagSelectedName = this.tagSelectedName.filter((e,i)=>i != index);;
    if(this.tagSelectedId && this.tagSelectedId.length == 0){
      this.templateForm.get('tags').setValue("");
    }else{
      this.templateForm.get('tags').setValue(this.tagSelectedId);
    }
  }

  searchSections(){
    if(this.searchStr == ""){
      this.filteredSections = this.sectionList;
    }else{
      this.filteredSections =  this.sectionList.filter(e=>{
        if(e.name){
          return e.name.toLowerCase().includes(this.searchStr.toLowerCase());
        }else{
          return false;
        }
      });
    }
  }
   // Set Screen Height
   setScreenHeight() {
    let headerHeight = 0;
    if(document.getElementsByClassName('prob-header') && document.getElementsByClassName('prob-header').length > 0){
        headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
        this.innerHeight = (this.bodyHeight-(headerHeight+110));  
      }
  }
  
  removeSearch(){
    this.searchStr = "";
    this.searchSections();
  }

  editNote(id,note=""){
    this.editingSection = id;
    this.noteStr = note;
  }

  saveNote(id){
    this.selectedSectionList.forEach(e => {
        if(e.procedureId == id){
          e["note"] = this.noteStr;
        }
      });
    this.cancelNote();
  }

  cancelNote(){
    this.editingSection = "";
    this.noteStr = "";
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
      filteredNames = this.tagSelectedName;
      filteredItems = this.tagSelectedId
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
      this.bodyElem.classList.remove("dekra-audit-tmodal");
      modalRef.dismiss("Cross click");
      let items = receivedService;
      switch (type) {
        case '18':
          this.tagSelectedId = [];
          this.tagSelectedName = [];
          for (let t in items) {
              this.tagSelectedId.push(items[t].id);
              this.tagSelectedName.push(" " + items[t].name);
          }
          this.templateForm.get('tags').setValue(this.tagSelectedId);
          break;
        case '19':
          this.typeSelectedId = [];
          this.typeSelectedName = [];
          for (let t in items) {
              this.typeSelectedId = items[t].id;
              this.typeSelectedName = items[t].name;
          }
          this.templateForm.get('typeId').setValue(this.typeSelectedId);
          break;
        default: inputData['title'] = 'Manage'
          break;
      }
    });
  }

  removeSelectedSection(section){
    this.selectedSectionList = this.selectedSectionList.filter(e=>{
      if(e.procedureId == section.procedureId){
        return false;
      }else{
        return true;
      }
    });
    this.sectionList.push(section)
    this.filteredSections = this.sectionList;
    this.filterSections();
  }

  backToList(){
    if (!this.editId) this.router.navigate(["headquarters/audit"],{ queryParams: { type: 'template' } });
    else this.router.navigate(["template/" + this.editId]);
  }

  selectSections(){
    this.isSelectSections = true;
    this.getSections();
    this.selectedSectionList = [];
  }

  initForm(){
    this.templateForm = this.formBuilder.group({
      typeId:["",[Validators.required]],
      title:["",[Validators.required]],
      inspectionTime:[""],
      tags:[""],
      networkId:[0,[Validators.required]]
    })

    this.templateForm.controls["typeId"].valueChanges.subscribe(e=>{
      this.selectedType = this.typesList.find(t=>t.id == e)?.name;
    })

    // this.templateForm.controls["networkId"].valueChanges.subscribe(e=>{
    //   this.selectedSectionList = [];
    //   this.getSections();
    // })
  }

  submit(type){
    this.submitted = true;
    if(this.templateForm.valid && this.selectedSectionList.length != 0 ){
      let request =  JSON.parse(JSON.stringify(this.templateForm.value));
      if(request && request.tags){
        request.tags = "[" + request.tags + "]"
      }

      if(this.selectedSectionList && this.selectedSectionList.length > 0){

        let section = this.selectedSectionList.map(e=>{
          return {sectionId:e.procedureId,sectionNotes:e.note ? e.note : ""}
        });
        request["sections"] = JSON.stringify(section)
      }
    const apiFormData = new FormData();
      apiFormData.append("apiKey", this.apiKey);
      apiFormData.append("domainId", this.domainId);
      apiFormData.append("userId", this.userId);
      apiFormData.append("platform", '3');
      apiFormData.append("networkId", this.dekraNetworkId);
      if(type == 'published'){
        apiFormData.append("isPublished", "2");
      }else{
        apiFormData.append("isPublished", "1");
      }

      if(this.imageData && this.imageData.response){
        apiFormData.append("bannerUrl", this.imageData.response);
      }

      if(this.imageData && this.imageData.logoImageName){
        apiFormData.append("bannerUrl", this.imageData.logoImageName);
      }
      

      for (let key in request) {
          apiFormData.append(key, request[key]);
      }

      if(this.editId){
        apiFormData.append("id", this.editId);
      }

        this.headQuarterService.saveTemplate(apiFormData).subscribe((response:any) => {
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.config);
            if(this.editId){
              msgModalRef.componentInstance.successMessage = "Template details updated.";
            }else{
              msgModalRef.componentInstance.successMessage = "New template added.";
            }
            setTimeout(() => {
              msgModalRef.dismiss('Cross click'); 
            }, 2000);
            if (!this.editId) this.router.navigate(["headquarters/audit"],{ queryParams: { type: 'template' } });
            else this.router.navigate(["template/" + this.editId]);
          // }
        })
      }
  }

  getSections(init=false){
    if(init){
      this.loading = true;
    }
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("limit", "99999");
    apiFormData.append("offset","0");
    apiFormData.append("statusId","2");
    // if(this.user.domain_id !=1 && this.user.networkId){
      if(this.templateForm.controls["networkId"].value && this.templateForm.controls["networkId"].value == 0){
        apiFormData.append("networkId",this.templateForm.controls["networkId"].value);
      }else{
        apiFormData.append("networkId",this.dekraNetworkId);
      }

      this.headQuarterService.getGtsList(apiFormData).subscribe((response:any) => {
        if(response && response.items){
          if(response.items && response.items.length > 0 ){
            this.sectionList = response.items
            this.filteredSections = this.sectionList;
            this.filterSections();
          }
          
                if(init){
                  if(this.editId){
                    this.getTemplateData()
                  }else{
                    this.templateForm.controls["networkId"].valueChanges.subscribe(e=>{
                      if(this.selectedSectionList.length > 0){
                        const modalRef = this.modalService.open(ConfirmationComponent, this.config);
                        modalRef.componentInstance.access = 'Cancel';
                        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
                          modalRef.dismiss('Cross click'); 
                          if(!receivedService) {
                            this.templateForm.controls["networkId"].setValue(this.previousNetwork,{ emitEvent: false })
                            return;
                          } else {
                            this.previousNetwork = e;
                            this.selectedSectionList = [];
                            this.getSections();
                          }
                        });
                      }else{
                        this.previousNetwork = e;
                        this.getSections();
                      }
                    })
                    this.loading = false
                  }
                }
        }
      })
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
          this.templateForm.controls['networkId'].setValue(this.user.networkId); 
        }
      }else{
      }
    })
  }

  allowDrop(ev:DragEvent) {
    ev.preventDefault();
  }

  onDrag(ev:DragEvent,itemValue:string,parent:string,index = ""){
    ev.dataTransfer?.setData("itemToMove",itemValue);
    ev.dataTransfer?.setData("parent",parent);
  }

  dropSection(event,index){

  }

  allowDragSection(event,index){
    event.preventDefault()
      document.getElementById(`div${index}`)!.style.opacity = "0.3";
  }

  dragLeaveSection(event,index){
    event.preventDefault()
    document.getElementById(`div${index}`)!.style.opacity = "";
  }

  getCommonDataList(type:string){
    const apiFormData = new FormData();
    apiFormData.append("type", type);
    apiFormData.append("apiKey", this.apiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("platform", '3');
    apiFormData.append("networkId", this.dekraNetworkId);
    this.headQuarterService.getCommonList(apiFormData).subscribe((response: any) => {
      if(type == "19"){
        this.typesList = response.items;
      }
      
    });
  }

  onDrop(ev:DragEvent,destination:string,index=null){
    ev.preventDefault();
    let itemToMove = ev.dataTransfer?.getData("itemToMove");
    let parent = ev.dataTransfer?.getData("parent");
    let item;
    if(parent == "sectionList"){
      this.sectionList = this.sectionList.filter(e=>{
        if(e.procedureId == itemToMove){
          item = e;
          return false;
        }else{
          return true;
        }
      });
    }else if(parent == "selectedSectionList"  && !(destination == "selectedSectionList" && index==null)){
      this.selectedSectionList = this.selectedSectionList.filter(e=>{
        if(e.procedureId == itemToMove){
          item = e;
          return false;
        }else{
          return true;
        }
      });
    }

    if(item){
      if(destination == "sectionList"){
        if(index != null){
          this.sectionList.splice(index,0,item)
          document.getElementById(`div${index}`)!.style.opacity = "";
        }else{
          this.sectionList.push(item)
        }
      }else if(parent != 'selectedSectionList' && destination == "selectedSectionList"){
        if(index != null){
          this.sectionList.splice(index,0,item)
          document.getElementById(`div${index}`)!.style.opacity = "";
        }else{
          this.selectedSectionList.push(item)
        }
      }else{
        if(index != null && destination == "selectedSectionList" && parent == 'selectedSectionList'){
          this.selectedSectionList.splice(index,0,item)
          document.getElementById(`div${index}`)!.style.opacity = "";
        }
      }
    }
    this.filteredSections = this.sectionList;
    this.searchSections();
    this.filterSections();
  }

}
