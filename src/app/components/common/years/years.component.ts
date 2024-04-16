import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTextBox: ElementRef;
  @Input() public splitIcon;
  @Input() public years;
  @Input() public filteredYears;
  @Input() public defaultPlaceholder: boolean = false;
  @Output() selectedYears: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  yrLoading: boolean = false;
  yrLoadingSelect: boolean = false;

  yrFormControl = new FormControl();
  yrSearchTextboxControl = new FormControl();
  yrSelectedValues:any = [];

  yrData = [];
  yearItems = [];
  yearIds = [];
  dbSelectedYr = [];
  yrFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;
  public placeholder:string = 'Select Year';
  public searchPlaceholder: string = "Search";

  constructor() { }

  ngOnInit() {
    //this.placeholder = this.defaultPlaceholder ? this.placeholder : `${this.placeholder} Year`;
    this.searchPlaceholder = this.defaultPlaceholder ? this.searchPlaceholder : `${this.searchPlaceholder} Years`;
    if(!this.tagClose) {
      for (let item in this.years) {
        let yearId = this.years[item].id;
        let yearName = this.years[item].name;
        this.yrData.push(this.years[item].name);
        for (let yrItem of this.filteredYears) {
          if(yearId == yrItem) {
            this.dbSelectedYr.push(yearName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.yrLoading = true;
    this.yrFilteredOptions = this.yrSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.yrLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.yrFormControl.patchValue(this.yrSelectedValues);
    this.yearItems = this.yrFormControl.value;
    let filteredList = this.yrData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.yrFormControl.value && this.yrFormControl.value.length > 0) {
      this.yrFormControl.value.forEach((e) => {
        if (this.yrSelectedValues.indexOf(e) == -1) {
          this.yrSelectedValues.push(e);
          for (let item in this.years) {
            if(e == this.years[item].name ){
              var yrId = this.years[item].id;
            }
          }
          this.yearIds.push(yrId);
          let data = {
            init: true,
            emit: true,
            items: this.yearIds
          }
          this.selectedYears.emit(data);
          this.yearItems = this.yrFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.yrSelectedValues.indexOf(event.source.value);
      this.yrSelectedValues.splice(index, 1);
      this.yearIds.splice(index, 1);
      let data = {
        init: false,
        emit: false,
        items: this.yearIds
      }
      this.selectedYears.emit(data);
      this.yearItems = this.yrFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.yrSearchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true;    // close button true
    }
    else {
      this.selectClose = false;   // close button false
      let data = {
        init: false,
        emit: true,
        items: this.yearIds
      }
      this.selectedYears.emit(data);
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.yrSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Years
   */
  disableSelection(name) {
    for (let item in this.years) {
      if(name == this.years[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedYr.splice(index, 1);
    this.yearIds.splice(index, 1);
    let data = {
      init: false,
      emit: true,
      items: this.yearIds
    }
    this.selectedYears.emit(data);
    this.yearItems = this.yrFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
