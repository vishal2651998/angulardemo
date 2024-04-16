import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-error-code-lists',
  templateUrl: './error-code-lists.component.html',
  styleUrls: ['./error-code-lists.component.scss']
})
export class ErrorCodeListsComponent implements OnInit {

  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public errorCodes;
  @Input() public filteredErrorCodes;
  @Output() selectedErrorCodes: EventEmitter<any> = new EventEmitter();

  errLoading: boolean = false;
  errLoadingSelect: boolean = false;

  errFormControl = new FormControl();
  errSearchTextboxControl = new FormControl();
  errSelectedValues:any = [];

  errData = [];
  errItems = [];
  errIds = [];
  dbSelectedErr = [];
  errFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(!this.tagClose) {
      for (let item in this.errorCodes) {
        let errId = this.errorCodes[item].id;
        let errName = this.errorCodes[item].name;
        this.errData.push(this.errorCodes[item].name);
        for (let errItem of this.filteredErrorCodes) {
          if(errId == errItem) {
            this.dbSelectedErr.push(errName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.errLoading = true;
    this.errFilteredOptions = this.errSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.errLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.errFormControl.patchValue(this.errSelectedValues);
    this.errItems = this.errFormControl.value;
    let filteredList = this.errData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.errFormControl.value && this.errFormControl.value.length > 0) {
      this.errFormControl.value.forEach((e) => {
        if (this.errSelectedValues.indexOf(e) == -1) {
          this.errSelectedValues.push(e);
          for (let item in this.errorCodes) {
            if(e == this.errorCodes[item].name ){
              var yrId = this.errorCodes[item].id;
            }
          }
          this.errIds.push(yrId);
          this.selectedErrorCodes.emit(this.errIds);
          this.errItems = this.errFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.errSelectedValues.indexOf(event.source.value);
      this.errSelectedValues.splice(index, 1);
      this.errIds.splice(index, 1);
      this.selectedErrorCodes.emit(this.errIds);
      this.errItems = this.errFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.errSearchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true;    // close button true
    }
    else{
      this.selectClose = false;   // close button false
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.errSearchTextboxControl.patchValue('');
  }

  /**
   * Disable errorCodes
   */
  disableSelection(name) {
    for (let item in this.errorCodes) {
      if(name == this.errorCodes[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedErr.splice(index, 1);
    this.errIds.splice(index, 1);
    this.selectedErrorCodes.emit(this.errIds);
    this.errItems = this.errFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
