import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-area-activity-chart',
  templateUrl: './area-activity-chart.component.html',
  styleUrls: ['./area-activity-chart.component.scss']
})
export class AreaActivityChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Area');
    gcData.addColumn('number', 'Total Views');
    gcData.addColumn({type: 'string', role: 'tooltip'});

    for (let data of this.chartData) {
      let area = data.area;
      let views = parseInt(data.total_count);
      gcData.addRow([area, views, 'Area: '+area+'\nViews: '+views]);
      this.chartOptions['colors'].push(data.color_codes);
    }

    let chart = new google.visualization.PieChart(document.getElementById('pieChart'));
    chart.draw(gcData, this.chartOptions);
  }

}
