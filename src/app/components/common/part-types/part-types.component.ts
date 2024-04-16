import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-part-types',
  templateUrl: './part-types.component.html',
  styleUrls: ['./part-types.component.scss']
})
export class PartTypesComponent implements OnInit {

  @ViewChild('select') select: MatSelect;
  @ViewChild('search') searchTextBox: ElementRef;

  @Input() public partTypes;
  @Input() public filteredPartTypes;
  @Output() selectedPartTypes: EventEmitter<any> = new EventEmitter();

  allSelected:boolean = false;
  partLoading: boolean = false;
  partLoadingSelect: boolean = false;

  partFormControl = new FormControl();
  partSearchTextboxControl = new FormControl();
  partSelectedValues:any = [];

  partData = [];
  partItems = [];
  partItemIds = [];
  dbSelectedType = [];
  typeFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor() { }

  ngOnInit(): void {
  if(!this.tagClose) {
      for (let item in this.partTypes) {
        let typeId = this.partTypes[item].id;
        let typeName = this.partTypes[item].name;
        this.partData.push(this.partTypes[item].name);
        for (let typeItem of this.filteredPartTypes) {
          if(typeId == typeItem) {
            this.dbSelectedType.push(typeName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.partLoading = true;
    this.typeFilteredOptions = this.partSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.partLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.partFormControl.patchValue(this.partSelectedValues);
    this.partItems = this.partFormControl.value;
    let filteredList = this.partData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    this.checkItemSelection(filteredList);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.partFormControl.value && this.partFormControl.value.length > 0) {
      this.partFormControl.value.forEach((e) => {
        if (this.partSelectedValues.indexOf(e) == -1) {
          this.partSelectedValues.push(e);
          for (let item in this.partTypes) {
            if(e == this.partTypes[item].name ){
              var typeId = this.partTypes[item].id;
            }
          }
          this.partItemIds.push(typeId);
          this.selectedPartTypes.emit(this.partItemIds);
          this.partItems = this.partFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.partSelectedValues.indexOf(event.source.value);
      this.partSelectedValues.splice(index, 1);
      this.partItemIds.splice(index, 1);
      this.selectedPartTypes.emit(this.partItemIds);
      this.partItems = this.partFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.partSearchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true;    // close button true
    }
    else{
      this.selectClose = false;   // close button false
    }
    this.checkItemSelection('selection');
  }

  /**
   * Checking all selection
   */
  checkItemSelection(action) {
    let itemsLen = (action == 'selection') ? this.partData.length : action.length;
    let selectedItemsLen = this.dbSelectedType.length;
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
    this.partSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Workstreams
   */
  disableSelection(workstreamName) {
    for (let item in this.partTypes) {
      if(workstreamName == this.partTypes[item].workstreamName){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedType.splice(index, 1);
    //this.partSelectedValues.splice(index, 1);
    this.partItemIds.splice(index, 1);
    this.selectedPartTypes.emit(this.partItemIds);
    this.partItems = this.partFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

  toggleAllSelection() {
    if(this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.partSelectedValues = [];
      this.partItems = [];
      this.partItemIds = [];
      this.dbSelectedType = [];
      this.selectedPartTypes.emit(this.partItemIds);
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
