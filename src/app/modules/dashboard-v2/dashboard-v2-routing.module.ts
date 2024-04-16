import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { SupportRequestComponent } from './dashboard/support-request/support-request.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {path: '', component: SummaryComponent},   
    {path: 'summary', component: SummaryComponent},
    {path: 'support-request', component: SupportRequestComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardV2RoutingModule { }
