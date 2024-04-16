import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule } from './components/google-charts/google-charts.module';
import { NewDashboardComponent } from './components/new-dashboard/new-dashboard.component';
import { CountWidgetComponent } from './components/widgets/count-widget/count-widget.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { ChartWidgetComponent } from './components/widgets/chart-widget/chart-widget.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    NewDashboardComponent, 
    CountWidgetComponent, 
    ChartWidgetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    GoogleChartsModule.forRoot(),
    GridsterModule,
    DynamicModule
  ]
})
export class BaseModule { }
