import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkstreamsComponent } from '../../components/workstreams/workstreams/workstreams.component';
import { IndexComponent } from '../../components/workstreams/index/index.component';
import { NewComponent } from '../../components/workstreams/new/new.component';
import { EditComponent } from '../../components/workstreams/edit/edit.component';
import { ViewComponent } from '../../components/workstreams/view/view.component';

const routes: Routes = [
  {path: '', component: WorkstreamsComponent, children: [
    {path: '', component: NewComponent},
    {path: 'new', component: NewComponent},
    {path: 'view/:wid', component: ViewComponent},
    {path: 'edit/:wid', component: EditComponent},
    {path: '', redirectTo: 'workstreams', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkstreamsRoutingModule { }
