import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-emissions',
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.scss']
})
export class EmissionsComponent implements OnInit {
    @ViewChild('search', {static: false}) searchTextBox: ElementRef;
    @Input() public emissions;
    @Input() public filteredEmissions;
    @Input() public dicvDomain;
    @Input() public filteredErrorCodes;
    @Output() selectedEmissions: EventEmitter<any> = new EventEmitter();
    @Output() selectedEmiNames: EventEmitter<any> = new EventEmitter();

    mdLoading: boolean = false;
    mdLoadingSelect: boolean = false;

    mdFormControl = new FormControl();
    mdSearchTextboxControl = new FormControl();
    mdSelectedValues:any = [];

    mdData = [];
    modelItems = [];
    modelIds = [];
    modelNames = [];
    dbSelectedMd = [];
    mdFilteredOptions: Observable<any[]>;
    public selectClose = false;
    public tagClose: boolean = false;

    constructor(
      public acticveModal: NgbActiveModal,
      private modalService: NgbModal
    ) { }

    ngOnInit() {
      if(!this.tagClose) {
        for (let item in this.emissions) {
          let modelId = this.emissions[item].id;
          //console.log(modelId);
          let modelName = this.emissions[item].name;
          //console.log(modelName);
          this.mdData.push(this.emissions[item].name);
          //console.log(this.mdData);
          //console.log(this.filteredEmissions);
          for (let mdItem of this.filteredEmissions) {
            if(modelId == mdItem) {
              this.dbSelectedMd.push(modelName);
            }
          }
          //console.log(this.dbSelectedMd);
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
            for (let item in this.emissions) {
              if(e == this.emissions[item].name) {
                var mdId = this.emissions[item].id;
                var mdName = this.emissions[item].name;
              }
            }

            this.modelIds.push(mdId);
            this.modelNames.push(mdName);
            this.selectedEmissions.emit(this.modelIds);
            this.selectedEmiNames.emit(this.modelNames);
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
        this.modelNames.splice(index, 1);
        //this.selectedEmissions.emit(this.modelIds);
        //this.selectedEmiNames.emit(this.modelNames);
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
     * Disable emissions
     */
    disableSelection(name) {
      for (let item in this.emissions) {
        if(name == this.emissions[item].name){
          //return true;
        }
      }
    }

    disableTagSelection(index) {
      console.log(this.dicvDomain, this.filteredErrorCodes)
      if(this.filteredErrorCodes.length > 0) {
        const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: true, centered: true});
        modalRef.componentInstance.access = "Error Code Remove Warning";
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
          modalRef.dismiss("Cross click");
          if(receivedService) {
            this.removeSelection(index);
          }
        });
      } else {
        this.removeSelection(index);
      }
    }

    removeSelection(index) {
      this.dbSelectedMd.splice(index, 1);
      this.modelIds.splice(index, 1);
      this.modelNames.splice(index, 1);
      this.selectedEmissions.emit(this.modelIds);
      this.selectedEmiNames.emit(this.modelNames);
      this.modelItems = this.mdFormControl.value;
      this.tagClose = true;
      this.ngOnInit();
    }
  }
