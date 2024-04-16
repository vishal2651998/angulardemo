import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InspectionComponent } from './inspection/inspection.component';
import { IndexComponent } from './inspection/index/index.component';

const routes: Routes = [
  {path: '', component: InspectionComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: ':viewId/:auditId/:shopId', component: IndexComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
