import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkstreamPageComponent } from './workstream-page/workstream-page.component';
import { IndexComponent } from './workstream-page/index/index.component';
const routes: Routes = [
  {path: '', component: WorkstreamPageComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
   // {path: 'inactive', component: InactiveComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkstreamsLandingRoutingModule { }
