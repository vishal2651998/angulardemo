import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common/common.service';
import { FilterService } from '../../../services/filter/filter.service';

@Component({
  selector: 'app-manage-geo-list',
  templateUrl: './manage-geo-list.component.html',
  styleUrls: ['./manage-geo-list.component.scss']
})
export class ManageGeoListComponent implements OnInit {

  @Input() access: any;
  @Input() accessAction: boolean;
  @Input() apiData: any;
  @Input() height: number;
  @Input() filteredItems: any;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  public bodyElem;
  public bodyClass:string = "manage-list";
  public title: string = "";
  public manageList = [];
  public listItems = [];
  public selectionList = [];
  public listLength: number = 0;

  public loading: boolean = true;
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public empty: boolean = false;
  public actionFlag: boolean = false;
  public clearFlag: boolean = false;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';
  public successMsg: string = "";

  public offset: number = 0;
  public DisableText: string = 'Disable';
  public limit: number = 30;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  constructor(
    public activeModal: NgbActiveModal,
    private filterApi: FilterService,
    private formBuilder: FormBuilder,
    private commonApi: CommonService
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    localStorage.removeItem('searchVal');
    this.selectionList = [];
    this.height = this.height-120;
    console.log(this.access, this.filteredItems)
    switch(this.access) {
      case 'Escalations':
        this.title = this.apiData.filterName;
        this.getFilterData();
        break;
    }
  }

  // Get Filter Data
  getFilterData() {
    this.filterApi.getFilterWidgets(this.apiData).subscribe((response) => {
      console.log(response)
      this.loading = false;
      this.manageList = response.data[0].valueArray;
      this.listLength = this.manageList.length;
      if(this.listLength > 0) {
        this.empty = false;
        this.initList('get', this.manageList);
      } else {
        this.empty = true;
        this.successMsg = "No Result Found";
      }
    });
  }

  // Initiate Manage List
  initList(action, manageList) {
    this.listItems = [];
    this.listItems = manageList;
    
    for(let m in this.listItems) {
      this.listItems[m]['action'] = "";
      this.listItems[m]['displayFlag'] = true;
      this.listItems[m]['checkFlag'] = false;
      this.listItems[m]['itemExists'] = false;
      this.listItems[m]['activeMore'] = false;
      this.listItems[m]['actionFlag'] = false;
      
      for(let t of this.filteredItems) {
        if(t == this.listItems[m].id) {
          this.listItems[m]['checkFlag'] = true;
          this.selectionList.push({
            id: t,
            name: this.listItems[m].name
          });
        }
      }
      
      if(action == 'get') {
        for(let st of this.selectionList) {
          if(st.id == this.listItems[m].id) {
            this.listItems[m]['checkFlag'] = true;                
          }
        }  
      }
    }

    setTimeout(() => {
      if(this.filteredItems.length > 0) {
        this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
        this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
      } 
    }, 500);
  }

  // Item Selection
  itemSelection(type, index, id, flag) {
    this.clearFlag = false;
    switch(type) {
      case 'single':
        this.listItems[index].checkFlag = flag;
        if(!flag) {
          let rmIndex = this.selectionList.findIndex(option => option.id == id);
          this.selectionList.splice(rmIndex, 1);
          setTimeout(() => {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : this.headercheckDisplay;
          }, 100);         
        } else {
          console.log(this.listItems[index])
          let name = this.listItems[index].name;
          this.selectionList.push({
            id: this.listItems[index].id,
            name: name
          });
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck = (this.selectionList.length == this.listItems.length) ? 'all' : 'checked';
          this.headercheckDisplay = (this.selectionList.length > 0) ? 'checkbox-show' : 'checkbox-hide';
        }
        this.clearFlag = (this.selectionList.length == 0) ? true : false;
        break;
      case 'all':
        this.selectionList = [];
        this.headercheckDisplay = 'checkbox-show';
        if(flag == 'checked') {
          if(this.listItems.length > 0) {
            this.headerCheck = 'all';            
            this.itemChangeSelection(this.headerCheck);
          }
        } else if(flag == 'all') {
          this.headerCheck = 'unchecked';
          this.headercheckDisplay = 'checkbox-hide';
          this.clearFlag = true;
          this.itemChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = 'all';
          this.itemChangeSelection(this.headerCheck);
        }
        break;  
    }
  }

  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    for(let m of this.listItems) {
      if(action != 'empty' && action != 'unchecked') {
        this.selectionList.push({
          id: m.id,
          name: m.name
        });
      }      
      m.checkFlag = (action == 'all') ? true : false;
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
  onSearchChange(searchValue : string ) {  
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if(searchValue.length == 0) {
      this.submitted = false;
    }
    
    let filteredList = this.manageList.filter(option => option.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
    if(filteredList.length > 0) {
      this.empty = false;
      for(let t in this.listItems) {
        this.listItems[t].displayFlag = false;
        for(let f in filteredList) {
          if(this.listItems[t].name == filteredList[f].name) {
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
        
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.submitted = this.searchTick;
    this.empty = this.searchTick;
    for(let m in this.listItems) {
      this.listItems[m].displayFlag = true;
    }
  }

  // Apply Tag Selection
  applySelection() {
    if(this.headerCheck == 'checked' || this.headerCheck == 'all' || this.clearFlag) {
      let checkArr = ['id', 'name'];
      let unique = this.commonApi.unique(this.selectionList, checkArr);
      this.selectionList = unique;
      console.log(this.selectionList)
      this.selectedItems.emit(this.selectionList);
    }
  }
  
  // Clear Selection
  clearSelection() {
    this.clearFlag = true;
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.selectionList = [];
    this.itemChangeSelection(this.headerCheck);
  }

  // Close
  close() {
    this.searchVal = '';
    this.bodyElem.classList.remove(this.bodyClass);
    this.activeModal.dismiss('Cross click');  

    /*if(this.filteredItems.length > 0 && this.selectionList.length == 0) {
      this.selectedItems.emit(this.selectionList);      
    } else {
      this.filteredItems = [];
      this.activeModal.dismiss('Cross click');  
    }*/
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.close();
  }
}
