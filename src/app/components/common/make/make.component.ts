import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.scss']
})
export class MakeComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTextBox: ElementRef;
  @Input() public makes;
  @Input() public filteredMakes;
  @Output() selectedMakes: EventEmitter<any> = new EventEmitter();

  makeLoading: boolean = false;
  makeLoadingSelect: boolean = false;

  makeFormControl = new FormControl();
  makeSearchTextboxControl = new FormControl();
  makeSelectedValues:any = [];

  makeData = [];
  makeItems = [];
  makeIds = [];
  dbSelectedMake = [];
  makeFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor() { }

  ngOnInit() {
    if(!this.tagClose) {
      console.log(this.makes)
      for (let item in this.makes) {
        let makeName = this.makes[item];
        this.makeData.push(makeName);
        for (let makeItem of this.filteredMakes) {
          if(makeName == makeItem) {
            this.dbSelectedMake.push(makeName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.makeLoading = true;
    this.makeFilteredOptions = this.makeSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.makeLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.makeFormControl.patchValue(this.makeSelectedValues);
    this.makeItems = this.makeFormControl.value;
    let filteredList = this.makeData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.makeFormControl.value && this.makeFormControl.value.length > 0) {
      this.makeFormControl.value.forEach((e) => {
        if (this.makeSelectedValues.indexOf(e) == -1) {
          this.makeSelectedValues.push(e);
          for (let item in this.makes) {
            if(e == this.makes[item]){
              var makeName = this.makes[item];
            }
          }
          this.makeIds.push(makeName);
          this.selectedMakes.emit(this.makeIds);
          this.makeItems = this.makeFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.makeSelectedValues.indexOf(event.source.value);
      this.makeSelectedValues.splice(index, 1);
      this.makeIds.splice(index, 1);
      this.selectedMakes.emit(this.makeIds);
      this.makeItems = this.makeFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.makeSearchTextboxControl.patchValue('');
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
    this.makeSearchTextboxControl.patchValue('');
  }

  /**
   * Disable makes
   */
  disableSelection(name) {
    for (let item in this.makes) {
      if(name == this.makes[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedMake.splice(index, 1);
    this.makeIds.splice(index, 1);
    this.selectedMakes.emit(this.makeIds);
    this.makeItems = this.makeFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
