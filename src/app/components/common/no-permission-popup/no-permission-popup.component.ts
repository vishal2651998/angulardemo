import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-no-permission-popup',
  templateUrl: './no-permission-popup.component.html',
  styleUrls: ['./no-permission-popup.component.scss']
})
export class NoPermissionPopupComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {

    
  }

  // Confirmation Action
  confAction() {
    this.activeModal.close();
  }

}
