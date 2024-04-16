import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from 'primeng/dragdrop';

import { StandardReportRoutingModule } from './standard-report-routing.module';
import { StandardReportComponent } from './standard-report/standard-report.component';
import { IndexComponent } from './standard-report/index/index.component';


@NgModule({
  declarations: [
    StandardReportComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    StandardReportRoutingModule
  ]
})
export class StandardReportModule { }
