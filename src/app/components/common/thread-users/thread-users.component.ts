import { Component, OnInit, ElementRef, ViewChild, Input, Output,  EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-thread-users',
  templateUrl: './thread-users.component.html',
  styleUrls: ['./thread-users.component.scss']
})
export class ThreadUsersComponent implements OnInit {

  @ViewChild('search') searchTextBox: ElementRef;
  @Input() public users;
  @Input() public filteredUsers;
  @Output() selectedUsers: EventEmitter<any> = new EventEmitter();

  public init: boolean = true;
  userLoading: boolean = false;
  userLoadingSelect: boolean = false;

  userFormControl = new FormControl();
  userSearchTextboxControl = new FormControl();
  userSelectedValues:any = [];

  userData = [];
  userItems = [];
  userIds = [];
  dbSelectedUser = [];
  userFilteredOptions: Observable<any[]>;
  public selectClose = false;
  public tagClose: boolean = false;

  constructor(private elementHost: ElementRef) { }

  ngOnInit() {
    //console.log(this.users)
    setTimeout(() => {
      if(!this.tagClose) {
        for (let item in this.users) {
          let userId = this.users[item].userId;
          let userName = this.users[item].userName;
          this.userData.push(userName);
          for (let userItem of this.filteredUsers) {
            if(userId == userItem) {
              this.dbSelectedUser.push(userName);
            }
          }
        }
      }
      this.tagClose = false;
      //console.log(this.filteredUsers)

      /**
       * Set filter event based on value changes
       */
      this.userLoading = true;
      this.userFilteredOptions = this.userSearchTextboxControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filter(name))
        );
      setTimeout(() => {
        this.userLoadingSelect = true;
      }, 700);

      //console.log(this.userData)
    }, 700);
  }

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.userFormControl.patchValue(this.userSelectedValues);
    this.userItems = this.userFormControl.value;
    let filteredList = this.userData.filter(option => option.toLowerCase().indexOf(filterValue)!== -1);
    setTimeout(() => {
      this.init = false;
    }, 500);
    return filteredList;
  }

  /**
  * Set selected values to retain the state
  */
  setSelectedValues() {
    if (this.userFormControl.value && this.userFormControl.value.length > 0) {
      this.userFormControl.value.forEach((e) => {
        if (this.userSelectedValues.indexOf(e) == -1) {
          this.userSelectedValues.push(e);
          for (let item in this.users) {
            if(e == this.users[item].userName){
              var id = this.users[item].userId;
            }
          }
          this.userIds.push(id);
          this.selectedUsers.emit(this.userIds);
          this.userItems = this.userFormControl.value;
        }
      });
    }
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.userSelectedValues.indexOf(event.source.value);
      this.userSelectedValues.splice(index, 1);
      this.userIds.splice(index, 1);
      this.selectedUsers.emit(this.userIds);
      this.userItems = this.userFormControl.value;
    }
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.userSearchTextboxControl.patchValue('');
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
    this.userSearchTextboxControl.patchValue('');
  }

  /**
   * Disable Users
   */
  disableSelection(name) {
    for (let item in this.users) {
      if(name == this.users[item].userName){
        //return true;
      }
    }
  }

  disableTagSelection(index) {
    this.dbSelectedUser.splice(index, 1);
    //this.userSelectedValues.splice(index, 1);
    this.userIds.splice(index, 1);
    this.selectedUsers.emit(this.userIds);
    this.userItems = this.userFormControl.value;
    this.tagClose = true;
    this.ngOnInit();
  }

}
