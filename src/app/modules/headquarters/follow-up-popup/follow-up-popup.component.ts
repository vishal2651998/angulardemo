import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-follow-up-popup',
  templateUrl: './follow-up-popup.component.html',
  styleUrls: ['./follow-up-popup.component.scss']
})
export class FollowUpPopupComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
