import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepairOrderComponent } from './repair-order/repair-order.component';
import { IndexComponent } from './repair-order/index/index.component';
import { ScheduleServiceComponent } from './repair-order/schedule-service/schedule-service.component';
import { ViewComponent } from './repair-order/view/view.component';
import { JobsRatecardComponent } from './repair-order/jobs-ratecard/jobs-ratecard.component';
import { AuthGuard } from "../../components/_helpers/auth.guard";

const routes: Routes = [
  {path: '', component: RepairOrderComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'schedule-service', component: ScheduleServiceComponent},
    {path: 'view/:id', component: ViewComponent, canActivate: [AuthGuard]}, 
    {path: 'jobs-ratecard', component: JobsRatecardComponent, canActivate: [AuthGuard]}, 
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepairOrderRoutingModule { }
