import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-workstream-list',
  templateUrl: './workstream-list.component.html',
  styleUrls: ['./workstream-list.component.scss']
})
export class WorkstreamListComponent implements OnInit {

  @ViewChild('select') select: MatSelect;
  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public workstreams;
  @Input() public filteredWorkstreams;
  @Input() public defaultPlaceholder: boolean = false;
  @Output() selectedWorkstreams: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  allSelected:boolean = false;
  wsLoading: boolean = false;
  wsLoadingSelect: boolean = false;

  wsFormControl = new FormControl();
  wsSearchTextboxControl = new FormControl();
  wsSelectedValues:any = [];

  wsData = [];
  workstreamItems = [];
  workstreamIds = [];
  dbSelectedWs = [];
  wsFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;
  public placeholder:string = 'Select';
  public searchPlaceholder: string = "Search";

  constructor(private elementHost: ElementRef) { }

  ngOnInit() {
    this.placeholder = this.defaultPlaceholder ? this.placeholder : `${this.placeholder} Workstream`;
    this.searchPlaceholder = this.defaultPlaceholder ? this.searchPlaceholder : `${this.searchPlaceholder} Workstreams`;
    if(!this.tagClose) {
      for (let item in this.workstreams) {
        let wsId = this.workstreams[item].workstreamId;
        let wsName = this.workstreams[item].workstreamName;
        this.wsData.push(this.workstreams[item].workstreamName);
        for (let wsItem of this.filteredWorkstreams) {
          if(wsId == wsItem) {
            this.dbSelectedWs.push(wsName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.wsLoading = true;
    this.wsFilteredOptions = this.wsSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.wsLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.wsFormControl.patchValue(this.wsSelectedValues);
    this.workstreamItems = this.wsFormControl.value;
    let filteredList = this.wsData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    this.checkItemSelection(filteredList);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.wsFormControl.value && this.wsFormControl.value.length > 0) {
      this.wsFormControl.value.forEach((e) => {
        if (this.wsSelectedValues.indexOf(e) == -1) {
          this.wsSelectedValues.push(e);
          for (let item in this.workstreams) {
            if(e == this.workstreams[item].workstreamName ){
              var wsId = this.workstreams[item].workstreamId;
            }
          }
          this.workstreamIds.push(wsId);
          let data = {
            init: true,
            emit: true,
            items: this.workstreamIds
          }
          this.selectedWorkstreams.emit(data);
          this.workstreamItems = this.wsFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.wsSelectedValues.indexOf(event.source.value);
      this.wsSelectedValues.splice(index, 1);
      this.workstreamIds.splice(index, 1);
      let data = {
        init: false,
        emit: false,
        items: this.workstreamIds
      }
      this.selectedWorkstreams.emit(data);
      this.workstreamItems = this.wsFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.wsSearchTextboxControl.patchValue('');
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
        items: this.workstreamIds
      }
      this.selectedWorkstreams.emit(data);
    }
    this.checkItemSelection('selection');
  }

  /**
   * Checking all selection
   */
  checkItemSelection(action) {
    let itemsLen = (action == 'selection') ? this.wsData.length : action.length;
    let selectedItemsLen = this.dbSelectedWs.length;
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
    this.wsSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Workstreams
   */
  disableSelection(workstreamName) {
    for (let item in this.workstreams) {
      if(workstreamName == this.workstreams[item].workstreamName){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedWs.splice(index, 1);
    //this.wsSelectedValues.splice(index, 1);
    this.workstreamIds.splice(index, 1);
    let data = {
      init: false,
      emit: true,
      items: this.workstreamIds
    }
    this.selectedWorkstreams.emit(data);
    this.workstreamItems = this.wsFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

  toggleAllSelection() {
    if(this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.wsSelectedValues = [];
      this.workstreamItems = [];
      this.workstreamIds = [];
      this.dbSelectedWs = [];
      let data = {
        init: false,
        emit: true,
        items: this.workstreamIds
      }
      this.selectedWorkstreams.emit(data);
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
