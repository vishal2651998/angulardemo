import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public splitIcon;
  @Input() public models;
  @Input() public filteredModels;
  @Input() public defaultPlaceholder:boolean = false;
  @Output() selectedModels: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  mdLoading: boolean = false;
  mdLoadingSelect: boolean = false;

  mdFormControl = new FormControl();
  mdSearchTextboxControl = new FormControl();
  mdSelectedValues:any = [];

  mdData = [];
  modelItems = [];
  modelIds = [];
  dbSelectedMd = [];
  mdFilteredOptions: Observable<any>;
  public selectClose = false;
  public tagClose: boolean = false;
  public disableModel: boolean = false;
  public placeholder: string = "Select Model";
  public searchPlaceholder: string = "Search";

  constructor() { }

  ngOnInit() {
    //this.placeholder = this.defaultPlaceholder ? this.placeholder : `${this.placeholder} Model`;
    this.searchPlaceholder = this.defaultPlaceholder ? this.searchPlaceholder : `${this.searchPlaceholder} Models`;
    if(!this.tagClose) {
      //console.log(this.models);
      for (let item in this.models) {
        //console.log(this.models[item].id);
        //console.log(this.models[item].name);
        let modelId = this.models[item].id;
        let modelName = this.models[item].name;
        //this.disableModel =  (modelName == 'All') ? true : false;
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
          let data = {
            init: true,
            emit: true,
            items: this.modelIds
          }
          this.selectedModels.emit(data);
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
      let data = {
        init: false,
        emit: false,
        items: this.modelIds
      }
      this.selectedModels.emit(data);
      this.modelItems = this.mdFormControl.value;
    }
  }

  openedChange(e: boolean) {
    // Set search textbox value as empty while opening selectbox
    this.mdSearchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if(e) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true;    // close button true
    }
    else {
      this.selectClose = false;   // close button false
      let data = {
        init: false,
        emit: true,
        items: this.modelIds
      }
      this.selectedModels.emit(data);
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
    //console.log(index)
    this.modelIds.splice(index, 1);
    this.dbSelectedMd.splice(index, 1);
    //console.log(this.dbSelectedMd, this.modelIds);
    let data = {
      init: false,
      emit: true,
      items: this.modelIds
    }
    setTimeout(() => {
      this.selectedModels.emit(data);
    }, 50);
    this.modelItems = this.mdFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
