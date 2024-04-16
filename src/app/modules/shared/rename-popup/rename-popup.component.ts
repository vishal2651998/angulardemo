import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { SuccessModalComponent } from '../../../components/common/success-modal/success-modal.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rename-popup',
  templateUrl: './rename-popup.component.html',
  styleUrls: ['./rename-popup.component.scss'],
  providers: [MessageService]

})
export class RenamePopupComponent implements OnInit {

  inputText:string = "";
  @Input() nameValue:string;
  @Input() title:string;
  @Output() emitService: EventEmitter<any> = new EventEmitter();
  isSaved:boolean = false;
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  constructor(
    private messageService: MessageService,
    public activeModal:NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  dismiss(){
    this.activeModal.dismiss();
  }
  save(){
    this.isSaved = true
    if(this.nameValue !==''){
      this.emitService.emit(this.nameValue);
      this.activeModal.close(); 
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = this.nameValue+" updated.";
      //this.messageService.add({severity:'success', summary:'Rename successfull', detail: `Attribute renamed successfully`})
      setTimeout(() => {
       msgModalRef.dismiss('Cross click'); 
        this.isSaved = false;
      }, 1000);
    }
  }

}
