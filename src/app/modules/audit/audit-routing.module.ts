import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditComponent } from './audit/audit.component';
import { IndexComponent } from './audit/index/index.component';
import { ViewComponent } from './audit/view/view.component';

const routes: Routes = [
  {path: '', component: AuditComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},  
    {path: 'view/:id', component: ViewComponent},
    {path: 'view/:id/:catgId', component: ViewComponent},
    {path: 'view/:id/:catgId/:parentId', component: ViewComponent},  
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
