import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DtcComponent } from './components/dtc/dtc.component';
import { IndexComponent } from './components/dtc/index/index/index.component';

const routes: Routes = [{
  path:'', component:DtcComponent, children: [
    {path: '', component: IndexComponent},
    {path: 'index', component: IndexComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DtcRoutingModule { }
