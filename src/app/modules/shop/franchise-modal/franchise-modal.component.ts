import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-franchise-modal',
  templateUrl: './franchise-modal.component.html',
  styleUrls: ['./franchise-modal.component.scss'],
  providers: [MessageService]
})
export class FranchiseModalComponent implements OnInit {

  constructor(private messageService: MessageService,public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
    
  }

}
