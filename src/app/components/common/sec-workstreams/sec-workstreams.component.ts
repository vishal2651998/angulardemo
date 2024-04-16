import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-sec-workstreams",
  templateUrl: "./sec-workstreams.component.html",
  styleUrls: ["./sec-workstreams.component.scss"],
})
export class SecWorkstreamsComponent implements OnInit {
  @ViewChild("search", { static: false }) searchTextBox: ElementRef;
  @Input() public workstreams;
  @Input() public filteredWorkstreams;
  @Input() public showRecentSelection: boolean = false;
  @Input() public split: boolean = true;
  @Output() selectedWorkstreams: EventEmitter<any> = new EventEmitter();

  wsLoading: boolean = false;
  wsLoadingSelect: boolean = false;

  wsFormControl = new FormControl();
  wsSearchTextboxControl = new FormControl();
  wsSelectedValues: any = [];

  wsData = [];
  workstreamItems = [];
  workstreamIds = [];
  dbSelectedWs = [];
  wsFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor() {}

  ngOnInit() {
    if (!this.tagClose) {
      for (let item in this.workstreams) {
        let wsId = this.workstreams[item].workstreamId;
        let wsName = this.workstreams[item].workstreamName;
        this.wsData.push(this.workstreams[item].workstreamName);
        for (let wsItem of this.filteredWorkstreams) {
          if (wsId == wsItem) {
            this.dbSelectedWs.push(wsName);
          }
        }
      }
    }
    /* console.log(
      "this.wsData",
      this.wsData,
      "this.dbSelectedWs",
      this.dbSelectedWs
    ); */
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.wsLoading = true;
    this.wsFilteredOptions = this.wsSearchTextboxControl.valueChanges.pipe(
      startWith<string>(""),
      map((name) => this._filter(name))
    );
    setTimeout(() => {
      this.wsLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.wsFormControl.patchValue(this.wsSelectedValues);
    this.workstreamItems = this.wsFormControl.value;
    /* console.log(
      "this.wsSelectedValues",
      this.wsSelectedValues,
      this.workstreamItems
    ); */
    let filteredList = this.wsData.filter(
      (option) => option.toLowerCase().indexOf(filterValue) !== -1
    );
    return filteredList;
  }

  /**
   * Set selected values to retain the state
   */
  setSelectedValues() {
    if (this.wsFormControl.value && this.wsFormControl.value.length > 0) {
      this.wsFormControl.value.forEach((e) => {
        if (this.wsSelectedValues.indexOf(e) == -1) {
          this.wsSelectedValues.push(e);
          for (let item in this.workstreams) {
            if (e == this.workstreams[item].workstreamName) {
              var wsId = this.workstreams[item].workstreamId;
            }
          }
          this.workstreamIds.push(wsId);
          this.selectedWorkstreams.emit(this.workstreamIds);
          this.workstreamItems = this.wsFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.wsSelectedValues.indexOf(event.source.value);
      this.wsSelectedValues.splice(index, 1);
      this.workstreamIds.splice(index, 1);
      this.selectedWorkstreams.emit(this.workstreamIds);
      this.workstreamItems = this.wsFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.wsSearchTextboxControl.patchValue("");
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      //this.searchTextBox.nativeElement.focus();
      this.selectClose = true; // close button true
    } else {
      this.selectClose = false; // close button false
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.wsSearchTextboxControl.patchValue("");
  }

  /**
   * Disable Workstreams
   */
  disableSelection(workstreamName) {
    for (let item in this.workstreams) {
      if (workstreamName == this.workstreams[item].workstreamName) {
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedWs.splice(index, 1);
    this.workstreamIds.splice(index, 1);
    this.selectedWorkstreams.emit(this.workstreamIds);
    this.workstreamItems = this.wsFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }
  onRecentSelect(workstream, index) {
    this.wsFormControl.patchValue([workstream.workstreamName]);
    this.workstreamItems = this.wsFormControl.value;
    this.setSelectedValues();
  }
}
