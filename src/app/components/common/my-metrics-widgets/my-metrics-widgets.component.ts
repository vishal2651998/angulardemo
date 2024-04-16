import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant, ManageTitle } from '../../../common/constant/constant';
declare var $:any;
declare let google: any;

@Component({
  selector: 'app-my-metrics-widgets',
  templateUrl: './my-metrics-widgets.component.html',
  styleUrls: ['./my-metrics-widgets.component.scss']
})
export class MyMetricsWidgetsComponent implements OnInit {
  @Input() chartData;
  @Output() threadType: EventEmitter<any> = new EventEmitter();
  public renderId=5;
  public expandplus;
  public expandminus;
  public optionsval;
  public expandminus1;
  public metricsseemore:boolean=false;
  public countryId;
  public domainId;
  public openThreadsData=[];
  public closedThreadsData=[];
  public mythreadsopencount=0;
  public mythreadsclosedcount=0;
  public myteamthreadsopencount=0;
  public myteamthreadsclosedcount=0;
  public loadingmythreadsopencount:boolean=false;
  public loadingmythreadsclosedcount:boolean=false;
  public loadingmyteamthreadsopencount:boolean=false;
  public loadingmyteamthreadsclosedcount:boolean=false;
  public roleId;
  public userId;
  public isTeamChart;
  public apiData: Object;
  public reportseemore:boolean=false;
  public reportArr=[];
  public chart: any;
  public gcData: any;
  public user: any;
  public metricsThreadText: string;

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private ngZone:NgZone,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService,

  ) { }


ngOnInit(): void {
  this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
    var setdata= JSON.parse(JSON.stringify(r));
    var checkpushtype=setdata.pushType;
    var checkmessageType=setdata.messageType;
    console.log('message received! ####', r);
    //alert(checkpushtype+'--'+checkmessageType);
    if(checkpushtype==1 && checkmessageType==1) {
      this.getMythreadReports();
      if(this.isTeamChart=='1') {
        this.getMyTeamthreadReports();
      }
    }
    //let jsonParseData= JSON.parse(r);
    //console.log(jsonParseData.data);
    // this._receivedMessages.push(r);
    //  this.landingannouncements=[];
    // this.loadingann=true;
    // this.getAnnouncementwidgets();
  });
  // google.charts.setOnLoadCallback(this.drawChartdonut2);
  //  google.charts.setOnLoadCallback(this.drawChartonce);
  //google.charts.setOnLoadCallback(this.drawChartonce());
  this.metricsseemore=false;
  this.user = this.authenticationService.userValue;
  this.domainId = this.user.domain_id;
  this.userId = this.user.Userid;
  this.roleId = this.user.roleId;
  this.countryId = localStorage.getItem('countryId');
  let industryType:any = localStorage.getItem('industryType');
  let platformId:any = localStorage.getItem('platformId');
  this.metricsThreadText = (industryType == 3 && this.domainId == 97) ? `${ManageTitle.feedback}s` : `${ManageTitle.thread}s`;
  this.metricsThreadText = (platformId=='3') ? `${ManageTitle.supportRequest}s` : this.metricsThreadText;
  if(this.domainId==71 && platformId=='1')
  {
    this.metricsThreadText=ManageTitle.supportServices
  }
  if( this.domainId==Constant.CollabticBoydDomainValue && platformId=='1')
  {
    this.metricsThreadText=ManageTitle.techHelp;
  }
  this.isTeamChart = localStorage.getItem('isTeamChart');
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
  }

  this.apiData = apiInfo;




  var landingpage_attr1=localStorage.getItem('landingpage_attr'+this.renderId+'');
  this.optionsval=JSON.parse(landingpage_attr1);
 this.getMythreadReports();
 if(this.isTeamChart=='1')
 {
  this.getMyTeamthreadReports();
 }




 // google.load("visualization", "1", {packages:["corechart"]});
//google.setOnLoadCallback(this.drawChart());
}


 drawChartdonut11() {

  //alert(this.domainId);
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'My Daily Activities',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart2'));
  chart.draw(data, options);
}


drawChartdonut2() {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'My Daily Activities',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}

drawChartdonut(closedThread) {



  //console.log(arrSales);
  //var figures = google.visualization.arrayToDataTable(arrSales)
  //var view = new google.visualization.DataView(figures);
}


getMythreadReports() {
  this.loadingmythreadsopencount=true;
  this.loadingmythreadsclosedcount=true;

  let chartOptions = {
    backgroundColor: 'transparent',
    colors: [],
    chartArea:{width:'100%', height:'80%'},
    legend: {position: 'right', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'left'},
    pieSliceBorderColor: 'transparent',
    pieSliceText: 'value',
    pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
    tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}}
  };
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('type', '1');
 // apiFormData.append('offset', this.apiData['offset']);
  this.LandingpagewidgetsAPI.getThreadCharts(apiFormData).subscribe((response) => {
    if(response.status == "Success") {
      let chart_detail_info=response.data;
     let total_data=chart_detail_info.total;
     let chartdetails_data=chart_detail_info.chartdetails;
     let openThreadsCount=chartdetails_data.openThreadsCount;
     let closedThreadsCount=chartdetails_data.closedThreadsCount;
     let openThreadsData=chartdetails_data.openThreads;
     this.mythreadsopencount=openThreadsCount;
     this.mythreadsclosedcount=closedThreadsCount;
     let closedThreadsData=chartdetails_data.closedThreads;
      if(openThreadsCount>0)
{


     //this.closedThreadsData=chartdetails_data.closedThreads;

     google.charts.load("current", {packages:["corechart"]});

     this.loadingmythreadsopencount=false;
     google.charts.setOnLoadCallback(function() {


      let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Thread Status');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string', role: 'tooltip'});

      var arrSales = [['UserName','Value']];    // Define an array and assign columns for the chart.

      // Loop through each data and populate the array.
      let chartOptions = {
        backgroundColor: 'transparent',
        colors: [],
        title: 'My threads - Open',
        pieHole: 0.4,
        titleTextStyle: {
          color: "#000",    // any HTML string color ('red', '#cc00cc')
          fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
          fontSize: 14, // 12, 18 whatever you want (don't specify px)
          bold: true,    // true or false
          italic: false   // true of false
      },
        chartArea:{width:'100%', height:'100%'},
        legend: {position: 'right', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'center'},
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'value',
        pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
        tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}}
      };
      for (let data of openThreadsData) {
        let perValue = data.percentageValue;
        let CntValue = data.countValue;
        gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
        chartOptions['colors'].push(data.colorCode);
      }

      var chart = new google.visualization.PieChart(document.getElementById('mydonutchartopen'));

      chart.draw(gcData, chartOptions);

   });
  }
  else
  {
    this.loadingmythreadsopencount=false;
    $('#mydonutchartopen').html('<div class="nothingtoshow" *ngIf="nosearchres"><div class="no-data-contaier"><div><img class="no-data-img-chart" src="assets/images/landing-page/my-threads-open.svg"></div><div class="no-data-text">Nothing to show</div></div></div>');
  }
  if(closedThreadsCount>0)
  {
    //alert(closedThreadsCount);
    google.charts.load("current", {packages:["corechart"]});
    this.loadingmythreadsclosedcount=false;
     google.charts.setOnLoadCallback(function() {


      let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Thread Status');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string', role: 'tooltip'});

      var arrSales = [['UserName','Value']];    // Define an array and assign columns for the chart.

      // Loop through each data and populate the array.
      let chartOptions = {
        backgroundColor: 'transparent',
        colors: [],
        title: 'My threads - Closed',
        pieHole: 0.4,
        titleTextStyle: {
          color: "#000",    // any HTML string color ('red', '#cc00cc')
          fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
          fontSize: 14, // 12, 18 whatever you want (don't specify px)
          bold: true,    // true or false
          italic: false   // true of false
      },
        chartArea:{width:'100%', height:'100%'},
        legend: {position: 'right', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'center'},
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'value',
        pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
        tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}}
      };
      for (let data of closedThreadsData) {
        let perValue = data.percentageValue;
        let CntValue = data.countValue;
        gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
        chartOptions['colors'].push(data.colorCode);
      }

      var chart = new google.visualization.PieChart(document.getElementById('mydonutchartclosed'));

      chart.draw(gcData, chartOptions);

   });

  }
  else
  {
    //alert(1);
    this.loadingmythreadsclosedcount=false;
   //alert(this.loadingmythreadsclosedcount);
    $('#mydonutchartclosed').html('<div class="nothingtoshow" *ngIf="nosearchres"><div class="no-data-contaier"><div><img class="no-data-img-chart" src="assets/images/landing-page/my-threads-closed.svg"></div><div class="no-data-text">Nothing to show</div></div></div>');
  }
     //google.charts.load('visualization',"1", {packages:["corechart"]});
     //google.charts.setOnLoadCallback(this.drawChartdonut(this.closedThreadsData));

    }
  });




}

