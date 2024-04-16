import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-active-users-chart',
  templateUrl: './active-users-chart.component.html',
  styleUrls: ['./active-users-chart.component.scss']
})
export class ActiveUsersChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['gauge']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let activeUsers = parseInt(this.chartData.active);
    let gcData = new google.visualization.DataTable();
    
    gcData.addColumn('string', 'Active Users');
    gcData.addColumn('number', 'Count');
    gcData.addRow(['', 0]);

    let chart = new google.visualization.Gauge(document.getElementById('guageChart'));

    function resetTableStyle(){
      var myDiv = document.getElementById('guageChart');
      var myTable = myDiv.getElementsByTagName('table')[0];
      myTable.style.margin = 'auto';
      myTable.style.verticalAlign = "middle";
    }

    google.visualization.events.addListener(chart, 'ready', resetTableStyle);
    chart.draw(gcData, this.chartOptions);

    setTimeout(() => {
      gcData.setValue(0, 1, activeUsers);
      chart.draw(gcData, this.chartOptions);
    }, 200);
    
  }

}
