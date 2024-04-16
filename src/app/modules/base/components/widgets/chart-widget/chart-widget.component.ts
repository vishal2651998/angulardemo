import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from '../../google-charts/types/chart-type';
import { ChartErrorEvent, ChartMouseLeaveEvent, ChartMouseOverEvent, ChartSelectionChangedEvent } from '../../google-charts/types/events';

@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent implements OnInit {
  @Input() widgetData: any;
  @Input() chartType: string;
  @Input() options: any;
  @Input() chartWidth: any =  "100%";
  title: any;
  chart: any;
  constructor() { }

  ngOnInit(): void {
    if (this.chartType == "ComboChart") {
      let chartArray: any[][] = [];
      let colorCodes: Array<any> = [];
      let lineColorCode: string;
      for (let i = 0; i < this.widgetData.length; i++) {
        let arraydt = [];
        colorCodes = [];
        arraydt.push(this.widgetData[i].value);
        this.widgetData[i].chartData.forEach(element => {
          arraydt.push(parseInt(element.countValue));
          colorCodes.push(element.colorCode);
          if (lineColorCode == undefined) {
            lineColorCode = element.lineColor;
          }
        });
        chartArray.push(arraydt);
      }
      this.options.colors = colorCodes;
      if (lineColorCode) {
        this.options.vAxis.gridlines = {
          color: lineColorCode
        };
        this.options.vAxis.minorGridlines = {
          color: lineColorCode
        };
        this.options.vAxis.baselineColor = lineColorCode
      }
      this.chart = {
        type: ChartType.ComboChart,
        columns: ['User Info', '3 in 30', '4 in 30', '5 in 30'],
        data: chartArray,
        options: this.options
        // options: {
        //   seriesType: 'bars',
        //   //isStacked: true, // dynamic
        //   backgroundColor: 'transparent',
        //  // height: 300, // dynamic
        //  // chartArea: { left: 100, top: 20, width: '88%', height: '55%' }, // dynamic
        //  chartArea: { left: 100, top: 20, width: '88%', height: '70%' }, // dynamic
        //   legend: { position: 'top', textStyle: { color: '#76859C', fontSize: 14, fontName: 'Roboto-Medium' }, alignment: 'end' },
        //   tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } },
        //   vAxis: {
        //     title: 'Counts',
        //     titleTextStyle: {
        //       color: '#FFF',
        //       fontSize: 12,
        //       fontName: 'Roboto-Medium',
        //       bold: false,
        //       italic: false
        //     },
        //     textStyle: { color: '#FFF' },
        //     gridlines: {
        //       color: "#76859C",
        //       count: 4
        //     },
        //   },
        //   hAxis: {
        //    // slantedText:true,slantedTextAngle:90, // dynamic
        //     textStyle: { color: '#9ea0a4', fontSize: 14  }
        //   },
        //   //height: 250,
        //   colors: ['#1b9e77', '#d95f02', '#7570b3']
        // }
      };

    } else if (this.chartType == "DonutChart") {
      let newData: Array<any> = [];
      let colorCodes: Array<any> = [];
      this.widgetData.chartData.forEach(element => {
        let newVal = { v: element.countValue, f: element.percentageValue + '%' };
        element.value = newVal;
        colorCodes.push(element.colorCode);
        delete element.colorCode;
        delete element.percentageValue;
        delete element.countValue;
        newData.push(element);
      });
      const mappedToArray = newData.map(d => Array.from(Object.values(d)));
      this.chart = {
        type: ChartType.PieChart,
        columns: ['Task', 'Hours per Day'],
        data: mappedToArray,
        options: {
          pieHole: 0.4,
          backgroundColor: 'transparent',
          chartArea: { width: '100%', height: '80%' },
          colors: colorCodes,
          legend: { position: 'right', textStyle: { color: '#76859C', fontSize: 12, fontName: 'Roboto-Medium' }, alignment: 'center' },
          pieSliceBorderColor: 'transparent',
          pieSliceText: 'value',
          pieSliceTextStyle: { fontSize: 12, fontName: 'Roboto-Medium' },
          tooltip: { text: 'value', textStyle: { color: '#FFFFFF' } }
        }
      };
    }

  }

  public onReady() {
    console.log('Chart ready');
  }

  public onError(error: ChartErrorEvent) {
    console.error('Error: ' + error.message.toString());
  }

  public onSelect(event: ChartSelectionChangedEvent) {
    console.log('Selected: ' + event.toString());
  }

  public onMouseEnter(event: ChartMouseOverEvent) {
    console.log('Hovering ' + event.toString());
  }

  public onMouseLeave(event: ChartMouseLeaveEvent) {
    console.log('No longer hovering ' + event.toString());
  }

}
