import { Component, OnInit, NgZone } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
declare var $:any;

@Component({
  selector: 'app-your-performance-stats-widgets',
  templateUrl: './your-performance-stats-widgets.component.html',
  styleUrls: ['./your-performance-stats-widgets.component.scss']
})
export class YourPerformanceStatsWidgetsComponent implements OnInit {

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

    this.apiData = apiInfo;
  
   var landingpage_attr1=localStorage.getItem('landingpage_attr24');
   this.optionsval=JSON.parse(landingpage_attr1);
 


   

    console.log(this.optionsval);


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
