import { Component, OnInit } from '@angular/core';
declare let google: any;
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { pageInfo, Constant,PlatFormType,forumPageAccess } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-dash-summary-top',
  templateUrl: './dash-summary-top.component.html',
  styleUrls: ['./dash-summary-top.component.scss']
})
export class DashSummaryTopComponent implements OnInit {
  public apiData: any = [];
  public chartData: any;
  public chartOptions: any;
  public domainId;
  public userId;
  public roleId;
  public offSet="0";
  public limit="10";
  public locationandUsersData=[];
  public bardUsersData=[];
  public avgandUsersData=[];
  public apiKey: string = Constant.ApiKey;
  constructor(

    private authenticationService: AuthenticationService

  ) { }

  ngOnInit(): void {

    let user: any = this.authenticationService.userValue;
    if (user) {
        this.domainId = user.domain_id;
        this.userId = user.Userid;
        this.roleId = user.roleId;
       this.getdashInfo(1);
       this.getdashInfo(2);
       this.getdashInfo(8);
       google.charts.setOnLoadCallback(this.draw_Chart);
    }

     // this.drawChart();
  }

  getdashInfo(rowId)
  {
    google.charts.load('current', {packages: ['corechart']}); 
    this.apiData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      rowId: rowId,
    dataId: 0,
      platformId: 3,
  };
    let formData = new FormData;
    formData.set('apiKey', this.apiData.apiKey);
    formData.set('userId', this.apiData.userId);
    formData.set('domainId', this.apiData.domainId);
    formData.set('offset', this.offSet);
    formData.set('limit', this.limit);
    formData.set('rowId', rowId);
    this.authenticationService.apiGetDashboardUpdate(formData).subscribe((response) => {

      let dashboardData = response.items;
      if(rowId==2)
  {
      this.bardUsersData=[['Month', 'Support Request',{ role: 'style' }, { role: 'annotation' }]];
  }  

  if(dashboardData){  
    if(rowId!=8){
      for(let dashData of dashboardData)
      {
        

        
        let data_name= dashData.name;
        let data_count=  dashData.count;
        let data_color=  dashData.color;
        if(rowId==1)
        {
        this.locationandUsersData.push({data_name:data_name,data_count:data_count,data_color:data_color}) ;
  }
  if(rowId==2)
  {
    this.bardUsersData.push([data_name, data_count,'#8dd4ce',data_count]);
  }


      }     
      if(rowId==2)
      {
      let barChart=[];
    //  barChart.push(this.bardUsersData);

      console.log(this.bardUsersData);
      this.draw_Chart(this.bardUsersData);
      }
    }
    else{
      for(let dashData of dashboardData)
      {
        let data_name= dashData.name;
        let data_count=  dashData.count;
        let data_color=  dashData.imageClass;
        
        this.avgandUsersData.push({data_name:data_name,data_count:data_count,data_color:data_color}) ;
   
      }
    }  

  }

    });
  }
  draw_Chart(bardUsersData)
  {

    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    var data = google.visualization.arrayToDataTable(bardUsersData);
    /*var options = {
      title: '',
      tooltip: {textStyle: {color: '#FFFFFF'}},
      chartArea:{width:'100%', height:'100%'},
    };*/
    let options = {
      animation: { duration: 800, startup: true },
      bar: { groupWidth: "50%" },
      backgroundColor: 'transparent',
      chartArea:{ width:'80%', height:'90%'},
      colors: ["#d69e3d"],
      vAxis: {
        baselineColor: '#e2e2e2',
        gridlines: { color: '#f0f0f0' },
        minorGridlines: { color: '#f0f0f0' },
        textStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular'
        },
        title: '',
        titleTextStyle: {
          color: '#76859C', fontSize: 14, fontName: 'Roboto-Regular', italic: false
        }
      },
      hAxis: {
        textStyle: { color: '#76859C' }
      },
      legend: { position: "none" },
      seriesType: 'bars',
      //series: {1: {type: 'line', color: escMetrics[0].lineColor}},
      //curveType: 'function',
      tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
      width: '100%',
      height: '100%'
    };

    var chart = new google.visualization.ColumnChart(
      document.getElementById('chart_div'));
          chart.draw(data, options);
  }
  
  )}
  
  

}
