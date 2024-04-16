import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dms-sms-modal',
  templateUrl: './dms-sms-modal.component.html',
  styleUrls: ['./dms-sms-modal.component.scss'],
  providers: [MessageService]

})
export class DmsSmsModalComponent implements OnInit {

  constructor(private messageService: MessageService,public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

}
