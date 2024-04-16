import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public areas;
  @Input() public filteredAreas;
  @Output() selectedAreas: EventEmitter<any> = new EventEmitter();

  public init: boolean = true;
  areaLoading: boolean = false;
  areaLoadingSelect: boolean = false;

  areaFormControl = new FormControl();
  areaSearchTextboxControl = new FormControl();
  areaSelectedValues:any = "";

  areaData = [];
  areaItems = [];
  areaIds = "";
  dbSelectedArea = "";
  areaFilteredOptions: Observable<any>;
  public selectClose = false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      for (let item in this.areas) {
        let areaId = this.areas[item].val;
        let areaName = this.areas[item].option;
        this.areaData.push(areaName);

        if(areaId == this.filteredAreas) {
          this.dbSelectedArea = areaName;
        }
      }

      /**
       * Set filter event based on value changes
       */
      this.areaLoading = true;
      this.areaFilteredOptions = this.areaSearchTextboxControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filter(name))
        );
      setTimeout(() => {
        this.areaLoadingSelect = true;
      }, 700);
    }, 500);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.areaFormControl.patchValue(this.areaSelectedValues);
    this.areaItems = this.areaFormControl.value;
    this.dbSelectedArea = this.areaFormControl.value;
    let filteredList = this.areaData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    setTimeout(() => {
      this.init = false;
    }, 500);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.areaFormControl.value) {
      let selVal = this.areaFormControl.value;
      this.areaSelectedValues = selVal;
      for (let item in this.areas) {
        if(selVal == this.areas[item].option ){
          var id = this.areas[item].val;
        }
      }
      this.areaIds = "";
      //this.selectedTerritories.emit(this.terIds);
      this.areaItems = this.areaFormControl.value;
      this.dbSelectedArea = this.areaFormControl.value;
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (!this.init && event.isUserInput && event.source.selected == true) {
      this.areaSelectedValues = this.areaFormControl.value;
      this.areaIds = event.source.value;
      this.selectedAreas.emit(this.areaIds);
      this.areaItems = this.areaFormControl.value;
      return false;
    }
    return false;
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.areaSearchTextboxControl.patchValue('');
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
    this.areaSearchTextboxControl.patchValue('');
  }

  /**
   * Disable service categories
   */
  disableSelection(name) {
    for (let item in this.areas) {
      if(name == this.areas[item].name){
        //return true;
      }
    }
  }

}
