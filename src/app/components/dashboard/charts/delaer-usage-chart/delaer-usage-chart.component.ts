import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-delaer-usage-chart',
  templateUrl: './delaer-usage-chart.component.html',
  styleUrls: ['./delaer-usage-chart.component.scss']
})
export class DelaerUsageChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  public navUrl = "mis/dashboard/dealer-usage";

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Dealer Usage');
    gcData.addColumn('number', 'Mins');
    gcData.addColumn({type: 'string', role: 'tooltip'});

    for (let data of this.chartData) {
      let perValue = data.percentageValue;
      let CntValue = data.countValue;
      gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
    }

    let chart = new google.visualization.PieChart(document.getElementById('donutChart'));
    function selectHandler() {
      var selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        var tapping = gcData.getValue(selectedItem.row, 0);
        //let dealerStatus = (tapping == 'Did not login') ? "" : tapping;
        let dealerStatus = tapping;
        localStorage.setItem('selectedDealerStatus', dealerStatus);
        localStorage.setItem('navFrom', 'summary');
      }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(gcData, this.chartOptions);
  }

}
