import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-gts-usage-status-chart',
  templateUrl: './gts-usage-status-chart.component.html',
  styleUrls: ['./gts-usage-status-chart.component.scss']
})
export class GtsUsageStatusChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Status');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string',  role: "style" });
    gcData.addColumn({type: 'number',  role: "annotation" });

    let i = 1;
    for (let data of this.chartData) {
      let indexData = "L"+i;
      let title = data.title;
      let value = data.countValue;
      let color = data.colorCode;
      gcData.addRow([title, value, color, value]);
      i++;
    }

    let chart = new google.visualization.ColumnChart(document.getElementById('gtsStatusChart'));
    chart.draw(gcData, this.chartOptions);
  }

}
