import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScrollTopService } from "../../../services/scroll-top.service";
import { GtsService } from "src/app/services/gts/gts.service";
import { CommonService } from '../../../services/common/common.service';
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-manage-list",
  templateUrl: "./manage-list.component.html",
  styleUrls: ["./manage-list.component.scss"],
})
export class ManageListComponentGTS implements OnInit {
  //@Input() manageList: any;
  @Input() access: any;
  @Input() apiData: any;
  @Input() height: number;
  @Input() filteredTags: any;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass: string = "manage-list";
  public title: string = "";
  public addTxt: string = "New";
  public itemVal: string = "";
  public manageList = [];
  public listItems = [];
  public selectionList = [];
  public actionItems = [];
  public actionFlag: boolean = false;
  public submitActionFlag: boolean = false;
  public listFlag: any = null;
  public itemAction: string = "";
  public successMsg: string = "";
  public success: boolean = false;
  public loading: boolean = true;
  public empty: boolean = false;
  public searchNew: boolean = false;
  public listTotal: number;
  public ws = [];
  public vehicle: string = "";

  public searchVal: string = "";
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = "-1";

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  // convenience getter for easy access to form fields
  get f() {
    return this.searchForm.controls;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private scrollTopService: ScrollTopService,
    private gtsApi: GtsService,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.listTotal = this.manageList.length;
    localStorage.removeItem("searchVal");
    this.selectionList = [];
    console.log(this.filteredTags);
    this.getTagInfo(0);
    setTimeout(() => {
      //this.initList('init', this.manageList);
    }, 500);
  }

  // Initiate Manage List
  initList(action, manageList) {
    this.listItems = [];
    switch (this.access) {
      case "Tag":
        this.title = this.access;
        this.listItems = manageList;

        for (let m in this.listItems) {
          let i: any = m;
          this.listItems[m]["action"] = "";
          this.listItems[m]["displayFlag"] = true;
          this.listItems[m]["checkFlag"] = false;
          this.listItems[m]["itemExists"] = false;
          this.listItems[m]["activeMore"] = false;
          this.listItems[m]["actionFlag"] = false;
          //console.log(this.filteredTags)
          for (let t of this.filteredTags) {
            if (t == this.listItems[m].id) {
              this.listItems[m]["checkFlag"] = true;
              this.selectionList.push({
                id: t,
                name: this.listItems[m].name,
              });
            }
          }
          if (action == "get") {
            for (let st of this.selectionList) {
              if (st.id == this.listItems[m].id) {
                this.listItems[m]["checkFlag"] = true;
              }
            }
          }
        }

        setTimeout(() => {
          if (this.filteredTags.length > 0) {
            this.headerCheck =
              this.selectionList.length == 0 ? "unchecked" : "checked";
            this.headercheckDisplay =
              this.selectionList.length == 0
                ? "checkbox-hide"
                : "checkbox-show";
          }
        }, 500);
        break;
    }
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  // Item Selection
  itemSelection(type, index, id, flag) {
    //console.log(type+' :: '+index+' :: '+id+' :: '+flag)
    switch (type) {
      case "single":
        this.listItems[index].checkFlag = flag;
        if (!flag) {
          let rmIndex = this.selectionList.findIndex(
            (option) => option.id == id
          );
          this.selectionList.splice(rmIndex, 1);
          setTimeout(() => {
            this.headerCheck =
              this.selectionList.length == 0 ? "unchecked" : "checked";
            this.headercheckDisplay =
              this.selectionList.length == 0
                ? "checkbox-hide"
                : this.headercheckDisplay;
          }, 100);
        } else {
          this.selectionList.push({
            id: this.listItems[index].id,
            name: this.listItems[index].name,
          });
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck =
            this.selectionList.length == this.listItems.length
              ? "all"
              : "checked";
          this.headercheckDisplay =
            this.selectionList.length > 0 ? "checkbox-show" : "checkbox-hide";
        }
        break;
      case "all":
        this.selectionList = [];
        this.headercheckDisplay = "checkbox-show";
        if (flag == "checked") {
          if (this.listItems.length > 0) {
            this.headerCheck = "all";
            this.itemChangeSelection(this.headerCheck);
          }
        } else if (flag == "all") {
          this.headerCheck = "unchecked";
          this.headercheckDisplay = "checkbox-hide";
          this.itemChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = "all";
          this.itemChangeSelection(this.headerCheck);
        }
        break;
    }
  }

  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    //console.log(action)
    for (let m of this.listItems) {
      if (action != "empty" && action != "unchecked") {
        this.selectionList.push({
          id: m.id,
          name: m.name,
        });
      }
      m.checkFlag = action == "all" ? true : false;
    }
  }

