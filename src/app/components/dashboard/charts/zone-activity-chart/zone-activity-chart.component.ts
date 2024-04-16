import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-zone-activity-chart',
  templateUrl: './zone-activity-chart.component.html',
  styleUrls: ['./zone-activity-chart.component.scss']
})
export class ZoneActivityChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Zone');
    gcData.addColumn('number', 'Total Views');
    gcData.addColumn({type: 'string', role: 'tooltip'});

    for (let data of this.chartData) {
      let zone = data.zone;
      let views = parseInt(data.total_count);
      gcData.addRow([zone, views, 'Zone: '+zone+'\nViews: '+views]);
      this.chartOptions['colors'].push(data.color_codes);
    }

    let chart = new google.visualization.PieChart(document.getElementById('pieChart'));
    chart.draw(gcData, this.chartOptions);
  }

}
