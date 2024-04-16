import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public dealers;
  @Input() public filteredDealers;
  @Output() selectedDealers: EventEmitter<any> = new EventEmitter();

  public init: boolean = true;
  public deselectFlag: boolean = false;
  dealerLoading: boolean = false;
  dealerLoadingSelect: boolean = false;

  dealerFormControl = new FormControl();
  dealerSearchTextboxControl = new FormControl();
  dealerSelectedValues:any = [];

  dealerData = [];
  dealerItems = [];
  dealerIds = [];
  dbSelectedDealer = [];
  dealerFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor(private elementHost: ElementRef) { }

  ngOnInit() {
    //console.log(this.dealers)
    setTimeout(() => {
      if(!this.tagClose) {
        for (let item in this.dealers) {
          let dealerId = this.dealers[item].dealerCode;
          let dealerName = this.dealers[item].dealerName;
          this.dealerData.push(dealerName);
          for (let dealerItem of this.filteredDealers) {
            if(dealerId == dealerItem) {
              this.dbSelectedDealer.push(dealerName);
            }
          }
        }
      }
      this.tagClose = false;
      //console.log(this.filteredDealers)

      /**
       * Set filter event based on value changes
       */
      this.dealerLoading = true;
      this.dealerFilteredOptions = this.dealerSearchTextboxControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filter(name))
        );
      setTimeout(() => {
        this.dealerLoadingSelect = true;
      }, 700);

      //console.log(this.dealerData)
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.dealerFormControl.patchValue(this.dealerSelectedValues);
    this.dealerItems = this.dealerFormControl.value;
    let filteredList = this.dealerData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    setTimeout(() => {
      this.init = false;
    }, 500);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.dealerFormControl.value && this.dealerFormControl.value.length > 0) {
      this.dealerFormControl.value.forEach((e) => {
        if (this.dealerSelectedValues.indexOf(e) == -1) {
          this.dealerSelectedValues.push(e);
          for (let item in this.dealers) {
            if(e == this.dealers[item].dealerName ){
              var id = this.dealers[item].dealerCode;
            }
          }
          this.dealerIds.push(id);
          this.selectedDealers.emit(this.dealerIds);
          this.dealerItems = this.dealerFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.dealerSelectedValues.indexOf(event.source.value);
      this.dealerSelectedValues.splice(index, 1);
      this.dealerIds.splice(index, 1);
      this.selectedDealers.emit(this.dealerIds);
      this.dealerItems = this.dealerFormControl.value;
    }

  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.dealerSearchTextboxControl.patchValue('');
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
    this.dealerSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Dealers
   */
  disableSelection(name) {
    for (let item in this.dealers) {
      if(name == this.dealers[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedDealer.splice(index, 1);
    //this.dealerSelectedValues.splice(index, 1);
    this.dealerIds.splice(index, 1);
    this.selectedDealers.emit(this.dealerIds);
    this.dealerItems = this.dealerFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }
}
