import { Component, OnInit, Input } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-escalation-zones',
  templateUrl: './escalation-zones.component.html',
  styleUrls: ['./escalation-zones.component.scss']
})
export class EscalationZonesComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();
    let columnLen = this.chartData[0].escalation.length+1;

    for (let c=0; c<columnLen; c++) {
      if(c < 1) {
        gcData.addColumn('string', 'Escalation Level');
      } else {
        gcData.addColumn('number', 'Count');
        gcData.addColumn({type: 'string', role: 'tooltip'});
      }
    }

    for (let data of this.chartData) {
      let colData = [];
      let name = data.name;
      colData.push(name);
      for (let esc of data.escalation) {
        this.chartOptions['colors'].push(esc.colorCode);
        colData.push(esc.count);
        colData.push(name+'\n'+esc.escLevel+': '+esc.count);
      }
      gcData.addRow(colData);
    }

    let chart = new google.visualization.ColumnChart(document.getElementById('zoneChart'));
    chart.draw(gcData, this.chartOptions);
  }

}
