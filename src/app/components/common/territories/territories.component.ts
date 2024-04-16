import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-territories',
  templateUrl: './territories.component.html',
  styleUrls: ['./territories.component.scss']
})
export class TerritoriesComponent implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public territories;
  @Input() public filteredTerritories;
  @Output() selectedTerritories: EventEmitter<any> = new EventEmitter();

  public init: boolean = true;
  terLoading: boolean = false;
  terLoadingSelect: boolean = false;

  terFormControl = new FormControl();
  terSearchTextboxControl = new FormControl();
  terSelectedValues:any = "";

  terData = [];
  terItems = [];
  terIds = "";
  dbSelectedTer = "";
  terFilteredOptions: Observable<any>;
  public selectClose = false;

  constructor() { }

  ngOnInit() {
    //console.log(this.territories)
    setTimeout(() => {
      for (let item in this.territories) {
        let terId = this.territories[item].val;
        let terName = this.territories[item].option;
        this.terData.push(terName);

        if(terId == this.filteredTerritories) {
          this.dbSelectedTer = terName;
        }
      }

      //console.log(this.filteredTerritories)

      /**
       * Set filter event based on value changes
       */
      this.terLoading = true;
      this.terFilteredOptions = this.terSearchTextboxControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filter(name))
        );
      setTimeout(() => {
        this.terLoadingSelect = true;
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
    this.terFormControl.patchValue(this.terSelectedValues);
    this.terItems = this.terFormControl.value;
    let filteredList = this.terData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.terFormControl.value && this.terFormControl.value.length > 0) {
      let selVal = this.terFormControl.value;
      this.terSelectedValues = selVal;
      for (let item in this.territories) {
        if(selVal == this.territories[item].option ){
          var id = this.territories[item].val;
          this.dbSelectedTer = selVal;
        }
      }
      this.terIds = "";
      //this.selectedTerritories.emit(this.terIds);
      this.terItems = this.terFormControl.value;
      this.dbSelectedTer = this.terFormControl.value;
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (!this.init && event.isUserInput && event.source.selected == true) {
      console.log(event.source.value)
      this.terSelectedValues = this.terFormControl.value;
      this.terIds = event.source.value;
      this.selectedTerritories.emit(this.terIds);
      this.terItems = this.terFormControl.value;
      this.dbSelectedTer = this.terFormControl.value;
      this.init = false;
      return false;
    }
    return false;
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.terSearchTextboxControl.patchValue('');
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
    this.terSearchTextboxControl.patchValue('');
  }

  /**
   * Disable service categories
   */
  disableSelection(name) {
    for (let item in this.territories) {
      if(name == this.territories[item].name){
        //return true;
      }
    }
  }

}
