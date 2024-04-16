import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DashboardV2RoutingModule } from './dashboard-v2-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { SupportRequestComponent } from './dashboard/support-request/support-request.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SummaryComponent,
    SupportRequestComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardV2RoutingModule
  ]
})
export class DashboardV2Module { }
