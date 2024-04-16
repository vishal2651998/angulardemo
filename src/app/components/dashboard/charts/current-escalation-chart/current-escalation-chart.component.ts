import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-current-escalation-chart',
  templateUrl: './current-escalation-chart.component.html',
  styleUrls: ['./current-escalation-chart.component.scss']
})
export class CurrentEscalationChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Escalation Level');
    gcData.addColumn('number', 'Count');

    for (let data of this.chartData) {
      let value = parseInt(data.countValue);
      gcData.addRow([data.title, value]);
    }

    let chart = new google.visualization.ComboChart(document.getElementById('comboChart'));
    chart.draw(gcData, this.chartOptions);
  }

}
