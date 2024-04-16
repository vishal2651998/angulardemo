import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-usertypes',
  templateUrl: './usertypes.component.html',
  styleUrls: ['./usertypes.component.scss']
})
export class UsertypesComponent implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public userTypes;
  @Output() selectedUserTypes: EventEmitter<any> = new EventEmitter();

  utLoading: boolean = false;
  utLoadingSelect: boolean = false;

  utFormControl = new FormControl();
  utSearchTextboxControl = new FormControl();
  utSelectedValues:any = [];

  utData = [];
  userTypeItems = [];
  userTypeIds = [];
  dbSelectedUt = [];
  utFilteredOptions: Observable<any[]>;
  public selectClose = false;

  constructor(private elementHost: ElementRef) { }

  ngOnInit() {
    for (let item in this.userTypes) {
      this.utData.push(this.userTypes[item].name);
    }

    /**
     * Set filter event based on value changes
     */
    this.utLoading = true;
    this.utFilteredOptions = this.utSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.utLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.utFormControl.patchValue(this.utSelectedValues);
    this.userTypeItems = this.utFormControl.value;
    let filteredList = this.utData.filter(option => option.toLowerCase().indexOf(filterValue)!== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.utFormControl.value && this.utFormControl.value.length > 0) {
      this.utFormControl.value.forEach((e) => {
        if (this.utSelectedValues.indexOf(e) == -1) {
          this.utSelectedValues.push(e);
          for (let item in this.userTypes) {
            if(e == this.userTypes[item].name ){
              var id = this.userTypes[item].id;
            }
          }
          this.userTypeIds.push(id);
          this.selectedUserTypes.emit(this.userTypeIds);
          this.userTypeItems = this.utFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.utSelectedValues.indexOf(event.source.value);
      this.utSelectedValues.splice(index, 1);
      this.userTypeIds.splice(index, 1);
      this.selectedUserTypes.emit(this.userTypeIds);
      this.userTypeItems = this.utFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.utSearchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
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
    this.utSearchTextboxControl.patchValue('');
  }

  /**
   * Disable service categories
   */
  disableSelection(name) {
    for (let item in this.userTypes) {
      if(name == this.userTypes[item].name){
        //return true;
      }
    }
  }

}
