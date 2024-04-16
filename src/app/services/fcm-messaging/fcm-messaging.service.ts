import { Component, OnInit, Output, HostListener, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { LandingpageService } from '../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Constant } from '../../common/constant/constant';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs'
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUserNotificationsComponent } from '../../components/common/app-user-notifications/app-user-notifications.component';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})

export class FcmMessagingService {
  @Output() updateNotificationCountEvent1 = new EventEmitter<any>();
  public user: any;
  public countryId;
  public domainId;
  public userId;
  public notificationClass = 'top-right-notifications-popup';
  public bodyElem;
  currentMessage = new BehaviorSubject(null);
  constructor(

    private http: HttpClient,
    private LandingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,

  ) {


  }


  updateToken(userId, token) {
    // we can change this function to request our backend service

  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  browserDetection() {
    let browserName = '';
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
      // insert conditional IE code here
      browserName = "MSIE";
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
      // insert conditional Chrome code here
      browserName = "Chrome";
    }
    //Check if browser is Firefox 
    else if (navigator.userAgent.search("Firefox") >= 0) {
      // insert conditional Firefox Code here
      browserName = "Firefox";
    }
    //Check if browser is Safari
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    }

    else {
      browserName = "others";
    }
    return browserName;
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        this.user = this.authenticationService.userValue;
        this.domainId = this.user.domain_id;
        this.userId = this.user.Userid;
        this.countryId = localStorage.getItem('countryId');
        const apiFormData = new FormData();
        let apiKey = Constant.ApiKey;
        apiFormData.append('apiKey', apiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('status', '1');
        apiFormData.append('webAppversion', environment.webVersionCollabtic.toString());
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        console.log(apiFormData);

        this.LandingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {

          console.log(response);
        });


      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage1() {
    //alert(1);
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        // var audio = new Audio("../../assets/sounds/alert.mp3");
        //audio.play();
        var src = '../../assets/sounds/pushalert.wav';
       // var c = document.createElement('audio');
       // c.src = src; c.play();
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.add(this.notificationClass);
        this.config.windowClass = 'top-right-notifications-popup-only';
        const modalRef = this.modalService.open(AppUserNotificationsComponent, this.config);

        modalRef.componentInstance.updateNotificationCountEvent.subscribe((receivedService) => {

          // alert(receivedService);
          this.updateNotificationCountEvent1.emit(receivedService);
          return receivedService;
          // this.totalNotificationcount=receivedService;

        });

      })
  }
}
