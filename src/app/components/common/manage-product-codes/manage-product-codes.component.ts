import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-manage-product-codes',
  templateUrl: './manage-product-codes.component.html',
  styleUrls: ['./manage-product-codes.component.scss']
})
export class ManageProductCodesComponent implements OnInit {

  @Input() apiData: any;
  @Input() inputData: any = [];
  @Input() height: number;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();
  
  public bodyElem;
  public bodyClass:string = "manage-list";
  public title: string = "";
  public itemVal: string = "";
  public manageList = [];
  public listItems = [];
  public prodCodeSelectedList: any = [];
  public filteredItems: any = [];
  public removedItems: any = [];
  public selectionList = [];

  public clearFlag: boolean = false;
  public actionFlag: boolean = false;
  public activeListshow: boolean = true;
  public submitActionFlag: boolean = false;
  public listFlag: any = null;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public empty: boolean = false;
  public successMsg: string = "";
  public listTotal: number;
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchInputFlag: boolean = false;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;

  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';

  public offset: number = 0;
  public limit: number = 20;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;
  public closeFlag: boolean = false;
  public selection: string = "multiple";

  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-(this.offset*8);
    this.scrollTop = event.target.scrollTop-80;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if(inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.lazyLoading = true;
        this.scrollCallback = false;
        let i = -2;
        this.getData(i);
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  constructor(
    public activeModal: NgbActiveModal,
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
    localStorage.removeItem('newItem');
    localStorage.removeItem('searchVal');
    this.selectionList = [];
    this.removedItems = [];
    this.height = this.height-120;
    let index = 0;
    setTimeout(() => {
      this.searchInputFlag = true;
    }, 100);

    this.title = this.inputData.title;
    this.filteredItems = this.inputData.filteredItems;
    this.prodCodeSelectedList = this.inputData.prodCodeSelectedList;
    this.getData(index);
  }

  // Get Data
  getData(index) {
    console.log(index, this.inputData)
    this.loading = true;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;

    let apiData = this.apiData;
    let apiUrl = this.inputData.apiUrl;
    let field = this.inputData.field;
    let body: HttpParams = new HttpParams();
    apiData['offset'] = this.offset;
    apiData['limit'] = this.limit;
    apiData['searchKey'] = this.searchVal,

    Object.keys(apiData).forEach(key => {
      let value = apiData[key];
      body = body.append(key, value);
    });

    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      console.log(response);
      let resultData;
      let item:any = [];
      this.manageList = (index >= -1) ? [] : this.manageList;
      let initText = (index == 0) ? 'init' : 'get';
      resultData = response.items;
      let total = response.total;
      item = [];
      if(total > 0) {
        for(let list of resultData) {
          let name = list.name.replace('###', '-')
          item.push({
            id: list.id,
            name: name,
            prodType: list.productType,
            model: list.modelName
          });
        }
        console.log(item)
        for(let res in item) {
          this.manageList.push(item[res]);
        }
      } else {
        this.manageList = item;
      }

      if(index <= 0) {
        let itemListLen = this.manageList.length;
        this.itemLength = itemListLen;
        this.empty = (itemListLen < 1) ? true : false;
        if(this.empty) {
          this.successMsg = response.result;
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.itemTotal = response.total;
          this.itemLength += resultData.length;
          this.offset += this.limit;
        }
      }

      setTimeout(() => {
        this.initList(initText, this.manageList);
      }, 100);
    });
  }

  // Initiate Manage List
  initList(action, manageList) {
    console.log(manageList, this.prodCodeSelectedList)
    let start = 0;
    let end = 0;
    this.listItems = [];
    this.listItems = manageList;  
    this.searchForm.value.searchKey = this.searchForm.value.searchKey;
    this.searchVal = this.searchForm.value.searchKey;
    let checkDisplayFlag = (action == 'get') ? true : false; 
    switch (action) {
      case 'get':
        start = this.offset-this.limit
        end = this.offset-1;
        break;
    
      default:
        end = manageList.length - 1;        
        break;
    }

    console.log(this.listItems)  
    for(let m in this.listItems) {
      if(start <= parseInt(m) && end >= parseInt(m)) {
        let i: any = m;
        this.listItems[m]['action'] = "";
        this.listItems[m]['displayFlag'] = true;
        this.listItems[m]['checkFlag'] = false;
        this.listItems[m]['itemExists'] = false;
        this.listItems[m]['activeMore'] = false;
        this.listItems[m]['actionFlag'] = false;
        for(let t of this.prodCodeSelectedList) {
          if(t.id == this.listItems[m].id && t.name == this.listItems[m].name) {
            this.listItems[m]['checkFlag'] = true;
            let chkItem = this.selectionList.findIndex(option => option.id == t.id);
            if(chkItem < 0) {
              this.selectionList.push({
                id: t.id,
                name: this.listItems[m].name,
                prodType: this.listItems[m].prodType,
                model: this.listItems[m].model
              });
            }            
            console.log('in', t)
            //this.setupFilteredItems(t);
          }
        }
        if(action == 'get' || action == 'init') {
          for(let st of this.selectionList) {
            if(st.id == this.listItems[m].id && st.name == this.listItems[m].name) {
              this.listItems[m]['checkFlag'] = true;                
            }
          }  
        }
      }
    }

    console.log(this.listItems)
      
    setTimeout(() => {
      if(this.selection == 'multiple') {
        this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
        this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
      }  
    }, 500);

    setTimeout(() => {
      this.loading = false;
      this.lazyLoading = this.loading;
    }, 500);
  }
  
  // Item Selection
  itemSelection(type, index, id, flag) {
    this.clearFlag = false;
    console.log(type+' :: '+index+' :: '+id+' :: '+flag+' :: '+this.selection)
    let field = this.inputData.field;
    switch(type) {
      case 'single':
        this.listItems[index].checkFlag = flag;
        if(!flag) {
          let model = this.listItems[index].model;
          let rmId = this.listItems[index].id;
          let rmIndex = this.selectionList.findIndex(roption => roption.id == rmId);
          this.selectionList.splice(rmIndex, 1);
          let chkIndex = this.prodCodeSelectedList.findIndex(option => option.model == model);
          if(chkIndex >= 0) {
            this.removedItems.push(this.prodCodeSelectedList[chkIndex]);  
          }

          setTimeout(() => {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : this.headercheckDisplay;
          }, 100);         
        } else {
          console.log(this.listItems[index])
          let name = this.listItems[index].name;
          let item = this.listItems[index];
          this.selectionList.push({
            id: this.listItems[index].id,
            name: this.listItems[index].name,
            prodType: item.prodType,
            model: item.model
          });
          this.headercheckDisplay = "checkbox-show";
          this.headerCheck = (this.selectionList.length == this.listItems.length) ? 'all' : 'checked';
          this.headercheckDisplay = (this.selectionList.length > 0) ? 'checkbox-show' : 'checkbox-hide';            
        }
               
        this.clearFlag = (this.selectionList.length == 0) ? true : false;
        break;
      case 'all':
        this.selectionList = [];
        this.removedItems = [];
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
    console.log(this.selectionList)
  }
  
  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    console.log(action)
    for(let m of this.listItems) {
      if(action != 'empty' && action != 'unchecked') {
        this.selectionList.push({
          id: m.id,
          name: m.name,
          prodType: m.prodType,
          model: m.model
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
    this.removedItems = [];
    this.clearFlag = true;
    this.itemChangeSelection(this.headerCheck);
  }

  // Apply Tag Selection
  applySelection(actionType) {
    let codeData;
    if(this.clearFlag) {
      this.selectionList = [];
      this.removedItems = [];
      codeData = {
        selectedItems: this.selectionList,
        removedItems: this.removedItems
      };
      this.selectedItems.emit(codeData);
      this.activeModal.dismiss('Cross click');  
    } else if((this.headerCheck == 'checked' || this.headerCheck == 'all' || this.prodCodeSelectedList.length > 0)) {
      console.log(this.prodCodeSelectedList, this.removedItems)
      if(this.headerCheck != 'unchecked') {
        let checkArr = ['id', 'name'];
        let unique = this.commonApi.unique(this.selectionList, checkArr);
        for(let t in this.prodCodeSelectedList) {
          if(this.prodCodeSelectedList[t].length > 0) {
            this.selectionList.push({
              id: this.prodCodeSelectedList[t].id,
              name: this.prodCodeSelectedList[t].name,
            });
          }              
        }
        this.selectionList = unique;
        checkArr = ['id', 'name'];
        unique = this.commonApi.unique(this.selectionList, checkArr);
        this.selectionList = unique;

        this.title = "";
        codeData = {
          selectedItems: this.selectionList,
          removedItems: this.removedItems
        };
        this.selectedItems.emit(codeData);
        this.activeModal.dismiss('Cross click');  
      } else {
        if(this.closeFlag) {
          this.activeModal.dismiss('Cross click');
          setTimeout(() => {
            this.closeFlag = false;
          }, 20);
        }
      }       
    } else {
      if(actionType == 'trigger') {
        this.activeModal.dismiss('Cross click');
      }        
    }
  }

  close() {
    this.title = "";
    this.activeModal.dismiss('Cross click');
  }
  
  // On Submit
  onSubmit() {
    console.log(this.searchForm.value)
    this.searchVal = this.searchForm.value.searchKey;
    if(this.searchVal != '') {
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
      if(this.listTotal != this.manageList.length || (this.listTotal == 0 && this.manageList.length == 0)) {
        this.clearSearch();
      }      
    }
  }

  // Submit Search
  submitSearch() {
    let i = 0;
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    this.empty = false;
    this.getData(i);    
  }

  // Clear Search
  clearSearch(action = '') {
    let i = 0;
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    let newFlag = (action == 'new' && this.empty) ? true : false;
    this.empty = false;
    console.log(action, newFlag)
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.actionFlag = false;
    //localStorage.removeItem('searchVal');
    
    let accessIndex = (this.listTotal != this.manageList.length) ? -1 : 0;
    accessIndex = (action == 'new' && newFlag) ? -3 : accessIndex;
    this.getData(accessIndex);
  }
  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }

}