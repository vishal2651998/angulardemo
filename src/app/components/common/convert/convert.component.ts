import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ManageListComponent } from "../../../components/common/manage-list/manage-list.component";
import { Constant } from "../../../common/constant/constant";

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit, OnDestroy {

  @Input() access;
  @Input() title: string = "";
  @Input() apiData;
  @Output() convertAction: EventEmitter<any> = new EventEmitter();
  public bodyElem;
  public bodyTxt: string = "";
  public yesbtnEnable: boolean = false;

  public catItems: any;
  public filteredCatIds = [];
  public filteredCats = [];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];

    switch(this.access) {
      case 'convert':
        this.bodyElem.classList.add("convert-popup");
        this.bodyTxt = "Are you sure you want to convert Document  to Knowledge Article?";
        break;    
      case 'convert-loader':
        this.bodyElem.classList.add("convert-loader-popup");
        this.bodyTxt = "Converting Document to Knowledge Article..";
        break; 
    }

  }

  // Convert Action
  confAction(flag) {
    if(flag){
      let data = {
        filteredCatIds: this.filteredCatIds,
        filteredCats: this.filteredCats,
        action: 'yes'
      }
      this.convertAction.emit(data);
      this.access = 'convert-loader';
      this.ngOnInit();
    }
    else{
      let data = {
        //filteredCatIds: this.filteredCatIds,
        //filteredCats: this.filteredCats,
        action: 'no'
      }
      //this.convertAction.emit(data);  
      this.activeModal.dismiss("Cross click");
    }  
    
  }

  // Manage List
  manageList(field) {
    let access;
    let filteredItems;
    let baseUrl = "";
    let inputData = { };
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      baseUrl = Constant.TechproMahleApi;
    }
    else{
      baseUrl = Constant.CollabticApiUrl;
    }
    switch (field) {      
      case "category":
        this.apiData["isNew"] = "1";
        access = "newthread";
        filteredItems = this.filteredCatIds;
        inputData = {
          actionApiName: "",
          actionQueryValues: "",
          selectionType: "multiple",
          field:'category',   
          title: "Category",
          filteredItems: filteredItems,
          filteredLists: filteredItems,
          baseApiUrl: baseUrl,
          apiUrl: baseUrl+""+Constant.getCategoryData,
        };
        break;
    }

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    if(field == "category"){
      modalRef.componentInstance.inputData = inputData;
    }
    modalRef.componentInstance.accessAction = true;
    modalRef.componentInstance.filteredItems = filteredItems;
    modalRef.componentInstance.filteredLists = filteredItems;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = this.apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      let items = receivedService;
      switch (field) {
        case 'category':
          this.filteredCatIds = [];
          this.filteredCats = [];
          for (let t in items) {
            let chkIndex = this.filteredCatIds.findIndex(
              (option) => option == items[t].id
            );
            if (chkIndex < 0) {
              this.filteredCatIds.push(items[t].id.toString());
              this.filteredCats.push(items[t].name);
            }
          }
          console.log(this.filteredCats, this.filteredCatIds);
          if(this.filteredCats.length>0){
            this.yesbtnEnable = true;
          }
          else{
            this.yesbtnEnable = false;
          }
          break;
      }
    });
  }
  

   // Disable Tag Selection
   disableCatgSelection(index) {
    this.filteredCatIds.splice(index, 1);
    this.filteredCats.splice(index, 1);
  }

  ngOnDestroy(){
    this.bodyElem.classList.remove("auth-open-remove-popup");
    this.bodyElem.classList.remove("convert-popup");
    this.bodyElem.classList.remove("convert-loader-popup");    
  }

}
