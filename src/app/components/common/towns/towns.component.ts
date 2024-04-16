import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-towns',
  templateUrl: './towns.component.html',
  styleUrls: ['./towns.component.scss']
})
export class TownsComponent implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public towns;
  @Input() public filteredTowns;
  @Output() selectedTowns: EventEmitter<any> = new EventEmitter();

  public init: boolean = true;
  townLoading: boolean = false;
  townLoadingSelect: boolean = false;

  townFormControl = new FormControl();
  townSearchTextboxControl = new FormControl();
  townSelectedValues:any = "";

  townData = [];
  townItems = [];
  townIds = "";
  dbSelectedTown = "";
  townFilteredOptions: Observable<any>;
  public selectClose = false;

  constructor() { }

  ngOnInit() {
    //console.log(this.towns)
    setTimeout(() => {
      for (let item in this.towns) {
        let townId = this.towns[item].val;
        let townName = this.towns[item].option;
        this.townData.push(townName);

        if(townId == this.filteredTowns) {
          this.dbSelectedTown = townName;
        }
      }

      //console.log(this.filteredTowns)

      /**
       * Set filter event based on value changes
       */
      this.townLoading = true;
      this.townFilteredOptions = this.townSearchTextboxControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filter(name))
        );
      setTimeout(() => {
        this.townLoadingSelect = true;
      }, 700);

      //console.log(this.terData)
    }, 500);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    setTimeout(() => {
      this.init = false;
    }, 500);
    this.townFormControl.patchValue(this.townSelectedValues);
    this.townItems = this.townFormControl.value;
    let filteredList = this.townData.filter(option => option.toLowerCase().indexOf(filterValue)!== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.townFormControl.value && this.townFormControl.value.length > 0) {
      let selVal = this.townFormControl.value;
      this.townSelectedValues = selVal;
      for (let item in this.towns) {
        if(selVal == this.towns[item].option ){
          var id = this.towns[item].val;
        }
      }
      this.townIds = "";
      //this.selectedTowns.emit(this.townIds);
      this.townItems = this.townFormControl.value;
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (!this.init && event.isUserInput && event.source.selected == true) {
      console.log(event.source.value)
      this.townSelectedValues = this.townFormControl.value;
      this.townIds = event.source.value;
      this.selectedTowns.emit(this.townIds);
      this.townItems = this.townFormControl.value;
      this.init = false;
      return false;
    }
    return false;
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.townSearchTextboxControl.patchValue('');
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
    this.townSearchTextboxControl.patchValue('');
  }

  /**
   * Disable service categories
   */
  disableSelection(name) {
    for (let item in this.towns) {
      if(name == this.towns[item].name){
        //return true;
      }
    }
  }

}
