import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-gts-usage-problem-chart',
  templateUrl: './gts-usage-problem-chart.component.html',
  styleUrls: ['./gts-usage-problem-chart.component.scss']
})
export class GtsUsageProblemChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Problem Type');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string',  role: "style" });
    gcData.addColumn({type: 'string',  role: "annotation" });

    let i = 1;
    for (let data of this.chartData) {
      let title = data.title;
      let value = parseInt(data.countValue);
      let color = data.colorCode;
      gcData.addRow([title, value, color, title]);
      i++;
    }

    let chart = new google.visualization.BarChart(document.getElementById('gtsPblmTypeChart'));
    chart.draw(gcData, this.chartOptions);
  }

}
