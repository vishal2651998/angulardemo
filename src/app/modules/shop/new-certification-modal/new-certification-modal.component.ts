import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-certification-modal',
  templateUrl: './new-certification-modal.component.html',
  styleUrls: ['./new-certification-modal.component.scss'],
  providers: [MessageService]
})
export class NewCertificationModalComponent implements OnInit {

  constructor(private messageService: MessageService,public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

}
