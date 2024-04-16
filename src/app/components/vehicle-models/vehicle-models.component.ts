import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-models',
  templateUrl: './vehicle-models.component.html',
  styleUrls: ['./vehicle-models.component.scss']
})
export class VehicleModelsComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTextBox: ElementRef;
  @Input() public models;
  @Input() public filteredModels;
  @Output() selectedModels: EventEmitter<any> = new EventEmitter();

  mdLoading: boolean = false;
  mdLoadingSelect: boolean = false;

  mdFormControl = new FormControl();
  mdSearchTextboxControl = new FormControl();
  mdSelectedValues:any = [];

  mdData = [];
  modelItems = [];
  modelIds = [];
  dbSelectedMd = [];
  mdFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor() { }

  ngOnInit() {
    if(!this.tagClose) {
      for (let item in this.models) {
        let modelId = this.models[item].id;
        let modelName = this.models[item].name;
        this.mdData.push(this.models[item].name);
        for (let mdItem of this.filteredModels) {
          if(modelId == mdItem) {
            this.dbSelectedMd.push(modelName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.mdLoading = true;
    this.mdFilteredOptions = this.mdSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.mdLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.mdFormControl.patchValue(this.mdSelectedValues);
    this.modelItems = this.mdFormControl.value;
    let filteredList = this.mdData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.mdFormControl.value && this.mdFormControl.value.length > 0) {
      this.mdFormControl.value.forEach((e) => {
        if (this.mdSelectedValues.indexOf(e) == -1) {
          this.mdSelectedValues.push(e);
          for (let item in this.models) {
            if(e == this.models[item].name) {
              var mdId = this.models[item].id;
            }
          }

          this.modelIds.push(mdId);
          this.selectedModels.emit(this.modelIds);
          this.modelItems = this.mdFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.mdSelectedValues.indexOf(event.source.value);
      this.mdSelectedValues.splice(index, 1);
      this.modelIds.splice(index, 1);
      this.selectedModels.emit(this.modelIds);
      this.modelItems = this.mdFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.mdSearchTextboxControl.patchValue('');
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
    this.mdSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Models
   */
  disableSelection(name) {
    for (let item in this.models) {
      if(name == this.models[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedMd.splice(index, 1);
    this.modelIds.splice(index, 1);
    this.selectedModels.emit(this.modelIds);
    this.modelItems = this.mdFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
