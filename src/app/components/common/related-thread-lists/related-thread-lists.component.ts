import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-related-thread-lists',
  templateUrl: './related-thread-lists.component.html',
  styleUrls: ['./related-thread-lists.component.scss']
})
export class RelatedThreadListsComponent implements OnInit {

  @Input() access: any;
  @Input() apiData: any;
  @Input() height: number;
  @Input() filteredThreads: any;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass:string = "manage-list";
  public title: string = "Related Threads";
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
  public vehicle: string = "";

  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted:boolean = false;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';

  public offset: number = 0;
  public limit: number = 10;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  constructor(
    public activeModal: NgbActiveModal,
    private scrollTopService: ScrollTopService,
    private commonApi: CommonService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.listTotal = this.manageList.length;
    localStorage.removeItem('searchVal');
    this.selectionList = [];

    this.getThreadInfo(0);
  }

  // Get Thread Info
  getThreadInfo(index) {
    this.loading = true;
    let apiData = {
      apiKey: this.apiData.apiKey,
      domainId: this.apiData.domainId,
      countryId: this.apiData.countryId,
      userId: this.apiData.userId,
      searchKey: this.searchVal,
      vehicleInfo: this.apiData.vehicleInfo,
      offset: this.offset,
      limit: this.limit
    }

    this.commonApi.getRelatedThreads(apiData).subscribe((response) => {
      console.log(response)
      let resultData = response.relatedThreads;
      this.manageList = [];

      for(let res of resultData) {
        this.manageList.push({
          id: res.threadId,
          name: res.title,
          title: `${res.threadId} ${res.title}`
        });
      }

      let initText = (index == 0) ? 'init' : 'get';
      this.initList(initText, this.manageList);
      //console.log(this.selectionList);
      if(index < 0) {
        let itemListLen = this.manageList.length;
        this.empty = (itemListLen < 1) ? true : false;
        if(this.empty) {
          this.successMsg = response.result;
        }
      }
      
    });
  }

  // Initiate Manage List
  initList(action, manageList) {
    this.listItems = [];
    switch(this.access) {
      case 'Threads':
        this.title = this.access;
        this.listItems = manageList;
        
        for(let m in this.listItems) {
          let i: any = m;
          this.listItems[m]['action'] = "";
          this.listItems[m]['displayFlag'] = true;
          this.listItems[m]['checkFlag'] = false;
          this.listItems[m]['itemExists'] = false;
          this.listItems[m]['activeMore'] = false;
          this.listItems[m]['actionFlag'] = false;
          //console.log(this.filteredThreads)
          for(let t of this.filteredThreads) {
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
          if(this.filteredThreads.length > 0) {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
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
          this.selectionList.push({
            id: this.listItems[index].id,
            name: this.listItems[index].name
          });
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck = (this.selectionList.length == this.listItems.length) ? 'all' : 'checked';
          this.headercheckDisplay = (this.selectionList.length > 0) ? 'checkbox-show' : 'checkbox-hide';
        }
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

  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.selectionList = [];
    this.itemChangeSelection(this.headerCheck);
  }

  // Apply Tag Selection
  applySelection() {
    console.log(this.selectionList);
    if(this.headerCheck == 'checked' || this.headerCheck == 'all') {
      this.selectedItems.emit(this.selectionList);  
    }    
  }

  close() {
    this.searchVal = '';
    this.bodyElem.classList.remove(this.bodyClass);
    
    if(this.selectionList.length == 0) {
      this.selectedItems.emit(this.selectionList);      
    } else {
      this.filteredThreads = [];
      for(let a of this.actionItems) {
        let i = this.selectionList.findIndex(option => option.id == a);
      }
      setTimeout(() => {
        this.activeModal.dismiss('Cross click');  
      }, 500);      
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
      if(this.listTotal != this.manageList.length) {
        this.clearSearch();
      }      
    }

    let filteredList = this.manageList.filter(option => option.title.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
    if(filteredList.length > 0) {
      localStorage.removeItem('searchVal');
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
      localStorage.setItem('searchVal', this.searchVal);
      this.empty = true;
      this.successMsg = "No Result Found";
    }
  }

  // Submit Search
  submitSearch() {
    this.getThreadInfo(-1);
  }

  // Clear Search
  clearSearch() {
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.actionFlag = false;
    //localStorage.removeItem('searchVal');
    if(this.listTotal != this.manageList.length) {
      this.getThreadInfo(-1);
    } else {
      this.getThreadInfo(0);
    }    
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.close();
  }

}
