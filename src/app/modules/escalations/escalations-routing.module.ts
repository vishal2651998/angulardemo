import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscalationsComponent } from './components/escalations/escalations.component';
import { IndexComponent } from './components/escalations/index/index.component';

const routes: Routes = [
  {
    path: '', component: EscalationsComponent, children: [
      {path: '', component: IndexComponent},
      {path: 'index', component: IndexComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscalationsRoutingModule { }
