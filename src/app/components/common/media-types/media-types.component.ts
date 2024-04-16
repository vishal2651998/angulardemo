import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-media-types',
  templateUrl: './media-types.component.html',
  styleUrls: ['./media-types.component.scss']
})
export class MediaTypesComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTextBox: ElementRef;
  @Input() public splitIcon;
  @Input() public mediaTypes;
  @Input() public filteredMediaTypes;
  @Output() selectedMediaTypes: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};

  mediaLoading: boolean = false;
  mediaLoadingSelect: boolean = false;

  mediaFormControl = new FormControl();
  mediaSearchTextboxControl = new FormControl();
  mediaSelectedValues:any = [];

  mediaData = [];
  mediaItems = [];
  mediaIds = [];
  dbSelectedMedia = [];
  mediaFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public mediaClose: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(!this.mediaClose) {
      for (let item in this.mediaTypes) {
        let mediaId = this.mediaTypes[item].id;
        let mediaName = this.mediaTypes[item].name;
        this.mediaData.push(this.mediaTypes[item].name);
        for (let mediaItem of this.filteredMediaTypes) {
          if(mediaId == mediaItem) {
            this.dbSelectedMedia.push(mediaName);
          }
        }
      }
    }
    this.mediaClose = false;

    /**
     * Set filter event based on value changes
     */
    this.mediaLoading = true;
    this.mediaFilteredOptions = this.mediaSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.mediaLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.mediaFormControl.patchValue(this.mediaSelectedValues);
    this.mediaItems = this.mediaFormControl.value;
    let filteredList = this.mediaData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.mediaFormControl.value && this.mediaFormControl.value.length > 0) {
      this.mediaFormControl.value.forEach((e) => {
        if (this.mediaSelectedValues.indexOf(e) == -1) {
          this.mediaSelectedValues.push(e);
          for (let item in this.mediaTypes) {
            if(e == this.mediaTypes[item].name ){
              var mediaId = this.mediaTypes[item].id;
            }
          }
          this.mediaIds.push(mediaId);
          let data = {
            init: true,
            emit: true,
            items: this.mediaIds
          }
          this.selectedMediaTypes.emit(data);
          this.mediaItems = this.mediaFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.mediaSelectedValues.indexOf(event.source.value);
      this.mediaSelectedValues.splice(index, 1);
      this.mediaIds.splice(index, 1);
      let data = {
        init: false,
        emit: false,
        items: this.mediaIds
      }
      this.selectedMediaTypes.emit(data);
      this.mediaItems = this.mediaFormControl.value;
    }
  }

  openedChange(e: boolean) {
    // Set search textbox value as empty while opening selectbox
    this.mediaSearchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if(e) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true;    // close button true
    }
    else{
      this.selectClose = false;   // close button false
      let data = {
        init: false,
        emit: true,
        items: this.mediaIds
      }
      this.selectedMediaTypes.emit(data);
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.mediaSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Years
   */
  disableSelection(name) {
    for (let item in this.mediaTypes) {
      if(name == this.mediaTypes[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedMedia.splice(index, 1);
    this.mediaIds.splice(index, 1);
    let data = {
      init: false,
      emit: true,
      items: this.mediaIds
    }
    this.selectedMediaTypes.emit(data);
    this.mediaItems = this.mediaFormControl.value;
    this.mediaClose = true;
    this.ngOnInit();
  }

}