getMyTeamthreadReports() {
  this.loadingmyteamthreadsopencount=true;
  this.loadingmyteamthreadsclosedcount=true;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('type', '2');
 // apiFormData.append('offset', this.apiData['offset']);
  this.LandingpagewidgetsAPI.getThreadCharts(apiFormData).subscribe((response) => {
    if(response.status == "Success") {
      let chart_detail_info=response.data;
     let total_data=chart_detail_info.total;
     let chartdetails_data=chart_detail_info.chartdetails;
     let openThreadsCount=chartdetails_data.openThreadsCount;
     let closedThreadsCount=chartdetails_data.closedThreadsCount;
     let openThreadsData=chartdetails_data.openThreads;

     //this.closedThreadsData=chartdetails_data.closedThreads;
     let closedThreadsData=chartdetails_data.closedThreads;
     this.myteamthreadsopencount=openThreadsCount;
     this.myteamthreadsclosedcount=closedThreadsCount;
     if(openThreadsCount)
     {
      this.loadingmyteamthreadsopencount=false;

     google.charts.load("current", {packages:["corechart"]});


     google.charts.setOnLoadCallback(function() {


      let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Thread Status');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string', role: 'tooltip'});

      var arrSales = [['UserName','Value']];    // Define an array and assign columns for the chart.

      // Loop through each data and populate the array.
      let chartOptions = {
        backgroundColor: 'transparent',
        colors: [],
        title: 'My team threads - open',
        pieHole: 0.4,
        titleTextStyle: {
          color: "#000",    // any HTML string color ('red', '#cc00cc')
          fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
          fontSize: 14, // 12, 18 whatever you want (don't specify px)
          bold: true,    // true or false
          italic: false   // true of false
      },
        chartArea:{width:'100%', height:'100%'},
        legend: {position: 'right', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'center'},
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'value',
        pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
        tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}}
      };
      for (let data of openThreadsData) {
        let perValue = data.percentageValue;
        let CntValue = data.countValue;
        gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
        chartOptions['colors'].push(data.colorCode);
      }

      var chart = new google.visualization.PieChart(document.getElementById('myTeamdonutchartopen'));

      chart.draw(gcData, chartOptions);
   });
  }
  else

  {
    this.loadingmyteamthreadsopencount=false;
    $('#myTeamdonutchartopen').html('<div class="nothingtoshow" *ngIf="nosearchres"><div class="no-data-contaier"><div><img class="no-data-img-teamchart" src="assets/images/landing-page/my-team-threads-openclosed.svg"></div><div class="no-data-text">Nothing to show</div></div></div>');
  }
  if(closedThreadsCount)
  {
    google.charts.load("current", {packages:["corechart"]});
    this.loadingmyteamthreadsclosedcount=false;
     google.charts.setOnLoadCallback(function() {


      let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Thread Status');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string', role: 'tooltip'});

      var arrSales = [['UserName','Value']];    // Define an array and assign columns for the chart.

      // Loop through each data and populate the array.
      let chartOptions = {
        backgroundColor: 'transparent',
        colors: [],
        title: 'My team threads - Closed',
        pieHole: 0.4,
        titleTextStyle: {
          color: "#000",    // any HTML string color ('red', '#cc00cc')
          fontName: 'Roboto-Medium', // i.e. 'Times New Roman'
          fontSize: 14, // 12, 18 whatever you want (don't specify px)
          bold: true,    // true or false
          italic: false   // true of false
      },
      animation:{
        duration: 4000,
        easing: 'inAndOut',
		startup: true
      },

	   annotations: {
       textStyle : { fontSize: 12, bold: true},
      },
        chartArea:{width:'100%', height:'100%'},
        legend: {position: 'right', textStyle: {color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium'}, alignment: 'center'},
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'value',
        pieSliceTextStyle: {fontSize: 12, fontName: 'Roboto-Medium'},
        tooltip: {text: 'value', textStyle: {color: '#FFFFFF'}}
      };
      for (let data of closedThreadsData) {
        let perValue = data.percentageValue;
        let CntValue = data.countValue;
        gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
        chartOptions['colors'].push(data.colorCode);
      }

      var chart = new google.visualization.PieChart(document.getElementById('myTeamdonutchartclosed'));

      chart.draw(gcData, chartOptions);
   });
  }
  else
{
  this.loadingmyteamthreadsclosedcount=false;
  $('#myTeamdonutchartclosed').html('<div class="nothingtoshow" *ngIf="nosearchres"><div class="no-data-contaier"><div><img class="no-data-img-teamchart" src="assets/images/landing-page/my-team-threads-openclosed.svg"></div><div class="no-data-text">Nothing to show</div></div></div>');
}
     //google.charts.load('visualization',"1", {packages:["corechart"]});
     //google.charts.setOnLoadCallback(this.drawChartdonut(this.closedThreadsData));

    }
  });




}


onTabClose5(event) {
  //alert(1);
      this.expandplus=event.index;
      $('.minusone'+this.renderId+''+this.expandplus+'').removeClass('hide');
      $('.minusone'+this.renderId+''+this.expandplus+'').addClass('showinline');
      $('.plusone'+this.renderId+''+this.expandplus+'').addClass('hide');
      $('.plusone'+this.renderId+''+this.expandplus+'').removeClass('showinline');


      //this.expandminusFlag=false;
      //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }

  onTabOpen5(event) {
    //alert(2);

    this.expandminus=event.index;
    $('.minusone'+this.renderId+''+this.expandminus+'').addClass('hide');
    $('.minusone'+this.renderId+''+this.expandminus+'').removeClass('showinline');
    $('.plusone'+this.renderId+''+this.expandminus+'').removeClass('hide');
    $('.plusone'+this.renderId+''+this.expandminus+'').addClass('showinline');
    this.expandplus=2222;


     // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }
}
