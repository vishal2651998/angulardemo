import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';

@Component({
  selector: 'app-alternate-model-popup',
  templateUrl: './alternate-model-popup.component.html',
  styleUrls: ['./alternate-model-popup.component.scss']
})
export class AlternateModelPopupComponent implements OnInit {

  alternateModel:string = ""
  public modalConfig: any = {
    backdrop: "static",
    keyboard: false,
    centered: true,
  };
  constructor(public activeModal: NgbActiveModal,private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  save(){
    const msgModalRef1 = this.modalService.open(SuccessModalComponent, this.modalConfig)
    msgModalRef1.componentInstance.successMessage = "Alternate model updated!";
    setTimeout(() => {
      msgModalRef1.dismiss('Cross click'); 
      // this.activeModal.close();    
      this.activeModal.close(this.alternateModel);
    }, 2000);
  }

  closePopup(){
    this.activeModal.dismiss()
  }

}
