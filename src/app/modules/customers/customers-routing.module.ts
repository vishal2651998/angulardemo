import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomersComponent } from './customers/customers.component';
import { IndexComponent } from './customers/index/index.component';

const routes: Routes = [
  {path: '', component: CustomersComponent, children: [
    {path: '', component: IndexComponent},
    {path: ':shopId', component: IndexComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
