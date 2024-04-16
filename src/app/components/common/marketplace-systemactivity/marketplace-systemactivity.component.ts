import { Component, OnInit,HostListener } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { state, keyframes, style, animate, trigger, transition } from '@angular/animations';
import { Constant,LocalStorageItem,ChatType, PlatFormType, PushTypes, RedirectionPage, DefaultNewCreationText, filterNames, ManageTitle,PageTitleText,forumPageAccess, pageInfo, pageTitle, windowHeight } from 'src/app/common/constant/constant';
import { environment } from '../../../../environments/environment';
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import * as moment from "moment";
declare var $:any;
@Component({
  selector: 'app-marketplace-systemactivity',
  templateUrl: './marketplace-systemactivity.component.html',
  styleUrls: ['./marketplace-systemactivity.component.scss'],
  animations: [
    trigger('inOutAnimation', 
    [ state('in', style({ opacity: 1 })),
    transition(':enter', [style({ opacity: '0' }), 
    animate('.5s ease-out', style({ opacity: '1' }))]),
    transition(':leave', [style({ opacity: '1' }), 
    animate('.5s ease-out', style({ opacity: '0' }))]),
  ]),     
]
})

export class MarketplaceSystemactivityComponent implements OnInit {
public enableDesktopPush:boolean=false;
public systemActivityArr=[];
public pushCheckVal:boolean=false;
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    readonly afMessaging: AngularFireMessaging,
    private landingpageAPI: LandingpageService,

  ) { }

  ngOnInit(): void {
let action = 'init';
this.getSystemActivity(0);
this.receiveMessage();
    this.requestPermission(1, action);
  }
  receiveMessage() {
  this.angularFireMessaging.messages.subscribe(({ data }: { data: any }) => {
if(!this.pushCheckVal)
{
  this.pushCheckVal=true;

    this.systemActivityArr.splice(0, 1);
    this.getSystemActivity(1);
    setTimeout(() => {
      //this.viapushcall=false;
      this.pushCheckVal=false;
    },10000)
  }
    console.log("new message received. ", data);
  });
  }
  @HostListener('document:visibilitychange', ['$event'])
 
  visibilitychange() {
    
    let type1=0;
    console.log('PushCheck');
    navigator.serviceWorker.addEventListener('message', (event) => {
      
      type1=type1+1;
      if(type1==1 && !this.pushCheckVal)
      {
        this.pushCheckVal=true;
        this.systemActivityArr.splice(0, 1);
        this.getSystemActivity(1);
        setTimeout(() => {
          //this.viapushcall=false;
          this.pushCheckVal=false;
        },10000)
      }
    });
  }
  requestPermission(state, action = '') {
    
  
    this.angularFireMessaging.requestToken.subscribe(
      
      (token) => {
        console.log(token);
        if (token && token != null) {
          this.enableDesktopPush = false;
        }
        else {
          this.enableDesktopPush = true;
        }
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
        let webVersionApp=environment.webVersionCollabtic;
        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
      
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('fromActivity', '1');
        apiFormData.append('token', tokenKey);
        apiFormData.append('webAppversion', environment.webVersionCollabtic.toString());
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }
        //console.log(apiFormData);
        this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {
           

          });
         
      },
      (err) => {
        this.enableDesktopPush = true;
        console.log('Unable to get permission to notify.', err);
      }
    );
  }


  getSystemActivity(push=0)
  {
    const apiFormData = new FormData();
    apiFormData.append('offsrt', '0');
    if(push==1)
    {
      apiFormData.append('limit', '1');
      
    }
    apiFormData.append('apiKey', Constant.ApiKey);
  
        //console.log(apiFormData);
        this.landingpageAPI.getSystemActivity(apiFormData).subscribe((response) => {

        if(response.status)
        {
          let total=response.total;
          let items=response.items;
          if(items)
          {
            for(let e of items) 
            {
              let contentType=e.contentType;
              let contentaction1=e.action;
              let contentaction='';
              if(contentaction1=='like')
              {
                contentaction='Liked';
              }
              if(contentaction1=='pin')
              {
                contentaction='Pined';
              }
              if(contentaction1=='post')
              {
                contentaction='created';
              }

             // let genericType=contentType+' '+contentaction;

              let genericType=e.contentTypeAction;

              let createdOnNew = e.createdOn;
              let createdOnDate = moment.utc(createdOnNew).toDate();
              let localcreatedOnDate = moment(createdOnDate)
                .local()
                .format("h:mm A");
                if(push==1)
                {
                  this.systemActivityArr.push({
                    contentTypeName: genericType,
                    uid: e.id,
                    localcreatedOnDate: localcreatedOnDate,
                    bgColor: e.bgColor,
                    iconBgColor: e.contentTypeIconBgColor,
                    imageClass: e.contentTypeIconClass,
                    fontColor: e.fontColor,
                    activeClass:'active'

                  });
                  setTimeout(() => {
                    $('.activity-row-'+e.id).removeClass('active');
                    },6000);
                }
                else
                {
                  this.systemActivityArr.push({
                    contentTypeName: genericType,
                    uid: e.id,
                    localcreatedOnDate: localcreatedOnDate,
                    bgColor: e.bgColor,
                    iconBgColor: e.contentTypeIconBgColor,
                    imageClass: e.contentTypeIconClass,
                    fontColor: e.fontColor,
                    activeClass:'normal'
                  });
                }
              
              
            }
          }
          

        }
           

          }); 
  }

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
    else if (
      navigator.userAgent.search("Safari") >= 0 &&
      navigator.userAgent.search("Chrome") < 0
    ) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    } else {
      browserName = "others";
    }
    return browserName;
  }

 

}
