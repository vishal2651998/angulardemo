import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GtsService } from 'src/app/services/gts/gts.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GTSPage } from 'src/app/common/constant/constant';
import { SummaryFormComponent } from '../summary-form/summary-form.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {

  constructor(private gtsApi: GtsService, private route: Router, public activeModal: NgbActiveModal, private modalService: NgbModal, private config: NgbModalConfig) { }

  ngOnInit(): void {
    document.body.classList.add(this.config.windowClass)
  }


  cancel() {
    let gtslistpage = localStorage.getItem('gtsStartFrom');
    localStorage.removeItem('gtsStartFrom');
    if(gtslistpage == '1'){
      this.route.navigate(['gts/']).then(() => {
        (this.gtsApi.apiData as any) = {};
        this.gtsApi.pageType = GTSPage.gts;
        this.closePopup()
      })
    }
    else{
      this.route.navigate(['gts/view/', this.gtsApi.apiData.procedureId]).then(() => {
        (this.gtsApi.apiData as any) = {};
        this.gtsApi.pageType = GTSPage.gts;
        this.closePopup()
      })
    } 
  }
  swtichToStart() {
    this.gtsApi.updateGTSExitStatus().subscribe((res) => {
      if (res.status == 'Success') {
        this.cancel();
      }
    });
    // this.route.navigate(['gts/view', this.gtsApi.apiData.procedureId]).then(() => {
    //   (this.gtsApi.apiData as any) = {};
    //   this.gtsApi.pageType = GTSPage.gts;
    //   this.closePopup()
    // })
  }




  closePopup() {
    this.activeModal.dismiss();
    document.body.classList.remove(this.config.windowClass)
  }

  openPopup(status) {
    let title = '';
    switch (status) {
      case 'resolved':
        title = 'Please tell us about your findings and the resolution';
        break;
      case 'pause':
        title = ''
        break;
      case 'not_helpful':
        title = 'Any suggestions to make it better?';
        break;

      default:
        break;
    }
    this.closePopup();
    this.config.backdrop = true;
    this.config.keyboard = true;
    this.config.centered = true;
    this.config.size = 'lg';
    const modalRef = this.modalService.open(SummaryFormComponent, this.config)
    modalRef.componentInstance.title = title;
  }

}