  // Manage List
  manageListItem(action, index) {
    switch (this.access) {
      case "Tag":
        this.manageTag(action, index);
        break;
    }
  }

  // Add, Edit, Cancel Tag
  manageTag(action, index) {
    //console.log(action)
    switch (action) {
      case "new":
        if (this.empty) {
          this.searchNew = true;
          this.clearSearch();
          //this.getTagInfo(index);
          setTimeout(() => {
            this.empty = false;
            this.submitActionFlag = true;
          }, 750);
        }

        if (!this.actionFlag && !this.empty) {
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem("searchVal");
          this.submitActionFlag = sval == null ? false : true;
          this.itemVal = sval;
          let newTag = {
            id: 0,
            name: sval,
            editAccess: 0,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false,
          };
          this.listItems.unshift(newTag);
          let el = document.getElementById("manageTable");
          el.scrollTo(0, 0);
          if (action == "new" && sval != null) {
            this.checkTagExists(index, sval);
          }
        }
        break;
      case "edit":
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == "new") {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = index != m ? "" : "edit";
          //this.listItems[m].checkFlag = false;
        }

        break;
      case "cancel":
        localStorage.removeItem("searchVal");
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck);
        console.log(this.selectionList);
        if (this.listItems[index].action == "new") {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case "submit":
        console.log(this.listItems[index]);
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            apiKey: this.apiData["apiKey"],
            userId: this.apiData["userId"],
            domainId: this.apiData["domainId"],
            countryId: this.apiData["countryId"], 
            tagName: this.itemVal,
            id: id,
          };

