import { Component, OnInit, Input, EventEmitter,Output  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.scss']
})
export class AuthSuccessComponent implements OnInit {

  @Input() successMessage: string;
  @Output() successResponce: EventEmitter<any> = new EventEmitter(); 

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  successOK(){ 
    //this.activeModal.dismiss('Cross click');  
    this.successResponce.emit(true);   
  }

}

