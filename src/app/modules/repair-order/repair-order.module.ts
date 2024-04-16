import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RepairOrderRoutingModule } from './repair-order-routing.module';
import { RepairOrderComponent } from './repair-order/repair-order.component';
import { IndexComponent } from './repair-order/index/index.component';
import { ScheduleServiceComponent } from './repair-order/schedule-service/schedule-service.component';
import { SidebarModule } from "primeng/sidebar";
import { ViewComponent } from './repair-order/view/view.component';
import { JobsRatecardComponent } from './repair-order/jobs-ratecard/jobs-ratecard.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    RepairOrderComponent,
    IndexComponent,
    ScheduleServiceComponent,
    ViewComponent,
    JobsRatecardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RepairOrderRoutingModule,
    SidebarModule,
    MatMenuModule,
    TableModule,
    DropdownModule,
    MultiSelectModule
  ]
})
export class RepairOrderModule { }
