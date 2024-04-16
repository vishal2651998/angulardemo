import { Component, OnInit, Input } from '@angular/core';
 //added by karuna
import { Router} from '@angular/router';
import { NavigationEnd } from '@angular/router';
declare let google: any;

@Component({
  selector: 'app-content-type-chart',
  templateUrl: './content-type-chart.component.html',
  styleUrls: ['./content-type-chart.component.scss']
})
export class ContentTypeChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;

  constructor(public router: Router) { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    let gcData = new google.visualization.DataTable();

    gcData.addColumn('string', 'Content Type');
    gcData.addColumn('number', 'Count');
    gcData.addColumn({type: 'string', role: 'tooltip'});

    for (let data of this.chartData) {
      let perValue = data.percentageValue;
      let CntValue = data.countValue;
      gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
      this.chartOptions['colors'].push(data.colorCode);
    }

    let chart = new google.visualization.PieChart(document.getElementById('contTypeChart'));
    function selectHandler(this) {
      var selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        var tapping = gcData.getValue(selectedItem.row, 0);
        if(tapping == 'Service advisor') {
          localStorage.setItem('navFrom', 'summary');
          localStorage.setItem('accessFrom', 'dashboard');
          //added by karuna
          this.router.navigate(['mis/dashboard/service-probing'])
          .then(() => {
           window.location.reload();
          });

         // location.href = "mis/dashboard/service-probing";
        }
      }
    }

     // google.visualization.events.addListener(chart, 'select', selectHandler);
     //added by karuna
    google.visualization.events.addListener(chart, 'select', selectHandler.bind(this));
    chart.draw(gcData, this.chartOptions);
  }

}
