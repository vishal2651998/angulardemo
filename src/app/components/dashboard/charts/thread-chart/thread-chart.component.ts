import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-thread-chart',
  templateUrl: './thread-chart.component.html',
  styleUrls: ['./thread-chart.component.scss']
})
export class ThreadChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Thread Status');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string', role: 'tooltip'});

    for (let data of this.chartData) {
      let perValue = data.percentageValue;
      let CntValue = data.countValue;
      gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
      this.chartOptions['colors'].push(data.colorCode);
    }

    let chart = new google.visualization.PieChart(document.getElementById('pieChart'));
    function selectHandler() {
      var selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        var tapping = gcData.getValue(selectedItem.row, 0);
        localStorage.setItem('threadType', tapping);
        localStorage.setItem('navFrom', 'summary')
        //location.href = "mis/dashboard/threads";
      }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(gcData, this.chartOptions);
  }

}
