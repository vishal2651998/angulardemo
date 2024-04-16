import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { pageInfo, Constant,PlatFormType,forumPageAccess } from 'src/app/common/constant/constant';
@Component({
  selector: 'app-dash-summary-center',
  templateUrl: './dash-summary-center.component.html',
  styleUrls: ['./dash-summary-center.component.scss']
})
export class DashSummaryCenterComponent implements OnInit {
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
  public apiKey: string = Constant.ApiKey;
  constructor( private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

    let user: any = this.authenticationService.userValue;
    if (user) {
        this.domainId = user.domain_id;
        this.userId = user.Userid;
        this.roleId = user.roleId;
       this.getdashInfo(3);
       this.getdashInfo(4);
       this.getdashInfo(5);
       this.getdashInfo(6);
       this.getdashInfo(7);
       this.getdashInfo(9);
    }


  }
  getdashInfo(rowId)
  {
    let bardUsersData=[];
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
     
    bardUsersData=[['Title', 'Support Requests',{ role: 'style' }, { role: 'annotation' },{type: 'string', role: 'tooltip'}]];
 
if(dashboardData)
{for(let dashData of dashboardData)
      {
       

       
       let data_name= dashData.name;
       let data_count=  dashData.count;
       let data_color=  dashData.color;
      
 
       bardUsersData.push([data_name, data_count,data_color,data_count,data_count]);


  
      }

     
      if(rowId==3)
      {
    
      this.drawChartOpen(bardUsersData);
      }

      if(rowId==4)
      {
    
      this.drawChartClose(bardUsersData);
      }

      if(rowId==5)
      {
    
      this.drawChartBusinessRole(bardUsersData);
      }

      if(rowId==6)
      {
    
      this.drawChartCategory(bardUsersData);
      }

      if(rowId==7)
      {
    
      this.drawChartMake(bardUsersData);
      }

      if(rowId==9)
      {
    
      this.drawChartScanTool(bardUsersData);
      }
      
            
    }

    });
  }
  drawChartOpen(bardUsersData){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    
      var data = google.visualization.arrayToDataTable(bardUsersData);
      let options:any;
      options = {
      backgroundColor: 'transparent',
      title: 'Open Support Request',
      pieHole: 0.5,
      titleTextStyle: {
        color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
        fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
        fontSize: 14, // 12, 18 whatever you want (don't specify px)
        bold: false,    // true or false
        italic: false,   // true of false
        alignment: 'center'
      },
      chartArea:{ bottom:0, left:15, width:'90%', height:'85%'},
      legend: {position: 'right', textStyle: {color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium'}, alignment: 'center'},
      pieSliceBorderColor: 'transparent',
      pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
      tooltip: {textStyle: {color: '#FFFFFF'}},
      };

      var chart = new google.visualization.PieChart(document.getElementById('chart_open'));
      chart.draw(data, options);

    }

    )}


  drawChartClose(bardUsersData){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    
      var data = google.visualization.arrayToDataTable(bardUsersData);
      let options:any;
        options = {
        backgroundColor: 'transparent',
        title: 'Closed Support Request',
        pieHole: 0.5,
        titleTextStyle: {
          color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
          fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
          fontSize: 14, // 12, 18 whatever you want (don't specify px)
          bold: false,    // true or false
          italic: false,   // true of false
          alignment: 'center'
        },
        chartArea:{ bottom:0, left:15, width:'90%', height:'85%'},
        legend: {position: 'right', textStyle: {color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium'}, alignment: 'center'},
        pieSliceBorderColor: 'transparent',
        pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
        tooltip: {textStyle: {color: '#FFFFFF'}},
      };

      var chart = new google.visualization.PieChart(document.getElementById('chart_close'));
      chart.draw(data, options);
    }
    
  )}

  drawChartBusinessRole(bardUsersData){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    
      var data = google.visualization.arrayToDataTable(bardUsersData);

      let options:any;
      options = {
      backgroundColor: 'transparent',
      title: '',
      pieHole: 0.5,
      titleTextStyle: {
        color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
        fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
        fontSize: 14, // 12, 18 whatever you want (don't specify px)
        bold: false,    // true or false
        italic: false,   // true of false
        alignment: 'center'
      },
      chartArea:{ bottom:0, left:15, width:'90%', height:'85%'},
      legend: {position: 'right', textStyle: {color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium'}, alignment: 'center'},
      pieSliceBorderColor: 'transparent',
      pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
      tooltip: {textStyle: {color: '#FFFFFF'}},
    };

      var chart = new google.visualization.PieChart(document.getElementById('chart_businessrole'));
      chart.draw(data, options);
    }
    
  )}

  drawChartCategory(bardUsersData){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    
      var data = google.visualization.arrayToDataTable(bardUsersData);

      let options:any;
      options = {
      backgroundColor: 'transparent',
      title: '',
      pieHole: 0.5,
      titleTextStyle: {
        color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
        fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
        fontSize: 14, // 12, 18 whatever you want (don't specify px)
        bold: false,    // true or false
        italic: false,   // true of false
        alignment: 'center'
      },
      chartArea:{ bottom:0, left:15, width:'90%', height:'85%'},
      legend: {position: 'right', textStyle: {color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium'}, alignment: 'center'},
      pieSliceBorderColor: 'transparent',
      pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
      tooltip: {textStyle: {color: '#FFFFFF'}},
    };

      var chart = new google.visualization.PieChart(document.getElementById('chart_category'));
      chart.draw(data, options);
    }
    
  )}

  drawChartMake(bardUsersData){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    
      var data = google.visualization.arrayToDataTable(bardUsersData);

      let options:any;
      options = {
      backgroundColor: 'transparent',
      title: '',
      pieHole: 0.5,
      titleTextStyle: {
        color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
        fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
        fontSize: 14, // 12, 18 whatever you want (don't specify px)
        bold: false,    // true or false
        italic: false,   // true of false
        alignment: 'center'
      },
      chartArea:{ bottom:0, left:15, width:'90%', height:'85%'},
      legend: {position: 'right', textStyle: {color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium'}, alignment: 'center'},
      pieSliceBorderColor: 'transparent',
      pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
      tooltip: {textStyle: {color: '#FFFFFF'}},
    };

      var chart = new google.visualization.PieChart(document.getElementById('chart_make'));
      chart.draw(data, options);
    }
    
  )}


  drawChartScanTool(bardUsersData){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(function() {
    
      var data = google.visualization.arrayToDataTable(bardUsersData);

      let options:any;
      options = {
      backgroundColor: 'transparent',
      title: '',
      pieHole: 0.5,
      titleTextStyle: {
        color: "#5e646f",    // any HTML string color ('red', '#cc00cc')
        fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
        fontSize: 14, // 12, 18 whatever you want (don't specify px)
        bold: false,    // true or false
        italic: false,   // true of false
        alignment: 'center'
      },
      chartArea:{ bottom:0, left:15, width:'90%', height:'85%'},
      legend: {position: 'right', textStyle: {color: '#5e646f', fontSize: 13, fontName: 'Roboto-Medium'}, alignment: 'center'},
      pieSliceBorderColor: 'transparent',
      pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
      tooltip: {textStyle: {color: '#FFFFFF'}},
    };

      var chart = new google.visualization.PieChart(document.getElementById('chart_scantool'));
      chart.draw(data, options);
    }
    
  )}


}
