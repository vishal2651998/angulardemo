import { Component, OnInit, NgZone } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { Router } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-my-tickets-widgets',
  templateUrl: './my-tickets-widgets.component.html',
  styleUrls: ['./my-tickets-widgets.component.scss']
})
export class MyTicketsWidgetsComponent implements OnInit {

  public expandplus;
  public expandminus;
  public optionsval;
  public expandminus1;
  public domainId;
  public roleId;
  public userId;
  public countryId;
  public apiData: Object;
  public seemore:boolean=false;
  public user: any;
  public selectedGroupOptions = [];
  public selectedGroup = "";
  public teamId: string = '';
  myTicketsStatus=[];
  public loading: boolean = false;
  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private ngZone:NgZone,
    private authenticationService: AuthenticationService,
    private router: Router,
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
    this.loadTeams();

   var landingpage_attr1=localStorage.getItem('landingpage_attr21');
   this.optionsval=JSON.parse(landingpage_attr1);
   console.log(this.optionsval);
  }
  loadTeams(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    this.LandingpagewidgetsAPI.apiTechSupportMenusAPI(apiFormData).subscribe((response) => {
      //if (response.status == "Success") {
        console.log(response);
        this.selectedGroupOptions = [];
        this.selectedGroupOptions = response.teamList;
        let teamList = [];
        teamList = response.teamList;
        for (let i in teamList) {
          if(teamList[i].isDefault == "1"){
            this.teamId = teamList[i].id;
            this.selectedGroup = teamList[i];
          }
        }
        this.loadStatus();
    });
  }
  loadStatus(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("typeId", "21");
    apiFormData.append("teamId", this.teamId);
    this.LandingpagewidgetsAPI.techSupportWidgetsAPI(apiFormData).subscribe((response) => {
      //if (response.status == "Success") {
        console.log(response);
          this.myTicketsStatus = [];
          let myTickets = response.myTickets;
          for (let t = 0; t < myTickets.length; t++) {
            let id = myTickets[t].id;
            let name = myTickets[t].name;
            let l1count = myTickets[t].options[0]['count'] > 0 ? myTickets[t].options[0]['count'] : '-' ;
            let l2count = myTickets[t].options[1]['count'] > 0 ? myTickets[t].options[1]['count'] : '-' ;
            let l3count = myTickets[t].options[2]['count'] > 0 ? myTickets[t].options[2]['count'] : '-' ;
            this.myTicketsStatus.push({
              id: id,
              name: name,
              l1: l1count,
              l2: l2count,
              l3: l3count,
            });
          }
      //}
        this.loading = false;
    });
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
  selectEvent(event)
  {
    console.log(event)
    console.log(this.selectedGroup)
    this.teamId = event.value.id;
    this.loadStatus();
  }
  clickTicketTD(id,level){
    let data:any;
    data = {
      type: 'status',
      statusId: id,
      teamId: this.teamId,
      memberId: '',
      level: level
    }
    localStorage.setItem('landing-techsupport',JSON.stringify(data));
    let url = "techsupport";
    setTimeout(() => {
      window.open(url,url);
    }, 100);
  }
}
