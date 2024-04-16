import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-not-found',
  templateUrl: './email-not-found.component.html',
  styleUrls: ['./email-not-found.component.scss']
})
export class EmailNotFoundComponent implements OnInit {

  @Output() nonEmailResponce: EventEmitter<any> = new EventEmitter();
  @Input() successMsg;
  @Input() action;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.successMsg);
    this.successMsg = (this.successMsg != undefined && this.successMsg != 'undefined' && this.successMsg != '' ) ? this.successMsg : '';
    this.action = (this.action != undefined && this.action != 'undefined' && this.action != '' ) ? this.action : '';
  }

  exitPOPUP(){     
    this.nonEmailResponce.emit(false);   
  }
  continuePOPUP(){
    this.nonEmailResponce.emit(true);
  }

}