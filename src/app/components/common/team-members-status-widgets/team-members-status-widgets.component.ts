import { Component, OnInit, NgZone } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
declare var $:any;
@Component({
  selector: 'app-team-members-status-widgets',
  templateUrl: './team-members-status-widgets.component.html',
  styleUrls: ['./team-members-status-widgets.component.scss']
})
export class TeamMembersStatusWidgetsComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
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
  public paginations:boolean=false;
  public teamId: string = "";
  memberStatus=[];
  public loading: boolean = false;
  public pTableHeight = '280px';
  first = 0;
  rows = 4;
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
    this.loadTeams();
    //this.loadStatus();
   var landingpage_attr1=localStorage.getItem('landingpage_attr23');
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
next() {
    this.first = this.first + this.rows;
}

prev() {
    this.first = this.first - this.rows;
}

reset() {
    this.first = 0;
}

isLastPage(): boolean {
    return this.memberStatus ? this.first === (this.memberStatus.length - this.rows): true;
}

isFirstPage(): boolean {
    return this.memberStatus ? this.first === 0 : true;
}
  loadStatus(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("typeId", "23");
    apiFormData.append("teamId", this.teamId);
    this.LandingpagewidgetsAPI.techSupportWidgetsAPI(apiFormData).subscribe((response) => {
      //if (response.status == "Success") {
        console.log(response);
          this.memberStatus = [];
          let techSupportTeamMembers = response.techSupportTeamMembers;
          if(techSupportTeamMembers && techSupportTeamMembers.length>4)
          {
this.paginations=true;
          }
          else
          {
            this.pTableHeight='280px';
            this.paginations=false;
          }

          for (let t = 0; t < techSupportTeamMembers.length; t++) {
            let id = techSupportTeamMembers[t].userId;
            let name = techSupportTeamMembers[t].userName;
            let availability = techSupportTeamMembers[t].availability;
            let supportReadiness = techSupportTeamMembers[t].supportReadiness;
            let availabilityText = '';
            let supportReadinessText = '';
            switch(availability){
              case 1:
                availabilityText = 'Online';
                break;
              case 0:
                availabilityText = 'Offline';
                break;
              case 2:
                availabilityText = 'Idle';
                break;
              default:
                break;
            }
            switch(supportReadiness){
              case 1:
                supportReadinessText = 'Available';
                break;
              case 0:
                supportReadinessText = 'Unavailable';
                break;
              case 2:
                supportReadinessText = 'Vocation';
                break;
              default:
                break;
            }
            let profileImg = techSupportTeamMembers[t].profileImg;
            let title = techSupportTeamMembers[t].title;
            this.memberStatus.push({
              id: id,
              name: name,
              availability: availability,
              availabilityText: availabilityText,
              profileImg: profileImg,
              title: title,
              supportReadiness: supportReadiness,
              supportReadinessText: supportReadinessText
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
      this.teamId = event.value.id;
      this.loadStatus();
  }
  clickTicketTD(id){
    let data:any;
    data = {
      type: 'member',
      statusId: '',
      teamId: this.teamId,
      memberId: id,
      level: ''
    }
    localStorage.setItem('landing-techsupport',JSON.stringify(data));
    let url = "techsupport";
    setTimeout(() => {
      window.open(url,url);
    }, 100);

  }

}
