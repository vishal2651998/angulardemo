import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppUserNotificationsComponent } from '../../../components/common/app-user-notifications/app-user-notifications.component';
@Component({
  selector: 'app-common-notifications',
  templateUrl: './common-notifications.component.html',
  styleUrls: ['./common-notifications.component.scss']
})
export class CommonNotificationsComponent implements OnInit {
  public totalNotificationcount = 0;
  public totalunseenunreadcolor = '';
  public isModalOpen = false;
  public bodyElem;
  public notificationClass = 'top-right-notifications-popup';
  public notificationClass1 = 'top-right-notifications-popup-ms';
  public msTeamAccess: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  constructor(
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = false;
    config.keyboard = false;
    config.size = 'dialog-top';
    // config.windowClass = 'top-right-notifications-popup-only';
  }

  ngOnInit(): void {
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }
  }
  tapnotifications(type = '') {
    this.isModalOpen = true;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.notificationClass);
    if (this.teamSystem) {
      this.bodyElem.classList.add(this.notificationClass1);
    }
    const modalRef = this.modalService.open(AppUserNotificationsComponent, this.config);

    /*
    modalRef.componentInstance.opened(() => {
      this.isModalOpen = true;
      
  });
  
      
      modalRef.componentInstance.newNotificationsFCM = type;
      
  
    modalRef.componentInstance.closed(() => {
  
  
      this.isModalOpen = false;
  
    });
    */

    modalRef.componentInstance.newNotificationsFCM = type;
    modalRef.componentInstance.updateNotificationCountEvent.subscribe((receivedService) => {

      if (receivedService == 'reset') {
        this.isModalOpen = false;
      }
      else {
        let notificationsplit = receivedService.split('--');

        this.totalNotificationcount = notificationsplit[0];
        this.totalunseenunreadcolor = notificationsplit[1];
      }


    });

  }
}
