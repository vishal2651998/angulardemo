import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-open-thread-chart',
  templateUrl: './open-thread-chart.component.html',
  styleUrls: ['./open-thread-chart.component.scss']
})
export class OpenThreadChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;
  @Output() threadType: EventEmitter<any> = new EventEmitter();

  public chart: any;
  public gcData: any;

  constructor(private ngZone:NgZone) { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    this.gcData = new google.visualization.DataTable();

    this.gcData.addColumn('string', 'Thread Status');
    this.gcData.addColumn('number', 'Count');
    this.gcData.addColumn({type: 'string', role: 'tooltip'});

    for (let data of this.chartData) {
      let perValue = data.percentageValue;
      let CntValue = data.countValue;
      this.gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
      this.chartOptions['colors'].push(data.colorCode);
    }

    this.chart = new google.visualization.PieChart(document.getElementById('openThread'));
    google.visualization.events.addListener(
      this.chart, 'select', () => {
        this.ngZone.run(() => {
          this.selectHandler();
        });
      }
    );
    this.chart.draw(this.gcData, this.chartOptions);
  }

  public selectHandler() {
    var selectedItem = this.chart.getSelection()[0];
      if (selectedItem) {
        var tapping = this.gcData.getValue(selectedItem.row, 0);
        let threadInfo = [];
        let threadStatus;
        switch(tapping) {
          case 'Pending (no reply yet)':
            threadStatus = 'pending';
            break;
          case 'In-Progress (reply but no proposed Fix)':
            threadStatus = 'inProgress';
            break;
          case 'Proposed Fix (grey bulb)':
            threadStatus = 'propsedFix';
            break;
          case 'Fixed (yellow or green bulb)':
            threadStatus = 'fixed';
            break;
        }
        threadInfo.push('open',threadStatus,'chart');
        this.threadType.emit(threadInfo);
      }
  }

}