          this.manageAction(index, apiData);
        }
        break;
    }
  }

  // Manage Action
  manageAction(index, apiData) {
    //console.log(index);
    switch (this.access) {
      case "Tag":
        let tagData = new FormData();
        let isValidate: any = 0;
        let name = this.itemVal;
        tagData.append("apiKey", apiData.apiKey);
        tagData.append("userId", apiData.userId);
        tagData.append("domainId", apiData.domainId);
        tagData.append("countryId", apiData.countryId);
        tagData.append("tagName", apiData.tagName);
        tagData.append("workstreamList", JSON.stringify(this.ws));
        tagData.append("vehicleInfo", this.vehicle);
        tagData.append("isValidate", isValidate);
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          tagData.append("tagId", apiData.id);
        }

        this.gtsApi.manageTag(tagData).subscribe((response) => {
          this.searchVal = "";
          this.success = true;
          this.successMsg = response.result;
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id = response.dataId;
          let actionFlag = response.status == "Success" ? true : false;
          let checkIndex = this.selectionList.findIndex(
            (option) => option.id == id
          );
          console.log(checkIndex + " :: " + this.itemVal);
          if (checkIndex < 0) {
            this.filteredTags.push(id);
            this.actionItems.push(id);
          }
          this.getTagInfo(index);
        });
        break;

      default:
        break;
    }
  }

  // Clear Selection
  clearSelection() {
    this.headerCheck = "unchecked";
    this.headercheckDisplay = "checkbox-hide";
    this.selectionList = [];
    this.itemChangeSelection(this.headerCheck);
  }

  // Get Tag Info
  getTagInfo(index) {
    this.loading = true;
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData.apiKey);
    apiFormData.append("domainId", this.apiData.domainId);
    apiFormData.append("countryId", this.apiData.countryId);
    apiFormData.append("userId", this.apiData.userId);
    //apiFormData.append('searchKey', this.searchVal);

    this.gtsApi.getGtsBaseInfo(apiFormData).subscribe((response) => {
      let resultData = response.attributesInfo;
      this.manageList = [];
      this.manageList = resultData.tagsSelection;

      let initText = index == 0 ? "init" : "get";
      this.initList(initText, this.manageList);
      //console.log(this.selectionList);
      if (index < 0) {
        let itemListLen = this.manageList.length;
        this.empty = itemListLen < 1 ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        }
      }

      if (this.searchNew) {
        this.manageTag("new", 0);
      }
    });
  }

  // On Change
  onChange(index, value) {
    if (value.length > 0) {
      this.checkTagExists(index, value);
    } else {
      if (this.listFlag) {
        this.listFlag.unsubscribe();
      }
      this.itemVal = "";
      this.listItems[index].itemExists = false;
      this.submitActionFlag = false;
    }
  }

  // Check Tag Exists
  checkTagExists(index, value) {
    let apiData = {
      apiKey: this.apiData["apiKey"],
      userId: this.apiData["userId"],
      domainId: this.apiData["domainId"],
      countryId: this.apiData["countryId"],
      name: value,
    };

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Exists
  manageExist(index, apiData) {
    let tagData = new FormData();
    let isValidate: any = 1;
    tagData.append("apiKey", apiData.apiKey);
    tagData.append("userId", apiData.userId);
    tagData.append("domainId", apiData.domainId);
    tagData.append("countryId", apiData.countryId);
    tagData.append("tagName", apiData.name);
    tagData.append("workstreamList", JSON.stringify(this.ws));
    tagData.append("vehicleInfo", this.vehicle);
    tagData.append("isValidate", isValidate);

    this.listFlag = this.gtsApi.manageTag(tagData).subscribe((response) => {
      this.listItems[index].itemExists =
        response.status == "Success" ? false : true;
      if (!this.listItems[index].itemExists) {
        this.itemVal = apiData.name;
        this.submitActionFlag = this.itemVal != "" ? true : false;
      } else {
        this.submitActionFlag = false;
      }
    });
  }

  // Apply Tag Selection
  applySelection() {
    console.log(this.selectionList);
    if (this.headerCheck == "checked" || this.headerCheck == "all") {
      this.selectedItems.emit(this.selectionList);
    }
  }

  close() {
    this.searchVal = "";
    this.bodyElem.classList.remove(this.bodyClass);

    if (this.selectionList.length == 0) {
      this.selectedItems.emit(this.selectionList);
    } else {
      this.filteredTags = [];
      for (let a of this.actionItems) {
        let i = this.selectionList.findIndex((option) => option.id == a);
      }
      setTimeout(() => {
        this.activeModal.dismiss("Cross click");
      }, 500);
    }
  }

  // On Submit
  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.searchKey;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = searchValue.length > 0 ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if (searchValue.length == 0) {
      this.submitted = false;
      if (this.listTotal != this.manageList.length) {
        this.clearSearch();
      }
    }

    localStorage.setItem("searchVal", this.searchVal);
    let filteredList = this.manageList.filter(
      (option) =>
        option.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1
    );
    if (filteredList.length > 0) {
      this.empty = false;
      for (let t in this.listItems) {
        this.listItems[t].displayFlag = false;
        for (let f in filteredList) {
          if (this.listItems[t].name == filteredList[f].name) {
            this.listItems[t].displayFlag = true;
          }
        }
      }
    } else {
      this.empty = true;
      this.successMsg = "No Result Found";
    }
  }

  // Submit Search
  submitSearch() {
    this.getTagInfo(-1);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = "";
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.actionFlag = false;
    //localStorage.removeItem('searchVal');
    if (this.listTotal != this.manageList.length) {
      this.getTagInfo(-1);
    } else {
      this.getTagInfo(0);
    }
  }

  // Disable Field
  disableSelection() {
    return this.actionFlag;
  }

    // remove option
    removeConfirm(index,id){
      this.bodyElem.classList.add("auth-open-remove-popup");
      const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
      modalRef.componentInstance.access = 'ppfrconfirmation';
      modalRef.componentInstance.title = '';
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
        modalRef.dismiss('Cross click'); 
        console.log(receivedService);
        if(receivedService){
          this.deleteOption(index,id);
        }
      }); 
    }
  
    deleteOption(index,id){
      let formData = new FormData();
      formData.append("apiKey", this.apiData["apiKey"]);
      formData.append("domainId", this.apiData["domainId"]);
      formData.append("countryId", this.apiData["countryId"]);
      formData.append("userId", this.apiData["userId"]);
      formData.append("tagId", id);
  
      this.commonApi.apiDeleteTag(formData).subscribe((response) => {
        if(response.status=='Success'){         
          this.listItems.splice(index, 1);    
        }
        else{
          // error
        }  
      });
      
    }
    
}
