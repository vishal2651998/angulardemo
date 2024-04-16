import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionFormComponent } from '../../../components/common/action-form/action-form.component';
import { GtsService } from 'src/app/services/gts/gts.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  @ViewChild('search', {static: false}) searchTextBox: ElementRef;
  @Input() public tags;
  @Input() public filteredTags;
  @Output() selectedTags: EventEmitter<any> = new EventEmitter();

  public domainId;
  public userId;
  public countryId;

  tagLoading: boolean = false;
  tagLoadingSelect: boolean = false;

  tagFormControl = new FormControl();
  tagSearchTextboxControl = new FormControl();
  tagSelectedValues:any = [];

  tagData = [];
  tagItems = [];
  tagIds = [];
  tagActions = [];
  dbSelectedTag = [];
  tagFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;
  public user: any;
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  constructor(
    private modalService: NgbModal,
    private gtsApi: GtsService,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,

  ) { }

  ngOnInit() {

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    if(!this.tagClose) {
      for (let item in this.tags) {
        let tagId = this.tags[item].name;
        let tagName = this.tags[item].name;
        this.tagData.push(this.tags[item].name);
        for (let tagItem of this.filteredTags) {
          if(tagId == tagItem) {
            this.dbSelectedTag.push(tagName);
          }
        }
      }
    }
    this.tagClose = false;

    /**
     * Set filter event based on value changes
     */
    this.tagLoading = true;
    this.tagFilteredOptions = this.tagSearchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
    setTimeout(() => {
      this.tagLoadingSelect = true;
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.tagFormControl.patchValue(this.tagSelectedValues);
    this.tagItems = this.tagFormControl.value;
    let filteredList = this.tagData.filter(option => option.toLowerCase().indexOf(filterValue) !== -1);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.tagFormControl.value && this.tagFormControl.value.length > 0) {
      this.tagFormControl.value.forEach((e) => {
        if (this.tagSelectedValues.indexOf(e) == -1) {
          this.tagSelectedValues.push(e);
          for (let item in this.tags) {
            if(e == this.tags[item].name) {
              var tagId = this.tags[item].id;
              var tagName = this.tags[item].name;
              var tagAction = this.tags[item].editAccess;
            }
          }

          this.tagIds.push(tagId);
          this.tagActions.push({
            id: tagId,
            name: tagName,
            access: tagAction
          });
          this.selectedTags.emit(this.tagIds);
          this.tagItems = this.tagFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.tagSelectedValues.indexOf(event.source.value);
      this.tagSelectedValues.splice(index, 1);
      this.tagIds.splice(index, 1);
      this.tagActions.splice(index, 1);
      this.selectedTags.emit(this.tagIds);
      this.tagItems = this.tagFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.tagSearchTextboxControl.patchValue('');
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
    this.tagSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Models
   */
  disableSelection(name) {
    for (let item in this.tags) {
      if(name == this.tags[item].name){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedTag.splice(index, 1);
    this.tagIds.splice(index, 1);
    this.tagActions.splice(index, 1);
    this.selectedTags.emit(this.tagIds);
    this.tagItems = this.tagFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

  editTag(item) {
    console.log(item)
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId
    };

    let tagId = item.id;
    let tagName = item.name;
    let action = {
      action: 'edit',
      id: tagId,
      name: tagName
    }

    const modalRef = this.modalService.open(ActionFormComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Tag Creation';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = action;
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      console.log(this.tagItems)
      let id = receivedService.id;
      let name = receivedService.name;
      if(receivedService.action) {
        if(tagName != name) {
          let tagIndex = this.tagIds.findIndex(option => option == name);
          console.log(tagIndex)
          this.tagIds[tagIndex] = name;
          this.tagItems[tagIndex] = name;
        }
      }
    });
  }

}
