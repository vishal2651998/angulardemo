import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchComponent } from './dispatch/dispatch.component';
import { IndexComponent } from './dispatch/index/index.component';

const routes: Routes = [
  {path: '', component: DispatchComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: ':id', component: IndexComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }
