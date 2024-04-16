import { Component, OnInit, NgZone } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
declare var $:any;

@Component({
  selector: 'app-team-support-request-widgets',
  templateUrl: './team-support-request-widgets.component.html',
  styleUrls: ['./team-support-request-widgets.component.scss']
})
export class TeamSupportRequestWidgetsComponent implements OnInit {

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
  public loading: boolean = false;
  public assignedArray: any;
  public unAssignedArray: any;
  public pTableHeight = '280px';
  first = 0;
  rows = 4;
  public paginations:boolean=false;
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
    this.loadStatus();
    var landingpage_attr1=localStorage.getItem('landingpage_attr22');
    this.optionsval=JSON.parse(landingpage_attr1);
    console.log(this.optionsval);
  }
  loadStatus(){
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey,);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("typeId", "22");
    this.LandingpagewidgetsAPI.techSupportWidgetsAPI(apiFormData).subscribe((response) => {
      //if (response.status == "Success") {
        console.log(response);
          this.assignedArray = [];
          this.unAssignedArray = [];
          let techSupportReqest = response.techSupportReqest;
          console.log(techSupportReqest);
          if(techSupportReqest && techSupportReqest.length>4)
          {
this.paginations=true;
          }
          else
          {
            this.pTableHeight='280px';
            this.paginations=false;
          }
          for (let t = 0; t < techSupportReqest.length; t++) {
            let id = techSupportReqest[t].id;
            let name = techSupportReqest[t].name;
            let l1count = techSupportReqest[t].assigned[0]['count'] > 0 ? techSupportReqest[t].assigned[0]['count'] : '-' ;
            let l2count = techSupportReqest[t].assigned[1]['count'] > 0 ? techSupportReqest[t].assigned[1]['count'] : '-' ;
            let l3count = techSupportReqest[t].assigned[2]['count'] > 0 ? techSupportReqest[t].assigned[2]['count'] : '-' ;
            this.assignedArray.push({
              teamid: id,
              teamname: name,
              l1: l1count,
              l2: l2count,
              l3: l3count,
            });

            let uid = techSupportReqest[t].id;
            let uname = techSupportReqest[t].name;
            let countValue = techSupportReqest[t].unAssigned > 0 ? techSupportReqest[t].unAssigned : '-' ;
            this.unAssignedArray.push({
              teamid: uid,
              teamname: uname,
              count: countValue
            });
          }
      //}
        this.loading = false;
    });
  }
  clickTicketTD(id,typeId,level){
    console.log(id,typeId,level)
    if(typeId == '2'){
      typeId = '10';
    }
    let data:any;
    data = {
      type: 'status',
      statusId: typeId,
      teamId: id,
      memberId: '',
      level: level
    }
    localStorage.setItem('landing-techsupport',JSON.stringify(data));
    let url = "techsupport";
    setTimeout(() => {
      window.open(url,url);
    }, 100);
  }
  onTabClose6(event) {
    this.expandplus=event.index;
    $('.minusone6'+this.expandplus+'').removeClass('hide');
    $('.minusone6'+this.expandplus+'').addClass('showinline');
    $('.plusone6'+this.expandplus+'').addClass('hide');
    $('.plusone6'+this.expandplus+'').removeClass('showinline');
    //this.expandminusFlag=false;
    //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }
  onTabOpen6(event) {
    this.expandminus=event.index;
    $('.minusone6'+this.expandminus+'').addClass('hide');
    $('.minusone6'+this.expandminus+'').removeClass('showinline');
    $('.plusone6'+this.expandminus+'').removeClass('hide');
    $('.plusone6'+this.expandminus+'').addClass('showinline');
    this.expandplus=2222;
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
    return this.unAssignedArray ? this.first === (this.unAssignedArray.length - this.rows): true;
}

isFirstPage(): boolean {
    return this.unAssignedArray ? this.first === 0 : true;
}
}

