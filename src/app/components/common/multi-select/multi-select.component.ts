import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

  @ViewChild('select') select: MatSelect;
  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public fieldName = "";
  @Input() public listItems;
  @Input() public filteredItems;
  @Input() public disabled: boolean = false;
  @Output() selectedLists: EventEmitter<any> = new EventEmitter();

  public selectText: string = "Select";
  public searchText: string = "Seacrch";

  allSelected:boolean = false;
  loading: boolean = false;
  loadingSelect: boolean = false;

  formControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues:any = [];

  data = [];
  selectedItems = [];
  ids = [];
  dbSelected = [];
  filteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(!this.tagClose) {
      for (let item in this.listItems) {
        let id = this.listItems[item].id;
        let name = this.listItems[item].name;
        this.data.push(this.listItems[item].name);
        for (let filterItem of this.filteredItems) {
          if(id == filterItem) {
            this.dbSelected.push(name);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.loading = true;
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.loadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
   private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.formControl.patchValue(this.selectedValues);
    this.selectedItems = this.formControl.value;
    let filteredList = this.data.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    this.checkItemSelection(filteredList);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.formControl.value && this.formControl.value.length > 0) {
      this.formControl.value.forEach((e) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
          for (let item in this.listItems) {
            if(e == this.listItems[item].name ){
              var id = this.listItems[item].id;
            }
          }
          this.ids.push(id);
          let data = {
            init: true,
            emit: true,
            fieldName: this.fieldName,
            items: this.ids,
            selectedItems: this.selectedItems
          }
          this.selectedLists.emit(data);
          this.selectedItems = this.formControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
      this.ids.splice(index, 1);
      let data = {
        init: false,
        emit: false,
        fieldName: this.fieldName,
        items: this.ids,
        selectedItems: this.selectedItems
      }
      this.selectedLists.emit(data);
      this.selectedItems = this.formControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true;    // close button true
    }
    else{
      this.selectClose = false;   // close button false
      let data = {
        init: false,
        emit: true,
        fieldName: this.fieldName,
        items: this.ids,
        selectedItems: this.selectedItems
      }
      this.selectedLists.emit(data);
    }
    this.checkItemSelection('selection');
  }

  /**
   * Checking all selection
   */
  checkItemSelection(action) {
    let itemsLen = (action == 'selection') ? this.data.length : action.length;
    let selectedItemsLen = this.dbSelected.length;
    if(selectedItemsLen == 0) {
      this.allSelected = false;
    } else {
      this.allSelected = (itemsLen == selectedItemsLen) ? true : false;
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    this.allSelected = false;
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   * Disable Workstreams
   */
  disableSelection(name) {
    for (let item in this.listItems) {
      if(name == this.listItems[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelected.splice(index, 1);
    //this.selectedValues.splice(index, 1);
    this.ids.splice(index, 1);
    let data = {
      init: false,
      emit: true,
      fieldName: this.fieldName,
      items: this.ids,
      selectedItems: this.selectedItems
    }
    this.selectedLists.emit(data);
    this.selectedItems = this.formControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

  toggleAllSelection() {
    if(this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.selectedValues = [];
      this.selectedItems = [];
      this.ids = [];
      this.dbSelected = [];
      let data = {
        init: false,
        emit: true,
        fieldName: this.fieldName,
        items: this.ids,
        selectedItems: this.selectedItems
      }
      this.selectedLists.emit(data);
    }
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

}
