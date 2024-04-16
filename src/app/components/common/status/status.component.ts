import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @ViewChild('search', {static: false}) searchTextBox: ElementRef;
  @Input() public multiple: boolean = true;
  @Input() public splitIcon;
  @Input () public statusPlaceHolder;
  @Input() public status;
  @Input() public filteredStatus;
  @Input() public defaultPlaceholder: boolean = false;
  @Output() selectedStatus: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  statusLoading: boolean = false;
  statusLoadingSelect: boolean = false;

  statusFormControl = new FormControl();
  statusSearchTextboxControl = new FormControl();
  statusSelectedValues:any = [];

  statusData = [];
  statusItems = [];
  statusIds = [];
  dbSelectedStatus = [];
  statusFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;
  public placeholder:string = 'Select';
  public searchPlaceholder: string = "Search";

  constructor() { }

  ngOnInit(): void {
    this.placeholder = `${this.placeholder} ${this.statusPlaceHolder}`;
    //this.placeholder = this.defaultPlaceholder ? this.placeholder : `${this.placeholder} Workstream`;
    this.searchPlaceholder = this.defaultPlaceholder ? this.searchPlaceholder : `${this.searchPlaceholder} ${this.statusPlaceHolder}`;
    if(!this.tagClose) {
      for (let item in this.status) {
        let statusId = this.status[item].id;
        let statusName = this.status[item].name;
        this.statusData.push(this.status[item].name);
        for (let statusItem of this.filteredStatus) {
          if(statusId == statusItem) {
            this.dbSelectedStatus.push(statusName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.statusLoading = true;
    this.statusFilteredOptions = this.statusSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.statusLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.statusFormControl.patchValue(this.statusSelectedValues);
    this.statusItems = this.statusFormControl.value;
    let filteredList = this.statusData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.statusFormControl.value && this.statusFormControl.value.length > 0) {
      this.statusFormControl.value.forEach((e) => {
        if (this.statusSelectedValues.indexOf(e) == -1) {
          this.statusSelectedValues.push(e);
          for (let item in this.status) {
            if(e == this.status[item].name ){
              var statusId = this.status[item].id;
            }
          }
          this.statusIds.push(statusId);
          let data = {
            init: true,
            emit: true,
            items: this.statusIds
          }
          this.selectedStatus.emit(data);
          this.statusItems = this.statusFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.statusSelectedValues.indexOf(event.source.value);
      this.statusSelectedValues.splice(index, 1);
      this.statusIds.splice(index, 1);
      let data = {
        init: false,
        emit: false,
        items: this.statusIds
      }
      this.selectedStatus.emit(data);
      this.statusItems = this.statusFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.statusSearchTextboxControl.patchValue('');
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
        items: this.statusIds
      }
      this.selectedStatus.emit(data);
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.statusSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Status
   */
  disableSelection(name) {
    for (let item in this.status) {
      if(name == this.status[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedStatus.splice(index, 1);
    this.statusIds.splice(index, 1);
    let data = {
      init: false,
      emit: true,
      items: this.statusIds
    }
    this.selectedStatus.emit(data);
    this.statusItems = this.statusFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
