import { Component, OnInit, NgZone } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
declare var $:any;
@Component({
  selector: 'app-landing-report-widgts',
  templateUrl: './landing-report-widgts.component.html',
  styleUrls: ['./landing-report-widgts.component.scss']
})
export class LandingReportWidgtsComponent implements OnInit {

  public expandplus;
  public expandminus;
  public optionsval;
  public expandminus1;
  public domainId;
  public roleId;
  public userId;
  public countryId;
  public threadreportvl:boolean=false;
  public exportreportvl:boolean=false;
  public manageusersvl:boolean=false;
  public useractivityvl:boolean=false;


  public apiData: Object;




  public reportseemore:boolean=false;
  public reportArr=[];
  public user: any;

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private ngZone:NgZone,
    private authenticationService: AuthenticationService,

  ) { }

  ngOnInit(): void {

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId
    }


    this.apiData = apiInfo;
    let report_data_loaded=[];



   //console.log(report_data_loaded);
    this.apiData = apiInfo;
    if(this.roleId== '3' || this.roleId== '10')
    {
      this.threadreportvl=true;
      this.exportreportvl=true;
      this.manageusersvl=true;
      this.useractivityvl=true;
    }
    else
    {
      this.threadreportvl=true;
    }
   /*
    this.reportArr=
    [
      {id:1,name:'Thread Reports',imgClass:'thread-report',imgUrl:'assets/images/landing-page/thread-export-report.svg',access:this.threadreportvl},
      {id:2,name:'Export Reports',imgClass:'export-report',imgUrl:'assets/images/landing-page/export-thread-report.svg',access:this.exportreportvl},
      {id:3,name:'Manage  Users',imgClass:'manage-user-report',imgUrl:'assets/images/landing-page/manager-users-report.svg',access:this.manageusersvl},
      {id:5,name:'User Actvity',imgClass:'user-activity',imgUrl:'assets/images/landing-page/user-activity-report.svg',access:this.useractivityvl},
    ];
    */
   var landingpage_attr1=localStorage.getItem('landingpage_attr6');
   this.optionsval=JSON.parse(landingpage_attr1);
   const apiFormData = new FormData();
   apiFormData.append('apiKey', this.apiData['apiKey']);
   apiFormData.append('domainId', this.apiData['domainId']);
   apiFormData.append('countryId', this.apiData['countryId']);
   apiFormData.append('userId', this.apiData['userId']);
   this.LandingpagewidgetsAPI.getReportsAttr(apiFormData).subscribe((response) => {
    report_data_loaded=response.reportsMenu;
    if(report_data_loaded.length>0)
   {
     for (let rp=0;rp<report_data_loaded.length;rp++)
     {
       let rpdata=report_data_loaded[rp];
       this.reportArr.push({id:rpdata.id,name:rpdata.name,imgClass:rpdata.imgClass,imgUrl:'assets/images/landing-page/'+rpdata.imgUrl+'',access:rpdata.access});
     }
   }



    console.log(this.optionsval);
    //this.getMythreadReports(1);

});

  }


  reportClick(event,typeId,reportAccess)
  {
    let url = '';
    typeId = parseInt(typeId);
    if(reportAccess) {
      switch (typeId) {
        case 1:
          url = '/threadreport2';
          break;
        case 2:
          url = 'export-option';
          break;
        case 3:
          url = 'user-dashboard';
          break;
        case 5:
          url = 'useractivity_one';
          break;
        case 6:
          url = 'product-matrix';
          break;
        case 7:
          url = '/leaderboard';
          break;
        case 8:
          url = 'ppfr';
          break;
        case 9:
          url = '/mis/dashboard';
          break;
        case 10:
          url = 'escalation-management/escalation-matrix';
          break;
        case 11:
          url = 'dtc';
          break;
        case 12:
          url = 'shops';
          break;
      }
      window.open(url, '_blank');
    }

  }


  onTabClose6(event) {
    //alert(1);
        this.expandplus=event.index;
        $('.minusone6'+this.expandplus+'').removeClass('hide');
        $('.minusone6'+this.expandplus+'').addClass('showinline');
        $('.plusone6'+this.expandplus+'').addClass('hide');
        $('.plusone6'+this.expandplus+'').removeClass('showinline');


        //this.expandminusFlag=false;
        //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
    }

    onTabOpen6(event) {
      //alert(2);

      this.expandminus=event.index;
      $('.minusone6'+this.expandminus+'').addClass('hide');
      $('.minusone6'+this.expandminus+'').removeClass('showinline');
      $('.plusone6'+this.expandminus+'').removeClass('hide');
      $('.plusone6'+this.expandminus+'').addClass('showinline');
      this.expandplus=2222;


       // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
    }

}
